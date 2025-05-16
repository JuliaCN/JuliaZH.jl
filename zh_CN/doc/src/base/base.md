# 基本功能

## 介绍

Julia Base 中包含一系列适用于科学及数值计算的函数和宏，但也可以用于通用编程。
其它功能则由 Julia 生态圈中的[各种库](https://julialang.org/packages/)来提供。
函数按主题划分如下：

一些通用的提示：

  * 可以通过 `import Module` 导入想要使用的模块，并利用 `Module.fn(x)` 语句来实现对模块内函数的调用。
  * 此外，`using Module` 语句会将名为 `Module` 的模块中的所有可调函数引入当前的命名空间。
  * 按照约定，名字以感叹号（`!`）结尾的函数会改变其输入参数的内容。
    一些函数同时拥有改变参数（例如 `sort!`）和不改变参数（`sort`）的版本

`Base` 和标准库的行为稳定性遵循 [SemVer](https://semver.org/) 的定义，但仅限于已经文档化的部分；
即已包含在 [Julia 文档](https://docs.julialang.org/) 中且未标记为不稳定的内容。
更多信息请参阅 [API 常见问题](@ref man-api)。


## Getting Around

```@docs
Base.exit
Base.atexit
Base.isinteractive
Base.summarysize
Base.__precompile__
Base.include
Base.MainInclude.include
Base.include_string
Base.include_dependency
__init__
Base.which(::Any, ::Any)
Base.methods
Base.@show
ans
err
Base.active_project
Base.set_active_project
```

## [关键字](@id Keywords)

以下是 Julia 中的保留关键字列表：
`baremodule`、`begin`、`break`、`catch`、`const`、`continue`、`do`、
`else`、`elseif`、`end`、`export`、`false`、`finally`、`for`、`function`、
`global`、`if`、`import`、`let`、`local`、`macro`、`module`、`quote`、
`return`、`struct`、`true`、`try`、`using`、`while`。
这些关键字不能用作变量名。

以下双词组合是保留的：
`abstract type`、`mutable struct`、`primitive type`。
但是，你可以创建以下名称的变量：
`abstract`、`mutable`、`primitive` 和 `type`。

最后：
`where` 被解析为中缀运算符，用于编写参数化方法和类型定义；
`in` 和 `isa` 被解析为中缀运算符；
`outer` 在用于修改 `for` 循环迭代规范中变量作用域时被解析为关键字；
而 `as` 用作关键字，用于重命名通过 `import` 或 `using` 引入作用域的标识符。
不过，创建名为 `where`、`in`、`isa`、`outer` 和 `as` 的变量是允许的。

```@docs
module
export
import
using
as
baremodule
function
macro
return
do
begin
end
let
if
for
while
break
continue
try
finally
quote
local
global
outer
const
struct
mutable struct
@kwdef
abstract type
primitive type
where
...
;
=
?:
```

## 标准模块

```@docs
Main
Core
Base
```

## Base 子模块

```@docs
Base.Broadcast
Base.Docs
Base.Iterators
Base.Libc
Base.Meta
Base.StackTraces
Base.Sys
Base.Threads
Base.GC
```

## 对象操作

```@docs
Core.:(===)
Core.isa
Base.isequal
Base.isless
Base.isunordered
Base.ifelse
Core.typeassert
Core.typeof
Core.tuple
Base.ntuple
Base.objectid
Base.hash
Base.finalizer
Base.finalize
Base.copy
Base.deepcopy
Base.getproperty
Base.setproperty!
Base.replaceproperty!
Base.swapproperty!
Base.modifyproperty!
Base.propertynames
Base.hasproperty
Core.getfield
Core.setfield!
Core.modifyfield!
Core.replacefield!
Core.swapfield!
Core.isdefined
Core.getglobal
Core.setglobal!
Base.@isdefined
Base.convert
Base.promote
Base.oftype
Base.widen
Base.identity
Base.WeakRef
```

## 类型的属性

### 类型关系

```@docs
Base.supertype
Core.Type
Core.DataType
Core.:(<:)
Base.:(>:)
Base.typejoin
Base.typeintersect
Base.promote_type
Base.promote_rule
Base.promote_typejoin
Base.isdispatchtuple
```

### 声明结构体

```@docs
Base.ismutable
Base.isimmutable
Base.ismutabletype
Base.isabstracttype
Base.isprimitivetype
Base.issingletontype
Base.isstructtype
Base.nameof(::DataType)
Base.fieldnames
Base.fieldname
Core.fieldtype
Base.fieldtypes
Base.fieldcount
Base.hasfield
Core.nfields
Base.isconst
Base.isfieldatomic
```

### 内存布局

```@docs
Base.sizeof(::Type)
Base.isconcretetype
Base.isbits
Base.isbitstype
Base.fieldoffset
Base.datatype_alignment
Base.datatype_haspadding
Base.datatype_pointerfree
```

### 特殊值

```@docs
Base.typemin
Base.typemax
Base.floatmin
Base.floatmax
Base.maxintfloat
Base.eps(::Type{<:AbstractFloat})
Base.eps(::AbstractFloat)
Base.instances
```

## 特殊类型

```@docs
Core.Any
Core.Union
Union{}
Core.UnionAll
Core.Tuple
Core.NTuple
Core.NamedTuple
Base.@NamedTuple
Base.@Kwargs
Base.Val
Core.Vararg
Core.Nothing
Base.isnothing
Base.notnothing
Base.Some
Base.something
Base.@something
Base.Enums.Enum
Base.Enums.@enum
Core.Expr
Core.Symbol
Core.Symbol(x...)
Core.Module
```

## 通用函数

```@docs
Core.Function
Base.hasmethod
Core.applicable
Base.isambiguous
Core.invoke
Base.@invoke
Base.invokelatest
Base.@invokelatest
new
Base.:(|>)
Base.:(∘)
Base.ComposedFunction
Base.splat
Base.Fix1
Base.Fix2
```

## 语法

```@docs
Core.eval
Base.MainInclude.eval
Base.@eval
Base.evalfile
Base.esc
Base.@inbounds
Base.@boundscheck
Base.@propagate_inbounds
Base.@inline
Base.@noinline
Base.@nospecialize
Base.@specialize
Base.@nospecializeinfer
Base.@constprop
Base.gensym
Base.@gensym
var"name"
Base.@goto
Base.@label
Base.@simd
Base.@polly
Base.@generated
Base.@assume_effects
Base.@deprecate
```

## 缺失值

```@docs
Base.Missing
Base.missing
Base.coalesce
Base.@coalesce
Base.ismissing
Base.skipmissing
Base.nonmissingtype
```

## 系统

```@docs
Base.run
Base.devnull
Base.success
Base.process_running
Base.process_exited
Base.kill(::Base.Process, ::Integer)
Base.Sys.set_process_title
Base.Sys.get_process_title
Base.ignorestatus
Base.detach
Base.Cmd
Base.setenv
Base.addenv
Base.withenv
Base.setcpuaffinity
Base.pipeline(::Any, ::Any, ::Any, ::Any...)
Base.pipeline(::Base.AbstractCmd)
Base.Libc.gethostname
Base.Libc.getpid
Base.Libc.time()
Base.time_ns
Base.@time
Base.@showtime
Base.@timev
Base.@timed
Base.@elapsed
Base.@allocated
Base.@allocations
Base.EnvDict
Base.ENV
Base.Sys.STDLIB
Base.Sys.isunix
Base.Sys.isapple
Base.Sys.islinux
Base.Sys.isbsd
Base.Sys.isfreebsd
Base.Sys.isopenbsd
Base.Sys.isnetbsd
Base.Sys.isdragonfly
Base.Sys.iswindows
Base.Sys.windows_version
Base.Sys.free_memory
Base.Sys.total_memory
Base.Sys.free_physical_memory
Base.Sys.total_physical_memory
Base.Sys.uptime
Base.Sys.isjsvm
Base.Sys.loadavg
Base.Sys.isexecutable
Base.@static
```

## 版本信息

```@docs
Base.VersionNumber
Base.@v_str
```

## 错误

```@docs
Base.error
Core.throw
Base.rethrow
Base.backtrace
Base.catch_backtrace
Base.current_exceptions
Base.@assert
Base.Experimental.register_error_hint
Base.Experimental.show_error_hints
Base.ArgumentError
Base.AssertionError
Core.BoundsError
Base.CompositeException
Base.DimensionMismatch
Core.DivideError
Core.DomainError
Base.EOFError
Core.ErrorException
Core.InexactError
Core.InterruptException
Base.KeyError
Base.LoadError
Base.MethodError
Base.MissingException
Core.OutOfMemoryError
Core.ReadOnlyMemoryError
Core.OverflowError
Base.ProcessFailedException
Base.TaskFailedException
Core.StackOverflowError
Base.SystemError
Core.TypeError
Core.UndefKeywordError
Core.UndefRefError
Core.UndefVarError
Base.StringIndexError
Base.InitError
Base.retry
Base.ExponentialBackOff
```

## 事件

```@docs
Base.Timer(::Function, ::Real)
Base.Timer
Base.AsyncCondition
Base.AsyncCondition(::Function)
```

## 反射

```@docs
Base.nameof(::Module)
Base.parentmodule
Base.pathof(::Module)
Base.pkgdir(::Module)
Base.pkgversion(::Module)
Base.moduleroot
__module__
__source__
Base.@__MODULE__
Base.@__FILE__
Base.@__DIR__
Base.@__LINE__
Base.fullname
Base.names
Base.nameof(::Function)
Base.functionloc(::Any, ::Any)
Base.functionloc(::Method)
Base.@locals
```

## 代码加载

```@docs
Base.identify_package
Base.locate_package
Base.require
Base.compilecache
Base.isprecompiled
Base.get_extension
```

## 内部工具

```@docs
Base.GC.gc
Base.GC.enable
Base.GC.@preserve
Base.GC.safepoint
Base.GC.enable_logging
Meta.lower
Meta.@lower
Meta.parse(::AbstractString, ::Int)
Meta.parse(::AbstractString)
Meta.ParseError
Core.QuoteNode
Base.macroexpand
Base.@macroexpand
Base.@macroexpand1
Base.code_lowered
Base.code_typed
Base.precompile
Base.jit_total_bytes
```

## 元编程

```@docs
Meta.quot
Meta.isexpr
Meta.isidentifier
Meta.isoperator
Meta.isunaryoperator
Meta.isbinaryoperator
Meta.show_sexpr
```
