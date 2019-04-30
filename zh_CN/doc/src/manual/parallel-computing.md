# 并行计算

对于多线程和并行计算的新手来说，首先了解Jullia所提供的
不同层级并行是非常有用的。这里我们主要将其分成三类：

1. Julia 协程（绿色线程）
2. 多线程
3. 多核心或分布式处理

我们首先考虑 Julia 任务 [Task（也就是协程）](@ref man-tasks)以及其它依赖于 Julia  运行时库的模块，通过运行时库，我们无需手动与操作系统的调度进行交互就可以挂起和恢复计算，并且对 `Task` 间内部通信拥有完全控制。Julia 同样支持利用一些操作在 `Task` 间进行通信，比如 [`wait`](@ref) 以及 [`fetch`](@ref)。另外，通信和数据同步是通过管道 [`Channel`](@ref) 完成的，它也为 `Task` 间内部通信提供了渠道。

Julia 还支持实验性的多线程功能，在执行时通过分叉（fork），然后有一个匿名函数在所有线程上运行。由于是一种*分叉-汇合*（fork-join）的方式，并行执行的线程必须在独立执行之后，最终汇合到 Julia 主线程上，以便能够继续串行执行。多线程功能是通过 `Base.Threads` 模块提供的，目前仍然是实验性的，因为目前 Julia 还不是完全线程安全的。尤其是在进行 I/O 操作和协程切换的时候可能会有段错误出现。最新的进展请关注 [the issue tracker](https://github.com/JuliaLang/julia/issues?q=is%3Aopen+is%3Aissue+label%3Amultithreading)。多线程应该只在你考虑全局变量、锁以及原子操作的时候使用，后面我们都会详细讲解。

最后我们将介绍 Julia 的分布式和并行计算的实现方法。鉴于以科学计算为主要目的，Julia 底层实现上提供了跨多核或多机器对任务并行的接口。同时我们还将介绍一些有用的分布式编程的外部包，比如 `MPI.jl` 以及 `DistributedArrays.jl`。

# 协程

Julia 的并行编程平台采用协程任务 [Tasks (aka Coroutines)](@ref man-tasks) 来进行多个计算之间的切换。为了表示轻量线程之间的执行顺序，必须提供一种通信的原语。Julia 提供了函数 `Channel(func::Function, ctype=Any, csize=0, taskref=nothing)`，根据 `func` 创建 task，然后将其绑定到一个新的大小为 `csize`、 类型为 `ctype` 的管道上，并调度 task。`管道` 可以当作是一种task之间通信的方式，`Channel{T}(sz::Int)` 会创建一个类型为 `T`、 大小为 `sz` 的管道。无论何时发起一个通信操作，如 [`fetch`](@ref) 或 [`wait`](@ref)，当前 task 都会挂起，然后调度器会选择其它 task 去执行，在一个 task 等待的事件结束之后会重新恢复执行。

对于许多问题而言，并不需要直接考虑 task。不过，task 可以用来同时等待多个事件，从而实现**动态调度**。在动态调度的过程中，程序可以决定计算什么，或者根据其它任务执行结束的时间决定接下来在哪里执行计算。这对于不可预测或不平衡的计算量来说是必须的，因为我们只希望给那些已经完成了其当前任务的进程分配更多的任务。


## 管道

在 [流程控制](@ref) 中有关 [`Task`](@ref) 的部分，已经讨论了如何协调多个函数的执行。[`Channel`](@ref) 可以很方便地在多个运行中的 task 传递数据，特别是那些涉及 I/O 的操作。

典型的 I/O 操作包括读写文件、访问 web 服务、执行外部程序等。在所有这些场景中，如果其它 task 可以在读取文件（等待外部服务或程序执行完成）时继续执行，那么总的执行时间能够得到大大提升。

一个管道可以形象得看做是一个管子，一端可读，另一端可写：

  * 不同的 task 可以通过 [`put!`](@ref) 往同一个 channel 并发地写入。
     
  * 不同的 task 也可以通过 [`take!`](@ref) 从同一个 channel 并发地取数据
  * 举个例子：

    ```julia
    # Given Channels c1 and c2,
    c1 = Channel(32)
    c2 = Channel(32)

    # and a function `foo` which reads items from c1, processes the item read
    # and writes a result to c2,
    function foo()
        while true
            data = take!(c1)
            [...]               # process data
            put!(c2, result)    # write out result
        end
    end

    # we can schedule `n` instances of `foo` to be active concurrently.
    for _ in 1:n
        @async foo()
    end
    ```
* Channe l可以通过 `Channel{T}(sz)` 构造，得到的 channel 只能存储类型 `T` 的数据。如果 `T` 没有指定，那么 channel 可以存任意类型。`sz` 表示该 channel 能够存储的最大元素个数。比如 `Channel(32)` 得到的 channel 最多可以存储32个元素。而 `Channel{MyType}(64)` 则可以最多存储64个 `MyType` 类型的数据。
   
   
   
   
* 如果一个 [`Channel`](@ref) 是空的，读取的 task(即执行 [`take!`](@ref) 的 task)会被阻塞直到有新的数据准备好了。
* 如果一个 [`Channel`](@ref) 是满的，那么写入的 task(即执行 [`put!`](@ref) 的 task)则会被阻塞，直到 Channel 有空余。
* [`isready`](@ref) 可以用来检查一个 channel 中是否有已经准备好的元素，而等待一个元素准备好 则用 [`wait`](@ref)
   
* 一个 [`Channel`](@ref) 一开始处于开启状态，也就是说可以被 [`take!`](@ref) 读取和 [`put!`](@ref) 写入。[`close`](@ref) 会关闭一个 [`Channel`](@ref)，对于一个已经关闭的 [`Channel`](@ref)，[`put!`](@ref) 会失败，例如：
   
   

```julia-repl
julia> c = Channel(2);

julia> put!(c, 1) # `put!` on an open channel succeeds
1

julia> close(c);

julia> put!(c, 2) # `put!` on a closed channel throws an exception.
ERROR: InvalidStateException("Channel is closed.",:closed)
Stacktrace:
[...]
```

  * [`take!`](@ref) 和 [`fetch`](@ref) (只读取，不会将元素从 channel 中删掉)仍然可以从一个已经关闭的 channel 中读数据，直到 channel 被取空了为止。继续上面的例子：
     

```julia-repl
julia> fetch(c) # Any number of `fetch` calls succeed.
1

julia> fetch(c)
1

julia> take!(c) # The first `take!` removes the value.
1

julia> take!(c) # No more data available on a closed channel.
ERROR: InvalidStateException("Channel is closed.",:closed)
Stacktrace:
[...]
```

`Channel` 可以在 `for` 循环中遍历，此时，循环会一直运行直到 `Channel` 中有数据，遍历过程中会取遍加入到 `Channel` 中的所有值。一旦 `Channel`关闭或者取空了，`for` 循环就会终止。

例如，下面的 `for` 循环会等待新的数据：

```julia-repl
julia> c = Channel{Int}(10);

julia> foreach(i->put!(c, i), 1:3) # add a few entries

julia> data = [i for i in c]
```

而下面的则会返回已经读取的数据：

```julia-repl
julia> c = Channel{Int}(10);

julia> foreach(i->put!(c, i), 1:3); # add a few entries

julia> close(c);                    # `for` loops can exit

julia> data = [i for i in c]
3-element Array{Int64,1}:
 1
 2
 3
```

考虑这样一个用 channel 做 task 之间通信的例子。首先，起 4 个 task 来处理一个 `jobs` channel 中的数据。`jobs` 中的每个任务通过 `job_id` 来表示，然后每个 task 模拟读取一个 `job_id`，然后随机等待一会儿，然后往一个 results channel 中写入一个元组，它分别包含 `job_id` 和执行的时间，最后将结果打印出来：

```julia-repl
julia> const jobs = Channel{Int}(32);

julia> const results = Channel{Tuple}(32);

julia> function do_work()
           for job_id in jobs
               exec_time = rand()
               sleep(exec_time)                # simulates elapsed time doing actual work
                                               # typically performed externally.
               put!(results, (job_id, exec_time))
           end
       end;

julia> function make_jobs(n)
           for i in 1:n
               put!(jobs, i)
           end
       end;

julia> n = 12;

julia> @async make_jobs(n); # feed the jobs channel with "n" jobs

julia> for i in 1:4 # start 4 tasks to process requests in parallel
           @async do_work()
       end

julia> @elapsed while n > 0 # print out results
           job_id, exec_time = take!(results)
           println("$job_id finished in $(round(exec_time; digits=2)) seconds")
           global n = n - 1
       end
4 finished in 0.22 seconds
3 finished in 0.45 seconds
1 finished in 0.5 seconds
7 finished in 0.14 seconds
2 finished in 0.78 seconds
5 finished in 0.9 seconds
9 finished in 0.36 seconds
6 finished in 0.87 seconds
8 finished in 0.79 seconds
10 finished in 0.64 seconds
12 finished in 0.5 seconds
11 finished in 0.97 seconds
0.029772311
```

当前版本的 Julia 会将所有 task 分发到一个操作系统的线程，因此，涉及 I/O 的操作会从并行执行中获利，而计算密集型的 task 则会顺序地在单独这个线程上执行。未来 Julia 将支持在多个线程上调度 task，从而让计算密集型 task 也能从并行计算中获利。

# 多线程（实验性功能）

除了 task 之外，Julia 还原生支持多线程。本部分内容是实验性的，未来相关接口可能会改变。

## 设置

Julia 默认启动一个线程执行代码，这点可以通过 [`Threads.nthreads()`](@ref) 来确认：


```julia-repl
julia> Threads.nthreads()
1
```

Julia 启动时的线程数可以通过环境变量 `JULIA_NUM_THREADS` 设置，下面启动4个线程：

```bash
export JULIA_NUM_THREADS=4
```

(上面的代码只能在 Linux 和 OSX 系统中运行，如果你在以上平台中使用的是 C shell，那么将 `export` 改成 `set`，如果你是在 Windows 上运行，那么将 `export` 改成 `set` 同时启动 Julia 时指定 `julia.exe` 的完整路径。)

现在确认下确实有4个线程：

```julia-repl
julia> Threads.nthreads()
4
```

不过我们现在是在 master 线程，用 [`Threads.threadid`](@ref) 确认下：


```julia-repl
julia> Threads.threadid()
1
```

## `@threads`宏

下面用一个简单的例子测试我们原生的线程，首先创建一个全零的数组：

```jldoctest
julia> a = zeros(10)
10-element Array{Float64,1}:
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

每次迭代会分配到各个线程，然后每个线程往对应位置写入线程 ID：

```julia-repl
julia> a
10-element Array{Float64,1}:
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
4-element Array{Float64,1}:
 0.0
 1.0
 7.0
 3.0

julia> ids
4-element Array{Float64,1}:
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

并非**所有的**原始类型都能放在 `Atomic` 标签内封装起来，支持的类型有`Int8`, `Int16`, `Int32`, `Int64`, `Int128`, `UInt8`, `UInt16`, `UInt32`, `UInt64`, `UInt128`, `Float16`, `Float32`, 以及 `Float64`。此外，`Int128` 和 `UInt128` 在 AAarch32 和 ppc64le 上不支持。

## 副作用和可变的函数参数


在使用多线程时，要非常小心使用了不纯的函数 [pure function](https://en.wikipedia.org/wiki/Pure_function)，例如，用到了 [以!结尾的函数](https://docs.julialang.org/en/latest/manual/style-guide/#Append-!-to-names-of-functions-that-modify-their-arguments-1)，通常这类函数会修改其参数，因而是不纯的。此外还有些函数没有以 `!` 结尾，其实也是有副作用的，比如 [`findfirst(regex, str)`](@ref) 就会改变 `regex` 参数，或者是 [`rand()`](@ref) 会修改 `Base.GLOBAL_RNG`:

```julia-repl
julia> using Base.Threads

julia> nthreads()
4

julia> function f()
           s = repeat(["123", "213", "231"], outer=1000)
           x = similar(s, Int)
           rx = r"1"
           @threads for i in 1:3000
               x[i] = findfirst(rx, s[i]).start
           end
           count(v -> v == 1, x)
       end
f (generic function with 1 method)

julia> f() # the correct result is 1000
1017

julia> function g()
           a = zeros(1000)
           @threads for i in 1:1000
               a[i] = rand()
           end
           length(unique(a))
       end
g (generic function with 1 method)

julia> Random.seed!(1); g() # the result for a single thread is 1000
781
```

此时，应该重新设计代码来避免可能的竞态条件或者是使用 [同步机制](https://docs.julialang.org/en/latest/base/multi-threading/#Synchronization-Primitives-1)。

例如，为了修正上面 `findfirst` 的例子，每个线程都要拷贝一份 `rx`。

```julia-repl
julia> function f_fix()
             s = repeat(["123", "213", "231"], outer=1000)
             x = similar(s, Int)
             rx = [Regex("1") for i in 1:nthreads()]
             @threads for i in 1:3000
                 x[i] = findfirst(rx[threadid()], s[i]).start
             end
             count(v -> v == 1, x)
         end
f_fix (generic function with 1 method)

julia> f_fix()
1000
```

现在使用 `Regex("1")` 而不是 `r"1"` 来保证 Julia 对每个 `rx` 向量的元素都创建了一个 `Regex` 的对象。


`rand` 的例子更复杂点，因为我们需要保证每个线程使用的是不重叠的随机数序列，这可以简单地通过 `Future.randjump` 函数保证：


```julia-repl
julia> using Random; import Future

julia> function g_fix(r)
           a = zeros(1000)
           @threads for i in 1:1000
               a[i] = rand(r[threadid()])
           end
           length(unique(a))
       end
g_fix (generic function with 1 method)

julia>  r = let m = MersenneTwister(1)
                [m; accumulate(Future.randjump, fill(big(10)^20, nthreads()-1), init=m)]
            end;

julia> g_fix(r)
1000
```

这里将 `r` 向量发送到 `g_fix`，由于生成多个随机数是很昂贵的操作，因此我们不希望每次执行函数都重复该操作。

## @threadcall （实验性功能）

所有的 I/O task，计时器，REPL 命令等都是通过一个事件循环复用的一个系统线程。有一个补丁版的 libuv([http://docs.libuv.org/en/v1.x/](http://docs.libuv.org/en/v1.x/)) 提供了该功能，从而在同一个系统线程上协调调度多个 task。I/O task 和计时器在等待某个事件发生时，会隐式地退出（yield），而显式地调用 [`yield`](@ref) 则会允许其它 task 被调度。


因此，一个执行 [`ccall`](@ref) 的 task 会阻止 Julia 的调度器执行其它 task，直到调用返回，这种情况对于所有外部库的调用都存在，例外的情况是，某些自定义的C代码调用返回到了 Julia中（此时有可能 yield ）或者 C 代码执行了 `jl_yield()`（C 中等价的 [`yield`](@ref)）。

注意，尽管 Julia 的代码默认是单线程的，但是 Julia 调用的库可能会用到其内部的多线程，例如，BLAS 会在一台机器上使用尽可能多的线程。

[`@threadcall`](@ref) 就是要解决 [`ccall`](@ref) 会卡住主线程的这个问题，它会在一个额外的线程中调度 C 函数的执行，有一个默认大小为4的线程库用来做这个事情，该线程库的大小可以通过环境变量 `UV_THREADPOOL_SIZE` 控制。在等待一个空闲线程，以及在函数执行过程中某个线程空闲下来时，（主线程的事件循环中）正在请求的 task 会 yield 到其它 task，注意，`@threadcall` 并不会返回，直到执行结束。从用户的角度来看，就是一个和其它 Julia API 一样会阻塞的模块。


非常关键的一点是，被调用的函数不会再调用回 Julia。

`@threadcall` 在 Julia 未来的版本中可能会被移除或改变。


# 多核心或分布式处理

作为 Julia 标准库之一，`Distributed` 库提供了一种分布式内存并行计算的实现。

大多数现代计算机都拥有不止一个 CPU，而且多台计算机可以组织在一起形成一个集群。借助多个 CPU 的计算能力，许多计算过程能够更快地完成，这其中影响性能的两个主要因素分别是：CPU 自身的速度以及它们访问内存的速度。显然，在一个集群中，一个 CPU 访问同一个节点的 RAM 速度是最快的，不过令人吃惊的是，在一台典型的多核笔记本电脑上，由于访问主存和[缓存](https://www.akkadia.org/drepper/cpumemory.pdf)的速度存在差别，类似的现象也会存在。因此，一个良好的多进程环境应该能够管理好某一片内存区域“所属”的CPU。Julia提供的多进程环境是基于消息传递来实现的，可以做到同时让程序在多个进程的不同内存区域中运行。


Julia 的消息传递机制与一些其它的框架不太一样，比如 MPI [^1]。在 Julia 中，进程之间的通信通常是**单向**的，这里单向的意思是说，在实现2个进程之间的操作时，只需要显式地管理一个进程即可。此外，这些操作并不像是“发送消息”，“接收消息”这类操作，而是一些高阶的操作，比如调用用户定义的函数。


Julia 中的分布式编程基于两个基本概念：**远程引用**(*remote references*)和**远程调用**(*remote calls*)。远程引用是一个对象，任意一个进程可以通过它访问存储在某个特定进程上的对象。远程调用指是某个进程发起的执行函数的请求，该函数会在另一个（也可能是同一个）进程中执行。

远程引用有两种类型：[`Future`](@ref) 和 [`RemoteChannel`](@ref)。

一次远程调用会返回一个 [`Future`](@ref) 作为结果。远程调用会立即返回；也就是说，执行远程调用的进程接下来会继续执行下一个操作，而远程调用则会在另外的进程中进行。你可以通过对返回的 [`Future`](@ref) 执行 [`wait`](@ref) 操作来等待远程调用结束，然后用 [`fetch`](@ref) 获取结果。


对于 [`RemoteChannel`](@ref) 而言，它可以被反复写入。例如，多个进程可以通过引用同一个远程 `Channel` 来协调相互之间的操作。


每个进程都有一个对应的 id，提供 Julia 交互环境的进程的 `id` 永远是1。我们把用来执行并行任务的进程称为 “worker”，假如总共只有一个进程，那么进程1就被认为是 worker，否则，除了进程1以外的进程都称作 worker。

一起试一下吧。执行 `julia -p n` 就可以在本地起 `n` 个进程。一般来说，将 `n` 设成与你机器上（物理的内核数）CPU 个数一致比较合适。需要注意 `-p` 参数会隐式地载入 `Distributed` 模块。


```julia
$ ./julia -p 2

julia> r = remotecall(rand, 2, 2, 2)
Future(2, 1, 4, nothing)

julia> s = @spawnat 2 1 .+ fetch(r)
Future(2, 1, 5, nothing)

julia> fetch(s)
2×2 Array{Float64,2}:
 1.18526  1.50912
 1.16296  1.60607
```

[`remotecall`](@ref) 的第一个参数是想要调用的函数，第二个参数是执行函数的进程 `id`，其余的参数会喂给将要被调用的函数。在 Julia 中进行并行编程时，一般不需要显示地指明具体在哪个进程上执行，不过 [`remotecall`](@ref) 是一个相对底层的接口用来提供细粒度的管理。

可以看到，第一行代码请求进程2构建一个随机矩阵，第二行代码对该矩阵执行加一操作。每次执行的结果存在对应的 Future 中，即 `r` 和 `s`。这里 [`@spawnat`](@ref) 宏会在第一个参数所指定的进程中执行后面第二个参数中的表达式。

有时候，你可能会希望立即获取远程计算的结果，比如，在接下来的操作中就需要读取远程调用的结果，这时候你可以使用 [`remotecall_fetch`](@ref) 函数，其效果相当于 `fetch(remotecall(...))`，不过更高效些。

```julia-repl
julia> remotecall_fetch(getindex, 2, r, 1, 1)
0.18526337335308085
```

回忆下，这里 [`getindex(r,1,1)`](@ref) [相当于](@ref man-array-indexing) `r[1,1]`，因此，上面的调用相当于获取 `r` 的第一个元素。


[`remotecall`](@ref) 的语法不是很方便，有一个宏 [`@spawn`](@ref) 可以做些简化，其作用于一个表达式，而不是函数，同时会自动帮你选择在哪个进程上执行。


```julia-repl
julia> r = @spawn rand(2,2)
Future(2, 1, 4, nothing)

julia> s = @spawn 1 .+ fetch(r)
Future(3, 1, 5, nothing)

julia> fetch(s)
2×2 Array{Float64,2}:
 1.38854  1.9098
 1.20939  1.57158
```

注意这里执行的是 `1 .+ fetch(r)` 而不是 `1 .+ r`。这是因为我们并不知道这段代码会在哪个进程中执行，因此，通常需要用 [`fetch`](@ref) 将 `r` 中的数据挪到当前计算加法的进程中。这时候 [`@spawn`](@ref) 会很智能地在拥有 `r` 的进程中执行计算，此时，[`fetch`](@ref) 就相当于什么都不用做。(译者注：[issue#28350](https://github.com/JuliaLang/julia/issues/28350))

显然，[`@spawn`](@ref) 并非 Julia 内置的一部分，而是通过 [宏](@ref man-macros) 定义的，因此，你也可以自己定义类似的结构。

有一点一定要注意，一旦执行了 `fetch`，[`Future`](@ref) 就会将结果缓存起来，之后执行 [`fetch`](@ref) 的时候就不涉及到网络传输了。一旦所有的 [`Future`](@ref) 都获取到了值，那么远端存储的值就会被删掉。

[`@async`](@ref) 跟 [`@spawn`](@ref) 有点类似，不过只在当前局部线程中执行。通过它来给每个进程创建一个「喂养」task，每个 task 都选取下一个将要计算的索引，然后等待其执行结束，然后重复该过程，直到索引超出边界。需要注意的是，task 并不会立即执行，只有在执行到 [`@sync`](@ref) 结束时才会开始执行，此时，当前线程交出控制权，直到所有的任务都完成了。在v0.7 之后，所有的喂养 task 都能够通过 `nextidx` 共享状态，因为他们都在同一个进程中。尽管 `Tasks` 是协调调度的，但在某些情况下仍然有可能发送死锁，如 [asynchronous I/O](@ref faq-async-io)。上下文只会在特定时候发生切换，在这里就是执行 [`remotecall_fetch`](@ref)。当然，这是当前版本的实现状态，未来的 Julia 版本中可能会改变，有望在 M 个进程中最多跑 N 个 task，即 [M:N 线程](https://en.wikipedia.org/wiki/Thread_(computing)#Models)。然后，`nextidx` 需要加锁，从而让多个进程能够安全地对一个资源同时进行读写。



## 访问代码以及加载库

对于想要并行执行的代码，需要所有对所有线程都可见。例如，在 Julia 命令行中输入以下命令：

```julia-repl
julia> function rand2(dims...)
           return 2*rand(dims...)
       end

julia> rand2(2,2)
2×2 Array{Float64,2}:
 0.153756  0.368514
 1.15119   0.918912

julia> fetch(@spawn rand2(2,2))
ERROR: RemoteException(2, CapturedException(UndefVarError(Symbol("#rand2"))
Stacktrace:
[...]
```

进程1知道函数 `rand2` 的存在，但进程2并不知道。

大多数情况下，你会从文件或者库中加载代码，在此过程中你可以灵活地控制哪个进程加载哪部分代码。假设有这样一个文件，`DummyModule.jl`，其代码如下：


```julia
module DummyModule

export MyType, f

mutable struct MyType
    a::Int
end

f(x) = x^2+1

println("loaded")

end
```

为了在所有进程中引用 `MyType`，`DummyModule.jl` 需要在每个进程中载入。单独执行 `include("DummyModule.jl")` 只会在一个线程中将其载入。为了让每个线程都载入它，可以用 [`@everywhere`](@ref) 宏来实现(启动 Julia 的时候，执行 `julia -p 2`)。

```julia-repl
julia> @everywhere include("DummyModule.jl")
loaded
      From worker 3:    loaded
      From worker 2:    loaded
```

和往常一样，这么做并不会将 `DummyModule` 引入到每个线程的命名空间中，除非显式地使用 `using` 或 `import`。此外，显式地将 `DummyModule` 引入一个线程中，并不会影响其它线程：


```julia-repl
julia> using .DummyModule

julia> MyType(7)
MyType(7)

julia> fetch(@spawnat 2 MyType(7))
ERROR: On worker 2:
UndefVarError: MyType not defined
⋮

julia> fetch(@spawnat 2 DummyModule.MyType(7))
MyType(7)
```

不过，我们仍然可以在已经包含(include)过 `DummyModule` 的进程中，发送 `MyType` 类型的实例，尽管此时该进程的命名空间中并没有 `MyType` 变量:

```julia-repl
julia> put!(RemoteChannel(2), MyType(7))
RemoteChannel{Channel{Any}}(2, 1, 13)
```

文件代码还可以在启动的时候，通过 `-L` 参数指定，从而提前在多个进程中载入，然后通过一个 driver.jl 文件控制执行逻辑:

```
julia -p <n> -L file1.jl -L file2.jl driver.jl
```

上面执行 `driver.jl` 的进程 id 为1，就跟提供交互式命令行的 Julia 进程一样。


最后，如果 `DummyModule.jl` 不是一个单独的文件，而是一个包的话，那么 `using DummyModule` 只会在所有线程中*载入* `DummyModule.jl`，也就是说 `DummyModule` 只会在 `using` 执行的线程中被引入命名空间。

## 启动和管理 worker 进程

Julia 自带两种集群管理模式：

  * 本地集群，前面通过启动时指定 `-p` 参数就是这种模式
  * 跨机器的集群，通过 `--machine-file` 指定。这种模式采用没有密码的 `ssh` 登陆并对应的机器上（与 host 相同的路径下）启动 Julia 的 worker 进程。
     

[`addprocs`](@ref), [`rmprocs`](@ref), [`workers`](@ref) 这些函数可以分别用来对集群中的进程进行增加，删除和修改。

```julia-repl
julia> using Distributed

julia> addprocs(2)
2-element Array{Int64,1}:
 2
 3
```

在 master 主线程中，`Distributed` 模块必须显式地在调用 [`addprocs`](@ref) 之前载入，该模块会自动在其它进程中可见。

需要注意的时，worker 进程并不会执行 `~/.julia/config/startup.jl` 启动脚本，也不会同步其它进程的全局状态（比如全局变量，新定义的方法，加载的模块等）。


其它类型的集群可以通过自己写一个 `ClusterManager` 来实现，下面 [集群管理器](@ref) 部分会介绍。

## 数据转移

分布式程序的性能瓶颈主要是由发送消息和数据转移造成的，减少发送消息和转移数据的数量对于获取高性能和可扩展性至关重要，因此，深入了解 Julia 分布式程序是如何转移数据的非常有必要。

[`fetch`](@ref) 可以看作是显式地转移数据的操作，因为它直接要求获取数据到本地机器。[`@spawn`](@ref)（以及相关的操作）也会移动数据，不过不那么明显，因此称作隐式地数据转移操作。比较以下两种方式，构造一个随机矩阵并求平方：

方法一：

```julia-repl
julia> A = rand(1000,1000);

julia> Bref = @spawn A^2;

[...]

julia> fetch(Bref);
```

方法二：

```julia-repl
julia> Bref = @spawn rand(1000,1000)^2;

[...]

julia> fetch(Bref);
```

二者的差别似乎微乎其微，不过受于 [`@spawn`](@ref) 的实现，二者其实有很大的区别。第一种方法中，首先在本地构造了一个随机矩阵，然后将其发送到另外一个线程计算平方，而第二种方法中，随机矩阵的构造以及求平方计算都在另外一个进程。因此，第二种方法传输的数据要比第一种方法少得多。


在上面这个简单的例子中，两种方法很好区分并作出选择。不过，在实际的程序中设计如何转移数据时，需要经过深思熟虑。例如，如果第一个进程需要使用 `A`，那么第一种方法就更合适些。或者，如果计算 `A` 非常复杂，而所有的进程中又只有当前进程有数据 `A`，那么转移数据 `A` 就不可避免了。又或者，当前进程在 [`@spawn`](@ref) 和 `fetch(Bref)` 之间几乎没什么可做的，那么最好就不用并行了。又比如，假设 `rand(1000,1000)` 操作换成了某种非常复杂的操作，那么也许为这个操作再增加一个 [`@spawn`](@ref) 是个不错的方式。

## 全局变量
通过 `@spawn` 在远端执行的表达式，或者通过 `remotecall` 调用的闭包，有可能引用全局变量。在 `Main` 模块中的全局绑定和其它模块中的全局绑定有所不同，来看看下面的例子:

```julia-repl
A = rand(10,10)
remotecall_fetch(()->sum(A), 2)
```

这个例子中 [`sum`](@ref) 必须已经在远程的线程中定义了。注意这里 `A` 是当前线程中的一个全局变量，起初 worker 2 在其 `Main` 中并没有一个叫做 `A` 的变量。上面代码中，将闭包 `()->sum(A)` 发送到 worker 2 之后，会在 worker 2 中定义一个变量 `Main.A`，而且，`Main.A` 即使在执行完 `remotecall_fetch` 之后，仍然会存在与 worker 2 中。远程调用中包含的全局（这里仅仅指 `Main` 模块中的）引用会按如下方式管理：

- 在全局调用中引用的全局绑定会在将要执行该调用的 worker 中被创建。

- 全局常量仍然在远端结点定义为常量。

- 全局绑定会在下一次远程调用中引用到的时候，当其值发生改变时，再次发送给目标 worker。此外，集群并不会所有结点的全局绑定。例如：
   
   

  ```julia
  A = rand(10,10)
  remotecall_fetch(()->sum(A), 2) # worker 2
  A = rand(10,10)
  remotecall_fetch(()->sum(A), 3) # worker 3
  A = nothing
  ```

  可以看到，`A` 作为全局变量在 worker 2中有定义，而 `B` 是一个局部变量，因而最后在 worker 2 中并没有 `B` 的绑定。
  执行以上代码之后，worker 2 和 worker 3中的 `Main.A` 的值是不同的，同时，节点1上的值则为 `nothing`。

也许你也注意到了，在 master 主节点上被赋值为 `nothing` 之后，全局变量的内存会被回收，但在 worker 节点上的全局变量并没有被回收掉。执行 [`clear`](@ref) 可以手动将远端结点上的特定全局变量置为 `nothing`，然后对应的内存会被周期性的垃圾回收机制回收。

因此，在远程调用中，需要非常小心地引用全局变量。事实上，应当尽量避免引用全局变量，如果必须引用，那么可以考虑用`let`代码块将全局变量局部化：

例如：


```julia-repl
julia> A = rand(10,10);

julia> remotecall_fetch(()->A, 2);

julia> B = rand(10,10);

julia> let B = B
           remotecall_fetch(()->B, 2)
       end;

julia> @fetchfrom 2 InteractiveUtils.varinfo()
name           size summary
––––––––– ––––––––– ––––––––––––––––––––––
A         800 bytes 10×10 Array{Float64,2}
Base                Module
Core                Module
Main                Module
```

可以看到，`A` 作为全局变量在 worker 2中有定义，而 `B` 是一个局部变量，因而最后在 worker 2 中并没有 `B` 的绑定。


## 并行的Map和Loop

幸运的是，许多有用的并行计算并不涉及数据转移。一个典型的例子就是蒙特卡洛模拟，每个进程都独立地完成一些模拟试验。这里用 [`@spawn`](@ref) 在两个进程进行抛硬币的试验，首先，将下面的代码写入 `count_heads.jl` 文件:

```julia
function count_heads(n)
    c::Int = 0
    for i = 1:n
        c += rand(Bool)
    end
    c
end
```

函数 `count_heads` 只是简单地将 `n` 个随机 0-1 值累加，下面在两个机器上进行试验，并将结果叠加：

```julia-repl
julia> @everywhere include_string(Main, $(read("count_heads.jl", String)), "count_heads.jl")

julia> a = @spawn count_heads(100000000)
Future(2, 1, 6, nothing)

julia> b = @spawn count_heads(100000000)
Future(3, 1, 7, nothing)

julia> fetch(a)+fetch(b)
100001564
```

上面的例子展示了一种非常常见而且有用的并行编程模式，在一些进程中执行多次独立的迭代，然后将它们的结果通过某个函数合并到一起，这个合并操作通常称作**聚合**(*reduction*)，也就是一般意义上的**张量降维**(tensor-rank-reducing)，比如将一个向量降维成一个数，或者是将一个 tensor 降维到某一行或者某一列等。在代码中，通常具有 `x = f(x, v[i])` 这种形式，其中 `x` 是一个叠加器，`f` 是一个聚合函数，而 `v[i]` 则是将要被聚合的值。一般来说，`f` 要求满足结合律，这样不管执行的顺序如何，都不会影响计算结果。

前面的代码中，调用 `count_heads` 的方式可以被抽象出来，之前我们显式地调用了两次 [`@spawn`](@ref)，这将并行计算限制在了两个进程上，为了将并行计算扩展到任意多进程，可以使用 *parallel for loop* 这种形式，在 Julia 中可以用 [`@distributed`](@ref) 宏来实现：

```julia
nheads = @distributed (+) for i = 1:200000000
    Int(rand(Bool))
end
```

上面的写法将多次迭代分配到了不同的线程，然后通过一个聚合函数（这里是 `(+)`）合并计算结果，其中，每次迭代的结果作为 `for` 循环中的表达式的结果，最后整个循环的结果聚合后得到最终的结果。

注意，尽管这里 for 循环看起来跟串行的 for 循环差不多，实际表现完全不同。这里的迭代并没有特定的执行顺序，而且由于所有的迭代都在不同的进程中进行，其中变量的写入对全局来说不可见。所有并行的 for 循环中的变量都会复制并广播到每个进程。

比如，下面这段代码并不会像你想要的那样执行：

```julia
a = zeros(100000)
@distributed for i = 1:100000
    a[i] = i
end
```

这段代码并不会把 `a` 的所有元素初始化，因为每个进程都会有一份 `a` 的拷贝，因此类似的 for 循环一定要避免。幸运的是，[共享数组](@ref man-shared-arrays) 可以用来突破这种限制：

```julia
using SharedArrays

a = SharedArray{Float64}(10)
@distributed for i = 1:10
    a[i] = i
end
```

当然，对于 for 循环外面的变量来说，如果是只读的话，使用起来完全没问题：

```julia
a = randn(1000)
@distributed (+) for i = 1:100000
    f(a[rand(1:end)])
end
```

这里每次迭代都会从共享给每个进程的向量 `a` 中随机选一个样本，然后用来计算 `f`。

可以看到，如果不需要的话，聚合函数可以省略掉，此时，for 循环会异步执行，将独立的任务发送给所有的进程，然后不用等待执行完成，而是立即返回一个 [`Future`](@ref) 数组，调用者可以在之后的某个时刻通过调用 [`fetch`](@ref) 来等待 [`Future`](@ref) 执行完成，或者通过在并行的 for 循环之前添加一个 [`@sync`](@ref)，就像`@sync @distributed for`。

在一些不需要聚合函数的情况下，我们可能只是像对某个范围内的整数应用一个函数(或者，更一般地，某个序列中的所有元素)，这种操作称作**并行的 map**，在 Julia 中有一个对应的函数 [`pmap`](@ref)。例如，可以像下面这样计算一些随机大矩阵的奇异值：

```julia-repl
julia> M = Matrix{Float64}[rand(1000,1000) for i = 1:10];

julia> pmap(svdvals, M);
```

Julia 中的 [`pmap`](@ref) 是被设计用来处理一些计算量比较复杂的函数的并行化的。与之对比的是，`@distributed for` 是用来处理一些每次迭代计算都很轻量的计算，比如简单地对两个数求和。[`pmap`](@ref) 和 `@distributed for` 都只会用到 worker 的进程。对于 `@distributed for` 而言，最后的聚合计算由发起者的进程完成。

## 远程引用和 AbstractChannel

远程引用通常指某种 `AbstractChannel` 的实现。

一个具体的 `AbstractChannel`（有点像 `Channel`）需要将 [`put!`](@ref), [`take!`](@ref), [`fetch`](@ref), [`isready`](@ref) 和 [`wait`](@ref) 都实现。通过 [`Future`](@ref) 引用的远程对象存储在一个 `Channel{Any}(1)` 中（容量为 1，类型为 `Any`）。

[`RemoteChannel`](@ref) 可以被反复写入，可以指向任意大小和类型的 channel（或者是任意 `AbstractChannel` 的实现）。

`RemoteChannel(f::Function, pid)()` 构造器可以构造一些引用，而这些引用指向的 channel 可以容纳多个某种具体类型的数据。其中 `f` 是将要在 `pid` 上执行的函数，其返回值必须是 `AbstractChannel` 类型。

例如，`RemoteChannel(()->Channel{Int}(10), pid)` 会创建一个 channel，其类型是 `Int`，容量是 10，这个 channel 存在于 `pid` 进程中。

针对 [`RemoteChannel`](@ref) 的 [`put!`](@ref), [`take!`](@ref), [`fetch`](@ref), [`isready`](@ref) 和 [`wait`](@ref) 方法会被重定向到其底层存储着 channel 的进程。

因此，[`RemoteChannel`](@ref) 可以用来引用用户自定义的 `AbstractChannel` 对象。在 [Examples repository](https://github.com/JuliaAttic/Examples) 中的 `dictchannel.jl` 文件中有一个简单的例子，其中使用了一个字典用于远端存储。


## Channel 和 RemoteChannel

  * 一个 [`Channel`](@ref) 仅对局部的进程可见，worker 2 无法直接访问 worker 3 上的 `Channel`，反之亦如此。不过 [`RemoteChannel`](@ref) 可以跨 worker 获取和写入数据。
     
  * [`RemoteChannel`](@ref) 可以看作是对 `Channel` 的封装。
  * [`RemoteChannel`](@ref) 的 `pid` 就是其封装的 channel 所在的进程 id。
     
  * 任意拥有 [`RemoteChannel`](@ref) 引用的进程都可以对其进行读写，数据会自动发送到 [`RemoteChannel`](@ref) 底层 channel 的进程（或从中获取数据）
     
     
  * 序列化 `Channel` 会将其中的所有数据也都序列化，因此反序列化的时候也就可以得到一个原始数据的拷贝。
     
  * 不过，对 [`RemoteChannel`](@ref) 的序列化则只会序列化其底层指向的 channel 的 id，因此反序列化之后得到的对象仍然会指向之前存储的对象。
     
     
     

如上的通道示例可以修改为进程间通信，如下所示

首先，起 4 个 worker 进程处理同一个 remote channel `jobs`，其中的每个 job 都有一个对应的 `job_id`，然后每个 task 读取一个 `job_id`，然后模拟随机等待一段时间，然后往存储结果的 `RemoteChannel` 中写入一个 Tuple 对象，其中包含 `job_id` 和等待的时间。最后将结果打印出来。

```julia-repl
julia> addprocs(4); # add worker processes

julia> const jobs = RemoteChannel(()->Channel{Int}(32));

julia> const results = RemoteChannel(()->Channel{Tuple}(32));

julia> @everywhere function do_work(jobs, results) # define work function everywhere
           while true
               job_id = take!(jobs)
               exec_time = rand()
               sleep(exec_time) # simulates elapsed time doing actual work
               put!(results, (job_id, exec_time, myid()))
           end
       end

julia> function make_jobs(n)
           for i in 1:n
               put!(jobs, i)
           end
       end;

julia> n = 12;

julia> @async make_jobs(n); # feed the jobs channel with "n" jobs

julia> for p in workers() # start tasks on the workers to process requests in parallel
           remote_do(do_work, p, jobs, results)
       end

julia> @elapsed while n > 0 # print out results
           job_id, exec_time, where = take!(results)
           println("$job_id finished in $(round(exec_time; digits=2)) seconds on worker $where")
           n = n - 1
       end
1 finished in 0.18 seconds on worker 4
2 finished in 0.26 seconds on worker 5
6 finished in 0.12 seconds on worker 4
7 finished in 0.18 seconds on worker 4
5 finished in 0.35 seconds on worker 5
4 finished in 0.68 seconds on worker 2
3 finished in 0.73 seconds on worker 3
11 finished in 0.01 seconds on worker 3
12 finished in 0.02 seconds on worker 3
9 finished in 0.26 seconds on worker 5
8 finished in 0.57 seconds on worker 4
10 finished in 0.58 seconds on worker 2
0.055971741
```

### 远程调用和分布式垃圾回收

远程引用所指向的对象可以在其所有引用都被集群删除之后被释放掉。

存储具体值的节点会记录哪些 worker 已经引用了它。每当某个 [`RemoteChannel`](@ref) 或某个（还没被获取的）[`Future`](@ref) 序列化到一个 worker 中时，会通知相应的节点。而且每当某个 [`RemoteChannel`](@ref) 或某个（还没被获取的）[`Future`](@ref) 被本地的垃圾回收器回收的时候，相应的节点也会收到通知。所有这些都是通过一个集群内部序列化器实现的，而所有的远程引用都只有在运行中的集群才有效，目前序列化和反序列化到 `IO` 暂时还不支持。

上面说到的**通知**都是通过发送"跟踪"信息来实现的，当一个引用被序列化的时候，就会发送"添加引用"的信息，而一个引用被本地的垃圾回收器回收的时候，就会发送一个"删除引用"的信息。

由于 [`Future`](@ref) 是一次写入然后换成在本地，因此 [`fetch`](@ref) 一个 [`Future`](@ref) 会向拥有该值的节点发送更新引用的跟踪信息。

一旦指向某个值的引用都被删除了，对应的节点会将其释放。

对于 [`Future`](@ref) 来说，序列化一个已经获取了值的 [`Future`](@ref) 到另外一个节点时，会将其值也一并序列化过去，因为原始的远端的值可能已经被回收释放了。

此外需要注意的是，本地的垃圾回收到底发生在什么时候取决于具体对象的大小以及当时系统的内存压力。

对于远端引用，其引用本身的大小很小，不过在远端节点存储着的值可能相当大。由于本地的对象并不会立即被回收，于是一个比较好的做法是，对本地的 [`RemoteChannel`](@ref) 或者是还没获取值的 [`Future`](@ref) 执行 [`finalize`](@ref)。对于已经获取了值的 [`Future`](@ref) 来说，由于已经在调用 [`fetch`](@ref) 的时候已经将引用删除了，因此就不必再 [`finalize`](@ref) 了。显式地调用 [`finalize`](@ref) 会立即向远端节点发送信息并删除其引用。

一旦执行了 finalize 之后，引用就不可用了。

## [共享数组](@id man-shared-arrays)

共享数组使用系统共享内存将数组映射到多个进程上，尽管和 [`DArray`](https://github.com/JuliaParallel/DistributedArrays.jl) 有点像，但其实际表现有很大不同。在 [`DArray`](https://github.com/JuliaParallel/DistributedArrays.jl) 中，每个进程可以访问数据中的一块，但任意两个进程都不能共享同一块数据，而对于 [`SharedArray`](@ref)，每个进程都可以访问整个数组。如果你想在一台机器上，让一大块数据能够被多个进程访问到，那么 [`SharedArray`](@ref) 是个不错的选择。

共享数组由 `SharedArray` 提供，必须在所有相关的 worker 中都显式地加载。


对 [`SharedArray`](@ref) 索引（访问和复制）操作就跟普通的数组一样，由于底层的内存对本地的进程是可见的，索引的效率很高，因此大多数单进程上的算法对 [`SharedArray`](@ref) 来说都是适用的，除非某些算法必须使用 [`Array`](@ref) 类型（此时可以通过调用 [`sdata`](@ref) 来获取 [`SharedArray`](@ref) 数组）。对于其它类型的 `AbstractArray` 类型数组来说，[`sdata`](@ref) 仅仅会返回数组本身，因此，可以放心地使用 [`sdata`](@ref) 对任意类型的 `Array` 进行操作。

共享数组可以通过以下形式构造：

```julia
SharedArray{T,N}(dims::NTuple; init=false, pids=Int[])
```

上面的代码会创建一个 N 维，类型为 `T`，大小为 `dims` 的共享数组，通过 `pids` 指定可见的进程。与分布式数组不同的是，只有通过 `pids` 指定的 worker 才可见。

如果提供了一个类型为 `initfn(S::SharedArray)` 的 `init` 函数，那么所有相关的 worker 都会调用它。你可以让每个 worker 都在共享数组不同的地方执行 `init` 函数，从而实现并行初始化。

下面是个例子：

```julia-repl
julia> using Distributed

julia> addprocs(3)
3-element Array{Int64,1}:
 2
 3
 4

julia> @everywhere using SharedArrays

julia> S = SharedArray{Int,2}((3,4), init = S -> S[localindices(S)] = myid())
3×4 SharedArray{Int64,2}:
 2  2  3  4
 2  3  3  4
 2  3  4  4

julia> S[3,2] = 7
7

julia> S
3×4 SharedArray{Int64,2}:
 2  2  3  4
 2  3  3  4
 2  7  4  4
```

[`SharedArrays.localindices`](@ref) 提供了一个以为的切片，可以很方便地用来将 task 分配到各个进程上。当然你可以按你想要的方式做区分：

```julia-repl
julia> S = SharedArray{Int,2}((3,4), init = S -> S[indexpids(S):length(procs(S)):length(S)] = myid())
3×4 SharedArray{Int64,2}:
 2  2  2  2
 3  3  3  3
 4  4  4  4
```

由于所有的进程都能够访问底层的数据，因此一定要小心避免出现冲突：

```julia
@sync begin
    for p in procs(S)
        @async begin
            remotecall_wait(fill!, p, S, p)
        end
    end
end
```

上面的代码会导致不确定的结果，因为每个进程都将**整个**数组赋值为其 `pid`，从而导致最后一个执行完成的进程会保留其 `pid`。

考虑更复杂的一种情况：

```julia
q[i,j,t+1] = q[i,j,t] + u[i,j,t]
```

这个例子中，如果首先将任务用按照一维的索引作区分，那么就会出问题：如果 `q[i,j,t]` 位于分配给某个 worker 的最后一个位置，而 `q[i,j,t+1]` 位于下一个 worker 的开始位置，那么后面这个 worker 开始计算的时候，可能 `q[i,j,t]` 还没有准备好，这时候，更好的做法是，手动分区，比如可以定义一个函数，按照 `(irange,jrange)` 给每个 worker 分配任务。

```julia-repl
julia> @everywhere function myrange(q::SharedArray)
           idx = indexpids(q)
           if idx == 0 # This worker is not assigned a piece
               return 1:0, 1:0
           end
           nchunks = length(procs(q))
           splits = [round(Int, s) for s in range(0, stop=size(q,2), length=nchunks+1)]
           1:size(q,1), splits[idx]+1:splits[idx+1]
       end
```

然后定义计算内核：

```julia-repl
julia> @everywhere function advection_chunk!(q, u, irange, jrange, trange)
           @show (irange, jrange, trange)  # display so we can see what's happening
           for t in trange, j in jrange, i in irange
               q[i,j,t+1] = q[i,j,t] + u[i,j,t]
           end
           q
       end
```

然后定义一个 wrapper：

```julia-repl
julia> @everywhere advection_shared_chunk!(q, u) =
           advection_chunk!(q, u, myrange(q)..., 1:size(q,3)-1)
```

接下来，比较三个不同的版本，第一个是单进程版本：

```julia-repl
julia> advection_serial!(q, u) = advection_chunk!(q, u, 1:size(q,1), 1:size(q,2), 1:size(q,3)-1);
```

然后是使用 [`@distributed`](@ref):


```julia-repl
julia> function advection_parallel!(q, u)
           for t = 1:size(q,3)-1
               @sync @distributed for j = 1:size(q,2)
                   for i = 1:size(q,1)
                       q[i,j,t+1]= q[i,j,t] + u[i,j,t]
                   end
               end
           end
           q
       end;
```

最后是使用分区：

```julia-repl
julia> function advection_shared!(q, u)
           @sync begin
               for p in procs(q)
                   @async remotecall_wait(advection_shared_chunk!, p, q, u)
               end
           end
           q
       end;
```

如果创建好了 `SharedArray` 之后，计算这些函数的执行时间，那么可以得到以下结果（用 `julia -p 4` 启动）：

```julia-repl
julia> q = SharedArray{Float64,3}((500,500,500));

julia> u = SharedArray{Float64,3}((500,500,500));
```

先执行一次以便 JIT 编译，然后用 [`@time`](@ref) 宏测试其第二次执行的时间：

```julia-repl
julia> @time advection_serial!(q, u);
(irange,jrange,trange) = (1:500,1:500,1:499)
 830.220 milliseconds (216 allocations: 13820 bytes)

julia> @time advection_parallel!(q, u);
   2.495 seconds      (3999 k allocations: 289 MB, 2.09% gc time)

julia> @time advection_shared!(q,u);
        From worker 2:       (irange,jrange,trange) = (1:500,1:125,1:499)
        From worker 4:       (irange,jrange,trange) = (1:500,251:375,1:499)
        From worker 3:       (irange,jrange,trange) = (1:500,126:250,1:499)
        From worker 5:       (irange,jrange,trange) = (1:500,376:500,1:499)
 238.119 milliseconds (2264 allocations: 169 KB)
```

这里 `advection_shared!` 最大的优势在于，最小程度地降低了 woker 之间的通信，从而让每个 worker 能针对被分配的部分持续地计算一段时间。

### 共享数组与分布式垃圾回收

和远程引用一样，共享数组也依赖于创建节点上的垃圾回收来释放所有参与的 worker 上的引用。因此，创建大量生命周期比较短的数组，并尽可能快地显式 finilize 这些对象，代码会更高效，这样与之对用的内存和文件句柄都会更快地释放。

## 集群管理器

Julia 通过集群管理器实现对多个进程（所构成的逻辑上的集群）的启动，管理以及网络通信。一个 `ClusterManager` 负责：

  * 在一个集群环境中启动 worker 进程 
  * 管理每个 worker 生命周期内的事件
  * （可选），提供数据传输

一个 Julia 集群由以下特点：

  * 初始进程，称为 `master`，其 `id` 为 1
  * 只有 master 进程可以增加或删除 worker 进程
  * 所有进程之间都可以直接通信

worker 之间的连接（用的是内置的 TCP/IP 传输）按照以下方式进行：

  * master 进程对一个 `ClusterManager` 对象调用 [`addprocs`](@ref)
  * [`addprocs`](@ref) 调用对应的 [`launch`](@ref) 方法，然后在对应的机器上启动相应数量的 worker 进程
     
  * 每个 worker 监听一个端口，然后将其 host 和 port 信息传给 [`stdout`](@ref)
  * 集群管理器捕获 [`stdout`](@ref) 中每个 worker 的信息，并提供给 master 进程
     
  * master 进程解析信息并与相应的 worker 建立 TCP/IP 连接
  * 每个 worker 都会被通知集群中的其它 worker
  * 每个 worker 与 `id` 小于自己的 worker 连接
  * 这样，一个网络就建立了，从而，每个 worker 都可以与其它 worker 建立连接
     

尽管默认的传输层使用的是 [`TCPSocket`](@ref)，对于一个自定义的集群管理器来说，完全可以使用其它传输方式。

Julia 提供了两种内置的集群管理器：

  * `LocalManager`，调用 [`addprocs()`](@ref) 或 [`addprocs(np::Integer)`](@ref) 时会用到。
  * `SSHManager`，调用 [`addprocs(hostnames::Array)`](@ref) 时，传递一个 hostnames 的列表。

`LocalManager` 用来在同一个 host 上启动多个 worker，从而利用多核/多处理器硬件。

因此，一个最小的集群管理器需要：

  * 是一个 `ClusterManager` 抽象类的一个子类
  * 实现 [`launch`](@ref) 接口，用来启动新的 worker
  * 实现 [`manage`](@ref)，在一个 worker 的生命周期中多次被调用（例如，发送中断信号）
     

[`addprocs(manager::FooManager)`](@ref addprocs) 需要 `FooManager` 实现：


```julia
function launch(manager::FooManager, params::Dict, launched::Array, c::Condition)
    [...]
end

function manage(manager::FooManager, id::Integer, config::WorkerConfig, op::Symbol)
    [...]
end
```

作为一个例子，我们来看下 `LocalManager` 是怎么实现的：

```julia
struct LocalManager <: ClusterManager
    np::Integer
end

function launch(manager::LocalManager, params::Dict, launched::Array, c::Condition)
    [...]
end

function manage(manager::LocalManager, id::Integer, config::WorkerConfig, op::Symbol)
    [...]
end
```

[`launch`](@ref) 方法接收以下参数：


  * `manager::ClusterManager`: 调用 [`addprocs`](@ref) 时所用到的集群管理器
  * `params::Dict`: 所有的关键字参数都会传递到 [`addprocs`](@ref) 中
  * `launched::Array`: 用来存储一个或多个 `WorkerConfig`
  * `c::Condition`: 在 workers 启动后被通知的条件变量

[`launch`](@ref) 会在一个异步的task中调用，该 task 结束之后，意味着所有请求的 worker 都已经启动好了。因此，[`launch`](@ref) 函数**必须**在所有 worker 启动之后，尽快退出。

新启动的 worker 之间采用的是多对多的连接方式。在命令行中指定参数 `--worker[=<cookie>]` 会让所有启动的进程把自己当作 worker，然后通过 TCP/IP 构建连接。

集群中所有的 worker 默认使用同一个 master 的 [cookie](@ref man-cluster-cookie)。如果 cookie 没有指定，（比如没有通过 `--worker` 指定），那么 worker 会尝试从它的标准输入中读取。`LocalManager` 和 `SSHManager` 都是通过标准输入来将 cookie 传递给新启动的 worker。

默认情况下，一个 worker 会监听从 [`getipaddr()`](@ref) 函数返回的地址上的一个开放端口。若要指定监听的地址，可以通过额外的参数 `--bind-to bind_addr[:port]` 指定，这对于多 host 的情况来说很方便。

对于非 TCP/IP 传输，可以选择 MPI 作为一种实现，此时一定**不要**指定 `--worker` 参数，另外，新启动的 worker 必须调用 `init_worker(cookie)` 之后再使用并行的结构体。

对于每个已经启动的 worker，[`launch`](@ref) 方法必须往 `launched` 中添加一个 `WorkerConfig` 对象（相应的值已经初始化）。

```julia
mutable struct WorkerConfig
    # Common fields relevant to all cluster managers
    io::Union{IO, Nothing}
    host::Union{AbstractString, Nothing}
    port::Union{Integer, Nothing}

    # Used when launching additional workers at a host
    count::Union{Int, Symbol, Nothing}
    exename::Union{AbstractString, Cmd, Nothing}
    exeflags::Union{Cmd, Nothing}

    # External cluster managers can use this to store information at a per-worker level
    # Can be a dict if multiple fields need to be stored.
    userdata::Any

    # SSHManager / SSH tunnel connections to workers
    tunnel::Union{Bool, Nothing}
    bind_addr::Union{AbstractString, Nothing}
    sshflags::Union{Cmd, Nothing}
    max_parallel::Union{Integer, Nothing}

    # Used by Local/SSH managers
    connect_at::Any

    [...]
end
```

`WorkerConfig` 中的大多数字段都是内置的集群管理器会用到，对于自定义的管理器，通常只需要指定 `io` 或 `host`/`port`:

  * 如果指定了 `io`，那么就会用来读取 host/port 信息。每个 worker 会在启动时打印地址和端口，这样 worker 就可以自由监听可用的端口，而不必手动配置 worker 的端口。
     
     
  * 如果 `io` 没有指定，那么 `host` 和 `port` 就会用来连接。
  * `count`，`exename` 和 `exeflags` 用于从一个 worker 上启动额外的 worker。例如，一个集群管理器可能对每个节点都只启动一个 worker，然后再用它来启动额外的 worker。
     
     

      * `count` 可以是一个整数 `n`，用来指定启动 `n` 个 worker
      * `count` 还可以是 `:auto`，用来启动跟那台机器上 CPU 个数（逻辑上的核的个数）相同的 worker
      * `exename` 是 `julia` 可执行文件的全路径
      * `exeflags` 应该设置成传递给将要启动的 worker 命令行参数
  * `tunnel`, `bind_addr`, `sshflags` 和 `max_parallel` 会在从 worker 与 master 进程建立 ssh 隧道时用到
     
  * `userdata` 用来提供给自定义集群管理器存储自己的 worker 相关的信息

`manage(manager::FooManager, id::Integer, config::WorkerConfig, op::Symbol)` 会在一个 worker 生命周期中的不同时刻被调用，其中 op 的值可能是：

  * `:register`/`:deregister`，从 Julia 的 worker 池子中添加/删除一个 worker
  * `:interrupt`，当 `interrupt(workers)` 被调用是，此时，`ClusterManager` 应该给相应的 worker 发送终端信号
     
  * `:finalize`，用于清理操作。

### 自定义集群管理器的传输方式

将默认的 TCP/IP 多对多 socket 连接替换成一个自定义的传输层需要做很多工作。每个 Julia 进程都有与其连接的 worker 数量相同的通信 task。例如，在一个有 32 个进程的多对多集群中：

  * 每个进程都有31个通信task
  * 每个 task 在一个**消息处理循环**中从一个远端 worker 读取所有的输入信息
  * 每个消息处理循环等待一个 `IO` 对象（比如，在默认实现中是一个 [`TCPSocket`](@ref)），然后读取整个信息，处理，等待下一个
     
  * 发送消息则可以直接在任意 Julia task 中完成，而不只是通信 task，同样，也是通过相应的 `IO` 对象
     

要替换默认的传输方式，需要新的实现能够在远程 worker 之间建立连接，同时提供一个可以用来被消息处理循环等待的 `IO` 对象。集群管理器的回调函数需要实现如下函数：

```julia
connect(manager::FooManager, pid::Integer, config::WorkerConfig)
kill(manager::FooManager, pid::Int, config::WorkerConfig)
```

默认的实现（使用的是 TCP/IP socket）是 `connect(manager::ClusterManager, pid::Integer, config::WorkerConfig)`。


`connect` 需要返回一对 `IO` 对象，一个用于从 `pid` worker 读取数据，另一个用于往 `pid` 写数据。自定义的集群管理器可以用内存中的 `BUfferStream` 作为一个管道将自定义的（很可能是非 `IO` 的）传输与 Julia 内置的并行基础设施衔接起来。

`BufferStream` 是一个内存中的 [`IOBuffer`](@ref)，其表现很像 `IO`，就是一个**流**（stream），可以异步地处理。

在 [Examples repository](https://github.com/JuliaAttic/Examples) 的 `clustermanager/0mq` 目录中，包含一个使用 ZeroMQ 连接 Julia worker 的例子，用的是星型拓补结构。需要注意的是：Julia 的进程仍然是**逻辑上**相互连接的，任意 worker 都可以与其它 worker 直接相连而无需感知到 0MQ 作为传输层的存在。

在使用自定义传输的时候：

  * Julia 的 workers 必须**不能**通过 `--worker` 启动。如果启动的时候使用了 `--worker`，那么新启动的 worker 会默认使用基于 TCP/IP socket 的实现
     
  * 对于每个 worker 逻辑上的输入连接，必须调用 `Base.process_messages(rd::IO, wr::IO)()`，这会创建一个新的 task 来处理 worker 消息的读写
     
     
  * `init_worker(cookie, manager::FooManager)` 必须作为 worker 进程初始化的一部分呢被调用
  * `WorkerConfig `中的 `connect_at::Any` 字段可以被集群管理器在调用 [`launch`](@ref) 的时候设置，该字段的值会发送到所有的 [`connect`](@ref) 回调中。通常，其中包含的是**如何连接到**一个 worker 的信息。例如，在 TCP/IP socket 传输中，用这个字段存储 `(host, port)` 来声明如何连接到一个 worker。
     
     
     

`kill(manager, pid, config)` 用来从一个集群中删除一个 worker，在 master 进程中，对应的 `IO` 对象必须通过对应的实现来关闭，从而保证正确地释放资源。默认的实现简单地对指定的远端 worker 执行 `exit()` 即可。

在例子目录中，`clustermanager/simple` 展示了一个简单地实现，使用的是 UNIX 下的 socket。

### LocalManager 和 SSHManager 的网络要求

Julia 集群设计的时候，默认是在一个安全的环境中执行，比如本地的笔记本，部门的集群，甚至是云端。这部分将介绍 `LocalManager` 和 `SSHManager` 的网络安全要点：

  * master 进程不监听任何端口，它只负责向外连接 worker
  * 每个 worker 都只绑定一个本地的接口，同时监听一个操作系统分配的临时端口。
     
  * `addprocs(N)` 使用的 `LocalManager`，默认只会绑定到回环接口（loopback interface），这就意味着，之后在远程主机上（恶意）启动的 worker 无法连接到集群中，在执行 `addprocs(4)` 之后，又跟一个 `addprocs(["remote_host"])` 会失败。有些用户可能希望创建一个集群同时管理本地系统和几个远端系统，这可以通过在绑定 `LocalManager` 到外部网络接口的时候，指定一个 `restrict` 参数：`addprocs(4; restrict=false)`
     
     
     
     
     
  *  
    `addprocs(list_of_remote_hosts)` 使用的 `SSHManager` 会通过 SSH 启动远程机上的 worker。
默认 SSH 只会用来启动 Julia 的 worker。随后的 master-worker 和 worker-worker 连接使用的是普通的、未加密的 TCP/IP 通信。
    远程机必须开启免密登陆。
    额外的 SSH 标记或认证信息会通过关键字参数 `sshflags` 指定。
  * `addprocs(list_of_remote_hosts; tunnel=true, sshflags=<ssh keys and other flags>)` 在我们希望给 master-worker 也使用 SSH 连接的时候很有用。
    一个典型的场景是本地的笔记本
    运行 Julia ERPL （做为 master）和云上的其他机器，比如 Amazon EC2，构成集群。
    这时候远程机器只要开启 22 端口就可以，然后要有 SSH 客户端
    通过公约基础设施（PKI）认证过。授权信息可以通过
    `sshflags` 生效，比如 ```sshflags=`-i <keyfile>` ```。

    在一个所有节点联通的拓扑网中（默认情况下是这样的），所有的 worker 节点都通过普通 TCP socket 通信互相连接。
    这样集群的安全策略就必须允许 worker 节点间
    通过操作系统分配的临时端口范围自由连接。

    所有 worker-worker 间（都是 SSH）的安全和加密或者信息的加密
    都可以通过自定义 `ClusterManager` 完成。

### [集群 Cookie](@id man-cluster-cookie)

集群上所有的进程都共享同一个 cookie，默认是 master 进程随机生成的字符串。

  * [`cluster_cookie()`](@ref) 返回 cookie，而 `cluster_cookie(cookie)()` 设置并返回新的 cookie。
     
  * 所有的连接都进行双向认证，从而保证只有 master 启动的 worker 才能相互连接。
     
  * cookie 可以在 worker 启动的时候，通过参数 `--worker=<cookie>` 指定，如果参数 `--worker` 没有指定 cookie，那么 worker 会从它的标准输入中 ([`stdin`](@ref)) 读取， `stdin` 会在 cookie 获取之后立即关闭。
     
     
  * `ClusterManager` 可以通过 [`cluster_cookie()`](@ref) 从 master 中过去 cookie，不适用默认 TCP/IP 传输的集群管理器（即没有指定 `--worker`）必须用于 master 相同的 cookie 调用 `init_worker(cookie, manager)`。
     
     

注意，在对安全性要求很高的环境中，可以通过自定义 `ClusterManager` 实现。例如，cookie 可以提前共享，然后不必再启动参数中指定。

## 指定网络拓补结构（实验性功能）

可以通过传递到 `addprocs` 中的参数 `topology` 来指定 worker 之间如何连接。

  * `:all_to_all`，默认的，所有 worker 之间相互都连接
  * `:master_worker`，只有主进程，即 `pid` 为 1 的进程能够与 worker 建立连接
  * `:custom`: 集群管理器的 `launch` 方法通过 `WorkerConfig` 中的 `ident` 和 `connect_idents` 指定连接的拓补结构。一个 worker 通过集群管理器提供的 `ident` 来连接到所有 `connect_idents` 指定的 worker。
     
     

关键字参数 `lazy=true|false` 只会影响 `topology` 选项中的 `:all_to_all`。如果是 `true`，那么集群启动的时候 master 会连接所有的 worker，然后 worker 之间的特定连接会在初次唤醒的是建立连接，这有利于降低集群初始化的时候对资源的分配。`lazy` 的默认值是 `true`。

目前，在没有建立连接的两个 worker 之间传递消息会出错，目前该行为是实验性的，未来的版本中可能会改变。

## 一些值得关注的外部库

除了 Julia 自带的并行机制之外，还有许多外部的库值得一提。例如 [MPI.jl](https://github.com/JuliaParallel/MPI.jl) 提供了一个 `MPI` 协议的 Julia 的封装，或者是在 [共享数组](@ref) 提到的 [DistributedArrays.jl](https://github.com/JuliaParallel/Distributedarrays.jl)，此外尤其值得一提的是 Julia 的 GPU 编程生态，其包括：

1. 底层（C内核）的 [OpenCL.jl](https://github.com/JuliaGPU/OpenCL.jl) 和 [CUDAdrv.jl](https://github.com/JuliaGPU/CUDAdrv.jl)，分别提供了 OpenCL 和 CUDA 的封装。

2. 底层（Julia 内核）的接口，如 [CUDAnative.jl](https://github.com/JuliaGPU/CUDAnative.jl)，提供了 Julia 原生的 CUDA 实现。

3. 高层的特定抽象，如 [CuArrays.jl](https://github.com/JuliaGPU/CuArrays.jl) 和 [CLArrays.jl](https://github.com/JuliaGPU/CLArrays.jl)。

4. 高层的库，如 [ArrayFire.jl](https://github.com/JuliaComputing/ArrayFire.jl) 和 [GPUArrays.jl](https://github.com/JuliaGPU/GPUArrays.jl)。


下面的例子将介绍如何用 `DistributedArrays.jl` 和 `CuArrays.jl` 通过 `distribute()` 和 `CuArray()` 将数组分配到多个进程。

记住在载入 `DistributedArrays.jl` 时，需要用 [`@everywhere`](@ref) 将其载入到多个进程中。


```julia-repl
$ ./julia -p 4

julia> addprocs()

julia> @everywhere using DistributedArrays

julia> using CuArrays

julia> B = ones(10_000) ./ 2;

julia> A = ones(10_000) .* π;

julia> C = 2 .* A ./ B;

julia> all(C .≈ 4*π)
true

julia> typeof(C)
Array{Float64,1}

julia> dB = distribute(B);

julia> dA = distribute(A);

julia> dC = 2 .* dA ./ dB;

julia> all(dC .≈ 4*π)
true

julia> typeof(dC)
DistributedArrays.DArray{Float64,1,Array{Float64,1}}

julia> cuB = CuArray(B);

julia> cuA = CuArray(A);

julia> cuC = 2 .* cuA ./ cuB;

julia> all(cuC .≈ 4*π);
true

julia> typeof(cuC)
CuArray{Float64,1}
```
要牢记，当前一些 Julia 的特性并没有被 CUDAnative.jl [^2] 支持，尤其是一些像 `sin` 之类的函数需要换成 `CUDAnative.sin`(cc: @maleadt)。

下面的例子中，通过 `DistributedArrays.jl` 和 `CuArrays.jl` 将一个数组分配到多个进程，然后调用一个函数。

```julia
function power_method(M, v)
    for i in 1:100
        v = M*v
        v /= norm(v)
    end

    return v, norm(M*v) / norm(v)  # or  (M*v) ./ v
end
```

`power_method` 重复创建一个新的向量然后对其归一化，这里并没有在函数中指定类型信息，来看看是否对前面提到的类型适用：

```julia-repl
julia> M = [2. 1; 1 1];

julia> v = rand(2)
2-element Array{Float64,1}:
0.40395
0.445877

julia> power_method(M,v)
([0.850651, 0.525731], 2.618033988749895)

julia> cuM = CuArray(M);

julia> cuv = CuArray(v);

julia> curesult = power_method(cuM, cuv);

julia> typeof(curesult)
CuArray{Float64,1}

julia> dM = distribute(M);

julia> dv = distribute(v);

julia> dC = power_method(dM, dv);

julia> typeof(dC)
Tuple{DistributedArrays.DArray{Float64,1,Array{Float64,1}},Float64}
```

最后，我们来看看 `MPI.jl`，这个库时 Julia 对 MPI 协议的封装。一一介绍其中的每个函数太累赘了，这里领会其实现协议的方法就够了。

考虑下面这个简单的脚本，它做的只是调用每个子进程，然后初始化其 rank，然后在 master 访问时，对 rank 求和。

```julia
import MPI

MPI.Init()

comm = MPI.COMM_WORLD
MPI.Barrier(comm)

root = 0
r = MPI.Comm_rank(comm)

sr = MPI.Reduce(r, MPI.SUM, root, comm)

if(MPI.Comm_rank(comm) == root)
   @printf("sum of ranks: %s\n", sr)
end

MPI.Finalize()
```

```
mpirun -np 4 ./julia example.jl
```

[^1]:
    In this context, MPI refers to the MPI-1 standard. Beginning with MPI-2, the MPI standards committee
    introduced a new set of communication mechanisms, collectively referred to as Remote Memory Access
    (RMA). The motivation for adding rma to the MPI standard was to facilitate one-sided communication
    patterns. For additional information on the latest MPI standard, see <https://mpi-forum.org/docs>.

[^2]:
    [Julia GPU 手册](http://juliagpu.github.io/CUDAnative.jl/stable/man/usage.html#Julia-support-1)
