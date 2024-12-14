# 代码风格指南

接下来的部分将介绍如何写出具有 Julia 风格的代码。当然，这些规则并不是绝对的，它们只是一些建议，以便更好地帮助你熟悉这门语言，以及在不同的代码设计中做出选择。

## 缩进

每个缩进级别使用 4 个空格。

## 写函数，而不是仅仅写脚本

一开始解决问题的时候，直接从最外层一步步写代码的确很便捷，但你应该尽早地将代码组织成函数。函数有更强的复用性和可测试性，并且能更清楚地让人知道哪些步骤做完了，以及每一步骤的输入输出分别是什么。此外，由于 Julia 编译器特殊的工作方式，写在函数中的代码往往要比最外层的代码运行地快得多。

此外值得一提的是，函数应当接受参数，而不是直接使用全局变量进行操作（[`pi`](@ref) 等常数除外）。

## 类型不要写得过于具体

代码应该写得尽可能通用。例如，下面这段代码:

```julia
Complex{Float64}(x)
```

更好的写法是写成下面的通用函数：

```julia
complex(float(x))
```

第二个版本会把 `x` 转换成合适的类型，而不是某个写死的类型。

这种代码风格与函数的参数尤其相关。例如，当一个参数可以是任何整型时，不要将它的类型声明为 `Int` 或 [`Int32`](@ref)，而要使用抽象类型（abstract type）[`Integer`](@ref) 来表示。事实上，除非确实需要将其与其它的方法定义区分开，很多情况下你可以干脆完全省略掉参数的类型，因为如果你的操作中有不支持某种参数类型的操作的话，反正都会抛出 [`MethodError`](@ref) 的。这也称作 [鸭子类型](https://zh.wikipedia.org/wiki/%E9%B8%AD%E5%AD%90%E7%B1%BB%E5%9E%8B)）。

例如，考虑这样的一个叫做 `addone` 的函数，其返回值为它的参数加 1 ：

```julia
addone(x::Int) = x + 1                 # works only for Int
addone(x::Integer) = x + oneunit(x)    # any integer type
addone(x::Number) = x + oneunit(x)     # any numeric type
addone(x) = x + oneunit(x)             # any type supporting + and oneunit
```

最后一种定义可以处理所有支持 [`oneunit`](@ref) （返回和 `x` 相同类型的 1，以避免不需要的类型提升（type promotion））以及 [`+`](@ref) 函数的类型。这里的关键点在于，**只**定义通用的 `addone(x) = x + oneunit(x)` 并**不会**带来性能上的损失，因为 Julia 会在需要的时候自动编译特定的版本。比如说，当第一次调用 `addone(12)` 时，Julia 会自动编译一个特定的 `addone` 函数，它接受一个 `x::Int` 的参数，并把调用的 `oneunit` 替换为内连的值 `1`。因此，上述的前三种 `addone` 的定义对于第四种来说是完全多余的。

## 让调用者处理多余的参数多样性

如下的代码：

```julia
function foo(x, y)
    x = Int(x); y = Int(y)
    ...
end
foo(x, y)
```

请写成这样：

```julia
function foo(x::Int, y::Int)
    ...
end
foo(Int(x), Int(y))
```

这种风格更好，因为 `foo` 函数其实不需要接受所有类型的数，而只需要接受 `Int`。

这里的关键在于，如果一个函数需要处理的是整数，强制让调用者来决定非整数如何被转换（比如说向下还是向上取整）会更好。同时，把类型声明得具体一些的话可以为以后的方法定义留有更多的空间。

## [在修改其参数的函数名称后加 `!`](@id bang-convention)

如下的代码：

```julia
function double(a::AbstractArray{<:Number})
    for i = firstindex(a):lastindex(a)
        a[i] *= 2
    end
    return a
end
```

请写成这样：

```julia
function double!(a::AbstractArray{<:Number})
    for i = firstindex(a):lastindex(a)
        a[i] *= 2
    end
    return a
end
```

Julia 的 Base 模块中的函数都遵循了这种规范，且包含很多例子：有的函数同时有拷贝和修改的形式（比如 [`sort`](@ref) 和 [`sort!`](@ref)），还有一些只有修改（比如 [`push!`](@ref)，[`pop!`](@ref) 和 [`splice!`](@ref)）。为了方便起见，这类函数通常也会把修改后的数组作为返回值。

Functions related to IO or making use of random number generators (RNG) are notable exceptions:
Since these functions almost invariably must mutate the IO or RNG, functions ending with `!` are used to signify a mutation _other_ than mutating the IO or advancing the RNG state.
For example, `rand(x)` mutates the RNG, whereas `rand!(x)` mutates both the RNG and `x`; similarly, `read(io)` mutates `io`, whereas `read!(io, x)` mutates both arguments.

## 避免使用奇怪的 `Union` 类型

使用 `Union{Function,AbstractString}` 这样的类型的时候通常意味着设计还不够清晰。

## 避免复杂的容器类型

像下面这样构造数组通常没有什么好处：

```julia
a = Vector{Union{Int,AbstractString,Tuple,Array}}(undef, n)
```

这种情况下，`Vector{Any}(undef, n)`更合适些。此外，相比将所有可能的类型都打包在一起，直接在使用时标注具体的数据类型（比如：`a[i]::Int`）对编译器来说更有用。

## 方法导出优先于直接字段访问

Idiomatic Julia code should generally treat a module's exported methods as the
interface to its types. An object's fields are generally considered
implementation details and user code should only access them directly if this
is stated to be the API. This has several benefits:

- Package developers are freer to change the implementation without breaking
  user code.
- Methods can be passed to higher-order constructs like [`map`](@ref) (e.g.
  `map(imag, zs)`) rather than `[z.im for z in zs]`).
- Methods can be defined on abstract types.
- Methods can describe a conceptual operation that can be shared across
  disparate types (e.g. `real(z)` works on Complex numbers or Quaternions).

Julia's dispatch system encourages this style because `play(x::MyType)` only
defines the `play` method on that particular type, leaving other types to
have their own implementation.

Similarly, non-exported functions are typically internal and subject to change,
unless the documentations states otherwise. Names sometimes are given a `_` prefix
(or suffix) to further suggest that something is "internal" or an
implementation-detail, but it is not a rule.

Counter-examples to this rule include [`NamedTuple`](@ref), [`RegexMatch`](@ref match), [`StatStruct`](@ref stat).

## Use naming conventions consistent with Julia `base/`

  * modules and type names use capitalization and camel case: `module SparseArrays`, `struct UnitRange`.
  * functions are lowercase ([`maximum`](@ref), [`convert`](@ref)) and, when readable, with multiple
    words squashed together ([`isequal`](@ref), [`haskey`](@ref)). When necessary, use underscores
    as word separators. Underscores are also used to indicate a combination of concepts ([`remotecall_fetch`](@ref)
    as a more efficient implementation of `fetch(remotecall(...))`) or as modifiers.
  * functions mutating at least one of their arguments end in `!`.
  * conciseness is valued, but avoid abbreviation ([`indexin`](@ref) rather than `indxin`) as
    it becomes difficult to remember whether and how particular words are abbreviated.

包开发人员可以更自由地更改实现而不会破坏用户代码。

 

-  
   
- 方法可以传递给高阶结构，如 [`map`](@ref)（例如 `map(imag, zs)`）而不是 `[z.im for z in zs]`）。
   
- 方法可以定义在抽象类型上。
- 方法可以描述可以在不同类型之间共享的概念操作（例如 `real(z)` 适用于复数或四元数）。
   

Julia 的调度系统鼓励这种风格，因为 `play(x::MyType)` 只在该特定类型上定义了 `play` 方法，其它类型有自己的实现。

同样，除非文档另有说明，否则非导出函数通常是内部的并且可能会发生变化。 名称有时会被赋予一个 `_` 前缀（或后缀）以进一步暗示某些是“内部”或实现细节，但这不是规则。

该规则的反例包括 [`NamedTuple`](@ref)、[`RegexMatch`](@ref match)、[`StatStruct`](@ref stat)。

## 使用和 Julia `base/` 文件夹中的代码一致的命名习惯

  * module 和 type 的名字使用大写开头的驼峰命名法：`module SparseArrays`，`struct UnitRange`。
  * 函数名使用小写字母，且当可读时可以将多个单词拼在一起。必要的时候，可以使用下划线作为单词分隔符。下划线也被用于指明概念的组合（比如 [`remotecall_fetch`](@ref) 作为 `fetch(remotecall(...))` 的一个更高效的实现）或者变化。
     
     
     
  * 至少改变其中一个参数的函数名称以`!`结尾。
  * 虽然简洁性很重要，但避免使用缩写（用 [`indexin`](@ref) 而不是 `indxin`），因为这会让记住单词有没有被缩写或如何被缩写变得十分困难。
     

如果一个函数名需要多个单词，请考虑这个函数是否代表了超过一个概念，是不是分成几个更小的部分更好。

## 使用与 Julia Base 中的函数类似的参数顺序

一般来说，Base 库使用以下的函数参数顺序（如适用）：

1. **函数参数**.
   函数的第一个参数可以接受 `Function` 类型，以便使用 [`do`](@ref) blocks 来传递多行匿名函数。
    

2. **I/O stream**.
   函数的第一个参数可以接受 `IO` 对象，以便将函数传递给 [`sprint`](@ref) 之类的函数，例如 `sprint(show, x)`。
    

3. **在输入参数的内容会被更改的情况下**.
   比如，在 [`fill!(x, v)`](@ref fill!) 中，`x` 是要被修改的对象，所以放在要被插入 `x` 中的值前面。
    

4. **Type**.
   把类型作为参数传入函数通常意味着返回值也会是同样的类型。
   在 [`parse(Int, "1")`](@ref parse) 中，类型在需要解析的字符串之前。
   还有很多类似的将类型作为函数第一个参数的例子，但是同时也需要注意到例如 [`read(io, String)`](@ref read) 这样的函数中，会把 `IO` 参数放在类型的更前面，这样还是保持着这里描述的顺序。
    
    

5. **在输入参数的内容不会被更改的情况下**.
   比如在 `fill!(x, v)` 中的**不**被修改的 `v`，会放在 `x` 之后传入。

6. **Key**.
   对于关联集合来说，指的是键值对的键。
   对于其它有索引的集合来说，指的是索引。

7. **Value**.
   对于关联集合来说，指的是键值对的值。
   像[`fill!(x, v)`](@ref fill!)这样的情况, 是`v`。

8. **Everything else**.
   任何的其它参数。

9. **Varargs**.
   指的是在函数调用时可以被无限列在后面的参数。
   比如在 `Matrix{T}(uninitialized, dims)` 中，维数（dims）可以作为 [`Tuple`](@ref) 被传入（如 `Matrix{T}(uninitialized, (1,2))`），也可以作为可变参数（[`Vararg`](@ref)，如 `Matrix{T}(uninitialized, 1, 2)`。
    
    

10. **Keyword arguments**.
   在 Julia 中，关键字参数本来就不得不定义在函数定义的最后，列在这里仅仅是为了完整性。
    

大多数函数并不会接受上述所有种类的参数，这些数字仅仅是表示当适用时的优先权。

当然，在一些情况下有例外。例如，[`convert`](@ref) 函数总是把类型作为第一个参数。[`setindex!`](@ref) 函数的值参数在索引参数之前，这样可以让索引作为可变参数传入。

设计 API 时，尽可能秉承着这种一般顺序会让函数的使用者有一种更一致的体验。

## 不要过度使用 try-catch

比起依赖于捕获错误，更好的是避免错误。

## 不要给条件语句加括号

Julia 不要求在 `if` 和 `while` 后的条件两边加括号。使用如下写法：

```julia
if a == b
```

而不是:

```julia
if (a == b)
```

## 不要过度使用 `...`

拼接函数参数是会上瘾的。请用简单的 `[a; b]` 来代替 `[a..., b...]`，因为前者已经是被拼接的数组了。[`collect(a)`](@ref) 也比 `[a...]` 更好，但因为 `a` 已经是一个可迭代的变量了，通常不把它转换成数组就直接使用甚至更好。

## 不要使用不必要的静态参数

如下的函数签名：

```julia
foo(x::T) where {T<:Real} = ...
```

应当被写作：

```julia
foo(x::Real) = ...
```

尤其是当 `T` 没有被用在函数体中时格外有意义。即使 `T` 被用到了，通常也可以被替换为 [`typeof(x)`](@ref)，后者不会导致性能上的差别。注意这并不是针对静态参数的一般警告，而仅仅是针对那些不必要的情况。

同样需要注意的是，容器类型在函数调用中可能明确地需要类型参数。详情参见[避免使用带抽象容器的字段](@ref)。

## 避免判断变量是实例还是类型的混乱

如下的一组定义容易令人困惑：

```julia
foo(::Type{MyType}) = ...
foo(::MyType) = foo(MyType)
```

请决定问题里的概念应当是 `MyType` 还是 `MyType()`，然后坚持使用其一。

首选风格应是默认使用实例，只有在需要解决某些问题时才添加涉及`Type{MyType}`的方法。

如果一个类型实际上是个枚举，它应该被定义成一个单一的类型（理想的情况是不可变结构或原始类型），把枚举值作为它的实例。构造器和转换器可以检查那些值是否有效。这种设计比把枚举做成抽象类型，并把“值”做成子类型来得更受推崇。


## 不要过度使用宏

请注意有的宏实际上可以被写成一个函数。

在宏内部调用 [`eval`](@ref) 是一个特别危险的警告标志，它意味着这个宏仅在被最外层调用时起作用。如果这样的宏被写成函数，它会自然地访问得到它所需要的运行时值。

## 不要把不安全的操作暴露在接口层

如果你有一个使用本地指针的类型：

```julia
mutable struct NativeType
    p::Ptr{UInt8}
    ...
end
```

不要定义类似如下的函数：

```julia
getindex(x::NativeType, i) = unsafe_load(x.p, i)
```

这里的问题在于，这个类型的用户可能会在意识不到这个操作不安全的情况下写出 `x[i]`，然后容易遇到内存错误。

在这样的函数中，可以加上对操作的检查来确保安全，或者可以在名字的某处加上 `unsafe` 来警告调用者。

## 不要重载基础容器类型的方法

有时可能会想要写这样的定义：

```julia
show(io::IO, v::Vector{MyType}) = ...
```

这样可以提供对特定的某种新元素类型的向量的自定义显示。这种做法虽然很诱人，但应当被避免。这里的问题在于用户会想着一个像 `Vector()` 这样熟知的类型以某种方式表现，但过度自定义的行为会让使用变得更难。

## 避免类型盗版

"Type piracy" refers to the practice of extending or redefining methods in Base
or other packages on types that you have not defined. In extreme cases, you can crash Julia
(e.g. if your method extension or redefinition causes invalid input to be passed to a
`ccall`). Type piracy can complicate reasoning about code, and may introduce
incompatibilities that are hard to predict and diagnose.

例如，你也许想在一个模块中定义符号上的乘法：

```julia
module A
import Base.*
*(x::Symbol, y::Symbol) = Symbol(x,y)
end
```

这里的问题时现在其它用到 `Base.*` 的模块同样会看到这个定义。由于 `Symbol` 是定义在 Base 里再被其它模块所使用的，这可能不可预料地改变无关代码的行为。这里有几种替代的方式，包括使用一个不同的函数名称，或是把 `Symbol` 给包在另一个你自己定义的类型中。

有时候，耦合的包可能会使用类型盗版，以此来从定义分隔特性，尤其是当那些包是一些合作的作者设计的时候，且那些定义是可重用的时候。例如，一个包可能提供一些对处理色彩有用的类型，另一个包可能为那些类型定义色彩空间之间转换的方法。再举一个例子，一个包可能是一些 C 代码的简易包装，另一个包可能就“盗版”来实现一些更高级别的、对 Julia 友好的 API。

## 注意类型相等

通常会用 [`isa`](@ref) 和 [`<:`](@ref) 来对类型进行测试，而不会用到 `==`。检测类型的相等通常只对和一个已知的具体类型比较有意义（例如 `T == Float64`），或者你**真的真的**知道自己在做什么。

## 不要写 `x->f(x)`

因为调用高阶函数时经常会用到匿名函数，很容易认为这是合理甚至必要的。但任何函数都可以被直接传递，并不需要被“包"在一个匿名函数中。比如 `map(x->f(x), a)` 应当被写成 [`map(f, a)`](@ref)。

## 尽可能避免使用浮点数作为通用代码的字面量

当写处理数字，且可以处理多种不同数字类型的参数的通用代码时，请使用对参数影响（通过类型提升）尽可能少的类型的字面量。

例如，

```jldoctest
julia> f(x) = 2.0 * x
f (generic function with 1 method)

julia> f(1//2)
1.0

julia> f(1/2)
1.0

julia> f(1)
2.0
```

而应当被写作：

```jldoctest
julia> g(x) = 2 * x
g (generic function with 1 method)

julia> g(1//2)
1//1

julia> g(1/2)
1.0

julia> g(1)
2
```

如你所见，使用了 `Int` 字面量的第二个版本保留了输入参数的类型，而第一个版本没有。这是因为例如 `promote_type(Int, Float64) == Float64`，且做乘法时会需要类型提升。类似地，[`Rational`](@ref) 字面量比 [`Float64`](@ref) 字面量对类型有着更小的破坏性，但比 `Int` 大。

```jldoctest
julia> h(x) = 2//1 * x
h (generic function with 1 method)

julia> h(1//2)
1//1

julia> h(1/2)
1.0

julia> h(1)
2//1
```

所以，可能时尽量使用 `Int` 字面量，对非整数字面量使用 `Rational{Int}`，这样可以让代码变得更容易使用。
