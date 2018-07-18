```@raw html
<!-- # [Getting Started](@id man-getting-started) -->
```

# [起步](@id man-getting-started)

```@raw html
<!-- Julia installation is straightforward, whether using precompiled binaries or compiling from source.
Download and install Julia by following the instructions at [https://julialang.org/downloads/](https://julialang.org/downloads/). -->
```

不管是用编译好的程序，还是自己从源码编译，安装 Julia 都是一件很简单的事情。按照 [https://julialang.org/downloads/](https://julialang.org/downloads/) 的提示就可以轻松下载并安装 Julia。

```@raw html
<!-- The easiest way to learn and experiment with Julia is by starting an interactive session (also
known as a read-eval-print loop or "REPL") by double-clicking the Julia executable or running
`julia` from the command line: -->
```

启动一个交互式会话（也被叫做 REPL）是学习和尝试 Julia 最简单的方法。双击 Julia 的可执行文件或是从命令行运行 `julia` 就可以启动：

```@eval
io = IOBuffer()
Base.banner(io)
banner = String(take!(io))
import Markdown
Markdown.parse("```\n\$ julia\n\n$(banner)\njulia> 1 + 2\n3\n\njulia> ans\n3\n```")
```

```@raw html
<!-- To exit the interactive session, type `CTRL-D` (press the Control/`^` key together with the `d` key), or type
`exit()`. When run in interactive mode, `julia` displays a banner and prompts the user for input.
Once the user has entered a complete expression, such as `1 + 2`, and hits enter, the interactive
session evaluates the expression and shows its value. If an expression is entered into an interactive
session with a trailing semicolon, its value is not shown. The variable `ans` is bound to the
value of the last evaluated expression whether it is shown or not. The `ans` variable is only
bound in interactive sessions, not when Julia code is run in other ways. -->
```

输入 `^D` （`Ctrl` 和 `d` 两键同时按）或 `quit()` 以退出交互式会话。在交互式模式中，`julia` 会显示一个大标题并提示用户输入。一旦用户输入了一个完整的表达式，例如 `1 + 2`，然后敲回车，交互式会话就会对表达式进行求值并显示出来。如果一个输入交互式会话中的表达式以分号结尾，求得的值将不会被显示。变量 `ans` 被绑定到上一个被求值的表达式的结果，不管有没有被显示。注意 `ans` 变量只适用于交互式会话中，不适用于其它方法运行的 Julia。

```@raw html
<!-- To evaluate expressions written in a source file `file.jl`, write `include("file.jl")`. -->
```

如果想运行写在源文件 `file.jl` 中的表达式，只需输入 `include("file.jl")`。

```@raw html
<!-- To run code in a file non-interactively, you can give it as the first argument to the `julia`
command: -->
```

如果想非交互式地执行文件中的代码，可以把文件名作为 `julia` 命令的第一个参数：

```
$ julia script.jl arg1 arg2...
```

```@raw html
<!-- As the example implies, the following command-line arguments to `julia` are interpreted as
command-line arguments to the program `script.jl`, passed in the global constant `ARGS`. The
name of the script itself is passed in as the global `PROGRAM_FILE`. Note that `ARGS` is
also set when a Julia expression is given using the `-e` option on the command line (see the
`julia` help output below) but `PROGRAM_FILE` will be empty. For example, to just print the
arguments given to a script, you could do this: -->
```

如这个例子所示，`julia` 后跟着的命令行参数会被作为程序 `script.jl` 的命令行参数。这些参数使用全局常量 `ARGS` 来传递，脚本自身的名字会以全局常量 `PROGRAM_FILE` 传入。注意当脚本以命令行里的 `-e` 选项输入时，`ARGS` 也会被设定（见下面的 `julia` 帮助输出）但是 `PROGRAM_FILE` 会是空的。比如说，如果想把输入给一个脚本的参数给显示出来，你可以这么写：

```
$ julia -e 'println(PROGRAM_FILE); for x in ARGS; println(x); end' foo bar

foo
bar
```

```@raw html
<!-- Or you could put that code into a script and run it: -->
```

或者你可以把代码写到一个脚本文件中再执行它：

```
$ echo 'println(PROGRAM_FILE); for x in ARGS; println(x); end' > script.jl
$ julia script.jl foo bar
script.jl
foo
bar
```

```@raw html
<!-- The `--` delimiter can be used to separate command-line arguments intended for the script file from arguments intended for Julia: -->
```

可以使用 `--` 分隔符来将传给脚本文件和 Julia 本身的命令行参数分开：

```
$ julia --color=yes -O -- foo.jl arg1 arg2..
```

```@raw html
<!-- Julia can be started in parallel mode with either the `-p` or the `--machine-file` options. `-p n`
will launch an additional `n` worker processes, while `--machine-file file` will launch a worker
for each line in file `file`. The machines defined in `file` must be accessible via a password-less
`ssh` login, with Julia installed at the same location as the current host. Each machine definition
takes the form `[count*][user@]host[:port] [bind_addr[:port]]`. `user` defaults to current user,
`port` to the standard ssh port. `count` is the number of workers to spawn on the node, and defaults
to 1. The optional `bind-to bind_addr[:port]` specifies the IP address and port that other workers
should use to connect to this worker. -->
```

使用选项 `-p` 或者 `--machine-file` 可以在并行模式下启动 Julia。`-p n` 会启动额外的 `n` 个 worker，`--machine-file file` 会为 `file` 文件中的每一行启动一个 worker。被定义在 `file` 中的机器必须能够通过一个不需要密码的 `ssh` 登陆访问到，且 Julia 的安装位置需要和当前主机相同。定义机器的格式为 `[count*][user@]host[:port] [bind_addr[:port]]`。`user` 默认值是当前用户，`port` 默认值是标准 ssh 端口。`count` 是在这个节点上的 worker 的数量，默认是 1。可选的 `bind-to bind_addr[:port]` 指定了其它 worker 访问当前 worker 应当使用的 IP 地址与端口。

```@raw html
<!-- If you have code that you want executed whenever Julia is run, you can put it in
`~/.julia/config/startup.jl`: -->
```

如果你有一些代码，想让 Julia 每次启动都会自动执行，可以把它们放在 `~/.juliarc.jl` 中：

```
$ echo 'println("Greetings! 你好! 안녕하세요?")' > ~/.julia/config/startup.jl
$ julia
Greetings! 你好! 안녕하세요?

...
```

```@raw html
<!-- There are various ways to run Julia code and provide options, similar to those available for the
`perl` and `ruby` programs: -->
```

还有很多种运行 Julia 代码和提供选项的方法，和 `perl` 和 `ruby` 之类的程序中可用的方法类似：

```
julia [switches] -- [programfile] [args...]
```


|Switch                                 |Description|
|:---                                   |:---|
|`-v`, `--version`                      |Display version information|
|`-h`, `--help`                         |Print this message|
|`-J`, `--sysimage <file>`              |Start up with the given system image file|
|`-H`, `--home <dir>`                   |Set location of `julia` executable|
|`--startup-file={yes\|no}`             |Load `~/.julia/config/startup.jl`|
|`--handle-signals={yes\|no}`           |Enable or disable Julia's default signal handlers|
|`--sysimage-native-code={yes\|no}`     |Use native code from system image if available|
|`--compiled-modules={yes\|no}`         |Enable or disable incremental precompilation of modules|
|`-e`, `--eval <expr>`                  |Evaluate `<expr>`|
|`-E`, `--print <expr>`                 |Evaluate `<expr>` and display the result|
|`-L`, `--load <file>`                  |Load `<file>` immediately on all processors|
|`-p`, `--procs {N\|auto`}              |Integer value N launches N additional local worker processes; `auto` launches as many workers as the number of local CPU threads (logical cores)|
|`--machine-file <file>`                |Run processes on hosts listed in `<file>`|
|`-i`                                   |Interactive mode; REPL runs and `isinteractive()` is true|
|`-q`, `--quiet`                        |Quiet startup: no banner, suppress REPL warnings|
|`--banner={yes\|no\|auto}`             |Enable or disable startup banner|
|`--color={yes\|no\|auto}`              |Enable or disable color text|
|`--history-file={yes\|no}`             |Load or save history|
|`--depwarn={yes\|no\|error}`           |Enable or disable syntax and method deprecation warnings (`error` turns warnings into errors)|
|`--warn-overwrite={yes\|no}`           |Enable or disable method overwrite warnings|
|`-C`, `--cpu-target <target>`          |Limit usage of cpu features up to <target>; set to `help` to see the available options|
|`-O`, `--optimize={0,1,2,3}`           |Set the optimization level (default level is 2 if unspecified or 3 if used without a level)|
|`-g`, `-g <level>`                     |Enable / Set the level of debug info generation (default level is 1 if unspecified or 2 if used without a level)|
|`--inline={yes\|no}`                   |Control whether inlining is permitted, including overriding `@inline` declarations|
|`--check-bounds={yes\|no}`             |Emit bounds checks always or never (ignoring declarations)|
|`--math-mode={ieee,fast}`              |Disallow or enable unsafe floating point optimizations (overrides @fastmath declaration)|
|`--code-coverage={none\|user\|all}`    |Count executions of source lines|
|`--code-coverage`                      |equivalent to `--code-coverage=user`|
|`--track-allocation={none\|user\|all}` |Count bytes allocated by each source line|
|`--track-allocation`                   |equivalent to `--track-allocation=user`|

```@raw html
<!-- ## Resources -->
```

## 资源

除了本手册以外，官方网站上还有很多其它可以帮助新用户学习 Julia 的资源（英文），这里是一个学习资源的列表：[learning](https://julialang.org/learning/)
