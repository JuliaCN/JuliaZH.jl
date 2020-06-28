# [多维数组](@id man-multi-dim-arrays)

与大多数技术计算语言一样，Julia 提供原生的数组实现。 大多数技术计算语言非常重视其数组实现，但需要付出使用其它容器的代价。Julia 用同样的方式来处理数组。就像和其它用 Julia 写的代码一样，Julia 的数组库几乎完全是用 Julia 自身实现的，它的性能源自编译器。这样一来，用户就可以通过继承 [`AbstractArray`](@ref) 的方式来创建自定义数组类型。 实现自定义数组类型的更多详细信息，请参阅[manual section on the AbstractArray interface](@ref man-interface-array)。

数组是存储在多维网格中对象的集合。在最一般的情况下， 数组中的对象可能是 [`Any`](@ref) 类型。
对于大多数计算上的需求，数组中对象的类型应该更加具体，例如 [`Float64`](@ref) 或 [`Int32`](@ref)。

一般来说，与许多其他科学计算语言不同，Julia 不希望为了性能而以向量化的方式编写程序。Julia 的编译器使用类型推断，并为标量数组索引生成优化的代码，从而能够令用户方便地编写可读性良好的程序，而不牺牲性能，并且时常会减少内存使用。

在 Julia 中，所有函数的参数都是 [passed by sharing](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_sharing)。一些科学计算语言用传值的方式传递数组，尽管这样做可以防止数组在被调函数中被意外地篡改，但这也会导致不必要的数组拷贝。通常，以一个 `!` 结尾的函数名表示它会对自己的一个或者多个参数的值进行修改或者销毁（例如，请比较 [`sort`](@ref) 和 [`sort!`](@ref)）。被调函数必须进行显式拷贝，以确保它们不会无意中修改输入参数。很多 “non-mutating” 函数在实现的时候，都会先进行显式拷贝，然后调用一个以 `!` 结尾的同名函数，最后返回之前拷贝的副本。

## 基本函数

| 函数               | 描述                                                                      |
|:---------------------- |:-------------------------------------------------------------------------------- |
| [`eltype(A)`](@ref)    | `A` 中元素的类型                                        |
| [`length(A)`](@ref)    | `A` 中元素的数量                                                    |
| [`ndims(A)`](@ref)     | `A` 的维数                                                  |
| [`size(A)`](@ref)      | 一个包含 `A` 各个维度上元素数量的元组                                         |
| [`size(A,n)`](@ref)    | `A` 第 `n` 维中的元素数量                                              |
| [`axes(A)`](@ref)      | 一个包含 `A` 有效索引的元组                                      |
| [`axes(A,n)`](@ref)    | 第 `n` 维有效索引的范围                         |
| [`eachindex(A)`](@ref) | 一个访问 `A` 中每一个位置的高效迭代器                          |
| [`stride(A,k)`](@ref)  | 在第 `k` 维上的间隔（stride）（相邻元素间的线性索引距离） |
| [`strides(A)`](@ref)   | 包含每一维上的间隔（stride）的元组                                         |

## 构造和初始化

Julia 提供了许多用于构造和初始化数组的函数。在下列函数中，参数 `dims ...` 可以是一个包含维数大小的元组，也可以表示用任意个参数传递的一系列维数大小值。大部分函数的第一个参数都表示数组的元素类型 `T` 。如果类型 `T` 被省略，那么将默认为 [`Float64`](@ref)。

| 函数                           | 描述                                                                                                                                                                                                                                  |
|:---------------------------------- |:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`Array{T}(undef, dims...)`](@ref)             | 一个没有初始化的密集 [`Array`](@ref)                                                                                                                                                                                                              |
| [`zeros(T, dims...)`](@ref)                    | 一个全零 `Array`                                                                                                                                                                                                                      |
| [`ones(T, dims...)`](@ref)                     | 一个元素均为 1 的 `Array`                                                                                                                                                                                                                       |
| [`trues(dims...)`](@ref)                       | 一个每个元素都为 `true` 的 [`BitArray`](@ref)                                                                                                                                                                                                  |
| [`falses(dims...)`](@ref)                      | 一个每个元素都为 `false` 的 `BitArray`                                                                                                                                                                                                         |
| [`reshape(A, dims...)`](@ref)                  | 一个包含跟 `A` 相同数据但维数不同的数组                                                                                                                                                                      |
| [`copy(A)`](@ref)                              | 拷贝 `A`                                                                                                                                                                                                                                     |
| [`deepcopy(A)`](@ref)                          | 深拷贝，即拷贝 `A`，并递归地拷贝其元素                                                                                                                                                                                                   |
| [`similar(A, T, dims...)`](@ref)               | 一个与`A`具有相同类型（这里指的是密集，稀疏等）的未初始化数组，但具有指定的元素类型和维数。第二个和第三个参数都是可选的，如果省略则默认为元素类型和 `A` 的维数。 |
| [`reinterpret(T, A)`](@ref)                    | 与 `A` 具有相同二进制数据的数组，但元素类型为 `T`                                                                                                                                                                         |
| [`rand(T, dims...)`](@ref)                     | 一个随机 `Array`，元素值是 ``[0, 1)`` 半开区间中的均匀分布且服从一阶独立同分布 [^1]                                                                                                                                       |
| [`randn(T, dims...)`](@ref)                    | 一个随机 `Array`，元素为标准正态分布，服从独立同分布                                                                                                                                                                         |
| [`Matrix{T}(I, m, n)`](@ref)                   | `m`-by-`n` 单位阵。 需要 `using LinearAlgebra` for [`I`](@ref).                                                                                                                                                                                                                   |
| [`range(start, stop=stop, length=n)`](@ref)    | 从 `start` 到 `stop` 的带有 `n` 个线性间隔元素的范围                                                                                                                                                                                 |
| [`fill!(A, x)`](@ref)                          | 用值 `x` 填充数组 `A`                                                                                                                                                                                                        |
| [`fill(x, dims...)`](@ref)                     | 一个被值 `x` 填充的 `Array`                                                                                                                                                                                                         |

[^1]: *iid*，独立同分布

要查看各种方法，我们可以将不同维数传递给这些构造函数，请考虑以下示例：
```jldoctest
julia> zeros(Int8, 2, 3)
2×3 Array{Int8,2}:
 0  0  0
 0  0  0

julia> zeros(Int8, (2, 3))
2×3 Array{Int8,2}:
 0  0  0
 0  0  0

julia> zeros((2, 3))
2×3 Array{Float64,2}:
 0.0  0.0  0.0
 0.0  0.0  0.0
```
此处, `(2, 3)` 是一个元组 [`Tuple`](@ref) 并且第一个参数——元素类型是可选的, 默认值为 `Float64`.

## [Array literals](@id man-array-literals)

数组也可以直接用方括号来构造; 语法为 `[A, B, C, ...]`
创建一个一维数组(即一个矢量)，该一维数组的元素用逗号分隔。所创建的数组中元素的类型([`eltype`](@ref)) 自动由括号内参数的类型确定。如果所有参数类型都相同，则该类型称为数组的 `eltype`。 如果所有元素都有相同的[promotion type](@ref conversion-and-promotion)，那么个元素都由[`convert`](@ref)转换成该类型并且该类型为数组的 `eltype`. 否则, 生成一个可以包含任意类型的异构数组—— `Vector{Any}` ;该构造方法包含字符 `[]`，此时构造过程无参数给出。

```jldoctest
julia> [1,2,3] # An array of `Int`s
3-element Array{Int64,1}:
 1
 2
 3

julia> promote(1, 2.3, 4//5) # This combination of Int, Float64 and Rational promotes to Float64
(1.0, 2.3, 0.8)

julia> [1, 2.3, 4//5] # Thus that's the element type of this Array
3-element Array{Float64,1}:
 1.0
 2.3
 0.8

julia> []
Any[]
```

### [Concatenation](@id man-array-concatenation)

If the arguments inside the square brackets are separated by semicolons (`;`) or newlines
instead of commas, then their contents are _vertically concatenated_ together instead of
the arguments being used as elements themselves.

```jldoctest
julia> [1:2, 4:5] # Has a comma, so no concatenation occurs. The ranges are themselves the elements
2-element Array{UnitRange{Int64},1}:
 1:2
 4:5

julia> [1:2; 4:5]
4-element Array{Int64,1}:
 1
 2
 4
 5

julia> [1:2
        4:5
        6]
5-element Array{Int64,1}:
 1
 2
 4
 5
 6
```

Similarly, if the arguments are separated by tabs or spaces, then their contents are
_horizontally concatenated_ together.

```jldoctest
julia> [1:2  4:5  7:8]
2×3 Array{Int64,2}:
 1  4  7
 2  5  8

julia> [[1,2]  [4,5]  [7,8]]
2×3 Array{Int64,2}:
 1  4  7
 2  5  8

julia> [1 2 3] # Numbers can also be horizontally concatenated
1×3 Array{Int64,2}:
 1  2  3
```

Using semicolons (or newlines) and spaces (or tabs) can be combined to concatenate
both horizontally and vertically at the same time.

```jldoctest
julia> [1 2
        3 4]
2×2 Array{Int64,2}:
 1  2
 3  4

julia> [zeros(Int, 2, 2) [1; 2]
        [3 4]            5]
3×3 Array{Int64,2}:
 0  0  1
 0  0  2
 3  4  5
```

More generally, concatenation can be accomplished through the [`cat`](@ref) function.
These syntaxes are shorthands for function calls that themselves are convenience functions:

| 语法            | 函数        | 描述                                        |
|:----------------- |:--------------- |:-------------------------------------------------- |
|                   | [`cat`](@ref)   | 沿着 s 的第 `k` 维拼接数组    |
| `[A; B; C; ...]`  | [`vcat`](@ref)  | shorthand for `cat(A...; dims=1)                   |
| `[A B C ...]`     | [`hcat`](@ref)  | shorthand for `cat(A...; dims=2)                   |
| `[A B; C D; ...]` | [`hvcat`](@ref) | simultaneous vertical and horizontal concatenation |

### Typed array literals

可以用 `T[A, B, C, ...]` 的方式声明一个元素为某种特定类型的数组。该方法定义一个元素类型为 `T` 的一维数组并且初始化元素为 `A`, `B`, `C`, ....。比如，`Any[x, y, z]` 会构建一个异构数组，该数组可以包含任意类型的元素。

类似的，拼接也可以用类型为前缀来指定结果的元素类型。

```jldoctest
julia> [[1 2] [3 4]]
1×4 Array{Int64,2}:
 1  2  3  4

julia> Int8[[1 2] [3 4]]
1×4 Array{Int8,2}:
 1  2  3  4
```

## [Comprehensions](@id man-comprehensions)

（数组）推导提供了构造数组的通用且强大的方法。其语法类似于数学中的集合构造的写法：

```
A = [ F(x,y,...) for x=rx, y=ry, ... ]
```

这种形式的含义是 `F(x,y,...)` 取其给定列表中变量 `x`，`y` 等的每个值进行计算。值可以指定为任何可迭代对象，但通常是 `1:n` 或 `2:(n-1)` 之类的范围，或者像 `[1.2, 3.4, 5.7]` 这样的显式数组值。结果是一个 N 维密集数组，其维数是变量范围 `rx`，`ry` 等的维数串联。每次 `F(x,y,...)` 计算返回一个标量。

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

The resulting array type depends on the types of the computed elements just like [array literals](@ref man-array-literals) do. In order to control the
type explicitly, a type can be prepended to the comprehension. For example, we could have requested
the result in single precision by writing:

```julia
Float32[ 0.25*x[i-1] + 0.5*x[i] + 0.25*x[i+1] for i=2:length(x)-1 ]
```

## 生成器表达式

也可以在没有方括号的情况下编写（数组）推导，从而产生称为生成器的对象。可以迭代此对象以按需生成值，而不是预先分配数组并存储它们（请参阅 [迭代](@ref)）。例如，以下表达式在不分配内存的情况下对一个序列进行求和：

```jldoctest
julia> sum(1/n^2 for n=1:1000)
1.6439345666815615
```

在参数列表中使用具有多个维度的生成器表达式时，需要使用括号将生成器与后续参数分开：

```julia-repl
julia> map(tuple, 1/(i+j) for i=1:2, j=1:2, [1:4;])
ERROR: syntax: invalid iteration specification
```

`for` 后面所有逗号分隔的表达式都被解释为范围。 添加括号让我们可以向 [`map`](@ref) 中添加第三个参数：

```jldoctest
julia> map(tuple, (1/(i+j) for i=1:2, j=1:2), [1 3; 2 4])
2×2 Array{Tuple{Float64,Int64},2}:
 (0.5, 1)       (0.333333, 3)
 (0.333333, 2)  (0.25, 4)
```

Generators are implemented via inner functions. Just like
inner functions used elsewhere in the language, variables from the enclosing scope can be
"captured" in the inner function.  For example, `sum(p[i] - q[i] for i=1:n)`
captures the three variables `p`, `q` and `n` from the enclosing scope.
Captured variables can present performance challenges; see
[performance tips](@ref man-performance-captured).


通过编写多个 `for` 关键字，生成器和推导中的范围可以取决于之前的范围：

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

可以使用 `if` 关键字过滤生成的值：

```jldoctest
julia> [(i,j) for i=1:3 for j=1:i if i+j == 4]
2-element Array{Tuple{Int64,Int64},1}:
 (2, 2)
 (3, 1)
```

## [索引](@id man-array-indexing)

索引 n 维数组 `A` 的一般语法是：

```
X = A[I_1, I_2, ..., I_n]
```

其中每个 `I_k` 可以是标量整数，整数数组或任何其他[支持的索引类型](@ref man-supported-index-types)。这包括 [`Colon`](@ref) (`:`) 来选择整个维度中的所有索引，形式为 `a:c` 或 `a:b:c` 的范围来选择连续或跨步的子区间，以及布尔数组以选择索引为 `true` 的元素。

如果所有索引都是标量，则结果 `X` 是数组 `A` 中的单个元素。否则，`X` 是一个数组，其维数与所有索引的维数之和相同。

如果所有索引 `I_k` 都是向量，则 `X` 的形状将是 `(length(I_1), length(I_2), ..., length(I_n))`，其中，`X` 中位于 `i_1, i_2, ..., i_n` 处的元素为 `A[I_1[i_1], I_2[i_2], ..., I_n[i_n]]`。

例如：

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

请注意最后两种情况下得到的数组大小为何是不同的。

如果 `I_1` 是二维矩阵，则 `X` 是 `n+1` 维数组，其形状为 `(size(I_1, 1), size(I_1, 2), length(I_2), ..., length(I_n))`。矩阵会添加一个维度。

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

位于 `i_1, i_2, i_3, ..., i_{n+1}` 处的元素值是 `A[I_1[i_1, i_2], I_2[i_3], ..., I_n[i_{n+1}]]`。所有使用标量索引的维度都将被丢弃，例如，假设 `J` 是索引数组，那么 `A[2，J，3]` 的结果是一个大小为 `size(J)` 的数组、其第 j 个元素由 `A[2, J[j], 3]` 填充。

作为此语法的特殊部分，`end` 关键字可用于表示索引括号内每个维度的最后一个索引，由索引的最内层数组的大小决定。没有 `end` 关键字的索引语法相当于调用[`getindex`](@ref)：

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

## [Indexed Assignment](@id man-indexed-assignment)

在 n 维数组 `A` 中赋值的一般语法是：

```
A[I_1, I_2, ..., I_n] = X
```

其中每个 `I_k` 可以是标量整数，整数数组或任何其他[支持的索引类型](@ref man-supported-index-types)。这包括 [`Colon`](@ref) (`:`) 来选择整个维度中的所有索引，形式为 `a:c` 或 `a:b:c` 的范围来选择连续或跨步的子区间，以及布尔数组以选择索引为 `true` 的元素。

如果所有 `I_k` 都为整数，则数组 `A` 中 `I_1, I_2, ..., I_n` 位置的值将被 `X` 的值覆盖，必要时将 [`convert`](@ref) 为数组 `A` 的 [`eltype`](@ref)。


如果任一 `I_k` 选择了一个以上的位置，则等号右侧的 `X` 必须为一个与 `A[I_1, I_2, ..., I_n]` 形状一致的数组或一个具有相同元素数的向量。数组 `A` 中 `I_1[i_1], I_2[i_2], ..., I_n[i_n]` 位置的值将被 `X[I_1, I_2, ..., I_n]` 的值覆盖，必要时会转换类型。逐元素的赋值运算符 `.=` 可以用于将 `X` 沿选择的位置 [broadcast](@ref 广播)：


```
A[I_1, I_2, ..., I_n] .= X
```

就像在[索引](@ref man-array-indexing)中一样，`end`关键字可用于表示索引括号中每个维度的最后一个索引，由被赋值的数组大小决定。 没有`end`关键字的索引赋值语法相当于调用[`setindex!`](@ref)：

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

在表达式 `A[I_1, I_2, ..., I_n]` 中，每个 `I_k` 可以是标量索引，标量索引数组，或者用 [`to_indices`](@ref) 转换成的表示标量索引数组的对象：

1. 标量索引。默认情况下，这包括：
    * 非布尔的整数
    * [[`CartesianIndex {N}`](@ref)s，其行为类似于跨越多个维度的 `N` 维整数元组（详见下文）](@ref)s, which behave like an `N`-tuple of integers spanning multiple dimensions (see below for more details)
2. 标量索引数组。这包括：
    * 整数向量和多维整数数组
    * 像 `[]` 这样的空数组，它不选择任何元素
    * 如 `a:c` 或 `a:b:c` 的范围，从 `a` 到 `c`（包括）选择连续或间隔的部分元素
    * 任何自定义标量索引数组，它是 `AbstractArray` 的子类型
    * `CartesianIndex{N}` 数组（详见下文）
3. 一个表示标量索引数组的对象，可以通过[`to_indices`](@ref)转换为这样的对象。 默认情况下，这包括：
    * [`Colon()`](@ref) (`:`)，表示整个维度内或整个数组中的所有索引
    * 布尔数组，选择其中值为 `true` 的索引对应的元素（更多细节见下文）

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
Int64[]

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

特殊的 `CartesianIndex{N}` 对象表示一个标量索引，其行为类似于张成多个维度的 `N` 维整数元组。例如：

```jldoctest cartesianindex
julia> A = reshape(1:32, 4, 4, 2);

julia> A[3, 2, 1]
7

julia> A[CartesianIndex(3, 2, 1)] == A[3, 2, 1] == 7
true
```

如果单独考虑，这可能看起来相对微不足道；`CartesianIndex` 只是将多个整数聚合成一个表示单个多维索引的对象。 但是，当与其他索引形式和迭代器组合产生多个 `CartesianIndex` 时，这可以生成非常优雅和高效的代码。请参阅下面的[迭代](@ref)，有关更高级的示例，请参阅[关于多维算法和迭代博客文章](https://julialang.org/blog/2016/02/iteration)。

也支持 `CartesianIndex {N}` 的数组。它们代表一组标量索引，每个索引都跨越 `N` 个维度，从而实现一种有时也称为逐点索引的索引形式。例如，它可以从上面的 `A` 的第一「页」访问对角元素：

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

这可以通过 [dot broadcasting](@ref man-vectorized) 以及普通整数索引（而不是把从 `A` 中提取第一“页”作为单独的步骤）更加简单地表达。它甚至可以与 `:` 结合使用，同时从两个页面中提取两个对角线：

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
 1  0  0  0
 1  0  0  0
 0  0  0  0
 1  1  0  1

julia> x[mask]
5-element Array{Int64,1}:
  1
  2
  4
  8
 16
```

### Number of indices

#### Cartesian indexing

The ordinary way to index into an `N`-dimensional array is to use exactly `N` indices; each
index selects the position(s) in its particular dimension. For example, in the three-dimensional
array `A = rand(4, 3, 2)`, `A[2, 3, 1]` will select the number in the second row of the third
column in the first "page" of the array. This is often referred to as _cartesian indexing_.

#### Linear indexing

When exactly one index `i` is provided, that index no longer represents a location in a
particular dimension of the array. Instead, it selects the `i`th element using the
column-major iteration order that linearly spans the entire array. This is known as _linear
indexing_. It essentially treats the array as though it had been reshaped into a
one-dimensional vector with [`vec`](@ref).

```jldoctest linindexing
julia> A = [2 6; 4 7; 3 1]
3×2 Array{Int64,2}:
 2  6
 4  7
 3  1

julia> A[5]
7

julia> vec(A)[5]
7
```

A linear index into the array `A` can be converted to a `CartesianIndex` for cartesian
indexing with `CartesianIndices(A)[i]` (see [`CartesianIndices`](@ref)), and a set of
`N` cartesian indices can be converted to a linear index with
`LinearIndices(A)[i_1, i_2, ..., i_N]` (see [`LinearIndices`](@ref)).

```jldoctest linindexing
julia> CartesianIndices(A)[5]
CartesianIndex(2, 2)

julia> LinearIndices(A)[2, 2]
5
```

It's important to note that there's a very large assymmetry in the performance
of these conversions. Converting a linear index to a set of cartesian indices
requires dividing and taking the remainder, whereas going the other way is just
multiplies and adds. In modern processors, integer division can be 10-50 times
slower than multiplication. While some arrays — like [`Array`](@ref) itself —
are implemented using a linear chunk of memory and directly use a linear index
in their implementations, other arrays — like [`Diagonal`](@ref) — need the
full set of cartesian indices to do their lookup (see [`IndexStyle`](@ref) to
introspect which is which). As such, when iterating over an entire array, it's
much better to iterate over [`eachindex(A)`](@ref) instead of `1:length(A)`.
Not only will the former be much faster in cases where `A` is `IndexCartesian`,
but it will also support OffsetArrays, too.

#### Omitted and extra indices

In addition to linear indexing, an `N`-dimensional array may be indexed with
fewer or more than `N` indices in certain situations.

Indices may be omitted if the trailing dimensions that are not indexed into are
all length one. In other words, trailing indices can be omitted only if there
is only one possible value that those omitted indices could be for an in-bounds
indexing expression. For example, a four-dimensional array with size `(3, 4, 2,
1)` may be indexed with only three indices as the dimension that gets skipped
(the fourth dimension) has length one. Note that linear indexing takes
precedence over this rule.

```jldoctest
julia> A = reshape(1:24, 3, 4, 2, 1)
3×4×2×1 reshape(::UnitRange{Int64}, 3, 4, 2, 1) with eltype Int64:
[:, :, 1, 1] =
 1  4  7  10
 2  5  8  11
 3  6  9  12

[:, :, 2, 1] =
 13  16  19  22
 14  17  20  23
 15  18  21  24

julia> A[1, 3, 2] # Omits the fourth dimension (length 1)
19

julia> A[1, 3] # Attempts to omit dimensions 3 & 4 (lengths 2 and 1)
ERROR: BoundsError: attempt to access 3×4×2×1 reshape(::UnitRange{Int64}, 3, 4, 2, 1) with eltype Int64 at index [1, 3]

julia> A[19] # Linear indexing
19
```

When omitting _all_ indices with `A[]`, this semantic provides a simple idiom
to retrieve the only element in an array and simultaneously ensure that there
was only one element.

Similarly, more than `N` indices may be provided if all the indices beyond the
dimensionality of the array are `1` (or more generally are the first and only
element of `axes(A, d)` where `d` is that particular dimension number). This
allows vectors to be indexed like one-column matrices, for example:

```jldoctest
julia> A = [8,6,7]
3-element Array{Int64,1}:
 8
 6
 7

julia> A[2,1]
6
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

当你需要每个元素的值而不是索引时，使用第一个构造。 在第二个构造中，如果 `A` 是具有快速线性索引的数组类型，`i` 将是 `Int`; 否则，它将是一个 `CartesianIndex`：

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

与 `for i = 1:length(A)` 相比，[`eachindex`](@ref) 提供了一种迭代任何数组类型的有效方法。

## Array traits

如果你编写一个自定义的 [`AbstractArray`](@ref) 类型，你可以用以下代码指定它使用快速线性索引

```julia
Base.IndexStyle(::Type{<:MyArray}) = IndexLinear()
```

此设置将导致 `myArray` 上的 `eachindex` 迭代使用整数。如果未指定此特征，则使用默认值 `IndexCartesian()`。

## [Array and Vectorized Operators and Functions](@id man-array-and-vectorized-operators-and-functions)

以下运算符支持对数组操作

1. 一元运算符 -- `-`, `+`
2. 二元运算符 -- `-`, `+`, `*`, `/`, `\`, `^`
3. 比较操作符 -- `==`, `!=`, `≈` ([`isapprox`](@ref)), `≉`

另外，为了便于数学上和其他运算的向量化，Julia [提供了点语法（dot syntax）](@ref man-vectorized) `f.(args...)`，例如，`sin.(x)` 或 `min.(x,y)`，用于数组或数组和标量的混合上的按元素运算（[广播](@ref)运算）；当与其他点调用（dot call）结合使用时，它们的额外优点是能「融合」到单个循环中，例如，`sin.(cos.(x))`。

此外，*每个*二元运算符支持相应的[点操作版本](@ref man-dot-operators)，可以应用于此类[融合 broadcasting 操作](@ref man-vectorized)的数组（以及数组和标量的组合），例如 `z .== sin.(x .* y)`。

请注意，类似 `==` 的比较运算在作用于整个数组时，得到一个布尔结果。使用像 `.==` 这样的点运算符进行按元素的比较。（对于像 `<` 这样的比较操作，*只有*按元素运算的版本 `.<` 适用于数组。）

还要注意 `max.(a,b)` 和 [`maximum(a)`](@ref) 之间的区别，`max.(a,b)` 对 `a` 和 `b` 的每个元素 [`broadcast`](@ref)s [`max`](@ref)，[`maximum(a)`](@ref) 寻找在 `a` 中的最大值。`min.(a,b)` 和 `minimum(a)` 也有同样的关系。

## 广播

有时需要在不同尺寸的数组上执行元素对元素的操作，例如将矩阵的每一列加一个向量。一种低效的方法是将向量复制成矩阵的大小：

```julia-repl
julia> a = rand(2,1); A = rand(2,3);

julia> repeat(a,1,3)+A
2×3 Array{Float64,2}:
 1.20813  1.82068  1.25387
 1.56851  1.86401  1.67846
```

当维度较大的时候，这种方法将会十分浪费，所以 Julia 提供了广播 [`broadcast`](@ref)，它将会将参数中低维度的参数扩展，使得其与其他维度匹配，且不会使用额外的内存，并将所给的函数逐元素地应用。

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
to `broadcast` calls (except that they fuse, as [described above](@ref man-array-and-vectorized-operators-and-functions)). There is also a
[`broadcast!`](@ref) function to specify an explicit destination (which can also
be accessed in a fusing fashion by `.=` assignment). In fact, `f.(args...)`
is equivalent to `broadcast(f, args...)`, providing a convenient syntax to broadcast any function
([dot syntax](@ref man-vectorized)). Nested "dot calls" `f.(...)` (including calls to `.+` etcetera)
[automatically fuse](@ref man-dot-operators) into a single `broadcast` call.

Additionally, [`broadcast`](@ref) is not limited to arrays (see the function documentation);
it also handles scalars, tuples and other collections.  By default, only some argument types are
considered scalars, including (but not limited to) `Number`s, `String`s, `Symbol`s, `Type`s, `Function`s
and some common singletons like `missing` and `nothing`. All other arguments are
iterated over or indexed into elementwise.

```jldoctest
julia> convert.(Float32, [1, 2])
2-element Array{Float32,1}:
 1.0
 2.0

julia> ceil.(UInt8, [1.2 3.4; 5.6 6.7])
2×2 Array{UInt8,2}:
 0x02  0x04
 0x06  0x07

julia> string.(1:3, ". ", ["First", "Second", "Third"])
3-element Array{String,1}:
 "1. First"
 "2. Second"
 "3. Third"
```

Sometimes, you want a container (like an array) that would normally participate in broadcast to be "protected"
from broadcast's behavior of iterating over all of its elements. By placing it inside another container
(like a single element [`Tuple`](@ref)) broadcast will treat it as a single value.
```jldoctest
julia> ([1, 2, 3], [4, 5, 6]) .+ ([1, 2, 3],)
([2, 4, 6], [5, 7, 9])

julia> ([1, 2, 3], [4, 5, 6]) .+ tuple([1, 2, 3])
([2, 4, 6], [5, 7, 9])
```

## 实现

Julia 中的基本数组类型是抽象类型 [`AbstractArray{T,N}`](@ref)。它通过维数 `N` 和元素类型 `T` 进行参数化。[`AbstractVector`](@ref) 和 [`AbstractMatrix`](@ref) 是一维和二维情况下的别名。`AbstractArray` 对象的操作是使用更高级别的运算符和函数定义的，其方式独立于底层存储。这些操作可以正确地被用于任何特定数组实现的回退操作。

`AbstractArray` 类型包含任何模糊类似的东西，它的实现可能与传统数组完全不同。例如，可以根据请求而不是存储来计算元素。但是，任何具体的 `AbstractArray{T,N}` 类型通常应该至少实现 [`size(A)`](@ref)（返回 `Int` 元组），[`getindex(A,i)`](@ref) 和 [`getindex(A,i1,...,iN)`](@ref getindex)；可变数组也应该实现 [`setindex!`](@ref)。建议这些操作具有几乎为常数的时间复杂性，或严格说来 Õ(1) 复杂性，否则某些数组函数可能出乎意料的慢。具体类型通常还应提供 [`similar(A,T=eltype(A),dims=size(A))`](@ref) 方法，用于为 [`copy`](@ref) 分配类似的数组和其他位于当前数组空间外的操作。无论在内部如何表示 `AbstractArray{T,N}`，`T` 是由 *整数* 索引返回的对象类型（`A[1, ..., 1]`，当 `A` 不为空），`N` 应该是 [`size`](@ref) 返回的元组的长度。有关定义自定义 `AbstractArray` 实现的更多详细信息，请参阅[接口章节中的数组接口导则](@ref man-interface-array)。

`DenseArray` is an abstract subtype of `AbstractArray` intended to include all arrays where
elements are stored contiguously in column-major order (see [additional notes in
Performance Tips](@ref man-performance-column-major)). The [`Array`](@ref) type is a specific instance
of `DenseArray`;  [`Vector`](@ref) and [`Matrix`](@ref) are aliases for the 1-d and 2-d cases.
Very few operations are implemented specifically for `Array` beyond those that are required
for all `AbstractArray`s; much of the array library is implemented in a generic
manner that allows all custom arrays to behave similarly.

`SubArray` 是 `AbstractArray` 的特例，它通过与原始数组共享内存而不是复制它来执行索引。 使用[`view`](@ref) 函数创建 `SubArray`，它的调用方式与[`getindex`](@ref) 相同（作用于数组和一系列索引参数）。 [`view`](@ref) 的结果看起来与 [`getindex`](@ref) 的结果相同，只是数据保持不变。 [`view`](@ref) 将输入索引向量存储在 `SubArray` 对象中，该对象稍后可用于间接索引原始数组。 通过将  [`@views`](@ref) 宏放在表达式或代码块之前，该表达式中的任何 `array [...]` 切片将被转换为创建一个 `SubArray` 视图。

[`BitArray`](@ref) 是节省空间“压缩”的布尔数组，每个比特（bit）存储一个布尔值。 它们可以类似于 `Array{Bool}` 数组（每个字节（byte）存储一个布尔值），并且可以分别通过 `Array(bitarray)` 和 `BitArray(array)` 相互转换。

An array is "strided" if it is stored in memory with well-defined spacings (strides) between
its elements. A strided array with a supported element type may be passed to an external
(non-Julia) library like BLAS or LAPACK by simply passing its [`pointer`](@ref) and the
stride for each dimension. The [`stride(A, d)`](@ref) is the distance between elements along
dimension `d`. For example, the builtin `Array` returned by `rand(5,7,2)` has its elements
arranged contiguously in column major order. This means that the stride of the first
dimension — the spacing between elements in the same column — is `1`:

```julia-repl
julia> A = rand(5,7,2);

julia> stride(A,1)
1
```

The stride of the second dimension is the spacing between elements in the same row, skipping
as many elements as there are in a single column (`5`). Similarly, jumping between the two
"pages" (in the third dimension) requires skipping `5*7 == 35` elements.  The [`strides`](@ref)
of this array is the tuple of these three numbers together:

```julia-repl
julia> strides(A)
(1, 5, 35)
```

In this particular case, the number of elements skipped _in memory_ matches the number of
_linear indices_ skipped. This is only the case for contiguous arrays like `Array` (and
other `DenseArray` subtypes) and is not true in general. Views with range indices are a good
example of _non-contiguous_ strided arrays; consider `V = @view A[1:3:4, 2:2:6, 2:-1:1]`.
This view `V` refers to the same memory as `A` but is skipping and re-arranging some of its
elements. The stride of the first dimension of `V` is `3` because we're only selecting every
third row from our original array:

```julia-repl
julia> V = @view A[1:3:4, 2:2:6, 2:-1:1];

julia> stride(V, 1)
3
```

This view is similarly selecting every other column from our original `A` — and thus it
needs to skip the equivalent of two five-element columns when moving between indices in the
second dimension:

```julia-repl
julia> stride(V, 2)
10
```

The third dimension is interesting because its order is reversed! Thus to get from the first
"page" to the second one it must go _backwards_ in memory, and so its stride in this
dimension is negative!

```julia-repl
julia> stride(V, 3)
-35
```

This means that the `pointer` for `V` is actually pointing into the middle of `A`'s memory
block, and it refers to elements both backwards and forwards in memory. See the
[interface guide for strided arrays](@ref man-interface-strided-arrays) for more details on
defining your own strided arrays. [`StridedVector`](@ref) and [`StridedMatrix`](@ref) are
convenient aliases for many of the builtin array types that are considered strided arrays,
allowing them to dispatch to select specialized implementations that call highly tuned and
optimized BLAS and LAPACK functions using just the pointer and strides.

It is worth emphasizing that strides are about offsets in memory rather than indexing. If
you are looking to convert between linear (single-index) indexing and cartesian
(multi-index) indexing, see [`LinearIndices`](@ref) and [`CartesianIndices`](@ref).
