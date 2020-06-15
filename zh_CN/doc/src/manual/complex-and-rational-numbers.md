# 复数和有理数

Julia 语言包含了预定义的复数和有理数类型，并且支持它们的各种标准[数学运算和初等函数](@ref)。由于也定义了复数与分数的[类型转换与类型提升](@ref conversion-and-promotion)，因此对预定义数值类型（无论是原始的还是复合的）的任意组合进行的操作都会表现得如预期的一样。

## 复数

在Julia中,全局常量 [`im`](@ref) 被绑定到复数 *i*，表示 -1 的主平方根（不应使用数学家习惯的 `i` 或工程师习惯的 `j` 来表示此全局常量，因为它们是非常常用的索引变量名）。由于 Julia 允许数值字面量[作为系数与标识符并置](@ref man-numeric-literal-coefficients)，这种绑定就足够为复数提供很方便的语法，类似于传统的数学记法：

```jldoctest
julia> 1+2im
1 + 2im
```

你可以对复数进行各种标准算术操作：

```jldoctest
julia> (1 + 2im)*(2 - 3im)
8 + 1im

julia> (1 + 2im)/(1 - 2im)
-0.6 + 0.8im

julia> (1 + 2im) + (1 - 2im)
2 + 0im

julia> (-3 + 2im) - (5 - 1im)
-8 + 3im

julia> (-1 + 2im)^2
-3 - 4im

julia> (-1 + 2im)^2.5
2.729624464784009 - 6.9606644595719im

julia> (-1 + 2im)^(1 + 1im)
-0.27910381075826657 + 0.08708053414102428im

julia> 3(2 - 5im)
6 - 15im

julia> 3(2 - 5im)^2
-63 - 60im

julia> 3(2 - 5im)^-1.0
0.20689655172413796 + 0.5172413793103449im
```

类型提升机制也确保你可以使用不同类型的操作数的组合：

```jldoctest
julia> 2(1 - 1im)
2 - 2im

julia> (2 + 3im) - 1
1 + 3im

julia> (1 + 2im) + 0.5
1.5 + 2.0im

julia> (2 + 3im) - 0.5im
2.0 + 2.5im

julia> 0.75(1 + 2im)
0.75 + 1.5im

julia> (2 + 3im) / 2
1.0 + 1.5im

julia> (1 - 3im) / (2 + 2im)
-0.5 - 1.0im

julia> 2im^2
-2 + 0im

julia> 1 + 3/4im
1.0 - 0.75im
```

注意 `3/4im == 3/(4*im) == -(3/4*im)`，因为系数比除法的优先级更高。

Julia 提供了一些操作复数的标准函数：

```jldoctest
julia> z = 1 + 2im
1 + 2im

julia> real(1 + 2im) # z 的实部
1

julia> imag(1 + 2im) # z 的虚部
2

julia> conj(1 + 2im) # z 的复共轭
1 - 2im

julia> abs(1 + 2im) # z 的绝对值
2.23606797749979

julia> abs2(1 + 2im) # 取平方后的绝对值
5

julia> angle(1 + 2im) # 以弧度为单位的相位角
1.1071487177940904
```

按照惯例，复数的绝对值（[`abs`](@ref)）是从零点到它的距离。[`abs2`](@ref) 给出绝对值的平方，作用于复数上时非常有用，因为它避免了取平方根。[`angle`](@ref) 返回以弧度为单位的相位角（也被称为辐角函数）。所有其它的[初等函数](@ref)在复数上也都有完整的定义：

```jldoctest
julia> sqrt(1im)
0.7071067811865476 + 0.7071067811865475im

julia> sqrt(1 + 2im)
1.272019649514069 + 0.7861513777574233im

julia> cos(1 + 2im)
2.0327230070196656 - 3.0518977991518im

julia> exp(1 + 2im)
-1.1312043837568135 + 2.4717266720048188im

julia> sinh(1 + 2im)
-0.4890562590412937 + 1.4031192506220405im
```

注意数学函数通常应用于实数就返回实数值，应用于复数就返回复数值。例如，当 [`sqrt`](@ref) 应用于 `-1` 与 `-1 + 0im` 会有不同的表现，虽然 `-1 == -1 + 0im`：

```jldoctest
julia> sqrt(-1)
ERROR: DomainError with -1.0:
sqrt will only return a complex result if called with a complex argument. Try sqrt(Complex(x)).
Stacktrace:
[...]

julia> sqrt(-1 + 0im)
0.0 + 1.0im
```

从变量构建复数时，[文本型数值系数记法](@ref man-numeric-literal-coefficients)不再适用。相反地，乘法必须显式地写出：

```jldoctest
julia> a = 1; b = 2; a + b*im
1 + 2im
```

然而，我们**并不**推荐这样做，而应改为使用更高效的 [`complex`](@ref) 函数直接通过实部与虚部构建一个复数值：

```jldoctest
julia> a = 1; b = 2; complex(a, b)
1 + 2im
```

这种构建避免了乘法和加法操作。

[`Inf`](@ref) 和 [`NaN`](@ref) 可能出现在复数的实部和虚部，正如[特殊的浮点值](@ref)章节所描述的：

```jldoctest
julia> 1 + Inf*im
1.0 + Inf*im

julia> 1 + NaN*im
1.0 + NaN*im
```

## 有理数

Julia 有一个用于表示整数精确比值的分数类型。分数通过 [`//`](@ref) 运算符构建：

```jldoctest
julia> 2//3
2//3
```

如果一个分数的分子和分母含有公因子，它们会被约分到最简形式且分母非负：

```jldoctest
julia> 6//9
2//3

julia> -4//8
-1//2

julia> 5//-15
-1//3

julia> -4//-12
1//3
```

整数比值的这种标准化形式是唯一的，所以分数值的相等性可由校验分子与分母都相等来测试。分数值的标准化分子和分母可以使用 [`numerator`](@ref) 和 [`denominator`](@ref) 函数得到：


```jldoctest
julia> numerator(2//3)
2

julia> denominator(2//3)
3
```

分子和分母的直接比较通常是不必要的，因为标准算术和比较操作对分数值也有定义：

```jldoctest
julia> 2//3 == 6//9
true

julia> 2//3 == 9//27
false

julia> 3//7 < 1//2
true

julia> 3//4 > 2//3
true

julia> 2//4 + 1//6
2//3

julia> 5//12 - 1//4
1//6

julia> 5//8 * 3//12
5//32

julia> 6//5 / 10//7
21//25
```

分数可以很容易地转换成浮点数：

```jldoctest
julia> float(3//4)
0.75
```

对任意整数值 `a` 和 `b`（除了 `a == 0` 且 `b == 0` 时），从分数到浮点数的转换遵从以下的一致性：

```jldoctest
julia> a = 1; b = 2;

julia> isequal(float(a//b), a/b)
true
```

Julia接受构建无穷分数值：

```jldoctest
julia> 5//0
1//0

julia> -3//0
-1//0

julia> typeof(ans)
Rational{Int64}
```

但不接受试图构建一个 [`NaN`](@ref) 分数值：

```jldoctest
julia> 0//0
ERROR: ArgumentError: invalid rational: zero(Int64)//zero(Int64)
Stacktrace:
[...]
```

像往常一样，类型提升系统使得分数可以轻松地同其它数值类型进行交互：

```jldoctest
julia> 3//5 + 1
8//5

julia> 3//5 - 0.5
0.09999999999999998

julia> 2//7 * (1 + 2im)
2//7 + 4//7*im

julia> 2//7 * (1.5 + 2im)
0.42857142857142855 + 0.5714285714285714im

julia> 3//2 / (1 + 2im)
3//10 - 3//5*im

julia> 1//2 + 2im
1//2 + 2//1*im

julia> 1 + 2//3im
1//1 - 2//3*im

julia> 0.5 == 1//2
true

julia> 0.33 == 1//3
false

julia> 0.33 < 1//3
true

julia> 1//3 - 0.33
0.0033333333333332993
```
