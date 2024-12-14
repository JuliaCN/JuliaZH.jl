# [变量作用域](@id scope-of-variables)

变量的 **作用域** 是代码的一个区域，在这个区域中这个变量是可访问的。给变量划分作用域有助于解决变量命名冲突。这个概念是符合直觉的：两个函数可能同时都有叫做 `x` 的参量，而这两个 `x` 并不指向同一个东西。
相似地，也有很多其他的情况，代码的不同块会使用同样名字，但并不指向同一个东西。相同的变量名是否指向同一个东西的规则被称为作用域规则；这一节会详细地把这个规则讲清楚。

语言中的某些结构会引入*作用域块*，这是可以成为一些变量集合的作用域的代码区域。一个变量的作用域不是源代码行的任意集合；相反，它始终与这些块之一关系密切。在 Julia 中主要有两种作用域，*全局作用域* 与 *局部作用域*，后者可以嵌套。 在 Julia 中还存在引入“硬作用域”的构造和只引入“软作用域”的构造之间的区别，这影响到是否允许以相同的名称[遮蔽](https://en.wikipedia.org/wiki/Variable_shadowing)全局变量。

### [作用域结构](@id man-scope-table)

引入作用域块的结构有：

| 结构 | 作用域类型 | 允许使用在 |
|:----------|:-----------|:---------------|
| [`module`](@ref), [`baremodule`](@ref) | 全局 | 全局 |
| [`struct`](@ref) | 局部（软） | 全局 |
| [`for`](@ref), [`while`](@ref), [`try`](@ref try) | 局部（软） | global, local |
| [`macro`](@ref) | 局部（硬） | 全局 |
| 函数， [`do`](@ref) 语句块, [`let`](@ref)语句块, 数组推导, 生成器 | 局部（硬） | global, local |

值得注意的是，这个表内没有的是 [begin 块](@ref man-compound-expressions)和[ if 块](@ref man-conditional-evaluation)，这两个块**不会**引进新的作用域块。这两种作用域遵循的规则有点不一样，会在下面解释。

Julia 使用[词法作用域](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scope_vs._dynamic_scope)，也就是说一个函数的作用域不继承自调用了函数的调用者作用域，而继承自该函数定义处作用域。举例如下，`foo` 中的 `x` 指向模块 `Bar` 的全局作用域中 `x`。

```jldoctest moduleBar
julia> module Bar
           x = 1
           foo() = x
       end;
```

而非调用了 `foo` 的作用域中的 `x`：
```jldoctest moduleBar
julia> import .Bar

julia> x = -1;

julia> Bar.foo()
1
```

因此**词法作用域**意味着，某段代码内某变量的指向只从它出现之处就可以推断出来，而不依赖于程序的执行方式。在嵌套的作用域结构里，内层作用域能”看“到所有外层作用域内变量。相对地，外层作用域不能看到内层作用域的变量。

## 全局作用域

每个模块会引进一个新全局作用域，与其他所有模块的全局作用域分开；无所不包的全局作用域不存在。
模块可以把其他模块的变量引入到它的作用域中，通过[using 或者 import](@ref modules)语句或者通过点符号这种有资格的通路，
也就是说每个模块都是所谓的*命名空间*或者关联着含值的名字的第一类数据结构。

If a top-level expression contains a variable declaration with keyword `local`,
then that variable is not accessible outside that expression.
The variable inside the expression does not affect global variables of the same name.
An example is to declare `local x` in a `begin` or `if` block at the top-level:

```jldoctest
julia> x = 1
       begin
           local x = 0
           @show x
       end
       @show x;
x = 0
x = 1
```

注意交互式提示行（即REPL）是在模块`Main`的全局作用域中。

## [Local Scope](@id local-scope)

A new local scope is introduced by most code blocks (see above [table](@ref
man-scope-table) for a complete list). If such a block is syntactically nested
inside of another local scope, the scope it creates is nested inside of all the
local scopes that it appears within, which are all ultimately nested inside of
the global scope of the module in which the code is evaluated. Variables in
outer scopes are visible from any scope they contain — meaning that they can be
read and written in inner scopes — unless there is a local variable with the
same name that "shadows" the outer variable of the same name. This is true even
if the outer local is declared after (in the sense of textually below) an inner
block. When we say that a variable "exists" in a given scope, this means that a
variable by that name exists in any of the scopes that the current scope is
nested inside of, including the current one.

Some programming languages require explicitly declaring new variables before
using them. Explicit declaration works in Julia too: in any local scope, writing
`local x` declares a new local variable in that scope, regardless of whether
there is already a variable named `x` in an outer scope or not. Declaring each
new variable like this is somewhat verbose and tedious, however, so Julia, like
many other languages, considers assignment to a variable name that doesn't
already exist to implicitly declare that variable. If the current scope is
global, the new variable is global; if the current scope is local, the new
variable is local to the innermost local scope and will be visible inside of
that scope but not outside of it. If you assign to an existing local, it
_always_ updates that existing local: you can only shadow a local by explicitly
declaring a new local in a nested scope with the `local` keyword. In particular,
this applies to variables assigned in inner functions, which may surprise users
coming from Python where assignment in an inner function creates a new local
unless the variable is explicitly declared to be non-local.

Mostly this is pretty intuitive, but as with many things that behave
intuitively, the details are more subtle than one might naïvely imagine.

一些编程语言需要在使用新变量之前显式声明它们。显式声明也适用于 Julia：在任何局部作用域中，编写 `local x` 都会在该作用域中声明一个新的局部变量，无论外部作用域中是否已经存在名为 `x` 的变量。像这样声明每个新变量有点冗长乏味，但是，与许多其他语言一样，Julia 考虑对不存在的变量名称进行赋值以隐式声明该变量。如果当前作用域是全局的，则新变量是全局的；如果当前作用域是局部的，则新变量对最内部的局部作用域是局部的，并且在该作用域内可见，但在该作用域外不可见。如果你给现有的局部变量赋值，它_总是_更新现有的局部变量：你只能通过使用 `local` 关键字在嵌套范围内显式声明新的局部变量来隐藏原局部变量。特别是，这适用于在内部函数中分配的变量，这可能会让来自 Python 的用户感到惊讶，其中内部函数中的赋值会创建一个新的局部变量，除非该变量被明确声明为非局部变量。

大多数情况下，这是非常直观的，但与许多直觉行为一样，细节比人们天真地想象的要微妙得多。

当 `x = <value>` 出现在某局部作用域，Julia 根据赋值表达式出现位置、 `x` 在此处已经引用的内容，采取如下规则确定表达式的意义：

1. **现存的局部变量：**如果 `x` **已经是一个局部变量**，那现存的局部变量 `x` 将被
   赋值；

2. **硬作用域：如果 `x` 还*不是局部变量*并且赋值发生的作用域结构是硬作用域（即在 `let` 语句块、函数体、宏、推导式或生成器中），则会在赋值作用域中创建一个名为 `x` 的新局部变量；

3. **软作用域：**如果 `x` **并非已经是局部变量**，并且所有包含
   此次赋值的作用域结构是软作用域（循环、`try`/`catch` 块、或者 `struct` 块），
   最后行为取决于全局变量 `x` 是否被定义：
   * 如果全局变量 `x` 是**未定义**，最终此次赋值会在该作用域创建一个名为 `x` 的新局部变量
     ；
   * 如果全局变量 `x` 是**已定义**，此次赋值会被认为是有歧义的：
     * 在**非交互**的上下文（文件、eval）中，会打印一个有歧义警告，同时创建一个新
       局部变量；
     * 在**交互**的上下文（REPL, notebooks）中，会向全局变量 `x` 赋值。

你或许注意到，当某隐性局部变量（比如未经 `local x` 声明）遮掩某全局变量，非交互的上下文中硬作用域和软作用域有相同行为，除了会输出警告。方便起见，交互的上下文遵从一套更复杂的启发式规则。下面的例子将会深入讲解。

既然你知道这个规则，那就看看一些例子。每个例子都是一个新的REPL会话中进行的，因此每个片段中唯一的全局变量就是在该代码块中分配的全局变量。

我们将从一个良好且明确的情况开始——在一个硬作用域内赋值，在这个情况下是一个函数体，当同名的局部变量不存在时：

```jldoctest
julia> function greet()
           x = "hello" # new local
           println(x)
       end
greet (generic function with 1 method)

julia> greet()
hello

julia> x # global
ERROR: UndefVarError: `x` not defined
```

在 `greet` 函数内部，赋值 `x = "hello"` 导致 `x` 成为函数作用域中的一个新局部变量。 有两个相关的事实：赋值发生在局部作用域内，并且没有现有的局部 `x` 变量。 由于 `x` 是局部的，所以是否存在名为 `x` 的全局变量并不重要。 例如，我们在定义和调用 `greet` 之前定义了 `x = 123`：

```jldoctest
julia> x = 123 # global
123

julia> function greet()
           x = "hello" # new local
           println(x)
       end
greet (generic function with 1 method)

julia> greet()
hello

julia> x # global
123
```

由于 `greet` 中的 `x` 是局部的，全局 `x` 的值（或缺少值）不会受到调用 `greet` 的影响。 硬作用域规则不关心名为 `x` 的全局变量是否存在：在硬作用域中对 `x` 的赋值是局部的（除非 `x` 被声明为全局的）。

我们将考虑的下一个明确的情况是已经有一个名为`x`的局部变量，在这种情况下，`x = 1`总是赋值给这个现有的局部`x`。 
无论赋值发生在同一局部作用域、同一函数体的内部局部作用域，还是嵌套在另一个函数内部的函数体（也称为 [闭包](https://en.wikipedia.org/wiki/Closure_(computer_programming))）。

我们将使用 `sum_to` 函数，它计算从 1 到 `n` 的整数之和，例如：

```julia
function sum_to(n)
    s = 0 # new local
    for i = 1:n
        s = s + i # assign existing local
    end
    return s # same local
end
```

与前面的示例一样，在 `sum_to` 函数先对 `s` 的第一次赋值导致 `s` 成为函数体中的一个新局部变量。 `for` 循环在函数作用域内有自己的内部局部作用域。 在 `s = s + i` 出现的地方，`s` 已经是一个局部变量，所以赋值更新了现有的 `s` 而不是创建一个新的局部变量。 我们可以通过在 REPL 中调用 `sum_to` 来测试：

```jldoctest
julia> function sum_to(n)
           s = 0 # new local
           for i = 1:n
               s = s + i # assign existing local
           end
           return s # same local
       end
sum_to (generic function with 1 method)

julia> sum_to(10)
55

julia> s # global
ERROR: UndefVarError: `s` not defined
```

由于 `s` 是函数 `sum_to` 的局部变量，调用该函数对全局变量 `s` 没有影响。 我们还可以看到，`for` 循环中的更新 `s = s + i` 必须更新由初始化 `s = 0` 创建的相同 `s`，因为我们得到了整数 1 到 10 的正确总和 55。

让我们通过编写一个稍微详细一点的变体来深入了解一下 `for` 循环体有自己的作用域，我们将其称为 `sum_to_def`，其中，在更新 `s` 之前，我们将和 `s + i` 保存在一个变量中` t` ：

```jldoctest
julia> function sum_to_def(n)
           s = 0 # new local
           for i = 1:n
               t = s + i # new local `t`
               s = t # assign existing local `s`
           end
           return s, @isdefined(t)
       end
sum_to_def (generic function with 1 method)

julia> sum_to_def(10)
(55, false)
```

这个版本像先前一样返回 `s`，但它也使用 `@isdefined` 宏返回一个布尔值，指示是否在函数的最外层局部作用域中定义了一个名为 `t` 的局部变量。 正如你所看到的，在 `for` 循环体之外没有定义 `t`。 这又是因为硬作用域规则：由于对 `t` 的赋值发生在一个函数内部，这引入了一个硬作用域，赋值导致 `t` 在它出现的局部作用域中成为一个新的局部变量，即循环体内部。 即使有一个名为 `t` 的全局变量，它也没有任何区别——硬作用域规则不受全局作用域中的任何内容的影响。

请注意，for 循环体的局部作用域与内部函数的局部作用域没有区别。 这意味着我们可以重写此示例，以便将循环体实现为对内部辅助函数的调用，并且其行为方式相同：

```jldoctest
julia> function sum_to_def_closure(n)
           function loop_body(i)
               t = s + i # new local `t`
               s = t # assign same local `s` as below
           end
           s = 0 # new local
           for i = 1:n
               loop_body(i)
           end
           return s, @isdefined(t)
       end
sum_to_def_closure (generic function with 1 method)

julia> sum_to_def_closure(10)
(55, false)
```

这个例子说明了几个要点：

1. 内部函数作用域就像任何其他嵌套的局部作用域一样。 特别是，如果一个变量已经是内部函数之外的局部变量，并且你在内部函数中为其赋值，则外部局部变量会被更新。
    
    

2. 外部的局部变量的定义是否发生在更新位置的下方并不重要，规则保持不变。在解析内部的局部变量含义之前，解析整个封闭局部作用域并确定其局部变量。
    
    

这种设计意味着你通常可以将代码移入或移出内部函数而不改变其含义，这给使用闭包语言中的许多常见习语提供了便利。（参见 [do blocks](@ref Do-Block-Syntax-for-Function-Arguments))。

让我们继续讨论软作用域规则涵盖的一些更模糊的情况。 我们将通过将 `gree`t 和 `sum_to_def `函数的主体提取到软作用域上下文中来探索这一点。 首先，让我们将 `greet` 的主体放在一个 `for` 循环中——它是软的，而不是硬的——并在 REPL 中运行：

```jldoctest
julia> for i = 1:3
           x = "hello" # new local
           println(x)
       end
hello
hello
hello

julia> x
ERROR: UndefVarError: `x` not defined
```

由于在执行`for`循环时未定义全局变量`x`，因此软作用域规则的第一个子句适用，并且`x`被创建为`for`循环内的局部变量，因此循环执行完后全局变量`x`一直没有定义 。 接下来，让我们考虑提取到全局作用域内的 `sum_to_def` 的函数体，将其参数固定为 `n = 10`

```julia
s = 0
for i = 1:10
    t = s + i
    s = t
end
s
@isdefined(t)
```

这段代码有什么作用？ 提示：这是一个小把戏。 答案是“视情况而定”。 如果此代码以交互方式输入，则其行为方式与在函数体中的行为方式相同。 但是如果代码出现在文件中，它会打印一个歧义警告并抛出一个未定义的变量错误。 让我们先看看它在 REPL 中的情况：

```jldoctest
julia> s = 0 # global
0

julia> for i = 1:10
           t = s + i # new local `t`
           s = t # assign global `s`
       end

julia> s # global
55

julia> @isdefined(t) # global
false
```

REPL 内行为接近于函数体内，决定循环内部的赋值是分配给一个全局变量还是创建新的局部变量，取决于是否定义了具有该名称的全局变量。 如果存在同名的全局变量，则赋值会更新它。 如果不存在全局变量，则赋值会创建一个新的局部变量。 在这个例子中，我们看到两种情况都在起作用：

* 没有名为 `t` 的全局变量，因此 `t = s + i` 创建了一个新的 `t`，它是 `for` 循环的局部变量；
* 有一个名为 `s` 的全局变量，因此将 `s = t` 赋值给它。

第二个情况解释了为什么循环的执行会改变 `s` 的全局值，第一个情况解释了为什么在循环执行后 `t` 仍未定义。 现在，让我们尝试运行相同的代码，就像它在文件中一样：

```jldoctest
julia> code = """
       s = 0 # global
       for i = 1:10
           t = s + i # new local `t`
           s = t # new local `s` with warning
       end
       s, # global
       @isdefined(t) # global
       """;

julia> include_string(Main, code)
┌ Warning: Assignment to `s` in soft scope is ambiguous because a global variable by the same name exists: `s` will be treated as a new local. Disambiguate by using `local s` to suppress this warning or `global s` to assign to the existing global variable.
└ @ string:4
ERROR: LoadError: UndefVarError: `s` not defined
```

这里我们使用 [`include_string`](@ref) 来评估 `code`，就好像它是文件的内容一样。 我们也可以将 `code` 保存到一个文件中，然后对该文件调用 `include`——结果是一样的。 如你所见，这与在 REPL 中评估相同代码的行为完全不同。 让我们分解一下这里发生的事情：

* 在循环运行之前，全局 `s` 被定义为值 `0`
* 赋值 `s = t` 发生在软作用域中——任何函数体或其他硬作用域结构之外的 `for` 循环
   
* 因此软作用域规则的第二个子句适用，并且分配不明确，因此发出警告
   
* 继续执行，使 `s` 成为 `for` 循环体中的局部作用域
* 由于 `s` 是 `for` 循环的局部变量，所以在计算 `t = s + i` 时它是未定义的，从而导致错误
* 求值到此就结束了，但如果到了 `s` 和 `@isdefined(t)`，它将返回 `0` 和 `false`。

这展示了作用域的一些重要方面：在一个作用域中，每个变量只能有一个含义，而该含义的确定与表达式的顺序无关。 循环中表达式 `s = t` 的存在导致 `s` 在循环中是局部的，这意味着当它出现在 `t = s + i` 的右侧时它也是局部的，即使该表达式首先出现并首先计算。 有人可能会想象循环第一行上的 `s` 可以是全局的，而循环第二行上的 `s` 是局部的，但这是不可能的，因为这两行在同一个作用域块中并且每个变量 在给定的作用域内只能有一种含义。

#### [在软作用域](@id on-soft-scope)

我们现在已经涵盖了所有局部作用域规则，但在结束本节之前，也许应该说几句关于为什么在交互式和非交互式上下文中处理模糊软作用域的情况不同。 人们可以问两个明显的问题：

1. 为什么不都像REPL那样？
2. 为什么不都表现得像在文件中那样？并跳过警告？

在 Julia ≤ 0.6 的版本中，所有全局作用域确实像当前的 REPL 一样工作：当 `x = <value>` 发生在循环中（或 `try`/`catch` ，`struct`内）但在函数体（或 `let` 语句块或推导式）之外时，它根据是否定义了一个名为 `x` 的全局变量来决定 `x` 是否应该是循环的局部变量。这种行为具有直观和方便的优点，因为它尽可能接近函数体内部的行为。特别是，当尝试调试函数时，它可以轻松地在函数体和 REPL 之间来回移动代码。 但是，它有一些缺点。首先，这是一种相当复杂的行为：多年来，许多人对这种行为感到困惑，并抱怨说它既复杂又难以解释和理解。这是有道理的。其次，可以说更糟的是，它不利于“大规模”编程。 当你在这样的地方看到一小段代码时，很清楚发生了什么：

```julia
s = 0
for i = 1:10
    s += i
end
```

显然，代码的意图是修改现有的全局变量`s`。 这还能是什么意思？ 然而，并非所有现实世界的代码都如此简短或清晰。 我们发现像下面这样的代码经常出现：

```julia
x = 123

# much later
# maybe in a different file

for i = 1:10
    x = "hello"
    println(x)
end

# much later
# maybe in yet another file
# or maybe back in the first one where `x = 123`

y = x + 234
```

我们非常不清楚这里应该发生什么。 由于 `x + "hello"` 是一个方法错误，似乎意图是让 `x` 在 `for` 循环中是局部的。 但是运行时值和碰巧存在的方法不能用于确定变量的范围。 对于 Julia ≤ 0.6 的行为，尤其令人担忧的是，有人可能先编写了 `for` 循环，让它工作得很好，但后来当其他人在远处添加了一个新的全局时——可能是在不同的文件——代码突然改变了含义，要么中断，要么更糟糕的是，默默地做执行了错误的命令。 这种 [“幽灵般的远距离动作”](https://en.wikipedia.org/wiki/Action_at_a_distance_(computer_programming)) 是好的编程语言设计应该防止的。

因此，在 Julia 1.0 中，我们简化了作用域的规则：在任何局部作用域中，对一个还不是局部变量的名称进行赋值会创建一个新的局部变量。 这完全消除了软作用域的概念，并消除了幽灵行为的可能性。 由于移除了软作用域，我们发现并修复了大量错误，证明我们选择摆脱它是正确的。我们有很多的欣喜！ 嗯，不，不是真的。 因为有些人很生气，他们现在不得不写：

```julia
s = 0
for i = 1:10
    global s += i
end
```

你看到那里的`global`注解了吗？非常令人讨厌。 显然，这种情况是不能容忍的。但更严重的是，这种需要`global`顶层代码的情况有两个主要问题：

1. 从函数体内部复制和粘贴代码到 REPL 来debug不再方便——你必须加上`global`注释，然后把它删了再复制回去。
    

2. 初学者编写这种代码往往不会加 `global` ，并且不知道为什么他们的代码不起作用 - 他们得到的错误是 `s` 未定义，这似乎并没有启发犯错的人。
    
    

从 Julia 1.5 开始，此代码在 REPL 或 Jupyter 笔记本（就像 Julia 0.6）等交互式上下文中无需`global`注解即可正确执行，同时，在文件和其他非交互式上下文中，它会打印出以下非常直接的警告：

> 在软作用域中对 `s` 的赋值是不明确的，因为存在同名的全局变量：`s` 将被视为新的局部变量。 通过使用 `local s` 来消除此警告或使用 `global s` 赋值给现有的全局变量来消除歧义。

这解决了这两个问题，同时保留了 1.0 行为的“大规模编程”好处：全局变量对可能很远的代码的含义没有幽灵般的影响； 在 REPL 复制粘贴调试工作，初学者没有任何问题； 任何时候有人忘记`global`注解或不小心用软作用域中的局部变量遮蔽了现有的全局变量，这无论如何都会令人困惑，他们会得到一个很好的明确警告。

这种设计的一个重要特点是，在没有警告的情况下在文件中执行的任何代码在新的 REPL 中的行为方式相同。 另一方面，如果您使用 REPL 会话并将其保存到文件中，如果它的行为与 REPL 中的行为不同，那么您将收到警告。

### Let 块

`let` 语句创建一个新的 *硬作用域* 块（见上文）并在每次运行时引入新的变量绑定。
变量不必立即分配：
```jldoctest
julia> var1 = let x
           for i in 1:5
               (i == 4) && (x = i; break)
           end
           x
       end
4
```

赋值可能会为现有值地址重新分配一个新值，而 `let` 总是会创建一个新地址。
这种差异通常并不重要，并且只有在通过闭包超出其作用域的变量的情况下才能检测到。
`let` 语法接受以逗号分隔的一系列赋值和变量名：

```jldoctest
julia> x, y, z = -1, -1, -1;

julia> let x = 1, z
           println("x: $x, y: $y") # x is local variable, y the global
           println("z: $z") # errors as z has not been assigned yet but is local
       end
x: 1, y: -1
ERROR: UndefVarError: `z` not defined
```

赋值将按次序执行：作用域右侧先于左侧引入新变量前被执行。这使得类似 `let x = x` 的写法是有意义的，因为这两个 `x` 变量并不一样，拥有不同存储位置。`let` 的行为在如下例子中是必要的：

```jldoctest
julia> Fs = Vector{Any}(undef, 2); i = 1;

julia> while i <= 2
           Fs[i] = ()->i
           global i += 1
       end

julia> Fs[1]()
3

julia> Fs[2]()
3
```

在这里，我们创建并存储了两个返回变量 `i` 的闭包。但是因为始终是同一个变量`i`，所以这两个闭包行为是相同的。我们可以使用 `let` 为 `i` 创建新绑定：

```jldoctest
julia> Fs = Vector{Any}(undef, 2); i = 1;

julia> while i <= 2
           let i = i
               Fs[i] = ()->i
           end
           global i += 1
       end

julia> Fs[1]()
1

julia> Fs[2]()
2
```

由于 `begin` 结构不会引入新的作用域，使用零参数 `let` 来引入一个新的作用域块而不立即创建任何新的绑定是很有用的：

```jldoctest
julia> let
           local x = 1
           let
               local x = 2
           end
           x
       end
1
```

由于`let` 引入了一个新的作用域块，内部局部变量`x` 与外部局部变量`x` 是一个不同的变量。这个特定的例子相当于：

```jldoctest
julia> let x = 1
           let x = 2
           end
           x
       end
1
```

### 循环和数组推导

对于循环和[数组推导](@ref man-comprehensions)：在其内部作用域中引入的新变量在每次循环迭代中都会被新分配一块内存，如同被 `let` 块包围。

```jldoctest
julia> Fs = Vector{Any}(undef, 2);

julia> for j = 1:2
           Fs[j] = ()->j
       end

julia> Fs[1]()
1

julia> Fs[2]()
2
```

`for` 循环或者推导式的迭代变量始终是个新变量：

```julia-repl enable_doctest_when_deprecation_warning_is_removed
julia> function f()
           i = 0
           for i = 1:3
               # empty
           end
           return i
       end;

julia> f()
0
```

但是偶然地，把一个已有的局部变量作为迭代变量也是有用的。
添加关键字 `outer` 就能方便地做到：

```jldoctest
julia> function f()
           i = 0
           for outer i = 1:3
               # empty
           end
           return i
       end;

julia> f()
3
```

## 常量

变量普遍地用于命名一个特定、不变的值。这些变量只被赋值一次。向编译器传递 [`const`](@ref) 关键字，即可声明这个意图：

```jldoctest
julia> const e  = 2.71828182845904523536;

julia> const pi = 3.14159265358979323846;
```

单个 `const` 关键字能同时声明多个变量：
```jldoctest
julia> const a, b = 1, 2
(1, 2)
```

`const` 声明只应使用在全局作用域中的全局变量。因为全局变量的值（甚至类型）可以随时改变，编译器很难优化包含全局变量的代码。而用 `const` 声明一个不变的全局变量，就能处理这个问题。

局部常量却大有不同。编译器能够自动确定一个局部变量什么时候是不变的，所以局部常量声明是不必要的，其实现在也并不支持。

一些特殊的顶层赋值，比如用了 `function` 和 `structure` 关键字，默认就是常量。

注意 `const` 只会影响变量绑定；变量可能会绑定到一个可变的对象上（比如一个数组）使得其仍然能被改变。另外当尝试给一个声明为常量的变量赋值时，可能出现下列情景：

* 如果新赋值的类型与原常量类型不一样，会扔出一个错误：
```jldoctest
julia> const x = 1.0
1.0

julia> x = 1
ERROR: invalid redefinition of constant x
```
* 如果新赋值的类型与原常量一样，会打印一个警告：
```jldoctest
julia> const y = 1.0
1.0

julia> y = 2.0
WARNING: redefinition of constant y. This may fail, cause incorrect answers, or produce other errors.
2.0
```
* 如果赋值不导致原变量值变化，则不会给出任何信息：
```jldoctest
julia> const z = 100
100

julia> z = 100
100
```
最后一条规则也适用于不可变对象，即使变量绑定的地址改变了，例如：
```julia-repl
julia> const s1 = "1"
"1"

julia> s2 = "1"
"1"

julia> pointer.([s1, s2], 1)
2-element Array{Ptr{UInt8},1}:
 Ptr{UInt8} @0x00000000132c9638
 Ptr{UInt8} @0x0000000013dd3d18

julia> s1 = s2
"1"

julia> pointer.([s1, s2], 1)
2-element Array{Ptr{UInt8},1}:
 Ptr{UInt8} @0x0000000013dd3d18
 Ptr{UInt8} @0x0000000013dd3d18
```
然而对于可变对象，警告会如预期出现：
```jldoctest
julia> const a = [1]
1-element Vector{Int64}:
 1

julia> a = [1]
WARNING: redefinition of constant a. This may fail, cause incorrect answers, or produce other errors.
1-element Vector{Int64}:
 1
```

注意，虽然有时是可能更改常量的值，但是十分不推荐这样做。这样做仅仅是为了便于交互式使用。更改常量可引发多种问题或者非预期行为。举个例子，如果一个方法引用了一个常量并且在常量被更改前已经被编译了，那么该函数很有可能继续使用旧值：

```jldoctest
julia> const x = 1
1

julia> f() = x
f (generic function with 1 method)

julia> f()
1

julia> x = 2
WARNING: redefinition of constant x. This may fail, cause incorrect answers, or produce other errors.
2

julia> f()
1
```

## [Typed Globals](@id man-typed-globals)

!!! compat "Julia 1.8"
    Support for typed globals was added in Julia 1.8

Similar to being declared as constants, global bindings can also be declared to always be of a
constant type. This can either be done without assigning an actual value using the syntax
`global x::T` or upon assignment as `x::T = 123`.

```jldoctest
julia> x::Float64 = 2.718
2.718

julia> f() = x
f (generic function with 1 method)

julia> Base.return_types(f)
1-element Vector{Any}:
 Float64
```

For any assignment to a global, Julia will first try to convert it to the appropriate type using
[`convert`](@ref):

```jldoctest
julia> global y::Int

julia> y = 1.0
1.0

julia> y
1

julia> y = 3.14
ERROR: InexactError: Int64(3.14)
Stacktrace:
[...]
```

The type does not need to be concrete, but annotations with abstract types typically have little
performance benefit.

Once a global has either been assigned to or its type has been set, the binding type is not allowed
to change:

```jldoctest
julia> x = 1
1

julia> global x::Int
ERROR: cannot set type for global x. It already has a value or is already set to a different type.
Stacktrace:
[...]
```
