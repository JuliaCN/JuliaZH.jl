# [模块](@id modules)

Julia 中的模块（module）是一些互相隔离的可变工作空间，也就是说它们会引入新的全局作用域。它们在语法上以 `module Name ... end` 界定。模块允许你创建顶层定义（也称为全局变量），而无需担心命名冲突。在模块中，利用导入（importing），你可以控制其它模块中的哪些名称是可见的；利用导出（exporting），你可以控制你自己的模块中的哪些名称是公开的。

下面的示例演示了模块的主要功能。它不是为了运行，只是为了方便说明：

```julia
module MyModule
using Lib

using BigLib: thing1, thing2

import Base.show

export MyType, foo

struct MyType
    x
end

bar(x) = 2x
foo(a::MyType) = bar(a.x) + 1

show(io::IO, a::MyType) = print(io, "MyType $(a.x)")
end
```

注意，模块中的代码样式不需要缩进，否则的话，会导致整个文件缩进。

上面的模块定义了一个 `MyType` 类型，以及两个函数，其中，函数 `foo` 和类型 `MyType` 被导出了，因而可以被导入到其它模块，而函数 `bar` 是模块 `MyModule` 的私有函数。

`using Lib` 意味着一个名称为 `Lib` 的模块会在需要的时候用于解释变量名。当一个全局变量在当前模块中没有定义时，系统就会从 `Lib` 中导出的变量中搜索该变量，如果找到了的话，就导入进来。也就是说，当前模块中，所有使用该全局变量的地方都会解释为 `Lib` 中对应的变量。

代码 `using BigLib: thing1, thing2` 显式地将标识符 `thing1` 和 `thing2` 从模块 `BigLib` 中引入到当前作用域。如果这两个变量是函数的话，则**不允许**给它们增加新的方法，毕竟代码里写的是 "using"（使用）它们，而不是扩展它们。

The [`import`](@ref) keyword supports the same syntax as [`using`](@ref), but only operates on a single name
at a time. It does not add modules to be searched the way `using` does. `import` also differs
from `using` in that functions imported using `import` can be extended with new methods.

In `MyModule` above we wanted to add a method to the standard [`show`](@ref) function, so we had to write
`import Base.show`. Functions whose names are only visible via `using` cannot be extended.

一旦一个变量通过 `using` 或 `import` 引入，当前模块就不能创建同名的变量了。而且导入的变量是只读的，给全局变量赋值只能影响到由当前模块拥有的变量，否则会报错。

## 模块用法摘要

要导入一个模块，可以用 `using` 或 `import` 关键字。为了更好地理解它们的区别，请参考下面的例子：

```julia
module MyModule

export x, y

x() = "x"
y() = "y"
p() = "p"

end
```

这个模块用关键字 `export` 导出了 `x` 和 `y` 函数，此外还有一个没有被导出的函数 `p`。想要将该模块及其内部的函数导入当前模块有以下方法：

| `import` 命令                  | 将哪些变量导入了当前作用域？                                                      | 如何添加或扩展方法              |
|:------------------------------- |:------------------------------------------------------------------------------- |:------------------------------------------- |
| `using MyModule`                | All `export`ed names (`x` and `y`), `MyModule.x`, `MyModule.y` and `MyModule.p` | `MyModule.x`, `MyModule.y` and `MyModule.p` |
| `using MyModule: x, p`          | `x` and `p`                                                                     |                                             |
| `import MyModule`               | `MyModule.x`, `MyModule.y` and `MyModule.p`                                     | `MyModule.x`, `MyModule.y` and `MyModule.p` |
| `import MyModule.x, MyModule.p` | `x` and `p`                                                                     | `x` and `p`                                 |
| `import MyModule: x, p`         | `x` and `p`                                                                     | `x` and `p`                                 |

### 模块和文件

模块与文件和文件名无关；模块只与模块表达式有关。一个模块可以有多个文件，一个文件也可以有多个模块。

```julia
module Foo

include("file1.jl")
include("file2.jl")

end
```

在不同的模块中引入同一段代码，可以提供一种类似 mixin 的行为。我们可以利用这个特性来观察，在不同的定义下，执行同一段代码会有什么结果。例如，在测试的时候，可以使用某些「安全」的运算符。

```julia
module Normal
include("mycode.jl")
end

module Testing
include("safe_operators.jl")
include("mycode.jl")
end
```

### 标准模块

There are three important standard modules:
* [`Core`](@ref) contains all functionality "built into" the language.
* [`Base`](@ref) contains basic functionality that is useful in almost all cases.
* [`Main`](@ref) is the top-level module and the current module, when Julia is started.

### 默认顶层定义以及裸模块

In addition to `using Base`, modules also automatically contain
definitions of the [`eval`](@ref) and [`include`](@ref) functions,
which evaluate expressions/files within the global scope of that module.

If these default definitions are not wanted, modules can be defined using the keyword [`baremodule`](@ref)
instead (note: `Core` is still imported, as per above). In terms of `baremodule`, a standard
`module` looks like this:

```
baremodule Mod

using Base

eval(x) = Core.eval(Mod, x)
include(p) = Base.include(Mod, p)

...

end
```

### 模块的绝对路径和相对路径

给定语句 `using Foo`，系统在顶层模块的内部表中查找名为 `Foo` 的包。如果模块不存在，系统会尝试 `require(:Foo)`，这通常会从已安装的包中加载代码。

但是，某些模块包含子模块，这意味着你有时需要访问非顶层模块。有两种方法可以做到这一点。第一种是使用绝对路径，例如 `using Base.Sort`。第二种是使用相对路径，这样可以更容易地导入当前模块或其任何封闭模块的子模块：

```
module Parent

module Utils
...
end

using .Utils

...
end
```

这里的模块 `Parent` 包含一个子模块 `Utils`，而 `Parent` 中的代码希望 `Utils` 的内容可见，这是可以使用 `using` 加点 `.` 这种相对路径来实现。添加更多的点会移动到模块层次结构中的更上级别。例如，`using ..Utils` 会在 `Parent` 的上级模块中查找 `Utils` 而不是在 `Parent` 中查找。

请注意，相对导入符号 `.` 仅在 `using` 和 `import` 语句中有效。

### 命名空间的相关话题

如果名称是限定的（例如 `Base.sin`），那么即使它没有被导出，我们也可以访问它。这通常在调试时很有用。若函数名也使用这种限定的方式，就可以为其添加方法。但是，对于函数名仅包含符号的情况，例如一个运算符，`Base.+`，由于会出现语法歧义，所以必须使用 `Base.:+` 来引用它。如果运算符的字符不止一个，则必须用括号括起来，例如：`Base.:(==)`。

宏名称在导入和导出语句中用 `@` 编写，例如：`import Mod.@mac`。其它模块中的宏可以用 `Mod.@mac` 或 `@Mod.mac` 触发。

不允许使用 `M.x = y` 这种写法给另一个模块中的全局变量赋值；必须在模块内部才能进行全局变量的赋值。

用 `global x` 声明变量可以仅“保留”名称而不赋值。有些全局变量需要在代码加载后才初始化，这样做可以防止命名冲突。

### 模块初始化和预编译

因为执行模块中的所有语句通常需要编译大量代码，大型模块可能需要几秒钟才能加载。Julia 会创建模块的预编译缓存以减少这个时间。

The incremental precompiled module file are created and used automatically when using `import`
or `using` to load a module.  This will cause it to be automatically compiled the first time
it is imported. Alternatively, you can manually call [`Base.compilecache(modulename)`](@ref). The resulting
cache files will be stored in `DEPOT_PATH[1]/compiled/`. Subsequently, the module is automatically
recompiled upon `using` or `import` whenever any of its dependencies change; dependencies are modules it
imports, the Julia build, files it includes, or explicit dependencies declared by [`include_dependency(path)`](@ref)
in the module file(s).

对于文件依赖，判断是否有变动的方法是：在 `include` 或 `include_dependency` 的时候检查每个文件的变更时间（`mtime`）是否没变，或等于截断变更时间。截断变更时间是指将变更时间截断到最近的一秒，这是由于在某些操作系统中，用 `mtime` 无法获取亚秒级的精度。此外，也会考虑到 `require` 搜索到的文件路径与之前预编译文件中的是否匹配。对于已经加载到当前进程的依赖，即使它们的文件发成了变更，甚至是丢失，Julia 也不会重新编译这些模块，这是为了避免正在运行的系统与预编译缓存之间的不兼容性。

如果你认为预编译自己的模块是**不**安全的（基于下面所说的各种原因），那么你应该在模块文件中添加 `__precompile__(false)`，一般会将其写在文件的最上面。这就可以触发 `Base.compilecache` 报错，并且在直接使用 `using` / `import` 加载的时候跳过预编译和缓存。这样做同时也可以防止其它开启预编译的模块加载此模块。

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

Constants involving most Julia objects that are not produced by [`ccall`](@ref) do not need to be placed
in `__init__`: their definitions can be precompiled and loaded from the cached module image. This
includes complicated heap-allocated objects like arrays. However, any routine that returns a raw
pointer value must be called at runtime for precompilation to work ([`Ptr`](@ref) objects will turn into
null pointers unless they are hidden inside an [`isbits`](@ref) object). This includes the return values
of the Julia functions `cfunction` and [`pointer`](@ref).

Dictionary and set types, or in general anything that depends on the output of a `hash(key)` method,
are a trickier case.  In the common case where the keys are numbers, strings, symbols, ranges,
`Expr`, or compositions of these types (via arrays, tuples, sets, pairs, etc.) they are safe to
precompile.  However, for a few other key types, such as `Function` or `DataType` and generic
user-defined types where you haven't defined a `hash` method, the fallback `hash` method depends
on the memory address of the object (via its `objectid`) and hence may change from run to run.
If you have one of these key types, or if you aren't sure, to be safe you can initialize this
dictionary from within your `__init__` function. Alternatively, you can use the [`IdDict`](@ref)
dictionary type, which is specially handled by precompilation so that it is safe to initialize
at compile-time.

当使用预编译时，我们必须要清楚地区分代码的编译阶段和运行阶段。在此模式下，我们会更清楚发现 Julia 的编译器可以执行任何 Julia 代码，而不是一个用于生成编译后代码的独立的解释器。

其它已知的潜在失败场景包括：

1. Global counters (for example, for attempting to uniquely identify objects). Consider the following
    

   ```julia
   mutable struct UniquedById
       myid::Int
       let counter = 0
           UniquedById() = new(counter += 1)
       end
   end
   ```

   尽管这段代码的目标是给每个实例赋一个唯一的 ID，但计数器的值会在代码编译结束时被记录。任何对此增量编译模块的后续使用，计数器都将从同一个值开始计数。
    
    

   注意 `objectid` （工作原理是 hash 内存指针）也有类似的问题，请查阅下面关于 `Dict` 的用法。
    

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
    
3. 在增量预编译时替换模块是一个运行期间的错误。

一些其他需要注意的点：

1. 在源代码文件本身被修改之后，不会执行代码重载或缓存失效化处理（包括由 [`Pkg.update`] 执行的修改，此外在 [`Pkg.rm`] 执行后也没有清理操作）
   (including by `Pkg.update`), and no cleanup is done after `Pkg.rm`
2. 变形数组的内存共享特性会被预编译忽略（每个数组样貌都会获得一个拷贝）
    
3. 文件系统在编译期间和运行期间被假设为不变的，比如使用 [`@__FILE__`](@ref)/`source_path()` 在运行期间寻找资源、或使用 BinDeps 宏 `@checked_lib`。有时这是不可避免的。但是可能的话，在编译期将资源复制到模块里面是个好做法，这样在运行期间，就不需要去寻找它们了。
    
    
    
4. `WeakRef` 对象和完成器目前在序列化器中无法被恰当地处理（在接下来的发行版中将修复）。
    
5. 通常，最好避免去捕捉内部元数据对象的引用，如 `Method`、`MethodInstance`、`TypeMapLevel`、`TypeMapEntry` 及这些对象的字段，因为这会迷惑序列化器，且可能会引发你不想要的结果。此操作不足以成为一个错误，但你需做好准备：系统会尝试拷贝一部分，然后创建其余部分的单个独立对象。
    
    
    
    

在开发模块时，关闭增量预编译可能会有所帮助。命令行标记 `--compiled-modules={yes|no}` 可以让你切换预编译的开启和关闭。当 Julia 附加 `--compiled-modules=no` 启动，在载入模块和模块依赖时，编译缓存中的序列化模块会被忽略。`Base.compilecache` 仍可以被手动调用。此命令行标记的状态会被传递给 `Pkg.build`，禁止其在安装、更新、显式建立包时触发自动预编译。
