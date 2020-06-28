# 文档

自Julia 0.4 开始，Julia 允许开发者和用户，使用其内置的文档系统更加便捷地为函数、类型以及其他对象编写文档。

基础语法很简单：紧接在对象（函数，宏，类型和实例）之前的字符串都会被认为是对应对象的文档（称作 *docstrings*）。
注意不要在 docstring 和文档对象之间有空行或者注释。
这里有个基础的例子：

```julia
"Tell whether there are too foo items in the array."
foo(xs::Array) = ...
```

文档会被翻译成 [Markdown](https://en.wikipedia.org/wiki/Markdown)，所以你可以
使用缩进和代码块来分隔代码示例和文本。从技术上来说，任何对象
都可以作为 metadata 与任何其他对象关联；Markdown 是默认的，但是可以创建
其它字符串宏并传递给 `@doc` 宏来使用其他格式。

!!! note
    Markdown 支持由 `Markdown` 标准库实现，有关支持语法的完整列表，请参阅其[文档](@ref markdown_stdlib)。

这里是一个更加复杂的例子，但仍然使用 Markdown：

````julia
"""
    bar(x[, y])

Compute the Bar index between `x` and `y`. If `y` is missing, compute
the Bar index between all pairs of columns of `x`.

# Examples
```julia-repl
julia> bar([1, 2], [1, 2])
1
```
"""
function bar(x, y) ...
````

如上例所示，我们推荐在写文档时遵守一些简单约定：

1. 始终在文档顶部显示函数的签名并带有四空格缩进，以便能够显示成 Julia 代码。
    

   这和在 Julia 代码中的签名是一样的（比如 `mean(x::AbstractArray)`），或是简化版。可选参数应该尽可能与默认值一同显示（例如 `f(x, y=1)`），这与实际的 Julia 语法一致。没有默认值的可选参数应该放在括号中（例如 `f(x[, y])` 和 `f(x[, y[, z]])`）。可选的解决方法是使用多行：一个没有可选参数，其他的拥有可选参数（或者多个可选参数）。这个解决方案也可以用作给某个函数的多个方法来写文档。当一个函数接收到多个关键字参数，只在签名中包含占位符 `<keyword arguments>`（例如 `f(x; <keyword arguments>)`），并在 `# Arguments` 章节给出完整列表（参照下列第 4 点）。
    
    
    
    
    
    
    
    
2. 在简化的签名块后请包含一个描述函数能做什么或者对象代表什么的单行句。如果需要的话，在一个空行之后，在第二段提供更详细的信息。
    
    

   撰写函数的文档时，单行语句应使用祈使结构（比如「Do this」、「Return that」）而非第三人称（不要写「Returns the length...」）。并且应以句号结尾。如果函数的意义不能简单地总结，更好的方法是分成分开的组合句（虽然这不应被看做是对于每种情况下的绝对要求）。
    
    
    
    
3. 不要自我重复。

   因为签名给出了函数名，所以没有必要用「The function `bar`...」开始文档：直接说要点。类似地，如果签名指定了参数的类型，在描述中提到这些是多余的。
    
    
4. 只在确实必要时提供参数列表。

   对于简单函数，直接在函数目的的描述中提到参数的作用常常更加清楚。参数列表只会重复再其他地方提供过的信息。但是，对于拥有多个参数的（特别是含有关键字参数的）复杂函数来说，提供一个参数列表是个好主意。在这种情况下，请在函数的一般描述之后、标题 `# Arguments` 之下插入参数列表，并在每个参数前加个着重号 `-`。参数列表应该提到参数的类型和默认值（如果有）：
    
    
    
    
    

   ```julia
   """
   ...
   # Arguments
   - `n::Integer`: the number of elements to compute.
   - `dim::Integer=1`: the dimensions along which to perform the computation.
   ...
   """
   ```
5. 给相关函数提供提示。

   有时会存在具有功能相联系的函数。为了更易于发现相关函数，请在段落 `See also:` 中为其提供一个小列表。
    

   ```
   See also: [`bar!`](@ref), [`baz`](@ref), [`baaz`](@ref)
   ```
6. 请在 `# Examples` 中包含一些代码例子。

   例子应尽可能按照 *doctest* 来写。*doctest* 是一个栅栏分隔开的代码块（请参阅[代码块](@ref)），其以 ````` ```jldoctest````` 开头并包含任意数量的提示符 `julia>` 以及用来模拟 Julia REPL 的输入和预期输出。
    
    

   !!! note
       Doctest 由 [`Documenter.jl`](https://github.com/JuliaDocs/Documenter.jl) 支持。有关更详细的文档，请参阅 Documenter 的[手册](https://juliadocs.github.io/Documenter.jl/)。

   例如在下面的 docstring 中定义了变量 `a`，预期的输出，跟在 Julia REPL 中打印的一样，出现在后面。
    

   ````julia
   """
   Some nice documentation here.

   # Examples
   ```jldoctest
   julia> a = [1 2; 3 4]
   2×2 Array{Int64,2}:
    1  2
    3  4
   ```
   """
   ````

   !!! warning
       Calling `rand` and other RNG-related functions should be avoided in doctests since they will not
       produce consistent outputs during different Julia sessions. If you would like to show some random
       number generation related functionality, one option is to explicitly construct and seed your own
       [`MersenneTwister`](@ref) (or other pseudorandom number generator) and pass it to the functions you are
       doctesting.

       Operating system word size ([`Int32`](@ref) or [`Int64`](@ref)) as well as path separator differences
       (`/` or `\`) will also affect the reproducibility of some doctests.

       Note that whitespace in your doctest is significant! The doctest will fail if you misalign the
       output of pretty-printing an array, for example.

   你可以运行 `make -C doc doctest=true` 来运行在 Julia 手册和 API 文档中的 doctests，这样可以确保你的例子都能正常运行。
    

   为了表示输出结果被截断了，你应该在校验应该停止的一行写上 `[...]`。这个在当 doctest 显示有个异常被抛出时隐藏堆栈跟踪时很有用（堆栈跟踪包含对 julia 代码的行的非永久引用），例如：
    
    
    
    

   ````julia
   ```jldoctest
   julia> div(1, 0)
   ERROR: DivideError: integer division error
   [...]
   ```
   ````

   那些不能进行测试的例子应该写在以 ````` ```julia````` 开头的栅栏分隔的代码块中，以便在生成的文档中正确地高亮显示。
    

   !!! tip
       例子应尽可能**独立**和**可运行**以便读者可以在不需要引入任何依赖的情况下对它们进行实验。
7. 使用倒引号来标识代码和方程。

   Julia 标识符和代码摘录应该出现在倒引号 ``` ` ``` 之间来使其能高亮显示。LaTeX 语法下的方程应该插入到双倒引号 ``` `` ``` 之间。请使用 Unicode 字符而非 LaTeX 转义序列，比如 ``` ``α = 1`` ``` 而非 ``` ``\\alpha = 1`` ```。
    
    
    
8. 请将起始和结束的`"""`符号单独成行。

   也就是说，请写：

   ```julia
   """
   ...

   ...
   """
   f(x, y) = ...
   ```

   而非：

   ```julia
   """...

   ..."""
   f(x, y) = ...
   ```

   这将让 docstring 的起始和结束位置更加清楚。
9. 请在代码中遵守单行长度限制。

   Docstring 是使用与代码相同的工具编辑的。所以应运用同样的约定。 建议一行 92 个字符后换行。
    
6. 请在 `# Implementation` 章节中提供自定义类型如何实现该函数的信息。这些实现细节是针对开发者而非用户的，解释了例如哪些函数应该被重写、哪些函数自动使用恰当的回退函数等信息，最好与描述函数的主体描述分开。
    
    
    
    
5. 对于长文档字符串，可以考虑使用 `# Extended help` 头拆分文档。典型的帮助模式将只显示标题上方的内容；你可以通过添加一个 `?` 在表达的开头来查看完整的文档（即 `??foo` 而不是 `?foo`）。
    
    
    

## 访问文档

文档可以在REPL中访问，也可以在 [IJulia](https://github.com/JuliaLang/IJulia.jl)
中通过键入`?`紧接函数或者宏的名字并按下`Enter`访问。例如，

```julia
?cos
?@time
?r""
```

会分别为相应的函数，宏或者字符显示文档。在 [Juno](http://junolab.org) 中，使用 `Ctrl-J, Ctrl-D` 会为光标处的对象显示文档。

## 函数与方法

在Julia中函数可能有多种实现，被称为方法。虽然通用函数
一般只有一个目的，Julia允许在必要时可以对方法独立写文档。
通常，应该只有最通用的方法才有文档，或者甚至只是函数本身
（也就是在`function bar end`之前没有任何方法的对象）。特定方法应该
只因为其行为与其他通用方法有所区别才写文档。在任何情况下都不应
重复其他地方有的信息。例如

```julia
"""
    *(x, y, z...)

Multiplication operator. `x * y * z *...` calls this function with multiple
arguments, i.e. `*(x, y, z...)`.
"""
function *(x, y, z...)
    # ... [implementation sold separately] ...
end

"""
    *(x::AbstractString, y::AbstractString, z::AbstractString...)

When applied to strings, concatenates them.
"""
function *(x::AbstractString, y::AbstractString, z::AbstractString...)
    # ... [insert secret sauce here] ...
end

help?> *
search: * .*

  *(x, y, z...)

  Multiplication operator. x * y * z *... calls this function with multiple
  arguments, i.e. *(x,y,z...).

  *(x::AbstractString, y::AbstractString, z::AbstractString...)

  When applied to strings, concatenates them.
```

当从通用函数里抽取文档时，每个方法的元数据会用函数`catdoc`拼接，其当然可以被自定义类型重写。

## 进阶用法

`@doc` 宏将它的第一个参数与它的第二个参数关联在各个模块的名为 `META` 的字典中。

为了让写文档更加简单，语法分析器对宏名`@doc`特殊对待：如果`@doc`的调用只有一个参数，但是在下一行出现了另外一个表达式，那么这个表达式就会追加为宏的参数。所以接下来的语法会被分析成`@doc`的2个参数的调用：

```julia
@doc raw"""
...
"""
f(x) = x
```

这就让使用任意对象（这里指的是原始字符串 `raw""`）作为 docstring 变得简单。

当`@doc`宏（或者`doc`函数）用作抽取文档时，他会在所有的`META`字典寻找与对象相关的元数据并且返回。返回的对象（例如一些Markdown内容）会默认智能地显示。这个设计也让以编程方法使用文档系统变得容易；例如，在一个函数的不同版本中重用文档：

```julia
@doc "..." foo!
@doc (@doc foo!) foo
```

或者与Julia的元编程功能一起使用：

```julia
for (f, op) in ((:add, :+), (:subtract, :-), (:multiply, :*), (:divide, :/))
    @eval begin
        $f(a,b) = $op(a,b)
    end
end
@doc "`add(a,b)` adds `a` and `b` together" add
@doc "`subtract(a,b)` subtracts `b` from `a`" subtract
```

写在非顶级块，比如`begin`, `if`, `for`, 和 `let`，中的文档会根据块的评估情况加入文档系统中，例如：

```julia
if condition()
    "..."
    f(x) = x
end
```

会被加到`f(x)`的文档中，当`condition()`是`true`的时候。注意即使`f(x)`在块的末尾离开了作用域，他的文档还会保留。

可以利用元编程来帮助创建文档。当在文档字符串中使用字符串插值时，需要使用额外的 `$` 例如：`$($name)`

```julia
for func in (:day, :dayofmonth)
    name = string(func)
    @eval begin
        @doc """
            $($name)(dt::TimeType) -> Int64

        The day of month of a `Date` or `DateTime` as an `Int64`.
        """ $func(dt::Dates.TimeType)
    end
end
```

### 动态写文档

有些时候类型的实例的合适的文档并非只取决于类型本身，也取决于实例的值。在这些情况下，你可以添加一个方法给自定义类型的`Docs.getdoc`函数，返回基于每个实例的文档。例如，

```julia
struct MyType
    value::String
end

Docs.getdoc(t::MyType) = "Documentation for MyType with value $(t.value)"

x = MyType("x")
y = MyType("y")
```

输入`?x`会显示"Documentation for MyType with value x"，输入`?y`则会显示"Documentation for MyType with value y"。

## 语法指南

本指南提供了如何将文档附加到所有可能的 Julia 语法构造的全面概述。

在下述例子中`"..."`用来表示任意的docstring。

### `$` 与 `\` 字符

`$` 和 `\` 字符仍然被解析为字符串插值或转义序列的开始字符。
`raw""` 字符串宏和 `@doc` 宏可以用来避免对它们进行转义。
当文档字符串包含 LaTeX 或 Julia 源代码，且示例中包含插值时，这是很方便的:

````julia
@doc raw"""
```math
\LaTeX
```
"""
function f end
````

### 函数与方法

```julia
"..."
function f end

"..."
f
```

把 docstring `"..."` 添加给了函数 `f`。首选的语法是第一种，虽然两者是等价的。

```julia
"..."
f(x) = x

"..."
function f(x)
    x
end

"..."
f(x)
```

把 docstring `"..."` 添加给了方法 `f(::Any)`。

```julia
"..."
f(x, y = 1) = x + y
```

把 docstring `"..."` 添加给了两个方法，分别为 `f(::Any)` 和 `f(::Any, ::Any)`。

### 宏

```julia
"..."
macro m(x) end
```

把 docstring `"..."` 添加给了宏 `@m(::Any)` 的定义。

```julia
"..."
:(@m)
```

把 docstring `"..."` 添加给了名为 `@m` 的宏。

### 类型

```
"..."
abstract type T1 end

"..."
mutable struct T2
    ...
end

"..."
struct T3
    ...
end
```

把 docstring `"..."` 添加给了类型 `T1`、`T2` 和 `T3`。

```julia
"..."
struct T
    "x"
    x
    "y"
    y
end
```

把 docstring `"..."` 添加给了类型 `T`，`"x"` 添加给字段 `T.x`，`"y"` 添加给字段 `T.y`。也可以运用于`mutable struct` 类型。

### 模块

```julia
"..."
module M end

module M

"..."
M

end
```

把 docstring `"..."` 添加给了模块 `M`。首选的语法是在模块之前添加 docstring，虽然两者是等价的。

```julia
"..."
baremodule M
# ...
end

baremodule M

import Base: @doc

"..."
f(x) = x

end
```

通过把 docstring 放在表达式之上来给一个 `baremodule` 写文档会在模块中自动引入 `@doc`。它在模块表达式并没有文档时必须手动引入。空的 `baremodule` 不能有文档。

### 全局变量

```julia
"..."
const a = 1

"..."
b = 2

"..."
global c = 3
```

把docstring`"..."`添加给了`绑定` `a`，`b`和`c`。

`绑定`是用来在`模块`中存储对于特定`符号`的引用而非存储被引用的值本身。

!!! note
    当一个 `const` 定义只是用作定义另外一个定义的别名时，比如函数 `div` 和其在 `Base` 中的别名 `÷`，并不要为别名写文档，转而去为实际的函数写文档。

    如果别名写了文档而实际定义没有，那么文档系统（`?` 模式）在寻找实际定义的文档时将不会返回别名的对应文档。

    比如你应该写

    ```julia
    "..."
    f(x) = x + 1
    const alias = f
    ```

    而非

    ```julia
    f(x) = x + 1
    "..."
    const alias = f
    ```

```julia
"..."
sym
```

把 docstring `"..."` 添加给值 `sym`。但是应首选在 `sym` 的定义处写文档。

### 多重对象

```julia
"..."
a, b
```

把docstring `"..."` 添加给`a`和`b`，两个都应该是可以写文档的表达式。这个语法等价于

```julia
"..."
a

"..."
b
```

这种方法可以给任意数量的表达式写文档。当两个函数相关，比如非变版本`f`和可变版本`f!`，这个语法是有用的。

### 宏生成代码

```julia
"..."
@m expression
```

把docstring `"..."` 添加给通过展开 `@m expression` 生成的表达式。
这就允许由 `@inline`、`@noinline`、`@generated` 或者任意其他宏装饰的表达式，能和没有装饰的表达式以同样的方式写文档。

宏作者应该注意到只有只生成单个表达式的宏才会自动支持docstring。如果宏返回的是含有多个子表达式的块，需要写文档的子表达式应该使用宏 [`@__doc__`](@ref Core.@__doc__) 标记。

[`@enum`](@ref) 宏使用了 `@__doc__` 来允许给 `Enum` 写文档。它的做法可以作为如何正确使用 `@__doc__` 的范例。

```@docs
Core.@__doc__
```
