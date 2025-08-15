# 常见问题

## 概述

### Julia 的名字来源于某人或某事物吗？

不。

### 为什么不把 Matlab/Python/R 或者其他语言的代码编译为 Julia 呢？

由于大多数人对其他动态语言的语法很熟悉，而且已经在这些动态语言中编写了很多代码，人们也许会问：为什么我们不直接设计以Julia为后端的Matlab或是Python前端（也就是把其他代码“转译”到Julia）？这样既能获得Julia的高性能，也能避免程序员花费精力来学一门新的语言。这是一个简单的解决方案，不是吗？

总的来说，我们这样做是因为 **Julia 编译器没有什么特别之处**：我们使用的是普通的编译器（LLVM），这里面没有什么其他语言开发者所不知道的“独家秘方”。诚然，Julia编译器在许多地方比其他动态语言的编译器更简单（比如 PyPy 和 LuaJIT）。Julia 的性能优势几乎完全来自其前端：它的语义学使得 [高质量的 Julia 程序](@ref man-performance-tips) 能够给予编译器更多的机会来产生高效的代码和内存结构。如果你尝试将 Matlab 或 Python 代码编译为 Julia，我们的编译器会被其语义学限制而不能产生相对现有编译器更好的代码（甚至更差）。语义学的关键角色也正是一些现存的 Python 编译器（像 Numba 和 Pythran）仅仅尝试优化语言的一小部分（比如 Numpy 的矢量与标量运算）的原因，而这些部分已经至少在相同的语义学上与我们做的一样好。致力于这些项目的人员难以置信得聪明并且已经取得了令人惊叹的成就，但为被解释而设计的语言加装编译器是十分困难的。

Julia 的优势在于好的性能不止被限制在一小部分的内置类型与操作，用户能够写出使用任意自定义类型的高级泛型代码，同时也能保证很高的运行与内存效率。在如 Python 一般的语言中，类型没有给编译器提供太多的信息来达成这样的目的，当你试图像使用 Julia 前端一样使用这些语言时，你会遇到困难。

出于类似的原因，自动翻译为 Julia 的代码一般来说会是可读性差、缓慢且违反习惯的代码。这些代码不是从其他语言迁移到 Julia 的好的起点。

另一方面，语言**可迁移性**是极其有用的：我们会在一些时候想要将其他语言的高质量代码迁移到 Julia 中（也可能相反）。这一工作的最佳实践不是翻译器，而是使用简单的跨语言调用。我们对此有许多工作，从内置的 `ccall` （来调用 C 和 Fortran 模块）到[JuliaInterop](https://github.com/JuliaInterop) 包来链接 Julia 和 Python、Matlab、C++ 以及更多语言。

## [公共 API](@id man-api)

### Julia 如何定义其公共 API？

对于 `julia` 版本的 [SemVer](https://semver.org/)，唯一稳定的接口是 Julia 的 `Base` 和 [文档](https://docs.julialang.org/) 中的标准库接口中且未标记为不稳定（例如，实验性的和内部性的）的部分。 如果函数、类型和常量未包含在文档中，则它们不是公共 API 的一部分，_即使它们具有文档_。

### 有一个有用的非官方的函数/类型/常量。我可以使用它吗？

如果您使用非公共 API，更新 Julia 可能会使你的代码失效。 如果代码是自洽的，最好将其复制到你的项目中。 如果你想依赖一个复杂的非公共 API，尤其是从稳定的包中使用它时，最好打开发起 [issue](https://github.com/JuliaLang/julia/issues) 或 [pull request](https://github.com/JuliaLang/julia/pulls) 开始讨论将其转换为公共 API。 尽管你可以在下游自己开发一个包来封装这个内部实现，并且屏蔽不同的 `Julia` 版本差异，但我们并不鼓励这样做。

### 文档不够准确。 我可以依赖现有的行为吗？

请发起一个 [issue](https://github.com/JuliaLang/julia/issues) 或 [pull request](https://github.com/JuliaLang/julia/pulls) 开始讨论将现有行为转换为公共 API。

## 会话和 REPL

### 如何从内存中删除某个对象？

Julia 没有类似于 MATLAB 的 `clear` 函数，某个名称一旦定义在 Julia 的会话中（准确地说，在 `Main` 模块中），它就会一直存在下去。

如果关心内存使用情况，你可以用消耗较少内存的对象替换原对象。 例如，如果 `A` 是一个你不再需要的千兆字节大小的数组，你可以使用 `A = nothing` 来释放内存。 下次垃圾收集器运行时会释放内存； 您可以使用 [`GC.gc()`](@ref Base.GC.gc) 强制执行此操作。 此外，尝试使用 `A` 可能会导致错误，因为大多数方法都没有在类型 `Nothing` 上定义。

### 如何在会话中修改某个类型的声明？

也许你定义了某个类型，后来发现需要向其中增加一个新的域。如果在 REPL 中尝试这样做，会得到一个错误：

```
ERROR: invalid redefinition of constant MyType
```

模块 `Main` 中的类型不能重新定义。

尽管这在开发新代码时会造成不便，但是这个问题仍然有一个不错的解决办法：可以用重新定义的模块替换原有的模块，把所有新代码封装在一个模块里，这样就能重新定义类型和常量了。虽说不能将类型名称导入到 `Main` 模块中再去重新定义，但是可以用模块名来改变作用范围。换言之，开发时的工作流可能类似这样：

```julia
include("mynewcode.jl") # this defines a module MyModule
obj1 = MyModule.ObjConstructor(a, b)
obj2 = MyModule.somefunction(obj1)
# Got an error. Change something in "mynewcode.jl"
include("mynewcode.jl") # reload the module
obj1 = MyModule.ObjConstructor(a, b) # old objects are no longer valid, must reconstruct
obj2 = MyModule.somefunction(obj1) # this time it worked!
obj3 = MyModule.someotherfunction(obj2, c)
...
```

## [脚本](@id man-scripting)

### 该如何检查当前文件是否正在以主脚本运行？

当一个文件通过使用 `julia file.jl` 来当做主脚本运行时，有人也希望激活另外的功能例如命令行参数操作。
确定文件是以这个方式运行的一个方法是检查 `abspath(PROGRAM_FILE) == @__FILE__` 是不是 `true`。

However, it is recommended to not write files that double as a script and as an importable library.
If one needs functionality both available as a library and a script, it is better to write is as a library, then import the functionality into a distinct script.

### [怎样在脚本中捕获 CTRL-C ？](@id catch-ctrl-c)

通过 `julia file.jl` 方式运行的 Julia 脚本，在你尝试按 CTRL-C (SIGINT) 中止它时，并不会抛出 [`InterruptException`](@ref)。如果希望在脚本终止之后运行一些代码，请使用 [`atexit`](@ref)，注意：脚本的中止不一定是由 CTRL-C 导致的。
另外你也可以通过 `julia -e 'include(popfirst!(ARGS))' file.jl` 命令运行脚本，然后可以通过 [`try`](@ref) 捕获 `InterruptException`。
Note that with this strategy [`PROGRAM_FILE`](@ref) will not be set.

### 怎样通过 `#!/usr/bin/env` 传递参数给 `julia`？

Passing options to `julia` in a so-called shebang line, as in
`#!/usr/bin/env julia --startup-file=no`, will not work on many
platforms (BSD, macOS, Linux) where the kernel, unlike the shell, does
not split arguments at space characters. The option `env -S`, which
splits a single argument string into multiple arguments at spaces,
similar to a shell, offers a simple workaround:

```julia
#!/usr/bin/env -S julia --color=yes --startup-file=no
@show ARGS  # put any Julia code here
```

!!! note
    Option `env -S` appeared in FreeBSD 6.0 (2005), macOS Sierra (2016)
    and GNU/Linux coreutils 8.30 (2018).

### Why doesn't `run` support `*` or pipes for scripting external programs?

Julia's [`run`](@ref) function launches external programs *directly*, without
invoking an [operating-system shell](https://en.wikipedia.org/wiki/Shell_(computing))
(unlike the `system("...")` function in other languages like Python, R, or C).
That means that `run` does not perform wildcard expansion of `*` (["globbing"](https://en.wikipedia.org/wiki/Glob_(programming))),
nor does it interpret [shell pipelines](https://en.wikipedia.org/wiki/Pipeline_(Unix)) like `|` or `>`.

You can still do globbing and pipelines using Julia features, however.  For example, the built-in
[`pipeline`](@ref) function allows you to chain external programs and files, similar to shell pipes, and
the [Glob.jl package](https://github.com/vtjnash/Glob.jl) implements POSIX-compatible globbing.

You can, of course, run programs through the shell by explicitly passing a shell and a command string to `run`,
e.g. ```run(`sh -c "ls > files.txt"`)``` to use the Unix [Bourne shell](https://en.wikipedia.org/wiki/Bourne_shell),
but you should generally prefer pure-Julia scripting like ```run(pipeline(`ls`, "files.txt"))```.
The reason why we avoid the shell by default is that [shelling out sucks](https://julialang.org/blog/2012/03/shelling-out-sucks/):
launching processes via the shell is slow, fragile to quoting of special characters,  has poor error handling, and is
problematic for portability.  (The Python developers came to a [similar conclusion](https://www.python.org/dev/peps/pep-0324/#motivation).)

## Variables and Assignments

### Why am I getting `UndefVarError` from a simple loop?

You might have something like:
```
x = 0
while x < 10
    x += 1
end
```
and notice that it works fine in an interactive environment (like the Julia REPL),
but gives ```UndefVarError: `x` not defined``` when you try to run it in script or other
file.   What is going on is that Julia generally requires you to **be explicit about assigning to global variables in a local scope**.

Here, `x` is a global variable, `while` defines a [local scope](@ref scope-of-variables), and `x += 1` is
an assignment to a global in that local scope.

As mentioned above, Julia (version 1.5 or later) allows you to omit the `global`
keyword for code in the REPL (and many other interactive environments), to simplify
exploration (e.g. copy-pasting code from a function to run interactively).
However, once you move to code in files, Julia requires a more disciplined approach
to global variables.  You have least three options:

1. Put the code into a function (so that `x` is a *local* variable in a function). In general, it is good software engineering to use functions rather than global scripts (search online for "why global variables bad" to see many explanations). In Julia, global variables are also [slow](@ref man-performance-tips).
2. Wrap the code in a [`let`](@ref) block.  (This makes `x` a local variable within the `let ... end` statement, again eliminating the need for `global`).
3. Explicitly mark `x` as `global` inside the local scope before assigning to it, e.g. write `global x += 1`.

More explanation can be found in the manual section [on soft scope](@ref on-soft-scope).

## 函数

### 向函数传递了参数 `x`，在函数中做了修改，但是在函数外变量 `x` 的值还是没有变。为什么？

假设函数被如此调用：

```jldoctest
julia> x = 10
10

julia> function change_value!(y)
           y = 17
       end
change_value! (generic function with 1 method)

julia> change_value!(x)
17

julia> x # x is unchanged!
10
```

在 Julia 中，通过将 `x` 作为参数传递给函数，不能改变变量 `x` 的绑定。在上例中，调用 `change_value!(x)` 时，`y` 是一个新建变量，初始时与 `x` 的值绑定，即 `10`。然后 `y` 与常量 `17` 重新绑定，此时变量外作用域中的 `x` 并没有变动。

假设 `x` 被绑定至 `Array` 类型 (也有可能是其他 *可变* 的类型)。在函数中，你无法将 `x` 与 Array *解绑*，但是你可以改变其内容。

```jldoctest
julia> x = [1,2,3]
3-element Vector{Int64}:
 1
 2
 3

julia> function change_array!(A)
           A[1] = 5
       end
change_array! (generic function with 1 method)

julia> change_array!(x)
5

julia> x
3-element Vector{Int64}:
 5
 2
 3
```

这里我们新建了一个函数 `chang_array!`，它把 `5` 赋值给传入的数组（在调用处与 `x` 绑定，在函数中与 `A` 绑定）的第一个元素。注意，在函数调用之后，`x` 依旧与同一个数组绑定，但是数组的内容变化了：变量 `A` 和 `x` 是不同的绑定，引用同一个可变的 `Array` 对象。

### 函数内部能否使用 `using` 或 `import`？

不可以，不能在函数内部使用 `using` 或 `import` 语句。如果你希望导入一个模块，但只在特定的一个或一组函数中使用它的符号，有以下两种方式：

1. 使用 `import`：

   ```julia
   import Foo
   function bar(...)
       # ... refer to Foo symbols via Foo.baz ...
   end
   ```

   这会加载 `Foo` 模块，同时定义一个变量 `Foo` 引用该模块，但并不会
   将其他任何符号从该模块中导入当前的命名空间。
   `Foo` 等符号可以由限定的名称 `Foo.bar` 等引用。
2. 将函数封装到模块中：

   ```julia
   module Bar
   export bar
   using Foo
   function bar(...)
       # ... refer to Foo.baz as simply baz ....
   end
   end
   using Bar
   ```

   这会从 `Foo` 中导入所有符号，但仅限于 `Bar` 模块内。

### 运算符 `...` 有何作用？

#### `...` 运算符的两个用法：slurping 和 splatting

很多 Julia 的新手会对运算符 `...` 的用法感到困惑。让 `...` 用法如此困惑的部分原因是根据上下文它有两种不同的含义。

#### `...` 在函数定义中将多个参数组合成一个参数

在函数定义的上下文中，`...`运算符用来将多个不同的参数组合成单个参数。`...`运算符的这种将多个不同参数组合成单个参数的用法称为slurping：

```jldoctest
julia> function printargs(args...)
           println(typeof(args))
           for (i, arg) in enumerate(args)
               println("Arg #$i = $arg")
           end
       end
printargs (generic function with 1 method)

julia> printargs(1, 2, 3)
Tuple{Int64, Int64, Int64}
Arg #1 = 1
Arg #2 = 2
Arg #3 = 3
```

如果Julia是一个使用ASCII字符更加自由的语言的话，slurping运算符可能会写作`<-...`而非`...`。

#### `...`在函数调用中将一个参数分解成多个不同参数

与在定义函数时表示将多个不同参数组合成一个参数的`...`运算符用法相对，当用在函数调用的上下文中`...`运算符也用来将单个的函数参数分成多个不同的参数。`...`函数的这个用法叫做splatting：

```jldoctest
julia> function threeargs(a, b, c)
           println("a = $a::$(typeof(a))")
           println("b = $b::$(typeof(b))")
           println("c = $c::$(typeof(c))")
       end
threeargs (generic function with 1 method)

julia> x = [1, 2, 3]
3-element Vector{Int64}:
 1
 2
 3

julia> threeargs(x...)
a = 1::Int64
b = 2::Int64
c = 3::Int64
```

如果Julia是一个使用ASCII字符更加自由的语言的话，splatting运算符可能会写作`...->`而非`...`。

### 赋值语句的返回值是什么？

`=`运算符始终返回右侧的值，所以：

```jldoctest
julia> function threeint()
           x::Int = 3.0
           x # returns variable x
       end
threeint (generic function with 1 method)

julia> function threefloat()
           x::Int = 3.0 # returns 3.0
       end
threefloat (generic function with 1 method)

julia> threeint()
3

julia> threefloat()
3.0
```

相似地：

```jldoctest
julia> function twothreetup()
           x, y = [2, 3] # assigns 2 to x and 3 to y
           x, y # returns a tuple
       end
twothreetup (generic function with 1 method)

julia> function twothreearr()
           x, y = [2, 3] # returns an array
       end
twothreearr (generic function with 1 method)

julia> twothreetup()
(2, 3)

julia> twothreearr()
2-element Vector{Int64}:
 2
 3
```

## 类型，类型声明和构造函数

### [何谓“类型稳定”？](@id man-type-stability)

这意味着输出的类型可以由输入的类型预测出来。特别地，这意味着输出的类型不会因输入的*值*的不同而变化。以下代码*不是*类型稳定的：

```jldoctest
julia> function unstable(flag::Bool)
           if flag
               return 1
           else
               return 1.0
           end
       end
unstable (generic function with 1 method)
```

根据参数值的不同，该函数可能返回 `Int` 或 [`Float64`](@ref)。由于 Julia 无法在编译期预测该函数的返回值类型，任何使用该函数的计算都需要考虑这两种可能的返回类型，这样难以生成高效的机器码。

### [为何 Julia 对某个看似合理的操作返回 `DomainError`？](@id faq-domain-errors)

某些运算在数学上有意义，但会产生错误：

```jldoctest
julia> sqrt(-2.0)
ERROR: DomainError with -2.0:
sqrt was called with a negative real argument but will only return a complex result if called with a complex argument. Try sqrt(Complex(x)).
Stacktrace:
[...]
```

这一行为是为了保证类型稳定而带来的不便。对于 [`sqrt`](@ref)，许多用户会希望 `sqrt(2.0)` 产生一个实数，如果得到了复数 `1.4142135623730951 + 0.0im` 则会不高兴。也可以编写 [`sqrt`](@ref) 函数，只有当传递一个负数时才切换到复值输出，但结果将不是[类型稳定](@ref man-type-stability)的，而且 [`sqrt`](@ref) 函数的性能会很差。

在这样那样的情况下，若你想得到希望的结果，你可以选择一个*输入类型*，它可以使根据你的想法接受一个*输出类型*，从而结果可以这样表示：

```jldoctest
julia> sqrt(-2.0+0im)
0.0 + 1.4142135623730951im
```

### 怎样限制或计算类型参数？

[参数类型](@ref Parametric-Types) 的参数可以包含类型或比特值，并且类型本身选择如何使用这些参数。
例如，`Array{Float64, 2}` 由类型 `Float64` 参数化以表示其元素类型，并通过整数值 `2` 来表示其维度数。
在定义自己的参数类型时，可以使用子类型约束来声明某个参数必须是某个抽象类型的子类型 ([`<:`](@ref)) 或以前的类型参数。
但是，没有专用的语法来声明参数必须是给定类型的_值_ — 也就是说，例如，你不能在`struct`定义中直接声明一个维度参数 [`isa`](@ref) `Int`。
同样，你不能对类型参数进行计算（包括简单的加法或减法）。相反，这些类型的约束和关系可以通过在类型的 [构造函数](@ref man-constructors) 中计算和强制执行的附加类型参数来表达。

例如，考虑
```julia
struct ConstrainedType{T,N,N+1} # NOTE: INVALID SYNTAX
    A::Array{T,N}
    B::Array{T,N+1}
end
```
其中，用户希望强制第三个类型参数始终是第二个参数加一。 这可以使用显式类型参数来实现，该参数由 [内部构造函数方法](@ref man-inner-constructor-methods)（可以与其他检查结合使用）进行检查：
```julia
struct ConstrainedType{T,N,M}
    A::Array{T,N}
    B::Array{T,M}
    function ConstrainedType(A::Array{T,N}, B::Array{T,M}) where {T,N,M}
        N + 1 == M || throw(ArgumentError("second argument should have one more axis" ))
        new{T,N,M}(A, B)
    end
end
```
这种检查通常是*无成本的*，因为编译器可以省略对有效具体类型的检查。 如果还计算了第二个参数，则提供执行此计算的 [外部构造函数方法](@ref man-outer-constructor-methods) 可能更好：
```julia
ConstrainedType(A) = ConstrainedType(A, compute_B(A))
```

### [为什么Julia使用机器算法进行整数运算？](@id faq-integer-arithmetic)

Julia使用机器算法进行整数计算。这意味着`Int`的范围是有界的，值在范围的两端循环，也就是说整数的加法，减法和乘法会出现上溢或者下溢，导致出现某些从开始就令人不安的结果：

```jldoctest
julia> x = typemax(Int)
9223372036854775807

julia> y = x+1
-9223372036854775808

julia> z = -y
-9223372036854775808

julia> 2*z
0
```

无疑，这与数学上的整数的行为很不一样，并且你会想对于高阶编程语言来说把这个暴露给用户难称完美。然而，对于效率优先和透明度优先的数值计算来说，其他的备选方案可谓更糟。

一个备选方案是去检查每个整数运算是否溢出，如果溢出则将结果提升到更大的整数类型比如[`Int128`](@ref)或者[`BigInt`](@ref)。 不幸的是，这会给所有的整数操作（比如让循环计数器自增）带来巨大的额外开销 — 这需要生成代码去在算法指令后进行运行溢出检测，并生成分支去处理潜在的溢出。更糟糕的是，这会让涉及整数的所有运算变得类型不稳定。如同上面提到的，对于高效生成高效的代码[类型稳定很重要](@ref man-type-stability)。如果不指望整数运算的结果是整数，就无法想C和Fortran编译器一样生成快速简单的代码。

这个方法有个变体可以避免类型不稳定的出现，这个变体是将类型`Int`和[`BigInt`](@ref)合并成单个混合整数类型，当结果不再满足机器整数的大小时会内部自动切换表示。虽然表面上在Julia代码层面解决了类型不稳定，但是这个只是通过将所有的困难硬塞给实现混合整数类型的C代码而掩盖了这个问题。这个方法*可能*有用，甚至在很多情况下速度很快，但是它有很多缺点。一个缺点是整数和整数数组的内存上的表示不再与C、Fortran和其他使用原生机器整数的怨言所使用的自然表示一样。所以，为了与那些语言协作，我们无论如何最终都需要引入原生整数类型。任何整数的无界表示都不会占用固定的比特数，所以无法使用固定大小的槽来内联地存储在数组中 — 大的整数值通常需要单独的堆分配的存储。并且无论使用的混合整数实现多么智能，总会存在性能陷阱 — 无法预期的性能下降的情况。复杂的表示，与C和Fortran协作能力的缺乏，无法在不使用另外的堆存储的情况下表示整数数组，和无法预测的性能特性让即使是最智能化的混合整数实现对于高性能数值计算来说也是个很差的选择。

除了使用混合整数和提升到BigInt，另一个备选方案是使用饱和整数算法，此时最大整数值加一个数时值保持不变，最小整数值减一个数时也是同样的。这就是Matlab™的做法：

```
>> int64(9223372036854775807)

ans =

  9223372036854775807

>> int64(9223372036854775807) + 1

ans =

  9223372036854775807

>> int64(-9223372036854775808)

ans =

 -9223372036854775808

>> int64(-9223372036854775808) - 1

ans =

 -9223372036854775808
```

乍一看，这个似乎足够合理，因为9223372036854775807比-9223372036854775808更接近于9223372036854775808并且整数还是以固定大小的自然方式表示的，这与C和Fortran相兼容。但是饱和整数算法是很有问题的。首先最明显的问题是这并不是机器整数算法的工作方式，所以实现饱和整数算法需要生成指令，在每个机器整数运算后检查上溢或者下溢并正确地讲这些结果用[`typemin(Int)`](@ref)或者[`typemax(Int)`](@ref)取代。单单这个就将整数运算从单语句的快速的指令扩展成六个指令，还可能包括分支。哎呦喂~~但是还有更糟的 — 饱和整数算法并不满足结合律。考虑下列的Matlab计算：

```
>> n = int64(2)^62
4611686018427387904

>> n + (n - 1)
9223372036854775807

>> (n + n) - 1
9223372036854775806
```

这就让写很多基础整数算法变得困难因为很多常用技术都是基于有溢出的机器加法*是*满足结合律这一事实的。考虑一下在Julia中求整数值`lo`和`hi`之间的中点值，使用表达式`(lo + hi) >>> 1`:

```jldoctest
julia> n = 2^62
4611686018427387904

julia> (n + 2n) >>> 1
6917529027641081856
```

看到了吗？没有任何问题。那就是2^62和2^63之间的正确地中点值，虽然`n + 2n`的值是 -4611686018427387904。现在使用Matlab试一下：

```
>> (n + 2*n)/2

ans =

  4611686018427387904
```

哎呦喂。在Matlab中添加`>>>`运算符没有任何作用，因为在将`n`与`2n`相加时已经破坏了能计算出正确地中点值的必要信息，已经出现饱和。

没有结合性不但对于不能依靠像这样的技术的程序员是不幸的，并且让几乎所有的希望优化整数算法的编译器铩羽而归。例如，因为Julia中的整数使用平常的机器整数算法，LLVM就可以自由地激进地优化像`f(k) = 5k-1`这样的简单地小函数。这个函数的机器码如下所示：

```julia-repl
julia> code_native(f, Tuple{Int})
  .text
Filename: none
  pushq %rbp
  movq  %rsp, %rbp
Source line: 1
  leaq  -1(%rdi,%rdi,4), %rax
  popq  %rbp
  retq
  nopl  (%rax,%rax)
```

这个函数的实际函数体只是一个简单地`leap`指令，可以立马计算整数乘法与加法。当`f`内联在其他函数中的时候这个更加有益：

```julia-repl
julia> function g(k, n)
           for i = 1:n
               k = f(k)
           end
           return k
       end
g (generic function with 1 methods)

julia> code_native(g, Tuple{Int,Int})
  .text
Filename: none
  pushq %rbp
  movq  %rsp, %rbp
Source line: 2
  testq %rsi, %rsi
  jle L26
  nopl  (%rax)
Source line: 3
L16:
  leaq  -1(%rdi,%rdi,4), %rdi
Source line: 2
  decq  %rsi
  jne L16
Source line: 5
L26:
  movq  %rdi, %rax
  popq  %rbp
  retq
  nop
```

因为`f`的调用内联化，循环体就只是简单地`leap`指令。接着，考虑一下如果循环迭代的次数固定的时候会发生什么：

```julia-repl
julia> function g(k)
           for i = 1:10
               k = f(k)
           end
           return k
       end
g (generic function with 2 methods)

julia> code_native(g,(Int,))
  .text
Filename: none
  pushq %rbp
  movq  %rsp, %rbp
Source line: 3
  imulq $9765625, %rdi, %rax    # imm = 0x9502F9
  addq  $-2441406, %rax         # imm = 0xFFDABF42
Source line: 5
  popq  %rbp
  retq
  nopw  %cs:(%rax,%rax)
```

因为编译器知道整数加法和乘法是满足结合律的并且乘法可以在加法上使用分配律 — 两者在饱和算法中都不成立 — 所以编译器就可以把整个循环优化到只有一个乘法和一个加法。饱和算法完全无法使用这种优化，因为在每个循环迭代中结合律和分配律都会失效导致不同的失效位置会得到不同的结果。编译器可以展开循环，但是不能代数上将多个操作简化到更少的等效操作。

让整数算术沉默地溢出的最合理替代方法是在任何地方进行检查算术，在加法、减法和乘法溢出时引发错误，产生不正确的值。 在这篇[博文](https://danluu.com/integer-overflow/)中，Dan Luu 对此进行了分析，并发现这种方法在理论上应该具有的微不足道的成本，但由于编译器（LLVM 和 GCC）没有优雅地围绕添加的溢出检查进行优化，它最终会产生大量成本。 如果这在未来有所改善，我们可以考虑在 Julia 中默认使用检查整数算法，但现在，我们必须忍受可能会溢出这一现状。

同时，可以通过使用[SaferIntegers.jl](https://github.com/JeffreySarnoff/SaferIntegers.jl)等外部库来实现溢出安全的整数运算。 请注意，如前所述，使用这些库会显着增加使用已检查整数类型的代码的执行时间。 但是，对于有限的使用，这远比将其用于所有整数运算时的问题要小得多。你可以在 [此处](https://github.com/JuliaLang/julia/issues/855) 中关注讨论的状态。


### 在远程执行中`UndefVarError`的可能原因有哪些？

如同这个错误表述的，远程结点上的`UndefVarError`的直接原因是变量名的绑定并不存在。让我们探索一下一些可能的原因。

```julia-repl
julia> module Foo
           foo() = remotecall_fetch(x->x, 2, "Hello")
       end

julia> Foo.foo()
ERROR: On worker 2:
UndefVarError: `Foo` not defined
Stacktrace:
[...]
```

闭包`x->x`中有`Foo`的引用，因为`Foo`在节点2上不存在，所以`UndefVarError`被扔出。

在模块中而非`Main`中的全局变量不会在远程节点上按值序列化。只传递了一个引用。新建全局绑定的函数（除了`Main`中）可能会导致之后扔出`UndefVarError`。

```julia-repl
julia> @everywhere module Foo
           function foo()
               global gvar = "Hello"
               remotecall_fetch(()->gvar, 2)
           end
       end

julia> Foo.foo()
ERROR: On worker 2:
UndefVarError: `gvar` not defined
Stacktrace:
[...]
```

在上面的例子中，`@everywhere module Foo`在所有节点上定义了`Foo`。但是调用`Foo.foo()`在本地节点上新建了新的全局绑定`gvar`，但是节点2中并没有找到这个绑定，这会导致`UndefVarError`错误。

注意着并不适用于在模块`Main`下新建的全局变量。模块`Main`下的全局变量会被序列化并且在远程节点的`Main`下新建新的绑定。

```julia-repl
julia> gvar_self = "Node1"
"Node1"

julia> remotecall_fetch(()->gvar_self, 2)
"Node1"

julia> remotecall_fetch(varinfo, 2)
name          size summary
––––––––– –––––––– –––––––
Base               Module
Core               Module
Main               Module
gvar_self 13 bytes String
```

这并不适用于`函数`或者`结构体`声明。但是绑定到全局变量的匿名函数被序列化，如下例所示。

```julia-repl
julia> bar() = 1
bar (generic function with 1 method)

julia> remotecall_fetch(bar, 2)
ERROR: On worker 2:
UndefVarError: `#bar` not defined
[...]

julia> anon_bar  = ()->1
(::#21) (generic function with 1 method)

julia> remotecall_fetch(anon_bar, 2)
1
```

## “method not matched” 故障排除：参数类型不变性和`MethodError`

### Why doesn't it work to declare `foo(bar::Vector{Real}) = 42` and then call `foo([1])`?

As you'll see if you try this, the result is a `MethodError`:

```jldoctest
julia> foo(x::Vector{Real}) = 42
foo (generic function with 1 method)

julia> foo([1])
ERROR: MethodError: no method matching foo(::Vector{Int64})

Closest candidates are:
  foo(!Matched::Vector{Real})
   @ Main none:1

Stacktrace:
[...]
```

This is because `Vector{Real}` is not a supertype of `Vector{Int}`! You can solve this problem with something
like `foo(bar::Vector{T}) where {T<:Real}` (or the short form `foo(bar::Vector{<:Real})` if the static parameter `T`
is not needed in the body of the function). The `T` is a wild card: you first specify that it must be a
subtype of Real, then specify the function takes a Vector of with elements of that type.

This same issue goes for any composite type `Comp`, not just `Vector`. If `Comp` has a parameter declared of
type `Y`, then another type `Comp2` with a parameter of type `X<:Y` is not a subtype of `Comp`. This is
type-invariance (by contrast, Tuple is type-covariant in its parameters). See [Parametric Composite
Types](@ref man-parametric-composite-types) for more explanation of these.

### Why does Julia use `*` for string concatenation? Why not `+` or something else?

### 为什么声明 `foo(bar::Vector{Real}) = 42` 然后调用 `foo([1])` 不起作用？

如果你尝试了，结果就会看到`MethodError`:

```jldoctest
julia> foo(x::Vector{Real}) = 42
foo (generic function with 1 method)

julia> foo([1])
ERROR: MethodError: no method matching foo(::Vector{Int64})
Closest candidates are:
  foo(!Matched::Vector{Real}) at none:1
```

There are several differences between `using` and `import`
(see the [Modules section](https://docs.julialang.org/en/v1/manual/modules/#modules)),
but there is an important difference that may not seem intuitive at first glance,
and on the surface (i.e. syntax-wise) it may seem very minor. When loading modules with `using`,
you need to say `function Foo.bar(...` to extend module `Foo`'s function `bar` with a new method,
but with `import Foo.bar`, you only need to say `function bar(...` and it automatically extends
module `Foo`'s function `bar`.

同样的问题适用于任何复合类型`Comp`，而不仅仅是`Vector`。 如果`Comp` 有一个声明为`Y` 类型的参数，那么另一个带有`X<:Y` 类型参数的类型`Comp2` 不是`Comp` 的子类型。 这是类型不变性（相比之下，元组在其参数中是类型协变的）。 有关这些的更多解释，请参阅 [参数复合类型](@ref man-parametric-composite-types)。

### 为什么 Julia 使用 `*` 进行字符串拼接？而不是使用 `+` 或其他符号？

使用 `+`  的[主要依据](@ref man-concatenation)是：字符串拼接是不可交换的操作，而 `+` 通常是一个具有可交换性的操作符。Julia 社区也意识到其他语言使用了不同的操作符，一些用户也可能不熟悉 `*` 包含的特定代数性值。

注意：你也可以用 `string(...)` 来拼接字符串和其他能转换成字符串的值；
类似的 `repeat` 函数可以用于替代用于重复字符串的 `^` 操作符。
[字符串插值语法](@ref string-interpolation)在构造字符串时也很常用。

## 包和模块

### "using"和"import"的区别是什么？

只有一个区别，并且在表面上（语法层面）这个区别看来很小。`using`和`import`的区别是使用`using`时你需要写`function Foo.bar(..`来用一个新方法来扩展模块Foo的函数bar，但是使用`import Foo.bar`时，你只需要写`function bar(...`，会自动扩展模块Foo的函数bar。

这个区别足够重要以至于提供不同的语法的原因是你不希望意外地扩展一个你根本不知道其存在的函数，因为这很容易造成bug。对于使用像字符串后者整数这样的常用类型的方法最有可能出现这个问题，因为你和其他模块都可能定义了方法来处理这样的常用类型。如果你使用`import`，你会用你自己的新实现覆盖别的函数的`bar(s::AbstractString)`实现，这会导致做的事情天差地别（并且破坏模块Foo中其他的依赖于调用bar的函数的所有/大部分的将来的使用）。

## 空值与缺失值

### [在Julia中"null"，"空"或者"缺失"是怎么工作的?](@id faq-nothing)

不像其它很多语言（例如 C 和 Java），Julia 对象默认不能为"null"。当一个引用（变量，对象域，或者数组元素）没有被初始化，访问它会立即扔出一个错误。这种情况可以使用函数 [`isdefined`](@ref) 或者 [`isassigned`](@ref Base.isassigned) 检测到。

一些函数只为了其副作用使用，并不需要返回一个值。在这些情况下，约定的是返回 `nothing` 这个值，这只是 `Nothing` 类型的一个单例对象。这是一个没有域的一般类型；除了这个约定之外没有任何特殊点，REPL 不会为它打印任何东西。有些语言结构不会有值，也产生 `nothing`，例如 `if false; end`。

对于类型`T`的值`x`只会有时存在的情况，`Union{T,Nothing}`类型可以用作函数参数，对象域和数组元素的类型，与其他语言中的[`Nullable`, `Option` or `Maybe`](https://en.wikipedia.org/wiki/Nullable_type)相等。如果值本身可以是`nothing`(显然当`T`是`Any`时），`Union{Some{T}, Nothing}`类型更加准确因为`x == nothing`表示值的缺失，`x == Some(nothing)`表示与`nothing`相等的值的存在。[`something`](@ref)函数允许使用默认值的展开的`Some`对象，而非`nothing`参数。注意在使用`Union{T,Nothing}`参数或者域时编译器能够生成高效的代码。

在统计环境下表示缺失的数据（R 中的 `NA` 或者 SQL 中的 `NULL`）请使用 [`missing`](@ref) 对象。请参照[`缺失值`](@ref missing)章节来获取详细信息。

在某些语言中，空元组 (`()`) 被认为是"没有“的规范形式。但是，在 julia 中，最好将其视为恰好包含零个值的常规元组。

空（或者"底层"）类型，写作`Union{}`（空的union类型）是没有值和子类型（除了自己）的类型。通常你没有必要用这个类型。

## 内存

### 为什么当`x`和`y`都是数组时`x += y`还会申请内存？

在 Julia 中，`x += y` 在语法分析中会用 `x = x + y` 代替。对于数组，结果就是它会申请一个新数组来存储结果，而非把结果存在 `x` 同一位置的内存上。
If you prefer to mutate `x`, use `x .+= y` to update each element individually.

这个行为可能会让一些人吃惊，但是这个结果是经过深思熟虑的。主要原因是Julia中的不可变对象，这些对象一旦新建就不能改变他们的值。实际上，数字是不可变对象，语句`x = 5; x += 1`不会改变`5`的意义，改变的是与`x`绑定的值。对于不可变对象，改变其值的唯一方法是重新赋值。

为了稍微详细一点，考虑下列的函数：

```julia
function power_by_squaring(x, n::Int)
    ispow2(n) || error("此实现只适用于2的幂")
    while n >= 2
        x *= x
        n >>= 1
    end
    x
end
```

在`x = 5; y = power_by_squaring(x, 4)`调用后，你可以得到期望的结果`x == 5 && y == 625`。然而，现在假设当`*=`与矩阵一起使用时会改变左边的值，这会有两个问题：

  * 对于普通的方阵，`A = A*B` 不能在没有临时存储的情况下实现：`A[1,1]`
    会被计算并且在被右边使用完之前存储在左边。
  * 假设你愿意申请一个计算的临时存储（这会消除
    `*=`就地计算的大部分要点）；如果你利用了`x`的可变性，
    这个函数会对于可变和不可变的输入有不同的行为。特别地，
    对于不可变的`x`，在调用后（通常）你会得到`y != x`，而对可变的`x`，你会有`y == x`。

因为支持范用计算被认为比能使用其他方法完成的潜在的性能优化（比如使用广播或显式循环）更加重要，所以像`+=`和`*=`运算符以绑定新值的方式工作。

## [异步 IO 与并发同步写入](@id faq-async-io)

### 为什么对于同一个流的并发写入会导致相互混合的输出？

虽然流式 I/O 的 API 是同步的，底层的实现是完全异步的。

思考一下下面的输出：

```jldoctest
julia> @sync for i in 1:3
           @async write(stdout, string(i), " Foo ", " Bar ")
       end
123 Foo  Foo  Foo  Bar  Bar  Bar
```

这是因为，虽然`write`调用是同步的，每个参数的写入在等待那一部分I/O完成时会生成其他的Tasks。

`print`和`println`在调用中会"锁定"该流。因此把上例中的`write`改成`println`会导致：

```jldoctest
julia> @sync for i in 1:3
           @async println(stdout, string(i), " Foo ", " Bar ")
       end
1 Foo  Bar
2 Foo  Bar
3 Foo  Bar
```

你可以使用`ReentrantLock`来锁定你的写入，就像这样：

```jldoctest
julia> l = ReentrantLock();

julia> @sync for i in 1:3
           @async begin
               lock(l)
               try
                   write(stdout, string(i), " Foo ", " Bar ")
               finally
                   unlock(l)
               end
           end
       end
1 Foo  Bar 2 Foo  Bar 3 Foo  Bar
```

## 数组

### [零维数组和标量之间的有什么差别？](@id faq-array-0dim)

零维数组是`Array{T,0}`形式的数组，它与标量的行为相似，但是有很多重要的不同。这值得一提，因为这是使用数组的范用定义来解释也符合逻辑的特殊情况，虽然最开始看起来有些非直觉。下面一行定义了一个零维数组：

```
julia> A = zeros()
0-dimensional Array{Float64,0}:
0.0
```

在这个例子中，`A`是一个含有一个元素的可变容器，这个元素可以通过`A[] = 1.0`来设置，通过`A[]`来读取。所有的零维数组都有同样的大小（`size(A) == ()`）和长度（`length(A) == 1`）。特别地，零维数组不是空数组。如果你觉得这个非直觉，这里有些想法可以帮助理解Julia的这个定义。

* 类比的话，零维数组是"点"，向量是"线"而矩阵
  是"面"。就像线没有面积一样（但是也能代表事物的一个集合）,
  点没有长度和任意一个维度（但是也能表示一个事物）。
* 我们定义`prod(())`为1，一个数组中的所有的元素个数是
  大小的乘积。零维数组的大小为`()`，所以
  它的长度为`1`。
* 零维数组没有任何你可以索引的维度——它们仅仅是`A[]`。我们可以给它们应用同样的"尾一"规则就像对其它维度数组那样，比如`A[1]`，`A[1,1]`，等；参见[Omitted and extra indices](@ref).
   
   
   

理解它与普通的标量之间的区别也很重要。标量不是一个可变的容器（尽管它们是可迭代的，可以定义像`length`，`getindex`这样的东西，*例如*`1[] == 1`）。特别地，如果`x = 0.0`是以一个标量来定义，尝试通过`x[] = 1.0`来改变它的值会报错。标量`x`能够通过`fill(x)`转化成包含它的零维数组，并且相对地，一个零维数组`a`可以通过`a[]`转化成其包含的标量。另外一个区别是标量可以参与到线性代数运算中，比如`2 * rand(2,2)`，但是零维数组的相似操作`fill(2) * rand(2,2)`会报错。

### 为什么我的Julia的线性代数操作测试与其他的语言不同。

你可能找到一些简单的线性代数测试，比如，

```julia
using BenchmarkTools
A = randn(1000, 1000)
B = randn(1000, 1000)
@btime $A \ $B
@btime $A * $B
```

也许和其他语言不同比如Matlab或R。

由于像这样的操作都非常直接地从相关的BLAS函数调用，这样做的原因是，

1. 在每种语言中使用的BLAS库

2. 并发线程的数量

Julia 编译并使用自己的 OpenBLAS 副本，当前线程数上限为 8（或内核数）。

修改 OpenBLAS 设置或使用不同的 BLAS 库编译 Julia，例如 [Intel MKL](https://software.intel.com/en-us/mkl)，可能会提高性能。 你可以使用 [MKL.jl](https://github.com/JuliaComputing/MKL.jl)，这是一个使 Julia 的线性代数使用英特尔 MKL BLAS 和 LAPACK 而不是 OpenBLAS 的包，或搜索论坛以获取有关如何使用的建议。 请注意，英特尔 MKL 不能与 Julia 捆绑在一起，因为它不是开源的。

## 计算集群

### 我该如何管理分布式文件系统的预编译缓存？

When using Julia in high-performance computing (HPC) facilities with shared filesystems, it is recommended to use a shared
depot (via the `JULIA_DEPOT_PATH` environment variable). Since Julia v1.10, multiple Julia processes on functionally similar
workers and using the same depot will coordinate via pidfile locks to only spend effort precompiling on one process while the
others wait. The precompilation process will indicate when the process is precompiling or waiting for another that is
precompiling. If non-interactive the messages are via `@debug`.

However, due to caching of binary code, the cache rejection since v1.9 is more strict and users may need to set the
[`JULIA_CPU_TARGET`](@ref JULIA_CPU_TARGET) environment variable appropriately to get a single cache that is usable throughout the HPC
environment.

## Julia 版本发布

### 你希望使用稳定的、长期支持的或是每日构建版本的Julia？

Julia 的稳定版是最新发布的 Julia 版本，这是大多数人想要运行的版本。 它具有最新的功能，包括改进的性能。 Julia 的稳定版本根据 [SemVer](https://semver.org/) 版本化为 v1.x.y。 在作为候选版本进行几周的测试后，大约每 4-5 个月就会发布一个与新稳定版本相对应的新 Julia 次要版本。 与 LTS 版本不同，在 Julia 的另一个稳定版本发布后，稳定版本通常不会收到错误修正。 但是，始终可以升级到下一个稳定版本，因为 Julia v1.x 的每个版本都将继续运行为早期版本编写的代码。

如果正在寻找非常稳定的代码库，你可能更喜欢 Julia 的 LTS（长期支持）版本。 Julia 当前的 LTS 版本根据 SemVer 版本为 v1.0.x； 此分支将继续接收错误修复，直到选择新的 LTS 分支，此时 v1.0.x 系列将不再收到常规错误修复，建议除最保守的用户之外的所有用户升级到新的 LTS 版本系列。作为软件包开发人员，你可能更喜欢针对 LTS 版本进行开发，以最大限度地增加可以使用你的软件包的用户数量。 根据 SemVer，为 v1.0 编写的代码将继续适用于所有未来的 LTS 和稳定版本。 一般来说，即使针对 LTS，也可以在最新的 Stable 版本中开发和运行代码，以利用改进的性能； 只要避免使用新功能（例如添加的库函数或新方法）。

如果您想利用该语言的最新更新，您可能更喜欢 Julia 的每日构建版本，并且不介意今天可用的版本是否偶尔无法正常工作。 顾名思义，每日构建版本的发布大约每晚发布一次（取决于构建基础设施的稳定性）。 一般来说，每日构建的发布是相当安全的——你的代码不会着火。 然而，它们可能出现偶尔的版本倒退和问题，直到更彻底的预发布测试才会发现。 你可能希望针对每日构建版本进行测试，以确保在发布之前捕获影响你的用例的版本倒退。

最后，您也可以考虑为自己从源代码构建 Julia。 此选项主要适用于那些熟悉命令行或对学习感兴趣的人。 如果你是这样的人，你可能也有兴趣阅读我们的 [贡献指南](https://github.com/JuliaLang/julia/blob/master/CONTRIBUTING.md)。

可以在[https://julialang.org/downloads/](https://julialang.org/downloads/)的下载页面上找到每种下载类型的链接。 请注意，并非所有版本的Julia都适用于所有平台。

### 更新我的 Julia 版本后，如何转移已安装软件包的列表？

julia 的每个次要版本都有自己的默认 [环境](https://docs.julialang.org/en/v1/manual/code-loading/#Environments-1)。 因此，在安装新的 Julia 次要版本时，默认情况下你使用先前次要版本添加的包将不可用。 给定 julia 版本的环境由文件`Project.toml`和`Manifest.toml`定义，文件夹中的文件与`.julia/environments/`中的版本号匹配，例如`.julia/environments/v1.3`。

如果你安装了一个新的 Julia 次要版本，比如 `1.4`，并且想要在它的默认环境中使用与以前版本（例如 `1.3`）相同的包，你可以从`1.3` 文件夹复制文件 `Project.toml` 的内容到`1.4`。然后，在新的 Julia 版本的会话中，输入`]` 键进入“包管理模式”，并运行命令 [`instantiate`](https://julialang.github.io/Pkg.jl/v1/api/#Pkg.instantiate)。

此操作将从复制的文件中解析一组与目标 Julia 版本兼容的可行包，并在合适时安装或更新它们。 如果你不仅要重现软件包，还要重现在以前的 Julia 版本中使用的版本，您还应该在运行 Pkg 命令 `instantiate` 之前复制 `Manifest.toml` 文件。 但是，请注意，包可能定义了兼容性约束，这些约束可能会受到更改 Julia 版本的影响，因此你在`1.3`中拥有的确切版本集可能不适用于`1.4`。
