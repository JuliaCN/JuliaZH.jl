# 数学运算和初等函数

Julia 为它所有的基础数值类型，提供了整套的基础算术和位运算，也提供了一套高效、可移植的标准数学函数。

## 算术运算符

以下[算术运算符](https://en.wikipedia.org/wiki/Arithmetic#Arithmetic_operations)支持所有的原始数值类型：

| 表达式 | 名称           | 描述                            |
|:---------- |:-------------- |:-------------------------------------- |
| `+x`       | 一元加法运算符     | 全等操作                 |
| `-x`       | 一元减法运算符    | 将值变为其相反数 |
| `x + y`    | 二元加法运算符    | 执行加法                      |
| `x - y`    | 二元减法运算符   | 执行减法                   |
| `x * y`    | 乘法运算符          | 执行乘法                |
| `x / y`    | 除法运算符         | 执行除法                      |
| `x ÷ y`    | 整除 | 取 x / y 的整数部分         |
| `x \ y`    | 反向除法 | 等价于 `y / x`                  |
| `x ^ y`    | 幂操作符          | `x` 的 `y` 次幂          |
| `x % y`    | 取余      | 等价于 `rem(x,y)`               |

以及对 [`Bool`](@ref) 类型的否定：

| 表达式 | 名称     | 描述                              |
|:---------- |:-------- |:---------------------------------------- |
| `!x`       | 否定 | 将 `true` 和 `false` 互换 |

除了优先级比二元操作符高以外，直接放在标识符或括号前的数字，如 `2x` 或 `2(x+y)` 还会被视为乘法。详见[数值字面量系数](@ref man-numeric-literal-coefficients)。

Julia 的类型提升系统使得混合参数类型上的代数运算也能顺其自然的工作，请参考[类型提升系统](@ref conversion-and-promotion)来了解更多内容。

这里是使用算术运算符的一些简单例子：

```jldoctest
julia> 1 + 2 + 3
6

julia> 1 - 2
-1

julia> 3*2/12
0.5
```

习惯上我们会把优先运算的操作符紧邻操作数，比如 `-x + 2` 表示先要给 `x`  取反，然后再加 `2` 。

在乘法操作中，`false` 被视作 **零**。

```jldoctest
julia> NaN * false
0.0

julia> false * Inf
0.0
```

这在已知某些量为零时，可以避免 `NaN` 的传播。详细的动机参见：[Knuth (1992)](https://arxiv.org/abs/math/9205211)。

## 位运算符

所有原始整数类型都支持以下[位运算符](https://en.wikipedia.org/wiki/Bitwise_operation#Bitwise_operators)：

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

每一个二元运算符和位运算符都可以给左操作数复合赋值：方法是把 `=` 直接放在二元运算符后面。比如，`x += 3` 等价于 `x = x + 3` 。

```jldoctest
julia> x = 1
1

julia> x += 3
4

julia> x
4
```

二元运算和位运算的复合赋值操作符有下面几种：

```
+=  -=  *=  /=  \=  ÷=  %=  ^=  &=  |=  ⊻=  >>>=  >>=  <<=
```

!!! note
    复合赋值后会把变量重新绑定到左操作数上，所以变量的类型可能会改变。

    ```jldoctest
    julia> x = 0x01; typeof(x)
    UInt8

    julia> x *= 2 # 与 x = x * 2 相同
    2

    julia> typeof(x)
    Int64
    ```

## [向量化 `dot` 运算符](@id man-dot-operators)

Julia 中，**每个**二元运算符都有一个 `dot` 运算符与之对应，例如 `^` 就有对应的 `.^` 存在。这个对应的 `.^` 被 Julia **自动地**定义为逐元素地执行 `^` 运算。比如 `[1,2,3] ^ 3` 是非法的，因为数学上没有给（长宽不一样的）数组的立方下过定义。但是 `[1,2,3] .^ 3` 在 Julia 里是合法的，它会逐元素地执行 `^` 运算（或称向量化运算），得到 `[1^3, 2^3, 3^3]`。类似地，`!` 或 `√` 这样的一元运算符，也都有一个对应的 `.√` 用于执行逐元素运算。

```jldoctest
julia> [1,2,3] .^ 3
3-element Array{Int64,1}:
  1
  8
 27
```

具体来说，`a .^ b` 被解析为 [`dot` 调用](@ref man-vectorized) `(^).(a,b)`，这会执行 [broadcast](@ref Broadcasting) 操作：该操作能结合数组和标量、相同大小的数组（元素之间的运算）、甚至不同形状的数组（例如行、列向量结合生成矩阵）。更进一步，就像所有向量化的 `dot` 调用一样，这些 `dot` 运算符是**融合**的（fused）。例如，在计算表达式 `2 .* A.^2 .+ sin.(A)` 时，Julia 只对 `A` 进行做**一次**循环，遍历 `A` 中的每个元素 a 并计算 `2a^2 + sin(a)`。上述表达式也可以用[`@.`](@ref @__dot__) 宏简写为 `@. 2A^2 + sin(A)`。特别的，类似 `f.(g.(x))` 的嵌套 `dot` 调用也是**融合**的，并且“相邻的”二元运算符表达式 `x .+ 3 .* x.^2` 可以等价转换为嵌套 `dot` 调用：`(+).(x, (*).(3, (^).(x, 2)))`。

除了 `dot` 运算符，我们还有 `dot` 复合赋值运算符，类似 `a .+= b`（或者 `@. a += b`）会被解析成 `a .= a .+ b`，这里的 `.=` 是一个**融合**的 in-place 运算，更多信息请查看 [`dot` 文档](@ref man-vectorized)）。

这个点语法，也能用在用户自定义的运算符上。例如，通过定义 `⊗(A,B) = kron(A,B)` 可以为 Kronecker 积（[`kron`](@ref)）提供一个方便的中缀语法 `A ⊗ B`，那么配合点语法 `[A,B] .⊗ [C,D]` 就等价于 `[A⊗C, B⊗D]`。

将点运算符用于数值字面量可能会导致歧义。例如，`1.+x` 到底是表示 `1. + x` 还是 `1 .+ x`？这会令人疑惑。因此不允许使用这种语法，遇到这种情况时，必须明确地用空格消除歧义。

## 数值比较

标准的比较操作对所有原始数值类型有定义：

| 操作符                     | 名称                     |
|:---------------------------- |:------------------------ |
| [`==`](@ref)                 | 相等                 |
| [`!=`](@ref), [`≠`](@ref !=) | 不等               |
| [`<`](@ref)                  | 小于                |
| [`<=`](@ref), [`≤`](@ref <=) | 小于等于    |
| [`>`](@ref)                  | 大于             |
| [`>=`](@ref), [`≥`](@ref >=) | 大于等于 |

下面是一些简单的例子：

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

整数的比较方式是标准的按位比较，而浮点数的比较方式则遵循 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754-2008)。

  * 有限数的大小顺序，和我们所熟知的相同。
  * `+0` 等于但不大于 `-0`.
  * `Inf` 等于自身，并且大于除了 `NaN` 外的所有数。
  * `-Inf` 等于自身，并且小于除了 `NaN` 外的所有数。
  * `NaN` 不等于、不小于且不大于任何数值，包括它自己。

`NaN` 不等于它自己这一点可能会令人感到惊奇，所以需要注意：

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

当你将 `NaN` 和 [数组](@ref man-multi-dim-arrays) 一起连用时，你就会感到头疼：

```jldoctest
julia> [1 NaN] == [1 NaN]
false
```

为此，Julia 给这些特别的数提供了下面几个额外的测试函数。这些函数在某些情况下很有用处，比如在做 hash 比较时。

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

有符号整数、无符号整数以及浮点数之间的混合类型比较是很棘手的。开发者费了很大精力来确保 Julia 在这个问题上做的是正确的。

对于其它类型，`isequal` 会默认调用 [`==`](@ref)，所以如果你想给自己的类型定义相等，那么就只需要为 [`==`](@ref) 增加一个方法。如果你想定义一个你自己的相等函数，你可能需要定义一个对应的 [`hash`](@ref) 方法，用于确保 `isequal(x,y)` 隐含着 `hash(x) == hash(y)`。

### 链式比较

与其他多数语言不同，就像 [notable exception of Python](https://en.wikipedia.org/wiki/Python_syntax_and_semantics#Comparison_operators) 一样，Julia 允许链式比较：

```jldoctest
julia> 1 < 2 <= 2 < 3 == 3 > 2 >= 1 == 1 < 3 != 5
true
```

链式比较在写数值代码时特别方便，它使用 `&&` 运算符比较标量，数组则用 [`&`](@ref) 进行按元素比较。比如，`0 .< A .< 1` 会得到一个 boolean 数组，如果 `A` 的元素都在 0 和 1 之间则数组元素就都是 true。

注意链式比较的执行顺序：

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

中间的表达式只会计算一次，而如果写成 `v(1) < v(2) && v(2) <= v(3)` 是计算了两次的。然而，链式比较中的顺序是不确定的。强烈建议不要在表达式中使用有副作用（比如 printing）的函数。如果的确需要，请使用短路运算符 `&&`（请参考[短路求值](@ref)）。

### 初等函数

Julia 提供了强大的数学函数和运算符集合。这些数学运算定义在各种合理的数值上，包括整型、浮点数、分数和复数，只要这些定义有数学意义就行。

而且，和其它 Julia 函数一样，这些函数也能通过 [点语法](@ref man-vectorized) `f.(A)` 以“向量化”的方式作用于数组和其它集合上。
比如，`sin.(A)` 会计算 `A` 中每个元素的 sin 值。

## 运算符的优先级与结合性

从高到低，Julia 运算符的优先级与结合性为：

| 分类       | 运算符                                                                                         | 结合性              |
|:-------------- |:------------------------------------------------------------------------------------------------- |:-------------------------- |
| 语法         | `.` followed by `::`                                                                              | 左结合                       |
| 幂运算 | `^`                                                                                               | 右结合                      |
| 一元运算符          | `+ - √`                                                                                           | 右结合[^1]                  |
| 移位运算      | `<< >> >>>`                                                                                       | 左结合                       |
| 除法      | `//`                                                                                              | 左结合                       |
| 乘法 | `* / % & \ ÷`                                                                                     | 左结合[^2]                   |
| 加法       | `+ - \| ⊻`                                                                                        | 左结合[^2]                   |
| 语法         | `: ..`                                                                                            | 左结合                       |
| 语法         | `\|>`                                                                                             | 左结合                       |
| 语法         | `<\|`                                                                                             | 右结合                      |
| 比较    | `> < >= <= == === != !== <:`                                                                      | 无结合性            |
| 流程控制   | `&&` followed by `\|\|` followed by `?`                                                           | 右结合                      |
| Pair 操作           | `=>`                                                                                              | 右结合                      |
| 赋值    | `= += -= *= /= //= \= ^= ÷= %= \|= &= ⊻= <<= >>= >>>=`                                            | 右结合                      |

[^1]:
    一元运算符 `+` 和 `-` 需要显式调用，即给它们的参数加上括号，以免和 `++` 等运算符混淆。其它一元运算符的混合使用都被解析为右结合的，比如 `√√-a` 解析为 `√(√(-a))`。
[^2]:
    The operators `+`, `++` and `*` are non-associative. `a + b + c` is parsed as `+(a, b, c)` not `+(+(a, b),
    c)`. However, the fallback methods for `+(a, b, c, d...)` and `*(a, b, c, d...)` both default to left-associative evaluation.

要看**全部** Julia 运算符的优先级关系，可以看这个文件的最上面部分：[`src/julia-parser.scm`](https://github.com/JuliaLang/julia/blob/master/src/julia-parser.scm)

[数字字面量系数](@ref man-numeric-literal-coefficients)，例如 `2x` 中的 2，它的优先级比二元运算符高，因此会当作乘法，并且它的优先级也比 `^` 高。

你也可以通过内置函数 `Base.operator_precedence` 查看任何给定运算符的优先级数值，数值越大优先级越高：

```jldoctest
julia> Base.operator_precedence(:+), Base.operator_precedence(:*), Base.operator_precedence(:.)
(11, 12, 17)

julia> Base.operator_precedence(:sin), Base.operator_precedence(:+=), Base.operator_precedence(:(=))  # (注意：等号前后必须有括号 `:(=)`)
(0, 1, 1)
```

另外，内置函数 `Base.operator_associativity` 可以返回运算符结合性的符号表示：

```jldoctest
julia> Base.operator_associativity(:-), Base.operator_associativity(:+), Base.operator_associativity(:^)
(:left, :none, :right)

julia> Base.operator_associativity(:⊗), Base.operator_associativity(:sin), Base.operator_associativity(:→)
(:left, :none, :right)
```

注意诸如 `:sin` 这样的符号返回优先级 `0`，此值代表无效的运算符或非最低优先级运算符。类似地，它们的结合性被认为是 `:none`。

## 数值转换

Julia 支持三种数值转换，它们在处理不精确转换上有所不同。

  *  `T(x)` 和 `convert(T,x)` 都会把 `x` 转换为 `T`类型。

      * 如果 `T` 是浮点类型，转换的结果就是最近的可表示值，
        可能会是正负无穷大。
      * 如果 `T` 为整数类型，当 `x` 不能由 `T` 类型表示时，会抛出 `InexactError`。
  * `x % T` 将整数 `x` 转换为整型 `T`，与 `x` 模 `2^n` 的结果一致，其中 `n` 是 `T` 的位数。换句话说，在二进制表示下被截掉了一部分。
     
     
  * [舍入函数](@ref) 接收一个 `T` 类型的可选参数。比如，`round(Int,x)`
    是 `Int(round(x))` 的简写版。

下面的例子展示了不同的形式

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
ERROR: InexactError: Int8(3.14)
Stacktrace:
[...]

julia> Int8(128.0)
ERROR: InexactError: Int8(128.0)
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

请参考[类型转换与类型提升](@ref conversion-and-promotion)一节来定义你自己的类型转换和提升规则。

### 舍入函数

| 函数              | 描述                      | 返回类型 |
|:--------------------- |:-------------------------------- |:----------- |
| [`round(x)`](@ref)    | `x` 舍到最接近的整数 | `typeof(x)` |
| [`round(T, x)`](@ref) | `x` 舍到最接近的整数 | `T`         |
| [`floor(x)`](@ref)    | `x` 向 `-Inf` 舍入         | `typeof(x)` |
| [`floor(T, x)`](@ref) | `x` 向 `-Inf` 舍入         | `T`         |
| [`ceil(x)`](@ref)     | `x` 向 `+Inf` 方向取整         | `typeof(x)` |
| [`ceil(T, x)`](@ref)  | `x` 向 `+Inf` 方向取整         | `T`         |
| [`trunc(x)`](@ref)    | `x` 向 0 取整           | `typeof(x)` |
| [`trunc(T, x)`](@ref) | `x` 向 0 取整           | `T`         |

### 除法函数

| 函数                  | 描述                                                                                               |
|:------------------------- |:--------------------------------------------------------------------------------------------------------- |
| [`div(x,y)`](@ref), `x÷y` | 截断除法；商向零近似                                                         |
| [`fld(x,y)`](@ref)        | 向下取整除法；商向 `-Inf` 近似                                                         |
| [`cld(x,y)`](@ref)        | 向上取整除法；商向 `+Inf` 近似                                                         |
| [`rem(x,y)`](@ref)        | 取余；满足 `x == div(x,y)*y + rem(x,y)`；符号与 `x` 一致                                       |
| [`mod(x,y)`](@ref)        | 取模；满足 `x == fld(x,y)*y + mod(x,y)`；符号与 `y` 一致                                         |
| [`mod1(x,y)`](@ref)       | 偏移 1 的 `mod`；若 `y>0`，则返回 `r∈(0,y]`，若 `y<0`，则 `r∈[y,0)` 且满足 `mod(r, y) == mod(x, y)`   |
| [`mod2pi(x)`](@ref)       | 以 2pi 为基取模；`0 <= mod2pi(x) < 2pi`                                                   |
| [`divrem(x,y)`](@ref)     | 返回 `(div(x,y),rem(x,y))`                                                                             |
| [`fldmod(x,y)`](@ref)     | 返回 `(fld(x,y),mod(x,y))`                                                                             |
| [`gcd(x,y...)`](@ref)     | `x`, `y`,... 的最大公约数                                                          |
| [`lcm(x,y...)`](@ref)     | `x`, `y`,... 的最小公倍数                                                            |

### 符号和绝对值函数

| 函数                | 描述                                                |
|:----------------------- |:---------------------------------------------------------- |
| [`abs(x)`](@ref)        | `x` 的模                 |
| [`abs2(x)`](@ref)       | `x` 的模的平方                               |
| [`sign(x)`](@ref)       | 表示 `x` 的符号，返回 -1，0，或 +1          |
| [`signbit(x)`](@ref)    | 表示符号位是 true 或 false |
| [`copysign(x,y)`](@ref) | 返回一个数，其值等于 `x` 的模，符号与 `y` 一致      |
| [`flipsign(x,y)`](@ref) | 返回一个数，其值等于 `x` 的模，符号与 `x*y` 一致    |

### 幂、对数与平方根

| 函数                 | 描述                                                                |
|:------------------------ |:-------------------------------------------------------------------------- |
| [`sqrt(x)`](@ref), `√x`  | `x` 的平方根                                                         |
| [`cbrt(x)`](@ref), `∛x`  | `x` 的立方根                                                           |
| [`hypot(x,y)`](@ref)     | 当直角边的长度为 `x` 和 `y`时，直角三角形斜边的长度 |
| [`exp(x)`](@ref)         | 自然指数函数在 `x` 处的值                                        |
| [`expm1(x)`](@ref)       | 当 `x` 接近 0 时的 `exp(x)-1` 的精确值                                      |
| [`ldexp(x,n)`](@ref)     | `x*2^n` 的高效算法，`n` 为整数                     |
| [`log(x)`](@ref)         | `x` 的自然对数                                                   |
| [`log(b,x)`](@ref)       | 以 `b` 为底 `x` 的对数                                                  |
| [`log2(x)`](@ref)        | 以 2 为底 `x` 的对数                                                    |
| [`log10(x)`](@ref)       | 以 10 为底 `x` 的对数                                                   |
| [`log1p(x)`](@ref)       | 当 `x`接近 0 时的 `log(1+x)` 的精确值                                      |
| [`exponent(x)`](@ref)    | `x` 的二进制指数                                                     |
| [`significand(x)`](@ref) | 浮点数 `x` 的二进制有效数（也就是尾数）        |

想大概了解一下为什么诸如 [`hypot`](@ref)、[`expm1`](@ref)和 [`log1p`](@ref)
函数是必要和有用的，可以看一下 John D. Cook 关于这些主题的两篇优秀博文：[expm1, log1p, erfc](https://www.johndcook.com/blog/2010/06/07/math-library-functions-that-seem-unnecessary/)，
和 [hypot](https://www.johndcook.com/blog/2010/06/02/whats-so-hard-about-finding-a-hypotenuse/)。

### 三角和双曲函数

所有标准的三角函数和双曲函数也都已经定义了：

```
sin    cos    tan    cot    sec    csc
sinh   cosh   tanh   coth   sech   csch
asin   acos   atan   acot   asec   acsc
asinh  acosh  atanh  acoth  asech  acsch
sinc   cosc
```

所有这些函数都是单参数函数，不过 [`atan`](@ref) 也可以接收两个参数
来表示传统的 [`atan2`](https://en.wikipedia.org/wiki/Atan2) 函数。

另外，[`sinpi(x)`](@ref) 和 [`cospi(x)`](@ref) 分别用来对 [`sin(pi*x)`](@ref) 和 [`cos(pi*x)`](@ref) 进行更精确的计算。

要计算角度而非弧度的三角函数，以 `d` 做后缀。
比如，[`sind(x)`](@ref) 计算 `x` 的 sine 值，其中 `x` 是一个角度值。
下面是角度变量的三角函数完整列表：

```
sind   cosd   tand   cotd   secd   cscd
asind  acosd  atand  acotd  asecd  acscd
```

### 特殊函数

[SpecialFunctions.jl](https://github.com/JuliaMath/SpecialFunctions.jl) 提供了许多其他的特殊数学函数。
