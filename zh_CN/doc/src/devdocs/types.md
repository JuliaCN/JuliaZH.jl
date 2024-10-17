# More about types

使用Julia一段时间之后，你就会体会到类型在其中的基础性作用。本部分我们将深入到类型体系的内部，并着重关注 [Parametric Types](@ref)。

## Types and sets (and `Any` and `Union{}`/`Bottom`)

Julia的类型系统很容易会被看作是一种集合（set）。程序处理个体值，类型处理值的集合。但是集合与类型是两个不同的概念。一组值组成的集合 [`Set`](@ref) 本身也是一个值的集合。而类型描述的是一个组*可能*值组成的集合，即类型的值是不确定的。 

函数 [`typeof`](@ref) 可以返回*具体类型* `T` 包含的值的直接标签 `T`。而*抽象类型*描述的集合则可能会更大。

类型 [`Any`](@ref) 包含所有可能值。类型 [`Integer`](@ref) 是 `Any` 的一个子类型，而 `Integer`的子类型有包括 `Int`，[`Int8`](@ref) 等其他具体类型。在内部表征上，Julia 类型系统还非常依赖类型 `Bottom`，也记做`Union{}`。这对应于集合中的空集。

Julia类型系统支持集合理论的标准操作：你可以用 `T1 <: T2` 来判断类型 `T1` 是否是`T2` 的子集（子类型）。 [`typeintersect`](@ref) 和 [`typejoin`](@ref) 可用来计算两个类型的交集和合集；用 [`Union`](@ref) 用于集合所有列出的类型。

```jldoctest
julia> typeintersect(Int, Float64)
Union{}

julia> Union{Int, Float64}
Union{Float64, Int64}

julia> typejoin(Int, Float64)
Real

julia> typeintersect(Signed, Union{UInt8, Int8})
Int8

julia> Union{Signed, Union{UInt8, Int8}}
Union{UInt8, Signed}

julia> typejoin(Signed, Union{UInt8, Int8})
Integer

julia> typeintersect(Tuple{Integer, Float64}, Tuple{Int, Real})
Tuple{Int64, Float64}

julia> Union{Tuple{Integer, Float64}, Tuple{Int, Real}}
Union{Tuple{Int64, Real}, Tuple{Integer, Float64}}

julia> typejoin(Tuple{Integer, Float64}, Tuple{Int, Real})
Tuple{Integer, Real}
```

这些操作看起来很抽象，但是他们处于 Julia 语言的核心位置。例如，方法的派发过程就是对方法列表中的项目进行逐步搜索，直到找到一个其类型是方法标签子类型的参数元组为止。该算法有效的前提是方法必须按照特异性（specificity）进行排序，搜索过程必须从最具特异性的开始。所以，Julia 也需要对类型进行偏序排序(partial order)，该函数与 `<:` 类似但又不完全相同。


## `UnionAll`类型

Julia 的类型系统也可以表征类型的*迭代合集*(iterated union)，即某个变量的所有值的集合。当参数化类型的某些参数值是未知数时，迭代合集是非常有用的。

例如，下面这个数组 `Array{Int,2}` 有两个参数。如果其成分类型未知，该数组可以写成 `Array{T,2} where T`。该数组是取所有不同 `T` 值后的所有数组`Array{T,2}` 的合集：`Union{Array{Int8,2}, Array{Int16,2}, ...}`。

类型的迭代集合由类型为`UnionAll`的对象表征。`UnionAll`对象有一个类型为 `TypeVar` 的变量，此处为`T`，和一个包裹化的类型，此处为 `Array{T,2}`。

考虑下面的例子：

```julia
f1(A::Array) = 1
f2(A::Array{Int}) = 2
f3(A::Array{T}) where {T<:Any} = 3
f4(A::Array{Any}) = 4
```

如 [Function calls](@ref) 中描述的，函数 `f3` 的签名是元组类型的 `UnionAll` 类型包裹：`Tuple{typeof(f3), Array{T}} where T`。此处除 `f4` 外所有函数都可以被`a = [1,2]`调用；除 `f2` 外所有函数都可以被 `b = Any[1,2]` 调用。

`dump()` 函数可用于进一步查看这些类型：

```jldoctest
julia> dump(Array)
UnionAll
  var: TypeVar
    name: Symbol T
    lb: Union{}
    ub: Any
  body: UnionAll
    var: TypeVar
      name: Symbol N
      lb: Union{}
      ub: Any
    body: Array{T, N} <: DenseArray{T, N}
```

这说明数组 `Array` 实际上命名了一个 `UnionAll` 类型。嵌套其中的参数也都是 `UnionAll` 类型。句法 `Array{Int,2}` 等价于`Array{Int}{2}`。`UnionAll` 在内部会被实例化为变量的特定值，每次一个，从最外侧开始。这使得省略尾端参数是自然而有意义的：类型 `Array{Int}` 与类型 `Array{Int, N} where N`。 

`TypeVar` 本身不是类型，而是 `UnionAll` 类型的一个内部结构成分。类型变量的值会有上界和下界，分别由字段`lb` 和 `ub` 表示。符号 `name` 是纯装饰性的（cosmetic）。在内部 `TypeVar` 是通过地址比较的。所以为了区分“不同”变量类型，`TypeVar` 是一个可更改类型，但通常不应修改它们。

你也可以手动创建 `TypeVar`:

```jldoctest
julia> TypeVar(:V, Signed, Real)
Signed<:V<:Real
```

你可以用更简便的方式省掉除 `name` 之外的任意参数。

句法 `Array{T} where T<:Integer` 会被降级为如下格式。

```julia
let T = TypeVar(:T,Integer)
    UnionAll(T, Array{T})
end
```

所以极少需要手动建构 `TypeVar`（实际上这也应该是尽量避免的）。

## 自由变量

*自由*类型变量在类型系统中是至关重要的。如果类型 `T` 不包含一个引入变量 `V` 的 `UnionAll` 类型，那么类型 `T` 中的变量 `V` 就是自由的 （free）。例如，类型 `Array{Array{V} where V<:Integer}` 没有自由变量，但该类型的子成分 `Array{V}` 则包含了一个自由变量 `V`。

从某种程度上讲，一个包含自由变量的类型根本就不是一个类型。例如，类型 `Array{Array{T}} where T` 是一个成分为数组的数组，且所有子数组元素的类型都相同。其内部类型 `Array{T}` 乍一看似乎包含所有数组类型。但外部数组的成分必须有*相同*类型，所以 `Array{T}` 不能指向所有数组。我们可以说 `Array{T}` 出现了很多次，但每次 `T` 值都必须相同。

故此， C 应用程序接口函数 `jl_has_free_typevars` 是非常重要的。若该函数的返回值为真，则说明类型中存在自由变量。此时子类型判断和其他类型函数中的返回结果没有太多意义。

## 类型名称`TypeNames`

下面两个数组 [`Array`](@ref) 类型在功能上是相同的，但有不同的打印方式：


```jldoctest
julia> TV, NV = TypeVar(:T), TypeVar(:N)
(T, N)

julia> Array
Array

julia> Array{TV, NV}
Array{T, N}
```

二者之间的差别可以通过类型的名称 `name` 字段来区分。名称 `name` 字段是一个类型为 `TypeName` 的对象。 


```julia-repl
julia> dump(Array{Int,1}.name)
TypeName
  name: Symbol Array
  module: Module Core
  names: empty SimpleVector
  wrapper: UnionAll
    var: TypeVar
      name: Symbol T
      lb: Union{}
      ub: Any
    body: UnionAll
      var: TypeVar
        name: Symbol N
        lb: Union{}
        ub: Any
      body: Array{T, N} <: DenseArray{T, N}
  cache: SimpleVector
    ...

  linearcache: SimpleVector
    ...

  hash: Int64 -7900426068641098781
  mt: MethodTable
    name: Symbol Array
    defs: Nothing nothing
    cache: Nothing nothing
    max_args: Int64 0
    kwsorter: #undef
    module: Module Core
    : Int64 0
    : Int64 0
```

与此相关的字段是包装器 `wrapper`，该字段存储了一个指向顶层类型（tip-level）的引用，用以产生新的数组 `Array` 类型。


```julia-repl
julia> pointer_from_objref(Array)
Ptr{Cvoid} @0x00007fcc7de64850

julia> pointer_from_objref(Array.body.body.name.wrapper)
Ptr{Cvoid} @0x00007fcc7de64850

julia> pointer_from_objref(Array{TV,NV})
Ptr{Cvoid} @0x00007fcc80c4d930

julia> pointer_from_objref(Array{TV,NV}.name.wrapper)
Ptr{Cvoid} @0x00007fcc7de64850
```

数组 [`Array`](@ref) 的包装器 `wrapper` 字段指向它自己，而在数组 `Array{TV,NV}` 中，该字段则指回该类型的原始定义。

那其他字段都是什么作用呢？字段`hash` 会给每个类型指派一个整数。要查看 `cache` 字段的内容，最好选不像数组那么常用的类型。我们可以自己创造一个类型：

```jldoctest
julia> struct MyType{T,N} end

julia> MyType{Int,2}
MyType{Int64, 2}

julia> MyType{Float32, 5}
MyType{Float32, 5}
```

当参数类型被实例化时，每个具体类型都会被存储到类型缓存中（`MyType.body.body.name.cache`）。不过含有自由变量的实例是不会被缓存的。


## 元组类型

元组类型是一个有趣的特例。为了使派发在诸如 `x::Tuple` 之类的声明中正常工作，该类型必须能包含所有元组。我们可以查看一下元组的参数：

```jldoctest
julia> Tuple
Tuple

julia> Tuple.parameters
svec(Vararg{Any})
```

与其他类型不同，元组类型的参数是共变的（covariant），所以类型 `Tuple` 能与任何类型的元组相匹配。



```jldoctest
julia> typeintersect(Tuple, Tuple{Int,Float64})
Tuple{Int64, Float64}

julia> typeintersect(Tuple{Vararg{Any}}, Tuple{Int,Float64})
Tuple{Int64, Float64}
```

但是，如果一个可变元组 (`Vararg`) 类型含有自由变量，那么他描述的元组类型则可能就是不同的：



```jldoctest
julia> typeintersect(Tuple{Vararg{T} where T}, Tuple{Int,Float64})
Tuple{Int64, Float64}

julia> typeintersect(Tuple{Vararg{T}} where T, Tuple{Int,Float64})
Union{}
```

当 `T` 绑定的 `UnionAll` 类型位于元组 `Tuple` 之外，即 `T` 是元组 `Tuple` 的自由变量时，一个唯一的 `T` 值必须作用与整个类型。此时异质的元组是不匹配的。

最后，意识到元组 `Tuple{}` 的独特性是有意义的：

```jldoctest
julia> Tuple{}
Tuple{}

julia> Tuple{}.parameters
svec()

julia> typeintersect(Tuple{}, Tuple{Int})
Union{}
```

那么什么是元组类型的基本（primary）类型呢？



```julia-repl
julia> pointer_from_objref(Tuple)
Ptr{Cvoid} @0x00007f5998a04370

julia> pointer_from_objref(Tuple{})
Ptr{Cvoid} @0x00007f5998a570d0

julia> pointer_from_objref(Tuple.name.wrapper)
Ptr{Cvoid} @0x00007f5998a04370

julia> pointer_from_objref(Tuple{}.name.wrapper)
Ptr{Cvoid} @0x00007f5998a04370
```

所以 `Tuple == Tuple{Vararg{Any}}` 事实上就是其基本类型。



## 对角变量

考虑类型 `Tuple{T,T} where T`。使用该标签的方法看起来会是下面的样子：



```julia
f(x::T, y::T) where {T} = ...
```

根据对类型 `UnionAll` 的通常理解， `T` 将覆盖所有的类型，包括 `T`，所以此类型应该等价于 `Tuple{Any,Any}`。但是这种理解会面临很多实际的问题。



首先，`T` 值需要在方法定之内可及。对诸如 `f(1, 1.0)` 的调用来说，`T` 的值是不明确的。`T` 可以是 `Union{Int,Float64}` 或 [`Real`](@ref)。直觉上，声明 `x::T` 意味着 `T` 应该为 `x` 的类型，即 `T === typeof(x)`。为了保有这种不变性， 该方法应满足如下关系： `typeof(x) === typeof(y) === T`。 这说明该方法只能被拥有相同类型的参数元组调用。

能依据两个值的类型是否相同进行派发是非常有用的（例如类型提升系统就用到了该机制）。所以我们有很多理由给 `Tuple{T,T} where T` 一个不同的含义。为此，我们在子类型系统中增加了如下规则：\textbf{如果一个变量在共变位置上出现了不止一次，那么其作用范围将仅局限于具体类型}。共变位置指在一个变量和引入该变量的 `UnionAll` 类型之间，只出现了元组 `Tuple` 类型和联合 `Union` 类型。这些变量被称为对角变量（diagonal variables）或具体变量（concrete variables）。

例如，元组 `Tuple{T,T} where T` 可以被看作是如下元组的集合 `Union{Tuple{Int8,Int8}, Tuple{Int16,Int16}, ...}`， 即 `T` 包括所有的具体类型。该规则会产生一些有趣的子类型结果。例如 `Tuple{Real,Real}` 不是 `Tuple{T,T} where T` 的子类型，因为前者包含了诸如 `Tuple{Int8,Int16}` 的子类型，该子类型的元素类型是不同的。`Tuple{Real,Real}` 和 `Tuple{T,T} where T` 又一个不容小视的交集 `Tuple{T,T} where T<:Real`。但是 `Tuple{Real}` 是 `Tuple{T} where T` 的子集，因为此时 `T` 只出现了一次，所以是不对角的。

现在考虑如下签名：



```julia
f(a::Array{T}, x::T, y::T) where {T} = ...
```

此例中， `T` 出现在了非共变位置，即 `Array{T}` 之内。 这意味着无论数组传递的类型是什么，该类型都会无歧义的决定 `T`，即 `T` 又一个等价性限制（equality constraint）。此时是不需要对角规则的，因为数组决定了 `T`，然后 `x` 和 `y` 则可以是 `T` 的任何子类型。所以非共变位置的变量均不受对角线规则的限制。上述定义的行为选择有一点矛盾，或许应该写成：

```julia
f(a::Array{T}, x::S, y::S) where {T, S<:T} = ...
```

为明确 `x` 和 `y` 应该有相同的类型。如果 `x` 和 `y` 可以有不同类型，这个版本的签名可以引入针对类型 `y` 的第三个变量。

下面一个难题是合集 `Union{}` 和对角线变量的交互作用，例如


```julia
f(x::Union{Nothing,T}, y::T) where {T} = ...
```

考虑一下这个生命的含义。`y` 的类型是 `T`。 而 `x` 的类型或者与 `y` 相同 `T` 或类型为空 [`Nothing`](@ref)。下面调用都是匹配的。

```julia
f(1, 1)
f("", "")
f(2.0, 2.0)
f(nothing, 1)
f(nothing, "")
f(nothing, 2.0)
```

上述例子告诉我们：当 `x` 的类型是空集 `nothing::Nothing` 时，`y` 的类型就没有任何限制了。此时方法标签中字段 `y` 可以是任何类型，即 `y::Any`。确实，下面两个类型是等价的：

```julia
(Tuple{Union{Nothing,T},T} where T) == Union{Tuple{Nothing,Any}, Tuple{T,T} where T}
```

一般的规则是：如果出现在共变位置的一个具体变量只被子类型算法（subtyping algorithm）*使用一次*，则该具体变量的行为就会像一个抽象变量。上例中，当 `x` 类型为空时 `Nothing`，集合 `Union{Nothing,T}` 中的类型 `T` 不起作用，即 `T` 只在第二个槽中被用到。此时，无论把 `Tuple{T} where T` 中的 `T` 限制为具体类型还是不限制，该类型都等价于 `Tuple{Any}`。

当变量出现在*非共变* 位置时，无论是否被使用，该变量都不再是具体变量。否则类型的行为就会因为比较对象类型的不同而不同，从而违反传递律（transitive）。例如，



```julia
Tuple{Int,Int8,Vector{Integer}} <: Tuple{T,T,Vector{Union{Integer,T}}} where T
```

如果忽略掉合集 `Union` 内部的 `T`，则 `T` 就是具体的，且上述判断结果是 “否”，因为左侧元组前两个成分的类型是不同的。这两个类型不相同。再看下例：



```julia
Tuple{Int,Int8,Vector{Any}} <: Tuple{T,T,Vector{Union{Integer,T}}} where T
```

此处合集 `Union` 内的 `T` 是不能被忽略的，因为 `T` 必须等于 `Any`，即 `T == Any`。所以 `T` 不能是具体的，且判断结果为“真”。所以，类型 `T` 的具体还是抽象是受制于其他类型特征的。这是不被接受的，因为类型的含义必须是清晰和自洽的。所以，向量 `Vector` 之内的 `T` 需要同时考虑这两种情况。

## 对角变量的子类型

对角变量的子系统算法（substyping algorithm）有两个成分：（1）确定变量出现次数；（2）确保对角变量只包含具体类型。



第一个任务由两个计数器完成。环境中的每个自由变量都有两个计数器 `occurs_inv` 和 `occurs_cov` (在文件 `src/subtype.c` 中)，分别用于追踪不变和共变的出现次数。如果 `occurs_inv == 0 && occurs_cov > 1` 则这个变量就是对角的。



第二个任务通过在变量下界添加一个条件实现。子类型算法在运行过程中会逐渐压缩每个变量的界限（提高下界和降低上界），以保证子类型关系在该变量范围内能继续保持。评估完对角变量合集类型 `UnionAll` 后，可以查看边界的最终值。因为变量必须是具体的，所以如果其下边界不是具体类型的子类型，就会产生矛盾。例如，抽象类型 [`AbstractArray`](@ref) 不可能是一个具体类型的子类型，而具体类型 `Int` 则可以，空类型 `Bottom` 也可以。如果下边界没通过该测试，算法将终止并返回 `false`。

例如，如果 `T` 是 `Union{Int,String}` 的上位类型，则 `Tuple{Int,String}` 将是 `Tuple{T,T} where T` 的子集，即 `Tuple{Int,String} <: Tuple{T,T} where T` 的返回值将为真。但 `Union{Int,String}` 是一个抽象类型，所以上述关系不成立。

具体性判断是由函数 `is_leaf_bound` 完成的。注意该函数与函数 `jl_is_leaf_type` 稍微有点不同，因为其对类型 `Bottom` 的返回值也为真 `true`。该函数目前是启发式的，无法捕获所有的具体类型。该函数的困难在于，其他变量类型的界限会影响当下变量下界限的具体与否。例如，只有当 `T` 的上界限和下界限都是 `Int` 时，类型 `Vector{T}` 才和具体类型 `Vector{Int}` 相同。目前，设计者还没有想出一个完备的算法来解决该问题。

## 内部机制

大部分类型处理操作都存储在 `jltypes.c` 和 `subtype.c` 这两个文件中。了解自类型系统的最好方式是查看其工作方式。用 `make debug` 创建且在调试器中运行程序。手册[gdb debugging tips](@ref)章中有一些有用的建议。

因为 REPL 中也经常使用子类型代码 -- 这些代码中的断点也经常被触发。所以定义下面函数并在 `jl_breakpoint` 中设定一个断点将非常方便：



```julia-repl
julia> function mysubtype(a,b)
           ccall(:jl_breakpoint, Cvoid, (Any,), nothing)
           a <: b
       end
```

一旦该断点被触发，你就可以在其他函数中设定断点了。


作为热身，试一下下面代码

```julia
mysubtype(Tuple{Int, Float64}, Tuple{Integer, Real})
```

你也可以用一个更复杂的例子让其变得更有趣：



```julia
mysubtype(Tuple{Array{Int,2}, Int8}, Tuple{Array{T}, T} where T)
```

## 子类型和方法排序

函数 `type_morespecific` 可用来对函数的方法列表从最具特异行到最不具特异性进行部分排序（partial order）。特异性是严格的：如果 `a` 比 `b` 更特异，则 `b` 就不比 `a` 更特异。

如果 `a` 是 `b` 的严格子类型（strict subtype），那么 `a` 就自动的比 `b` 更特异。接下来，函数 `type_morespecific` 还引进了一些不太形式化的规则。例如，子类型 `subtype` 对参数的数量敏感，而函数 `type_morespecific` 则不敏感。特别的，`Tuple{Int,AbstractFloat}` 比 `Tuple{Integer}` 更特异，虽然前者不是后者的子类型。此外， `Tuple{Int,AbstractFloat}` 和 `Tuple{Integer,Float64}` 不存在特异性关系。类似的，`Tuple{Int,Vararg{Int}}` 不是 `Tuple{Integer}` 的子类型，但前者比后者更特异。但是，长度确实也影响特异性关系`morespecific`，如 `Tuple{Int,Int}` 比 `Tuple{Int,Vararg{Int}}` 更特异。

要调试方法的排序，定义下面的函数很方便：

```julia
type_morespecific(a, b) = ccall(:jl_type_morespecific, Cint, (Any,Any), a, b)
```

它可以被用来测试元组 `a` 是否比元组 `b` 更特异。
