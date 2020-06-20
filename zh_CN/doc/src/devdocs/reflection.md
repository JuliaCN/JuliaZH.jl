# 反射 与 自我检查

Julia 提供了多种运行时的反射功能。

## 模块绑定

由 `Module` 导出的名称可用 [`names(m::Module)`](@ref) 获得，它会返回一个元素为 [`Symbol`](@ref) 的数组来表示模块导出的绑定。不管导出状态如何，`names(m::Module, all = true)` 返回 `m` 中所有绑定的符号。

## DateType 字段

`DataType` 的所有字段名称可以使用 [`fieldnames`](@ref) 来获取。例如，对于下面给定的类型，`fieldnames(Point)` 会返回一个表示字段名称的 [`Symbol`](@ref) 元组：

```jldoctest struct_point
julia> struct Point
           x::Int
           y
       end

julia> fieldnames(Point)
(:x, :y)
```

`Point` 对象中每个字段的类型存储在 `Point` 本身的 `types` 变量中：

```jldoctest struct_point
julia> Point.types
svec(Int64, Any)
```

虽然 `x` 被注释为 `Int`，但 `y` 在类型定义里没有注释，因此 `y` 默认为 `Any` 类型。

类型本身表示为一个叫做 `DataType` 的结构：

```jldoctest struct_point
julia> typeof(Point)
DataType
```

注意 `fieldnames(DataType)` 给出了 `DataType` 本身的每个字段的名称，其中的一个字段是上面示例中提到的 `types` 字段。

## 子类型

任何 `DataType` 的*直接*子类型都可以通过使用 [`subtypes`](@ref) 来列出。
例如抽象 `DataType` [`AbstractFloat`](@ref) 有四个（具体的）子类型：

```jldoctest; setup = :(using InteractiveUtils)
julia> subtypes(AbstractFloat)
4-element Array{Any,1}:
 BigFloat
 Float16
 Float32
 Float64
```

任何抽象子类型也包括此列表中，但子类型的子类型不在其中。递归使用 [`subtypes`](@ref) 可以遍历出整个类型树。

## DataType 布局

用 C 代码接口时，`DataType` 的内部表现非常重要。有几个函数可以检查这些细节。

 [`isbits(T::DataType)`](@ref) 如果 `T` 类型是以 C 兼容的对齐方式存储，则为 true。  
 [`fieldoffset(T::DataType, i::Integer)`](@ref) 返回字段 *i* 相对于类型开始的 (字节) 偏移量。

## 函数方法

任何泛型函数的方法都可以使用 [`methods`](@ref) 来列出。用 [`methodswith`](@ref) 搜索 方法调度表 来查找 接收给定类型的方法。

## 扩展和更底层

As discussed in the [Metaprogramming](@ref) section, the [`macroexpand`](@ref) function gives
the unquoted and interpolated expression ([`Expr`](@ref)) form for a given macro. To use `macroexpand`,
`quote` the expression block itself (otherwise, the macro will be evaluated and the result will
be passed instead!). For example:

```jldoctest; setup = :(using InteractiveUtils)
julia> macroexpand(@__MODULE__, :(@edit println("")) )
:(InteractiveUtils.edit(println, (Base.typesof)("")))
```

The functions `Base.Meta.show_sexpr` and [`dump`](@ref) are used to display S-expr style views
and depth-nested detail views for any expression.

Finally, the [`Meta.lower`](@ref) function gives the `lowered` form of any expression and is of
particular interest for understanding how language constructs map to primitive operations such
as assignments, branches, and calls:

```jldoctest
julia> Meta.lower(@__MODULE__, :( [1+2, sin(0.5)] ))
:($(Expr(:thunk, CodeInfo(
    @ none within `top-level scope'
1 ─ %1 = 1 + 2
│   %2 = sin(0.5)
│   %3 = Base.vect(%1, %2)
└──      return %3
))))
```

## 中间表示和编译后表示

检查函数的底层形式 需要选择所要显示的特定方法，因为泛型函数可能会有许多具有不同类型签名的方法。为此，
用 [`code_lowered`](@ref) 可以指定代码底层中的方法。
并且可以用  [`code_typed`](@ref) 来进行类型推断。
[`code_warntype`](@ref) 增加 [`code_typed`](@ref) 输出的高亮。

更加接近于机器， 一个函数的 LLVM-IR 可以通过使用 [`code_llvm`](@ref) 打印出。
最终编译的机器码使用 [`code_native`](@ref) 查看（这将触发 之前未调用过的任何函数的 JIT 编译/代码生成）。

为方便起见，上述函数有 宏的版本，它们接受标准函数调用并自动展开参数类型：

```julia-repl
julia> @code_llvm +(1,1)

define i64 @"julia_+_130862"(i64, i64) {
top:
    %2 = add i64 %1, %0
    ret i64 %2
}
```

For more informations see [`@code_lowered`](@ref), [`@code_typed`](@ref), [`@code_warntype`](@ref),
[`@code_llvm`](@ref), and [`@code_native`](@ref).

### Printing of debug information

The aforementioned functions and macros take the keyword argument `debuginfo` that controls the level
debug information printed.

```
julia> @code_typed debuginfo=:source +(1,1)
CodeInfo(
    @ int.jl:53 within `+'
1 ─ %1 = Base.add_int(x, y)::Int64
└──      return %1
) => Int64
```

Possible values for `debuginfo` are: `:none`, `:source`, and`:default`.
Per default debug information is not printed, but that can be changed
by setting `Base.IRShow.default_debuginfo[] = :source`.

