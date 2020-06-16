# 运行外部程序

Julia 中命令的反引号记法借鉴于 shell、Perl 和 Ruby。然而，在 Julia 中编写

```jldoctest
julia> `echo hello`
`echo hello`
```

在多个方面上与 shell、Perl 和 Ruby 中的行为有所不同：

  * 反引号创建一个 [`Cmd`](@ref) 对象来表示命令，而不是立即运行命令。
    你可以使用此对象将命令通过管道连接到其它命令、[`run`](@ref) 它以及对它进行 [`read`](@ref) 或 [`write`](@ref)。
     
  * 在命令运行时，Julia 不会捕获命令的输出结果，除非你对它专门安排。相反，在默认情况下，命令的输出会被定向到 [`stdout`](@ref)，因为它将使用 `libc` 的 `system` 调用。
     
     
  * 命令从不会在 shell 中运行。相反地，Julia 会直接解析命令语法，适当地插入变量并像 shell 那样拆分单词，同时遵从 shell 的引用语法。命令会作为 `julia` 的直接子进程运行，使用 `fork` 和 `exec` 调用。
     
     

这是运行外部程序的简单示例：

```jldoctest
julia> mycommand = `echo hello`
`echo hello`

julia> typeof(mycommand)
Cmd

julia> run(mycommand);
hello
```

`hello` 是 `echo` 命令的输出，会被发送到 [`stdout`](@ref) 中去。run 方法本身返回 `nothing`，如果外部命令未能成功运行，则抛出 [`ErrorException`](@ref)。

如果要读取外部命令的输出，可以使用 [`read`](@ref)：

```jldoctest
julia> a = read(`echo hello`, String)
"hello\n"

julia> chomp(a) == "hello"
true
```

更一般地，你可以使用 [`open`](@ref) 来读取或写入外部命令。

```jldoctest
julia> open(`less`, "w", stdout) do io
           for i = 1:3
               println(io, i)
           end
       end
1
2
3
```

命令中的程序名称和各个参数可以访问和迭代，这就好像命令也是一个字符串数组：
```jldoctest
julia> collect(`echo "foo bar"`)
2-element Array{String,1}:
 "echo"
 "foo bar"

julia> `echo "foo bar"`[2]
"foo bar"
```

## [插值](@id command-interpolation)

假设你想要做的事情更复杂，并使用以变量 `file` 表示的文件名作为命令的参数。那你可以像在字符串字面量中那样使用 `$` 进行插值：

```jldoctest
julia> file = "/etc/passwd"
"/etc/passwd"

julia> `sort $file`
`sort /etc/passwd`
```

通过 shell 运行外部程序的一个常见陷阱是，如果文件名中包含 shell 中的特殊字符，那么可能会导致不希望出现的行为。例如，假设我们想要对其内容进行排序的文件是 `/Volumes/External HD/data.csv`，而不是 `/etc/passwd`。让我们来试试：

```jldoctest
julia> file = "/Volumes/External HD/data.csv"
"/Volumes/External HD/data.csv"

julia> `sort $file`
`sort '/Volumes/External HD/data.csv'`
```

文件名是如何被引用的？Julia 知道 `file` 是作为单个参数插入的，因此它替你引用了此单词。事实上，这不太准确：`file` 的值始终不会被 shell 解释，因此并不需要实际引用；插入引号只是为了展现给用户。就算你把值作为 shell 单词的一部分插入，这也可以工作：

```jldoctest
julia> path = "/Volumes/External HD"
"/Volumes/External HD"

julia> name = "data"
"data"

julia> ext = "csv"
"csv"

julia> `sort $path/$name.$ext`
`sort '/Volumes/External HD/data.csv'`
```

如你所见，`path` 变量中的空格被恰当地转义了。但是，如果你*想*插入多个单词怎么办？在此情况下，只需使用数组（或其它可迭代容器）：

```jldoctest
julia> files = ["/etc/passwd","/Volumes/External HD/data.csv"]
2-element Array{String,1}:
 "/etc/passwd"
 "/Volumes/External HD/data.csv"

julia> `grep foo $files`
`grep foo /etc/passwd '/Volumes/External HD/data.csv'`
```

如果将数组作为 shell 单词的一部分插入，Julia 将模拟 shell 的 `{a,b,c}` 参数生成：

```jldoctest
julia> names = ["foo","bar","baz"]
3-element Array{String,1}:
 "foo"
 "bar"
 "baz"

julia> `grep xylophone $names.txt`
`grep xylophone foo.txt bar.txt baz.txt`
```

此外，若在同一单词中插入多个数组，则将模拟 shell 的笛卡尔积生成行为：

```jldoctest
julia> names = ["foo","bar","baz"]
3-element Array{String,1}:
 "foo"
 "bar"
 "baz"

julia> exts = ["aux","log"]
2-element Array{String,1}:
 "aux"
 "log"

julia> `rm -f $names.$exts`
`rm -f foo.aux foo.log bar.aux bar.log baz.aux baz.log`
```

因为可以插入字面量数组，所以你可以使用此生成功能，而无需先创建临时数组对象：

```jldoctest
julia> `rm -rf $["foo","bar","baz","qux"].$["aux","log","pdf"]`
`rm -rf foo.aux foo.log foo.pdf bar.aux bar.log bar.pdf baz.aux baz.log baz.pdf qux.aux qux.log qux.pdf`
```

## 引用

不可避免地，我们会想要编写不那么简单的命令，且有必要使用引号。下面是 shell 提示符下单行 Perl 程序的简单示例：

```
sh$ perl -le '$|=1; for (0..3) { print }'
0
1
2
3
```

该 Perl 表达式需要使用单引号有两个原因：一是为了避免空格将表达式分解为多个 shell 单词，二是为了在使用像 `$|`（是的，这在 Perl 中是变量名）这样的 Perl 变量时避免发生插值。在其它情况下，你可能想要使用双引号来*真的*进行插值：

```
sh$ first="A"
sh$ second="B"
sh$ perl -le '$|=1; print for @ARGV' "1: $first" "2: $second"
1: A
2: B
```

总之，Julia 反引号语法是经过精心设计的，因此你可以只是将 shell 命令剪切并粘贴到反引号中，接着它们将会工作：转义、引用和插值行为与 shell 相同。唯一的不同是，插值是集成的并且知道在 Julia 的概念中什么是单个字符串值、什么是多个值的容器。让我们在 Julia 中尝试上面的两个例子：

```jldoctest
julia> A = `perl -le '$|=1; for (0..3) { print }'`
`perl -le '$|=1; for (0..3) { print }'`

julia> run(A);
0
1
2
3

julia> first = "A"; second = "B";

julia> B = `perl -le 'print for @ARGV' "1: $first" "2: $second"`
`perl -le 'print for @ARGV' '1: A' '2: B'`

julia> run(B);
1: A
2: B
```

结果是相同的，且 Julia 的插值行为模仿了 shell 的并对其做了一些改进，因为 Julia 支持头等的可迭代对象，但大多数 shell 通过使用空格分隔字符串来实现这一点，而这又引入了歧义。在尝试将 shell 命令移植到 Julia 中时，请先试着剪切并粘贴它。因为 Julia 会在运行命令前向你显示命令，所以你可以在不造成任何破坏的前提下轻松并安全地检查命令的解释。

## 管道

Shell 元字符，如 `|`、`&` 和 `>`，在 Julia 的反引号中需被引用（或转义）：

```jldoctest
julia> run(`echo hello '|' sort`);
hello | sort

julia> run(`echo hello \| sort`);
hello | sort
```

此表达式调用 `echo` 命令并以三个单词作为其参数：`hello`、`|` 和 `sort`。结果是只打印了一行：`hello | sort`。那么，如何构造管道呢？为此，请使用 [`pipeline`](@ref)，而不是在反引号内使用 `'|'`：

```jldoctest
julia> run(pipeline(`echo hello`, `sort`));
hello
```

这将 `echo` 命令的输出传输到 `sort` 命令中。当然，这不是很有趣，因为只有一行要排序，但是我们的当然可以做更多、更有趣的事：

```julia-repl
julia> run(pipeline(`cut -d: -f3 /etc/passwd`, `sort -n`, `tail -n5`))
210
211
212
213
214
```

这将打印在 UNIX 系统上最高的五个用户 ID。`cut`、`sort` 和 `tail` 命令都是当前 `julia` 进程的直接子进程，这中间没有 shell 进程的干预。Julia 自己负责设置管道和连接文件描述符，而这通常由 shell 完成。因为 Julia 自己做了这些事，所以它能更好的控制并做 shell 做不到的一些事情。

Julia 可以并行地运行多个命令：

```jldoctest; filter = r"(world\nhello|hello\nworld)"
julia> run(`echo hello` & `echo world`);
world
hello
```

这里的输出顺序是不确定的，因为两个 `echo` 进程几乎同时启动，并且争着先写入 [`stdout`](@ref) 描述符和 `julia` 父进程。Julia 允许你将这两个进程的输出通过管道传输到另一个程序：

```jldoctest
julia> run(pipeline(`echo world` & `echo hello`, `sort`));
hello
world
```

在 UNIX 管道方面，这里发生的是，一个 UNIX 管道对象由两个 `echo` 进程创建和写入，管道的另一端由 `sort` 命令读取。

IO 重定向可以通过向 `pipeline` 函数传递关键字参数 `stdin`、`stdout` 和 `stderr` 来实现：

```julia
pipeline(`do_work`, stdout=pipeline(`sort`, "out.txt"), stderr="errs.txt")
```

### 避免管道中的死锁

在单个进程中读取和写入管道的两端时，避免强制内核缓冲所有数据是很重要的。

例如，在读取命令的所有输出时，请调用 `read(out, String)`，而非 `wait(process)`，因为前者会积极地消耗由该进程写入的所有数据，而后者在等待读取者连接时会尝试将数据存储内核的缓冲区中。

另一个常见的解决方案是将读取者和写入者分离到单独的 [`Task`](@ref) 中：

```julia
writer = @async write(process, "data")
reader = @async do_compute(read(process, String))
wait(writer)
fetch(reader)
```

### 复杂示例

高级编程语言、头等的命令抽象以及进程间管道的自动设置，三者组合起来非常强大。为了更好地理解可被轻松创建的复杂管道，这里有一些更复杂的例子，以避免对单行 Perl 程序的滥用。

```jldoctest prefixer; filter = r"([A-B] [0-5])"
julia> prefixer(prefix, sleep) = `perl -nle '$|=1; print "'$prefix' ", $_; sleep '$sleep';'`;

julia> run(pipeline(`perl -le '$|=1; for(0..5){ print; sleep 1 }'`, prefixer("A",2) & prefixer("B",2)));
B 0
A 1
B 2
A 3
B 4
A 5
```

这是一个经典的例子，一个生产者为两个并发的消费者提供内容：一个 `perl` 进程生成从数字 0 到 5 的行，而两个并行进程则使用该输出，一个行首加字母「A」，另一个行首加字母「B」。哪个进程使用第一行是不确定的，但是一旦赢得了竞争，这些行会先后被其中一个进程及另一个进程交替使用。（在 Perl 中设置 `$|=1` 会导致每个 print 语句刷新 [`stdout`](@ref) 句柄，这是本例工作所必需的。此外，所有输出将被缓存并一次性打印到管道中，以便只由一个消费者进程读取。）

这是一个更加复杂的多阶段生产者——消费者示例：

```jldoctest prefixer; filter = r"[A-B] [X-Z] [0-5]"
julia> run(pipeline(`perl -le '$|=1; for(0..5){ print; sleep 1 }'`,
           prefixer("X",3) & prefixer("Y",3) & prefixer("Z",3),
           prefixer("A",2) & prefixer("B",2)));
A X 0
B Y 1
A Z 2
B X 3
A Y 4
B Z 5
```

此示例与前一个类似，不同之处在于本例中的消费者有两个阶段，并且阶段间有不同的延迟，因此它们使用不同数量的并行 worker 来维持饱和的吞吐量。

我们强烈建议你尝试所有这些例子，以便了解它们的工作原理。
