# 流程控制

Julia 提供了大量的流程控制构件：

  * [复合表达式](@ref man-compound-expressions)：`begin` 和 `;`。
  * [条件表达式](@ref man-conditional-evaluation)：`if`-`elseif`-`else` 和 `?:` (三元运算符)。
  * [短路求值](@ref)：`&&`、`||` 和链式比较。
  * [重复执行：循环](@ref man-loops)：`while` 和 `for`。
  * [异常处理](@ref)：`try`-`catch`、[`error`](@ref) 和 [`throw`](@ref)。
  * [`Task`（协程）](@ref man-tasks)：[`yieldto`](@ref)。

前五个流程控制机制是高级编程语言的标准。[`Task`](@ref) 不是那么的标准：它提供了非局部的流程控制，这使得在暂时挂起的计算任务之间进行切换成为可能。这是一个功能强大的构件：Julia 中的异常处理和协同多任务都是通过 `Task` 实现的。虽然日常编程并不需要直接使用 `Task`，但某些问题用 `Task` 处理会更加简单。

## [复合表达式](@id man-compound-expressions)

有时一个表达式能够有序地计算若干子表达式，并返回最后一个子表达式的值作为它的值是很方便的。Julia 有两个组件来完成这个： `begin` 代码块 和 `;` 链。这两个复合表达式组件的值都是最后一个子表达式的值。下面是一个 `begin` 代码块的例子：

```jldoctest
julia> z = begin
           x = 1
           y = 2
           x + y
       end
3
```

因为这些是非常简短的表达式，它们可以简单地被放到一行里，这也是 `;` 链的由来：

```jldoctest
julia> z = (x = 1; y = 2; x + y)
3
```

这个语法在定义简洁的单行函数的时候特别有用，参见[函数](@id man-functions)。尽管很典型，但是并不要求 `begin` 代码块是多行的，或者 `;` 链是单行的：

```jldoctest
julia> begin x = 1; y = 2; x + y end
3

julia> (x = 1;
        y = 2;
        x + y)
3
```

## [条件表达式](@id man-conditional-evaluation)

条件表达式（Conditional evaluation）可以根据布尔表达式的值，让部分代码被执行或者不被执行。下面是对 `if`-`elseif`-`else` 条件语法的分析：

```julia
if x < y
    println("x is less than y")
elseif x > y
    println("x is greater than y")
else
    println("x is equal to y")
end
```

如果表达式 `x < y` 是 `true`，那么对应的代码块会被执行；否则判断条件表达式 `x > y`，如果它是 `true`，则执行对应的代码块；如果没有表达式是 true，则执行 `else` 代码块。下面是一个例子：

```jldoctest
julia> function test(x, y)
           if x < y
               println("x is less than y")
           elseif x > y
               println("x is greater than y")
           else
               println("x is equal to y")
           end
       end
test (generic function with 1 method)

julia> test(1, 2)
x is less than y

julia> test(2, 1)
x is greater than y

julia> test(1, 1)
x is equal to y
```

`elseif` 和 `else` 代码块是可选的，并且可以使用任意多个 `elseif` 代码块。
`if`-`elseif`-`else` 组件中的第一个条件表达式为 `true` 时，其他条件表达式才会被执行，当对应的代码块被执行后，其余的表达式或者代码块将不会被执行。

`if` 代码块是"有渗漏的"，也就是说它们不会引入局部作用域。这意味着在 `if` 语句中新定义的变量依然可以在 `if` 代码块之后使用，尽管这些变量没有在 `if` 语句之前定义过。所以，我们可以将上面的 `test` 函数定义为

```jldoctest
julia> function test(x,y)
           if x < y
               relation = "less than"
           elseif x == y
               relation = "equal to"
           else
               relation = "greater than"
           end
           println("x is ", relation, " y.")
       end
test (generic function with 1 method)

julia> test(2, 1)
x is greater than y.
```

变量 `relation` 是在 `if` 代码块内部声明的，但可以在外部使用。然而，在利用这种行为的时候，要保证变量在所有的分支下都进行了定义。对上述函数做如下修改会导致运行时错误

```jldoctest; filter = r"Stacktrace:(\n \[[0-9]+\].*)*"
julia> function test(x,y)
           if x < y
               relation = "less than"
           elseif x == y
               relation = "equal to"
           end
           println("x is ", relation, " y.")
       end
test (generic function with 1 method)

julia> test(1,2)
x is less than y.

julia> test(2,1)
ERROR: UndefVarError: relation not defined
Stacktrace:
 [1] test(::Int64, ::Int64) at ./none:7
```

`if` 代码块也会返回一个值，这可能对于一些从其他语言转过来的用户来说不是很直观。
这个返回值就是被执行的分支中最后一个被执行的语句的返回值。
所以

```jldoctest
julia> x = 3
3

julia> if x > 0
           "positive!"
       else
           "negative..."
       end
"positive!"
```

需要注意的是，在 Julia 中，经常会用短路求值来表示非常短的条件表达式（单行），这会在下一节中介绍。

与 C, MATLAB, Perl, Python，以及 Ruby 不同，但跟 Java，还有一些别的严谨的类型语言类似：一个条件表达式的值如果不是 `true` 或者 `false` 的话，会返回错误：

```jldoctest
julia> if 1
           println("true")
       end
ERROR: TypeError: non-boolean (Int64) used in boolean context
```

这个错误是说，条件判断结果的类型：[`Int64`](@ref) 是错的，而不是期望的 [`Bool`](@ref)。

所谓的 "三元运算符", `?:`，很类似 `if`-`elseif`-`else` 语法，它用于选择性获取单个表达式的值，而不是选择性执行大段的代码块。它因在很多语言中是唯一一个有三个操作数的运算符而得名：

```julia
a ? b : c
```

在 `?` 之前的表达式 `a`, 是一个条件表达式，如果条件 `a` 是 `true`，三元运算符计算在 `:` 之前的表达式 `b`；如果条件 `a` 是 `false`，则执行 `:` 后面的表达式 `c`。注意，`?` 和 `:` 旁边的空格是强制的，像 `a?b:c` 这种表达式不是一个有效的三元表达式（但在`?` 和 `:` 之后的换行是允许的）。

理解这种行为的最简单方式是看一个实际的例子。在前一个例子中，虽然在三个分支中都有调用 `println`，但实质上是选择打印哪一个字符串。在这种情况下，我们可以用三元运算符更紧凑地改写。为了简明，我们先尝试只有两个分支的版本：

```jldoctest
julia> x = 1; y = 2;

julia> println(x < y ? "less than" : "not less than")
less than

julia> x = 1; y = 0;

julia> println(x < y ? "less than" : "not less than")
not less than
```

如果表达式 `x < y` 为真，整个三元运算符会执行字符串 `"less than"`，否则执行字符串 `"not less than"`。原本的三个分支的例子需要链式嵌套使用三元运算符：

```jldoctest
julia> test(x, y) = println(x < y ? "x is less than y"    :
                            x > y ? "x is greater than y" : "x is equal to y")
test (generic function with 1 method)

julia> test(1, 2)
x is less than y

julia> test(2, 1)
x is greater than y

julia> test(1, 1)
x is equal to y
```

为了方便链式传值，运算符从右到左连接到一起。

重要地是，与 `if`-`elseif`-`else` 类似，`:` 之前和之后的表达式只有在条件表达式为 `true` 或者 `false` 时才会被相应地执行：

```jldoctest
julia> v(x) = (println(x); x)
v (generic function with 1 method)

julia> 1 < 2 ? v("yes") : v("no")
yes
"yes"

julia> 1 > 2 ? v("yes") : v("no")
no
"no"
```

## 短路求值

短路求值非常类似条件求值。这种行为在多数有 `&&` 和 `||` 布尔运算符地命令式编程语言里都可以找到：在一系列由这些运算符连接的布尔表达式中，为了得到整个链的最终布尔值，仅仅只有最小数量的表达式被计算。更明确的说，这意味着：

  * 在表达式 `a && b` 中，子表达式 `b` 仅当 `a` 为 `true` 的时候才会被执行。
  * 在表达式 `a || b` 中，子表达式 `b` 仅在 `a` 为 `false` 的时候才会被执行。

这里的原因是：如果 `a` 是 `false`，那么无论 `b` 的值是多少，`a && b` 一定是 `false`。同理，如果 `a` 是 `true`，那么无论 `b` 的值是多少，`a || b` 的值一定是 true。`&&` 和 `||` 都依赖于右边，但是 `&&` 比 `||` 有更高的优先级。我们可以简单地测试一下这个行为：

```jldoctest tandf
julia> t(x) = (println(x); true)
t (generic function with 1 method)

julia> f(x) = (println(x); false)
f (generic function with 1 method)

julia> t(1) && t(2)
1
2
true

julia> t(1) && f(2)
1
2
false

julia> f(1) && t(2)
1
false

julia> f(1) && f(2)
1
false

julia> t(1) || t(2)
1
true

julia> t(1) || f(2)
1
true

julia> f(1) || t(2)
1
2
true

julia> f(1) || f(2)
1
2
false
```

你可以用同样的方式测试不同 `&&` 和 `||` 运算符的组合条件下的关联和优先级。

这种行为在 Julia 中经常被用来作为简短 `if` 语句的替代。
可以用 `<cond> && <statement>` (可读为: <cond> *and then* <statement>)来替换 `if <cond> <statement> end`。 类似的，
可以用 `<cond> || <statement>` (可读为: <cond> *or else* <statement>)来替换 `if ! <cond> <statement> end`.

例如，可以像这样定义递归阶乘：

```jldoctest; filter = r"Stacktrace:(\n \[[0-9]+\].*)*"
julia> function fact(n::Int)
           n >= 0 || error("n must be non-negative")
           n == 0 && return 1
           n * fact(n-1)
       end
fact (generic function with 1 method)

julia> fact(5)
120

julia> fact(0)
1

julia> fact(-1)
ERROR: n must be non-negative
Stacktrace:
 [1] error at ./error.jl:33 [inlined]
 [2] fact(::Int64) at ./none:2
 [3] top-level scope
```

**无**短路求值的布尔运算可以用位布尔运算符来完成，见[数学运算和初等函数](@ref)：`&` 和 `|`。这些是普通的函数，同时也刚好支持中缀运算符语法，但总是会计算它们的所有参数：

```jldoctest tandf
julia> f(1) & t(2)
1
2
false

julia> t(1) | t(2)
1
2
true
```

与 `if`, `elseif` 或者三元运算符中的条件表达式相同，`&&` 或者 `||` 的操作数必须是布尔值（`true` 或者 `false`）。在链式嵌套的条件表达式中，
除最后一项外，使用非布尔值会导致错误：

```jldoctest
julia> 1 && true
ERROR: TypeError: non-boolean (Int64) used in boolean context
```

但在链的末尾允许使用任意类型的表达式，此表达式会根据前面的条件被执行并返回：

```jldoctest
julia> true && (x = (1, 2, 3))
(1, 2, 3)

julia> false && (x = (1, 2, 3))
false
```

## [重复执行：循环](@id man-loops)

有两个用于重复执行表达式的组件：`while` 循环和 `for` 循环。下面是一个 `while` 循环的例子：

```jldoctest
julia> i = 1;

julia> while i <= 5
           println(i)
           global i += 1
       end
1
2
3
4
5
```

`while` 循环会执行条件表达式（例子中为 `i <= 5`），只要它为 `true`，就一直执行`while` 循环的主体部分。当 `while` 循环第一次执行时，如果条件表达式为 `false`，那么主体代码就一次也不会被执行。

`for` 循环使得常见的重复执行代码写起来更容易。
像之前 `while` 循环中用到的向上和向下计数是可以用 `for` 循环更简明地表达：

```jldoctest
julia> for i = 1:5
           println(i)
       end
1
2
3
4
5
```

这里的 `1:5` 是一个范围对象，代表数字 1, 2, 3, 4, 5 的序列。`for` 循环在这些值之中迭代，对每一个变量 `i` 进行赋值。`for` 循环与之前 `while` 循环的一个非常重要区别是作用域，即变量的可见性。如果变量 `i` 没有在另一个作用域里引入，在 `for` 循环内，它就只在 `for` 循环内部可见，在外部和后面均不可见。你需要一个新的交互式会话实例或者一个新的变量名来测试这个特性：

```jldoctest
julia> for j = 1:5
           println(j)
       end
1
2
3
4
5

julia> j
ERROR: UndefVarError: j not defined
```

参见[变量作用域](@ref scope-of-variables)中对变量作用域的详细解释以及它在 Julia 中是如何工作的。

一般来说，`for` 循环组件可以用于迭代任一个容器。在这种情况下，相比 `=`，另外的（但完全相同）关键字 `in` 或者 `∈` 则更常用，因为它使得代码更清晰：

```jldoctest
julia> for i in [1,4,0]
           println(i)
       end
1
4
0

julia> for s ∈ ["foo","bar","baz"]
           println(s)
       end
foo
bar
baz
```

在手册后面的章节中会介绍和讨论各种不同的迭代容器（比如，[多维数组](@ref man-multi-dim-arrays)）。

为了方便，我们可能会在测试条件不成立之前终止一个 `while` 循环，或者在访问到迭代对象的结尾之前停止一个 `for` 循环，这可以用关键字 `break` 来完成：

```jldoctest
julia> i = 1;

julia> while true
           println(i)
           if i >= 5
               break
           end
           global i += 1
       end
1
2
3
4
5

julia> for j = 1:1000
           println(j)
           if j >= 5
               break
           end
       end
1
2
3
4
5
```

没有关键字 `break` 的话，上面的 `while` 循环永远不会自己结束，而 `for` 循环会迭代到 1000，这些循环都可以使用 `break` 来提前结束。

在某些场景下，需要直接结束此次迭代，并立刻进入下次迭代，`continue` 关键字可以用来完成此功能：

```jldoctest
julia> for i = 1:10
           if i % 3 != 0
               continue
           end
           println(i)
       end
3
6
9
```

这是一个有点做作的例子，因为我们可以通过否定这个条件，把 `println` 调用放到 `if` 代码块里来更简洁的实现同样的功能。在实际应用中，在 `continue` 后面还会有更多的代码要运行，并且调用 `continue` 的地方可能会有多个。

多个嵌套的 `for` 循环可以合并到一个外部循环，可以用来创建其迭代对象的笛卡尔积：

```jldoctest
julia> for i = 1:2, j = 3:4
           println((i, j))
       end
(1, 3)
(1, 4)
(2, 3)
(2, 4)
```

有了这个语法，迭代变量依然可以正常使用循环变量来进行索引，例如 `for i = 1:n, j = 1:i` 是合法的，但是在一个循环里面使用 `break` 语句则会跳出整个嵌套循环，不仅仅是内层循环。每次内层循环运行的时候，变量（`i` 和 `j`）会被赋值为他们当前的迭代变量值。所以对 `i` 的赋值对于接下来的迭代是不可见的：

```jldoctest
julia> for i = 1:2, j = 3:4
           println((i, j))
           i = 0
       end
(1, 3)
(1, 4)
(2, 3)
(2, 4)
```

如果这个例子给每个变量一个关键字 `for` 来重写，那么输出会不一样：第二个和第四个变量包含 `0`。

## 异常处理

当一个意外条件发生时，一个函数可能无法向调用者返回一个合理的值。在这种情况下，最好让意外条件终止程序并打印出调试的错误信息，或者根据程序员预先提供的异常处理代码来采取恰当的措施。

### 内置的 `Exception`

当一个意外的情况发生时，会抛出 `Exception`。下面列出的内置 `Exception` 都会中断正常的控制流程。

| `Exception`                   |
|:----------------------------- |
| [`ArgumentError`](@ref)       |
| [`BoundsError`](@ref)         |
| [`CompositeException`](@ref)  |
| [`DimensionMismatch`](@ref)   |
| [`DivideError`](@ref)         |
| [`DomainError`](@ref)         |
| [`EOFError`](@ref)            |
| [`ErrorException`](@ref)      |
| [`InexactError`](@ref)        |
| [`InitError`](@ref)           |
| [`InterruptException`](@ref)  |
| `InvalidStateException`       |
| [`KeyError`](@ref)            |
| [`LoadError`](@ref)           |
| [`OutOfMemoryError`](@ref)    |
| [`ReadOnlyMemoryError`](@ref) |
| [`RemoteException`](@ref)     |
| [`MethodError`](@ref)         |
| [`OverflowError`](@ref)       |
| [`Meta.ParseError`](@ref)     |
| [`SystemError`](@ref)         |
| [`TypeError`](@ref)           |
| [`UndefRefError`](@ref)       |
| [`UndefVarError`](@ref)       |
| [`StringIndexError`](@ref)    |

例如，当输入参数为负实数时，[`sqrt`](@ref) 函数会抛出一个 [`DomainError`](@ref) ：

```jldoctest
julia> sqrt(-1)
ERROR: DomainError with -1.0:
sqrt will only return a complex result if called with a complex argument. Try sqrt(Complex(x)).
Stacktrace:
[...]
```

你可能需要根据下面的方式来定义你自己的异常：

```jldoctest
julia> struct MyCustomException <: Exception end
```

### [`throw`](@ref) 函数

我们可以用 [`throw`](@ref) 显式地创建异常。例如，若一个函数只对非负数有定义，当输入参数是负数的时候，可以用 [`throw`](@ref) 抛出一个 [`DomainError`](@ref)。

```jldoctest; filter = r"Stacktrace:(\n \[[0-9]+\].*)*"
julia> f(x) = x>=0 ? exp(-x) : throw(DomainError(x, "argument must be nonnegative"))
f (generic function with 1 method)

julia> f(1)
0.36787944117144233

julia> f(-1)
ERROR: DomainError with -1:
argument must be nonnegative
Stacktrace:
 [1] f(::Int64) at ./none:1
```

注意 [`DomainError`](@ref) 后面不接括号的话不是一个异常，而是一个异常类型。我们需要调用它来获得一个 `Exception` 对象：

```jldoctest
julia> typeof(DomainError(nothing)) <: Exception
true

julia> typeof(DomainError) <: Exception
false
```

另外，一些异常类型会接受一个或多个参数来进行错误报告：

```jldoctest
julia> throw(UndefVarError(:x))
ERROR: UndefVarError: x not defined
```

我们可以仿照 [`UndefVarError`](@ref) 的写法，用自定义异常类型来轻松实现这个机制：

```jldoctest
julia> struct MyUndefVarError <: Exception
           var::Symbol
       end

julia> Base.showerror(io::IO, e::MyUndefVarError) = print(io, e.var, " not defined")
```

!!! note
    错误信息的第一个单词最好用小写。例如：

    `size(A) == size(B) || throw(DimensionMismatch("size of A not equal to size of B"))`

    就比

    `size(A) == size(B) || throw(DimensionMismatch("Size of A not equal to size of B"))`.

    更好。

    但是，有时保留大写首字母是有意义的，例如函数的参数就是大写字母时：

    `size(A,1) == size(B,2) || throw(DimensionMismatch("A has first dimension..."))`.

### 错误

我们可以用 [`error`](@ref) 函数生成一个 [`ErrorException`](@ref) 来中断正常的控制流程。

假设我们希望在计算负数的平方根时让程序立即停止执行。为了实现它，我们可以定义一个挑剔的 [`sqrt`](@ref) 函数，当它的参数是负数时，产生一个错误：

```jldoctest fussy_sqrt; filter = r"Stacktrace:(\n \[[0-9]+\].*)*"
julia> fussy_sqrt(x) = x >= 0 ? sqrt(x) : error("negative x not allowed")
fussy_sqrt (generic function with 1 method)

julia> fussy_sqrt(2)
1.4142135623730951

julia> fussy_sqrt(-1)
ERROR: negative x not allowed
Stacktrace:
 [1] error at ./error.jl:33 [inlined]
 [2] fussy_sqrt(::Int64) at ./none:1
 [3] top-level scope
```

如果另一个函数调用 `fussy_sqrt` 和一个负数, 它会立马返回，
在交互会话中显示错误信息，而不会继续执行调用的函数：

```jldoctest fussy_sqrt; filter = r"Stacktrace:(\n \[[0-9]+\].*)*"
julia> function verbose_fussy_sqrt(x)
           println("before fussy_sqrt")
           r = fussy_sqrt(x)
           println("after fussy_sqrt")
           return r
       end
verbose_fussy_sqrt (generic function with 1 method)

julia> verbose_fussy_sqrt(2)
before fussy_sqrt
after fussy_sqrt
1.4142135623730951

julia> verbose_fussy_sqrt(-1)
before fussy_sqrt
ERROR: negative x not allowed
Stacktrace:
 [1] error at ./error.jl:33 [inlined]
 [2] fussy_sqrt at ./none:1 [inlined]
 [3] verbose_fussy_sqrt(::Int64) at ./none:3
 [4] top-level scope
```

### `try/catch` 语句

通过 `try / catch` 语句，可以测试 Exception 并
优雅处理可能会破坏应用程序的事情。 例如，
在下面的代码中，平方根函数会引发异常。 通过
在其周围放置 `try / catch` 块可以缓解。 您可以选择如何
处理此异常，无论是记录它，返回占位符值还是
就像下面仅打印一句话。 要注意的是
在决定如何处理异常时，使用`try / catch` 块
比使用条件分支处理要慢得多。
以下是使用` try / catch` 块处理异常的更多示例：

```jldoctest
julia> try
sqrt("ten")
catch e
println("You should have entered a numeric value")
end
You should have entered a numeric value
```

`try/catch` 语句允许保存 `Exception` 到一个变量中。在下面这个做作的例子中，如果 `x` 是可索引的，则计算 `x` 的第二项的平方根，否则就假设 `x` 是一个实数，并返回它的平方根：

```jldoctest
julia> sqrt_second(x) = try
           sqrt(x[2])
       catch y
           if isa(y, DomainError)
               sqrt(complex(x[2], 0))
           elseif isa(y, BoundsError)
               sqrt(x)
           end
       end
sqrt_second (generic function with 1 method)

julia> sqrt_second([1 4])
2.0

julia> sqrt_second([1 -4])
0.0 + 2.0im

julia> sqrt_second(9)
3.0

julia> sqrt_second(-9)
ERROR: DomainError with -9.0:
sqrt will only return a complex result if called with a complex argument. Try sqrt(Complex(x)).
Stacktrace:
[...]
```

注意 `catch` 后面的字符会被一直认为是异常的名字，所以在写 `try/catch` 单行表达式时，需要特别小心。下面的代码**不会**在错误的情况下返回 `x` 的值：

```julia
try bad() catch x end
```

正确的做法是在 `catch` 后添加一个分号或者直接换行：

```julia
try bad() catch; x end

try bad()
catch
    x
end
```

`try/catch` 组件的强大之处在于能够将高度嵌套的计算立刻解耦成更高层次地调用函数。有时没有错误产生，但需要能够解耦堆栈，并传值到上层。Julia 提供了 [`rethrow`](@ref)、[`backtrace`](@ref)、[`catch_backtrace`](@ref) 和 [`Base.catch_stack`](@ref) 函数进行更高级的错误处理。

### `finally` 子句

在进行状态改变或者使用类似文件的资源的编程时，经常需要在代码结束的时候进行必要的清理工作（比如关闭文件）。由于异常会使得部分代码块在正常结束之前退出，所以可能会让上述工作变得复杂。`finally` 关键字提供了一种方式，无论代码块是如何退出的，都能够让代码块在退出时运行某段代码。

这里是一个确保一个打开的文件被关闭的例子：

```julia
f = open("file")
try
    # operate on file f
finally
    close(f)
end
```

当控制流离开 `try` 代码块（例如，遇到 `return`，或者正常结束），`close(f)` 就会被执行。如果 `try` 代码块由于异常退出，这个异常会继续传递。`catch` 代码块可以和 `try` 还有 `finally` 配合使用。这时 `finally` 代码块会在 `catch` 处理错误之后才运行。

## [`Task`（协程）](@id man-tasks)

`Task` 是一种允许计算以更灵活的方式被中断或者恢复的流程控制特性。
我们提及它只是为了说明的完整性；详细的介绍参见：[异步编程](@ref man-asynchronous)。
