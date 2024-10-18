# [命令行选项](@id command-line-options)

以下是启动 julia 时可用的命令行选项的完整列表：

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
|`--min-optlevel={0,1,2,3}`             |设置每个模块加载的优化下限（默认为 0）|
|`-g`, `-g <level>`                     |开启或设置 debug 信息的生成等级。若未配置此选项，则默认 debug 信息的级别为 1；若配置了此选项却没指定具体级别，则默认级别为 2。|
|`--inline={yes\|no}`                   |控制是否允许函数内联，此选项会覆盖源文件中的 `@inline` 声明|
|`--check-bounds={yes\|no\|auto}`       |是否进行边界检查：总是、从不、或依照宏 @inbounds 声明|
|`--math-mode={ieee,fast}`              |开启或关闭非安全的浮点数代数计算优化，此选项会覆盖源文件中的 `@fastmath` 声明|
|`--code-coverage={none\|user\|all}`    |对源文件中每行代码执行的次数计数|
|`--code-coverage`                      |等价于 `--code-coverage=user`|
|`--track-allocation={none\|user\|all}` |对源文件中每行代码的内存分配计数，单位 byte|
|`--track-allocation`                   |等价于 `--track-allocation=user`|

!!! compat "Julia 1.1"
    在 Julia 1.0 中，默认的 `--project=@.` 选项不会在 Git 仓库的根目录中寻找 `Project.toml` 文件。从 Julia 1.1 开始，此选项会在其中寻找该文件。
