# 反射 与 自我检查

朱莉娅提供了多种运行时的反射功能。

## 模块绑定

`Module` 导出的名称使用  [`names(m::Module)`](@ref) ，会返回一个由 [`Symbol`](@ref) 元素组成的数组，表示导出的绑定。
不管导出状态如何，`names(m::Module, all = true)` 返回 `m` 中所有绑定的符号。

## 数据类型字段

`数据类型` 的所有字段名称可以使用 [`fieldnames`](@ref) 来获取。
例如下面给定一个类型，`fieldnames(Point)` 会返回一个表示字段名称的 关于 [`Symbol`](@ref) 的元组

```jldoctest struct_point
julia> struct Point
           x::Int
           y
       end

julia> fieldnames(Point)
(:x, :y)
```

`Point` 对象中的每个字段的类型 存储在 `Point` 本身的 `types` 变量中。

```jldoctest struct_point
julia> Point.types
svec(Int64, Any)
```

不过`x` 被声明为 `Int`，而 `y` 未声明类型，因此`y` 默认为 `Any` 类型。

类型本身表示为一个叫做 `DataType` 的结构：

```jldoctest struct_point
julia> typeof(Point)
DataType
```

注意 `fieldnames(DataType)` 给出了 `DataType` 本身的每个字段的名称，其中一个字段是上面示例中看到的 `types` 字段。

## Subtypes

任何 `数据类型` 的 *直接* 子类型 都可以通过使用 [`subtypes`](@ref) 来列出。
例如 抽象类型 `DataType` [`AbstractFloat`](@ref) 有四个（具体的）子类型：

```jldoctest; setup = :(using InteractiveUtils)
julia> subtypes(AbstractFloat)
4-element Array{Any,1}:
 BigFloat
 Float16
 Float32
 Float64
```

Any abstract subtype will also be included in this list, but further subtypes thereof will not;
任何抽象的子类型也会被包括其中，但不会有更深的子类型。
[`subtypes`](@ref) 的递归使用可以检查出整个类型树

## 数据类型布局设计

用 C 代码接口时，`DataType` 的内部表现非常重要。有几个函数可以检查这些细节。

 [`isbits(T::DataType)`](@ref) 如果 `T` 类型是以 C 兼容的对齐方式存储，则为 true。  
 [`fieldoffset(T::DataType, i::Integer)`](@ref) 返回字段 *i* 相对于类型开始的 (字节) 偏移量。

## 函数方法

任何泛型函数的方法都可以使用 [`methods`](@ref) 来列出。用 [`methodswith`](@ref) 搜索 方法调度表 来查找 接收给定类型的方法。

## 扩展和更底层

像 [Metaprogramming](@ref) 部分讨论的那样,  [`macroexpand`](@ref) 函数提供不带 quote 和 插值表达式 (`Expr`) 的形式。若要使用 `macroexpand`, `quote` 表达式代码块本身，（不然宏将被执行并替换为结果）。例如：
the unquoted and interpolated expression (`Expr`) form for a given macro. To use `macroexpand`,
`quote` the expression block itself (otherwise, the macro will be evaluated and the result will
be passed instead!). For example:

```jldoctest; setup = :(using InteractiveUtils)
julia> macroexpand(@__MODULE__, :(@edit println("")) )
:((InteractiveUtils.edit)(println, (Base.typesof)("")))
```

函数 `Base.Meta.show_sexpr` 和 [`dump`](@ref) 用来展示 S-表达式样式预览 并且对任何表达式显示深层网络结构细节。

最终， [`Meta.lower`](@ref) 函数对任何表达式提供 `底层` 的形式，并且是令人感兴趣的是理解 语言的结构 映射到 原始的操作比如赋值、分支以及调用：

```jldoctest
julia> Meta.lower(@__MODULE__, :([1+2, sin(0.5)]) )
:($(Expr(:thunk, CodeInfo(
 1 ─ %1 = 1 + 2
 │   %2 = sin(0.5)
 │   %3 = (Base.vect)(%1, %2)
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

; Function Attrs: sspreq
define i64 @"julia_+_130862"(i64, i64) #0 {
top:
    %2 = add i64 %1, %0, !dbg !8
    ret i64 %2, !dbg !8
}
```

See [`@code_lowered`](@ref), [`@code_typed`](@ref), [`@code_warntype`](@ref),
[`@code_llvm`](@ref), and [`@code_native`](@ref).
