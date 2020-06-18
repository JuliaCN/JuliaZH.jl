# 与其他语言的显著差异

## 与 MATLAB 的显著差异

虽然 MATLAB 用户可能会发现 Julia 的语法很熟悉，但 Julia 不是 MATLAB 的克隆。 它们之间存在重大的语法和功能差异。 以下是一些可能会使习惯于 MATLAB 的 Julia 用户感到困扰的显著差异：

  * Julia 数组使用方括号 `A[i,j]` 进行索引。
  * Julia 的数组在赋值给另一个变量时不发生复制。执行 `A = B` 后，改变 `B` 中元素也会修改 `A`。
     
  * Julia 的值在向函数传递时不发生复制。如果某个函数修改了数组，这一修改对调用者是可见的。
     
  * Julia 不会在赋值语句中自动增长数组。 而在 MATLAB 中 `a(4) = 3.2` 可以创建数组 `a = [0 0 0 3.2]`，而 `a(5) = 7` 可以将它增长为 `a = [0 0 0 3.2 7]`。如果 `a` 的长度小于 5 或者这个语句是第一次使用标识符 `a`，则相应的 Julia 语句 `a[5] = 7` 会抛出错误。Julia 使用 [`push!`](@ref) 和 [`append!`](@ref) 来增长 `Vector`，它们比 MATLAB 的 `a(end+1) = val` 更高效。
     
     
     
     
  * 虚数单位 `sqrt(-1)` 在 Julia 中表示为 [`im`](@ref)，而不是在 MATLAB 中的 `i` 或 `j`。
  * 在 Julia 中，没有小数点的数字字面量（例如 `42`）会创建整数而不是浮点数。也支持任意大整数字面量。因此，某些操作（如 `2^-1`）将抛出 domain error，因为结果不是整数（有关的详细信息，请参阅[常见问题中有关 domain errors 的条目](@ref faq-domain-errors)）。
    point numbers. As a result, some operations can throw
    a domain error if they expect a float; for example, `julia> a = -1; 2^a` throws a domain error, as the
    result is not an integer (see [the FAQ entry on domain errors](@ref faq-domain-errors) for details).
  * 在 Julia 中，能返回多个值并将其赋值为元组，例如 `(a, b) = (1, 2)` 或 `a, b = 1, 2`。
    在 Julia 中不存在 MATLAB 的 `nargout`，它通常在 MATLAB 中用于根据返回值的数量执行可选工作。取而代之的是，用户可以使用可选参数和关键字参数来实现类似的功能。
     
     
  * Julia 拥有真正的一维数组。列向量的大小为 `N`，而不是 `Nx1`。例如，[`rand(N)`](@ref) 创建一个一维数组。
     
  * 在 Julia 中，`[x,y,z]` 将始终构造一个包含`x`、`y` 和 `z` 的 3 元数组。
    - 要在第一个维度（「垂直列」）中连接元素，请使用 [`vcat(x,y,z)`](@ref) 或用分号分隔（`[x; y; z]`）。
       
    - 要在第二个维度（「水平行」）中连接元素，请使用 [`hcat(x,y,z)`](@ref) 或用空格分隔（`[x y z]`）。
       
    - 要构造分块矩阵（在前两个维度中连接元素），请使用 [`hvcat`](@ref) 或组合空格和分号（`[a b; c d]`）。
       
  * 在 Julia 中，`a:b` 和 `a:b:c` 构造 `AbstractRange` 对象。使用 [`collect(a:b)`](@ref) 构造一个类似 MATLAB 中完整的向量。通常，不需要调用 `collect`。在大多数情况下，`AbstractRange` 对象将像普通数组一样运行，但效率更高，因为它是懒惰求值。这种创建专用对象而不是完整数组的模式经常被使用，并且也可以在诸如 [`range`](@ref) 之类的函数中看到，或者在诸如 `enumerate` 和 `zip` 之类的迭代器中看到。特殊对象大多可以像正常数组一样使用。
     
     
     
     
     
  * Julia 中的函数返回其最后一个表达式或 `return` 关键字的值而无需在函数定义中列出要返回的变量的名称（有关详细信息，请参阅 [return 关键字](@ref)）。
     
     
  * Julia 脚本可以包含任意数量的函数，并且在加载文件时，所有定义都将在外部可见。可以从当前工作目录之外的文件加载函数定义。
     
     
  * 在 Julia 中，例如 [`sum`](@ref)、[`prod`](@ref) 和 [`max`](@ref) 的归约操作会作用到数组的每一个元素上，当调用时只有一个函数，例如 `sum(A)`，即使 `A` 并不只有一个维度。
     
     
  * 在 Julia 中，调用无参数的函数时必须使用小括号，例如 [`rand()`](@ref)。
  * Julia 不鼓励使用分号来结束语句。语句的结果不会自动打印（除了在 REPL 中），并且代码的一行不必使用分号结尾。[`println`](@ref) 或者 [`@printf`](@ref) 能用来打印特定输出。
     
     
  * 在 Julia 中，如果 `A` 和 `B` 是数组，像 `A == B` 这样的逻辑比较运算符不会返回布尔值数组。相反地，请使用 `A .== B`。对于其他的像是 [`<`](@ref)、[`>`](@ref) 的布尔运算符同理。
     
     
  * 在 Julia 中，运算符[`&`](@ref)、[`|`](@ref) 和 [`⊻`](@ref xor)（[`xor`](@ref)）进行按位操作，分别与MATLAB中的`and`、`or` 和 `xor` 等价，并且优先级与 Python 的按位运算符相似（不像 C）。他们可以对标量运算或者数组中逐元素运算，可以用来合并逻辑数组，但是注意运算顺序的区别：括号可能是必要的（例如，选择 `A` 中等于 1 或 2 的元素可使用 `(A .== 1) .| (A .== 2)`）。
     
     
     
     
  * 在 Julia 中，集合的元素可以使用 splat 运算符 `...` 来作为参数传递给函数，如 `xs=[1,2]; f(xs...)`。
     
  * Julia 的 [`svd`](@ref) 将奇异值作为向量而非密集对角矩阵返回。
  * 在 Julia 中，`...` 不用于延续代码行。不同的是，Julia 中不完整的表达式会自动延续到下一行。
     
  * 在 Julia 和 MATLAB 中，变量 `ans` 被设置为交互式会话中提交的最后一个表达式的值。在 Julia 中与 MATLAB 不同的是，当 Julia 代码以非交互式模式运行时并不会设置 `ans`。
     
     
  * Julia 的 `struct` 不支持在运行时动态地添加字段，这与 MATLAB 的 `class` 不同。如需支持，请使用 [`Dict`](@ref)。
     
  * 在 Julia 中，每个模块有自身的全局作用域/命名空间，而在 MATLAB 中只有一个全局作用域。
     
  * 在 MATLAB 中，删除不需要的值的惯用方法是使用逻辑索引，如表达式 `x(x>3)` 或语句 `x(x>3) = []` 来 in-place 修改 `x`。相比之下，Julia 提供了更高阶的函数 [`filter`](@ref) 和 [`filter!`](@ref)，允许用户编写 `filter(z->z>3, x)` 和 `filter!(z->z>3, x)` 来代替相应直译 `x[x.>3]` 和 `x = x[x.>3]`。使用 [`filter!`](@ref) 可以减少临时数组的使用。
     
     
     
     
  * 类似于提取（或「解引用」）元胞数组的所有元素的操作，例如 MATLAB 中的 `vertcat(A{:})`，在 Julia 中是使用 splat 运算符编写的，例如 `vcat(A...)`。
     
  * In Julia, the `adjoint` function performs conjugate transposition; in MATLAB, `adjoint` provides the "adjugate" or
    classical adjoint, which is the transpose of the matrix of cofactors.
## 与 R 的显著差异

Julia 的目标之一是为数据分析和统计编程提供高效的语言。对于从 R 转到 Julia 的用户来说，这是一些显著差异：

  * Julia 的单引号封闭字符，而不是字符串。
  * Julia 可以通过索引字符串来创建子字符串。在 R 中，在创建子字符串之前必须将字符串转换为字符向量。
     
  * 在 Julia 中，与 Python 相同但与 R 不同的是，字符串可由三重引号 `""" ... """` 创建。此语法对于构造包含换行符的字符串很方便。
     
  * 在 Julia 中，可变参数使用 splat 运算符 `...` 指定，该运算符总是跟在具体变量的名称后面，与 R 的不同，R 的 `...` 可以单独出现。
     
  * 在 Julia 中，模数是 `mod(a, b)`，而不是 `a %% b`。Julia 中的 `%` 是余数运算符。
  * 在 Julia 中，并非所有数据结构都支持逻辑索引。此外，Julia 中的逻辑索引只支持长度等于被索引对象的向量。例如：
     

      * 在 R 中，`c(1, 2, 3, 4)[c(TRUE, FALSE)]` 等价于 `c(1, 3)`。
      * 在 R 中，`c(1, 2, 3, 4)[c(TRUE, FALSE, TRUE, FALSE)]` 等价于 `c(1, 3)`。
      * 在 Julia 中，`[1, 2, 3, 4][[true, false]]` 抛出 [`BoundsError`](@ref)。
      * 在 Julia 中，`[1, 2, 3, 4][[true, false, true, false]]` 产生 `[1, 3]`。
  * 与许多语言一样，Julia 并不总是允许对不同长度的向量进行操作，与 R 不同，R 中的向量只需要共享一个公共的索引范围。例如，`c(1, 2, 3, 4) + c(1, 2)` 是有效的 R，但等价的 `[1, 2, 3, 4] + [1, 2]` 在 Julia 中会抛出一个错误。
     
     
  * 在逗号不改变代码含义时，Julia 允许使用可选的尾随括号。在索引数组时，这可能在 R 用户间造成混淆。例如，R 中的 `x[1,]` 将返回矩阵的第一行；但是，在 Julia 中，引号被忽略，于是 `x[1,] == x[1]`，并且将返回第一个元素。要提取一行，请务必使用 `:`，如 `x[1,:]`。
     
     
     
  * Julia 的 [`map`](@ref) 首先接受函数，然后是该函数的参数，这与 R 中的 `lapply(<structure>, function, ...)` 不同。类似地，R 中的 `apply(X, MARGIN, FUN, ...)` 等价于 Julia 的 [`mapslices`](@ref)，其中函数是第一个参数。
     
     
  * R 中的多变量 apply，如 `mapply(choose, 11:13, 1:3)`，在 Julia 中可以编写成 `broadcast(binomial, 11:13, 1:3)`。等价地，Julia 提供了更短的点语法来向量化函数 `binomial.(11:13, 1:3)`。
     
  * Julia 使用 `end` 来表示条件块（如 `if`）、循环块（如 `while`/`for`）和函数的结束。为了代替单行 `if ( cond ) statement`，Julia 允许形式为 `if cond; statement; end`、`cond && statement` 和 `!cond || statement` 的语句。后两种语法中的赋值语句必须显式地包含在括号中，例如 `cond && (x = value)`，这是因为运算符的优先级。
     
     
     
  * 在 Julia 中，`<-`, `<<-` 和 `->` 不是赋值运算符。
  * Julia 的 `->` 创建一个匿名函数。
  * Julia 使用括号构造向量。Julia 的 `[1, 2, 3]` 等价于 R 的 `c(1, 2, 3)`。
  * Julia 的 [`*`](@ref) 运算符可以执行矩阵乘法，这与 R 不同。如果 `A` 和 `B` 都是矩阵，那么 `A * B` 在 Julia 中表示矩阵乘法，等价于 R 的 `A %*% B`。在 R 中，相同的符号将执行逐元素（Hadamard）乘积。要在 Julia 中使用逐元素乘法运算，你需要编写 `A .* B`。
     
     
     
  * Julia 使用 `transpose` 函数来执行矩阵转置，使用 `'` 运算符或 `adjoint` 函数来执行共轭转置。因此，Julia 的 `transpose(A)` 等价于 R 的 `t(A)`。另外，Julia 中的非递归转置由 `permutedims` 函数提供。
     
     
  * Julia 在编写 `if` 语句或 `for`/`while` 循环时不需要括号：请使用 `for i in [1, 2, 3]` 代替 `for (int i=1; i <= 3; i++)`，以及 `if i == 1` 代替 `if (i == 1)`
     
  * Julia 不把数字 `0` 和 `1` 视为布尔值。在 Julia 中不能编写 `if (1)`，因为 `if` 语句只接受布尔值。相反，可以编写 `if true`、`if Bool(1)` 或 `if 1==1`。
     
     
  * Julia 不提供 `nrow` 和 `ncol`。相反，请使用 `size(M, 1)` 代替 `nrow(M)` 以及 `size(M, 2)` 代替 `ncol(M)`
     
  * Julia 仔细区分了标量、向量和矩阵。在 R 中，`1` 和 `c(1)` 是相同的。在 Julia 中，它们不能互换地使用。
     
  * Julia 的 [`diag`](@ref) 和 [`diagm`](@ref) 与 R 的不同。
  * Julia 赋值操作的左侧不能为函数调用的结果：你不能编写 `diag(M) = fill(1, n)`。
     
  * Julia 不鼓励使用函数填充主命名空间。Julia 的大多数统计功能都可在 [JuliaStats 组织](https://github.com/JuliaStats)的[包](https://pkg.julialang.org/)中找到。例如：
     
     

      * 与概率分布相关的函数由 [Distributions 包](https://github.com/JuliaStats/Distributions.jl)提供。
      * [DataFrames 包](https://github.com/JuliaData/DataFrames.jl)提供数据帧。
      * 广义线性模型由 [GLM 包](https://github.com/JuliaStats/GLM.jl)提供。
  * Julia 提供了元组和真正的哈希表，但不提供 R 风格的列表。在返回多个项时，通常应使用元组或具名元组：请使用 `(1, 2)` 或 `(a=1, b=2)` 代替 `list(a = 1, b = 2)`。
     
     
  * Julia 鼓励用户编写自己的类型，它比 R 中的 S3 或 S4 对象更容易使用。Julia 的多重派发系统意味着 `table(x::TypeA)` 和 `table(x::TypeB)` 类似于 R 的 `table.TypeA(x)` 和 `table.TypeB(x)`。
     
     
  * Julia 的值在向函数传递时不发生复制。如果某个函数修改了数组，这一修改对调用者是可见的。这与 R 非常不同，允许新函数更高效地操作大型数据结构。
     
     
  * 在 Julia 中，向量和矩阵使用 [`hcat`](@ref)、[`vcat`](@ref) 和 [`hvcat`](@ref) 拼接，而不是像在 R 中那样使用 `c`、`rbind` 和 `cbind`。
     
  * 在 Julia 中，像 `a:b` 这样的 range 不是 R 中的向量简写，而是一个专门的 `AbstractRange` 对象，该对象用于没有高内存开销地进行迭代。要将 range 转换为 vector，请使用 [`collect(a:b)`](@ref)。
     
     
  * Julia 的 [`max`](@ref) 和 [`min`](@ref) 分别等价于 R 中的 `pmax` 和 `pmin`，但两者的参数都需要具有相同的维度。虽然 [`maximum`](@ref) 和 [`minimum`](@ref) 代替了 R 中的 `max` 和 `min`，但它们之间有重大区别。
     
     
  * Julia 的 [`sum`](@ref)、[`prod`](@ref)、[`maximum`](@ref) 和 [`minimum`](@ref) 与它们在 R 中的对应物不同。它们都接受一个可选的关键字参数 `dims`，它表示执行操作的维度。例如，在 Julia 中令 `A = [1 2; 3 4]`，在 R 中令 `B <- rbind(c(1,2),c(3,4))` 是与之相同的矩阵。然后 `sum(A)` 得到与 `sum(B)` 相同的结果，但 `sum(A, dims=1)` 是一个包含每一列总和的行向量，`sum(A, dims=2)` 是一个包含每一行总和的列向量。这与 R 的行为形成了对比，在 R 中，单独的 `colSums(B)` 和 `rowSums(B)` 提供了这些功能。如果 `dims` 关键字参数是向量，则它指定执行求和的所有维度，并同时保持待求和数组的维数，例如 `sum(A, dims=(1,2)) == hcat(10)`。应该注意的是，没有针对第二个参数的错误检查。
     
     
     
     
     
     
     
     
     
  * Julia 具有一些可以改变其参数的函数。例如，它具有 [`sort`](@ref) 和 [`sort!`](@ref)。
     
  * 在 R 中，高性能需要向量化。在 Julia 中，这几乎恰恰相反：性能最高的代码通常通过去向量化的循环来实现。
     
  * Julia 是立即求值的，不支持 R 风格的惰性求值。对于大多数用户来说，这意味着很少有未引用的表达式或列名。
     
  * Julia 不支持 `NULL` 类型。最接近的等价物是 [`nothing`](@ref)，但它的行为类似于标量值而不是列表。请使用 `x === nothing` 代替 `is.null(x)`。
     
  * 在 Julia 中，缺失值由 [`missing`](@ref) 表示，而不是由 `NA` 表示。请使用 [`ismissing(x)`](@ref)（或者在向量上使用逐元素操作 `ismissing.(x)`）代替 `isna(x)`。通常使用 [`skipmissing`](@ref) 代替 `na.rm=TRUE`（尽管在某些特定情况下函数接受 `skipmissing` 参数）。
     
     
     
     
  * Julia 缺少 R 中的 `assign` 或 `get` 的等价物。
  * 在 Julia 中，`return` 不需要括号。
  * 在 R 中，删除不需要的值的惯用方法是使用逻辑索引，如表达式 `x[x>3]` 或语句 `x = x[x>3]` 来 in-place 修改 `x`。相比之下，Julia 提供了更高阶的函数 [`filter`](@ref) 和 [`filter!`](@ref)，允许用户编写 `filter(z->z>3, x)` 和 `filter!(z->z>3, x)` 来代替相应直译 `x[x.>3]` 和 `x = x[x.>3]`。使用 [`filter!`](@ref) 可以减少临时数组的使用。
     
     
     
     

## 与 Python 的显著差异

  * Julia 的 `for`、`if`、`while`等代码块由`end`关键字终止。缩进级别并不像在 Python 中那么重要。
    is not significant as it is in Python. Unlike Python, Julia has no `pass` keyword.
  * Strings are denoted by double quotation marks (`"text"`) in Julia (with three double quotation marks for multi-line strings), whereas in Python they can be denoted either by single (`'text'`) or double quotation marks (`"text"`). Single quotation marks are used for characters in Julia (`'c'`).
  * String concatenation is done with `*` in Julia, not `+` like in Python. Analogously, string repetition is done with `^`, not `*`. Implicit string concatenation of string literals like in Python (e.g. `'ab' 'cd' == 'abcd'`) is not done in Julia.
  * Python Lists—flexible but slow—correspond to the Julia `Vector{Any}` type or more generally `Vector{T}` where `T` is some non-concrete element type. "Fast" arrays like Numpy arrays that store elements in-place (i.e., `dtype` is `np.float64`, `[('f1', np.uint64), ('f2', np.int32)]`, etc.) can be represented by `Array{T}` where `T` is a concrete, immutable element type. This includes built-in types like `Float64`, `Int32`, `Int64` but also more complex types like `Tuple{UInt64,Float64}` and many user-defined types as well.
  * 在 Julia 中，数组、字符串等的索引从 1 开始，而不是从 0 开始。
  * Julia 的切片索引包含最后一个元素，这与 Python 不同。Julia 中的 `a[2:3]` 就是 Python 中的 `a[1:3]`。
     
  * Julia 不支持负数索引。特别地，列表或数组的最后一个元素在 Julia 中使用 `end` 索引，而不像在 Python 中使用 `-1`。
     
  * Julia requires `end` for indexing until the last element. `x[1:]` in Python is equivalent to `x[2:end]` in Julia.
  * Julia's range indexing has the format of `x[start:step:stop]`, whereas Python's format is `x[start:(stop+1):step]`. Hence, `x[0:10:2]` in Python is equivalent to `x[1:2:10]` in Julia. Similarly, `x[::-1]` in Python, which refers to the reversed array, is equivalent to `x[end:-1:1]` in Julia.
  * In Julia, indexing a matrix with arrays like `X[[1,2], [1,3]]` refers to a sub-matrix that contains the intersections of the first and second rows with the first and third columns. In Python, `X[[1,2], [1,3]]` refers to a vector that contains the values of cell `[1,1]` and `[2,3]` in the matrix. `X[[1,2], [1,3]]` in Julia is equivalent with `X[np.ix_([0,1],[0,2])]` in Python. `X[[0,1], [0,2]]` in Python is equivalent with `X[[CartesianIndex(1,1), CartesianIndex(2,3)]]` in Julia.
  * Julia 没有用来续行的语法：如果在行的末尾，到目前为止的输入是一个完整的表达式，则认为其已经结束；否则，认为输入继续。强制表达式继续的一种方式是将其包含在括号中。
     
     
  * 默认情况下，Julia 数组是列优先的（Fortran 顺序），而 NumPy 数组是行优先（C 顺序）。为了在循环数组时获得最佳性能，循环顺序应该在 Julia 中相对于 NumPy 反转（请参阅 [Performance Tips](@ref man-performance-tips) 中的对应章节）。
     
    be reversed in Julia relative to NumPy (see [relevant section of Performance Tips](@ref man-performance-column-major)).
  * Julia 的更新运算符（例如 `+=`，`-=`，···）是 *not in-place*，而 Numpy 的是。这意味着 `A = [1, 1]; B = A; B += [3, 3]` 不会改变 `A` 中的值，而将名称 `B` 重新绑定到右侧表达式 `B = B + 3` 的结果，这是一个新的数组。对于 in-place 操作，使用 `B .+= 3`（另请参阅 [dot operators](@ref man-dot-operators)）、显式的循环或者 `InplaceOps.jl`。
     
     
     
  * 每次调用方法时，Julia 都会计算函数参数的默认值，不像在 Python 中，默认值只会在函数定义时被计算一次。例如，每次无输入参数调用时，函数`f(x=rand()) = x`都返回一个新的随机数在另一方面，函数 `g(x=[1,2]) = push!(x,3)` 在每次以 `g()` 调用时返回 `[1,2,3]`。
     
     
     
     
  * 在 Julia 中，`%` 是余数运算符，而在 Python 中是模运算符。
  * In Julia, the commonly used `Int` type corresponds to the machine integer type (`Int32` or `Int64`), unlike in Python, where `int` is an arbitrary length integer.
    This means in Julia the `Int` type will overflow, such that `2^64 == 0`. If you need larger values use another appropriate type,
    such as `Int128`, [`BigInt`](@ref) or a floating point type like `Float64`.
  * The imaginary unit `sqrt(-1)` is represented in Julia as `im`, not `j` as in Python.
  * In Julia, the exponentiation operator is `^`, not `**` as in Python.
  * Julia uses `nothing` of type `Nothing` to represent a null value, whereas Python uses `None` of type `NoneType`.
  * In Julia, the standard operators over a matrix type are matrix operations, whereas, in Python, the standard operators are element-wise operations. When both `A` and `B` are matrices, `A * B` in Julia performs matrix multiplication, not element-wise multiplication as in Python. `A * B` in Julia is equivalent with `A @ B` in Python, whereas `A * B` in Python is equivalent with `A .* B` in Julia.
  * The adjoint operator `'` in Julia returns an adjoint of a vector (a lazy representation of row vector), whereas the transpose operator `.T` over a vector in Python returns the original vector (non-op).
  * In Julia, a function may contain multiple concrete implementations (called *Methods*), selected via multiple dispatch, whereas functions in Python have a single implementation (no polymorphism).
  * There are no classes in Julia. Instead they are structures (mutable or immutable), containing data but no methods.
  * Calling a method of a class in Python (`a = MyClass(x), x.func(y)`) corresponds to a function call in Julia, e.g. `a = MyStruct(x), func(x::MyStruct, y)`. In general, multiple dispatch is more flexible and powerful than the Python class system.
  * Julia structures may have exactly one abstract supertype, whereas Python classes can inherit from one or more (abstract or concrete) superclasses.
  * The logical Julia program structure (Packages and Modules) is independent of the file strucutre (`include` for additional files), whereas the Python code structure is defined by directories (Packages) and files (Modules).
  * The ternary operator `x > 0 ? 1 : -1` in Julia corresponds to conditional expression in Python `1 if x > 0 else -1`.
  * In Julia the `@` symbol refers to a macro, whereas in Python it refers to a decorator.
  * Exception handling in Julia is done using `try` — `catch` — `finally`, instead of `try` — `except` — `finally`. In contrast to Python, it is not recommended to use exception handling as part of the normal workflow in Julia due to performance reasons.
  * In Julia loops are fast, there is no need to write "vectorized" code for performance reasons.
  * Be careful with non-constant global variables in Julia, especially in tight loops. Since you can write close-to-metal code in Julia (unlike Python), the effect of globals can be drastic (see [Performance Tips](@ref man-performance-tips)).
  * In Python, the majority of values can be used in logical contexts (e.g. `if "a":` means the following block is executed, and `if "":` means it is not). In Julia, you need explicit conversion to `Bool` (e.g. `if "a"` throws an exception). If you want to test for a non-empty string in Julia, you would explicitly write `if !isempty("")`.
  * In Julia, a new local scope is introduced by most code blocks, including loops and `try` — `catch` — `finally`. Note that comprehensions (list, generator, etc.) introduce a new local scope both in Python and Julia, whereas `if` blocks do not introduce a new local scope in both languages.

## 与 C/C++ 的显著差异

  * Julia 的数组由方括号索引，方括号中可以包含不止一个维度 `A[i,j]`。这样的语法不仅仅是像 C/C++ 中那样对指针或者地址引用的语法糖，参见关于数组构造的语法的 Julia 文档（依版本不同有所变动）。
     
     
  * 在 Julia 中，数组、字符串等的索引从 1 开始，而不是从 0 开始。
  * Julia 的数组在赋值给另一个变量时不发生复制。执行 `A = B` 后，改变 `B` 中元素也会修改 `A`。像 `+=` 这样的更新运算符不会以 in-place 的方式执行，而是相当于 `A = A + B`，将左侧绑定到右侧表达式的计算结果上。
     
     
  * Julia 的数组是列优先的（Fortran 顺序），而 C/C++ 的数组默认是行优先的。要使数组上的循环性能最优，在 Julia 中循环的顺序应该与 C/C++ 相反（参见 [性能建议](@ref man-performance-tips)）。
     
    reversed in Julia relative to C/C++ (see [relevant section of Performance Tips](@ref man-performance-column-major)).
  * Julia 的值在赋值或向函数传递时不发生复制。如果某个函数修改了数组，这一修改对调用者是可见的。
     
  * 在 Julia 中，空格是有意义的，这与 C/C++ 不同，所以向 Julia 程序中添加或删除空格时必须谨慎。
     
  * 在 Julia 中，没有小数点的数值字面量（如 `42`）生成有符号整数，类型为 `Int`，但如果字面量太长，超过了机器字长，则会被自动提升为容量更大的类型，例如 `Int64`（如果 `Int` 是 `Int32`）、`Int128`，或者任意精度的 `BigInt` 类型。不存在诸如 `L`, `LL`, `U`, `UL`, `ULL` 这样的数值字面量后缀指示无符号和/或有符号与无符号。十进制字面量始终是有符号的，十六进制字面量（像 C/C++ 一样由 `0x` 开头）是无符号的。另外，十六进制字面量与 C/C++/Java 不同，也与 Julia 中的十进制字面量不同，它们的类型取决于字面量的**长度**，包括开头的 0。例如，`0x0` 和 `0x00` 的类型是 [`UInt8`](@ref)，`0x000` 和 `0x0000` 的类型是 [`UInt16`](@ref)。同理，字面量的长度在 5-8 之间，类型为 `UInt32`；在 9-16 之间，类型为 `UInt64`；在 17-32 之间，类型为 `UInt128`。当定义十六进制掩码时，就需要将这一问题考虑在内，比如 `~0xf == 0xf0` 与 `~0x000f == 0xfff0` 完全不同。64 位 `Float64` 和 32 位 [`Float32`](@ref) 的字面量分别表示为 `1.0` 和 `1.0f0`。浮点字面量在无法被精确表示时舍入（且不会提升为 `BigFloat` 类型）。浮点字面量在行为上与 C/C++ 更接近。八进制（前缀为 `0o`）和二进制（前缀为 `0b`）也被视为无符号的。
     
     
     
     
     
     
     
     
     
     
     
     
     
     
  * 字符串字面量可用 `"` 或 `"""` 分隔，用 `"""` 分隔的字面量可以包含 `"` 字符而无需像 `"\""` 这样来引用它。字符串字面量可以包含插入其中的其他变量或表达式，由 `$variablename` 或 `$(expression)` 表示，它在该函数所处的上下文中计算变量名或表达式。
     
     
     
  * `//` 表示 [`Rational`](@ref) 数，而非单行注释（其在 Julia 中是 `#`）
  * `#=` 表示多行注释的开头，`=#` 结束之。
  * Julia 中的函数返回其最后一个表达式或 `return` 关键字的值。可以从函数中返回多个值并将其作为元组赋值，如 `(a, b) = myfunction()` 或 `a, b = myfunction()`，而不必像在 C/C++ 中那样必须传递指向值的指针（即 `a = myfunction(&b)`）。
     
     
     
  * Julia 不要求使用分号来结束语句。表达式的结果不会自动打印（除了在交互式提示符中，即 REPL），且代码行不需要以分号结尾。[`println`](@ref) 或 [`@printf`](@ref) 可用于打印特定输出。在 REPL 中，`;` 可用于抑制输出。`;` 在 `[ ]` 中也有不同的含义，需要注意。`;` 可用于在单行中分隔表达式，但在许多情况下不是绝对必要的，更经常是为了可读性。
     
     
     
     
     
  * 在 Julia 中，运算符 [`⊻`](@ref xor)（[`xor`](@ref)）执行按位 XOR 操作，即 C/C++ 中的 [`^`](@ref)。此外，按位运算符不具有与 C/C++ 相同的优先级，所以可能需要括号。
     
     
  * Julia 的 [`^`](@ref) 是取幂（pow），而非 C/C++ 中的按位 XOR（在 Julia 中请使用 [`⊻`](@ref xor) 或 `xor`）
    [ ](@ref), in Julia)
  * Julia 中有两个右移运算符，`>>` 和 `>>>`。`>>>` 执行逻辑移位，`>>` 总是执行算术移位（译注：此处原文为「`>>>` performs an arithmetic shift, `>>` always performs a logical shift」，疑误），与 C/C++ 不同，C/C++ 中的 `>>` 的含义依赖于被移位的值的类型。
     
     
  * Julia 的 `->` 创建一个匿名函数，它并不通过指针访问成员。
  * Julia 在编写 `if` 语句或 `for`/`while` 循环时不需要括号：请使用 `for i in [1, 2, 3]` 代替 `for (int i=1; i <= 3; i++)`，以及 `if i == 1` 代替 `if (i == 1)`
     
  * Julia 不把数字 `0` 和 `1` 视为布尔值。在 Julia 中不能编写 `if (1)`，因为 `if` 语句只接受布尔值。相反，可以编写 `if true`、`if Bool(1)` 或 `if 1==1`。
     
     
  * Julia 使用 `end` 来表示条件块（如 `if`）、循环块（如 `while`/`for`）和函数的结束。为了代替单行 `if ( cond ) statement`，Julia 允许形式为 `if cond; statement; end`、`cond && statement` 和 `!cond || statement` 的语句。后两种语法中的赋值语句必须显式地包含在括号中，例如 `cond && (x = value)`，这是因为运算符的优先级。
     
     
     
     
  * Julia 没有用来续行的语法：如果在行的末尾，到目前为止的输入是一个完整的表达式，则认为其已经结束；否则，认为输入继续。强制表达式继续的一种方式是将其包含在括号中。
     
     
  * Julia 宏对已解析的表达式进行操作，而非程序的文本，这允许它们执行复杂的 Julia 代码转换。宏名称以 `@` 字符开头，具有类似函数的语法 `@mymacro(arg1, arg2, arg3)` 和类似语句的语法 `@mymacro arg1 arg2 arg3`。两种形式的语法可以相互转换；如果宏出现在另一个表达式中，则类似函数的形式尤其有用，并且它通常是最清晰的。类似语句的形式通常用于标注块，如在分布式 `for` 结构中：`@distributed for i in 1:n; #= body =#; end`。如果宏结构的结尾不那么清晰，请使用类似函数的形式。
     
     
     
     
     
     
  * Julia 有一个枚举类型，使用宏 `@enum(name, value1, value2, ...)` 来表示，例如：`@enum(Fruit, banana=1, apple, pear)`。
     
  * 按照惯例，修改其参数的函数在名称的末尾有个 `!`，例如 `push!`。
     
  * 在 C++ 中，默认情况下，你具有静态分派，即为了支持动态派发，你需要将函数标注为 virtual 函数。另一方面，Julia 中的每个方法都是「virtual」（尽管它更通用，因为方法是在每个参数类型上派发的，而不仅仅是 `this`，并且使用的是最具体的声明规则）。
     
     
     

## Noteworthy differences from Common Lisp

- Julia uses 1-based indexing for arrays by default, and it can also handle arbitrary [index offsets](@ref man-custom-indices).

- Functions and variables share the same namespace (“Lisp-1”).

- There is a [`Pair`](@ref) type, but it is not meant to be used as a `COMMON-LISP:CONS`. Various iterable collections can be used interchangeably in most parts of the language (eg splatting, tuples, etc). `Tuple`s are the closest to Common Lisp lists for *short* collections of heterogeneous elements. Use `NamedTuple`s in place of alists. For larger collections of homogeneous types, `Array`s and `Dict`s should be used.

- The typical Julia workflow for prototyping also uses continuous manipulation of the image, implemented with the [Revise.jl](https://github.com/timholy/Revise.jl) package.

- Bignums are supported, but conversion is not automatic; ordinary integers [overflow](@ref faq-integer-arithmetic).

- Modules (namespaces) can be hierarchical. [`import`](@ref) and [`using`](@ref) have a dual role: they load the code and make it available in the namespace. `import` for only the module name is possible (roughly equivalent to `ASDF:LOAD-OP`). Slot names don't need to be exported separately. Global variables can't be assigned to from outside the module (except with `eval(mod, :(var = val))` as an escape hatch).

- Macros start with `@`, and are not as seamlessly integrated into the language as Common Lisp; consequently, macro usage is not as widespread as in the latter. A form of hygiene for [macros](@ref Metaprogramming) is supported by the language. Because of the different surface syntax, there is no equivalent to `COMMON-LISP:&BODY`.

- *All* functions are generic and use multiple dispatch. Argument lists don't have to follow the same template, which leads to a powerful idiom (see [`do`](@ref)). Optional and keyword arguments are handled differently. Method ambiguities are not resolved like in the Common Lisp Object System, necessitating the definition of a more specific method for the intersection.

- Symbols do not belong to any package, and do not contain any values *per se*. `M.var` evaluates the symbol `var` in the module `M`.

- A functional programming style is fully supported by the language, including closures, but isn't always the idiomatic solution for Julia. Some [workarounds](@ref man-performance-captured) may be necessary for performance when modifying captured variables.
