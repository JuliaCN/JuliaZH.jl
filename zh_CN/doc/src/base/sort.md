# 排序及相关函数

Julia 拥有广泛而灵活的应用程序接口，可用于对已排序的数组值进行排序和交互。
默认情况下，Julia 会选择合理的算法并按升序排序：

```jldoctest
julia> sort([2,3,1])
3-element Vector{Int64}:
 1
 2
 3
```

或者指定使用逆序：

```jldoctest
julia> sort([2,3,1], rev=true)
3-element Vector{Int64}:
 3
 2
 1
```

`sort` 构造一个已排序的副本，保持输入不变。
使用排序函数的"感叹号"版本来修改现有数组：

```jldoctest
julia> a = [2,3,1];

julia> sort!(a);

julia> a
3-element Vector{Int64}:
 1
 2
 3
```

除了直接对数组进行排序，你还可以计算一个数组索引的置换，使数组按排序顺序排列：

```julia-repl
julia> v = randn(5)
5-element Array{Float64,1}:
  0.297288
  0.382396
 -0.597634
 -0.0104452
 -0.839027

julia> p = sortperm(v)
5-element Array{Int64,1}:
 5
 3
 4
 1
 2

julia> v[p]
5-element Array{Float64,1}:
 -0.839027
 -0.597634
 -0.0104452
  0.297288
  0.382396
```

数组可以根据其值的任意转换进行排序：

```julia-repl
julia> sort(v, by=abs)
5-element Array{Float64,1}:
 -0.0104452
  0.297288
  0.382396
 -0.597634
 -0.839027
```

或者指定使用逆序：

```julia-repl
julia> sort(v, by=abs, rev=true)
5-element Array{Float64,1}:
 -0.839027
 -0.597634
  0.382396
  0.297288
 -0.0104452
```

如有必要，可以选择排序算法：

```julia-repl
julia> sort(v, alg=InsertionSort)
5-element Array{Float64,1}:
 -0.839027
 -0.597634
 -0.0104452
  0.297288
  0.382396
```

所有排序和顺序相关的函数都依赖于一个"小于"关系，该关系在要操作的值上定义了一个
[严格弱序](https://en.wikipedia.org/wiki/Weak_ordering#Strict_weak_orderings)。
默认调用 `isless` 函数，但可以通过 `lt` 关键字指定关系，这是一个接受两个数组元素的函数，
当且仅当第一个参数"小于"第二个参数时返回 `true`。
更多信息请参见 [`sort!`](@ref) 和 [替代排序](@ref)。

## 排序函数

```@docs
Base.sort!
Base.sort
Base.sortperm
Base.InsertionSort
Base.MergeSort
Base.QuickSort
Base.PartialQuickSort
Base.Sort.sortperm!
Base.Sort.sortslices
```

## 排列顺序相关的函数

```@docs
Base.issorted
Base.Sort.searchsorted
Base.Sort.searchsortedfirst
Base.Sort.searchsortedlast
Base.Sort.insorted
Base.Sort.partialsort!
Base.Sort.partialsort
Base.Sort.partialsortperm
Base.Sort.partialsortperm!
```

## 排序算法

基础 Julia 中目前有四种公开可用的排序算法：

  * [`InsertionSort`](@ref)
  * [`QuickSort`](@ref)
  * [`PartialQuickSort(k)`](@ref)
  * [`MergeSort`](@ref)

默认情况下，`sort` 系列函数使用稳定的排序算法，这些算法在大多数输入上都很快。
具体的算法选择是实现细节，以便于未来的性能改进。

目前，基于输入类型、大小和组成，使用了 `RadixSort`、`ScratchQuickSort`、`InsertionSort`
和 `CountingSort` 的混合算法。
实现细节可能会发生变化，但目前可以在 `??Base.DEFAULT_STABLE`
的扩展帮助和其中列出的内部排序算法的文档字符串中找到。

你可以使用 `alg` 关键字显式指定你偏好的算法（例如 `sort!(v, alg=PartialQuickSort(10:20))`），
或者通过向 `Base.Sort.defalg` 函数添加专门的方法来重新配置自定义类型的默认排序算法。
例如，[InlineStrings.jl](https://github.com/JuliaStrings/InlineStrings.jl/blob/v1.3.2/src/InlineStrings.jl#L903)
定义了以下方法：

```julia
Base.Sort.defalg(::AbstractArray{<:Union{SmallInlineStrings, Missing}}) = InlineStringSort
```

!!! compat "Julia 1.9"
    默认排序算法（由 `Base.Sort.defalg` 返回）自 Julia 1.9 起保证是稳定的。
    之前的版本在排序数值数组时有不稳定的边缘情况。

## 替代排序

默认情况下，`sort`、`searchsorted` 和相关函数使用 [`isless`](@ref) 来比较两个元素，以确定哪个应该排在前面。
[`Base.Order.Ordering`](@ref) 抽象类型提供了一种机制，用于在相同的元素集上定义替代排序：
当调用像 `sort!` 这样的排序函数时，可以通过关键字参数 `order` 提供一个 `Ordering` 实例。

`Ordering` 的实例通过 [`Base.Order.lt`](@ref) 函数定义排序，该函数作为 `isless` 的泛化。
这个函数在自定义 `Ordering` 上的行为必须满足
[严格弱序](https://en.wikipedia.org/wiki/Weak_ordering#Strict_weak_orderings)
的所有条件。
有关有效和无效 `lt` 函数的详细信息和示例，请参见 [`sort!`](@ref)。

```@docs
Base.Order.Ordering
Base.Order.lt
Base.Order.ord
Base.Order.Forward
Base.Order.ReverseOrdering
Base.Order.Reverse
Base.Order.By
Base.Order.Lt
Base.Order.Perm
```
