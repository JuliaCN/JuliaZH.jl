# [一维和多维数组](@id man-multi-dim-arrays)

与大多数科学计算语言一样，Julia 提供原生的数组实现。大多数科学计算语言非常重视其数组实现，而牺牲了其他容器。Julia 没有以任何特殊方式处理数组。
就像和其它用 Julia 写的代码一样，Julia 的数组库几乎完全是用 Julia 自身实现的，并且由编译器保证其性能。
因此，也可以通过继承 [`AbstractArray`](@ref) 来定义自定义数组类型。
有关实现自定义数组类型的更多详细信息，请参阅 [AbstractArray 接口的手册部分](@ref man-interface-array)。

数组是存储在多维网格中对象的集合。允许使用零维数组，请参见[常见问题]（@ref faq-array-0dim）。
在最一般的情况下， 数组中的对象可能是 [`Any`](@ref) 类型。
对于大多数计算上的需求，数组中对象的类型应该更加具体，例如 [`Float64`](@ref) 或 [`Int32`](@ref)。

一般来说，与许多其他科学计算语言不同，Julia 不希望为了性能而以向量化的方式编写程序。
Julia 的编译器使用类型推断，并为标量数组索引生成优化的代码，从而能够令用户方便地编写可读性良好的程序，而不牺牲性能，并且时常会减少内存使用。

在 Julia 中，所有函数的参数都是 [非复制的方式进行传递](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_sharing)的（比如说，通过指针传递）。一些科学计算语言用传值的方式传递数组，尽管这样做可以防止数组在被调函数中被意外地篡改，但这也会导致不必要的数组拷贝。作为 Julia 的一个惯例，以一个 `!` 结尾的函数名它会对自己的一个或者多个参数的值进行修改或者销毁（例如，请比较 [`sort`](@ref) 和 [`sort!`](@ref)）。被调函数必须进行显式拷贝，以确保它们不会无意中修改输入参数。很多不以`!`结尾的函数在实现的时候，都会先进行显式拷贝，然后调用一个以 `!` 结尾的同名函数，最后返回之前拷贝的副本。

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

Julia 提供了许多用于构造和初始化数组的函数。在下列函数中，参数 `dims ...` 可以是一个元组 tuple 来表示维数，也可以是一个可变长度的整数值作为维数。大部分函数的第一个参数都表示数组的元素类型 `T` 。如果类型 `T` 被省略，那么将默认为 [`Float64`](@ref)。

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
| [`rand(T, dims...)`](@ref)                     |  一个随机 `Array`，其元素值是 iid [^1] 和均匀分布值的。 对于浮点类型 `T`，数值位于半开放区间 ``[0, 1)`` 内。 |
| [`randn(T, dims...)`](@ref)                    | 一个随机 `Array`，元素为标准正态分布，服从独立同分布                                                                                                                                                                         |
| [`Matrix{T}(I, m, n)`](@ref)                   | `m` 行 `n` 列的单位矩阵 （需要先执行 `using LinearAlgebra` 来才能使用 [`I`](@ref)）                                                                                                                                                                                                                   |
| [`range(start, stop, n)`](@ref)                | 从 `start` 到 `stop` 的带有 `n` 个线性间隔元素的范围                                                                                                                                                                                 |
| [`fill!(A, x)`](@ref)                          | 用值 `x` 填充数组 `A`                                                                                                                                                                                                        |
| [`fill(x, dims...)`](@ref)                     | 一个由 `x` 填充的 `Array`。特别的，`fill(x)` 构造了一个包含 `x` 的零维 `Array`。 |

[^1]: *iid*，独立同分布

要查看各种方法，我们可以将不同维数传递给这些构造函数，请考虑以下示例：
```jldoctest
julia> zeros(Int8, 2, 3)
2×3 Matrix{Int8}:
 0  0  0
 0  0  0

julia> zeros(Int8, (2, 3))
2×3 Matrix{Int8}:
 0  0  0
 0  0  0

julia> zeros((2, 3))
2×3 Matrix{Float64}:
 0.0  0.0  0.0
 0.0  0.0  0.0
```
此处, `(2, 3)` 是一个元组 [`Tuple`](@ref) 并且第一个参数——元素类型是可选的, 默认值为 `Float64`.

## [数组常量](@id man-array-literals)

数组也可以直接用方括号来构造; 语法 `[A, B, C, ...]` 创建一个一维数组(即一个向量)，该一维数组的元素用逗号分隔。
所创建的数组中元素的类型([`eltype`](@ref)) 自动由括号内参数的类型确定。如果所有参数类型都相同，则该类型称为数组的 `eltype`。
如果所有元素都有相同的[promotion type](@ref conversion-and-promotion)，那么个元素都由[`convert`](@ref)转换成该类型并且该类型为数组的 `eltype`。
否则, 生成一个可以包含任意类型的异构数组—— `Vector{Any}` ;该构造方法包含字符 `[]`，此时构造过程无参数给出。
[Array literal can be typed](@ref man-array-typed-literal) with the syntax `T[A, B, C, ...]` where `T` is a type.

```jldoctest
julia> [1,2,3] # 元素类型为 Int 的向量
3-element Vector{Int64}:
 1
 2
 3

julia> promote(1, 2.3, 4//5) # Int, Float64 以及 Rational 类型放在一起则会提升到 Float64
(1.0, 2.3, 0.8)

julia> [1, 2.3, 4//5] # 从而它就是这个矩阵的元素类型
3-element Vector{Float64}:
 1.0
 2.3
 0.8

julia> Float32[1, 2.3, 4//5] # Specify element type manually
3-element Vector{Float32}:
 1.0
 2.3
 0.8

julia> []
Any[]
```

### [数组拼接](@id man-array-concatenation)

如果方括号里的参数不是由逗号分隔，而是由单个分号(`;`) 或者换行符分隔，那么每一个参数就不再解析为一个单独的数组元素，而是纵向拼接起来。
 

```jldoctest
julia> [1:2, 4:5] # 这里有一个逗号，因此并不会发生矩阵的拼接。这里居然的元素本身就是这些 range
2-element Vector{UnitRange{Int64}}:
 1:2
 4:5

julia> [1:2; 4:5]
4-element Vector{Int64}:
 1
 2
 4
 5

julia> [1:2
        4:5
        6]
5-element Vector{Int64}:
 1
 2
 4
 5
 6
```

类似的，如果这些参数是被制表符、空格符或者两个分号所分隔，那么它们的内容就_横向拼接_在一起。

```jldoctest
julia> [1:2  4:5  7:8]
2×3 Matrix{Int64}:
 1  4  7
 2  5  8

julia> [[1,2]  [4,5]  [7,8]]
2×3 Matrix{Int64}:
 1  4  7
 2  5  8

julia> [1 2 3] # 数字可以被横向拼接
1×3 Matrix{Int64}:
 1  2  3

julia> [1;; 2;; 3;; 4]
1×4 Matrix{Int64}:
 1  2  3  4
```

单个分号（或换行符）和空格（或制表符）可以被结合起来使用进行横向或者纵向的拼接。

```jldoctest
julia> [1 2
        3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> [zeros(Int, 2, 2) [1; 2]
        [3 4]            5]
3×3 Matrix{Int64}:
 0  0  1
 0  0  2
 3  4  5

julia> [[1 1]; 2 3; [4 4]]
3×2 Matrix{Int64}:
 1  1
 2  3
 4  4
```

Spaces (and tabs) have a higher precedence than semicolons, performing any horizontal
concatenations first and then concatenating the result. Using double semicolons for the
horizontal concatenation, on the other hand, performs any vertical concatenations before
horizontally concatenating the result.

```jldoctest
julia> [zeros(Int, 2, 2) ; [3 4] ;; [1; 2] ; 5]
3×3 Matrix{Int64}:
 0  0  1
 0  0  2
 3  4  5

julia> [1:2; 4;; 1; 3:4]
3×2 Matrix{Int64}:
 1  1
 2  3
 4  4
```

Just as `;` and `;;` concatenate in the first and second dimension, using more semicolons
extends this same general scheme. The number of semicolons in the separator specifies the
particular dimension, so `;;;` concatenates in the third dimension, `;;;;` in the 4th, and
so on. Fewer semicolons take precedence, so the lower dimensions are generally concatenated
first.

```jldoctest
julia> [1; 2;; 3; 4;; 5; 6;;;
        7; 8;; 9; 10;; 11; 12]
2×3×2 Array{Int64, 3}:
[:, :, 1] =
 1  3  5
 2  4  6

[:, :, 2] =
 7   9  11
 8  10  12
```

Like before, spaces (and tabs) for horizontal concatenation have a higher precedence than
any number of semicolons. Thus, higher-dimensional arrays can also be written by specifying
their rows first, with their elements textually arranged in a manner similar to their layout:

```jldoctest
julia> [1 3 5
        2 4 6;;;
        7 9 11
        8 10 12]
2×3×2 Array{Int64, 3}:
[:, :, 1] =
 1  3  5
 2  4  6

[:, :, 2] =
 7   9  11
 8  10  12

julia> [1 2;;; 3 4;;;; 5 6;;; 7 8]
1×2×2×2 Array{Int64, 4}:
[:, :, 1, 1] =
 1  2

[:, :, 2, 1] =
 3  4

[:, :, 1, 2] =
 5  6

[:, :, 2, 2] =
 7  8

julia> [[1 2;;; 3 4];;;; [5 6];;; [7 8]]
1×2×2×2 Array{Int64, 4}:
[:, :, 1, 1] =
 1  2

[:, :, 2, 1] =
 3  4

[:, :, 1, 2] =
 5  6

[:, :, 2, 2] =
 7  8
```

Although they both mean concatenation in the second dimension, spaces (or tabs) and `;;`
cannot appear in the same array expression unless the double semicolon is simply serving as
a "line continuation" character. This allows a single horizontal concatenation to span
multiple lines (without the line break being interpreted as a vertical concatenation).

```jldoctest
julia> [1 2 ;;
       3 4]
1×4 Matrix{Int64}:
 1  2  3  4
```

Terminating semicolons may also be used to add trailing length 1 dimensions.

```jldoctest
julia> [1;;]
1×1 Matrix{Int64}:
 1

julia> [2; 3;;;]
2×1×1 Array{Int64, 3}:
[:, :, 1] =
 2
 3
```

空格（和制表符）的优先级高于分号，首先执行任何纵向拼接，然后拼接结果。 另一方面，使用双分号进行水平连接时，先纵向拼接再横向拼接。

| Syntax                 | Function         | Description                                                                                                |
|:---------------------- |:---------------- |:---------------------------------------------------------------------------------------------------------- |
|                        | [`cat`](@ref)    | concatenate input arrays along dimension(s) `k`                                                            |
| `[A; B; C; ...]`       | [`vcat`](@ref)   | shorthand for `cat(A...; dims=1)`                                                                           |
| `[A B C ...]`          | [`hcat`](@ref)   | shorthand for `cat(A...; dims=2)`                                                                           |
| `[A B; C D; ...]`      | [`hvcat`](@ref)  | simultaneous vertical and horizontal concatenation                                                         |
| `[A; C;; B; D;;; ...]` | [`hvncat`](@ref) | simultaneous n-dimensional concatenation, where number of semicolons indicate the dimension to concatenate |

### [Typed array literals](@id man-array-typed-literal)

正如 `;` 和 `;;` 在第一维和第二维中拼接一样，使用更多的分号扩展了相同的通用方案。 分隔符中的分号数指定了特定的维度，因此`;;;` 在第三个维度中拼接，`;;;;` 在第四个维度中，依此类推。 较少的分号优先级高，因此较低的维度通常首先拼接。

```jldoctest
julia> [1; 2;; 3; 4;; 5; 6;;;
        7; 8;; 9; 10;; 11; 12]
2×3×2 Array{Int64, 3}:
[:, :, 1] =
 1  3  5
 2  4  6

[:, :, 2] =
 7   9  11
 8  10  12
```

像之前一样，用于水平拼接的空格（和制表符）的优先级高于任何数量的分号。 因此，高维数组也可以通过首先指定它们的行来编写，它们的元素以类似于它们的布局的方式进行文本排列：

```jldoctest
julia> [1 3 5
        2 4 6;;;
        7 9 11
        8 10 12]
2×3×2 Array{Int64, 3}:
[:, :, 1] =
 1  3  5
 2  4  6

[:, :, 2] =
 7   9  11
 8  10  12

julia> [1 2;;; 3 4;;;; 5 6;;; 7 8]
1×2×2×2 Array{Int64, 4}:
[:, :, 1, 1] =
 1  2

[:, :, 2, 1] =
 3  4

[:, :, 1, 2] =
 5  6

[:, :, 2, 2] =
 7  8

julia> [[1 2;;; 3 4];;;; [5 6];;; [7 8]]
1×2×2×2 Array{Int64, 4}:
[:, :, 1, 1] =
 1  2

[:, :, 2, 1] =
 3  4

[:, :, 1, 2] =
 5  6

[:, :, 2, 2] =
 7  8
```

尽管它们都表示第二维中的连接，但空格（或制表符）和 `;;` 不能出现在同一个数组表达式中，除非双分号只是作为“行继续”字符。 这允许单个水平拼接跨越多行（不会将换行符解释为垂直拼接）。

```jldoctest
julia> [1 2 ;;
       3 4]
1×4 Matrix{Int64}:
 1  2  3  4
```

终止分号也可用于在最后添加 1 个长度为1的维度。

```jldoctest
julia> [1;;]
1×1 Matrix{Int64}:
 1

julia> [2; 3;;;]
2×1×1 Array{Int64, 3}:
[:, :, 1] =
 2
 3
```

更一般地，可以通过[`cat`](@ref) 函数来实现数组元素的拼接功能。
以下这些的语法为这些函数的简写形式，它们本身也是非常方便使用的：

| 语法                 | 函数         | 描述                                                                                                |
|:---------------------- |:---------------- |:---------------------------------------------------------------------------------------------------------- |
|                        | [`cat`](@ref)    | 沿着 s 的第 `k` 维拼接数组                                                            |
| `[A; B; C; ...]`       | [`vcat`](@ref)   | `cat(A...; dims=1) 的简写                                                                           |
| `[A B C ...]`          | [`hcat`](@ref)   | `cat(A...; dims=2) 的简写                                                                           |
| `[A B; C D; ...]`      | [`hvcat`](@ref)  | 同时沿垂直和水平方向拼接                                                         |
| `[A; C;; B; D;;; ...]` | [`hvncat`](@ref) | 同时进行 n 维拼接，其中分号的数量表示拼接所在的维度 |

### 指定类型的数组字面量

可以用 `T[A, B, C, ...]` 的方式声明一个元素为某种特定类型的数组。该方法定义一个元素类型为 `T` 的一维数组并且初始化元素为 `A`, `B`, `C`, ....。比如，`Any[x, y, z]` 会构建一个异构数组，该数组可以包含任意类型的元素。

类似的，拼接也可以用类型为前缀来指定结果的元素类型。

```jldoctest
julia> [[1 2] [3 4]]
1×4 Matrix{Int64}:
 1  2  3  4

julia> Int8[[1 2] [3 4]]
1×4 Matrix{Int8}:
 1  2  3  4
```

## [数组推导](@id man-comprehensions)

（数组）推导提供了构造数组的通用且强大的方法。其语法类似于数学中的集合构造的写法：

```
A = [ F(x, y, ...) for x=rx, y=ry, ... ]
```

这种形式的含义是 `F(x,y,...)` 取其给定列表中变量 `x`，`y` 等的每个值进行计算。值可以指定为任何可迭代对象，但通常是 `1:n` 或 `2:(n-1)` 之类的范围，或者像 `[1.2, 3.4, 5.7]` 这样的显式数组值。结果是一个 N 维密集数组，将变量范围 `rx`，`ry` 等的维数拼接起来得到其维数，并且每次 `F(x,y,...)` 计算返回一个标量。

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

生成的数组的类型取决于参与计算元素的类型，就像[数组字面量](@ref man-array-literals)一样。为了显式地控制类型，可以在数组推导之前指定类型。例如，我们可以要求推导的结果为单精度类型：

```julia
Float32[ 0.25*x[i-1] + 0.5*x[i] + 0.25*x[i+1] for i=2:length(x)-1 ]
```

## 生成器表达式

也可以在没有方括号的情况下编写（数组）推导，从而产生称为生成器的对象。可以迭代此对象以按需生成值，而不是预先分配数组并存储它们（请参阅 [迭代](@ref Iteration)）。例如，以下表达式在不分配内存的情况下对一个序列进行求和：

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
2×2 Matrix{Tuple{Float64, Int64}}:
 (0.5, 1)       (0.333333, 3)
 (0.333333, 2)  (0.25, 4)
```

生成器是通过内部函数实现。 与本语言中别处使用的内部函数一样，封闭作用域中的变量可以在内部函数中被「捕获」。例如，`sum(p[i] - q[i] for i=1:n)` 从封闭作用域中捕获三个变量 `p`、`q` 和 `n`。但是变量捕获可能会带来性能挑战；请参阅 [性能提示](@ref man-performance-tips)。


通过编写多个 `for` 关键字，生成器和推导中的范围可以取决于之前的范围：

```jldoctest
julia> [(i, j) for i=1:3 for j=1:i]
6-element Vector{Tuple{Int64, Int64}}:
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
julia> [(i, j) for i=1:3 for j=1:i if i+j == 4]
2-element Vector{Tuple{Int64, Int64}}:
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
2×2×2×2 Array{Int64, 4}:
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

julia> A[1, 2, 1, 1] # 全部为标量索引
3

julia> A[[1, 2], [1], [1, 2], [1]] # 全部为向量索引
2×1×2×1 Array{Int64, 4}:
[:, :, 1, 1] =
 1
 2

[:, :, 2, 1] =
 5
 6

julia> A[[1, 2], [1], [1, 2], 1] # 标量与向量索引的混合使用
2×1×2 Array{Int64, 3}:
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
2×2 Matrix{Int64}:
 1  2
 1  2

julia> A[[1 2; 1 2], 1, 2, 1]
2×2 Matrix{Int64}:
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
2×2 Matrix{Int64}:
 6  10
 7  11

julia> x[1, [2 3; 4 1]]
2×2 Matrix{Int64}:
  5  9
 13  1
```

## [索引赋值](@id man-indexed-assignment)

在 n 维数组 `A` 中赋值的一般语法是：

```
A[I_1, I_2, ..., I_n] = X
```

其中每个 `I_k` 可以是标量整数，整数数组或任何其他[支持的索引类型](@ref man-supported-index-types)。这包括 [`Colon`](@ref) (`:`) 来选择整个维度中的所有索引，形式为 `a:c` 或 `a:b:c` 的范围来选择连续或跨步的子区间，以及布尔数组以选择索引为 `true` 的元素。

如果所有 `I_k` 都为整数，则数组 `A` 中 `I_1, I_2, ..., I_n` 位置的值将被 `X` 的值覆盖，必要时将 [`convert`](@ref) 为数组 `A` 的 [`eltype`](@ref)。

如果索引 `I_k` 本身就是一个数组，那么右侧的 `X` 也必须是一个与索引 `A[I_1, I_2, ..., I_n]` 的结果具有相同形状的数组或是具有相同数量元素的向量。
`A` 的位置 `I_1[i_1], I_2[i_2], ..., I_n[i_n]` 中的值被值 `X[I_1, I_2, ..., I_n]` 覆盖，如果必要也会进行类型转换。
元素分配运算符 `.=` 可以用于沿着所选区域 [广播](@ref Broadcasting) `X`：


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
3×3 Matrix{Int64}:
 1  4  7
 2  5  8
 3  6  9

julia> x[3, 3] = -9;

julia> x[1:2, 1:2] = [-1 -4; -2 -5];

julia> x
3×3 Matrix{Int64}:
 -1  -4   7
 -2  -5   8
  3   6  -9
```

## [支持的索引类型](@id man-supported-index-types)

在表达式 `A[I_1, I_2, ..., I_n]` 中，每个 `I_k` 可以是标量索引，标量索引数组，或者用 [`to_indices`](@ref) 转换成的表示标量索引数组的对象：

1. 标量索引。默认情况下，这包括：
    * 非布尔的整数
    * [`CartesianIndex{N}`](@ref) 用来表达多个维度的信息（详见下文），其内部实际为 N个整数组成的元组。
2. 标量索引数组。这包括：
    * 整数向量和多维整数数组
    * 像 `[]` 这样的空数组，它不选择任何元素。e.g. `A[[]]` (not to be confused with `A[]`)
    * 如 `a:c` 或 `a:b:c` 的范围，从 `a` 到 `c`（包括）选择连续或间隔的部分元素
    * 任何自定义标量索引数组，它是 `AbstractArray` 的子类型
    * `CartesianIndex{N}` 数组（详见下文）
3. 一个表示标量索引数组的对象，可以通过[`to_indices`](@ref)转换为这样的对象。 默认情况下，这包括：
    * [`Colon()`](@ref) (`:`)，表示整个维度内或整个数组中的所有索引
    * 布尔数组，选择其中值为 `true` 的索引对应的元素（更多细节见下文）

一些例子：
```jldoctest
julia> A = reshape(collect(1:2:18), (3, 3))
3×3 Matrix{Int64}:
 1   7  13
 3   9  15
 5  11  17

julia> A[4]
7

julia> A[[2, 5, 8]]
3-element Vector{Int64}:
  3
  9
 15

julia> A[[1 4; 3 8]]
2×2 Matrix{Int64}:
 1   7
 5  15

julia> A[[]]
Int64[]

julia> A[1:2:5]
3-element Vector{Int64}:
 1
 5
 9

julia> A[2, :]
3-element Vector{Int64}:
  3
  9
 15

julia> A[:, 3]
3-element Vector{Int64}:
 13
 15
 17

julia> A[:, 3:3]
3×1 Matrix{Int64}:
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

单独来看的话，这看起来很平凡：`CartesianIndex` 单纯只是将多个整数捆绑在一起作为一个对象来表示一个多维下标。当与其他取下标方式和生成 `CartesianIndex` 的迭代器进行工作的时候，它才真正能展现出它的简洁与高效。关于这个你可以参考 [迭代器](@ref Iteration) 这一部分，你也可以参考 [关于多维算法和迭代器的介绍](https://julialang.org/blog/2016/02/iteration) 这篇博客来了解更进阶的用法。

元素类型为 `CartesianIndex{N}`  的矩阵也是支持的。每一个元素都单独表示一个 `N` 维空间的
索引下标，作为一个整体这样一个矩阵则表示一些 `N` 维空间的点的坐标，因此这种形式有时
也称为逐点索引。例如：你可以通过它来访问上面所定义的三维矩阵  `A` 的第一页 (第三维指标为1）的对角线元素：

```jldoctest cartesianindex
julia> page = A[:, :, 1]
4×4 Matrix{Int64}:
 1  5   9  13
 2  6  10  14
 3  7  11  15
 4  8  12  16

julia> page[[CartesianIndex(1, 1),
             CartesianIndex(2, 2),
             CartesianIndex(3, 3),
             CartesianIndex(4, 4)]]
4-element Vector{Int64}:
  1
  6
 11
 16
```

这可以通过 [dot broadcasting](@ref man-vectorized) 以及普通整数索引（而不是把从 `A` 中提取第一“页”作为单独的步骤）更加简单地表达。它甚至可以与 `:` 结合使用，同时从两个页面中提取两个对角线：

```jldoctest cartesianindex
julia> A[CartesianIndex.(axes(A, 1), axes(A, 2)), 1]
4-element Vector{Int64}:
  1
  6
 11
 16

julia> A[CartesianIndex.(axes(A, 1), axes(A, 2)), :]
4×2 Matrix{Int64}:
  1  17
  6  22
 11  27
 16  32
```

!!! warning

    `CartesianIndex` 和 `CartesianIndex` 数组与用来表示维度的最后一个索引的 `end` 关键字不兼容。 不要在可能包含`CartesianIndex`或其数组的索引表达式中使用`end`。

### 逻辑索引

通常被称为逻辑索引或带有逻辑掩码的索引，通过布尔数组进行索引选择其值为`true`的索引处的元素。 通过布尔向量`B`进行索引实际上与通过[`findall(B)`](@ref)返回的整数向量进行索引相同。 类似地，通过`N`维布尔数组进行索引与通过其值为`true`的`CartesianIndex{N}`的向量进行索引实际上是相同的。 一个逻辑索引必须是一个与它所索引的维度长度相同的向量，或者它必须是唯一提供的索引并且匹配它所索引到的数组的大小和维度。 通常直接使用布尔数组作为索引更有效，而不是调用 [`findall`](@ref)。

```jldoctest
julia> x = reshape(1:16, 4, 4)
4×4 reshape(::UnitRange{Int64}, 4, 4) with eltype Int64:
 1  5   9  13
 2  6  10  14
 3  7  11  15
 4  8  12  16

julia> x[[false, true, true, false], :]
2×4 Matrix{Int64}:
 2  6  10  14
 3  7  11  15

julia> mask = map(ispow2, x)
4×4 Matrix{Bool}:
 1  0  0  0
 1  0  0  0
 0  0  0  0
 1  1  0  1

julia> x[mask]
5-element Vector{Int64}:
  1
  2
  4
  8
 16
```

### 索引数

#### 笛卡尔索引

通常，为一个N维数组元素使用索引的方式是使用N个数字作为索引，每一个索引值确定一个具体的维度。例如，一个三维数组`A = rand(4, 3, 2)`, `A[2, 3, 1]` 将选择的第二行第三列第一“页”中的元素。这种方式通常也被成为笛卡尔索引。

#### 线性索引

当恰好提供了一个索引`i`时，该索引不再表示数组特定维度中的位置。 相反，它使用线性遍历整个数组的列主迭代顺序选择第 `i` 个元素。 这称为_线性索引_。 它本质上将数组视为使用 [`vec`](@ref) 将其重新整形为一维向量。

```jldoctest linindexing
julia> A = [2 6; 4 7; 3 1]
3×2 Matrix{Int64}:
 2  6
 4  7
 3  1

julia> A[5]
7

julia> vec(A)[5]
7
```

数组 `A` 中的线性索引可以转换为 `CartesianIndex` 以使用 `CartesianIndices(A)[i]` 进行笛卡尔索引（参见 [`CartesianIndices`](@ref)），一组 `N` 维笛卡尔索引可以通过`LinearIndices(A)[i_1, i_2, ..., i_N]` 转换为线性索引（参见[`LinearIndices`](@ref)）。

```jldoctest linindexing
julia> CartesianIndices(A)[5]
CartesianIndex(2, 2)

julia> LinearIndices(A)[2, 2]
5
```

需要注意的是，这些转换的性能存在很大的不对称性。
将线性索引转换为一组笛卡尔索引需要做除法取余数，而相反的转换只是相乘和相加。在现代处理器中，整数除法比乘法慢 10-50 倍。
虽然一些数组——比如 [`Array`](@ref) 本身——是使用线性内存块实现的，并在它们的实现中直接使用线性索引，但其他数组——比如 [`Diagonal`](@ref)——需要完整的笛卡尔索引集进行查找
（请参阅 [`IndexStyle`](@ref) 以仔细推敲）。
（译者注：OffsetArrays.jl是Julia的一个包，支持矩阵的下标不从1开始）。

!!! warnings

    When iterating over all the indices for an array, it is
    better to iterate over [`eachindex(A)`](@ref) instead of `1:length(A)`.
    Not only will this be faster in cases where `A` is `IndexCartesian`,
    but it will also support arrays with custom indexing, such as [OffsetArrays](https://github.com/JuliaArrays/OffsetArrays.jl).
    If only the values are needed, then is better to just iterate the array directly, i.e. `for a in A`.

#### [省略和额外的索引](@id Omitted-and-extra-indices)

除了线性索引，在某些情况下， `N` 维数组的可能少于或多余  `N` 。

如果未索引的剩余维度的长度均为 1，则可以省略索引。 换句话说，只有当那些省略的索引对于索引表达式只有一个可能的值时，才可以省略剩余索引。 例如，一个大小为`(3, 4, 2, 1)`的四维数组可能只用三个索引进行索引，因为被跳过的维度（第四维）的长度为 1。 请注意，线性索引优先级高于此规则。

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

当用`A[]` 省略_全部_ 索引时，这种语义提供了一种简单的习惯用法来检索数组中的唯一元素，同时确保只有一个元素。

类似地，如果超出数组维数的所有索引都是`1`（或更一般地说是`axes(A, d)`的第一个也是唯一的元素，其中`d`是特定的维数），可以使用超过`N`维的索引。这允许向量像一列矩阵一样被索引，例如：

```jldoctest
julia> A = [8,6,7]
3-element Vector{Int64}:
 8
 6
 7

julia> A[2,1]
6
```

## [迭代](@id Iteration)

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
julia> A = rand(4, 3);

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

!!! note

    In contrast with `for i = 1:length(A)`, iterating with [`eachindex`](@ref) provides an efficient way to
    iterate over any array type. Besides, this also supports generic arrays with custom indexing such as
    [OffsetArrays](https://github.com/JuliaArrays/OffsetArrays.jl).

## Array traits

如果你编写一个自定义的 [`AbstractArray`](@ref) 类型，你可以用以下代码指定它使用快速线性索引

```julia
Base.IndexStyle(::Type{<:MyArray}) = IndexLinear()
```

此设置将导致 `myArray` 上的 `eachindex` 迭代使用整数。如果未指定此特征，则使用默认值 `IndexCartesian()`。

## [数组和向量化的算子与函数](@id man-array-and-vectorized-operators-and-functions)

以下运算符支持对数组操作

1. 一元运算符 -- `-`, `+`
2. 二元运算符 -- `-`, `+`, `*`, `/`, `\`, `^`
3. 比较操作符 -- `==`, `!=`, `≈` ([`isapprox`](@ref)), `≉`

另外，为了便于数学上和其他运算的向量化，Julia [提供了点语法（dot syntax）](@ref man-vectorized) `f.(args...)`，例如，`sin.(x)` 或 `min.(x,y)`，用于数组或数组和标量的混合上的按元素运算（[广播](@ref Broadcasting)运算）；当与其他点调用（dot call）结合使用时，它们的额外优点是能「融合」到单个循环中，例如，`sin.(cos.(x))`。

此外，*每个*二元运算符支持相应的[点操作版本](@ref man-dot-operators)，可以应用于此类[融合 broadcasting 操作](@ref man-vectorized)的数组（以及数组和标量的组合），例如 `z .== sin.(x .* y)`。

请注意，类似 `==` 的比较运算在作用于整个数组时，得到一个布尔结果。使用像 `.==` 这样的点运算符进行按元素的比较。（对于像 `<` 这样的比较操作，*只有*按元素运算的版本 `.<` 适用于数组。）

还要注意 `max.(a,b)` 和 [`maximum(a)`](@ref) 之间的区别，`max.(a,b)` 对 `a` 和 `b` 的每个元素 [`broadcast`](@ref)s [`max`](@ref)，[`maximum(a)`](@ref) 寻找在 `a` 中的最大值。`min.(a,b)` 和 `minimum(a)` 也有同样的关系。

## [广播](@id Broadcasting)

有时需要在不同尺寸的数组上执行元素对元素的操作，例如将矩阵的每一列加一个向量。一种低效的方法是将向量复制成矩阵的大小：

```julia-repl
julia> a = rand(2, 1); A = rand(2, 3);

julia> repeat(a, 1, 3) + A
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

[点运算符](@ref man-dot-operators) 如`.+` 和`.*` 等价于`broadcast` 调用（除了它们结合使用，[如上所述](@ref man-array-and-vectorized-operators-and-functions)）。 还有一个 [`broadcast!`](@ref) 函数来指定一个明确的方式（也可以通过`.=` 赋值以融合方式访问）。 事实上，`f.(args...)` 等价于`broadcast(f, args...)`，提供了一种方便的语法来广播任何函数([dot syntax](@ref man-vectorized))。 嵌套的“点运算符调用”`f.(...)`（包括对`.+` 等的调用）[自动融合](@ref man-dot-operators) 到单个`broadcast` 调用中。

此外，[`broadcast`](@ref) 不限于数组（参见函数文档）； 它还处理标量、元组和其它容器。 默认情况下，只有一些参数类型被认为是标量，包括（但不限于）`Number`s、`String`s、`Symbol`s、`Type`s、`Function`s 和一些常见的单例，如 `missing` 和`nothing`。 所有其他参数都被迭代或逐个索引。

```jldoctest
julia> convert.(Float32, [1, 2])
2-element Vector{Float32}:
 1.0
 2.0

julia> ceil.(UInt8, [1.2 3.4; 5.6 6.7])
2×2 Matrix{UInt8}:
 0x02  0x04
 0x06  0x07

julia> string.(1:3, ". ", ["First", "Second", "Third"])
3-element Vector{String}:
 "1. First"
 "2. Second"
 "3. Third"
```

有时，你希望一个通常参与广播的容器（如数组）受到“保护”，使其免受广播迭代其所有元素的行为的影响。 通过将其放置在另一个容器中（如单个元素 [`Tuple`](@ref)），广播会将其视为单个值。
```jldoctest
julia> ([1, 2, 3], [4, 5, 6]) .+ ([1, 2, 3],)
([2, 4, 6], [5, 7, 9])

julia> ([1, 2, 3], [4, 5, 6]) .+ tuple([1, 2, 3])
([2, 4, 6], [5, 7, 9])
```

## 实现

Julia 中的基本数组类型是抽象类型 [`AbstractArray{T,N}`](@ref)。它通过维数 `N` 和元素类型 `T` 进行参数化。[`AbstractVector`](@ref) 和 [`AbstractMatrix`](@ref) 是一维和二维情况下的别名。`AbstractArray` 对象的操作是使用更高级别的运算符和函数定义的，其方式独立于底层存储。这些操作可以正确地被用于任何特定数组实现的回退操作。

`AbstractArray` 类型包括任何类似数组的东西，它的实现可能与传统数组完全不同。例如，元素可能根据请求计算而不是存储。然而，任何具体的 `AbstractArray{T,N}` 类型通常应该至少实现 [`size(A)`](@ref)（返回一个 `Int` 元组），[`getindex(A,i)`]( @ref) 和 [`getindex(A,i1,...,iN)`](@ref getindex);可变数组也应该实现 [`setindex!`](@ref)。建议这些操作具有常数时间复杂度，否则某些数组函数可能会出乎意料的慢。具体类型通常还应该提供一个 [`similar(A,T=eltype(A),dims=size(A))`](@ref) 方法，用于为 [`copy`]( @ref) 和其他不合适的操作。无论 `AbstractArray{T,N}` 在内部如何表示，`T` 都是由 *整数* 索引（`A[1, ..., 1]`，当 `A` 非空） 返回的对象类型并且 `N` 应该是 [`size`](@ref) 返回的元组的长度。有关自定义 `AbstractArray` 实现的更多详细信息，请参阅 [接口章节中的数组接口指南](@ref man-interface-array)。

`DenseArray` 是 `AbstractArray` 的抽象子类型，旨在包括元素以列优先顺序连续存储的所有数组（请参阅 [性能提示中的附加说明](@ref man-performance-column-major)）。 [`Array`](@ref) 类型是`DenseArray` 的一个特定实例； [`Vector`](@ref) 和 [`Matrix`](@ref) 是一维和二维情况的别名。 除了所有`AbstractArray`s所需的操作之外，很少有专门为`Array`实现的操作；大部分数组库都是以泛型方式实现的，允许所有自定义数组的行为类似。

`SubArray` 是 `AbstractArray` 的特例，它通过与原始数组共享内存而不是复制它来执行索引。 使用[`view`](@ref) 函数创建 `SubArray`，它的调用方式与[`getindex`](@ref) 相同（作用于数组和一系列索引参数）。 [`view`](@ref) 的结果看起来与 [`getindex`](@ref) 的结果相同，只是数据保持不变。 [`view`](@ref) 将输入索引向量存储在 `SubArray` 对象中，该对象稍后可用于间接索引原始数组。 通过将  [`@views`](@ref) 宏放在表达式或代码块之前，该表达式中的任何 `array [...]` 切片将被转换为创建一个 `SubArray` 视图。

[`BitArray`](@ref) 是节省空间“压缩”的布尔数组，每个比特（bit）存储一个布尔值。 它们可以类似于 `Array{Bool}` 数组（每个字节（byte）存储一个布尔值），并且可以分别通过 `Array(bitarray)` 和 `BitArray(array)` 相互转换。

如果数组存储在内存中，其元素之间具有明确定义的间距（步长），则该数组是“等步长的”的。 通过简单地传递其 [`pointer`](@ref) 和每个维度的步长，可以将有支持元素类型的等步长数组传递给外部（非 Julia）库，如 BLAS 或 LAPACK。 [`stride(A, d)`](@ref) 是元素之间沿维度 `d` 的距离。 例如，`rand(5,7,2)` 返回的内置 `Array` 的元素按列优先顺序连续排列。 这意味着第一个维度的步长——同一列中元素之间的间距——是`1`：

```julia-repl
julia> A = rand(5, 7, 2);

julia> stride(A, 1)
1
```

第二个维度的步长是同一行中元素之间的间距，跳过与单列（`5`）中的元素一样多的元素。 类似地，在两个“页面”（在第三维中）之间跳转需要跳过 `5*7 == 35` 元素。 这个数组的 [`strides`](@ref) 是这三个数字组成的元组：

```julia-repl
julia> strides(A)
(1, 5, 35)
```

在这种特殊情况下，在_内存_中跳过的元素数与跳过的_线性索引_数相匹配。 这仅适用于像 `Array`（和其他 `DenseArray` 子类型）这样的连续数组，通常情况下并非如此。 具有范围索引的视图是 _非连续_ 等步长数组的一个很好的例子； 考虑`V = @view A[1:3:4, 2:2:6, 2:-1:1]`。 这个视图 `V` 与 `A` 引用了相同的内存，但它跳过并重新排列了它的一些元素。 `V` 的第一维的步幅是 `3`，因为我们只从原始数组中选择每第三行：

```julia-repl
julia> V = @view A[1:3:4, 2:2:6, 2:-1:1];

julia> stride(V, 1)
3
```

这个视图类似于从我们原来的`A`中每隔一列选择一列——因此当在第二维的索引之间移动时，它需要跳过相当于两个五元素列的内容：

```julia-repl
julia> stride(V, 2)
10
```

第三维很有趣因为它的顺序颠倒了! 因此从第一
"页" 到第二页它必须在内存中到 _backwards_，所以它在这一维的 strides 是负的!

```julia-repl
julia> stride(V, 3)
-35
```

这意味着`V` 的`pointer` 实际上指向`A` 的内存块的中间，并且它在内存中指向元素是同时向后和向前的。 有关定义你自己的跨距数组的更多详细信息，请参阅 [等步长数组的接口指南](@ref man-interface-strided-arrays)。 [`StridedVector`](@ref) 和 [`StridedMatrix`](@ref) 被认为是等步长数组的内置数组类型的方便别名，允许它们仅使用指针和步幅，来分派选择调用调整和优化后的 BLAS 和 LAPACK 函数。

需要强调的是 strides 是关于内存而不是索引中的偏移。如果你在找在线性（单索引）索引和笛卡尔（多索引）索引间切换的方法，见 [`LinearIndices`](@ref) 和 [`CartesianIndices`](@ref).
