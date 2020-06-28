# [字符串](@id man-strings)

字符串是由有限个字符组成的序列。而字符在英文中一般包括字母 `A`,`B`,
`C` 等、数字和常用的标点符号。这些字符由 [ASCII](https://en.wikipedia.org/wiki/ASCII) 标准统一标准化并且与 0 到 127 范围内的整数一一对应。当然，还有很多非英文字符，包括 ASCII 字符在注音或其他方面的变体，例如西里尔字母和希腊字母，以及与 ASCII 和英文均完全无关的字母系统，包括阿拉伯语，中文，
希伯来语，印度语， 日本语， 和韩语。[Unicode](https://en.wikipedia.org/wiki/Unicode) 标准对这些复杂的字符做了统一的定义，是一种大家普遍接受标准。
根据需求，写代码时可以忽略这种复杂性而只处理 ASCII 字符，也可针对可能出现的非 ASCII 文本而处理所有的字符或编码。Julia 可以简单高效地处理纯粹的 ASCII 文本以及 Unicode 文本。
甚至，在 Julia 中用 C 语言风格的代码来处理 ASCII 字符串，可以在不失性能和易读性的前提下达到预期效果。当遇到非 ASCII 文本时，Julia会优雅明确地提示错误信息而不是引入乱码。 这时，直接修改代码使其可以处理非 ASCII 数据即可。

关于 Julia 的字符串类型有一些值得注意的高级特性：

  * Julia 中用于字符串（和字符串文字）的内置具体类型是 [`String`](@ref)。
    它支持全部 [Unicode](https://en.wikipedia.org/wiki/Unicode) 字符
    通过 [UTF-8](https://en.wikipedia.org/wiki/UTF-8) 编码。（[`transcode`](@ref) 函数是
    提供 Unicode 编码和其他编码转换的函数。）
  * 所有的字符串类型都是抽象类型 `AbstractString` 的子类型，而一些外部包定义了别的 `AbstractString` 子类型（例如为其它的编码定义的子类型）。若要定义需要字符串参数的函数，你应当声明此类型为 `AbstractString` 来让这函数接受任何字符串类型。
     
     
     
  * 类似 C 和 Java，但是和大多数动态语言不同的是，Julia 有优秀的表示单字符的类型，即 [`AbstractChar`](@ref)。[`Char`](@ref) 是 `AbstractChar` 的内置子类型，它能表示任何 Unicode 字符的 32 位原始类型（基于 UTF-8 编码）。
     
     
     
  * 如 Java 中那样，字符串不可改——任何 `AbstractString` 对象的值不可改变。
    若要构造不同的字符串值，应当从其它字符串的部分构造一个新的字符串。
  * 从概念上讲，字符串是从索引到字符的*部分函数*：对于某些索引值，它不返回字符值，而是引发异常。这允许通过编码表示形式的字节索引来实现高效的字符串索引，而不是通过字符索引——它不能简单高效地实现可变宽度的 Unicode 字符串编码。
     
     
     
     

## [字符](@id man-characters)

`Char` 类型的值代表单个字符：它只是带有特殊文本表示法和适当算术行为的 32 位原始类型，不能转化为代表 [Unicode 代码](https://en.wikipedia.org/wiki/Code_point) 的数值。（Julia 的包可能会定义别的 `AbstractChar` 子类型，比如当为了优化对其它 [字符编码](https://en.wikipedia.org/wiki/Character_encoding) 的操作时）`Char` 类型的值以这样的方式输入和显示：


```jldoctest
julia> 'x'
'x': ASCII/Unicode U+0078 (category Ll: Letter, lowercase)

julia> typeof(ans)
Char
```

你可以轻松地将 `Char` 转换为其对应的整数值，即 Unicode 代码：

```jldoctest
julia> Int('x')
120

julia> typeof(ans)
Int64
```

在 32 位架构中，[`typeof(ans)`](@ref) 将显示为 [`Int32`](@ref)。你可以轻松地将一个整数值转回 `Char`。

```jldoctest
julia> Char(120)
'x': ASCII/Unicode U+0078 (category Ll: Letter, lowercase)
```

并非所有的整数值都是有效的 Unicode 代码，但是为了性能，`Char` 的转化不会检查每个值是否有效。如果你想检查每个转换的值是否为有效值，请使用 [`isvalid`](@ref) 函数：

```jldoctest
julia> Char(0x110000)
'\U110000': Unicode U+110000 (category In: Invalid, too high)

julia> isvalid(Char, 0x110000)
false
```

目前，有效的 Unicode 码点为，从 `U+0000` 至 `U+D7FF`，以及从 `U+E000` 至 `U+10FFFF`。
它们还未全部被赋予明确的含义，也还没必要能被程序识别；然而，所有的这些值都被认为是有效的 Unicode 字符。

你可以在单引号中输入任何 Unicode 字符，通过使用 `\u` 加上至多 ４ 个十六进制数字或者 `\U` 加上至多 ８ 个十六进制数（最长的有效值也只需要 6 个）：

```jldoctest
julia> '\u0'
'\0': ASCII/Unicode U+0000 (category Cc: Other, control)

julia> '\u78'
'x': ASCII/Unicode U+0078 (category Ll: Letter, lowercase)

julia> '\u2200'
'∀': Unicode U+2200 (category Sm: Symbol, math)

julia> '\U10ffff'
'\U10ffff': Unicode U+10FFFF (category Cn: Other, not assigned)
```

Julia 使用系统默认的区域和语言设置来确定，哪些字符可以被正确显示，哪些需要用 `\u` 或 `\U` 的转义来显示。除 Unicode 转义格式之外，还可以使用所有的[传统 C 语言转义输入形式](https://en.wikipedia.org/wiki/C_syntax#Backslash_escapes)：

```jldoctest
julia> Int('\0')
0

julia> Int('\t')
9

julia> Int('\n')
10

julia> Int('\e')
27

julia> Int('\x7f')
127

julia> Int('\177')
127
```

你可以对 `Char` 的值进行比较和有限的算术运算：

```jldoctest
julia> 'A' < 'a'
true

julia> 'A' <= 'a' <= 'Z'
false

julia> 'A' <= 'X' <= 'Z'
true

julia> 'x' - 'a'
23

julia> 'A' + 1
'B': ASCII/Unicode U+0042 (category Lu: Letter, uppercase)
```

## 字符串基础

字符串字面量由双引号或三重双引号分隔：

```jldoctest helloworldstring
julia> str = "Hello, world.\n"
"Hello, world.\n"

julia> """Contains "quote" characters"""
"Contains \"quote\" characters"
```

If you want to extract a character from a string, you index into it:

```jldoctest helloworldstring
julia> str[begin]
'H': ASCII/Unicode U+0048 (category Lu: Letter, uppercase)

julia> str[1]
'H': ASCII/Unicode U+0048 (category Lu: Letter, uppercase)

julia> str[6]
',': ASCII/Unicode U+002C (category Po: Punctuation, other)

julia> str[end]
'\n': ASCII/Unicode U+000A (category Cc: Other, control)
```

许多的 Julia 对象包括字符串都可以用整数进行索引。第一个元素的索引由 [`firstindex(str)`](@ref) 返回，最后一个由 [`lastindex(str)`](@ref) 返回。关键字 `begin` 和 `end` 可以在索引操作中使用，它们分别表示给定维度上的第一个和最后一个索引。字符串索引就像 Julia 中的大多数索引一样，是从 1 开始的：对于任何 `AbstractString` `firstindex` 总是返回 `1`。
下面我们将会看到，对于一个字符串来说 `lastindex(str)` 和 `length(str)` 的结果 **不一定相同**，因为 Unicode 字符可能由多个编码单元（code units）组成。

你可以用 [`end`](@ref) 进行算术以及其它操作，就像普通值一样：

```jldoctest helloworldstring
julia> str[end-1]
'.': ASCII/Unicode U+002E (category Po: Punctuation, other)

julia> str[end÷2]
' ': ASCII/Unicode U+0020 (category Zs: Separator, space)
```

下标小于开头 `begin` (`1`) 或者大于结尾 `end` 都会导致错误：

```jldoctest helloworldstring
julia> str[begin-1]
ERROR: BoundsError: attempt to access String
  at index [0]
[...]

julia> str[end+1]
ERROR: BoundsError: attempt to access String
  at index [15]
[...]
```

你也可以用范围索引来提取子字符串：

```jldoctest helloworldstring
julia> str[4:9]
"lo, wo"
```

注意到 `str[k]` 和 `str[k:k]` 输出的结果不一样：

```jldoctest helloworldstring
julia> str[6]
',': ASCII/Unicode U+002C (category Po: Punctuation, other)

julia> str[6:6]
","
```

前者是 `Char` 类型的单个字符值，后者是碰巧只有单个字符的字符串值。在 Julia 里面两者大不相同。

范围索引复制了原字符串的选定部分。此外，也可以用 [`SubString`](@ref) 类型创建字符串的 `view`，例如：

```jldoctest
julia> str = "long string"
"long string"

julia> substr = SubString(str, 1, 4)
"long"

julia> typeof(substr)
SubString{String}
```

几个标准函数，像 [`chop`](@ref), [`chomp`](@ref) 或者 [`strip`](@ref) 都会返回一个 [`SubString`](@ref)。

## Unicode 和 UTF-8

Julia 完全支持 Unicode 字符和字符串。[如上所述](@ref man-characters)，在字符字面量中，Unicode 代码可以用 Unicode `\u` 和 `\U` 转义序列表示，也可以用所有标准 C 转义序列表示。这些同样可以用来写字符串字面量：

```jldoctest unicodestring
julia> s = "\u2200 x \u2203 y"
"∀ x ∃ y"
```

这些 Unicode 字符是作为转义还是特殊字符显示，取决于你终端的语言环境设置以及它对 Unicode 的支持。字符串字面量用 UTF-8 编码。UTF-8 是一种可变长度的编码，也就是说并非所有字符都以相同的字节数（code units）编码。在 UTF-8 中，ASCII 字符（小于 0x80(128) 的那些）如它们在 ASCII 中一样使用单字节编码；而 0x80 及以上的字符使用最多 4 个字节编码。在 Julia 中字符串索引指的是代码单元（对于 UTF-8 来说等同于字节/byte），固定宽度的构建块用于编码任意字符（code point）。这意味着并非每个索引到 UTF-8 字符串的字节都必须是一个字符的有效索引。如果在这种无效字节索引处索引字符串，将会报错：

```jldoctest unicodestring
julia> s[1]
'∀': Unicode U+2200 (category Sm: Symbol, math)

julia> s[2]
ERROR: StringIndexError("∀ x ∃ y", 2)
[...]

julia> s[3]
ERROR: StringIndexError("∀ x ∃ y", 3)
Stacktrace:
[...]

julia> s[4]
' ': ASCII/Unicode U+0020 (category Zs: Separator, space)
```

在这种情况下，字符 `∀` 是一个三字节字符，因此索引 2 和 3 都是无效的，而下一个字符的索引是 4；这个接下来的有效索引可以用 [`nextind(s,1)`](@ref) 来计算，再接下来的用 `nextind(s,4)`，依此类推。

如果倒数第二个字符是多字节字符，由于 `end` 总是集合中最后一个有效索引，这时 `end-1` 将会是无效索引。

```jldoctest unicodestring
julia> s[end-1]
' ': ASCII/Unicode U+0020 (category Zs: Separator, space)

julia> s[end-2]
ERROR: StringIndexError("∀ x ∃ y", 9)
Stacktrace:
[...]

julia> s[prevind(s, end, 2)]
'∃': Unicode U+2203 (category Sm: Symbol, math)
```

第一种情况可以，因为最后一个字符 `y` 和空格都是一字节的字符，而 `end-2` 索引到中间的 `∃` 的多字节表示。这里正确的方法是使用 `prevind(s, lastindex(s), 2)`，或者如果你使用那个值来索引在 `s` 中可以写 `s[prevind(s, end, 2)]`， `end` 展开为 `lastindex(s)`。

使用范围索引提取子字符串也需要有效的字节索引，不然就会抛出错误：

```jldoctest unicodestring
julia> s[1:1]
"∀"

julia> s[1:2]
ERROR: StringIndexError("∀ x ∃ y", 2)
Stacktrace:
[...]

julia> s[1:4]
"∀ "
```

由于可变长度的编码，字符串中的字符数（由 [`length(s)`](@ref) 给出）并不总是等于最后一个索引的数字。如果你从 1 到 [`lastindex(s)`](@ref) 迭代并索引到 `s`，未报错时返回的字符序列是包含字符串 `s` 的字符序列。因此总有 `length(s) <= lastindex(s)`，这是因为字符串中的每个字符必须有它自己的索引。下面是对 `s` 的字符进行迭代的一个冗长而低效的方式：

```jldoctest unicodestring
julia> for i = firstindex(s):lastindex(s)
           try
               println(s[i])
           catch
               # ignore the index error
           end
       end
∀

x

∃

y
```

空行上面其实是有空格的。幸运的是，上面的笨拙写法不是对字符串中字符进行迭代所必须的——因为你只需把字符串本身用作迭代对象，而不需要额外处理：

```jldoctest unicodestring
julia> for c in s
           println(c)
       end
∀

x

∃

y
```

如果需要为字符串获取有效索引，可以使用 [`nextind`](@ref) 和 [`prevind`](@ref) 函数递增/递减到下一个/前一个有效索引，如前所述。你也可以使用 [`eachindex`](@ref) 函数迭代有效的字符索引：

```jldoctest unicodestring
julia> collect(eachindex(s))
7-element Array{Int64,1}:
  1
  4
  5
  6
  7
 10
 11
```

要访问编码的原始代码单位（UTF-8 的字节），可以使用 [`codeunit(s,i)`](@ref)函数，其中索引 `i` 从 `1` 连续运行到 [`ncodeunits(s)`](@ref)。
[`codeunits(s)`](@ref) 函数返回一个 `AbstractVector{UInt8}` 包装器，允许您以数组的形式访问这些原始代码单元（字节）。

Julia 中的字符串可以包含无效的 UTF-8 代码单元序列。这个惯例允许把任何字序列当作 `String`。在这种情形下的一个规则是，当从左到右解析代码单元序列时，字符由匹配下面开头位模式之一的最长的 8 位代码单元序列组成（每个 `x` 可以是 `0` 或者 `1`）：

* `0xxxxxxx`;
* `110xxxxx` `10xxxxxx`;
* `1110xxxx` `10xxxxxx` `10xxxxxx`;
* `11110xxx` `10xxxxxx` `10xxxxxx` `10xxxxxx`;
* `10xxxxxx`;
* `11111xxx`.

特别地，这意味着过长和过高的代码单元序列及其前缀将被视为单个无效字符，而不是多个无效字符。这个规则最好用一个例子来解释：

```julia-repl
julia> s = "\xc0\xa0\xe2\x88\xe2|"
"\xc0\xa0\xe2\x88\xe2|"

julia> foreach(display, s)
'\xc0\xa0': [overlong] ASCII/Unicode U+0020 (category Zs: Separator, space)
'\xe2\x88': Malformed UTF-8 (category Ma: Malformed, bad data)
'\xe2': Malformed UTF-8 (category Ma: Malformed, bad data)
'|': ASCII/Unicode U+007C (category Sm: Symbol, math)

julia> isvalid.(collect(s))
4-element BitArray{1}:
 0
 0
 0
 1

julia> s2 = "\xf7\xbf\xbf\xbf"
"\U1fffff"

julia> foreach(display, s2)
'\U1fffff': Unicode U+1FFFFF (category In: Invalid, too high)
```

我们可以看到字符串 `s` 中的前两个代码单元形成了一个过长的空格字符编码。这是无效的，但是在字符串中作为单个字符是可以接受的。接下来的两个代码单元形成了一个有效的 3 位 UTF-8 序列开头。然而，第五个代码单元 `\xe2` 不是它的有效延续，所以代码单元 3 和 4 在这个字符串中也被解释为格式错误的字符。同理，由于 `|` 不是它的有效延续，代码单元 5 形成了一个格式错误的字符。最后字符串 `s2` 包含了一个太高的代码。

Julia 默认使用 UTF-8 编码，对于新编码的支持可以通过包加上。例如，[LegacyStrings.jl](https://github.com/JuliaStrings/LegacyStrings.jl) 包实现了 `UTF16String` 和 `UTF32String` 类型。关于其它编码的额外讨论以及如何实现对它们的支持暂时超过了这篇文档的讨论范围。UTF-8 编码相关问题的进一步讨论参见下面的[字节数组字面量](@ref man-byte-array-literals)章节。[`transcode`](@ref) 函数可在各种 UTF-xx 编码之间转换，主要用于外部数据和包。

## [拼接](@id man-concatenation)

最常见最有用的字符串操作是级联：

```jldoctest stringconcat
julia> greet = "Hello"
"Hello"

julia> whom = "world"
"world"

julia> string(greet, ", ", whom, ".\n")
"Hello, world.\n"
```

意识到像对无效 UTF-8 字符进行级联这样的潜在危险情形是非常重要的。生成的字符串可能会包含和输入字符串不同的字符，并且其中字符的数目也可能少于被级联字符串中字符数目之和，例如：

```julia-repl
julia> a, b = "\xe2\x88", "\x80"
("\xe2\x88", "\x80")

julia> c = a*b
"∀"

julia> collect.([a, b, c])
3-element Array{Array{Char,1},1}:
 ['\xe2\x88']
 ['\x80']
 ['∀']

julia> length.([a, b, c])
3-element Array{Int64,1}:
 1
 1
 1
```

这种情形只可能发生于无效 UTF-8 字符串上。对于有效 UTF-8 字符串，级联保留字符串中的所有字符和字符串的总长度。

Julia 也提供 [`*`](@ref) 用于字符串级联：

```jldoctest stringconcat
julia> greet * ", " * whom * ".\n"
"Hello, world.\n"
```

尽管对于提供 `+` 函数用于字符串拼接的语言使用者而言，`*` 似乎是一个令人惊讶的选择，但 `*` 的这种用法在数学中早有先例，尤其是在抽象代数中。

在数学上，`+` 通常表示可交换运算（*commutative* operation）——运算对象的顺序不重要。一个例子是矩阵加法：对于任何形状相同的矩阵 `A` 和 `B`，都有 `A + B == B + A`。与之相反，`*` 通常表示不可交换运算——运算对象的顺序很重要。例如，对于矩阵乘法，一般 `A * B != B * A`。同矩阵乘法类似，字符串拼接是不可交换的：`greet * whom != whom * greet`。在这一点上，对于插入字符串的拼接操作，`*` 是一个自然而然的选择，与它在数学中的用法一致。

更确切地说，有限长度字符串集合 *S* 和字符串拼接操作 `*` 构成了一个[自由幺半群](https://en.wikipedia.org/wiki/Free_monoid) (*S*, `*`)。该集合的单位元是空字符串，`""`。当一个自由幺半群不是交换的时，它的运算通常表示为 `\cdot`，`*`，或者类似的符号，而非暗示交换性的 `+`。

## [插值](@id string-interpolation)

拼接构造字符串的方式有时有些麻烦。为了减少对于 [`string`](@ref) 的冗余调用或者重复地做乘法，Julia 允许像 Perl 中一样使用 `$` 对字符串字面量进行插值：


```jldoctest stringconcat
julia> "$greet, $whom.\n"
"Hello, world.\n"
```

这更易读更方便，而且等效于上面的字符串拼接——系统把这个显然一行的字符串字面量重写成带参数的字符串字面量拼接 `string(greet, ", ", whom, ".\n")`。

在 `$` 之后最短的完整表达式被视为插入其值于字符串中的表达式。因此，你可以用括号向字符串中插入任何表达式：


```jldoctest
julia> "1 + 2 = $(1 + 2)"
"1 + 2 = 3"
```

拼接和插值都调用 [`string`](@ref) 以转换对象为字符串形式。
然而，`string` 实际上仅仅返回了 [`print`](@ref) 的输出，因此，新的类型应该添加 [`print`](@ref) 或 [`show`](@ref) 方法，而不是 `string` 方法。

多数非 `AbstractString` 对象被转换为和它们作为文本表达式输入的方式密切对应的字符串：

```jldoctest
julia> v = [1,2,3]
3-element Array{Int64,1}:
 1
 2
 3

julia> "v: $v"
"v: [1, 2, 3]"
```

[`string`](@ref) 是 `AbstractString` 和 `AbstractChar` 值的标识，所以它们作为自身被插入字符串，无需引用，无需转义：

```jldoctest
julia> c = 'x'
'x': ASCII/Unicode U+0078 (category Ll: Letter, lowercase)

julia> "hi, $c"
"hi, x"
```

若要在字符串字面量中包含文本 `$`，就用反斜杠转义：

```jldoctest
julia> print("I have \$100 in my account.\n")
I have $100 in my account.
```

## 三引号字符串字面量

当使用三引号（`"""..."""`）创建字符串时，它们有一些在创建更长文本块时可能用到的特殊行为。

首先，三引号字符串也被反缩进到最小缩进线的水平。这在定义包含缩进的字符串时很有用。例如：

```jldoctest
julia> str = """
           Hello,
           world.
         """
"  Hello,\n  world.\n"
```

在这里，后三引号 `"""` 前面的最后一（空）行设置了缩进级别。

反缩进级别被确定为所有行中空格或制表符的最大公共起始序列，不包括前三引号 `"""` 后面的一行以及只包含空格或制表符的行（总包含结尾 `"""` 的行）。那么对于所有不包括前三引号 `"""` 后面文本的行而言，公共起始序列就被移除了（包括只含空格和制表符而以此序列开始的行），例如：
```jldoctest
julia> """    This
         is
           a test"""
"    This\nis\n  a test"
```

接下来，如果前三引号 `"""` 后面紧跟换行符，那么换行符就从生成的字符串中被剥离。

```julia
"""hello"""
```

等价于

```julia
"""
hello"""
```

但是

```julia
"""

hello"""
```

将在开头包含一个文本换行符。

换行符的移除是在反缩进之后进行的。例如：

```jldoctest
julia> """
         Hello,
         world."""
"Hello,\nworld."
```

尾随空格保持不变。

三引号字符串字面量可不带转义地包含 `"` 符号。

注意，无论是用单引号还是三引号，在文本字符串中换行符都会生成一个换行 (LF) 字符 `\n`，即使你的编辑器使用回车组合符 `\r` (CR) 或 CRLF 来结束行。为了在字符串中包含 CR，总是应该使用显式转义符 `\r`；比如，可以输入文本字符串 `"a CRLF line ending\r\n"`。

## 常见操作

你可以使用标准的比较操作符按照字典顺序比较字符串：

```jldoctest
julia> "abracadabra" < "xylophone"
true

julia> "abracadabra" == "xylophone"
false

julia> "Hello, world." != "Goodbye, world."
true

julia> "1 + 2 = 3" == "1 + 2 = $(1 + 2)"
true
```

你可以使用 [`findfirst`](@ref) 与 [`findlast`](@ref) 函数搜索特定字符的索引：

```jldoctest
julia> findfirst(isequal('o'), "xylophone")
4

julia> findlast(isequal('o'), "xylophone")
7

julia> findfirst(isequal('z'), "xylophone")
```

你可以带上第三个参数，用 [`findnext`](@ref) 与 [`findprev`](@ref) 函数来在给定偏移量处搜索字符：

```jldoctest
julia> findnext(isequal('o'), "xylophone", 1)
4

julia> findnext(isequal('o'), "xylophone", 5)
7

julia> findprev(isequal('o'), "xylophone", 5)
4

julia> findnext(isequal('o'), "xylophone", 8)
```

你可以用 [`occursin`](@ref) 函数检查在字符串中某子字符串可否找到。

```jldoctest
julia> occursin("world", "Hello, world.")
true

julia> occursin("o", "Xylophon")
true

julia> occursin("a", "Xylophon")
false

julia> occursin('o', "Xylophon")
true
```

最后那个例子表明 [`occursin`](@ref) 也可用于搜寻字符字面量。

另外还有两个方便的字符串函数 [`repeat`](@ref) 和 [`join`](@ref)：

```jldoctest
julia> repeat(".:Z:.", 10)
".:Z:..:Z:..:Z:..:Z:..:Z:..:Z:..:Z:..:Z:..:Z:..:Z:."

julia> join(["apples", "bananas", "pineapples"], ", ", " and ")
"apples, bananas and pineapples"
```

其它有用的函数还包括：


  * [`firstindex(str)`](@ref) 给出可用来索引到 `str` 的最小（字节）索引（对字符串来说这总是 1，对于别的容器来说却不一定如此）。
  * [`lastindex(str)`](@ref) 给出可用来索引到 `str` 的最大（字节）索引。
  * [`length(str)`](@ref)，`str` 中的字符个数。
  * [`length(str, i, j)`](@ref)，`str` 中从 `i` 到 `j` 的有效字符索引个数。
  * [`ncodeunits(str)`](@ref)，字符串中[代码单元](https://en.wikipedia.org/wiki/Character_encoding#Terminology)（[码元](https://zh.wikipedia.org/wiki/字符编码#字符集、代码页，与字符映射)）的数目。
  * [`codeunit(str, i)`](@ref) 给出在字符串 `str` 中索引为 `i` 的代码单元值。
  * [`thisind(str, i)`](@ref)，给定一个字符串的任意索引，查找索引点所在的首个索引。
  * [`nextind(str, i, n=1)`](@ref) 查找在索引 `i` 之后第 `n` 个字符的开头。
  * [`prevind(str, i, n=1)`](@ref) 查找在索引 `i` 之前第 `n` 个字符的开始。

## 非标准字符串字面量

有时当你想构造字符串或者使用字符串语义，标准的字符串构造却不能很好的满足需求。Julia 为这种情形提供了非标准字符串字面量。非标准字符串字面量看似常规双引号字符串字面量，但却直接加上了标识符前缀因而并不那么像普通的字符串字面量。下面将提到，正则表达式，字节数组字面量和版本号字面量都是非标准字符串字面量的例子。其它例子见[元编程](@ref)章。

## 正则表达式

Julia 具有与 Perl 兼容的正则表达式 (regexes)，就像 [PCRE](http://www.pcre.org/) 包所提供的那样，详细信息参见 [PCRE 的语法说明](http://www.pcre.org/current/doc/html/pcre2syntax.html)。
正则表达式以两种方式和字符串相关：一个显然的关联是，正则表达式被用于找到字符串中的正则模式；另一个关联是，正则表达式自身就是作为字符串输入，它们被解析到可用来高效搜索字符串中模式的状态机中。
在 Julia 中正则表达式的输入使用了前缀各类以 `r` 开头的标识符的非标准字符串字面量。最基本的不打开任何选项的正则表达式只用到了 `r"..."`：

```jldoctest
julia> r"^\s*(?:#|$)"
r"^\s*(?:#|$)"

julia> typeof(ans)
Regex
```

若要检查正则表达式是否匹配某字符串，就用 [`occursin`](@ref)：

```jldoctest
julia> occursin(r"^\s*(?:#|$)", "not a comment")
false

julia> occursin(r"^\s*(?:#|$)", "# a comment")
true
```

可以看到，[`occursin`](@ref) 只返回正确或错误，表明给定正则表达式是否在该字符串中出现。然而，通常我们不只想知道字符串是否匹配，更想了解它是如何匹配的。要捕获匹配的信息，可以改用 [`match`](@ref) 函数：

```jldoctest
julia> match(r"^\s*(?:#|$)", "not a comment")

julia> match(r"^\s*(?:#|$)", "# a comment")
RegexMatch("#")
```

若正则表达式与给定字符串不匹配，[`match`](@ref) 返回 [`nothing`](@ref)——在交互式提示框中不打印任何东西的特殊值。除了不打印，它是一个完全正常的值，这可以用程序来测试：

```julia
m = match(r"^\s*(?:#|$)", line)
if m === nothing
    println("not a comment")
else
    println("blank or comment")
end
```

如果正则表达式匹配，[`match`](@ref) 的返回值是 `RegexMatch` 对象。这些对象记录了表达式是如何匹配的，包括该模式匹配的子字符串和任何可能被捕获的子字符串。上面的例子仅仅捕获了匹配的部分子字符串，但也许我们想要捕获的是公共字符后面的任何非空文本。我们可以这样做：


```jldoctest
julia> m = match(r"^\s*(?:#\s*(.*?)\s*$|$)", "# a comment ")
RegexMatch("# a comment ", 1="a comment")
```

当调用 [`match`](@ref) 时，你可以选择指定开始搜索的索引。例如：

```jldoctest
julia> m = match(r"[0-9]","aaaa1aaaa2aaaa3",1)
RegexMatch("1")

julia> m = match(r"[0-9]","aaaa1aaaa2aaaa3",6)
RegexMatch("2")

julia> m = match(r"[0-9]","aaaa1aaaa2aaaa3",11)
RegexMatch("3")
```

你可以从 `RegexMatch` 对象中提取如下信息：

  * 匹配的整个子字符串：`m.match`
  * 作为字符串数组捕获的子字符串：`m.captures`
  * 整个匹配开始处的偏移：`m.offset`
  * 作为向量的捕获子字符串的偏移：`m.offsets`

当捕获不匹配时，`m.captures` 在该处不再包含一个子字符串，而是 `什么也不` 包含；此外，`m.offsets` 的偏移量为 0（回想一下，Julia 的索引是从 1 开始的，因此字符串的零偏移是无效的）。下面是两个有些牵强的例子：

```jldoctest acdmatch
julia> m = match(r"(a|b)(c)?(d)", "acd")
RegexMatch("acd", 1="a", 2="c", 3="d")

julia> m.match
"acd"

julia> m.captures
3-element Array{Union{Nothing, SubString{String}},1}:
 "a"
 "c"
 "d"

julia> m.offset
1

julia> m.offsets
3-element Array{Int64,1}:
 1
 2
 3

julia> m = match(r"(a|b)(c)?(d)", "ad")
RegexMatch("ad", 1="a", 2=nothing, 3="d")

julia> m.match
"ad"

julia> m.captures
3-element Array{Union{Nothing, SubString{String}},1}:
 "a"
 nothing
 "d"

julia> m.offset
1

julia> m.offsets
3-element Array{Int64,1}:
 1
 0
 2
```

让捕获作为数组返回是很方便的，这样就可以用解构语法把它们和局域变量绑定起来：

```jldoctest acdmatch
julia> first, second, third = m.captures; first
"a"
```

通过使用捕获组的编号或名称对 `RegexMatch` 对象进行索引，也可实现对捕获的访问：

```jldoctest
julia> m=match(r"(?<hour>\d+):(?<minute>\d+)","12:45")
RegexMatch("12:45", hour="12", minute="45")

julia> m[:minute]
"45"

julia> m[2]
"45"
```

使用 [`replace`](@ref) 时利用 `\n` 引用第 n 个捕获组和给替换字符串加上 `s` 的前缀，可以实现替换字符串中对捕获的引用。捕获组 0 指的是整个匹配对象。可在替换中用 `\g<groupname>` 对命名捕获组进行引用。例如：

```jldoctest
julia> replace("first second", r"(\w+) (?<agroup>\w+)" => s"\g<agroup> \1")
"second first"
```

为明确起见，编号捕获组也可用 `\g<n>` 进行引用，例如：

```jldoctest
julia> replace("a", r"." => s"\g<0>1")
"a1"
```

你可以在后双引号的后面加上 `i`, `m`, `s` 和 `x` 等标志对正则表达式进行修改。这些标志和 Perl 里面的含义一样，详见以下对 [perlre 手册](http://perldoc.perl.org/perlre.html#Modifiers)的摘录：

```
i   不区分大小写的模式匹配。

    若区域设置规则有效，相应映射中代码点小于 255 的部分取自当前区域设置，更大代码点的部分取自 Unicode 规则。然而，跨越 Unicode 规则（ords 255/256）和 非 Unicode 规则边界的匹配将失败。

m   将字符串视为多行。也即更改 "^" 和 "$", 使其从匹配字符串的开头和结尾变为匹配字符串中任意一行的开头或结尾。

s   将字符串视为单行。也即更改 "." 以匹配任何字符，即使是通常不能匹配的换行符。

    像这样一起使用，r""ms，它们让 "." 匹配任何字符，同时也支持分别在字符串中换行符的后面和前面用 "^" 和 "$" 进行匹配。

x   令正则表达式解析器忽略多数既不是反斜杠也不属于字符类的空白。它可以用来把正则表达式分解成（略为）更易读的部分。和普通代码中一样，`#` 字符也被当作引入注释的元字符。
```

例如，下面的正则表达式已打开所有三个标志：

```jldoctest
julia> r"a+.*b+.*?d$"ism
r"a+.*b+.*?d$"ims

julia> match(r"a+.*b+.*?d$"ism, "Goodbye,\nOh, angry,\nBad world\n")
RegexMatch("angry,\nBad world")
```

`r"..."` 文本的构造没有插值和转义（除了引号 `"` 仍然需要转义）。下面例子展示了它和标准字符串字面量之间的差别：

```julia-repl
julia> x = 10
10

julia> r"$x"
r"$x"

julia> "$x"
"10"

julia> r"\x"
r"\x"

julia> "\x"
ERROR: syntax: invalid escape sequence
```

Julia 也支持 `r"""..."""` 形式的三引号正则表达式字符串（或许便于处理包含引号和换行符的正则表达式）。

`Regex()` 构造函数可以用于以编程方式创建合法的正则表达式字符串。这允许在构造正则表达式字符串时使用字符串变量的内容和其他字符串操作。上面的任何正则表达式代码可以在 `Regex()` 的单字符串参数中使用。下面是一些例子：

```jldoctest
julia> using Dates

julia> d = Date(1962,7,10)
1962-07-10

julia> regex_d = Regex("Day " * string(day(d)))
r"Day 10"

julia> match(regex_d, "It happened on Day 10")
RegexMatch("Day 10")

julia> name = "Jon"
"Jon"

julia> regex_name = Regex("[\"( ]$name[\") ]")  # 插入 name 的值
r"[\"( ]Jon[\") ]"

julia> match(regex_name," Jon ")
RegexMatch(" Jon ")

julia> match(regex_name,"[Jon]") === nothing
true
```

## 字节数组字面量

另一个有用的非标准字符串字面量是字节数组字面量：`b"..."`。这种形式使你能够用字符串表示法来表达只读字面量字节数组，也即 [`UInt8`](@ref) 值的数组。字节数组字面量的规则如下：

  * ASCII 字符和 ASCII 转义生成单个字节。
  * `\x` 和八进制转义序列生成与转义值对应的*字节*。
  * Unicode 转义序列生成编码 UTF-8 中该代码点的字节序列。

这些规则有一些重叠，这是因为 `\x` 的行为和小于 0x80(128) 的八进制转义被前两个规则同时包括了；但这两个规则又是一致的。通过这些规则可以方便地同时使用 ASCII 字符，任意字节值，以及 UTF-8 序列来生成字节数组。下面是一个用到全部三个规则的例子：

```jldoctest
julia> b"DATA\xff\u2200"
8-element Base.CodeUnits{UInt8,String}:
 0x44
 0x41
 0x54
 0x41
 0xff
 0xe2
 0x88
 0x80
```

其中，ASCII 字符串 "DATA" 对应于字节 68, 65, 84, 65。`\xff` 生成单个字节 255。Unicode 转义 `\u2200` 在 UTF-8 中被编码为三个字节 226, 136, 128。注意生成的字节数组不对应任何有效 UTF-8 字符串。

```jldoctest
julia> isvalid("DATA\xff\u2200")
false
```

如前所述，`CodeUnits{UInt8,String}` 类型的行为类似于只读 `UInt8` 数组。如果需要标准数组，你可以 `Vector{UInt8} 进行转换。

```jldoctest
julia> x = b"123"
3-element Base.CodeUnits{UInt8,String}:
 0x31
 0x32
 0x33

julia> x[1]
0x31

julia> x[1] = 0x32
ERROR: setindex! not defined for Base.CodeUnits{UInt8,String}
[...]

julia> Vector{UInt8}(x)
3-element Array{UInt8,1}:
 0x31
 0x32
 0x33
```

同时，要注意到 `\xff` 和 `\uff` 之间的显著差别：前面的转义序列编码为*字节 255*，而后者代表 *代码 255*，它在 UTF-8 中编码为两个字节：

```jldoctest
julia> b"\xff"
1-element Base.CodeUnits{UInt8,String}:
 0xff

julia> b"\uff"
2-element Base.CodeUnits{UInt8,String}:
 0xc3
 0xbf
```

字符字面量也用到了相同的行为。

对于小于 `\u80` 的代码，每个代码的 UTF-8 编码恰好只是由相应 `\x` 转义产生的单个字节，因此忽略两者的差别无伤大雅。然而，从 `x80` 到 `\xff` 的转义比起从 `u80` 到 `\uff` 的转义来，就有一个主要的差别：前者都只编码为一个字节，它没有形成任何有效 UTF-8 数据，除非它后面有非常特殊的连接字节；而后者则都代表 2 字节编码的 Unicode 代码。

如果这些还是太难理解，试着读一下 ["每个软件开发人员绝对必须知道的最基础 Unicode 和字符集知识"](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/)。它是一个优质的 Unicode 和 UTF-8 指南，或许能帮助解除一些这方面的疑惑。

## [版本号字面量](@id man-version-number-literals)

版本号很容易用 [`v"..."`](@ref) 形式的非标准字符串字面量表示。版本号字面量生成遵循[语义版本](https://semver.org/)规范的 [`VersionNumber`](@ref) 对象，因此由主、次、补丁号构成，后跟预发行 (pre-release) 和生成阿尔法数注释（build alpha-numeric）。例如，`v"0.2.1-rc1+win64"` 可分为主版本号 `0`，次版本号 `2`，补丁版本号 `1`，预发行版号 `rc1`，以及生成版本 `win64`。输入版本字面量时，除了主版本号以外所有内容都是可选的，因此 `v"0.2"` 等效于 `v"0.2.0"`（预发行号和生成注释为空），`v"2"` 等效于 `v"2.0.0"`，等等。

`VersionNumber` 对象在轻松正确地比较两个（或更多）版本时非常有用。例如，常数 `VERSION` 把 Julia 的版本号保留为一个 `VersionNumber` 对象，因此可以像下面这样用简单的声明定义一些特定版本的行为：

```julia
if v"0.2" <= VERSION < v"0.3-"
    # 针对 0.2 发行版系列做些事情
end
```

注意在上例中用到了非标准版本号 `v"0.3-"`，其中有尾随符 `-`：这个符号是 Julia 标准的扩展，它可以用来表明低于任何 `0.3` 发行版的版本，包括所有的预发行版。所以上例中代码只能在稳定版本 `0.2` 上运行，而不能在 `v"0.3.0-rc1"` 这样的版本上运行。为了支持非稳定（即预发行）的 `0.2` 版本，下限检查应像这样应该改为：`v"0.2-" <= VERSION`。

另一个非标准版本规范扩展使得能够使用 `+` 来表示生成版本的上限，例如 `VERSION > v"0.2-rc1+"` 可以用来表示任意高于 `0.2-rc1` 和其任意生成版本的版本：它对 `v"0.2-rc1+win64"` 返回 `false` 而对 `v"0.2-rc2"` 返回 `true`。

在比较中使用这样的特殊版本是个好办法（特别是，总是应该对高版本使用尾随 `-`，除非有好理由不这样），但它们不应该被用作任何内容的实际版本，因为它们在语义版本控制方案中无效。

除了用于定义常数 [`VERSION`](@ref)，`VersionNumber` 对象在 `Pkg` 模块应用广泛，常用于指定软件包的版本及其依赖。

## [原始字符串字面量](@id man-raw-string-literals)

无插值和非转义的原始字符串可用 `raw"..."` 形式的非标准字符串字面量表示。原始字符串字面量生成普通的 `String` 对象，它无需插值和非转义地包含和输入完全一样的封闭式内容。这对于包含其他语言中使用 "$" 或 "\" 作为特殊字符的代码或标记的字符串很有用。

例外的是，引号仍必须转义，例如 `raw"\""` 等效于 `"\""`。为了能够表达所有字符串，反斜杠也必须转义，不过只是当它刚好出现在引号前面时。

```jldoctest
julia> println(raw"\\ \\\"")
\\ \"
```

请注意，前两个反斜杠在输出中逐字显示，这是因为它们不是在引号前面。然而，接下来的一个反斜杠字符转义了后面的一个反斜杠；又由于这些反斜杠出现在引号前面，最后一个反斜杠转义了一个引号。
