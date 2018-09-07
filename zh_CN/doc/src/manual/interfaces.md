# 接口

Julia的很多能力和扩展性都来自于一些非正式的接口。
通过为自定义的类型及其对象扩展一些特定的方法，
可以不但获得它们的功能，
而且使它们能够被用到其它的基于它们的行为而定义的通用方法中。

## [Iteration](@id man-interface-iteration)

| 必须方法               |                        | 简短描述                                                                     |
|:------------------------------ |:---------------------- |:------------------------------------------------------------------------------------- |
| `iterate(iter)`                |                        | 通常返回由第一项及其其初始状态组成的元组，但如果是空，则要么返回[`nothing`](@ref)         |
| `iterate(iter, state)`         |                        | 通常返回由下一项及其状态组成的元组，或者在没有下一项存在时返回[`nothing`](@ref)。  |
| **重要可选方法** | **默认定义** | **简短描述**                                                                 |
| `IteratorSize(IterType)`       | `HasLength()`          |  `HasLength()` ， `HasShape{N}()` ，  `IsInfinite()` ， 或者 `SizeUnknown()` 作为合适的 |
| `IteratorEltype(IterType)`     | `HasEltype()`          | `EltypeUnknown()`  和 `HasEltype()`  都是可接受的                              |
| `eltype(IterType)`             | `Any`                  | 元组中第一个条目的类型由 `iterate()` 返回。                      |
| `length(iter)`                 | (*未定义*)          | The number of items, if known                                                         |
| `size(iter, [dim...])`         | (*未定义*)          | 在各个维度上条目的数量，如果知道                                       |

|  `IteratorSize(IterType)` 返回的值。 | 必须方法                           |
|:------------------------------------------ |:------------------------------------------ |
| `HasLength()`                              | [`length(iter)`](@ref)                     |
| `HasShape{N}()`                            | `length(iter)`  and `size(iter, [dim...])` |
| `IsInfinite()`                             | (*none*)                                   |
| `SizeUnknown()`                            | (*none*)                                   |

| 由 `IteratorEltype(IterType)` 返回的值 | 必须方法   |
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

仅仅定义了  [`iterate`](@ref) 函数的 `Squares` 类型就已经很强大了。
我们现在可以迭代所有的元素了：
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
我们可以扩展一些其它的方法，为Julia提供有关此可迭代集合的更多信息。
我们知道 `Squares`  序列中的元素总是  `Int` 型的。
通过扩展  [`eltype`](@ref)  方法，  我们可以给Julia过多的信息来帮助其在更复杂的方法中产生更加具体的代码。
我们同时也知道我们序列中的元素数目，所以我们也同样可以扩展  [`length`](@ref) ：

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

尽管大多时候我们都可以依赖于一些通用的实现，某些时候如果我们知道有一个更简单的算法的话，可以扩展出更具体的实现。例如，计算平方和有一个公式，因此可以扩展出一个更高效的实现：

```jldoctest squaretype
julia> Base.sum(S::Squares) = (n = S.count; return n*(n+1)*(2n+1)÷6)

julia> sum(Squares(1803))
1955361914
```

这种模式在Julia Base中很常见，一些必须实现的方法构成了一个小的集合，从而定义出一个非正式的接口，用于实现一些非常炫酷的操作。某些时候，类型本身知道在其应用场景中有一些更高效的算法，因而可以扩展出额外方法。

It is also often useful to allow iteration over a collection in *reverse order*
by iterating over [`Iterators.reverse(iterator)`](@ref).  To actually support
reverse-order iteration, however, an iterator
type `T` needs to implement `iterate` for `Iterators.Reverse{T}`.
(Given `r::Iterators.Reverse{T}`, the underling iterator of type `T` is `r.itr`.)
In our `Squares` example, we would implement `Iterators.Reverse{Squares}` methods:

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

| 需要实现的方法 | 简介                |
|:-------------------- |:-------------------------------- |
| `getindex(X, i)`     | `X[i]`, indexed element access   |
| `setindex!(X, v, i)` | `X[i] = v`, indexed assignment   |
| `firstindex(X)`      | The first index                  |
| `lastindex(X)`        | The last index, used in `X[end]` |

对于 `Squares` 类型而言，可以通过对第 `i` 个元素求平方计算出其中的第 `i` 个元素，可以用 `S[i]` 的索引表达式形式暴露该接口。为了支持该行为， `Squares` 只需要简单地定义 [`getindex`](@ref):

```jldoctest squaretype
julia> function Base.getindex(S::Squares, i::Int)
           1 <= i <= S.count || throw(BoundsError(S, i))
           return i*i
       end

julia> Squares(100)[23]
529
```

Additionally, to support the syntax `S[end]`, we must define [`lastindex`](@ref) to specify the last
valid index. It is recommended to also define [`firstindex`](@ref) to specify the first valid index:

```jldoctest squaretype
julia> Base.firstindex(S::Squares) = 1

julia> Base.lastindex(S::Squares) = length(S)

julia> Squares(23)[end]
529
```

Note, though, that the above *only* defines [`getindex`](@ref) with one integer index. Indexing with
anything other than an `Int` will throw a [`MethodError`](@ref) saying that there was no matching method.
In order to support indexing with ranges or vectors of `Int`s, separate methods must be written:

```jldoctest squaretype
julia> Base.getindex(S::Squares, i::Number) = S[convert(Int, i)]

julia> Base.getindex(S::Squares, I) = [S[i] for i in I]

julia> Squares(10)[[3,4.,5]]
3-element Array{Int64,1}:
  9
 16
 25
```

While this is starting to support more of the [indexing operations supported by some of the builtin types](@ref man-array-indexing),
there's still quite a number of behaviors missing. This `Squares` sequence is starting to look
more and more like a vector as we've added behaviors to it. Instead of defining all these behaviors
ourselves, we can officially define it as a subtype of an [`AbstractArray`](@ref).

## [Abstract Arrays](@id man-interface-array)

| Methods to implement                            |                                        | 简短描述                                                                     |
|:----------------------------------------------- |:-------------------------------------- |:------------------------------------------------------------------------------------- |
| `size(A)`                                       |                                        | Returns a tuple containing the dimensions of `A`                                      |
| `getindex(A, i::Int)`                           |                                        | (if `IndexLinear`) Linear scalar indexing                                             |
| `getindex(A, I::Vararg{Int, N})`                |                                        | (if `IndexCartesian`, where `N = ndims(A)`) N-dimensional scalar indexing             |
| `setindex!(A, v, i::Int)`                       |                                        | (if `IndexLinear`) Scalar indexed assignment                                          |
| `setindex!(A, v, I::Vararg{Int, N})`            |                                        | (if `IndexCartesian`, where `N = ndims(A)`) N-dimensional scalar indexed assignment   |
| **Optional methods**                            | **默认定义**                 | **简短描述**                                                                 |
| `IndexStyle(::Type)`                            | `IndexCartesian()`                     | Returns either `IndexLinear()` or `IndexCartesian()`. See the description below.      |
| `getindex(A, I...)`                             | defined in terms of scalar `getindex`  | [Multidimensional and nonscalar indexing](@ref man-array-indexing)                    |
| `setindex!(A, I...)`                            | defined in terms of scalar `setindex!` | [Multidimensional and nonscalar indexed assignment](@ref man-array-indexing)          |
| `iterate`                                       | defined in terms of scalar `getindex`  | Iteration                                                                             |
| `length(A)`                                     | `prod(size(A))`                        | Number of elements                                                                    |
| `similar(A)`                                    | `similar(A, eltype(A), size(A))`       | Return a mutable array with the same shape and element type                           |
| `similar(A, ::Type{S})`                         | `similar(A, S, size(A))`               | Return a mutable array with the same shape and the specified element type             |
| `similar(A, dims::NTuple{Int})`                 | `similar(A, eltype(A), dims)`          | Return a mutable array with the same element type and size *dims*                     |
| `similar(A, ::Type{S}, dims::NTuple{Int})`      | `Array{S}(undef, dims)`               | Return a mutable array with the specified element type and size                       |
| **Non-traditional indices**                     | **默认定义**                 | **简短描述**                                                                 |
| `axes(A)`                                    | `map(OneTo, size(A))`                  | Return the `AbstractUnitRange` of valid indices                                       |
| `Base.similar(A, ::Type{S}, inds::NTuple{Ind})` | `similar(A, S, Base.to_shape(inds))`   | Return a mutable array with the specified indices `inds` (see below)                  |
| `Base.similar(T::Union{Type,Function}, inds)`   | `T(Base.to_shape(inds))`               | Return an array similar to `T` with the specified indices `inds` (see below)          |

If a type is defined as a subtype of `AbstractArray`, it inherits a very large set of rich behaviors
including iteration and multidimensional indexing built on top of single-element access.  See
the [arrays manual page](@ref man-multi-dim-arrays) and the [Julia Base section](@ref lib-arrays) for more supported methods.

A key part in defining an `AbstractArray` subtype is [`IndexStyle`](@ref). Since indexing is
such an important part of an array and often occurs in hot loops, it's important to make both
indexing and indexed assignment as efficient as possible.  Array data structures are typically
defined in one of two ways: either it most efficiently accesses its elements using just one index
(linear indexing) or it intrinsically accesses the elements with indices specified for every dimension.
 These two modalities are identified by Julia as `IndexLinear()` and `IndexCartesian()`.
 Converting a linear index to multiple indexing subscripts is typically very expensive, so this
provides a traits-based mechanism to enable efficient generic code for all array types.

This distinction determines which scalar indexing methods the type must define. `IndexLinear()`
arrays are simple: just define `getindex(A::ArrayType, i::Int)`.  When the array is subsequently
indexed with a multidimensional set of indices, the fallback `getindex(A::AbstractArray, I...)()`
efficiently converts the indices into one linear index and then calls the above method. `IndexCartesian()`
arrays, on the other hand, require methods to be defined for each supported dimensionality with
`ndims(A)` `Int` indices. For example, [`SparseMatrixCSC`](@ref) from the `SparseArrays` standard
library module, only supports two dimensions, so it just defines
`getindex(A::SparseMatrixCSC, i::Int, j::Int)`. The same holds for [`setindex!`](@ref).

Returning to the sequence of squares from above, we could instead define it as a subtype of an
`AbstractArray{Int, 1}`:

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

As a more complicated example, let's define our own toy N-dimensional sparse-like array type built
on top of [`Dict`](@ref):

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

The result of indexing an `AbstractArray` can itself be an array (for instance when indexing by
an `AbstractRange`). The `AbstractArray` fallback methods use [`similar`](@ref) to allocate an `Array`
of the appropriate size and element type, which is filled in using the basic indexing method described
above. However, when implementing an array wrapper you often want the result to be wrapped as
well:

```jldoctest squarevectype
julia> A[1:2,:]
2×3 SparseArray{Float64,2}:
 1.0  4.0  7.0
 2.0  5.0  8.0
```

In this example it is accomplished by defining `Base.similar{T}(A::SparseArray, ::Type{T}, dims::Dims)`
to create the appropriate wrapped array. (Note that while `similar` supports 1- and 2-argument
forms, in most case you only need to specialize the 3-argument form.) For this to work it's important
that `SparseArray` is mutable (supports `setindex!`). Defining `similar`, `getindex` and
`setindex!` for `SparseArray` also makes it possible to [`copy`](@ref) the array:

```jldoctest squarevectype
julia> copy(A)
3×3 SparseArray{Float64,2}:
 1.0  4.0  7.0
 2.0  5.0  8.0
 3.0  6.0  9.0
```

In addition to all the iterable and indexable methods from above, these types can also interact
with each other and use most of the methods defined in Julia Base for `AbstractArrays`:

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





## [Customizing broadcasting](@id man-interfaces-broadcasting)

| Methods to implement | 简短描述 |
|:-------------------- |:----------------- |
| `Base.BroadcastStyle(::Type{SrcType}) = SrcStyle()` | Broadcasting behavior of `SrcType` |
| `Base.similar(bc::Broadcasted{DestStyle}, ::Type{ElType})` | Allocation of output container |
| **Optional methods** | | |
| `Base.BroadcastStyle(::Style1, ::Style2) = Style12()` | Precedence rules for mixing styles |
| `Base.broadcast_axes(x)` | Declaration of the indices of `x` for broadcasting purposes (defaults to [`axes(x)`](@ref)) |
| `Base.broadcastable(x)` | Convert `x` to an object that has `axes` and supports indexing |
| **Bypassing default machinery** | |
| `Base.copy(bc::Broadcasted{DestStyle})` | Custom implementation of `broadcast` |
| `Base.copyto!(dest, bc::Broadcasted{DestStyle})` | Custom implementation of `broadcast!`, specializing on `DestStyle` |
| `Base.copyto!(dest::DestType, bc::Broadcasted{Nothing})` | Custom implementation of `broadcast!`, specializing on `DestType` |
| `Base.Broadcast.broadcasted(f, args...)` | Override the default lazy behavior within a fused expression |
| `Base.Broadcast.instantiate(bc::Broadcasted{DestStyle})` | Override the computation of the lazy broadcast's axes |

[Broadcasting](@ref) is triggered by an explicit call to `broadcast` or `broadcast!`, or implicitly by
"dot" operations like `A .+ b` or `f.(x, y)`. Any object that has [`axes`](@ref) and supports
indexing can participate as an argument in broadcasting, and by default the result is stored
in an `Array`. This basic framework is extensible in three major ways:

* Ensuring that all arguments support broadcast
* Selecting an appropriate output array for the given set of arguments
* Selecting an efficient implementation for the given set of arguments

Not all types support `axes` and indexing, but many are convenient to allow in broadcast.
The [`Base.broadcastable`](@ref) function is called on each argument to broadcast, allowing
it to return something different that supports `axes` and indexing. By
default, this is the identity function for all `AbstractArray`s and `Number`s — they already
support `axes` and indexing. For a handful of other types (including but not limited to
types themselves, functions, special singletons like [`missing`](@ref) and [`nothing`](@ref), and dates),
`Base.broadcastable` returns the argument wrapped in a `Ref` to act as a 0-dimensional
"scalar" for the purposes of broadcasting. Custom types can similarly specialize
`Base.broadcastable` to define their shape, but they should follow the convention that
`collect(Base.broadcastable(x)) == collect(x)`. A notable exception is `AbstractString`;
strings are special-cased to behave as scalars for the purposes of broadcast even though
they are iterable collections of their characters (see [Strings](@ref) for more).

The next two steps (selecting the output array and implementation) are dependent upon
determining a single answer for a given set of arguments. Broadcast must take all the varied
types of its arguments and collapse them down to just one output array and one
implementation. Broadcast calls this single answer a "style." Every broadcastable object
each has its own preferred style, and a promotion-like system is used to combine these
styles into a single answer — the "destination style".

### Broadcast Styles

`Base.BroadcastStyle` is the abstract type from which all broadcast styles are derived. When used as a
function it has two possible forms, unary (single-argument) and binary. The unary variant states
that you intend to implement specific broadcasting behavior and/or output type, and do not wish to
rely on the default fallback [`Broadcast.DefaultArrayStyle`](@ref).

To override these defaults, you can define a custom `BroadcastStyle` for your object:

```julia
struct MyStyle <: Broadcast.BroadcastStyle end
Base.BroadcastStyle(::Type{<:MyType}) = MyStyle()
```

In some cases it might be convenient not to have to define `MyStyle`, in which case you can
leverage one of the general broadcast wrappers:

  - `Base.BroadcastStyle(::Type{<:MyType}) = Broadcast.Style{MyType}()` can be
    used for arbitrary types.
  - `Base.BroadcastStyle(::Type{<:MyType}) = Broadcast.ArrayStyle{MyType}()` is preferred
    if `MyType` is an `AbstractArray`.
  - For `AbstractArrays` that only support a certain dimensionality, create a subtype of `Broadcast.AbstractArrayStyle{N}` (see below).

When your broadcast operation involves several arguments, individual argument styles get
combined to determine a single `DestStyle` that controls the type of the output container.
For more details, see [below](@ref writing-binary-broadcasting-rules).

### 选择合适的输出数组

The broadcast style is computed for every broadcasting operation to allow for
dispatch and specialization. The actual allocation of the result array is
handled by `similar`, using the Broadcasted object as its first argument.

```julia
Base.similar(bc::Broadcasted{DestStyle}, ::Type{ElType})
```

The fallback definition is

```julia
similar(bc::Broadcasted{DefaultArrayStyle{N}}, ::Type{ElType}) where {N,ElType} =
    similar(Array{ElType}, axes(bc))
```

However, if needed you can specialize on any or all of these arguments. The final argument
`bc` is a lazy representation of a (potentially fused) broadcast operation, a `Broadcasted`
object.  For these purposes, the most important fields of the wrapper are
`f` and `args`, describing the function and argument list, respectively.  Note that the argument
list can — and often does — include other nested `Broadcasted` wrappers.

For a complete example, let's say you have created a type, `ArrayAndChar`, that stores an
array and a single character:

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

You might want broadcasting to preserve the `char` "metadata." First we define

```jldoctest ArrayAndChar; output = false
Base.BroadcastStyle(::Type{<:ArrayAndChar}) = Broadcast.ArrayStyle{ArrayAndChar}()
# output

```

This means we must also define a corresponding `similar` method:
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

From these definitions, one obtains the following behavior:
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
