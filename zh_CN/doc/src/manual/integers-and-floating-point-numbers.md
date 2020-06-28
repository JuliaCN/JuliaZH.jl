# 整数和浮点数

整数和浮点值是算术和计算的基础。这些数值的内置表示被称作原始数值类型（numeric primitive），且整数和浮点数在代码中作为立即数时称作数值字面量（numeric literal）。例如，`1` 是个整型字面量，`1.0` 是个浮点型字面量，它们在内存中作为对象的二进制表示就是原始数值类型。

Julia 提供了很丰富的原始数值类型，并基于它们定义了一整套算术操作，还提供按位运算符以及一些标准数学函数。这些函数能够直接映射到现代计算机原生支持的数值类型及运算上，因此 Julia 可以充分地利用运算资源。此外，Julia 还为[任意精度算术](@ref)提供了软件支持，对于无法使用原生硬件表示的数值类型，Julia 也能够高效地处理其数值运算。当然，这需要相对的牺牲一些性能。

以下是 Julia 的原始数值类型：

  * **整数类型：**

| 类型              | 带符号？ | 比特数 | 最小值 | 最大值 |
|:----------------- |:------- |:-------------- |:-------------- |:------------- |
| [`Int8`](@ref)    | ✓       | 8              | -2^7           | 2^7 - 1       |
| [`UInt8`](@ref)   |         | 8              | 0              | 2^8 - 1       |
| [`Int16`](@ref)   | ✓       | 16             | -2^15          | 2^15 - 1      |
| [`UInt16`](@ref)  |         | 16             | 0              | 2^16 - 1      |
| [`Int32`](@ref)   | ✓       | 32             | -2^31          | 2^31 - 1      |
| [`UInt32`](@ref)  |         | 32             | 0              | 2^32 - 1      |
| [`Int64`](@ref)   | ✓       | 64             | -2^63          | 2^63 - 1      |
| [`UInt64`](@ref)  |         | 64             | 0              | 2^64 - 1      |
| [`Int128`](@ref)  | ✓       | 128            | -2^127         | 2^127 - 1     |
| [`UInt128`](@ref) |         | 128            | 0              | 2^128 - 1     |
| [`Bool`](@ref)    | N/A     | 8              | `false` (0)    | `true` (1)    |

  * **浮点类型:**

| 类型              | 精度                                                                      | 比特数 |
|:----------------- |:------------------------------------------------------------------------------ |:-------------- |
| [`Float16`](@ref) | [half](https://en.wikipedia.org/wiki/Half-precision_floating-point_format)     | 16             |
| [`Float32`](@ref) | [single](https://en.wikipedia.org/wiki/Single_precision_floating-point_format) | 32             |
| [`Float64`](@ref) | [double](https://en.wikipedia.org/wiki/Double_precision_floating-point_format) | 64             |

此外，对[复数和有理数](@ref)的完整支持是在这些原始数据类型之上建立起来的。多亏了 Julia 有一个很灵活的、用户可扩展的[类型提升系统](@ref conversion-and-promotion)，所有的数值类型都无需显式转换就可以很自然地相互进行运算。

## 整数

整数字面量以标准形式表示：

```jldoctest
julia> 1
1

julia> 1234
1234
```

整型字面量的默认类型取决于目标系统是 32 位还是 64 位架构：

```julia-repl
# 32 位系统：
julia> typeof(1)
Int32

# 64 位系统：
julia> typeof(1)
Int64
```

Julia 的内置变量 [`Sys.WORD_SIZE`](@ref) 表明了目标系统是 32 位还是 64 位架构：

```julia-repl
# 32 位系统：
julia> Sys.WORD_SIZE
32

# 64 位系统：
julia> Sys.WORD_SIZE
64
```

Julia 也定义了 `Int` 与 `UInt` 类型，它们分别是系统有符号和无符号的原生整数类型的别名。

```julia-repl
# 32 位系统：
julia> Int
Int32
julia> UInt
UInt32

# 64 位系统：
julia> Int
Int64
julia> UInt
UInt64
```

那些超过 32 位表示范围的大整数，如果能用 64 位表示，那么无论是什么系统都会用 64 位表示：

```jldoctest
# 32 位或 64 位系统：
julia> typeof(3000000000)
Int64
```

无符号整数会通过 `0x` 前缀以及十六进制数 `0-9a-f` 来输入和输出（输入也可以使用大写的 `A-F`）。无符号值的位数取决于十六进制数字使用的数量：

```jldoctest
julia> 0x1
0x01

julia> typeof(ans)
UInt8

julia> 0x123
0x0123

julia> typeof(ans)
UInt16

julia> 0x1234567
0x01234567

julia> typeof(ans)
UInt32

julia> 0x123456789abcdef
0x0123456789abcdef

julia> typeof(ans)
UInt64

julia> 0x11112222333344445555666677778888
0x11112222333344445555666677778888

julia> typeof(ans)
UInt128
```

采用这种做法是因为，当人们使用无符号十六进制字面量表示整数值的时候，通常会用它们来表示一个固定的数值字节序列，而不仅仅是个整数值。

还记得这个 [`ans`](@ref) 变量吗？它存着交互式会话中上一个表达式的运算结果，但以其他方式运行的 Julia 代码中没有这个变量。

二进制和八进制字面量也是支持的：

```jldoctest
julia> 0b10
0x02

julia> typeof(ans)
UInt8

julia> 0o010
0x08

julia> typeof(ans)
UInt8

julia> 0x00000000000000001111222233334444
0x00000000000000001111222233334444

julia> typeof(ans)
UInt128
```

二进制、八进制和十六进制的字面量都会产生无符号的整数类型。当字面量不是开头全是 0 时，它们二进制数据项的位数会是最少需要的位数。当开头都是 `0` 时，位数取决于一个字面量需要的最少位数，这里的字面量指的是一个有着同样长度但开头都为 `1` 的数。这样用户就可以控制位数了。那些无法使用 `UInt128` 类型存储下的值无法写成这样的字面量。

二进制、八进制和十六进制的字面量可以在前面紧接着加一个负号 `-`，这样可以产生一个和原字面量有着同样位数而值为原数的补码的数（二补数）：

```jldoctest
julia> -0x2
0xfe

julia> -0x0002
0xfffe
```

整型等原始数值类型的最小和最大可表示的值可用 [`typemin`](@ref) 和 [`typemax`](@ref) 函数得到：

```jldoctest
julia> (typemin(Int32), typemax(Int32))
(-2147483648, 2147483647)

julia> for T in [Int8,Int16,Int32,Int64,Int128,UInt8,UInt16,UInt32,UInt64,UInt128]
           println("$(lpad(T,7)): [$(typemin(T)),$(typemax(T))]")
       end
   Int8: [-128,127]
  Int16: [-32768,32767]
  Int32: [-2147483648,2147483647]
  Int64: [-9223372036854775808,9223372036854775807]
 Int128: [-170141183460469231731687303715884105728,170141183460469231731687303715884105727]
  UInt8: [0,255]
 UInt16: [0,65535]
 UInt32: [0,4294967295]
 UInt64: [0,18446744073709551615]
UInt128: [0,340282366920938463463374607431768211455]
```

[`typemin`](@ref) 和 [`typemax`](@ref) 返回的值的类型总与所给参数的类型相同。（上面的表达式用了一些目前还没有介绍的功能，包括 [for 循环](@ref man-loops)、[字符串](@ref man-strings)和[插值](@ref)，但对于已有一些编程经验的用户应该是很容易理解的。）

### 溢出行为

Julia 中，超出一个类型可表示的最大值会导致循环行为：

```jldoctest
julia> x = typemax(Int64)
9223372036854775807

julia> x + 1
-9223372036854775808

julia> x + 1 == typemin(Int64)
true
```

因此，Julia 的整数算术实际上是[模算数](https://zh.wikipedia.org/wiki/%E6%A8%A1%E7%AE%97%E6%95%B8)的一种形式，它反映了现代计算机实现底层算术的特点。在可能有溢出产生的程序中，对最值边界出现循环进行显式检查是必要的。否则，推荐使用[任意精度算术](@ref)中的 [`BigInt`](@ref) 类型作为替代。

下面是溢出行为的一个例子以及如何解决溢出：

```jldoctest
julia> 10^19
-8446744073709551616

julia> big(10)^19
10000000000000000000
```

### 除法错误

`div` 函数的整数除法有两种异常情况：除以零，以及使用 -1 去除最小的负数（[`typemin`](@ref)）。
这两种情况都会抛出一个 [`DivideError`](@ref) 错误。
`rem` 取余函数和 `mod` 取模函数在除零时抛出 [`DivideError`](@ref) 错误。

## 浮点数

浮点数字面量也使用标准格式表示，必要时可使用 [E-表示法](https://en.wikipedia.org/wiki/Scientific_notation#E-notation)：

```jldoctest
julia> 1.0
1.0

julia> 1.
1.0

julia> 0.5
0.5

julia> .5
0.5

julia> -1.23
-1.23

julia> 1e10
1.0e10

julia> 2.5e-4
0.00025
```

上面的结果都是 [`Float64`](@ref) 值。使用 `f` 替代 `e` 可以得到 [`Float32`](@ref) 的字面量：

```jldoctest
julia> 0.5f0
0.5f0

julia> typeof(ans)
Float32

julia> 2.5f-4
0.00025f0
```

数值容易就能转换成 [`Float32`](@ref)：

```jldoctest
julia> Float32(-1.5)
-1.5f0

julia> typeof(ans)
Float32
```

也存在十六进制的浮点数字面量，但只适用于 [`Float64`](@ref) 值。一般使用 `p` 前缀及以 2 为底的指数来表示：

```jldoctest
julia> 0x1p0
1.0

julia> 0x1.8p3
12.0

julia> 0x.4p-1
0.125

julia> typeof(ans)
Float64
```

Julia 也支持半精度浮点数（[`Float16`](@ref)），但它们是使用 [`Float32`](@ref) 进行模拟实现的。

```jldoctest
julia> sizeof(Float16(4.))
2

julia> 2*Float16(4.)
Float16(8.0)
```

下划线 `_` 可用作数字分隔符：

```jldoctest
julia> 10_000, 0.000_000_005, 0xdead_beef, 0b1011_0010
(10000, 5.0e-9, 0xdeadbeef, 0xb2)
```

### 浮点数中的零

浮点数有[两个零](https://zh.wikipedia.org/wiki/%E2%88%920)，正零和负零。它们相互相等但有着不同的二进制表示，可以使用 [`bitstring`](@ref) 函数来查看：

```jldoctest
julia> 0.0 == -0.0
true

julia> bitstring(0.0)
"0000000000000000000000000000000000000000000000000000000000000000"

julia> bitstring(-0.0)
"1000000000000000000000000000000000000000000000000000000000000000"
```

### 特殊的浮点值

有三种特定的标准浮点值不和实数轴上任何一点对应：

| `Float16` | `Float32` | `Float64` | 名称              | 描述                                                     |
|:--------- |:--------- |:--------- |:----------------- |:--------------------------------------------------------------- |
| `Inf16`   | `Inf32`   | `Inf`     | 正无穷 | 一个大于所有有限浮点数的数           |
| `-Inf16`  | `-Inf32`  | `-Inf`    | 负无穷 | 一个小于所有有限浮点数的数              |
| `NaN16`   | `NaN32`   | `NaN`     | 不是数（Not a Number）      | 一个不和任何浮点值（包括自己）相等（`==`）的值 |

对于这些非有限浮点值相互之间以及关于其它浮点值的顺序的更多讨论，请参见[数值比较](@ref)。根据 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754_revision)，这些浮点值是某些算术运算的结果：

```jldoctest
julia> 1/Inf
0.0

julia> 1/0
Inf

julia> -5/0
-Inf

julia> 0.000001/0
Inf

julia> 0/0
NaN

julia> 500 + Inf
Inf

julia> 500 - Inf
-Inf

julia> Inf + Inf
Inf

julia> Inf - Inf
NaN

julia> Inf * Inf
Inf

julia> Inf / Inf
NaN

julia> 0 * Inf
NaN
```

[`typemin`](@ref) 和 [`typemax`](@ref) 函数同样适用于浮点类型：

```jldoctest
julia> (typemin(Float16),typemax(Float16))
(-Inf16, Inf16)

julia> (typemin(Float32),typemax(Float32))
(-Inf32, Inf32)

julia> (typemin(Float64),typemax(Float64))
(-Inf, Inf)
```

### 机器精度

大多数实数都无法用浮点数准确地表示，因此有必要知道两个相邻可表示的浮点数间的距离。它通常被叫做[机器精度](https://en.wikipedia.org/wiki/Machine_epsilon)。

Julia 提供了 [`eps`](@ref) 函数，它可以给出 `1.0` 与下一个 Julia 能表示的浮点数之间的差值：

```jldoctest
julia> eps(Float32)
1.1920929f-7

julia> eps(Float64)
2.220446049250313e-16

julia> eps() # 与 eps(Float64) 相同
2.220446049250313e-16
```

这些值分别是 [`Float32`](@ref) 中的 `2.0^-23` 和 [`Float64`](@ref) 中的 `2.0^-52`。[`eps`](@ref) 函数也可以接受一个浮点值作为参数，然后给出这个值与下一个可表示的值直接的绝对差。也就是说，`eps(x)` 产生一个和 `x` 类型相同的值使得 `x + eps(x)` 是比 `x` 更大的下一个可表示的浮点值：

```jldoctest
julia> eps(1.0)
2.220446049250313e-16

julia> eps(1000.)
1.1368683772161603e-13

julia> eps(1e-27)
1.793662034335766e-43

julia> eps(0.0)
5.0e-324
```

两个相邻可表示的浮点数之间的距离并不是常数，数值越小，间距越小，数值越大，间距越大。换句话说，可表示的浮点数在实数轴上的零点附近最稠密，并沿着远离零点的方向以指数型的速度变得越来越稀疏。根据定义，`eps(1.0)` 与 `eps(Float64)` 相等，因为 `1.0` 是个 64 位浮点值。

Julia 也提供了 [`nextfloat`](@ref) 和 [`prevfloat`](@ref) 两个函数分别返回基于参数的下一个更大或更小的可表示的浮点数：

```jldoctest
julia> x = 1.25f0
1.25f0

julia> nextfloat(x)
1.2500001f0

julia> prevfloat(x)
1.2499999f0

julia> bitstring(prevfloat(x))
"00111111100111111111111111111111"

julia> bitstring(x)
"00111111101000000000000000000000"

julia> bitstring(nextfloat(x))
"00111111101000000000000000000001"
```

这个例子体现了一般原则，即相邻可表示的浮点数也有着相邻的二进制整数表示。

### 舍入模式

一个数如果没有精确的浮点表示，就必须被舍入到一个合适的可表示的值。然而，如果想的话，可以根据舍入模式改变舍入的方式，如 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754-2008) 所述。 

Julia 所使用的默认模式总是 [`RoundNearest`](@ref)，指舍入到最接近的可表示的值，这个被舍入的值会使用尽量少的有效位数。

### 基础知识与参考文献

浮点算术带来了很多微妙之处，它们可能对于那些不熟悉底层实现细节的用户会是很出人意料的。然而，这些微妙之处在大部分科学计算的书籍中以及以下的参考资料中都有详细介绍:

  * 浮点数算术的权威指南是 [IEEE 754-2008 标准](https://standards.ieee.org/standard/754-2008.html)；
    然而这篇标准在网上无法免费获得。
  * 关于浮点数是如何表示的，想要一个简单而明白的介绍的话，可以看 John D. Cook 的[文章](https://www.johndcook.com/blog/2009/04/06/anatomy-of-a-floating-point-number/)以及他关于从这种表示与实数理想的抽象化的差别中产生的一些问题的[介绍](https://www.johndcook.com/blog/2009/04/06/numbers-are-a-leaky-abstraction/)
     
     
     
     
  * 同样推荐 Bruce Dawson 的[一系列关于浮点数的博客文章](https://randomascii.wordpress.com/2012/05/20/thats-not-normalthe-performance-of-odd-floats)。
  * 想要一个对浮点数和使用浮点数计算时产生的数值精度问题的极好的、有深度的讨论，可以参见 David Goldberg 的文章 [What Every Computer Scientist Should Know About Floating-Point Arithmetic](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.22.6768&rep=rep1&type=pdf)。
     
  * 更多延伸文档，包括浮点数的历史、基础理论、问题以及数值计算中很多其它主题的讨论，可以参见 [William Kahan](https://en.wikipedia.org/wiki/William_Kahan) 的[写作集](https://people.eecs.berkeley.edu/~wkahan/)。他以“浮点数之父”闻名。特别感兴趣的话可以看 [An Interview with the Old Man of Floating-Point](https://people.eecs.berkeley.edu/~wkahan/ieee754status/754story.html)。
     
     
     

## 任意精度算术

为了允许使用任意精度的整数与浮点数，Julia 分别包装了 [GNU Multiple Precision Arithmetic Library (GMP)](https://gmplib.org) 以及 [GNU MPFR Library](https://www.mpfr.org)。Julia 中的 [`BigInt`](@ref) 与 [`BigFloat`](@ref) 两种类型分别提供了任意精度的整数和浮点数。

构造函数可以从基本的数值类型或 [字符串字面量](@ref non-standard-string-literals)创建这些类型。 [`@big_str`](@ref) 和 [`parse`](@ref) 可以用来从 `AbstractString` 构造它们。
一旦被创建，它们就可以像所有其它数值类型一样参与算术（这也多亏了 Julia 的[类型提升和转换机制](@ref conversion-and-promotion)）。

```jldoctest
julia> BigInt(typemax(Int64)) + 1
9223372036854775808

julia> big"123456789012345678901234567890" + 1
123456789012345678901234567891

julia> parse(BigInt, "123456789012345678901234567890") + 1
123456789012345678901234567891

julia> big"1.23456789012345678901"
1.234567890123456789010000000000000000000000000000000000000000000000000000000004

julia> parse(BigFloat, "1.23456789012345678901")
1.234567890123456789010000000000000000000000000000000000000000000000000000000004

julia> BigFloat(2.0^66) / 3
2.459565876494606882133333333333333333333333333333333333333333333333333333333344e+19

julia> factorial(BigInt(40))
815915283247897734345611269596115894272000000000
```

然而，上面的原始类型与 [`BigInt`](@ref)/[`BigFloat`](@ref) 之间的类型提升并不是自动的，需要明确地指定：

```jldoctest
julia> x = typemin(Int64)
-9223372036854775808

julia> x = x - 1
9223372036854775807

julia> typeof(x)
Int64

julia> y = BigInt(typemin(Int64))
-9223372036854775808

julia> y = y - 1
-9223372036854775809

julia> typeof(y)
BigInt
```

[`BigFloat`](@ref) 的默认精度（有效数字的位数）和舍入模式可以通过调用 [`setprecision`](@ref) 和 [`setrounding`](@ref) 来全局地改变，所有之后的计算都会根据这些改变进行。还有一种方法，可以使用同样的函数以及 `do`-block 来只在运行一个特定代码块时改变精度和舍入模式：

```jldoctest
julia> setrounding(BigFloat, RoundUp) do
           BigFloat(1) + parse(BigFloat, "0.1")
       end
1.100000000000000000000000000000000000000000000000000000000000000000000000000003

julia> setrounding(BigFloat, RoundDown) do
           BigFloat(1) + parse(BigFloat, "0.1")
       end
1.099999999999999999999999999999999999999999999999999999999999999999999999999986

julia> setprecision(40) do
           BigFloat(1) + parse(BigFloat, "0.1")
       end
1.1000000000004
```

## [数值字面量系数](@id man-numeric-literal-coefficients)

为了让常见的数值公式和表达式更清楚，Julia 允许变量直接跟在一个数值字面量后，暗指乘法。这可以让写多项式变得很清楚：

```jldoctest numeric-coefficients
julia> x = 3
3

julia> 2x^2 - 3x + 1
10

julia> 1.5x^2 - .5x + 1
13.0
```

也会让写指数函数变得更加优雅：

```jldoctest numeric-coefficients
julia> 2^2x
64
```

数值字面量系数的优先级跟一元运算符相同，比如说取相反数。所以 `2^3x` 会被解析成 `2^(3x)`，而 `2x^3` 会被解析成 `2*(x^3)`。

数值字面量也能作为被括号表达式的系数：

```jldoctest numeric-coefficients
julia> 2(x-1)^2 - 3(x-1) + 1
3
```
!!! note
    用于隐式乘法的数值字面量系数的优先级高于其它的二元运算符，例如乘法（`*`）和除法（`/`、`\` 以及 `//`）。这意味着，比如说，`1 / 2im` 等于 `-0.5im` 以及 `6 // 2(2+1)` 等于 `1 // 1`。

此外，括号表达式可以被用作变量的系数，暗指表达式与变量相乘：

```jldoctest numeric-coefficients
julia> (x-1)x
6
```

但是，无论是把两个括号表达式并列，还是把变量放在括号表达式之前，都不会被用作暗指乘法：

```jldoctest numeric-coefficients
julia> (x-1)(x+1)
ERROR: MethodError: objects of type Int64 are not callable

julia> x(x+1)
ERROR: MethodError: objects of type Int64 are not callable
```

这两种表达式都会被解释成函数调用：所有不是数值字面量的表达式，后面紧跟一个括号，就会被解释成使用括号内的值来调用函数（更多关于函数的信息请参见[函数](@ref)）。因此，在这两种情况中，都会因为左手边的值并不是函数而产生错误。

上述的语法糖显著地降低了在写普通数学公式时的视觉干扰。注意数值字面量系数和后面用来相乘的标识符或括号表达式之间不能有空格。

### 语法冲突

并列的字面量系数语法可能和两种数值字面量语法产生冲突：十六进制整数字面量以及浮点字面量的工程表示法。下面是几种会产生语法冲突的情况：

  * 十六进制整数字面量 `0xff` 可能被解释成数值字面量 `0` 乘以变量 `xff`。
  * 浮点字面量表达式 `1e10` 可以被解释成数值字面量 `1` 乘以变量 `e10`，与之等价的 `E`-表示法也存在类似的情况。
  * 32-bit 的浮点数字面量 `1.5f22` 被解释成数值字面量 `1.5` 乘以变量 `f22`。

在这些所有的情况中，都使用这样的解释方式来解决歧义：

  * `0x` 开头的表达式总是十六进制字面量。
  * 数值开头跟着 `e` 和 `E` 的表达式总是浮点字面量。
  * 数值开头跟着 `f` 的表达式总是 32-bit 浮点字面量。

由于历史原因 `E` 和 `e` 在数值字面量上是等价的，与之不同的是，`F` 只是一个行为和 `f` 不同的字母。因此开头为 `F` 的表达式将会被
解析为一个数值字面量乘以一个变量，例如 `1.5F22`等价于 `1.5 * F22`。

## 零和一的字面量

Julia 提供了 0 和 1 的字面量函数，可以返回特定类型或所给变量的类型。

| 函数          | 描述                                      |
|:----------------- |:------------------------------------------------ |
| [`zero(x)`](@ref) | `x` 类型或变量 `x` 的类型的零字面量 |
| [`one(x)`](@ref)  | `x` 类型或变量 `x` 的类型的一字面量 |

这些函数在[数值比较](@ref)中可以用来避免不必要的[类型转换](@ref conversion-and-promotion)带来的开销。

例如：

```jldoctest
julia> zero(Float32)
0.0f0

julia> zero(1.0)
0.0

julia> one(Int32)
1

julia> one(BigFloat)
1.0
```
