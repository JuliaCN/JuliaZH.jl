# [性能建议](@id man-performance-tips)

下面几节简要地介绍了一些使 Julia 代码运行得尽可能快的技巧。

## 避免全局变量

全局变量的值和类型随时都会发生变化。 这使编译器难以优化使用全局变量的代码。 变量应该是局部的，或者尽可能作为参数传递给函数。

任何注重性能或者需要测试性能的代码都应该被放置在函数之中。

我们发现全局变量经常是常量，将它们声明为常量可以巨大的提升性能。

```julia
const DEFAULT_VAL = 0
```

对于非常量的全局变量可以通过在使用的地方标注它们的类型来优化效率。

```julia
global x = rand(1000)

function loop_over_global()
    s = 0.0
    for i in x::Vector{Float64}
        s += i
    end
    return s
end
```

一个更好的编程风格是将变量作为参数传给函数。这样可以使得代码更易复用，以及清晰的展示函数的输入和输出。

!!! note
    所有的REPL中的代码都是在全局作用域中求值的，因此在顶层的变量的定义与赋值都会成为一个**全局**变量。在模块的顶层作用域定义的变量也是全局变量。

在下面的REPL会话中：

```julia-repl
julia> x = 1.0
```

等价于

```julia-repl
julia> global x = 1.0
```

因此，所有上文关于性能问题的讨论都适用于它们。

## 使用 [`@time`](@ref)评估性能以及注意内存分配

[`@time`](@ref) 宏是一个有用的性能评估工具。这里我们将重复上面全局变量的例子，但是这次移除类型声明：

```jldoctest; setup = :(using Random; Random.seed!(1234)), filter = r"[0-9\.]+ seconds \(.*?\)"
julia> x = rand(1000);

julia> function sum_global()
           s = 0.0
           for i in x
               s += i
           end
           return s
       end;

julia> @time sum_global()
  0.017705 seconds (15.28 k allocations: 694.484 KiB)
496.84883432553846

julia> @time sum_global()
  0.000140 seconds (3.49 k allocations: 70.313 KiB)
496.84883432553846
```

在第一次调用函数(`@time sum_global()`)的时候，它会被编译。（如果你这次会话中还没有使用过[`@time`](@ref)，这时也会编译计时需要的相关函数。）你不必认真对待这次运行的结果。接下来看第二次运行，除了运行的耗时以外，它还表明了分配了大量的内存。我们这里仅仅是计算了一个64比特浮点向量元素和，因此这里应该没有申请内存的必要的（至少不用在`@time`报告的堆上申请内存）。

未被预料的内存分配往往说明你的代码中存在一些问题，这些问题常常是由于类型的稳定性或者创建了太多临时的小数组。因此，除了分配内存本身，这也很可能说明你所写的函数没有生成最佳的代码。认真对待这些现象，遵循接下来的建议。

如果你换成将`x`作为参数传给函数，就可以避免内存的分配（这里报告的内存分配是由于在全局作用域中运行`@time`导致的），而且在第一次运行之后运行速度也会得到显著的提高。

```jldoctest sumarg; setup = :(using Random; Random.seed!(1234)), filter = r"[0-9\.]+ seconds \(.*?\)"
julia> x = rand(1000);

julia> function sum_arg(x)
           s = 0.0
           for i in x
               s += i
           end
           return s
       end;

julia> @time sum_arg(x)
  0.007701 seconds (821 allocations: 43.059 KiB)
496.84883432553846

julia> @time sum_arg(x)
  0.000006 seconds (5 allocations: 176 bytes)
496.84883432553846
```

这里出现的5个内存分配是由于在全局作用域中运行`@time`宏导致的。如果我们在函数中运行时间测试，我们将发现事实上并没有发生任何内存分配。

```jldoctest sumarg; filter = r"[0-9\.]+ seconds"
julia> time_sum(x) = @time sum_arg(x);

julia> time_sum(x)
  0.000001 seconds
496.84883432553846
```

在一些情况下，你的函数需要分配新的内存，作为运算的一部分，这就会复杂化上面提到的简单的图像。在这样的情况下，考虑一下使用下面的[工具](@ref tools)之一来诊断问题，或者为函数写一个算法和内存分配分离的版本（参见[Pre-allocating outputs](@ref)）。
!!! note

对于更加正经的性能测试，考虑一下[BenchmarkTools.jl](https://github.com/JuliaCI/BenchmarkTools.jl)包，这个包除了其他方面之外会多次评估函数的性能以降低噪声。

## [工具](@id tools)

Julia和其包生态圈包含了能帮助你诊断问题和提高你的代码的性能表现的工具：

* [性能分析](@ref)允许你测量你运行的代码的性能表现并找出是性能瓶颈的代码。对于复杂的工程，[ProfileView](https://github.com/timholy/ProfileView.jl)能帮你将性能分析结果可视化。

* [Traceur](https://github.com/MikeInnes/Traceur.jl)包能帮你找到你代码中的常见性能问题。

* 没有预想到的巨大的内存申请 -- 像[`@time`](@ref)，[`@allocated`](@ref) 或者性能分析器（通过对于垃圾回收进程的调用）告诉你的一样 -- 提示着你的代码会有问题。 如果没有见到有关内存申请的其他原因，你需要怀疑这是一个类型问题。你也可以通过`-track-allocation=user`选项开启Julia并检查生成的`*.mem`文件来检查有关内存申请发生位置的信息。参见[内存分配分析](@ref)。

*`@code_warntype`生成你的代码的一个表示，对于找到会造成类型不确定的表达式有用。参见下面的[`@code_warntype`](@ref)。

## 避免拥有抽象类型参数的容器

当处理参数化类型，包括数组，时，最好尽可能避免通过抽象类型进行参数化。

考虑一下下面的代码：

```jldoctest
julia> a = Real[]
0-element Array{Real,1}

julia> push!(a, 1); push!(a, 2.0); push!(a, π)
3-element Array{Real,1}:
 1
 2.0
 π = 3.1415926535897...
```

因为`a`是一个抽象类型[`Real`](@ref)的数组，它必须能容纳任何一个`Real`值。因为`Real`对象可以有任意的大小和结构，`a`必须用指针的数组来表示，以便能独立地为`Real`对象进行内存分配。但是如果我们只允许同样类型的数，比如[`Float64`](@ref)，才能存在`a`中，它们就能被更有效率地存储：

```jldoctest
julia> a = Float64[]
0-element Array{Float64,1}

julia> push!(a, 1); push!(a, 2.0); push!(a,  π)
3-element Array{Float64,1}:
 1.0
 2.0
 3.141592653589793
```

把数字赋值给`a`会即时将数字转换成`Float64`并且`a`会按照64位浮点数值的连续的块来储存，这就能高效地处理。

也请参见在[参数类型](@ref)下的讨论。

## 类型声明

在有可选类型声明的语言中，添加声明是使代码运行更快的原则性方法。在Julia中*并不是*这种情况。在Julia中，编译器都知道所有的函数参数，局部变量和表达式的类型。但是，有一些特殊的情况下声明是有帮助的。

### 避免有抽象类型的域

类型能在不指定其域的类型的情况下被声明：

```jldoctest myambig
julia> struct MyAmbiguousType
           a
       end
```

这就允许`a`可以是任意类型。这经常很有用，但是有个缺点：对于类型`MyAmbiguousType`的对象，编译器不能够生成高性能的代码。原因是编译器使用对象的类型，而非值，来确定如何构建代码。不幸的是，几乎没有信息可以从类型`MyAmbiguousType`的对象中推导出来：

```jldoctest myambig
julia> b = MyAmbiguousType("Hello")
MyAmbiguousType("Hello")

julia> c = MyAmbiguousType(17)
MyAmbiguousType(17)

julia> typeof(b)
MyAmbiguousType

julia> typeof(c)
MyAmbiguousType
```

The values of `b` and `c` have the same type, yet their underlying representation of data in memory is very
different. Even if you stored just numeric values in field `a`, the fact that the memory representation
of a [`UInt8`](@ref) differs from a [`Float64`](@ref) also means that the CPU needs to handle
them using two different kinds of instructions. Since the required information is not available
in the type, such decisions have to be made at run-time. This slows performance.

通过声明 `a` 的类型，你能够做得更好。这里我们关注 `a` 可能是几种类型中任意一种的情况，在这种情况下，自然的一个解决方法是使用参数。例如：

```jldoctest myambig2
julia> mutable struct MyType{T<:AbstractFloat}
           a::T
       end
```

比下面这种更好

```jldoctest myambig2
julia> mutable struct MyStillAmbiguousType
           a::AbstractFloat
       end
```

因为第一种通过包装对象的类型指定了 `a` 的类型。
例如：

```jldoctest myambig2
julia> m = MyType(3.2)
MyType{Float64}(3.2)

julia> t = MyStillAmbiguousType(3.2)
MyStillAmbiguousType(3.2)

julia> typeof(m)
MyType{Float64}

julia> typeof(t)
MyStillAmbiguousType
域 `a` 的类型可以很容易地通过 `m` 的类型确定，而不是通过 `t` 的类型确定。事实上，在 `t` 中是可以改变域 `a` 的类型的：

```jldoctest myambig2
julia> typeof(t.a)
Float64

julia> t.a = 4.5f0
4.5f0

julia> typeof(t.a)
Float32
```

反之，一旦 `m` 被构建出来，`m.a` 的类型就不能够更改了。

```jldoctest myambig2
julia> m.a = 4.5f0
4.5f0

julia> typeof(m.a)
Float64
`m.a` 的类型是通过 `m` 的类型得知这一事实加上它的类型不能改变在函数中改变这一事实，这两者使得对于像 `m` 这样的对象编译器可以生成高度优化后的代码，但是对 `t` 这样的对象却不可以。
当然，如果我们将 `m` 构造成一个具体类型，那么这两者都可以。我们可以通过明确地使用一个抽象类型去构建它来破坏这一点：

```jldoctest myambig2
julia> m = MyType{AbstractFloat}(3.2)
MyType{AbstractFloat}(3.2)

julia> typeof(m.a)
Float64

julia> m.a = 4.5f0
4.5f0

julia> typeof(m.a)
Float32
```

对于一个实际的目的来说，这样的对象表现起来和那些 `MyStillAmbiguousType` 的对象一模一样。

比较为一个简单函数生成的代码的绝对数量是十分有指导意义的，

```julia
func(m::MyType) = m.a+1
```

使用

```julia
code_llvm(func, Tuple{MyType{Float64}})
code_llvm(func, Tuple{MyType{AbstractFloat}})
```

由于长度的原因，代码的结果没有在这里显示出来，但是你可能会希望自己去验证这一点。因为在第一种情况中，类型被完全指定了，在运行时，编译器不需要生成任何代码来决定类型。这就带来了更短和更快的代码。

### 避免有抽象容器的域

上面的做法同样也适用于容器的类型：

```jldoctest containers
julia> struct MySimpleContainer{A<:AbstractVector}
           a::A
       end

julia> struct MyAmbiguousContainer{T}
           a::AbstractVector{T}
       end
```

例如:

```jldoctest containers
julia> c = MySimpleContainer(1:3);

julia> typeof(c)
MySimpleContainer{UnitRange{Int64}}

julia> c = MySimpleContainer([1:3;]);

julia> typeof(c)
MySimpleContainer{Array{Int64,1}}

julia> b = MyAmbiguousContainer(1:3);

julia> typeof(b)
MyAmbiguousContainer{Int64}

julia> b = MyAmbiguousContainer([1:3;]);

julia> typeof(b)
MyAmbiguousContainer{Int64}
```

对于 `MySimpleContainer` 来说，它被它的类型和参数完全确定了，因此编译器能够生成优化过的代码。在大多数实例中，这点能够实现。

尽管编译器现在可以将它的工作做得非常好，但是还是有**你**可能希望你的代码能够能够根据 `a` 的**元素类型**做不同的事情的时候。通常达成这个目的最好的方式是将你的具体操作 (here, `foo`) 打包到一个独立的函数中。

```jldoctest containers
julia> function sumfoo(c::MySimpleContainer)
           s = 0
           for x in c.a
               s += foo(x)
           end
           s
       end
sumfoo (generic function with 1 method)

julia> foo(x::Integer) = x
foo (generic function with 1 method)

julia> foo(x::AbstractFloat) = round(x)
foo (generic function with 2 methods)
```

This keeps things simple, while allowing the compiler to generate optimized code in all cases.

However, there are cases where you may need to declare different versions of the outer function
for different element types or types of the `AbstractVector` of the field `a` in `MySimpleContainer`.
You could do it like this:

```jldoctest containers
julia> function myfunc(c::MySimpleContainer{<:AbstractArray{<:Integer}})
           return c.a[1]+1
       end
myfunc (generic function with 1 method)

julia> function myfunc(c::MySimpleContainer{<:AbstractArray{<:AbstractFloat}})
           return c.a[1]+2
       end
myfunc (generic function with 2 methods)

julia> function myfunc(c::MySimpleContainer{Vector{T}}) where T <: Integer
           return c.a[1]+3
       end
myfunc (generic function with 3 methods)
```

```jldoctest containers
julia> myfunc(MySimpleContainer(1:3))
2

julia> myfunc(MySimpleContainer(1.0:3))
3.0

julia> myfunc(MySimpleContainer([1:3;]))
4
```

### Annotate values taken from untyped locations

It is often convenient to work with data structures that may contain values of any type (arrays
of type `Array{Any}`). But, if you're using one of these structures and happen to know the type
of an element, it helps to share this knowledge with the compiler:

```julia
function foo(a::Array{Any,1})
    x = a[1]::Int32
    b = x+1
    ...
end
```

Here, we happened to know that the first element of `a` would be an [`Int32`](@ref). Making
an annotation like this has the added benefit that it will raise a run-time error if the
value is not of the expected type, potentially catching certain bugs earlier.

In the case that the type of `a[1]` is not known precisely, `x` can be declared via
`x = convert(Int32, a[1])::Int32`. The use of the [`convert`](@ref) function allows `a[1]`
to be any object convertible to an `Int32` (such as `UInt8`), thus increasing the genericity
of the code by loosening the type requirement. Notice that `convert` itself needs a type
annotation in this context in order to achieve type stability. This is because the compiler
cannot deduce the type of the return value of a function, even `convert`, unless the types of
all the function's arguments are known.

Type annotation will not enhance (and can actually hinder) performance if the type is constructed
at run-time. This is because the compiler cannot use the annotation to specialize the subsequent
code, and the type-check itself takes time. For example, in the code:

```julia
function nr(a, prec)
    ctype = prec == 32 ? Float32 : Float64
    b = Complex{ctype}(a)
    c = (b + 1.0f0)::Complex{ctype}
    abs(c)
end
```

the annotation of `c` harms performance. To write performant code involving types constructed at
run-time, use the [function-barrier technique](@ref kernal-functions) discussed below, and ensure
that the constructed type appears among the argument types of the kernel function so that the kernel
operations are properly specialized by the compiler. For example, in the above snippet, as soon as
`b` is constructed, it can be passed to another function `k`, the kernel. If, for example, function
`k` declares `b` as an argument of type `Complex{T}`, where `T` is a type parameter, then a type annotation
appearing in an assignment statement within `k` of the form:

```julia
c = (b + 1.0f0)::Complex{T}
```

does not hinder performance (but does not help either) since the compiler can determine the type of `c`
at the time `k` is compiled.

### 声明关键参数的类型

关键参数可以声明类型：

```julia
function with_keyword(x; name::Int = 1)
    ...
end
```

Functions are specialized on the types of keyword arguments, so these declarations will not affect
performance of code inside the function. However, they will reduce the overhead of calls to the
function that include keyword arguments.

Functions with keyword arguments have near-zero overhead for call sites that pass only positional
arguments.

在性能敏感的代码中应当避免传递像 `f(x; keywords...)` 的动态列表参数。

## Break functions into multiple definitions

将一个函数写成许多小的定义能让编译器直接调用最适合的代码，甚至能够直接将它内联。

这是一个真的该被写成许多小的定义的**复合函数**的例子：

```julia
using LinearAlgebra

function mynorm(A)
    if isa(A, Vector)
        return sqrt(real(dot(A,A)))
    elseif isa(A, Matrix)
        return maximum(svdvals(A))
    else
        error("mynorm: invalid argument")
    end
end
```

这可以更简洁有效地写成：

```julia
norm(x::Vector) = sqrt(real(dot(x, x)))
norm(A::Matrix) = maximum(svdvals(A))
```

It should however be noted that the compiler is quite efficient at optimizing away the dead branches in code
written as the `mynorm` example.

## 编写「类型稳定的」函数

如果可能，确保函数总是返回相同类型的值是有好处的。考虑以下定义：

```julia
pos(x) = x < 0 ? 0 : x
```

虽然这看起来挺合法的，但问题是 `0` 是一个（`Int` 类型的）整数而 `x` 可能是任何类型。于是，根据 `x` 的值，此函数可能返回两种类型中任何一种的值。这种行为是允许的，并且在某些情况下可能是合乎需要的。但它可以很容易地以如下方式修复：

```julia
pos(x) = x < 0 ? zero(x) : x
```

还有 [`oneunit`](@ref) 函数，以及更通用的 [`oftype(x, y)`](@ref) 函数，它返回被转换为 `x` 的类型的 `y`。

## 避免更改变量类型

类似的「类型稳定性」问题存在于在函数内重复使用的变量：

```julia
function foo()
    x = 1
    for i = 1:10
        x /= rand()
    end
    return x
end
```

局部变量 `x` 一开始是整数，在一次循环迭代后变为浮点数（[`/`](@ref) 运算符的结果）。这使得编译器更难优化循环体。有几种可能的解决方法：

  * 使用 `x = 1.0` 初始化 `x`
  * 声明 `x` 的类型：`x::Float64 = 1`
  * 使用显式的类型转换：`x = oneunit(Float64)`
  * 使用第一个循环迭代初始化，即 `x = 1 / rand()`，接着循环 `for i = 2:10`

## [Separate kernel functions (aka, function barriers)](@id kernal-functions)

Many functions follow a pattern of performing some set-up work, and then running many iterations
to perform a core computation. Where possible, it is a good idea to put these core computations
in separate functions. For example, the following contrived function returns an array of a randomly-chosen
type:

```jldoctest; setup = :(using Random; Random.seed!(1234))
julia> function strange_twos(n)
           a = Vector{rand(Bool) ? Int64 : Float64}(undef, n)
           for i = 1:n
               a[i] = 2
           end
           return a
       end;

julia> strange_twos(3)
3-element Array{Float64,1}:
 2.0
 2.0
 2.0
```

这应该写作：

```jldoctest; setup = :(using Random; Random.seed!(1234))
julia> function fill_twos!(a)
           for i = eachindex(a)
               a[i] = 2
           end
       end;

julia> function strange_twos(n)
           a = Vector{rand(Bool) ? Int64 : Float64}(undef, n)
           fill_twos!(a)
           return a
       end;

julia> strange_twos(3)
3-element Array{Float64,1}:
 2.0
 2.0
 2.0
```

Julia's compiler specializes code for argument types at function boundaries, so in the original
implementation it does not know the type of `a` during the loop (since it is chosen randomly).
Therefore the second version is generally faster since the inner loop can be recompiled as part
of `fill_twos!` for different types of `a`.

第二种形式通常是更好的风格，并且可以带来更多的代码的重复利用。

This pattern is used in several places in Julia Base. For example, see `vcat` and `hcat`
in [`abstractarray.jl`](https://github.com/JuliaLang/julia/blob/40fe264f4ffaa29b749bcf42239a89abdcbba846/base/abstractarray.jl#L1205-L1206),
or the [`fill!`](@ref) function, which we could have used instead of writing our own `fill_twos!`.

Functions like `strange_twos` occur when dealing with data of uncertain type, for example data
loaded from an input file that might contain either integers, floats, strings, or something else.

## Types with values-as-parameters

比方说你想创建一个每个维度大小都是3的 `N` 维数组。这种数组可以这样创建：

```jldoctest
julia> A = fill(5.0, (3, 3))
3×3 Array{Float64,2}:
 5.0  5.0  5.0
 5.0  5.0  5.0
 5.0  5.0  5.0
```

这个方法工作得很好：编译器可以识别出来 `A` 是一个 `Array{Float64,2}` 因为它知道填充值 (`5.0::Float64`) 的类型和维度 (`(3, 3)::NTuple{2,Int}`).

但是现在打比方说你想写一个函数，在任何一个维度下，它都创建一个 3×3×... 的数组；你可能会心动地写下一个函数

```jldoctest
julia> function array3(fillval, N)
           fill(fillval, ntuple(d->3, N))
       end
array3 (generic function with 1 method)

julia> array3(5.0, 2)
3×3 Array{Float64,2}:
 5.0  5.0  5.0
 5.0  5.0  5.0
 5.0  5.0  5.0
```

这确实有用，但是（你可以自己使用 `@code_warntype array3(5.0, 2)` 来验证）问题是输出地类型不能被推断出来：参数 `N` 是一个 `Int` 类型的**值**，而且类型推断不会（也不能）提前预测它的值。这意味着使用这个函数的结果的代码在每次获取 `A` 时都不得不保守地检查其类型；这样的代码将会是非常缓慢的。

Now, one very good way to solve such problems is by using the [function-barrier technique](@ref kernal-functions).
However, in some cases you might want to eliminate the type-instability altogether. In such cases,
one approach is to pass the dimensionality as a parameter, for example through `Val{T}()` (see
["Value types"](@ref)):

```jldoctest
julia> function array3(fillval, ::Val{N}) where N
           fill(fillval, ntuple(d->3, Val(N)))
       end
array3 (generic function with 1 method)

julia> array3(5.0, Val(2))
3×3 Array{Float64,2}:
 5.0  5.0  5.0
 5.0  5.0  5.0
 5.0  5.0  5.0
```

Julia has a specialized version of `ntuple` that accepts a `Val{::Int}` instance as the second
parameter; by passing `N` as a type-parameter, you make its "value" known to the compiler.
Consequently, this version of `array3` allows the compiler to predict the return type.

However, making use of such techniques can be surprisingly subtle. For example, it would be of
no help if you called `array3` from a function like this:

```julia
function call_array3(fillval, n)
    A = array3(fillval, Val(n))
end
```

Here, you've created the same problem all over again: the compiler can't guess what `n` is,
so it doesn't know the *type* of `Val(n)`. Attempting to use `Val`, but doing so incorrectly, can
easily make performance *worse* in many situations. (Only in situations where you're effectively
combining `Val` with the function-barrier trick, to make the kernel function more efficient, should
code like the above be used.)

一个正确使用 `Val` 的例子是这样的：

```julia
function filter3(A::AbstractArray{T,N}) where {T,N}
    kernel = array3(1, Val(N))
    filter(A, kernel)
end
```

In this example, `N` is passed as a parameter, so its "value" is known to the compiler. Essentially,
`Val(T)` works only when `T` is either hard-coded/literal (`Val(3)`) or already specified in the
type-domain.

## The dangers of abusing multiple dispatch (aka, more on types with values-as-parameters)

Once one learns to appreciate multiple dispatch, there's an understandable tendency to go crazy
and try to use it for everything. For example, you might imagine using it to store information,
e.g.

```
struct Car{Make, Model}
    year::Int
    ...more fields...
end
```

and then dispatch on objects like `Car{:Honda,:Accord}(year, args...)`.

This might be worthwhile when either of the following are true:

  * You require CPU-intensive processing on each `Car`, and it becomes vastly more efficient if you
    know the `Make` and `Model` at compile time and the total number of different `Make` or `Model`
    that will be used is not too large.
  * You have homogenous lists of the same type of `Car` to process, so that you can store them all
    in an `Array{Car{:Honda,:Accord},N}`.

When the latter holds, a function processing such a homogenous array can be productively specialized:
Julia knows the type of each element in advance (all objects in the container have the same concrete
type), so Julia can "look up" the correct method calls when the function is being compiled (obviating
the need to check at run-time) and thereby emit efficient code for processing the whole list.

When these do not hold, then it's likely that you'll get no benefit; worse, the resulting "combinatorial
explosion of types" will be counterproductive. If `items[i+1]` has a different type than `item[i]`,
Julia has to look up the type at run-time, search for the appropriate method in method tables,
decide (via type intersection) which one matches, determine whether it has been JIT-compiled yet
(and do so if not), and then make the call. In essence, you're asking the full type- system and
JIT-compilation machinery to basically execute the equivalent of a switch statement or dictionary
lookup in your own code.

Some run-time benchmarks comparing (1) type dispatch, (2) dictionary lookup, and (3) a "switch"
statement can be found [on the mailing list](https://groups.google.com/forum/#!msg/julia-users/jUMu9A3QKQQ/qjgVWr7vAwAJ).

Perhaps even worse than the run-time impact is the compile-time impact: Julia will compile specialized
functions for each different `Car{Make, Model}`; if you have hundreds or thousands of such types,
then every function that accepts such an object as a parameter (from a custom `get_year` function
you might write yourself, to the generic `push!` function in Julia Base) will have hundreds
or thousands of variants compiled for it. Each of these increases the size of the cache of compiled
code, the length of internal lists of methods, etc. Excess enthusiasm for values-as-parameters
can easily waste enormous resources.

## Access arrays in memory order, along columns

Multidimensional arrays in Julia are stored in column-major order. This means that arrays are
stacked one column at a time. This can be verified using the `vec` function or the syntax `[:]`
as shown below (notice that the array is ordered `[1 3 2 4]`, not `[1 2 3 4]`):

```jldoctest
julia> x = [1 2; 3 4]
2×2 Array{Int64,2}:
 1  2
 3  4

julia> x[:]
4-element Array{Int64,1}:
 1
 3
 2
 4
```

This convention for ordering arrays is common in many languages like Fortran, Matlab, and R (to
name a few). The alternative to column-major ordering is row-major ordering, which is the convention
adopted by C and Python (`numpy`) among other languages. Remembering the ordering of arrays can
have significant performance effects when looping over arrays. A rule of thumb to keep in mind
is that with column-major arrays, the first index changes most rapidly. Essentially this means
that looping will be faster if the inner-most loop index is the first to appear in a slice expression.

Consider the following contrived example. Imagine we wanted to write a function that accepts a
[`Vector`](@ref) and returns a square [`Matrix`](@ref) with either the rows or the columns filled with copies
of the input vector. Assume that it is not important whether rows or columns are filled with these
copies (perhaps the rest of the code can be easily adapted accordingly). We could conceivably
do this in at least four ways (in addition to the recommended call to the built-in [`repeat`](@ref)):

```julia
function copy_cols(x::Vector{T}) where T
    inds = axes(x, 1)
    out = similar(Array{T}, inds, inds)
    for i = inds
        out[:, i] = x
    end
    return out
end

function copy_rows(x::Vector{T}) where T
    inds = axes(x, 1)
    out = similar(Array{T}, inds, inds)
    for i = inds
        out[i, :] = x
    end
    return out
end

function copy_col_row(x::Vector{T}) where T
    inds = axes(x, 1)
    out = similar(Array{T}, inds, inds)
    for col = inds, row = inds
        out[row, col] = x[row]
    end
    return out
end

function copy_row_col(x::Vector{T}) where T
    inds = axes(x, 1)
    out = similar(Array{T}, inds, inds)
    for row = inds, col = inds
        out[row, col] = x[col]
    end
    return out
end
```

Now we will time each of these functions using the same random `10000` by `1` input vector:

```julia-repl
julia> x = randn(10000);

julia> fmt(f) = println(rpad(string(f)*": ", 14, ' '), @elapsed f(x))

julia> map(fmt, Any[copy_cols, copy_rows, copy_col_row, copy_row_col]);
copy_cols:    0.331706323
copy_rows:    1.799009911
copy_col_row: 0.415630047
copy_row_col: 1.721531501
```

Notice that `copy_cols` is much faster than `copy_rows`. This is expected because `copy_cols`
respects the column-based memory layout of the `Matrix` and fills it one column at a time. Additionally,
`copy_col_row` is much faster than `copy_row_col` because it follows our rule of thumb that the
first element to appear in a slice expression should be coupled with the inner-most loop.

## Pre-allocating outputs

If your function returns an `Array` or some other complex type, it may have to allocate memory.
Unfortunately, oftentimes allocation and its converse, garbage collection, are substantial bottlenecks.

Sometimes you can circumvent the need to allocate memory on each function call by preallocating
the output. As a trivial example, compare

```jldoctest prealloc
julia> function xinc(x)
           return [x, x+1, x+2]
       end;

julia> function loopinc()
           y = 0
           for i = 1:10^7
               ret = xinc(i)
               y += ret[2]
           end
           return y
       end;
```

with

```jldoctest prealloc
julia> function xinc!(ret::AbstractVector{T}, x::T) where T
           ret[1] = x
           ret[2] = x+1
           ret[3] = x+2
           nothing
       end;

julia> function loopinc_prealloc()
           ret = Vector{Int}(undef, 3)
           y = 0
           for i = 1:10^7
               xinc!(ret, i)
               y += ret[2]
           end
           return y
       end;
```

Timing results:

```jldoctest prealloc; filter = r"[0-9\.]+ seconds \(.*?\)"
julia> @time loopinc()
  0.529894 seconds (40.00 M allocations: 1.490 GiB, 12.14% gc time)
50000015000000

julia> @time loopinc_prealloc()
  0.030850 seconds (6 allocations: 288 bytes)
50000015000000
```

Preallocation has other advantages, for example by allowing the caller to control the "output"
type from an algorithm. In the example above, we could have passed a `SubArray` rather than an
[`Array`](@ref), had we so desired.

Taken to its extreme, pre-allocation can make your code uglier, so performance measurements and
some judgment may be required. However, for "vectorized" (element-wise) functions, the convenient
syntax `x .= f.(y)` can be used for in-place operations with fused loops and no temporary arrays
(see the [dot syntax for vectorizing functions](@ref man-vectorized)).

## More dots: Fuse vectorized operations

Julia has a special [dot syntax](@ref man-vectorized) that converts
any scalar function into a "vectorized" function call, and any operator
into a "vectorized" operator, with the special property that nested
"dot calls" are *fusing*: they are combined at the syntax level into
a single loop, without allocating temporary arrays. If you use `.=` and
similar assignment operators, the result can also be stored in-place
in a pre-allocated array (see above).

In a linear-algebra context, this means that even though operations like
`vector + vector` and `vector * scalar` are defined, it can be advantageous
to instead use `vector .+ vector` and `vector .* scalar` because the
resulting loops can be fused with surrounding computations. For example,
consider the two functions:

```jldoctest dotfuse
julia> f(x) = 3x.^2 + 4x + 7x.^3;

julia> fdot(x) = @. 3x^2 + 4x + 7x^3 # equivalent to 3 .* x.^2 .+ 4 .* x .+ 7 .* x.^3;
```

Both `f` and `fdot` compute the same thing. However, `fdot`
(defined with the help of the [`@.`](@ref @__dot__) macro) is
significantly faster when applied to an array:

```jldoctest dotfuse; filter = r"[0-9\.]+ seconds \(.*?\)"
julia> x = rand(10^6);

julia> @time f(x);
  0.019049 seconds (16 allocations: 45.777 MiB, 18.59% gc time)

julia> @time fdot(x);
  0.002790 seconds (6 allocations: 7.630 MiB)

julia> @time f.(x);
  0.002626 seconds (8 allocations: 7.630 MiB)
```

That is, `fdot(x)` is ten times faster and allocates 1/6 the
memory of `f(x)`, because each `*` and `+` operation in `f(x)` allocates
a new temporary array and executes in a separate loop. (Of course,
if you just do `f.(x)` then it is as fast as `fdot(x)` in this
example, but in many contexts it is more convenient to just sprinkle
some dots in your expressions rather than defining a separate function
for each vectorized operation.)

## Consider using views for slices

In Julia, an array "slice" expression like `array[1:5, :]` creates
a copy of that data (except on the left-hand side of an assignment,
where `array[1:5, :] = ...` assigns in-place to that portion of `array`).
If you are doing many operations on the slice, this can be good for
performance because it is more efficient to work with a smaller
contiguous copy than it would be to index into the original array.
On the other hand, if you are just doing a few simple operations on
the slice, the cost of the allocation and copy operations can be
substantial.

An alternative is to create a "view" of the array, which is
an array object (a `SubArray`) that actually references the data
of the original array in-place, without making a copy. (If you
write to a view, it modifies the original array's data as well.)
This can be done for individual slices by calling [`view`](@ref),
or more simply for a whole expression or block of code by putting
[`@views`](@ref) in front of that expression. For example:

```jldoctest; filter = r"[0-9\.]+ seconds \(.*?\)"
julia> fcopy(x) = sum(x[2:end-1]);

julia> @views fview(x) = sum(x[2:end-1]);

julia> x = rand(10^6);

julia> @time fcopy(x);
  0.003051 seconds (7 allocations: 7.630 MB)

julia> @time fview(x);
  0.001020 seconds (6 allocations: 224 bytes)
```

Notice both the 3× speedup and the decreased memory allocation
of the `fview` version of the function.

## Copying data is not always bad

Arrays are stored contiguously in memory, lending themselves to CPU vectorization
and fewer memory accesses due to caching. These are the same reasons that it is recommended
to access arrays in column-major order (see above). Irregular access patterns and non-contiguous views
can drastically slow down computations on arrays because of non-sequential memory access.

Copying irregularly-accessed data into a contiguous array before operating on it can result
in a large speedup, such as in the example below. Here, a matrix and a vector are being accessed at
800,000 of their randomly-shuffled indices before being multiplied. Copying the views into
plain arrays speeds up the multiplication even with the cost of the copying operation.

```julia-repl
julia> using Random

julia> x = randn(1_000_000);

julia> inds = shuffle(1:1_000_000)[1:800000];

julia> A = randn(50, 1_000_000);

julia> xtmp = zeros(800_000);

julia> Atmp = zeros(50, 800_000);

julia> @time sum(view(A, :, inds) * view(x, inds))
  0.412156 seconds (14 allocations: 960 bytes)
-4256.759568345458

julia> @time begin
           copyto!(xtmp, view(x, inds))
           copyto!(Atmp, view(A, :, inds))
           sum(Atmp * xtmp)
       end
  0.285923 seconds (14 allocations: 960 bytes)
-4256.759568345134
```

Provided there is enough memory for the copies, the cost of copying the view to an array is
far outweighed by the speed boost from doing the matrix multiplication on a contiguous array.

## Avoid string interpolation for I/O

When writing data to a file (or other I/O device), forming extra intermediate strings is a source
of overhead. Instead of:

```julia
println(file, "$a $b")
```

请写成这样：

```julia
println(file, a, " ", b)
```

The first version of the code forms a string, then writes it to the file, while the second version
writes values directly to the file. Also notice that in some cases string interpolation can be
harder to read. Consider:

```julia
println(file, "$(f(a))$(f(b))")
```

versus:

```julia
println(file, f(a), f(b))
```

## Optimize network I/O during parallel execution

When executing a remote function in parallel:

```julia
using Distributed

responses = Vector{Any}(undef, nworkers())
@sync begin
    for (idx, pid) in enumerate(workers())
        @async responses[idx] = remotecall_fetch(pid, foo, args...)
    end
end
```

is faster than:

```julia
using Distributed

refs = Vector{Any}(undef, nworkers())
for (idx, pid) in enumerate(workers())
    refs[idx] = @spawnat pid foo(args...)
end
responses = [fetch(r) for r in refs]
```

The former results in a single network round-trip to every worker, while the latter results in
two network calls - first by the [`@spawnat`](@ref) and the second due to the [`fetch`](@ref)
(or even a [`wait`](@ref)).
The [`fetch`](@ref)/[`wait`](@ref) is also being executed serially resulting in an overall poorer performance.

## Fix deprecation warnings

A deprecated function internally performs a lookup in order to print a relevant warning only once.
This extra lookup can cause a significant slowdown, so all uses of deprecated functions should
be modified as suggested by the warnings.

## Tweaks

These are some minor points that might help in tight inner loops.

  * Avoid unnecessary arrays. For example, instead of [`sum([x,y,z])`](@ref) use `x+y+z`.
  * Use [`abs2(z)`](@ref) instead of [`abs(z)^2`](@ref) for complex `z`. In general, try to rewrite
    code to use [`abs2`](@ref) instead of [`abs`](@ref) for complex arguments.
  * Use [`div(x,y)`](@ref) for truncating division of integers instead of [`trunc(x/y)`](@ref), [`fld(x,y)`](@ref)
    instead of [`floor(x/y)`](@ref), and [`cld(x,y)`](@ref) instead of [`ceil(x/y)`](@ref).

## [Performance Annotations](@id man-performance-annotations)

Sometimes you can enable better optimization by promising certain program properties.

  * Use [`@inbounds`](@ref) to eliminate array bounds checking within expressions. Be certain before doing
    如果下标越界，会发生崩溃或潜在的故障
  * Use [`@fastmath`](@ref) to allow floating point optimizations that are correct for real numbers, but lead
    to differences for IEEE numbers. Be careful when doing this, as this may change numerical results.
    This corresponds to the `-ffast-math` option of clang.
  * Write [`@simd`](@ref) in front of `for` loops to promise that the iterations are independent and may be
    reordered.  Note that in many cases, Julia can automatically vectorize code without the `@simd` macro;
    it is only beneficial in cases where such a transformation would otherwise be illegal, including cases
    like allowing floating-point re-associativity and ignoring dependent memory accesses (`@simd ivdep`).
    Again, be very careful when asserting `@simd` as erroneously annotating a loop with dependent iterations
    may result in unexpected results. In particular, note that `setindex!` on some `AbstractArray` subtypes is
    inherently dependent upon iteration order. **This feature is experimental**
    and could change or disappear in future versions of Julia.

The common idiom of using 1:n to index into an AbstractArray is not safe if the Array uses unconventional indexing,
and may cause a segmentation fault if bounds checking is turned off. Use `LinearIndices(x)` or `eachindex(x)`
instead (see also [offset-arrays](https://docs.julialang.org/en/latest/devdocs/offset-arrays)).

!!!note
    While `@simd` needs to be placed directly in front of an innermost `for` loop, both `@inbounds` and `@fastmath`
    can be applied to either single expressions or all the expressions that appear within nested blocks of code, e.g.,
    using `@inbounds begin` or `@inbounds for ...`.

Here is an example with both `@inbounds` and `@simd` markup (we here use `@noinline` to prevent
the optimizer from trying to be too clever and defeat our benchmark):

```julia
@noinline function inner(x, y)
    s = zero(eltype(x))
    for i=eachindex(x)
        @inbounds s += x[i]*y[i]
    end
    return s
end

@noinline function innersimd(x, y)
    s = zero(eltype(x))
    @simd for i = eachindex(x)
        @inbounds s += x[i] * y[i]
    end
    return s
end

function timeit(n, reps)
    x = rand(Float32, n)
    y = rand(Float32, n)
    s = zero(Float64)
    time = @elapsed for j in 1:reps
        s += inner(x, y)
    end
    println("GFlop/sec        = ", 2n*reps / time*1E-9)
    time = @elapsed for j in 1:reps
        s += innersimd(x, y)
    end
    println("GFlop/sec (SIMD) = ", 2n*reps / time*1E-9)
end

timeit(1000, 1000)
```

On a computer with a 2.4GHz Intel Core i5 processor, this produces:

```
GFlop/sec        = 1.9467069505224963
GFlop/sec (SIMD) = 17.578554163920018
```

(`GFlop/sec` measures the performance, and larger numbers are better.)

Here is an example with all three kinds of markup. This program first calculates the finite difference
of a one-dimensional array, and then evaluates the L2-norm of the result:

```julia
function init!(u::Vector)
    n = length(u)
    dx = 1.0 / (n-1)
    @fastmath @inbounds @simd for i in 1:n #by asserting that `u` is a `Vector` we can assume it has 1-based indexing
        u[i] = sin(2pi*dx*i)
    end
end

function deriv!(u::Vector, du)
    n = length(u)
    dx = 1.0 / (n-1)
    @fastmath @inbounds du[1] = (u[2] - u[1]) / dx
    @fastmath @inbounds @simd for i in 2:n-1
        du[i] = (u[i+1] - u[i-1]) / (2*dx)
    end
    @fastmath @inbounds du[n] = (u[n] - u[n-1]) / dx
end

function mynorm(u::Vector)
    n = length(u)
    T = eltype(u)
    s = zero(T)
    @fastmath @inbounds @simd for i in 1:n
        s += u[i]^2
    end
    @fastmath @inbounds return sqrt(s/n)
end

function main()
    n = 2000
    u = Vector{Float64}(undef, n)
    init!(u)
    du = similar(u)

    deriv!(u, du)
    nu = mynorm(du)

    @time for i in 1:10^6
        deriv!(u, du)
        nu = mynorm(du)
    end

    println(nu)
end

main()
```

On a computer with a 2.7 GHz Intel Core i7 processor, this produces:

```
$ julia wave.jl;
  1.207814709 seconds
4.443986180758249

$ julia --math-mode=ieee wave.jl;
  4.487083643 seconds
4.443986180758249
```

Here, the option `--math-mode=ieee` disables the `@fastmath` macro, so that we can compare results.

In this case, the speedup due to `@fastmath` is a factor of about 3.7. This is unusually large
– in general, the speedup will be smaller. (In this particular example, the working set of the
benchmark is small enough to fit into the L1 cache of the processor, so that memory access latency
does not play a role, and computing time is dominated by CPU usage. In many real world programs
this is not the case.) Also, in this case this optimization does not change the result – in
general, the result will be slightly different. In some cases, especially for numerically unstable
algorithms, the result can be very different.

The annotation `@fastmath` re-arranges floating point expressions, e.g. changing the order of
evaluation, or assuming that certain special cases (inf, nan) cannot occur. In this case (and
on this particular computer), the main difference is that the expression `1 / (2*dx)` in the function
`deriv` is hoisted out of the loop (i.e. calculated outside the loop), as if one had written
`idx = 1 / (2*dx)`. In the loop, the expression `... / (2*dx)` then becomes `... * idx`, which
is much faster to evaluate. Of course, both the actual optimization that is applied by the compiler
as well as the resulting speedup depend very much on the hardware. You can examine the change
in generated code by using Julia's [`code_native`](@ref) function.

Note that `@fastmath` also assumes that `NaN`s will not occur during the computation, which can lead to surprising behavior:

```julia-repl
julia> f(x) = isnan(x);

julia> f(NaN)
true

julia> f_fast(x) = @fastmath isnan(x);

julia> f_fast(NaN)
false
```

## Treat Subnormal Numbers as Zeros

Subnormal numbers, formerly called [denormal numbers](https://en.wikipedia.org/wiki/Denormal_number),
are useful in many contexts, but incur a performance penalty on some hardware. A call [`set_zero_subnormals(true)`](@ref)
grants permission for floating-point operations to treat subnormal inputs or outputs as zeros,
which may improve performance on some hardware. A call [`set_zero_subnormals(false)`](@ref) enforces
strict IEEE behavior for subnormal numbers.

Below is an example where subnormals noticeably impact performance on some hardware:

```julia
function timestep(b::Vector{T}, a::Vector{T}, Δt::T) where T
    @assert length(a)==length(b)
    n = length(b)
    b[1] = 1                            # Boundary condition
    for i=2:n-1
        b[i] = a[i] + (a[i-1] - T(2)*a[i] + a[i+1]) * Δt
    end
    b[n] = 0                            # Boundary condition
end

function heatflow(a::Vector{T}, nstep::Integer) where T
    b = similar(a)
    for t=1:div(nstep,2)                # Assume nstep is even
        timestep(b,a,T(0.1))
        timestep(a,b,T(0.1))
    end
end

heatflow(zeros(Float32,10),2)           # Force compilation
for trial=1:6
    a = zeros(Float32,1000)
    set_zero_subnormals(iseven(trial))  # Odd trials use strict IEEE arithmetic
    @time heatflow(a,1000)
end
```

This gives an output similar to

```
  0.002202 seconds (1 allocation: 4.063 KiB)
  0.001502 seconds (1 allocation: 4.063 KiB)
  0.002139 seconds (1 allocation: 4.063 KiB)
  0.001454 seconds (1 allocation: 4.063 KiB)
  0.002115 seconds (1 allocation: 4.063 KiB)
  0.001455 seconds (1 allocation: 4.063 KiB)
```

Note how each even iteration is significantly faster.

This example generates many subnormal numbers because the values in `a` become an exponentially
decreasing curve, which slowly flattens out over time.

Treating subnormals as zeros should be used with caution, because doing so breaks some identities,
such as `x-y == 0` implies `x == y`:

```jldoctest
julia> x = 3f-38; y = 2f-38;

julia> set_zero_subnormals(true); (x - y, x == y)
(0.0f0, false)

julia> set_zero_subnormals(false); (x - y, x == y)
(1.0000001f-38, false)
```

In some applications, an alternative to zeroing subnormal numbers is to inject a tiny bit of noise.
 For example, instead of initializing `a` with zeros, initialize it with:

```julia
a = rand(Float32,1000) * 1.f-9
```

## [[`@code_warntype`](@ref)](@id man-code-warntype)

The macro [`@code_warntype`](@ref) (or its function variant [`code_warntype`](@ref)) can sometimes
be helpful in diagnosing type-related problems. Here's an example:

```julia-repl
julia> @noinline pos(x) = x < 0 ? 0 : x;

julia> function f(x)
           y = pos(x)
           sin(y*x + 1)
       end;

julia> @code_warntype f(3.2)
Body::Float64
2 1 ─ %1  = invoke Main.pos(%%x::Float64)::UNION{FLOAT64, INT64}
3 │   %2  = isa(%1, Float64)::Bool
  └──       goto 3 if not %2
  2 ─ %4  = π (%1, Float64)
  │   %5  = Base.mul_float(%4, %%x)::Float64
  └──       goto 6
  3 ─ %7  = isa(%1, Int64)::Bool
  └──       goto 5 if not %7
  4 ─ %9  = π (%1, Int64)
  │   %10 = Base.sitofp(Float64, %9)::Float64
  │   %11 = Base.mul_float(%10, %%x)::Float64
  └──       goto 6
  5 ─       Base.error("fatal error in type inference (type bound)")
  └──       unreachable
  6 ┄ %15 = φ (2 => %5, 4 => %11)::Float64
  │   %16 = Base.add_float(%15, 1.0)::Float64
  │   %17 = invoke Main.sin(%16::Float64)::Float64
  └──       return %17
```

Interpreting the output of [`@code_warntype`](@ref), like that of its cousins [`@code_lowered`](@ref),
[`@code_typed`](@ref), [`@code_llvm`](@ref), and [`@code_native`](@ref), takes a little practice.
Your code is being presented in form that has been heavily digested on its way to generating
compiled machine code. Most of the expressions are annotated by a type, indicated by the `::T`
(where `T` might be [`Float64`](@ref), for example). The most important characteristic of [`@code_warntype`](@ref)
is that non-concrete types are displayed in red; in the above example, such output is shown in
uppercase.

At the top, the inferred return type of the function is shown as `Body::Float64`.
The next lines represent the body of `f` in Julia's SSA IR form.
The numbered boxes are labels and represent targets for jumps (via `goto`) in your code.
Looking at the body, you can see that the first thing that happens is that `pos` is called and the
return value has been inferred as the `Union` type `UNION{FLOAT64, INT64}` shown in uppercase since
it is a non-concrete type. This means that we cannot know the exact return type of `pos` based on the
input types. However, the result of `y*x`is a `Float64` no matter if `y` is a `Float64` or `Int64`
The net result is that `f(x::Float64)` will not be type-unstable
in its output, even if some of the intermediate computations are type-unstable.

How you use this information is up to you. Obviously, it would be far and away best to fix `pos`
to be type-stable: if you did so, all of the variables in `f` would be concrete, and its performance
would be optimal. However, there are circumstances where this kind of *ephemeral* type instability
might not matter too much: for example, if `pos` is never used in isolation, the fact that `f`'s
output is type-stable (for [`Float64`](@ref) inputs) will shield later code from the propagating
effects of type instability. This is particularly relevant in cases where fixing the type instability
is difficult or impossible. In such cases, the tips above (e.g., adding type annotations and/or
breaking up functions) are your best tools to contain the "damage" from type instability.
Also, note that even Julia Base has functions that are type unstable.
For example, the function [`findfirst`](@ref) returns the index into an array where a key is found,
or `nothing` if it is not found, a clear type instability. In order to make it easier to find the
type instabilities that are likely to be important, `Union`s containing either `missing` or `nothing`
are color highlighted in yellow, instead of red.

The following examples may help you interpret expressions marked as containing non-leaf types:

  * Function body starting with `Body::UNION{T1,T2})`
      * Interpretation: function with unstable return type
      * Suggestion: make the return value type-stable, even if you have to annotate it

  * `invoke Main.g(%%x::Int64)::UNION{FLOAT64, INT64}`
      * Interpretation: call to a type-unstable function `g`.
      * Suggestion: fix the function, or if necessary annotate the return value

  * `invoke Base.getindex(%%x::Array{Any,1}, 1::Int64)::ANY`
      * Interpretation: accessing elements of poorly-typed arrays
      * Suggestion: use arrays with better-defined types, or if necessary annotate the type of individual
        element accesses

  * `Base.getfield(%%x, :(:data))::ARRAY{FLOAT64,N} WHERE N`
      * Interpretation: getting a field that is of non-leaf type. In this case, `ArrayContainer` had a
        field `data::Array{T}`. But `Array` needs the dimension `N`, too, to be a concrete type.
      * Suggestion: use concrete types like `Array{T,3}` or `Array{T,N}`, where `N` is now a parameter
        of `ArrayContainer`

## [被捕获变量的性能](@id man-performance-captured)

请考虑以下定义内部函数的示例：
```julia
function abmult(r::Int)
    if r < 0
        r = -r
    end
    f = x -> x * r
    return f
end
```

函数 `abmult` 返回一个函数 `f`，它将其参数乘以 `r` 的绝对值。赋值给 `f` 的函数称为「闭包」。内部函数还被语言用于 `do` 代码块和生成器表达式。

这种代码风格为语言带来了性能挑战。解析器在将其转换为较低级别的指令时，基本上通过将内部函数提取到单独的代码块来重新组织上述代码。「被捕获的」变量，比如 `r`，被内部函数共享，且包含它们的作用域会被提取到内部函数和外部函数皆可访问的堆分配「box」中，这是因为语言指定内部作用域中的 `r` 必须与外部作用域中的 `r` 相同，就算在外部作用域（或另一个内部函数）修改 `r` 后也需如此。

前一段的讨论中提到了「解析器」，也就是，包含 `abmult` 的模块被首次加载时发生的编译前期，而不是首次调用它的编译后期。解析器不「知道」`Int` 是固定类型，也不知道语句 `r = -r` 将一个 `Int` 转换为另一个 `Int`。类型推断的魔力在编译后期生效。

因此，解析器不知道 `r` 具有固定类型（`Int`）。一旦内部函数被创建，`r` 的值也不会改变（因此也不需要 box）。因此，解析器向包含具有抽象类型（比如 `Any`）的对象的 box 发出代码，这对于每次出现的 `r` 都需要运行时类型分派。这可以通过在上述函数中使用 `@code_warntype` 来验证。装箱和运行时的类型分派都有可能导致性能损失。

如果捕获的变量用于代码的性能关键部分，那么以下提示有助于确保它们的使用具有高效性。首先，如果已经知道被捕获的变量不会改变类型，则可以使用类型注释来显式声明类型（在变量上，而不是在右侧）：
```julia
function abmult2(r0::Int)
    r::Int = r0
    if r < 0
        r = -r
    end
    f = x -> x * r
    return f
end
```
类型注释部分恢复由于捕获而导致的丢失性能，因为解析器可以将具体类型与 box 中的对象相关联。更进一步，如果被捕获的变量不再需要 box（因为它不会在闭包创建后被重新分配），就可以用 `let` 代码块表示，如下所示。
```julia
function abmult3(r::Int)
    if r < 0
        r = -r
    end
    f = let r = r
            x -> x * r
    end
    return f
end
```
`let` 代码块创建了一个新的变量 `r`，它的作用域只是内部函数。第二种技术在捕获变量存在时完全恢复了语言性能。请注意，这是编译器的一个快速发展的方面，未来的版本可能不需要依靠这种程度的程序员注释来获得性能。与此同时，一些用户提供的包（如 [FastClosures](https://github.com/c42f/FastClosures.jl)）会自动插入像在 `abmult3` 中那样的 `let` 语句。
