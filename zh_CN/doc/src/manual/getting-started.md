# [入门](@id man-getting-started)

无论是使用预编译好的二进制程序，还是自己从源码编译，安装 Julia 都是一件很简单的事情。
请按照 [https://julialang.org/downloads/](https://julialang.org/downloads/) 的提示来下载并安装 Julia。

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

如果想非交互式地执行文件中的代码，可以把文件名作为 `julia` 命令的第一个参数：

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
$ julia --color=yes -O -- foo.jl arg1 arg2..
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

在你第一次运行 Julia 后，你一你应该多了一个 `~/.julia` 文件夹。
你还可以新建 `~/.julia/config` 文件夹和 `~/.julia/config/startup.jl` 文件来配置 Julia。

和 `perl` 和 `ruby` 程序类似，还有很多种运行 Julia 代码的方式，运行代码时也有很多选项：

```
julia [switches] -- [programfile] [args...]
```

|选项                                 |描述|
|:---                                   |:---|
|`-v`, `--version`                      |显示版本信息|
|`-h`, `--help`                         |显示命令行参数|
|`--project[={<dir>\|@.}]`              |将 <dir> 设置为主项目/环境。默认的 @. 选项将搜索父目录，直至找到 Project.toml 或 JuliaProject.toml 文件。|
|`-J`, `--sysimage <file>`              |用指定的系统镜像文件（system image file）启动|
|`-H`, `--home <dir>`                   |设置 `julia` 可执行文件的路径|
|`--startup-file={yes\|no}`             |是否载入 `~/.julia/config/startup.jl`|
|`--handle-signals={yes\|no}`           |开启或关闭 Julia 默认的 signal handlers|
|`--sysimage-native-code={yes\|no}`     |在可能的情况下，使用系统镜像里的原生代码|
|`--compiled-modules={yes\|no}`         |开启或关闭 module 的增量预编译功能|
|`-e`, `--eval <expr>`                  |执行 `<expr>`|
|`-E`, `--print <expr>`                 |执行 `<expr>` 并显示结果|
|`-L`, `--load <file>`                  |立即在所有进程中载入 `<file>` |
|`-t`, `--threads {N\|auto}`            |开启 N 个线程：`auto` 将 N 设置为当前 CPU 线程数，但这个行为可能在以后版本有所变动。|
|`-p`, `--procs {N\|auto}`              |这里的整数 N 表示启动 N 个额外的工作进程；`auto` 表示启动与 CPU 线程数目（logical cores）一样多的进程|
|`--machine-file <file>`                |在 `<file>` 中列出的主机上运行进程|
|`-i`                                   |交互式模式；REPL 运行且 `isinteractive()` 为 true|
|`-q`, `--quiet`                        |安静的启动；REPL 启动时无横幅，不显示警告|
|`--banner={yes\|no\|auto}`             |开启或关闭 REPL 横幅|
|`--color={yes\|no\|auto}`              |开启或关闭文字颜色|
|`--history-file={yes\|no}`             |载入或导出历史记录|
|`--depwarn={yes\|no\|error}`           |开启或关闭语法弃用警告，`error` 表示将弃用警告转换为错误。|
|`--warn-overwrite={yes\|no}`           |开启或关闭“method overwrite”警告|
|`-C`, `--cpu-target <target>`          |设置 `<target>` 来限制使用 CPU 的某些特性；设置为 `help` 可以查看可用的选项|
|`-O`, `--optimize={0,1,2,3}`           |设置编译器优化级别(若未配置此选项，则默认等级为2；若配置了此选项却没指定具体级别，则默认级别为3)。|
|`-g`, `-g <level>`                     |开启或设置 debug 信息的生成等级。若未配置此选项，则默认 debug 信息的级别为 1；若配置了此选项却没指定具体级别，则默认级别为 2。|
|`--inline={yes\|no}`                   |控制是否允许函数内联，此选项会覆盖源文件中的 `@inline` 声明|
|`--check-bounds={yes\|no}`             |设置边界检查状态：始终检查或永不检查。永不检查时会忽略源文件中的相应声明|
|`--math-mode={ieee,fast}`              |开启或关闭非安全的浮点数代数计算优化，此选项会覆盖源文件中的 `@fastmath` 声明|
|`--code-coverage={none\|user\|all}`    |对源文件中每行代码执行的次数计数|
|`--code-coverage`                      |等价于 `--code-coverage=user`|
|`--track-allocation={none\|user\|all}` |对源文件中每行代码的内存分配计数，单位 byte|
|`--track-allocation`                   |等价于 `--track-allocation=user`|

!!! compat "Julia 1.1"
    在 Julia 1.0 中，默认的 `--project=@.` 选项不会在 Git 仓库的根目录中寻找 `Project.toml` 文件。从 Julia 1.1 开始，此选项会在其中寻找该文件。

## 资源

除了本手册以外，官方网站还提供了一个有用的**[学习资源列表](https://julialang.org/learning/)**来帮助新用户学习 Julia。
