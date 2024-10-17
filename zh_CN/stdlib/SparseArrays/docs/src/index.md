# 稀疏数组

```@meta
DocTestSetup = :(using SparseArrays, LinearAlgebra)
```

Julia 在 `SparseArrays` 标准库模块中提供了对稀疏向量和[稀疏矩阵](https://en.wikipedia.org/wiki/Sparse_matrix)的支持。与稠密数组相比，包含足够多零值的稀疏数组在以特殊的数据结构存储时可以节省大量的空间和运算时间。

## [压缩稀疏列（CSC）稀疏矩阵存储](@id man-csc)

在 Julia 中，稀疏矩阵是按照[压缩稀疏列（CSC）格式](https://en.wikipedia.org/wiki/Sparse_matrix#Compressed_sparse_column_.28CSC_or_CCS.29)存储的。Julia 稀疏矩阵具有 [`SparseMatrixCSC{Tv,Ti}`](@ref) 类型，其中 `Tv` 是存储值的类型，`Ti` 是存储列指针和行索引的整型类型。`SparseMatrixCSC` 的内部表示如下所示：

```julia
struct SparseMatrixCSC{Tv,Ti<:Integer} <: AbstractSparseMatrixCSC{Tv,Ti}
    m::Int                  # Number of rows
    n::Int                  # Number of columns
    colptr::Vector{Ti}      # Column j is in colptr[j]:(colptr[j+1]-1)
    rowval::Vector{Ti}      # Row indices of stored values
    nzval::Vector{Tv}       # Stored values, typically nonzeros
end
```

压缩稀疏列存储格式使得访问稀疏矩阵的列元素非常简单快速，而访问稀疏矩阵的行会非常缓慢。在 CSC 稀疏矩阵中执行类似插入新元素的操作也会非常慢。这是由于在稀疏矩阵中插入新元素时，在插入点之后的所有元素都要向后移动一位。

All operations on sparse matrices are carefully implemented to exploit the CSC data structure
for performance, and to avoid expensive operations.

如果你有来自不同应用或库的 CSC 格式数据，并且想要将它导入 Julia，确保使用基于 1 的索引。每个列中的行索引都要是有序的。如果你的 `SparseMatrixCSC` 对象包含无序的行索引，一个快速将它们排序的方法是做一次二重转置。

In some applications, it is convenient to store explicit zero values in a `SparseMatrixCSC`. These
*are* accepted by functions in `Base` (but there is no guarantee that they will be preserved in
mutating operations). Such explicitly stored zeros are treated as structural nonzeros by many
routines. The [`nnz`](@ref) function returns the number of elements explicitly stored in the
sparse data structure, including non-structural zeros. In order to count the exact number of
numerical nonzeros, use [`count(!iszero, x)`](@ref), which inspects every stored element of a sparse
matrix. [`dropzeros`](@ref), and the in-place [`dropzeros!`](@ref), can be used to
remove stored zeros from the sparse matrix.

```jldoctest
julia> A = sparse([1, 1, 2, 3], [1, 3, 2, 3], [0, 1, 2, 0])
3×3 SparseMatrixCSC{Int64, Int64} with 4 stored entries:
 0  ⋅  1
 ⋅  2  ⋅
 ⋅  ⋅  0

julia> dropzeros(A)
3×3 SparseMatrixCSC{Int64, Int64} with 2 stored entries:
 ⋅  ⋅  1
 ⋅  2  ⋅
 ⋅  ⋅  ⋅
```

## 稀疏向量储存

Sparse vectors are stored in a close analog to compressed sparse column format for sparse
matrices. In Julia, sparse vectors have the type [`SparseVector{Tv,Ti}`](@ref) where `Tv`
is the type of the stored values and `Ti` the integer type for the indices. The internal
representation is as follows:

```julia
struct SparseVector{Tv,Ti<:Integer} <: AbstractSparseVector{Tv,Ti}
    n::Int              # Length of the sparse vector
    nzind::Vector{Ti}   # Indices of stored values
    nzval::Vector{Tv}   # Stored values, typically nonzeros
end
```

对于 [`SparseMatrixCSC`](@ref)， `SparseVector` 类型也能包含显示存储的，零值。（见 [稀疏矩阵存储](@ref man-csc)。）

## 稀疏向量与矩阵构造函数

创建一个稀疏矩阵的最简单的方法是使用一个与 Julia 提供的用来处理稠密矩阵的[`zeros`](@ref) 等价的函数。要产生一个稀疏矩阵，你可以用同样的名字加上 `sp` 前缀：

```jldoctest
julia> spzeros(3)
3-element SparseVector{Float64, Int64} with 0 stored entries
```

[`sparse`](@ref) 函数通常是一个构建稀疏矩阵的便捷方法。例如，要构建一个稀疏矩阵，我们可以输入一个列索引向量 `I`，一个行索引向量 `J`，一个储存值的向量 `V`（这也叫作 [COO（坐标） 格式](https://en.wikipedia.org/wiki/Sparse_matrix#Coordinate_list_.28COO.29)）。
然后 `sparse(I,J,V)` 创建一个满足 `S[I[k], J[k]] = V[k]` 的稀疏矩阵。等价的稀疏向量构建函数是 [`sparsevec`](@ref)，它接受（行）索引向量 `I` 和储存值的向量 `V` 并创建一个满足 `R[I[k]] = V[k]` 的向量 `R`。

```jldoctest sparse_function
julia> I = [1, 4, 3, 5]; J = [4, 7, 18, 9]; V = [1, 2, -5, 3];

julia> S = sparse(I,J,V)
5×18 SparseMatrixCSC{Int64, Int64} with 4 stored entries:
⠀⠈⠀⡀⠀⠀⠀⠀⠠
⠀⠀⠀⠀⠁⠀⠀⠀⠀

julia> R = sparsevec(I,V)
5-element SparseVector{Int64, Int64} with 4 stored entries:
  [1]  =  1
  [3]  =  -5
  [4]  =  2
  [5]  =  3
```

The inverse of the [`sparse`](@ref) and [`sparsevec`](@ref) functions is
[`findnz`](@ref), which retrieves the inputs used to create the sparse array.
[`findall(!iszero, x)`](@ref) returns the cartesian indices of non-zero entries in `x`
(including stored entries equal to zero).

```jldoctest sparse_function
julia> findnz(S)
([1, 4, 5, 3], [4, 7, 9, 18], [1, 2, 3, -5])

julia> findall(!iszero, S)
4-element Vector{CartesianIndex{2}}:
 CartesianIndex(1, 4)
 CartesianIndex(4, 7)
 CartesianIndex(5, 9)
 CartesianIndex(3, 18)

julia> findnz(R)
([1, 3, 4, 5], [1, -5, 2, 3])

julia> findall(!iszero, R)
4-element Vector{Int64}:
 1
 3
 4
 5
```

另一个创建稀疏数组的方法是使用  [`sparse`](@ref) 函数将一个稠密数组转化为稀疏数组：

```jldoctest
julia> sparse(Matrix(1.0I, 5, 5))
5×5 SparseMatrixCSC{Float64, Int64} with 5 stored entries:
 1.0   ⋅    ⋅    ⋅    ⋅
  ⋅   1.0   ⋅    ⋅    ⋅
  ⋅    ⋅   1.0   ⋅    ⋅
  ⋅    ⋅    ⋅   1.0   ⋅
  ⋅    ⋅    ⋅    ⋅   1.0

julia> sparse([1.0, 0.0, 1.0])
3-element SparseVector{Float64, Int64} with 2 stored entries:
  [1]  =  1.0
  [3]  =  1.0
```

You can go in the other direction using the [`Array`](@ref) constructor. The [`issparse`](@ref)
function can be used to query if a matrix is sparse.

```jldoctest
julia> issparse(spzeros(5))
true
```

## 稀疏矩阵的操作

Arithmetic operations on sparse matrices also work as they do on dense matrices. Indexing of,
assignment into, and concatenation of sparse matrices work in the same way as dense matrices.
Indexing operations, especially assignment, are expensive, when carried out one element at a time.
In many cases it may be better to convert the sparse matrix into `(I,J,V)` format using [`findnz`](@ref),
manipulate the values or the structure in the dense vectors `(I,J,V)`, and then reconstruct
the sparse matrix.

## Correspondence of dense and sparse methods

The following table gives a correspondence between built-in methods on sparse matrices and their
corresponding methods on dense matrix types. In general, methods that generate sparse matrices
differ from their dense counterparts in that the resulting matrix follows the same sparsity pattern
as a given sparse matrix `S`, or that the resulting sparse matrix has density `d`, i.e. each matrix
element has a probability `d` of being non-zero.

Details can be found in the [Sparse Vectors and Matrices](@ref stdlib-sparse-arrays)
section of the standard library reference.

| 构造函数                     | 密度                  | 说明                                                                                                                                                           |
|:-------------------------- |:---------------------- |:--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`spzeros(m,n)`](@ref)     | [`zeros(m,n)`](@ref)   | Creates a *m*-by-*n* matrix of zeros. ([`spzeros(m,n)`](@ref) is empty.)                                                                                              |
| [`sparse(I,n,n)`](@ref)  | [`Matrix(I,n,n)`](@ref)| Creates a *n*-by-*n* identity matrix.                                                                                                                                 |
| [`sparse(A)`](@ref)        | [`Array(S)`](@ref)   | Interconverts between dense and sparse formats.                                                                                                                       |
| [`sprand(m,n,d)`](@ref)    | [`rand(m,n)`](@ref)    | Creates a *m*-by-*n* random matrix (of density *d*) with iid non-zero elements distributed uniformly on the half-open interval ``[0, 1)``.                            |
| [`sprandn(m,n,d)`](@ref)   | [`randn(m,n)`](@ref)   | Creates a *m*-by-*n* random matrix (of density *d*) with iid non-zero elements distributed according to the standard normal (Gaussian) distribution.                  |
| [`sprandn(rng,m,n,d)`](@ref) | [`randn(rng,m,n)`](@ref) | Creates a *m*-by-*n* random matrix (of density *d*) with iid non-zero elements generated with the `rng` random number generator                                   |

# [Sparse Arrays](@id stdlib-sparse-arrays)

```@docs
SparseArrays.AbstractSparseArray
SparseArrays.AbstractSparseVector
SparseArrays.AbstractSparseMatrix
SparseArrays.SparseVector
SparseArrays.SparseMatrixCSC
SparseArrays.sparse
SparseArrays.sparsevec
SparseArrays.issparse
SparseArrays.nnz
SparseArrays.findnz
SparseArrays.spzeros
SparseArrays.spdiagm
SparseArrays.blockdiag
SparseArrays.sprand
SparseArrays.sprandn
SparseArrays.nonzeros
SparseArrays.rowvals
SparseArrays.nzrange
SparseArrays.droptol!
SparseArrays.dropzeros!
SparseArrays.dropzeros
SparseArrays.permute
permute!{Tv, Ti, Tp <: Integer, Tq <: Integer}(::SparseMatrixCSC{Tv,Ti}, ::SparseMatrixCSC{Tv,Ti}, ::AbstractArray{Tp,1}, ::AbstractArray{Tq,1})
```

```@meta
DocTestSetup = nothing
```
