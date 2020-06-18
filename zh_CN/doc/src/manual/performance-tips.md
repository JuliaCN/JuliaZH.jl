# [性能建议](@id man-performance-tips)

下面几节简要地介绍了一些使 Julia 代码运行得尽可能快的技巧。

## 避免全局变量

全局变量的值和类型随时都会发生变化， 这使编译器难以优化使用全局变量的代码。 变量应该是局部的，或者尽可能作为参数传递给函数。

任何注重性能或者需要测试性能的代码都应该被放置在函数之中。

我们发现全局变量经常是常量，将它们声明为常量可大幅提升性能。

```julia
const DEFAULT_VAL = 0
```

对于非常量的全局变量可以通过在使用的时候标注它们的类型来优化。

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
    All code in the REPL is evaluated in global scope, so a variable defined and assigned
    at top level will be a **global** variable. Variables defined at top level scope inside
    modules are also global.

在下面的REPL会话中：

```julia-repl
julia> x = 1.0
```

等价于：

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

在第一次调用函数(`@time sum_global()`)的时候，它会被编译。如果你这次会话中还没有使用过[`@time`](@ref)，这时也会编译计时需要的相关函数。你不必认真对待这次运行的结果。接下来看第二次运行，除了运行的耗时以外，它还表明了分配了大量的内存。我们这里仅仅是计算了一个64位浮点向量元素和，因此这里应该没有申请内存的必要（至少不用在`@time`报告的堆上申请内存）。

未被预料的内存分配往往说明你的代码中存在一些问题，这些问题常常是由于类型的稳定性或者创建了太多临时的小数组。因此，除了分配内存本身，这也很可能说明你所写的函数远没有生成性能良好的代码。认真对待这些现象，遵循接下来的建议。

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

这里出现的5个内存分配是由于在全局作用域中运行`@time`宏导致的。如果我们在函数内运行时间测试，我们将发现事实上并没有发生任何内存分配。

```jldoctest sumarg; filter = r"[0-9\.]+ seconds"
julia> time_sum(x) = @time sum_arg(x);

julia> time_sum(x)
  0.000001 seconds
496.84883432553846
```

In some situations, your function may need to allocate memory as part of its operation, and this
can complicate the simple picture above. In such cases, consider using one of the [tools](@ref tools)
below to diagnose problems, or write a version of your function that separates allocation from
its algorithmic aspects (see [Pre-allocating outputs](@ref)).

!!! note
    For more serious benchmarking, consider the [BenchmarkTools.jl](https://github.com/JuliaCI/BenchmarkTools.jl)
    package which among other things evaluates the function multiple times in order to reduce noise.

## [Tools](@id tools)

Julia and its package ecosystem includes tools that may help you diagnose problems and improve
the performance of your code:

  * [Profiling](@ref) allows you to measure the performance of your running code and identify lines
    that serve as bottlenecks. For complex projects, the [ProfileView](https://github.com/timholy/ProfileView.jl)
    package can help you visualize your profiling results.
  * The [Traceur](https://github.com/JunoLab/Traceur.jl) package can help you find common performance problems in your code.
  * Unexpectedly-large memory allocations--as reported by [`@time`](@ref), [`@allocated`](@ref), or
    the profiler (through calls to the garbage-collection routines)--hint that there might be issues
    with your code. If you don't see another reason for the allocations, suspect a type problem.
     You can also start Julia with the `--track-allocation=user` option and examine the resulting
    `*.mem` files to see information about where those allocations occur. See [Memory allocation analysis](@ref).
  * `@code_warntype` generates a representation of your code that can be helpful in finding expressions
    that result in type uncertainty. See [`@code_warntype`](@ref) below.

## [Avoid containers with abstract type parameters](@id man-performance-abstract-container)

When working with parameterized types, including arrays, it is best to avoid parameterizing with
abstract types where possible.

Consider the following:

```jldoctest
julia> a = Real[]
Real[]

julia> push!(a, 1); push!(a, 2.0); push!(a, π)
3-element Array{Real,1}:
 1
 2.0
 π = 3.1415926535897...
```

因为`a`是一个抽象类型[`Real`](@ref)的数组，它必须能容纳任何一个`Real`值。因为`Real`对象可以有任意的大小和结构，`a`必须用指针的数组来表示，以便能独立地为`Real`对象进行内存分配。但是如果我们只允许同样类型的数，比如[`Float64`](@ref)，才能存在`a`中，它们就能被更有效率地存储：

```jldoctest
julia> a = Float64[]
Float64[]

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

### 避免有抽象类型的字段

类型能在不指定其字段的类型的情况下被声明：

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

`b` 和 `c` 的值具有相同类型，但它们在内存中的数据的底层表示十分不同。即使你只在字段 `a` 中存储数值，[`UInt8`](@ref) 的内存表示与 [`Float64`](@ref) 也是不同的，这也意味着 CPU 需要使用两种不同的指令来处理它们。因为该类型中不提供所需的信息，所以必须在运行时进行这些判断。而这会降低性能。

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
```

字段 `a` 的类型可以很容易地通过 `m` 的类型确定，而不是通过 `t` 的类型确定。事实上，在 `t` 中是可以改变字段 `a` 的类型的：

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
```

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

### 避免使用带抽象容器的字段

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

这使事情变得简单，同时也允许编译器在所有情况下生成经过优化的代码。

但是，在某些情况下，你可能需要声明外部函数的不同版本，这可能是为了不同的元素类型，也可能是为了 `MySimpleContainer` 中的字段 `a` 所具有的不同 `AbstractVector` 类型。你可以这样做：

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

### 对从无类型位置获取的值进行类型注释

使用可能包含任何类型的值的数据结构（如类型为 `Array{Any}` 的数组）经常是很方便的。但是，如果你正在使用这些数据结构之一，并且恰巧知道某个元素的类型，那么让编译器也知道这一点会有所帮助：

```julia
function foo(a::Array{Any,1})
    x = a[1]::Int32
    b = x+1
    ...
end
```

在这里，我们恰巧知道 `a` 的第一个元素是个 [`Int32`](@ref)。留下这样的注释还有另外的好处，它将在该值不是预期类型时引发运行时错误，而这可能会更早地捕获某些错误。

在没有确切知道 `a[1]` 的类型的情况下，`x` 可以通过 `x = convert(Int32, a[1])::Int32` 来声明。使用 [`convert`](@ref) 函数则允许 `a[1]` 是可转换为 `Int32` 的任何对象（比如 `UInt8`），从而通过放松类型限制来提高代码的通用性。请注意，`convert` 本身在此上下文中需要类型注释才能实现类型稳定性。这是因为除非该函数所有参数的类型都已知，否则编译器无法推导出该函数返回值的类型，即使其为 `convert`。

如果类型注释中的类型是在运行时构造的，那么类型注释不会增强（并且实际上可能会降低）性能。这是因为编译器无法使用该类型注释来专门化代码，而类型检查本身又需要时间。例如，在以下代码中：

```julia
function nr(a, prec)
    ctype = prec == 32 ? Float32 : Float64
    b = Complex{ctype}(a)
    c = (b + 1.0f0)::Complex{ctype}
    abs(c)
end
```

the annotation of `c` harms performance. To write performant code involving types constructed at
run-time, use the [function-barrier technique](@ref kernel-functions) discussed below, and ensure
that the constructed type appears among the argument types of the kernel function so that the kernel
operations are properly specialized by the compiler. For example, in the above snippet, as soon as
`b` is constructed, it can be passed to another function `k`, the kernel. If, for example, function
`k` declares `b` as an argument of type `Complex{T}`, where `T` is a type parameter, then a type annotation
appearing in an assignment statement within `k` of the form:

```julia
c = (b + 1.0f0)::Complex{T}
```

不会降低性能（但也不会提高），因为编译器可以在编译 `k` 时确定 `c` 的类型。

### Be aware of when Julia avoids specializing

As a heuristic, Julia avoids automatically specializing on argument type parameters in three
specific cases: `Type`, `Function`, and `Vararg`. Julia will always specialize when the argument is
used within the method, but not if the argument is just passed through to another function. This
usually has no performance impact at runtime and
[improves compiler performance](@ref compiler-efficiency-issues). If you find it does have a
performance impact at runtime in your case, you can trigger specialization by adding a type
parameter to the method declaration. Here are some examples:

This will not specialize:

```julia
function f_type(t)  # or t::Type
    x = ones(t, 10)
    return sum(map(sin, x))
end
```

but this will:

```julia
function g_type(t::Type{T}) where T
    x = ones(T, 10)
    return sum(map(sin, x))
end
```

These will not specialize:

```julia
f_func(f, num) = ntuple(f, div(num, 2))
g_func(g::Function, num) = ntuple(g, div(num, 2))
```

but this will:

```julia
h_func(h::H, num) where {H} = ntuple(h, div(num, 2))
```

This will not specialize:

```julia
f_vararg(x::Int...) = tuple(x...)
```

but this will:

```julia
g_vararg(x::Vararg{Int, N}) where {N} = tuple(x...)
```

One only needs to introduce a single type parameter to force specialization, even if the other types are unconstrained. For example, this will also specialize, and is useful when the arguments are not all of the same type:
```julia
h_vararg(x::Vararg{Any, N}) where {N} = tuple(x...)
```

Note that [`@code_typed`](@ref) and friends will always show you specialized code, even if Julia
would not normally specialize that method call. You need to check the
[method internals](@ref ast-lowered-method) if you want to see whether specializations are generated
when argument types are changed, i.e., if `(@which f(...)).specializations` contains specializations
for the argument in question.

## 将函数拆分为多个定义

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

然而，应该注意的是，编译器会十分高效地优化掉编写得如同 `mynorm` 例子的代码中的死分支。

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
  * Declare the type of `x` explicitly as `x::Float64 = 1`
  * Use an explicit conversion by `x = oneunit(Float64)`
  * 使用第一个循环迭代初始化，即 `x = 1 / rand()`，接着循环 `for i = 2:10`

## [Separate kernel functions (aka, function barriers)](@id kernel-functions)

许多函数遵循这一模式：先执行一些设置工作，再通过多次迭代来执行核心计算。如果可行，将这些核心计算放在单独的函数中是个好主意。例如，以下做作的函数返回一个数组，其类型是随机选择的。

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

Julia 的编译器会在函数边界处针对参数类型特化代码，因此在原始的实现中循环期间无法得知 `a` 的类型（因为它是随即选择的）。于是，第二个版本通常更快，因为对于不同类型的 `a`，内层循环都可被重新编译为 `fill_twos!` 的一部分。

第二种形式通常是更好的风格，并且可以带来更多的代码的重复利用。

这个模式在 Julia Base 的几个地方中有使用。相关的例子，请参阅 [`abstractarray.jl`](https://github.com/JuliaLang/julia/blob/40fe264f4ffaa29b749bcf42239a89abdcbba846/base/abstractarray.jl#L1205-L1206) 中的 `vcat` 和 `hcat`，或者 [`fill!`](@ref) 函数，我们可使用该函数而不是编写自己的 `fill_twos!`。

诸如 `strange_twos` 的函数会在处理具有不确定类型的数据时出现，例如从可能包含整数、浮点数、字符串或其它内容的输入文件中加载的数据。

## [Types with values-as-parameters](@id man-performance-value-type)

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

Now, one very good way to solve such problems is by using the [function-barrier technique](@ref kernel-functions).
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

Once one learns to appreciate multiple dispatch, there's an understandable tendency to go overboard
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

## [Access arrays in memory order, along columns](@id man-performance-column-major)

Julia 中的多维数组以列主序存储。这意味着数组一次堆叠一列。这可使用 `vec` 函数或语法 `[:]` 来验证，如下所示（请注意，数组的顺序是 `[1 3 2 4]`，而不是 `[1 2 3 4]`）：

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
Keep in mind that indexing an array with `:` is an implicit loop that iteratively accesses all elements within a particular dimension; it can be faster to extract columns than rows, for example.

考虑以下人为示例。假设我们想编写一个接收 [`Vector`](@ref) 并返回方阵 [`Matrix`](@ref) 的函数，所返回方阵的行或列都用输入向量的副本填充。并假设用这些副本填充的是行还是列并不重要（也许可以很容易地相应调整剩余代码）。我们至少可以想到四种方式（除了建议的调用内置函数 [`repeat`](@ref)）：

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

现在，我们使用相同的 `10000` 乘 `1` 的随机输入向量来对这些函数计时。

```julia-repl
julia> x = randn(10000);

julia> fmt(f) = println(rpad(string(f)*": ", 14, ' '), @elapsed f(x))

julia> map(fmt, [copy_cols, copy_rows, copy_col_row, copy_row_col]);
copy_cols:    0.331706323
copy_rows:    1.799009911
copy_col_row: 0.415630047
copy_row_col: 1.721531501
```

请注意，`copy_cols` 比 `copy_rows` 快得多。这与预料的一致，因为 `copy_cols` 尊重 `Matrix` 基于列的内存布局。另外，`copy_col_row` 比 `copy_row_col` 快得多，因为它遵循我们的经验法则，即切片表达式中出现的第一个元素应该与最内层循环耦合。

## 输出预分配

如果函数返回 `Array` 或其它复杂类型，则可能需要分配内存。不幸的是，内存分配及其反面垃圾收集通常是很大的瓶颈。

有时，你可以通过预分配输出结果来避免在每个函数调用上分配内存的需要。作为一个简单的例子，比较

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

和

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

计时结果：

```jldoctest prealloc; filter = r"[0-9\.]+ seconds \(.*?\)"
julia> @time loopinc()
  0.529894 seconds (40.00 M allocations: 1.490 GiB, 12.14% gc time)
50000015000000

julia> @time loopinc_prealloc()
  0.030850 seconds (6 allocations: 288 bytes)
50000015000000
```

预分配还有其它优点，例如允许调用者在算法中控制「输出」类型。在上述例子中，我们如果需要，可以传递 `SubArray` 而不是 [`Array`](@ref)。

极端情况下，预分配可能会使你的代码更丑陋，所以可能需要做性能测试和一些判断。但是，对于「向量化」（逐元素）函数，方便的语法 `x .= f.(y)` 可用于具有融合循环的 in-place 操作且无需临时数组（请参阅[向量化函数的点语法](@ref man-vectorized)）。

## 点语法：融合向量化操作

Julia 有特殊的[点语法](@ref man-vectorized)，它可以将任何标量函数转换为「向量化」函数调用，将任何运算符转换为「向量化」运算符，其具有的特殊性质是嵌套「点调用」是*融合的*：它们在语法层级被组合为单个循环，无需分配临时数组。如果你使用 `.=` 和类似的赋值运算符，则结果也可以 in-place 存储在预分配的数组（参见上文）。

在线性代数的上下文中，这意味着即使诸如 `vector + vector` 和 `vector * scalar` 之类的运算，使用 `vector .+ vector` 和 `vector .* scalar` 来替代也可能是有利的，因为生成的循环可与周围的计算融合。例如，考虑两个函数：

```jldoctest dotfuse
julia> f(x) = 3x.^2 + 4x + 7x.^3;

julia> fdot(x) = @. 3x^2 + 4x + 7x^3 # equivalent to 3 .* x.^2 .+ 4 .* x .+ 7 .* x.^3;
```

`f` 和 `fdot` 都做相同的计算。但是，`fdot`（在 [`@.`](@ref @__dot__) 宏的帮助下定义）在作用于数组时明显更快：

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

## [Consider using views for slices](@id man-performance-views)

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

请注意，该函数的 `fview` 版本提速了 3 倍且减少了内存分配。

## 复制数据不总是坏的

数组被连续地存储在内存中，这使其可被 CPU 向量化，并且会由于缓存减少内存访问。这与建议以列序优先方式访问数组的原因相同（请参见上文）。由于不按顺序访问内存，无规律的访问方式和不连续的视图可能会大大减慢数组上的计算速度。

在对无规律访问的数据进行操作前，将其复制到连续的数组中可能带来巨大的加速，正如下例所示。其中，矩阵和向量在相乘前会访问其 800,000 个已被随机混洗的索引处的值。将视图复制到普通数组会加速乘法，即使考虑了复制操作的成本。

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

倘若副本本身的内存足够大，那么将视图复制到数组的成本可能远远超过在连续数组上执行矩阵乘法所带来的加速。

## 避免 I/0 中的字符串插值

将数据写入到文件（或其他 I/0 设备）中时，生成额外的中间字符串会带来开销。请不要写成这样：

```julia
println(file, "$a $b")
```

请写成这样：

```julia
println(file, a, " ", b)
```

第一个版本的代码生成一个字符串，然后将其写入到文件中，而第二个版本直接将值写入到文件中。另请注意，在某些情况下，字符串插值可能更难阅读。请考虑：

```julia
println(file, "$(f(a))$(f(b))")
```

与：

```julia
println(file, f(a), f(b))
```

## 并发执行时优化网络 I/O

当并发地执行一个远程函数时：

```julia
using Distributed

responses = Vector{Any}(undef, nworkers())
@sync begin
    for (idx, pid) in enumerate(workers())
        @async responses[idx] = remotecall_fetch(foo, pid, args...)
    end
end
```

会快于：

```julia
using Distributed

refs = Vector{Any}(undef, nworkers())
for (idx, pid) in enumerate(workers())
    refs[idx] = @spawnat pid foo(args...)
end
responses = [fetch(r) for r in refs]
```

第一种方式导致每个worker一次网络往返，而第二种方式是两次网络调用：一次 [`@spawnat`](@ref) 一次[`fetch`](@ref)
（甚至是 [`wait`](@ref)）。
[`fetch`](@ref) 和[`wait`](@ref) 都是同步执行，会导致较差的性能。

## 修复过期警告

过期的函数在内部会执行查找，以便仅打印一次相关警告。
这种额外查找可能会显著影响性能，因此应根据警告建议修复掉过期函数的所有使用。

## 小技巧

有一些小的注意事项可能会帮助改善循环性能。

  * 避免使用不必要的数组。比如，使用 `x+y+z` 而不是 [`sum([x,y,z])`](@ref)。
  * 对于复数 `z`，使用 [`abs2(z)`](@ref) 而不是 [`abs(z)^2`](@ref)。一般的，
    对于复数参数，用 [`abs2`](@ref) 代替[`abs`](@ref)。
  * 对于直接截断的整除，使用 [`div(x,y)`](@ref) 而不是 [`trunc(x/y)`](@ref)，使用[`fld(x,y)`](@ref)
    而不是 [`floor(x/y)`](@ref)，使用 [`cld(x,y)`](@ref) 而不是 [`ceil(x/y)`](@ref)。

## [性能标注](@id man-performance-annotations)

有时，你可以通过承诺某些程序性质来启用更好的优化。

  * 使用 [`@inbounds`](@ref) 来取消表达式中的数组边界检查。使用前请再三确定，如果下标越界，可能会发生崩溃或潜在的故障。
     
  * 使用 [`@fastmath`](@ref) 来允许对于实数是正确的、但是对于 IEEE 数字会导致差异的浮点数优化。使用时请多多小心，因为这可能改变数值结果。这对应于 clang 的 `-ffast-math` 选项。
     
     
  * 在 `for` 循环前编写 [`@simd`](@ref) 来承诺迭代是相互独立且可以重新排序的。请注意，在许多情况下，Julia 可以在没有 `@simd` 宏的情况下自动向量化代码；只有在这种转换原本是非法的情况下才有用，包括允许浮点数重新结合和忽略相互依赖的内存访问（`@simd ivdep`）等情况。此外，在断言 `@simd` 时要十分小心，因为错误地标注一个具有相互依赖的迭代的循环可能导致意外结果。尤其要注意的是，某些 `AbstractArray` 子类型的 `setindex!` 本质上依赖于迭代顺序。**此功能是实验性的**，在 Julia 未来的版本中可能会更改或消失。
     
     
     
     
     
     
     

The common idiom of using 1:n to index into an AbstractArray is not safe if the Array uses unconventional indexing,
and may cause a segmentation fault if bounds checking is turned off. Use `LinearIndices(x)` or `eachindex(x)`
instead (see also [Arrays with custom indices](@ref man-custom-indices)).

!!! note
    虽然 `@simd` 需要直接放在最内层 `for` 循环前面，但 `@inbounds` 和 `@fastmath` 都可作用于单个表达式或在嵌套代码块中出现的所有表达式，例如，可使用 `@inbounds begin` 或 `@inbounds for ...`。

下面是一个具有 `@inbounds` 和 `@simd` 标记的例子（我们这里使用 `@noinline` 来防止因优化器过于智能而破坏我们的基准测试）：

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

在配备 2.4GHz Intel Core i5 处理器的计算机上，其结果为：

```
GFlop/sec        = 1.9467069505224963
GFlop/sec (SIMD) = 17.578554163920018
```

（`GFlop/sec` 用来测试性能，数值越大越好。）

下面是一个具有三种标记的例子。此程序首先计算一个一维数组的有限差分，然后计算结果的 L2 范数：

```julia
function init!(u::Vector)
    n = length(u)
    dx = 1.0 / (n-1)
    @fastmath @inbounds @simd for i in 1:n # 通过断言 `u` 是一个 `Vector`，我们可以假定它具有 1-based 索引
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
    @fastmath @inbounds return sqrt(s)
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

在配备 2.7 GHz Intel Core i7 处理器的计算机上，其结果为：

```
$ julia wave.jl;
  1.207814709 seconds
4.443986180758249

$ julia --math-mode=ieee wave.jl;
  4.487083643 seconds
4.443986180758249
```

在这里，选项 `--math-mode=ieee` 禁用 `@fastmath` 宏，好让我们可以比较结果。

在这种情况下，`@fastmath` 加速了大约 3.7 倍。这非常大——通常来说，加速会更小。（在这个特定的例子中，基准测试的工作集足够小，可以放在该处理器的 L1 缓存中，因此内存访问延迟不起作用，计算时间主要由 CPU 使用率决定。在许多现实世界的程序中，情况并非如此。）此外，在这种情况下，此优化不会改变计算结果——通常来说，结果会略有不同。在某些情况下，尤其是数值不稳定的算法，计算结果可能会差很多。

标注 `@fastmath` 会重新排列浮点数表达式，例如更改求值顺序，或者假设某些特殊情况（如 inf、nan）不出现。在这种情况中（以及在这个特定的计算机上），主要区别是函数 `deriv` 中的表达式 `1 / (2*dx)` 会被提升出循环（即在循环外计算），就像编写了 `idx = 1 / (2*dx)`，然后，在循环中，表达式 `... / (2*dx)` 变为 `... * idx`，后者计算起来快得多。当然，编译器实际上采用的优化以及由此产生的加速都在很大程度上取决于硬件。你可以使用 Julia 的 [`code_native`](@ref) 函数来检查所生成代码的更改。

请注意，`@fastmath` 也假设了在计算中不会出现 `NaN`，这可能导致意想不到的行为：

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

宏 [`@code_warntype`](@ref)（或其函数变体 [`code_warntype`](@ref)）有时可以帮助诊断类型相关的问题。这是一个例子：

```julia-repl
julia> @noinline pos(x) = x < 0 ? 0 : x;

julia> function f(x)
           y = pos(x)
           return sin(y*x + 1)
       end;

julia> @code_warntype f(3.2)
Variables
  #self#::Core.Compiler.Const(f, false)
  x::Float64
  y::UNION{FLOAT64, INT64}

Body::Float64
1 ─      (y = Main.pos(x))
│   %2 = (y * x)::Float64
│   %3 = (%2 + 1)::Float64
│   %4 = Main.sin(%3)::Float64
└──      return %4
```

Interpreting the output of [`@code_warntype`](@ref), like that of its cousins [`@code_lowered`](@ref),
[`@code_typed`](@ref), [`@code_llvm`](@ref), and [`@code_native`](@ref), takes a little practice.
Your code is being presented in form that has been heavily digested on its way to generating
compiled machine code. Most of the expressions are annotated by a type, indicated by the `::T`
(where `T` might be [`Float64`](@ref), for example). The most important characteristic of [`@code_warntype`](@ref)
is that non-concrete types are displayed in red; since this document is written in Markdown, which has no color,
in this document, red text is denoted by uppercase.

在顶部，该函数类型推导后的返回类型显示为 `Body::Float64`。下一行以 Julia 的 SSA IR 形式表示了 `f` 的主体。被数字标记的方块表示代码中（通过 `goto`）跳转的目标。查看主体，你会看到首先调用了 `pos`，其返回值经类型推导为 `Union` 类型 `UNION{FLOAT64, INT64}` 并以大写字母显示，因为它是非具体类型。这意味着我们无法根据输入类型知道 `pos` 的确切返回类型。但是，无论 `y` 是 `Float64` 还是 `Int64`，`y*x` 的结果都是 `Float64`。最终的结果是 `f(x::Float64)` 在其输出中不会是类型不稳定的，即使有些中间计算是类型不稳定的。

如何使用这些信息取决于你。显然，最好将 `pos` 修改为类型稳定的：如果这样做，`f` 中的所有变量都是具体的，其性能将是最佳的。但是，在某些情况下，这种*短暂的*类型不稳定性可能无关紧要：例如，如果 `pos` 从不单独使用，那么 `f` 的输出（对于 [`Float64`](@ref) 输入）是类型稳定的这一事实将保护之后的代码免受类型不稳定性的传播影响。这与类型不稳定性难以或不可能修复的情况密切相关。在这些情况下，上面的建议（例如，添加类型注释并/或分解函数）是你控制类型不稳定性的「损害」的最佳工具。另请注意，即使是 Julia Base 也有类型不稳定的函数。例如，函数 [`findfirst`](@ref) 如果找到键则返回数组索引，如果没有找到键则返回 `nothing`，这是明显的类型不稳定性。为了更易于找到可能很重要的类型不稳定性，包含 `missing` 或 `nothing` 的 `Union` 会用黄色着重显示，而不是用红色。

以下示例可以帮助你解释被标记为包含非叶类型的表达式：

  * 函数体以 `Body::UNION{T1,T2})` 开头
      * 解释：函数具有不稳定返回类型
      * 建议：使返回值类型稳定，即使你必须对其进行类型注释

  * `invoke Main.g(%%x::Int64)::UNION{FLOAT64, INT64}`
      * 解释：调用类型不稳定的函数 `g`。
      * 建议：修改该函数，或在必要时对其返回值进行类型注释

  * `invoke Base.getindex(%%x::Array{Any,1}, 1::Int64)::ANY`
      * 解释：访问缺乏类型信息的数组的元素
      * 建议：使用具有更佳定义的类型的数组，或在必要时对访问的单个元素进行类型注释
         

  * `Base.getfield(%%x, :(:data))::ARRAY{FLOAT64,N} WHERE N`
      * 解释：获取值为非叶类型的字段。在这种情况下，`ArrayContainer` 具有字段 `data::Array{T}`。但是 `Array` 也需要维度 `N` 来成为具体类型。
         
      * 建议：使用类似于 `Array{T,3}` 或 `Array{T,N}` 的具体类型，其中的 `N` 现在是 `ArrayContainer` 的参数
         

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

# Checking for equality with a singleton

When checking if a value is equal to some singleton it can be
better for performance to check for identicality (`===`) instead of
equality (`==`). The same advice applies to using `!==` over `!=`.
These type of checks frequently occur e.g. when implementing the iteration
protocol and checking if `nothing` is returned from [`iterate`](@ref).
