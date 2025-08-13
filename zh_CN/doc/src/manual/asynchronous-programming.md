# [异步编程](@id man-asynchronous)

当程序需要与外部世界交互时，例如通过互联网与另一台机器通信时，程序中的操作可能需要以无法预测的顺序发生。假设你的程序需要下载一个文件。我们想启动下载操作，在等待下载完成的同时执行其他操作，然后在空闲时继续执行下载文件的代码。这种场景属于异步编程，有时也称为并发编程（因为从概念上讲，同时发生多种事情）。

为了解决这些可能的情况，Julia 提供了任务 [`Task`](@ref)（也有其他几个名称，例如对称协程、轻量级线程、协作多任务处理或one-shot continuations）。当一项计算工作（实际上，执行特定功能）被指定为 [`Task`](@ref) 时，可以通过切换到另一个 [`Task`](@ref) 来中断它。 最初的 [`Task`](@ref) 稍后可以恢复，此时它将从上次中断的地方开始。 初看这似乎类似于函数调用。 但是，有两个关键区别。 首先，切换任务不占用任何空间，因此可以在不消耗调用堆栈的情况下进行任意数量的任务切换。 其次，任务之间的切换可以以任何顺序发生，这与函数调用不同，在函数调用中，被调用的函数必须在返回到调用函数之前完成执行。

## 基本 `Task` 操作

你可以将`Task`视为要执行的计算工作单元的句柄。 它有一个创建-开始-运行-结束的生命周期。 Task 是通过在要运行的 0 参数函数上调用 `Task` 构造函数来创建的，或者使用 [`@task`](@ref) 宏：

```julia-repl
julia> t = @task begin; sleep(5); println("done"); end
Task (runnable) @0x00007f13a40c0eb0
```

`@task x` 等价于 `Task(()->x)`。

此任务将等待五秒钟，然后打印`done`。 但是，它还没有开始运行。 我们可以随时通过调用 [`schedule`](@ref) 来运行它：

```julia-repl
julia> schedule(t);
```

如果你在 REPL 中尝试这个，你会看到 `schedule` 立即有返回值。那是因为它只是将 `t` 添加到要运行的内部任务队列中。然后，REPL 将打印下一个提示并等待更多输入。等待键盘输入为其他任务提供了运行的机会，因此此时 `t` 将启动。 `t` 调用 [`sleep`](@ref)，它设置一个计时器并停止执行。 如果已经安排了其他任务，那么它们就可以运行了。五秒后，计时器触发并重新启动`t`，你将看到打印的`done`。 然后`t` 执行完毕了。

[`wait`](@ref) 函数会阻塞调用任务，直到其他任务完成。 例如，如果输入：

```julia-repl
julia> schedule(t); wait(t)
```

在下一个输入提示出现之前，你将看到五秒钟的停顿，而不是只调用 `schedule`。 那是因为 REPL 等待 `t` 完成之后才继续。

一般来说，创建一个任务会想立即执行它，为此提供了宏 [`@async`](@ref) --- `@async x` 等价于 `schedule(@task x )`。

## 在 Channel 中进行通信

在某些问题中，所需的各种工作并不是通过函数调用自然关联的； 在需要完成的工作中没有明显的“调用者”或“被调用者”。 一个典型的例子是生产者-消费者问题，其中一个复杂的过程正在生成值，而另一个复杂的过程正在消耗它们。消费者不能简单地调用生产者函数来获取一个值，因为生产者可能有更多的值要生成，因此可能还没有准备好返回。对于任务，生产者和消费者都可以根据需要运行，根据需要来回传递值。

Julia 提供了 [`Channel`](@ref) 机制来解决这个问题。一个 [`Channel`](@ref) 是一个先进先出的队列，允许多个 `Task` 对它可以进行读和写。

让我们定义一个生产者任务，调用 [`put!`](@ref) 来生产数值。为了消费数值，我们需要对生产者开始新任务进行排班。可以使用一个特殊的 [`Channel`](@ref) 组件来运行一个与其绑定的 `Task`，它能接受单参数函数作为其参数，然后可以用 [`take!`](@ref) 从 [`Channel`](@ref) 对象里不断地提取值：

```jldoctest producer
julia> function producer(c::Channel)
           put!(c, "start")
           for n=1:4
               put!(c, 2n)
           end
           put!(c, "stop")
       end;

julia> chnl = Channel(producer);

julia> take!(chnl)
"start"

julia> take!(chnl)
2

julia> take!(chnl)
4

julia> take!(chnl)
6

julia> take!(chnl)
8

julia> take!(chnl)
"stop"
```

一种思考这种行为的方式是，“生产者”能够多次返回。在两次调用 [`put!`](@ref) 之间，生产者的执行是挂起的，此时由消费者接管控制。

返回的 [`Channel`](@ref) 可以被用作一个 `for` 循环的迭代对象，此时循环变量会依次取到所有产生的值。当 [`Channel`](@ref) 关闭时，循环就会终止。

```jldoctest producer
julia> for x in Channel(producer)
           println(x)
       end
start
2
4
6
8
stop
```

注意我们并不需要显式地在生产者中关闭 [`Channel`](@ref)。这是因为 [`Channel`](@ref) 对 [`Task`](@ref) 的绑定同时也意味着 `Channel` 的生命周期与绑定的 `Task` 一致。当 `Task` 结束时，`Channel` 对象会自动关闭。多个 `Channel` 可以绑定到一个 `Task`，反之亦然。

[`Task`](@ref) 构造函数需要一个不带参数的函数，而创建任务绑定的 channel 的 [`Channel`](@ref) 方法需要一个接受 [`Channel`](@ref)类型的单个参数的函数。 一个常见的模式是对生产者进行参数化，在这种情况下，需要一个偏函数来创建一个 0 或 1 个参数 [匿名函数](@ref man-anonymous-functions)。

对于 [`Task`](@ref) 对象，可以直接用，也可以为了方便用宏。

```julia
function mytask(myarg)
    ...
end

taskHdl = Task(() -> mytask(7))
# or, equivalently
taskHdl = @task mytask(7)
```

为了安排更高级的工作分配模式，[`bind`](@ref) 和 [`schedule`](@ref) 可以与 [`Task`](@ref) 和 [`Channel`](@ref) 构造函数配合使用，显式地连接一些 `Channel` 和生产者或消费者 `Task`。

### 更多关于 Channel 的知识

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
        errormonitor(@async foo())
    end
    ```
  * Channel 可以通过 `Channel{T}(sz)` 构造，得到的 channel 只能存储类型 `T` 的数据。如果 `T` 没有指定，那么 channel 可以存任意类型。`sz` 表示该 channel 能够存储的最大元素个数。比如 `Channel(32)` 得到的 channel 最多可以存储32个元素。而 `Channel{MyType}(64)` 则可以最多存储64个 `MyType` 类型的数据。
     
     
     
     
  * 如果一个 [`Channel`](@ref) 是空的，读取的 task(即执行 [`take!`](@ref) 的 task)会被阻塞直到有新的数据准备好了。
  * 如果一个 [`Channel`](@ref) 是满的，那么写入的 task(即执行 [`put!`](@ref) 的 task)则会被阻塞，直到 Channel 有空余。
  *  
     
  * 一个 [`Channel`](@ref) 一开始处于开启状态，也就是说可以被 [`take!`](@ref) 读取和 [`put!`](@ref) 写入。[`close`](@ref) 会关闭一个 [`Channel`](@ref)，对于一个已经关闭的 [`Channel`](@ref)，[`put!`](@ref) 会失败，例如：
     
     

    ```julia-repl
    julia> c = Channel(2);

    julia> put!(c, 1) # `put!` on an open channel succeeds
    1

    julia> close(c);

    julia> put!(c, 2) # `put!` on a closed channel throws an exception.
    ERROR: InvalidStateException: Channel is closed.
    Stacktrace:
    [...]
    ```

  * [`take!`](@ref) 和 [`fetch`](@ref) (只读取，不会将元素从 channel 中删掉）仍然可以从一个已经关闭的 channel 中读数据，直到 channel 被取空了为止。继续上面的例子：
     

    ```julia-repl
    julia> fetch(c) # Any number of `fetch` calls succeed.
    1

    julia> fetch(c)
    1

    julia> take!(c) # The first `take!` removes the value.
    1

    julia> take!(c) # No more data available on a closed channel.
    ERROR: InvalidStateException: Channel is closed.
    Stacktrace:
    [...]
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

julia> errormonitor(@async make_jobs(n)); # feed the jobs channel with "n" jobs

julia> for i in 1:4 # start 4 tasks to process requests in parallel
           errormonitor(@async do_work())
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

不用 `errormonitor(t)`，一个更稳健的解决方案是使用 `bind(results, t)`，这不仅会记录任何意外故障，还会强制相关资源关闭并向上抛出错误。

## 更多任务操作

任务操作建立在称为 [`yieldto`](@ref) 的底层原始运算上。 `yieldto(task, value)` 挂起当前 task，然后切换到指定的 `task`，并使该任务的最后一个 [`yieldto`](@ref) 调用返回指定的 `value`。 请注意，[`yieldto`](@ref) 是使用任务式流程控制所需的唯一操作；我们总是切换到不同的任务，而不是调用和返回。 这就是为什么这个特性也被称为“对称协程”； 每个任务都使用相同的机制来回切换。

[`yieldto`](@ref) 功能强大，但大多数 `Task` 的使用都不会直接调用它。思考为什么会这样。如果你切换当前 `Task`，你很可能会在某个时候想切换回来。但知道什么时候切换回来和那个 `Task` 负责切换回来需要大量的协调。例如，[`put!`](@ref) 和 [`take!`](@ref) 是阻塞操作，当在渠道环境中使用时，维持状态以记住消费者是谁。不需要人为地记录消费 `Task`，正是使得 [`put!`](@ref) 比底层 [`yieldto`](@ref) 易用的原因。

除了 [`yieldto`](@ref) 之外，也需要一些其它的基本函数来更高效地使用 `Task`。

  * [`current_task`](@ref) 获取当前运行 `Task` 的索引。
  * [`istaskdone`](@ref) 查询一个 `Task` 是否退出.
  * [`istaskstarted`](@ref) 查询一个 `Task` 是否已经开始运行。
  * [`task_local_storage`](@ref) 操纵针对当前 `Task` 的键值存储。

## `Task` 和事件

多数 `Task` 切换是在等待如 I/O 请求的事件，由 Julia Base 里的调度器执行。调度器维持一个可运行 `Task` 的队列，并执行一个事件循环，来根据例如收到消息等外部事件来重启 `Task`。

等待一个事件的基本函数是 [`wait`](@ref)。很多对象都实现了 [`wait`](@ref) 函数；例如，给定一个 `Process` 对象，[`wait`](@ref) 将等待它退出。[`wait`](@ref) 通常是隐式的，例如，[`wait`](@ref) 可能发生在调用 [`read`](@ref) 时等待数据可用。

在所有这些情况下，[`wait`](@ref) 最终会操作一个 [`Condition`](@ref) 对象，由它负责排队和重启 `Task`。当 `Task` 在一个 [`Condition`](@ref) 上调用 [`wait`](@ref) 时，该 Task 就被标记为不可执行，加到条件的队列中，并切回调度器。调度器将选择另一个 `Task` 来运行，或者阻止外部事件的等待。如果所有运行良好，最终一个事件处理器将在这个条件下调用 [`notify`](@ref)，使得等待该条件的 `Task` 又变成可运行。

通过调用 [`Task`](@ref) 显式创建的任务，一开始并不被调度器知道。这允许你根据需要使用 [`yieldto`](@ref) 手动管理任务。 但是，当此类任务等待事件时，它仍会在事件发生时自动重新启动，正如你所期望。
