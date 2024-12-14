# 数学相关

## [数学运算符](@id math-ops)

```@docs
Base.:-(::Any)
Base.:(+)
Base.:-(::Any, ::Any)
Base.:*(::Any, ::Any...)
Base.:(/)
Base.:\(::Any, ::Any)
Base.:^(::Number, ::Number)
Base.fma
Base.muladd
Base.inv(::Number)
Base.div
Base.fld
Base.cld
Base.mod
Base.rem
Base.rem2pi
Base.Math.mod2pi
Base.divrem
Base.fldmod
Base.fld1
Base.mod1
Base.fldmod1
Base.:(//)
Base.rationalize
Base.numerator
Base.denominator
Base.:(<<)
Base.:(>>)
Base.:(>>>)
Base.bitrotate
Base.:(:)
Base.range
Base.OneTo
Base.StepRangeLen
Base.:(==)
Base.:(!=)
Base.:(!==)
Base.:(<)
Base.:(<=)
Base.:(>)
Base.:(>=)
Base.cmp
Base.:(~)
Base.:(&)
Base.:(|)
Base.xor
Base.nand
Base.nor
Base.:(!)
&&
||
```

## 数学函数

```@docs
Base.isapprox
Base.sin(::Number)
Base.cos(::Number)
Base.sincos(::Float64)
Base.tan(::Number)
Base.Math.sind
Base.Math.cosd
Base.Math.tand
Base.Math.sincosd
Base.Math.sinpi
Base.Math.cospi
Base.Math.tanpi
Base.Math.sincospi
Base.sinh(::Number)
Base.cosh(::Number)
Base.tanh(::Number)
Base.asin(::Number)
Base.acos(::Number)
Base.atan(::Number)
Base.Math.asind
Base.Math.acosd
Base.Math.atand
Base.Math.sec(::Number)
Base.Math.csc(::Number)
Base.Math.cot(::Number)
Base.Math.secd
Base.Math.cscd
Base.Math.cotd
Base.Math.asec(::Number)
Base.Math.acsc(::Number)
Base.Math.acot(::Number)
Base.Math.asecd
Base.Math.acscd
Base.Math.acotd
Base.Math.sech(::Number)
Base.Math.csch(::Number)
Base.Math.coth(::Number)
Base.asinh(::Number)
Base.acosh(::Number)
Base.atanh(::Number)
Base.Math.asech(::Number)
Base.Math.acsch(::Number)
Base.Math.acoth(::Number)
Base.Math.sinc
Base.Math.cosc
Base.Math.deg2rad
Base.Math.rad2deg
Base.Math.hypot
Base.log(::Number)
Base.log(::Number, ::Number)
Base.log2
Base.log10
Base.log1p
Base.Math.frexp
Base.exp(::Float64)
Base.exp2
Base.exp10
Base.Math.ldexp
Base.Math.modf
Base.expm1
Base.round(::Type, ::Any)
Base.Rounding.RoundingMode
Base.Rounding.RoundNearest
Base.Rounding.RoundNearestTiesAway
Base.Rounding.RoundNearestTiesUp
Base.Rounding.RoundToZero
Base.Rounding.RoundFromZero
Base.Rounding.RoundUp
Base.Rounding.RoundDown
Base.round(::Complex{<: AbstractFloat}, ::RoundingMode, ::RoundingMode)
Base.ceil
Base.floor
Base.trunc
Base.unsafe_trunc
Base.min
Base.max
Base.minmax
Base.Math.clamp
Base.Math.clamp!
Base.abs
Base.Checked.checked_abs
Base.Checked.checked_neg
Base.Checked.checked_add
Base.Checked.checked_sub
Base.Checked.checked_mul
Base.Checked.checked_div
Base.Checked.checked_rem
Base.Checked.checked_fld
Base.Checked.checked_mod
Base.Checked.checked_cld
Base.Checked.add_with_overflow
Base.Checked.sub_with_overflow
Base.Checked.mul_with_overflow
Base.abs2
Base.copysign
Base.sign
Base.signbit
Base.flipsign
Base.sqrt(::Number)
Base.isqrt
Base.Math.cbrt
Base.real
Base.imag
Base.reim
Base.conj
Base.angle
Base.cis
Base.cispi
Base.binomial
Base.factorial
Base.gcd
Base.lcm
Base.gcdx
Base.ispow2
Base.nextpow
Base.prevpow
Base.nextprod
Base.invmod
Base.powermod
Base.ndigits
Base.add_sum
Base.widemul
Base.Math.evalpoly
Base.Math.@evalpoly
Base.FastMath.@fastmath
```

## 自定义二元运算符

某些 unicode 字符可用于定义新的支持中缀表示法的二元运算符。
例如，
```⊗(x,y) = kron(x,y)```
定义 `⊗` (otimes) 为 Kronecker 积，
并且可以通过中缀语法将它作为一个二元运算符调用：
```C = A ⊗ B```
也可以使用常用的前缀语法
```C = ⊗(A,B)```。

其他支持这种扩展的字符包括
\odot `⊙`
和
\oplus `⊕`

The complete list is in the parser code:
<https://github.com/JuliaLang/julia/blob/master/src/julia-parser.scm>

像 `*` 一样解析的包括（按优先级排列）
`* / ÷ % & ⋅ ∘ × |\\| ∩ ∧ ⊗ ⊘ ⊙ ⊚ ⊛ ⊠ ⊡ ⊓ ∗ ∙ ∤ ⅋ ≀ ⊼ ⋄ ⋆ ⋇ ⋉ ⋊ ⋋ ⋌ ⋏ ⋒ ⟑ ⦸ ⦼ ⦾ ⦿ ⧶ ⧷ ⨇ ⨰ ⨱ ⨲ ⨳ ⨴ ⨵ ⨶ ⨷ ⨸ ⨻ ⨼ ⨽ ⩀ ⩃ ⩄ ⩋ ⩍ ⩎ ⩑ ⩓ ⩕ ⩘ ⩚ ⩜ ⩞ ⩟ ⩠ ⫛ ⊍ ▷ ⨝ ⟕ ⟖ ⟗`
像 `+` 一样解析的包括
`+ - |\|| ⊕ ⊖ ⊞ ⊟ |++| ∪ ∨ ⊔ ± ∓ ∔ ∸ ≏ ⊎ ⊻ ⊽ ⋎ ⋓ ⟇ ⧺ ⧻ ⨈ ⨢ ⨣ ⨤ ⨥ ⨦ ⨧ ⨨ ⨩ ⨪ ⨫ ⨬ ⨭ ⨮ ⨹ ⨺ ⩁ ⩂ ⩅ ⩊ ⩌ ⩏ ⩐ ⩒ ⩔ ⩖ ⩗ ⩛ ⩝ ⩡ ⩢ ⩣`
还有许多其他的与箭头、比较和幂相关的符号。
