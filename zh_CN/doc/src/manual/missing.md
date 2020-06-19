# [缺失值](@id missing)

Julia 支持表示统计意义上的缺失值，即某个变量在观察中没有可用值，但在理论上存在有效值的情况。缺失值由 [`missing`](@ref) 对象表示，该对象是 [`Missing`](@ref) 类型的唯一实例。`missing` 等价于 [SQL 中的 `NULL`](https://en.wikipedia.org/wiki/NULL_(SQL)) 以及 [R 中的 `NA`](https://cran.r-project.org/doc/manuals/r-release/R-lang.html#NA-handling)，并在大多数情况下表现得与它们一样。

## 缺失值的传播

`missing` values *propagate* automatically when passed to standard mathematical
operators and functions.
For these functions, uncertainty about the value of one of the operands
induces uncertainty about the result. In practice, this means a math operation
involving a `missing` value generally returns `missing`
```jldoctest
julia> missing + 1
missing

julia> "a" * missing
missing

julia> abs(missing)
missing
```

As `missing` is a normal Julia object, this propagation rule only works
for functions which have opted in to implement this behavior. This can be
achieved either via a specific method defined for arguments of type `Missing`,
or simply by accepting arguments of this type, and passing them to functions
which propagate them (like standard math operators). Packages should consider
whether it makes sense to propagate missing values when defining new functions,
and define methods appropriately if that is the case. Passing a `missing` value
to a function for which no method accepting arguments of type `Missing` is defined
throws a [`MethodError`](@ref), just like for any other type.

Functions that do not propagate `missing` values can be made to do so by wrapping
them in the `passmissing` function provided by the
[Missings.jl](https://github.com/JuliaData/Missings.jl) package.
For example, `f(x)` becomes `passmissing(f)(x)`.

## 相等和比较运算符

标准相等和比较运算符遵循上面给出的传播规则：如果任何操作数是 `missing`，那么结果是 `missing`。这是一些例子
```jldoctest
julia> missing == 1
missing

julia> missing == missing
missing

julia> missing < 1
missing

julia> 2 >= missing
missing
```

特别要注意，`missing == missing` 返回 `missing`，所以 `==` 不能用于测试值是否为缺失值。要测试 `x` 是否为 `missing`，请用 [`ismissing(x)`](@ref)。

特殊的比较运算符 [`isequal`](@ref) 和 [`===`](@ref) 是传播规则的例外：它们总返回一个 `Bool` 值，即使存在 `missing` 值，并认为 `missing` 与 `missing` 相等且其与任何其它值不同。因此，它们可用于测试某个值是否为 `missing`。
```jldoctest
julia> missing === 1
false

julia> isequal(missing, 1)
false

julia> missing === missing
true

julia> isequal(missing, missing)
true
```

[`isless`](@ref) 运算符是另一个例外：`missing` 被认为比任何其它值大。此运算符被用于 [`sort`](@ref)，因此 `missing` 值被放置在所有其它值之后。
```jldoctest
julia> isless(1, missing)
true

julia> isless(missing, Inf)
false

julia> isless(missing, missing)
false
```

## 逻辑运算符

逻辑（或布尔）运算符 [`|`](@ref)、[`&`](@ref) 和 [`xor`](@ref) 是另一种特殊情况，因为它们只有在逻辑上是必需的时传递 `missing` 值。对于这些运算符来说，结果是否不确定取决于具体操作，其遵循[*三值逻辑*](https://en.wikipedia.org/wiki/Three-valued_logic)的既定规则，这些规则也由 SQL 中的 `NULL` 以及 R 中的 `NA` 实现。这个抽象的定义实际上对应于一系列相对自然的行为，这最好通过具体的例子来解释。

让我们用逻辑「或」运算符 [`|`](@ref) 来说明这个原理。按照布尔逻辑的规则，如果其中一个操作数是 `true`，则另一个操作数对结果没影响，结果总是 `true`。
```jldoctest
julia> true | true
true

julia> true | false
true

julia> false | true
true
```

基于观察，我们可以得出结论，如果其中一个操作数是 `true` 而另一个是 `missing`，我们知道结果为 `true`，尽管另一个参数的实际值存在不确定性。如果我们能观察到第二个操作数的实际值，那么它只能是 `true` 或 `false`，在两种情况下结果都是 `true`。因此，在这种特殊情况下，值的缺失不会传播
```jldoctest
julia> true | missing
true

julia> missing | true
true
```

相反地，如果其中一个操作数是 `false`，结果可能是 `true` 或 `false`，这取决于另一个操作数的值。因此，如果一个操作数是 `missing`，那么结果也是 `missing`。
```jldoctest
julia> false | true
true

julia> true | false
true

julia> false | false
false

julia> false | missing
missing

julia> missing | false
missing
```

逻辑「且」运算符 [`&`](@ref) 的行为与 `|` 运算符相似，区别在于当其中一个操作数为 `false` 时，值的缺失不会传播。例如，当第一个操作数是 `false` 时
```jldoctest
julia> false & false
false

julia> false & true
false

julia> false & missing
false
```

另一方面，当其中一个操作数为 `true` 时，值的缺失会传播，例如，当第一个操作数是 `true` 时
```jldoctest
julia> true & true
true

julia> true & false
false

julia> true & missing
missing
```

最后，逻辑「异或」运算符 [`xor`](@ref) 总传播 `missing` 值，因为两个操作数都总是对结果产生影响。还要注意，否定运算符 [`!`](@ref) 在操作数是 `missing` 时返回 `missing`，这就像其它一元运算符。

## 流程控制和短路运算符

流程控制操作符，包括 [`if`](@ref)、[`while`](@ref) 和[三元运算符](@ref man-conditional-evaluation) `x ? y : z`，不允许缺失值。这是因为如果我们能够观察实际值，它是 `true` 还是 `false` 是不确定的，这意味着我们不知道程序应该如何运行。一旦在以下上下文中遇到 `missing` 值，就会抛出 [`TypeError`](@ref)
```jldoctest
julia> if missing
           println("here")
       end
ERROR: TypeError: non-boolean (Missing) used in boolean context
```

出于同样的原因，并与上面给出的逻辑运算符相反，短路布尔运算符 [`&&`](@ref) 和 [`||`](@ref) 在当前操作数的值决定下一个操作数是否求值时不允许 `missing` 值。例如
```jldoctest
julia> missing || false
ERROR: TypeError: non-boolean (Missing) used in boolean context

julia> missing && false
ERROR: TypeError: non-boolean (Missing) used in boolean context

julia> true && missing && false
ERROR: TypeError: non-boolean (Missing) used in boolean context
```

另一方面，如果无需 `missing` 值即可确定结果，则不会引发错误。代码在对 `missing` 操作数求值前短路，以及 `missing` 是最后一个操作数都是这种情况。
```jldoctest
julia> true && missing
missing

julia> false && missing
false
```

## 包含缺失值的数组

包含缺失值的数组的创建就像其它数组
```jldoctest
julia> [1, missing]
2-element Array{Union{Missing, Int64},1}:
 1
  missing
```

如此示例所示，此类数组的元素类型为 `Union{Missing, T}`，其中 `T` 为非缺失值的类型。这简单地反映了以下事实：数组条目可以具有类型 `T`（在这是 `Int64`）或类型 `Missing`。此类数组使用高效的内存存储，其等价于一个 `Array{T}` 组合一个 `Array{UInt8}`，前者保存实际值，后者表示条目类型（即它是 `Missing` 还是 `T`）。

允许缺失值的数组可以使用标准语法构造。使用 `Array{Union{Missing, T}}(missing, dims)` 来创建填充缺失值的数组：
```jldoctest
julia> Array{Union{Missing, String}}(missing, 2, 3)
2×3 Array{Union{Missing, String},2}:
 missing  missing  missing
 missing  missing  missing
```

允许但不包含 `missing` 值的数组可使用 [`convert`](@ref) 转换回不允许缺失值的数组。如果该数组包含 `missing` 值，在类型转换时会抛出 `MethodError`
```jldoctest
julia> x = Union{Missing, String}["a", "b"]
2-element Array{Union{Missing, String},1}:
 "a"
 "b"

julia> convert(Array{String}, x)
2-element Array{String,1}:
 "a"
 "b"

julia> y = Union{Missing, String}[missing, "b"]
2-element Array{Union{Missing, String},1}:
 missing
 "b"

julia> convert(Array{String}, y)
ERROR: MethodError: Cannot `convert` an object of type Missing to an object of type String
```
## 跳过缺失值

由于 `missing` 会随着标准数学运算符传播，归约函数会在调用的数组包含缺失值时返回 `missing`
```jldoctest
julia> sum([1, missing])
missing
```

在这种情况下，使用 [`skipmissing`](@ref) 即可跳过缺失值
```jldoctest
julia> sum(skipmissing([1, missing]))
1
```

This convenience function returns an iterator which filters out `missing` values
efficiently. It can therefore be used with any function which supports iterators
```jldoctest skipmissing; setup = :(using Statistics)
julia> x = skipmissing([3, missing, 2, 1])
skipmissing(Union{Missing, Int64}[3, missing, 2, 1])

julia> maximum(x)
3

julia> mean(x)
2.0

julia> mapreduce(sqrt, +, x)
4.146264369941973
```

Objects created by calling `skipmissing` on an array can be indexed using indices
from the parent array. Indices corresponding to missing values are not valid for
these objects and an error is thrown when trying to use them (they are also skipped
by `keys` and `eachindex`)
```jldoctest skipmissing
julia> x[1]
3

julia> x[2]
ERROR: MissingException: the value at index (2,) is missing
[...]
```

This allows functions which operate on indices to work in combination with `skipmissing`.
This is notably the case for search and find functions, which return indices
valid for the object returned by `skipmissing` which are also the indices of the
matching entries *in the parent array*
```jldoctest skipmissing
julia> findall(==(1), x)
1-element Array{Int64,1}:
 4

julia> findfirst(!iszero, x)
1

julia> argmax(x)
1
```

Use [`collect`](@ref) to extract non-`missing` values and store them in an array
```jldoctest skipmissing
julia> collect(x)
3-element Array{Int64,1}:
 3
 2
 1
```

## 数组上的逻辑运算

上面描述的逻辑运算符的三值逻辑也适用于针对数组的函数。因此，使用 [`==`](@ref) 运算符的数组相等性测试中，若在未知 `missing` 条目实际值时无法确定结果，就返回 `missing`。在实际应用中意味着，在待比较数组中所有非缺失值都相等，且某个或全部数组包含缺失值（也许在不同位置）时会返回 `missing`。
```jldoctest
julia> [1, missing] == [2, missing]
false

julia> [1, missing] == [1, missing]
missing

julia> [1, 2, missing] == [1, missing, 2]
missing
```

对于单个值，[`isequal`](@ref) 会将 `missing` 值视为与其它 `missing` 值相等但与非缺失值不同。
```jldoctest
julia> isequal([1, missing], [1, missing])
true

julia> isequal([1, 2, missing], [1, missing, 2])
false
```

函数 [`any`](@ref) 和 [`all`](@ref) 遵循三值逻辑的规则，会在结果无法被确定时返回 `missing`。
```jldoctest
julia> all([true, missing])
missing

julia> all([false, missing])
false

julia> any([true, missing])
true

julia> any([false, missing])
missing
```
