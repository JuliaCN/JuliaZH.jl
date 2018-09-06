# Linear Algebra

```@meta
DocTestSetup = :(using LinearAlgebra)
```

除了（且作为一部分）对多维数组的支持，Julia 还提供了许多常见和实用的线性代数操作的本地实现。基础的操作，比如 [`tr`](@ref)，[`det`](@ref) 和 [`inv`](@ref) 都是支持的：

```jldoctest
julia> A = [1 2 3; 4 1 6; 7 8 1]
3×3 Array{Int64,2}:
 1  2  3
 4  1  6
 7  8  1

julia> tr(A)
3

julia> det(A)
104.0

julia> inv(A)
3×3 Array{Float64,2}:
 -0.451923   0.211538    0.0865385
  0.365385  -0.192308    0.0576923
  0.240385   0.0576923  -0.0673077
```

还有其它实用的操作，比如寻找特征值或特征向量：

```jldoctest
julia> A = [-4. -17.; 2. 2.]
2×2 Array{Float64,2}:
 -4.0  -17.0
  2.0    2.0

julia> eigvals(A)
2-element Array{Complex{Float64},1}:
 -1.0 + 5.0im
 -1.0 - 5.0im

julia> eigvecs(A)
2×2 Array{Complex{Float64},2}:
  0.945905+0.0im        0.945905-0.0im
 -0.166924-0.278207im  -0.166924+0.278207im
```

此外，Julia 提供了许多 [factorizations](@ref man-linalg-factorizations)，它们可用于加快问题的求解，比如线性求解或矩阵或矩阵求幂，这通过将矩阵预先分解成更适合问题的形式（出于性能或内存上的原因）。有关的更多信息，请参阅文档 [`factorize`](@ref)。举个例子：

```jldoctest
julia> A = [1.5 2 -4; 3 -1 -6; -10 2.3 4]
3×3 Array{Float64,2}:
   1.5   2.0  -4.0
   3.0  -1.0  -6.0
 -10.0   2.3   4.0

julia> factorize(A)
LU{Float64,Array{Float64,2}}
L factor:
3×3 Array{Float64,2}:
  1.0    0.0       0.0
 -0.15   1.0       0.0
 -0.3   -0.132196  1.0
U factor:
3×3 Array{Float64,2}:
 -10.0  2.3     4.0
   0.0  2.345  -3.4
   0.0  0.0    -5.24947
```

因为 `A` 不是埃尔米特、对称、三角、三对角或双对角矩阵，LU 分解也许是我们能做的最好分解。与之相比：

```jldoctest
julia> B = [1.5 2 -4; 2 -1 -3; -4 -3 5]
3×3 Array{Float64,2}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0

julia> factorize(B)
BunchKaufman{Float64,Array{Float64,2}}
D factor:
3×3 Tridiagonal{Float64,Array{Float64,1}}:
 -1.64286   0.0   ⋅
  0.0      -2.8  0.0
   ⋅        0.0  5.0
U factor:
3×3 UnitUpperTriangular{Float64,Array{Float64,2}}:
 1.0  0.142857  -0.8
  ⋅   1.0       -0.6
  ⋅    ⋅         1.0
permutation:
3-element Array{Int64,1}:
 1
 2
 3
```

在这里，Julia 能够发现 `B` 确实是对称矩阵，并且使用一种更适当的分解。针对一个具有某些属性的矩阵，比如一个对称或三对角矩阵，往往有可能写出更高效的代码。Julia 提供了一些特殊的类型好让你可以根据矩阵所具有的属性「标记」它们。例如：

```jldoctest
julia> B = [1.5 2 -4; 2 -1 -3; -4 -3 5]
3×3 Array{Float64,2}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0

julia> sB = Symmetric(B)
3×3 Symmetric{Float64,Array{Float64,2}}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0
```

`sB` 已经被标记成（实）对称矩阵，所以对于之后可能在它上面执行的操作，例如特征因子化或矩阵-向量乘积，只引用矩阵的一半可以提高效率。举个例子：

```jldoctest
julia> B = [1.5 2 -4; 2 -1 -3; -4 -3 5]
3×3 Array{Float64,2}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0

julia> sB = Symmetric(B)
3×3 Symmetric{Float64,Array{Float64,2}}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0

julia> x = [1; 2; 3]
3-element Array{Int64,1}:
 1
 2
 3

julia> sB\x
3-element Array{Float64,1}:
 -1.7391304347826084
 -1.1086956521739126
 -1.4565217391304346
```
`\` 操作在这里执行线性求解。左除运算符相当强大，很容易写出紧凑、可读的代码，它足够灵活，可以求解各种线性方程组。

## Special matrices

[具有特殊对称性和结构的矩阵](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=3274)经常在线性代数中出现并且与各种矩阵分解相关。Julia 具有丰富的特殊矩阵类型，可以快速计算专门为特定矩阵类型开发的专用例程。

下表总结了在 Julia 中已经实现的特殊矩阵类型，以及为它们提供各种优化方法的钩子在 LAPACK 中是否可用。

| 类型                      | 描述                                                                      |
|:------------------------- |:-------------------------------------------------------------------------------- |
| [`Symmetric`](@ref)       | [对称矩阵](https://en.wikipedia.org/wiki/Symmetric_matrix)               |
| [`Hermitian`](@ref)       | [埃尔米特矩阵](https://en.wikipedia.org/wiki/Hermitian_matrix)               |
| [`UpperTriangular`](@ref) | 上[三角矩阵](https://en.wikipedia.org/wiki/Triangular_matrix)       |
| [`LowerTriangular`](@ref) | 下[三角矩阵](https://en.wikipedia.org/wiki/Triangular_matrix)       |
| [`Tridiagonal`](@ref)     | [三对角矩阵](https://en.wikipedia.org/wiki/Tridiagonal_matrix)           |
| [`SymTridiagonal`](@ref)  | 对称三对角矩阵                                                     |
| [`Bidiagonal`](@ref)      | 上/下[双对角矩阵](https://en.wikipedia.org/wiki/Bidiagonal_matrix) |
| [`Diagonal`](@ref)        | [对角矩阵](https://en.wikipedia.org/wiki/Diagonal_matrix)                 |
| [`UniformScaling`](@ref)  | [等比缩放运算符](https://en.wikipedia.org/wiki/Uniform_scaling)        |

### Elementary operations

| 矩阵类型               | `+` | `-` | `*` | `\` | 其它具有优化方法的函数                      |
|:------------------------- |:--- |:--- |:--- |:--- |:----------------------------------------------------------- |
| [`Symmetric`](@ref)       |     |     |     | MV  | [`inv`](@ref), [`sqrt`](@ref), [`exp`](@ref)                |
| [`Hermitian`](@ref)       |     |     |     | MV  | [`inv`](@ref), [`sqrt`](@ref), [`exp`](@ref)                |
| [`UpperTriangular`](@ref) |     |     | MV  | MV  | [`inv`](@ref), [`det`](@ref)                                |
| [`LowerTriangular`](@ref) |     |     | MV  | MV  | [`inv`](@ref), [`det`](@ref)                                |
| [`SymTridiagonal`](@ref)  | M   | M   | MS  | MV  | [`eigmax`](@ref), [`eigmin`](@ref)                          |
| [`Tridiagonal`](@ref)     | M   | M   | MS  | MV  |                                                             |
| [`Bidiagonal`](@ref)      | M   | M   | MS  | MV  |                                                             |
| [`Diagonal`](@ref)        | M   | M   | MV  | MV  | [`inv`](@ref), [`det`](@ref), [`logdet`](@ref), [`/`](@ref) |
| [`UniformScaling`](@ref)  | M   | M   | MVS | MVS | [`/`](@ref)                                                 |

图例：

| 键        | 描述                                                   |
|:---------- |:------------------------------------------------------------- |
| M (matrix) | 针对矩阵-矩阵操作的优化方法可用 |
| V (vector) | 针对矩阵-向量操作的优化方法可用 |
| S (scalar) | 针对矩阵-标量操作的优化方法可用 |

### Matrix factorizations

| 矩阵类型               | LAPACK | [`eigen`](@ref) | [`eigvals`](@ref) | [`eigvecs`](@ref) | [`svd`](@ref) | [`svdvals`](@ref) |
|:------------------------- |:------ |:------------- |:----------------- |:----------------- |:------------- |:----------------- |
| [`Symmetric`](@ref)       | SY     |               | ARI               |                   |               |                   |
| [`Hermitian`](@ref)       | HE     |               | ARI               |                   |               |                   |
| [`UpperTriangular`](@ref) | TR     | A             | A                 | A                 |               |                   |
| [`LowerTriangular`](@ref) | TR     | A             | A                 | A                 |               |                   |
| [`SymTridiagonal`](@ref)  | ST     | A             | ARI               | AV                |               |                   |
| [`Tridiagonal`](@ref)     | GT     |               |                   |                   |               |                   |
| [`Bidiagonal`](@ref)      | BD     |               |                   |                   | A             | A                 |
| [`Diagonal`](@ref)        | DI     |               | A                 |                   |               |                   |

图例：

| 键          | 描述                                                                                                                     | 例子              |
|:------------ |:------------------------------------------------------------------------------------------------------------------------------- |:-------------------- |
| A (all)      | 找到所有特征值和/或特征向量的优化方法可用                                           | 例如，`eigvals(M)`    |
| R (range)    | 通过第 `ih` 个特征值寻找第 `il` 个特征值的优化方法可用                                   | `eigvals(M, il, ih)` |
| I (interval) | 寻找在区间 [`vl`, `vh`] 内的特征值的优化方法可用                                 | `eigvals(M, vl, vh)` |
| V (vectors)  | 寻找对应于特征值 `x=[x1, x2,...]` 的特征向量的优化方法可用 | `eigvecs(M, x)`      |

### The uniform scaling operator

[`UniformScaling`](@ref) 运算符代表一个标量乘以恒同运算符，`λ*I`。恒同运算符 `I` 定义为常量和 `UniformScaling` 的实例。这些运算符是通用的，并且会在二元运算符 [`+`](@ref)，[`-`](@ref)，[`*`](@ref) 和 [`\`](@ref) 中与另一个矩阵相匹配。对于 `A+I` 和 `A-I` ，这意味着 `A` 必须是个方阵。与恒同运算符 `I` 相乘是一个空操作（除了检查比例因子是一），因此几乎没有开销。

查看 `UniformScaling` 运算符的操作：

```jldoctest
julia> U = UniformScaling(2);

julia> a = [1 2; 3 4]
2×2 Array{Int64,2}:
 1  2
 3  4

julia> a + U
2×2 Array{Int64,2}:
 3  2
 3  6

julia> a * U
2×2 Array{Int64,2}:
 2  4
 6  8

julia> [a U]
2×4 Array{Int64,2}:
 1  2  2  0
 3  4  0  2

julia> b = [1 2 3; 4 5 6]
2×3 Array{Int64,2}:
 1  2  3
 4  5  6

julia> b - U
ERROR: DimensionMismatch("matrix is not square: dimensions are (2, 3)")
Stacktrace:
[...]
```

## [Matrix factorizations](@id man-linalg-factorizations)

[矩阵分解](https://en.wikipedia.org/wiki/Matrix_decomposition)将矩阵分解成矩阵乘积，是线性代数的中心概念。

下表总结了在 Julia 中已经实现了的矩阵分解的类型。其相关方法的细节可以在线性代数文档中的 [Standard Functions](@ref) 这一节中找到。

| 类型              | 描述                                                                                                    |
|:----------------- |:-------------------------------------------------------------------------------------------------------------- |
| `Cholesky`        | [Cholesky 分解](https://en.wikipedia.org/wiki/Cholesky_decomposition)                                 |
| `CholeskyPivoted` | [Pivoted](https://en.wikipedia.org/wiki/Pivot_element) Cholesky 分解                                  |
| `LU`              | [LU 分解](https://en.wikipedia.org/wiki/LU_decomposition)                                             |
| `LUTridiagonal`   | 针对 [`Tridiagonal`](@ref) 矩阵的 LU 分解                                                            |
| `QR`              | [QR 分解](https://en.wikipedia.org/wiki/QR_decomposition)                                             |
| `QRCompactWY`     | QR 分解的紧凑 WY 形式                                                                        |
| `QRPivoted`       | Pivoted [QR 分解](https://en.wikipedia.org/wiki/QR_decomposition)                                     |
| `Hessenberg`      | [Hessenberg 分解](http://mathworld.wolfram.com/HessenbergDecomposition.html)                          |
| `Eigen`           | [谱分解](https://en.wikipedia.org/wiki/Eigendecomposition_(matrix))                            |
| `SVD`             | [奇异值分解](https://en.wikipedia.org/wiki/Singular_value_decomposition)                     |
| `GeneralizedSVD`  | [广义 SVD](https://en.wikipedia.org/wiki/Generalized_singular_value_decomposition#Higher_order_version) |




## Standard Functions

Julia 中的线性代数函数主要通过调用 [LAPACK](http://www.netlib.org/lapack/) 中的函数来实现。稀疏分解则调用 [SuiteSparse](http://faculty.cse.tamu.edu/davis/suitesparse.html) 中的函数。

```@docs
Base.:*(::AbstractMatrix, ::AbstractMatrix)
Base.:\(::AbstractMatrix, ::AbstractVecOrMat)
LinearAlgebra.dot
LinearAlgebra.cross
LinearAlgebra.factorize
LinearAlgebra.Diagonal
LinearAlgebra.Bidiagonal
LinearAlgebra.SymTridiagonal
LinearAlgebra.Tridiagonal
LinearAlgebra.Symmetric
LinearAlgebra.Hermitian
LinearAlgebra.LowerTriangular
LinearAlgebra.UpperTriangular
LinearAlgebra.UniformScaling
LinearAlgebra.lu
LinearAlgebra.lu!
LinearAlgebra.cholesky
LinearAlgebra.cholesky!
LinearAlgebra.lowrankupdate
LinearAlgebra.lowrankdowndate
LinearAlgebra.lowrankupdate!
LinearAlgebra.lowrankdowndate!
LinearAlgebra.ldlt
LinearAlgebra.ldlt!
LinearAlgebra.qr
LinearAlgebra.qr!
LinearAlgebra.QR
LinearAlgebra.QRCompactWY
LinearAlgebra.QRPivoted
LinearAlgebra.lq!
LinearAlgebra.lq
LinearAlgebra.bunchkaufman
LinearAlgebra.bunchkaufman!
LinearAlgebra.eigvals
LinearAlgebra.eigvals!
LinearAlgebra.eigmax
LinearAlgebra.eigmin
LinearAlgebra.eigvecs
LinearAlgebra.eigen
LinearAlgebra.eigen!
LinearAlgebra.hessenberg
LinearAlgebra.hessenberg!
LinearAlgebra.schur!
LinearAlgebra.schur
LinearAlgebra.ordschur
LinearAlgebra.ordschur!
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
LinearAlgebra.exp(::StridedMatrix{<:LinearAlgebra.BlasFloat})
LinearAlgebra.log(::StridedMatrix)
LinearAlgebra.sqrt(::StridedMatrix{<:Real})
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
Base.adjoint
LinearAlgebra.adjoint!
Base.copy(::Union{Transpose,Adjoint})
LinearAlgebra.stride1
LinearAlgebra.checksquare
```

## Low-level matrix operations

在许多情况下，矩阵操作存在 in-place 版本，这允许你使用预先分配的输出向量或矩阵。在优化关键代码是这很实用，可以避免重复分配的开销。根据 Julia 的通常惯例，这些 in-place 操作后面带有 `!`（例如，`mul!`）。

```@docs
LinearAlgebra.mul!
LinearAlgebra.lmul!
LinearAlgebra.rmul!
LinearAlgebra.ldiv!
LinearAlgebra.rdiv!
```

## BLAS Functions

在 Julia 中（就像许多科学计算一样），密集线性代数操作是基于 [LAPACK 库](http://www.netlib.org/lapack/)，它反过来建立在被称为 [BLAS](http://www.netlib.org/blas/) 的基本线性代数构建模块之上。高度优化的 BLAS 实现在每个计算机架构上可用，并且有时在高性能线性代数例程中直接调用 BLAS 函数很有用。

`LinearAlgebra.BLAS` 提供了一些 BLAS 函数的封装。那些改写了某个输入数组的 BLAS 函数的名称以 `'!'` 结尾。通常，一个 BLAS 函数定义了四个方法，分别针对 [`Float64`](@ref)，[`Float32`](@ref)，`ComplexF64` 和 `ComplexF32` 数组。

### [BLAS Character Arguments](@id stdlib-blas-chars)
许多 BLAS 函数接受的参数可以决定是否转置某个参数的（`trans`），要引用矩阵的哪一个三角（`uplo` 或 `ul`），是否可以假设三角矩阵的对角线上全为一（`dA`），或者输入参数属于矩阵乘法中的哪一边（`side`）。可能是：

#### [Multplication Order](@id stdlib-blas-side)
| `side` | 含义                                                             |
|:-------|:--------------------------------------------------------------------|
| `'L'`  | 参数位于矩阵-矩阵操作的*左*边。  |
| `'R'`  | 参数位于矩阵-矩阵操作的*右*边。 |

#### [Triangle Referencing](@id stdlib-blas-uplo)
| `uplo`/`ul` | 含义                                               |
|:------------|:------------------------------------------------------|
| `'U'`       | 只会使用矩阵的*上*三角部分。 |
| `'L'`       | 只会使用矩阵的*下*三角部分。 |

#### [Transposition Operation](@id stdlib-blas-trans)
| `trans`/`tX` | 含义                                                 |
|:-------------|:--------------------------------------------------------|
| `'N'`        | 输入矩阵 `X` 不被转置或共轭。   |
| `'T'`        | 输入矩阵 `X` 会被转置。                |
| `'C'`        | 输入矩阵 `X` 会被共轭转置。 |

#### [Unit Diagonal](@id stdlib-blas-diag)
| `diag`/`dX` | 含义                                                   |
|:------------|:----------------------------------------------------------|
| `'N'`       | 矩阵 `X` 对角线上的值会被读取。       |
| `'U'`       | 矩阵 `X` 对角线上假设全为一。 |

```@docs
LinearAlgebra.BLAS
LinearAlgebra.BLAS.dotu
LinearAlgebra.BLAS.dotc
LinearAlgebra.BLAS.blascopy!
LinearAlgebra.BLAS.nrm2
LinearAlgebra.BLAS.asum
LinearAlgebra.axpy!
LinearAlgebra.BLAS.scal!
LinearAlgebra.BLAS.scal
LinearAlgebra.BLAS.ger!
LinearAlgebra.BLAS.syr!
LinearAlgebra.BLAS.syrk!
LinearAlgebra.BLAS.syrk
LinearAlgebra.BLAS.her!
LinearAlgebra.BLAS.herk!
LinearAlgebra.BLAS.herk
LinearAlgebra.BLAS.gbmv!
LinearAlgebra.BLAS.gbmv
LinearAlgebra.BLAS.sbmv!
LinearAlgebra.BLAS.sbmv(::Any, ::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.sbmv(::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.gemm!
LinearAlgebra.BLAS.gemm(::Any, ::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.gemm(::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.gemv!
LinearAlgebra.BLAS.gemv(::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.gemv(::Any, ::Any, ::Any)
LinearAlgebra.BLAS.symm!
LinearAlgebra.BLAS.symm(::Any, ::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.symm(::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.symv!
LinearAlgebra.BLAS.symv(::Any, ::Any, ::Any, ::Any)
LinearAlgebra.BLAS.symv(::Any, ::Any, ::Any)
LinearAlgebra.BLAS.trmm!
LinearAlgebra.BLAS.trmm
LinearAlgebra.BLAS.trsm!
LinearAlgebra.BLAS.trsm
LinearAlgebra.BLAS.trmv!
LinearAlgebra.BLAS.trmv
LinearAlgebra.BLAS.trsv!
LinearAlgebra.BLAS.trsv
LinearAlgebra.BLAS.set_num_threads
LinearAlgebra.I
```

## LAPACK Functions

`LinearAlgebra.LAPACK` 提供了一些针对线性代数的 LAPACK 函数的封装。那些改写了输入数组的函数的名称以 `'!'` 结尾。

一个函数通常定义了 4 个方法，分别针对 [`Float64`](@ref)，[`Float32`](@ref)，`ComplexF64` 和 `ComplexF32` 数组。

请注意，由 Julia 提供的 LAPACK API 可以并且将来会改变。因此，这个 API 不是面向用户的，也没有承诺在将来的版本中支持/弃用这个特殊的函数集。

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
LinearAlgebra.LAPACK.sygvd!
LinearAlgebra.LAPACK.bdsqr!
LinearAlgebra.LAPACK.bdsdc!
LinearAlgebra.LAPACK.gecon!
LinearAlgebra.LAPACK.gehrd!
LinearAlgebra.LAPACK.orghr!
LinearAlgebra.LAPACK.gees!
LinearAlgebra.LAPACK.gges!
LinearAlgebra.LAPACK.trexc!
LinearAlgebra.LAPACK.trsen!
LinearAlgebra.LAPACK.tgsen!
LinearAlgebra.LAPACK.trsyl!
```

```@meta
DocTestSetup = nothing
```
