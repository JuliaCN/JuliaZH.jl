# [多线程](@id lib-multithreading)

```@docs
Base.Threads.@threads
Base.Threads.foreach
Base.Threads.@spawn
Base.Threads.threadid
Base.Threads.maxthreadid
Base.Threads.nthreads
Base.Threads.threadpool
Base.Threads.nthreadpools
Base.Threads.threadpoolsize
Base.Threads.ngcthreads
```

另建：手册中的[多线程](@ref man-multithreading).

## 原子操作

```@docs
atomic
```

```@docs
Base.@atomic
Base.@atomicswap
Base.@atomicreplace
```

!!! note

    以下 API 相当原始，很可能会通过类似于 `unsafe_*` 的封装器暴露出来。

```
Core.Intrinsics.atomic_pointerref(pointer::Ptr{T}, order::Symbol) --> T
Core.Intrinsics.atomic_pointerset(pointer::Ptr{T}, new::T, order::Symbol) --> pointer
Core.Intrinsics.atomic_pointerswap(pointer::Ptr{T}, new::T, order::Symbol) --> old
Core.Intrinsics.atomic_pointermodify(pointer::Ptr{T}, function::(old::T,arg::S)->T, arg::S, order::Symbol) --> old
Core.Intrinsics.atomic_pointerreplace(pointer::Ptr{T}, expected::Any, new::T, success_order::Symbol, failure_order::Symbol) --> (old, cmp)
```

!!! warning

    以下 API 接口已被弃用，但对它们的支持可能会持续几个版本。

```@docs
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

## 使用 libuv 线程池的 ccall（实验性）

```@docs
Base.@threadcall
```

## 低级同步原语

这些构建块用于创建常规同步对象。

```@docs
Base.Threads.SpinLock
```
