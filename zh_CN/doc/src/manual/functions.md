# [函数](@id man-functions)

在Julia里，函数是一个将参数值元组映射到返回值的对象。Julia的函数不是纯粹的数学函数，在某种意义上，函数可以改变并受程序的全局状态的影响。在Julia中定义函数的基本语法是：

```jldoctest
julia> function f(x,y)
           x + y
       end
f (generic function with 1 method)
```

在Julia中定义函数还有第二种更简洁的语法。上述的传统函数声明语法等效于以下紧凑性的“赋值形式”：

```jldoctest fofxy
julia> f(x,y) = x + y
f (generic function with 1 method)
```

尽管函数可以是复合表达式 (见 [Compound Expressions](@ref man-compound-expressions))，但在赋值形式下，函数体必须是一个一行的表达式。简短的函数定义在Julia中是很常见的。非常惯用的短函数语法大大减少了打字和视觉方面的干扰。

使用传统的括号语法调用函数：

```jldoctest fofxy
julia> f(2,3)
5
```

没有括号时，表达式`f`指的是函数对象，可以像任何值一样被传递：

```jldoctest fofxy
julia> g = f;

julia> g(2,3)
5
```

和变量名一样，Unicode字符也可以用作函数名：

```jldoctest
julia> ∑(x,y) = x + y
∑ (generic function with 1 method)

julia> ∑(2, 3)
5
```

## 参数传递行为

Julia函数参数遵循有时称为“pass-by-sharing”的约定，这意味着变量在被传递给函数时其值并不会被复制。函数参数本身充当新的变量绑定（指向变量值的新地址），它们所指向的值与所传递变量的值完全相同。调用者可以看到对函数内可变值（如数组）的修改。这与Scheme，大多数Lisps，Python，Ruby和Perl以及其他动态语言中的行为相同。

## `return`关键字

函数返回的值是最后计算的表达式的值，默认情况下，它是函数定义主体中的最后一个表达式。在示例函数中`f`，从上一节开始，这是表达式的 `x + y`值。与在C和大多数其他命令式或函数式语言中一样，`return`关键字会导致函数立即返回，从而提供返回值的表达式：

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

当然，在一个单纯的线性执行的函数体内，例如 `g`，使用`return` 是没有意义的，因为表达式`x + y`永远不会被执行到，我们可以简单地把`x * y` 写为最后一个表达式从而省略掉`return`。
然而在使用其他控制流程的函数体内，`return`却是有用的。
例如，一个计算两条边长分别为`x`和`y`的三角形的斜边长度时可以避免overflow：

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

这个函数有三个可能的返回处，返回三个不同表达式的值，具体取决于`x`和`y`的值。 最后一行的`return`可以省略，因为它是最后一个表达式。

也可以使用`::`运算符在函数声明中指定返回类型。 这可以将返回值转换为指定的类型。

```jldoctest
julia> function g(x, y)::Int8
           return x * y
       end;

julia> typeof(g(1, 2))
Int8
```

这个函数将忽略`x` 和`y`的类型，返回`Int8`类型的值。有关返回类型的更多信息，请参见 [类型声明](@ref)。

## 操作符也是函数

在 Julia中，大多数操作符只不过是支持特殊语法的函数（ `&&` 和`||` 等具有特殊评估语义的操作符除外，他们不能是函数，因为 [Short-Circuit Evaluation](@ref) 要求在计算整个表达式的值之前不计算每个操作数）。因此，您也可以使用带括号的参数列表来使用它们，就和任何其他函数一样：

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
julia> map(round, [1.2,3.5,1.7])
3-element Array{Float64,1}:
 1.0
 4.0
 2.0
```

如果做为第一个参数传递给 [`map`](@ref) 的转换函数已经存在，那直接使用函数名称是没问题的。但是通常要使用的函数还没有定义好，这样使用匿名函数就更加方便：

```jldoctest
julia> map(x -> x^2 + 2x - 1, [1,3,-1])
3-element Array{Int64,1}:
  2
 14
 -2
```

接受多个参数的匿名函数写法可以使用语法 `(x,y,z)->2x+y-z`，而无参匿名函数写作 `()->3` 。无参函数的这种写法看起来可能有些奇怪，不过它对于延迟计算很有必要。这种用法会把代码块包进一个无参函数中，后续把它当做 `f` 调用。

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
julia> x = (a=1, b=1+1)
(a = 1, b = 2)

julia> x.a
1
```

具名元组和元组很像，除了具名元组的字段可以通过点号语法访问 `(x.a)` 。

## 多返回值

Julia 中，一个函数可以返回一个元组来实现返回多个值。不过，元组的创建和消除都不一定要用括号，这时候给人的感觉就是返回了多个值而非一个元组。比如下面这个例子，函数返回了两个值：

```jldoctest foofunc
julia> function foo(a,b)
           a+b, a*b
       end
foo (generic function with 1 method)
```

If you call it in an interactive session without assigning the return value anywhere, you will
see the tuple returned:

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

julia> range((min, max)) = max - min

julia> range(minmax(10, 2))
8
```

注意 `range` 定义中的额外括号。
如果没有这些括号，`range`将是一个双参数函数，这个例子就会行不通。

## 变参函数

定义有任意个参数的函数通常是很方便的。
这样的函数通常被称为变参函数 （Varargs Functions）， 是“参数数量可变的函数”的简称。
你可以通过在最后一个参数后面增加一个省略号来定义一个变参函数：

```jldoctest barfunc
julia> bar(a,b,x...) = (a,b,x)
bar (generic function with 1 method)
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

也可以限制可以传递给函数的参数的数量，这部分内容稍后在  [Parametrically-constrained Varargs methods](@ref)  中讨论。

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

## Optional Arguments

In many cases, function arguments have sensible default values and therefore might not need to
be passed explicitly in every call. For example, the function [`Date(y, [m, d])`](@ref)
from `Dates` module constructs a `Date` type for a given year `y`, month `m` and day `d`.
However, `m` and `d` arguments are optional and their default value is `1`.
This behavior can be expressed concisely as:

```julia
function Date(y::Int64, m::Int64=1, d::Int64=1)
    err = validargs(Date, y, m, d)
    err === nothing || throw(err)
    return Date(UTD(totaldays(y, m, d)))
end
```

Observe, that this definition calls another method of `Date` function that takes one argument
of `UTInstant{Day}` type.

With this definition, the function can be called with either one, two or three arguments, and
`1` is automatically passed when any of the arguments is not specified:

```jldoctest
julia> using Dates

julia> Date(2000, 12, 12)
2000-12-12

julia> Date(2000, 12)
2000-12-01

julia> Date(2000)
2000-01-01
```

Optional arguments are actually just a convenient syntax for writing multiple method definitions
with different numbers of arguments (see [Note on Optional and keyword Arguments](@ref)).
This can be checked for our `Date` function example by calling `methods` function.

## Keyword Arguments

Some functions need a large number of arguments, or have a large number of behaviors. Remembering
how to call such functions can be difficult. Keyword arguments can make these complex interfaces
easier to use and extend by allowing arguments to be identified by name instead of only by position.

For example, consider a function `plot` that plots a line. This function might have many options,
for controlling line style, width, color, and so on. If it accepts keyword arguments, a possible
call might look like `plot(x, y, width=2)`, where we have chosen to specify only line width. Notice
that this serves two purposes. The call is easier to read, since we can label an argument with
its meaning. It also becomes possible to pass any subset of a large number of arguments, in any
order.

Functions with keyword arguments are defined using a semicolon in the signature:

```julia
function plot(x, y; style="solid", width=1, color="black")
    ###
end
```

When the function is called, the semicolon is optional: one can either call `plot(x, y, width=2)`
or `plot(x, y; width=2)`, but the former style is more common. An explicit semicolon is required
only for passing varargs or computed keywords as described below.

Keyword argument default values are evaluated only when necessary (when a corresponding keyword
argument is not passed), and in left-to-right order. Therefore default expressions may refer to
prior keyword arguments.

The types of keyword arguments can be made explicit as follows:

```julia
function f(;x::Int=1)
    ###
end
```

Extra keyword arguments can be collected using `...`, as in varargs functions:

```julia
function f(x; y=0, kwargs...)
    ###
end
```

If a keyword argument is not assigned a default value in the method definition,
then it is *required*: an [`UndefKeywordError`](@ref) exception will be thrown
if the caller does not assign it a value:
```julia
function f(x; y)
    ###
end
f(3, y=5) # ok, y is assigned
f(3)      # throws UndefKeywordError(:y)
```

Inside `f`, `kwargs` will be a named tuple. Named tuples (as well as dictionaries) can be passed as
keyword arguments using a semicolon in a call, e.g. `f(x, z=1; kwargs...)`.

One can also pass `key => value` expressions after a semicolon. For example, `plot(x, y; :width => 2)`
is equivalent to `plot(x, y, width=2)`. This is useful in situations where the keyword name is computed
at runtime.

The nature of keyword arguments makes it possible to specify the same argument more than once.
For example, in the call `plot(x, y; options..., width=2)` it is possible that the `options` structure
also contains a value for `width`. In such a case the rightmost occurrence takes precedence; in
this example, `width` is certain to have the value `2`. However, explicitly specifying the same keyword
argument multiple times, for example `plot(x, y, width=2, width=3)`, is not allowed and results in
a syntax error.

## Evaluation Scope of Default Values

When optional and keyword argument default expressions are evaluated, only *previous* arguments are in
scope.
For example, given this definition:

```julia
function f(x, a=b, b=1)
    ###
end
```

the `b` in `a=b` refers to a `b` in an outer scope, not the subsequent argument `b`.

## Do-Block Syntax for Function Arguments

Passing functions as arguments to other functions is a powerful technique, but the syntax for
it is not always convenient. Such calls are especially awkward to write when the function argument
requires multiple lines. As an example, consider calling [`map`](@ref) on a function with several
cases:

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

Julia provides a reserved word `do` for rewriting this code more clearly:

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

The `do x` syntax creates an anonymous function with argument `x` and passes it as the first argument
to [`map`](@ref). Similarly, `do a,b` would create a two-argument anonymous function, and a
plain `do` would declare that what follows is an anonymous function of the form `() -> ...`.

How these arguments are initialized depends on the "outer" function; here, [`map`](@ref) will
sequentially set `x` to `A`, `B`, `C`, calling the anonymous function on each, just as would happen
in the syntax `map(func, [A, B, C])`.

This syntax makes it easier to use functions to effectively extend the language, since calls look
like normal code blocks. There are many possible uses quite different from [`map`](@ref), such
as managing system state. For example, there is a version of [`open`](@ref) that runs code ensuring
that the opened file is eventually closed:

```julia
open("outfile", "w") do io
    write(io, data)
end
```

This is accomplished by the following definition:

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

Here, [`open`](@ref) first opens the file for writing and then passes the resulting output stream
to the anonymous function you defined in the `do ... end` block. After your function exits, [`open`](@ref)
will make sure that the stream is properly closed, regardless of whether your function exited
normally or threw an exception. (The `try/finally` construct will be described in [Control Flow](@ref).)

With the `do` block syntax, it helps to check the documentation or implementation to know how
the arguments of the user function are initialized.

A `do` block, like any other inner function, can "capture" variables from its
enclosing scope. For example, the variable `data` in the above example of
`open...do` is captured from the outer scope. Captured variables
can create performance challenges as discussed in [performance tips](@ref man-performance-tips).


## [Dot Syntax for Vectorizing Functions](@id man-vectorized)

In technical-computing languages, it is common to have "vectorized" versions of functions, which
simply apply a given function `f(x)` to each element of an array `A` to yield a new array via
`f(A)`. This kind of syntax is convenient for data processing, but in other languages vectorization
is also often required for performance: if loops are slow, the "vectorized" version of a function
can call fast library code written in a low-level language. In Julia, vectorized functions are
*not* required for performance, and indeed it is often beneficial to write your own loops (see
[Performance Tips](@ref man-performance-tips)), but they can still be convenient. Therefore, *any* Julia function
`f` can be applied elementwise to any array (or other collection) with the syntax `f.(A)`.
For example `sin` can be applied to all elements in the vector `A`, like so:

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

Of course, you can omit the dot if you write a specialized "vector" method of `f`, e.g. via `f(A::AbstractArray) = map(f, A)`,
and this is just as efficient as `f.(A)`. But that approach requires you to decide in advance
which functions you want to vectorize.

More generally, `f.(args...)` is actually equivalent to `broadcast(f, args...)`, which allows
you to operate on multiple arrays (even of different shapes), or a mix of arrays and scalars (see
[Broadcasting](@ref)). For example, if you have `f(x,y) = 3x + 4y`, then `f.(pi,A)` will return
a new array consisting of `f(pi,a)` for each `a` in `A`, and `f.(vector1,vector2)` will return
a new vector consisting of `f(vector1[i],vector2[i])` for each index `i` (throwing an exception
if the vectors have different length).

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

Moreover, *nested* `f.(args...)` calls are *fused* into a single `broadcast` loop. For example,
`sin.(cos.(X))` is equivalent to `broadcast(x -> sin(cos(x)), X)`, similar to `[sin(cos(x)) for x in X]`:
there is only a single loop over `X`, and a single array is allocated for the result. [In contrast,
`sin(cos(X))` in a typical "vectorized" language would first allocate one temporary array for
`tmp=cos(X)`, and then compute `sin(tmp)` in a separate loop, allocating a second array.] This
loop fusion is not a compiler optimization that may or may not occur, it is a *syntactic guarantee*
whenever nested `f.(args...)` calls are encountered. Technically, the fusion stops as soon as
a "non-dot" function call is encountered; for example, in `sin.(sort(cos.(X)))` the `sin` and `cos`
loops cannot be merged because of the intervening `sort` function.

Finally, the maximum efficiency is typically achieved when the output array of a vectorized operation
is *pre-allocated*, so that repeated calls do not allocate new arrays over and over again for
the results (see [Pre-allocating outputs](@ref)). A convenient syntax for this is `X .= ...`, which
is equivalent to `broadcast!(identity, X, ...)` except that, as above, the `broadcast!` loop is
fused with any nested "dot" calls. For example, `X .= sin.(Y)` is equivalent to `broadcast!(sin, X, Y)`,
overwriting `X` with `sin.(Y)` in-place. If the left-hand side is an array-indexing expression,
e.g. `X[2:end] .= sin.(Y)`, then it translates to `broadcast!` on a `view`, e.g.
`broadcast!(sin, view(X, 2:lastindex(X)), Y)`,
so that the left-hand side is updated in-place.

Since adding dots to many operations and function calls in an expression
can be tedious and lead to code that is difficult to read, the macro
[`@.`](@ref @__dot__) is provided to convert *every* function call,
operation, and assignment in an expression into the "dotted" version.

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

Binary (or unary) operators like `.+` are handled with the same mechanism:
they are equivalent to `broadcast` calls and are fused with other nested "dot" calls.
 `X .+= Y` etcetera is equivalent to `X .= X .+ Y` and results in a fused in-place assignment;
 see also [dot operators](@ref man-dot-operators).

You can also combine dot operations with function chaining using [`|>`](@ref), as in this example:
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

We should mention here that this is far from a complete picture of defining functions. Julia has
a sophisticated type system and allows multiple dispatch on argument types. None of the examples
given here provide any type annotations on their arguments, meaning that they are applicable to
all types of arguments. The type system is described in [Types](@ref man-types) and defining a function
in terms of methods chosen by multiple dispatch on run-time argument types is described in [Methods](@ref).
