# [Asynchronous Programming](@id man-asynchronous)

When a program needs to interact with the outside world, for example communicating
with another machine over the internet, operations in the program may need to
happen in an unpredictable order.
Say your program needs to download a file. We would like to initiate the download
operation, perform other operations while we wait for it to complete, and then
resume the code that needs the downloaded file when it is available.
This sort of scenario falls in the domain of asynchronous programming, sometimes
also referred to as concurrent programming (since, conceptually, multiple things
are happening at once).

To address these scenarios, Julia provides [`Task`](@ref)s (also known by several other
names, such as symmetric coroutines, lightweight threads, cooperative multitasking,
or one-shot continuations).
When a piece of computing work (in practice, executing a particular function) is designated as
a [`Task`](@ref), it becomes possible to interrupt it by switching to another [`Task`](@ref).
The original [`Task`](@ref) can later be resumed, at which point it will pick up right where it
left off. At first, this may seem similar to a function call. However there are two key differences.
First, switching tasks does not use any space, so any number of task switches can occur without
consuming the call stack. Second, switching among tasks can occur in any order, unlike function
calls, where the called function must finish executing before control returns to the calling function.

## Basic `Task` operations

You can think of a `Task` as a handle to a unit of computational work to be performed.
It has a create-start-run-finish lifecycle.
Tasks are created by calling the `Task` constructor on a 0-argument function to run,
or using the [`@task`](@ref) macro:

```julia-repl
julia> t = @task begin; sleep(5); println("done"); end
Task (runnable) @0x00007f13a40c0eb0
```

`@task x` is equivalent to `Task(()->x)`.

This task will wait for five seconds, and then print `done`. However, it has not
started running yet. We can run it whenever we're ready by calling [`schedule`](@ref):

```julia-repl
julia> schedule(t);
```

If you try this in the REPL, you will see that `schedule` returns immediately.
That is because it simply adds `t` to an internal queue of tasks to run.
Then, the REPL will print the next prompt and wait for more input.
Waiting for keyboard input provides an opportunity for other tasks to run,
so at that point `t` will start.
`t` calls [`sleep`](@ref), which sets a timer and stops execution.
If other tasks have been scheduled, they could run then.
After five seconds, the timer fires and restarts `t`, and you will see `done`
printed. `t` is then finished.

The [`wait`](@ref) function blocks the calling task until some other task finishes.
So for example if you type

```julia-repl
julia> schedule(t); wait(t)
```

instead of only calling `schedule`, you will see a five second pause before
the next input prompt appears. That is because the REPL is waiting for `t`
to finish before proceeding.

It is common to want to create a task and schedule it right away, so the
macro [`@async`](@ref) is provided for that purpose --- `@async x` is
equivalent to `schedule(@task x)`.

## Communicating with Channels

In some problems,
the various pieces of required work are not naturally related by function calls; there is no obvious
"caller" or "callee" among the jobs that need to be done. An example is the producer-consumer
problem, where one complex procedure is generating values and another complex procedure is consuming
them. The consumer cannot simply call a producer function to get a value, because the producer
may have more values to generate and so might not yet be ready to return. With tasks, the producer
and consumer can both run as long as they need to, passing values back and forth as necessary.

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

While the [`Task`](@ref) constructor expects a 0-argument function, the [`Channel`](@ref)
method that creates a task-bound channel expects a function that accepts a single argument of
type [`Channel`](@ref). A common pattern is for the producer to be parameterized, in which case a partial
function application is needed to create a 0 or 1 argument [anonymous function](@ref man-anonymous-functions).

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

### More on Channels

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
  * [`isready`](@ref) tests for the presence of any object in the channel, while [`wait`](@ref)
     
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

Instead of `errormonitor(t)`, a more robust solution may be use use `bind(results, t)`, as that will
not only log any unexpected failures, but also force the associated resources to close and propagate
the exception everywhere.

## More task operations

Task operations are built on a low-level primitive called [`yieldto`](@ref).
`yieldto(task, value)` suspends the current task, switches to the specified `task`, and causes
that task's last [`yieldto`](@ref) call to return the specified `value`. Notice that [`yieldto`](@ref)
is the only operation required to use task-style control flow; instead of calling and returning
we are always just switching to a different task. This is why this feature is also called "symmetric
coroutines"; each task is switched to and from using the same mechanism.

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

A task created explicitly by calling [`Task`](@ref) is initially not known to the scheduler. This
allows you to manage tasks manually using [`yieldto`](@ref) if you wish. However, when such
a task waits for an event, it still gets restarted automatically when the event happens, as you
would expect.
