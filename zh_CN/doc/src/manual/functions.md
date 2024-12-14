# [函数](@id man-functions)

在 Julia 里，函数是将参数值组成的元组映射到返回值的一个对象。Julia 的函数不是纯粹的数学函数，因为这些函数可以改变程序的全局状态并且可能受其影响。在Julia中定义函数的基本语法是：

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

## [参数传递行为](@id man-argument-passing)

Julia function arguments follow a convention sometimes called "pass-by-sharing", which means that
values are not copied when they are passed to functions. Function arguments themselves act as
new variable *bindings* (new "names" that can refer to values), much like
[assignments](@ref man-assignment-expressions) `argument_name = argument_value`, so that the objects they refer to
are identical to the passed values. Modifications to mutable values (such as `Array`s) made within
a function will be visible to the caller. (This is the same behavior found in Scheme, most Lisps,
Python, Ruby and Perl, among other dynamic languages.)

For example, in the function
```julia
function f(x, y)
    x[1] = 42    # mutates x
    y = 7 + y    # new binding for y, no mutation
    return y
end
```
The statement `x[1] = 42` *mutates* the object `x`, and hence this change *will* be visible in the array passed
by the caller for this argument.   On the other hand, the assignment `y = 7 + y` changes the *binding* ("name")
`y` to refer to a new value `7 + y`, rather than mutating the *original* object referred to by `y`,
and hence does *not* change the corresponding argument passed by the caller.   This can be seen if we call `f(x, y)`:
```julia-repl
julia> a = [4,5,6]
3-element Vector{Int64}:
 4
 5
 6

julia> b = 3
3

julia> f(a, b) # returns 7 + b == 10
10

julia> a  # a[1] is changed to 42 by f
3-element Vector{Int64}:
 42
  5
  6

julia> b  # not changed
3
```
As a common convention in Julia (not a syntactic requirement), such a function would
[typically be named `f!(x, y)`](@ref man-punctuation) rather than `f(x, y)`, as a visual reminder at
the call site that at least one of the arguments (often the first one) is being mutated.

!!! warning "Shared memory between arguments"
    The behavior of a mutating function can be unexpected when a mutated argument shares memory with another argument, a situation known as aliasing (e.g. when one is a view of the other).
    Unless the function docstring explicitly indicates that aliasing produces the expected result, it is the responsibility of the caller to ensure proper behavior on such inputs.

## Argument-type declarations

You can declare the types of function arguments by appending `::TypeName` to the argument name, as usual for [Type Declarations](@ref 类型声明) in Julia.
For example, the following function computes [Fibonacci numbers](https://en.wikipedia.org/wiki/Fibonacci_number) recursively:
```
fib(n::Integer) = n ≤ 2 ? one(n) : fib(n-1) + fib(n-2)
```
and the `::Integer` specification means that it will only be callable when `n` is a subtype of the [abstract](@ref man-abstract-types) `Integer` type.

Argument-type declarations **normally have no impact on performance**: regardless of what argument types (if any) are declared, Julia compiles a specialized version of the function for the actual argument types passed by the caller.   For example, calling `fib(1)` will trigger the compilation of specialized version of `fib` optimized specifically for `Int` arguments, which is then re-used if `fib(7)` or `fib(15)` are called.  (There are rare exceptions when an argument-type declaration can trigger additional compiler specializations; see: [Be aware of when Julia avoids specializing](@ref).)  The most common reasons to declare argument types in Julia are, instead:

* **Dispatch:** As explained in [Methods](@ref 方法), you can have different versions ("methods") of a function for different argument types, in which case the argument types are used to determine which implementation is called for which arguments.  For example, you might implement a completely different algorithm `fib(x::Number) = ...` that works for any `Number` type by using [Binet's formula](https://en.wikipedia.org/wiki/Fibonacci_number#Binet%27s_formula) to extend it to non-integer values.
* **Correctness:** Type declarations can be useful if your function only returns correct results for certain argument types.  For example, if we omitted argument types and wrote `fib(n) = n ≤ 2 ? one(n) : fib(n-1) + fib(n-2)`, then `fib(1.5)` would silently give us the nonsensical answer `1.0`.
* **Clarity:** Type declarations can serve as a form of documentation about the expected arguments.

However, it is a **common mistake to overly restrict the argument types**, which can unnecessarily limit the applicability of the function and prevent it from being re-used in circumstances you did not anticipate.    For example, the `fib(n::Integer)` function above works equally well for `Int` arguments (machine integers) and `BigInt` arbitrary-precision integers (see [BigFloats and BigInts](@ref BigFloats-and-BigInts)), which is especially useful because Fibonacci numbers grow exponentially rapidly and will quickly overflow any fixed-precision type like `Int` (see [溢出行为](@ref)).  If we had declared our function as `fib(n::Int)`, however, the application to `BigInt` would have been prevented for no reason.   In general, you should use the most general applicable abstract types for arguments, and **when in doubt, omit the argument types**.  You can always add argument-type specifications later if they become necessary, and you don't sacrifice performance or functionality by omitting them.

## 参数类型声明

您可以通过将 `::TypeName` 附加到参数名称来声明函数参数的类型，就像 Julia 中的 [类型声明](@ref) 一样。
例如，以下函数递归计算 [斐波那契数列](https://en.wikipedia.org/wiki/Fibonacci_number)：
```
fib(n::Integer) = n ≤ 2 ? one(n) : fib(n-1) + fib(n-2)
```
并且 `::Integer` 规范意味着它只有在 `n` 是 [抽象](@ref man-abstract-types) `Integer` 类型的子类型时才可调用。

参数类型声明**通常对性能没有影响**：无论声明什么参数类型（如果有），Julia 都会为实际参数类型编译函数的特例版本。 例如，调用 `fib(1)` 将触发专门为 `Int` 参数优化的特例化的`fib` 的编译，它会在 `fib(7)` 或 `fib(15)` 调用时重新使用。 （参数类型声明不触发额外的编译器特化的情况很少；请参阅：[注意 Julia 何时不触发特例化](@ref Be-aware-of-when-Julia-avoids-specializing)。）在 Julia 中声明参数类型的最常见原因是：

* **派发：** 如 [方法](@ref) 中所述，对于不同的参数类型，你可以有不同版本（“方法”）的函数，在这种情况下，参数类型用于确定调用哪个版本的函数。例如，你可以使用 [Binet 公式](https://en.wikipedia.org/wiki/Fibonacci_number#Binet's_formula) 实现一个完全不同的算法 `fib(x::Number) = ...`，该算法扩展为了非整数值，适用于任何 `Number` 类型。
* **正确性：** 如果函数只为某些参数类型返回正确的结果，则类型声明会很有用。例如，如果我们省略参数类型并写成 `fib(n) = n ≤ 2 ? one(n) : fib(n-1) + fib(n-2)`，然后`fib(1.5)`会默默地给我们无意义的答案`1.0`。
* **清晰性：** 类型声明可以作为一种关于预期参数的文档形式。

但是，**过分限制参数类型是常见的错误**，这会不必要地限制函数的适用性，并防止它在未预料到的情况下被重用。例如，上面的 `fib(n::Integer)` 函数同样适用于 `Int` 参数（机器整数）和 `BigInt` 任意精度整数（参见 [BigFloats 和 BigInts](@ref BigFloats-and-BigInts)），这样十分有效，因为斐波那契数以指数方式快速增长，并且会迅速溢出任何固定精度类型，如 `Int`（参见 [溢出行为](@ref)）。但是，如果我们将函数声明为 `fib(n::Int)`，那么 `BigInt` 的应用就会被阻止。通常，应该对参数使用最通用的适用抽象类型，并且**如有不确定，就省略参数类型**。如果有必要，你可以随时添加参数类型规范，并且不会因为省略它们而牺牲性能或功能。

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

返回类型声明在 Julia 中**很少使用**：通常，你应该编写“类型稳定”的函数，Julia 的编译器可以在其中自动推断返回类型。更多信息请参阅 [性能提示](@ref man-performance-tips) 一章。

### 返回 nothing

对于不需要任何返回值的函数（只用来产生副作用的函数）， Julia 中的写法为返回值[`nothing`](@ref):

```julia
function printx(x)
    println("x = $x")
    return nothing
end
```

这在某种意义上是一个“惯例”，在 Julia 中 `nothing` 不是一个关键字，而是 `Nothing` 类型的一个单例（singleton）。
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

| 表达式                | 函数调用                 |
|:--------------------- |:----------------------- |
| `[A B C ...]`         | [`hcat`](@ref)          |
| `[A; B; C; ...]`      | [`vcat`](@ref)          |
| `[A B; C D; ...]`     | [`hvcat`](@ref)         |
| `[A; B;; C; D;; ...]` | [`hvncat`](@ref)        |
| `A'`                  | [`adjoint`](@ref)       |
| `A[i]`                | [`getindex`](@ref)      |
| `A[i] = x`            | [`setindex!`](@ref)     |
| `A.n`                 | [`getproperty`](@ref Base.getproperty) |
| `A.n = x`             | [`setproperty!`](@ref Base.setproperty!) |

Note that expressions similar to `[A; B;; C; D;; ...]` but with more than two
consecutive `;` also correspond to `hvncat` calls.

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
3-element Vector{Float64}:
 1.0
 4.0
 2.0
```

如果做为第一个参数传递给 [`map`](@ref) 的转换函数已经存在，那直接使用函数名称是没问题的。但是通常要使用的函数还没有定义好，这样使用匿名函数就更加方便：

```jldoctest
julia> map(x -> x^2 + 2x - 1, [1, 3, -1])
3-element Vector{Int64}:
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

这里对 [`time`](@ref) 的调用，被包裹了它的一个无参数的匿名函数延迟了。
只有当请求的键不在 `dict` 中时，才会调用该函数。

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

The fields of named tuples can be accessed by name using dot syntax (`x.a`) in
addition to the regular indexing syntax (`x[1]` or `x[:a]`).

## [解构赋值和多返回值](@id destructuring-assignment)

A comma-separated list of variables (optionally wrapped in parentheses) can appear on the
left side of an assignment: the value on the right side is _destructured_ by iterating
over and assigning to each variable in turn:

```jldoctest
julia> (a,b,c) = 1:3
1:3

julia> b
2
```

右边的值应该是一个至少与左边的变量数量一样长的迭代器（参见[迭代接口](@ref man-interface-iteration)）（迭代器的任何多余元素会被忽略）。

可用于通过返回元组或其他可迭代值从函数返回多个值。例如，以下函数返回两个值：

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

解构赋值将每个值提取到一个变量中：

```jldoctest foofunc
julia> x, y = foo(2,3)
(5, 6)

julia> x
5

julia> y
6
```

另一个常见用途是交换变量：
```jldoctest foofunc
julia> y, x = x, y
(5, 6)

julia> x
6

julia> y
5
```

如果只需要迭代器元素的一个子集，一个常见的惯例是将忽略的元素分配给一个只包含下划线 `_` 的变量（这是一个无效的变量名，请参阅 [合法的变量名]（@ref man -allowed-variable-names)):

```jldoctest
julia> _, _, _, d = 1:10
1:10

julia> d
4
```

Other valid left-hand side expressions can be used as elements of the assignment list, which will call [`setindex!`](@ref) or [`setproperty!`](@ref), or recursively destructure individual elements of the iterator:

```jldoctest
julia> X = zeros(3);

julia> X[1], (a,b) = (1, (2, 3))
(1, (2, 3))

julia> X
3-element Vector{Float64}:
 1.0
 0.0
 0.0

julia> a
2

julia> b
3
```

!!! compat "Julia 1.6"
    `...` with assignment requires Julia 1.6

If the last symbol in the assignment list is suffixed by `...` (known as _slurping_), then
it will be assigned a collection or lazy iterator of the remaining elements of the
right-hand side iterator:

```jldoctest
julia> a, b... = "hello"
"hello"

julia> a
'h': ASCII/Unicode U+0068 (category Ll: Letter, lowercase)

julia> b
"ello"

julia> a, b... = Iterators.map(abs2, 1:4)
Base.Generator{UnitRange{Int64}, typeof(abs2)}(abs2, 1:4)

julia> a
1

julia> b
Base.Iterators.Rest{Base.Generator{UnitRange{Int64}, typeof(abs2)}, Int64}(Base.Generator{UnitRange{Int64}, typeof(abs2)}(abs2, 1:4), 1)
```

See [`Base.rest`](@ref) for details on the precise handling and customization for specific iterators.

!!! compat "Julia 1.9"
    `...` in non-final position of an assignment requires Julia 1.9

Slurping in assignments can also occur in any other position. As opposed to slurping the end
of a collection however, this will always be eager.

```jldoctest
julia> a, b..., c = 1:5
1:5

julia> a
1

julia> b
3-element Vector{Int64}:
 2
 3
 4

julia> c
5

julia> front..., tail = "Hi!"
"Hi!"

julia> front
"Hi"

julia> tail
'!': ASCII/Unicode U+0021 (category Po: Punctuation, other)
```

This is implemented in terms of the function [`Base.split_rest`](@ref).

Note that for variadic function definitions, slurping is still only allowed in final position.
This does not apply to [single argument destructuring](@ref man-argument-destructuring) though,
as that does not affect method dispatch:

```jldoctest
julia> f(x..., y) = x
ERROR: syntax: invalid "..." on non-final argument
Stacktrace:
[...]

julia> f((x..., y)) = x
f (generic function with 1 method)

julia> f((1, 2, 3))
(1, 2)
```

## Property destructuring

Instead of destructuring based on iteration, the right side of assignments can also be destructured using property names.
This follows the syntax for NamedTuples, and works by assigning to each variable on the left a
property of the right side of the assignment with the same name using `getproperty`:

```jldoctest
julia> (; b, a) = (a=1, b=2, c=3)
(a = 1, b = 2, c = 3)

julia> a
1

julia> b
2
```

## [Argument destructuring](@id man-argument-destructuring)

其他有效的左侧表达式可以用作赋值列表的元素，它们将调用 [`setindex!`](@ref) 或 [`setproperty!`](@ref)，或者递归地解构迭代器的各个元素：

```jldoctest
julia> X = zeros(3);

julia> X[1], (a,b) = (1, (2, 3))
(1, (2, 3))

julia> X
3-element Vector{Float64}:
 1.0
 0.0
 0.0

julia> a
2

julia> b
3
```

!!! compat "Julia 1.6"
    带 `...` 的赋值需要 Julia 1.6

如果赋值列表中的最后一个符号后缀为 `...`（称为 _slurping_），那么它将被分配给右侧迭代器剩余元素的集合或其惰性迭代器：

```jldoctest
julia> a, b... = "hello"
"hello"

julia> a
'h': ASCII/Unicode U+0068 (category Ll: Letter, lowercase)

julia> b
"ello"

julia> a, b... = Iterators.map(abs2, 1:4)
Base.Generator{UnitRange{Int64}, typeof(abs2)}(abs2, 1:4)

julia> a
1

julia> b
Base.Iterators.Rest{Base.Generator{UnitRange{Int64}, typeof(abs2)}, Int64}(Base.Generator{UnitRange{Int64}, typeof(abs2)}(abs2, 1:4), 1)
```

有关特定迭代器的精确处理和自定义的详细信息，请参阅 [`Base.rest`](@ref)。

## 参数解构

析构特性也可以被用在函数参数中。
如果一个函数的参数被写成了元组形式 (如  `(x, y)`) 而不是简单的符号，那么一个赋值运算 `(x, y) = argument` 将会被默认插入：

```julia-repl
julia> minmax(x, y) = (y < x) ? (y, x) : (x, y)

julia> gap((min, max)) = max - min

julia> gap(minmax(10, 2))
8
```

注意在定义函数 `gap` 时额外的括号。 没有它们，`gap` 函数将会是一个双参数函数，这个例子也会无法正常运行。

Similarly, property destructuring can also be used for function arguments:

```julia-repl
julia> foo((; x, y)) = x + y
foo (generic function with 1 method)

julia> foo((x=1, y=2))
3

julia> struct A
           x
           y
       end

julia> foo(A(3, 4))
7
```

对于匿名函数，解构单个元组需要一个额外的逗号：

```
julia> map(((x,y),) -> x + y, [(1,2), (3,4)])
2-element Array{Int64,1}:
 3
 7
```

## Varargs Functions

```
julia> map(((x,y),) -> x + y, [(1,2), (3,4)])
2-element Array{Int64,1}:
 3
 7
```

## 变参函数

定义有任意个参数的函数会带来很多便利。这类函数通常被称为“变参”函数，即“参数数量可变”的简称。你可以通过在最后一个参数后增加省略号来定义一个变参函数:

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
2-element Vector{Int64}:
 3
 4

julia> bar(1,2,x...)
(1, 2, (3, 4))

julia> x = [1,2,3,4]
4-element Vector{Int64}:
 1
 2
 3
 4

julia> bar(x...)
(1, 2, (3, 4))
```

此外，参数被放入的函数不一定是可变参数函数（尽管经常是）：

```jldoctest
julia> baz(a,b) = a + b;

julia> args = [1,2]
2-element Vector{Int64}:
 1
 2

julia> baz(args...)
3

julia> args = [1,2,3]
3-element Vector{Int64}:
 1
 2
 3

julia> baz(args...)
ERROR: MethodError: no method matching baz(::Int64, ::Int64, ::Int64)

Closest candidates are:
  baz(::Any, ::Any)
   @ Main none:1

Stacktrace:
[...]
```

正如你所见，如果要拆解的容器（比如元组或数组）元素数量不匹配就会报错，和直接给多个参数报错一样。

## 可选参数

在很多情况下，函数参数有合理的默认值，因此也许不需要显式地传递。例如，`Dates` 模块中的 [`Date(y, [m, d])`](@ref) 函数对于给定的年（year）`y`、月（mouth）`m`、日（data）`d` 构造了 `Date` 类型。但是，`m` 和 `d` 参数都是可选的，默认值都是 `1`。这行为可以简述为：

```jldoctest date_default_args
julia> using Dates

julia> function date(y::Int64, m::Int64=1, d::Int64=1)
           err = Dates.validargs(Date, y, m, d)
           err === nothing || throw(err)
           return Date(Dates.UTD(Dates.totaldays(y, m, d)))
       end
date (generic function with 3 methods)
```

注意，这个定义调用了 `Date` 函数的另一个方法，该方法带有一个 `UTInstant{Day}` 类型的参数。

通过此定义，函数调用时可以带有一个、两个或三个参数，并且在只有一个或两个参数被指定时后，自动传递 `1` 为未指定参数值：

```jldoctest date_default_args
julia> date(2000, 12, 12)
2000-12-12

julia> date(2000, 12)
2000-12-01

julia> date(2000)
2000-01-01
```

可选参数实际上只是一种方便的语法，用于编写多种具有不同数量参数的方法定义（请参阅 [可选参数和关键字的参数的注意事项](@ref)）。
这可通过调用 `methods` 函数来检查我们的 `date` 函数示例。

```julia-repl
julia> methods(date)
# 3 methods for generic function "date":
[1] date(y::Int64) in Main at REPL[1]:1
[2] date(y::Int64, m::Int64) in Main at REPL[1]:1
[3] date(y::Int64, m::Int64, d::Int64) in Main at REPL[1]:1
```

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

关键字参数也可以在变参函数中使用：

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

在 `f` 中，`kwargs` 将是一个在命名元组上的不可变键值迭代器。
具名元组（以及带有`Symbol`键的字典, and other iterators yielding two-value collections with symbol as first values）
可以在调用中使用分号作为关键字参数传递，例如 `f(x, z=1; kwargs...)`。

如果一个关键字参数在方法定义中未指定默认值，那么它就是*必需的*：如果调用者没有为其赋值，那么将会抛出一个 [`UndefKeywordError`](@ref) 异常：
```julia
function f(x; y)
    ###
end
f(3, y=5) # ok, y is assigned
f(3)      # throws UndefKeywordError(:y)
```

在分号后也可传递 `key => value` 表达式。例如，`plot(x, y; :width => 2)` 等价于 `plot(x, y, width=2)`。当关键字名称需要在运行时被计算时，这就很实用了。

当分号后出现裸标识符或点表达式时，标识符或字段名称隐含关键字参数名称。 例如`plot(x, y; width)` 等价于`plot(x, y; width=width)`，`plot(x, y; options.width)` 等价于`plot(x, y; width=options.width)`。

可选参数的性质使得可以多次指定同一参数的值。例如，在调用 `plot(x, y; options..., width=2)` 的过程中，`options` 结构也能包含一个 `width` 的值。在这种情况下，最右边的值优先级最高；在此例中，`width` 的值可以确定是 `2`。但是，显式地多次指定同一参数的值是不允许的，例如 `plot(x, y, width=2, width=3)`，这会导致语法错误。

## 默认值作用域的计算

当计算可选和关键字参数的默认值表达式时，只有*先前*的参数才在作用域内。例如，给出以下定义：

```julia
function f(x, a=b, b=1)
    ###
end
```

`a=b` 中的 `b` 指的是外部作用域内的 `b`，而不是后续参数中的 `b`。

## [函数参数中的 Do 结构](@id Do-Block-Syntax-for-Function-Arguments)

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

`do x` 语法创建一个带有参数 `x` 的匿名函数，并将其作为第一个参数传递给 [`map`](@ref)。
类似地，`do a,b` 将创建一个有两个参数的匿名函数。
请注意，`do (a,b)` 将创建一个单参数匿名函数，其参数是一个要解构的元组。
Note that `do (a,b)` would create a one-argument anonymous function,
whose argument is a tuple to be deconstructed. 
一个简单的 `do` 会声明接下来是一个形式为 `() -> ...` 的匿名函数。

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

类似于其他的内部函数， `do` 代码块也可以“捕获”上一个作用域的变量。例如，上一个 `open...do` 的例子中变量 `data` 是从外部作用域捕获的。捕获变量可能会给性能优化带来挑战，详见 [性能建议](@ref man-performance-captured)。

## 函数的复合与链式调用

Julia中的多个函数可以用函数复合或管道连接（链式调用）组合起来。

函数的复合指的是把多个函数绑定到一起，然后作用于最先调用那个函数的参数。
你可以使用函数复合运算符 (`∘`) 来组合函数，这样一来 `(f ∘ g)(args...)` 就等价于 `f(g(args...))`.

你可以在REPL和合理配置的编辑器中用 `\circ<tab>` 输入函数复合运算符。

例如， `sqrt` 和 `+` 可以用下面这种方式组合：

```jldoctest
julia> (sqrt ∘ +)(3, 6)
3.0
```

这个语句先把数字相加，再对结果求平方根。

下一个例子组合了三个函数并把新函数作用到一个字符串组成的数组上：

```jldoctest
julia> map(first ∘ reverse ∘ uppercase, split("you can compose functions like this"))
6-element Vector{Char}:
 'U': ASCII/Unicode U+0055 (category Lu: Letter, uppercase)
 'N': ASCII/Unicode U+004E (category Lu: Letter, uppercase)
 'E': ASCII/Unicode U+0045 (category Lu: Letter, uppercase)
 'S': ASCII/Unicode U+0053 (category Lu: Letter, uppercase)
 'E': ASCII/Unicode U+0045 (category Lu: Letter, uppercase)
 'S': ASCII/Unicode U+0053 (category Lu: Letter, uppercase)
```

函数的链式调用（有时也称“使用管道”把数据送到一系列函数中去）指的是把一个函数作用到前一个函数的输出上：

```jldoctest
julia> 1:10 |> sum |> sqrt
7.416198487095663
```

在这里， `sum` 函数求出的和被传递到 `sqrt` 函数作为参数。等价的函数复合写法是：

```jldoctest
julia> (sqrt ∘ sum)(1:10)
7.416198487095663
```

管道运算符还可以和广播一起使用（`.|>`），这提供了一个有用的链式调用/管道+向量化运算的组合语法（接下来将描述）。

```jldoctest
julia> ["a", "list", "of", "strings"] .|> [uppercase, reverse, titlecase, length]
4-element Vector{Any}:
  "A"
  "tsil"
  "Of"
 7
```

When combining pipes with anonymous functions, parentheses must be used if subsequent pipes are not to be parsed as part of the anonymous function's body. Compare:

```jldoctest
julia> 1:3 .|> (x -> x^2) |> sum |> sqrt
3.7416573867739413

julia> 1:3 .|> x -> x^2 |> sum |> sqrt
3-element Vector{Float64}:
 1.0
 2.0
 3.0
```

## [向量化函数的点语法](@id man-vectorized)

在科学计算语言中，通常会有函数的「向量化」版本，它简单地将给定函数 `f(x)` 作用于数组 `A` 的每个元素，接着通过 `f(A)` 生成一个新数组。这种语法便于数据处理，但在其它语言中，向量化通常也是性能所需要的：如果循环很慢，函数的「向量化」版本可以调用由低级语言编写的、快速的库代码。在 Julia 中，向量化函数*不*是性能所必需的，实际上编写自己的循环通常也是有益的（请参阅 [Performance Tips](@ref man-performance-tips)），但它们仍然很方便。因此，*任何* Julia 函数 `f` 能够以元素方式作用于任何数组（或者其它集合），这通过语法 `f.(A)` 实现。例如，`sin` 可以作用于向量 `A` 中的所有元素，如下所示：

```jldoctest
julia> A = [1.0, 2.0, 3.0]
3-element Vector{Float64}:
 1.0
 2.0
 3.0

julia> sin.(A)
3-element Vector{Float64}:
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
3-element Vector{Float64}:
 13.42477796076938
 17.42477796076938
 21.42477796076938

julia> f.(A, B)
3-element Vector{Float64}:
 19.0
 26.0
 33.0
```

Keyword arguments are not broadcasted over, but are simply passed through to each call of
the function.  For example, `round.(x, digits=3)` is equivalent to `broadcast(x -> round(x, digits=3), x)`.

此外，*嵌套的* `f.(args...)` 调用会被*融合*到一个 `broadcast` 循环中。例如，`sin.(cos.(X))` 等价于 `broadcast(x -> sin(cos(x)), X)`，类似于 `[sin(cos(x)) for x in X]`：在 `X` 上只有一个循环，并且只为结果分配了一个数组。[ 相反，在典型的「向量化」语言中，`sin(cos(X))` 首先会为 `tmp=cos(X)` 分配第一个临时数组，然后在单独的循环中计算 `sin(tmp)`，再分配第二个数组。] 这种循环融合不是可能发生也可能不发生的编译器优化，只要遇到了嵌套的 `f.(args...)` 调用，它就是一个*语法保证*。技术上，一旦遇到「非点」函数调用，融合就会停止；例如，在 `sin.(sort(cos.(X)))` 中，由于插入的 `sort` 函数，`sin` 和 `cos` 无法被合并。

最后，最大效率通常在向量化操作的输出数组被*预分配*时实现，这样重复调用就不会一次又一次地为结果分配新数组（请参阅 [输出预分配](@ref)）。一个方便的语法是 `X .= ...`，它等价于 `broadcast!(identity, X, ...)`，除了上面提到的，`broadcast!` 循环可与任何嵌套的「点」调用融合。例如，`X .= sin.(Y)` 等价于 `broadcast!(sin, X, Y)`，用 `sin.(Y)` in-place 覆盖 `X`。如果左边是数组索引表达式，例如 `X[2:end] .= sin.(Y)`，那就将 `broadcast!` 转换在一个 `view` 上，例如 `broadcast!(sin, view(X, 2:lastindex(X)), Y)`，这样左侧就被 in-place 更新了。

由于在表达式中为许多操作和函数调用添加点可能很乏味并导致难以阅读的代码，宏 [`@.`](@ref @__dot__) 用于将表达式中的*每个*函数调用、操作和赋值转换为「点」版本。

```jldoctest
julia> Y = [1.0, 2.0, 3.0, 4.0];

julia> X = similar(Y); # pre-allocate output array

julia> @. X = sin(cos(Y)) # equivalent to X .= sin.(cos.(Y))
4-element Vector{Float64}:
  0.5143952585235492
 -0.4042391538522658
 -0.8360218615377305
 -0.6080830096407656
```

像 `.+` 这样的二元（或一元）运算符使用相同的机制进行管理：它们等价于 `broadcast` 调用且可与其它嵌套的「点」调用融合。`X .+= Y` 等等价于 `X .= X .+ Y`，结果为一个融合的 in-place 赋值；另见 [dot operators](@ref man-dot-operators)。

您也可以使用 [`|>`](@ref) 将点操作与函数链组合在一起，如本例所示：
```jldoctest
julia> 1:5 .|> [x->x^2, inv, x->2*x, -, isodd]
5-element Vector{Real}:
    1
    0.5
    6
   -4
 true
```

## 更多阅读

我们应该在这里提到，这远不是定义函数的完整图景。Julia 拥有一个复杂的类型系统并且允许对参数类型进行多重分派。这里给出的示例都没有为它们的参数提供任何类型注释，意味着它们可以作用于任何类型的参数。类型系统在[类型](@ref man-types)中描述，而[方法](@ref)则描述了根据运行时参数类型上的多重分派所选择的方法定义函数。
