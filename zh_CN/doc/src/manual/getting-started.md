# [入门](@id man-getting-started)

无论是使用预编译好的二进制程序，还是自己从源码编译，安装 Julia 都是一件很简单的事情。
请按照 [https://julialang.org/downloads/](https://julialang.org/downloads/) 的提示来下载并安装 Julia。

如果你是从下面的某一种语言切换到 Julia 的话，那么你应该首先阅读与这些语言有显著差异的那一部分 [MATLAB](@ref Noteworthy-differences-from-MATLAB), [R](@ref Noteworthy-differences-from-R), [Python](@ref Noteworthy-differences-from-Python), [C/C++](@ref Noteworthy-differences-from-C/C) or [Common Lisp](@ref Noteworthy-differences-from-Common-Lisp). 这将帮助你避免一些常见的编程陷阱，因为 Julia 在许多微妙的方面与这些语言不同。

启动一个交互式会话（也叫 REPL）是学习和尝试 Julia 最简单的方法。双击 Julia 的可执行文件或是从命令行运行 `julia` 就可以启动：

```@eval
io = IOBuffer()
Base.banner(io)
banner = String(take!(io))
import Markdown
Markdown.parse("```\n\$ julia\n\n$(banner)\njulia> 1 + 2\n3\n\njulia> ans\n3\n```")
```

输入 `CTRL-D`（同时按 `Ctrl` 键和 `d` 键）或 `exit()` 便可以退出交互式会话。在交互式模式中，`julia` 会显示一条横幅并提示用户输入。一旦用户输入了一段完整的代码（表达式），例如 `1 + 2`，然后按回车，交互式会话就会执行这段代码，并将结果显示出来。如果输入的代码以分号结尾，那么结果将不会显示出来。然而不管结果显示与否，变量 `ans` 总会存储上一次执行代码的结果，需要注意的是，变量 `ans` 只在交互式会话中才有。

在交互式会话中，要运行写在源文件 `file.jl` 中的代码，只需输入 `include("file.jl")`。

如果想以非交互的方式执行文件中的代码，可以把文件名作为 `julia` 命令的第一个参数：

```
$ julia script.jl
```

You can pass additional arguments to Julia, and to your program `script.jl`. A detailed list of all the available options can be found under [Command-line Interface](@ref cli).

## 资源

除了本手册以外，官方网站还提供了一个有用的 **[学习资源列表](https://julialang.org/learning/)** 来帮助新用户学习 Julia。

You can use the REPL as a learning resource by switching into the help mode.
Switch to help mode by pressing `?` at an empty `julia> ` prompt, before typing
anything else. Typing a keyword in help mode will fetch the documentation for
it, along with examples. Similarly for most functions or other objects you
might encounter!

```
help?> begin
search: begin disable_sigint reenable_sigint

  begin

  begin...end denotes a block of code.
```

如果已经对 Julia 有所了解，你可以先看 [Performance Tips](@ref man-performance-tips) 和 [Workflow Tips](@ref man-workflow-tips)。
