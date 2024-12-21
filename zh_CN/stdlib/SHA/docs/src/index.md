# SHA

```@meta
DocTestSetup = quote
    using SHA
    using InteractiveUtils
end
```


## SHA functions

用法非常直接：
```jldoctest
julia> using SHA

julia> bytes2hex(sha256("test"))
"9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
```

Each exported function (at the time of this writing, SHA-1, SHA-2 224, 256, 384 and 512, and SHA-3 224, 256, 384 and 512 functions are implemented) takes in either an `AbstractVector{UInt8}`, an `AbstractString` or an `IO` object.  This makes it trivial to checksum a file:

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

### All SHA functions
Due to the colloquial usage of `sha256` to refer to `sha2_256`, convenience functions are provided, mapping `shaxxx()` function calls to `sha2_xxx()`.
For SHA-3, no such colloquialisms exist and the user must use the full `sha3_xxx()` names.

`shaxxx()` takes `AbstractString` and array-like objects (`NTuple` and `Array`) with elements of type `UInt8`.

**SHA-1**
```@docs
sha1
```

**SHA-2**
```@docs
sha224
sha256
sha384
sha512
sha2_224
sha2_256
sha2_384
sha2_512
```

**SHA-3**
```@docs
sha3_224
sha3_256
sha3_384
sha3_512
```


## Working with context

To create a hash from multiple items the `SHAX_XXX_CTX()` types can be used to create a stateful hash object that
is updated with `update!` and finalized with `digest!`

```jldoctest
julia> using SHA

julia> ctx = SHA2_256_CTX()
SHA2 256-bit hash state

julia> update!(ctx, b"some data")
0x0000000000000009

julia> update!(ctx, b"some more data")
0x0000000000000017

julia> digest!(ctx)
32-element Vector{UInt8}:
 0xbe
 0xcf
 0x23
 0xda
 0xaf
 0x02
 0xf7
 0xa3
 0x57
 0x92
    ⋮
 0x89
 0x4f
 0x59
 0xd8
 0xb3
 0xb4
 0x81
 0x8b
 0xc5
```

Note that, at the time of this writing, the SHA3 code is not optimized, and as such is roughly an order of magnitude slower than SHA2.

```@docs
update!
digest!
```

### All SHA context types

**SHA-1**
```@docs
SHA1_CTX
```

**SHA-2**

Convenience types are also provided, where `SHAXXX_CTX` is a type alias for `SHA2_XXX_CTX`.
```@docs
SHA224_CTX
SHA256_CTX
SHA384_CTX
SHA512_CTX
SHA2_224_CTX
SHA2_256_CTX
SHA2_384_CTX
SHA2_512_CTX
```

**SHA-3**
```@docs
SHA3_224_CTX
SHA3_256_CTX
SHA3_384_CTX
SHA3_512_CTX
```


## HMAC functions

```jldoctest
julia> using SHA

julia> key = collect(codeunits("key_string"))
10-element Vector{UInt8}:
 0x6b
 0x65
 0x79
 0x5f
 0x73
 0x74
 0x72
 0x69
 0x6e
 0x67

julia> bytes2hex(hmac_sha3_256(key, "test-message"))
"bc49a6f2aa29b27ee5ed1e944edd7f3d153e8a01535d98b5e24dac9a589a6248"
```

To create a hash from multiple items, the `HMAC_CTX()` types can be used to create a stateful hash object that
is updated with `update!` and finalized with `digest!`.

```jldoctest
julia> using SHA

julia> key = collect(codeunits("key_string"))
10-element Vector{UInt8}:
 0x6b
 0x65
 0x79
 0x5f
 0x73
 0x74
 0x72
 0x69
 0x6e
 0x67

julia> ctx = HMAC_CTX(SHA3_256_CTX(), key);

julia> update!(ctx, b"test-")
0x0000000000000000000000000000008d

julia> update!(ctx, b"message")
0x00000000000000000000000000000094

julia> bytes2hex(digest!(ctx))
"bc49a6f2aa29b27ee5ed1e944edd7f3d153e8a01535d98b5e24dac9a589a6248"
```

### All HMAC functions

**HMAC context type**
```@docs
HMAC_CTX
```

**SHA-1**
```@docs
hmac_sha1
```

**SHA-2**
```@docs
hmac_sha224
hmac_sha256
hmac_sha384
hmac_sha512
hmac_sha2_224
hmac_sha2_256
hmac_sha2_384
hmac_sha2_512
```

**SHA-3**
```@docs
hmac_sha3_224
hmac_sha3_256
hmac_sha3_384
hmac_sha3_512
```
