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

## `return`关键词

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

## 操作符也是一类函数

在 Julia,大多数操作符只不过是支持一些特殊语法的函数。( `&&` 和`||`等具有特殊评估语义的操作符例外）
这些操作符不能是函数，因为[Short-Circuit Evaluation](@ref)要求在评估整个运算符之前不评估它们的操作数。
因此，您也可以使用带括号的参数列表来应用它们，就像你任何其他功能一样：

```jldoctest
julia> 1 + 2 + 3
6

julia> +(1,2,3)
6
```

中缀形式和函数形式的使用完全等价。
事实上，前一种形式被内在地解释为函数调用。
这意味着你可以对操作符，例如 [`+`](@ref) and [`*`](@ref) 进行赋值和传递，就像对其它函数值一样。

```jldoctest
julia> f = +;

julia> f(1,2,3)
6
```

然而，函数以`f`命名时并不支持中缀形式。

## 具有特殊名称的操作符

有一些特殊的表达式调用的函数调用没有显示的函数名称，它们是：

| 表达式        | 调用                   |
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

函数在Julia里是[一等公民](https://en.wikipedia.org/wiki/First-class_citizen)：可以指定给变量，和使用标准函数调用语法通过被指定的变量被调用。函数可以用作参数，也可以当作返回值。函数也可以不带函数名地匿名创建，使用如下语法：

```jldoctest
julia> x -> x^2 + 2x - 1
#1 (generic function with 1 method)

julia> function (x)
           x^2 + 2x - 1
       end
#3 (generic function with 1 method)
```

这样就创建了一个接受一个参数`x`和返回当前值下多项式`x^2+2x-1`的函数。注意到结果是个泛型函数，但是带了编译器生成的连续编号的名字。

匿名函数最主要的作用是传递给接收其他函数作为参数的函数。一个经典的例子是[`map`](@ref), 为数组的每个值应用一个函数，然后返回一个包含结果的值的新数组：

```jldoctest
julia> map(round, [1.2,3.5,1.7])
3-element Array{Float64,1}:
 1.0
 4.0
 2.0
```

This is fine if a named function effecting the transform already exists to pass as the first argument
to [`map`](@ref). Often, however, a ready-to-use, named function does not exist. In these
situations, the anonymous function construct allows easy creation of a single-use function object
without needing a name:

```jldoctest
julia> map(x -> x^2 + 2x - 1, [1,3,-1])
3-element Array{Int64,1}:
  2
 14
 -2
```

An anonymous function accepting multiple arguments can be written using the syntax `(x,y,z)->2x+y-z`.
A zero-argument anonymous function is written as `()->3`. The idea of a function with no arguments
may seem strange, but is useful for "delaying" a computation. In this usage, a block of code is
wrapped in a zero-argument function, which is later invoked by calling it as `f`.

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

注意，长度为1的元组必须使用逗号`(1,)`，而`(1)`只是一个带括号的值。`()`表示空元组（长度为0）。

## Named Tuples

The components of tuples can optionally be named, in which case a *named tuple* is
constructed:

```jldoctest
julia> x = (a=1, b=1+1)
(a = 1, b = 2)

julia> x.a
1
```

Named tuples are very similar to tuples, except that fields can additionally be accessed by name
using dot syntax (`x.a`).

## 多返回值

In Julia, one returns a tuple of values to simulate returning multiple values. However, tuples
can be created and destructured without needing parentheses, thereby providing an illusion that
multiple values are being returned, rather than a single tuple value. For example, the following
function returns a pair of values:

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

A typical usage of such a pair of return values, however, extracts each value into a variable.
Julia supports simple tuple "destructuring" that facilitates this:

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

## Argument destructuring

The destructuring feature can also be used within a function argument.
If a function argument name is written as a tuple (e.g. `(x, y)`) instead of just
a symbol, then an assignment `(x, y) = argument` will be inserted for you:

```julia
julia> minmax(x, y) = (y < x) ? (y, x) : (x, y)

julia> range((min, max)) = max - min

julia> range(minmax(10, 2))
8
```

Notice the extra set of parentheses in the definition of `range`.
Without those, `range` would be a two-argument function, and this example would
not work.

## Varargs Functions

It is often convenient to be able to write functions taking an arbitrary number of arguments.
Such functions are traditionally known as "varargs" functions, which is short for "variable number
of arguments". You can define a varargs function by following the last argument with an ellipsis:

```jldoctest barfunc
julia> bar(a,b,x...) = (a,b,x)
bar (generic function with 1 method)
```

The variables `a` and `b` are bound to the first two argument values as usual, and the variable
`x` is bound to an iterable collection of the zero or more values passed to `bar` after its first
two arguments:

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

In all these cases, `x` is bound to a tuple of the trailing values passed to `bar`.

It is possible to constrain the number of values passed as a variable argument; this will be discussed
later in [Parametrically-constrained Varargs methods](@ref).

On the flip side, it is often handy to "splat" the values contained in an iterable collection
into a function call as individual arguments. To do this, one also uses `...` but in the function
call instead:

```jldoctest barfunc
julia> x = (3, 4)
(3, 4)

julia> bar(1,2,x...)
(1, 2, (3, 4))
```

In this case a tuple of values is spliced into a varargs call precisely where the variable number
of arguments go. This need not be the case, however:

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

Furthermore, the iterable object splatted into a function call need not be a tuple:

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

Also, the function that arguments are splatted into need not be a varargs function (although it
often is):

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

As you can see, if the wrong number of elements are in the splatted container, then the function
call will fail, just as it would if too many arguments were given explicitly.

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
