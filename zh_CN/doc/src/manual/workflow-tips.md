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

## Revise-based workflows

Whether you're at the REPL or in IJulia, you can typically improve
your development experience with
[Revise](https://github.com/timholy/Revise.jl).
It is common to configure Revise to start whenever julia is started,
as per the instructions in the [Revise documentation](https://timholy.github.io/Revise.jl/stable/).
Once configured, Revise will track changes to files in any loaded modules,
and to any files loaded in to the REPL with `includet` (but not with plain `include`);
you can then edit the files and the changes take effect without restarting your julia session.
A standard workflow is similar to the REPL-based workflow above, with
the following modifications:

1. Put your code in a module somewhere on your load path. There are
   several options for achieving this, of which two recommended choices are:

   a. For long-term projects, use
      [PkgTemplates](https://github.com/invenia/PkgTemplates.jl):

      ```julia
      using PkgTemplates
      t = Template()
      generate("MyPkg", t)
      ```
      This will create a blank package, `"MyPkg"`, in your `.julia/dev` directory.
      Note that PkgTemplates allows you to control many different options
      through its `Template` constructor.

      In step 2 below, edit `MyPkg/src/MyPkg.jl` to change the source code, and
      `MyPkg/test/runtests.jl` for the tests.

   b. For "throw-away" projects, you can avoid any need for cleanup
      by doing your work in your temporary directory (e.g., `/tmp`).

      Navigate to your temporary directory and launch Julia, then do the following:

      ```julia
      pkg> generate MyPkg              # type ] to enter pkg mode
      julia> push!(LOAD_PATH, pwd())   # hit backspace to exit pkg mode
      ```
      If you restart your Julia session you'll have to re-issue that command
      modifying `LOAD_PATH`.

      In step 2 below, edit `MyPkg/src/MyPkg.jl` to change the source code, and create any
      test file of your choosing.

2. Develop your package

   *Before* loading any code, make sure you're running Revise: say
   `using Revise` or follow its documentation on configuring it to run
   automatically.

   Then navigate to the directory containing your test file (here
   assumed to be `"runtests.jl"`) and do the following:

   ```julia
   julia> using MyPkg

   julia> include("runtests.jl")
   ```

   You can iteratively modify the code in MyPkg in your editor and re-run the
   tests with `include("runtests.jl")`.  You generally should not need to restart
   your Julia session to see the changes take effect (subject to a few limitations,
   see https://timholy.github.io/Revise.jl/stable/limitations/).
