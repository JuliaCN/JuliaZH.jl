```@meta
EditURL = "https://github.com/JuliaLang/julia/blob/master/stdlib/LinearAlgebra/docs/src/index.md"
```

# [Linear Algebra](@id man-linalg)

```@meta
DocTestSetup = :(using LinearAlgebra)
```

除了（且作为一部分）对多维数组的支持，Julia 还提供了许多常见和实用的线性代数运算的本地实现，可通过 `using LinearAlgebra` 加载。
基本的运算，比如 [`tr`](@ref)，[`det`](@ref) 和 [`inv`](@ref) 都是支持的：

```jldoctest
julia> A = [1 2 3; 4 1 6; 7 8 1]
3×3 Matrix{Int64}:
 1  2  3
 4  1  6
 7  8  1

julia> tr(A)
3

julia> det(A)
104.0

julia> inv(A)
3×3 Matrix{Float64}:
 -0.451923   0.211538    0.0865385
  0.365385  -0.192308    0.0576923
  0.240385   0.0576923  -0.0673077
```

还有其它实用的运算，比如寻找特征值或特征向量：

```jldoctest
julia> A = [-4. -17.; 2. 2.]
2×2 Matrix{Float64}:
 -4.0  -17.0
  2.0    2.0

julia> eigvals(A)
2-element Vector{ComplexF64}:
 -1.0 - 5.0im
 -1.0 + 5.0im

julia> eigvecs(A)
2×2 Matrix{ComplexF64}:
  0.945905-0.0im        0.945905+0.0im
 -0.166924+0.278207im  -0.166924-0.278207im
```

此外，Julia 提供了多种[矩阵分解](@ref man-linalg-factorizations)，通过将矩阵预先分解成更适合问题的形式（出于性能或内存上的原因），它们可用于加快问题的求解，如线性求解或矩阵求幂。更多有关信息请参阅文档 [`factorize`](@ref)。举个例子：

```jldoctest
julia> A = [1.5 2 -4; 3 -1 -6; -10 2.3 4]
3×3 Matrix{Float64}:
   1.5   2.0  -4.0
   3.0  -1.0  -6.0
 -10.0   2.3   4.0

julia> factorize(A)
LU{Float64, Matrix{Float64}, Vector{Int64}}
L factor:
3×3 Matrix{Float64}:
  1.0    0.0       0.0
 -0.15   1.0       0.0
 -0.3   -0.132196  1.0
U factor:
3×3 Matrix{Float64}:
 -10.0  2.3     4.0
   0.0  2.345  -3.4
   0.0  0.0    -5.24947
```

因为 `A` 不是埃尔米特、对称、三角、三对角或双对角矩阵，LU 分解也许是我们能做的最好分解。与之相比：

```jldoctest
julia> B = [1.5 2 -4; 2 -1 -3; -4 -3 5]
3×3 Matrix{Float64}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0

julia> factorize(B)
BunchKaufman{Float64, Matrix{Float64}, Vector{Int64}}
D factor:
3×3 Tridiagonal{Float64, Vector{Float64}}:
 -1.64286   0.0   ⋅
  0.0      -2.8  0.0
   ⋅        0.0  5.0
U factor:
3×3 UnitUpperTriangular{Float64, Matrix{Float64}}:
 1.0  0.142857  -0.8
  ⋅   1.0       -0.6
  ⋅    ⋅         1.0
permutation:
3-element Vector{Int64}:
 1
 2
 3
```

在这里，Julia 能够发现 `B` 确实是对称矩阵，并且使用一种更适当的分解。针对一个具有某些属性的矩阵，比如一个对称或三对角矩阵，往往有可能写出更高效的代码。Julia 提供了一些特殊的类型好让你可以根据矩阵所具有的属性「标记」它们。例如：

```jldoctest
julia> B = [1.5 2 -4; 2 -1 -3; -4 -3 5]
3×3 Matrix{Float64}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0

julia> sB = Symmetric(B)
3×3 Symmetric{Float64, Matrix{Float64}}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0
```

`sB` 已经被标记成（实）对称矩阵，所以对于之后可能在它上面执行的操作，例如特征因子化或矩阵-向量乘积，只引用矩阵的一半可以提高效率。举个例子：

```jldoctest
julia> B = [1.5 2 -4; 2 -1 -3; -4 -3 5]
3×3 Matrix{Float64}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0

julia> sB = Symmetric(B)
3×3 Symmetric{Float64, Matrix{Float64}}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0

julia> x = [1; 2; 3]
3-element Vector{Int64}:
 1
 2
 3

julia> sB\x
3-element Vector{Float64}:
 -1.7391304347826084
 -1.1086956521739126
 -1.4565217391304346
```
`\` 运算在这里执行线性求解。左除运算符相当强大，很容易写出紧凑、可读的代码，它足够灵活，可以求解各种线性方程组。

## 特殊矩阵

[具有特殊对称性和结构的矩阵](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=3274)经常在线性代数中出现并且与各种矩阵分解相关。
Julia 具有丰富的特殊矩阵类型，可以快速计算专门为特定矩阵类型开发的专用例程。

下表总结了在 Julia 中已经实现的特殊矩阵类型，以及为它们提供各种优化方法的钩子在 LAPACK 中是否可用。

| 类型                          | 描述                                                                                   |
|:----------------------------- |:--------------------------------------------------------------------------------------------- |
| [`Symmetric`](@ref)           | [Symmetric matrix](https://en.wikipedia.org/wiki/Symmetric_matrix)                            |
| [`Hermitian`](@ref)           | [Hermitian matrix](https://en.wikipedia.org/wiki/Hermitian_matrix)                            |
| [`UpperTriangular`](@ref)     | 上[三角矩阵](https://en.wikipedia.org/wiki/Triangular_matrix)                    |
| [`UnitUpperTriangular`](@ref) | 单位上[三角矩阵](https://en.wikipedia.org/wiki/Triangular_matrix) with unit diagonal |
| [`LowerTriangular`](@ref)     | 下[三角矩阵](https://en.wikipedia.org/wiki/Triangular_matrix)                    |     |
| [`UnitLowerTriangular`](@ref) | 单位下[三角矩阵](https://en.wikipedia.org/wiki/Triangular_matrix) |
| [`UpperHessenberg`](@ref)     | Upper [Hessenberg matrix](https://en.wikipedia.org/wiki/Hessenberg_matrix)
| [`Tridiagonal`](@ref)         | [Tridiagonal matrix](https://en.wikipedia.org/wiki/Tridiagonal_matrix)                        |
| [`SymTridiagonal`](@ref)      | 对称三对角矩阵                                                                  |
| [`Bidiagonal`](@ref)          | 上/下[双对角矩阵](https://en.wikipedia.org/wiki/Bidiagonal_matrix)              |
| [`Diagonal`](@ref)            | [Diagonal matrix](https://en.wikipedia.org/wiki/Diagonal_matrix)                              |
| [`UniformScaling`](@ref)      | [Uniform scaling operator](https://en.wikipedia.org/wiki/Uniform_scaling)                     |

### 基本运算

| 矩阵类型                   | `+` | `-` | `*` | `\` | 具有优化方法的其它函数                      |
|:----------------------------- |:--- |:--- |:--- |:--- |:----------------------------------------------------------- |
| [`Symmetric`](@ref)           |     |     |     | MV  | [`inv`](@ref), [`sqrt`](@ref), [`exp`](@ref)                |
| [`Hermitian`](@ref)           |     |     |     | MV  | [`inv`](@ref), [`sqrt`](@ref), [`exp`](@ref)                |
| [`UpperTriangular`](@ref)     |     |     | MV  | MV  | [`inv`](@ref), [`det`](@ref), [`logdet`](@ref)                                |
| [`UnitUpperTriangular`](@ref) |     |     | MV  | MV  | [`inv`](@ref), [`det`](@ref), [`logdet`](@ref)                                |
| [`LowerTriangular`](@ref)     |     |     | MV  | MV  | [`inv`](@ref), [`det`](@ref), [`logdet`](@ref)                                |
| [`UnitLowerTriangular`](@ref) |     |     | MV  | MV  | [`inv`](@ref), [`det`](@ref), [`logdet`](@ref)                                |
| [`UpperHessenberg`](@ref)     |     |     |     | MM  | [`inv`](@ref), [`det`](@ref)                                |
| [`SymTridiagonal`](@ref)      | M   | M   | MS  | MV  | [`eigmax`](@ref), [`eigmin`](@ref)                          |
| [`Tridiagonal`](@ref)         | M   | M   | MS  | MV  |                                                             |
| [`Bidiagonal`](@ref)          | M   | M   | MS  | MV  |                                                             |
| [`Diagonal`](@ref)            | M   | M   | MV  | MV  | [`inv`](@ref), [`det`](@ref), [`logdet`](@ref), [`/`](@ref) |
| [`UniformScaling`](@ref)      | M   | M   | MVS | MVS | [`/`](@ref)                                                 |

Legend:

| Key        | 说明                                                   |
|:---------- |:------------------------------------------------------------- |
| M（矩阵） | 针对矩阵与矩阵运算的优化方法可用 |
| V（向量） | 针对矩阵与向量运算的优化方法可用 |
| S（标量） | 针对矩阵与标量运算的优化方法可用 |

### 矩阵分解

| 矩阵类型                   | LAPACK | [`eigen`](@ref) | [`eigvals`](@ref) | [`eigvecs`](@ref) | [`svd`](@ref) | [`svdvals`](@ref) |
|:----------------------------- |:------ |:------------- |:----------------- |:----------------- |:------------- |:----------------- |
| [`Symmetric`](@ref)           | SY     |               | ARI               |                   |               |                   |
| [`Hermitian`](@ref)           | HE     |               | ARI               |                   |               |                   |
| [`UpperTriangular`](@ref)     | TR     | A             | A                 | A                 |               |                   |
| [`UnitUpperTriangular`](@ref) | TR     | A             | A                 | A                 |               |                   |
| [`LowerTriangular`](@ref)     | TR     | A             | A                 | A                 |               |                   |
| [`UnitLowerTriangular`](@ref) | TR     | A             | A                 | A                 |               |                   |
| [`SymTridiagonal`](@ref)      | ST     | A             | ARI               | AV                |               |                   |
| [`Tridiagonal`](@ref)         | GT     |               |                   |                   |               |                   |
| [`Bidiagonal`](@ref)          | BD     |               |                   |                   | A             | A                 |
| [`Diagonal`](@ref)            | DI     |               | A                 |                   |               |                   |

图例：

| 键名          | 说明                                                                                                                     | 例子              |
|:------------ |:------------------------------------------------------------------------------------------------------------------------------- |:-------------------- |
| A (all)      | 找到所有特征值和/或特征向量的优化方法可用                                           | e.g. `eigvals(M)`    |
| R (range)    | 通过第 `ih` 个特征值寻找第 `il` 个特征值的优化方法可用                                   | `eigvals(M, il, ih)` |
| I (interval) | 寻找在区间 [`vl`, `vh`] 内的特征值的优化方法可用                                 | `eigvals(M, vl, vh)` |
| V (vectors)  | 寻找对应于特征值 `x=[x1, x2,...]` 的特征向量的优化方法可用 | `eigvecs(M, x)`      |

### 均匀缩放运算符

[`UniformScaling`](@ref) 运算符代表一个标量乘以单位运算符，`λ*I`。
单位运算符 `I` 被定义为常量，是 `UniformScaling` 的实例。
这些运算符的大小是通用的，并且会在二元运算符 [`+`](@ref)，[`-`](@ref)，[`*`](@ref) 和 [`\`](@ref) 中与另一个矩阵相匹配。
对于 `A+I` 和 `A-I` ，这意味着 `A` 必须是个方阵。
与单位运算符 `I` 相乘是一个空操作（除了检查比例因子是一），因此几乎没有开销。

来查看 `UniformScaling` 运算符的运行结果：

```jldoctest
julia> U = UniformScaling(2);

julia> a = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> a + U
2×2 Matrix{Int64}:
 3  2
 3  6

julia> a * U
2×2 Matrix{Int64}:
 2  4
 6  8

julia> [a U]
2×4 Matrix{Int64}:
 1  2  2  0
 3  4  0  2

julia> b = [1 2 3; 4 5 6]
2×3 Matrix{Int64}:
 1  2  3
 4  5  6

julia> b - U
ERROR: DimensionMismatch: matrix is not square: dimensions are (2, 3)
Stacktrace:
[...]
```

If you need to solve many systems of the form `(A+μI)x = b` for the same `A` and different `μ`, it might be beneficial
to first compute the Hessenberg factorization `F` of `A` via the [`hessenberg`](@ref) function.
Given `F`, Julia employs an efficient algorithm for `(F+μ*I) \ b` (equivalent to `(A+μ*I)x \ b`) and related
operations like determinants.

## [Matrix factorizations](@id man-linalg-factorizations)

[Matrix factorizations (a.k.a. matrix decompositions)](https://en.wikipedia.org/wiki/Matrix_decomposition)
compute the factorization of a matrix into a product of matrices, and are one of the central concepts
in (numerical) linear algebra.

The following table summarizes the types of matrix factorizations that have been implemented in
Julia. Details of their associated methods can be found in the [Standard functions](@ref) section
of the Linear Algebra documentation.

| Type               | Description                                                                                                    |
|:------------------ |:-------------------------------------------------------------------------------------------------------------- |
| `BunchKaufman`     | Bunch-Kaufman factorization                                                                                    |
| `Cholesky`         | [Cholesky factorization](https://en.wikipedia.org/wiki/Cholesky_decomposition)                                 |
| `CholeskyPivoted`  | [Pivoted](https://en.wikipedia.org/wiki/Pivot_element) Cholesky factorization                                  |
| `LDLt`             | [LDL(T) factorization](https://en.wikipedia.org/wiki/Cholesky_decomposition#LDL_decomposition)                 |
| `LU`               | [LU factorization](https://en.wikipedia.org/wiki/LU_decomposition)                                             |
| `QR`               | [QR factorization](https://en.wikipedia.org/wiki/QR_decomposition)                                             |
| `QRCompactWY`      | Compact WY form of the QR factorization                                                                        |
| `QRPivoted`        | Pivoted [QR factorization](https://en.wikipedia.org/wiki/QR_decomposition)                                     |
| `LQ`               | [QR factorization](https://en.wikipedia.org/wiki/QR_decomposition) of `transpose(A)`                           |
| `Hessenberg`       | [Hessenberg decomposition](http://mathworld.wolfram.com/HessenbergDecomposition.html)                          |
| `Eigen`            | [Spectral decomposition](https://en.wikipedia.org/wiki/Eigendecomposition_of_a_matrix)                         |
| `GeneralizedEigen` | [Generalized spectral decomposition](https://en.wikipedia.org/wiki/Eigendecomposition_of_a_matrix#Generalized_eigenvalue_problem)                            |
| `SVD`              | [Singular value decomposition](https://en.wikipedia.org/wiki/Singular_value_decomposition)                     |
| `GeneralizedSVD`   | [Generalized SVD](https://en.wikipedia.org/wiki/Generalized_singular_value_decomposition#Higher_order_version) |
| `Schur`            | [Schur decomposition](https://en.wikipedia.org/wiki/Schur_decomposition)                                       |
| `GeneralizedSchur` | [Generalized Schur decomposition](https://en.wikipedia.org/wiki/Schur_decomposition#Generalized_Schur_decomposition) |

Adjoints and transposes of [`Factorization`](@ref) objects are lazily wrapped in
`AdjointFactorization` and `TransposeFactorization` objects, respectively. Generically,
transpose of real `Factorization`s are wrapped as `AdjointFactorization`.

## [Orthogonal matrices (`AbstractQ`)](@id man-linalg-abstractq)

Some matrix factorizations generate orthogonal/unitary "matrix" factors. These
factorizations include QR-related factorizations obtained from calls to [`qr`](@ref), i.e.,
`QR`, `QRCompactWY` and `QRPivoted`, the Hessenberg factorization obtained from calls to
[`hessenberg`](@ref), and the LQ factorization obtained from [`lq`](@ref). While these
orthogonal/unitary factors admit a matrix representation, their internal representation
is, for performance and memory reasons, different. Hence, they should be rather viewed as
matrix-backed, function-based linear operators. In particular, reading, for instance, a
column of its matrix representation requires running "matrix"-vector multiplication code,
rather than simply reading out data from memory (possibly filling parts of the vector with
structural zeros). Another clear distinction from other, non-triangular matrix types is
that the underlying multiplication code allows for in-place modification during multiplication.
Furthermore, objects of specific `AbstractQ` subtypes as those created via [`qr`](@ref),
[`hessenberg`](@ref) and [`lq`](@ref) can behave like a square or a rectangular matrix
depending on context:

```julia
julia> using LinearAlgebra

julia> Q = qr(rand(3,2)).Q
3×3 LinearAlgebra.QRCompactWYQ{Float64, Matrix{Float64}, Matrix{Float64}}

julia> Matrix(Q)
3×2 Matrix{Float64}:
 -0.320597   0.865734
 -0.765834  -0.475694
 -0.557419   0.155628

julia> Q*I
3×3 Matrix{Float64}:
 -0.320597   0.865734  -0.384346
 -0.765834  -0.475694  -0.432683
 -0.557419   0.155628   0.815514

julia> Q*ones(2)
3-element Vector{Float64}:
  0.5451367118802273
 -1.241527373086654
 -0.40179067589600226

julia> Q*ones(3)
3-element Vector{Float64}:
  0.16079054743832022
 -1.674209978965636
  0.41372375588835797

julia> ones(1,2) * Q'
1×3 Matrix{Float64}:
 0.545137  -1.24153  -0.401791

julia> ones(1,3) * Q'
1×3 Matrix{Float64}:
 0.160791  -1.67421  0.413724
```

Due to this distinction from dense or structured matrices, the abstract `AbstractQ` type
does not subtype `AbstractMatrix`, but instead has its own type hierarchy. Custom types
that subtype `AbstractQ` can rely on generic fallbacks if the following interface is satisfied.
For example, for

```julia
struct MyQ{T} <: LinearAlgebra.AbstractQ{T}
    # required fields
end
```

provide overloads for

```julia
Base.size(Q::MyQ) # size of corresponding square matrix representation
Base.convert(::Type{AbstractQ{T}}, Q::MyQ) # eltype promotion [optional]
LinearAlgebra.lmul!(Q::MyQ, x::AbstractVecOrMat) # left-multiplication
LinearAlgebra.rmul!(A::AbstractMatrix, Q::MyQ) # right-multiplication
```

If `eltype` promotion is not of interest, the `convert` method is unnecessary, since by
default `convert(::Type{AbstractQ{T}}, Q::AbstractQ{T})` returns `Q` itself.
Adjoints of `AbstractQ`-typed objects are lazily wrapped in an `AdjointQ` wrapper type,
which requires its own `LinearAlgebra.lmul!` and `LinearAlgebra.rmul!` methods. Given this
set of methods, any `Q::MyQ` can be used like a matrix, preferably in a multiplicative
context: multiplication via `*` with scalars, vectors and matrices from left and right,
obtaining a matrix representation of `Q` via `Matrix(Q)` (or `Q*I`) and indexing into the
matrix representation all work. In contrast, addition and subtraction as well as more
generally broadcasting over elements in the matrix representation fail because that would
be highly inefficient. For such use cases, consider computing the matrix representation
up front and cache it for future reuse.

## Standard functions

Linear algebra functions in Julia are largely implemented by calling functions from [LAPACK](http://www.netlib.org/lapack/).
Sparse matrix factorizations call functions from [SuiteSparse](http://suitesparse.com).
Other sparse solvers are available as Julia packages.

```@docs
Base.:*(::AbstractMatrix, ::AbstractMatrix)
Base.:\(::AbstractMatrix, ::AbstractVecOrMat)
Base.:/(::AbstractVecOrMat, ::AbstractVecOrMat)
LinearAlgebra.SingularException
LinearAlgebra.PosDefException
LinearAlgebra.ZeroPivotException
LinearAlgebra.dot
LinearAlgebra.dot(::Any, ::Any, ::Any)
LinearAlgebra.cross
LinearAlgebra.axpy!
LinearAlgebra.axpby!
LinearAlgebra.rotate!
LinearAlgebra.reflect!
LinearAlgebra.factorize
LinearAlgebra.Diagonal
LinearAlgebra.Bidiagonal
LinearAlgebra.SymTridiagonal
LinearAlgebra.Tridiagonal
LinearAlgebra.Symmetric
LinearAlgebra.Hermitian
LinearAlgebra.LowerTriangular
LinearAlgebra.UpperTriangular
LinearAlgebra.UnitLowerTriangular
LinearAlgebra.UnitUpperTriangular
LinearAlgebra.UpperHessenberg
LinearAlgebra.UniformScaling
LinearAlgebra.I
LinearAlgebra.UniformScaling(::Integer)
LinearAlgebra.Factorization
LinearAlgebra.LU
LinearAlgebra.lu
LinearAlgebra.lu!
LinearAlgebra.Cholesky
LinearAlgebra.CholeskyPivoted
LinearAlgebra.cholesky
LinearAlgebra.cholesky!
LinearAlgebra.lowrankupdate
LinearAlgebra.lowrankdowndate
LinearAlgebra.lowrankupdate!
LinearAlgebra.lowrankdowndate!
LinearAlgebra.LDLt
LinearAlgebra.ldlt
LinearAlgebra.ldlt!
LinearAlgebra.QR
LinearAlgebra.QRCompactWY
LinearAlgebra.QRPivoted
LinearAlgebra.qr
LinearAlgebra.qr!
LinearAlgebra.LQ
LinearAlgebra.lq
LinearAlgebra.lq!
LinearAlgebra.BunchKaufman
LinearAlgebra.bunchkaufman
LinearAlgebra.bunchkaufman!
LinearAlgebra.Eigen
LinearAlgebra.GeneralizedEigen
LinearAlgebra.eigvals
LinearAlgebra.eigvals!
LinearAlgebra.eigmax
LinearAlgebra.eigmin
LinearAlgebra.eigvecs
LinearAlgebra.eigen
LinearAlgebra.eigen!
LinearAlgebra.Hessenberg
LinearAlgebra.hessenberg
LinearAlgebra.hessenberg!
LinearAlgebra.Schur
LinearAlgebra.GeneralizedSchur
LinearAlgebra.schur
LinearAlgebra.schur!
LinearAlgebra.ordschur
LinearAlgebra.ordschur!
LinearAlgebra.SVD
LinearAlgebra.GeneralizedSVD
LinearAlgebra.svd
LinearAlgebra.svd!
LinearAlgebra.svdvals
LinearAlgebra.svdvals!
LinearAlgebra.Givens
LinearAlgebra.givens
LinearAlgebra.triu
LinearAlgebra.triu!
LinearAlgebra.tril
LinearAlgebra.tril!
LinearAlgebra.diagind
LinearAlgebra.diag
LinearAlgebra.diagm
LinearAlgebra.rank
LinearAlgebra.norm
LinearAlgebra.opnorm
LinearAlgebra.normalize!
LinearAlgebra.normalize
LinearAlgebra.cond
LinearAlgebra.condskeel
LinearAlgebra.tr
LinearAlgebra.det
LinearAlgebra.logdet
LinearAlgebra.logabsdet
Base.inv(::AbstractMatrix)
LinearAlgebra.pinv
LinearAlgebra.nullspace
Base.kron
Base.kron!
LinearAlgebra.exp(::StridedMatrix{<:LinearAlgebra.BlasFloat})
Base.cis(::AbstractMatrix)
Base.:^(::AbstractMatrix, ::Number)
Base.:^(::Number, ::AbstractMatrix)
LinearAlgebra.log(::StridedMatrix)
LinearAlgebra.sqrt(::StridedMatrix)
LinearAlgebra.cos(::StridedMatrix{<:Real})
LinearAlgebra.sin(::StridedMatrix{<:Real})
LinearAlgebra.sincos(::StridedMatrix{<:Real})
LinearAlgebra.tan(::StridedMatrix{<:Real})
LinearAlgebra.sec(::StridedMatrix)
LinearAlgebra.csc(::StridedMatrix)
LinearAlgebra.cot(::StridedMatrix)
LinearAlgebra.cosh(::StridedMatrix)
LinearAlgebra.sinh(::StridedMatrix)
LinearAlgebra.tanh(::StridedMatrix)
LinearAlgebra.sech(::StridedMatrix)
LinearAlgebra.csch(::StridedMatrix)
LinearAlgebra.coth(::StridedMatrix)
LinearAlgebra.acos(::StridedMatrix)
LinearAlgebra.asin(::StridedMatrix)
LinearAlgebra.atan(::StridedMatrix)
LinearAlgebra.asec(::StridedMatrix)
LinearAlgebra.acsc(::StridedMatrix)
LinearAlgebra.acot(::StridedMatrix)
LinearAlgebra.acosh(::StridedMatrix)
LinearAlgebra.asinh(::StridedMatrix)
LinearAlgebra.atanh(::StridedMatrix)
LinearAlgebra.asech(::StridedMatrix)
LinearAlgebra.acsch(::StridedMatrix)
LinearAlgebra.acoth(::StridedMatrix)
LinearAlgebra.lyap
LinearAlgebra.sylvester
LinearAlgebra.issuccess
LinearAlgebra.issymmetric
LinearAlgebra.isposdef
LinearAlgebra.isposdef!
LinearAlgebra.istril
LinearAlgebra.istriu
LinearAlgebra.isdiag
LinearAlgebra.ishermitian
Base.transpose
LinearAlgebra.transpose!
LinearAlgebra.Transpose
LinearAlgebra.TransposeFactorization
Base.adjoint
LinearAlgebra.adjoint!
LinearAlgebra.Adjoint
LinearAlgebra.AdjointFactorization
Base.copy(::Union{Transpose,Adjoint})
LinearAlgebra.stride1
LinearAlgebra.checksquare
LinearAlgebra.peakflops
LinearAlgebra.hermitianpart
LinearAlgebra.hermitianpart!
```

## Low-level matrix operations

In many cases there are in-place versions of matrix operations that allow you to supply
a pre-allocated output vector or matrix.  This is useful when optimizing critical code in order
to avoid the overhead of repeated allocations. These in-place operations are suffixed with `!`
below (e.g. `mul!`) according to the usual Julia convention.

```@docs
LinearAlgebra.mul!
LinearAlgebra.lmul!
LinearAlgebra.rmul!
LinearAlgebra.ldiv!
LinearAlgebra.rdiv!
```

## BLAS functions

In Julia (as in much of scientific computation), dense linear-algebra operations are based on
the [LAPACK library](http://www.netlib.org/lapack/), which in turn is built on top of basic linear-algebra
building-blocks known as the [BLAS](http://www.netlib.org/blas/). There are highly optimized
implementations of BLAS available for every computer architecture, and sometimes in high-performance
linear algebra routines it is useful to call the BLAS functions directly.

`LinearAlgebra.BLAS` provides wrappers for some of the BLAS functions. Those BLAS functions
that overwrite one of the input arrays have names ending in `'!'`.  Usually, a BLAS function has
four methods defined, for [`Float32`](@ref), [`Float64`](@ref), [`ComplexF32`](@ref Complex),
and [`ComplexF64`](@ref Complex) arrays.

### [BLAS character arguments](@id stdlib-blas-chars)

Many BLAS functions accept arguments that determine whether to transpose an argument (`trans`),
which triangle of a matrix to reference (`uplo` or `ul`),
whether the diagonal of a triangular matrix can be assumed to
be all ones (`dA`) or which side of a matrix multiplication
the input argument belongs on (`side`). The possibilities are:

#### [Multiplication order](@id stdlib-blas-side)

| `side` | Meaning                                                             |
|:-------|:--------------------------------------------------------------------|
| `'L'`  | The argument goes on the *left* side of a matrix-matrix operation.  |
| `'R'`  | The argument goes on the *right* side of a matrix-matrix operation. |

#### [Triangle referencing](@id stdlib-blas-uplo)

| `uplo`/`ul` | Meaning                                               |
|:------------|:------------------------------------------------------|
| `'U'`       | Only the *upper* triangle of the matrix will be used. |
| `'L'`       | Only the *lower* triangle of the matrix will be used. |

#### [Transposition operation](@id stdlib-blas-trans)

| `trans`/`tX` | Meaning                                                 |
|:-------------|:--------------------------------------------------------|
| `'N'`        | The input matrix `X` is not transposed or conjugated.   |
| `'T'`        | The input matrix `X` will be transposed.                |
| `'C'`        | The input matrix `X` will be conjugated and transposed. |

#### [Unit diagonal](@id stdlib-blas-diag)

| `diag`/`dX` | Meaning                                                   |
|:------------|:----------------------------------------------------------|
| `'N'`       | The diagonal values of the matrix `X` will be read.       |
| `'U'`       | The diagonal of the matrix `X` is assumed to be all ones. |

```@docs
LinearAlgebra.BLAS
LinearAlgebra.BLAS.set_num_threads
LinearAlgebra.BLAS.get_num_threads
```

BLAS functions can be divided into three groups, also called three levels,
depending on when they were first proposed, the type of input parameters,
and the complexity of the operation.

### Level 1 BLAS functions

The level 1 BLAS functions were first proposed in [(Lawson, 1979)][Lawson-1979] and
define operations between scalars and vectors.

[Lawson-1979]: https://dl.acm.org/doi/10.1145/355841.355847

```@docs
# xROTG
# xROTMG
LinearAlgebra.BLAS.rot!
# xROTM
# xSWAP
LinearAlgebra.BLAS.scal!
LinearAlgebra.BLAS.scal
LinearAlgebra.BLAS.blascopy!
# xAXPY!
# xAXPBY!
LinearAlgebra.BLAS.dot
LinearAlgebra.BLAS.dotu
LinearAlgebra.BLAS.dotc
# xxDOT
LinearAlgebra.BLAS.nrm2
LinearAlgebra.BLAS.asum
LinearAlgebra.BLAS.iamax
```

### Level 2 BLAS functions

The level 2 BLAS functions were published in [(Dongarra, 1988)][Dongarra-1988],
and define matrix-vector operations.

[Dongarra-1988]: https://dl.acm.org/doi/10.1145/42288.42291

**return a vector**

```@docs
LinearAlgebra.BLAS.gemv!
LinearAlgebra.BLAS.gemv(::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.gemv(::Any, ::Any, ::Any)
LinearAlgebra.BLAS.gbmv!
LinearAlgebra.BLAS.gbmv
LinearAlgebra.BLAS.hemv!
LinearAlgebra.BLAS.hemv(::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.hemv(::Any, ::Any, ::Any)
# hbmv!, hbmv
LinearAlgebra.BLAS.hpmv!
LinearAlgebra.BLAS.symv!
LinearAlgebra.BLAS.symv(::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.symv(::Any, ::Any, ::Any)
LinearAlgebra.BLAS.sbmv!
LinearAlgebra.BLAS.sbmv(::Any, ::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.sbmv(::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.spmv!
LinearAlgebra.BLAS.trmv!
LinearAlgebra.BLAS.trmv
# xTBMV
# xTPMV
LinearAlgebra.BLAS.trsv!
LinearAlgebra.BLAS.trsv
# xTBSV
# xTPSV
```

**return a matrix**

```@docs
LinearAlgebra.BLAS.ger!
# xGERU
# xGERC
LinearAlgebra.BLAS.her!
# xHPR
# xHER2
# xHPR2
LinearAlgebra.BLAS.syr!
LinearAlgebra.BLAS.spr!
# xSYR2
# xSPR2
```

### Level 3 BLAS functions

The level 3 BLAS functions were published in [(Dongarra, 1990)][Dongarra-1990],
and define matrix-matrix operations.

[Dongarra-1990]: https://dl.acm.org/doi/10.1145/77626.79170

```@docs
LinearAlgebra.BLAS.gemm!
LinearAlgebra.BLAS.gemm(::Any, ::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.gemm(::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.symm!
LinearAlgebra.BLAS.symm(::Any, ::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.symm(::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.hemm!
LinearAlgebra.BLAS.hemm(::Any, ::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.hemm(::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.syrk!
LinearAlgebra.BLAS.syrk
LinearAlgebra.BLAS.herk!
LinearAlgebra.BLAS.herk
LinearAlgebra.BLAS.syr2k!
LinearAlgebra.BLAS.syr2k
LinearAlgebra.BLAS.her2k!
LinearAlgebra.BLAS.her2k
LinearAlgebra.BLAS.trmm!
LinearAlgebra.BLAS.trmm
LinearAlgebra.BLAS.trsm!
LinearAlgebra.BLAS.trsm
```

## LAPACK functions

`LinearAlgebra.LAPACK` provides wrappers for some of the LAPACK functions for linear algebra.
 Those functions that overwrite one of the input arrays have names ending in `'!'`.

Usually a function has 4 methods defined, one each for [`Float64`](@ref), [`Float32`](@ref),
`ComplexF64` and `ComplexF32` arrays.

Note that the LAPACK API provided by Julia can and will change in the future. Since this API is
not user-facing, there is no commitment to support/deprecate this specific set of functions in
future releases.

```@docs
LinearAlgebra.LAPACK
LinearAlgebra.LAPACK.gbtrf!
LinearAlgebra.LAPACK.gbtrs!
LinearAlgebra.LAPACK.gebal!
LinearAlgebra.LAPACK.gebak!
LinearAlgebra.LAPACK.gebrd!
LinearAlgebra.LAPACK.gelqf!
LinearAlgebra.LAPACK.geqlf!
LinearAlgebra.LAPACK.geqrf!
LinearAlgebra.LAPACK.geqp3!
LinearAlgebra.LAPACK.gerqf!
LinearAlgebra.LAPACK.geqrt!
LinearAlgebra.LAPACK.geqrt3!
LinearAlgebra.LAPACK.getrf!
LinearAlgebra.LAPACK.tzrzf!
LinearAlgebra.LAPACK.ormrz!
LinearAlgebra.LAPACK.gels!
LinearAlgebra.LAPACK.gesv!
LinearAlgebra.LAPACK.getrs!
LinearAlgebra.LAPACK.getri!
LinearAlgebra.LAPACK.gesvx!
LinearAlgebra.LAPACK.gelsd!
LinearAlgebra.LAPACK.gelsy!
LinearAlgebra.LAPACK.gglse!
LinearAlgebra.LAPACK.geev!
LinearAlgebra.LAPACK.gesdd!
LinearAlgebra.LAPACK.gesvd!
LinearAlgebra.LAPACK.ggsvd!
LinearAlgebra.LAPACK.ggsvd3!
LinearAlgebra.LAPACK.geevx!
LinearAlgebra.LAPACK.ggev!
LinearAlgebra.LAPACK.ggev3!
LinearAlgebra.LAPACK.gtsv!
LinearAlgebra.LAPACK.gttrf!
LinearAlgebra.LAPACK.gttrs!
LinearAlgebra.LAPACK.orglq!
LinearAlgebra.LAPACK.orgqr!
LinearAlgebra.LAPACK.orgql!
LinearAlgebra.LAPACK.orgrq!
LinearAlgebra.LAPACK.ormlq!
LinearAlgebra.LAPACK.ormqr!
LinearAlgebra.LAPACK.ormql!
LinearAlgebra.LAPACK.ormrq!
LinearAlgebra.LAPACK.gemqrt!
LinearAlgebra.LAPACK.posv!
LinearAlgebra.LAPACK.potrf!
LinearAlgebra.LAPACK.potri!
LinearAlgebra.LAPACK.potrs!
LinearAlgebra.LAPACK.pstrf!
LinearAlgebra.LAPACK.ptsv!
LinearAlgebra.LAPACK.pttrf!
LinearAlgebra.LAPACK.pttrs!
LinearAlgebra.LAPACK.trtri!
LinearAlgebra.LAPACK.trtrs!
LinearAlgebra.LAPACK.trcon!
LinearAlgebra.LAPACK.trevc!
LinearAlgebra.LAPACK.trrfs!
LinearAlgebra.LAPACK.stev!
LinearAlgebra.LAPACK.stebz!
LinearAlgebra.LAPACK.stegr!
LinearAlgebra.LAPACK.stein!
LinearAlgebra.LAPACK.syconv!
LinearAlgebra.LAPACK.sysv!
LinearAlgebra.LAPACK.sytrf!
LinearAlgebra.LAPACK.sytri!
LinearAlgebra.LAPACK.sytrs!
LinearAlgebra.LAPACK.hesv!
LinearAlgebra.LAPACK.hetrf!
LinearAlgebra.LAPACK.hetri!
LinearAlgebra.LAPACK.hetrs!
LinearAlgebra.LAPACK.syev!
LinearAlgebra.LAPACK.syevr!
LinearAlgebra.LAPACK.syevd!
LinearAlgebra.LAPACK.sygvd!
LinearAlgebra.LAPACK.bdsqr!
LinearAlgebra.LAPACK.bdsdc!
LinearAlgebra.LAPACK.gecon!
LinearAlgebra.LAPACK.gehrd!
LinearAlgebra.LAPACK.orghr!
LinearAlgebra.LAPACK.gees!
LinearAlgebra.LAPACK.gges!
LinearAlgebra.LAPACK.gges3!
LinearAlgebra.LAPACK.trexc!
LinearAlgebra.LAPACK.trsen!
LinearAlgebra.LAPACK.tgsen!
LinearAlgebra.LAPACK.trsyl!
LinearAlgebra.LAPACK.hseqr!
```

```@meta
DocTestSetup = nothing
```
