# 性能分析

`Profile` 模块提供了一些工具来帮助开发者提高其代码的性能。在使用时，它运行代码并进行测量，并生成输出，该输出帮助你了解在每行（或几行）上花费了多少时间。最常见的用法是识别性能「瓶颈」并将其作为优化目标。

`Profile` 实现了所谓的「抽样」或[统计分析器](https://en.wikipedia.org/wiki/Profiling_(computer_programming))。它通过在执行任何任务期间定期进行回溯来工作。每次回溯捕获当前运行的函数和行号，以及导致该行执行的完整函数调用链，因此是当前执行状态的「快照」。

如果大部分运行时间都花在执行特定代码行上，则此行会在所有回溯的集合中频繁出现。换句话说，执行给定行的「成本」——或实际上，调用及包含此行的函数序列的成本——与它在所有回溯的集合中的出现频率成正比。

抽样分析器不提供完整的逐行覆盖功能，因为回溯是间隔发生的（默认情况下，该时间间隔在 Unix 上是 1 ms，而在 Windows 上是 10 ms，但实际调度受操作系统负载的影响）。此外，正如下文中进一步讨论的，因为样本是在所有执行点的稀疏子集处收集的，所以抽样分析器收集的数据会受到统计噪声的影响。

尽管有这些限制，但抽样分析器仍然有很大的优势：

  * You do not have to make any modifications to your code to take timing measurements.
  * 它可以分析 Julia 的核心代码，甚至（可选）可以分析 C 和 Fortran 库。
  * 通过「偶尔」运行，它只有很少的性能开销；代码在性能分析时能以接近本机的速度运行。
     

出于这些原因，建议你在考虑任何替代方案前尝试使用内置的抽样分析器。

## 基本用法

让我们使用一个简单的测试用例：

```julia-repl
julia> function myfunc()
           A = rand(200, 200, 400)
           maximum(A)
       end
```

最好先至少运行一次你想要分析的代码（除非你想要分析 Julia 的 JIT 编译器）：

```julia-repl
julia> myfunc() # run once to force compilation
```

现在我们准备分析这个函数：

```julia-repl
julia> using Profile

julia> @profile myfunc()
```

To see the profiling results, there are several graphical browsers.
One "family" of visualizers is based on [FlameGraphs.jl](https://github.com/timholy/FlameGraphs.jl), with each family member providing a different user interface:
- [Juno](https://junolab.org/) is a full IDE with built-in support for profile visualization
- [ProfileView.jl](https://github.com/timholy/ProfileView.jl) is a stand-alone visualizer based on GTK
- [ProfileVega.jl](https://github.com/davidanthoff/ProfileVega.jl) uses VegaLight and integrates well with Jupyter notebooks
- [StatProfilerHTML](https://github.com/tkluck/StatProfilerHTML.jl) produces HTML and presents some additional summaries, and also integrates well with Jupyter notebooks
- [ProfileSVG](https://github.com/timholy/ProfileSVG.jl) renders SVG

An entirely independent approach to profile visualization is [PProf.jl](https://github.com/vchuravy/PProf.jl), which uses the external `pprof` tool.

Here, though, we'll use the text-based display that comes with the standard library:

```julia-repl
julia> Profile.print()
80 ./event.jl:73; (::Base.REPL.##1#2{Base.REPL.REPLBackend})()
 80 ./REPL.jl:97; macro expansion
  80 ./REPL.jl:66; eval_user_input(::Any, ::Base.REPL.REPLBackend)
   80 ./boot.jl:235; eval(::Module, ::Any)
    80 ./<missing>:?; anonymous
     80 ./profile.jl:23; macro expansion
      52 ./REPL[1]:2; myfunc()
       38 ./random.jl:431; rand!(::MersenneTwister, ::Array{Float64,3}, ::Int64, ::Type{B...
        38 ./dSFMT.jl:84; dsfmt_fill_array_close_open!(::Base.dSFMT.DSFMT_state, ::Ptr{F...
       14 ./random.jl:278; rand
        14 ./random.jl:277; rand
         14 ./random.jl:366; rand
          14 ./random.jl:369; rand
      28 ./REPL[1]:3; myfunc()
       28 ./reduce.jl:270; _mapreduce(::Base.#identity, ::Base.#scalarmax, ::IndexLinear,...
        3  ./reduce.jl:426; mapreduce_impl(::Base.#identity, ::Base.#scalarmax, ::Array{F...
        25 ./reduce.jl:428; mapreduce_impl(::Base.#identity, ::Base.#scalarmax, ::Array{F...
```

显示结果中的每行表示代码中的特定点（行数）。缩进用来标明嵌套的函数调用序列，其中缩进更多的行在调用序列中更深。在每一行中，第一个「字段」是在*这一行或由这一行执行的任何函数*中获取的回溯（样本）数量。第二个字段是文件名和行数，第三个字段是函数名。请注意，具体的行号可能会随着 Julia 代码的改变而改变；如果你想跟上，最好自己运行这个示例。

在此例中，我们可以看到顶层的调用函数位于文件 `event.jl` 中。这是启动 Julia 时运行 REPL 的函数。如果你查看 `REPL.jl` 的第 97 行，你会看到这是调用函数 `eval_user_input()` 的地方。这是对你在 REPL 上的输入进行求值的函数，因为我们正以交互方式运行，所以当我们输入 `@profile myfunc()` 时会调用这些函数。下一行反映了 [`@profile`](@ref) 所采取的操作。

第一行显示在 `event.jl` 的第 73 行获取了 80 次回溯，但这并不是说此行本身「昂贵」：第三行表明所有这些 80 次回溯实际上它调用的 `eval_user_input` 中触发的，以此类推。为了找出实际占用时间的操作，我们需要深入了解调用链。

此输出中第一个「重要」的行是这行：

```
52 ./REPL[1]:2; myfunc()
```

`REPL` 指的是我们在 REPL 中定义了 `myfunc`，而不是把它放在文件中；如果我们使用文件，这将显示文件名。`[1]` 表示函数 `myfunc` 是在当前 REPL 会话中第一个进行求值的表达式。`myfunc()` 的第 2 行包含对 `rand` 的调用，（80 次中）有 52 次回溯发生在该行。在此之下，你可以看到在 `dSFMT.jl` 中对 `dsfmt_fill_array_close_open!` 的调用。

更进一步，你会看到：

```
28 ./REPL[1]:3; myfunc()
```

`myfunc` 的第 3 行包含对 `maximum` 的调用，（80 次中）有 28 次回溯发生在这里。在此之下，你可以看到对于这种类型的输入数据，`maximum` 函数中执行的耗时操作在 `base/reduce.jl` 中的具体位置。

总的来说，我们可以暂时得出结论，生成随机数的成本大概是找到最大元素的两倍。通过收集更多样本，我们可以增加对此结果的信心：

```julia-repl
julia> @profile (for i = 1:100; myfunc(); end)

julia> Profile.print()
[....]
 3821 ./REPL[1]:2; myfunc()
  3511 ./random.jl:431; rand!(::MersenneTwister, ::Array{Float64,3}, ::Int64, ::Type...
   3511 ./dSFMT.jl:84; dsfmt_fill_array_close_open!(::Base.dSFMT.DSFMT_state, ::Ptr...
  310  ./random.jl:278; rand
   [....]
 2893 ./REPL[1]:3; myfunc()
  2893 ./reduce.jl:270; _mapreduce(::Base.#identity, ::Base.#scalarmax, ::IndexLinea...
   [....]
```

一般来说，如果你在某行上收集到 `N` 个样本，那你可以预期其有 `sqrt(N)` 的不确定性（忽略其它噪音源，比如计算机在其它任务上的繁忙程度）。这个规则的主要例外是垃圾收集，它很少运行但往往成本高昂。（因为 Julia 的垃圾收集器是用 C 语言编写的，此类事件可使用下文描述的 `C=true` 输出模式来检测，或者使用 [ProfileView.jl](https://github.com/timholy/ProfileView.jl) 来检测。）

这展示了默认的「树」形转储；另一种选择是「扁平」形转储，它会累积与其嵌套无关的计数：

```julia-repl
julia> Profile.print(format=:flat)
 Count File          Line Function
  6714 ./<missing>     -1 anonymous
  6714 ./REPL.jl       66 eval_user_input(::Any, ::Base.REPL.REPLBackend)
  6714 ./REPL.jl       97 macro expansion
  3821 ./REPL[1]        2 myfunc()
  2893 ./REPL[1]        3 myfunc()
  6714 ./REPL[7]        1 macro expansion
  6714 ./boot.jl      235 eval(::Module, ::Any)
  3511 ./dSFMT.jl      84 dsfmt_fill_array_close_open!(::Base.dSFMT.DSFMT_s...
  6714 ./event.jl      73 (::Base.REPL.##1#2{Base.REPL.REPLBackend})()
  6714 ./profile.jl    23 macro expansion
  3511 ./random.jl    431 rand!(::MersenneTwister, ::Array{Float64,3}, ::In...
   310 ./random.jl    277 rand
   310 ./random.jl    278 rand
   310 ./random.jl    366 rand
   310 ./random.jl    369 rand
  2893 ./reduce.jl    270 _mapreduce(::Base.#identity, ::Base.#scalarmax, :...
     5 ./reduce.jl    420 mapreduce_impl(::Base.#identity, ::Base.#scalarma...
   253 ./reduce.jl    426 mapreduce_impl(::Base.#identity, ::Base.#scalarma...
  2592 ./reduce.jl    428 mapreduce_impl(::Base.#identity, ::Base.#scalarma...
    43 ./reduce.jl    429 mapreduce_impl(::Base.#identity, ::Base.#scalarma...
```

如果你的代码有递归，那么可能令人困惑的就是「子」函数中的行的累积计数可以多于总回溯次数。考虑以下函数定义：

```julia
dumbsum(n::Integer) = n == 1 ? 1 : 1 + dumbsum(n-1)
dumbsum3() = dumbsum(3)
```

如果你要分析 `dumbsum3`，并在执行 `dumbsum(1)` 时执行了回溯，那么该回溯将如下所示：

```julia
dumbsum3
    dumbsum(3)
        dumbsum(2)
            dumbsum(1)
```

因此，即使父函数只获得 1 个计数，这个子函数也会获得 3 个计数。「树」形表示使这更清晰，因此（以及其它原因）可能是查看结果的最实用方法。

## 结果累积和清空

[`@profile`](@ref) 的结果会累积在一个缓冲区中；如果你在 [`@profile`](@ref) 下运行多端代码，那么 [`Profile.print()`](@ref) 会显示合并的结果。这可能非常有用，但有时你会想重新开始，这可通过 [`Profile.clear()`](@ref)。

## 用于控制性能分析结果显示的选项

[`Profile.print`](@ref) 还有一些未曾描述的选项。让我们看看完整的声明：

```julia
function print(io::IO = stdout, data = fetch(); kwargs...)
```

我们先讨论两个位置参数，然后讨论关键字参数：

  * `io`——允许你将结果保存到缓冲区，例如一个文件，但默认是打印到 `stdout`（控制台）。
     
  * `data`——包含你要分析的数据；默认情况下，它是从 [`Profile.fetch()`](@ref) 中获取的，该函数从预先分配的缓冲区中拉出回溯。例如，如果你要分析性能分析器，可以说：
     
     

    ```julia
    data = copy(Profile.fetch())
    Profile.clear()
    @profile Profile.print(stdout, data) # Prints the previous results
    Profile.print()                      # Prints results from Profile.print()
    ```

关键字参数可以是以下参数的任意组合：

  * `format`——上文已经介绍，确定是使用（默认值，`:tree`）还是不使用（`:flat`）缩进来表示其树形结构。
     
     
  * `C`——如果为 `true`，则显示 C 和 Fortran 代码中的回溯（通常它们被排除在外）。请尝试用 `Profile.print(C = true)` 运行介绍性示例。这对于判断是 Julia 代码还是 C 代码导致了性能瓶颈非常有帮助；设置 `C = true` 也可提高嵌套的可解释性，代价是更长的性能分析转储。
     
     
     
  * `combine`——某些代码行包含多个操作；例如，`s += A[i]` 包含一个数组引用（`A[i]`）和一个求和操作。这些操作在所生成的机器代码中对应不同的行，因此回溯期间可能会在此行中捕获两个或以上地址。`combine = true` 把它们混合在一起，可能你通常想要这样，但使用 `combine = false`，你可为每个唯一的指令指针单独生成输出。
     
     
     
     
  * `maxdepth`——限制 `:tree` 格式中深度大于 `maxdepth` 的帧。
  *   * `sortedby`——控制 `:flat` 格式中的次序。为 `:filefuncline`（默认值）时按源代码行排序，而为 `:count` 时按收集的样本数排序。
     
  * `noisefloor`——限制低于样本的启发式噪音下限的帧（只适用于格式 `:tree`）。尝试此选项的建议值是 2.0（默认值是 0）。此参数会隐藏 `n <= noisefloor * √N` 的样本，其中 `n` 是该行上的样本数，`N` 是被调用者的样本数。
     
     
  * `mincount`——限制出现次数少于 `mincount` 的帧。

文件/函数名有时会被（用 `...`）截断，缩进也有可能在开头用 `+n` 截断，其中 `n` 是在空间充足的情况下应该插入的额外空格数。如果你想要深层嵌套代码的完整性能分析，保存到文件并在 [`IOContext`](@ref) 中使用宽的 `displaysize` 通常是个好主意：

```julia
open("/tmp/prof.txt", "w") do s
    Profile.print(IOContext(s, :displaysize => (24, 500)))
end
```

## 配置

[`@profile`](@ref) 只是累积回溯，在你调用 [`Profile.print()`](@ref) 时才会进行性能分析。对于长时间运行的计算，完全有可能把用于存储回溯的预分配缓冲区填满。如果发生这种情况，回溯会停止，但你的计算会继续。因此，你也许会丢失一些重要的性能分析数据（当发生这种情况时，你会受到警告）。

你可通过以下方式获取和配置相关参数：

```julia
Profile.init() # returns the current settings
Profile.init(n = 10^7, delay = 0.01)
```

`n` 是能够存储的指令指针总数，默认值为 `10^6`。如果通常的回溯是 20 个指令指针，那么可以收集 50000 次回溯，这意味着统计不确定性少于 1%。这对于大多数应用来说可能已经足够了。

因此，你更可能需要修改 `delay`，它以秒为单位，设置在快照之间 Julia 用于执行所请求计算的时长。长时间运行的工作可能不需要经常回溯。默认设置为 `delay = 0.001`。当然，你可以减少和增加 delay；但是，一旦 delay 接近执行一次回溯所需的时间（在作者的笔记本上约为 30 微妙），性能分析的开销就会增加。

# 内存分配分析

减少内存分配是提高性能的最常用技术之一。内存分配总量可以用 [`@time`](@ref) 和 [`@allocated`](@ref)，触发内存分配的特定行通常可以通过这些行产生的垃圾分配成本从性能分析中推断出来。但是，直接测量每行代码的内存分配总量有时会更高效。

为了逐行测量内存分配，启动 Julia 时请使用命令行选项 `--track-allocation=<setting>`，该选项的可选值有 `none`（默认值，不测量内存分配）、`user`（测量除 Julia core 代码之外的所有代码的内存分配）或 `all`（测量 Julia 代码中每一行的内存分配）。这会为每行已编译的代码测量内存。在退出 Julia 时，累积的结果将写入到文本文件中，此文本文件名称为该文件名称后加 `.mem`，并与源文件位于同一目录下。该文件的每行列出内存分配的总字节数。[`Coverage` 包](https://github.com/JuliaCI/Coverage.jl)包括了一些基本分析工具，例如，按照内存分配的字节数对行进行排序的工具。

在解释结果时，有一些需要注意的细节。在 `user` 设定下，直接从 REPL 调用的任何函数的第一行都将会显示内存分配，这是由发生在 REPL 代码本身的事件造成的。更重要的是，JIT 编译也会添加内存分配计数，因为 Julia 的编译器大部分是用 Julia 编写的（并且编译通常需要内存分配）。建议的分析过程是先通过执行待分析的所有命令来强制编译，然后调用 [`Profile.clear_malloc_data()`](@ref) 来重置所有内存计数器。最后，执行所需的命令并退出 Julia 以触发 `.mem` 文件的生成。

# 外部性能分析

Julia 目前支持的外部性能分析工具有 `Intel VTune`、`OProfile` 和 `perf`。

根据你所选择的工具，编译时请在 `Make.user` 中将 `USE_INTEL_JITEVENTS`、`USE_OPROFILE_JITEVENTS` 和 `USE_PERF_JITEVENTS` 设置为 1。多个上述编译标志是支持的。

在运行 Julia 前，请将环境变量 `ENABLE_JITPROFILING` 设置为 1。

现在，你可以通过多种方式使用这些工具！例如，可以使用 `OProfile` 来尝试做个简单的记录：

```
>ENABLE_JITPROFILING=1 sudo operf -Vdebug ./julia test/fastmath.jl
>opreport -l `which ./julia`
```

Or similary with `perf` :

```
$ ENABLE_JITPROFILING=1 perf record -o /tmp/perf.data --call-graph dwarf ./julia /test/fastmath.jl
$ perf report --call-graph -G
```

你可以测量关于程序的更多有趣数据，若要获得详尽的列表，请阅读 [Linux perf 示例页面](http://www.brendangregg.com/perf.html)。

请记住，perf 会为每次执行保存一个 `perf.data` 文件，即使对于小程序，它也可能变得非常大。此外，perf LLVM 模块会将调试对象保存在 `~/.debug/jit` 中，记得经常清理该文件夹。
