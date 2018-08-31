# [模块](@id modules)

Julia 中的模块（module）是单独的变量工作空间，即它们引入了新的全局作用域。 它们在语法上以 `module Name ... end` 界定。 模块允许你创建顶层定义（也称为全局变量），而无需担心在你的代码与其他人的代码一起使用时产生名字冲突。 在模块中，你可以控制其他模块中的哪些名称可用（通过导入），并指定哪些你的名称是公开的（通过导出）。

下面的示例演示了模块的主要功能。它不需要运行，只是为了说明目的：

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

代码 `using BigLib: thing1, thing2` 显式地将标识符 `thing1` 和 `thing2` 从模块 `BigLib` 中引入到当前作用域。 如果这两个变量是函数的话，那么是允许给他们增加实现方法的，毕竟代码里写的是 "using" （使用）它们，而不是扩展它们。

`import` 关键字所支持的语法与 `using` 一致，不过一次只作用于一个名字。此外它并不会像 `using` 那样将模块添加到搜索空间中，与 `using` 不同的，`import` 引入的函数可以为其增加新的方法。

前面的 `MyModule` 模块中，我们希望给 `show` 函数增加一个方法，于是需要写成 `import Base.show`，这里如果写成 `using` 的话，就不能给 `show` 函数增加一个实现了。

一旦一个变量通过 `using` 或 `import` 引入，当前模块就不能创建同名的变量了。而且导入的变量是只读的，给全局变量赋值只能影响当前模块的变量，否则会报错。

## Summary of module usage

要导入一个模块，可以用 `using` 或 `import` 关键字。为了更好地理解它们的区别，看看下面的例子：

```julia
module MyModule

export x, y

x() = "x"
y() = "y"
p() = "p"

end
```

这个模块用关键字 `export` 导出了 `x` 和 `y` 函数，此外还有一个没有被导出的函数 `p`。想要将该模块及其内部的函数导入当前模块有以下方法：

| `import` 命令                  | 将哪些变量导入了当前作用域？                                                      | Available for method extension              |
|:------------------------------- |:------------------------------------------------------------------------------- |:------------------------------------------- |
| `using MyModule`                | All `export`ed names (`x` and `y`), `MyModule.x`, `MyModule.y` and `MyModule.p` | `MyModule.x`, `MyModule.y` and `MyModule.p` |
| `using MyModule: x, p`          | `x` and `p`                                                                     |                                             |
| `import MyModule`               | `MyModule.x`, `MyModule.y` and `MyModule.p`                                     | `MyModule.x`, `MyModule.y` and `MyModule.p` |
| `import MyModule.x, MyModule.p` | `x` and `p`                                                                     | `x` and `p`                                 |
| `import MyModule: x, p`         | `x` and `p`                                                                     | `x` and `p`                                 |

### 模块和文件

文件和文件名与模块无关；模块只与模块表达式有关。一个模块可以有多个文件，一个文件也可以有多个模块。

```julia
module Foo

include("file1.jl")
include("file2.jl")

end
```

在不同的模块中引入同一段代码，提供了一种类似 mixin 的行为。这可以用于给定不同的base执行同一段代码，例如，在测试的时候，可以运行一些相对 **安全** 的操作符。

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

有三个非常重要的标准模块： Main, Core 和 Base

Main 是最顶层的模块，Julia 启动后会将 Main 设置为当前模块。 在提示符下定义的变量会进入到 Main，执行 `varinfo()` 会列出 Main 中的变量。

Core 包含所有语言内置的标识符（语言的核心部分，不是库），每个模块都默认声明了 `using Core`（否则的话啥也做不了）。

Base 模块包含了一些基本的功能 ( 即源码中 base/ 目录下的内容)。 所有模块都默认包含了 `using Base` ，因为对大多数库来说，都会用到。

### 默认顶层定义以及裸模块

除了默认包含 `using Base` 之外，所有模块都还包含 `eval` 和 `include` 函数。这两个函数用于将表达式和文件引入到全局作用域中

如果这些默认的定义都不需要，那么可以用 `baremodule` 定义裸模块（不过 `Core` 模块仍然被引入领导，否则啥也写不了）。与标准的模块定义类似，一个裸模块的定义如下：

```
baremodule Mod

using Base

eval(x) = Core.eval(Mod, x)
include(p) = Base.include(Mod, p)

...

end
```

### 模块的绝对路径和相对路径

Given the statement `using Foo`, the system consults an internal table of top-level modules
to look for one named `Foo`. If the module does not exist, the system attempts to `require(:Foo)`,
which typically results in loading code from an installed package.

However, some modules contain submodules, which means you sometimes need to access a non-top-level
module. There are two ways to do this. The first is to use an absolute path, for example
`using Base.Sort`. The second is to use a relative path, which makes it easier to import submodules
of the current module or any of its enclosing modules:

```
module Parent

module Utils
...
end

using .Utils

...
end
```

Here module `Parent` contains a submodule `Utils`, and code in `Parent` wants the contents of
`Utils` to be visible. This is done by starting the `using` path with a period. Adding more leading
periods moves up additional levels in the module hierarchy. For example `using ..Utils` would
look for `Utils` in `Parent`'s enclosing module rather than in `Parent` itself.

Note that relative-import qualifiers are only valid in `using` and `import` statements.

### Module file paths

The global variable [`LOAD_PATH`](@ref) contains the directories Julia searches for modules when calling
`require`. It can be extended using [`push!`](@ref):

```julia
push!(LOAD_PATH, "/Path/To/My/Module/")
```

Putting this statement in the file `~/.julia/config/startup.jl` will extend [`LOAD_PATH`](@ref) on
every Julia startup. Alternatively, the module load path can be extended by defining the environment
variable `JULIA_LOAD_PATH`.

### Namespace miscellanea

If a name is qualified (e.g. `Base.sin`), then it can be accessed even if it is not exported.
This is often useful when debugging. It can also have methods added to it by using the qualified
name as the function name. However, due to syntactic ambiguities that arise, if you wish to add
methods to a function in a different module whose name contains only symbols, such as an operator,
`Base.+` for example, you must use `Base.:+` to refer to it. If the operator is more than one
character in length you must surround it in brackets, such as: `Base.:(==)`.

Macro names are written with `@` in import and export statements, e.g. `import Mod.@mac`. Macros
in other modules can be invoked as `Mod.@mac` or `@Mod.mac`.

The syntax `M.x = y` does not work to assign a global in another module; global assignment is
always module-local.

A variable name can be "reserved" without assigning to it by declaring it as `global x`.
This prevents name conflicts for globals initialized after load time.

### Module initialization and precompilation

Large modules can take several seconds to load because executing all of the statements in a module
often involves compiling a large amount of code.
Julia creates precompiled caches of the module to reduce this time.

The incremental precompiled module file are created and used automatically when using `import`
or `using` to load a module.  This will cause it to be automatically compiled the first time
it is imported. Alternatively, you can manually call `Base.compilecache(modulename)`. The resulting
cache files will be stored in `DEPOT_PATH[1]/compiled/`. Subsequently, the module is automatically
recompiled upon `using` or `import` whenever any of its dependencies change; dependencies are modules it
imports, the Julia build, files it includes, or explicit dependencies declared by `include_dependency(path)`
in the module file(s).

For file dependencies, a change is determined by examining whether the modification time (mtime)
of each file loaded by `include` or added explicitly by `include_dependency` is unchanged, or equal
to the modification time truncated to the nearest second (to accommodate systems that can't copy
mtime with sub-second accuracy). It also takes into account whether the path to the file chosen
by the search logic in `require` matches the path that had created the precompile file.

It also takes into account the set of dependencies already loaded into the current process and
won't recompile those modules, even if their files change or disappear, in order to avoid creating
incompatibilities between the running system and the precompile cache. If you want to have changes
to the source reflected in the running system, you should call `reload("Module")` on the module
you changed, and any module that depended on it in which you want to see the change reflected.

If you know that a module is *not* safe to precompile your module
(for example, for one of the reasons described below), you should
put `__precompile__(false)` in the module file (typically placed at the top).
This will cause `Base.compilecache` to throw an error, and will cause `using` / `import` to load it
directly into the current process and skip the precompile and caching.
This also thereby prevents the module from being imported by any other precompiled module.

You may need to be aware of certain behaviors inherent in the creation of incremental shared libraries
which may require care when writing your module. For example, external state is not preserved.
To accommodate this, explicitly separate any initialization steps that must occur at *runtime*
from steps that can occur at *compile time*.
For this purpose, Julia allows you to define an `__init__()` function in your module that executes
any initialization steps that must occur at runtime.
This function will not be called during compilation (`--output-*`).
Effectively, you can assume it will be run exactly once in the lifetime of the code.
You may, of course, call it manually if necessary, but the default is to assume this function deals with computing
state for the local machine, which does not need to be – or even should not be – captured
in the compiled image. It will be called after the module is loaded into a process, including
if it is being loaded into an incremental compile (`--output-incremental=yes`), but not if it
is being loaded into a full-compilation process.

In particular, if you define a `function __init__()` in a module, then Julia will call `__init__()`
immediately *after* the module is loaded (e.g., by `import`, `using`, or `require`) at runtime
for the *first* time (i.e., `__init__` is only called once, and only after all statements in the
module have been executed). Because it is called after the module is fully imported, any submodules
or other imported modules have their `__init__` functions called *before* the `__init__` of the
enclosing module.

Two typical uses of `__init__` are calling runtime initialization functions of external C libraries
and initializing global constants that involve pointers returned by external libraries.  For example,
suppose that we are calling a C library `libfoo` that requires us to call a `foo_init()` initialization
function at runtime. Suppose that we also want to define a global constant `foo_data_ptr` that
holds the return value of a `void *foo_data()` function defined by `libfoo` -- this constant must
be initialized at runtime (not at compile time) because the pointer address will change from run
to run.  You could accomplish this by defining the following `__init__` function in your module:

```julia
const foo_data_ptr = Ref{Ptr{Cvoid}}(0)
function __init__()
    ccall((:foo_init, :libfoo), Cvoid, ())
    foo_data_ptr[] = ccall((:foo_data, :libfoo), Ptr{Cvoid}, ())
    nothing
end
```

Notice that it is perfectly possible to define a global inside a function like `__init__`; this
is one of the advantages of using a dynamic language. But by making it a constant at global scope,
we can ensure that the type is known to the compiler and allow it to generate better optimized
code. Obviously, any other globals in your module that depends on `foo_data_ptr` would also have
to be initialized in `__init__`.

Constants involving most Julia objects that are not produced by `ccall` do not need to be placed
in `__init__`: their definitions can be precompiled and loaded from the cached module image. This
includes complicated heap-allocated objects like arrays. However, any routine that returns a raw
pointer value must be called at runtime for precompilation to work (Ptr objects will turn into
null pointers unless they are hidden inside an isbits object). This includes the return values
of the Julia functions `cfunction` and `pointer`.

Dictionary and set types, or in general anything that depends on the output of a `hash(key)` method,
are a trickier case.  In the common case where the keys are numbers, strings, symbols, ranges,
`Expr`, or compositions of these types (via arrays, tuples, sets, pairs, etc.) they are safe to
precompile.  However, for a few other key types, such as `Function` or `DataType` and generic
user-defined types where you haven't defined a `hash` method, the fallback `hash` method depends
on the memory address of the object (via its `objectid`) and hence may change from run to run.
If you have one of these key types, or if you aren't sure, to be safe you can initialize this
dictionary from within your `__init__` function. Alternatively, you can use the `IdDict`
dictionary type, which is specially handled by precompilation so that it is safe to initialize
at compile-time.

When using precompilation, it is important to keep a clear sense of the distinction between the
compilation phase and the execution phase. In this mode, it will often be much more clearly apparent
that Julia is a compiler which allows execution of arbitrary Julia code, not a standalone interpreter
that also generates compiled code.

Other known potential failure scenarios include:

1. Global counters (for example, for attempting to uniquely identify objects) Consider the following
   code snippet:

   ```julia
   mutable struct UniquedById
       myid::Int
       let counter = 0
           UniquedById() = new(counter += 1)
       end
   end
   ```

   while the intent of this code was to give every instance a unique id, the counter value is recorded
   at the end of compilation. All subsequent usages of this incrementally compiled module will start
   from that same counter value.

   Note that `objectid` (which works by hashing the memory pointer) has similar issues (see notes
   on `Dict` usage below).

   One alternative is to use a macro to capture [`@__MODULE__`](@ref) and store it alone with the current `counter` value,
   however, it may be better to redesign the code to not depend on this global state.
2. Associative collections (such as `Dict` and `Set`) need to be re-hashed in `__init__`. (In the
   future, a mechanism may be provided to register an initializer function.)
3. Depending on compile-time side-effects persisting through load-time. Example include: modifying
   arrays or other variables in other Julia modules; maintaining handles to open files or devices;
   storing pointers to other system resources (including memory);
4. Creating accidental "copies" of global state from another module, by referencing it directly instead
   of via its lookup path. For example, (in global scope):

   ```julia
   #mystdout = Base.stdout #= will not work correctly, since this will copy Base.stdout into this module =#
   # instead use accessor functions:
   getstdout() = Base.stdout #= best option =#
   # or move the assignment into the runtime:
   __init__() = global mystdout = Base.stdout #= also works =#
   ```

Several additional restrictions are placed on the operations that can be done while precompiling
code to help the user avoid other wrong-behavior situations:

1. Calling [`eval`](@ref) to cause a side-effect in another module. This will also cause a warning to be
   emitted when the incremental precompile flag is set.
2. `global const` statements from local scope after `__init__()` has been started (see issue #12010
   for plans to add an error for this)
3. Replacing a module is a runtime error while doing an incremental precompile.

A few other points to be aware of:

1. No code reload / cache invalidation is performed after changes are made to the source files themselves,
   (including by [`Pkg.update`], and no cleanup is done after [`Pkg.rm`]
2. The memory sharing behavior of a reshaped array is disregarded by precompilation (each view gets
   its own copy)
3. Expecting the filesystem to be unchanged between compile-time and runtime e.g. [`@__FILE__`](@ref)/`source_path()`
   to find resources at runtime, or the BinDeps `@checked_lib` macro. Sometimes this is unavoidable.
   However, when possible, it can be good practice to copy resources into the module at compile-time
   so they won't need to be found at runtime.
4. `WeakRef` objects and finalizers are not currently handled properly by the serializer (this will
   be fixed in an upcoming release).
5. It is usually best to avoid capturing references to instances of internal metadata objects such
   as `Method`, `MethodInstance`, `MethodTable`, `TypeMapLevel`, `TypeMapEntry` and fields of those objects,
   as this can confuse the serializer and may not lead to the outcome you desire. It is not necessarily
   an error to do this, but you simply need to be prepared that the system will try to copy some
   of these and to create a single unique instance of others.

It is sometimes helpful during module development to turn off incremental precompilation. The
command line flag `--compiled-modules={yes|no}` enables you to toggle module precompilation on and
off. When Julia is started with `--compiled-modules=no` the serialized modules in the compile cache
are ignored when loading modules and module dependencies. `Base.compilecache` can still be called
manually. The state of this command line flag is passed to `Pkg.build` to disable automatic
precompilation triggering when installing, updating, and explicitly building packages.
