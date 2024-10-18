# [工作流程建议](@id man-workflow-tips)

这里是高效使用 Julia 的一些建议。

## 基于 REPL 的工作流程

正如在 [Julia REPL](@ref The-Julia-REPL) 中演示的那样，Julia 的 REPL 为高效的交互式工作流程提供了丰富的功能。这里是一些可能进一步提升你在命令行下的体验的建议。
The-Julia-REPL
### 一个基本的编辑器 / REPL 工作流程

最基本的 Julia 工作流程是将一个文本编辑器配合 `julia` 的命令行使用。一般会包含下面一些步骤：

  * **把还在开发中的代码放到一个临时的模块中。**新建一个文件，例如 `Tmp.jl`，并放到模块中。
     

    ```julia
    module Tmp
    export say_hello

    say_hello() = println("Hello!")

    # your other definitions here

    end
    ```
  * **把测试代码放到另一个文件中。**新建另一个文件，例如 `tst.jl`，开头为

    ```julia
    include("Tmp.jl")
    import .Tmp
    # using .Tmp # we can use `using` to bring the exported symbols in `Tmp` into our namespace

    Tmp.say_hello()
    # say_hello()

    # your other test code here
    ```

    并把测试作为 `Tmp` 的内容。或者，你可以把测试文件的内容打包到一个模块中，例如
     

    ```julia
    module Tst
        include("Tmp.jl")
        import .Tmp
        #using .Tmp

        Tmp.say_hello()
        # say_hello()

        # your other test code here
    end
    ```

    优点是你的测试代码现在包含在一个模块中，并且不会在 `Main` 的全局作用域中引入新定义，这样更加整洁。
     

  * 使用 `include("tst.jl")` 来在 Julia REPL 中 `include` `tst.jl` 文件。

  * **打肥皂，冲洗，重复。**（译者注：此为英语幽默，被称为[“洗发算法”](https://en.wikipedia.org/wiki/Lather,_rinse,_repeat）描述洗头发的过程)在 `julia` REPL 中摸索不同的想法，把好的想法存入 `tst.jl`。要在 `tst.jl` 被更改后执行它，只需再次 `include` 它。

## 基于浏览器的工作流程

There are a few ways to interact with Julia in a browser:
- Using Pluto notebooks through [Pluto.jl](https://github.com/fonsp/Pluto.jl)
- Using Jupyter notebooks through [IJulia.jl](https://github.com/JuliaLang/IJulia.jl)

## 基于Revise的工作流程

无论你是在REPL还是在IJulia，你通常可以通过
[Revise](https://github.com/timholy/Revise.jl)优化
你的开发经历。
通常情况，无论何时启动Julia，就请按照[Revise文档](https://timholy.github.io/Revise.jl/stable/)中的说明配置好Revise。
一旦配置好，Revise将跟踪任何加载模块中的文件变化。
和任何用`includet`加载到 REPL 的文件 (但不包括普通的`include`);
然后你就可以编辑这些文件，并且更改会在不重新启动julia会话的情况下生效。
标准工作流与上面基于 REPL 的工作流类似，区别如下：

1. 把你的代码放到一个在你的加载路径里的模块中。
   要这样做有很多种方法，通常推荐以下两种选择：

   - 对于长期的项目，使用[PkgTemplates](https://github.com/invenia/PkgTemplates.jl):
      

     ```julia
     using PkgTemplates
     t = Template()
     t("MyPkg")
     ```

     这将在 `.julia/dev` 目录中创建一个空白包`"MyPkg"`。
     请注意，通过它的 `Template` 构造器，PkgTemplates 允许控制许多不同的选项。
      

     在下面的第 2 步中，编辑 `MyPkg/src/MyPkg.jl` 以更改源代码，并编辑 `MyPkg/test/runtests.jl` 以进行测试。
      

   - 对于“一次性”项目，您可以通过在临时目录（例如 `/tmp`）中进行工作来避免任何清理需求。
      

     切换到临时目录并启动 Julia，然后执行以下操作：

     ```julia-repl
     pkg> generate MyPkg            # type ] to enter pkg mode
     julia> push!(LOAD_PATH, pwd())   # hit backspace to exit pkg mode
     ```
     如果你重新启动 Julia 会话，则必须重新发出修改 `LOAD_PATH` 的命令。
      

     在下面的第 2 步中，编辑 `MyPkg/src/MyPkg.jl` 以更改源代码，并创建你选择的任何测试文件。
      

2. 构建你自己的包

   **在加载任何代码之前**， 确保 Revise 已经被启用：
   `using Revise` 或者按照教程设置自动加载。
    

   然后切换到包含测试文件（假设文件为`"runtests.jl"`）的目录下，并：
    

   ```julia-repl
   julia> using MyPkg

   julia> include("runtests.jl")
   ```

   你可以修改在 MyPkg 文件夹中的代码然后用`include("runtests.jl")`重新跑一遍测试。
   通常，你可能需要重新启动Julia 会话来使得这些变化生效（受一些 [限制](https://timholy.github.io/Revise.jl/stable/limitations/)）。
    
