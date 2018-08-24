# 方法

我们回想一下，在[函数](@ref man-functions)中我们知道函数是这么一个对象，它把一组参数映射成一个返回值，或者当没有办法返回恰当的值时扔出一个异常。对于相同概念的函数或者运算对不同的参数类型有十分不一样的实现这件事是普遍存在的：两个整数的加法与两个浮点数的加法是相当不一样的，整数与浮点数之间的加法也不一样。除开他们实现上的不同，这些运算都归在"加法"这么一个通用概念之下。因此在Julia中这些行为都属于一个对象：`+`函数。

为了让对同样的概念使用许多不同的实现这件事更顺畅，函数没有必要马上全部都被定义，反而应该是一块一块地定义，为特定的参数类型和数量的组合提供指定的行为。对于一个函数的一个可能行为的定义叫做*方法*。直到这里，我们只展示了那些只定了一个方法的，对参数的所有类型都适用的函数。但是方法定义的特点是不仅能表明参数的数量，也能表明参数的类型，并且能提供多个方法定义。当一个函数被应用于特殊的一组参数时，能用于这一组参数的最特定的方法会被使用。所以，函数的全体行为是他的不同的方法定义的行为的组合。如果这个组合被设计得好，即使方法们的实现之间会很不一样，函数的外部行为也会显得无缝而自洽。

当一个函数被应用时执行方法的选择被称为*分派*。Julia允许分派过程来基于给的参数的个数和所有的参数的类型来选择调用函数的哪个方法。这与传统的面对对象的语言不一样，面对对象语言的分派只基于第一参数，经常有特殊的参数语法并且有时是暗含而非显式写成一个参数。[^1]使用函数的所有参数，而非只用第一个，来决定调用哪个方法被称为[多重分派](https://en.wikipedia.org/wiki/Multiple_dispatch)。多重分派对于数学代码来说特别有用，人工地将运算视为对于其中一个参数的属于程度比其他所有的参数都强的这个概念对于数学代码是几乎没有意义的：`x + y`中的加法运算对`x`的属于程度比对`y`更强？一个数学运算符的实现普遍基于它所有的参数的类型。即使跳出数学运算，多重分派是对于结构和组织程序来说也是一个强大而方便的范式。

[^1]:
    In C++ or Java, for example, in a method call like `obj.meth(arg1,arg2)`, the object obj "receives"
    the method call and is implicitly passed to the method via the `this` keyword, rather than as
    an explicit method argument. When the current `this` object is the receiver of a method call,
    it can be omitted altogether, writing just `meth(arg1,arg2)`, with `this` implied as the receiving
    object.

## 定义方法

直到这里，在我们的例子中，我们只定义了只有一个不限制参数类型的方法的函数。这样的函数的行为就像在传统的动态类型的语言中一样。不过，我们已经在没有意识到的情况下使用了多重分派和方法：所有的Julia的标准函数和运算符，就像之前提到的`+`函数，都有基于参数类型和数量的不同可能的组合而定义的大量方法。

当定义一个函数时，可以视需要来约束可以应用的参数类型，使用在[Composite Types](@ref)中介绍的`::`类型断言运算符。

```jldoctest fofxy
julia> f(x::Float64, y::Float64) = 2x + y
f (generic function with 1 method)
```

This function definition applies only to calls where `x` and `y` are both values of type
[`Float64`](@ref):

```jldoctest fofxy
julia> f(2.0, 3.0)
7.0
```

将其运用于其他任意的参数类型会导致 [`MethodError`](@ref):

```jldoctest fofxy
julia> f(2.0, 3)
ERROR: MethodError: no method matching f(::Float64, ::Int64)
Closest candidates are:
  f(::Float64, !Matched::Float64) at none:1

julia> f(Float32(2.0), 3.0)
ERROR: MethodError: no method matching f(::Float32, ::Float64)
Closest candidates are:
  f(!Matched::Float64, ::Float64) at none:1

julia> f(2.0, "3.0")
ERROR: MethodError: no method matching f(::Float64, ::String)
Closest candidates are:
  f(::Float64, !Matched::Float64) at none:1

julia> f("2.0", "3.0")
ERROR: MethodError: no method matching f(::String, ::String)
```

如同你所看到的，参数必须精确地是类型[`Float64`](@ref)。其他的数字类型，比如整数或者32位浮点数值都不会自动转化成64位浮点数，字符串也不会分析成数字。因为`Float64`是一个具体类型，在Julia中具体类型无法有子类，这样的定义只会被应用于确实是类型`Float64`的参数。然而这对写声明的参数类型是抽象的通用方法来说是常常有用的：
```jldoctest fofxy
julia> f(x::Number, y::Number) = 2x - y
f (generic function with 2 methods)

julia> f(2.0, 3)
1.0
```

这个方法定义应用于任意一对[`Number`](@ref)的实例的参数。他们不需要是同一类型的，只要他们都是数字值。操作不同数字类型的问题就委派给了表达式`2x - y`中的算法运算。

为了定义一个有多个方法的函数，只需简单定义这个函数多次，使用不同的参数数量和类型。函数的第一个方法定义会建立这个函数对象，后续的方法定义会添加新的方法到存在的函数对象中去。当函数被应用时，最符合参数的数量和类型的特定方法会被执行。所以，上面的两个方法定义在一起定义了函数`f`对于所有的一对虚拟类型`Number`实例的行为 -- 但是针对一对[`Float64`](@ref)值有不同的行为。如果一个参数是64位浮点数而另一个不是，`f(Float64,Float64)`方法不会被调用，而一定使用更加通用的`f(Number,Number)`方法：

```jldoctest fofxy
julia> f(2.0, 3.0)
7.0

julia> f(2, 3.0)
1.0

julia> f(2.0, 3)
1.0

julia> f(2, 3)
1
```

`2x + y`定义只用于第一个情况，`2x - y`定义用于其他的情况。没有使用任何自动的函数参数的指派或者类型转换：Julia中的所有转换都不是magic的，都是完全显式的。然而[类型转换和类型提升](@ref conversion-and-promotion)显示了足够先进的技术的智能应用能够与magic不可分辨到什么程度。[^Clark61]对于非数字值，和比两个参数更多或者更少的情况，函数`f`并没有定义，应用会导致[`MethodError`](@ref)：
```jldoctest fofxy
julia> f("foo", 3)
ERROR: MethodError: no method matching f(::String, ::Int64)
Closest candidates are:
 f(!Matched::Number, ::Number) at none:1

julia> f()
ERROR: MethodError: no method matching f()
Closest candidates are:
 f(!Matched::Float64, !Matched::Float64) at none:1
 f(!Matched::Number, !Matched::Number) at none:1
```

可以简单地看到对于函数存在哪些方法，通过在交互式会话中键入函数对象本身：

```jldoctest fofxy
julia> f
f (generic function with 2 methods)
```

这个输出告诉我们`f`是有两个方法的函数对象。为了找出那些方法的signature是什么，使用 [`methods`](@ref)函数：

```julia-repl
julia> methods(f)
# 2 methods for generic function "f":
[1] f(x::Float64, y::Float64) in Main at none:1
[2] f(x::Number, y::Number) in Main at none:1
```

这表示`f`有两个方法，一个接受两个`Float64`参数一个接受两个`Number`类型的参数。它也显示了这些方法定义所在的文件和行数：因为这些方法是在REPL中定义的，我们得到了表面上的行数`none:1`.

没有`::`的类型声明，方法参数的类型默认为`Any`，这就意味着没有约束，因为Julia中的所有的值都是抽象类型`Any`的实例。所以，我们可以为`f`定义一个接受所有的方法，像这样：

```jldoctest fofxy
julia> f(x,y) = println("Whoa there, Nelly.")
f (generic function with 3 methods)

julia> f("foo", 1)
Whoa there, Nelly.
```

这个接受所有的方法比其他的对一堆参数值的其他任意可能的方法定义更不专用。所以他只会被没有其他方法定义应用的一对参数调用。

虽然这像是一个简单的概念，基于值的类型的多重分派可能是Julia语言的一个最强大和中心特征。核心运算符都典型地含有很多方法：

```julia-repl
julia> methods(+)
# 180 methods for generic function "+":
[1] +(x::Bool, z::Complex{Bool}) in Base at complex.jl:227
[2] +(x::Bool, y::Bool) in Base at bool.jl:89
[3] +(x::Bool) in Base at bool.jl:86
[4] +(x::Bool, y::T) where T<:AbstractFloat in Base at bool.jl:96
[5] +(x::Bool, z::Complex) in Base at complex.jl:234
[6] +(a::Float16, b::Float16) in Base at float.jl:373
[7] +(x::Float32, y::Float32) in Base at float.jl:375
[8] +(x::Float64, y::Float64) in Base at float.jl:376
[9] +(z::Complex{Bool}, x::Bool) in Base at complex.jl:228
[10] +(z::Complex{Bool}, x::Real) in Base at complex.jl:242
[11] +(x::Char, y::Integer) in Base at char.jl:40
[12] +(c::BigInt, x::BigFloat) in Base.MPFR at mpfr.jl:307
[13] +(a::BigInt, b::BigInt, c::BigInt, d::BigInt, e::BigInt) in Base.GMP at gmp.jl:392
[14] +(a::BigInt, b::BigInt, c::BigInt, d::BigInt) in Base.GMP at gmp.jl:391
[15] +(a::BigInt, b::BigInt, c::BigInt) in Base.GMP at gmp.jl:390
[16] +(x::BigInt, y::BigInt) in Base.GMP at gmp.jl:361
[17] +(x::BigInt, c::Union{UInt16, UInt32, UInt64, UInt8}) in Base.GMP at gmp.jl:398
...
[180] +(a, b, c, xs...) in Base at operators.jl:424
```

多重分派和灵活的参数化类型系统让Julia有能力抽象地表达高层级算法，而与实现细节解耦，也能生成高效而专用的代码来在运行中处理每个情况。

## [方法歧义](@id man-ambiguities)

在一系列的函数方法定义时没有单独的最专用的方法能适用于参数的某些组合是可能的：

```jldoctest gofxy
julia> g(x::Float64, y) = 2x + y
g (generic function with 1 method)

julia> g(x, y::Float64) = x + 2y
g (generic function with 2 methods)

julia> g(2.0, 3)
7.0

julia> g(2, 3.0)
8.0

julia> g(2.0, 3.0)
ERROR: MethodError: g(::Float64, ::Float64) is ambiguous. Candidates:
  g(x, y::Float64) in Main at none:1
  g(x::Float64, y) in Main at none:1
Possible fix, define
  g(::Float64, ::Float64)
```

Here the call `g(2.0, 3.0)` could be handled by either the `g(Float64, Any)` or the `g(Any, Float64)`
method, and neither is more specific than the other. In such cases, Julia raises a [`MethodError`](@ref)
rather than arbitrarily picking a method. You can avoid method ambiguities by specifying an appropriate
method for the intersection case:

```jldoctest gofxy
julia> g(x::Float64, y::Float64) = 2x + 2y
g (generic function with 3 methods)

julia> g(2.0, 3)
7.0

julia> g(2, 3.0)
8.0

julia> g(2.0, 3.0)
10.0
```

It is recommended that the disambiguating method be defined first, since otherwise the ambiguity
exists, if transiently, until the more specific method is defined.

In more complex cases, resolving method ambiguities involves a certain
element of design; this topic is explored further [below](@ref man-method-design-ambiguities).

## Parametric Methods

Method definitions can optionally have type parameters qualifying the signature:

```jldoctest same_typefunc
julia> same_type(x::T, y::T) where {T} = true
same_type (generic function with 1 method)

julia> same_type(x,y) = false
same_type (generic function with 2 methods)
```

The first method applies whenever both arguments are of the same concrete type, regardless of
what type that is, while the second method acts as a catch-all, covering all other cases. Thus,
overall, this defines a boolean function that checks whether its two arguments are of the same
type:

```jldoctest same_typefunc
julia> same_type(1, 2)
true

julia> same_type(1, 2.0)
false

julia> same_type(1.0, 2.0)
true

julia> same_type("foo", 2.0)
false

julia> same_type("foo", "bar")
true

julia> same_type(Int32(1), Int64(2))
false
```

Such definitions correspond to methods whose type signatures are `UnionAll` types
(see [UnionAll Types](@ref)).

This kind of definition of function behavior by dispatch is quite common -- idiomatic, even --
in Julia. Method type parameters are not restricted to being used as the types of arguments:
they can be used anywhere a value would be in the signature of the function or body of the function.
Here's an example where the method type parameter `T` is used as the type parameter to the parametric
type `Vector{T}` in the method signature:

```jldoctest
julia> myappend(v::Vector{T}, x::T) where {T} = [v..., x]
myappend (generic function with 1 method)

julia> myappend([1,2,3],4)
4-element Array{Int64,1}:
 1
 2
 3
 4

julia> myappend([1,2,3],2.5)
ERROR: MethodError: no method matching myappend(::Array{Int64,1}, ::Float64)
Closest candidates are:
  myappend(::Array{T,1}, !Matched::T) where T at none:1

julia> myappend([1.0,2.0,3.0],4.0)
4-element Array{Float64,1}:
 1.0
 2.0
 3.0
 4.0

julia> myappend([1.0,2.0,3.0],4)
ERROR: MethodError: no method matching myappend(::Array{Float64,1}, ::Int64)
Closest candidates are:
  myappend(::Array{T,1}, !Matched::T) where T at none:1
```

As you can see, the type of the appended element must match the element type of the vector it
is appended to, or else a [`MethodError`](@ref) is raised. In the following example, the method type parameter
`T` is used as the return value:

```jldoctest
julia> mytypeof(x::T) where {T} = T
mytypeof (generic function with 1 method)

julia> mytypeof(1)
Int64

julia> mytypeof(1.0)
Float64
```

Just as you can put subtype constraints on type parameters in type declarations (see [Parametric Types](@ref)),
you can also constrain type parameters of methods:

```jldoctest
julia> same_type_numeric(x::T, y::T) where {T<:Number} = true
same_type_numeric (generic function with 1 method)

julia> same_type_numeric(x::Number, y::Number) = false
same_type_numeric (generic function with 2 methods)

julia> same_type_numeric(1, 2)
true

julia> same_type_numeric(1, 2.0)
false

julia> same_type_numeric(1.0, 2.0)
true

julia> same_type_numeric("foo", 2.0)
ERROR: MethodError: no method matching same_type_numeric(::String, ::Float64)
Closest candidates are:
  same_type_numeric(!Matched::T<:Number, ::T<:Number) where T<:Number at none:1
  same_type_numeric(!Matched::Number, ::Number) at none:1

julia> same_type_numeric("foo", "bar")
ERROR: MethodError: no method matching same_type_numeric(::String, ::String)

julia> same_type_numeric(Int32(1), Int64(2))
false
```

The `same_type_numeric` function behaves much like the `same_type` function defined above, but
is only defined for pairs of numbers.

Parametric methods allow the same syntax as `where` expressions used to write types
(see [UnionAll Types](@ref)).
If there is only a single parameter, the enclosing curly braces (in `where {T}`) can be omitted,
but are often preferred for clarity.
Multiple parameters can be separated with commas, e.g. `where {T, S<:Real}`, or written using
nested `where`, e.g. `where S<:Real where T`.

Redefining Methods
------------------

When redefining a method or adding new methods,
it is important to realize that these changes don't take effect immediately.
This is key to Julia's ability to statically infer and compile code to run fast,
without the usual JIT tricks and overhead.
Indeed, any new method definition won't be visible to the current runtime environment,
including Tasks and Threads (and any previously defined `@generated` functions).
Let's start with an example to see what this means:

```julia-repl
julia> function tryeval()
           @eval newfun() = 1
           newfun()
       end
tryeval (generic function with 1 method)

julia> tryeval()
ERROR: MethodError: no method matching newfun()
The applicable method may be too new: running in world age xxxx1, while current world is xxxx2.
Closest candidates are:
  newfun() at none:1 (method too new to be called from this world context.)
 in tryeval() at none:1
 ...

julia> newfun()
1
```

In this example, observe that the new definition for `newfun` has been created,
but can't be immediately called.
The new global is immediately visible to the `tryeval` function,
so you could write `return newfun` (without parentheses).
But neither you, nor any of your callers, nor the functions they call, or etc.
can call this new method definition!

But there's an exception: future calls to `newfun` *from the REPL* work as expected,
being able to both see and call the new definition of `newfun`.

However, future calls to `tryeval` will continue to see the definition of `newfun` as it was
*at the previous statement at the REPL*, and thus before that call to `tryeval`.

You may want to try this for yourself to see how it works.

The implementation of this behavior is a "world age counter".
This monotonically increasing value tracks each method definition operation.
This allows describing "the set of method definitions visible to a given runtime environment"
as a single number, or "world age".
It also allows comparing the methods available in two worlds just by comparing their ordinal value.
In the example above, we see that the "current world" (in which the method `newfun` exists),
is one greater than the task-local "runtime world" that was fixed when the execution of `tryeval` started.

Sometimes it is necessary to get around this (for example, if you are implementing the above REPL).
Fortunately, there is an easy solution: call the function using [`Base.invokelatest`](@ref):

```jldoctest
julia> function tryeval2()
           @eval newfun2() = 2
           Base.invokelatest(newfun2)
       end
tryeval2 (generic function with 1 method)

julia> tryeval2()
2
```

Finally, let's take a look at some more complex examples where this rule comes into play.
Define a function `f(x)`, which initially has one method:

```jldoctest redefinemethod
julia> f(x) = "original definition"
f (generic function with 1 method)
```

Start some other operations that use `f(x)`:

```jldoctest redefinemethod
julia> g(x) = f(x)
g (generic function with 1 method)

julia> t = @async f(wait()); yield();
```

Now we add some new methods to `f(x)`:

```jldoctest redefinemethod
julia> f(x::Int) = "definition for Int"
f (generic function with 2 methods)

julia> f(x::Type{Int}) = "definition for Type{Int}"
f (generic function with 3 methods)
```

Compare how these results differ:

```jldoctest redefinemethod
julia> f(1)
"definition for Int"

julia> g(1)
"definition for Int"

julia> fetch(schedule(t, 1))
"original definition"

julia> t = @async f(wait()); yield();

julia> fetch(schedule(t, 1))
"definition for Int"
```

## Design Patterns with Parametric Methods


While complex dispatch logic is not required for performance or usability,
sometimes it can be the best way to express some algorithm.
Here are a few common design patterns that come up sometimes when using dispatch in this way.

### Extracting the type parameter from a super-type


Here is the correct code template for returning the element-type `T`
of any arbitrary subtype of `AbstractArray`:

```julia
abstract type AbstractArray{T, N} end
eltype(::Type{<:AbstractArray{T}}) where {T} = T
```
using so-called triangular dispatch.  Note that if `T` is a `UnionAll`
type, as e.g. `eltype(Array{T} where T <: Integer)`, then `Any` is
returned (as does the the version of `eltype` in `Base`).

Another way, which used to be the only correct way before the advent of
triangular dispatch in Julia v0.6, is:

```julia
abstract type AbstractArray{T, N} end
eltype(::Type{AbstractArray}) = Any
eltype(::Type{AbstractArray{T}}) where {T} = T
eltype(::Type{AbstractArray{T, N}}) where {T, N} = T
eltype(::Type{A}) where {A<:AbstractArray} = eltype(supertype(A))
```

Another possibility is the following, which could useful to adapt
to cases where the parameter `T` would need to be matched more
narrowly:
```julia
eltype(::Type{AbstractArray{T, N} where {T<:S, N<:M}}) where {M, S} = Any
eltype(::Type{AbstractArray{T, N} where {T<:S}}) where {N, S} = Any
eltype(::Type{AbstractArray{T, N} where {N<:M}}) where {M, T} = T
eltype(::Type{AbstractArray{T, N}}) where {T, N} = T
eltype(::Type{A}) where {A <: AbstractArray} = eltype(supertype(A))
```


One common mistake is to try and get the element-type by using introspection:

```julia
eltype_wrong(::Type{A}) where {A<:AbstractArray} = A.parameters[1]
```

However, it is not hard to construct cases where this will fail:

```julia
struct BitVector <: AbstractArray{Bool, 1}; end
```

Here we have created a type `BitVector` which has no parameters,
but where the element-type is still fully specified, with `T` equal to `Bool`!


### Building a similar type with a different type parameter

When building generic code, there is often a need for constructing a similar
object with some change made to the layout of the type, also
necessitating a change of the type parameters.
For instance, you might have some sort of abstract array with an arbitrary element type
and want to write your computation on it with a specific element type.
We must implement a method for each `AbstractArray{T}` subtype that describes how to compute this type transform.
There is no general transform of one subtype into another subtype with a different parameter.
(Quick review: do you see why this is?)

The subtypes of `AbstractArray` typically implement two methods to
achieve this:
A method to convert the input array to a subtype of a specific `AbstractArray{T, N}` abstract type;
and a method to make a new uninitialized array with a specific element type.
Sample implementations of these can be found in Julia Base.
Here is a basic example usage of them, guaranteeing that `input` and
`output` are of the same type:

```julia
input = convert(AbstractArray{Eltype}, input)
output = similar(input, Eltype)
```

As an extension of this, in cases where the algorithm needs a copy of
the input array,
[`convert`](@ref) is insufficient as the return value may alias the original input.
Combining [`similar`](@ref) (to make the output array) and [`copyto!`](@ref) (to fill it with the input data)
is a generic way to express the requirement for a mutable copy of the input argument:

```julia
copy_with_eltype(input, Eltype) = copyto!(similar(input, Eltype), input)
```

### Iterated dispatch

In order to dispatch a multi-level parametric argument list,
often it is best to separate each level of dispatch into distinct functions.
This may sound similar in approach to single-dispatch, but as we shall see below, it is still more flexible.

For example, trying to dispatch on the element-type of an array will often run into ambiguous situations.
Instead, commonly code will dispatch first on the container type,
then recurse down to a more specific method based on eltype.
In most cases, the algorithms lend themselves conveniently to this hierarchical approach,
while in other cases, this rigor must be resolved manually.
This dispatching branching can be observed, for example, in the logic to sum two matrices:

```julia
# First dispatch selects the map algorithm for element-wise summation.
+(a::Matrix, b::Matrix) = map(+, a, b)
# Then dispatch handles each element and selects the appropriate
# common element type for the computation.
+(a, b) = +(promote(a, b)...)
# Once the elements have the same type, they can be added.
# For example, via primitive operations exposed by the processor.
+(a::Float64, b::Float64) = Core.add(a, b)
```

### Trait-based dispatch

A natural extension to the iterated dispatch above is to add a layer to
method selection that allows to dispatch on sets of types which are
independent from the sets defined by the type hierarchy.
We could construct such a set by writing out a `Union` of the types in question,
but then this set would not be extensible as `Union`-types cannot be
altered after creation.
However, such an extensible set can be programmed with a design pattern
often referred to as a
["Holy-trait"](https://github.com/JuliaLang/julia/issues/2345#issuecomment-54537633).

This pattern is implemented by defining a generic function which
computes a different singleton value (or type) for each trait-set to which the
function arguments may belong to.  If this function is pure there is
no impact on performance compared to normal dispatch.

The example in the previous section glossed over the implementation details of
[`map`](@ref) and [`promote`](@ref), which both operate in terms of these traits.
When iterating over a matrix, such as in the implementation of `map`,
one important question is what order to use to traverse the data.
When `AbstractArray` subtypes implement the [`Base.IndexStyle`](@ref) trait,
other functions such as `map` can dispatch on this information to pick
the best algorithm (see [Abstract Array Interface](@ref man-interface-array)).
This means that each subtype does not need to implement a custom version of `map`,
since the generic definitions + trait classes will enable the system to select the fastest version.
Here a toy implementation of `map` illustrating the trait-based dispatch:

```julia
map(f, a::AbstractArray, b::AbstractArray) = map(Base.IndexStyle(a, b), f, a, b)
# generic implementation:
map(::Base.IndexCartesian, f, a::AbstractArray, b::AbstractArray) = ...
# linear-indexing implementation (faster)
map(::Base.IndexLinear, f, a::AbstractArray, b::AbstractArray) = ...
```

This trait-based approach is also present in the [`promote`](@ref)
mechanism employed by the scalar `+`.
It uses [`promote_type`](@ref), which returns the optimal common type to
compute the operation given the two types of the operands.
This makes it possible to reduce the problem of implementing every function for every pair of possible type arguments,
to the much smaller problem of implementing a conversion operation from each type to a common type,
plus a table of preferred pair-wise promotion rules.


### Output-type computation

The discussion of trait-based promotion provides a transition into our next design pattern:
computing the output element type for a matrix operation.

For implementing primitive operations, such as addition,
we use the [`promote_type`](@ref) function to compute the desired output type.
(As before, we saw this at work in the `promote` call in the call to `+`).

For more complex functions on matrices, it may be necessary to compute the expected return
type for a more complex sequence of operations.
This is often performed by the following steps:

1. Write a small function `op` that expresses the set of operations performed by the kernel of the algorithm.
2. Compute the element type `R` of the result matrix as `promote_op(op, argument_types...)`,
   where `argument_types` is computed from `eltype` applied to each input array.
3. Build the output matrix as `similar(R, dims)`, where `dims` are the desired dimensions of the output array.

For a more specific example, a generic square-matrix multiply pseudo-code might look like:

```julia
function matmul(a::AbstractMatrix, b::AbstractMatrix)
    op = (ai, bi) -> ai * bi + ai * bi

    ## this is insufficient because it assumes `one(eltype(a))` is constructable:
    # R = typeof(op(one(eltype(a)), one(eltype(b))))

    ## this fails because it assumes `a[1]` exists and is representative of all elements of the array
    # R = typeof(op(a[1], b[1]))

    ## this is incorrect because it assumes that `+` calls `promote_type`
    ## but this is not true for some types, such as Bool:
    # R = promote_type(ai, bi)

    # this is wrong, since depending on the return value
    # of type-inference is very brittle (as well as not being optimizable):
    # R = Base.return_types(op, (eltype(a), eltype(b)))

    ## but, finally, this works:
    R = promote_op(op, eltype(a), eltype(b))
    ## although sometimes it may give a larger type than desired
    ## it will always give a correct type

    output = similar(b, R, (size(a, 1), size(b, 2)))
    if size(a, 2) > 0
        for j in 1:size(b, 2)
            for i in 1:size(b, 1)
                ## here we don't use `ab = zero(R)`,
                ## since `R` might be `Any` and `zero(Any)` is not defined
                ## we also must declare `ab::R` to make the type of `ab` constant in the loop,
                ## since it is possible that typeof(a * b) != typeof(a * b + a * b) == R
                ab::R = a[i, 1] * b[1, j]
                for k in 2:size(a, 2)
                    ab += a[i, k] * b[k, j]
                end
                output[i, j] = ab
            end
        end
    end
    return output
end
```

### Separate convert and kernel logic

One way to significantly cut down on compile-times and testing complexity is to isolate
the logic for converting to the desired type and the computation.
This lets the compiler specialize and inline the conversion logic independent
from the rest of the body of the larger kernel.

This is a common pattern seen when converting from a larger class of types
to the one specific argument type that is actually supported by the algorithm:

```julia
complexfunction(arg::Int) = ...
complexfunction(arg::Any) = complexfunction(convert(Int, arg))

matmul(a::T, b::T) = ...
matmul(a, b) = matmul(promote(a, b)...)
```

## Parametrically-constrained Varargs methods

Function parameters can also be used to constrain the number of arguments that may be supplied
to a "varargs" function ([Varargs Functions](@ref)).  The notation `Vararg{T,N}` is used to indicate
such a constraint.  For example:

```jldoctest
julia> bar(a,b,x::Vararg{Any,2}) = (a,b,x)
bar (generic function with 1 method)

julia> bar(1,2,3)
ERROR: MethodError: no method matching bar(::Int64, ::Int64, ::Int64)
Closest candidates are:
  bar(::Any, ::Any, ::Any, !Matched::Any) at none:1

julia> bar(1,2,3,4)
(1, 2, (3, 4))

julia> bar(1,2,3,4,5)
ERROR: MethodError: no method matching bar(::Int64, ::Int64, ::Int64, ::Int64, ::Int64)
Closest candidates are:
  bar(::Any, ::Any, ::Any, ::Any) at none:1
```

More usefully, it is possible to constrain varargs methods by a parameter. For example:

```julia
function getindex(A::AbstractArray{T,N}, indices::Vararg{Number,N}) where {T,N}
```

would be called only when the number of `indices` matches the dimensionality of the array.

When only the type of supplied arguments needs to be constrained `Vararg{T}` can be equivalently
written as `T...`. For instance `f(x::Int...) = x` is a shorthand for `f(x::Vararg{Int}) = x`.

## Note on Optional and keyword Arguments

As mentioned briefly in [Functions](@ref man-functions), optional arguments are implemented as syntax for multiple
method definitions. For example, this definition:

```julia
f(a=1,b=2) = a+2b
```

translates to the following three methods:

```julia
f(a,b) = a+2b
f(a) = f(a,2)
f() = f(1,2)
```

This means that calling `f()` is equivalent to calling `f(1,2)`. In this case the result is `5`,
because `f(1,2)` invokes the first method of `f` above. However, this need not always be the case.
If you define a fourth method that is more specialized for integers:

```julia
f(a::Int,b::Int) = a-2b
```

then the result of both `f()` and `f(1,2)` is `-3`. In other words, optional arguments are tied
to a function, not to any specific method of that function. It depends on the types of the optional
arguments which method is invoked. When optional arguments are defined in terms of a global variable,
the type of the optional argument may even change at run-time.

Keyword arguments behave quite differently from ordinary positional arguments. In particular,
they do not participate in method dispatch. Methods are dispatched based only on positional arguments,
with keyword arguments processed after the matching method is identified.

## Function-like objects

Methods are associated with types, so it is possible to make any arbitrary Julia object "callable"
by adding methods to its type. (Such "callable" objects are sometimes called "functors.")

For example, you can define a type that stores the coefficients of a polynomial, but behaves like
a function evaluating the polynomial:

```jldoctest polynomial
julia> struct Polynomial{R}
           coeffs::Vector{R}
       end

julia> function (p::Polynomial)(x)
           v = p.coeffs[end]
           for i = (length(p.coeffs)-1):-1:1
               v = v*x + p.coeffs[i]
           end
           return v
       end

julia> (p::Polynomial)() = p(5)
```

Notice that the function is specified by type instead of by name. As with normal functions
there is a terse syntax form. In the function body, `p` will refer to the object that was
called. A `Polynomial` can be used as follows:

```jldoctest polynomial
julia> p = Polynomial([1,10,100])
Polynomial{Int64}([1, 10, 100])

julia> p(3)
931

julia> p()
2551
```

This mechanism is also the key to how type constructors and closures (inner functions that refer
to their surrounding environment) work in Julia.

## Empty generic functions

Occasionally it is useful to introduce a generic function without yet adding methods. This can
be used to separate interface definitions from implementations. It might also be done for the
purpose of documentation or code readability. The syntax for this is an empty `function` block
without a tuple of arguments:

```julia
function emptyfunc
end
```

## [Method design and the avoidance of ambiguities](@id man-method-design-ambiguities)

Julia's method polymorphism is one of its most powerful features, yet
exploiting this power can pose design challenges.  In particular, in
more complex method hierarchies it is not uncommon for
[ambiguities](@ref man-ambiguities) to arise.

Above, it was pointed out that one can resolve ambiguities like

```julia
f(x, y::Int) = 1
f(x::Int, y) = 2
```

by defining a method

```julia
f(x::Int, y::Int) = 3
```

This is often the right strategy; however, there are circumstances
where following this advice blindly can be counterproductive. In
particular, the more methods a generic function has, the more
possibilities there are for ambiguities. When your method hierarchies
get more complicated than this simple example, it can be worth your
while to think carefully about alternative strategies.

Below we discuss particular challenges and some alternative ways to resolve such issues.

### Tuple and NTuple arguments

`Tuple` (and `NTuple`) arguments present special challenges. For example,

```julia
f(x::NTuple{N,Int}) where {N} = 1
f(x::NTuple{N,Float64}) where {N} = 2
```

are ambiguous because of the possibility that `N == 0`: there are no
elements to determine whether the `Int` or `Float64` variant should be
called. To resolve the ambiguity, one approach is define a method for
the empty tuple:

```julia
f(x::Tuple{}) = 3
```

Alternatively, for all methods but one you can insist that there is at
least one element in the tuple:

```julia
f(x::NTuple{N,Int}) where {N} = 1           # this is the fallback
f(x::Tuple{Float64, Vararg{Float64}}) = 2   # this requires at least one Float64
```

### [Orthogonalize your design](@id man-methods-orthogonalize)

When you might be tempted to dispatch on two or more arguments,
consider whether a "wrapper" function might make for a simpler
design. For example, instead of writing multiple variants:

```julia
f(x::A, y::A) = ...
f(x::A, y::B) = ...
f(x::B, y::A) = ...
f(x::B, y::B) = ...
```

you might consider defining

```julia
f(x::A, y::A) = ...
f(x, y) = f(g(x), g(y))
```

where `g` converts the argument to type `A`. This is a very specific
example of the more general principle of
[orthogonal design](https://en.wikipedia.org/wiki/Orthogonality_(programming)),
in which separate concepts are assigned to separate methods. Here, `g`
will most likely need a fallback definition

```julia
g(x::A) = x
```

A related strategy exploits `promote` to bring `x` and `y` to a common
type:

```julia
f(x::T, y::T) where {T} = ...
f(x, y) = f(promote(x, y)...)
```

One risk with this design is the possibility that if there is no
suitable promotion method converting `x` and `y` to the same type, the
second method will recurse on itself infinitely and trigger a stack
overflow. The non-exported function `Base.promote_noncircular` can be
used as an alternative; when promotion fails it will still throw an
error, but one that fails faster with a more specific error message.

### Dispatch on one argument at a time

If you need to dispatch on multiple arguments, and there are many
fallbacks with too many combinations to make it practical to define
all possible variants, then consider introducing a "name cascade"
where (for example) you dispatch on the first argument and then call
an internal method:

```julia
f(x::A, y) = _fA(x, y)
f(x::B, y) = _fB(x, y)
```

Then the internal methods `_fA` and `_fB` can dispatch on `y` without
concern about ambiguities with each other with respect to `x`.

Be aware that this strategy has at least one major disadvantage: in
many cases, it is not possible for users to further customize the
behavior of `f` by defining further specializations of your exported
function `f`. Instead, they have to define specializations for your
internal methods `_fA` and `_fB`, and this blurs the lines between
exported and internal methods.

### Abstract containers and element types

Where possible, try to avoid defining methods that dispatch on
specific element types of abstract containers. For example,

```julia
-(A::AbstractArray{T}, b::Date) where {T<:Date}
```

generates ambiguities for anyone who defines a method

```julia
-(A::MyArrayType{T}, b::T) where {T}
```

The best approach is to avoid defining *either* of these methods:
instead, rely on a generic method `-(A::AbstractArray, b)` and make
sure this method is implemented with generic calls (like `similar` and
`-`) that do the right thing for each container type and element type
*separately*. This is just a more complex variant of the advice to
[orthogonalize](@ref man-methods-orthogonalize) your methods.

When this approach is not possible, it may be worth starting a
discussion with other developers about resolving the ambiguity; just
because one method was defined first does not necessarily mean that it
can't be modified or eliminated.  As a last resort, one developer can
define the "band-aid" method

```julia
-(A::MyArrayType{T}, b::Date) where {T<:Date} = ...
```

that resolves the ambiguity by brute force.

### Complex method "cascades" with default arguments

If you are defining a method "cascade" that supplies defaults, be
careful about dropping any arguments that correspond to potential
defaults. For example, suppose you're writing a digital filtering
algorithm and you have a method that handles the edges of the signal
by applying padding:

```julia
function myfilter(A, kernel, ::Replicate)
    Apadded = replicate_edges(A, size(kernel))
    myfilter(Apadded, kernel)  # now perform the "real" computation
end
```

This will run afoul of a method that supplies default padding:

```julia
myfilter(A, kernel) = myfilter(A, kernel, Replicate()) # replicate the edge by default
```

Together, these two methods generate an infinite recursion with `A` constantly growing bigger.

The better design would be to define your call hierarchy like this:

```julia
struct NoPad end  # indicate that no padding is desired, or that it's already applied

myfilter(A, kernel) = myfilter(A, kernel, Replicate())  # default boundary conditions

function myfilter(A, kernel, ::Replicate)
    Apadded = replicate_edges(A, size(kernel))
    myfilter(Apadded, kernel, NoPad())  # indicate the new boundary conditions
end

# other padding methods go here

function myfilter(A, kernel, ::NoPad)
    # Here's the "real" implementation of the core computation
end
```

`NoPad` is supplied in the same argument position as any other kind of
padding, so it keeps the dispatch hierarchy well organized and with
reduced likelihood of ambiguities. Moreover, it extends the "public"
`myfilter` interface: a user who wants to control the padding
explicitly can call the `NoPad` variant directly.

[^Clarke61]: Arthur C. Clarke, *Profiles of the Future* (1961): Clarke's Third Law.
