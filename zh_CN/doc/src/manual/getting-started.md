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
$ julia script.jl arg1 arg2...
```

如这个例子所示，`julia` 后跟着的命令行参数会被作为程序 `script.jl` 的命令行参数。这些参数使用全局常量 `ARGS` 来传递，脚本自身的名字会以全局变量 `PROGRAM_FILE` 传入。注意当脚本以命令行里的 `-e` 选项输入时，`ARGS` 也会被设定（详见此页末尾列表）但是 `PROGRAM_FILE` 会是空的。例如，要把一个脚本的输入参数显示出来，你可以：

```
$ julia -e 'println(PROGRAM_FILE); for x in ARGS; println(x); end' foo bar

foo
bar
```

或者你可以把代码写到一个脚本文件中再执行它：

```
$ echo 'println(PROGRAM_FILE); for x in ARGS; println(x); end' > script.jl
$ julia script.jl foo bar
script.jl
foo
bar
```

可以使用 `--` 分隔符来将传给脚本文件的参数和 Julia 本身的命令行参数区分开：

```
$ julia --color=yes -O -- script.jl arg1 arg2..
```

有关编写 Julia 脚本的更多信息，请参阅 [脚本](@ref man-scripting)。

使用选项 `-p` 或者 `--machine-file` 可以在并行模式下启动 Julia。
`-p n` 会启动额外的 `n` 个 worker，使用 `--machine-file file` 会为 `file` 文件中的每一行启动一个 worker。
定义在 `file` 中的机器必须能够通过一个不需要密码的 `ssh` 登陆访问到，且 Julia 的安装位置需要和当前主机相同。
定义机器的格式为 `[count*][user@]host[:port] [bind_addr[:port]]`。
`user` 默认值是当前用户；
`port` 默认值是标准 ssh 端口；
`count` 是在这个节点上的 worker 的数量，默认是 1；
可选的 `bind-to bind_addr[:port]` 指定了其它 worker 访问当前 worker 应当使用的 IP 地址与端口。

要让 Julia 每次启动都自动执行一些代码，你可以把它们放在 `~/.julia/config/startup.jl` 中：

```
$ echo 'println("Greetings! 你好! 안녕하세요?")' > ~/.julia/config/startup.jl
$ julia
Greetings! 你好! 안녕하세요?

...
```

在你第一次运行 Julia 后，你应该多了一个 `~/.julia` 文件夹。
你还可以新建 `~/.julia/config` 文件夹和 `~/.julia/config/startup.jl` 文件来配置 Julia。

和 `perl` 和 `ruby` 程序类似，还有很多种运行 Julia 代码的方式，运行代码时也有很多选项：

```
julia [switches] -- [programfile] [args...]
```

详细的命令选项可以在这里找到 [Command-line Options](@ref
command-line-options).

## 资源

除了本手册以外，官方网站还提供了一个有用的**[学习资源列表](https://julialang.org/learning/)**来帮助新用户学习 Julia。

如果已经对 Julia 有所了解，你可以先看 [Performance Tips](@ref man-performance-tips) 和 [Workflow Tips](@ref man-workflow-tips)。
