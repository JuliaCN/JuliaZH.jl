# [类型](@id man-types)

通常，我们把程序语言中的类型系统划分成两类：静态类型和动态类型。对于静态类型系统，在程序运行之前，我们就知道每一个表达式的类型。而对于动态类型系统，我们只有通过运行那个程序，得到表达式具体的值，才能确定其具体的类型。在静态类型语言中，通常我们可以在不知道具体类型的情况下写一些代码，这种将一段代码用在多个类型的能力被称为多态性。在经典的动态类型语言中，所有的代码都是多态的，这意味着这些代码对于其中值的类型没有约束，除非在代码中去具体的判断一个值的类型，或者对对象做一些它不支持的操作。

Julia 类型系统是动态的，但通过指出某些变量是特定类型的，可以获得静态类型系统的一些优点。这对于生成高效的代码非常有帮助，但更重要的是，它允许对函数参数类型的分派派发与语言深度集成。方法分派将在[方法](@ref)中详细探讨，但它根植于此处提供的类型系统。

在类型被省略时，Julia 的默认行为是允许变量为任何类型。因此，可以编写许多有用的 Julia 函数，而无需显式使用类型。然而，当需要额外的表达力时，很容易逐渐将显式的类型注释引入先前的「无类型」代码中。添加注释主要有三个目的：利用 Julia 强大的多重分派机制、提高代码可读性和捕获程序错误。

Julia 用[类型系统](https://en.wikipedia.org/wiki/Type_system)的术语描述是动态（dynamic）、主格（nominative）和参数（parametric）的。范型可以被参数化，并且类型之间的层次关系可以被[显式地声明](https://en.wikipedia.org/wiki/Nominal_type_system)，而不是[隐含地通过兼容的结构](https://en.wikipedia.org/wiki/Structural_type_system)。Julia 类型系统的一个特别显著的特征是具体类型相互之间不能是子类型：所有具体类型都是最终的类型，并且只有抽象类型可以作为其超类型。虽然起初看起来这可能过于严格，但它有许多有益的结果，但缺点却少得出奇。事实证明，能够继承行为比继承结构更重要，同时继承两者在传统的面向对象语言中导致了重大困难。Julia 类型系统的其它高级方面应当在先言明：

  * 对象值和非对象值之间没有分别：Julia 中的所有值都是具有类型的真实对象
    其类型属于一个单独的、完全连通的类型图，该类型图的所有节点作为类型一样都是
    头等的。
  * 「编译期类型」是没有任何意义的概念：变量所具有的唯一类型是程序运行时的实际
    类型。这在面向对象被称为「运行时类型」
    ，其中静态编译和多态的组合使得这种区别变得显著。
  * 值有类型，变量没有类型——变量仅仅是绑定给值的名字而已。
  * 抽象类型和具体类型都可以通过其他类型进行参数化。它们的参数化还可
    通过符号、任意使得 [`isbits`](@ref) 返回真的类型的值（实质上，
    也就是像数字或布尔变量这样的东西，存储方式像 C 类型或不包含指向其它对象的指针的`结构体`）
    和其元组。类型参数在不需要被引用或限制时可以省略
    。

Julia 的类型系统设计得强大而富有表现力，却清晰、直观且不引人注目。许多 Julia 程序员可能从未感觉需要编写明确使用类型的代码。但是，某些场景的编程可通过声明类型变得更加清晰、简单、快速和健壮。

## 类型断言

`::`运算符可以用来在程序中给表达式和变量附加类型注释。这有两个主要原因：

1. 作为断言，帮助程序确认能是否正常运行，
2. 给编译器提供额外的类型信息，这可能帮助程序提升性能
   ，在某些情况下

当被附加到一个计算值的表达式时，`::` 操作符读作「一个 ··· 的实例」。它在任何地方都可以被用于断言左侧表达式的值是右侧类型的实例。当右侧类型是具体类型时，左侧的值必须能够以该类型作为其实现——回想一下，所有具体类型都是最终的，因此没有任何实现是任何其它具体类型的子类型。当右侧类型是抽象类型时，值是由该抽象类型子类型中的某个具体类型实现的才能满足该断言。如果类型断言非真，抛出一个异常，否则返回左侧的值：

```jldoctest
julia> (1+2)::AbstractFloat
ERROR: TypeError: in typeassert, expected AbstractFloat, got Int64

julia> (1+2)::Int
3
```

可以在任何表达式的所在位置做类型断言。

当被附加到赋值左侧的变量或作为 `local` 声明的一部分时，`::` 操作符的意义有所不同：它声明变量始终具有指定的类型，就像静态类型语言（如 C）中的类型声明。每个被赋给该变量的值都将使用 [`convert`](@ref) 转换为被声明的类型：

```jldoctest
julia> function foo()
           x::Int8 = 100
           x
       end
foo (generic function with 1 method)

julia> foo()
100

julia> typeof(ans)
Int8
```

这个特性用于避免性能“陷阱”，即给一个变量赋值时意外更改了类型。

此“声明”行为仅发生在特定上下文中：

```julia
local x::Int8  # in a local declaration
x::Int8 = 10   # as the left-hand side of an assignment
```

并适用于整个当前范围，甚至在声明之前。目前，声明类型不能用于全局范围，例如在 REPL 中就不可以，因为Julia 还没有定型的全局变量。

声明也可以附加到函数定义：

```julia
function sinc(x)::Float64
    if x == 0
        return 1
    end
    return sin(pi*x)/(pi*x)
end
```

从此函数返回的值就像对具有声明类型的变量的赋值：值始终转换为`Float64`。

## 抽象类型

抽象类型不能实例化，只能作为类型图中的节点使用，从而描述由相关具体类型组成的集合：那些作为其后代的具体类型。我们从抽象类型开始，即使它们没有实例，因为它们是类型系统的主干：它们形成了概念的层次结构，这使得 Julia 的类型系统不只是对象实现的集合。

回想一下，在 [Integers and Floating-Point Numbers](@ref) 中，我们介绍了各种数值的具体类型：[`Int8`](@ref)、[`UInt8`](@ref)、[`Int16`](@ref)、[`UInt16`](@ref)、[`Int32`](@ref)、[`UInt32`](@ref)、[`Int64`](@ref)、[`UInt64`](@ref)、[`Int128`](@ref)、[`UInt128`](@ref)、[`Float16`](@ref)、[`Float32`](@ref) 和 [`Float64`](@ref)。尽管 `Int8`、`Int16`、`Int32`、`Int64` 和 `Int128` 具有不同的表示大小，但都具有共同的特征，即它们都是带符号的整数类型。类似地，`UInt8`、`UInt16`、`UInt32`、`UInt64` 和 `UInt128` 都是无符号整数类型，而 `Float16`、`Float32` 和 `Float64` 是不同的浮点数类型而非整数类型。一段代码通常是有意义的，例如，除非它的参数是某种类型的整数，而不是真的取决于特定*类型*的整数。例如，最大公分母算法适用于所有类型的整数，但不适用于浮点数。抽象类型允许构造类型的层次结构，提供了具体类型可以适应的上下文。例如，这允许你轻松地为任何类型的整数编程，而不会将算法限制为某种特殊类型的整数。

使用 [`abstract type`](@ref) 关键字来声明抽象类型。声明抽象类型的一般语法是：

```
abstract type «name» end
abstract type «name» <: «supertype» end
```

该 `abstract type` 关键字引入了一个新的抽象类型，`«name»` 为其名称。此名称后面可以跟 [`<:`](@ref) 和一个已存在的类型，表示新声明的抽象类型是此「父」类型的子类型。

如果没有给出超类型，则默认超类型为 `Any`——一个预定义的抽象类型，所有对象都是它的实例并且所有类型都是它的子类型。在类型理论中，`Any` 通常称为"「top」，因为它位于类型图的顶点。Julia还有一个预定义的抽象「bottom」类型，在类型图的最低点，写成 `Union{}`。这与 `Any` 完全相反：任何对象都不是 `Union{}` 的实例，所有的类型都是 `Union{}` 的超类型。

让我们考虑一些构成 Julia 数值类型层次结构的抽象类型：

```julia
abstract type Number end
abstract type Real     <: Number end
abstract type AbstractFloat <: Real end
abstract type Integer  <: Real end
abstract type Signed   <: Integer end
abstract type Unsigned <: Integer end
```

[`Number`](@ref) 类型为 `Any` 类型的直接子类型，并且 [`Real`](@ref) 为它的子类型。反过来，`Real` 有两个子类型（它还有更多的子类型，但这里只展示了两个，稍后将会看到其它的子类型）： [`Integer`](@ref) 和 [`AbstractFloat`](@ref)，将世界分为整数的表示和实数的表示。实数的表示当然包括浮点类型，但也包括其他类型，例如有理数。因此，`AbstractFloat` 是一个 `Real` 的子类型，仅包括实数的浮点表示。整数被进一步细分为 [`Signed`](@ref) 和 [`Unsigned`](@ref) 两类。

`<:` 运算符的通常意义为「是···的子类型」，被用于像这样的声明中，即声明右侧类型是新声明类型的直接超类型。它也可以在表达式中用作子类型运算符，在其左操作数为其右操作数的子类型时返回 `true`：

```jldoctest
julia> Integer <: Number
true

julia> Integer <: AbstractFloat
false
```

抽象类型的一个重要用途是为具体类型提供默认实现。举个简单的例子，考虑：

```julia
function myplus(x,y)
    x+y
end
```

首先需要注意的是上述的参数声明等价于 `x::Any` 和 `y::Any`。当函数被调用时，例如 `myplus(2,5)`，分派器选择与给定参数相匹配的名称为 `myplus` 的最具体方法。（有关多重派发的更多信息，请参阅[方法](@ref)。）

假设没有找到比上述方法更具体的方法，Julia 接下来会在内部定义并编译一个名为 `myplus` 的方法，专门用于基于上面给出的范型函数的两个 `Int` 参数，即，它定义并编译：

```julia
function myplus(x::Int,y::Int)
    x+y
end
```

最后，调用这个具体的方法。

因此，抽象类型允许程序员编写范型函数，之后可以通过许多具体类型的组合将其用作默认方法。多亏了多重分派，程序员可以完全控制是使用默认方法还是更具体的方法。

需要注意的重点是，假使程序员依赖参数为抽象类型的函数，性能也不会有任何损失，因为它会针对每个调用它的参数元组的具体类型重新编译。（但是，在函数参数是抽象类型的容器的情况下，可能存在性能问题；请参阅 [Performance Tips](@ref man-performance-tips)。）

## 原始类型

原始类型是具体类型，其数据是由简单的位组成。原始类型的经典示例是整数和浮点数。与大多数语言不同，Julia 允许你声明自己的原始类型，而不是只提供一组固定的内置原始类型。实际上，标准原始类型都是在语言本身中定义的：

```julia
primitive type Float16 <: AbstractFloat 16 end
primitive type Float32 <: AbstractFloat 32 end
primitive type Float64 <: AbstractFloat 64 end

primitive type Bool <: Integer 8 end
primitive type Char <: AbstractChar 32 end

primitive type Int8    <: Signed   8 end
primitive type UInt8   <: Unsigned 8 end
primitive type Int16   <: Signed   16 end
primitive type UInt16  <: Unsigned 16 end
primitive type Int32   <: Signed   32 end
primitive type UInt32  <: Unsigned 32 end
primitive type Int64   <: Signed   64 end
primitive type UInt64  <: Unsigned 64 end
primitive type Int128  <: Signed   128 end
primitive type UInt128 <: Unsigned 128 end
```

声明原始类型的一般语法是：

```
primitive type «name» «bits» end
primitive type «name» <: «supertype» «bits» end
```

bits 的数值表示该类型需要多少存储空间，name 为新类型指定名称。可以选择将一个原始类型声明为某个超类型的子类型。如果省略超类型，则默认 `Any` 为其直接超类型。上述声明中意味着 [`Bool`](@ref) 类型需要 8 位来储存，并且直接超类型为 [`Integer`](@ref)。目前支持的大小只能是 8 位的倍数。因此，布尔值虽然确实只需要一位，但不能声明为小于 8 位的值。

[`Bool`](@ref)，[`Int8`](@ref) 和 [`UInt8`](@ref) 类型都具有相同的表现形式：它们都是 8 位内存块。然而，由于 Julia 的类型系统是主格的，它们尽管具有相同的结构，但不是通用的。它们之间的一个根本区别是它们具有不同的超类型：[`Bool`](@ref) 的直接超类型是 [`Integer`](@ref)、[`Int8`](@ref) 的是 [`Signed`](@ref) 而  [`UInt8`](@ref) 的是 [`Unsigned`](@ref)。[`Bool`](@ref)，[`Int8`](@ref) 和 [`UInt8`](@ref) 的所有其它差异是行为上的——定义函数的方式在这些类型的对象作为参数给定时起作用。这也是为什么主格的类型系统是必须的：如果结构确定类型，类型决定行为，就不可能使 [`Bool`](@ref) 的行为与 [`Int8`](@ref) 或 [`UInt8`](@ref) 有任何不同。

## 复合类型

[复合类型](https://en.wikipedia.org/wiki/Composite_data_type)在各种语言中被称为 record、struct 和 object。复合类型是命名字段的集合，其实例可以视为单个值。复合类型在许多语言中是唯一一种用户可定义的类型，也是 Julia 中最常用的用户定义类型。

在主流的面向对象语言中，比如 C++、Java、Python 和 Ruby，复合类型也具有与它们相关的命名函数，并且该组合称为「对象」。在纯粹的面向对象语言中，例如 Ruby 或 Smalltalk，所有值都是对象，无论它们是否为复合类型。在不太纯粹的面向对象语言中，包括 C++ 和 Java，一些值，比如整数和浮点值，不是对象，而用户定义的复合类型是具有相关方法的真实对象。在 Julia 中，所有值都是对象，但函数不与它们操作的对象捆绑在一起。这是必要的，因为 Julia 通过多重分派选择函数使用的方法，这意味着在选择方法时考虑*所有*函数参数的类型，而不仅仅是第一个（有关方法和分派的更多信息，请参阅[方法](@ref)）。因此，函数仅仅「属于」它们的第一个参数是不合适的。将方法组织到函数对象中而不是在每个对象「内部」命名方法最终成为语言设计中一个非常有益的方面。

[`struct`](@ref) 关键字与复合类型一起引入，后跟一个字段名称的块，可选择使用`::`运算符注释类型：

```jldoctest footype
julia> struct Foo
           bar
           baz::Int
           qux::Float64
       end
```

没有类型注释的字段默认为 `Any` 类型，所以可以包含任何类型的值。

类型为 `Foo` 的新对象通过将 `Foo` 类型对象像函数一样应用于其字段的值来创建：

```jldoctest footype
julia> foo = Foo("Hello, world.", 23, 1.5)
Foo("Hello, world.", 23, 1.5)

julia> typeof(foo)
Foo
```

当像函数一样使用类型时，它被称为*构造函数*。有两个构造函数会被自动生成（这些构造函数称为*默认构造函数*）。一个接受任何参数并通过调用 [`convert`](@ref) 函数将它们转换为字段的类型，另一个接受与字段类型完全匹配的参数。两者都生成的原因是，这使得更容易添加新定义而不会在无意中替换默认构造函数。

由于 `bar` 字段在类型上不受限制，因此任何值都可以。但是 `baz` 的值必须可转换为 `Int` 类型：

```jldoctest footype
julia> Foo((), 23.5, 1)
ERROR: InexactError: Int64(Int64, 23.5)
Stacktrace:
[...]
```

可以使用 [`fieldnames`](@ref) 函数找到字段名称列表。

```jldoctest footype
julia> fieldnames(Foo)
(:bar, :baz, :qux)
```

可以使用传统的 `foo.bar` 表示法访问复合对象的字段值：

```jldoctest footype
julia> foo.bar
"Hello, world."

julia> foo.baz
23

julia> foo.qux
1.5
```

使用 `struct` 声明的对象都是*不可变的*，它们在构造后无法修改。一开始看来这很奇怪，但它有几个优点：

  * 它可以更高效。某些 struct 可以被高效地打包到数组中，并且在某些情况下，编译器可以完全避免分配不可变对象。
  * 不可能违反由类型的构造函数提供的不变性。
  * 使用不可变对象的代码更容易推理。

不可变对象可以包含可变对象（比如数组）作为字段。那些被包含的对象将保持可变；只是不可变对象本身的字段不能更改为指向不同的对象。

如果需要，可以使用关键字 [`mutable struct`](@ref) 声明可变复合对象，这将在下一节中讨论

没有字段的不可变复合类型是单态类型；这种类型只能有一个实例：

```jldoctest
julia> struct NoFields
       end

julia> NoFields() === NoFields()
true
```

[`===`](@ref) 函数用来确认构造出来的「两个」`NoFields` 实例实际上是同一个。单态类型将在[下面](@ref man-singleton-types)进一步详细描述。

关于如何构造复合类型的实例还有很多要说的，但这种讨论依赖于[参数类型](@ref)和[方法](@ref)，并且这是非常重要的，应该在专门的章节中讨论：[构造函数](@ref man-constructors)。

## 可变复合类型

如果使用 `mutable struct` 而不是 `struct` 声明复合类型，则它的实例可以被修改：

```jldoctest bartype
julia> mutable struct Bar
           baz
           qux::Float64
       end

julia> bar = Bar("Hello", 1.5);

julia> bar.qux = 2.0
2.0

julia> bar.baz = 1//2
1//2
```

为了支持修改，这种对象通常分配在堆上，并且具有稳定的内存地址。可变对象就像一个小容器，随着时间的推移，可能保持不同的值，因此只能通过其地址可靠地识别。相反地，不可变类型的实例与特定字段值相关——仅字段值就告诉你该对象的所有内容。在决定是否使类型为可变类型时，请询问具有相同字段值的两个实例是否被视为相同，或者它们是否可能需要随时间独立更改。如果它们被认为是相同的，该类型就应该是不可变的。

总结一下，Julia 的两个基本属性定义了不变性：

  * 不允许修改不可变类型的值。
    * 对于位类型，这意味着值的位模式一旦设置将不再改变，并且该值是位类型的标识。
    * 对于复合类型，这意味着其字段值的标识将不再改变。当字段是位类型时，这意味着它们的位将不再改变，对于其值是可变类型（如数组）的字段，这意味着字段将始终引用相同的可变值，尽管该可变值的内容本身可能被修改。
  * 具有不可变类型的对象可以被编译器自由复制，因为其不可变性使得不可能以编程方式区分原始对象和副本。
    * 特别地，这意味着足够小的不可变值（如整数和浮点数）通常在寄存器（或栈分配）中传递给函数。
    * 另一方面，可变值是堆分配的，并作为指向堆分配值的指针传递给函数，除非编译器确定没有办法知道这不是正在发生的事情。

## 已声明的类型

前面章节中讨论的三种类型（抽象、原始、复合）实际上都是密切相关的。它们共有相同的关键属性：
  * 它们都是显式声明的。
  * 它们都具有名称。
  * 它们都已经显式声明超类型。
  * 它们可以有参数。

由于这些共有属性，它们在内部表现为相同概念 `DataType` 的实例，其是任何这些类型的类型：

```jldoctest
julia> typeof(Real)
DataType

julia> typeof(Int)
DataType
```

`DataType` 可以是抽象的或具体的。它如果是具体的，就具有指定的大小、存储布局和字段名称（可选）。因此，原始类型是具有非零大小的 `DataType`，但没有字段名称。复合类型是具有字段名称或者为空（大小为零）的 `DataType`。

每一个具体的值在系统里都是某个 `DataType` 的实例。

## Type Unions

类型共用体是一种特殊的抽象类型，它包含作为对象的任何参数类型的所有实例，使用特殊[`Union`](@ref)关键字构造：

```jldoctest
julia> IntOrString = Union{Int,AbstractString}
Union{Int64, AbstractString}

julia> 1 :: IntOrString
1

julia> "Hello!" :: IntOrString
"Hello!"

julia> 1.0 :: IntOrString
ERROR: TypeError: in typeassert, expected Union{Int64, AbstractString}, got Float64
```

The compilers for many languages have an internal union construct for reasoning about types; Julia
simply exposes it to the programmer. The Julia compiler is able to generate efficient code in the
presence of `Union` types with a small number of types [^1], by generating specialized code
in separate branches for each possible type.

A particularly useful case of a `Union` type is `Union{T, Nothing}`, where `T` can be any type and
[`Nothing`](@ref) is the singleton type whose only instance is the object [`nothing`](@ref). This pattern
is the Julia equivalent of [`Nullable`, `Option` or `Maybe`](https://en.wikipedia.org/wiki/Nullable_type)
types in other languages. Declaring a function argument or a field as `Union{T, Nothing}` allows
setting it either to a value of type `T`, or to `nothing` to indicate that there is no value.
See [this FAQ entry](@ref faq-nothing) for more information.

## Parametric Types

An important and powerful feature of Julia's type system is that it is parametric: types can take
parameters, so that type declarations actually introduce a whole family of new types -- one for
each possible combination of parameter values. There are many languages that support some version
of [generic programming](https://en.wikipedia.org/wiki/Generic_programming), wherein data structures
and algorithms to manipulate them may be specified without specifying the exact types involved.
For example, some form of generic programming exists in ML, Haskell, Ada, Eiffel, C++, Java, C#,
F#, and Scala, just to name a few. Some of these languages support true parametric polymorphism
(e.g. ML, Haskell, Scala), while others support ad-hoc, template-based styles of generic programming
(e.g. C++, Java). With so many different varieties of generic programming and parametric types
in various languages, we won't even attempt to compare Julia's parametric types to other languages,
but will instead focus on explaining Julia's system in its own right. We will note, however, that
because Julia is a dynamically typed language and doesn't need to make all type decisions at compile
time, many traditional difficulties encountered in static parametric type systems can be relatively
easily handled.

All declared types (the `DataType` variety) can be parameterized, with the same syntax in each
case. We will discuss them in the following order: first, parametric composite types, then parametric
abstract types, and finally parametric primitive types.

### Parametric Composite Types

Type parameters are introduced immediately after the type name, surrounded by curly braces:

```jldoctest pointtype
julia> struct Point{T}
           x::T
           y::T
       end
```

This declaration defines a new parametric type, `Point{T}`, holding two "coordinates" of type
`T`. What, one may ask, is `T`? Well, that's precisely the point of parametric types: it can be
any type at all (or a value of any bits type, actually, although here it's clearly used as a type).
`Point{Float64}` is a concrete type equivalent to the type defined by replacing `T` in the definition
of `Point` with [`Float64`](@ref). Thus, this single declaration actually declares an unlimited
number of types: `Point{Float64}`, `Point{AbstractString}`, `Point{Int64}`, etc. Each of these
is now a usable concrete type:

```jldoctest pointtype
julia> Point{Float64}
Point{Float64}

julia> Point{AbstractString}
Point{AbstractString}
```

The type `Point{Float64}` is a point whose coordinates are 64-bit floating-point values, while
the type `Point{AbstractString}` is a "point" whose "coordinates" are string objects (see [Strings](@ref)).

`Point` itself is also a valid type object, containing all instances `Point{Float64}`, `Point{AbstractString}`,
etc. as subtypes:

```jldoctest pointtype
julia> Point{Float64} <: Point
true

julia> Point{AbstractString} <: Point
true
```

当然，其他类型不是它的子类型：

```jldoctest pointtype
julia> Float64 <: Point
false

julia> AbstractString <: Point
false
```

`Point`不同`T`值所声明的具体类型之间，不能互相作为子类型：

```jldoctest pointtype
julia> Point{Float64} <: Point{Int64}
false

julia> Point{Float64} <: Point{Real}
false
```

!!! warning
    This last point is *very* important: even though `Float64 <: Real` we **DO NOT** have `Point{Float64} <: Point{Real}`.

In other words, in the parlance of type theory, Julia's type parameters are *invariant*, rather
than being [covariant (or even contravariant)](https://en.wikipedia.org/wiki/Covariance_and_contravariance_%28computer_science%29). This is for practical reasons: while any instance
of `Point{Float64}` may conceptually be like an instance of `Point{Real}` as well, the two types
have different representations in memory:

  * An instance of `Point{Float64}` can be represented compactly and efficiently as an immediate pair
    of 64-bit values;
  * An instance of `Point{Real}` must be able to hold any pair of instances of [`Real`](@ref).
    Since objects that are instances of `Real` can be of arbitrary size and structure, in
    practice an instance of `Point{Real}` must be represented as a pair of pointers to
    individually allocated `Real` objects.

The efficiency gained by being able to store `Point{Float64}` objects with immediate values is
magnified enormously in the case of arrays: an `Array{Float64}` can be stored as a contiguous
memory block of 64-bit floating-point values, whereas an `Array{Real}` must be an array of pointers
to individually allocated [`Real`](@ref) objects -- which may well be
[boxed](https://en.wikipedia.org/wiki/Object_type_%28object-oriented_programming%29#Boxing)
64-bit floating-point values, but also might be arbitrarily large, complex objects, which are
declared to be implementations of the `Real` abstract type.

Since `Point{Float64}` is not a subtype of `Point{Real}`, the following method can't be applied
to arguments of type `Point{Float64}`:

```julia
function norm(p::Point{Real})
    sqrt(p.x^2 + p.y^2)
end
```

一种正确的方法来定义一个接受类型的所有参数的方法，`Point{T}`其中`T`是一个子类型[`Real`](@ref)：

```julia
function norm(p::Point{<:Real})
    sqrt(p.x^2 + p.y^2)
end
```

(等效地, 另一种定义方法 `function norm(p::Point{T} where T<:Real)` 或`function norm(p::Point{T}) where T<:Real`; 查看[UnionAll Types](@ref).)

稍后将在[方法](@ref)中讨论更多示例。

How does one construct a `Point` object? It is possible to define custom constructors for composite
types, which will be discussed in detail in [Constructors](@ref man-constructors), but in the absence of any special
constructor declarations, there are two default ways of creating new composite objects, one in
which the type parameters are explicitly given and the other in which they are implied by the
arguments to the object constructor.

Since the type `Point{Float64}` is a concrete type equivalent to `Point` declared with [`Float64`](@ref)
in place of `T`, it can be applied as a constructor accordingly:

```jldoctest pointtype
julia> Point{Float64}(1.0, 2.0)
Point{Float64}(1.0, 2.0)

julia> typeof(ans)
Point{Float64}
```

对于默认的构造函数，必须为每个字段提供一个参数：

```jldoctest pointtype
julia> Point{Float64}(1.0)
ERROR: MethodError: no method matching Point{Float64}(::Float64)
[...]

julia> Point{Float64}(1.0,2.0,3.0)
ERROR: MethodError: no method matching Point{Float64}(::Float64, ::Float64, ::Float64)
[...]
```

Only one default constructor is generated for parametric types, since overriding it is not possible.
This constructor accepts any arguments and converts them to the field types.

In many cases, it is redundant to provide the type of `Point` object one wants to construct, since
the types of arguments to the constructor call already implicitly provide type information. For
that reason, you can also apply `Point` itself as a constructor, provided that the implied value
of the parameter type `T` is unambiguous:

```jldoctest pointtype
julia> Point(1.0,2.0)
Point{Float64}(1.0, 2.0)

julia> typeof(ans)
Point{Float64}

julia> Point(1,2)
Point{Int64}(1, 2)

julia> typeof(ans)
Point{Int64}
```

在上例中，当且仅当两个参数类型相同时，`T`的类型才能明确暗示，同时'Point`具有相同的类型。如果不是这种情况，即参数类型不同时，构造函数将失败并显示[`MethodError`](@ref)：

```jldoctest pointtype
julia> Point(1,2.5)
ERROR: MethodError: no method matching Point(::Int64, ::Float64)
Closest candidates are:
  Point(::T, !Matched::T) where T at none:2
```

可以定义适当处理此类混合情况的函数构造方法，将在后面的[构造函数](@ref man-constructors)中讨论。

### Parametric Abstract Types

Parametric abstract type declarations declare a collection of abstract types, in much the same
way:

```jldoctest pointytype
julia> abstract type Pointy{T} end
```

With this declaration, `Pointy{T}` is a distinct abstract type for each type or integer value
of `T`. As with parametric composite types, each such instance is a subtype of `Pointy`:

```jldoctest pointytype
julia> Pointy{Int64} <: Pointy
true

julia> Pointy{1} <: Pointy
true
```

Parametric abstract types are invariant, much as parametric composite types are:

```jldoctest pointytype
julia> Pointy{Float64} <: Pointy{Real}
false

julia> Pointy{Real} <: Pointy{Float64}
false
```

The notation `Pointy{<:Real}` can be used to express the Julia analogue of a
*covariant* type, while `Pointy{>:Int}` the analogue of a *contravariant* type,
but technically these represent *sets* of types (see [UnionAll Types](@ref)).
```jldoctest pointytype
julia> Pointy{Float64} <: Pointy{<:Real}
true

julia> Pointy{Real} <: Pointy{>:Int}
true
```

Much as plain old abstract types serve to create a useful hierarchy of types over concrete types,
parametric abstract types serve the same purpose with respect to parametric composite types. We
could, for example, have declared `Point{T}` to be a subtype of `Pointy{T}` as follows:

```jldoctest pointytype
julia> struct Point{T} <: Pointy{T}
           x::T
           y::T
       end
```

鉴于此类声明，对每个`T` ，都有 `Point{T}` 是 `Pointy{T}` 的子类型：

```jldoctest pointytype
julia> Point{Float64} <: Pointy{Float64}
true

julia> Point{Real} <: Pointy{Real}
true

julia> Point{AbstractString} <: Pointy{AbstractString}
true
```

它们仍然不互为子类：

```jldoctest pointytype
julia> Point{Float64} <: Pointy{Real}
false

julia> Point{Float64} <: Pointy{<:Real}
true
```

What purpose do parametric abstract types like `Pointy` serve? Consider if we create a point-like
implementation that only requires a single coordinate because the point is on the diagonal line
*x = y*:

```jldoctest pointytype
julia> struct DiagPoint{T} <: Pointy{T}
           x::T
       end
```

Now both `Point{Float64}` and `DiagPoint{Float64}` are implementations of the `Pointy{Float64}`
abstraction, and similarly for every other possible choice of type `T`. This allows programming
to a common interface shared by all `Pointy` objects, implemented for both `Point` and `DiagPoint`.
This cannot be fully demonstrated, however, until we have introduced methods and dispatch in the
next section, [Methods](@ref).

There are situations where it may not make sense for type parameters to range freely over all
possible types. In such situations, one can constrain the range of `T` like so:

```jldoctest realpointytype
julia> abstract type Pointy{T<:Real} end
```

With such a declaration, it is acceptable to use any type that is a subtype of
[`Real`](@ref) in place of `T`, but not types that are not subtypes of `Real`:

```jldoctest realpointytype
julia> Pointy{Float64}
Pointy{Float64}

julia> Pointy{Real}
Pointy{Real}

julia> Pointy{AbstractString}
ERROR: TypeError: in Pointy, in T, expected T<:Real, got Type{AbstractString}

julia> Pointy{1}
ERROR: TypeError: in Pointy, in T, expected T<:Real, got Int64
```

Type parameters for parametric composite types can be restricted in the same manner:

```julia
struct Point{T<:Real} <: Pointy{T}
    x::T
    y::T
end
```

To give a real-world example of how all this parametric type machinery can be useful, here is
the actual definition of Julia's [`Rational`](@ref) immutable type (except that we omit the
constructor here for simplicity), representing an exact ratio of integers:

```julia
struct Rational{T<:Integer} <: Real
    num::T
    den::T
end
```

It only makes sense to take ratios of integer values, so the parameter type `T` is restricted
to being a subtype of [`Integer`](@ref), and a ratio of integers represents a value on the
real number line, so any [`Rational`](@ref) is an instance of the [`Real`](@ref) abstraction.

### 元组类型

Tuples are an abstraction of the arguments of a function -- without the function itself. The salient
aspects of a function's arguments are their order and their types. Therefore a tuple type is similar
to a parameterized immutable type where each parameter is the type of one field. For example,
a 2-element tuple type resembles the following immutable type:

```julia
struct Tuple2{A,B}
    a::A
    b::B
end
```

然而，有三个主要差异：

  * 元组类型可以具有任意数量的参数。
  * Tuple types are *covariant* in their parameters: `Tuple{Int}` is a subtype of `Tuple{Any}`. Therefore
    `Tuple{Any}`被认为是一种抽象类型，而元组类型只有它们的参数有时才具体
    are.
  * 元组没有字段名称; 字段只能通过索引访问。

元组值用括号和逗号书写。构造元组时，会根据需要生成适当的元组类型：

```jldoctest
julia> typeof((1,"foo",2.5))
Tuple{Int64,String,Float64}
```

Note the implications of covariance:

```jldoctest
julia> Tuple{Int,AbstractString} <: Tuple{Real,Any}
true

julia> Tuple{Int,AbstractString} <: Tuple{Real,Real}
false

julia> Tuple{Int,AbstractString} <: Tuple{Real,}
false
```

Intuitively, this corresponds to the type of a function's arguments being a subtype of the function's
signature (when the signature matches).

### Vararg Tuple Types

元组类型的最后一个参数可以是特殊类型[`Vararg`](@ref)，它表示任意数量的尾随参数：

```jldoctest
julia> mytupletype = Tuple{AbstractString,Vararg{Int}}
Tuple{AbstractString,Vararg{Int64,N} where N}

julia> isa(("1",), mytupletype)
true

julia> isa(("1",1), mytupletype)
true

julia> isa(("1",1,2), mytupletype)
true

julia> isa(("1",1,2,3.0), mytupletype)
false
```

Notice that `Vararg{T}` corresponds to zero or more elements of type `T`. Vararg tuple types are
used to represent the arguments accepted by varargs methods (see [Varargs Functions](@ref)).

The type `Vararg{T,N}` corresponds to exactly `N` elements of type `T`.  `NTuple{N,T}` is a convenient
alias for `Tuple{Vararg{T,N}}`, i.e. a tuple type containing exactly `N` elements of type `T`.

### Named Tuple Types

Named tuples are instances of the [`NamedTuple`](@ref) type, which has two parameters: a tuple of
symbols giving the field names, and a tuple type giving the field types.

```jldoctest
julia> typeof((a=1,b="hello"))
NamedTuple{(:a, :b),Tuple{Int64,String}}
```

A `NamedTuple` type can be used as a constructor, accepting a single tuple argument.
The constructed `NamedTuple` type can be either a concrete type, with both parameters specified,
or a type that specifies only field names:

```jldoctest
julia> NamedTuple{(:a, :b),Tuple{Float32, String}}((1,""))
(a = 1.0f0, b = "")

julia> NamedTuple{(:a, :b)}((1,""))
(a = 1, b = "")
```

If field types are specified, the arguments are converted. Otherwise the types of the arguments
are used directly.

#### [单态类型](@id man-singleton-types)

There is a special kind of abstract parametric type that must be mentioned here: singleton types.
For each type, `T`, the "singleton type" `Type{T}` is an abstract type whose only instance is
the object `T`. Since the definition is a little difficult to parse, let's look at some examples:

```jldoctest
julia> isa(Float64, Type{Float64})
true

julia> isa(Real, Type{Float64})
false

julia> isa(Real, Type{Real})
true

julia> isa(Float64, Type{Real})
false
```

In other words, [`isa(A,Type{B})`](@ref) is true if and only if `A` and `B` are the same object
and that object is a type. Without the parameter, `Type` is simply an abstract type which has
all type objects as its instances, including, of course, singleton types:

```jldoctest
julia> isa(Type{Float64}, Type)
true

julia> isa(Float64, Type)
true

julia> isa(Real, Type)
true
```

只有对象是类型时，才是 `Type`的实例：

```jldoctest
julia> isa(1, Type)
false

julia> isa("foo", Type)
false
```

Until we discuss [Parametric Methods](@ref) and [conversions](@ref conversion-and-promotion), it is difficult to explain
the utility of the singleton type construct, but in short, it allows one to specialize function
behavior on specific type *values*. This is useful for writing methods (especially parametric
ones) whose behavior depends on a type that is given as an explicit argument rather than implied
by the type of one of its arguments.

A few popular languages have singleton types, including Haskell, Scala and Ruby. In general usage,
the term "singleton type" refers to a type whose only instance is a single value. This meaning
applies to Julia's singleton types, but with that caveat that only type objects have singleton
types.

### Parametric Primitive Types

Primitive types can also be declared parametrically. For example, pointers are represented as
primitive types which would be declared in Julia like this:

```julia
# 32-bit system:
primitive type Ptr{T} 32 end

# 64-bit system:
primitive type Ptr{T} 64 end
```

The slightly odd feature of these declarations as compared to typical parametric composite types,
is that the type parameter `T` is not used in the definition of the type itself -- it is just
an abstract tag, essentially defining an entire family of types with identical structure, differentiated
only by their type parameter. Thus, `Ptr{Float64}` and `Ptr{Int64}` are distinct types, even though
they have identical representations. And of course, all specific pointer types are subtypes of
the umbrella [`Ptr`](@ref) type:

```jldoctest
julia> Ptr{Float64} <: Ptr
true

julia> Ptr{Int64} <: Ptr
true
```

## UnionAll Types

We have said that a parametric type like `Ptr` acts as a supertype of all its instances
(`Ptr{Int64}` etc.). How does this work? `Ptr` itself cannot be a normal data type, since without
knowing the type of the referenced data the type clearly cannot be used for memory operations.
The answer is that `Ptr` (or other parametric types like `Array`) is a different kind of type called a
[`UnionAll`](@ref) type. Such a type expresses the *iterated union* of types for all values of some parameter.

`UnionAll` types are usually written using the keyword `where`. For example `Ptr` could be more
accurately written as `Ptr{T} where T`, meaning all values whose type is `Ptr{T}` for some value
of `T`. In this context, the parameter `T` is also often called a "type variable" since it is
like a variable that ranges over types.
Each `where` introduces a single type variable, so these expressions are nested for types with
multiple parameters, for example `Array{T,N} where N where T`.

The type application syntax `A{B,C}` requires `A` to be a `UnionAll` type, and first substitutes `B`
for the outermost type variable in `A`.
The result is expected to be another `UnionAll` type, into which `C` is then substituted.
So `A{B,C}` is equivalent to `A{B}{C}`.
This explains why it is possible to partially instantiate a type, as in `Array{Float64}`: the first
parameter value has been fixed, but the second still ranges over all possible values.
Using explicit `where` syntax, any subset of parameters can be fixed. For example, the type of all
1-dimensional arrays can be written as `Array{T,1} where T`.

Type variables can be restricted with subtype relations.
`Array{T} where T<:Integer` refers to all arrays whose element type is some kind of
[`Integer`](@ref).
The syntax `Array{<:Integer}` is a convenient shorthand for `Array{T} where T<:Integer`.
Type variables can have both lower and upper bounds.
`Array{T} where Int<:T<:Number` refers to all arrays of [`Number`](@ref)s that are able to
contain `Int`s (since `T` must be at least as big as `Int`).
The syntax `where T>:Int` also works to specify only the lower bound of a type variable,
and `Array{>:Int}` is equivalent to `Array{T} where T>:Int`.

Since `where` expressions nest, type variable bounds can refer to outer type variables.
For example `Tuple{T,Array{S}} where S<:AbstractArray{T} where T<:Real` refers to 2-tuples
whose first element is some [`Real`](@ref), and whose second element is an `Array` of any
kind of array whose element type contains the type of the first tuple element.

The `where` keyword itself can be nested inside a more complex declaration. For example,
consider the two types created by the following declarations:

```jldoctest
julia> const T1 = Array{Array{T,1} where T, 1}
Array{Array{T,1} where T,1}

julia> const T2 = Array{Array{T,1}, 1} where T
Array{Array{T,1},1} where T
```

Type `T1` defines a 1-dimensional array of 1-dimensional arrays; each
of the inner arrays consists of objects of the same type, but this type may vary from one inner array to the next.
On the other hand, type `T2` defines a 1-dimensional array of 1-dimensional arrays all of whose inner arrays must have the
same type.  Note that `T2` is an abstract type, e.g., `Array{Array{Int,1},1} <: T2`, whereas `T1` is a concrete type. As a consequence, `T1` can be constructed with a zero-argument constructor `a=T1()` but `T2` cannot.

There is a convenient syntax for naming such types, similar to the short form of function
definition syntax:

```julia
Vector{T} = Array{T,1}
```

This is equivalent to `const Vector = Array{T,1} where T`.
Writing `Vector{Float64}` is equivalent to writing `Array{Float64,1}`, and the umbrella type
`Vector` has as instances all `Array` objects where the second parameter -- the number of array
dimensions -- is 1, regardless of what the element type is. In languages where parametric types
must always be specified in full, this is not especially helpful, but in Julia, this allows one
to write just `Vector` for the abstract type including all one-dimensional dense arrays of any
element type.

## 类型别名

有时为一个已经可表达的类型引入新名称是很方便的。这可通过一个简单的赋值语句完成。例如，`UInt` 是 [`UInt32`](@ref) 或 [`UInt64`](@ref) 的别名，因为它与系统上的指针大小是相适应的。

```julia-repl
# 32-bit system:
julia> UInt
UInt32

# 64-bit system:
julia> UInt
UInt64
```

在`base/boot.jl`中，通过以下代码实现:

```julia
if Int === Int64
    const UInt = UInt64
else
    const UInt = UInt32
end
```

当然，这依赖于 `Int` 的别名，但它被预定义成正确的类型—— [`Int32`](@ref) 或 [`Int64`](@ref)。

（注意，与 `Int` 不同，`Float` 不作为特定大小的 [`AbstractFloat`](@ref) 类型的别名而存在。与整数寄存器不同，浮点数寄存器大小由 IEEE-754 标准指定。而 `Int` 的大小反映了该机器上本地指针的大小。）

## 类型操作

因为 Julia 中的类型本身就是对象，所以普通函数可以对它们进行操作。已经引入了一些对于使用或探索类型特别有用的函数，例如 `<:` 运算符，它表示其左操作数是否为其右操作数的子类型。

[`isa`](@ref) 函数测试对象是否具有给定类型并返回 true 或 false：

```jldoctest
julia> isa(1, Int)
true

julia> isa(1, AbstractFloat)
false
```

已经在手册各处的示例中使用的 [`typeof`](@ref) 函数返回其参数的类型。如上所述，因为类型都是对象，所以它们也有类型，我们可以询问它们的类型：

```jldoctest
julia> typeof(Rational{Int})
DataType

julia> typeof(Union{Real,Float64,Rational})
DataType

julia> typeof(Union{Real,String})
Union
```

如果我们重复这个过程会怎样？一个类型的类型是什么？碰巧，每个类型都是复合值，因此都具有 `DataType` 类型：

```jldoctest
julia> typeof(DataType)
DataType

julia> typeof(Union)
DataType
```

`DataType` 是它自己的类型。

另一个适用于某些类型的操作是 [`supertype`](@ref)，它显示了类型的超类型。只有已声明的类型（`DataType`）才有明确的超类型：

```jldoctest
julia> supertype(Float64)
AbstractFloat

julia> supertype(Number)
Any

julia> supertype(AbstractString)
Any

julia> supertype(Any)
Any
```

如果将 [`supertype`](@ref) 应用于其它类型对象（或非类型对象），则会引发 [`MethodError`](@ref)：

```jldoctest; filter = r"Closest candidates.*"s
julia> supertype(Union{Float64,Int64})
ERROR: MethodError: no method matching supertype(::Type{Union{Float64, Int64}})
Closest candidates are:
  supertype(!Matched::DataType) at operators.jl:42
  supertype(!Matched::UnionAll) at operators.jl:47
```

## [Custom pretty-printing](@id man-custom-pretty-printing)

Often, one wants to customize how instances of a type are displayed.  This is accomplished by
overloading the [`show`](@ref) function.  For example, suppose we define a type to represent
complex numbers in polar form:

```jldoctest polartype
julia> struct Polar{T<:Real} <: Number
           r::T
           Θ::T
       end

julia> Polar(r::Real,Θ::Real) = Polar(promote(r,Θ)...)
Polar
```

Here, we've added a custom constructor function so that it can take arguments of different
[`Real`](@ref) types and promote them to a common type (see [Constructors](@ref man-constructors)
and [Conversion and Promotion](@ref conversion-and-promotion)).
(Of course, we would have to define lots of other methods, too, to make it act like a
[`Number`](@ref), e.g. `+`, `*`, `one`, `zero`, promotion rules and so on.) By default,
instances of this type display rather simply, with information about the type name and
the field values, as e.g. `Polar{Float64}(3.0,4.0)`.

If we want it to display instead as `3.0 * exp(4.0im)`, we would define the following method to
print the object to a given output object `io` (representing a file, terminal, buffer, etcetera;
see [Networking and Streams](@ref)):

```jldoctest polartype
julia> Base.show(io::IO, z::Polar) = print(io, z.r, " * exp(", z.Θ, "im)")
```

More fine-grained control over display of `Polar` objects is possible. In particular, sometimes
one wants both a verbose multi-line printing format, used for displaying a single object in the
REPL and other interactive environments, and also a more compact single-line format used for
[`print`](@ref) or for displaying the object as part of another object (e.g. in an array). Although
by default the `show(io, z)` function is called in both cases, you can define a *different* multi-line
format for displaying an object by overloading a three-argument form of `show` that takes the
`text/plain` MIME type as its second argument (see [Multimedia I/O](@ref)), for example:

```jldoctest polartype
julia> Base.show(io::IO, ::MIME"text/plain", z::Polar{T}) where{T} =
           print(io, "Polar{$T} complex number:\n   ", z)
```

(Note that `print(..., z)` here will call the 2-argument `show(io, z)` method.) This results in:

```jldoctest polartype
julia> Polar(3, 4.0)
Polar{Float64} complex number:
   3.0 * exp(4.0im)

julia> [Polar(3, 4.0), Polar(4.0,5.3)]
2-element Array{Polar{Float64},1}:
 3.0 * exp(4.0im)
 4.0 * exp(5.3im)
```

where the single-line `show(io, z)` form is still used for an array of `Polar` values.   Technically,
the REPL calls `display(z)` to display the result of executing a line, which defaults to `show(stdout, MIME("text/plain"), z)`,
which in turn defaults to `show(stdout, z)`, but you should *not* define new [`display`](@ref)
methods unless you are defining a new multimedia display handler (see [Multimedia I/O](@ref)).

Moreover, you can also define `show` methods for other MIME types in order to enable richer display
(HTML, images, etcetera) of objects in environments that support this (e.g. IJulia).   For example,
we can define formatted HTML display of `Polar` objects, with superscripts and italics, via:

```jldoctest polartype
julia> Base.show(io::IO, ::MIME"text/html", z::Polar{T}) where {T} =
           println(io, "<code>Polar{$T}</code> complex number: ",
                   z.r, " <i>e</i><sup>", z.Θ, " <i>i</i></sup>")
```

A `Polar` object will then display automatically using HTML in an environment that supports HTML
display, but you can call `show` manually to get HTML output if you want:

```jldoctest polartype
julia> show(stdout, "text/html", Polar(3.0,4.0))
<code>Polar{Float64}</code> complex number: 3.0 <i>e</i><sup>4.0 <i>i</i></sup>
```

```@raw html
<p>An HTML renderer would display this as: <code>Polar{Float64}</code> complex number: 3.0 <i>e</i><sup>4.0 <i>i</i></sup></p>
```

As a rule of thumb, the single-line `show` method should print a valid Julia expression for creating
the shown object.  When this `show` method contains infix operators, such as the multiplication
operator (`*`) in our single-line `show` method for `Polar` above, it may not parse correctly when
printed as part of another object.  To see this, consider the expression object (see [Program
representation](@ref)) which takes the square of a specific instance of our `Polar` type:

```jldoctest polartype
julia> a = Polar(3, 4.0)
Polar{Float64} complex number:
   3.0 * exp(4.0im)

julia> print(:($a^2))
3.0 * exp(4.0im) ^ 2
```

Because the operator `^` has higher precedence than `*` (see [Operator Precedence and Associativity](@ref)), this
output does not faithfully represent the expression `a ^ 2` which should be equal to `(3.0 *
exp(4.0im)) ^ 2`.  To solve this issue, we must make a custom method for `Base.show_unquoted(io::IO,
z::Polar, indent::Int, precedence::Int)`, which is called internally by the expression object when
printing:

```jldoctest polartype
julia> function Base.show_unquoted(io::IO, z::Polar, ::Int, precedence::Int)
           if Base.operator_precedence(:*) <= precedence
               print(io, "(")
               show(io, z)
               print(io, ")")
           else
               show(io, z)
           end
       end

julia> :($a^2)
:((3.0 * exp(4.0im)) ^ 2)
```

The method defined above adds parentheses around the call to `show` when the precedence of the
calling operator is higher than or equal to the precedence of multiplication.  This check allows
expressions which parse correctly without the parentheses (such as `:($a + 2)` and `:($a == 2)`) to
omit them when printing:

```jldoctest polartype
julia> :($a + 2)
:(3.0 * exp(4.0im) + 2)

julia> :($a == 2)
:(3.0 * exp(4.0im) == 2)
```

In some cases, it is useful to adjust the behavior of `show` methods depending
on the context. This can be achieved via the [`IOContext`](@ref) type, which allows
passing contextual properties together with a wrapped IO stream.
For example, we can build a shorter representation in our `show` method
when the `:compact` property is set to `true`, falling back to the long
representation if the property is `false` or absent:
```jldoctest polartype
julia> function Base.show(io::IO, z::Polar)
           if get(io, :compact, false)
               print(io, z.r, "ℯ", z.Θ, "im")
           else
               print(io, z.r, " * exp(", z.Θ, "im)")
           end
       end
```

This new compact representation will be used when the passed IO stream is an `IOContext`
object with the `:compact` property set. In particular, this is the case when printing
arrays with multiple columns (where horizontal space is limited):
```jldoctest polartype
julia> show(IOContext(stdout, :compact=>true), Polar(3, 4.0))
3.0ℯ4.0im

julia> [Polar(3, 4.0) Polar(4.0,5.3)]
1×2 Array{Polar{Float64},2}:
 3.0ℯ4.0im  4.0ℯ5.3im
```

See the [`IOContext`](@ref) documentation for a list of common properties which can be used
to adjust printing.

## "Value types"

In Julia, you can't dispatch on a *value* such as `true` or `false`. However, you can dispatch
on parametric types, and Julia allows you to include "plain bits" values (Types, Symbols, Integers,
floating-point numbers, tuples, etc.) as type parameters.  A common example is the dimensionality
parameter in `Array{T,N}`, where `T` is a type (e.g., [`Float64`](@ref)) but `N` is just an `Int`.

You can create your own custom types that take values as parameters, and use them to control dispatch
of custom types. By way of illustration of this idea, let's introduce a parametric type, `Val{x}`,
and a constructor `Val(x) = Val{x}()`, which serves as a customary way to exploit this technique
for cases where you don't need a more elaborate hierarchy.

[`Val`](@ref) is defined as:

```jldoctest valtype
julia> struct Val{x}
       end

julia> Val(x) = Val{x}()
Val
```

There is no more to the implementation of `Val` than this.  Some functions in Julia's standard
library accept `Val` instances as arguments, and you can also use it to write your own functions.
 For example:

```jldoctest valtype
julia> firstlast(::Val{true}) = "First"
firstlast (generic function with 1 method)

julia> firstlast(::Val{false}) = "Last"
firstlast (generic function with 2 methods)

julia> firstlast(Val(true))
"First"

julia> firstlast(Val(false))
"Last"
```

For consistency across Julia, the call site should always pass a `Val`*instance* rather than using
a *type*, i.e., use `foo(Val(:bar))` rather than `foo(Val{:bar})`.

It's worth noting that it's extremely easy to mis-use parametric "value" types, including `Val`;
in unfavorable cases, you can easily end up making the performance of your code much *worse*.
 In particular, you would never want to write actual code as illustrated above.  For more information
about the proper (and improper) uses of `Val`, please read the more extensive discussion in [the performance tips](@ref man-performance-tips).

[^1]: "Small" is defined by the `MAX_UNION_SPLITTING` constant, which is currently set to 4.
