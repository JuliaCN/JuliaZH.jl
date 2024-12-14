# 并行计算

Julia 支持这四类并发和并行编程：

1. **异步“任务”或协程**：

   Julia Tasks 允许暂停和恢复 I/O、事件处理、生产者-消费者进程和类似模式的计算。
   Tasks 可以通过 [`wait`](@ref) 和 [`fetch`](@ref) 等操作进行同步，并通过 [`Channel`](@ref) 进行通信。
   虽然严格来说不是并行计算，但 Julia 允许在多个线程上调度 [`Task`](@ref)。

2. **多线程**：

   Julia 的[多线程](@ref man-multithreading)提供了在多个线程、CPU 内核或共享内存上同时调度任务的能力。
   这通常是在个人 PC 或单个大型多核服务器上获得并行性的最简单方法。
   Julia 的多线程是可组合的。当一个多线程函数调用另一个多线程函数时，Julia 将在可用资源上全局调度所有线程，而不会超额使用。

3. **分布式计算**:

   分布式计算运行多个具有独立内存空间的 Julia 进程。 这些可以在同一台计算机或多台计算机上。
   [`Distributed`](@ref man-distributed) 标准库提供了远程执行 Julia 函数的能力。
   使用这个基本构建块，可以构建许多不同类型的分布式计算抽象。
   像 [`DistributedArrays.jl`](https://github.com/JuliaParallel/DistributedArrays.jl) 这样的包就是这种抽象的一个示例。
   另一方面，像 [`MPI.jl`](https://github.com/JuliaParallel/MPI.jl) 和
   [`Elemental.jl`](https://github.com/JuliaParallel/Elemental.jl) 这样的包提供对现有 MPI 生态库的访问。

4. **GPU 计算**:

   Julia GPU 编译器提供了在 GPU 上本地运行 Julia 代码的能力。
   有一个针对 GPU 的丰富的 Julia 软件包生态系统。
   [JuliaGPU.org](https://juliagpu.org) 网站提供了功能列表、支持的 GPU、相关包和文档。
