# 方法

我们回想一下，在[函数](@ref man-functions)中我们知道函数是这么一个对象，它把一组参数映射成一个返回值，或者当没有办法返回恰当的值时扔出一个异常。具有相同概念的函数或者运算，经常会根据参数类型的不同而进行有很大差异的实现：两个整数的加法与两个浮点数的加法是相当不一样的，整数与浮点数之间的加法也不一样。除了它们实现上的不同，这些运算都归在"加法"这么一个广义的概念之下，因此在 Julia 中这些行为都属于同一个对象：`+` 函数。

为了让对同样的概念使用许多不同的实现这件事更顺畅，函数没有必要马上全部都被定义，反而应该是一块一块地定义，为特定的参数类型和数量的组合提供指定的行为。对于一个函数的一个可能行为的定义叫做*方法*。直到这里，我们只展示了那些只定了一个方法的，对参数的所有类型都适用的函数。但是方法定义的特征是不仅能表明参数的数量，也能表明参数的类型，并且能提供多个方法定义。当一个函数被应用于特殊的一组参数时，能用于这一组参数的最特定的方法会被使用。所以，函数的全体行为是他的不同的方法定义的行为的组合。如果这个组合被设计得好，即使方法们的实现之间会很不一样，函数的外部行为也会显得无缝而自洽。

当一个函数被应用时执行方法的选择被称为 **分派**。Julia 允许分派过程基于给定的参数个数和所有参数的类型来选择调用函数的哪个方法。这与传统的面对对象的语言不一样，面对对象语言的分派只基于第一参数，经常有特殊的参数语法，并且有时是暗含而非显式写成一个参数。
[^1] 使用函数的所有参数，而非只用第一个，来决定调用哪个方法被称为[多重分派](https://en.wikipedia.org/wiki/Multiple_dispatch)。多重分派对于数学代码来说特别有用，人工地将运算视为对于其中一个参数的属于程度比其他所有的参数都强的这个概念对于数学代码是几乎没有意义的：`x + y` 中的加法运算对 `x` 的属于程度比对 `y` 更强？一个数学运算符的实现普遍基于它所有的参数的类型。即使跳出数学运算，多重分派是对于结构和组织程序来说也是一个强大而方便的范式。

[^1]:
    In C++ or Java, for example, in a method call like `obj.meth(arg1,arg2)`, the object obj "receives"
    the method call and is implicitly passed to the method via the `this` keyword, rather than as
    an explicit method argument. When the current `this` object is the receiver of a method call,
    it can be omitted altogether, writing just `meth(arg1,arg2)`, with `this` implied as the receiving
    object.

## 定义方法

直到这里，在我们的例子中，我们定义的函数只有一个不限制参数类型的方法。这种函数的行为就与传统动态类型语言中的函数一样。不过，我们已经在没有意识到的情况下已经使用了多重分派和方法：所有 Julia 标准函数和运算符，就像之前提到的 `+` 函数，都根据参数的类型和数量的不同组合而定义了大量方法。

当定义一个函数时，可以根据需要使用在[复合类型](@ref)中介绍的 `::` 类型断言运算符来限制参数类型，

```jldoctest fofxy
julia> f(x::Float64, y::Float64) = 2x + y
f (generic function with 1 method)
```

这个函数只在 `x` 和 `y` 的类型都是
[`Float64`](@ref) 的情况下才会被调用：

```jldoctest fofxy
julia> f(2.0, 3.0)
7.0
```

用其它任意的参数类型则会导致 [`MethodError`](@ref):

```jldoctest fofxy
julia> f(2.0, 3)
ERROR: MethodError: no method matching f(::Float64, ::Int64)
Closest candidates are:
  f(::Float64, !Matched::Float64) at none:1

julia> f(Float32(2.0), 3.0)
ERROR: MethodError: no method matching f(::Float32, ::Float64)
Closest candidates are:
  f(!Matched::Float64, ::Float64) at none:1

julia> f(2.0, "3.0")
ERROR: MethodError: no method matching f(::Float64, ::String)
Closest candidates are:
  f(::Float64, !Matched::Float64) at none:1

julia> f("2.0", "3.0")
ERROR: MethodError: no method matching f(::String, ::String)
```

如同你所看到的，参数必须精确地是 [`Float64`](@ref) 类型。其它数字类型，比如整数或者 32 位浮点数值，都不会自动转化成 64 位浮点数，字符串也不会解析成数字。由于 `Float64` 是一个具体类型，且在 Julia 中具体类型无法拥有子类，所以这种定义方式只能适用于函数的输入类型精确地是 `Float64` 的情况，但一个常见的做法是用抽象类型来定义通用的方法：

```jldoctest fofxy
julia> f(x::Number, y::Number) = 2x - y
f (generic function with 2 methods)

julia> f(2.0, 3)
1.0
```

用上面这种方式定义的方法可以接收任意一对 [`Number`](@ref) 的实例参数，且它们不需要是同一类型的，只要求都是数值。如何根据不同的类型来做相应的处理就可以委托给表达式 `2x - y` 中的代数运算。

为了定义一个有多个方法的函数，只需简单定义这个函数多次，使用不同的参数数量和类型。函数的第一个方法定义会建立这个函数对象，后续的方法定义会添加新的方法到存在的函数对象中去。当函数被应用时，最符合参数的数量和类型的特定方法会被执行。所以，上面的两个方法定义在一起定义了函数`f`对于所有的一对虚拟类型`Number`实例的行为 -- 但是针对一对[`Float64`](@ref)值有不同的行为。如果一个参数是64位浮点数而另一个不是，`f(Float64,Float64)`方法不会被调用，而一定使用更加通用的`f(Number,Number)`方法：

```jldoctest fofxy
julia> f(2.0, 3.0)
7.0

julia> f(2, 3.0)
1.0

julia> f(2.0, 3)
1.0

julia> f(2, 3)
1
```

`2x + y` 定义只用于第一个情况，`2x - y` 定义用于其他的情况。没有使用任何自动的函数参数的指派或者类型转换：Julia中的所有转换都不是 magic 的，都是完全显式的。然而[类型转换和类型提升](@ref conversion-and-promotion)显示了足够先进的技术的智能应用能够与 magic 不可分辨到什么程度。[^Clarke61] 对于非数字值，和比两个参数更多或者更少的情况，函数 `f` 并没有定义，应用会导致 [`MethodError`](@ref)：

```jldoctest fofxy
julia> f("foo", 3)
ERROR: MethodError: no method matching f(::String, ::Int64)
Closest candidates are:
  f(!Matched::Number, ::Number) at none:1

julia> f()
ERROR: MethodError: no method matching f()
Closest candidates are:
  f(!Matched::Float64, !Matched::Float64) at none:1
  f(!Matched::Number, !Matched::Number) at none:1
```

可以简单地看到对于函数存在哪些方法，通过在交互式会话中键入函数对象本身：

```jldoctest fofxy
julia> f
f (generic function with 2 methods)
```

这个输出告诉我们`f`是有两个方法的函数对象。为了找出那些方法的特征是什么，使用 [`methods`](@ref)函数：

```julia-repl
julia> methods(f)
# 2 methods for generic function "f":
[1] f(x::Float64, y::Float64) in Main at none:1
[2] f(x::Number, y::Number) in Main at none:1
```

这表示`f`有两个方法，一个接受两个`Float64`参数一个接受两个`Number`类型的参数。它也显示了这些方法定义所在的文件和行数：因为这些方法是在REPL中定义的，我们得到了表面上的行数`none:1`.

没有`::`的类型声明，方法参数的类型默认为`Any`，这就意味着没有约束，因为Julia中的所有的值都是抽象类型`Any`的实例。所以，我们可以为`f`定义一个接受所有的方法，像这样：

```jldoctest fofxy
julia> f(x,y) = println("Whoa there, Nelly.")
f (generic function with 3 methods)

julia> f("foo", 1)
Whoa there, Nelly.
```

这个接受所有的方法比其他的对一堆参数值的其他任意可能的方法定义更不专用。所以他只会被没有其他方法定义应用的一对参数调用。

虽然这像是一个简单的概念，基于值的类型的多重分派可能是Julia语言的一个最强大和中心特性。核心运算符都典型地含有很多方法：

```julia-repl
julia> methods(+)
# 180 methods for generic function "+":
[1] +(x::Bool, z::Complex{Bool}) in Base at complex.jl:227
[2] +(x::Bool, y::Bool) in Base at bool.jl:89
[3] +(x::Bool) in Base at bool.jl:86
[4] +(x::Bool, y::T) where T<:AbstractFloat in Base at bool.jl:96
[5] +(x::Bool, z::Complex) in Base at complex.jl:234
[6] +(a::Float16, b::Float16) in Base at float.jl:373
[7] +(x::Float32, y::Float32) in Base at float.jl:375
[8] +(x::Float64, y::Float64) in Base at float.jl:376
[9] +(z::Complex{Bool}, x::Bool) in Base at complex.jl:228
[10] +(z::Complex{Bool}, x::Real) in Base at complex.jl:242
[11] +(x::Char, y::Integer) in Base at char.jl:40
[12] +(c::BigInt, x::BigFloat) in Base.MPFR at mpfr.jl:307
[13] +(a::BigInt, b::BigInt, c::BigInt, d::BigInt, e::BigInt) in Base.GMP at gmp.jl:392
[14] +(a::BigInt, b::BigInt, c::BigInt, d::BigInt) in Base.GMP at gmp.jl:391
[15] +(a::BigInt, b::BigInt, c::BigInt) in Base.GMP at gmp.jl:390
[16] +(x::BigInt, y::BigInt) in Base.GMP at gmp.jl:361
[17] +(x::BigInt, c::Union{UInt16, UInt32, UInt64, UInt8}) in Base.GMP at gmp.jl:398
...
[180] +(a, b, c, xs...) in Base at operators.jl:424
```

多重分派和灵活的参数类型系统让Julia有能力抽象地表达高层级算法，而与实现细节解耦，也能生成高效而专用的代码来在运行中处理每个情况。

## [方法歧义](@id man-ambiguities)

在一系列的函数方法定义时有可能没有单独的最专用的方法能适用于参数的某些组合：

```jldoctest gofxy
julia> g(x::Float64, y) = 2x + y
g (generic function with 1 method)

julia> g(x, y::Float64) = x + 2y
g (generic function with 2 methods)

julia> g(2.0, 3)
7.0

julia> g(2, 3.0)
8.0

julia> g(2.0, 3.0)
ERROR: MethodError: g(::Float64, ::Float64) is ambiguous. Candidates:
  g(x::Float64, y) in Main at none:1
  g(x, y::Float64) in Main at none:1
Possible fix, define
  g(::Float64, ::Float64)
```

这里`g(2.0,3.0)`的调用使用`g(Float64, Any)`和`g(Any, Float64)`都能处理，并且两个都不更加专用。在这样的情况下，Julia会扔出[`MethodError`](@ref)而非任意选择一个方法。你可以通过对交叉情况指定一个合适的方法来避免方法歧义：

```jldoctest gofxy
julia> g(x::Float64, y::Float64) = 2x + 2y
g (generic function with 3 methods)

julia> g(2.0, 3)
7.0

julia> g(2, 3.0)
8.0

julia> g(2.0, 3.0)
10.0
```

建议先定义没有歧义的方法，因为不这样的话，歧义就会存在，即使是暂时性的，直到更加专用的方法被定义。

在更加复杂的情况下，解决方法歧义会会涉及到设计的某一个元素；这个主题将会在[下面](@ref man-method-design-ambiguities)进行进一步的探索。

## 参数方法

方法定义可以视需要存在限定特征的类型参数：

```jldoctest same_typefunc
julia> same_type(x::T, y::T) where {T} = true
same_type (generic function with 1 method)

julia> same_type(x,y) = false
same_type (generic function with 2 methods)
```

第一个方法应用于两个参数都是同一个具体类型时，不管类型是什么，而第二个方法接受一切，涉及其他所有情况。所以，总得来说，这个定义了一个布尔函数来检查两个参数是否是同样的类型：

```jldoctest same_typefunc
julia> same_type(1, 2)
true

julia> same_type(1, 2.0)
false

julia> same_type(1.0, 2.0)
true

julia> same_type("foo", 2.0)
false

julia> same_type("foo", "bar")
true

julia> same_type(Int32(1), Int64(2))
false
```

这样的定义对应着那些类型签名是 `UnionAll` 类型的方法（参见 [UnionAll 类型](@ref)）。

在Julia中这种通过分派进行函数行为的定义是十分常见的，甚至是惯用的。方法类型参数并不局限于用作参数的类型：他们可以用在任意地方，只要值会在函数或者函数体的特征中。这里有个例子，例子中方法类型参数`T`用作方法特征中的参数类型`Vector{T}`的类型参数：

```jldoctest
julia> myappend(v::Vector{T}, x::T) where {T} = [v..., x]
myappend (generic function with 1 method)

julia> myappend([1,2,3],4)
4-element Array{Int64,1}:
 1
 2
 3
 4

julia> myappend([1,2,3],2.5)
ERROR: MethodError: no method matching myappend(::Array{Int64,1}, ::Float64)
Closest candidates are:
  myappend(::Array{T,1}, !Matched::T) where T at none:1

julia> myappend([1.0,2.0,3.0],4.0)
4-element Array{Float64,1}:
 1.0
 2.0
 3.0
 4.0

julia> myappend([1.0,2.0,3.0],4)
ERROR: MethodError: no method matching myappend(::Array{Float64,1}, ::Int64)
Closest candidates are:
  myappend(::Array{T,1}, !Matched::T) where T at none:1
```

如你所看到的，追加的元素的类型必须匹配它追加到的向量的元素类型，否则会引起[`MethodError`](@ref)。在下面的例子中，方法类型参量`T`用作返回值：

```jldoctest
julia> mytypeof(x::T) where {T} = T
mytypeof (generic function with 1 method)

julia> mytypeof(1)
Int64

julia> mytypeof(1.0)
Float64
```

就像你能在类型声明时通过类型参数对子类型进行约束一样（参见[参数类型](@ref)），你也可以约束方法的类型参数：

```jldoctest
julia> same_type_numeric(x::T, y::T) where {T<:Number} = true
same_type_numeric (generic function with 1 method)

julia> same_type_numeric(x::Number, y::Number) = false
same_type_numeric (generic function with 2 methods)

julia> same_type_numeric(1, 2)
true

julia> same_type_numeric(1, 2.0)
false

julia> same_type_numeric(1.0, 2.0)
true

julia> same_type_numeric("foo", 2.0)
ERROR: MethodError: no method matching same_type_numeric(::String, ::Float64)
Closest candidates are:
  same_type_numeric(!Matched::T, ::T) where T<:Number at none:1
  same_type_numeric(!Matched::Number, ::Number) at none:1

julia> same_type_numeric("foo", "bar")
ERROR: MethodError: no method matching same_type_numeric(::String, ::String)

julia> same_type_numeric(Int32(1), Int64(2))
false
```

`same_type_numeric`函数的行为与上面定义的`same_type`函数基本相似，但是它只对一对数定义。

参数方法允许与 `where` 表达式同样的语法用来写类型（参见 [UnionAll 类型](@ref)）。如果只有一个参数，封闭的大括号（在 `where {T}` 中）可以省略，但是为了清楚起见推荐写上。多个参数可以使用逗号隔开，例如 `where {T, S <: Real}`，或者使用嵌套的 `where` 来写，例如 `where S<:Real where T`。

重定义方法
------------------

当重定义一个方法或者增加一个方法时，知道这个变化不会立即生效很重要。这是Julia能够静态推断和编译代码使其运行很快而没有惯常的JIT技巧和额外开销的关键。实际上，任意新的方法定义不会对当前运行环境可见，包括Tasks和线程（和所有的之前定义的`@generated`函数）。让我们通过一个例子说明这意味着什么：

```julia-repl
julia> function tryeval()
           @eval newfun() = 1
           newfun()
       end
tryeval (generic function with 1 method)

julia> tryeval()
ERROR: MethodError: no method matching newfun()
The applicable method may be too new: running in world age xxxx1, while current world is xxxx2.
Closest candidates are:
  newfun() at none:1 (method too new to be called from this world context.)
 in tryeval() at none:1
 ...

julia> newfun()
1
```

在这个例子中看到`newfun`的新定义已经被创建，但是并不能立即调用。新的全局变量立即对`tryeval`函数可见，所以你可以写`return newfun`（没有小括号）。但是你，你的调用器，和他们调用的函数等等都不能调用这个新的方法定义！

但是这里有个例外：之后的*在 REPL 中*的 `newfun` 的调用会按照预期工作，能够见到并调用`newfun` 的新定义。

但是，之后的 `tryeval` 的调用将会继续看到 `newfun` 的定义，因为该定义*位于 REPL 的前一个语句中*并因此在之后的 `tryeval` 的调用之前。

你可以试试这个来让自己了解这是如何工作的。

这个行为的实现通过一个「world age 计数器」。这个单调递增的值会跟踪每个方法定义操作。此计数器允许用单个数字描述「对于给定运行时环境可见的方法定义集」，或者说「world age」。它还允许仅仅通过其序数值来比较在两个 world 中可用的方法。在上例中，我们看到（方法 `newfun` 所存在的）「current world」比局部于任务的「runtime world」大一，后者在 `tryeval` 开始执行时是固定的。

有时规避这个是必要的（例如，如果你在实现上面的REPL）。幸运的是这里有个简单地解决方法：使用[`Base.invokelatest`](@ref)调用函数：

```jldoctest
julia> function tryeval2()
           @eval newfun2() = 2
           Base.invokelatest(newfun2)
       end
tryeval2 (generic function with 1 method)

julia> tryeval2()
2
```

最后，让我们看一些这个规则生效的更复杂的例子。
定义一个函数`f(x)`，最开始有一个方法：

```jldoctest redefinemethod
julia> f(x) = "original definition"
f (generic function with 1 method)
```

开始一些使用`f(x)`的运算：

```jldoctest redefinemethod
julia> g(x) = f(x)
g (generic function with 1 method)

julia> t = @async f(wait()); yield();
```

现在我们给`f(x)`加上一些新的方法：

```jldoctest redefinemethod
julia> f(x::Int) = "definition for Int"
f (generic function with 2 methods)

julia> f(x::Type{Int}) = "definition for Type{Int}"
f (generic function with 3 methods)
```

比较一下这些结果如何不同：

```jldoctest redefinemethod
julia> f(1)
"definition for Int"

julia> g(1)
"definition for Int"

julia> fetch(schedule(t, 1))
"original definition"

julia> t = @async f(wait()); yield();

julia> fetch(schedule(t, 1))
"definition for Int"
```

## 使用参数方法设计样式


虽然复杂的分派逻辑对于性能或者可用性并不是必须的，但是有时这是表达某些算法的最好的方法。
这里有一些常见的设计样式，在以这个方法使用分派时有时会出现。

### 从超类型中提取出类型参数


这里是一个正确地代码模板，它返回`AbstractArray`的任意子类型的元素类型`T`:

```julia
abstract type AbstractArray{T, N} end
eltype(::Type{<:AbstractArray{T}}) where {T} = T
```
使用了所谓的三角分派。注意如果 `T` 是一个 `UnionAll` 类型，比如 `eltype(Array{T} where T <: Integer)`，会返回 `Any`（如同 `Base` 中的 `eltype` 一样）。

另外一个方法，这是在Julia v0.6中的三角分派到来之前的唯一正确方法，是：

```julia
abstract type AbstractArray{T, N} end
eltype(::Type{AbstractArray}) = Any
eltype(::Type{AbstractArray{T}}) where {T} = T
eltype(::Type{AbstractArray{T, N}}) where {T, N} = T
eltype(::Type{A}) where {A<:AbstractArray} = eltype(supertype(A))
```

另外一个可能性如下例，这可以对适配那些参数`T`需要更严格匹配的情况有用：
```julia
eltype(::Type{AbstractArray{T, N} where {T<:S, N<:M}}) where {M, S} = Any
eltype(::Type{AbstractArray{T, N} where {T<:S}}) where {N, S} = Any
eltype(::Type{AbstractArray{T, N} where {N<:M}}) where {M, T} = T
eltype(::Type{AbstractArray{T, N}}) where {T, N} = T
eltype(::Type{A}) where {A <: AbstractArray} = eltype(supertype(A))
```


一个常见的错误是试着使用内省来得到元素类型：

```julia
eltype_wrong(::Type{A}) where {A<:AbstractArray} = A.parameters[1]
```

但是创建一个这个方法会失败的情况不难：

```julia
struct BitVector <: AbstractArray{Bool, 1}; end
```

这里我们已经创建了一个没有参数的类型`BitVector`，但是元素类型已经完全指定了，`T`等于`Bool`！


### 用不同的类型参数构建相似的类型

当构建通用代码时，通常需要创建一些类似对象，在类型的布局上有一些变化，这就也让类型参数的变化变得必要。
例如，你会有一些任意元素类型的抽象数组，想使用特定的元素类型来编写你基于它的计算。你必须实现为每个`AbstractArray{T}`的子类型实现方法，这些方法描述了如何计算类型转换。从一个子类型转化成拥有一个不同参数的另一个子类型的通用方法在这里不存在。（快速复习：你明白为什么吗？）

`AbstractArray`的子类型典型情况下会实现两个方法来完成这个：
一个方法把输入输入转换成特定的`AbstractArray{T,N}`抽象类型的子类型；一个方法用特定的元素类型构建一个新的未初始化的数组。这些的样例实现可以在Julia Base里面找到。这里是一个基础的样例使用，保证`输入`与`输出`是同一种类型：

```julia
input = convert(AbstractArray{Eltype}, input)
output = similar(input, Eltype)
```

作为这个的扩展，在算法需要输入数组的拷贝的情况下，[`convert`](@ref)使无法胜任的，因为返回值可能只是原始输入的别名。把[`similar`](@ref)（构建输出数组）和[`copyto!`](@ref)（用输入数据填满）结合起来是需要给出输入参数的可变拷贝的一个范用方法：

```julia
copy_with_eltype(input, Eltype) = copyto!(similar(input, Eltype), input)
```

### 迭代分派

为了分派一个多层的参数参量列表，将每一层分派分开到不同的函数中常常是最好的。这可能听起来跟单分派的方法相似，但是你会在下面见到，这个更加灵活。

例如，尝试按照数组的元素类型进行分派常常会引起歧义。相反地，常见的代码会首先按照容易类型分派，然后基于eltype递归到更加更加专用的方法。在大部分情况下，算法会很方便地就屈从与这个分层方法，在其他情况下，这种严苛的工作必须手动解决。这个分派分支能被观察到，例如在两个矩阵的加法的逻辑中：

```julia
# 首先分派选择了逐元素相加的map算法。
+(a::Matrix, b::Matrix) = map(+, a, b)
# 然后分派处理了每个元素然后选择了计算的
# 恰当的常见元素类型。
+(a, b) = +(promote(a, b)...)
# 一旦元素有了相同类型，它们就可以相加。
# 例如，通过处理器暴露出的原始运算。
+(a::Float64, b::Float64) = Core.add(a, b)
```

### 基于 Trait 的分派

对于上面的可迭代分派的一个自然扩展是给方法选择加一个内涵层，这个层允许按照那些与类型层级定义的集合相独立的类型的集合来分派。我们可以通过写出问题中的类型的一个`Union`来创建这个一个集合，但是这不能够扩展，因为`Union`类型在创建之后无法改变。但是这么一个可扩展的集合可以通过一个叫做["Holy-trait"](https://github.com/JuliaLang/julia/issues/2345#issuecomment-54537633)的一个设计样式来实现。

这个样式是通过定义一个范用函数来实现，这个函数为函数参数可能属于的每个trait集合都计算出不同的单例值（或者类型）。如果这个函数是单纯的，这与通常的分派对于性能没有任何影响。

上一节的例子掩盖了[`map`](@ref)和[`promote`](@ref)的实现细节，这两个都是依据trait来进行运算的。当对一个矩阵进行迭代，比如`map`的实现中，一个重要的问题是按照什么顺序去遍历数据。当`AbstractArray`的子类型实现了[`Base.IndexStyle`](@ref)trait，其他函数，比如`map`就可以根据这个信息进行分派，以选择最好的算法（参见[抽象数组接口](@ref man-interface-array)）。这意味着每个子类型就没有必要去实现对应的`map`版本，因为通用的定义加trait类就能让系统选择最快的版本。这里一个玩具似的`map`实现说明了基于trait的分派：

```julia
map(f, a::AbstractArray, b::AbstractArray) = map(Base.IndexStyle(a, b), f, a, b)
# generic implementation:
map(::Base.IndexCartesian, f, a::AbstractArray, b::AbstractArray) = ...
# linear-indexing implementation (faster)
map(::Base.IndexLinear, f, a::AbstractArray, b::AbstractArray) = ...
```

这个基于trait的方法也出现在[`promote`](@ref)机制中，被标量`+`使用。
它使用了[`promote_type`](@ref)，这在知道两个计算对象的类型的情况下返回计算这个运算的最佳的常用类型。这就使得我们不用为每一对可能的类型参数实现每一个函数，而把问题简化为对于每个类型实现一个类型转换运算这样一个小很多的问题，还有一个优选的逐对的类型提升规则的表格。


### 输出类型计算

基于trait的类型提升的讨论可以过渡到我们的下一个设计样式：为矩阵运算计算输出元素类型。

为了实现像加法这样的原始运算，我们使用[`promote_type`](@ref)函数来计算想要的输出类型。（像之前一样，我们在`+`调用中的`promote`调用中见到了这个工作）。

对于矩阵的更加复杂的函数，对于更加复杂的运算符序列来计算预期的返回类型是必要的。这经常按下列步骤进行：

1. 编写一个小函数`op`来表示算法核心中使用的运算的集合。
2. 使用`promote_op(op, argument_types...)`计算结果矩阵的元素类型`R`，
   这里`argument_types`是通过应用到每个输入数组的`eltype`计算的。
3. 创建类似于`similar(R, dims)`的输出矩阵，这里`dims`是输出矩阵的预期维度数。

作为一个更加具体的例子，一个范用的方阵乘法的伪代码是：

```julia
function matmul(a::AbstractMatrix, b::AbstractMatrix)
    op = (ai, bi) -> ai * bi + ai * bi

    ## this is insufficient because it assumes `one(eltype(a))` is constructable:
    # R = typeof(op(one(eltype(a)), one(eltype(b))))

    ## this fails because it assumes `a[1]` exists and is representative of all elements of the array
    # R = typeof(op(a[1], b[1]))

    ## this is incorrect because it assumes that `+` calls `promote_type`
    ## but this is not true for some types, such as Bool:
    # R = promote_type(ai, bi)

    # this is wrong, since depending on the return value
    # of type-inference is very brittle (as well as not being optimizable):
    # R = Base.return_types(op, (eltype(a), eltype(b)))

    ## but, finally, this works:
    R = promote_op(op, eltype(a), eltype(b))
    ## although sometimes it may give a larger type than desired
    ## it will always give a correct type

    output = similar(b, R, (size(a, 1), size(b, 2)))
    if size(a, 2) > 0
        for j in 1:size(b, 2)
            for i in 1:size(a, 1)
                ## here we don't use `ab = zero(R)`,
                ## since `R` might be `Any` and `zero(Any)` is not defined
                ## we also must declare `ab::R` to make the type of `ab` constant in the loop,
                ## since it is possible that typeof(a * b) != typeof(a * b + a * b) == R
                ab::R = a[i, 1] * b[1, j]
                for k in 2:size(a, 2)
                    ab += a[i, k] * b[k, j]
                end
                output[i, j] = ab
            end
        end
    end
    return output
end
```

### 分离转换和内核逻辑

能有效减少编译时间和测试复杂度的一个方法是将预期的类型和计算转换的逻辑隔离。这会让编译器将与大型内核的其他部分相独立的类型转换逻辑特别化并内联。

将更大的类型类转换成被算法实际支持的特定参数类是一个常见的设计样式：

```julia
complexfunction(arg::Int) = ...
complexfunction(arg::Any) = complexfunction(convert(Int, arg))

matmul(a::T, b::T) = ...
matmul(a, b) = matmul(promote(a, b)...)
```

## 参数化约束的可变参数方法

函数参数也可以用于约束应用于"可变参数"函数（[变参函数](@ref)）的参数的数量。`Vararg{T,N}` 可用于表明这么一个约束。举个例子：

```jldoctest
julia> bar(a,b,x::Vararg{Any,2}) = (a,b,x)
bar (generic function with 1 method)

julia> bar(1,2,3)
ERROR: MethodError: no method matching bar(::Int64, ::Int64, ::Int64)
Closest candidates are:
  bar(::Any, ::Any, ::Any, !Matched::Any) at none:1

julia> bar(1,2,3,4)
(1, 2, (3, 4))

julia> bar(1,2,3,4,5)
ERROR: MethodError: no method matching bar(::Int64, ::Int64, ::Int64, ::Int64, ::Int64)
Closest candidates are:
  bar(::Any, ::Any, ::Any, ::Any) at none:1
```

更加有用的是，用一个参数就约束可变参数的方法是可能的。例如：

```julia
function getindex(A::AbstractArray{T,N}, indices::Vararg{Number,N}) where {T,N}
```

只会在`indices`的个数与数组的维数相同时才会调用。

当只有提供的参数的类型需要被约束时，`Vararg{T}`可以写成`T...`。例如`f(x::Int...) = x`是`f(x::Vararg{Int}) = x`的简便写法。

## 可选参数和关键字的参数的注意事项

与在[函数](@ref man-functions)中简要提到的一样，可选参数是使用多方法定义语法来实现的。例如，这个定义：

```julia
f(a=1,b=2) = a+2b
```

翻译成下列三个方法：

```julia
f(a,b) = a+2b
f(a) = f(a,2)
f() = f(1,2)
```

这就意味着调用`f()`等于调用`f(1,2)`。在这个情况下结果是`5`，因为`f(1,2)`使用的是上面`f`的第一个方法。但是，不总是需要是这种情况。如果你定义了第四个对于整数更加专用的方法：

```julia
f(a::Int,b::Int) = a-2b
```

此时`f()`和`f(1,2)`的结果都是`-3`。换句话说，可选参数只与函数捆绑，而不是函数的任意一个特定的方法。这个决定于使用的方法的可选参数的类型。当可选参数是用全局变量的形式定义时，可选参数的类型甚至会在运行时改变。

关键字参数与普通的位置参数的行为很不一样。特别地，他们不参与到方法分派中。方法只基于位置参数分派，在匹配得方法确定之后关键字参数才会被处理。

## 类函数对象

方法与类型相关，所以可以通过给类型加方法使得任意一个Julia类型变得"可被调用"。（这个"可调用"的对象有时称为"函子"。）

例如，你可以定义一个类型，存储着多项式的系数，但是行为像是一个函数，可以为多项式求值：

```jldoctest polynomial
julia> struct Polynomial{R}
           coeffs::Vector{R}
       end

julia> function (p::Polynomial)(x)
           v = p.coeffs[end]
           for i = (length(p.coeffs)-1):-1:1
               v = v*x + p.coeffs[i]
           end
           return v
       end

julia> (p::Polynomial)() = p(5)
```

注意函数是通过类型而非名字来指定的。如同普通函数一样这里有一个简洁的语法形式。在函数体内，`p`会指向被调用的对象。`Polynomial`会按如下方式使用：

```jldoctest polynomial
julia> p = Polynomial([1,10,100])
Polynomial{Int64}([1, 10, 100])

julia> p(3)
931

julia> p()
2551
```

这个机制也是Julia中类型构造函数和闭包（指向其环境的内部函数）的工作原理。

## 空泛型函数

有时引入一个没有添加方法的范用函数是有用的。这会用于分离实现与接口定义。这也可为了文档或者代码可读性。为了这个的语法是没有参数组的一个空`函数`块：

```julia
function emptyfunc
end
```

## [方法设计与避免歧义](@id man-method-design-ambiguities)

Julia的方法多态性是其最有力的特性之一，利用这个功能会带来设计上的挑战。特别地，在更加复杂的方法层级中出现[歧义](@ref man-ambiguities)不能说不常见。

在上面我们曾经指出我们可以像这样解决歧义

```julia
f(x, y::Int) = 1
f(x::Int, y) = 2
```

靠定义一个方法

```julia
f(x::Int, y::Int) = 3
```

这是经常使用的对的方案；但是有些环境下盲目地遵从这个建议会适得其反。特别地，范用函数有的方法越多，出现歧义的可能性越高。当你的方法层级比这些简单的例子更加复杂时，就值得你花时间去仔细想想其他的方案。

下面我们会讨论特别的一些挑战和解决这些挑战的一些可选方法。

### 元组和N元组参数

`Tuple`（和`NTuple`）参数会带来特别的挑战。例如，

```julia
f(x::NTuple{N,Int}) where {N} = 1
f(x::NTuple{N,Float64}) where {N} = 2
```

是有歧义的，因为存在`N == 0`的可能性：没有元素去确定`Int`还是`Float64`变体应该被调用。为了解决歧义，一个方法是为空元组定义方法：

```julia
f(x::Tuple{}) = 3
```

作为一种选择，对于其中一个方法之外的所有的方法可以坚持元组中至少有一个元素：

```julia
f(x::NTuple{N,Int}) where {N} = 1           # this is the fallback
f(x::Tuple{Float64, Vararg{Float64}}) = 2   # this requires at least one Float64
```

### [正交化你的设计](@id man-methods-orthogonalize)

当你打算根据两个或更多的参数进行分派时，考虑一下，一个「包裹」函数是否会让设计简单一些。举个例子，与其编写多变量：

```julia
f(x::A, y::A) = ...
f(x::A, y::B) = ...
f(x::B, y::A) = ...
f(x::B, y::B) = ...
```

不如考虑定义

```julia
f(x::A, y::A) = ...
f(x, y) = f(g(x), g(y))
```

这里`g`把参数转变为类型`A`。这是更加普遍的[正交设计](https://en.wikipedia.org/wiki/Orthogonality_(programming))原理的一个特别特殊的例子，在正交设计中不同的概念被分配到不同的方法中去。这里`g`最可能需要一个fallback定义

```julia
g(x::A) = x
```

一个相关的方案使用`promote`来把`x`和`y`变成常见的类型：

```julia
f(x::T, y::T) where {T} = ...
f(x, y) = f(promote(x, y)...)
```

这个设计的一个隐患是：如果没有合适的把 `x` 和 `y` 转换到同样类型的类型提升方法，第二个方法就可能无限自递归然后引发堆溢出。

### 一次只根据一个参数分派

如果你你需要根据多个参数进行分派，并且有太多的为了能定义所有可能的变量而存在的组合，而存在很多回退函数，你可以考虑引入"名字级联"，这里（例如）你根据第一个参数分配然后调用一个内部的方法：

```julia
f(x::A, y) = _fA(x, y)
f(x::B, y) = _fB(x, y)
```

接着内部方法`_fA`和`_fB`可以根据`y`进行分派，而不考虑有关`x`的歧义存在。

需要意识到这个方案至少有一个主要的缺点：在很多情况下，用户没有办法通过进一步定义你的输出函数`f`的具体行为来进一步定制`f`的行为。相反，他们需要去定义你的内部方法`_fA`和`_fB`的具体行为，这会模糊输出方法和内部方法之间的界线。

### 抽象容器与元素类型

在可能的情况下要试图避免定义根据抽象容器的具体元素类型来分派的方法。举个例子，

```julia
-(A::AbstractArray{T}, b::Date) where {T<:Date}
```

会引起歧义，当定义了这个方法：

```julia
-(A::MyArrayType{T}, b::T) where {T}
```

最好的方法是不要定义这些方法中的*任何一个*。相反，使用范用方法`-(A::AbstractArray, b)`并确认这个方法是使用*分别*对于每个容器类型和元素类型都是适用的通用调用(像`similar`和`-`)实现的。这只是建议[正交化](@ref man-methods-orthogonalize)你的方法的一个更加复杂的变种而已。

当这个方法不可行时，这就值得与其他开发者开始讨论如果解决歧义；只是因为一个函数先定义并不总是意味着他不能改变或者被移除。作为最后一个手段，开发者可以定义"创可贴"方法

```julia
-(A::MyArrayType{T}, b::Date) where {T<:Date} = ...
```

可以暴力解决歧义。

### 与默认参数的复杂方法"级联"

如果你定义了提供默认的方法"级联"，要小心去掉对应着潜在默认的任何参数。例如，假设你在写一个数字过滤算法，你有一个通过应用padding来出来信号的边的方法：

```julia
function myfilter(A, kernel, ::Replicate)
    Apadded = replicate_edges(A, size(kernel))
    myfilter(Apadded, kernel)  # now perform the "real" computation
end
```

这会与提供默认padding的方法产生冲突：

```julia
myfilter(A, kernel) = myfilter(A, kernel, Replicate()) # replicate the edge by default
```

这两个方法一起会生成无限的递归，`A`会不断变大。

更好的设计是像这样定义你的调用层级：

```julia
struct NoPad end  # indicate that no padding is desired, or that it's already applied

myfilter(A, kernel) = myfilter(A, kernel, Replicate())  # default boundary conditions

function myfilter(A, kernel, ::Replicate)
    Apadded = replicate_edges(A, size(kernel))
    myfilter(Apadded, kernel, NoPad())  # indicate the new boundary conditions
end

# other padding methods go here

function myfilter(A, kernel, ::NoPad)
    # Here's the "real" implementation of the core computation
end
```

`NoPad` 被置于与其他 padding 类型一致的参数位置上，这保持了分派层级的良好组织，同时降低了歧义的可能性。而且，它扩展了「公开」的 `myfilter` 接口：想要显式控制 padding 的用户可以直接调用 `NoPad` 变量。

[^Clarke61]: Arthur C. Clarke, *Profiles of the Future* (1961): Clarke's Third Law.
