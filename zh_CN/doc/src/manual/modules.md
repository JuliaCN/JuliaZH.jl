# [模块](@id modules)

Julia 中的模块有助于将代码组织成连贯的部分。 它们在语法上以 `module Name ... end` 界定，并具有以下特点：

1. Modules are separate namespaces, each introducing a new global scope. This is useful, because it
   allows the same name to be used for different functions or global variables without conflict, as long as they are in separate modules.

2. Modules have facilities for detailed namespace management: each defines a set of names it
   `export`s, and can import names from other modules with `using` and `import` (we explain these below).

3. Modules can be precompiled for faster loading, and contain code for runtime initialization.

Typically, in larger Julia packages you will see module code organized into files, eg

```julia
module SomeModule

# export, using, import statements are usually here; we discuss these below

include("file1.jl")
include("file2.jl")

end
```

Files and file names are mostly unrelated to modules; modules are associated only with module
expressions. One can have multiple files per module, and multiple modules per file. `include`
behaves as if the contents of the source file were evaluated in the global scope of the
including module. In this chapter, we use short and simplified examples, so we won't use `include`.

The recommended style is not to indent the body of the module, since that would typically lead to
whole files being indented. Also, it is common to use `UpperCamelCase` for module names (just like
types), and use the plural form if applicable, especially if the module contains a similarly named
identifier, to avoid name clashes. For example,

```julia
module FastThings

struct FastThing
    ...
end

end
```

## [Namespace management](@id namespace-management)

Namespace management refers to the facilities the language offers for making names in a module
available in other modules. We discuss the related concepts and functionality below in detail.

### Qualified names

Names for functions, variables and types in the global scope like `sin`, `ARGS`, and
`UnitRange` always belong to a module, called the *parent module*, which can be found
interactively with [`parentmodule`](@ref), for example

```jldoctest
julia> parentmodule(UnitRange)
Base
```

One can also refer to these names outside their parent module by prefixing them with their module,
eg `Base.UnitRange`. This is called a *qualified name*. The parent module may be accessible using a
chain of submodules like `Base.Math.sin`, where `Base.Math` is called the *module path*.
Due to syntactic ambiguities, qualifying a name that contains only symbols, such as an operator,
requires inserting a colon, e.g. `Base.:+`. A small number of operators additionally require
parentheses, e.g. `Base.:(==)`.

If a name is qualified, then it is always *accessible*, and in case of a function, it can also have
methods added to it by using the qualified name as the function name.

Within a module, a variable name can be “reserved” without assigning to it by declaring it as
`global x`. This prevents name conflicts for globals initialized after load time. The syntax
`M.x = y` does not work to assign a global in another module; global assignment is always
module-local.

### Export lists

Names (referring to functions, types, global variables, and constants) can be added to the
*export list* of a module with `export`. Typically, they are at or near the top of the module definition
so that readers of the source code can find them easily, as in

```julia
module NiceStuff

export nice, DOG

struct Dog end      # singleton type, not exported

const DOG = Dog()   # named instance, exported

nice(x) = "nice $x" # function, exported

end
```

but this is just a style suggestion — a module can have multiple `export` statements in arbitrary
locations.

It is common to export names which form part of the API (application programming interface). In
the above code, the export list suggests that users should use `nice` and `DOG`. However, since
qualified names always make identifiers accessible, this is just an option for organizing APIs:
unlike other languages, Julia has no facilities for truly hiding module internals.

Also, some modules don't export names at all. This is usually done if they use common
words, such as `derivative`, in their API, which could easily clash with the export lists of other
modules. We will see how to manage name clashes below.

### Standalone `using` and `import`

Possibly the most common way of loading a module is `using ModuleName`. This [loads](@ref
code-loading) the code associated with `ModuleName`, and brings

1. the module name

2. and the elements of the export list into the surrounding global namespace.

Technically, the statement `using ModuleName` means that a module called `ModuleName` will be
available for resolving names as needed. When a global variable is encountered that has no
definition in the current module, the system will search for it among variables exported by `ModuleName`
and use it if it is found there. This means that all uses of that global within the current
module will resolve to the definition of that variable in `ModuleName`.

To continue with our example,

```julia
using NiceStuff
```

would load the above code, making `NiceStuff` (the module name), `DOG` and `nice` available. `Dog` is not on the export list, but it can be accessed if the name is qualified with the module path (which here is just the module name) as `NiceStuff.Dog`.

Importantly, **`using ModuleName` is the only form for which export lists matter at all**.

In contrast,

```julia
import NiceStuff
```

brings *only* the module name into scope. Users would need to use `NiceStuff.DOG`, `NiceStuff.Dog`, and `NiceStuff.nice` to access its contents. Usually, `import ModuleName` is used in contexts when the user wants to keep the namespace clean.
As we will see in the next section `import NiceStuff` is equivalent to `using NiceStuff: NiceStuff`.

You can combine multiple `using` and `import` statements of the same kind in a comma-separated expression, e.g.

```julia
using LinearAlgebra, Statistics
```

### `using` and `import` with specific identifiers, and adding methods

When `using ModuleName:` or `import ModuleName:` is followed by a comma-separated list of names, the module is loaded, but *only those specific names are brought into the namespace* by the statement. For example,

```julia
using NiceStuff: nice, DOG
```

will import the names `nice` and `DOG`.

Importantly, the module name `NiceStuff` will *not* be in the namespace. If you want to make it accessible, you have to list it explicitly, as
```julia
using NiceStuff: nice, DOG, NiceStuff
```

Julia has two forms for seemingly the same thing because only `import ModuleName: f` allows adding methods to `f`
*without a module path*.
That is to say, the following example will give an error:

```julia
using NiceStuff: nice
struct Cat end
nice(::Cat) = "nice 😸"
```

This error prevents accidentally adding methods to functions in other modules that you only intended to use.

There are two ways to deal with this. You can always qualify function names with a module path:
```julia
using NiceStuff
struct Cat end
NiceStuff.nice(::Cat) = "nice 😸"
```

Alternatively, you can `import` the specific function name:
```julia
import NiceStuff: nice
struct Cat end
nice(::Cat) = "nice 😸"
```

Which one you choose is a matter of style. The first form makes it clear that you are adding a
method to a function in another module (remember, that the imports and the method defintion may be
in separate files), while the second one is shorter, which is especially convenient if you are
defining multiple methods.

一旦一个变量通过 `using` 或 `import` 引入，当前模块就不能创建同名的变量了。而且导入的变量是只读的，给全局变量赋值只能影响到由当前模块拥有的变量，否则会报错。

### Renaming with `as`

An identifier brought into scope by `import` or `using` can be renamed with the keyword `as`.
This is useful for working around name conflicts as well as for shortening names.
For example, `Base` exports the function name `read`, but the CSV.jl package also provides `CSV.read`.
If we are going to invoke CSV reading many times, it would be convenient to drop the `CSV.` qualifier.
But then it is ambiguous whether we are referring to `Base.read` or `CSV.read`:

```julia
julia> read;

julia> import CSV: read
WARNING: ignoring conflicting import of CSV.read into Main
```

Renaming provides a solution:

```julia
julia> import CSV: read as rd
```

Imported packages themselves can also be renamed:

```julia
import BenchmarkTools as BT
```

`as` works with `using` only when a single identifier is brought into scope.
For example `using CSV: read as rd` works, but `using CSV as C` does not, since it operates
on all of the exported names in `CSV`.

### Mixing multiple `using` and `import` statements

When multiple `using` or `import` statements of any of the forms above are used, their effect is combined in the order they appear.
For example,

```julia
using NiceStuff         # exported names and the module name
import NiceStuff: nice  # allows adding methods to unqualified functions
```

would bring all the exported names of `NiceStuff` and the module name itself into scope, and also
allow adding methods to `nice` without prefixing it with a module name.

### Handling name conflicts

Consider the situation where two (or more) packages export the same name, as in

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

The statement `using A, B` works, but when you try to call `f`, you get a warning

```julia
WARNING: both B and A export "f"; uses of it in module Main must be qualified
ERROR: LoadError: UndefVarError: f not defined
```

Here, Julia cannot decide which `f` you are referring to, so you have to make a choice. The following solutions are commonly used:

1. Simply proceed with qualified names like `A.f` and `B.f`. This makes the context clear to the reader of your code, especially if `f` just happens to coincide but has different meaning in various packages. For example, `degree` has various uses in mathematics, the natural sciences, and in everyday life, and these meanings should be kept separate.

2. Use the `as` keyword above to rename one or both identifiers, eg

   ```julia
   using A: f as f
   using B: f as g
   ```

   would make `B.f` available as `g`. Here, we are assuming that you did not use `using A` before,
   which would have brought `f` into the namespace.

3. When the names in question *do* share a meaning, it is common for one module to import it from another, or have a lightweight “base” package with the sole function of defining an interface like this, which can be used by other packages. It is conventional to have such package names end in `...Base` (which has nothing to do with Julia's `Base` module).

### 默认顶层定义以及裸模块

Modules automatically contain `using Core`, `using Base`, and definitions of the [`eval`](@ref)
and [`include`](@ref) functions, which evaluate expressions/files within the global scope of that
module.

If these default definitions are not wanted, modules can be defined using the keyword
[`baremodule`](@ref) instead (note: `Core` is still imported). In terms of
`baremodule`, a standard `module` looks like this:

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
    By default Julia ships with some standard library modules. These behave like regular
    Julia packages except that you don't need to install them explicitly. For example,
    if you wanted to perform some unit testing, you could load the `Test` standard library
    as follows:
    ```julia
    using Test
    ```

## Submodules and relative paths

Modules can contain *submodules*, nesting the same syntax `module ... end`. They can be used to introduce separate namespaces, which can be helpful for organizing complex codebases. Note that each `module` introduces its own [scope](@ref scope-of-variables), so submodules do not automatically “inherit” names from their parent.

It is recommended that submodules refer to other modules within the enclosing parent module (including the latter) using *relative module qualifiers* in `using` and `import` statements. A relative module qualifier starts with a period (`.`), which corresponds to the current module, and each successive `.` leads to the parent of the current module. This should be followed by modules if necessary, and eventually the actual name to access, all separated by `.`s.

Consider the following example, where the submodule `SubA` defines a function, which is then extended in its “sibling” module:

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

You may see code in packages, which, in a similar situation, uses
```julia
import ParentModule.SubA: add_D
```
However, this operates through [code loading](@ref code-loading), and thus only works if `ParentModule` is in a package. It is better to use relative paths.

Note that the order of definitions also matters if you are evaluating values. Consider

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

where `Sub` is trying to use `TestPackage.y` before it was defined, so it does not have a value.

For similar reasons, you cannot use a cyclic ordering:

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

For file dependencies, a change is determined by examining whether the modification time (`mtime`)
of each file loaded by `include` or added explicitly by `include_dependency` is unchanged, or equal
to the modification time truncated to the nearest second (to accommodate systems that can't copy
mtime with sub-second accuracy). It also takes into account whether the path to the file chosen
by the search logic in `require` matches the path that had created the precompile file. It also takes
into account the set of dependencies already loaded into the current process and won't recompile those
modules, even if their files change or disappear, in order to avoid creating incompatibilities between
the running system and the precompile cache.

If you know that a module is *not* safe to precompile
(for example, for one of the reasons described below), you should
put `__precompile__(false)` in the module file (typically placed at the top).
This will cause `Base.compilecache` to throw an error, and will cause `using` / `import` to load it
directly into the current process and skip the precompile and caching.
This also thereby prevents the module from being imported by any other precompiled module.

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
of the Julia functions [`@cfunction`](@ref) and [`pointer`](@ref).

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
