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

A positive `Int` that determines how much time the max-sum subroutine
`MaxSum.maxsum()` of the package dependency resolver
will devote to attempting satisfying constraints before giving up: this value is
by default `1`, and larger values correspond to larger amounts of time.

Suppose the value of `$JULIA_PKGRESOLVE_ACCURACY` is `n`. Then

*   the number of pre-decimation iterations is `20*n`,
*   the number of iterations between decimation steps is `10*n`, and
*   at decimation steps, at most one in every `20*n` packages is decimated.

## 外部应用

### `JULIA_SHELL`

Julia 用来执行外部命令的 shell 的绝对路径（通过 `Base.repl_cmd()`）。默认为环境变量 `$SHELL`，如果 `$SHELL` 未设置，则为 `/bin/sh`。

!!! note

    在 Windows 上，此环境变量将被忽略，并且外部命令直接被执行。

### `JULIA_EDITOR`

由 `InteractiveUtils.editor()` 返回的编辑器并被使用，例如，[`InteractiveUtils.edit`](@ref)，引用首选编辑器的命令，比如 `vim`。

`$JULIA_EDITOR` 优先于 `$VISUAL`，而后者优先于 `$EDITOR`。如果这些环境变量都没有设置，那么编辑器在 Windows 和 OS X 上设置为 `open`，或者 `/etc/alternatives/editor` 如果其存在，否则为 `emacs`。

## Parallelization

### `JULIA_CPU_THREADS`

Overrides the global variable [`Base.Sys.CPU_THREADS`](@ref), the number of
logical CPU cores available.

### `JULIA_WORKER_TIMEOUT`

A [`Float64`](@ref) that sets the value of `Base.worker_timeout()` (default: `60.0`).
This function gives the number of seconds a worker process will wait for
a master process to establish a connection before dying.

### `JULIA_NUM_THREADS`

An unsigned 64-bit integer (`uint64_t`) that sets the maximum number of threads
available to Julia. If `$JULIA_NUM_THREADS` exceeds the number of available
physical CPU cores, then the number of threads is set to the number of cores. If
`$JULIA_NUM_THREADS` is not positive or is not set, or if the number of CPU
cores cannot be determined through system calls, then the number of threads is
set to `1`.

### `JULIA_THREAD_SLEEP_THRESHOLD`

If set to a string that starts with the case-insensitive substring `"infinite"`,
then spinning threads never sleep. Otherwise, `$JULIA_THREAD_SLEEP_THRESHOLD` is
interpreted as an unsigned 64-bit integer (`uint64_t`) and gives, in
nanoseconds, the amount of time after which spinning threads should sleep.

### `JULIA_EXCLUSIVE`

If set to anything besides `0`, then Julia's thread policy is consistent with
running on a dedicated machine: the master thread is on proc 0, and threads are
affinitized. Otherwise, Julia lets the operating system handle thread policy.

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

## Debugging and profiling

### `JULIA_GC_ALLOC_POOL`, `JULIA_GC_ALLOC_OTHER`, `JULIA_GC_ALLOC_PRINT`

If set, these environment variables take strings that optionally start with the
character `'r'`, followed by a string interpolation of a colon-separated list of
three signed 64-bit integers (`int64_t`). This triple of integers `a:b:c`
represents the arithmetic sequence `a`, `a + b`, `a + 2*b`, ... `c`.

*   If it's the `n`th time that `jl_gc_pool_alloc()` has been called, and `n`
    belongs to the arithmetic sequence represented by `$JULIA_GC_ALLOC_POOL`,
    then garbage collection is forced.
*   If it's the `n`th time that `maybe_collect()` has been called, and `n` belongs
    to the arithmetic sequence represented by `$JULIA_GC_ALLOC_OTHER`, then garbage
    collection is forced.
*   If it's the `n`th time that `jl_gc_collect()` has been called, and `n` belongs
    to the arithmetic sequence represented by `$JULIA_GC_ALLOC_PRINT`, then counts
    for the number of calls to `jl_gc_pool_alloc()` and `maybe_collect()` are
    printed.

If the value of the environment variable begins with the character `'r'`, then
the interval between garbage collection events is randomized.

!!! note

    These environment variables only have an effect if Julia was compiled with
    garbage-collection debugging (that is, if `WITH_GC_DEBUG_ENV` is set to `1`
    in the build configuration).

### `JULIA_GC_NO_GENERATIONAL`

If set to anything besides `0`, then the Julia garbage collector never performs
"quick sweeps" of memory.

!!! note

    This environment variable only has an effect if Julia was compiled with
    garbage-collection debugging (that is, if `WITH_GC_DEBUG_ENV` is set to `1`
    in the build configuration).

### `JULIA_GC_WAIT_FOR_DEBUGGER`

If set to anything besides `0`, then the Julia garbage collector will wait for
a debugger to attach instead of aborting whenever there's a critical error.

!!! note

    This environment variable only has an effect if Julia was compiled with
    garbage-collection debugging (that is, if `WITH_GC_DEBUG_ENV` is set to `1`
    in the build configuration).

### `ENABLE_JITPROFILING`

If set to anything besides `0`, then the compiler will create and register an
event listener for just-in-time (JIT) profiling.

!!! note

    This environment variable only has an effect if Julia was compiled with JIT
    profiling support, using either

*   Intel's [VTune™ Amplifier](https://software.intel.com/en-us/intel-vtune-amplifier-xe)
    (`USE_INTEL_JITEVENTS` set to `1` in the build configuration), or
*   [OProfile](http://oprofile.sourceforge.net/news/) (`USE_OPROFILE_JITEVENTS` set to `1`
    in the build configuration).

### `JULIA_LLVM_ARGS`

Arguments to be passed to the LLVM backend.

### `JULIA_DEBUG_LOADING`

If set, then Julia prints detailed information about the cache in the loading
process of [`Base.require`](@ref).

