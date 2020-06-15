# 分布式计算

```@meta
DocTestSetup = :(using Distributed)
```

```@docs
Distributed.addprocs
Distributed.nprocs
Distributed.nworkers
Distributed.procs()
Distributed.procs(::Integer)
Distributed.workers
Distributed.rmprocs
Distributed.interrupt
Distributed.myid
Distributed.pmap
Distributed.RemoteException
Distributed.Future
Distributed.RemoteChannel
Distributed.wait
Distributed.fetch(::Any)
Distributed.remotecall(::Any, ::Integer, ::Any...)
Distributed.remotecall_wait(::Any, ::Integer, ::Any...)
Distributed.remotecall_fetch(::Any, ::Integer, ::Any...)
Distributed.remote_do(::Any, ::Integer, ::Any...)
Distributed.put!(::RemoteChannel, ::Any...)
Distributed.put!(::Future, ::Any)
Distributed.take!(::RemoteChannel, ::Any...)
Distributed.isready(::RemoteChannel, ::Any...)
Distributed.isready(::Future)
Distributed.WorkerPool
Distributed.CachingPool
Distributed.default_worker_pool
Distributed.clear!(::CachingPool)
Distributed.remote
Distributed.remotecall(::Any, ::AbstractWorkerPool, ::Any...)
Distributed.remotecall_wait(::Any, ::AbstractWorkerPool, ::Any...)
Distributed.remotecall_fetch(::Any, ::AbstractWorkerPool, ::Any...)
Distributed.remote_do(::Any, ::AbstractWorkerPool, ::Any...)
Distributed.timedwait
Distributed.@spawn
Distributed.@spawnat
Distributed.@fetch
Distributed.@fetchfrom
Distributed.@async
Distributed.@sync
Distributed.@distributed
Distributed.@everywhere
Distributed.clear!(::Any, ::Any; ::Any)
Distributed.remoteref_id
Distributed.channel_from_id
Distributed.worker_id_from_socket
Distributed.cluster_cookie()
Distributed.cluster_cookie(::Any)
```

## 集群管理接口

这个接口提供了一种在不同的集群上启动和管理 Julia 工作节点的机制。
Base 模块提供了两种类型的管理器：`Localmanager` 用于在同一台主机上启动额外的工作节点； `SSHManager` 用于通过 `ssh` 在远程主机上启动额外的工作节点。 TCP/IP socket 用于连接进程以及进程间的信息传递。集群管理器也可以提供一种不同的传递方式。

```@docs
Distributed.launch
Distributed.manage
Distributed.kill(::ClusterManager, ::Int, ::WorkerConfig)
Distributed.connect(::ClusterManager, ::Int, ::WorkerConfig)
Distributed.init_worker
Distributed.start_worker
Distributed.process_messages
```

```@meta
DocTestSetup = nothing
```
