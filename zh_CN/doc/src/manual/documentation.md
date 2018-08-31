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

1. 始终在文档顶部显示函数的签名，带有四空格缩进
   以便能够显示成 Julia 代码。

   这和在 Julia 代码中的签名是一样的（像 `mean(x::AbstractArray)`），
   或是简化版。可选参数应该尽可能与默认值一同显示（例如
   `f(x, y=1)`），与实际的 Julia 语法一致。没有默认值的
   可选参数应该放在括号中（例如 `f(x[, y])` 和 `f(x[, y[, z]]`)）。可选的解决方法是
   使用多行：一个没有可选参数，其他的拥有可选参数（或者多个可选参数）。
   这个解决方案也可以用作给某个函数的多个方法来写文档。当一个函数
   接收到多个关键字参数，只在签名中包含占位符`<keyword arguments>`
   （例如 `f(x; <keyword arguments>)`），并在`# 参数`章节给出完整列表
   （参照下列点4）。
2. 在简化的签名块后请包含一个描述函数能做什么或者对象代表什么的
   单行句。如果需要的话，在一个空行之后，在第二段
   提供更详细的信息。

   当写文档时，单行句子硬使用祈使结构（“Do this”，“Return that”）而非
   第三人称（不要写“Returns the length...”）。应
   以句号结尾。如果函数的意义不能简单地总结，有利的方法是分成
   分开的组合句（虽然这个不应被看做是对于每个事例
   的绝对要求）。
3. 不要自我重复。

   因为签名给出了函数名，所以没有必要用
   "The function `bar`..."开始文档：直接说要点。相似地，如果签名指定了
   参数的类型，在描述中提到这些是多余的。
4. 只在确实必要时提供参数列表。

   对于简单函数，直接在函数的目的描述中提到参数的作用
   常常更加清楚。参数列表应只重复再其他地方提供过的
   信息。然而提供一个参数列表对于拥有多个参数的复杂函数
   是的好想法（特别是含有关键字参数的情况）。在这些事例中，请在函数的一般描述后
   插入参数列表，在标题`# Arguments` 之后，每个参数之前有一个项目符号`-`。
   参数列表应该提到参数的类型和默认值（如果有）：

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

   有时会存在具有功能相联系的函数。为了提供可探索性请提供
   一个相关函数的小列表，在段落`See also:`中。

   ```
   See also: [`bar!`](@ref), [`baz`](@ref), [`baaz`](@ref)
   ```
6. 请在`# Examples`中包含一些代码例子。

   例子应尽可能按照*doctest*来写。*doctest*是一个栅栏分隔开的代码块
   (参照 [Code blocks](@ref))，以 ````` ```jldoctest`````开头并包含任意数量的提示`julia>`
   与输入和预期输出用来模拟Julia REPL。

   例如在下面的docstring中定义了变量`a`，期待的输出
   ，跟在Julia REPL中打印的一样，出现在后面。

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

   你可以运行 `make -C doc doctest=true` 来运行在Julia手册和API文档中的doctests,
   这样可以确保你的例子都能正常运行。

   为了表示输出结果被截断了，你应该在校验
   应该停止的一行写上`[...]`。这个在当
   doctest显示有个异常被抛出时隐藏堆栈跟踪时很有用（堆栈跟踪包含
   对julia代码的行的非永久引用）,
   例如：

   ````julia
   ```jldoctest
   julia> div(1, 0)
   ERROR: DivideError: integer division error
   [...]
   ```
   ````

   Julia那些不能进行测试的例子应该写在以````` ```julia`````开头的栅栏分隔的代码块中
   以便在生成的文档中正确地高光显示。

   !!! tip
       例子应尽可能**独立**和**可运行**以便读者可以在不需要引入任何依赖的情况下对它们进行实验。

7. 使用倒引号来标识代码和方程。

   Julia标识符和代码摘录应该出现在倒引号``` ` ```之间来使其能
   高光显示。LaTeX语法下的方程应该插入到双倒引号 ``` `` ```之间。
   请使用Unicode字符而非LaTeX转义序列，比如 ``` ``α = 1`` ``` 而非
   ``` ``\\alpha = 1`` ```。
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

   这将让docstring的起始和结束位置更加清楚。
9. 请在代码中遵守单行长度限制。

   Docstring是使用与代码相同的工具编辑的。所以应运用同样的约定。
   建议一行92个字符后换行。
6. 请提供允许自定义类型来为此函数实现接口的信息，
   在一个`# Implementation`章节。这些为了开发者而非用户的
   解释了例如哪些函数应该被重写和哪些函数自动使用恰当的备用等信息的
   接口信息最好与描述函数的主体描述
   分开。

## 访问文档

文档可以在REPL中访问，也可以在 [IJulia](https://github.com/JuliaLang/IJulia.jl)
中通过键入`?`紧接函数或者宏的名字并按下`Enter`访问。例如，

```julia
?cos
?@time
?r""
```

会分别为相应的函数，宏或者字符显示文档。在[Juno](http://junolab.org)
中，使用`Ctrl-J, Ctrl-D`会为光标处的对象显示文档。

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

`@doc`宏在叫做`META`的每个模块的字典中连接他的第一个和第二个参数。默认地，文档希望是用Markdown写成，并且`doc"""`字符串宏简单地创造一个代表了Markdown内容的对象。在未来，有可能支持更多的进阶功能比如考虑到相关的图像或者链接路径。

为了让写文档更加简单，语法分析器对宏名`@doc`特殊对待：如果`@doc`的调用只有一个参数，但是在下一行出现了另外一个表达式，那么这个表达式就会追加为宏的参数。所以接下来的语法会被分析成`@doc`的2个参数的调用：

```julia
@doc raw"""
...
"""
f(x) = x
```

这就让使用任意对象（这里指的是`原始`字符串）作为docstring变得简单。

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

对于所有的可写文档的Julia语法的总览。

在下述例子中`"..."`用来表示任意的docstring。

`doc""`只应用在如下情况下：docstring包含不应被Julia分析的`$`或者`\`字符，比如LaTeX语法；Julia源码中包含插值。

### 函数与方法

```julia
"..."
function f end

"..."
f
```

把docstring`"..."`添加给了函数`f`。第一种语法是首选，虽然两者是等价的。

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

把docstring `"..."` 添加给了方法`f(::Any)`。

```julia
"..."
f(x, y = 1) = x + y
```

把docstring`"..."`添加给了两个`方法`，分别为`f(::Any)`和`f(::Any, ::Any)`。

### 宏

```julia
"..."
macro m(x) end
```

把docstring`"..."`添加给了 `@m(::Any)` 的宏定义。

```julia
"..."
:(@m)
```

把docstring`"..."`添加给了名字为`@m`的宏。

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

把docstring`"..."`添加给了类型`T1`, `T2`和`T3`。

```julia
"..."
struct T
    "x"
    x
    "y"
    y
end
```

把docstring `"..."` 添加给了类型`T`，`"x"`添加给了域`T.y`，`"y"`添加给了域`T.y`。也可以运用于`可变结构`类型。

### 模块

```julia
"..."
module M end

module M

"..."
M

end
```

把docstring `"..."` 添加给了`模块``M`.在`模块`之前添加docstring的语法是首选，虽然两者是等价的。

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

通过把docstring放在表达式之上来给一个`baremodule`写文档会自动在模块中引入`@doc`。当模块表达式并没有文档时必须手动引入。空的`baremodule`不能有文档。

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
  当一个`不变`定义只是用作定义另外一个定义的别名时，比如函数`div`和其在`Base`中的别名`÷`，并不要为别名写文档，转而去为实际的函数写文档。

如果给别名写了文档而非实际的函数，当寻找实际的函数时，文档系统(`?`模式)不会返回别名中对的文档。
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

把docstring `"..."`添加给值`sym`。用户应首选在`sym`定义处写文档。

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

把docstring `"..."` 添加给通过展开`@m expression`生成的表达式。这就允许由`@inline`,`@noinline`,`@generated`或者任意其他宏装饰的表达式能和没有装饰的表达式以同样的方式写文档。

宏作者应该注意到只有只生成单个表达式的宏才会自动支持docstring。如果宏返回的是含有多个子表达式的块，需要写文档的子表达式应该使用宏 [`@__doc__`](@ref Core.@__doc__) 标记。

`@enum`宏使用了`@__doc__`来允许给`Enum`写文档。检查其定义可以作为如何正确使用`@__doc__`的范例。

```@docs
Core.@__doc__
```

## Markdown语法

Julia支持下列的markdown语法。

### 内联元素

这里"内联"指存在于文本块，如段落，中的元素，包括以下元素：

#### 粗体

使用两个星号`**`包围单词，用来以粗体显示被包围的文本。

```
A paragraph containing a **bold** word.
```

#### 斜体

使用一个星号`*`包围单词，用来以斜体显示被包围的文本。

```
A paragraph containing an *emphasised* word.
```

#### 字面值

使用单倒引号``` ` ```包围单词，用来正确显示文本。

```
A paragraph containing a `literal` word.
```

当编写引用变量和函数名字或者Julia程序的部分内容的文本时，应使用字面量。

!!! tip
为了在字面量文本中包含一个倒引号，使用三个倒引号来包围文本，而非单倒引号。

    ```
    A paragraph containing a ``` `backtick` character ```.
    ```

    By extension any odd number of backticks may be used to enclose a lesser number of backticks.

#### ``\LaTeX``

使用``\LaTeX``语法和双倒引号``` `` ```包围文本，以便以数学表达式的方式显示。

```
A paragraph containing some ``\LaTeX`` markup.
```

!!! tip
如同上一节的字面量，如果字面倒引号需要写在双倒引号中，请写数量为大于2的偶数的倒引号。注意如果在```\LaTeX``标记中包含一个字面倒引号，两个闭合的倒引号就足够了。

#### 链接

链接到外部或者内部的地址的链接应该按照下列的语法编写：中括号`[ ]`围绕的文本是链接的名字，小括号`( )`围绕的文本是URL。

```
A paragraph containing a link to [Julia](http://www.julialang.org).
```

在Julia文档中对其他的有文档的函数/方法/变量进行交叉引用是可以的。例如：

```julia
"""
    accumulate!(op, y, x)

Cumulative operation `op` on a vector `x`, storing the result in `y`. See also [`accumulate`](@ref).
"""
```

这会在生成的文档中生成指向 `accumulate` 文档的一个链接（含有更多的关于函数实际的功能的信息）。在函数的可变/不变版本中包含交叉引用或者在两个看起来相似地函数中间高光其区别是鼓励的。

!!! note
上述的交叉引用*不是*Markdown的特色，其依赖于 [Documenter.jl](https://github.com/JuliaDocs/Documenter.jl)，这个包用来构建基础的Julia文档。

#### 脚注引用

命名的和编号的脚注引用应按照下列的语法编写：脚注名必须是没有截断的只有字母或者数字的单个单词。

```
A paragraph containing a numbered footnote [^1] and a named one [^named].
```

!!! note
与脚注相关的文本能写在脚注链接同一页的任意地方。用于定义脚注文本的语法在下面的[Footnotes](@ref)章节中讨论。

### 顶层元素

下列元素可以写在文档的"顶层"或者"顶层"元素之中。

#### 段落

段落是一个纯文本的块，可能包含任意数量的在[Inline elements](@ref)中定义了的内联元素，在段落前后会拥有一个或者多个空行。

```
This is a paragraph.

And this is *another* one containing some emphasised text.
A new line, but still part of the same paragraph.
```

#### 标题

文档可以使用标题分成不同的章节。标题使用的是下列的语法：

```julia
# Level One
## Level Two
### Level Three
#### Level Four
##### Level Five
###### Level Six
```

如同段落一样，标题行可以包含任意的内联语法。

!!! tip
尽量避免单个文档中使用过多层级的标题。重度嵌套的文档会给人以有将其重建或者分离成包含不同主题的多页的需要的印象。

#### 代码块

源代码会以带有四空格缩进的字面量块的形式显示，如下列所示。

```
This is a paragraph.

    function func(x)
        # ...
    end

Another paragraph.
```

另外，代码块可以由三个倒引号包围起来，并有可选的“语言”来指定块中代码的高光方式。

````
A code block without a "language":

```
function func(x)
    # ...
end
```

and another one with the "language" specified as `julia`:

```julia
function func(x)
    # ...
end
```
````

!!! note
"栅栏分隔"的代码块，如同最近的例子，应该比缩进代码块更优选因为在缩进代码块中无法指定语言。

#### 块引用

来自外部源的文本，比如来自书本或者网站的引用，应该在每行之前使用`>`字符来引用，如下所示。

```
Here's a quote:

> Julia is a high-level, high-performance dynamic programming language for
> technical computing, with syntax that is familiar to users of other
> technical computing environments.
```

注意每行的`>`字符之后一定要有单个空格。引用块可能自己含有其他的顶层或者内联元素。

#### 图片

图片的语法与之前提到的链接语法相类似。在链接前加一个`!`字符就可以从指定的URL显示图片而非链接。

```julia
![alternative text](link/to/image.png)
```

#### 列表

无序列表可以通过在列表的每项前加`*`,`+`或`-`来编写。

```
A list of items:

  * item one
  * item two
  * item three
```

注意每个`*`之前有两个空格，之后有一个空格。

列表可以包含其他的嵌套顶层元素，比如列表，代码块或者引用块。如果列表中包含任意顶级元素，请在每个列表项之间流出一个空行。

```
Another list:

  * item one

  * item two

    ```
    f(x) = x
    ```

  * 一个子列表：

      + 子项一
      + 子项二
```

!!! note
列表里的每一项的内容必须与项的第一行对齐。在上面的例子中栅栏分隔的代码块必须缩进四个空格以便于`item two`中的`i`对齐。

有序列表可以通过用正整数加`.`或者`)`来替代"项目"符号，`*`，`+`或者`-`，来编写。

```
Two ordered lists:

 1. item one
 2. item two
 3. item three

 5) item five
 6) item six
 7) item seven
```

一个有序列表可以不从1开始编号，如同上例的第二个列表所示，这个列表从5开始编号。如同无序列表一样，有序列表可以包含嵌套的顶层元素。

#### 显示方程

大型的``\LaTeX``方程无法放进段落的行列中，可以使用"语言"为`math`的栅栏分隔的代码块将其写成显示方程，如同下列例子：

````julia
```math
f(a) = \frac{1}{2\pi}\int_{0}^{2\pi} (\alpha+R\cos(\theta))d\theta
```
````

#### 脚注

这个语法是与[Footnote references](@ref)内联语法相配合的。请确认也读过那个章节。

与脚注引用语法相似，脚注文本使用如下语法定义，不包括脚注标签之后的`:`字符：

```
[^1]: Numbered footnote text.

[^note]:

    Named footnote text containing several toplevel elements.

      * item one
      * item two
      * item three

    ```julia
    function func(x)
        # ...
    end
    ```
```

!!! note
在语法分析中并没有校验所有的脚注引用是否都有对应的脚注。

#### 横向法则

HTML标签`<hr>`等效于下列语法：

```
该行之上的文本

---

和该行之下的文本。
```

#### 表格

基础表格可以使用下列语法编写。注意Markdown表格只有有限的特征，不像上述讨论的其他元素，不能包含嵌套的顶层元素 –
只允许内联元素。表格必须包含有列名的标题行。表格单元格不能够跨行或者跨列。

```
| 列一 | 列二 | 列三 |
|:---------- | ---------- |:------------:|
| 行 `1`    | 列 `2` |              |
| *行* 2    | **行** 2  | 列 ``3`` |
```

!!! note
如同上例中所示，每列的`|`字符必须纵向对齐。

在每列的标题分隔符(含有`-`字符的行)两边中一边出现的`:`字符指定这一行是左对齐，右对齐还是（当两边都出现`:`）居中对齐。
没有`:`字符时默认右对齐。

#### 警告

特殊格式的块，被称为警告，可用来高光特殊的备注。它们可以使用下列的`!!!`语法定义：

```
!!! note

  这是笔记的内容。

!!! warning "Beware!"

这是另外一个。

warning警告有一个自定义标题：`"Beware!"`。
```

警告的类型可以是任意单词，但是有些类型会产生特殊的类型化，名为（按严重程度降序）: `danger`，`warning`，`info`/`note`，和`tip`。

盒子的自定义标题可以以警告类型之后的字符串（以双重引用形式）形式提供。如果在警告类型后没有指定标题文本，块的类型将用作标题，也就是说`note`警告时会使用`"Note"`作为标题。

警告，和大部分其他顶层元素一样，也可以包含其他顶层元素。

## Markdown语法扩展

Julia的Markdown支持插值，与基础的字符串字面值非常相似，区别是它会将对象本身存储到一个Markdown树（对应的是直接转换成字符串）。当Markdown内容渲染时，常用的`show`方法会被调用，也会照例重写。这个设计允许在不把基础语法搞杂乱的情况下可以扩展出任意的复杂的特征（比如引用）。

原则上，Markdown语法分析器自己可以通过包来进行任意扩展，或者可以使用完整的自定义的Markdown风味，但是这通常应该是非必须的。
