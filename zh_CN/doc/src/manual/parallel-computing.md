# 并行计算

对于多线程和并行计算的新手来说，首先了解Jullia所提供的
不同层级并行是非常有用的。这里我们主要将其分成三类：

1. Julia 协程（绿色线程）
2. 多线程
3. 多核心或分布式处理

我们首先考虑 Julia 任务 [Tasks](@ref man-tasks) 以及其它依赖于 Julia  实时库(runtime library)的模块，通过实时库，可以在挂起和继续计算任务时对内部 'Tasks' 间的通信进行完全控制，并且控制过程无需手动与操作系统的调度进行交互。
Julia 同样允许利用一些操作在 'Tasks' 间进行通信，比如 ['wait'](@ref) 以及 ['fetch'](@ref)。
另外，通信和数据同步是通过 ['Channel'](@ref) 完成的，它也是实现内部 'Tasks' 通信的基石。

Julia还支持实验性的多线程功能，在执行时通过分叉(fork)，然后有一个匿名函数在所有线程上运行，可以看作时一种*分叉-汇合*(fork-join)的方式，并行执行的线程必须在分叉之后，汇合到Julia主线程上，从而继续串行执行。多线程是通过`Base.Threads`模块提供的，目前仍然是实验性的，主要是因为目前Julia还不是完全线程安全的。在进行I/O操作和task切换的时候某些特定的段错误会出现，最新的进展请关注[the issue tracker](https://github.com/JuliaLang/julia/issues?q=is%3Aopen+is%3Aissue+label%3Amultithreading)，多线程应该只在你考虑全局变量，锁以及原子操作的时候使用，后面我们会详细讲解。

最后我们将介绍 Julia 的分布式并行计算的实现方法。鉴于以科学计算为主要目的，
Julia 底层上提供了通过多核心或多机器对任务并行的接口。
同时我们还将介绍一些有用的分布式编程的外部包，比如 'MPI.jl' 以及 'DistributedArrays.jl'。

# 协程

Julia的并行编程平台采用 [Tasks (aka Coroutines)](@ref man-tasks) 来进行多个计算之间的切换。为了表示轻量线程之间的执行顺序，必须提供一种通信的原语。Julia 提供了 `Channel(func::Function, ctype=Any, csize=0, taskref=nothing)`，根据 `func` 创建 task，然后将其绑定到一个新的大小为 `csize` 类型为 `ctype` 的 channel，并调度 task。`Channels` 可以看作是一种task之间通信的方式，`Channel{T}(sz::Int)` 会创建一个类型为 `T` 大小为 `sz` 的 channel。无论何时发起一个通信操作，如 [`fetch`](@ref) 或 [`wait`](@ref)，当前 task 都会挂起，然后调度器会选择其它 task 去执行，在一个 task 等待的事件结束之后会重新恢复执行。

对于许多问题而言，并不需要直接考虑 task，不过，task 可以用来同时等待多个事件，从而实现**动态调度**。在动态调度的过程中，程序可以决定计算什么，或者根据其它任务执行结束的时间决定接下来在哪里执行计算。这对于不可预测或不平衡的计算量来说是必须的，因为我们只希望给那些已经完成了其当前任务的进程分配更多的任务。


## Channels

在 [Control Flow](@ref) 中有关 [`Task`](@ref) 的部分，已经讨论了如何协调多个函数的执行。[`Channel`](@ref) 可以很方便地在多个运行中的 task 传递数据，特别是那些涉及 I/O 的操作。


典型的 I/O 操作包括读写文件、访问 web 服务、执行外部程序等。在所有这些场景中，如果其它 task 可以在读取文件（等待外部服务或程序执行完成）时继续执行，那么总的执行时间能够得到大大提升。

一个 channel 可以看做是一个管道，一端可读，另一端可写。

  * 不同的 task 可以通过 [`put!`](@ref) 往同一个 channel 并发地写入。
     
  * 不同的 task 也可以通过 [`take!`](@ref) 从同一个 channel 并发地取数据
  * 举个例子：

    ```julia
    # Given Channels c1 and c2,
    c1 = Channel(32)
    c2 = Channel(32)

    # and a function `foo` which reads items from from c1, processes the item read
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
        @schedule foo()
    end
    ```
* Channe l可以通过 `Channel{T}(sz)` 构造，得到的 channel 只能存储类型 `T` 的数据。如果 `T` 没有指定，那么 channel 可以存任意类型。`sz` 表示该 channel 能够存储的最大元素个数。比如 `Channel(32)` 得到的 channel 最多可以存储32个元素。而 `Channel{MyType}(64)` 则可以最多存储64个 `MyType` 类型的数据。
   
   
   
   
* 如果一个 [`Channel`](@ref) 是空的，读取的 task(即执行 [`take!`](@ref) 的 task)会被阻塞直到有新的数据准备好了。
* 如果一个 [`Channel`](@ref) 是满的，那么写入的 task(即执行 [`put!`](@ref) 的 task)则会被阻塞，直到 Channel 有空余。
* [[`isready`](@ref) 可以用来检查一个 channel 中是否有已经准备好的元素，而 [`wait`](@ref) 则用来等待一个元素准备好。](@ref)
   
* 一个 [`Channel`](@ref) 一开始处于开启状态，也就是说可以被 [`take!`](@ref) 读取和 [`put!`](@ref) 写入。[`close`](@ref) 会关闭一个 [`Channel`](@ref)，对于一个已经关闭的 [`Channel`](@ref)，[`put!](@ref) 会失败，例如：
   
   

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

  * [`take!`](@ref) 和 [`fetch`](@ref) (只读取，不会将元素从 channel 中删掉)仍然可以从一个已经关闭的 channel 中读数据，直到 channel 被取空了为止，例如：
     

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

`Channel` 可以在 `for` 循环中遍历，此时，循环会一直运行知道 `Channel` 中有数据，遍历过程中会取遍加入到 `Channel` 中的所有值。一旦 `Channel`关闭或者取空了，`for` 循环就好终止。

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

考虑这样一个用 channel 做 task 之间通信的例子。首先，起4个 task 来处理一个 `jobs` channel 中的数据。`jobs` 中的每个任务通过 `job_id` 来表示，然后每个 task 模拟读取一个 `job_id`，然后随机等待一会儿，然后往一个 `results` channel 中写入一个 Tuple，分别包含 `job_id` 和执行的时间，最后将结果打印出来：

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

julia> @schedule make_jobs(n); # feed the jobs channel with "n" jobs

julia> for i in 1:4 # start 4 tasks to process requests in parallel
           @schedule do_work()
       end

julia> @elapsed while n > 0 # print out results
           job_id, exec_time = take!(results)
           println("$job_id finished in $(round(exec_time,2)) seconds")
           n = n - 1
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

## Atomic Operations

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
                [m; accumulate(Future.randjump, m, fill(big(10)^20, nthreads()-1))]
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

[`@async`](@ref) 跟 [`@spawn`](@ref) 有点类似，不过只在当前局部线程中执行。通过它来给每个进程创建一个**喂养**的 task，每个 task 都选取下一个将要计算的索引，然后等待其执行结束，然后重复该过程，直到索引超出边界。需要注意的是，task 并不会立即执行，只有在执行到 [`@sync`](@ref) 结束时才会开始执行，此时，当前线程交出控制权，直到所有的任务都完成了。在v0.7之后，所有的喂养 task 都能够通过 `nextidx` 共享状态，因为他们都在同一个进程中。尽管 `Tasks` 是协调调度的，但在某些情况下仍然有可能发送死锁，如 [asynchronous I\O](https://docs.julialang.org/en/stable/manual/faq/#Asynchronous-IO-and-concurrent-synchronous-writes-1)。上下文只会在特定时候发生切换，在这里就是执行 [`remotecall_fetch`](@ref)。当然，这是当前版本（dev v0.7）的实现，未来版本中可能会改变，有望在 M 个进程中最多跑 N 个 task，即 [M:N 线程](https://en.wikipedia.org/wiki/Thread_(computing)#Models)。然后，`nextidx` 需要加锁，从而让多个进程能够安全地对一个资源同时进行读写。



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


其它类型的集群可以通过自己写一个 `ClusterManager` 来实现，下面 [ClusterManagers](@ref) 部分会介绍。

## 数据转移

分布式程序的性能瓶颈主要是由发送消息和数据转移造成的，减少发送消息和转移数据的数量对于获取高性能和可扩展性至关重要，因此，深入了解 Julia 分布式程序是如何转移数据的非常有必要。

[`fetch`](@ref) 可以看作是显式地转移数据的操作，因为它直接要求获取数据到本地机器。[`@spawn`](@ref)（以及相关的操作）也会移动数据，不过不那么明显，因此称作隐式地数据转移操作。比较以下两种方式，构造一个随机矩阵并求平方：

方法1：

```julia-repl
julia> A = rand(1000,1000);

julia> Bref = @spawn A^2;

[...]

julia> fetch(Bref);
```

Method 2:

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

julia> @fetchfrom 2 varinfo()
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

The function `count_heads` simply adds together `n` random bits. Here is how we can perform some
trials on two machines, and add together the results:

```julia-repl
julia> @everywhere include_string(Main, $(read("count_heads.jl", String)), "count_heads.jl")

julia> a = @spawn count_heads(100000000)
Future(2, 1, 6, nothing)

julia> b = @spawn count_heads(100000000)
Future(3, 1, 7, nothing)

julia> fetch(a)+fetch(b)
100001564
```

This example demonstrates a powerful and often-used parallel programming pattern. Many iterations
run independently over several processes, and then their results are combined using some function.
The combination process is called a *reduction*, since it is generally tensor-rank-reducing: a
vector of numbers is reduced to a single number, or a matrix is reduced to a single row or column,
etc. In code, this typically looks like the pattern `x = f(x,v[i])`, where `x` is the accumulator,
`f` is the reduction function, and the `v[i]` are the elements being reduced. It is desirable
for `f` to be associative, so that it does not matter what order the operations are performed
in.

Notice that our use of this pattern with `count_heads` can be generalized. We used two explicit
[`@spawn`](@ref) statements, which limits the parallelism to two processes. To run on any number
of processes, we can use a *parallel for loop*, running in distributed memory, which can be written
in Julia using [`@distributed`](@ref) like this:

```julia
nheads = @distributed (+) for i = 1:200000000
    Int(rand(Bool))
end
```

This construct implements the pattern of assigning iterations to multiple processes, and combining
them with a specified reduction (in this case `(+)`). The result of each iteration is taken as
the value of the last expression inside the loop. The whole parallel loop expression itself evaluates
to the final answer.

Note that although parallel for loops look like serial for loops, their behavior is dramatically
different. In particular, the iterations do not happen in a specified order, and writes to variables
or arrays will not be globally visible since iterations run on different processes. Any variables
used inside the parallel loop will be copied and broadcast to each process.

For example, the following code will not work as intended:

```julia
a = zeros(100000)
@distributed for i = 1:100000
    a[i] = i
end
```

This code will not initialize all of `a`, since each process will have a separate copy of it.
Parallel for loops like these must be avoided. Fortunately, [Shared Arrays](@ref man-shared-arrays) can be used
to get around this limitation:

```julia
using SharedArrays

a = SharedArray{Float64}(10)
@distributed for i = 1:10
    a[i] = i
end
```

Using "outside" variables in parallel loops is perfectly reasonable if the variables are read-only:

```julia
a = randn(1000)
@distributed (+) for i = 1:100000
    f(a[rand(1:end)])
end
```

Here each iteration applies `f` to a randomly-chosen sample from a vector `a` shared by all processes.

As you could see, the reduction operator can be omitted if it is not needed. In that case, the
loop executes asynchronously, i.e. it spawns independent tasks on all available workers and returns
an array of [`Future`](@ref) immediately without waiting for completion. The caller can wait for
the [`Future`](@ref) completions at a later point by calling [`fetch`](@ref) on them, or wait
for completion at the end of the loop by prefixing it with [`@sync`](@ref), like `@sync @distributed for`.

In some cases no reduction operator is needed, and we merely wish to apply a function to all integers
in some range (or, more generally, to all elements in some collection). This is another useful
operation called *parallel map*, implemented in Julia as the [`pmap`](@ref) function. For example,
we could compute the singular values of several large random matrices in parallel as follows:

```julia-repl
julia> M = Matrix{Float64}[rand(1000,1000) for i = 1:10];

julia> pmap(svdvals, M);
```

Julia's [`pmap`](@ref) is designed for the case where each function call does a large amount
of work. In contrast, `@distributed for` can handle situations where each iteration is tiny, perhaps
merely summing two numbers. Only worker processes are used by both [`pmap`](@ref) and `@distributed for`
for the parallel computation. In case of `@distributed for`, the final reduction is done on the calling
process.

## Remote References and AbstractChannels

Remote references always refer to an implementation of an `AbstractChannel`.

A concrete implementation of an `AbstractChannel` (like `Channel`), is required to implement
[`put!`](@ref), [`take!`](@ref), [`fetch`](@ref), [`isready`](@ref) and [`wait`](@ref).
The remote object referred to by a [`Future`](@ref) is stored in a `Channel{Any}(1)`, i.e., a
`Channel` of size 1 capable of holding objects of `Any` type.

[`RemoteChannel`](@ref), which is rewritable, can point to any type and size of channels, or any
other implementation of an `AbstractChannel`.

The constructor `RemoteChannel(f::Function, pid)()` allows us to construct references to channels
holding more than one value of a specific type. `f` is a function executed on `pid` and it must
return an `AbstractChannel`.

For example, `RemoteChannel(()->Channel{Int}(10), pid)`, will return a reference to a channel
of type `Int` and size 10. The channel exists on worker `pid`.

Methods [`put!`](@ref), [`take!`](@ref), [`fetch`](@ref), [`isready`](@ref) and [`wait`](@ref)
on a [`RemoteChannel`](@ref) are proxied onto the backing store on the remote process.

[`RemoteChannel`](@ref) can thus be used to refer to user implemented `AbstractChannel` objects.
A simple example of this is provided in `dictchannel.jl` in the
[Examples repository](https://github.com/JuliaArchive/Examples), which uses a dictionary as its
remote store.


## Channels and RemoteChannels

  * A [`Channel`](@ref) is local to a process. Worker 2 cannot directly refer to a [`Channel`](@ref) on worker 3 and
    vice-versa. A [`RemoteChannel`](@ref), however, can put and take values across workers.
  * A [`RemoteChannel`](@ref) can be thought of as a *handle* to a [`Channel`](@ref).
  * The process id, `pid`, associated with a [`RemoteChannel`](@ref) identifies the process where
    the backing store, i.e., the backing [`Channel`](@ref) exists.
  * Any process with a reference to a [`RemoteChannel`](@ref) can put and take items from the channel.
    Data is automatically sent to (or retrieved from) the process a [`RemoteChannel`](@ref) is associated
    with.
  * Serializing  a [`Channel`](@ref) also serializes any data present in the channel. Deserializing it therefore
    effectively makes a copy of the original object.
  * On the other hand, serializing a [`RemoteChannel`](@ref) only involves the serialization of an
    identifier that identifies the location and instance of [`Channel`](@ref) referred to by the handle. A
    deserialized [`RemoteChannel`](@ref) object (on any worker), therefore also points to the same
    backing store as the original.

如上的通道示例可以修改为进程间通信，如下所示

We start 4 workers to process a single `jobs` remote channel. Jobs, identified by an id (`job_id`),
are written to the channel. Each remotely executing task in this simulation reads a `job_id`,
waits for a random amount of time and writes back a tuple of `job_id`, time taken and its own
`pid` to the results channel. Finally all the `results` are printed out on the master process.

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
           println("$job_id finished in $(round(exec_time,2)) seconds on worker $where")
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

### Remote References and Distributed Garbage Collection

Objects referred to by remote references can be freed only when *all* held references
in the cluster are deleted.

The node where the value is stored keeps track of which of the workers have a reference to it.
Every time a [`RemoteChannel`](@ref) or a (unfetched) [`Future`](@ref) is serialized to a worker,
the node pointed to by the reference is notified. And every time a [`RemoteChannel`](@ref) or
a (unfetched) [`Future`](@ref) is garbage collected locally, the node owning the value is again
notified. This is implemented in an internal cluster aware serializer. Remote references are only
valid in the context of a running cluster. Serializing and deserializing references to and from
regular `IO` objects is not supported.

The notifications are done via sending of "tracking" messages--an "add reference" message when
a reference is serialized to a different process and a "delete reference" message when a reference
is locally garbage collected.

Since [`Future`](@ref)s are write-once and cached locally, the act of [`fetch`](@ref)ing a
[`Future`](@ref) also updates reference tracking information on the node owning the value.

The node which owns the value frees it once all references to it are cleared.

With [`Future`](@ref)s, serializing an already fetched [`Future`](@ref) to a different node also
sends the value since the original remote store may have collected the value by this time.

It is important to note that *when* an object is locally garbage collected depends on the size
of the object and the current memory pressure in the system.

In case of remote references, the size of the local reference object is quite small, while the
value stored on the remote node may be quite large. Since the local object may not be collected
immediately, it is a good practice to explicitly call [`finalize`](@ref) on local instances
of a [`RemoteChannel`](@ref), or on unfetched [`Future`](@ref)s. Since calling [`fetch`](@ref)
on a [`Future`](@ref) also removes its reference from the remote store, this is not required on
fetched [`Future`](@ref)s. Explicitly calling [`finalize`](@ref) results in an immediate message
sent to the remote node to go ahead and remove its reference to the value.

Once finalized, a reference becomes invalid and cannot be used in any further calls.

## [Shared Arrays](@id man-shared-arrays)

Shared Arrays use system shared memory to map the same array across many processes. While there
are some similarities to a [`DArray`](https://github.com/JuliaParallel/DistributedArrays.jl), the
behavior of a [`SharedArray`](@ref) is quite different. In a [`DArray`](https://github.com/JuliaParallel/DistributedArrays.jl),
each process has local access to just a chunk of the data, and no two processes share the same
chunk; in contrast, in a [`SharedArray`](@ref) each "participating" process has access to the
entire array.  A [`SharedArray`](@ref) is a good choice when you want to have a large amount of
data jointly accessible to two or more processes on the same machine.

Shared Array support is available via module `SharedArrays` which must be explicitly loaded on
all participating workers.

[`SharedArray`](@ref) indexing (assignment and accessing values) works just as with regular arrays,
and is efficient because the underlying memory is available to the local process. Therefore,
most algorithms work naturally on [`SharedArray`](@ref)s, albeit in single-process mode. In cases
where an algorithm insists on an [`Array`](@ref) input, the underlying array can be retrieved
from a [`SharedArray`](@ref) by calling [`sdata`](@ref). For other `AbstractArray` types, [`sdata`](@ref)
just returns the object itself, so it's safe to use [`sdata`](@ref) on any `Array`-type object.

The constructor for a shared array is of the form:

```julia
SharedArray{T,N}(dims::NTuple; init=false, pids=Int[])
```

which creates an `N`-dimensional shared array of a bits type `T` and size `dims` across the processes specified
by `pids`. Unlike distributed arrays, a shared array is accessible only from those participating
workers specified by the `pids` named argument (and the creating process too, if it is on the
same host).

If an `init` function, of signature `initfn(S::SharedArray)`, is specified, it is called on all
the participating workers. You can specify that each worker runs the `init` function on a distinct
portion of the array, thereby parallelizing initialization.

Here's a brief example:

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

[`SharedArrays.localindices`](@ref) provides disjoint one-dimensional ranges of indices, and is sometimes
convenient for splitting up tasks among processes. You can, of course, divide the work any way
you wish:

```julia-repl
julia> S = SharedArray{Int,2}((3,4), init = S -> S[indexpids(S):length(procs(S)):length(S)] = myid())
3×4 SharedArray{Int64,2}:
 2  2  2  2
 3  3  3  3
 4  4  4  4
```

Since all processes have access to the underlying data, you do have to be careful not to set up
conflicts. For example:

```julia
@sync begin
    for p in procs(S)
        @async begin
            remotecall_wait(fill!, p, S, p)
        end
    end
end
```

would result in undefined behavior. Because each process fills the *entire* array with its own
`pid`, whichever process is the last to execute (for any particular element of `S`) will have
its `pid` retained.

As a more extended and complex example, consider running the following "kernel" in parallel:

```julia
q[i,j,t+1] = q[i,j,t] + u[i,j,t]
```

In this case, if we try to split up the work using a one-dimensional index, we are likely to run
into trouble: if `q[i,j,t]` is near the end of the block assigned to one worker and `q[i,j,t+1]`
is near the beginning of the block assigned to another, it's very likely that `q[i,j,t]` will
not be ready at the time it's needed for computing `q[i,j,t+1]`. In such cases, one is better
off chunking the array manually. Let's split along the second dimension.
Define a function that returns the `(irange, jrange)` indices assigned to this worker:

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

Next, define the kernel:

```julia-repl
julia> @everywhere function advection_chunk!(q, u, irange, jrange, trange)
           @show (irange, jrange, trange)  # display so we can see what's happening
           for t in trange, j in jrange, i in irange
               q[i,j,t+1] = q[i,j,t] + u[i,j,t]
           end
           q
       end
```

We also define a convenience wrapper for a `SharedArray` implementation

```julia-repl
julia> @everywhere advection_shared_chunk!(q, u) =
           advection_chunk!(q, u, myrange(q)..., 1:size(q,3)-1)
```

Now let's compare three different versions, one that runs in a single process:

```julia-repl
julia> advection_serial!(q, u) = advection_chunk!(q, u, 1:size(q,1), 1:size(q,2), 1:size(q,3)-1);
```

one that uses [`@distributed`](@ref):

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

and one that delegates in chunks:

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

If we create `SharedArray`s and time these functions, we get the following results (with `julia -p 4`):

```julia-repl
julia> q = SharedArray{Float64,3}((500,500,500));

julia> u = SharedArray{Float64,3}((500,500,500));
```

Run the functions once to JIT-compile and [`@time`](@ref) them on the second run:

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

The biggest advantage of `advection_shared!` is that it minimizes traffic among the workers, allowing
each to compute for an extended time on the assigned piece.

### Shared Arrays and Distributed Garbage Collection

Like remote references, shared arrays are also dependent on garbage collection on the creating
node to release references from all participating workers. Code which creates many short lived
shared array objects would benefit from explicitly finalizing these objects as soon as possible.
This results in both memory and file handles mapping the shared segment being released sooner.

## ClusterManagers

The launching, management and networking of Julia processes into a logical cluster is done via
cluster managers. A `ClusterManager` is responsible for

  * launching worker processes in a cluster environment
  * managing events during the lifetime of each worker
  * optionally, providing data transport

A Julia cluster has the following characteristics:

  * The initial Julia process, also called the `master`, is special and has an `id` of 1.
  * Only the `master` process can add or remove worker processes.
  * All processes can directly communicate with each other.

Connections between workers (using the in-built TCP/IP transport) is established in the following
manner:

  * [`addprocs`](@ref) is called on the master process with a `ClusterManager` object.
  * [`addprocs`](@ref) calls the appropriate [`launch`](@ref) method which spawns required number
    of worker processes on appropriate machines.
  * Each worker starts listening on a free port and writes out its host and port information to [`stdout`](@ref).
  * The cluster manager captures the [`stdout`](@ref) of each worker and makes it available to the
    master process.
  * The master process parses this information and sets up TCP/IP connections to each worker.
  * Every worker is also notified of other workers in the cluster.
  * Each worker connects to all workers whose `id` is less than the worker's own `id`.
  * In this way a mesh network is established, wherein every worker is directly connected with every
    other worker.

While the default transport layer uses plain [`TCPSocket`](@ref), it is possible for a Julia cluster to
provide its own transport.

Julia provides two in-built cluster managers:

  * `LocalManager`, used when [`addprocs()`](@ref) or [`addprocs(np::Integer)`](@ref) are called
  * `SSHManager`, used when [`addprocs(hostnames::Array)`](@ref) is called with a list of hostnames

`LocalManager` is used to launch additional workers on the same host, thereby leveraging multi-core
and multi-processor hardware.

Thus, a minimal cluster manager would need to:

  * be a subtype of the abstract `ClusterManager`
  * implement [`launch`](@ref), a method responsible for launching new workers
  * implement [`manage`](@ref), which is called at various events during a worker's lifetime (for
    example, sending an interrupt signal)

[`addprocs(manager::FooManager)`](@ref addprocs) requires `FooManager` to implement:

```julia
function launch(manager::FooManager, params::Dict, launched::Array, c::Condition)
    [...]
end

function manage(manager::FooManager, id::Integer, config::WorkerConfig, op::Symbol)
    [...]
end
```

As an example let us see how the `LocalManager`, the manager responsible for starting workers
on the same host, is implemented:

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

The [`launch`](@ref) method takes the following arguments:

  * `manager::ClusterManager`: the cluster manager that [`addprocs`](@ref) is called with
  * `params::Dict`: all the keyword arguments passed to [`addprocs`](@ref)
  * `launched::Array`: the array to append one or more `WorkerConfig` objects to
  * `c::Condition`: the condition variable to be notified as and when workers are launched

The [`launch`](@ref) method is called asynchronously in a separate task. The termination of
this task signals that all requested workers have been launched. Hence the [`launch`](@ref)
function MUST exit as soon as all the requested workers have been launched.

Newly launched workers are connected to each other and the master process in an all-to-all manner.
Specifying the command line argument `--worker[=<cookie>]` results in the launched processes
initializing themselves as workers and connections being set up via TCP/IP sockets.

All workers in a cluster share the same [cookie](@ref man-cluster-cookie) as the master. When the cookie is
unspecified, i.e, with the `--worker` option, the worker tries to read it from its standard input.
 `LocalManager` and `SSHManager` both pass the cookie to newly launched workers via their
 standard inputs.

By default a worker will listen on a free port at the address returned by a call to [`getipaddr()`](@ref).
A specific address to listen on may be specified by optional argument `--bind-to bind_addr[:port]`.
This is useful for multi-homed hosts.

As an example of a non-TCP/IP transport, an implementation may choose to use MPI, in which case
`--worker` must NOT be specified. Instead, newly launched workers should call `init_worker(cookie)`
before using any of the parallel constructs.

For every worker launched, the [`launch`](@ref) method must add a `WorkerConfig` object (with
appropriate fields initialized) to `launched`

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

Most of the fields in `WorkerConfig` are used by the inbuilt managers. Custom cluster managers
would typically specify only `io` or `host` / `port`:

  * If `io` is specified, it is used to read host/port information. A Julia worker prints out its
    bind address and port at startup. This allows Julia workers to listen on any free port available
    instead of requiring worker ports to be configured manually.
  * If `io` is not specified, `host` and `port` are used to connect.
  * `count`, `exename` and `exeflags` are relevant for launching additional workers from a worker.
    For example, a cluster manager may launch a single worker per node, and use that to launch additional
    workers.

      * `count` with an integer value `n` will launch a total of `n` workers.
      * `count` with a value of `:auto` will launch as many workers as the number of CPU threads (logical cores) on that machine.
      * `exename` is the name of the `julia` executable including the full path.
      * `exeflags` should be set to the required command line arguments for new workers.
  * `tunnel`, `bind_addr`, `sshflags` and `max_parallel` are used when a ssh tunnel is required to
    connect to the workers from the master process.
  * `userdata` is provided for custom cluster managers to store their own worker-specific information.

`manage(manager::FooManager, id::Integer, config::WorkerConfig, op::Symbol)` is called at different
times during the worker's lifetime with appropriate `op` values:

  * with `:register`/`:deregister` when a worker is added / removed from the Julia worker pool.
  * with `:interrupt` when `interrupt(workers)` is called. The `ClusterManager` should signal the
    appropriate worker with an interrupt signal.
  * with `:finalize` for cleanup purposes.

### Cluster Managers with Custom Transports

Replacing the default TCP/IP all-to-all socket connections with a custom transport layer is a
little more involved. Each Julia process has as many communication tasks as the workers it is
connected to. For example, consider a Julia cluster of 32 processes in an all-to-all mesh network:

  * Each Julia process thus has 31 communication tasks.
  * Each task handles all incoming messages from a single remote worker in a message-processing loop.
  * The message-processing loop waits on an `IO` object (for example, a [`TCPSocket`](@ref) in the default
    implementation), reads an entire message, processes it and waits for the next one.
  * Sending messages to a process is done directly from any Julia task--not just communication tasks--again,
    via the appropriate `IO` object.

Replacing the default transport requires the new implementation to set up connections to remote
workers and to provide appropriate `IO` objects that the message-processing loops can wait on.
The manager-specific callbacks to be implemented are:

```julia
connect(manager::FooManager, pid::Integer, config::WorkerConfig)
kill(manager::FooManager, pid::Int, config::WorkerConfig)
```

The default implementation (which uses TCP/IP sockets) is implemented as `connect(manager::ClusterManager, pid::Integer, config::WorkerConfig)`.

`connect` should return a pair of `IO` objects, one for reading data sent from worker `pid`, and
the other to write data that needs to be sent to worker `pid`. Custom cluster managers can use
an in-memory `BufferStream` as the plumbing to proxy data between the custom, possibly non-`IO`
transport and Julia's in-built parallel infrastructure.

A `BufferStream` is an in-memory [`IOBuffer`](@ref) which behaves like an `IO`--it is a stream which can
be handled asynchronously.

The folder `clustermanager/0mq` in the [Examples repository](https://github.com/JuliaArchive/Examples)
contains an example of using ZeroMQ to connect Julia workers
in a star topology with a 0MQ broker in the middle. Note: The Julia processes are still all *logically*
connected to each other--any worker can message any other worker directly without any awareness
of 0MQ being used as the transport layer.

When using custom transports:

  * Julia workers must NOT be started with `--worker`. Starting with `--worker` will result in the
    newly launched workers defaulting to the TCP/IP socket transport implementation.
  * For every incoming logical connection with a worker, `Base.process_messages(rd::IO, wr::IO)()`
    must be called. This launches a new task that handles reading and writing of messages from/to
    the worker represented by the `IO` objects.
  * `init_worker(cookie, manager::FooManager)` *must* be called as part of worker process initialization.
  * Field `connect_at::Any` in `WorkerConfig` can be set by the cluster manager when [`launch`](@ref)
    is called. The value of this field is passed in in all [`connect`](@ref) callbacks. Typically,
    it carries information on *how to connect* to a worker. For example, the TCP/IP socket transport
    uses this field to specify the `(host, port)` tuple at which to connect to a worker.

`kill(manager, pid, config)` is called to remove a worker from the cluster. On the master process,
the corresponding `IO` objects must be closed by the implementation to ensure proper cleanup.
The default implementation simply executes an `exit()` call on the specified remote worker.

The Examples folder `clustermanager/simple` is an example that shows a simple implementation using UNIX domain
sockets for cluster setup.

### Network Requirements for LocalManager and SSHManager

Julia clusters are designed to be executed on already secured environments on infrastructure such
as local laptops, departmental clusters, or even the cloud. This section covers network security
requirements for the inbuilt `LocalManager` and `SSHManager`:

  * The master process does not listen on any port. It only connects out to the workers.
  * Each worker binds to only one of the local interfaces and listens on an ephemeral port number
    assigned by the OS.
  * `LocalManager`, used by `addprocs(N)`, by default binds only to the loopback interface. This means
    that workers started later on remote hosts (or by anyone with malicious intentions) are unable
    to connect to the cluster. An `addprocs(4)` followed by an `addprocs(["remote_host"])` will fail.
    Some users may need to create a cluster comprising their local system and a few remote systems.
    This can be done by explicitly requesting `LocalManager` to bind to an external network interface
    via the `restrict` keyword argument: `addprocs(4; restrict=false)`.
  * `SSHManager`, used by `addprocs(list_of_remote_hosts)`, launches workers on remote hosts via SSH.
    By default SSH is only used to launch Julia workers. Subsequent master-worker and worker-worker
    connections use plain, unencrypted TCP/IP sockets. The remote hosts must have passwordless login
    enabled. Additional SSH flags or credentials may be specified via keyword argument `sshflags`.
  * `addprocs(list_of_remote_hosts; tunnel=true, sshflags=<ssh keys and other flags>)` is useful when
    we wish to use SSH connections for master-worker too. A typical scenario for this is a local laptop
    running the Julia REPL (i.e., the master) with the rest of the cluster on the cloud, say on Amazon
    EC2. In this case only port 22 needs to be opened at the remote cluster coupled with SSH client
    authenticated via public key infrastructure (PKI). Authentication credentials can be supplied
    via `sshflags`, for example ```sshflags=`-e <keyfile>` ```.

    In an all-to-all topology (the default), all workers connect to each other via plain TCP sockets.
    The security policy on the cluster nodes must thus ensure free connectivity between workers for
    the ephemeral port range (varies by OS).

    Securing and encrypting all worker-worker traffic (via SSH) or encrypting individual messages
    can be done via a custom `ClusterManager`.

### [Cluster Cookie](@id man-cluster-cookie)

All processes in a cluster share the same cookie which, by default, is a randomly generated string
on the master process:

  * [`cluster_cookie()`](@ref) returns the cookie, while `cluster_cookie(cookie)()` sets
    it and returns the new cookie.
  * All connections are authenticated on both sides to ensure that only workers started by the master
    are allowed to connect to each other.
  * The cookie may be passed to the workers at startup via argument `--worker=<cookie>`. If argument
    `--worker` is specified without the cookie, the worker tries to read the cookie from its
    standard input ([`stdin`](@ref)). The `stdin` is closed immediately after the cookie is retrieved.
  * `ClusterManager`s can retrieve the cookie on the master by calling [`cluster_cookie()`](@ref).
    Cluster managers not using the default TCP/IP transport (and hence not specifying `--worker`)
    must call `init_worker(cookie, manager)` with the same cookie as on the master.

Note that environments requiring higher levels of security can implement this via a custom `ClusterManager`.
For example, cookies can be pre-shared and hence not specified as a startup argument.

## Specifying Network Topology (Experimental)

The keyword argument `topology` passed to `addprocs` is used to specify how the workers must be
connected to each other:

  * `:all_to_all`, the default: all workers are connected to each other.
  * `:master_worker`: only the driver process, i.e. `pid` 1, has connections to the workers.
  * `:custom`: the `launch` method of the cluster manager specifies the connection topology via the
    fields `ident` and `connect_idents` in `WorkerConfig`. A worker with a cluster-manager-provided
    identity `ident` will connect to all workers specified in `connect_idents`.

Keyword argument `lazy=true|false` only affects `topology` option `:all_to_all`. If `true`, the cluster
starts off with the master connected to all workers. Specific worker-worker connections are established
at the first remote invocation between two workers. This helps in reducing initial resources allocated for
intra-cluster communication. Connections are setup depending on the runtime requirements of a parallel
program. Default value for `lazy` is `true`.

Currently, sending a message between unconnected workers results in an error. This behaviour,
as with the functionality and interface, should be considered experimental in nature and may change
in future releases.

## Noteworthy external packages

Outside of Julia parallelism there are plenty of external packages that should be mentioned.
For example [MPI.jl](https://github.com/JuliaParallel/MPI.jl) is a Julia wrapper for the `MPI` protocol, or
[DistributedArrays.jl](https://github.com/JuliaParallel/Distributedarrays.jl), as presented in [Shared Arrays](@ref).
A mention must be done to the Julia's GPU programming ecosystem, which includes :

1. Low-level (C kernel) based operations [OpenCL.jl](https://github.com/JuliaGPU/OpenCL.jl) and [CUDAdrv.jl](https://github.com/JuliaGPU/CUDAdrv.jl) which are respectively an OpenCL interface and a CUDA wrapper.

2. Low-level (Julia Kernel) interfaces like [CUDAnative.jl](https://github.com/JuliaGPU/CUDAnative.jl) which is a Julia native CUDA implementation.

3. High-level vendor specific abstractions like [CuArrays.jl](https://github.com/JuliaGPU/CuArrays.jl) and [CLArrays.jl](https://github.com/JuliaGPU/CLArrays.jl)

4. High-level libraries like [ArrayFire.jl](https://github.com/JuliaComputing/ArrayFire.jl) and [GPUArrays.jl](https://github.com/JuliaGPU/GPUArrays.jl)


In the following example we will use both `DistributedArrays.jl` and `CuArrays.jl` to distribute an array across multiple
processes by first casting it through `distribute()` and `CuArray()`.

Remember when importing `DistributedArrays.jl` to import it across all processes using [`@everywhere`](@ref)


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
Keep in mind that some Julia features are not currently supported by CUDAnative.jl [^2] , especially some functions like `sin` will need to be replaced with `CUDAnative.sin`(cc: @maleadt).

In the following example we will use both `DistributedArrays.jl` and `CuArrays.jl` to distribute an array across multiple
processes and call a generic function on it.

```julia
function power_method(M, v)
    for i in 1:100
        v = M*v
        v /= norm(v)
    end

    return v, norm(M*v) / norm(v)  # or  (M*v) ./ v
end
```

`power_method` repeteavely creates a new vector and normalizes it. We have not specified any type signature in
function declaration, let's see if it works with the aforementioned datatypes:

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

To end this short exposure to external packages, we can consider `MPI.jl`, a Julia wrapper
of the MPI protocol. As it would take too long to consider every inner function, it would be better
to simply appreciate the approach used to implement the protocol.

Consider this toy script which simply calls each subprocess, instantiate its rank and when the master
process is reached, performs the ranks' sum

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
    in this context, mpi refers to the mpi-1 standard. beginning with mpi-2, the mpi standards committee
    introduced a new set of communication mechanisms, collectively referred to as remote memory access
    (rma). the motivation for adding rma to the mpi standard was to facilitate one-sided communication
    patterns. for additional information on the latest mpi standard, see [http://mpi-forum.org/docs](http://mpi-forum.org/docs/).

[^2]:
    [Julia GPU操作页](http://juliagpu.github.io/CUDAnative.jl/stable/man/usage.html#Julia-support-1)
