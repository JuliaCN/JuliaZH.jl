# SHA


用法非常直接：
```julia
julia> using SHA

julia> bytes2hex(sha256("test"))
"9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
```

每个导出函数（SHA-1, SHA-2 224, 256, 384, 512, 以及 SHA-3 224, 256, 384, 512 函数在本文撰写时都已实现）都可以接受 `Array{UInt8}`, `ByteString` 或 `IO` 对象。这使计算文件校验和变得轻而易举：

```julia
shell> cat /tmp/test.txt
test
julia> using SHA

julia> open("/tmp/test.txt") do f
           sha2_256(f)
       end
32-element Array{UInt8,1}:
 0x9f
 0x86
 0xd0
 0x81
 0x88
 0x4c
 0x7d
 0x65
    ⋮
 0x5d
 0x6c
 0x15
 0xb0
 0xf0
 0x0a
 0x08
```

注意 `/tmp/text.txt` 文件结尾缺少换行符。Julia 会自动在 `julia>` 提示符前插入换行符。

由于 `sha256` 通常指的是 `sha2_256`，因此提供了函数名简写，将 `shaxxx()` 函数调用映射到 `sha2_xxx()`。SHA-3 不存在这样的俗称，用户必须使用完整的函数名 `sha3_xxx()`。

`shaxxx()` 接受 `UInt8` 类型的 `AbstractString` 和类数组对象（`NTuple` 和 `Array`）。

请注意，在本文撰写时，SHA-3 代码还未进行优化，因此会比 SHA-2 慢大约一个数量级。
