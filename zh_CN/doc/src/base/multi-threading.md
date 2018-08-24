
# 多线程

这个实验性接口支持Julia的多线程功能。类型和函数
在本节的相关描述很有可能会在未来进行修改。

```@docs
Base.Threads.threadid
Base.Threads.nthreads
Base.Threads.@threads
Base.Threads.Atomic
Base.Threads.atomic_cas!
Base.Threads.atomic_xchg!
Base.Threads.atomic_add!
Base.Threads.atomic_sub!
Base.Threads.atomic_and!
Base.Threads.atomic_nand!
Base.Threads.atomic_or!
Base.Threads.atomic_xor!
Base.Threads.atomic_max!
Base.Threads.atomic_min!
Base.Threads.atomic_fence
```

## 使用线程池的ccal方法（实验性）

```@docs
Base.@threadcall
```

## 同步原始类型

```@docs
Base.Threads.AbstractLock
Base.lock
Base.unlock
Base.trylock
Base.islocked
Base.ReentrantLock
Base.Threads.Mutex
Base.Threads.SpinLock
Base.Threads.RecursiveSpinLock
Base.Semaphore
Base.acquire
Base.release
```

