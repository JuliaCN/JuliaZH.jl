# 文档

自Julia 0.4 开始，Julia允许开发者和用户，使用其内置的文档系统更加便捷地为函数、类型以及其他对象编写文档。

基础语法很简单：紧接在对象（函数，宏，类型和实例）之前的字符串都会被认为是对应对象的文档（称作*docstrings*）。
注意不要在docstring和文档对象之间有空行或者注释。
这里有个基础的例子：

```julia
"Tell whether there are too foo items in the array."
foo(xs::Array) = ...
```

文档会被翻译成[Markdown](https://en.wikipedia.org/wiki/Markdown)，所以你可以
使用缩进和代码栅栏来分隔代码示例和文本。从技术上来说，任何对象
可以作为元数据与任何其他对象关联；Markdown是默认的，但是可以创建
其他字符串宏并传递给`@doc`宏来使用其他格式。

这里是更加复杂的例子，但仍然使用Markdown：

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
   以便被像Julia代码一样显示。

   Julia代码中的签名显示是统一的（像`mean(x::AbstractArray)`），
   另有简化模式。可选参数应该尽可能与默认值一同显示(例如
   `f(x, y=1)`），遵循实际的Julia语法。没有默认值的
   可选参数应该放在括号中（例如`f(x[, y])` 和 `f(x[, y[, z]]`)）。可选的解决方法是
   使用多行：一个没有可选参数，其他的拥有可选参数（或者多个可选参数）。
   这个解决方案也可以用作给某个函数的多个相关方法来写文档。当一个函数
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
    例子应尽可能**独立**和**可运行**以便读者可以
在不需要引入任何依赖的情况下进行对他们进行实验。
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

Documentation written in non-toplevel blocks, such as `begin`, `if`, `for`, and `let`, is
added to the documentation system as blocks are evaluated. For example:

```julia
if condition()
    "..."
    f(x) = x
end
```

will add documentation to `f(x)` when `condition()` is `true`. Note that even if `f(x)` goes
out of scope at the end of the block, its documentation will remain.

### Dynamic documentation

Sometimes the appropriate documentation for an instance of a type depends on the field values of that
instance, rather than just on the type itself. In these cases, you can add a method to `Docs.getdoc`
for your custom type that returns the documentation on a per-instance basis. For instance,

```julia
struct MyType
    value::String
end

Docs.getdoc(t::MyType) = "Documentation for MyType with value $(t.value)"

x = MyType("x")
y = MyType("y")
```

`?x` will display "Documentation for MyType with value x" while `?y` will display
"Documentation for MyType with value y".

## Syntax Guide

A comprehensive overview of all documentable Julia syntax.

In the following examples `"..."` is used to illustrate an arbitrary docstring.

`doc""` should only be used when the docstring contains `$` or `\` characters that should not
be parsed by Julia such as LaTeX syntax or Julia source code examples containing interpolation.

### Functions and Methods

```julia
"..."
function f end

"..."
f
```

Adds docstring `"..."` to the function `f`. The first version is the preferred syntax, however both
are equivalent.

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

Adds docstring `"..."` to the method `f(::Any)`.

```julia
"..."
f(x, y = 1) = x + y
```

Adds docstring `"..."` to two `Method`s, namely `f(::Any)` and `f(::Any, ::Any)`.

### Macros

```julia
"..."
macro m(x) end
```

Adds docstring `"..."` to the `@m(::Any)` macro definition.

```julia
"..."
:(@m)
```

Adds docstring `"..."` to the macro named `@m`.

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

Adds the docstring `"..."` to types `T1`, `T2`, and `T3`.

```julia
"..."
struct T
    "x"
    x
    "y"
    y
end
```

Adds docstring `"..."` to type `T`, `"x"` to field `T.x` and `"y"` to field `T.y`. Also applicable
to `mutable struct` types.

### 模块

```julia
"..."
module M end

module M

"..."
M

end
```

Adds docstring `"..."` to the `Module``M`. Adding the docstring above the `Module` is the preferred
syntax, however both are equivalent.

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

Documenting a `baremodule` by placing a docstring above the expression automatically imports
`@doc` into the module. These imports must be done manually when the module expression is not
documented. Empty `baremodule`s cannot be documented.

### Global Variables

```julia
"..."
const a = 1

"..."
b = 2

"..."
global c = 3
```

Adds docstring `"..."` to the `Binding`s `a`, `b`, and `c`.

`Binding`s are used to store a reference to a particular `Symbol` in a `Module` without storing
the referenced value itself.

!!! note
    When a `const` definition is only used to define an alias of another definition, such as is the
    case with the function `div` and its alias `÷` in `Base`, do not document the alias and instead
    document the actual function.

    If the alias is documented and not the real definition then the docsystem (`?` mode) will not
    return the docstring attached to the alias when the real definition is searched for.

    For example you should write

    ```julia
    "..."
    f(x) = x + 1
    const alias = f
    ```

    rather than

    ```julia
    f(x) = x + 1
    "..."
    const alias = f
    ```

```julia
"..."
sym
```

Adds docstring `"..."` to the value associated with `sym`. Users should prefer documenting `sym`
at its definition.

### Multiple Objects

```julia
"..."
a, b
```

Adds docstring `"..."` to `a` and `b` each of which should be a documentable expression. This
syntax is equivalent to

```julia
"..."
a

"..."
b
```

Any number of expressions many be documented together in this way. This syntax can be useful when
two functions are related, such as non-mutating and mutating versions `f` and `f!`.

### Macro-generated code

```julia
"..."
@m expression
```

Adds docstring `"..."` to expression generated by expanding `@m expression`. This allows for expressions
decorated with `@inline`, `@noinline`, `@generated`, or any other macro to be documented in the
same way as undecorated expressions.

Macro authors should take note that only macros that generate a single expression will automatically
support docstrings. If a macro returns a block containing multiple subexpressions then the subexpression
that should be documented must be marked using the [`@__doc__`](@ref Core.@__doc__) macro.

The `@enum` macro makes use of `@__doc__` to allow for documenting `Enum`s. Examining its definition
should serve as an example of how to use `@__doc__` correctly.

```@docs
Core.@__doc__
```

## Markdown syntax

The following markdown syntax is supported in Julia.

### Inline elements

Here "inline" refers to elements that can be found within blocks of text, i.e. paragraphs. These
include the following elements.

#### Bold

Surround words with two asterisks, `**`, to display the enclosed text in boldface.

```
A paragraph containing a **bold** word.
```

#### Italics

Surround words with one asterisk, `*`, to display the enclosed text in italics.

```
A paragraph containing an *emphasised* word.
```

#### Literals

Surround text that should be displayed exactly as written with single backticks, ``` ` ``` .

```
A paragraph containing a `literal` word.
```

Literals should be used when writing text that refers to names of variables, functions, or other
parts of a Julia program.

!!! tip
    To include a backtick character within literal text use three backticks rather than one to enclose
    the text.

    ```
    A paragraph containing a ``` `backtick` character ```.
    ```

    By extension any odd number of backticks may be used to enclose a lesser number of backticks.

#### ``\LaTeX``

Surround text that should be displayed as mathematics using ``\LaTeX`` syntax with double backticks,
``` `` ``` .

```
A paragraph containing some ``\LaTeX`` markup.
```

!!! tip
    As with literals in the previous section, if literal backticks need to be written within double
    backticks use an even number greater than two. Note that if a single literal backtick needs to
    be included within ``\LaTeX`` markup then two enclosing backticks is sufficient.

#### Links

Links to either external or internal addresses can be written using the following syntax, where
the text enclosed in square brackets, `[ ]`, is the name of the link and the text enclosed in
parentheses, `( )`, is the URL.

```
A paragraph containing a link to [Julia](http://www.julialang.org).
```

It's also possible to add cross-references to other documented functions/methods/variables within
the Julia documentation itself. For example:

```julia
"""
    accumulate!(op, y, x)

Cumulative operation `op` on a vector `x`, storing the result in `y`. See also [`accumulate`](@ref).
"""
```

This will create a link in the generated docs to the `accumulate` documentation
(which has more information about what this function actually does). It's good to include
cross references to mutating/non-mutating versions of a function, or to highlight a difference
between two similar-seeming functions.

!!! note
    The above cross referencing is *not* a Markdown feature, and relies on
    [Documenter.jl](https://github.com/JuliaDocs/Documenter.jl), which is
    used to build base Julia's documentation.

#### Footnote references

Named and numbered footnote references can be written using the following syntax. A footnote name
must be a single alphanumeric word containing no punctuation.

```
A paragraph containing a numbered footnote [^1] and a named one [^named].
```

!!! note
    The text associated with a footnote can be written anywhere within the same page as the footnote
    reference. The syntax used to define the footnote text is discussed in the [Footnotes](@ref) section
    below.

### Toplevel elements

The following elements can be written either at the "toplevel" of a document or within another
"toplevel" element.

#### Paragraphs

A paragraph is a block of plain text, possibly containing any number of inline elements defined
in the [Inline elements](@ref) section above, with one or more blank lines above and below it.

```
This is a paragraph.

And this is *another* one containing some emphasised text.
A new line, but still part of the same paragraph.
```

#### Headers

A document can be split up into different sections using headers. Headers use the following syntax:

```julia
# Level One
## Level Two
### Level Three
#### Level Four
##### Level Five
###### Level Six
```

A header line can contain any inline syntax in the same way as a paragraph can.

!!! tip
    Try to avoid using too many levels of header within a single document. A heavily nested document
    may be indicative of a need to restructure it or split it into several pages covering separate
    topics.

#### Code blocks

Source code can be displayed as a literal block using an indent of four spaces as shown in the
following example.

```
This is a paragraph.

    function func(x)
        # ...
    end

Another paragraph.
```

Additionally, code blocks can be enclosed using triple backticks with an optional "language" to
specify how a block of code should be highlighted.

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
    "Fenced" code blocks, as shown in the last example, should be preferred over indented code blocks
    since there is no way to specify what language an indented code block is written in.

#### Block quotes

Text from external sources, such as quotations from books or websites, can be quoted using `>`
characters prepended to each line of the quote as follows.

```
Here's a quote:

> Julia is a high-level, high-performance dynamic programming language for
> technical computing, with syntax that is familiar to users of other
> technical computing environments.
```

Note that a single space must appear after the `>` character on each line. Quoted blocks may themselves
contain other toplevel or inline elements.

#### Images

The syntax for images is similar to the link syntax mentioned above. Prepending a `!` character
to a link will display an image from the specified URL rather than a link to it.

```julia
![alternative text](link/to/image.png)
```

#### Lists

Unordered lists can be written by prepending each item in a list with either `*`, `+`, or `-`.

```
A list of items:

  * item one
  * item two
  * item three
```

Note the two spaces before each `*` and the single space after each one.

Lists can contain other nested toplevel elements such as lists, code blocks, or quoteblocks. A
blank line should be left between each list item when including any toplevel elements within a
list.

```
Another list:

  * item one

  * item two

    ```
    f(x) = x
    ```

  * And a sublist:

      + sub-item one
      + sub-item two
```

!!! note
    The contents of each item in the list must line up with the first line of the item. In the above
    example the fenced code block must be indented by four spaces to align with the `i` in `item two`.

Ordered lists are written by replacing the "bullet" character, either `*`, `+`, or `-`, with a
positive integer followed by either `.` or `)`.

```
Two ordered lists:

 1. item one
 2. item two
 3. item three

 5) item five
 6) item six
 7) item seven
```

An ordered list may start from a number other than one, as in the second list of the above example,
where it is numbered from five. As with unordered lists, ordered lists can contain nested toplevel
elements.

#### Display equations

Large ``\LaTeX`` equations that do not fit inline within a paragraph may be written as display
equations using a fenced code block with the "language" `math` as in the example below.

````julia
```math
f(a) = \frac{1}{2\pi}\int_{0}^{2\pi} (\alpha+R\cos(\theta))d\theta
```
````

#### Footnotes

This syntax is paired with the inline syntax for [Footnote references](@ref). Make sure to read
that section as well.

Footnote text is defined using the following syntax, which is similar to footnote reference syntax,
aside from the `:` character that is appended to the footnote label.

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
    No checks are done during parsing to make sure that all footnote references have matching footnotes.

#### Horizontal rules

The equivalent of an `<hr>` HTML tag can be written using the following syntax:

```
Text above the line.

---

And text below the line.
```

#### Tables

Basic tables can be written using the syntax described below. Note that markdown tables have limited
features and cannot contain nested toplevel elements unlike other elements discussed above –
only inline elements are allowed. Tables must always contain a header row with column names. Cells
cannot span multiple rows or columns of the table.

```
| Column One | Column Two | Column Three |
|:---------- | ---------- |:------------:|
| Row `1`    | Column `2` |              |
| *Row* 2    | **Row** 2  | Column ``3`` |
```

!!! note
    As illustrated in the above example each column of `|` characters must be aligned vertically.

    A `:` character on either end of a column's header separator (the row containing `-` characters)
    specifies whether the row is left-aligned, right-aligned, or (when `:` appears on both ends) center-aligned.
    Providing no `:` characters will default to right-aligning the column.

#### Admonitions

Specially formatted blocks, known as admonitions, can be used to highlight particular remarks.
They can be defined using the following `!!!` syntax:

```
!!! note

    This is the content of the note.

!!! warning "Beware!"

    And this is another one.

    This warning admonition has a custom title: `"Beware!"`.
```

The type of the admonition can be any word, but some types produce special styling,
namely (in order of decreasing severity): `danger`, `warning`, `info`/`note`, and `tip`.

A custom title for the box can be provided as a string (in double quotes) after the admonition type.
If no title text is specified after the admonition type, then the title used will be the type of the block,
i.e. `"Note"` in the case of the `note` admonition.

Admonitions, like most other toplevel elements, can contain other toplevel elements.

## Markdown Syntax Extensions

Julia's markdown supports interpolation in a very similar way to basic string literals, with the
difference that it will store the object itself in the Markdown tree (as opposed to converting
it to a string). When the Markdown content is rendered the usual `show` methods will be called,
and these can be overridden as usual. This design allows the Markdown to be extended with arbitrarily
complex features (such as references) without cluttering the basic syntax.

In principle, the Markdown parser itself can also be arbitrarily extended by packages, or an entirely
custom flavour of Markdown can be used, but this should generally be unnecessary.
