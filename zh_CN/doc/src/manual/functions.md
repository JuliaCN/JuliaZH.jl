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

注意到，这定义调用了 `Date` 函数的另一个方法，该方法带有一个 `UTInstant{Day}` 类型的参数。

在此定义下，函数调用时可以带有一个、两个或三个参数，并且在没有指定参数时，自动传递 `1`：

```jldoctest
julia> using Dates

julia> Date(2000, 12, 12)
2000-12-12

julia> Date(2000, 12)
2000-12-01

julia> Date(2000)
2000-01-01
```

可选参数实际上只是一种方便的语法，用于编写多种具有不同数量参数的方法定义（请参阅 [Note on Optional and keyword Arguments](@ref)）。这可通过调用 `methods` 函数来检查我们的 `Date` 函数示例。

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

关键字参数的默认值只在必须时求值（当相应的关键字参数没有被传入），并且按从左到右的顺序求值，因为默认值的表达式可能会参照先前的关键字参数。

关键字参数的类型可以通过如下的方式显式指定：

```julia
function f(;x::Int=1)
    ###
end
```

附加的关键字参数可用 `...` 收集，正如在变参函数中：

```julia
function f(x; y=0, kwargs...)
    ###
end
```

如果一个关键字参数在方法定义中未指定默认值，那么它就是*必须的*：如果调用者没有为其赋值，那么将会抛出一个 [`UndefKeywordError`](@ref) 异常：
```julia
function f(x; y)
    ###
end
f(3, y=5) # ok, y is assigned
f(3)      # throws UndefKeywordError(:y)
```

在 `f` 内部，`kwargs` 会是一个具名元组。具名元组（以及字典）可作为关键字参数传递，通过在调用中使用分号，例如 `f(x, z=1; kwargs...)`。

在分号后也可传递 `key => value` 表达式。例如，`plot(x, y; :width => 2)` 等价于 `plot(x, y, width=2)`。当关键字名称需要在运行时被计算时，这就很实用了。

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
