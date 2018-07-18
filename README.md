# JuliaZH.jl

Julia中文文档，中文文档是一个标准的Julia包，可以使用包的安装方式来安装，
如果你只想查看网页版本请访问[Julia 中文文档页面]()。

## 使用方法

暂未注册在源中，请通过以下方式clone master branch

Julia 0.7+ 请使用自带的包管理器安装

```julia
pkg> dev
```

```julia
julia> Pkg.clone("")
```

在你的代码中使用这个包，就能够获得中文版本的文档：

```julia
julia> using JuliaZH

help?> julia
search: JuliaZH JULIA_HOME

  欢迎来到Julia 0.6.3. 完整的手册（英文）可以在这里找到

  https://docs.julialang.org/

  同样下面的网址也列出了很多的入门教程和课程

  https://julialang.org/learning/

  也请关注Julia中文社区

  https://juliacn.com

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

## 开源协议
