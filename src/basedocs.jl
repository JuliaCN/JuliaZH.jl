import Base.BaseDocs: @kw_str

"""
**欢迎来到Julia $(string(VERSION)).** 完整的中文手册可以在这里找到

    https://docs.juliacn.com/

更多中文资料和教程，也请关注Julia中文社区

    https://cn.julialang.org

新手请参考中文discourse上的新手指引

    https://discourse.juliacn.com/t/topic/159

输入 `?`， 然后输入你想要查看帮助文档的函数或者宏名称就可以查看它们的文档。例如`?cos`, 或者 `?@time`
然后按回车键即可。

在REPL中输入 `ENV["REPL_LOCALE"]=""` 将恢复英文模式。再次回到中文模型请输入 `ENV["REPL_LOCALE"]="zh_CN"`。
"""
kw"help", kw"?", kw"julia", kw""


"""
    using

`using Foo` 将会加载一个名为 `Foo` 的模块（module）或者一个包，然后其[`export`](@ref)的名称将可以直接使用。
不论是否被`export`，名称都可以通过点来访问（例如，输入`Foo.foo`来访问到`foo`）。查看[手册中关于模块的部分](@ref modules)以获取更多细节。
"""
kw"using"

"""
    import

`import Foo` 将会加载一个名为 `Foo` 的模块（module）或者一个包。
`Foo`模块中的名称可以通过点来访问到（例如，输入`Foo.foo`可以获取到`foo`）。
查看[手册中关于模块的部分](@ref modules)以获取更多细节。
"""
kw"import"

"""
    export

`export`被用来在模块中告诉Julia哪些函数或者名字可以由用户使用。例如`export foo`将在[`using`](@ref)这个module的时候使得
`foo`可以直接被访问到。查看[手册中关于模块的部分](@ref modules)以获取更多细节。
"""
kw"export"

"""
    abstract type

`abstract type`声明来一个不能实例化的类型，它将仅仅作为类型图中的一个节点存在，从而能够描述一系列相互关联的具体类型（concrete type）：
这些具体类型都是抽象类型的子节点。抽象类型在概念上使得Julia的类型系统不仅仅是一系列对象的集合。例如：

```julia
abstract type Number end
abstract type Real <: Number end
```

[`Number`](@ref)没有父节点（父类型）, 而 [`Real`](@ref) 是 `Number` 的一个抽象子类型。
"""
kw"abstract type"

"""
    module

`module` 会声明一个 `Module` 类型的实例用于描述一个独立的变量名空间。在一个模块（module）里，你可以控制
来自于其它模块的名字是否可见（通过载入，import），你也可以决定你的名字有哪些是可以公开的（通过暴露，export）。
模块使得你在在创建上层定义时无需担心命名冲突。查看[手册中关于模块的部分](@ref modules)以获取更多细节。

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


`baremodule` 将声明一个不包含`using Base`或者`eval`定义的模块。但是它将仍然载入`Core`模块。
"""
kw"baremodule"

"""
    primitive type

`primitive type`声明了一个其数据仅仅由一系列二进制数表示的具体类型。比较常见的例子是整数类型和浮点类型。下面是一些内置
的原始类型（primitive type）：

```julia
primitive type Char 32 end
primitive type Bool <: Integer 8 end
```

名称后面的数字表达了这个类型存储所需的比特数目。目前这个数字要求是8 bit的倍数。[`Bool`](@ref)类型的声明展示了一个原始类型如何
选择成为另一个类型的子类型。
"""
kw"primitive type"


"""
    macro

`macro`定义了一种会将生成的代码包含在最终程序体中的方法，这称之为宏。一个宏将一系列输入映射到一个表达式，然后所返回的表达式将会被
直接进行编译而不需要在运行时调用`eval`函数。宏的输入可以包括表达式，字面量，符号。例如：

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

`global x`将会使得当前作用域和当前作用所包含的作用域里的`x`指向名为`x`的全局变量。
查看[手册：变量作用域](@ref scope-of-variables)以获取更多信息。

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

`let`会在每次被运行时声明一个新的变量绑定。这个新的变量绑定将拥有一个新的地址。这里的不同只有当
变量通过闭包生存在它们的作用域外时才会显现。`let`语法接受逗号分割的一系列赋值语句和变量名：

```julia
let var1 = value1, var2, var3 = value3
    code
end
```

这些赋值语句是按照顺序求值的，等号右边的表达式将会首先求值，然后才绑定给左边的变量。因此这使得 `let x = x`
这样的表达式有意义，因为这两个`x`变量将具有不同的地址。
"""
kw"let"

"""
    quote

`quote` 会将其包含的代码扩变成一个多重的表达式对象，而无需显示调用`Expr`的构造器。这称之为引用，比如说

```julia
ex = quote
    x = 1
    y = 2
    x + y
end
```
和其它引用方式不同的是，`:( ... )`形式的引用（被包含时）将会在表达式树里引入一个在操作表达式树时必须要考虑的`QuoteNode`元素。
而在其它场景下，`:( ... )`和 `quote .. end` 代码块是被同等对待的。
"""
kw"quote"


"""
    '

厄米算符（共轭转置），参见[`adjoint`](@ref)

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
    .'

转置算符，参见[`transpose`](@ref)

# 例子
```jldoctest
julia> A = [1.0 -2.0im; 4.0im 2.0]
2×2 Array{Complex{Float64},2}:
 1.0+0.0im  -0.0-2.0im
 0.0+4.0im   2.0+0.0im

julia> A.'
2×2 Array{Complex{Float64},2}:
  1.0+0.0im  0.0+4.0im
 -0.0-2.0im  2.0+0.0im
```
"""
kw".'"


"""
    const

`const`被用来声明常数全局变量。在大部分（尤其是性能敏感的代码）全局变量应当被声明为常数。

```julia
const x = 5
```

可以使用单个`const`声明多个常数变量。
```julia
const y, z = 7, 11
```

注意`const`只会作用于一个`=`操作，因此 `const x = y = 1` 声明了 `x` 是常数，而 `y` 不是。在另一方面，
`const x = const y = 1`声明了`x`和`y`都是常数。

注意 “常数性质” 并不会强制容器内部变成常数，所以如果`x`是一个数组或者字典（举例来讲）你仍然可以给它们添加
或者删除元素。

严格来讲，你甚至可以重新定义 `const` （常数）变量，尽管这将会让编译器产生一个警告。唯一严格的要求是这个变量的
**类型**不能改变，这也是为什么常数变量会比一般的全局变量更快的原因。
"""
kw"const"

"""
    function

函数由`function`关键词定义：

```julia
function add(a, b)
    return a + b
end
```

或者是更短的形式：

```julia
add(a, b) = a + b
```

[`return`](@ref)关键词的使用方法和其它语言完全一样，但是常常是不使用的。一个没有显示声明`return`的函数将返回函数体最后一个表达式。
"""
kw"function"
