# 与其他语言的显著差异

## 与 MATLAB 的显著差异

虽然 MATLAB 用户可能会发现 Julia 的语法很熟悉，但 Julia 不是 MATLAB 的克隆。 它们之间存在重大的语法和功能差异。 以下是一些可能会使习惯于 MATLAB 的 Julia 用户感到困扰的显著差异：

  * Julia 数组使用方括号 `A[i,j]` 进行索引。
  * Julia 的数组在赋值给另一个变量时不发生复制。执行 `A = B` 后，改变 `B` 中元素也会修改 `A`。
     
  * Julia 的值在向函数传递时不发生复制。如果某个函数修改了数组，这一修改对调用者是可见的。
     
  * Julia 不会在赋值语句中自动增长数组。 而在 MATLAB 中 `a(4) = 3.2` 可以创建数组 `a = [0 0 0 3.2]`，而 `a(5) = 7` 可以将它增长为 `a = [0 0 0 3.2 7]`。如果 `a` 的长度小于 5 或者这个语句是第一次使用标识符 `a`，则相应的 Julia 语句 `a[5] = 7` 会抛出错误。Julia 使用 [`push!`](@ref) 和 [`append!`](@ref) 来增长 `Vector`，它们比 MATLAB 的 `a(end+1) = val` 更高效。
     
     
     
     
  * 虚数单位 `sqrt(-1)` 在Julia中表示为 [`im`](@ref)，而不是在 MATLAB 中的 `i` 或 `j`。
  * 在 Julia 中，没有小数点的数字字面量（例如 `42`）会创建整数而不是浮点数。也支持任意大整数字面量。因此，某些操作（如 `2^-1`）将抛出 domain error，因为结果不是整数（有关的详细信息，请参阅[常见问题中有关 domain errors 的条目](@ref faq-domain-errors)）。
     
     
     
  * 在 Julia 中，能返回多个值并将其赋值为元组，例如 `(a, b) = (1, 2)` 或 `a, b = 1, 2`。
    在 Julia 中不存在 MATLAB 的 `nargout`，它通常在 MATLAB 中用于根据返回值的数量执行可选工作。取而代之的是，用户可以使用可选参数和关键字参数来实现类似的功能。
     
     
  * Julia 拥有真正的一维数组。 列向量的大小为 `N`，而不是 `Nx1`。
    例如，[`rand(N)`](@ref) 创建一个一维数组。
  * 在 Julia 中，`[x,y,z]` 将始终构造一个包含`x`，`y` 和 `z` 的3元素数组。
    - 要在第一个维度（“垂直列”）中连接元素，请使用 [`vcat(x,y,z)`](@ref) 或用分号分隔（`[x; y; z]`）。
      with semicolons (`[x; y; z]`).
    - 要在第二个维度（“水平行”）中连接元素，请使用 [`hcat(x,y,z)`](@ref) 或用空格分隔（`[x y z]`）。
      with spaces (`[x y z]`).
    - 要构造块矩阵（在前两个维度中连接元素），请使用 [`hvcat`](@ref)或组合空格和分号（`[a b; c d]`）。
      or combine spaces and semicolons (`[a b; c d]`).
  * 在 Julia 中，`a:b` 和 `a:b:c` 构造 `AbstractRange` 对象。使用 [`collect(a:b)`](@ref) 构造一个类似 MATLAB 中完整的向量。
    通常，不需要调用 `collect`。
    在大多数情况下，`AbstractRange` 对象将像普通数组一样运行，但效率更高，因为它是懒惰求值。
    这种创建专用对象而不是完整数组的模式经常被使用，并且
    也可以在诸如 [`range`](@ref) 之类的函数中看到，或者在诸如 `enumerate` 和 `zip` 之类的迭代器中看到。
    特殊对象大多可以像正常数组一样使用。
  * Julia 中的函数返回其最后一个表达式或 `return` 关键字的值而无需
    在函数定义中列出要返回的变量的名称（有关详细信息，请参阅 [The return Keyword](@ref)）。
     
  * Julia 脚本可以包含任意数量的函数，并且在加载文件时，所有定义都将在外部可见。
    可以从当前工作目录之外的文件加载函数定义。
    directory.
  * 在Julia中，例如 [`sum`](@ref)、[`prod`](@ref)和[`max`](@ref)的归约操作会作用到数组的每一个元素上，当调用时只有一个函数，例如`sum(A)`，即使`A`并不只有一个维度。
    over every element of an array when called with a single argument, as in `sum(A)`, even if `A`
    has more than one dimension.
  * 在Julia中，调用无参数的函数时必须使用小括号，例如 [`rand()`](@ref)。
  * Julia不鼓励使用分号来结束语句。
    语句的结果不会自动打印（除了在REPL中），并且代码的一行不必使用分号结尾。
    [`println`](@ref) 或者 [`@printf`](@ref) 能用来打印特定输出。
  * 在Julia中，如果`A`和`B`是数组，像`A == B`这样的逻辑比较运算符不会返回布尔值数组。
    相反地，请使用`A .== B`。对于其他的像是[`<`](@ref)、[`>`](@ref) 和 `=` 的布尔运算符同理。
    [`<`](@ref), [`>`](@ref) and `=`.
  * 在Julia中，运算符[`&`](@ref)、 [`|`](@ref) 和 [`⊻`](@ref xor) ([`xor`](@ref))进行按位操作，
    分别与MATLAB中的`and`、`or` 和 `xor` 等价，并且优先级
    与Python的按位运算符相似（不像C）。他们可以对标量运算
    或者数组中逐元素运算，可以用来合并逻辑数组，但是注意运算顺序的区别：
    parentheses may be required (e.g., to select elements of `A` equal to 1 or 2 use `(A .== 1) .| (A .== 2)`).
  * In Julia, the elements of a collection can be passed as arguments to a function using the splat
    operator `...`, as in `xs=[1,2]; f(xs...)`.
  * Julia's [`svd`](@ref) returns singular values as a vector instead of as a dense diagonal matrix.
  * In Julia, `...` is not used to continue lines of code. Instead, incomplete expressions automatically
    continue onto the next line.
  * In both Julia and MATLAB, the variable `ans` is set to the value of the last expression issued
    in an interactive session. In Julia, unlike MATLAB, `ans` is not set when Julia code is run in
    non-interactive mode.
  * Julia's `struct`s do not support dynamically adding fields at runtime, unlike MATLAB's `class`es.
    Instead, use a [`Dict`](@ref).
  * In Julia each module has its own global scope/namespace, whereas in MATLAB there is just one global
    scope.
  * In MATLAB, an idiomatic way to remove unwanted values is to use logical indexing, like in the
    expression `x(x>3)` or in the statement `x(x>3) = []` to modify `x` in-place. In contrast, Julia
    provides the higher order functions [`filter`](@ref) and [`filter!`](@ref), allowing users
    to write `filter(z->z>3, x)` and `filter!(z->z>3, x)` as alternatives to the corresponding transliterations
    `x[x.>3]` and `x = x[x.>3]`. Using [`filter!`](@ref) reduces the use of temporary arrays.
  * The analogue of extracting (or "dereferencing") all elements of a cell array, e.g. in `vertcat(A{:})`
    in MATLAB, is written using the splat operator in Julia, e.g. as `vcat(A...)`.

## 与 R 的显著差异

One of Julia's goals is to provide an effective language for data analysis and statistical programming.
For users coming to Julia from R, these are some noteworthy differences:

  * Julia's single quotes enclose characters, not strings.
  * Julia can create substrings by indexing into strings. In R, strings must be converted into character
    vectors before creating substrings.
  * In Julia, like Python but unlike R, strings can be created with triple quotes `""" ... """`. This
    syntax is convenient for constructing strings that contain line breaks.
  * In Julia, varargs are specified using the splat operator `...`, which always follows the name
    of a specific variable, unlike R, for which `...` can occur in isolation.
  * In Julia, modulus is `mod(a, b)`, not `a %% b`. `%` in Julia is the remainder operator.
  * In Julia, not all data structures support logical indexing. Furthermore, logical indexing in Julia
    is supported only with vectors of length equal to the object being indexed. For example:

      * In R, `c(1, 2, 3, 4)[c(TRUE, FALSE)]` is equivalent to `c(1, 3)`.
      * In R, `c(1, 2, 3, 4)[c(TRUE, FALSE, TRUE, FALSE)]` is equivalent to `c(1, 3)`.
      * In Julia, `[1, 2, 3, 4][[true, false]]` throws a [`BoundsError`](@ref).
      * In Julia, `[1, 2, 3, 4][[true, false, true, false]]` produces `[1, 3]`.
  * Like many languages, Julia does not always allow operations on vectors of different lengths, unlike
    R where the vectors only need to share a common index range.  For example, `c(1, 2, 3, 4) + c(1, 2)`
    is valid R but the equivalent `[1, 2, 3, 4] + [1, 2]` will throw an error in Julia.
  * Julia allows an optional trailing comma when that comma does not change the meaning of code.
    This can cause confusion among R users when indexing into arrays. For example, `x[1,]` in R
    would return the first row of a matrix; in Julia, however, the comma is ignored, so
    `x[1,] == x[1]`, and will return the first element. To extract a row, be sure to use `:`, as in `x[1,:]`.
  * Julia's [`map`](@ref) takes the function first, then its arguments, unlike `lapply(<structure>, function, ...)`
    in R. Similarly Julia's equivalent of `apply(X, MARGIN, FUN, ...)` in R is [`mapslices`](@ref)
    where the function is the first argument.
  * Multivariate apply in R, e.g. `mapply(choose, 11:13, 1:3)`, can be written as `broadcast(binomial, 11:13, 1:3)`
    in Julia. Equivalently Julia offers a shorter dot syntax for vectorizing functions `binomial.(11:13, 1:3)`.
  * Julia uses `end` to denote the end of conditional blocks, like `if`, loop blocks, like `while`/
    `for`, and functions. In lieu of the one-line `if ( cond ) statement`, Julia allows statements
    of the form `if cond; statement; end`, `cond && statement` and `!cond || statement`. Assignment
    statements in the latter two syntaxes must be explicitly wrapped in parentheses, e.g. `cond && (x = value)`.
  * In Julia, `<-`, `<<-` and `->` are not assignment operators.
  * Julia's `->` creates an anonymous function.
  * Julia constructs vectors using brackets. Julia's `[1, 2, 3]` is the equivalent of R's `c(1, 2, 3)`.
  * Julia's [`*`](@ref) operator can perform matrix multiplication, unlike in R. If `A` and `B` are
    matrices, then `A * B` denotes a matrix multiplication in Julia, equivalent to R's `A %*% B`.
    In R, this same notation would perform an element-wise (Hadamard) product. To get the element-wise
    multiplication operation, you need to write `A .* B` in Julia.
  * Julia performs matrix transposition using the `transpose` function and conjugated transposition using
    the `'` operator or the `adjoint` function. Julia's `transpose(A)` is therefore equivalent to R's `t(A)`.
    Additionally a non-recursive transpose in Julia is provided by the `permutedims` function.
  * Julia does not require parentheses when writing `if` statements or `for`/`while` loops: use `for i in [1, 2, 3]`
    instead of `for (i in c(1, 2, 3))` and `if i == 1` instead of `if (i == 1)`.
  * Julia does not treat the numbers `0` and `1` as Booleans. You cannot write `if (1)` in Julia,
    because `if` statements accept only booleans. Instead, you can write `if true`, `if Bool(1)`,
    or `if 1==1`.
  * Julia does not provide `nrow` and `ncol`. Instead, use `size(M, 1)` for `nrow(M)` and `size(M, 2)`
    for `ncol(M)`.
  * Julia is careful to distinguish scalars, vectors and matrices.  In R, `1` and `c(1)` are the same.
    In Julia, they cannot be used interchangeably.
  * Julia's [`diag`](@ref) and [`diagm`](@ref) are not like R's.
  * Julia cannot assign to the results of function calls on the left hand side of an assignment operation:
    you cannot write `diag(M) = fill(1, n)`.
  * Julia discourages populating the main namespace with functions. Most statistical functionality
    for Julia is found in [packages](https://pkg.julialang.org/) under the [JuliaStats organization](https://github.com/JuliaStats).
    例如：

      * Functions pertaining to probability distributions are provided by the [Distributions package](https://github.com/JuliaStats/Distributions.jl).
      * The [DataFrames package](https://github.com/JuliaStats/DataFrames.jl) provides data frames.
      * Generalized linear models are provided by the [GLM package](https://github.com/JuliaStats/GLM.jl).
  * Julia provides tuples and real hash tables, but not R-style lists. When returning multiple items,
    you should typically use a tuple or a named tuple: instead of `list(a = 1, b = 2)`, use `(1, 2)`
    or `(a=1, b=2)`.
  * Julia encourages users to write their own types, which are easier to use than S3 or S4 objects
    in R. Julia's multiple dispatch system means that `table(x::TypeA)` and `table(x::TypeB)` act
    like R's `table.TypeA(x)` and `table.TypeB(x)`.
  * In Julia, values are not copied when assigned or passed to a function. If a function modifies an array, the changes
    will be visible in the caller. This is very different from R and allows new functions to operate
    on large data structures much more efficiently.
  * In Julia, vectors and matrices are concatenated using [`hcat`](@ref), [`vcat`](@ref) and
    [`hvcat`](@ref), not `c`, `rbind` and `cbind` like in R.
  * In Julia, a range like `a:b` is not shorthand for a vector like in R, but is a specialized `AbstractRange`
    object that is used for iteration without high memory overhead. To convert a range into a vector, use
    [`collect(a:b)`](@ref).
  * Julia's [`max`](@ref) and [`min`](@ref) are the equivalent of `pmax` and `pmin` respectively
    in R, but both arguments need to have the same dimensions.  While [`maximum`](@ref) and [`minimum`](@ref)
    replace `max` and `min` in R, there are important differences.
  * Julia's [`sum`](@ref), [`prod`](@ref), [`maximum`](@ref), and [`minimum`](@ref) are different
    from their counterparts in R. They all accept one or two arguments. The first argument is an iterable
    collection such as an array.  If there is a second argument, then this argument indicates the
    dimensions, over which the operation is carried out.  For instance, let `A = [1 2; 3 4]` in Julia
    and `B <- rbind(c(1,2),c(3,4))` be the same matrix in R.  Then `sum(A)` gives the same result as
    `sum(B)`, but `sum(A, dims=1)` is a row vector containing the sum over each column and `sum(A, dims=2)`
    is a column vector containing the sum over each row. This contrasts to the behavior of R, where separate
    `colSums(B)` and `rowSums(B)` functions provide these functionalities. If the `dims` keyword argument is a
    vector, then it specifies all the dimensions over which the sum is performed, while retaining the
    dimensions of the summed array, e.g. `sum(A, dims=(1,2)) == hcat(10)`. It should be noted that there is no
    error checking regarding the second argument.
  * Julia has several functions that can mutate their arguments. For example, it has both [`sort`](@ref)
    and [`sort!`](@ref).
  * In R, performance requires vectorization. In Julia, almost the opposite is true: the best performing
    code is often achieved by using devectorized loops.
  * Julia is eagerly evaluated and does not support R-style lazy evaluation. For most users, this
    means that there are very few unquoted expressions or column names.
  * Julia does not support the `NULL` type. The closest equivalent is [`nothing`](@ref), but it
    behaves like a scalar value rather than like a list. Use `x == nothing` instead of `is.null(x)`.
  * In Julia, missing values are represented by the [`missing`](@ref) object rather than by `NA`.
    Use [`ismissing(x)`](@ref) instead of `isna(x)`. The [`skipmissing`](@ref) function is generally
    used instead of `na.rm=TRUE` (though in some particular cases functions take a `skipmissing`
    argument).
  * Julia lacks the equivalent of R's `assign` or `get`.
  * In Julia, `return` does not require parentheses.
  * In R, an idiomatic way to remove unwanted values is to use logical indexing, like in the expression
    `x[x>3]` or in the statement `x = x[x>3]` to modify `x` in-place. In contrast, Julia provides
    the higher order functions [`filter`](@ref) and [`filter!`](@ref), allowing users to write
    `filter(z->z>3, x)` and `filter!(z->z>3, x)` as alternatives to the corresponding transliterations
    `x[x.>3]` and `x = x[x.>3]`. Using [`filter!`](@ref) reduces the use of temporary arrays.

## 与 Python 的显著差异

  * Julia 需要用 `end` 来结束代码块。与 Python 不同，Julia 没有 `pass` 关键字。
  * 在 Julia 中，数组、字符串等的索引从 1 开始，而不是从 0 开始。
  * Julia 的切片索引包含最后一个元素，这与 Python 不同。Julia 中的 `a[2:3]` 就是 Python 中的 `a[1:3]`。
     
  * Julia 不支持负数索引。特别地，列表或数组的最后一个元素在 Julia 中使用 `end` 索引，而不像在 Python 中使用 `-1`。
     
  * Julia 的 `for`、`if`、`while`等代码块由`end`关键字终止。缩进级别并不像在 Python 中那么重要。
     
  * Julia 没有用来续行的语法：如果在行的末尾，到目前为止的输入是一个完整的表达式，则认为已经结束；否则，认为输入继续。强制表达式继续的一种方式是将其包含在括号中。
     
     
  * 默认情况下，Julia 数组是列优先的（Fortran 顺序），而 NumPy 数组是行优先（C 顺序）。为了在循环数组时获得最佳性能，循环顺序应该在 Julia 中相对于 NumPy 反转（请参阅 [Performance Tips](@ref man-performance-tips) 中的对应章节）。
     
     
  * Julia 的更新运算符（例如 `+=`，`-=`，···）是 *not in-place*，而 Numpy 的是。这意味着 `A = [1, 1]; B = A; B += [3, 3]` 不会改变 `A` 中的值，而将名称 `B` 重新绑定到右侧表达式 `B = B + 3` 的结果，这是一个新的数组。对于 in-place 操作，使用 `B .+= 3`（另请参阅 [dot operators](@ref man-dot-operators)）、显式的循环或者 `InplaceOps.jl`。
     
     
     
  * 每次调用方法时，Julia 都会计算函数参数的默认值，不像在 Python 中，默认值只会在函数定义时被计算一次。例如，每次无输入参数调用时，函数`f(x=rand()) = x`都返回一个新的随机数在另一方面，函数 `g(x=[1,2]) = push!(x,3)` 在每次以 `g()` 调用时返回 `[1,2,3]`。
     
     
     
     
  * 在 Julia 中，`%` 是余数运算符，而在 Python 中是模运算符。

## 与 C/C++ 的显著差异

  * Julia 的数组由方括号索引，方括号中可以包含不止一个维度 `A[i,j]`。
    这样的语法不仅仅是像 C/C++ 中那样对指针或者地址引用的语法糖，参见
    Julia 文档数组构造的语法（依版本不同有所变动）。
  * 在 Julia 中，数组、字符串等的索引从 1 开始，而不是从 0 开始。
  * Julia 的数组在赋值给另一个变量时不发生复制。执行 `A = B` 后，改变 `B` 中元素也会修改 `A`。像 `+=` 这样的更新运算符不会以 in-place 的方式执行，而是相当于 `A = A + B`，将左侧绑定到右侧表达式的计算结果上。
    as well. Updating operators like `+=` do not operate in-place, they are equivalent to `A = A + B`
    which rebinds the left-hand side to the result of the right-hand side expression.
  * Julia 的数组是行优先的（Fortran 顺序），而 C/C++ 的数组默认是列优先的。要使数组上的循环性能最优，在 Julia 中循环的顺序应该与 C/C++ 相反（参见 [性能建议](@ref man-performance-tips)）。
    default. To get optimal performance when looping over arrays, the order of the loops should be
    reversed in Julia relative to C/C++ (see relevant section of [Performance Tips](@ref man-performance-tips)).
  * Julia 的值在赋值或向函数传递时不发生复制。如果某个函数修改了数组，这一修改
    对调用者是可见的。
  * 在 Julia 中，空格是有意义的，这与 C/C++ 不同，所以向 Julia 程序中添加或删除空格时必须谨慎。
    whitespace from a Julia program.
  * 在 Julia 中，没有小数点的数值字面量（如 `42`）生成有符号整数，类型为 `Int`，但如果字面量太长，超过了机器字长，则会被自动提升为容量更大的类型，例如 `Int64`（如果 `Int` 是 `Int32`）、`Int128`，或者任意精度的 `BigInt` 类型。不存在诸如 `L`, `LL`, `U`, `UL`, `ULL` 这样的数值字面量后缀指示无符号和/或有符号与无符号。十进制字面量始终是有符号的，十六进制字面量（像 C/C++ 一样由 `0x` 开头）是无符号的。另外，十六进制字面量与 C/C++/Java 不同，
    `Int`, but literals too large to fit in the machine word size will automatically be promoted to
    a larger size type, such as `Int64` (if `Int` is `Int32`), `Int128`, or the arbitrarily large
    也与 Julia 中的十进制字面量不同，它们的类型取决于字面量的**长度**，包括开头的 0。例如，`0x0` 和 `0x00` 的类型是 [`UInt8`](@ref)，`0x000` 和 `0x0000` 的类型是 [`UInt16`](@ref)。同理，字面量的长度在 5-8 之间，类型为 `UInt32`；在 9-16 之间，类型为 `UInt64`；在 17-32 之间，类型为 `UInt128`。当定义十六进制掩码时，就需要将这一问题考虑在内，比如 `~0xf == 0xf0` 与 `~0x000f == 0xfff0` 完全不同。
    unsigned and/or signed vs. unsigned. Decimal literals are always signed, and hexadecimal literals
    (which start with `0x` like C/C++), are unsigned. Hexadecimal literals also, unlike C/C++/Java
    and unlike decimal literals in Julia, have a type based on the *length* of the literal, including
    leading 0s. For example, `0x0` and `0x00` have type [`UInt8`](@ref), `0x000` and `0x0000` have type
    [`UInt16`](@ref), then literals with 5 to 8 hex digits have type `UInt32`, 9 to 16 hex digits type
    `UInt64` and 17 to 32 hex digits type `UInt128`. This needs to be taken into account when defining
    hexadecimal masks, for example `~0xf == 0xf0` is very different from `~0x000f == 0xfff0`. 64 bit `Float64`
    and 32 bit [`Float32`](@ref) bit literals are expressed as `1.0` and `1.0f0` respectively. Floating point
    literals are rounded (and not promoted to the `BigFloat` type) if they can not be exactly represented.
     Floating point literals are closer in behavior to C/C++. Octal (prefixed with `0o`) and binary
    (prefixed with `0b`) literals are also treated as unsigned.
  * String literals can be delimited with either `"`  or `"""`, `"""` delimited literals can contain
    `"` characters without quoting it like `"\""` String literals can have values of other variables
    or expressions interpolated into them, indicated by `$variablename` or `$(expression)`, which
    evaluates the variable name or the expression in the context of the function.
  * `//` indicates a [`Rational`](@ref) number, and not a single-line comment (which is `#` in Julia)
  * `#=` indicates the start of a multiline comment, and `=#` ends it.
  * Functions in Julia return values from their last expression(s) or the `return` keyword.  Multiple
    values can be returned from functions and assigned as tuples, e.g. `(a, b) = myfunction()` or
    `a, b = myfunction()`, instead of having to pass pointers to values as one would have to do in
    C/C++ (i.e. `a = myfunction(&b)`.
  * Julia does not require the use of semicolons to end statements. The results of expressions are
    not automatically printed (except at the interactive prompt, i.e. the REPL), and lines of code
    do not need to end with semicolons. [`println`](@ref) or [`@printf`](@ref) can be used to
    print specific output. In the REPL, `;` can be used to suppress output. `;` also has a different
    meaning within `[ ]`, something to watch out for. `;` can be used to separate expressions on a
    single line, but are not strictly necessary in many cases, and are more an aid to readability.
  * In Julia, the operator [`⊻`](@ref xor) ([`xor`](@ref)) performs the bitwise XOR operation, i.e.
    [`^`](@ref) in C/C++.  Also, the bitwise operators do not have the same precedence as C/++, so
    parenthesis may be required.
  * Julia's [`^`](@ref) is exponentiation (pow), not bitwise XOR as in C/C++ (use [`⊻`](@ref xor), or
    [`xor`](@ref), in Julia)
  * Julia has two right-shift operators, `>>` and `>>>`.  `>>>` performs an arithmetic shift, `>>`
    always performs a logical shift, unlike C/C++, where the meaning of `>>` depends on the type of
    the value being shifted.
  * Julia's `->` creates an anonymous function, it does not access a member via a pointer.
  * Julia does not require parentheses when writing `if` statements or `for`/`while` loops: use `for i in [1, 2, 3]`
    instead of `for (int i=1; i <= 3; i++)` and `if i == 1` instead of `if (i == 1)`.
  * Julia does not treat the numbers `0` and `1` as Booleans. You cannot write `if (1)` in Julia,
    because `if` statements accept only booleans. Instead, you can write `if true`, `if Bool(1)`,
    or `if 1==1`.
  * Julia uses `end` to denote the end of conditional blocks, like `if`, loop blocks, like `while`/
    `for`, and functions. In lieu of the one-line `if ( cond ) statement`, Julia allows statements
    of the form `if cond; statement; end`, `cond && statement` and `!cond || statement`. Assignment
    statements in the latter two syntaxes must be explicitly wrapped in parentheses, e.g. `cond && (x = value)`,
    because of the operator precedence.
  * Julia 没有用来续行的语法：如果在行的末尾，到目前为止的输入是一个完整的表达式，则认为其已经结束；否则，认为输入继续。强制表达式继续的一种方式是将其包含在括号中。
     
     
  * Julia macros operate on parsed expressions, rather than the text of the program, which allows
    them to perform sophisticated transformations of Julia code. Macro names start with the `@` character,
    and have both a function-like syntax, `@mymacro(arg1, arg2, arg3)`, and a statement-like syntax,
    `@mymacro arg1 arg2 arg3`. The forms are interchangeable; the function-like form is particularly
    useful if the macro appears within another expression, and is often clearest. The statement-like
    form is often used to annotate blocks, as in the distributed `for` construct: `@distributed for i in 1:n; #= body =#; end`.
    Where the end of the macro construct may be unclear, use the function-like form.
  * Julia now has an enumeration type, expressed using the macro `@enum(name, value1, value2, ...)`
    For example: `@enum(Fruit, banana=1, apple, pear)`
  * By convention, functions that modify their arguments have a `!` at the end of the name, for example
    `push!`.
  * In C++, by default, you have static dispatch, i.e. you need to annotate a function as virtual,
    in order to have dynamic dispatch. On the other hand, in Julia every method is "virtual" (although
    it's more general than that since methods are dispatched on every argument type, not only `this`,
    using the most-specific-declaration rule).
