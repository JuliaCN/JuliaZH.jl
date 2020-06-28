# [构造函数](@id man-constructors)

构造函数 [^1] 是用来创建新对象的函数 -- 确切地说，它创建的是[复合类型](@ref)的实例。在 Julia 中，类型对象也同时充当构造函数的角色：可以用类名加参数元组的方式像函数调用一样来创建新实例。这一点在介绍复合类型（Composite Types）时已经大致谈过了。例如：

```jldoctest footype
julia> struct Foo
           bar
           baz
       end

julia> foo = Foo(1, 2)
Foo(1, 2)

julia> foo.bar
1

julia> foo.baz
2
```

对很多类型来说，通过给所有字段赋值来创建新对象的这种方式就足以用于产生新实例了。然而，在某些情形下，创建复合对象需要更多的功能。有时必须通过检查或转化参数来确保固有属性不变。[递归数据结构](https://en.wikipedia.org/wiki/Recursion_%28computer_science%29#Recursive_data_structures_.28structural_recursion.29)，特别是那些可能引用自身的数据结构，它们通常不能被干净地构造，而是需要首先被不完整地构造，然后再通过编程的方式完成补全。为了方便，有时需要用较少的参数或者不同类型的参数来创建对象，Julia 的对象构造系统解决了所有这些问题。

[^1]:
    命名法：虽然术语「构造函数」通常是指用于构造类型对象的函数全体，但通常会略微滥用术语将特定的构造方法称为「构造函数」。在这种情况下，通常可以从上下文中清楚地辨别出术语表示的是「构造方法」而不是「构造函数」，尤其是在讨论某个特别的「构造方法」的时候。

## 外部构造方法

构造函数与 Julia 中的其他任何函数一样，其整体行为由其各个方法的组合行为定义。因此，只要定义新方法就可以向构造函数添加功能。例如，假设你想为 `Foo` 对象添加一个构造方法，该方法只接受一个参数并其作为 `bar` 和 `baz` 的值。这很简单：

```jldoctest footype
julia> Foo(x) = Foo(x,x)
Foo

julia> Foo(1)
Foo(1, 1)
```

你也可以为 `Foo` 添加新的零参数构造方法，它为 `bar` 和 `baz` 提供默认值：

```jldoctest footype
julia> Foo() = Foo(0)
Foo

julia> Foo()
Foo(0, 0)
```

这里零参数构造方法会调用单参数构造方法，单参数构造方法又调用了自动提供默认值的双参数构造方法。上面附加的这类构造方法，它们的声明方式与普通的方法一样，像这样的构造方法被称为**外部**构造方法，下文很快就会揭示这样称呼的原因。外部构造方法只能通过调用其他构造方法来创建新实例，比如自动提供默认值的构造方法。

## 内部构造方法

尽管外部构造方法可以成功地为构造对象提供了额外的便利，但它无法解决另外两个在本章导言里提到的问题：确保固有属性不变和允许创建自引用对象。因此，我们需要**内部**构造方法。内部构造方法和外部构造方法很相像，但有两点不同：

1. 内部构造方法在类型声明代码块的内部，而不是和普通方法一样在外部。
2. 内部构造方法能够访问一个特殊的局部函数 [`new`](@ref)，此函数能够创建该类型的对象。

例如，假设你要声明一个保存一对实数的类型，但要约束第一个数不大于第二个数。你可以像这样声明它：

```jldoctest pairtype
julia> struct OrderedPair
           x::Real
           y::Real
           OrderedPair(x,y) = x > y ? error("out of order") : new(x,y)
       end
```

现在 `OrderedPair` 对象只能在 `x <= y` 时被成功构造：

```jldoctest pairtype; filter = r"Stacktrace:(\n \[[0-9]+\].*)*"
julia> OrderedPair(1, 2)
OrderedPair(1, 2)

julia> OrderedPair(2,1)
ERROR: out of order
Stacktrace:
 [1] error at ./error.jl:33 [inlined]
 [2] OrderedPair(::Int64, ::Int64) at ./none:4
 [3] top-level scope
```

如果类型被声明为 `mutable`，你可以直接更改字段值来打破这个固有属性，然而，在未经允许的情况下，随意摆弄对象的内核一般都是不好的行为。你（或者其他人）可以在以后任何时候提供额外的外部构造方法，但一旦类型被声明了，就没有办法来添加更多的内部构造方法了。由于外部构造方法只能通过调用其它的构造方法来创建对象，所以最终构造对象的一定是某个内部构造函数。这保证了已声明类型的对象必须通过调用该类型的内部构造方法才得已存在，从而在某种程度上保证了类型的固有属性。

只要定义了任何一个内部构造方法，Julia 就不会再提供默认的构造方法：它会假定你已经为自己提供了所需的所有内部构造方法。默认构造方法等效于一个你自己编写的内部构造函数，该函数将所有成员作为参数（如果相应的字段具有类型，则约束为正确的类型），并将它们传递给 `new`，最后返回结果对象：

```jldoctest
julia> struct Foo
           bar
           baz
           Foo(bar,baz) = new(bar,baz)
       end

```

这个声明与前面没有显式内部构造方法的 `Foo` 类型的定义效果相同。
以下两个类型是等价的 -- 一个具有默认构造方法，另一个具有显式构造方法：

```jldoctest
julia> struct T1
           x::Int64
       end

julia> struct T2
           x::Int64
           T2(x) = new(x)
       end

julia> T1(1)
T1(1)

julia> T2(1)
T2(1)

julia> T1(1.0)
T1(1)

julia> T2(1.0)
T2(1)
```

提供尽可能少的内部构造方法是一种良好的形式：仅在需要显式地处理所有参数，以及强制执行必要的错误检查和转换时候才使用内部构造。其它用于提供便利的构造方法，比如提供默认值或辅助转换，应该定义为外部构造函数，然后再通过调用内部构造函数来执行繁重的工作。这种解耦是很自然的。

## 不完整初始化

最后一个还没提到的问题是，如何构造具有自引用的对象，更广义地来说是构造递归数据结构。由于这其中的困难并不是那么显而易见，这里我们来简单解释一下，考虑如下的递归类型声明：

```jldoctest selfrefer
julia> mutable struct SelfReferential
           obj::SelfReferential
       end

```
这种类型可能看起来没什么大不了，直到我们考虑如何来构造它的实例。
如果 `a` 是 `SelfReferential` 的一个实例，则第二个实例可以用如下的调用来创建：

```julia-repl
julia> b = SelfReferential(a)
```

但是，当没有实例存在的情况下，即没有可以传递给 `obj` 成员变量的有效值时，如何构造第一个实例？唯一的解决方案是允许使用未初始化的 `obj` 成员来创建一个未完全初始化的 `SelfReferential` 实例，并使用该不完整的实例作为另一个实例的 `obj` 成员的有效值，例如，它本身。

为了允许创建未完全初始化的对象，Julia 允许使用少于该类型成员数的参数来调用 [`new`](@ ref) 函数，并返回一个具有某个未初始化成员的对象。然后，内部构造函数可以使用不完整的对象，在返回之前完成初始化。例如，我们在定义 `SelfReferential` 类型时采用了另一个方法，使用零参数内部构造函数来返回一个实例，此实例的 `obj` 成员指向其自身：

```jldoctest selfrefer2
julia> mutable struct SelfReferential
           obj::SelfReferential
           SelfReferential() = (x = new(); x.obj = x)
       end

```
我们可以验证这一构造函数有效性，且由其构造的对象确实是自引用的：

```jldoctest selfrefer2
julia> x = SelfReferential();

julia> x === x
true

julia> x === x.obj
true

julia> x === x.obj.obj
true
```

虽然从一个内部构造函数中返回一个完全初始化的对象是很好的，但是也可以返回未完全初始化的对象：

```jldoctest incomplete
julia> mutable struct Incomplete
           data
           Incomplete() = new()
       end

julia> z = Incomplete();
```

尽管允许创建含有未初始化成员的对象，然而任何对未初始化引用的访问都会立即报错：

```jldoctest incomplete
julia> z.data
ERROR: UndefRefError: access to undefined reference
```

这避免了不断地检测 `null` 值的需要。然而，并不是所有的对象成员都是引用。Julia 会将一些类型当作纯数据（"plain data"），这意味着它们的数据是自包含的，并且没有引用其它对象。这些纯数据包括原始类型（比如 `Int` ）和由其它纯数据类型构成的不可变结构体。纯数据类型的初始值是未定义的：

```julia-repl
julia> struct HasPlain
           n::Int
           HasPlain() = new()
       end

julia> HasPlain()
HasPlain(438103441441)
```

由纯数据组成的数组也具有一样的行为。

在内部构造函数中，你可以将不完整的对象传递给其它函数来委托其补全构造：

```jldoctest
julia> mutable struct Lazy
           data
           Lazy(v) = complete_me(new(), v)
       end
```

与构造函数返回的不完整对象一样，如果 `complete_me` 或其任何被调用者尝试在初始化之前访问 `Lazy` 对象的 `data` 字段，就会立刻报错。

## 参数类型的构造函数

参数类型的存在为构造函数增加了更多的复杂性。首先，让我们回顾一下[参数类型](@ref)。在默认情况下，我们可以用两种方法来实例化参数复合类型，一种是显式地提供类型参数，另一种是让 Julia 根据构造函数输入参数的类型来隐式地推导类型参数。这里有一些例子：

```jldoctest parametric; filter = r"Closest candidates.*\n  .*"
julia> struct Point{T<:Real}
           x::T
           y::T
       end

julia> Point(1,2) ## 隐式的 T ##
Point{Int64}(1, 2)

julia> Point(1.0,2.5) ## 隐式的 T ##
Point{Float64}(1.0, 2.5)

julia> Point(1,2.5) ## 隐式的 T ##
ERROR: MethodError: no method matching Point(::Int64, ::Float64)
Closest candidates are:
  Point(::T, ::T) where T<:Real at none:2

julia> Point{Int64}(1, 2) ## 显式的 T ##
Point{Int64}(1, 2)

julia> Point{Int64}(1.0,2.5) ## 显式的 T ##
ERROR: InexactError: Int64(2.5)
Stacktrace:
[...]

julia> Point{Float64}(1.0, 2.5) ## 显式的 T ##
Point{Float64}(1.0, 2.5)

julia> Point{Float64}(1,2) ## 显式的 T ##
Point{Float64}(1.0, 2.0)
```

就像你看到的那样，用类型参数显式地调用构造函数，其参数会被转换为指定的类型：`Point{Int64}(1,2)` 可以正常工作，但是 `Point{Int64}(1.0,2.5)` 则会在将 `2.5` 转换为 [`Int64`](@ref) 的时候报一个 [`InexactError`](@ref)。当类型是从构造函数的参数隐式推导出来的时候，比如在例子 `Point(1,2)` 中，输入参数的类型必须一致，否则就无法确定 `T` 是什么，但 `Point` 的构造函数仍可以适配任意同类型的实数对。

实际上，这里的 `Point`，`Point{Float64}` 以及 `Point{Int64}` 是不同的构造函数。`Point{T}` 表示对于每个类型 `T` 都存在一个不同的构造函数。如果不显式提供内部构造函数，在声明复合类型 `Point{T<:Real}` 的时候，Julia 会对每个满足 `T<:Real` 条件的类型都提供一个默认的内部构造函数 `Point{T}`，它们的行为与非参数类型的默认内部构造函数一致。Julia 同时也会提供了一个通用的外部构造函数 `Point`，用于适配任意同类型的实数对。Julia 默认提供的构造函数等价于下面这种显式的声明：

```jldoctest parametric2
julia> struct Point{T<:Real}
           x::T
           y::T
           Point{T}(x,y) where {T<:Real} = new(x,y)
       end

julia> Point(x::T, y::T) where {T<:Real} = Point{T}(x,y);
```

注意，每个构造函数定义的方式与调用它们的方式是一样的。调用 `Point{Int64}(1,2)` 会触发 `struct` 块内部的 `Point{T}(x,y)`。另一方面，外部构造函数声明的 `Point` 构造函数只会被同类型的实数对触发，它使得我们可以直接以 `Point(1,2)` 和 `Point(1.0,2.5)` 这种方式来创建实例，而不需要显示地使用类型参数。由于此方法的声明方式已经对输入参数的类型施加了约束，像 `Point(1,2.5)` 这种调用自然会导致 "no method" 错误。

假如我们想让 `Point(1,2.5)` 这种调用方式正常工作，比如，通过将整数 `1` 自动「提升」为浮点数 `1.0`，最简单的方法是像下面这样定义一个额外的外部构造函数：

```jldoctest parametric2
julia> Point(x::Int64, y::Float64) = Point(convert(Float64,x),y);
```

此方法采用了 [`convert`](@ref) 函数，显式地将 `x` 转化成了 [`Float64`](@ref) 类型，之后再委托前面讲到的那个通用的外部构造函数来进行具体的构造工作，经过转化，两个参数的类型都是 [`Float64`](@ref)，所以可以正确构造出一个 `Point{Float64}` 对象，而不会像之前那样触发 [`MethodError`](@ref)。

```jldoctest parametric2
julia> Point(1,2.5)
Point{Float64}(1.0, 2.5)

julia> typeof(ans)
Point{Float64}
```

然而，其它类似的调用依然有问题：

```jldoctest parametric2
julia> Point(1.5,2)
ERROR: MethodError: no method matching Point(::Float64, ::Int64)
Closest candidates are:
  Point(::T, !Matched::T) where T<:Real at none:1
```

如果你想要找到一种方法可以使类似的调用都可以正常工作，请参阅[类型转换与类型提升](@ref conversion-and-promotion)。这里稍稍“剧透”一下，我们可以利用下面的这个外部构造函数来满足需求，无论输入参数的类型如何，它都可以触发通用的 `Point` 构造函数：

```jldoctest parametric2
julia> Point(x::Real, y::Real) = Point(promote(x,y)...);
```

这里的 `promote` 函数会将它的输入转化为同一类型，在此例中是 [`Float64`](@ref)。定义了这个方法，`Point` 构造函数会自动提升输入参数的类型，且提升机制与算术运算符相同，比如 [`+`](@ref)，因此对所有的实数输入参数都适用：

```jldoctest parametric2
julia> Point(1.5,2)
Point{Float64}(1.5, 2.0)

julia> Point(1,1//2)
Point{Rational{Int64}}(1//1, 1//2)

julia> Point(1.0,1//2)
Point{Float64}(1.0, 0.5)
```

所以，即使 Julia 提供的默认内部构造函数对于类型参数的要求非常严格，我们也有方法将其变得更加易用。正因为构造函数可以充分发挥类型系统、方法以及多重分派的作用，定义复杂的行为也会变得非常简单。

## 案例分析：分数的实现

上文主要讲了关于参数复合类型及其构造函数的一些零散内容，或许将这些内容结合起来的一个最佳方法是分析一个真实的案例。为此，我们来实现一个我们自己的分数类型 `OurRational`，它与 Julia 内置的分数类型 [`Rational`](@ref) 很相似，它的定义在 [`rational.jl`](https://github.com/JuliaLang/julia/blob/master/base/rational.jl) 里：


```jldoctest rational
julia> struct OurRational{T<:Integer} <: Real
           num::T
           den::T
           function OurRational{T}(num::T, den::T) where T<:Integer
               if num == 0 && den == 0
                    error("invalid rational: 0//0")
               end
               g = gcd(den, num)
               num = div(num, g)
               den = div(den, g)
               new(num, den)
           end
       end

julia> OurRational(n::T, d::T) where {T<:Integer} = OurRational{T}(n,d)
OurRational

julia> OurRational(n::Integer, d::Integer) = OurRational(promote(n,d)...)
OurRational

julia> OurRational(n::Integer) = OurRational(n,one(n))
OurRational

julia> ⊘(n::Integer, d::Integer) = OurRational(n,d)
⊘ (generic function with 1 method)

julia> ⊘(x::OurRational, y::Integer) = x.num ⊘ (x.den*y)
⊘ (generic function with 2 methods)

julia> ⊘(x::Integer, y::OurRational) = (x*y.den) ⊘ y.num
⊘ (generic function with 3 methods)

julia> ⊘(x::Complex, y::Real) = complex(real(x) ⊘ y, imag(x) ⊘ y)
⊘ (generic function with 4 methods)

julia> ⊘(x::Real, y::Complex) = (x*y') ⊘ real(y*y')
⊘ (generic function with 5 methods)

julia> function ⊘(x::Complex, y::Complex)
           xy = x*y'
           yy = real(y*y')
           complex(real(xy) ⊘ yy, imag(xy) ⊘ yy)
       end
⊘ (generic function with 6 methods)
```

第一行 -- `struct OurRational{T<:Integer} <: Real` -- 声明了 `OurRational` 会接收一个整数类型的类型参数，且它自己属于实数类型。它声明了两个成员：`num::T` 和 `den::T`。这表明一个 `OurRational{T}` 的实例中会包含一对整数，且类型为 `T`，其中一个表示分子，另一个表示分母。

现在事情开始变得有意思了，`OurRational` 只有一个内部构造函数，它的作用是检查 `num` 和 `den` 是否为 0，并确保构建的每个分数都是经过约分化简的形式，且分母为非负数。这可以令分子和分母同时除以它们的最大公约数来实现，最大公约数可以用 Julia 内置的 `gcd` 函数计算。由于 `gcd` 返回的最大公约数的符号是跟第一个参数 `den` 一致的，所以约分后一定会保证 `den` 的值为非负数。因为这是 `OurRational` 的唯一一个内部构造函数，所以我们可以确保构建出的 `OurRational` 对象一定是这种化简的形式。

为了方便，`OurRational` 也提供了一些其它的外部构造函数。第一个外部构造函数是“标准的”通用构造函数，当分子和分母的类型一致时，它就可以推导出类型参数 `T`。第二个外部构造函数可以用于分子和分母的类型不一致的情景，它会将分子和分母的类型提升至一个共同的类型，然后再委托第一个外部构造函数进行构造。第三个构造函数会将一个整数转化为分数，方法是将 1 当作分母。

在定义了外部构造函数之后，我们为 `⊘` 算符定义了一系列的方法，之后就可以使用 `⊘` 算符来写分数，比如 `1 ⊘ 2`。Julia 的 `Rational` 类型采用的是 [`//`](@ref) 算符。在做上述定义之前，`⊘` 是一个无意的且未被定义的算符。它的行为与在[有理数](@ref)一节中描述的一致，注意它的所有行为都是那短短几行定义的。第一个也是最基础的定义只是将 `a ⊘ b` 中的 `a` 和 `b` 当作参数传递给 `OurRational` 的构造函数来实例化 `OurRational`，当然这要求 `a` 和 `b` 分别都是整数。在 `⊘` 的某个操作数已经是分数的情况下，我们采用了一个有点不一样的方法来构建新的分数，这实际上等价于用分数除以一个整数。最后，我们也可以让 `⊘` 作用于复数，用来创建一个类型为 `Complex{OurRational}` 的对象，即一个实部和虚部都是分数的复数：

```jldoctest rational
julia> z = (1 + 2im) ⊘ (1 - 2im);

julia> typeof(z)
Complex{OurRational{Int64}}

julia> typeof(z) <: Complex{OurRational}
false
```

因此，尽管 `⊘` 算符通常会返回一个 `OurRational` 的实例，但倘若其中一个操作数是复整数，那么就会返回 `Complex{OurRational}`。感兴趣的话可以读一读 [`rational.jl`](https://github.com/JuliaLang/julia/blob/master/base/rational.jl)：它实现了一个完整的 Julia 基本类型，但却非常的简短，而且是自包涵的。

## Outer-only constructors

正如我们所看到的，典型的参数类型都有一个内部构造函数，它仅在全部的类型参数都已知的情况下才会被调用。例如，可以用 `Point{Int}` 调用，但`Point` 就不行。我们可以选择性的添加外部构造函数来自动推导并添加类型参数，比如，调用 `Point(1,2)` 来构造 `Point{Int}`。外部构造函数调用内部构造函数来实际创建实例。然而，在某些情况下，我们可能并不想要内部构造函数，从而达到禁止手动指定类型参数的目的。

例如，假设我们要定义一个类型用于存储数组以及其累加和：

```jldoctest
julia> struct SummedArray{T<:Number,S<:Number}
           data::Vector{T}
           sum::S
       end

julia> SummedArray(Int32[1; 2; 3], Int32(6))
SummedArray{Int32,Int32}(Int32[1, 2, 3], 6)
```

问题在于我们想让 `S` 的类型始终比 `T` 大，这样做是为了确保累加过程不会丢失信息。例如，当 `T` 是 [`Int32`](@ref) 时，我们想让 `S` 是 [`Int64`](@ref)。所以我们想要一种接口来禁止用户创建像 `SummedArray{Int32,Int32}` 这种类型的实例。一种实现方式是只提供一个 `SummedArray` 构造函数，当需要将其放入 `struct`-block 中，从而不让 Julia 提供默认的构造函数：

```jldoctest
julia> struct SummedArray{T<:Number,S<:Number}
           data::Vector{T}
           sum::S
           function SummedArray(a::Vector{T}) where T
               S = widen(T)
               new{T,S}(a, sum(S, a))
           end
       end

julia> SummedArray(Int32[1; 2; 3], Int32(6))
ERROR: MethodError: no method matching SummedArray(::Array{Int32,1}, ::Int32)
Closest candidates are:
  SummedArray(::Array{T,1}) where T at none:4
```

此构造函数将会被 `SummedArray(a)` 这种写法触发。`new{T,S}` 的这种写法允许指定待构建类型的参数，也就是说调用它会返回一个 `SummedArray{T,S}` 的实例。`new{T,S}` 也可以用于其它构造函数的定义中，但为了方便，Julia 会根据正在构造的类型自动推导出 `new{}` 花括号里的参数（如果可行的话）。
