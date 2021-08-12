# 接口

Julia 的很多能力和扩展性都来自于一些非正式的接口。通过为自定义的类型扩展一些特定的方法，自定义类型的对象不但获得那些方法的功能，而且也能够用于其它的基于那些行为而定义的通用方法中。

## [迭代](@id man-interface-iteration)

| 必需方法               |                        | 简短描述                                                                     |
|:------------------------------ |:---------------------- |:------------------------------------------------------------------------------------- |
| `iterate(iter)`                |                        | 通常返回由第一项及其初始状态组成的元组，但如果为空，则返回 [`nothing`](@ref)         |
| `iterate(iter, state)`         |                        | 通常返回由下一项及其状态组成的元组，或者在没有下一项存在时返回 `nothing`。  |
| **重要可选方法** | **默认定义** | **简短描述**                                                                 |
| `IteratorSize(IterType)`       | `HasLength()`          | `HasLength()`，`HasShape{N}()`，`IsInfinite()` 或者 `SizeUnknown()` 中合适的一个 |
| `IteratorEltype(IterType)`     | `HasEltype()`          | `EltypeUnknown()` 或 `HasEltype()` 中合适的一个                              |
| `eltype(IterType)`             | `Any`                  | 由 `iterate()` 返回元组中第一项的类型。                      |
| `length(iter)`                 | (*未定义*)          | 项数，如果已知                                                         |
| `size(iter, [dim])`            | (*未定义*)          | 在各个维度上项数，如果已知                                       |

| 由 `IteratorSize(IterType)` 返回的值 | 必需方法                           |
|:------------------------------------------ |:------------------------------------------ |
| `HasLength()`                              | [`length(iter)`](@ref)                     |
| `HasShape{N}()`                            | `length(iter)` 和 `size(iter, [dim])`    |
| `IsInfinite()`                             | (*无*)                                   |
| `SizeUnknown()`                            | (*无*)                                   |

| 由 `IteratorEltype(IterType)` 返回的值 | 必需方法   |
|:-------------------------------------------- |:------------------ |
| `HasEltype()`                                | `eltype(IterType)` |
| `EltypeUnknown()`                            | (*none*)           |

顺序迭代由 [`iterate`](@ref) 函数实现。
Julia 的迭代器可以从对象外部跟踪迭代状态，而不是在迭代过程中改变对象本身。
迭代过程中的返回一个包含了当前迭代值及其状态的元组，或者在没有元素存在的情况下返回 `nothing`。
状态对象将在下一次迭代时传递回 iterate 函数，并且通常被认为是可迭代对象的私有实现细节。

任何定义了这个函数的对象都是可迭代的，并且可以被应用到[许多依赖迭代的函数上](@ref lib-collections-iteration) 。
也可以直接被应用到  [`for`](@ref) 循环中，因为根据语法：

```julia
for item in iter   # or  "for item = iter"
    # body
end
```

以上代码被解释为：

```julia
next = iterate(iter)
while next !== nothing
    (item, state) = next
    # body
    next = iterate(iter, state)
end
```

举一个简单的例子：一组定长数据的平方数迭代序列：

```jldoctest squaretype
julia> struct Squares
           count::Int
       end

julia> Base.iterate(S::Squares, state=1) = state > S.count ? nothing : (state*state, state+1)
```

With only [`iterate`](@ref) definition, the `Squares` type is already pretty powerful.
We can iterate over all the elements:

```jldoctest squaretype
julia> for item in Squares(7)
           println(item)
       end
1
4
9
16
25
36
49
```

我们可以利用许多内置方法来处理迭代，比如标准库 `Statistics`  中的 [`in`](@ref)，[`mean`](@ref) 和 [`std`](@ref) 。

```jldoctest squaretype
julia> 25 in Squares(10)
true

julia> using Statistics

julia> mean(Squares(100))
3383.5

julia> std(Squares(100))
3024.355854282583
```

我们可以扩展一些其它的方法，为 Julia 提供有关此可迭代集合的更多信息。我们知道 `Squares` 序列中的元素总是 `Int` 型的。通过扩展 [`eltype`](@ref) 方法，我们可以给 Julia 更多信息来帮助其在更复杂的方法中生成更具体的代码。我们同时也知道该序列中的元素数目，故同样地也可以扩展 [`length`](@ref)：

```jldoctest squaretype
julia> Base.eltype(::Type{Squares}) = Int # Note that this is defined for the type

julia> Base.length(S::Squares) = S.count
```

Now, when we ask Julia to [`collect`](@ref) all the elements into an array it can preallocate a `Vector{Int}`
of the right size instead of naively [`push!`](@ref)ing each element into a `Vector{Any}`:

```jldoctest squaretype
julia> collect(Squares(4))
4-element Vector{Int64}:
  1
  4
  9
 16
```

尽管大多时候我们都可以依赖一些通用的实现，但某些时候，如果我们知道一个更简单的算法，可以用其扩展具体方法。例如，计算平方和有公式，因此可以扩展出一个更高效的解法来替代通用方法：

```jldoctest squaretype
julia> Base.sum(S::Squares) = (n = S.count; return n*(n+1)*(2n+1)÷6)

julia> sum(Squares(1803))
1955361914
```

这种模式在 Julia Base 中很常见，一些必须实现的方法构成了一个小的集合，从而定义出一个非正式的接口，用于实现一些更加炫酷的操作。某些应用场景中，一些类型有更高效的算法，故可以扩展出额外的专用方法。

能以*逆序*迭代集合也很有用，这可由 [`Iterators.reverse(iterator)`](@ref) 迭代实现。但是，为了实际支持逆序迭代，迭代器类型 `T` 需要为 `Iterators.Reverse{T}` 实现 `iterate`。（给定 `r::Iterators.Reverse{T}`，类型 `T` 的底层迭代器是 `r.itr`。）在我们的 `Squares` 示例中，我们可以实现 `Iterators.Reverse{Squares}` 方法：

```jldoctest squaretype
julia> Base.iterate(rS::Iterators.Reverse{Squares}, state=rS.itr.count) = state < 1 ? nothing : (state*state, state-1)

julia> collect(Iterators.reverse(Squares(4)))
4-element Vector{Int64}:
 16
  9
  4
  1
```

## Indexing

| Methods to implement | Brief description                |
|:-------------------- |:-------------------------------- |
| `getindex(X, i)`     | `X[i]`, indexed element access   |
| `setindex!(X, v, i)` | `X[i] = v`, indexed assignment   |
| `firstindex(X)`         | The first index, used in `X[begin]` |
| `lastindex(X)`           | The last index, used in `X[end]` |

For the `Squares` iterable above, we can easily compute the `i`th element of the sequence by squaring
it.  We can expose this as an indexing expression `S[i]`. To opt into this behavior, `Squares`
simply needs to define [`getindex`](@ref):

```jldoctest squaretype
julia> function Base.getindex(S::Squares, i::Int)
           1 <= i <= S.count || throw(BoundsError(S, i))
           return i*i
       end

julia> Squares(100)[23]
529
```

另外，为了支持语法 `S[begin]` 和 `S[end]`，我们必须定义 [`lastindex`](@ref) 来指定最后一个有效索引。建议也定义 [`firstindex`](@ref) 来指定第一个有效索引：

```jldoctest squaretype
julia> Base.firstindex(S::Squares) = 1

julia> Base.lastindex(S::Squares) = length(S)

julia> Squares(23)[end]
529
```

For multi-dimensional `begin`/`end` indexing as in `a[3, begin, 7]`, for example,
you should define `firstindex(a, dim)` and `lastindex(a, dim)`
(which default to calling `first` and `last` on `axes(a, dim)`, respectively).

Note, though, that the above *only* defines [`getindex`](@ref) with one integer index. Indexing with
anything other than an `Int` will throw a [`MethodError`](@ref) saying that there was no matching method.
In order to support indexing with ranges or vectors of `Int`s, separate methods must be written:

```jldoctest squaretype
julia> Base.getindex(S::Squares, i::Number) = S[convert(Int, i)]

julia> Base.getindex(S::Squares, I) = [S[i] for i in I]

julia> Squares(10)[[3,4.,5]]
3-element Vector{Int64}:
  9
 16
 25
```

虽然这开始支持更多[某些内置类型支持的索引操作](@ref man-array-indexing)，但仍然有很多行为不支持。因为我们为 `Squares` 序列所添加的行为，它开始看起来越来越像向量。我们可以正式定义其为 [`AbstractArray`](@ref) 的子类型，而不是自己定义所有这些行为。

## [抽象数组](@id man-interface-array)

| 需要实现的方法                            |                                        | 简短描述                                                                     |
|:----------------------------------------------- |:-------------------------------------- |:------------------------------------------------------------------------------------- |
| `size(A)`                                       |                                        | 返回包含 `A` 各维度大小的元组                                      |
| `getindex(A, i::Int)`                           |                                        | （若为 `IndexLinear`）线性标量索引                                             |
| `getindex(A, I::Vararg{Int, N})`                |                                        | （若为 `IndexCartesian`，其中 `N = ndims(A)`）N 维标量索引             |
| `setindex!(A, v, i::Int)`                       |                                        | （若为 `IndexLinear`）线性索引元素赋值                                          |
| `setindex!(A, v, I::Vararg{Int, N})`            |                                        | （若为 `IndexCartesian`，其中 `N = ndims(A)`）N 维标量索引元素赋值   |
| **可选方法**                            | **默认定义**                 | **简短描述**                                                                 |
| `IndexStyle(::Type)`                            | `IndexCartesian()`                     | 返回 `IndexLinear()` 或 `IndexCartesian()`。请参阅下文描述。      |
| `getindex(A, I...)`                             | 基于标量 `getindex` 定义  | [Multidimensional and nonscalar indexing](@ref man-array-indexing)                    |
| `setindex!(A, X, I...)`                            | 基于标量 `setindex!` 定义 | [Multidimensional and nonscalar indexed assignment](@ref man-array-indexing)          |
| `iterate`                                       | 基于标量 `getindex` 定义  | Iteration                                                                             |
| `length(A)`                                     | `prod(size(A))`                        | 元素数                                                                    |
| `similar(A)`                                    | `similar(A, eltype(A), size(A))`       | 返回具有相同形状和元素类型的可变数组                           |
| `similar(A, ::Type{S})`                         | `similar(A, S, size(A))`               | 返回具有相同形状和指定元素类型的可变数组             |
| `similar(A, dims::Dims)`                        | `similar(A, eltype(A), dims)`          | 返回具有相同元素类型和大小为 *dims* 的可变数组                     |
| `similar(A, ::Type{S}, dims::Dims)`             | `Array{S}(undef, dims)`                | 返回具有指定元素类型及大小的可变数组                       |
| **不遵循惯例的索引**                     | **默认定义**                 | **简短描述**                                                                 |
| `axes(A)`                                    | `map(OneTo, size(A))`                  | Return the a tuple of `AbstractUnitRange{<:Integer}` of valid indices                    |
| `similar(A, ::Type{S}, inds)`              | `similar(A, S, Base.to_shape(inds))`   | 返回使用特殊索引 `inds` 的可变数组（详见下文）                  |
| `similar(T::Union{Type,Function}, inds)`   | `T(Base.to_shape(inds))`               | 返回类似于 `T` 的使用特殊索引 `inds` 的数组（详见下文）          |

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

Note that it's very important to specify the two parameters of the `AbstractArray`; the first
defines the [`eltype`](@ref), and the second defines the [`ndims`](@ref). That supertype and those three
methods are all it takes for `SquaresVector` to be an iterable, indexable, and completely functional
array:

```jldoctest squarevectype
julia> s = SquaresVector(4)
4-element SquaresVector:
  1
  4
  9
 16

julia> s[s .> 8]
2-element Vector{Int64}:
  9
 16

julia> s + s
4-element Vector{Int64}:
  2
  8
 18
 32

julia> sin.(s)
4-element Vector{Float64}:
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

Notice that this is an `IndexCartesian` array, so we must manually define [`getindex`](@ref) and [`setindex!`](@ref)
at the dimensionality of the array. Unlike the `SquaresVector`, we are able to define [`setindex!`](@ref),
and so we can mutate the array:

```jldoctest squarevectype
julia> A = SparseArray(Float64, 3, 3)
3×3 SparseArray{Float64, 2}:
 0.0  0.0  0.0
 0.0  0.0  0.0
 0.0  0.0  0.0

julia> fill!(A, 2)
3×3 SparseArray{Float64, 2}:
 2.0  2.0  2.0
 2.0  2.0  2.0
 2.0  2.0  2.0

julia> A[:] = 1:length(A); A
3×3 SparseArray{Float64, 2}:
 1.0  4.0  7.0
 2.0  5.0  8.0
 3.0  6.0  9.0
```

索引 `AbstractArray` 的结果本身可以是数组（例如，在使用 `AbstractRange` 时）。`AbstractArray` 回退方法使用 [`similar`](@ref) 来分配具有适当大小和元素类型的 `Array`，该数组使用上述的基本索引方法填充。但是，在实现数组封装器时，你通常希望也封装结果：

```jldoctest squarevectype
julia> A[1:2,:]
2×3 SparseArray{Float64, 2}:
 1.0  4.0  7.0
 2.0  5.0  8.0
```

In this example it is accomplished by defining `Base.similar(A::SparseArray, ::Type{T}, dims::Dims) where T`
to create the appropriate wrapped array. (Note that while `similar` supports 1- and 2-argument
forms, in most case you only need to specialize the 3-argument form.) For this to work it's important
that `SparseArray` is mutable (supports `setindex!`). Defining `similar`, `getindex` and
`setindex!` for `SparseArray` also makes it possible to [`copy`](@ref) the array:

```jldoctest squarevectype
julia> copy(A)
3×3 SparseArray{Float64, 2}:
 1.0  4.0  7.0
 2.0  5.0  8.0
 3.0  6.0  9.0
```

除了上面的所有可迭代和可索引方法之外，这些类型还能相互交互，并使用在 Julia Base 中为 `AbstractArray` 定义的大多数方法：

```jldoctest squarevectype
julia> A[SquaresVector(3)]
3-element SparseArray{Float64, 1}:
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

| Methods to implement                            |                                        | Brief description                                                                     |
|:----------------------------------------------- |:-------------------------------------- |:------------------------------------------------------------------------------------- |
| `strides(A)`                                    |                                        | Return the distance in memory (in number of elements) between adjacent elements in each dimension as a tuple. If `A` is an `AbstractArray{T,0}`, this should return an empty tuple.    |
| `Base.unsafe_convert(::Type{Ptr{T}}, A)`        |                                        | Return the native address of an array.                                                             |
| `Base.elsize(::Type{<:A})`                      |                                        | Return the stride between consecutive elements in the array.                                       |
| **Optional methods**                            | **Default definition**                 | **Brief description**                                                                              |
| `stride(A, i::Int)`                             |     `strides(A)[i]`                    | Return the distance in memory (in number of elements) between adjacent elements in dimension k.    |

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
| `Base.BroadcastStyle(::Type{SrcType}) = SrcStyle()` | `SrcType` 的广播行为 |
| `Base.similar(bc::Broadcasted{DestStyle}, ::Type{ElType})` | 输出容器的分配 |
| **可选方法** | | |
| `Base.BroadcastStyle(::Style1, ::Style2) = Style12()` | 混合广播风格的优先级规则 |
| `Base.axes(x)` | 用于广播的 `x` 的索引的声明（默认为 [`axes(x)`](@ref)） |
| `Base.broadcastable(x)` | 将 `x` 转换为一个具有 `axes` 且支持索引的对象 |
| **绕过默认机制** | |
| `Base.copy(bc::Broadcasted{DestStyle})` | `broadcast` 的自定义实现 |
| `Base.copyto!(dest, bc::Broadcasted{DestStyle})` | 专门针对 `DestStyle` 的自定义 `broadcast!` 实现 |
| `Base.copyto!(dest::DestType, bc::Broadcasted{Nothing})` | 专门针对 `DestStyle` 的自定义 `broadcast!` 实现 |
| `Base.Broadcast.broadcasted(f, args...)` | 覆盖融合表达式中的默认惰性行为 |
| `Base.Broadcast.instantiate(bc::Broadcasted{DestStyle})` | 覆盖惰性广播的 axes 的计算 |

[广播](@ref)可由 `broadcast` 或 `broadcast!` 的显式调用、或者像 `A .+ b` 或 `f.(x, y)` 这样的「点」操作隐式触发。任何具有 [`axes`](@ref) 且支持索引的对象都可作为参数参与广播，默认情况下，广播结果储存在 `Array` 中。这个基本框架可通过三个主要方式扩展：

* 确保所有参数都支持广播
* 为给定参数集选择合适的输出数组
* 为给定参数集选择高效的实现

不是所有类型都支持 `axes` 和索引，但许多类型便于支持广播。[`Base.broadcastable`](@ref) 函数会在每个广播参数上调用，它能返回与广播参数不同的支持 `axes` 和索引的对象。默认情况下，对于所有 `AbstractArray` 和 `Number` 来说这是 identity 函数——因为它们已经支持 `axes` 和索引了。少数其它类型（包括但不限于类型本身、函数、像 [`missing`](@ref) 和 [`nothing`](@ref) 这样的特殊单态类型以及日期）为了能被广播，`Base.broadcastable` 会返回封装在 `Ref` 的参数来充当 0 维「标量」。自定义类型可以类似地指定 `Base.broadcastable` 来定义其形状，但是它们应当遵循 `collect(Base.broadcastable(x)) == collect(x)` 的约定。一个值得注意的例外是 `AbstractString`；字符串是个特例，为了能被广播其表现为标量，尽管它们是其字符的可迭代集合（详见 [字符串](@id man-strings)）。

The next two steps (selecting the output array and implementation) are dependent upon
determining a single answer for a given set of arguments. Broadcast must take all the varied
types of its arguments and collapse them down to just one output array and one
implementation. Broadcast calls this single answer a "style". Every broadcastable object
each has its own preferred style, and a promotion-like system is used to combine these
styles into a single answer — the "destination style".

### 广播风格

抽象类型 `Base.BroadcastStyle` 派生了所有的广播风格。其在用作函数时有两种可能的形式，分别为一元形式（单参数）和二元形式。使用一元形式表明你打算实现特定的广播行为和/或输出类型，并且不希望依赖于默认的回退 [`Broadcast.DefaultArrayStyle`](@ref)。

为了覆盖这些默认值，你可以为对象自定义 `BroadcastStyle`：

```julia
struct MyStyle <: Broadcast.BroadcastStyle end
Base.BroadcastStyle(::Type{<:MyType}) = MyStyle()
```

在某些情况下，无需定义 `MyStyle` 也许很方便，在这些情况下，你可以利用一个通用的广播封装器：

  - `Base.BroadcastStyle(::Type{<:MyType}) = Broadcast.Style{MyType}()` 可用于任意类型。
     
  - 如果 `MyType` 是一个 `AbstractArray`，首选是 `Base.BroadcastStyle(::Type{<:MyType}) = Broadcast.ArrayStyle{MyType}()`。
     
  - 对于只支持某个具体维度的 `AbstractArrays`，请创建 `Broadcast.AbstractArrayStyle{N}` 的子类型（请参阅下文）。

当你的广播操作涉及多个参数，各个广播风格将合并，来确定唯一一个 `DestStyle` 以控制输出容器的类型。有关更多详细信息，请参阅[下文](@ref writing-binary-broadcasting-rules)。

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

但是，如果需要，你可以专门化任何或所有这些参数。最后的参数 `bc` 是（还可能是融合的）广播操作的惰性表示，即 `Broadcasted` 对象。出于这些目的，该封装器中最重要的字段是 `f` 和 `args`，分别描述函数和参数列表。请注意，参数列表可以——并且经常——包含其它嵌套的 `Broadcasted` 封装器。

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

You might want broadcasting to preserve the `char` "metadata". First we define

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
find_aac(::Tuple{}) = nothing
find_aac(a::ArrayAndChar, rest) = a
find_aac(::Any, rest) = find_aac(rest)
# output
find_aac (generic function with 6 methods)
```

From these definitions, one obtains the following behavior:
```jldoctest ArrayAndChar
julia> a = ArrayAndChar([1 2; 3 4], 'x')
2×2 ArrayAndChar{Int64, 2} with char 'x':
 1  2
 3  4

julia> a .+ 1
2×2 ArrayAndChar{Int64, 2} with char 'x':
 2  3
 4  5

julia> a .+ [5,10]
2×2 ArrayAndChar{Int64, 2} with char 'x':
  6   7
 13  14
```

### [使用自定义实现扩展广播](@id extending-in-place-broadcast)

一般来说，广播操作由一个惰性 `Broadcasted` 容器表示，该容器保存要应用的函数及其参数。这些参数可能本身是嵌套得更深的 `Broadcasted` 容器，并一起形成了一个待求值的大型表达式树。嵌套的 `Broadcasted` 容器树可由隐式的点语法直接构造；例如，`5 .+ 2.*x` 由 `Broadcasted(+, 5, Broadcasted(*, 2, x))` 暂时表示。这对于用户是不可见的，因为它是通过调用 `copy` 立即实现的，但是此容器为自定义类型的作者提供了广播可扩展性的基础。然后，内置的广播机制将根据参数确定结果的类型和大小，为它分配内存，并最终通过默认的 `copyto!(::AbstractArray, ::Broadcasted)` 方法将 `Broadcasted` 对象复制到其中。内置的回退 `broadcast` 和 `broadcast!` 方法类似地构造操作的暂时 `Broadcasted` 表示，因此它们共享相同的代码路径。这便允许自定义的数组实现通过提供它们自己的专门化 `copyto!` 来定义和优化广播。这再次由计算后的广播风格确定。此广播风格在广播操作中非常重要，以至于它被存储为 `Broadcasted` 类型的第一个类型参数，且允许派发和专门化。

对于某些类型，跨越层层嵌套的广播的「融合」操作无法实现，或者无法更高效地逐步完成。在这种情况下，你可能需要或者想要求值 `x .* (x .+ 1)`，就好像该式已被编写成 `broadcast(*, x, broadcast(+, x, 1))`，其中内部广播操作会在处理外部广播操作前进行求值。这种直接的操作以有点间接的方式得到直接支持；Julia 不会直接构造 `Broadcasted` 对象，而会将 待融合的表达式 `x .* (x .+ 1)` 降低为 `Broadcast.broadcasted(*, x, Broadcast.broadcasted(+, x, 1))`。现在，默认情况下，`broadcasted` 只会调用 `Broadcasted` 构造函数来创建待融合表达式树的惰性表示，但是你可以选择为函数和参数的特定组合覆盖它。

举个例子，内置的 `AbstractRange` 对象使用此机制优化广播表达式的片段，这些表达式片段可以只根据 start、step 和 length（或 stop）直接进行求值，而无需计算每个元素。与所有其它机制一样，`broadcasted` 也会计算并暴露其参数的组合广播风格，所以你可以为广播风格、函数和参数的任意组合专门化 `broadcasted(::DestStyle, f, args...)`，而不是专门化 `broadcasted(f, args...)`。

例如，以下定义支持 range 的负运算：

```julia
broadcasted(::DefaultArrayStyle{1}, ::typeof(-), r::OrdinalRange) = range(-first(r), step=-step(r), length=length(r))
```

### [扩展 in-place 广播](@id extending-in-place-broadcast)

In-place 广播可通过定义合适的 `copyto!(dest, bc::Broadcasted)` 方法来支持。由于你可能想要专门化 `dest` 或 `bc` 的特定子类型，为了避免包之间的歧义，我们建议采用以下约定。

如果你想要专门化特定的广播风格 `DestStyle`，请为其定义一个方法
```julia
copyto!(dest, bc::Broadcasted{DestStyle})
```
你可选择使用此形式，如果使用，你还可以专门化 `dest` 的类型。

如果你想专门化目标类型 `DestType` 而不专门化 `DestStyle`，那么你应该定义一个带有以下签名的方法：

```julia
copyto!(dest::DestType, bc::Broadcasted{Nothing})
```

这利用了 `copyto!` 的回退实现，它将该封装器转换为一个 `Broadcasted{Nothing}` 对象。因此，专门化 `DestType` 的方法优先级低于专门化 `DestStyle` 的方法。

同样，你可以使用 `copy(::Broadcasted)` 方法完全覆盖 out-of-place 广播。

#### 使用 `Broadcasted` 对象

当然，为了实现这样的 `copy` 或 `copyto!` 方法，你必须使用 `Broadcasted` 封装器来计算每个元素。这主要有两种方式：

* `Broadcast.flatten` 将可能的嵌套操作重新计算为单个函数并平铺参数列表。你自己负责实现广播形状规则，但这在有限的情况下可能会有所帮助。
   
   
* 迭代 `axes(::Broadcasted)` 的 `CartesianIndices` 并使用所生成的 `CartesianIndex` 对象的索引来计算结果。
   

### [编写二元广播规则](@id writing-binary-broadcasting-rules)

广播风格的优先级规则由二元 `BroadcastStyle` 调用定义：

```julia
Base.BroadcastStyle(::Style1, ::Style2) = Style12()
```

其中，`Style12` 是你要为输出所选择的 `BroadcastStyle`，所涉及的参数具有 `Style1` 及 `Style2`。例如，

```julia
Base.BroadcastStyle(::Broadcast.Style{Tuple}, ::Broadcast.AbstractArrayStyle{0}) = Broadcast.Style{Tuple}()
```

表示 `Tuple`「胜过」零维数组（输出容器将是元组）。值得注意的是，你不需要（也不应该）为此调用的两个参数顺序下定义；无论用户提供的以何种顺序提供参数，定义一个就够了。

对于 `AbstractArray` 类型，定义 `BroadcastStyle` 将取代回退选择 [`Broadcast.DefaultArrayStyle`](@ref)。`DefaultArrayStyle` 及其抽象超类型 `AbstractArrayStyle` 将维度存储为类型参数，以支持具有固定维度需求的特定数组类型。

由于以下方法，`DefaultArrayStyle`「输给」任何其它已定义的 `AbstractArrayStyle`：

```julia
BroadcastStyle(a::AbstractArrayStyle{Any}, ::DefaultArrayStyle) = a
BroadcastStyle(a::AbstractArrayStyle{N}, ::DefaultArrayStyle{N}) where N = a
BroadcastStyle(a::AbstractArrayStyle{M}, ::DefaultArrayStyle{N}) where {M,N} =
    typeof(a)(Val(max(M, N)))
```

除非你想要为两个或多个非 `DefaultArrayStyle` 的类型建立优先级，否则不需要编写二元 `BroadcastStyle` 规则。

如果你的数组类型确实有固定的维度需求，那么你应该定义一个 `AbstractArrayStyle` 的子类型。例如，稀疏数组的代码中有以下定义：

```julia
struct SparseVecStyle <: Broadcast.AbstractArrayStyle{1} end
struct SparseMatStyle <: Broadcast.AbstractArrayStyle{2} end
Base.BroadcastStyle(::Type{<:SparseVector}) = SparseVecStyle()
Base.BroadcastStyle(::Type{<:SparseMatrixCSC}) = SparseMatStyle()
```

每当你定义一个 `AbstractArrayStyle` 的子类型，你还需要定义用于组合维度的规则，这通过为你的广播风格创建带有一个 `Val(N)` 参数的构造函数。例如：

```julia
SparseVecStyle(::Val{0}) = SparseVecStyle()
SparseVecStyle(::Val{1}) = SparseVecStyle()
SparseVecStyle(::Val{2}) = SparseMatStyle()
SparseVecStyle(::Val{N}) where N = Broadcast.DefaultArrayStyle{N}()
```

这些规则表明 `SparseVecStyle` 与 0 维或 1 维数组的组合会产生另一个 `SparseVecStyle`，与 2 维数组的组合会产生 `SparseMatStyle`，而与维度更高的数组则回退到任意维密集矩阵的框架中。这些规则允许广播为产生一维或二维输出的操作保持其稀疏表示，但为任何其它维度生成 `Array`。
