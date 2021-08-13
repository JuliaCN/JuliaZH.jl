# 调用 C 和 Fortran 代码

在数值计算领域，尽管有很多用 C 语言或 Fortran 写的高质量且成熟的库都可以用 Julia 重写，但为了便捷利用现有的 C 或 Fortran 代码，Julia 提供简洁且高效的调用方式。Julia 的哲学是 `no boilerplate`：
Julia 可以直接调用 C/Fortran 的函数，不需要任何"胶水"代码，代码生成或其它编译过程 -- 即使在交互式会话 (REPL/Jupyter notebook) 中使用也一样. 在 Julia 中，上述特性可以仅仅通过调用 [`ccall`](@ref) 实现，它的语法看起来就像是普通的函数调用。

The code to be called must be available as a shared library. Most C and Fortran libraries ship
compiled as shared libraries already, but if you are compiling the code yourself using GCC (or
Clang), you will need to use the `-shared` and `-fPIC` options. The machine instructions generated
by Julia's JIT are the same as a native C call would be, so the resulting overhead is the same
as calling a library function from C code. [^1]

Shared libraries and functions are referenced by a tuple of the form `(:function, "library")`
or `("function", "library")` where `function` is the C-exported function name, and `library` refers
to the shared library name.  Shared libraries available in the (platform-specific) load path will
be resolved by name.  The full path to the library may also be specified.

可以单独使用函数名来代替元组（只用 `:function` 或 `"function"`）。在这种情况下，函数名在当前进程中进行解析。这一调用形式可用于调用 C 库函数、Julia 运行时中的函数或链接到 Julia 的应用程序中的函数。

默认情况下，Fortran 编译器会[进行名称修饰](https://en.wikipedia.org/wiki/Name_mangling#Fortran)（例如，将函数名转换为小写或大写，通常会添加下划线），要通过 [`ccall`](@ref) 调用 Fortran 函数，传递的标识符必须与 Fortran 编译器名称修饰之后的一致。此外，在调用 Fortran 函数时，**所有**输入必须以指针形式传递，并已在堆或栈上分配内存。这不仅适用于通常是堆分配的数组及可变对象，而且适用于整数和浮点数等标量值，尽管这些值通常是栈分配的，且在使用 C 或 Julia 调用约定时通常是通过寄存器传递的。

Finally, you can use [`ccall`](@ref) to actually generate a call to the library function. The arguments
to [`ccall`](@ref) are:

1. A `(:function, "library")` pair (most common),

   或

   a `:function` name symbol or `"function"` name string (for symbols in the current process or libc),

   或

   一个函数指针（例如，从 `dlsym` 获得的指针）。

2. 函数的返回值类型

3. A tuple of input types, corresponding to the function signature

4. The actual argument values to be passed to the function, if any; each is a separate parameter.

!!! note
    The `(:function, "library")` pair, return type, and input types must be literal constants
    (i.e., they can't be variables, but see [Non-constant Function Specifications](@ref) below).

    The remaining parameters are evaluated at compile time, when the containing method is defined.

!!! note
    See below for how to [map C types to Julia types](@ref mapping-c-types-to-julia).

As a complete but simple example, the following calls the `clock` function from the standard C
library on most Unix-derived systems:

```julia-repl
julia> t = ccall(:clock, Int32, ())
2292761

julia> t
2292761

julia> typeof(t)
Int32
```

`clock` takes no arguments and returns an [`Int32`](@ref). One common mistake is forgetting that a 1-tuple of
argument types must be written with a trailing comma. For example, to call the `getenv` function
to get a pointer to the value of an environment variable, one makes a call like this:

```julia-repl
julia> path = ccall(:getenv, Cstring, (Cstring,), "SHELL")
Cstring(@0x00007fff5fbffc45)

julia> unsafe_string(path)
"/bin/bash"
```

Note that the argument type tuple must be written as `(Cstring,)`, not `(Cstring)`. This
is because `(Cstring)` is just the expression `Cstring` surrounded by parentheses, rather than
a 1-tuple containing `Cstring`:

```jldoctest
julia> (Cstring)
Cstring

julia> (Cstring,)
(Cstring,)
```

In practice, especially when providing reusable functionality, one generally wraps [`ccall`](@ref)
uses in Julia functions that set up arguments and then check for errors in whatever manner the
C or Fortran function specifies. And if an error occurs it is thrown as a normal Julia exception. This is especially
important since C and Fortran APIs are notoriously inconsistent about how they indicate error
conditions. For example, the `getenv` C library function is wrapped in the following Julia function,
which is a simplified version of the actual definition from [`env.jl`](https://github.com/JuliaLang/julia/blob/master/base/env.jl):

```julia
function getenv(var::AbstractString)
    val = ccall(:getenv, Cstring, (Cstring,), var)
    if val == C_NULL
        error("getenv: undefined variable: ", var)
    end
    return unsafe_string(val)
end
```

C 函数 `getenv` 通过返回 `NULL` 的方式进行报错，但是其他 C 标准库函数也会通过多种不同的方式来报错，这包括返回 -1，0，1 以及其它特殊值。此封装能够明确地抛出异常信息，即是否调用者在尝试获取一个不存在的环境变量：

```julia-repl
julia> getenv("SHELL")
"/bin/bash"

julia> getenv("FOOBAR")
getenv: undefined variable: FOOBAR
```

Here is a slightly more complex example that discovers the local machine's hostname.
In this example, the networking library code is assumed to be in a shared library named "libc".
In practice, this function is usually part of the C standard library, and so the "libc"
portion should be omitted, but we wish to show here the usage of this syntax.

```julia
function gethostname()
    hostname = Vector{UInt8}(undef, 256) # MAXHOSTNAMELEN
    err = ccall((:gethostname, "libc"), Int32,
                (Ptr{UInt8}, Csize_t),
                hostname, sizeof(hostname))
    Base.systemerror("gethostname", err != 0)
    hostname[end] = 0 # ensure null-termination
    return GC.@preserve hostname unsafe_string(pointer(hostname))
end
```

This example first allocates an array of bytes. It then calls the C library function `gethostname`
to populate the array with the hostname. Finally, it takes a pointer to the hostname buffer, and
converts the pointer to a Julia string, assuming that it is a NUL-terminated C string.

It is common for C libraries to use this pattern of requiring the caller to allocate memory to be
passed to the callee and populated. Allocation of memory from Julia like this is generally
accomplished by creating an uninitialized array and passing a pointer to its data to the C function.
This is why we don't use the `Cstring` type here: as the array is uninitialized, it could contain
NUL bytes. Converting to a `Cstring` as part of the [`ccall`](@ref) checks for contained NUL bytes
and could therefore throw a conversion error.

Dereferencing `pointer(hostname)` with `unsafe_string` is an unsafe operation as it requires access to
the memory allocated for `hostname` that may have been in the meanwhile garbage collected. The macro
[`GC.@preserve`](@ref) prevents this from happening and therefore accessing an invalid memory location.

## 创建和C兼容的Julia函数指针

可以将Julia函数传递给接受函数指针参数的原生C函数。例如，要匹配满足下面的C原型：

```c
typedef returntype (*functiontype)(argumenttype, ...)
```

The macro [`@cfunction`](@ref) generates the C-compatible function pointer for a call to a
Julia function. The arguments to [`@cfunction`](@ref) are:

1. A Julia function
2. 函数的返回值类型
3. A tuple of input types, corresponding to the function signature

!!! note
    As with `ccall`, the return type and tuple of input types must be literal constants.

!!! note
    Currently, only the platform-default C calling convention is supported. This means that
    `@cfunction`-generated pointers cannot be used in calls where WINAPI expects a `stdcall`
    function on 32-bit Windows, but can be used on WIN64 (where `stdcall` is unified with the
    C calling convention).

一个典型的例子就是标准C库函数`qsort`，定义为：

```c
void qsort(void *base, size_t nmemb, size_t size,
           int (*compare)(const void*, const void*));
```

The `base` argument is a pointer to an array of length `nmemb`, with elements of `size` bytes
each. `compare` is a callback function which takes pointers to two elements `a` and `b` and returns
an integer less/greater than zero if `a` should appear before/after `b` (or zero if any order
is permitted).

Now, suppose that we have a 1-d array `A` of values in Julia that we want to sort
using the `qsort` function (rather than Julia's built-in `sort` function). Before we consider
calling `qsort` and passing arguments, we need to write a comparison function:

```jldoctest mycompare
julia> function mycompare(a, b)::Cint
           return (a < b) ? -1 : ((a > b) ? +1 : 0)
       end
mycompare (generic function with 1 method)
```

`qsort` expects a comparison function that return a C `int`, so we annotate the return type
to be `Cint`.

In order to pass this function to C, we obtain its address using the macro `@cfunction`:

```jldoctest mycompare
julia> mycompare_c = @cfunction(mycompare, Cint, (Ref{Cdouble}, Ref{Cdouble}));
```

[`@cfunction`](@ref) 需要三个参数: Julia函数 (`mycompare`), 返回值类型(`Cint`), 和一个输入参数类型的值元组, 此处是要排序的`Cdouble`([`Float64`](@ref)) 元素的数组.

`qsort`的最终调用看起来是这样的：

```jldoctest mycompare
julia> A = [1.3, -2.7, 4.4, 3.1]
4-element Vector{Float64}:
  1.3
 -2.7
  4.4
  3.1

julia> ccall(:qsort, Cvoid, (Ptr{Cdouble}, Csize_t, Csize_t, Ptr{Cvoid}),
             A, length(A), sizeof(eltype(A)), mycompare_c)

julia> A
4-element Vector{Float64}:
 -2.7
  1.3
  3.1
  4.4
```

As the example shows, the original Julia array `A` has now been sorted: `[-2.7, 1.3, 3.1, 4.4]`. Note that Julia
[takes care of converting the array to a `Ptr{Cdouble}`](@ref automatic-type-conversion)), computing
the size of the element type in bytes, and so on.

For fun, try inserting a `println("mycompare($a, $b)")` line into `mycompare`, which will allow
you to see the comparisons that `qsort` is performing (and to verify that it is really calling
the Julia function that you passed to it).

## [Mapping C Types to Julia](@id mapping-c-types-to-julia)

It is critical to exactly match the declared C type with its declaration in Julia. Inconsistencies
can cause code that works correctly on one system to fail or produce indeterminate results on
a different system.

Note that no C header files are used anywhere in the process of calling C functions: you are responsible
for making sure that your Julia types and call signatures accurately reflect those in the C header
file.[^2]

### [Automatic Type Conversion](@id automatic-type-conversion)

Julia automatically inserts calls to the [`Base.cconvert`](@ref) function to convert each argument
to the specified type. For example, the following call:

```julia
ccall((:foo, "libfoo"), Cvoid, (Int32, Float64), x, y)
```

will behave as if it were written like this:

```julia
ccall((:foo, "libfoo"), Cvoid, (Int32, Float64),
      Base.unsafe_convert(Int32, Base.cconvert(Int32, x)),
      Base.unsafe_convert(Float64, Base.cconvert(Float64, y)))
```

[`Base.cconvert`](@ref) normally just calls [`convert`](@ref), but can be defined to return an
arbitrary new object more appropriate for passing to C.
This should be used to perform all allocations of memory that will be accessed by the C code.
For example, this is used to convert an `Array` of objects (e.g. strings) to an array of pointers.

[`Base.unsafe_convert`](@ref) handles conversion to [`Ptr`](@ref) types. It is considered unsafe because
converting an object to a native pointer can hide the object from the garbage collector, causing
it to be freed prematurely.

### Type Correspondences

First, let's review some relevant Julia type terminology:

| 语法 / 关键字              | 例子                                     | 描述                                                                                                                                                                                                                                                                    |
|:----------------------------- |:------------------------------------------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mutable struct`              | `BitSet`                                    | `Leaf Type`：包含 `type-tag` 的一组相关数据，由 Julia GC 管理，通过 `object-identity` 来定义。为了保证实例可以被构造，`Leaf Type` 必须是完整定义的，即不允许使用 `TypeVars`。              |
| `abstract type`               | `Any`, `AbstractArray{T, N}`, `Complex{T}`  | `Super Type`：用于描述一组类型，它不是 `Leaf-Type`，也无法被实例化。                                                                                                                                                      |
| `T{A}`                        | `Vector{Int}`                               | `Type Parameter`：某种类型的一种具体化，通常用于分派或存储优化。                                                                                                                                                                          |
|                               |                                             | `TypeVar`：`Type parameter` 声明中的 `T` 是一个 `TypeVar`，它是类型变量的简称。                                                                                                                                                                  |
| `primitive type`              | `Int`, `Float64`                            | `Primitive Type`：一种没有成员变量的类型，但是它有大小。It is stored and defined by-value.                                                                                                                                                                                           |
| `struct`                      | `Pair{Int, Int}`                            | "Struct" :: A type with all fields defined to be constant. It is defined by-value, and may be stored with a type-tag.                                                                                                                                                       |
|                               | `ComplexF64` (`isbits`)                     | "Is-Bits"   :: A `primitive type`, or a `struct` type where all fields are other `isbits` types. It is defined by-value, and is stored without a type-tag.                                                                                                                       |
| `struct ...; end`             | `nothing`                                   | `Singleton`：没有成员变量的 `Leaf Type` 或 `Struct`。                                                                                                                                                                                                                        |
| `(...)` or `tuple(...)`       | `(1, 2, 3)`                                 | "Tuple" :: an immutable data-structure similar to an anonymous struct type, or a constant array. Represented as either an array or a struct.                                                                                                                                |

### [Bits Types](@id man-bits-types)

There are several special types to be aware of, as no other type can be defined to behave the
same:

  * `Float32`

    和C语言中的 `float` 类型完全对应（以及Fortran中的 `REAL*4` ）

  * `Float64`

    和C语言中的 `double` 类型完全对应（以及Fortran中的 `REAL*8` ）

  * `ComplexF32`

    和C语言中的 `complex float` 类型完全对应（以及Fortran中的 `COMPLEX*8` ）

  * `ComplexF64`

    和C语言中的 `complex double` 类型完全对应（以及Fortran中的 `COMPLEX*16` ）

  * `Signed`

    和C语言中的 `signed` 类型标识完全对应（以及Fortran中的任意 `INTEGER` 类型）
    Julia中任何不是[`Signed`](@ref) 的子类型的类型，都会被认为是unsigned类型。


  * `Ref{T}`

    和 `Ptr{T}` 行为相同，能通过Julia的GC管理其内存。


  * `Array{T,N}`

    When an array is passed to C as a `Ptr{T}` argument, it is not reinterpret-cast: Julia requires
    that the element type of the array matches `T`, and the address of the first element is passed.

    因此，如果一个 `Array` 中的数据格式不正确，它必须被显式地转换
    ，通过类似 `trunc(Int32, a)` 的函数。

    若要将一个数组 `A` 以不同类型的指针传递，而*不提前转换数据*，
    （比如，将一个 `Float64` 数组传给一个处理原生字节的函数时），你
    可以将这一参数声明为 `Ptr{Cvoid}` 。

    如果一个元素类型为 `Ptr{T}` 的数组作为 `Ptr{Ptr{T}}` 类型的参数传递， [`Base.cconvert`](@ref) 
    将会首先尝试进行 null-terminated copy（即直到下一个元素为null才停止复制），并将每一个元素使用其通过 [`Base.cconvert`](@ref) 转换后的版本替换。
    这允许，比如，将一个 `argv` 的指针数组，其类型为
    `Vector{String}` ，传递给一个类型为 `Ptr{Ptr{Cchar}}` 的参数。

On all systems we currently support, basic C/C++ value types may be translated to Julia types
as follows. Every C type also has a corresponding Julia type with the same name, prefixed by C.
This can help when writing portable code (and remembering that an `int` in C is not the same as
an `Int` in Julia).


**System Independent Types**

| C 类型                                                  | Fortran 类型             | 标准 Julia 别名 | Julia 基本类型                                                                                                |
|:------------------------------------------------------- |:------------------------ |:-------------------- |:-------------------------------------------------------------------------------------------------------------- |
| `unsigned char`                                         | `CHARACTER`              | `Cuchar`             | `UInt8`                                                                                                        |
| `bool` (_Bool in C99+)                                  |                          | `Cuchar`             | `UInt8`                                                                                                        |
| `short`                                                 | `INTEGER*2`, `LOGICAL*2` | `Cshort`             | `Int16`                                                                                                        |
| `unsigned short`                                        |                          | `Cushort`            | `UInt16`                                                                                                       |
| `int`, `BOOL` (C, typical)                              | `INTEGER*4`, `LOGICAL*4` | `Cint`               | `Int32`                                                                                                        |
| `unsigned int`                                          |                          | `Cuint`              | `UInt32`                                                                                                       |
| `long long`                                             | `INTEGER*8`, `LOGICAL*8` | `Clonglong`          | `Int64`                                                                                                        |
| `unsigned long long`                                    |                          | `Culonglong`         | `UInt64`                                                                                                       |
| `intmax_t`                                              |                          | `Cintmax_t`          | `Int64`                                                                                                        |
| `uintmax_t`                                             |                          | `Cuintmax_t`         | `UInt64`                                                                                                       |
| `float`                                                 | `REAL*4i`                | `Cfloat`             | `Float32`                                                                                                      |
| `double`                                                | `REAL*8`                 | `Cdouble`            | `Float64`                                                                                                      |
| `complex float`                                         | `COMPLEX*8`              | `ComplexF32`         | `Complex{Float32}`                                                                                             |
| `complex double`                                        | `COMPLEX*16`             | `ComplexF64`         | `Complex{Float64}`                                                                                             |
| `ptrdiff_t`                                             |                          | `Cptrdiff_t`         | `Int`                                                                                                          |
| `ssize_t`                                               |                          | `Cssize_t`           | `Int`                                                                                                          |
| `size_t`                                                |                          | `Csize_t`            | `UInt`                                                                                                         |
| `void`                                                  |                          |                      | `Cvoid`                                                                                                        |
| `void` and `[[noreturn]]` or `_Noreturn`                |                          |                      | `Union{}`                                                                                                      |
| `void*`                                                 |                          |                      | `Ptr{Cvoid}` (or similarly `Ref{Cvoid}`)                                                                       |
| `T*` (where T represents an appropriately defined type) |                          |                      | `Ref{T}` (T may be safely mutated only if T is an isbits type)                                                 |
| `char*` (or `char[]`, e.g. a string)                    | `CHARACTER*N`            |                      | `Cstring` if NUL-terminated, or `Ptr{UInt8}` if not                                                            |
| `char**` (or `*char[]`)                                 |                          |                      | `Ptr{Ptr{UInt8}}`                                                                                              |
| `jl_value_t*` (any Julia Type)                          |                          |                      | `Any`                                                                                                          |
| `jl_value_t* const*` (a reference to a Julia value)     |                          |                      | `Ref{Any}` (const, since mutation would require a write barrier, which is not possible to insert correctly)    |
| `va_arg`                                                |                          |                      | Not supported                                                                                                  |
| `...` (variadic function specification)                 |                          |                      | `T...` (where `T` is one of the above types, when using the `ccall` function)                                  |
| `...` (variadic function specification)                 |                          |                      | `; va_arg1::T, va_arg2::S, etc.` (only supported with `@ccall` macro)                                          |

The [`Cstring`](@ref) type is essentially a synonym for `Ptr{UInt8}`, except the conversion to `Cstring`
throws an error if the Julia string contains any embedded NUL characters (which would cause the
string to be silently truncated if the C routine treats NUL as the terminator).  If you are passing
a `char*` to a C routine that does not assume NUL termination (e.g. because you pass an explicit
string length), or if you know for certain that your Julia string does not contain NUL and want
to skip the check, you can use `Ptr{UInt8}` as the argument type. `Cstring` can also be used as
the [`ccall`](@ref) return type, but in that case it obviously does not introduce any extra
checks and is only meant to improve readability of the call.

**System Dependent Types**

| C 类型          | 标准 Julia 别名 | Julia 基本类型                              |
|:--------------- |:-------------------- |:-------------------------------------------- |
| `char`          | `Cchar`              | `Int8` (x86, x86_64), `UInt8` (powerpc, arm) |
| `long`          | `Clong`              | `Int` (UNIX), `Int32` (Windows)              |
| `unsigned long` | `Culong`             | `UInt` (UNIX), `UInt32` (Windows)            |
| `wchar_t`       | `Cwchar_t`           | `Int32` (UNIX), `UInt16` (Windows)           |

!!! note
    When calling Fortran, all inputs must be passed by pointers to heap- or stack-allocated
    values, so all type correspondences above should contain an additional `Ptr{..}` or
    `Ref{..}` wrapper around their type specification.

!!! warning
    For string arguments (`char*`) the Julia type should be `Cstring` (if NUL- terminated data is
    expected), or either `Ptr{Cchar}` or `Ptr{UInt8}` otherwise (these two pointer types have the same
    effect), as described above, not `String`. Similarly, for array arguments (`T[]` or `T*`), the
    Julia type should again be `Ptr{T}`, not `Vector{T}`.

!!! warning
    Julia's `Char` type is 32 bits, which is not the same as the wide character type (`wchar_t` or
    `wint_t`) on all platforms.

!!! warning
    A return type of `Union{}` means the function will not return, i.e., C++11 `[[noreturn]]` or C11
    `_Noreturn` (e.g. `jl_throw` or `longjmp`). Do not use this for functions that return no value
    (`void`) but do return, use `Cvoid` instead.

!!! note
    For `wchar_t*` arguments, the Julia type should be [`Cwstring`](@ref) (if the C routine expects a
    NUL-terminated string), or `Ptr{Cwchar_t}` otherwise. Note also that UTF-8 string data in Julia is
    internally NUL-terminated, so it can be passed to C functions expecting NUL-terminated data without
    making a copy (but using the `Cwstring` type will cause an error to be thrown if the string itself
    contains NUL characters).

!!! note
    C functions that take an argument of type `char**` can be called by using a `Ptr{Ptr{UInt8}}`
    type within Julia. For example, C functions of the form:

    ```c
    int main(int argc, char **argv);
    ```

    can be called via the following Julia code:

    ```julia
    argv = [ "a.out", "arg1", "arg2" ]
    ccall(:main, Int32, (Int32, Ptr{Ptr{UInt8}}), length(argv), argv)
    ```

!!! note
    For Fortran functions taking variable length strings of type `character(len=*)` the string lengths
    are provided as *hidden arguments*. Type and position of these arguments in the list are compiler
    specific, where compiler vendors usually default to using `Csize_t` as type and append the hidden
    arguments at the end of the argument list. While this behaviour is fixed for some compilers (GNU),
    others *optionally* permit placing hidden arguments directly after the character argument (Intel, PGI).
    For example, Fortran subroutines of the form

    ```fortran
    subroutine test(str1, str2)
    character(len=*) :: str1,str2
    ```

    can be called via the following Julia code, where the lengths are appended

    ```julia
    str1 = "foo"
    str2 = "bar"
    ccall(:test, Cvoid, (Ptr{UInt8}, Ptr{UInt8}, Csize_t, Csize_t),
                        str1, str2, sizeof(str1), sizeof(str2))
    ```

!!! warning
    Fortran compilers *may* also add other hidden arguments for pointers, assumed-shape (`:`)
    and assumed-size (`*`) arrays. Such behaviour can be avoided by using `ISO_C_BINDING` and
    including `bind(c)` in the definition of the subroutine, which is strongly recommended for
    interoperable code. In this case there will be no hidden arguments, at the cost of some
    language features (e.g. only `character(len=1)` will be permitted to pass strings).

!!! note
    A C function declared to return `Cvoid` will return the value `nothing` in Julia.

### Struct Type Correspondences

Composite types such as `struct` in C or `TYPE` in Fortran90 (or `STRUCTURE` / `RECORD` in some variants
of F77), can be mirrored in Julia by creating a `struct` definition with the same
field layout.

When used recursively, `isbits` types are stored inline. All other types are stored as a pointer
to the data. When mirroring a struct used by-value inside another struct in C, it is imperative
that you do not attempt to manually copy the fields over, as this will not preserve the correct
field alignment. Instead, declare an `isbits` struct type and use that instead. Unnamed structs
are not possible in the translation to Julia.

Packed structs and union declarations are not supported by Julia.

You can get an approximation of a `union` if you know, a priori, the field that will have
the greatest size (potentially including padding). When translating your fields to Julia, declare
the Julia field to be only of that type.

Arrays of parameters can be expressed with `NTuple`.  For example, the struct in C notation written as

```c
struct B {
    int A[3];
};

b_a_2 = B.A[2];
```

can be written in Julia as

```julia
struct B
    A::NTuple{3, Cint}
end

b_a_2 = B.A[3]  # note the difference in indexing (1-based in Julia, 0-based in C)
```

Arrays of unknown size (C99-compliant variable length structs specified by `[]` or `[0]`) are not directly
supported. Often the best way to deal with these is to deal with the byte offsets directly.
For example, if a C library declared a proper string type and returned a pointer to it:

```c
struct String {
    int strlen;
    char data[];
};
```

In Julia, we can access the parts independently to make a copy of that string:

```julia
str = from_c::Ptr{Cvoid}
len = unsafe_load(Ptr{Cint}(str))
unsafe_string(str + Core.sizeof(Cint), len)
```

### Type Parameters

The type arguments to `ccall` and `@cfunction` are evaluated statically,
when the method containing the usage is defined.
They therefore must take the form of a literal tuple, not a variable,
and cannot reference local variables.

This may sound like a strange restriction,
but remember that since C is not a dynamic language like Julia,
its functions can only accept argument types with a statically-known, fixed signature.

However, while the type layout must be known statically to compute the intended C ABI,
the static parameters of the function are considered to be part of this static environment.
The static parameters of the function may be used as type parameters in the call signature,
as long as they don't affect the layout of the type.
For example, `f(x::T) where {T} = ccall(:valid, Ptr{T}, (Ptr{T},), x)`
is valid, since `Ptr` is always a word-size primitive type.
But, `g(x::T) where {T} = ccall(:notvalid, T, (T,), x)`
is not valid, since the type layout of `T` is not known statically.

### SIMD 值

Note: This feature is currently implemented on 64-bit x86 and AArch64 platforms only.

If a C/C++ routine has an argument or return value that is a native SIMD type, the corresponding
Julia type is a homogeneous tuple of `VecElement` that naturally maps to the SIMD type.  Specifically:

>   * The tuple must be the same size as the SIMD type. For example, a tuple representing an `__m128`
>     on x86 must have a size of 16 bytes.
>   * The element type of the tuple must be an instance of `VecElement{T}` where `T` is a primitive type that
>     is 1, 2, 4 or 8 bytes.

For instance, consider this C routine that uses AVX intrinsics:

```c
#include <immintrin.h>

__m256 dist( __m256 a, __m256 b ) {
    return _mm256_sqrt_ps(_mm256_add_ps(_mm256_mul_ps(a, a),
                                        _mm256_mul_ps(b, b)));
}
```

The following Julia code calls `dist` using `ccall`:

```julia
const m256 = NTuple{8, VecElement{Float32}}

a = m256(ntuple(i -> VecElement(sin(Float32(i))), 8))
b = m256(ntuple(i -> VecElement(cos(Float32(i))), 8))

function call_dist(a::m256, b::m256)
    ccall((:dist, "libdist"), m256, (m256, m256), a, b)
end

println(call_dist(a,b))
```

The host machine must have the requisite SIMD registers.  For example, the code above will not
work on hosts without AVX support.

### 内存所有权

**malloc/free**

Memory allocation and deallocation of such objects must be handled by calls to the appropriate
cleanup routines in the libraries being used, just like in any C program. Do not try to free an
object received from a C library with [`Libc.free`](@ref) in Julia, as this may result in the `free` function
being called via the wrong library and cause the process to abort. The reverse (passing an object
allocated in Julia to be freed by an external library) is equally invalid.

### 何时使用 T、Ptr{T} 以及 Ref{T}

In Julia code wrapping calls to external C routines, ordinary (non-pointer) data should be declared
to be of type `T` inside the [`ccall`](@ref), as they are passed by value.  For C code accepting
pointers, [`Ref{T}`](@ref) should generally be used for the types of input arguments, allowing the use
of pointers to memory managed by either Julia or C through the implicit call to [`Base.cconvert`](@ref).
In contrast, pointers returned by the C function called should be declared to be of output type
[`Ptr{T}`](@ref), reflecting that the memory pointed to is managed by C only. Pointers contained in C
structs should be represented as fields of type `Ptr{T}` within the corresponding Julia struct
types designed to mimic the internal structure of corresponding C structs.

In Julia code wrapping calls to external Fortran routines, all input arguments
should be declared as of type `Ref{T}`, as Fortran passes all variables by
pointers to memory locations. The return type should either be `Cvoid` for
Fortran subroutines, or a `T` for Fortran functions returning the type `T`.

## Mapping C Functions to Julia

### `ccall` / `@cfunction` argument translation guide

For translating a C argument list to Julia:

  * `T`, where `T` is one of the primitive types: `char`, `int`, `long`, `short`, `float`, `double`,
    `complex`, `enum` or any of their `typedef` equivalents

      * `T`, where `T` is an equivalent Julia Bits Type (per the table above)
      * if `T` is an `enum`, the argument type should be equivalent to `Cint` or `Cuint`
      * argument value will be copied (passed by value)
  * `struct T` (including typedef to a struct)

      * `T`, where `T` is a Julia leaf type
      * argument value will be copied (passed by value)
  * `void*`

      * depends on how this parameter is used, first translate this to the intended pointer type, then
        determine the Julia equivalent using the remaining rules in this list
      * this argument may be declared as `Ptr{Cvoid}`, if it really is just an unknown pointer
  * `jl_value_t*`

      * `Any`
      * argument value must be a valid Julia object
  * `jl_value_t* const*`

      * `Ref{Any}`
      * argument list must be a valid Julia object (or `C_NULL`)
      * cannot be used for an output parameter, unless the user is able to
        separately arrange for the object to be GC-preserved
  * `T*`

      * `Ref{T}`, where `T` is the Julia type corresponding to `T`
      * argument value will be copied if it is an `inlinealloc` type (which
        includes `isbits` otherwise, the value must be a valid Julia object
  * `T (*)(...)` (e.g. a pointer to a function)

      * `Ptr{Cvoid}` (you may need to use [`@cfunction`](@ref) explicitly to
        create this pointer)
  * `...` (e.g. a vararg)

      * [for `ccall`]: `T...`, where `T` is the single Julia type of all
        remaining arguments
      * [for `@ccall`]: `; va_arg1::T, va_arg2::S, etc`, where `T` and `S` are
        the Julia type (i.e. separate the regular arguments from varargs with
        a `;`)
      * currently unsupported by `@cfunction`
  * `va_arg`

      * not supported by `ccall` or `@cfunction`

### `ccall` / `@cfunction` return type translation guide

For translating a C return type to Julia:

  * `void`

      * `Cvoid` (this will return the singleton instance `nothing::Cvoid`)
  * `T`, where `T` is one of the primitive types: `char`, `int`, `long`, `short`, `float`, `double`,
    `complex`, `enum` or any of their `typedef` equivalents

      * `T`, where `T` is an equivalent Julia Bits Type (per the table above)
      * if `T` is an `enum`, the argument type should be equivalent to `Cint` or `Cuint`
      * argument value will be copied (returned by-value)
  * `struct T` (including typedef to a struct)

      * `T`, where `T` is a Julia Leaf Type
      * argument value will be copied (returned by-value)
  * `void*`

      * depends on how this parameter is used, first translate this to the intended pointer type, then
        determine the Julia equivalent using the remaining rules in this list
      * this argument may be declared as `Ptr{Cvoid}`, if it really is just an unknown pointer
  * `jl_value_t*`

      * `Any`
      * argument value must be a valid Julia object
  * `jl_value_t**`

      * `Ptr{Any}` (`Ref{Any}` is invalid as a return type)
  * `T*`

      * If the memory is already owned by Julia, or is an `isbits` type, and is known to be non-null:

          * `Ref{T}`, where `T` is the Julia type corresponding to `T`
          * a return type of `Ref{Any}` is invalid, it should either be `Any` (corresponding to
            `jl_value_t*`) or `Ptr{Any}` (corresponding to `jl_value_t**`)
          * C **MUST NOT** modify the memory returned via `Ref{T}` if `T` is an `isbits` type
      * If the memory is owned by C:

          * `Ptr{T}`, where `T` is the Julia type corresponding to `T`
  * `T (*)(...)` (e.g. a pointer to a function)

      * `Ptr{Cvoid}` (you may need to use [`@cfunction`](@ref) explicitly to create this pointer)

### Passing Pointers for Modifying Inputs

Because C doesn't support multiple return values, often C functions will take pointers to data
that the function will modify. To accomplish this within a [`ccall`](@ref), you need to first
encapsulate the value inside a [`Ref{T}`](@ref) of the appropriate type. When you pass this `Ref` object
as an argument, Julia will automatically pass a C pointer to the encapsulated data:

```julia
width = Ref{Cint}(0)
range = Ref{Cfloat}(0)
ccall(:foo, Cvoid, (Ref{Cint}, Ref{Cfloat}), width, range)
```

Upon return, the contents of `width` and `range` can be retrieved (if they were changed by `foo`)
by `width[]` and `range[]`; that is, they act like zero-dimensional arrays.

## C Wrapper Examples

Let's start with a simple example of a C wrapper that returns a `Ptr` type:

```julia
mutable struct gsl_permutation
end

# The corresponding C signature is
#     gsl_permutation * gsl_permutation_alloc (size_t n);
function permutation_alloc(n::Integer)
    output_ptr = ccall(
        (:gsl_permutation_alloc, :libgsl), # name of C function and library
        Ptr{gsl_permutation},              # output type
        (Csize_t,),                        # tuple of input types
        n                                  # name of Julia variable to pass in
    )
    if output_ptr == C_NULL # Could not allocate memory
        throw(OutOfMemoryError())
    end
    return output_ptr
end
```

The [GNU Scientific Library](https://www.gnu.org/software/gsl/) (here assumed to be accessible
through `:libgsl`) defines an opaque pointer, `gsl_permutation *`, as the return type of the C
function `gsl_permutation_alloc`. As user code never has to look inside the `gsl_permutation`
struct, the corresponding Julia wrapper simply needs a new type declaration, `gsl_permutation`,
that has no internal fields and whose sole purpose is to be placed in the type parameter of a
`Ptr` type.  The return type of the [`ccall`](@ref) is declared as `Ptr{gsl_permutation}`, since
the memory allocated and pointed to by `output_ptr` is controlled by C.

The input `n` is passed by value, and so the function's input signature is
simply declared as `(Csize_t,)` without any `Ref` or `Ptr` necessary. (If the
wrapper was calling a Fortran function instead, the corresponding function input
signature would instead be `(Ref{Csize_t},)`, since Fortran variables are
passed by pointers.) Furthermore, `n` can be any type that is convertible to a
`Csize_t` integer; the [`ccall`](@ref) implicitly calls [`Base.cconvert(Csize_t,
n)`](@ref).

Here is a second example wrapping the corresponding destructor:

```julia
# The corresponding C signature is
#     void gsl_permutation_free (gsl_permutation * p);
function permutation_free(p::Ref{gsl_permutation})
    ccall(
        (:gsl_permutation_free, :libgsl), # name of C function and library
        Cvoid,                             # output type
        (Ref{gsl_permutation},),          # tuple of input types
        p                                 # name of Julia variable to pass in
    )
end
```

Here, the input `p` is declared to be of type `Ref{gsl_permutation}`, meaning that the memory
that `p` points to may be managed by Julia or by C. A pointer to memory allocated by C should
be of type `Ptr{gsl_permutation}`, but it is convertible using [`Base.cconvert`](@ref) and therefore

Now if you look closely enough at this example, you may notice that it is incorrect, given our explanation
above of preferred declaration types. Do you see it? The function we are calling is going to free the
memory. This type of operation cannot be given a Julia object (it will crash or cause memory corruption).
Therefore, it may be preferable to declare the `p` type as `Ptr{gsl_permutation }`, to make it harder for the
user to mistakenly pass another sort of object there than one obtained via `gsl_permutation_alloc`.

If the C wrapper never expects the user to pass pointers to memory managed by Julia, then using
`p::Ptr{gsl_permutation}` for the method signature of the wrapper and similarly in the [`ccall`](@ref)
is also acceptable.

Here is a third example passing Julia arrays:

```julia
# The corresponding C signature is
#    int gsl_sf_bessel_Jn_array (int nmin, int nmax, double x,
#                                double result_array[])
function sf_bessel_Jn_array(nmin::Integer, nmax::Integer, x::Real)
    if nmax < nmin
        throw(DomainError())
    end
    result_array = Vector{Cdouble}(undef, nmax - nmin + 1)
    errorcode = ccall(
        (:gsl_sf_bessel_Jn_array, :libgsl), # name of C function and library
        Cint,                               # output type
        (Cint, Cint, Cdouble, Ref{Cdouble}),# tuple of input types
        nmin, nmax, x, result_array         # names of Julia variables to pass in
    )
    if errorcode != 0
        error("GSL error code $errorcode")
    end
    return result_array
end
```

The C function wrapped returns an integer error code; the results of the actual evaluation of
the Bessel J function populate the Julia array `result_array`. This variable is declared as a
`Ref{Cdouble}`, since its memory is allocated and managed by Julia. The implicit call to
[`Base.cconvert(Ref{Cdouble}, result_array)`](@ref) unpacks
the Julia pointer to a Julia array data structure into a form understandable by C.

## Fortran Wrapper Example

The following example utilizes ccall to call a function in a common Fortran library (libBLAS) to
computes a dot product. Notice that the argument mapping is a bit different here than above, as
we need to map from Julia to Fortran.  On every argument type, we specify `Ref` or `Ptr`. This
mangling convention may be specific to your fortran compiler and operating system, and is likely
undocumented. However, wrapping each in a `Ref` (or `Ptr`, where equivalent) is a frequent
requirement of Fortran compiler implementations:

```julia
function compute_dot(DX::Vector{Float64}, DY::Vector{Float64})
    @assert length(DX) == length(DY)
    n = length(DX)
    incx = incy = 1
    product = ccall((:ddot_, "libLAPACK"),
                    Float64,
                    (Ref{Int32}, Ptr{Float64}, Ref{Int32}, Ptr{Float64}, Ref{Int32}),
                    n, DX, incx, DY, incy)
    return product
end
```


## 垃圾回收安全

When passing data to a [`ccall`](@ref), it is best to avoid using the [`pointer`](@ref) function.
Instead define a convert method and pass the variables directly to the [`ccall`](@ref). [`ccall`](@ref)
automatically arranges that all of its arguments will be preserved from garbage collection until
the call returns. If a C API will store a reference to memory allocated by Julia, after the [`ccall`](@ref)
returns, you must ensure that the object remains visible to the garbage collector. The suggested
way to do this is to make a global variable of type `Array{Ref,1}` to hold these values, until
the C library notifies you that it is finished with them.

Whenever you have created a pointer to Julia data, you must ensure the original data exists until
you have finished using the pointer. Many methods in Julia such as [`unsafe_load`](@ref) and
[`String`](@ref) make copies of data instead of taking ownership of the buffer, so that it is
safe to free (or alter) the original data without affecting Julia. A notable exception is
[`unsafe_wrap`](@ref) which, for performance reasons, shares (or can be told to take ownership of) the
underlying buffer.

The garbage collector does not guarantee any order of finalization. That is, if `a` contained
a reference to `b` and both `a` and `b` are due for garbage collection, there is no guarantee
that `b` would be finalized after `a`. If proper finalization of `a` depends on `b` being valid,
it must be handled in other ways.

## Non-constant Function Specifications

In some cases, the exact name or path of the needed library is not known in advance and must
be computed at run time. To handle such cases, the library component of a `(name, library)`
specification can be a function call, e.g. `(:dgemm_, find_blas())`. The call expression will
be executed when the `ccall` itself is executed. However, it is assumed that the library
location does not change once it is determined, so the result of the call can be cached and
reused. Therefore, the number of times the expression executes is unspecified, and returning
different values for multiple calls results in unspecified behavior.

If even more flexibility is needed, it is possible
to use computed values as function names by staging through [`eval`](@ref) as follows:

```
@eval ccall(($(string("a", "b")), "lib"), ...
```

This expression constructs a name using `string`, then substitutes this name into a new [`ccall`](@ref)
expression, which is then evaluated. Keep in mind that `eval` only operates at the top level,
so within this expression local variables will not be available (unless their values are substituted
with `$`). For this reason, `eval` is typically only used to form top-level definitions, for example
when wrapping libraries that contain many similar functions.
A similar example can be constructed for [`@cfunction`](@ref).

However, doing this will also be very slow and leak memory, so you should usually avoid this and instead keep
reading.
The next section discusses how to use indirect calls to efficiently achieve a similar effect.

## 非直接调用

The first argument to [`ccall`](@ref) can also be an expression evaluated at run time. In this
case, the expression must evaluate to a `Ptr`, which will be used as the address of the native
function to call. This behavior occurs when the first [`ccall`](@ref) argument contains references
to non-constants, such as local variables, function arguments, or non-constant globals.

For example, you might look up the function via `dlsym`,
then cache it in a shared reference for that session. For example:

```julia
macro dlsym(func, lib)
    z = Ref{Ptr{Cvoid}}(C_NULL)
    quote
        let zlocal = $z[]
            if zlocal == C_NULL
                zlocal = dlsym($(esc(lib))::Ptr{Cvoid}, $(esc(func)))::Ptr{Cvoid}
                $z[] = zlocal
            end
            zlocal
        end
    end
end

mylibvar = Libdl.dlopen("mylib")
ccall(@dlsym("myfunc", mylibvar), Cvoid, ())
```

## Closure cfunctions

The first argument to [`@cfunction`](@ref) can be marked with a `$`, in which case
the return value will instead be a `struct CFunction` which closes over the argument.
You must ensure that this return object is kept alive until all uses of it are done.
The contents and code at the cfunction pointer will be erased via a [`finalizer`](@ref)
when this reference is dropped and atexit. This is not usually needed, since this
functionality is not present in C, but can be useful for dealing with ill-designed APIs
which don't provide a separate closure environment parameter.

```julia
function qsort(a::Vector{T}, cmp) where T
    isbits(T) || throw(ArgumentError("this method can only qsort isbits arrays"))
    callback = @cfunction $cmp Cint (Ref{T}, Ref{T})
    # Here, `callback` isa Base.CFunction, which will be converted to Ptr{Cvoid}
    # (and protected against finalization) by the ccall
    ccall(:qsort, Cvoid, (Ptr{T}, Csize_t, Csize_t, Ptr{Cvoid}),
        a, length(a), Base.elsize(a), callback)
    # We could instead use:
    #    GC.@preserve callback begin
    #        use(Base.unsafe_convert(Ptr{Cvoid}, callback))
    #    end
    # if we needed to use it outside of a `ccall`
    return a
end
```

!!! note
    Closure [`@cfunction`](@ref) rely on LLVM trampolines, which are not available on all
    platforms (for example ARM and PowerPC).


## 关闭库

It is sometimes useful to close (unload) a library so that it can be reloaded.
For instance, when developing C code for use with Julia, one may need to compile,
call the C code from Julia, then close the library, make an edit, recompile,
and load in the new changes. One can either restart Julia or use the
`Libdl` functions to manage the library explicitly, such as:

```julia
lib = Libdl.dlopen("./my_lib.so") # 显式打开库
sym = Libdl.dlsym(lib, :my_fcn)   # 获得用于调用函数的符号
ccall(sym, ...) # 直接用指针 `sym` 而不是 (symbol, library) 元组，其余参数保持不变
Libdl.dlclose(lib) # 显式关闭库
```

Note that when using `ccall` with the tuple input
(e.g., `ccall((:my_fcn, "./my_lib.so"), ...)`), the library is opened implicitly
and it may not be explicitly closed.

## 调用规约

The second argument to [`ccall`](@ref) can optionally be a calling convention specifier (immediately
preceding return type). Without any specifier, the platform-default C calling convention is used.
Other supported conventions are: `stdcall`, `cdecl`, `fastcall`, and `thiscall` (no-op on 64-bit Windows).
For example (from `base/libc.jl`) we see the same `gethostname`[`ccall`](@ref) as above, but with the correct
signature for Windows:

```julia
hn = Vector{UInt8}(undef, 256)
err = ccall(:gethostname, stdcall, Int32, (Ptr{UInt8}, UInt32), hn, length(hn))
```

请参阅 [LLVM Language Reference](http://llvm.org/docs/LangRef.html#calling-conventions) 来获得更多信息。

There is one additional special calling convention [`llvmcall`](@ref Base.llvmcall),
which allows inserting calls to LLVM intrinsics directly.
This can be especially useful when targeting unusual platforms such as GPGPUs.
For example, for [CUDA](http://llvm.org/docs/NVPTXUsage.html), we need to be able to read the thread index:

```julia
ccall("llvm.nvvm.read.ptx.sreg.tid.x", llvmcall, Int32, ())
```

As with any `ccall`, it is essential to get the argument signature exactly correct.
Also, note that there is no compatibility layer that ensures the intrinsic makes
sense and works on the current target,
unlike the equivalent Julia functions exposed by `Core.Intrinsics`.

## 访问全局变量

Global variables exported by native libraries can be accessed by name using the [`cglobal`](@ref)
function. The arguments to [`cglobal`](@ref) are a symbol specification identical to that used
by [`ccall`](@ref), and a type describing the value stored in the variable:

```julia-repl
julia> cglobal((:errno, :libc), Int32)
Ptr{Int32} @0x00007f418d0816b8
```

The result is a pointer giving the address of the value. The value can be manipulated through
this pointer using [`unsafe_load`](@ref) and [`unsafe_store!`](@ref).

!!! note
    This `errno` symbol may not be found in a library named "libc", as this is an implementation detail of
    your system compiler. Typically standard library symbols should be accessed just by name,
    allowing the compiler to fill in the correct one.
    Also, however, the `errno` symbol shown in this example is special in most compilers, and so the value
    seen here is probably not what you expect or want. Compiling the equivalent code in C on any
    multi-threaded-capable system would typically actually call a different function (via macro preprocessor
    overloading), and may give a different result than the legacy value printed here.

## Accessing Data through a Pointer

The following methods are described as "unsafe" because a bad pointer or type declaration can
cause Julia to terminate abruptly.

Given a `Ptr{T}`, the contents of type `T` can generally be copied from the referenced memory
into a Julia object using `unsafe_load(ptr, [index])`. The index argument is optional (default
is 1), and follows the Julia-convention of 1-based indexing. This function is intentionally similar
to the behavior of [`getindex`](@ref) and [`setindex!`](@ref) (e.g. `[]` access syntax).

The return value will be a new object initialized to contain a copy of the contents of the referenced
memory. The referenced memory can safely be freed or released.

If `T` is `Any`, then the memory is assumed to contain a reference to a Julia object (a `jl_value_t*`),
the result will be a reference to this object, and the object will not be copied. You must be
careful in this case to ensure that the object was always visible to the garbage collector (pointers
do not count, but the new reference does) to ensure the memory is not prematurely freed. Note
that if the object was not originally allocated by Julia, the new object will never be finalized
by Julia's garbage collector.  If the `Ptr` itself is actually a `jl_value_t*`, it can be converted
back to a Julia object reference by [`unsafe_pointer_to_objref(ptr)`](@ref). (Julia values `v`
can be converted to `jl_value_t*` pointers, as `Ptr{Cvoid}`, by calling [`pointer_from_objref(v)`](@ref).)

The reverse operation (writing data to a `Ptr{T}`), can be performed using [`unsafe_store!(ptr, value, [index])`](@ref).
Currently, this is only supported for primitive types or other pointer-free (`isbits`) immutable struct
types.

Any operation that throws an error is probably currently unimplemented and should be posted as
a bug so that it can be resolved.

If the pointer of interest is a plain-data array (primitive type or immutable struct), the function
[`unsafe_wrap(Array, ptr,dims, own = false)`](@ref)
may be more useful. The final parameter should be true if Julia should "take ownership" of the
underlying buffer and call `free(ptr)` when the returned `Array` object is finalized.  If the
`own` parameter is omitted or false, the caller must ensure the buffer remains in existence until
all access is complete.

Arithmetic on the `Ptr` type in Julia (e.g. using `+`) does not behave the same as C's pointer
arithmetic. Adding an integer to a `Ptr` in Julia always moves the pointer by some number of
*bytes*, not elements. This way, the address values obtained from pointer arithmetic do not depend
on the element types of pointers.

## 线程安全

Some C libraries execute their callbacks from a different thread, and since Julia isn't thread-safe
you'll need to take some extra precautions. In particular, you'll need to set up a two-layered
system: the C callback should only *schedule* (via Julia's event loop) the execution of your "real"
callback. To do this, create an [`AsyncCondition`](@ref Base.AsyncCondition) object and [`wait`](@ref) on it:

```julia
cond = Base.AsyncCondition()
wait(cond)
```

传递给 C 的回调应该只通过 [`ccall`](@ref) 将 `cond.handle` 作为参数传递给 `:uv_async_send` 并调用，注意避免任何内存分配操作或与 Julia 运行时的其他交互。

注意，事件可能会合并，因此对 `uv_async_send` 的多个调用可能会导致对该条件的单个唤醒通知。

## 关于 Callbacks 的更多内容

关于如何传递 callback 到 C 库的更多细节，请参考此[博客](https://julialang.org/blog/2013/05/callback)。

## C++

如需要直接易用的C++接口，即直接用Julia写封装代码，请参考 [Cxx](https://github.com/Keno/Cxx.jl)。如需封装C++库的工具，即用C++写封装/胶水代码，请参考[CxxWrap](https://github.com/JuliaInterop/CxxWrap.jl)。



[^1]: Non-library function calls in both C and Julia can be inlined and thus may have
    even less overhead than calls to shared library functions.
    The point above is that the cost of actually doing foreign function call is about the same as doing a call in either native language.

[^2]: The [Clang package](https://github.com/ihnorton/Clang.jl) can be used to auto-generate Julia code
    from a C header file.
