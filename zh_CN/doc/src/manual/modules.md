# [模块](@id modules)

Julia 中的模块有助于将代码组织成连贯的部分。 它们在语法上以 `module Name ... end` 界定，并具有以下特点：

1. 模块是独立的命名空间，每个都引入了一个新的全局作用域。 这很有用，因为它允许对不同的函数或全局变量使用相同的名称而不会发生冲突，只要它们在不同的模块中即可。
    

2. 模块具有用于命名空间管理的工具：每个模块定义一组它`export`的名称，并且可以使用 `using` 和 `import` 从其他模块导入名称（我们将在下面解释这些）。
    

3. 模块可以预编译以加快加载速度，并包含用于运行时初始化的代码。

通常，在较大的 Julia 包中，你会看到模块的代码组织成文件，例如

```julia
module SomeModule

# export, using, import statements are usually here; we discuss these below

include("file1.jl")
include("file2.jl")

end
```

文件和文件名大多与模块无关； 模块仅与模块表达式相关联。 每个模块可以有多个文件，每个文件可以有多个模块。 `include` 的行为就像在包含模块的全局作用域内执行源文件的内容一样。 在本章中，我们使用简短和简化的示例，因此我们不会使用`include`。

我们推荐不要缩进模块的主体，因为这通常会导致整个文件被缩进。 此外，通常使用 `UpperCamelCase` 作为模块名称（就像类型一样），并在适用时使用复数形式，特别是如果模块包含类似命名的标识符，以避免名称冲突。 例如，

```julia
module FastThings

struct FastThing
    ...
end

end
```

## [命名空间管理](@id namespace-management)

命名空间管理是指语言提供的设施，用于使模块中的名称在其他模块中可用。 我们在下面详细讨论相关的概念和功能。

### 合格的名称

全局作用域内的函数、变量和类型的名称，如`sin`、`ARGS`和`UnitRange`始终属于一个模块，称为*母模块*，例如，可以与[`parentmodule`](@ref)交互来找到该模块

```jldoctest
julia> parentmodule(UnitRange)
Base
```

也可以通过在它们的模块前面加上前缀来引用它们的父模块之外的这些名称，例如`Base.UnitRange`。 这称为*限定名称*。 父模块可以使用像`Base.Math.sin`这样的子模块链来访问，其中`Base.Math`被称为*模块路径*。 由于句法歧义，限定只包含符号的名称，例如运算符，需要插入冒号，例如 `Base.:+`。 少数运算符还需要括号，例如 `Base.:(==)`。

如果一个名称是限定的，那么它总是*可访问的*，在函数的情况下，它也可以通过使用限定的名称作为函数名称来添加方法。

在一个模块中，一个变量名可以通过将其声明 `global x` 不赋值而“保留”。 这可以防止在加载时间后初始化的全局变量的名称冲突。 语法`M.x = y` 不适用于在另一个模块中分配一个全局变量； 全局分配需要在模块本地进行操作。

### 导出列表

名称（指函数、类型、全局变量和常量）可以通过 `export` 添加到模块的 *导出列表 *。 通常，它们位于或靠近模块定义的顶部，以便源代码的读者可以轻松找到它们，如

```julia
module NiceStuff

export nice, DOG

struct Dog end      # singleton type, not exported

const DOG = Dog()   # named instance, exported

nice(x) = "nice $x" # function, exported

end
```

但这只是一个风格建议——一个模块可以在任意位置有多个 `export` 语句。

导出构成 API（应用程序接口）一部分的名称是很常见的。 在上面的代码中，导出列表建议用户应该使用`nice`和`DOG`。 然而，由于限定名称总是使标识符可访问，这只是组织 API 的一个选项：与其他语言不同，Julia 没有真正隐藏模块内部的功能。

此外，某些模块根本不导出名称。 这通常是因为他们的 API 中使用常用词（例如`derivative`），这很容易与其他模块的导出列表发生冲突。 我们将在下面看到如何管理名称冲突。

### 单独使用`using`和`import`

加载模块最常见的方式可能是`using ModuleName`。 这 [加载](@ref code-loading) 与 `ModuleName` 关联的代码，并引入

1. 模块名称

2. 和导出列表的元素到周围的全局命名空间中。

严格来说，声明 `using ModuleName` 意味着一个名为 `ModuleName` 的模块可用于根据需要解析名称。 当遇到当前模块中没有定义的全局变量时，系统会在`ModuleName`导出的变量中查找，找到就使用。 这意味着当前模块中该全局变量的所有使用都将解析为`ModuleName`中该变量的定义。

继续我们的例子，

```julia
using NiceStuff
```

将加载上面的代码，使 `NiceStuff`（模块名称）、`DOG` 和 `nice` 可用。 `Dog` 不在导出列表中，但如果名称被模块路径（这里只是模块名称）限定为 `NiceStuff.Dog`，则可以访问它。

重要的是，**导出列表只在`using ModuleName` 的形式下起作用**。

相反，

```julia
import NiceStuff
```

*仅*将模块名称带入作用域。 用户需要使用 `NiceStuff.DOG`、`NiceStuff.Dog` 和 `NiceStuff.nice` 来访问其内容。 通常，当用户想要保持命名空间干净时，在上下文中使用 `import ModuleName`。 正如我们将在下一节中看到的，`import NiceStuff` 等同于 `using NiceStuff: NiceStuff`。

你可以用逗号分隔符来组合相同类型的多个`using`和`import`语句，例如：

```julia
using LinearAlgebra, Statistics
```

### 具有特定标识符的`using` 和 `import` ，并添加方法

当 `using ModuleName:` 或 `import ModuleName:` 后跟以逗号分隔的名称列表时，模块会被加载，但 *只有那些特定的名称才会被语句带入命名空间*。 例如，

```julia
using NiceStuff: nice, DOG
```

将导入名称`nice`和`DOG`。

重要的是，模块名称`NiceStuff` *不会*出现在命名空间中。 如果要使其可访问，则必须明确列出它，如
```julia
using NiceStuff: nice, DOG, NiceStuff
```

Julia有两种形式来表示似乎相同的内容，因为只有 `import ModuleName:f` 允许在 *没有模块路径*的情况下向 `f` 添加方法。也就是说，以下示例将给出一个错误：

```julia
using NiceStuff: nice
struct Cat end
nice(::Cat) = "nice 😸"
```

此错误可防止意外将方法添加到你仅打算使用的其他模块中的函数。

有两种方法可以解决这个问题。 你始终可以使用模块路径限定函数名称：
```julia
using NiceStuff
struct Cat end
NiceStuff.nice(::Cat) = "nice 😸"
```

或者，你可以`import`特定的函数名称：
```julia
import NiceStuff: nice
struct Cat end
nice(::Cat) = "nice 😸"
```

你选择哪一个取决于你的代码风格。第一种形式表明你正在向另一个模块中的函数添加一个方法（请记住，导入和方法定义可能在单独的文件中），而第二种形式较短，如果你定义了多个方法，这一点尤其方便。

一旦一个变量通过 `using` 或 `import` 引入，当前模块就不能创建同名的变量了。而且导入的变量是只读的，给全局变量赋值只能影响到由当前模块拥有的变量，否则会报错。

### 用`as`来重命名

由`import` 或`using` 引入作用域的标识符可以用关键字`as` 重命名。 这对于解决名称冲突以及缩短名称很有用。 例如，`Base` 导出函数名`read`，但CSV.jl 包也提供了`CSV.read`。 如果我们要多次调用 CSV 读取，删除 `CSV.` 限定符会很方便。 但是，我们指的是`Base.read`还是`CSV.read`是模棱两可的：

```julia
julia> read;

julia> import CSV: read
WARNING: ignoring conflicting import of CSV.read into Main
```

重命名提供了一个解决方案：

```julia
julia> import CSV: read as rd
```

导入的包本身也可以重命名：

```julia
import BenchmarkTools as BT
```

`as` 仅在将单个标识符引入作用域时才与 `using` 一起使用。 例如，`using CSV: read as rd` 有效，但`using CSV as C` 无效，因为它对 `CSV` 中的所有导出名称进行操作。

### 混合使用多个 `using` 和 `import` 语句

当使用上述任何形式的多个 `using` 或 `import` 语句时，它们的效果将按照它们出现的顺序组合。 例如，

```julia
using NiceStuff         # exported names and the module name
import NiceStuff: nice  # allows adding methods to unqualified functions
```

会将 `NiceStuff` 的所有导出名称和模块名称本身带入作用域，并且还允许向 `nice` 添加方法而不用模块名称作为前缀。

### 处理名称冲突

考虑两个（或更多）包导出相同名称的情况，如

```julia
module A
export f
f() = 1
end

module B
export f
f() = 2
end
```

`using A, B` 语句有效，但是当你尝试调用 `f` 时，你会收到警告

```julia
WARNING: both B and A export "f"; uses of it in module Main must be qualified
ERROR: LoadError: UndefVarError: f not defined
```

在这里，Julia 无法确定您指的是哪个 `f`，因此你必须做出选择。 常用的解决方法有以下几种：

1. 只需继续使用限定名称，如`A.f` 和`B.f`。 这使代码的读者可以清楚地了解上下文，特别是如果 `f` 恰好重合但在不同的包中具有不同的含义。 例如，`degree`在数学、自然科学和日常生活中有多种用途，这些含义应该分开。

2. 使用上面的 `as` 关键字重命名一个或两个标识符，例如

   ```julia
   using A: f as f
   using B: f as g
   ```

   会使`B.f` 可用作`g`。 在这里，我们假设您之前没有使用 `using A`，
   这会把`f`代入命名空间。

3. 当问题中的多个名称*确实*有相同的含义时，通常一个模块会从另一个模块导入它，或者有一个轻量级的“基础”包，它的唯一功能是定义这样的接口，可以被其他包使用。按照惯例，这些包名以 `...Base` 结尾（这与 Julia 的 `Base` 模块无关）

### 默认顶层定义以及裸模块

模块自动包含 `using Core`、`using Base` 以及 [`eval`](@ref) 和 [`include`](@ref) 函数的定义，这些函数在该模块的全局作用域内计算表达式/文件 .

如果不需要这些默认定义，可以使用关键字 [`baremodule`](@ref) 来定义模块（注意：`Core` 仍然是导入的）。 就 `baremodule` 而言，一个标准的 `module` 看起来像这样：

```
baremodule Mod

using Base

eval(x) = Core.eval(Mod, x)
include(p) = Base.include(Mod, p)

...

end
```

### 标准模块

有三个重要的标准模块：
* [`Core`](@ref) 包含了语言“内置”的所有功能。
* [`Base`](@ref) 包含了绝大多数情况下都会用到的基本功能。
* [`Main`](@ref) 是顶层模块，当 julia 启动时，也是当前模块。

!!! note "Standard library modules"
    默认情况下，Julia 附带了一些标准库模块。 除了你不需要显式安装它们之外，它们的行为与常规 Julia 包类似。 例如，如果您想执行一些单元测试，你可以按如下方式加载 `Test` 标准库：
    ```julia
    using Test
    ```

## 子模块和相对路径

模块可以包含 *子模块*，嵌套相同的语法`module ... end`。 它们可用于引入单独的命名空间，这有助于组织复杂的代码库。 请注意，每个 `module` 都引入了自己的 [作用域](@ref scope-of-variables)，因此子模块不会自动从其父模块“继承”名称。

建议子模块在 `using` 和 `import` 语句中使用 *相对模块限定符* 来引用封闭父模块中的其他模块（包括后者）。 相对模块限定符以句点 (`.`) 开头，它对应于当前模块，每个连续的 `.` 都指向当前模块的父级。 如有必要，这应该跟在模块之后，最后是要访问的实际名称，所有名称都以`.`分隔。

考虑以下示例，其中子模块`SubA`定义了一个函数，然后在其“兄弟”模块中进行扩展：

```julia
module ParentModule

module SubA
export add_D  # exported interface
const D = 3
add_D(x) = x + D
end

using .SubA  # brings `add_D` into the namespace

export add_D # export it from ParentModule too

module SubB
import ..SubA: add_D # relative path for a “sibling” module
struct Infinity end
add_D(x::Infinity) = x
end

end
```

你可能会在包中看到代码，在类似的情况下，它使用
```julia
import ParentModule.SubA: add_D
```
然而，这是通过 [代码加载](@ref code-loading) 操作的，因此仅当 `ParentModule` 在包中时才有效。 最好使用相对路径。

请注意，如果你正在评估值，定义的顺序也很重要。 考虑

```julia
module TestPackage

export x, y

x = 0

module Sub
using ..TestPackage
z = y # ERROR: UndefVarError: y not defined
end

y = 1

end
```

其中 `Sub` 在定义之前尝试使用 `TestPackage.y`，因此它没有值。

出于类似的原因，你不能使用循环顺序：

```julia
module A

module B
using ..C # ERROR: UndefVarError: C not defined
end

module C
using ..B
end

end
```

### 模块初始化和预编译

因为执行模块中的所有语句通常需要编译大量代码，大型模块可能需要几秒钟才能加载。Julia 会创建模块的预编译缓存以减少这个时间。

当用 `import` 或 `using` 加载一个模块时，模块增量预编译文件会自动创建并使用。这会让模块在第一次加载时自动编译。
另外，你也可以手工调用 [`Base.compilecache(modulename)`](@ref)，产生的缓存文件会放在 `DEPOT_PATH[1]/compiled/` 目录下。
之后，当该模块的任何一个依赖发生变更时，该模块会在 `using` 或 `import` 时自动重新编译；
模块的依赖指的是：任何它导入的模块、Julia 自身、include 的文件或由 [`include_dependency(path)`](@ref) 显式声明的依赖。

对于文件依赖项，通过检查由 `include` 加载或由 `include_dependency` 显式添加的每个文件的修改时间（`mtime`）是否保持不变，或是否等于截断到最接近秒的修改时间（以适应无法以亚秒精度复制 mtime的系统），来确定更改。它还考虑由 `require` 中的搜索逻辑选择的文件路径是否与创建预编译文件的路径匹配。它还考虑了已加载到当前进程中的依赖项集，并且不会重新编译这些模块，即使它们的文件更改或消失，以避免在正在运行的系统和预编译缓存之间创建不兼容。

如果你知道一个模块预编译*不*安全（例如，由于下面描述的原因之一），你应该把`__precompile__(false)`放在模块文件中（通常放在顶部）。 这会导致`Base.compilecache` 抛出错误，并且会导致`using` / `import` 将其直接加载到当前进程中并跳过预编译和缓存。 这也因此防止了模块被任何其他预编译模块导入。

在开发模块的时候，你可能需要了解一些与增量编译相关的固有行为。例如，外部状态不会被保留。为了解决这个问题，需要显式分离运行时与编译期的部分。Julia 允许你定义一个 `__init__()` 函数来执行任何需要在运行时发生的初始化。在编译期（`--output-*`），此函数将不会被调用。你可以假设在代码的生存周期中，此函数只会被运行一次。当然，如果有必要，你也可以手动调用它，但在默认的情况下，请假定此函数是为了处理与本机状态相关的信息，注意这些信息不需要，更不应该存入预编译镜像。此函数会在模块被导入到当前进程之后被调用，这包括在一个增量编译中导入该模块的时候（`--output-incremental=yes`），但在完整编译时该函数不会被调用。

特别的，如果你在模块里定义了一个名为 `__init__()` 的函数，那么 Julia 在加载这个模块之后会在第一次运行时（runtime）立刻调用这个函数（例如，通过 `import`，`using`，或者 `require` 加载时），也就是说 `__init__` 只会在模块中所有其它命令都执行完以后被调用一次。因为这个函数将在模块完全载入后被调用，任何子模块或者已经载入的模块都将在当前模块调用 `__init__` **之前** 调用自己的 `__init__` 函数。

`__init__`的典型用法有二，一是用于调用外部 C 库的运行时初始化函数，二是用于初始化涉及到外部库所返回的指针的全局常量。例如，假设我们正在调用一个 C 库 `libfoo`，它要求我们在运行时调用`foo_init()` 这个初始化函数。假设我们还想定义一个全局常量 `foo_data_ptr`，它保存 `libfoo` 所定义的 `void *foo_data()` 函数的返回值——必须在运行时（而非编译时）初始化这个常量，因为指针地址不是固定的。可以通过在模块中定义 `__init__` 函数来完成这个操作。

```julia
const foo_data_ptr = Ref{Ptr{Cvoid}}(0)
function __init__()
    ccall((:foo_init, :libfoo), Cvoid, ())
    foo_data_ptr[] = ccall((:foo_data, :libfoo), Ptr{Cvoid}, ())
    nothing
end
```

注意，在像 `__init__` 这样的函数里定义一个全局变量是完全可以的，这是动态语言的优点之一。但是把全局作用域的值定义成常量，可以让编译器能确定该值的类型，并且能让编译器生成更好的优化过的代码。显然，你的模块（Module）中，任何其他依赖于 `foo_data_ptr` 的全局量也必须在 `__init__` 中被初始化。

涉及大多数不是由 [`ccall`](@ref) 生成的 Julia 对象的常量不需要放在 `__init__` 中：它们的定义可以从缓存的模块映像中预编译和加载。 这包括复杂的堆分配对象，如数组。 但是，任何返回原始指针值的例程都必须在运行时调用才能使预编译工作（[`Ptr`](@ref) 对象将变成空指针，除非它们隐藏在 [`isbits`](@ref) 目的）。 这包括 Julia 函数 [`@cfunction`](@ref) 和 [`pointer`](@ref) 的返回值。

字典和集合类型，或者通常任何依赖于 `hash(key)` 方法的类型，都是比较棘手的情况。
通常当键是数字、字符串、符号、范围、`Expr` 或这些类型的组合（通过数组、元组、集合、映射对等）时，可以安全地预编译它们。但是，对于一些其它的键类型，例如 `Function` 或 `DataType`、以及还没有定义散列方法的通用用户定义类型，回退（fallback）的散列（`hash`）方法依赖于对象的内存地址（通过 `objectid`），因此可能会在每次运行时发生变化。
如果您有这些关键类型中的一种，或者您不确定，为了安全起见，您可以在您的 `__init__` 函数中初始化这个字典。或者，您可以使用 [`IdDict`](@ref) 字典类型，它是由预编译专门处理的，因此在编译时初始化是安全的。

当使用预编译时，我们必须要清楚地区分代码的编译阶段和运行阶段。在此模式下，我们会更清楚发现 Julia 的编译器可以执行任何 Julia 代码，而不是一个用于生成编译后代码的独立的解释器。

其它已知的潜在失败场景包括：

1. 全局计数器，例如：为了试图唯一的标识对象。考虑以下代码片段：
    

   ```julia
   mutable struct UniquedById
       myid::Int
       let counter = 0
           UniquedById() = new(counter += 1)
       end
   end
   ```

   尽管这段代码的目标是给每个实例赋一个唯一的 ID，但计数器的值会在代码编译结束时被记录。任何对此增量编译模块的后续使用，计数器都将从同一个值开始计数。
    
    

   注意 `objectid` （工作原理是取内存指针的 hash）也有类似的问题，请查阅下面关于 `Dict` 的用法。
    

   一种解决方案是用宏捕捉 [`@__MODULE__`](@ref)，并将它与目前的 `counter` 值一起保存。然而，更好的方案是对代码进行重新设计，不要依赖这种全局状态变量。
    
2. 像 `Dict` 和 `Set` 这种关联集合需要在 `__init__` 中 re-hash。Julia 在未来很可能会提供一个机制来注册初始化函数。
    
3. 依赖编译期的副作用会在加载时蔓延。例子包括：更改其它 Julia 模块里的数组或变量，操作文件或设备的句柄，保存指向其它系统资源（包括内存）的指针。
    
    
4. 无意中从其它模块中“拷贝”了全局状态：通过直接引用的方式而不是通过查找的方式。例如，在全局作用域下：
    

   ```julia
   #mystdout = Base.stdout #= will not work correctly, since this will copy Base.stdout into this module =#
   # instead use accessor functions:
   getstdout() = Base.stdout #= best option =#
   # or move the assignment into the runtime:
   __init__() = global mystdout = Base.stdout #= also works =#
   ```

此处为预编译中的操作附加了若干限制，以帮助用户避免其他误操作：

1. 调用 [`eval`](@ref) 来在另一个模块中引发副作用。当增量预编译被标记时，该操作同时会导致抛出一个警告。
    
2. 当 `__init__()` 已经开始执行后，在局部作用域中声明 `global const`（见 issue #12010，计划为此情况添加一个错误提示）
    
3. 在增量预编译时替换模块是一个运行时错误。

一些其他需要注意的点：

1. 在源代码文件本身被修改之后，不会执行代码重载或缓存失效化处理（包括由 `Pkg.update` 执行的修改，此外在 `Pkg.rm` 执行后也没有清理操作）
    
2. 变形数组的内存共享特性会被预编译忽略（每个数组样貌都会获得一个拷贝）
    
3. 文件系统在编译期间和运行期间被假设为不变的，比如使用 [`@__FILE__`](@ref)/`source_path()` 在运行期间寻找资源、或使用 BinDeps 宏 `@checked_lib`。有时这是不可避免的。但是可能的话，在编译期将资源复制到模块里面是个好做法，这样在运行期间，就不需要去寻找它们了。
    
    
    
4. `WeakRef` 对象和完成器目前在序列化器中无法被恰当地处理（在接下来的发行版中将修复）。
    
5. 通常，最好避免去捕捉内部元数据对象的引用，如 `Method`、`MethodInstance`、`TypeMapLevel`、`TypeMapEntry` 及这些对象的字段，因为这会迷惑序列化器，且可能会引发你不想要的结果。此操作不足以成为一个错误，但你需做好准备：系统会尝试拷贝一部分，然后创建其余部分的单个独立实例。
    
    
    
    

在开发模块时，关闭增量预编译可能会有所帮助。命令行标记 `--compiled-modules={yes|no}` 可以让你切换预编译的开启和关闭。当 Julia 附加 `--compiled-modules=no` 启动，在载入模块和模块依赖时，编译缓存中的序列化模块会被忽略。`Base.compilecache` 仍可以被手动调用。此命令行标记的状态会被传递给 `Pkg.build`，禁止其在安装、更新、显式构建包时触发自动预编译。
