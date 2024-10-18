# 与其他语言的显著差异

## [与 MATLAB 的显著差异](@id Noteworthy-differences-from-MATLAB)

虽然 MATLAB 用户可能会发现 Julia 的语法很熟悉，但 Julia 不是 MATLAB 的克隆。 它们之间存在重大的语法和功能差异。 以下是一些可能会使习惯于 MATLAB 的 Julia 用户感到困扰的显著差异：

  * Julia 数组使用方括号 `A[i,j]` 进行索引。

  * Julia 数组在分配给另一个变量时不会被复制。 在`A = B`之后，改变`B`的元素也会改变`A`的元素。
    To avoid this, use `A = copy(B)`.

  * Julia 的值在向函数传递时不发生复制。如果某个函数修改了数组，这一修改对调用者是可见的。

  * Julia 不会在赋值语句中自动增长数组。 而在 MATLAB 中 `a(4) = 3.2` 可以创建数组 `a = [0 0 0 3.2]`，而 `a(5) = 7` 可以将它增长为 `a = [0 0 0 3.2 7]`。如果 `a` 的长度小于 5 或者这个语句是第一次使用标识符 `a`，则相应的 Julia 语句 `a[5] = 7` 会抛出错误。Julia 使用 [`push!`](@ref) 和 [`append!`](@ref) 来增长 `Vector`，它们比 MATLAB 的 `a(end+1) = val` 更高效。

  * 虚数单位 `sqrt(-1)` 在 Julia 中表示为 [`im`](@ref)，而不是在 MATLAB 中的 `i` 或 `j`。

  * 在 Julia 中，不带小数点的字面数字（如 `42`）创建的是整数而不是浮点数。
    因此，如果某些操作的预期结果是浮点数，就会产生域错误；例如，`julia> a = -1; 2^a` 会产生域错误，因为结果不是整数
    （详情请参见[常见问题中的域错误](@ref faq-domain-errors)）。

  * 在 Julia 中，能返回多个值并将其赋值为元组，例如 `(a, b) = (1, 2)` 或 `a, b = 1, 2`。
    在 Julia 中不存在 MATLAB 的 `nargout`，它通常在 MATLAB 中用于根据返回值的数量执行可选工作。取而代之的是，用户可以使用可选参数和关键字参数来实现类似的功能。

  * Julia 拥有真正的一维数组。列向量的大小为 `N`，而不是 `Nx1`。例如，[`rand(N)`](@ref) 创建一个一维数组。

  * 在 Julia 中，`[x,y,z]` 将始终构造一个包含`x`、`y` 和 `z` 的 3 元数组。
    - 要在第一个维度（「垂直列」）中连接元素，请使用 [`vcat(x,y,z)`](@ref) 或用分号分隔（`[x; y; z]`）。
    - 要在第二个维度（「水平行」）中连接元素，请使用 [`hcat(x,y,z)`](@ref) 或用空格分隔（`[x y z]`）。
    - 要构造分块矩阵（在前两个维度中连接元素），请使用 [`hvcat`](@ref) 或组合空格和分号（`[a b; c d]`）。

  * 在 Julia 中，`a:b` 和 `a:b:c` 构造 `AbstractRange` 对象。使用 [`collect(a:b)`](@ref) 构造一个类似 MATLAB 中完整的向量。通常，不需要调用 `collect`。在大多数情况下，`AbstractRange` 对象将像普通数组一样运行，但效率更高，因为它是懒惰求值。这种创建专用对象而不是完整数组的模式经常被使用，并且也可以在诸如 [`range`](@ref) 之类的函数中看到，或者在诸如 `enumerate` 和 `zip` 之类的迭代器中看到。特殊对象大多可以像正常数组一样使用。

  * The `:` operator has a different precedence in R and Julia. In particular, in Julia arithmetic operators
    have higher precedence than the `:` operator, whereas the reverse is true in R. For example, `1:n-1` in
    Julia is equivalent to `1:(n-1)` in R.

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

  * Julia 的 `struct` 不支持在运行时动态地添加字段，这与 MATLAB 的 `class` 不同。
    如需支持，请使用 [`Dict`](@ref)。Julia 中的字典不是有序的。

  * 在 Julia 中，每个模块有自身的全局作用域/命名空间，而在 MATLAB 中只有一个全局作用域。

  * 在 MATLAB 中，删除不需要的值的惯用方法是使用逻辑索引，如表达式 `x(x>3)` 或语句 `x(x>3) = []` 来 in-place 修改 `x`。相比之下，Julia 提供了更高阶的函数 [`filter`](@ref) 和 [`filter!`](@ref)，允许用户编写 `filter(z->z>3, x)` 和 `filter!(z->z>3, x)` 来代替相应直译 `x[x.>3]` 和 `x = x[x.>3]`。使用 [`filter!`](@ref) 可以减少临时数组的使用。

  * 类似于提取（或「解引用」）元胞数组的所有元素的操作，例如 MATLAB 中的 `vertcat(A{:})`，在 Julia 中是使用 splat 运算符编写的，例如 `vcat(A...)`。

  * 在 Julia 中，`adjoint` 函数执行共轭转置；在 MATLAB 中，`adjoint` 提供了经典伴随，它是余子式的转置。

  * 在 Julia 中，a^b^c 被认为是 a^(b^c) 而在 MATLAB 中它是 (a^b)^c。


## [与 R 的显著差异](@id Noteworthy-differences-from-R)

Julia 的目标之一是为数据分析和统计编程提供高效的语言。对于从 R 转到 Julia 的用户来说，这是一些显著差异：

  * Julia 的单引号封闭字符，而不是字符串。

  * Julia 可以通过索引字符串来创建子字符串。在 R 中，在创建子字符串之前必须将字符串转换为字符向量。
     
  * 在 Julia 中，与 Python 相同但与 R 不同的是，字符串可由三重引号 `""" ... """` 创建。此语法对于构造包含换行符的字符串很方便。
     
  * 在 Julia 中，可变参数使用 splat 运算符 `...` 指定，该运算符总是跟在具体变量的名称后面，与 R 的不同，R 的 `...` 可以单独出现。
     
  * 在 Julia 中，模数是 `mod(a, b)`，而不是 `a %% b`。Julia 中的 `%` 是余数运算符。

  * Julia constructs vectors using brackets. Julia's `[1, 2, 3]` is the equivalent of R's `c(1, 2, 3)`.

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


## [与 Python 的显著差异](@id Noteworthy-differences-from-Python)

  * Julia 的 `for`, `if`, `while` 等语句块都以 `end` 关键字结束。代码的缩进不像在 Python 中那样重要。Julia 也没有 `pass` 关键字。 

  * Julia 中的字符串使用双引号构造，如 `"text"`，也可以使用三引号构造多行字符串。而在 Python 中可以使用单引号（`'text'`）或者双引号（`"text"`）。单引号在 Julia 中用来表示单个字符，例如 `'c'`。

  * 在 Julia 中字符串的拼接使用 `*`，而不是像 Python 一样使用 `+`。类似的，字符串重复多次 Julia 使用 `^` 而不是 `*`。Julia 也不支持隐式的字符串拼接，例如 Python 中的 `'ab' 'cd' == 'abcd'`。

  * Python 列表——灵活但缓慢——对应于 Julia 的 `Vector{Any}` 类型或更一般的 `Vector{T}`，其中 `T` 是一些非具体元素类型。 “快”的数组，如 NumPy 数组，它们就地存储元素（即，`dtype` 是 `np.float64`、`[('f1', np.uint64), ('f2', np.int32)]`， 等）可以用 `Array{T}` 表示，其中 `T` 是一个具体的、不可变的元素类型。 这包括内置类型，如 `Float64`、`Int32`、`Int64`，也包括更复杂的类型，如 `Tuple{UInt64,Float64}` 和许多用户定义的类型。

  * 在 Julia 中，数组、字符串等的索引从 1 开始，而不是从 0 开始。

  * Julia 里的切片包含最后一个元素。Julia 里的 `a[2:3]` 等同于 Python 中的 `a[1:3]`。

  * Unlike Python, Julia allows [AbstractArrays with arbitrary indexes](https://julialang.org/blog/2017/04/offset-arrays/).
    Python's special interpretation of negative indexing, `a[-1]` and `a[-2]`, should be written
    `a[end]` and `a[end-1]` in Julia.

  * Julia 的索引必须写全。Python 中的 `x[1:]` 等价于 Julia 中的 `x[2:end]`。

  * In Julia, `:` before any object creates a [`Symbol`](@ref) or *quotes* an expression; so, `x[:5]` is same as `x[5]`. If you want to get the first `n` elements of an array, then use range indexing.

  * Julia 的范围语法为 `x[start:step:stop]`，而 Python 的格式为 `x[start:(stop+1):step]`。
因此 Python 中的 `x[0:10:2]` 等价于 Julia 里的 `x[1:2:10]`。类似的 Python 中的反转数组 `x[::-1]` 等价于 Julia 中的 `x[end:-1:1]`。

  * In Julia, ranges can be constructed independently as `start:step:stop`, the same syntax it uses
    in array-indexing.  The `range` function is also supported.

  * 在 Julia 中队一个矩阵取索引 `X[[1,2], [1,3]]` 返回一个子矩阵，它包含了第一和第二行与第一和第三列的交集。
    在 Python 中 `X[[1,2], [1,3]]` 返回一个向量，它包含索引 `[1,1]` 和 `[2,3]` 的值。Julia 中的 `X[[1,2], [1,3]]` 等价于 Python 中的 `X[np.ix_([0,1],[0,2])]`。Python 中的 `X[[1,2], [1,3]]` 等价于 Julia 中的 `X[[CartesianIndex(1,1), CartesianIndex(2,3)]]`。

  * Julia 没有用来续行的语法：如果在行的末尾，到目前为止的输入是一个完整的表达式，则认为其已经结束；否则，认为输入继续。强制表达式继续的一种方式是将其包含在括号中。

  * 默认情况下，Julia 数组是列优先（Fortran 排序），而 NumPy 数组是行优先（C 排序）。为了在循环数组时获得最佳性能，Julia 中的循环顺序应相对于 NumPy 颠倒（请参阅[性能提示的相关部分](@ref man-performance-column-major)）。

  * Julia 的更新运算符（例如 `+=`，`-=`，···）是非原位操作（not in-place），而 Numpy 的是。这意味着 `A = [1, 1]; B = A; B += [3, 3]` 不会改变 `A` 中的值，而将名称 `B` 重新绑定到右侧表达式 `B = B + 3` 的结果，这是一个新的数组。对于 in-place 操作，使用 `B .+= 3`（另请参阅 [dot operators](@ref man-dot-operators)）、显式的循环或者 `InplaceOps.jl`。

  * Julia 的函数在调用时，每次都对默认参数重新求值，不像 Python 只在函数定义时对默认参数求一次值。
    举例来说：Julia 的函数 `f(x=rand()) = x` 在无参数调用时（`f()`），每次都会返回不同的随机数。
    另一方面，函数 `g(x=[1,2]) = push!(x,3)` 无参数调用时 `g()`，永远返回 `[1,2,3]`。

  * 在 Julia 中，必须使用关键字来传递关键字参数，这与 Python 中通常可以按位置传递它们不同。尝试按位置传递关键字参数会改变方法签名，从而导致 `MethodError` 或调用错误的方法。

  * 在 Julia 中，`%` 是余数运算符，而在 Python 中是模运算符。
（译注：二者在参数有负数时有区别）
  * 在 Julia 中，常用的整数类型 Int 对应机器的整数类型，`Int32` 或 `Int64`。不像 Python 中的整数 int 是任意精度的。这意味着 Julia 中默认的整数类型会溢出，因此 `2^64 == 0`。如果你要表示一个大数，请选择一个合适的类型。如：`Int128`、任意精度的 `BigInt` 或者浮点类型 `Flost64`。

  * Julia 中虚数单位 `sqrt(-1)` 是 `im`，而不是 Python 中的 `j`。

  * Julia 中指数是 `^`，而不是 Python 中的 `**`。

  * Julia 使用 `Nothing` 类型的实例 `nothing` 代表空值（null），而不是 Python 中 `NoneType` 类的 `None`。

  * 在 Julia 中，标准的运算符作用在矩阵上就得到矩阵操作，不像 Python 标准运算符默认是逐元素操作。当 A 和 B 都是矩阵时，`A * B` 在 Julia 中代表着矩阵乘法，而不是 Python 中的逐元素相乘。即：Julia 中的 `A * B` 等同于 Python 的 `A @ B`；Python 中的 `A * B` 等同于 Julia 中的 `A .* B`。

  * Julia 中的伴随操作符 `'` 返回向量的转置（一种行向量的懒惰表示法）。Python 中对向量执行 `.T` 返回它本身（没有效果）。

  * In Julia, a function may contain multiple concrete implementations (called *methods*), which are selected via multiple dispatch based on the types of all arguments to the call, as compared to functions in Python, which have a single implementation and no polymorphism (as opposed to Python method calls which use a different syntax and allows dispatch on the receiver of the method).

  * Julia 没有类（class），取而代替的是结构体（structures），可以是可变的或不可变的，它们只包含数据而不包含方法。

  * 在 Python 中调用类实例的方法 (`x = MyClass(*args); x.f(y)`) 对应于 Julia 中的函数调用，例如 `x = MyType(args...); f(x, y)`。 总的来说，多重派发比 Python 类系统更灵活和强大。

  * Julia 的结构体有且只能有一个抽象超类型（abstract supertype），而 Python 的类可以纪成一个或多个、抽象或具体的超类（superclasses）。

  * 逻辑 Julia 程序结构（包和模块）独立于文件结构（`include` 用于附加文件），而 Python 代码结构由目录（包）和文件（模块）定义。

  * Julia 中的三元运算符 `x > 0 ? 1 :  -1` 对应于 Python 中的条件表达式 `1 if x > 0 else -1`。

  * Julia 中以 `@` 开头的符号是宏（macro），而 Python 中是装饰器（decorator）。

  * Julia 的异常处理使用 `try` — `catch` — `finally`，而不是 Python 的 `try` — `except` — `finally`。与 Python 不同的是，因为性能的原因，Julia 不推荐在正常流程中使用异常处理。
    (compared with Python, Julia is faster at ordinary control flow but slower at exception-catching).

  * Julia 的循环很快，所以没必要手动向量化（vectorized）。

  * 小心 Julia 中的非常量全局变量，尤其它出现在循环中时。因为你在 Julia 中可以写出贴近硬件的代码，这时使用全局变量的影响非常大（参见[性能建议](@ref man-performance-tips)）

  * In Julia, rounding and truncation are explicit. Python's `int(3.7)` should be `floor(Int, 3.7)` or `Int(floor(3.7))` and is distinguished from `round(Int, 3.7)`.
    `floor(x)` and `round(x)` on their own return an integer value of the same type as `x` rather than always returning `Int`.

  * In Julia, parsing is explicit. Python's `float("3.7")` would be `parse(Float64, "3.7")` in Julia.

  * Python 中大多数的值都能用在逻辑运算中。例如：`if "a"` 永真，`if ""` 恒假。在 Julia 中你只能使用布尔类型的值，或者显示的将其他值转为布尔类型，否则就会抛出异常。例如当你想测试字符串是否为空是，请使用 `if !isempty("")`。
  * 在 Julia 中大多数代码块都会引入新的本地作用域（local scope）。例如：循环和异常处理的 try — catch — finally。注意：列表推断（comprehensions）与生成器在 Julia 和 Python 中都会引入新的作用域；而 if 分支则都不会引入。


## [与 C/C++ 的显著差异](@id Noteworthy-differences-from-C/C++)

  * Julia 的数组由方括号索引，方括号中可以包含不止一个维度 `A[i,j]`。这样的语法不仅仅是像 C/C++ 中那样对指针或者地址引用的语法糖，参见[关于数组构造的语法的 Julia 文档](@ref man-multi-dim-arrays)。

  * 在 Julia 中，数组、字符串等的索引从 1 开始，而不是从 0 开始。

  * Julia 的数组在赋值给另一个变量时不发生复制。执行 `A = B` 后，改变 `B` 中元素也会修改 `A`。像 `+=` 这样的更新运算符不会以 in-place 的方式执行，而是相当于 `A = A + B`，将左侧绑定到右侧表达式的计算结果上。

  * Julia 的数组是列优先的（Fortran 顺序），而 C/C++ 的数组默认是行优先的。要使数组上的循环性能最优，在 Julia 中循环的顺序应该与 C/C++ 相反（参见 [性能建议](@ref man-performance-tips)）。

  * Julia 的值在赋值或向函数传递时不发生复制。如果某个函数修改了数组，这一修改对调用者是可见的。

  * 在 Julia 中，空格是有意义的，这与 C/C++ 不同，所以向 Julia 程序中添加或删除空格时必须谨慎。

  * 在 Julia 中，没有小数点的数值字面量（如 `42`）生成有符号整数，类型为 `Int`，但如果字面量太长，超过了机器字长，则会被自动提升为容量更大的类型，例如 `Int64`（如果 `Int` 是 `Int32`）、`Int128`，或者任意精度的 `BigInt` 类型。不存在诸如 `L`, `LL`, `U`, `UL`, `ULL` 这样的数值字面量后缀指示无符号和/或有符号与无符号。十进制字面量始终是有符号的，十六进制字面量（像 C/C++ 一样由 `0x` 开头）是无符号的。另外，十六进制字面量与 C/C++/Java 不同，也与 Julia 中的十进制字面量不同，它们的类型取决于字面量的**长度**，包括开头的 0。例如，`0x0` 和 `0x00` 的类型是 [`UInt8`](@ref)，`0x000` 和 `0x0000` 的类型是 [`UInt16`](@ref)。同理，字面量的长度在 5-8 之间，类型为 `UInt32`；在 9-16 之间，类型为 `UInt64`；在 17-32 之间，类型为 `UInt128`。当定义十六进制掩码时，就需要将这一问题考虑在内，比如 `~0xf == 0xf0` 与 `~0x000f == 0xfff0` 完全不同。64 位 `Float64` 和 32 位 [`Float32`](@ref) 的字面量分别表示为 `1.0` 和 `1.0f0`。浮点字面量在无法被精确表示时舍入（且不会提升为 `BigFloat` 类型）。浮点字面量在行为上与 C/C++ 更接近。八进制（前缀为 `0o`）和二进制（前缀为 `0b`）也被视为无符号的。

  * 在 Julia 中，当两个操作数都是整数类型时，除法运算符 `/` 返回一个浮点数。 要执行整数除法，请使用 `div` 或 `÷`。

  * 使用浮点类型索引数组在 Julia 中通常是错误的。 C 表达式 `a[i / 2]` 的 Julia 等价写法是 `a[i ÷ 2 + 1]`，其中 `i` 是整数类型。

  * 字符串字面量可用 `"` 或 `"""` 分隔，用 `"""` 分隔的字面量可以包含 `"` 字符而无需像 `"\""` 这样来引用它。字符串字面量可以包含插入其中的其他变量或表达式，由 `$variablename` 或 `$(expression)` 表示，它在该函数所处的上下文中计算变量名或表达式。

  * `//` 表示 [`Rational`](@ref) 数，而非单行注释（其在 Julia 中是 `#`）

  * `#=` 表示多行注释的开头，`=#` 结束之。

  * Julia 中的函数返回其最后一个表达式或 `return` 关键字的值。可以从函数中返回多个值并将其作为元组赋值，如 `(a, b) = myfunction()` 或 `a, b = myfunction()`，而不必像在 C/C++ 中那样必须传递指向值的指针（即 `a = myfunction(&b)`）。

  * Julia 不要求使用分号来结束语句。表达式的结果不会自动打印（除了在交互式提示符中，即 REPL），且代码行不需要以分号结尾。[`println`](@ref) 或 [`@printf`](@ref) 可用于打印特定输出。在 REPL 中，`;` 可用于抑制输出。`;` 在 `[ ]` 中也有不同的含义，需要注意。`;` 可用于在单行中分隔表达式，但在许多情况下不是绝对必要的，更经常是为了可读性。

  * 在 Julia 中，运算符 [`⊻`](@ref xor)（[`xor`](@ref)）执行按位 XOR 操作，即 C/C++ 中的 [`^`](@ref)。此外，按位运算符不具有与 C/C++ 相同的优先级，所以可能需要括号。

  * Julia 的 [`^`](@ref) 是取幂（pow），而非 C/C++ 中的按位 XOR（在 Julia 中请使用 [`⊻`](@ref xor) 或 `xor`）

  * Julia 有两个右移运算符，`>>` 和 `>>>`。
    `>>` 执行算术移位，`>>>` 始终执行逻辑移位，这与 C/C++ 不同，其中 `>>` 的含义取决于被移位的值的类型。

  * Julia 的 `->` 创建一个匿名函数，它并不通过指针访问成员。

  * Julia 在编写 `if` 语句或 `for`/`while` 循环时不需要括号：请使用 `for i in [1, 2, 3]` 代替 `for (int i=1; i <= 3; i++)`，以及 `if i == 1` 代替 `if (i == 1)`

  * Julia 不把数字 `0` 和 `1` 视为布尔值。在 Julia 中不能编写 `if (1)`，因为 `if` 语句只接受布尔值。相反，可以编写 `if true`、`if Bool(1)` 或 `if 1==1`。

  * Julia 使用 `end` 来表示条件块（如 `if`）、循环块（如 `while`/`for`）和函数的结束。为了代替单行 `if ( cond ) statement`，Julia 允许形式为 `if cond; statement; end`、`cond && statement` 和 `!cond || statement` 的语句。后两种语法中的赋值语句必须显式地包含在括号中，例如 `cond && (x = value)`，这是因为运算符的优先级。

  * Julia 没有用来续行的语法：如果在行的末尾，到目前为止的输入是一个完整的表达式，则认为其已经结束；否则，认为输入继续。强制表达式继续的一种方式是将其包含在括号中。

  * Julia 宏对已解析的表达式进行操作，而非程序的文本，这允许它们执行复杂的 Julia 代码转换。宏名称以 `@` 字符开头，具有类似函数的语法 `@mymacro(arg1, arg2, arg3)` 和类似语句的语法 `@mymacro arg1 arg2 arg3`。两种形式的语法可以相互转换；如果宏出现在另一个表达式中，则类似函数的形式尤其有用，并且它通常是最清晰的。类似语句的形式通常用于标注块，如在分布式 `for` 结构中：`@distributed for i in 1:n; #= body =#; end`。如果宏结构的结尾不那么清晰，请使用类似函数的形式。

  * Julia 有一个枚举类型，使用宏 `@enum(name, value1, value2, ...)` 来表示，例如：`@enum(Fruit, banana=1, apple, pear)`。

  * 按照惯例，修改其参数的函数在名称的末尾有个 `!`，例如 `push!`。

  * 在 C++ 中，默认情况下，你具有静态分派，即为了支持动态派发，你需要将函数标注为 virtual 函数。另一方面，Julia 中的每个方法都是「virtual」（尽管它更通用，因为方法是在每个参数类型上派发的，而不仅仅是 `this`，并且使用的是最具体的声明规则）。


### Julia ⇔ C/C++: Namespaces
  * C/C++ `namespace`s correspond roughly to Julia `module`s.
  * There are no private globals or fields in Julia.  Everything is publicly accessible
    through fully qualified paths (or relative paths, if desired).
  * `using MyNamespace::myfun` (C++) corresponds roughly to `import MyModule: myfun` (Julia).
  * `using namespace MyNamespace` (C++) corresponds roughly to `using MyModule` (Julia)
    * In Julia, only `export`ed symbols are made available to the calling module.
    * In C++, only elements found in the included (public) header files are made available.
  * Caveat: `import`/`using` keywords (Julia) also *load* modules (see below).
  * Caveat: `import`/`using` (Julia) works only at the global scope level (`module`s)
    * In C++, `using namespace X` works within arbitrary scopes (ex: function scope).

### Julia ⇔ C/C++: Module loading
  * When you think of a C/C++ "**library**", you are likely looking for a Julia "**package**".
    * Caveat: C/C++ libraries often house multiple "software modules" whereas Julia
      "packages" typically house one.
    * Reminder: Julia `module`s are global scopes (not necessarily "software modules").
  * **Instead of build/`make` scripts**, Julia uses "Project Environments" (sometimes called
    either "Project" or "Environment").
    * Build scripts are only needed for more complex applications
      (like those needing to compile or download C/C++ executables).
    * To develop application or project in Julia, you can initialize its root directory
      as a "Project Environment", and house application-specific code/packages there.
      This provides good control over project dependencies, and future reproducibility.
    * Available packages are added to a "Project Environment" with the `Pkg.add()` function or Pkg REPL mode.
      (This does not **load** said package, however).
    * The list of available packages (direct dependencies) for a "Project Environment" are
      saved in its `Project.toml` file.
    * The *full* dependency information for a "Project Environment" is auto-generated & saved
      in its `Manifest.toml` file by `Pkg.resolve()`.
  * Packages ("software modules") available to the "Project Environment" are loaded with
    `import` or `using`.
    * In C/C++, you `#include <moduleheader>` to get object/function declarations, and link in
      libraries when you build the executable.
    * In Julia, calling using/import again just brings the existing module into scope, but does not load it again
      (similar to adding the non-standard `#pragma once` to C/C++).
  * **Directory-based package repositories** (Julia) can be made available by adding repository
    paths to the `Base.LOAD_PATH` array.
    * Packages from directory-based repositories do not require the `Pkg.add()` tool prior to
      being loaded with `import` or `using`. They are simply available to the project.
    * Directory-based package repositories are the **quickest solution** to developping local
      libraries of "software modules".

### Julia ⇔ C/C++: Assembling modules
  * In C/C++, `.c`/`.cpp` files are compiled & added to a library with build/`make` scripts.
    * In Julia, `import [PkgName]`/`using [PkgName]` statements load `[PkgName].jl` located
      in a package's `[PkgName]/src/` subdirectory.
    * In turn, `[PkgName].jl` typically loads associated source files with calls to
      `include "[someotherfile].jl"`.
  * `include "./path/to/somefile.jl"` (Julia) is very similar to
    `#include "./path/to/somefile.jl"` (C/C++).
    * However `include "..."` (Julia) is not used to include header files (not required).
    * **Do not use** `include "..."` (Julia) to load code from other "software modules"
      (use `import`/`using` instead).
    * `include "path/to/some/module.jl"` (Julia) would instantiate multiple versions of the
      same code in different modules (creating *distinct* types (etc.) with the *same* names).
    * `include "somefile.jl"` is typically used to assemble multiple files *within the same
      Julia package* ("software module"). It is therefore relatively straightforward to ensure
      file are `include`d only once (No `#ifdef` confusion).

### Julia ⇔ C/C++: Module interface
  * C++ exposes interfaces using "public" `.h`/`.hpp` files whereas Julia `module`s mark
    specific symbols that are intended for their users as `public`or `export`ed.
    * Often, Julia `module`s simply add functionality by generating new "methods" to existing
      functions (ex: `Base.push!`).
    * Developers of Julia packages therefore cannot rely on header files for interface
      documentation.
    * Interfaces for Julia packages are typically described using docstrings, README.md,
      static web pages, ...
  * Some developers choose not to `export` all symbols required to use their package/module.
    * Users might be expected to access these components by qualifying functions/structs/...
      with the package/module name (ex: `MyModule.run_this_task(...)`).

### Julia ⇔ C/C++: Quick reference

| Software Concept   | Julia | C/C++ |
| :---               | :---  | :---  |
| unnamed scope      | `begin` ... `end`        | `{` ... `}`                                  |
| function scope     | `function x()` ... `end` | `int x() {` ... `}`                          |
| global scope       | `module MyMod` ... `end` | `namespace MyNS {` ... `}`                   |
| software module    | A Julia "package"        | `.h`/`.hpp` files<br>+compiled `somelib.a`   |
| assembling<br>software modules | `SomePkg.jl`: ...<br>`import("subfile1.jl")`<br>`import("subfile2.jl")`<br>... | `$(AR) *.o` &rArr; `somelib.a` |
| import<br>software module | `import SomePkg`  | `#include <somelib>`<br>+link in `somelib.a` |
| module library     | `LOAD_PATH[]`, \*Git repository,<br>\*\*custom package registry  | more `.h`/`.hpp` files<br>+bigger compiled `somebiglib.a` |

\* The Julia package manager supports registering multiple packages from a single Git repository.<br>
\* This allows users to house a library of related packages in a single repository.<br>
\*\* Julia registries are primarily designed to provide versioning \& distribution of packages.<br>
\*\* Custom package registries can be used to create a type of module library.


## [与 Common Lisp 的显著差异](@id Noteworthy-differences-from-Common-Lisp)

- Julia 默认使用 1 开始的数组索引，它也能处理任意的[索引顺序](@ref man-custom-indices)。

- 函数和变量共用一个命名空间（"Lisp-1"）。

- For performance, Julia prefers that operations have [type stability](@ref man-type-stability). Where Common Lisp abstracts away from the underlying machine operations, Julia cleaves closer to them. For example:
  - Integer division using `/` always returns a floating-point result, even if the computation is exact.
    - `//` always returns a rational result
    - `÷` always returns a (truncated) integer result
  - Bignums are supported, but conversion is not automatic; ordinary integers [overflow](@ref faq-integer-arithmetic).
  - Complex numbers are supported, but to get complex results, [you need complex inputs](@ref faq-domain-errors).
  - There are multiple Complex and Rational types, with different component types.

- 典型的使用 Julia 进行原型开发时，也会对镜像进行连续的修改，[Revise.jl](https://github.com/timholy/Revise.jl) 包提供了这个功能。

- 对于性能，Julia 更喜欢操作具有 [类型稳定性](@ref man-type-stability)。 Common Lisp 从底层机器操作中抽象出来，而 Julia 则更接近它们。 例如：
  - 使用 `/` 的整数除法总是返回浮点结果，即使计算是精确的。
    - `//` 总是返回一个有理数结果
    - `÷` 总是返回一个（被截断的）整数结果
  - Julia 支持大整数，但不会自动转换。默认的整数类型会[溢出](@ref faq-integer-arithmetic)。
  - 支持复数，但要获得复数结果，[你需要复数输入](@ref faq-domain-errors)。
  - 有多种 Complex 和 Rational 类型，具有不同的组成类型。

- 模块（名称空间）可以是分层的。[`import`](@ref) 和 [`using`](@ref) 有着双重角色：他们加载代码并让代码在命名空间中可用。`import` 用于仅有模块名是可用的情况，大致等价于 `ASDF:LOAD-OP`。槽名（Slot name）不需要单独导出。全局变量不能从模块的外部赋值，除了 `eval(mod, :(var = val))` 这个例外情况。

- 宏以 `@` 开头，并没有像 Common Lisp 那样无缝地集成到语言中；因此在 Julia 中，宏的使用不像在 Common Lisp 中那样广泛。Julia 支持[宏](@ref Metaprogramming)的一种卫生（hygiene）形式。因为不同的表层语法，Julia 中没有 `COMMON-LISP:&BODY` 的等价形式。

- **所有的**函数都是通用的并且使用多重分派。函数的参数列表也无需遵循一样的模板，这让我们有了一个强大的范式：[`do`](@ref)。可选参数与关键字参数的处理方式不同。方法的歧义没有像在 Common Lisp 对象系统中那样得到解决，因此需要为交集定义更具体的方法。

- 符号不属于任何包，它**本身**也不包含任何值。`M.var` 会对 `M` 模块里的  `var` 符号求值。

- Julia 完全支持函数式编程风格，包括闭包等特性。但这并不是 Julia 的惯用风格。修改捕获变量时需要一些额外的[变通](@ref man-performance-captured)以便提高性能。
