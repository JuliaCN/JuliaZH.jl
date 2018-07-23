# 字符串

```@raw html
<!-- # Strings -->
```

字符串是字符的有限序列。当然，真正麻烦的问题是，字符到底是什么。英文使用者所熟悉的字符是 `A`，`B`，`C` 等等字母，数字以及常见标点符号。这些字符和它们到 0 到 127 之间的整数值的映射一起通过 [ASCII](https://en.wikipedia.org/wiki/ASCII) 标准被标准化。当然，在非英语语言中有大量其它字符，这其中包括加上重音等修改的 ASCII 字符的变体——相关的文字有例如斯拉夫字母和希腊字母；以及和 ASCII、英语完全不相关的文字，包括阿拉伯文、中文、希伯来文、印地文、日文和韩文。[Unicode](https://en.wikipedia.org/wiki/Unicode) 标准则解决了字符定义问题的复杂性，从而被广泛的认为是解决这个问题的权威标准。根据需要，你可以完全忽略这些复杂性，装作只存在ASCII字符；你也可以去写这样的代码，它们能处理当操作非 ASCII 文本时可能遇到的任何字符或编码。Julia 使纯 ASCII 文本的处理简单而高效，同时又使得 Unicode 文本的处理尽可能的简单和高效。特别是，你可以写出 C 风格字符串的代码来处理ASCII字符串，它们在性能和语义方面都将将按预期工作。若这种代码遇到了非 ASCII 文本，它会优雅地失败，同时给出清晰的错误信息，而不是悄悄地导致错误的结果。当这种失败发生时，修改代码以兼容非 ASCII 数据就很简单了。

```@raw html
<!-- Strings are finite sequences of characters. Of course, the real trouble comes when one asks what a character is. The characters that English speakers are familiar with are the letters `A`, `B`,`C`, etc., together with numerals and common punctuation symbols. These characters are standardized together with a mapping to integer values between 0 and 127 by the [ASCII](https://en.wikipedia.org/wiki/ASCII) standard. There are, of course, many other characters used in non-English languages, including variants of the ASCII characters with accents and other modifications, related scripts such as Cyrillic and Greek, and scripts completely unrelated to ASCII and English, including Arabic, Chinese, Hebrew, Hindi, Japanese, and Korean. The [Unicode](https://en.wikipedia.org/wiki/Unicode) standard tackles the complexities of what exactly a character is, and is generally accepted as the definitive standard addressing this problem. Depending on your needs, you can either ignore these complexities entirely and just pretend that only ASCII characters exist, or you can write code that can handle any of the characters or encodings that one may encounter when handling non-ASCII text. Julia makes dealing with plain ASCII text simple and efficient, and handling Unicode is as simple and
efficient as possible. In particular, you can write C-style string code to process ASCII strings, and they will work as expected, both in terms of performance and semantics. If such code encounters non-ASCII text, it will gracefully fail with a clear error message, rather than silently introducing corrupt results. When this happens, modifying the code to handle non-ASCII data is straightforward. -->
```

Julia 的字符串有一些重要的特性：

```@raw html
<!-- There are a few noteworthy high-level features about Julia's strings: -->
```

  * 内置的用于字符串（和字符串字面量）的具体类型是 [`String`](@ref)。它通过 [UTF-8](https://en.wikipedia.org/wiki/UTF-8) 编码全面地支持 [Unicode](https://en.wikipedia.org/wiki/Unicode) 字符。(有一个 [`transcode`](@ref) 函数用来和 Unicode 编码互转)
  * 所有的字符串类型都是抽象类型 `AbstractString` 的子类型，而一些外部包定义了别的 `AbstractString` 子类型（例如别的编码）。若要定义需要字符串参数的函数，你应当声明此类型为 `AbstractString` 来让这函数接受任何字符串类型。
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

你可以轻松地把 `Char` 转换为它的整数值，即代码点：

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
在此文档中，有效的 Unicode 代码点是从 `U+00` 到 `U+d7ff` 以及 `U+e000` 到 `U+10ffff`。它们还未全部被赋予明确的含义，也还没必要被应用解释；然而，所有的这些值都被认为是有效的 Unicode 字符。

```@raw html
<!--  As of this writing, the valid Unicode code points are `U+00` through `U+d7ff` and `U+e000` through
`U+10ffff`. These have not all been assigned intelligible meanings yet, nor are they necessarily
interpretable by applications, but all of these values are considered to be valid Unicode characters.   -->
```

你可以在单引号中输入任何 Unicode 字符，通过使用 `\u` 加上至多４个十六进制数字或者 `\U` 加上至多８个十六进制数（最长的有效值也只需要６个）：

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

你可以对 `Char` 的值进行比较和有限的算术运算

```@raw html
<!-- You can do comparisons and a limited amount of arithmetic with `Char` values: -->
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

字符串字面量由双引号或三重双引号分隔：

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

包括字符串，许多的 Julia 对象都可以用整数进行索引。第一个元素的索引由 [`firstindex(str)`](@ref) 返回，最后一个由 [`lastindex(str)`](@ref) 返回。关键字 `end` 可以在索引操作中用作给定维度的最后一个索引。在 Julia 中，大多数索引都是从 1 开始的：许多整数索引的对象的第一个元素都在索引为 1 处。（下面我们将会看到，这并不一定意味着最后一个元素位于索引为 `n` 处——`n` 为此字符串的长度。）

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
```

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

范围索引复制了原字符串的选定部分。此外，也可以用 [`SubString`](@ref) 类型创建字符串的视图，例如：

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

像 [`chop`](@ref)，[`chomp`](@ref) 和 [`strip`](@ref) 一样的几个标准函数都返回 [`SubString`](@ref)。

```@raw html
<!-- Several standard functions like [`chop`](@ref), [`chomp`](@ref) or [`strip`](@ref) return a [`SubString`](@ref). -->
```

## Unicode 和 UTF-8

```@raw html
<!-- ## Unicode and UTF-8 -->
```

Julia 完全支持 Unicode 字符和字符串。[如上所述](@ref)，在字符字面量中，Unicode 代码点可以用 Unicode `\u` and `\U` 转义序列表示，也可以用所有标准 C 转义序列表示。这些同样可以用来写字符串字面量：

```@raw html
<!-- Julia fully supports Unicode characters and strings. As [discussed above](@ref man-characters), in character
literals, Unicode code points can be represented using Unicode `\u` and `\U` escape sequences,
as well as all the standard C escape sequences. These can likewise be used to write string literals: -->
```

```jldoctest unicodestring
julia> s = "\u2200 x \u2203 y"
"∀ x ∃ y"
```

这些 Unicode 字符是作为转义还是特殊字符显示取决于你终端的地区设置以及它对 Unicode 的支持。字符串字面量用 UTF-8 编码实现编码。UTF-8 是一种可变宽度的编码，也就是说并非所有字符都以相同的字节数被编码。在 UTF-8 中，ASCII 字符——代码点小于 0x80(128) 的那些——如它们在 ASCII 中一样使用单字节编码；而代码点 0x80 及以上的字符使用最多 4 个字节编码。这意味着并非每个索引到 UTF-8 字符串的字节都必须是一个字符的有效索引。如果在这种无效字节索引处索引字符串，将会报错：

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

在这种情况下，字符 `∀` 是一个三字节字符，因此索引 2 和 3 都是无效的，而下一个字符的索引是 4；这个接下来的有效索引可以用 [`nextind(s,1)`](@ref) 来计算，再接下来的用 `nextind(s,4)`，依此类推。

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

由于可变长度的编码，字符串中的字符数（由 [`length(s)`](@ref) 给出）并不问题等于最后一个索引的数字。如果你从 1 到 [`lastindex(s)`](@ref) 迭代并索引到 `s`，未报错时返回的字符序列是包含字符串 `s` 的字符序列。因此总有 `length(s) <= lastindex(s)`，这是因为字符串中的每个字符必须有它自己的索引。下面是对 `s` 的字符进行迭代的一个啰嗦而低效的方式：

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

空行上面其实是有空格的。幸运的是，上面的拙劣写法不是对字符串中字符进行迭代所必须的——因为你只需把字符串本身用作迭代对象，而不需要额外处理：

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

我们可以看到字符串 `s` 中的前两个代码单元形成了一个过长的空格字符编码。这是无效的，但是在字符串中作为单个字符是可以接受的。接下来的两个代码单元形成了一个有效的 3 位 UTF-8 序列开头。然而，第五个代码单元 `\xe2` 不是它的有效延续，所以代码单元 3 和 4 在这个字符串中也被解释为格式错误的字符。同理，由于 `|` 不是它的有效延续，代码单元 5 形成了一个格式错误的字符。最后字符串 `s2` 包含了一个太高的代码点。

```@raw html
<!-- We can see that the first two code units in the string `s` form an overlong encoding of
space character. It is invalid, but is accepted in a string as a single character.
The next two code units form a valid start of a three-byte UTF-8 sequence. However, the fifth
code unit `\xe2` is not its valid continuation. Therefore code units 3 and 4 are also
interpreted as malformed characters in this string. Similarly code unit 5 forms a malformed
character because `|` is not a valid continuation to it. Finally the string `s2` contains
one too high code point. -->
```

Julia 默认使用 UTF-8 编码，对于新编码的支持可以通过包加上。例如，[LegacyStrings.jl](https://github.com/JuliaArchive/LegacyStrings.jl) 包实现了 `UTF16String` 和 `UTF32String` 类型。关于其它编码的额外讨论以及如何实现对它们的支持暂时超过了这篇文档的讨论范围。UTF-8 编码相关问题的进一步讨论参见下面的 [字节数组字面量](@ref) 章节。[`transcode`](@ref) 函数可在各种 UTF-xx 编码之间转换，主要用于外部数据和包。

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

意识到像对无效 UTF-8 字符进行串联这样的潜在危险情形是非常重要的。生成的字符串可能会包含和输入字符串不同的字符，并且其中字符的数目也可能少于被串联字符串中字符数目之和，例如：

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

在数学上，`+` 通常表示对易算符——运算对象的顺序不重要。一个例子是矩阵加法：对于任何形状相同的矩阵 `A` 和 `B`，都有 `A + B == B + A`。与之相反，`＊` 通常表示不对易算符——运算对象的顺序很重要。例如，对于矩阵乘法，一般 `A * B != B * A`。同矩阵乘法类似，字符串串联是不对易的：`greet * whom != whom * greet`。在这一点上，对于插入字符串的串联操作，`*` 是一个自然而然的选择，与它在数学中的用法一致。

```@raw html
<!-- In mathematics, `+` usually denotes a *commutative* operation, where the order of the operands does
not matter. An example of this is matrix addition, where `A + B == B + A` for any matrices `A` and `B`
that have the same shape. In contrast, `*` typically denotes a *noncommutative* operation, where the
order of the operands *does* matter. An example of this is matrix multiplication, where in general
`A * B != B * A`. As with matrix multiplication, string concatenation is noncommutative:
`greet * whom != whom * greet`. As such, `*` is a more natural choice for an infix string concatenation
operator, consistent with common mathematical use. -->
```

更确切地说，有限长度字符串集合 *S* 和字符串串联操作 `*` 构成了一个自由群 (*S*, `*`)。该集合的单位元是空字符串，`""`。当一个自由群不对易时，它的运算通常表示为 `\cdot`，`*`，或者类似的符号，而非暗示对易性的 `+`。

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

但是，用串联构造字符串有时有些麻烦。为了减少对于 [`string`](@ref) 的冗余调用或者重复乘法，Julia 允许像 Perl 中一样使用 `$` 对字符串字面量进行插值：

```@raw html
Constructing strings using concatenation can become a bit cumbersome, however. To reduce the need for these
verbose calls to [`string`](@ref) or repeated multiplications, Julia allows interpolation into string literals
using `$`, as in Perl:
```

```jldoctest stringconcat
julia> "$greet, $whom.\n"
"Hello, world.\n"
```

这更易读更方便，而且等效于上面的字符串串联——系统把这个显然一行的字符串字面量重写成带参数的字符串字面量串联。

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

串联和插值都调用 [`string`](@ref) 以转换对象为字符串形式。多数非 `AbstractString` 对象被转换为和它们作为文本表达式输入的方式密切对应的字符串。

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

[`string`](@ref) 是 `AbstractString` 和 `AbstractChar` 值的标识，所以它们作为自身被插入字符串，无需引用，无需转义：

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

若要在字符串字面量中包含文本 `$`，就用反斜杠转义：

```@raw html
<!-- To include a literal `$` in a string literal, escape it with a backslash: -->
```

```jldoctest
julia> print("I have \$100 in my account.\n")
I have $100 in my account.
```

## 三引号字符串字面量

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

在这里，后三引号 `"""` 前面的最后一（空）行设置了缩进级别。


```@raw html
<!-- In this case the final (empty) line before the closing `"""` sets the indentation level. -->
```

反缩进级别被确定为所有行中空格或制表符的最大公共起始序列，不包括前三引号 `"""` 后面的一行以及只包含空格或制表符的行（总包含结尾 `"""` 的行）。那么对于所有不包括前三引号 `"""` 后面文本的行而言，公共起始序列就被移除了（包括只含空格和制表符而以此序列开始的行），例如：

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

接下来，如果前三引号 `"""` 后面紧跟换行符，那么换行符就从生成的字符串中被剥离。

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

尾随空格保持不变。

```@raw html
Trailing whitespace is left unaltered.
```

三引号字符串字面量可不带转义地包含 `"` 符号。

```@raw html
<!-- Triple-quoted string literals can contain `"` symbols without escaping. -->
```

注意，无论是用单引号还是三引号，在文本字符串中换行符都会生成一个换行 (LF) 字符 `\n`，即使你的编辑器使用回车组合符 `\r` (CR) 或 CRLF 来结束行。为了在字符串中包含 CR，总是应该使用显式转义符 `\r`；比如，可以输入文本字符串 `"a CRLF line ending\r\n"`。

```@raw html
<!-- Note that line breaks in literal strings, whether single- or triple-quoted, result in a newline
(LF) character `\n` in the string, even if your editor uses a carriage return `\r` (CR) or CRLF
combination to end lines. To include a CR in a string, use an explicit escape `\r`; for example,
you can enter the literal string `"a CRLF line ending\r\n"`. -->
```

## 常见操作

```@raw html
<!-- ## Common Operations -->
```

你可以使用标准的比较操作符按照字典顺序比较字符串：

```@raw html
<!-- You can lexicographically compare strings using the standard comparison operators: -->
```

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

你可以使用 [`findfirst`](@ref) 函数搜索特定字符的索引：

```@raw html
<!-- You can search for the index of a particular character using the [`findfirst`](@ref) function: -->
```

```jldoctest
julia> findfirst(isequal('x'), "xylophone")
1

julia> findfirst(isequal('p'), "xylophone")
5

julia> findfirst(isequal('z'), "xylophone")
```

你可以带上第三个参数，用 [`findnext`](@ref) 函数在给定偏移量处搜索字符。

```@raw html
<!-- You can start the search for a character at a given offset by using [`findnext`](@ref)
with a third argument: -->
```

```jldoctest
julia> findnext(isequal('o'), "xylophone", 1)
4

julia> findnext(isequal('o'), "xylophone", 5)
7

julia> findnext(isequal('o'), "xylophone", 8)
```

你可以用 [`occursin`](@ref) 函数检查在字符串中某子字符串可否找到。

```@raw html
<!-- You can use the [`occursin`](@ref) function to check if a substring is found within a string: -->
```

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

最后一例表明 [`occursin`](@ref) 也可用于搜寻字符字面量。

```@raw html
<!-- The last example shows that [`occursin`](@ref) can also look for a character literal. -->
```

另外还有两个方便的字符串函数 [`repeat`](@ref) 和 [`join`](@ref)：

```@raw html
<!-- Two other handy string functions are [`repeat`](@ref) and [`join`](@ref): -->
```

```jldoctest
julia> repeat(".:Z:.", 10)
".:Z:..:Z:..:Z:..:Z:..:Z:..:Z:..:Z:..:Z:..:Z:..:Z:."

julia> join(["apples", "bananas", "pineapples"], ", ", " and ")
"apples, bananas and pineapples"
```

其它有用的函数还包括：

```@raw html
<!--  Some other useful functions include: -->
```

  * [`firstindex(str)`](@ref) 给出可用来索引到 `str` 的最小（字节）索引（对字符串来说这总是 1，对于别的容器来说却不一定如此）。
  * [`lastindex(str)`](@ref) 给出可用来索引到 `str` 的最大（字节）索引。
  * [`length(str)`](@ref)，`str` 中的字符个数。
  * [`length(str, i, j)`](@ref)，`str` 中从 `i` 到 `j` 的有效字符索引个数。
  * [`ncodeunits(str)`](@ref)，字符串中 [代码单元](https://en.wikipedia.org/wiki/Character_encoding#Terminology) 的数目。
  * [`codeunit(str, i)`](@ref) 给出在字符串 `str` 中索引为 `i` 的代码单元值。
  * [`thisind(str, i)`](@ref)，给定一个字符串的任意索引，查找索引点所在的首个索引。
  * [`nextind(str, i, n=1)`](@ref) 查找在索引 `i` 之后第 `n` 个字符的开头。
  * [`prevind(str, i, n=1)`](@ref) 查找在索引 `i` 之前第 `n` 个字符的开始。


```@raw html
<!--  * [`firstindex(str)`](@ref) gives the minimal (byte) index that can be used to index into `str` (always 1 for strings, not necessarily true for other containers).
  * [`lastindex(str)`](@ref) gives the maximal (byte) index that can be used to index into `str`.
  * [`length(str)`](@ref) the number of characters in `str`.
  * [`length(str, i, j)`](@ref) the number of valid character indices in `str` from `i` to `j`.
  * [`ncodeunits(str)`](@ref) number of [code units](https://en.wikipedia.org/wiki/Character_encoding#Terminology) in a string.
  * [`codeunit(str, i)`](@ref) gives the code unit value in the string `str` at index `i`.
  * [`thisind(str, i)`](@ref) given an arbitrary index into a string find the first index of the character into which the index points.
  * [`nextind(str, i, n=1)`](@ref) find the start of the `n`th character starting after index `i`.
  * [`prevind(str, i, n=1)`](@ref) find the start of the `n`th character starting before index `i`.
-->
```

## 非标准字符串字面量

```@raw html
<!-- ## Non-Standard String Literals -->
```

有时当你想构造字符串或者使用字符串语义，标准的字符串构造却不能很好的满足需求。Julia 为这种情形提供了 [非标准字符串字面量](@ref)。非标准字符串字面量看似常规双引号字符串字面量，但却直接加上了标识符前缀因而并不那么像普通的字符串字面量。下面将提到，正则表达式，字节数组字面量和版本号字面量都是非标准字符串字面量的例子。其它例子见 [元编程](@ref) 章。

```@raw html
<!-- There are situations when you want to construct a string or use string semantics, but the behavior
of the standard string construct is not quite what is needed. For these kinds of situations, Julia
provides [non-standard string literals](@ref). A non-standard string literal looks like a regular
double-quoted string literal, but is immediately prefixed by an identifier, and doesn't behave
quite like a normal string literal.  Regular expressions, byte array literals and version number
literals, as described below, are some examples of non-standard string literals. Other examples
are given in the [Metaprogramming](@ref) section. -->
```

## 正则表达式

```@raw html
<!-- ## Regular Expressions -->
```

Julia 具有与 Perl 兼容的正则表达式 (regexes)，就像 [PCRE](http://www.pcre.org/) 包所提供的那样。正则表达式以两种方式和字符串相关：一个显然的关联是，正则表达式被用于找到字符串中的正则模式；另一个关联是，正则表达式自身就是作为字符串输入，它们被解析到可用来高效搜索字符串中模式的状态机中。在 Julia 中正则表达式的输入使用了前缀各类以 `r` 开头的标识符的非标准字符串字面量。最基本的不打开任何选项的正则表达式只用到了 `r"..."`：

```@raw html
<!-- Julia has Perl-compatible regular expressions (regexes), as provided by the [PCRE](http://www.pcre.org/)
library. Regular expressions are related to strings in two ways: the obvious connection is that
regular expressions are used to find regular patterns in strings; the other connection is that
regular expressions are themselves input as strings, which are parsed into a state machine that
can be used to efficiently search for patterns in strings. In Julia, regular expressions are input
using non-standard string literals prefixed with various identifiers beginning with `r`. The most
basic regular expression literal without any options turned on just uses `r"..."`: -->
```

```jldoctest
julia> r"^\s*(?:#|$)"
r"^\s*(?:#|$)"

julia> typeof(ans)
Regex
```

若要检查正则表达式是否匹配某字符串，就用 [`occursin`](@ref)：

```@raw html
<!--
To check if a regex matches a string, use [`occursin`](@ref): -->
```

```jldoctest
julia> occursin(r"^\s*(?:#|$)", "not a comment")
false

julia> occursin(r"^\s*(?:#|$)", "# a comment")
true
```

可以看到，[`occursin`](@ref)只返回正确或错误，表明给定正则表达式是否在该字符串中出现。然而，通常我们不只想知道字符串是否匹配，更想了解它是如何匹配的。要捕获匹配的信息，可以改用 [`match`](@ref) 函数：

```@raw html
<!-- As one can see here, [`occursin`](@ref) simply returns true or false, indicating whether a
match for the given regex occurs in the string. Commonly, however, one wants to know not
just whether a string matched, but also *how* it matched. To capture this information about
a match, use the [`match`](@ref) function instead: -->
```

```jldoctest
julia> match(r"^\s*(?:#|$)", "not a comment")

julia> match(r"^\s*(?:#|$)", "# a comment")
RegexMatch("#")
```

若正则表达式与给定字符串不匹配，[`match`](@ref) 返回 [`nothing`](@ref)——在交互式提示框中不打印任何东西的特殊值。除了不打印，它是一个完全正常的值，这可以用程序来测试：

```@raw html
<!-- If the regular expression does not match the given string, [`match`](@ref) returns [`nothing`](@ref)
-- a special value that does not print anything at the interactive prompt. Other than not printing,
it is a completely normal value and you can test for it programmatically: -->
```

```julia
m = match(r"^\s*(?:#|$)", line)
if m === nothing
    println("not a comment")
else
    println("blank or comment")
end
```

如果正则表达式不匹配，[`match`](@ref) 的返回值是 `RegexMatch` 对象。这些对象记录了表达式是如何匹配的，包括该模式匹配的子字符串和任何可能被捕获的子字符串。上面的例子仅仅捕获了匹配的部分子字符串，但也许我们想要捕获的是公共字符后面的任何非空文本。我们可以这样做：

```@raw html
<!-- If a regular expression does match, the value returned by [`match`](@ref) is a `RegexMatch`
object. These objects record how the expression matches, including the substring that the pattern
matches and any captured substrings, if there are any. This example only captures the portion
of the substring that matches, but perhaps we want to capture any non-blank text after the comment
character. We could do the following: -->
```

```jldoctest
julia> m = match(r"^\s*(?:#\s*(.*?)\s*$|$)", "# a comment ")
RegexMatch("# a comment ", 1="a comment")
```

当调用 [`match`](@ref) 时，你可以选择指定开始搜索的索引。例如：

```@raw html
<!-- When calling [`match`](@ref), you have the option to specify an index at which to start the
search. For example: -->
```

```jldoctest
julia> m = match(r"[0-9]","aaaa1aaaa2aaaa3",1)
RegexMatch("1")

julia> m = match(r"[0-9]","aaaa1aaaa2aaaa3",6)
RegexMatch("2")

julia> m = match(r"[0-9]","aaaa1aaaa2aaaa3",11)
RegexMatch("3")
```

你可以从 `RegexMatch` 对象中提取如下信息：

```@raw html
<!-- You can extract the following info from a `RegexMatch` object: -->
```

  * 匹配的整个子字符串：`m.match`
  * 作为字符串数组捕获的子字符串：`m.captures`
  * 整个匹配开始处的偏移：`m.offset`
  * 作为向量的捕获子字符串的偏移：`m.offsets`

```@raw html
<!--
  * the entire substring matched: `m.match`
  * the captured substrings as an array of strings: `m.captures`
  * the offset at which the whole match begins: `m.offset`
  * the offsets of the captured substrings as a vector: `m.offsets`
-->
```

当捕获不匹配时，`m.captures` 在该处不再包含一个子字符串，而是 `什么也不` 包含；此外，`m.offsets` 的偏移量为 0（回想一下，Julia 的索引是从 1 开始的，因此字符串的零偏移是无效的）。下面是两个有些牵强的例子：

```@raw html
<!-- For when a capture doesn't match, instead of a substring, `m.captures` contains `nothing` in that
position, and `m.offsets` has a zero offset (recall that indices in Julia are 1-based, so a zero
offset into a string is invalid). Here is a pair of somewhat contrived examples: -->
```

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

```@raw html
<!-- It is convenient to have captures returned as an array so that one can use destructuring syntax
to bind them to local variables: -->
```

```jldoctest acdmatch
julia> first, second, third = m.captures; first
"a"
```

通过使用捕获组的编号或名称对 `RegexMatch` 对象进行索引，也可实现对捕获的访问：

```@raw html
<!-- Captures can also be accessed by indexing the `RegexMatch` object with the number or name of the
capture group: -->
```

```jldoctest
julia> m=match(r"(?<hour>\d+):(?<minute>\d+)","12:45")
RegexMatch("12:45", hour="12", minute="45")

julia> m[:minute]
"45"

julia> m[2]
"45"
```

使用 [`replace`](@ref) 时利用 `\n` 引用第 n 个捕获组和给替换字符串加上 `s` 的前缀，可以实现替换字符串中对捕获的引用。捕获组 0 指的是整个匹配对象。可在替换中用 `g<groupname>` 对命名捕获组进行引用。例如：

```@raw html
<!-- Captures can be referenced in a substitution string when using [`replace`](@ref) by using `\n`
to refer to the nth capture group and prefixing the substitution string with `s`. Capture group
0 refers to the entire match object. Named capture groups can be referenced in the substitution
with `g<groupname>`. For example: -->
```

```jldoctest
julia> replace("first second", r"(\w+) (?<agroup>\w+)" => s"\g<agroup> \1")
"second first"
```

为明确起见，编号捕获组也可用 `\g<n>` 进行引用，例如：

```@raw html
<!-- Numbered capture groups can also be referenced as `\g<n>` for disambiguation, as in: -->
```

```jldoctest
julia> replace("a", r"." => s"\g<0>1")
"a1"
```

你可以在后双引号的后面加上 `i`, `m`, `s` 和 `x` 等标志对正则表达式进行修改。这些标志和 Perl 里面的含义一样，详见以下对 [perlre 手册](http://perldoc.perl.org/perlre.html#Modifiers) 的摘录：

```@raw html
<!-- You can modify the behavior of regular expressions by some combination of the flags `i`, `m`,
`s`, and `x` after the closing double quote mark. These flags have the same meaning as they do
in Perl, as explained in this excerpt from the [perlre manpage](http://perldoc.perl.org/perlre.html#Modifiers): -->
```

```
i   不区分大小写的模式匹配

    若区域设置规则有效，相应映射中代码点小于 255 的部分取自当前区域设置，更大代码点的部分取自 Unicode 规则。
    然而，跨越 Unicode 规则和 非 Unicode 规则边界的匹配将失败。

m   将字符串视为多行。也即更改 "^" 和 "$", 使其从匹配字符串的开头和结尾变为匹配字符串中任意一行的开头或结尾。

s   将字符串视为单行。也即更改 "." 以匹配任何字符，即使是通常不能匹配的换行符。

    像这样一起使用，r""ms，它们让 "." 匹配任何字符，同时也支持分别在字符串中换行符的后面和前面用 "^" 和 "$" 进行匹配。

x   令正则表达式解析器忽略多数既不是反斜杠也不属于字符类的空白。它可以用来把正则表达式分解成（略为）更易读的部分。和普通代码中一样，`#` 字符也被当作引入注释的元字符。
```

```
i   Do case-insensitive pattern matching.

    If locale matching rules are in effect, the case map is taken
    from the current locale for code points less than 255, and
    from Unicode rules for larger code points. However, matches
    that would cross the Unicode rules/non-Unicode rules boundary
    (ords 255/256) will not succeed.

m   Treat string as multiple lines.  That is, change "^" and "$"
    from matching the start or end of the string to matching the
    start or end of any line anywhere within the string.

s   Treat string as single line.  That is, change "." to match any
    character whatsoever, even a newline, which normally it would
    not match.

    Used together, as r""ms, they let the "." match any character
    whatsoever, while still allowing "^" and "$" to match,
    respectively, just after and just before newlines within the
    string.

x   Tells the regular expression parser to ignore most whitespace
    that is neither backslashed nor within a character class. You
    can use this to break up your regular expression into
    (slightly) more readable parts. The '#' character is also
    treated as a metacharacter introducing a comment, just as in
    ordinary code.
```

例如，下面的正则表达式已打开所有三个标志：

```@raw html
<!-- For example, the following regex has all three flags turned on: -->
```

```jldoctest
julia> r"a+.*b+.*?d$"ism
r"a+.*b+.*?d$"ims

julia> match(r"a+.*b+.*?d$"ism, "Goodbye,\nOh, angry,\nBad world\n")
RegexMatch("angry,\nBad world")
```

`r"..."` 文本的构造没有插值和转义（除了引号 `"` 仍然需要转义）。下面例子展示了它和标准字符串字面量之间的差别：

```@raw html
<!-- The `r"..."` literal is constructed without interpolation and unescaping (except for
quotation mark `"` which still has to be escaped). Here is an example
showing the difference from standard string literals: -->
```

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

```@raw html
<!-- Triple-quoted regex strings, of the form `r"""..."""`, are also supported (and may be convenient
for regular expressions containing quotation marks or newlines). -->
```

## 字节数组字面量

```@raw html
<!-- ## Byte Array Literals -->
```

另一个有用的非标准字符串字面量是字节数组字面量：`b"..."`。这种形式使你能够用字符串表示法来表达只读字面量字节数组，也即 [`UInt8`](@ref) 值的数组。字节数组字面量的规则如下：

```@raw html
<!-- Another useful non-standard string literal is the byte-array string literal: `b"..."`. This
form lets you use string notation to express read only literal byte arrays -- i.e. arrays of
[`UInt8`](@ref) values. The type of those objects is `CodeUnits{UInt8, String}`.
The rules for byte array literals are the following: -->
```

  * ASCII 字符和 ASCII 转义生成单个字节。
  * `\x` 和八进制转义序列生成与转义值对应的*字节*。
  * Unicode 转义序列生成编码 UTF-8 中该代码点的字节序列。

```@raw html
<!--
  * ASCII characters and ASCII escapes produce a single byte.
  * `\x` and octal escape sequences produce the *byte* corresponding to the escape value.
  * Unicode escape sequences produce a sequence of bytes encoding that code point in UTF-8.
-->
```

这些规则有一些重叠，这是因为 `\x` 的行为和小于 0x80(128) 的八进制转义被前两个规则同时包括了；但这两个规则又是一致的。通过这些规则可以方便地同时使用 ASCII 字符，任意字节值，以及 UTF-8 序列来生成字节数组。下面是一个用到全部三个规则的例子：

```@raw html
<!-- There is some overlap between these rules since the behavior of `\x` and octal escapes less than
0x80 (128) are covered by both of the first two rules, but here these rules agree. Together, these
rules allow one to easily use ASCII characters, arbitrary byte values, and UTF-8 sequences to
produce arrays of bytes. Here is an example using all three: -->
```

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

```@raw html
<!-- The ASCII string "DATA" corresponds to the bytes 68, 65, 84, 65. `\xff` produces the single byte 255.
The Unicode escape `\u2200` is encoded in UTF-8 as the three bytes 226, 136, 128. Note that the
resulting byte array does not correspond to a valid UTF-8 string: -->
```

```jldoctest
julia> isvalid("DATA\xff\u2200")
false
```

如前所述，`CodeUnits{UInt8,String}` 类型的行为类似于只读 `UInt8` 数组。如果需要标准数组，你可以 `Vector{UInt8} 进行转换。

```@raw html
<!-- As it was mentioned `CodeUnits{UInt8,String}` type behaves like read only array of `UInt8` and
if you need a standard vector you can convert it using `Vector{UInt8}`: -->
```

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

同时，要注意到 `xff` 和 `\uff` 之间的显著差别：前面的转义序列编码为*字节 255*，而后者代表 *代码点 255*，它在 UTF-8 中编码为两个字节：

```@raw html
<!-- Also observe the significant distinction between `\xff` and `\uff`: the former escape sequence
encodes the *byte 255*, whereas the latter escape sequence represents the *code point 255*, which
is encoded as two bytes in UTF-8: -->
```

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

```@raw html
<!-- Character literals use the same behavior. -->
```

对于小于 `\u80` 的代码点，每个代码点的 UTF-8 编码恰好只是由相应 `\x` 转义产生的单个字节，因此忽略两者的差别无伤大雅。然而，从 `x80` 到 `\xff` 的转义比起从 `u80` 到 `\uff` 的转义来，就有一个主要的差别：前者都只编码为一个字节，它没有形成任何有效 UTF-8 数据，除非它后面有非常特殊的连接字节；而后者则都代表 2 字节编码的 Unicode 代码点。

```@raw html
<!-- For code points less than `\u80`, it happens that the
UTF-8 encoding of each code point is just the single byte produced by the corresponding `\x` escape,
so the distinction can safely be ignored. For the escapes `\x80` through `\xff` as compared to
`\u80` through `\uff`, however, there is a major difference: the former escapes all encode single
bytes, which -- unless followed by very specific continuation bytes -- do not form valid UTF-8
data, whereas the latter escapes all represent Unicode code points with two-byte encodings. -->
```

如果这些还是太难理解，试着读一下 ["每个软件开发人员绝对必须知道的最基础 Unicode 和字符集知识"](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/)。它是一个优质的 Unicode 和 UTF-8 指南，或许能帮助解除一些这方面的疑惑。

```@raw html
<!-- If this is all extremely confusing, try reading ["The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets"](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/).　
It's an excellent introduction to Unicode and UTF-8, and may help alleviate
some confusion regarding the matter. -->
```

## 版本号字面量

```@raw html
<!-- ## Version Number Literals -->
```

版本号很容易用 [`v"..."`](@ref) 形式的非标准字符串字面量表示。版本号字面量生成遵循 [语义版本](http://semver.org) 规范的 [`VersionNumber`](@ref) 对象，因此由主、次、补丁号构成，后跟预发行 (pre-release) 和生成阿尔法数注释 (build alpha-numeric)。例如，`v"0.2.1-rc1+win64"` 可分为主版本号 `0`，次版本号 `2`，补丁版本号 `1`，预发行版号 `rc1`，以及生成版本 `win64`。输入版本字面量时，除了主版本号以外所有内容都是可选的，因此 `v"0.2"` 等效于 `v"0.2.0"` (预发行号和生成注释为空), `v"2"` 等效于 `v"2.0.0"`，等等。

```@raw html
<!-- Version numbers can easily be expressed with non-standard string literals of the form [`v"..."`](@ref @v_str).
Version number literals create [`VersionNumber`](@ref) objects which follow the
specifications of [semantic versioning](http://semver.org),
and therefore are composed of major, minor and patch numeric values, followed by pre-release and
build alpha-numeric annotations. For example, `v"0.2.1-rc1+win64"` is broken into major version
`0`, minor version `2`, patch version `1`, pre-release `rc1` and build `win64`. When entering
a version literal, everything except the major version number is optional, therefore e.g.  `v"0.2"`
is equivalent to `v"0.2.0"` (with empty pre-release/build annotations), `v"2"` is equivalent to
`v"2.0.0"`, and so on. -->
```

`VersionNumber` 对象在轻松正确地比较两个（或更多）版本时非常有用。例如，常数 `VERSION` 把 Julia 的版本号保留为一个 `VersionNumber` 对象，因此可以像下面这样用简单的声明定义一些特定版本的行为：

```@raw html
<!-- `VersionNumber` objects are mostly useful to easily and correctly compare two (or more) versions.
For example, the constant c holds Julia version number as a `VersionNumber` object, and
therefore one can define some version-specific behavior using simple statements as: -->
```

```julia
if v"0.2" <= VERSION < v"0.3-"
    # do something specific to 0.2 release series
end
```

注意在上例中用到了非标准版本号 `v"0.3-"`，其中有尾随符 `-`：这个符号是 Julia 标准的扩展，它可以用来表明低于任何 `0.3` 发行版的版本，包括所有的预发行版。所以上例中代码只能在稳定版本 `0.2` 上运行，而不能在 `v"0.3.0-rc1"` 这样的版本上运行。为了支持非稳定（即预发行）的 `0.2` 版本，下限检查应像这样应该改为：`v"0.2-" <= VERSION`。

```@raw html
<!-- Note that in the above example the non-standard version number `v"0.3-"` is used, with a trailing
`-`: this notation is a Julia extension of the standard, and it's used to indicate a version which
is lower than any `0.3` release, including all of its pre-releases. So in the above example the
code would only run with stable `0.2` versions, and exclude such versions as `v"0.3.0-rc1"`. In
order to also allow for unstable (i.e. pre-release) `0.2` versions, the lower bound check should
be modified like this: `v"0.2-" <= VERSION`. -->
```

另一个非标准版本规范扩展使得能够使用 `+` 来表示生成版本的上限，例如 `VERSION > v"0.2-rc1+"` 可以用来表示任意高于 `0.2-rc1` 和其任意生成版本的版本：它对 `v"0.2-rc1+win64"` 返回 `false` 而对 `v"0.2-rc2"` 返回 `true`。

```@raw html
<!-- Another non-standard version specification extension allows one to use a trailing `+` to express
an upper limit on build versions, e.g.  `VERSION > v"0.2-rc1+"` can be used to mean any version
above `0.2-rc1` and any of its builds: it will return `false` for version `v"0.2-rc1+win64"` and
`true` for `v"0.2-rc2"`. -->
```

在比较中使用这样的特殊版本是个好法子（特别是，总是应该对高版本使用尾随 `-`，除非有好理由不这样），但它们不应该被用作任何内容的实际版本，因为它们在语义版本控制方案中无效。

```@raw html
<!-- It is good practice to use such special versions in comparisons (particularly, the trailing `-`
should always be used on upper bounds unless there's a good reason not to), but they must not
be used as the actual version number of anything, as they are invalid in the semantic versioning
scheme. -->
```

除了用于常数 [`VERSION`](@ref)，c 对象在 `Pkg` 模块中被广泛用于指定包版本和其依赖。

```@raw html
<!-- Besides being used for the [`VERSION`](@ref) constant, c objects are widely used
in the `Pkg` module, to specify packages versions and their dependencies. -->
```

## 原始字符串字面量

```@raw html
<!-- ## Raw String Literals -->
```

无插值和非转义的原始字符串可用 `raw"..."` 形式的非标准字符串字面量表示。原始字符串字面量生成普通的 `String` 对象，它无需插值和非转义地包含和输入完全一样的封闭式内容。这对于包含其他语言中使用 "$" 或 "\" 作为特殊字符的代码或标记的字符串很有用。

```@raw html
<!-- Raw strings without interpolation or unescaping can be expressed with
non-standard string literals of the form `raw"..."`. Raw string literals create
ordinary `String` objects which contain the enclosed contents exactly as
entered with no interpolation or unescaping. This is useful for strings which
contain code or markup in other languages which use `$` or `\` as special
characters. -->
```

例外的是，引号仍必须转义，例如 `raw"\""` 等效于 `"\""`。为了能够表达所有字符串，反斜杠也必须转义，不过只是当它刚好出现在引号前面时。

```@raw html
<!-- The exception is that quotation marks still must be escaped, e.g. `raw"\""` is equivalent
to `"\""`.
To make it possible to express all strings, backslashes then also must be escaped, but
only when appearing right before a quote character: -->
```

```jldoctest
julia> println(raw"\\ \\\"")
\\ \"
```

请注意，前两个反斜杠在输出中逐字显示，这是因为它们不是在引号前面。然而，接下来的一个反斜杠字符转义了后面的一个反斜杠；又由于这些反斜杠出现在引号前面，最后一个反斜杠转义了一个引号。

```@raw html
<!-- Notice that the first two backslashes appear verbatim in the output, since they do not
precede a quote character.
However, the next backslash character escapes the backslash that follows it, and the
last backslash escapes a quote, since these backslashes appear before a quote. -->
```
