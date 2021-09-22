# 调用 C 和 Fortran 代码

在数值计算领域，尽管有很多用 C 语言或 Fortran 写的高质量且成熟的库都可以用 Julia 重写，但为了便捷利用现有的 C 或 Fortran 代码，Julia 提供简洁且高效的调用方式。Julia 的哲学是 `no boilerplate`：
Julia 可以直接调用 C/Fortran 的函数，不需要任何"胶水"代码，代码生成或其它编译过程 -- 即使在交互式会话 (REPL/Jupyter notebook) 中使用也一样. 在 Julia 中，上述特性可以仅仅通过调用 [`ccall`](@ref) 实现，它的语法看起来就像是普通的函数调用。

被调用的代码必须是一个共享库（.so, .dylib, .dll）。大多数 C 和 Fortran 库都已经是以共享库的形式发布的，但在用 GCC 或 Clang 编译自己的代码时，需要添加 `-shared` 和 `-fPIC` 编译器选项。由于 Julia 的 JIT 生成的机器码跟原生 C 代码的调用是一样，所以在 Julia 里调用 C/Fortran 库的额外开销与直接从 C 里调用是一样的。[^1]

可以通过元组 `(:function, "library")` 或 `("function", "library")` 这两种形式来索引库中的函数，其中 `function` 是函数名，`library` 是库名。（特定平台/操作系统的）加载路径中可用的共享库将按名称解析。 也可以指定库的完整路径。

可以单独使用函数名来代替元组（只用 `:function` 或 `"function"`）。在这种情况下，函数名在当前进程中进行解析。这一调用形式可用于调用 C 库函数、Julia 运行时中的函数或链接到 Julia 的应用程序中的函数。

默认情况下，Fortran 编译器会[进行名称修饰](https://en.wikipedia.org/wiki/Name_mangling#Fortran)（例如，将函数名转换为小写或大写，通常会添加下划线），要通过 [`ccall`](@ref) 调用 Fortran 函数，传递的标识符必须与 Fortran 编译器名称修饰之后的一致。此外，在调用 Fortran 函数时，**所有**输入必须以指针形式传递，并已在堆或栈上分配内存。这不仅适用于通常是堆分配的数组及可变对象，而且适用于整数和浮点数等标量值，尽管这些值通常是栈分配的，且在使用 C 或 Julia 调用约定时通常是通过寄存器传递的。

最终，你能使用 [`ccall`](@ref) 来实际生成一个对库函数的调用。[`ccall`](@ref) 的参数是：

1. 一个 `(:function, "library")` 对（最常见）

   或

   一个 `:function` 名称符号或 `"function"` 名称字符串（用于当前进程或 libc 中的符号），

   或

   一个函数指针（例如，从 `dlsym` 获得的指针）。

2. 函数的返回值类型

3. 输入类型的元组，对应于函数签名

4. 要传递给函数的实际参数值，如果有的话； 每个都是一个单独的参数。

!!! note
    `(:function, "library")` 对、返回类型和输入类型必须是字面量（即，它们不能是变量，但请参阅下面的 [非常量函数规范](@ref Non-constant-Function-Specifications)）。

    当定义包含方法时，将在编译时评估其余参数。

!!! note
    请参阅下文了解如何 [将 C 类型映射到 Julia 类型](@ref mapping-c-types-to-julia)。

作为一个完整但简单的例子，下面从大多数 Unix 派生系统上的标准 C 库中调用 `clock` 函数：

```julia-repl
julia> t = ccall(:clock, Int32, ())
2292761

julia> t
2292761

julia> typeof(t)
Int32
```

`clock` 不接受任何参数并返回一个 [`Int32`](@ref)。 一个常见的错误是忘记了参数类型的单元组必须用逗号结尾。 例如，要调用 `getenv` 函数来获取指向环境变量值的指针，可以这样调用：

```julia-repl
julia> path = ccall(:getenv, Cstring, (Cstring,), "SHELL")
Cstring(@0x00007fff5fbffc45)

julia> unsafe_string(path)
"/bin/bash"
```

请注意，参数类型元组必须是 `(Cstring,)`，而不是 `(Cstring)` 。这是因为 `(Cstring)` 只是括号括起来的表达式 `Cstring`，而不是包含 `Cstring` 的单元组：

```jldoctest
julia> (Cstring)
Cstring

julia> (Cstring,)
(Cstring,)
```

在实践中，尤其是在提供可重用功能时，通常会在 Julia 函数中包装 [`ccall`](@ref) 使用，这些函数设置参数，然后以 C 或 Fortran 函数指定的任何方式检查错误。 如果发生错误，它会作为普通的 Julia 异常抛出。 这一点尤其重要，因为 C 和 Fortran API 在它们指示错误条件的方式上是出了名的不一致。 例如，`getenv` C 库函数被包裹在下面的 Julia 函数中，它是 [`env.jl`](https://github.com/JuliaLang/julia/blob/master/base/env.jl)：

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

这是一个稍微复杂的示例，用于发现本地计算机的主机名。 在此示例中，假设网络库代码位于名为“libc”的共享库中。 在实践中，这个函数通常是 C 标准库的一部分，因此“libc”部分应该被省略，但我们希望在这里展示这个语法的用法。

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

此示例首先分配一个字节数组。 然后它调用 C 库函数 `gethostname` 以使用主机名填充数组。 最后，它接受一个指向主机名缓冲区的指针，并将该指针转换为一个 Julia 字符串，假设它是一个以 NUL 结尾的 C 字符串。

C 库通常使用这种模式，要求调用者分配要传递给被调用者并填充的内存。 像这样从 Julia 分配内存通常是通过创建一个未初始化的数组并将指向其数据的指针传递给 C 函数来完成的。 这就是我们在这里不使用 `Cstring` 类型的原因：由于数组未初始化，它可能包含 NUL 字节。 作为 [`ccall`](@ref) 的一部分，转换为 `Cstring` 会检查包含的 NUL 字节，因此可能会引发类型转换错误。

用 `unsafe_string` 取消引用 `pointer(hostname)` 是一种不安全的操作，因为它需要访问为 `hostname` 分配的内存，而这些内存可能在同时被垃圾收集。 宏 [`GC.@preserve`](@ref) 防止这种情况发生，从而防止访问无效的内存位置。

## 创建和C兼容的Julia函数指针

可以将Julia函数传递给接受函数指针参数的原生C函数。例如，要匹配满足下面的C原型：

```c
typedef returntype (*functiontype)(argumenttype, ...)
```

宏 [`@cfunction`](@ref) 为调用 Julia 函数生成 C 兼容函数指针。 [`@cfunction`](@ref) 的参数是：

1. 一个Julia函数
2. 函数的返回值类型
3. 输入类型的元组，对应于函数签名

!!! note
    与 `ccall` 一样，返回类型和输入类型的元组必须是字面量常量。

!!! note
    目前，仅支持平台默认的C调用约定。这意味着，`@cfunction`生成的指针不能用于WINAPI要求在32位Windows上使用`stdcall`函数的调用中，但可以在WIN64上使用（其中`stdcall`与C调用约定统一）。

一个典型的例子就是标准C库函数`qsort`，定义为：

```c
void qsort(void *base, size_t nmemb, size_t size,
           int (*compare)(const void*, const void*));
```

`base` 参数是一个指向长度为 `nmemb` 的数组的指针，每个元素都有 `size` 字节。 `compare` 是一个回调函数，它采用指向两个元素 `a` 和 `b` 的指针，如果 `a` 出现在 `b` 之前/之后，则返回小于/大于零的整数（如果允许任何顺序，则返回零） 。

现在，假设我们在 Julia 中有一个 1 维数组 `A`，我们希望使用`qsort`函数（而不是 Julia 的内置`sort`函数）对其进行排序。 在我们考虑调用 `qsort` 并传递参数之前，我们需要编写一个比较函数：

```jldoctest mycompare
julia> function mycompare(a, b)::Cint
           return (a < b) ? -1 : ((a > b) ? +1 : 0)
       end
mycompare (generic function with 1 method)
```

`qsort` 需要一个返回 C `int` 的比较函数，因此我们将返回类型注释为 `Cint`。

为了将此函数传递给 C，我们使用宏`@cfunction` 获取它的地址：

```jldoctest mycompare
julia> mycompare_c = @cfunction(mycompare, Cint, (Ref{Cdouble}, Ref{Cdouble}));
```

[`@cfunction`](@ref) 需要三个参数: Julia函数 (`mycompare`), 返回值类型(`Cint`), 和一个输入参数类型的字面量元组, 此处是要排序的`Cdouble`([`Float64`](@ref)) 元素的数组.

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

如示例所示，原始 Julia 数组 `A` 现在已排序：`[-2.7, 1.3, 3.1, 4.4]`。 请注意，Julia [负责将数组转换为`Ptr{Cdouble}`](@ref automatic-type-conversion))，计算元素类型的大小（以字节为单位），等等。

为了好玩，尝试在 `mycompare` 中插入一行 `println("mycompare($a, $b)")`，这将允许你查看 `qsort` 正在执行的比较（并验证它是否真的在调用你传递给它的 Julia 函数）。

## [将 C 类型映射到 Julia](@id mapping-c-types-to-julia)

将声明的 C 类型与其在 Julia 中的声明完全匹配至关重要。 不一致会导致在一个系统上正常工作的代码在另一个系统上失败或产生不确定的结果。

请注意，在调用 C 函数的过程中没有任何地方使用 C 头文件：您有责任确保您的 Julia 类型和调用签名准确反映 C 头文件中的那些。[^2]

### [自动类型转换](@id automatic-type-conversion)

Julia 会自动插入对 [`Base.cconvert`](@ref) 函数的调用，以将每个参数转换为指定的类型。 例如，以下调用：

```julia
ccall((:foo, "libfoo"), Cvoid, (Int32, Float64), x, y)
```

将表现得好像它是这样写的：

```julia
ccall((:foo, "libfoo"), Cvoid, (Int32, Float64),
      Base.unsafe_convert(Int32, Base.cconvert(Int32, x)),
      Base.unsafe_convert(Float64, Base.cconvert(Float64, y)))
```

[`Base.cconvert`](@ref) 通常只调用 [`convert`](@ref)，但可以定义为返回一个更适合传递给 C 的任意新对象。这应该用于执行 C 代码将访问的内存。 例如，这用于将对象（例如字符串）的 `Array` 转换为指针数组。

[`Base.unsafe_convert`](@ref) 处理到 [`Ptr`](@ref) 类型转换。 它被认为是不安全的，因为将对象转换为本地指针会隐藏垃圾收集器中的对象，导致它过早地被释放。

### 类型对应

首先，让我们回顾一些相关的 Julia 类型术语：

| 语法 / 关键字              | 例子                                     | 描述                                                                                                                                                                                                                                                                    |
|:----------------------------- |:------------------------------------------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mutable struct`              | `BitSet`                                    | `Leaf Type`：包含 `type-tag` 的一组相关数据，由 Julia GC 管理，通过 `object-identity` 来定义。为了保证实例可以被构造，`Leaf Type` 必须是完整定义的，即不允许使用 `TypeVars`。              |
| `abstract type`               | `Any`, `AbstractArray{T, N}`, `Complex{T}`  | `Super Type`：用于描述一组类型，它不是 `Leaf-Type`，也无法被实例化。                                                                                                                                                      |
| `T{A}`                        | `Vector{Int}`                               | `Type Parameter`：某种类型的一种具体化，通常用于分派或存储优化。                                                                                                                                                                          |
|                               |                                             | `TypeVar`：`Type parameter` 声明中的 `T` 是一个 `TypeVar`，它是类型变量的简称。                                                                                                                                                                  |
| `primitive type`              | `Int`, `Float64`                            | `Primitive Type`：一种没有成员变量的类型，但是它有大小。它是按值存储和定义的。                                                                                                                                                                                           |
| `struct`                      | `Pair{Int, Int}`                            | "Struct" :: 所有字段都定义为常量的类型。 它是按值定义的，并且可以与类型标签一起存储。                                                                                                                                                       |
|                               | `ComplexF64` (`isbits`)                     | "Is-Bits" :: 一个 `primitive type`，或者一个 `struct` 类型，其中所有字段都是其他 `isbits` 类型。 它是按值定义的，并且在没有类型标签的情况下存储。                                                                                                                       |
| `struct ...; end`             | `nothing`                                   | `Singleton`：没有成员变量的 `Leaf Type` 或 `Struct`。                                                                                                                                                                                                                        |
| `(...)` or `tuple(...)`       | `(1, 2, 3)`                                 | “元组” :: 类似于匿名结构类型或常量数组的不可变数据结构。 表示为数组或结构。                                                                                                                                |

### [Bits Types](@id man-bits-types)

有几种特殊类型需要注意，因为没有其他类型可以定义为具有相同的行为：

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

    当数组作为 `Ptr{T}` 参数传递给 C 时，它不是重新解释转换：Julia 要求数组的元素类型与 `T` 匹配，并传递第一个元素的地址。
     

    因此，如果一个 `Array` 中的数据格式不正确，它必须被显式地转换
    ，通过类似 `trunc(Int32, a)` 的函数。

    若要将一个数组 `A` 以不同类型的指针传递，而*不提前转换数据*，
    （比如，将一个 `Float64` 数组传给一个处理原生字节的函数时），你
    可以将这一参数声明为 `Ptr{Cvoid}` 。

    如果一个元素类型为 `Ptr{T}` 的数组作为 `Ptr{Ptr{T}}` 类型的参数传递， [`Base.cconvert`](@ref) 
    将会首先尝试进行 null-terminated copy（即直到下一个元素为null才停止复制），并将每一个元素使用其通过 [`Base.cconvert`](@ref) 转换后的版本替换。
    这允许，比如，将一个 `argv` 的指针数组，其类型为
    `Vector{String}` ，传递给一个类型为 `Ptr{Ptr{Cchar}}` 的参数。

在我们目前支持的所有系统上，基本的 C/C++ 值类型可以转换为 Julia 类型，如下所示。 每个 C 类型还有一个对应的同名 Julia 类型，以 C 为前缀。这在编写可移植代码时很有帮助（记住 C 中的 `int` 与 Julia 中的 `Int` 不同）。


**独立于系统的类型**

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
| `void*`                                                 |                          |                      | `Ptr{Cvoid}` (或类似的 `Ref{Cvoid}`)                                                                       |
| `T*` (where T represents an appropriately defined type) |                          |                      | `Ref{T}` （只有当 T 是 isbits 类型时，T 才可以安全地转变）                                                 |
| `char*` (or `char[]`, e.g. a string)                    | `CHARACTER*N`            |                      | `Cstring` if NUL-terminated, or `Ptr{UInt8}` if not                                                            |
| `char**` (or `*char[]`)                                 |                          |                      | `Ptr{Ptr{UInt8}}`                                                                                              |
| `jl_value_t*` (any Julia Type)                          |                          |                      | `Any`                                                                                                          |
| `jl_value_t* const*` (一个 Julia 值的引用）     |                          |                      | `Ref{Any}`（常量，因为转变需要写屏障，不可能正确插入）    |
| `va_arg`                                                |                          |                      | Not supported                                                                                                  |
| `...` (variadic function specification)                 |                          |                      | `T...`（其中 `T` 是上述类型之一，当使用 `ccall` 函数时）                                  |
| `...` (variadic function specification)                 |                          |                      | `; va_arg1::T、va_arg2::S 等`（仅支持`@ccall` 宏）                                          |

[`Cstring`](@ref) 类型本质上是`Ptr{UInt8}`的同义词，但如果Julia字符串包含任何嵌入的NUL字符，则类型转换为`Cstring`会引发错误（如果C例程将NUL视为终止符，则会导致字符串被静默截断）。如果要将`char*`传递给不采用NUL终止的C例程（例如，因为传递的是显式字符串长度），或者如果确定Julia字符串不包含NUL并希望跳过检查，则可以使用`Ptr{UInt8}`作为参数类型。`Cstring`也可以用作 [`ccall`](@ref) 返回类型，但在这种情况下，它显然不会引入任何额外的检查，只是为了提高调用的可读性。

**系统独立类型**

| C 类型          | 标准 Julia 别名 | Julia 基本类型                              |
|:--------------- |:-------------------- |:-------------------------------------------- |
| `char`          | `Cchar`              | `Int8` (x86, x86_64), `UInt8` (powerpc, arm) |
| `long`          | `Clong`              | `Int` (UNIX), `Int32` (Windows)              |
| `unsigned long` | `Culong`             | `UInt` (UNIX), `UInt32` (Windows)            |
| `wchar_t`       | `Cwchar_t`           | `Int32` (UNIX), `UInt16` (Windows)           |

!!! note
    调用 Fortran 时，所有输入都必须通过指向堆分配或堆栈分配值的指针传递，因此上述所有类型对应都应在其类型规范周围包含一个额外的 `Ptr{..}` 或 `Ref{..}` 包装器。

!!! warning
    对于字符串参数 (`char*`)，Julia 类型应该是 `Cstring`（如果需要以 NUL 结尾的数据），否则为 `Ptr{Cchar}` 或 `Ptr{UInt8}`（这两种指针类型具有相同的效果），如上所述，而不是 `String`。 类似地，对于数组参数（`T[]` 或 `T*`），Julia 类型应该还是 `Ptr{T}`，而不是 `Vector{T}`。

!!! warning
    Julia 的 `Char` 类型是 32 位，这与所有平台上的宽字符类型（`wchar_t` 或 `wint_t`）不同。

!!! warning
    `Union{}` 的返回类型意味着函数不会返回，即 C++11 `[[noreturn]]` 或 C11 `_Noreturn`（例如 `jl_throw` 或 `longjmp`）。 不要将此用于不返回值（`void`）但返回的函数，而是使用`Cvoid`。

!!! note
    对于 `wchar_t*` 参数，Julia 类型应为 [`Cwstring`](@ref)（如果 C 例程需要以 NUL 结尾的字符串），否则为 `Ptr{Cwchar_t}`。 另请注意，Julia 中的 UTF-8 字符串数据在内部以 NUL 结尾，因此可以将其传递给需要以 NUL 结尾的数据的 C 函数，而无需进行复制（但使用 `Cwstring` 类型将导致抛出错误，如果字符串本身包含 NUL 字符）。

!!! note
    可以在 Julia 中使用 `Ptr{Ptr{UInt8}}` 类型调用采用 `char**` 类型参数的 C 函数。 例如，以下形式的 C 函数：

    ```c
    int main(int argc, char **argv);
    ```

    可以通过以下 Julia 代码调用：

    ```julia
    argv = [ "a.out", "arg1", "arg2" ]
    ccall(:main, Int32, (Int32, Ptr{Ptr{UInt8}}), length(argv), argv)
    ```

!!! note
    对于采用 `character(len=*)` 类型的可变长度字符串的 Fortran 函数，字符串长度作为*隐藏参数*提供。 这些参数在列表中的类型和位置是特定于编译器的，编译器供应商通常默认使用 `Csize_t` 作为类型并将隐藏的参数附加到参数列表的末尾。 虽然此行为对于某些编译器 (GNU) 是固定的，但其他编译器*可选* 允许将隐藏参数直接放置在字符参数（Intel、PGI）之后。 例如，如下的 Fortran 子程序

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
    Fortran 编译器还*可以*为指针、假定形状（`:`）和假定大小（`*`）数组添加其他隐藏参数。 这种行为可以通过使用`ISO_C_BINDING`并在子例程的定义中包含`bind(c)`来避免，强烈推荐用于可互操作的代码。 在这种情况下，将没有隐藏的参数，代价是一些语言特性（例如，只允许 `character(len=1)` 传递字符串）。

!!! note
    声明为返回 `Cvoid` 的 C 函数将在 Julia 中返回值 `nothing`。

### 结构类型对应

复合类型，例如 C 中的`struct`或 Fortran90 中的`TYPE`（或 F77 的某些变体中的`STRUCTURE`/`RECORD`），可以通过创建具有相同字段布局的`struct`定义在 Julia 中进行镜像复制。

当递归使用时，`isbits` 类型被内联存储。 所有其他类型都存储为指向数据的指针。 在 C 中的另一个结构中镜像复制按值使用的结构时，不要尝试手动复制字段，因为这不会保留正确的字段对齐。 相反，建议声明一个 `isbits` 结构类型并使用它。 未命名的结构在翻译为 Julia 时是不可能的。

Julia不支持压缩结构和联合声明。

如果你事先地知道将具有最大大小（可能包括填充）的字段，则可以获得 `union` 的近似。 将你的字段转换为 Julia 时，将 Julia 字段声明为仅属于该类型。

参数数组可以用 `NTuple` 表示。例如，C 符号中的 struct 写成

```c
struct B {
    int A[3];
};

b_a_2 = B.A[2];
```

可以用 Julia 写成

```julia
struct B
    A::NTuple{3, Cint}
end

b_a_2 = B.A[3]  # note the difference in indexing (1-based in Julia, 0-based in C)
```

不直接支持未知大小的数组（由`[]` 或`[0]` 指定的符合C99 的可变长度结构）。 通常处理这些的最好方法是直接处理字节偏移量。 例如，如果一个 C 库声明了一个正确的字符串类型并返回一个指向它的指针：

```c
struct String {
    int strlen;
    char data[];
};
```

在 Julia 中，我们可以独立访问这些部分以制作该字符串的副本：

```julia
str = from_c::Ptr{Cvoid}
len = unsafe_load(Ptr{Cint}(str))
unsafe_string(str + Core.sizeof(Cint), len)
```

### 类型参数

当定义了方法时，`ccall` 和 `@cfunction` 的类型参数被静态地评估。 因此，它们必须采用字面量元组的形式，而不是变量，并且不能引用局部变量。

这听起来像是一个奇怪的限制，但请记住，由于 C 不是像 Julia 那样的动态语言，它的函数只能接受具有静态已知的固定签名的参数类型。

然而，虽然必须静态地知道类型布局才能计算预期的 C ABI，但函数的静态参数被视为此静态环境的一部分。函数的静态参数可以用作调用签名中的类型参数，只要它们不影响类型的布局即可。例如， `f(x::T) where {T} = ccall(:valid, Ptr{T}, (Ptr{T},), x)` 是有效的，因为 `Ptr` 始终是字大小的原始类型。但是， `g(x::T) where {T} = ccall(:notvalid, T, (T,), x)` 是无效的，因为 `T` 的类型布局不是静态已知的。

### SIMD 值

注意：此功能目前仅在 64 位 x86 和 AArch64 平台上实现。

如果 C/C++ 例程具有本机 SIMD 类型的参数或返回值，则相应的 Julia 类型是自然映射到 SIMD 类型的`VecElement` 的同构元组。 具体来说：

> * 元组的大小必须与 SIMD 类型相同。 例如，一个表示 `__m128` 的元组
> 在 x86 上必须有 16 字节的大小。
> * 元组的元素类型必须是 `VecElement{T}` 的一个实例，其中 `T` 是一个原始类型
> 是 1、2、4 或 8 个字节。

例如，考虑这个使用 AVX 内在函数的 C 例程：

```c
#include <immintrin.h>

__m256 dist( __m256 a, __m256 b ) {
    return _mm256_sqrt_ps(_mm256_add_ps(_mm256_mul_ps(a, a),
                                        _mm256_mul_ps(b, b)));
}
```

以下 Julia 代码使用 `ccall` 调用 `dist`：

```julia
const m256 = NTuple{8, VecElement{Float32}}

a = m256(ntuple(i -> VecElement(sin(Float32(i))), 8))
b = m256(ntuple(i -> VecElement(cos(Float32(i))), 8))

function call_dist(a::m256, b::m256)
    ccall((:dist, "libdist"), m256, (m256, m256), a, b)
end

println(call_dist(a,b))
```

主机必须具有必要的 SIMD 寄存器。 例如，上面的代码将无法在没有 AVX 支持的主机上运行。

### 内存所有权

**malloc/free**

此类对象的内存分配和释放必须通过调用正在使用的库中的适当清理例程来处理，就像在任何 C 程序中一样。 不要尝试在 Julia 中使用 [`Libc.free`](@ref) 释放从 C 库接收的对象，因为这可能会导致通过错误的库调用 `free` 函数并导致进程中止。 反过来（传递在 Julia 中分配的对象以供外部库释放）同样无效。

### 何时使用 T、Ptr{T} 以及 Ref{T}

在对外部C例程的Julia代码包装调用中，普通（非指针）数据应该在[`ccall`](@ref) 中声明为`T`类型，因为它们是通过值传递的。对于接受指针的C代码，[`Ref{T}`](@ref) 通常应用于输入参数的类型，允许通过对[`Base.cconvert`](@ref) 的隐式调用使用指向Julia或C管理的内存的指针。相反，被调用的C函数返回的指针应该声明为输出类型[`Ptr{T}`](@ref)，这反映了指向的内存仅由C管理。C结构中包含的指针应在相应的Julia结构类型中表示为`Ptr{T}`类型的字段，这些结构类型旨在模拟相应C结构的内部结构。

在 Julia 代码包装对外部 Fortran 例程的调用中，所有输入参数都应声明为`Ref{T}`类型，因为 Fortran 通过指向内存位置的指针传递所有变量。 Fortran 子程序的返回类型应该是 `Cvoid`，或者 Fortran 函数的返回类型应该是 `T`，返回类型是 `T`。

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
      * 参数列表必须是有效的 Julia 对象（或 C_NULL）
      * 不能用于输出参数，除非用户能够单独安排要GC保留的对象
         
  * `T*`

      * `Ref{T}`, where `T` is the Julia type corresponding to `T`
      * 如果参数值是 `inlinealloc` 类型（否则包括 `isbits`，该值必须是有效的 Julia 对象）将被复制
         
  * `T (*)(...)` (e.g. a pointer to a function)

      * `Ptr{Cvoid}`（你可能需要显式使用 [`@cfunction`](@ref) 来创建这个指针）
         
  * `...` (e.g. a vararg)

      * [[for `ccall`]: `T...`，其中 `T` 是所有剩余参数的单个 Julia 类型]: `T...`, where `T` is the single Julia type of all
         
      * [[for `@ccall`]：`; va_arg1::T、va_arg2::S` 等，其中 `T` 和 `S` 是 Julia 类型（即用 `;` 将常规参数与可变参数分开）]: `; va_arg1::T, va_arg2::S, etc`, where `T` and `S` are
         
         
      * `@cfunction` 目前不支持
  * `va_arg`

      * `ccall` 或 `@cfunction` 不支持

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
          * `Ref{Any}` 的返回类型无效，它应该是 `Any`（对应于 `jl_value_t*`）或 `Ptr{Any}`（对应于 `jl_value_t**`）
             
          * C **MUST NOT** modify the memory returned via `Ref{T}` if `T` is an `isbits` type
      * If the memory is owned by C:

          * `Ptr{T}`, where `T` is the Julia type corresponding to `T`
  * `T (*)(...)` (e.g. a pointer to a function)

      * `Ptr{Cvoid}` (you may need to use [`@cfunction`](@ref) explicitly to create this pointer)

### 传递修改输入的指针

因为 C 不支持多个返回值，所以 C 函数通常会使用指向函数将修改的数据的指针。 要在 [`ccall`](@ref) 中完成此操作，你需要首先将值封装在适当类型的 [`Ref{T}`](@ref) 中。 当你将这个 `Ref` 对象作为参数传递时，Julia 会自动传递一个指向封装数据的 C 指针：

```julia
width = Ref{Cint}(0)
range = Ref{Cfloat}(0)
ccall(:foo, Cvoid, (Ref{Cint}, Ref{Cfloat}), width, range)
```

返回时，可以通过`width[]`和`range[]`检索`width`和`range`的内容（如果它们被`foo`改变的话）； 也就是说，它们就像零维数组。

## C 包装器示例

让我们从一个返回 `Ptr` 类型的 C 包装器的简单示例开始：

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

[GNU 科学图书馆](https://www.gnu.org/software/gsl/)（这里假设可以通过`:libgsl` 访问）定义了一个不透明的指针，`gsl_permutation *`，作为 C 函数`gsl_permutation_alloc` 的返回类型。 由于用户代码永远不必查看 `gsl_permutation` 结构内部，相应的 Julia 包装器只需要一个新的类型声明 `gsl_permutation`，它没有内部字段，其唯一目的是放置在 `Ptr`类型的类型参数中。 [`ccall`](@ref) 的返回类型声明为 `Ptr{gsl_permutation}`，因为 `output_ptr` 分配和指向的内存由 C 控制。

输入 `n` 是按值传递的，因此函数的输入签名被简单地声明为 `(Csize_t,)`，不需要任何 `Ref` 或 `Ptr`。 （如果包装器改为调用 Fortran 函数，则相应的函数输入签名将改为 `(Ref{Csize_t},)`，因为 Fortran 变量是通过指针传递的。）此外，`n` 可以是任何可转换的类型 到一个 `Csize_t` 整数； [`ccall`](@ref) 隐式调用 [`Base.cconvert(Csize_t, n)`](@ref)。

这是包装相应析构函数的第二个示例：

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

这里，输入`p`被声明为`Ref{gsl_permutation}`类型，这意味着`p`指向的内存可以由Julia或C管理。由C分配的内存指针应该是类型 `Ptr{gsl_permutation}`，但它可以使用 [`Base.cconvert` ](@ref) 进行转换，因此

现在，如果你仔细观察这个例子，你可能会注意到它是不正确的，因为我们上面对首选声明类型的解释。 你看到了吗？ 我们正在调用的函数将释放内存。 这种类型的操作不能被赋予 Julia 对象（它会崩溃或导致内存损坏）。因此，将 `p` 类型声明为 `Ptr{gsl_permutation }` 可能更可取，这样用户就更难错误地传递另一种对象，而不是通过 `gsl_permutation_alloc` 获得的对象。

如果 C 包装器从不希望用户将指针传递给 Julia 管理的内存，那么使用 `p::Ptr{gsl_permutation}` 作为包装器的方法签名，类似地在 [`ccall`](@ref) 中也是可以接受。

这是传递 Julia 数组的第三个示例：

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

包装的 C 函数返回一个整数错误代码； Bessel J 函数的实际评估结果填充 Julia 数组 `result_array`。 这个变量被声明为一个 `Ref{Cdouble}`，因为它的内存是由 Julia 分配和管理的。 对 [`Base.cconvert(Ref{Cdouble}, result_array)`](@ref) 的隐式调用将指向 Julia 数组数据结构的 Julia 指针解包为 C 可以理解的形式。

## Fortran 包装器示例

以下示例利用 ccall 调用通用 Fortran 库 (libBLAS) 中的函数来计算点积。 请注意，这里的参数映射与上面的有点不同，因为我们需要从 Julia 映射到 Fortran。 在每个参数类型上，我们指定 `Ref` 或 `Ptr`。 此修改约定可能特定于你的 Fortran 编译器和操作系统，并且可能未记录在案。 但是，将每个包装在一个 `Ref`（或 `Ptr`，等效地）中是 Fortran 编译器实现的一个常见要求：

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

将数据传递给 [`ccall`](@ref) 时，最好避免使用 [`pointer`](@ref) 函数。 而是定义一个转换方法并将变量直接传递给 [`ccall`](@ref)。 [`ccall`](@ref) 自动安排它的所有参数都将从垃圾收集中保留，直到调用返回。 如果 C API 将存储对 Julia 分配的内存的引用，则在 [`ccall`](@ref) 返回后，你必须确保该对象对垃圾收集器保持可见。 建议的方法是创建一个类型为 `Array{Ref,1}` 的全局变量来保存这些值，直到 C 库通知你它已完成使用它们。

每当你创建了一个指向 Julia 数据的指针时，你必须确保原始数据存在，直到你完成使用该指针。 Julia 中的许多方法，例如 [`unsafe_load`](@ref) 和 [`String`](@ref) 复制数据而不是获取缓冲区的所有权，因此可以安全地释放（或更改）原始数而不影响 Julia。 一个值得注意的例外是 [`unsafe_wrap`](@ref)，出于性能原因，它共享（或可以被告知拥有）底层缓冲区。

垃圾收集器不保证任何终结顺序。 也就是说，如果 `a` 包含对 `b` 的引用，并且 `a` 和 `b` 都需要进行垃圾回收，则不能保证 `b` 会在 `a` 之后完成。 如果 `a` 的正确终结取决于 `b` 是否有效，则必须以其他方式处理。

## 非常数函数规范

在某些情况下，所需库的确切名称或路径是事先未知的，必须在运行时计算。 为了处理这种情况，`(name, library)` 规范的库组件可以是一个函数调用，例如 `(:dgemm_, find_blas())`。 调用表达式将在执行 `ccall` 本身时执行。 但是，假设库位置一旦确定就不会改变，因此调用的结果可以被缓存和重用。 因此，表达式执行的次数是未指定的，多次调用返回不同的值会导致未指定的行为。

如果需要更大的灵活性，可以通过 [`eval`](@ref) 分段使用计算值作为函数名称，如下所示：

```
@eval ccall(($(string("a", "b")), "lib"), ...
```

此表达式使用 `string` 构造一个名称，然后将此名称替换为一个新的 [`ccall`](@ref) 表达式，然后对其进行评估。 请记住，`eval` 仅在顶层运行，因此在此表达式中局部变量将不可用（除非它们的值被替换为 `$`）。 出于这个原因，`eval` 通常仅用于形成顶级定义，例如在包装包含许多类似函数的库时。 可以为 [`@cfunction`](@ref) 构造一个类似的示例。

但是，这样做也会很慢并且会泄漏内存，因此你通常应该避免这种情况，而是继续阅读。 下一节讨论如何使用间接调用来有效地实现类似的效果。

## 非直接调用

[`ccall`](@ref) 的第一个参数也可以是在运行时计算的表达式。 在这种情况下，表达式的计算结果必须为 `Ptr`，它将用作要调用的本地函数的地址。 当第一个 [`ccall`](@ref) 参数包含对非常量（例如局部变量、函数参数或非常量全局变量）的引用时，会发生此行为。

例如，你可以通过 `dlsym` 查找函数，然后将其缓存在该会话的共享引用中。 例如：

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

## cfunction 闭包

[`@cfunction`](@ref) 的第一个参数可以用 `$` 标记，在这种情况下，返回值将改为结束参数的 `struct CFunction`。 你必须确保此返回对象保持活动状态，直到完成对它的所有使用。 当这个引用被删除和 atexit 时，cfunction 指针处的内容和代码将通过 [`finalizer`](@ref) 删除。 这通常不是必需的，因为此功能在 C 中不存在，但对于处理不提供单独的闭包环境参数的设计不良的 API 很有用。

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
    闭包 [`@cfunction`](@ref) 依赖于 LLVM Trampolines，并非在所有平台（例如 ARM 和 PowerPC）上都可用。


## 关闭库

关闭（卸载）库以便重新加载有时很有用。 例如，在开发与 Julia 一起使用的 C 代码时，可能需要编译、从 Julia 调用 C 代码，然后关闭库、进行编辑、重新编译并加载新的更改。 可以重新启动 Julia 或使用 `Libdl` 函数来显式管理库，例如：

```julia
lib = Libdl.dlopen("./my_lib.so") # 显式打开库
sym = Libdl.dlsym(lib, :my_fcn)   # 获得用于调用函数的符号
ccall(sym, ...) # 直接用指针 `sym` 而不是 (symbol, library) 元组，其余参数保持不变
Libdl.dlclose(lib) # 显式关闭库
```

请注意，当将 `ccall` 与输入元组（例如，`ccall((:my_fcn, "./my_lib.so"), ...)`）一起使用时，库会隐式打开，并且可能不会显式关闭。

## 调用规约

[`ccall`](@ref) 的第二个参数可以选择是调用约定说明符（直接在返回类型之前）。 没有任何说明符，使用平台默认的 C 调用约定。 其他支持的约定是：`stdcall`、`cdecl`、`fastcall` 和`thiscall`（64 位Windows 上无操作）。 例如（来自`base/libc.jl`）我们看到与上面相同的`gethostname`[`ccall`](@ref)，但具有正确的Windows签名：

```julia
hn = Vector{UInt8}(undef, 256)
err = ccall(:gethostname, stdcall, Int32, (Ptr{UInt8}, UInt32), hn, length(hn))
```

请参阅 [LLVM Language Reference](http://llvm.org/docs/LangRef.html#calling-conventions) 来获得更多信息。

还有一个额外的特殊调用约定 [`llvmcall`](@ref Base.llvmcall)，它允许直接插入对 LLVM 内部函数的调用。 这在针对不常见的平台（例如 GPGPU）时特别有用。 例如，对于[CUDA](http://llvm.org/docs/NVPTXUsage.html)，我们需要能够读取线程索引：

```julia
ccall("llvm.nvvm.read.ptx.sreg.tid.x", llvmcall, Int32, ())
```

与任何 `ccall` 一样，参数签名必须完全正确。另外，请注意，与`Core.Intrinsics`开放的等效Julia函数不同，没有兼容层级可以确保内在函数有意义并在当前目标上工作。

## 访问全局变量

可以使用 [`cglobal`](@ref) 函数按名称访问本地库导出的全局变量。 [`cglobal`](@ref) 的参数与 [`ccall`](@ref) 使用相同的符号规范，以及描述存储在变量中的值的类型：

```julia-repl
julia> cglobal((:errno, :libc), Int32)
Ptr{Int32} @0x00007f418d0816b8
```

结果是一个给出值地址的指针。 可以使用 [`unsafe_load`](@ref) 和 [`unsafe_store!`](@ref) 通过这个指针来操作该值。

!!! note
    在名为“libc”的库中可能找不到此 `errno` 符号，因为这是系统编译器的实现细节。 通常标准库符号应该只通过名称访问，允许编译器填写正确的符号。 然而，这个例子中显示的 `errno` 符号在大多数编译器中都是特殊的，所以这里看到的值可能不是你所期望或想要的。 在任何支持多线程的系统上用 C 编译等效代码通常实际上会调用不同的函数（通过宏预处理器重载），并且可能给出与此处打印的遗留值不同的结果。

## 通过指针来访问数据

以下方法被描述为“不安全”，因为错误的指针或类型声明会导致 Julia 突然终止。

给定一个 `Ptr{T}`，通常可以使用 `unsafe_load(ptr, [index])` 将 `T` 类型的内容从引用的内存复制到 Julia 对象中。 index 参数是可选的（默认为 1），并遵循基于 1 的索引的 Julia 惯例。 此函数类似于 [`getindex`](@ref) 和 [`setindex!`](@ref) 的行为（例如`[]` 访问语法）。

返回值将是一个初始化为包含引用内存内容副本的新对象。 引用的内存可以安全地释放或释放。

如果 `T` 是 `Any`，则假定内存包含对 Julia 对象的引用（`jl_value_t*`），结果将是对该对象的引用，并且不会复制该对象。 在这种情况下，你必须小心确保对象始终对垃圾收集器可见（指针不计数，但新引用计数）以确保内存不会过早释放。 请注意，如果对象最初不是由 Julia 分配的，则新对象将永远不会被 Julia 的垃圾收集器终结。 如果 `Ptr` 本身实际上是一个 `jl_value_t*`，它可以通过 [`unsafe_pointer_to_objref(ptr)`](@ref) 转换回 Julia 对象引用。 （Julia 值 `v` 可以通过调用 [`pointer_from_objref(v)`](@ref) 转换为 `jl_value_t*` 指针，如 `Ptr{Cvoid}`。）

可以使用 [`unsafe_store!(ptr, value, [index])`](@ref) 执行反向操作（将数据写入 `Ptr{T}`）。 目前，这仅支持原始类型或其他无指针（`isbits`）不可变结构类型。

任何引发错误的操作目前可能尚未实现，应作为错误发布，以便解决。

如果感兴趣的指针是纯数据数组（原始类型或不可变结构），则函数 [`unsafe_wrap(Array, ptr,dims, own = false)`](@ref) 可能更有用。 如果 Julia 应该“获得”底层缓冲区的所有权并在返回的 `Array` 对象最终确定时调用 `free(ptr)`，则最后一个参数应该为 true。 如果省略了 `own` 参数或为 false，则调用者必须确保缓冲区一直存在，直到所有访问完成。

Julia 中 `Ptr` 类型的算术（例如使用 `+`）与 C 的指针算术的行为不同。 将整数添加到 Julia 中的 `Ptr` 总是将指针移动一定数量的 *bytes*，而不是元素。 这样，通过指针运算获得的地址值不依赖于指针的元素类型。

## 线程安全

一些 C 库从不同的线程执行它们的回调，并且由于 Julia 不是线程安全的，因此你需要采取一些额外的预防措施。 特别是，你需要设置一个两层系统：C 回调应该只 *安排*（通过 Julia 的事件循环）执行“真实”回调。 为此，创建一个 [`AsyncCondition`](@ref Base.AsyncCondition) 对象并在其上创建 [`wait`](@ref)：

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
