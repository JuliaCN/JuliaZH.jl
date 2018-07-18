# JuliaZH.jl

[![Build Status](https://travis-ci.org/JuliaCN/JuliaZH.jl.svg?branch=master)](https://travis-ci.org/JuliaCN/JuliaZH.jl)
[![](https://img.shields.io/badge/docs-stable-blue.svg)](https://juliacn.github.io/JuliaZH.jl/stable)
[![](https://img.shields.io/badge/docs-latest-blue.svg)](https://juliacn.github.io/JuliaZH.jl/latest)

Julia中文文档，中文文档是一个标准的Julia包，可以使用包的安装方式来安装，
如果你只想查看网页版本请访问[Julia 中文文档页面](https://juliacn.github.io/JuliaZH.jl)。

## 使用方法

暂未注册在源中，仅支持0.7版本，请通过以下方式获取最新的master分支

Julia 0.7+ 请使用自带的包管理器安装

```
pkg> dev https://github.com/JuliaCN/JuliaZH.jl.git#master
```

在你的代码中使用这个包，就能够获得中文版本的文档：

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

<!--
Julia 0.7+ 请使用自带的包管理器安装

```julia
pkg> add JuliaZH
```

Julia 0.6 请在REPL中使用如下命令

```julia
julia> Pkg.add("JuliaZH")
``` -->

## 贡献文档

请阅读[JuliaZH的开发文档](https://juliacn.github.io/JuliaZH.jl/latest/juliacn/style-guide/)并给我们提交PR或者通过issue讨论。

所有Julia中文文档的贡献者都可以在[贡献者列表](https://github.com/JuliaCN/JuliaZH.jl/graphs/contributors)中找到。此外也感谢曾经参与
0.3版本文档的[贡献者们](https://github.com/JuliaCN/julia_zh_cn/graphs/contributors)。

## 开源协议

MIT协议
