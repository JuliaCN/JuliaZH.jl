# [变量](@id man-variables)

Julia 语言中，变量是与某个值相关联（或绑定）的名字。你可以用它来保存一个值（例如某些计算得到的结果），供之后的代码使用。例如：

```julia-repl
# 将 10 赋值给变量 x
julia> x = 10
10

# 使用 x 的值做计算
julia> x + 1
11

# 重新给 x 赋值
julia> x = 1 + 1
2

# 也可以给 x 赋其它类型的值, 比如字符串文本
julia> x = "Hello World!"
"Hello World!"
```

Julia 提供了非常灵活的变量命名策略。变量名是大小写敏感的，且不包含语义，意思是说，Julia 不会根据变量的名字来区别对待它们。
（译者注：Julia **不会**自动将全大写的变量识别为常量，也**不会**将有特定前后缀的变量自动识别为某种特定类型的变量，即不会根据变量名字，自动判断变量的任何属性。）

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

你还可以使用 UTF-8 编码的 Unicode 字符作为变量名：

```jldoctest
julia> δ = 0.00001
1.0e-5

julia> 안녕하세요 = "Hello"
"Hello"
```

在 Julia REPL 和一些其它 Julia 的编辑器中，很多 Unicode 数学符号可以使用反斜杠加 LaTeX 符号接 tab 健打出。例如： 变量名 `δ` 可以通过 `\delta`-*tab* 来输入，甚至可以用 `\alpha`-*tab*-`\hat`-*tab*-`\^(2)`-*tab*来输入 `α̂⁽²⁾` 这种复杂的变量名。（如果你在某个地方发现了一个不知道怎么输入的符号，比如在别人的代码里，输入`?` 接着复制那个符号，REPL的帮助功能会告诉你输入方法。）

如果有需要的话，Julia 甚至允许你重定义内置常量和函数。（这样做可能引发潜在的混淆，所以并不推荐）

```jldoctest
julia> pi = 3
3

julia> pi
3

julia> sqrt = 4
4
```

然而，如果你试图重定义一个已经在使用中的内置常量或函数，Julia 会报错：

```jldoctest
julia> pi
π = 3.1415926535897...

julia> pi = 3
ERROR: cannot assign a value to variable MathConstants.pi from module Main

julia> sqrt(100)
10.0

julia> sqrt = 4
ERROR: cannot assign a value to variable Base.sqrt from module Main
```

## [合法的变量名](@id man-allowed-variable-names)

变量名字必须以英文字母（A-Z 或 a-z）、下划线或编码大于 00A0 的 Unicode 字符的一个子集开头。
具体来说指的是，[Unicode字符分类](http://www.fileformat.info/info/unicode/category/index.htm)中的
Lu/Ll/Lt/Lm/Lo/Nl（字母）、Sc/So（货币和其他符号）以及一些其它像字母的符号（例如 Sm 类别数学符号中的一部分）。
变量名的非首字符还允许使用惊叹号 `!`、数字（包括 0-9 和其他 Nd/No 类别中的 Unicode 字符）以及其它 Unicode 字符：变音符号和其他修改标记（Mn/Mc/Me/Sk 类别）、标点和连接符（Pc 类别）、引号和少许其他字符。

像 `+` 这样的运算符也是合法的标识符，但是它们会被特别地解析。 在一些上下文中，运算符可以像变量一样使用，比如 `(+)` 表示加函数，语句 `(+) = f`会把它重新赋值。大部分 Unicode 中缀运算符（Sm 类别），像 `⊕`，会被解析成真正的中缀运算符，并且支持用户自定义方法（举个例子，你可以使用语句 `const ⊗ = kron `将 `⊗` 定义为中缀的 Kronecker 积）。 运算符也可以使用修改标记、引号和上标/下标进行加缀，例如 `+̂ₐ″` 被解析成一个与 `+` 具有相同优先级的中缀运算符。以下标/上标字母结尾的运算符与后续变量名之间需要一个空格。举个例子，如果 `+ᵃ` 是一个运算符，那么 `+ᵃx` 应该被写为`+ᵃ x`，以区分表达式 `+ ᵃx` ，其中 `ᵃx` 是变量名。


一类特定的变量名是只包含下划线的变量名。这些标识符只能赋值，不能用于给其他变量赋值。严格来说，它们只能用作[左值](https://en.wikipedia.org/wiki/Value_(computer_science)#lrvalue) 而不能作[右值](https://en.wikipedia.org/wiki/R-value):

```julia-repl
julia> x, ___ = size([2 2; 1 1])
(2, 2)

julia> y = ___
ERROR: syntax: all-underscore identifier used as rvalue
```

唯一明确禁止的变量名称是内置[关键字](@ref Keywords)的名称：

```julia-repl
julia> else = false
ERROR: syntax: unexpected "else"

julia> try = "No"
ERROR: syntax: unexpected "="
```

某些 Unicode 字符被认为是等效的标识符。不同的输入 Unicode 组合字符的方法（例如：重音）被视为等价的（Julia 标识符采用 [NFC](http://www.macchiato.com/unicode/nfc-faq) 标准）。Julia 还加入了一些非标准的等价字符，用于在视觉上相似且易于通过某些输入法输入的字符。Unicode 字符 `ɛ` (U+025B: Latin small letter open e) 和 `µ` (U+00B5: micro sign) 被视为等同于相应的希腊字母。点 `·` (U+00B7) 和希腊字符[间断](https://en.wikipedia.org/wiki/Interpunct) `·` (U+0387) 都被当作数学上的点积运算符 `⋅` (U+22C5)。减号 `−` (U+2212) 与连接号 `-` (U+002D) 也被视作相同的符号。

## 命名规范

虽然 Julia 语言对合法名字的限制非常少，但是遵循以下这些命名规范是非常有用的：

  * 变量的名字采用小写。
  * 使用下划线（`'_'`）来分隔名字中的单词，但是不鼓励使用下划线
    除非在不使用下划线时名字会非常难读。
  * 类型 (`Type`) 和模块（`Module`）的名字使用大写字母开头，并且用大写字母
    而不是用下划线分隔单词。
  * 函数（`function`）和宏（`macro`）的名字使用小写，不使用下划线。
  * 会对输入参数进行更改的函数要使用 `!` 结尾。这些函数有时叫做
    “mutating” 或 “in-place” 函数，因为它们在被调用后会修改他们的输入参数的内容
    而不仅仅只是返回一个值。

关于命名规范的更多信息，可查看[代码风格指南](@ref)。
