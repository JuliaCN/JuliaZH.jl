# 排序及相关函数

Julia 拥有为数众多的灵活的 API，用于对已经排序的值数组进行排序和交互。默认情况下，Julia 会选择合理的算法并按标准升序进行排序：

```jldoctest
julia> sort([2,3,1])
3-element Array{Int64,1}:
 1
 2
 3
```

你同样可以轻松实现逆序排序：

```jldoctest
julia> sort([2,3,1], rev=true)
3-element Array{Int64,1}:
 3
 2
 1
```

对数组进行 in-place 排序时，要使用 `!` 版的排序函数：

```jldoctest
julia> a = [2,3,1];

julia> sort!(a);

julia> a
3-element Array{Int64,1}:
 1
 2
 3
```

你可以计算用于排列的索引，而不是直接对数组进行排序：

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

数组可以根据对其值任意的转换结果来进行排序；

```julia-repl
julia> sort(v, by=abs)
5-element Array{Float64,1}:
 -0.0104452
  0.297288
  0.382396
 -0.597634
 -0.839027
```

或者通过转换来进行逆序排序

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

所有与排序和顺序相关的函数依赖于“小于”关系，该关系定义了要操纵的值的总顺序。默认情况下会调用 `isless` 函数，但可以通过 `lt` 关键字指定关系。

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
Base.Sort.partialsort!
Base.Sort.partialsort
Base.Sort.partialsortperm
Base.Sort.partialsortperm!
```

## 排序算法

目前，Julia Base 中有四种可用的排序算法：

  * [`InsertionSort`](@ref)
  * [`QuickSort`](@ref)
  * [`PartialQuickSort(k)`](@ref)
  * [`MergeSort`](@ref)

`InsertionSort` 是一个在 `QuickSort` 中使用的时间复杂度为 O(n^2) 的稳定的排序算法，它通常在 `n` 比较小的时候才具有较高的效率。

`QuickSort` 是一个内置并且非常快，但是不稳定的时间复杂度为 O(n log n）的排序算法，例如即使数组两个元素相等的，它们排序之后的顺序也可能和在原数组中顺序不一致。`QuickSort` 是内置的包括整数和浮点数在内的数字值的默认排序算法。

`PartialQuickSort(k)` 类似于 `QuickSort`，但是如果 `k` 是一个整数，输出数组只排序到索引 `k`，如果 `k` 是 `OrdinalRange`，则输出数组排在 `k` 范围内。 例如：

```julia
x = rand(1:500, 100)
k = 50
k2 = 50:100
s = sort(x; alg=QuickSort)
ps = sort(x; alg=PartialQuickSort(k))
qs = sort(x; alg=PartialQuickSort(k2))
map(issorted, (s, ps, qs))             # => (true, false, false)
map(x->issorted(x[1:k]), (s, ps, qs))  # => (true, true, false)
map(x->issorted(x[k2]), (s, ps, qs))   # => (true, false, true)
s[1:k] == ps[1:k]                      # => true
s[k2] == qs[k2]                        # => true
```

`MergeSort` 是一个时间复杂度为 O(n log n) 的稳定但是非 in-place 的算法，它需要一个大小为输入数组一般的临时数组——同时也不像 `QuickSort` 一样快。`MergeSort` 是非数值型数据的默认排序算法。

默认排序算法的选择是基于它们的快速稳定，或者 *appear* 之类的。对于数值类型，实际上选择了 `QuickSort`，因为在这种情况下，它更快，与稳定排序没有区别(除非数组以某种方式记录了突变)

Julia选择默认排序算法的机制是通过 `Base.Sort.defalg` 来实现的，其允许将特定算法注册为特定数组的所有排序函数中的默认值。例如，这有两个默认算法 [`sort.jl`](https://github.com/JuliaLang/julia/blob/master/base/sort.jl):

```julia
defalg(v::AbstractArray) = MergeSort
defalg(v::AbstractArray{<:Number}) = QuickSort
```

对于数值型数组，选择非稳定的默认排序算法的原则是稳定的排序算法没有必要的（例如：但两个值相比较时相等且不可区分时）。
