# 字符串

```@raw html
<!-- # Strings -->
```

字符串是字符的有限序列。当然，真正麻烦的问题是，字符到底是什么。英文使用者所熟悉的字符是`A`，`B`，`C` 等等字母，数字以及常见标点符号。这些字符和它们到 0 到 127 之间的整数值的映射一起通过 [ASCII](https://en.wikipedia.org/wiki/ASCII) 标准被标准化。当然，在非英语语言中有大量其它字符，这其中包括加上重音等修改的 ASCII 字符的变体——相关的文字有例如斯拉夫字母和希腊字母；以及和 ASCII 和英语完全不相关的文字，包括阿拉伯文、中文、希伯来文、印地文、日文和韩文。[Unicode]https://en.wikipedia.org/wiki/Unicode) 标准则解决了字符定义问题的复杂性，从而被广泛的认为是解决这个问题的权威标准。根据需要，你可以完全忽略这些复杂性，装作只存在ASCII字符；你也可以去写这样的代码，它们能处理当操作非 ASCII 文本时可能遇到的任何字符或编码。Julia 使得纯 ASCII 文本的处理简单而高效，同时又使得 Unicode 文本的处理尽可能的简单和高效。特别是，你可以写出 C 风格字符串的代码来处理ASCII字符串，它们在性能和语义方面都将将按预期工作。若这种代码遇到了非　ASCII　文本，它会优雅地失败，同时给出清晰的错误信息，而不是悄悄地导致错误的结果。当这种失败发生时，修改代码以兼容非　ASCII 数据就很简单了。

```@raw html
<!-- Strings are finite sequences of characters. Of course, the real trouble comes when one asks what a character is. The characters that English speakers are familiar with are the letters `A`, `B`,`C`, etc., together with numerals and common punctuation symbols. These characters are standardized together with a mapping to integer values between 0 and 127 by the [ASCII](https://en.wikipedia.org/wiki/ASCII) standard. There are, of course, many other characters used in non-English languages, including variants of the ASCII characters with accents and other modifications, related scripts such as Cyrillic and Greek, and scripts completely unrelated to ASCII and English, including Arabic, Chinese, Hebrew, Hindi, Japanese, and Korean. The [Unicode](https://en.wikipedia.org/wiki/Unicode) standard tackles the complexities of what exactly a character is, and is generally accepted as the definitive standard addressing this problem. Depending on your needs, you can either ignore these complexities entirely and just pretend that only ASCII characters exist, or you can write code that can handle any of the characters or encodings that one may encounter when handling non-ASCII text. Julia makes dealing with plain ASCII text simple and efficient, and handling Unicode is as simple and
efficient as possible. In particular, you can write C-style string code to process ASCII strings, and they will work as expected, both in terms of performance and semantics. If such code encounters non-ASCII text, it will gracefully fail with a clear error message, rather than silently introducing corrupt results. When this happens, modifying the code to handle non-ASCII data is straightforward. -->
```

Julia 的字符串有一些重要的特性：

```@raw html
<!-- There are a few noteworthy high-level features about Julia's strings: -->
```

  * 内置的用于字符串（和字符串字面量）的具体类型是 [`String`](@ref)。它通过 [UTF-8](https://en.wikipedia.org/wiki/UTF-8)　编码全面地支持 [Unicode](https://en.wikipedia.org/wiki/Unicode)　字符。(有一个 [`transcode`](@ref) 函数用来和 Unicode 编码互转)
  * 所有的字符串类型都是抽象类型 `AbstractString` 的子类型，而一些外部包定义了别的 `AbstractString` 子类型（例如别的编码）。若要定义需要字符串参数的函数，你应当声明此类型为　`AbstractString`　来让这函数接受任何字符串类型。
  * 类似 C 和 Java，但是和大多数动态语言不同的是，Julia 有优秀的表示单字符的类型，即 [`AbstractChar`](@ref)。[`Char`](@ref) 是 `AbstractChar` 的内置子类型，它能表示任何 Unicode 字符的 32 位原始类型（基于 UTF-8 编码）。
  * 如 Java 中那样，字符串不可改——任何 `AbstractString` 对象的值不可改变。若要构造不同的字符串值，应当从其它字符串的部分构造一个新的字符串。
  * 从概念上讲，字符串是从索引到字符的*部分函数*：对于某些索引值，它不返回字符值，而是引发异常。这允许通过编码表示形式的字节索引来实现高效的字符串索引，而不是通过字符索引——它不能简单高效地实现可变宽度的 Unicode 字符串编码。


```@raw html
<!--
  * The built-in concrete type used for strings (and string literals) in Julia is [`String`](@ref).
    This supports the full range of [Unicode](https://en.wikipedia.org/wiki/Unicode) characters via
    the [UTF-8](https://en.wikipedia.org/wiki/UTF-8) encoding. (A [`transcode`](@ref) function is
    provided to convert to/from other Unicode encodings.)
  * All string types are subtypes of the abstract type `AbstractString`, and external packages define
    additional `AbstractString` subtypes (e.g. for other encodings).  If you define a function expecting
    a string argument, you should declare the type as `AbstractString` in order to accept any string
    type.
  * Like C and Java, but unlike most dynamic languages, Julia has a first-class type for representing
    a single character, called [`AbstractChar`](@ref). The built-in [`Char`](@ref) subtype of `AbstractChar`
    is a 32-bit primitive type that can represent any Unicode character (and which is based
    on the UTF-8 encoding).
  * As in Java, strings are immutable: the value of an `AbstractString` object cannot be changed.
    To construct a different string value, you construct a new string from parts of other strings.
  * Conceptually, a string is a *partial function* from indices to characters: for some index values,
    no character value is returned, and instead an exception is thrown. This allows for efficient
    indexing into strings by the byte index of an encoded representation rather than by a character
    index, which cannot be implemented both efficiently and simply for variable-width encodings of
    Unicode strings.
-->
```

## 字符

```@raw html
<!-- ## Characters -->
```

`Char` 类型的值代表单个字符：它只是带有特殊文本表示法和适当算术行为的 32 位原始类型，不能转化为代表 [Unicode 代码点](https://en.wikipedia.org/wiki/Code_point) 的数值。（Julia　的包可能会定义别的 `AbstractChar` 子类型，比如当为了优化对其它 [字符编码](https://en.wikipedia.org/wiki/Character_encoding) 的操作时）`Char`类型的值以这样的方式输入和显示：

```@raw html
<!--
A `Char` value represents a single character: it is just a 32-bit primitive type with a special literal
representation and appropriate arithmetic behaviors, and which can be converted
to a numeric value representing a
[Unicode code point](https://en.wikipedia.org/wiki/Code_point).  (Julia packages may define
other subtypes of `AbstractChar`, e.g. to optimize operations for other
[text encodings](https://en.wikipedia.org/wiki/Character_encoding).) Here is how `Char` values are
input and shown:
-->
```

```jldoctest
julia> 'x'
'x': ASCII/Unicode U+0078 (category Ll: Letter, lowercase)

julia> typeof(ans)
Char
```

你可以轻松地把 `Char`　转换为它的整数值，即代码点：

```@raw html
<!--  You can easily convert a `Char` to its integer value, i.e. code point:  -->
```

```jldoctest
julia> Int('x')
120

julia> typeof(ans)
Int64
```

在 32 位架构中，[`typeof(ans)`](@ref) 将得到 [`Int32`](@ref)。你同样可以轻松地把整数值转回 `Char`。

```@raw html
<!--  On 32-bit architectures, [`typeof(ans)`](@ref) will be [`Int32`](@ref). You can convert an
integer value back to a `Char` just as easily:  -->
```

```jldoctest
julia> Char(120)
'x': ASCII/Unicode U+0078 (category Ll: Letter, lowercase)
```

并非所有的整数值在 Unicode 代码点中都是有效的，但为了性能，`Char` 的转化并不检查每个字符值的有效性。若想检查每个转换值的有效性，就用 [`isvalid`](@ref) 函数：

```@raw html
<!--  Not all integer values are valid Unicode code points, but for performance, the `Char` conversion
does not check that every character value is valid. If you want to check that each converted value
is a valid code point, use the [`isvalid`](@ref) function:  -->
```

```jldoctest
julia> Char(0x110000)
'\U110000': Unicode U+110000 (category In: Invalid, too high)

julia> isvalid(Char, 0x110000)
false
```
在此文档中，有效的 Unicode 代码点是从 `U+00` 到 `U+d7ff` 以及 `U+e000` 到`U+10ffff`。它们还没全部被赋予明确的含义，也还没必要被应用解释；然而，所有的这些值都被认为是有效的 Unicode 字符。

```@raw html
<!--  As of this writing, the valid Unicode code points are `U+00` through `U+d7ff` and `U+e000` through
`U+10ffff`. These have not all been assigned intelligible meanings yet, nor are they necessarily
interpretable by applications, but all of these values are considered to be valid Unicode characters.   -->
```

你可以在单引号中输入任何 Unicode 字符，通过使用 `\u` 加上至多４个十六进制数字或者 `\U`　加上至多８个十六进制数（最长的有效值也只需要６个）：

```@raw html
<!--  You can input any Unicode character in single quotes using `\u` followed by up to four hexadecimal
digits or `\U` followed by up to eight hexadecimal digits (the longest valid value only requires
six):  -->
```

```jldoctest
julia> '\u0'
'\0': ASCII/Unicode U+0000 (category Cc: Other, control)

julia> '\u78'
'x': ASCII/Unicode U+0078 (category Ll: Letter, lowercase)

julia> '\u2200'
'∀': Unicode U+2200 (category Sm: Symbol, math)

julia> '\U10ffff'
'\U10ffff': Unicode U+10ffff (category Cn: Other, not assigned)
```

Julia 使用系统的地区和语言设置来确定哪些字符可以原样打印，以及当使用一般的 `\u`或 `\U` 转义输入形式时应当输出什么。除了这些 Unicode 转义形式以外，也可以使用所有的 [传统 C 语言转义输入形式](https://en.wikipedia.org/wiki/C_syntax#Backslash_escapes)。

```@raw html
<!--  Julia uses your system's locale and language settings to determine which characters can be printed
as-is and which must be output using the generic, escaped `\u` or `\U` input forms. In addition
to these Unicode escape forms, all of [C's traditional escaped input forms](https://en.wikipedia.org/wiki/C_syntax#Backslash_escapes)
can also be used: -->
```

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

你可以对 `Char` 的值进行比较和进行有限的算术运算

```@raw html
<!--  You can do comparisons and a limited amount of arithmetic with `Char` values: -->
```

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

```@raw html
<!--  ## String Basics -->
```

字符串文本由双引号或三重双引号分隔：

```@raw html
<!--  String literals are delimited by double quotes or triple double quotes: -->
```

```jldoctest helloworldstring
julia> str = "Hello, world.\n"
"Hello, world.\n"

julia> """Contains "quote" characters"""
"Contains \"quote\" characters"
```
若要从字符串中提取字符，就进行索引：

```@raw html
<!--  If you want to extract a character from a string, you index into it: -->
```

```jldoctest helloworldstring
julia> str[1]
'H': ASCII/Unicode U+0048 (category Lu: Letter, uppercase)

julia> str[6]
',': ASCII/Unicode U+002c (category Po: Punctuation, other)

julia> str[end]
'\n': ASCII/Unicode U+000a (category Cc: Other, control)
```

包括字符串，许多的 Julia 对象都可以用整数进行索引。第一个元素的索引由 [`firstindex(str)`](@ref) 返回，最后一个由 [`lastindex(str)`](@ref) 返回。关键字 `end` 可以在索引操作中用作给定维度的最后一个索引。在 Julia 中，大多数索引都是基于 1 的：许多整数索引的对象的第一个元素都在索引为 1 处。（下面我们将会看到，这并不一定意味着最后一个元素位于索引为 `n` 处——`n` 为此字符串的长度。）

```@raw html
<!--  
Many Julia objects, including strings, can be indexed with integers. The index of the first
element is returned by [`firstindex(str)`](@ref), and the index of the last element
with [`lastindex(str)`](@ref). The keyword `end` can be used inside an indexing
operation as shorthand for the last index along the given dimension.
Most indexing in Julia is 1-based: the first element of many integer-indexed objects is found at
index 1. (As we will see below, this does not necessarily mean that the last element is found
at index `n`, where `n` is the length of the string.) -->
```

你可以用 [`end`](@ref) 进行算术以及其它操作，就像普通值一样：

```@raw html
<!-- You can perform arithmetic and other operations with [`end`](@ref), just like
a normal value: -->
```

```jldoctest helloworldstring
julia> str[end-1]
'.': ASCII/Unicode U+002e (category Po: Punctuation, other)

julia> str[end÷2]
' ': ASCII/Unicode U+0020 (category Zs: Separator, space)
```
使用小于 1 或者大于 `end` 的索引将引发错误：

```@raw html
<!-- Using an index less than 1 or greater than `end` raises an error: -->
```

```jldoctest helloworldstring
julia> str[0]
ERROR: BoundsError: attempt to access "Hello, world.\n"
  at index [0]
[...]

julia> str[end+1]
ERROR: BoundsError: attempt to access "Hello, world.\n"
  at index [15]
Stacktrace:
[...]
```

你也可以用范围索引来提取子字符串

```@raw html
<!-- You can also extract a substring using range indexing: -->
```

```jldoctest helloworldstring
julia> str[4:9]
"lo, wo"
```

注意，表达式 `str[k]` and `str[k:k]` 给出不同的结果：

```@raw html
<!-- Notice that the expressions `str[k]` and `str[k:k]` do not give the same result: -->

```jldoctest helloworldstring
julia> str[6]
',': ASCII/Unicode U+002c (category Po: Punctuation, other)

julia> str[6:6]
","
```

前者是 `Char` 类型的单个字符值，后者是碰巧只有单个字符的字符串值。在 Julia 里面两者大不相同。

```@raw html
<!-- The former is a single character value of type `Char`, while the latter is a string value that
happens to contain only a single character. In Julia these are very different things. -->
```

范围索引复制了原字符串的选定部分。此外，也可以用 [`SubString`](@ref) 类型创建字符串的视图。

```@raw html
<!-- Range indexing makes a copy of the selected part of the original string.
Alternatively, it is possible to create a view into a string using the type [`SubString`](@ref),
for example: -->
```

```jldoctest
julia> str = "long string"
"long string"

julia> substr = SubString(str, 1, 4)
"long"

julia> typeof(substr)
SubString{String}
```

像　[`chop`](@ref)，[`chomp`](@ref) 和 [`strip`](@ref) 一样的几个标准函数都返回 [`SubString`](@ref)。

```@raw html
<!-- Several standard functions like [`chop`](@ref), [`chomp`](@ref) or [`strip`](@ref) return a [`SubString`](@ref). -->
```

## Unicode 和 UTF-8

```@raw html
<!-- ## Unicode and UTF-8 -->
```

Julia 完全支持 Unicode 字符和字符串。[如上所述](@ref man-characters)，在字符文本中，Unicode 代码点可以用 Unicode `\u` and `\U` 转义序列表示，也可以用所有标准 C 转义序列表示。这些同样可以用来写字符串文本：

```@raw html
<!-- Julia fully supports Unicode characters and strings. As [discussed above](@ref man-characters), in character
literals, Unicode code points can be represented using Unicode `\u` and `\U` escape sequences,
as well as all the standard C escape sequences. These can likewise be used to write string literals: -->
```

```jldoctest unicodestring
julia> s = "\u2200 x \u2203 y"
"∀ x ∃ y"
```

这些 Unicode 字符是作为转义还是特殊字符显示取决于你终端的地区设置以及它对 Unicode 的支持。字符串文本用 UTF-8 编码实现编码。UTF-8 是一种可变宽度的编码，也就是说并非所有字符都以相同的字节数被编码。在 UTF-8 中，ASCII 字符——代码点小于 0x80(128) 的那些——如它们在 ASCII 中一样使用单字节编码；而代码点 0x80 及以上的字符使用最多 4 个字节编码。这意味着并非每个索引到 UTF-8 字符串的字节都必须是一个字符的有效索引。如果在这种无效字节索引处索引字符串，将会报错：

```@raw html
<!-- Whether these Unicode characters are displayed as escapes or shown as special characters depends
on your terminal's locale settings and its support for Unicode. String literals are encoded using
the UTF-8 encoding. UTF-8 is a variable-width encoding, meaning that not all characters are encoded
in the same number of bytes. In UTF-8, ASCII characters -- i.e. those with code points less than
0x80 (128) -- are encoded as they are in ASCII, using a single byte, while code points 0x80 and
above are encoded using multiple bytes -- up to four per character. This means that not every
byte index into a UTF-8 string is necessarily a valid index for a character. If you index into
a string at such an invalid byte index, an error is thrown: -->
```

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

在这种情况下，字符 `∀` 是一个三字节字符，因此索引 2 和 3 都是无效的，而下一个字符的索引是 4；这个接下来的有效索引可以用 [`nextind(s,1)`](@ref)　来计算，再接下来的用 `nextind(s,4)`, 依此类推。

```@raw html
<!-- In this case, the character `∀` is a three-byte character, so the indices 2 and 3 are invalid
and the next character's index is 4; this next valid index can be computed by [`nextind(s,1)`](@ref),
and the next index after that by `nextind(s,4)` and so on. -->
```

使用范围索引提取字字符串也需要有效的字节索引，否则将报错：

```@raw html
<!-- Extraction of a substring using range indexing also expects valid byte indices or an error is thrown: -->
```

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

由于可变长度的编码，字符串中的字符串数（由 [`length(s)`](@ref) 给出）并不问题等于最后一个索引的数字。如果你从 1 到 [`lastindex(s)`](@ref) 迭代并索引到 `s`，未报错时返回的字符序列是包含字符串 `s` 的字符序列。因此总有 `length(s) <= lastindex(s)`，这是因为字符串中的每个字符必须有它自己的索引。下面是对 `s` 的字符进行迭代的一个啰嗦而低效的方式：

```@raw html
<!-- Because of variable-length encodings, the number of characters in a string (given by [`length(s)`](@ref))
is not always the same as the last index. If you iterate through the indices 1 through [`lastindex(s)`](@ref)
and index into `s`, the sequence of characters returned when errors aren't thrown is the sequence
of characters comprising the string `s`. Thus we have the identity that `length(s) <= lastindex(s)`,
since each character in a string must have its own index. The following is an inefficient and
verbose way to iterate through the characters of `s`: -->
```

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

空行上面其实是有空格的。幸运的是，上面的拙劣写法不是对字符串中字符进行迭代所必须的——因为你只仅需把字符串本身用作迭代对象，而不需要额外处理：

```@raw html
<!-- The blank lines actually have spaces on them. Fortunately, the above awkward idiom is unnecessary
for iterating through the characters in a string, since you can just use the string as an iterable
object, no exception handling required: -->
```

```jldoctest unicodestring
julia> for c in s
           println(c)
       end
∀

x

∃

y
```

Julia 中的字符串可以包含无效的 UTF-8 代码单元序列。这个惯例允许把任何字序列当作 `String`。在这种情形下的一个规则是，当从左到右解析代码单元序列时，字符由匹配下面开头位模式之一的最长的 8 位代码单元序列组成（每个 `x` 可以是 `0` 或者 `1`）：

```@raw html
<!-- Strings in Julia can contain invalid UTF-8 code unit sequences. This convention allows to
treat any byte sequence as a `String`. In such situations a rule is that when parsing
a sequence of code units from left to right characters are formed by the longest sequence of
8-bit code units that matches the start of one of the following bit patterns
(each `x` can be `0` or `1`): -->
```

* `0xxxxxxx`;
* `110xxxxx` `10xxxxxx`;
* `1110xxxx` `10xxxxxx` `10xxxxxx`;
* `11110xxx` `10xxxxxx` `10xxxxxx` `10xxxxxx`;
* `10xxxxxx`;
* `11111xxx`.

特别地，这意味着过长和太高的代码单元序列也可接受。这个规则最好用一个例子来解释：

```@raw html
<!-- In particular this implies that overlong and too high code unit sequences are accepted.
This rule is best explained by an example: -->
```

```julia-repl
julia> s = "\xc0\xa0\xe2\x88\xe2|"
"\xc0\xa0\xe2\x88\xe2|"

julia> foreach(display, s)
'\xc0\xa0': [overlong] ASCII/Unicode U+0020 (category Zs: Separator, space)
'\xe2\x88': Malformed UTF-8 (category Ma: Malformed, bad data)
'\xe2': Malformed UTF-8 (category Ma: Malformed, bad data)
'|': ASCII/Unicode U+007c (category Sm: Symbol, math)

julia> isvalid.(collect(s))
4-element BitArray{1}:
 false
 false
 false
  true

julia> s2 = "\xf7\xbf\xbf\xbf"
"\U1fffff"

julia> foreach(display, s2)
'\U1fffff': Unicode U+1fffff (category In: Invalid, too high)
```

我们可以看到字符串 `s` 中的前两个代码单元形成了一个过长的空格字符编码。这是无效的，但是在字符串中作为单个字符是可以接受的。接下来的两个代码单元形成了一个有效的 3 位 UTF-8 序列开头。然而，第五个代码单元 `\xe2` 不是它有效的延续，所以代码单元 3 和 4 在这个字符串中也被解释为格式错误的字符。类似地，由于 `|` 不是它有效的延续，代码单元 5 形成了一个格式错误的字符。最后字符串 `s2` 包含了一个太高的代码点。

```@raw html
<!-- We can see that the first two code units in the string `s` form an overlong encoding of
space character. It is invalid, but is accepted in a string as a single character.
The next two code units form a valid start of a three-byte UTF-8 sequence. However, the fifth
code unit `\xe2` is not its valid continuation. Therefore code units 3 and 4 are also
interpreted as malformed characters in this string. Similarly code unit 5 forms a malformed
character because `|` is not a valid continuation to it. Finally the string `s2` contains
one too high code point. -->
```

Julia 默认使用 UTF-8 编码，对于新编码的支持可以通过包加上。例如，[LegacyStrings.jl](https://github.com/JuliaArchive/LegacyStrings.jl) 包实现了 `UTF16String` 和 `UTF32String` 类型。关于其它编码的额外讨论以及实现支持它们的方法暂时超过了这篇文档的讨论范围。UTF-8 编码的相关问题的进一步讨论参见下面的 [字节数组文本](@ref man-byte-array-literals) 章节。[`transcode`](@ref) 函数可在各种 UTF-xx 编码之间转换，主要用于外部数据和包。

```@raw html
<!-- Julia uses the UTF-8 encoding by default, and support for new encodings can be added by packages.
For example, the [LegacyStrings.jl](https://github.com/JuliaArchive/LegacyStrings.jl) package
implements `UTF16String` and `UTF32String` types. Additional discussion of other encodings and
how to implement support for them is beyond the scope of this document for the time being. For
further discussion of UTF-8 encoding issues, see the section below on [byte array literals](@ref man-byte-array-literals).
The [`transcode`](@ref) function is provided to convert data between the various UTF-xx encodings,
primarily for working with external data and libraries. -->
```

## 串联

```@raw html
<-- ## Concatenation -->
```

一个最常见而有用的字符串操作是串联：

```@raw html
<-- One of the most common and useful string operations is concatenation: -->
```

```jldoctest stringconcat
julia> greet = "Hello"
"Hello"

julia> whom = "world"
"world"

julia> string(greet, ", ", whom, ".\n")
"Hello, world.\n"
```

意识到像对无效 UTF-8 字符进行串联这样的潜在危险情形是非常重要的。得到字符串可能会包含和输入字符串不同的字符，并且其中字符的数目也可能少于被串联字符串中字符数目之和，例如：

```@raw html
<-- It's important to be aware of potentially dangerous situations such as concatenation of invalid UTF-8 strings.
The resulting string may contain different characters than the input strings,
and its number of characters may be lower than sum of numbers of characters
of the concatenated strings, e.g.: -->
```

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

这种情形只可能发生于无效 UTF-8 字符串上。对于有效 UTF-8 字符串，串联保留字符串中的所有字符和字符串的总长度。


```@raw html
<!-- This situation can happen only for invalid UTF-8 strings. For valid UTF-8 strings
concatenation preserves all characters in strings and additivity of string lengths. -->
```

Julia 也提供 [`*`](@ref) 用于字符串串联：

```@raw html
<!---Julia also provides [`*`](@ref) for string concatenation:-->
```

```jldoctest stringconcat
julia> greet * ", " * whom * ".\n"
"Hello, world.\n"
```

尽管对于提供 `+` 函数用于字符串串联的语言使用者而言，`*` 似乎是一个令人惊讶的选择，但 `*` 的这种用法在数学中早有先例，尤其是在抽象代数中。

```@raw html
<!-- While `*` may seem like a surprising choice to users of languages that provide `+` for string
concatenation, this use of `*` has precedent in mathematics, particularly in abstract algebra. -->
```

在数学上，`+` 通常表示对易算符——运算对象的顺序不重要。一个例子是矩阵加法：对于任何形状相同的矩阵 `A` 和 `B`，都有　`A + B == B + A`。与之相反，`＊` 通常表示不对易算符——运算对象的顺序很重要。例如，对于矩阵乘法，一般 `A * B != B * A`。同矩阵乘法类似，字符串串联是不对易的：`greet * whom != whom * greet`。在这一点上，对于插入字符串的串联操作，`*` 是一个自然而然的选择，和在数学中的用法一致。

```@raw html
<!-- In mathematics, `+` usually denotes a *commutative* operation, where the order of the operands does
not matter. An example of this is matrix addition, where `A + B == B + A` for any matrices `A` and `B`
that have the same shape. In contrast, `*` typically denotes a *noncommutative* operation, where the
order of the operands *does* matter. An example of this is matrix multiplication, where in general
`A * B != B * A`. As with matrix multiplication, string concatenation is noncommutative:
`greet * whom != whom * greet`. As such, `*` is a more natural choice for an infix string concatenation
operator, consistent with common mathematical use. -->
```

更确切地说，有限长度字符串集合 *S* 和字符串串联操作 `*` 构成了一个自由群 (*S*, `*`)。该集合的单位元是空字符串，`""`。当一个自由群不对易，它的运算通常表示为 `\cdot`，`*`，或者类似的符号，而不是暗示对易性的 `+`。

```@raw html
<!-- More precisely, the set of all finite-length strings *S* together with the string concatenation operator
`*` forms a [free monoid](https://en.wikipedia.org/wiki/Free_monoid) (*S*, `*`). The identity element
of this set is the empty string, `""`. Whenever a free monoid is not commutative, the operation is
typically represented as `\cdot`, `*`, or a similar symbol, rather than `+`, which as stated usually
implies commutativity. -->
```

## 插值

```@raw html
<!-- ## Interpolation -->
```

但是，用串联构造字符串有时有些麻烦。为了减少对于 [`string`](@ref) 的冗余调用或者重复乘法，Julia 允许像 Perl 中一样使用 `$` 对字符串文本进行插值：

```@raw html
Constructing strings using concatenation can become a bit cumbersome, however. To reduce the need for these
verbose calls to [`string`](@ref) or repeated multiplications, Julia allows interpolation into string literals
using `$`, as in Perl:
```

```jldoctest stringconcat
julia> "$greet, $whom.\n"
"Hello, world.\n"
```

这更易读更方便，而且等效于上面的字符串串联——系统把这个显然一行的字符串文本重写成带参数的字符串文本串联。

```@raw html
<!-- This is more readable and convenient and equivalent to the above string concatenation -- the system
rewrites this apparent single string literal into a concatenation of string literals with variables. -->
```

在 `$` 之后最短的完整表达式被视为插入其值于字符串中的表达式。因此，你可以用括号向字符串中插入任何表达式：

```@raw html
<!-- The shortest complete expression after the `$` is taken as the expression whose value is to be
interpolated into the string. Thus, you can interpolate any expression into a string using parentheses: -->
```

```jldoctest
julia> "1 + 2 = $(1 + 2)"
"1 + 2 = 3"
```

串联和插值都调用 [`string`](@ref) 操作以转换对象为字符串形式。多数非 `AbstractString` 对象被转换为和它们作为文本表达式输入的方式密切对应的字符串。

```@raw html
<!-- Both concatenation and string interpolation call [`string`](@ref) to convert objects into string
form. Most non-`AbstractString` objects are converted to strings closely corresponding to how
they are entered as literal expressions: -->
```

```jldoctest
julia> v = [1,2,3]
3-element Array{Int64,1}:
 1
 2
 3

julia> "v: $v"
"v: [1, 2, 3]"
```

[`string`](@ref) 是 `AbstractString` 和 `AbstractChar` 值的标识，所以它们作为它们自身被插入字符串，无需引用，无需转义：

```@raw html
<!-- [`string`](@ref) is the identity for `AbstractString` and `AbstractChar` values, so these are interpolated
into strings as themselves, unquoted and unescaped: -->
```

```jldoctest
julia> c = 'x'
'x': ASCII/Unicode U+0078 (category Ll: Letter, lowercase)

julia> "hi, $c"
"hi, x"
```

若要在字符串文本中包含文本 `$`，就用反斜杠转义：

```@raw html
<!-- To include a literal `$` in a string literal, escape it with a backslash: -->
```

```jldoctest
julia> print("I have \$100 in my account.\n")
I have $100 in my account.
```

## 三引号字符串文本

```@raw html
<!-- ## Triple-Quated String Literals -->
```

当使用三引号创建字符串时，它们有一些在创建更长文本块时可能用到的特殊行为。

```@raw html
<!-- When strings are created using triple-quotes (`"""..."""`) they have some special behavior that
can be useful for creating longer blocks of text. -->
```

首先，三引号字符串也被反缩进到最小缩进线的水平。这在定义包含缩进的字符串时很有用。例如：

```@raw html
<!-- First, triple-quoted strings are also dedented to the level of the least-indented line.
This is useful for defining strings within code that is indented. For example: -->
```

```jldoctest
julia> str = """
           Hello,
           world.
         """
"  Hello,\n  world.\n"
```

在这里，结尾 `"""` 前面的最后一（空）行设置了缩进级别。


```@raw html
<!-- In this case the final (empty) line before the closing `"""` sets the indentation level. -->
```

反缩进级别被确定为所有行中空格或制表符的最大公共起始序列，不包括起始 `"""` 后面的一行以及只包含空格或制表符的行（总包含结尾 `"""` 的行）。那么对于所有不包括起始 `"""` 后面文本的行而言，公共起始序列就被移除了（包括只含空格和制表符而以此序列开始的行），例如：

```@raw html
<!-- The dedentation level is determined as the longest common starting sequence of spaces or
tabs in all lines, excluding the line following the opening `"""` and lines containing
only spaces or tabs (the line containing the closing `"""` is always included).
Then for all lines, excluding the text following the opening `"""`, the common starting
sequence is removed (including lines containing only spaces and tabs if they start with
this sequence), e.g.: -->
```

```jldoctest
julia> """    This
         is
           a test"""
"    This\nis\n  a test"
```

接下来，如果起始 `"""` 后面紧跟换行符，那么换行符就从生成的字符串中被剥离。

```@raw html
<!-- Next, if the opening `"""` is followed by a newline,
the newline is stripped from the resulting string. -->
```

```julia
"""hello"""
```

等效于

```@raw html
is equivalent to
```

```julia
"""
hello"""
```
但

```@raw html
but
```

```julia
"""

hello"""
```

将在开头包含一个文本换行符。

```@raw html
<!-- will contain a literal newline at the beginning. -->
```

换行符的移除是在反缩进之后进行的。例如：

```@raw html
<!-- Stripping of the newline is performed after the dedentation. For example: -->
```


```jldoctest
julia> """
         Hello,
         world."""
"Hello,\nworld."
```
```@raw html
Trailing whitespace is left unaltered.
```

```@raw html
<!-- Triple-quoted string literals can contain `"` symbols without escaping. -->
```

```@raw html
<!-- Note that line breaks in literal strings, whether single- or triple-quoted, result in a newline
(LF) character `\n` in the string, even if your editor uses a carriage return `\r` (CR) or CRLF
combination to end lines. To include a CR in a string, use an explicit escape `\r`; for example,
you can enter the literal string `"a CRLF line ending\r\n"`. -->
```