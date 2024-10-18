# 边界检查

和许多其他现代编程语言一样，Julia 在访问数组元素的时候也要通过边界检查来确保程序安全。当循环次数很多，或者在其他性能敏感的场景下，你可能希望不进行边界检查以提高运行时性能。比如要使用矢量 (SIMD) 指令，循环体就不能有分支语句，因此无法进行边界检查。Julia 提供了一个宏 `@inbounds(...)` 来告诉编译器在指定语句块不进行边界检查。用户自定义的数组类型可以通过宏 `@boundscheck(...)` 来达到上下文敏感的代码选择目的。

## 移除边界检查

宏 `@boundscheck(...)` 把代码块标记为要执行边界检查。但当这些代码块被被宏 `@inbounds(...)` 标记的代码包裹时，它们可能会被编译器移除。仅当`@boundscheck(...)` 代码块被调用函数包裹时，编译器会移除它们。比如你可能这样写的 `sum` 方法： 

```julia
function sum(A::AbstractArray)
    r = zero(eltype(A))
    for i in eachindex(A)
        @inbounds r += A[i]
    end
    return r
end
```

使用自定义的类数组类型 `MyArray`，我们有：

```julia
@inline getindex(A::MyArray, i::Real) = (@boundscheck checkbounds(A, i); A.data[to_index(i)])
```

当 `getindex` 内联到 `sum` 时，对 `checkbounds(A, i)` 的调用将被忽略。
如果函数包含多层内联，那么只有最深一层内联的 `@boundscheck` 块才会被忽略。
该规则可防止堆栈上层的代码对程序行为造成意外改变。

### Caution!

It is easy to accidentally expose unsafe operations with `@inbounds`. You might be tempted
to write the above example as

```julia
function sum(A::AbstractArray)
    r = zero(eltype(A))
    for i in 1:length(A)
        @inbounds r += A[i]
    end
    return r
end
```

Which quietly assumes 1-based indexing and therefore exposes unsafe memory access when used
with [`OffsetArrays`](@ref man-custom-indices):

```julia-repl
julia> using OffsetArrays

julia> sum(OffsetArray([1, 2, 3], -10))
9164911648 # inconsistent results or segfault
```

While the original source of the error here is `1:length(A)`, the use of `@inbounds`
increases the consequences from a bounds error to a less easily caught and debugged unsafe
memory access. It is often difficult or impossible to prove that a method which uses
`@inbounds` is safe, so one must weigh the benefits of performance improvements against the
risk of segfaults and silent misbehavior, especially in public facing APIs.

## Propagating inbounds

There may be certain scenarios where for code-organization reasons you want more than one layer
between the `@inbounds` and `@boundscheck` declarations. For instance, the default `getindex`
methods have the chain `getindex(A::AbstractArray, i::Real)` calls `getindex(IndexStyle(A), A, i)`
calls `_getindex(::IndexLinear, A, i)`.

To override the "one layer of inlining" rule, a function may be marked with
[`Base.@propagate_inbounds`](@ref) to propagate an inbounds context (or out of bounds
context) through one additional layer of inlining.

## The bounds checking call hierarchy

The overall hierarchy is:

  * `checkbounds(A, I...)` which calls

      * `checkbounds(Bool, A, I...)` which calls

          * `checkbounds_indices(Bool, axes(A), I)` which recursively calls

              * `checkindex` for each dimension

Here `A` is the array, and `I` contains the "requested" indices. `axes(A)` returns a tuple
of "permitted" indices of `A`.

`checkbounds(A, I...)` throws an error if the indices are invalid, whereas `checkbounds(Bool, A, I...)`
returns `false` in that circumstance.  `checkbounds_indices` discards any information about the
array other than its `axes` tuple, and performs a pure indices-vs-indices comparison: this
allows relatively few compiled methods to serve a huge variety of array types. Indices are specified
as tuples, and are usually compared in a 1-1 fashion with individual dimensions handled by calling
another important function, `checkindex`: typically,

```julia
checkbounds_indices(Bool, (IA1, IA...), (I1, I...)) = checkindex(Bool, IA1, I1) &
                                                      checkbounds_indices(Bool, IA, I)
```

so `checkindex` checks a single dimension.  All of these functions, including the unexported
`checkbounds_indices` have docstrings accessible with `?` .

If you have to customize bounds checking for a specific array type, you should specialize `checkbounds(Bool, A, I...)`.
However, in most cases you should be able to rely on `checkbounds_indices` as long as you supply
useful `axes` for your array type.

If you have novel index types, first consider specializing `checkindex`, which handles a single
index for a particular dimension of an array.  If you have a custom multidimensional index type
(similar to `CartesianIndex`), then you may have to consider specializing `checkbounds_indices`.

Note this hierarchy has been designed to reduce the likelihood of method ambiguities.  We try
to make `checkbounds` the place to specialize on array type, and try to avoid specializations
on index types; conversely, `checkindex` is intended to be specialized only on index type (especially,
the last argument).

## Emit bounds checks

Julia can be launched with `--check-bounds={yes|no|auto}` to emit bounds checks always, never, or respect `@inbounds` declarations.
