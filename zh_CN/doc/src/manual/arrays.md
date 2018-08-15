# [多维数组](@id man-multi-dim-arrays)

与大多数技术计算语言一样，Julia提供了一流的数组实现。 大多数技术计算语言非常重视其数组实现，但需要付出使用其他容器的代价。Julia用同样的方式来处理数组。就像和其他用Julia写的代码一样，Julia的数组库几乎完全是用Julia自身实现的，它的性能源自编译器。这样一来，用户就可以通过继承[`AbstractArray`](@ref)的方式来创建自定义数组类型。 实现自定义数组类型的更多详细信息，请参阅[manual section on the AbstractArray interface](@ref man-interface-array)。

数组是存储在多维网格中对象的集合。在最一般的情况下， 数组中的对象可能是 `Any` 类型。
对于大多数计算上的需求，数组中对象的类型应该更加具体，例如 [`Float64`](@ref) 或 [`Int32`](@ref)。

一般来说，与许多其他技术计算语言不同，Julia 不希望为了性能而以向量化的方式编写程序。Julia 的编译器使用类型推断，并为标量数组索引生成优化的代码，允许以方便和可读的方式编写程序，而不牺牲性能，并且有时使用更少的内存。

在Julia中，所有函数的参数都是 [passed by sharing](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_sharing) (也就是传指针)。一些科学计算语言用传值的方式传递数组，这防止了这个值的被调用者在调用函数中被意外修改，也导致无法避免不必要的数组赋值。简便起见，以一个 `!` 结束的函数名表示它会修改或者销毁它的一个或者多个参数的值（例如，[`sort`](@ref) 和 [`sort!`](@ref)）。被调用者必须显式复制，以保证他们不会修改他们本不应该修改的输入。很多不可变的函数时在实现的时候，对输入的显式副本调用一个在结尾加上 `!` 的同名函数，并返回该副本。

## 基本函数

| 函数               | 描述                                                                      |
|:---------------------- |:-------------------------------------------------------------------------------- |
| [`eltype(A)`](@ref)    | `A`中元素的类型                                        |
| [`length(A)`](@ref)    | `A` 中元素的数量                                                    |
| [`ndims(A)`](@ref)     | `A` 的维数                                                  |
| [`size(A)`](@ref)      | 一个包含`A`的维度的元组                                         |
| [`size(A,n)`](@ref)    | `A`第`n`维的大小                                              |
| [`axes(A)`](@ref)   | 一个包含`A`有效索引的元祖                                      |
| [`axes(A,n)`](@ref) | 一个描述第`n`维有效索引的范围                         |
| [`eachindex(A)`](@ref) | 一个访问`A` 中每一个位置的高效迭代器                          |
| [`stride(A,k)`](@ref)  | 在`k`维上的间隔（stride）（相邻元素间的线性索引距离） |
| [`strides(A)`](@ref)   | 每一维上的间隔的元组                                         |

## 构造和初始化

Julia 提供了许多用于构造和初始化数组的函数。 在下列函数中，使用 `dims ...` 参数调用可以是一个表示维数大小的元组或一系列维数大小作为可变数量的参数传递。 大多数这些函数也接受第一个表示数组的元素类型的输入`T`。 如果类型 `T` 被省略，它将默认为[`Float64`]（@ ref）。

| 函数                           | 描述                                                                                                                                                                                                                                  |
|:---------------------------------- |:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`Array{T}(undef, dims...)`](@ref)             | 一个没有初始化的密集 [`数组`](@ref)                                                                                                                                                                                                              |
| [`zeros(T, dims...)`](@ref)                    | 一个全零`数组`                                                                                                                                                                                                                      |
| [`ones(T, dims...)`](@ref)                     | 一个元素均为1的`数组`                                                                                                                                                                                                                       |
| [`trues(dims...)`](@ref)                       | 一个每个元素都为 `true` 的 [`BitArray`](@ref)                                                                                                                                                                                                  |
| [`falses(dims...)`](@ref)                      | 一个每个元素都为 `false` 的 `BitArray`                                                                                                                                                                                                         |
| [`reshape(A, dims...)`](@ref)                  | 一个包含跟`A` 相同数据但维数不同的数组                                                                                                                                                                      |
| [`copy(A)`](@ref)                              | 复制 `A`                                                                                                                                                                                                                                     |
| [`deepcopy(A)`](@ref)                          | 复制 `A`，递归地复制其元素                                                                                                                                                                                                   |
| [`similar(A, T, dims...)`](@ref)               | 一个与`A`具有相同类型（这里指的是密集，稀疏等）的未初始化数组，但具有指定的元素类型和维数。 第二个和第三个参数都是可选的，如果省略则默认为元素类型和 `A` 的维数。 |
| [`reinterpret(T, A)`](@ref)                    | 与 `A` 具有相同二进制数据的数组，但元素类型为 `T`                                                                                                                                                                         |
| [`rand(T, dims...)`](@ref)                     | 一个随机`数组`，元素值是``[0,1}``半开区间中的均匀分布且服从一阶独立同分布                                                                                                                                       |
| [`randn(T, dims...)`](@ref)                    | 一个随机`数组`，元素为标准正态分布，服从独立同分布                                                                                                                                                                         |
| [`Matrix{T}(I, m, n)`](@ref)                   | `m`行`n`列的单位矩阵                                                                                                                                                                                                                   |
| [`range(start, stop=stop, length=n)`](@ref)    | 从`start`到`stop`的带有`n`个线性间隔元素的范围                                                                                                                                                                                 |
| [`fill!(A, x)`](@ref)                          | 用值 `x` 填充数组 `A`                                                                                                                                                                                                        |
| [`fill(x, dims...)`](@ref)                     | 一个被值`x`填充的`数组`                                                                                                                                                                                                         |

[^1]: *iid*，独立同分布

语法`[A，B，C，...]`构造其参数的1维数组（向量）。 如果所有参数有一个共同的类型提升类型[promotion type](@ref conversion-and-promotion)，然后他们会被用[`convert`](@ ref)转换为该类型。

要查看各种方法，我们可以将不同维数传递给这些构造函数，请考虑以下示例：
```jldoctest
julia> zeros(Int8, 2, 2)
2×2 Array{Int8,2}:
 0  0
 0  0

julia> zeros(Int8, (2, 2))
2×2 Array{Int8,2}:
 0  0
 0  0

julia> zeros((2, 2))
2×2 Array{Float64,2}:
 0.0  0.0
 0.0  0.0
```
这里的 `(2, 2)` 是一个 [`Tuple`](@ref).

## 拼接

可以使用以下函数构造和拼接数组：

| 函数                    | 描述                                     |
|:--------------------------- |:----------------------------------------------- |
| [`cat(A...; dims=k)`](@ref) | 沿着s的第`k`拼接数组 |
| [`vcat(A...)`](@ref)        | `cat(A...; dims=1)` 的简写               |
| [`hcat(A...)`](@ref)        | `cat(A...; dims=2)` 的简写               |

传递给这些函数的标量值会被当作1个元素的数组。 例如，
```jldoctest
julia> vcat([1, 2], 3)
3-element Array{Int64,1}:
 1
 2
 3

julia> hcat([1 2], 3)
1×3 Array{Int64,2}:
 1  2  3
```

这些拼接函数非常常用，因此它们有特殊的语法：

| 表达式        | 调用             |
|:----------------- |:----------------- |
| `[A; B; C; ...]`  | [`vcat`](@ref)  |
| `[A B C ...]`     | [`hcat`](@ref)  |
| `[A B; C D; ...]` | [`hvcat`](@ref) |

[`hvcat`](@ref) 可以在第1维列数组（用分号分隔）和第2维行数组（用空格分隔）进行连接。
请考虑以下语法示例：
```jldoctest
julia> [[1; 2]; [3, 4]]
4-element Array{Int64,1}:
 1
 2
 3
 4

julia> [[1 2] [3 4]]
1×4 Array{Int64,2}:
 1  2  3  4

julia> [[1 2]; [3 4]]
2×2 Array{Int64,2}:
 1  2
 3  4
```

## 类型数组初始化

可以用 `T[A, B, C, ...]`的方式声明一个元素为某种特定类型的数组。该方法定义一个元素类型为 `T` 的一维数组并且初始化元素为 `A`, `B`, `C`,....。比如，`Any[x, y, z]` 声明一个异构数组，该数组可以包含任意类型元素。

连接语法可以类似地以类型为前缀，来指定结果的元素类型。

```jldoctest
julia> [[1 2] [3 4]]
1×4 Array{Int64,2}:
 1  2  3  4

julia> Int8[[1 2] [3 4]]
1×4 Array{Int8,2}:
 1  2  3  4
```

## 推导式

推导提供了构造数组的通用且强大的方法。 推导语法类似于数学中的集合构造符号：

```
A = [ F(x,y,...) for x=rx, y=ry, ... ]
```

这种形式的含义是`F(x,y,...)`取其给定列表中变量`x`，`y`等的每个值进行计算。 值可以指定为任何可迭代对象，但通常是`1：n`或`2:(n-1)`之类的范围，或者像`[1.2, 3.4, 5.7]`这样的显式数组值。 结果是一个N-d密集数组，其维数是变量范围`rx`，`ry`等的维数串联。每次`FF(x,y,...)`计算返回一个标量。

下面的示例计算当前元素和沿一维网格其左，右相邻元素的加权平均值：

```julia-repl
julia> x = rand(8)
8-element Array{Float64,1}:
 0.843025
 0.869052
 0.365105
 0.699456
 0.977653
 0.994953
 0.41084
 0.809411

julia> [ 0.25*x[i-1] + 0.5*x[i] + 0.25*x[i+1] for i=2:length(x)-1 ]
6-element Array{Float64,1}:
 0.736559
 0.57468
 0.685417
 0.912429
 0.8446
 0.656511
```

生成的数组类型取决于计算元素的类型。 为了明确地控制类型，可以在推导之前添加类型。 例如，我们可以要求结果为单精度类型：

```julia
Float32[ 0.25*x[i-1] + 0.5*x[i] + 0.25*x[i+1] for i=2:length(x)-1 ]
```

## 生成器表达式

也可以在没有方括号的情况下编写推导，从而产生称为生成器的对象。 可以迭代此对象以按需生成值，而不是预先分配数组并存储它们（请参阅[迭代](@ref)）。 例如，以下表达式在不分配内存的情况下对一个序列进行求和：

```jldoctest
julia> sum(1/n^2 for n=1:1000)
1.6439345666815615
```

在参数列表中编写具有多个维度的生成器表达式时，需要使用括号将生成器与后续参数分开：

```julia-repl
julia> map(tuple, 1/(i+j) for i=1:2, j=1:2, [1:4;])
ERROR: syntax: invalid iteration specification
```

`for`之后的所有逗号分隔的表达式都被解释为范围。 添加括号让我们可以向[`map`](@ref)中添加第三个参数：

```jldoctest
julia> map(tuple, (1/(i+j) for i=1:2, j=1:2), [1 3; 2 4])
2×2 Array{Tuple{Float64,Int64},2}:
 (0.5, 1)       (0.333333, 3)
 (0.333333, 2)  (0.25, 4)
```

生成器是通过内部函数实现。 与语言中内部函数的其他情况一样，封闭作用域中的变量可以在内部函数中“捕获”。 例如，`sum(p[i] - q[i] for i=1:n)` 从封闭作用域中捕获三个变量`p`，`q`和`n`。 捕获的变量可能会出现[性能提示](@ref man-performance-tips)中描述的性能问题。


通过编写多个`for`关键字，生成器和推导中的范围可以取决于之前的范围：

```jldoctest
julia> [(i,j) for i=1:3 for j=1:i]
6-element Array{Tuple{Int64,Int64},1}:
 (1, 1)
 (2, 1)
 (2, 2)
 (3, 1)
 (3, 2)
 (3, 3)
```

在这些情况下，结果都是一维的。

可以使用`if`关键字过滤生成的值：

```jldoctest
julia> [(i,j) for i=1:3 for j=1:i if i+j == 4]
2-element Array{Tuple{Int64,Int64},1}:
 (2, 2)
 (3, 1)
```

## [索引](@id man-array-indexing)

n维数组A进行索引的一般语法是：

```
X = A[I_1, I_2, ..., I_n]
```

其中每个`I_k`可以是标量整数，整数数组或任何其他[支持的索引类型](@ref man-supported-index-types)。 这包括[`Colon`](@ref) (`:`)来选择整个维度中的所有索引，形式为`a:c`或`a:b:c`的范围来选择连续或跨步的子区间，以及 布尔数组以选择索引为`true`的元素。

如果所有索引都是标量，则结果`X`是数组`A`中的单个元素。 否则，`X`是一个数组，其维数与所有索引的维数之和相同。

如果所有索引都是向量，则`X`的形状将是 `(length(I_1), length(I_2), ..., length(I_n))`，其中`X`中位置为`(i_1, i_2, ..., i_n)` 的值为`A[I_1[i_1], I_2[i_2], ..., I_n[i_n]]`。

例子：

```jldoctest
julia> A = reshape(collect(1:16), (2, 2, 2, 2))
2×2×2×2 Array{Int64,4}:
[:, :, 1, 1] =
 1  3
 2  4

[:, :, 2, 1] =
 5  7
 6  8

[:, :, 1, 2] =
  9  11
 10  12

[:, :, 2, 2] =
 13  15
 14  16

julia> A[1, 2, 1, 1] # all scalar indices
3

julia> A[[1, 2], [1], [1, 2], [1]] # all vector indices
2×1×2×1 Array{Int64,4}:
[:, :, 1, 1] =
 1
 2

[:, :, 2, 1] =
 5
 6

julia> A[[1, 2], [1], [1, 2], 1] # a mix of index types
2×1×2 Array{Int64,3}:
[:, :, 1] =
 1
 2

[:, :, 2] =
 5
 6
```

请注意最后两种情况下得到的数组的大小是如何不同的。

If `I_1` is changed to a two-dimensional matrix, then `X` becomes an `n+1`-dimensional array of
shape `(size(I_1, 1), size(I_1, 2), length(I_2), ..., length(I_n))`. The matrix adds a dimension.

例如：

```jldoctest
julia> A = reshape(collect(1:16), (2, 2, 2, 2));

julia> A[[1 2; 1 2]]
2×2 Array{Int64,2}:
 1  2
 1  2

julia> A[[1 2; 1 2], 1, 2, 1]
2×2 Array{Int64,2}:
 5  6
 5  6
```

位置`(i_1, i_2, i_3, ..., i_{n+1})`的值是`A[I_1[i_1, i_2], I_2[i_3], ..., I_n[i_{n+1}]]`。
所有使用标量索引的维度都将被删除。 例如，`A [2，I，3]`的结果是一个大小为`size(I)`的数组。 它的第i个元素由`A[2, I[i], 3]`填充。

作为此语法的特殊部分，`end`关键字可用于表示索引括号内每个维度的最后一个索引，由索引的最内层数组的大小决定。 没有`end`关键字的索引语法相当于调用[`getindex`](@ref)：

```
X = getindex(A, I_1, I_2, ..., I_n)
```

例如：

```jldoctest
julia> x = reshape(1:16, 4, 4)
4×4 reshape(::UnitRange{Int64}, 4, 4) with eltype Int64:
 1  5   9  13
 2  6  10  14
 3  7  11  15
 4  8  12  16

julia> x[2:3, 2:end-1]
2×2 Array{Int64,2}:
 6  10
 7  11

julia> x[1, [2 3; 4 1]]
2×2 Array{Int64,2}:
  5  9
 13  1
```

形式为`n:n-1`的空范围有时用于表示`n-1`和`n`之间的索引间位置。 例如，[`searchsorted`](@ref)函数利用这个惯例，来表示不在有序数组中的值的插入位置：

```jldoctest
julia> a = [1,2,5,6,7];

julia> searchsorted(a, 3)
3:2
```

## 赋值

在n维数组A中赋值的一般语法是：

```
A[I_1, I_2, ..., I_n] = X
```

其中每个`I_k`可以是标量整数，整数数组或任何其他[支持的索引类型](@ref man-supported-index-types)。 这包括[`Colon`](@ref) (`:`)来选择整个维度中的所有索引，形式为`a:c`或`a:b:c`的范围来选择连续或跨步的部分元素，以及布尔数组以`true`索引选择元素。

如果`X`是一个数组，它必须具有与索引长度的乘积相同的元素数：`prod(length(I_1), length(I_2), ..., length(I_n))`。 `A`在位置`I_1[i_1], I_2[i_2], ..., I_n[i_n]`中的值被值`X[i_1, i_2, ..., i_n]`覆盖。 如果`X`不是数组，则将其值写入`A`中所有引用的位置。

就像在[索引](@ref man-array-indexing)中一样，`end`关键字可用于表示索引括号中每个维度的最后一个索引，由被赋值的数组大小决定。 没有`end`关键字的索引赋值语法相当于调用[`setindex！`](@ref)：

```
setindex!(A, X, I_1, I_2, ..., I_n)
```

例如：

```jldoctest
julia> x = collect(reshape(1:9, 3, 3))
3×3 Array{Int64,2}:
 1  4  7
 2  5  8
 3  6  9

julia> x[3, 3] = -9;

julia> x[1:2, 1:2] = [-1 -4; -2 -5];

julia> x
3×3 Array{Int64,2}:
 -1  -4   7
 -2  -5   8
  3   6  -9
```

## [支持的索引类型](@id man-supported-index-types)

In the expression `A[I_1, I_2, ..., I_n]`, each `I_k` may be a scalar index, an
array of scalar indices, or an object that represents an array of scalar
indices and can be converted to such by [`to_indices`](@ref):
在表达式`A[I_1, I_2, ..., I_n]`中，每个`I_k`可以是标量索引，标量索引数组，或者用[`to_indices`](@ref)转换成表示标量索引数组的对象：

1. 标量索引。 默认情况下，这包括：
    * 非布尔的整数
    * [[`CartesianIndex {N}`](@ref)s，其行为类似于跨越多个维度的`N`维整数元组（详见下文）](@ref)s, which behave like an `N`-tuple of integers spanning multiple dimensions (see below for more details)
2. 标量索引数组。 这包括：
    * 整数向量和多维整数数组
    * 像`[]`这样的空数组，它不选择任何元素
    * 如`a:c`或`a:b:c`的范围，从`a`到`c`（包括）选择连续或跨步的部分元素
    * 任何自定义标量索引数组，它是`AbstractArray`的子类型
    * `CartesianIndex{N}`数组（详见下文）
3. 一个表示标量索引数组的对象，可以通过[`to_indices`](@ref)转换为这样的对象。 默认情况下，这包括：
    * [`Colon()`](@ref) (`:`)，表示整个维度内或整个数组中的所有索引
    * 布尔数组，选择其中值为`true`的索引对应的元素（更多细节见下文）

一些例子：
```jldoctest
julia> A = reshape(collect(1:2:18), (3, 3))
3×3 Array{Int64,2}:
 1   7  13
 3   9  15
 5  11  17

julia> A[4]
7

julia> A[[2, 5, 8]]
3-element Array{Int64,1}:
  3
  9
 15

julia> A[[1 4; 3 8]]
2×2 Array{Int64,2}:
 1   7
 5  15

julia> A[[]]
0-element Array{Int64,1}

julia> A[1:2:5]
3-element Array{Int64,1}:
 1
 5
 9

julia> A[2, :]
3-element Array{Int64,1}:
  3
  9
 15

julia> A[:, 3]
3-element Array{Int64,1}:
 13
 15
 17
```

### 笛卡尔索引

特殊的`CartesianIndex{N}`对象表示一个标量索引，其行为类似于跨越多个维度的`N`维整数元组。 例如：

```jldoctest cartesianindex
julia> A = reshape(1:32, 4, 4, 2);

julia> A[3, 2, 1]
7

julia> A[CartesianIndex(3, 2, 1)] == A[3, 2, 1] == 7
true
```

Considered alone, this may seem relatively trivial; `CartesianIndex` simply
gathers multiple integers together into one object that represents a single
multidimensional index. When combined with other indexing forms and iterators
that yield `CartesianIndex`es, however, this can lead directly to very elegant
and efficient code. See [Iteration](@ref) below, and for some more advanced
examples, see [this blog post on multidimensional algorithms and
iteration](https://julialang.org/blog/2016/02/iteration).

Arrays of `CartesianIndex{N}` are also supported. They represent a collection
of scalar indices that each span `N` dimensions, enabling a form of indexing
that is sometimes referred to as pointwise indexing. For example, it enables
accessing the diagonal elements from the first "page" of `A` from above:

```jldoctest cartesianindex
julia> page = A[:,:,1]
4×4 Array{Int64,2}:
 1  5   9  13
 2  6  10  14
 3  7  11  15
 4  8  12  16

julia> page[[CartesianIndex(1,1),
             CartesianIndex(2,2),
             CartesianIndex(3,3),
             CartesianIndex(4,4)]]
4-element Array{Int64,1}:
  1
  6
 11
 16
```

This can be expressed much more simply with [dot broadcasting](@ref man-vectorized)
and by combining it with a normal integer index (instead of extracting the
first `page` from `A` as a separate step). It can even be combined with a `:`
to extract both diagonals from the two pages at the same time:

```jldoctest cartesianindex
julia> A[CartesianIndex.(axes(A, 1), axes(A, 2)), 1]
4-element Array{Int64,1}:
  1
  6
 11
 16

julia> A[CartesianIndex.(axes(A, 1), axes(A, 2)), :]
4×2 Array{Int64,2}:
  1  17
  6  22
 11  27
 16  32
```

!!! warning

    `CartesianIndex` and arrays of `CartesianIndex` are not compatible with the
    `end` keyword to represent the last index of a dimension. Do not use `end`
    in indexing expressions that may contain either `CartesianIndex` or arrays thereof.

### Logical indexing

Often referred to as logical indexing or indexing with a logical mask, indexing
by a boolean array selects elements at the indices where its values are `true`.
Indexing by a boolean vector `B` is effectively the same as indexing by the
vector of integers that is returned by [`findall(B)`](@ref). Similarly, indexing
by a `N`-dimensional boolean array is effectively the same as indexing by the
vector of `CartesianIndex{N}`s where its values are `true`. A logical index
must be a vector of the same length as the dimension it indexes into, or it
must be the only index provided and match the size and dimensionality of the
array it indexes into. It is generally more efficient to use boolean arrays as
indices directly instead of first calling [`findall`](@ref).

```jldoctest
julia> x = reshape(1:16, 4, 4)
4×4 reshape(::UnitRange{Int64}, 4, 4) with eltype Int64:
 1  5   9  13
 2  6  10  14
 3  7  11  15
 4  8  12  16

julia> x[[false, true, true, false], :]
2×4 Array{Int64,2}:
 2  6  10  14
 3  7  11  15

julia> mask = map(ispow2, x)
4×4 Array{Bool,2}:
  true  false  false  false
  true  false  false  false
 false  false  false  false
  true   true  false   true

julia> x[mask]
5-element Array{Int64,1}:
  1
  2
  4
  8
 16
```

## 迭代

迭代整个数组的推荐方法是

```julia
for a in A
    # Do something with the element a
end

for i in eachindex(A)
    # Do something with i and/or A[i]
end
```

The first construct is used when you need the value, but not index, of each element. In the second
construct, `i` will be an `Int` if `A` is an array type with fast linear indexing; otherwise,
it will be a `CartesianIndex`:

```jldoctest
julia> A = rand(4,3);

julia> B = view(A, 1:3, 2:3);

julia> for i in eachindex(B)
           @show i
       end
i = CartesianIndex(1, 1)
i = CartesianIndex(2, 1)
i = CartesianIndex(3, 1)
i = CartesianIndex(1, 2)
i = CartesianIndex(2, 2)
i = CartesianIndex(3, 2)
```

In contrast with `for i = 1:length(A)`, iterating with [`eachindex`](@ref) provides an efficient way to
iterate over any array type.

## 数组特点

If you write a custom [`AbstractArray`](@ref) type, you can specify that it has fast linear indexing using

```julia
Base.IndexStyle(::Type{<:MyArray}) = IndexLinear()
```

This setting will cause `eachindex` iteration over a `MyArray` to use integers. If you don't
specify this trait, the default value `IndexCartesian()` is used.

## 数组、矢量化操作符及函数

以下操作符支持数组整体操作

1. 一元运算符 -- `-`, `+`
2. 二元运算符 -- `-`, `+`, `*`, `/`, `\`, `^`
3. 比较操作符-- `==`, `!=`, `≈` ([`isapprox`](@ref)), `≉`

Most of the binary arithmetic operators listed above also operate elementwise
when one argument is scalar: `-`, `+`, and `*` when either argument is scalar,
and `/` and `\` when the denominator is scalar. For example, `[1, 2] + 3 == [4, 5]`
and `[6, 4] / 2 == [3, 2]`.

Additionally, to enable convenient vectorization of mathematical and other operations,
Julia [provides the dot syntax](@ref man-vectorized) `f.(args...)`, e.g. `sin.(x)`
or `min.(x,y)`, for elementwise operations over arrays or mixtures of arrays and
scalars (a [Broadcasting](@ref) operation); these have the additional advantage of
"fusing" into a single loop when combined with other dot calls, e.g. `sin.(cos.(x))`.

Also, *every* binary operator supports a [dot version](@ref man-dot-operators)
that can be applied to arrays (and combinations of arrays and scalars) in such
[fused broadcasting operations](@ref man-vectorized), e.g. `z .== sin.(x .* y)`.

Note that comparisons such as `==` operate on whole arrays, giving a single boolean
answer. Use dot operators like `.==` for elementwise comparisons. (For comparison
operations like `<`, *only* the elementwise `.<` version is applicable to arrays.)

Also notice the difference between `max.(a,b)`, which [`broadcast`](@ref)s [`max`](@ref)
elementwise over `a` and `b`, and [`maximum(a)`](@ref), which finds the largest value within
`a`. The same relationship holds for `min.(a,b)` and `minimum(a)`.

## 广播

对于在不同大小的数组上执行逐元素的二元操作有时很有用，
例如将矩阵的每一列加一个向量。一种效率低下的方法可能会将矢量复制到矩阵的大小：

```julia-repl
julia> a = rand(2,1); A = rand(2,3);

julia> repeat(a,1,3)+A
2×3 Array{Float64,2}:
 1.20813  1.82068  1.25387
 1.56851  1.86401  1.67846
```

当维度较大的时候，这种方法将会十分浪费，所以Julia提供了广播[`broadcast`](@ref)，它将会将参数中低维度的参数扩展，使得其与其他维度匹配，且不会使用额外的内存，并将所给的函数逐元素地应用。

```julia-repl
julia> broadcast(+, a, A)
2×3 Array{Float64,2}:
 1.20813  1.82068  1.25387
 1.56851  1.86401  1.67846

julia> b = rand(1,2)
1×2 Array{Float64,2}:
 0.867535  0.00457906

julia> broadcast(+, a, b)
2×2 Array{Float64,2}:
 1.71056  0.847604
 1.73659  0.873631
```

[Dotted operators](@ref man-dot-operators) such as `.+` and `.*` are equivalent
to `broadcast` calls (except that they fuse, as described below). There is also a
[`broadcast!`](@ref) function to specify an explicit destination (which can also
be accessed in a fusing fashion by `.=` assignment). Moreover, `f.(args...)`
is equivalent to `broadcast(f, args...)`, providing a convenient syntax to broadcast any function
([dot syntax](@ref man-vectorized)). Nested "dot calls" `f.(...)` (including calls to `.+` etcetera)
[automatically fuse](@ref man-dot-operators) into a single `broadcast` call.

另外，[`broadcast`](@ref)并不局限于数组（参见函数文档），对于元组依然有效。对于其他非数组，元组或 引用[`Ref`](@ref)(除了指针 [`Ptr`](@ref))的参数，视作“scalar”

```jldoctest
julia> convert.(Float32, [1, 2])
2-element Array{Float32,1}:
 1.0
 2.0

julia> ceil.((UInt8,), [1.2 3.4; 5.6 6.7])
2×2 Array{UInt8,2}:
 0x02  0x04
 0x06  0x07

julia> string.(1:3, ". ", ["First", "Second", "Third"])
3-element Array{String,1}:
 "1. First"
 "2. Second"
 "3. Third"
```

## 实现

The base array type in Julia is the abstract type [`AbstractArray{T,N}`](@ref). It is parametrized by
the number of dimensions `N` and the element type `T`. [`AbstractVector`](@ref) and [`AbstractMatrix`](@ref) are
aliases for the 1-d and 2-d cases. Operations on `AbstractArray` objects are defined using higher
level operators and functions, in a way that is independent of the underlying storage. These operations
generally work correctly as a fallback for any specific array implementation.

The `AbstractArray` type includes anything vaguely array-like, and implementations of it might
be quite different from conventional arrays. For example, elements might be computed on request
rather than stored. However, any concrete `AbstractArray{T,N}` type should generally implement
at least [`size(A)`](@ref) (returning an `Int` tuple), [`getindex(A,i)`](@ref) and [`getindex(A,i1,...,iN)`](@ref getindex);
mutable arrays should also implement [`setindex!`](@ref). It is recommended that these operations
have nearly constant time complexity, or technically Õ(1) complexity, as otherwise some array
functions may be unexpectedly slow. Concrete types should also typically provide a [`similar(A,T=eltype(A),dims=size(A))`](@ref)
method, which is used to allocate a similar array for [`copy`](@ref) and other out-of-place
operations. No matter how an `AbstractArray{T,N}` is represented internally, `T` is the type of
object returned by *integer* indexing (`A[1, ..., 1]`, when `A` is not empty) and `N` should be
the length of the tuple returned by [`size`](@ref). For more details on defining custom
`AbstractArray` implementations, see the [array interface guide in the interfaces chapter](@ref man-interface-array).

`DenseArray` is an abstract subtype of `AbstractArray` intended to include all arrays where
elements are stored contiguously in column-major order (see additional notes in
[Performance Tips](@ref man-performance-tips)). The [`Array`](@ref) type is a specific instance
of `DenseArray`  [`Vector`](@ref) and [`Matrix`](@ref) are aliases for the 1-d and 2-d cases.
Very few operations are implemented specifically for `Array` beyond those that are required
for all `AbstractArrays`s; much of the array library is implemented in a generic
manner that allows all custom arrays to behave similarly.

`SubArray` is a specialization of `AbstractArray` that performs indexing by
sharing memory with the original array rather than by copying it. A `SubArray`
is created with the [`view`](@ref) function, which is called the same way as
[`getindex`](@ref) (with an array and a series of index arguments). The result
of [`view`](@ref) looks the same as the result of [`getindex`](@ref), except the
data is left in place. [`view`](@ref) stores the input index vectors in a
`SubArray` object, which can later be used to index the original array
indirectly.  By putting the [`@views`](@ref) macro in front of an expression or
block of code, any `array[...]` slice in that expression will be converted to
create a `SubArray` view instead.

[`BitArray`](@ref)s are space-efficient "packed" boolean arrays, which store one bit per boolean value.
They can be used similarly to `Array{Bool}` arrays (which store one byte per boolean value),
and can be converted to/from the latter via `Array(bitarray)` and `BitArray(array)`, respectively.

A "strided" array is stored in memory with elements laid out in regular offsets such that
an instance with a supported `isbits` element type can be passed to
external C and Fortran functions that expect this memory layout. Strided arrays
must define a [`strides(A)`](@ref) method that returns a tuple of "strides" for each dimension; a
provided [`stride(A,k)`](@ref) method accesses the `k`th element within this tuple. Increasing the
index of dimension `k` by `1` should increase the index `i` of [`getindex(A,i)`](@ref) by
[`stride(A,k)`](@ref). If a pointer conversion method [`Base.unsafe_convert(Ptr{T}, A)`](@ref) is
provided, the memory layout must correspond in the same way to these strides. `DenseArray` is a
very specific example of a strided array where the elements are arranged contiguously, thus it
provides its subtypes with the approporiate definition of `strides`. More concrete examples
can be found within the [interface guide for strided arrays](@ref man-interface-strided-arrays).
[`StridedVector`](@ref) and [`StridedMatrix`](@ref) are convenient aliases for many of the builtin array types that
are considered strided arrays, allowing them to dispatch to select specialized implementations that
call highly tuned and optimized BLAS and LAPACK functions using just the pointer and strides.

接下来的例子计算一个大数组中一小部分的QR分解，不需要引入任何临时变量。通过正确的维度大小和偏移参数调用合适的LAPACK函数。

```julia-repl
julia> a = rand(10, 10)
10×10 Array{Float64,2}:
 0.517515  0.0348206  0.749042   0.0979679  …  0.75984     0.950481   0.579513
 0.901092  0.873479   0.134533   0.0697848     0.0586695   0.193254   0.726898
 0.976808  0.0901881  0.208332   0.920358      0.288535    0.705941   0.337137
 0.657127  0.0317896  0.772837   0.534457      0.0966037   0.700694   0.675999
 0.471777  0.144969   0.0718405  0.0827916     0.527233    0.173132   0.694304
 0.160872  0.455168   0.489254   0.827851   …  0.62226     0.0995456  0.946522
 0.291857  0.769492   0.68043    0.629461      0.727558    0.910796   0.834837
 0.775774  0.700731   0.700177   0.0126213     0.00822304  0.327502   0.955181
 0.9715    0.64354    0.848441   0.241474      0.591611    0.792573   0.194357
 0.646596  0.575456   0.0995212  0.038517      0.709233    0.477657   0.0507231

julia> b = view(a, 2:2:8,2:2:4)
4×2 view(::Array{Float64,2}, 2:2:8, 2:2:4) with eltype Float64:
 0.873479   0.0697848
 0.0317896  0.534457
 0.455168   0.827851
 0.700731   0.0126213

julia> (q, r) = qr(b);

julia> q
4×4 LinearAlgebra.QRCompactWYQ{Float64,Array{Float64,2}}:
 -0.722358    0.227524  -0.247784    -0.604181
 -0.0262896  -0.575919  -0.804227     0.144377
 -0.376419   -0.75072    0.540177    -0.0541979
 -0.579497    0.230151  -0.00552346   0.781782

julia> r
2×2 Array{Float64,2}:
 -1.20921  -0.383393
  0.0      -0.910506
```
