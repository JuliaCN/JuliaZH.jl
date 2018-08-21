# 数学运算和初等函数

Julia 为它所有的基础数值类型，提供了整套的基础算术和位运算，也提供了一套高效、可移植的标准数学函数。

## 算术运算符

以下 [算术运算符](https://en.wikipedia.org/wiki/Arithmetic#Arithmetic_operations)
支持所有的基本算术类型：

| 表达式 | 名称           | 描述                            |
|:---------- |:-------------- |:-------------------------------------- |
| `+x`       | 一元加法运算符     | 全等操作                 |
| `-x`       | 一元减法运算符    | 将值变为其相反数 |
| `x + y`    | 二元加法运算符    | 执行加法                      |
| `x - y`    | 二元减法运算符   | 执行减法                   |
| `x * y`    | 乘法运算符          | 执行乘法                |
| `x / y`    | 除法运算符         | 执行除法                      |
| `x ÷ y`    | 整除 | 取x/y的整数部分         |
| `x \ y`    | 反向除法 | 等价于`y / x`                  |
| `x ^ y`    | 幂操作符          | `x`的`y`次幂          |
| `x % y`    | 取余      | 等价于`rem(x,y)`               |

以及对[`Bool`](@ref)类型的否定：

| 表达式 | 名称     | 描述                              |
|:---------- |:-------- |:---------------------------------------- |
| `!x`       | 否定 | 将 `true` 和 `false` 互换 |

Julia的类型提示系统使得混合参数类型上的代数运算也能平滑、自动地进行。可以参考 [类型提升系统](@ref conversion-and-promotion) 来了解更多。

这里是使用算术运算的一些简单例子：

```jldoctest
julia> 1 + 2 + 3
6

julia> 1 - 2
-1

julia> 3*2/12
0.5
```

习惯上我们会把优先运算的操作符紧邻操作数，比如 `-x + 2` 表示先要给 `x`  取反，然后再加 `2` 。

## 位运算符

所有原始整数类型都支持以下[按位算符](https://en.wikipedia.org/wiki/Bitwise_operation#Bitwise_operators)：

| 表达式 | 名称                                                                     |
|:---------- |:------------------------------------------------------------------------ |
| `~x`       | 按位取反                                                              |
| `x & y`    | 按位与                                                              |
| `x \| y`   | 按位或                                                               |
| `x ⊻ y`    | 按位异或（逻辑异或）                                               |
| `x >>> y`  | [逻辑右移](https://en.wikipedia.org/wiki/Logical_shift)        |
| `x >> y`   | [算术右移](https://en.wikipedia.org/wiki/Arithmetic_shift) |
| `x << y`   | 逻辑/算术左移                                            |

以下是位运算符的一些示例：

```jldoctest
julia> ~123
-124

julia> 123 & 234
106

julia> 123 | 234
251

julia> 123 ⊻ 234
145

julia> xor(123, 234)
145

julia> ~UInt32(123)
0xffffff84

julia> ~UInt8(123)
0x84
```

## 复合赋值操作符

每一个双目运算符和位运算符都可以给左操作数复合赋值：方法是把 `=` 直接放在双目运算符后面。比如， `x += 3` 等价于 `x = x + 3` 。

```jldoctest
julia> x = 1
1

julia> x += 3
4

julia> x
4
```

双目运算和位操作的复合赋值操作符有下面几种：

```
+=  -=  *=  /=  \=  ÷=  %=  ^=  &=  |=  ⊻=  >>>=  >>=  <<=
```

!!! note
    复合赋值后会把变量重新绑定到左操作数上，所以变量的类型可能会改变。

    ```jldoctest
    julia> x = 0x01; typeof(x)
    UInt8

    julia> x *= 2 # Same as x = x * 2
    2

    julia> typeof(x)
    Int64
    ```

## [矢量化的 "点" 运算符](@id man-dot-operators)

对于每一个双目运算符，比如 `^` ，都有一个“点”运算符 `.^` 与之对应，它会对数组元素一一执行 `^` 运算。比如 `[1,2,3] ^ 3` 是非法的，因为数学上没有给（长宽不一样的）数组的立方下过定义。但是 `[1,2,3] .^ 3` 在Julia是合法的，它会逐个元素（即“向量式的”）计算，得到 `[1^3, 2^3, 3^3]` 。类似地，像 `!` 和 `√` 这种单目运算符也会依次针对每个元素运算。

```jldoctest
julia> [1,2,3] .^ 3
3-element Array{Int64,1}:
  1
  8
 27
```

More specifically, `a .^ b` is parsed as the ["dot" call](@ref man-vectorized)
`(^).(a,b)`, which performs a [broadcast](@ref Broadcasting) operation:
it can combine arrays and scalars, arrays of the same size (performing
the operation elementwise), and even arrays of different shapes (e.g.
combining row and column vectors to produce a matrix). Moreover, like
all vectorized "dot calls," these "dot operators" are
*fusing*. For example, if you compute `2 .* A.^2 .+ sin.(A)` (or
equivalently `@. 2A^2 + sin(A)`, using the [`@.`](@ref @__dot__) macro) for
an array `A`, it performs a *single* loop over `A`, computing `2a^2 + sin(a)`
for each element of `A`. In particular, nested dot calls like `f.(g.(x))`
are fused, and "adjacent" binary operators like `x .+ 3 .* x.^2` are
equivalent to nested dot calls `(+).(x, (*).(3, (^).(x, 2)))`.

Furthermore, "dotted" updating operators like `a .+= b` (or `@. a += b`) are parsed
as `a .= a .+ b`, where `.=` is a fused *in-place* assignment operation
(see the [dot syntax documentation](@ref man-vectorized)).

Note the dot syntax is also applicable to user-defined operators.
For example, if you define `⊗(A,B) = kron(A,B)` to give a convenient
infix syntax `A ⊗ B` for Kronecker products ([`kron`](@ref)), then
`[A,B] .⊗ [C,D]` will compute `[A⊗C, B⊗D]` with no additional coding.

Combining dot operators with numeric literals can be ambiguous.
For example, it is not clear whether `1.+x` means `1. + x` or `1 .+ x`.
Therefore this syntax is disallowed, and spaces must be used around
the operator in such cases.

## 数值比较

Standard comparison operations are defined for all the primitive numeric types:

| Operator                     | 名称                     |
|:---------------------------- |:------------------------ |
| [`==`](@ref)                 | 相等                 |
| [`!=`](@ref), [`≠`](@ref !=) | 不等               |
| [`<`](@ref)                  | 小于                |
| [`<=`](@ref), [`≤`](@ref <=) | 小于等于    |
| [`>`](@ref)                  | 大于             |
| [`>=`](@ref), [`≥`](@ref >=) | 大于等于 |

下面是些简单的例子：

```jldoctest
julia> 1 == 1
true

julia> 1 == 2
false

julia> 1 != 2
true

julia> 1 == 1.0
true

julia> 1 < 2
true

julia> 1.0 > 3
false

julia> 1 >= 1.0
true

julia> -1 <= 1
true

julia> -1 <= -1
true

julia> -1 <= -2
false

julia> 3 < -0.5
false
```

Integers are compared in the standard manner -- by comparison of bits. Floating-point numbers
are compared according to the [IEEE 754 standard](https://en.wikipedia.org/wiki/IEEE_754-2008):

  * Finite numbers are ordered in the usual manner.
  * Positive zero is equal but not greater than negative zero.
  * `Inf` is equal to itself and greater than everything else except `NaN`.
  * `-Inf` is equal to itself and less then everything else except `NaN`.
  * `NaN` is not equal to, not less than, and not greater than anything, including itself.

The last point is potentially surprising and thus worth noting:

```jldoctest
julia> NaN == NaN
false

julia> NaN != NaN
true

julia> NaN < NaN
false

julia> NaN > NaN
false
```

and can cause especial headaches with [arrays](@ref man-multi-dim-arrays):

```jldoctest
julia> [1 NaN] == [1 NaN]
false
```

Julia provides additional functions to test numbers for special values, which can be useful in
situations like hash key comparisons:

| 函数                | 测试是否满足如下性质                  |
|:----------------------- |:------------------------- |
| [`isequal(x, y)`](@ref) | `x` 与 `y` 是完全相同的 |
| [`isfinite(x)`](@ref)   | `x` 是有限大的数字    |
| [`isinf(x)`](@ref)      | `x` 是（正/负）无穷大           |
| [`isnan(x)`](@ref)      | `x` 是 `NaN`       |

[`isequal`](@ref) 认为 `NaN` 之间是相等的：

```jldoctest
julia> isequal(NaN, NaN)
true

julia> isequal([1 NaN], [1 NaN])
true

julia> isequal(NaN, NaN32)
true
```

`isequal` 也能用来区分带符号的零：

```jldoctest
julia> -0.0 == 0.0
true

julia> isequal(-0.0, 0.0)
false
```

Mixed-type comparisons between signed integers, unsigned integers, and floats can be tricky. A
great deal of care has been taken to ensure that Julia does them correctly.

For other types, `isequal` defaults to calling [`==`](@ref), so if you want to define
equality for your own types then you only need to add a [`==`](@ref) method.  If you define
your own equality function, you should probably define a corresponding [`hash`](@ref) method
to ensure that `isequal(x,y)` implies `hash(x) == hash(y)`.

### 链式比较

Unlike most languages, with the [notable exception of Python](https://en.wikipedia.org/wiki/Python_syntax_and_semantics#Comparison_operators),
comparisons can be arbitrarily chained:

```jldoctest
julia> 1 < 2 <= 2 < 3 == 3 > 2 >= 1 == 1 < 3 != 5
true
```

Chaining comparisons is often quite convenient in numerical code. Chained comparisons use the
`&&` operator for scalar comparisons, and the [`&`](@ref) operator for elementwise comparisons,
which allows them to work on arrays. For example, `0 .< A .< 1` gives a boolean array whose entries
are true where the corresponding elements of `A` are between 0 and 1.

Note the evaluation behavior of chained comparisons:

```jldoctest
julia> v(x) = (println(x); x)
v (generic function with 1 method)

julia> v(1) < v(2) <= v(3)
2
1
3
true

julia> v(1) > v(2) <= v(3)
2
1
false
```

The middle expression is only evaluated once, rather than twice as it would be if the expression
were written as `v(1) < v(2) && v(2) <= v(3)`. However, the order of evaluations in a chained
comparison is undefined. It is strongly recommended not to use expressions with side effects (such
as printing) in chained comparisons. If side effects are required, the short-circuit `&&` operator
should be used explicitly (see [Short-Circuit Evaluation](@ref)).

### 基础函数

Julia provides a comprehensive collection of mathematical functions and operators. These mathematical
operations are defined over as broad a class of numerical values as permit sensible definitions,
including integers, floating-point numbers, rationals, and complex numbers,
wherever such definitions make sense.

Moreover, these functions (like any Julia function) can be applied in "vectorized" fashion to
arrays and other collections with the [dot syntax](@ref man-vectorized) `f.(A)`,
e.g. `sin.(A)` will compute the sine of each element of an array `A`.

## 运算符的优先级与结合性

Julia applies the following order and associativity of operations, from highest precedence to lowest:

| 分类       | 运算符                                                                                         | 结合性              |
|:-------------- |:------------------------------------------------------------------------------------------------- |:-------------------------- |
| 语法组成         | `.` followed by `::`                                                                              | 左结合                       |
| 幂运算 | `^`                                                                                               | 右结合                      |
| 一元运算符          | `+ - √`                                                                                           | 右结合[^1]                  |
| 位移运算      | `<< >> >>>`                                                                                       | 左结合                       |
| 除法      | `//`                                                                                              | 左结合                       |
| 乘法 | `* / % & \ ÷`                                                                                     | 左结合[^2]                   |
| 加法       | `+ - \| ⊻`                                                                                        | 左结合[^2]                   |
| 语法组成         | `: ..`                                                                                            | 左结合                       |
| 语法组成         | `\|>`                                                                                             | 左结合                       |
| 语法组成         | `<\|`                                                                                             | 右结合                      |
| 比较    | `> < >= <= == === != !== <:`                                                                      | 无结合性            |
| 控制流程   | `&&` followed by `\|\|` followed by `?`                                                           | 右结合                      |
| Pair           | `=>`                                                                                              | 右结合                      |
| 赋值    | `= += -= *= /= //= \= ^= ÷= %= \|= &= ⊻= <<= >>= >>>=`                                            | 右结合                      |

[^1]:
    The unary operators `+` and `-` require explicit parentheses around their argument to disambiguate them from the operator `++`, etc. Other compositions of unary operators are parsed with right-associativity, e. g., `√√-a` as `√(√(-a))`.
[^2]:
    The operators `+`, `++` and `*` are non-associative. `a + b + c` is parsed as `+(a, b, c)` not `+(+(a, b),
    c)`. However, the fallback methods for `+(a, b, c, d...)` and `*(a, b, c, d...)` both default to left-associative evaluation.

For a complete list of *every* Julia operator's precedence, see the top of this file:
[`src/julia-parser.scm`](https://github.com/JuliaLang/julia/blob/master/src/julia-parser.scm)

You can also find the numerical precedence for any given operator via the built-in function `Base.operator_precedence`, where higher numbers take precedence:

```jldoctest
julia> Base.operator_precedence(:+), Base.operator_precedence(:*), Base.operator_precedence(:.)
(11, 13, 17)

julia> Base.operator_precedence(:sin), Base.operator_precedence(:+=), Base.operator_precedence(:(=))  # (Note the necessary parens on `:(=)`)
(0, 1, 1)
```

A symbol representing the operator associativity can also be found by calling the built-in function `Base.operator_associativity`:

```jldoctest
julia> Base.operator_associativity(:-), Base.operator_associativity(:+), Base.operator_associativity(:^)
(:left, :none, :right)

julia> Base.operator_associativity(:⊗), Base.operator_associativity(:sin), Base.operator_associativity(:→)
(:left, :none, :right)
```

Note that symbols such as `:sin` return precedence `0`. This value represents invalid operators and not
operators of lowest precedence. Similarly, such operators are assigned associativity `:none`.

## 数值转换

Julia supports three forms of numerical conversion, which differ in their handling of inexact
conversions.

  * The notation `T(x)` or `convert(T,x)` converts `x` to a value of type `T`.

      * If `T` is a floating-point type, the result is the nearest representable value, which could be
        positive or negative infinity.
      * 如果`T` 为整数类型，当`x`不为`T`类型时，会触发`InexactError`
  * `x % T` converts an integer `x` to a value of integer type `T` congruent to `x` modulo `2^n`,
    where `n` is the number of bits in `T`. In other words, the binary representation is truncated
    to fit.
  * The [Rounding functions](@ref) take a type `T` as an optional argument. For example, `round(Int,x)`
    is a shorthand for `Int(round(x))`.

The following examples show the different forms.

```jldoctest
julia> Int8(127)
127

julia> Int8(128)
ERROR: InexactError: trunc(Int8, 128)
Stacktrace:
[...]

julia> Int8(127.0)
127

julia> Int8(3.14)
ERROR: InexactError: Int8(Int8, 3.14)
Stacktrace:
[...]

julia> Int8(128.0)
ERROR: InexactError: Int8(Int8, 128.0)
Stacktrace:
[...]

julia> 127 % Int8
127

julia> 128 % Int8
-128

julia> round(Int8,127.4)
127

julia> round(Int8,127.6)
ERROR: InexactError: trunc(Int8, 128.0)
Stacktrace:
[...]
```

See [Conversion and Promotion](@ref conversion-and-promotion) for how to define your own conversions and promotions.

### 舍入函数

| 函数              | 描述                      | 返回类型 |
|:--------------------- |:-------------------------------- |:----------- |
| [`round(x)`](@ref)    | `x` 舍到最接近的整数 | `typeof(x)` |
| [`round(T, x)`](@ref) | `x` 舍到最接近的整数 | `T`         |
| [`floor(x)`](@ref)    | `x` 舍到`-Inf`         | `typeof(x)` |
| [`floor(T, x)`](@ref) | `x` 舍到`-Inf`         | `T`         |
| [`ceil(x)`](@ref)     | round `x` towards `+Inf`         | `typeof(x)` |
| [`ceil(T, x)`](@ref)  | round `x` towards `+Inf`         | `T`         |
| [`trunc(x)`](@ref)    | round `x` towards zero           | `typeof(x)` |
| [`trunc(T, x)`](@ref) | round `x` towards zero           | `T`         |

### 除法函数

| 函数                  | 描述                                                                                               |
|:------------------------- |:--------------------------------------------------------------------------------------------------------- |
| [`div(x,y)`](@ref), `x÷y` | truncated division; quotient rounded towards zero                                                         |
| [`fld(x,y)`](@ref)        | floored division; quotient rounded towards `-Inf`                                                         |
| [`cld(x,y)`](@ref)        | ceiling division; quotient rounded towards `+Inf`                                                         |
| [`rem(x,y)`](@ref)        | remainder; satisfies `x == div(x,y)*y + rem(x,y)`; sign matches `x`                                       |
| [`mod(x,y)`](@ref)        | modulus; satisfies `x == fld(x,y)*y + mod(x,y)`; sign matches `y`                                         |
| [`mod1(x,y)`](@ref)       | `mod` with offset 1; returns `r∈(0,y]` for `y>0` or `r∈[y,0)` for `y<0`, where `mod(r, y) == mod(x, y)`   |
| [`mod2pi(x)`](@ref)       | modulus with respect to 2pi;  `0 <= mod2pi(x)    < 2pi`                                                   |
| [`divrem(x,y)`](@ref)     | returns `(div(x,y),rem(x,y))`                                                                             |
| [`fldmod(x,y)`](@ref)     | returns `(fld(x,y),mod(x,y))`                                                                             |
| [`gcd(x,y...)`](@ref)     | greatest positive common divisor of `x`, `y`,...                                                          |
| [`lcm(x,y...)`](@ref)     | least positive common multiple of `x`, `y`,...                                                            |

### 符号和绝对值函数

| 函数                | 描述                                                |
|:----------------------- |:---------------------------------------------------------- |
| [`abs(x)`](@ref)        | a positive value with the magnitude of `x`                 |
| [`abs2(x)`](@ref)       | the squared magnitude of `x`                               |
| [`sign(x)`](@ref)       | indicates the sign of `x`, returning -1, 0, or +1          |
| [`signbit(x)`](@ref)    | indicates whether the sign bit is on (true) or off (false) |
| [`copysign(x,y)`](@ref) | a value with the magnitude of `x` and the sign of `y`      |
| [`flipsign(x,y)`](@ref) | a value with the magnitude of `x` and the sign of `x*y`    |

### 幂、对数与平方根

| 函数                 | 描述                                                                |
|:------------------------ |:-------------------------------------------------------------------------- |
| [`sqrt(x)`](@ref), `√x`  | square root of `x`                                                         |
| [`cbrt(x)`](@ref), `∛x`  | cube root of `x`                                                           |
| [`hypot(x,y)`](@ref)     | hypotenuse of right-angled triangle with other sides of length `x` and `y` |
| [`exp(x)`](@ref)         | natural exponential function at `x`                                        |
| [`expm1(x)`](@ref)       | accurate `exp(x)-1` for `x` near zero                                      |
| [`ldexp(x,n)`](@ref)     | `x*2^n` computed efficiently for integer values of `n`                     |
| [`log(x)`](@ref)         | natural logarithm of `x`                                                   |
| [`log(b,x)`](@ref)       | base `b` logarithm of `x`                                                  |
| [`log2(x)`](@ref)        | base 2 logarithm of `x`                                                    |
| [`log10(x)`](@ref)       | base 10 logarithm of `x`                                                   |
| [`log1p(x)`](@ref)       | accurate `log(1+x)` for `x` near zero                                      |
| [`exponent(x)`](@ref)    | binary exponent of `x`                                                     |
| [`significand(x)`](@ref) | binary significand (a.k.a. mantissa) of a floating-point number `x`        |

For an overview of why functions like [`hypot`](@ref), [`expm1`](@ref), and [`log1p`](@ref)
are necessary and useful, see John D. Cook's excellent pair of blog posts on the subject: [expm1, log1p, erfc](https://www.johndcook.com/blog/2010/06/07/math-library-functions-that-seem-unnecessary/),
and [hypot](https://www.johndcook.com/blog/2010/06/02/whats-so-hard-about-finding-a-hypotenuse/).

### 三角和双曲函数

All the standard trigonometric and hyperbolic functions are also defined:

```
sin    cos    tan    cot    sec    csc
sinh   cosh   tanh   coth   sech   csch
asin   acos   atan   acot   asec   acsc
asinh  acosh  atanh  acoth  asech  acsch
sinc   cosc
```

These are all single-argument functions, with [`atan`](@ref) also accepting two arguments
corresponding to a traditional [`atan2`](https://en.wikipedia.org/wiki/Atan2) function.

Additionally, [`sinpi(x)`](@ref) and [`cospi(x)`](@ref) are provided for more accurate computations
of [`sin(pi*x)`](@ref) and [`cos(pi*x)`](@ref) respectively.

In order to compute trigonometric functions with degrees instead of radians, suffix the function
with `d`. For example, [`sind(x)`](@ref) computes the sine of `x` where `x` is specified in degrees.
The complete list of trigonometric functions with degree variants is:

```
sind   cosd   tand   cotd   secd   cscd
asind  acosd  atand  acotd  asecd  acscd
```

### 特殊函数

[SpecialFunctions.jl](https://github.com/JuliaMath/SpecialFunctions.jl) 包提供了许多其他的特殊数学函数。
