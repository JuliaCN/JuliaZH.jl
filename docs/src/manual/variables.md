# 变量

```@raw html
<!-- # Variables -->
```

Julia 中，变量（Variable）即是关联（或绑定）到一个值的名字。当你想存下一个值（比如从某些数学运算后得到的）以备后用时，变量就显得非常有用。例如：

```@raw html
<!-- A variable, in Julia, is a name associated (or bound) to a value. It's useful when you want to
store a value (that you obtained after some math, for example) for later use. For example: -->
```

```julia-repl
# Assign the value 10 to the variable x
julia> x = 10
10

# Doing math with x's value
julia> x + 1
11

# Reassign x's value
julia> x = 1 + 1
2

# You can assign values of other types, like strings of text
julia> x = "Hello World!"
"Hello World!"
```

Julia 为变量命名提供了一个极其灵活的系统。变量名区分大小写，并且没有语义上的意义（语言不会因为变量的名字区别而区别对待它们）。

```@raw html
<!-- Julia provides an extremely flexible system for naming variables. Variable names are case-sensitive,
and have no semantic meaning (that is, the language will not treat variables differently based
on their names). -->
```

```jldoctest
julia> x = 1.0
1.0

julia> y = -3
-3

julia> Z = "My string"
"My string"

julia> customary_phrase = "Hello world!"
"Hello world!"

julia> UniversalDeclarationOfHumanRightsStart = "人人生而自由，在尊严和权利上一律平等。"
"人人生而自由，在尊严和权利上一律平等。"
```

也可以使用 Unicode 字符（UTF-8 编码）来命名：

```@raw html
<!-- Unicode names (in UTF-8 encoding) are allowed: -->
```

```jldoctest
julia> δ = 0.00001
1.0e-5

julia> 안녕하세요 = "Hello"
"Hello"
```

在 Julia 的 REPL 以及一些其它的 Julia 编辑环境中，很多 Unicode 的数学符号可以使用反斜杠加 LaTeX 符号名并跟上一个 tab 打出。例如，想输入变量名 `δ` 的话，可以输入 `\delta`-*tab*。你甚至可以用 `\alpha`-*tab*-`\hat`-*tab*-`\_2`-*tab* 来输入 `α̂₂` 这样复杂的名字。如果你在某个地方（比如别人的代码里）看到一个不知道怎么输入的符号，REPL 的帮助功能会告诉你：只需要输入 `?` 然后粘贴上那个符号即可。

```@raw html
<!-- In the Julia REPL and several other Julia editing environments, you can type many Unicode math
symbols by typing the backslashed LaTeX symbol name followed by tab. For example, the variable
name `δ` can be entered by typing `\delta`-*tab*, or even `α̂₂` by `\alpha`-*tab*-`\hat`-
*tab*-`\_2`-*tab*. (If you find a symbol somewhere, e.g. in someone else's code,
that you don't know how to type, the REPL help will tell you: just type `?` and
then paste the symbol.) -->
```

Julia 甚至允许你在需要的时候重新定义那些内建常量和函数（虽然为了避免潜在的混乱，这是不被推荐的）：

```@raw html
<!-- Julia will even let you redefine built-in constants and functions if needed (although
this is not recommended to avoid potential confusions): -->
```

```jldoctest
julia> pi = 3
3

julia> pi
3

julia> sqrt = 4
4
```

然而，如果试图重新定义一个已经在使用中的内建常量或函数，Julia 会报错：

```@raw html
<!-- However, if you try to redefine a built-in constant or function already in use, Julia will give
you an error: -->
```

```jldoctest
julia> pi
π = 3.1415926535897...

julia> pi = 3
ERROR: cannot assign variable MathConstants.pi from module Main

julia> sqrt(100)
10.0

julia> sqrt = 4
ERROR: cannot assign variable Base.sqrt from module Main
```

## 可用的变量名
```@raw html
<!-- ## Allowed Variable Names -->
```

变量名的第一位必须以下字符：
* 字母（A-Z 或者 a-z）或下划线（_）
* 或编码大于 00A0 的 Unicode 字符的一个子集。具体来说指的是，[Unicode 字符分类](http://www.fileformat.info/info/unicode/category/index.htm)中的
  * Lu/Ll/Lt/Lm/Lo/Nl（字母）
  * Sc/So（货币及其他符号）
  * 一些其它像字母的符号（比如，Sm 数学符号的一个子集）

后续的字符可以包含 ! 和数字（0-9 和其它处于 Nd/No 分类中的字符），以及其它 Unicode 字符：变音和其它修饰符号（Mn/Mc/Me/Sk 分类），一些连接标点（Pc 分类），角分符号和一些其他字符。
```@raw html

<!-- Variable names must begin with a letter (A-Z or a-z), underscore, or a subset of Unicode code
points greater than 00A0; in particular, [Unicode character categories](http://www.fileformat.info/info/unicode/category/index.htm)
Lu/Ll/Lt/Lm/Lo/Nl (letters), Sc/So (currency and other symbols), and a few other letter-like characters
(e.g. a subset of the Sm math symbols) are allowed. Subsequent characters may also include ! and
digits (0-9 and other characters in categories Nd/No), as well as other Unicode code points: diacritics
and other modifying marks (categories Mn/Mc/Me/Sk), some punctuation connectors (category Pc),
primes, and a few other characters. -->
```

像 `+` 这样的运算符也是合法的标识符，但会被特殊地解析。在一些上下文中，运算符可以就像变量一样被使用。比如说，`(+)` 指的是加法函数，且 `(+) = f` 会把它重新赋值。大多数表示中缀运算符的 Unicode 字符（在 Sm 分类中的），比如说 `⊕`，都会被解析成中缀运算符，且可供用户定义的方法使用（比如说，可以用 `const ⊗ = kron` 来定义 `⊗` 为一个中缀的克罗内克积）。运算符也可以放在一些修饰符、角分符号和上下标之前，比如说 `+̂ₐ″` 会被解析成一个和 `+` 同样优先级的中缀运算符。

```@raw html
<!-- Operators like `+` are also valid identifiers, but are parsed specially. In some contexts, operators
can be used just like variables; for example `(+)` refers to the addition function, and `(+) = f`
will reassign it. Most of the Unicode infix operators (in category Sm), such as `⊕`, are parsed
as infix operators and are available for user-defined methods (e.g. you can use `const ⊗ = kron`
to define `⊗` as an infix Kronecker product).  Operators can also be suffixed with modifying marks,
primes, and sub/superscripts, e.g. `+̂ₐ″` is parsed as an infix operator with the same precedence as `+`.
-->
```

内建语句的名字是唯一明确被禁止的变量名：

```@raw html
<!-- The only explicitly disallowed names for variables are the names of built-in statements: -->
```

```julia-repl
julia> else = false
ERROR: syntax: unexpected "else"

julia> try = "No"
ERROR: syntax: unexpected "="
```

有一些 Unicode 字符作为标识符会被认为是等价的。输入 Unicode 组合字符（比如重音）的不同方式也被看作是等价的（具体来说，Julia 标识符是 NFC-正规化的）。Unicode 字符 `ɛ` (U+025B: Latin small letter open e) 和 `µ` (U+00B5: micro sign) 会被视为与相应的希腊字母等价，因为前者在一些输入方式中很容易访问到。

```@raw html
<!-- Some Unicode characters are considered to be equivalent in identifiers.
Different ways of entering Unicode combining characters (e.g., accents)
are treated as equivalent (specifically, Julia identifiers are NFC-normalized).
The Unicode characters `ɛ` (U+025B: Latin small letter open e)
and `µ` (U+00B5: micro sign) are treated as equivalent to the corresponding
Greek letters, because the former are easily accessible via some input methods. -->
```

## 命名规范

```@raw html

<!-- ## Stylistic Conventions -->
```

尽管 Julia 对命名本身只有很少的限制，但遵循下列规范是很有用的：

```@raw html

<!-- While Julia imposes few restrictions on valid names, it has become useful to adopt the following
conventions: -->
```

  * 变量名使用小写字母。
  * 单词分隔符可以使用下划线（`'_'`），但除非名字很难阅读否则并不鼓励使用下划线。
  * `Type` 和 `Module` 的名字都使用大写字母开头，且单词的分隔使用大写驼峰命名法而不是下划线。
  * `function` 和 `macro` 的名字使用小写字母，并不含下划线。
  * 会写入自身参数的函数名使用 `!` 作为结尾。这样的函数有时被称为“变异（mutating）”或是“原地（in-place）”函数，因为调用它们除了会返回一个值之外，参数还会产生变化。

```@raw html
  <!-- * Names of variables are in lower case.
  * Word separation can be indicated by underscores (`'_'`), but use of underscores is discouraged
    unless the name would be hard to read otherwise.
  * Names of `Type`s and `Module`s begin with a capital letter and word separation is shown with upper
    camel case instead of underscores.
  * Names of `function`s and `macro`s are in lower case, without underscores.
  * Functions that write to their arguments have names that end in `!`. These are sometimes called
    "mutating" or "in-place" functions because they are intended to produce changes in their arguments
    after the function is called, not just return a value. -->
```

关于命名规范的更多信息请参考[代码风格指南](@ref)。

```@raw html

<!-- For more information about stylistic conventions, see the [Style Guide](@ref). -->
```
