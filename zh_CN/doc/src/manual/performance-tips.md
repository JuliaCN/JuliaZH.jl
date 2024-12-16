# [性能建议](@id man-performance-tips)

下面几节简要地介绍了一些使 Julia 代码运行得尽可能快的技巧。

## 影响性能的关键代码应该在函数内部

任何对性能至关重要的代码都应该在函数内部。 由于 Julia 编译器的工作方式，函数内部的代码往往比顶层代码运行得更快。

函数的使用不仅对性能很重要：函数更可重用和可测试，并阐明正在执行哪些步骤以及它们的输入和输出是什么，[编写函数，而不仅仅是脚本]（@ref）也是 Julia 的风格指南。

The functions should take arguments, instead of operating directly on global variables, see the next point.

## Avoid untyped global variables

The value of an untyped global variable might change at any point, possibly leading to a change of its type. This makes
it difficult for the compiler to optimize code using global variables. This also applies to type-valued variables,
i.e. type aliases on the global level. Variables should be local, or passed as arguments to functions, whenever possible.

函数应该接收参数，而不是直接对全局变量进行操作，请参阅下一点。

## 避免全局变量

全局变量的值和类型随时都会发生变化， 这使编译器难以优化使用全局变量的代码。 变量应该是局部的，或者尽可能作为参数传递给函数。


我们发现全局变量经常是常量，将它们声明为常量可大幅提升性能。

```julia
const DEFAULT_VAL = 0
```

If a global is known to always be of the same type, [the type should be annotated](@ref man-typed-globals).

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
    所有的REPL中的代码都是在全局作用域中求值的，因此在顶层的变量的定义与赋值都会成为一个**全局**变量。在模块的顶层作用域定义的变量也是全局变量。

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
  0.011539 seconds (9.08 k allocations: 373.386 KiB, 98.69% compilation time)
523.0007221951678

julia> @time sum_global()
  0.000091 seconds (3.49 k allocations: 70.156 KiB)
523.0007221951678
```

在第一次调用（`@time sum_global()`）时，函数被编译。
（如果不在此会话中使用 [`@time`](@ref)，它还会编译计时所需的函数）
你不用把此次运行的结果放在心上。对于第二次运行，请注意，除了报告时间外，它还表明分配了大量内存。
我们在这里只是计算 64 位浮点数向量中所有元素的总和，因此不需要分配（堆）内存

We should clarify that what `@time` reports is specifically *heap* allocations, which are typically needed for either
mutable objects or for creating/growing variable-sized containers (such as `Array` or `Dict`, strings, or "type-unstable"
objects whose type is only known at runtime).  Allocating (or deallocating) such blocks of memory may require an expensive
system call (e.g. via `malloc` in C), and they must be tracked for garbage collection.  In contrast, immutable values like
numbers (except bignums), tuples, and immutable `struct`s can be stored much more cheaply, e.g. in stack or CPU-register
memory, so one doesn’t typically worry about the performance cost of "allocating" them.

预料之外的内存分配几乎总是表示你的代码存在问题，通常是类型稳定性问题或创建了许多小的临时数组。 因此，除了分配本身之外，你的函数的代码很可能远非最优。请认真对待此类迹象并遵循以下建议。

In this particular case, the memory allocation is due to the usage of a type-unstable global variable `x`,
so if we instead pass `x` as an argument to the function it no longer allocates memory
(the remaining allocation reported below is due to running the `@time` macro in global scope)
and is significantly faster after the first call:

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
  0.007551 seconds (3.98 k allocations: 200.548 KiB, 99.77% compilation time)
523.0007221951678

julia> @time sum_arg(x)
  0.000006 seconds (1 allocation: 16 bytes)
523.0007221951678
```

看到的 1 allocation 来自在全局范围内运行 `@time` 宏本身。 如果我们改为在函数中运行计时，我们可以看到确实没有执行任何分配：

```jldoctest sumarg; filter = r"[0-9\.]+ seconds"
julia> time_sum(x) = @time sum_arg(x);

julia> time_sum(x)
  0.000002 seconds
523.0007221951678
```

在某些情况下，你的函数可能需要将分配内存作为其操作的一部分，这比上面的简单例子复杂的多。 在这种情况下，请考虑使用下面的 [工具](@ref tools) 之一来诊断问题，或者编写一个将分配内存与算法方面分开的函数版本（请参阅 [输出预分配](@ref)）。


!!! note
    对于更严格的基准测试，请考虑 [BenchmarkTools.jl](https://github.com/JuliaCI/BenchmarkTools.jl) 包，该包会多次评估函数以减少噪音。

## [工具](@id tools)

Julia 及其包生态系统包括可以帮助您诊断问题和提高代码性能的工具：

  * [Profiling](@ref profiling) 允许你测量正在运行的代码的性能并识别作为瓶颈的行。对于复杂的项目，[ProfileView](https://github.com/timholy/ProfileView.jl) 包可以帮助你可视化分析结果。
  * [Traceur](https://github.com/JunoLab/Traceur.jl) 包可以帮助你找到代码中常见的性能问题。
  * 预期之外的大内存分配——正如 [`@time`](@ref)、[`@allocated`](@ref) 或 Profiler（通过调用垃圾收集例程）所报告的那样——暗示你的代码可能有问题。 如果你没有看到分配的其他原因，请怀疑是类型问题。还可以使用 `--track allocation=user` 选项启动 Julia 并检查生成的 `*.mem` 文件以查看有关这些分配发生位置的信息。 参见[内存分配分析](@ref memory-allocation-analysis)。
  * `@code_warntype` 生成代码的表示形式，这有助于查找导致类型不确定性的表达式。 请参阅下面的 [`@code_warntype`](@ref)。

## [避免使用抽象类型参数的容器](@id man-performance-abstract-container)

使用参数化类型（包括数组）时，最好尽可能避免使用抽象类型进行参数化。

考虑如下：

```jldoctest
julia> a = Real[]
Real[]

julia> push!(a, 1); push!(a, 2.0); push!(a, π)
3-element Vector{Real}:
 1
 2.0
 π = 3.1415926535897...
```

因为 `a` 是一个抽象类型 [`Real`](@ref) 的数组，所以它能够保存任何 `Real` 值。 由于`Real`对象允许具有任意大小和结构，因此`a`必须表示为指向单独分配的`Real`对象的指针数组。 但是，如果我们只允许相同类型的数字，例如 [`Float64`](@ref),  `a` 可以更有效地存储：

```jldoctest
julia> a = Float64[]
Float64[]

julia> push!(a, 1); push!(a, 2.0); push!(a,  π)
3-element Vector{Float64}:
 1.0
 2.0
 3.141592653589793
```

把数字赋值给`a`会即时将数字转换成`Float64`并且`a`会按照64位浮点数值的连续的块来储存，这就能高效地处理。

如果无法避免使用抽象值类型的容器，有时最好使用`Any`参数化以避免运行时类型检查。 例如。 `IdDict{Any, Any}` 的性能优于 `IdDict{Type, Vector}`。

也请参见在[参数类型](@ref Parametric-Types)下的讨论。

## 添加类型声明

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

One should also keep in mind that not-fully-parameterized types behave like abstract types. For example, even though a fully specified `Array{T,n}` is concrete, `Array` itself with no parameters given is not concrete:

```jldoctest myambig3
julia> !isconcretetype(Array), !isabstracttype(Array), isstructtype(Array), !isconcretetype(Array{Int}), isconcretetype(Array{Int,1})
(true, true, true, true, true)
```
In this case, it would be better to avoid declaring `MyType` with a field `a::Array` and instead declare the field as `a::Array{T,N}` or as `a::A`, where `{T,N}` or `A` are parameters of `MyType`.

### 避免使用带抽象容器的字段

上面的做法同样也适用于容器的类型：

```jldoctest containers
julia> struct MySimpleContainer{A<:AbstractVector}
           a::A
       end

julia> struct MyAmbiguousContainer{T}
           a::AbstractVector{T}
       end

julia> struct MyAlsoAmbiguousContainer
           a::Array
       end
```

例如:

```jldoctest containers
julia> c = MySimpleContainer(1:3);

julia> typeof(c)
MySimpleContainer{UnitRange{Int64}}

julia> c = MySimpleContainer([1:3;]);

julia> typeof(c)
MySimpleContainer{Vector{Int64}}

julia> b = MyAmbiguousContainer(1:3);

julia> typeof(b)
MyAmbiguousContainer{Int64}

julia> b = MyAmbiguousContainer([1:3;]);

julia> typeof(b)
MyAmbiguousContainer{Int64}

julia> d = MyAlsoAmbiguousContainer(1:3);

julia> typeof(d), typeof(d.a)
(MyAlsoAmbiguousContainer, Vector{Int64})

julia> d = MyAlsoAmbiguousContainer(1:1.0:3);

julia> typeof(d), typeof(d.a)
(MyAlsoAmbiguousContainer, Vector{Float64})

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

如果类型是抽象的或在运行时构造的，则类型注释不会增强（实际上可能会阻碍）性能。 这是因为编译器无法使用注解来特例化后续代码，并且类型检查本身需要时间。 例如，在代码中：

```julia
function nr(a, prec)
    ctype = prec == 32 ? Float32 : Float64
    b = Complex{ctype}(a)
    c = (b + 1.0f0)::Complex{ctype}
    abs(c)
end
```

`c` 的注释会损害性能。要编写涉及在运行时构造类型的高性能代码，请使用下面讨论的 [函数障碍技巧](@ref kernel-functions)，
并确保构造的类型出现在内核函数的参数类型中，以便内核操作由编译器合理地 [特例化](@ref man-method-specializations)。
例如，在上面的代码片段中，一旦构建了 `b`，它就可以传递给另一个函数 `k`，即内核。
例如，如果函数 `k` 将 `b` 声明为类型为 `Complex{T}` 的参数，其中 `T` 是一个类型参数，那么出现在`k`的赋值语句中的类型注释的形式：

```julia
c = (b + 1.0f0)::Complex{T}
```

不会降低性能（但也不会有帮助），因为编译器可以在编译 `k` 时确定 `c` 的类型。

### [注意Julia何时避免特例化](@id Be-aware-of-when-Julia-avoids-specializing)

作为一种启发式方法，Julia 避免在三种特定情况下自动特例化参数类型参数：`Type`、`Function` 和 `Vararg`。 当在方法中使用参数时，Julia 将始终特例化，但如果参数只是传递给另一个函数，则不会。 这通常在运行时没有性能影响并且[提高编译器性能](@ref compiler-efficiency-issues)。 如果你发现它在你的案例中在运行时确实有性能影响，您可以通过向方法声明添加类型参数来触发特例化。这里有些例子：

这不会特例化：

```julia
function f_type(t)  # or t::Type
    x = ones(t, 10)
    return sum(map(sin, x))
end
```

但是这会：

```julia
function g_type(t::Type{T}) where T
    x = ones(T, 10)
    return sum(map(sin, x))
end
```

这些不会特例化：

```julia
f_func(f, num) = ntuple(f, div(num, 2))
g_func(g::Function, num) = ntuple(g, div(num, 2))
```

但是这会：

```julia
h_func(h::H, num) where {H} = ntuple(h, div(num, 2))
```

这不会特例化：

```julia
f_vararg(x::Int...) = tuple(x...)
```

但是这会：

```julia
g_vararg(x::Vararg{Int, N}) where {N} = tuple(x...)
```

只需要引入一个类型参数就可以强制特例化，即使其他类型不受约束。比如下面这个例子，它会特例化，并且在参数不是全部相同类型时很有用：
```julia
h_vararg(x::Vararg{Any, N}) where {N} = tuple(x...)
```

请注意， [`@code_typed`](@ref) 和你的朋友给你的始终是特例化的代码，即使 Julia 通常不会特例化该方法调用。
如果要查看更改参数类型时是否生成特例化，则需要检查 [method internals](@ref ast-lowered-method)，
即是否 `Base.specializations(@which f(...))` 包含相关参数的特例化。

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
mynorm(x::Vector) = sqrt(real(dot(x, x)))
mynorm(A::Matrix) = maximum(svdvals(A))
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
  * 显式声明 `x` 的类型：`x::Float64 = 1`
  * 使用 `x = oneunit(Float64)` 进行显式的类型转换
  * 使用第一个循环迭代初始化，即 `x = 1 / rand()`，接着循环 `for i = 2:10`

## [分离核心函数（又称为函数屏障）] (@id kernel-functions)

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
3-element Vector{Int64}:
 2
 2
 2
```

它应该这么写：

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
3-element Vector{Int64}:
 2
 2
 2
```

Julia 的编译器会在函数边界处针对参数类型特化代码，因此在原始的实现中循环期间无法得知 `a` 的类型（因为它是随即选择的）。于是，第二个版本通常更快，因为对于不同类型的 `a`，内层循环都可被重新编译为 `fill_twos!` 的一部分。

第二种形式通常是更好的风格，并且可以带来更多的代码的重复利用。

这个模式在 Julia Base 的几个地方中有使用。相关的例子，请参阅 [`abstractarray.jl`](https://github.com/JuliaLang/julia/blob/40fe264f4ffaa29b749bcf42239a89abdcbba846/base/abstractarray.jl#L1205-L1206) 中的 `vcat` 和 `hcat`，或者 [`fill!`](@ref) 函数，我们可使用该函数而不是编写自己的 `fill_twos!`。

诸如 `strange_twos` 的函数会在处理具有不确定类型的数据时出现，例如从可能包含整数、浮点数、字符串或其它内容的输入文件中加载的数据。

## [具有值作为参数的类型](@id man-performance-value-type)

比方说你想创建一个每个维度大小都是3的 `N` 维数组。这种数组可以这样创建：

```jldoctest
julia> A = fill(5.0, (3, 3))
3×3 Matrix{Float64}:
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
3×3 Matrix{Float64}:
 5.0  5.0  5.0
 5.0  5.0  5.0
 5.0  5.0  5.0
```

这确实有用，但是（你可以自己使用 `@code_warntype array3(5.0, 2)` 来验证）问题是输出地类型不能被推断出来：参数 `N` 是一个 `Int` 类型的**值**，而且类型推断不会（也不能）提前预测它的值。这意味着使用这个函数的结果的代码在每次获取 `A` 时都不得不保守地检查其类型；这样的代码将会是非常缓慢的。

现在，解决此类问题的一种很好的方法是使用 [函数障碍技巧](@ref kernel-functions)。 但是，在某些情况下，你可能希望完全消除类型不稳定性。 在这种情况下，一种方法是将维度作为参数传递，例如通过 `Val{T}()`（参见 [值类型](@ref)）：

```jldoctest
julia> function array3(fillval, ::Val{N}) where N
           fill(fillval, ntuple(d->3, Val(N)))
       end
array3 (generic function with 1 method)

julia> array3(5.0, Val(2))
3×3 Matrix{Float64}:
 5.0  5.0  5.0
 5.0  5.0  5.0
 5.0  5.0  5.0
```

Julia 有一个特别版本的 `ntuple`，它接受一个 `Val{::Int}` 实例作为第二个参数； 通过将 `N` 作为类型参数传递，你可以让编译器知道它的“值”。 因此，这个版本的 `array3` 允许编译器预测返回类型。

然而，使用这些技术可能非常微妙。 例如，如果你从这样的函数中调用 `array3` 将没有任何帮助：

```julia
function call_array3(fillval, n)
    A = array3(fillval, Val(n))
end
```

在这里，你又一次创造了同样的问题：编译器无法猜测 `n` 是什么，所以它不知道 `Val(n)` 的 *类型*。 在许多情况下，尝试使用 `Val` 但不正确地使用很容易使性能*变差*。 （只有在有效地将 `Val` 与函数障碍技巧结合起来的情况下，为了使内核函数更有效，才应使用上述代码。）

一个正确使用 `Val` 的例子是这样的：

```julia
function filter3(A::AbstractArray{T,N}) where {T,N}
    kernel = array3(1, Val(N))
    filter(A, kernel)
end
```

在此示例中，`N` 作为参数传递，因此编译器知道其“值”。 本质上，`Val(T)` 仅在 `T` 是硬编码/i字面量 (`Val(3)`) 或已在类型域中指定时才起作用。

## 滥用多重派发的危险（也就是更多关于以值作为参数的类型）

一旦一个人理解了多重派发，就会有一个倾向，即过度使用它并尝试将其用于所有事情。 例如，您可能会想象使用它来存储信息，例如

```
struct Car{Make, Model}
    year::Int
    ...more fields...
end
```

然后派发到像 `Car{:Honda,:Accord}(year, args...)` 的对象上。

当存在以下任一情况，这可能是值得做的：

  * 你需要对每个 `Car` 进行 CPU 密集型处理，如果你在编译时知道 `Make` 和 `Model`，并且将使用的不同`Make`或`Model`的总数不太大，则效率会大大提高。

  * 你需要处理相同类型的 `Car` 的同类列表，因此可以将它们全部存储在一个数组`{Car{:Honda,:Accord},N}` 中。


当后者成立时，处理此类同型数组的函数可以高效地特例化：Julia 预先知道每个元素的类型（容器中的所有对象都具有相同的具体类型），因此当函数被编译时， Julia 可以“查找”正确的方法调用（不需要在运行时检查），从而产生有效的代码来处理整个列表。

当这些都不成立时，你很可能不会获得任何好处；更糟糕的是，由此产生的“类型组合爆炸”将适得其反。 如果 `items[i+1]` 与 `item[i]` 的类型不同，Julia 必须在运行时查找类型，在方法表中搜索适当的方法，决定（通过类型交集）哪一个匹配，确定它是否已经被 JIT 编译（如果没有，则执行），然后进行调用。 本质上，你是在要求完整的类型系统和 JIT 编译机制在你自己的代码中基本上执行相当于 switch 语句或字典查找的操作。

[在邮件列表中](https://groups.google.com/forum/#!msg/julia-users/jUMu9A3QKQQ/qjgVWr7vAwAJ) 可以找到一些运行时基准比较 (1) 类型派发、(2) 字典查找和 (3) “switch”语句 

也许比运行时影响更糟糕的是编译期影响：Julia 将为每个不同的 `Car{Make, Model}` 编译专门的函数； 如果你有成百上千个这样的类型，那么每个接受这样一个对象作为参数的函数（从你可能自己编写的自定义 `get_year` 函数，到 Julia Base 中的通用 `push!` 函数）都将成百上千个为它编译了的变体。 这些都会增加编译代码缓存的大小、内部方法列表的长度等。对值作为参数的过度热情很容易浪费大量资源。

## [沿列按内存顺序访问数组](@id man-performance-column-major)

Julia 中的多维数组以列主序存储。这意味着数组一次堆叠一列。这可使用 `vec` 函数或语法 `[:]` 来验证，如下所示（请注意，数组的顺序是 `[1 3 2 4]`，而不是 `[1 2 3 4]`）：

```jldoctest
julia> x = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> x[:]
4-element Vector{Int64}:
 1
 3
 2
 4
```

这种对数组进行排序的约定在许多语言中都很常见，例如 Fortran、Matlab 和 R（仅举几例）。 列优先排序的替代方法是行优先排序，在其它语言中，这是 C 和 Python (`numpy`) 采用的约定。 在遍历数组时，记住数组的顺序会对性能产生显着的影响。 要记住的一个经验法则是，对于列优先数组，第一个索引变化最快。 本质上，这意味着如果最内层的循环索引是第一个出现在切片表达式中的，则循环会更快。 请记住，使用 `:` 索引数组是一个隐式循环，它迭代访问特定维度内的所有元素； 例如，提取列比提取行更快。

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

julia> fdot(x) = @. 3x^2 + 4x + 7x^3; # equivalent to 3 .* x.^2 .+ 4 .* x .+ 7 .* x.^3
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
a new temporary array and executes in a separate loop. In this example
`f.(x)` is as fast as `fdot(x)` but in many contexts it is more
convenient to sprinkle some dots in your expressions than to
define a separate function for each vectorized operation.

## [考虑对切片使用视图](@id man-performance-views)

在 Julia 中，像 `array[1:5, :]` 这样的数组“切片”表达式会创建该数据的副本（赋值的左侧除外，其中 `array[1:5, :] = ...` 原地对 `array` 的那一部分进行赋值）。 如果你在切片上执行许多操作，这对性能有好处，因为使用较小的连续副本比索引原始数组更有效。 另一方面，如果你只是对切片进行一些简单的操作，那么分配和复制操作的成本可能会很高。

另一种方法是创建数组的“视图”，它是一个数组对象（一个`SubArray`），它实际上就地引用了原始数组的数据，而不进行复制。（如果你写入视图，它也会修改原始数组的数据。）这可以通过调用 [`view`](@ref) 对单个切片完成，或者更简单地通过将整个表达式或代码块放入 [`@views`](@ref) 在该表达式前面。 例如：

```jldoctest; filter = r"[0-9\.]+ seconds \(.*?\)"
julia> fcopy(x) = sum(x[2:end-1]);

julia> @views fview(x) = sum(x[2:end-1]);

julia> x = rand(10^6);

julia> @time fcopy(x);
  0.003051 seconds (3 allocations: 7.629 MB)

julia> @time fview(x);
  0.001020 seconds (1 allocation: 16 bytes)
```

请注意，该函数的 `fview` 版本提速了 3 倍且减少了内存分配。

## 复制数据不总是坏的

数组被连续地存储在内存中，这使其可被 CPU 向量化，并且会由于缓存减少内存访问。
这与建议以列序优先方式访问数组的原因相同（请参见上文）。
由于不按顺序访问内存，无规律的访问方式和不连续的视图可能会大大减慢数组上的计算速度。

在对无规律访问的数据进行重复访问之前，将其复制到连续的数组中可能带来巨大的加速，正如下例所示。
其中，矩阵和向量在相乘前会访问已被随机混洗的索引处的值。
即使增加了复制和分配的成本，复制到普通数组中也能加快乘法运算速度。

```julia-repl
julia> using Random

julia> A = randn(3000, 3000);

julia> x = randn(2000);

julia> inds = shuffle(1:3000)[1:2000];

julia> function iterated_neural_network(A, x, depth)
           for _ in 1:depth
               x .= max.(0, A * x)
           end
           argmax(x)
       end

julia> @time iterated_neural_network(view(A, inds, inds), x, 10)
  0.324903 seconds (12 allocations: 157.562 KiB)
1569

julia> @time iterated_neural_network(A[inds, inds], x, 10)
  0.054576 seconds (13 allocations: 30.671 MiB, 13.33% gc time)
1569
```

只要有足够的内存，将视图复制到数组的成本，就会被在连续数组上进行重复矩阵乘法所带来的加速所抵消。

## 使用 StaticArrays.jl 进行小型固定大小的向量/矩阵运算

如果您的应用程序涉及许多固定大小的小（`< 100` 个元素）数组（即在执行之前已知大小），那么你可能需要考虑使用 [StaticArrays.jl 包](https://github.com/JuliaArrays/StaticArrays.jl）。 这个包允许你以一种避免不必要的堆分配的方式来表示这样的数组，并允许编译器为数组的*大小*特例化代码，例如，通过完全展开向量操作（消除循环）并将元素存储在 CPU 寄存器中。

例如，如果你正在使用 2d 几何图形进行计算，你可能会使用 2-分量向量进行许多计算。 通过使用 StaticArrays.jl 中的 `SVector` 类型，你可以在向量 `v` 和 `w` 上使用方便的向量符号和操作，例如 `norm(3v - w)`，同时允许编译器将代码展开到最小，计算等效于`@inbounds hypot(3v[1]-w[1], 3v[2]-w[2])`。

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
     
     
     
     
     
     
     

如果 Array 使用非常规索引，那么使用 1:n 索引到 AbstractArray 的常见习惯用法是不安全的，如果关闭边界检查，可能会导致段错误。请改用`LinearIndices(x)` 或`eachindex(x)`（另请参阅[具有自定义索引的数组](@ref man-custom-indices)）。

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

## 将次正规数视为零

次正规数，以前称为 [非正规数](https://en.wikipedia.org/wiki/Denormal_number)，在许多情况下都很有用，但会在某些硬件上造成性能损失。 调用 [`set_zero_subnormals(true)`](@ref) 授予浮点运算权限，将次正规输入或输出视为零，这可能会提高某些硬件的性能。 调用 [`set_zero_subnormals(false)`](@ref) 对次正规数强制执行严格的 IEEE 行为。

下面是一个示例，其中次正规数显着影响某些硬件的性能：

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

它的输出类似于

```
  0.002202 seconds (1 allocation: 4.063 KiB)
  0.001502 seconds (1 allocation: 4.063 KiB)
  0.002139 seconds (1 allocation: 4.063 KiB)
  0.001454 seconds (1 allocation: 4.063 KiB)
  0.002115 seconds (1 allocation: 4.063 KiB)
  0.001455 seconds (1 allocation: 4.063 KiB)
```

注意，每个偶数迭代的速度明显更快。

这个例子产生了许多次正规数，因为`a`中的值变成了一个指数递减的曲线，随着时间的推移慢慢渐进趋于0。

应谨慎使用将次正规数视为零，因为这样做会破坏某些等式，例如 `x-y == 0` 意味着 `x == y`：

```jldoctest
julia> x = 3f-38; y = 2f-38;

julia> set_zero_subnormals(true); (x - y, x == y)
(0.0f0, false)

julia> set_zero_subnormals(false); (x - y, x == y)
(1.0000001f-38, false)
```

在某些应用程序中，将次正规数归零的另一种方法是加入一点点噪音。 例如，不是用零初始化`a`，而是用以下方法初始化它：

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
MethodInstance for f(::Float64)
  from f(x) @ Main REPL[9]:1
Arguments
  #self#::Core.Const(f)
  x::Float64
Locals
  y::Union{Float64, Int64}
Body::Float64
1 ─      (y = Main.pos(x))
│   %2 = (y * x)::Float64
│   %3 = (%2 + 1)::Float64
│   %4 = Main.sin(%3)::Float64
└──      return %4
```

理解 [`@code_warntype`](@ref) 的输出，就像理解它的同类工具 [`@code_lowered`](@ref), [`@code_typed`](@ref), [`@code_llvm`](@ref) 和 [`@code_native`](@ref) 一样需要一些练习。你的代码以在生成编译机器代码的过程中经过大量摘要的形式呈现。大多数表达式都由类型注释，由 `::T` 表示（例如，其中 `T` 可能是 [`Float64`](@ref)）。 [`@code_warntype`](@ref) 最大的特点就是非具体类型用红色显示； 由于本文档是用Markdown 编写的，没有颜色，所以本文档中红色文字用大写表示。

在顶部，该函数类型推导后的返回类型显示为 `Body::Float64`。下一行以 Julia 的 SSA IR 形式表示了 `f` 的主体。
被数字标记的方块表示代码中（通过 `goto`）跳转的目标。
查看主体，你会看到首先调用了 `pos`，其返回值经类型推导为 `Union` 类型 `Union{Float64, Int64}` 并以大写字母显示，因为它是非具体类型。
这意味着我们无法根据输入类型知道 `pos` 的确切返回类型。
但是，无论 `y` 是 `Float64` 还是 `Int64`，`y*x` 的结果都是 `Float64`。
最终的结果是 `f(x::Float64)` 在其输出中不会是类型不稳定的，即使有些中间计算是类型不稳定的。

如何使用这些信息取决于你。显然，最好将 `pos` 修改为类型稳定的：如果这样做，`f` 中的所有变量都是具体的，其性能将是最佳的。但是，在某些情况下，这种*短暂的*类型不稳定性可能无关紧要：例如，如果 `pos` 从不单独使用，那么 `f` 的输出（对于 [`Float64`](@ref) 输入）是类型稳定的这一事实将保护之后的代码免受类型不稳定性的传播影响。这与类型不稳定性难以或不可能修复的情况密切相关。在这些情况下，上面的建议（例如，添加类型注释并/或分解函数）是你控制类型不稳定性的「损害」的最佳工具。另请注意，即使是 Julia Base 也有类型不稳定的函数。例如，函数 [`findfirst`](@ref) 如果找到键则返回数组索引，如果没有找到键则返回 `nothing`，这是明显的类型不稳定性。为了更易于找到可能很重要的类型不稳定性，包含 `missing` 或 `nothing` 的 `Union` 会用黄色着重显示，而不是用红色。

以下示例可以帮助你解释被标记为包含非叶类型的表达式：

  * 函数体以 `Body::Union{T1,T2})` 开头
      * 解释：函数具有不稳定返回类型
      * 建议：使返回值类型稳定，即使你必须对其进行类型注释

  * `invoke Main.g(%%x::Int64)::Union{Float64, Int64}`
      * 解释：调用类型不稳定的函数 `g`。
      * 建议：修改该函数，或在必要时对其返回值进行类型注释

  * `invoke Base.getindex(%%x::Array{Any,1}, 1::Int64)::Any`
      * 解释：访问缺乏类型信息的数组的元素
      * 建议：使用具有更佳定义的类型的数组，或在必要时对访问的单个元素进行类型注释

  * `Base.getfield(%%x, :(:data))::Array{Float64,N} where N`
      * 解释：获取一个非叶子类型的字段。 在这种情况下，`x` 的类型，比如说 `ArrayContainer`，有一个字段 `data::Array{T}`。 但是 `Array` 也需要维度 `N` 作为具体类型。
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
The `let` block creates a new variable `r` whose scope is only the
inner function. The second technique recovers full language performance
in the presence of captured variables. Note that this is a rapidly
evolving aspect of the compiler, and it is likely that future releases
will not require this degree of programmer annotation to attain performance.
In the mean time, some user-contributed packages like
[FastClosures](https://github.com/c42f/FastClosures.jl) automate the
insertion of `let` statements as in `abmult3`.

## [Multithreading and linear algebra](@id man-multithreading-linear-algebra)

This section applies to multithreaded Julia code which, in each thread, performs linear algebra operations.
Indeed, these linear algebra operations involve BLAS / LAPACK calls, which are themselves multithreaded.
In this case, one must ensure that cores aren't oversubscribed due to the two different types of multithreading.

Julia compiles and uses its own copy of OpenBLAS for linear algebra, whose number of threads is controlled by the environment variable `OPENBLAS_NUM_THREADS`.
It can either be set as a command line option when launching Julia, or modified during the Julia session with `BLAS.set_num_threads(N)` (the submodule `BLAS` is exported by `using LinearAlgebra`).
Its current value can be accessed with `BLAS.get_num_threads()`.

When the user does not specify anything, Julia tries to choose a reasonable value for the number of OpenBLAS threads (e.g. based on the platform, the Julia version, etc.).
However, it is generally recommended to check and set the value manually.
The OpenBLAS behavior is as follows:

* If `OPENBLAS_NUM_THREADS=1`, OpenBLAS uses the calling Julia thread(s), i.e. it "lives in" the Julia thread that runs the computation.
* If `OPENBLAS_NUM_THREADS=N>1`, OpenBLAS creates and manages its own pool of threads (`N` in total). There is just one OpenBLAS thread pool shared among all Julia threads.

When you start Julia in multithreaded mode with `JULIA_NUM_THREADS=X`, it is generally recommended to set `OPENBLAS_NUM_THREADS=1`.
Given the behavior described above, increasing the number of BLAS threads to `N>1` can very easily lead to worse performance, in particular when `N<<X`.
However this is just a rule of thumb, and the best way to set each number of threads is to experiment on your specific application.

## [Alternative linear algebra backends](@id man-backends-linear-algebra)

As an alternative to OpenBLAS, there exist several other backends that can help with linear algebra performance.
Prominent examples include [MKL.jl](https://github.com/JuliaLinearAlgebra/MKL.jl) and [AppleAccelerate.jl](https://github.com/JuliaMath/AppleAccelerate.jl).

These are external packages, so we will not discuss them in detail here.
Please refer to their respective documentations (especially because they have different behaviors than OpenBLAS with respect to multithreading).
