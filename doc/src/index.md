# Julia 1.5 中文文档

欢迎来到 Julia 1.5 中文文档([PDF版本](https://raw.githubusercontent.com/JuliaCN/JuliaZH.jl/pdf/dev/Julia中文文档.pdf))!

请先阅读 [Julia 1.0 正式发布博文](https://julialang.org/blog/2018/08/one-point-zero-zh_cn) 以获得对这门语言的总体概观。我们推荐刚刚开始学习 Julia 语言的朋友阅读中文社区提供的 [Julia入门指引](https://discourse.juliacn.com/t/topic/159)，也推荐你在[中文论坛](https://discourse.juliacn.com)对遇到的问题进行提问。

!!! note "关于中文文档"
    Julia 语言相关的本地化工作是一个由社区驱动的开源项目 [JuliaZH.jl](https://github.com/JuliaCN/JuliaZH.jl)，旨在方便 Julia 的中文用户。我们目前使用 [Transifex](https://www.transifex.com) 作为翻译平台。翻译工作正在进行，有任何疑问或建议请到[社区论坛文档区](https://discourse.juliacn.com/c/community/document)反馈。若有意参与翻译工作，请参考[翻译指南](https://discourse.juliacn.com/t/topic/277)。

## 鸣谢

```@raw html
<a href="https://swarma.org">
<img
src="https://swarma.org/wp-content/uploads/2018/08/logochange_副本2.png"
alt="集智俱乐部" width="210"></img>
</a>
```

## [简介](@id man-introduction)

科学计算对性能一直有着最高的需求，但目前各领域的专家却大量使用较慢的动态语言来开展他们的日常工作。
偏爱动态语言有很多很好的理由，因此我们不会舍弃动态的特性。
幸运的是，现代编程语言设计与编译器技术可以大大消除性能折衷（trade-off），并提供有足够生产力的单一环境进行原型设计，而且能高效地部署性能密集型应用程序。
Julia 语言在这其中扮演了这样一个角色：它是一门灵活的动态语言，适合用于科学计算和数值计算，并且性能可与传统的静态类型语言媲美。

由于 Julia 的编译器和其它语言比如 Python 或 R 的解释器有所不同，一开始你可能发现 Julia 的性能并不是很突出。
如果你觉得速度有点慢，我们强烈建议在尝试其他功能前，先读一读文档中的[提高性能的窍门](@ref man-performance-tips)。
在理解了 Julia 的运作方式后，写出和 C 一样快的代码对你而言就是小菜一碟。

Julia 拥有可选类型标注和多重派发这两个特性，同时还拥有很棒的性能。
这些都得归功于使用 [LLVM](https://discourse.juliacn.com/t/topic/4203#llvm) 实现的类型推导和[即时编译（JIT）](https://discourse.juliacn.com/t/topic/4203#just-in-time-compilation)技术。Julia 是一门支持过程式、函数式和面向对象的多范式语言。
它像 R、MATLAB 和 Python 一样简单，在高级数值计算方面有丰富的表现力，并且支持通用编程。
为了实现这个目标，Julia 以数学编程语言（mathematical programming languages）为基础，同时也参考了不少流行的动态语言，例如
[Lisp](https://discourse.juliacn.com/t/topic/4203#lisp)、[Perl](https://discourse.juliacn.com/t/topic/4203#perl)、[Python](https://discourse.juliacn.com/t/topic/4203#python)、[Lua](https://discourse.juliacn.com/t/topic/4203#lua)、和 [Ruby](https://discourse.juliacn.com/t/topic/4203#ruby)。

Julia 与传统动态语言最重要的区别是：

  * 核心语言很小：标准库是用 Julia 自身写的，包括整数运算这样的基础运算
  * 丰富的基础类型：既可用于定义和描述对象，也可用于做可选的类型标注
  * 通过[多重派发](https://discourse.juliacn.com/t/topic/4203#multiple-dispatch)，可以根据类型的不同，来调用同名函数的不同实现
  * 为不同的参数类型，自动生成高效、专用的代码
  * 接近 C 语言的性能

尽管人们有时会说动态语言是“无类型的”，但实际上绝对不是这样的：每一个对象都有一个类型，无论它是基础的类型（primitive）还是用户自定义的类型。
大多数的动态语言都缺乏类型声明，这意味着程序员无法告诉编译器值的类型，也就无法显式地讨论类型。
另一方面，在静态语言中，往往必须标注对象的类型。但类型只在编译期才存在，而无法在运行时进行操作和表达。
而在 Julia 中，类型本身是运行时的对象，并可用于向编译器传达信息。

类型系统和多重派发是 Julia 语言最主要的特征，但一般不需要显式地手动标注或使用：函数通过函数名称和不同类型参数的组合进行定义，在调用时会派发到最接近（most specific）的定义上去。这样的编程模型非常适合数学化的编程，尤其是在传统的面向对象派发中，一些函数的第一个变量理论上并不“拥有”这样一个操作时。
在 Julia 中运算符只是函数的一个特殊标记——例如，为用户定义的新类型添加加法运算，你只要为 `+` 函数定义一个新的方法就可以了。
已有的代码就可以无缝接入这个新的类型。

Julia 在设计之初就非常看重性能，再加上它的动态类型推导（可以被可选的类型标注增强），使得 Julia 的计算性能超过了其它的动态语言，甚至能够与静态编译语言竞争。对于大型数值问题，速度一直都是，也一直会是一个重要的关注点：在过去的几十年里，需要处理的数据量很容易与摩尔定律保持同步。

Julia 的目标是创建一个前所未有的集易用、强大、高效于一体的语言。除此之外，Julia 还拥有以下优势：

  * 采用 [MIT 许可证](https://github.com/JuliaLang/julia/blob/master/LICENSE.md)：免费又开源
  * 用户自定义类型的速度与兼容性和内建类型一样好
  * 无需特意编写向量化的代码：非向量化的代码就很快
  * 为并行计算和分布式计算设计
  * 轻量级的“绿色”线程：[协程](https://discourse.juliacn.com/t/topic/4203#coroutine)
  * 低调又牛逼的类型系统
  * 优雅、可扩展的类型转换和类型提升
  * 对 [Unicode](https://discourse.juliacn.com/t/topic/4203#unicode) 的有效支持，包括但不限于 [UTF-8](https://discourse.juliacn.com/t/topic/4203#utf-8)
  * 直接调用 C 函数，无需封装或调用特别的 API
  * 像 Shell 一样强大的管理其他进程的能力
  * 像 Lisp 一样的宏和其他元编程工具
