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
ERROR: cannot assign a value to imported variable Base.pi from module Main

julia> sqrt(100)
10.0

julia> sqrt = 4
ERROR: cannot assign a value to imported variable Base.sqrt from module Main
```

## [合法的变量名](@id man-allowed-variable-names)

变量名字必须以英文字母（A-Z 或 a-z）、下划线或编码大于 00A0 的 Unicode 字符的一个子集开头。
具体来说指的是，[Unicode字符分类](https://www.fileformat.info/info/unicode/category/index.htm)中的
Lu/Ll/Lt/Lm/Lo/Nl（字母）、Sc/So（货币和其他符号）以及一些其它像字母的符号（例如 Sm 类别数学符号中的一部分）。
变量名的非首字符还允许使用惊叹号 `!`、数字（包括 0-9 和其他 Nd/No 类别中的 Unicode 字符）以及其它 Unicode 字符：变音符号和其他修改标记（Mn/Mc/Me/Sk 类别）、标点和连接符（Pc 类别）、引号和少许其他字符。

像 `+` 这样的运算符也是合法的标识符，但是它们会被特别地解析。 在一些上下文中，运算符可以像变量一样使用，比如 `(+)` 表示加函数，语句 `(+) = f`会把它重新赋值。大部分 Unicode 中缀运算符（Sm 类别），像 `⊕`，会被解析成真正的中缀运算符，并且支持用户自定义方法（举个例子，你可以使用语句 `const ⊗ = kron `将 `⊗` 定义为中缀的 Kronecker 积）。 运算符也可以使用修改标记、引号和上标/下标进行加缀，例如 `+̂ₐ″` 被解析成一个与 `+` 具有相同优先级的中缀运算符。以下标/上标字母结尾的运算符与后续变量名之间需要一个空格。举个例子，如果 `+ᵃ` 是一个运算符，那么 `+ᵃx` 应该被写为`+ᵃ x`，以区分表达式 `+ ᵃx` ，其中 `ᵃx` 是变量名。


一类特定的变量名是只包含下划线的变量名。这些标识符只能赋值，不能用于给其他变量赋值。
这些标识符只能赋值，赋值后会立即丢弃，因此不能用于为其他变量赋值。
严格来说，它们只能用作 [左值(`rvalues`)](https://en.wikipedia.org/wiki/Value_(computer_science)#Assignment:_l-values_and_r-values) 而不能作右值。

```julia-repl
julia> x, ___ = size([2 2; 1 1])
(2, 2)

julia> y = ___
ERROR: syntax: all-underscore identifier used as rvalue

julia> println(___)
ERROR: syntax: all-underscore identifier used as rvalue
```

The only explicitly disallowed names for variables are the names of the built-in [Keywords](@ref Keywords):

```julia-repl
julia> else = false
ERROR: syntax: unexpected "else"

julia> try = "No"
ERROR: syntax: unexpected "="
```

Some Unicode characters are considered to be equivalent in identifiers.
Different ways of entering Unicode combining characters (e.g., accents)
are treated as equivalent (specifically, Julia identifiers are [NFC](https://en.wikipedia.org/wiki/Unicode_equivalence).
Julia also includes a few non-standard equivalences for characters that are
visually similar and are easily entered by some input methods. The Unicode
characters `ɛ` (U+025B: Latin small letter open e) and `µ` (U+00B5: micro sign)
are treated as equivalent to the corresponding Greek letters. The middle dot
`·` (U+00B7) and the Greek
[interpunct](https://en.wikipedia.org/wiki/Interpunct) `·` (U+0387) are both
treated as the mathematical dot operator `⋅` (U+22C5).
The minus sign `−` (U+2212) is treated as equivalent to the hyphen-minus sign `-` (U+002D).

## [Assignment expressions and assignment versus mutation](@id man-assignment-expressions)

An assignment `variable = value` "binds" the name `variable` to the `value` computed
on the right-hand side, and the whole assignment is treated by Julia as an expression
equal to the right-hand-side `value`.  This means that assignments can be *chained*
(the same `value` assigned to multiple variables with `variable1 = variable2 = value`)
or used in other expressions, and is also why their result is shown in the REPL as
the value of the right-hand side.  (In general, the REPL displays the value of whatever
expression you evaluate.)  For example, here the value `4` of `b = 2+2` is
used in another arithmetic operation and assignment:

```jldoctest
julia> a = (b = 2+2) + 3
7

julia> a
7

julia> b
4
```

A common confusion is the distinction between *assignment* (giving a new "name" to a value)
and *mutation* (changing a value).  If you run `a = 2` followed by `a = 3`, you have changed
the "name" `a` to refer to a new value `3` … you haven't changed the number `2`, so `2+2`
will still give `4` and not `6`!   This distinction becomes more clear when dealing with
*mutable* types like [arrays](@ref lib-arrays), whose contents *can* be changed:

```jldoctest mutation_vs_rebind
julia> a = [1,2,3] # an array of 3 integers
3-element Vector{Int64}:
 1
 2
 3

julia> b = a   # both b and a are names for the same array!
3-element Vector{Int64}:
 1
 2
 3
```

Here, the line `b = a` does *not* make a copy of the array `a`, it simply binds the name
`b` to the *same* array `a`: both `b` and `a` "point" to one array `[1,2,3]` in memory.
In contrast, an assignment `a[i] = value` *changes* the *contents* of the array, and the
modified array will be visible through both the names `a` and `b`:

```jldoctest mutation_vs_rebind
julia> a[1] = 42     # change the first element
42

julia> a = 3.14159   # a is now the name of a different object
3.14159

julia> b   # b refers to the original array object, which has been mutated
3-element Vector{Int64}:
 42
  2
  3
```
That is, `a[i] = value` (an alias for [`setindex!`](@ref)) *mutates* an existing array object
in memory, accessible via either `a` or `b`.  Subsequently setting `a = 3.14159`
does not change this array, it simply binds `a` to a different object; the array is still
accessible via `b`. The other common syntax to mutate an existing object is
`a.field = value` (an alias for [`setproperty!`](@ref)), which can be used to change
a [`mutable struct`](@ref).

When you call a [function](@ref man-functions) in Julia, it behaves as if you *assigned*
the argument values to new variable names corresponding to the function arguments, as discussed
in [Argument-Passing Behavior](@ref man-argument-passing).  (By [convention](@ref man-punctuation),
functions that mutate one or more of their arguments have names ending with `!`.)


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
