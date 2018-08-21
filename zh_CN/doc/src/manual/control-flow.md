# 流程控制

Julia 提供了大量的流程控制组件：

  * [复合表达式](@ref man-compound-expressions): `begin` 和 `(;)`。
  * [条件表达式](@ref man-conditional-evaluation): `if`-`elseif`-`else` 和 `?:` (三元运算符)。
  * [短路求值](@ref): `&&`, `||` 和链式比较。
  * [重复执行：循环](@ref man-loops): `while` 和 `for`.
  * [异常处理](@ref): `try`-`catch`, [`error`](@ref) 和 [`throw`](@ref).
  * [Tasks（又名协程）](@ref man-tasks): [`yieldto`](@ref).

最开始的五个流程控制机制是标准的高级编程语言通用的。[`Task`](@ref)不是那么通用：他们提供了非局部的流程控制，可以在暂时中止的计算间进行切换。这是一种强大的组件：Julia 中的异常处理和协同多任务都是使用 Task 实现的。通常的编程并不需要直接使用 Task，但是某些问题可以用 Task 更简单地处理。

## [复合表达式](@id man-compound-expressions)

有时一个表达式能够有序地计算若干子表达式，并返回最后一个子表达式的值作为它的值是很方便的。Julia 有两个组件来完成这个: `begin` 代码块 和 `(;)` 链。这两个复合表达式组件的值都是最后一个子表达式的值。下面是一个`begin` 代码块的例子：

```jldoctest
julia> z = begin
           x = 1
           y = 2
           x + y
       end
3
```

因为这些是非常简短的表达式，它们可以简单地被放到一行里，这也是 `(;)` 链的由来：

```jldoctest
julia> z = (x = 1; y = 2; x + y)
3
```

这个语法在定义简洁的单行函数的时候特别有用，参见 [函数](@ref)。尽管很典型，但是并不要求 `begin` 代码块是多行的，或者 `(;)` 链是单行的：

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

如果表达式 `x < y` 是 `true`，那么对应的代码块被执行；否则判断条件表达式 `x > y` ，如果它是 `true`，对应的代码块被执行；如果没有表达式是 true，`else` 代码块被执行。下面是执行例子：

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
`if`-`elseif`-`else` 组件中的第一个条件表达式为 `true` 时，其他条件表达式才会被执行，当对应的代码块被执行后，其余的表达式或者代码块不会被执行。

`if` 代码块是 "有渗漏的", 也就是说它们没有引入局部作用域。这意味着在 `if` 语句中新定义的变量尽管它们没有在它之前定义过，依然可以在 `if` 代码块之后被使用。所以我们可以定义上面的 `test` 函数为

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

变量 `relation` 在 `if` 代码块中被声明，但是在外部使用。然而，在利用这种行为的时候，要保证那个变量在所有可能的代码路径下都有被定义。下面对以上函数的修改会导致运行时错误

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

`if` 代码块也会返回一个值，这可能对于一些以前使用其他语言的用户来说不是很直观。
它仅仅是被执行的分支中最后一个被执行的语句的返回值。
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

与 C, MATLAB, Perl, Python, 以及 Ruby 不同，但跟 Java ，还有一些别的严谨的类型语言类似, -- 一个条件表达式的值如果不是`true` 或者 `false` 的话，会返回错误:

```jldoctest
julia> if 1
           println("true")
       end
ERROR: TypeError: non-boolean (Int64) used in boolean context
```

这个错误显示条件值有一个错误的类型: [`Int64`](@ref) ，而不是期望的 [`Bool`](@ref).

所谓的 "三元运算符", `?:`, 很类似 `if`-`elseif`-`else` 语法,它需要条件选择依赖于单个表达式的值，而不是依赖大段的代码块的条件执行。它因在很多语言中是唯一一个有三个操作数的运算符而得名：

```julia
a ? b : c
```

在 `?` 之前的表达式 `a`, 是一个条件表达式，三元运算符计算在`:` 之前的表达式 `b`，如果条件`a` 是 `true`，或者 。如果它是 `false`，执行 `:` 后面的表达式 `c` 。注意，`?` 和 `:` 旁边的空格是强制的。类似 `a?b:c` 的表达式不是一个有效的三元表达式（但在`?` 和 `:` 之后的换行是允许的）。

最简单理解这种行为的方式的看一个例子。在上面的例子中，在三个分支中都有调用 `println` : 唯一的选择是打印哪一个字符串。这可以用三元运算符更紧凑地改写。为了更明白。我们先尝试两个选择的版本：

```jldoctest
julia> x = 1; y = 2;

julia> println(x < y ? "less than" : "not less than")
less than

julia> x = 1; y = 0;

julia> println(x < y ? "less than" : "not less than")
not less than
```

如果表达式 `x < y` 为真，整个三元运算符会执行字符串 `"less than"` ，否则执行字符串 `"not less than"`。 原本的三个选择例子需要同时使用多次链式使用三元运算符 ：

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

短路求值非常类似条件求值 。这种行为在多数有`&&` and `||` 布尔运算符地命令式编程语言都可以找到: 在一系列由这些运算符连接的布尔表达式中，为了得到整个链的最终布尔值，仅仅只有最小数量的表达式被计算。 更明确的说，这意味着：

  * 在表达式 `a && b` 中， 子表达式 `b` 仅当 `a` 为 `true` 的时候才会被执行。
  * 在表达式 `a || b` 中，子表达式 `b` 仅在 `a` 为 `false` 的时候才会被执行。

原因是 如果 `a` 是 `false`，无论 `b` 的值是多少，`a && b` 一定是 `false` 。同理, 如果 `a` 是 `true`，无论 `b` 的值是多少，`a || b` 的值一定是 true 。`&&` 和 `||` 都依赖于右边，但是 `&&` 比 `||` 有更高的优先级。这种现象很容易实验：

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

你可以用同样的方式简单地实验不同`&&` 和 `||` 运算符的组合条件下的关联和优先级。

这种行为在Julia中经常被用来作为简短 `if` 语句的替代。
可以用 `<cond> && <statement>` (可读为: <cond> *and then* <statement>)来替换 `if <cond> <statement> end`。 类似的，
可以用 `<cond> || <statement>` (可读为: <cond> *or else* <statement>)来替换 `if ! <cond> <statement> end`.

例如, 可以像这样定义递归阶乘程序：

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

*没有* 短路计算的布尔运算可以用位布尔运算符来完成，见 [数学运算符和初等函数](@ref): `&` 和 `|`。这些是普通的函数，同时也刚好支持中缀运算符语法，但总是计算他们的参数：

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

就像条件表达式中的 `if`, `elseif` 或者三元运算符, the operands of
`&&` 或者 `||` 一定是布尔值 (`true` 或者 `false`)。在条件链中，
除最后一项外，使用一个非布尔值是错误的：

```jldoctest
julia> 1 && true
ERROR: TypeError: non-boolean (Int64) used in boolean context
```

另一方面，在条件链的末尾可以用任意类型的表达式。根据前面的条件，它会被执行并返回：

```jldoctest
julia> true && (x = (1, 2, 3))
(1, 2, 3)

julia> false && (x = (1, 2, 3))
false
```

## [重复计算：循环](@id man-loops)

有两个用于重复计算表达式的组件：`while` 循环和 `for` 循环。下面是一个 `while` 循环的例子：

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

`while` 循环计算条件表达式（例子中为 `i <= 5`），只要它为 `true`，就一直执行`while`  循环的主体部分。如果当`while` 循环第一次执行时，条件表达式为 `false`，那么主体的代码就一次也不会被执行。

`for` 循环使得常见的重复计算语句更容易写。
因为类似之前 `while` 循环中的向上和向下计数如此常见，可以用`for` 循环更简明地表达：

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

这里的 `1:5` 是一个范围对象, 代表数字 1, 2, 3, 4, 5的序列。`for` 循环在这些值之中迭代，对每一个变量`i` 进行赋值。 `for` 循环与之前`while` 循环的一个非常重要区别是，变量可见时的作用域。如果变量 `i` 没有在另一个作用域里引入，在 `for` 循环内，它就只在`for` 内部可见，在外部和后面均不可见。你需要一个新的交互式会话实例或者一个新的变量名来测试这个：

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

参见 [变量作用域](@ref scope-of-variables) 中对变量作用域的详细解释和它在 Julia 中如何工作。

一般来说，`for` 循环构造可以在任一个容器中迭代。 在这个时候，相比`=`，另外的（但完全相同）关键字 `in` 或者 `∈` 更常用，因为它使得代码更清晰：

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

在手册后面的章节中会介绍和讨论各种不同的迭代容器（比如, [多维数组](@ref man-multi-dim-arrays)）。

有时在测试条件不成立之前终止一个`while` 的重复，或者当迭起对象的结尾之前停止一个 `for` 循环的迭代会更方便。这可以用关键字 `break` 来完成：

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

没有关键字 `break` 的话，上面的 `while` 循环永远不会自己结束，`for` 循环会迭代到1000。使用`break` 的话，这些循环都会提前结束。

在其他的环境下，能够结束迭代，立刻进入下一步会更灵活。`continue` 关键字可以完成这个：

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

这是一个有点做作的例子，因为我们可以通过否定这个条件，把 `println` 调用放到 `if` 代码块里，更清晰地得到同样的结果。在更实际的应用中，在 `continue` 后面还会有更多的代码要运行，从调用`continue` 开始还有多个。

多个嵌套的 `for` 循环可以合并到一个外部循环，形成它的迭代对象的笛卡尔积：

```jldoctest
julia> for i = 1:2, j = 3:4
           println((i, j))
       end
(1, 3)
(1, 4)
(2, 3)
(2, 4)
```

有了这个语法，迭代变量依然参考外部循环变量； 例如 `for i = 1:n, j = 1:i` 是合法的。但是在一个循环里面的 `break` 语句会推出整个嵌套循环，不仅仅是内层循环。每次内层循环运行的时候， 变量 (`i` 和 `j`) 会被赋值为他们当前的迭代变量值。所以对 `i` 的赋值对于接下来的迭代是不可见的：

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

当一个意外条件发生时，一个函数可能不能给调用函数返回一个合理的值。在这种情况下，最好让意外条件终止程序，同时打印出调试的错误信息，或者当程序提供了代码来处理这些意外的情况，那么允许代码采取相应的对策。

### 内置的 `Exception`

当一个意外的情况发生时，会抛出`Exception`s。下面列出的内置 `Exception`s 都会中断正常的控制流程。

| `Exception`                   |
|:----------------------------- |
| [`ArgumentError`](@ref)       |
| [`BoundsError`](@ref)         |
| [`CompositeException`](@ref)  |
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

例如，  [`sqrt`](@ref) 函数抛出 [`DomainError`](@ref) 如果参数为负实数：

```jldoctest
julia> sqrt(-1)
ERROR: DomainError with -1.0:
sqrt will only return a complex result if called with a complex argument. Try sqrt(Complex(x)).
Stacktrace:
[...]
```

你可以用下面的方式定义自己的异常：

```jldoctest
julia> struct MyCustomException <: Exception end
```

### [`throw`](@ref) 函数

可以用[`throw`](@ref)显式地创建异常。例如，一个函数只对非负数有定义，如果参数是负数地时候，可以写[`throw`](@ref) 一个 [`DomainError`](@ref)。

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

注意 [`DomainError`](@ref) 没有括号的时候不是一个异常，而是一个异常的类型。
它需要被调用来获得一个`Exception` 对象：

```jldoctest
julia> typeof(DomainError(nothing)) <: Exception
true

julia> typeof(DomainError) <: Exception
false
```

另外，一些用于错误报告的异常类型接受一个或者多个参数：

```jldoctest
julia> throw(UndefVarError(:x))
ERROR: UndefVarError: x not defined
```

这个机制可以很轻易地依据 [`UndefVarError`](@ref) 的写法，用来自定义异常类型：

```jldoctest
julia> struct MyUndefVarError <: Exception
           var::Symbol
       end

julia> Base.showerror(io::IO, e::MyUndefVarError) = print(io, e.var, " not defined")
```

!!! 注意：当写一个错误信息的时候，把第一个单词小写更好。例如，`size(A) == size(B) || throw(DimensionMismatch("size of A not equal to size of B"))`

   优于

    `size(A) == size(B) || throw(DimensionMismatch("Size of A not equal to size of B"))`.

   但是，有时第一个字母大写更合理，例如如果函数的一个参数
    是一个大写字母：`size(A,1) == size(B,2) || throw(DimensionMismatch("A has first dimension..."))`。

### 错误

[`error`](@ref) 函数用来产生一个 [`ErrorException`](@ref) 来中断正常的控制流程。

假设我们希望当计算一个负数的平方根的时候，停止执行。为了实现它，我们可以定义一个挑剔的 [`sqrt`](@ref) 函数，当它的参数是负数时，产生一个错误：

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

`try/catch` 语句允许测试 `Exception`s。 例如，一个自定义的平方根函数可以使用`Exception`s，按照需要自动调用实数或者复数平方根：

```jldoctest
julia> f(x) = try
           sqrt(x)
       catch
           sqrt(complex(x, 0))
       end
f (generic function with 1 method)

julia> f(1)
1.0

julia> f(-1)
0.0 + 1.0im
```

值得注意的时在实际计算这个函数的时候，需要比较 `x` 与0，而不是捕获一个异常。
这个异常比简单地比较和分支慢得多。

`try/catch` 语句允许保存 `Exception` 到一个变量中。下面的做作的例子中，如果 `x` 是可索引的，计算`x` 的第二项的平方根，否则假设 `x` 是一个实数，并返回它的平方根：

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

注意 `catch` 后面的字符会被一直认为是异常的名字，所以在写 `try/catch` 单行表达式时，需要特别小心。下面的代码*不会* 在错误的情况下，返回 `x` 的值：

```julia
try bad() catch x end
```

正确的是在`catch`后使用一个分号或者插入一个换行：

```julia
try bad() catch; x end

try bad()
catch
    x
end
```

`try/catch` 组件的强大之处在于能够将高度嵌套的计算立刻解耦成更高层次地调用函数。有时没有错误产生，但需要能够解耦堆栈，并传值到上层。Julia 提供了 [`rethrow`](@ref), [`backtrace`](@ref) 和 [`catch_backtrace`](@ref) 函数进行更高级的错误处理。

### `finally` 子句

在进行状态改变或者使用类似文件的资源的编程时，经常需要在代码结束的时候进行必要的清理工作（比如关闭文件）。由于异常会使得部分代码块在正常结束之前退出，可能使得工作变得复杂。`finally`关键字提供了一种方式，使得无论特定代码块如何退出，代码块中的部分代码都能运行。

例如，这里是我们如何确保一个打开的文件被关闭：

```julia
f = open("file")
try
    # operate on file f
finally
    close(f)
end
```

当控制流离开 `try` 代码块（例如，遇到 `return`，或者正常结束），`close(f)` 就会被执行。如果 `try` 代码块由于异常退出，这个异常会继续传递。`catch` 代码块可以和 `try` 还有 `finally` 配合使用。这时 `finally` 代码块会在 `catch` 处理错误之后才运行。

## [`Task` (又名 协程)](@id man-tasks)

`Task` 是一种允许计算以更灵活的方式被中断或者恢复的流程控制特性。这个特性有时被叫做其它名字，例如 对称协程（symmetric coroutines），轻量级线程（lightweight threads），合作多任务处理（cooperative multitasking），或者单次续延（one-shot continuations）。

当一部分计算任务（在实际中，执行一个特定的函数）可以被设计成一个 [`Task`](@ref) 时，就可以中断它，并切换到另一个 [`Task`](@ref)。原本的 [`Task`](@ref) 可以恢复到它上次中断的地方，并继续执行。第一眼感觉，这个跟函数调用很类似。但是有两个关键的区别。首先，是切换 `Task` 并不使用任何空间，所以任意数量的 `Task` 切换都不会使用调用堆栈（call stack）。其次，`Task` 可以以任意次序切换，而不像函数调用那样，被调用函数必须在返回主调用函数之前结束执行。

这种流程控制的方式使得解决一个特定问题更简便。在一些问题中，多个需求并不是有函数调用来自然连接的；在需要完成的工作之间并没有明确的“调用者”或者“被调用者”。一个例子是生产-消费问题，一个复杂的流程产生数据，另一个复杂的流程消费他们。消费者不能简单的调用生产函数来获得一个值，因为生产者可能有更多的值需要创建，还没有准备好返回。用 `Task` 的话，生产者和消费者能同时运行他们所需要的任意时间，根据需要传递值回来或者过去。

Julia 提供了 [`Channel`](@ref) 机制来解决这个问题。 一个[`Channel`](@ref) 是一个先进先出的队列，允许多个 `Task` 对它可以进行读和写。

让我们定义一个生产者任务，调用 [`put!`](@ref) 来生产数值。为了消费数值，我们需要对生产者开始新任务进行排班。可以使用一个特殊的 [`Channel`](@ref) 组件来运行一个与其绑定的 `Task`，它能接受单参数函数作为其参数，然后可以用 [`take!`](@ref) 从 [`Channel`](@ref) 对象里不断地提取值：

```jldoctest producer
julia> function producer(c::Channel)
           put!(c, "start")
           for n=1:4
               put!(c, 2n)
           end
           put!(c, "stop")
       end;

julia> chnl = Channel(producer);

julia> take!(chnl)
"start"

julia> take!(chnl)
2

julia> take!(chnl)
4

julia> take!(chnl)
6

julia> take!(chnl)
8

julia> take!(chnl)
"stop"
```

一种思考这种行为地方式是，`生产者`能够多次返回。在两次调用 [`put!`](@ref) 之间，生产者的执行是被中断的，消费者接管控制。

返回的 [`Channel`](@ref) 可以被用作一个 `for` 循环的迭代对象，循环变量可以是所有产生的值。当 [`Channel`](@ref) 关闭时，循环被终止。

```jldoctest producer
julia> for x in Channel(producer)
           println(x)
       end
start
2
4
6
8
stop
```

注意我们并不需要显式地在生产者中关闭 [`Channel`](@ref)。这是因为 [`Channel`](@ref) 对 [`Task`](@ref) 的绑定同时也意味着 `Channel` 的生命周期与绑定的 `Task` 一致。当 `Task` 结束时，`Channel` 对象会自动关闭。多个 `Channel` 可以绑定到一个 `Task`，反之亦然。

尽管 [`Task`](@ref) 的构造函数只能接受一个“无参函数”，但 [`Channel`](@ref) 方法会创建一个与 `Channel` 绑定的 `Task`，并令其可以接受 [`Channel`](@ref) 类型的单参数函数。一个通用模式是对生产者参数化，此时需要一个部分函数应用来创建一个无参，或者单参的[匿名函数](@ref man-anonymous-functions)。

对于 [`Task`](@ref) 对象，可以直接用，也可以为了方便用宏。

```julia
function mytask(myarg)
    ...
end

taskHdl = Task(() -> mytask(7))
# or, equivalently
taskHdl = @task mytask(7)
```

为了安排更高级的工作分配模式，[`bind`](@ref) 和 [`schedule`](@ref) 可以与 [`Task`](@ref) 和 [`Channel`](@ref)构造函数配合使用，显式地连接一些 `Channel` 和生产者或消费者 `Task`。

注意目前 Julia 的 `Task` 并不分配到或者运行在不同的 CPU 核心上。真正的内核进程将在 [分布式计算](@ref) 进行讨论。

### `Task` 相关的核心操作

让我们来学习底层构造函数 [`yieldto`](@ref) 来理解 [`Task`](@ref) 是如何切换工作的。`yieldto(task,value)` 会中断当前的 `Task`，并切换到特定的 `Task`，并且 `Task` 的最后一次 [`yieldto`](@ref) 调用会有特定的`返回值`。注意 [`yieldto`](@ref) 是唯一一个需要用任务类型的流程控制的操作，仅需要切换到不同的 `Task`，而不需要调用或者返回。这也就是为什么这个特性会被叫做“对称协程（symmetric coroutines）”；每一个 `Task` 以相同的机制进行切换或者被切换。

[`yieldto`](@ref) 功能强大，但大多数 `Task` 的使用都不会直接调用它。思考为什么会这样。如果你切换当前 `Task`，你很可能会在某个时候想切换回来。但知道什么时候切换回来和那个 `Task` 负责切换回来需要大量的协调。例如，[`put!`](@ref) 和 [`take!`](@ref) 是阻塞操作，当在渠道环境中使用时，维持状态以记住消费者是谁。不需要人为地记录消费 `Task`，正是使得 [`put!`](@ref) 比底层 [`yieldto`](@ref) 易用的原因。

除了 [`yieldto`](@ref) 之外，也需要一些其它的基本函数来更高效地使用 `Task`。

  * [`current_task`](@ref) 获取当前运行 `Task` 的索引。
  * [`istaskdone`](@ref) 查询一个 `Task` 是否退出.
  * [`istaskstarted`](@ref) 查询一个 `Task` 是否已经开始运行。
  * [`task_local_storage`](@ref) 操纵针对当前 `Task` 的键值存储。

### `Task` 和事件

多数 `Task` 切换是在等待如 I/O 请求的事件，由 Julia Base 里的调度器执行。调度器维持一个可运行 `Task` 的队列，并执行一个事件循环，来根据例如收到消息等外部事件来重启 `Task`。

等待一个事件的基本函数是 [`wait`](@ref)。很多对象都实现了 [`wait`](@ref) 函数；例如，给定一个 `Process` 对象，[`wait`](@ref) 将等待它退出。[`wait`](@ref) 通常是隐式的，例如，[`wait`](@ref) 可能发生在调用 [`read`](@ref) 时等待数据可用。

在所有这些情况下，[`wait`](@ref) 最终会操作一个 [`Condition`](@ref) 对象，由它负责排队和重启 `Task`。当 `Task` 在一个 [`Condition`](@ref) 上调用 [`wait`](@ref) 时，该 Task 就被标记为不可执行，加到条件的队列中，并切回调度器。调度器将选择另一个 `Task` 来运行，或者阻止外部事件的等待。如果所有运行良好，最终一个事件处理器将在这个条件下调用 [`notify`](@ref)，使得等待该条件的 `Task` 又变成可运行。

调用 [`Task`](@ref) 显式创建的 `Task` 对于调度器时来说一开始时不知道的。如果你希望的话，你可以使用 [`yieldto`](@ref) 来人为管理 `Task`。但是当这种 `Task` 等待一个事件时，正如期待的那样，当事件发生时，它将自动重启。也能由调度器在任何可能的时候运行一个 `Task`，而无需等待任何事件。这可以调用 [`schedule`](@ref)，或者使用 [`@async`](@ref) 宏（见 [并行计算](@ref)中的详细说明）。

### `Task` 的状态

`Task` 由 `state` 属性来描述他们的执行状态。[`Task`](@ref) `state` 的属性有：

| 符号      | 含义                                            |
|:----------- |:-------------------------------------------------- |
| `:runnable` | 正在运行，或者可以被切换到  |
| `:waiting`  | 被阻塞，等待一个特定事件               |
| `:queued`   | 处在调度器中的运行队列中，即将被重启 |
| `:done`     | 成功结束执行                    |
| `:failed`   | 以一个没被捕获的异常结束                |
