# 嵌入 Julia

正如我们在 [调用 C 和 Fortran 代码](@ref) 中看到的, Julia 有着简单高效的方法来调用 C 编写的函数。但有时恰恰相反，我们需要在 C 中调用 Julia 的函数。这可以将 Julia 代码集成到一个更大的 C/C++ 项目而无需在 C/C++ 中重写所有内容。Julia 有一个 C API 来实现这一目标。几乎所有编程语言都能以某种方式来调用 C 语言的函数，因此 Julia 的 C API 也就能够进行更多语言的桥接。(例如在 Python 或是 C# 中调用 Julia ).

## 高级别嵌入

__Note__: 本节包含可运行在类 Unix 系统上的、使用 C 编写的嵌入式 Julia 代码。Windows 平台请参阅下一节。

我们从一个简单的 C 程序开始初始化 Julia 并调用一些 Julia 代码：

```c
#include <julia.h>
JULIA_DEFINE_FAST_TLS() // only define this once, in an executable (not in a shared library) if you want fast code.

int main(int argc, char *argv[])
{
    /* required: setup the Julia context */
    jl_init();

    /* run Julia commands */
    jl_eval_string("print(sqrt(2.0))");

    /* strongly recommended: notify Julia that the
         program is about to terminate. this allows
         Julia time to cleanup pending write requests
         and run all finalizers
    */
    jl_atexit_hook(0);
    return 0;
}
```

为构建这个程序，你必须将 Julia 头文件的路径放入 include 路径并链接 `libjulia` 。例如 Julia 被安装到 `$JULIA_DIR`，则可以用 `gcc` 来编译上面的测试程序 `test.c`：

```
gcc -o test -fPIC -I$JULIA_DIR/include/julia -L$JULIA_DIR/lib -Wl,-rpath,$JULIA_DIR/lib test.c -ljulia
```

或者查看 Julia 源代码目录 `test/embedding/` 文件夹下的 `embedding.c` 文件。
文件 `ui/repl.c` 则是另一个简单示例，用于设置链接 `libjulia` 时 `jl_options` 的选项 。

在调用任何其他 Julia C 函数之前第一件必须要做的事是初始化 Julia，通过调用 `jl_init` 尝试自动确定 Julia 的安装位置来实现。如果需要自定义位置或指定要加载的系统映像，请改用 `jl_init_with_image`。

测试程序中的第二个语句通过调用 `jl_eval_string` 来执行 Julia 语句。

在程序结束之前，强烈建议调用 `jl_atexit_hook`。上面的示例程序在 `main` 返回之前进行了调用。

!!! note
    现在，动态链接 `libjulia` 的共享库需要传递选项 `RTLD_GLOBAL` 。比如在 Python 中像这样调用：

    ```
    >>> julia=CDLL('./libjulia.dylib',RTLD_GLOBAL)
    >>> julia.jl_init.argtypes = []
    >>> julia.jl_init()
    250593296
    ```

!!! note
    如果 Julia 程序需要访问 主可执行文件 中的符号，那么除了下面描述的由 `julia-config.jl` 生成的标记之外，可能还需要在 Linux 上的编译时添加 `-Wl,--export-dynamic` 链接器标志。编译共享库时则不必要。

### 使用 julia-config 自动确定构建参数

`julia-config.jl` 创建脚本是为了帮助确定使用嵌入的 Julia 程序所需的构建参数。此脚本使用由其调用的特定 Julia 分发的构建参数和系统配置来导出嵌入程序的必要编译器标志以与该分发交互。此脚本位于 Julia 的 share 目录中。

#### 例子

```c
#include <julia.h>

int main(int argc, char *argv[])
{
    jl_init();
    (void)jl_eval_string("println(sqrt(2.0))");
    jl_atexit_hook(0);
    return 0;
}
```

#### 在命令行中

命令行脚本简单用法：假设 `julia-config.jl` 位于 `/usr/local/julia/share/julia`，它可以直接在命令行上调用，并采用 3 个标志的任意组合：

```
/usr/local/julia/share/julia/julia-config.jl
Usage: julia-config [--cflags|--ldflags|--ldlibs]
```

如果上面的示例源代码保存为文件 `embed_example.c`，则以下命令将其编译为 Linux 和 Windows 上运行的程序（MSYS2 环境），或者如果在 OS/X 上，则用 `clang` 替换 `gcc`。：

```
/usr/local/julia/share/julia/julia-config.jl --cflags --ldflags --ldlibs | xargs gcc embed_example.c
```

#### 在 Makefiles 中使用

但通常来说，嵌入的项目会比上面更复杂，因此一般会提供 makefile 支持。由于使用了 **shell** 宏扩展，我们就假设用 GNU make 。
另外，尽管很多时候 `julia-config.jl` 会在目录 `/usr/local` 中出现多次，不过也未必如此，但 Julia 也定位 `julia-config.jl`，并且可以使用 makefile 来利用它。上面的示例程序使用 Makefile 来扩展。：

```makefiles
JL_SHARE = $(shell julia -e 'print(joinpath(Sys.BINDIR, Base.DATAROOTDIR, "julia"))')
CFLAGS += $(shell $(JL_SHARE)/julia-config.jl --cflags)
CXXFLAGS += $(shell $(JL_SHARE)/julia-config.jl --cflags)
LDFLAGS += $(shell $(JL_SHARE)/julia-config.jl --ldflags)
LDLIBS += $(shell $(JL_SHARE)/julia-config.jl --ldlibs)

all: embed_example
```

现在构建的命令就只需要简简单单的`make`了。

## 在 Windows 使用 Visual Studio 进行高级别嵌入

If the `JULIA_DIR` environment variable hasn't been setup, add it using the System panel before
starting Visual Studio. The `bin` folder under JULIA_DIR should be on the system PATH.

We start by opening Visual Studio and creating a new Console Application project. To the 'stdafx.h'
header file, add the following lines at the end:

```c
#include <julia.h>
```

Then, replace the main() function in the project with this code:

```c
int main(int argc, char *argv[])
{
    /* required: setup the Julia context */
    jl_init();

    /* run Julia commands */
    jl_eval_string("print(sqrt(2.0))");

    /* strongly recommended: notify Julia that the
         program is about to terminate. this allows
         Julia time to cleanup pending write requests
         and run all finalizers
    */
    jl_atexit_hook(0);
    return 0;
}
```

The next step is to set up the project to find the Julia include files and the libraries. It's important to
know whether the Julia installation is 32- or 64-bits. Remove any platform configuration that doesn't correspond
to the Julia installation before proceeding.

Using the project Properties dialog, go to `C/C++` | `General` and add `$(JULIA_DIR)\include\julia\` to the
Additional Include Directories property. Then, go to the `Linker` | `General` section and add `$(JULIA_DIR)\lib`
to the Additional Library Directories property. Finally, under `Linker` | `Input`, add `libjulia.dll.a;libopenlibm.dll.a;`
to the list of libraries.

At this point, the project should build and run.

## 转换类型

真正的应用程序不仅仅要执行表达式，还要返回表达式的值给宿主程序。`jl_eval_string` 返回 一个 `jl_value_t*`，它是指向堆分配的 Julia 对象的指针。存储像 [`Float64`](@ref) 这些简单数据类型叫做 `装箱`，然后提取存储的基础类型数据叫 `拆箱`。我们改进的示例程序在 Julia 中计算 2 的平方根，并在 C 中读取回结果，如下所示：

```c
jl_value_t *ret = jl_eval_string("sqrt(2.0)");

if (jl_typeis(ret, jl_float64_type)) {
    double ret_unboxed = jl_unbox_float64(ret);
    printf("sqrt(2.0) in C: %e \n", ret_unboxed);
}
else {
    printf("ERROR: unexpected return type from sqrt(::Float64)\n");
}
```

为了检查 `ret` 是否为特定的 Julia 类型，我们可以使用 `jl_isa`，`jl_typeis` 或 `jl_is_...` 函数。通过输入 `typeof(sqrt(2.0))`到 Julia shell，我们可以看到返回类型是 [`Float64`](@ref)（在C中是 `double` 类型）。要将装箱的 Julia 值转换为 C 的double，上面的代码片段使用了 `jl_unbox_float64`函数。

相应的, 用 `jl_box_...` 函数是另一种转换的方式。

```c
jl_value_t *a = jl_box_float64(3.0);
jl_value_t *b = jl_box_float32(3.0f);
jl_value_t *c = jl_box_int32(3);
```

正如我们将在下面看到的那样，装箱需要在调用 Julia 函数时使用特定参数。

## 调用 Julia 函数

虽然 `jl_eval_string` 允许 C 获取 Julia 表达式的结果，但它不允许将在 C 中计算的参数传递给 Julia。因此需要使用 `jl_call` 来直接调用Julia函数：

```c
jl_function_t *func = jl_get_function(jl_base_module, "sqrt");
jl_value_t *argument = jl_box_float64(2.0);
jl_value_t *ret = jl_call1(func, argument);
```

在第一步中，通过调用 `jl_get_function` 检索出 Julia 函数 `sqrt` 的句柄(handle)。
传递给 `jl_get_function` 的第一个参数是 指向 定义`sqrt`所在的 `Base` 模块 的指针。
然后，double 值通过 `jl_box_float64` 被装箱。
最后，使用 `jl_call1` 调用该函数。也有 `jl_call0`，`jl_call2`和`jl_call3` 函数，方便地处理不同数量的参数。
要传递更多参数，使用 `jl_call`：

```c
jl_value_t *jl_call(jl_function_t *f, jl_value_t **args, int32_t nargs)
```

它的第二个参数 `args` 是 `jl_value_t*` 类型的数组，`nargs` 是参数的个数 

## 内存管理

正如我们所见，Julia 对象在 C 中表示为指针。这就出现了 谁来负责释放这些对象的问题。

通常，Julia 对象由垃圾收集器（GC）释放，但 GC 不会自动就懂我们正C中保留对Julia值的引用。这意味着 GC 会在你的掌控之外释放对象，从而使指针无效。

The GC can only run when Julia objects are allocated. Calls like `jl_box_float64` perform allocation,
and allocation might also happen at any point in running Julia code. However, it is generally
safe to use pointers in between `jl_...` calls. But in order to make sure that values can survive
`jl_...` calls, we have to tell Julia that we still hold a reference to Julia
[root](https://www.cs.purdue.edu/homes/hosking/690M/p611-fenichel.pdf) values, a process
called "GC rooting". Rooting a value will ensure that the garbage collector does not accidentally
identify this value as unused and free the memory backing that value. This can be done using the
`JL_GC_PUSH` macros:

```c
jl_value_t *ret = jl_eval_string("sqrt(2.0)");
JL_GC_PUSH1(&ret);
// Do something with ret
JL_GC_POP();
```

The `JL_GC_POP` call releases the references established by the previous `JL_GC_PUSH`. Note that
`JL_GC_PUSH` stores references on the C stack, so it must be exactly paired with a `JL_GC_POP`
before the scope is exited. That is, before the function returns, or control flow otherwise
leaves the block in which the `JL_GC_PUSH` was invoked.

Several Julia values can be pushed at once using the `JL_GC_PUSH2` , `JL_GC_PUSH3` , `JL_GC_PUSH4` ,
`JL_GC_PUSH5` , and `JL_GC_PUSH6` macros. To push an array of Julia values one can use the
`JL_GC_PUSHARGS` macro, which can be used as follows:

```c
jl_value_t **args;
JL_GC_PUSHARGS(args, 2); // args can now hold 2 `jl_value_t*` objects
args[0] = some_value;
args[1] = some_other_value;
// Do something with args (e.g. call jl_... functions)
JL_GC_POP();
```

Each scope must have only one call to `JL_GC_PUSH*`. Hence, if all variables cannot be pushed once by
a single call to `JL_GC_PUSH*`, or if there are more than 6 variables to be pushed and using an array
of arguments is not an option, then one can use inner blocks:

```c
jl_value_t *ret1 = jl_eval_string("sqrt(2.0)");
JL_GC_PUSH1(&ret1);
jl_value_t *ret2 = 0;
{
    jl_function_t *func = jl_get_function(jl_base_module, "exp");
    ret2 = jl_call1(func, ret1);
    JL_GC_PUSH1(&ret2);
    // Do something with ret2.
    JL_GC_POP();    // This pops ret2.
}
JL_GC_POP();    // This pops ret1.
```

If it is required to hold the pointer to a variable between functions (or block scopes), then it is
not possible to use `JL_GC_PUSH*`. In this case, it is necessary to create and keep a reference to the
variable in the Julia global scope. One simple way to accomplish this is to use a global `IdDict` that
will hold the references, avoiding deallocation by the GC. However, this method will only work
properly with mutable types.

```c
// This functions shall be executed only once, during the initialization.
jl_value_t* refs = jl_eval_string("refs = IdDict()");
jl_function_t* setindex = jl_get_function(jl_base_module, "setindex!");

...

// `var` is the variable we want to protect between function calls.
jl_value_t* var = 0;

...

// `var` is a `Vector{Float64}`, which is mutable.
var = jl_eval_string("[sqrt(2.0); sqrt(4.0); sqrt(6.0)]");

// To protect `var`, add its reference to `refs`.
jl_call3(setindex, refs, var, var);
```

If the variable is immutable, then it needs to be wrapped in an equivalent mutable container or,
preferably, in a `RefValue{Any}` before it is pushed to `IdDict`. In this approach, the container has
to be created or filled in via C code using, for example, the function `jl_new_struct`. If the
container is created by `jl_call*`, then you will need to reload the pointer to be used in C code.

```c
// This functions shall be executed only once, during the initialization.
jl_value_t* refs = jl_eval_string("refs = IdDict()");
jl_function_t* setindex = jl_get_function(jl_base_module, "setindex!");
jl_datatype_t* reft = (jl_datatype_t*)jl_eval_string("Base.RefValue{Any}");

...

// `var` is the variable we want to protect between function calls.
jl_value_t* var = 0;

...

// `var` is a `Float64`, which is immutable.
var = jl_eval_string("sqrt(2.0)");

// Protect `var` until we add its reference to `refs`.
JL_GC_PUSH1(&var);

// Wrap `var` in `RefValue{Any}` and push to `refs` to protect it.
jl_value_t* rvar = jl_new_struct(reft, var);
JL_GC_POP();

jl_call3(setindex, refs, rvar, rvar);
```

The GC can be allowed to deallocate a variable by removing the reference to it from `refs` using
the function `delete!`, provided that no other reference to the variable is kept anywhere:

```c
jl_function_t* delete = jl_get_function(jl_base_module, "delete!");
jl_call2(delete, refs, rvar);
```

As an alternative for very simple cases, it is possible to just create a global container of type
`Vector{Any}` and fetch the elements from that when necessary, or even to create one global variable
per pointer using

```c
jl_set_global(jl_main_module, jl_symbol("var"), var);
```

### Updating fields of GC-managed objects

The garbage collector operates under the assumption that it is aware of every old-generation
object pointing to a young-generation one. Any time a pointer is updated breaking that assumption,
it must be signaled to the collector with the `jl_gc_wb` (write barrier) function like so:

```c
jl_value_t *parent = some_old_value, *child = some_young_value;
((some_specific_type*)parent)->field = child;
jl_gc_wb(parent, child);
```

通常情况下不可能在运行时预测 值是否是旧的，因此 写屏障 必须被插入在所有显式存储之后。一个需要注意的例外是如果 `parent` 对象刚分配，垃圾收集之后并不执行。请记住大多数 `jl_...` 函数有时候都会执行垃圾收集。

直接更新数据时，对于指针数组来说 写屏障 也是必需的 例如：

```c
jl_array_t *some_array = ...; // e.g. a Vector{Any}
void **data = (void**)jl_array_data(some_array);
jl_value_t *some_value = ...;
data[0] = some_value;
jl_gc_wb(some_array, some_value);
```

### 控制垃圾收集器

有一些函数能够控制GC。在正常使用情况下这些不是必要的。

| 函数             | 描述                                  |
|:-------------------- |:-------------------------------------------- |
| `jl_gc_collect()`    | 强制执行 GC                               |
| `jl_gc_enable(0)`    | 禁用 GC， 返回前一个状态作为 int 类型 |
| `jl_gc_enable(1)`    | 启用 GC， 返回前一个状态作为 int 类型 |
| `jl_gc_is_enabled()` | 返回当前状态作为 int 类型                  |

## 使用数组

Julia 和 C 可以不通过复制而共享数组数据。下面一个例子将展示它是如何工作的。

Julia数组用数据类型 `jl_array_t *` 表示。基本上，`jl_array_t` 是一个包含以下内容的结构：

  * 关于数据类型的信息
  * 指向数据块的指针
  * 关于数组长度的信息

为了让事情比较简单，我们从一维数组开始，创建一个存有 10 个 FLoat64 类型的数组如下所示：

```c
jl_value_t* array_type = jl_apply_array_type((jl_value_t*)jl_float64_type, 1);
jl_array_t* x          = jl_alloc_array_1d(array_type, 10);
```

或者，如果您已经分配了数组，则可以生成一个简易的包装器来包裹其数据：

```c
double *existingArray = (double*)malloc(sizeof(double)*10);
jl_array_t *x = jl_ptr_to_array_1d(array_type, existingArray, 10, 0);
```

最后一个参数是一个布尔值，表示 Julia 是否应该获取数据的所有权。 如果这个参数 不为零，当数组不再被引用时，GC 会在数据的指针上调用 `free` 。

为了访问 x 的数据，我们可以使用 `jl_array_data`：

```c
double *xData = (double*)jl_array_data(x);
```

现在我们可以填充这个数组：

```c
for(size_t i=0; i<jl_array_len(x); i++)
    xData[i] = i;
```

现在让我们调用一个对 `x` 就地操作的 Julia 函数：

```c
jl_function_t *func = jl_get_function(jl_base_module, "reverse!");
jl_call1(func, (jl_value_t*)x);
```

通过打印数组，可以验证 `x` 的元素现在是否已被逆置 (reversed)。

### 获取返回的数组

如果 Julia 函数返回一个数组，`jl_eval_string` 和 `jl_call` 的返回值可以被强制转换为`jl_array_t *`：

```c
jl_function_t *func  = jl_get_function(jl_base_module, "reverse");
jl_array_t *y = (jl_array_t*)jl_call1(func, (jl_value_t*)x);
```

现在使用 `jl_array_data` 可以像前面一样访问 `y` 的内容。一如既往地，一定要在使用数组的时候确保 持有使用数组的引用。

### 多维数组

Julia的多维数组以 列序优先 存储在内存中。这是一些 创建一个2D数组并访问其属性 的代码：

```c
// Create 2D array of float64 type
jl_value_t *array_type = jl_apply_array_type(jl_float64_type, 2);
jl_array_t *x  = jl_alloc_array_2d(array_type, 10, 5);

// Get array pointer
double *p = (double*)jl_array_data(x);
// Get number of dimensions
int ndims = jl_array_ndims(x);
// Get the size of the i-th dim
size_t size0 = jl_array_dim(x,0);
size_t size1 = jl_array_dim(x,1);

// Fill array with data
for(size_t i=0; i<size1; i++)
    for(size_t j=0; j<size0; j++)
        p[j + size0*i] = i + j;
```

请注意，虽然 Julia 的数组使用基于 1 的索引，但C API 中使用基于 0 的索引（例如 在调用`jl_array_dim`）以便用C代码的习惯来阅读。

## 异常

Julia 代码可以抛出异常。比如：

```c
jl_eval_string("this_function_does_not_exist()");
```

这个调用似乎什么都没做。但可以检查异常是否抛出：

```c
if (jl_exception_occurred())
    printf("%s \n", jl_typeof_str(jl_exception_occurred()));
```

如果您使用 支持异常的语言的 Julia C API（例如Python，C＃，C ++），使用 检查是否有异常的函数 将每个调用 包装到 `libjulia` 中是有意义的，然后异常在宿主语言中重新抛出。

### 抛出 Julia 异常

在编写 Julia 可调用函数时，可能需要验证参数 并抛出异常表示错误。
典型的类型检查像这样：

```c
if (!jl_typeis(val, jl_float64_type)) {
    jl_type_error(function_name, (jl_value_t*)jl_float64_type, val);
}
```

可以使用以下函数 引发一般异常：

```c
void jl_error(const char *str);
void jl_errorf(const char *fmt, ...);
```

`jl_error`采用 C 字符串，而 `jl_errorf` 像 `printf` 一样调用:


```c
jl_errorf("argument x = %d is too large", x);
```

在这个例子中假定 `x` 是一个 int 值。

