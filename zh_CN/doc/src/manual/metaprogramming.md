# 元编程

Lisp 留给 Julia 最大的遗产就是它的元编程支持。和 Lisp 一样，Julia 把自己的代码表示为语言中的数据结构。既然代码被表示为了可以在语言中创建和操作的对象，程序就可以变换和生成自己的代码。这允许在没有额外构建步骤的情况下生成复杂的代码，并且还允许在 [abstract syntax trees](https://en.wikipedia.org/wiki/Abstract_syntax_tree) 级别上运行的真正的 Lisp 风格的宏。与之相对的是预处理器“宏”系统，比如 C 和 C++ 中的，它们在解析和解释代码之前进行文本操作和变换。由于 Julia 中的所有数据类型和代码都被表示为 Julia 的 数据结构，强大的 [reflection](https://en.wikipedia.org/wiki/Reflection_omputer_%28cprogramming%29)
功能可用于探索程序的内部及其类型，就像任何其他数据一样。

## 程序表示

每个 Julia 程序均以字符串开始：

```jldoctest prog
julia> prog = "1 + 1"
"1 + 1"
```

**接下来会发生什么？**

下一步是 [parse](https://en.wikipedia.org/wiki/Parsing#Computer_languages) 每个字符串到一个称为表达式的对象，由 Julia 的类型 `Expr` 表示：

```jldoctest prog
julia> ex1 = Meta.parse(prog)
:(1 + 1)

julia> typeof(ex1)
Expr
```

`Expr` 对象包含两个部分：

  * 一个标识表达式类型的 `Symbol`。Symbol 就是一个 [interned string](https://en.wikipedia.org/wiki/String_interning)
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

另外一个查看表达式的方法是使用 Meta.show_sexpr，它能显示给定 `Expr` 的 [S-expression](https://en.wikipedia.org/wiki/S-expression)，对 Lisp 用户来说，这看着很熟悉。下面是一个示例，阐释了如何显示嵌套的 `Expr`：

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

`:` 的第二个语义是不显式调用 `Expr` 构造器来创建表达式对象。这被称为*引用*。`:` 后面跟着包围着单个 Julia 语句括号，可以基于被包围的代码生成一个 `Expr` 对象。下面是一个引用算数表达式的例子：

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

### 插值

使用值参数直接构造 `Expr` 对象虽然很强大，但与「通常的」 Julia 语法相比，`Expr` 构造函数可能让人觉得乏味。作为替代方法，Julia 允许将字面量或表达式插入到被引用的表达式中。表达式插值由前缀 `$` 表示。

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

请注意，结果包含 `Expr(:$, :x)`，这意味着 `x` 还未被求值。换种说法，`$` 表达式「属于」内层引用表达式，所以它的参数只在内层引用表达式被求值时进行求值：

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

请注意，现在的结果中出现的是 `:(1 + 2)` 而不是符号 `:x`。求解此表达式产生一个被插值的 `3`：

```jldoctest interp1
julia> eval(e)
quote
    #= none:1 =#
    3
end
```

这种行为背后的直觉是每个 `$` 都将 `x` 求值一遍：一个 `$` 工作方式类似于 `eval(:x)`，其返回 `x` 的值，而两个 `$` 行为相当于 `eval(eval(:x))`。

### QuoteNode

`quote` 形式在 AST 中通常表示为一个 head 为 `:quote` 的 `Expr`：

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

正如我们所看到的，这种表达式可以使用 `$` 进行插值。但是，在某些情况下，必须引用代码而*不*执行插值。这种引用还没有语法，但它在内部表示为 `QuoteNode` 类型的对象。对于像符号这样的简单引用项，解析器生成 `QuoteNode`：

```jldoctest interp1
julia> dump(Meta.parse(":x"))
QuoteNode
  value: Symbol x
```

`QuoteNode` 也可用于某些高级的元编程任务。

### [`eval`](@ref) 及其效果

给定一个表达式对象，可以通过 [`eval`](@ref) 使 Julia 在全局作用域内求值（执行）它：

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

如上所述，Julia 能在其内部生成和操作 Julia 代码，这是个非常有用的功能。我们已经见过返回 `Expr` 对象的函数例子：[`parse`](@ref) 函数，它接受字符串形式的 Julia 代码并返回相应的 `Expr`。函数也可以接受一个或多个 `Expr` 对象作为参数，并返回另一个 `Expr`。这是个简单、提神的例子：

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

我们可使用 [`macroexpand`](@ref)看到返回的quoted 表达式。(**important note:**
在调试宏的时候这是一个非常有用的工具):

```julia-repl sayhello2
julia> ex = macroexpand(Main, :(@sayhello("human")) )
:((Main.println)("Hello, ", "human"))

julia> typeof(ex)
Expr
```

我们可以看到 `"human"` 字面量已被插入到表达式中了。

还有一个宏 [`@ macroexpand`](@ ref)，它可能比 `macroexpand` 函数更方便：


```jldoctest sayhello2
julia> @macroexpand @sayhello "human"
:((println)("Hello, ", "human"))
```

### 注意：为何使用宏？

我们在前一节中已经见过 `f(::Expr...) -> Expr` 形式的函数。事实上，[`macroexpand`](@ref) 也是这样的函数。所以，宏为何存在？

宏是必需的，因为其在代码解析时执行，于是，宏允许程序员在整个程序运行*前*生成并包含自定义的代码片段。为了说明此差异，请考虑以下示例：

```julia-repl whymacros
julia> macro twostep(arg)
           println("I execute at parse time. The argument is: ", arg)
           return :(println("I execute at runtime. The argument is: ", $arg))
       end
@twostep (macro with 1 method)

julia> ex = macroexpand(Main, :(@twostep :(1, 2, 3)) );
I execute at parse time. The argument is: $(Expr(:quote, :((1, 2, 3))))
```

第一个 [`println`](@ref) 调用在调用 [`macroexpand`](@ref) 时执行。生成的表达式*只*包含第二个 `println`：

```julia-repl whymacros
julia> typeof(ex)
Expr

julia> ex
:((println)("I execute at runtime. The argument is: ", $(Expr(:copyast, :($(QuoteNode(:((1, 2, 3)))))))))

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

参数 `__source__` 提供 `@` 符号在宏调用处的解析器位置的相关信息（以 `LineNumberNode` 对象的形式）。这使得宏能包含更好的错误诊断信息，其通常用于日志记录、字符串解析器宏和文档，比如，用于实现 `@__LINE__`、`@__FILE__` 和 `@__DIR__` 宏。

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

The argument `__module__` provides information (in the form of a `Module` object)
about the expansion context of the macro invocation.
This allows macros to look up contextual information, such as existing bindings,
or to insert the value as an extra argument to a runtime function call doing self-reflection
in the current module.


### 构建高级的宏

这是 Julia 的 `@assert` 宏的简化定义：

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

也就是说，在第一个调用中，表达式 `:(1 == 1.0)` 拼接到测试条件槽中，而 `string(:(1 == 1.0))` 拼接到断言信息槽中。如此构造的表达式会被放置在发生 `@assert` 宏调用处的语法树。然后在执行时，如果测试表达式的计算结果为真，则返回 `nothing`，但如果测试结果为假，则会引发错误，表明声明的表达式为假。请注意，将其编写为函数是不可能的，因为能获取的只有条件的*值*而无法在错误信息中显示计算出它的表达式。

在 Julia Base 中，`@assert` 的实际定义更复杂。它允许用户可选地制定自己的错误信息，而不仅仅是打印断言失败的表达式。与函数一样，具有可变数量的参数可在最后一个参数后面用省略号指定：

```jldoctest assert2
julia> macro assert(ex, msgs...)
           msg_body = isempty(msgs) ? ex : msgs[1]
           msg = string(msg_body)
           return :($ex ? nothing : throw(AssertionError($msg)))
       end
@assert (macro with 1 method)
```

现在 `@assert` 有两种操作模式，具体取决于它接收的参数数。如果只有一个参数，`msgs` 捕获的表达式元组将为空，宏的行为将与上面的简单定义相同。但是如果用户现在指定了第二个参数，则它将打印在消息正文中而不是失败的表达式。 你可以使用名副其实的 [`@macroexpand`](@ref) 宏来检查宏扩展的结果：

```julia-repl assert2
julia> @macroexpand @assert a == b
:(if Main.a == Main.b
        Main.nothing
    else
        (Main.throw)((Main.AssertionError)("a == b"))
    end)

julia> @macroexpand @assert a==b "a should equal b!"
:(if Main.a == Main.b
        Main.nothing
    else
        (Main.throw)((Main.AssertionError)("a should equal b!"))
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
        local t0 = time()
        local val = $ex
        local t1 = time()
        println("elapsed time: ", t1-t0, " seconds")
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

获得正确的规则也许是个艰巨的挑战。在使用宏之前，你可以去考虑是否函数闭包便已足够。另一个有用的策略是将尽可能多的工作推迟到运行时。例如，许多宏只是将其参数封装为 QuoteNode 或类似的 Expr。这方面的例子有 `@task body`，它只返回 `schedule(Task(() -> $body))`， 和 `@eval expr`，它只返回 `eval(QuoteNode(expr))`。

为了演示，我们可以将上面的 `@time` 示例重新编写成：

```julia
macro time(expr)
    return :(timeit(() -> $(esc(expr))))
end
function timeit(f)
    t0 = time()
    val = f()
    t1 = time()
    println("elapsed time: ", t1-t0, " seconds")
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

## Generated functions

A very special macro is `@generated`, which allows you to define so-called *generated functions*.
These have the capability to generate specialized code depending on the types of their arguments
with more flexibility and/or less code than what can be achieved with multiple dispatch. While
macros work with expressions at parse time and cannot access the types of their inputs, a generated
function gets expanded at a time when the types of the arguments are known, but the function is
not yet compiled.

Instead of performing some calculation or action, a generated function declaration returns a quoted
expression which then forms the body for the method corresponding to the types of the arguments.
When a generated function is called, the expression it returns is compiled and then run.
To make this efficient, the result is usually cached. And to make this inferable, only a limited
subset of the language is usable. Thus, generated functions provide a flexible way to move work from
run time to compile time, at the expense of greater restrictions on allowed constructs.

When defining generated functions, there are four main differences to ordinary functions:

1. You annotate the function declaration with the `@generated` macro. This adds some information
   to the AST that lets the compiler know that this is a generated function.
2. In the body of the generated function you only have access to the *types* of the arguments –
   not their values – and any function that was defined *before* the definition of the generated
   function.
3. Instead of calculating something or performing some action, you return a *quoted expression* which,
   when evaluated, does what you want.
4. Generated functions must not *mutate* or *observe* any non-constant global state (including,
   例如，IO、锁、非本地词典或者使用`hasmethod`）
   即它们只能读取全局常量，且没有任何副作用。
   In other words, they must be completely pure.
   Due to an implementation limitation, this also means that they currently cannot define a closure
   or generator.

It's easiest to illustrate this with an example. We can declare a generated function `foo` as

```jldoctest generated
julia> @generated function foo(x)
           Core.println(x)
           return :(x * x)
       end
foo (generic function with 1 method)
```

Note that the body returns a quoted expression, namely `:(x * x)`, rather than just the value
of `x * x`.

From the caller's perspective, this is identical to a regular function; in fact, you don't
have to know whether you're calling a regular or generated function. Let's see how `foo` behaves:

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

So, we see that in the body of the generated function, `x` is the *type* of the passed argument,
and the value returned by the generated function, is the result of evaluating the quoted expression
we returned from the definition, now with the *value* of `x`.

What happens if we evaluate `foo` again with a type that we have already used?

```jldoctest generated
julia> foo(4)
16
```

Note that there is no printout of [`Int64`](@ref). We can see that the body of the generated function
was only executed once here, for the specific set of argument types, and the result was cached.
After that, for this example, the expression returned from the generated function on the first
invocation was re-used as the method body. However, the actual caching behavior is an implementation-defined
performance optimization, so it is invalid to depend too closely on this behavior.

The number of times a generated function is generated *might* be only once, but it *might* also
be more often, or appear to not happen at all. As a consequence, you should *never* write a generated
function with side effects - when, and how often, the side effects occur is undefined. (This is
true for macros too - and just like for macros, the use of [`eval`](@ref) in a generated function
is a sign that you're doing something the wrong way.) However, unlike macros, the runtime system
cannot correctly handle a call to [`eval`](@ref), so it is disallowed.

It is also important to see how `@generated` functions interact with method redefinition.
Following the principle that a correct `@generated` function must not observe any
mutable state or cause any mutation of global state, we see the following behavior.
Observe that the generated function *cannot* call any method that was not defined
prior to the *definition* of the generated function itself.

Initially `f(x)` has one definition

```jldoctest redefinition
julia> f(x) = "original definition";
```

Define other operations that use `f(x)`:

```jldoctest redefinition
julia> g(x) = f(x);

julia> @generated gen1(x) = f(x);

julia> @generated gen2(x) = :(f(x));
```

We now add some new definitions for `f(x)`:

```jldoctest redefinition
julia> f(x::Int) = "definition for Int";

julia> f(x::Type{Int}) = "definition for Type{Int}";
```

and compare how these results differ:

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

Each method of a generated function has its own view of defined functions:

```jldoctest redefinition
julia> @generated gen1(x::Real) = f(x);

julia> gen1(1)
"definition for Type{Int}"
```

The example generated function `foo` above did not do anything a normal function `foo(x) = x * x`
could not do (except printing the type on the first invocation, and incurring higher overhead).
However, the power of a generated function lies in its ability to compute different quoted expressions
depending on the types passed to it:

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

(although of course this contrived example would be more easily implemented using multiple dispatch...)

Abusing this will corrupt the runtime system and cause undefined behavior:

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

Since the body of the generated function is non-deterministic, its behavior, *and the behavior of all subsequent code*
is undefined.

*Don't copy these examples!*

These examples are hopefully helpful to illustrate how generated functions work, both in the definition
end and at the call site; however, *don't copy them*, for the following reasons:

  * the `foo` function has side-effects (the call to `Core.println`), and it is undefined exactly
    when, how often or how many times these side-effects will occur
  * the `bar` function solves a problem that is better solved with multiple dispatch - defining `bar(x) = x`
    and `bar(x::Integer) = x ^ 2` will do the same thing, but it is both simpler and faster.
  * the `baz` function is pathological

Note that the set of operations that should not be attempted in a generated function is unbounded,
and the runtime system can currently only detect a subset of the invalid operations. There are
many other operations that will simply corrupt the runtime system without notification, usually
in subtle ways not obviously connected to the bad definition. Because the function generator is
run during inference, it must respect all of the limitations of that code.

Some operations that should not be attempted include:

1. Caching of native pointers.
2. Interacting with the contents or methods of Core.Compiler in any way.
3. Observing any mutable state.

     * Inference on the generated function may be run at *any* time, including while your code is attempting
       to observe or mutate this state.
4. Taking any locks: C code you call out to may use locks internally, (for example, it is not problematic
   to call `malloc`, even though most implementations require locks internally) but don't attempt
   to hold or acquire any while executing Julia code.
5. Calling any function that is defined after the body of the generated function. This condition
   is relaxed for incrementally-loaded precompiled modules to allow calling any function in the module.

Alright, now that we have a better understanding of how generated functions work, let's use them
to build some more advanced (and valid) functionality...

### An advanced example

Julia's base library has a an internal `sub2ind` function to calculate a linear index into an n-dimensional
array, based on a set of n multilinear indices - in other words, to calculate the index `i` that
can be used to index into an array `A` using `A[i]`, instead of `A[x,y,z,...]`. One possible implementation
is the following:

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

The same thing can be done using recursion:

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

Both these implementations, although different, do essentially the same thing: a runtime loop
over the dimensions of the array, collecting the offset in each dimension into the final index.

However, all the information we need for the loop is embedded in the type information of the arguments.
Thus, we can utilize generated functions to move the iteration to compile-time; in compiler parlance,
we use generated functions to manually unroll the loop. The body becomes almost identical, but
instead of calculating the linear index, we build up an *expression* that calculates the index:

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

**What code will this generate?**

An easy way to find out is to extract the body into another (regular) function:

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

We can now execute `sub2ind_gen_impl` and examine the expression it returns:

```jldoctest sub2ind_gen2
julia> sub2ind_gen_impl(Tuple{Int,Int}, Int, Int)
:(((I[1] - 1) + dims[1] * (I[2] - 1)) + 1)
```

So, the method body that will be used here doesn't include a loop at all - just indexing into
the two tuples, multiplication and addition/subtraction. All the looping is performed compile-time,
and we avoid looping during execution entirely. Thus, we only loop *once per type*, in this case
once per `N` (except in edge cases where the function is generated more than once - see disclaimer
above).

### Optionally-generated functions

Generated functions can achieve high efficiency at run time, but come with a compile time cost:
a new function body must be generated for every combination of concrete argument types.
Typically, Julia is able to compile "generic" versions of functions that will work for any
arguments, but with generated functions this is impossible.
This means that programs making heavy use of generated functions might be impossible to
statically compile.

To solve this problem, the language provides syntax for writing normal, non-generated
alternative implementations of generated functions.
Applied to the `sub2ind` example above, it would look like this:

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

Internally, this code creates two implementations of the function: a generated one where
the first block in `if @generated` is used, and a normal one where the `else` block is used.
Inside the `then` part of the `if @generated` block, code has the same semantics as other
generated functions: argument names refer to types, and the code should return an expression.
Multiple `if @generated` blocks may occur, in which case the generated implementation uses
all of the `then` blocks and the alternate implementation uses all of the `else` blocks.

Notice that we added an error check to the top of the function.
This code will be common to both versions, and is run-time code in both versions
(it will be quoted and returned as an expression from the generated version).
That means that the values and types of local variables are not available at code generation
time --- the code-generation code can only see the types of arguments.

In this style of definition, the code generation feature is essentially an optional
optimization.
The compiler will use it if convenient, but otherwise may choose to use the normal
implementation instead.
This style is preferred, since it allows the compiler to make more decisions and compile
programs in more ways, and since normal code is more readable than code-generating code.
However, which implementation is used depends on compiler implementation details, so it
is essential for the two implementations to behave identically.
