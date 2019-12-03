# 网络和流

Julia 提供了一个功能丰富的接口来处理流式 I/O 对象，如终端、管道和 TCP 套接字。此接口虽然在系统级是异步的，但是其以同步的方式展现给程序员，通常也不需要考虑底层的异步操作。这是通过大量使用 Julia 协作线程（[协程](@ref man-tasks)）功能实现的。

## 基础流 I/O

所有 Julia stream 都暴露了 [`read`](@ref) 和 [`write`](@ref) 方法，将 stream 作为它们的第一个参数，如：

```julia-repl
julia> write(stdout, "Hello World");  # suppress return value 11 with ;
Hello World
julia> read(stdin, Char)

'\n': ASCII/Unicode U+000a (category Cc: Other, control)
```

注意，[`write`](@ref) 返回 11，字节数（`"Hello World"`）写入 [`stdout`](@ref)，但是返回值使用 `;` 抑制。

这里按了两次回车，以便 Julia 能够读取到换行符。正如你在这个例子中所看到的，[`write`](@ref) 以待写入的数据作为其第二个参数，而 [`read`](@ref) 以待读取的数据的类型作为其第二个参数。

例如，为了读取一个简单的字节数组，我们可以这样做：

```julia-repl
julia> x = zeros(UInt8, 4)
4-element Array{UInt8,1}:
 0x00
 0x00
 0x00
 0x00

julia> read!(stdin, x)
abcd
4-element Array{UInt8,1}:
 0x61
 0x62
 0x63
 0x64
```

但是，因为这有些繁琐，所以提供了几个方便的方法。例如，我们可以把上面的代码编写为：

```julia-repl
julia> read(stdin, 4)
abcd
4-element Array{UInt8,1}:
 0x61
 0x62
 0x63
 0x64
```

或者如果我们想要读取一整行：

```julia-repl
julia> readline(stdin)
abcd
"abcd"
```

请注意，根据你的终端设置，你的 TTY 可能是行缓冲的，因此在数据发送给 Julia 前可能需要额外的回车。

若要读取 [`stdin`](@ref) 的每一行，可以使用 [`eachline`](@ref)：

```julia
for line in eachline(stdin)
    print("Found $line")
end
```

或者如果你想要按字符读取的话，使用 [`read`](@ref) ：

```julia
while !eof(stdin)
    x = read(stdin, Char)
    println("Found: $x")
end
```

## 文本 I/O

请注意，上面提到的 [`write`](@ref) 方法对二进制流进行操作。具体来说，值不会转换为任何规范的文本表示形式，而是按原样输出：

```jldoctest
julia> write(stdout, 0x61);  # suppress return value 1 with ;
a
```

请注意，`a` 被 [`write`](@ref) 函数写入到 [`stdout`](@ref) 并且返回值为 `1`（因为 `0x61` 为一个字节）。

对于文本 I/O，请根据需要使用 [`print`](@ref) 或 [`show`](@ref) 方法（有关这两个方法之间的差异的详细讨论，请参阅它们的文档）：

```jldoctest
julia> print(stdout, 0x61)
97
```

有关如何实现自定义类型的显示方法的更多信息，请参阅 [自定义 pretty-printing](@ref man-custom-pretty-printing)。

## IO 输出的上下文信息

有时，IO 输出可受益于将上下文信息传递到 show 方法的能力。[`IOContext`](@ref) 对象提供了将任意元数据与 IO 对象相关联的框架。例如，`:compact => true` 向 IO 对象添加一个参数来提示调用的 show 方法应该打印一个较短的输出（如果适用）。有关常用属性的列表，请参阅 [`IOContext`](@ref) 文档。

## 使用文件

Like many other environments, Julia has an [`open`](@ref) function, which takes a filename and
returns an [`IOStream`](@ref) object that you can use to read and write things from the file. For example,
if we have a file, `hello.txt`, whose contents are `Hello, World!`:

```julia-repl
julia> f = open("hello.txt")
IOStream(<file hello.txt>)

julia> readlines(f)
1-element Array{String,1}:
 "Hello, World!"
```

若要写入文件，则可以带着 write（`"w"`）标志来打开它：

```julia-repl
julia> f = open("hello.txt","w")
IOStream(<file hello.txt>)

julia> write(f,"Hello again.")
12
```

你如果在此刻检查 `hello.txt` 的内容，会注意到它是空的；改动实际上还没有写入到磁盘中。这是因为 `IOStream` 必须在写入实际刷新到磁盘前关闭：

```julia-repl
julia> close(f)
```

再次检查 `hello.txt` 将显示其内容已被更改。

打开文件，对其内容执行一些操作，并再次关闭它是一种非常常见的模式。为了使这更容易，[`open`](@ref) 还有另一种调用方式，它以一个函数作为其第一个参数，以文件名作为其第二个参数，以该文件为参数调用该函数，然后再次关闭它。例如，给定函数：

```julia
function read_and_capitalize(f::IOStream)
    return uppercase(read(f, String))
end
```

可以调用：

```julia-repl
julia> open(read_and_capitalize, "hello.txt")
"HELLO AGAIN."
```

来打开 `hello.txt`，对它调用 `read_and_capitalize`，关闭 `hello.txt` 并返回大写的内容。

为了避免被迫定义一个命名函数，你可以使用 `do` 语法，它可以动态地创建匿名函数：

```julia-repl
julia> open("hello.txt") do f
           uppercase(read(f, String))
       end
"HELLO AGAIN."
```

## 一个简单的 TCP 示例

让我们直接进入一个 TCP 套接字相关的简单示例。此功能位于名为 `Sockets` 的标准库中。让我们先创建一个简单的服务器：

```julia-repl
julia> using Sockets

julia> @async begin
           server = listen(2000)
           while true
               sock = accept(server)
               println("Hello World\n")
           end
       end
Task (runnable) @0x00007fd31dc11ae0
```

对于那些熟悉 Unix 套接字 API 的人，这些方法名称会让人感觉很熟悉，可是它们的用法比原始的 Unix 套接字 API 要简单些。在本例中，首次调用 [`listen`](@ref) 会创建一个服务器，等待传入指定端口（2000）的连接。

```julia-repl
julia> listen(2000) # 监听（IPv4 下的）localhost:2000
Sockets.TCPServer(active)

julia> listen(ip"127.0.0.1",2000) # 等价于第一个
Sockets.TCPServer(active)

julia> listen(ip"::1",2000) # 监听（IPv6 下的）localhost:2000
Sockets.TCPServer(active)

julia> listen(IPv4(0),2001) # 监听所有 IPv4 接口的端口 2001
Sockets.TCPServer(active)

julia> listen(IPv6(0),2001) # 监听所有 IPv6 接口的端口 2001
Sockets.TCPServer(active)

julia> listen("testsocket") # 监听 UNIX 域套接字
Sockets.PipeServer(active)

julia> listen("\\\\.\\pipe\\testsocket") # 监听 Windows 命名管道
Sockets.PipeServer(active)
```

Note that the return type of the last invocation is different. This is because this server does not
listen on TCP, but rather on a named pipe (Windows) or UNIX domain socket. Also note that Windows
named pipe format has to be a specific pattern such that the name prefix (`\\.\pipe\`) uniquely
identifies the [file type](https://docs.microsoft.com/windows/desktop/ipc/pipe-names).
The difference between TCP and named pipes or
UNIX domain sockets is subtle and has to do with the [`accept`](@ref) and [`connect`](@ref)
methods. The [`accept`](@ref) method retrieves a connection to the client that is connecting on
the server we just created, while the [`connect`](@ref) function connects to a server using the
specified method. The [`connect`](@ref) function takes the same arguments as [`listen`](@ref),
so, assuming the environment (i.e. host, cwd, etc.) is the same you should be able to pass the same
arguments to [`connect`](@ref) as you did to listen to establish the connection. So let's try that
out (after having created the server above):

```julia-repl
julia> connect(2000)
TCPSocket(open, 0 bytes waiting)

julia> Hello World
```

不出所料，我们看到「Hello World」被打印出来。那么，让我们分析一下幕后发生的事情。在我们调用 [`connect`](@ref) 时，我们连接到刚刚创建的服务器。与此同时，accept 函数返回到新创建的套接字的服务器端连接，并打印「Hello World」来表明连接成功。

Julia 的强大优势在于，即使 I/O 实际上是异步发生的，API 也以同步方式暴露，我们不必担心回调，甚至不必确保服务器能够运行。在我们调用 [`connect`](@ref) 时，当前任务等待建立连接，并在这之后才继续执行。在此暂停中，服务器任务恢复执行（因为现在有一个连接请求是可用的），接受该连接，打印信息并等待下一个客户端。读取和写入以同样的方式运行。为了理解这一点，请考虑以下简单的 echo 服务器：

```julia-repl
julia> @async begin
           server = listen(2001)
           while true
               sock = accept(server)
               @async while isopen(sock)
                   write(sock, readline(sock, keep=true))
               end
           end
       end
Task (runnable) @0x00007fd31dc12e60

julia> clientside = connect(2001)
TCPSocket(RawFD(28) open, 0 bytes waiting)

julia> @async while isopen(clientside)
           write(stdout, readline(clientside, keep=true))
       end
Task (runnable) @0x00007fd31dc11870

julia> println(clientside,"Hello World from the Echo Server")
Hello World from the Echo Server
```

与其他流一样，使用 [`close`](@ref) 即可断开该套接字：

```julia-repl
julia> close(clientside)
```

## 解析 IP 地址

与 [`listen`](@ref) 方法不一致的 [`connect`](@ref) 方法之一是 `connect(host::String,port)`，它将尝试连接到由 `host` 参数给定的主机上的由 `port` 参数给定的端口。它允许你执行以下操作：

```julia-repl
julia> connect("google.com", 80)
TCPSocket(RawFD(30) open, 0 bytes waiting)
```

此功能的基础是 [`getaddrinfo`](@ref)，它将执行适当的地址解析：

```julia-repl
julia> getaddrinfo("google.com")
ip"74.125.226.225"
```
