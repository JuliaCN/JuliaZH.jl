# [变量作用域](@id scope-of-variables)

变量的*作用域*是代码的一个区域，在这个区域中这个变量是可见的。给变量划分作用域有助于解决变量命名冲突。这个概念是符合直觉的：两个函数可能同时都有叫做`x`的参量，而这两个`x`并不指向同一个东西。相似地，也有很多其他的情况下代码的不同块会使用同样名字而并不指向同一个东西。相同的变量名是否指向同一个东西的规则被称为作用域规则；这一届会详细地把这个规则讲清楚。

语言中的某个创建会引入*作用域块*，这是代码中的一个区域，有资格成为一些变量集合的作用域。一个变量的作用域不可能是源代码行的任意集合；相反，它始终与这些块之一关系密切。在Julia中有两个主要类型的作用域，*全局作用域*与*局部作用域*，后者可以嵌套。引入作用域块的创建是：

# [](@id man-scope-table)

  * 只能在其他全局作用域块中嵌套的作用域块：

    - 全局作用域

      + 模块，裸模块

      + 在交互式提示行（REPL）

    - 局部作用域（不允许嵌套）

      + （可变的）结构，宏

  * 可以在任何地方嵌套的作用域块（在全局或者局部作用域中）：

    - 局部作用域

      + for，while，try-catch-finally，let

      + 函数（语法，匿名或者do语法块）

      + 推导式，broadcast-fusing

值得注意的是，这个表内没有的是[ begin 块](@ref man-compound-experessions)和[ if 块](@ref man-conditional-evaluation)，这两个块*不会*引进新的作用域块。这两种作用域遵循的规则有点不一样，会在下面解释。

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

所以*词法作用域*表明变量作用域只能通过源码推断。

## 全局作用域

每个模块会引进一个新的全局作用域，与其他所有模块的全局作用域分开；无所不包的全局作用域不存在。模块可以把其他模块的变量引入到它的作用域中，通过[using 或者 import](@ref modules)语句或者通过点符号这种有资格的通路，也就是说每个模块都是所谓的*命名空间*。值得注意的是变量绑定只能在它们的全局作用域中改变，在外部模块中不行。

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

大多数代码块都会引进一个新的局部作用域（参见上面的[表](@ref man-scope-table)以获取完整列表）。局部作用域会从父作用域中继承所有的变量，读和写都一样。另外，局部作用域还会继承赋值给其父全局作用域块的所有全局变量（如果由全局`if`或者`begin`作用域包围）。不像全局作用域，局部作用域并不是命名空间，所以在其内部作用域中的变量无法通过一些合格的通路在其父作用域中得到。

接下来的规则和例子都适用于局部作用域。
在局部作用域中新引进的变量不会反向传播到其父作用域。
例如，这里``z``并没有引入到顶层作用域：

```jldoctest
julia> for i = 1:10
           z = i
       end

julia> z
ERROR: UndefVarError: z not defined
```

（注意，在这个和以下所有的例子中都假设了它们的顶层作用域是一个工作空间是空的全局作用域，比如一个新打开的REPL。）

在局部作用域中可以使用`local`关键字来使一个变量强制为新的局部变量。

```jldoctest
julia> x = 0;

julia> for i = 1:10
           local x # this is also the default
           x = i + 1
       end

julia> x
0
```

在局部作用域内部，可以使用`global`关键字赋值给一个全局变量：

```jldoctest
julia> for i = 1:10
           global z
           z = i
       end

julia> z
10
```

在作用域块中`local`和`global`关键字的位置都无关痛痒。下面的例子与上面最后的一个例子是等价的（虽然在文体上更差）:

```jldoctest
julia> for i = 1:10
           z = i
           global z
       end

julia> z
10
```

`local`和`global`关键字都可以用于解构赋值，也就是说`local x, y = 1, 2`。在这个例子中关键字影响所有的列出来的变量。

大多数块关键字都会引入局部作用域，而`begin`和`if`是例外。

在一个局部作用域中，所有的变量都会从其父作用域块中继承，除非：

  * 赋值会导致*全局*变量改变，或者
  * 变量专门使用`local`关键字标记。

所以全局变量只能通过读来继承，而不能通过写来继承。

```jldoctest
julia> x, y = 1, 2;

julia> function foo()
           x = 2        # assignment introduces a new local
           return x + y # y refers to the global
       end;

julia> foo()
4

julia> x
1
```

为一个全局变量赋值需要显式的`global`：

!!! sidebar "不要用全局变量"
为了使得编出来的程序是最好的，很多人都考虑了避免改变全局变量的值。一个原因是远程改变其他模块中的全局变量的状态会导致程序的局部行为变得难以琢磨，应该小心行事。这也是为什么引入局部作用域的作用域块需要``global``关键字来声明其改变一个全局变量的意图。

```jldoctest
julia> x = 1;

julia> function foobar()
           global x = 2
       end;

julia> foobar();

julia> x
2
```

注意*嵌套函数*会改变其父作用域的*局部*变量：

```jldoctest
julia> x, y = 1, 2;

julia> function baz()
           x = 2 # introduces a new local
           function bar()
               x = 10       # modifies the parent's x
               return x + y # y is global
           end
           return bar() + x # 12 + 10 (x is modified in call of bar())
       end;

julia> baz()
22

julia> x, y # verify that global x and y are unchanged
(1, 2)
```

允许嵌套函数*修改*其父作用域的*局部*变量的原因是允许构建[`闭包`](https://en.wikipedia.org/wiki/Closure_%28computer_programming%29)，
闭包中有一个私有的态，例如下面例子中的``state``变量：

```jldoctest
julia> let state = 0
           global counter() = (state += 1)
       end;

julia> counter()
1

julia> counter()
2
```

也可以参见接下来两节例子中的闭包。例如在第一个例子中的`x`与在第二个例子中的`state`，内部函数从包含它的作用域中继承的变量有时被称为*捕获*变量。捕获变量会带来性能挑战，这会在[性能建议](@ref man-performance-tips)中讨论。

继承全局作用域与嵌套局部作用域的区别会导致在局部或者全局作用域中定义的函数在变量赋值上的稍许区别。考虑一下上面最后一个例子的一个变化，把`bar`移动到全局作用域中：

```jldoctest
julia> x, y = 1, 2;

julia> function bar()
           x = 10 # local, no longer a closure variable
           return x + y
       end;

julia> function quz()
           x = 2 # local
           return bar() + x # 12 + 2 (x is not modified)
       end;

julia> quz()
14

julia> x, y # verify that global x and y are unchanged
(1, 2)
```

注意到在上面的嵌套规则并不适用于类型和宏定义因为他们只能出现在全局作用域中。涉及到[函数](@ref man-functions)中提到的默认和关键字函数参数的评估的话会有特别的作用域规则。

在函数，类型或者宏定义内部使用的变量，将其引入到作用域中的赋值行为不必在其内部使用之前进行：

```jldoctest
julia> f = y -> y + a;

julia> f(3)
ERROR: UndefVarError: a not defined
Stacktrace:
[...]

julia> a = 1
1

julia> f(3)
4
```

这个行为看起来对于普通变量来说有点奇怪，但是这个允许命名过的函数 -- 它只是连接了函数对象的普通变量 -- 在定义之前就能被使用。这就允许函数能以符合直觉和方便的顺序定义，而非强制以颠倒顺序或者需要前置声明，只要在实际调用之前被定义就行。举个例子，这里有个不高效的，相互递归的方法去检验正整数是奇数还是偶数的方法：

```jldoctest
julia> even(n) = (n == 0) ? true : odd(n - 1);

julia> odd(n) = (n == 0) ? false : even(n - 1);

julia> even(3)
false

julia> odd(3)
true
```

Julia提供了叫做[`iseven`](@ref)和[`isodd`](@ref)的内置的高效的奇偶性检验的函数，所以之上的定义只能被认为是作用域的一个例子，而非高效的设计。

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

以为`begin`结构不会引入新的作用域，使用没有参数的`let`来只引进一个新的作用域块而不创建新的绑定是有用的：

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

### 对于循环和推导式

`for`循环，`while`循环，和[Comprehensions](@ref)拥有下述的行为：任何在它们的内部的作用域中引入的新变量在每次循环迭代中都会被新分配一块内存，就像循环体是被`let`块包围一样。

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
 end
 return i
 end;

julia> f()
0
```

但是，有时重复使用一个存在的变量作为迭代变量是有用的。
这能够通过添加关键字`outer`来方便地做到：

```jldoctest
julia> function f()
 i = 0
 for outer i = 1:3
 end
 return i
 end;

julia> f()
3
```

## 常量

变量的经常的一个使用方式是给一个特定的不变的值一个名字。这样的变量只会被赋值一次。这个想法可以通过使用`const`关键字传递给编译器：

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

注意`const`只会影响变量绑定；变量可能会绑定到一个可变的对象上（比如一个数组）使得其任然能被改变。另外当尝试给一个声明为常量的变量赋值时下列情景是可能的：

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
WARNING: redefining constant y
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
WARNING: redefining constant a
1-element Array{Int64,1}:
 1
```

注意，即使可能，改变一个声明为常量的变量的值是十分不推荐的。举个例子，如果一个方法引用了一个常量并且在常量被改变之前已经被编译了，那么这个变量还是会保留使用原来的值：
```jldoctest
julia> const x = 1
1

julia> f() = x
f (generic function with 1 method)

julia> f()
1

julia> x = 2
WARNING: redefining constant x
2

julia> f()
1
```
