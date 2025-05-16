# 反射与内省

Julia 提供了多种运行时的反射功能。

## 模块绑定

由 `Module` 导出的名称可用 [`names(m::Module)`](@ref) 获得，它会返回一个元素为 [`Symbol`](@ref) 的数组来表示模块导出的绑定。
不管导出状态如何，`names(m::Module, all = true)` 返回 `m` 中所有绑定的符号。

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

注意 `fieldnames(DataType)` 会给出 `DataType` 本身的每个字段的名称，其中一个字段就是上例中观察到的 `types` 字段。

## 子类型

任何 `DataType` 的*直接*子类型都可以使用 [`subtypes`](@ref) 列出。
例如，抽象 `DataType` [`AbstractFloat`](@ref) 有四个（具体的）子类型：

```jldoctest; setup = :(using InteractiveUtils)
julia> subtypes(AbstractFloat)
4-element Vector{Any}:
 BigFloat
 Float16
 Float32
 Float64
```

任何抽象子类型也包括此列表中，但子类型的子类型不在其中。递归使用 [`subtypes`](@ref) 可以遍历出整个类型树。

## DataType 布局

当与 C 代码进行接口交互时，`DataType` 的内部表示非常重要，有几个函数可用于检查这些细节。

- [`isbitstype(T::DataType)`](@ref) 返回true，如果类型 `T` 以 C 兼容的对齐方式存储。
- [`fieldoffset(T::DataType, i::Integer)`](@ref) 返回相对于类型起始位置的字段 *i* 的（字节）偏移量。

## 函数方法

任何泛型函数的方法都可以使用 [`methods`](@ref) 来列出。用 [`methodswith`](@ref) 搜索 方法调度表 来查找 接收给定类型的方法。

## 扩展和更底层

如[元编程](@ref)部分所述，[`macroexpand`](@ref)函数为给定的宏提供未引用和插值的表达式（[`Expr`](@ref)）形式。
要使用`macroexpand`，需要对表达式块本身使用`quote`（否则，宏将被求值，并传递其结果！）。
例如：

```jldoctest; setup = :(using InteractiveUtils)
julia> macroexpand(@__MODULE__, :(@edit println("")) )
:(InteractiveUtils.edit(println, (Base.typesof)("")))
```

函数 `Base.Meta.show_sexpr` 和 [`dump`](@ref) 用于显示任何表达式的 `S-表达式` 风格视图和深度嵌套的详细视图。

最后，[`Meta.lower`](@ref) 函数提供任何表达式的 `lowered` 形式，
这对于理解语言构造如何映射到原始操作（如赋值、分支和调用）特别有用：

```jldoctest
julia> Meta.lower(@__MODULE__, :( [1+2, sin(0.5)] ))
:($(Expr(:thunk, CodeInfo(
    @ none within `top-level scope`
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
;  @ int.jl:87 within `+`
; Function Attrs: sspstrong uwtable
define i64 @"julia_+_476"(i64 signext %0, i64 signext %1) #0 {
top:
  %2 = add i64 %1, %0
  ret i64 %2
}
```

更多信息请参见 [`@code_lowered`](@ref)、[`@code_typed`](@ref)、[`@code_warntype`](@ref)、
[`@code_llvm`](@ref)和[`@code_native`](@ref)。

### 调试信息的打印

上述函数和宏接受关键字参数 `debuginfo`，用于控制打印的调试信息级别。

```julia-repl
julia> @code_typed debuginfo=:source +(1,1)
CodeInfo(
    @ int.jl:53 within `+'
1 ─ %1 = Base.add_int(x, y)::Int64
└──      return %1
) => Int64
```

`debuginfo` 的可能取值有：`:none`、`:source` 和 `:default`。
默认情况下不打印调试信息，但可以通过设置 `Base.IRShow.default_debuginfo[] = :source` 来改变这一行为。
