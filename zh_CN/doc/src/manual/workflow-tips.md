# [工作流程建议](@id man-workflow-tips)

这里是高效使用 Julia 的一些建议。

## 基于 REPL 的工作流程

正如在 [Julia REPL](@ref) 中演示的那样，Julia 的 REPL 为高效的交互式工作流程提供了丰富的功能。这里是一些可能进一步提升你在命令行下的体验的建议。

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

也可以通过 [IJulia](https://github.com/JuliaLang/IJulia.jl) 在浏览器中与 Julia REPL 进行交互，请到该库的主页查看详细用法。
