# 元编程

Lisp 留给 Julia 最大的遗产就是它的元编程支持。和 Lisp 一样，Julia 把自己的代码表示为语言中的数据结构。既然代码被表示为了可以在语言中创建和操作的对象，程序就可以变换和生成自己的代码。这允许在没有额外构建步骤的情况下生成复杂的代码，并且还允许在 [abstract syntax trees](https://en.wikipedia.org/wiki/Abstract_syntax_tree) 级别上运行的真正的 Lisp 风格的宏。与之相对的是预处理器“宏”系统，比如 C 和 C++ 中的，它们在解析和解释代码之前进行文本操作和变换。由于 Julia 中的所有数据类型和代码都被表示为 Julia 的 数据结构，强大的 [reflection](https://en.wikipedia.org/wiki/Reflection_omputer_%28cprogramming%29)
功能可用于探索程序的内部及其类型，就像任何其他数据一样。

## 程序表示

每个 Julia 程序均以字符串开始：

```jldoctest prog
julia> prog = "1 + 1"
"1 + 1"
```

**What happens next?**

The next step is to [parse](https://en.wikipedia.org/wiki/Parsing#Computer_languages) each string
into an object called an expression, represented by the Julia type [`Expr`](@ref):

```jldoctest prog
julia> ex1 = Meta.parse(prog)
:(1 + 1)

julia> typeof(ex1)
Expr
```

`Expr` 对象包含两个部分：

  * 一个标识表达式类型的 [`Symbol`](@ref)。
Symbol 就是一个 [interned string](https://en.wikipedia.org/wiki/String_interning)
    标识符（下面会有更多讨论）

```jldoctest prog
julia> ex1.head
:call
```

  * 表达式的参数，可能是符号、其他表达式或字面值：

```jldoctest prog
julia> ex1.args
3-element Array{Any,1}:
  :+
 1
 1
```

表达式也可能直接用 [prefix notation](https://en.wikipedia.org/wiki/Polish_notation) 构造：

```jldoctest prog
julia> ex2 = Expr(:call, :+, 1, 1)
:(1 + 1)
```

上面构造的两个表达式 – 一个通过解析构造一个通过直接构造 – 是等价的：

```jldoctest prog
julia> ex1 == ex2
true
```

**这里的关键点是 Julia 的代码在内部表示为可以从语言本身访问的数据结构**

函数 [`dump`](@ref) 可以带有缩进和注释地显示 `Expr` 对象：

```jldoctest prog
julia> dump(ex2)
Expr
  head: Symbol call
  args: Array{Any}((3,))
    1: Symbol +
    2: Int64 1
    3: Int64 1
```

`Expr` 对象也可以嵌套：

```jldoctest ex3
julia> ex3 = Meta.parse("(4 + 4) / 2")
:((4 + 4) / 2)
```

另外一个查看表达式的方法是使用 `Meta.show_sexpr`，它能显示给定 `Expr` 的 [S-expression](https://en.wikipedia.org/wiki/S-expression)，对 Lisp 用户来说，这看着很熟悉。下面是一个示例，阐释了如何显示嵌套的 `Expr`：

```jldoctest ex3
julia> Meta.show_sexpr(ex3)
(:call, :/, (:call, :+, 4, 4), 2)
```

### 符号

字符 `:` 在 Julia 中有两个作用。第一种形式构造一个  [`Symbol`](@ref)，这是作为表达式组成部分的一个 [interned string](https://en.wikipedia.org/wiki/String_interning)：

```jldoctest
julia> :foo
:foo

julia> typeof(ans)
Symbol
```

构造函数 [`Symbol`](@ref) 接受任意数量的参数并通过把它们的字符串表示连在一起创建一个新的符号：

```jldoctest
julia> :foo == Symbol("foo")
true

julia> Symbol("func",10)
:func10

julia> Symbol(:var,'_',"sym")
:var_sym
```

注意，要使用 `:` 语法，符号的名称必须是有效的标识符。否则，必须使用 `Symbol(str)` 构造函数。

在表达式的上下文中，符号用来表示对变量的访问；当一个表达式被求值时，符号会被替换为这个符号在合适的 [scope](@ref scope-of-variables) 中所绑定的值。

有时需要在 `:` 的参数两边加上额外的括号，以避免在解析时出现歧义：

```jldoctest
julia> :(:)
:(:)

julia> :(::)
:(::)
```

## 表达式与求值

### 引用

`:` 的第二个语义是不显式调用 [`Expr`](@ref) 构造器来创建表达式对象。这被称为**引用**。`:` 后面跟着包围着单个 Julia 语句括号，可以基于被包围的代码生成一个 `Expr` 对象。下面是一个引用算数表达式的例子：

```jldoctest
julia> ex = :(a+b*c+1)
:(a + b * c + 1)

julia> typeof(ex)
Expr
```

（为了查看这个表达式的结构，可以试一试 `ex.head` 和 `ex.args`，或者使用 [`dump`](@ref) 同时查看 `ex.head` 和 `ex.args` 或者 [`Meta.@dump`](@ref)）

注意等价的表达式也可以使用 [`Meta.parse`](@ref) 或者直接用 `Expr` 构造：

```jldoctest
julia>      :(a + b*c + 1)       ==
       Meta.parse("a + b*c + 1") ==
       Expr(:call, :+, :a, Expr(:call, :*, :b, :c), 1)
true
```

解析器提供的表达式通常只有符号、其它表达式和字面量值作为其参数，而由 Julia 代码构造的表达式能以非字面量形式的任意运行期值作为其参数。在此特例中，`+` 和 `a` 都是符号，`*(b,c)` 是子表达式，而 `1` 是 64 位带符号整数字面量。

引用多个表达式有第二种语法形式：在 `quote ... end` 中包含代码块。

```jldoctest
julia> ex = quote
           x = 1
           y = 2
           x + y
       end
quote
    #= none:2 =#
    x = 1
    #= none:3 =#
    y = 2
    #= none:4 =#
    x + y
end

julia> typeof(ex)
Expr
```

### [插值](@id man-expression-interpolation)

使用值参数直接构造 [`Expr`](@ref) 对象虽然很强大，但与「通常的」 Julia 语法相比，`Expr` 构造函数可能让人觉得乏味。作为替代方法，Julia 允许将字面量或表达式插入到被引用的表达式中。表达式插值由前缀 `$` 表示。

在此示例中，插入了变量 `a` 的值：

```jldoctest interp1
julia> a = 1;

julia> ex = :($a + b)
:(1 + b)
```

对未被引用的表达式进行插值是不支持的，这会导致编译期错误：

```jldoctest interp1
julia> $a + b
ERROR: syntax: "$" expression outside quote
```

在此示例中，元组 `(1,2,3)` 作为表达式插入到条件测试中：

```jldoctest interp1
julia> ex = :(a in $:((1,2,3)) )
:(a in (1, 2, 3))
```

在表达式插值中使用 `$` 是有意让人联想到[字符串插值](@ref string-interpolation)和[命令插值](@ref command-interpolation)。表达式插值使得复杂 Julia 表达式的程序化构造变得方便和易读。

### Splatting 插值

请注意，`$` 插值语法只允许插入单个表达式到包含它的表达式中。有时，你手头有个由表达式组成的数组，需要它们都变成其所处表达式的参数，而这可通过 `$(xs...)` 语法做到。例如，下面的代码生成了一个函数调用，其参数数量通过编程确定：

```jldoctest interp1
julia> args = [:x, :y, :z];

julia> :(f(1, $(args...)))
:(f(1, x, y, z))
```

### 嵌套引用

自然地，引用表达式可以包含在其它引用表达式中。插值在这些情形中的工作方式可能会有点难以理解。考虑这个例子：

```jldoctest interp1
julia> x = :(1 + 2);

julia> e = quote quote $x end end
quote
    #= none:1 =#
    $(Expr(:quote, quote
    #= none:1 =#
    $(Expr(:$, :x))
end))
end
```

Notice that the result contains `$x`, which means that `x` has not been
evaluated yet.
In other words, the `$` expression "belongs to" the inner quote expression, and
so its argument is only evaluated when the inner quote expression is:

```jldoctest interp1
julia> eval(e)
quote
    #= none:1 =#
    1 + 2
end
```

但是，外部 `quote` 表达式可以把值插入到内部引用表达式的 `$` 中去。这通过多个 `$` 实现：

```jldoctest interp1
julia> e = quote quote $$x end end
quote
    #= none:1 =#
    $(Expr(:quote, quote
    #= none:1 =#
    $(Expr(:$, :(1 + 2)))
end))
end
```

Notice that `(1 + 2)` now appears in the result instead of the symbol `x`.
Evaluating this expression yields an interpolated `3`:

```jldoctest interp1
julia> eval(e)
quote
    #= none:1 =#
    3
end
```

这种行为背后的直觉是每个 `$` 都将 `x` 求值一遍：一个 `$` 工作方式类似于 `eval(:x)`，其返回 `x` 的值，而两个 `$` 行为相当于 `eval(eval(:x))`。

### [QuoteNode](@id man-quote-node)

`quote` 形式在 AST 中通常表示为一个 head 为 `:quote` 的 [`Expr`](@ref) ：

```jldoctest interp1
julia> dump(Meta.parse(":(1+2)"))
Expr
  head: Symbol quote
  args: Array{Any}((1,))
    1: Expr
      head: Symbol call
      args: Array{Any}((3,))
        1: Symbol +
        2: Int64 1
        3: Int64 2
```

As we have seen, such expressions support interpolation with `$`.
However, in some situations it is necessary to quote code *without* performing interpolation.
This kind of quoting does not yet have syntax, but is represented internally
as an object of type `QuoteNode`:
```jldoctest interp1
julia> eval(Meta.quot(Expr(:$, :(1+2))))
3

julia> eval(QuoteNode(Expr(:$, :(1+2))))
:($(Expr(:$, :(1 + 2))))
```
The parser yields `QuoteNode`s for simple quoted items like symbols:
```jldoctest interp1
julia> dump(Meta.parse(":x"))
QuoteNode
  value: Symbol x
```

`QuoteNode` can also be used for certain advanced metaprogramming tasks.

### Evaluating expressions

Given an expression object, one can cause Julia to evaluate (execute) it at global scope using
[`eval`](@ref):

```jldoctest interp1
julia> :(1 + 2)
:(1 + 2)

julia> eval(ans)
3

julia> ex = :(a + b)
:(a + b)

julia> eval(ex)
ERROR: UndefVarError: b not defined
[...]

julia> a = 1; b = 2;

julia> eval(ex)
3
```

每个[模块](@ref modules)有自己的 [`eval`](@ref) 函数，该函数在其全局作用域内对表达式求值。传给 [`eval`](@ref) 的表达式不止可以返回值——它们还能具有改变封闭模块的环境状态的副作用：

```jldoctest
julia> ex = :(x = 1)
:(x = 1)

julia> x
ERROR: UndefVarError: x not defined

julia> eval(ex)
1

julia> x
1
```

这里，表达式对象的求值导致一个值被赋值给全局变量 `x`。

由于表达式只是 `Expr` 对象，而其可以通过编程方式构造然后对它求值，因此可以动态地生成任意代码，然后使用 [`eval`](@ref) 运行所生成的代码。这是个简单的例子：

```julia-repl
julia> a = 1;

julia> ex = Expr(:call, :+, a, :b)
:(1 + b)

julia> a = 0; b = 2;

julia> eval(ex)
3
```

`a` 的值被用于构造表达式 `ex`，该表达式将函数 `+` 作用于值 1 和变量 `b`。请注意 `a` 和 `b` 使用方式间的重要区别：

  * *变量* `a` 在表达式构造时的值在表达式中用作立即值。因此，在对表达式求值时，`a` 的值就无关紧要了：表达式中的值已经是 `1`，与 `a` 的值无关。
      
      
  * 另一方面，因为在表达式构造时用的是符号 `:b`，所以变量 `b` 的值无关紧要——`:b` 只是一个符号，变量 `b` 甚至无需被定义。然而，在表达式求值时，符号 `:b` 的值通过寻找变量 `b` 的值来解析。
      
     
     

### 关于表达式的函数

如上所述，Julia 能在其内部生成和操作 Julia 代码，这是个非常有用的功能。我们已经见过返回 [`Expr`](@ref) 对象的函数例子：[`parse`](@ref) 函数，它接受字符串形式的 Julia 代码并返回相应的 `Expr`。函数也可以接受一个或多个 `Expr` 对象作为参数，并返回另一个 `Expr`。这是个简单、提神的例子：

```jldoctest
julia> function math_expr(op, op1, op2)
           expr = Expr(:call, op, op1, op2)
           return expr
       end
math_expr (generic function with 1 method)

julia>  ex = math_expr(:+, 1, Expr(:call, :*, 4, 5))
:(1 + 4 * 5)

julia> eval(ex)
21
```

作为另一个例子，这个函数将数值参数加倍，但不处理表达式：

```jldoctest
julia> function make_expr2(op, opr1, opr2)
           opr1f, opr2f = map(x -> isa(x, Number) ? 2*x : x, (opr1, opr2))
           retexpr = Expr(:call, op, opr1f, opr2f)
           return retexpr
       end
make_expr2 (generic function with 1 method)

julia> make_expr2(:+, 1, 2)
:(2 + 4)

julia> ex = make_expr2(:+, 1, Expr(:call, :*, 5, 8))
:(2 + 5 * 8)

julia> eval(ex)
42
```

## [宏](@id man-macros)

宏提供了在程序的最终主体中包含所生成的代码的方法。宏将参数元组映射到所返回的*表达式*，且生成的表达式会被直接编译，并不需要运行时的 [`eval`](@ref) 调用。宏的参数可以包括表达式、字面量值和符号。

### 基础

这是一个非常简单的宏：

```jldoctest sayhello
julia> macro sayhello()
           return :( println("Hello, world!") )
       end
@sayhello (macro with 1 method)
```
宏在Julia的语法中有一个专门的字符 `@` (at-sign)，紧接着是其使用`macro NAME ... end` 形式来声明的唯一的宏名。在这个例子中，编译器会把所有的`@sayhello` 替换成：

```julia
:( println("Hello, world!") )
```

当 `@sayhello` 在REPL中被输入时，解释器立即执行，因此我们只会看到计算后的结果：

```jldoctest sayhello
julia> @sayhello()
Hello, world!
```

现在，考虑一个稍微复杂一点的宏：

```jldoctest sayhello2
julia> macro sayhello(name)
 return :( println("Hello, ", $name) )
 end
@sayhello (macro with 1 method)
```

这个宏接受一个参数`name`。当遇到`@sayhello`时，quoted 表达式会被*展开*并将参数中的值插入到最终的表达式中：

```jldoctest sayhello2
julia> @sayhello("human")
Hello, human
```

We can view the quoted return expression using the function [`macroexpand`](@ref) (**important note:**
this is an extremely useful tool for debugging macros):

```julia-repl sayhello2
julia> ex = macroexpand(Main, :(@sayhello("human")) )
:(Main.println("Hello, ", "human"))

julia> typeof(ex)
Expr
```

我们可以看到 `"human"` 字面量已被插入到表达式中了。

还有一个宏 [`@ macroexpand`](@ ref)，它可能比 `macroexpand` 函数更方便：


```jldoctest sayhello2
julia> @macroexpand @sayhello "human"
:(println("Hello, ", "human"))
```

### Hold up: why macros?

We have already seen a function `f(::Expr...) -> Expr` in a previous section. In fact, [`macroexpand`](@ref)
is also such a function. So, why do macros exist?

Macros are necessary because they execute when code is parsed, therefore, macros allow the programmer
to generate and include fragments of customized code *before* the full program is run. To illustrate
the difference, consider the following example:

```julia-repl whymacros
julia> macro twostep(arg)
           println("I execute at parse time. The argument is: ", arg)
           return :(println("I execute at runtime. The argument is: ", $arg))
       end
@twostep (macro with 1 method)

julia> ex = macroexpand(Main, :(@twostep :(1, 2, 3)) );
I execute at parse time. The argument is: :((1, 2, 3))
```

第一个 [`println`](@ref) 调用在调用 [`macroexpand`](@ref) 时执行。生成的表达式*只*包含第二个 `println`：

```julia-repl whymacros
julia> typeof(ex)
Expr

julia> ex
:(println("I execute at runtime. The argument is: ", $(Expr(:copyast, :($(QuoteNode(:((1, 2, 3)))))))))

julia> eval(ex)
I execute at runtime. The argument is: (1, 2, 3)
```

### 宏的调用

宏的通常调用语法如下：

```julia
@name expr1 expr2 ...
@name(expr1, expr2, ...)
```

请注意，在宏名称前的标志 `@`，且在第一种形式中参数表达式间没有逗号，而在第二种形式中 `@name` 后没有空格。这两种风格不应混淆。例如，下列语法不同于上述例子；它把元组 `(expr1, expr2, ...)` 作为参数传给宏：

```julia
@name (expr1, expr2, ...)
```

在数组字面量（或推导式）上调用宏的另一种方法是不使用括号直接并列两者。在这种情况下，数组将是唯一的传给宏的表达式。以下语法等价（且与 `@name [a b] * v` 不同）：

```julia
@name[a b] * v
@name([a b]) * v
```

在这着重强调，宏把它们的参数作为表达式、字面量或符号接收。浏览宏参数的一种方法是在宏的内部调用 [`show`](@ref) 函数：

```jldoctest
julia> macro showarg(x)
           show(x)
           # ... remainder of macro, returning an expression
       end
@showarg (macro with 1 method)

julia> @showarg(a)
:a

julia> @showarg(1+1)
:(1 + 1)

julia> @showarg(println("Yo!"))
:(println("Yo!"))
```

除了给定的参数列表，每个宏都会传递名为 `__source__` 和 `__module__` 的额外参数。

参数 `__source__` 提供 `@` 符号在宏调用处的解析器位置的相关信息（以 `LineNumberNode` 对象的形式）。这使得宏能包含更好的错误诊断信息，其通常用于日志记录、字符串解析器宏和文档，比如，用于实现 [`@__LINE__`](@ref)、[`@__FILE__`](@ref) 和 [`@__DIR__`](@ref) 宏。

引用 `__source__.line` 和 `__source__.file` 即可访问位置信息：

```jldoctest
julia> macro __LOCATION__(); return QuoteNode(__source__); end
@__LOCATION__ (macro with 1 method)

julia> dump(
            @__LOCATION__(
       ))
LineNumberNode
  line: Int64 2
  file: Symbol none
```

参数 `__module__` 提供宏调用展开处的上下文相关信息（以 `Module` 对象的形式）。这允许宏查找上下文相关的信息，比如现有的绑定，或者将值作为附加参数插入到一个在当前模块中进行自我反射的运行时函数调用中。


### 构建高级的宏

这是 Julia 的 [`@assert`](@ref) 宏的简化定义：

```jldoctest building
julia> macro assert(ex)
           return :( $ex ? nothing : throw(AssertionError($(string(ex)))) )
       end
@assert (macro with 1 method)
```

这个宏可以像这样使用：

```jldoctest building
julia> @assert 1 == 1.0

julia> @assert 1 == 0
ERROR: AssertionError: 1 == 0
```

宏调用在解析时扩展为其返回结果，并替代已编写的语法。这相当于编写：

```julia
1 == 1.0 ? nothing : throw(AssertionError("1 == 1.0"))
1 == 0 ? nothing : throw(AssertionError("1 == 0"))
```

也就是说，在第一个调用中，表达式 `:(1 == 1.0)` 拼接到测试条件槽中，而 `string(:(1 == 1.0))` 拼接到断言信息槽中。如此构造的表达式会被放置在发生 `@assert` 宏调用处的语法树。然后在执行时，如果测试表达式的计算结果为真，则返回 [`nothing`](@ref)，但如果测试结果为假，则会引发错误，表明声明的表达式为假。请注意，将其编写为函数是不可能的，因为能获取的只有条件的*值*而无法在错误信息中显示计算出它的表达式。

在 Julia Base 中，`@assert` 的实际定义更复杂。它允许用户可选地制定自己的错误信息，而不仅仅是打印断言失败的表达式。与函数一样，具有可变数量的参数（ [变参函数](@ref)）可在最后一个参数后面用省略号指定：

```jldoctest assert2
julia> macro assert(ex, msgs...)
           msg_body = isempty(msgs) ? ex : msgs[1]
           msg = string(msg_body)
           return :($ex ? nothing : throw(AssertionError($msg)))
       end
@assert (macro with 1 method)
```

Now `@assert` has two modes of operation, depending upon the number of arguments it receives!
If there's only one argument, the tuple of expressions captured by `msgs` will be empty and it
will behave the same as the simpler definition above. But now if the user specifies a second argument,
it is printed in the message body instead of the failing expression. You can inspect the result
of a macro expansion with the aptly named [`@macroexpand`](@ref) macro:

```julia-repl assert2
julia> @macroexpand @assert a == b
:(if Main.a == Main.b
        Main.nothing
    else
        Main.throw(Main.AssertionError("a == b"))
    end)

julia> @macroexpand @assert a==b "a should equal b!"
:(if Main.a == Main.b
        Main.nothing
    else
        Main.throw(Main.AssertionError("a should equal b!"))
    end)
```

实际的 `@assert` 宏还处理了另一种情形：我们如果除了打印「a should equal b」外还想打印它们的值？有人也许会天真地尝试在自定义消息中使用字符串插值，例如，`@assert a==b "a ($a) should equal b ($b)!"`，但这不会像上面的宏一样按预期工作。你能想到为什么吗？回想一下[字符串插值](@ref string-interpolation)，内插字符串会被重写为 [`string`](@ref) 的调用。比较：

```jldoctest
julia> typeof(:("a should equal b"))
String

julia> typeof(:("a ($a) should equal b ($b)!"))
Expr

julia> dump(:("a ($a) should equal b ($b)!"))
Expr
  head: Symbol string
  args: Array{Any}((5,))
    1: String "a ("
    2: Symbol a
    3: String ") should equal b ("
    4: Symbol b
    5: String ")!"
```

所以，现在宏在 `msg_body` 中获得的不是单纯的字符串，其接收了一个完整的表达式，该表达式需进行求值才能按预期显示。这可作为 [`string`](@ref) 调用的参数直接拼接到返回的表达式中；有关完整实现，请参阅 [`error.jl`](https://github.com/JuliaLang/julia/blob/master/base/error.jl)。

`@assert` 宏充分利用拼接被引用的表达式，以便简化对宏内部表达式的操作。

### 卫生宏

在更复杂的宏中会出现关于[卫生宏](https://en.wikipedia.org/wiki/Hygienic_macro) 的问题。简而言之，宏必须确保在其返回表达式中引入的变量不会意外地与其展开处周围代码中的现有变量相冲突。相反，作为参数传递给宏的表达式通常被*认为*在其周围代码的上下文中进行求值，与现有变量交互并修改之。另一个问题源于这样的事实：宏可以在不同于其定义所处模块的模块中调用。在这种情况下，我们需要确保所有全局变量都被解析到正确的模块中。Julia 比使用文本宏展开的语言（比如 C）具有更大的优势，因为它只需要考虑返回的表达式。所有其它变量（例如上面`@assert` 中的 `msg`）遵循[通常的作用域块规则](@ref scope-of-variables)。

为了演示这些问题，让我们来编写宏 `@time`，其以表达式为参数，记录当前时间，对表达式求值，再次记录当前时间，打印前后的时间差，然后以表达式的值作为其最终值。该宏可能看起来就像这样：

```julia
macro time(ex)
    return quote
        local t0 = time_ns()
        local val = $ex
        local t1 = time_ns()
        println("elapsed time: ", (t1-t0)/1e9, " seconds")
        val
    end
end
```

在这里，我们希望 `t0`、`t1` 和 `val` 是私有的临时变量且 `time` 引用在 Julia Base 中的 [`time`](@ref) 函数，而不是用户也许具有的任何 `time` 变量（对于 `println` 也是一样）。想象一下，如果用户表达式 `ex` 中也包含对名为 `t0` 的变量的赋值、或者定义了自己的 `time` 变量，则可能会出现问题，我们可能会得到错误或者诡异且不正确的行为。

Julia 的宏展开器以下列方式解决这些问题。首先，宏返回结果中的变量被分为局部变量或全局变量。如果一个变量被赋值（且未声明为全局变量）、声明为局部变量或者用作函数参数名称，则将其视为局部变量。否则，则认为它是全局变量。接着，局部变量重命名为唯一名称（通过生成新符号的 [`gensym`](@ref) 函数），并在宏定义所处环境中解析全局变量。因此，上述两个问题都被解决了；宏的局部变量不会与任何用户变量相冲突，`time` 和 `println` 也将引用其在 Julia Base 中的定义。

然而，仍有另外的问题。考虑此宏的以下用法：

```julia
module MyModule
import Base.@time

time() = ... # compute something

@time time()
end
```

在这里，用户表达式 `ex` 是对 `time` 的调用，但不是宏所使用的 `time` 函数。它明确地引用 `MyModule.time`。因此，我们必须将 `ex` 中的代码安排在宏调用所处环境中解析。这通过用 [`esc`](@ref)「转义」表达式来完成：

```julia
macro time(ex)
    ...
    local val = $(esc(ex))
    ...
end
```

以这种方式封装的表达式会被宏展开器单独保留，并将其简单地逐字粘贴到输出中。因此，它将在宏调用所处环境中解析。

这种转义机制可以在必要时用于「违反」卫生，以便于引入或操作用户变量。例如，以下宏在其调用所处环境中将 `x` 设置为零：

```jldoctest
julia> macro zerox()
           return esc(:(x = 0))
       end
@zerox (macro with 1 method)

julia> function foo()
           x = 1
           @zerox
           return x # is zero
       end
foo (generic function with 1 method)

julia> foo()
0
```

应当明智地使用这种变量操作，但它偶尔会很方便。

获得正确的规则也许是个艰巨的挑战。在使用宏之前，你可以去考虑是否函数闭包便已足够。另一个有用的策略是将尽可能多的工作推迟到运行时。例如，许多宏只是将其参数封装为 `QuoteNode` 或类似的 [`Expr`](@ref)。这方面的例子有 `@task body`，它只返回 `schedule(Task(() -> $body))`， 和 `@eval expr`，它只返回 `eval(QuoteNode(expr))`。

为了演示，我们可以将上面的 `@time` 示例重新编写成：

```julia
macro time(expr)
    return :(timeit(() -> $(esc(expr))))
end
function timeit(f)
    t0 = time_ns()
    val = f()
    t1 = time_ns()
    println("elapsed time: ", (t1-t0)/1e9, " seconds")
    return val
end
```

但是，我们不这样做也是有充分理由的：将 `expr` 封装在新的作用域块（该匿名函数）中也会稍微改变该表达式的含义（其中任何变量的作用域），而我们想要 `@time` 使用时对其封装的代码影响最小。

### 宏与派发

与 Julia 函数一样，宏也是泛型的。由于多重派发，这意味着宏也能有多个方法定义：
```jldoctest macromethods
julia> macro m end
@m (macro with 0 methods)

julia> macro m(args...)
           println("$(length(args)) arguments")
       end
@m (macro with 1 method)

julia> macro m(x,y)
           println("Two arguments")
       end
@m (macro with 2 methods)

julia> @m "asd"
1 arguments

julia> @m 1 2
Two arguments
```
但是应该记住，宏派发基于传递给宏的 AST 的类型，而不是 AST 在运行时进行求值的类型：
```jldoctest macromethods
julia> macro m(::Int)
           println("An Integer")
       end
@m (macro with 3 methods)

julia> @m 2
An Integer

julia> x = 2
2

julia> @m x
1 arguments
```

## 代码生成

当需要大量重复的样板代码时，为了避免冗余，通常以编程方式生成它。在大多数语言中，这需要一个额外的构建步骤以及生成重复代码的独立程序。在 Julia 中，表达式插值和 [`eval`](@ref) 允许在通常的程序执行过程中生成这些代码。例如，考虑下列自定义类型

```jldoctest mynumber-codegen
struct MyNumber
    x::Float64
end
# output

```

我们想为该类型添加一些方法。在下面的循环中，我们以编程的方式完成此工作：

```jldoctest mynumber-codegen
for op = (:sin, :cos, :tan, :log, :exp)
    eval(quote
        Base.$op(a::MyNumber) = MyNumber($op(a.x))
    end)
end
# output

```

现在，我们对自定义类型调用这些函数：

```jldoctest mynumber-codegen
julia> x = MyNumber(π)
MyNumber(3.141592653589793)

julia> sin(x)
MyNumber(1.2246467991473532e-16)

julia> cos(x)
MyNumber(-1.0)
```

在这种方法中，Julia 充当了自己的[预处理器](https://en.wikipedia.org/wiki/Preprocessor)，并且允许从语言内部生成代码。使用 `:` 前缀的引用形式编写上述代码会使其更简洁：

```julia
for op = (:sin, :cos, :tan, :log, :exp)
    eval(:(Base.$op(a::MyNumber) = MyNumber($op(a.x))))
end
```

不管怎样，这种使用 `eval(quote(...))` 模式生成语言内部的代码很常见，为此，Julia 自带了一个宏来缩写该模式：

```julia
for op = (:sin, :cos, :tan, :log, :exp)
    @eval Base.$op(a::MyNumber) = MyNumber($op(a.x))
end
```

[`@eval`](@ref) 重写此调用，使其与上面的较长版本完全等价。为了生成较长的代码块，可以把一个代码块作为表达式参数传给 [`@eval`](@ref)：

```julia
@eval begin
    # multiple lines
end
```

## 非标准字符串字面量

回想一下在[字符串](@ref non-standard-string-literals)的文档中，以标识符为前缀的字符串字面量被称为非标准字符串字面量，它们可以具有与未加前缀的字符串字面量不同的语义。例如：

  * `r"^\s*(?:#|$)"` 生成一个正则表达式对象而不是一个字符串
  * `b"DATA\xff\u2200"` 是字节数组 `[68,65,84,65,255,226,136,128]` 的字面量。

可能令人惊讶的是，这些行为并没有被硬编码到 Julia 的解释器或编译器中。相反，它们是由一个通用机制实现的自定义行为，且任何人都可以使用该机制：带前缀的字符串字面量被解析为特定名称的宏的调用。例如，正则表达式宏如下：

```julia
macro r_str(p)
    Regex(p)
end
```

这便是全部代码。这个宏说的是字符串字面量 `r"^\s*(?:#|$)"` 的字面内容应该传给宏 `@r_str`，并且展开后的结果应当放在该字符串字面量出现处的语法树中。换句话说，表达式 `r"^\s*(?:#|$)"` 等价于直接把下列对象放进语法树中：

```julia
Regex("^\\s*(?:#|\$)")
```

字符串字面量形式不仅更短、更方便，也更高效：因为正则表达式需要编译，`Regex` 对象实际上是*在编译代码时*创建的，所以编译只发生一次，而不是每次执行代码时都再编译一次。请考虑如果正则表达式出现在循环中：

```julia
for line = lines
    m = match(r"^\s*(?:#|$)", line)
    if m === nothing
        # non-comment
    else
        # comment
    end
end
```

因为正则表达式 `r"^\s*(?:#|$)"` 在这段代码解析时便已编译并被插入到语法树中，所以它只编译一次，而不是每次执行循环时都再编译一次。要在不使用宏的情况下实现此效果，必须像这样编写此循环：

```julia
re = Regex("^\\s*(?:#|\$)")
for line = lines
    m = match(re, line)
    if m === nothing
        # non-comment
    else
        # comment
    end
end
```

此外，如果编译器无法确定在所有循环中正则表达式对象都是常量，可能无法进行某些优化，使得此版本的效率依旧低于上面的更方便的字面量形式。当然，在某些情况下，非字面量形式更方便：如果需要向正则表达式中插入变量，就必须采用这种更冗长的方法；如果正则表达式模式本身是动态的，可能在每次循环迭代时发生变化，就必须在每次迭代中构造新的正则表达式对象。然而，在绝大多数用例中，正则表达式不是基于运行时的数据构造的。在大多数情况下，将正则表达式编写为编译期值的能力是无法估量的。

与非标准字符串字面量一样，非标准命令字面量存在使用命令字面量语法的带前缀变种。命令字面量 ```custom`literal` ``` 被解析为 `@custom_cmd "literal"`。Julia 本身不包含任何非标准命令字面量，但包可以使用此语法。除了语法不同以及使用 `_cmd` 而不是 `_str` 后缀，非标准命令字面量的行为与非标准字符串字面量完全相同。

如果两个模块提供了同名的非标准字符串或命令字面量，能使用模块名限定该字符串或命令字面量。例如，如果 `Foo` 和 `Bar` 提供了相同的字符串字面量 `@x_str`，那么可以编写 `Foo.x"literal"` 或 `Bar.x"literal"` 来消除两者的歧义。

用户定义的字符串字面量的机制十分强大。不仅 Julia 的非标准字面量的实现使用它，而且命令字面量的语法（``` `echo "Hello, $person"` ```）用下面看起来人畜无害的宏实现：

```julia
macro cmd(str)
    :(cmd_gen($(shell_parse(str)[1])))
end
```

当然，这个宏的定义中使用的函数隐藏了许多复杂性，但它们只是函数且完全用 Julia 编写。你可以阅读它们的源代码并精确地看到它们的行为——它们所做的一切就是构造要插入到你的程序的语法树的表达式对象。

## 生成函数

有个非常特殊的宏叫 [`@generated`](@ref)，它允许你定义所谓的*生成函数*。它们能根据其参数类型生成专用代码，与用多重派发所能实现的代码相比，其代码更灵活和/或少。虽然宏在解析时使用表达式且无法访问其输入值的类型，但是生成函数在参数类型已知时会被展开，但该函数尚未编译。

生成函数的声明不会执行某些计算或操作，而会返回一个被引用的表达式，接着该表达式构成参数类型所对应方法的主体。在调用生成函数时，其返回的表达式会被编译然后执行。为了提高效率，通常会缓存结果。为了能推断是否缓存结果，只能使用语言的受限子集。因此，生成函数提供了一个灵活的方式来将工作重运行时移到编译时，代价则是其构造能力受到更大的限制。

定义生成函数与普通函数有五个主要区别：

1. 使用 `@generated` 标注函数声明。这会向 AST 附加一些信息，让编译器知道这个函数是生成函数。
    
2. 在生成函数的主体中，你只能访问参数的*类型*，而不能访问其值，以及在生成函数的定义之前便已定义的任何函数。
    
3. 不应计算某些东西或执行某些操作，应返回一个*被引用的*表达式，它会在被求值时执行你想要的操作。
    
4. 生成函数只允许调用在生成函数定义之前定义的函数。（如果不遵循这一点，引用来自未来世界的函数可能会导致 `MethodErrors` ）
    
5. 生成函数不能*更改*或*观察*任何非常量的全局状态。（例如，其包括 IO、锁、非局部的字典或者使用 `hasmethod`）即它们只能读取全局常量，且没有任何副作用。换句话说，它们必须是纯函数。由于实现限制，这也意味着它们目前无法定义闭包或生成器。
    
    
    
    
    

举例子来说明这个是最简单的。我们可以将生成函数 `foo` 声明为

```jldoctest generated
julia> @generated function foo(x)
           Core.println(x)
           return :(x * x)
       end
foo (generic function with 1 method)
```

请注意，代码主体返回一个被引用的表达式，即 `:(x * x)`，而不仅仅是 `x * x` 的值。

从调用者的角度看，这与通常的函数等价；实际上，你无需知道你所调用的是通常的函数还是生成函数。让我们看看 `foo` 的行为：

```jldoctest generated
julia> x = foo(2); # note: output is from println() statement in the body
Int64

julia> x           # now we print x
4

julia> y = foo("bar");
String

julia> y
"barbar"
```

因此，我们知道在生成函数的主体中，`x` 是所传递参数的*类型*，并且，生成函数的返回值是其定义所返回的被引用的表达式的求值结果，在该表达式求值时 `x` 表示其*值*。

如果我们使用我们已经使用过的类型再次对 `foo` 求值会发生什么？

```jldoctest generated
julia> foo(4)
16
```

请注意，这里并没有打印 [`Int64`](@ref)。我们可以看到对于特定的参数类型集来说，生成函数的主体只执行一次，且结果会被缓存。此后，对于此示例，生成函数首次调用返回的表达式被重新用作方法主体。但是，实际的缓存行为是由实现定义的性能优化，过于依赖此行为并不实际。

生成函数*可能*只生成一次函数,但也*可能*多次生成，或者看起来根本就没有生成过函数。因此，你应该*从不*编写有副作用的生成函数——因为副作用发生的时间和频率是不确定的。（对于宏来说也是如此——跟宏一样，在生成函数中使用 [`eval`](@ref) 也许意味着你正以错误的方式做某事。）但是，与宏不同，运行时系统无法正确处理对 [`eval`](@ref) 的调用，所以不允许这样做。

理解 `@generated` 函数与方法的重定义间如何相互作用也很重要。遵循正确的 `@generated` 函数不能观察任何可变状态或导致全局状态的任何更改的原则，我们看到以下行为。观察到，生成函数*不能*调用在生成函数本身的*定义*之前未定义的任何方法。

一开始 `f(x)` 有一个定义

```jldoctest redefinition
julia> f(x) = "original definition";
```

定义使用 `f(x)` 的其它操作：

```jldoctest redefinition
julia> g(x) = f(x);

julia> @generated gen1(x) = f(x);

julia> @generated gen2(x) = :(f(x));
```

我们现在为 `f(x)` 添加几个新定义：

```jldoctest redefinition
julia> f(x::Int) = "definition for Int";

julia> f(x::Type{Int}) = "definition for Type{Int}";
```

并比较这些结果的差异：

```jldoctest redefinition
julia> f(1)
"definition for Int"

julia> g(1)
"definition for Int"

julia> gen1(1)
"original definition"

julia> gen2(1)
"definition for Int"
```

生成函数的每个方法都有自己的已定义函数视图：

```jldoctest redefinition
julia> @generated gen1(x::Real) = f(x);

julia> gen1(1)
"definition for Type{Int}"
```

上例中的生成函数 `foo` 能做的，通常的函数 `foo(x) = x * x` 也能做（除了在第一次调用时打印类型，并产生了更高的开销）。但是，生成函数的强大之处在于其能够根据传递给它的类型计算不同的被引用的表达式：

```jldoctest
julia> @generated function bar(x)
           if x <: Integer
               return :(x ^ 2)
           else
               return :(x)
           end
       end
bar (generic function with 1 method)

julia> bar(4)
16

julia> bar("baz")
"baz"
```

（当然，这个刻意的例子可以更简单地通过多重派发实现······）

滥用它会破坏运行时系统并导致未定义行为：

```jldoctest
julia> @generated function baz(x)
           if rand() < .9
               return :(x^2)
           else
               return :("boo!")
           end
       end
baz (generic function with 1 method)
```

由于生成函数的主体具有不确定性，其行为和*所有后续代码的行为*并未定义。

*不要复制这些例子！*

这些例子有助于说明生成函数定义和调用的工作方式；但是，*不要复制它们*，原因如下：

  * `foo` 函数有副作用（对 `Core.println` 的调用），并且未确切定义这些副作用发生的时间、频率和次数。
     
  * `bar` 函数解决的问题可通过多重派发被更好地解决——定义 `bar(x) = x` 和 `bar(x::Integer) = x ^ 2` 会做同样的事，但它更简单和快捷。
     
  * `baz` 函数是病态的

请注意，不应在生成函数中尝试的操作并无严格限制，且运行时系统现在只能检测一部分无效操作。还有许多操作只会破坏运行时系统而没有通知，通常以微妙的方式而非显然地与错误的定义相关联。因为函数生成器是在类型推导期间运行的，所以它必须遵守该代码的所有限制。

一些不应该尝试的操作包括：

1. 缓存本地指针。
2. 以任何方式与 `Core.Compiler` 的内容或方法交互。
3. 观察任何可变状态。

     * 生成函数的类型推导可以在*任何*时候运行，包括你的代码正在尝试观察或更改此状态时。
        
4. 采用任何锁：你调用的 C 代码可以在内部使用锁（例如，调用 `malloc` 不会有问题，即使大多数实现在内部需要锁），但是不要试图在执行 Julia 代码时保持或请求任何锁。
    
    
5. 调用在生成函数的主体后定义的任何函数。对于增量加载的预编译模块，则放宽此条件，以允许调用模块中的任何函数。
    

那好，我们现在已经更好地理解了生成函数的工作方式，让我们使用它来构建一些更高级（和有效）的功能……

### 一个高级的例子

Julia 的 base 库有个内部函数 `sub2ind`，用于根据一组 n 重线性索引计算 n 维数组的线性索引——换句话说，用于计算索引 `i`，其可用于使用 `A[i]` 来索引数组 `A`，而不是用 `A[x,y,z,...]`。一种可能的实现如下：

```jldoctest sub2ind
julia> function sub2ind_loop(dims::NTuple{N}, I::Integer...) where N
           ind = I[N] - 1
           for i = N-1:-1:1
               ind = I[i]-1 + dims[i]*ind
           end
           return ind + 1
       end
sub2ind_loop (generic function with 1 method)

julia> sub2ind_loop((3, 5), 1, 2)
4
```

用递归可以完成同样的事情：

```jldoctest
julia> sub2ind_rec(dims::Tuple{}) = 1;

julia> sub2ind_rec(dims::Tuple{}, i1::Integer, I::Integer...) =
           i1 == 1 ? sub2ind_rec(dims, I...) : throw(BoundsError());

julia> sub2ind_rec(dims::Tuple{Integer, Vararg{Integer}}, i1::Integer) = i1;

julia> sub2ind_rec(dims::Tuple{Integer, Vararg{Integer}}, i1::Integer, I::Integer...) =
           i1 + dims[1] * (sub2ind_rec(Base.tail(dims), I...) - 1);

julia> sub2ind_rec((3, 5), 1, 2)
4
```

这两种实现虽然不同，但本质上做同样的事情：在数组维度上的运行时循环，将每个维度上的偏移量收集到最后的索引中。

然而，循环所需的信息都已嵌入到参数的类型信息中。因此，我们可以利用生成函数将迭代移动到编译期；用编译器的说法，我们用生成函数手动展开循环。代码主体变得几乎相同，但我们不是计算线性索引，而是建立计算索引的*表达式*：

```jldoctest sub2ind_gen
julia> @generated function sub2ind_gen(dims::NTuple{N}, I::Integer...) where N
           ex = :(I[$N] - 1)
           for i = (N - 1):-1:1
               ex = :(I[$i] - 1 + dims[$i] * $ex)
           end
           return :($ex + 1)
       end
sub2ind_gen (generic function with 1 method)

julia> sub2ind_gen((3, 5), 1, 2)
4
```

**这会生成什么代码？**

找出所生成代码的一个简单方法是将生成函数的主体提取到另一个（通常的）函数中：

```jldoctest sub2ind_gen2
julia> @generated function sub2ind_gen(dims::NTuple{N}, I::Integer...) where N
           return sub2ind_gen_impl(dims, I...)
       end
sub2ind_gen (generic function with 1 method)

julia> function sub2ind_gen_impl(dims::Type{T}, I...) where T <: NTuple{N,Any} where N
           length(I) == N || return :(error("partial indexing is unsupported"))
           ex = :(I[$N] - 1)
           for i = (N - 1):-1:1
               ex = :(I[$i] - 1 + dims[$i] * $ex)
           end
           return :($ex + 1)
       end
sub2ind_gen_impl (generic function with 1 method)
```

我们现在可以执行 `sub2ind_gen_impl` 并检查它所返回的表达式：

```jldoctest sub2ind_gen2
julia> sub2ind_gen_impl(Tuple{Int,Int}, Int, Int)
:(((I[1] - 1) + dims[1] * (I[2] - 1)) + 1)
```

因此，这里使用的方法主体根本不包含循环——只有两个元组的索引、乘法和加法/减法。所有循环都是在编译期执行的，我们完全避免了在执行期间的循环。因此，我们只需对每个类型循环*一次*，在本例中每个 `N` 循环一次（除了在该函数被多次生成的边缘情况——请参阅上面的免责声明）。

### 可选地生成函数

生成函数可以在运行时实现高效率，但需要编译时间成本：必须为具体的参数类型的每个组合生成新的函数体。通常，Julia 能够编译函数的「泛型」版本，其适用于任何参数，但对于生成函数，这是不可能的。这意味着大量使用生成函数的程序可能无法静态编译。

为了解决这个问题，语言提供用于编写生成函数的通常、非生成的替代实现的语法。应用于上面的 `sub2ind` 示例，它看起来像这样：

```julia
function sub2ind_gen(dims::NTuple{N}, I::Integer...) where N
    if N != length(I)
        throw(ArgumentError("Number of dimensions must match number of indices."))
    end
    if @generated
        ex = :(I[$N] - 1)
        for i = (N - 1):-1:1
            ex = :(I[$i] - 1 + dims[$i] * $ex)
        end
        return :($ex + 1)
    else
        ind = I[N] - 1
        for i = (N - 1):-1:1
            ind = I[i] - 1 + dims[i]*ind
        end
        return ind + 1
    end
end
```

在内部，这段代码创建了函数的两个实现：一个生成函数的实现，其使用 `if @generated` 中的第一个块，一个通常的函数的实现，其使用 `else` 块。在 `if @generated` 块的 `then` 部分中，代码与其它生成函数具有相同的语义：参数名称引用类型，且代码应返回表达式。可能会出现多个 `if @generated` 块，在这种情况下，生成函数的实现使用所有的 `then` 块，而替代实现使用所有的 `else` 块。

请注意，我们在函数顶部添加了错误检查。此代码对两个版本都是通用的，且是两个版本中的运行时代码（它将被引用并返回为生成函数版本中的表达式）。这意味着局部变量的值和类型在代码生成时不可用——用于代码生成的代码只能看到参数类型。

在这种定义方式中，代码生成功能本质上只是一种可选的优化。如果方便，编译器将使用它，否则可能选择使用通常的实现。这种方式是首选的，因为它允许编译器做出更多决策和以更多方式编译程序，还因为通常代码比由代码生成的代码更易读。但是，使用哪种实现取决于编译器实现细节，因此，两个实现的行为必须相同。
