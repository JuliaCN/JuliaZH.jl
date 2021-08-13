# [多线程](@id man-multithreading)

访问此 [博客文章](https://julialang.org/blog/2019/07/multithreading/) 以了解 Julia 多线程特性。

## 启用Julia多线程

Julia 默认启动一个线程执行代码，这点可以通过 [`Threads.nthreads()`](@ref) 来确认：


```jldoctest
julia> Threads.nthreads()
1
```

执行线程的数量通过使用`-t`/`--threads` 命令行参数或使用[`JULIA_NUM_THREADS`](@ref JULIA_NUM_THREADS) 环境变量。 当两者都被指定时，`-t`/`--threads` 优先级更高。

!!! compat "Julia 1.5"
    `-t`/`--threads` 命令行参数至少需要 Julia 1.5。在旧版本中，你必须改用环境变量。

让我们以4个线程启动Julia

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

## Data-race freedom

You are entirely responsible for ensuring that your program is data-race free,
and nothing promised here can be assumed if you do not observe that
requirement. The observed results may be highly unintuitive.

The best way to ensure this is to acquire a lock around any access to data that
can be observed from multiple threads. For example, in most cases you should
use the following code pattern:

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

Additionally, Julia is not memory safe in the presence of a data race. Be very
careful about reading _any_ data if another thread might write to it!
Instead, always use the lock pattern above when changing data (such as assigning
to a global or closure variable) accessed by other threads.

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

The iteration space is split among the threads, after which each thread writes its thread ID
to its assigned locations:

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

julia> nthreads()
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


## [Per-field atomics](@id man-atomics)

We can also use atomics on a more granular level using the [`@atomic`](@ref
Base.@atomic), [`@atomicswap`](@ref Base.@atomicswap), and
[`@atomicreplace`](@ref Base.@atomicreplace) macros.

Specific details of the memory model and other details of the design are written
in the [Julia Atomics
Manifesto](https://gist.github.com/vtjnash/11b0031f2e2a66c9c24d33e810b34ec0),
which will later be published formally.

Any field in a struct declaration can be decorated with `@atomic`, and then any
write must be marked with `@atomic` also, and must use one of the defined atomic
orderings (:monotonic, :acquire, :release, :acquire\_release, or
:sequentially\_consistent). Any read of an atomic field can also be annotated
with an atomic ordering constraint, or will be done with monotonic (relaxed)
ordering if unspecified.


## 副作用和可变的函数参数


When using multi-threading we have to be careful when using functions that are not
[pure](https://en.wikipedia.org/wiki/Pure_function) as we might get a wrong answer.
For instance functions that have a
[name ending with `!`](@ref bang-convention)
by convention modify their arguments and thus are not pure.


## @threadcall

External libraries, such as those called via [`ccall`](@ref), pose a problem for
Julia's task-based I/O mechanism.
If a C library performs a blocking operation, that prevents the Julia scheduler
from executing any other tasks until the call returns.
(Exceptions are calls into custom C code that call back into Julia, which may then
yield, or C code that calls `jl_yield()`, the C equivalent of [`yield`](@ref).)

The [`@threadcall`](@ref) macro provides a way to avoid stalling execution in such
a scenario.
It schedules a C function for execution in a separate thread. A threadpool with a
default size of 4 is used for this. The size of the threadpool is controlled via environment variable
`UV_THREADPOOL_SIZE`. While waiting for a free thread, and during function execution once a thread
is available, the requesting task (on the main Julia event loop) yields to other tasks. Note that
`@threadcall` does not return until the execution is complete. From a user point of view, it is
therefore a blocking call like other Julia APIs.

非常关键的一点是，被调用的函数不会再调用回 Julia。

`@threadcall` 在 Julia 未来的版本中可能会被移除或改变。


## Caveats

At this time, most operations in the Julia runtime and standard libraries
can be used in a thread-safe manner, if the user code is data-race free.
However, in some areas work on stabilizing thread support is ongoing.
Multi-threaded programming has many inherent difficulties, and if a program
using threads exhibits unusual or undesirable behavior (e.g. crashes or
mysterious results), thread interactions should typically be suspected first.

There are a few specific limitations and warnings to be aware of when using
threads in Julia:

  * Base collection types require manual locking if used simultaneously by
    multiple threads where at least one thread modifies the collection
    (common examples include `push!` on arrays, or inserting
    items into a `Dict`).
  * After a task starts running on a certain thread (e.g. via `@spawn`), it
    will always be restarted on the same thread after blocking. In the future
    this limitation will be removed, and tasks will migrate between threads.
  * `@threads` currently uses a static schedule, using all threads and assigning
    equal iteration counts to each. In the future the default schedule is likely
    to change to be dynamic.
  * The schedule used by `@spawn` is nondeterministic and should not be relied on.
  * Compute-bound, non-memory-allocating tasks can prevent garbage collection from
    running in other threads that are allocating memory. In these cases it may
    be necessary to insert a manual call to `GC.safepoint()` to allow GC to run.
    This limitation will be removed in the future.
  * Avoid running top-level operations, e.g. `include`, or `eval` of type,
    method, and module definitions in parallel.
  * Be aware that finalizers registered by a library may break if threads are enabled.
    This may require some transitional work across the ecosystem before threading
    can be widely adopted with confidence. See the next section for further details.

## Safe use of Finalizers

Because finalizers can interrupt any code, they must be very careful in how
they interact with any global state. Unfortunately, the main reason that
finalizers are used is to update global state (a pure function is generally
rather pointless as a finalizer). This leads us to a bit of a conundrum.
There are a few approaches to dealing with this problem:

1. When single-threaded, code could call the internal `jl_gc_enable_finalizers`
   C function to prevent finalizers from being scheduled
   inside a critical region. Internally, this is used inside some functions (such
   as our C locks) to prevent recursion when doing certain operations (incremental
   package loading, codegen, etc.). The combination of a lock and this flag
   can be used to make finalizers safe.

2. A second strategy, employed by Base in a couple places, is to explicitly
   delay a finalizer until it may be able to acquire its lock non-recursively.
   The following example demonstrates how this strategy could be applied to
   `Distributed.finalize_ref`:

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

3. A related third strategy is to use a yield-free queue. We don't currently
   have a lock-free queue implemented in Base, but
   `Base.InvasiveLinkedListSynchronized{T}` is suitable. This can frequently be a
   good strategy to use for code with event loops. For example, this strategy is
   employed by `Gtk.jl` to manage lifetime ref-counting. In this approach, we
   don't do any explicit work inside the `finalizer`, and instead add it to a queue
   to run at a safer time. In fact, Julia's task scheduler already uses this, so
   defining the finalizer as `x -> @spawn do_cleanup(x)` is one example of this
   approach. Note however that this doesn't control which thread `do_cleanup`
   runs on, so `do_cleanup` would still need to acquire a lock. That
   doesn't need to be true if you implement your own queue, as you can explicitly
   only drain that queue from your thread.
