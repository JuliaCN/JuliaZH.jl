# JuliaZH.jl

[![Build Status](https://travis-ci.org/JuliaCN/JuliaZH.jl.svg?branch=master)](https://travis-ci.org/JuliaCN/JuliaZH.jl)

|     |国内镜像 | Stable | Latest | Preview |
|:---:|:---:|:---:|:---:|:---:|
| 文档 | [![](https://img.shields.io/website-up-down-green-red/https/shields.io.svg?label=docs.juliacn.com)](https://docs.juliacn.com) | [![](https://img.shields.io/badge/docs-stable-blue.svg)](https://juliacn.github.io/JuliaZH.jl/stable) | [![](https://img.shields.io/badge/docs-latest-blue.svg)](https://juliacn.github.io/JuliaZH.jl/latest) | [![](https://img.shields.io/badge/Gitlab%20Pages-Preview-brightgreen.svg)](https://juliacn.gitlab.io/JuliaZH.jl) |

## 安装

```
pkg> add JuliaZH
```

## 使用

在代码中使用这个包，就能够获得中文版本的文档：

```julia
julia> using JuliaZH

help?> julia
search: JuliaZH

  欢迎来到Julia 1.1.0. 完整的中文手册可以在这里找到

  https://docs.juliacn.com/

  更多中文资料和教程，也请关注Julia中文社区

  https://cn.julialang.org

  新手请参考中文discourse上的新手指引

  https://discourse.juliacn.com/t/topic/159

  输入 ?， 然后输入你想要查看帮助文档的函数或者宏名称就可以查看它们的文档。例如?cos, 或者 ?@time 然后按回车键即可。

  在REPL中输入 ENV["REPL_LOCALE"]="" 将恢复英文模式。再次回到中文模型请输入 ENV["REPL_LOCALE"]="zh_CN"。
```

### 在本地编译pdf版本

首先你需要安装 [latexmk](https://mg.readthedocs.io/latexmk.html) 和相应平台的 LaTeX 编译器XeLaTeX。之后确认已安装 CTex 套装。然后在这个package的根目录下，在命令行中运行

```sh
julia --project=doc doc/make.jl pdf
```

或者，如果你已经安装了docker，可以执行

```sh
julia --project=doc/ doc/make.jl pdf texplatform=docker
```

就会在 `doc/build` 中获得 `Julia中文文档.pdf` 文件。

## 贡献

我们目前使用 [Transifex](https://www.transifex.com) 作为翻译平台。翻译工作正在进行，有任何疑问或建议请到[社区论坛文档区](http://discourse.juliacn.com/c/community/document)反馈。若有意参与翻译工作，请参考[翻译指南](http://discourse.juliacn.com/t/topic/277)。

## 致谢

所有贡献者都可以在[Transifex上的JuliaCN组织](https://www.transifex.com/juliacn/public/)以及[贡献者列表](https://github.com/JuliaCN/JuliaZH.jl/graphs/contributors)中找到，此外也感谢曾经参与 0.3 版本文档的[贡献者们](https://github.com/JuliaCN/julia_zh_cn/graphs/contributors)。

感谢[集智俱乐部](http://swarma.org/)提供的慷慨支持。

## License

本项目文档部分采用<a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可，代码部分采用[MIT license](https://github.com/JuliaCN/JuliaZH.jl/blob/master/LICENSE)进行许可。
