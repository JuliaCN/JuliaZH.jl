# [Numbers](@id lib-numbers)

## 标准数值类型

### 抽象数值类型

```@docs
Core.Number
Core.Real
Core.AbstractFloat
Core.Integer
Core.Signed
Core.Unsigned
Base.AbstractIrrational
```

### 具象数值类型

```@docs
Core.Float16
Core.Float32
Core.Float64
Base.BigFloat
Core.Bool
Core.Int8
Core.UInt8
Core.Int16
Core.UInt16
Core.Int32
Core.UInt32
Core.Int64
Core.UInt64
Core.Int128
Core.UInt128
Base.BigInt
Base.Complex
Base.Rational
Base.Irrational
```

## 数据格式

```@docs
Base.digits
Base.digits!
Base.bitstring
Base.parse
Base.tryparse
Base.big
Base.signed
Base.unsigned
Base.float(::Any)
Base.Math.significand
Base.Math.exponent
Base.complex(::Complex)
Base.bswap
Base.hex2bytes
Base.hex2bytes!
Base.bytes2hex
```

## 常用数值函数和常量

```@docs
Base.one
Base.oneunit
Base.zero
Base.im
Base.MathConstants.pi
Base.MathConstants.ℯ
Base.MathConstants.catalan
Base.MathConstants.eulergamma
Base.MathConstants.golden
Base.Inf
Base.Inf32
Base.Inf16
Base.NaN
Base.NaN32
Base.NaN16
Base.issubnormal
Base.isfinite
Base.isinf
Base.isnan
Base.iszero
Base.isone
Base.nextfloat
Base.prevfloat
Base.isinteger
Base.isreal
Core.Float32(::Any)
Core.Float64(::Any)
Base.Rounding.rounding
Base.Rounding.setrounding(::Type, ::Any)
Base.Rounding.setrounding(::Function, ::Type, ::RoundingMode)
Base.Rounding.get_zero_subnormals
Base.Rounding.set_zero_subnormals
```

### 整型

```@docs
Base.count_ones
Base.count_zeros
Base.leading_zeros
Base.leading_ones
Base.trailing_zeros
Base.trailing_ones
Base.isodd
Base.iseven
Base.@int128_str
Base.@uint128_str
```

## BigFloats and BigInts

The [`BigFloat`](@ref) and [`BigInt`](@ref) types implements
arbitrary-precision floating point and integer arithmetic, respectively. For
[`BigFloat`](@ref) the [GNU MPFR library](https://www.mpfr.org/) is used,
and for [`BigInt`](@ref) the [GNU Multiple Precision Arithmetic Library (GMP)]
(https://gmplib.org) is used.

```@docs
Base.MPFR.BigFloat(::Any, rounding::RoundingMode)
Base.precision
Base.MPFR.precision(::Type{BigFloat})
Base.MPFR.setprecision
Base.GMP.BigInt(::Any)
Base.@big_str
```
