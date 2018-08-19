# JuliaZH.jl

[![Build Status](https://travis-ci.org/JuliaCN/JuliaZH.jl.svg?branch=master)](https://travis-ci.org/JuliaCN/JuliaZH.jl)

|    | 国内镜像 | Stable | Latest | Preview |
|:---:|:---:|:---:|:---:|
| 文档 | http://docs.juliacn.com | [![](https://img.shields.io/badge/docs-stable-blue.svg)](https://juliacn.github.io/JuliaZH.jl/stable) | [![](https://img.shields.io/badge/docs-latest-blue.svg)](https://juliacn.github.io/JuliaZH.jl/latest) | [Gitlab Pages](https://juliacn.gitlab.io/JuliaZH.jl) |

## 安装

```
pkg> add https://github.com/JuliaCN/JuliaZH.jl.git
```

## 使用
在代码中使用这个包，就能够获得中文版本的文档：

```julia
julia> using JuliaZH

help?> julia
search: JuliaZH

  欢迎来到Julia 0.7.0-beta2.33. 完整的手册（英文）可以在这里找到

  https://docs.julialang.org/

  同样下面的网址也列出了很多的入门教程和课程

  https://julialang.org/learning/

  更多中文资料和教程，也请关注Julia中文社区

  https://juliacn.github.io (境内域名 juliacn.com 还在备案中)

  输入 ?， 然后输入你想要查看帮助文档的函数或者宏名称就可以查看它们的文档。例如?cos, 或者 ?@time 然后按回车键即可。

  退出REPL之后，重新进入将恢复英文模式。
```

## 贡献
我们目前使用 [Transifex](https://www.transifex.com) 作为翻译平台。翻译工作正在进行，有任何疑问或建议请到[社区论坛文档区](http://discourse.juliacn.com/c/community/document)反馈。若有意参与翻译工作，请参考[翻译指南](http://discourse.juliacn.com/t/topic/277)。

## 致谢
所有贡献者都可以在[Transifex上的JuliaCN组织](https://www.transifex.com/juliacn/public/)以及[贡献者列表](https://github.com/JuliaCN/JuliaZH.jl/graphs/contributors)中找到，此外也感谢曾经参与 0.3 版本文档的[贡献者们](https://github.com/JuliaCN/julia_zh_cn/graphs/contributors)。
