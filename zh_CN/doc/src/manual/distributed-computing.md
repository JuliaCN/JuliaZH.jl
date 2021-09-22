# 多进程和分布式计算

分布式内存并行计算的实现由模块 [`Distributed`](@ref man-distributed) 作为 Julia 附带的标准库的一部分提供。

大多数现代计算机都拥有不止一个 CPU，而且多台计算机可以组织在一起形成一个集群。借助多个 CPU 的计算能力，许多计算过程能够更快地完成，这其中影响性能的两个主要因素分别是：CPU 自身的速度以及它们访问内存的速度。显然，在一个集群中，一个 CPU 访问同一个节点的 RAM 速度是最快的，不过令人吃惊的是，在一台典型的多核笔记本电脑上，由于访问主存和[缓存](https://www.akkadia.org/drepper/cpumemory.pdf)的速度存在差别，类似的现象也会存在。因此，一个良好的多进程环境应该能够管理好某一片内存区域“所属”的CPU。Julia提供的多进程环境是基于消息传递来实现的，可以做到同时让程序在多个进程的不同内存区域中运行。


Julia 的消息传递实现不同于其他环境，例如 MPI[^1]。 Julia 中的通信通常是“单方面的”，这意味着程序员只需在双进程操作中显式管理一个进程。 此外，这些操作通常看起来不像“消息发送”和“消息接收”，而是类似于更高级别的操作，例如调用用户函数。

Julia 中的分布式编程基于两个基本概念：**远程引用**(*remote references*)和**远程调用**(*remote calls*)。远程引用是一个对象，任意一个进程可以通过它访问存储在某个特定进程上的对象。远程调用指是某个进程发起的执行函数的请求，该函数会在另一个（也可能是同一个）进程中执行。

远程引用有两种形式：[`Future`](@ref Distributed.Future) 和 [`RemoteChannel`](@ref)。

远程调用返回 [`Future`](@ref Distributed.Future) 作为其结果。 远程调用立即返回；当远程调用发生在其他地方后，发出调用的进程继续执行下一个操作。你可以通过在返回的 [`Future`](@ref Distributed.Future) 上调用 [`wait`](@ref) 来等待远程调用完成，并且可以使用 [`fetch `](@ref)。

对于 [`RemoteChannel`](@ref) 而言，它可以被反复写入。例如，多个进程可以通过引用同一个远程 `Channel` 来协调相互之间的操作。


每个进程都有一个关联的标识符。 提供交互式 Julia 提示符的进程的 `id` 总是等于 1。默认情况下用于并行操作的进程被称为“workers”。 当只有一个进程时，进程 1 被认为是一个worker。 否则，workers 被认为是进程 1 之外的所有进程。因此，需要添加 2 个或更多进程才能从 [`pmap`](@ref) 等并行处理方法中获益。 如果你只想在主进程中做其他事情，同时在工作进程上运行长时间的计算，那么添加单个进程是有益的。

让我们开始尝试。 以 `julia -p n` 开始，在本地机器上提供 `n` 个工作进程。 通常，`n` 等于机器上的 CPU 线程（逻辑核心）的数量是有意义的。 请注意，`-p` 参数隐式加载模块 [`Distributed`](@ref man-distributed)。


```julia
$ julia -p 2

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
julia> remotecall_fetch(r-> fetch(r)[1, 1], 2, r)
0.18526337335308085
```

这将获取 worker 2 上的数组并返回第一个值。 请注意，在这种情况下，`fetch` 不会移动任何数据，因为它是在拥有该数组的 worker 上执行的。 还可以这样写：

```julia-repl
julia> remotecall_fetch(getindex, 2, r, 1, 1)
0.10824216411304866
```

回忆下，这里 [`getindex(r,1,1)`](@ref) [相当于](@ref man-array-indexing) `r[1,1]`，因此，上面的调用相当于获取 `r` 的第一个元素。


为方便起见，可以将符号 `:any` 传递给 [`@spawnat`](@ref)，它会为你选择执行操作的位置：

```julia-repl
julia> r = @spawnat :any rand(2,2)
Future(2, 1, 4, nothing)

julia> s = @spawnat :any 1 .+ fetch(r)
Future(3, 1, 5, nothing)

julia> fetch(s)
2×2 Array{Float64,2}:
 1.38854  1.9098
 1.20939  1.57158
```

请注意，我们使用了 `1 .+ fetch(r)` 而不是 `1 .+ r`。 这是因为我们不知道代码将在哪里运行，因此通常可能需要一个 [`fetch`](@ref) 将 `r` 移动到执行添加的进程。 在这种情况下，[`@spawnat`](@ref) 足够聪明，可以在拥有 `r` 的进程上执行计算，因此 [`fetch`](@ref) 将是一个空操作（没有工作被完成）。

（值得注意的是， [`@spawnat`](@ref) 不是内置的，而是在 Julia 中定义的 [宏](@ref man-macros）。你也可以自己定义此类构造。）

需要记住的重要一点是，一旦 fetch，[`Future`](@ref Distributed.Future) 将在本地缓存其值。 进一步的 [`fetch`](@ref) 调用不需要网络跃点。 一旦所有引用 [`Future`](@ref Distributed.Future) 都已获取，远程存储的值将被删除。

[`@async`](@ref) 类似于 [`@spawnat`](@ref)，但只在本地进程上运行任务。我们使用它为每个进程创建一个“feeder”任务。每个任务选择需要计算的下一个索引，然后等待其进程完成，然后重复直到我们用完索引。请注意，feeder任务直到主任务到达 [`@sync`](@ref) 块的末尾才开始执行，此时它放弃控制并等待所有本地任务完成，然后从主任务返回功能。对于 v0.7 及更高版本，feeder 任务能够通过 `nextidx` 共享状态，因为它们都运行在同一个进程上。即使`Tasks` 是协作调度的，在某些上下文中可能仍然需要锁定，例如在 [asynchronous I/O](@ref faq-async-io) 中。这意味着上下文切换只发生在明确定义的点：在这种情况下，当 [`remotecall_fetch`](@ref) 被调用时。这是当前的实现状态，它可能会在未来的 Julia 版本中发生变化，因为它旨在使在 M个 `Process` 上运行最多 N 个 `Tasks` 成为可能，也就是 [M:N Threading](https://en.wikipedia.org/wiki/Thread_(computing)#Models)。然后，需要为 `nextidx` 提供锁获取/释放模型，因为让多个进程同时读写一个资源是不安全的。



## [访问代码以及加载库](@id code-availability)

对于想要并行执行的代码，需要所有对所有线程都可见。例如，在 Julia 命令行中输入以下命令：

```julia-repl
julia> function rand2(dims...)
           return 2*rand(dims...)
       end

julia> rand2(2,2)
2×2 Array{Float64,2}:
 0.153756  0.368514
 1.15119   0.918912

julia> fetch(@spawnat :any rand2(2,2))
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

像往常一样，这不会将 `DummyModule` 引入任何进程的作用域，这需要 [`using`](@ref) 或 [`import`](@ref)。 此外，当 `DummyModule` 被带入一个进程的作用域时，它不在任何其他进程中：

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


最后，如果`DummyModule.jl`不是一个独立的文件，而是一个包，那么`using DummyModule`将在所有进程上_加载_ `DummyModule.jl`，但只在调用[`using`]（@ref）的进程上将其纳入作用域。

## 启动和管理 worker 进程

Julia 自带两种集群管理模式：

  * 本地集群，前面通过启动时指定 `-p` 参数就是这种模式
  * 跨机器的集群，通过 `--machine-file` 指定。这种模式采用没有密码的 `ssh` 登陆并对应的机器上（与 host 相同的路径下）启动 Julia 的 worker 进程。每个机器定义都采用 `[count*][user@]host[:port] [bind_addr[:port]]` 的形式。 `user` 默认为当前用户，`port` 为标准 ssh 端口。`count` 是在节点上生成的 worker 数量，默认为 1。可选的 `bind-to bind_addr[:port]` 指定其他 worker 应该用来连接到这个 worker 的 IP 地址和端口。
     
     
     
     
     

[`addprocs`](@ref), [`rmprocs`](@ref), [`workers`](@ref) 这些函数可以分别用来对集群中的进程进行增加，删除和修改。

```julia-repl
julia> using Distributed

julia> addprocs(2)
2-element Array{Int64,1}:
 2
 3
```

模块 [`Distributed`](@ref man-distributed) 必须在调用 [`addprocs`](@ref) 之前显式加载到主进程上。 它在工作进程上自动可用。

请注意，worker 不会运行 `~/.julia/config/startup.jl` 启动脚本，也不会将其全局状态（例如全局变量、新方法定义和加载的模块）与任何其他正在运行的进程同步 。你可以使用 `addprocs(exeflags="--project")` 来初始化具有特定环境的 worker，然后使用 `@everywhere using <modulename>` 或 `@everywhere include("file.jl")`。

其它类型的集群可以通过自己写一个 `ClusterManager` 来实现，下面 [集群管理器](@ref) 部分会介绍。

## 数据转移

分布式程序的性能瓶颈主要是由发送消息和数据转移造成的，减少发送消息和转移数据的数量对于获取高性能和可扩展性至关重要，因此，深入了解 Julia 分布式程序是如何转移数据的非常有必要。

[`fetch`](@ref) 可以被认为是一个显式的数据转移操作，因为它直接要求将一个对象移动到本地机器。 [`@spawnat`](@ref)（以及一些相关的结构体）也移动数据，但这并不明显，因此可以称为隐式数据转移操作。 考虑这两种构造和平方一个随机矩阵的方法：

方法一：

```julia-repl
julia> A = rand(1000,1000);

julia> Bref = @spawnat :any A^2;

[...]

julia> fetch(Bref);
```

方法二：

```julia-repl
julia> Bref = @spawnat :any rand(1000,1000)^2;

[...]

julia> fetch(Bref);
```

这种差异看起来微不足道，但实际上由于 [`@spawnat`](@ref) 的行为而非常显着。 在第一种方法中，在本地构造一个随机矩阵，然后将其发送到另一个进程进行平方。 在第二种方法中，随机矩阵在另一个进程中被构造和平方。 因此，第二种方法发送的数据比第一种方法少得多。

在这个简单示例中，这两种方法很容易区分和选择。 然而，在一个真正的程序设计数据转移可能需要更多的思考和一些测量。 例如，如果第一个进程需要矩阵`A`，那么第一种方法可能更好。 或者，如果计算 `A` 很昂贵并且只有当前进程拥有它，那么将它移到另一个进程可能是不可避免的。 或者，如果当前进程在 [`@spawnat`](@ref) 和 `fetch(Bref)` 之间几乎没有什么关系，最好完全消除并行性。 或者想象一下 `rand(1000,1000)` 被更昂贵的操作取代。 那么为这一步添加另一个 [`@spawnat`](@ref) 语句可能是有意义的。

## 全局变量
通过 [`@spawnat`](@ref) 远程执行的表达式，或使用 [`remotecall`](@ref) 为远程执行指定的闭包可能会引用全局变量。 与其他模块中的全局绑定相比，模块 `Main` 下的全局绑定的处理方式略有不同。 考虑以下代码片段：

```julia-repl
A = rand(10,10)
remotecall_fetch(()->sum(A), 2)
```

在这种情况下，[`sum`](@ref) 必须在远程进程中定义。请注意，`A` 是在本地工作区中定义的全局变量。 worker 2 在 `Main` 下没有名为 `A` 的变量。 将闭包 `()->sum(A)` 传送到 worker 2 的行为导致 `Main.A` 被定义在 2 上。即使在调用 [`remotecall_fetch`](@ref) 返回之后， `Main.A` 仍然存在于 worker 2 上。带有嵌入式全局引用的远程调用（仅在`Main` 模块下）以如下的方式管理全局变量：

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

幸运的是，许多有用的并行计算不需要数据转移。 一个常见的例子是蒙特卡罗模拟，其中多个进程可以同时处理独立的模拟试验。 我们可以使用 [`@spawnat`](@ref) 在两个进程上抛硬币。 首先，在 `count_heads.jl` 中编写以下函数：

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

julia> a = @spawnat :any count_heads(100000000)
Future(2, 1, 6, nothing)

julia> b = @spawnat :any count_heads(100000000)
Future(3, 1, 7, nothing)

julia> fetch(a)+fetch(b)
100001564
```

上面的例子展示了一种非常常见而且有用的并行编程模式，在一些进程中执行多次独立的迭代，然后将它们的结果通过某个函数合并到一起，这个合并操作通常称作**聚合**(*reduction*)，也就是一般意义上的**张量降维**(tensor-rank-reducing)，比如将一个向量降维成一个数，或者是将一个 tensor 降维到某一行或者某一列等。在代码中，通常具有 `x = f(x, v[i])` 这种形式，其中 `x` 是一个叠加器，`f` 是一个聚合函数，而 `v[i]` 则是将要被聚合的值。一般来说，`f` 要求满足结合律，这样不管执行的顺序如何，都不会影响计算结果。

请注意，我们可以将这种`count_heads` 模式推广。 我们使用了两个显式的 [`@spawnat`](@ref) 语句，将并行性限制为两个进程。 要在任意数量的进程上运行，我们可以使用 *并行for循环*，在分布式内存中运行，可以在 Julia 中使用 [`@distributed`](@ref) 编写，如下所示：

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

如你所见，如果不需要，可以省略归约运算符。 在这种情况下，循环异步执行，即它在所有可用的 worker 上产生独立的任务，并立即返回一个 [`Future`](@ref Distributed.Future) 数组，而无需等待完成。 调用者可以稍后通过调用 [`fetch`](@ref) 来等待 [`Future`](@ref Distributed.Future) 完成，或者通过添加前缀 [`@sync`](@ref)，比如 `@sync @distributed for`，来等待循环结束。

在一些不需要聚合函数的情况下，我们可能只是像对某个范围内的整数应用一个函数(或者，更一般地，某个序列中的所有元素)，这种操作称作**并行的 map**，在 Julia 中有一个对应的函数 [`pmap`](@ref)。例如，可以像下面这样计算一些随机大矩阵的奇异值：

```julia-repl
julia> M = Matrix{Float64}[rand(1000,1000) for i = 1:10];

julia> pmap(svdvals, M);
```

Julia 中的 [`pmap`](@ref) 是被设计用来处理一些计算量比较复杂的函数的并行化的。与之对比的是，`@distributed for` 是用来处理一些每次迭代计算都很轻量的计算，比如简单地对两个数求和。[`pmap`](@ref) 和 `@distributed for` 都只会用到 worker 的进程。对于 `@distributed for` 而言，最后的聚合计算由发起者的进程完成。

## 远程引用和 AbstractChannel

远程引用通常指某种 `AbstractChannel` 的实现。

`AbstractChannel`（如`Channel`）的具体实现，需要实现 [`put!`](@ref), [`take!`](@ref), [`fetch`](@ref) , [`isready`](@ref) 和 [`wait`](@ref)。 [`Future`](@ref Distributed.Future) 所引用的远程对象存储在`Channel{Any}(1)` 中，即大小为 1 的、能够容纳 `Any` 类型对象的 `Channel` 。

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

julia> errormonitor(@async make_jobs(n)); # feed the jobs channel with "n" jobs

julia> for p in workers() # start tasks on the workers to process requests in parallel
           remote_do(do_work, p, jobs, results)
       end

julia> @elapsed while n > 0 # print out results
           job_id, exec_time, where = take!(results)
           println("$job_id finished in $(round(exec_time; digits=2)) seconds on worker $where")
           global n = n - 1
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

存储值的节点会跟踪哪些 worker 引用了它。 每次将 [`RemoteChannel`](@ref) 或（未获取的）[`Future`](@ref Distributed.Future) 序列化为 worker 时，都会通知引用指向的节点。 并且每次在本地对 [`RemoteChannel`](@ref) 或（未获取的）[`Future`](@ref Distributed.Future) 进行垃圾回收时，都会再次通知拥有该值的节点。 这是在内部集群感知序列化程序中实现的。 远程引用仅在正在运行的集群的上下文中有效。 不支持对常规`IO`对象的引用进行序列化和反序列化。

上面说到的**通知**都是通过发送"跟踪"信息来实现的，当一个引用被序列化的时候，就会发送"添加引用"的信息，而一个引用被本地的垃圾回收器回收的时候，就会发送一个"删除引用"的信息。

由于 [`Future`](@ref Distributed.Future) 是一次性写入并在本地缓存，因此 [`fetch`](@ref)ing 一个 [`Future`](@ref Distributed.Future) 的行为也会更新拥有该值的节点上的引用跟踪信息。

一旦指向某个值的引用都被删除了，对应的节点会将其释放。

使用 [`Future`]（@ref Distributed.Future），将已获取的[`Future`]（@ref Distributed.Future）序列化到其他节点也会发送该值，因为此时原始远程存储可能已收集该值了。

此外需要注意的是，本地的垃圾回收到底发生在什么时候取决于具体对象的大小以及当时系统的内存压力。

在远程引用的情况下，本地引用对象的大小非常小，而存储在远程节点上的值可能非常大。 由于可能不会立即收集本地对象，因此在 [`RemoteChannel`](@ref) 的本地实例或未获取的 [`Future`](@ref Distributed.Future) 上显式调用 [`finalize`](@ref) 是一个好习惯 。 由于在 [`Future`](@ref Distributed.Future) 上调用 [`fetch`](@ref) 也会从远程存储中删除其引用，因此在获取的 [`Future`](@ref Distributed.Future) 上不需要这样做。 显式调用 [`finalize`](@ref) 会导致立即向远程节点发送消息以继续并删除其对该值的引用。

一旦执行了 finalize 之后，引用就不可用了。


## 本地调用

数据必须复制到远程节点以供执行。 远程调用和数据存储到不同节点上的 [`RemoteChannel`](@ref) / [`Future`](@ref Distributed.Future) 时都是这种情况。 正如预期的那样，这会在远程节点上生成序列化对象的副本。 但是，当目的节点是本地节点时，即调用进程id与远程节点id相同，则作为本地调用执行。 它通常（并非总是）在不同的 Task 中执行 - 但没有数据的序列化/反序列化。 因此，该调用引用了与传递相同的对象实例 - 没有创建副本。 这种行为在下面突出显示：

```julia-repl
julia> using Distributed;

julia> rc = RemoteChannel(()->Channel(3));   # RemoteChannel created on local node

julia> v = [0];

julia> for i in 1:3
           v[1] = i                          # Reusing `v`
           put!(rc, v)
       end;

julia> result = [take!(rc) for _ in 1:3];

julia> println(result);
Array{Int64,1}[[3], [3], [3]]

julia> println("Num Unique objects : ", length(unique(map(objectid, result))));
Num Unique objects : 1

julia> addprocs(1);

julia> rc = RemoteChannel(()->Channel(3), workers()[1]);   # RemoteChannel created on remote node

julia> v = [0];

julia> for i in 1:3
           v[1] = i
           put!(rc, v)
       end;

julia> result = [take!(rc) for _ in 1:3];

julia> println(result);
Array{Int64,1}[[1], [2], [3]]

julia> println("Num Unique objects : ", length(unique(map(objectid, result))));
Num Unique objects : 3
```

可以看出，本地拥有的 [`RemoteChannel`](@ref) 上的 [`put!`](@ref) 在调用之间修改了相同的对象 `v` 会导致存储相同的单个对象实例。 与当拥有 `rc` 的节点是不同节点时创建的 `v` 副本相反。

需要注意的是，这通常不是问题。 只有当对象既存储在本地又在调用后被修改时，才需要考虑这一点。 在这种情况下，存储对象的 `deepcopy` 可能是合适的。

对于本地节点上的远程调用也是如此，如下例所示：

```julia-repl
julia> using Distributed; addprocs(1);

julia> v = [0];

julia> v2 = remotecall_fetch(x->(x[1] = 1; x), myid(), v);     # Executed on local node

julia> println("v=$v, v2=$v2, ", v === v2);
v=[1], v2=[1], true

julia> v = [0];

julia> v2 = remotecall_fetch(x->(x[1] = 1; x), workers()[1], v); # Executed on remote node

julia> println("v=$v, v2=$v2, ", v === v2);
v=[0], v2=[1], false
```

再次可以看出，对本地节点的远程调用就像直接调用一样。调用修改作为参数传递的本地对象。 在远程调用中，它对参数的副本进行操作。

重复一遍，一般来说这不是问题。 如果本地节点也被用作计算节点，并且在调用后使用的参数，则需要考虑此行为，并且如果需要，必须将参数的深拷贝传递给在本地节点上唤起的调用。 对远程节点的调用将始终对参数的副本进行操作。



## [共享数组](@id man-shared-arrays)

共享数组使用系统共享内存将数组映射到多个进程上，尽管和 [`DArray`](https://github.com/JuliaParallel/DistributedArrays.jl) 有点像，但其实际表现有很大不同。在 [`DArray`](https://github.com/JuliaParallel/DistributedArrays.jl) 中，每个进程可以访问数据中的一块，但任意两个进程都不能共享同一块数据，而对于 [`SharedArray`](@ref)，每个进程都可以访问整个数组。如果你想在一台机器上，让一大块数据能够被多个进程访问到，那么 [`SharedArray`](@ref) 是个不错的选择。

共享数组由 `SharedArray` 提供，必须在所有相关的 worker 中都显式地加载。


对 [`SharedArray`](@ref) 索引（访问和复制）操作就跟普通的数组一样，由于底层的内存对本地的进程是可见的，索引的效率很高，因此大多数单进程上的算法对 [`SharedArray`](@ref) 来说都是适用的，除非某些算法必须使用 [`Array`](@ref) 类型（此时可以通过调用 [`sdata`](@ref) 来获取 [`SharedArray`](@ref) 数组）。对于其它类型的 `AbstractArray` 类型数组来说，[`sdata`](@ref) 仅仅会返回数组本身，因此，可以放心地使用 [`sdata`](@ref) 对任意类型的 `Array` 进行操作。

共享数组可以通过以下形式构造：

```julia
SharedArray{T,N}(dims::NTuple; init=false, pids=Int[])
```

它在由 `pids` 指定的进程中创建了一个位类型为 `T` 和形状为 `dims` 的 `N` 维共享数组。 与分布式数组不同，共享数组只能从由`pids` 命名参数指定的那些参与 worker 访问（如果创建过程在同一主机上，也是如此）。 请注意，SharedArray 中仅支持 [`isbits`](@ref) 元素。

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

julia> S = SharedArray{Int,2}((3,4), init = S -> S[localindices(S)] = repeat([myid()], length(localindices(S))))
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
julia> S = SharedArray{Int,2}((3,4), init = S -> S[indexpids(S):length(procs(S)):length(S)] = repeat([myid()], length( indexpids(S):length(procs(S)):length(S))))
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

  * 如果将 `multiplex=true` 指定为 [`addprocs`](@ref) 的选项，则 SSH 多路复用用于在 master 和 worker 之间创建隧道。 如果你自己配置了 SSH 多路复用并且已经建立了连接，则无论 `multiplex` 选项如何，都会使用 SSH 多路复用。 如果启用了多路复用，则使用现有连接（ssh 中的 `-O forward` 选项）设置转发。 如果你的服务器需要密码验证，那么这就很有用了；
     
     
     
     
    你可以通过在 [`addprocs`](@ref) 之前登录服务器来避免在 Julia 中进行身份验证。 除非使用现有的多路复用连接，否则在会话期间控制套接字将位于 `~/.ssh/julia-%r@%h:%p`。 请注意，如果你在一个节点上创建多个进程并启用多路复用，带宽可能会受到限制，因为在这种情况下，进程共享一个多路复用 TCP 连接。
     
     
     

### [集群 Cookie](@id man-cluster-cookie)

集群上所有的进程都共享同一个 cookie，默认是 master 进程随机生成的字符串。

  * [`cluster_cookie()`](@ref) 返回 cookie，而 `cluster_cookie(cookie)()` 设置并返回新的 cookie。
     
  * 所有的连接都进行双向认证，从而保证只有 master 启动的 worker 才能相互连接。
     
  * cookie 可以在 worker 启动的时候，通过参数 `--worker=<cookie>` 指定，如果参数 `--worker` 没有指定 cookie，那么 worker 会从它的标准输入中 ([`stdin`](@ref)) 读取， `stdin` 会在 cookie 获取之后立即关闭。
     
     
  * `ClusterManager` 可以通过 [`cluster_cookie()`](@ref) 从 master 中过去 cookie，不适用默认 TCP/IP 传输的集群管理器（即没有指定 `--worker`）必须用于 master 相同的 cookie 调用 `init_worker(cookie, manager)`。
     
     

注意，在对安全性要求很高的环境中，可以通过自定义 `ClusterManager` 实现。例如，cookie 可以提前共享，然后不必再启动参数中指定。

## 指定网络拓补结构（实验性功能）

传递给 [`addprocs`](@ref) 的关键字参数 `topology` 用于指定 workers 必须如何相互连接：

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
请记住，CUDAnative.jl[^2] 目前不支持某些 Julia 功能，尤其是像 `sin` 这样的一些函数需要替换为 `CUDAnative.sin`（cc：@maleadt）。

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
    [Julia GPU man pages](http://juliagpu.github.io/CUDAnative.jl/stable/man/usage.html#Julia-support-1)
