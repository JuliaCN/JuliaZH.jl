# [类型](@id man-types)

通常，我们把程序语言中的类型系统划分成两类：静态类型和动态类型。对于静态类型系统，在程序运行之前，我们就可计算每一个表达式的类型。而对于动态类型系统，我们只有通过运行那个程序，得到表达式具体的值，才能确定其具体的类型。通过让编写的代码无需在编译时知道值的确切类型，面向对象允许静态类型语言具有一定的灵活性。可以编写在不同类型上都能运行的代码的能力被称为多态。在经典的动态类型语言中，所有的代码都是多态的，这意味着这些代码对于其中值的类型没有约束，除非在代码中去具体的判断一个值的类型，或者对对象做一些它不支持的操作。

Julia 类型系统是动态的，但通过允许指出某些变量具有特定类型，获得了静态类型系统的一些优点。这对于生成高效的代码非常有帮助，但更重要的是，它允许针对函数参数类型的方法派发与语言深度集成。方法派发将在[方法](@ref)中详细探讨，但它根植于此处提供的类型系统。

在类型被省略时，Julia 的默认行为是允许变量为任何类型。因此，可以编写许多有用的 Julia 函数，而无需显式使用类型。然而，当需要额外的表达力时，很容易逐渐将显式的类型注释引入先前的「无类型」代码中。添加类型注释主要有三个目的：利用 Julia 强大的多重派发机制、提高代码可读性以及捕获程序错误。

Julia 用[类型系统](https://en.wikipedia.org/wiki/Type_system)的术语描述是动态（dynamic）、主格（nominative）和参数（parametric）的。泛型可以被参数化，并且类型之间的层次关系可以被[显式地声明](https://en.wikipedia.org/wiki/Nominal_type_system)，而不是[隐含地通过兼容的结构](https://en.wikipedia.org/wiki/Structural_type_system)。Julia 类型系统的一个特别显著的特征是具体类型相互之间不能是子类型：所有具体类型都是最终的类型，并且只有抽象类型可以作为其超类型。虽然起初看起来这可能过于严格，但它有许多有益的结果，但缺点却少得出奇。事实证明，能够继承行为比继承结构更重要，同时继承两者在传统的面向对象语言中导致了重大困难。Julia 类型系统的其它高级方面应当在先言明：

  * 对象值和非对象值之间没有分别：Julia 中的所有值都是具有类型的真实对象其类型属于一个单独的、完全连通的类型图，该类型图的所有节点作为类型一样都是头等的。
     
     
  * 「编译期类型」是没有任何意义的概念：变量所具有的唯一类型是程序运行时的实际类型。这在面向对象被称为「运行时类型」，其中静态编译和多态的组合使得这种区别变得显著。
     
     
  * 值有类型，变量没有类型——变量仅仅是绑定给值的名字而已。
  * 抽象类型和具体类型都可以通过其它类型进行参数化。它们的参数化还可通过符号、使得 [`isbits`](@ref) 返回 true 的任意类型的值（实质上，也就是像数字或布尔变量这样的东西，存储方式像 C 类型或不包含指向其它对象的指针的 `struct`）和其元组。类型参数在不需要被引用或限制时可以省略。
     
     
     
     

Julia 的类型系统设计得强大而富有表现力，却清晰、直观且不引人注目。许多 Julia 程序员可能从未感觉需要编写明确使用类型的代码。但是，某些场景的编程可通过声明类型变得更加清晰、简单、快速和健壮。

## 类型声明

`::` 运算符可以用来在程序中给表达式和变量附加类型注释。这有两个主要原因：

1. 作为断言，帮助程序确认能是否正常运行，
2. 给编译器提供额外的类型信息，这可能帮助程序提升性能，在某些情况下
    

当被附加到一个计算值的表达式时，`::` 操作符读作「是······的实例」。在任何地方都可以用它来断言左侧表达式的值是右侧类型的实例。当右侧类型是具体类型时，左侧的值必须能够以该类型作为其实现——回想一下，所有具体类型都是最终的，因此没有任何实现是任何其它具体类型的子类型。当右侧类型是抽象类型时，值是由该抽象类型子类型中的某个具体类型实现的才能满足该断言。如果类型断言非真，抛出一个异常，否则返回左侧的值：

```jldoctest
julia> (1+2)::AbstractFloat
ERROR: TypeError: in typeassert, expected AbstractFloat, got a value of type Int64

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

这个特性用于避免性能「陷阱」，即给一个变量赋值时意外更改了类型。

此「声明」行为仅发生在特定上下文中：

```julia
local x::Int8  # in a local declaration
x::Int8 = 10   # as the left-hand side of an assignment
```

并应用于整个当前作用域，甚至在该声明之前。目前，类型声明不能在全局作用域中使用，例如在 REPL 中就不可以，因为 Julia 还没有常量类型的全局变量。

声明也可以附加到函数定义：

```julia
function sinc(x)::Float64
    if x == 0
        return 1
    end
    return sin(pi*x)/(pi*x)
end
```

此函数的返回值就像赋值给了一个类型已被声明的变量：返回值始终转换为`Float64`。

## [抽象类型](@id man-abstract-types)

抽象类型不能实例化，只能作为类型图中的节点使用，从而描述由相关具体类型组成的集合：那些作为其后代的具体类型。我们从抽象类型开始，即使它们没有实例，因为它们是类型系统的主干：它们形成了概念的层次结构，这使得 Julia 的类型系统不只是对象实现的集合。

回想一下，在[整数和浮点数](@ref)中，我们介绍了各种数值的具体类型：[`Int8`](@ref)、[`UInt8`](@ref)、[`Int16`](@ref)、[`UInt16`](@ref)、[`Int32`](@ref)、[`UInt32`](@ref)、[`Int64`](@ref)、[`UInt64`](@ref)、[`Int128`](@ref)、[`UInt128`](@ref)、[`Float16`](@ref)、[`Float32`](@ref) 和 [`Float64`](@ref)。尽管 `Int8`、`Int16`、`Int32`、`Int64` 和 `Int128` 具有不同的表示大小，但都具有共同的特征，即它们都是带符号的整数类型。类似地，`UInt8`、`UInt16`、`UInt32`、`UInt64` 和 `UInt128` 都是无符号整数类型，而 `Float16`、`Float32` 和 `Float64` 是不同的浮点数类型而非整数类型。一段代码只对某些类型有意义是很常见的，比如，只在其参数是某种类型的整数，而不真正取决于特定*类型*的整数时有意义。例如，最大公分母算法适用于所有类型的整数，但不适用于浮点数。抽象类型允许构造类型的层次结构，提供了具体类型可以适应的上下文。例如，这允许你轻松地为任何类型的整数编程，而不用将算法限制为某种特殊类型的整数。

使用 [`abstract type`](@ref) 关键字来声明抽象类型。声明抽象类型的一般语法是：

```
abstract type «name» end
abstract type «name» <: «supertype» end
```

该 `abstract type` 关键字引入了一个新的抽象类型，`«name»` 为其名称。此名称后面可以跟 [`<:`](@ref) 和一个已存在的类型，表示新声明的抽象类型是此「父」类型的子类型。

如果没有给出超类型，则默认超类型为 `Any`——一个预定义的抽象类型，所有对象都是它的实例并且所有类型都是它的子类型。在类型理论中，`Any` 通常称为「top」，因为它位于类型图的顶点。Julia 还有一个预定义的抽象「bottom」类型，在类型图的最低点，写成 `Union{}`。这与 `Any` 完全相反：任何对象都不是 `Union{}` 的实例，所有的类型都是 `Union{}` 的超类型。

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

`<:` 运算符的通常意义为「是······的子类型」，并被用于像这样的声明右侧类型是新声明类型的直接超类型。它也可以在表达式中用作子类型运算符，在其左操作数为其右操作数的子类型时返回 `true`：

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

首先需要注意的是上述的参数声明等价于 `x::Any` 和 `y::Any`。当函数被调用时，例如 `myplus(2,5)`，派发器会选择与给定参数相匹配的名称为 `myplus` 的最具体方法。（有关多重派发的更多信息，请参阅[方法](@ref)。）

假设没有找到比上述方法更具体的方法，Julia 接下来会在内部定义并编译一个名为 `myplus` 的方法，专门用于基于上面给出的泛型函数的两个 `Int` 参数，即它定义并编译：

```julia
function myplus(x::Int,y::Int)
    x+y
end
```

最后，调用这个具体的方法。

因此，抽象类型允许程序员编写泛型函数，之后可以通过许多具体类型的组合将其用作默认方法。多亏了多重分派，程序员可以完全控制是使用默认方法还是更具体的方法。

需要注意的重点是，即使程序员依赖参数为抽象类型的函数，性能也不会有任何损失，因为它会针对每个调用它的参数元组的具体类型重新编译。（但在函数参数是抽象类型的容器的情况下，可能存在性能问题；请参阅[性能建议](@ref man-performance-tips)。）

## 原始类型

!!! warning
  在新的复合类型中包装现有的基元类型，几乎总是比定义自己的基元类型更好。

  这个功能允许 Julia 引导 LLVM 支持的标准基本类型。一旦它们被定义，就没有理由再定义更多了。

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

bits 的数值表示该类型需要多少存储空间，name 为新类型指定名称。可以选择将一个原始类型声明为某个超类型的子类型。如果省略超类型，则默认 `Any` 为其直接超类型。上述声明中意味着 [`Bool`](@ref) 类型需要 8 位来储存，并且直接超类型为 [`Integer`](@ref)。目前支持的大小只能是 8 位的倍数，不然你就会遇到 LLVM 的 bug。因此，布尔值虽然确实只需要一位，但不能声明为小于 8 位的值。

[`Bool`](@ref)，[`Int8`](@ref) 和 [`UInt8`](@ref) 类型都具有相同的表现形式：它们都是 8 位内存块。然而，由于 Julia 的类型系统是主格的，它们尽管具有相同的结构，但不是通用的。它们之间的一个根本区别是它们具有不同的超类型：[`Bool`](@ref) 的直接超类型是 [`Integer`](@ref)、[`Int8`](@ref) 的是 [`Signed`](@ref) 而 [`UInt8`](@ref) 的是 [`Unsigned`](@ref)。[`Bool`](@ref)，[`Int8`](@ref) 和 [`UInt8`](@ref) 的所有其它差异是行为上的——定义函数的方式在这些类型的对象作为参数给定时起作用。这也是为什么主格的类型系统是必须的：如果结构确定类型，类型决定行为，就不可能使 [`Bool`](@ref) 的行为与 [`Int8`](@ref) 或 [`UInt8`](@ref) 有任何不同。

## 复合类型

[复合类型](https://en.wikipedia.org/wiki/Composite_data_type)在各种语言中被称为 record、struct 和 object。复合类型是命名字段的集合，其实例可以视为单个值。复合类型在许多语言中是唯一一种用户可定义的类型，也是 Julia 中最常用的用户定义类型。

在主流的面向对象语言中，比如 C++、Java、Python 和 Ruby，复合类型也具有与它们相关的命名函数，并且该组合称为「对象」。在纯粹的面向对象语言中，例如 Ruby 或 Smalltalk，所有值都是对象，无论它们是否为复合类型。在不太纯粹的面向对象语言中，包括 C++ 和 Java，一些值，比如整数和浮点值，不是对象，而用户定义的复合类型是具有相关方法的真实对象。在 Julia 中，所有值都是对象，但函数不与它们操作的对象捆绑在一起。这是必要的，因为 Julia 通过多重派发选择函数使用的方法，这意味着在选择方法时考虑*所有*函数参数的类型，而不仅仅是第一个（有关方法和派发的更多信息，请参阅[方法](@ref)）。因此，函数仅仅「属于」它们的第一个参数是不合适的。将方法组织到函数对象中而不是在每个对象「内部」命名方法最终成为语言设计中一个非常有益的方面。

[`struct`](@ref) 关键字与复合类型一起引入，后跟一个字段名称的块，可选择使用 `::` 运算符注释类型：

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
ERROR: InexactError: Int64(23.5)
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

  * 它可以更高效。某些 struct 可以被高效地打包到数组中，并且在某些情况下，编译器可以避免完全分配不可变对象。
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

## 类型共用体

类型共用体是一种特殊的抽象类型，它包含作为对象的任何参数类型的所有实例，使用特殊[`Union`](@ref)关键字构造：

```jldoctest
julia> IntOrString = Union{Int,AbstractString}
Union{Int64, AbstractString}

julia> 1 :: IntOrString
1

julia> "Hello!" :: IntOrString
"Hello!"

julia> 1.0 :: IntOrString
ERROR: TypeError: in typeassert, expected Union{Int64, AbstractString}, got a value of type Float64
```

许多语言都有内建的共用体结构来推导类型；Julia 简单地将它暴露给程序员。Julia 编译器能在 `Union` 类型只具有少量类型[^1]的情况下生成高效的代码，方法是为每个可能类型的不同分支都生成专用代码。

`Union` 类型的一种特别有用的情况是 `Union{T, Nothing}`，其中 `T` 可以是任何类型，[`Nothing`](@ref) 是单态类型，其唯一实例是对象 [`nothing`](@ref)。此模式是其它语言中 [`Nullable`、`Option` 或 `Maybe`](https://en.wikipedia.org/wiki/Nullable_type) 类型在 Julia 的等价。通过将函数参数或字段声明为 `Union{T, Nothing}`，可以将其设置为类型为 `T` 的值，或者 `nothing` 来表示没有值。有关详细信息，请参阅[常见问题的此条目](@ref faq-nothing)。

## 参数类型

Julia 类型系统的一个重要和强大的特征是它是参数的：类型可以接受参数，因此类型声明实际上引入了一整套新类型——每一个参数值的可能组合引入一个新类型。许多语言支持某种版本的[泛型编程](https://en.wikipedia.org/wiki/Generic_programming)，其中，可以指定操作泛型的数据结构和算法，而无需指定所涉及的确切类型。例如，某些形式的泛型编程存在于 ML、Haskell、Ada、Eiffel、C++、Java、C#、F#、和 Scala 中，这只是其中的一些例子。这些语言中的一些支持真正的参数多态（例如 ML、Haskell、Scala），而其它语言基于模板的泛型编程风格（例如 C++、Java）。由于在不同语言中有多种不同种类的泛型编程和参数类型，我们甚至不会尝试将 Julia 的参数类型与其它语言的进行比较，而是专注于解释 Julia 系统本身。然而，我们将注意到，因为 Julia 是动态类型语言并且不需要在编译时做出所有类型决定，所以许多在静态参数类型系统中遇到的传统困难可以被相对容易地处理。

所有已声明的类型（`DataType` 类型）都可被参数化，在每种情况下都使用一样的语法。我们将按一下顺序讨论它们：首先是参数复合类型，接着是参数抽象类型，最后是参数原始类型。

### 参数复合类型

类型参数在类型名称后引入，用大括号扩起来：

```jldoctest pointtype
julia> struct Point{T}
           x::T
           y::T
       end
```

此声明定义了一个新的参数类型，`Point{T}`，拥有类型为 `T` 的两个「坐标」。有人可能会问 `T` 是什么？嗯，这恰恰是参数类型的重点：它可以是任何类型（或者任何位类型值，虽然它实际上在这里显然用作类型）。`Point{Float64}` 是一个具体类型，该类型等价于通过用 [`Float64`](@ref) 替换 `Point` 的定义中的 `T` 所定义的类型。因此，单独这一个声明实际上声明了无限个类型：`Point{Float64}`，`Point{AbstractString}`，`Point{Int64}`，等等。这些类型中的每一个类型现在都是可用的具体类型：

```jldoctest pointtype
julia> Point{Float64}
Point{Float64}

julia> Point{AbstractString}
Point{AbstractString}
```

`Point{Float64}` 类型是坐标为 64 位浮点值的点，而 `Point{AbstractString}` 类型是「坐标」为字符串对象（请参阅 [Strings](@id man-strings)）的「点」。

`Point` 本身也是一个有效的类型对象，包括所有实例 `Point{Float64}`、`Point{AbstractString}` 等作为子类型：

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

`Point` 不同 `T` 值所声明的具体类型之间，不能互相作为子类型：

```jldoctest pointtype
julia> Point{Float64} <: Point{Int64}
false

julia> Point{Float64} <: Point{Real}
false
```

!!! warning
    最后一点*非常*重要：即使 `Float64 <: Real` 也**没有** `Point{Float64} <: Point{Real}`。

换成类型理论说法，Julia 的类型参数是*不变的*，而不是[协变的（或甚至是逆变的）](https://en.wikipedia.org/wiki/Covariance_and_contravariance_%28computer_science%29)。这是出于实际原因：虽然任何 `Point{Float64}` 的实例在概念上也可能像是 `Point{Real}` 的实例，但这两种类型在内存中有不同的表示：

  * `Point{Float64}` 的实例可以紧凑而高效地表示为一对 64 位立即数；
  * `Point{Real}` 的实例必须能够保存任何一对 [`Real`](@ref) 的实例。由于 `Real` 实例的对象可以具有任意的大小和结构，`Point{Real}` 的实例实际上必须表示为一对指向单独分配的 `Real` 对象的指针。

在数组的情况下，能够以立即数存储 `Point{Float64}` 对象会极大地提高效率：`Array{Float64}` 可以存储为一段 64 位浮点值组成的连续内存块，而 `Array{Real}` 必须是一个由指向单独分配的 [`Real`](@ref) 的指针组成的数组——这可能是 [boxed](https://en.wikipedia.org/wiki/Object_type_%28object-oriented_programming%29#Boxing) 64 位浮点值，但也可能是任意庞大和复杂的对象，且其被声明为 `Real` 抽象类型的表示。

由于 `Point{Float64}` 不是 `Point{Real}` 的子类型，下面的方法不适用于类型为 `Point{Float64}` 的参数：

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

（等效地，另一种定义方法 `function norm(p::Point{T} where T<:Real)` 或 `function norm(p::Point{T}) where T<:Real`；查看 [UnionAll 类型](@ref)。）

稍后将在[方法](@ref)中讨论更多示例。

如何构造一个 `Point` 对象？可以为复合类型定义自定义的构造函数，这将在[构造函数](@ref man-constructors)中详细讨论，但在没有任何特别的构造函数声明的情况下，有两种默认方式可以创建新的复合对象，一种是显式地给出类型参数，另一种是通过传给对象构造函数的参数隐含地给出。

由于 `Point{Float64}` 类型等价于在 `Point` 声明时用 [`Float64`](@ref) 替换 `T` 得到的具体类型，它可以相应地作为构造函数使用：

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

参数类型只生成一个默认的构造函数，因为它无法覆盖。这个构造函数接受任何参数并将它们转换为字段的类型。

在许多情况下，提供想要构造的 `Point` 对象的类型是多余的，因为构造函数调用参数的类型已经隐式地提供了类型信息。因此，你也可以将 `Point` 本身用作构造函数，前提是参数类型 `T` 的隐含值是确定的：

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

在 `Point` 的例子中，当且仅当 `Point` 的两个参数类型相同时，`T` 的类型才确实是隐含的。如果不是这种情况，构造函数将失败并出现 [`MethodError`](@ref)：

```jldoctest pointtype
julia> Point(1,2.5)
ERROR: MethodError: no method matching Point(::Int64, ::Float64)
Closest candidates are:
  Point(::T, !Matched::T) where T at none:2
```

可以定义适当处理此类混合情况的函数构造方法，将在后面的[构造函数](@ref man-constructors)中讨论。

### 参数抽象类型

参数抽象类型声明以非常相似的方式声明了一族抽象类型：

```jldoctest pointytype
julia> abstract type Pointy{T} end
```

在此声明中，对于每个类型或整数值 `T`，`Pointy{T}` 都是不同的抽象类型。与参数复合类型一样，每个此类型的实例都是 `Pointy` 的子类型：

```jldoctest pointytype
julia> Pointy{Int64} <: Pointy
true

julia> Pointy{1} <: Pointy
true
```

参数抽象类型是不变的，就像参数复合类型：

```jldoctest pointytype
julia> Pointy{Float64} <: Pointy{Real}
false

julia> Pointy{Real} <: Pointy{Float64}
false
```

符号 `Pointy{<:Real}` 可用于表示*协变*类型的 Julia 类似物，而 `Pointy{>:Int}` 类似于*逆变*类型，但从技术上讲，它们都代表了类型的*集合*（参见 [UnionAll 类型](@ref)）。
```jldoctest pointytype
julia> Pointy{Float64} <: Pointy{<:Real}
true

julia> Pointy{Real} <: Pointy{>:Int}
true
```

正如之前的普通抽象类型用于在具体类型上创建实用的类型层次结构一样，参数抽象类型在参数复合类型上具有相同的用途。例如，我们可以将 `Point{T}` 声明为 `Pointy{T}` 的子类型，如下所示：

```jldoctest pointytype
julia> struct Point{T} <: Pointy{T}
           x::T
           y::T
       end
```

鉴于此类声明，对每个 `T`，都有 `Point{T}` 是 `Pointy{T}` 的子类型：

```jldoctest pointytype
julia> Point{Float64} <: Pointy{Float64}
true

julia> Point{Real} <: Pointy{Real}
true

julia> Point{AbstractString} <: Pointy{AbstractString}
true
```

下面的关系依然不变：

```jldoctest pointytype
julia> Point{Float64} <: Pointy{Real}
false

julia> Point{Float64} <: Pointy{<:Real}
true
```

参数抽象类型（比如 `Pointy`）的用途是什么？考虑一下如果点都在对角线 *x = y* 上，那我们创建的点的实现可以只有一个坐标：

```jldoctest pointytype
julia> struct DiagPoint{T} <: Pointy{T}
           x::T
       end
```

现在，`Point{Float64}` 和 `DiagPoint{Float64}` 都是抽象 `Pointy{Float64}` 的实现，每个类型 `T` 的其它可能选择与之类似。这允许对被所有 `Pointy` 对象共享的公共接口进行编程，接口都由 `Point` 和 `DiagPoint` 实现。但是，直到我们在下一节[方法](@ref)中引入方法和分派前，这无法完全证明。

有时，类型参数取遍所有可能类型也许是无意义的。在这种情况下，可以像这样约束 `T` 的范围：

```jldoctest realpointytype
julia> abstract type Pointy{T<:Real} end
```

在这样的声明中，可以使用任何 [`Real`](@ref) 的子类型替换 `T`，但不能使用不是 `Real` 子类型的类型：

```jldoctest realpointytype
julia> Pointy{Float64}
Pointy{Float64}

julia> Pointy{Real}
Pointy{Real}

julia> Pointy{AbstractString}
ERROR: TypeError: in Pointy, in T, expected T<:Real, got Type{AbstractString}

julia> Pointy{1}
ERROR: TypeError: in Pointy, in T, expected T<:Real, got a value of type Int64
```

参数化复合类型的类型参数可用相同的方式限制：

```julia
struct Point{T<:Real} <: Pointy{T}
    x::T
    y::T
end
```

在这里给出一个真实示例，展示了所有这些参数类型机制如何发挥作用，下面是 Julia 的不可变类型 [`Rational`](@ref) 的实际定义（除了我们为了简单起见省略了的构造函数），用来表示准确的整数比例：

```julia
struct Rational{T<:Integer} <: Real
    num::T
    den::T
end
```

只有接受整数值的比例才是有意义的，因此参数类型 `T` 被限制为 [`Integer`](@ref) 的子类型，又整数的比例代表实数轴上的值，因此任何 [`Rational`](@ref) 都是抽象 [`Real`](@ref) 的实现。

### 元组类型

元组类型是函数参数的抽象——不是函数本身的。函数参数的突出特征是它们的顺序和类型。因此，元组类型类似于参数化的不可变类型，其中每个参数都是一个字段的类型。例如，二元元组类型类似于以下不可变类型：

```julia
struct Tuple2{A,B}
    a::A
    b::B
end
```

然而，有三个主要差异：

  * 元组类型可以具有任意数量的参数。
  * 元组类型的参数是*协变的*：`Tuple{Int}` 是 `Tuple{Any}` 的子类型。因此，`Tuple{Any}` 被认为是一种抽象类型，且元组类型只有在它们的参数都是具体类型时才是具体类型。 
     
     
  * 元组没有字段名称; 字段只能通过索引访问。

元组值用括号和逗号书写。构造元组时，会根据需要生成适当的元组类型：

```jldoctest
julia> typeof((1,"foo",2.5))
Tuple{Int64,String,Float64}
```

请注意协变性的含义：

```jldoctest
julia> Tuple{Int,AbstractString} <: Tuple{Real,Any}
true

julia> Tuple{Int,AbstractString} <: Tuple{Real,Real}
false

julia> Tuple{Int,AbstractString} <: Tuple{Real,}
false
```

直观地，这对应于函数参数的类型是函数签名（当函数签名匹配时）的子类型。

### 变参元组类型

元组类型的最后一个参数可以是特殊类型 [`Vararg`](@ref)，它表示任意数量的尾随参数：

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

请注意，`Vararg{T}` 对应于零个或更多的类型为 `T` 的元素。变参元组类型被用来表示变参方法接受的参数（请参阅[变参函数](@ref)）。

类型 `Vararg{T,N}` 对应于正好 `N` 个类型为 `T` 的元素。`NTuple{N,T}` 是 `Tuple{Vararg{T,N}}` 的别名，即包含正好 `N` 个类型为 `T` 元素的元组类型。

### 具名元组类型

具名元组是 [`NamedTuple`](@ref) 类型的实例，该类型有两个参数：一个给出字段名称的符号元组，和一个给出字段类型的元组类型。

```jldoctest
julia> typeof((a=1,b="hello"))
NamedTuple{(:a, :b),Tuple{Int64,String}}
```

[`@NamedTuple`](@ref) 宏提供了类结构体（`struct`）的具名元组（`NamedTuple`）声明，使用 `key::Type` 的语法，如果省略 `::Type` 则默认为 `::Any`。

```jldoctest
julia> @NamedTuple{a::Int, b::String}
NamedTuple{(:a, :b),Tuple{Int64,String}}

julia> @NamedTuple begin
           a::Int
           b::String
       end
NamedTuple{(:a, :b),Tuple{Int64,String}}
```

`NamedTuple` 类型可以用作构造函数，接受一个单独的元组作为参数。构造出来的 `NamedTuple` 类型可以是具体类型，如果参数都被指定，也可以是只由字段名称所指定的类型：

```jldoctest
julia> @NamedTuple{a::Float32,b::String}((1,""))
(a = 1.0f0, b = "")

julia> NamedTuple{(:a, :b)}((1,""))
(a = 1, b = "")
```

如果指定了字段类型，参数会被转换。否则，就直接使用参数的类型。

### [单态类型](@id man-singleton-types)

这里必须提到一种特殊的抽象类型：单态类型。对于每个类型 `T`，「单态类型」`Type{T}` 是个抽象类型且唯一的实例就是对象 `T`。由于定义有点难以解释，让我们看一些例子：

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

换种说法，[`isa(A,Type{B})`](@ref) 为真当且仅当 `A` 与 `B` 是同一对象且该对象是一个类型。不带参数时，`Type` 是个抽象类型，所有类型对象都是它的实例，当然也包括单态类型：

```jldoctest
julia> isa(Type{Float64}, Type)
true

julia> isa(Float64, Type)
true

julia> isa(Real, Type)
true
```

只有对象是类型时，才是 `Type` 的实例：

```jldoctest
julia> isa(1, Type)
false

julia> isa("foo", Type)
false
```

在我们讨论[参数方法](@ref)和[类型转换](@ref conversion-and-promotion)之前，很难解释单态类型的作用，但简而言之，它允许针对特定类型*值*专门指定函数行为。这对于编写方法（尤其是参数方法）很有用，这些方法的行为取决于作为显式参数给出的类型，而不是隐含在它的某个参数的类型中。

一些流行的语言有单态类型，比如 Haskell、Scala 和 Ruby。在一般用法中，术语「单态类型」指的是唯一实例为单个值的类型。这定义适用于 Julia 的单态类型，但需要注意的是 Julia 里只有类型对象具有对应的单态类型。

### 参数原始类型

原始类型也可以参数化声明，例如，指针都能表示为原始类型，其在 Julia 中以如下方式声明：

```julia
# 32-bit system:
primitive type Ptr{T} 32 end

# 64-bit system:
primitive type Ptr{T} 64 end
```

与典型的参数复合类型相比，此声明中略显奇怪的特点是类型参数 `T` 并未在类型本身的定义里使用——它实际上只是一个抽象的标记，定义了一整族具有相同结构的类型，类型间仅由它们的类型参数来区分。因此，`Ptr{Float64}` 和 `Ptr{Int64}` 是不同的类型，就算它们具有相同的表示。当然，所有特定的指针类型都是总类型 [`Ptr`](@ref) 的子类型：

```jldoctest
julia> Ptr{Float64} <: Ptr
true

julia> Ptr{Int64} <: Ptr
true
```

## UnionAll 类型

我们已经说过像 `Ptr` 这样的参数类型充当它所有实例（`Ptr{Int64}` 等）的超类型。这是如何工作的？`Ptr` 本身不能是普通的数据类型，因为在不知道引用数据的类型时，该类型显然不能用于存储器操作。答案是 `Ptr`（或其它参数类型像 `Array`）是一种不同种类的类型，称为 [`UnionAll`](@ref) 类型。这种类型表示某些参数的所有值的类型的*迭代并集*。

`UnionAll` 类型通常使用关键字 `where` 编写。例如，`Ptr` 可以更精确地写为 `Ptr{T} where T`，也就是对于 `T` 的某些值，所有类型为 `Ptr{T}` 的值。在这种情况下，参数 `T` 也常被称为「类型变量」，因为它就像一个取值范围为类型的变量。每个 `where` 只引入一个类型变量，因此在具有多个参数的类型中这些表达式会被嵌套，例如 `Array{T,N} where N where T`。

类型应用语法 `A{B,C}` 要求 `A` 是个 `UnionAll` 类型，并先把 `B` 替换为 `A` 中最外层的类型变量。结果应该是另一个 `UnionAll` 类型，然后把 `C` 替换为该类型的类型变量。所以 `A{B,C}` 等价于 `A{B}{C}`。这解释了为什么可以部分实例化一个类型，比如 `Array{Float64}`：第一个参数已经被固定，但第二个参数仍取遍所有可能值。通过使用 `where` 语法，任何参数子集都能被固定。例如，所有一维数组的类型可以写为 `Array{T,1} where T`。

类型变量可以用子类型关系来加以限制。`Array{T} where T<:Integer` 指的是元素类型是某种 [`Integer`](@ref) 的所有数组。语法 `Array{<:Integer}` 是 `Array{T} where T<:Integer` 的便捷的缩写。类型变量可同时具有上下界。`Array{T} where Int<:T<:Number` 指的是元素类型为能够包含 `Int` 的 [`Number`](@ref) 的所有数组（因为 `T` 至少和 `Int` 一样大）。语法 `where T>:Int` 也能用来只指定类型变量的下界，且 `Array{>:Int}` 等价于 `Array{T} where T>:Int`。

由于 `where` 表达式可以嵌套，类型变量界可以引用更外层的类型变量。比如 `Tuple{T,Array{S}} where S<:AbstractArray{T} where T<:Real` 指的是二元元组，其第一个元素是某个 [`Real`](@ref)，而第二个元素是任意种类的数组 `Array`，且该数组的元素类型包含于第一个元组元素的类型。

`where` 关键字本身可以嵌套在更复杂的声明里。例如，考虑由以下声明创建的两个类型：

```jldoctest
julia> const T1 = Array{Array{T,1} where T, 1}
Array{Array{T,1} where T,1}

julia> const T2 = Array{Array{T,1}, 1} where T
Array{Array{T,1},1} where T
```

类型 `T1` 定义了由一维数组组成的一维数组；每个内部数组由相同类型的对象组成，但此类型对于不同内部数组可以不同。另一方面，类型 `T2` 定义了由一维数组组成的一维数组，其中的每个内部数组必须具有相同的类型。请注意，`T2` 是个抽象类型，比如 `Array{Array{Int,1},1} <: T2`，而 `T1` 是个具体类型。因此，`T1` 可由零参数构造函数 `a=T1()` 构造，但 `T2` 不行。

命名此类型有一种方便的语法，类似于函数定义语法的简短形式：

```julia
Vector{T} = Array{T,1}
```

这等价于 `const Vector = Array{T,1} where T`。编写 `Vector{Float64}` 等价于编写 `Array{Float64,1}`，总类型 `Vector` 具有所有 `Array` 对象的实例，其中 `Array` 对象的第二个参数——数组维数——是 1，而不考虑元素类型是什么。在参数类型必须总被完整指定的语言中，这不是特别有用，但在 Julia 中，这允许只编写 `Vector` 来表示包含任何元素类型的所有一维密集数组的抽象类型。

## 类型别名

有时为一个已经可表达的类型引入新名称是很方便的。这可通过一个简单的赋值语句完成。例如，`UInt` 是 [`UInt32`](@ref) 或 [`UInt64`](@ref) 的别名，因为它的大小与系统上的指针大小是相适应的。

```julia-repl
# 32-bit system:
julia> UInt
UInt32

# 64-bit system:
julia> UInt
UInt64
```

在 `base/boot.jl` 中，通过以下代码实现：

```julia
if Int === Int64
    const UInt = UInt64
else
    const UInt = UInt32
end
```

当然，这依赖于 `Int` 的别名，但它被预定义成正确的类型—— [`Int32`](@ref) 或 [`Int64`](@ref)。

（注意，与 `Int` 不同，`Float` 不作为特定大小的 [`AbstractFloat`](@ref) 类型的别名而存在。与整数寄存器不同，浮点数寄存器大小由 IEEE-754 标准指定，而 `Int` 的大小反映了该机器上本地指针的大小。）

## 类型操作

因为 Julia 中的类型本身就是对象，所以一般的函数可以对它们进行操作。已经引入了一些对于使用或探索类型特别有用的函数，例如 `<:` 运算符，它表示其左操作数是否为其右操作数的子类型。

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
[...]
```

## [自定义 pretty-printing](@id man-custom-pretty-printing)

通常，人们会想要自定义显示类型实例的方式。这可通过重载 [`show`](@ref) 函数来完成。举个例子，假设我们定义一个类型来表示极坐标形式的复数：

```jldoctest polartype
julia> struct Polar{T<:Real} <: Number
           r::T
           Θ::T
       end

julia> Polar(r::Real,Θ::Real) = Polar(promote(r,Θ)...)
Polar
```

在这里，我们添加了一个自定义的构造函数，这样就可以接受不同 [`Real`](@ref) 类型的参数并将它们类型提升为共同类型（请参阅[构造函数](@ref man-constructors)和[类型转换和类型提升](@ref conversion-and-promotion)）。（当然，为了让它表现地像个 [`Number`](@ref)，我们需要定义许多其它方法，例如 `+`、`*`、`one`、`zero` 及类型提升规则等。）默认情况下，此类型的实例只是相当简单地显示有关类型名称和字段值的信息，比如，`Polar{Float64}(3.0,4.0)`。

如果我们希望它显示为 `3.0 * exp(4.0im)`，我们将定义以下方法来将对象打印到给定的输出对象 `io`（其代表文件、终端、及缓冲区等；请参阅[网络和流](@ref)）：

```jldoctest polartype
julia> Base.show(io::IO, z::Polar) = print(io, z.r, " * exp(", z.Θ, "im)")
```

`Polar` 对象的输出可以被更精细地控制。特别是，人们有时想要啰嗦的多行打印格式，用于在 REPL 和其它交互式环境中显示单个对象，以及一个更紧凑的单行格式，用于 [`print`](@ref) 函数或在作为其它对象（比如一个数组）的部分是显示该对象。虽然在两种情况下默认都会调用 `show(io, z)` 函数，你仍可以定义一个*不同*的多行格式来显示单个对象，这通过重载三参数形式的 `show` 函数，该函数接收 `text/plain` MIME 类型（请参阅 [多媒体 I/O](@ref)）作为它的第二个参数，举个例子：

```jldoctest polartype
julia> Base.show(io::IO, ::MIME"text/plain", z::Polar{T}) where{T} =
           print(io, "Polar{$T} complex number:\n   ", z)
```

（请注意 `print(..., z)` 在这里调用的是双参数的 `show(io, z)` 方法。）这导致：

```jldoctest polartype
julia> Polar(3, 4.0)
Polar{Float64} complex number:
   3.0 * exp(4.0im)

julia> [Polar(3, 4.0), Polar(4.0,5.3)]
2-element Array{Polar{Float64},1}:
 3.0 * exp(4.0im)
 4.0 * exp(5.3im)
```

其中单行格式的 `show(io, z)` 仍用于由 `Polar` 值组成的数组。从技术上讲，REPL 调用 `display(z)` 来显示单行的执行结果，其默认为 `show(stdout, MIME("text/plain"), z)`，而后者又默认为 `show(stdout, z)`，但是你*不应该*定义新的 [`display`](@ref) 方法，除非你正在定义新的多媒体显示管理器（请参阅[多媒体 I/O](@ref)）。

此外，你还可以为其它 MIME 类型定义 `show` 方法，以便在支持的环境（比如 IJulia）中实现更丰富的对象显示（HTML、图像等）。例如，我们可以定义 `Polar` 对象的 HTML 显示格式，使其带有上标和斜体：

```jldoctest polartype
julia> Base.show(io::IO, ::MIME"text/html", z::Polar{T}) where {T} =
           println(io, "<code>Polar{$T}</code> complex number: ",
                   z.r, " <i>e</i><sup>", z.Θ, " <i>i</i></sup>")
```

之后会在支持 HTML 显示的环境中自动使用 HTML 显示 `Polar` 对象，但如果你想，也可以手动调用 `show` 来获取 HTML 输出：

```jldoctest polartype
julia> show(stdout, "text/html", Polar(3.0,4.0))
<code>Polar{Float64}</code> complex number: 3.0 <i>e</i><sup>4.0 <i>i</i></sup>
```

```@raw html
<p>An HTML renderer would display this as: <code>Polar{Float64}</code> complex number: 3.0 <i>e</i><sup>4.0 <i>i</i></sup></p>
```

根据经验，单行 `show` 方法应为创建的显示对象打印有效的 Julia 表达式。当这个 `show` 方法包含中缀运算符时，比如上面的 `Polar` 的单行 `show` 方法里的乘法运算符（`*`），在作为另一个对象的部分打印时，它可能无法被正确解析。要查看此问题，请考虑下面的表达式对象（请参阅[程序表示](@ref)），它代表 `Polar` 类型的特定实例的平方：

```jldoctest polartype
julia> a = Polar(3, 4.0)
Polar{Float64} complex number:
   3.0 * exp(4.0im)

julia> print(:($a^2))
3.0 * exp(4.0im) ^ 2
```

因为运算符 `^` 的优先级高于 `*`（请参阅[运算符的优先级与结合性](@ref)），所以此输出不忠实地表示了表达式 `a ^ 2`，而该表达式等价于 `(3.0 * exp(4.0im)) ^ 2`。为了解决这个问题，我们必须为 `Base.show_unquoted(io::IO, z::Polar, indent::Int, precedence::Int)` 创建一个自定义方法，在打印时，表达式对象会在内部调用它：

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

当正在调用的运算符的优先级大于等于乘法的优先级时，上面定义的方法会在 `show` 调用的两侧加上括号。这个检查允许在没有括号的情况下被正确解析的表达式（例如 `:($a + 2)` 和 `:($a == 2)`）在打印时省略括号：

```jldoctest polartype
julia> :($a + 2)
:(3.0 * exp(4.0im) + 2)

julia> :($a == 2)
:(3.0 * exp(4.0im) == 2)
```

在某些情况下，根据上下文调整 `show` 方法的行为是很有用的。这可通过 [`IOContext`](@ref) 类型实现，它允许一起传递上下文属性和封装后的 IO 流。例如，我们可以在 `:compact` 属性设置为 `true` 时创建一个更短的表示，而在该属性为 `false` 或不存在时返回长的表示：
```jldoctest polartype
julia> function Base.show(io::IO, z::Polar)
           if get(io, :compact, false)
               print(io, z.r, "ℯ", z.Θ, "im")
           else
               print(io, z.r, " * exp(", z.Θ, "im)")
           end
       end
```

当传入的 IO 流是设置了 `:compact`（译注：该属性还应当设置为 `true`）属性的 `IOContext` 对象时，将使用这个新的紧凑表示。特别地，当打印具有多列的数组（由于水平空间有限）时就是这种情况：
```jldoctest polartype
julia> show(IOContext(stdout, :compact=>true), Polar(3, 4.0))
3.0ℯ4.0im

julia> [Polar(3, 4.0) Polar(4.0,5.3)]
1×2 Array{Polar{Float64},2}:
 3.0ℯ4.0im  4.0ℯ5.3im
```

有关调整打印效果的常用属性列表，请参阅文档 [`IOContext`](@ref)。

## 值类型

在 Julia 中，你无法根据诸如 `true` 或 `false` 之类的*值*进行分派。然而，你可以根据参数类型进行分派，Julia 允许你包含「plain bits」值（类型、符号、整数、浮点数和元组等）作为类型参数。`Array{T,N}` 里的维度参数就是一个常见的例子，在那里 `T` 是类型（比如 [`Float64`](@ref)），而 `N` 只是个 `Int`。

你可以创建把值作为参数的自定义类型，并使用它们控制自定义类型的分派。为了说明这个想法，让我们引入参数类型 `Val{x}` 和构造函数 `Val(x) = Val{x}()`，它可以作为一种习惯的方式来利用这种技术需要更精细的层次结构。这可以作为利用这种技术的惯用方式，而且不需要更精细的层次结构。

[`Val`](@ref) 的定义为：

```jldoctest valtype
julia> struct Val{x}
       end

julia> Val(x) = Val{x}()
Val
```

`Val` 的实现就只需要这些。一些 Julia 标准库里的函数接收 `Val` 的实例作为参数，你也可以使用它来编写你自己的函数，例如：

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

为了保证 Julia 的一致性，调用处应当始终传递 `Val` **实例** 而不是 **类型**，也就是使用 `foo(Val(:bar))` 而不是 `foo(Val{:bar})`。

值得注意的是，参数「值」类型非常容易被误用，包括 `Val`；情况不太好时，你很容易使代码性能变得更*糟糕*。一般使用时，你可能从来不会想要写出上方示例那样的代码。有关 `Val` 的正确（和不正确）使用的更多信息，请阅读[性能建议](@ref man-performance-tips)中更广泛的讨论。

[^1]: 「少数」由常数 `MAX_UNION_SPLITTING` 定义，目前设置为 4。
