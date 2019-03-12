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

"""
    return

`return` can be used in function bodies to exit early and return a given value, e.g.

```julia
function compare(a, b)
    a == b && return "equal to"
    a < b ? "less than" : "greater than"
end
```
In general you can place a `return` statement anywhere within a function body, including
within deeply nested loops or conditionals, but be careful with `do` blocks. For
example:

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
In the first example, the return breaks out of its enclosing function as soon as it hits
an even number, so `test1([5,6,7])` returns `12`.

You might expect the second example to behave the same way, but in fact the `return`
there only breaks out of the *inner* function (inside the `do` block) and gives a value
back to `map`. `test2([5,6,7])` then returns `[5,12,7]`.
"""
kw"return"

"""
    if/elseif/else

`if`/`elseif`/`else` performs conditional evaluation, which allows portions of code to
be evaluated or not evaluated depending on the value of a boolean expression. Here is
the anatomy of the `if`/`elseif`/`else` conditional syntax:

```julia
if x < y
    println("x is less than y")
elseif x > y
    println("x is greater than y")
else
    println("x is equal to y")
end
```
If the condition expression `x < y` is true, then the corresponding block is evaluated;
otherwise the condition expression `x > y` is evaluated, and if it is true, the
corresponding block is evaluated; if neither expression is true, the `else` block is
evaluated. The `elseif` and `else` blocks are optional, and as many `elseif` blocks as
desired can be used.
"""
kw"if", kw"elseif", kw"else"

"""
    for

`for` loops repeatedly evaluate the body of the loop by
iterating over a sequence of values.

# Examples
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

"""
    while

`while` loops repeatedly evaluate a conditional expression, and continues evaluating the
body of the while loop so long as the expression remains `true`. If the condition
expression is false when the while loop is first reached, the body is never evaluated.

# Examples
```jldoctest
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

`end` marks the conclusion of a block of expressions, for example
[`module`](@ref), [`struct`](@ref), [`mutable struct`](@ref),
[`begin`](@ref), [`let`](@ref), [`for`](@ref) etc.
`end` may also be used when indexing into an array to represent
the last index of a dimension.

# Examples
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

"""
    try/catch

A `try`/`catch` statement allows for `Exception`s to be tested for. For example, a
customized square root function can be written to automatically call either the real or
complex square root method on demand using `Exception`s:

```julia
f(x) = try
    sqrt(x)
catch
    sqrt(complex(x, 0))
end
```

`try`/`catch` statements also allow the `Exception` to be saved in a variable, e.g. `catch y`.

The power of the `try`/`catch` construct lies in the ability to unwind a deeply
nested computation immediately to a much higher level in the stack of calling functions.
"""
kw"try", kw"catch"

"""
    finally

Run some code when a given block of code exits, regardless
of how it exits. For example, here is how we can guarantee that an opened file is
closed:

```julia
f = open("file")
try
    operate_on_file(f)
finally
    close(f)
end
```

When control leaves the [`try`](@ref) block (for example, due to a [`return`](@ref), or just finishing
normally), [`close(f)`](@ref) will be executed. If the `try` block exits due to an exception,
the exception will continue propagating. A `catch` block may be combined with `try` and
`finally` as well. In this case the `finally` block will run after `catch` has handled
the error.
"""
kw"finally"

"""
    break

Break out of a loop immediately.

# Examples
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

Skip the rest of the current loop iteration.

# Examples
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

Create an anonymous function. For example:

```julia
map(1:10) do x
    2x
end
```

is equivalent to `map(x->2x, 1:10)`.

Use multiple arguments like so:

```julia
map(1:10, 11:20) do x, y
    x + y
end
```
"""
kw"do"

"""
    ...

The "splat" operator, `...`, represents a sequence of arguments.
`...` can be used in function definitions, to indicate that the function
accepts an arbitrary number of arguments.
`...` can also be used to apply a function to a sequence of arguments.

# Examples
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

`;` has a similar role in Julia as in many C-like languages, and is used to delimit the
end of the previous statement. `;` is not necessary after new lines, but can be used to
separate statements on a single line or to join statements into a single expression.
`;` is also used to suppress output printing in the REPL and similar interfaces.

# Examples
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

Short-circuiting boolean AND.
"""
kw"&&"

"""
    x || y

Short-circuiting boolean OR.
"""
kw"||"

"""
    ccall((function_name, library), returntype, (argtype1, ...), argvalue1, ...)
    ccall(function_name, returntype, (argtype1, ...), argvalue1, ...)
    ccall(function_pointer, returntype, (argtype1, ...), argvalue1, ...)

Call a function in a C-exported shared library, specified by the tuple `(function_name, library)`,
where each component is either a string or symbol. Instead of specifying a library,
one can also use a `function_name` symbol or string, which is resolved in the current process.
Alternatively, `ccall` may also be used to call a function pointer `function_pointer`, such as one returned by `dlsym`.

Note that the argument type tuple must be a literal tuple, and not a tuple-valued
variable or expression.

Each `argvalue` to the `ccall` will be converted to the corresponding
`argtype`, by automatic insertion of calls to `unsafe_convert(argtype,
cconvert(argtype, argvalue))`. (See also the documentation for
[`unsafe_convert`](@ref Base.unsafe_convert) and [`cconvert`](@ref Base.cconvert) for further details.)
In most cases, this simply results in a call to `convert(argtype, argvalue)`.
"""
kw"ccall"

"""
    begin

`begin...end` denotes a block of code.

```julia
begin
    println("Hello, ")
    println("World!")
end
```

Usually `begin` will not be necessary, since keywords such as [`function`](@ref) and [`let`](@ref)
implicitly begin blocks of code. See also [`;`](@ref).
"""
kw"begin"

"""
    struct

The most commonly used kind of type in Julia is a struct, specified as a name and a
set of fields.

```julia
struct Point
    x
    y
end
```

Fields can have type restrictions, which may be parameterized:

```julia
    struct Point{X}
        x::X
        y::Float64
    end
```

A struct can also declare an abstract super type via `<:` syntax:

```julia
struct Point <: AbstractPoint
    x
    y
end
```

`struct`s are immutable by default; an instance of one of these types cannot
be modified after construction. Use [`mutable struct`](@ref) instead to declare a
type whose instances can be modified.

See the manual section on [Composite Types](@ref) for more details,
such as how to define constructors.
"""
kw"struct"

"""
    mutable struct

`mutable struct` is similar to [`struct`](@ref), but additionally allows the
fields of the type to be set after construction. See the manual section on
[Composite Types](@ref) for more information.
"""
kw"mutable struct"

"""
    new

Special function available to inner constructors which created a new object
of the type.
See the manual section on [Inner Constructor Methods](@ref) for more information.
"""
kw"new"

"""
    where

The `where` keyword creates a type that is an iterated union of other types, over all
values of some variable. For example `Vector{T} where T<:Real` includes all [`Vector`](@ref)s
where the element type is some kind of `Real` number.

The variable bound defaults to `Any` if it is omitted:

```julia
Vector{T} where T    # short for `where T<:Any`
```
Variables can also have lower bounds:

```julia
Vector{T} where T>:Int
Vector{T} where Int<:T<:Real
```
There is also a concise syntax for nested `where` expressions. For example, this:

```julia
Pair{T, S} where S<:Array{T} where T<:Number
```
can be shortened to:

```julia
Pair{T, S} where {T<:Number, S<:Array{T}}
```
This form is often found on method signatures.

Note that in this form, the variables are listed outermost-first. This matches the
order in which variables are substituted when a type is "applied" to parameter values
using the syntax `T{p1, p2, ...}`.
"""
kw"where"

"""
    ans

A variable referring to the last computed value, automatically set at the interactive prompt.
"""
kw"ans"

"""
    Union{}

`Union{}`, the empty [`Union`](@ref) of types, is the type that has no values. That is, it has the defining
property `isa(x, Union{}) == false` for any `x`. `Base.Bottom` is defined as its alias and the type of `Union{}`
is `Core.TypeofBottom`.

# Examples
```jldoctest
julia> isa(nothing, Union{})
false
```
"""
kw"Union{}", Base.Bottom

"""
    ::

With the `::`-operator type annotations are attached to expressions and variables in programs.
See the manual section on [Type Declarations](@ref).

Outside of declarations `::` is used to assert that expressions and variables in programs have a given type.

# Examples
```jldoctest
julia> (1+2)::AbstractFloat
ERROR: TypeError: typeassert: expected AbstractFloat, got Int64

julia> (1+2)::Int
3
```
"""
kw"::"

"""
The base library of Julia.
"""
kw"Base"
