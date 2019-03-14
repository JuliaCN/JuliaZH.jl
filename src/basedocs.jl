import Base.BaseDocs: @kw_str

"""
**欢迎来到 Julia $(string(VERSION)).** 完整的中文手册可以在这里找到

    https://docs.juliacn.com/

更多中文资料和教程，也请关注 Julia 中文社区

    https://cn.julialang.org

新手请参考中文 discourse 上的新手指引

    https://discourse.juliacn.com/t/topic/159

输入 `?`， 然后输入你想要查看帮助文档的函数或者宏名称就可以查看它们的文档。例如 `?cos`, 或者 `?@time` 然后按回车键即可。

在 REPL 中输入 `ENV["REPL_LOCALE"]=""` 将恢复英文模式。再次回到中文模型请输入 `ENV["REPL_LOCALE"]="zh_CN"`。
"""
kw"help", kw"?", kw"julia", kw""


"""
    using

`using Foo` 将会加载一个名为 `Foo` 的模块（module）或者一个包，然后其 [`export`](@ref) 的名称将可以直接使用。不论是否被 `export`，名称都可以通过点来访问（例如，输入 `Foo.foo` 来访问到 `foo`）。查看[手册中关于模块的部分](@ref modules)以获取更多细节。
"""
kw"using"

"""
    import

`import Foo` 将会加载一个名为 `Foo` 的模块（module）或者一个包。`Foo` 模块中的名称可以通过点来访问到（例如，输入 `Foo.foo` 可以获取到 `foo`）。查看[手册中关于模块的部分](@ref modules)以获取更多细节。
"""
kw"import"

"""
    export

`export` 被用来在模块中告诉Julia哪些函数或者名字可以由用户使用。例如 `export foo` 将在 [`using`](@ref) 这个 module 的时候使得 `foo`可以直接被访问到。查看[手册中关于模块的部分](@ref modules)以获取更多细节。
"""
kw"export"

"""
    abstract type

`abstract type` 声明来一个不能实例化的类型，它将仅仅作为类型图中的一个节点存在，从而能够描述一系列相互关联的具体类型（concrete type）：这些具体类型都是抽象类型的子节点。抽象类型在概念上使得 Julia 的类型系统不仅仅是一系列对象的集合。例如：

```julia
abstract type Number end
abstract type Real <: Number end
```

[`Number`](@ref) 没有父节点（父类型）, 而 [`Real`](@ref) 是 `Number` 的一个抽象子类型。
"""
kw"abstract type"

"""
    module

`module` 会声明一个 `Module` 类型的实例用于描述一个独立的变量名空间。在一个模块（module）里，你可以控制来自于其它模块的名字是否可见（通过载入，import），你也可以决定你的名字有哪些是可以公开的（通过暴露，export）。模块使得你在在创建上层定义时无需担心命名冲突。查看[手册中关于模块的部分](@ref modules)以获取更多细节。

# 例子
```julia
module Foo
import Base.show
export MyType, foo

struct MyType
    x
end

bar(x) = 2x
foo(a::MyType) = bar(a.x) + 1
show(io::IO, a::MyType) = print(io, "MyType \$(a.x)")
end
```
"""
kw"module"

"""
    baremodule

`baremodule` 将声明一个不包含 `using Base` 或者 `eval` 定义的模块。但是它将仍然载入 `Core` 模块。
"""
kw"baremodule"

"""
    primitive type

`primitive type` 声明了一个其数据仅仅由一系列二进制数表示的具体类型。比较常见的例子是整数类型和浮点类型。下面是一些内置的原始类型（primitive type）：

```julia
primitive type Char 32 end
primitive type Bool <: Integer 8 end
```

名称后面的数字表达了这个类型存储所需的比特数目。目前这个数字要求是 8 bit 的倍数。[`Bool`](@ref) 类型的声明展示了一个原始类型如何选择成为另一个类型的子类型。
"""
kw"primitive type"


"""
    macro

`macro` 定义了一种会将生成的代码包含在最终程序体中的方法，这称之为宏。一个宏将一系列输入映射到一个表达式，然后所返回的表达式将会被直接进行编译而不需要在运行时调用 `eval` 函数。宏的输入可以包括表达式、字面量和符号。例如：

# 例子

```jldoctest
julia> macro sayhello(name)
           return :( println("Hello, ", \$name, "!") )
       end
@sayhello (macro with 1 method)

julia> @sayhello "小明"
Hello, 小明!
```
"""
kw"macro"

"""
    local

`local`将会定义一个新的局部变量。

查看[手册：变量作用域](@ref scope-of-variables)以获取更详细的信息。

# 例子
```jldoctest
julia> function foo(n)
           x = 0
           for i = 1:n
               local x # introduce a loop-local x
               x = i
           end
           x
       end
foo (generic function with 1 method)

julia> foo(10)
0
```
"""
kw"local"

"""
    global

`global x` 将会使得当前作用域和当前作用所包含的作用域里的 `x` 指向名为 `x` 的全局变量。查看[手册：变量作用域](@ref scope-of-variables)以获取更多信息。

# 例子
```jldoctest
julia> z = 3
3

julia> function foo()
           global z = 6 # use the z variable defined outside foo
       end
foo (generic function with 1 method)

julia> foo()
6

julia> z
6
```
"""
kw"global"

"""
    let

`let` 会在每次被运行时声明一个新的变量绑定。这个新的变量绑定将拥有一个新的地址。这里的不同只有当变量通过闭包生存在它们的作用域外时才会显现。`let` 语法接受逗号分割的一系列赋值语句和变量名：

```julia
let var1 = value1, var2, var3 = value3
    code
end
```

这些赋值语句是按照顺序求值的，等号右边的表达式将会首先求值，然后才绑定给左边的变量。因此这使得 `let x = x` 这样的表达式有意义，因为这两个 `x` 变量将具有不同的地址。
"""
kw"let"

"""
    quote

`quote` 会将其包含的代码扩变成一个多重的表达式对象，而无需显示调用 `Expr` 的构造器。这称之为引用，比如说

```julia
ex = quote
    x = 1
    y = 2
    x + y
end
```

和其它引用方式不同的是，`:( ... )`形式的引用（被包含时）将会在表达式树里引入一个在操作表达式树时必须要考虑的 `QuoteNode` 元素。而在其它场景下，`:( ... )`和 `quote .. end` 代码块是被同等对待的。
"""
kw"quote"


"""
    '

厄米算符（共轭转置），参见 [`adjoint`](@ref)

# 例子
```jldoctest
julia> A = [1.0 -2.0im; 4.0im 2.0]
2×2 Array{Complex{Float64},2}:
 1.0+0.0im  -0.0-2.0im
 0.0+4.0im   2.0+0.0im

julia> A'
2×2 Array{Complex{Float64},2}:
  1.0-0.0im  0.0-4.0im
 -0.0+2.0im  2.0-0.0im
```
"""
kw"'"

"""
    const

`const` 被用来声明常数全局变量。在大部分（尤其是性能敏感的代码）全局变量应当被声明为常数。

```julia
const x = 5
```

可以使用单个 `const` 声明多个常数变量。

```julia
const y, z = 7, 11
```

注意 `const` 只会作用于一个 `=` 操作，因此 `const x = y = 1` 声明了 `x` 是常数，而 `y` 不是。在另一方面，`const x = const y = 1`声明了 `x` 和 `y` 都是常数。

注意「常数性质」并不会强制容器内部变成常数，所以如果 `x` 是一个数组或者字典（举例来讲）你仍然可以给它们添加或者删除元素。

严格来讲，你甚至可以重新定义 `const`（常数）变量，尽管这将会让编译器产生一个警告。唯一严格的要求是这个变量的**类型**不能改变，这也是为什么常数变量会比一般的全局变量更快的原因。
"""
kw"const"

"""
    function

函数由 `function` 关键词定义：

```julia
function add(a, b)
    return a + b
end
```

或者是更短的形式：

```julia
add(a, b) = a + b
```

[`return`](@ref) 关键词的使用方法和其它语言完全一样，但是常常是不使用的。一个没有显示声明 `return` 的函数将返回函数体最后一个表达式。
"""
kw"function"

"""
    return

`return` 可以用来在函数体中立即退出并返回给定值，例如

```julia
function compare(a, b)
    a == b && return "equal to"
    a < b ? "less than" : "greater than"
end
```

通常，你可以在函数体的任意位置放置 `return` 语句，包括在多层嵌套的循环和条件表达式中，但要注意 `do` 块。例如：

```julia
function test1(xs)
    for x in xs
        iseven(x) && return 2x
    end
end

function test2(xs)
    map(xs) do x
        iseven(x) && return 2x
        x
    end
end
```

在第一个例子中，return 一碰到偶数就跳出包含它的函数，因此 `test1([5,6,7])` 返回 `12`。

你可能希望第二个例子的行为与此相同，但实际上，这里的 `return` 只会跳出（在 `do` 块中的）*内部*函数并把值返回给 `map`。于是，`test2([5,6,7])` 返回 `[5,12,7]`。
"""
kw"return"

# 仿照 https://docs.juliacn.com/latest/manual/control-flow/#man-conditional-evaluation-1
"""
    if/elseif/else

`if`/`elseif`/`else` 执行条件表达式（Conditional evaluation）可以根据布尔表达式的值，让部分代码被执行或者不被执行。下面是对 `if`-`elseif`-`else` 条件语法的分析：

```julia
if x < y
    println("x is less than y")
elseif x > y
    println("x is greater than y")
else
    println("x is equal to y")
end
```

如果表达式 `x < y` 是 `true`，那么对应的代码块会被执行；否则判断条件表达式 `x > y`，如果它是 `true`，则执行对应的代码块；如果没有表达式是 true，则执行 `else` 代码块。`elseif` 和 `else` 代码块是可选的，并且可以使用任意多个 `elseif` 代码块。
"""
kw"if", kw"elseif", kw"else"

"""
    for

`for` 循环通过迭代一系列值来重复计算循环体。

# 例子
```jldoctest
julia> for i in [1, 4, 0]
           println(i)
       end
1
4
0
```
"""
kw"for"

# 仿照 https://docs.juliacn.com/latest/manual/control-flow/#man-loops-1
"""
    while

`while` 循环会重复执行条件表达式，并在该表达式为 `true` 时继续执行 while 循环的主体部分。当 while 循环第一次执行时，如果条件表达式为 false，那么主体代码就一次也不会被执行。

# 例子
jldoctest
julia> i = 1
1

julia> while i < 5
           println(i)
           global i += 1
       end
1
2
3
4
```
"""
kw"while"

"""
    end

`end` 标记一个表达式块的结束，例如 [`module`](@ref)、[`struct`](@ref)、[`mutable struct`](@ref)、[`begin`](@ref)、[`let`](@ref)、[`for`](@ref) 等。`end` 在索引数组时也可以用来表示维度的最后一个索引。

# 例子
```jldoctest
julia> A = [1 2; 3 4]
2×2 Array{Int64,2}:
 1  2
 3  4

julia> A[end, :]
2-element Array{Int64,1}:
 3
 4
```
"""
kw"end"

# 仿照 https://docs.juliacn.com/latest/manual/control-flow/#try/catch-%E8%AF%AD%E5%8F%A5-1
"""
    try/catch

`try/catch` 语句可以用来捕获 `Exception`，并进行异常处理。例如，一个自定义的平方根函数可以通过 `Exception` 来实现自动按需调用求解实数或者复数平方根的方法：

```julia
f(x) = try
    sqrt(x)
catch
    sqrt(complex(x, 0))
end
```

`try/catch` 语句允许保存 `Exception` 到一个变量中，例如 `catch y`。

`try/catch` 组件的强大之处在于能够将高度嵌套的计算立刻解耦成更高层次地调用函数。
"""
kw"try", kw"catch"

# 仿照 https://docs.juliacn.com/latest/manual/control-flow/#finally-%E5%AD%90%E5%8F%A5-1
"""
    finally

无论代码块是如何退出的，都让代码块在退出时运行某段代码。这里是一个确保一个打开的文件被关闭的例子：

```julia
f = open("file")
try
    operate_on_file(f)
finally
    close(f)
end
```

当控制流离开 `try` 代码块（例如，遇到 `return`，或者正常结束），`close(f)` 就会被执行。如果 `try` 代码块由于异常退出，这个异常会继续传递。`catch` 代码块可以和 `try` 还有 `finally` 配合使用。这时 `finally` 代码块会在 `catch` 处理错误之后才运行。
"""
kw"finally"

"""
    break

立即跳出当前循环。

# 例子
```jldoctest
julia> i = 0
0

julia> while true
           global i += 1
           i > 5 && break
           println(i)
       end
1
2
3
4
5
```
"""
kw"break"

"""
    continue

跳过当前循环迭代的剩余部分。

# 例子
```jldoctest
julia> for i = 1:6
           iseven(i) && continue
           println(i)
       end
1
3
5
```
"""
kw"continue"

"""
    do

创建一个匿名函数。例如：

```julia
map(1:10) do x
    2x
end
```

等价于 `map(x->2x, 1:10)`。

像这样便可使用多个参数：

```julia
map(1:10, 11:20) do x, y
    x + y
end
```
"""
kw"do"

"""
    ...

「splat」运算符 `...` 表示参数序列。`...` 可以在函数定义中用来表示该函数接受任意数量的参数。`...` 也可以用来将函数作用于参数序列。

# 例子
```jldoctest
julia> add(xs...) = reduce(+, xs)
add (generic function with 1 method)

julia> add(1, 2, 3, 4, 5)
15

julia> add([1, 2, 3]...)
6

julia> add(7, 1:100..., 1000:1100...)
111107
```
"""
kw"..."

"""
    ;

`;` 在 Julia 中具有与许多类 C 语言相似的作用，用于分隔前一个语句的结尾。`;` 在换行中不是必要的，但可以用于在单行中分隔语句或者将多个表达式连接为单个表达式。`;` 也用于抑制 REPL 和类似界面中的输出打印。

# 例子
```julia
julia> function foo()
           x = "Hello, "; x *= "World!"
           return x
       end
foo (generic function with 1 method)

julia> bar() = (x = "Hello, Mars!"; return x)
bar (generic function with 1 method)

julia> foo();

julia> bar()
"Hello, Mars!"
```
"""
kw";"

"""
    x && y

短路布尔 AND。
"""
kw"&&"

"""
    x || y

短路布尔 OR。
"""
kw"||"

"""
    ccall((function_name, library), returntype, (argtype1, ...), argvalue1, ...)
    ccall(function_name, returntype, (argtype1, ...), argvalue1, ...)
    ccall(function_pointer, returntype, (argtype1, ...), argvalue1, ...)

调用由 C 导出的共享库里的函数，该函数由元组 `(function_name, library)` 指定，其中的每个组件都是字符串或符号。若不指定库，还可以使用 `function_name` 的符号或字符串，它会在当前进程中解析。另外，`ccall` 也可用于调用函数指针 `function_pointer`，比如 `dlsym` 返回的函数指针。

请注意参数类型元组必须是字面上的元组，而不是元组类型的变量或表达式。

通过自动插入对 `unsafe_convert(argtype, cconvert(argtype, argvalue))` 的调用，每个传给 `ccall` 的 `argvalue` 将被类型转换为对应的 `argtype`。（有关的详细信息，请参阅 [`unsafe_convert`](@ref Base.unsafe_convert) 和 [`cconvert`](@ref Base.cconvert) 的文档。）在大多数情况下，这只会简单地调用 `convert(argtype, argvalue)`。
"""
kw"ccall"

"""
    begin

`begin...end` 表示一个代码块。

```julia
begin
    println("Hello, ")
    println("World!")
end
```

通常，`begin` 不会是必需的，因为诸如 [`function`](@ref) and [`let`](@ref) 之类的关键字会隐式地开始代码块。另请参阅 [`;`](@ref)。
"""
kw"begin"

"""
    struct

struct 是 Julia 中最常用的数据类型，由名称和一组字段指定。

```julia
struct Point
    x
    y
end
```

可对字段施加类型限制，该限制也可被参数化：

```julia
    struct Point{X}
        x::X
        y::Float64
    end
```

struct 可以通过 `<:` 语法声明一个抽象超类型：
A struct can also declare an abstract super type via `<:` syntax:

```julia
struct Point <: AbstractPoint
    x
    y
end
```

`struct` 默认是不可变的；这些类型的实例在构造后不能被修改。如需修改实例，请使用 [`mutable struct`](@ref) 来声明一个可以修改其实例的类型。

有关更多细节，比如怎么定义构造函数，请参阅手册的 [复合类型](@ref) 章节。
"""
kw"struct"

"""
    mutable struct

`mutable struct` 类似于 [`struct`](@ref)，但另外允许在构造后设置类型的字段。有关详细信息，请参阅 [复合类型](@ref)。
"""
kw"mutable struct"

"""
    new

仅在内部构造函数中可用的特殊函数，用来创建该类型的对象。有关更多信息，请参阅手册的 [内部构造方法](@ref) 章节。
"""
kw"new"

"""
    where

`where` 关键字创建一个类型，该类型是其他类型在一些变量上所有值的迭代并集。例如 `Vector{T} where T<:Real` 包含所有元素类型是某种 `Real` 的 [`Vector`](@ref)。

如果省略，变量上界默认为 `Any`：

```julia
Vector{T} where T    # short for `where T<:Any`
```

变量也可以具有下界：

```julia
Vector{T} where T>:Int
Vector{T} where Int<:T<:Real
```

嵌套的 `where` 也有简洁的语法。例如，这行代码：

```julia
Pair{T, S} where S<:Array{T} where T<:Number
```

可以缩写为：

```julia
Pair{T, S} where {T<:Number, S<:Array{T}}
```

这种形式常见于方法签名：

请注意，在这种形式中，最外层变量列在最前面。这与使用语法 `T{p1, p2, ...}` 将类型「作用」于参数值时所替换变量的次序相匹配。
"""
kw"where"

"""
    ans

一个引用最后一次计算结果的变量，在交互式提示符中会自动设置。
"""
kw"ans"

"""
    Union{}

`Union{}`，即空的类型 [`Union`](@ref)，是没有值的类型。也就是说，它具有决定性性质：对于任何 `x`，`isa(x, Union{}) == false`。`Base.Bottom` 被定义为其别名，`Union{}` 的类型是 `Core.TypeofBottom`。

# 例子
```jldoctest
julia> isa(nothing, Union{})
false
```
"""
kw"Union{}", Base.Bottom

"""
    ::

`::` 运算符用于类型声明，在程序中可被附加到表达式和变量后。详见手册的 [类型声明](@ref) 章节

在类型声明外，`::` 用于断言程序中的表达式和变量具有给定类型。

# 例子
```jldoctest
julia> (1+2)::AbstractFloat
ERROR: TypeError: typeassert: expected AbstractFloat, got Int64

julia> (1+2)::Int
3
```
"""
kw"::"

"""
Julia 的基础库。
"""
kw"Base"
