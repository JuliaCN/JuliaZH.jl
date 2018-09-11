# Julia 1.0 中文文档

欢迎来到 Julia 1.0 中文文档。

请先阅读[v1.0 正式发布博文](https://julialang.org/blog/2018/08/one-point-zero-zh_cn)以获取一个对这门语言的总体概观，其中也介绍了 julia 自 v0.6 以来所做出的诸多改进。另外与 v1.0 同时发布的还有 v0.7，该版本是 v0.6 与 v1.0 之间的过渡版本，它能够兼容大部分还没来得及更新到 v1.0 的包，也能够正常运行已经不再提供 v0.6 支持的包。v0.7 和 v1.0 的差别只是 v0.7 会告诉你哪些过去 v0.6 的函数和接口已经被废弃了，或者改动成了别的。参见 [v0.7 更新说明](https://docs.julialang.org/en/v0.7.0/NEWS/)

!!! note "关于中文文档"
    Julia 语言相关的本地化工作是一个由社区驱动的开源项目[JuliaZH.jl](https://github.com/JuliaCN/JuliaZH.jl)，旨在方便 Julia 的中文用户。我们目前使用 [Transifex](https://www.transifex.com) 作为翻译平台。翻译工作正在进行，有任何疑问或建议请到[社区论坛文档区](http://discourse.juliacn.com/c/community/document)反馈。若有意参与翻译工作，请参考[翻译指南](http://discourse.juliacn.com/t/topic/277)。

### [简介](@id man-introduction)

科学计算对性能一直有着最高的需求， 但现在这个领域的专家开始大量使用比较慢的动态语言来完成日常工作。
我们相信有很多使用动态语言的理由， 所以我们不会舍弃这样的特性。幸运的是，现代语言设计和编译器技术使得为原型设计提供单一的高效开发环境，
并且配置高性能的应用成为可能。Julia 语言在这其中扮演了这样一个角色：作为灵活的动态语言，适合科学和数值计算，性能可与传统静态类型语言媲美。


由于 Julia 的编译器和其它语言比如 Python 或 R 有所不同，一开始您或许会觉得 Julia 中什么样的代码运行效率高，什么样的代码运行效率低似乎并不很直观。
如果您发现 Julia 变慢了，我们非常建议您在尝试其它功能前读一下[提高性能的窍门](@ref man-performance-tips) 。只要您理解 Julia 的工作方式，
就会很容易地写出运行效率甚至可以和 C 相媲美的代码。


Julia 具有通过类型推倒和[即时编译（JIT）](https://en.wikipedia.org/wiki/Just-in-time_compilation)在 [LLVM](https://en.wikipedia.org/wiki/Low_Level_Virtual_Machine) 上实现的可选类型标注，多重派发，良好的性能。它是一个支持过程式，函数式
面向对象编程的多范式语言。它提供了简易和简洁的高等数值计算，它类似于 R 、 MATLAB 和 Python ，支持一般用途的编程。为了达到这个目的
Julia 在数学编程语言的基础上，参考了不少流行动态语言，例如 [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)), [Perl](https://en.wikipedia.org/wiki/Perl_(programming_language)),
[Python](https://en.wikipedia.org/wiki/Python_(programming_language)), [Lua](https://en.wikipedia.org/wiki/Lua_(programming_language)),
和 [Ruby](https://en.wikipedia.org/wiki/Ruby_(programming_language))。


Julia 与传统动态语言最大的区别是：

  * 核心语言很小；标准库是用 Julia 本身写的，如整数运算在内的基础运算
  * 完善的类型，方便构造对象和做类型声明
  * 基于[多重派发](https://en.wikipedia.org/wiki/Multiple_dispatch)通过很多不同的参数类型来定义函数行为的能力
  * 为不同类型自动生成高效，专用的代码
  * 接近 C 语言的，良好的性能


尽管，一些人有时说动态语言是“无类型的”，但实际上他们并不是这样：每一个对象，无论是基础的还是用户自己定义的，都有一个类型。
在大多数动态语言中都缺乏类型声明，而这往往意味着无法指示编译器值的类型，也就无法显示地讨论类型。另一方面，静态语言中，虽然可以标记类型
（往往也必须这么做），但是类型只在编译时期才存在，而无法在运行时进行操作和表达。在 Julia 里，类型是它们自己的动态对象，也可以
被用来给编译器提供相应的信息。


类型系统和多重派发是 Julia 语言最主要的特征（尽管类型和多重派发并不必要被显式使用）：函数通过函数名称和不同类型变量的组合进行定义，然后在调用时会派发
最接近（most specific）的定义上去。这样的编程模型非常适合数学化的编程，尤其是在传统的面向对象派发中，一些函数的第一个变量理论上并不“拥有”这样一个操作时。
而在Julia中运算符只是函数的一个特殊标记——例如，为用户定义的新类型添加加法运算，你只要为 `+` 函数定义一个新的方法就可以了。
已有的代码就可以无缝接入这个新的类型。


一部分是因为动态类型推导（可以被可选的类型标注增强），另一部分是因为在这个语言建立之初就对性能非常看重，Julia 的计算性能超过了其它的
动态语言，甚至能够与静态编译语言竞争。对于大型数值问题，速度一直都是，也一直会是一个重要的关注点：这些年以来，被处理的数据量的增长有着Moore定律。

Julia 的目标是创建一个前所未有的集易用、强大、高效于一体的语言。除此之外，Julia 的优势还在于：

  * 免费开源（[MIT 许可证](https://github.com/JuliaLang/julia/blob/master/LICENSE.md)）
  * 用户定义的类型和内建类型一样快和兼容
  * 无需特意编写向量化的代码；非向量化的代码就很快
  * 为并行计算和分布式计算设计
  * 轻量级的“绿色”线程 ([协程](https://en.wikipedia.org/wiki/Coroutine))
  * 低调又牛逼的类型系统
  * 优雅、可扩展的类型转换
  * 高效支持 [Unicode](https://en.wikipedia.org/wiki/Unicode)，包括但不限于 [UTF-8](https://en.wikipedia.org/wiki/UTF-8)
  * 直接调用 C 函数（不需封装或调用特别的 API）
  * 像 Shell 一样强大的管理其他进程的能力
  * 像 Lisp 一样的宏和其他元编程工具
