# [类型](@id man-types)

通常，我们把程序语言中的类型系统划分成两类：静态类型和动态类型。对于静态类型系统，在程序运行之前，我们就知道每一个表达式的类型。而对于动态类型系统，我们只有通过运行那个程序，得到表达式具体的值，才能确定其具体的类型。在静态类型语言中，通常我们可以在不知道具体类型的情况下写一些代码，这种将一段代码用在多个类型的能力被称为多态性。在经典的动态类型语言中，所有的代码都是多态的，这意味着这些代码对于其中值的类型没有约束，除非在代码中去具体的判断一个值的类型，或者对对象做一些它不支持的操作。

Julia's type system is dynamic, but gains some of the advantages of static type systems by making
it possible to indicate that certain values are of specific types. This can be of great assistance
in generating efficient code, but even more significantly, it allows method dispatch on the types
of function arguments to be deeply integrated with the language. Method dispatch is explored in
detail in [Methods](@ref), but is rooted in the type system presented here.

The default behavior in Julia when types are omitted is to allow values to be of any type. Thus,
one can write many useful Julia functions without ever explicitly using types. When additional
expressiveness is needed, however, it is easy to gradually introduce explicit type annotations
into previously "untyped" code. Adding annotations serves three primary purposes: to take advantage
of Julia's powerful multiple-dispatch mechanism,  to improve human readability, and to catch
programmer errors.

Describing Julia in the lingo of [type systems](https://en.wikipedia.org/wiki/Type_system), it
is: dynamic, nominative and parametric. Generic types can be parameterized, and the hierarchical
relationships between types are [explicitly declared](https://en.wikipedia.org/wiki/Nominal_type_system),
rather than [implied by compatible structure](https://en.wikipedia.org/wiki/Structural_type_system).
One particularly distinctive feature of Julia's type system is that concrete types may not subtype
each other: all concrete types are final and may only have abstract types as their supertypes.
While this might at first seem unduly restrictive, it has many beneficial consequences with surprisingly
few drawbacks. It turns out that being able to inherit behavior is much more important than being
able to inherit structure, and inheriting both causes significant difficulties in traditional
object-oriented languages. Other high-level aspects of Julia's type system that should be mentioned
up front are:

  * There is no division between object and non-object values: all values in Julia are true objects
    having a type that belongs to a single, fully connected type graph, all nodes of which are equally
    first-class as types.
  * There is no meaningful concept of a "compile-time type": the only type a value has is its actual
    type when the program is running. This is called a "run-time type" in object-oriented languages
    where the combination of static compilation with polymorphism makes this distinction significant.
  * 值有类型，变量没有类型——变量仅仅是绑定了值的名字而已。
  * Both abstract and concrete types can be parameterized by other types. They can also be parameterized
    by symbols, by values of any type for which [`isbits`](@ref) returns true (essentially, things
    like numbers and bools that are stored like C types or `struct`s with no pointers to other objects),
    and also by tuples thereof. Type parameters may be omitted when they do not need to be referenced
    or restricted.

Julia's type system is designed to be powerful and expressive, yet clear, intuitive and unobtrusive.
Many Julia programmers may never feel the need to write code that explicitly uses types. Some
kinds of programming, however, become clearer, simpler, faster and more robust with declared types.

## 类型断言

`::`运算符可以用来在程序中给表达式和变量附加类型注释。这有两个主要原因：

1. 作为断言，帮助程序确认能是否正常运行，
2. 给编译器提供额外的类型信息，这可能帮助程序提升性能
   ，在某些情况下

When appended to an expression computing a value, the `::` operator is read as "is an instance
of". It can be used anywhere to assert that the value of the expression on the left is an instance
of the type on the right. When the type on the right is concrete, the value on the left must have
that type as its implementation -- recall that all concrete types are final, so no implementation
is a subtype of any other. When the type is abstract, it suffices for the value to be implemented
by a concrete type that is a subtype of the abstract type. If the type assertion is not true,
an exception is thrown, otherwise, the left-hand value is returned:

```jldoctest
julia> (1+2)::AbstractFloat
ERROR: TypeError: in typeassert, expected AbstractFloat, got Int64

julia> (1+2)::Int
3
```

可以在任何表达式的所在位置做类型断言。

When appended to a variable on the left-hand side of an assignment, or as part of a `local` declaration,
the `::` operator means something a bit different: it declares the variable to always have the
specified type, like a type declaration in a statically-typed language such as C. Every value
assigned to the variable will be converted to the declared type using [`convert`](@ref):

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

Abstract types cannot be instantiated, and serve only as nodes in the type graph, thereby describing
sets of related concrete types: those concrete types which are their descendants. We begin with
abstract types even though they have no instantiation because they are the backbone of the type
system: they form the conceptual hierarchy which makes Julia's type system more than just a collection
of object implementations.

Recall that in [Integers and Floating-Point Numbers](@ref), we introduced a variety of concrete
types of numeric values: [`Int8`](@ref), [`UInt8`](@ref), [`Int16`](@ref), [`UInt16`](@ref),
[`Int32`](@ref), [`UInt32`](@ref), [`Int64`](@ref), [`UInt64`](@ref), [`Int128`](@ref),
[`UInt128`](@ref), [`Float16`](@ref), [`Float32`](@ref), and [`Float64`](@ref). Although
they have different representation sizes, `Int8`, `Int16`, `Int32`, `Int64` and `Int128`
all have in common that they are signed integer types. Likewise `UInt8`, `UInt16`, `UInt32`,
`UInt64` and `UInt128` are all unsigned integer types, while `Float16`, `Float32` and
`Float64` are distinct in being floating-point types rather than integers. It is common for
a piece of code to make sense, for example, only if its arguments are some kind of integer,
but not really depend on what particular *kind* of integer. For example, the greatest common
denominator algorithm works for all kinds of integers, but will not work for floating-point
numbers. Abstract types allow the construction of a hierarchy of types, providing a context
into which concrete types can fit. This allows you, for example, to easily program to any type
that is an integer, without restricting an algorithm to a specific type of integer.

使用[`abstract type`](@ref)关键词来声明抽象类型。抽象类型的一般语法时：

```
abstract type «name» end
abstract type «name» <: «supertype» end
```

该`abstract type` 关键字引入了一个新的抽象类型，`«name»`为其名称。此名称后面可以跟[`<:`](@ref)和一个已存在的类型，表示新声明的抽象类型是此“父”类型的子类型。

如果没有给出父类型，则默认父类型为`Any`——所有对象和类型都是这个抽象类型的子类型。在类型理论中，`Any`通常称为"top"，因为它位于类型图的顶峰。Julia还有一个预定义的抽象"bottom"类型，在类型图的最低点，写成`Union{}`。这与`Any`完全相反：任何对象都不是`Union{}`的实例，所有的类型都是`Union{}`的父类型。

Let's consider some of the abstract types that make up Julia's numerical hierarchy:

```julia
abstract type Number end
abstract type Real     <: Number end
abstract type AbstractFloat <: Real end
abstract type Integer  <: Real end
abstract type Signed   <: Integer end
abstract type Unsigned <: Integer end
```

[`Number`](@ref)类型为`Any`类型的直接子类型，并且[`Real`](@ref)为它的子类型。反过来，`Real`有两个子类型（它还有更多的子类型，但这里只展示了两个，稍后将会看到更多的类型）： [`Integer`](@ref) 和[`AbstractFloat`](@ref)，将”数字世界“分为整数和实数的两部分。实数当然还包括浮点类型和其他类型，例如有理数。因此，`AbstractFloat`是一个`Real`的子类型，仅包括实数的浮点表示。整数被进一步细分为[`Signed`](@ref)和[`Unsigned`](@ref) 两类。

`<:`运算符的含义是”前者是后者的子类型“，被用于声明类型，它声明右侧是左侧新声明类型的直接父类型。也可以用来判断左侧是不是右侧的子类型，当其左侧是右侧的子类型时返回`true`

```jldoctest
julia> Integer <: Number
true

julia> Integer <: AbstractFloat
false
```

抽象类型的一个重要用途是为具体类型提供默认实现。举一个简单的例子：

```julia
function myplus(x,y)
    x+y
end
```

The first thing to note is that the above argument declarations are equivalent to `x::Any` and
`y::Any`. When this function is invoked, say as `myplus(2,5)`, the dispatcher chooses the most
specific method named `myplus` that matches the given arguments. (See [Methods](@ref) for more
information on multiple dispatch.)

Assuming no method more specific than the above is found, Julia next internally defines and compiles
a method called `myplus` specifically for two `Int` arguments based on the generic function given
above, i.e., it implicitly defines and compiles:

```julia
function myplus(x::Int,y::Int)
    x+y
end
```

最后，调用这个具体的函数。

Thus, abstract types allow programmers to write generic functions that can later be used as the
default method by many combinations of concrete types. Thanks to multiple dispatch, the programmer
has full control over whether the default or more specific method is used.

An important point to note is that there is no loss in performance if the programmer relies on
a function whose arguments are abstract types, because it is recompiled for each tuple of argument
concrete types with which it is invoked. (There may be a performance issue, however, in the case
of function arguments that are containers of abstract types; see [Performance Tips](@ref man-performance-tips).)

## 位类型

位类型是具体类型，其数据是由位构成。位类型的经典示例是整数和浮点数。与大多数语言不同，Julia允许您声明自己的位类型，而不是仅提供一组固定的内置类型。实际上，标准位类型都是在语言本身中定义的：

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

声明位类型的一般语法是：

```
primitive type «name» «bits» end
primitive type «name» <: «supertype» «bits» end
```

bits表示该类型需要多少存储空间，name为新类型指定名称。可已经一个位类型声明为某个父类型的子类型。如果省略父类型，则默认`Any`为其直接父类型。上述声明中意味着[`Bool`](@ref)类型需要8位来储存，并且直接父类型为[`Integer`](@ref)。目前，仅支持8位倍数的大小。因此，布尔值虽然确实只需要一位，但不能声明为小于八位的值。

The types [`Bool`](@ref), [`Int8`](@ref) and [`UInt8`](@ref) all have identical representations:
they are eight-bit chunks of memory. Since Julia's type system is nominative, however, they
are not interchangeable despite having identical structure. A fundamental difference between
them is that they have different supertypes: [`Bool`](@ref)'s direct supertype is [`Integer`](@ref),
[`Int8`](@ref)'s is [`Signed`](@ref), and [`UInt8`](@ref)'s is [`Unsigned`](@ref). All other
differences between [`Bool`](@ref), [`Int8`](@ref), and [`UInt8`](@ref) are matters of
behavior -- the way functions are defined to act when given objects of these types as
arguments. This is why a nominative type system is necessary: if structure determined type,
which in turn dictates behavior, then it would be impossible to make [`Bool`](@ref) behave
any differently than [`Int8`](@ref) or [`UInt8`](@ref).

## 复合类型

[Composite types](https://en.wikipedia.org/wiki/Composite_data_type) are called records, structs,
or objects in various languages. A composite type is a collection of named fields,
an instance of which can be treated as a single value. In many languages, composite types are
the only kind of user-definable type, and they are by far the most commonly used user-defined
type in Julia as well.

In mainstream object oriented languages, such as C++, Java, Python and Ruby, composite types also
have named functions associated with them, and the combination is called an "object". In purer
object-oriented languages, such as Ruby or Smalltalk, all values are objects whether they are
composites or not. In less pure object oriented languages, including C++ and Java, some values,
such as integers and floating-point values, are not objects, while instances of user-defined composite
types are true objects with associated methods. In Julia, all values are objects, but functions
are not bundled with the objects they operate on. This is necessary since Julia chooses which
method of a function to use by multiple dispatch, meaning that the types of *all* of a function's
arguments are considered when selecting a method, rather than just the first one (see [Methods](@ref)
for more information on methods and dispatch). Thus, it would be inappropriate for functions to
"belong" to only their first argument. Organizing methods into function objects rather than having
named bags of methods "inside" each object ends up being a highly beneficial aspect of the language
design.

[`struct`](@ref)关键词用于构造复合类型，后跟一个字段的名称，可选择使用`::`运算符注释类型：

```jldoctest footype
julia> struct Foo
           bar
           baz::Int
           qux::Float64
       end
```

没有类型注释的字段默认位`Any`类型，所以可以保存任何类型的值。

类型为`Foo`的新对象是通过将`Foo`类型对象（如函数）应用于其字段的值来创建的：

```jldoctest footype
julia> foo = Foo("Hello, world.", 23, 1.5)
Foo("Hello, world.", 23, 1.5)

julia> typeof(foo)
Foo
```

When a type is applied like a function it is called a *constructor*. Two constructors are generated
automatically (these are called *default constructors*). One accepts any arguments and calls
[`convert`](@ref) to convert them to the types of the fields, and the other accepts arguments
that match the field types exactly. The reason both of these are generated is that this makes
it easier to add new definitions without inadvertently replacing a default constructor.

由于`bar`字段在类型上不受限制，因此任何值都可以。但是`baz`的值必须可转换为`Int`类型：

```jldoctest footype
julia> Foo((), 23.5, 1)
ERROR: InexactError: Int64(Int64, 23.5)
Stacktrace:
[...]
```

可以使用[`fieldnames`](@ref) 函数找到字段名称列表.

```jldoctest footype
julia> fieldnames(Foo)
(:bar, :baz, :qux)
```

可以使用传统的`foo.bar`表示法访问复合对象的字段值：

```jldoctest footype
julia> foo.bar
"Hello, world."

julia> foo.baz
23

julia> foo.qux
1.5
```

Composite objects declared with `struct` are *immutable*; they cannot be modified
after construction. This may seem odd at first, but it has several advantages:

  * It can be more efficient. Some structs can be packed efficiently into arrays, and
    in some cases the compiler is able to avoid allocating immutable objects entirely.
  * It is not possible to violate the invariants provided by the type's constructors.
  * Code using immutable objects can be easier to reason about.

An immutable object might contain mutable objects, such as arrays, as fields. Those contained
objects will remain mutable; only the fields of the immutable object itself cannot be changed
to point to different objects.

Where required, mutable composite objects can be declared with the keyword [`mutable struct`](@ref), to be
discussed in the next section.

Immutable composite types with no fields are singletons; there can be only one instance of such types:

```jldoctest
julia> struct NoFields
       end

julia> NoFields() === NoFields()
true
```

 [`===`](@ref)函数用来确认”两个“构造的实例`NoFields`实际上是同一个。单态类型将在[下面](@ref man-singleton-types)进一步详细描述。

There is much more to say about how instances of composite types are created, but that discussion
depends on both [Parametric Types](@ref) and on [Methods](@ref), and is sufficiently important
to be addressed in its own section: [Constructors](@ref man-constructors).

## 可变复合类型

如果使用`mutable struct`而不是声明复合类型`struct`，则可以修改它的实例：

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

In order to support mutation, such objects are generally allocated on the heap, and have
stable memory addresses.
A mutable object is like a little container that might hold different values over time,
and so can only be reliably identified with its address.
In contrast, an instance of an immutable type is associated with specific field values ---
the field values alone tell you everything about the object.
In deciding whether to make a type mutable, ask whether two instances
with the same field values would be considered identical, or if they might need to change independently
over time. If they would be considered identical, the type should probably be immutable.

To recap, two essential properties define immutability in Julia:

  * It is not permitted to modify the value of an immutable type.
    * For bits types this means that the bit pattern of a value once set will never change
      and that value is the identity of a bits type.
    * For composite  types, this means that the identity of the values of its fields will
      never change. When the fields are bits types, that means their bits will never change,
      for fields whose values are mutable types like arrays, that means the fields will
      always refer to the same mutable value even though that mutable value's content may
      itself be modified.
  * An object with an immutable type may be copied freely by the compiler since its
    immutability makes it impossible to programmatically distinguish between the original
    object and a copy.
    * In particular, this means that small enough immutable values like integers and floats
      are typically passed to functions in registers (or stack allocated).
    * Mutable values, on the other hand are heap-allocated and passed to
      functions as pointers to heap-allocated values except in cases where the compiler
      is sure that there's no way to tell that this is not what is happening.

## Declared Types

The three kinds of types (abstract, primitive, composite) discussed in the previous
sections are actually all closely related. They share the same key properties:

  * They are explicitly declared.
  * They have names.
  * They have explicitly declared supertypes.
  * They may have parameters.

Because of these shared properties, these types are internally represented as instances of the
same concept, `DataType`, which is the type of any of these types:

```jldoctest
julia> typeof(Real)
DataType

julia> typeof(Int)
DataType
```

A `DataType` may be abstract or concrete. If it is concrete, it has a specified size, storage
layout, and (optionally) field names. Thus a primitive type is a `DataType` with nonzero size, but
no field names. A composite type is a `DataType` that has field names or is empty (zero size).

在这个系统里的每一个具体的值都是某个`DataType`的实例。

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

## Type Aliases

Sometimes it is convenient to introduce a new name for an already expressible type.
This can be done with a simple assignment statement.
For example, `UInt` is aliased to either [`UInt32`](@ref) or [`UInt64`](@ref) as is
appropriate for the size of pointers on the system:

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

Of course, this depends on what `Int` is aliased to -- but that is predefined to be the correct
type -- either [`Int32`](@ref) or [`Int64`](@ref).

(Note that unlike `Int`, `Float` does not exist as a type alias for a specific sized
[`AbstractFloat`](@ref). Unlike with integer registers, the floating point register sizes
are specified by the IEEE-754 standard. Whereas the size of `Int` reflects the size of a
native pointer on that machine.)

## Operations on Types

Since types in Julia are themselves objects, ordinary functions can operate on them. Some functions
that are particularly useful for working with or exploring types have already been introduced,
such as the `<:` operator, which indicates whether its left hand operand is a subtype of its right
hand operand.

The [`isa`](@ref) function tests if an object is of a given type and returns true or false:

```jldoctest
julia> isa(1, Int)
true

julia> isa(1, AbstractFloat)
false
```

The [`typeof`](@ref) function, already used throughout the manual in examples, returns the type
of its argument. Since, as noted above, types are objects, they also have types, and we can ask
what their types are:

```jldoctest
julia> typeof(Rational{Int})
DataType

julia> typeof(Union{Real,Float64,Rational})
DataType

julia> typeof(Union{Real,String})
Union
```

What if we repeat the process? What is the type of a type of a type? As it happens, types are
all composite values and thus all have a type of `DataType`:

```jldoctest
julia> typeof(DataType)
DataType

julia> typeof(Union)
DataType
```

`DataType` is its own type.

Another operation that applies to some types is [`supertype`](@ref), which reveals a type's
supertype. Only declared types (`DataType`) have unambiguous supertypes:

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

If you apply [`supertype`](@ref) to other type objects (or non-type objects), a [`MethodError`](@ref)
is raised:

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
