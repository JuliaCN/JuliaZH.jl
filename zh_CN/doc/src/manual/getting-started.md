# [起步](@id man-getting-started)

不管是用编译好的程序，还是自己从源码编译，安装 Julia 都是一件很简单的事情。
只要按照 [https://julialang.org/downloads/](https://julialang.org/downloads/) 的提示就可以轻松下载并安装 Julia。

启动一个交互式会话（也叫 REPL）是学习和尝试 Julia 最简单的方法。双击 Julia 的可执行文件或是从命令行运行 `julia` 就可以启动：

```@eval
io = IOBuffer()
Base.banner(io)
banner = String(take!(io))
import Markdown
Markdown.parse("```\n\$ julia\n\n$(banner)\njulia> 1 + 2\n3\n\njulia> ans\n3\n```")
```

输入 `CTRL-D` （同时按`Ctrl` 键和 `d` 键）或 `exit()` 便可以退出交互式会话。在交互式模式中，`julia` 会显示一个横幅并提示用户输入。一旦用户输入了一段完整的代码，例如 `1 + 2`，然后敲回车，交互式会话就会执行这段代码，并将结果显示出来。如果输入的代码以分号结尾，那么结果将不会显示出来。然而不管结果显示与否，变量 `ans`总会存储上一次执行代码的结果，需要注意的是，变量`ans` 只在交互式会话中才有，不适用于其它方法运行的 Julia。

在交互式会话中，要运行写在源文件 `file.jl` 中的代码，只需输入 `include("file.jl")`。

如果想非交互式地执行文件中的代码，可以把文件名作为 `julia` 命令的第一个参数：

```
$ julia script.jl arg1 arg2...
```

如这个例子所示，`julia` 后跟着的命令行参数会被作为程序 `script.jl` 的命令行参数。这些参数使用全局常量 `ARGS` 来传递，脚本自身的名字会以全局常量 `PROGRAM_FILE` 传入。注意当脚本以命令行里的 `-e` 选项输入时，`ARGS` 也会被设定（见下面的 `julia` 帮助输出）但是 `PROGRAM_FILE` 会是空的。比如说，如果想把输入给一个脚本的参数给显示出来，你可以这么写：

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

可以使用 `--` 分隔符来将传给脚本文件和 Julia 本身的命令行参数区分开：

```
$ julia --color=yes -O -- foo.jl arg1 arg2..
```

使用选项 `-p` 或者 `--machine-file` 可以在并行模式下启动 Julia。`-p n` 会启动额外的 `n` 个 worker，使用 `--machine-file file` 会为 `file` 文件中的每一行启动一个 worker。被定义在 `file` 中的机器必须能够通过一个不需要密码的 `ssh` 登陆访问到，且 Julia 的安装位置需要和当前主机相同。定义机器的格式为 `[count*][user@]host[:port] [bind_addr[:port]]`。`user` 默认值是当前用户，`port` 默认值是标准 ssh 端口。`count` 是在这个节点上的 worker 的数量，默认是 1。可选的 `bind-to bind_addr[:port]` 指定了其它 worker 访问当前 worker 应当使用的 IP 地址与端口。

如果你有一些代码，想让 Julia 每次启动都会自动执行，可以把它们放在`~/.julia/config/startup.jl`中：

```
$ echo 'println("Greetings! 你好! 안녕하세요?")' > ~/.julia/config/startup.jl
$ julia
Greetings! 你好! 안녕하세요?

...
```

还有很多种运行 Julia 代码和提供选项的方法，和 `perl` 和 `ruby` 语言支持的方法类似：

```
julia [switches] -- [programfile] [args...]
```

|选项                                 |描述|
|:---                                   |:---|
|`-v`, `--version`                      |显示版本信息|
|`-h`, `--help`                         |打印本条信息|
|`-J`, `--sysimage <file>`              |用指定的镜像文件（ system image file）启动|
|`-H`, `--home <dir>`                   |配置`julia`可执行文件的路径|
|`--startup-file={yes\|no}`             |是否载入 `~/.julia/config/startup.jl`|
|`--handle-signals={yes\|no}`           |开启或关闭Julia默认的signal handlers|
|`--sysimage-native-code={yes\|no}`     |在可能的情况下，使用系统镜像里的原生代码|
|`--compiled-modules={yes\|no}`         |开启或关闭module的增量预编译功能|
|`-e`, `--eval <expr>`                  |执行 `<expr>`|
|`-E`, `--print <expr>`                 |执行 `<expr>` 并显示结果|
|`-L`, `--load <file>`                  |立即在所有进程中载入 `<file>` |
|`-p`, `--procs {N\|auto`}              |这里的整数N表示启动N个额外的进程；`auto`表示启动与CPU线程数目（logical cores）一样多的进程|
|`--machine-file <file>`                |Run processes on hosts listed in `<file>`|
|`-i`                                   |非交互式模式；REPL运行且`isinteractive()`为true|
|`-q`, `--quiet`                        |静启动；REPL启动时无横幅，不显示警告|
|`--banner={yes\|no\|auto}`             |开启或关闭REPL横幅|
|`--color={yes\|no\|auto}`              |开启或关闭文字颜色|
|`--history-file={yes\|no}`             |载入或导出历史记录|
|`--depwarn={yes\|no\|error}`           |开启或关闭语法弃用警告，`error` 表示将弃用警告转换为错误。|
|`--warn-overwrite={yes\|no}`           |开启或关闭method overwrite警告|
|`-C`, `--cpu-target <target>`          |Limit usage of cpu features up to <target>; set to `help` to see the available options|
|`-O`, `--optimize={0,1,2,3}`           |设置编译器优化级别，若未配置此选项，则默认等级为2，若配置了此选项却没指定具体级别，则默认级别为3.|
|`-g`, `-g <level>`                     |开启或配置debug信息的生成等级，若未配置此选项，则默认debug信息的级别为1，若配置了此选项却没指定具体级别，则默认级别为2。|
|`--inline={yes\|no}`                   |控制是否允许函数内联，此选项会覆盖源文件中的`@inline`声明|
|`--check-bounds={yes\|no}`             |将边界检查设置为始终检查或永远不检查，使用此选项会导致源文件中的相应声明会被忽略|
|`--math-mode={ieee,fast}`              |开启或关闭非安全的浮点数代数计算优化，此选项会覆盖源文件中的`@fastmath`声明|
|`--code-coverage={none\|user\|all}`    |对源文件中每行代码执行的次数计数|
|`--code-coverage`                      |等价于`--code-coverage=user`|
|`--track-allocation={none\|user\|all}` |对源文件中每行代码的内存分配计数，单位byte|
|`--track-allocation`                   |equivalent to `--track-allocation=user`|

## 资源

除了本手册以外，官方网站还提供了一个有用的**[学习资源列表](https://julialang.org/learning/)**来帮助新用户学习 Julia。
