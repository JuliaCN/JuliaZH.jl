# 中文文档

这里是手册等文字部分的文档源文件，所有文档内容都在 `src` 目录下。目前主要结构是：

- `assets`：素材，logo等
- `base`：Base中的文档自动生成脚本 （需要通过doc string替换来实现翻译）
- `juliacn`： JuliaZH的开发文档
- `manual`：手册

如果复制新的文件夹进来请保持master分支的目录结构与julia源代码的master分支中的doc目录一致。

## 本地编译 PDF

首先你需要安装 [latexmk](https://mg.readthedocs.io/latexmk.html) 和相应平台的 LaTeX 编译器XeLaTeX。之后确认已安装 CTex 套装。然后在这个package的根目录下，在命令行中运行

```sh
julia --project=doc doc/make.jl pdf
```

或者，如果你已经安装了docker，可以执行

```sh
julia --project=doc/ doc/make.jl pdf texplatform=docker
```

就会在 `doc/build` 中获得 `Julia中文文档.pdf` 文件。

## 镜像 CI

在 `gh-pages` 与 `pdf` 分支上均存在 `.github/workflows/deploy.yml` 来将改动推送到
国内的镜像服务器上. 它们由 `master` 或者 `release-*` 分支的 Documenter CI 来更新并触发。
