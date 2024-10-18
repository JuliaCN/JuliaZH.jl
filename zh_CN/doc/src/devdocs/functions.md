# Julia 函数

本文档将解释函数、方法定义以及方法表是如何工作的。

## 方法表

Julia 中的每个函数都是泛型函数。泛型函数在概念上是单个函数，但由许多定义或方法组成。泛型函数的方法储存在方法表中。方法表（类型 `MethodTable`）与 `TypeName` 相关。`TypeName` 描述了一系列参数化类型。例如，`Complex{Float32}` 和 `Complex{Float64}` 共享相同的 type name 对象 `Complex`。

Julia 中的所有对象都可能是可调用的，因为每个对象都有类型，而类型又有 `TypeName`。

## [函数调用](@id Function-calls)

给定调用 `f(x,y)`，会执行以下步骤：首先，用 `typeof(f).name.mt` 访问要使用的方法表。其次，生成一个参数元组类型 `Tuple{typeof(f), typeof(x), typeof(y)}`。请注意，函数本身的类型是第一个元素。这因为该类型可能有参数，所以需要参与派发。这个元组类型会在方法表中查找。

这个派发过程由 `jl_apply_generic` 执行，它有两个参数：一个指向由值 f、x 和 y 组成的数组的指针，以及值的数量（此例中是 3）。

在整个系统中，处理函数和参数列表的 API 有两种：一种单独接收函数和参数，一种接收一个单独的参数结构。在第一种 API 中，「参数」部分*不*包含函数的相关信息，因为它是单独传递的。在第二种 API 中，函数是参数结构的第一个元素。

例如，以下用于执行调用的函数只接收 `args` 指针，因此 args 数组的第一个元素将会是要调用的函数：

```c
jl_value_t *jl_apply(jl_value_t **args, uint32_t nargs)
```

这个用于相同功能的入口点单独接收该函数，因此 `args` 数组中不包含该函数：

```c
jl_value_t *jl_call(jl_function_t *f, jl_value_t **args, int32_t nargs);
```

## 添加方法

Given the above dispatch process, conceptually all that is needed to add a new method is (1) a
tuple type, and (2) code for the body of the method. `jl_method_def` implements this operation.
`jl_method_table_for` is called to extract the relevant method table from what would be
the type of the first argument. This is much more complicated than the corresponding procedure
during dispatch, since the argument tuple type might be abstract. For example, we can define:

```julia
(::Union{Foo{Int},Foo{Int8}})(x) = 0
```

这是可行的，因为所有可能的匹配方法都属于同一方法表。

## 创建泛型函数

因为每个对象都是可调用的，所以创建泛型函数不需要特殊的东西。因此，`jl_new_generic_function` 只是创建一个新的 `Function` 的单态类型（大小为 0）并返回它的实例。函数可有一个帮助记忆的「显示名称」，用于调试信息和打印对象。例如，`Base.sin` 的名称为 `sin`。按照约定，所创建*类型*的名称与函数名称相同，带前缀 `#`。所以 `typeof(sin)` 即 `Base.#sin`。

## 闭包

闭包只是一个可调用对象，其字段名称对应于被捕获的变量。例如，以下代码：

```julia
function adder(x)
    return y->x+y
end
```

（大致）降低为：

```julia
struct ##1{T}
    x::T
end

(_::##1)(y) = _.x + y

function adder(x)
    return ##1(x)
end
```

## 构造函数

构造函数调用只是对类型的调用。`Type` 的方法表包含所有的构造函数定义。`Type` 的所有子类型（`Type`、`UnionAll`、`Union` 和 `DataType`）目前通过特殊的安排方式共享一个方法表。

## 内置函数

「内置」函数定义在 `Core` 模块中，有：

```@eval
function lines(words)
    io = IOBuffer()
    n = 0
    for w in words
        if n+length(w) > 80
            print(io, '\n', w)
            n = length(w)
        elseif n == 0
            print(io, w);
            n += length(w)
        else
            print(io, ' ', w);
            n += length(w)+1
        end
    end
    String(take!(io))
end
import Markdown
[string(n) for n in names(Core;all=true)
    if getfield(Core,n) isa Core.Builtin && nameof(getfield(Core,n)) === n] |>
    lines |>
    s ->  "```\n$s\n```" |>
    Markdown.parse
```

这些都是单态对象，其类型为 `Builtin` 的子类型，而或后者为 `Function` 的子类型。它们的用处是在运行时暴露遵循「jlcall」调用约定的入口点。

```c
jl_value_t *(jl_value_t*, jl_value_t**, uint32_t)
```

内建函数的方法表是空的。相反地，它们具有单独的 catch-all 方法缓存条目（`Tuple{Vararg{Any}}`），其 jlcall fptr 指向正确的函数。这是一种 hack，但效果相当不错。

## 关键字参数

Keyword arguments work by adding methods to the kwcall function. This function
is usually the "keyword argument sorter" or "keyword sorter", which then calls
the inner body of the function (defined anonymously).
Every definition in the kwsorter function has the same arguments as some definition in the normal
method table, except with a single `NamedTuple` argument prepended, which gives
the names and values of passed keyword arguments. The kwsorter's job is to move keyword arguments
into their canonical positions based on name, plus evaluate and substitute any needed default value
expressions. The result is a normal positional argument list, which is then passed to yet another
compiler-generated function.

理解该过程的最简单方法是查看关键字参数方法的定义的降低方式。代码：

```julia
function circle(center, radius; color = black, fill::Bool = true, options...)
    # draw
end
```

实际上生成*三个*方法定义。第一个方法是一个接收所有参数（包括关键字参数）作为其位置参数的函数，其代码包含该方法体。它有一个自动生成的名称：

```julia
function #circle#1(color, fill::Bool, options, circle, center, radius)
    # draw
end
```

第二个方法是原始 `circle` 函数的普通定义，负责处理没有传递关键字参数的情况：

```julia
function circle(center, radius)
    #circle#1(black, true, pairs(NamedTuple()), circle, center, radius)
end
```

这只是派发到第一个方法，传递默认值。`pairs` 应用于其余的参数组成的具名元组，以提供键值对迭代。请注意，如果方法不接受其余的关键字参数，那么此参数不存在。

最后，kwsorter 定义为：

```
function (::Core.kwftype(typeof(circle)))(kws, circle, center, radius)
    if haskey(kws, :color)
        color = kws.color
    else
        color = black
    end
    # etc.

    # put remaining kwargs in `options`
    options = structdiff(kws, NamedTuple{(:color, :fill)})

    # if the method doesn't accept rest keywords, throw an error
    # unless `options` is empty

    #circle#1(color, fill, pairs(options), circle, center, radius)
end
```

函数 `Core.kwftype(t)` 创建字段 `t.name.mt.kwsorter`（如果它未被创建），并返回该函数的类型。

此设计的特点是不使用关键字参数的调用点不需要特殊处理；这一切的工作方式好像它们根本不是语言的一部分。不使用关键字参数的调用点直接派发到被调用函数的 kwsorter。例如，调用：

```julia
circle((0,0), 1.0, color = red; other...)
```

降低为：

```julia
kwcall(merge((color = red,), other), circle, (0,0), 1.0)
```

 `kwcall` (also in`Core`) denotes a kwcall signature and dispatch.
The keyword splatting operation (written as `other...`) calls the named tuple `merge` function.
This function further unpacks each *element* of `other`, expecting each one to contain two values
(a symbol and a value).
Naturally, a more efficient implementation is available if all splatted arguments are named tuples.
Notice that the original `circle` function is passed through, to handle closures.

## [Compiler efficiency issues](@id compiler-efficiency-issues)

为每个函数生成新类型在与 Julia 的「默认专门化所有参数」这一设计理念结合使用时，可能对编译器资源的使用产生严重后果。实际上，此设计的初始实现经历了更长的测试和构造时间、高内存占用以及比基线大近乎 2 倍的系统镜像。在一个幼稚的实现中，该问题非常严重，以至于系统几乎无法使用。需要进行几项重要的优化才能使设计变得可行。

第一个问题是函数值参数的不同值导致函数的过度专门化。许多函数只是将参数「传递」到其它地方，例如，到另一个函数或存储位置。这种函数不需要为每个可能传入的闭包专门化。幸运的是，这种情况很容易区分，只需考虑函数是否*调用*它的某个参数（即，参数出现在某处的「头部位置」）。性能关键的高阶函数，如 `map`，肯定会直接调用它们的参数函数，因此仍然会按预期进行专门化。此优化通过在前端记录 `analyze-variables` 传递期间所调用的参数来实现。当 `cache_method` 看到某个在 `Function` 类型层次结构的参数传递到声明为 `Any` 或 `Function` 的槽时，它的行为就好像应用了 `@nospecialize` 注释一样。这种启发式方法在实践中似乎非常有效。

下一个问题涉及方法缓存哈希表的结构。经验研究表明，绝大多数动态分派调用只涉及一个或两个元素。反过来看，只考虑第一个元素便可解决许多这些情况。（旁白：单派发的支持者根本不会对此感到惊讶。但是，这个观点意味着「多重派发在实践中很容易优化」，因此我们应该使用它，而*不是*「我们应该使用单派发」！）因此，方法缓存使用第一个参数作为其主键。但请注意，这对应于函数调用的元组类型的*第二个*元素（第一个元素是函数本身的类型）。通常，头部位置的类型非常少变化——实际上，大多数函数属于没有参数的单态类型。但是，构造函数不是这种情况，一个方法表便保存了所有类型的构造函数。因此，`Type` 方法表是特殊的，使用元组类型的*第一个*元素而不是第二个。

前端为所有闭包生成类型声明。起初，这通过生成通常的类型声明来实现。但是，这产生了大量的构造函数，这些构造函数全都很简单（只是将所有参数传递给 [`new`](@ref)）。因为方法是部分排序的，所以插入所有这些方法是 O(n^2)，此外要保留的方法实在太多了。这可通过直接生成 `struct_type` 表达式（绕过默认的构造函数生成）并直接使用 `new` 来创建闭包的实例来优化。这事并不漂亮，但你需要做你该做的。

下个问题是 `@test` 宏，它为每个测试用例生成一个 0 参数闭包。这不是必需的，因为每个用例只需运行一次。因此，`@test` 被改写以展开到一个 try-catch 块中，该块记录测试结果（true、false 或所引发的异常）并对它调用测试套件处理程序。
