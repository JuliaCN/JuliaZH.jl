# 任务

```@docs
Core.Task
Base.@task
Base.@async
Base.asyncmap
Base.asyncmap!
Base.current_task
Base.istaskdone
Base.istaskstarted
Base.istaskfailed
Base.task_local_storage(::Any)
Base.task_local_storage(::Any, ::Any)
Base.task_local_storage(::Function, ::Any, ::Any)
```

## 调度

```@docs
Base.yield
Base.yieldto
Base.sleep
Base.schedule
```

## [同步](@id lib-task-sync)

```@docs
Base.errormonitor
Base.@sync
Base.wait
Base.fetch(t::Task)
Base.fetch(x::Any)
Base.timedwait

Base.Condition
Base.Threads.Condition
Base.Threads.Event
Base.notify
Base.reset(::Base.Threads.Event)

Base.Semaphore
Base.acquire
Base.release

Base.AbstractLock
Base.lock
Base.unlock
Base.trylock
Base.islocked
Base.ReentrantLock
```

## Channels

```@docs
Base.AbstractChannel
Base.Channel
Base.Channel(::Function)
Base.put!(::Channel, ::Any)
Base.take!(::Channel)
Base.isready(::Channel)
Base.fetch(::Channel)
Base.close(::Channel)
Base.bind(c::Channel, task::Task)
```

## [使用 `schedule` 和 `wait` 的低级同步](@id low-level-schedule-wait)

[`schedule`](@ref) 最简单的正确使用方式是在一个尚未启动（调度）的 `Task` 上使用。
然而，也可以将 [`schedule`](@ref) 和 [`wait`](@ref) 用作构建同步接口的非常低级的构建块。
调用 `schedule(task)` 的一个关键前提条件是调用者必须"拥有"该 `task`；
也就是说，它必须知道在给定 `task` 中的 `wait` 调用正发生在调用 `schedule(task)` 的代码所知道的位置。
确保这种前提条件的一种策略是使用原子操作，如下例所示：

```jldoctest
@enum OWEState begin
    OWE_EMPTY
    OWE_WAITING
    OWE_NOTIFYING
end

mutable struct OneWayEvent
    @atomic state::OWEState
    task::Task
    OneWayEvent() = new(OWE_EMPTY)
end

function Base.notify(ev::OneWayEvent)
    state = @atomic ev.state
    while state !== OWE_NOTIFYING
        # Spin until we successfully update the state to OWE_NOTIFYING:
        state, ok = @atomicreplace(ev.state, state => OWE_NOTIFYING)
        if ok
            if state == OWE_WAITING
                # OWE_WAITING -> OWE_NOTIFYING transition means that the waiter task is
                # already waiting or about to call `wait`. The notifier task must wake up
                # the waiter task.
                schedule(ev.task)
            else
                @assert state == OWE_EMPTY
                # Since we are assuming that there is only one notifier task (for
                # simplicity), we know that the other possible case here is OWE_EMPTY.
                # We do not need to do anything because we know that the waiter task has
                # not called `wait(ev::OneWayEvent)` yet.
            end
            break
        end
    end
    return
end

function Base.wait(ev::OneWayEvent)
    ev.task = current_task()
    state, ok = @atomicreplace(ev.state, OWE_EMPTY => OWE_WAITING)
    if ok
        # OWE_EMPTY -> OWE_WAITING transition means that the notifier task is guaranteed to
        # invoke OWE_WAITING -> OWE_NOTIFYING transition.  The waiter task must call
        # `wait()` immediately.  In particular, it MUST NOT invoke any function that may
        # yield to the scheduler at this point in code.
        wait()
    else
        @assert state == OWE_NOTIFYING
        # Otherwise, the `state` must have already been moved to OWE_NOTIFYING by the
        # notifier task.
    end
    return
end

ev = OneWayEvent()
@sync begin
    @async begin
        wait(ev)
        println("done")
    end
    println("notifying...")
    notify(ev)
end

# output
notifying...
done
```

`OneWayEvent` 允许一个任务通过 `wait` 等待另一个任务的 `notify`。
这是一个受限的通信接口，因为 `wait` 只能被单个任务使用一次（注意 `ev.task` 的非原子赋值）。

在这个例子中，`notify(ev::OneWayEvent)` 只有在*它*将状态从 `OWE_WAITING` 修改为 `OWE_NOTIFYING` 时，
才允许调用 `schedule(ev.task)`。
这让我们知道执行 `wait(ev::OneWayEvent)` 的任务现在在 `ok` 分支中，
并且不可能有其他任务尝试 `schedule(ev.task)`，
因为它们的 `@atomicreplace(ev.state, state => OWE_NOTIFYING)` 将会失败。
