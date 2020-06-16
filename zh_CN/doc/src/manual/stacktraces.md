# 栈跟踪

`StackTraces` 模块提供了简单的栈跟踪功能，这些栈跟踪信息既可读又易于编程使用。

## 查看栈跟踪

获取栈跟踪信息的主要函数是 [`stacktrace`](@ref)：

```julia-repl
6-element Array{Base.StackTraces.StackFrame,1}:
 top-level scope
 eval at boot.jl:317 [inlined]
 eval(::Module, ::Expr) at REPL.jl:5
 eval_user_input(::Any, ::REPL.REPLBackend) at REPL.jl:85
 macro expansion at REPL.jl:116 [inlined]
 (::getfield(REPL, Symbol("##28#29")){REPL.REPLBackend})() at event.jl:92
```

调用 [`stacktrace()`](@ref) 会返回一个 [`StackTraces.StackFrame`](@ref) 数组。为了使用方便，可以用 [`StackTraces.StackTrace`](@ref) 来代替 `Vector{StackFrame}`。下面例子中 `[...]` 的意思是这部分输出的内容可能会根据代码的实际执行情况而定。

```julia-repl
julia> example() = stacktrace()
example (generic function with 1 method)

julia> example()
7-element Array{Base.StackTraces.StackFrame,1}:
 example() at REPL[1]:1
 top-level scope
 eval at boot.jl:317 [inlined]
[...]

julia> @noinline child() = stacktrace()
child (generic function with 1 method)

julia> @noinline parent() = child()
parent (generic function with 1 method)

julia> grandparent() = parent()
grandparent (generic function with 1 method)

julia> grandparent()
9-element Array{Base.StackTraces.StackFrame,1}:
 child() at REPL[3]:1
 parent() at REPL[4]:1
 grandparent() at REPL[5]:1
[...]
```

注意，在调用 [`stacktrace()`](@ref) 的时，通常会出现 `eval at boot.jl` 这帧。
当从 REPL 里调用 [`stacktrace()`](@ref) 的时候，还会显示 `REPL.jl` 里的一些额外帧，就像下面一样：

```julia-repl
julia> example() = stacktrace()
example (generic function with 1 method)

julia> example()
7-element Array{Base.StackTraces.StackFrame,1}:
 example() at REPL[1]:1
 top-level scope
 eval at boot.jl:317 [inlined]
 eval(::Module, ::Expr) at REPL.jl:5
 eval_user_input(::Any, ::REPL.REPLBackend) at REPL.jl:85
 macro expansion at REPL.jl:116 [inlined]
 (::getfield(REPL, Symbol("##28#29")){REPL.REPLBackend})() at event.jl:92
```

## 抽取有用信息

每个 [`StackTraces.StackFrame`](@ref) 都会包含函数名，文件名，代码行数，lambda 信息，一个用于确认此帧是否被内联的标帜，一个用于确认函数是否为 C 函数的标帜（在默认的情况下 C 函数不会出现在栈跟踪信息中）以及一个用整数表示的指针，它是由 [`backtrace`](@ref) 返回的：

```julia-repl
julia> frame = stacktrace()[3]
eval(::Module, ::Expr) at REPL.jl:5

julia> frame.func
:eval

julia> frame.file
Symbol("~/julia/usr/share/julia/stdlib/v0.7/REPL/src/REPL.jl")

julia> frame.line
5

julia> top_frame.linfo
MethodInstance for eval(::Module, ::Expr)

julia> top_frame.inlined
false

julia> top_frame.from_c
false
```

```julia-repl
julia> top_frame.pointer
0x00007f92d6293171
```

这使得我们可以通过编程的方式将栈跟踪信息用于打印日志，处理错误以及其它更多用途。

## 错误处理

能够轻松地获取当前调用栈的状态信息在许多场景下都很有用，但最直接的应用是错误处理和调试。

```julia-repl
julia> @noinline bad_function() = undeclared_variable
bad_function (generic function with 1 method)

julia> @noinline example() = try
           bad_function()
       catch
           stacktrace()
       end
example (generic function with 1 method)

julia> example()
7-element Array{Base.StackTraces.StackFrame,1}:
 example() at REPL[2]:4
 top-level scope
 eval at boot.jl:317 [inlined]
[...]
```

你可能已经注意到了，上述例子中第一个栈帧指向了 [`stacktrace`](@ref) 被调用的第 4 行，而不是 `bad_function` 被调用的第 2 行，且完全没有出现 `bad_function` 的栈帧。这是也是可以理解的，因为 [`stacktrace`](@ref) 是在 `catch` 的上下文中被调用的。虽然在这个例子中很容易查找到错误的真正源头，但在复杂的情况下查找错误源并不是一件容易的事。

为了补救，我们可以将 [`catch_backtrace`](@ref) 的输出传递给 [`stacktrace`](@ref)。[`catch_backtrace`](@ref) 会返回最近发生异常的上下文中的栈信息，而不是返回当前上下文中的调用栈信息。

```julia-repl
julia> @noinline bad_function() = undeclared_variable
bad_function (generic function with 1 method)

julia> @noinline example() = try
           bad_function()
       catch
           stacktrace(catch_backtrace())
       end
example (generic function with 1 method)

julia> example()
8-element Array{Base.StackTraces.StackFrame,1}:
 bad_function() at REPL[1]:1
 example() at REPL[2]:2
[...]
```

可以看到，现在栈跟踪会显示正确的行号以及之前缺失的栈帧。

```julia-repl
julia> @noinline child() = error("Whoops!")
child (generic function with 1 method)

julia> @noinline parent() = child()
parent (generic function with 1 method)

julia> @noinline function grandparent()
           try
               parent()
           catch err
               println("ERROR: ", err.msg)
               stacktrace(catch_backtrace())
           end
       end
grandparent (generic function with 1 method)

julia> grandparent()
ERROR: Whoops!
10-element Array{Base.StackTraces.StackFrame,1}:
 error at error.jl:33 [inlined]
 child() at REPL[1]:1
 parent() at REPL[2]:1
 grandparent() at REPL[3]:3
[...]
```

## 异常栈与`catch_stack`

!!! compat "Julia 1.1"
    异常栈需要 Julia 1.1 及以上版本。

在处理一个异常时，后续的异常同样可能被抛出。观察这些异常对定位问题的源头极有帮助。Julia runtime 支持将每个异常发生后推入一个内部的*异常栈*。当代码正常退出一个`catch`语句，可认为所有被推入栈中的异常在相应的`try`语句中被成功处理并已从栈中移除。

存放当前异常的栈可通过测试函数 [`Base.catch_stack`](@ref) 获取，例如

```julia-repl
julia> try
           error("(A) The root cause")
       catch
           try
               error("(B) An exception while handling the exception")
           catch
               for (exc, bt) in Base.catch_stack()
                   showerror(stdout, exc, bt)
                   println()
               end
           end
       end
(A) The root cause
Stacktrace:
 [1] error(::String) at error.jl:33
 [2] top-level scope at REPL[7]:2
 [3] eval(::Module, ::Any) at boot.jl:319
 [4] eval_user_input(::Any, ::REPL.REPLBackend) at REPL.jl:85
 [5] macro expansion at REPL.jl:117 [inlined]
 [6] (::getfield(REPL, Symbol("##26#27")){REPL.REPLBackend})() at task.jl:259
(B) An exception while handling the exception
Stacktrace:
 [1] error(::String) at error.jl:33
 [2] top-level scope at REPL[7]:5
 [3] eval(::Module, ::Any) at boot.jl:319
 [4] eval_user_input(::Any, ::REPL.REPLBackend) at REPL.jl:85
 [5] macro expansion at REPL.jl:117 [inlined]
 [6] (::getfield(REPL, Symbol("##26#27")){REPL.REPLBackend})() at task.jl:259
```

在本例中，根源异常（A）排在栈头，其后放置着延伸异常（B)。 在正常退出（例如，不抛出新异常）两个 catch 块后，所有异常都被移除出栈，无法访问。

异常栈被存放于发生异常的 `Task` 处。当某个任务失败，出现意料外的异常时，`catch_stack(task)` 可能会被用于观察该任务的异常栈。

## [`stacktrace`](@ref) 与 [`backtrace`](@ref) 的比较

调用 [`backtrace`](@ref) 会返回一个 `Union{Ptr{Nothing}, Base.InterpreterIP}` 的数组，可以将其传给 [`stacktrace`](@ref) 函数进行转化：

```julia-repl
julia> trace = backtrace()
18-element Array{Union{Ptr{Nothing}, Base.InterpreterIP},1}:
 Ptr{Nothing} @0x00007fd8734c6209
 Ptr{Nothing} @0x00007fd87362b342
 Ptr{Nothing} @0x00007fd87362c136
 Ptr{Nothing} @0x00007fd87362c986
 Ptr{Nothing} @0x00007fd87362d089
 Base.InterpreterIP(CodeInfo(:(begin
      Core.SSAValue(0) = backtrace()
      trace = Core.SSAValue(0)
      return Core.SSAValue(0)
  end)), 0x0000000000000000)
 Ptr{Nothing} @0x00007fd87362e4cf
[...]

julia> stacktrace(trace)
6-element Array{Base.StackTraces.StackFrame,1}:
 top-level scope
 eval at boot.jl:317 [inlined]
 eval(::Module, ::Expr) at REPL.jl:5
 eval_user_input(::Any, ::REPL.REPLBackend) at REPL.jl:85
 macro expansion at REPL.jl:116 [inlined]
 (::getfield(REPL, Symbol("##28#29")){REPL.REPLBackend})() at event.jl:92
```

需要注意的是，[`backtrace`](@ref) 返回的向量有 18 个元素，而 [`stacktrace`](@ref) 返回的向量只包含6 个元素。这是因为 [`stacktrace`](@ref) 在默认情况下会移除所有底层 C 函数的栈信息。如果你想显示 C 函数调用的栈帧，可以这样做：

```julia-repl
julia> stacktrace(trace, true)
21-element Array{Base.StackTraces.StackFrame,1}:
 jl_apply_generic at gf.c:2167
 do_call at interpreter.c:324
 eval_value at interpreter.c:416
 eval_body at interpreter.c:559
 jl_interpret_toplevel_thunk_callback at interpreter.c:798
 top-level scope
 jl_interpret_toplevel_thunk at interpreter.c:807
 jl_toplevel_eval_flex at toplevel.c:856
 jl_toplevel_eval_in at builtins.c:624
 eval at boot.jl:317 [inlined]
 eval(::Module, ::Expr) at REPL.jl:5
 jl_apply_generic at gf.c:2167
 eval_user_input(::Any, ::REPL.REPLBackend) at REPL.jl:85
 jl_apply_generic at gf.c:2167
 macro expansion at REPL.jl:116 [inlined]
 (::getfield(REPL, Symbol("##28#29")){REPL.REPLBackend})() at event.jl:92
 jl_fptr_trampoline at gf.c:1838
 jl_apply_generic at gf.c:2167
 jl_apply at julia.h:1540 [inlined]
 start_task at task.c:268
 ip:0xffffffffffffffff
```

[`backtrace`](@ref) 返回的单个指针可以通过 [`StackTraces.lookup`](@ref) 来转化成一组 [`StackTraces.StackFrame`](@ref)：

```julia-repl
julia> pointer = backtrace()[1];

julia> frame = StackTraces.lookup(pointer)
1-element Array{Base.StackTraces.StackFrame,1}:
 jl_apply_generic at gf.c:2167

julia> println("The top frame is from $(frame[1].func)!")
The top frame is from jl_apply_generic!
```
