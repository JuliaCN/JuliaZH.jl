# SIMD 支持

`VecElement{T}`类型是为了构建SIMD运算符的库。实际使用中
要求使用 `llvmcall`。类型按下文定义：

```julia
struct VecElement{T}
    value::T
end
```

它有特别的编译规则：当`T`是初始位类型并且元组长度在集合{2-6,8-10,16}中，`VecElement{T}`的同态元组会映射到LLVM`vector`中。

在`-O3`处，编译器*可能*自动为这样的元组向量化运算符。例如
接下来的程序，当用`julia -O3`编译，在x86系统中会生成两个SIMD附加指令（`addps`）：

```julia
const m128 = NTuple{4,VecElement{Float32}}

function add(a::m128, b::m128)
    (VecElement(a[1].value+b[1].value),
     VecElement(a[2].value+b[2].value),
     VecElement(a[3].value+b[3].value),
     VecElement(a[4].value+b[4].value))
end

triple(c::m128) = add(add(c,c),c)

code_native(triple,(m128,))
```

然而，因为无法依靠自动向量化，未来将大量通过使用`llvmcall`的库来使用。
