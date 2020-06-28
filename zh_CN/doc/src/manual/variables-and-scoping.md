# [变量作用域](@id scope-of-variables)

变量的 **作用域** 是代码的一个区域，在这个区域中这个变量是可见的。给变量划分作用域有助于解决变量命名冲突。这个概念是符合直觉的：两个函数可能同时都有叫做 `x` 的参量，而这两个 `x` 并不指向同一个东西。
相似地，也有很多其他的情况，代码的不同块会使用同样名字，但并不指向同一个东西。相同的变量名是否指向同一个东西的规则被称为作用域规则；这一节会详细地把这个规则讲清楚。

语言中的某些结构会引入**作用域块**，这是有资格成为一些变量集合的作用域的代码区域。一个变量的作用域不可能是源代码行的任意集合；相反，它始终与这些块之一关系密切。在 Julia 中主要有两种作用域，**全局作用域** 与 **局部作用域**，后者可以嵌套。
在 Julia 中还存在引入“硬作用域”的构造和只引入“软作用域”的构造之间的区别，这影响到是否允许以相同的名称遮蔽全局变量。

### [作用域结构](@id man-scope-table)

引入作用域块的结构有：

结构 | 作用域类型 | Allowed within
----------|------------|---------------
[`module`](@ref), [`baremodule`](@ref) | 全局 | 全局
[`struct`](@ref) | local (soft) | 全局
[`for`](@ref), [`while`](@ref), [`try`](@ref try) | local (soft) | 全局或局部
[`macro`](@ref) | local (hard) | 全局
[`let`](@ref), functions, comprehensions, generators | local (hard) | 全局或局部

值得注意的是，这个表内没有的是[ begin 块](@ref man-compound-experessions)和[ if 块](@ref man-conditional-evaluation)，这两个块**不会**引进新的作用域块。这两种作用域遵循的规则有点不一样，会在下面解释。

Julia使用[词法作用域](https://en.wikipedia.org/wiki/Scope_%28computer_science%29#Lexical_scoping_vs._dynamic_scoping)，也就是说一个函数的作用域不会从其调用者的作用域继承，而从函数定义处的作用域继承。举个例子，在下列的代码中`foo`中的`x`指向的是模块`Bar`的全局作用域中的`x`。

```jldoctest moduleBar
julia> module Bar
           x = 1
           foo() = x
       end;
```

并且在`foo`被使用的地方`x`并不在作用域中：

```jldoctest moduleBar
julia> import .Bar

julia> x = -1;

julia> Bar.foo()
1
```

Thus *lexical scope* means that what a variable in a particular piece of code refers to can be
deduced from the code in which it appears alone and does not depend on how the program executes. A
scope nested inside another scope can "see" variables in all the outer scopes in which it is
contained. Outer scopes, on the other hand, cannot see variables in inner scopes.

## 全局作用域

每个模块会引进一个新的全局作用域，与其他所有模块的全局作用域分开；无所不包的全局作用域不存在。模块可以把其他模块的变量引入到它的作用域中，通过[using 或者 import](@ref modules)语句或者通过点符号这种有资格的通路，也就是说每个模块都是所谓的*命名空间*。值得注意的是变量绑定只能在它们的全局作用域中改变，在外部模块中不行。
作为一个逃生窗口，你总是可以执行该模块内的代码来修改一个变量；这特别保证了不调用“eval”的外部代码绝不会修改模块绑定。

```jldoctest
julia> module A
           a = 1 # a global in A's scope
       end;

julia> module B
           module C
               c = 2
           end
           b = C.c    # can access the namespace of a nested global scope
                      # through a qualified access
           import ..A # makes module A available
           d = A.a
       end;

julia> module D
           b = a # errors as D's global scope is separate from A's
       end;
ERROR: UndefVarError: a not defined

julia> module E
           import ..A # make module A available
           A.a = 2    # throws below error
       end;
ERROR: cannot assign variables in other modules
```

注意交互式提示行（即REPL）是在模块`Main`的全局作用域中。

## 局部作用域

A new local scope is introduced by most code blocks (see above [table](@ref man-scope-table) for a
complete list). Some programming languages require explicitly declaring new variables before using
them. Explicit declaration works in Julia too: in any local scope, writing `local x` declares a new
local variable in that scope, regardless of whether there is already a variable named `x` in an
outer scope or not. Declaring each new local like this is somewhat verbose and tedious, however, so
Julia, like many other languages, considers assignment to a new variable in a local scope to
implicitly declare that variable as a new local. Mostly this is pretty intuitive, but as with many
things that behave intuitively, the details are more subtle than one might naïvely imagine.

When `x = <value>` occurs in a local scope, Julia applies the following rules to decide what the
expression means based on where the assignment expression occurs and what `x` already refers to at
that location:

1. **Existing local:** If `x` is *already a local variable*, then the existing local `x` is
   assigned;
2. **Hard scope:** If `x` is *not already a local variable* and assignment occurs inside of any
   hard scope construct (i.e. within a let block, function or macro body, comprehension, or
   generator), a new local named `x` is created in the scope of the assignment;
3. **Soft scope:** If `x` is *not already a local variable* and all of the scope constructs
   containing the assignment are soft scopes (loops, `try`/`catch` blocks, or `struct` blocks), the
   behavior depends on whether the global variable `x` is defined:
   * if global `x` is *undefined*, a new local named `x` is created in the scope of the
     assignment;
   * if global `x` is *defined*, the assignment is considered ambiguous:
     * in *non-interactive* contexts (files, eval), an ambiguity warning is printed and a new
       local is created;
     * in *interactive* contexts (REPL, notebooks), the global variable `x` is assigned.

You may note that in non-interactive contexts the hard and soft scope behaviors are identical except
that a warning is printed when an implicitly local variable (i.e. not declared with `local x`)
shadows a global. In interactive contexts, the rules follow a more complex heuristic for the sake of
convenience. This is covered in depth in examples that follow.

Now that you know the rules, let's look at some examples. Each example is assumed to be evaluated in
a fresh REPL session so that the only globals in each snippet are the ones that are assigned in that
block of code.

We'll begin with a nice and clear-cut situation—assignment inside of a hard scope, in this case a
function body, when no local variable by that name already exists:

```jldoctest
julia> function greet()
           x = "hello" # new local
           println(x)
       end
greet (generic function with 1 method)

julia> greet()
hello

julia> x # global
ERROR: UndefVarError: x not defined
```

Inside of the `greet` function, the assignment `x = "hello"` causes `x` to be a new local variable
in the function's scope. There are two relevant facts: the assignment occurs in local scope and
there is no existing local `x` variable. Since `x` is local, it doesn't matter if there is a global
named `x` or not. Here for example we define `x = 123` before defining and calling `greet`:

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

Since the `x` in `greet` is local, the value (or lack thereof) of the global `x` is unaffected by
calling `greet`. The hard scope rule doesn't care whether a global named `x` exists or not:
assignment to `x` in a hard scope is local (unless `x` is declared global).

The next clear cut situation we'll consider is when there is already a local variable named `x`, in
which case `x = <value>` always assigns to this existing local `x`.  The function `sum_to` computes
the sum of the numbers from one up to `n`:

```julia
function sum_to(n)
    s = 0 # new local
    for i = 1:n
        s = s + i # assign existing local
    end
    return s # same local
end
```

As in the previous example, the first assignment to `s` at the top of `sum_to` causes `s` to be a
new local variable in the body of the function. The `for` loop has its own inner local scope within
the function scope. At the point where `s = s + i` occurs, `s` is already a local variable, so the
assignment updates the existing `s` instead of creating a new local. We can test this out by calling
`sum_to` in the REPL:

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
ERROR: UndefVarError: s not defined
```

Since `s` is local to the function `sum_to`, calling the function has no effect on the global
variable `s`. We can also see that the update `s = s + i` in the `for` loop must have updated the same
`s` created by the initialization `s = 0` since we get the correct sum of 55 for the integers 1
through 10.

Let's dig into the fact that the `for` loop body has its own scope for a second by writing a slightly
more verbose variation which we'll call `sum_to′`, in which we save the sum `s + i` in a variable `t`
before updating `s`:

```jldoctest
julia> function sum_to′(n)
           s = 0 # new local
           for i = 1:n
               t = s + i # new local `t`
               s = t # assign existing local `s`
           end
           return s, @isdefined(t)
       end
sum_to′ (generic function with 1 method)

julia> sum_to′(10)
(55, false)
```

This version returns `s` as before but it also uses the `@isdefined` macro to return a boolean
indicating whether there is a local variable named `t` defined in the function's outermost local
scope. As you can see, there is no `t` defined outside of the `for` loop body. This is because of the
hard scope rule again: since the assignment to `t` occurs inside of a function, which
introduces a hard scope, the assignment causes `t` to become a new local variable in the local scope
where it appears, i.e. inside of the loop body. Even if there were a global named `t`, it would make
no difference—the hard scope rule isn't affected by anything in global scope.

Let's move onto some more ambiguous cases covered by the soft scope rule. We'll explore this by
extracting the bodies of the `greet` and `sum_to′` functions into soft scope contexts. First, let's put the
body of `greet` in a `for` loop—which is soft, rather than hard—and evaluate it in the REPL:

```jldoctest
julia> for i = 1:3
           x = "hello" # new local
           println(x)
       end
hello
hello
hello

julia> x
ERROR: UndefVarError: x not defined
```

Since the global `x` is not defined when the `for` loop is evaluated, the first clause of the soft
scope rule applies and `x` is created as local to the `for` loop and therefore global `x` remains
undefined after the loop executes. Next, let's consider the body of `sum_to′` extracted into global
scope, fixing its argument to `n = 10`

```julia
s = 0
for i = 1:10
    t = s + i
    s = t
end
s
@isdefined(t)
```

What does this code do? Hint: it's a trick question. The answer is "it depends." If this code is
entered interactively, it behaves the same way it does in a function body. But if the code appears
in a file, it  prints an ambiguity warning and throws an undefined variable error. Let's see it
working in the REPL first:

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

The REPL approximates being in the body of a function by deciding whether assignment inside the loop
assigns to a global or creates new local based on whether a global variable by that name is defined
or not. If a global by the name exists, then the assignment updates it. If no global exists, then
the assignment creates a new local variable. In this example we see both cases in action:

* There is no global named `t`, so `t = s + i` creates a new `t` that is local to the `for` loop;
* There is a global named `s`, so `s = t` assigns to it.

The second fact is why execution of the loop changes the global value of `s` and the first fact is
why `t` is still undefined after the loop executes. Now, let's try evaluating this same code as
though it were in a file instead:

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
ERROR: LoadError: UndefVarError: s not defined
```

Here we use [`include_string`](@ref), to evaluate `code` as though it were the contents of a file.
We could also save `code` to a file and then call `include` on that file—the result would be the
same. As you can see, this behaves quite different from evaluating the same code in the REPL. Let's
break down what's happening here:

* global `s` is defined with the value `0` before the loop is evaluated
* the assignment `s = t` occurs in a soft scope—a `for` loop outside of any function body or other hard
  scope construct
* therefore the second clause of the soft scope rule applies, and the assignment is ambiguous so a
  warning is emitted
* execution continues, making `s` local to the `for` loop body
* since `s` is local to the `for` loop, it is undefined when `t = s + i` is evaluated, causing an error
* evaluation stops there, but if it got to `s` and `@isdefined(t)`, it would return `0` and `false`.

This demonstrates some important aspects of scope: in a scope, each variable can only have one
meaning, and that meaning is determined regardless of the order of expressions. The presence of the
expression `s = t` in the loop causes `s` to be local to the loop, which means that it is also local
when it appears on the right hand side of `t = s + i`, even though that expression appears first and is
evaluated first. One might imagine that the `s` on the first line of the loop could be global while
the `s` on the second line of the loop is local, but that's not possible since the two lines are in
the same scope block and each variable can only mean one thing in a given scope.

#### On Soft Scope

We have now covered all the local scope rules, but before wrapping up this section, perhaps a few
words should be said about why the ambiguous soft scope case is handled differently in interactive
and non-interactive contexts. There are two obvious questions one could ask:

1. Why doesn't it just work like the REPL everywhere?
2. Why doesn't it just work like in files everywhere? And maybe skip the warning?

In Julia ≤ 0.6, all global scopes did work like the current REPL: when `x = <value>` occurred in a
loop (or `try`/`catch`, or `struct` body) but outside of a function body (or `let` block or comprehension),
it was decided based on whether a global named `x` was defined or not whether `x` should be local to
the loop. This behavior has the advantage of being intuitive and convenient since it approximates
the behavior inside of a function body as closely as possible. In particular, it makes it easy to
move code back and forth between a function body and the REPL when trying to debug the behavior of a
function. However, it has some downsides. First, it's quite a complex behavior: many people over the
years were confused about this behavior and complained that it was complicated and hard both to
explain and understand. Fair point. Second, and arguably worse, is that it's bad for programming "at
scale." When you see a small piece of code in one place like this, it's quite clear what's going on:

```julia
s = 0
for i = 1:10
    s += i
end
```

Obviously the intention is to modify the existing global variable `s`. What else could it mean?
However, not all real world code is so short or so clear. We found that code like the following
often occurs in the wild:

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

It's far less clear what should happen here. Since `x + "hello"` is a method error, it seems
probable that the intention is for `x` to be local to the `for` loop. But runtime values and what
methods happen to exist cannot be used to determine the scopes of variables. With the Julia ≤ 0.6
behavior, it's especially concerning that someone might have written the `for` loop first, had it
working just fine, but later when someone else adds a new global far away—possibly in a different
file—the code suddenly changes meaning and either breaks noisily or, worse still, silently does the
wrong thing. This kind of ["spooky action at a distance"](https://en.wikipedia.org/wiki/Action_at_a_distance_(computer_programming)) is something that good programming language
designs should prevent.

So in Julia 1.0, we simplified the rules for scope: in any local scope, assignment to a name that
wasn't already a local variable created a new local variable. This eliminated the notion of soft
scope entirely as well as removing the potential for spooky action. We uncovered and fixed a significant number of bugs due to the removal of soft scope, vindicating the choice to get rid of it.
And there was much rejoicing! Well, no, not really. Because some people were
angry that they now had to write:

```julia
s = 0
for i = 1:10
    global s += i
end
```

Do you see that `global` annotation in there? Hideous. Obviously this situation could not be
tolerated. But seriously, there are two main issues with requiring `global` for this kind of
top-level code:

1. It's no longer convenient to copy and paste the code from inside a function body into the REPL
   to debug it—you have to add `global` annotations and then remove them again to go back;

2. Beginners will write this kind of code without the `global` and have no idea why their code
   doesn't work—the error that they get is that `s` is undefined, which does not seem to enlighten
   anyone who happens to make this mistake.

As of Julia 1.5, this code works without the `global` annotation in interactive contexts like the
REPL or Jupyter notebooks (just like Julia 0.6) and in files and other non-interactive contexts, it
prints this very direct warning:

> Assignment to `s` in soft scope is ambiguous because a global variable by the same name exists:
> `s` will be treated as a new local. Disambiguate by using `local s` to suppress this warning or
> `global s` to assign to the existing global variable.

This addresses both issues while preserving the "programming at scale" benefits of the 1.0 behavior:
global variables have no spooky effect on the meaning of code that may be far away; in the REPL
copy-and-paste debugging works and beginners don't have any issues; any time someone either forgets
a `global` annotation or accidentally shadows an existing global with a local in a soft scope,
which would be confusing anyway, they get a nice clear warning.

An important property of this design is that any code that executes in a file without a warning will
behave the same way in a fresh REPL. And on the flip side, if you take a REPL session and save it to
file, if it behaves differently than it did in the REPL, then you will get a warning.

### let块

不像局部变量的赋值行为，`let`语句每次运行都新建一个新的变量绑定。赋值改变的是已存在值的位置，`let`会新建新的位置。这个区别通常都不重要，只会在通过闭包跳出作用域的变量的情况下能探测到。`let`语法接受由逗号隔开的一系列的赋值和变量名：

```jldoctest
julia> x, y, z = -1, -1, -1;

julia> let x = 1, z
           println("x: $x, y: $y") # x is local variable, y the global
           println("z: $z") # errors as z has not been assigned yet but is local
       end
x: 1, y: -1
ERROR: UndefVarError: z not defined
```

这个赋值会按顺序评估，在左边的新变量被引入之前右边的每隔两都会在作用域中被评估。所以编写像`let x = x`这样的东西是有意义的，因为两个`x`变量是不一样的，拥有不同的存储位置。这里有个例子，在例子中`let`的行为是必须的：

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

这里我创建并存储了两个返回变量`i`的闭包。但是这两个始终是同一个变量`i`。所以这两个闭包行为是相同的。我们可以使用`let`来为`i`创建新的绑定：

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

因为 `begin` 结构不会引入新的作用域，使用没有参数的 `let` 来只引进一个新的作用域块而不创建新的绑定可能是有用的：

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

因为`let`引进了一个新的作用域块，内部的局部`x`与外部的局部`x`是不同的变量。

### Loops and Comprehensions

In loops and [comprehensions](@ref man-comprehensions), new variables
introduced in their body scopes are freshly allocated for each loop iteration, as if the loop body
were surrounded by a `let` block, as demonstrated by this example:

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

`for`循环或者推导式的迭代变量始终是个新的变量：

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

但是，有时重复使用一个存在的局部变量作为迭代变量是有用的。
这能够通过添加关键字 `outer` 来方便地做到：

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

变量的经常的一个使用方式是给一个特定的不变的值一个名字。这样的变量只会被赋值一次。这个想法可以通过使用 [`const`](@ref) 关键字传递给编译器：

```jldoctest
julia> const e  = 2.71828182845904523536;

julia> const pi = 3.14159265358979323846;
```

多个变量可以使用单个`const`语句进行声明：
```jldoctest
julia> const a, b = 1, 2
(1, 2)
```

`const`声明只应该在全局作用域中对全局变量使用。编译器很难为包含全局变量的代码优化，因为它们的值（甚至它们的类型）可以任何时候改变。如果一个全局变量不会改变，添加`const`声明会解决这个问题。

局部常量却大有不同。编译器能够自动确定一个局部变量什么时候是不变的，所以局部常量声明是不必要的，其实现在也并不支持。

特别的顶层赋值，比如使用`function`和`structure`关键字进行的，默认是不变的。

注意 `const` 只会影响变量绑定；变量可能会绑定到一个可变的对象上（比如一个数组）使得其仍然能被改变。另外当尝试给一个声明为常量的变量赋值时下列情景是可能的：

* 如果一个新值的类型与常量类型不一样时会扔出一个错误：
```jldoctest
julia> const x = 1.0
1.0

julia> x = 1
ERROR: invalid redefinition of constant x
```
* 如果一个新值的类型与常量一样会打印一个警告：
```jldoctest
julia> const y = 1.0
1.0

julia> y = 2.0
WARNING: redefinition of constant y. This may fail, cause incorrect answers, or produce other errors.
2.0
```
* 如果赋值不会导致变量值的变化，不会给出任何信息：
```jldoctest
julia> const z = 100
100

julia> z = 100
100
```
最后一条规则适用于不可变对象，即使变量绑定会改变，例如：
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
但是对于可变对象，警告会如预期出现：
```jldoctest
julia> const a = [1]
1-element Array{Int64,1}:
 1

julia> a = [1]
WARNING: redefinition of constant a. This may fail, cause incorrect answers, or produce other errors.
1-element Array{Int64,1}:
 1
```

Note that although sometimes possible, changing the value of a `const` variable is strongly
discouraged, and is intended only for convenience during interactive use. Changing constants can
cause various problems or unexpected behaviors. For instance, if a method references a constant and
is already compiled before the constant is changed, then it might keep using the old value:

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
