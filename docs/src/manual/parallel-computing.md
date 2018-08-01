# 并行计算

```@raw html
<!--
# Parallel Computing
-->
```

本文将详细介绍Julia中的以下几种并行编程模型：

```@raw html
<!--
This part of the manual details the following types of parallel programming available in Julia.
-->
```

1. 单节点或多节点上基于多进程的分布式内存模型
2. 单节点上基于多进程的内存共享模型
3. 多线程

```@raw html
<!--
1. Distributed memory using multiple processes on one or more nodes
2. Shared memory using multiple processes on a single node
3. Multi-threading
-->
```

# 分布式内存并行

```@raw html
<!--
# Distributed Memory Parallelism
-->
```

作为Julia标准库之一，`Distributed`库提供了一种分布式内存并行计算的实现。

```@raw html
<!--
An implementation of distributed memory parallel computing is provided by module `Distributed`
as part of the standard library shipped with Julia.
-->
```

大多数现代计算机都拥有不止一个CPU，而且多台计算机可以组织在一起形成一个集群。借助多个CPU的计算能力，许多计算过程能够更快地完成，这其中影响性能的两个主要因素分别是：CPU自身的速度以及它们访问内存的速度。显然，在一个集群中，一个CPU访问同一个节点的RAM速度是最快的，不过令人吃惊的是，在一台典型的多核笔记本电脑上，由于访问主存和[缓存](https://www.akkadia.org/drepper/cpumemory.pdf)的速度存在差别，类似的现象也会存在。因此，一个良好的多进程环境应该能够管理好某一片内存区域“所属”的CPU。Julia提供的多进程环境是基于消息传递来实现的，可以做到同时让程序在多个进程的不同内存区域中运行。

```@raw html
<!--
Most modern computers possess more than one CPU, and several computers can be combined together
in a cluster. Harnessing the power of these multiple CPUs allows many computations to be completed
more quickly. There are two major factors that influence performance: the speed of the CPUs themselves,
and the speed of their access to memory. In a cluster, it's fairly obvious that a given CPU will
have fastest access to the RAM within the same computer (node). Perhaps more surprisingly, similar
issues are relevant on a typical multicore laptop, due to differences in the speed of main memory
and the [cache](https://www.akkadia.org/drepper/cpumemory.pdf). Consequently, a good multiprocessing
environment should allow control over the "ownership" of a chunk of memory by a particular CPU.
Julia provides a multiprocessing environment based on message passing to allow programs to run
on multiple processes in separate memory domains at once.
-->
```

Julia的消息传递机制与一些其它的框架不太一样，比如 MPI [^1]。在Julia中，进程之间的通信通常是**单向**的，这里单向的意思是说，在实现2个进程之间的操作时，只需要显式地管理一个进程即可。此外，这些操作并不像是“发送消息”，“接收消息”这类操作，而是一些高阶的操作，比如调用用户定义的函数。

```@raw html
<!--
Julia's implementation of message passing is different from other environments such as MPI [^1]
Communication in Julia is generally "one-sided", meaning that the programmer needs to explicitly
manage only one process in a two-process operation. Furthermore, these operations typically do
not look like "message send" and "message receive" but rather resemble higher-level operations
like calls to user functions.
-->
```

Julia中的分布式编程基于两个基本概念：**远程引用**(*remote references*)和**远程调用**(*remote calls*)。远程引用是一个对象，任意一个进程可以通过它访问存储在某个特定进程上的对象。远程调用指是某个进程发起的执行函数的请求，该函数会在另一个（也可能是同一个）进程中执行。

```@raw html
<!--
Distributed programming in Julia is built on two primitives: *remote references* and *remote calls*.
A remote reference is an object that can be used from any process to refer to an object stored
on a particular process. A remote call is a request by one process to call a certain function
on certain arguments on another (possibly the same) process.
-->
```

远程引用有两种类型：[`Future`](@ref)和[`RemoteChannel`](@ref)。

```@raw html
<!--
Remote references come in two flavors: [`Future`](@ref) and [`RemoteChannel`](@ref).
-->
```

一次远程调用会返回一个[`Future`](@ref)作为结果。远程调用会立即返回；也就是说，执行远程调用的进程接下来会继续执行下一个操作，而远程调用则会在另外的进程中进行。你可以通过对返回的[`Future`](@ref)执行[`wait`](@ref)操作来等待远程调用结束，然后用[`fetch`](@ref)获取结果。

```@raw html
<!--
A remote call returns a [`Future`](@ref) to its result. Remote calls return immediately; the process
that made the call proceeds to its next operation while the remote call happens somewhere else.
You can wait for a remote call to finish by calling [`wait`](@ref) on the returned [`Future`](@ref),
and you can obtain the full value of the result using [`fetch`](@ref).
-->
```

对于[`RemoteChannel`](@ref)而言，它可以被反复写入。例如，多个进程可以通过引用同一个远程`Channel`来协调相互之间的操作。

```@raw html
<!--
On the other hand, [`RemoteChannel`](@ref) s are rewritable. For example, multiple processes can
co-ordinate their processing by referencing the same remote `Channel`.
-->
```

每个进程都有一个对应的id，提供Julia交互环境的进程的`id`永远是1。我们把用来执行并行任务的进程称为“worker”，假如总共只有一个进程，那么进程1就被认为是worker，否则，除了进程1以外的进程都称作worker。

```@raw html
<!--
Each process has an associated identifier. The process providing the interactive Julia prompt
always has an `id` equal to 1. The processes used by default for parallel operations are referred
to as "workers". When there is only one process, process 1 is considered a worker. Otherwise,
workers are considered to be all processes other than process 1.
-->
```

一起试一下吧。执行`julia -p n`就可以在本地起`n`个进程。一般来说，将`n`设成与你机器上（物理的内核数）CPU个数一致比较合适。需要注意`-p`参数会隐式地载入`Distributed`模块。

```@raw html
<!--
Let's try this out. Starting with `julia -p n` provides `n` worker processes on the local machine.
Generally it makes sense for `n` to equal the number of CPU threads (logical cores) on the machine. Note that the `-p`
argument implicitly loads module `Distributed`.
-->
```

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

[`remotecall`](@ref)的第一个参数是想要调用的函数，第二个参数是执行函数的进程`id`，其余的参数会喂给将要被调用的函数。在Julia中进行并行编程时，一般不需要显示地指明具体在哪个进程上执行，不过[`remotecall`](@ref)是一个相对底层的接口用来提供细粒度的管理。

```@raw html
<!--
The first argument to [`remotecall`](@ref) is the function to call. Most parallel programming
in Julia does not reference specific processes or the number of processes available, but [`remotecall`](@ref)
is considered a low-level interface providing finer control. The second argument to [`remotecall`](@ref)
is the `id` of the process that will do the work, and the remaining arguments will be passed to
the function being called.
-->
```

可以看到，第一行代码请求进程2构建一个随机矩阵，第二行代码对该矩阵执行加一操作。每次执行的结果存在对应的Future中，即`r`和`s`。这里[`@spawnat`](@ref)宏会在第一个参数所指定的进程中执行后面第二个参数中的表达式。

```@raw html
<!--
As you can see, in the first line we asked process 2 to construct a 2-by-2 random matrix, and
in the second line we asked it to add 1 to it. The result of both calculations is available in
the two futures, `r` and `s`. The [`@spawnat`](@ref) macro evaluates the expression in the second
argument on the process specified by the first argument.
-->
```

有时候，你可能会希望立即获取远程计算的结果，比如，在接下来的操作中就需要读取远程调用的结果，这时候你可以使用[`remotecall_fetch`](@ref)函数，其效果相当于`fetch(remotecall(...))`，不过更高效些。

```@raw html
<!--
Occasionally you might want a remotely-computed value immediately. This typically happens when
you read from a remote object to obtain data needed by the next local operation. The function
[`remotecall_fetch`](@ref) exists for this purpose. It is equivalent to `fetch(remotecall(...))`
but is more efficient.
-->
```

```julia-repl
julia> remotecall_fetch(getindex, 2, r, 1, 1)
0.18526337335308085
```

回忆下，这里[`getindex(r,1,1)`](@ref) [相当于](@ref man-array-indexing) `r[1,1]`，因此，上面的调用相当于获取`r`的第一个元素。

```@raw html
<!--
Remember that [`getindex(r,1,1)`](@ref) is [equivalent](@ref man-array-indexing) to `r[1,1]`, so this call fetches
the first element of the future `r`.
-->
```

[`remotecall`](@ref)的语法不是很方便，有一个宏[`@spawn`](@ref)可以做些简化，其作用于一个表达式，而不是函数，同时会自动帮你选择在哪个进程上执行。

```@raw html
<!--
The syntax of [`remotecall`](@ref) is not especially convenient. The macro [`@spawn`](@ref)
makes things easier. It operates on an expression rather than a function, and picks where to do
the operation for you:
-->
```

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

注意这里执行的是`1 .+ fetch(r)`而不是`1 .+ r`。这是因为我们并不知道这段代码会在哪个进程中执行，因此，通常需要用[`fetch`](@ref)将`r`中的数据挪到当前计算加法的进程中。这时候[`@spawn`](@ref)会很智能地在拥有`r`的进程中执行计算，此时，[`fetch`](@ref)就相当于什么都不用做。(2018-07-25 译者注：我看过源码，这句话完全瞎说的，一点都不智能，[discourse](https://discourse.julialang.org/t/understanding-pid-and-rrid-in-future-objects-related-to-spawn-and-spawnat-in-documentation/9462)上也有人提出同样的疑惑，并没有人正面回答。)

```@raw html
<!--
Note that we used `1 .+ fetch(r)` instead of `1 .+ r`. This is because we do not know where the
code will run, so in general a [`fetch`](@ref) might be required to move `r` to the process
doing the addition. In this case, [`@spawn`](@ref) is smart enough to perform the computation
on the process that owns `r`, so the [`fetch`](@ref) will be a no-op (no work is done).
-->
```

显然，[`@spawn`](@ref)并非Julia内置的一部分，而是通过[宏](@ref man-macros)定义的，因此，你也可以自己定义类似的结构。

```@raw html
<!--
(It is worth noting that [`@spawn`](@ref) is not built-in but defined in Julia as a [macro](@ref man-macros).
It is possible to define your own such constructs.)
-->
```

有一点一定要注意，一旦执行了`fetch`，[`Future`](@ref) 就会将结果缓存起来，之后执行[`fetch`](@ref)的时候就不涉及到网络传输了。一旦所有的[`Future`](@ref)都获取到了值，那么远端存储的值就会被删掉。

```@raw html
<!--
An important thing to remember is that, once fetched, a [`Future`](@ref) will cache its value
locally. Further [`fetch`](@ref) calls do not entail a network hop. Once all referencing [`Future`](@ref)s
have fetched, the remote stored value is deleted.
-->
```

## 访问代码以及加载库

```@raw html
<!--
## Code Availability and Loading Packages
-->
```

对于想要并行执行的代码，需要所有对所有线程都可见。例如，在Julia命令行中输入以下命令：

```@raw html
<!--
Your code must be available on any process that runs it. For example, type the following into
the Julia prompt:
-->
```

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

进程1知道函数`rand2`的存在，但进程2并不知道。

```@raw html
<!--
Process 1 knew about the function `rand2`, but process 2 did not.
-->
```

大多数情况下，你会从文件或者库中加载代码，在此过程中你可以灵活地控制哪个进程加载哪部分代码。假设有这样一个文件，`DummyModule.jl`，其代码如下：

```@raw html
<!--
Most commonly you'll be loading code from files or packages, and you have a considerable amount
of flexibility in controlling which processes load code. Consider a file, `DummyModule.jl`,
containing the following code:
-->
```

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

为了在所有进程中引用`MyType`，`DummyModule.jl`需要在每个进程中载入。单独执行`include("DummyModule.jl")`只会在一个线程中将其载入。为了让每个线程都载入它，可以用[`@everywhere`](@ref)宏来实现(启动Julia的时候，执行`julia -p 2`)。

```@raw html
<!--
In order to refer to `MyType` across all processes, `DummyModule.jl` needs to be loaded on
every process.  Calling `include("DummyModule.jl")` loads it only on a single process.  To
load it on every process, use the [`@everywhere`](@ref) macro (starting Julia with `julia -p
2`):
-->
```

```julia-repl
julia> @everywhere include("DummyModule.jl")
loaded
      From worker 3:    loaded
      From worker 2:    loaded
```

和往常一样，这么做并不会将`DummyModule`引入到每个线程的命名空间中，除非显式地使用`using`或`import`。此外，显式地将`DummyModule`引入一个线程中，并不会影响其它线程：

```@raw html
<!--
As usual, this does not bring `DummyModule` into scope on any of the process, which requires
`using` or `import`.  Moreover, when `DummyModule` is brought into scope on one process, it
is not on any other:
-->
```

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

不过，我们仍然可以在已经包含(include)过`DummyModule`的进程中，发送`MyType`类型的实例，尽管此时该进程的命名空间中并没有`MyType`变量:

```@raw html
<!--
However, it's still possible, for instance, to send a `MyType` to a process which has loaded
`DummyModule` even if it's not in scope:
-->
```

```julia-repl
julia> put!(RemoteChannel(2), MyType(7))
RemoteChannel{Channel{Any}}(2, 1, 13)
```

文件代码还可以在启动的时候，通过`-L`参数指定，从而提前在多个进程中载入，然后通过一个driver.jl文件控制执行逻辑:

```@raw html
<!--
A file can also be preloaded on multiple processes at startup with the `-L` flag, and a
driver script can be used to drive the computation:
-->
```

```
julia -p <n> -L file1.jl -L file2.jl driver.jl
```

上面执行`driver.jl`的进程id为1，就跟提供交互式命令行的Julia进程一样。

```@raw html
<!--
The Julia process running the driver script in the example above has an `id` equal to 1, just
like a process providing an interactive prompt.
-->
```

最后，如果`DummyModule.jl`不是一个单独的文件，而是一个包的话，那么`using DummyModule`只会在所有线程中*载入*`DummyModule.jl`，也就是说`DummyModule`只会在`using`执行的线程中被引入命名空间。

```@raw html
<!--
Finally, if `DummyModule.jl` is not a standalone file but a package, then `using
DummyModule` will _load_ `DummyModule.jl` on all processes, but only bring it into scope on
the process where `using` was called.
-->
```

## 启动和管理worker进程

```@raw html
<!--
## Starting and managing worker processes
-->
```

Julia自带两种集群管理模式：

```@raw html
<!--
The base Julia installation has in-built support for two types of clusters:
-->
```

  * 本地集群，前面通过启动时指定`-p`参数就是这种模式
  * 跨机器的集群，通过`--machine-file`指定。这种模式采用没有密码的`ssh`登陆并对应的机器上（与host相同的路径下）启动Julia的worker进程。

```@raw html
<!--
  * A local cluster specified with the `-p` option as shown above.
  * A cluster spanning machines using the `--machine-file` option. This uses a passwordless `ssh` login
    to start Julia worker processes (from the same path as the current host) on the specified machines.
-->
```

[`addprocs`](@ref), [`rmprocs`](@ref), [`workers`](@ref)这些函数可以分别用来对集群中的进程进行增加，删除和修改。

```@raw html
<!--
Functions [`addprocs`](@ref), [`rmprocs`](@ref), [`workers`](@ref), and others are available
as a programmatic means of adding, removing and querying the processes in a cluster.
-->
```

```julia-repl
julia> using Distributed

julia> addprocs(2)
2-element Array{Int64,1}:
 2
 3
```

在master主线程中，`Distributed`模块必须显式地在调用[`addprocs`](@ref)之前载入，该模块会自动在其它进程中可见。

```@raw html
<!--
Module `Distributed` must be explicitly loaded on the master process before invoking [`addprocs`](@ref).
It is automatically made available on the worker processes.
-->
```

需要注意的时，worker进程并不会执行`~/.julia/config/startup.jl`启动脚本，也不会同步其它进程的全局状态（比如全局变量，新定义的方法，加载的模块等）。

```@raw html
<!--
Note that workers do not run a `~/.julia/config/startup.jl` startup script, nor do they synchronize
their global state (such as global variables, new method definitions, and loaded modules) with any
of the other running processes.
-->
```

其它类型的集群可以通过自己写一个`ClusterManager`来实现，下面[ClusterManagers](@ref)部分会介绍。

```@raw html
<!--
Other types of clusters can be supported by writing your own custom `ClusterManager`, as described
below in the [ClusterManagers](@ref) section.
-->
```

## 数据转移

```@raw html
<!--
## Data Movement
-->
```

分布式程序的性能瓶颈主要是由发送消息和数据转移造成的，减少发送消息和转移数据的数量对于获取高性能和可扩展性至关重要，因此，深入了解Julia分布式程序是如何转移数据的非常有必要。

```@raw html
<!--
Sending messages and moving data constitute most of the overhead in a distributed program. Reducing
the number of messages and the amount of data sent is critical to achieving performance and scalability.
To this end, it is important to understand the data movement performed by Julia's various distributed
programming constructs.
-->
```

[`fetch`](@ref)可以看作是显式地转移数据的操作，因为它直接要求获取数据到本地机器。[`@spawn`](@ref)（以及相关的操作）也会移动数据，不过不那么明显，因此称作隐式地数据转移操作。比较以下两种方式，构造一个随机矩阵并求平方：

```@raw html
<!--
[`fetch`](@ref) can be considered an explicit data movement operation, since it directly asks
that an object be moved to the local machine. [`@spawn`](@ref) (and a few related constructs)
also moves data, but this is not as obvious, hence it can be called an implicit data movement
operation. Consider these two approaches to constructing and squaring a random matrix:
-->
```

方法1：

```@raw html
<!--
Method 1:
-->
```

```julia-repl
julia> A = rand(1000,1000);

julia> Bref = @spawn A^2;

[...]

julia> fetch(Bref);
```

方法2：

```@raw html
<!--
Method 2:
-->
```

```julia-repl
julia> Bref = @spawn rand(1000,1000)^2;

[...]

julia> fetch(Bref);
```

二者的差别似乎微乎其微，不过受于[`@spawn`](@ref)的实现，二者其实有很大的区别。第一种方法中，首先在本地构造了一个随机矩阵，然后将其发送到另外一个线程计算平方，而第二种方法中，随机矩阵的构造以及求平方计算都在另外一个进程。因此，第二种方法传输的数据要比第一种方法少得多。

```@raw html
<!--
The difference seems trivial, but in fact is quite significant due to the behavior of [`@spawn`](@ref).
In the first method, a random matrix is constructed locally, then sent to another process where
it is squared. In the second method, a random matrix is both constructed and squared on another
process. Therefore the second method sends much less data than the first.
-->
```

在上面这个简单的例子中，两种方法很好区分并作出选择。不过，在实际的程序中设计如何转移数据时，需要经过深思熟虑。例如，如果第一个进程需要使用`A`，那么第一种方法就更合适些。或者，如果计算`A`非常复杂，而所有的进程中又只有当前进程有数据`A`，那么转移数据`A`就不可避免了。又或者，当前进程在[`@spawn`](@ref) 和 `fetch(Bref)`之间几乎没什么可做的，那么最好就不用并行了。又比如，假设`rand(1000,1000)`操作换成了某种非常复杂的操作，那么也许为这个操作再增加一个[`@spawn`](@ref)是个不错的方式。

```@raw html
<!--
In this toy example, the two methods are easy to distinguish and choose from. However, in a real
program designing data movement might require more thought and likely some measurement. For example,
if the first process needs matrix `A` then the first method might be better. Or, if computing
`A` is expensive and only the current process has it, then moving it to another process might
be unavoidable. Or, if the current process has very little to do between the [`@spawn`](@ref)
and `fetch(Bref)`, it might be better to eliminate the parallelism altogether. Or imagine `rand(1000,1000)`
is replaced with a more expensive operation. Then it might make sense to add another [`@spawn`](@ref)
statement just for this step.
-->
```

# 全局变量

通过`@spawn`在远端执行的表达式，或者通过`remotecall`调用的闭包，有可能引用全局变量。在`Main`模块中的全局绑定和其它模块中的全局绑定有所不同，来看看下面的例子:

```@raw html
<!--
# Global variables
Expressions executed remotely via `@spawn`, or closures specified for remote execution using
`remotecall` may refer to global variables. Global bindings under module `Main` are treated
a little differently compared to global bindings in other modules. Consider the following code
snippet:
-->
```

```julia-repl
A = rand(10,10)
remotecall_fetch(()->sum(A), 2)
```

这个例子中[`sum`](@ref)必须已经在远程的线程中定义了。注意这里`A`是当前线程中的一个全局变量，起初worker 2在其`Main`中并没有一个叫做`A`的变量。上面代码中，将闭包`()->sum(A)`发送到worker 2之后，会在worker 2中定义一个变量`Main.A`，而且，`Main.A`即使在执行完`remotecall_fetch`之后，仍然会存在与worker 2中。远程调用中包含的全局（这里仅仅指`Main`模块中的）引用会按如下方式管理：

```@raw html
<!--
In this case [`sum`](@ref) MUST be defined in the remote process.
Note that `A` is a global variable defined in the local workspace. Worker 2 does not have a variable called
`A` under `Main`. The act of shipping the closure `()->sum(A)` to worker 2 results in `Main.A` being defined
on 2. `Main.A` continues to exist on worker 2 even after the call `remotecall_fetch` returns. Remote calls
with embedded global references (under `Main` module only) manage globals as follows:
-->
```

- 在全局调用中引用的全局绑定会在将要执行该调用的worker中被创建。

```@raw html
<!--
- New global bindings are created on destination workers if they are referenced as part of a remote call.
-->
```

- 全局常量仍然在远端结点定义为常量。

```@raw html
<!--
- Global constants are declared as constants on remote nodes too.
-->
```

- 全局绑定会在下一次远程调用中引用到的时候，当其值发生改变时，再次发送给目标worker。此外，集群并不会所有结点的全局绑定。例如：

```@raw html
<!--
- Globals are re-sent to a destination worker only in the context of a remote call, and then only
  if its value has changed. Also, the cluster does not synchronize global bindings across nodes.
  For example:
-->
```

```julia
A = rand(10,10)
remotecall_fetch(()->sum(A), 2) # worker 2
A = rand(10,10)
remotecall_fetch(()->sum(A), 3) # worker 3
A = nothing
```

执行以上代码之后，worker 2 和worker 3中的`Main.A`的值时不同的，同时，节点1上的值则为`nothing`。

```@raw html
<!--
  Executing the above snippet results in `Main.A` on worker 2 having a different value from
  `Main.A` on worker 3, while the value of `Main.A` on node 1 is set to `nothing`.
-->
```

也许你也注意到了，在master主节点上被赋值为`nothing`之后，全局变量的内存会被回收，但在worker节点上的全局变量并没有被回收掉。执行[`clear`](@ref)可以手动将远端结点上的特定全局变量置为`nothing`，然后对应的内存会被周期性的垃圾回收机制回收。

```@raw html
<!--
As you may have realized, while memory associated with globals may be collected when they are reassigned
on the master, no such action is taken on the workers as the bindings continue to be valid.
[`clear!`](@ref) can be used to manually reassign specific globals on remote nodes to `nothing` once
they are no longer required. This will release any memory associated with them as part of a regular garbage
collection cycle.
-->
```

因此，在远程调用中，需要非常小心地引用全局变量。事实上，应当尽量避免引用全局变量，如果必须引用，那么可以考虑用`let`代码块将全局变量局部化：

```@raw html
<!--
Thus programs should be careful referencing globals in remote calls. In fact, it is preferable to avoid them
altogether if possible. If you must reference globals, consider using `let` blocks to localize global variables.
-->
```

例如：

```@raw html
<!--
For example:
-->
```

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

可以看到，`A`作为全局变量在worker 2中有定义，而`B`是一个局部变量，因而最后在worker 2 中并没有`B`的绑定。

```@raw html
<!--
As can be seen, global variable `A` is defined on worker 2, but `B` is captured as a local variable
and hence a binding for `B` does not exist on worker 2.
-->
```

## 并行的Map和Loop

```@raw html
<!--
## Parallel Map and Loops
-->
```

幸运的是，许多有用的并行计算并不涉及数据转移。一个典型的例子就是蒙特卡洛模拟，每个进程都独立地完成一些模拟试验。这里用[`@spawn`](@ref)在两个进程进行抛硬币的试验，首先，将下面的代码写入`count_heads.jl`文件:

```@raw html
<!--
Fortunately, many useful parallel computations do not require data movement. A common example
is a Monte Carlo simulation, where multiple processes can handle independent simulation trials
simultaneously. We can use [`@spawn`](@ref) to flip coins on two processes. First, write the following
function in `count_heads.jl`:
-->
```

```julia
function count_heads(n)
    c::Int = 0
    for i = 1:n
        c += rand(Bool)
    end
    c
end
```

函数`count_heads`只是简单地将`n`个随机0-1值累加，下面在两个机器上进行试验，病将结果叠加：

```@raw html
<!--
The function `count_heads` simply adds together `n` random bits. Here is how we can perform some
trials on two machines, and add together the results:
-->
```

```julia-repl
julia> @everywhere include_string(Main, $(read("count_heads.jl", String)), "count_heads.jl")

julia> a = @spawn count_heads(100000000)
Future(2, 1, 6, nothing)

julia> b = @spawn count_heads(100000000)
Future(3, 1, 7, nothing)

julia> fetch(a)+fetch(b)
100001564
```

上面的例子展示了一种非常常见而且有用的并行编程模式，在一些进程中执行多次独立的迭代，然后将它们的结果通过某个函数合并到一起，这个合并操作通常称作**聚合**(*reduction*)，也就是一般意义上的tensor-rank-reducing，比如将一个向量合并成一个数，或者是将一个tensor合并到某一行或者某一列等。在代码中，通常具有`x = f(x, v[i])`这种形式，其中`x`是一个叠加器，`f`是一个聚合函数，而`v[i]`则是将要被聚合的值。一般来说，`f`要求满足结合律，这样不管执行的顺序如何，都不会影响计算结果。

```@raw html
<!--
This example demonstrates a powerful and often-used parallel programming pattern. Many iterations
run independently over several processes, and then their results are combined using some function.
The combination process is called a *reduction*, since it is generally tensor-rank-reducing: a
vector of numbers is reduced to a single number, or a matrix is reduced to a single row or column,
etc. In code, this typically looks like the pattern `x = f(x,v[i])`, where `x` is the accumulator,
`f` is the reduction function, and the `v[i]` are the elements being reduced. It is desirable
for `f` to be associative, so that it does not matter what order the operations are performed
in.
-->
```

前面的代码中，调用`count_heads`的方式可以被抽象出来，之前我们显式地调用了两次[`@spawn`](@ref)，这将并行计算限制在了两个进程上，为了将并行计算扩展到任意多进程，可以使用*parallel for loop*这种形式，在Julia中可以用[`@distributed`](@ref)宏来实现：

```@raw html
<!--
Notice that our use of this pattern with `count_heads` can be generalized. We used two explicit
[`@spawn`](@ref) statements, which limits the parallelism to two processes. To run on any number
of processes, we can use a *parallel for loop*, running in distributed memory, which can be written
in Julia using [`@distributed`](@ref) like this:
-->
```

```julia
nheads = @distributed (+) for i = 1:200000000
    Int(rand(Bool))
end
```

上面的写法将多次迭代分配到了不同的线程，然后通过一个聚合函数（这里是`(+)`）合并计算结果，其中，每次迭代的结果作为`for`循环中的表达式的结果，最后整个循环的结果聚合后得到最终的结果。

```@raw html
<!--
This construct implements the pattern of assigning iterations to multiple processes, and combining
them with a specified reduction (in this case `(+)`). The result of each iteration is taken as
the value of the last expression inside the loop. The whole parallel loop expression itself evaluates
to the final answer.
-->
```

注意，尽管这里for循环看起来跟串行的for循环差不多，实际表现完全不同。这里的迭代并没有特定的执行顺序，而且由于所有的迭代都在不同的进程中进行，其中变量的写入对全局来说不可见。所有并行的for循环中的变量都会复制并广播到每个进程。

```@raw html
<!--
Note that although parallel for loops look like serial for loops, their behavior is dramatically
different. In particular, the iterations do not happen in a specified order, and writes to variables
or arrays will not be globally visible since iterations run on different processes. Any variables
used inside the parallel loop will be copied and broadcast to each process.
-->
```

比如，下面这段代码并不会像你想要的那样执行：

```@raw html
<!--
For example, the following code will not work as intended:
-->
```

```julia
a = zeros(100000)
@distributed for i = 1:100000
    a[i] = i
end
```

这段代码并不会把`a`的所有元素初始化，因为每个进程都会有一份`a`的拷贝，因此类似的for循环一定要避免。幸运的是，[Shared Arrays](@ref man-shared-arrays)可以用来突破这种限制：

```@raw html
<!--
This code will not initialize all of `a`, since each process will have a separate copy of it.
Parallel for loops like these must be avoided. Fortunately, [Shared Arrays](@ref man-shared-arrays) can be used
to get around this limitation:
-->
```

```julia
using SharedArrays

a = SharedArray{Float64}(10)
@distributed for i = 1:10
    a[i] = i
end
```

当然，对于for循环外面的变量来说，如果是只读的话，使用起来完全没问题：

```@raw html
<!--
Using "outside" variables in parallel loops is perfectly reasonable if the variables are read-only:
-->
```

```julia
a = randn(1000)
@distributed (+) for i = 1:100000
    f(a[rand(1:end)])
end
```

这里每次迭代都会从共享给每个进程的向量`a`中随机选一个样本，然后用来计算`f`。

```@raw html
<!--
Here each iteration applies `f` to a randomly-chosen sample from a vector `a` shared by all processes.
-->
```

可以看到，如果不需要的话，聚合函数可以省略掉，此时，for循环会异步执行，将独立的任务发送给所有的进程，然后不用等待执行完成，而是立即返回一个[`Future`](@ref)数组，调用者可以在之后的某个时刻通过调用[`fetch`](@ref)来等待[`Future`](@ref)执行完成，或者通过在并行的for循环之前添加一个[`@sync`](@ref)，就像`@sync @distributed for`。

```@raw html
<!--
As you could see, the reduction operator can be omitted if it is not needed. In that case, the
loop executes asynchronously, i.e. it spawns independent tasks on all available workers and returns
an array of [`Future`](@ref) immediately without waiting for completion. The caller can wait for
the [`Future`](@ref) completions at a later point by calling [`fetch`](@ref) on them, or wait
for completion at the end of the loop by prefixing it with [`@sync`](@ref), like `@sync @distributed for`.
-->
```

在一些不需要聚合函数的情况下，我们可能只是像对某个范围内的整数应用一个函数(或者，更一般地，某个序列中的所有元素)，这种操作称作**并行的map**，在Julia中有一个对应的函数[`pmap`](@ref)。例如，可以像下面这样计算一些随机大矩阵的奇异值：

```@raw html
<!--
In some cases no reduction operator is needed, and we merely wish to apply a function to all integers
in some range (or, more generally, to all elements in some collection). This is another useful
operation called *parallel map*, implemented in Julia as the [`pmap`](@ref) function. For example,
we could compute the singular values of several large random matrices in parallel as follows:
-->
```

```julia-repl
julia> M = Matrix{Float64}[rand(1000,1000) for i = 1:10];

julia> pmap(svdvals, M);
```

Julia中的[`pmap`](@ref)是被设计用来处理一些计算量比较复杂的函数的并行化的。与之对比的是，`@distributed for`是用来处理一些每次迭代计算都很轻量的计算，比如简单地对两个数求和。[`pmap`](@ref) 和 `@distributed for`都只会用到worker的进程。对于`@distributed for`而言，最后的聚合计算由发起者的进程完成。

```@raw html
<!--
Julia's [`pmap`](@ref) is designed for the case where each function call does a large amount
of work. In contrast, `@distributed for` can handle situations where each iteration is tiny, perhaps
merely summing two numbers. Only worker processes are used by both [`pmap`](@ref) and `@distributed for`
for the parallel computation. In case of `@distributed for`, the final reduction is done on the calling
process.
-->
```

## 远程引用的同步

```@raw html
<!--
## Synchronization With Remote References
-->
```

## 调度

```@raw html
<!--
## Scheduling
-->
```

Julia的并行编程使用[Tasks (aka Coroutines)](@ref man-tasks)来切换多个计算。无论何时，当代码请求通信操作，如[`fetch`](@ref)或[`wait`](@ref)时，当前Task会挂起，调度器会选择另外一个Task去执行，直到一个Task等待的事件完成的时候才会再次恢复执行。

```@raw html
<!--
Julia's parallel programming platform uses [Tasks (aka Coroutines)](@ref man-tasks) to switch among multiple
computations. Whenever code performs a communication operation like [`fetch`](@ref) or [`wait`](@ref),
the current task is suspended and a scheduler picks another task to run. A task is restarted when
the event it is waiting for completes.
-->
```

对于许多问题而言，并不需要直接考虑Task，不过，Task可以用来同时等待多个事件，从而实现**动态调度**。在动态调度的过程中，程序可以决定计算什么，或者根据其它任务执行结束的时间决定接下来在哪里执行计算。这对于不可预测或不平衡的计算量来说是必须的，因为我们只希望给那些已经完成了其当前任务的进程分配更多的任务。

```@raw html
<!--
For many problems, it is not necessary to think about tasks directly. However, they can be used
to wait for multiple events at the same time, which provides for *dynamic scheduling*. In dynamic
scheduling, a program decides what to compute or where to compute it based on when other jobs
finish. This is needed for unpredictable or unbalanced workloads, where we want to assign more
work to processes only when they finish their current tasks.
-->
```

例如，考虑下面这个计算不同大小矩阵的奇异值的任务：

```@raw html
<!--
As an example, consider computing the singular values of matrices of different sizes:
-->
```

```julia-repl
julia> M = Matrix{Float64}[rand(800,800), rand(600,600), rand(800,800), rand(600,600)];

julia> pmap(svdvals, M);
```

如果一个进程既处理 800 * 800 的矩阵，又处理 600 * 600的矩阵，我们恐怕没法得到想要的可扩展性。解决的办法是，当每个进程完成了其当前的任务之后，*喂给*它新的任务。例如，考虑下面这个[`pmap`](@ref)实现：

```@raw html
<!--
If one process handles both 800×800 matrices and another handles both 600×600 matrices, we will
not get as much scalability as we could. The solution is to make a local task to "feed" work to
each process when it completes its current task. For example, consider a simple [`pmap`](@ref)
implementation:
-->
```

```julia
function pmap(f, lst)
    np = nprocs()  # determine the number of processes available
    n = length(lst)
    results = Vector{Any}(n)
    i = 1
    # function to produce the next work item from the queue.
    # in this case it's just an index.
    nextidx() = (global i; idx=i; i+=1; idx)
    @sync begin
        for p=1:np
            if p != myid() || np == 1
                @async begin
                    while true
                        idx = nextidx()
                        idx > n && break
                        results[idx] = remotecall_fetch(f, p, lst[idx])
                    end
                end
            end
        end
    end
    results
end
```

[`@async`](@ref)跟[`@spawn`](@ref)有点类似，不过只在当前局部线程中执行。通过它来给每个进程创建一个**喂养**的task，每个task都选取下一个将要计算的索引，然后等待其执行结束，然后重复该过程，直到索引超出边界。需要注意的是，task并不会立即执行，只有在执行到[`@sync`](@ref)结束时才会开始执行，此时，当前线程交出控制权，直到所有的任务都完成了。所有的喂养taks都能够通过`nextidx`共享状态，这也就意味着，只有在执行完[`remotecall_fetch`](@ref)之后才会发生上下午切换（idx发生改变）。

```@raw html
<!--
[`@async`](@ref) is similar to [`@spawn`](@ref), but only runs tasks on the local process. We
use it to create a "feeder" task for each process. Each task picks the next index that needs to
be computed, then waits for its process to finish, then repeats until we run out of indices. Note
that the feeder tasks do not begin to execute until the main task reaches the end of the [`@sync`](@ref)
block, at which point it surrenders control and waits for all the local tasks to complete before
returning from the function. The feeder tasks are able to share state via `nextidx` because
they all run on the same process. No locking is required, since the threads are scheduled cooperatively
and not preemptively. This means context switches only occur at well-defined points: in this case,
when [`remotecall_fetch`](@ref) is called.
-->
```

## 频道(Channels)

```@raw html
<!--
## Channels
-->
```

在[Control Flow](@ref)中有关[`Task`](@ref)的部分，已经讨论了如何协调多个函数的执行。[`Channel`](@ref)可以很方便地在多个运行中的task传递数据，特别是那些涉及I/O的操作。

```@raw html
<!--
The section on [`Task`](@ref)s in [Control Flow](@ref) discussed the execution of multiple functions in
a co-operative manner. [`Channel`](@ref)s can be quite useful to pass data between running tasks, particularly
those involving I/O operations.
-->
```

典型的I/O操作包括读写文件、访问web服务、执行外部程序等。在所有这些场景中，如果其它task可以在读取文件（等待外部服务或程序执行完成）时继续执行，那么总的执行时间能够得到大大提升。

```@raw html
<!--
Examples of operations involving I/O include reading/writing to files, accessing web services,
executing external programs, etc. In all these cases, overall execution time can be improved if
other tasks can be run while a file is being read, or while waiting for an external service/program
to complete.
-->
```

一个channel可以看做是一个管道，一端可读，另一端可写。

```@raw html
<!--
A channel can be visualized as a pipe, i.e., it has a write end and read end.
-->
```

  * 不同的task可以通过[`put!`](@ref)往同一个channel并发地写入。
  * 不同的task也可以通过[`take!`](@ref)从同一个channel并发地取数据
  * 举个例子：

```@raw html
<!--
  * Multiple writers in different tasks can write to the same channel concurrently via [`put!`](@ref)
    calls.
  * Multiple readers in different tasks can read data concurrently via [`take!`](@ref) calls.
  * As an example:
-->
```

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
    @async foo()
end
```

  * Channel可以通过`Channel{T}(sz)`构造，得到的channel只能存储类型`T`的数据。如果`T`没有指定，那么channel可以存任意类型。`sz`表示该channel能够存储的最大元素个数。比如`Channel(32)`得到的channel最多可以存储32个元素。而`Channel{MyType}(64)`则可以最多存储64个`MyType`类型的数据。
  * 如果一个[`Channel`](@ref)是空的，读取的task(即执行[`take!`](@ref)的task)会被阻塞直到有新的数据准备好了。
  * 如果一个[`Channel`](@ref)是满的，那么写入的task(即执行[`put!`](@ref)的task)则会被阻塞，直到Channel有空余。
  * [`isready`](@ref)可以用来检查一个channel中是否有已经准备好的元素，而[`wait`](@ref)则用来等待一个元素准备好。
  * 一个[`Channel`](@ref)一开始处于开启状态，也就是说可以被[`take!`](@ref)读取和[`put!`](@ref)写入。[`close`](@ref)会关闭一个[`Channel`](@ref)，对于一个已经关闭的[`Channel`](@ref)，[`put!](@ref)会失败，例如：

```@raw html
<!--
  * Channels are created via the `Channel{T}(sz)` constructor. The channel will only hold objects
    of type `T`. If the type is not specified, the channel can hold objects of any type. `sz` refers
    to the maximum number of elements that can be held in the channel at any time. For example, `Channel(32)`
    creates a channel that can hold a maximum of 32 objects of any type. A `Channel{MyType}(64)` can
    hold up to 64 objects of `MyType` at any time.
  * If a [`Channel`](@ref) is empty, readers (on a [`take!`](@ref) call) will block until data is available.
  * If a [`Channel`](@ref) is full, writers (on a [`put!`](@ref) call) will block until space becomes available.
  * [`isready`](@ref) tests for the presence of any object in the channel, while [`wait`](@ref)
    waits for an object to become available.
  * A [`Channel`](@ref) is in an open state initially. This means that it can be read from and written to
    freely via [`take!`](@ref) and [`put!`](@ref) calls. [`close`](@ref) closes a [`Channel`](@ref).
    On a closed [`Channel`](@ref), [`put!`](@ref) will fail. For example:
-->
```

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

  * [`take!`](@ref) 和 [`fetch`](@ref) (只读取，不会将元素从channle中删掉)仍然可以从一个已经关闭的channel中读数据，直到channel被取空了为止，例如：

```@raw html
<!--
  * [`take!`](@ref) and [`fetch`](@ref) (which retrieves but does not remove the value) on a closed
    channel successfully return any existing values until it is emptied. Continuing the above example:
-->
```

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

`Channel`可以在`for`循环中遍历，此时，循环会一直运行知道`Channel`中有数据，遍历过程中会取遍加入到`Channel`中的所有值。一旦`Channel`关闭或者取空了，`for`循环就好终止。

```@raw html
<!--
A `Channel` can be used as an iterable object in a `for` loop, in which case the loop runs as
long as the `Channel` has data or is open. The loop variable takes on all values added to the
`Channel`. The `for` loop is terminated once the `Channel` is closed and emptied.
-->
```

例如，下面的`for`循环会等待新的数据：

```@raw html
<!--
For example, the following would cause the `for` loop to wait for more data:
-->
```

```julia-repl
julia> c = Channel{Int}(10);

julia> foreach(i->put!(c, i), 1:3) # add a few entries

julia> data = [i for i in c]
```

而下面的则会返回已经读取的数据：

```@raw html
<!--
while this will return after reading all data:
-->
```

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

考虑这样一个用channel做task之间通信的例子。首先，起4个task来处理一个`jobs` channel中的数据。`jobs`中的每个任务通过`job_id`来表示，然后每个task模拟读取一个`job_id`，然后随机等待一会儿，然后往一个`results`channel中写入一个Tuple，分别包含`job_id`和执行的时间，最后将结果打印出来：。

```@raw html
<!--
Consider a simple example using channels for inter-task communication. We start 4 tasks to process
data from a single `jobs` channel. Jobs, identified by an id (`job_id`), are written to the channel.
Each task in this simulation reads a `job_id`, waits for a random amount of time and writes back
a tuple of `job_id` and the simulated time to the results channel. Finally all the `results` are
printed out.
-->
```

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

当前版本的Julia会将所有task分发到一个操作系统的线程，因此，涉及IO的操作会从并行执行中获利，而计算密集型的task则会顺序地在单独这个线程上执行。未来Julia将支持在多个线程上调度task，从而让计算密集型task也能从并行计算中获利。

```@raw html
<!--
The current version of Julia multiplexes all tasks onto a single OS thread. Thus, while tasks
involving I/O operations benefit from parallel execution, compute bound tasks are effectively
executed sequentially on a single OS thread. Future versions of Julia may support scheduling of
tasks on multiple threads, in which case compute bound tasks will see benefits of parallel execution
too.
-->
```

## 远程引用和AbstractChannel

```@raw html
<!--
## Remote References and AbstractChannels
-->
```

远程引用通常指某种`AbstractChannel`的实现。

```@raw html
<!--
Remote references always refer to an implementation of an `AbstractChannel`.
-->
```

一个具体的`AbstractChannel`（有点像`Channel`）需要将[`put!`](@ref), [`take!`](@ref), [`fetch`](@ref), [`isready`](@ref) 和 [`wait`](@ref)都实现。通过[`Future`](@ref)引用的远程对象存储在一个`Channel{Any}(1)`中（容量为1，类型为`Any`）。

```@raw html
<!--
A concrete implementation of an `AbstractChannel` (like `Channel`), is required to implement
[`put!`](@ref), [`take!`](@ref), [`fetch`](@ref), [`isready`](@ref) and [`wait`](@ref).
The remote object referred to by a [`Future`](@ref) is stored in a `Channel{Any}(1)`, i.e., a
`Channel` of size 1 capable of holding objects of `Any` type.
-->
```

[`RemoteChannel`](@ref)可以被反复写入，可以指向任意大小和类型的channel（或者是任意`AbstractChannel`的实现）。

```@raw html
<!--
[`RemoteChannel`](@ref), which is rewritable, can point to any type and size of channels, or any
other implementation of an `AbstractChannel`.
-->
```

`RemoteChannel(f::Function, pid)()`构造器可以构造一些引用，而这些引用指向的channel可以容纳多个某种具体类型的数据。其中`f`是将要在`pid`上执行的函数，其返回值必须是`AbstractChannel`类型。

```@raw html
<!--
The constructor `RemoteChannel(f::Function, pid)()` allows us to construct references to channels
holding more than one value of a specific type. `f` is a function executed on `pid` and it must
return an `AbstractChannel`.
-->
```

例如，`RemoteChannel(()->Channel{Int}(10), pid)`会创建一个channel，其类型是`Int`，容量是10，这个channel存在于`pid`进程中。

```@raw html
<!--
For example, `RemoteChannel(()->Channel{Int}(10), pid)`, will return a reference to a channel
of type `Int` and size 10. The channel exists on worker `pid`.
-->
```

针对[`RemoteChannel`](@ref)的[`put!`](@ref), [`take!`](@ref), [`fetch`](@ref), [`isready`](@ref) 和 [`wait`](@ref)方法会被重定向到其底层存储着channel的进程。

```@raw html
<!--
Methods [`put!`](@ref), [`take!`](@ref), [`fetch`](@ref), [`isready`](@ref) and [`wait`](@ref)
on a [`RemoteChannel`](@ref) are proxied onto the backing store on the remote process.
-->
```

因此，[`RemoteChannel`](@ref)可以用来引用用户自定义的`AbstractChannel`对象。在[Examples repository](https://github.com/JuliaArchive/Examples)中的`dictchannel.jl`文件中有一个简单的例子，其中使用了一个字典用于远端存储。

```@raw html
<!--
[`RemoteChannel`](@ref) can thus be used to refer to user implemented `AbstractChannel` objects.
A simple example of this is provided in `dictchannel.jl` in the
[Examples repository](https://github.com/JuliaArchive/Examples), which uses a dictionary as its
remote store.
-->
```

## Channel 和 RemoteChannel

```@raw html
<!--
## Channels and RemoteChannels
-->
```

  * 一个[`Channel`](@ref)仅对局部的进程可见，worker 2无法直接访问worker 3上的`Channel`，反之亦如此。不过[`RemoteChannel`](@ref)可以跨worker获取和写入数据。
  * [`RemoteChannel`](@ref)可以看作是对`Channel`的封装。
  * [`RemoteChannel`](@ref)的`pid`就是其封装的channel所在的进程id。
  * 任意拥有[`RemoteChannel`](@ref)引用的进程都可以对其进行读写，数据会自动发送到[`RemoteChannel`](@ref)底层channel的进程（或从中获取数据）
  * 序列化`Channel`会将其中的所有数据也都序列化，因此反序列化的时候也就可以得到一个原始数据的拷贝。
  * 不过，对[`RemoteChannel`](@ref)的序列化则只会序列化其底层指向的channel的id，因此反序列化之后得到的对象仍然会指向之前存储的对象。


```@raw html
<!--
  * A [`Channel`](@ref) is local to a process. Worker 2 cannot directly refer to a `Channel` on worker 3 and
    vice-versa. A [`RemoteChannel`](@ref), however, can put and take values across workers.
  * A [`RemoteChannel`](@ref) can be thought of as a *handle* to a `Channel`.
  * The process id, `pid`, associated with a [`RemoteChannel`](@ref) identifies the process where
    the backing store, i.e., the backing `Channel` exists.
  * Any process with a reference to a [`RemoteChannel`](@ref) can put and take items from the channel.
    Data is automatically sent to (or retrieved from) the process a [`RemoteChannel`](@ref) is associated
    with.
  * Serializing  a `Channel` also serializes any data present in the channel. Deserializing it therefore
    effectively makes a copy of the original object.
  * On the other hand, serializing a [`RemoteChannel`](@ref) only involves the serialization of an
    identifier that identifies the location and instance of `Channel` referred to by the handle. A
    deserialized [`RemoteChannel`](@ref) object (on any worker), therefore also points to the same
    backing store as the original.
-->
```

前面channel的例子可以稍作修改之后，用于进程之间的通信，具体看下面的例子。

```@raw html
<!--
The channels example from above can be modified for interprocess communication,
as shown below.
-->
```

首先，起4个worker进程处理同一个remote channel `jobs`，其中的每个job都有一个对应的`job_id`，然后每个task读取一个`job_id`，然后模拟随机等待一段时间，然后往存储结果的`RemoteChannel`中写入一个Tuple对象，其中包含`job_id`和等待的时间。最后将结果打印出来。

```@raw html
<!--
We start 4 workers to process a single `jobs` remote channel. Jobs, identified by an id (`job_id`),
are written to the channel. Each remotely executing task in this simulation reads a `job_id`,
waits for a random amount of time and writes back a tuple of `job_id`, time taken and its own
`pid` to the results channel. Finally all the `results` are printed out on the master process.
-->
```

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

## 远程调用和分布式垃圾回收

```@raw html
<!--
## Remote References and Distributed Garbage Collection
-->
```

远程引用所指向的对象可以在其所有引用都被集群删除之后被释放掉。

```@raw html
<!--
Objects referred to by remote references can be freed only when *all* held references
in the cluster are deleted.
-->
```

存储具体值的节点会记录哪些worker已经引用了它。每当某个[`RemoteChannel`](@ref)或某个（还没被获取的）[`Future`](@ref)序列化到一个worker中时，会通知相应的节点。而且每当某个[`RemoteChannel`](@ref)或某个（还没被获取的）[`Future`](@ref)被本地的垃圾回收器回收的时候，相应的节点也会收到通知。所有这些都是通过一个集群内部序列化器实现的，而所有的远程引用都只有在运行中的集群才有效，目前序列化和反序列化到`IO`暂时还不支持。

```@raw html
<!--
The node where the value is stored keeps track of which of the workers have a reference to it.
Every time a [`RemoteChannel`](@ref) or a (unfetched) [`Future`](@ref) is serialized to a worker,
the node pointed to by the reference is notified. And every time a [`RemoteChannel`](@ref) or
a (unfetched) [`Future`](@ref) is garbage collected locally, the node owning the value is again
notified. This is implemented in an internal cluster aware serializer. Remote references are only
valid in the context of a running cluster. Serializing and deserializing references to and from
regular `IO` objects is not supported.
-->
```

上面说到的**通知**都是通过发送"跟踪"信息来实现的，当一个引用被序列化的时候，就会发送"添加引用"的信息，而一个引用被本地的垃圾回收器回收的时候，就会发送一个"删除引用"的信息。

```@raw html
<!--
The notifications are done via sending of "tracking" messages--an "add reference" message when
a reference is serialized to a different process and a "delete reference" message when a reference
is locally garbage collected.
-->
```

由于[`Future`](@ref)是一次写入然后换成在本地，因此[`fetch`](@ref)一个[`Future`](@ref)会向拥有该值的节点发送更新引用的跟踪信息。

```@raw html
<!--
Since [`Future`](@ref)s are write-once and cached locally, the act of [`fetch`](@ref)ing a
[`Future`](@ref) also updates reference tracking information on the node owning the value.
-->
```

一旦指向某个值的引用都被删除了，对应的节点会将其释放。

```@raw html
<!--
The node which owns the value frees it once all references to it are cleared.
-->
```

对于[`Future`](@ref)来说，序列化一个已经获取了值的[`Future`](@ref)到另外一个节点时，会将其值也一并序列化过去，因为原始的远端的值可能已经被回收释放了。

```@raw html
<!--
With [`Future`](@ref)s, serializing an already fetched [`Future`](@ref) to a different node also
sends the value since the original remote store may have collected the value by this time.
-->
```

此外需要注意的是，本地的垃圾回收到底发生在什么时候取决于具体对象的大小以及当时系统的内存压力。

```@raw html
<!--
It is important to note that *when* an object is locally garbage collected depends on the size
of the object and the current memory pressure in the system.
-->
```

对于远端引用，其引用本身的大小很小，不过在远端节点存储着的值可能相当大。由于本地的对象并不会立即被回收，于是一个比较好的做法是，对本地的[`RemoteChannel`](@ref)或者是还没获取值的[`Future`](@ref)执行[`finalize`](@ref)。对于已经获取了值的[`Future`](@ref)来说，由于已经在调用[`fetch`](@ref)的时候已经将引用删除了，因此就不必再[`finalize`](@ref)了。显式地调用[`finalize`](@ref)会立即向远端节点发送信息并删除其引用。

```@raw html
<!--
In case of remote references, the size of the local reference object is quite small, while the
value stored on the remote node may be quite large. Since the local object may not be collected
immediately, it is a good practice to explicitly call [`finalize`](@ref) on local instances
of a [`RemoteChannel`](@ref), or on unfetched [`Future`](@ref)s. Since calling [`fetch`](@ref)
on a [`Future`](@ref) also removes its reference from the remote store, this is not required on
fetched [`Future`](@ref)s. Explicitly calling [`finalize`](@ref) results in an immediate message
sent to the remote node to go ahead and remove its reference to the value.
-->
```

一旦执行了finalize之后，引用就不可用了。

```@raw html
<!--
Once finalized, a reference becomes invalid and cannot be used in any further calls.
-->
```

## [共享数组](@id man-shared-arrays)

```@raw html
<!--
## [Shared Arrays](@id man-shared-arrays)
-->
```

共享数组使用系统共享内存将数组映射到多个进程上，尽管和[`DArray`](https://github.com/JuliaParallel/DistributedArrays.jl)有点像，但其实际表现有很大不同。在[`DArray`](https://github.com/JuliaParallel/DistributedArrays.jl)中，每个进程可以访问数据中的一块，但任意两个进程都不能共享同一块数据，而对于[`SharedArray`](@ref)，每个进程都可以访问整个数组。如果你想在一台机器上，让一大块数据能够被多个进程访问到，那么[`SharedArray`](@ref)是个不错的选择。

```@raw html
<!--
Shared Arrays use system shared memory to map the same array across many processes. While there
are some similarities to a [`DArray`](https://github.com/JuliaParallel/DistributedArrays.jl), the
behavior of a [`SharedArray`](@ref) is quite different. In a [`DArray`](https://github.com/JuliaParallel/DistributedArrays.jl),
each process has local access to just a chunk of the data, and no two processes share the same
chunk; in contrast, in a [`SharedArray`](@ref) each "participating" process has access to the
entire array.  A [`SharedArray`](@ref) is a good choice when you want to have a large amount of
data jointly accessible to two or more processes on the same machine.
-->
```

共享数组由`SharedArray`提供，必须在所有相关的worker中都显式地加载。

```@raw html
<!--
Shared Array support is available via module `SharedArrays` which must be explicitly loaded on
all participating workers.
-->
```

对[`SharedArray`](@ref)索引（访问和复制）操作就跟普通的数组一样，由于底层的内存对本地的进程是可见的，索引的效率很高，因此大多数单进程上的算法对[`SharedArray`](@ref)来说都是适用的，除非某些算法必须使用[`Array`](@ref)类型（此时可以通过调用[`sdata`](@ref)来获取[`SharedArray`](@ref)数组）。对于其它类型的`AbstractArray`类型数组来说，[`sdata`](@ref)仅仅会返回数组本身，因此，可以放心地使用[`sdata`](@ref)对任意类型的`Array`进行操作。

```@raw html
<!--
[`SharedArray`](@ref) indexing (assignment and accessing values) works just as with regular arrays,
and is efficient because the underlying memory is available to the local process. Therefore,
most algorithms work naturally on [`SharedArray`](@ref)s, albeit in single-process mode. In cases
where an algorithm insists on an [`Array`](@ref) input, the underlying array can be retrieved
from a [`SharedArray`](@ref) by calling [`sdata`](@ref). For other `AbstractArray` types, [`sdata`](@ref)
just returns the object itself, so it's safe to use [`sdata`](@ref) on any `Array`-type object.
-->
```

共享数组可以通过以下形式构造:

```@raw html
<!--
The constructor for a shared array is of the form:
-->
```

```julia
SharedArray{T,N}(dims::NTuple; init=false, pids=Int[])
```

上面的代码会创建一个N维，类型为`T`，大小为`dims`的共享数组，通过`pids`指定可见的进程。与分布式数组不同的是，只有通过`pids`指定的worker才可见。

```@raw html
<!--
which creates an `N`-dimensional shared array of a bits type `T` and size `dims` across the processes specified
by `pids`. Unlike distributed arrays, a shared array is accessible only from those participating
workers specified by the `pids` named argument (and the creating process too, if it is on the
same host).
-->
```

如果提供了一个类型为`initfn(S::SharedArray)`的`init`函数，那么所有相关的worker都会调用它。你可以让每个worker都在共享数组不同的地方执行`init`函数，从而实现并行初始化。

```@raw html
<!--
If an `init` function, of signature `initfn(S::SharedArray)`, is specified, it is called on all
the participating workers. You can specify that each worker runs the `init` function on a distinct
portion of the array, thereby parallelizing initialization.
-->
```

下面是个例子：

```@raw html
<!--
Here's a brief example:
-->
```

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

[`SharedArrays.localindices`](@ref)提供了一个以为的切片，可以很方便地用来将task分配到各个进程上。当然你可以按你想要的方式做区分：

```@raw html
<!--
[`SharedArrays.localindices`](@ref) provides disjoint one-dimensional ranges of indices, and is sometimes
convenient for splitting up tasks among processes. You can, of course, divide the work any way
you wish:
-->
```

```julia-repl
julia> S = SharedArray{Int,2}((3,4), init = S -> S[indexpids(S):length(procs(S)):length(S)] = myid())
3×4 SharedArray{Int64,2}:
 2  2  2  2
 3  3  3  3
 4  4  4  4
```

由于所有的进程都能够访问底层的数据，因此一定要小心避免出现冲突：

```@raw html
<!--
Since all processes have access to the underlying data, you do have to be careful not to set up
conflicts. For example:
-->
```

```julia
@sync begin
    for p in procs(S)
        @async begin
            remotecall_wait(fill!, p, S, p)
        end
    end
end
```

上面的代码会导致不确定的结果，因为每个进程都将**整个**数组赋值为其`pid`，从而导致最后一个执行完成的进程会保留其`pid`。

```@raw html
<!--
would result in undefined behavior. Because each process fills the *entire* array with its own
`pid`, whichever process is the last to execute (for any particular element of `S`) will have
its `pid` retained.
-->
```

考虑更复杂的一种情况：

```@raw html
<!--
As a more extended and complex example, consider running the following "kernel" in parallel:
-->
```

```julia
q[i,j,t+1] = q[i,j,t] + u[i,j,t]
```

这个例子中，如果首先将任务用按照一维的索引作区分，那么就会出问题：如果`q[i,j,t]`位于分配给某个worker的最后一个位置，而`q[i,j,t+1]`位于下一个worker的开始位置，那么后面这个worker开始计算的时候，可能`q[i,j,t]`还没有准备好，这时候，更好的做法是，手动分区，比如可以定义一个函数，按照`(irange,jrange)`给每个worker分配任务。

```@raw html
<!--
In this case, if we try to split up the work using a one-dimensional index, we are likely to run
into trouble: if `q[i,j,t]` is near the end of the block assigned to one worker and `q[i,j,t+1]`
is near the beginning of the block assigned to another, it's very likely that `q[i,j,t]` will
not be ready at the time it's needed for computing `q[i,j,t+1]`. In such cases, one is better
off chunking the array manually. Let's split along the second dimension.
Define a function that returns the `(irange, jrange)` indices assigned to this worker:
-->
```

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

```@raw html
<!--
Next, define the kernel:
-->
```

```julia-repl
julia> @everywhere function advection_chunk!(q, u, irange, jrange, trange)
           @show (irange, jrange, trange)  # display so we can see what's happening
           for t in trange, j in jrange, i in irange
               q[i,j,t+1] = q[i,j,t] + u[i,j,t]
           end
           q
       end
```

然后定义一个wrapper：

```@raw html
<!--
We also define a convenience wrapper for a `SharedArray` implementation
-->
```

```julia-repl
julia> @everywhere advection_shared_chunk!(q, u) =
           advection_chunk!(q, u, myrange(q)..., 1:size(q,3)-1)
```

接下来，比较三个不同的版本，第一个是单进程版本：

```@raw html
<!--
Now let's compare three different versions, one that runs in a single process:
-->
```

```julia-repl
julia> advection_serial!(q, u) = advection_chunk!(q, u, 1:size(q,1), 1:size(q,2), 1:size(q,3)-1);
```

然后是使用[`@distributed`](@ref):

```@raw html
<!--
one that uses [`@distributed`](@ref):
-->
```

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

```@raw html
<!--
and one that delegates in chunks:
-->
```

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

如果创建好了`SharedArray`之后，计算这些函数的执行时间，那么可以得到以下结果（用`julia -p 4`启动）：

```@raw html
<!--
If we create `SharedArray`s and time these functions, we get the following results (with `julia -p 4`):
-->
```

```julia-repl
julia> q = SharedArray{Float64,3}((500,500,500));

julia> u = SharedArray{Float64,3}((500,500,500));
```

先执行一次以便JIT编译，然后用[`@time`](@ref)宏测试其第二次执行的时间：

```@raw html
<!--
Run the functions once to JIT-compile and [`@time`](@ref) them on the second run:
-->
```

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

这里`advection_shared!`最大的优势在于，最小程度地降低了woker之间的通信，从而让每个worker能针对被分配的部分持续地计算一段时间。

```@raw html
<!--
The biggest advantage of `advection_shared!` is that it minimizes traffic among the workers, allowing
each to compute for an extended time on the assigned piece.
-->
```

## 共享数组与分布式垃圾回收

```@raw html
<!--
## Shared Arrays and Distributed Garbage Collection
-->
```

和远程引用一样，共享数组也依赖于创建节点上的垃圾回收来释放所有参与的worker上的引用。因此，创建大量生命周期比较短的数组，并尽可能快地显式finilize这些对象，代码会更高效，这样与之对用的内存和文件句柄都会更快地释放。

```@raw html
<!--
Like remote references, shared arrays are also dependent on garbage collection on the creating
node to release references from all participating workers. Code which creates many short lived
shared array objects would benefit from explicitly finalizing these objects as soon as possible.
This results in both memory and file handles mapping the shared segment being released sooner.
-->
```

## 集群管理器（ClusterManagers）

```@raw html
<!--
## ClusterManagers
-->
```

Julia通过集群管理器实现对多个进程（所构成的逻辑上的集群）的启动，管理以及网络通信。一个`ClusterManager`负责：

  * 在一个集群环境中启动worker进程
  * 管理每个worker生命周期内的事件
  * （可选），提供数据传输

```@raw html
<!--
The launching, management and networking of Julia processes into a logical cluster is done via
cluster managers. A `ClusterManager` is responsible for
-->
```

```@raw html
<!--
  * launching worker processes in a cluster environment
  * managing events during the lifetime of each worker
  * optionally, providing data transport
-->
```

一个Julia集群由以下特点：

  * 初始进程，称为`master`,其`id`为1
  * 只有master进程可以增加或删除worker进程
  * 所有进程之间都可以直接通信

```@raw html
<!--
A Julia cluster has the following characteristics:
-->
```

```@raw html
<!--
  * The initial Julia process, also called the `master`, is special and has an `id` of 1.
  * Only the `master` process can add or remove worker processes.
  * All processes can directly communicate with each other.
-->
```

worker之间的连接（用的时内置的TCP/IP传输）按照以下方式进行：
  
  * master进程对一个`ClusterManager`对象调用[`addprocs`](@ref)
  * [`addprocs`](@ref)调用对应的[`launch`](@ref)方法，然后在对应的机器上启动相应数量的worker进程
  * 每个worker监听一个端口，然后将其host和port信息传给[`stdout`](@ref)
  * 集群管理器捕获[`stdout`](@ref)中每个worker的信息，并提供给master进程
  * master进程解析信息并与相应的worker建立TCP/IP连接
  * 每个worker都会被通知集群中的其它worker
  * 每个worker与`id`小于自己的worker连接
  * 这样，一个网络就建立了，从而，每个worker都可以与其它worker建立连接

```@raw html
<!--
Connections between workers (using the in-built TCP/IP transport) is established in the following
manner:
-->
```

```@raw html
<!--
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
-->
```

尽管默认的传输层使用的时[`TCPSocket`](@ref)，对于一个自定义的集群管理器来说，完全可以使用其它传输方式。

```@raw html
<!--
While the default transport layer uses plain [`TCPSocket`](@ref), it is possible for a Julia cluster to
provide its own transport.
-->
```

Julia提供了两种内置的集群管理器：

```@raw html
<!--
Julia provides two in-built cluster managers:
-->
```

  * `LocalManager`, 调用[`addprocs()`](@ref) 或 [`addprocs(np::Integer)`](@ref)时会用到。
  * `SSHManager`，调用[`addprocs(hostnames::Array)`](@ref)时，传递一个hostnames的列表。

```@raw html
<!--
  * `LocalManager`, used when [`addprocs()`](@ref) or [`addprocs(np::Integer)`](@ref) are called
  * `SSHManager`, used when [`addprocs(hostnames::Array)`](@ref) is called with a list of hostnames
-->
```

`LocalManager`用来在同一个host上启动多个worker，从而利用多核/多处理器硬件。

```@raw html
<!--
`LocalManager` is used to launch additional workers on the same host, thereby leveraging multi-core
and multi-processor hardware.
-->
```

因此，一个最小的集群管理器需要：

 * 是一个`ClusterManager`抽象类的一个子类
 * 实现[`launch`](@ref)接口，用来启动新的worker
 * 实现[`manage`](@ref)，在一个worker的生命周期中多次被调用（例如，发送中断信号）

```@raw html
<!--
Thus, a minimal cluster manager would need to:
-->
```

```@raw html
<!--
  * be a subtype of the abstract `ClusterManager`
  * implement [`launch`](@ref), a method responsible for launching new workers
  * implement [`manage`](@ref), which is called at various events during a worker's lifetime (for
    example, sending an interrupt signal)
-->
```

[`addprocs(manager::FooManager)`](@ref addprocs) 需要 `FooManager` 实现：

```@raw html
<!--
[`addprocs(manager::FooManager)`](@ref addprocs) requires `FooManager` to implement:
-->
```

```julia
function launch(manager::FooManager, params::Dict, launched::Array, c::Condition)
    [...]
end

function manage(manager::FooManager, id::Integer, config::WorkerConfig, op::Symbol)
    [...]
end
```

作为一个例子，我们来看下`LocalManager`是怎么实现的：

```@raw html
<!--
As an example let us see how the `LocalManager`, the manager responsible for starting workers
on the same host, is implemented:
-->
```

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

[`launch`](@ref)方法接收以下参数：

```@raw html
<!--
The [`launch`](@ref) method takes the following arguments:
-->
```

  * `manager::ClusterManager`: 调用[`addprocs`](@ref)时所用到的集群管理器
  * `params::Dict`: 所有的关键字参数都会传递到[`addprocs`](@ref)中
  * `launched::Array`: 用来存储一个或多个`WorkerConfig`
  * `c::Condition`: 在workers启动后被通知的条件变量

```@raw html
<!--
  * `manager::ClusterManager`: the cluster manager that [`addprocs`](@ref) is called with
  * `params::Dict`: all the keyword arguments passed to [`addprocs`](@ref)
  * `launched::Array`: the array to append one or more `WorkerConfig` objects to
  * `c::Condition`: the condition variable to be notified as and when workers are launched
-->
```

[`launch`](@ref)会在一个异步的task中调用，该task结束之后，意味着所有请求的worker都已经启动好了。因此，[`launch`](@ref)函数**必须**在所有worker启动之后，尽快退出。

```@raw html
<!--
The [`launch`](@ref) method is called asynchronously in a separate task. The termination of
this task signals that all requested workers have been launched. Hence the [`launch`](@ref)
function MUST exit as soon as all the requested workers have been launched.
-->
```

新启动的worker之间采用的是多对多的连接方式。在命令行中指定参数`--worker[=<cookie>]`会让所有启动的进程把自己当作worker，然后通过TCP/IP构建连接。

```@raw html
<!--
Newly launched workers are connected to each other and the master process in an all-to-all manner.
Specifying the command line argument `--worker[=<cookie>]` results in the launched processes
initializing themselves as workers and connections being set up via TCP/IP sockets.
-->
```

集群中所有的worker默认使用同一个master的[cookie](@ref man-cluster-cookie)。如果cookie没有指定，（比如没有通过`--worker`指定），那么worker会尝试从它的标准输入中读取。`LocalManager`和`SSHManager`都是通过标准输入来将cookie传递给新启动的worker。

```@raw html
<!--
All workers in a cluster share the same [cookie](@ref man-cluster-cookie) as the master. When the cookie is
unspecified, i.e, with the `--worker` option, the worker tries to read it from its standard input.
 `LocalManager` and `SSHManager` both pass the cookie to newly launched workers via their
 standard inputs.
-->
```

默认情况下，一个worker会监听从[`getipaddr()`](@ref)函数返回的地址上的一个开放端口。若要指定监听的地址，可以通过额外的参数`--bind-to bind_addr[:port]`指定，这对于多host的情况来说很方便。

```@raw html
<!--
By default a worker will listen on a free port at the address returned by a call to [`getipaddr()`](@ref).
A specific address to listen on may be specified by optional argument `--bind-to bind_addr[:port]`.
This is useful for multi-homed hosts.
-->
```

对于非TCP/IP传输，可以选择MPI作为一种实现，此时一定**不要**指定`--worker`参数，另外，新启动的worker必须调用`init_worker(cookie)`之后再使用并行的结构体。

```@raw html
<!--
As an example of a non-TCP/IP transport, an implementation may choose to use MPI, in which case
`--worker` must NOT be specified. Instead, newly launched workers should call `init_worker(cookie)`
before using any of the parallel constructs.
-->
```

对于每个已经启动的worker，[`launch`](@ref)方法必须往`launched`中添加一个`WorkerConfig`对象（相应的值已经初始化）。

```@raw html
<!--
For every worker launched, the [`launch`](@ref) method must add a `WorkerConfig` object (with
appropriate fields initialized) to `launched`
-->
```

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

`WorkerConfig`中的大多数字段都是内置的集群管理器会用到，对于自定义的管理器，通常只需要指定`io`或`host`/`port`:

```@raw html
<!--
Most of the fields in `WorkerConfig` are used by the inbuilt managers. Custom cluster managers
would typically specify only `io` or `host` / `port`:
-->
```

  * 如果指定了`io`，那么就会用来读取host/port信息。每个worker会在启动时打印地址和端口，这样worker就可以自由监听可用的端口，而不必手动配置worker的端口。
  * 如果`io`没有指定，那么`host`和`port`就会用来连接。
  * `count`， `exename`和`exeflags`用于从一个worker上启动额外的worker。例如，一个集群管理器可能对每个节点都只启动一个worker，然后再用它来启动额外的worker。
    * `count` 可以是一个整数`n`，用来指定启动`n`个worker
    * `count` 还可以是`:auto`，用来启动跟那台机器上CPU个数（逻辑上的核的个数）相同的worker
    * `exename`是`julia`可执行文件的全路径
    * `exeflags`应该设置成传递给将要启动的worker命令行参数
  * `tunnel`, `bind_addr`, `sshflags`和`max_parallel`会在从worker与master进程建立ssh隧道时用到
  * `userdata`用来提供给自定义集群管理器存储自己的worker相关的信息

```@raw html
<!--
  * If `io` is specified, it is used to read host/port information. A Julia worker prints out its
    bind address and port at startup. This allows Julia workers to listen on any free port available
    instead of requiring worker ports to be configured manually.
  * If `io` is not specified, `host` and `port` are used to connect.
  * `count`, `exename` and `exeflags` are relevant for launching additional workers from a worker.
    For example, a cluster manager may launch a single worker per node, and use that to launch additional
    workers.
-->
```

```@raw html
<!--
      * `count` with an integer value `n` will launch a total of `n` workers.
      * `count` with a value of `:auto` will launch as many workers as the number of CPU threads (logical cores) on that machine.
      * `exename` is the name of the `julia` executable including the full path.
      * `exeflags` should be set to the required command line arguments for new workers.
  * `tunnel`, `bind_addr`, `sshflags` and `max_parallel` are used when a ssh tunnel is required to
    connect to the workers from the master process.
  * `userdata` is provided for custom cluster managers to store their own worker-specific information.
-->
```

`manage(manager::FooManager, id::Integer, config::WorkerConfig, op::Symbol)`会在一个worker生命周期中的不同时刻被调用，其中op的值可能是：

```@raw html
<!--
`manage(manager::FooManager, id::Integer, config::WorkerConfig, op::Symbol)` is called at different
times during the worker's lifetime with appropriate `op` values:
-->
```

  * `:register`/`:deregister`，从Julia的worker池子中添加/删除一个worker
  * `:interrupt`，当`interrupt(workers)`被调用是，此时，`ClusterManager`应该给相应的worker发送终端信号
  * `:finalize`，用于清理操作。

```@raw html
<!--
  * with `:register`/`:deregister` when a worker is added / removed from the Julia worker pool.
  * with `:interrupt` when `interrupt(workers)` is called. The `ClusterManager` should signal the
    appropriate worker with an interrupt signal.
  * with `:finalize` for cleanup purposes.
-->
```

## 自定义集群管理器的传输方式

```@raw html
<!--
## Cluster Managers with Custom Transports
-->
```

将默认的 TCP/IP 多对多 socket 连接替换成一个自定义的传输层需要做很多工作。每个Julia进程都有与其连接的worker数量相同的通信task。例如，在一个有32个进程的多对多集群中：

```@raw html
<!--
Replacing the default TCP/IP all-to-all socket connections with a custom transport layer is a
little more involved. Each Julia process has as many communication tasks as the workers it is
connected to. For example, consider a Julia cluster of 32 processes in an all-to-all mesh network:
-->
```

  * 每个进程都有31个通信task
  * 每个task在一个**消息处理循环**中从一个远端worker读取所有的输入信息
  * 每个消息处理循环等待一个`IO`对象（比如，在默认实现中是一个[`TCPSocket`](@ref)），然后读取整个信息，处理，等待下一个
  * 发送消息则可以直接在任意Julia task中完成，而不只是通信task，同样，也是通过相应的`IO`对象

```@raw html
<!--
  * Each Julia process thus has 31 communication tasks.
  * Each task handles all incoming messages from a single remote worker in a message-processing loop.
  * The message-processing loop waits on an `IO` object (for example, a [`TCPSocket`](@ref) in the default
    implementation), reads an entire message, processes it and waits for the next one.
  * Sending messages to a process is done directly from any Julia task--not just communication tasks--again,
    via the appropriate `IO` object.
-->
```

要替换默认的传输方式，需要新的实现能够在远程worker之间建立连接，同时提供一个可以用来被消息处理循环等待的`IO`对象。集群管理器的回调函数需要实现如下函数：

```@raw html
<!--
Replacing the default transport requires the new implementation to set up connections to remote
workers and to provide appropriate `IO` objects that the message-processing loops can wait on.
The manager-specific callbacks to be implemented are:
-->
```

```julia
connect(manager::FooManager, pid::Integer, config::WorkerConfig)
kill(manager::FooManager, pid::Int, config::WorkerConfig)
```

默认的实现（使用的是TCP/IP socket）是`connect(manager::ClusterManager, pid::Integer, config::WorkerConfig)`。

```@raw html
<!--
The default implementation (which uses TCP/IP sockets) is implemented as `connect(manager::ClusterManager, pid::Integer, config::WorkerConfig)`.
-->
```

`connect`需要返回一对`IO`对象，一个用于从`pid`worker读取数据，另一个用于往`pid`写数据。自定义的集群管理器可以用内存中的`BUfferStream`作为一个管道将自定义的（很可能是非`IO`的）传输与Julia内置的并行基础设施衔接起来。

```@raw html
<!--
`connect` should return a pair of `IO` objects, one for reading data sent from worker `pid`, and
the other to write data that needs to be sent to worker `pid`. Custom cluster managers can use
an in-memory `BufferStream` as the plumbing to proxy data between the custom, possibly non-`IO`
transport and Julia's in-built parallel infrastructure.
-->
```

`BufferStream`是一个内存中的[`IOBuffer`](@ref)，其表现很像`IO`，就是一个**流**（stream），可以异步地处理。

```@raw html
<!--
A `BufferStream` is an in-memory [`IOBuffer`](@ref) which behaves like an `IO`--it is a stream which can
be handled asynchronously.
-->
```

在[Examples repository](https://github.com/JuliaArchive/Examples)的`clustermanager/0mq`目录中，包含一个使用ZeroMQ连接Julia worker的例子，用的是星型拓补结构。需要注意的是：Julia的进程仍然是**逻辑上**相互连接的，任意worker都可以与其它worker直接相连而无需感知到0MQ作为传输层的存在。

```@raw html
<!--
The folder `clustermanager/0mq` in the [Examples repository](https://github.com/JuliaArchive/Examples)
contains an example of using ZeroMQ to connect Julia workers
in a star topology with a 0MQ broker in the middle. Note: The Julia processes are still all *logically*
connected to each other--any worker can message any other worker directly without any awareness
of 0MQ being used as the transport layer.
-->
```

在使用自定义传输的时候：

  * Julia的workers必须**不能**通过`--worker`启动。如果启动的时候使用了`--worker`，那么新启动的worker会默认使用基于TCP/IP socket的实现
  * 对于每个worker逻辑上的输入连接，必须调用`Base.process_messages(rd::IO, wr::IO)()`，这会创建一个新的task来处理worker消息的读写
  * `init_worker(cookie, manager::FooManager)`必须作为worker进程初始化的一部分呢被调用
  * `WorkerConfig`中的`connect_at::Any`字段可以被集群管理器在调用[`launch`](@ref)的时候设置，该字段的值会发送到所有的[`connect`](@ref)回调中。通常，其中包含的是**如何连接到**一个worker的信息。例如，在TCP/IP socket传输中，用这个字段存储`(host, port)`来声明如何连接到一个worker。

```@raw html
<!--
When using custom transports:
-->
```

```@raw html
<!--
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
-->
```

`kill(manager, pid, config)`用来从一个集群中删除一个worker，在master进程中，对应的`IO`对象必须通过对应的实现来关闭，从而保证正确地释放资源。默认的实现简单地对指定的远端worker执行`exit()`即可。

```@raw html
<!--
`kill(manager, pid, config)` is called to remove a worker from the cluster. On the master process,
the corresponding `IO` objects must be closed by the implementation to ensure proper cleanup.
The default implementation simply executes an `exit()` call on the specified remote worker.
-->
```

在例子目录中，`clustermanager/simple`展示了一个简单地实现，使用的是UNIX下的socket。

```@raw html
<!--
The Examples folder `clustermanager/simple` is an example that shows a simple implementation using UNIX domain
sockets for cluster setup.
-->
```

## LocalManager和SSHManager的网络要求

```@raw html
<!--
## Network Requirements for LocalManager and SSHManager
-->
```

Julia集群设计的时候，默认是在一个安全的环境中执行，比如本地的笔记本，部门的集群，甚至是云端。这部分将介绍`LocalManager`和`SSHManager`的网络安全要点：

```@raw html
<!--
Julia clusters are designed to be executed on already secured environments on infrastructure such
as local laptops, departmental clusters, or even the cloud. This section covers network security
requirements for the inbuilt `LocalManager` and `SSHManager`:
-->
```

  * master进程不监听任何端口，它只负责向外连接worker
  * 每个worker都只绑定一个本地的接口，同时监听一个系统分配的临时端口
  * `addprocs(N)`使用的`LocalManager`，默认只会绑定到回环接口（loopback interface），这就意味着，之后在远程主机上（恶意）启动的worker无法连接到集群中，在执行`addprocs(4)`之后，又跟一个`addprocs(["remote_host"])`会失败。有些用户可能希望创建一个集群同时管理本地系统和几个远端系统，这可以通过在绑定`LocalManager`到外部网络接口的时候，指定一个`restrict`参数：`addprocs(4; restrict=false)`
  * `addprocs(list_of_remote_hosts)`使用的`SSHManager`，通过SSH在远程主机上启动worker，后续的master-worker，worker-worker之间的连接使用普通未加密的TCP/IP socket。远程主机必须开启无密码登陆，额外的ssh参数可以通过`sshflags`指定。
  * 如果想要通过SSH连接master-worker，那么用`addprocs(list_of_remote_hosts; tunnel=true, sshflags=<ssh keys and other flags>)`就可以很容易地实现。一个典型的应用场景是，本地的笔记本运行着Julia的REPL(也就是master)，其它的机器在云端（比方说Amazon的EC2），此时远端的机器只需要开放22端口，通过公钥认证即可（PKI）。认证信息可以通过`sshflags`配置，如 ```sshflags=`-e <keyfile>` ```
  在一个（默认的）多对多的拓补结构中，所有的worker通过TCP socket连接到其它worker，因而集群中节点的安全策略必须保证worker在某个端口范围内能自由连接（根据操作系统的不同会有所不同）。
  可以通过自定义`ClusterManager`实现worker-worker之间通信的加密和解密。

```@raw html
<!--
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
-->
```

```@raw html
<!--
    In an all-to-all topology (the default), all workers connect to each other via plain TCP sockets.
    The security policy on the cluster nodes must thus ensure free connectivity between workers for
    the ephemeral port range (varies by OS).
-->
```

```@raw html
<!--
    Securing and encrypting all worker-worker traffic (via SSH) or encrypting individual messages
    can be done via a custom `ClusterManager`.
-->
```

## [集群 Cookie](@id man-cluster-cookie)

```@raw html
<!--
## [Cluster Cookie](@id man-cluster-cookie)
-->
```

集群上所有的进程都共享同一个cookie，默认时master进程随机生成的字符串。

```@raw html
<!--
All processes in a cluster share the same cookie which, by default, is a randomly generated string
on the master process:
-->
```

  * [`cluster_cookie()`](@ref) 返回cookie，而`cluster_cookie(cookie)()`设置并返回新的cookie。
  * 所有的连接都进行双向认证，从而保证只有master启动的worker才能相互连接。
  * cookie可以在worker启动的时候，通过参数`--worker=<cookie>`指定，如果参数`--worker`没有指定cookie，那么worker会从它的标准输入中([`stdin`](@ref))读取，`stdin`会在cookie获取之后立即关闭。
  * `ClusterManager`可以通过[`cluster_cookie()`](@ref)从master中过去cookie，不适用默认TCP/IP传输的集群管理器（即没有指定`--worker`）必须用于master相同的cookie调用`init_worker(cookie, manager)`。

```@raw html
<!--
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
-->
```

注意，在对安全性要求很高的环境中，可以通过自定义`ClusterManager`实现。例如，cookie可以提前共享，然后不必再启动参数中指定。

```@raw html
<!--
Note that environments requiring higher levels of security can implement this via a custom `ClusterManager`.
For example, cookies can be pre-shared and hence not specified as a startup argument.
-->
```

## 指定网络拓补结构（实验性）

```@raw html
<!--
## Specifying Network Topology (Experimental)
-->
```

可以通过传递到`addprocs`中的参数`topology`来指定worker之间如何连接。

```@raw html
<!--
The keyword argument `topology` passed to `addprocs` is used to specify how the workers must be
connected to each other:
-->
```

  * `:all_to_all`,默认的，所有worker之间相互都连接
  * `:master_worker`,只有主进程，即`pid`为1的进程能够与worker建立连接
  * `:custom`: 集群管理器的`launch`方法通过`WorkerConfig`中的`ident`和`connect_idents`指定连接的拓补结构。一个worker通过集群管理器提供的`ident`来连接到所有`connect_idents`指定的worker。

```@raw html
<!--
  * `:all_to_all`, the default: all workers are connected to each other.
  * `:master_worker`: only the driver process, i.e. `pid` 1, has connections to the workers.
  * `:custom`: the `launch` method of the cluster manager specifies the connection topology via the
    fields `ident` and `connect_idents` in `WorkerConfig`. A worker with a cluster-manager-provided
    identity `ident` will connect to all workers specified in `connect_idents`.
-->
```

关键字参数`lazy=true|false`只会影响`topology`选项中的`:all_to_all`。如果是`true`，那么集群启动的时候master会连接所有的worker，然后worker之间的特定连接会在初次唤醒的是建立连接，这有利于降低集群初始化的时候对资源的分配。`lazy`的默认值是`true`。

```@raw html
<!--
Keyword argument `lazy=true|false` only affects `topology` option `:all_to_all`. If `true`, the cluster
starts off with the master connected to all workers. Specific worker-worker connections are established
at the first remote invocation between two workers. This helps in reducing initial resources allocated for
intra-cluster communication. Connections are setup depending on the runtime requirements of a parallel
program. Default value for `lazy` is `true`.
-->
```

目前，在没有建立连接的两个worker之间传递消息会出错，目前该行为是实验性的，未来的版本中可能会改变。

```@raw html
<!--
Currently, sending a message between unconnected workers results in an error. This behaviour,
as with the functionality and interface, should be considered experimental in nature and may change
in future releases.
-->
```

## 多线程（实验性）

```@raw html
<!--
## Multi-Threading (Experimental)
-->
```

除了task，远程调用，远程应用之外，Julia从`v0.5`开始就原生支持多线程。本部分内容是实验性的，未来相关接口可能会改变。

```@raw html
<!--
In addition to tasks, remote calls, and remote references, Julia from `v0.5` forwards natively
supports multi-threading. Note that this section is experimental and the interfaces may change
in the future.
-->
```

### 设置

```@raw html
<!--
### Setup
-->
```

Julia默认启动一个线程执行代码，这点可以通过[`Threads.nthreads()`](@ref)确认：

```@raw html
<!--
By default, Julia starts up with a single thread of execution. This can be verified by using the
command [`Threads.nthreads()`](@ref):
-->
```

```julia-repl
julia> Threads.nthreads()
1
```

Julia启动时的线程数可以通过环境变量`JULIA_NUM_THREADS`设置，下面启动4个线程：

```@raw html
<!--
The number of threads Julia starts up with is controlled by an environment variable called `JULIA_NUM_THREADS`.
Now, let's start up Julia with 4 threads:
-->
```

```bash
export JULIA_NUM_THREADS=4
```

(上面的代码只能在Linux和OSX系统中运行，如果你在以上平台中使用的是C shell，那么将`export`改成`set`，如果你是在Windows上运行，那么将`export`改成`set`同时启动julia时指定`julia.exe`的完整路径。)

```@raw html
<!--
(The above command works on bourne shells on Linux and OSX. Note that if you're using a C shell
on these platforms, you should use the keyword `set` instead of `export`. If you're on Windows,
start up the command line in the location of `julia.exe` and use `set` instead of `export`.)
-->
```

现在确认下确实有4个线程：

```@raw html
<!--
Let's verify there are 4 threads at our disposal.
-->
```

```julia-repl
julia> Threads.nthreads()
4
```

不过我们现在是在master线程，用[`Threads.threadid`](@ref)确认下：

```@raw html
<!--
But we are currently on the master thread. To check, we use the function [`Threads.threadid`](@ref)
-->
```

```julia-repl
julia> Threads.threadid()
1
```

### `@threads`宏

```@raw html
<!--
### The `@threads` Macro
-->
```

下面用一个简单的例子测试我们原生的线程，首先创建一个全零的数组：

```@raw html
<!--
Let's work a simple example using our native threads. Let us create an array of zeros:
-->
```

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

```@raw html
<!--
Let us operate on this array simultaneously using 4 threads. We'll have each thread write its
thread ID into each location.
-->
```

Julia用[`Threads.@threads`](@ref)宏实现并行循环，该宏加在`for`循环前面，提示Julia循环部分是一个多线程的区域：

```@raw html
<!--
Julia supports parallel loops using the [`Threads.@threads`](@ref) macro. This macro is affixed
in front of a `for` loop to indicate to Julia that the loop is a multi-threaded region:
-->
```

```julia-repl
julia> Threads.@threads for i = 1:10
           a[i] = Threads.threadid()
       end
```

每次迭代会分配到各个线程，然后每个线程往对应位置写入线程ID：

```@raw html
<!--
The iteration space is split amongst the threads, after which each thread writes its thread ID
to its assigned locations:
-->
```

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

注意[`Threads.@threads`](@ref)并没有一个像[`@distributed`](@ref)一样的可选的reduction参数。

```@raw html
<!--
Note that [`Threads.@threads`](@ref) does not have an optional reduction parameter like [`@distributed`](@ref).
-->
```

Julia支持访问和修改值的**原子**操作，即，以一种线程安全的方式来避免[竞态条件](https://en.wikipedia.org/wiki/Race_condition)。一个值（必须是基本类型的，primitive type）可以通过[`Threads.Atomic`](@ref)来包装起来从而支持原子操作。下面看个例子：

```@raw html
<!--
Julia supports accessing and modifying values *atomically*, that is, in a thread-safe way to avoid
[race conditions](https://en.wikipedia.org/wiki/Race_condition). A value (which must be of a primitive
type) can be wrapped as [`Threads.Atomic`](@ref) to indicate it must be accessed in this way.
Here we can see an example:
-->
```

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

如果不加`Atomic`的话，那么会因为竞态条件而得到错误的结果，下面是一个没有避免竞态条件的例子：

```@raw html
<!--
Had we tried to do the addition without the atomic tag, we might have gotten the
wrong answer due to a race condition. An example of what would happen if we didn't
avoid the race:
-->
```

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

!!! note
    并非**所有的**原始类型都能放在`Atomic`标签内封装起来，支持的类型有`Int8`, `Int16`, `Int32`, `Int64`, `Int128`, `UInt8`, `UInt16`, `UInt32`, `UInt64`, `UInt128`, `Float16`, `Float32`, 以及 `Float64`。此外，`Int128`和`UInt128`在AAarch32和ppc64le上不支持。

```@raw html
<!--
!!! note
    Not *all* primitive types can be wrapped in an `Atomic` tag. Supported types
    are `Int8`, `Int16`, `Int32`, `Int64`, `Int128`, `UInt8`, `UInt16`, `UInt32`,
    `UInt64`, `UInt128`, `Float16`, `Float32`, and `Float64`. Additionally,
    `Int128` and `UInt128` are not supported on AAarch32 and ppc64le.
-->
```

在使用多线程时，要非常小心使用了不纯的函数[pure function](https://en.wikipedia.org/wiki/Pure_function)，例如，用到了[以!结尾的函数](https://docs.julialang.org/en/latest/manual/style-guide/#Append-!-to-names-of-functions-that-modify-their-arguments-1)，通常这类函数会修改其参数，因而时不纯的。此外还有些函数没有以`!`结尾，其实也是有副作用的，比如[`findfirst(regex, str)`](@ref)就会改变`regex`参数，或者时[`rand()`](@ref)会修改`Base.GLOBAL_RNG`:

```@raw html
<!--
When using multi-threading we have to be careful when using functions that are not
[pure](https://en.wikipedia.org/wiki/Pure_function) as we might get a wrong answer.
For instance functions that have their
[name ending with `!`](https://docs.julialang.org/en/latest/manual/style-guide/#Append-!-to-names-of-functions-that-modify-their-arguments-1)
by convention modify their arguments and thus are not pure. However, there are
functions that have side effects and their name does not end with `!`. For
instance [`findfirst(regex, str)`](@ref) mutates its `regex` argument or
[`rand()`](@ref) changes `Base.GLOBAL_RNG` :
-->
```

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

julia> srand(1); g() # the result for a single thread is 1000
781
```

此时，应该重新设计代码来避免可能的竞态条件或者是使用[同步机制](https://docs.julialang.org/en/latest/base/multi-threading/#Synchronization-Primitives-1)。

```@raw html
<!--
In such cases one should redesign the code to avoid the possibility of a race condition or use
[synchronization primitives](https://docs.julialang.org/en/latest/base/multi-threading/#Synchronization-Primitives-1).
-->
```

例如，为了修正上面`findfirst`的例子，每个线程都要拷贝一份`rx`。

```@raw html
<!--
For example in order to fix `findfirst` example above one needs to have a
separate copy of `rx` variable for each thread:
-->
```

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

现在使用`Regex("1")`而不是`r"1"`来保证Julia对每个`rx`向量的元素都创建了一个`Regex`的对象。

```@raw html
<!--
We now use `Regex("1")` instead of `r"1"` to make sure that Julia
creates separate instances of `Regex` object for each entry of `rx` vector.
-->
```

`rand`的例子更复杂点，因为我们需要保证每个线程使用的是不重叠的随机数序列，这可以简单地通过`Future.randjump`函数保证：

```@raw html
<!--
The case of `rand` is a bit more complex as we have to ensure that each thread
uses non-overlapping pseudorandom number sequences. This can be simply ensured
by using the `Future.randjump` function:
-->
```

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

这里将`r`向量发送到`g_fix`，由于生成多个随机数是很昂贵的操作，因此我们不希望每次执行函数都重复该操作。

```@raw html
<!--
We pass `r` vector to `g_fix` as generating several RGNs is an expensive
operation so we do not want to repeat it every time we run the function.
-->
```

## @threadcall （实验性）

```@raw html
<!--
## @threadcall (Experimental)
-->
```

所有的I/O task，计时器，REPL命令等都是通过一个事件循环复用的一个系统线程。有一个补丁版的libuv([http://docs.libuv.org/en/v1.x/](http://docs.libuv.org/en/v1.x/))提供了该功能，从而在同一个系统线程上协调调度多个task。I/O task和计时器在等待某个事件发生时，会隐式地退出（yield），而显式地调用[`yield`](@ref)则会允许其它task被调度。

```@raw html
<!--
All I/O tasks, timers, REPL commands, etc are multiplexed onto a single OS thread via an event
loop. A patched version of libuv ([http://docs.libuv.org/en/v1.x/](http://docs.libuv.org/en/v1.x/))
provides this functionality. Yield points provide for co-operatively scheduling multiple tasks
onto the same OS thread. I/O tasks and timers yield implicitly while waiting for the event to
occur. Calling [`yield`](@ref) explicitly allows for other tasks to be scheduled.
-->
```

因此，一个执行[`ccall`](@ref)的task会阻止Julia的调度器执行其它task，直到调用返回，这种情况对于所有外部库的调用都存在，例外的情况是，某些自定义的C代码调用返回到了Julia中（此时有可能yield）或者C代码执行了`jl_yield()`（C中等价的[`yield`](@ref)）。

```@raw html
<!--
Thus, a task executing a [`ccall`](@ref) effectively prevents the Julia scheduler from executing any other
tasks till the call returns. This is true for all calls into external libraries. Exceptions are
calls into custom C code that call back into Julia (which may then yield) or C code that calls
`jl_yield()` (C equivalent of [`yield`](@ref)).
-->
```

注意，尽管Julia的代码默认是单线程的，但是Julia调用的库可能会用到其内部的多线程，例如，BLAS会在一台机器上使用尽可能多的线程。

```@raw html
<!--
Note that while Julia code runs on a single thread (by default), libraries used by Julia may launch
their own internal threads. For example, the BLAS library may start as many threads as there are
cores on a machine.
-->
```

[`@threadcall`](@ref)就是要解决[`ccall`](@ref)会卡住主线程的这个问题，它会在一个额外的线程中调度C函数的执行，有一个默认大小为4的线程库用来做这个事情，该线程库的大小可以通过环境变量`UV_THREADPOOL_SIZE`控制。在等待一个空闲线程，以及在函数执行过程中某个线程空闲下来时，（主线程的事件循环中）正在请求的task会yield到其它task，注意，`@threadcall`并不会返回，直到执行结束。从用户的角度来看，就是一个和其它Julia API一样会阻塞的模块。

```@raw html
<!--
The [`@threadcall`](@ref) macro addresses scenarios where we do not want a [`ccall`](@ref) to block the main Julia
event loop. It schedules a C function for execution in a separate thread. A threadpool with a
default size of 4 is used for this. The size of the threadpool is controlled via environment variable
`UV_THREADPOOL_SIZE`. While waiting for a free thread, and during function execution once a thread
is available, the requesting task (on the main Julia event loop) yields to other tasks. Note that
`@threadcall` does not return till the execution is complete. From a user point of view, it is
therefore a blocking call like other Julia APIs.
-->
```

非常关键的一点是，被调用的函数不会再调用回Julia。

```@raw html
<!--
It is very important that the called function does not call back into Julia.
-->
```

`@threadcall` 在Julia未来的版本中可能会被移除或改变。

```@raw html
<!--
`@threadcall` may be removed/changed in future versions of Julia.
-->
```

[^1]:
    在这里，MPI 指的是MPI-1标准。从MPI-2开始，MPI标准委员会引入了一种新的通信机制，统称远程内存访问(Remote Memory Access, RMA)。引入远程内存访问机制的目的是为了方便单向通信模式，更多信息可以访问最新的MPI标准[http://mpi-forum.org/docs](http://mpi-forum.org/docs/)

```@raw html
<!--
[^1]:
    In this context, MPI refers to the MPI-1 standard. Beginning with MPI-2, the MPI standards committee
    introduced a new set of communication mechanisms, collectively referred to as Remote Memory Access
    (RMA). The motivation for adding RMA to the MPI standard was to facilitate one-sided communication
    patterns. For additional information on the latest MPI standard, see [http://mpi-forum.org/docs](http://mpi-forum.org/docs/).
-->
```
