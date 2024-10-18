# 环境变量

Julia 可以配置许多环境变量，一种常见的方式是直接配置操作系统环境变量，另一种更便携的方式是在 Julia 中配置。假设你要将环境变量 `JULIA_EDITOR` 设置为 `vim`，可以直接在 REPL 中输入 `ENV["JULIA_EDITOR"] = "vim"`（请根据具体情况对此进行修改），也可以将其添加到用户主目录中的配置文件 `~/.julia/config/startup.jl`，这样做会使其永久生效。环境变量的当前值是通过执行 `ENV["JULIA_EDITOR"]` 来确定的。

Julia 使用的环境变量通常以 `JULIA` 开头。如果调用 [`InteractiveUtils.versioninfo`](@ref) 时使用关键字参数 `verbose = true`，那么输出结果将列出与 Julia 相关的已定义环境变量，即包括那些名称中包含 `JULIA` 的环境变量。

!!! note

    某些变量需要在 Julia 启动之前设置，比如 `JULIA_NUM_THREADS` 和 `JULIA_PROJECT`，因为在启动过程中将这些变量添加到 `~/.julia/config/startup.jl` 中为时已晚。在 Bash 中，环境变量可以手动设置，这可通过在 Julia 启动前运行诸如 `export JULIA_NUM_THREADS=4` 的命令，亦可通过向 `~/.bashrc` 或 `~/.bash_profile` 添加相同命令来在 Bash 每次启动时设置该变量。

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

 

例如，在 Linux 下安装的 Julia 可执行文件位于 `/bin/julia`，`DATAROOTDIR` 为 `../share`，`SYSCONFDIR` 为 `../etc`，`JULIA_BINDIR` 会被设置为 `/bin`，会有一个源文件搜索路径：

```
/share/julia/base
```

和一个全局配置文件搜索路径：

```
/etc/julia/startup.jl
```

### `JULIA_PROJECT`

指示哪个项目应该是初始活动项目的目录路径。 设置这个环境变量和指定`--project`启动选项效果一样，但是`--project`优先级更高。
如果变量设置为 `@.` （注意尾随的点），那么 Julia 会尝试从当前目录及其父目录中查找包含 `Project.toml` 或 `JuliaProject.toml` 文件的项目目录。
另请参阅有关 [代码加载](@ref code-loading) 的章节。

!!! note

    `JULIA_PROJECT` 必须在启动 julia 前定义；于 `startup.jl` 中定义它对于启动的过程为时已晚。

### `JULIA_LOAD_PATH`

`JULIA_LOAD_PATH` 环境变量用于补充全局的 Julia 变量 [`LOAD_PATH`](@ref) ，该变量可用于确定通过 `import` 和 `using` 可以加载哪些包（请参阅 [Code Loading](@ref code-loading)）。

与 shell 使用的 `PATH` 变量不同， 在 `JULIA_LOAD_PATH` 中的空条目将会在填充 `LOAD_PATH` 时被扩展为 `LOAD_PATH` 的默认值 `["@", "@v#.#", "@stdlib"]` 。这样，无论 `JULIA_LOAD_PATH` 是否已被设置，均可以使用 shell 脚本轻松地在加载路径前面或后面添加值。例如要将 `/foo/bar` 添加到 `LOAD_PATH` 之前，只需要使用下列脚本：
```sh
export JULIA_LOAD_PATH="/foo/bar:$JULIA_LOAD_PATH"
```
如果已经设置了 `JULIA_LOAD_PATH` 环境变量，那么 `/foo/bar` 将被添加在原有值之前。另一方面，如果 `JULIA_LOAD_PATH` 尚未设置，那么它会被设置为 `/foo/bar:` ，而这将使用 `LOAD_PATH` 的值扩展为 `["/foo/bar", "@", "@v#.#", "@stdlib"]` 。如果 `JULIA_LOAD_PATH` 被设置为空字符串，那么它将被扩展为一个空的 `LOAD_PATH` 数组。换句话说，这个空字符串数组将被认为是零元素的数组，而非是一个空字符串单元素的数组。使用这样的加载行为是为了可以通过环境变量设置空的加载路径。如果你需要使用默认的加载路径，请不要设置这一环境变量，如果它必须有值，那么可将其设置为字符串 `:` 。

!!! note

    在 Windows 上，路径元素由 `;` 字符分隔，就像 Windows 上的大多数路径列表一样。 将上一段中的 `:` 替换为 `;`。

### `JULIA_DEPOT_PATH`

`JULIA_DEPOT_PATH` 环境变量用于填充全局的 Julia 变量 [`DEPOT_PATH`](@ref) ，该变量用于控制包管理器以及 Juila 代码加载机制在何处查找包注册表、已安装的包、命名环境、克隆的存储库、缓存的预编译包映像、配置文件和 REPL 历史记录文件的默认位置。

与 shell 使用的 `PATH` 变量不同，但与 `JULIA_LOAD_PATH` 类似， 在 `JULIA_DEPOT_PATH` 中的空条目将会被扩展为 `DEPOT_PATH` 的默认值。这样，无论 `JULIA_DEPOT_PATH` 是否已被设置，均可以使用 shell 脚本轻松地在仓库路径前面或后面添加值。例如要将 `/foo/bar` 添加到 `DEPOT_PATH` 之前，只需要使用下列脚本：

```sh
export JULIA_DEPOT_PATH="/foo/bar:$JULIA_DEPOT_PATH"
```

如果已经设置了 `JULIA_DEPOT_PATH` 环境变量，那么 `/foo/bar` 将被添加在原有值之前。另一方面，如果 `JULIA_DEPOT_PATH` 尚未设置，那么它会被设置为 `/foo/bar:` ，而这将使 `/foo/bar` 被添加到默认仓库路径之前。如果 `JULIA_DEPOT_PATH` 被设置为空字符串，那么它将扩展为一个空的 `DEPOT_PATH` 数组。换句话说，这个空字符串数组将被认为是零元素的数组，而非是一个空字符串单元素的数组。使用这样的加载行为是为了可以通过环境变量设置空的仓库路径。如果你需要使用默认的仓库路径，请不要设置这一环境变量，如果它必须有值，那么可将其设置为字符串 `:` 。

!!! note

    在 Windows 上，路径元素由 `;` 字符分隔，就像 Windows 上的大多数路径列表一样。 将上一段中的 `:` 替换为 `;`。

!!! note
    `JULIA_DEPOT_PATH` must be defined before starting julia; defining it in
    `startup.jl` is too late in the startup process; at that point you can instead
    directly modify the `DEPOT_PATH` array, which is populated from the environment
    variable.

### `JULIA_HISTORY`

REPL 历史文件中 `REPL.find_hist_file()` 的绝对路径。如果没有设置 `$JULIA_HISTORY`，那么 `REPL.find_hist_file()` 默认为

```
$(DEPOT_PATH[1])/logs/repl_history.jl
```

### [`JULIA_MAX_NUM_PRECOMPILE_FILES`](@id env-max-num-precompile-files)

Sets the maximum number of different instances of a single package that are to be stored in the precompile cache (default = 10).

### `JULIA_VERBOSE_LINKING`

If set to true, linker commands will be displayed during precompilation.

## Pkg.jl

### `JULIA_CI`

If set to `true`, this indicates to the package server that any package operations are part of a continuous integration (CI) system for the purposes of gathering package usage statistics.

### `JULIA_NUM_PRECOMPILE_TASKS`

The number of parallel tasks to use when precompiling packages. See [`Pkg.precompile`](https://pkgdocs.julialang.org/v1/api/#Pkg.precompile).

### `JULIA_PKG_DEVDIR`

The default directory used by [`Pkg.develop`](https://pkgdocs.julialang.org/v1/api/#Pkg.develop) for downloading packages.

### `JULIA_PKG_IGNORE_HASHES`

If set to `1`, this will ignore incorrect hashes in artifacts. This should be used carefully, as it disables verification of downloads, but can resolve issues when moving files across different types of file systems. See [Pkg.jl issue #2317](https://github.com/JuliaLang/Pkg.jl/issues/2317) for more details.

!!! compat "Julia 1.6"
    This is only supported in Julia 1.6 and above.

### `JULIA_PKG_OFFLINE`

If set to `true`, this will enable offline mode: see [`Pkg.offline`](https://pkgdocs.julialang.org/v1/api/#Pkg.offline).

!!! compat "Julia 1.5"
    Pkg's offline mode requires Julia 1.5 or later.

### `JULIA_PKG_PRECOMPILE_AUTO`

If set to `0`, this will disable automatic precompilation by package actions which change the manifest. See [`Pkg.precompile`](https://pkgdocs.julialang.org/v1/api/#Pkg.precompile).

### `JULIA_PKG_SERVER`

由`Pkg.jl` 使用，用于下载软件包和更新注册表。默认情况下，`Pkg` 使用 `https://pkg.julialang.org` 来获取 Julia 包。
你可以使用此环境变量来选择不同的服务器。此外，你可以禁用 PkgServer 协议的使用，并通过设置直接从它们的主机（GitHub、GitLab 等）访问包：

```
export JULIA_PKG_SERVER=""
```

### `JULIA_PKG_SERVER_REGISTRY_PREFERENCE`

Specifies the preferred registry flavor. Currently supported values are `conservative`
(the default), which will only publish resources that have been processed by the storage
server (and thereby have a higher probability of being available from the PkgServers),
whereas `eager` will publish registries whose resources have not necessarily been
processed by the storage servers.  Users behind restrictive firewalls that do not allow
downloading from arbitrary servers should not use the `eager` flavor.

!!! compat "Julia 1.7"
    This only affects Julia 1.7 and above.

### `JULIA_PKG_UNPACK_REGISTRY`

If set to `true`, this will unpack the registry instead of storing it as a compressed tarball.

!!! compat "Julia 1.7"
    This only affects Julia 1.7 and above. Earlier versions will always unpack the registry.

### `JULIA_PKG_USE_CLI_GIT`

If set to `true`, Pkg operations which use the git protocol will use an external `git` executable instead of the default libgit2 library.

!!! compat "Julia 1.7"
    Use of the `git` executable is only supported on Julia 1.7 and above.

### `JULIA_PKGRESOLVE_ACCURACY`

The accuracy of the package resolver. This should be a positive integer, the default is `1`.

### [`JULIA_PKG_PRESERVE_TIERED_INSTALLED`](@id JULIA_PKG_PRESERVE_TIERED_INSTALLED)

Change the default package installation strategy to `Pkg.PRESERVE_TIERED_INSTALLED`
to let the package manager try to install versions of packages while keeping as many
versions of packages already installed as possible.

!!! compat "Julia 1.9"
    This only affects Julia 1.9 and above.

## Network transport

### `JULIA_NO_VERIFY_HOSTS` / `JULIA_SSL_NO_VERIFY_HOSTS` / `JULIA_SSH_NO_VERIFY_HOSTS` / `JULIA_ALWAYS_VERIFY_HOSTS`

Specify hosts whose identity should or should not be verified for specific transport layers. See [`NetworkOptions.verify_host`](https://github.com/JuliaLang/NetworkOptions.jl#verify_host)

### `JULIA_SSL_CA_ROOTS_PATH`

Specify the file or directory containing the certificate authority roots. See [`NetworkOptions.ca_roots`](https://github.com/JuliaLang/NetworkOptions.jl#ca_roots)

## External applications

### `JULIA_SHELL`

Julia 用来执行外部命令的 shell 的绝对路径（通过 `Base.repl_cmd()`）。默认为环境变量 `$SHELL`，如果 `$SHELL` 未设置，则为 `/bin/sh`。

!!! note

    在 Windows 上，此环境变量将被忽略，并且外部命令会直接被执行。

### `JULIA_EDITOR`

`InteractiveUtils.editor()` 的返回值--编辑器，例如，[`InteractiveUtils.edit`](@ref)，会启动偏好编辑器，比如 `vim`。

`$JULIA_EDITOR` 优先于 `$VISUAL`，而后者优先于 `$EDITOR`。如果这些环境变量都没有设置，那么在 Windows 和 OS X 上会设置为 `open`，或者 `/etc/alternatives/editor`（如果存在的话），否则为 `emacs`。

To use Visual Studio Code on Windows, set `$JULIA_EDITOR` to `code.cmd`.

## 并行

### [`JULIA_CPU_THREADS`](@id env-cpu-threads)

改写全局变量 [`Base.Sys.CPU_THREADS`](@ref)，逻辑 CPU 核心数。

### `JULIA_WORKER_TIMEOUT`

一个 [`Float64`](@ref) 值，用来确定 `Distributed.worker_timeout()` 的值（默认：`60.0`）。此函数提供 worker 进程在死亡之前等待 master 进程建立连接的秒数。

### [`JULIA_NUM_THREADS`](@id JULIA_NUM_THREADS)

一个无符号 64 位整数 (`uint64_t`)，用于设置 Julia 可用的最大线程数。 如果`$JULIA_NUM_THREADS` 不为正数或未设置，或者无法通过系统调用确定CPU 线程数，则将线程数设置为`1`。

如果`$JULIA_NUM_THREADS` 设置为`auto`，则线程数将设置为CPU线程数。

!!! note
    `JULIA_NUM_THREADS` 必须在启动 julia 之前定义； 启动过程中在`startup.jl` 中定义它是不能奏效的。

!!! compat "Julia 1.5"
    在 Julia 1.5 和更高版本中，也可在启动时使用 `-t`/`--threads` 命令行参数指定线程数。

!!! compat "Julia 1.7"
    `$JULIA_NUM_THREADS` 的 `auto` 值需要 Julia 1.7 或更高版本。

!!! compat "Julia 1.7"
    The `auto` value for `$JULIA_NUM_THREADS` requires Julia 1.7 or above.

### `JULIA_THREAD_SLEEP_THRESHOLD`

如果被设置为字符串，并且以大小写敏感的子字符串 `"infinite"` 开头，那么自旋线程从不睡眠。否则，`$JULIA_THREAD_SLEEP_THRESHOLD` 被解释为一个无符号 64 位整数（`uint64_t`），并且提供以纳秒为单位的自旋线程睡眠的时间量。

### [`JULIA_NUM_GC_THREADS`](@id env-gc-threads)

Sets the number of threads used by Garbage Collection. If unspecified is set to
half of the number of worker threads.

!!! compat "Julia 1.10"
    The environment variable was added in 1.10

### [`JULIA_IMAGE_THREADS`](@id env-image-threads)

An unsigned 32-bit integer that sets the number of threads used by image
compilation in this Julia process. The value of this variable may be
ignored if the module is a small module. If left unspecified, the smaller
of the value of [`JULIA_CPU_THREADS`](@ref env-cpu-threads) or half the
number of logical CPU cores is used in its place.

### `JULIA_IMAGE_TIMINGS`

A boolean value that determines if detailed timing information is printed during
during image compilation. Defaults to 0.

### `JULIA_EXCLUSIVE`

如果设置为 `0` 以外的任何值，那么 Julia 的线程策略与在专用计算机上一致：主线程在 proc 0 上且线程间是关联的。否则，Julia 让操作系统处理线程策略。

## REPL 格式化输出

决定 REPL 应当如何格式化输出的环境变量。通常，这些变量应当被设置为 [ANSI 终端转义序列](https://en.wikipedia.org/wiki/ANSI_escape_code)。
Julia 提供了具有相同功能的高级接口；请参阅 [Julia REPL](@ref The-Julia-REPL) 章节。

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

## System and Package Image Building

### [`JULIA_CPU_TARGET`](@id JULIA_CPU_TARGET)

Modify the target machine architecture for (pre)compiling
[system](@ref sysimg-multi-versioning) and [package images](@ref pkgimgs-multi-versioning).
`JULIA_CPU_TARGET` only affects machine code image generation being output to a disk cache.
Unlike the `--cpu-target`, or `-C`, [command line option](@ref cli), it does not influence
just-in-time (JIT) code generation within a Julia session where machine code is only
stored in memory.

Valid values for `JULIA_CPU_TARGET` can be obtained by executing `julia -C help`.

Setting `JULIA_CPU_TARGET` is important for heterogeneous compute systems where processors of
distinct types or features may be present. This is commonly encountered in high performance
computing (HPC) clusters since the component nodes may be using distinct processors.

The CPU target string is a list of strings separated by `;` each string starts with a CPU
or architecture name and followed by an optional list of features separated by `,`.
A `generic` or empty CPU name means the basic required feature set of the target ISA
which is at least the architecture the C/C++ runtime is compiled with. Each string
is interpreted by LLVM.

A few special features are supported:
1. `clone_all`

     This forces the target to have all functions in sysimg cloned.
     When used in negative form (i.e. `-clone_all`), this disables full clone that's
     enabled by default for certain targets.

2. `base([0-9]*)`

     This specifies the (0-based) base target index. The base target is the target
     that the current target is based on, i.e. the functions that are not being cloned
     will use the version in the base target. This option causes the base target to be
     fully cloned (as if `clone_all` is specified for it) if it is not the default target (0).
     The index can only be smaller than the current index.

3. `opt_size`

     Optimize for size with minimum performance impact. Clang/GCC's `-Os`.

4. `min_size`

     Optimize only for size. Clang's `-Oz`.


## Debugging and profiling

### `JULIA_DEBUG`

Enable debug logging for a file or module, see [`Logging`](@ref man-logging) for more information.

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

    此环境变量仅在使用 JIT 性能分析支持编译 Julia 时有效，使用如下之一：
    * Intel's [VTune™ Amplifier](https://software.intel.com/en-us/vtune)(`USE_INTEL_JITEVENTS` 在配置中设置为`1`), 或
    * [OProfile](https://oprofile.sourceforge.io/news/)(`USE_OPROFILE_JITEVENTS` 在配置中设置为`1`)。
    * [Perf](https://perf.wiki.kernel.org) (`USE_PERF_JITEVENTS` 在构建配置中设置为 `1`)。 默认情况下启用此集成。

### `ENABLE_GDBLISTENER`

如果设置为除`0`之外的任何内容，则在发布版本上启用 Julia 代码的 GDB 注册。 在 Julia 的调试版本中，这始终处于启用状态。 推荐与 `-g 2` 一起使用。


### `JULIA_LLVM_ARGS`

要传递给 LLVM 后端的参数。
