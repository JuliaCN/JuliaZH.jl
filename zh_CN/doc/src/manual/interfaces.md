# 接口

Julia 的很多能力和扩展性都来自于一些非正式的接口。通过为自定义的类型扩展一些特定的方法，自定义类型的对象不但获得那些方法的功能，而且也能够用于其它的基于那些行为而定义的通用方法中。

## [迭代](@id man-interface-iteration)

| 必需方法               |                        | 简短描述                                                                     |
|:------------------------------ |:---------------------- |:------------------------------------------------------------------------------------- |
| `iterate(iter)`                |                        | 通常返回由第一项及其其初始状态组成的元组，但如果是空，则要么返回[`nothing`](@ref)         |
| `iterate(iter, state)`         |                        | 通常返回由下一项及其状态组成的元组，或者在没有下一项存在时返回 `nothing`。  |
| **重要可选方法** | **默认定义** | **简短描述**                                                                 |
| `IteratorSize(IterType)`       | `HasLength()`          |  `HasLength()` ， `HasShape{N}()` ，  `IsInfinite()` ， 或者 `SizeUnknown()` 作为合适的 |
| `IteratorEltype(IterType)`     | `HasEltype()`          | `EltypeUnknown()`  和 `HasEltype()`  都是可接受的                              |
| `eltype(IterType)`             | `Any`                  | 元组中第一个条目的类型由 `iterate()` 返回。                      |
| `length(iter)`                 | (*未定义*)          | 条目数，如果已知                                                         |
| `size(iter, [dim...])`         | (*未定义*)          | 在各个维度上条目的数量，如果知道                                       |

|  `IteratorSize(IterType)` 返回的值。 | 必需方法                           |
|:------------------------------------------ |:------------------------------------------ |
| `HasLength()`                              | [`length(iter)`](@ref)                     |
| `HasShape{N}()`                            | `length(iter)` 和 `size(iter, [dim...])` |
| `IsInfinite()`                             | (*none*)                                   |
| `SizeUnknown()`                            | (*none*)                                   |

| 由 `IteratorEltype(IterType)` 返回的值 | 必需方法   |
|:-------------------------------------------- |:------------------ |
| `HasEltype()`                                | `eltype(IterType)` |
| `EltypeUnknown()`                            | (*none*)           |

顺序迭代由  [`iterate`](@ref) 函数实现. 
Julia的迭代器可以从目标外部跟踪迭代状态，而不是在迭代过程中改变目标本身。
迭代过程中的返回一个包含了当前迭代值及其状态的元组，或者在没有元素存在的情况下返回  `nothing`  。
状态对象将在下一次迭代时传递回迭代函数 并且通常被认为是可迭代对象的私有实现细节。

任何定义了这个函数的兑现个都是可迭代的，并且可以被应用到  [many functions that rely upon iteration](@ref lib-collections-iteration) 。
也可以直接被应用到  [`for`](@ref) 循环中，因为根据语法：

```julia
for i in iter   # or  "for i = iter"
    # body
end
```

被解释为：

```julia
next = iterate(iter)
while next !== nothing
    (i, state) = next
    # body
    next = iterate(iter, state)
end
```

一个简单的例子是一组定长数据的平方数迭代序列：

```jldoctest squaretype
julia> struct Squares
           count::Int
       end

julia> Base.iterate(S::Squares, state=1) = state > S.count ? nothing : (state*state, state+1)
```

仅仅定义了 [`iterate`](@ref) 函数的 `Squares` 类型就已经很强大了。我们现在可以迭代所有的元素了：

```jldoctest squaretype
julia> for i in Squares(7)
           println(i)
       end
1
4
9
16
25
36
49
```

我们可以利用许多内置方法来处理迭代，比如标准库 `Statistics`  中的  [`in`](@ref) ， [`mean`](@ref) 和 [`std`](@ref) 。

```jldoctest squaretype
julia> 25 in Squares(10)
true

julia> using Statistics

julia> mean(Squares(100))
3383.5

julia> std(Squares(100))
3024.355854282583
```

我们可以扩展一些其它的方法，为Julia提供有关此可迭代集合的更多信息。我们知道 `Squares` 序列中的元素总是 `Int` 型的。通过扩展 [`eltype`](@ref) 方法，我们可以给 Julia 过多的信息来帮助其在更复杂的方法中产生更加具体的代码。我们同时也知道我们序列中的元素数目，所以我们也同样可以扩展 [`length`](@ref)：

```jldoctest squaretype
julia> Base.eltype(::Type{Squares}) = Int # Note that this is defined for the type

julia> Base.length(S::Squares) = S.count
```

现在，当我们让Julia去  [`collect`](@ref) 所有元素到一个array中时，Julia可以预分配一个 适当大小的  `Vector{Int}` ，而不是盲目地  [`push!`](@ref) 每一个元素到 `Vector{Any}` ：

```jldoctest squaretype
julia> collect(Squares(4))
4-element Array{Int64,1}:
  1
  4
  9
 16
```

尽管大多时候我们都可以依赖于一些通用的实现，某些时候如果我们知道有一个更简单的算法的话，可以扩展出更具体的方法。例如，计算平方和有一个公式，因此可以扩展出一个更高效的解法：

```jldoctest squaretype
julia> Base.sum(S::Squares) = (n = S.count; return n*(n+1)*(2n+1)÷6)

julia> sum(Squares(1803))
1955361914
```

这种模式在Julia Base中很常见，一些必须实现的方法构成了一个小的集合，从而定义出一个非正式的接口，用于实现一些非常炫酷的操作。某些时候，类型本身知道在其应用场景中有一些更高效的算法，因而可以扩展出额外方法。

能以*逆序*迭代集合也很有用，这可通过迭代 [`Iterators.reverse(iterator)`](@ref) 实现。但是，为了实际支持逆序迭代，迭代器类型 `T` 需要为 `Iterators.Reverse{T}` 实现 `iterate`。（给定 `r::Iterators.Reverse{T}`，类型 `T` 的底层迭代器是 `r.itr`。）在我们的 `Squares` 示例中，我们将实现 `Iterators.Reverse{Squares}` 方法：

```jldoctest squaretype
julia> Base.iterate(rS::Iterators.Reverse{Squares}, state=rS.itr.count) = state < 1 ? nothing : (state*state, state-1)

julia> collect(Iterators.reverse(Squares(4)))
4-element Array{Int64,1}:
 16
  9
  4
  1
```

## 索引

| 需要实现的方法 | 简介 |
|:-------------------- |:-------------------------------- |
| `getindex(X, i)` | `X[i]`，索引元素访问 |
| `setindex!(X, v, i)` | `X[i] = v`，索引元素赋值 |
| `firstindex(X)` | 第一个索引 |
| `lastindex(X)` | 最后一个索引，用于 `X[end]` |

对于 `Squares` 类型而言，可以通过对第 `i` 个元素求平方计算出其中的第 `i` 个元素，可以用 `S[i]` 的索引表达式形式暴露该接口。为了支持该行为，`Squares` 只需要简单地定义 [`getindex`](@ref)：

```jldoctest squaretype
julia> function Base.getindex(S::Squares, i::Int)
           1 <= i <= S.count || throw(BoundsError(S, i))
           return i*i
       end

julia> Squares(100)[23]
529
```

另外，为了支持语法 `S[end]`，我们必须定义 [`lastindex`](@ref) 来指定最后一个有效索引。建议也定义 [`firstindex`](@ref) 来指定第一个有效索引：

```jldoctest squaretype
julia> Base.firstindex(S::Squares) = 1

julia> Base.lastindex(S::Squares) = length(S)

julia> Squares(23)[end]
529
```

但请注意，上面只定义了带有一个整数索引的 [`getindex`](@ref)。使用除 `Int` 外的任何值进行索引会抛出 [`MethodError`](@ref)，表示没有匹配的方法。为了支持使用某个范围内的 `Int` 或 `Int` 向量进行索引，必须编写单独的方法：

```jldoctest squaretype
julia> Base.getindex(S::Squares, i::Number) = S[convert(Int, i)]

julia> Base.getindex(S::Squares, I) = [S[i] for i in I]

julia> Squares(10)[[3,4.,5]]
3-element Array{Int64,1}:
  9
 16
 25
```

虽然这开始支持更多[某些内置类型支持的索引操作](@ref man-array-indexing)，但仍然有很多行为不支持。因为我们为 `Squares` 序列所添加的行为，它开始看起来越来越像向量。我们可以正式定义其为 [`AbstractArray`](@ref) 的子类型，而不是自己定义所有这些行为。

## [抽象数组](@id man-interface-array)

| 需要实现的方法                            |                                        | 简短描述                                                                     |
|:----------------------------------------------- |:-------------------------------------- |:------------------------------------------------------------------------------------- |
| `size(A)`                                       |                                        | 返回包含 `A` 维度的元组                                      |
| `getindex(A, i::Int)`                           |                                        | （如果 `IndexLinear`）线性标量索引                                             |
| `getindex(A, I::Vararg{Int, N})`                |                                        | （如果 `IndexCartesian`，其中 `N = ndims(A)`）N 维标量索引             |
| `setindex!(A, v, i::Int)`                       |                                        | （如果 `IndexLinear`）线性索引元素赋值                                          |
| `setindex!(A, v, I::Vararg{Int, N})`            |                                        | （如果 `IndexCartesian`，其中 `N = ndims(A)`）N 维标量索引元素赋值   |
| **可选方法**                            | **默认定义**                 | **简短描述**                                                                 |
| `IndexStyle(::Type)`                            | `IndexCartesian()`                     | Returns either `IndexLinear()` or `IndexCartesian()`. See the description below.      |
| `getindex(A, I...)`                             | defined in terms of scalar `getindex`  | [Multidimensional and nonscalar indexing](@ref man-array-indexing)                    |
| `setindex!(A, I...)`                            | defined in terms of scalar `setindex!` | [Multidimensional and nonscalar indexed assignment](@ref man-array-indexing)          |
| `iterate`                                       | defined in terms of scalar `getindex`  | Iteration                                                                             |
| `length(A)`                                     | `prod(size(A))`                        | 元素数                                                                    |
| `similar(A)`                                    | `similar(A, eltype(A), size(A))`       | 返回具有相同形状和元素类型的可变数组                           |
| `similar(A, ::Type{S})`                         | `similar(A, S, size(A))`               | 返回具有相同形状和指定元素类型的可变数组             |
| `similar(A, dims::NTuple{Int})`                 | `similar(A, eltype(A), dims)`          | 返回具有相同元素类型和大小为 *dims* 的可变数组                     |
| `similar(A, ::Type{S}, dims::NTuple{Int})`      | `Array{S}(undef, dims)`               | 返回具有指定元素类型及大小的可变数组                       |
| **Non-traditional indices**                     | **默认定义**                 | **简短描述**                                                                 |
| `axes(A)`                                    | `map(OneTo, size(A))`                  | Return the `AbstractUnitRange` of valid indices                                       |
| `Base.similar(A, ::Type{S}, inds::NTuple{Ind})` | `similar(A, S, Base.to_shape(inds))`   | Return a mutable array with the specified indices `inds` (see below)                  |
| `Base.similar(T::Union{Type,Function}, inds)`   | `T(Base.to_shape(inds))`               | Return an array similar to `T` with the specified indices `inds` (see below)          |

如果一个类型被定义为 `AbstractArray` 的子类型，那它就继承了一大堆丰富的行为，包括构建在单元素访问之上的迭代和多维索引。有关更多支持的方法，请参阅文档 [多维数组](@ref man-multi-dim-arrays) 及 [Julia Base](@ref lib-arrays)。

定义 `AbstractArray` 子类型的关键部分是 [`IndexStyle`](@ref)。由于索引是数组的重要部分且经常出现在 hot loops 中，使索引和索引赋值尽可能高效非常重要。数组数据结构通常以两种方式定义：要么仅使用一个索引（即线性索引）来最高效地访问其元素，要么实际上使用由各个维度确定的索引访问其元素。这两种方式被 Julia 标记为 `IndexLinear()` 和 `IndexCartesian()`。把线性索引转换为多重索引下标通常代价高昂，因此这提供了基于 traits 机制，以便能为所有矩阵类型提供高效的通用代码。

此区别决定了该类型必须定义的标量索引方法。`IndexLinear()` 很简单：只需定义 `getindex(A::ArrayType, i::Int)`。当数组后用多维索引集进行索引时，回退 `getindex(A::AbstractArray, I...)()` 高效地将该索引转换为线性索引，然后调用上述方法。另一方面，`IndexCartesian()` 数组需要为每个支持的、使用 `ndims(A)` 个 `Int` 索引的维度定义方法。例如，`SparseArrays` 标准库里的 [`SparseMatrixCSC`](@ref) 只支持二维，所以它只定义了 `getindex(A::SparseMatrixCSC, i::Int, j::Int)`。[`setindex!`](@ref) 也是如此。

回到上面的平方数序列，我们可以将它定义为 `AbstractArray{Int, 1}` 的子类型：

```jldoctest squarevectype
julia> struct SquaresVector <: AbstractArray{Int, 1}
           count::Int
       end

julia> Base.size(S::SquaresVector) = (S.count,)

julia> Base.IndexStyle(::Type{<:SquaresVector}) = IndexLinear()

julia> Base.getindex(S::SquaresVector, i::Int) = i*i
```

请注意，指定 `AbstractArray` 的两个参数非常重要；第一个参数定义了 [`eltype`](@ref)，第二个则定义了 [`ndims`](@ref)。该超类型和这三个方法就足以使 `SquaresVector` 变成一个可迭代、可索引且功能齐全的数组：

```jldoctest squarevectype
julia> s = SquaresVector(4)
4-element SquaresVector:
  1
  4
  9
 16

julia> s[s .> 8]
2-element Array{Int64,1}:
  9
 16

julia> s + s
4-element Array{Int64,1}:
  2
  8
 18
 32

julia> sin.(s)
4-element Array{Float64,1}:
  0.8414709848078965
 -0.7568024953079282
  0.4121184852417566
 -0.2879033166650653
```

作为一个更复杂的例子，让我们在 [`Dict`](@ref) 之上定义自己的玩具性质的 N 维稀疏数组类型。

```jldoctest squarevectype
julia> struct SparseArray{T,N} <: AbstractArray{T,N}
           data::Dict{NTuple{N,Int}, T}
           dims::NTuple{N,Int}
       end

julia> SparseArray(::Type{T}, dims::Int...) where {T} = SparseArray(T, dims);

julia> SparseArray(::Type{T}, dims::NTuple{N,Int}) where {T,N} = SparseArray{T,N}(Dict{NTuple{N,Int}, T}(), dims);

julia> Base.size(A::SparseArray) = A.dims

julia> Base.similar(A::SparseArray, ::Type{T}, dims::Dims) where {T} = SparseArray(T, dims)

julia> Base.getindex(A::SparseArray{T,N}, I::Vararg{Int,N}) where {T,N} = get(A.data, I, zero(T))

julia> Base.setindex!(A::SparseArray{T,N}, v, I::Vararg{Int,N}) where {T,N} = (A.data[I] = v)
```

请注意，这是个 `IndexCartesian` 数组，因此我们必须在数组的维度上手动定义 [`getindex`](@ref) 和 [`setindex!`](@ref)。与 `SquaresVector` 不同，我们可以定义 [`setindex!`](@ref)，这样便能更改数组：

```jldoctest squarevectype
julia> A = SparseArray(Float64, 3, 3)
3×3 SparseArray{Float64,2}:
 0.0  0.0  0.0
 0.0  0.0  0.0
 0.0  0.0  0.0

julia> fill!(A, 2)
3×3 SparseArray{Float64,2}:
 2.0  2.0  2.0
 2.0  2.0  2.0
 2.0  2.0  2.0

julia> A[:] = 1:length(A); A
3×3 SparseArray{Float64,2}:
 1.0  4.0  7.0
 2.0  5.0  8.0
 3.0  6.0  9.0
```

索引 `AbstractArray` 的结果本身可以是数组（例如，在使用 `AbstractRange` 时）。`AbstractArray` 回退方法使用 [`similar`](@ref) 来分配具有适当大小和元素类型的 `Array`，该数组使用上述的基本索引方法填充。但是，在实现数组封装器时，你通常希望也封装结果：

```jldoctest squarevectype
julia> A[1:2,:]
2×3 SparseArray{Float64,2}:
 1.0  4.0  7.0
 2.0  5.0  8.0
```

在此例中，创建合适的封装数组通过定义 `Base.similar{T}(A::SparseArray, ::Type{T}, dims::Dims)` 来实现。（请注意，虽然 `similar` 支持 1 参数和 2 参数形式，但在大多数情况下，你只需要专门定义 3 参数形式。）为此，`SparseArray` 是可变的（支持 `setindex!`）便很重要。为 `SparseArray` 定义 `similar`、`getindex` 和 `setindex!` 也使得该数组能够 [`copy`](@ref) 。

```jldoctest squarevectype
julia> copy(A)
3×3 SparseArray{Float64,2}:
 1.0  4.0  7.0
 2.0  5.0  8.0
 3.0  6.0  9.0
```

除了上面的所有可迭代和可索引方法之外，这些类型还能相互交互，并使用在 Julia Base 中为 `AbstractArray` 定义的大多数方法：

```jldoctest squarevectype
julia> A[SquaresVector(3)]
3-element SparseArray{Float64,1}:
 1.0
 4.0
 9.0

julia> sum(A)
45.0
```

If you are defining an array type that allows non-traditional indexing (indices that start at
something other than 1), you should specialize [`axes`](@ref). You should also specialize [`similar`](@ref)
so that the `dims` argument (ordinarily a `Dims` size-tuple) can accept `AbstractUnitRange` objects,
perhaps range-types `Ind` of your own design. For more information, see
[Arrays with custom indices](@ref man-custom-indices).

## [Strided Arrays](@id man-interface-strided-arrays)

| Methods to implement                            |                                        | Brief description                                                                     |
|:----------------------------------------------- |:-------------------------------------- |:------------------------------------------------------------------------------------- |
| `strides(A)`                             |                                        | Return the distance in memory (in number of elements) between adjacent elements in each dimension as a tuple. If `A` is an `AbstractArray{T,0}`, this should return an empty tuple.    |
| `Base.unsafe_convert(::Type{Ptr{T}}, A)`        |                                        | Return the native address of an array.                                            |
| **Optional methods**                            | **Default definition**                 | **Brief description**                                                                 |
| `stride(A, i::Int)`                             |     `strides(A)[i]`                                   | Return the distance in memory (in number of elements) between adjacent elements in dimension k.    |

A strided array is a subtype of `AbstractArray` whose entries are stored in memory with fixed strides.
Provided the element type of the array is compatible with BLAS, a strided array can utilize BLAS and LAPACK routines
for more efficient linear algebra routines.  A typical example of a user-defined strided array is one
that wraps a standard `Array` with additional structure.

Warning: do not implement these methods if the underlying storage is not actually strided, as it
may lead to incorrect results or segmentation faults.

Here are some examples to demonstrate which type of arrays are strided and which are not:
```julia
1:5   # not strided (there is no storage associated with this array.)
Vector(1:5)  # is strided with strides (1,)
A = [1 5; 2 6; 3 7; 4 8]  # is strided with strides (1,4)
V = view(A, 1:2, :)   # is strided with strides (1,4)
V = view(A, 1:2:3, 1:2)   # is strided with strides (2,4)
V = view(A, [1,2,4], :)   # is not strided, as the spacing between rows is not fixed.
```





## [自定义广播](@id man-interfaces-broadcasting)

| 需要实现的方法 | 简短描述 |
|:-------------------- |:----------------- |
| `Base.BroadcastStyle(::Type{SrcType}) = SrcStyle()` | Broadcasting behavior of `SrcType` |
| `Base.similar(bc::Broadcasted{DestStyle}, ::Type{ElType})` | Allocation of output container |
| **可选方法** | | |
| `Base.BroadcastStyle(::Style1, ::Style2) = Style12()` | Precedence rules for mixing styles |
| `Base.broadcast_axes(x)` | Declaration of the indices of `x` for broadcasting purposes (defaults to [`axes(x)`](@ref)) |
| `Base.broadcastable(x)` | Convert `x` to an object that has `axes` and supports indexing |
| **Bypassing default machinery** | |
| `Base.copy(bc::Broadcasted{DestStyle})` | Custom implementation of `broadcast` |
| `Base.copyto!(dest, bc::Broadcasted{DestStyle})` | Custom implementation of `broadcast!`, specializing on `DestStyle` |
| `Base.copyto!(dest::DestType, bc::Broadcasted{Nothing})` | Custom implementation of `broadcast!`, specializing on `DestType` |
| `Base.Broadcast.broadcasted(f, args...)` | Override the default lazy behavior within a fused expression |
| `Base.Broadcast.instantiate(bc::Broadcasted{DestStyle})` | Override the computation of the lazy broadcast's axes |

[广播](@ref)可由 `broadcast` 或 `broadcast!` 的显式调用、或者像 `A .+ b` 或 `f.(x, y)` 这样的「点」操作隐式触发。任何具有 [`axes`](@ref) 且支持索引的对象都可作为参数参与广播，默认情况下，广播结果储存在 `Array` 中。这个基本框架可通过三个主要方式扩展：

* 确保所有参数都支持广播
* 为给定参数集选择合适的输出数组
* 为给定参数集选择高效的实现

不是所有类型都支持 `axes` 和索引，但许多类型便于支持广播。[`Base.broadcastable`](@ref) 函数会在每个广播参数上调用，它能返回与广播参数不同的支持 `axes` 和索引的对象。默认情况下，对于所有 `AbstractArray` 和 `Number` 来说这是 identity 函数——因为它们已经支持 `axes` 和索引了。少数其它类型（包括但不限于类型本身、函数、像 [`missing`](@ref) 和 [`nothing`](@ref) 这样的特殊单态类型以及日期）为了能被广播，`Base.broadcastable` 会返回封装在 `Ref` 的参数来充当 0 维「标量」。自定义类型可以类似地指定 `Base.broadcastable` 来定义其形状，但是它们应当遵循 `collect(Base.broadcastable(x)) == collect(x)` 的约定。一个值得注意的例外是 `AbstractString`；字符串是个特例，为了能被广播其表现为标量，尽管它们是其字符的可迭代集合（详见 [字符串](@ref)）。

接下来的两个步骤（选择输出数组和实现）依赖于如何确定给定参数集的 single answer。广播必须接受其参数的所有不同类型，并把它们折叠到一个输出数组和实现。广播称此 single answer 为「风格」。每个可广播对象都有自己的首选风格，并使用类似于类型提升的系统将这些风格组合成 single answer——「目标风格」。

### 广播风格

抽象类型 `Base.BroadcastStyle` 派生了所有的广播风格。其在用作函数时有两种可能的形式，分别为一元形式（单参数）和二元形式。使用一元形式表明你打算实现特定的广播行为和/或输出类型，并且不希望依赖于默认的回退 [`Broadcast.DefaultArrayStyle`](@ref)。

为了覆盖这些默认值，你可以为对象自定义 `BroadcastStyle`：

```julia
struct MyStyle <: Broadcast.BroadcastStyle end
Base.BroadcastStyle(::Type{<:MyType}) = MyStyle()
```

在某些情况下，无需定义 `MyStyle` 也许很方便，在这些情况下，你可以利用一个通用的广播封装器：

  - `Base.BroadcastStyle(::Type{<:MyType}) = Broadcast.Style{MyType}()` 可用于任意类型。
     
  - 如果 `MyType` 是 `AbstractArray`，首选是 `Base.BroadcastStyle(::Type{<:MyType}) = Broadcast.ArrayStyle{MyType}()`。
     
  - 对于只支持某个具体维度的 `AbstractArrays`，请创建 `Broadcast.AbstractArrayStyle{N}` 的子类型（请参阅下文）。

当你的广播操作涉及多个参数，各个广播风格将合并以确定单个控制输出容器的类型的 `DestStyle`。有关更多详细信息，请参阅[下文](@ref writing-binary-broadcasting-rules)。

### 选择合适的输出数组

每个广播操作都会计算广播风格以便支持派发和专门化。结果数组的实际分配由 `similar` 处理，其使用 Broadcasted 对象作为其第一个参数。

```julia
Base.similar(bc::Broadcasted{DestStyle}, ::Type{ElType})
```

回退定义是

```julia
similar(bc::Broadcasted{DefaultArrayStyle{N}}, ::Type{ElType}) where {N,ElType} =
    similar(Array{ElType}, axes(bc))
```

However, if needed you can specialize on any or all of these arguments. The final argument
`bc` is a lazy representation of a (potentially fused) broadcast operation, a `Broadcasted`
object.  For these purposes, the most important fields of the wrapper are
`f` and `args`, describing the function and argument list, respectively.  Note that the argument
list can — and often does — include other nested `Broadcasted` wrappers.

举个完整的例子，假设你创建了类型 `ArrayAndChar`，该类型存储一个数组和单个字符：

```jldoctest ArrayAndChar; output = false
struct ArrayAndChar{T,N} <: AbstractArray{T,N}
    data::Array{T,N}
    char::Char
end
Base.size(A::ArrayAndChar) = size(A.data)
Base.getindex(A::ArrayAndChar{T,N}, inds::Vararg{Int,N}) where {T,N} = A.data[inds...]
Base.setindex!(A::ArrayAndChar{T,N}, val, inds::Vararg{Int,N}) where {T,N} = A.data[inds...] = val
Base.showarg(io::IO, A::ArrayAndChar, toplevel) = print(io, typeof(A), " with char '", A.char, "'")
# output

```

你可能想要保留「元数据」`char`。为此，我们首先定义

```jldoctest ArrayAndChar; output = false
Base.BroadcastStyle(::Type{<:ArrayAndChar}) = Broadcast.ArrayStyle{ArrayAndChar}()
# output

```

这意味着我们还必须定义相应的 `similar` 方法：
```jldoctest ArrayAndChar; output = false
function Base.similar(bc::Broadcast.Broadcasted{Broadcast.ArrayStyle{ArrayAndChar}}, ::Type{ElType}) where ElType
    # Scan the inputs for the ArrayAndChar:
    A = find_aac(bc)
    # Use the char field of A to create the output
    ArrayAndChar(similar(Array{ElType}, axes(bc)), A.char)
end

"`A = find_aac(As)` returns the first ArrayAndChar among the arguments."
find_aac(bc::Base.Broadcast.Broadcasted) = find_aac(bc.args)
find_aac(args::Tuple) = find_aac(find_aac(args[1]), Base.tail(args))
find_aac(x) = x
find_aac(a::ArrayAndChar, rest) = a
find_aac(::Any, rest) = find_aac(rest)
# output
find_aac (generic function with 5 methods)
```

在这些定义中，可以得到以下行为：
```jldoctest ArrayAndChar
julia> a = ArrayAndChar([1 2; 3 4], 'x')
2×2 ArrayAndChar{Int64,2} with char 'x':
 1  2
 3  4

julia> a .+ 1
2×2 ArrayAndChar{Int64,2} with char 'x':
 2  3
 4  5

julia> a .+ [5,10]
2×2 ArrayAndChar{Int64,2} with char 'x':
  6   7
 13  14
```

### [Extending broadcast with custom implementations](@id extending-in-place-broadcast)

In general, a broadcast operation is represented by a lazy `Broadcasted` container that holds onto
the function to be applied alongside its arguments. Those arguments may themselves be more nested
`Broadcasted` containers, forming a large expression tree to be evaluated. A nested tree of
`Broadcasted` containers is directly constructed by the implicit dot syntax; `5 .+ 2.*x` is
transiently represented by `Broadcasted(+, 5, Broadcasted(*, 2, x))`, for example. This is
invisible to users as it is immediately realized through a call to `copy`, but it is this container
that provides the basis for broadcast's extensibility for authors of custom types. The built-in
broadcast machinery will then determine the result type and size based upon the arguments, allocate
it, and then finally copy the realization of the `Broadcasted` object into it with a default
`copyto!(::AbstractArray, ::Broadcasted)` method. The built-in fallback `broadcast` and
`broadcast!` methods similarly construct a transient `Broadcasted` representation of the operation
so they can follow the same codepath. This allows custom array implementations to
provide their own `copyto!` specialization to customize and
optimize broadcasting. This is again determined by the computed broadcast style. This is such
an important part of the operation that it is stored as the first type parameter of the
`Broadcasted` type, allowing for dispatch and specialization.

For some types, the machinery to "fuse" operations across nested levels of broadcasting
is not available or could be done more efficiently incrementally. In such cases, you may
need or want to evaluate `x .* (x .+ 1)` as if it had been
written `broadcast(*, x, broadcast(+, x, 1))`, where the inner operation is evaluated before
tackling the outer operation. This sort of eager operation is directly supported by a bit
of indirection; instead of directly constructing `Broadcasted` objects, Julia lowers the
fused expression `x .* (x .+ 1)` to `Broadcast.broadcasted(*, x, Broadcast.broadcasted(+, x, 1))`. Now,
by default, `broadcasted` just calls the `Broadcasted` constructor to create the lazy representation
of the fused expression tree, but you can choose to override it for a particular combination
of function and arguments.

As an example, the builtin `AbstractRange` objects use this machinery to optimize pieces
of broadcasted expressions that can be eagerly evaluated purely in terms of the start,
step, and length (or stop) instead of computing every single element. Just like all the
other machinery, `broadcasted` also computes and exposes the combined broadcast style of its
arguments, so instead of specializing on `broadcasted(f, args...)`, you can specialize on
`broadcasted(::DestStyle, f, args...)` for any combination of style, function, and arguments.

For example, the following definition supports the negation of ranges:

```julia
broadcasted(::DefaultArrayStyle{1}, ::typeof(-), r::OrdinalRange) = range(-first(r), step=-step(r), length=length(r))
```

### [Extending in-place broadcasting](@id extending-in-place-broadcast)

In-place broadcasting can be supported by defining the appropriate `copyto!(dest, bc::Broadcasted)`
method. Because you might want to specialize either on `dest` or the specific subtype of `bc`,
to avoid ambiguities between packages we recommend the following convention.

If you wish to specialize on a particular style `DestStyle`, define a method for
```julia
copyto!(dest, bc::Broadcasted{DestStyle})
```
Optionally, with this form you can also specialize on the type of `dest`.

If instead you want to specialize on the destination type `DestType` without specializing
on `DestStyle`, then you should define a method with the following signature:

```julia
copyto!(dest::DestType, bc::Broadcasted{Nothing})
```

This leverages a fallback implementation of `copyto!` that converts the wrapper into a
`Broadcasted{Nothing}`. Consequently, specializing on `DestType` has lower precedence than
methods that specialize on `DestStyle`.

Similarly, you can completely override out-of-place broadcasting with a `copy(::Broadcasted)`
method.

#### Working with `Broadcasted` objects

In order to implement such a `copy` or `copyto!`, method, of course, you must
work with the `Broadcasted` wrapper to compute each element. There are two main
ways of doing so:

* `Broadcast.flatten` recomputes the potentially nested operation into a single
  function and flat list of arguments. You are responsible for implementing the
  broadcasting shape rules yourself, but this may be helpful in limited situations.
* Iterating over the `CartesianIndices` of the `axes(::Broadcasted)` and using
  indexing with the resulting `CartesianIndex` object to compute the result.

### [Writing binary broadcasting rules](@id writing-binary-broadcasting-rules)

The precedence rules are defined by binary `BroadcastStyle` calls:

```julia
Base.BroadcastStyle(::Style1, ::Style2) = Style12()
```

where `Style12` is the `BroadcastStyle` you want to choose for outputs involving
arguments of `Style1` and `Style2`. For example,

```julia
Base.BroadcastStyle(::Broadcast.Style{Tuple}, ::Broadcast.AbstractArrayStyle{0}) = Broadcast.Style{Tuple}()
```

indicates that `Tuple` "wins" over zero-dimensional arrays (the output container will be a tuple).
It is worth noting that you do not need to (and should not) define both argument orders
of this call; defining one is sufficient no matter what order the user supplies the arguments in.

For `AbstractArray` types, defining a `BroadcastStyle` supersedes the fallback choice,
[`Broadcast.DefaultArrayStyle`](@ref). `DefaultArrayStyle` and the abstract supertype, `AbstractArrayStyle`, store the dimensionality as a type parameter to support specialized
array types that have fixed dimensionality requirements.

`DefaultArrayStyle` "loses" to any other
`AbstractArrayStyle` that has been defined because of the following methods:

```julia
BroadcastStyle(a::AbstractArrayStyle{Any}, ::DefaultArrayStyle) = a
BroadcastStyle(a::AbstractArrayStyle{N}, ::DefaultArrayStyle{N}) where N = a
BroadcastStyle(a::AbstractArrayStyle{M}, ::DefaultArrayStyle{N}) where {M,N} =
    typeof(a)(_max(Val(M),Val(N)))
```

You do not need to write binary `BroadcastStyle`
rules unless you want to establish precedence for
two or more non-`DefaultArrayStyle` types.

If your array type does have fixed dimensionality requirements, then you should
subtype `AbstractArrayStyle`. For example, the sparse array code has the following definitions:

```julia
struct SparseVecStyle <: Broadcast.AbstractArrayStyle{1} end
struct SparseMatStyle <: Broadcast.AbstractArrayStyle{2} end
Base.BroadcastStyle(::Type{<:SparseVector}) = SparseVecStyle()
Base.BroadcastStyle(::Type{<:SparseMatrixCSC}) = SparseMatStyle()
```

Whenever you subtype `AbstractArrayStyle`, you also need to define rules for combining
dimensionalities, by creating a constructor for your style that takes a `Val(N)` argument.
For example:

```julia
SparseVecStyle(::Val{0}) = SparseVecStyle()
SparseVecStyle(::Val{1}) = SparseVecStyle()
SparseVecStyle(::Val{2}) = SparseMatStyle()
SparseVecStyle(::Val{N}) where N = Broadcast.DefaultArrayStyle{N}()
```

These rules indicate that the combination of a `SparseVecStyle` with 0- or 1-dimensional arrays
yields another `SparseVecStyle`, that its combination with a 2-dimensional array
yields a `SparseMatStyle`, and anything of higher dimensionality falls back to the dense arbitrary-dimensional framework.
These rules allow broadcasting to keep the sparse representation for operations that result
in one or two dimensional outputs, but produce an `Array` for any other dimensionality.
