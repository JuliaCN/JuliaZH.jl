# [函数](@id man-functions)

在 Julia 里，函数是一个将参数值元组映射到返回值的对象。Julia 的函数不是纯粹的数学函数，在某种意义上，函数可以改变并受程序的全局状态的影响。在Julia中定义函数的基本语法是：

```jldoctest
julia> function f(x,y)
           x + y
       end
f (generic function with 1 method)
```

这个函数接收两个参数 `x` 和 `y` 并返回最后一个表达式的值，这里是 `x + y`。

在 Julia 中定义函数还有第二种更简洁的语法。上述的传统函数声明语法等效于以下紧凑性的“赋值形式”：

```jldoctest fofxy
julia> f(x,y) = x + y
f (generic function with 1 method)
```

尽管函数可以是复合表达式 (见 [复合表达式](@ref man-compound-expressions))，但在赋值形式下，函数体必须是一个一行的表达式。简短的函数定义在 Julia 中是很常见的。非常惯用的短函数语法大大减少了打字和视觉方面的干扰。

使用传统的括号语法调用函数：

```jldoctest fofxy
julia> f(2,3)
5
```

没有括号时，表达式 `f` 指的是函数对象，可以像任何值一样被传递：

```jldoctest fofxy
julia> g = f;

julia> g(2,3)
5
```

和变量名一样，Unicode 字符也可以用作函数名：

```jldoctest
julia> ∑(x,y) = x + y
∑ (generic function with 1 method)

julia> ∑(2, 3)
5
```

## 参数传递行为

Julia 函数参数遵循有时称为 “pass-by-sharing” 的约定，这意味着变量在被传递给函数时其值并不会被复制。函数参数本身充当新的变量绑定（指向变量值的新地址），它们所指向的值与所传递变量的值完全相同。调用者可以看到对函数内可变值（如数组）的修改。这与 Scheme，大多数 Lisps，Python，Ruby 和 Perl 以及其他动态语言中的行为相同。

## `return` 关键字

函数返回的值是最后计算的表达式的值，默认情况下，它是函数定义主体中的最后一个表达式。在上一小节的示例函数 `f` 中，返回值是表达式的 `x + y` 值。与在 C 语言和大多数其他命令式或函数式语言中一样，`return` 关键字会让函数立即返回，从而提供返回值的表达式：

```julia
function g(x,y)
    return x * y
    x + y
end
```

由于函数定义可以输入到交互式会话中，因此可以很容易的比较这些定义：

```jldoctest
julia> f(x,y) = x + y
f (generic function with 1 method)

julia> function g(x,y)
           return x * y
           x + y
       end
g (generic function with 1 method)

julia> f(2,3)
5

julia> g(2,3)
6
```

当然，在一个单纯的线性执行的函数体内，例如 `g`，使用 `return` 是没有意义的，因为表达式 `x + y` 永远不会被执行到，我们可以简单地把 `x * y` 写为最后一个表达式从而省略掉 `return`。
然而在使用其他控制流程的函数体内，`return` 却是有用的。
例如，在计算两条边长分别为 `x` 和 `y` 的三角形的斜边长度时可以避免溢出：

```jldoctest
julia> function hypot(x,y)
           x = abs(x)
           y = abs(y)
           if x > y
               r = y/x
               return x*sqrt(1+r*r)
           end
           if y == 0
               return zero(x)
           end
           r = x/y
           return y*sqrt(1+r*r)
       end
hypot (generic function with 1 method)

julia> hypot(3, 4)
5.0
```

这个函数有三个可能的返回处，返回三个不同表达式的值，具体取决于 `x` 和 `y` 的值。 最后一行的 `return` 可以省略，因为它是最后一个表达式。

### 返回类型

也可以使用 `::` 运算符在函数声明中指定返回类型。 这可以将返回值转换为指定的类型。

```jldoctest
julia> function g(x, y)::Int8
           return x * y
       end;

julia> typeof(g(1, 2))
Int8
```

这个函数将忽略 `x` 和 `y` 的类型，返回 `Int8` 类型的值。有关返回类型的更多信息，请参见[类型声明](@ref)。

### 返回 nothing

For functions that do not need to return a value (functions used only for some side effects),
the Julia convention is to return the value [`nothing`](@ref):

```julia
function printx(x)
    println("x = $x")
    return nothing
end
```

这在某种意义上是一个“惯例”，在 julia 中 `nothing` 不是一个关键字，而是 `Nothing` 类型的一个单例（singleton）。
也许你已经注意到 `printx` 函数有点不自然，因为 `println` 实际上已经会返回 `nothing`，所以 `return` 语句是多余的。

有两种比 `return nothing` 更短的写法：一种是直接写 `return` 这会隐式的返回 `nothing`。
另一种是在函数的会后一行写上 `nothing`，因为函数会隐式的返回最后一个表达式的值。
三种写法使用哪一种取决于代码风格的偏好。

## 操作符也是函数

在 Julia中，大多数操作符只不过是支持特殊语法的函数（ `&&` 和`||` 等具有特殊评估语义的操作符除外，他们不能是函数，因为[短路求值](@ref)要求在计算整个表达式的值之前不计算每个操作数）。因此，您也可以使用带括号的参数列表来使用它们，就和任何其他函数一样：

```jldoctest
julia> 1 + 2 + 3
6

julia> +(1,2,3)
6
```

中缀表达式和函数形式完全等价。—— 事实上，前一种形式会被编译器转换为函数调用。这也意味着你可以对操作符，例如 [`+`](@ref) 和 [`*`](@ref) ，进行赋值和传参，就像其它函数传参一样。

```jldoctest
julia> f = +;

julia> f(1,2,3)
6
```

然而，函数以`f`命名时不再支持中缀表达式。

## 具有特殊名称的操作符

有一些特殊的表达式对应的函数调用没有显示的函数名称，它们是：

| 表达式        | 函数调用                   |
|:----------------- |:----------------------- |
| `[A B C ...]`     | [`hcat`](@ref)          |
| `[A; B; C; ...]`  | [`vcat`](@ref)          |
| `[A B; C D; ...]` | [`hvcat`](@ref)         |
| `A'`              | [`adjoint`](@ref)       |
| `A[i]`            | [`getindex`](@ref)      |
| `A[i] = x`        | [`setindex!`](@ref)     |
| `A.n`             | [`getproperty`](@ref Base.getproperty) |
| `A.n = x`         | [`setproperty!`](@ref Base.setproperty!) |

## [匿名函数](@id man-anonymous-functions)

函数在Julia里是[一等公民](https://en.wikipedia.org/wiki/First-class_citizen)：可以指定给变量，并使用标准函数调用语法通过被指定的变量调用。函数可以用作参数，也可以当作返回值。函数也可以不带函数名称地匿名创建，使用语法如下：

```jldoctest
julia> x -> x^2 + 2x - 1
#1 (generic function with 1 method)

julia> function (x)
           x^2 + 2x - 1
       end
#3 (generic function with 1 method)
```

这样就创建了一个接受一个参数 `x` 并返回当前值的多项式 `x^2+2x-1` 的函数。注意结果是个泛型函数，但是带了编译器生成的连续编号的名字。

匿名函数最主要的用法是传递给接收函数作为参数的函数。一个经典的例子是 [`map`](@ref) ，为数组的每个元素应用一次函数，然后返回一个包含结果值的新数组：

```jldoctest
julia> map(round, [1.2, 3.5, 1.7])
3-element Array{Float64,1}:
 1.0
 4.0
 2.0
```

如果做为第一个参数传递给 [`map`](@ref) 的转换函数已经存在，那直接使用函数名称是没问题的。但是通常要使用的函数还没有定义好，这样使用匿名函数就更加方便：

```jldoctest
julia> map(x -> x^2 + 2x - 1, [1, 3, -1])
3-element Array{Int64,1}:
  2
 14
 -2
```

接受多个参数的匿名函数写法可以使用语法 `(x,y,z)->2x+y-z`，而无参匿名函数写作 `()->3` 。无参函数的这种写法看起来可能有些奇怪，不过它对于延迟计算很有必要。这种用法会把代码块包进一个无参函数中，后续把它当做 `f` 调用。

例如，考虑对 [`get`](@ref) 的调用：

```julia
get(dict, key) do
    # default value calculated here
    time()
end
```

上面的代码等效于使用包含代码的匿名函数调用`get`。 被包围在do和end之间，如下所示

```julia
get(()->time(), dict, key)
```

The call to [`time`](@ref) is delayed by wrapping it in a 0-argument anonymous function
that is called only when the requested key is absent from `dict`.

## 元组

Julia 有一个和函数参数与返回值密切相关的内置数据结构叫做元组（*tuple*）。
一个元组是一个固定长度的容器，可以容纳任何值，但不可以被修改(是*immutable*的)。
元组通过圆括号和逗号来构造，其内容可以通过索引来访问：

```jldoctest
julia> (1, 1+1)
(1, 2)

julia> (1,)
(1,)

julia> x = (0.0, "hello", 6*7)
(0.0, "hello", 42)

julia> x[2]
"hello"
```

注意，长度为1的元组必须使用逗号 `(1,)`，而 `(1)` 只是一个带括号的值。`()` 表示空元组（长度为0）。

## 具名元组

元组的元素可以有名字，这时候就有了*具名元组*：

```jldoctest
julia> x = (a=2, b=1+2)
(a = 2, b = 3)

julia> x[1]
2

julia> x.a
2
```

Named tuples are very similar to tuples, except that fields can additionally be accessed by name
using dot syntax (`x.a`) in addition to the regular indexing syntax
(`x[1]`).

## 多返回值

Julia 中，一个函数可以返回一个元组来实现返回多个值。不过，元组的创建和消除都不一定要用括号，这时候给人的感觉就是返回了多个值而非一个元组。比如下面这个例子，函数返回了两个值：

```jldoctest foofunc
julia> function foo(a,b)
           a+b, a*b
       end
foo (generic function with 1 method)
```

如果你在交互式会话中调用它且不把返回值赋值给任何变量，你会看到返回的元组：

```jldoctest foofunc
julia> foo(2,3)
(5, 6)
```

这种值对的典型用法是把每个值抽取为一个变量。Julia 支持简洁的元组“解构”：

```jldoctest foofunc
julia> x, y = foo(2,3)
(5, 6)

julia> x
5

julia> y
6
```

你也可以显式地使用 `return` 关键字来返回多个值：

```julia
function foo(a,b)
    return a+b, a*b
end
```

这与之前的定义的`foo`函数具有完全相同的效果。

## 参数解构

析构特性也可以被用在函数参数中。
如果一个函数的参数被写成了元组形式 (如  `(x, y)`) 而不是简单的符号，那么一个赋值运算 `(x, y) = argument` 将会被默认插入：

```julia
julia> minmax(x, y) = (y < x) ? (y, x) : (x, y)

julia> gap((min, max)) = max - min

julia> gap(minmax(10, 2))
8
```

Notice the extra set of parentheses in the definition of `gap`. Without those, `gap`
would be a two-argument function, and this example would not work.

## 变参函数

It is often convenient to be able to write functions taking an arbitrary number of arguments.
Such functions are traditionally known as "varargs" functions, which is short for "variable number
of arguments". You can define a varargs function by following the last positional argument with an ellipsis:

```jldoctest barfunc
julia> bar(a,b,x...) = (a,b,x)
bar (generic function with 1 method)
```

变量 `a` 和 `b` 和以前一样被绑定给前两个参数，后面的参数整个做为迭代集合被绑定到变量 `x` 上 :

```jldoctest barfunc
julia> bar(1,2)
(1, 2, ())

julia> bar(1,2,3)
(1, 2, (3,))

julia> bar(1, 2, 3, 4)
(1, 2, (3, 4))

julia> bar(1,2,3,4,5,6)
(1, 2, (3, 4, 5, 6))
```

在所有这些情况下，`x` 被绑定到传递给 `bar` 的尾随值的元组。

也可以限制可以传递给函数的参数的数量，这部分内容稍后在  [参数化约束的可变参数方法](@ref)  中讨论。

另一方面，将可迭代集中包含的值拆解为单独的参数进行函数调用通常很方便。 要实现这一点，需要在函数调用中额外使用 `...` 而不仅仅只是变量：

```jldoctest barfunc
julia> x = (3, 4)
(3, 4)

julia> bar(1,2,x...)
(1, 2, (3, 4))
```

在这个情况下一组值会被精确切片成一个可变参数调用，这里参数的数量是可变的。但是并不需要成为这种情况：

```jldoctest barfunc
julia> x = (2, 3, 4)
(2, 3, 4)

julia> bar(1,x...)
(1, 2, (3, 4))

julia> x = (1, 2, 3, 4)
(1, 2, 3, 4)

julia> bar(x...)
(1, 2, (3, 4))
```

进一步，拆解给函数调用中的可迭代对象不需要是个元组：

```jldoctest barfunc
julia> x = [3,4]
2-element Array{Int64,1}:
 3
 4

julia> bar(1,2,x...)
(1, 2, (3, 4))

julia> x = [1,2,3,4]
4-element Array{Int64,1}:
 1
 2
 3
 4

julia> bar(x...)
(1, 2, (3, 4))
```

另外，参数可拆解的函数也不一定就是变参函数 —— 尽管一般都是：

```jldoctest
julia> baz(a,b) = a + b;

julia> args = [1,2]
2-element Array{Int64,1}:
1
2

julia> baz(args...)
3

julia> args = [1,2,3]
3-element Array{Int64,1}:
1
2
3

julia> baz(args...)
ERROR: MethodError: no method matching baz(::Int64, ::Int64, ::Int64)
Closest candidates are:
baz(::Any, ::Any) at none:1
```

正如你所见，如果要拆解的容器（比如元组或数组）元素数量不匹配就会报错，和直接给多个参数报错一样。

## 可选参数

在很多情况下，函数参数有合理的默认值，因此也许不需要显式地传递。例如，`Dates` 模块中的 [`Date(y, [m, d])`](@ref) 函数对于给定的年（year）`y`、月（mouth）`m`、日（data）`d` 构造了 `Date` 类型。但是，`m` 和 `d` 参数都是可选的，默认值都是 `1`。这行为可以简述为：

```julia
function Date(y::Int64, m::Int64=1, d::Int64=1)
    err = validargs(Date, y, m, d)
    err === nothing || throw(err)
    return Date(UTD(totaldays(y, m, d)))
end
```

Observe, that this definition calls another method of the `Date` function that takes one argument
of type `UTInstant{Day}`.

With this definition, the function can be called with either one, two or three arguments, and
`1` is automatically passed when only one or two of the arguments are specified:

```jldoctest
julia> using Dates

julia> Date(2000, 12, 12)
2000-12-12

julia> Date(2000, 12)
2000-12-01

julia> Date(2000)
2000-01-01
```

可选参数实际上只是一种方便的语法，用于编写多种具有不同数量参数的方法定义（请参阅 [可选参数和关键字的参数的注意事项](@ref)）。这可通过调用 `methods` 函数来检查我们的 `Date` 函数示例。

## 关键字参数

某些函数需要大量参数，或者具有大量行为。记住如何调用这样的函数可能很困难。关键字参数允许通过名称而不是仅通过位置来识别参数，使得这些复杂接口易于使用和扩展。

例如，考虑绘制一条线的函数 `plot`。这个函数可能有很多选项，用来控制线条的样式、宽度、颜色等。如果它接受关键字参数，一个可行的调用可能看起来像 `plot(x, y, width=2)`，这里我们仅指定线的宽度。请注意，这样做有两个目的。调用更可读，因为我们能以其意义标记参数。也使得大量参数的任意子集都能以任意次序传递。

具有关键字参数的函数在签名中使用分号定义：

```julia
function plot(x, y; style="solid", width=1, color="black")
    ###
end
```

在函数调用时，分号是可选的：可以调用 `plot(x, y, width=2)` 或 `plot(x, y; width=2)`，但前者的风格更为常见。显式的分号只有在传递可变参数或下文中描述的需计算的关键字时是必要的。

关键字参数的默认值只在必需时求值（当相应的关键字参数没有被传入），并且按从左到右的顺序求值，因为默认值的表达式可能会参照先前的关键字参数。

关键字参数的类型可以通过如下的方式显式指定：

```julia
function f(;x::Int=1)
    ###
end
```

Keyword arguments can also be used in varargs functions:

```julia
function plot(x...; style="solid")
    ###
end
```

附加的关键字参数可用 `...` 收集，正如在变参函数中：

```julia
function f(x; y=0, kwargs...)
    ###
end
```

在 `f` 内部，`kwargs` 会是一个具名元组。具名元组（以及键类型为 `Symbol` 的字典）可作为关键字参数传递，这通过在调用中使用分号，例如 `f(x, z=1; kwargs...)`。

如果一个关键字参数在方法定义中未指定默认值，那么它就是*必需的*：如果调用者没有为其赋值，那么将会抛出一个 [`UndefKeywordError`](@ref) 异常：
```julia
function f(x; y)
    ###
end
f(3, y=5) # ok, y is assigned
f(3)      # throws UndefKeywordError(:y)
```

在分号后也可传递 `key => value` 表达式。例如，`plot(x, y; :width => 2)` 等价于 `plot(x, y, width=2)`。当关键字名称需要在运行时被计算时，这就很实用了。

When a bare identifier or dot expression occurs after a semicolon, the keyword argument name is
implied by the identifier or field name. For example `plot(x, y; width)` is equivalent to
`plot(x, y; width=width)` and `plot(x, y; options.width)` is equivalent to `plot(x, y; width=options.width)`.

可选参数的性质使得可以多次指定同一参数的值。例如，在调用 `plot(x, y; options..., width=2)` 的过程中，`options` 结构也能包含一个 `width` 的值。在这种情况下，最右边的值优先级最高；在此例中，`width` 的值可以确定是 `2`。但是，显式地多次指定同一参数的值是不允许的，例如 `plot(x, y, width=2, width=3)`，这会导致语法错误。

## 默认值作用域的计算

当计算可选和关键字参数的默认值表达式时，只有*先前*的参数才在作用域内。例如，给出以下定义：

```julia
function f(x, a=b, b=1)
    ###
end
```

`a=b` 中的 `b` 指的是外部作用域内的 `b`，而不是后续参数中的 `b`。

## 函数参数中的 Do 结构

把函数作为参数传递给其他函数是一种强大的技术，但它的语法并不总是很方便。当函数参数占据多行时，这样的调用便特别难以编写。例如，考虑在具有多种情况的函数上调用 [`map`](@ref)：

```julia
map(x->begin
           if x < 0 && iseven(x)
               return 0
           elseif x == 0
               return 1
           else
               return x
           end
       end,
    [A, B, C])
```

Julia 提供了一个保留字 `do`，用于更清楚地重写此代码：

```julia
map([A, B, C]) do x
    if x < 0 && iseven(x)
        return 0
    elseif x == 0
        return 1
    else
        return x
    end
end
```

`do x` 语法创建一个带有参数 `x` 的匿名函数，并将其作为第一个参数传递 [`map`](@ref)。类似地，`do a，b` 会创建一个双参数匿名函数，而一个简单的 `do` 会声明一个满足形式 `() -> ...` 的匿名函数。

这些参数如何初始化取决于「外部」函数；在这里，[`map`](@ref) 将会依次将 `x` 设置为 `A`、`B`、`C`，再分别调用调用匿名函数，正如在 `map(func, [A, B, C])` 语法中所发生的。

这种语法使得更容易使用函数来有效地扩展语言，因为调用看起来就像普通代码块。有许多可能的用法与 [`map`](@ref) 完全不同，比如管理系统状态。例如，有一个版本的 [`open`](@ref) 可以通过运行代码来确保已经打开的文件最终会被关闭：

```julia
open("outfile", "w") do io
    write(io, data)
end
```

这是通过以下定义实现的：

```julia
function open(f::Function, args...)
    io = open(args...)
    try
        f(io)
    finally
        close(io)
    end
end
```

在这里，[`open`](@ref) 首先打开要写入的文件，接着将结果输出流传递给你在 `do ... end` 代码快中定义的匿名函数。在你的函数退出后，[`open`](@ref) 将确保流被正确关闭，无论你的函数是正常退出还是抛出了一个异常（`try/finally` 结构会在 [流程控制](@ref) 中描述）。

使用 `do` 代码块语法时，查阅文档或实现有助于了解用户函数的参数是如何初始化的。

A `do` block, like any other inner function, can "capture" variables from its
enclosing scope. For example, the variable `data` in the above example of
`open...do` is captured from the outer scope. Captured variables
can create performance challenges as discussed in [performance tips](@ref man-performance-captured).

## Function composition and piping

Functions in Julia can be combined by composing or piping (chaining) them together.

Function composition is when you combine functions together and apply the resulting composition to arguments.
You use the function composition operator (`∘`) to compose the functions, so `(f ∘ g)(args...)` is the same as `f(g(args...))`.

You can type the composition operator at the REPL and suitably-configured editors using `\circ<tab>`.

For example, the `sqrt` and `+` functions can be composed like this:

```jldoctest
julia> (sqrt ∘ +)(3, 6)
3.0
```

这个语句先把数字相加，再对结果求平方根。

The next example composes three functions and maps the result over an array of strings:

```jldoctest
julia> map(first ∘ reverse ∘ uppercase, split("you can compose functions like this"))
6-element Array{Char,1}:
 'U': ASCII/Unicode U+0055 (category Lu: Letter, uppercase)
 'N': ASCII/Unicode U+004E (category Lu: Letter, uppercase)
 'E': ASCII/Unicode U+0045 (category Lu: Letter, uppercase)
 'S': ASCII/Unicode U+0053 (category Lu: Letter, uppercase)
 'E': ASCII/Unicode U+0045 (category Lu: Letter, uppercase)
 'S': ASCII/Unicode U+0053 (category Lu: Letter, uppercase)
```

Function chaining (sometimes called "piping" or "using a pipe" to send data to a subsequent function) is when you apply a function to the previous function's output:

```jldoctest
julia> 1:10 |> sum |> sqrt
7.416198487095663
```

Here, the total produced by `sum` is passed to the `sqrt` function. The equivalent composition would be:

```jldoctest
julia> (sqrt ∘ sum)(1:10)
7.416198487095663
```

The pipe operator can also be used with broadcasting, as `.|>`, to provide a useful combination of the chaining/piping and dot vectorization syntax (described next).

```jldoctest
julia> ["a", "list", "of", "strings"] .|> [uppercase, reverse, titlecase, length]
4-element Array{Any,1}:
  "A"
  "tsil"
  "Of"
 7
```

## [向量化函数的点语法](@id man-vectorized)

在科学计算语言中，通常会有函数的「向量化」版本，它简单地将给定函数 `f(x)` 作用于数组 `A` 的每个元素，接着通过 `f(A)` 生成一个新数组。这种语法便于数据处理，但在其它语言中，向量化通常也是性能所需要的：如果循环很慢，函数的「向量化」版本可以调用由低级语言编写的、快速的库代码。在 Julia 中，向量化函数*不*是性能所必需的，实际上编写自己的循环通常也是有益的（请参阅 [Performance Tips](@ref man-performance-tips)），但它们仍然很方便。因此，*任何* Julia 函数 `f` 能够以元素方式作用于任何数组（或者其它集合），这通过语法 `f.(A)` 实现。例如，`sin` 可以作用于向量 `A` 中的所有元素，如下所示：

```jldoctest
julia> A = [1.0, 2.0, 3.0]
3-element Array{Float64,1}:
 1.0
 2.0
 3.0

julia> sin.(A)
3-element Array{Float64,1}:
 0.8414709848078965
 0.9092974268256817
 0.1411200080598672
```

当然，你如果为 `f` 编写了一个专门的「向量化」方法，例如通过 `f(A::AbstractArray) = map(f, A)`，可以省略点号，这和 `f.(A)` 一样高效。但这种方法要求你事先决定要进行向量化的函数。

更一般地，`f.(args...)` 实际上等价于 `broadcast(f, args...)`，它允许你操作多个数组（甚至是不同形状的），或是数组和标量的混合（请参阅 [Broadcasting](@ref)）。例如，如果有 `f(x,y) = 3x + 4y`，那么 `f.(pi,A)` 将为 `A` 中的每个 `a` 返回一个由 `f(pi,a)` 组成的新数组，而 `f.(vector1,vector2)` 将为每个索引 `i` 返回一个由 `f(vector1[i],vector2[i])` 组成的新向量（如果向量具有不同的长度则会抛出异常）。

```jldoctest
julia> f(x,y) = 3x + 4y;

julia> A = [1.0, 2.0, 3.0];

julia> B = [4.0, 5.0, 6.0];

julia> f.(pi, A)
3-element Array{Float64,1}:
 13.42477796076938
 17.42477796076938
 21.42477796076938

julia> f.(A, B)
3-element Array{Float64,1}:
 19.0
 26.0
 33.0
```

此外，*嵌套的* `f.(args...)` 调用会被*融合*到一个 `broadcast` 循环中。例如，`sin.(cos.(X))` 等价于 `broadcast(x -> sin(cos(x)), X)`，类似于 `[sin(cos(x)) for x in X]`：在 `X` 上只有一个循环，并且只为结果分配了一个数组。[ 相反，在典型的「向量化」语言中，`sin(cos(X))` 首先会为 `tmp=cos(X)` 分配第一个临时数组，然后在单独的循环中计算 `sin(tmp)`，再分配第二个数组。] 这种循环融合不是可能发生也可能不发生的编译器优化，只要遇到了嵌套的 `f.(args...)` 调用，它就是一个*语法保证*。技术上，一旦遇到「非点」函数调用，融合就会停止；例如，在 `sin.(sort(cos.(X)))` 中，由于插入的 `sort` 函数，`sin` 和 `cos` 无法被合并。

最后，最大效率通常在向量化操作的输出数组被*预分配*时实现，这样重复调用就不会一次又一次地为结果分配新数组（请参阅 [输出预分配](@ref)）。一个方便的语法是 `X .= ...`，它等价于 `broadcast!(identity, X, ...)`，除了上面提到的，`broadcast!` 循环可与任何嵌套的「点」调用融合。例如，`X .= sin.(Y)` 等价于 `broadcast!(sin, X, Y)`，用 `sin.(Y)` in-place 覆盖 `X`。如果左边是数组索引表达式，例如 `X[2:end] .= sin.(Y)`，那就将 `broadcast!` 转换在一个 `view` 上，例如 `broadcast!(sin, view(X, 2:lastindex(X)), Y)`，这样左侧就被 in-place 更新了。

由于在表达式中为许多操作和函数调用添加点可能很乏味并导致难以阅读的代码，宏 [`@.`](@ref @__dot__) 用于将表达式中的*每个*函数调用、操作和赋值转换为「点」版本。

```jldoctest
julia> Y = [1.0, 2.0, 3.0, 4.0];

julia> X = similar(Y); # pre-allocate output array

julia> @. X = sin(cos(Y)) # equivalent to X .= sin.(cos.(Y))
4-element Array{Float64,1}:
  0.5143952585235492
 -0.4042391538522658
 -0.8360218615377305
 -0.6080830096407656
```

像 `.+` 这样的二元（或一元）运算符使用相同的机制进行管理：它们等价于 `broadcast` 调用且可与其它嵌套的「点」调用融合。`X .+= Y` 等等价于 `X .= X .+ Y`，结果为一个融合的 in-place 赋值；另见 [dot operators](@ref man-dot-operators)。

您也可以使用 [`|>`](@ref) 将点操作与函数链组合在一起，如本例所示：
```jldoctest
julia> [1:5;] .|> [x->x^2, inv, x->2*x, -, isodd]
5-element Array{Real,1}:
    1
    0.5
    6
   -4
 true
```

## 更多阅读

我们应该在这里提到，这远不是定义函数的完整图景。Julia 拥有一个复杂的类型系统并且允许对参数类型进行多重分派。这里给出的示例都没有为它们的参数提供任何类型注释，意味着它们可以作用于任何类型的参数。类型系统在[类型](@ref man-types)中描述，而[方法](@ref)则描述了根据运行时参数类型上的多重分派所选择的方法定义函数。
