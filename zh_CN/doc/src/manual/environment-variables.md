# 环境变量

Julia 可以配置许多环境变量，可以以通常的操作系统方式，或者在 Julia 中以一种便携的方式。假设你要将环境变量 `JULIA_EDITOR` 设置为 `vim`，然后在 REPL 中输入 `ENV["JULIA_EDITOR"] = "vim"`，请根据具体情况进行此修改；或将其添加到用户主目录中的配置文件 `~/.julia/config/startup.jl`，这会永久生效。一些环境变量的当前值是通过求 `ENV["JULIA_EDITOR"]` 的值来确定。

Julia 使用的环境变量通常以 `JULIA` 开头。如果 [`InteractiveUtils.versioninfo`](@ref) 调用时 `verbose` 等于 `true`，那么输出将列出与 Julia 相关的已定义环境变量，包括那些名称中包含 `JULIA` 的环境变量。

## 文件位置

### `JULIA_BINDIR`

包含 Julia 可执行文件的目录的绝对路径会设置全局变量 [`Sys.BINDIR`](@ref)。`$JULIA_BINDIR` 如果没有设置，那么 Julia 在运行时确定 `Sys.BINDIR` 的值。

可执行文件是下列值中的一个

```
$JULIA_BINDIR/julia
$JULIA_BINDIR/julia-debug
```

在默认情况下。

全局变量 `Base.DATAROOTDIR` 确定一个从 `Sys.BINDIR` 到与 Julia 相关的数据目录的相对路径。路径

```
$JULIA_BINDIR/$DATAROOTDIR/julia/base
```

确定 Julia 最初搜索源文件的路径。（通过`Base.find_source_file()`）。

同样，全局变量 `Base.SYSCONFDIR` 确定了一个到配置文件目录的相对路径。Julia 在下列文件中搜索 `startup.jl` 文件

```
$JULIA_BINDIR/$SYSCONFDIR/julia/startup.jl
$JULIA_BINDIR/../etc/julia/startup.jl
```

在默认情况下（通过 `Base.load_julia_startup()`）。

例如，一个 Linux 安装包的 Julia 可执行文件位于 `/bin/julia`，`DATAROOTDIR` 为 `../share`，`SYSCONFDIR` 为 `../etc`，`JULIA_BINDIR` 会被设置为 `/bin`，会有一个源文件搜索路径

```
/share/julia/base
```

和一个全局配置搜索路径

```
/etc/julia/startup.jl
```

### `JULIA_LOAD_PATH`

一个由被附加到变量 [`LOAD_PATH`](@ref) 的绝对路径组成的分隔列表（在类 Unix 系统中，路径分隔符为 `:`；在 Windows 系统中，路径分隔符为 `;`）。`LOAD_PATH` 变量是 [`Base.require`](@ref) 和 `Base.load_in_path()` 寻找代码的地方。它默认为绝对路径 `$JULIA_HOME/../share/julia/stdlib/v$(VERSION.major).$(VERSION.minor)`，例如，在 0.7 版本的 Julia 上，其中系统为 Linux 且 Julia 可执行文件为 `/bin/julia`，`LOAD_PATH` 将默认为 `/share/julia/stdlib/v0.7`。

### `JULIA_HISTORY`

REPL 历史文件中 `REPL.find_hist_file()` 的绝对路径。如果 `$JULIA_HISTORY` 没有定义，`REPL.find_hist_file()` 默认为

```
$HOME/.julia/logs/repl_history.jl
```

### `JULIA_PKGRESOLVE_ACCURACY`

一个正的 `Int`，用于确定包依赖性解析器的 max-sum 子例程 `MaxSum.maxsum()` 在放弃之前将试图满足约束的时间：此变量默认为 `1`，更大的值对应更大的时间量。

假设 `$JULIA_PKGRESOLVE_ACCURACY` 的值是 `n`。那么

*   预抽取迭代次数为 `20*n`，
*   抽取步骤间的迭代次数是 `10*n`，并且
*   在抽取步骤中，每 `20*n` 包中至多有一个被抽取

## 外部应用

### `JULIA_SHELL`

Julia 用来执行外部命令的 shell 的绝对路径（通过 `Base.repl_cmd()`）。默认为环境变量 `$SHELL`，如果 `$SHELL` 未设置，则为 `/bin/sh`。

!!! note

    在 Windows 上，此环境变量将被忽略，并且外部命令直接被执行。

### `JULIA_EDITOR`

由 `InteractiveUtils.editor()` 返回的编辑器并被使用，例如，[`InteractiveUtils.edit`](@ref)，引用首选编辑器的命令，比如 `vim`。

`$JULIA_EDITOR` 优先于 `$VISUAL`，而后者优先于 `$EDITOR`。如果这些环境变量都没有设置，那么编辑器在 Windows 和 OS X 上设置为 `open`，或者 `/etc/alternatives/editor` 如果其存在，否则为 `emacs`。

## 并行

### `JULIA_CPU_THREADS`

改写全局变量 [`Base.Sys.CPU_THREADS`](@ref)，逻辑 CPU 核心数。

### `JULIA_WORKER_TIMEOUT`

一个 [`Float64`](@ref)，用来确定 `Base.worker_timeout()` 的值（默认：`60.0`）。此函数提供 worker 进程在死亡之前等待主进程建立链接的秒数。

### `JULIA_NUM_THREADS`

Julia一个无符号 64 位整数（`uint64_t`），用来设置 Julia 可用线程的最大数。如果 `$JULIA_NUM_THREADS` 超过可用的物理 CPU 核心数，那么线程数设置为核心数。如果 `$JULIA_NUM_THREADS` 不是正数或没有设置，或者无法通过系统调用确定 CPU 核心数，那么线程数就设置为 `1`。

### `JULIA_THREAD_SLEEP_THRESHOLD`

如果被设置为字符串且以大小写敏感的子字符串 `"infinite"` 开头，那么旋转线程从不睡眠。否则，`$JULIA_THREAD_SLEEP_THRESHOLD` 被解释为一个无符号 64 位整数（`uint64_t`），并且提供以纳秒为单位的旋转线程睡眠的时间量。

### `JULIA_EXCLUSIVE`

如果设置为 `0` 以外的任何值，那么 Julia 的线程策略与在专用计算机上一致：主线程在 proc 0 上且线程间是关联的。否则，Julia 让操作系统处理线程策略。

## REPL 格式化

决定 REPL 输出在终端中应当如何被格式化的环境变量。通常，这些变量应当被设置为 [ANSI 终端转义序列](http://ascii-table.com/ansi-escape-sequences.php)。Julia 提供了具有相同功能的高级接口：请参阅 [The Julia REPL](@ref)。

### `JULIA_ERROR_COLOR`

`Base.error_color()`（默认值：亮红，`"\033[91m"`），errors 在终端中的格式。

### `JULIA_WARN_COLOR`

`Base.warn_color()`（默认值：黄，`"\033[93m"`），warnings 在终端中的格式。

### `JULIA_INFO_COLOR`

`Base.info_color()`（默认值：青，`"\033[36m"`），info 在终端中的格式。

### `JULIA_INPUT_COLOR`

`Base.input_color()`（默认值：标准，`"\033[0m"`），输入在终端中的格式。

### `JULIA_ANSWER_COLOR`

`Base.answer_color()`（默认值：标准，`"\033[0m"`），输出在终端中的格式。

### `JULIA_STACKFRAME_LINEINFO_COLOR`

`Base.stackframe_lineinfo_color()`（默认值：粗体，`"\033[1m"`），堆栈跟踪时行信息在终端中的格式。

### `JULIA_STACKFRAME_FUNCTION_COLOR`

`Base.stackframe_function_color()`（默认值：粗体，`"\033[1m"`），堆栈跟踪期间函数调用在终端中的形式。

## 调试和性能分析

### `JULIA_GC_ALLOC_POOL`, `JULIA_GC_ALLOC_OTHER`, `JULIA_GC_ALLOC_PRINT`

这些环境变量取值为字符串，可以以字符 `‘r’` 开头，后接一个由三个带符号 64 位整数（`int64_t`）组成的、以冒号分割的列表的插值字符串。这个整数的三元组 `a:b:c` 代表算术序列 `a`, `a + b`, `a + 2*b`, ... `c`。

*   如果是第 `n` 次调用 `jl_gc_pool_alloc()`，并且 `n`
    属于 `$JULIA_GC_ALLOC_POOL` 代表的算术序列，
    那么垃圾收集是强制的。
*   如果是第 `n` 次调用 `maybe_collect()`，并且 `n` 属于
    `$JULIA_GC_ALLOC_OTHER` 代表的算术序列，那么垃圾
    收集是强制的。
*   如果是第 `n` 次调用 `jl_gc_alloc()`，并且 `n` 属于
    `$JULIA_GC_ALLOC_PRINT` 代表的算术序列，那么
    调用 `jl_gc_pool_alloc()` 和 `maybe_collect()` 的次数会
    被打印。

如果这些环境变量的值以字符 `‘r'` 开头，那么垃圾收集事件间的间隔是随机的。

!!! note

    这些环境变量生效要求 Julia 在编译时带有垃圾收集调试支持（也就是，在构建配置中 `WITH_GC_DEBUG_ENV` 设置为 `1`）。

### `JULIA_GC_NO_GENERATIONAL`

如果设置为 `0` 以外的任何值，那么 Julia 的垃圾收集器将从不执行「快速扫描」内存。

!!! note

    此环境变量生效要求 Julia 在编译时带有垃圾收集调试支持（也就是，在构建配置中 `WITH_GC_DEBUG_ENV` 设置为 `1`）。

### `JULIA_GC_WAIT_FOR_DEBUGGER`

如果设置为 `0` 以外的任何值，Julia 的垃圾收集器每当出现严重错误时将等待调试器连接而不是中止。

!!! note

    此环境变量生效要求 Julia 在编译时带有垃圾收集调试支持（也就是，在构建配置中 `WITH_GC_DEBUG_ENV` 设置为 `1`）。

### `ENABLE_JITPROFILING`

如果设置为 `0` 以外的任何值，那么编译器将为即时（JIT）性能分析创建并注册一个事件监听器。

!!! note

    此变量生效要求 Julia 编译时带有 JIT 性能分析支持，使用

*   英特尔的 [VTune™ Amplifier](https://software.intel.com/en-us/intel-vtune-amplifier-xe)
    （在构建配置中将 `USE_INTEL_JITEVENTS` 设置为 `1`），或
*   [OProfile](http://oprofile.sourceforge.net/news/)（`USE_OPROFILE_JITEVENTS` 设置为 `1`
    在构建配置中）。

### `JULIA_LLVM_ARGS`

要被传递给 LLVM 后端的参数。

### `JULIA_DEBUG_LOADING`

如果设置，那么Julia 打印在 [`Base.require`](@ref) 加载过程中缓存的详细信息。

