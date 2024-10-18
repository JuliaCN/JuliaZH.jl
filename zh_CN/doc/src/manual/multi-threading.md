# [多线程](@id man-multithreading)

访问此 [博客文章](https://julialang.org/blog/2019/07/multithreading/) 以了解 Julia 多线程特性。

## 启用Julia多线程

Julia 默认启动一个线程执行代码，这点可以通过 [`Threads.nthreads()`](@ref) 来确认：

```jldoctest
julia> Threads.nthreads()
1
```

执行线程的数量通过使用`-t`/`--threads` 命令行参数或使用[`JULIA_NUM_THREADS`](@ref JULIA_NUM_THREADS) 环境变量。 当两者都被指定时，`-t`/`--threads` 优先级更高。

The number of threads can either be specified as an integer (`--threads=4`) or as `auto`
(`--threads=auto`), where `auto` tries to infer a useful default number of threads to use
(see [Command-line Options](@ref command-line-interface) for more details).

!!! compat "Julia 1.5"
    `-t`/`--threads` 命令行参数至少需要 Julia 1.5。在旧版本中，你必须改用环境变量。

!!! compat "Julia 1.7"
    Using `auto` as value of the environment variable `JULIA_NUM_THREADS` requires at least Julia 1.7.
    In older versions, this value is ignored.

让我们以4个线程启动 Julia：
```bash
$ julia --threads 4
```

现在确认下确实有4个线程：

```julia-repl
julia> Threads.nthreads()
4
```

不过我们现在是在 master 线程，用 [`Threads.threadid`](@ref) 确认下：

```jldoctest
julia> Threads.threadid()
1
```

!!! note
    如果你更喜欢使用环境变量，可以按如下方式设置它
    Bash (Linux/macOS):
    ```bash
    export JULIA_NUM_THREADS=4
    ```
    C shell on Linux/macOS, CMD on Windows:
    ```bash
    set JULIA_NUM_THREADS=4
    ```
    Powershell on Windows:
    ```powershell
    $env:JULIA_NUM_THREADS=4
    ```
    Note that this must be done *before* starting Julia.

!!! note
    使用 `-t`/`--threads` 指定的线程数传播到使用 `-p`/`--procs` 或 `--machine-file` 命令行选项产生的工作进程。 例如，`julia -p2 -t2` 产生 1 个主进程和 2 个工作进程，并且所有三个进程都启用了 2 个线程。 要对工作线程进行更细粒度的控制，请使用 [`addprocs`](@ref) 并将 `-t`/`--threads` 作为 `exeflags` 传递。

### Multiple GC Threads

The Garbage Collector (GC) can use multiple threads. The amount used is either half the number
of compute worker threads or configured by either the `--gcthreads` command line argument or by using the
[`JULIA_NUM_GC_THREADS`](@ref env-gc-threads) environment variable.

!!! compat "Julia 1.10"
    The `--gcthreads` command line argument requires at least Julia 1.10.

## [Threadpools](@id man-threadpools)

When a program's threads are busy with many tasks to run, tasks may experience
delays which may negatively affect the responsiveness and interactivity of the
program. To address this, you can specify that a task is interactive when you
[`Threads.@spawn`](@ref) it:

```julia
using Base.Threads
@spawn :interactive f()
```

Interactive tasks should avoid performing high latency operations, and if they
are long duration tasks, should yield frequently.

Julia may be started with one or more threads reserved to run interactive tasks:

```bash
$ julia --threads 3,1
```

The environment variable `JULIA_NUM_THREADS` can also be used similarly:
```bash
export JULIA_NUM_THREADS=3,1
```

This starts Julia with 3 threads in the `:default` threadpool and 1 thread in
the `:interactive` threadpool:

```julia-repl
julia> using Base.Threads

julia> nthreadpools()
2

julia> threadpool() # the main thread is in the interactive thread pool
:interactive

julia> nthreads(:default)
3

julia> nthreads(:interactive)
1

julia> nthreads()
3
```

!!! note
    The zero-argument version of `nthreads` returns the number of threads
    in the default pool.

!!! note
    Depending on whether Julia has been started with interactive threads,
    the main thread is either in the default or interactive thread pool.

Either or both numbers can be replaced with the word `auto`, which causes
Julia to choose a reasonable default.

## Communication and synchronization

Although Julia's threads can communicate through shared memory, it is notoriously
difficult to write correct and data-race free multi-threaded code. Julia's
[`Channel`](@ref)s are thread-safe and may be used to communicate safely.

### 数据竞争自由

你有责任确保程序没有数据竞争，如果你不遵守该要求，则不能假设这里承诺的任何内容。 观察到的结果可能是反直觉的。

为了确保这一点，最好的办法是获取多线程同时访问的数据的锁。 例如，在大多数情况下，你应该使用以下代码模板：

```julia-repl
julia> lock(lk) do
           use(a)
       end

julia> begin
           lock(lk)
           try
               use(a)
           finally
               unlock(lk)
           end
       end
```
其中 `lk` 是一个锁（例如 `ReentrantLock()`）， `a` 是数据。

此外，Julia 在出现数据竞争时不是内存安全的。如果另一个线程可能会写入数据，则在读取_任何_数据时都要非常小心！ 相反，在更改其他线程访问的数据（例如分配给全局或闭包变量）时，请始终使用上述锁模式。

```julia
Thread 1:
global b = false
global a = rand()
global b = true

Thread 2:
while !b; end
bad_read1(a) # it is NOT safe to access `a` here!

Thread 3:
while !@isdefined(a); end
bad_read2(a) # it is NOT safe to access `a` here
```

## `@threads`宏

下面用一个简单的例子测试我们原生的线程，首先创建一个全零的数组：

```jldoctest
julia> a = zeros(10)
10-element Vector{Float64}:
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
```

现在用4个线程模拟操作这个数组，每个线程往对应的位置写入线程ID。

Julia 用 [`Threads.@threads`](@ref) 宏实现并行循环，该宏加在 `for` 循环前面，提示 Julia 循环部分是一个多线程的区域：


```julia-repl
julia> Threads.@threads for i = 1:10
           a[i] = Threads.threadid()
       end
```

根据线程调度，迭代在各线程中进行拆分，之后各线程将自己的线程ID写入对应区域。

```julia-repl
julia> a
10-element Vector{Float64}:
 1.0
 1.0
 1.0
 2.0
 2.0
 2.0
 3.0
 3.0
 4.0
 4.0
```

注意 [`Threads.@threads`](@ref) 并没有一个像 [`@distributed`](@ref) 一样的可选的 reduction 参数。

### Using `@threads` without data races

Taking the example of a naive sum

```julia-repl
julia> function sum_single(a)
           s = 0
           for i in a
               s += i
           end
           s
       end
sum_single (generic function with 1 method)

julia> sum_single(1:1_000_000)
500000500000
```

Simply adding `@threads` exposes a data race with multiple threads reading and writing `s` at the same time.
```julia-repl
julia> function sum_multi_bad(a)
           s = 0
           Threads.@threads for i in a
               s += i
           end
           s
       end
sum_multi_bad (generic function with 1 method)

julia> sum_multi_bad(1:1_000_000)
70140554652
```

Note that the result is not `500000500000` as it should be, and will most likely change each evaluation.

To fix this, buffers that are specific to the task may be used to segment the sum into chunks that are race-free.
Here `sum_single` is reused, with its own internal buffer `s`, and vector `a` is split into `nthreads()`
chunks for parallel work via `nthreads()` `@spawn`-ed tasks.

```julia-repl
julia> function sum_multi_good(a)
           chunks = Iterators.partition(a, length(a) ÷ Threads.nthreads())
           tasks = map(chunks) do chunk
               Threads.@spawn sum_single(chunk)
           end
           chunk_sums = fetch.(tasks)
           return sum_single(chunk_sums)
       end
sum_multi_good (generic function with 1 method)

julia> sum_multi_good(1:1_000_000)
500000500000
```
!!! note
    Buffers should not be managed based on `threadid()` i.e. `buffers = zeros(Threads.nthreads())` because concurrent tasks
    can yield, meaning multiple concurrent tasks may use the same buffer on a given thread, introducing risk of data races.
    Further, when more than one thread is available tasks may change thread at yield points, which is known as
    [task migration](@ref man-task-migration).

Another option is the use of atomic operations on variables shared across tasks/threads, which may be more performant
depending on the characteristics of the operations.

## 原子操作

Julia 支持访问和修改值的**原子**操作，即以一种线程安全的方式来避免[竞态条件](https://en.wikipedia.org/wiki/Race_condition)。一个值（必须是基本类型的，primitive type）可以通过 [`Threads.Atomic`](@ref) 来包装起来从而支持原子操作。下面看个例子：

```julia-repl
julia> i = Threads.Atomic{Int}(0);

julia> ids = zeros(4);

julia> old_is = zeros(4);

julia> Threads.@threads for id in 1:4
           old_is[id] = Threads.atomic_add!(i, id)
           ids[id] = id
       end

julia> old_is
4-element Vector{Float64}:
 0.0
 1.0
 7.0
 3.0

julia> i[]
 10

julia> ids
4-element Vector{Float64}:
 1.0
 2.0
 3.0
 4.0
```

如果不加 `Atomic` 的话，那么会因为竞态条件而得到错误的结果，下面是一个没有避免竞态条件的例子：

```julia-repl
julia> using Base.Threads

julia> Threads.nthreads()
4

julia> acc = Ref(0)
Base.RefValue{Int64}(0)

julia> @threads for i in 1:1000
          acc[] += 1
       end

julia> acc[]
926

julia> acc = Atomic{Int64}(0)
Atomic{Int64}(0)

julia> @threads for i in 1:1000
          atomic_add!(acc, 1)
       end

julia> acc[]
1000
```


## [field 粒度的原子操作](@id man-atomics)

我们还可以使用[`@atomic`](@ref Base.@atomic)、[`@atomicswap`](@ref Base.@atomicswap)和
[`@atomicreplace`](@ref Base.@atomicreplace) 宏在更细粒度的级别上使用原子。

内存模型的具体细节和设计的其他细节写在
[Julia Atomics Manifesto](https://gist.github.com/vtjnash/11b0031f2e2a66c9c24d33e810b34ec0)中，稍后将正式发布。

结构体声明中的任何字段都可以用 `@atomic` 修饰，然后任何写入也必须用 `@atomic` 标记，
并且必须使用定义的原子顺序之一（`:monotonic`, `:acquire`, `:release`, `:acquire_release`, 或 `:sequentially_consistent`)。
 对原子字段的任何读取也可以使用原子排序约束进行注释，或者如果未指定，将使用单调（宽松）排序完成。

!!! compat "Julia 1.7"
    field 粒度的原子操作至少需要 Julia 1.7.


## 副作用和可变的函数参数


使用多线程时，我们必须小心使用非 [纯](https://en.wikipedia.org/wiki/Pure_function) 的函数，因为我们可能会得到错误的答案。 例如，按照惯例具有 [名称以`!` 结尾](@ref bang-convention) 的函数会修改它们的参数，因此不是纯函数。



## @threadcall

外部库，例如通过 [`ccall`](@ref) 调用的库，给 Julia 基于任务的 I/O 机制带来了问题。 如果 C 库执行阻塞操作，这会阻止 Julia 调度程序执行任何其他任务，直到调用返回。（例外情况是调用回调到 Julia 的自定义 C 代码，然后它可能会 yield，或者调用 `jl_yield()` 的 C 代码，`jl_yield` 是 [`yield`](@ref) 的 C 等价物。）

[`@threadcall`](@ref) 宏提供了一种避免在这种情况下停止执行的方法。它调度一个 C 函数以在单独的线程中执行。为此使用默认大小为 4 的线程池。线程池的大小由环境变量`UV_THREADPOOL_SIZE`控制。 在等待空闲线程时，以及一旦线程可用后的函数执行期间，请求任务（在主 Julia 事件循环上）让步给其他任务。 注意，`@threadcall` 在执行完成之前不会返回。 因此，从用户的角度来看，它与其他 Julia API 一样是一个阻塞调用。

非常关键的一点是，被调用的函数不会再调用回 Julia。

`@threadcall` 在 Julia 未来的版本中可能会被移除或改变。


## 注意！

此时，如果用户代码没有数据竞争，Julia 运行时和标准库中的大多数操作都可以以线程安全的方式使用。 然而，在某些领域，稳定线程支持的工作正在进行中。多线程编程有许多内在的困难，如果使用线程的程序表现出异常或与预期不符的行为（例如崩溃或神秘的结果），通常应该首先怀疑线程交互。

在 Julia 中使用线程时需要注意以下这些特定的限制和警告：

  * 如果多个线程同时使用基本容器类型，且至少有一个线程修改容器时，需要手动加锁（常见示例包括 `push!` 数组，或将项插入 `Dict`）。

  * `@spawn` 使用的时间表是不确定的，不应依赖。
  * 计算绑定、非内存分配任务可以防止垃圾回收在其他正在分配内存的线程中运行。 在这些情况下，可能需要手动调用 `GC.safepoint()` 以允许 GC 运行。
     
     
    该限制在未来会被移除。
  * 避免并行运行顶层操作，例如，`include` 或 `eval` 评估类型、方法和模块定义。
     
  * 请注意，如果启用线程，则库注册的终结器可能会中断。
    这可能需要在整个生态系统中进行一些过渡工作，然后才能放心地广泛采用线程。 有关更多详细信息，请参阅下一节。

## [Task Migration](@id man-task-migration)

After a task starts running on a certain thread it may move to a different thread if the task yields.

Such tasks may have been started with [`@spawn`](@ref Threads.@spawn) or [`@threads`](@ref Threads.@threads),
although the `:static` schedule option for `@threads` does freeze the threadid.

This means that in most cases [`threadid()`](@ref Threads.threadid) should not be treated as constant within a task,
and therefore should not be used to index into a vector of buffers or stateful objects.

!!! compat "Julia 1.7"
    Task migration was introduced in Julia 1.7. Before this tasks always remained on the same thread that they were
    started on.

## 终结器的安全使用

因为终结器可以中断任何代码，所以它们在如何与任何全局状态交互时必须非常小心。 不幸的是，使用终结器的主要原因是更新全局状态（纯函数作为终结器通常毫无意义）。 这让我们陷入了一个难题。 有几种方法可以处理这个问题：

1. 当单线程时，代码可以调用内部 `jl_gc_enable_finalizers` C 函数以防止在关键区域内调度终结器。 在内部，这在某些函数（例如我们的 C locks）中使用，以防止在执行某些操作（增量包加载、代码生成等）时发生递归。 锁和此标志的组合可用于使终结器安全。
    
    
    
    
    

2. Base 在几个地方采用的第二种策略是显式延迟终结器，直到它可以非递归地获取其锁。 以下示例演示了如何将此策略应用于 `Distributed.finalize_ref`：
    
    
    

   ```julia
   function finalize_ref(r::AbstractRemoteRef)
       if r.where > 0 # Check if the finalizer is already run
           if islocked(client_refs) || !trylock(client_refs)
               # delay finalizer for later if we aren't free to acquire the lock
               finalizer(finalize_ref, r)
               return nothing
           end
           try # `lock` should always be followed by `try`
               if r.where > 0 # Must check again here
                   # Do actual cleanup here
                   r.where = 0
               end
           finally
               unlock(client_refs)
           end
       end
       nothing
   end
   ```

3. 相关的第三种策略是使用不需要 yield 的队列。我们目前没有在 Base 中实现无锁队列，但 `Base.IntrusiveLinkedListSynchronized{T}` 是合适的。
    这通常是用于带有事件循环的代码的好策略。例如，这个策略被 `Gtk.jl` 用来管理生命周期引用计数。
    在这种方法中，我们不会在终结器内部做任何显式工作，而是将其添加到队列中以在更安全的时间运行。
    事实上，Julia 的任务调度器已经使用了这种方法，因此将终结器定义为 `x -> @spawn do_cleanup(x)` 就是这种方法的一个示例。
    但是请注意，这并不控制 `do_cleanup` 在哪个线程上运行，因此 `do_cleanup` 仍需要获取锁。
    如果你实现自己的队列，则不必如此，因为你只能明确地从线程中排出该队列。
