# 基本功能

## 介绍

Julia Base包含一系列针对科学及数学计算而特殊设计的函数和宏，丰富性同传统的通用编程语言相当。同时，用户可以通过安装包来拓展Julia语言的功能。函数按主题划分如下：

一些通用注解：

  * 可以通过`Import Module`导入想要使用的模块，并利用`Module.fn(x)`语句来实现对模块内函数的调用。
    函数。
  * 此外，`using Module`语句会将名为`Module`的模块中的所有可调函数引入当前的命名空间。
  * 按照约定，以感叹号（`!`）结尾的函数名会改变参数的值。
    一些函数同时拥有改变参数（例如`sort!`）和不改变参数（`sort`）的版本

## 粗略浏览

```@docs
Base.exit
Base.atexit
Base.isinteractive
Base.summarysize
Base.require
Base.compilecache
Base.__precompile__
Base.include
Base.MainInclude.include
Base.include_string
Base.include_dependency
Base.which(::Any, ::Any)
Base.methods
Base.@show
ans
```

## 关键字

```@docs
module
export
import
using
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
const
struct
mutable struct
abstract type
primitive type
...
;
```

## 基础模块
```@docs
Base.Base
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

## 所有对象

```@docs
Core.:(===)
Core.isa
Base.isequal
Base.isless
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
Base.propertynames
Core.getfield
Core.setfield!
Core.isdefined
Base.@isdefined
Base.convert
Base.promote
Base.oftype
Base.widen
Base.identity
```

## 类型的属性

### 类型联系

```@docs
Base.supertype
Core.:(<:)
Base.:(>:)
Base.typejoin
Base.typeintersect
Base.promote_type
Base.promote_rule
Base.isdispatchtuple
```

### 已声明结构

```@docs
Base.isimmutable
Base.isabstracttype
Base.isprimitivetype
Base.isstructtype
Base.nameof(::DataType)
Base.fieldnames
Base.fieldname
```

### 内存布局

```@docs
Base.sizeof(::Type)
Base.isconcretetype
Base.isbits
Base.isbitstype
Core.fieldtype
Base.fieldcount
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
Core.NamedTuple
Base.Val
Core.Vararg
Core.Nothing
Base.Some
Base.something
Base.Enums.@enum
```

## 范用函数

```@docs
Core.Function
Base.hasmethod
Core.applicable
Core.invoke
Base.invokelatest
new
Base.:(|>)
Base.:(∘)
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
Base.@inline
Base.@noinline
Base.@nospecialize
Base.@specialize
Base.gensym
Base.@gensym
Base.@goto
Base.@label
Base.@simd
Base.@polly
Base.@generated
Base.@pure
```

## 缺失值
```@docs
Base.Missing
Base.missing
Base.coalesce
Base.ismissing
Base.skipmissing
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
Base.withenv
Base.pipeline(::Any, ::Any, ::Any, ::Any...)
Base.pipeline(::Base.AbstractCmd)
Base.Libc.gethostname
Base.Libc.getpid
Base.Libc.time()
Base.time_ns
Base.@time
Base.@timev
Base.@timed
Base.@elapsed
Base.@allocated
Base.EnvDict
Base.ENV
Base.Sys.isunix
Base.Sys.isapple
Base.Sys.islinux
Base.Sys.isbsd
Base.Sys.iswindows
Base.Sys.windows_version
Base.@static
```

## 版本控制

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
Base.@assert
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
Base.moduleroot
Base.@__MODULE__
Base.fullname
Base.names
Core.nfields
Base.isconst
Base.nameof(::Function)
Base.functionloc(::Any, ::Any)
Base.functionloc(::Method)
```

## 内置

```@docs
Base.GC.gc
Base.GC.enable
Base.GC.@preserve
Meta.lower
Meta.@lower
Meta.parse(::AbstractString, ::Int)
Meta.parse(::AbstractString)
Meta.ParseError
Base.macroexpand
Base.@macroexpand
Base.@macroexpand1
Base.code_lowered
Base.code_typed
Base.precompile
```
