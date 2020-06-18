# 环境变量

Julia 可以配置许多环境变量，一种常见的方式是直接配置操作系统环境变量，另一种更便携的方式是在 Julia 中配置。假设你要将环境变量 `JULIA_EDITOR` 设置为 `vim`，可以直接在 REPL 中输入 `ENV["JULIA_EDITOR"] = "vim"`（请根据具体情况对此进行修改），也可以将其添加到用户主目录中的配置文件 `~/.julia/config/startup.jl`，这样做会使其永久生效。环境变量的当前值是通过执行 `ENV["JULIA_EDITOR"]` 来确定的。

The environment variables that Julia uses generally start with `JULIA`. If
[`InteractiveUtils.versioninfo`](@ref) is called with the keyword `verbose=true`, then the
output will list any defined environment variables relevant for Julia,
including those which include `JULIA` in their names.

!!! note

    Some variables, such as `JULIA_NUM_THREADS` and `JULIA_PROJECT`, need to be set before Julia
    starts, therefore adding these to `~/.julia/config/startup.jl` is too late in the startup process.
    In Bash, environment variables can either be set manually by running, e.g.,
    `export JULIA_NUM_THREADS=4` before starting Julia, or by adding the same command to
    `~/.bashrc` or `~/.bash_profile` to set the variable each time Bash is started.

## 文件位置

### `JULIA_BINDIR`

包含 Julia 可执行文件的目录的绝对路径，它会设置全局变量 [`Sys.BINDIR`](@ref)。`$JULIA_BINDIR` 如果没有设置，那么 Julia 会在运行时确定 `Sys.BINDIR` 的值。

在默认情况下，可执行文件是指：

```
$JULIA_BINDIR/julia
$JULIA_BINDIR/julia-debug
```

 

全局变量 `Base.DATAROOTDIR` 是一个从 `Sys.BINDIR` 到 Julia 数据目录的相对路径。

```
$JULIA_BINDIR/$DATAROOTDIR/julia/base
```

上述路径是 Julia 最初搜索源文件的路径（通过 `Base.find_source_file()`）。

同样，全局变量 `Base.SYSCONFDIR` 是一个到配置文件目录的相对路径。在默认情况下，Julia 会在下列文件中搜索 `startup.jl` 文件（通过 `Base.load_julia_startup()`）

```
$JULIA_BINDIR/$SYSCONFDIR/julia/startup.jl
$JULIA_BINDIR/../etc/julia/startup.jl
```

 

例如，一个 Linux 安装包的 Julia 可执行文件位于 `/bin/julia`，`DATAROOTDIR` 为 `../share`，`SYSCONFDIR` 为 `../etc`，`JULIA_BINDIR` 会被设置为 `/bin`，会有一个源文件搜索路径：

```
/share/julia/base
```

和一个全局配置文件搜索路径：

```
/etc/julia/startup.jl
```

### `JULIA_PROJECT`

A directory path that indicates which project should be the initial active project.
Setting this environment variable has the same effect as specifying the `--project`
start-up option, but `--project` has higher precedence. If the variable is set to `@.`
then Julia tries to find a project directory that contains `Project.toml` or
`JuliaProject.toml` file from the current directory and its parents. See also
the chapter on [Code Loading](@ref).

!!! note

    `JULIA_PROJECT` must be defined before starting julia; defining it in `startup.jl`
    is too late in the startup process.

### `JULIA_LOAD_PATH`

The `JULIA_LOAD_PATH` environment variable is used to populate the global Julia
[`LOAD_PATH`](@ref) variable, which determines which packages can be loaded via
`import` and `using` (see [Code Loading](@ref)).

Unlike the shell `PATH` variable, empty entries in `JULIA_LOAD_PATH` are expanded to
the default value of `LOAD_PATH`, `["@", "@v#.#", "@stdlib"]` when populating
`LOAD_PATH`. This allows easy appending, prepending, etc. of the load path value in
shell scripts regardless of whether `JULIA_LOAD_PATH` is already set or not. For
example, to prepend the directory `/foo/bar` to `LOAD_PATH` just do
```sh
export JULIA_LOAD_PATH="/foo/bar:$JULIA_LOAD_PATH"
```
If the `JULIA_LOAD_PATH` environment variable is already set, its old value will be
prepended with `/foo/bar`. On the other hand, if `JULIA_LOAD_PATH` is not set, then
it will be set to `/foo/bar:` which will expand to a `LOAD_PATH` value of
`["/foo/bar", "@", "@v#.#", "@stdlib"]`. If `JULIA_LOAD_PATH` is set to the empty
string, it expands to an empty `LOAD_PATH` array. In other words, the empty string
is interpreted as a zero-element array, not a one-element array of the empty string.
This behavior was chosen so that it would be possible to set an empty load path via
the environment variable. If you want the default load path, either unset the
environment variable or if it must have a value, set it to the string `:`.

### `JULIA_DEPOT_PATH`

The `JULIA_DEPOT_PATH` environment variable is used to populate the global Julia
[`DEPOT_PATH`](@ref) variable, which controls where the package manager, as well
as Julia's code loading mechanisms, look for package registries, installed
packages, named environments, repo clones, cached compiled package images,
configuration files, and the default location of the REPL's history file.

Unlike the shell `PATH` variable but similar to `JULIA_LOAD_PATH`, empty entries in
`JULIA_DEPOT_PATH` are expanded to the default value of `DEPOT_PATH`. This allows
easy appending, prepending, etc. of the depot path value in shell scripts regardless
of whether `JULIA_DEPOT_PATH` is already set or not. For example, to prepend the
directory `/foo/bar` to `DEPOT_PATH` just do
```sh
export JULIA_DEPOT_PATH="/foo/bar:$JULIA_DEPOT_PATH"
```
If the `JULIA_DEPOT_PATH` environment variable is already set, its old value will be
prepended with `/foo/bar`. On the other hand, if `JULIA_DEPOT_PATH` is not set, then
it will be set to `/foo/bar:` which will have the effect of prepending `/foo/bar` to
the default depot path. If `JULIA_DEPOT_PATH` is set to the empty string, it expands
to an empty `DEPOT_PATH` array. In other words, the empty string is interpreted as a
zero-element array, not a one-element array of the empty string. This behavior was
chosen so that it would be possible to set an empty depot path via the environment
variable. If you want the default depot path, either unset the environment variable
or if it must have a value, set it to the string `:`.

### `JULIA_HISTORY`

REPL 历史文件中 `REPL.find_hist_file()` 的绝对路径。如果没有设置 `$JULIA_HISTORY`，那么 `REPL.find_hist_file()` 默认为

```
$(DEPOT_PATH[1])/logs/repl_history.jl
```

## 外部应用

### `JULIA_SHELL`

Julia 用来执行外部命令的 shell 的绝对路径（通过 `Base.repl_cmd()`）。默认为环境变量 `$SHELL`，如果 `$SHELL` 未设置，则为 `/bin/sh`。

!!! note

    在 Windows 上，此环境变量将被忽略，并且外部命令会直接被执行。

### `JULIA_EDITOR`

`InteractiveUtils.editor()` 的返回值--编辑器，例如，[`InteractiveUtils.edit`](@ref)，会启动偏好编辑器，比如 `vim`。

`$JULIA_EDITOR` 优先于 `$VISUAL`，而后者优先于 `$EDITOR`。如果这些环境变量都没有设置，那么在 Windows 和 OS X 上会设置为 `open`，或者 `/etc/alternatives/editor`（如果存在的话），否则为 `emacs`。

## 并行

### `JULIA_CPU_THREADS`

改写全局变量 [`Base.Sys.CPU_THREADS`](@ref)，逻辑 CPU 核心数。

### `JULIA_WORKER_TIMEOUT`

一个 [`Float64`](@ref) 值，用来确定 `Distributed.worker_timeout()` 的值（默认：`60.0`）。此函数提供 worker 进程在死亡之前等待 master 进程建立连接的秒数。

### [`JULIA_NUM_THREADS`](@id JULIA_NUM_THREADS)

一个无符号 64 位整数（`uint64_t`），用来设置 Julia 可用线程的最大数。如果 `$JULIA_NUM_THREADS` 超过可用的物理 CPU 核心数，那么线程数设置为核心数。如果 `$JULIA_NUM_THREADS` 不是正数或没有设置，或者无法通过系统调用确定 CPU 核心数，那么线程数就会被设置为 `1`。

!!! note

    `JULIA_NUM_THREADS` 必须在启动 julia 前定义；在启动过程中于 `startup.jl` 中定义它为时已晚。

!!! compat "Julia 1.5"
    In Julia 1.5 and above the number of threads can also be specified on startup
    using the `-t`/`--threads` command line argument.

### `JULIA_THREAD_SLEEP_THRESHOLD`

如果被设置为字符串，并且以大小写敏感的子字符串 `"infinite"` 开头，那么z自旋线程从不睡眠。否则，`$JULIA_THREAD_SLEEP_THRESHOLD` 被解释为一个无符号 64 位整数（`uint64_t`），并且提供以纳秒为单位的自旋线程睡眠的时间量。

### `JULIA_EXCLUSIVE`

如果设置为 `0` 以外的任何值，那么 Julia 的线程策略与在专用计算机上一致：主线程在 proc 0 上且线程间是关联的。否则，Julia 让操作系统处理线程策略。

## REPL 格式化输出

决定 REPL 应当如何格式化输出的环境变量。通常，这些变量应当被设置为 [ANSI 终端转义序列](http://ascii-table.com/ansi-escape-sequences.php)。Julia 提供了具有相同功能的高级接口；请参阅 [Julia REPL](@ref) 章节。

### `JULIA_ERROR_COLOR`

`Base.error_color()`（默认值：亮红，`"\033[91m"`），errors 在终端中的格式。

### `JULIA_WARN_COLOR`

`Base.warn_color()`（默认值：黄，`"\033[93m"`），warnings 在终端中的格式。

### `JULIA_INFO_COLOR`

`Base.info_color()`（默认值：青，`"\033[36m"`），info 在终端中的格式。

### `JULIA_INPUT_COLOR`

`Base.input_color()`（默认值：标准，`"\033[0m"`），在终端中，输入应有的格式。

### `JULIA_ANSWER_COLOR`

`Base.answer_color()`（默认值：标准，`"\033[0m"`），在终端中，输出应有的格式。

### `JULIA_STACKFRAME_LINEINFO_COLOR`

`Base.stackframe_lineinfo_color()`（默认值：粗体，`"\033[1m"`），栈跟踪时行信息在终端中的格式。

### `JULIA_STACKFRAME_FUNCTION_COLOR`

`Base.stackframe_function_color()`（默认值：粗体，`"\033[1m"`），栈跟踪期间函数调用在终端中的形式。

## 调试和性能分析

### `JULIA_DEBUG`

Enable debug logging for a file or module, see [`Logging`](@ref Logging) for more information.

### `JULIA_GC_ALLOC_POOL`, `JULIA_GC_ALLOC_OTHER`, `JULIA_GC_ALLOC_PRINT`

这些环境变量取值为字符串，可以以字符 `‘r’` 开头，后接一个由三个带符号 64 位整数（`int64_t`）组成的、以冒号分割的列表的插值字符串。这个整数的三元组 `a:b:c` 代表算术序列 `a`, `a + b`, `a + 2*b`, ... `c`。

*   如果是第 `n` 次调用 `jl_gc_pool_alloc()`，并且 `n`
    属于 `$JULIA_GC_ALLOC_POOL` 代表的算术序列，
    那么垃圾回收是强制的。
*   如果是第 `n` 次调用 `maybe_collect()`，并且 `n` 属于
    `$JULIA_GC_ALLOC_OTHER` 代表的算术序列，那么垃圾
    回收是强制的。
*   如果是第 `n` 次调用 `jl_gc_alloc()`，并且 `n` 属于
    `$JULIA_GC_ALLOC_PRINT` 代表的算术序列，那么
    调用 `jl_gc_pool_alloc()` 和 `maybe_collect()` 的次数会
    被打印。

如果这些环境变量的值以字符 `‘r'` 开头，那么垃圾回收事件间的间隔是随机的。

!!! note

    这些环境变量生效要求 Julia 在编译时带有垃圾收集调试支持（也就是，在构建配置中将 `WITH_GC_DEBUG_ENV` 设置为 `1`）。

### `JULIA_GC_NO_GENERATIONAL`

如果设置为 `0` 以外的任何值，那么 Julia 的垃圾收集器将从不执行「快速扫描」内存。

!!! note

    此环境变量生效要求 Julia 在编译时带有垃圾收集调试支持（也就是，在构建配置中将 `WITH_GC_DEBUG_ENV` 设置为 `1`）。

### `JULIA_GC_WAIT_FOR_DEBUGGER`

如果设置为 `0` 以外的任何值，Julia 的垃圾收集器每当出现严重错误时将等待调试器连接而不是中止。

!!! note

    此环境变量生效要求 Julia 在编译时带有垃圾收集调试支持（也就是，在构建配置中将 `WITH_GC_DEBUG_ENV` 设置为 `1`）。

### `ENABLE_JITPROFILING`

如果设置为 `0` 以外的任何值，那么编译器将为即时（JIT）性能分析创建并注册一个事件监听器。

!!! note

    此变量生效要求 Julia 编译时带有 JIT 性能分析支持，请使用
    * 英特尔的 [VTune™ Amplifier](https://software.intel.com/en-us/intel-vtune-amplifier-xe)（在构建配置中将 `USE_INTEL_JITEVENTS` 设置为 `1`），或
    * [OProfile](http://oprofile.sourceforge.net/news/)（在构建配置中将 `USE_OPROFILE_JITEVENTS` 设置为 `1`）。

### `JULIA_LLVM_ARGS`

传递给 LLVM 后端的参数。


