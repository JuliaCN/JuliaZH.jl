var documenterSearchIndex = {"docs": [

{
    "location": "#",
    "page": "主页",
    "title": "主页",
    "category": "page",
    "text": ""
},

{
    "location": "#Julia-0.7-中文文档-1",
    "page": "主页",
    "title": "Julia 0.7 中文文档",
    "category": "section",
    "text": "<!-- Welcome to the documentation for Julia 0.7. -->欢迎来到Julia 0.7中文文档。<!-- Please read the [release notes](NEWS.md) to see what has changed since the last release. -->\n\n<!-- 请阅读[发行通知](NEWS.md)来查看最新的更改。 --><!-- ### [Introduction](@id man-introduction) -->"
},

{
    "location": "#man-introduction-1",
    "page": "主页",
    "title": "简介",
    "category": "section",
    "text": "<!-- Scientific computing has traditionally required the highest performance, yet domain experts have\nlargely moved to slower dynamic languages for daily work. We believe there are many good reasons\nto prefer dynamic languages for these applications, and we do not expect their use to diminish.\nFortunately, modern language design and compiler techniques make it possible to mostly eliminate\nthe performance trade-off and provide a single environment productive enough for prototyping and\nefficient enough for deploying performance-intensive applications. The Julia programming language\nfills this role: it is a flexible dynamic language, appropriate for scientific and numerical computing,\nwith performance comparable to traditional statically-typed languages. -->科学计算对性能一直有着最高的需求， 但现在这个领域的专家开始大量使用比较慢的动态语言来完成日常工作。 我们相信有很多使用动态语言的理由， 所以我们不会舍弃这样的特性。幸运的是，现代语言设计和编译器技术使得为原型设计提供单一的高效开发环境， 并且配置高性能的应用成为可能。Julia 语言在这其中扮演了这样一个角色：作为灵活的动态语言，适合科学和数值计算，性能可与传统静态类型语言媲美。<!-- Because Julia\'s compiler is different from the interpreters used for languages like Python or\nR, you may find that Julia\'s performance is unintuitive at first. If you find that something is\nslow, we highly recommend reading through the [Performance Tips](@ref man-performance-tips) section before trying anything\nelse. Once you understand how Julia works, it\'s easy to write code that\'s nearly as fast as C. -->由于 Julia 的编译器和其它语言比如 Python 或 R 有所不同，一开始您或许会觉得 Julia 中什么样的代码运行效率高，什么样的代码运行效率低似乎并不很直观。 如果您发现 Julia 变慢了，我们非常建议您在尝试其它功能前读一下提高性能的窍门 。只要您理解 Julia 的工作方式， 就会很容易地写出运行效率甚至可以和 C 相媲美的代码。<!-- Julia features optional typing, multiple dispatch, and good performance, achieved using type inference\nand [just-in-time (JIT) compilation](https://en.wikipedia.org/wiki/Just-in-time_compilation),\nimplemented using [LLVM](https://en.wikipedia.org/wiki/Low_Level_Virtual_Machine). It is multi-paradigm,\ncombining features of imperative, functional, and object-oriented programming. Julia provides\nease and expressiveness for high-level numerical computing, in the same way as languages such\nas R, MATLAB, and Python, but also supports general programming. To achieve this, Julia builds\nupon the lineage of mathematical programming languages, but also borrows much from popular dynamic\nlanguages, including [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)), [Perl](https://en.wikipedia.org/wiki/Perl_(programming_language)),\n[Python](https://en.wikipedia.org/wiki/Python_(programming_language)), [Lua](https://en.wikipedia.org/wiki/Lua_(programming_language)),\nand [Ruby](https://en.wikipedia.org/wiki/Ruby_(programming_language)). -->Julia 具有通过类型推倒和即时编译（JIT）在LLVM上实现的可选类型标注，多重派发，良好的性能。它是一个支持过程式，函数式 面向对象编程的多范式语言。它提供了简易和简洁的高等数值计算，它类似于 R 、 MATLAB 和 Python ，支持一般用途的编程。为了达到这个目的 Julia 在数学编程语言的基础上，参考了不少流行动态语言，例如Lisp, Perl, Python, Lua, 和 Ruby。<!-- The most significant departures of Julia from typical dynamic languages are:\n\n  * The core language imposes very little; Julia Base and the standard library is written in Julia itself, including\n    primitive operations like integer arithmetic\n  * A rich language of types for constructing and describing objects, that can also optionally be\n    used to make type declarations\n  * The ability to define function behavior across many combinations of argument types via [multiple dispatch](https://en.wikipedia.org/wiki/Multiple_dispatch)\n  * Automatic generation of efficient, specialized code for different argument types\n  * Good performance, approaching that of statically-compiled languages like C -->Julia 与传统动态语言最大的区别是：核心语言很小；标准库是用 Julia 本身写的，如整数运算在内的基础运算\n完善的类型，方便构造对象和做类型声明\n基于多重派发通过很多不同的参数类型来定义函数行为的能力\n为不同类型自动生成高效，专用的代码\n接近C语言的，良好的性能<!-- Although one sometimes speaks of dynamic languages as being \"typeless\", they are definitely not:\nevery object, whether primitive or user-defined, has a type. The lack of type declarations in\nmost dynamic languages, however, means that one cannot instruct the compiler about the types of\nvalues, and often cannot explicitly talk about types at all. In static languages, on the other\nhand, while one can -- and usually must -- annotate types for the compiler, types exist only at\ncompile time and cannot be manipulated or expressed at run time. In Julia, types are themselves\nrun-time objects, and can also be used to convey information to the compiler. -->尽管，一些人有时说动态语言是“无类型的”，但实际上他们并不是这样：每一个对象，无论是基础的还是用户自己定义的，都有一个类型。 在大多数动态语言中都缺乏类型声明，而这往往意味着无法指示编译器值的类型，也就无法显示地讨论类型。另一方面，静态语言中，虽然可以标记类型 （往往也必须这么做），但是类型只在编译时期才存在，而无法在运行时进行操作和表达。在 Julia 里，类型是它们自己的动态对象，也可以 被用来给编译器提供相应的信息。<!-- While the casual programmer need not explicitly use types or multiple dispatch, they are the core\nunifying features of Julia: functions are defined on different combinations of argument types,\nand applied by dispatching to the most specific matching definition. This model is a good fit\nfor mathematical programming, where it is unnatural for the first argument to \"own\" an operation\nas in traditional object-oriented dispatch. Operators are just functions with special notation\n-- to extend addition to new user-defined data types, you define new methods for the `+` function.\nExisting code then seamlessly applies to the new data types. -->类型系统和多重派发是 Julia 语言最主要的特征（尽管类型和多重派发并不必要被显式使用）：函数通过函数名称和不同类型变量的组合进行定义，然后在调用时会派发 最接近（most specific）的定义上去。这样的编程模型非常适合数学化的编程，尤其是在传统的面向对象派发中，一些函数的第一个变量理论上并不“拥有”这样一个操作时。 而在Julia中运算符只是函数的一个特殊标记——例如，为用户定义的新类型添加加法运算，你只要为+函数定义一个新的方法就可以了。 已有的代码就可以无缝接入这个新的类型。<!-- Partly because of run-time type inference (augmented by optional type annotations), and partly\nbecause of a strong focus on performance from the inception of the project, Julia\'s computational\nefficiency exceeds that of other dynamic languages, and even rivals that of statically-compiled\nlanguages. For large scale numerical problems, speed always has been, continues to be, and probably\nalways will be crucial: the amount of data being processed has easily kept pace with Moore\'s Law\nover the past decades. -->一部分是因为动态类型推导（可以被可选的类型标注增强），另一部分是因为在这个语言建立之初就对性能非常看重，Julia 的计算性能超过了其它的 动态语言，甚至能够与静态编译语言竞争。对于大型数值问题，速度一直都是，也一直会是一个重要的关注点：这些年以来，被处理的数据量的增长有着Moore定律。<!-- Julia aims to create an unprecedented combination of ease-of-use, power, and efficiency in a single\nlanguage. In addition to the above, some advantages of Julia over comparable systems include:\n\n  * Free and open source ([MIT licensed](https://github.com/JuliaLang/julia/blob/master/LICENSE.md))\n  * User-defined types are as fast and compact as built-ins\n  * No need to vectorize code for performance; devectorized code is fast\n  * Designed for parallelism and distributed computation\n  * Lightweight \"green\" threading ([coroutines](https://en.wikipedia.org/wiki/Coroutine))\n  * Unobtrusive yet powerful type system\n  * Elegant and extensible conversions and promotions for numeric and other types\n  * Efficient support for [Unicode](https://en.wikipedia.org/wiki/Unicode), including but not limited\n    to [UTF-8](https://en.wikipedia.org/wiki/UTF-8)\n  * Call C functions directly (no wrappers or special APIs needed)\n  * Powerful shell-like capabilities for managing other processes\n  * Lisp-like macros and other metaprogramming facilities -->Julia 的目标是创建一个前所未有的集易用、强大、高效于一体的语言。除此之外，Julia 的优势还在于：免费开源（MIT协议）\n用户定义的类型和内建类型一样快和兼容\n无需特意编写向量化的代码；非向量化的代码就很快\n为并行计算和分布式计算设计\n轻量级的“绿色”线程（(协程)）\n低调又牛逼的类型系统\n优雅、可扩展的类型转换\n高效支持Unicode，包括但不限于UTF-8\n直接调用 C 函数（不需封装或调用特别的 API）\n像 Shell 一样强大的管理其他进程的能力\n像 Lisp 一样的宏和其他元编程工具"
},

{
    "location": "manual/getting-started/#",
    "page": "起步",
    "title": "起步",
    "category": "page",
    "text": "<!-- # [Getting Started](@id man-getting-started) -->"
},

{
    "location": "manual/getting-started/#man-getting-started-1",
    "page": "起步",
    "title": "起步",
    "category": "section",
    "text": "<!-- Julia installation is straightforward, whether using precompiled binaries or compiling from source.\nDownload and install Julia by following the instructions at [https://julialang.org/downloads/](https://julialang.org/downloads/). -->不管是用编译好的程序，还是自己从源码编译，安装 Julia 都是一件很简单的事情。按照 https://julialang.org/downloads/ 的提示就可以轻松下载并安装 Julia。<!-- The easiest way to learn and experiment with Julia is by starting an interactive session (also\nknown as a read-eval-print loop or \"REPL\") by double-clicking the Julia executable or running\n`julia` from the command line: -->启动一个交互式会话（也被叫做 REPL）是学习和尝试 Julia 最简单的方法。双击 Julia 的可执行文件或是从命令行运行 julia 就可以启动：io = IOBuffer()\nBase.banner(io)\nbanner = String(take!(io))\nimport Markdown\nMarkdown.parse(\"```\\n\\$ julia\\n\\n$(banner)\\njulia> 1 + 2\\n3\\n\\njulia> ans\\n3\\n```\")<!-- To exit the interactive session, type `CTRL-D` (press the Control/`^` key together with the `d` key), or type\n`exit()`. When run in interactive mode, `julia` displays a banner and prompts the user for input.\nOnce the user has entered a complete expression, such as `1 + 2`, and hits enter, the interactive\nsession evaluates the expression and shows its value. If an expression is entered into an interactive\nsession with a trailing semicolon, its value is not shown. The variable `ans` is bound to the\nvalue of the last evaluated expression whether it is shown or not. The `ans` variable is only\nbound in interactive sessions, not when Julia code is run in other ways. -->输入 ^D （Ctrl 和 d 两键同时按）或 quit() 以退出交互式会话。在交互式模式中，julia 会显示一个大标题并提示用户输入。一旦用户输入了一个完整的表达式，例如 1 + 2，然后敲回车，交互式会话就会对表达式进行求值并显示出来。如果一个输入交互式会话中的表达式以分号结尾，求得的值将不会被显示。变量 ans 被绑定到上一个被求值的表达式的结果，不管有没有被显示。注意 ans 变量只适用于交互式会话中，不适用于其它方法运行的 Julia。<!-- To evaluate expressions written in a source file `file.jl`, write `include(\"file.jl\")`. -->如果想运行写在源文件 file.jl 中的表达式，只需输入 include(\"file.jl\")。<!-- To run code in a file non-interactively, you can give it as the first argument to the `julia`\ncommand: -->如果想非交互式地执行文件中的代码，可以把文件名作为 julia 命令的第一个参数：$ julia script.jl arg1 arg2...<!-- As the example implies, the following command-line arguments to `julia` are interpreted as\ncommand-line arguments to the program `script.jl`, passed in the global constant `ARGS`. The\nname of the script itself is passed in as the global `PROGRAM_FILE`. Note that `ARGS` is\nalso set when a Julia expression is given using the `-e` option on the command line (see the\n`julia` help output below) but `PROGRAM_FILE` will be empty. For example, to just print the\narguments given to a script, you could do this: -->如这个例子所示，julia 后跟着的命令行参数会被作为程序 script.jl 的命令行参数。这些参数使用全局常量 ARGS 来传递，脚本自身的名字会以全局常量 PROGRAM_FILE 传入。注意当脚本以命令行里的 -e 选项输入时，ARGS 也会被设定（见下面的 julia 帮助输出）但是 PROGRAM_FILE 会是空的。比如说，如果想把输入给一个脚本的参数给显示出来，你可以这么写：$ julia -e \'println(PROGRAM_FILE); for x in ARGS; println(x); end\' foo bar\n\nfoo\nbar<!-- Or you could put that code into a script and run it: -->或者你可以把代码写到一个脚本文件中再执行它：$ echo \'println(PROGRAM_FILE); for x in ARGS; println(x); end\' > script.jl\n$ julia script.jl foo bar\nscript.jl\nfoo\nbar<!-- The `--` delimiter can be used to separate command-line arguments intended for the script file from arguments intended for Julia: -->可以使用 -- 分隔符来将传给脚本文件和 Julia 本身的命令行参数分开：$ julia --color=yes -O -- foo.jl arg1 arg2..<!-- Julia can be started in parallel mode with either the `-p` or the `--machine-file` options. `-p n`\nwill launch an additional `n` worker processes, while `--machine-file file` will launch a worker\nfor each line in file `file`. The machines defined in `file` must be accessible via a password-less\n`ssh` login, with Julia installed at the same location as the current host. Each machine definition\ntakes the form `[count*][user@]host[:port] [bind_addr[:port]]`. `user` defaults to current user,\n`port` to the standard ssh port. `count` is the number of workers to spawn on the node, and defaults\nto 1. The optional `bind-to bind_addr[:port]` specifies the IP address and port that other workers\nshould use to connect to this worker. -->使用选项 -p 或者 --machine-file 可以在并行模式下启动 Julia。-p n 会启动额外的 n 个 worker，--machine-file file 会为 file 文件中的每一行启动一个 worker。被定义在 file 中的机器必须能够通过一个不需要密码的 ssh 登陆访问到，且 Julia 的安装位置需要和当前主机相同。定义机器的格式为 [count*][user@]host[:port] [bind_addr[:port]]。user 默认值是当前用户，port 默认值是标准 ssh 端口。count 是在这个节点上的 worker 的数量，默认是 1。可选的 bind-to bind_addr[:port] 指定了其它 worker 访问当前 worker 应当使用的 IP 地址与端口。<!-- If you have code that you want executed whenever Julia is run, you can put it in\n`~/.julia/config/startup.jl`: -->如果你有一些代码，想让 Julia 每次启动都会自动执行，可以把它们放在 ~/.juliarc.jl 中：$ echo \'println(\"Greetings! 你好! 안녕하세요?\")\' > ~/.julia/config/startup.jl\n$ julia\nGreetings! 你好! 안녕하세요?\n\n...<!-- There are various ways to run Julia code and provide options, similar to those available for the\n`perl` and `ruby` programs: -->还有很多种运行 Julia 代码和提供选项的方法，和 perl 和 ruby 之类的程序中可用的方法类似：julia [switches] -- [programfile] [args...]Switch Description\n-v, --version Display version information\n-h, --help Print this message\n-J, --sysimage <file> Start up with the given system image file\n-H, --home <dir> Set location of julia executable\n--startup-file={yes|no} Load ~/.julia/config/startup.jl\n--handle-signals={yes|no} Enable or disable Julia\'s default signal handlers\n--sysimage-native-code={yes|no} Use native code from system image if available\n--compiled-modules={yes|no} Enable or disable incremental precompilation of modules\n-e, --eval <expr> Evaluate <expr>\n-E, --print <expr> Evaluate <expr> and display the result\n-L, --load <file> Load <file> immediately on all processors\n-p, --procs {N|auto} Integer value N launches N additional local worker processes; auto launches as many workers as the number of local CPU threads (logical cores)\n--machine-file <file> Run processes on hosts listed in <file>\n-i Interactive mode; REPL runs and isinteractive() is true\n-q, --quiet Quiet startup: no banner, suppress REPL warnings\n--banner={yes|no|auto} Enable or disable startup banner\n--color={yes|no|auto} Enable or disable color text\n--history-file={yes|no} Load or save history\n--depwarn={yes|no|error} Enable or disable syntax and method deprecation warnings (error turns warnings into errors)\n--warn-overwrite={yes|no} Enable or disable method overwrite warnings\n-C, --cpu-target <target> Limit usage of cpu features up to <target>; set to help to see the available options\n-O, --optimize={0,1,2,3} Set the optimization level (default level is 2 if unspecified or 3 if used without a level)\n-g, -g <level> Enable / Set the level of debug info generation (default level is 1 if unspecified or 2 if used without a level)\n--inline={yes|no} Control whether inlining is permitted, including overriding @inline declarations\n--check-bounds={yes|no} Emit bounds checks always or never (ignoring declarations)\n--math-mode={ieee,fast} Disallow or enable unsafe floating point optimizations (overrides @fastmath declaration)\n--code-coverage={none|user|all} Count executions of source lines\n--code-coverage equivalent to --code-coverage=user\n--track-allocation={none|user|all} Count bytes allocated by each source line\n--track-allocation equivalent to --track-allocation=user<!-- ## Resources -->"
},

{
    "location": "manual/getting-started/#资源-1",
    "page": "起步",
    "title": "资源",
    "category": "section",
    "text": "除了本手册以外，官方网站上还有很多其它可以帮助新用户学习 Julia 的资源（英文），这里是一个学习资源的列表：learning"
},

{
    "location": "manual/variables/#",
    "page": "变量",
    "title": "变量",
    "category": "page",
    "text": ""
},

{
    "location": "manual/variables/#变量-1",
    "page": "变量",
    "title": "变量",
    "category": "section",
    "text": "<!-- # Variables -->Julia 中，变量（Variable）即是关联（或绑定）到一个值的名字。当你想存下一个值（比如从某些数学运算后得到的）以备后用时，变量就显得非常有用。例如：<!-- A variable, in Julia, is a name associated (or bound) to a value. It\'s useful when you want to\nstore a value (that you obtained after some math, for example) for later use. For example: --># Assign the value 10 to the variable x\njulia> x = 10\n10\n\n# Doing math with x\'s value\njulia> x + 1\n11\n\n# Reassign x\'s value\njulia> x = 1 + 1\n2\n\n# You can assign values of other types, like strings of text\njulia> x = \"Hello World!\"\n\"Hello World!\"Julia 为变量命名提供了一个极其灵活的系统。变量名区分大小写，并且没有语义上的意义（语言不会因为变量的名字区别而区别对待它们）。<!-- Julia provides an extremely flexible system for naming variables. Variable names are case-sensitive,\nand have no semantic meaning (that is, the language will not treat variables differently based\non their names). -->julia> x = 1.0\n1.0\n\njulia> y = -3\n-3\n\njulia> Z = \"My string\"\n\"My string\"\n\njulia> customary_phrase = \"Hello world!\"\n\"Hello world!\"\n\njulia> UniversalDeclarationOfHumanRightsStart = \"人人生而自由，在尊严和权利上一律平等。\"\n\"人人生而自由，在尊严和权利上一律平等。\"也可以使用 Unicode 字符（UTF-8 编码）来命名：<!-- Unicode names (in UTF-8 encoding) are allowed: -->julia> δ = 0.00001\n1.0e-5\n\njulia> 안녕하세요 = \"Hello\"\n\"Hello\"在 Julia 的 REPL 以及一些其它的 Julia 编辑环境中，很多 Unicode 的数学符号可以使用反斜杠加 LaTeX 符号名并跟上一个 tab 打出。例如，想输入变量名 δ 的话，可以输入 \\delta-tab。你甚至可以用 \\alpha-tab-\\hat-tab-\\_2-tab 来输入 α̂₂ 这样复杂的名字。如果你在某个地方（比如别人的代码里）看到一个不知道怎么输入的符号，REPL 的帮助功能会告诉你：只需要输入 ? 然后粘贴上那个符号即可。<!-- In the Julia REPL and several other Julia editing environments, you can type many Unicode math\nsymbols by typing the backslashed LaTeX symbol name followed by tab. For example, the variable\nname `δ` can be entered by typing `\\delta`-*tab*, or even `α̂₂` by `\\alpha`-*tab*-`\\hat`-\n*tab*-`\\_2`-*tab*. (If you find a symbol somewhere, e.g. in someone else\'s code,\nthat you don\'t know how to type, the REPL help will tell you: just type `?` and\nthen paste the symbol.) -->Julia 甚至允许你在需要的时候重新定义那些内建常量和函数（虽然为了避免潜在的混乱，这是不被推荐的）：<!-- Julia will even let you redefine built-in constants and functions if needed (although\nthis is not recommended to avoid potential confusions): -->julia> pi = 3\n3\n\njulia> pi\n3\n\njulia> sqrt = 4\n4然而，如果试图重新定义一个已经在使用中的内建常量或函数，Julia 会报错：<!-- However, if you try to redefine a built-in constant or function already in use, Julia will give\nyou an error: -->julia> pi\nπ = 3.1415926535897...\n\njulia> pi = 3\nERROR: cannot assign variable MathConstants.pi from module Main\n\njulia> sqrt(100)\n10.0\n\njulia> sqrt = 4\nERROR: cannot assign variable Base.sqrt from module Main"
},

{
    "location": "manual/variables/#可用的变量名-1",
    "page": "变量",
    "title": "可用的变量名",
    "category": "section",
    "text": "<!-- ## Allowed Variable Names -->变量名的第一位必须以下字符：字母（A-Z 或者 a-z）或下划线（_）\n或编码大于 00A0 的 Unicode 字符的一个子集。具体来说指的是，Unicode 字符分类中的\nLu/Ll/Lt/Lm/Lo/Nl（字母）\nSc/So（货币及其他符号）\n一些其它像字母的符号（比如，Sm 数学符号的一个子集）后续的字符可以包含 ! 和数字（0-9 和其它处于 Nd/No 分类中的字符），以及其它 Unicode 字符：变音和其它修饰符号（Mn/Mc/Me/Sk 分类），一些连接标点（Pc 分类），角分符号和一些其他字符。\n<!-- Variable names must begin with a letter (A-Z or a-z), underscore, or a subset of Unicode code\npoints greater than 00A0; in particular, [Unicode character categories](http://www.fileformat.info/info/unicode/category/index.htm)\nLu/Ll/Lt/Lm/Lo/Nl (letters), Sc/So (currency and other symbols), and a few other letter-like characters\n(e.g. a subset of the Sm math symbols) are allowed. Subsequent characters may also include ! and\ndigits (0-9 and other characters in categories Nd/No), as well as other Unicode code points: diacritics\nand other modifying marks (categories Mn/Mc/Me/Sk), some punctuation connectors (category Pc),\nprimes, and a few other characters. -->像 + 这样的运算符也是合法的标识符，但会被特殊地解析。在一些上下文中，运算符可以就像变量一样被使用。比如说，(+) 指的是加法函数，且 (+) = f 会把它重新赋值。大多数表示中缀运算符的 Unicode 字符（在 Sm 分类中的），比如说 ⊕，都会被解析成中缀运算符，且可供用户定义的方法使用（比如说，可以用 const ⊗ = kron 来定义 ⊗ 为一个中缀的克罗内克积）。运算符也可以放在一些修饰符、角分符号和上下标之前，比如说 +̂ₐ″ 会被解析成一个和 + 同样优先级的中缀运算符。<!-- Operators like `+` are also valid identifiers, but are parsed specially. In some contexts, operators\ncan be used just like variables; for example `(+)` refers to the addition function, and `(+) = f`\nwill reassign it. Most of the Unicode infix operators (in category Sm), such as `⊕`, are parsed\nas infix operators and are available for user-defined methods (e.g. you can use `const ⊗ = kron`\nto define `⊗` as an infix Kronecker product).  Operators can also be suffixed with modifying marks,\nprimes, and sub/superscripts, e.g. `+̂ₐ″` is parsed as an infix operator with the same precedence as `+`.\n-->内建语句的名字是唯一明确被禁止的变量名：<!-- The only explicitly disallowed names for variables are the names of built-in statements: -->julia> else = false\nERROR: syntax: unexpected \"else\"\n\njulia> try = \"No\"\nERROR: syntax: unexpected \"=\"有一些 Unicode 字符作为标识符会被认为是等价的。输入 Unicode 组合字符（比如重音）的不同方式也被看作是等价的（具体来说，Julia 标识符是 NFC-正规化的）。Unicode 字符 ɛ (U+025B: Latin small letter open e) 和 µ (U+00B5: micro sign) 会被视为与相应的希腊字母等价，因为前者在一些输入方式中很容易访问到。<!-- Some Unicode characters are considered to be equivalent in identifiers.\nDifferent ways of entering Unicode combining characters (e.g., accents)\nare treated as equivalent (specifically, Julia identifiers are NFC-normalized).\nThe Unicode characters `ɛ` (U+025B: Latin small letter open e)\nand `µ` (U+00B5: micro sign) are treated as equivalent to the corresponding\nGreek letters, because the former are easily accessible via some input methods. -->"
},

{
    "location": "manual/variables/#命名规范-1",
    "page": "变量",
    "title": "命名规范",
    "category": "section",
    "text": "\n<!-- ## Stylistic Conventions -->尽管 Julia 对命名本身只有很少的限制，但遵循下列规范是很有用的：\n<!-- While Julia imposes few restrictions on valid names, it has become useful to adopt the following\nconventions: -->变量名使用小写字母。\n单词分隔符可以使用下划线（\'_\'），但除非名字很难阅读否则并不鼓励使用下划线。\nType 和 Module 的名字都使用大写字母开头，且单词的分隔使用大写驼峰命名法而不是下划线。\nfunction 和 macro 的名字使用小写字母，并不含下划线。\n会写入自身参数的函数名使用 ! 作为结尾。这样的函数有时被称为“变异（mutating）”或是“原地（in-place）”函数，因为调用它们除了会返回一个值之外，参数还会产生变化。  <!-- * Names of variables are in lower case.\n  * Word separation can be indicated by underscores (`\'_\'`), but use of underscores is discouraged\n    unless the name would be hard to read otherwise.\n  * Names of `Type`s and `Module`s begin with a capital letter and word separation is shown with upper\n    camel case instead of underscores.\n  * Names of `function`s and `macro`s are in lower case, without underscores.\n  * Functions that write to their arguments have names that end in `!`. These are sometimes called\n    \"mutating\" or \"in-place\" functions because they are intended to produce changes in their arguments\n    after the function is called, not just return a value. -->关于命名规范的更多信息请参考代码风格指南。\n<!-- For more information about stylistic conventions, see the [Style Guide](@ref). -->"
},

{
    "location": "manual/integers-and-floating-point-numbers/#",
    "page": "整数和浮点数",
    "title": "整数和浮点数",
    "category": "page",
    "text": ""
},

{
    "location": "manual/integers-and-floating-point-numbers/#整数和浮点数-1",
    "page": "整数和浮点数",
    "title": "整数和浮点数",
    "category": "section",
    "text": "<!-- # Integers and Floating-Point Numbers -->整数和浮点值是算术和计算的基础。这些数值内建的表示被称作数值原始类型（numeric primitive），且整数和浮点数在代码中作为即时的值被称作数值字面量（numeric literal）。例如，1 是个整型字面量，1.0 是个浮点型字面量，它们在内存中作为对象的二进制表示就是数值原始类型。<!-- Integers and floating-point values are the basic building blocks of arithmetic and computation.\nBuilt-in representations of such values are called numeric primitives, while representations of\nintegers and floating-point numbers as immediate values in code are known as numeric literals.\nFor example, `1` is an integer literal, while `1.0` is a floating-point literal; their binary\nin-memory representations as objects are numeric primitives. -->Julia 提供了很丰富的原始数值类型，以及在它们上定义的整套的算术与按位运算符和标准数学函数。这些函数直接映射到现代计算机原生支持的数值类型及运算上，因此 Julia 可以完整地利用运算资源的优势。此外，Julia 还为任意精度算术提供了软件支持，从而能够处理在那些无法高效地使用原生硬件表示的数值上的运算，虽然需要以性能变得相对低一些为代价。<!-- Julia provides a broad range of primitive numeric types, and a full complement of arithmetic and\nbitwise operators as well as standard mathematical functions are defined over them. These map\ndirectly onto numeric types and operations that are natively supported on modern computers, thus\nallowing Julia to take full advantage of computational resources. Additionally, Julia provides\nsoftware support for [Arbitrary Precision Arithmetic](@ref), which can handle operations on numeric\nvalues that cannot be represented effectively in native hardware representations, but at the cost\nof relatively slower performance. -->以下是 Julia 的原始数值类型：整数类型：<!-- The following are Julia\'s primitive numeric types: -->\n<!-- * **Integer types:** -->类型 带符号? 比特数 最小值 最大值\nInt8 ✓ 8 -2^7 2^7 - 1\nUInt8  8 0 2^8 - 1\nInt16 ✓ 16 -2^15 2^15 - 1\nUInt16  16 0 2^16 - 1\nInt32 ✓ 32 -2^31 2^31 - 1\nUInt32  32 0 2^32 - 1\nInt64 ✓ 64 -2^63 2^63 - 1\nUInt64  64 0 2^64 - 1\nInt128 ✓ 128 -2^127 2^127 - 1\nUInt128  128 0 2^128 - 1\nBool N/A 8 false (0) true (1)<!--\n| Type              | Signed? | Number of bits | Smallest value | Largest value |\n|:------------------|:--------|:---------------|:---------------|:--------------|\n| [`Int8`](@ref)    | ✓       | 8              | -2^7           | 2^7 - 1       |\n| [`UInt8`](@ref)   |         | 8              | 0              | 2^8 - 1       |\n| [`Int16`](@ref)   | ✓       | 16             | -2^15          | 2^15 - 1      |\n| [`UInt16`](@ref)  |         | 16             | 0              | 2^16 - 1      |\n| [`Int32`](@ref)   | ✓       | 32             | -2^31          | 2^31 - 1      |\n| [`UInt32`](@ref)  |         | 32             | 0              | 2^32 - 1      |\n| [`Int64`](@ref)   | ✓       | 64             | -2^63          | 2^63 - 1      |\n| [`UInt64`](@ref)  |         | 64             | 0              | 2^64 - 1      |\n| [`Int128`](@ref)  | ✓       | 128            | -2^127         | 2^127 - 1     |\n| [`UInt128`](@ref) |         | 128            | 0              | 2^128 - 1     |\n| [`Bool`](@ref)    | N/A     | 8              | `false` (0)    | `true` (1)    |\n -->浮点类型：类型 精度 比特数\nFloat16 half 16\nFloat32 single 32\nFloat64 double 64<!-- * **Floating-point types:** -->\n\n<!--\n| Type              | Precision                                                                      | Number of bits |\n|:------------------|:-------------------------------------------------------------------------------|:---------------|\n| [`Float16`](@ref) | [half](https://en.wikipedia.org/wiki/Half-precision_floating-point_format)     | 16             |\n| [`Float32`](@ref) | [single](https://en.wikipedia.org/wiki/Single_precision_floating-point_format) | 32             |\n| [`Float64`](@ref) | [double](https://en.wikipedia.org/wiki/Double_precision_floating-point_format) | 64             |\n -->此外，对复数和分数的完整支持是在这些原始类型之上建立起来的。多亏了 Julia 有一个很灵活的、用户可扩展的类型提升系统，所有的数值类型都无需现实转换就可以很自然地相互进行运算。<!-- Additionally, full support for [Complex and Rational Numbers](@ref) is built on top of these primitive\nnumeric types. All numeric types interoperate naturally without explicit casting, thanks to a\nflexible, user-extensible [type promotion system](@ref conversion-and-promotion). -->"
},

{
    "location": "manual/integers-and-floating-point-numbers/#整数-1",
    "page": "整数和浮点数",
    "title": "整数",
    "category": "section",
    "text": "<!-- ## Integers -->字面的整数以标准习俗表示：<!-- Literal integers are represented in the standard manner: -->julia> 1\n1\n\njulia> 1234\n1234整型字面量的默认类型决定于目标系统是 32 位架构还是 64 位的：<!-- The default type for an integer literal depends on whether the target system has a 32-bit architecture\nor a 64-bit architecture: --># 32-bit system:\njulia> typeof(1)\nInt32\n\n# 64-bit system:\njulia> typeof(1)\nInt64Julia 的内部变量 Sys.WORD_SIZE 指示了目标系统是 32 位还是 64 位：<!-- The Julia internal variable [`Sys.WORD_SIZE`](@ref) indicates whether the target system is 32-bit\nor 64-bit: --># 32-bit system:\njulia> Sys.WORD_SIZE\n32\n\n# 64-bit system:\njulia> Sys.WORD_SIZE\n64Julia 也定义了 Int 与 UInt 类型，它们分别是系统有符号和无符号的原生整数类型的别名。<!-- Julia also defines the types `Int` and `UInt`, which are aliases for the system\'s signed and unsigned\nnative integer types respectively: --># 32-bit system:\njulia> Int\nInt32\njulia> UInt\nUInt32\n\n# 64-bit system:\njulia> Int\nInt64\njulia> UInt\nUInt64那些超过 32 位表示的大整数，如果能用 64 位表示，则无论是什么系统都会用 64 位表示：<!-- Larger integer literals that cannot be represented using only 32 bits but can be represented in\n64 bits always create 64-bit integers, regardless of the system type: --># 32-bit or 64-bit system:\njulia> typeof(3000000000)\nInt64无符号整数通过 0x 前缀以及十六进制数 0-9a-f 输入和输出（输入也可以使用大写的 A-F）。无符号值的位数决定于使用的十六进制数字的数量：<!-- Unsigned integers are input and output using the `0x` prefix and hexadecimal (base 16) digits\n`0-9a-f` (the capitalized digits `A-F` also work for input). The size of the unsigned value is\ndetermined by the number of hex digits used: -->julia> 0x1\n0x01\n\njulia> typeof(ans)\nUInt8\n\njulia> 0x123\n0x0123\n\njulia> typeof(ans)\nUInt16\n\njulia> 0x1234567\n0x01234567\n\njulia> typeof(ans)\nUInt32\n\njulia> 0x123456789abcdef\n0x0123456789abcdef\n\njulia> typeof(ans)\nUInt64\n\njulia> 0x11112222333344445555666677778888\n0x11112222333344445555666677778888\n\njulia> typeof(ans)\nUInt128这种做法是由于当人们使用无符号十六进制字面量表示整数值，通常会用它们来表示一个固定的数值字节序列，而不仅仅是个整数值。<!-- This behavior is based on the observation that when one uses unsigned hex literals for integer\nvalues, one typically is using them to represent a fixed numeric byte sequence, rather than just\nan integer value. -->还记得这个 ans 吗？它表示交互式会话中上一个表达式的运算结果，但是在其他方式运行的 Julia 代码不存在。<!-- Recall that the variable [`ans`](@ref) is set to the value of the last expression evaluated in\nan interactive session. This does not occur when Julia code is run in other ways. -->二进制和八进制字面量也受到支持：<!-- Binary and octal literals are also supported: -->julia> 0b10\n0x02\n\njulia> typeof(ans)\nUInt8\n\njulia> 0o010\n0x08\n\njulia> typeof(ans)\nUInt8\n\njulia> 0x00000000000000001111222233334444\n0x00000000000000001111222233334444\n\njulia> typeof(ans)\nUInt128十六进制、二进制和八进制的字面量都会产生无符号的整数类型。当字面量不是开头全是 0 时，它们二进制数据项的位数会是最少需要的位数。当开头都是 0 时，位数决定于一个字面量的最少需要位数，这里的字面量指的是一个有着同样长度但开头都为 1 的数。这样用户就可以控制位数了。那些无法使用 UInt128 类型存储下的值无法写成这样的字面量。<!-- As for hexadecimal literals, binary and octal literals produce unsigned integer types. The size\nof the binary data item is the minimal needed size, if the leading digit of the literal is not\n`0`. In the case of leading zeros, the size is determined by the minimal needed size for a\nliteral, which has the same length but leading digit `1`. That allows the user to control\nthe size.\nValues, which cannot be stored in `UInt128` cannot be written as such literals. -->二进制、八进制和十六进制的字面量可以在前面紧接着加一个 - 符号，这样可以产生一个和原字面量有着同样位数而值为原数的补码（二补数）：<!-- Binary, octal, and hexadecimal literals may be signed by a `-` immediately preceding the\nunsigned literal. They produce an unsigned integer of the same size as the unsigned literal\nwould do, with the two\'s complement of the value: -->julia> -0x2\n0xfe\n\njulia> -0x0002\n0xfffe整型等原始数值类型的最小和最大可表示的值可用 typemin 和 typemax 函数得到：<!-- The minimum and maximum representable values of primitive numeric types such as integers are given\nby the [`typemin`](@ref) and [`typemax`](@ref) functions: -->julia> (typemin(Int32), typemax(Int32))\n(-2147483648, 2147483647)\n\njulia> for T in [Int8,Int16,Int32,Int64,Int128,UInt8,UInt16,UInt32,UInt64,UInt128]\n           println(\"$(lpad(T,7)): [$(typemin(T)),$(typemax(T))]\")\n       end\n   Int8: [-128,127]\n  Int16: [-32768,32767]\n  Int32: [-2147483648,2147483647]\n  Int64: [-9223372036854775808,9223372036854775807]\n Int128: [-170141183460469231731687303715884105728,170141183460469231731687303715884105727]\n  UInt8: [0,255]\n UInt16: [0,65535]\n UInt32: [0,4294967295]\n UInt64: [0,18446744073709551615]\nUInt128: [0,340282366920938463463374607431768211455]typemin 和 typemax 返回的值总是属于所给的参数类型。（上面的表达式用了一些我们目前还没有介绍的功能，包括 for 循环、字符串和插值，但对于已有一些编程经验的用户应该是足够容易理解的。）<!-- The values returned by [`typemin`](@ref) and [`typemax`](@ref) are always of the given argument\ntype. (The above expression uses several features we have yet to introduce, including [for loops](@ref man-loops),\n[Strings](@ref man-strings), and [Interpolation](@ref), but should be easy enough to understand for users\nwith some existing programming experience.) -->"
},

{
    "location": "manual/integers-and-floating-point-numbers/#溢出-1",
    "page": "整数和浮点数",
    "title": "溢出",
    "category": "section",
    "text": "<!-- ### Overflow behavior -->Julia 中，超过了一个类型最大可表示的值时会以一个环绕行为（wraparound behavior）给出结果：<!-- In Julia, exceeding the maximum representable value of a given type results in a wraparound behavior: -->julia> x = typemax(Int64)\n9223372036854775807\n\njulia> x + 1\n-9223372036854775808\n\njulia> x + 1 == typemin(Int64)\ntrue因此，Julia 整数的算术实际上是模算数的一种形式。它可以反映出如现代计算机所实现的一样的整数算术的特点。在可能遇到溢出的应用场景中，对溢出产生的环绕行为进行显式的检查是很重要的。否则，推荐使用任意精度算术中的 BigInt 类型作为替代。<!-- Thus, arithmetic with Julia integers is actually a form of [modular arithmetic](https://en.wikipedia.org/wiki/Modular_arithmetic).\nThis reflects the characteristics of the underlying arithmetic of integers as implemented on modern\ncomputers. In applications where overflow is possible, explicit checking for wraparound produced\nby overflow is essential; otherwise, the [`BigInt`](@ref) type in [Arbitrary Precision Arithmetic](@ref)\nis recommended instead. -->"
},

{
    "location": "manual/integers-and-floating-point-numbers/#除法错误-1",
    "page": "整数和浮点数",
    "title": "除法错误",
    "category": "section",
    "text": "<!-- ### Division errors -->整数除法（div 函数）有两种异常情况：被 0 除，以及使用 -1 去除最小的负数（typemin）。这两种情况都会抛出一个 DivideError 错误。取余和取模函数（rem 和 mod）在它们第二个参数是零时抛出 DivideError 错误。<!-- Integer division (the `div` function) has two exceptional cases: dividing by zero, and dividing\nthe lowest negative number ([`typemin`](@ref)) by -1. Both of these cases throw a [`DivideError`](@ref).\nThe remainder and modulus functions (`rem` and `mod`) throw a [`DivideError`](@ref) when their\nsecond argument is zero. -->"
},

{
    "location": "manual/integers-and-floating-point-numbers/#浮点数-1",
    "page": "整数和浮点数",
    "title": "浮点数",
    "category": "section",
    "text": "<!-- ## Floating-Point Numbers -->字面的浮点数也使用标准习俗表示，必要时可使用 E-表示法：<!-- Literal floating-point numbers are represented in the standard formats, using\n[E-notation](https://en.wikipedia.org/wiki/Scientific_notation#E-notation) when necessary: -->julia> 1.0\n1.0\n\njulia> 1.\n1.0\n\njulia> 0.5\n0.5\n\njulia> .5\n0.5\n\njulia> -1.23\n-1.23\n\njulia> 1e10\n1.0e10\n\njulia> 2.5e-4\n0.00025上面的结果都是 Float64 值。使用 f 替代 e 可以写出字面的 Float32 值：<!-- The above results are all [`Float64`](@ref) values. Literal [`Float32`](@ref) values can be\nentered by writing an `f` in place of `e`: -->julia> 0.5f0\n0.5f0\n\njulia> typeof(ans)\nFloat32\n\njulia> 2.5f-4\n0.00025f0值也可以很容易地被转换成 Float32：<!-- Values can be converted to [`Float32`](@ref) easily: -->julia> Float32(-1.5)\n-1.5f0\n\njulia> typeof(ans)\nFloat32也存在十六进制的浮点数字面量，但只适用于 [Float64] 值，加上使用 p 及以 2 为底的指数来表示：<!-- Hexadecimal floating-point literals are also valid, but only as [`Float64`](@ref) values,\nwith `p` preceding the base-2 exponent: -->julia> 0x1p0\n1.0\n\njulia> 0x1.8p3\n12.0\n\njulia> 0x.4p-1\n0.125\n\njulia> typeof(ans)\nFloat64Julia 也支持半精度浮点数（Float16），但它们是由软件实现的，且使用 Float32 做计算。<!-- Half-precision floating-point numbers are also supported ([`Float16`](@ref)), but they are\nimplemented in software and use [`Float32`](@ref) for calculations. -->julia> sizeof(Float16(4.))\n2\n\njulia> 2*Float16(4.)\nFloat16(8.0)下划线 _ 可被用作数字分隔符：<!-- The underscore `_` can be used as digit separator: -->julia> 10_000, 0.000_000_005, 0xdead_beef, 0b1011_0010\n(10000, 5.0e-9, 0xdeadbeef, 0xb2)"
},

{
    "location": "manual/integers-and-floating-point-numbers/#浮点型的零-1",
    "page": "整数和浮点数",
    "title": "浮点型的零",
    "category": "section",
    "text": "<!-- ### Floating-point zero -->浮点数有两个零，正零和负零。它们相互相等但有着不同的二进制表示，可以使用 bits 函数来查看：<!-- Floating-point numbers have [two zeros](https://en.wikipedia.org/wiki/Signed_zero), positive zero\nand negative zero. They are equal to each other but have different binary representations, as\ncan be seen using the [`bitstring`](@ref) function: -->julia> 0.0 == -0.0\ntrue\n\njulia> bitstring(0.0)\n\"0000000000000000000000000000000000000000000000000000000000000000\"\n\njulia> bitstring(-0.0)\n\"1000000000000000000000000000000000000000000000000000000000000000\""
},

{
    "location": "manual/integers-and-floating-point-numbers/#特殊的浮点值-1",
    "page": "整数和浮点数",
    "title": "特殊的浮点值",
    "category": "section",
    "text": "<!-- ### Special floating-point values -->有三种特定的标准浮点值不和实数轴上任何一点对应：<!-- There are three specified standard floating-point values that do not correspond to any point on\nthe real number line: -->Float16 Float32 Float64 名称 描述\nInf16 Inf32 Inf 正无穷大 一个比所有有限浮点值都更大的值\n-Inf16 -Inf32 -Inf 负无穷大 一个比所有有限浮点值都更小的值\nNaN16 NaN32 NaN 不是数（not a number） 一个不和任何浮点值（包括自己）相等（==）的值<!--\n| `Float16` | `Float32` | `Float64` | Name              | Description                                                     |\n|:----------|:----------|:----------|:------------------|:----------------------------------------------------------------|\n| `Inf16`   | `Inf32`   | `Inf`     | positive infinity | a value greater than all finite floating-point values           |\n| `-Inf16`  | `-Inf32`  | `-Inf`    | negative infinity | a value less than all finite floating-point values              |\n| `NaN16`   | `NaN32`   | `NaN`     | not a number      | a value not `==` to any floating-point value (including itself) |\n -->对于这些非有限浮点值相互之间以及关于其它浮点值的顺序的更多讨论，请参见数值比较。根据 IEEE 754 标准，这些浮点值是某些算术运算的结果：<!-- For further discussion of how these non-finite floating-point values are ordered with respect\nto each other and other floats, see [Numeric Comparisons](@ref). By the [IEEE 754 standard](https://en.wikipedia.org/wiki/IEEE_754-2008),\nthese floating-point values are the results of certain arithmetic operations: -->julia> 1/Inf\n0.0\n\njulia> 1/0\nInf\n\njulia> -5/0\n-Inf\n\njulia> 0.000001/0\nInf\n\njulia> 0/0\nNaN\n\njulia> 500 + Inf\nInf\n\njulia> 500 - Inf\n-Inf\n\njulia> Inf + Inf\nInf\n\njulia> Inf - Inf\nNaN\n\njulia> Inf * Inf\nInf\n\njulia> Inf / Inf\nNaN\n\njulia> 0 * Inf\nNaNtypemin 和 typemax 函数同样适用于浮点类型：<!-- The [`typemin`](@ref) and [`typemax`](@ref) functions also apply to floating-point types: -->julia> (typemin(Float16),typemax(Float16))\n(-Inf16, Inf16)\n\njulia> (typemin(Float32),typemax(Float32))\n(-Inf32, Inf32)\n\njulia> (typemin(Float64),typemax(Float64))\n(-Inf, Inf)"
},

{
    "location": "manual/integers-and-floating-point-numbers/#机器零点（Machine-epsilon）-1",
    "page": "整数和浮点数",
    "title": "机器零点（Machine epsilon）",
    "category": "section",
    "text": "<!-- ### Machine epsilon -->大多数实数都无法用浮点数准确地表示，因此有必要知道两个相邻可表示的浮点数间的距离。它通常被叫做机器零点。<!-- Most real numbers cannot be represented exactly with floating-point numbers, and so for many purposes\nit is important to know the distance between two adjacent representable floating-point numbers,\nwhich is often known as [machine epsilon](https://en.wikipedia.org/wiki/Machine_epsilon). -->Julia 提供了 eps 函数，它可以给出 1.0 与下一个更大的可表示的浮点数之间的距离：<!-- Julia provides [`eps`](@ref), which gives the distance between `1.0` and the next larger representable\nfloating-point value: -->julia> eps(Float32)\n1.1920929f-7\n\njulia> eps(Float64)\n2.220446049250313e-16\n\njulia> eps() # same as eps(Float64)\n2.220446049250313e-16这些值分别是 Float32 中的 2.0^-23 和 Float64 中的 2.0^-52。eps 函数也可以接受一个浮点值作为参数，然后给出这个值与下一个可表示的值直接的绝对差。也就是说，eps(x) 产生一个和 x 类型相同的值使得 x + eps(x) 是比 x 更大的下一个可表示的浮点值：<!-- These values are `2.0^-23` and `2.0^-52` as [`Float32`](@ref) and [`Float64`](@ref) values,\nrespectively. The [`eps`](@ref) function can also take a floating-point value as an\nargument, and gives the absolute difference between that value and the next representable\nfloating point value. That is, `eps(x)` yields a value of the same type as `x` such that\n`x + eps(x)` is the next representable floating-point value larger than `x`: -->julia> eps(1.0)\n2.220446049250313e-16\n\njulia> eps(1000.)\n1.1368683772161603e-13\n\njulia> eps(1e-27)\n1.793662034335766e-43\n\njulia> eps(0.0)\n5.0e-324两个相邻可表示的浮点数之间的距离并不是常数，数值越小，间距越小，数值越大，间距越大。换句话说，可表示的浮点数在实数轴上的零点附近最稠密，并沿着远离零点的方向以指数型的速度变得越来越稀疏。根据定义，eps(1.0) 与 eps(Float64) 相等，因为 1.0 是个 64 位浮点值。<!-- The distance between two adjacent representable floating-point numbers is not constant, but is\nsmaller for smaller values and larger for larger values. In other words, the representable floating-point\nnumbers are densest in the real number line near zero, and grow sparser exponentially as one moves\nfarther away from zero. By definition, `eps(1.0)` is the same as `eps(Float64)` since `1.0` is\na 64-bit floating-point value. -->Julia 也提供了 nextfloat 和 prevfloat 两个函数分别来返回对于参数下一个更大或更小的可表示的浮点数：<!-- Julia also provides the [`nextfloat`](@ref) and [`prevfloat`](@ref) functions which return\nthe next largest or smallest representable floating-point number to the argument respectively: -->julia> x = 1.25f0\n1.25f0\n\njulia> nextfloat(x)\n1.2500001f0\n\njulia> prevfloat(x)\n1.2499999f0\n\njulia> bitstring(prevfloat(x))\n\"00111111100111111111111111111111\"\n\njulia> bitstring(x)\n\"00111111101000000000000000000000\"\n\njulia> bitstring(nextfloat(x))\n\"00111111101000000000000000000001\"这个例子体现了一般原则，即相邻可表示的浮点数也有着相邻的二进制整数表示。<!-- This example highlights the general principle that the adjacent representable floating-point numbers\nalso have adjacent binary integer representations. -->"
},

{
    "location": "manual/integers-and-floating-point-numbers/#舍入模式-1",
    "page": "整数和浮点数",
    "title": "舍入模式",
    "category": "section",
    "text": "<!-- ### Rounding modes -->一个数如果没有精确的浮点表示，就必须被舍入到一个合适的可表示的值。然而，如果想的话，可以根据舍入模式改变舍入的方式，如 IEEE 754 标准所述。<!-- If a number doesn\'t have an exact floating-point representation, it must be rounded to an\nappropriate representable value. However, the manner in which this rounding is done can be\nchanged if required according to the rounding modes presented in the [IEEE 754\nstandard](https://en.wikipedia.org/wiki/IEEE_754-2008). -->Julia 所使用的默认模式总是 RoundNearest，指的是会舍入到最接近的可表示的值，这个被舍入的值会使用尽量少的有效位数。<!-- The default mode used is always [`RoundNearest`](@ref), which rounds to the nearest representable\nvalue, with ties rounded towards the nearest value with an even least significant bit. -->"
},

{
    "location": "manual/integers-and-floating-point-numbers/#背景及参考-1",
    "page": "整数和浮点数",
    "title": "背景及参考",
    "category": "section",
    "text": "<!-- ### Background and References -->浮点算术带来了很多微妙之处，它们可能对于那些不熟悉底层实现细节的用户会是很出人意料的。然而，这些微妙之处在大部分科学计算的书籍中以及以下的参考资料中都有详细介绍:<!-- Floating-point arithmetic entails many subtleties which can be surprising to users who are unfamiliar\nwith the low-level implementation details. However, these subtleties are described in detail in\nmost books on scientific computation, and also in the following references: -->浮点算术的权威性指南是 IEEE 754-2008 Standard。然而在网上无法免费获得。\n关于浮点数是如何表示的，想要一个简单而明白的介绍的话，可以看 John D. Cook 在这个主题上的的文章，以及他关于从这种表示与实数理想的抽象化的差别中产生的一些问题的介绍。\n同样推荐 Bruce Dawson 的一系列关于浮点数的博客文章。\n想要一个对浮点数和使用浮点数计算时产生的数值精度问题的极好的、有深度的讨论，可以参见 David Goldberg 的文章 What Every Computer Scientist Should Know About Floating-Point Arithmetic。\n更多延伸文档，包括浮点数的历史、基础理论、问题以及数值计算中很多其它主题的讨论，可以参见 William Kahan 的写作集。他以“浮点数之父”闻名。特别感兴趣的话可以看 An Interview with the Old Man of Floating-Point。<!--\n  * The definitive guide to floating point arithmetic is the [IEEE 754-2008 Standard](http://standards.ieee.org/findstds/standard/754-2008.html);\n    however, it is not available for free online.\n  * For a brief but lucid presentation of how floating-point numbers are represented, see John D.\n    Cook\'s [article](https://www.johndcook.com/blog/2009/04/06/anatomy-of-a-floating-point-number/)\n    on the subject as well as his [introduction](https://www.johndcook.com/blog/2009/04/06/numbers-are-a-leaky-abstraction/)\n    to some of the issues arising from how this representation differs in behavior from the idealized\n    abstraction of real numbers.\n  * Also recommended is Bruce Dawson\'s [series of blog posts on floating-point numbers](https://randomascii.wordpress.com/2012/05/20/thats-not-normalthe-performance-of-odd-floats/).\n  * For an excellent, in-depth discussion of floating-point numbers and issues of numerical accuracy\n    encountered when computing with them, see David Goldberg\'s paper [What Every Computer Scientist Should Know About Floating-Point Arithmetic](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.22.6768&rep=rep1&type=pdf).\n  * For even more extensive documentation of the history of, rationale for, and issues with floating-point\n    numbers, as well as discussion of many other topics in numerical computing, see the [collected writings](https://people.eecs.berkeley.edu/~wkahan/)\n    of [William Kahan](https://en.wikipedia.org/wiki/William_Kahan), commonly known as the \"Father\n    of Floating-Point\". Of particular interest may be [An Interview with the Old Man of Floating-Point](https://people.eecs.berkeley.edu/~wkahan/ieee754status/754story.html).\n -->"
},

{
    "location": "manual/integers-and-floating-point-numbers/#任意精度算术-1",
    "page": "整数和浮点数",
    "title": "任意精度算术",
    "category": "section",
    "text": "<!-- ## Arbitrary Precision Arithmetic -->为了允许使用任意精度的整数与浮点数，Julia 分别包装了 GNU Multiple Precision Arithmetic Library (GMP) 以及 GNU MPFR Library。Julia 中的 BigInt 与 BigFloat 两种类型分别提供了任意精度的整数和浮点数。<!-- To allow computations with arbitrary-precision integers and floating point numbers, Julia wraps\nthe [GNU Multiple Precision Arithmetic Library (GMP)](https://gmplib.org) and the [GNU MPFR Library](http://www.mpfr.org),\nrespectively. The [`BigInt`](@ref) and [`BigFloat`](@ref) types are available in Julia for arbitrary\nprecision integer and floating point numbers respectively. -->存在从原始数字类型创建它们的构造器，也可以使用 parse 从 AbstractString 来构造它们。一旦被创建，它们就可以像所有其它数值类型一样参与算术（也是多亏了 Julia 的类型提升和转换机制）。<!-- Constructors exist to create these types from primitive numerical types, and [`parse`](@ref)\ncan be used to construct them from `AbstractString`s.  Once created, they participate in arithmetic\nwith all other numeric types thanks to Julia\'s [type promotion and conversion mechanism](@ref conversion-and-promotion): -->julia> BigInt(typemax(Int64)) + 1\n9223372036854775808\n\njulia> parse(BigInt, \"123456789012345678901234567890\") + 1\n123456789012345678901234567891\n\njulia> parse(BigFloat, \"1.23456789012345678901\")\n1.234567890123456789010000000000000000000000000000000000000000000000000000000004\n\njulia> BigFloat(2.0^66) / 3\n2.459565876494606882133333333333333333333333333333333333333333333333333333333344e+19\n\njulia> factorial(BigInt(40))\n815915283247897734345611269596115894272000000000然而，上面的原始类型与 BigInt/BigFloat 之间的类型提升并不是自动的，需要明确地指定：<!-- However, type promotion between the primitive types above and [`BigInt`](@ref)/[`BigFloat`](@ref)\nis not automatic and must be explicitly stated. -->julia> x = typemin(Int64)\n-9223372036854775808\n\njulia> x = x - 1\n9223372036854775807\n\njulia> typeof(x)\nInt64\n\njulia> y = BigInt(typemin(Int64))\n-9223372036854775808\n\njulia> y = y - 1\n-9223372036854775809\n\njulia> typeof(y)\nBigIntBigFloat 的默认精度（有效数字的位数）和舍入模式可以通过调用 setprecision 和 setrounding 来全局地改变，所有之后的计算都会根据这些改变进行。还有一种方法，可以使用同样的函数以及 do 语句块来只在运行一个特定代码块时改变精度和舍入模式：<!-- The default precision (in number of bits of the significand) and rounding mode of [`BigFloat`](@ref)\noperations can be changed globally by calling [`setprecision`](@ref) and [`setrounding`](@ref),\nand all further calculations will take these changes in account.  Alternatively, the precision\nor the rounding can be changed only within the execution of a particular block of code by using\nthe same functions with a `do` block: -->julia> setrounding(BigFloat, RoundUp) do\n           BigFloat(1) + parse(BigFloat, \"0.1\")\n       end\n1.100000000000000000000000000000000000000000000000000000000000000000000000000003\n\njulia> setrounding(BigFloat, RoundDown) do\n           BigFloat(1) + parse(BigFloat, \"0.1\")\n       end\n1.099999999999999999999999999999999999999999999999999999999999999999999999999986\n\njulia> setprecision(40) do\n           BigFloat(1) + parse(BigFloat, \"0.1\")\n       end\n1.1000000000004"
},

{
    "location": "manual/integers-and-floating-point-numbers/#man-numeric-literal-coefficients-1",
    "page": "整数和浮点数",
    "title": "数值字面量系数",
    "category": "section",
    "text": "<!-- ## [Numeric Literal Coefficients](@id man-numeric-literal-coefficients) -->为了让常见的数值公式和表达式更清楚，Julia 允许变量直接跟在一个数值字面量后，暗指乘法。这可以让写多项式变得很清楚：<!-- To make common numeric formulae and expressions clearer, Julia allows variables to be immediately\npreceded by a numeric literal, implying multiplication. This makes writing polynomial expressions\nmuch cleaner: -->julia> x = 3\n3\n\njulia> 2x^2 - 3x + 1\n10\n\njulia> 1.5x^2 - .5x + 1\n13.0也会让写指数函数更加优雅：<!-- It also makes writing exponential functions more elegant: -->julia> 2^2x\n64数值字面量系数的优先级跟一元运算符相同，比如说取相反数。所以 2^3x 会被解析成 2^(3x)，而 2x^3 会被解析成 2*(x^3)。<!-- The precedence of numeric literal coefficients is slightly lower than that of\nunary operators such as negation.\nSo `-2x` is parsed as `(-2) * x` and `√2x` is parsed as `(√2) * x`.\nHowever, numeric literal coefficients parse similarly to unary operators when\ncombined with exponentiation.\nFor example `2^3x` is parsed as `2^(3x)`, and `2x^3` is parsed as `2*(x^3)`. -->数值字面量也能作为被括号表达式的系数：<!-- Numeric literals also work as coefficients to parenthesized expressions: -->julia> 2(x-1)^2 - 3(x-1) + 1\n3!!! 注意     用于隐式乘法的数值字面量系数的优先级高于其它的二元运算符，例如乘法（*）和除法（/、\\ 以及 //）。这意味着，比如说，1 / 2im 等于 -0.5im 以及 6 // 2(2+1) 等于 1 // 1。<!--\n!!! note\n    The precedence of numeric literal coefficients used for implicit\n    multiplication is higher than other binary operators such as multiplication\n    (`*`), and division (`/`, `\\`, and `//`).  This means, for example, that\n    `1 / 2im` equals `-0.5im` and `6 // 2(2 + 1)` equals `1 // 1`.\n -->此外，括号表达式可以被用作变量的系数，暗指表达式与变量相乘：<!-- Additionally, parenthesized expressions can be used as coefficients to variables, implying multiplication\nof the expression by the variable: -->julia> (x-1)x\n6但是，无论是把两个括号表达式并列，还是把变量放在括号表达式之前，都不会被用作暗指乘法：<!-- Neither juxtaposition of two parenthesized expressions, nor placing a variable before a parenthesized\nexpression, however, can be used to imply multiplication: -->julia> (x-1)(x+1)\nERROR: MethodError: objects of type Int64 are not callable\n\njulia> x(x+1)\nERROR: MethodError: objects of type Int64 are not callable这两种表达式都会被解释成函数调用：所有不是数值字面量的表达式，后面紧跟一个括号，就会被解释成使用括号内的值来调用函数（更多关于函数的信息请参见函数）。因此，在这两种情况中，都会因为左手边的值并不是函数而产生错误<!-- Both expressions are interpreted as function application: any expression that is not a numeric\nliteral, when immediately followed by a parenthetical, is interpreted as a function applied to\nthe values in parentheses (see [Functions](@ref) for more about functions). Thus, in both of these\ncases, an error occurs since the left-hand value is not a function. -->上述的语法糖显著地降低了在写通常的数学公式时的视觉噪音。注意数值字面量系数和后面用来相乘的标识符或括号表达式之间不能有空格。<!-- The above syntactic enhancements significantly reduce the visual noise incurred when writing common\nmathematical formulae. Note that no whitespace may come between a numeric literal coefficient\nand the identifier or parenthesized expression which it multiplies. -->"
},

{
    "location": "manual/integers-and-floating-point-numbers/#语法冲突-1",
    "page": "整数和浮点数",
    "title": "语法冲突",
    "category": "section",
    "text": "<!-- ### Syntax Conflicts -->并列的字面量系数语法可能和两种数值字面量语法产生冲突：十六进制整数字面量以及浮点字面量的工程表示法。下面是几种会产生语法冲突的情况：<!-- Juxtaposed literal coefficient syntax may conflict with two numeric literal syntaxes: hexadecimal\ninteger literals and engineering notation for floating-point literals. Here are some situations\nwhere syntactic conflicts arise: -->十六进制整数字面量 0xff 可能被解释成数值字面量 0 乘以变量 xff。\n浮点字面量表达式 1e10 可以被解释成 1 乘以变量 e10，与之等价的 E 形式也存在类似的情况。\n32比特的浮点数字面量 1.5f22 被解释成数值 1.5 乘以变量 f22<!--\n  * The hexadecimal integer literal expression `0xff` could be interpreted as the numeric literal\n    `0` multiplied by the variable `xff`.\n  * The floating-point literal expression `1e10` could be interpreted as the numeric literal `1` multiplied\n    by the variable `e10`, and similarly with the equivalent `E` form.\n  * The 32-bit floating-point literal expression `1.5f22` could be interpreted as the numeric literal\n    `1.5` multiplied by the variable `f22`.\n -->在这两种情况中，都使用这样的解释方法来解决二义性：<!-- In all cases, we resolve the ambiguity in favor of interpretation as numeric literals: -->0x 开头的表达式总是十六进制字面量。\n数值开头跟着 e 和 E 的表达式总是浮点字面量。\n数值开头跟着 f 的表达式总是32比特浮点字面量。<!--\n  * Expressions starting with `0x` are always hexadecimal literals.\n  * Expressions starting with a numeric literal followed by `e` or `E` are always floating-point literals.\n  * Expressions starting with a numeric literal followed by `f` are always 32-bit floating-point literals.\n -->由于历史原因 E 和 e 在数值字面量上是等价的，与之不同的是，F 只是一个行为和 f 不同的字母。因此开头为 F 的表达式将会被 解析为一个数值字面量乘以一个变量，例如 1.5F22等价于 1.5 * F22。<!-- Unlike `E`, which is equivalent to `e` in numeric literals for historical reasons, `F` is just another\nletter and does not behave like `f` in numeric literals. Hence, expressions starting with a numeric literal\nfollowed by `F` are interpreted as the numerical literal multiplied by a variable, which means that, for\nexample, `1.5F22` is equal to `1.5 * F22`. -->"
},

{
    "location": "manual/integers-and-floating-point-numbers/#零和一的字面量-1",
    "page": "整数和浮点数",
    "title": "零和一的字面量",
    "category": "section",
    "text": "<!-- ## Literal zero and one -->Julia 提供了 0 和 1 的字面量函数，可以返回特定类型或所给变量的类型。<!-- Julia provides functions which return literal 0 and 1 corresponding to a specified type or the\ntype of a given variable. -->函数 描述\nzero(x) x 类型或变量 x 的类型的零字面量\none(x) x 类型或变量 x 的类型的一字面量<!--\n| Function          | Description                                      |\n|:------------------|:-------------------------------------------------|\n| [`zero(x)`](@ref) | Literal zero of type `x` or type of variable `x` |\n| [`one(x)`](@ref)  | Literal one of type `x` or type of variable `x`  |\n -->这些函数在数值比较中可以用来避免不必要的类型转换带来的开销。<!-- These functions are useful in [Numeric Comparisons](@ref) to avoid overhead from unnecessary\n[type conversion](@ref conversion-and-promotion). -->例如：<!-- Examples: -->julia> zero(Float32)\n0.0f0\n\njulia> zero(1.0)\n0.0\n\njulia> one(Int32)\n1\n\njulia> one(BigFloat)\n1.0"
},

{
    "location": "manual/complex-and-rational-numbers/#",
    "page": "复数与分数",
    "title": "复数与分数",
    "category": "page",
    "text": ""
},

{
    "location": "manual/complex-and-rational-numbers/#复数与分数-1",
    "page": "复数与分数",
    "title": "复数与分数",
    "category": "section",
    "text": "<!-- # Complex and Rational Numbers -->Julia 语言自带预定义的表示复数与分数的类型，并且支持它们的各种标准数学操作与基础函数。由于也定义了复数与分数的转换与提升，因此对预定义数值类型（无论是原始的还是复合的）的任意组合进行的操作都会表现得如预期的一样。<!-- Julia ships with predefined types representing both complex and rational numbers, and supports\nall standard [Mathematical Operations and Elementary Functions](@ref) on them. [Conversion and Promotion](@ref conversion-and-promotion) are defined\nso that operations on any combination of predefined numeric types, whether primitive or composite,\nbehave as expected. -->"
},

{
    "location": "manual/complex-and-rational-numbers/#复数-1",
    "page": "复数与分数",
    "title": "复数",
    "category": "section",
    "text": "<!-- ## Complex Numbers -->在Julia中,全局常量 im 被绑定到复数 i，表示 -1 的主平方根。由于 i 是一个很流行的用作索引的变量名，所以直接把它作为全局常量被认为是很危险的。由于 Julia 允许数值文本作为系数与标识符并置，这种绑定就足够为复数提供很方便的语法，类似于传统的数学记法：<!-- The global constant [`im`](@ref) is bound to the complex number *i*, representing the principal\nsquare root of -1. It was deemed harmful to co-opt the name `i` for a global constant, since it\nis such a popular index variable name. Since Julia allows numeric literals to be [juxtaposed with identifiers as coefficients](@ref man-numeric-literal-coefficients),\nthis binding suffices to provide convenient syntax for complex numbers, similar to the traditional\nmathematical notation: -->julia> 1 + 2im\n1 + 2im你可以对复数进行各种标准算术操作：<!-- You can perform all the standard arithmetic operations with complex numbers: -->julia> (1 + 2im)*(2 - 3im)\n8 + 1im\n\njulia> (1 + 2im)/(1 - 2im)\n-0.6 + 0.8im\n\njulia> (1 + 2im) + (1 - 2im)\n2 + 0im\n\njulia> (-3 + 2im) - (5 - 1im)\n-8 + 3im\n\njulia> (-1 + 2im)^2\n-3 - 4im\n\njulia> (-1 + 2im)^2.5\n2.7296244647840084 - 6.960664459571898im\n\njulia> (-1 + 2im)^(1 + 1im)\n-0.27910381075826657 + 0.08708053414102428im\n\njulia> 3(2 - 5im)\n6 - 15im\n\njulia> 3(2 - 5im)^2\n-63 - 60im\n\njulia> 3(2 - 5im)^-1.0\n0.20689655172413796 + 0.5172413793103449im类型提升机制也确保你可以使用不同类型的操作数的组合：<!-- The promotion mechanism ensures that combinations of operands of different types just work: -->julia> 2(1 - 1im)\n2 - 2im\n\njulia> (2 + 3im) - 1\n1 + 3im\n\njulia> (1 + 2im) + 0.5\n1.5 + 2.0im\n\njulia> (2 + 3im) - 0.5im\n2.0 + 2.5im\n\njulia> 0.75(1 + 2im)\n0.75 + 1.5im\n\njulia> (2 + 3im) / 2\n1.0 + 1.5im\n\njulia> (1 - 3im) / (2 + 2im)\n-0.5 - 1.0im\n\njulia> 2im^2\n-2 + 0im\n\njulia> 1 + 3/4im\n1.0 - 0.75im注意 3/4im == 3/(4*im) == -(3/4*im)，因为文本系数比除法的优先级更高。<!-- Note that `3/4im == 3/(4*im) == -(3/4*im)`, since a literal coefficient binds more tightly than\ndivision. -->Julia 提供了一些用来操作复数值的标准函数：<!-- Standard functions to manipulate complex values are provided: -->julia> z = 1 + 2im\n1 + 2im\n\njulia> real(1 + 2im) # real part of z\n1\n\njulia> imag(1 + 2im) # imaginary part of z\n2\n\njulia> conj(1 + 2im) # complex conjugate of z\n1 - 2im\n\njulia> abs(1 + 2im) # absolute value of z\n2.23606797749979\n\njulia> abs2(1 + 2im) # squared absolute value\n5\n\njulia> angle(1 + 2im) # phase angle in radians\n1.1071487177940904按照惯例，复数的绝对值（abs）是从零点到它的距离。abs2 给出绝对值的平方，作用于复数上时非常有用,可以避免做平方根的操作。[angle] 返回以弧度为单位的相位角（这也被称为辐角函数）。所有其它的基础函数在复数上也都有完整的定义：<!-- As usual, the absolute value ([`abs`](@ref)) of a complex number is its distance from zero.\n[`abs2`](@ref) gives the square of the absolute value, and is of particular use for complex\nnumbers where it avoids taking a square root. [`angle`](@ref) returns the phase angle in radians\n(also known as the *argument* or *arg* function). The full gamut of other [Elementary Functions](@ref)\nis also defined for complex numbers: -->julia> sqrt(1im)\n0.7071067811865476 + 0.7071067811865475im\n\njulia> sqrt(1 + 2im)\n1.272019649514069 + 0.7861513777574233im\n\njulia> cos(1 + 2im)\n2.0327230070196656 - 3.0518977991518im\n\njulia> exp(1 + 2im)\n-1.1312043837568135 + 2.4717266720048188im\n\njulia> sinh(1 + 2im)\n-0.4890562590412937 + 1.4031192506220405im注意数学函数通常应用于实数就返回实数值，应用于复数就返回复数值。例如，当 sqrt 应用于 -1 与 -1 + 0im 会有不同的表现，虽然 -1 == -1 + 0im：<!-- Note that mathematical functions typically return real values when applied to real numbers and\ncomplex values when applied to complex numbers. For example, [`sqrt`](@ref) behaves differently\nwhen applied to `-1` versus `-1 + 0im` even though `-1 == -1 + 0im`: -->julia> sqrt(-1)\nERROR: DomainError with -1.0:\nsqrt will only return a complex result if called with a complex argument. Try sqrt(Complex(x)).\nStacktrace:\n[...]\n\njulia> sqrt(-1 + 0im)\n0.0 + 1.0im从变量构建复数时，文本型数值系数记法不再适用。相反地，乘法必须显式地写出：<!-- The [literal numeric coefficient notation](@ref man-numeric-literal-coefficients) does not work when constructing a complex number\nfrom variables. Instead, the multiplication must be explicitly written out: -->julia> a = 1; b = 2; a + b*im\n1 + 2im然而，我们并不推荐这样，而应改为使用 complex 函数直接通过实部与虚部构建一个复数值：<!-- However, this is *not* recommended; Use the [`complex`](@ref) function instead to construct\na complex value directly from its real and imaginary parts: -->julia> a = 1; b = 2; complex(a, b)\n1 + 2im这种构建避免了乘法和加法操作。<!-- This construction avoids the multiplication and addition operations. -->Inf 和 NaN 可能出现在复数的实部和虚部，正如特殊的浮点值章节所描述的：<!-- [`Inf`](@ref) and [`NaN`](@ref) propagate through complex numbers in the real and imaginary parts\nof a complex number as described in the [Special floating-point values](@ref) section: -->julia> 1 + Inf*im\n1.0 + Inf*im\n\njulia> 1 + NaN*im\n1.0 + NaN*im"
},

{
    "location": "manual/complex-and-rational-numbers/#分数-1",
    "page": "复数与分数",
    "title": "分数",
    "category": "section",
    "text": "<!-- ## Rational Numbers -->Julia 有一个用于表示整数精确比值的分数类型。分数通过 // 运算符构建：<!-- Julia has a rational number type to represent exact ratios of integers. Rationals are constructed\nusing the [`//`](@ref) operator: -->julia> 2//3\n2//3如果一个分数的分子和分母含有公因子，它们会被约分到最简形式且分母非负：<!-- If the numerator and denominator of a rational have common factors, they are reduced to lowest\nterms such that the denominator is non-negative: -->julia> 6//9\n2//3\n\njulia> -4//8\n-1//2\n\njulia> 5//-15\n-1//3\n\njulia> -4//-12\n1//3整数比值的这种标准化形式是唯一的，所以分数值的相等性可由校验分子与分母都相等来测试。分数值的标准化分子和分母可以使用 numerator 和 denominator 函数得到：<!-- This normalized form for a ratio of integers is unique, so equality of rational values can be\ntested by checking for equality of the numerator and denominator. The standardized numerator and\ndenominator of a rational value can be extracted using the [`numerator`](@ref) and [`denominator`](@ref)\nfunctions: -->julia> numerator(2//3)\n2\n\njulia> denominator(2//3)\n3分子和分母的直接比较通常是不必要的，因为标准算术和比较操作对分数值也有定义：<!-- Direct comparison of the numerator and denominator is generally not necessary, since the standard\narithmetic and comparison operations are defined for rational values: -->julia> 2//3 == 6//9\ntrue\n\njulia> 2//3 == 9//27\nfalse\n\njulia> 3//7 < 1//2\ntrue\n\njulia> 3//4 > 2//3\ntrue\n\njulia> 2//4 + 1//6\n2//3\n\njulia> 5//12 - 1//4\n1//6\n\njulia> 5//8 * 3//12\n5//32\n\njulia> 6//5 / 10//7\n21//25分数可以很容易地被转换成浮点数：<!-- Rationals can be easily converted to floating-point numbers: -->julia> float(3//4)\n0.75对任意整数值 a 和 b（除了 a == 0 且 b == 0 时），从分数到浮点数的转换遵从以下的一致性：<!-- Conversion from rational to floating-point respects the following identity for any integral values\nof `a` and `b`, with the exception of the case `a == 0` and `b == 0`: -->julia> a = 1; b = 2;\n\njulia> isequal(float(a//b), a/b)\ntrueJulia接受构建无穷分数值：<!-- Constructing infinite rational values is acceptable: -->julia> 5//0\n1//0\n\njulia> -3//0\n-1//0\n\njulia> typeof(ans)\nRational{Int64}但不接受试图构建一个 NaN 分数值：<!-- Trying to construct a [`NaN`](@ref) rational value, however, is not: -->julia> 0//0\nERROR: ArgumentError: invalid rational: zero(Int64)//zero(Int64)\nStacktrace:\n[...]像往常一样，类型提升系统使得分数可以轻松地同其它数值类型进行交互：<!-- As usual, the promotion system makes interactions with other numeric types effortless: -->julia> 3//5 + 1\n8//5\n\njulia> 3//5 - 0.5\n0.09999999999999998\n\njulia> 2//7 * (1 + 2im)\n2//7 + 4//7*im\n\njulia> 2//7 * (1.5 + 2im)\n0.42857142857142855 + 0.5714285714285714im\n\njulia> 3//2 / (1 + 2im)\n3//10 - 3//5*im\n\njulia> 1//2 + 2im\n1//2 + 2//1*im\n\njulia> 1 + 2//3im\n1//1 - 2//3*im\n\njulia> 0.5 == 1//2\ntrue\n\njulia> 0.33 == 1//3\nfalse\n\njulia> 0.33 < 1//3\ntrue\n\njulia> 1//3 - 0.33\n0.0033333333333332993"
},

{
    "location": "manual/strings/#",
    "page": "字符串",
    "title": "字符串",
    "category": "page",
    "text": ""
},

{
    "location": "manual/strings/#字符串-1",
    "page": "字符串",
    "title": "字符串",
    "category": "section",
    "text": "<!-- # Strings -->字符串是字符的有限序列。当然，真正麻烦的问题是，字符到底是什么。英文使用者所熟悉的字符是 A，B，C 等等字母，数字以及常见标点符号。这些字符和它们到 0 到 127 之间的整数值的映射一起通过 ASCII 标准被标准化。当然，在非英语语言中有大量其它字符，这其中包括加上重音等修改的 ASCII 字符的变体——相关的文字有例如斯拉夫字母和希腊字母；以及和 ASCII、英语完全不相关的文字，包括阿拉伯文、中文、希伯来文、印地文、日文和韩文。Unicode 标准则解决了字符定义问题的复杂性，从而被广泛的认为是解决这个问题的权威标准。根据需要，你可以完全忽略这些复杂性，装作只存在ASCII字符；你也可以去写这样的代码，它们能处理当操作非 ASCII 文本时可能遇到的任何字符或编码。Julia 使纯 ASCII 文本的处理简单而高效，同时又使得 Unicode 文本的处理尽可能的简单和高效。特别是，你可以写出 C 风格字符串的代码来处理ASCII字符串，它们在性能和语义方面都将将按预期工作。若这种代码遇到了非 ASCII 文本，它会优雅地失败，同时给出清晰的错误信息，而不是悄悄地导致错误的结果。当这种失败发生时，修改代码以兼容非 ASCII 数据就很简单了。<!-- Strings are finite sequences of characters. Of course, the real trouble comes when one asks what a character is. The characters that English speakers are familiar with are the letters `A`, `B`,`C`, etc., together with numerals and common punctuation symbols. These characters are standardized together with a mapping to integer values between 0 and 127 by the [ASCII](https://en.wikipedia.org/wiki/ASCII) standard. There are, of course, many other characters used in non-English languages, including variants of the ASCII characters with accents and other modifications, related scripts such as Cyrillic and Greek, and scripts completely unrelated to ASCII and English, including Arabic, Chinese, Hebrew, Hindi, Japanese, and Korean. The [Unicode](https://en.wikipedia.org/wiki/Unicode) standard tackles the complexities of what exactly a character is, and is generally accepted as the definitive standard addressing this problem. Depending on your needs, you can either ignore these complexities entirely and just pretend that only ASCII characters exist, or you can write code that can handle any of the characters or encodings that one may encounter when handling non-ASCII text. Julia makes dealing with plain ASCII text simple and efficient, and handling Unicode is as simple and\nefficient as possible. In particular, you can write C-style string code to process ASCII strings, and they will work as expected, both in terms of performance and semantics. If such code encounters non-ASCII text, it will gracefully fail with a clear error message, rather than silently introducing corrupt results. When this happens, modifying the code to handle non-ASCII data is straightforward. -->Julia 的字符串有一些重要的特性：<!-- There are a few noteworthy high-level features about Julia\'s strings: -->内置的用于字符串（和字符串字面量）的具体类型是 String。它通过 UTF-8 编码全面地支持 Unicode 字符。(有一个 transcode 函数用来和 Unicode 编码互转)\n所有的字符串类型都是抽象类型 AbstractString 的子类型，而一些外部包定义了别的 AbstractString 子类型（例如别的编码）。若要定义需要字符串参数的函数，你应当声明此类型为 AbstractString 来让这函数接受任何字符串类型。\n类似 C 和 Java，但是和大多数动态语言不同的是，Julia 有优秀的表示单字符的类型，即 AbstractChar。Char 是 AbstractChar 的内置子类型，它能表示任何 Unicode 字符的 32 位原始类型（基于 UTF-8 编码）。\n如 Java 中那样，字符串不可改——任何 AbstractString 对象的值不可改变。若要构造不同的字符串值，应当从其它字符串的部分构造一个新的字符串。\n从概念上讲，字符串是从索引到字符的部分函数：对于某些索引值，它不返回字符值，而是引发异常。这允许通过编码表示形式的字节索引来实现高效的字符串索引，而不是通过字符索引——它不能简单高效地实现可变宽度的 Unicode 字符串编码。<!--\n  * The built-in concrete type used for strings (and string literals) in Julia is [`String`](@ref).\n    This supports the full range of [Unicode](https://en.wikipedia.org/wiki/Unicode) characters via\n    the [UTF-8](https://en.wikipedia.org/wiki/UTF-8) encoding. (A [`transcode`](@ref) function is\n    provided to convert to/from other Unicode encodings.)\n  * All string types are subtypes of the abstract type `AbstractString`, and external packages define\n    additional `AbstractString` subtypes (e.g. for other encodings).  If you define a function expecting\n    a string argument, you should declare the type as `AbstractString` in order to accept any string\n    type.\n  * Like C and Java, but unlike most dynamic languages, Julia has a first-class type for representing\n    a single character, called [`AbstractChar`](@ref). The built-in [`Char`](@ref) subtype of `AbstractChar`\n    is a 32-bit primitive type that can represent any Unicode character (and which is based\n    on the UTF-8 encoding).\n  * As in Java, strings are immutable: the value of an `AbstractString` object cannot be changed.\n    To construct a different string value, you construct a new string from parts of other strings.\n  * Conceptually, a string is a *partial function* from indices to characters: for some index values,\n    no character value is returned, and instead an exception is thrown. This allows for efficient\n    indexing into strings by the byte index of an encoded representation rather than by a character\n    index, which cannot be implemented both efficiently and simply for variable-width encodings of\n    Unicode strings.\n-->"
},

{
    "location": "manual/strings/#字符-1",
    "page": "字符串",
    "title": "字符",
    "category": "section",
    "text": "<!-- ## Characters -->Char 类型的值代表单个字符：它只是带有特殊文本表示法和适当算术行为的 32 位原始类型，不能转化为代表 Unicode 代码点 的数值。（Julia　的包可能会定义别的 AbstractChar 子类型，比如当为了优化对其它 字符编码 的操作时）Char类型的值以这样的方式输入和显示：<!--\nA `Char` value represents a single character: it is just a 32-bit primitive type with a special literal\nrepresentation and appropriate arithmetic behaviors, and which can be converted\nto a numeric value representing a\n[Unicode code point](https://en.wikipedia.org/wiki/Code_point).  (Julia packages may define\nother subtypes of `AbstractChar`, e.g. to optimize operations for other\n[text encodings](https://en.wikipedia.org/wiki/Character_encoding).) Here is how `Char` values are\ninput and shown:\n-->julia> \'x\'\n\'x\': ASCII/Unicode U+0078 (category Ll: Letter, lowercase)\n\njulia> typeof(ans)\nChar你可以轻松地把 Char 转换为它的整数值，即代码点：<!--  You can easily convert a `Char` to its integer value, i.e. code point:  -->julia> Int(\'x\')\n120\n\njulia> typeof(ans)\nInt64在 32 位架构中，typeof(ans) 将得到 Int32。你同样可以轻松地把整数值转回 Char。<!--  On 32-bit architectures, [`typeof(ans)`](@ref) will be [`Int32`](@ref). You can convert an\ninteger value back to a `Char` just as easily:  -->julia> Char(120)\n\'x\': ASCII/Unicode U+0078 (category Ll: Letter, lowercase)并非所有的整数值在 Unicode 代码点中都是有效的，但为了性能，Char 的转化并不检查每个字符值的有效性。若想检查每个转换值的有效性，就用 isvalid 函数：<!--  Not all integer values are valid Unicode code points, but for performance, the `Char` conversion\ndoes not check that every character value is valid. If you want to check that each converted value\nis a valid code point, use the [`isvalid`](@ref) function:  -->julia> Char(0x110000)\n\'\\U110000\': Unicode U+110000 (category In: Invalid, too high)\n\njulia> isvalid(Char, 0x110000)\nfalse在此文档中，有效的 Unicode 代码点是从 U+00 到 U+d7ff 以及 U+e000 到 U+10ffff。它们还未全部被赋予明确的含义，也还没必要被应用解释；然而，所有的这些值都被认为是有效的 Unicode 字符。<!--  As of this writing, the valid Unicode code points are `U+00` through `U+d7ff` and `U+e000` through\n`U+10ffff`. These have not all been assigned intelligible meanings yet, nor are they necessarily\ninterpretable by applications, but all of these values are considered to be valid Unicode characters.   -->你可以在单引号中输入任何 Unicode 字符，通过使用 \\u 加上至多４个十六进制数字或者 \\U 加上至多８个十六进制数（最长的有效值也只需要６个）：<!--  You can input any Unicode character in single quotes using `\\u` followed by up to four hexadecimal\ndigits or `\\U` followed by up to eight hexadecimal digits (the longest valid value only requires\nsix):  -->julia> \'\\u0\'\n\'\\0\': ASCII/Unicode U+0000 (category Cc: Other, control)\n\njulia> \'\\u78\'\n\'x\': ASCII/Unicode U+0078 (category Ll: Letter, lowercase)\n\njulia> \'\\u2200\'\n\'∀\': Unicode U+2200 (category Sm: Symbol, math)\n\njulia> \'\\U10ffff\'\n\'\\U10ffff\': Unicode U+10ffff (category Cn: Other, not assigned)Julia 使用系统的地区和语言设置来确定哪些字符可以原样打印，以及当使用一般的 \\u或 \\U 转义输入形式时应当输出什么。除了这些 Unicode 转义形式以外，也可以使用所有的 传统 C 语言转义输入形式。<!--  Julia uses your system\'s locale and language settings to determine which characters can be printed\nas-is and which must be output using the generic, escaped `\\u` or `\\U` input forms. In addition\nto these Unicode escape forms, all of [C\'s traditional escaped input forms](https://en.wikipedia.org/wiki/C_syntax#Backslash_escapes)\ncan also be used: -->julia> Int(\'\\0\')\n0\n\njulia> Int(\'\\t\')\n9\n\njulia> Int(\'\\n\')\n10\n\njulia> Int(\'\\e\')\n27\n\njulia> Int(\'\\x7f\')\n127\n\njulia> Int(\'\\177\')\n127你可以对 Char 的值进行比较和有限的算术运算<!-- You can do comparisons and a limited amount of arithmetic with `Char` values: -->julia> \'A\' < \'a\'\ntrue\n\njulia> \'A\' <= \'a\' <= \'Z\'\nfalse\n\njulia> \'A\' <= \'X\' <= \'Z\'\ntrue\n\njulia> \'x\' - \'a\'\n23\n\njulia> \'A\' + 1\n\'B\': ASCII/Unicode U+0042 (category Lu: Letter, uppercase)"
},

{
    "location": "manual/strings/#字符串基础-1",
    "page": "字符串",
    "title": "字符串基础",
    "category": "section",
    "text": "<!--  ## String Basics -->字符串字面量由双引号或三重双引号分隔：<!--  String literals are delimited by double quotes or triple double quotes: -->julia> str = \"Hello, world.\\n\"\n\"Hello, world.\\n\"\n\njulia> \"\"\"Contains \"quote\" characters\"\"\"\n\"Contains \\\"quote\\\" characters\"若要从字符串中提取字符，就进行索引：<!--  If you want to extract a character from a string, you index into it: -->julia> str[1]\n\'H\': ASCII/Unicode U+0048 (category Lu: Letter, uppercase)\n\njulia> str[6]\n\',\': ASCII/Unicode U+002c (category Po: Punctuation, other)\n\njulia> str[end]\n\'\\n\': ASCII/Unicode U+000a (category Cc: Other, control)包括字符串，许多的 Julia 对象都可以用整数进行索引。第一个元素的索引由 firstindex(str) 返回，最后一个由 lastindex(str) 返回。关键字 end 可以在索引操作中用作给定维度的最后一个索引。在 Julia 中，大多数索引都是从 1 开始的：许多整数索引的对象的第一个元素都在索引为 1 处。（下面我们将会看到，这并不一定意味着最后一个元素位于索引为 n 处——n 为此字符串的长度。）<!--  \nMany Julia objects, including strings, can be indexed with integers. The index of the first\nelement is returned by [`firstindex(str)`](@ref), and the index of the last element\nwith [`lastindex(str)`](@ref). The keyword `end` can be used inside an indexing\noperation as shorthand for the last index along the given dimension.\nMost indexing in Julia is 1-based: the first element of many integer-indexed objects is found at\nindex 1. (As we will see below, this does not necessarily mean that the last element is found\nat index `n`, where `n` is the length of the string.) -->你可以用 end 进行算术以及其它操作，就像普通值一样：<!-- You can perform arithmetic and other operations with [`end`](@ref), just like\na normal value: -->julia> str[end-1]\n\'.\': ASCII/Unicode U+002e (category Po: Punctuation, other)\n\njulia> str[end÷2]\n\' \': ASCII/Unicode U+0020 (category Zs: Separator, space)使用小于 1 或者大于 end 的索引将引发错误：<!-- Using an index less than 1 or greater than `end` raises an error: -->julia> str[0]\nERROR: BoundsError: attempt to access \"Hello, world.\\n\"\n  at index [0]\n[...]\n\njulia> str[end+1]\nERROR: BoundsError: attempt to access \"Hello, world.\\n\"\n  at index [15]\nStacktrace:\n[...]你也可以用范围索引来提取子字符串<!-- You can also extract a substring using range indexing: -->julia> str[4:9]\n\"lo, wo\"注意，表达式 str[k] and str[k:k] 给出不同的结果：<!-- Notice that the expressions `str[k]` and `str[k:k]` do not give the same result: -->julia> str[6]\n\',\': ASCII/Unicode U+002c (category Po: Punctuation, other)\n\njulia> str[6:6]\n\",\"前者是 Char 类型的单个字符值，后者是碰巧只有单个字符的字符串值。在 Julia 里面两者大不相同。<!-- The former is a single character value of type `Char`, while the latter is a string value that\nhappens to contain only a single character. In Julia these are very different things. -->范围索引复制了原字符串的选定部分。此外，也可以用 SubString 类型创建字符串的视图，例如：<!-- Range indexing makes a copy of the selected part of the original string.\nAlternatively, it is possible to create a view into a string using the type [`SubString`](@ref),\nfor example: -->julia> str = \"long string\"\n\"long string\"\n\njulia> substr = SubString(str, 1, 4)\n\"long\"\n\njulia> typeof(substr)\nSubString{String}像 chop，chomp 和 strip 一样的几个标准函数都返回 SubString。<!-- Several standard functions like [`chop`](@ref), [`chomp`](@ref) or [`strip`](@ref) return a [`SubString`](@ref). -->"
},

{
    "location": "manual/strings/#Unicode-和-UTF-8-1",
    "page": "字符串",
    "title": "Unicode 和 UTF-8",
    "category": "section",
    "text": "<!-- ## Unicode and UTF-8 -->Julia 完全支持 Unicode 字符和字符串。如上所述，在字符字面量中，Unicode 代码点可以用 Unicode \\u and \\U 转义序列表示，也可以用所有标准 C 转义序列表示。这些同样可以用来写字符串字面量：<!-- Julia fully supports Unicode characters and strings. As [discussed above](@ref man-characters), in character\nliterals, Unicode code points can be represented using Unicode `\\u` and `\\U` escape sequences,\nas well as all the standard C escape sequences. These can likewise be used to write string literals: -->julia> s = \"\\u2200 x \\u2203 y\"\n\"∀ x ∃ y\"这些 Unicode 字符是作为转义还是特殊字符显示取决于你终端的地区设置以及它对 Unicode 的支持。字符串字面量用 UTF-8 编码实现编码。UTF-8 是一种可变宽度的编码，也就是说并非所有字符都以相同的字节数被编码。在 UTF-8 中，ASCII 字符——代码点小于 0x80(128) 的那些——如它们在 ASCII 中一样使用单字节编码；而代码点 0x80 及以上的字符使用最多 4 个字节编码。这意味着并非每个索引到 UTF-8 字符串的字节都必须是一个字符的有效索引。如果在这种无效字节索引处索引字符串，将会报错：<!-- Whether these Unicode characters are displayed as escapes or shown as special characters depends\non your terminal\'s locale settings and its support for Unicode. String literals are encoded using\nthe UTF-8 encoding. UTF-8 is a variable-width encoding, meaning that not all characters are encoded\nin the same number of bytes. In UTF-8, ASCII characters -- i.e. those with code points less than\n0x80 (128) -- are encoded as they are in ASCII, using a single byte, while code points 0x80 and\nabove are encoded using multiple bytes -- up to four per character. This means that not every\nbyte index into a UTF-8 string is necessarily a valid index for a character. If you index into\na string at such an invalid byte index, an error is thrown: -->julia> s[1]\n\'∀\': Unicode U+2200 (category Sm: Symbol, math)\n\njulia> s[2]\nERROR: StringIndexError(\"∀ x ∃ y\", 2)\n[...]\n\njulia> s[3]\nERROR: StringIndexError(\"∀ x ∃ y\", 3)\nStacktrace:\n[...]\n\njulia> s[4]\n\' \': ASCII/Unicode U+0020 (category Zs: Separator, space)在这种情况下，字符 ∀ 是一个三字节字符，因此索引 2 和 3 都是无效的，而下一个字符的索引是 4；这个接下来的有效索引可以用 nextind(s,1) 来计算，再接下来的用 nextind(s,4)，依此类推。<!-- In this case, the character `∀` is a three-byte character, so the indices 2 and 3 are invalid\nand the next character\'s index is 4; this next valid index can be computed by [`nextind(s,1)`](@ref),\nand the next index after that by `nextind(s,4)` and so on. -->使用范围索引提取字字符串也需要有效的字节索引，否则将报错：<!-- Extraction of a substring using range indexing also expects valid byte indices or an error is thrown: -->julia> s[1:1]\n\"∀\"\n\njulia> s[1:2]\nERROR: StringIndexError(\"∀ x ∃ y\", 2)\nStacktrace:\n[...]\n\njulia> s[1:4]\n\"∀ \"由于可变长度的编码，字符串中的字符数（由 length(s) 给出）并不问题等于最后一个索引的数字。如果你从 1 到 lastindex(s) 迭代并索引到 s，未报错时返回的字符序列是包含字符串 s 的字符序列。因此总有 length(s) <= lastindex(s)，这是因为字符串中的每个字符必须有它自己的索引。下面是对 s 的字符进行迭代的一个啰嗦而低效的方式：<!-- Because of variable-length encodings, the number of characters in a string (given by [`length(s)`](@ref))\nis not always the same as the last index. If you iterate through the indices 1 through [`lastindex(s)`](@ref)\nand index into `s`, the sequence of characters returned when errors aren\'t thrown is the sequence\nof characters comprising the string `s`. Thus we have the identity that `length(s) <= lastindex(s)`,\nsince each character in a string must have its own index. The following is an inefficient and\nverbose way to iterate through the characters of `s`: -->julia> for i = firstindex(s):lastindex(s)\n           try\n               println(s[i])\n           catch\n               # ignore the index error\n           end\n       end\n∀\n\nx\n\n∃\n\ny空行上面其实是有空格的。幸运的是，上面的拙劣写法不是对字符串中字符进行迭代所必须的——因为你只需把字符串本身用作迭代对象，而不需要额外处理：<!-- The blank lines actually have spaces on them. Fortunately, the above awkward idiom is unnecessary\nfor iterating through the characters in a string, since you can just use the string as an iterable\nobject, no exception handling required: -->julia> for c in s\n           println(c)\n       end\n∀\n\nx\n\n∃\n\nyJulia 中的字符串可以包含无效的 UTF-8 代码单元序列。这个惯例允许把任何字序列当作 String。在这种情形下的一个规则是，当从左到右解析代码单元序列时，字符由匹配下面开头位模式之一的最长的 8 位代码单元序列组成（每个 x 可以是 0 或者 1）：<!-- Strings in Julia can contain invalid UTF-8 code unit sequences. This convention allows to\ntreat any byte sequence as a `String`. In such situations a rule is that when parsing\na sequence of code units from left to right characters are formed by the longest sequence of\n8-bit code units that matches the start of one of the following bit patterns\n(each `x` can be `0` or `1`): -->0xxxxxxx;\n110xxxxx 10xxxxxx;\n1110xxxx 10xxxxxx 10xxxxxx;\n11110xxx 10xxxxxx 10xxxxxx 10xxxxxx;\n10xxxxxx;\n11111xxx.特别地，这意味着过长和太高的代码单元序列也可接受。这个规则最好用一个例子来解释：<!-- In particular this implies that overlong and too high code unit sequences are accepted.\nThis rule is best explained by an example: -->julia> s = \"\\xc0\\xa0\\xe2\\x88\\xe2|\"\n\"\\xc0\\xa0\\xe2\\x88\\xe2|\"\n\njulia> foreach(display, s)\n\'\\xc0\\xa0\': [overlong] ASCII/Unicode U+0020 (category Zs: Separator, space)\n\'\\xe2\\x88\': Malformed UTF-8 (category Ma: Malformed, bad data)\n\'\\xe2\': Malformed UTF-8 (category Ma: Malformed, bad data)\n\'|\': ASCII/Unicode U+007c (category Sm: Symbol, math)\n\njulia> isvalid.(collect(s))\n4-element BitArray{1}:\n false\n false\n false\n  true\n\njulia> s2 = \"\\xf7\\xbf\\xbf\\xbf\"\n\"\\U1fffff\"\n\njulia> foreach(display, s2)\n\'\\U1fffff\': Unicode U+1fffff (category In: Invalid, too high)我们可以看到字符串 s 中的前两个代码单元形成了一个过长的空格字符编码。这是无效的，但是在字符串中作为单个字符是可以接受的。接下来的两个代码单元形成了一个有效的 3 位 UTF-8 序列开头。然而，第五个代码单元 \\xe2 不是它的有效延续，所以代码单元 3 和 4 在这个字符串中也被解释为格式错误的字符。同理，由于 | 不是它的有效延续，代码单元 5 形成了一个格式错误的字符。最后字符串 s2 包含了一个太高的代码点。<!-- We can see that the first two code units in the string `s` form an overlong encoding of\nspace character. It is invalid, but is accepted in a string as a single character.\nThe next two code units form a valid start of a three-byte UTF-8 sequence. However, the fifth\ncode unit `\\xe2` is not its valid continuation. Therefore code units 3 and 4 are also\ninterpreted as malformed characters in this string. Similarly code unit 5 forms a malformed\ncharacter because `|` is not a valid continuation to it. Finally the string `s2` contains\none too high code point. -->Julia 默认使用 UTF-8 编码，对于新编码的支持可以通过包加上。例如，LegacyStrings.jl 包实现了 UTF16String 和 UTF32String 类型。关于其它编码的额外讨论以及如何实现对它们的支持暂时超过了这篇文档的讨论范围。UTF-8 编码相关问题的进一步讨论参见下面的 字节数组字面量 章节。transcode 函数可在各种 UTF-xx 编码之间转换，主要用于外部数据和包。<!-- Julia uses the UTF-8 encoding by default, and support for new encodings can be added by packages.\nFor example, the [LegacyStrings.jl](https://github.com/JuliaArchive/LegacyStrings.jl) package\nimplements `UTF16String` and `UTF32String` types. Additional discussion of other encodings and\nhow to implement support for them is beyond the scope of this document for the time being. For\nfurther discussion of UTF-8 encoding issues, see the section below on [byte array literals](@ref man-byte-array-literals).\nThe [`transcode`](@ref) function is provided to convert data between the various UTF-xx encodings,\nprimarily for working with external data and libraries. -->"
},

{
    "location": "manual/strings/#串联-1",
    "page": "字符串",
    "title": "串联",
    "category": "section",
    "text": "<-- ## Concatenation -->一个最常见而有用的字符串操作是串联：<-- One of the most common and useful string operations is concatenation: -->julia> greet = \"Hello\"\n\"Hello\"\n\njulia> whom = \"world\"\n\"world\"\n\njulia> string(greet, \", \", whom, \".\\n\")\n\"Hello, world.\\n\"意识到像对无效 UTF-8 字符进行串联这样的潜在危险情形是非常重要的。生成的字符串可能会包含和输入字符串不同的字符，并且其中字符的数目也可能少于被串联字符串中字符数目之和，例如：<-- It\'s important to be aware of potentially dangerous situations such as concatenation of invalid UTF-8 strings.\nThe resulting string may contain different characters than the input strings,\nand its number of characters may be lower than sum of numbers of characters\nof the concatenated strings, e.g.: -->julia> a, b = \"\\xe2\\x88\", \"\\x80\"\n(\"\\xe2\\x88\", \"\\x80\")\n\njulia> c = a*b\n\"∀\"\n\njulia> collect.([a, b, c])\n3-element Array{Array{Char,1},1}:\n [\'\\xe2\\x88\']\n [\'\\x80\']\n [\'∀\']\n\njulia> length.([a, b, c])\n3-element Array{Int64,1}:\n 1\n 1\n 1这种情形只可能发生于无效 UTF-8 字符串上。对于有效 UTF-8 字符串，串联保留字符串中的所有字符和字符串的总长度。<!-- This situation can happen only for invalid UTF-8 strings. For valid UTF-8 strings\nconcatenation preserves all characters in strings and additivity of string lengths. -->Julia 也提供 * 用于字符串串联：<!---Julia also provides [`*`](@ref) for string concatenation:-->julia> greet * \", \" * whom * \".\\n\"\n\"Hello, world.\\n\"尽管对于提供 + 函数用于字符串串联的语言使用者而言，* 似乎是一个令人惊讶的选择，但 * 的这种用法在数学中早有先例，尤其是在抽象代数中。<!-- While `*` may seem like a surprising choice to users of languages that provide `+` for string\nconcatenation, this use of `*` has precedent in mathematics, particularly in abstract algebra. -->在数学上，+ 通常表示对易算符——运算对象的顺序不重要。一个例子是矩阵加法：对于任何形状相同的矩阵 A 和 B，都有 A + B == B + A。与之相反，＊ 通常表示不对易算符——运算对象的顺序很重要。例如，对于矩阵乘法，一般 A * B != B * A。同矩阵乘法类似，字符串串联是不对易的：greet * whom != whom * greet。在这一点上，对于插入字符串的串联操作，* 是一个自然而然的选择，与它在数学中的用法一致。<!-- In mathematics, `+` usually denotes a *commutative* operation, where the order of the operands does\nnot matter. An example of this is matrix addition, where `A + B == B + A` for any matrices `A` and `B`\nthat have the same shape. In contrast, `*` typically denotes a *noncommutative* operation, where the\norder of the operands *does* matter. An example of this is matrix multiplication, where in general\n`A * B != B * A`. As with matrix multiplication, string concatenation is noncommutative:\n`greet * whom != whom * greet`. As such, `*` is a more natural choice for an infix string concatenation\noperator, consistent with common mathematical use. -->更确切地说，有限长度字符串集合 S 和字符串串联操作 * 构成了一个自由群 (S, *)。该集合的单位元是空字符串，\"\"。当一个自由群不对易时，它的运算通常表示为 \\cdot，*，或者类似的符号，而非暗示对易性的 +。<!-- More precisely, the set of all finite-length strings *S* together with the string concatenation operator\n`*` forms a [free monoid](https://en.wikipedia.org/wiki/Free_monoid) (*S*, `*`). The identity element\nof this set is the empty string, `\"\"`. Whenever a free monoid is not commutative, the operation is\ntypically represented as `\\cdot`, `*`, or a similar symbol, rather than `+`, which as stated usually\nimplies commutativity. -->"
},

{
    "location": "manual/strings/#插值-1",
    "page": "字符串",
    "title": "插值",
    "category": "section",
    "text": "<!-- ## Interpolation -->但是，用串联构造字符串有时有些麻烦。为了减少对于 string 的冗余调用或者重复乘法，Julia 允许像 Perl 中一样使用 $ 对字符串字面量进行插值：Constructing strings using concatenation can become a bit cumbersome, however. To reduce the need for these\nverbose calls to [`string`](@ref) or repeated multiplications, Julia allows interpolation into string literals\nusing `$`, as in Perl:julia> \"$greet, $whom.\\n\"\n\"Hello, world.\\n\"这更易读更方便，而且等效于上面的字符串串联——系统把这个显然一行的字符串字面量重写成带参数的字符串字面量串联。<!-- This is more readable and convenient and equivalent to the above string concatenation -- the system\nrewrites this apparent single string literal into a concatenation of string literals with variables. -->在 $ 之后最短的完整表达式被视为插入其值于字符串中的表达式。因此，你可以用括号向字符串中插入任何表达式：<!-- The shortest complete expression after the `$` is taken as the expression whose value is to be\ninterpolated into the string. Thus, you can interpolate any expression into a string using parentheses: -->julia> \"1 + 2 = $(1 + 2)\"\n\"1 + 2 = 3\"串联和插值都调用 string 以转换对象为字符串形式。多数非 AbstractString 对象被转换为和它们作为文本表达式输入的方式密切对应的字符串。<!-- Both concatenation and string interpolation call [`string`](@ref) to convert objects into string\nform. Most non-`AbstractString` objects are converted to strings closely corresponding to how\nthey are entered as literal expressions: -->julia> v = [1,2,3]\n3-element Array{Int64,1}:\n 1\n 2\n 3\n\njulia> \"v: $v\"\n\"v: [1, 2, 3]\"string 是 AbstractString 和 AbstractChar 值的标识，所以它们作为自身被插入字符串，无需引用，无需转义：<!-- [`string`](@ref) is the identity for `AbstractString` and `AbstractChar` values, so these are interpolated\ninto strings as themselves, unquoted and unescaped: -->julia> c = \'x\'\n\'x\': ASCII/Unicode U+0078 (category Ll: Letter, lowercase)\n\njulia> \"hi, $c\"\n\"hi, x\"若要在字符串字面量中包含文本 $，就用反斜杠转义：<!-- To include a literal `$` in a string literal, escape it with a backslash: -->julia> print(\"I have \\$100 in my account.\\n\")\nI have $100 in my account."
},

{
    "location": "manual/strings/#三引号字符串字面量-1",
    "page": "字符串",
    "title": "三引号字符串字面量",
    "category": "section",
    "text": "<!-- ## Triple-Quated String Literals -->当使用三引号创建字符串时，它们有一些在创建更长文本块时可能用到的特殊行为。<!-- When strings are created using triple-quotes (`\"\"\"...\"\"\"`) they have some special behavior that\ncan be useful for creating longer blocks of text. -->首先，三引号字符串也被反缩进到最小缩进线的水平。这在定义包含缩进的字符串时很有用。例如：<!-- First, triple-quoted strings are also dedented to the level of the least-indented line.\nThis is useful for defining strings within code that is indented. For example: -->julia> str = \"\"\"\n           Hello,\n           world.\n         \"\"\"\n\"  Hello,\\n  world.\\n\"在这里，后三引号 \"\"\" 前面的最后一（空）行设置了缩进级别。<!-- In this case the final (empty) line before the closing `\"\"\"` sets the indentation level. -->反缩进级别被确定为所有行中空格或制表符的最大公共起始序列，不包括前三引号 \"\"\" 后面的一行以及只包含空格或制表符的行（总包含结尾 \"\"\" 的行）。那么对于所有不包括前三引号 \"\"\" 后面文本的行而言，公共起始序列就被移除了（包括只含空格和制表符而以此序列开始的行），例如：<!-- The dedentation level is determined as the longest common starting sequence of spaces or\ntabs in all lines, excluding the line following the opening `\"\"\"` and lines containing\nonly spaces or tabs (the line containing the closing `\"\"\"` is always included).\nThen for all lines, excluding the text following the opening `\"\"\"`, the common starting\nsequence is removed (including lines containing only spaces and tabs if they start with\nthis sequence), e.g.: -->julia> \"\"\"    This\n         is\n           a test\"\"\"\n\"    This\\nis\\n  a test\"接下来，如果前三引号 \"\"\" 后面紧跟换行符，那么换行符就从生成的字符串中被剥离。<!-- Next, if the opening `\"\"\"` is followed by a newline,\nthe newline is stripped from the resulting string. -->\"\"\"hello\"\"\"等效于is equivalent to\"\"\"\nhello\"\"\"但but\"\"\"\n\nhello\"\"\"将在开头包含一个文本换行符。<!-- will contain a literal newline at the beginning. -->换行符的移除是在反缩进之后进行的。例如：<!-- Stripping of the newline is performed after the dedentation. For example: -->julia> \"\"\"\n         Hello,\n         world.\"\"\"\n\"Hello,\\nworld.\"尾随空格保持不变。Trailing whitespace is left unaltered.三引号字符串字面量可不带转义地包含 \" 符号。<!-- Triple-quoted string literals can contain `\"` symbols without escaping. -->注意，无论是用单引号还是三引号，在文本字符串中换行符都会生成一个换行 (LF) 字符 \\n，即使你的编辑器使用回车组合符 \\r (CR) 或 CRLF 来结束行。为了在字符串中包含 CR，总是应该使用显式转义符 \\r；比如，可以输入文本字符串 \"a CRLF line ending\\r\\n\"。<!-- Note that line breaks in literal strings, whether single- or triple-quoted, result in a newline\n(LF) character `\\n` in the string, even if your editor uses a carriage return `\\r` (CR) or CRLF\ncombination to end lines. To include a CR in a string, use an explicit escape `\\r`; for example,\nyou can enter the literal string `\"a CRLF line ending\\r\\n\"`. -->"
},

{
    "location": "manual/strings/#常见操作-1",
    "page": "字符串",
    "title": "常见操作",
    "category": "section",
    "text": "<!-- ## Common Operations -->你可以使用标准的比较操作符按照字典顺序比较字符串：<!-- You can lexicographically compare strings using the standard comparison operators: -->julia> \"abracadabra\" < \"xylophone\"\ntrue\n\njulia> \"abracadabra\" == \"xylophone\"\nfalse\n\njulia> \"Hello, world.\" != \"Goodbye, world.\"\ntrue\n\njulia> \"1 + 2 = 3\" == \"1 + 2 = $(1 + 2)\"\ntrue你可以使用 findfirst 函数搜索特定字符的索引：<!-- You can search for the index of a particular character using the [`findfirst`](@ref) function: -->julia> findfirst(isequal(\'x\'), \"xylophone\")\n1\n\njulia> findfirst(isequal(\'p\'), \"xylophone\")\n5\n\njulia> findfirst(isequal(\'z\'), \"xylophone\")你可以带上第三个参数，用 findnext 函数在给定偏移量处搜索字符。<!-- You can start the search for a character at a given offset by using [`findnext`](@ref)\nwith a third argument: -->julia> findnext(isequal(\'o\'), \"xylophone\", 1)\n4\n\njulia> findnext(isequal(\'o\'), \"xylophone\", 5)\n7\n\njulia> findnext(isequal(\'o\'), \"xylophone\", 8)你可以用 occursin 函数检查在字符串中某子字符串可否找到。<!-- You can use the [`occursin`](@ref) function to check if a substring is found within a string: -->julia> occursin(\"world\", \"Hello, world.\")\ntrue\n\njulia> occursin(\"o\", \"Xylophon\")\ntrue\n\njulia> occursin(\"a\", \"Xylophon\")\nfalse\n\njulia> occursin(\'o\', \"Xylophon\")\ntrue最后一例表明 occursin 也可用于搜寻字符字面量。<!-- The last example shows that [`occursin`](@ref) can also look for a character literal. -->另外还有两个方便的字符串函数 repeat 和 join：<!-- Two other handy string functions are [`repeat`](@ref) and [`join`](@ref): -->julia> repeat(\".:Z:.\", 10)\n\".:Z:..:Z:..:Z:..:Z:..:Z:..:Z:..:Z:..:Z:..:Z:..:Z:.\"\n\njulia> join([\"apples\", \"bananas\", \"pineapples\"], \", \", \" and \")\n\"apples, bananas and pineapples\"其它有用的函数还包括：<!--  Some other useful functions include: -->firstindex(str) 给出可用来索引到 str 的最小（字节）索引（对字符串来说这总是 1，对于别的容器来说却不一定如此）。\nlastindex(str) 给出可用来索引到 str 的最大（字节）索引。\nlength(str)，str 中的字符个数。\nlength(str, i, j)，str 中从 i 到 j 的有效字符索引个数。\nncodeunits(str)，字符串中 代码单元 的数目。\ncodeunit(str, i) 给出在字符串 str 中索引为 i 的代码单元值。\nthisind(str, i)，给定一个字符串的任意索引，查找索引点所在的首个索引。\nnextind(str, i, n=1) 查找在索引 i 之后第 n 个字符的开头。\nprevind(str, i, n=1) 查找在索引 i 之前第 n 个字符的开始。<!--  * [`firstindex(str)`](@ref) gives the minimal (byte) index that can be used to index into `str` (always 1 for strings, not necessarily true for other containers).\n  * [`lastindex(str)`](@ref) gives the maximal (byte) index that can be used to index into `str`.\n  * [`length(str)`](@ref) the number of characters in `str`.\n  * [`length(str, i, j)`](@ref) the number of valid character indices in `str` from `i` to `j`.\n  * [`ncodeunits(str)`](@ref) number of [code units](https://en.wikipedia.org/wiki/Character_encoding#Terminology) in a string.\n  * [`codeunit(str, i)`](@ref) gives the code unit value in the string `str` at index `i`.\n  * [`thisind(str, i)`](@ref) given an arbitrary index into a string find the first index of the character into which the index points.\n  * [`nextind(str, i, n=1)`](@ref) find the start of the `n`th character starting after index `i`.\n  * [`prevind(str, i, n=1)`](@ref) find the start of the `n`th character starting before index `i`.\n-->"
},

{
    "location": "manual/strings/#非标准字符串字面量-1",
    "page": "字符串",
    "title": "非标准字符串字面量",
    "category": "section",
    "text": "<!-- ## Non-Standard String Literals -->有时当你想构造字符串或者使用字符串语义，标准的字符串构造却不能很好的满足需求。Julia 为这种情形提供了 非标准字符串字面量。非标准字符串字面量看似常规双引号字符串字面量，但却直接加上了标识符前缀因而并不那么像普通的字符串字面量。下面将提到，正则表达式，字节数组字面量和版本号字面量都是非标准字符串字面量的例子。其它例子见 元编程 章。<!-- There are situations when you want to construct a string or use string semantics, but the behavior\nof the standard string construct is not quite what is needed. For these kinds of situations, Julia\nprovides [non-standard string literals](@ref). A non-standard string literal looks like a regular\ndouble-quoted string literal, but is immediately prefixed by an identifier, and doesn\'t behave\nquite like a normal string literal.  Regular expressions, byte array literals and version number\nliterals, as described below, are some examples of non-standard string literals. Other examples\nare given in the [Metaprogramming](@ref) section. -->"
},

{
    "location": "manual/strings/#正则表达式-1",
    "page": "字符串",
    "title": "正则表达式",
    "category": "section",
    "text": "<!-- ## Regular Expressions -->Julia 具有与 Perl 兼容的正则表达式 (regexes)，就像 PCRE 包所提供的那样。正则表达式以两种方式和字符串相关：一个显然的关联是，正则表达式被用于找到字符串中的正则模式；另一个关联是，正则表达式自身就是作为字符串输入，它们被解析到可用来高效搜索字符串中模式的状态机中。在 Julia 中正则表达式的输入使用了前缀各类以 r 开头的标识符的非标准字符串字面量。最基本的不打开任何选项的正则表达式只用到了 r\"...\"：<!-- Julia has Perl-compatible regular expressions (regexes), as provided by the [PCRE](http://www.pcre.org/)\nlibrary. Regular expressions are related to strings in two ways: the obvious connection is that\nregular expressions are used to find regular patterns in strings; the other connection is that\nregular expressions are themselves input as strings, which are parsed into a state machine that\ncan be used to efficiently search for patterns in strings. In Julia, regular expressions are input\nusing non-standard string literals prefixed with various identifiers beginning with `r`. The most\nbasic regular expression literal without any options turned on just uses `r\"...\"`: -->julia> r\"^\\s*(?:#|$)\"\nr\"^\\s*(?:#|$)\"\n\njulia> typeof(ans)\nRegex若要检查正则表达式是否匹配某字符串，就用 occursin：<!--\nTo check if a regex matches a string, use [`occursin`](@ref): -->julia> occursin(r\"^\\s*(?:#|$)\", \"not a comment\")\nfalse\n\njulia> occursin(r\"^\\s*(?:#|$)\", \"# a comment\")\ntrue可以看到，occursin只返回正确或错误，表明给定正则表达式是否在该字符串中出现。然而，通常我们不只想知道字符串是否匹配，更想了解它是如何匹配的。要捕获匹配的信息，可以改用 match 函数：<!-- As one can see here, [`occursin`](@ref) simply returns true or false, indicating whether a\nmatch for the given regex occurs in the string. Commonly, however, one wants to know not\njust whether a string matched, but also *how* it matched. To capture this information about\na match, use the [`match`](@ref) function instead: -->julia> match(r\"^\\s*(?:#|$)\", \"not a comment\")\n\njulia> match(r\"^\\s*(?:#|$)\", \"# a comment\")\nRegexMatch(\"#\")若正则表达式与给定字符串不匹配，match 返回 nothing——在交互式提示框中不打印任何东西的特殊值。除了不打印，它是一个完全正常的值，这可以用程序来测试：<!-- If the regular expression does not match the given string, [`match`](@ref) returns [`nothing`](@ref)\n-- a special value that does not print anything at the interactive prompt. Other than not printing,\nit is a completely normal value and you can test for it programmatically: -->m = match(r\"^\\s*(?:#|$)\", line)\nif m === nothing\n    println(\"not a comment\")\nelse\n    println(\"blank or comment\")\nend如果正则表达式不匹配，match 的返回值是 RegexMatch 对象。这些对象记录了表达式是如何匹配的，包括该模式匹配的子字符串和任何可能被捕获的子字符串。上面的例子仅仅捕获了匹配的部分子字符串，但也许我们想要捕获的是公共字符后面的任何非空文本。我们可以这样做：<!-- If a regular expression does match, the value returned by [`match`](@ref) is a `RegexMatch`\nobject. These objects record how the expression matches, including the substring that the pattern\nmatches and any captured substrings, if there are any. This example only captures the portion\nof the substring that matches, but perhaps we want to capture any non-blank text after the comment\ncharacter. We could do the following: -->julia> m = match(r\"^\\s*(?:#\\s*(.*?)\\s*$|$)\", \"# a comment \")\nRegexMatch(\"# a comment \", 1=\"a comment\")当调用 match 时，你可以选择指定开始搜索的索引。例如：<!-- When calling [`match`](@ref), you have the option to specify an index at which to start the\nsearch. For example: -->julia> m = match(r\"[0-9]\",\"aaaa1aaaa2aaaa3\",1)\nRegexMatch(\"1\")\n\njulia> m = match(r\"[0-9]\",\"aaaa1aaaa2aaaa3\",6)\nRegexMatch(\"2\")\n\njulia> m = match(r\"[0-9]\",\"aaaa1aaaa2aaaa3\",11)\nRegexMatch(\"3\")你可以从 RegexMatch 对象中提取如下信息：<!-- You can extract the following info from a `RegexMatch` object: -->匹配的整个子字符串：m.match\n作为字符串数组捕获的子字符串：m.captures\n整个匹配开始处的偏移：m.offset\n作为向量的捕获子字符串的偏移：m.offsets<!--\n  * the entire substring matched: `m.match`\n  * the captured substrings as an array of strings: `m.captures`\n  * the offset at which the whole match begins: `m.offset`\n  * the offsets of the captured substrings as a vector: `m.offsets`\n-->当捕获不匹配时，m.captures 在该处不再包含一个子字符串，而是 什么也不 包含；此外，m.offsets 的偏移量为 0（回想一下，Julia 的索引是从 1 开始的，因此字符串的零偏移是无效的）。下面是两个有些牵强的例子：<!-- For when a capture doesn\'t match, instead of a substring, `m.captures` contains `nothing` in that\nposition, and `m.offsets` has a zero offset (recall that indices in Julia are 1-based, so a zero\noffset into a string is invalid). Here is a pair of somewhat contrived examples: -->julia> m = match(r\"(a|b)(c)?(d)\", \"acd\")\nRegexMatch(\"acd\", 1=\"a\", 2=\"c\", 3=\"d\")\n\njulia> m.match\n\"acd\"\n\njulia> m.captures\n3-element Array{Union{Nothing, SubString{String}},1}:\n \"a\"\n \"c\"\n \"d\"\n\njulia> m.offset\n1\n\njulia> m.offsets\n3-element Array{Int64,1}:\n 1\n 2\n 3\n\njulia> m = match(r\"(a|b)(c)?(d)\", \"ad\")\nRegexMatch(\"ad\", 1=\"a\", 2=nothing, 3=\"d\")\n\njulia> m.match\n\"ad\"\n\njulia> m.captures\n3-element Array{Union{Nothing, SubString{String}},1}:\n \"a\"\n nothing\n \"d\"\n\njulia> m.offset\n1\n\njulia> m.offsets\n3-element Array{Int64,1}:\n 1\n 0\n 2让捕获作为数组返回是很方便的，这样就可以用解构语法把它们和局域变量绑定起来：<!-- It is convenient to have captures returned as an array so that one can use destructuring syntax\nto bind them to local variables: -->julia> first, second, third = m.captures; first\n\"a\"通过使用捕获组的编号或名称对 RegexMatch 对象进行索引，也可实现对捕获的访问：<!-- Captures can also be accessed by indexing the `RegexMatch` object with the number or name of the\ncapture group: -->julia> m=match(r\"(?<hour>\\d+):(?<minute>\\d+)\",\"12:45\")\nRegexMatch(\"12:45\", hour=\"12\", minute=\"45\")\n\njulia> m[:minute]\n\"45\"\n\njulia> m[2]\n\"45\"使用 replace 时利用 \\n 引用第 n 个捕获组和给替换字符串加上 s 的前缀，可以实现替换字符串中对捕获的引用。捕获组 0 指的是整个匹配对象。可在替换中用 g<groupname> 对命名捕获组进行引用。例如：<!-- Captures can be referenced in a substitution string when using [`replace`](@ref) by using `\\n`\nto refer to the nth capture group and prefixing the substitution string with `s`. Capture group\n0 refers to the entire match object. Named capture groups can be referenced in the substitution\nwith `g<groupname>`. For example: -->julia> replace(\"first second\", r\"(\\w+) (?<agroup>\\w+)\" => s\"\\g<agroup> \\1\")\n\"second first\"为明确起见，编号捕获组也可用 \\g<n> 进行引用，例如：<!-- Numbered capture groups can also be referenced as `\\g<n>` for disambiguation, as in: -->julia> replace(\"a\", r\".\" => s\"\\g<0>1\")\n\"a1\"你可以在后双引号的后面加上 i, m, s 和 x 等标志对正则表达式进行修改。这些标志和 Perl 里面的含义一样，详见以下对 perlre 手册 的摘录：<!-- You can modify the behavior of regular expressions by some combination of the flags `i`, `m`,\n`s`, and `x` after the closing double quote mark. These flags have the same meaning as they do\nin Perl, as explained in this excerpt from the [perlre manpage](http://perldoc.perl.org/perlre.html#Modifiers): -->i   不区分大小写的模式匹配\n\n    若区域设置规则有效，相应映射中代码点小于 255 的部分取自当前区域设置，更大代码点的部分取自 Unicode 规则。\n    然而，跨越 Unicode 规则和 非 Unicode 规则边界的匹配将失败。\n\nm   将字符串视为多行。也即更改 \"^\" 和 \"$\", 使其从匹配字符串的开头和结尾变为匹配字符串中任意一行的开头或结尾。\n\ns   将字符串视为单行。也即更改 \".\" 以匹配任何字符，即使是通常不能匹配的换行符。\n\n    像这样一起使用，r\"\"ms，它们让 \".\" 匹配任何字符，同时也支持分别在字符串中换行符的后面和前面用 \"^\" 和 \"$\" 进行匹配。\n\nx   令正则表达式解析器忽略多数既不是反斜杠也不属于字符类的空白。它可以用来把正则表达式分解成（略为）更易读的部分。和普通代码中一样，`#` 字符也被当作引入注释的元字符。i   Do case-insensitive pattern matching.\n\n    If locale matching rules are in effect, the case map is taken\n    from the current locale for code points less than 255, and\n    from Unicode rules for larger code points. However, matches\n    that would cross the Unicode rules/non-Unicode rules boundary\n    (ords 255/256) will not succeed.\n\nm   Treat string as multiple lines.  That is, change \"^\" and \"$\"\n    from matching the start or end of the string to matching the\n    start or end of any line anywhere within the string.\n\ns   Treat string as single line.  That is, change \".\" to match any\n    character whatsoever, even a newline, which normally it would\n    not match.\n\n    Used together, as r\"\"ms, they let the \".\" match any character\n    whatsoever, while still allowing \"^\" and \"$\" to match,\n    respectively, just after and just before newlines within the\n    string.\n\nx   Tells the regular expression parser to ignore most whitespace\n    that is neither backslashed nor within a character class. You\n    can use this to break up your regular expression into\n    (slightly) more readable parts. The \'#\' character is also\n    treated as a metacharacter introducing a comment, just as in\n    ordinary code.例如，下面的正则表达式已打开所有三个标志：<!-- For example, the following regex has all three flags turned on: -->julia> r\"a+.*b+.*?d$\"ism\nr\"a+.*b+.*?d$\"ims\n\njulia> match(r\"a+.*b+.*?d$\"ism, \"Goodbye,\\nOh, angry,\\nBad world\\n\")\nRegexMatch(\"angry,\\nBad world\")r\"...\" 文本的构造没有插值和转义（除了引号 \" 仍然需要转义）。下面例子展示了它和标准字符串字面量之间的差别：<!-- The `r\"...\"` literal is constructed without interpolation and unescaping (except for\nquotation mark `\"` which still has to be escaped). Here is an example\nshowing the difference from standard string literals: -->julia> x = 10\n10\n\njulia> r\"$x\"\nr\"$x\"\n\njulia> \"$x\"\n\"10\"\n\njulia> r\"\\x\"\nr\"\\x\"\n\njulia> \"\\x\"\nERROR: syntax: invalid escape sequenceJulia 也支持 r\"\"\"...\"\"\" 形式的三引号正则表达式字符串（或许便于处理包含引号和换行符的正则表达式）。<!-- Triple-quoted regex strings, of the form `r\"\"\"...\"\"\"`, are also supported (and may be convenient\nfor regular expressions containing quotation marks or newlines). -->"
},

{
    "location": "manual/strings/#字节数组字面量-1",
    "page": "字符串",
    "title": "字节数组字面量",
    "category": "section",
    "text": "<!-- ## Byte Array Literals -->另一个有用的非标准字符串字面量是字节数组字面量：b\"...\"。这种形式使你能够用字符串表示法来表达只读字面量字节数组，也即 UInt8 值的数组。字节数组字面量的规则如下：<!-- Another useful non-standard string literal is the byte-array string literal: `b\"...\"`. This\nform lets you use string notation to express read only literal byte arrays -- i.e. arrays of\n[`UInt8`](@ref) values. The type of those objects is `CodeUnits{UInt8, String}`.\nThe rules for byte array literals are the following: -->ASCII 字符和 ASCII 转义生成单个字节。\n\\x 和八进制转义序列生成与转义值对应的字节。\nUnicode 转义序列生成编码 UTF-8 中该代码点的字节序列。<!--\n  * ASCII characters and ASCII escapes produce a single byte.\n  * `\\x` and octal escape sequences produce the *byte* corresponding to the escape value.\n  * Unicode escape sequences produce a sequence of bytes encoding that code point in UTF-8.\n-->这些规则有一些重叠，这是因为 \\x 的行为和小于 0x80(128) 的八进制转义被前两个规则同时包括了；但这两个规则又是一致的。通过这些规则可以方便地同时使用 ASCII 字符，任意字节值，以及 UTF-8 序列来生成字节数组。下面是一个用到全部三个规则的例子：<!-- There is some overlap between these rules since the behavior of `\\x` and octal escapes less than\n0x80 (128) are covered by both of the first two rules, but here these rules agree. Together, these\nrules allow one to easily use ASCII characters, arbitrary byte values, and UTF-8 sequences to\nproduce arrays of bytes. Here is an example using all three: -->julia> b\"DATA\\xff\\u2200\"\n8-element Base.CodeUnits{UInt8,String}:\n 0x44\n 0x41\n 0x54\n 0x41\n 0xff\n 0xe2\n 0x88\n 0x80其中，ASCII 字符串 \"DATA\" 对应于字节 68, 65, 84, 65。\\xff 生成单个字节 255。Unicode 转义 \\u2200 在 UTF-8 中被编码为三个字节 226, 136, 128。注意生成的字节数组不对应任何有效 UTF-8 字符串。<!-- The ASCII string \"DATA\" corresponds to the bytes 68, 65, 84, 65. `\\xff` produces the single byte 255.\nThe Unicode escape `\\u2200` is encoded in UTF-8 as the three bytes 226, 136, 128. Note that the\nresulting byte array does not correspond to a valid UTF-8 string: -->julia> isvalid(\"DATA\\xff\\u2200\")\nfalse如前所述，CodeUnits{UInt8,String} 类型的行为类似于只读 UInt8 数组。如果需要标准数组，你可以 `Vector{UInt8} 进行转换。<!-- As it was mentioned `CodeUnits{UInt8,String}` type behaves like read only array of `UInt8` and\nif you need a standard vector you can convert it using `Vector{UInt8}`: -->julia> x = b\"123\"\n3-element Base.CodeUnits{UInt8,String}:\n 0x31\n 0x32\n 0x33\n\njulia> x[1]\n0x31\n\njulia> x[1] = 0x32\nERROR: setindex! not defined for Base.CodeUnits{UInt8,String}\n[...]\n\njulia> Vector{UInt8}(x)\n3-element Array{UInt8,1}:\n 0x31\n 0x32\n 0x33同时，要注意到 xff 和 \\uff 之间的显著差别：前面的转义序列编码为字节 255，而后者代表 代码点 255，它在 UTF-8 中编码为两个字节：<!-- Also observe the significant distinction between `\\xff` and `\\uff`: the former escape sequence\nencodes the *byte 255*, whereas the latter escape sequence represents the *code point 255*, which\nis encoded as two bytes in UTF-8: -->julia> b\"\\xff\"\n1-element Base.CodeUnits{UInt8,String}:\n 0xff\n\njulia> b\"\\uff\"\n2-element Base.CodeUnits{UInt8,String}:\n 0xc3\n 0xbf字符字面量也用到了相同的行为。<!-- Character literals use the same behavior. -->对于小于 \\u80 的代码点，每个代码点的 UTF-8 编码恰好只是由相应 \\x 转义产生的单个字节，因此忽略两者的差别无伤大雅。然而，从 x80 到 \\xff 的转义比起从 u80 到 \\uff 的转义来，就有一个主要的差别：前者都只编码为一个字节，它没有形成任何有效 UTF-8 数据，除非它后面有非常特殊的连接字节；而后者则都代表 2 字节编码的 Unicode 代码点。<!-- For code points less than `\\u80`, it happens that the\nUTF-8 encoding of each code point is just the single byte produced by the corresponding `\\x` escape,\nso the distinction can safely be ignored. For the escapes `\\x80` through `\\xff` as compared to\n`\\u80` through `\\uff`, however, there is a major difference: the former escapes all encode single\nbytes, which -- unless followed by very specific continuation bytes -- do not form valid UTF-8\ndata, whereas the latter escapes all represent Unicode code points with two-byte encodings. -->如果这些还是太难理解，试着读一下 \"每个软件开发人员绝对必须知道的最基础 Unicode 和字符集知识\"。它是一个优质的 Unicode 和 UTF-8 指南，或许能帮助解除一些这方面的疑惑。<!-- If this is all extremely confusing, try reading [\"The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets\"](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/).　\nIt\'s an excellent introduction to Unicode and UTF-8, and may help alleviate\nsome confusion regarding the matter. -->"
},

{
    "location": "manual/strings/#版本号字面量-1",
    "page": "字符串",
    "title": "版本号字面量",
    "category": "section",
    "text": "<!-- ## Version Number Literals -->版本号很容易用 v\"...\" 形式的非标准字符串字面量表示。版本号字面量生成遵循 语义版本 规范的 VersionNumber 对象，因此由主、次、补丁号构成，后跟预发行 (pre-release) 和生成阿尔法数注释 (build alpha-numeric)。例如，v\"0.2.1-rc1+win64\" 可分为主版本号 0，次版本号 2，补丁版本号 1，预发行版号 rc1，以及生成版本 win64。输入版本字面量时，除了主版本号以外所有内容都是可选的，因此 v\"0.2\" 等效于 v\"0.2.0\" (预发行号和生成注释为空), v\"2\" 等效于 v\"2.0.0\"，等等。<!-- Version numbers can easily be expressed with non-standard string literals of the form [`v\"...\"`](@ref @v_str).\nVersion number literals create [`VersionNumber`](@ref) objects which follow the\nspecifications of [semantic versioning](http://semver.org),\nand therefore are composed of major, minor and patch numeric values, followed by pre-release and\nbuild alpha-numeric annotations. For example, `v\"0.2.1-rc1+win64\"` is broken into major version\n`0`, minor version `2`, patch version `1`, pre-release `rc1` and build `win64`. When entering\na version literal, everything except the major version number is optional, therefore e.g.  `v\"0.2\"`\nis equivalent to `v\"0.2.0\"` (with empty pre-release/build annotations), `v\"2\"` is equivalent to\n`v\"2.0.0\"`, and so on. -->VersionNumber 对象在轻松正确地比较两个（或更多）版本时非常有用。例如，常数 VERSION 把 Julia 的版本号保留为一个 VersionNumber 对象，因此可以像下面这样用简单的声明定义一些特定版本的行为：<!-- `VersionNumber` objects are mostly useful to easily and correctly compare two (or more) versions.\nFor example, the constant c holds Julia version number as a `VersionNumber` object, and\ntherefore one can define some version-specific behavior using simple statements as: -->if v\"0.2\" <= VERSION < v\"0.3-\"\n    # do something specific to 0.2 release series\nend注意在上例中用到了非标准版本号 v\"0.3-\"，其中有尾随符 -：这个符号是 Julia 标准的扩展，它可以用来表明低于任何 0.3 发行版的版本，包括所有的预发行版。所以上例中代码只能在稳定版本 0.2 上运行，而不能在 v\"0.3.0-rc1\" 这样的版本上运行。为了支持非稳定（即预发行）的 0.2 版本，下限检查应像这样应该改为：v\"0.2-\" <= VERSION。<!-- Note that in the above example the non-standard version number `v\"0.3-\"` is used, with a trailing\n`-`: this notation is a Julia extension of the standard, and it\'s used to indicate a version which\nis lower than any `0.3` release, including all of its pre-releases. So in the above example the\ncode would only run with stable `0.2` versions, and exclude such versions as `v\"0.3.0-rc1\"`. In\norder to also allow for unstable (i.e. pre-release) `0.2` versions, the lower bound check should\nbe modified like this: `v\"0.2-\" <= VERSION`. -->另一个非标准版本规范扩展使得能够使用 + 来表示生成版本的上限，例如 VERSION > v\"0.2-rc1+\" 可以用来表示任意高于 0.2-rc1 和其任意生成版本的版本：它对 v\"0.2-rc1+win64\" 返回 false 而对 v\"0.2-rc2\" 返回 true。<!-- Another non-standard version specification extension allows one to use a trailing `+` to express\nan upper limit on build versions, e.g.  `VERSION > v\"0.2-rc1+\"` can be used to mean any version\nabove `0.2-rc1` and any of its builds: it will return `false` for version `v\"0.2-rc1+win64\"` and\n`true` for `v\"0.2-rc2\"`. -->在比较中使用这样的特殊版本是个好法子（特别是，总是应该对高版本使用尾随 -，除非有好理由不这样），但它们不应该被用作任何内容的实际版本，因为它们在语义版本控制方案中无效。<!-- It is good practice to use such special versions in comparisons (particularly, the trailing `-`\nshould always be used on upper bounds unless there\'s a good reason not to), but they must not\nbe used as the actual version number of anything, as they are invalid in the semantic versioning\nscheme. -->除了用于常数 VERSION，c 对象在 Pkg 模块中被广泛用于指定包版本和其依赖。<!-- Besides being used for the [`VERSION`](@ref) constant, c objects are widely used\nin the `Pkg` module, to specify packages versions and their dependencies. -->"
},

{
    "location": "manual/strings/#原始字符串字面量-1",
    "page": "字符串",
    "title": "原始字符串字面量",
    "category": "section",
    "text": "<!-- ## Raw String Literals -->无插值和非转义的原始字符串可用 raw\"...\" 形式的非标准字符串字面量表示。原始字符串字面量生成普通的 String 对象，它无需插值和非转义地包含和输入完全一样的封闭式内容。这对于包含其他语言中使用 \" 或 \\\" 作为特殊字符的代码或标记的字符串很有用。<!-- Raw strings without interpolation or unescaping can be expressed with\nnon-standard string literals of the form `raw\"...\"`. Raw string literals create\nordinary `String` objects which contain the enclosed contents exactly as\nentered with no interpolation or unescaping. This is useful for strings which\ncontain code or markup in other languages which use `$` or `\\` as special\ncharacters. -->例外的是，引号仍必须转义，例如 raw\"\\\"\" 等效于 \"\\\"\"。为了能够表达所有字符串，反斜杠也必须转义，不过只是当它刚好出现在引号前面时。<!-- The exception is that quotation marks still must be escaped, e.g. `raw\"\\\"\"` is equivalent\nto `\"\\\"\"`.\nTo make it possible to express all strings, backslashes then also must be escaped, but\nonly when appearing right before a quote character: -->julia> println(raw\"\\\\ \\\\\\\"\")\n\\\\ \\\"请注意，前两个反斜杠在输出中逐字显示，这是因为它们不是在引号前面。然而，接下来的一个反斜杠字符转义了后面的一个反斜杠；又由于这些反斜杠出现在引号前面，最后一个反斜杠转义了一个引号。<!-- Notice that the first two backslashes appear verbatim in the output, since they do not\nprecede a quote character.\nHowever, the next backslash character escapes the backslash that follows it, and the\nlast backslash escapes a quote, since these backslashes appear before a quote. -->"
},

{
    "location": "manual/parallel-computing/#",
    "page": "并行计算",
    "title": "并行计算",
    "category": "page",
    "text": ""
},

{
    "location": "manual/parallel-computing/#并行计算-1",
    "page": "并行计算",
    "title": "并行计算",
    "category": "section",
    "text": "<!--\n# Parallel Computing\n-->对于多线程和并行计算的新手来说，首先感受下Julia提供的不同层次的并行计算方式会很有帮助，主要可以分为以下三大类：<!--\nFor newcomers to multi-threading and parallel computing it can be useful to first appreciate\nthe different levels of parallelism offered by Julia. We can divide them in three main categories :\n-->Julia协程(绿色线程)\n多线程\n多核或分布式进程<!--\n1. Julia Coroutines (Green Threading)\n2. Multi-Threading\n3. Multi-Core or Distributed Processing\n-->首先考虑Julia中的任务 Tasks (又称 协程 Coroutines)以及一些其它依赖于Julia运行时的模块，Julia能够通过控制内部Tasks之间的通信来允许计算的挂起和恢复，而不必手动与操作系统的调度器交互。此外，Julia还支持Tasks之间通过wait和fetch操作通信。通信和数据同步是通过Channel提供的管道在管理。<!--\nWe will first consider Julia [Tasks (aka Coroutines)](@ref man-tasks) and other modules that rely on the Julia runtime library, that allow to suspend and resume computations with full control of inter-`Tasks` communication without having to manually interface with the operative system\'s scheduler.\nJulia also allows to communicate between `Tasks` through operations like [`wait`](@ref) and [`fetch`](@ref).\nCommunication and data synchronization is managed through [`Channel`](@ref)s, which are the conduit\nthat allows inter-`Tasks` communication.\n-->Julia还支持实验性的多线程功能，在执行时通过分叉(fork)，然后有一个匿名函数在所有线程上运行，可以看作时一种分叉-汇合(fork-join)的方式，并行执行的线程必须在分叉之后，汇合到Julia主线程上，从而继续串行执行。多线程是通过Base.Threads模块提供的，目前仍然是实验性的，主要是因为目前Julia还不是完全线程安全的。在进行I/O操作和task切换的时候某些特定的段错误会出现，最新的进展请关注the issue tracker，多线程应该只在你考虑全局变量，锁以及原子操作的时候使用，后面我们会详细讲解。<!--\nJulia also supports experimental multi-threading, where execution is forked and an anonymous function is run across all\nthreads.\nDescribed as a fork-join approach, parallel threads are branched off and they all have to join the Julia main thread to make serial execution continue.\nMulti-threading is supported using the `Base.Threads` module that is still considered experimental, as Julia is\nnot fully thread-safe yet. In particular segfaults seem to emerge for I\\O operations and task switching.\nAs an un up-to-date reference, keep an eye on [the issue tracker](https://github.com/JuliaLang/julia/issues?q=is%3Aopen+is%3Aissue+label%3Amultithreading).\nMulti-Threading should only be used if you take into consideration global variables, locks and\natomics, so we will explain it later.\n-->最后会介绍Julia的分布式并行计算，从科学计算的角度出发，Julia原生支持在多核/多机器上部署进程，此外还会介绍分布式编程有关的一些实用的包，如MPI.jl和DistributedArrays.jl。<!--\nIn the end we will present Julia\'s way to distributed and parallel computing. With scientific computing\nin mind, Julia natively implements interfaces to distribute a process through multiple cores or machines.\nAlso we will mention useful external packages for distributed programming like `MPI.jl` and `DistributedArrays.jl`.\n-->"
},

{
    "location": "manual/parallel-computing/#协程-1",
    "page": "并行计算",
    "title": "协程",
    "category": "section",
    "text": "<!--\n# Coroutines\n-->Julia的并行编程平台采用任务 Tasks (又称 协程 Coroutines)来进行多个计算之间的切换。为了表示轻量线程之间的执行顺序，必须提供一种通信的原语。Julia提供了Channel(func::Function, ctype=Any, csize=0, taskref=nothing)，根据func创建task，然后将其绑定到一个新的大小为csize类型为ctype的channel，并调度task。Channels可以看作是一种task之间通信的方式，Channel{T}(sz::Int)会创建一个类型为T大小为sz的channel。无论何时发起一个通信操作，如fetch或wait，当前task都会挂起，然后调度器会选择其它task去执行，在一个task等待的事件结束之后会重新恢复执行。<!--\nJulia\'s parallel programming platform uses [Tasks (aka Coroutines)](@ref man-tasks) to switch among multiple computations.\nTo express an order of execution between lightweight threads communication primitives are necessary.\nJulia offers `Channel(func::Function, ctype=Any, csize=0, taskref=nothing)` that creates a new task from `func`,\nbinds it to a new channel of type `ctype` and size `csize` and schedule the task.\n`Channels` can serve as a way to communicate between tasks, as `Channel{T}(sz::Int)` creates a buffered channel of type `T` and size `sz`.\nWhenever code performs a communication operation like [`fetch`](@ref) or [`wait`](@ref),\nthe current task is suspended and a scheduler picks another task to run.\nA task is restarted when the event it is waiting for completes.\n-->对于许多问题而言，并不需要直接考虑Task，不过，Task可以用来同时等待多个事件，从而实现动态调度。在动态调度的过程中，程序可以决定计算什么，或者根据其它任务执行结束的时间决定接下来在哪里执行计算。这对于不可预测或不平衡的计算量来说是必须的，因为我们只希望给那些已经完成了其当前任务的进程分配更多的任务。<!--\nFor many problems, it is not necessary to think about tasks directly. However, they can be used\nto wait for multiple events at the same time, which provides for *dynamic scheduling*. In dynamic\nscheduling, a program decides what to compute or where to compute it based on when other jobs\nfinish. This is needed for unpredictable or unbalanced workloads, where we want to assign more\nwork to processes only when they finish their current tasks.\n-->"
},

{
    "location": "manual/parallel-computing/#频道(Channels)-1",
    "page": "并行计算",
    "title": "频道(Channels)",
    "category": "section",
    "text": "<!--\n## Channels\n-->在Control Flow中有关Task的部分，已经讨论了如何协调多个函数的执行。Channel可以很方便地在多个运行中的task传递数据，特别是那些涉及I/O的操作。<!--\nThe section on [`Task`](@ref)s in [Control Flow](@ref) discussed the execution of multiple functions in\na co-operative manner. [`Channel`](@ref)s can be quite useful to pass data between running tasks, particularly\nthose involving I/O operations.\n-->典型的I/O操作包括读写文件、访问web服务、执行外部程序等。在所有这些场景中，如果其它task可以在读取文件（等待外部服务或程序执行完成）时继续执行，那么总的执行时间能够得到大大提升。<!--\nExamples of operations involving I/O include reading/writing to files, accessing web services,\nexecuting external programs, etc. In all these cases, overall execution time can be improved if\nother tasks can be run while a file is being read, or while waiting for an external service/program\nto complete.\n-->一个channel可以看做是一个管道，一端可读，另一端可写。<!--\nA channel can be visualized as a pipe, i.e., it has a write end and read end.\n-->不同的task可以通过put!往同一个channel并发地写入。\n不同的task也可以通过take!从同一个channel并发地取数据\n举个例子：<!--\n  * Multiple writers in different tasks can write to the same channel concurrently via [`put!`](@ref)\n    calls.\n  * Multiple readers in different tasks can read data concurrently via [`take!`](@ref) calls.\n  * As an example:\n--># Given Channels c1 and c2,\nc1 = Channel(32)\nc2 = Channel(32)\n\n# and a function `foo` which reads items from from c1, processes the item read\n# and writes a result to c2,\nfunction foo()\n    while true\n        data = take!(c1)\n        [...]               # process data\n        put!(c2, result)    # write out result\n    end\nend\n\n# we can schedule `n` instances of `foo` to be active concurrently.\nfor _ in 1:n\n    @async foo()\nendChannel可以通过Channel{T}(sz)构造，得到的channel只能存储类型T的数据。如果T没有指定，那么channel可以存任意类型。sz表示该channel能够存储的最大元素个数。比如Channel(32)得到的channel最多可以存储32个元素。而Channel{MyType}(64)则可以最多存储64个MyType类型的数据。\n如果一个Channel是空的，读取的task(即执行take!的task)会被阻塞直到有新的数据准备好了。\n如果一个Channel是满的，那么写入的task(即执行put!的task)则会被阻塞，直到Channel有空余。\nisready可以用来检查一个channel中是否有已经准备好的元素，而wait则用来等待一个元素准备好。\n一个Channel一开始处于开启状态，也就是说可以被take!读取和put!写入。close会关闭一个Channel，对于一个已经关闭的Channel，`put!会失败，例如：<!--\n  * Channels are created via the `Channel{T}(sz)` constructor. The channel will only hold objects\n    of type `T`. If the type is not specified, the channel can hold objects of any type. `sz` refers\n    to the maximum number of elements that can be held in the channel at any time. For example, `Channel(32)`\n    creates a channel that can hold a maximum of 32 objects of any type. A `Channel{MyType}(64)` can\n    hold up to 64 objects of `MyType` at any time.\n  * If a [`Channel`](@ref) is empty, readers (on a [`take!`](@ref) call) will block until data is available.\n  * If a [`Channel`](@ref) is full, writers (on a [`put!`](@ref) call) will block until space becomes available.\n  * [`isready`](@ref) tests for the presence of any object in the channel, while [`wait`](@ref)\n    waits for an object to become available.\n  * A [`Channel`](@ref) is in an open state initially. This means that it can be read from and written to\n    freely via [`take!`](@ref) and [`put!`](@ref) calls. [`close`](@ref) closes a [`Channel`](@ref).\n    On a closed [`Channel`](@ref), [`put!`](@ref) will fail. For example:\n-->julia> c = Channel(2);\n\njulia> put!(c, 1) # `put!` on an open channel succeeds\n1\n\njulia> close(c);\n\njulia> put!(c, 2) # `put!` on a closed channel throws an exception.\nERROR: InvalidStateException(\"Channel is closed.\",:closed)\nStacktrace:\n[...]take! 和 fetch (只读取，不会将元素从channle中删掉)仍然可以从一个已经关闭的channel中读数据，直到channel被取空了为止，例如：<!--\n  * [`take!`](@ref) and [`fetch`](@ref) (which retrieves but does not remove the value) on a closed\n    channel successfully return any existing values until it is emptied. Continuing the above example:\n-->julia> fetch(c) # Any number of `fetch` calls succeed.\n1\n\njulia> fetch(c)\n1\n\njulia> take!(c) # The first `take!` removes the value.\n1\n\njulia> take!(c) # No more data available on a closed channel.\nERROR: InvalidStateException(\"Channel is closed.\",:closed)\nStacktrace:\n[...]Channel可以在for循环中遍历，此时，循环会一直运行知道Channel中有数据，遍历过程中会取遍加入到Channel中的所有值。一旦Channel关闭或者取空了，for循环就好终止。<!--\nA `Channel` can be used as an iterable object in a `for` loop, in which case the loop runs as\nlong as the `Channel` has data or is open. The loop variable takes on all values added to the\n`Channel`. The `for` loop is terminated once the `Channel` is closed and emptied.\n-->例如，下面的for循环会等待新的数据：<!--\nFor example, the following would cause the `for` loop to wait for more data:\n-->julia> c = Channel{Int}(10);\n\njulia> foreach(i->put!(c, i), 1:3) # add a few entries\n\njulia> data = [i for i in c]而下面的则会返回已经读取的数据：<!--\nwhile this will return after reading all data:\n-->julia> c = Channel{Int}(10);\n\njulia> foreach(i->put!(c, i), 1:3); # add a few entries\n\njulia> close(c);                    # `for` loops can exit\n\njulia> data = [i for i in c]\n3-element Array{Int64,1}:\n 1\n 2\n 3考虑这样一个用channel做task之间通信的例子。首先，起4个task来处理一个jobs channel中的数据。jobs中的每个任务通过job_id来表示，然后每个task模拟读取一个job_id，然后随机等待一会儿，然后往一个resultschannel中写入一个Tuple，分别包含job_id和执行的时间，最后将结果打印出来：。<!--\nConsider a simple example using channels for inter-task communication. We start 4 tasks to process\ndata from a single `jobs` channel. Jobs, identified by an id (`job_id`), are written to the channel.\nEach task in this simulation reads a `job_id`, waits for a random amount of time and writes back\na tuple of `job_id` and the simulated time to the results channel. Finally all the `results` are\nprinted out.\n-->julia> const jobs = Channel{Int}(32);\n\njulia> const results = Channel{Tuple}(32);\n\njulia> function do_work()\n           for job_id in jobs\n               exec_time = rand()\n               sleep(exec_time)                # simulates elapsed time doing actual work\n                                               # typically performed externally.\n               put!(results, (job_id, exec_time))\n           end\n       end;\n\njulia> function make_jobs(n)\n           for i in 1:n\n               put!(jobs, i)\n           end\n       end;\n\njulia> n = 12;\n\njulia> @async make_jobs(n); # feed the jobs channel with \"n\" jobs\n\njulia> for i in 1:4 # start 4 tasks to process requests in parallel\n           @async do_work()\n       end\n\njulia> @elapsed while n > 0 # print out results\n           job_id, exec_time = take!(results)\n           println(\"$job_id finished in $(round(exec_time,2)) seconds\")\n           n = n - 1\n       end\n4 finished in 0.22 seconds\n3 finished in 0.45 seconds\n1 finished in 0.5 seconds\n7 finished in 0.14 seconds\n2 finished in 0.78 seconds\n5 finished in 0.9 seconds\n9 finished in 0.36 seconds\n6 finished in 0.87 seconds\n8 finished in 0.79 seconds\n10 finished in 0.64 seconds\n12 finished in 0.5 seconds\n11 finished in 0.97 seconds\n0.029772311当前版本的Julia会将所有task分发到一个操作系统的线程，因此，涉及IO的操作会从并行执行中获利，而计算密集型的task则会顺序地在单独这个线程上执行。未来Julia将支持在多个线程上调度task，从而让计算密集型task也能从并行计算中获利。<!--\nThe current version of Julia multiplexes all tasks onto a single OS thread. Thus, while tasks\ninvolving I/O operations benefit from parallel execution, compute bound tasks are effectively\nexecuted sequentially on a single OS thread. Future versions of Julia may support scheduling of\ntasks on multiple threads, in which case compute bound tasks will see benefits of parallel execution\ntoo.\n-->"
},

{
    "location": "manual/parallel-computing/#多线程（实验性功能）-1",
    "page": "并行计算",
    "title": "多线程（实验性功能）",
    "category": "section",
    "text": "<!--\n## Multi-Threading (Experimental)\n-->除了task之外，Julia还原生支持多线程。本部分内容是实验性的，未来相关接口可能会改变。<!--\nIn addition to tasks Julia forwards natively supports multi-threading.\nsupports multi-threading. Note that this section is experimental and the interfaces may change\nin the future.\n-->"
},

{
    "location": "manual/parallel-computing/#设置-1",
    "page": "并行计算",
    "title": "设置",
    "category": "section",
    "text": "<!--\n### Setup\n-->Julia默认启动一个线程执行代码，这点可以通过Threads.nthreads()确认：<!--\nBy default, Julia starts up with a single thread of execution. This can be verified by using the\ncommand [`Threads.nthreads()`](@ref):\n-->julia> Threads.nthreads()\n1Julia启动时的线程数可以通过环境变量JULIA_NUM_THREADS设置，下面启动4个线程：<!--\nThe number of threads Julia starts up with is controlled by an environment variable called `JULIA_NUM_THREADS`.\nNow, let\'s start up Julia with 4 threads:\n-->export JULIA_NUM_THREADS=4(上面的代码只能在Linux和OSX系统中运行，如果你在以上平台中使用的是C shell，那么将export改成set，如果你是在Windows上运行，那么将export改成set同时启动julia时指定julia.exe的完整路径。)<!--\n(The above command works on bourne shells on Linux and OSX. Note that if you\'re using a C shell\non these platforms, you should use the keyword `set` instead of `export`. If you\'re on Windows,\nstart up the command line in the location of `julia.exe` and use `set` instead of `export`.)\n-->现在确认下确实有4个线程：<!--\nLet\'s verify there are 4 threads at our disposal.\n-->julia> Threads.nthreads()\n4不过我们现在是在master线程，用Threads.threadid确认下：<!--\nBut we are currently on the master thread. To check, we use the function [`Threads.threadid`](@ref)\n-->julia> Threads.threadid()\n1"
},

{
    "location": "manual/parallel-computing/#@threads宏-1",
    "page": "并行计算",
    "title": "@threads宏",
    "category": "section",
    "text": "<!--\n### The `@threads` Macro\n-->下面用一个简单的例子测试我们原生的线程，首先创建一个全零的数组：<!--\nLet\'s work a simple example using our native threads. Let us create an array of zeros:\n-->julia> a = zeros(10)\n10-element Array{Float64,1}:\n 0.0\n 0.0\n 0.0\n 0.0\n 0.0\n 0.0\n 0.0\n 0.0\n 0.0\n 0.0现在用4个线程模拟操作这个数组，每个线程往对应的位置写入线程ID。<!--\nLet us operate on this array simultaneously using 4 threads. We\'ll have each thread write its\nthread ID into each location.\n-->Julia用Threads.@threads宏实现并行循环，该宏加在for循环前面，提示Julia循环部分是一个多线程的区域：<!--\nJulia supports parallel loops using the [`Threads.@threads`](@ref) macro. This macro is affixed\nin front of a `for` loop to indicate to Julia that the loop is a multi-threaded region:\n-->julia> Threads.@threads for i = 1:10\n           a[i] = Threads.threadid()\n       end每次迭代会分配到各个线程，然后每个线程往对应位置写入线程ID：<!--\nThe iteration space is split amongst the threads, after which each thread writes its thread ID\nto its assigned locations:\n-->julia> a\n10-element Array{Float64,1}:\n 1.0\n 1.0\n 1.0\n 2.0\n 2.0\n 2.0\n 3.0\n 3.0\n 4.0\n 4.0注意Threads.@threads并没有一个像@distributed一样的可选的reduction参数。<!--\nNote that [`Threads.@threads`](@ref) does not have an optional reduction parameter like [`@distributed`](@ref).\n-->Julia支持访问和修改值的原子操作，即，以一种线程安全的方式来避免竞态条件。一个值（必须是基本类型的，primitive type）可以通过Threads.Atomic来包装起来从而支持原子操作。下面看个例子：<!--\nJulia supports accessing and modifying values *atomically*, that is, in a thread-safe way to avoid\n[race conditions](https://en.wikipedia.org/wiki/Race_condition). A value (which must be of a primitive\ntype) can be wrapped as [`Threads.Atomic`](@ref) to indicate it must be accessed in this way.\nHere we can see an example:\n-->julia> i = Threads.Atomic{Int}(0);\n\njulia> ids = zeros(4);\n\njulia> old_is = zeros(4);\n\njulia> Threads.@threads for id in 1:4\n           old_is[id] = Threads.atomic_add!(i, id)\n           ids[id] = id\n       end\n\njulia> old_is\n4-element Array{Float64,1}:\n 0.0\n 1.0\n 7.0\n 3.0\n\njulia> ids\n4-element Array{Float64,1}:\n 1.0\n 2.0\n 3.0\n 4.0如果不加Atomic的话，那么会因为竞态条件而得到错误的结果，下面是一个没有避免竞态条件的例子：<!--\nHad we tried to do the addition without the atomic tag, we might have gotten the\nwrong answer due to a race condition. An example of what would happen if we didn\'t\navoid the race:\n-->julia> using Base.Threads\n\njulia> nthreads()\n4\n\njulia> acc = Ref(0)\nBase.RefValue{Int64}(0)\n\njulia> @threads for i in 1:1000\n          acc[] += 1\n       end\n\njulia> acc[]\n926\n\njulia> acc = Atomic{Int64}(0)\nAtomic{Int64}(0)\n\njulia> @threads for i in 1:1000\n          atomic_add!(acc, 1)\n       end\n\njulia> acc[]\n1000note: Note\n并非所有的原始类型都能放在Atomic标签内封装起来，支持的类型有Int8, Int16, Int32, Int64, Int128, UInt8, UInt16, UInt32, UInt64, UInt128, Float16, Float32, 以及 Float64。此外，Int128和UInt128在AAarch32和ppc64le上不支持。<!--\n!!! note\n    Not *all* primitive types can be wrapped in an `Atomic` tag. Supported types\n    are `Int8`, `Int16`, `Int32`, `Int64`, `Int128`, `UInt8`, `UInt16`, `UInt32`,\n    `UInt64`, `UInt128`, `Float16`, `Float32`, and `Float64`. Additionally,\n    `Int128` and `UInt128` are not supported on AAarch32 and ppc64le.\n-->"
},

{
    "location": "manual/parallel-computing/#副作用和可变的函数参数-1",
    "page": "并行计算",
    "title": "副作用和可变的函数参数",
    "category": "section",
    "text": "在使用多线程时，要非常小心使用了不纯的函数pure function，例如，用到了以!结尾的函数，通常这类函数会修改其参数，因而是不纯的。此外还有些函数没有以!结尾，其实也是有副作用的，比如findfirst(regex, str)就会改变regex参数，或者是rand()会修改Base.GLOBAL_RNG:<!--\n## Side effects and mutable function arguments\n\nWhen using multi-threading we have to be careful when using functions that are not\n[pure](https://en.wikipedia.org/wiki/Pure_function) as we might get a wrong answer.\nFor instance functions that have their\n[name ending with `!`](https://docs.julialang.org/en/latest/manual/style-guide/#Append-!-to-names-of-functions-that-modify-their-arguments-1)\nby convention modify their arguments and thus are not pure. However, there are\nfunctions that have side effects and their name does not end with `!`. For\ninstance [`findfirst(regex, str)`](@ref) mutates its `regex` argument or\n[`rand()`](@ref) changes `Base.GLOBAL_RNG` :\n-->julia> using Base.Threads\n\njulia> nthreads()\n4\n\njulia> function f()\n           s = repeat([\"123\", \"213\", \"231\"], outer=1000)\n           x = similar(s, Int)\n           rx = r\"1\"\n           @threads for i in 1:3000\n               x[i] = findfirst(rx, s[i]).start\n           end\n           count(v -> v == 1, x)\n       end\nf (generic function with 1 method)\n\njulia> f() # the correct result is 1000\n1017\n\njulia> function g()\n           a = zeros(1000)\n           @threads for i in 1:1000\n               a[i] = rand()\n           end\n           length(unique(a))\n       end\ng (generic function with 1 method)\n\njulia> srand(1); g() # the result for a single thread is 1000\n781此时，应该重新设计代码来避免可能的竞态条件或者是使用同步机制。<!--\nIn such cases one should redesign the code to avoid the possibility of a race condition or use\n[synchronization primitives](https://docs.julialang.org/en/latest/base/multi-threading/#Synchronization-Primitives-1).\n-->例如，为了修正上面findfirst的例子，每个线程都要拷贝一份rx。<!--\nFor example in order to fix `findfirst` example above one needs to have a\nseparate copy of `rx` variable for each thread:\n-->julia> function f_fix()\n             s = repeat([\"123\", \"213\", \"231\"], outer=1000)\n             x = similar(s, Int)\n             rx = [Regex(\"1\") for i in 1:nthreads()]\n             @threads for i in 1:3000\n                 x[i] = findfirst(rx[threadid()], s[i]).start\n             end\n             count(v -> v == 1, x)\n         end\nf_fix (generic function with 1 method)\n\njulia> f_fix()\n1000现在使用Regex(\"1\")而不是r\"1\"来保证Julia对每个rx向量的元素都创建了一个Regex的对象。<!--\nWe now use `Regex(\"1\")` instead of `r\"1\"` to make sure that Julia\ncreates separate instances of `Regex` object for each entry of `rx` vector.\n-->rand的例子更复杂点，因为我们需要保证每个线程使用的是不重叠的随机数序列，这可以简单地通过Future.randjump函数保证：<!--\nThe case of `rand` is a bit more complex as we have to ensure that each thread\nuses non-overlapping pseudorandom number sequences. This can be simply ensured\nby using the `Future.randjump` function:\n-->julia> using Random; import Future\n\njulia> function g_fix(r)\n           a = zeros(1000)\n           @threads for i in 1:1000\n               a[i] = rand(r[threadid()])\n           end\n           length(unique(a))\n       end\ng_fix (generic function with 1 method)\n\njulia>  r = let m = MersenneTwister(1)\n                [m; accumulate(Future.randjump, m, fill(big(10)^20, nthreads()-1))]\n            end;\n\njulia> g_fix(r)\n1000这里将r向量发送到g_fix，由于生成多个随机数是很昂贵的操作，因此我们不希望每次执行函数都重复该操作。<!--\nWe pass `r` vector to `g_fix` as generating several RGNs is an expensive\noperation so we do not want to repeat it every time we run the function.\n-->"
},

{
    "location": "manual/parallel-computing/#@threadcall-（实验性功能）-1",
    "page": "并行计算",
    "title": "@threadcall （实验性功能）",
    "category": "section",
    "text": "<!--\n## @threadcall (Experimental)\n-->所有的I/O task，计时器，REPL命令等都是通过一个事件循环复用的一个系统线程。有一个补丁版的libuv(http://docs.libuv.org/en/v1.x/)提供了该功能，从而在同一个系统线程上协调调度多个task。I/O task和计时器在等待某个事件发生时，会隐式地退出（yield），而显式地调用yield则会允许其它task被调度。<!--\nAll I/O tasks, timers, REPL commands, etc are multiplexed onto a single OS thread via an event\nloop. A patched version of libuv ([http://docs.libuv.org/en/v1.x/](http://docs.libuv.org/en/v1.x/))\nprovides this functionality. Yield points provide for co-operatively scheduling multiple tasks\nonto the same OS thread. I/O tasks and timers yield implicitly while waiting for the event to\noccur. Calling [`yield`](@ref) explicitly allows for other tasks to be scheduled.\n-->因此，一个执行ccall的task会阻止Julia的调度器执行其它task，直到调用返回，这种情况对于所有外部库的调用都存在，例外的情况是，某些自定义的C代码调用返回到了Julia中（此时有可能yield）或者C代码执行了jl_yield()（C中等价的yield）。<!--\nThus, a task executing a [`ccall`](@ref) effectively prevents the Julia scheduler from executing any other\ntasks till the call returns. This is true for all calls into external libraries. Exceptions are\ncalls into custom C code that call back into Julia (which may then yield) or C code that calls\n`jl_yield()` (C equivalent of [`yield`](@ref)).\n-->注意，尽管Julia的代码默认是单线程的，但是Julia调用的库可能会用到其内部的多线程，例如，BLAS会在一台机器上使用尽可能多的线程。<!--\nNote that while Julia code runs on a single thread (by default), libraries used by Julia may launch\ntheir own internal threads. For example, the BLAS library may start as many threads as there are\ncores on a machine.\n-->@threadcall就是要解决ccall会卡住主线程的这个问题，它会在一个额外的线程中调度C函数的执行，有一个默认大小为4的线程库用来做这个事情，该线程库的大小可以通过环境变量UV_THREADPOOL_SIZE控制。在等待一个空闲线程，以及在函数执行过程中某个线程空闲下来时，（主线程的事件循环中）正在请求的task会yield到其它task，注意，@threadcall并不会返回，直到执行结束。从用户的角度来看，就是一个和其它Julia API一样会阻塞的模块。<!--\nThe [`@threadcall`](@ref) macro addresses scenarios where we do not want a [`ccall`](@ref) to block the main Julia\nevent loop. It schedules a C function for execution in a separate thread. A threadpool with a\ndefault size of 4 is used for this. The size of the threadpool is controlled via environment variable\n`UV_THREADPOOL_SIZE`. While waiting for a free thread, and during function execution once a thread\nis available, the requesting task (on the main Julia event loop) yields to other tasks. Note that\n`@threadcall` does not return till the execution is complete. From a user point of view, it is\ntherefore a blocking call like other Julia APIs.\n-->非常关键的一点是，被调用的函数不会再调用回Julia。<!--\nIt is very important that the called function does not call back into Julia.\n-->@threadcall 在Julia未来的版本中可能会被移除或改变。<!--\n`@threadcall` may be removed/changed in future versions of Julia.\n-->"
},

{
    "location": "manual/parallel-computing/#多核或分布式进程-1",
    "page": "并行计算",
    "title": "多核或分布式进程",
    "category": "section",
    "text": "<!--\n# Multi-Core or Distributed Processing\n-->作为Julia标准库之一，Distributed库提供了一种分布式内存并行计算的实现。<!--\nAn implementation of distributed memory parallel computing is provided by module `Distributed`\nas part of the standard library shipped with Julia.\n-->大多数现代计算机都拥有不止一个CPU，而且多台计算机可以组织在一起形成一个集群。借助多个CPU的计算能力，许多计算过程能够更快地完成，这其中影响性能的两个主要因素分别是：CPU自身的速度以及它们访问内存的速度。显然，在一个集群中，一个CPU访问同一个节点的RAM速度是最快的，不过令人吃惊的是，在一台典型的多核笔记本电脑上，由于访问主存和缓存的速度存在差别，类似的现象也会存在。因此，一个良好的多进程环境应该能够管理好某一片内存区域“所属”的CPU。Julia提供的多进程环境是基于消息传递来实现的，可以做到同时让程序在多个进程的不同内存区域中运行。<!--\nMost modern computers possess more than one CPU, and several computers can be combined together\nin a cluster. Harnessing the power of these multiple CPUs allows many computations to be completed\nmore quickly. There are two major factors that influence performance: the speed of the CPUs themselves,\nand the speed of their access to memory. In a cluster, it\'s fairly obvious that a given CPU will\nhave fastest access to the RAM within the same computer (node). Perhaps more surprisingly, similar\nissues are relevant on a typical multicore laptop, due to differences in the speed of main memory\nand the [cache](https://www.akkadia.org/drepper/cpumemory.pdf). Consequently, a good multiprocessing\nenvironment should allow control over the \"ownership\" of a chunk of memory by a particular CPU.\nJulia provides a multiprocessing environment based on message passing to allow programs to run\non multiple processes in separate memory domains at once.\n-->Julia的消息传递机制与一些其它的框架不太一样，比如 MPI [1]。在Julia中，进程之间的通信通常是单向的，这里单向的意思是说，在实现2个进程之间的操作时，只需要显式地管理一个进程即可。此外，这些操作并不像是“发送消息”，“接收消息”这类操作，而是一些高阶的操作，比如调用用户定义的函数。<!--\nJulia\'s implementation of message passing is different from other environments such as MPI [^1]\nCommunication in Julia is generally \"one-sided\", meaning that the programmer needs to explicitly\nmanage only one process in a two-process operation. Furthermore, these operations typically do\nnot look like \"message send\" and \"message receive\" but rather resemble higher-level operations\nlike calls to user functions.\n-->Julia中的分布式编程基于两个基本概念：远程引用(remote references)和远程调用(remote calls)。远程引用是一个对象，任意一个进程可以通过它访问存储在某个特定进程上的对象。远程调用指是某个进程发起的执行函数的请求，该函数会在另一个（也可能是同一个）进程中执行。<!--\nDistributed programming in Julia is built on two primitives: *remote references* and *remote calls*.\nA remote reference is an object that can be used from any process to refer to an object stored\non a particular process. A remote call is a request by one process to call a certain function\non certain arguments on another (possibly the same) process.\n-->远程引用有两种类型：Future和RemoteChannel。<!--\nRemote references come in two flavors: [`Future`](@ref) and [`RemoteChannel`](@ref).\n-->一次远程调用会返回一个Future作为结果。远程调用会立即返回；也就是说，执行远程调用的进程接下来会继续执行下一个操作，而远程调用则会在另外的进程中进行。你可以通过对返回的Future执行wait操作来等待远程调用结束，然后用fetch获取结果。<!--\nA remote call returns a [`Future`](@ref) to its result. Remote calls return immediately; the process\nthat made the call proceeds to its next operation while the remote call happens somewhere else.\nYou can wait for a remote call to finish by calling [`wait`](@ref) on the returned [`Future`](@ref),\nand you can obtain the full value of the result using [`fetch`](@ref).\n-->对于RemoteChannel而言，它可以被反复写入。例如，多个进程可以通过引用同一个远程Channel来协调相互之间的操作。<!--\nOn the other hand, [`RemoteChannel`](@ref) s are rewritable. For example, multiple processes can\nco-ordinate their processing by referencing the same remote `Channel`.\n-->每个进程都有一个对应的id，提供Julia交互环境的进程的id永远是1。我们把用来执行并行任务的进程称为“worker”，假如总共只有一个进程，那么进程1就被认为是worker，否则，除了进程1以外的进程都称作worker。<!--\nEach process has an associated identifier. The process providing the interactive Julia prompt\nalways has an `id` equal to 1. The processes used by default for parallel operations are referred\nto as \"workers\". When there is only one process, process 1 is considered a worker. Otherwise,\nworkers are considered to be all processes other than process 1.\n-->一起试一下吧。执行julia -p n就可以在本地起n个进程。一般来说，将n设成与你机器上（物理的内核数）CPU个数一致比较合适。需要注意-p参数会隐式地载入Distributed模块。<!--\nLet\'s try this out. Starting with `julia -p n` provides `n` worker processes on the local machine.\nGenerally it makes sense for `n` to equal the number of CPU threads (logical cores) on the machine. Note that the `-p`\nargument implicitly loads module `Distributed`.\n-->$ ./julia -p 2\n\njulia> r = remotecall(rand, 2, 2, 2)\nFuture(2, 1, 4, nothing)\n\njulia> s = @spawnat 2 1 .+ fetch(r)\nFuture(2, 1, 5, nothing)\n\njulia> fetch(s)\n2×2 Array{Float64,2}:\n 1.18526  1.50912\n 1.16296  1.60607remotecall的第一个参数是想要调用的函数，第二个参数是执行函数的进程id，其余的参数会喂给将要被调用的函数。在Julia中进行并行编程时，一般不需要显示地指明具体在哪个进程上执行，不过remotecall是一个相对底层的接口用来提供细粒度的管理。<!--\nThe first argument to [`remotecall`](@ref) is the function to call. Most parallel programming\nin Julia does not reference specific processes or the number of processes available, but [`remotecall`](@ref)\nis considered a low-level interface providing finer control. The second argument to [`remotecall`](@ref)\nis the `id` of the process that will do the work, and the remaining arguments will be passed to\nthe function being called.\n-->可以看到，第一行代码请求进程2构建一个随机矩阵，第二行代码对该矩阵执行加一操作。每次执行的结果存在对应的Future中，即r和s。这里@spawnat宏会在第一个参数所指定的进程中执行后面第二个参数中的表达式。<!--\nAs you can see, in the first line we asked process 2 to construct a 2-by-2 random matrix, and\nin the second line we asked it to add 1 to it. The result of both calculations is available in\nthe two futures, `r` and `s`. The [`@spawnat`](@ref) macro evaluates the expression in the second\nargument on the process specified by the first argument.\n-->有时候，你可能会希望立即获取远程计算的结果，比如，在接下来的操作中就需要读取远程调用的结果，这时候你可以使用remotecall_fetch函数，其效果相当于fetch(remotecall(...))，不过更高效些。<!--\nOccasionally you might want a remotely-computed value immediately. This typically happens when\nyou read from a remote object to obtain data needed by the next local operation. The function\n[`remotecall_fetch`](@ref) exists for this purpose. It is equivalent to `fetch(remotecall(...))`\nbut is more efficient.\n-->julia> remotecall_fetch(getindex, 2, r, 1, 1)\n0.18526337335308085回忆下，这里getindex(r,1,1) 相当于 r[1,1]，因此，上面的调用相当于获取r的第一个元素。<!--\nRemember that [`getindex(r,1,1)`](@ref) is [equivalent](@ref man-array-indexing) to `r[1,1]`, so this call fetches\nthe first element of the future `r`.\n-->remotecall的语法不是很方便，有一个宏@spawn可以做些简化，其作用于一个表达式，而不是函数，同时会自动帮你选择在哪个进程上执行。<!--\nThe syntax of [`remotecall`](@ref) is not especially convenient. The macro [`@spawn`](@ref)\nmakes things easier. It operates on an expression rather than a function, and picks where to do\nthe operation for you:\n-->julia> r = @spawn rand(2,2)\nFuture(2, 1, 4, nothing)\n\njulia> s = @spawn 1 .+ fetch(r)\nFuture(3, 1, 5, nothing)\n\njulia> fetch(s)\n2×2 Array{Float64,2}:\n 1.38854  1.9098\n 1.20939  1.57158注意这里执行的是1 .+ fetch(r)而不是1 .+ r。这是因为我们并不知道这段代码会在哪个进程中执行，因此，通常需要用fetch将r中的数据挪到当前计算加法的进程中。这时候@spawn会很智能地在拥有r的进程中执行计算，此时，fetch就相当于什么都不用做。(2018-08-02 译者注：issue#28350)<!--\nNote that we used `1 .+ fetch(r)` instead of `1 .+ r`. This is because we do not know where the\ncode will run, so in general a [`fetch`](@ref) might be required to move `r` to the process\ndoing the addition. In this case, [`@spawn`](@ref) is smart enough to perform the computation\non the process that owns `r`, so the [`fetch`](@ref) will be a no-op (no work is done).\n-->显然，@spawn并非Julia内置的一部分，而是通过宏定义的，因此，你也可以自己定义类似的结构。<!--\n(It is worth noting that [`@spawn`](@ref) is not built-in but defined in Julia as a [macro](@ref man-macros).\nIt is possible to define your own such constructs.)\n-->有一点一定要注意，一旦执行了fetch，Future 就会将结果缓存起来，之后执行fetch的时候就不涉及到网络传输了。一旦所有的Future都获取到了值，那么远端存储的值就会被删掉。<!--\nAn important thing to remember is that, once fetched, a [`Future`](@ref) will cache its value\nlocally. Further [`fetch`](@ref) calls do not entail a network hop. Once all referencing [`Future`](@ref)s\nhave fetched, the remote stored value is deleted.\n-->@async跟@spawn有点类似，不过只在当前局部线程中执行。通过它来给每个进程创建一个喂养的task，每个task都选取下一个将要计算的索引，然后等待其执行结束，然后重复该过程，直到索引超出边界。需要注意的是，task并不会立即执行，只有在执行到@sync结束时才会开始执行，此时，当前线程交出控制权，直到所有的任务都完成了。在v0.7之后，所有的喂养task都能够通过nextidx共享状态，因为他们都在同一个进程中。尽管Tasks是协调调度的，但在某些情况下仍然有可能发送死锁，如asynchronous I\\O。上下文只会在特定时候发生切换，在这里就是执行remotecall_fetch。当然，这是当前版本（dev v0.7）的实现，未来版本中可能会改变，有望在M个进程中最多跑N个task，即M:N 线程。然后，nextidx需要加锁，从而让多个进程能够安全地对一个资源同时进行读写。<!--\n[`@async`](@ref) is similar to [`@spawn`](@ref), but only runs tasks on the local process. We\nuse it to create a \"feeder\" task for each process. Each task picks the next index that needs to\nbe computed, then waits for its process to finish, then repeats until we run out of indices. Note\nthat the feeder tasks do not begin to execute until the main task reaches the end of the [`@sync`](@ref)\nblock, at which point it surrenders control and waits for all the local tasks to complete before\nreturning from the function.\nAs for v0.7 and beyond, the feeder tasks are able to share state via `nextidx` because\nthey all run on the same process.\nEven if `Tasks` are scheduled cooperatively, locking may still be required in some contexts, as in [asynchronous I\\O](https://docs.julialang.org/en/stable/manual/faq/#Asynchronous-IO-and-concurrent-synchronous-writes-1).\nThis means context switches only occur at well-defined points: in this case,\nwhen [`remotecall_fetch`](@ref) is called. This is the current state of implementation (dev v0.7) and it may change\nfor future Julia versions, as it is intended to make it possible to run up to N `Tasks` on M `Process`, aka\n[M:N Threading](https://en.wikipedia.org/wiki/Thread_(computing)#Models). Then a lock acquiring\\releasing\nmodel for `nextidx` will be needed, as it is not safe to let multiple processes read-write a resource at\nthe same time.\n-->"
},

{
    "location": "manual/parallel-computing/#访问代码以及加载库-1",
    "page": "并行计算",
    "title": "访问代码以及加载库",
    "category": "section",
    "text": "<!--\n## Code Availability and Loading Packages\n-->对于想要并行执行的代码，需要所有对所有线程都可见。例如，在Julia命令行中输入以下命令：<!--\nYour code must be available on any process that runs it. For example, type the following into\nthe Julia prompt:\n-->julia> function rand2(dims...)\n           return 2*rand(dims...)\n       end\n\njulia> rand2(2,2)\n2×2 Array{Float64,2}:\n 0.153756  0.368514\n 1.15119   0.918912\n\njulia> fetch(@spawn rand2(2,2))\nERROR: RemoteException(2, CapturedException(UndefVarError(Symbol(\"#rand2\"))\nStacktrace:\n[...]进程1知道函数rand2的存在，但进程2并不知道。<!--\nProcess 1 knew about the function `rand2`, but process 2 did not.\n-->大多数情况下，你会从文件或者库中加载代码，在此过程中你可以灵活地控制哪个进程加载哪部分代码。假设有这样一个文件，DummyModule.jl，其代码如下：<!--\nMost commonly you\'ll be loading code from files or packages, and you have a considerable amount\nof flexibility in controlling which processes load code. Consider a file, `DummyModule.jl`,\ncontaining the following code:\n-->module DummyModule\n\nexport MyType, f\n\nmutable struct MyType\n    a::Int\nend\n\nf(x) = x^2+1\n\nprintln(\"loaded\")\n\nend为了在所有进程中引用MyType，DummyModule.jl需要在每个进程中载入。单独执行include(\"DummyModule.jl\")只会在一个线程中将其载入。为了让每个线程都载入它，可以用@everywhere宏来实现(启动Julia的时候，执行julia -p 2)。<!--\nIn order to refer to `MyType` across all processes, `DummyModule.jl` needs to be loaded on\nevery process.  Calling `include(\"DummyModule.jl\")` loads it only on a single process.  To\nload it on every process, use the [`@everywhere`](@ref) macro (starting Julia with `julia -p\n2`):\n-->julia> @everywhere include(\"DummyModule.jl\")\nloaded\n      From worker 3:    loaded\n      From worker 2:    loaded和往常一样，这么做并不会将DummyModule引入到每个线程的命名空间中，除非显式地使用using或import。此外，显式地将DummyModule引入一个线程中，并不会影响其它线程：<!--\nAs usual, this does not bring `DummyModule` into scope on any of the process, which requires\n`using` or `import`.  Moreover, when `DummyModule` is brought into scope on one process, it\nis not on any other:\n-->julia> using .DummyModule\n\njulia> MyType(7)\nMyType(7)\n\njulia> fetch(@spawnat 2 MyType(7))\nERROR: On worker 2:\nUndefVarError: MyType not defined\n⋮\n\njulia> fetch(@spawnat 2 DummyModule.MyType(7))\nMyType(7)不过，我们仍然可以在已经包含(include)过DummyModule的进程中，发送MyType类型的实例，尽管此时该进程的命名空间中并没有MyType变量:<!--\nHowever, it\'s still possible, for instance, to send a `MyType` to a process which has loaded\n`DummyModule` even if it\'s not in scope:\n-->julia> put!(RemoteChannel(2), MyType(7))\nRemoteChannel{Channel{Any}}(2, 1, 13)文件代码还可以在启动的时候，通过-L参数指定，从而提前在多个进程中载入，然后通过一个driver.jl文件控制执行逻辑:<!--\nA file can also be preloaded on multiple processes at startup with the `-L` flag, and a\ndriver script can be used to drive the computation:\n-->julia -p <n> -L file1.jl -L file2.jl driver.jl上面执行driver.jl的进程id为1，就跟提供交互式命令行的Julia进程一样。<!--\nThe Julia process running the driver script in the example above has an `id` equal to 1, just\nlike a process providing an interactive prompt.\n-->最后，如果DummyModule.jl不是一个单独的文件，而是一个包的话，那么using DummyModule只会在所有线程中载入DummyModule.jl，也就是说DummyModule只会在using执行的线程中被引入命名空间。<!--\nFinally, if `DummyModule.jl` is not a standalone file but a package, then `using\nDummyModule` will _load_ `DummyModule.jl` on all processes, but only bring it into scope on\nthe process where `using` was called.\n-->"
},

{
    "location": "manual/parallel-computing/#启动和管理worker进程-1",
    "page": "并行计算",
    "title": "启动和管理worker进程",
    "category": "section",
    "text": "<!--\n## Starting and managing worker processes\n-->Julia自带两种集群管理模式：<!--\nThe base Julia installation has in-built support for two types of clusters:\n-->本地集群，前面通过启动时指定-p参数就是这种模式\n跨机器的集群，通过--machine-file指定。这种模式采用没有密码的ssh登陆并对应的机器上（与host相同的路径下）启动Julia的worker进程。<!--\n  * A local cluster specified with the `-p` option as shown above.\n  * A cluster spanning machines using the `--machine-file` option. This uses a passwordless `ssh` login\n    to start Julia worker processes (from the same path as the current host) on the specified machines.\n-->addprocs, rmprocs, workers这些函数可以分别用来对集群中的进程进行增加，删除和修改。<!--\nFunctions [`addprocs`](@ref), [`rmprocs`](@ref), [`workers`](@ref), and others are available\nas a programmatic means of adding, removing and querying the processes in a cluster.\n-->julia> using Distributed\n\njulia> addprocs(2)\n2-element Array{Int64,1}:\n 2\n 3在master主线程中，Distributed模块必须显式地在调用addprocs之前载入，该模块会自动在其它进程中可见。<!--\nModule `Distributed` must be explicitly loaded on the master process before invoking [`addprocs`](@ref).\nIt is automatically made available on the worker processes.\n-->需要注意的时，worker进程并不会执行~/.julia/config/startup.jl启动脚本，也不会同步其它进程的全局状态（比如全局变量，新定义的方法，加载的模块等）。<!--\nNote that workers do not run a `~/.julia/config/startup.jl` startup script, nor do they synchronize\ntheir global state (such as global variables, new method definitions, and loaded modules) with any\nof the other running processes.\n-->其它类型的集群可以通过自己写一个ClusterManager来实现，下面ClusterManagers部分会介绍。<!--\nOther types of clusters can be supported by writing your own custom `ClusterManager`, as described\nbelow in the [ClusterManagers](@ref) section.\n-->"
},

{
    "location": "manual/parallel-computing/#数据转移-1",
    "page": "并行计算",
    "title": "数据转移",
    "category": "section",
    "text": "<!--\n## Data Movement\n-->分布式程序的性能瓶颈主要是由发送消息和数据转移造成的，减少发送消息和转移数据的数量对于获取高性能和可扩展性至关重要，因此，深入了解Julia分布式程序是如何转移数据的非常有必要。<!--\nSending messages and moving data constitute most of the overhead in a distributed program. Reducing\nthe number of messages and the amount of data sent is critical to achieving performance and scalability.\nTo this end, it is important to understand the data movement performed by Julia\'s various distributed\nprogramming constructs.\n-->fetch可以看作是显式地转移数据的操作，因为它直接要求获取数据到本地机器。@spawn（以及相关的操作）也会移动数据，不过不那么明显，因此称作隐式地数据转移操作。比较以下两种方式，构造一个随机矩阵并求平方：<!--\n[`fetch`](@ref) can be considered an explicit data movement operation, since it directly asks\nthat an object be moved to the local machine. [`@spawn`](@ref) (and a few related constructs)\nalso moves data, but this is not as obvious, hence it can be called an implicit data movement\noperation. Consider these two approaches to constructing and squaring a random matrix:\n-->方法1：<!--\nMethod 1:\n-->julia> A = rand(1000,1000);\n\njulia> Bref = @spawn A^2;\n\n[...]\n\njulia> fetch(Bref);方法2：<!--\nMethod 2:\n-->julia> Bref = @spawn rand(1000,1000)^2;\n\n[...]\n\njulia> fetch(Bref);二者的差别似乎微乎其微，不过受于@spawn的实现，二者其实有很大的区别。第一种方法中，首先在本地构造了一个随机矩阵，然后将其发送到另外一个线程计算平方，而第二种方法中，随机矩阵的构造以及求平方计算都在另外一个进程。因此，第二种方法传输的数据要比第一种方法少得多。<!--\nThe difference seems trivial, but in fact is quite significant due to the behavior of [`@spawn`](@ref).\nIn the first method, a random matrix is constructed locally, then sent to another process where\nit is squared. In the second method, a random matrix is both constructed and squared on another\nprocess. Therefore the second method sends much less data than the first.\n-->在上面这个简单的例子中，两种方法很好区分并作出选择。不过，在实际的程序中设计如何转移数据时，需要经过深思熟虑。例如，如果第一个进程需要使用A，那么第一种方法就更合适些。或者，如果计算A非常复杂，而所有的进程中又只有当前进程有数据A，那么转移数据A就不可避免了。又或者，当前进程在@spawn 和 fetch(Bref)之间几乎没什么可做的，那么最好就不用并行了。又比如，假设rand(1000,1000)操作换成了某种非常复杂的操作，那么也许为这个操作再增加一个@spawn是个不错的方式。<!--\nIn this toy example, the two methods are easy to distinguish and choose from. However, in a real\nprogram designing data movement might require more thought and likely some measurement. For example,\nif the first process needs matrix `A` then the first method might be better. Or, if computing\n`A` is expensive and only the current process has it, then moving it to another process might\nbe unavoidable. Or, if the current process has very little to do between the [`@spawn`](@ref)\nand `fetch(Bref)`, it might be better to eliminate the parallelism altogether. Or imagine `rand(1000,1000)`\nis replaced with a more expensive operation. Then it might make sense to add another [`@spawn`](@ref)\nstatement just for this step.\n-->"
},

{
    "location": "manual/parallel-computing/#全局变量-1",
    "page": "并行计算",
    "title": "全局变量",
    "category": "section",
    "text": "通过@spawn在远端执行的表达式，或者通过remotecall调用的闭包，有可能引用全局变量。在Main模块中的全局绑定和其它模块中的全局绑定有所不同，来看看下面的例子:<!--\n# Global variables\nExpressions executed remotely via `@spawn`, or closures specified for remote execution using\n`remotecall` may refer to global variables. Global bindings under module `Main` are treated\na little differently compared to global bindings in other modules. Consider the following code\nsnippet:\n-->A = rand(10,10)\nremotecall_fetch(()->sum(A), 2)这个例子中sum必须已经在远程的线程中定义了。注意这里A是当前线程中的一个全局变量，起初worker 2在其Main中并没有一个叫做A的变量。上面代码中，将闭包()->sum(A)发送到worker 2之后，会在worker 2中定义一个变量Main.A，而且，Main.A即使在执行完remotecall_fetch之后，仍然会存在与worker 2中。远程调用中包含的全局（这里仅仅指Main模块中的）引用会按如下方式管理：<!--\nIn this case [`sum`](@ref) MUST be defined in the remote process.\nNote that `A` is a global variable defined in the local workspace. Worker 2 does not have a variable called\n`A` under `Main`. The act of shipping the closure `()->sum(A)` to worker 2 results in `Main.A` being defined\non 2. `Main.A` continues to exist on worker 2 even after the call `remotecall_fetch` returns. Remote calls\nwith embedded global references (under `Main` module only) manage globals as follows:\n-->在全局调用中引用的全局绑定会在将要执行该调用的worker中被创建。<!--\n- New global bindings are created on destination workers if they are referenced as part of a remote call.\n-->全局常量仍然在远端结点定义为常量。<!--\n- Global constants are declared as constants on remote nodes too.\n-->全局绑定会在下一次远程调用中引用到的时候，当其值发生改变时，再次发送给目标worker。此外，集群并不会所有结点的全局绑定。例如：<!--\n- Globals are re-sent to a destination worker only in the context of a remote call, and then only\n  if its value has changed. Also, the cluster does not synchronize global bindings across nodes.\n  For example:\n-->A = rand(10,10)\nremotecall_fetch(()->sum(A), 2) # worker 2\nA = rand(10,10)\nremotecall_fetch(()->sum(A), 3) # worker 3\nA = nothing执行以上代码之后，worker 2 和worker 3中的Main.A的值是不同的，同时，节点1上的值则为nothing。<!--\n  Executing the above snippet results in `Main.A` on worker 2 having a different value from\n  `Main.A` on worker 3, while the value of `Main.A` on node 1 is set to `nothing`.\n-->也许你也注意到了，在master主节点上被赋值为nothing之后，全局变量的内存会被回收，但在worker节点上的全局变量并没有被回收掉。执行clear可以手动将远端结点上的特定全局变量置为nothing，然后对应的内存会被周期性的垃圾回收机制回收。<!--\nAs you may have realized, while memory associated with globals may be collected when they are reassigned\non the master, no such action is taken on the workers as the bindings continue to be valid.\n[`clear!`](@ref) can be used to manually reassign specific globals on remote nodes to `nothing` once\nthey are no longer required. This will release any memory associated with them as part of a regular garbage\ncollection cycle.\n-->因此，在远程调用中，需要非常小心地引用全局变量。事实上，应当尽量避免引用全局变量，如果必须引用，那么可以考虑用let代码块将全局变量局部化：<!--\nThus programs should be careful referencing globals in remote calls. In fact, it is preferable to avoid them\naltogether if possible. If you must reference globals, consider using `let` blocks to localize global variables.\n-->例如：<!--\nFor example:\n-->julia> A = rand(10,10);\n\njulia> remotecall_fetch(()->A, 2);\n\njulia> B = rand(10,10);\n\njulia> let B = B\n           remotecall_fetch(()->B, 2)\n       end;\n\njulia> @fetchfrom 2 varinfo()\nname           size summary\n––––––––– ––––––––– ––––––––––––––––––––––\nA         800 bytes 10×10 Array{Float64,2}\nBase                Module\nCore                Module\nMain                Module可以看到，A作为全局变量在worker 2中有定义，而B是一个局部变量，因而最后在worker 2 中并没有B的绑定。<!--\nAs can be seen, global variable `A` is defined on worker 2, but `B` is captured as a local variable\nand hence a binding for `B` does not exist on worker 2.\n-->"
},

{
    "location": "manual/parallel-computing/#并行的Map和Loop-1",
    "page": "并行计算",
    "title": "并行的Map和Loop",
    "category": "section",
    "text": "<!--\n## Parallel Map and Loops\n-->幸运的是，许多有用的并行计算并不涉及数据转移。一个典型的例子就是蒙特卡洛模拟，每个进程都独立地完成一些模拟试验。这里用@spawn在两个进程进行抛硬币的试验，首先，将下面的代码写入count_heads.jl文件:<!--\nFortunately, many useful parallel computations do not require data movement. A common example\nis a Monte Carlo simulation, where multiple processes can handle independent simulation trials\nsimultaneously. We can use [`@spawn`](@ref) to flip coins on two processes. First, write the following\nfunction in `count_heads.jl`:\n-->function count_heads(n)\n    c::Int = 0\n    for i = 1:n\n        c += rand(Bool)\n    end\n    c\nend函数count_heads只是简单地将n个随机0-1值累加，下面在两个机器上进行试验，并将结果叠加：<!--\nThe function `count_heads` simply adds together `n` random bits. Here is how we can perform some\ntrials on two machines, and add together the results:\n-->julia> @everywhere include_string(Main, $(read(\"count_heads.jl\", String)), \"count_heads.jl\")\n\njulia> a = @spawn count_heads(100000000)\nFuture(2, 1, 6, nothing)\n\njulia> b = @spawn count_heads(100000000)\nFuture(3, 1, 7, nothing)\n\njulia> fetch(a)+fetch(b)\n100001564上面的例子展示了一种非常常见而且有用的并行编程模式，在一些进程中执行多次独立的迭代，然后将它们的结果通过某个函数合并到一起，这个合并操作通常称作聚合(reduction)，也就是一般意义上的张量降维(tensor-rank-reducing)，比如将一个向量降维成一个数，或者是将一个tensor降维到某一行或者某一列等。在代码中，通常具有x = f(x, v[i])这种形式，其中x是一个叠加器，f是一个聚合函数，而v[i]则是将要被聚合的值。一般来说，f要求满足结合律，这样不管执行的顺序如何，都不会影响计算结果。<!--\nThis example demonstrates a powerful and often-used parallel programming pattern. Many iterations\nrun independently over several processes, and then their results are combined using some function.\nThe combination process is called a *reduction*, since it is generally tensor-rank-reducing: a\nvector of numbers is reduced to a single number, or a matrix is reduced to a single row or column,\netc. In code, this typically looks like the pattern `x = f(x,v[i])`, where `x` is the accumulator,\n`f` is the reduction function, and the `v[i]` are the elements being reduced. It is desirable\nfor `f` to be associative, so that it does not matter what order the operations are performed\nin.\n-->前面的代码中，调用count_heads的方式可以被抽象出来，之前我们显式地调用了两次@spawn，这将并行计算限制在了两个进程上，为了将并行计算扩展到任意多进程，可以使用parallel for loop这种形式，在Julia中可以用@distributed宏来实现：<!--\nNotice that our use of this pattern with `count_heads` can be generalized. We used two explicit\n[`@spawn`](@ref) statements, which limits the parallelism to two processes. To run on any number\nof processes, we can use a *parallel for loop*, running in distributed memory, which can be written\nin Julia using [`@distributed`](@ref) like this:\n-->nheads = @distributed (+) for i = 1:200000000\n    Int(rand(Bool))\nend上面的写法将多次迭代分配到了不同的线程，然后通过一个聚合函数（这里是(+)）合并计算结果，其中，每次迭代的结果作为for循环中的表达式的结果，最后整个循环的结果聚合后得到最终的结果。<!--\nThis construct implements the pattern of assigning iterations to multiple processes, and combining\nthem with a specified reduction (in this case `(+)`). The result of each iteration is taken as\nthe value of the last expression inside the loop. The whole parallel loop expression itself evaluates\nto the final answer.\n-->注意，尽管这里for循环看起来跟串行的for循环差不多，实际表现完全不同。这里的迭代并没有特定的执行顺序，而且由于所有的迭代都在不同的进程中进行，其中变量的写入对全局来说不可见。所有并行的for循环中的变量都会复制并广播到每个进程。<!--\nNote that although parallel for loops look like serial for loops, their behavior is dramatically\ndifferent. In particular, the iterations do not happen in a specified order, and writes to variables\nor arrays will not be globally visible since iterations run on different processes. Any variables\nused inside the parallel loop will be copied and broadcast to each process.\n-->比如，下面这段代码并不会像你想要的那样执行：<!--\nFor example, the following code will not work as intended:\n-->a = zeros(100000)\n@distributed for i = 1:100000\n    a[i] = i\nend这段代码并不会把a的所有元素初始化，因为每个进程都会有一份a的拷贝，因此类似的for循环一定要避免。幸运的是，Shared Arrays可以用来突破这种限制：<!--\nThis code will not initialize all of `a`, since each process will have a separate copy of it.\nParallel for loops like these must be avoided. Fortunately, [Shared Arrays](@ref man-shared-arrays) can be used\nto get around this limitation:\n-->using SharedArrays\n\na = SharedArray{Float64}(10)\n@distributed for i = 1:10\n    a[i] = i\nend当然，对于for循环外面的变量来说，如果是只读的话，使用起来完全没问题：<!--\nUsing \"outside\" variables in parallel loops is perfectly reasonable if the variables are read-only:\n-->a = randn(1000)\n@distributed (+) for i = 1:100000\n    f(a[rand(1:end)])\nend这里每次迭代都会从共享给每个进程的向量a中随机选一个样本，然后用来计算f。<!--\nHere each iteration applies `f` to a randomly-chosen sample from a vector `a` shared by all processes.\n-->可以看到，如果不需要的话，聚合函数可以省略掉，此时，for循环会异步执行，将独立的任务发送给所有的进程，然后不用等待执行完成，而是立即返回一个Future数组，调用者可以在之后的某个时刻通过调用fetch来等待Future执行完成，或者通过在并行的for循环之前添加一个@sync，就像@sync @distributed for。<!--\nAs you could see, the reduction operator can be omitted if it is not needed. In that case, the\nloop executes asynchronously, i.e. it spawns independent tasks on all available workers and returns\nan array of [`Future`](@ref) immediately without waiting for completion. The caller can wait for\nthe [`Future`](@ref) completions at a later point by calling [`fetch`](@ref) on them, or wait\nfor completion at the end of the loop by prefixing it with [`@sync`](@ref), like `@sync @distributed for`.\n-->在一些不需要聚合函数的情况下，我们可能只是像对某个范围内的整数应用一个函数(或者，更一般地，某个序列中的所有元素)，这种操作称作并行的map，在Julia中有一个对应的函数pmap。例如，可以像下面这样计算一些随机大矩阵的奇异值：<!--\nIn some cases no reduction operator is needed, and we merely wish to apply a function to all integers\nin some range (or, more generally, to all elements in some collection). This is another useful\noperation called *parallel map*, implemented in Julia as the [`pmap`](@ref) function. For example,\nwe could compute the singular values of several large random matrices in parallel as follows:\n-->julia> M = Matrix{Float64}[rand(1000,1000) for i = 1:10];\n\njulia> pmap(svdvals, M);Julia中的pmap是被设计用来处理一些计算量比较复杂的函数的并行化的。与之对比的是，@distributed for是用来处理一些每次迭代计算都很轻量的计算，比如简单地对两个数求和。pmap 和 @distributed for都只会用到worker的进程。对于@distributed for而言，最后的聚合计算由发起者的进程完成。<!--\nJulia\'s [`pmap`](@ref) is designed for the case where each function call does a large amount\nof work. In contrast, `@distributed for` can handle situations where each iteration is tiny, perhaps\nmerely summing two numbers. Only worker processes are used by both [`pmap`](@ref) and `@distributed for`\nfor the parallel computation. In case of `@distributed for`, the final reduction is done on the calling\nprocess.\n-->"
},

{
    "location": "manual/parallel-computing/#远程引用和AbstractChannel-1",
    "page": "并行计算",
    "title": "远程引用和AbstractChannel",
    "category": "section",
    "text": "<!--\n## Remote References and AbstractChannels\n-->远程引用通常指某种AbstractChannel的实现。<!--\nRemote references always refer to an implementation of an `AbstractChannel`.\n-->一个具体的AbstractChannel（有点像Channel）需要将put!, take!, fetch, isready 和 wait都实现。通过Future引用的远程对象存储在一个Channel{Any}(1)中（容量为1，类型为Any）。<!--\nA concrete implementation of an `AbstractChannel` (like `Channel`), is required to implement\n[`put!`](@ref), [`take!`](@ref), [`fetch`](@ref), [`isready`](@ref) and [`wait`](@ref).\nThe remote object referred to by a [`Future`](@ref) is stored in a `Channel{Any}(1)`, i.e., a\n`Channel` of size 1 capable of holding objects of `Any` type.\n-->RemoteChannel可以被反复写入，可以指向任意大小和类型的channel（或者是任意AbstractChannel的实现）。<!--\n[`RemoteChannel`](@ref), which is rewritable, can point to any type and size of channels, or any\nother implementation of an `AbstractChannel`.\n-->RemoteChannel(f::Function, pid)()构造器可以构造一些引用，而这些引用指向的channel可以容纳多个某种具体类型的数据。其中f是将要在pid上执行的函数，其返回值必须是AbstractChannel类型。<!--\nThe constructor `RemoteChannel(f::Function, pid)()` allows us to construct references to channels\nholding more than one value of a specific type. `f` is a function executed on `pid` and it must\nreturn an `AbstractChannel`.\n-->例如，RemoteChannel(()->Channel{Int}(10), pid)会创建一个channel，其类型是Int，容量是10，这个channel存在于pid进程中。<!--\nFor example, `RemoteChannel(()->Channel{Int}(10), pid)`, will return a reference to a channel\nof type `Int` and size 10. The channel exists on worker `pid`.\n-->针对RemoteChannel的put!, take!, fetch, isready 和 wait方法会被重定向到其底层存储着channel的进程。<!--\nMethods [`put!`](@ref), [`take!`](@ref), [`fetch`](@ref), [`isready`](@ref) and [`wait`](@ref)\non a [`RemoteChannel`](@ref) are proxied onto the backing store on the remote process.\n-->因此，RemoteChannel可以用来引用用户自定义的AbstractChannel对象。在Examples repository中的dictchannel.jl文件中有一个简单的例子，其中使用了一个字典用于远端存储。<!--\n[`RemoteChannel`](@ref) can thus be used to refer to user implemented `AbstractChannel` objects.\nA simple example of this is provided in `dictchannel.jl` in the\n[Examples repository](https://github.com/JuliaArchive/Examples), which uses a dictionary as its\nremote store.\n-->"
},

{
    "location": "manual/parallel-computing/#Channel-和-RemoteChannel-1",
    "page": "并行计算",
    "title": "Channel 和 RemoteChannel",
    "category": "section",
    "text": "<!--\n## Channels and RemoteChannels\n-->一个Channel仅对局部的进程可见，worker 2无法直接访问worker 3上的Channel，反之亦如此。不过RemoteChannel可以跨worker获取和写入数据。\nRemoteChannel可以看作是对Channel的封装。\nRemoteChannel的pid就是其封装的channel所在的进程id。\n任意拥有RemoteChannel引用的进程都可以对其进行读写，数据会自动发送到RemoteChannel底层channel的进程（或从中获取数据）\n序列化Channel会将其中的所有数据也都序列化，因此反序列化的时候也就可以得到一个原始数据的拷贝。\n不过，对RemoteChannel的序列化则只会序列化其底层指向的channel的id，因此反序列化之后得到的对象仍然会指向之前存储的对象。<!--\n  * A [`Channel`](@ref) is local to a process. Worker 2 cannot directly refer to a `Channel` on worker 3 and\n    vice-versa. A [`RemoteChannel`](@ref), however, can put and take values across workers.\n  * A [`RemoteChannel`](@ref) can be thought of as a *handle* to a `Channel`.\n  * The process id, `pid`, associated with a [`RemoteChannel`](@ref) identifies the process where\n    the backing store, i.e., the backing `Channel` exists.\n  * Any process with a reference to a [`RemoteChannel`](@ref) can put and take items from the channel.\n    Data is automatically sent to (or retrieved from) the process a [`RemoteChannel`](@ref) is associated\n    with.\n  * Serializing  a `Channel` also serializes any data present in the channel. Deserializing it therefore\n    effectively makes a copy of the original object.\n  * On the other hand, serializing a [`RemoteChannel`](@ref) only involves the serialization of an\n    identifier that identifies the location and instance of `Channel` referred to by the handle. A\n    deserialized [`RemoteChannel`](@ref) object (on any worker), therefore also points to the same\n    backing store as the original.\n-->前面channel的例子可以稍作修改之后，用于进程之间的通信，具体看下面的例子。<!--\nThe channels example from above can be modified for interprocess communication,\nas shown below.\n-->首先，起4个worker进程处理同一个remote channel jobs，其中的每个job都有一个对应的job_id，然后每个task读取一个job_id，然后模拟随机等待一段时间，然后往存储结果的RemoteChannel中写入一个Tuple对象，其中包含job_id和等待的时间。最后将结果打印出来。<!--\nWe start 4 workers to process a single `jobs` remote channel. Jobs, identified by an id (`job_id`),\nare written to the channel. Each remotely executing task in this simulation reads a `job_id`,\nwaits for a random amount of time and writes back a tuple of `job_id`, time taken and its own\n`pid` to the results channel. Finally all the `results` are printed out on the master process.\n-->julia> addprocs(4); # add worker processes\n\njulia> const jobs = RemoteChannel(()->Channel{Int}(32));\n\njulia> const results = RemoteChannel(()->Channel{Tuple}(32));\n\njulia> @everywhere function do_work(jobs, results) # define work function everywhere\n           while true\n               job_id = take!(jobs)\n               exec_time = rand()\n               sleep(exec_time) # simulates elapsed time doing actual work\n               put!(results, (job_id, exec_time, myid()))\n           end\n       end\n\njulia> function make_jobs(n)\n           for i in 1:n\n               put!(jobs, i)\n           end\n       end;\n\njulia> n = 12;\n\njulia> @async make_jobs(n); # feed the jobs channel with \"n\" jobs\n\njulia> for p in workers() # start tasks on the workers to process requests in parallel\n           remote_do(do_work, p, jobs, results)\n       end\n\njulia> @elapsed while n > 0 # print out results\n           job_id, exec_time, where = take!(results)\n           println(\"$job_id finished in $(round(exec_time,2)) seconds on worker $where\")\n           n = n - 1\n       end\n1 finished in 0.18 seconds on worker 4\n2 finished in 0.26 seconds on worker 5\n6 finished in 0.12 seconds on worker 4\n7 finished in 0.18 seconds on worker 4\n5 finished in 0.35 seconds on worker 5\n4 finished in 0.68 seconds on worker 2\n3 finished in 0.73 seconds on worker 3\n11 finished in 0.01 seconds on worker 3\n12 finished in 0.02 seconds on worker 3\n9 finished in 0.26 seconds on worker 5\n8 finished in 0.57 seconds on worker 4\n10 finished in 0.58 seconds on worker 2\n0.055971741"
},

{
    "location": "manual/parallel-computing/#远程调用和分布式垃圾回收-1",
    "page": "并行计算",
    "title": "远程调用和分布式垃圾回收",
    "category": "section",
    "text": "<!--\n## Remote References and Distributed Garbage Collection\n-->远程引用所指向的对象可以在其所有引用都被集群删除之后被释放掉。<!--\nObjects referred to by remote references can be freed only when *all* held references\nin the cluster are deleted.\n-->存储具体值的节点会记录哪些worker已经引用了它。每当某个RemoteChannel或某个（还没被获取的）Future序列化到一个worker中时，会通知相应的节点。而且每当某个RemoteChannel或某个（还没被获取的）Future被本地的垃圾回收器回收的时候，相应的节点也会收到通知。所有这些都是通过一个集群内部序列化器实现的，而所有的远程引用都只有在运行中的集群才有效，目前序列化和反序列化到IO暂时还不支持。<!--\nThe node where the value is stored keeps track of which of the workers have a reference to it.\nEvery time a [`RemoteChannel`](@ref) or a (unfetched) [`Future`](@ref) is serialized to a worker,\nthe node pointed to by the reference is notified. And every time a [`RemoteChannel`](@ref) or\na (unfetched) [`Future`](@ref) is garbage collected locally, the node owning the value is again\nnotified. This is implemented in an internal cluster aware serializer. Remote references are only\nvalid in the context of a running cluster. Serializing and deserializing references to and from\nregular `IO` objects is not supported.\n-->上面说到的通知都是通过发送\"跟踪\"信息来实现的，当一个引用被序列化的时候，就会发送\"添加引用\"的信息，而一个引用被本地的垃圾回收器回收的时候，就会发送一个\"删除引用\"的信息。<!--\nThe notifications are done via sending of \"tracking\" messages--an \"add reference\" message when\na reference is serialized to a different process and a \"delete reference\" message when a reference\nis locally garbage collected.\n-->由于Future是一次写入然后换成在本地，因此fetch一个Future会向拥有该值的节点发送更新引用的跟踪信息。<!--\nSince [`Future`](@ref)s are write-once and cached locally, the act of [`fetch`](@ref)ing a\n[`Future`](@ref) also updates reference tracking information on the node owning the value.\n-->一旦指向某个值的引用都被删除了，对应的节点会将其释放。<!--\nThe node which owns the value frees it once all references to it are cleared.\n-->对于Future来说，序列化一个已经获取了值的Future到另外一个节点时，会将其值也一并序列化过去，因为原始的远端的值可能已经被回收释放了。<!--\nWith [`Future`](@ref)s, serializing an already fetched [`Future`](@ref) to a different node also\nsends the value since the original remote store may have collected the value by this time.\n-->此外需要注意的是，本地的垃圾回收到底发生在什么时候取决于具体对象的大小以及当时系统的内存压力。<!--\nIt is important to note that *when* an object is locally garbage collected depends on the size\nof the object and the current memory pressure in the system.\n-->对于远端引用，其引用本身的大小很小，不过在远端节点存储着的值可能相当大。由于本地的对象并不会立即被回收，于是一个比较好的做法是，对本地的RemoteChannel或者是还没获取值的Future执行finalize。对于已经获取了值的Future来说，由于已经在调用fetch的时候已经将引用删除了，因此就不必再finalize了。显式地调用finalize会立即向远端节点发送信息并删除其引用。<!--\nIn case of remote references, the size of the local reference object is quite small, while the\nvalue stored on the remote node may be quite large. Since the local object may not be collected\nimmediately, it is a good practice to explicitly call [`finalize`](@ref) on local instances\nof a [`RemoteChannel`](@ref), or on unfetched [`Future`](@ref)s. Since calling [`fetch`](@ref)\non a [`Future`](@ref) also removes its reference from the remote store, this is not required on\nfetched [`Future`](@ref)s. Explicitly calling [`finalize`](@ref) results in an immediate message\nsent to the remote node to go ahead and remove its reference to the value.\n-->一旦执行了finalize之后，引用就不可用了。<!--\nOnce finalized, a reference becomes invalid and cannot be used in any further calls.\n-->"
},

{
    "location": "manual/parallel-computing/#man-shared-arrays-1",
    "page": "并行计算",
    "title": "共享数组",
    "category": "section",
    "text": "<!--\n## [Shared Arrays](@id man-shared-arrays)\n-->共享数组使用系统共享内存将数组映射到多个进程上，尽管和DArray有点像，但其实际表现有很大不同。在DArray中，每个进程可以访问数据中的一块，但任意两个进程都不能共享同一块数据，而对于SharedArray，每个进程都可以访问整个数组。如果你想在一台机器上，让一大块数据能够被多个进程访问到，那么SharedArray是个不错的选择。<!--\nShared Arrays use system shared memory to map the same array across many processes. While there\nare some similarities to a [`DArray`](https://github.com/JuliaParallel/DistributedArrays.jl), the\nbehavior of a [`SharedArray`](@ref) is quite different. In a [`DArray`](https://github.com/JuliaParallel/DistributedArrays.jl),\neach process has local access to just a chunk of the data, and no two processes share the same\nchunk; in contrast, in a [`SharedArray`](@ref) each \"participating\" process has access to the\nentire array.  A [`SharedArray`](@ref) is a good choice when you want to have a large amount of\ndata jointly accessible to two or more processes on the same machine.\n-->共享数组由SharedArray提供，必须在所有相关的worker中都显式地加载。<!--\nShared Array support is available via module `SharedArrays` which must be explicitly loaded on\nall participating workers.\n-->对SharedArray索引（访问和复制）操作就跟普通的数组一样，由于底层的内存对本地的进程是可见的，索引的效率很高，因此大多数单进程上的算法对SharedArray来说都是适用的，除非某些算法必须使用Array类型（此时可以通过调用sdata来获取SharedArray数组）。对于其它类型的AbstractArray类型数组来说，sdata仅仅会返回数组本身，因此，可以放心地使用sdata对任意类型的Array进行操作。<!--\n[`SharedArray`](@ref) indexing (assignment and accessing values) works just as with regular arrays,\nand is efficient because the underlying memory is available to the local process. Therefore,\nmost algorithms work naturally on [`SharedArray`](@ref)s, albeit in single-process mode. In cases\nwhere an algorithm insists on an [`Array`](@ref) input, the underlying array can be retrieved\nfrom a [`SharedArray`](@ref) by calling [`sdata`](@ref). For other `AbstractArray` types, [`sdata`](@ref)\njust returns the object itself, so it\'s safe to use [`sdata`](@ref) on any `Array`-type object.\n-->共享数组可以通过以下形式构造:<!--\nThe constructor for a shared array is of the form:\n-->SharedArray{T,N}(dims::NTuple; init=false, pids=Int[])上面的代码会创建一个N维，类型为T，大小为dims的共享数组，通过pids指定可见的进程。与分布式数组不同的是，只有通过pids指定的worker才可见。<!--\nwhich creates an `N`-dimensional shared array of a bits type `T` and size `dims` across the processes specified\nby `pids`. Unlike distributed arrays, a shared array is accessible only from those participating\nworkers specified by the `pids` named argument (and the creating process too, if it is on the\nsame host).\n-->如果提供了一个类型为initfn(S::SharedArray)的init函数，那么所有相关的worker都会调用它。你可以让每个worker都在共享数组不同的地方执行init函数，从而实现并行初始化。<!--\nIf an `init` function, of signature `initfn(S::SharedArray)`, is specified, it is called on all\nthe participating workers. You can specify that each worker runs the `init` function on a distinct\nportion of the array, thereby parallelizing initialization.\n-->下面是个例子：<!--\nHere\'s a brief example:\n-->julia> using Distributed\n\njulia> addprocs(3)\n3-element Array{Int64,1}:\n 2\n 3\n 4\n\njulia> @everywhere using SharedArrays\n\njulia> S = SharedArray{Int,2}((3,4), init = S -> S[localindices(S)] = myid())\n3×4 SharedArray{Int64,2}:\n 2  2  3  4\n 2  3  3  4\n 2  3  4  4\n\njulia> S[3,2] = 7\n7\n\njulia> S\n3×4 SharedArray{Int64,2}:\n 2  2  3  4\n 2  3  3  4\n 2  7  4  4SharedArrays.localindices提供了一个以为的切片，可以很方便地用来将task分配到各个进程上。当然你可以按你想要的方式做区分：<!--\n[`SharedArrays.localindices`](@ref) provides disjoint one-dimensional ranges of indices, and is sometimes\nconvenient for splitting up tasks among processes. You can, of course, divide the work any way\nyou wish:\n-->julia> S = SharedArray{Int,2}((3,4), init = S -> S[indexpids(S):length(procs(S)):length(S)] = myid())\n3×4 SharedArray{Int64,2}:\n 2  2  2  2\n 3  3  3  3\n 4  4  4  4由于所有的进程都能够访问底层的数据，因此一定要小心避免出现冲突：<!--\nSince all processes have access to the underlying data, you do have to be careful not to set up\nconflicts. For example:\n-->@sync begin\n    for p in procs(S)\n        @async begin\n            remotecall_wait(fill!, p, S, p)\n        end\n    end\nend上面的代码会导致不确定的结果，因为每个进程都将整个数组赋值为其pid，从而导致最后一个执行完成的进程会保留其pid。<!--\nwould result in undefined behavior. Because each process fills the *entire* array with its own\n`pid`, whichever process is the last to execute (for any particular element of `S`) will have\nits `pid` retained.\n-->考虑更复杂的一种情况：<!--\nAs a more extended and complex example, consider running the following \"kernel\" in parallel:\n-->q[i,j,t+1] = q[i,j,t] + u[i,j,t]这个例子中，如果首先将任务用按照一维的索引作区分，那么就会出问题：如果q[i,j,t]位于分配给某个worker的最后一个位置，而q[i,j,t+1]位于下一个worker的开始位置，那么后面这个worker开始计算的时候，可能q[i,j,t]还没有准备好，这时候，更好的做法是，手动分区，比如可以定义一个函数，按照(irange,jrange)给每个worker分配任务。<!--\nIn this case, if we try to split up the work using a one-dimensional index, we are likely to run\ninto trouble: if `q[i,j,t]` is near the end of the block assigned to one worker and `q[i,j,t+1]`\nis near the beginning of the block assigned to another, it\'s very likely that `q[i,j,t]` will\nnot be ready at the time it\'s needed for computing `q[i,j,t+1]`. In such cases, one is better\noff chunking the array manually. Let\'s split along the second dimension.\nDefine a function that returns the `(irange, jrange)` indices assigned to this worker:\n-->julia> @everywhere function myrange(q::SharedArray)\n           idx = indexpids(q)\n           if idx == 0 # This worker is not assigned a piece\n               return 1:0, 1:0\n           end\n           nchunks = length(procs(q))\n           splits = [round(Int, s) for s in range(0, stop=size(q,2), length=nchunks+1)]\n           1:size(q,1), splits[idx]+1:splits[idx+1]\n       end然后定义计算内核：<!--\nNext, define the kernel:\n-->julia> @everywhere function advection_chunk!(q, u, irange, jrange, trange)\n           @show (irange, jrange, trange)  # display so we can see what\'s happening\n           for t in trange, j in jrange, i in irange\n               q[i,j,t+1] = q[i,j,t] + u[i,j,t]\n           end\n           q\n       end然后定义一个wrapper：<!--\nWe also define a convenience wrapper for a `SharedArray` implementation\n-->julia> @everywhere advection_shared_chunk!(q, u) =\n           advection_chunk!(q, u, myrange(q)..., 1:size(q,3)-1)接下来，比较三个不同的版本，第一个是单进程版本：<!--\nNow let\'s compare three different versions, one that runs in a single process:\n-->julia> advection_serial!(q, u) = advection_chunk!(q, u, 1:size(q,1), 1:size(q,2), 1:size(q,3)-1);然后是使用@distributed:<!--\none that uses [`@distributed`](@ref):\n-->julia> function advection_parallel!(q, u)\n           for t = 1:size(q,3)-1\n               @sync @distributed for j = 1:size(q,2)\n                   for i = 1:size(q,1)\n                       q[i,j,t+1]= q[i,j,t] + u[i,j,t]\n                   end\n               end\n           end\n           q\n       end;最后是使用分区：<!--\nand one that delegates in chunks:\n-->julia> function advection_shared!(q, u)\n           @sync begin\n               for p in procs(q)\n                   @async remotecall_wait(advection_shared_chunk!, p, q, u)\n               end\n           end\n           q\n       end;如果创建好了SharedArray之后，计算这些函数的执行时间，那么可以得到以下结果（用julia -p 4启动）：<!--\nIf we create `SharedArray`s and time these functions, we get the following results (with `julia -p 4`):\n-->julia> q = SharedArray{Float64,3}((500,500,500));\n\njulia> u = SharedArray{Float64,3}((500,500,500));先执行一次以便JIT编译，然后用@time宏测试其第二次执行的时间：<!--\nRun the functions once to JIT-compile and [`@time`](@ref) them on the second run:\n-->julia> @time advection_serial!(q, u);\n(irange,jrange,trange) = (1:500,1:500,1:499)\n 830.220 milliseconds (216 allocations: 13820 bytes)\n\njulia> @time advection_parallel!(q, u);\n   2.495 seconds      (3999 k allocations: 289 MB, 2.09% gc time)\n\njulia> @time advection_shared!(q,u);\n        From worker 2:       (irange,jrange,trange) = (1:500,1:125,1:499)\n        From worker 4:       (irange,jrange,trange) = (1:500,251:375,1:499)\n        From worker 3:       (irange,jrange,trange) = (1:500,126:250,1:499)\n        From worker 5:       (irange,jrange,trange) = (1:500,376:500,1:499)\n 238.119 milliseconds (2264 allocations: 169 KB)这里advection_shared!最大的优势在于，最小程度地降低了woker之间的通信，从而让每个worker能针对被分配的部分持续地计算一段时间。<!--\nThe biggest advantage of `advection_shared!` is that it minimizes traffic among the workers, allowing\neach to compute for an extended time on the assigned piece.\n-->"
},

{
    "location": "manual/parallel-computing/#共享数组与分布式垃圾回收-1",
    "page": "并行计算",
    "title": "共享数组与分布式垃圾回收",
    "category": "section",
    "text": "<!--\n## Shared Arrays and Distributed Garbage Collection\n-->和远程引用一样，共享数组也依赖于创建节点上的垃圾回收来释放所有参与的worker上的引用。因此，创建大量生命周期比较短的数组，并尽可能快地显式finilize这些对象，代码会更高效，这样与之对用的内存和文件句柄都会更快地释放。<!--\nLike remote references, shared arrays are also dependent on garbage collection on the creating\nnode to release references from all participating workers. Code which creates many short lived\nshared array objects would benefit from explicitly finalizing these objects as soon as possible.\nThis results in both memory and file handles mapping the shared segment being released sooner.\n-->"
},

{
    "location": "manual/parallel-computing/#集群管理器（ClusterManagers）-1",
    "page": "并行计算",
    "title": "集群管理器（ClusterManagers）",
    "category": "section",
    "text": "<!--\n## ClusterManagers\n-->Julia通过集群管理器实现对多个进程（所构成的逻辑上的集群）的启动，管理以及网络通信。一个ClusterManager负责：在一个集群环境中启动worker进程\n管理每个worker生命周期内的事件\n（可选），提供数据传输<!--\nThe launching, management and networking of Julia processes into a logical cluster is done via\ncluster managers. A `ClusterManager` is responsible for\n--><!--\n  * launching worker processes in a cluster environment\n  * managing events during the lifetime of each worker\n  * optionally, providing data transport\n-->一个Julia集群由以下特点：初始进程，称为master,其id为1\n只有master进程可以增加或删除worker进程\n所有进程之间都可以直接通信<!--\nA Julia cluster has the following characteristics:\n--><!--\n  * The initial Julia process, also called the `master`, is special and has an `id` of 1.\n  * Only the `master` process can add or remove worker processes.\n  * All processes can directly communicate with each other.\n-->worker之间的连接（用的是内置的TCP/IP传输）按照以下方式进行：master进程对一个ClusterManager对象调用addprocs\naddprocs调用对应的launch方法，然后在对应的机器上启动相应数量的worker进程\n每个worker监听一个端口，然后将其host和port信息传给stdout\n集群管理器捕获stdout中每个worker的信息，并提供给master进程\nmaster进程解析信息并与相应的worker建立TCP/IP连接\n每个worker都会被通知集群中的其它worker\n每个worker与id小于自己的worker连接\n这样，一个网络就建立了，从而，每个worker都可以与其它worker建立连接<!--\nConnections between workers (using the in-built TCP/IP transport) is established in the following\nmanner:\n--><!--\n  * [`addprocs`](@ref) is called on the master process with a `ClusterManager` object.\n  * [`addprocs`](@ref) calls the appropriate [`launch`](@ref) method which spawns required number\n    of worker processes on appropriate machines.\n  * Each worker starts listening on a free port and writes out its host and port information to [`stdout`](@ref).\n  * The cluster manager captures the [`stdout`](@ref) of each worker and makes it available to the\n    master process.\n  * The master process parses this information and sets up TCP/IP connections to each worker.\n  * Every worker is also notified of other workers in the cluster.\n  * Each worker connects to all workers whose `id` is less than the worker\'s own `id`.\n  * In this way a mesh network is established, wherein every worker is directly connected with every\n    other worker.\n-->尽管默认的传输层使用的是TCPSocket，对于一个自定义的集群管理器来说，完全可以使用其它传输方式。<!--\nWhile the default transport layer uses plain [`TCPSocket`](@ref), it is possible for a Julia cluster to\nprovide its own transport.\n-->Julia提供了两种内置的集群管理器：<!--\nJulia provides two in-built cluster managers:\n-->LocalManager, 调用addprocs() 或 addprocs(np::Integer)时会用到。\nSSHManager，调用addprocs(hostnames::Array)时，传递一个hostnames的列表。<!--\n  * `LocalManager`, used when [`addprocs()`](@ref) or [`addprocs(np::Integer)`](@ref) are called\n  * `SSHManager`, used when [`addprocs(hostnames::Array)`](@ref) is called with a list of hostnames\n-->LocalManager用来在同一个host上启动多个worker，从而利用多核/多处理器硬件。<!--\n`LocalManager` is used to launch additional workers on the same host, thereby leveraging multi-core\nand multi-processor hardware.\n-->因此，一个最小的集群管理器需要：是一个ClusterManager抽象类的一个子类\n实现launch接口，用来启动新的worker\n实现manage，在一个worker的生命周期中多次被调用（例如，发送中断信号）<!--\nThus, a minimal cluster manager would need to:\n--><!--\n  * be a subtype of the abstract `ClusterManager`\n  * implement [`launch`](@ref), a method responsible for launching new workers\n  * implement [`manage`](@ref), which is called at various events during a worker\'s lifetime (for\n    example, sending an interrupt signal)\n-->addprocs(manager::FooManager) 需要 FooManager 实现：<!--\n[`addprocs(manager::FooManager)`](@ref addprocs) requires `FooManager` to implement:\n-->function launch(manager::FooManager, params::Dict, launched::Array, c::Condition)\n    [...]\nend\n\nfunction manage(manager::FooManager, id::Integer, config::WorkerConfig, op::Symbol)\n    [...]\nend作为一个例子，我们来看下LocalManager是怎么实现的：<!--\nAs an example let us see how the `LocalManager`, the manager responsible for starting workers\non the same host, is implemented:\n-->struct LocalManager <: ClusterManager\n    np::Integer\nend\n\nfunction launch(manager::LocalManager, params::Dict, launched::Array, c::Condition)\n    [...]\nend\n\nfunction manage(manager::LocalManager, id::Integer, config::WorkerConfig, op::Symbol)\n    [...]\nendlaunch方法接收以下参数：<!--\nThe [`launch`](@ref) method takes the following arguments:\n-->manager::ClusterManager: 调用addprocs时所用到的集群管理器\nparams::Dict: 所有的关键字参数都会传递到addprocs中\nlaunched::Array: 用来存储一个或多个WorkerConfig\nc::Condition: 在workers启动后被通知的条件变量<!--\n  * `manager::ClusterManager`: the cluster manager that [`addprocs`](@ref) is called with\n  * `params::Dict`: all the keyword arguments passed to [`addprocs`](@ref)\n  * `launched::Array`: the array to append one or more `WorkerConfig` objects to\n  * `c::Condition`: the condition variable to be notified as and when workers are launched\n-->launch会在一个异步的task中调用，该task结束之后，意味着所有请求的worker都已经启动好了。因此，launch函数必须在所有worker启动之后，尽快退出。<!--\nThe [`launch`](@ref) method is called asynchronously in a separate task. The termination of\nthis task signals that all requested workers have been launched. Hence the [`launch`](@ref)\nfunction MUST exit as soon as all the requested workers have been launched.\n-->新启动的worker之间采用的是多对多的连接方式。在命令行中指定参数--worker[=<cookie>]会让所有启动的进程把自己当作worker，然后通过TCP/IP构建连接。<!--\nNewly launched workers are connected to each other and the master process in an all-to-all manner.\nSpecifying the command line argument `--worker[=<cookie>]` results in the launched processes\ninitializing themselves as workers and connections being set up via TCP/IP sockets.\n-->集群中所有的worker默认使用同一个master的cookie。如果cookie没有指定，（比如没有通过--worker指定），那么worker会尝试从它的标准输入中读取。LocalManager和SSHManager都是通过标准输入来将cookie传递给新启动的worker。<!--\nAll workers in a cluster share the same [cookie](@ref man-cluster-cookie) as the master. When the cookie is\nunspecified, i.e, with the `--worker` option, the worker tries to read it from its standard input.\n `LocalManager` and `SSHManager` both pass the cookie to newly launched workers via their\n standard inputs.\n-->默认情况下，一个worker会监听从getipaddr()函数返回的地址上的一个开放端口。若要指定监听的地址，可以通过额外的参数--bind-to bind_addr[:port]指定，这对于多host的情况来说很方便。<!--\nBy default a worker will listen on a free port at the address returned by a call to [`getipaddr()`](@ref).\nA specific address to listen on may be specified by optional argument `--bind-to bind_addr[:port]`.\nThis is useful for multi-homed hosts.\n-->对于非TCP/IP传输，可以选择MPI作为一种实现，此时一定不要指定--worker参数，另外，新启动的worker必须调用init_worker(cookie)之后再使用并行的结构体。<!--\nAs an example of a non-TCP/IP transport, an implementation may choose to use MPI, in which case\n`--worker` must NOT be specified. Instead, newly launched workers should call `init_worker(cookie)`\nbefore using any of the parallel constructs.\n-->对于每个已经启动的worker，launch方法必须往launched中添加一个WorkerConfig对象（相应的值已经初始化）。<!--\nFor every worker launched, the [`launch`](@ref) method must add a `WorkerConfig` object (with\nappropriate fields initialized) to `launched`\n-->mutable struct WorkerConfig\n    # Common fields relevant to all cluster managers\n    io::Union{IO, Nothing}\n    host::Union{AbstractString, Nothing}\n    port::Union{Integer, Nothing}\n\n    # Used when launching additional workers at a host\n    count::Union{Int, Symbol, Nothing}\n    exename::Union{AbstractString, Cmd, Nothing}\n    exeflags::Union{Cmd, Nothing}\n\n    # External cluster managers can use this to store information at a per-worker level\n    # Can be a dict if multiple fields need to be stored.\n    userdata::Any\n\n    # SSHManager / SSH tunnel connections to workers\n    tunnel::Union{Bool, Nothing}\n    bind_addr::Union{AbstractString, Nothing}\n    sshflags::Union{Cmd, Nothing}\n    max_parallel::Union{Integer, Nothing}\n\n    # Used by Local/SSH managers\n    connect_at::Any\n\n    [...]\nendWorkerConfig中的大多数字段都是内置的集群管理器会用到，对于自定义的管理器，通常只需要指定io或host/port:<!--\nMost of the fields in `WorkerConfig` are used by the inbuilt managers. Custom cluster managers\nwould typically specify only `io` or `host` / `port`:\n-->如果指定了io，那么就会用来读取host/port信息。每个worker会在启动时打印地址和端口，这样worker就可以自由监听可用的端口，而不必手动配置worker的端口。\n如果io没有指定，那么host和port就会用来连接。\ncount， exename和exeflags用于从一个worker上启动额外的worker。例如，一个集群管理器可能对每个节点都只启动一个worker，然后再用它来启动额外的worker。\ncount 可以是一个整数n，用来指定启动n个worker\ncount 还可以是:auto，用来启动跟那台机器上CPU个数（逻辑上的核的个数）相同的worker\nexename是julia可执行文件的全路径\nexeflags应该设置成传递给将要启动的worker命令行参数\ntunnel, bind_addr, sshflags和max_parallel会在从worker与master进程建立ssh隧道时用到\nuserdata用来提供给自定义集群管理器存储自己的worker相关的信息<!--\n  * If `io` is specified, it is used to read host/port information. A Julia worker prints out its\n    bind address and port at startup. This allows Julia workers to listen on any free port available\n    instead of requiring worker ports to be configured manually.\n  * If `io` is not specified, `host` and `port` are used to connect.\n  * `count`, `exename` and `exeflags` are relevant for launching additional workers from a worker.\n    For example, a cluster manager may launch a single worker per node, and use that to launch additional\n    workers.\n--><!--\n      * `count` with an integer value `n` will launch a total of `n` workers.\n      * `count` with a value of `:auto` will launch as many workers as the number of CPU threads (logical cores) on that machine.\n      * `exename` is the name of the `julia` executable including the full path.\n      * `exeflags` should be set to the required command line arguments for new workers.\n  * `tunnel`, `bind_addr`, `sshflags` and `max_parallel` are used when a ssh tunnel is required to\n    connect to the workers from the master process.\n  * `userdata` is provided for custom cluster managers to store their own worker-specific information.\n-->manage(manager::FooManager, id::Integer, config::WorkerConfig, op::Symbol)会在一个worker生命周期中的不同时刻被调用，其中op的值可能是：<!--\n`manage(manager::FooManager, id::Integer, config::WorkerConfig, op::Symbol)` is called at different\ntimes during the worker\'s lifetime with appropriate `op` values:\n-->:register/:deregister，从Julia的worker池子中添加/删除一个worker\n:interrupt，当interrupt(workers)被调用是，此时，ClusterManager应该给相应的worker发送终端信号\n:finalize，用于清理操作。<!--\n  * with `:register`/`:deregister` when a worker is added / removed from the Julia worker pool.\n  * with `:interrupt` when `interrupt(workers)` is called. The `ClusterManager` should signal the\n    appropriate worker with an interrupt signal.\n  * with `:finalize` for cleanup purposes.\n-->"
},

{
    "location": "manual/parallel-computing/#自定义集群管理器的传输方式-1",
    "page": "并行计算",
    "title": "自定义集群管理器的传输方式",
    "category": "section",
    "text": "<!--\n## Cluster Managers with Custom Transports\n-->将默认的 TCP/IP 多对多 socket 连接替换成一个自定义的传输层需要做很多工作。每个Julia进程都有与其连接的worker数量相同的通信task。例如，在一个有32个进程的多对多集群中：<!--\nReplacing the default TCP/IP all-to-all socket connections with a custom transport layer is a\nlittle more involved. Each Julia process has as many communication tasks as the workers it is\nconnected to. For example, consider a Julia cluster of 32 processes in an all-to-all mesh network:\n-->每个进程都有31个通信task\n每个task在一个消息处理循环中从一个远端worker读取所有的输入信息\n每个消息处理循环等待一个IO对象（比如，在默认实现中是一个TCPSocket），然后读取整个信息，处理，等待下一个\n发送消息则可以直接在任意Julia task中完成，而不只是通信task，同样，也是通过相应的IO对象<!--\n  * Each Julia process thus has 31 communication tasks.\n  * Each task handles all incoming messages from a single remote worker in a message-processing loop.\n  * The message-processing loop waits on an `IO` object (for example, a [`TCPSocket`](@ref) in the default\n    implementation), reads an entire message, processes it and waits for the next one.\n  * Sending messages to a process is done directly from any Julia task--not just communication tasks--again,\n    via the appropriate `IO` object.\n-->要替换默认的传输方式，需要新的实现能够在远程worker之间建立连接，同时提供一个可以用来被消息处理循环等待的IO对象。集群管理器的回调函数需要实现如下函数：<!--\nReplacing the default transport requires the new implementation to set up connections to remote\nworkers and to provide appropriate `IO` objects that the message-processing loops can wait on.\nThe manager-specific callbacks to be implemented are:\n-->connect(manager::FooManager, pid::Integer, config::WorkerConfig)\nkill(manager::FooManager, pid::Int, config::WorkerConfig)默认的实现（使用的是TCP/IP socket）是connect(manager::ClusterManager, pid::Integer, config::WorkerConfig)。<!--\nThe default implementation (which uses TCP/IP sockets) is implemented as `connect(manager::ClusterManager, pid::Integer, config::WorkerConfig)`.\n-->connect需要返回一对IO对象，一个用于从pidworker读取数据，另一个用于往pid写数据。自定义的集群管理器可以用内存中的BUfferStream作为一个管道将自定义的（很可能是非IO的）传输与Julia内置的并行基础设施衔接起来。<!--\n`connect` should return a pair of `IO` objects, one for reading data sent from worker `pid`, and\nthe other to write data that needs to be sent to worker `pid`. Custom cluster managers can use\nan in-memory `BufferStream` as the plumbing to proxy data between the custom, possibly non-`IO`\ntransport and Julia\'s in-built parallel infrastructure.\n-->BufferStream是一个内存中的IOBuffer，其表现很像IO，就是一个流（stream），可以异步地处理。<!--\nA `BufferStream` is an in-memory [`IOBuffer`](@ref) which behaves like an `IO`--it is a stream which can\nbe handled asynchronously.\n-->在Examples repository的clustermanager/0mq目录中，包含一个使用ZeroMQ连接Julia worker的例子，用的是星型拓补结构。需要注意的是：Julia的进程仍然是逻辑上相互连接的，任意worker都可以与其它worker直接相连而无需感知到0MQ作为传输层的存在。<!--\nThe folder `clustermanager/0mq` in the [Examples repository](https://github.com/JuliaArchive/Examples)\ncontains an example of using ZeroMQ to connect Julia workers\nin a star topology with a 0MQ broker in the middle. Note: The Julia processes are still all *logically*\nconnected to each other--any worker can message any other worker directly without any awareness\nof 0MQ being used as the transport layer.\n-->在使用自定义传输的时候：Julia的workers必须不能通过--worker启动。如果启动的时候使用了--worker，那么新启动的worker会默认使用基于TCP/IP socket的实现\n对于每个worker逻辑上的输入连接，必须调用Base.process_messages(rd::IO, wr::IO)()，这会创建一个新的task来处理worker消息的读写\ninit_worker(cookie, manager::FooManager)必须作为worker进程初始化的一部分呢被调用\nWorkerConfig中的connect_at::Any字段可以被集群管理器在调用launch的时候设置，该字段的值会发送到所有的connect回调中。通常，其中包含的是如何连接到一个worker的信息。例如，在TCP/IP socket传输中，用这个字段存储(host, port)来声明如何连接到一个worker。<!--\nWhen using custom transports:\n--><!--\n  * Julia workers must NOT be started with `--worker`. Starting with `--worker` will result in the\n    newly launched workers defaulting to the TCP/IP socket transport implementation.\n  * For every incoming logical connection with a worker, `Base.process_messages(rd::IO, wr::IO)()`\n    must be called. This launches a new task that handles reading and writing of messages from/to\n    the worker represented by the `IO` objects.\n  * `init_worker(cookie, manager::FooManager)` *must* be called as part of worker process initialization.\n  * Field `connect_at::Any` in `WorkerConfig` can be set by the cluster manager when [`launch`](@ref)\n    is called. The value of this field is passed in in all [`connect`](@ref) callbacks. Typically,\n    it carries information on *how to connect* to a worker. For example, the TCP/IP socket transport\n    uses this field to specify the `(host, port)` tuple at which to connect to a worker.\n-->kill(manager, pid, config)用来从一个集群中删除一个worker，在master进程中，对应的IO对象必须通过对应的实现来关闭，从而保证正确地释放资源。默认的实现简单地对指定的远端worker执行exit()即可。<!--\n`kill(manager, pid, config)` is called to remove a worker from the cluster. On the master process,\nthe corresponding `IO` objects must be closed by the implementation to ensure proper cleanup.\nThe default implementation simply executes an `exit()` call on the specified remote worker.\n-->在例子目录中，clustermanager/simple展示了一个简单地实现，使用的是UNIX下的socket。<!--\nThe Examples folder `clustermanager/simple` is an example that shows a simple implementation using UNIX domain\nsockets for cluster setup.\n-->"
},

{
    "location": "manual/parallel-computing/#LocalManager和SSHManager的网络要求-1",
    "page": "并行计算",
    "title": "LocalManager和SSHManager的网络要求",
    "category": "section",
    "text": "<!--\n## Network Requirements for LocalManager and SSHManager\n-->Julia集群设计的时候，默认是在一个安全的环境中执行，比如本地的笔记本，部门的集群，甚至是云端。这部分将介绍LocalManager和SSHManager的网络安全要点：<!--\nJulia clusters are designed to be executed on already secured environments on infrastructure such\nas local laptops, departmental clusters, or even the cloud. This section covers network security\nrequirements for the inbuilt `LocalManager` and `SSHManager`:\n-->master进程不监听任何端口，它只负责向外连接worker\n每个worker都只绑定一个本地的接口，同时监听一个系统分配的临时端口\naddprocs(N)使用的LocalManager，默认只会绑定到回环接口（loopback interface），这就意味着，之后在远程主机上（恶意）启动的worker无法连接到集群中，在执行addprocs(4)之后，又跟一个addprocs([\"remote_host\"])会失败。有些用户可能希望创建一个集群同时管理本地系统和几个远端系统，这可以通过在绑定LocalManager到外部网络接口的时候，指定一个restrict参数：addprocs(4; restrict=false)\naddprocs(list_of_remote_hosts)使用的SSHManager，通过SSH在远程主机上启动worker，后续的master-worker，worker-worker之间的连接使用普通未加密的TCP/IP socket。远程主机必须开启无密码登陆，额外的ssh参数可以通过sshflags指定。\n如果想要通过SSH连接master-worker，那么用addprocs(list_of_remote_hosts; tunnel=true, sshflags=<ssh keys and other flags>)就可以很容易地实现。一个典型的应用场景是，本地的笔记本运行着Julia的REPL(也就是master)，其它的机器在云端（比方说Amazon的EC2），此时远端的机器只需要开放22端口，通过公钥认证即可（PKI）。认证信息可以通过sshflags配置，如 sshflags=`-e <keyfile>`在一个（默认的）多对多的拓补结构中，所有的worker通过TCP socket连接到其它worker，因而集群中节点的安全策略必须保证worker在某个端口范围内能自由连接（根据操作系统的不同会有所不同）。   可以通过自定义ClusterManager实现worker-worker之间通信的加密和解密。<!--\n  * The master process does not listen on any port. It only connects out to the workers.\n  * Each worker binds to only one of the local interfaces and listens on an ephemeral port number\n    assigned by the OS.\n  * `LocalManager`, used by `addprocs(N)`, by default binds only to the loopback interface. This means\n    that workers started later on remote hosts (or by anyone with malicious intentions) are unable\n    to connect to the cluster. An `addprocs(4)` followed by an `addprocs([\"remote_host\"])` will fail.\n    Some users may need to create a cluster comprising their local system and a few remote systems.\n    This can be done by explicitly requesting `LocalManager` to bind to an external network interface\n    via the `restrict` keyword argument: `addprocs(4; restrict=false)`.\n  * `SSHManager`, used by `addprocs(list_of_remote_hosts)`, launches workers on remote hosts via SSH.\n    By default SSH is only used to launch Julia workers. Subsequent master-worker and worker-worker\n    connections use plain, unencrypted TCP/IP sockets. The remote hosts must have passwordless login\n    enabled. Additional SSH flags or credentials may be specified via keyword argument `sshflags`.\n  * `addprocs(list_of_remote_hosts; tunnel=true, sshflags=<ssh keys and other flags>)` is useful when\n    we wish to use SSH connections for master-worker too. A typical scenario for this is a local laptop\n    running the Julia REPL (i.e., the master) with the rest of the cluster on the cloud, say on Amazon\n    EC2. In this case only port 22 needs to be opened at the remote cluster coupled with SSH client\n    authenticated via public key infrastructure (PKI). Authentication credentials can be supplied\n    via `sshflags`, for example ```sshflags=`-e <keyfile>` ```.\n--><!--\n    In an all-to-all topology (the default), all workers connect to each other via plain TCP sockets.\n    The security policy on the cluster nodes must thus ensure free connectivity between workers for\n    the ephemeral port range (varies by OS).\n--><!--\n    Securing and encrypting all worker-worker traffic (via SSH) or encrypting individual messages\n    can be done via a custom `ClusterManager`.\n-->"
},

{
    "location": "manual/parallel-computing/#man-cluster-cookie-1",
    "page": "并行计算",
    "title": "集群 Cookie",
    "category": "section",
    "text": "<!--\n## [Cluster Cookie](@id man-cluster-cookie)\n-->集群上所有的进程都共享同一个cookie，默认是master进程随机生成的字符串。<!--\nAll processes in a cluster share the same cookie which, by default, is a randomly generated string\non the master process:\n-->cluster_cookie() 返回cookie，而cluster_cookie(cookie)()设置并返回新的cookie。\n所有的连接都进行双向认证，从而保证只有master启动的worker才能相互连接。\ncookie可以在worker启动的时候，通过参数--worker=<cookie>指定，如果参数--worker没有指定cookie，那么worker会从它的标准输入中(stdin)读取，stdin会在cookie获取之后立即关闭。\nClusterManager可以通过cluster_cookie()从master中过去cookie，不适用默认TCP/IP传输的集群管理器（即没有指定--worker）必须用于master相同的cookie调用init_worker(cookie, manager)。<!--\n  * [`cluster_cookie()`](@ref) returns the cookie, while `cluster_cookie(cookie)()` sets\n    it and returns the new cookie.\n  * All connections are authenticated on both sides to ensure that only workers started by the master\n    are allowed to connect to each other.\n  * The cookie may be passed to the workers at startup via argument `--worker=<cookie>`. If argument\n    `--worker` is specified without the cookie, the worker tries to read the cookie from its\n    standard input ([`stdin`](@ref)). The `stdin` is closed immediately after the cookie is retrieved.\n  * `ClusterManager`s can retrieve the cookie on the master by calling [`cluster_cookie()`](@ref).\n    Cluster managers not using the default TCP/IP transport (and hence not specifying `--worker`)\n    must call `init_worker(cookie, manager)` with the same cookie as on the master.\n-->注意，在对安全性要求很高的环境中，可以通过自定义ClusterManager实现。例如，cookie可以提前共享，然后不必再启动参数中指定。<!--\nNote that environments requiring higher levels of security can implement this via a custom `ClusterManager`.\nFor example, cookies can be pre-shared and hence not specified as a startup argument.\n-->"
},

{
    "location": "manual/parallel-computing/#指定网络拓补结构（实验性功能）-1",
    "page": "并行计算",
    "title": "指定网络拓补结构（实验性功能）",
    "category": "section",
    "text": "<!--\n## Specifying Network Topology (Experimental)\n-->可以通过传递到addprocs中的参数topology来指定worker之间如何连接。<!--\nThe keyword argument `topology` passed to `addprocs` is used to specify how the workers must be\nconnected to each other:\n-->:all_to_all,默认的，所有worker之间相互都连接\n:master_worker,只有主进程，即pid为1的进程能够与worker建立连接\n:custom: 集群管理器的launch方法通过WorkerConfig中的ident和connect_idents指定连接的拓补结构。一个worker通过集群管理器提供的ident来连接到所有connect_idents指定的worker。<!--\n  * `:all_to_all`, the default: all workers are connected to each other.\n  * `:master_worker`: only the driver process, i.e. `pid` 1, has connections to the workers.\n  * `:custom`: the `launch` method of the cluster manager specifies the connection topology via the\n    fields `ident` and `connect_idents` in `WorkerConfig`. A worker with a cluster-manager-provided\n    identity `ident` will connect to all workers specified in `connect_idents`.\n-->关键字参数lazy=true|false只会影响topology选项中的:all_to_all。如果是true，那么集群启动的时候master会连接所有的worker，然后worker之间的特定连接会在初次唤醒的是建立连接，这有利于降低集群初始化的时候对资源的分配。lazy的默认值是true。<!--\nKeyword argument `lazy=true|false` only affects `topology` option `:all_to_all`. If `true`, the cluster\nstarts off with the master connected to all workers. Specific worker-worker connections are established\nat the first remote invocation between two workers. This helps in reducing initial resources allocated for\nintra-cluster communication. Connections are setup depending on the runtime requirements of a parallel\nprogram. Default value for `lazy` is `true`.\n-->目前，在没有建立连接的两个worker之间传递消息会出错，目前该行为是实验性的，未来的版本中可能会改变。<!--\nCurrently, sending a message between unconnected workers results in an error. This behaviour,\nas with the functionality and interface, should be considered experimental in nature and may change\nin future releases.\n-->"
},

{
    "location": "manual/parallel-computing/#一些值得关注的外部库-1",
    "page": "并行计算",
    "title": "一些值得关注的外部库",
    "category": "section",
    "text": "<!--\n## Noteworthy external packages\n-->除了Julia自带的并行机制之外，还有许多外部的库值得一提。例如MPI.jl提供了一个MPI协议的Julia的封装，或者是在Shared Arrays提到的DistributedArrays.jl，此外尤其值得一提的是Julia的GPU编程生态，包括：底层（C内核）的OpenCL.jl 和 CUDAdrv.jl，分别提供了OpenCL和 CUDA的封装。\n底层（Julia内核）的接口，如CUDAnative.jl，提供了Julia原生的CUDA实现。\n高层的特定抽象，如CuArrays.jl 和 CLArrays.jl。\n高层的库，如ArrayFire.jl 和 GPUArrays.jl。<!--\nOutside of Julia parallelism there are plenty of external packages that should be mentioned.\nFor example [MPI.jl](https://github.com/JuliaParallel/MPI.jl) is a Julia wrapper for the `MPI` protocol, or\n[DistributedArrays.jl](https://github.com/JuliaParallel/Distributedarrays.jl), as presented in [Shared Arrays](@ref).\nA mention must be done to the Julia\'s GPU programming ecosystem, which includes :\n\n1. Low-level (C kernel) based operations [OpenCL.jl](https://github.com/JuliaGPU/OpenCL.jl) and [CUDAdrv.jl](https://github.com/JuliaGPU/CUDAdrv.jl) which are respectively an OpenCL interface and a CUDA wrapper.\n\n2. Low-level (Julia Kernel) interfaces like [CUDAnative.jl](https://github.com/JuliaGPU/CUDAnative.jl) which is a Julia native CUDA implementation.\n\n3. High-level vendor specific abstractions like [CuArrays.jl](https://github.com/JuliaGPU/CuArrays.jl) and [CLArrays.jl](https://github.com/JuliaGPU/CLArrays.jl)\n\n4. High-level libraries like [ArrayFire.jl](https://github.com/JuliaComputing/ArrayFire.jl) and [GPUArrays.jl](https://github.com/JuliaGPU/GPUArrays.jl)\n-->下面的例子将介绍如何用DistributedArrays.jl和CuArrays.jl通过distribute()和CuArray()将数组分配到多个进程。记住在载入DistributedArrays.jl时，需要用@everywhere将其载入到多个进程中。<!--\nIn the following example we will use both `DistributedArrays.jl` and `CuArrays.jl` to distribute an array across multiple\nprocesses by first casting it through `distribute()` and `CuArray()`.\n--><!--\nRemember when importing `DistributedArrays.jl` to import it across all processes using [`@everywhere`](@ref)\n-->$ ./julia -p 4\n\njulia> addprocs()\n\njulia> @everywhere using DistributedArrays\n\njulia> using CuArrays\n\njulia> B = ones(10_000) ./ 2;\n\njulia> A = ones(10_000) .* π;\n\njulia> C = 2 .* A ./ B;\n\njulia> all(C .≈ 4*π)\ntrue\n\njulia> typeof(C)\nArray{Float64,1}\n\njulia> dB = distribute(B);\n\njulia> dA = distribute(A);\n\njulia> dC = 2 .* dA ./ dB;\n\njulia> all(dC .≈ 4*π)\ntrue\n\njulia> typeof(dC)\nDistributedArrays.DArray{Float64,1,Array{Float64,1}}\n\njulia> cuB = CuArray(B);\n\njulia> cuA = CuArray(A);\n\njulia> cuC = 2 .* cuA ./ cuB;\n\njulia> all(cuC .≈ 4*π);\ntrue\n\njulia> typeof(cuC)\nCuArray{Float64,1}要牢记，当前一些Julia的特性并没有被CUDAnative.jl [2] 支持，尤其是一些像sin之类的函数需要换成CUDAnative.sin(cc: @maleadt)。<!--\nKeep in mind that some Julia features are not currently supported by CUDAnative.jl [^2] , especially some functions like `sin` will need to be replaced with `CUDAnative.sin`(cc: @maleadt).\n-->下面的例子中，通过DistributedArrays.jl和CuArrays.jl将一个数组分配到多个进程，然后调用一个函数。<!--\nIn the following example we will use both `DistributedArrays.jl` and `CuArrays.jl` to distribute an array across multiple\nprocesses and call a generic function on it.\n-->function power_method(M, v)\n    for i in 1:100\n        v = M*v\n        v /= norm(v)\n    end\n\n    return v, norm(M*v) / norm(v)  # or  (M*v) ./ v\nendpower_method重复创建一个新的向量然后对其归一化，这里并没有在函数中指定类型信息，来看看是否对前面提到的类型适用：<!--\n`power_method` repeteavely creates a new vector and normalizes it. We have not specified any type signature in\nfunction declaration, let\'s see if it works with the aforementioned datatypes:\n-->julia> M = [2. 1; 1 1];\n\njulia> v = rand(2)\n2-element Array{Float64,1}:\n0.40395\n0.445877\n\njulia> power_method(M,v)\n([0.850651, 0.525731], 2.618033988749895)\n\njulia> cuM = CuArray(M);\n\njulia> cuv = CuArray(v);\n\njulia> curesult = power_method(cuM, cuv);\n\njulia> typeof(curesult)\nCuArray{Float64,1}\n\njulia> dM = distribute(M);\n\njulia> dv = distribute(v);\n\njulia> dC = power_method(dM, dv);\n\njulia> typeof(dC)\nTuple{DistributedArrays.DArray{Float64,1,Array{Float64,1}},Float64}最后，我们来看看MPI.jl，这个库时Julia对MPI协议的封装。一一介绍其中的每个函数太累赘了，这里领会其实现协议的方法就够了。考虑下面这个简单的脚本，它做的只是调用每个子进程，然后初始化其rank，然后在master访问时，对rank求和。<!--\nTo end this short exposure to external packages, we can consider `MPI.jl`, a Julia wrapper\nof the MPI protocol. As it would take too long to consider every inner function, it would be better\nto simply appreciate the approach used to implement the protocol.\n--><!--\nConsider this toy script which simply calls each subprocess, instantiate its rank and when the master\nprocess is reached, performs the ranks\' sum\n-->import MPI\n\nMPI.Init()\n\ncomm = MPI.COMM_WORLD\nMPI.Barrier(comm)\n\nroot = 0\nr = MPI.Comm_rank(comm)\n\nsr = MPI.Reduce(r, MPI.SUM, root, comm)\n\nif(MPI.Comm_rank(comm) == root)\n   @printf(\"sum of ranks: %s\\n\", sr)\nend\n\nMPI.Finalize()mpirun -np 4 ./julia example.jl[1]: 在这里，MPI 指的是MPI-1标准。从MPI-2开始，MPI标准委员会引入了一种新的通信机制，统称远程内存访问(Remote Memory Access, RMA)。引入远程内存访问机制的目的是为了方便单向通信模式，更多信息可以访问最新的MPI标准http://mpi-forum.org/docs<!--\n[^1]:\n    In this context, MPI refers to the MPI-1 standard. Beginning with MPI-2, the MPI standards committee\n    introduced a new set of communication mechanisms, collectively referred to as Remote Memory Access\n    (RMA). The motivation for adding RMA to the MPI standard was to facilitate one-sided communication\n    patterns. For additional information on the latest MPI standard, see [http://mpi-forum.org/docs](http://mpi-forum.org/docs/).\n-->[2]: Julia GPU man pages"
},

{
    "location": "manual/style-guide/#",
    "page": "代码风格指南",
    "title": "代码风格指南",
    "category": "page",
    "text": ""
},

{
    "location": "manual/style-guide/#代码风格指南-1",
    "page": "代码风格指南",
    "title": "代码风格指南",
    "category": "section",
    "text": "<!-- # Style Guide -->接下来的部分将介绍如何写出具有Julia风格的代码。当然，这些规则并不是绝对的，它们只是一些建议，以便更好地帮助你熟悉这门语言，以及在不同的代码设计中做出选择。<!-- The following sections explain a few aspects of idiomatic Julia coding style. None of these rules are absolute; they are only suggestions to help familiarize you with the language and to help you choose among alternative designs. -->"
},

{
    "location": "manual/style-guide/#写函数，而不是仅仅写脚本-1",
    "page": "代码风格指南",
    "title": "写函数，而不是仅仅写脚本",
    "category": "section",
    "text": "<!-- ## Write functions, not just scripts -->一开始解决问题的时候，直接从最外层一步步写代码的确很便捷，但你应该尽早地将代码组织成函数。函数有更强的复用性和可测试性，并且能更清楚地让人知道哪些步骤做完了，以及每一步骤的输入输出分别是什么。此外，由于Julia编译器特殊的工作方式，写在函数中的代码往往要比最外层的代码运行地快得多。<!-- Writing code as a series of steps at the top level is a quick way to get started solving a problem,\nbut you should try to divide a program into functions as soon as possible. Functions are more\nreusable and testable, and clarify what steps are being done and what their inputs and outputs\nare. Furthermore, code inside functions tends to run much faster than top level code, due to how\nJulia\'s compiler works. -->此外值得一提的是，函数应当接受参数，而不是直接使用全局变量（ pi 等常数除外）进行操作。<!-- It is also worth emphasizing that functions should take arguments, instead of operating directly\non global variables (aside from constants like [`pi`](@ref)). -->"
},

{
    "location": "manual/style-guide/#避免写过于特定的类型-1",
    "page": "代码风格指南",
    "title": "避免写过于特定的类型",
    "category": "section",
    "text": "<!-- ## Avoid writing overly-specific types -->代码应该写得尽可能通用。例如，下面这段代码:<!-- Code should be as generic as possible. Instead of writing: -->convert(Complex{Float64}, x)更好的写法是写成下面的通用函数：<!-- it\'s better to use available generic functions: -->complex(float(x))上面的版本会把 x 转换成一个合适的类型，而非总是同一类型。<!-- The second version will convert `x` to an appropriate type, instead of always the same type. -->这种代码风格与函数的参数尤其相关。例如，当一个参数可以是任何整型时，不要将它的类型声明为 Int 或 Int32，而要使用抽象类型（abstract type）Integer 来表示。事实上，除非确实需要将其与其它的方法定义区分开，很多情况下你可以干脆完全省略掉参数的类型，因为如果你的操作中有不支持某种参数类型的操作的话，反正都会抛出 MethodError 的。这也称作 鸭子类型）。<!-- This style point is especially relevant to function arguments. For example, don\'t declare an argument\nto be of type `Int` or [`Int32`](@ref) if it really could be any integer, expressed with the abstract\ntype [`Integer`](@ref). In fact, in many cases you can omit the argument type altogether,\nunless it is needed to disambiguate from other method definitions, since a\n[`MethodError`](@ref) will be thrown anyway if a type is passed that does not support any\nof the requisite operations. (This is known as\n[duck typing](https://en.wikipedia.org/wiki/Duck_typing).) -->例如，考虑这样的一个叫做 addone 的函数，其返回值为它的参数加 1 ：<!-- For example, consider the following definitions of a function `addone` that returns one plus its\nargument: -->addone(x::Int) = x + 1                 # works only for Int\naddone(x::Integer) = x + oneunit(x)    # any integer type\naddone(x::Number) = x + oneunit(x)     # any numeric type\naddone(x) = x + oneunit(x)             # any type supporting + and oneunit最后一种定义可以处理所有支持 oneunit （返回和 x 相同类型的 1，以避免不需要的类型提升（type promotion））以及 + 函数的类型。这里的关键点在于，只定义通用的 addone(x) = x + oneunit(x) 并不会带来性能上的损失，因为 Julia 会在需要的时候自动编译特定的版本。比如说，当第一次调用 addone(12) 时，Julia 会自动编译一个特定的 addone 函数，它接受一个 x::Int 的参数，并把调用的 oneunit 替换为内连的值 1。因此，上述的前三种 addone 的定义对于第四种来说是完全多余的。<!-- The last definition of `addone` handles any type supporting [`oneunit`](@ref) (which returns 1 in\nthe same type as `x`, which avoids unwanted type promotion) and the [`+`](@ref) function with\nthose arguments. The key thing to realize is that there is *no performance penalty* to defining\n*only* the general `addone(x) = x + oneunit(x)`, because Julia will automatically compile specialized\nversions as needed. For example, the first time you call `addone(12)`, Julia will automatically\ncompile a specialized `addone` function for `x::Int` arguments, with the call to `oneunit`\nreplaced by its inlined value `1`. Therefore, the first three definitions of `addone` above are\ncompletely redundant with the fourth definition. -->"
},

{
    "location": "manual/style-guide/#让调用者处理多余的参数多样性-1",
    "page": "代码风格指南",
    "title": "让调用者处理多余的参数多样性",
    "category": "section",
    "text": "<!-- ## Handle excess argument diversity in the caller -->如下的代码：<!-- Instead of: -->function foo(x, y)\n    x = Int(x); y = Int(y)\n    ...\nend\nfoo(x, y)请写成这样：<!-- use: -->function foo(x::Int, y::Int)\n    ...\nend\nfoo(Int(x), Int(y))这种风格更好，因为 foo 函数其实不需要接受所有类型的数，而只需要接受 Int。<!-- This is better style because `foo` does not really accept numbers of all types; it really needs\n`Int` s. -->这里的关键在于，如果一个函数需要处理的是整数，强制让调用者来决定非整数如何被转换（比如说向下还是向上取整）会更好。同时，把类型声明得具体一些的话可以为以后的方法定义留有更多的空间。<!-- One issue here is that if a function inherently requires integers, it might be better to force\nthe caller to decide how non-integers should be converted (e.g. floor or ceiling). Another issue\nis that declaring more specific types leaves more \"space\" for future method definitions. -->"
},

{
    "location": "manual/style-guide/#在会修改自身参数的函数名字后加-!-1",
    "page": "代码风格指南",
    "title": "在会修改自身参数的函数名字后加 !",
    "category": "section",
    "text": "<!-- ## Append `!` to names of functions that modify their arguments -->如下的代码：<!-- Instead of: -->function double(a::AbstractArray{<:Number})\n    for i = firstindex(a):lastindex(a)\n        a[i] *= 2\n    end\n    return a\nend请写成这样：<!-- use: -->function double!(a::AbstractArray{<:Number})\n    for i = firstindex(a):lastindex(a)\n        a[i] *= 2\n    end\n    return a\nendJulia 的 Base 模块中的函数都遵循了这种规范，且包含很多例子：有的函数同时有拷贝和修改的形式（比如 sort 和 sort!），还有一些只有修改（比如 push!，pop! 和 splice!）。为了方便起见，这类函数通常也会把修改后的数组作为返回值。<!-- Julia Base uses this convention throughout and contains examples of functions\nwith both copying and modifying forms (e.g., [`sort`](@ref) and [`sort!`](@ref)), and others\nwhich are just modifying (e.g., [`push!`](@ref), [`pop!`](@ref), [`splice!`](@ref)).  It\nis typical for such functions to also return the modified array for convenience. -->"
},

{
    "location": "manual/style-guide/#避免使用奇怪的-Union-类型-1",
    "page": "代码风格指南",
    "title": "避免使用奇怪的 Union 类型",
    "category": "section",
    "text": "<!-- ## Avoid strange type `Union`s -->使用 Union{Function,AbstractString} 这样的类型的时候通常意味着设计还不够清晰。<!-- Types such as `Union{Function,AbstractString}` are often a sign that some design could be cleaner. -->"
},

{
    "location": "manual/style-guide/#避免复杂的容器类型-1",
    "page": "代码风格指南",
    "title": "避免复杂的容器类型",
    "category": "section",
    "text": "<!-- ## Avoid elaborate container types -->像下面这样构造数组通常并没有什么好处：<!-- It is usually not much help to construct arrays like the following: -->a = Vector{Union{Int,AbstractString,Tuple,Array}}(undef, n)这种情况下，Vector{Any}(undef, n)更合适些。此外，相比将所有可能的类型都打包在一起，直接在使用时标注具体的数据类型（比如：a[i]::Int）对编译器来说更有用。<!-- In this case `Vector{Any}(undef, n)` is better. It is also more helpful to the compiler to annotate specific\nuses (e.g. `a[i]::Int`) than to try to pack many alternatives into one type. -->"
},

{
    "location": "manual/style-guide/#使用和-Julia-的-base/-一致的命名习惯-1",
    "page": "代码风格指南",
    "title": "使用和 Julia 的 base/ 一致的命名习惯",
    "category": "section",
    "text": "<!-- ## Use naming conventions consistent with Julia\'s `base/` -->模块和类型名使用大写开头的驼峰命名法：module SparseArrays，struct UnitRange。\n函数名使用小写字母，且当可读时可以将多个单词拼在一起。必要的时候，可以使用下划线作为单词分隔符。下划线也被用于指明概念的组合（比如 remotecall_fetch 作为 fetch(remotecall(...)) 的一个更高效的实现）或者变化。\n虽然简洁性很重要，但避免使用缩写（用 indexin 而不是 indxin），因为这会让记住单词有没有被缩写或如何被缩写变得十分困难。<!-- * modules and type names use capitalization and camel case: `module SparseArrays`, `struct UnitRange`.\n  * functions are lowercase ([`maximum`](@ref), [`convert`](@ref)) and, when readable, with multiple\n    words squashed together ([`isequal`](@ref), [`haskey`](@ref)). When necessary, use underscores\n    as word separators. Underscores are also used to indicate a combination of concepts ([`remotecall_fetch`](@ref)\n    as a more efficient implementation of `fetch(remotecall(...))`) or as modifiers.\n  * conciseness is valued, but avoid abbreviation ([`indexin`](@ref) rather than `indxin`) as\n    it becomes difficult to remember whether and how particular words are abbreviated. -->如果一个函数名需要多个单词，请考虑这个函数是否代表了超过一个概念，是不是分成几个更小的部分更好。<!-- If a function name requires multiple words, consider whether it might represent more than one\nconcept and might be better split into pieces. -->"
},

{
    "location": "manual/style-guide/#使用与-Julia-的-Base-模块类似的参数顺序-1",
    "page": "代码风格指南",
    "title": "使用与 Julia 的 Base 模块类似的参数顺序",
    "category": "section",
    "text": "<!-- ## Write functions with argument ordering similar to Julia\'s Base -->一般来说，Base 库使用以下的函数参数顺序（如适用）：<!-- As a general rule, the Base library uses the following order of arguments to functions,\nas applicable: -->Function 参数。把作为参数的函数放在第一位可以方便使用 do，以传递多行匿名函数。<!-- 1. **Function argument**.\n   Putting a function argument first permits the use of [`do`](@ref) blocks for passing\n   multiline anonymous functions. -->I/O 流。把 IO 对象放在第一位，可以方便将函数传递给 sprint 之类的函数，例如 sprint(show, x)。<!-- 2. **I/O stream**.\n   Specifying the `IO` object first permits passing the function to functions such as\n   [`sprint`](@ref), e.g. `sprint(show, x)`. -->要被修改的输入。比如，在 fill!(x, v) 中，x 是要被修改的对象，所以放在要被插入 x 中的值前面。<!-- 3. **Input being mutated**.\n   For example, in [`fill!(x, v)`](@ref fill!), `x` is the object being mutated and it\n   appears before the value to be inserted into `x`. -->类型。把类型传入通常意味着要输出的值有着那种类型。在 parse(Int, \"1\") 中，类型在需要解析的字符串之前。还有很多类似的把类型放在第一位的例子，但是同时也需要注意到例如 read(io, String) 这样的函数中，会把 IO 参数放在类型的更前面，这样还是保持着这里描述的顺序。<!-- 4. **Type**.\n   Passing a type typically means that the output will have the given type.\n   In [`parse(Int, \"1\")`](@ref parse), the type comes before the string to parse.\n   There are many such examples where the type appears first, but it\'s useful to note that\n   in [`read(io, String)`](@ref read), the `IO` argument appears before the type, which is\n   in keeping with the order outlined here. -->不被修改的输入。比如在 fill!(x, v) 中的不被修改的 v，会放在 x 之后传入。<!-- 5. **Input not being mutated**.\n   In `fill!(x, v)`, `v` is *not* being mutated and it comes after `x`. -->键（Key）。对于关联集合来说，指的是键值对的键。对于其它有索引的集合来说，指的是索引。<!-- 6. **Key**.\n   For associative collections, this is the key of the key-value pair(s).\n   For other indexed collections, this is the index. -->值（Value）。对于关联集合来说，指的是键值对的值。在类似于 fill!(x, v) 的情况中，指的是 v。<!-- 7. **Value**.\n   For associative collections, this is the value of the key-value pair(s).\n   In cases like `fill!(x, v)`, this is `v`. -->其它的所有。任何的其它参数。<!-- 8. **Everything else**.\n   Any other arguments. -->可变参数（Vararg）。指的是在函数调用时可以被无限列在后面的参数。比如在 Matrix{T}(uninitialized, dims) 中，维数（dims）可以作为 Tuple 被传入（如 Matrix{T}(uninitialized, (1,2))），也可以作为可变参数（Vararg，如 Matrix{T}(uninitialized, 1, 2)。<!-- 9. **Varargs**.\n   This refers to arguments that can be listed indefinitely at the end of a function call.\n   For example, in `Matrix{T}(uninitialized, dims)`, the dimensions can be given as a\n   [`Tuple`](@ref), e.g. `Matrix{T}(uninitialized, (1,2))`, or as [`Vararg`](@ref)s,\n   e.g. `Matrix{T}(uninitialized, 1, 2)`. -->关键字参数。在 Julia 中，关键字参数本来就不得不定义在函数定义的最后，列在这里仅仅是为了完整性。<!-- 10. **Keyword arguments**.\n   In Julia keyword arguments have to come last anyway in function definitions; they\'re\n   listed here for the sake of completeness. -->大多数函数并不会接受上述所有种类的参数，这些数字仅仅是表示当适用时的优先权。<!-- The vast majority of functions will not take every kind of argument listed above; the\nnumbers merely denote the precedence that should be used for any applicable arguments\nto a function. -->当然，在一些情况下有例外。例如，convert 函数总是把类型作为第一个参数。setindex! 函数的值参数在索引参数之前，这样可以让索引作为可变参数传入。<!-- There are of course a few exceptions.\nFor example, in [`convert`](@ref), the type should always come first.\nIn [`setindex!`](@ref), the value comes before the indices so that the indices can be\nprovided as varargs. -->设计 API 时，尽可能秉承着这种一般顺序会让函数的使用者有一种更一致的体验。<!-- When designing APIs, adhering to this general order as much as possible is likely to give\nusers of your functions a more consistent experience. -->"
},

{
    "location": "manual/style-guide/#不要过度使用-try-catch-1",
    "page": "代码风格指南",
    "title": "不要过度使用 try-catch",
    "category": "section",
    "text": "<!-- ## Don\'t overuse try-catch -->比起依赖于捕获错误，更好的是避免错误。<!-- It is better to avoid errors than to rely on catching them. -->"
},

{
    "location": "manual/style-guide/#不要给条件语句加括号-1",
    "page": "代码风格指南",
    "title": "不要给条件语句加括号",
    "category": "section",
    "text": "<!-- ## Don\'t parenthesize conditions -->Julia 不要求在 if 和 while 后的条件两边加括号。使用如下写法：<!-- Julia doesn\'t require parens around conditions in `if` and `while`. Write: -->if a == b而不是:if (a == b)"
},

{
    "location": "manual/style-guide/#不要过度使用-...-1",
    "page": "代码风格指南",
    "title": "不要过度使用 ...",
    "category": "section",
    "text": "<!-- ## Don\'t overuse `...` -->拼接函数参数是会上瘾的。请用简单的 [a; b] 来代替 [a..., b...]，因为前者已经是被拼接的数组了。collect(a) 也比 [a...] 更好，但因为 a 已经是一个可迭代的变量了，通常不把它转换成数组就直接使用甚至更好。<!-- Splicing function arguments can be addictive. Instead of `[a..., b...]`, use simply `[a; b]`,\nwhich already concatenates arrays. [`collect(a)`](@ref) is better than `[a...]`, but since `a`\nis already iterable it is often even better to leave it alone, and not convert it to an array. -->"
},

{
    "location": "manual/style-guide/#不要使用不必要的静态参数-1",
    "page": "代码风格指南",
    "title": "不要使用不必要的静态参数",
    "category": "section",
    "text": "<!-- ## Don\'t use unnecessary static parameters -->如下的函数签名：<!-- A function signature: -->foo(x::T) where {T<:Real} = ...应当被写作：<!-- should be written as: -->foo(x::Real) = ...尤其是当 T 没有被用在函数体中时格外有意义。即使 T 被用到了，通常也可以被替换为 typeof(x)，后者不会导致性能上的差别。注意这并不是针对静态参数的一般警告，而仅仅是针对那些不必要的情况。<!-- instead, especially if `T` is not used in the function body. Even if `T` is used, it can be replaced\nwith [`typeof(x)`](@ref) if convenient. There is no performance difference. Note that this is\nnot a general caution against static parameters, just against uses where they are not needed. -->同样需要注意的是，容器类型在函数调用中可能明确地需要类型参数。详情参见避免使用抽象容器的域。<!-- Note also that container types, specifically may need type parameters in function calls. See the\nFAQ [Avoid fields with abstract containers](@ref) for more information. -->"
},

{
    "location": "manual/style-guide/#避免判断变量是实例还是类型的混乱-1",
    "page": "代码风格指南",
    "title": "避免判断变量是实例还是类型的混乱",
    "category": "section",
    "text": "<!-- ## Avoid confusion about whether something is an instance or a type -->如下的一组定义容易令人困惑：<!-- Sets of definitions like the following are confusing: -->foo(::Type{MyType}) = ...\nfoo(::MyType) = foo(MyType)请决定问题里的概念应当是 MyType 还是 MyType()，然后坚持使用其一。<!-- Decide whether the concept in question will be written as `MyType` or `MyType()`, and stick to\nit. -->默认使用实例是比较受推崇的风格，然后只在为了解决一些问题必要时添加涉及到 Type{MyType} 的方法。<!-- The preferred style is to use instances by default, and only add methods involving `Type{MyType}`\nlater if they become necessary to solve some problem. -->如果一个类型实际上是个枚举，它应该被定义成一个单一的类型（理想的情况是不可变结构或原始类型），把枚举值作为它的实例。构造器和转换器可以检查那些值是否有效。这种设计比把枚举做成抽象类型，并把“值”做成子类型来得更受推崇。<!-- If a type is effectively an enumeration, it should be defined as a single (ideally immutable struct or primitive)\ntype, with the enumeration values being instances of it. Constructors and conversions can check\nwhether values are valid. This design is preferred over making the enumeration an abstract type,\nwith the \"values\" as subtypes. -->"
},

{
    "location": "manual/style-guide/#不要过度使用宏-1",
    "page": "代码风格指南",
    "title": "不要过度使用宏",
    "category": "section",
    "text": "<!-- ## Don\'t overuse macros -->请注意有的宏实际上可以被写成一个函数。<!-- Be aware of when a macro could really be a function instead. -->在宏内部调用 eval 是一个特别危险的警告标志，它意味着这个宏仅在被最外层调用时起作用。如果这样的宏被写成函数，它会自然地访问得到它所需要的运行时值。<!-- Calling [`eval`](@ref) inside a macro is a particularly dangerous warning sign; it means the\nmacro will only work when called at the top level. If such a macro is written as a function instead,\nit will naturally have access to the run-time values it needs. -->"
},

{
    "location": "manual/style-guide/#不要把不安全的操作暴露在接口层-1",
    "page": "代码风格指南",
    "title": "不要把不安全的操作暴露在接口层",
    "category": "section",
    "text": "<!-- ## Don\'t expose unsafe operations at the interface level -->如果你有一个使用本地指针的类型：<!-- If you have a type that uses a native pointer: -->mutable struct NativeType\n    p::Ptr{UInt8}\n    ...\nend不要定义类似如下的函数：<!-- don\'t write definitions like the following: -->getindex(x::NativeType, i) = unsafe_load(x.p, i)这里的问题在于，这个类型的用户可能会在意识不到这个操作不安全的情况下写出 x[i]，然后容易遇到内存错误。<!-- The problem is that users of this type can write `x[i]` without realizing that the operation is\nunsafe, and then be susceptible to memory bugs. -->在这样的函数中，可以加上对操作的检查来确保安全，或者可以在名字的某处加上 unsafe 来警告调用者。<!-- Such a function should either check the operation to ensure it is safe, or have `unsafe` somewhere\nin its name to alert callers. -->"
},

{
    "location": "manual/style-guide/#不要重载基础容器类型的方法-1",
    "page": "代码风格指南",
    "title": "不要重载基础容器类型的方法",
    "category": "section",
    "text": "<!-- ## Don\'t overload methods of base container types -->有时可能会想要写这样的定义：<!-- It is possible to write definitions like the following: -->show(io::IO, v::Vector{MyType}) = ...这样可以提供对特定的某种新元素类型的向量的自定义显示。这种做法虽然很诱人，但应当被避免。这里的问题在于用户会想着一个像 Vector() 这样熟知的类型以某种方式表现，但过度自定义的行为会让使用变得更难。<!-- This would provide custom showing of vectors with a specific new element type. While tempting,\nthis should be avoided. The trouble is that users will expect a well-known type like `Vector()`\nto behave in a certain way, and overly customizing its behavior can make it harder to work with. -->"
},

{
    "location": "manual/style-guide/#避免类型盗版-1",
    "page": "代码风格指南",
    "title": "避免类型盗版",
    "category": "section",
    "text": "<!-- ## Avoid type piracy -->“类型盗版”（type piracy）指的是扩展或是重定义 Base 或其它包中的并不是你所定义的类型的方法。在某些情况下，你可以几乎毫无副作用地逃避类型盗版。但在极端情况下，你甚至会让 Julia 崩溃（比如说你的方法扩展或重定义造成了对 ccall 传入了无效的输入）。类型盗版也让代码推导变得更复杂，且可能会引入难以预料和诊断的不兼容性。<!-- \"Type piracy\" refers to the practice of extending or redefining methods in Base\nor other packages on types that you have not defined. In some cases, you can get away with\ntype piracy with little ill effect. In extreme cases, however, you can even crash Julia\n(e.g. if your method extension or redefinition causes invalid input to be passed to a\n`ccall`). Type piracy can complicate reasoning about code, and may introduce\nincompatibilities that are hard to predict and diagnose. -->例如，你也许想在一个模块中定义符号上的乘法：<!-- As an example, suppose you wanted to define multiplication on symbols in a module: -->module A\nimport Base.*\n*(x::Symbol, y::Symbol) = Symbol(x,y)\nend这里的问题时现在其它用到 Base.* 的模块同样会看到这个定义。由于 Symbol 是定义在 Base 里再被其它模块所使用的，这可能不可预料地改变无关代码的行为。这里有几种替代的方式，包括使用一个不同的函数名称，或是把 Symbol 给包在另一个你自己定义的类型中。<!-- The problem is that now any other module that uses `Base.*` will also see this definition.\nSince `Symbol` is defined in Base and is used by other modules, this can change the\nbehavior of unrelated code unexpectedly. There are several alternatives here, including\nusing a different function name, or wrapping the `Symbol`s in another type that you define. -->有时候，耦合的包可能会使用类型盗版，以此来从定义分隔特性，尤其是当那些包是一些合作的作者设计的时候，且那些定义是可重用的时候。例如，一个包可能提供一些对处理色彩有用的类型，另一个包可能为那些类型定义色彩空间之间转换的方法。再举一个例子，一个包可能是一些 C 代码的简易包装，另一个包可能就“盗版”来实现一些更高级别的、对 Julia 友好的 API。<!-- Sometimes, coupled packages may engage in type piracy to separate features from definitions,\nespecially when the packages were designed by collaborating authors, and when the\ndefinitions are reusable. For example, one package might provide some types useful for\nworking with colors; another package could define methods for those types that enable\nconversions between color spaces. Another example might be a package that acts as a thin\nwrapper for some C code, which another package might then pirate to implement a\nhigher-level, Julia-friendly API. -->"
},

{
    "location": "manual/style-guide/#注意类型相等-1",
    "page": "代码风格指南",
    "title": "注意类型相等",
    "category": "section",
    "text": "<!-- ## Be careful with type equality -->通常会用 isa 和 <: 来对类型进行测试，而不会用到 ==。检测类型的相等通常只对和一个已知的具体类型比较有意义（例如 T == Float64），或者你真的真的知道自己在做什么。<!-- You generally want to use [`isa`](@ref) and [`<:`](@ref) for testing types,\nnot `==`. Checking types for exact equality typically only makes sense when comparing to a known\nconcrete type (e.g. `T == Float64`), or if you *really, really* know what you\'re doing. -->"
},

{
    "location": "manual/style-guide/#不要写-x-f(x)-1",
    "page": "代码风格指南",
    "title": "不要写 x->f(x)",
    "category": "section",
    "text": "<!-- ## Do not write `x->f(x)` -->因为调用高阶函数时经常会用到匿名函数，很容易认为这是合理甚至必要的。但任何函数都可以被直接传递，并不需要被“包\"在一个匿名函数中。比如 map(x->f(x), a) 应当被写成 map(f, a)。<!-- Since higher-order functions are often called with anonymous functions, it is easy to conclude\nthat this is desirable or even necessary. But any function can be passed directly, without being\n\"wrapped\" in an anonymous function. Instead of writing `map(x->f(x), a)`, write [`map(f, a)`](@ref). -->"
},

{
    "location": "manual/style-guide/#尽可能避免使用浮点数作为通用代码的字面量-1",
    "page": "代码风格指南",
    "title": "尽可能避免使用浮点数作为通用代码的字面量",
    "category": "section",
    "text": "<!-- ## Avoid using floats for numeric literals in generic code when possible -->当写处理数字，且可以处理多种不同数字类型的参数的通用代码时，请使用对参数影响（通过类型提升）尽可能少的类型的字面量。<!-- If you write generic code which handles numbers, and which can be expected to run with many different\nnumeric type arguments, try using literals of a numeric type that will affect the arguments as\nlittle as possible through promotion. -->例如，<!-- For example, -->julia> f(x) = 2.0 * x\nf (generic function with 1 method)\n\njulia> f(1//2)\n1.0\n\njulia> f(1/2)\n1.0\n\njulia> f(1)\n2.0而<!-- while -->julia> g(x) = 2 * x\ng (generic function with 1 method)\n\njulia> g(1//2)\n1//1\n\njulia> g(1/2)\n1.0\n\njulia> g(1)\n2如你所见，使用了 Int 字面量的第二个版本保留了输入参数的类型，而第一个版本没有。这是因为例如 promote_type(Int, Float64) == Float64，且做乘法时会需要类型提升。类似地，Rational 字面量比 Float64 字面量对类型有着更小的破坏性，但比 Int 大。<!-- As you can see, the second version, where we used an `Int` literal, preserved the type of the\ninput argument, while the first didn\'t. This is because e.g. `promote_type(Int, Float64) == Float64`,\nand promotion happens with the multiplication. Similarly, [`Rational`](@ref) literals are less type disruptive\nthan [`Float64`](@ref) literals, but more disruptive than `Int`s: -->julia> h(x) = 2//1 * x\nh (generic function with 1 method)\n\njulia> h(1//2)\n1//1\n\njulia> h(1/2)\n1.0\n\njulia> h(1)\n2//1所以，可能时尽量使用 Int 字面量，对非整数字面量使用 Rational{Int}，这样可以让代码变得更容易使用。<!-- Thus, use `Int` literals when possible, with `Rational{Int}` for literal non-integer numbers,\nin order to make it easier to use your code. -->"
},

{
    "location": "base/base/#",
    "page": "重要组件",
    "title": "重要组件",
    "category": "page",
    "text": "<!-- # Essentials -->"
},

{
    "location": "base/base/#重要组件-1",
    "page": "重要组件",
    "title": "重要组件",
    "category": "section",
    "text": "<!-- ## Introduction -->"
},

{
    "location": "base/base/#简介-1",
    "page": "重要组件",
    "title": "简介",
    "category": "section",
    "text": "<!-- Julia Base contains a range of functions and macros appropriate for performing\nscientific and numerical computing, but is also as broad as those of many general purpose programming\nlanguages.  Additional functionality is available from a growing collection of available packages.\nFunctions are grouped by topic below. -->Julia的基础模块不仅包含了一系列为科学计算和数值计算打造的函数和宏，也包含了广泛的 为一般目的编程所需的基础设置。额外的功能可以通过增加包来获得。函数被组织为如下的主题。<!-- Some general notes:\n\n  * To use module functions, use `import Module` to import the module, and `Module.fn(x)` to use the\n    functions.\n  * Alternatively, `using Module` will import all exported `Module` functions into the current namespace.\n  * By convention, function names ending with an exclamation point (`!`) modify their arguments.\n    Some functions have both modifying (e.g., `sort!`) and non-modifying (`sort`) versions. -->一些一般的注记：如需使用模块里的函数，请通过 import Module 来载入模块，然后使用 Module.fn(x) 来使用这个函数。\n或者，你也可以通过 using Module 来载入所有被 Module 暴露的函数到当前的命名空间中\n按照约定，函数名称以感叹号（!）结尾的将会修改它们的输入，一些函数会有修改（副作用）和不修改两种版本<!-- ## Getting Around -->"
},

{
    "location": "base/base/#Base.exit",
    "page": "重要组件",
    "title": "Base.exit",
    "category": "function",
    "text": "exit(code=0)\n\nStop the program with an exit code. The default exit code is zero, indicating that the program completed successfully. In an interactive session, exit() can be called with the keyboard shortcut ^D.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.atexit",
    "page": "重要组件",
    "title": "Base.atexit",
    "category": "function",
    "text": "atexit(f)\n\nRegister a zero-argument function f() to be called at process exit. atexit() hooks are called in last in first out (LIFO) order and run before object finalizers.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.isinteractive",
    "page": "重要组件",
    "title": "Base.isinteractive",
    "category": "function",
    "text": "isinteractive() -> Bool\n\nDetermine whether Julia is running an interactive session.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.summarysize",
    "page": "重要组件",
    "title": "Base.summarysize",
    "category": "function",
    "text": "Base.summarysize(obj; exclude=Union{...}, chargeall=Union{...}) -> Int\n\nCompute the amount of memory used by all unique objects reachable from the argument.\n\nKeyword Arguments\n\nexclude: specifies the types of objects to exclude from the traversal.\nchargeall: specifies the types of objects to always charge the size of all of their fields, even if those fields would normally be excluded.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.require",
    "page": "重要组件",
    "title": "Base.require",
    "category": "function",
    "text": "require(module::Symbol)\n\nThis function is part of the implementation of using / import, if a module is not already defined in Main. It can also be called directly to force reloading a module, regardless of whether it has been loaded before (for example, when interactively developing libraries).\n\nLoads a source file, in the context of the Main module, on every active node, searching standard locations for files. require is considered a top-level operation, so it sets the current include path but does not use it to search for files (see help for include). This function is typically used to load library code, and is implicitly called by using to load packages.\n\nWhen searching for files, require first looks for package code in the global array LOAD_PATH. require is case-sensitive on all platforms, including those with case-insensitive filesystems like macOS and Windows.\n\nFor more details regarding code loading, see the manual.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.compilecache",
    "page": "重要组件",
    "title": "Base.compilecache",
    "category": "function",
    "text": "Base.compilecache(module::PkgId)\n\nCreates a precompiled cache file for a module and all of its dependencies. This can be used to reduce package load times. Cache files are stored in DEPOT_PATH[1]/compiled. See Module initialization and precompilation for important notes.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.__precompile__",
    "page": "重要组件",
    "title": "Base.__precompile__",
    "category": "function",
    "text": "__precompile__(isprecompilable::Bool=true)\n\nSpecify whether the file calling this function is precompilable. If isprecompilable is true, then __precompile__ throws an exception when the file is loaded by using/import/require unless the file is being precompiled, and in a module file it causes the module to be automatically precompiled when it is imported. Typically, __precompile__() should occur before the module declaration in the file.\n\nIf a module or file is not safely precompilable, it should call __precompile__(false) in order to throw an error if Julia attempts to precompile it.\n\n__precompile__() should not be used in a module unless all of its dependencies are also using __precompile__(). Failure to do so can result in a runtime error when loading the module.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.include",
    "page": "重要组件",
    "title": "Base.include",
    "category": "function",
    "text": "Base.include([m::Module,] path::AbstractString)\n\nEvaluate the contents of the input source file in the global scope of module m. Every module (except those defined with baremodule) has its own 1-argument definition of include, which evaluates the file in that module. Returns the result of the last evaluated expression of the input file. During including, a task-local include path is set to the directory containing the file. Nested calls to include will search relative to that path. This function is typically used to load source interactively, or to combine files in packages that are broken into multiple source files.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.MainInclude.include",
    "page": "重要组件",
    "title": "Base.MainInclude.include",
    "category": "function",
    "text": "include(path::AbstractString)\n\nEvaluate the contents of the input source file in the global scope of the containing module. Every module (except those defined with baremodule) has its own 1-argument definition of include, which evaluates the file in that module. Returns the result of the last evaluated expression of the input file. During including, a task-local include path is set to the directory containing the file. Nested calls to include will search relative to that path. This function is typically used to load source interactively, or to combine files in packages that are broken into multiple source files.\n\nUse Base.include to evaluate a file into another module.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.include_string",
    "page": "重要组件",
    "title": "Base.include_string",
    "category": "function",
    "text": "include_string(m::Module, code::AbstractString, filename::AbstractString=\"string\")\n\nLike include, except reads code from the given string rather than from a file.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.include_dependency",
    "page": "重要组件",
    "title": "Base.include_dependency",
    "category": "function",
    "text": "include_dependency(path::AbstractString)\n\nIn a module, declare that the file specified by path (relative or absolute) is a dependency for precompilation; that is, the module will need to be recompiled if this file changes.\n\nThis is only needed if your module depends on a file that is not used via include. It has no effect outside of compilation.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.which-Tuple{Any,Any}",
    "page": "重要组件",
    "title": "Base.which",
    "category": "method",
    "text": "which(f, types)\n\nReturns the method of f (a Method object) that would be called for arguments of the given types.\n\nIf types is an abstract type, then the method that would be called by invoke is returned.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.methods",
    "page": "重要组件",
    "title": "Base.methods",
    "category": "function",
    "text": "methods(f, [types])\n\nReturns the method table for f.\n\nIf types is specified, returns an array of methods whose types match.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@show",
    "page": "重要组件",
    "title": "Base.@show",
    "category": "macro",
    "text": "@show\n\nShow an expression and result, returning the result.\n\n\n\n\n\n"
},

{
    "location": "base/base/#ans",
    "page": "重要组件",
    "title": "ans",
    "category": "keyword",
    "text": "ans\n\nA variable referring to the last computed value, automatically set at the interactive prompt.\n\n\n\n\n\n"
},

{
    "location": "base/base/#随便看看-1",
    "page": "重要组件",
    "title": "随便看看",
    "category": "section",
    "text": "Base.exit\nBase.atexit\nBase.isinteractive\nBase.summarysize\nBase.require\nBase.compilecache\nBase.__precompile__\nBase.include\nBase.MainInclude.include\nBase.include_string\nBase.include_dependency\nBase.which(::Any, ::Any)\nBase.methods\nBase.@show\nans<!-- ## Keywords -->"
},

{
    "location": "base/base/#module",
    "page": "重要组件",
    "title": "module",
    "category": "keyword",
    "text": "module\n\nmodule 会声明一个 Module 类型的实例用于描述一个独立的变量名空间。在一个模块（module）里，你可以控制 来自于其它模块的名字是否可见（通过载入，import），你也可以决定你的名字有哪些是可以公开的（通过暴露，export）。 模块使得你在在创建上层定义时无需担心命名冲突。查看手册中关于模块的部分以获取更多细节。\n\n例子\n\nmodule Foo\nimport Base.show\nexport MyType, foo\n\nstruct MyType\n    x\nend\n\nbar(x) = 2x\nfoo(a::MyType) = bar(a.x) + 1\nshow(io::IO, a::MyType) = print(io, \"MyType $(a.x)\")\nend\n\n\n\n\n\n"
},

{
    "location": "base/base/#export",
    "page": "重要组件",
    "title": "export",
    "category": "keyword",
    "text": "export\n\nexport被用来在模块中告诉Julia哪些函数或者名字可以由用户使用。例如export foo将在using这个module的时候使得 foo可以直接被访问到。查看手册中关于模块的部分以获取更多细节。\n\n\n\n\n\n"
},

{
    "location": "base/base/#import",
    "page": "重要组件",
    "title": "import",
    "category": "keyword",
    "text": "import\n\nimport Foo 将会加载一个名为 Foo 的模块（module）或者一个包。 Foo模块中的名称可以通过点来访问到（例如，输入Foo.foo可以获取到foo）。 查看手册中关于模块的部分以获取更多细节。\n\n\n\n\n\n"
},

{
    "location": "base/base/#using",
    "page": "重要组件",
    "title": "using",
    "category": "keyword",
    "text": "using\n\nusing Foo 将会加载一个名为 Foo 的模块（module）或者一个包，然后其export的名称将可以直接使用。 不论是否被export，名称都可以通过点来访问（例如，输入Foo.foo来访问到foo）。查看手册中关于模块的部分以获取更多细节。\n\n\n\n\n\n"
},

{
    "location": "base/base/#baremodule",
    "page": "重要组件",
    "title": "baremodule",
    "category": "keyword",
    "text": "baremodule\n\nbaremodule 将声明一个不包含using Base或者eval定义的模块。但是它将仍然载入Core模块。\n\n\n\n\n\n"
},

{
    "location": "base/base/#function",
    "page": "重要组件",
    "title": "function",
    "category": "keyword",
    "text": "function\n\n函数由function关键词定义：\n\nfunction add(a, b)\n    return a + b\nend\n\n或者是更短的形式：\n\nadd(a, b) = a + b\n\nreturn关键词的使用方法和其它语言完全一样，但是常常是不使用的。一个没有显示声明return的函数将返回函数体最后一个表达式。\n\n\n\n\n\n"
},

{
    "location": "base/base/#macro",
    "page": "重要组件",
    "title": "macro",
    "category": "keyword",
    "text": "macro\n\nmacro定义了一种会将生成的代码包含在最终程序体中的方法，这称之为宏。一个宏将一系列输入映射到一个表达式，然后所返回的表达式将会被 直接进行编译而不需要在运行时调用eval函数。宏的输入可以包括表达式，字面量，符号。例如：\n\n例子\n\njulia> macro sayhello(name)\n           return :( println(\"Hello, \", $name, \"!\") )\n       end\n@sayhello (macro with 1 method)\n\njulia> @sayhello \"小明\"\nHello, 小明!\n\n\n\n\n\n"
},

{
    "location": "base/base/#return",
    "page": "重要组件",
    "title": "return",
    "category": "keyword",
    "text": "return\n\nreturn can be used in function bodies to exit early and return a given value, e.g.\n\nfunction compare(a, b)\n    a == b && return \"equal to\"\n    a < b ? \"less than\" : \"greater than\"\nend\n\nIn general you can place a return statement anywhere within a function body, including within deeply nested loops or conditionals, but be careful with do blocks. For example:\n\nfunction test1(xs)\n    for x in xs\n        iseven(x) && return 2x\n    end\nend\n\nfunction test2(xs)\n    map(xs) do x\n        iseven(x) && return 2x\n        x\n    end\nend\n\nIn the first example, the return breaks out of its enclosing function as soon as it hits an even number, so test1([5,6,7]) returns 12.\n\nYou might expect the second example to behave the same way, but in fact the return there only breaks out of the inner function (inside the do block) and gives a value back to map. test2([5,6,7]) then returns [5,12,7].\n\n\n\n\n\n"
},

{
    "location": "base/base/#do",
    "page": "重要组件",
    "title": "do",
    "category": "keyword",
    "text": "do\n\nCreate an anonymous function. For example:\n\nmap(1:10) do x\n    2x\nend\n\nis equivalent to map(x->2x, 1:10).\n\nUse multiple arguments like so:\n\nmap(1:10, 11:20) do x, y\n    x + y\nend\n\n\n\n\n\n"
},

{
    "location": "base/base/#begin",
    "page": "重要组件",
    "title": "begin",
    "category": "keyword",
    "text": "begin\n\nbegin...end denotes a block of code.\n\nbegin\n    println(\"Hello, \")\n    println(\"World!\")\nend\n\nUsually begin will not be necessary, since keywords such as function and let implicitly begin blocks of code. See also ;.\n\n\n\n\n\n"
},

{
    "location": "base/base/#end",
    "page": "重要组件",
    "title": "end",
    "category": "keyword",
    "text": "end\n\nend marks the conclusion of a block of expressions, for example module, struct, mutable struct, begin, let, for etc. end may also be used when indexing into an array to represent the last index of a dimension.\n\nExamples\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> A[end, :]\n2-element Array{Int64,1}:\n 3\n 4\n\n\n\n\n\n"
},

{
    "location": "base/base/#let",
    "page": "重要组件",
    "title": "let",
    "category": "keyword",
    "text": "let\n\nlet会在每次被运行时声明一个新的变量绑定。这个新的变量绑定将拥有一个新的地址。这里的不同只有当 变量通过闭包生存在它们的作用域外时才会显现。let语法接受逗号分割的一系列赋值语句和变量名：\n\nlet var1 = value1, var2, var3 = value3\n    code\nend\n\n这些赋值语句是按照顺序求值的，等号右边的表达式将会首先求值，然后才绑定给左边的变量。因此这使得 let x = x 这样的表达式有意义，因为这两个x变量将具有不同的地址。\n\n\n\n\n\n"
},

{
    "location": "base/base/#if",
    "page": "重要组件",
    "title": "if",
    "category": "keyword",
    "text": "if/elseif/else\n\nif/elseif/else performs conditional evaluation, which allows portions of code to be evaluated or not evaluated depending on the value of a boolean expression. Here is the anatomy of the if/elseif/else conditional syntax:\n\nif x < y\n    println(\"x is less than y\")\nelseif x > y\n    println(\"x is greater than y\")\nelse\n    println(\"x is equal to y\")\nend\n\nIf the condition expression x < y is true, then the corresponding block is evaluated; otherwise the condition expression x > y is evaluated, and if it is true, the corresponding block is evaluated; if neither expression is true, the else block is evaluated. The elseif and else blocks are optional, and as many elseif blocks as desired can be used.\n\n\n\n\n\n"
},

{
    "location": "base/base/#for",
    "page": "重要组件",
    "title": "for",
    "category": "keyword",
    "text": "for\n\nfor loops repeatedly evaluate the body of the loop by iterating over a sequence of values.\n\nExamples\n\njulia> for i in [1, 4, 0]\n           println(i)\n       end\n1\n4\n0\n\n\n\n\n\n"
},

{
    "location": "base/base/#while",
    "page": "重要组件",
    "title": "while",
    "category": "keyword",
    "text": "while\n\nwhile loops repeatedly evaluate a conditional expression, and continues evaluating the body of the while loop so long as the expression remains true. If the condition expression is false when the while loop is first reached, the body is never evaluated.\n\nExamples\n\njulia> i = 1\n1\n\njulia> while i < 5\n           println(i)\n           global i += 1\n       end\n1\n2\n3\n4\n\n\n\n\n\n"
},

{
    "location": "base/base/#break",
    "page": "重要组件",
    "title": "break",
    "category": "keyword",
    "text": "break\n\nBreak out of a loop immediately.\n\nExamples\n\njulia> i = 0\n0\n\njulia> while true\n           global i += 1\n           i > 5 && break\n           println(i)\n       end\n1\n2\n3\n4\n5\n\n\n\n\n\n"
},

{
    "location": "base/base/#continue",
    "page": "重要组件",
    "title": "continue",
    "category": "keyword",
    "text": "continue\n\nSkip the rest of the current loop iteration.\n\nExamples\n\njulia> for i = 1:6\n           iseven(i) && continue\n           println(i)\n       end\n1\n3\n5\n\n\n\n\n\n"
},

{
    "location": "base/base/#try",
    "page": "重要组件",
    "title": "try",
    "category": "keyword",
    "text": "try/catch\n\nA try/catch statement allows for Exceptions to be tested for. For example, a customized square root function can be written to automatically call either the real or complex square root method on demand using Exceptions:\n\nf(x) = try\n    sqrt(x)\ncatch\n    sqrt(complex(x, 0))\nend\n\ntry/catch statements also allow the Exception to be saved in a variable, e.g. catch y.\n\nThe power of the try/catch construct lies in the ability to unwind a deeply nested computation immediately to a much higher level in the stack of calling functions.\n\n\n\n\n\n"
},

{
    "location": "base/base/#finally",
    "page": "重要组件",
    "title": "finally",
    "category": "keyword",
    "text": "finally\n\nRun some code when a given block of code exits, regardless of how it exits. For example, here is how we can guarantee that an opened file is closed:\n\nf = open(\"file\")\ntry\n    operate_on_file(f)\nfinally\n    close(f)\nend\n\nWhen control leaves the try block (for example, due to a return, or just finishing normally), close(f) will be executed. If the try block exits due to an exception, the exception will continue propagating. A catch block may be combined with try and finally as well. In this case the finally block will run after catch has handled the error.\n\n\n\n\n\n"
},

{
    "location": "base/base/#quote",
    "page": "重要组件",
    "title": "quote",
    "category": "keyword",
    "text": "quote\n\nquote 会将其包含的代码扩变成一个多重的表达式对象，而无需显示调用Expr的构造器。这称之为引用，比如说\n\nex = quote\n    x = 1\n    y = 2\n    x + y\nend\n\n和其它引用方式不同的是，:( ... )形式的引用（被包含时）将会在表达式树里引入一个在操作表达式树时必须要考虑的QuoteNode元素。 而在其它场景下，:( ... )和 quote .. end 代码块是被同等对待的。\n\n\n\n\n\n"
},

{
    "location": "base/base/#local",
    "page": "重要组件",
    "title": "local",
    "category": "keyword",
    "text": "local\n\nlocal将会定义一个新的局部变量。\n\n查看手册：变量作用域以获取更详细的信息。\n\n例子\n\njulia> function foo(n)\n           x = 0\n           for i = 1:n\n               local x # introduce a loop-local x\n               x = i\n           end\n           x\n       end\nfoo (generic function with 1 method)\n\njulia> foo(10)\n0\n\n\n\n\n\n"
},

{
    "location": "base/base/#global",
    "page": "重要组件",
    "title": "global",
    "category": "keyword",
    "text": "global\n\nglobal x将会使得当前作用域和当前作用所包含的作用域里的x指向名为x的全局变量。 查看手册：变量作用域以获取更多信息。\n\n例子\n\njulia> z = 3\n3\n\njulia> function foo()\n           global z = 6 # use the z variable defined outside foo\n       end\nfoo (generic function with 1 method)\n\njulia> foo()\n6\n\njulia> z\n6\n\n\n\n\n\n"
},

{
    "location": "base/base/#const",
    "page": "重要组件",
    "title": "const",
    "category": "keyword",
    "text": "const\n\nconst被用来声明常数全局变量。在大部分（尤其是性能敏感的代码）全局变量应当被声明为常数。\n\nconst x = 5\n\n可以使用单个const声明多个常数变量。\n\nconst y, z = 7, 11\n\n注意const只会作用于一个=操作，因此 const x = y = 1 声明了 x 是常数，而 y 不是。在另一方面， const x = const y = 1声明了x和y都是常数。\n\n注意 “常数性质” 并不会强制容器内部变成常数，所以如果x是一个数组或者字典（举例来讲）你仍然可以给它们添加 或者删除元素。\n\n严格来讲，你甚至可以重新定义 const （常数）变量，尽管这将会让编译器产生一个警告。唯一严格的要求是这个变量的 类型不能改变，这也是为什么常数变量会比一般的全局变量更快的原因。\n\n\n\n\n\n"
},

{
    "location": "base/base/#struct",
    "page": "重要组件",
    "title": "struct",
    "category": "keyword",
    "text": "struct\n\nThe most commonly used kind of type in Julia is a struct, specified as a name and a set of fields.\n\nstruct Point\n    x\n    y\nend\n\nFields can have type restrictions, which may be parameterized:\n\n    struct Point{X}\n        x::X\n        y::Float64\n    end\n\nA struct can also declare an abstract super type via <: syntax:\n\nstruct Point <: AbstractPoint\n    x\n    y\nend\n\nstructs are immutable by default; an instance of one of these types cannot be modified after construction. Use mutable struct instead to declare a type whose instances can be modified.\n\nSee the manual section on Composite Types for more details, such as how to define constructors.\n\n\n\n\n\n"
},

{
    "location": "base/base/#mutable struct",
    "page": "重要组件",
    "title": "mutable struct",
    "category": "keyword",
    "text": "mutable struct\n\nmutable struct is similar to struct, but additionally allows the fields of the type to be set after construction. See the manual section on Composite Types for more information.\n\n\n\n\n\n"
},

{
    "location": "base/base/#abstract type",
    "page": "重要组件",
    "title": "abstract type",
    "category": "keyword",
    "text": "abstract type\n\nabstract type声明来一个不能实例化的类型，它将仅仅作为类型图中的一个节点存在，从而能够描述一系列相互关联的具体类型（concrete type）： 这些具体类型都是抽象类型的子节点。抽象类型在概念上使得Julia的类型系统不仅仅是一系列对象的集合。例如：\n\nabstract type Number end\nabstract type Real <: Number end\n\nNumber没有父节点（父类型）, 而 Real 是 Number 的一个抽象子类型。\n\n\n\n\n\n"
},

{
    "location": "base/base/#primitive type",
    "page": "重要组件",
    "title": "primitive type",
    "category": "keyword",
    "text": "primitive type\n\nprimitive type声明了一个其数据仅仅由一系列二进制数表示的具体类型。比较常见的例子是整数类型和浮点类型。下面是一些内置 的原始类型（primitive type）：\n\nprimitive type Char 32 end\nprimitive type Bool <: Integer 8 end\n\n名称后面的数字表达了这个类型存储所需的比特数目。目前这个数字要求是8 bit的倍数。Bool类型的声明展示了一个原始类型如何 选择成为另一个类型的子类型。\n\n\n\n\n\n"
},

{
    "location": "base/base/#...",
    "page": "重要组件",
    "title": "...",
    "category": "keyword",
    "text": "...\n\nThe \"splat\" operator, ..., represents a sequence of arguments. ... can be used in function definitions, to indicate that the function accepts an arbitrary number of arguments. ... can also be used to apply a function to a sequence of arguments.\n\nExamples\n\njulia> add(xs...) = reduce(+, xs)\nadd (generic function with 1 method)\n\njulia> add(1, 2, 3, 4, 5)\n15\n\njulia> add([1, 2, 3]...)\n6\n\njulia> add(7, 1:100..., 1000:1100...)\n111107\n\n\n\n\n\n"
},

{
    "location": "base/base/#;",
    "page": "重要组件",
    "title": ";",
    "category": "keyword",
    "text": ";\n\n; has a similar role in Julia as in many C-like languages, and is used to delimit the end of the previous statement. ; is not necessary after new lines, but can be used to separate statements on a single line or to join statements into a single expression. ; is also used to suppress output printing in the REPL and similar interfaces.\n\nExamples\n\njulia> function foo()\n           x = \"Hello, \"; x *= \"World!\"\n           return x\n       end\nfoo (generic function with 1 method)\n\njulia> bar() = (x = \"Hello, Mars!\"; return x)\nbar (generic function with 1 method)\n\njulia> foo();\n\njulia> bar()\n\"Hello, Mars!\"\n\n\n\n\n\n"
},

{
    "location": "base/base/#关键词-1",
    "page": "重要组件",
    "title": "关键词",
    "category": "section",
    "text": "module\nexport\nimport\nusing\nbaremodule\nfunction\nmacro\nreturn\ndo\nbegin\nend\nlet\nif\nfor\nwhile\nbreak\ncontinue\ntry\nfinally\nquote\nlocal\nglobal\nconst\nstruct\nmutable struct\nabstract type\nprimitive type\n...\n;<!-- ## Base Modules -->"
},

{
    "location": "base/base/#Base",
    "page": "重要组件",
    "title": "Base",
    "category": "keyword",
    "text": "The base library of Julia.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Broadcast",
    "page": "重要组件",
    "title": "Base.Broadcast",
    "category": "module",
    "text": "Base.Broadcast\n\nModule containing the broadcasting implementation.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Docs",
    "page": "重要组件",
    "title": "Base.Docs",
    "category": "module",
    "text": "Docs\n\nThe Docs module provides the @doc macro which can be used to set and retrieve documentation metadata for Julia objects.\n\nPlease see the manual section on documentation for more information.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Iterators",
    "page": "重要组件",
    "title": "Base.Iterators",
    "category": "module",
    "text": "Methods for working with Iterators.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Libc",
    "page": "重要组件",
    "title": "Base.Libc",
    "category": "module",
    "text": "Interface to libc, the C standard library.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Meta",
    "page": "重要组件",
    "title": "Base.Meta",
    "category": "module",
    "text": "Convenience functions for metaprogramming.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.StackTraces",
    "page": "重要组件",
    "title": "Base.StackTraces",
    "category": "module",
    "text": "Tools for collecting and manipulating stack traces. Mainly used for building errors.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Sys",
    "page": "重要组件",
    "title": "Base.Sys",
    "category": "module",
    "text": "Provide methods for retrieving information about hardware and the operating system.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Threads",
    "page": "重要组件",
    "title": "Base.Threads",
    "category": "module",
    "text": "Experimental multithreading support.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.GC",
    "page": "重要组件",
    "title": "Base.GC",
    "category": "module",
    "text": "Base.GC\n\nModule with garbage collection utilities.\n\n\n\n\n\n"
},

{
    "location": "base/base/#基础库-1",
    "page": "重要组件",
    "title": "基础库",
    "category": "section",
    "text": "Base.Base\nBase.Broadcast\nBase.Docs\nBase.Iterators\nBase.Libc\nBase.Meta\nBase.StackTraces\nBase.Sys\nBase.Threads\nBase.GC<!-- ## All Objects -->"
},

{
    "location": "base/base/#Core.:===",
    "page": "重要组件",
    "title": "Core.:===",
    "category": "function",
    "text": "===(x,y) -> Bool\n≡(x,y) -> Bool\n\nDetermine whether x and y are identical, in the sense that no program could distinguish them. First the types of x and y are compared. If those are identical, mutable objects are compared by address in memory and immutable objects (such as numbers) are compared by contents at the bit level. This function is sometimes called \"egal\". It always returns a Bool value.\n\nExamples\n\njulia> a = [1, 2]; b = [1, 2];\n\njulia> a == b\ntrue\n\njulia> a === b\nfalse\n\njulia> a === a\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.isa",
    "page": "重要组件",
    "title": "Core.isa",
    "category": "function",
    "text": "isa(x, type) -> Bool\n\nDetermine whether x is of the given type. Can also be used as an infix operator, e.g. x isa type.\n\nExamples\n\njulia> isa(1, Int)\ntrue\n\njulia> isa(1, Matrix)\nfalse\n\njulia> isa(1, Char)\nfalse\n\njulia> isa(1, Number)\ntrue\n\njulia> 1 isa Number\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.isequal",
    "page": "重要组件",
    "title": "Base.isequal",
    "category": "function",
    "text": "isequal(x, y)\n\nSimilar to ==, except for the treatment of floating point numbers and of missing values. isequal treats all floating-point NaN values as equal to each other, treats -0.0 as unequal to 0.0, and missing as equal to missing. Always returns a Bool value.\n\nImplementation\n\nThe default implementation of isequal calls ==, so a type that does not involve floating-point values generally only needs to define ==.\n\nisequal is the comparison function used by hash tables (Dict). isequal(x,y) must imply that hash(x) == hash(y).\n\nThis typically means that types for which a custom == or isequal method exists must implement a corresponding hash method (and vice versa). Collections typically implement isequal by calling isequal recursively on all contents.\n\nScalar types generally do not need to implement isequal separate from ==, unless they represent floating-point numbers amenable to a more efficient implementation than that provided as a generic fallback (based on isnan, signbit, and ==).\n\nExamples\n\njulia> isequal([1., NaN], [1., NaN])\ntrue\n\njulia> [1., NaN] == [1., NaN]\nfalse\n\njulia> 0.0 == -0.0\ntrue\n\njulia> isequal(0.0, -0.0)\nfalse\n\n\n\n\n\nisequal(x)\n\nCreate a function that compares its argument to x using isequal, i.e. a function equivalent to y -> isequal(y, x).\n\nThe returned function is of type Base.Fix2{typeof(isequal)}, which can be used to implement specialized methods.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.isless",
    "page": "重要组件",
    "title": "Base.isless",
    "category": "function",
    "text": "isless(x, y)\n\nTest whether x is less than y, according to a canonical total order. Values that are normally unordered, such as NaN, are ordered in an arbitrary but consistent fashion. missing values are ordered last.\n\nThis is the default comparison used by sort.\n\nImplementation\n\nNon-numeric types with a canonical total order should implement this function. Numeric types only need to implement it if they have special values such as NaN. Types with a canonical partial order should implement <.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.ifelse",
    "page": "重要组件",
    "title": "Core.ifelse",
    "category": "function",
    "text": "ifelse(condition::Bool, x, y)\n\nReturn x if condition is true, otherwise return y. This differs from ? or if in that it is an ordinary function, so all the arguments are evaluated first. In some cases, using ifelse instead of an if statement can eliminate the branch in generated code and provide higher performance in tight loops.\n\nExamples\n\njulia> ifelse(1 > 2, 1, 2)\n2\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.typeassert",
    "page": "重要组件",
    "title": "Core.typeassert",
    "category": "function",
    "text": "typeassert(x, type)\n\nThrow a TypeError unless x isa type. The syntax x::type calls this function.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.typeof",
    "page": "重要组件",
    "title": "Core.typeof",
    "category": "function",
    "text": "typeof(x)\n\nGet the concrete type of x.\n\nExamples\n\njulia> a = 1//2;\n\njulia> typeof(a)\nRational{Int64}\n\njulia> M = [1 2; 3.5 4];\n\njulia> typeof(M)\nArray{Float64,2}\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.tuple",
    "page": "重要组件",
    "title": "Core.tuple",
    "category": "function",
    "text": "tuple(xs...)\n\nConstruct a tuple of the given objects.\n\nExamples\n\njulia> tuple(1, \'a\', pi)\n(1, \'a\', π = 3.1415926535897...)\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.ntuple",
    "page": "重要组件",
    "title": "Base.ntuple",
    "category": "function",
    "text": "ntuple(f::Function, n::Integer)\n\nCreate a tuple of length n, computing each element as f(i), where i is the index of the element.\n\nExamples\n\njulia> ntuple(i -> 2*i, 4)\n(2, 4, 6, 8)\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.objectid",
    "page": "重要组件",
    "title": "Base.objectid",
    "category": "function",
    "text": "objectid(x)\n\nGet a hash value for x based on object identity. objectid(x)==objectid(y) if x === y.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.hash",
    "page": "重要组件",
    "title": "Base.hash",
    "category": "function",
    "text": "hash(x[, h::UInt])\n\nCompute an integer hash code such that isequal(x,y) implies hash(x)==hash(y). The optional second argument h is a hash code to be mixed with the result.\n\nNew types should implement the 2-argument form, typically by calling the 2-argument hash method recursively in order to mix hashes of the contents with each other (and with h). Typically, any type that implements hash should also implement its own == (hence isequal) to guarantee the property mentioned above. Types supporting subtraction (operator -) should also implement widen, which is required to hash values inside heterogeneous arrays.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.finalizer",
    "page": "重要组件",
    "title": "Base.finalizer",
    "category": "function",
    "text": "finalizer(f, x)\n\nRegister a function f(x) to be called when there are no program-accessible references to x, and return x. The type of x must be a mutable struct, otherwise the behavior of this function is unpredictable.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.finalize",
    "page": "重要组件",
    "title": "Base.finalize",
    "category": "function",
    "text": "finalize(x)\n\nImmediately run finalizers registered for object x.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.copy",
    "page": "重要组件",
    "title": "Base.copy",
    "category": "function",
    "text": "copy(x)\n\nCreate a shallow copy of x: the outer structure is copied, but not all internal values. For example, copying an array produces a new array with identically-same elements as the original.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.deepcopy",
    "page": "重要组件",
    "title": "Base.deepcopy",
    "category": "function",
    "text": "deepcopy(x)\n\nCreate a deep copy of x: everything is copied recursively, resulting in a fully independent object. For example, deep-copying an array produces a new array whose elements are deep copies of the original elements. Calling deepcopy on an object should generally have the same effect as serializing and then deserializing it.\n\nAs a special case, functions can only be actually deep-copied if they are anonymous, otherwise they are just copied. The difference is only relevant in the case of closures, i.e. functions which may contain hidden internal references.\n\nWhile it isn\'t normally necessary, user-defined types can override the default deepcopy behavior by defining a specialized version of the function deepcopy_internal(x::T, dict::IdDict) (which shouldn\'t otherwise be used), where T is the type to be specialized for, and dict keeps track of objects copied so far within the recursion. Within the definition, deepcopy_internal should be used in place of deepcopy, and the dict variable should be updated as appropriate before returning.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.getproperty",
    "page": "重要组件",
    "title": "Base.getproperty",
    "category": "function",
    "text": "getproperty(value, name::Symbol)\n\nThe syntax a.b calls getproperty(a, :b).\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.setproperty!",
    "page": "重要组件",
    "title": "Base.setproperty!",
    "category": "function",
    "text": "setproperty!(value, name::Symbol, x)\n\nThe syntax a.b = c calls setproperty!(a, :b, c).\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.propertynames",
    "page": "重要组件",
    "title": "Base.propertynames",
    "category": "function",
    "text": "propertynames(x, private=false)\n\nGet a tuple or a vector of the properties (x.property) of an object x. This is typically the same as fieldnames(typeof(x)), but types that overload getproperty should generally overload propertynames as well to get the properties of an instance of the type.\n\npropertynames(x) may return only \"public\" property names that are part of the documented interface of x.   If you want it to also return \"private\" fieldnames intended for internal use, pass true for the optional second argument. REPL tab completion on x. shows only the private=false properties.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.getfield",
    "page": "重要组件",
    "title": "Core.getfield",
    "category": "function",
    "text": "getfield(value, name::Symbol)\n\nExtract a named field from a value of composite type. See also getproperty.\n\nExamples\n\njulia> a = 1//2\n1//2\n\njulia> getfield(a, :num)\n1\n\njulia> a.num\n1\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.setfield!",
    "page": "重要组件",
    "title": "Core.setfield!",
    "category": "function",
    "text": "setfield!(value, name::Symbol, x)\n\nAssign x to a named field in value of composite type. The value must be mutable and x must be a subtype of fieldtype(typeof(value), name). See also setproperty!.\n\nExamples\n\njulia> mutable struct MyMutableStruct\n           field::Int\n       end\n\njulia> a = MyMutableStruct(1);\n\njulia> setfield!(a, :field, 2);\n\njulia> getfield(a, :field)\n2\n\njulia> a = 1//2\n1//2\n\njulia> setfield!(a, :num, 3);\nERROR: type Rational is immutable\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.isdefined",
    "page": "重要组件",
    "title": "Core.isdefined",
    "category": "function",
    "text": "isdefined(m::Module, s::Symbol)\nisdefined(object, s::Symbol)\nisdefined(object, index::Int)\n\nTests whether an assignable location is defined. The arguments can be a module and a symbol or a composite object and field name (as a symbol) or index.\n\nExamples\n\njulia> isdefined(Base, :sum)\ntrue\n\njulia> isdefined(Base, :NonExistentMethod)\nfalse\n\njulia> a = 1//2;\n\njulia> isdefined(a, 2)\ntrue\n\njulia> isdefined(a, 3)\nfalse\n\njulia> isdefined(a, :num)\ntrue\n\njulia> isdefined(a, :numerator)\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@isdefined",
    "page": "重要组件",
    "title": "Base.@isdefined",
    "category": "macro",
    "text": "@isdefined s -> Bool\n\nTests whether variable s is defined in the current scope.\n\nExamples\n\njulia> function f()\n           println(@isdefined x)\n           x = 3\n           println(@isdefined x)\n       end\nf (generic function with 1 method)\n\njulia> f()\nfalse\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.convert",
    "page": "重要组件",
    "title": "Base.convert",
    "category": "function",
    "text": "convert(T, x)\n\nConvert x to a value of type T.\n\nIf T is an Integer type, an InexactError will be raised if x is not representable by T, for example if x is not integer-valued, or is outside the range supported by T.\n\nExamples\n\njulia> convert(Int, 3.0)\n3\n\njulia> convert(Int, 3.5)\nERROR: InexactError: Int64(Int64, 3.5)\nStacktrace:\n[...]\n\nIf T is a AbstractFloat or Rational type, then it will return the closest value to x representable by T.\n\njulia> x = 1/3\n0.3333333333333333\n\njulia> convert(Float32, x)\n0.33333334f0\n\njulia> convert(Rational{Int32}, x)\n1//3\n\njulia> convert(Rational{Int64}, x)\n6004799503160661//18014398509481984\n\nIf T is a collection type and x a collection, the result of convert(T, x) may alias all or part of x.\n\njulia> x = Int[1, 2, 3];\n\njulia> y = convert(Vector{Int}, x);\n\njulia> y === x\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.promote",
    "page": "重要组件",
    "title": "Base.promote",
    "category": "function",
    "text": "promote(xs...)\n\nConvert all arguments to a common type, and return them all (as a tuple). If no arguments can be converted, an error is raised.\n\nExamples\n\njulia> promote(Int8(1), Float16(4.5), Float32(4.1))\n(1.0f0, 4.5f0, 4.1f0)\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.oftype",
    "page": "重要组件",
    "title": "Base.oftype",
    "category": "function",
    "text": "oftype(x, y)\n\nConvert y to the type of x (convert(typeof(x), y)).\n\nExamples\n\njulia> x = 4;\n\njulia> y = 3.;\n\njulia> oftype(x, y)\n3\n\njulia> oftype(y, x)\n4.0\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.widen",
    "page": "重要组件",
    "title": "Base.widen",
    "category": "function",
    "text": "widen(x)\n\nIf x is a type, return a \"larger\" type, defined so that arithmetic operations + and - are guaranteed not to overflow nor lose precision for any combination of values that type x can hold.\n\nFor fixed-size integer types less than 128 bits, widen will return a type with twice the number of bits.\n\nIf x is a value, it is converted to widen(typeof(x)).\n\nExamples\n\njulia> widen(Int32)\nInt64\n\njulia> widen(1.5f0)\n1.5\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.identity",
    "page": "重要组件",
    "title": "Base.identity",
    "category": "function",
    "text": "identity(x)\n\nThe identity function. Returns its argument.\n\nExamples\n\njulia> identity(\"Well, what did you expect?\")\n\"Well, what did you expect?\"\n\n\n\n\n\n"
},

{
    "location": "base/base/#所有的对象-1",
    "page": "重要组件",
    "title": "所有的对象",
    "category": "section",
    "text": "Core.:(===)\nCore.isa\nBase.isequal\nBase.isless\nBase.ifelse\nCore.typeassert\nCore.typeof\nCore.tuple\nBase.ntuple\nBase.objectid\nBase.hash\nBase.finalizer\nBase.finalize\nBase.copy\nBase.deepcopy\nBase.getproperty\nBase.setproperty!\nBase.propertynames\nCore.getfield\nCore.setfield!\nCore.isdefined\nBase.@isdefined\nBase.convert\nBase.promote\nBase.oftype\nBase.widen\nBase.identity<!-- ## Properties of Types -->"
},

{
    "location": "base/base/#类型的性质-1",
    "page": "重要组件",
    "title": "类型的性质",
    "category": "section",
    "text": "<!-- ### Type relations -->"
},

{
    "location": "base/base/#Base.supertype",
    "page": "重要组件",
    "title": "Base.supertype",
    "category": "function",
    "text": "supertype(T::DataType)\n\nReturn the supertype of DataType T.\n\nExamples\n\njulia> supertype(Int32)\nSigned\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.:<:",
    "page": "重要组件",
    "title": "Core.:<:",
    "category": "function",
    "text": "<:(T1, T2)\n\nSubtype operator: returns true if and only if all values of type T1 are also of type T2.\n\nExamples\n\njulia> Float64 <: AbstractFloat\ntrue\n\njulia> Vector{Int} <: AbstractArray\ntrue\n\njulia> Matrix{Float64} <: Matrix{AbstractFloat}\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.:>:",
    "page": "重要组件",
    "title": "Base.:>:",
    "category": "function",
    "text": ">:(T1, T2)\n\nSupertype operator, equivalent to T2 <: T1.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.typejoin",
    "page": "重要组件",
    "title": "Base.typejoin",
    "category": "function",
    "text": "typejoin(T, S)\n\nReturn the closest common ancestor of T and S, i.e. the narrowest type from which they both inherit.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.typeintersect",
    "page": "重要组件",
    "title": "Base.typeintersect",
    "category": "function",
    "text": "typeintersect(T, S)\n\nCompute a type that contains the intersection of T and S. Usually this will be the smallest such type or one close to it.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.promote_type",
    "page": "重要组件",
    "title": "Base.promote_type",
    "category": "function",
    "text": "promote_type(type1, type2)\n\nPromotion refers to converting values of mixed types to a single common type. promote_type represents the default promotion behavior in Julia when operators (usually mathematical) are given arguments of differing types. promote_type generally tries to return a type which can at least approximate most values of either input type without excessively widening.  Some loss is tolerated; for example, promote_type(Int64, Float64) returns Float64 even though strictly, not all Int64 values can be represented exactly as Float64 values.\n\njulia> promote_type(Int64, Float64)\nFloat64\n\njulia> promote_type(Int32, Int64)\nInt64\n\njulia> promote_type(Float32, BigInt)\nBigFloat\n\njulia> promote_type(Int16, Float16)\nFloat16\n\njulia> promote_type(Int64, Float16)\nFloat16\n\njulia> promote_type(Int8, UInt16)\nUInt16\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.promote_rule",
    "page": "重要组件",
    "title": "Base.promote_rule",
    "category": "function",
    "text": "promote_rule(type1, type2)\n\nSpecifies what type should be used by promote when given values of types type1 and type2. This function should not be called directly, but should have definitions added to it for new types as appropriate.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.isdispatchtuple",
    "page": "重要组件",
    "title": "Base.isdispatchtuple",
    "category": "function",
    "text": "isdispatchtuple(T)\n\nDetermine whether type T is a tuple \"leaf type\", meaning it could appear as a type signature in dispatch and has no subtypes (or supertypes) which could appear in a call.\n\n\n\n\n\n"
},

{
    "location": "base/base/#类型之间的关系-1",
    "page": "重要组件",
    "title": "类型之间的关系",
    "category": "section",
    "text": "Base.supertype\nCore.:(<:)\nBase.:(>:)\nBase.typejoin\nBase.typeintersect\nBase.promote_type\nBase.promote_rule\nBase.isdispatchtuple<!-- ### Declared structure -->"
},

{
    "location": "base/base/#Base.isimmutable",
    "page": "重要组件",
    "title": "Base.isimmutable",
    "category": "function",
    "text": "isimmutable(v) -> Bool\n\nReturn true iff value v is immutable.  See Mutable Composite Types for a discussion of immutability. Note that this function works on values, so if you give it a type, it will tell you that a value of DataType is mutable.\n\nExamples\n\njulia> isimmutable(1)\ntrue\n\njulia> isimmutable([1,2])\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.isabstracttype",
    "page": "重要组件",
    "title": "Base.isabstracttype",
    "category": "function",
    "text": "Base.isabstracttype(T)\n\nDetermine whether type T was declared as an abstract type (i.e. using the abstract keyword).\n\nExamples\n\njulia> Base.isabstracttype(AbstractArray)\ntrue\n\njulia> Base.isabstracttype(Vector)\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.isprimitivetype",
    "page": "重要组件",
    "title": "Base.isprimitivetype",
    "category": "function",
    "text": "Base.isprimitivetype(T) -> Bool\n\nDetermine whether type T was declared as a primitive type (i.e. using the primitive keyword).\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.isstructtype",
    "page": "重要组件",
    "title": "Base.isstructtype",
    "category": "function",
    "text": "Base.isstructtype(T) -> Bool\n\nDetermine whether type T was declared as a struct type (i.e. using the struct or mutable struct keyword).\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.nameof-Tuple{DataType}",
    "page": "重要组件",
    "title": "Base.nameof",
    "category": "method",
    "text": "nameof(t::DataType) -> Symbol\n\nGet the name of a (potentially UnionAll-wrapped) DataType (without its parent module) as a symbol.\n\nExamples\n\njulia> module Foo\n           struct S{T}\n           end\n       end\nFoo\n\njulia> nameof(Foo.S{T} where T)\n:S\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.fieldnames",
    "page": "重要组件",
    "title": "Base.fieldnames",
    "category": "function",
    "text": "fieldnames(x::DataType)\n\nGet a tuple with the names of the fields of a DataType.\n\nExamples\n\njulia> fieldnames(Rational)\n(:num, :den)\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.fieldname",
    "page": "重要组件",
    "title": "Base.fieldname",
    "category": "function",
    "text": "fieldname(x::DataType, i::Integer)\n\nGet the name of field i of a DataType.\n\nExamples\n\njulia> fieldname(Rational, 1)\n:num\n\njulia> fieldname(Rational, 2)\n:den\n\n\n\n\n\n"
},

{
    "location": "base/base/#声明的结构-1",
    "page": "重要组件",
    "title": "声明的结构",
    "category": "section",
    "text": "Base.isimmutable\nBase.isabstracttype\nBase.isprimitivetype\nBase.isstructtype\nBase.nameof(::DataType)\nBase.fieldnames\nBase.fieldname<!-- ### Memory layout -->"
},

{
    "location": "base/base/#Base.sizeof-Tuple{Type}",
    "page": "重要组件",
    "title": "Base.sizeof",
    "category": "method",
    "text": "sizeof(T::DataType)\nsizeof(obj)\n\nSize, in bytes, of the canonical binary representation of the given DataType T, if any. Size, in bytes, of object obj if it is not DataType.\n\nExamples\n\njulia> sizeof(Float32)\n4\n\njulia> sizeof(ComplexF64)\n16\n\njulia> sizeof(1.0)\n8\n\njulia> sizeof([1.0:10.0;])\n80\n\nIf DataType T does not have a specific size, an error is thrown.\n\njulia> sizeof(AbstractArray)\nERROR: argument is an abstract type; size is indeterminate\nStacktrace:\n[...]\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.isconcretetype",
    "page": "重要组件",
    "title": "Base.isconcretetype",
    "category": "function",
    "text": "isconcretetype(T)\n\nDetermine whether type T is a concrete type, meaning it could have direct instances (values x such that typeof(x) === T).\n\nExamples\n\njulia> isconcretetype(Complex)\nfalse\n\njulia> isconcretetype(Complex{Float32})\ntrue\n\njulia> isconcretetype(Vector{Complex})\ntrue\n\njulia> isconcretetype(Vector{Complex{Float32}})\ntrue\n\njulia> isconcretetype(Union{})\nfalse\n\njulia> isconcretetype(Union{Int,String})\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.isbits",
    "page": "重要组件",
    "title": "Base.isbits",
    "category": "function",
    "text": "isbits(x)\n\nReturn true if x is an instance of an isbitstype type.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.isbitstype",
    "page": "重要组件",
    "title": "Base.isbitstype",
    "category": "function",
    "text": "isbitstype(T)\n\nReturn true if type T is a \"plain data\" type, meaning it is immutable and contains no references to other values, only primitive types and other isbitstype types. Typical examples are numeric types such as UInt8, Float64, and Complex{Float64}. This category of types is significant since they are valid as type parameters, may not track isdefined / isassigned status, and have a defined layout that is compatible with C.\n\nExamples\n\njulia> isbitstype(Complex{Float64})\ntrue\n\njulia> isbitstype(Complex)\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.fieldtype",
    "page": "重要组件",
    "title": "Core.fieldtype",
    "category": "function",
    "text": "fieldtype(T, name::Symbol | index::Int)\n\nDetermine the declared type of a field (specified by name or index) in a composite DataType T.\n\nExamples\n\njulia> struct Foo\n           x::Int64\n           y::String\n       end\n\njulia> fieldtype(Foo, :x)\nInt64\n\njulia> fieldtype(Foo, 2)\nString\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.fieldcount",
    "page": "重要组件",
    "title": "Base.fieldcount",
    "category": "function",
    "text": "fieldcount(t::Type)\n\nGet the number of fields that an instance of the given type would have. An error is thrown if the type is too abstract to determine this.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.fieldoffset",
    "page": "重要组件",
    "title": "Base.fieldoffset",
    "category": "function",
    "text": "fieldoffset(type, i)\n\nThe byte offset of field i of a type relative to the data start. For example, we could use it in the following manner to summarize information about a struct:\n\njulia> structinfo(T) = [(fieldoffset(T,i), fieldname(T,i), fieldtype(T,i)) for i = 1:fieldcount(T)];\n\njulia> structinfo(Base.Filesystem.StatStruct)\n12-element Array{Tuple{UInt64,Symbol,DataType},1}:\n (0x0000000000000000, :device, UInt64)\n (0x0000000000000008, :inode, UInt64)\n (0x0000000000000010, :mode, UInt64)\n (0x0000000000000018, :nlink, Int64)\n (0x0000000000000020, :uid, UInt64)\n (0x0000000000000028, :gid, UInt64)\n (0x0000000000000030, :rdev, UInt64)\n (0x0000000000000038, :size, Int64)\n (0x0000000000000040, :blksize, Int64)\n (0x0000000000000048, :blocks, Int64)\n (0x0000000000000050, :mtime, Float64)\n (0x0000000000000058, :ctime, Float64)\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.datatype_alignment",
    "page": "重要组件",
    "title": "Base.datatype_alignment",
    "category": "function",
    "text": "Base.datatype_alignment(dt::DataType) -> Int\n\nMemory allocation minimum alignment for instances of this type. Can be called on any isconcretetype.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.datatype_haspadding",
    "page": "重要组件",
    "title": "Base.datatype_haspadding",
    "category": "function",
    "text": "Base.datatype_haspadding(dt::DataType) -> Bool\n\nReturn whether the fields of instances of this type are packed in memory, with no intervening padding bytes. Can be called on any isconcretetype.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.datatype_pointerfree",
    "page": "重要组件",
    "title": "Base.datatype_pointerfree",
    "category": "function",
    "text": "Base.datatype_pointerfree(dt::DataType) -> Bool\n\nReturn whether instances of this type can contain references to gc-managed memory. Can be called on any isconcretetype.\n\n\n\n\n\n"
},

{
    "location": "base/base/#内存布局-1",
    "page": "重要组件",
    "title": "内存布局",
    "category": "section",
    "text": "Base.sizeof(::Type)\nBase.isconcretetype\nBase.isbits\nBase.isbitstype\nCore.fieldtype\nBase.fieldcount\nBase.fieldoffset\nBase.datatype_alignment\nBase.datatype_haspadding\nBase.datatype_pointerfree<!-- ### Special values -->"
},

{
    "location": "base/base/#Base.typemin",
    "page": "重要组件",
    "title": "Base.typemin",
    "category": "function",
    "text": "typemin(T)\n\nThe lowest value representable by the given (real) numeric DataType T.\n\nExamples\n\njulia> typemin(Float16)\n-Inf16\n\njulia> typemin(Float32)\n-Inf32\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.typemax",
    "page": "重要组件",
    "title": "Base.typemax",
    "category": "function",
    "text": "typemax(T)\n\nThe highest value representable by the given (real) numeric DataType.\n\nExamples\n\njulia> typemax(Int8)\n127\n\njulia> typemax(UInt32)\n0xffffffff\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.realmin",
    "page": "重要组件",
    "title": "Base.realmin",
    "category": "function",
    "text": "realmin(T)\n\nThe smallest in absolute value non-subnormal value representable by the given floating-point DataType T.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.realmax",
    "page": "重要组件",
    "title": "Base.realmax",
    "category": "function",
    "text": "realmax(T)\n\nThe highest finite value representable by the given floating-point DataType T.\n\nExamples\n\njulia> realmax(Float16)\nFloat16(6.55e4)\n\njulia> realmax(Float32)\n3.4028235f38\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.maxintfloat",
    "page": "重要组件",
    "title": "Base.maxintfloat",
    "category": "function",
    "text": "maxintfloat(T=Float64)\n\nThe largest consecutive integer that is exactly represented in the given floating-point type T (which defaults to Float64).\n\nThat is, maxintfloat returns the smallest positive integer n such that n+1 is not exactly representable in the type T.\n\n\n\n\n\nmaxintfloat(T, S)\n\nThe largest consecutive integer representable in the given floating-point type T that also does not exceed the maximum integer representable by the integer type S.  Equivalently, it is the minimum of maxintfloat(T) and typemax(S).\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.eps-Tuple{Type{#s1} where #s1<:AbstractFloat}",
    "page": "重要组件",
    "title": "Base.eps",
    "category": "method",
    "text": "eps(::Type{T}) where T<:AbstractFloat\neps()\n\nReturn the machine epsilon of the floating point type T (T = Float64 by default). This is defined as the gap between 1 and the next largest value representable by typeof(one(T)), and is equivalent to eps(one(T)).  (Since eps(T) is a bound on the relative error of T, it is a \"dimensionless\" quantity like one.)\n\nExamples\n\njulia> eps()\n2.220446049250313e-16\n\njulia> eps(Float32)\n1.1920929f-7\n\njulia> 1.0 + eps()\n1.0000000000000002\n\njulia> 1.0 + eps()/2\n1.0\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.eps-Tuple{AbstractFloat}",
    "page": "重要组件",
    "title": "Base.eps",
    "category": "method",
    "text": "eps(x::AbstractFloat)\n\nReturn the unit in last place (ulp) of x. This is the distance between consecutive representable floating point values at x. In most cases, if the distance on either side of x is different, then the larger of the two is taken, that is\n\neps(x) == max(x-prevfloat(x), nextfloat(x)-x)\n\nThe exceptions to this rule are the smallest and largest finite values (e.g. nextfloat(-Inf) and prevfloat(Inf) for Float64), which round to the smaller of the values.\n\nThe rationale for this behavior is that eps bounds the floating point rounding error. Under the default RoundNearest rounding mode, if y is a real number and x is the nearest floating point number to y, then\n\ny-x leq operatornameeps(x)2\n\nExamples\n\njulia> eps(1.0)\n2.220446049250313e-16\n\njulia> eps(prevfloat(2.0))\n2.220446049250313e-16\n\njulia> eps(2.0)\n4.440892098500626e-16\n\njulia> x = prevfloat(Inf)      # largest finite Float64\n1.7976931348623157e308\n\njulia> x + eps(x)/2            # rounds up\nInf\n\njulia> x + prevfloat(eps(x)/2) # rounds down\n1.7976931348623157e308\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.instances",
    "page": "重要组件",
    "title": "Base.instances",
    "category": "function",
    "text": "instances(T::Type)\n\nReturn a collection of all instances of the given type, if applicable. Mostly used for enumerated types (see @enum).\n\nExample\n\njulia> @enum Color red blue green\n\njulia> instances(Color)\n(red::Color = 0, blue::Color = 1, green::Color = 2)\n\n\n\n\n\n"
},

{
    "location": "base/base/#特殊值-1",
    "page": "重要组件",
    "title": "特殊值",
    "category": "section",
    "text": "Base.typemin\nBase.typemax\nBase.realmin\nBase.realmax\nBase.maxintfloat\nBase.eps(::Type{<:AbstractFloat})\nBase.eps(::AbstractFloat)\nBase.instances<!-- ## Special Types -->"
},

{
    "location": "base/base/#Core.Any",
    "page": "重要组件",
    "title": "Core.Any",
    "category": "type",
    "text": "Any::DataType\n\nAny is the union of all types. It has the defining property isa(x, Any) == true for any x. Any therefore describes the entire universe of possible values. For example Integer is a subset of Any that includes Int, Int8, and other integer types.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.Union",
    "page": "重要组件",
    "title": "Core.Union",
    "category": "type",
    "text": "Union{Types...}\n\nA type union is an abstract type which includes all instances of any of its argument types. The empty union Union{} is the bottom type of Julia.\n\nExamples\n\njulia> IntOrString = Union{Int,AbstractString}\nUnion{Int64, AbstractString}\n\njulia> 1 :: IntOrString\n1\n\njulia> \"Hello!\" :: IntOrString\n\"Hello!\"\n\njulia> 1.0 :: IntOrString\nERROR: TypeError: in typeassert, expected Union{Int64, AbstractString}, got Float64\n\n\n\n\n\n"
},

{
    "location": "base/base/#Union{}",
    "page": "重要组件",
    "title": "Union{}",
    "category": "keyword",
    "text": "Union{}\n\nUnion{}, the empty Union of types, is the type that has no values. That is, it has the defining property isa(x, Union{}) == false for any x. Base.Bottom is defined as its alias and the type of Union{} is Core.TypeofBottom.\n\nExamples\n\njulia> isa(nothing, Union{})\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.UnionAll",
    "page": "重要组件",
    "title": "Core.UnionAll",
    "category": "type",
    "text": "UnionAll\n\nA union of types over all values of a type parameter. UnionAll is used to describe parametric types where the values of some parameters are not known.\n\nExamples\n\njulia> typeof(Vector)\nUnionAll\n\njulia> typeof(Vector{Int})\nDataType\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.Tuple",
    "page": "重要组件",
    "title": "Core.Tuple",
    "category": "type",
    "text": "Tuple{Types...}\n\nTuples are an abstraction of the arguments of a function – without the function itself. The salient aspects of a function\'s arguments are their order and their types. Therefore a tuple type is similar to a parameterized immutable type where each parameter is the type of one field. Tuple types may have any number of parameters.\n\nTuple types are covariant in their parameters: Tuple{Int} is a subtype of Tuple{Any}. Therefore Tuple{Any} is considered an abstract type, and tuple types are only concrete if their parameters are. Tuples do not have field names; fields are only accessed by index.\n\nSee the manual section on Tuple Types.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.NamedTuple",
    "page": "重要组件",
    "title": "Core.NamedTuple",
    "category": "type",
    "text": "NamedTuple\n\nNamedTuples are, as their name suggests, named Tuples. That is, they\'re a tuple-like collection of values, where each entry has a unique name, represented as a Symbol. Like Tuples, NamedTuples are immutable; neither the names nor the values can be modified in place after construction.\n\nAccessing the value associated with a name in a named tuple can be done using field access syntax, e.g. x.a, or using getindex, e.g. x[:a]. A tuple of the names can be obtained using keys, and a tuple of the values can be obtained using values.\n\nnote: Note\nIteration over NamedTuples produces the values without the names. (See example below.) To iterate over the name-value pairs, use the pairs function.\n\nExamples\n\njulia> x = (a=1, b=2)\n(a = 1, b = 2)\n\njulia> x.a\n1\n\njulia> x[:a]\n1\n\njulia> keys(x)\n(:a, :b)\n\njulia> values(x)\n(1, 2)\n\njulia> collect(x)\n2-element Array{Int64,1}:\n 1\n 2\n\njulia> collect(pairs(x))\n2-element Array{Pair{Symbol,Int64},1}:\n :a => 1\n :b => 2\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Val",
    "page": "重要组件",
    "title": "Base.Val",
    "category": "type",
    "text": "Val(c)\n\nReturn Val{c}(), which contains no run-time data. Types like this can be used to pass the information between functions through the value c, which must be an isbits value. The intent of this construct is to be able to dispatch on constants directly (at compile time) without having to test the value of the constant at run time.\n\nExamples\n\njulia> f(::Val{true}) = \"Good\"\nf (generic function with 1 method)\n\njulia> f(::Val{false}) = \"Bad\"\nf (generic function with 2 methods)\n\njulia> f(Val(true))\n\"Good\"\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.Vararg",
    "page": "重要组件",
    "title": "Core.Vararg",
    "category": "type",
    "text": "Vararg{T,N}\n\nThe last parameter of a tuple type Tuple can be the special type Vararg, which denotes any number of trailing elements. The type Vararg{T,N} corresponds to exactly N elements of type T. Vararg{T} corresponds to zero or more elements of type T. Vararg tuple types are used to represent the arguments accepted by varargs methods (see the section on Varargs Functions in the manual.)\n\nExamples\n\njulia> mytupletype = Tuple{AbstractString,Vararg{Int}}\nTuple{AbstractString,Vararg{Int64,N} where N}\n\njulia> isa((\"1\",), mytupletype)\ntrue\n\njulia> isa((\"1\",1), mytupletype)\ntrue\n\njulia> isa((\"1\",1,2), mytupletype)\ntrue\n\njulia> isa((\"1\",1,2,3.0), mytupletype)\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.Nothing",
    "page": "重要组件",
    "title": "Core.Nothing",
    "category": "type",
    "text": "Nothing\n\nA type with no fields that is the type nothing.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Some",
    "page": "重要组件",
    "title": "Base.Some",
    "category": "type",
    "text": "Some{T}\n\nA wrapper type used in Union{Some{T}, Nothing} to distinguish between the absence of a value (nothing) and the presence of a nothing value (i.e. Some(nothing)).\n\nUse something to access the value wrapped by a Some object.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.something",
    "page": "重要组件",
    "title": "Base.something",
    "category": "function",
    "text": "something(x, y...)\n\nReturn the first value in the arguments which is not equal to nothing, if any. Otherwise throw an error. Arguments of type Some are unwrapped.\n\nExamples\n\njulia> something(nothing, 1)\n1\n\njulia> something(Some(1), nothing)\n1\n\njulia> something(missing, nothing)\nmissing\n\njulia> something(nothing, nothing)\nERROR: ArgumentError: No value arguments present\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Enums.@enum",
    "page": "重要组件",
    "title": "Base.Enums.@enum",
    "category": "macro",
    "text": "@enum EnumName[::BaseType] value1[=x] value2[=y]\n\nCreate an Enum{BaseType} subtype with name EnumName and enum member values of value1 and value2 with optional assigned values of x and y, respectively. EnumName can be used just like other types and enum member values as regular values, such as\n\nExamples\n\njulia> @enum Fruit apple=1 orange=2 kiwi=3\n\njulia> f(x::Fruit) = \"I\'m a Fruit with value: $(Int(x))\"\nf (generic function with 1 method)\n\njulia> f(apple)\n\"I\'m a Fruit with value: 1\"\n\nValues can also be specified inside a begin block, e.g.\n\n@enum EnumName begin\n    value1\n    value2\nend\n\nBaseType, which defaults to Int32, must be a primitive subtype of Integer. Member values can be converted between the enum type and BaseType. read and write perform these conversions automatically.\n\nTo list all the instances of an enum use instances, e.g.\n\njulia> instances(Fruit)\n(apple::Fruit = 1, orange::Fruit = 2, kiwi::Fruit = 3)\n\n\n\n\n\n"
},

{
    "location": "base/base/#特别的类型-1",
    "page": "重要组件",
    "title": "特别的类型",
    "category": "section",
    "text": "Core.Any\nCore.Union\nUnion{}\nCore.UnionAll\nCore.Tuple\nCore.NamedTuple\nBase.Val\nCore.Vararg\nCore.Nothing\nBase.Some\nBase.something\nBase.Enums.@enum<!-- ## Generic Functions -->"
},

{
    "location": "base/base/#Core.Function",
    "page": "重要组件",
    "title": "Core.Function",
    "category": "type",
    "text": "Function\n\nAbstract type of all functions.\n\njulia> isa(+, Function)\ntrue\n\njulia> typeof(sin)\ntypeof(sin)\n\njulia> ans <: Function\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.hasmethod",
    "page": "重要组件",
    "title": "Base.hasmethod",
    "category": "function",
    "text": "hasmethod(f, Tuple type; world = typemax(UInt)) -> Bool\n\nDetermine whether the given generic function has a method matching the given Tuple of argument types with the upper bound of world age given by world.\n\nExamples\n\njulia> hasmethod(length, Tuple{Array})\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.applicable",
    "page": "重要组件",
    "title": "Core.applicable",
    "category": "function",
    "text": "applicable(f, args...) -> Bool\n\nDetermine whether the given generic function has a method applicable to the given arguments.\n\nExamples\n\njulia> function f(x, y)\n           x + y\n       end;\n\njulia> applicable(f, 1)\nfalse\n\njulia> applicable(f, 1, 2)\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.invoke",
    "page": "重要组件",
    "title": "Core.invoke",
    "category": "function",
    "text": "invoke(f, argtypes::Type, args...; kwargs...)\n\nInvoke a method for the given generic function f matching the specified types argtypes on the specified arguments args and passing the keyword arguments kwargs. The arguments args must conform with the specified types in argtypes, i.e. conversion is not automatically performed. This method allows invoking a method other than the most specific matching method, which is useful when the behavior of a more general definition is explicitly needed (often as part of the implementation of a more specific method of the same function).\n\nExamples\n\njulia> f(x::Real) = x^2;\n\njulia> f(x::Integer) = 1 + invoke(f, Tuple{Real}, x);\n\njulia> f(2)\n5\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.invokelatest",
    "page": "重要组件",
    "title": "Base.invokelatest",
    "category": "function",
    "text": "invokelatest(f, args...; kwargs...)\n\nCalls f(args...; kwargs...), but guarantees that the most recent method of f will be executed.   This is useful in specialized circumstances, e.g. long-running event loops or callback functions that may call obsolete versions of a function f. (The drawback is that invokelatest is somewhat slower than calling f directly, and the type of the result cannot be inferred by the compiler.)\n\n\n\n\n\n"
},

{
    "location": "base/base/#new",
    "page": "重要组件",
    "title": "new",
    "category": "keyword",
    "text": "new\n\nSpecial function available to inner constructors which created a new object of the type. See the manual section on Inner Constructor Methods for more information.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.:|>",
    "page": "重要组件",
    "title": "Base.:|>",
    "category": "function",
    "text": "|>(x, f)\n\nApplies a function to the preceding argument. This allows for easy function chaining.\n\nExamples\n\njulia> [1:5;] |> x->x.^2 |> sum |> inv\n0.01818181818181818\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.:∘",
    "page": "重要组件",
    "title": "Base.:∘",
    "category": "function",
    "text": "f ∘ g\n\nCompose functions: i.e. (f ∘ g)(args...) means f(g(args...)). The ∘ symbol can be entered in the Julia REPL (and most editors, appropriately configured) by typing \\circ<tab>.\n\nExamples\n\njulia> map(uppercase∘first, [\"apple\", \"banana\", \"carrot\"])\n3-element Array{Char,1}:\n \'A\'\n \'B\'\n \'C\'\n\n\n\n\n\n"
},

{
    "location": "base/base/#一般的函数-1",
    "page": "重要组件",
    "title": "一般的函数",
    "category": "section",
    "text": "Core.Function\nBase.hasmethod\nCore.applicable\nCore.invoke\nBase.invokelatest\nnew\nBase.:(|>)\nBase.:(∘)<!-- ## Syntax -->"
},

{
    "location": "base/base/#Core.eval",
    "page": "重要组件",
    "title": "Core.eval",
    "category": "function",
    "text": "Core.eval(m::Module, expr)\n\nEvaluate an expression in the given module and return the result.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.MainInclude.eval",
    "page": "重要组件",
    "title": "Base.MainInclude.eval",
    "category": "function",
    "text": "eval(expr)\n\nEvaluate an expression in the global scope of the containing module. Every Module (except those defined with baremodule) has its own 1-argument definition of eval, which evaluates expressions in that module.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@eval",
    "page": "重要组件",
    "title": "Base.@eval",
    "category": "macro",
    "text": "@eval [mod,] ex\n\nEvaluate an expression with values interpolated into it using eval. If two arguments are provided, the first is the module to evaluate in.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.evalfile",
    "page": "重要组件",
    "title": "Base.evalfile",
    "category": "function",
    "text": "evalfile(path::AbstractString, args::Vector{String}=String[])\n\nLoad the file using Base.include, evaluate all expressions, and return the value of the last one.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.esc",
    "page": "重要组件",
    "title": "Base.esc",
    "category": "function",
    "text": "esc(e)\n\nOnly valid in the context of an Expr returned from a macro. Prevents the macro hygiene pass from turning embedded variables into gensym variables. See the Macros section of the Metaprogramming chapter of the manual for more details and examples.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@inbounds",
    "page": "重要组件",
    "title": "Base.@inbounds",
    "category": "macro",
    "text": "@inbounds(blk)\n\nEliminates array bounds checking within expressions.\n\nIn the example below the in-range check for referencing element i of array A is skipped to improve performance.\n\nfunction sum(A::AbstractArray)\n    r = zero(eltype(A))\n    for i = 1:length(A)\n        @inbounds r += A[i]\n    end\n    return r\nend\n\nwarning: Warning\nUsing @inbounds may return incorrect results/crashes/corruption for out-of-bounds indices. The user is responsible for checking it manually. Only use @inbounds when it is certain from the information locally available that all accesses are in bounds.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@boundscheck",
    "page": "重要组件",
    "title": "Base.@boundscheck",
    "category": "macro",
    "text": "@boundscheck(blk)\n\nAnnotates the expression blk as a bounds checking block, allowing it to be elided by @inbounds.\n\nnote: Note\nThe function in which @boundscheck is written must be inlined into its caller in order for @inbounds to have effect.\n\nExamples\n\njulia> @inline function g(A, i)\n           @boundscheck checkbounds(A, i)\n           return \"accessing ($A)[$i]\"\n       end;\n\njulia> f1() = return g(1:2, -1);\n\njulia> f2() = @inbounds return g(1:2, -1);\n\njulia> f1()\nERROR: BoundsError: attempt to access 2-element UnitRange{Int64} at index [-1]\nStacktrace:\n [1] throw_boundserror(::UnitRange{Int64}, ::Tuple{Int64}) at ./abstractarray.jl:455\n [2] checkbounds at ./abstractarray.jl:420 [inlined]\n [3] g at ./none:2 [inlined]\n [4] f1() at ./none:1\n [5] top-level scope\n\njulia> f2()\n\"accessing (1:2)[-1]\"\n\nwarning: Warning\nThe @boundscheck annotation allows you, as a library writer, to opt-in to allowing other code to remove your bounds checks with @inbounds. As noted there, the caller must verify—using information they can access—that their accesses are valid before using @inbounds. For indexing into your AbstractArray subclasses, for example, this involves checking the indices against its size. Therefore, @boundscheck annotations should only be added to a getindex or setindex! implementation after you are certain its behavior is correct.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@inline",
    "page": "重要组件",
    "title": "Base.@inline",
    "category": "macro",
    "text": "@inline\n\nGive a hint to the compiler that this function is worth inlining.\n\nSmall functions typically do not need the @inline annotation, as the compiler does it automatically. By using @inline on bigger functions, an extra nudge can be given to the compiler to inline it. This is shown in the following example:\n\n@inline function bigfunction(x)\n    #=\n        Function Definition\n    =#\nend\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@noinline",
    "page": "重要组件",
    "title": "Base.@noinline",
    "category": "macro",
    "text": "@noinline\n\nPrevents the compiler from inlining a function.\n\nSmall functions are typically inlined automatically. By using @noinline on small functions, auto-inlining can be prevented. This is shown in the following example:\n\n@noinline function smallfunction(x)\n    #=\n        Function Definition\n    =#\nend\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@nospecialize",
    "page": "重要组件",
    "title": "Base.@nospecialize",
    "category": "macro",
    "text": "@nospecialize\n\nApplied to a function argument name, hints to the compiler that the method should not be specialized for different types of that argument. This is only a hint for avoiding excess code generation. Can be applied to an argument within a formal argument list, or in the function body. When applied to an argument, the macro must wrap the entire argument expression. When used in a function body, the macro must occur in statement position and before any code.\n\nfunction example_function(@nospecialize x)\n    ...\nend\n\nfunction example_function(@nospecialize(x = 1), y)\n    ...\nend\n\nfunction example_function(x, y, z)\n    @nospecialize x y\n    ...\nend\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.gensym",
    "page": "重要组件",
    "title": "Base.gensym",
    "category": "function",
    "text": "gensym([tag])\n\nGenerates a symbol which will not conflict with other variable names.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@gensym",
    "page": "重要组件",
    "title": "Base.@gensym",
    "category": "macro",
    "text": "@gensym\n\nGenerates a gensym symbol for a variable. For example, @gensym x y is transformed into x = gensym(\"x\"); y = gensym(\"y\").\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@goto",
    "page": "重要组件",
    "title": "Base.@goto",
    "category": "macro",
    "text": "@goto name\n\n@goto name unconditionally jumps to the statement at the location @label name.\n\n@label and @goto cannot create jumps to different top-level statements. Attempts cause an error. To still use @goto, enclose the @label and @goto in a block.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@label",
    "page": "重要组件",
    "title": "Base.@label",
    "category": "macro",
    "text": "@label name\n\nLabels a statement with the symbolic label name. The label marks the end-point of an unconditional jump with @goto name.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.SimdLoop.@simd",
    "page": "重要组件",
    "title": "Base.SimdLoop.@simd",
    "category": "macro",
    "text": "@simd\n\nAnnotate a for loop to allow the compiler to take extra liberties to allow loop re-ordering\n\nwarning: Warning\nThis feature is experimental and could change or disappear in future versions of Julia. Incorrect use of the @simd macro may cause unexpected results.\n\nThe object iterated over in a @simd for loop should be a one-dimensional range. By using @simd, you are asserting several properties of the loop:\n\n* It is safe to execute iterations in arbitrary or overlapping order, with special consideration for reduction variables.\n* Floating-point operations on reduction variables can be reordered, possibly causing different results than without `@simd`.\n\nIn many cases, Julia is able to automatically vectorize inner for loops without the use of @simd. Using @simd gives the compiler a little extra leeway to make it possible in more situations. In either case, your inner loop should have the following properties to allow vectorization:\n\n* The loop must be an innermost loop\n* The loop body must be straight-line code. Therefore, [`@inbounds`](@ref) is\n  currently needed for all array accesses. The compiler can sometimes turn\n  short `&&`, `||`, and `?:` expressions into straight-line code if it is safe\n  to evaluate all operands unconditionally. Consider using the [`ifelse`](@ref)\n  function instead of `?:` in the loop if it is safe to do so.\n* Accesses must have a stride pattern and cannot be \"gathers\" (random-index\n  reads) or \"scatters\" (random-index writes).\n* The stride should be unit stride.\n\nnote: Note\nThe @simd does not assert by default that the loop is completely free of loop-carried memory dependencies, which is an assumption that can easily be violated in generic code. If you are writing non-generic code, you can use @simd ivdep for ... end to also assert that:* There exists no loop-carried memory dependencies\n* No iteration ever waits on a previous iteration to make forward progress.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@polly",
    "page": "重要组件",
    "title": "Base.@polly",
    "category": "macro",
    "text": "@polly\n\nTells the compiler to apply the polyhedral optimizer Polly to a function.\n\n\n\n\n\n"
},

{
    "location": "base/base/#句法-1",
    "page": "重要组件",
    "title": "句法",
    "category": "section",
    "text": "Core.eval\nBase.MainInclude.eval\nBase.@eval\nBase.evalfile\nBase.esc\nBase.@inbounds\nBase.@boundscheck\nBase.@inline\nBase.@noinline\nBase.@nospecialize\nBase.gensym\nBase.@gensym\nBase.@goto\nBase.@label\nBase.@simd\nBase.@polly<!-- ## Missing Values -->"
},

{
    "location": "base/base/#Base.Missing",
    "page": "重要组件",
    "title": "Base.Missing",
    "category": "type",
    "text": "Missing\n\nA type with no fields whose singleton instance missing is used to represent missing values.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.missing",
    "page": "重要组件",
    "title": "Base.missing",
    "category": "constant",
    "text": "missing\n\nThe singleton instance of type Missing representing a missing value.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.coalesce",
    "page": "重要组件",
    "title": "Base.coalesce",
    "category": "function",
    "text": "coalesce(x, y...)\n\nReturn the first value in the arguments which is not equal to missing, if any. Otherwise return missing.\n\nExamples\n\njulia> coalesce(missing, 1)\n1\n\njulia> coalesce(1, missing)\n1\n\njulia> coalesce(nothing, 1)  # returns `nothing`\n\njulia> coalesce(missing, missing)\nmissing\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.ismissing",
    "page": "重要组件",
    "title": "Base.ismissing",
    "category": "function",
    "text": "ismissing(x)\n\nIndicate whether x is missing.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.skipmissing",
    "page": "重要组件",
    "title": "Base.skipmissing",
    "category": "function",
    "text": "skipmissing(itr)\n\nReturn an iterator over the elements in itr skipping missing values.\n\nUse collect to obtain an Array containing the non-missing values in itr. Note that even if itr is a multidimensional array, the result will always be a Vector since it is not possible to remove missings while preserving dimensions of the input.\n\nExamples\n\njulia> sum(skipmissing([1, missing, 2]))\n3\n\njulia> collect(skipmissing([1, missing, 2]))\n2-element Array{Int64,1}:\n 1\n 2\n\njulia> collect(skipmissing([1 missing; 2 missing]))\n2-element Array{Int64,1}:\n 1\n 2\n\n\n\n\n\n"
},

{
    "location": "base/base/#缺失值-1",
    "page": "重要组件",
    "title": "缺失值",
    "category": "section",
    "text": "Base.Missing\nBase.missing\nBase.coalesce\nBase.ismissing\nBase.skipmissing<!-- ## System -->"
},

{
    "location": "base/base/#Base.run",
    "page": "重要组件",
    "title": "Base.run",
    "category": "function",
    "text": "run(command, args...; wait::Bool = true)\n\nRun a command object, constructed with backticks. Throws an error if anything goes wrong, including the process exiting with a non-zero status (when wait is true).\n\nIf wait is false, the process runs asynchronously. You can later wait for it and check its exit status by calling success on the returned process object.\n\nWhen wait is false, the process\' I/O streams are directed to devnull. When wait is true, I/O streams are shared with the parent process. Use pipeline to control I/O redirection.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.devnull",
    "page": "重要组件",
    "title": "Base.devnull",
    "category": "constant",
    "text": "devnull\n\nUsed in a stream redirect to discard all data written to it. Essentially equivalent to /dev/null on Unix or NUL on Windows. Usage:\n\nrun(pipeline(`cat test.txt`, devnull))\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.success",
    "page": "重要组件",
    "title": "Base.success",
    "category": "function",
    "text": "success(command)\n\nRun a command object, constructed with backticks, and tell whether it was successful (exited with a code of 0). An exception is raised if the process cannot be started.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.process_running",
    "page": "重要组件",
    "title": "Base.process_running",
    "category": "function",
    "text": "process_running(p::Process)\n\nDetermine whether a process is currently running.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.process_exited",
    "page": "重要组件",
    "title": "Base.process_exited",
    "category": "function",
    "text": "process_exited(p::Process)\n\nDetermine whether a process has exited.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.kill-Tuple{Base.Process,Integer}",
    "page": "重要组件",
    "title": "Base.kill",
    "category": "method",
    "text": "kill(p::Process, signum=SIGTERM)\n\nSend a signal to a process. The default is to terminate the process. Returns successfully if the process has already exited, but throws an error if killing the process failed for other reasons (e.g. insufficient permissions).\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Sys.set_process_title",
    "page": "重要组件",
    "title": "Base.Sys.set_process_title",
    "category": "function",
    "text": "Sys.set_process_title(title::AbstractString)\n\nSet the process title. No-op on some operating systems.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Sys.get_process_title",
    "page": "重要组件",
    "title": "Base.Sys.get_process_title",
    "category": "function",
    "text": "Sys.get_process_title()\n\nGet the process title. On some systems, will always return an empty string.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.readandwrite",
    "page": "重要组件",
    "title": "Base.readandwrite",
    "category": "function",
    "text": "readandwrite(command)\n\nStarts running a command asynchronously, and returns a tuple (stdout,stdin,process) of the output stream and input stream of the process, and the process object itself.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.ignorestatus",
    "page": "重要组件",
    "title": "Base.ignorestatus",
    "category": "function",
    "text": "ignorestatus(command)\n\nMark a command object so that running it will not throw an error if the result code is non-zero.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.detach",
    "page": "重要组件",
    "title": "Base.detach",
    "category": "function",
    "text": "detach(command)\n\nMark a command object so that it will be run in a new process group, allowing it to outlive the julia process, and not have Ctrl-C interrupts passed to it.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Cmd",
    "page": "重要组件",
    "title": "Base.Cmd",
    "category": "type",
    "text": "Cmd(cmd::Cmd; ignorestatus, detach, windows_verbatim, windows_hide, env, dir)\n\nConstruct a new Cmd object, representing an external program and arguments, from cmd, while changing the settings of the optional keyword arguments:\n\nignorestatus::Bool: If true (defaults to false), then the Cmd will not throw an error if the return code is nonzero.\ndetach::Bool: If true (defaults to false), then the Cmd will be run in a new process group, allowing it to outlive the julia process and not have Ctrl-C passed to it.\nwindows_verbatim::Bool: If true (defaults to false), then on Windows the Cmd will send a command-line string to the process with no quoting or escaping of arguments, even arguments containing spaces. (On Windows, arguments are sent to a program as a single \"command-line\" string, and programs are responsible for parsing it into arguments. By default, empty arguments and arguments with spaces or tabs are quoted with double quotes \" in the command line, and \\ or \" are preceded by backslashes. windows_verbatim=true is useful for launching programs that parse their command line in nonstandard ways.) Has no effect on non-Windows systems.\nwindows_hide::Bool: If true (defaults to false), then on Windows no new console window is displayed when the Cmd is executed. This has no effect if a console is already open or on non-Windows systems.\nenv: Set environment variables to use when running the Cmd. env is either a dictionary mapping strings to strings, an array of strings of the form \"var=val\", an array or tuple of \"var\"=>val pairs, or nothing. In order to modify (rather than replace) the existing environment, create env by copy(ENV) and then set env[\"var\"]=val as desired.\ndir::AbstractString: Specify a working directory for the command (instead of the current directory).\n\nFor any keywords that are not specified, the current settings from cmd are used. Normally, to create a Cmd object in the first place, one uses backticks, e.g.\n\nCmd(`echo \"Hello world\"`, ignorestatus=true, detach=false)\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.setenv",
    "page": "重要组件",
    "title": "Base.setenv",
    "category": "function",
    "text": "setenv(command::Cmd, env; dir=\"\")\n\nSet environment variables to use when running the given command. env is either a dictionary mapping strings to strings, an array of strings of the form \"var=val\", or zero or more \"var\"=>val pair arguments. In order to modify (rather than replace) the existing environment, create env by copy(ENV) and then setting env[\"var\"]=val as desired, or use withenv.\n\nThe dir keyword argument can be used to specify a working directory for the command.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.withenv",
    "page": "重要组件",
    "title": "Base.withenv",
    "category": "function",
    "text": "withenv(f::Function, kv::Pair...)\n\nExecute f in an environment that is temporarily modified (not replaced as in setenv) by zero or more \"var\"=>val arguments kv. withenv is generally used via the withenv(kv...) do ... end syntax. A value of nothing can be used to temporarily unset an environment variable (if it is set). When withenv returns, the original environment has been restored.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.pipeline-Tuple{Any,Any,Any,Vararg{Any,N} where N}",
    "page": "重要组件",
    "title": "Base.pipeline",
    "category": "method",
    "text": "pipeline(from, to, ...)\n\nCreate a pipeline from a data source to a destination. The source and destination can be commands, I/O streams, strings, or results of other pipeline calls. At least one argument must be a command. Strings refer to filenames. When called with more than two arguments, they are chained together from left to right. For example, pipeline(a,b,c) is equivalent to pipeline(pipeline(a,b),c). This provides a more concise way to specify multi-stage pipelines.\n\nExamples:\n\nrun(pipeline(`ls`, `grep xyz`))\nrun(pipeline(`ls`, \"out.txt\"))\nrun(pipeline(\"out.txt\", `grep xyz`))\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.pipeline-Tuple{Base.AbstractCmd}",
    "page": "重要组件",
    "title": "Base.pipeline",
    "category": "method",
    "text": "pipeline(command; stdin, stdout, stderr, append=false)\n\nRedirect I/O to or from the given command. Keyword arguments specify which of the command\'s streams should be redirected. append controls whether file output appends to the file. This is a more general version of the 2-argument pipeline function. pipeline(from, to) is equivalent to pipeline(from, stdout=to) when from is a command, and to pipeline(to, stdin=from) when from is another kind of data source.\n\nExamples:\n\nrun(pipeline(`dothings`, stdout=\"out.txt\", stderr=\"errs.txt\"))\nrun(pipeline(`update`, stdout=\"log.txt\", append=true))\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Libc.gethostname",
    "page": "重要组件",
    "title": "Base.Libc.gethostname",
    "category": "function",
    "text": "gethostname() -> AbstractString\n\nGet the local machine\'s host name.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Libc.getpid",
    "page": "重要组件",
    "title": "Base.Libc.getpid",
    "category": "function",
    "text": "getpid() -> Int32\n\nGet Julia\'s process ID.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Libc.time-Tuple{}",
    "page": "重要组件",
    "title": "Base.Libc.time",
    "category": "method",
    "text": "time()\n\nGet the system time in seconds since the epoch, with fairly high (typically, microsecond) resolution.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.time_ns",
    "page": "重要组件",
    "title": "Base.time_ns",
    "category": "function",
    "text": "time_ns()\n\nGet the time in nanoseconds. The time corresponding to 0 is undefined, and wraps every 5.8 years.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@time",
    "page": "重要组件",
    "title": "Base.@time",
    "category": "macro",
    "text": "@time\n\nA macro to execute an expression, printing the time it took to execute, the number of allocations, and the total number of bytes its execution caused to be allocated, before returning the value of the expression.\n\nSee also @timev, @timed, @elapsed, and @allocated.\n\njulia> @time rand(10^6);\n  0.001525 seconds (7 allocations: 7.630 MiB)\n\njulia> @time begin\n           sleep(0.3)\n           1+1\n       end\n  0.301395 seconds (8 allocations: 336 bytes)\n2\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@timev",
    "page": "重要组件",
    "title": "Base.@timev",
    "category": "macro",
    "text": "@timev\n\nThis is a verbose version of the @time macro. It first prints the same information as @time, then any non-zero memory allocation counters, and then returns the value of the expression.\n\nSee also @time, @timed, @elapsed, and @allocated.\n\njulia> @timev rand(10^6);\n  0.001006 seconds (7 allocations: 7.630 MiB)\nelapsed time (ns): 1005567\nbytes allocated:   8000256\npool allocs:       6\nmalloc() calls:    1\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@timed",
    "page": "重要组件",
    "title": "Base.@timed",
    "category": "macro",
    "text": "@timed\n\nA macro to execute an expression, and return the value of the expression, elapsed time, total bytes allocated, garbage collection time, and an object with various memory allocation counters.\n\nSee also @time, @timev, @elapsed, and @allocated.\n\njulia> val, t, bytes, gctime, memallocs = @timed rand(10^6);\n\njulia> t\n0.006634834\n\njulia> bytes\n8000256\n\njulia> gctime\n0.0055765\n\njulia> fieldnames(typeof(memallocs))\n(:allocd, :malloc, :realloc, :poolalloc, :bigalloc, :freecall, :total_time, :pause, :full_sweep)\n\njulia> memallocs.total_time\n5576500\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@elapsed",
    "page": "重要组件",
    "title": "Base.@elapsed",
    "category": "macro",
    "text": "@elapsed\n\nA macro to evaluate an expression, discarding the resulting value, instead returning the number of seconds it took to execute as a floating-point number.\n\nSee also @time, @timev, @timed, and @allocated.\n\njulia> @elapsed sleep(0.3)\n0.301391426\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@allocated",
    "page": "重要组件",
    "title": "Base.@allocated",
    "category": "macro",
    "text": "@allocated\n\nA macro to evaluate an expression, discarding the resulting value, instead returning the total number of bytes allocated during evaluation of the expression. Note: the expression is evaluated inside a local function, instead of the current context, in order to eliminate the effects of compilation, however, there still may be some allocations due to JIT compilation. This also makes the results inconsistent with the @time macros, which do not try to adjust for the effects of compilation.\n\nSee also @time, @timev, @timed, and @elapsed.\n\njulia> @allocated rand(10^6)\n8000080\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.EnvDict",
    "page": "重要组件",
    "title": "Base.EnvDict",
    "category": "type",
    "text": "EnvDict() -> EnvDict\n\nA singleton of this type provides a hash table interface to environment variables.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.ENV",
    "page": "重要组件",
    "title": "Base.ENV",
    "category": "constant",
    "text": "ENV\n\nReference to the singleton EnvDict, providing a dictionary interface to system environment variables.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Sys.isunix",
    "page": "重要组件",
    "title": "Base.Sys.isunix",
    "category": "function",
    "text": "Sys.isunix([os])\n\nPredicate for testing if the OS provides a Unix-like interface. See documentation in Handling Operating System Variation.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Sys.isapple",
    "page": "重要组件",
    "title": "Base.Sys.isapple",
    "category": "function",
    "text": "Sys.isapple([os])\n\nPredicate for testing if the OS is a derivative of Apple Macintosh OS X or Darwin. See documentation in Handling Operating System Variation.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Sys.islinux",
    "page": "重要组件",
    "title": "Base.Sys.islinux",
    "category": "function",
    "text": "Sys.islinux([os])\n\nPredicate for testing if the OS is a derivative of Linux. See documentation in Handling Operating System Variation.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Sys.isbsd",
    "page": "重要组件",
    "title": "Base.Sys.isbsd",
    "category": "function",
    "text": "Sys.isbsd([os])\n\nPredicate for testing if the OS is a derivative of BSD. See documentation in Handling Operating System Variation.\n\nnote: Note\nThe Darwin kernel descends from BSD, which means that Sys.isbsd() is true on macOS systems. To exclude macOS from a predicate, use Sys.isbsd() && !Sys.isapple().\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Sys.iswindows",
    "page": "重要组件",
    "title": "Base.Sys.iswindows",
    "category": "function",
    "text": "Sys.iswindows([os])\n\nPredicate for testing if the OS is a derivative of Microsoft Windows NT. See documentation in Handling Operating System Variation.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Sys.windows_version",
    "page": "重要组件",
    "title": "Base.Sys.windows_version",
    "category": "function",
    "text": "Sys.windows_version()\n\nReturn the version number for the Windows NT Kernel as a VersionNumber, i.e. v\"major.minor.build\", or v\"0.0.0\" if this is not running on Windows.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@static",
    "page": "重要组件",
    "title": "Base.@static",
    "category": "macro",
    "text": "@static\n\nPartially evaluate an expression at parse time.\n\nFor example, @static Sys.iswindows() ? foo : bar will evaluate Sys.iswindows() and insert either foo or bar into the expression. This is useful in cases where a construct would be invalid on other platforms, such as a ccall to a non-existent function. @static if Sys.isapple() foo end and @static foo <&&,||> bar are also valid syntax.\n\n\n\n\n\n"
},

{
    "location": "base/base/#系统-1",
    "page": "重要组件",
    "title": "系统",
    "category": "section",
    "text": "Base.run\nBase.devnull\nBase.success\nBase.process_running\nBase.process_exited\nBase.kill(::Base.Process, ::Integer)\nBase.Sys.set_process_title\nBase.Sys.get_process_title\nBase.readandwrite\nBase.ignorestatus\nBase.detach\nBase.Cmd\nBase.setenv\nBase.withenv\nBase.pipeline(::Any, ::Any, ::Any, ::Any...)\nBase.pipeline(::Base.AbstractCmd)\nBase.Libc.gethostname\nBase.Libc.getpid\nBase.Libc.time()\nBase.time_ns\nBase.@time\nBase.@timev\nBase.@timed\nBase.@elapsed\nBase.@allocated\nBase.EnvDict\nBase.ENV\nBase.Sys.isunix\nBase.Sys.isapple\nBase.Sys.islinux\nBase.Sys.isbsd\nBase.Sys.iswindows\nBase.Sys.windows_version\nBase.@static<!-- ## Versioning -->"
},

{
    "location": "base/base/#Base.VersionNumber",
    "page": "重要组件",
    "title": "Base.VersionNumber",
    "category": "type",
    "text": "VersionNumber\n\nVersion number type which follow the specifications of semantic versioning, composed of major, minor and patch numeric values, followed by pre-release and build alpha-numeric annotations. See also @v_str.\n\nExamples\n\njulia> VersionNumber(\"1.2.3\")\nv\"1.2.3\"\n\njulia> VersionNumber(\"2.0.1-rc1\")\nv\"2.0.1-rc1\"\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@v_str",
    "page": "重要组件",
    "title": "Base.@v_str",
    "category": "macro",
    "text": "@v_str\n\nString macro used to parse a string to a VersionNumber.\n\nExamples\n\njulia> v\"1.2.3\"\nv\"1.2.3\"\n\njulia> v\"2.0.1-rc1\"\nv\"2.0.1-rc1\"\n\n\n\n\n\n"
},

{
    "location": "base/base/#版本-1",
    "page": "重要组件",
    "title": "版本",
    "category": "section",
    "text": "Base.VersionNumber\nBase.@v_str<!-- ## Errors -->"
},

{
    "location": "base/base/#Base.error",
    "page": "重要组件",
    "title": "Base.error",
    "category": "function",
    "text": "error(message::AbstractString)\n\nRaise an ErrorException with the given message.\n\n\n\n\n\nerror(msg...)\n\nRaise an ErrorException with the given message.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.throw",
    "page": "重要组件",
    "title": "Core.throw",
    "category": "function",
    "text": "throw(e)\n\nThrow an object as an exception.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.rethrow",
    "page": "重要组件",
    "title": "Base.rethrow",
    "category": "function",
    "text": "rethrow([e])\n\nThrow an object without changing the current exception backtrace. The default argument is the current exception (if called within a catch block).\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.backtrace",
    "page": "重要组件",
    "title": "Base.backtrace",
    "category": "function",
    "text": "backtrace()\n\nGet a backtrace object for the current program point.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.catch_backtrace",
    "page": "重要组件",
    "title": "Base.catch_backtrace",
    "category": "function",
    "text": "catch_backtrace()\n\nGet the backtrace of the current exception, for use within catch blocks.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@assert",
    "page": "重要组件",
    "title": "Base.@assert",
    "category": "macro",
    "text": "@assert cond [text]\n\nThrow an AssertionError if cond is false. Preferred syntax for writing assertions. Message text is optionally displayed upon assertion failure.\n\nwarning: Warning\nAn assert might be disabled at various optimization levels. Assert should therefore only be used as a debugging tool and not used for authentication verification (e.g., verifying passwords), nor should side effects needed for the function to work correctly be used inside of asserts.\n\nExamples\n\njulia> @assert iseven(3) \"3 is an odd number!\"\nERROR: AssertionError: 3 is an odd number!\n\njulia> @assert isodd(3) \"What even are numbers?\"\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.ArgumentError",
    "page": "重要组件",
    "title": "Core.ArgumentError",
    "category": "type",
    "text": "ArgumentError(msg)\n\nThe parameters to a function call do not match a valid signature. Argument msg is a descriptive error string.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.AssertionError",
    "page": "重要组件",
    "title": "Core.AssertionError",
    "category": "type",
    "text": "AssertionError([msg])\n\nThe asserted condition did not evaluate to true. Optional argument msg is a descriptive error string.\n\nExamples\n\njulia> @assert false \"this is not true\"\nERROR: AssertionError: this is not true\n\nAssertionError is usually thrown from @assert.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.BoundsError",
    "page": "重要组件",
    "title": "Core.BoundsError",
    "category": "type",
    "text": "BoundsError([a],[i])\n\nAn indexing operation into an array, a, tried to access an out-of-bounds element at index i.\n\nExamples\n\njulia> A = fill(1.0, 7);\n\njulia> A[8]\nERROR: BoundsError: attempt to access 7-element Array{Float64,1} at index [8]\nStacktrace:\n [1] getindex(::Array{Float64,1}, ::Int64) at ./array.jl:660\n [2] top-level scope\n\njulia> B = fill(1.0, (2,3));\n\njulia> B[2, 4]\nERROR: BoundsError: attempt to access 2×3 Array{Float64,2} at index [2, 4]\nStacktrace:\n [1] getindex(::Array{Float64,2}, ::Int64, ::Int64) at ./array.jl:661\n [2] top-level scope\n\njulia> B[9]\nERROR: BoundsError: attempt to access 2×3 Array{Float64,2} at index [9]\nStacktrace:\n [1] getindex(::Array{Float64,2}, ::Int64) at ./array.jl:660\n [2] top-level scope\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.CompositeException",
    "page": "重要组件",
    "title": "Base.CompositeException",
    "category": "type",
    "text": "CompositeException\n\nWrap a Vector of exceptions thrown by a Task (e.g. generated from a remote worker over a channel or an asynchronously executing local I/O write or a remote worker under pmap) with information about the series of exceptions. For example, if a group of workers are executing several tasks, and multiple workers fail, the resulting CompositeException will contain a \"bundle\" of information from each worker indicating where and why the exception(s) occurred.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.DimensionMismatch",
    "page": "重要组件",
    "title": "Base.DimensionMismatch",
    "category": "type",
    "text": "DimensionMismatch([msg])\n\nThe objects called do not have matching dimensionality. Optional argument msg is a descriptive error string.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.DivideError",
    "page": "重要组件",
    "title": "Core.DivideError",
    "category": "type",
    "text": "DivideError()\n\nInteger division was attempted with a denominator value of 0.\n\nExamples\n\njulia> 2/0\nInf\n\njulia> div(2, 0)\nERROR: DivideError: integer division error\nStacktrace:\n[...]\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.DomainError",
    "page": "重要组件",
    "title": "Core.DomainError",
    "category": "type",
    "text": "DomainError(val)\nDomainError(val, msg)\n\nThe argument val to a function or constructor is outside the valid domain.\n\nExamples\n\njulia> sqrt(-1)\nERROR: DomainError with -1.0:\nsqrt will only return a complex result if called with a complex argument. Try sqrt(Complex(x)).\nStacktrace:\n[...]\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.EOFError",
    "page": "重要组件",
    "title": "Base.EOFError",
    "category": "type",
    "text": "EOFError()\n\nNo more data was available to read from a file or stream.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.ErrorException",
    "page": "重要组件",
    "title": "Core.ErrorException",
    "category": "type",
    "text": "ErrorException(msg)\n\nGeneric error type. The error message, in the .msg field, may provide more specific details.\n\nExample\n\njulia> ex = ErrorException(\"I\'ve done a bad thing\");\n\njulia> ex.msg\n\"I\'ve done a bad thing\"\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.InexactError",
    "page": "重要组件",
    "title": "Core.InexactError",
    "category": "type",
    "text": "InexactError(name::Symbol, T, val)\n\nCannot exactly convert val to type T in a method of function name.\n\nExamples\n\njulia> convert(Float64, 1+2im)\nERROR: InexactError: Float64(Float64, 1 + 2im)\nStacktrace:\n[...]\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.InterruptException",
    "page": "重要组件",
    "title": "Core.InterruptException",
    "category": "type",
    "text": "InterruptException()\n\nThe process was stopped by a terminal interrupt (CTRL+C).\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.KeyError",
    "page": "重要组件",
    "title": "Base.KeyError",
    "category": "type",
    "text": "KeyError(key)\n\nAn indexing operation into an AbstractDict (Dict) or Set like object tried to access or delete a non-existent element.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.LoadError",
    "page": "重要组件",
    "title": "Core.LoadError",
    "category": "type",
    "text": "LoadError(file::AbstractString, line::Int, error)\n\nAn error occurred while includeing, requireing, or using a file. The error specifics should be available in the .error field.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.MethodError",
    "page": "重要组件",
    "title": "Core.MethodError",
    "category": "type",
    "text": "MethodError(f, args)\n\nA method with the required type signature does not exist in the given generic function. Alternatively, there is no unique most-specific method.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.MissingException",
    "page": "重要组件",
    "title": "Base.MissingException",
    "category": "type",
    "text": "MissingException(msg)\n\nException thrown when a missing value is encountered in a situation where it is not supported. The error message, in the msg field may provide more specific details.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.OutOfMemoryError",
    "page": "重要组件",
    "title": "Core.OutOfMemoryError",
    "category": "type",
    "text": "OutOfMemoryError()\n\nAn operation allocated too much memory for either the system or the garbage collector to handle properly.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.ReadOnlyMemoryError",
    "page": "重要组件",
    "title": "Core.ReadOnlyMemoryError",
    "category": "type",
    "text": "ReadOnlyMemoryError()\n\nAn operation tried to write to memory that is read-only.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.OverflowError",
    "page": "重要组件",
    "title": "Core.OverflowError",
    "category": "type",
    "text": "OverflowError(msg)\n\nThe result of an expression is too large for the specified type and will cause a wraparound.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.StackOverflowError",
    "page": "重要组件",
    "title": "Core.StackOverflowError",
    "category": "type",
    "text": "StackOverflowError()\n\nThe function call grew beyond the size of the call stack. This usually happens when a call recurses infinitely.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.SystemError",
    "page": "重要组件",
    "title": "Base.SystemError",
    "category": "type",
    "text": "SystemError(prefix::AbstractString, [errno::Int32])\n\nA system call failed with an error code (in the errno global variable).\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.TypeError",
    "page": "重要组件",
    "title": "Core.TypeError",
    "category": "type",
    "text": "TypeError(func::Symbol, context::AbstractString, expected::Type, got)\n\nA type assertion failure, or calling an intrinsic function with an incorrect argument type.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.UndefKeywordError",
    "page": "重要组件",
    "title": "Core.UndefKeywordError",
    "category": "type",
    "text": "UndefKeywordError(var::Symbol)\n\nThe required keyword argument var was not assigned in a function call.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.UndefRefError",
    "page": "重要组件",
    "title": "Core.UndefRefError",
    "category": "type",
    "text": "UndefRefError()\n\nThe item or field is not defined for the given object.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.UndefVarError",
    "page": "重要组件",
    "title": "Core.UndefVarError",
    "category": "type",
    "text": "UndefVarError(var::Symbol)\n\nA symbol in the current scope is not defined.\n\nExamples\n\njulia> a\nERROR: UndefVarError: a not defined\n\njulia> a = 1;\n\njulia> a\n1\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.StringIndexError",
    "page": "重要组件",
    "title": "Base.StringIndexError",
    "category": "type",
    "text": "StringIndexError(str, i)\n\nAn error occurred when trying to access str at index i that is not valid.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.InitError",
    "page": "重要组件",
    "title": "Core.InitError",
    "category": "type",
    "text": "InitError(mod::Symbol, error)\n\nAn error occurred when running a module\'s __init__ function. The actual error thrown is available in the .error field.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.retry",
    "page": "重要组件",
    "title": "Base.retry",
    "category": "function",
    "text": "retry(f::Function;  delays=ExponentialBackOff(), check=nothing) -> Function\n\nReturn an anonymous function that calls function f.  If an exception arises, f is repeatedly called again, each time check returns true, after waiting the number of seconds specified in delays.  check should input delays\'s current state and the Exception.\n\nExamples\n\nretry(f, delays=fill(5.0, 3))\nretry(f, delays=rand(5:10, 2))\nretry(f, delays=Base.ExponentialBackOff(n=3, first_delay=5, max_delay=1000))\nretry(http_get, check=(s,e)->e.status == \"503\")(url)\nretry(read, check=(s,e)->isa(e, UVError))(io, 128; all=false)\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.ExponentialBackOff",
    "page": "重要组件",
    "title": "Base.ExponentialBackOff",
    "category": "type",
    "text": "ExponentialBackOff(; n=1, first_delay=0.05, max_delay=10.0, factor=5.0, jitter=0.1)\n\nA Float64 iterator of length n whose elements exponentially increase at a rate in the interval factor * (1 ± jitter).  The first element is first_delay and all elements are clamped to max_delay.\n\n\n\n\n\n"
},

{
    "location": "base/base/#错误-1",
    "page": "重要组件",
    "title": "错误",
    "category": "section",
    "text": "Base.error\nCore.throw\nBase.rethrow\nBase.backtrace\nBase.catch_backtrace\nBase.@assert\nBase.ArgumentError\nBase.AssertionError\nCore.BoundsError\nBase.CompositeException\nBase.DimensionMismatch\nCore.DivideError\nCore.DomainError\nBase.EOFError\nCore.ErrorException\nCore.InexactError\nCore.InterruptException\nBase.KeyError\nBase.LoadError\nBase.MethodError\nBase.MissingException\nCore.OutOfMemoryError\nCore.ReadOnlyMemoryError\nCore.OverflowError\nCore.StackOverflowError\nBase.SystemError\nCore.TypeError\nCore.UndefKeywordError\nCore.UndefRefError\nCore.UndefVarError\nBase.StringIndexError\nBase.InitError\nBase.retry\nBase.ExponentialBackOff<!-- ## Events -->"
},

{
    "location": "base/base/#Base.Timer-Tuple{Function,Real}",
    "page": "重要组件",
    "title": "Base.Timer",
    "category": "method",
    "text": "Timer(callback::Function, delay; interval = 0)\n\nCreate a timer that wakes up tasks waiting for it (by calling wait on the timer object) and calls the function callback.\n\nWaiting tasks are woken and the function callback is called after an initial delay of delay seconds, and then repeating with the given interval in seconds. If interval is equal to 0, the timer is only triggered once. The function callback is called with a single argument, the timer itself. When the timer is closed (by close waiting tasks are woken with an error. Use isopen to check whether a timer is still active.\n\nExamples\n\nHere the first number is printed after a delay of two seconds, then the following numbers are printed quickly.\n\njulia> begin\n           i = 0\n           cb(timer) = (global i += 1; println(i))\n           t = Timer(cb, 2, interval = 0.2)\n           wait(t)\n           sleep(0.5)\n           close(t)\n       end\n1\n2\n3\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Timer",
    "page": "重要组件",
    "title": "Base.Timer",
    "category": "type",
    "text": "Timer(delay; interval = 0)\n\nCreate a timer that wakes up tasks waiting for it (by calling wait on the timer object).\n\nWaiting tasks are woken after an initial delay of delay seconds, and then repeating with the given interval in seconds. If interval is equal to 0, the timer is only triggered once. When the timer is closed (by close waiting tasks are woken with an error. Use isopen to check whether a timer is still active.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.AsyncCondition",
    "page": "重要组件",
    "title": "Base.AsyncCondition",
    "category": "type",
    "text": "AsyncCondition()\n\nCreate a async condition that wakes up tasks waiting for it (by calling wait on the object) when notified from C by a call to uv_async_send. Waiting tasks are woken with an error when the object is closed (by close. Use isopen to check whether it is still active.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.AsyncCondition-Tuple{Function}",
    "page": "重要组件",
    "title": "Base.AsyncCondition",
    "category": "method",
    "text": "AsyncCondition(callback::Function)\n\nCreate a async condition that calls the given callback function. The callback is passed one argument, the async condition object itself.\n\n\n\n\n\n"
},

{
    "location": "base/base/#事件-1",
    "page": "重要组件",
    "title": "事件",
    "category": "section",
    "text": "Base.Timer(::Function, ::Real)\nBase.Timer\nBase.AsyncCondition\nBase.AsyncCondition(::Function)<!-- ## Reflection -->"
},

{
    "location": "base/base/#Base.nameof-Tuple{Module}",
    "page": "重要组件",
    "title": "Base.nameof",
    "category": "method",
    "text": "nameof(m::Module) -> Symbol\n\nGet the name of a Module as a Symbol.\n\nExamples\n\njulia> nameof(Base.Broadcast)\n:Broadcast\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.parentmodule",
    "page": "重要组件",
    "title": "Base.parentmodule",
    "category": "function",
    "text": "parentmodule(m::Module) -> Module\n\nGet a module\'s enclosing Module. Main is its own parent.\n\nExamples\n\njulia> parentmodule(Main)\nMain\n\njulia> parentmodule(Base.Broadcast)\nBase\n\n\n\n\n\nparentmodule(t::DataType) -> Module\n\nDetermine the module containing the definition of a (potentially UnionAll-wrapped) DataType.\n\nExamples\n\njulia> module Foo\n           struct Int end\n       end\nFoo\n\njulia> parentmodule(Int)\nCore\n\njulia> parentmodule(Foo.Int)\nFoo\n\n\n\n\n\nparentmodule(f::Function) -> Module\n\nDetermine the module containing the (first) definition of a generic function.\n\n\n\n\n\nparentmodule(f::Function, types) -> Module\n\nDetermine the module containing a given definition of a generic function.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.moduleroot",
    "page": "重要组件",
    "title": "Base.moduleroot",
    "category": "function",
    "text": "moduleroot(m::Module) -> Module\n\nFind the root module of a given module. This is the first module in the chain of parent modules of m which is either a registered root module or which is its own parent module.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@__MODULE__",
    "page": "重要组件",
    "title": "Base.@__MODULE__",
    "category": "macro",
    "text": "@__MODULE__ -> Module\n\nGet the Module of the toplevel eval, which is the Module code is currently being read from.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.fullname",
    "page": "重要组件",
    "title": "Base.fullname",
    "category": "function",
    "text": "fullname(m::Module)\n\nGet the fully-qualified name of a module as a tuple of symbols. For example,\n\nExamples\n\njulia> fullname(Base.Iterators)\n(:Base, :Iterators)\n\njulia> fullname(Main)\n(:Main,)\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.names",
    "page": "重要组件",
    "title": "Base.names",
    "category": "function",
    "text": "names(x::Module; all::Bool = false, imported::Bool = false)\n\nGet an array of the names exported by a Module, excluding deprecated names. If all is true, then the list also includes non-exported names defined in the module, deprecated names, and compiler-generated names. If imported is true, then names explicitly imported from other modules are also included.\n\nAs a special case, all names defined in Main are considered \"exported\", since it is not idiomatic to explicitly export names from Main.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Core.nfields",
    "page": "重要组件",
    "title": "Core.nfields",
    "category": "function",
    "text": "nfields(x) -> Int\n\nGet the number of fields in the given object.\n\nExamples\n\njulia> a = 1//2;\n\njulia> nfields(a)\n2\n\njulia> b = 1\n1\n\njulia> nfields(b)\n0\n\njulia> ex = ErrorException(\"I\'ve done a bad thing\");\n\njulia> nfields(ex)\n1\n\nIn these examples, a is a Rational, which has two fields. b is an Int, which is a primitive bitstype with no fields at all. ex is an ErrorException, which has one field.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.isconst",
    "page": "重要组件",
    "title": "Base.isconst",
    "category": "function",
    "text": "isconst(m::Module, s::Symbol) -> Bool\n\nDetermine whether a global is declared const in a given Module.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.nameof-Tuple{Function}",
    "page": "重要组件",
    "title": "Base.nameof",
    "category": "method",
    "text": "nameof(f::Function) -> Symbol\n\nGet the name of a generic Function as a symbol, or :anonymous.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.functionloc-Tuple{Any,Any}",
    "page": "重要组件",
    "title": "Base.functionloc",
    "category": "method",
    "text": "functionloc(f::Function, types)\n\nReturns a tuple (filename,line) giving the location of a generic Function definition.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.functionloc-Tuple{Method}",
    "page": "重要组件",
    "title": "Base.functionloc",
    "category": "method",
    "text": "functionloc(m::Method)\n\nReturns a tuple (filename,line) giving the location of a Method definition.\n\n\n\n\n\n"
},

{
    "location": "base/base/#反射-1",
    "page": "重要组件",
    "title": "反射",
    "category": "section",
    "text": "Base.nameof(::Module)\nBase.parentmodule\nBase.moduleroot\nBase.@__MODULE__\nBase.fullname\nBase.names\nCore.nfields\nBase.isconst\nBase.nameof(::Function)\nBase.functionloc(::Any, ::Any)\nBase.functionloc(::Method)<!-- ## Internals -->"
},

{
    "location": "base/base/#Base.GC.gc",
    "page": "重要组件",
    "title": "Base.GC.gc",
    "category": "function",
    "text": "GC.gc()\n\nPerform garbage collection.\n\nwarning: Warning\nExcessive use will likely lead to poor performance.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.GC.enable",
    "page": "重要组件",
    "title": "Base.GC.enable",
    "category": "function",
    "text": "GC.enable(on::Bool)\n\nControl whether garbage collection is enabled using a boolean argument (true for enabled, false for disabled). Return previous GC state.\n\nwarning: Warning\nDisabling garbage collection should be used only with caution, as it can cause memory use to grow without bound.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.GC.@preserve",
    "page": "重要组件",
    "title": "Base.GC.@preserve",
    "category": "macro",
    "text": "GC.@preserve x1 x2 ... xn expr\n\nTemporarily protect the given objects from being garbage collected, even if they would otherwise be unreferenced.\n\nThe last argument is the expression during which the object(s) will be preserved. The previous arguments are the objects to preserve.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Meta.lower",
    "page": "重要组件",
    "title": "Base.Meta.lower",
    "category": "function",
    "text": "lower(m, x)\n\nTakes the expression x and returns an equivalent expression in lowered form for executing in module m. See also code_lowered.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Meta.@lower",
    "page": "重要组件",
    "title": "Base.Meta.@lower",
    "category": "macro",
    "text": "@lower [m] x\n\nReturn lowered form of the expression x in module m. By default m is the module in which the macro is called. See also lower.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Meta.parse-Tuple{AbstractString,Int64}",
    "page": "重要组件",
    "title": "Base.Meta.parse",
    "category": "method",
    "text": "parse(str, start; greedy=true, raise=true, depwarn=true)\n\nParse the expression string and return an expression (which could later be passed to eval for execution). start is the index of the first character to start parsing. If greedy is true (default), parse will try to consume as much input as it can; otherwise, it will stop as soon as it has parsed a valid expression. Incomplete but otherwise syntactically valid expressions will return Expr(:incomplete, \"(error message)\"). If raise is true (default), syntax errors other than incomplete expressions will raise an error. If raise is false, parse will return an expression that will raise an error upon evaluation. If depwarn is false, deprecation warnings will be suppressed.\n\njulia> Meta.parse(\"x = 3, y = 5\", 7)\n(:(y = 5), 13)\n\njulia> Meta.parse(\"x = 3, y = 5\", 5)\n(:((3, y) = 5), 13)\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Meta.parse-Tuple{AbstractString}",
    "page": "重要组件",
    "title": "Base.Meta.parse",
    "category": "method",
    "text": "parse(str; raise=true, depwarn=true)\n\nParse the expression string greedily, returning a single expression. An error is thrown if there are additional characters after the first expression. If raise is true (default), syntax errors will raise an error; otherwise, parse will return an expression that will raise an error upon evaluation.  If depwarn is false, deprecation warnings will be suppressed.\n\njulia> Meta.parse(\"x = 3\")\n:(x = 3)\n\njulia> Meta.parse(\"x = \")\n:($(Expr(:incomplete, \"incomplete: premature end of input\")))\n\njulia> Meta.parse(\"1.0.2\")\nERROR: Base.Meta.ParseError(\"invalid numeric constant \\\"1.0.\\\"\")\nStacktrace:\n[...]\n\njulia> Meta.parse(\"1.0.2\"; raise = false)\n:($(Expr(:error, \"invalid numeric constant \\\"1.0.\\\"\")))\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.Meta.ParseError",
    "page": "重要组件",
    "title": "Base.Meta.ParseError",
    "category": "type",
    "text": "ParseError(msg)\n\nThe expression passed to the parse function could not be interpreted as a valid Julia expression.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.macroexpand",
    "page": "重要组件",
    "title": "Base.macroexpand",
    "category": "function",
    "text": "macroexpand(m::Module, x; recursive=true)\n\nTake the expression x and return an equivalent expression with all macros removed (expanded) for executing in module m. The recursive keyword controls whether deeper levels of nested macros are also expanded. This is demonstrated in the example below:\n\njulia> module M\n           macro m1()\n               42\n           end\n           macro m2()\n               :(@m1())\n           end\n       end\nM\n\njulia> macroexpand(M, :(@m2()), recursive=true)\n42\n\njulia> macroexpand(M, :(@m2()), recursive=false)\n:(#= REPL[16]:6 =# M.@m1)\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@macroexpand",
    "page": "重要组件",
    "title": "Base.@macroexpand",
    "category": "macro",
    "text": "@macroexpand\n\nReturn equivalent expression with all macros removed (expanded).\n\nThere are differences between @macroexpand and macroexpand.\n\nWhile macroexpand takes a keyword argument recursive, @macroexpand\n\nis always recursive. For a non recursive macro version, see @macroexpand1.\n\nWhile macroexpand has an explicit module argument, @macroexpand always\n\nexpands with respect to the module in which it is called. This is best seen in the following example:\n\njulia> module M\n           macro m()\n               1\n           end\n           function f()\n               (@macroexpand(@m),\n                macroexpand(M, :(@m)),\n                macroexpand(Main, :(@m))\n               )\n           end\n       end\nM\n\njulia> macro m()\n           2\n       end\n@m (macro with 1 method)\n\njulia> M.f()\n(1, 1, 2)\n\nWith @macroexpand the expression expands where @macroexpand appears in the code (module M in the example). With macroexpand the expression expands in the module given as the first argument.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.@macroexpand1",
    "page": "重要组件",
    "title": "Base.@macroexpand1",
    "category": "macro",
    "text": "@macroexpand1\n\nNon recursive version of @macroexpand.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.code_lowered",
    "page": "重要组件",
    "title": "Base.code_lowered",
    "category": "function",
    "text": "code_lowered(f, types; generated = true)\n\nReturn an array of the lowered forms (IR) for the methods matching the given generic function and type signature.\n\nIf generated is false, the returned CodeInfo instances will correspond to fallback implementations. An error is thrown if no fallback implementation exists. If generated is true, these CodeInfo instances will correspond to the method bodies yielded by expanding the generators.\n\nNote that an error will be thrown if types are not leaf types when generated is true and the corresponding method is a @generated method.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.code_typed",
    "page": "重要组件",
    "title": "Base.code_typed",
    "category": "function",
    "text": "code_typed(f, types; optimize=true)\n\nReturns an array of type-inferred lowered form (IR) for the methods matching the given generic function and type signature. The keyword argument optimize controls whether additional optimizations, such as inlining, are also applied.\n\n\n\n\n\n"
},

{
    "location": "base/base/#Base.precompile",
    "page": "重要组件",
    "title": "Base.precompile",
    "category": "function",
    "text": "precompile(f, args::Tuple{Vararg{Any}})\n\nCompile the given function f for the argument tuple (of types) args, but do not execute it.\n\n\n\n\n\n"
},

{
    "location": "base/base/#内部构件-1",
    "page": "重要组件",
    "title": "内部构件",
    "category": "section",
    "text": "Base.GC.gc\nBase.GC.enable\nBase.GC.@preserve\nMeta.lower\nMeta.@lower\nMeta.parse(::AbstractString, ::Int)\nMeta.parse(::AbstractString)\nMeta.ParseError\nBase.macroexpand\nBase.@macroexpand\nBase.@macroexpand1\nBase.code_lowered\nBase.code_typed\nBase.precompile"
},

{
    "location": "base/collections/#",
    "page": "Collections and Data Structures",
    "title": "Collections and Data Structures",
    "category": "page",
    "text": ""
},

{
    "location": "base/collections/#Collections-and-Data-Structures-1",
    "page": "Collections and Data Structures",
    "title": "Collections and Data Structures",
    "category": "section",
    "text": ""
},

{
    "location": "base/collections/#Base.iterate",
    "page": "Collections and Data Structures",
    "title": "Base.iterate",
    "category": "function",
    "text": "iterate(iter [, state]) -> Union{Nothing, Tuple{Any, Any}}\n\nAdvance the iterator to obtain the next element. If no elements remain, nothing should be returned. Otherwise, a 2-tuple of the next element and the new iteration state should be returned.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.IteratorSize",
    "page": "Collections and Data Structures",
    "title": "Base.IteratorSize",
    "category": "type",
    "text": "IteratorSize(itertype::Type) -> IteratorSize\n\nGiven the type of an iterator, return one of the following values:\n\nSizeUnknown() if the length (number of elements) cannot be determined in advance.\nHasLength() if there is a fixed, finite length.\nHasShape{N}() if there is a known length plus a notion of multidimensional shape (as for an array).  In this case N should give the number of dimensions, and the axes function is valid  for the iterator.\nIsInfinite() if the iterator yields values forever.\n\nThe default value (for iterators that do not define this function) is HasLength(). This means that most iterators are assumed to implement length.\n\nThis trait is generally used to select between algorithms that pre-allocate space for their result, and algorithms that resize their result incrementally.\n\njulia> Base.IteratorSize(1:5)\nBase.HasShape{1}()\n\njulia> Base.IteratorSize((2,3))\nBase.HasLength()\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.IteratorEltype",
    "page": "Collections and Data Structures",
    "title": "Base.IteratorEltype",
    "category": "type",
    "text": "IteratorEltype(itertype::Type) -> IteratorEltype\n\nGiven the type of an iterator, return one of the following values:\n\nEltypeUnknown() if the type of elements yielded by the iterator is not known in advance.\nHasEltype() if the element type is known, and eltype would return a meaningful value.\n\nHasEltype() is the default, since iterators are assumed to implement eltype.\n\nThis trait is generally used to select between algorithms that pre-allocate a specific type of result, and algorithms that pick a result type based on the types of yielded values.\n\njulia> Base.IteratorEltype(1:5)\nBase.HasEltype()\n\n\n\n\n\n"
},

{
    "location": "base/collections/#lib-collections-iteration-1",
    "page": "Collections and Data Structures",
    "title": "Iteration",
    "category": "section",
    "text": "Sequential iteration is implemented by the iterate function. The general for loop:for i in iter   # or  \"for i = iter\"\n    # body\nendis translated into:next = iterate(iter)\nwhile next !== nothing\n    (i, state) = next\n    # body\n    next = iterate(iter, state)\nendThe state object may be anything, and should be chosen appropriately for each iterable type. See the manual section on the iteration interface for more details about defining a custom iterable type.Base.iterate\nBase.IteratorSize\nBase.IteratorEltypeFully implemented by:AbstractRange\nUnitRange\nTuple\nNumber\nAbstractArray\nBitSet\nIdDict\nDict\nWeakKeyDict\nEachLine\nAbstractString\nSet\nPair\nNamedTuple"
},

{
    "location": "base/collections/#Constructors-and-Types-1",
    "page": "Collections and Data Structures",
    "title": "Constructors and Types",
    "category": "section",
    "text": "Base.AbstractRange\nBase.OrdinalRange\nBase.AbstractUnitRange\nBase.StepRange\nBase.UnitRange\nBase.LinRange"
},

{
    "location": "base/collections/#Base.isempty",
    "page": "Collections and Data Structures",
    "title": "Base.isempty",
    "category": "function",
    "text": "isempty(collection) -> Bool\n\nDetermine whether a collection is empty (has no elements).\n\nExamples\n\njulia> isempty([])\ntrue\n\njulia> isempty([1 2 3])\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.empty!",
    "page": "Collections and Data Structures",
    "title": "Base.empty!",
    "category": "function",
    "text": "empty!(collection) -> collection\n\nRemove all elements from a collection.\n\nExamples\n\njulia> A = Dict(\"a\" => 1, \"b\" => 2)\nDict{String,Int64} with 2 entries:\n  \"b\" => 2\n  \"a\" => 1\n\njulia> empty!(A);\n\njulia> A\nDict{String,Int64} with 0 entries\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.length",
    "page": "Collections and Data Structures",
    "title": "Base.length",
    "category": "function",
    "text": "length(collection) -> Integer\n\nReturn the number of elements in the collection.\n\nUse lastindex to get the last valid index of an indexable collection.\n\nExamples\n\njulia> length(1:5)\n5\n\njulia> length([1, 2, 3, 4])\n4\n\njulia> length([1 2; 3 4])\n4\n\n\n\n\n\n"
},

{
    "location": "base/collections/#General-Collections-1",
    "page": "Collections and Data Structures",
    "title": "General Collections",
    "category": "section",
    "text": "Base.isempty\nBase.empty!\nBase.lengthFully implemented by:AbstractRange\nUnitRange\nTuple\nNumber\nAbstractArray\nBitSet\nIdDict\nDict\nWeakKeyDict\nAbstractString\nSet\nNamedTuple"
},

{
    "location": "base/collections/#Base.in",
    "page": "Collections and Data Structures",
    "title": "Base.in",
    "category": "function",
    "text": "in(item, collection) -> Bool\n∈(item, collection) -> Bool\n∋(collection, item) -> Bool\n\nDetermine whether an item is in the given collection, in the sense that it is == to one of the values generated by iterating over the collection. Returns a Bool value, except if item is missing or collection contains missing but not item, in which case missing is returned (three-valued logic, matching the behavior of any and ==).\n\nSome collections follow a slightly different definition. For example, Sets check whether the item isequal to one of the elements. Dicts look for key=>value pairs, and the key is compared using isequal. To test for the presence of a key in a dictionary, use haskey or k in keys(dict). For these collections, the result is always a Bool and never missing.\n\nExamples\n\njulia> a = 1:3:20\n1:3:19\n\njulia> 4 in a\ntrue\n\njulia> 5 in a\nfalse\n\njulia> missing in [1, 2]\nmissing\n\njulia> 1 in [2, missing]\nmissing\n\njulia> 1 in [1, missing]\ntrue\n\njulia> missing in Set([1, 2])\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.:∉",
    "page": "Collections and Data Structures",
    "title": "Base.:∉",
    "category": "function",
    "text": "∉(item, collection) -> Bool\n∌(collection, item) -> Bool\n\nNegation of ∈ and ∋, i.e. checks that item is not in collection.\n\nExamples\n\njulia> 1 ∉ 2:4\ntrue\n\njulia> 1 ∉ 1:3\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.eltype",
    "page": "Collections and Data Structures",
    "title": "Base.eltype",
    "category": "function",
    "text": "eltype(type)\n\nDetermine the type of the elements generated by iterating a collection of the given type. For dictionary types, this will be a Pair{KeyType,ValType}. The definition eltype(x) = eltype(typeof(x)) is provided for convenience so that instances can be passed instead of types. However the form that accepts a type argument should be defined for new types.\n\nExamples\n\njulia> eltype(fill(1f0, (2,2)))\nFloat32\n\njulia> eltype(fill(0x1, (2,2)))\nUInt8\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.indexin",
    "page": "Collections and Data Structures",
    "title": "Base.indexin",
    "category": "function",
    "text": "indexin(a, b)\n\nReturn an array containing the first index in b for each value in a that is a member of b. The output array contains nothing wherever a is not a member of b.\n\nExamples\n\njulia> a = [\'a\', \'b\', \'c\', \'b\', \'d\', \'a\'];\n\njulia> b = [\'a\', \'b\', \'c\'];\n\njulia> indexin(a, b)\n6-element Array{Union{Nothing, Int64},1}:\n 1\n 2\n 3\n 2\n  nothing\n 1\n\njulia> indexin(b, a)\n3-element Array{Union{Nothing, Int64},1}:\n 1\n 2\n 3\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.unique",
    "page": "Collections and Data Structures",
    "title": "Base.unique",
    "category": "function",
    "text": "unique(itr)\n\nReturn an array containing only the unique elements of collection itr, as determined by isequal, in the order that the first of each set of equivalent elements originally appears. The element type of the input is preserved.\n\nExamples\n\njulia> unique([1, 2, 6, 2])\n3-element Array{Int64,1}:\n 1\n 2\n 6\n\njulia> unique(Real[1, 1.0, 2])\n2-element Array{Real,1}:\n 1\n 2\n\n\n\n\n\nunique(f, itr)\n\nReturns an array containing one value from itr for each unique value produced by f applied to elements of itr.\n\nExamples\n\njulia> unique(x -> x^2, [1, -1, 3, -3, 4])\n3-element Array{Int64,1}:\n 1\n 3\n 4\n\n\n\n\n\nunique(A::AbstractArray; dims::Int)\n\nReturn unique regions of A along dimension dims.\n\nExamples\n\njulia> A = map(isodd, reshape(Vector(1:8), (2,2,2)))\n2×2×2 Array{Bool,3}:\n[:, :, 1] =\n  true   true\n false  false\n\n[:, :, 2] =\n  true   true\n false  false\n\njulia> unique(A)\n2-element Array{Bool,1}:\n  true\n false\n\njulia> unique(A, dims=2)\n2×1×2 Array{Bool,3}:\n[:, :, 1] =\n  true\n false\n\n[:, :, 2] =\n  true\n false\n\njulia> unique(A, dims=3)\n2×2×1 Array{Bool,3}:\n[:, :, 1] =\n  true   true\n false  false\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.unique!",
    "page": "Collections and Data Structures",
    "title": "Base.unique!",
    "category": "function",
    "text": "unique!(A::AbstractVector)\n\nRemove duplicate items as determined by isequal, then return the modified A. unique! will return the elements of A in the order that they occur. If you do not care about the order of the returned data, then calling (sort!(A); unique!(A)) will be much more efficient as long as the elements of A can be sorted.\n\nExamples\n\njulia> unique!([1, 1, 1])\n1-element Array{Int64,1}:\n 1\n\njulia> A = [7, 3, 2, 3, 7, 5];\n\njulia> unique!(A)\n4-element Array{Int64,1}:\n 7\n 3\n 2\n 5\n\njulia> B = [7, 6, 42, 6, 7, 42];\n\njulia> sort!(B);  # unique! is able to process sorted data much more efficiently.\n\njulia> unique!(B)\n3-element Array{Int64,1}:\n  6\n  7\n 42\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.allunique",
    "page": "Collections and Data Structures",
    "title": "Base.allunique",
    "category": "function",
    "text": "allunique(itr) -> Bool\n\nReturn true if all values from itr are distinct when compared with isequal.\n\nExamples\n\njulia> a = [1; 2; 3]\n3-element Array{Int64,1}:\n 1\n 2\n 3\n\njulia> allunique([a, a])\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.reduce-Tuple{Any,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.reduce",
    "category": "method",
    "text": "reduce(op, itr; [init])\n\nReduce the given collection itr with the given binary operator op. If provided, the initial value init must be a neutral element for op that will be returned for empty collections. It is unspecified whether init is used for non-empty collections.\n\nFor empty collections, providing init will be necessary, except for some special cases (e.g. when op is one of +, *, max, min, &, |) when Julia can determine the neutral element of op.\n\nReductions for certain commonly-used operators may have special implementations, and should be used instead: maximum(itr), minimum(itr), sum(itr), prod(itr),  any(itr), all(itr).\n\nThe associativity of the reduction is implementation dependent. This means that you can\'t use non-associative operations like - because it is undefined whether reduce(-,[1,2,3]) should be evaluated as (1-2)-3 or 1-(2-3). Use foldl or foldr instead for guaranteed left or right associativity.\n\nSome operations accumulate error. Parallelism will be easier if the reduction can be executed in groups. Future versions of Julia might change the algorithm. Note that the elements are not reordered if you use an ordered collection.\n\nExamples\n\njulia> reduce(*, [2; 3; 4])\n24\n\njulia> reduce(*, [2; 3; 4]; init=-1)\n-24\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.foldl-Tuple{Any,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.foldl",
    "category": "method",
    "text": "foldl(op, itr; [init])\n\nLike reduce, but with guaranteed left associativity. If provided, the keyword argument init will be used exactly once. In general, it will be necessary to provide init to work with empty collections.\n\nExamples\n\njulia> foldl(=>, 1:4)\n((1=>2)=>3) => 4\n\njulia> foldl(=>, 1:4; init=0)\n(((0=>1)=>2)=>3) => 4\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.foldr-Tuple{Any,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.foldr",
    "category": "method",
    "text": "foldr(op, itr; [init])\n\nLike reduce, but with guaranteed right associativity. If provided, the keyword argument init will be used exactly once. In general, it will be necessary to provide init to work with empty collections.\n\nExamples\n\njulia> foldr(=>, 1:4)\n1 => (2=>(3=>4))\n\njulia> foldr(=>, 1:4; init=0)\n1 => (2=>(3=>(4=>0)))\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.maximum",
    "page": "Collections and Data Structures",
    "title": "Base.maximum",
    "category": "function",
    "text": "maximum(itr)\n\nReturns the largest element in a collection.\n\nExamples\n\njulia> maximum(-20.5:10)\n9.5\n\njulia> maximum([1,2,3])\n3\n\n\n\n\n\nmaximum(A::AbstractArray; dims)\n\nCompute the maximum value of an array over the given dimensions. See also the max(a,b) function to take the maximum of two or more arguments, which can be applied elementwise to arrays via max.(a,b).\n\nExamples\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> maximum(A, dims=1)\n1×2 Array{Int64,2}:\n 3  4\n\njulia> maximum(A, dims=2)\n2×1 Array{Int64,2}:\n 2\n 4\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.maximum!",
    "page": "Collections and Data Structures",
    "title": "Base.maximum!",
    "category": "function",
    "text": "maximum!(r, A)\n\nCompute the maximum value of A over the singleton dimensions of r, and write results to r.\n\nExamples\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> maximum!([1; 1], A)\n2-element Array{Int64,1}:\n 2\n 4\n\njulia> maximum!([1 1], A)\n1×2 Array{Int64,2}:\n 3  4\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.minimum",
    "page": "Collections and Data Structures",
    "title": "Base.minimum",
    "category": "function",
    "text": "minimum(itr)\n\nReturns the smallest element in a collection.\n\nExamples\n\njulia> minimum(-20.5:10)\n-20.5\n\njulia> minimum([1,2,3])\n1\n\n\n\n\n\nminimum(A::AbstractArray; dims)\n\nCompute the minimum value of an array over the given dimensions. See also the min(a,b) function to take the minimum of two or more arguments, which can be applied elementwise to arrays via min.(a,b).\n\nExamples\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> minimum(A, dims=1)\n1×2 Array{Int64,2}:\n 1  2\n\njulia> minimum(A, dims=2)\n2×1 Array{Int64,2}:\n 1\n 3\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.minimum!",
    "page": "Collections and Data Structures",
    "title": "Base.minimum!",
    "category": "function",
    "text": "minimum!(r, A)\n\nCompute the minimum value of A over the singleton dimensions of r, and write results to r.\n\nExamples\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> minimum!([1; 1], A)\n2-element Array{Int64,1}:\n 1\n 3\n\njulia> minimum!([1 1], A)\n1×2 Array{Int64,2}:\n 1  2\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.extrema",
    "page": "Collections and Data Structures",
    "title": "Base.extrema",
    "category": "function",
    "text": "extrema(itr) -> Tuple\n\nCompute both the minimum and maximum element in a single pass, and return them as a 2-tuple.\n\nExamples\n\njulia> extrema(2:10)\n(2, 10)\n\njulia> extrema([9,pi,4.5])\n(3.141592653589793, 9.0)\n\n\n\n\n\nextrema(A::AbstractArray; dims) -> Array{Tuple}\n\nCompute the minimum and maximum elements of an array over the given dimensions.\n\nExamples\n\njulia> A = reshape(Vector(1:2:16), (2,2,2))\n2×2×2 Array{Int64,3}:\n[:, :, 1] =\n 1  5\n 3  7\n\n[:, :, 2] =\n  9  13\n 11  15\n\njulia> extrema(A, dims = (1,2))\n1×1×2 Array{Tuple{Int64,Int64},3}:\n[:, :, 1] =\n (1, 7)\n\n[:, :, 2] =\n (9, 15)\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.argmax",
    "page": "Collections and Data Structures",
    "title": "Base.argmax",
    "category": "function",
    "text": "argmax(itr) -> Integer\n\nReturn the index of the maximum element in a collection. If there are multiple maximal elements, then the first one will be returned.\n\nThe collection must not be empty.\n\nExamples\n\njulia> argmax([8,0.1,-9,pi])\n1\n\njulia> argmax([1,7,7,6])\n2\n\njulia> argmax([1,7,7,NaN])\n4\n\n\n\n\n\nargmax(A; dims) -> indices\n\nFor an array input, return the indices of the maximum elements over the given dimensions. NaN is treated as greater than all other values.\n\nExamples\n\njulia> A = [1.0 2; 3 4]\n2×2 Array{Float64,2}:\n 1.0  2.0\n 3.0  4.0\n\njulia> argmax(A, dims=1)\n1×2 Array{CartesianIndex{2},2}:\n CartesianIndex(2, 1)  CartesianIndex(2, 2)\n\njulia> argmax(A, dims=2)\n2×1 Array{CartesianIndex{2},2}:\n CartesianIndex(1, 2)\n CartesianIndex(2, 2)\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.argmin",
    "page": "Collections and Data Structures",
    "title": "Base.argmin",
    "category": "function",
    "text": "argmin(itr) -> Integer\n\nReturn the index of the minimum element in a collection. If there are multiple minimal elements, then the first one will be returned.\n\nThe collection must not be empty.\n\nExamples\n\njulia> argmin([8,0.1,-9,pi])\n3\n\njulia> argmin([7,1,1,6])\n2\n\njulia> argmin([7,1,1,NaN])\n4\n\n\n\n\n\nargmin(A; dims) -> indices\n\nFor an array input, return the indices of the minimum elements over the given dimensions. NaN is treated as less than all other values.\n\nExamples\n\njulia> A = [1.0 2; 3 4]\n2×2 Array{Float64,2}:\n 1.0  2.0\n 3.0  4.0\n\njulia> argmin(A, dims=1)\n1×2 Array{CartesianIndex{2},2}:\n CartesianIndex(1, 1)  CartesianIndex(1, 2)\n\njulia> argmin(A, dims=2)\n2×1 Array{CartesianIndex{2},2}:\n CartesianIndex(1, 1)\n CartesianIndex(2, 1)\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.findmax",
    "page": "Collections and Data Structures",
    "title": "Base.findmax",
    "category": "function",
    "text": "findmax(itr) -> (x, index)\n\nReturn the maximum element of the collection itr and its index. If there are multiple maximal elements, then the first one will be returned. If any data element is NaN, this element is returned. The result is in line with max.\n\nThe collection must not be empty.\n\nExamples\n\njulia> findmax([8,0.1,-9,pi])\n(8.0, 1)\n\njulia> findmax([1,7,7,6])\n(7, 2)\n\njulia> findmax([1,7,7,NaN])\n(NaN, 4)\n\n\n\n\n\nfindmax(A; dims) -> (maxval, index)\n\nFor an array input, returns the value and index of the maximum over the given dimensions. NaN is treated as greater than all other values.\n\nExamples\n\njulia> A = [1.0 2; 3 4]\n2×2 Array{Float64,2}:\n 1.0  2.0\n 3.0  4.0\n\njulia> findmax(A, dims=1)\n([3.0 4.0], CartesianIndex{2}[CartesianIndex(2, 1) CartesianIndex(2, 2)])\n\njulia> findmax(A, dims=2)\n([2.0; 4.0], CartesianIndex{2}[CartesianIndex(1, 2); CartesianIndex(2, 2)])\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.findmin",
    "page": "Collections and Data Structures",
    "title": "Base.findmin",
    "category": "function",
    "text": "findmin(itr) -> (x, index)\n\nReturn the minimum element of the collection itr and its index. If there are multiple minimal elements, then the first one will be returned. If any data element is NaN, this element is returned. The result is in line with min.\n\nThe collection must not be empty.\n\nExamples\n\njulia> findmin([8,0.1,-9,pi])\n(-9.0, 3)\n\njulia> findmin([7,1,1,6])\n(1, 2)\n\njulia> findmin([7,1,1,NaN])\n(NaN, 4)\n\n\n\n\n\nfindmin(A; dims) -> (minval, index)\n\nFor an array input, returns the value and index of the minimum over the given dimensions. NaN is treated as less than all other values.\n\nExamples\n\njulia> A = [1.0 2; 3 4]\n2×2 Array{Float64,2}:\n 1.0  2.0\n 3.0  4.0\n\njulia> findmin(A, dims=1)\n([1.0 2.0], CartesianIndex{2}[CartesianIndex(1, 1) CartesianIndex(1, 2)])\n\njulia> findmin(A, dims=2)\n([1.0; 3.0], CartesianIndex{2}[CartesianIndex(1, 1); CartesianIndex(2, 1)])\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.findmax!",
    "page": "Collections and Data Structures",
    "title": "Base.findmax!",
    "category": "function",
    "text": "findmax!(rval, rind, A) -> (maxval, index)\n\nFind the maximum of A and the corresponding linear index along singleton dimensions of rval and rind, and store the results in rval and rind. NaN is treated as greater than all other values.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.findmin!",
    "page": "Collections and Data Structures",
    "title": "Base.findmin!",
    "category": "function",
    "text": "findmin!(rval, rind, A) -> (minval, index)\n\nFind the minimum of A and the corresponding linear index along singleton dimensions of rval and rind, and store the results in rval and rind. NaN is treated as less than all other values.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.sum",
    "page": "Collections and Data Structures",
    "title": "Base.sum",
    "category": "function",
    "text": "sum(f, itr)\n\nSum the results of calling function f on each element of itr.\n\nThe return type is Int for signed integers of less than system word size, and UInt for unsigned integers of less than system word size.  For all other arguments, a common return type is found to which all arguments are promoted.\n\nExamples\n\njulia> sum(abs2, [2; 3; 4])\n29\n\nNote the important difference between sum(A) and reduce(+, A) for arrays with small integer eltype:\n\njulia> sum(Int8[100, 28])\n128\n\njulia> reduce(+, Int8[100, 28])\n-128\n\nIn the former case, the integers are widened to system word size and therefore the result is 128. In the latter case, no such widening happens and integer overflow results in -128.\n\n\n\n\n\nsum(itr)\n\nReturns the sum of all elements in a collection.\n\nThe return type is Int for signed integers of less than system word size, and UInt for unsigned integers of less than system word size.  For all other arguments, a common return type is found to which all arguments are promoted.\n\nExamples\n\njulia> sum(1:20)\n210\n\n\n\n\n\nsum(A::AbstractArray; dims)\n\nSum elements of an array over the given dimensions.\n\nExamples\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> sum(A, dims=1)\n1×2 Array{Int64,2}:\n 4  6\n\njulia> sum(A, dims=2)\n2×1 Array{Int64,2}:\n 3\n 7\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.sum!",
    "page": "Collections and Data Structures",
    "title": "Base.sum!",
    "category": "function",
    "text": "sum!(r, A)\n\nSum elements of A over the singleton dimensions of r, and write results to r.\n\nExamples\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> sum!([1; 1], A)\n2-element Array{Int64,1}:\n 3\n 7\n\njulia> sum!([1 1], A)\n1×2 Array{Int64,2}:\n 4  6\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.prod",
    "page": "Collections and Data Structures",
    "title": "Base.prod",
    "category": "function",
    "text": "prod(f, itr)\n\nReturns the product of f applied to each element of itr.\n\nThe return type is Int for signed integers of less than system word size, and UInt for unsigned integers of less than system word size.  For all other arguments, a common return type is found to which all arguments are promoted.\n\nExamples\n\njulia> prod(abs2, [2; 3; 4])\n576\n\n\n\n\n\nprod(itr)\n\nReturns the product of all elements of a collection.\n\nThe return type is Int for signed integers of less than system word size, and UInt for unsigned integers of less than system word size.  For all other arguments, a common return type is found to which all arguments are promoted.\n\nExamples\n\njulia> prod(1:20)\n2432902008176640000\n\n\n\n\n\nprod(A::AbstractArray; dims)\n\nMultiply elements of an array over the given dimensions.\n\nExamples\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> prod(A, dims=1)\n1×2 Array{Int64,2}:\n 3  8\n\njulia> prod(A, dims=2)\n2×1 Array{Int64,2}:\n  2\n 12\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.prod!",
    "page": "Collections and Data Structures",
    "title": "Base.prod!",
    "category": "function",
    "text": "prod!(r, A)\n\nMultiply elements of A over the singleton dimensions of r, and write results to r.\n\nExamples\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> prod!([1; 1], A)\n2-element Array{Int64,1}:\n  2\n 12\n\njulia> prod!([1 1], A)\n1×2 Array{Int64,2}:\n 3  8\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.any-Tuple{Any}",
    "page": "Collections and Data Structures",
    "title": "Base.any",
    "category": "method",
    "text": "any(itr) -> Bool\n\nTest whether any elements of a boolean collection are true, returning true as soon as the first true value in itr is encountered (short-circuiting).\n\nIf the input contains missing values, return missing if all non-missing values are false (or equivalently, if the input contains no true value), following three-valued logic.\n\nExamples\n\njulia> a = [true,false,false,true]\n4-element Array{Bool,1}:\n  true\n false\n false\n  true\n\njulia> any(a)\ntrue\n\njulia> any((println(i); v) for (i, v) in enumerate(a))\n1\ntrue\n\njulia> any([missing, true])\ntrue\n\njulia> any([false, missing])\nmissing\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.any-Tuple{AbstractArray,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.any",
    "category": "method",
    "text": "any(p, itr) -> Bool\n\nDetermine whether predicate p returns true for any elements of itr, returning true as soon as the first item in itr for which p returns true is encountered (short-circuiting).\n\nIf the input contains missing values, return missing if all non-missing values are false (or equivalently, if the input contains no true value), following three-valued logic.\n\nExamples\n\njulia> any(i->(4<=i<=6), [3,5,7])\ntrue\n\njulia> any(i -> (println(i); i > 3), 1:10)\n1\n2\n3\n4\ntrue\n\njulia> any(i -> i > 0, [1, missing])\ntrue\n\njulia> any(i -> i > 0, [-1, missing])\nmissing\n\njulia> any(i -> i > 0, [-1, 0])\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.any!",
    "page": "Collections and Data Structures",
    "title": "Base.any!",
    "category": "function",
    "text": "any!(r, A)\n\nTest whether any values in A along the singleton dimensions of r are true, and write results to r.\n\nExamples\n\njulia> A = [true false; true false]\n2×2 Array{Bool,2}:\n true  false\n true  false\n\njulia> any!([1; 1], A)\n2-element Array{Int64,1}:\n 1\n 1\n\njulia> any!([1 1], A)\n1×2 Array{Int64,2}:\n 1  0\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.all-Tuple{Any}",
    "page": "Collections and Data Structures",
    "title": "Base.all",
    "category": "method",
    "text": "all(itr) -> Bool\n\nTest whether all elements of a boolean collection are true, returning false as soon as the first false value in itr is encountered (short-circuiting).\n\nIf the input contains missing values, return missing if all non-missing values are true (or equivalently, if the input contains no false value), following three-valued logic.\n\nExamples\n\njulia> a = [true,false,false,true]\n4-element Array{Bool,1}:\n  true\n false\n false\n  true\n\njulia> all(a)\nfalse\n\njulia> all((println(i); v) for (i, v) in enumerate(a))\n1\n2\nfalse\n\njulia> all([missing, false])\nfalse\n\njulia> all([true, missing])\nmissing\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.all-Tuple{AbstractArray,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.all",
    "category": "method",
    "text": "all(p, itr) -> Bool\n\nDetermine whether predicate p returns true for all elements of itr, returning false as soon as the first item in itr for which p returns false is encountered (short-circuiting).\n\nIf the input contains missing values, return missing if all non-missing values are true (or equivalently, if the input contains no false value), following three-valued logic.\n\nExamples\n\njulia> all(i->(4<=i<=6), [4,5,6])\ntrue\n\njulia> all(i -> (println(i); i < 3), 1:10)\n1\n2\n3\nfalse\n\njulia> all(i -> i > 0, [1, missing])\nmissing\n\njulia> all(i -> i > 0, [-1, missing])\nfalse\n\njulia> all(i -> i > 0, [1, 2])\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.all!",
    "page": "Collections and Data Structures",
    "title": "Base.all!",
    "category": "function",
    "text": "all!(r, A)\n\nTest whether all values in A along the singleton dimensions of r are true, and write results to r.\n\nExamples\n\njulia> A = [true false; true false]\n2×2 Array{Bool,2}:\n true  false\n true  false\n\njulia> all!([1; 1], A)\n2-element Array{Int64,1}:\n 0\n 0\n\njulia> all!([1 1], A)\n1×2 Array{Int64,2}:\n 1  0\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.count",
    "page": "Collections and Data Structures",
    "title": "Base.count",
    "category": "function",
    "text": "count(p, itr) -> Integer\ncount(itr) -> Integer\n\nCount the number of elements in itr for which predicate p returns true. If p is omitted, counts the number of true elements in itr (which should be a collection of boolean values).\n\nExamples\n\njulia> count(i->(4<=i<=6), [2,3,4,5,6])\n3\n\njulia> count([true, false, true, true])\n3\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.any-Tuple{Any,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.any",
    "category": "method",
    "text": "any(p, itr) -> Bool\n\nDetermine whether predicate p returns true for any elements of itr, returning true as soon as the first item in itr for which p returns true is encountered (short-circuiting).\n\nIf the input contains missing values, return missing if all non-missing values are false (or equivalently, if the input contains no true value), following three-valued logic.\n\nExamples\n\njulia> any(i->(4<=i<=6), [3,5,7])\ntrue\n\njulia> any(i -> (println(i); i > 3), 1:10)\n1\n2\n3\n4\ntrue\n\njulia> any(i -> i > 0, [1, missing])\ntrue\n\njulia> any(i -> i > 0, [-1, missing])\nmissing\n\njulia> any(i -> i > 0, [-1, 0])\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.all-Tuple{Any,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.all",
    "category": "method",
    "text": "all(p, itr) -> Bool\n\nDetermine whether predicate p returns true for all elements of itr, returning false as soon as the first item in itr for which p returns false is encountered (short-circuiting).\n\nIf the input contains missing values, return missing if all non-missing values are true (or equivalently, if the input contains no false value), following three-valued logic.\n\nExamples\n\njulia> all(i->(4<=i<=6), [4,5,6])\ntrue\n\njulia> all(i -> (println(i); i < 3), 1:10)\n1\n2\n3\nfalse\n\njulia> all(i -> i > 0, [1, missing])\nmissing\n\njulia> all(i -> i > 0, [-1, missing])\nfalse\n\njulia> all(i -> i > 0, [1, 2])\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.foreach",
    "page": "Collections and Data Structures",
    "title": "Base.foreach",
    "category": "function",
    "text": "foreach(f, c...) -> Nothing\n\nCall function f on each element of iterable c. For multiple iterable arguments, f is called elementwise. foreach should be used instead of map when the results of f are not needed, for example in foreach(println, array).\n\nExamples\n\njulia> a = 1:3:7;\n\njulia> foreach(x -> println(x^2), a)\n1\n16\n49\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.map",
    "page": "Collections and Data Structures",
    "title": "Base.map",
    "category": "function",
    "text": "map(f, c...) -> collection\n\nTransform collection c by applying f to each element. For multiple collection arguments, apply f elementwise.\n\nSee also: mapslices\n\nExamples\n\njulia> map(x -> x * 2, [1, 2, 3])\n3-element Array{Int64,1}:\n 2\n 4\n 6\n\njulia> map(+, [1, 2, 3], [10, 20, 30])\n3-element Array{Int64,1}:\n 11\n 22\n 33\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.map!",
    "page": "Collections and Data Structures",
    "title": "Base.map!",
    "category": "function",
    "text": "map!(function, destination, collection...)\n\nLike map, but stores the result in destination rather than a new collection. destination must be at least as large as the first collection.\n\nExamples\n\njulia> x = zeros(3);\n\njulia> map!(x -> x * 2, x, [1, 2, 3]);\n\njulia> x\n3-element Array{Float64,1}:\n 2.0\n 4.0\n 6.0\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.mapreduce-Tuple{Any,Any,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.mapreduce",
    "category": "method",
    "text": "mapreduce(f, op, itr; [init])\n\nApply function f to each element in itr, and then reduce the result using the binary function op. If provided, init must be a neutral element for op that will be returne for empty collections. It is unspecified whether init is used for non-empty collections. In general, it will be necessary to provide init to work with empty collections.\n\nmapreduce is functionally equivalent to calling reduce(op, map(f, itr); init=init), but will in general execute faster since no intermediate collection needs to be created. See documentation for reduce and map.\n\nExamples\n\njulia> mapreduce(x->x^2, +, [1:3;]) # == 1 + 4 + 9\n14\n\nThe associativity of the reduction is implementation-dependent. Additionally, some implementations may reuse the return value of f for elements that appear multiple times in itr. Use mapfoldl or mapfoldr instead for guaranteed left or right associativity and invocation of f for every value.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.mapfoldl-Tuple{Any,Any,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.mapfoldl",
    "category": "method",
    "text": "mapfoldl(f, op, itr; [init])\n\nLike mapreduce, but with guaranteed left associativity, as in foldl. If provided, the keyword argument init will be used exactly once. In general, it will be necessary to provide init to work with empty collections.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.mapfoldr-Tuple{Any,Any,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.mapfoldr",
    "category": "method",
    "text": "mapfoldr(f, op, itr; [init])\n\nLike mapreduce, but with guaranteed right associativity, as in foldr. If provided, the keyword argument init will be used exactly once. In general, it will be necessary to provide init to work with empty collections.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.first",
    "page": "Collections and Data Structures",
    "title": "Base.first",
    "category": "function",
    "text": "first(coll)\n\nGet the first element of an iterable collection. Return the start point of an AbstractRange even if it is empty.\n\nExamples\n\njulia> first(2:2:10)\n2\n\njulia> first([1; 2; 3; 4])\n1\n\n\n\n\n\nfirst(s::AbstractString, n::Integer)\n\nGet a string consisting of the first n characters of s.\n\njulia> first(\"∀ϵ≠0: ϵ²>0\", 0)\n\"\"\n\njulia> first(\"∀ϵ≠0: ϵ²>0\", 1)\n\"∀\"\n\njulia> first(\"∀ϵ≠0: ϵ²>0\", 3)\n\"∀ϵ≠\"\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.last",
    "page": "Collections and Data Structures",
    "title": "Base.last",
    "category": "function",
    "text": "last(coll)\n\nGet the last element of an ordered collection, if it can be computed in O(1) time. This is accomplished by calling lastindex to get the last index. Return the end point of an AbstractRange even if it is empty.\n\nExamples\n\njulia> last(1:2:10)\n9\n\njulia> last([1; 2; 3; 4])\n4\n\n\n\n\n\nlast(s::AbstractString, n::Integer)\n\nGet a string consisting of the last n characters of s.\n\njulia> last(\"∀ϵ≠0: ϵ²>0\", 0)\n\"\"\n\njulia> last(\"∀ϵ≠0: ϵ²>0\", 1)\n\"0\"\n\njulia> last(\"∀ϵ≠0: ϵ²>0\", 3)\n\"²>0\"\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.step",
    "page": "Collections and Data Structures",
    "title": "Base.step",
    "category": "function",
    "text": "step(r)\n\nGet the step size of an AbstractRange object.\n\nExamples\n\njulia> step(1:10)\n1\n\njulia> step(1:2:10)\n2\n\njulia> step(2.5:0.3:10.9)\n0.3\n\njulia> step(range(2.5, stop=10.9, length=85))\n0.1\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.collect-Tuple{Any}",
    "page": "Collections and Data Structures",
    "title": "Base.collect",
    "category": "method",
    "text": "collect(collection)\n\nReturn an Array of all items in a collection or iterator. For dictionaries, returns Pair{KeyType, ValType}. If the argument is array-like or is an iterator with the HasShape trait, the result will have the same shape and number of dimensions as the argument.\n\nExamples\n\njulia> collect(1:2:13)\n7-element Array{Int64,1}:\n  1\n  3\n  5\n  7\n  9\n 11\n 13\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.collect-Tuple{Type,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.collect",
    "category": "method",
    "text": "collect(element_type, collection)\n\nReturn an Array with the given element type of all items in a collection or iterable. The result has the same shape and number of dimensions as collection.\n\nExamples\n\njulia> collect(Float64, 1:2:5)\n3-element Array{Float64,1}:\n 1.0\n 3.0\n 5.0\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.filter",
    "page": "Collections and Data Structures",
    "title": "Base.filter",
    "category": "function",
    "text": "filter(f, a::AbstractArray)\n\nReturn a copy of a, removing elements for which f is false. The function f is passed one argument.\n\nExamples\n\njulia> a = 1:10\n1:10\n\njulia> filter(isodd, a)\n5-element Array{Int64,1}:\n 1\n 3\n 5\n 7\n 9\n\n\n\n\n\nfilter(f, d::AbstractDict)\n\nReturn a copy of d, removing elements for which f is false. The function f is passed key=>value pairs.\n\nExamples\n\njulia> d = Dict(1=>\"a\", 2=>\"b\")\nDict{Int64,String} with 2 entries:\n  2 => \"b\"\n  1 => \"a\"\n\njulia> filter(p->isodd(p.first), d)\nDict{Int64,String} with 1 entry:\n  1 => \"a\"\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.filter!",
    "page": "Collections and Data Structures",
    "title": "Base.filter!",
    "category": "function",
    "text": "filter!(f, a::AbstractVector)\n\nUpdate a, removing elements for which f is false. The function f is passed one argument.\n\nExamples\n\njulia> filter!(isodd, Vector(1:10))\n5-element Array{Int64,1}:\n 1\n 3\n 5\n 7\n 9\n\n\n\n\n\nfilter!(f, d::AbstractDict)\n\nUpdate d, removing elements for which f is false. The function f is passed key=>value pairs.\n\nExample\n\njulia> d = Dict(1=>\"a\", 2=>\"b\", 3=>\"c\")\nDict{Int64,String} with 3 entries:\n  2 => \"b\"\n  3 => \"c\"\n  1 => \"a\"\n\njulia> filter!(p->isodd(p.first), d)\nDict{Int64,String} with 2 entries:\n  3 => \"c\"\n  1 => \"a\"\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.replace-Tuple{Any,Vararg{Pair,N} where N}",
    "page": "Collections and Data Structures",
    "title": "Base.replace",
    "category": "method",
    "text": "replace(A, old_new::Pair...; [count::Integer])\n\nReturn a copy of collection A where, for each pair old=>new in old_new, all occurrences of old are replaced by new. Equality is determined using isequal. If count is specified, then replace at most count occurrences in total.\n\nThe element type of the result is chosen using promotion (see promote_type) based on the element type of A and on the types of the new values in pairs. If count is omitted and the element type of A is a Union, the element type of the result will not include singleton types which are replaced with values of a different type: for example, Union{T,Missing} will become T if missing is replaced.\n\nSee also replace!.\n\nExamples\n\njulia> replace([1, 2, 1, 3], 1=>0, 2=>4, count=2)\n4-element Array{Int64,1}:\n 0\n 4\n 1\n 3\n\njulia> replace([1, missing], missing=>0)\n2-element Array{Int64,1}:\n 1\n 0\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.replace-Tuple{Union{Function, Type},Any,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.replace",
    "category": "method",
    "text": "replace(pred::Function, A, new; [count::Integer])\n\nReturn a copy of collection A where all occurrences x for which pred(x) is true are replaced by new. If count is specified, then replace at most count occurrences in total.\n\nExamples\n\njulia> replace(isodd, [1, 2, 3, 1], 0, count=2)\n4-element Array{Int64,1}:\n 0\n 2\n 0\n 1\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.replace-Tuple{Union{Function, Type},Any}",
    "page": "Collections and Data Structures",
    "title": "Base.replace",
    "category": "method",
    "text": "replace(new::Function, A; [count::Integer])\n\nReturn a copy of A where each value x in A is replaced by new(x) If count is specified, then replace at most count values in total (replacements being defined as new(x) !== x).\n\nExamples\n\njulia> replace(x -> isodd(x) ? 2x : x, [1, 2, 3, 4])\n4-element Array{Int64,1}:\n 2\n 2\n 6\n 4\n\njulia> replace(Dict(1=>2, 3=>4)) do kv\n           first(kv) < 3 ? first(kv)=>3 : kv\n       end\nDict{Int64,Int64} with 2 entries:\n  3 => 4\n  1 => 3\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.replace!",
    "page": "Collections and Data Structures",
    "title": "Base.replace!",
    "category": "function",
    "text": "replace!(A, old_new::Pair...; [count::Integer])\n\nFor each pair old=>new in old_new, replace all occurrences of old in collection A by new. Equality is determined using isequal. If count is specified, then replace at most count occurrences in total. See also replace.\n\nExamples\n\njulia> replace!([1, 2, 1, 3], 1=>0, 2=>4, count=2)\n4-element Array{Int64,1}:\n 0\n 4\n 1\n 3\n\njulia> replace!(Set([1, 2, 3]), 1=>0)\nSet([0, 2, 3])\n\n\n\n\n\nreplace!(pred::Function, A, new; [count::Integer])\n\nReplace all occurrences x in collection A for which pred(x) is true by new.\n\nExamples\n\njulia> A = [1, 2, 3, 1];\n\njulia> replace!(isodd, A, 0, count=2)\n4-element Array{Int64,1}:\n 0\n 2\n 0\n 1\n\n\n\n\n\nreplace!(new::Function, A; [count::Integer])\n\nReplace each element x in collection A by new(x). If count is specified, then replace at most count values in total (replacements being defined as new(x) !== x).\n\nExamples\n\njulia> replace!(x -> isodd(x) ? 2x : x, [1, 2, 3, 4])\n4-element Array{Int64,1}:\n 2\n 2\n 6\n 4\n\njulia> replace!(Dict(1=>2, 3=>4)) do kv\n           first(kv) < 3 ? first(kv)=>3 : kv\n       end\nDict{Int64,Int64} with 2 entries:\n  3 => 4\n  1 => 3\n\njulia> replace!(x->2x, Set([3, 6]))\nSet([6, 12])\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Iterable-Collections-1",
    "page": "Collections and Data Structures",
    "title": "Iterable Collections",
    "category": "section",
    "text": "Base.in\nBase.:∉\nBase.eltype\nBase.indexin\nBase.unique\nBase.unique!\nBase.allunique\nBase.reduce(::Any, ::Any)\nBase.foldl(::Any, ::Any)\nBase.foldr(::Any, ::Any)\nBase.maximum\nBase.maximum!\nBase.minimum\nBase.minimum!\nBase.extrema\nBase.argmax\nBase.argmin\nBase.findmax\nBase.findmin\nBase.findmax!\nBase.findmin!\nBase.sum\nBase.sum!\nBase.prod\nBase.prod!\nBase.any(::Any)\nBase.any(::AbstractArray, ::Any)\nBase.any!\nBase.all(::Any)\nBase.all(::AbstractArray, ::Any)\nBase.all!\nBase.count\nBase.any(::Any, ::Any)\nBase.all(::Any, ::Any)\nBase.foreach\nBase.map\nBase.map!\nBase.mapreduce(::Any, ::Any, ::Any)\nBase.mapfoldl(::Any, ::Any, ::Any)\nBase.mapfoldr(::Any, ::Any, ::Any)\nBase.first\nBase.last\nBase.step\nBase.collect(::Any)\nBase.collect(::Type, ::Any)\nBase.filter\nBase.filter!\nBase.replace(::Any, ::Pair...)\nBase.replace(::Base.Callable, ::Any, ::Any)\nBase.replace(::Base.Callable, ::Any)\nBase.replace!"
},

{
    "location": "base/collections/#Base.getindex",
    "page": "Collections and Data Structures",
    "title": "Base.getindex",
    "category": "function",
    "text": "getindex(collection, key...)\n\nRetrieve the value(s) stored at the given key or index within a collection. The syntax a[i,j,...] is converted by the compiler to getindex(a, i, j, ...).\n\nExamples\n\njulia> A = Dict(\"a\" => 1, \"b\" => 2)\nDict{String,Int64} with 2 entries:\n  \"b\" => 2\n  \"a\" => 1\n\njulia> getindex(A, \"a\")\n1\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.setindex!",
    "page": "Collections and Data Structures",
    "title": "Base.setindex!",
    "category": "function",
    "text": "setindex!(collection, value, key...)\n\nStore the given value at the given key or index within a collection. The syntax a[i,j,...] = x is converted by the compiler to (setindex!(a, x, i, j, ...); x).\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.firstindex",
    "page": "Collections and Data Structures",
    "title": "Base.firstindex",
    "category": "function",
    "text": "firstindex(collection) -> Integer\nfirstindex(collection, d) -> Integer\n\nReturn the first index of collection. If d is given, return the first index of collection along dimension d.\n\nExamples\n\njulia> firstindex([1,2,4])\n1\n\njulia> firstindex(rand(3,4,5), 2)\n1\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.lastindex",
    "page": "Collections and Data Structures",
    "title": "Base.lastindex",
    "category": "function",
    "text": "lastindex(collection) -> Integer\nlastindex(collection, d) -> Integer\n\nReturn the last index of collection. If d is given, return the last index of collection along dimension d.\n\nThe syntaxes A[end] and A[end, end] lower to A[lastindex(A)] and A[lastindex(A, 1), lastindex(A, 2)], respectively.\n\nExamples\n\njulia> lastindex([1,2,4])\n3\n\njulia> lastindex(rand(3,4,5), 2)\n4\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Indexable-Collections-1",
    "page": "Collections and Data Structures",
    "title": "Indexable Collections",
    "category": "section",
    "text": "Base.getindex\nBase.setindex!\nBase.firstindex\nBase.lastindexFully implemented by:Array\nBitArray\nAbstractArray\nSubArrayPartially implemented by:AbstractRange\nUnitRange\nTuple\nAbstractString\nDict\nIdDict\nWeakKeyDict\nNamedTuple"
},

{
    "location": "base/collections/#Base.Dict",
    "page": "Collections and Data Structures",
    "title": "Base.Dict",
    "category": "type",
    "text": "Dict([itr])\n\nDict{K,V}() constructs a hash table with keys of type K and values of type V. Keys are compared with isequal and hashed with hash.\n\nGiven a single iterable argument, constructs a Dict whose key-value pairs are taken from 2-tuples (key,value) generated by the argument.\n\nExamples\n\njulia> Dict([(\"A\", 1), (\"B\", 2)])\nDict{String,Int64} with 2 entries:\n  \"B\" => 2\n  \"A\" => 1\n\nAlternatively, a sequence of pair arguments may be passed.\n\njulia> Dict(\"A\"=>1, \"B\"=>2)\nDict{String,Int64} with 2 entries:\n  \"B\" => 2\n  \"A\" => 1\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.IdDict",
    "page": "Collections and Data Structures",
    "title": "Base.IdDict",
    "category": "type",
    "text": "IdDict([itr])\n\nIdDict{K,V}() constructs a hash table using object-id as hash and === as equality with keys of type K and values of type V.\n\nSee Dict for further help.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.WeakKeyDict",
    "page": "Collections and Data Structures",
    "title": "Base.WeakKeyDict",
    "category": "type",
    "text": "WeakKeyDict([itr])\n\nWeakKeyDict() constructs a hash table where the keys are weak references to objects, and thus may be garbage collected even when referenced in a hash table.\n\nSee Dict for further help.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.ImmutableDict",
    "page": "Collections and Data Structures",
    "title": "Base.ImmutableDict",
    "category": "type",
    "text": "ImmutableDict\n\nImmutableDict is a Dictionary implemented as an immutable linked list, which is optimal for small dictionaries that are constructed over many individual insertions Note that it is not possible to remove a value, although it can be partially overridden and hidden by inserting a new value with the same key\n\nImmutableDict(KV::Pair)\n\nCreate a new entry in the Immutable Dictionary for the key => value pair\n\nuse (key => value) in dict to see if this particular combination is in the properties set\nuse get(dict, key, default) to retrieve the most recent value for a particular key\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.haskey",
    "page": "Collections and Data Structures",
    "title": "Base.haskey",
    "category": "function",
    "text": "haskey(collection, key) -> Bool\n\nDetermine whether a collection has a mapping for a given key.\n\nExamples\n\njulia> D = Dict(\'a\'=>2, \'b\'=>3)\nDict{Char,Int64} with 2 entries:\n  \'a\' => 2\n  \'b\' => 3\n\njulia> haskey(D, \'a\')\ntrue\n\njulia> haskey(D, \'c\')\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.get-Tuple{Any,Any,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.get",
    "category": "method",
    "text": "get(collection, key, default)\n\nReturn the value stored for the given key, or the given default value if no mapping for the key is present.\n\nExamples\n\njulia> d = Dict(\"a\"=>1, \"b\"=>2);\n\njulia> get(d, \"a\", 3)\n1\n\njulia> get(d, \"c\", 3)\n3\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.get",
    "page": "Collections and Data Structures",
    "title": "Base.get",
    "category": "function",
    "text": "get(collection, key, default)\n\nReturn the value stored for the given key, or the given default value if no mapping for the key is present.\n\nExamples\n\njulia> d = Dict(\"a\"=>1, \"b\"=>2);\n\njulia> get(d, \"a\", 3)\n1\n\njulia> get(d, \"c\", 3)\n3\n\n\n\n\n\nget(f::Function, collection, key)\n\nReturn the value stored for the given key, or if no mapping for the key is present, return f().  Use get! to also store the default value in the dictionary.\n\nThis is intended to be called using do block syntax\n\nget(dict, key) do\n    # default value calculated here\n    time()\nend\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.get!-Tuple{Any,Any,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.get!",
    "category": "method",
    "text": "get!(collection, key, default)\n\nReturn the value stored for the given key, or if no mapping for the key is present, store key => default, and return default.\n\nExamples\n\njulia> d = Dict(\"a\"=>1, \"b\"=>2, \"c\"=>3);\n\njulia> get!(d, \"a\", 5)\n1\n\njulia> get!(d, \"d\", 4)\n4\n\njulia> d\nDict{String,Int64} with 4 entries:\n  \"c\" => 3\n  \"b\" => 2\n  \"a\" => 1\n  \"d\" => 4\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.get!-Tuple{Function,Any,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.get!",
    "category": "method",
    "text": "get!(f::Function, collection, key)\n\nReturn the value stored for the given key, or if no mapping for the key is present, store key => f(), and return f().\n\nThis is intended to be called using do block syntax:\n\nget!(dict, key) do\n    # default value calculated here\n    time()\nend\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.getkey",
    "page": "Collections and Data Structures",
    "title": "Base.getkey",
    "category": "function",
    "text": "getkey(collection, key, default)\n\nReturn the key matching argument key if one exists in collection, otherwise return default.\n\nExamples\n\njulia> D = Dict(\'a\'=>2, \'b\'=>3)\nDict{Char,Int64} with 2 entries:\n  \'a\' => 2\n  \'b\' => 3\n\njulia> getkey(D, \'a\', 1)\n\'a\': ASCII/Unicode U+0061 (category Ll: Letter, lowercase)\n\njulia> getkey(D, \'d\', \'a\')\n\'a\': ASCII/Unicode U+0061 (category Ll: Letter, lowercase)\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.delete!",
    "page": "Collections and Data Structures",
    "title": "Base.delete!",
    "category": "function",
    "text": "delete!(collection, key)\n\nDelete the mapping for the given key in a collection, and return the collection.\n\nExamples\n\njulia> d = Dict(\"a\"=>1, \"b\"=>2)\nDict{String,Int64} with 2 entries:\n  \"b\" => 2\n  \"a\" => 1\n\njulia> delete!(d, \"b\")\nDict{String,Int64} with 1 entry:\n  \"a\" => 1\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.pop!-Tuple{Any,Any,Any}",
    "page": "Collections and Data Structures",
    "title": "Base.pop!",
    "category": "method",
    "text": "pop!(collection, key[, default])\n\nDelete and return the mapping for key if it exists in collection, otherwise return default, or throw an error if default is not specified.\n\nExamples\n\njulia> d = Dict(\"a\"=>1, \"b\"=>2, \"c\"=>3);\n\njulia> pop!(d, \"a\")\n1\n\njulia> pop!(d, \"d\")\nERROR: KeyError: key \"d\" not found\nStacktrace:\n[...]\n\njulia> pop!(d, \"e\", 4)\n4\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.keys",
    "page": "Collections and Data Structures",
    "title": "Base.keys",
    "category": "function",
    "text": "keys(iterator)\n\nFor an iterator or collection that has keys and values (e.g. arrays and dictionaries), return an iterator over the keys.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.values",
    "page": "Collections and Data Structures",
    "title": "Base.values",
    "category": "function",
    "text": "values(iterator)\n\nFor an iterator or collection that has keys and values, return an iterator over the values. This function simply returns its argument by default, since the elements of a general iterator are normally considered its \"values\".\n\nExamples\n\njulia> d = Dict(\"a\"=>1, \"b\"=>2);\n\njulia> values(d)\nBase.ValueIterator for a Dict{String,Int64} with 2 entries. Values:\n  2\n  1\n\njulia> values([2])\n1-element Array{Int64,1}:\n 2\n\n\n\n\n\nvalues(a::AbstractDict)\n\nReturn an iterator over all values in a collection. collect(values(a)) returns an array of values. Since the values are stored internally in a hash table, the order in which they are returned may vary. But keys(a) and values(a) both iterate a and return the elements in the same order.\n\nExamples\n\njulia> D = Dict(\'a\'=>2, \'b\'=>3)\nDict{Char,Int64} with 2 entries:\n  \'a\' => 2\n  \'b\' => 3\n\njulia> collect(values(D))\n2-element Array{Int64,1}:\n 2\n 3\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.pairs",
    "page": "Collections and Data Structures",
    "title": "Base.pairs",
    "category": "function",
    "text": "pairs(collection)\n\nReturn an iterator over key => value pairs for any collection that maps a set of keys to a set of values. This includes arrays, where the keys are the array indices.\n\n\n\n\n\npairs(IndexLinear(), A)\npairs(IndexCartesian(), A)\npairs(IndexStyle(A), A)\n\nAn iterator that accesses each element of the array A, returning i => x, where i is the index for the element and x = A[i]. Identical to pairs(A), except that the style of index can be selected. Also similar to enumerate(A), except i will be a valid index for A, while enumerate always counts from 1 regardless of the indices of A.\n\nSpecifying IndexLinear() ensures that i will be an integer; specifying IndexCartesian() ensures that i will be a CartesianIndex; specifying IndexStyle(A) chooses whichever has been defined as the native indexing style for array A.\n\nMutation of the bounds of the underlying array will invalidate this iterator.\n\nExamples\n\njulia> A = [\"a\" \"d\"; \"b\" \"e\"; \"c\" \"f\"];\n\njulia> for (index, value) in pairs(IndexStyle(A), A)\n           println(\"$index $value\")\n       end\n1 a\n2 b\n3 c\n4 d\n5 e\n6 f\n\njulia> S = view(A, 1:2, :);\n\njulia> for (index, value) in pairs(IndexStyle(S), S)\n           println(\"$index $value\")\n       end\nCartesianIndex(1, 1) a\nCartesianIndex(2, 1) b\nCartesianIndex(1, 2) d\nCartesianIndex(2, 2) e\n\nSee also: IndexStyle, axes.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.merge",
    "page": "Collections and Data Structures",
    "title": "Base.merge",
    "category": "function",
    "text": "merge(d::AbstractDict, others::AbstractDict...)\n\nConstruct a merged collection from the given collections. If necessary, the types of the resulting collection will be promoted to accommodate the types of the merged collections. If the same key is present in another collection, the value for that key will be the value it has in the last collection listed.\n\nExamples\n\njulia> a = Dict(\"foo\" => 0.0, \"bar\" => 42.0)\nDict{String,Float64} with 2 entries:\n  \"bar\" => 42.0\n  \"foo\" => 0.0\n\njulia> b = Dict(\"baz\" => 17, \"bar\" => 4711)\nDict{String,Int64} with 2 entries:\n  \"bar\" => 4711\n  \"baz\" => 17\n\njulia> merge(a, b)\nDict{String,Float64} with 3 entries:\n  \"bar\" => 4711.0\n  \"baz\" => 17.0\n  \"foo\" => 0.0\n\njulia> merge(b, a)\nDict{String,Float64} with 3 entries:\n  \"bar\" => 42.0\n  \"baz\" => 17.0\n  \"foo\" => 0.0\n\n\n\n\n\nmerge(combine, d::AbstractDict, others::AbstractDict...)\n\nConstruct a merged collection from the given collections. If necessary, the types of the resulting collection will be promoted to accommodate the types of the merged collections. Values with the same key will be combined using the combiner function.\n\nExamples\n\njulia> a = Dict(\"foo\" => 0.0, \"bar\" => 42.0)\nDict{String,Float64} with 2 entries:\n  \"bar\" => 42.0\n  \"foo\" => 0.0\n\njulia> b = Dict(\"baz\" => 17, \"bar\" => 4711)\nDict{String,Int64} with 2 entries:\n  \"bar\" => 4711\n  \"baz\" => 17\n\njulia> merge(+, a, b)\nDict{String,Float64} with 3 entries:\n  \"bar\" => 4753.0\n  \"baz\" => 17.0\n  \"foo\" => 0.0\n\n\n\n\n\nmerge(a::NamedTuple, b::NamedTuple)\n\nConstruct a new named tuple by merging two existing ones. The order of fields in a is preserved, but values are taken from matching fields in b. Fields present only in b are appended at the end.\n\njulia> merge((a=1, b=2, c=3), (b=4, d=5))\n(a = 1, b = 4, c = 3, d = 5)\n\n\n\n\n\nmerge(a::NamedTuple, iterable)\n\nInterpret an iterable of key-value pairs as a named tuple, and perform a merge.\n\njulia> merge((a=1, b=2, c=3), [:b=>4, :d=>5])\n(a = 1, b = 4, c = 3, d = 5)\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.merge!-Tuple{AbstractDict,Vararg{AbstractDict,N} where N}",
    "page": "Collections and Data Structures",
    "title": "Base.merge!",
    "category": "method",
    "text": "merge!(d::AbstractDict, others::AbstractDict...)\n\nUpdate collection with pairs from the other collections. See also merge.\n\nExamples\n\njulia> d1 = Dict(1 => 2, 3 => 4);\n\njulia> d2 = Dict(1 => 4, 4 => 5);\n\njulia> merge!(d1, d2);\n\njulia> d1\nDict{Int64,Int64} with 3 entries:\n  4 => 5\n  3 => 4\n  1 => 4\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.merge!-Tuple{Function,AbstractDict,Vararg{AbstractDict,N} where N}",
    "page": "Collections and Data Structures",
    "title": "Base.merge!",
    "category": "method",
    "text": "merge!(combine, d::AbstractDict, others::AbstractDict...)\n\nUpdate collection with pairs from the other collections. Values with the same key will be combined using the combiner function.\n\nExamples\n\njulia> d1 = Dict(1 => 2, 3 => 4);\n\njulia> d2 = Dict(1 => 4, 4 => 5);\n\njulia> merge!(+, d1, d2);\n\njulia> d1\nDict{Int64,Int64} with 3 entries:\n  4 => 5\n  3 => 4\n  1 => 6\n\njulia> merge!(-, d1, d1);\n\njulia> d1\nDict{Int64,Int64} with 3 entries:\n  4 => 0\n  3 => 0\n  1 => 0\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.sizehint!",
    "page": "Collections and Data Structures",
    "title": "Base.sizehint!",
    "category": "function",
    "text": "sizehint!(s, n)\n\nSuggest that collection s reserve capacity for at least n elements. This can improve performance.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.keytype",
    "page": "Collections and Data Structures",
    "title": "Base.keytype",
    "category": "function",
    "text": "keytype(type)\n\nGet the key type of an dictionary type. Behaves similarly to eltype.\n\nExamples\n\njulia> keytype(Dict(Int32(1) => \"foo\"))\nInt32\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.valtype",
    "page": "Collections and Data Structures",
    "title": "Base.valtype",
    "category": "function",
    "text": "valtype(type)\n\nGet the value type of an dictionary type. Behaves similarly to eltype.\n\nExamples\n\njulia> valtype(Dict(Int32(1) => \"foo\"))\nString\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Dictionaries-1",
    "page": "Collections and Data Structures",
    "title": "Dictionaries",
    "category": "section",
    "text": "Dict is the standard dictionary. Its implementation uses hash as the hashing function for the key, and isequal to determine equality. Define these two functions for custom types to override how they are stored in a hash table.IdDict is a special hash table where the keys are always object identities.WeakKeyDict is a hash table implementation where the keys are weak references to objects, and thus may be garbage collected even when referenced in a hash table.Dicts can be created by passing pair objects constructed with => to a Dict constructor: Dict(\"A\"=>1, \"B\"=>2). This call will attempt to infer type information from the keys and values (i.e. this example creates a Dict{String, Int64}). To explicitly specify types use the syntax Dict{KeyType,ValueType}(...). For example, Dict{String,Int32}(\"A\"=>1, \"B\"=>2).Dictionaries may also be created with generators. For example, Dict(i => f(i) for i = 1:10).Given a dictionary D, the syntax D[x] returns the value of key x (if it exists) or throws an error, and D[x] = y stores the key-value pair x => y in D (replacing any existing value for the key x).  Multiple arguments to D[...] are converted to tuples; for example, the syntax D[x,y]  is equivalent to D[(x,y)], i.e. it refers to the value keyed by the tuple (x,y).Base.Dict\nBase.IdDict\nBase.WeakKeyDict\nBase.ImmutableDict\nBase.haskey\nBase.get(::Any, ::Any, ::Any)\nBase.get\nBase.get!(::Any, ::Any, ::Any)\nBase.get!(::Function, ::Any, ::Any)\nBase.getkey\nBase.delete!\nBase.pop!(::Any, ::Any, ::Any)\nBase.keys\nBase.values\nBase.pairs\nBase.merge\nBase.merge!(::AbstractDict, ::AbstractDict...)\nBase.merge!(::Function, ::AbstractDict, ::AbstractDict...)\nBase.sizehint!\nBase.keytype\nBase.valtypeFully implemented by:IdDict\nDict\nWeakKeyDictPartially implemented by:BitSet\nSet\nEnvDict\nArray\nBitArray\nImmutableDict\nIterators.Pairs"
},

{
    "location": "base/collections/#Base.Set",
    "page": "Collections and Data Structures",
    "title": "Base.Set",
    "category": "type",
    "text": "Set([itr])\n\nConstruct a Set of the values generated by the given iterable object, or an empty set. Should be used instead of BitSet for sparse integer sets, or for sets of arbitrary objects.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.BitSet",
    "page": "Collections and Data Structures",
    "title": "Base.BitSet",
    "category": "type",
    "text": "BitSet([itr])\n\nConstruct a sorted set of Ints generated by the given iterable object, or an empty set. Implemented as a bit string, and therefore designed for dense integer sets. If the set will be sparse (for example, holding a few very large integers), use Set instead.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.union",
    "page": "Collections and Data Structures",
    "title": "Base.union",
    "category": "function",
    "text": "union(s, itrs...)\n∪(s, itrs...)\n\nConstruct the union of sets. Maintain order with arrays.\n\nExamples\n\njulia> union([1, 2], [3, 4])\n4-element Array{Int64,1}:\n 1\n 2\n 3\n 4\n\njulia> union([1, 2], [2, 4])\n3-element Array{Int64,1}:\n 1\n 2\n 4\n\njulia> union([4, 2], 1:2)\n3-element Array{Int64,1}:\n 4\n 2\n 1\n\njulia> union(Set([1, 2]), 2:3)\nSet([2, 3, 1])\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.union!",
    "page": "Collections and Data Structures",
    "title": "Base.union!",
    "category": "function",
    "text": "union!(s::Union{AbstractSet,AbstractVector}, itrs...)\n\nConstruct the union of passed in sets and overwrite s with the result. Maintain order with arrays.\n\nExamples\n\njulia> a = Set([1, 3, 4, 5]);\n\njulia> union!(a, 1:2:8);\n\njulia> a\nSet([7, 4, 3, 5, 1])\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.intersect",
    "page": "Collections and Data Structures",
    "title": "Base.intersect",
    "category": "function",
    "text": "intersect(s, itrs...)\n∩(s, itrs...)\n\nConstruct the intersection of sets. Maintain order with arrays.\n\nExamples\n\njulia> intersect([1, 2, 3], [3, 4, 5])\n1-element Array{Int64,1}:\n 3\n\njulia> intersect([1, 4, 4, 5, 6], [4, 6, 6, 7, 8])\n2-element Array{Int64,1}:\n 4\n 6\n\njulia> intersect(Set([1, 2]), BitSet([2, 3]))\nSet([2])\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.setdiff",
    "page": "Collections and Data Structures",
    "title": "Base.setdiff",
    "category": "function",
    "text": "setdiff(s, itrs...)\n\nConstruct the set of elements in s but not in any of the iterables in itrs. Maintain order with arrays.\n\nExamples\n\njulia> setdiff([1,2,3], [3,4,5])\n2-element Array{Int64,1}:\n 1\n 2\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.setdiff!",
    "page": "Collections and Data Structures",
    "title": "Base.setdiff!",
    "category": "function",
    "text": "setdiff!(s, itrs...)\n\nRemove from set s (in-place) each element of each iterable from itrs. Maintain order with arrays.\n\nExamples\n\njulia> a = Set([1, 3, 4, 5]);\n\njulia> setdiff!(a, 1:2:6);\n\njulia> a\nSet([4])\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.symdiff",
    "page": "Collections and Data Structures",
    "title": "Base.symdiff",
    "category": "function",
    "text": "symdiff(s, itrs...)\n\nConstruct the symmetric difference of elements in the passed in sets. When s is not an AbstractSet, the order is maintained. Note that in this case the multiplicity of elements matters.\n\nExamples\n\njulia> symdiff([1,2,3], [3,4,5], [4,5,6])\n3-element Array{Int64,1}:\n 1\n 2\n 6\n\njulia> symdiff([1,2,1], [2, 1, 2])\n2-element Array{Int64,1}:\n 1\n 2\n\njulia> symdiff(unique([1,2,1]), unique([2, 1, 2]))\n0-element Array{Int64,1}\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.symdiff!",
    "page": "Collections and Data Structures",
    "title": "Base.symdiff!",
    "category": "function",
    "text": "symdiff!(s::Union{AbstractSet,AbstractVector}, itrs...)\n\nConstruct the symmetric difference of the passed in sets, and overwrite s with the result. When s is an array, the order is maintained. Note that in this case the multiplicity of elements matters.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.intersect!",
    "page": "Collections and Data Structures",
    "title": "Base.intersect!",
    "category": "function",
    "text": "intersect!(s::Union{AbstractSet,AbstractVector}, itrs...)\n\nIntersect all passed in sets and overwrite s with the result. Maintain order with arrays.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.issubset",
    "page": "Collections and Data Structures",
    "title": "Base.issubset",
    "category": "function",
    "text": "issubset(a, b)\n⊆(a,b)  -> Bool\n⊇(b, a) -> Bool\n\nDetermine whether every element of a is also in b, using in.\n\nExamples\n\njulia> issubset([1, 2], [1, 2, 3])\ntrue\n\njulia> [1, 2, 3] ⊆ [1, 2]\nfalse\n\njulia> [1, 2, 3] ⊇ [1, 2]\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.:⊈",
    "page": "Collections and Data Structures",
    "title": "Base.:⊈",
    "category": "function",
    "text": "⊈(a, b)\n⊉(b, a)\n\nNegation of ⊆ and ⊇, i.e. checks that a is not a subset of b.\n\nExamples\n\njulia> (1, 2) ⊈ (2, 3)\ntrue\n\njulia> (1, 2) ⊈ (1, 2, 3)\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.:⊊",
    "page": "Collections and Data Structures",
    "title": "Base.:⊊",
    "category": "function",
    "text": "⊊(a, b)\n⊋(b, a)\n\nDetermines if a is a subset of, but not equal to, b.\n\nExamples\n\njulia> (1, 2) ⊊ (1, 2, 3)\ntrue\n\njulia> (1, 2) ⊊ (1, 2)\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.issetequal",
    "page": "Collections and Data Structures",
    "title": "Base.issetequal",
    "category": "function",
    "text": "issetequal(a, b)\n\nDetermine whether a and b have the same elements. Equivalent to a ⊆ b && b ⊆ a.\n\nExamples\n\njulia> issetequal([1, 2], [1, 2, 3])\nfalse\n\njulia> issetequal([1, 2], [2, 1])\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Set-Like-Collections-1",
    "page": "Collections and Data Structures",
    "title": "Set-Like Collections",
    "category": "section",
    "text": "Base.Set\nBase.BitSet\nBase.union\nBase.union!\nBase.intersect\nBase.setdiff\nBase.setdiff!\nBase.symdiff\nBase.symdiff!\nBase.intersect!\nBase.issubset\nBase.:⊈\nBase.:⊊\nBase.issetequalFully implemented by:BitSet\nSetPartially implemented by:Array"
},

{
    "location": "base/collections/#Base.push!",
    "page": "Collections and Data Structures",
    "title": "Base.push!",
    "category": "function",
    "text": "push!(collection, items...) -> collection\n\nInsert one or more items at the end of collection.\n\nExamples\n\njulia> push!([1, 2, 3], 4, 5, 6)\n6-element Array{Int64,1}:\n 1\n 2\n 3\n 4\n 5\n 6\n\nUse append! to add all the elements of another collection to collection. The result of the preceding example is equivalent to append!([1, 2, 3], [4, 5, 6]).\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.pop!",
    "page": "Collections and Data Structures",
    "title": "Base.pop!",
    "category": "function",
    "text": "pop!(collection) -> item\n\nRemove an item in collection and return it. If collection is an ordered container, the last item is returned.\n\nExamples\n\njulia> A=[1, 2, 3]\n3-element Array{Int64,1}:\n 1\n 2\n 3\n\njulia> pop!(A)\n3\n\njulia> A\n2-element Array{Int64,1}:\n 1\n 2\n\njulia> S = Set([1, 2])\nSet([2, 1])\n\njulia> pop!(S)\n2\n\njulia> S\nSet([1])\n\njulia> pop!(Dict(1=>2))\n1 => 2\n\n\n\n\n\npop!(collection, key[, default])\n\nDelete and return the mapping for key if it exists in collection, otherwise return default, or throw an error if default is not specified.\n\nExamples\n\njulia> d = Dict(\"a\"=>1, \"b\"=>2, \"c\"=>3);\n\njulia> pop!(d, \"a\")\n1\n\njulia> pop!(d, \"d\")\nERROR: KeyError: key \"d\" not found\nStacktrace:\n[...]\n\njulia> pop!(d, \"e\", 4)\n4\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.pushfirst!",
    "page": "Collections and Data Structures",
    "title": "Base.pushfirst!",
    "category": "function",
    "text": "pushfirst!(collection, items...) -> collection\n\nInsert one or more items at the beginning of collection.\n\nExamples\n\njulia> pushfirst!([1, 2, 3, 4], 5, 6)\n6-element Array{Int64,1}:\n 5\n 6\n 1\n 2\n 3\n 4\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.popfirst!",
    "page": "Collections and Data Structures",
    "title": "Base.popfirst!",
    "category": "function",
    "text": "popfirst!(collection) -> item\n\nRemove the first item from collection.\n\nExamples\n\njulia> A = [1, 2, 3, 4, 5, 6]\n6-element Array{Int64,1}:\n 1\n 2\n 3\n 4\n 5\n 6\n\njulia> popfirst!(A)\n1\n\njulia> A\n5-element Array{Int64,1}:\n 2\n 3\n 4\n 5\n 6\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.insert!",
    "page": "Collections and Data Structures",
    "title": "Base.insert!",
    "category": "function",
    "text": "insert!(a::Vector, index::Integer, item)\n\nInsert an item into a at the given index. index is the index of item in the resulting a.\n\nExamples\n\njulia> insert!([6, 5, 4, 2, 1], 4, 3)\n6-element Array{Int64,1}:\n 6\n 5\n 4\n 3\n 2\n 1\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.deleteat!",
    "page": "Collections and Data Structures",
    "title": "Base.deleteat!",
    "category": "function",
    "text": "deleteat!(a::Vector, i::Integer)\n\nRemove the item at the given i and return the modified a. Subsequent items are shifted to fill the resulting gap.\n\nExamples\n\njulia> deleteat!([6, 5, 4, 3, 2, 1], 2)\n5-element Array{Int64,1}:\n 6\n 4\n 3\n 2\n 1\n\n\n\n\n\ndeleteat!(a::Vector, inds)\n\nRemove the items at the indices given by inds, and return the modified a. Subsequent items are shifted to fill the resulting gap.\n\ninds can be either an iterator or a collection of sorted and unique integer indices, or a boolean vector of the same length as a with true indicating entries to delete.\n\nExamples\n\njulia> deleteat!([6, 5, 4, 3, 2, 1], 1:2:5)\n3-element Array{Int64,1}:\n 5\n 3\n 1\n\njulia> deleteat!([6, 5, 4, 3, 2, 1], [true, false, true, false, true, false])\n3-element Array{Int64,1}:\n 5\n 3\n 1\n\njulia> deleteat!([6, 5, 4, 3, 2, 1], (2, 2))\nERROR: ArgumentError: indices must be unique and sorted\nStacktrace:\n[...]\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.splice!",
    "page": "Collections and Data Structures",
    "title": "Base.splice!",
    "category": "function",
    "text": "splice!(a::Vector, index::Integer, [replacement]) -> item\n\nRemove the item at the given index, and return the removed item. Subsequent items are shifted left to fill the resulting gap. If specified, replacement values from an ordered collection will be spliced in place of the removed item.\n\nExamples\n\njulia> A = [6, 5, 4, 3, 2, 1]; splice!(A, 5)\n2\n\njulia> A\n5-element Array{Int64,1}:\n 6\n 5\n 4\n 3\n 1\n\njulia> splice!(A, 5, -1)\n1\n\njulia> A\n5-element Array{Int64,1}:\n  6\n  5\n  4\n  3\n -1\n\njulia> splice!(A, 1, [-1, -2, -3])\n6\n\njulia> A\n7-element Array{Int64,1}:\n -1\n -2\n -3\n  5\n  4\n  3\n -1\n\nTo insert replacement before an index n without removing any items, use splice!(collection, n:n-1, replacement).\n\n\n\n\n\nsplice!(a::Vector, range, [replacement]) -> items\n\nRemove items in the specified index range, and return a collection containing the removed items. Subsequent items are shifted left to fill the resulting gap. If specified, replacement values from an ordered collection will be spliced in place of the removed items.\n\nTo insert replacement before an index n without removing any items, use splice!(collection, n:n-1, replacement).\n\nExamples\n\njulia> splice!(A, 4:3, 2)\n0-element Array{Int64,1}\n\njulia> A\n8-element Array{Int64,1}:\n -1\n -2\n -3\n  2\n  5\n  4\n  3\n -1\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.resize!",
    "page": "Collections and Data Structures",
    "title": "Base.resize!",
    "category": "function",
    "text": "resize!(a::Vector, n::Integer) -> Vector\n\nResize a to contain n elements. If n is smaller than the current collection length, the first n elements will be retained. If n is larger, the new elements are not guaranteed to be initialized.\n\nExamples\n\njulia> resize!([6, 5, 4, 3, 2, 1], 3)\n3-element Array{Int64,1}:\n 6\n 5\n 4\n\njulia> a = resize!([6, 5, 4, 3, 2, 1], 8);\n\njulia> length(a)\n8\n\njulia> a[1:6]\n6-element Array{Int64,1}:\n 6\n 5\n 4\n 3\n 2\n 1\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.append!",
    "page": "Collections and Data Structures",
    "title": "Base.append!",
    "category": "function",
    "text": "append!(collection, collection2) -> collection.\n\nAdd the elements of collection2 to the end of collection.\n\nExamples\n\njulia> append!([1],[2,3])\n3-element Array{Int64,1}:\n 1\n 2\n 3\n\njulia> append!([1, 2, 3], [4, 5, 6])\n6-element Array{Int64,1}:\n 1\n 2\n 3\n 4\n 5\n 6\n\nUse push! to add individual items to collection which are not already themselves in another collection. The result is of the preceding example is equivalent to push!([1, 2, 3], 4, 5, 6).\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.prepend!",
    "page": "Collections and Data Structures",
    "title": "Base.prepend!",
    "category": "function",
    "text": "prepend!(a::Vector, items) -> collection\n\nInsert the elements of items to the beginning of a.\n\nExamples\n\njulia> prepend!([3],[1,2])\n3-element Array{Int64,1}:\n 1\n 2\n 3\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Dequeues-1",
    "page": "Collections and Data Structures",
    "title": "Dequeues",
    "category": "section",
    "text": "Base.push!\nBase.pop!\nBase.pushfirst!\nBase.popfirst!\nBase.insert!\nBase.deleteat!\nBase.splice!\nBase.resize!\nBase.append!\nBase.prepend!Fully implemented by:Vector (a.k.a. 1-dimensional Array)\nBitVector (a.k.a. 1-dimensional BitArray)"
},

{
    "location": "base/collections/#Base.Pair",
    "page": "Collections and Data Structures",
    "title": "Base.Pair",
    "category": "type",
    "text": "Pair(x, y)\nx => y\n\nConstruct a Pair object with type Pair{typeof(x), typeof(y)}. The elements are stored in the fields first and second. They can also be accessed via iteration.\n\nSee also: Dict\n\nExamples\n\njulia> p = \"foo\" => 7\n\"foo\" => 7\n\njulia> typeof(p)\nPair{String,Int64}\n\njulia> p.first\n\"foo\"\n\njulia> for x in p\n           println(x)\n       end\nfoo\n7\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Base.Iterators.Pairs",
    "page": "Collections and Data Structures",
    "title": "Base.Iterators.Pairs",
    "category": "type",
    "text": "Iterators.Pairs(values, keys) <: AbstractDict{eltype(keys), eltype(values)}\n\nTransforms an indexable container into an Dictionary-view of the same data. Modifying the key-space of the underlying data may invalidate this object.\n\n\n\n\n\n"
},

{
    "location": "base/collections/#Utility-Collections-1",
    "page": "Collections and Data Structures",
    "title": "Utility Collections",
    "category": "section",
    "text": "Base.Pair\nIterators.Pairs"
},

{
    "location": "base/math/#",
    "page": "Mathematics",
    "title": "Mathematics",
    "category": "page",
    "text": ""
},

{
    "location": "base/math/#Mathematics-1",
    "page": "Mathematics",
    "title": "Mathematics",
    "category": "section",
    "text": ""
},

{
    "location": "base/math/#Base.:--Tuple{Any}",
    "page": "Mathematics",
    "title": "Base.:-",
    "category": "method",
    "text": "-(x)\n\nUnary minus operator.\n\nExamples\n\njulia> -1\n-1\n\njulia> -(2)\n-2\n\njulia> -[1 2; 3 4]\n2×2 Array{Int64,2}:\n -1  -2\n -3  -4\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:+",
    "page": "Mathematics",
    "title": "Base.:+",
    "category": "function",
    "text": "+(x, y...)\n\nAddition operator. x+y+z+... calls this function with all arguments, i.e. +(x, y, z, ...).\n\nExamples\n\njulia> 1 + 20 + 4\n25\n\njulia> +(1, 20, 4)\n25\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:--Tuple{Any,Any}",
    "page": "Mathematics",
    "title": "Base.:-",
    "category": "method",
    "text": "-(x, y)\n\nSubtraction operator.\n\nExamples\n\njulia> 2 - 3\n-1\n\njulia> -(2, 4.5)\n-2.5\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:*-Tuple{Any,Vararg{Any,N} where N}",
    "page": "Mathematics",
    "title": "Base.:*",
    "category": "method",
    "text": "*(x, y...)\n\nMultiplication operator. x*y*z*... calls this function with all arguments, i.e. *(x, y, z, ...).\n\nExamples\n\njulia> 2 * 7 * 8\n112\n\njulia> *(2, 7, 8)\n112\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:/",
    "page": "Mathematics",
    "title": "Base.:/",
    "category": "function",
    "text": "/(x, y)\n\nRight division operator: multiplication of x by the inverse of y on the right. Gives floating-point results for integer arguments.\n\nExamples\n\njulia> 1/2\n0.5\n\njulia> 4/2\n2.0\n\njulia> 4.5/2\n2.25\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:\\-Tuple{Any,Any}",
    "page": "Mathematics",
    "title": "Base.:\\",
    "category": "method",
    "text": "\\(x, y)\n\nLeft division operator: multiplication of y by the inverse of x on the left. Gives floating-point results for integer arguments.\n\nExamples\n\njulia> 3 \\ 6\n2.0\n\njulia> inv(3) * 6\n2.0\n\njulia> A = [1 2; 3 4]; x = [5, 6];\n\njulia> A \\ x\n2-element Array{Float64,1}:\n -4.0\n  4.5\n\njulia> inv(A) * x\n2-element Array{Float64,1}:\n -4.0\n  4.5\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:^-Tuple{Number,Number}",
    "page": "Mathematics",
    "title": "Base.:^",
    "category": "method",
    "text": "^(x, y)\n\nExponentiation operator. If x is a matrix, computes matrix exponentiation.\n\nIf y is an Int literal (e.g. 2 in x^2 or -3 in x^-3), the Julia code x^y is transformed by the compiler to Base.literal_pow(^, x, Val(y)), to enable compile-time specialization on the value of the exponent. (As a default fallback we have Base.literal_pow(^, x, Val(y)) = ^(x,y), where usually ^ == Base.^ unless ^ has been defined in the calling namespace.)\n\njulia> 3^5\n243\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> A^3\n2×2 Array{Int64,2}:\n 37   54\n 81  118\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.fma",
    "page": "Mathematics",
    "title": "Base.fma",
    "category": "function",
    "text": "fma(x, y, z)\n\nComputes x*y+z without rounding the intermediate result x*y. On some systems this is significantly more expensive than x*y+z. fma is used to improve accuracy in certain algorithms. See muladd.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.muladd",
    "page": "Mathematics",
    "title": "Base.muladd",
    "category": "function",
    "text": "muladd(x, y, z)\n\nCombined multiply-add: computes x*y+z, but allowing the add and multiply to be merged with each other or with surrounding operations for performance. For example, this may be implemented as an fma if the hardware supports it efficiently. The result can be different on different machines and can also be different on the same machine due to constant propagation or other optimizations. See fma.\n\nExamples\n\njulia> muladd(3, 2, 1)\n7\n\njulia> 3 * 2 + 1\n7\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.inv-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.inv",
    "category": "method",
    "text": "inv(x)\n\nReturn the multiplicative inverse of x, such that x*inv(x) or inv(x)*x yields one(x) (the multiplicative identity) up to roundoff errors.\n\nIf x is a number, this is essentially the same as one(x)/x, but for some types inv(x) may be slightly more efficient.\n\nExamples\n\njulia> inv(2)\n0.5\n\njulia> inv(1 + 2im)\n0.2 - 0.4im\n\njulia> inv(1 + 2im) * (1 + 2im)\n1.0 + 0.0im\n\njulia> inv(2//3)\n3//2\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.div",
    "page": "Mathematics",
    "title": "Base.div",
    "category": "function",
    "text": "div(x, y)\n÷(x, y)\n\nThe quotient from Euclidean division. Computes x/y, truncated to an integer.\n\nExamples\n\njulia> 9 ÷ 4\n2\n\njulia> -5 ÷ 3\n-1\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.fld",
    "page": "Mathematics",
    "title": "Base.fld",
    "category": "function",
    "text": "fld(x, y)\n\nLargest integer less than or equal to x/y.\n\nExamples\n\njulia> fld(7.3,5.5)\n1.0\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.cld",
    "page": "Mathematics",
    "title": "Base.cld",
    "category": "function",
    "text": "cld(x, y)\n\nSmallest integer larger than or equal to x/y.\n\nExamples\n\njulia> cld(5.5,2.2)\n3.0\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.mod",
    "page": "Mathematics",
    "title": "Base.mod",
    "category": "function",
    "text": "mod(x, y)\nrem(x, y, RoundDown)\n\nThe reduction of x modulo y, or equivalently, the remainder of x after floored division by y, i.e.\n\nx - y*fld(x,y)\n\nif computed without intermediate rounding.\n\nThe result will have the same sign as y, and magnitude less than abs(y) (with some exceptions, see note below).\n\nnote: Note\nWhen used with floating point values, the exact result may not be representable by the type, and so rounding error may occur. In particular, if the exact result is very close to y, then it may be rounded to y.\n\njulia> mod(8, 3)\n2\n\njulia> mod(9, 3)\n0\n\njulia> mod(8.9, 3)\n2.9000000000000004\n\njulia> mod(eps(), 3)\n2.220446049250313e-16\n\njulia> mod(-eps(), 3)\n3.0\n\n\n\n\n\nrem(x::Integer, T::Type{<:Integer}) -> T\nmod(x::Integer, T::Type{<:Integer}) -> T\n%(x::Integer, T::Type{<:Integer}) -> T\n\nFind y::T such that x ≡ y (mod n), where n is the number of integers representable in T, and y is an integer in [typemin(T),typemax(T)]. If T can represent any integer (e.g. T == BigInt), then this operation corresponds to a conversion to T.\n\nExamples\n\njulia> 129 % Int8\n-127\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.rem",
    "page": "Mathematics",
    "title": "Base.rem",
    "category": "function",
    "text": "rem(x, y)\n%(x, y)\n\nRemainder from Euclidean division, returning a value of the same sign as x, and smaller in magnitude than y. This value is always exact.\n\nExamples\n\njulia> x = 15; y = 4;\n\njulia> x % y\n3\n\njulia> x == div(x, y) * y + rem(x, y)\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.rem2pi",
    "page": "Mathematics",
    "title": "Base.Math.rem2pi",
    "category": "function",
    "text": "rem2pi(x, r::RoundingMode)\n\nCompute the remainder of x after integer division by 2π, with the quotient rounded according to the rounding mode r. In other words, the quantity\n\nx - 2π*round(x/(2π),r)\n\nwithout any intermediate rounding. This internally uses a high precision approximation of 2π, and so will give a more accurate result than rem(x,2π,r)\n\nif r == RoundNearest, then the result is in the interval -π π. This will generally be the most accurate result.\nif r == RoundToZero, then the result is in the interval 0 2π if x is positive,. or -2π 0 otherwise.\nif r == RoundDown, then the result is in the interval 0 2π.\nif r == RoundUp, then the result is in the interval -2π 0.\n\nExamples\n\njulia> rem2pi(7pi/4, RoundNearest)\n-0.7853981633974485\n\njulia> rem2pi(7pi/4, RoundDown)\n5.497787143782138\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.mod2pi",
    "page": "Mathematics",
    "title": "Base.Math.mod2pi",
    "category": "function",
    "text": "mod2pi(x)\n\nModulus after division by 2π, returning in the range 02π).\n\nThis function computes a floating point representation of the modulus after division by numerically exact 2π, and is therefore not exactly the same as mod(x,2π), which would compute the modulus of x relative to division by the floating-point number 2π.\n\nExamples\n\njulia> mod2pi(9*pi/4)\n0.7853981633974481\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.divrem",
    "page": "Mathematics",
    "title": "Base.divrem",
    "category": "function",
    "text": "divrem(x, y)\n\nThe quotient and remainder from Euclidean division. Equivalent to (div(x,y), rem(x,y)) or (x÷y, x%y).\n\nExamples\n\njulia> divrem(3,7)\n(0, 3)\n\njulia> divrem(7,3)\n(2, 1)\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.fldmod",
    "page": "Mathematics",
    "title": "Base.fldmod",
    "category": "function",
    "text": "fldmod(x, y)\n\nThe floored quotient and modulus after division. Equivalent to (fld(x,y), mod(x,y)).\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.fld1",
    "page": "Mathematics",
    "title": "Base.fld1",
    "category": "function",
    "text": "fld1(x, y)\n\nFlooring division, returning a value consistent with mod1(x,y)\n\nSee also: mod1, fldmod1.\n\nExamples\n\njulia> x = 15; y = 4;\n\njulia> fld1(x, y)\n4\n\njulia> x == fld(x, y) * y + mod(x, y)\ntrue\n\njulia> x == (fld1(x, y) - 1) * y + mod1(x, y)\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.mod1",
    "page": "Mathematics",
    "title": "Base.mod1",
    "category": "function",
    "text": "mod1(x, y)\n\nModulus after flooring division, returning a value r such that mod(r, y) == mod(x, y) in the range (0 y for positive y and in the range y0) for negative y.\n\nSee also: fld1, fldmod1.\n\nExamples\n\njulia> mod1(4, 2)\n2\n\njulia> mod1(4, 3)\n1\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.fldmod1",
    "page": "Mathematics",
    "title": "Base.fldmod1",
    "category": "function",
    "text": "fldmod1(x, y)\n\nReturn (fld1(x,y), mod1(x,y)).\n\nSee also: fld1, mod1.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.://",
    "page": "Mathematics",
    "title": "Base.://",
    "category": "function",
    "text": "//(num, den)\n\nDivide two integers or rational numbers, giving a Rational result.\n\nExamples\n\njulia> 3 // 5\n3//5\n\njulia> (3 // 5) // (2 // 1)\n3//10\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.rationalize",
    "page": "Mathematics",
    "title": "Base.rationalize",
    "category": "function",
    "text": "rationalize([T<:Integer=Int,] x; tol::Real=eps(x))\n\nApproximate floating point number x as a Rational number with components of the given integer type. The result will differ from x by no more than tol.\n\nExamples\n\njulia> rationalize(5.6)\n28//5\n\njulia> a = rationalize(BigInt, 10.3)\n103//10\n\njulia> typeof(numerator(a))\nBigInt\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.numerator",
    "page": "Mathematics",
    "title": "Base.numerator",
    "category": "function",
    "text": "numerator(x)\n\nNumerator of the rational representation of x.\n\nExamples\n\njulia> numerator(2//3)\n2\n\njulia> numerator(4)\n4\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.denominator",
    "page": "Mathematics",
    "title": "Base.denominator",
    "category": "function",
    "text": "denominator(x)\n\nDenominator of the rational representation of x.\n\nExamples\n\njulia> denominator(2//3)\n3\n\njulia> denominator(4)\n1\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:<<",
    "page": "Mathematics",
    "title": "Base.:<<",
    "category": "function",
    "text": "<<(x, n)\n\nLeft bit shift operator, x << n. For n >= 0, the result is x shifted left by n bits, filling with 0s. This is equivalent to x * 2^n. For n < 0, this is equivalent to x >> -n.\n\nExamples\n\njulia> Int8(3) << 2\n12\n\njulia> bitstring(Int8(3))\n\"00000011\"\n\njulia> bitstring(Int8(12))\n\"00001100\"\n\nSee also >>, >>>.\n\n\n\n\n\n<<(B::BitVector, n) -> BitVector\n\nLeft bit shift operator, B << n. For n >= 0, the result is B with elements shifted n positions backwards, filling with false values. If n < 0, elements are shifted forwards. Equivalent to B >> -n.\n\nExamples\n\njulia> B = BitVector([true, false, true, false, false])\n5-element BitArray{1}:\n  true\n false\n  true\n false\n false\n\njulia> B << 1\n5-element BitArray{1}:\n false\n  true\n false\n false\n false\n\njulia> B << -1\n5-element BitArray{1}:\n false\n  true\n false\n  true\n false\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:>>",
    "page": "Mathematics",
    "title": "Base.:>>",
    "category": "function",
    "text": ">>(x, n)\n\nRight bit shift operator, x >> n. For n >= 0, the result is x shifted right by n bits, where n >= 0, filling with 0s if x >= 0, 1s if x < 0, preserving the sign of x. This is equivalent to fld(x, 2^n). For n < 0, this is equivalent to x << -n.\n\nExamples\n\njulia> Int8(13) >> 2\n3\n\njulia> bitstring(Int8(13))\n\"00001101\"\n\njulia> bitstring(Int8(3))\n\"00000011\"\n\njulia> Int8(-14) >> 2\n-4\n\njulia> bitstring(Int8(-14))\n\"11110010\"\n\njulia> bitstring(Int8(-4))\n\"11111100\"\n\nSee also >>>, <<.\n\n\n\n\n\n>>(B::BitVector, n) -> BitVector\n\nRight bit shift operator, B >> n. For n >= 0, the result is B with elements shifted n positions forward, filling with false values. If n < 0, elements are shifted backwards. Equivalent to B << -n.\n\nExamples\n\njulia> B = BitVector([true, false, true, false, false])\n5-element BitArray{1}:\n  true\n false\n  true\n false\n false\n\njulia> B >> 1\n5-element BitArray{1}:\n false\n  true\n false\n  true\n false\n\njulia> B >> -1\n5-element BitArray{1}:\n false\n  true\n false\n false\n false\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:>>>",
    "page": "Mathematics",
    "title": "Base.:>>>",
    "category": "function",
    "text": ">>>(x, n)\n\nUnsigned right bit shift operator, x >>> n. For n >= 0, the result is x shifted right by n bits, where n >= 0, filling with 0s. For n < 0, this is equivalent to x << -n.\n\nFor Unsigned integer types, this is equivalent to >>. For Signed integer types, this is equivalent to signed(unsigned(x) >> n).\n\nExamples\n\njulia> Int8(-14) >>> 2\n60\n\njulia> bitstring(Int8(-14))\n\"11110010\"\n\njulia> bitstring(Int8(60))\n\"00111100\"\n\nBigInts are treated as if having infinite size, so no filling is required and this is equivalent to >>.\n\nSee also >>, <<.\n\n\n\n\n\n>>>(B::BitVector, n) -> BitVector\n\nUnsigned right bitshift operator, B >>> n. Equivalent to B >> n. See >> for details and examples.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.::",
    "page": "Mathematics",
    "title": "Base.::",
    "category": "function",
    "text": "(:)(start, [step], stop)\n\nRange operator. a:b constructs a range from a to b with a step size of 1, and a:s:b is similar but uses a step size of s.\n\n: is also used in indexing to select whole dimensions.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.range",
    "page": "Mathematics",
    "title": "Base.range",
    "category": "function",
    "text": "range(start; length, stop, step=1)\n\nGiven a starting value, construct a range either by length or from start to stop, optionally with a given step (defaults to 1). One of length or stop is required. If length, stop, and step are all specified, they must agree.\n\nIf length and stop are provided and step is not, the step size will be computed automatically such that there are length linearly spaced elements in the range.\n\nExamples\n\njulia> range(1, length=100)\n1:100\n\njulia> range(1, stop=100)\n1:100\n\njulia> range(1, step=5, length=100)\n1:5:496\n\njulia> range(1, step=5, stop=100)\n1:5:96\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.OneTo",
    "page": "Mathematics",
    "title": "Base.OneTo",
    "category": "type",
    "text": "Base.OneTo(n)\n\nDefine an AbstractUnitRange that behaves like 1:n, with the added distinction that the lower limit is guaranteed (by the type system) to be 1.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.StepRangeLen",
    "page": "Mathematics",
    "title": "Base.StepRangeLen",
    "category": "type",
    "text": "StepRangeLen{T,R,S}(ref::R, step::S, len, [offset=1]) where {T,R,S}\nStepRangeLen(       ref::R, step::S, len, [offset=1]) where {  R,S}\n\nA range r where r[i] produces values of type T (in the second form, T is deduced automatically), parameterized by a reference value, a step, and the length. By default ref is the starting value r[1], but alternatively you can supply it as the value of r[offset] for some other index 1 <= offset <= len. In conjunction with TwicePrecision this can be used to implement ranges that are free of roundoff error.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:==",
    "page": "Mathematics",
    "title": "Base.:==",
    "category": "function",
    "text": "==(x, y)\n\nGeneric equality operator. Falls back to ===. Should be implemented for all types with a notion of equality, based on the abstract value that an instance represents. For example, all numeric types are compared by numeric value, ignoring type. Strings are compared as sequences of characters, ignoring encoding. For collections, == is generally called recursively on all contents, though other properties (like the shape for arrays) may also be taken into account.\n\nThis operator follows IEEE semantics for floating-point numbers: 0.0 == -0.0 and NaN != NaN.\n\nThe result is of type Bool, except when one of the operands is missing, in which case missing is returned (three-valued logic). For collections, missing is returned if at least one of the operands contains a missing value and all non-missing values are equal. Use isequal or === to always get a Bool result.\n\nImplementation\n\nNew numeric types should implement this function for two arguments of the new type, and handle comparison to other types via promotion rules where possible.\n\nisequal falls back to ==, so new methods of == will be used by the Dict type to compare keys. If your type will be used as a dictionary key, it should therefore also implement hash.\n\n\n\n\n\n==(x)\n\nCreate a function that compares its argument to x using ==, i.e. a function equivalent to y -> y == x.\n\nThe returned function is of type Base.Fix2{typeof(==)}, which can be used to implement specialized methods.\n\n\n\n\n\n==(a::AbstractString, b::AbstractString) -> Bool\n\nTest whether two strings are equal character by character (technically, Unicode code point by code point).\n\nExamples\n\njulia> \"abc\" == \"abc\"\ntrue\n\njulia> \"abc\" == \"αβγ\"\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:!=",
    "page": "Mathematics",
    "title": "Base.:!=",
    "category": "function",
    "text": "!=(x, y)\n≠(x,y)\n\nNot-equals comparison operator. Always gives the opposite answer as ==.\n\nImplementation\n\nNew types should generally not implement this, and rely on the fallback definition !=(x,y) = !(x==y) instead.\n\nExamples\n\njulia> 3 != 2\ntrue\n\njulia> \"foo\" ≠ \"foo\"\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:!==",
    "page": "Mathematics",
    "title": "Base.:!==",
    "category": "function",
    "text": "!==(x, y)\n≢(x,y)\n\nAlways gives the opposite answer as ===.\n\nExamples\n\njulia> a = [1, 2]; b = [1, 2];\n\njulia> a ≢ b\ntrue\n\njulia> a ≢ a\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:<",
    "page": "Mathematics",
    "title": "Base.:<",
    "category": "function",
    "text": "<(x, y)\n\nLess-than comparison operator. Falls back to isless. Because of the behavior of floating-point NaN values, this operator implements a partial order.\n\nImplementation\n\nNew numeric types with a canonical partial order should implement this function for two arguments of the new type. Types with a canonical total order should implement isless instead. (x < y) | (x == y)\n\nExamples\n\njulia> \'a\' < \'b\'\ntrue\n\njulia> \"abc\" < \"abd\"\ntrue\n\njulia> 5 < 3\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:<=",
    "page": "Mathematics",
    "title": "Base.:<=",
    "category": "function",
    "text": "<=(x, y)\n≤(x,y)\n\nLess-than-or-equals comparison operator. Falls back to (x < y) | (x == y).\n\nExamples\n\njulia> \'a\' <= \'b\'\ntrue\n\njulia> 7 ≤ 7 ≤ 9\ntrue\n\njulia> \"abc\" ≤ \"abc\"\ntrue\n\njulia> 5 <= 3\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:>",
    "page": "Mathematics",
    "title": "Base.:>",
    "category": "function",
    "text": ">(x, y)\n\nGreater-than comparison operator. Falls back to y < x.\n\nImplementation\n\nGenerally, new types should implement < instead of this function, and rely on the fallback definition >(x, y) = y < x.\n\nExamples\n\njulia> \'a\' > \'b\'\nfalse\n\njulia> 7 > 3 > 1\ntrue\n\njulia> \"abc\" > \"abd\"\nfalse\n\njulia> 5 > 3\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:>=",
    "page": "Mathematics",
    "title": "Base.:>=",
    "category": "function",
    "text": ">=(x, y)\n≥(x,y)\n\nGreater-than-or-equals comparison operator. Falls back to y <= x.\n\nExamples\n\njulia> \'a\' >= \'b\'\nfalse\n\njulia> 7 ≥ 7 ≥ 3\ntrue\n\njulia> \"abc\" ≥ \"abc\"\ntrue\n\njulia> 5 >= 3\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.cmp",
    "page": "Mathematics",
    "title": "Base.cmp",
    "category": "function",
    "text": "cmp(x,y)\n\nReturn -1, 0, or 1 depending on whether x is less than, equal to, or greater than y, respectively. Uses the total order implemented by isless.\n\nExamples\n\njulia> cmp(1, 2)\n-1\n\njulia> cmp(2, 1)\n1\n\njulia> cmp(2+im, 3-im)\nERROR: MethodError: no method matching isless(::Complex{Int64}, ::Complex{Int64})\n[...]\n\n\n\n\n\ncmp(<, x, y)\n\nReturn -1, 0, or 1 depending on whether x is less than, equal to, or greater than y, respectively. The first argument specifies a less-than comparison function to use.\n\n\n\n\n\ncmp(a::AbstractString, b::AbstractString) -> Int\n\nCompare two strings. Return 0 if both strings have the same length and the character at each index is the same in both strings. Return -1 if a is a prefix of b, or if a comes before b in alphabetical order. Return 1 if b is a prefix of a, or if b comes before a in alphabetical order (technically, lexicographical order by Unicode code points).\n\nExamples\n\njulia> cmp(\"abc\", \"abc\")\n0\n\njulia> cmp(\"ab\", \"abc\")\n-1\n\njulia> cmp(\"abc\", \"ab\")\n1\n\njulia> cmp(\"ab\", \"ac\")\n-1\n\njulia> cmp(\"ac\", \"ab\")\n1\n\njulia> cmp(\"α\", \"a\")\n1\n\njulia> cmp(\"b\", \"β\")\n-1\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:~",
    "page": "Mathematics",
    "title": "Base.:~",
    "category": "function",
    "text": "~(x)\n\nBitwise not.\n\nExamples\n\njulia> ~4\n-5\n\njulia> ~10\n-11\n\njulia> ~true\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:&",
    "page": "Mathematics",
    "title": "Base.:&",
    "category": "function",
    "text": "&(x, y)\n\nBitwise and. Implements three-valued logic, returning missing if one operand is missing and the other is true.\n\nExamples\n\njulia> 4 & 10\n0\n\njulia> 4 & 12\n4\n\njulia> true & missing\nmissing\n\njulia> false & missing\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:|",
    "page": "Mathematics",
    "title": "Base.:|",
    "category": "function",
    "text": "|(x, y)\n\nBitwise or. Implements three-valued logic, returning missing if one operand is missing and the other is false.\n\nExamples\n\njulia> 4 | 10\n14\n\njulia> 4 | 1\n5\n\njulia> true | missing\ntrue\n\njulia> false | missing\nmissing\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.xor",
    "page": "Mathematics",
    "title": "Base.xor",
    "category": "function",
    "text": "xor(x, y)\n⊻(x, y)\n\nBitwise exclusive or of x and y. Implements three-valued logic, returning missing if one of the arguments is missing.\n\nThe infix operation a ⊻ b is a synonym for xor(a,b), and ⊻ can be typed by tab-completing \\xor or \\veebar in the Julia REPL.\n\nExamples\n\njulia> xor(true, false)\ntrue\n\njulia> xor(true, true)\nfalse\n\njulia> xor(true, missing)\nmissing\n\njulia> false ⊻ false\nfalse\n\njulia> [true; true; false] .⊻ [true; false; false]\n3-element BitArray{1}:\n false\n  true\n false\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.:!",
    "page": "Mathematics",
    "title": "Base.:!",
    "category": "function",
    "text": "!(x)\n\nBoolean not. Implements three-valued logic, returning missing if x is missing.\n\nExamples\n\njulia> !true\nfalse\n\njulia> !false\ntrue\n\njulia> !missing\nmissing\n\njulia> .![true false true]\n1×3 BitArray{2}:\n false  true  false\n\n\n\n\n\n!f::Function\n\nPredicate function negation: when the argument of ! is a function, it returns a function which computes the boolean negation of f.\n\nExamples\n\njulia> str = \"∀ ε > 0, ∃ δ > 0: |x-y| < δ ⇒ |f(x)-f(y)| < ε\"\n\"∀ ε > 0, ∃ δ > 0: |x-y| < δ ⇒ |f(x)-f(y)| < ε\"\n\njulia> filter(isletter, str)\n\"εδxyδfxfyε\"\n\njulia> filter(!isletter, str)\n\"∀  > 0, ∃  > 0: |-| <  ⇒ |()-()| < \"\n\n\n\n\n\n"
},

{
    "location": "base/math/#&&",
    "page": "Mathematics",
    "title": "&&",
    "category": "keyword",
    "text": "x && y\n\nShort-circuiting boolean AND.\n\n\n\n\n\n"
},

{
    "location": "base/math/#||",
    "page": "Mathematics",
    "title": "||",
    "category": "keyword",
    "text": "x || y\n\nShort-circuiting boolean OR.\n\n\n\n\n\n"
},

{
    "location": "base/math/#math-ops-1",
    "page": "Mathematics",
    "title": "Mathematical Operators",
    "category": "section",
    "text": "Base.:-(::Any)\nBase.:(+)\nBase.:-(::Any, ::Any)\nBase.:*(::Any, ::Any...)\nBase.:(/)\nBase.:\\(::Any, ::Any)\nBase.:^(::Number, ::Number)\nBase.fma\nBase.muladd\nBase.inv(::Number)\nBase.div\nBase.fld\nBase.cld\nBase.mod\nBase.rem\nBase.rem2pi\nBase.Math.mod2pi\nBase.divrem\nBase.fldmod\nBase.fld1\nBase.mod1\nBase.fldmod1\nBase.:(//)\nBase.rationalize\nBase.numerator\nBase.denominator\nBase.:(<<)\nBase.:(>>)\nBase.:(>>>)\nBase.:(:)\nBase.range\nBase.OneTo\nBase.StepRangeLen\nBase.:(==)\nBase.:(!=)\nBase.:(!==)\nBase.:(<)\nBase.:(<=)\nBase.:(>)\nBase.:(>=)\nBase.cmp\nBase.:(~)\nBase.:(&)\nBase.:(|)\nBase.xor\nBase.:(!)\n&&\n||"
},

{
    "location": "base/math/#Base.isapprox",
    "page": "Mathematics",
    "title": "Base.isapprox",
    "category": "function",
    "text": "isapprox(x, y; rtol::Real=atol>0 ? 0 : √eps, atol::Real=0, nans::Bool=false, norm::Function)\n\nInexact equality comparison: true if norm(x-y) <= max(atol, rtol*max(norm(x), norm(y))). The default atol is zero and the default rtol depends on the types of x and y. The keyword argument nans determines whether or not NaN values are considered equal (defaults to false).\n\nFor real or complex floating-point values, if an atol > 0 is not specified, rtol defaults to the square root of eps of the type of x or y, whichever is bigger (least precise). This corresponds to requiring equality of about half of the significand digits. Otherwise, e.g. for integer arguments or if an atol > 0 is supplied, rtol defaults to zero.\n\nx and y may also be arrays of numbers, in which case norm defaults to vecnorm but may be changed by passing a norm::Function keyword argument. (For numbers, norm is the same thing as abs.) When x and y are arrays, if norm(x-y) is not finite (i.e. ±Inf or NaN), the comparison falls back to checking whether all elements of x and y are approximately equal component-wise.\n\nThe binary operator ≈ is equivalent to isapprox with the default arguments, and x ≉ y is equivalent to !isapprox(x,y).\n\nNote that x ≈ 0 (i.e., comparing to zero with the default tolerances) is equivalent to x == 0 since the default atol is 0.  In such cases, you should either supply an appropriate atol (or use norm(x) ≤ atol) or rearrange your code (e.g. use x ≈ y rather than x - y ≈ 0).   It is not possible to pick a nonzero atol automatically because it depends on the overall scaling (the \"units\") of your problem: for example, in x - y ≈ 0, atol=1e-9 is an absurdly small tolerance if x is the radius of the Earth in meters, but an absurdly large tolerance if x is the radius of a Hydrogen atom in meters.\n\nExamples\n\njulia> 0.1 ≈ (0.1 - 1e-10)\ntrue\n\njulia> isapprox(10, 11; atol = 2)\ntrue\n\njulia> isapprox([10.0^9, 1.0], [10.0^9, 2.0])\ntrue\n\njulia> 1e-10 ≈ 0\nfalse\n\njulia> isapprox(1e-10, 0, atol=1e-8)\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.sin-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.sin",
    "category": "method",
    "text": "sin(x)\n\nCompute sine of x, where x is in radians.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.cos-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.cos",
    "category": "method",
    "text": "cos(x)\n\nCompute cosine of x, where x is in radians.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.sincos-Tuple{Float64}",
    "page": "Mathematics",
    "title": "Base.Math.sincos",
    "category": "method",
    "text": "sincos(x)\n\nSimultaneously compute the sine and cosine of x, where the x is in radians.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.tan-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.tan",
    "category": "method",
    "text": "tan(x)\n\nCompute tangent of x, where x is in radians.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.sind",
    "page": "Mathematics",
    "title": "Base.Math.sind",
    "category": "function",
    "text": "sind(x)\n\nCompute sine of x, where x is in degrees. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.cosd",
    "page": "Mathematics",
    "title": "Base.Math.cosd",
    "category": "function",
    "text": "cosd(x)\n\nCompute cosine of x, where x is in degrees. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.tand",
    "page": "Mathematics",
    "title": "Base.Math.tand",
    "category": "function",
    "text": "tand(x)\n\nCompute tangent of x, where x is in degrees. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.sinpi",
    "page": "Mathematics",
    "title": "Base.Math.sinpi",
    "category": "function",
    "text": "sinpi(x)\n\nCompute sin(pi x) more accurately than sin(pi*x), especially for large x.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.cospi",
    "page": "Mathematics",
    "title": "Base.Math.cospi",
    "category": "function",
    "text": "cospi(x)\n\nCompute cos(pi x) more accurately than cos(pi*x), especially for large x.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.sinh-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.sinh",
    "category": "method",
    "text": "sinh(x)\n\nCompute hyperbolic sine of x.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.cosh-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.cosh",
    "category": "method",
    "text": "cosh(x)\n\nCompute hyperbolic cosine of x.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.tanh-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.tanh",
    "category": "method",
    "text": "tanh(x)\n\nCompute hyperbolic tangent of x.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.asin-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.asin",
    "category": "method",
    "text": "asin(x)\n\nCompute the inverse sine of x, where the output is in radians.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.acos-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.acos",
    "category": "method",
    "text": "acos(x)\n\nCompute the inverse cosine of x, where the output is in radians\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.atan-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.atan",
    "category": "method",
    "text": "atan(y)\natan(y, x)\n\nCompute the inverse tangent of y or y/x, respectively.\n\nFor one argument, this is the angle in radians between the positive x-axis and the point (1, y), returning a value in the interval -pi2 pi2.\n\nFor two arguments, this is the angle in radians between the positive x-axis and the point (x, y), returning a value in the interval -pi pi. This corresponds to a standard atan2 function.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.asind",
    "page": "Mathematics",
    "title": "Base.Math.asind",
    "category": "function",
    "text": "asind(x)\n\nCompute the inverse sine of x, where the output is in degrees. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.acosd",
    "page": "Mathematics",
    "title": "Base.Math.acosd",
    "category": "function",
    "text": "acosd(x)\n\nCompute the inverse cosine of x, where the output is in degrees. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.atand",
    "page": "Mathematics",
    "title": "Base.Math.atand",
    "category": "function",
    "text": "atand(y)\natand(y,x)\n\nCompute the inverse tangent of y or y/x, respectively, where the output is in degrees.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.sec-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.Math.sec",
    "category": "method",
    "text": "sec(x)\n\nCompute the secant of x, where x is in radians.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.csc-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.Math.csc",
    "category": "method",
    "text": "csc(x)\n\nCompute the cosecant of x, where x is in radians.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.cot-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.Math.cot",
    "category": "method",
    "text": "cot(x)\n\nCompute the cotangent of x, where x is in radians.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.secd",
    "page": "Mathematics",
    "title": "Base.Math.secd",
    "category": "function",
    "text": "secd(x)\n\nCompute the secant of x, where x is in degrees.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.cscd",
    "page": "Mathematics",
    "title": "Base.Math.cscd",
    "category": "function",
    "text": "cscd(x)\n\nCompute the cosecant of x, where x is in degrees.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.cotd",
    "page": "Mathematics",
    "title": "Base.Math.cotd",
    "category": "function",
    "text": "cotd(x)\n\nCompute the cotangent of x, where x is in degrees.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.asec-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.Math.asec",
    "category": "method",
    "text": "asec(x)\n\nCompute the inverse secant of x, where the output is in radians. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.acsc-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.Math.acsc",
    "category": "method",
    "text": "acsc(x)\n\nCompute the inverse cosecant of x, where the output is in radians. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.acot-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.Math.acot",
    "category": "method",
    "text": "acot(x)\n\nCompute the inverse cotangent of x, where the output is in radians. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.asecd",
    "page": "Mathematics",
    "title": "Base.Math.asecd",
    "category": "function",
    "text": "asecd(x)\n\nCompute the inverse secant of x, where the output is in degrees. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.acscd",
    "page": "Mathematics",
    "title": "Base.Math.acscd",
    "category": "function",
    "text": "acscd(x)\n\nCompute the inverse cosecant of x, where the output is in degrees. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.acotd",
    "page": "Mathematics",
    "title": "Base.Math.acotd",
    "category": "function",
    "text": "acotd(x)\n\nCompute the inverse cotangent of x, where the output is in degrees. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.sech-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.Math.sech",
    "category": "method",
    "text": "sech(x)\n\nCompute the hyperbolic secant of x.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.csch-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.Math.csch",
    "category": "method",
    "text": "csch(x)\n\nCompute the hyperbolic cosecant of x.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.coth-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.Math.coth",
    "category": "method",
    "text": "coth(x)\n\nCompute the hyperbolic cotangent of x.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.asinh-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.asinh",
    "category": "method",
    "text": "asinh(x)\n\nCompute the inverse hyperbolic sine of x.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.acosh-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.acosh",
    "category": "method",
    "text": "acosh(x)\n\nCompute the inverse hyperbolic cosine of x.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.atanh-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.atanh",
    "category": "method",
    "text": "atanh(x)\n\nCompute the inverse hyperbolic tangent of x.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.asech-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.Math.asech",
    "category": "method",
    "text": "asech(x)\n\nCompute the inverse hyperbolic secant of x. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.acsch-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.Math.acsch",
    "category": "method",
    "text": "acsch(x)\n\nCompute the inverse hyperbolic cosecant of x. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.acoth-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.Math.acoth",
    "category": "method",
    "text": "acoth(x)\n\nCompute the inverse hyperbolic cotangent of x. \n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.sinc",
    "page": "Mathematics",
    "title": "Base.Math.sinc",
    "category": "function",
    "text": "sinc(x)\n\nCompute sin(pi x)  (pi x) if x neq 0, and 1 if x = 0.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.cosc",
    "page": "Mathematics",
    "title": "Base.Math.cosc",
    "category": "function",
    "text": "cosc(x)\n\nCompute cos(pi x)  x - sin(pi x)  (pi x^2) if x neq 0, and 0 if x = 0. This is the derivative of sinc(x).\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.deg2rad",
    "page": "Mathematics",
    "title": "Base.Math.deg2rad",
    "category": "function",
    "text": "deg2rad(x)\n\nConvert x from degrees to radians.\n\nExamples\n\njulia> deg2rad(90)\n1.5707963267948966\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.rad2deg",
    "page": "Mathematics",
    "title": "Base.Math.rad2deg",
    "category": "function",
    "text": "rad2deg(x)\n\nConvert x from radians to degrees.\n\nExamples\n\njulia> rad2deg(pi)\n180.0\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.hypot",
    "page": "Mathematics",
    "title": "Base.Math.hypot",
    "category": "function",
    "text": "hypot(x, y)\n\nCompute the hypotenuse sqrtx^2+y^2 avoiding overflow and underflow.\n\nExamples\n\njulia> a = 10^10;\n\njulia> hypot(a, a)\n1.4142135623730951e10\n\njulia> √(a^2 + a^2) # a^2 overflows\nERROR: DomainError with -2.914184810805068e18:\nsqrt will only return a complex result if called with a complex argument. Try sqrt(Complex(x)).\nStacktrace:\n[...]\n\n\n\n\n\nhypot(x...)\n\nCompute the hypotenuse sqrtsum x_i^2 avoiding overflow and underflow.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.log-Tuple{Number}",
    "page": "Mathematics",
    "title": "Base.log",
    "category": "method",
    "text": "log(x)\n\nCompute the natural logarithm of x. Throws DomainError for negative Real arguments. Use complex negative arguments to obtain complex results.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.log-Tuple{Number,Number}",
    "page": "Mathematics",
    "title": "Base.log",
    "category": "method",
    "text": "log(b,x)\n\nCompute the base b logarithm of x. Throws DomainError for negative Real arguments.\n\nExamples\n\njulia> log(4,8)\n1.5\n\njulia> log(4,2)\n0.5\n\njulia> log(-2, 3)\nERROR: DomainError with log:\n-2.0 will only return a complex result if called with a complex argument. Try -2.0(Complex(x)).\nStacktrace:\n [1] throw_complex_domainerror(::Float64, ::Symbol) at ./math.jl:31\n[...]\n\njulia> log(2, -3)\nERROR: DomainError with log:\n-3.0 will only return a complex result if called with a complex argument. Try -3.0(Complex(x)).\nStacktrace:\n [1] throw_complex_domainerror(::Float64, ::Symbol) at ./math.jl:31\n[...]\n\nnote: Note\nIf b is a power of 2 or 10, log2 or log10 should be used, as these will typically be faster and more accurate. For example,julia> log(100,1000000)\n2.9999999999999996\n\njulia> log10(1000000)/2\n3.0\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.log2",
    "page": "Mathematics",
    "title": "Base.log2",
    "category": "function",
    "text": "log2(x)\n\nCompute the logarithm of x to base 2. Throws DomainError for negative Real arguments.\n\nExamples\n\njulia> log2(4)\n2.0\n\njulia> log2(10)\n3.321928094887362\n\njulia> log2(-2)\nERROR: DomainError with -2.0:\nNaN result for non-NaN input.\nStacktrace:\n [1] nan_dom_err at ./math.jl:325 [inlined]\n[...]\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.log10",
    "page": "Mathematics",
    "title": "Base.log10",
    "category": "function",
    "text": "log10(x)\n\nCompute the logarithm of x to base 10. Throws DomainError for negative Real arguments.\n\nExamples\n\njulia> log10(100)\n2.0\n\njulia> log10(2)\n0.3010299956639812\n\njulia> log10(-2)\nERROR: DomainError with -2.0:\nNaN result for non-NaN input.\nStacktrace:\n [1] nan_dom_err at ./math.jl:325 [inlined]\n[...]\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.log1p",
    "page": "Mathematics",
    "title": "Base.log1p",
    "category": "function",
    "text": "log1p(x)\n\nAccurate natural logarithm of 1+x. Throws DomainError for Real arguments less than -1.\n\nExamples\n\njulia> log1p(-0.5)\n-0.6931471805599453\n\njulia> log1p(0)\n0.0\n\njulia> log1p(-2)\nERROR: DomainError with log1p:\n-2.0 will only return a complex result if called with a complex argument. Try -2.0(Complex(x)).\nStacktrace:\n [1] throw_complex_domainerror(::Float64, ::Symbol) at ./math.jl:31\n[...]\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.frexp",
    "page": "Mathematics",
    "title": "Base.Math.frexp",
    "category": "function",
    "text": "frexp(val)\n\nReturn (x,exp) such that x has a magnitude in the interval 12 1) or 0, and val is equal to x times 2^exp.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.exp-Tuple{Float64}",
    "page": "Mathematics",
    "title": "Base.exp",
    "category": "method",
    "text": "exp(x)\n\nCompute the natural base exponential of x, in other words e^x.\n\nExamples\n\njulia> exp(1.0)\n2.718281828459045\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.exp2",
    "page": "Mathematics",
    "title": "Base.exp2",
    "category": "function",
    "text": "exp2(x)\n\nCompute the base 2 exponential of x, in other words 2^x.\n\nExamples\n\njulia> exp2(5)\n32.0\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.exp10",
    "page": "Mathematics",
    "title": "Base.exp10",
    "category": "function",
    "text": "exp10(x)\n\nCompute the base 10 exponential of x, in other words 10^x.\n\nExamples\n\njulia> exp10(2)\n100.0\n\n\n\n\n\nexp10(x)\n\nCompute 10^x.\n\nExamples\n\njulia> exp10(2)\n100.0\n\njulia> exp10(0.2)\n1.5848931924611136\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.ldexp",
    "page": "Mathematics",
    "title": "Base.Math.ldexp",
    "category": "function",
    "text": "ldexp(x, n)\n\nCompute x times 2^n.\n\nExamples\n\njulia> ldexp(5., 2)\n20.0\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.modf",
    "page": "Mathematics",
    "title": "Base.Math.modf",
    "category": "function",
    "text": "modf(x)\n\nReturn a tuple (fpart, ipart) of the fractional and integral parts of a number. Both parts have the same sign as the argument.\n\nExamples\n\njulia> modf(3.5)\n(0.5, 3.0)\n\njulia> modf(-3.5)\n(-0.5, -3.0)\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.expm1",
    "page": "Mathematics",
    "title": "Base.expm1",
    "category": "function",
    "text": "expm1(x)\n\nAccurately compute e^x-1.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.round-Tuple{Type,Any}",
    "page": "Mathematics",
    "title": "Base.round",
    "category": "method",
    "text": "round([T,] x, [r::RoundingMode])\nround(x, [r::RoundingMode]; digits::Integer=0, base = 10)\nround(x, [r::RoundingMode]; sigdigits::Integer, base = 10)\n\nRounds the number x.\n\nWithout keyword arguments, x is rounded to an integer value, returning a value of type T, or of the same type of x if no T is provided. An InexactError will be thrown if the value is not representable by T, similar to convert.\n\nIf the digits keyword argument is provided, it rounds to the specified number of digits after the decimal place (or before if negative), in base base.\n\nIf the sigdigits keyword argument is provided, it rounds to the specified number of significant digits, in base base.\n\nThe RoundingMode r controls the direction of the rounding; the default is RoundNearest, which rounds to the nearest integer, with ties (fractional values of 0.5) being rounded to the nearest even integer. Note that round may give incorrect results if the global rounding mode is changed (see rounding).\n\nExamples\n\njulia> round(1.7)\n2.0\n\njulia> round(Int, 1.7)\n2\n\njulia> round(1.5)\n2.0\n\njulia> round(2.5)\n2.0\n\njulia> round(pi; digits=2)\n3.14\n\njulia> round(pi; digits=3, base=2)\n3.125\n\njulia> round(123.456; sigdigits=2)\n120.0\n\njulia> round(357.913; sigdigits=4, base=2)\n352.0\n\nnote: Note\nRounding to specified digits in bases other than 2 can be inexact when operating on binary floating point numbers. For example, the Float64 value represented by 1.15 is actually less than 1.15, yet will be rounded to 1.2.Examplesjulia> x = 1.15\n1.15\n\njulia> @sprintf \"%.20f\" x\n\"1.14999999999999991118\"\n\njulia> x < 115//100\ntrue\n\njulia> round(x, digits=1)\n1.2\n\nExtensions\n\nTo extend round to new numeric types, it is typically sufficient to define Base.round(x::NewType, r::RoundingMode).\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Rounding.RoundingMode",
    "page": "Mathematics",
    "title": "Base.Rounding.RoundingMode",
    "category": "type",
    "text": "RoundingMode\n\nA type used for controlling the rounding mode of floating point operations (via rounding/setrounding functions), or as optional arguments for rounding to the nearest integer (via the round function).\n\nCurrently supported rounding modes are:\n\nRoundNearest (default)\nRoundNearestTiesAway\nRoundNearestTiesUp\nRoundToZero\nRoundFromZero (BigFloat only)\nRoundUp\nRoundDown\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Rounding.RoundNearest",
    "page": "Mathematics",
    "title": "Base.Rounding.RoundNearest",
    "category": "constant",
    "text": "RoundNearest\n\nThe default rounding mode. Rounds to the nearest integer, with ties (fractional values of 0.5) being rounded to the nearest even integer.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Rounding.RoundNearestTiesAway",
    "page": "Mathematics",
    "title": "Base.Rounding.RoundNearestTiesAway",
    "category": "constant",
    "text": "RoundNearestTiesAway\n\nRounds to nearest integer, with ties rounded away from zero (C/C++ round behaviour).\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Rounding.RoundNearestTiesUp",
    "page": "Mathematics",
    "title": "Base.Rounding.RoundNearestTiesUp",
    "category": "constant",
    "text": "RoundNearestTiesUp\n\nRounds to nearest integer, with ties rounded toward positive infinity (Java/JavaScript round behaviour).\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Rounding.RoundToZero",
    "page": "Mathematics",
    "title": "Base.Rounding.RoundToZero",
    "category": "constant",
    "text": "RoundToZero\n\nround using this rounding mode is an alias for trunc.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Rounding.RoundUp",
    "page": "Mathematics",
    "title": "Base.Rounding.RoundUp",
    "category": "constant",
    "text": "RoundUp\n\nround using this rounding mode is an alias for ceil.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Rounding.RoundDown",
    "page": "Mathematics",
    "title": "Base.Rounding.RoundDown",
    "category": "constant",
    "text": "RoundDown\n\nround using this rounding mode is an alias for floor.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.round-Tuple{Complex{#s1} where #s1<:AbstractFloat,RoundingMode,RoundingMode}",
    "page": "Mathematics",
    "title": "Base.round",
    "category": "method",
    "text": "round(z::Complex[, RoundingModeReal, [RoundingModeImaginary]])\nround(z::Complex[, RoundingModeReal, [RoundingModeImaginary]]; digits=, base=10)\nround(z::Complex[, RoundingModeReal, [RoundingModeImaginary]]; sigdigits=, base=10)\n\nReturn the nearest integral value of the same type as the complex-valued z to z, breaking ties using the specified RoundingModes. The first RoundingMode is used for rounding the real components while the second is used for rounding the imaginary components.\n\nExample\n\njulia> round(3.14 + 4.5im)\n3.0 + 4.0im\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.ceil",
    "page": "Mathematics",
    "title": "Base.ceil",
    "category": "function",
    "text": "ceil([T,] x)\nceil(x; digits::Integer= [, base = 10])\nceil(x; sigdigits::Integer= [, base = 10])\n\nceil(x) returns the nearest integral value of the same type as x that is greater than or equal to x.\n\nceil(T, x) converts the result to type T, throwing an InexactError if the value is not representable.\n\ndigits, sigdigits and base work as for round.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.floor",
    "page": "Mathematics",
    "title": "Base.floor",
    "category": "function",
    "text": "floor([T,] x)\nfloor(x; digits::Integer= [, base = 10])\nfloor(x; sigdigits::Integer= [, base = 10])\n\nfloor(x) returns the nearest integral value of the same type as x that is less than or equal to x.\n\nfloor(T, x) converts the result to type T, throwing an InexactError if the value is not representable.\n\ndigits, sigdigits and base work as for round.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.trunc",
    "page": "Mathematics",
    "title": "Base.trunc",
    "category": "function",
    "text": "trunc([T,] x)\ntrunc(x; digits::Integer= [, base = 10])\ntrunc(x; sigdigits::Integer= [, base = 10])\n\ntrunc(x) returns the nearest integral value of the same type as x whose absolute value is less than or equal to x.\n\ntrunc(T, x) converts the result to type T, throwing an InexactError if the value is not representable.\n\ndigits, sigdigits and base work as for round.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.unsafe_trunc",
    "page": "Mathematics",
    "title": "Base.unsafe_trunc",
    "category": "function",
    "text": "unsafe_trunc(T, x)\n\nReturn the nearest integral value of type T whose absolute value is less than or equal to x. If the value is not representable by T, an arbitrary value will be returned.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.min",
    "page": "Mathematics",
    "title": "Base.min",
    "category": "function",
    "text": "min(x, y, ...)\n\nReturn the minimum of the arguments. See also the minimum function to take the minimum element from a collection.\n\nExamples\n\njulia> min(2, 5, 1)\n1\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.max",
    "page": "Mathematics",
    "title": "Base.max",
    "category": "function",
    "text": "max(x, y, ...)\n\nReturn the maximum of the arguments. See also the maximum function to take the maximum element from a collection.\n\nExamples\n\njulia> max(2, 5, 1)\n5\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.minmax",
    "page": "Mathematics",
    "title": "Base.minmax",
    "category": "function",
    "text": "minmax(x, y)\n\nReturn (min(x,y), max(x,y)). See also: extrema that returns (minimum(x), maximum(x)).\n\nExamples\n\njulia> minmax(\'c\',\'b\')\n(\'b\', \'c\')\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.clamp",
    "page": "Mathematics",
    "title": "Base.Math.clamp",
    "category": "function",
    "text": "clamp(x, lo, hi)\n\nReturn x if lo <= x <= hi. If x > hi, return hi. If x < lo, return lo. Arguments are promoted to a common type.\n\nExamples\n\njulia> clamp.([pi, 1.0, big(10.)], 2., 9.)\n3-element Array{BigFloat,1}:\n 3.141592653589793238462643383279502884197169399375105820974944592307816406286198\n 2.0\n 9.0\n\njulia> clamp.([11,8,5],10,6) # an example where lo > hi\n3-element Array{Int64,1}:\n  6\n  6\n 10\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.clamp!",
    "page": "Mathematics",
    "title": "Base.Math.clamp!",
    "category": "function",
    "text": "clamp!(array::AbstractArray, lo, hi)\n\nRestrict values in array to the specified range, in-place. See also clamp.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.abs",
    "page": "Mathematics",
    "title": "Base.abs",
    "category": "function",
    "text": "abs(x)\n\nThe absolute value of x.\n\nWhen abs is applied to signed integers, overflow may occur, resulting in the return of a negative value. This overflow occurs only when abs is applied to the minimum representable value of a signed integer. That is, when x == typemin(typeof(x)), abs(x) == x < 0, not -x as might be expected.\n\nExamples\n\njulia> abs(-3)\n3\n\njulia> abs(1 + im)\n1.4142135623730951\n\njulia> abs(typemin(Int64))\n-9223372036854775808\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Checked.checked_abs",
    "page": "Mathematics",
    "title": "Base.Checked.checked_abs",
    "category": "function",
    "text": "Base.checked_abs(x)\n\nCalculates abs(x), checking for overflow errors where applicable. For example, standard two\'s complement signed integers (e.g. Int) cannot represent abs(typemin(Int)), thus leading to an overflow.\n\nThe overflow protection may impose a perceptible performance penalty.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Checked.checked_neg",
    "page": "Mathematics",
    "title": "Base.Checked.checked_neg",
    "category": "function",
    "text": "Base.checked_neg(x)\n\nCalculates -x, checking for overflow errors where applicable. For example, standard two\'s complement signed integers (e.g. Int) cannot represent -typemin(Int), thus leading to an overflow.\n\nThe overflow protection may impose a perceptible performance penalty.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Checked.checked_add",
    "page": "Mathematics",
    "title": "Base.Checked.checked_add",
    "category": "function",
    "text": "Base.checked_add(x, y)\n\nCalculates x+y, checking for overflow errors where applicable.\n\nThe overflow protection may impose a perceptible performance penalty.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Checked.checked_sub",
    "page": "Mathematics",
    "title": "Base.Checked.checked_sub",
    "category": "function",
    "text": "Base.checked_sub(x, y)\n\nCalculates x-y, checking for overflow errors where applicable.\n\nThe overflow protection may impose a perceptible performance penalty.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Checked.checked_mul",
    "page": "Mathematics",
    "title": "Base.Checked.checked_mul",
    "category": "function",
    "text": "Base.checked_mul(x, y)\n\nCalculates x*y, checking for overflow errors where applicable.\n\nThe overflow protection may impose a perceptible performance penalty.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Checked.checked_div",
    "page": "Mathematics",
    "title": "Base.Checked.checked_div",
    "category": "function",
    "text": "Base.checked_div(x, y)\n\nCalculates div(x,y), checking for overflow errors where applicable.\n\nThe overflow protection may impose a perceptible performance penalty.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Checked.checked_rem",
    "page": "Mathematics",
    "title": "Base.Checked.checked_rem",
    "category": "function",
    "text": "Base.checked_rem(x, y)\n\nCalculates x%y, checking for overflow errors where applicable.\n\nThe overflow protection may impose a perceptible performance penalty.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Checked.checked_fld",
    "page": "Mathematics",
    "title": "Base.Checked.checked_fld",
    "category": "function",
    "text": "Base.checked_fld(x, y)\n\nCalculates fld(x,y), checking for overflow errors where applicable.\n\nThe overflow protection may impose a perceptible performance penalty.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Checked.checked_mod",
    "page": "Mathematics",
    "title": "Base.Checked.checked_mod",
    "category": "function",
    "text": "Base.checked_mod(x, y)\n\nCalculates mod(x,y), checking for overflow errors where applicable.\n\nThe overflow protection may impose a perceptible performance penalty.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Checked.checked_cld",
    "page": "Mathematics",
    "title": "Base.Checked.checked_cld",
    "category": "function",
    "text": "Base.checked_cld(x, y)\n\nCalculates cld(x,y), checking for overflow errors where applicable.\n\nThe overflow protection may impose a perceptible performance penalty.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Checked.add_with_overflow",
    "page": "Mathematics",
    "title": "Base.Checked.add_with_overflow",
    "category": "function",
    "text": "Base.add_with_overflow(x, y) -> (r, f)\n\nCalculates r = x+y, with the flag f indicating whether overflow has occurred.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Checked.sub_with_overflow",
    "page": "Mathematics",
    "title": "Base.Checked.sub_with_overflow",
    "category": "function",
    "text": "Base.sub_with_overflow(x, y) -> (r, f)\n\nCalculates r = x-y, with the flag f indicating whether overflow has occurred.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Checked.mul_with_overflow",
    "page": "Mathematics",
    "title": "Base.Checked.mul_with_overflow",
    "category": "function",
    "text": "Base.mul_with_overflow(x, y) -> (r, f)\n\nCalculates r = x*y, with the flag f indicating whether overflow has occurred.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.abs2",
    "page": "Mathematics",
    "title": "Base.abs2",
    "category": "function",
    "text": "abs2(x)\n\nSquared absolute value of x.\n\nExamples\n\njulia> abs2(-3)\n9\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.copysign",
    "page": "Mathematics",
    "title": "Base.copysign",
    "category": "function",
    "text": "copysign(x, y) -> z\n\nReturn z which has the magnitude of x and the same sign as y.\n\nExamples\n\njulia> copysign(1, -2)\n-1\n\njulia> copysign(-1, 2)\n1\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.sign",
    "page": "Mathematics",
    "title": "Base.sign",
    "category": "function",
    "text": "sign(x)\n\nReturn zero if x==0 and xx otherwise (i.e., ±1 for real x).\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.signbit",
    "page": "Mathematics",
    "title": "Base.signbit",
    "category": "function",
    "text": "signbit(x)\n\nReturns true if the value of the sign of x is negative, otherwise false.\n\nExamples\n\njulia> signbit(-4)\ntrue\n\njulia> signbit(5)\nfalse\n\njulia> signbit(5.5)\nfalse\n\njulia> signbit(-4.1)\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.flipsign",
    "page": "Mathematics",
    "title": "Base.flipsign",
    "category": "function",
    "text": "flipsign(x, y)\n\nReturn x with its sign flipped if y is negative. For example abs(x) = flipsign(x,x).\n\nExamples\n\njulia> flipsign(5, 3)\n5\n\njulia> flipsign(5, -3)\n-5\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.sqrt-Tuple{Real}",
    "page": "Mathematics",
    "title": "Base.sqrt",
    "category": "method",
    "text": "sqrt(x)\n\nReturn sqrtx. Throws DomainError for negative Real arguments. Use complex negative arguments instead. The prefix operator √ is equivalent to sqrt.\n\nExamples\n\njulia> sqrt(big(81))\n9.0\n\njulia> sqrt(big(-81))\nERROR: DomainError with -8.1e+01:\nNaN result for non-NaN input.\nStacktrace:\n [1] sqrt(::BigFloat) at ./mpfr.jl:501\n[...]\n\njulia> sqrt(big(complex(-81)))\n0.0 + 9.0im\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.isqrt",
    "page": "Mathematics",
    "title": "Base.isqrt",
    "category": "function",
    "text": "isqrt(n::Integer)\n\nInteger square root: the largest integer m such that m*m <= n.\n\njulia> isqrt(5)\n2\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.cbrt",
    "page": "Mathematics",
    "title": "Base.Math.cbrt",
    "category": "function",
    "text": "cbrt(x::Real)\n\nReturn the cube root of x, i.e. x^13. Negative values are accepted (returning the negative real root when x  0).\n\nThe prefix operator ∛ is equivalent to cbrt.\n\nExamples\n\njulia> cbrt(big(27))\n3.0\n\njulia> cbrt(big(-27))\n-3.0\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.real-Tuple{Complex}",
    "page": "Mathematics",
    "title": "Base.real",
    "category": "method",
    "text": "real(z)\n\nReturn the real part of the complex number z.\n\nExamples\n\njulia> real(1 + 3im)\n1\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.imag",
    "page": "Mathematics",
    "title": "Base.imag",
    "category": "function",
    "text": "imag(z)\n\nReturn the imaginary part of the complex number z.\n\nExamples\n\njulia> imag(1 + 3im)\n3\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.reim",
    "page": "Mathematics",
    "title": "Base.reim",
    "category": "function",
    "text": "reim(z)\n\nReturn both the real and imaginary parts of the complex number z.\n\nExamples\n\njulia> reim(1 + 3im)\n(1, 3)\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.conj",
    "page": "Mathematics",
    "title": "Base.conj",
    "category": "function",
    "text": "conj(z)\n\nCompute the complex conjugate of a complex number z.\n\nExamples\n\njulia> conj(1 + 3im)\n1 - 3im\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.angle",
    "page": "Mathematics",
    "title": "Base.angle",
    "category": "function",
    "text": "angle(z)\n\nCompute the phase angle in radians of a complex number z.\n\nExamples\n\njulia> rad2deg(angle(1 + im))\n45.0\n\njulia> rad2deg(angle(1 - im))\n-45.0\n\njulia> rad2deg(angle(-1 - im))\n-135.0\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.cis",
    "page": "Mathematics",
    "title": "Base.cis",
    "category": "function",
    "text": "cis(z)\n\nReturn exp(iz).\n\nExamples\n\njulia> cis(π) ≈ -1\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.binomial",
    "page": "Mathematics",
    "title": "Base.binomial",
    "category": "function",
    "text": "binomial(n, k)\n\nNumber of ways to choose k out of n items.\n\nExamples\n\njulia> binomial(5, 3)\n10\n\njulia> factorial(5) ÷ (factorial(5-3) * factorial(3))\n10\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.factorial",
    "page": "Mathematics",
    "title": "Base.factorial",
    "category": "function",
    "text": "factorial(n::Integer)\n\nFactorial of n. If n is an Integer, the factorial is computed as an integer (promoted to at least 64 bits). Note that this may overflow if n is not small, but you can use factorial(big(n)) to compute the result exactly in arbitrary precision.\n\nExamples\n\njulia> factorial(6)\n720\n\njulia> factorial(21)\nERROR: OverflowError: 21 is too large to look up in the table\nStacktrace:\n[...]\n\njulia> factorial(big(21))\n51090942171709440000\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.gcd",
    "page": "Mathematics",
    "title": "Base.gcd",
    "category": "function",
    "text": "gcd(x,y)\n\nGreatest common (positive) divisor (or zero if x and y are both zero).\n\nExamples\n\njulia> gcd(6,9)\n3\n\njulia> gcd(6,-9)\n3\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.lcm",
    "page": "Mathematics",
    "title": "Base.lcm",
    "category": "function",
    "text": "lcm(x,y)\n\nLeast common (non-negative) multiple.\n\nExamples\n\njulia> lcm(2,3)\n6\n\njulia> lcm(-2,3)\n6\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.gcdx",
    "page": "Mathematics",
    "title": "Base.gcdx",
    "category": "function",
    "text": "gcdx(x,y)\n\nComputes the greatest common (positive) divisor of x and y and their Bézout coefficients, i.e. the integer coefficients u and v that satisfy ux+vy = d = gcd(xy). gcdx(xy) returns (duv).\n\nExamples\n\njulia> gcdx(12, 42)\n(6, -3, 1)\n\njulia> gcdx(240, 46)\n(2, -9, 47)\n\nnote: Note\nBézout coefficients are not uniquely defined. gcdx returns the minimal Bézout coefficients that are computed by the extended Euclidean algorithm. (Ref: D. Knuth, TAoCP, 2/e, p. 325, Algorithm X.) For signed integers, these coefficients u and v are minimal in the sense that u  yd and v  xd. Furthermore, the signs of u and v are chosen so that d is positive. For unsigned integers, the coefficients u and v might be near their typemax, and the identity then holds only via the unsigned integers\' modulo arithmetic.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.ispow2",
    "page": "Mathematics",
    "title": "Base.ispow2",
    "category": "function",
    "text": "ispow2(n::Integer) -> Bool\n\nTest whether n is a power of two.\n\nExamples\n\njulia> ispow2(4)\ntrue\n\njulia> ispow2(5)\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.nextpow2",
    "page": "Mathematics",
    "title": "Base.nextpow2",
    "category": "function",
    "text": "nextpow2(n::Integer)\n\nThe smallest power of two not less than n. Returns 0 for n==0, and returns -nextpow2(-n) for negative arguments.\n\nExamples\n\njulia> nextpow2(16)\n16\n\njulia> nextpow2(17)\n32\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.prevpow2",
    "page": "Mathematics",
    "title": "Base.prevpow2",
    "category": "function",
    "text": "prevpow2(n::Integer)\n\nThe largest power of two not greater than n. Returns 0 for n==0, and returns -prevpow2(-n) for negative arguments.\n\nExamples\n\njulia> prevpow2(5)\n4\n\njulia> prevpow2(0)\n0\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.nextpow",
    "page": "Mathematics",
    "title": "Base.nextpow",
    "category": "function",
    "text": "nextpow(a, x)\n\nThe smallest a^n not less than x, where n is a non-negative integer. a must be greater than 1, and x must be greater than 0.\n\nExamples\n\njulia> nextpow(2, 7)\n8\n\njulia> nextpow(2, 9)\n16\n\njulia> nextpow(5, 20)\n25\n\njulia> nextpow(4, 16)\n16\n\nSee also prevpow.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.prevpow",
    "page": "Mathematics",
    "title": "Base.prevpow",
    "category": "function",
    "text": "prevpow(a, x)\n\nThe largest a^n not greater than x, where n is a non-negative integer. a must be greater than 1, and x must not be less than 1.\n\nExamples\n\njulia> prevpow(2, 7)\n4\n\njulia> prevpow(2, 9)\n8\n\njulia> prevpow(5, 20)\n5\n\njulia> prevpow(4, 16)\n16\n\nSee also nextpow.\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.nextprod",
    "page": "Mathematics",
    "title": "Base.nextprod",
    "category": "function",
    "text": "nextprod([k_1, k_2,...], n)\n\nNext integer greater than or equal to n that can be written as prod k_i^p_i for integers p_1, p_2, etc.\n\nExamples\n\njulia> nextprod([2, 3], 105)\n108\n\njulia> 2^2 * 3^3\n108\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.invmod",
    "page": "Mathematics",
    "title": "Base.invmod",
    "category": "function",
    "text": "invmod(x,m)\n\nTake the inverse of x modulo m: y such that x y = 1 pmod m, with div(xy) = 0. This is undefined for m = 0, or if gcd(xm) neq 1.\n\nExamples\n\njulia> invmod(2,5)\n3\n\njulia> invmod(2,3)\n2\n\njulia> invmod(5,6)\n5\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.powermod",
    "page": "Mathematics",
    "title": "Base.powermod",
    "category": "function",
    "text": "powermod(x::Integer, p::Integer, m)\n\nCompute x^p pmod m.\n\nExamples\n\njulia> powermod(2, 6, 5)\n4\n\njulia> mod(2^6, 5)\n4\n\njulia> powermod(5, 2, 20)\n5\n\njulia> powermod(5, 2, 19)\n6\n\njulia> powermod(5, 3, 19)\n11\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.ndigits",
    "page": "Mathematics",
    "title": "Base.ndigits",
    "category": "function",
    "text": "ndigits(n::Integer; base::Integer=10, pad::Integer=1)\n\nCompute the number of digits in integer n written in base base (base must not be in [-1, 0, 1]), optionally padded with zeros to a specified size (the result will never be less than pad).\n\nExamples\n\njulia> ndigits(12345)\n5\n\njulia> ndigits(1022, base=16)\n3\n\njulia> string(1022, base=16)\n\"3fe\"\n\njulia> ndigits(123, pad=5)\n5\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.widemul",
    "page": "Mathematics",
    "title": "Base.widemul",
    "category": "function",
    "text": "widemul(x, y)\n\nMultiply x and y, giving the result as a larger type.\n\nExamples\n\njulia> widemul(Float32(3.), 4.)\n1.2e+01\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.Math.@evalpoly",
    "page": "Mathematics",
    "title": "Base.Math.@evalpoly",
    "category": "macro",
    "text": "@evalpoly(z, c...)\n\nEvaluate the polynomial sum_k ck z^k-1 for the coefficients c[1], c[2], ...; that is, the coefficients are given in ascending order by power of z.  This macro expands to efficient inline code that uses either Horner\'s method or, for complex z, a more efficient Goertzel-like algorithm.\n\nExamples\n\njulia> @evalpoly(3, 1, 0, 1)\n10\n\njulia> @evalpoly(2, 1, 0, 1)\n5\n\njulia> @evalpoly(2, 1, 1, 1)\n7\n\n\n\n\n\n"
},

{
    "location": "base/math/#Base.FastMath.@fastmath",
    "page": "Mathematics",
    "title": "Base.FastMath.@fastmath",
    "category": "macro",
    "text": "@fastmath expr\n\nExecute a transformed version of the expression, which calls functions that may violate strict IEEE semantics. This allows the fastest possible operation, but results are undefined – be careful when doing this, as it may change numerical results.\n\nThis sets the LLVM Fast-Math flags, and corresponds to the -ffast-math option in clang. See the notes on performance annotations for more details.\n\nExamples\n\njulia> @fastmath 1+2\n3\n\njulia> @fastmath(sin(3))\n0.1411200080598672\n\n\n\n\n\n"
},

{
    "location": "base/math/#Mathematical-Functions-1",
    "page": "Mathematics",
    "title": "Mathematical Functions",
    "category": "section",
    "text": "Base.isapprox\nBase.sin(::Number)\nBase.cos(::Number)\nBase.sincos(::Float64)\nBase.tan(::Number)\nBase.Math.sind\nBase.Math.cosd\nBase.Math.tand\nBase.Math.sinpi\nBase.Math.cospi\nBase.sinh(::Number)\nBase.cosh(::Number)\nBase.tanh(::Number)\nBase.asin(::Number)\nBase.acos(::Number)\nBase.atan(::Number)\nBase.Math.asind\nBase.Math.acosd\nBase.Math.atand\nBase.Math.sec(::Number)\nBase.Math.csc(::Number)\nBase.Math.cot(::Number)\nBase.Math.secd\nBase.Math.cscd\nBase.Math.cotd\nBase.Math.asec(::Number)\nBase.Math.acsc(::Number)\nBase.Math.acot(::Number)\nBase.Math.asecd\nBase.Math.acscd\nBase.Math.acotd\nBase.Math.sech(::Number)\nBase.Math.csch(::Number)\nBase.Math.coth(::Number)\nBase.asinh(::Number)\nBase.acosh(::Number)\nBase.atanh(::Number)\nBase.Math.asech(::Number)\nBase.Math.acsch(::Number)\nBase.Math.acoth(::Number)\nBase.Math.sinc\nBase.Math.cosc\nBase.Math.deg2rad\nBase.Math.rad2deg\nBase.Math.hypot\nBase.log(::Number)\nBase.log(::Number, ::Number)\nBase.log2\nBase.log10\nBase.log1p\nBase.Math.frexp\nBase.exp(::Float64)\nBase.exp2\nBase.exp10\nBase.Math.ldexp\nBase.Math.modf\nBase.expm1\nBase.round(::Type, ::Any)\nBase.Rounding.RoundingMode\nBase.Rounding.RoundNearest\nBase.Rounding.RoundNearestTiesAway\nBase.Rounding.RoundNearestTiesUp\nBase.Rounding.RoundToZero\nBase.Rounding.RoundUp\nBase.Rounding.RoundDown\nBase.round(::Complex{<: AbstractFloat}, ::RoundingMode, ::RoundingMode)\nBase.ceil\nBase.floor\nBase.trunc\nBase.unsafe_trunc\nBase.min\nBase.max\nBase.minmax\nBase.Math.clamp\nBase.Math.clamp!\nBase.abs\nBase.Checked.checked_abs\nBase.Checked.checked_neg\nBase.Checked.checked_add\nBase.Checked.checked_sub\nBase.Checked.checked_mul\nBase.Checked.checked_div\nBase.Checked.checked_rem\nBase.Checked.checked_fld\nBase.Checked.checked_mod\nBase.Checked.checked_cld\nBase.Checked.add_with_overflow\nBase.Checked.sub_with_overflow\nBase.Checked.mul_with_overflow\nBase.abs2\nBase.copysign\nBase.sign\nBase.signbit\nBase.flipsign\nBase.sqrt(::Real)\nBase.isqrt\nBase.Math.cbrt\nBase.real(::Complex)\nBase.imag\nBase.reim\nBase.conj\nBase.angle\nBase.cis\nBase.binomial\nBase.factorial\nBase.gcd\nBase.lcm\nBase.gcdx\nBase.ispow2\nBase.nextpow2\nBase.prevpow2\nBase.nextpow\nBase.prevpow\nBase.nextprod\nBase.invmod\nBase.powermod\nBase.ndigits\nBase.widemul\nBase.Math.@evalpoly\nBase.FastMath.@fastmath"
},

{
    "location": "base/numbers/#",
    "page": "Numbers",
    "title": "Numbers",
    "category": "page",
    "text": ""
},

{
    "location": "base/numbers/#lib-numbers-1",
    "page": "Numbers",
    "title": "Numbers",
    "category": "section",
    "text": ""
},

{
    "location": "base/numbers/#Standard-Numeric-Types-1",
    "page": "Numbers",
    "title": "Standard Numeric Types",
    "category": "section",
    "text": ""
},

{
    "location": "base/numbers/#Core.Number",
    "page": "Numbers",
    "title": "Core.Number",
    "category": "type",
    "text": "Number\n\nAbstract supertype for all number types.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Real",
    "page": "Numbers",
    "title": "Core.Real",
    "category": "type",
    "text": "Real <: Number\n\nAbstract supertype for all real numbers.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.AbstractFloat",
    "page": "Numbers",
    "title": "Core.AbstractFloat",
    "category": "type",
    "text": "AbstractFloat <: Real\n\nAbstract supertype for all floating point numbers.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Integer",
    "page": "Numbers",
    "title": "Core.Integer",
    "category": "type",
    "text": "Integer <: Real\n\nAbstract supertype for all integers.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Signed",
    "page": "Numbers",
    "title": "Core.Signed",
    "category": "type",
    "text": "Signed <: Integer\n\nAbstract supertype for all signed integers.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Unsigned",
    "page": "Numbers",
    "title": "Core.Unsigned",
    "category": "type",
    "text": "Unsigned <: Integer\n\nAbstract supertype for all unsigned integers.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.AbstractIrrational",
    "page": "Numbers",
    "title": "Base.AbstractIrrational",
    "category": "type",
    "text": "AbstractIrrational <: Real\n\nNumber type representing an exact irrational value.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Abstract-number-types-1",
    "page": "Numbers",
    "title": "Abstract number types",
    "category": "section",
    "text": "Core.Number\nCore.Real\nCore.AbstractFloat\nCore.Integer\nCore.Signed\nCore.Unsigned\nBase.AbstractIrrational"
},

{
    "location": "base/numbers/#Core.Float16",
    "page": "Numbers",
    "title": "Core.Float16",
    "category": "type",
    "text": "Float16 <: AbstractFloat\n\n16-bit floating point number type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Float32",
    "page": "Numbers",
    "title": "Core.Float32",
    "category": "type",
    "text": "Float32 <: AbstractFloat\n\n32-bit floating point number type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Float64",
    "page": "Numbers",
    "title": "Core.Float64",
    "category": "type",
    "text": "Float64 <: AbstractFloat\n\n64-bit floating point number type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.MPFR.BigFloat",
    "page": "Numbers",
    "title": "Base.MPFR.BigFloat",
    "category": "type",
    "text": "BigFloat <: AbstractFloat\n\nArbitrary precision floating point number type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Bool",
    "page": "Numbers",
    "title": "Core.Bool",
    "category": "type",
    "text": "Bool <: Integer\n\nBoolean type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Int8",
    "page": "Numbers",
    "title": "Core.Int8",
    "category": "type",
    "text": "Int8 <: Signed\n\n8-bit signed integer type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.UInt8",
    "page": "Numbers",
    "title": "Core.UInt8",
    "category": "type",
    "text": "UInt8 <: Unsigned\n\n8-bit unsigned integer type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Int16",
    "page": "Numbers",
    "title": "Core.Int16",
    "category": "type",
    "text": "Int16 <: Signed\n\n16-bit signed integer type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.UInt16",
    "page": "Numbers",
    "title": "Core.UInt16",
    "category": "type",
    "text": "UInt16 <: Unsigned\n\n16-bit unsigned integer type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Int32",
    "page": "Numbers",
    "title": "Core.Int32",
    "category": "type",
    "text": "Int32 <: Signed\n\n32-bit signed integer type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.UInt32",
    "page": "Numbers",
    "title": "Core.UInt32",
    "category": "type",
    "text": "UInt32 <: Unsigned\n\n32-bit unsigned integer type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Int64",
    "page": "Numbers",
    "title": "Core.Int64",
    "category": "type",
    "text": "Int64 <: Signed\n\n64-bit signed integer type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.UInt64",
    "page": "Numbers",
    "title": "Core.UInt64",
    "category": "type",
    "text": "UInt64 <: Unsigned\n\n64-bit unsigned integer type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Int128",
    "page": "Numbers",
    "title": "Core.Int128",
    "category": "type",
    "text": "Int128 <: Signed\n\n128-bit signed integer type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.UInt128",
    "page": "Numbers",
    "title": "Core.UInt128",
    "category": "type",
    "text": "UInt128 <: Unsigned\n\n128-bit unsigned integer type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.GMP.BigInt",
    "page": "Numbers",
    "title": "Base.GMP.BigInt",
    "category": "type",
    "text": "BigInt <: Signed\n\nArbitrary precision integer type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.Complex",
    "page": "Numbers",
    "title": "Base.Complex",
    "category": "type",
    "text": "Complex{T<:Real} <: Number\n\nComplex number type with real and imaginary part of type T.\n\nComplexF16, ComplexF32 and ComplexF64 are aliases for Complex{Float16}, Complex{Float32} and Complex{Float64} respectively.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.Rational",
    "page": "Numbers",
    "title": "Base.Rational",
    "category": "type",
    "text": "Rational{T<:Integer} <: Real\n\nRational number type, with numerator and denominator of type T.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.Irrational",
    "page": "Numbers",
    "title": "Base.Irrational",
    "category": "type",
    "text": "Irrational{sym} <: AbstractIrrational\n\nNumber type representing an exact irrational value denoted by the symbol sym.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Concrete-number-types-1",
    "page": "Numbers",
    "title": "Concrete number types",
    "category": "section",
    "text": "Core.Float16\nCore.Float32\nCore.Float64\nBase.BigFloat\nCore.Bool\nCore.Int8\nCore.UInt8\nCore.Int16\nCore.UInt16\nCore.Int32\nCore.UInt32\nCore.Int64\nCore.UInt64\nCore.Int128\nCore.UInt128\nBase.BigInt\nBase.Complex\nBase.Rational\nBase.Irrational"
},

{
    "location": "base/numbers/#Base.digits",
    "page": "Numbers",
    "title": "Base.digits",
    "category": "function",
    "text": "digits([T<:Integer], n::Integer; base::T = 10, pad::Integer = 1)\n\nReturn an array with element type T (default Int) of the digits of n in the given base, optionally padded with zeros to a specified size. More significant digits are at higher indices, such that n == sum([digits[k]*base^(k-1) for k=1:length(digits)]).\n\nExamples\n\njulia> digits(10, base = 10)\n2-element Array{Int64,1}:\n 0\n 1\n\njulia> digits(10, base = 2)\n4-element Array{Int64,1}:\n 0\n 1\n 0\n 1\n\njulia> digits(10, base = 2, pad = 6)\n6-element Array{Int64,1}:\n 0\n 1\n 0\n 1\n 0\n 0\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.digits!",
    "page": "Numbers",
    "title": "Base.digits!",
    "category": "function",
    "text": "digits!(array, n::Integer; base::Integer = 10)\n\nFills an array of the digits of n in the given base. More significant digits are at higher indices. If the array length is insufficient, the least significant digits are filled up to the array length. If the array length is excessive, the excess portion is filled with zeros.\n\nExamples\n\njulia> digits!([2,2,2,2], 10, base = 2)\n4-element Array{Int64,1}:\n 0\n 1\n 0\n 1\n\njulia> digits!([2,2,2,2,2,2], 10, base = 2)\n6-element Array{Int64,1}:\n 0\n 1\n 0\n 1\n 0\n 0\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.bitstring",
    "page": "Numbers",
    "title": "Base.bitstring",
    "category": "function",
    "text": "bitstring(n)\n\nA string giving the literal bit representation of a number.\n\nExamples\n\njulia> bitstring(4)\n\"0000000000000000000000000000000000000000000000000000000000000100\"\n\njulia> bitstring(2.2)\n\"0100000000000001100110011001100110011001100110011001100110011010\"\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.parse",
    "page": "Numbers",
    "title": "Base.parse",
    "category": "function",
    "text": "parse(type, str; base)\n\nParse a string as a number. For Integer types, a base can be specified (the default is 10). For floating-point types, the string is parsed as a decimal floating-point number.  Complex types are parsed from decimal strings of the form \"R±Iim\" as a Complex(R,I) of the requested type; \"i\" or \"j\" can also be used instead of \"im\", and \"R\" or \"Iim\" are also permitted. If the string does not contain a valid number, an error is raised.\n\nExamples\n\njulia> parse(Int, \"1234\")\n1234\n\njulia> parse(Int, \"1234\", base = 5)\n194\n\njulia> parse(Int, \"afc\", base = 16)\n2812\n\njulia> parse(Float64, \"1.2e-3\")\n0.0012\n\njulia> parse(Complex{Float64}, \"3.2e-1 + 4.5im\")\n0.32 + 4.5im\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.tryparse",
    "page": "Numbers",
    "title": "Base.tryparse",
    "category": "function",
    "text": "tryparse(type, str; base)\n\nLike parse, but returns either a value of the requested type, or nothing if the string does not contain a valid number.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.big",
    "page": "Numbers",
    "title": "Base.big",
    "category": "function",
    "text": "big(x)\n\nConvert a number to a maximum precision representation (typically BigInt or BigFloat). See BigFloat for information about some pitfalls with floating-point numbers.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.signed",
    "page": "Numbers",
    "title": "Base.signed",
    "category": "function",
    "text": "signed(x)\n\nConvert a number to a signed integer. If the argument is unsigned, it is reinterpreted as signed without checking for overflow.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.unsigned",
    "page": "Numbers",
    "title": "Base.unsigned",
    "category": "function",
    "text": "unsigned(x) -> Unsigned\n\nConvert a number to an unsigned integer. If the argument is signed, it is reinterpreted as unsigned without checking for negative values.\n\nExamples\n\njulia> unsigned(-2)\n0xfffffffffffffffe\n\njulia> unsigned(2)\n0x0000000000000002\n\njulia> signed(unsigned(-2))\n-2\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.float-Tuple{Any}",
    "page": "Numbers",
    "title": "Base.float",
    "category": "method",
    "text": "float(x)\n\nConvert a number or array to a floating point data type.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.Math.significand",
    "page": "Numbers",
    "title": "Base.Math.significand",
    "category": "function",
    "text": "significand(x)\n\nExtract the significand(s) (a.k.a. mantissa), in binary representation, of a floating-point number. If x is a non-zero finite number, then the result will be a number of the same type on the interval 12). Otherwise x is returned.\n\nExamples\n\njulia> significand(15.2)/15.2\n0.125\n\njulia> significand(15.2)*8\n15.2\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.Math.exponent",
    "page": "Numbers",
    "title": "Base.Math.exponent",
    "category": "function",
    "text": "exponent(x) -> Int\n\nGet the exponent of a normalized floating-point number.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.complex-Tuple{Complex}",
    "page": "Numbers",
    "title": "Base.complex",
    "category": "method",
    "text": "complex(r, [i])\n\nConvert real numbers or arrays to complex. i defaults to zero.\n\nExamples\n\njulia> complex(7)\n7 + 0im\n\njulia> complex([1, 2, 3])\n3-element Array{Complex{Int64},1}:\n 1 + 0im\n 2 + 0im\n 3 + 0im\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.bswap",
    "page": "Numbers",
    "title": "Base.bswap",
    "category": "function",
    "text": "bswap(n)\n\nReverse the byte order of n.\n\nExamples\n\njulia> a = bswap(0x10203040)\n0x40302010\n\njulia> bswap(a)\n0x10203040\n\njulia> string(1, base = 2)\n\"1\"\n\njulia> string(bswap(1), base = 2)\n\"100000000000000000000000000000000000000000000000000000000\"\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.hex2bytes",
    "page": "Numbers",
    "title": "Base.hex2bytes",
    "category": "function",
    "text": "hex2bytes(s::Union{AbstractString,AbstractVector{UInt8}})\n\nGiven a string or array s of ASCII codes for a sequence of hexadecimal digits, returns a Vector{UInt8} of bytes  corresponding to the binary representation: each successive pair of hexadecimal digits in s gives the value of one byte in the return vector.\n\nThe length of s must be even, and the returned array has half of the length of s. See also hex2bytes! for an in-place version, and bytes2hex for the inverse.\n\nExamples\n\njulia> s = string(12345, base = 16)\n\"3039\"\n\njulia> hex2bytes(s)\n2-element Array{UInt8,1}:\n 0x30\n 0x39\n\njulia> a = b\"01abEF\"\n6-element Base.CodeUnits{UInt8,String}:\n 0x30\n 0x31\n 0x61\n 0x62\n 0x45\n 0x46\n\njulia> hex2bytes(a)\n3-element Array{UInt8,1}:\n 0x01\n 0xab\n 0xef\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.hex2bytes!",
    "page": "Numbers",
    "title": "Base.hex2bytes!",
    "category": "function",
    "text": "hex2bytes!(d::AbstractVector{UInt8}, s::Union{String,AbstractVector{UInt8}})\n\nConvert an array s of bytes representing a hexadecimal string to its binary representation, similar to hex2bytes except that the output is written in-place in d.   The length of s must be exactly twice the length of d.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.bytes2hex",
    "page": "Numbers",
    "title": "Base.bytes2hex",
    "category": "function",
    "text": "bytes2hex(a::AbstractArray{UInt8}) -> String\nbytes2hex(io::IO, a::AbstractArray{UInt8})\n\nConvert an array a of bytes to its hexadecimal string representation, either returning a String via bytes2hex(a) or writing the string to an io stream via bytes2hex(io, a).  The hexadecimal characters are all lowercase.\n\nExamples\n\njulia> a = string(12345, base = 16)\n\"3039\"\n\njulia> b = hex2bytes(a)\n2-element Array{UInt8,1}:\n 0x30\n 0x39\n\njulia> bytes2hex(b)\n\"3039\"\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Data-Formats-1",
    "page": "Numbers",
    "title": "Data Formats",
    "category": "section",
    "text": "Base.digits\nBase.digits!\nBase.bitstring\nBase.parse\nBase.tryparse\nBase.big\nBase.signed\nBase.unsigned\nBase.float(::Any)\nBase.Math.significand\nBase.Math.exponent\nBase.complex(::Complex)\nBase.bswap\nBase.hex2bytes\nBase.hex2bytes!\nBase.bytes2hex"
},

{
    "location": "base/numbers/#Base.one",
    "page": "Numbers",
    "title": "Base.one",
    "category": "function",
    "text": "one(x)\none(T::type)\n\nReturn a multiplicative identity for x: a value such that one(x)*x == x*one(x) == x.  Alternatively one(T) can take a type T, in which case one returns a multiplicative identity for any x of type T.\n\nIf possible, one(x) returns a value of the same type as x, and one(T) returns a value of type T.  However, this may not be the case for types representing dimensionful quantities (e.g. time in days), since the multiplicative identity must be dimensionless.  In that case, one(x) should return an identity value of the same precision (and shape, for matrices) as x.\n\nIf you want a quantity that is of the same type as x, or of type T, even if x is dimensionful, use oneunit instead.\n\nExamples\n\njulia> one(3.7)\n1.0\n\njulia> one(Int)\n1\n\njulia> import Dates; one(Dates.Day(1))\n1\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.oneunit",
    "page": "Numbers",
    "title": "Base.oneunit",
    "category": "function",
    "text": "oneunit(x::T)\noneunit(T::Type)\n\nReturns T(one(x)), where T is either the type of the argument or (if a type is passed) the argument.  This differs from one for dimensionful quantities: one is dimensionless (a multiplicative identity) while oneunit is dimensionful (of the same type as x, or of type T).\n\nExamples\n\njulia> oneunit(3.7)\n1.0\n\njulia> import Dates; oneunit(Dates.Day)\n1 day\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.zero",
    "page": "Numbers",
    "title": "Base.zero",
    "category": "function",
    "text": "zero(x)\n\nGet the additive identity element for the type of x (x can also specify the type itself).\n\nExamples\n\njulia> zero(1)\n0\n\njulia> zero(big\"2.0\")\n0.0\n\njulia> zero(rand(2,2))\n2×2 Array{Float64,2}:\n 0.0  0.0\n 0.0  0.0\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.im",
    "page": "Numbers",
    "title": "Base.im",
    "category": "constant",
    "text": "im\n\nThe imaginary unit.\n\nExamples\n\njulia> im * im\n-1 + 0im\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.MathConstants.pi",
    "page": "Numbers",
    "title": "Base.MathConstants.pi",
    "category": "constant",
    "text": "π\npi\n\nThe constant pi.\n\nExamples\n\njulia> pi\nπ = 3.1415926535897...\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.MathConstants.ℯ",
    "page": "Numbers",
    "title": "Base.MathConstants.ℯ",
    "category": "constant",
    "text": "ℯ\ne\n\nThe constant ℯ.\n\nExamples\n\njulia> ℯ\nℯ = 2.7182818284590...\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.MathConstants.catalan",
    "page": "Numbers",
    "title": "Base.MathConstants.catalan",
    "category": "constant",
    "text": "catalan\n\nCatalan\'s constant.\n\nExamples\n\njulia> Base.MathConstants.catalan\ncatalan = 0.9159655941772...\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.MathConstants.eulergamma",
    "page": "Numbers",
    "title": "Base.MathConstants.eulergamma",
    "category": "constant",
    "text": "γ\neulergamma\n\nEuler\'s constant.\n\nExamples\n\njulia> Base.MathConstants.eulergamma\nγ = 0.5772156649015...\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.MathConstants.golden",
    "page": "Numbers",
    "title": "Base.MathConstants.golden",
    "category": "constant",
    "text": "φ\ngolden\n\nThe golden ratio.\n\nExamples\n\njulia> Base.MathConstants.golden\nφ = 1.6180339887498...\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.Inf",
    "page": "Numbers",
    "title": "Base.Inf",
    "category": "constant",
    "text": "Inf, Inf64\n\nPositive infinity of type Float64.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.Inf32",
    "page": "Numbers",
    "title": "Base.Inf32",
    "category": "constant",
    "text": "Inf32\n\nPositive infinity of type Float32.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.Inf16",
    "page": "Numbers",
    "title": "Base.Inf16",
    "category": "constant",
    "text": "Inf16\n\nPositive infinity of type Float16.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.NaN",
    "page": "Numbers",
    "title": "Base.NaN",
    "category": "constant",
    "text": "NaN, NaN64\n\nA not-a-number value of type Float64.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.NaN32",
    "page": "Numbers",
    "title": "Base.NaN32",
    "category": "constant",
    "text": "NaN32\n\nA not-a-number value of type Float32.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.NaN16",
    "page": "Numbers",
    "title": "Base.NaN16",
    "category": "constant",
    "text": "NaN16\n\nA not-a-number value of type Float16.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.issubnormal",
    "page": "Numbers",
    "title": "Base.issubnormal",
    "category": "function",
    "text": "issubnormal(f) -> Bool\n\nTest whether a floating point number is subnormal.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.isfinite",
    "page": "Numbers",
    "title": "Base.isfinite",
    "category": "function",
    "text": "isfinite(f) -> Bool\n\nTest whether a number is finite.\n\nExamples\n\njulia> isfinite(5)\ntrue\n\njulia> isfinite(NaN32)\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.isinf",
    "page": "Numbers",
    "title": "Base.isinf",
    "category": "function",
    "text": "isinf(f) -> Bool\n\nTest whether a number is infinite.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.isnan",
    "page": "Numbers",
    "title": "Base.isnan",
    "category": "function",
    "text": "isnan(f) -> Bool\n\nTest whether a floating point number is not a number (NaN).\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.iszero",
    "page": "Numbers",
    "title": "Base.iszero",
    "category": "function",
    "text": "iszero(x)\n\nReturn true if x == zero(x); if x is an array, this checks whether all of the elements of x are zero.\n\nExamples\n\njulia> iszero(0.0)\ntrue\n\njulia> iszero([1, 9, 0])\nfalse\n\njulia> iszero([false, 0, 0])\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.isone",
    "page": "Numbers",
    "title": "Base.isone",
    "category": "function",
    "text": "isone(x)\n\nReturn true if x == one(x); if x is an array, this checks whether x is an identity matrix.\n\nExamples\n\njulia> isone(1.0)\ntrue\n\njulia> isone([1 0; 0 2])\nfalse\n\njulia> isone([1 0; 0 true])\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.nextfloat",
    "page": "Numbers",
    "title": "Base.nextfloat",
    "category": "function",
    "text": "nextfloat(x::IEEEFloat, n::Integer)\n\nThe result of n iterative applications of nextfloat to x if n >= 0, or -n applications of prevfloat if n < 0.\n\n\n\n\n\nnextfloat(x::AbstractFloat)\n\nReturn the smallest floating point number y of the same type as x such x < y. If no such y exists (e.g. if x is Inf or NaN), then return x.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.prevfloat",
    "page": "Numbers",
    "title": "Base.prevfloat",
    "category": "function",
    "text": "prevfloat(x::AbstractFloat, n::Integer)\n\nThe result of n iterative applications of prevfloat to x if n >= 0, or -n applications of nextfloat if n < 0.\n\n\n\n\n\nprevfloat(x::AbstractFloat)\n\nReturn the largest floating point number y of the same type as x such y < x. If no such y exists (e.g. if x is -Inf or NaN), then return x.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.isinteger",
    "page": "Numbers",
    "title": "Base.isinteger",
    "category": "function",
    "text": "isinteger(x) -> Bool\n\nTest whether x is numerically equal to some integer.\n\nExamples\n\njulia> isinteger(4.0)\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.isreal",
    "page": "Numbers",
    "title": "Base.isreal",
    "category": "function",
    "text": "isreal(x) -> Bool\n\nTest whether x or all its elements are numerically equal to some real number including infinities and NaNs. isreal(x) is true if isequal(x, real(x)) is true.\n\nExamples\n\njulia> isreal(5.)\ntrue\n\njulia> isreal(Inf + 0im)\ntrue\n\njulia> isreal([4.; complex(0,1)])\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Float32-Tuple{Any}",
    "page": "Numbers",
    "title": "Core.Float32",
    "category": "method",
    "text": "Float32(x [, mode::RoundingMode])\n\nCreate a Float32 from x. If x is not exactly representable then mode determines how x is rounded.\n\nExamples\n\njulia> Float32(1/3, RoundDown)\n0.3333333f0\n\njulia> Float32(1/3, RoundUp)\n0.33333334f0\n\nSee RoundingMode for available rounding modes.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Core.Float64-Tuple{Any}",
    "page": "Numbers",
    "title": "Core.Float64",
    "category": "method",
    "text": "Float64(x [, mode::RoundingMode])\n\nCreate a Float64 from x. If x is not exactly representable then mode determines how x is rounded.\n\nExamples\n\njulia> Float64(pi, RoundDown)\n3.141592653589793\n\njulia> Float64(pi, RoundUp)\n3.1415926535897936\n\nSee RoundingMode for available rounding modes.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.GMP.BigInt-Tuple{Any}",
    "page": "Numbers",
    "title": "Base.GMP.BigInt",
    "category": "method",
    "text": "BigInt(x)\n\nCreate an arbitrary precision integer. x may be an Int (or anything that can be converted to an Int). The usual mathematical operators are defined for this type, and results are promoted to a BigInt.\n\nInstances can be constructed from strings via parse, or using the big string literal.\n\nExamples\n\njulia> parse(BigInt, \"42\")\n42\n\njulia> big\"313\"\n313\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.MPFR.BigFloat-Tuple{Any}",
    "page": "Numbers",
    "title": "Base.MPFR.BigFloat",
    "category": "method",
    "text": "BigFloat(x)\n\nCreate an arbitrary precision floating point number. x may be an Integer, a Float64 or a BigInt. The usual mathematical operators are defined for this type, and results are promoted to a BigFloat.\n\nNote that because decimal literals are converted to floating point numbers when parsed, BigFloat(2.1) may not yield what you expect. You may instead prefer to initialize constants from strings via parse, or using the big string literal.\n\njulia> BigFloat(2.1)\n2.100000000000000088817841970012523233890533447265625\n\njulia> big\"2.1\"\n2.099999999999999999999999999999999999999999999999999999999999999999999999999986\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.Rounding.rounding",
    "page": "Numbers",
    "title": "Base.Rounding.rounding",
    "category": "function",
    "text": "rounding(T)\n\nGet the current floating point rounding mode for type T, controlling the rounding of basic arithmetic functions (+, -, *, / and sqrt) and type conversion.\n\nSee RoundingMode for available modes.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.Rounding.setrounding-Tuple{Type,Any}",
    "page": "Numbers",
    "title": "Base.Rounding.setrounding",
    "category": "method",
    "text": "setrounding(T, mode)\n\nSet the rounding mode of floating point type T, controlling the rounding of basic arithmetic functions (+, -, *, / and sqrt) and type conversion. Other numerical functions may give incorrect or invalid values when using rounding modes other than the default RoundNearest.\n\nNote that this is currently only supported for T == BigFloat.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.Rounding.setrounding-Tuple{Function,Type,RoundingMode}",
    "page": "Numbers",
    "title": "Base.Rounding.setrounding",
    "category": "method",
    "text": "setrounding(f::Function, T, mode)\n\nChange the rounding mode of floating point type T for the duration of f. It is logically equivalent to:\n\nold = rounding(T)\nsetrounding(T, mode)\nf()\nsetrounding(T, old)\n\nSee RoundingMode for available rounding modes.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.Rounding.get_zero_subnormals",
    "page": "Numbers",
    "title": "Base.Rounding.get_zero_subnormals",
    "category": "function",
    "text": "get_zero_subnormals() -> Bool\n\nReturns false if operations on subnormal floating-point values (\"denormals\") obey rules for IEEE arithmetic, and true if they might be converted to zeros.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.Rounding.set_zero_subnormals",
    "page": "Numbers",
    "title": "Base.Rounding.set_zero_subnormals",
    "category": "function",
    "text": "set_zero_subnormals(yes::Bool) -> Bool\n\nIf yes is false, subsequent floating-point operations follow rules for IEEE arithmetic on subnormal values (\"denormals\"). Otherwise, floating-point operations are permitted (but not required) to convert subnormal inputs or outputs to zero. Returns true unless yes==true but the hardware does not support zeroing of subnormal numbers.\n\nset_zero_subnormals(true) can speed up some computations on some hardware. However, it can break identities such as (x-y==0) == (x==y).\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#General-Number-Functions-and-Constants-1",
    "page": "Numbers",
    "title": "General Number Functions and Constants",
    "category": "section",
    "text": "Base.one\nBase.oneunit\nBase.zero\nBase.im\nBase.MathConstants.pi\nBase.MathConstants.ℯ\nBase.MathConstants.catalan\nBase.MathConstants.eulergamma\nBase.MathConstants.golden\nBase.Inf\nBase.Inf32\nBase.Inf16\nBase.NaN\nBase.NaN32\nBase.NaN16\nBase.issubnormal\nBase.isfinite\nBase.isinf\nBase.isnan\nBase.iszero\nBase.isone\nBase.nextfloat\nBase.prevfloat\nBase.isinteger\nBase.isreal\nCore.Float32(::Any)\nCore.Float64(::Any)\nBase.GMP.BigInt(::Any)\nBase.MPFR.BigFloat(::Any)\nBase.Rounding.rounding\nBase.Rounding.setrounding(::Type, ::Any)\nBase.Rounding.setrounding(::Function, ::Type, ::RoundingMode)\nBase.Rounding.get_zero_subnormals\nBase.Rounding.set_zero_subnormals"
},

{
    "location": "base/numbers/#Base.count_ones",
    "page": "Numbers",
    "title": "Base.count_ones",
    "category": "function",
    "text": "count_ones(x::Integer) -> Integer\n\nNumber of ones in the binary representation of x.\n\nExamples\n\njulia> count_ones(7)\n3\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.count_zeros",
    "page": "Numbers",
    "title": "Base.count_zeros",
    "category": "function",
    "text": "count_zeros(x::Integer) -> Integer\n\nNumber of zeros in the binary representation of x.\n\nExamples\n\njulia> count_zeros(Int32(2 ^ 16 - 1))\n16\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.leading_zeros",
    "page": "Numbers",
    "title": "Base.leading_zeros",
    "category": "function",
    "text": "leading_zeros(x::Integer) -> Integer\n\nNumber of zeros leading the binary representation of x.\n\nExamples\n\njulia> leading_zeros(Int32(1))\n31\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.leading_ones",
    "page": "Numbers",
    "title": "Base.leading_ones",
    "category": "function",
    "text": "leading_ones(x::Integer) -> Integer\n\nNumber of ones leading the binary representation of x.\n\nExamples\n\njulia> leading_ones(UInt32(2 ^ 32 - 2))\n31\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.trailing_zeros",
    "page": "Numbers",
    "title": "Base.trailing_zeros",
    "category": "function",
    "text": "trailing_zeros(x::Integer) -> Integer\n\nNumber of zeros trailing the binary representation of x.\n\nExamples\n\njulia> trailing_zeros(2)\n1\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.trailing_ones",
    "page": "Numbers",
    "title": "Base.trailing_ones",
    "category": "function",
    "text": "trailing_ones(x::Integer) -> Integer\n\nNumber of ones trailing the binary representation of x.\n\nExamples\n\njulia> trailing_ones(3)\n2\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.isodd",
    "page": "Numbers",
    "title": "Base.isodd",
    "category": "function",
    "text": "isodd(x::Integer) -> Bool\n\nReturn true if x is odd (that is, not divisible by 2), and false otherwise.\n\nExamples\n\njulia> isodd(9)\ntrue\n\njulia> isodd(10)\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.iseven",
    "page": "Numbers",
    "title": "Base.iseven",
    "category": "function",
    "text": "iseven(x::Integer) -> Bool\n\nReturn true is x is even (that is, divisible by 2), and false otherwise.\n\nExamples\n\njulia> iseven(9)\nfalse\n\njulia> iseven(10)\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Integers-1",
    "page": "Numbers",
    "title": "Integers",
    "category": "section",
    "text": "Base.count_ones\nBase.count_zeros\nBase.leading_zeros\nBase.leading_ones\nBase.trailing_zeros\nBase.trailing_ones\nBase.isodd\nBase.iseven"
},

{
    "location": "base/numbers/#Base.precision",
    "page": "Numbers",
    "title": "Base.precision",
    "category": "function",
    "text": "precision(num::AbstractFloat)\n\nGet the precision of a floating point number, as defined by the effective number of bits in the mantissa.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.precision-Tuple{Type{BigFloat}}",
    "page": "Numbers",
    "title": "Base.precision",
    "category": "method",
    "text": "precision(BigFloat)\n\nGet the precision (in bits) currently used for BigFloat arithmetic.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.MPFR.setprecision",
    "page": "Numbers",
    "title": "Base.MPFR.setprecision",
    "category": "function",
    "text": "setprecision([T=BigFloat,] precision::Int)\n\nSet the precision (in bits) to be used for T arithmetic.\n\n\n\n\n\nsetprecision(f::Function, [T=BigFloat,] precision::Integer)\n\nChange the T arithmetic precision (in bits) for the duration of f. It is logically equivalent to:\n\nold = precision(BigFloat)\nsetprecision(BigFloat, precision)\nf()\nsetprecision(BigFloat, old)\n\nOften used as setprecision(T, precision) do ... end\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.MPFR.BigFloat-Tuple{Any,Int64}",
    "page": "Numbers",
    "title": "Base.MPFR.BigFloat",
    "category": "method",
    "text": "BigFloat(x, prec::Int)\n\nCreate a representation of x as a BigFloat with precision prec.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.MPFR.BigFloat-Tuple{Union{AbstractFloat, Integer, String},RoundingMode}",
    "page": "Numbers",
    "title": "Base.MPFR.BigFloat",
    "category": "method",
    "text": "BigFloat(x, rounding::RoundingMode)\n\nCreate a representation of x as a BigFloat with the current global precision and rounding mode rounding.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.MPFR.BigFloat-Tuple{Any,Int64,RoundingMode}",
    "page": "Numbers",
    "title": "Base.MPFR.BigFloat",
    "category": "method",
    "text": "BigFloat(x, prec::Int, rounding::RoundingMode)\n\nCreate a representation of x as a BigFloat with precision prec and rounding mode rounding.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#Base.MPFR.BigFloat-Tuple{String}",
    "page": "Numbers",
    "title": "Base.MPFR.BigFloat",
    "category": "method",
    "text": "BigFloat(x::String)\n\nCreate a representation of the string x as a BigFloat.\n\n\n\n\n\n"
},

{
    "location": "base/numbers/#BigFloats-1",
    "page": "Numbers",
    "title": "BigFloats",
    "category": "section",
    "text": "The BigFloat type implements arbitrary-precision floating-point arithmetic using the GNU MPFR library.Base.precision\nBase.MPFR.precision(::Type{BigFloat})\nBase.MPFR.setprecision\nBase.MPFR.BigFloat(x, prec::Int)\nBigFloat(x::Union{Integer, AbstractFloat, String}, rounding::RoundingMode)\nBase.MPFR.BigFloat(x, prec::Int, rounding::RoundingMode)\nBase.MPFR.BigFloat(x::String)"
},

{
    "location": "base/strings/#",
    "page": "Strings",
    "title": "Strings",
    "category": "page",
    "text": ""
},

{
    "location": "base/strings/#Core.AbstractChar",
    "page": "Strings",
    "title": "Core.AbstractChar",
    "category": "type",
    "text": "The AbstractChar type is the supertype of all character implementations in Julia.   A character represents a Unicode code point, and can be converted to an integer via the codepoint function in order to obtain the numerical value of the code point, or constructed from the same integer. These numerical values determine how characters are compared with < and ==, for example.  New T <: AbstractChar types should define a codepoint(::T) method and a T(::UInt32) constructor, at minimum.\n\nA given AbstractChar subtype may be capable of representing only a subset of Unicode, in which case conversion from an unsupported UInt32 value may throw an error.  Conversely, the built-in Char type represents a superset of Unicode (in order to losslessly encode invalid byte streams), in which case conversion of a non-Unicode value to UInt32 throws an error. The isvalid function can be used to check which codepoints are representable in a given AbstractChar type.\n\nInternally, an AbstractChar type may use a variety of encodings.  Conversion via codepoint(char) will not reveal this encoding because it always returns the Unicode value of the character. print(io, c) of any c::AbstractChar produces an encoding determined by io (UTF-8 for all built-in IO types), via conversion to Char if necessary.\n\nwrite(io, c), in contrast, may emit an encoding depending on typeof(c), and read(io, typeof(c)) should read the same encoding as write. New AbstractChar types must provide their own implementations of write and read.\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Core.Char",
    "page": "Strings",
    "title": "Core.Char",
    "category": "type",
    "text": "Char(c::Union{Number,AbstractChar})\n\nChar is a 32-bit AbstractChar type that is the default representation of characters in Julia.  Char is the type used for character literals like \'x\' and it is also the element type of String.\n\nIn order to losslessly represent arbitrary byte streams stored in a String, a Char value may store information that cannot be converted to a Unicode codepoint — converting such a Char to UInt32 will throw an error. The isvalid(c::Char) function can be used to query whether c represents a valid Unicode character.\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.codepoint",
    "page": "Strings",
    "title": "Base.codepoint",
    "category": "function",
    "text": "codepoint(c::AbstractChar)\n\nReturn the Unicode codepoint (an unsigned integer) corresponding to the character c (or throw an exception if c does not represent a valid character).   For Char, this is a UInt32 value, but AbstractChar types that represent only a subset of Unicode may return a different-sized integer (e.g. UInt8).\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.length-Tuple{AbstractString}",
    "page": "Strings",
    "title": "Base.length",
    "category": "method",
    "text": "length(s::AbstractString) -> Int\nlength(s::AbstractString, i::Integer, j::Integer) -> Int\n\nThe number of characters in string s from indices i through j. This is computed as the number of code unit indices from i to j which are valid character indices. Without only a single string argument, this computes the number of characters in the entire string. With i and j arguments it computes the number of indices between i and j inclusive that are valid indices in the string s. In addition to in-bounds values, i may take the out-of-bounds value ncodeunits(s) + 1 and j may take the out-of-bounds value 0.\n\nSee also: isvalid, ncodeunits, lastindex, thisind, nextind, prevind\n\nExamples\n\njulia> length(\"jμΛIα\")\n5\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.sizeof-Tuple{AbstractString}",
    "page": "Strings",
    "title": "Base.sizeof",
    "category": "method",
    "text": "sizeof(str::AbstractString)\n\nSize, in bytes, of the string s. Equal to the number of code units in s multiplied by the size, in bytes, of one code unit in s.\n\nExamples\n\njulia> sizeof(\"\")\n0\n\njulia> sizeof(\"∀\")\n3\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.:*-Tuple{Union{AbstractChar, AbstractString},Vararg{Union{AbstractChar, AbstractString},N} where N}",
    "page": "Strings",
    "title": "Base.:*",
    "category": "method",
    "text": "*(s::Union{AbstractString, AbstractChar}, t::Union{AbstractString, AbstractChar}...) -> AbstractString\n\nConcatenate strings and/or characters, producing a String. This is equivalent to calling the string function on the arguments. Concatenation of built-in string types always produces a value of type String but other string types may choose to return a string of a different type as appropriate.\n\nExamples\n\njulia> \"Hello \" * \"world\"\n\"Hello world\"\n\njulia> \'j\' * \"ulia\"\n\"julia\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.:^-Tuple{AbstractString,Integer}",
    "page": "Strings",
    "title": "Base.:^",
    "category": "method",
    "text": "^(s::Union{AbstractString,AbstractChar}, n::Integer)\n\nRepeat a string or character n times. This can also be written as repeat(s, n).\n\nSee also: repeat\n\nExamples\n\njulia> \"Test \"^3\n\"Test Test Test \"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.string",
    "page": "Strings",
    "title": "Base.string",
    "category": "function",
    "text": "string(n::Integer; base::Integer = 10, pad::Integer = 1)\n\nConvert an integer n to a string in the given base, optionally specifying a number of digits to pad to.\n\njulia> string(5, base = 13, pad = 4)\n\"0005\"\n\njulia> string(13, base = 5, pad = 4)\n\"0023\"\n\n\n\n\n\nstring(xs...)\n\nCreate a string from any values using the print function.\n\nExamples\n\njulia> string(\"a\", 1, true)\n\"a1true\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.repeat-Tuple{AbstractString,Integer}",
    "page": "Strings",
    "title": "Base.repeat",
    "category": "method",
    "text": "repeat(s::AbstractString, r::Integer)\n\nRepeat a string r times. This can be written as s^r.\n\nSee also: ^\n\nExamples\n\njulia> repeat(\"ha\", 3)\n\"hahaha\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.repeat-Tuple{AbstractChar,Integer}",
    "page": "Strings",
    "title": "Base.repeat",
    "category": "method",
    "text": "repeat(c::AbstractChar, r::Integer) -> String\n\nRepeat a character r times. This can equivalently be accomplished by calling c^r.\n\nExamples\n\njulia> repeat(\'A\', 3)\n\"AAA\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.repr-Tuple{Any}",
    "page": "Strings",
    "title": "Base.repr",
    "category": "method",
    "text": "repr(x; context=nothing)\n\nCreate a string from any value using the show function.\n\nThe optional keyword argument context can be set to an IO or IOContext object whose attributes are used for the I/O stream passed to show.\n\nNote that repr(x) is usually similar to how the value of x would be entered in Julia.  See also repr(MIME(\"text/plain\"), x) to instead return a \"pretty-printed\" version of x designed more for human consumption, equivalent to the REPL display of x.\n\nExamples\n\njulia> repr(1)\n\"1\"\n\njulia> repr(zeros(3))\n\"[0.0, 0.0, 0.0]\"\n\njulia> repr(big(1/3))\n\"3.33333333333333314829616256247390992939472198486328125e-01\"\n\njulia> repr(big(1/3), context=:compact => true)\n\"3.33333e-01\"\n\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Core.String-Tuple{AbstractString}",
    "page": "Strings",
    "title": "Core.String",
    "category": "method",
    "text": "String(s::AbstractString)\n\nConvert a string to a contiguous byte array representation encoded as UTF-8 bytes. This representation is often appropriate for passing strings to C.\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.SubString",
    "page": "Strings",
    "title": "Base.SubString",
    "category": "type",
    "text": "SubString(s::AbstractString, i::Integer, j::Integer=lastindex(s))\nSubString(s::AbstractString, r::UnitRange{<:Integer})\n\nLike getindex, but returns a view into the parent string s within range i:j or r respectively instead of making a copy.\n\nExamples\n\njulia> SubString(\"abc\", 1, 2)\n\"ab\"\n\njulia> SubString(\"abc\", 1:2)\n\"ab\"\n\njulia> SubString(\"abc\", 2)\n\"bc\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.transcode",
    "page": "Strings",
    "title": "Base.transcode",
    "category": "function",
    "text": "transcode(T, src)\n\nConvert string data between Unicode encodings. src is either a String or a Vector{UIntXX} of UTF-XX code units, where XX is 8, 16, or 32. T indicates the encoding of the return value: String to return a (UTF-8 encoded) String or UIntXX to return a Vector{UIntXX} of UTF-XX data.   (The alias Cwchar_t can also be used as the integer type, for converting wchar_t* strings used by external C libraries.)\n\nThe transcode function succeeds as long as the input data can be reasonably represented in the target encoding; it always succeeds for conversions between UTF-XX encodings, even for invalid Unicode data.\n\nOnly conversion to/from UTF-8 is currently supported.\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.unsafe_string",
    "page": "Strings",
    "title": "Base.unsafe_string",
    "category": "function",
    "text": "unsafe_string(p::Ptr{UInt8}, [length::Integer])\n\nCopy a string from the address of a C-style (NUL-terminated) string encoded as UTF-8. (The pointer can be safely freed afterwards.) If length is specified (the length of the data in bytes), the string does not have to be NUL-terminated.\n\nThis function is labeled \"unsafe\" because it will crash if p is not a valid memory address to data of the requested length.\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.ncodeunits-Tuple{AbstractString}",
    "page": "Strings",
    "title": "Base.ncodeunits",
    "category": "method",
    "text": "ncodeunits(s::AbstractString) -> Int\n\nReturn the number of code units in a string. Indices that are in bounds to access this string must satisfy 1 ≤ i ≤ ncodeunits(s). Not all such indices are valid – they may not be the start of a character, but they will return a code unit value when calling codeunit(s,i).\n\nSee also: codeunit, checkbounds, sizeof, length, lastindex\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.codeunit",
    "page": "Strings",
    "title": "Base.codeunit",
    "category": "function",
    "text": "codeunit(s::AbstractString) -> Type{<:Union{UInt8, UInt16, UInt32}}\n\nReturn the code unit type of the given string object. For ASCII, Latin-1, or UTF-8 encoded strings, this would be UInt8; for UCS-2 and UTF-16 it would be UInt16; for UTF-32 it would be UInt32. The unit code type need not be limited to these three types, but it\'s hard to think of widely used string encodings that don\'t use one of these units. codeunit(s) is the same as typeof(codeunit(s,1)) when s is a non-empty string.\n\nSee also: ncodeunits\n\n\n\n\n\ncodeunit(s::AbstractString, i::Integer) -> Union{UInt8, UInt16, UInt32}\n\nReturn the code unit value in the string s at index i. Note that\n\ncodeunit(s, i) :: codeunit(s)\n\nI.e. the value returned by codeunit(s, i) is of the type returned by codeunit(s).\n\nSee also: ncodeunits, checkbounds\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.codeunits",
    "page": "Strings",
    "title": "Base.codeunits",
    "category": "function",
    "text": "codeunits(s::AbstractString)\n\nObtain a vector-like object containing the code units of a string. Returns a CodeUnits wrapper by default, but codeunits may optionally be defined for new string types if necessary.\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.ascii",
    "page": "Strings",
    "title": "Base.ascii",
    "category": "function",
    "text": "ascii(s::AbstractString)\n\nConvert a string to String type and check that it contains only ASCII data, otherwise throwing an ArgumentError indicating the position of the first non-ASCII byte.\n\nExamples\n\njulia> ascii(\"abcdeγfgh\")\nERROR: ArgumentError: invalid ASCII at index 6 in \"abcdeγfgh\"\nStacktrace:\n[...]\n\njulia> ascii(\"abcdefgh\")\n\"abcdefgh\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.@r_str",
    "page": "Strings",
    "title": "Base.@r_str",
    "category": "macro",
    "text": "@r_str -> Regex\n\nConstruct a regex, such as r\"^[a-z]*$\", without interpolation and unescaping (except for quotation mark \" which still has to be escaped). The regex also accepts one or more flags, listed after the ending quote, to change its behaviour:\n\ni enables case-insensitive matching\nm treats the ^ and $ tokens as matching the start and end of individual lines, as opposed to the whole string.\ns allows the . modifier to match newlines.\nx enables \"comment mode\": whitespace is enabled except when escaped with \\, and # is treated as starting a comment.\na disables UCP mode (enables ASCII mode). By default \\B, \\b, \\D, \\d, \\S, \\s, \\W, \\w, etc. match based on Unicode character properties. With this option, these sequences only match ASCII characters.\n\nExamples\n\njulia> match(r\"a+.*b+.*?d$\"ism, \"Goodbye,\\nOh, angry,\\nBad world\\n\")\nRegexMatch(\"angry,\\nBad world\")\n\nThis regex has the first three flags enabled.\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.SubstitutionString",
    "page": "Strings",
    "title": "Base.SubstitutionString",
    "category": "type",
    "text": "SubstitutionString(substr)\n\nStores the given string substr as a SubstitutionString, for use in regular expression substitutions. Most commonly constructed using the @s_str macro.\n\njulia> SubstitutionString(\"Hello \\\\g<name>, it\'s \\\\1\")\ns\"Hello \\\\g<name>, it\'s \\\\1\"\n\njulia> subst = s\"Hello \\g<name>, it\'s \\1\"\ns\"Hello \\\\g<name>, it\'s \\\\1\"\n\njulia> typeof(subst)\nSubstitutionString{String}\n\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.@s_str",
    "page": "Strings",
    "title": "Base.@s_str",
    "category": "macro",
    "text": "@s_str -> SubstitutionString\n\nConstruct a substitution string, used for regular expression substitutions.  Within the string, sequences of the form \\N refer to the Nth capture group in the regex, and \\g<groupname> refers to a named capture group with name groupname.\n\njulia> msg = \"#Hello# from Julia\";\n\njulia> replace(msg, r\"#(.+)# from (?<from>\\w+)\" => s\"FROM: \\g<from>; MESSAGE: \\1\")\n\"FROM: Julia; MESSAGE: Hello\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.@raw_str",
    "page": "Strings",
    "title": "Base.@raw_str",
    "category": "macro",
    "text": "@raw_str -> String\n\nCreate a raw string without interpolation and unescaping. The exception is that quotation marks still must be escaped. Backslashes escape both quotation marks and other backslashes, but only when a sequence of backslashes precedes a quote character. Thus, 2n backslashes followed by a quote encodes n backslashes and the end of the literal while 2n+1 backslashes followed by a quote encodes n backslashes followed by a quote character.\n\nExamples\n\njulia> println(raw\"\\ $x\")\n\\ $x\n\njulia> println(raw\"\\\"\")\n\"\n\njulia> println(raw\"\\\\\\\"\")\n\\\"\n\njulia> println(raw\"\\\\x \\\\\\\"\")\n\\\\x \\\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Docs.@html_str",
    "page": "Strings",
    "title": "Base.Docs.@html_str",
    "category": "macro",
    "text": "@html_str -> Docs.HTML\n\nCreate an HTML object from a literal string.\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Docs.@text_str",
    "page": "Strings",
    "title": "Base.Docs.@text_str",
    "category": "macro",
    "text": "@text_str -> Docs.Text\n\nCreate a Text object from a literal string.\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.isvalid-Tuple{Any}",
    "page": "Strings",
    "title": "Base.isvalid",
    "category": "method",
    "text": "isvalid(value) -> Bool\n\nReturns true if the given value is valid for its type, which currently can be either AbstractChar or String.\n\nExamples\n\njulia> isvalid(Char(0xd800))\nfalse\n\njulia> isvalid(Char(0xd799))\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.isvalid-Tuple{Any,Any}",
    "page": "Strings",
    "title": "Base.isvalid",
    "category": "method",
    "text": "isvalid(T, value) -> Bool\n\nReturns true if the given value is valid for that type. Types currently can be either AbstractChar or String. Values for AbstractChar can be of type AbstractChar or UInt32. Values for String can be of that type, or Vector{UInt8}.\n\nExamples\n\njulia> isvalid(Char, 0xd800)\nfalse\n\njulia> isvalid(Char, 0xd799)\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.isvalid-Tuple{AbstractString,Integer}",
    "page": "Strings",
    "title": "Base.isvalid",
    "category": "method",
    "text": "isvalid(s::AbstractString, i::Integer) -> Bool\n\nPredicate indicating whether the given index is the start of the encoding of a character in s or not. If isvalid(s, i) is true then s[i] will return the character whose encoding starts at that index, if it\'s false, then s[i] will raise an invalid index error or a bounds error depending on if i is in bounds. In order for isvalid(s, i) to be an O(1) function, the encoding of s must be self-synchronizing this is a basic assumption of Julia\'s generic string support.\n\nSee also: getindex, iterate, thisind, nextind, prevind, length\n\nExamples\n\njulia> str = \"αβγdef\";\n\njulia> isvalid(str, 1)\ntrue\n\njulia> str[1]\n\'α\': Unicode U+03b1 (category Ll: Letter, lowercase)\n\njulia> isvalid(str, 2)\nfalse\n\njulia> str[2]\nERROR: StringIndexError(\"αβγdef\", 2)\nStacktrace:\n[...]\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.match",
    "page": "Strings",
    "title": "Base.match",
    "category": "function",
    "text": "match(r::Regex, s::AbstractString[, idx::Integer[, addopts]])\n\nSearch for the first match of the regular expression r in s and return a RegexMatch object containing the match, or nothing if the match failed. The matching substring can be retrieved by accessing m.match and the captured sequences can be retrieved by accessing m.captures The optional idx argument specifies an index at which to start the search.\n\nExamples\n\njulia> rx = r\"a(.)a\"\nr\"a(.)a\"\n\njulia> m = match(rx, \"cabac\")\nRegexMatch(\"aba\", 1=\"b\")\n\njulia> m.captures\n1-element Array{Union{Nothing, SubString{String}},1}:\n \"b\"\n\njulia> m.match\n\"aba\"\n\njulia> match(rx, \"cabac\", 3) === nothing\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.eachmatch",
    "page": "Strings",
    "title": "Base.eachmatch",
    "category": "function",
    "text": "eachmatch(r::Regex, s::AbstractString; overlap::Bool=false])\n\nSearch for all matches of a the regular expression r in s and return a iterator over the matches. If overlap is true, the matching sequences are allowed to overlap indices in the original string, otherwise they must be from distinct character ranges.\n\nExamples\n\njulia> rx = r\"a.a\"\nr\"a.a\"\n\njulia> m = eachmatch(rx, \"a1a2a3a\")\nBase.RegexMatchIterator(r\"a.a\", \"a1a2a3a\", false)\n\njulia> collect(m)\n2-element Array{RegexMatch,1}:\n RegexMatch(\"a1a\")\n RegexMatch(\"a3a\")\n\njulia> collect(eachmatch(rx, \"a1a2a3a\", overlap = true))\n3-element Array{RegexMatch,1}:\n RegexMatch(\"a1a\")\n RegexMatch(\"a2a\")\n RegexMatch(\"a3a\")\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.isless-Tuple{AbstractString,AbstractString}",
    "page": "Strings",
    "title": "Base.isless",
    "category": "method",
    "text": "isless(a::AbstractString, b::AbstractString) -> Bool\n\nTest whether string a comes before string b in alphabetical order (technically, in lexicographical order by Unicode code points).\n\nExamples\n\njulia> isless(\"a\", \"b\")\ntrue\n\njulia> isless(\"β\", \"α\")\nfalse\n\njulia> isless(\"a\", \"a\")\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.:==-Tuple{AbstractString,AbstractString}",
    "page": "Strings",
    "title": "Base.:==",
    "category": "method",
    "text": "==(a::AbstractString, b::AbstractString) -> Bool\n\nTest whether two strings are equal character by character (technically, Unicode code point by code point).\n\nExamples\n\njulia> \"abc\" == \"abc\"\ntrue\n\njulia> \"abc\" == \"αβγ\"\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.cmp-Tuple{AbstractString,AbstractString}",
    "page": "Strings",
    "title": "Base.cmp",
    "category": "method",
    "text": "cmp(a::AbstractString, b::AbstractString) -> Int\n\nCompare two strings. Return 0 if both strings have the same length and the character at each index is the same in both strings. Return -1 if a is a prefix of b, or if a comes before b in alphabetical order. Return 1 if b is a prefix of a, or if b comes before a in alphabetical order (technically, lexicographical order by Unicode code points).\n\nExamples\n\njulia> cmp(\"abc\", \"abc\")\n0\n\njulia> cmp(\"ab\", \"abc\")\n-1\n\njulia> cmp(\"abc\", \"ab\")\n1\n\njulia> cmp(\"ab\", \"ac\")\n-1\n\njulia> cmp(\"ac\", \"ab\")\n1\n\njulia> cmp(\"α\", \"a\")\n1\n\njulia> cmp(\"b\", \"β\")\n-1\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.lpad",
    "page": "Strings",
    "title": "Base.lpad",
    "category": "function",
    "text": "lpad(s, n::Integer, p::Union{AbstractChar,AbstractString}=\' \') -> String\n\nStringify s and pad the resulting string on the left with p to make it n characters (code points) long. If s is already n characters long, an equal string is returned. Pad with spaces by default.\n\nExamples\n\njulia> lpad(\"March\", 10)\n\"     March\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.rpad",
    "page": "Strings",
    "title": "Base.rpad",
    "category": "function",
    "text": "rpad(s, n::Integer, p::Union{AbstractChar,AbstractString}=\' \') -> String\n\nStringify s and pad the resulting string on the right with p to make it n characters (code points) long. If s is already n characters long, an equal string is returned. Pad with spaces by default.\n\nExamples\n\njulia> rpad(\"March\", 20)\n\"March               \"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.findfirst-Tuple{AbstractString,AbstractString}",
    "page": "Strings",
    "title": "Base.findfirst",
    "category": "method",
    "text": "findfirst(pattern::AbstractString, string::AbstractString)\nfindfirst(pattern::Regex, string::String)\n\nFind the first occurrence of pattern in string. Equivalent to findnext(pattern, string, firstindex(s)).\n\nExamples\n\njulia> findfirst(\"z\", \"Hello to the world\") # returns nothing, but not printed in the REPL\n\njulia> findfirst(\"Julia\", \"JuliaLang\")\n1:5\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.findnext-Tuple{AbstractString,AbstractString,Integer}",
    "page": "Strings",
    "title": "Base.findnext",
    "category": "method",
    "text": "findnext(pattern::AbstractString, string::AbstractString, start::Integer)\nfindnext(pattern::Regex, string::String, start::Integer)\n\nFind the next occurrence of pattern in string starting at position start. pattern can be either a string, or a regular expression, in which case string must be of type String.\n\nThe return value is a range of indices where the matching sequence is found, such that s[findnext(x, s, i)] == x:\n\nfindnext(\"substring\", string, i) = start:end such that string[start:end] == \"substring\", or nothing if unmatched.\n\nExamples\n\njulia> findnext(\"z\", \"Hello to the world\", 1) === nothing\ntrue\n\njulia> findnext(\"o\", \"Hello to the world\", 6)\n8:8\n\njulia> findnext(\"Lang\", \"JuliaLang\", 2)\n6:9\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.findlast-Tuple{AbstractString,AbstractString}",
    "page": "Strings",
    "title": "Base.findlast",
    "category": "method",
    "text": "findlast(pattern::AbstractString, string::AbstractString)\nfindlast(pattern::Regex, string::String)\n\nFind the last occurrence of pattern in string. Equivalent to findlast(pattern, string, lastindex(s)).\n\nExamples\n\njulia> findlast(\"o\", \"Hello to the world\")\n15:15\n\njulia> findfirst(\"Julia\", \"JuliaLang\")\n1:5\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.findprev-Tuple{AbstractString,AbstractString,Integer}",
    "page": "Strings",
    "title": "Base.findprev",
    "category": "method",
    "text": "findprev(pattern::AbstractString, string::AbstractString, start::Integer)\nfindprev(pattern::Regex, string::String, start::Integer)\n\nFind the previous occurrence of pattern in string starting at position start. pattern can be either a string, or a regular expression, in which case string must be of type String.\n\nThe return value is a range of indices where the matching sequence is found, such that s[findprev(x, s, i)] == x:\n\nfindprev(\"substring\", string, i) = start:end such that string[start:end] == \"substring\", or nothing if unmatched.\n\nExamples\n\njulia> findprev(\"z\", \"Hello to the world\", 18) === nothing\ntrue\n\njulia> findprev(\"o\", \"Hello to the world\", 18)\n15:15\n\njulia> findprev(\"Julia\", \"JuliaLang\", 6)\n1:5\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.occursin",
    "page": "Strings",
    "title": "Base.occursin",
    "category": "function",
    "text": "occursin(needle::Union{AbstractString,Regex,AbstractChar}, haystack::AbstractString)\n\nDetermine whether the first argument is a substring of the second. If needle is a regular expression, checks whether haystack contains a match.\n\nExamples\n\njulia> occursin(\"Julia\", \"JuliaLang is pretty cool!\")\ntrue\n\njulia> occursin(\'a\', \"JuliaLang is pretty cool!\")\ntrue\n\njulia> occursin(r\"a.a\", \"aba\")\ntrue\n\njulia> occursin(r\"a.a\", \"abba\")\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.reverse-Tuple{Union{SubString{String}, String}}",
    "page": "Strings",
    "title": "Base.reverse",
    "category": "method",
    "text": "reverse(s::AbstractString) -> AbstractString\n\nReverses a string. Technically, this function reverses the codepoints in a string and its main utility is for reversed-order string processing, especially for reversed regular-expression searches. See also reverseind to convert indices in s to indices in reverse(s) and vice-versa, and graphemes from module Unicode to operate on user-visible \"characters\" (graphemes) rather than codepoints. See also Iterators.reverse for reverse-order iteration without making a copy. Custom string types must implement the reverse function themselves and should typically return a string with the same type and encoding. If they return a string with a different encoding, they must also override reverseind for that string type to satisfy s[reverseind(s,i)] == reverse(s)[i].\n\nExamples\n\njulia> reverse(\"JuliaLang\")\n\"gnaLailuJ\"\n\njulia> reverse(\"ax̂e\") # combining characters can lead to surprising results\n\"êxa\"\n\njulia> using Unicode\n\njulia> join(reverse(collect(graphemes(\"ax̂e\")))) # reverses graphemes\n\"ex̂a\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.replace-Tuple{AbstractString,Pair}",
    "page": "Strings",
    "title": "Base.replace",
    "category": "method",
    "text": "replace(s::AbstractString, pat=>r; [count::Integer])\n\nSearch for the given pattern pat in s, and replace each occurrence with r. If count is provided, replace at most count occurrences. pat may be a single character, a vector or a set of characters, a string, or a regular expression. If r is a function, each occurrence is replaced with r(s) where s is the matched substring (when patis a Regex or AbstractString) or character (when pat is an AbstractChar or a collection of AbstractChar). If pat is a regular expression and r is a SubstitutionString, then capture group references in r are replaced with the corresponding matched text. To remove instances of pat from string, set r to the empty String (\"\").\n\nExamples\n\njulia> replace(\"Python is a programming language.\", \"Python\" => \"Julia\")\n\"Julia is a programming language.\"\n\njulia> replace(\"The quick foxes run quickly.\", \"quick\" => \"slow\", count=1)\n\"The slow foxes run quickly.\"\n\njulia> replace(\"The quick foxes run quickly.\", \"quick\" => \"\", count=1)\n\"The  foxes run quickly.\"\n\njulia> replace(\"The quick foxes run quickly.\", r\"fox(es)?\" => s\"bus\\1\")\n\"The quick buses run quickly.\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.split",
    "page": "Strings",
    "title": "Base.split",
    "category": "function",
    "text": "split(str::AbstractString, dlm; limit::Integer=0, keepempty::Bool=true)\nsplit(str::AbstractString; limit::Integer=0, keepempty::Bool=false)\n\nSplit str into an array of substrings on occurrences of the delimiter(s) dlm.  dlm can be any of the formats allowed by findnext\'s first argument (i.e. as a string, regular expression or a function), or as a single character or collection of characters.\n\nIf dlm is omitted, it defaults to isspace.\n\nThe optional keyword arguments are:\n\nlimit: the maximum size of the result. limit=0 implies no maximum (default)\nkeepempty: whether empty fields should be kept in the result. Default is false without a dlm argument, true with a dlm argument.\n\nSee also rsplit.\n\nExamples\n\njulia> a = \"Ma.rch\"\n\"Ma.rch\"\n\njulia> split(a,\".\")\n2-element Array{SubString{String},1}:\n \"Ma\"\n \"rch\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.rsplit",
    "page": "Strings",
    "title": "Base.rsplit",
    "category": "function",
    "text": "rsplit(s::AbstractString; limit::Integer=0, keepempty::Bool=false)\nrsplit(s::AbstractString, chars; limit::Integer=0, keepempty::Bool=true)\n\nSimilar to split, but starting from the end of the string.\n\nExamples\n\njulia> a = \"M.a.r.c.h\"\n\"M.a.r.c.h\"\n\njulia> rsplit(a,\".\")\n5-element Array{SubString{String},1}:\n \"M\"\n \"a\"\n \"r\"\n \"c\"\n \"h\"\n\njulia> rsplit(a,\".\";limit=1)\n1-element Array{SubString{String},1}:\n \"M.a.r.c.h\"\n\njulia> rsplit(a,\".\";limit=2)\n2-element Array{SubString{String},1}:\n \"M.a.r.c\"\n \"h\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.strip",
    "page": "Strings",
    "title": "Base.strip",
    "category": "function",
    "text": "strip(str::AbstractString, [chars])\n\nRemove leading and trailing characters from str.\n\nThe default behaviour is to remove leading whitespace and delimiters: see isspace for precise details.\n\nThe optional chars argument specifies which characters to remove: it can be a single character, vector or set of characters, or a predicate function.\n\nExamples\n\njulia> strip(\"{3, 5}\\n\", [\'{\', \'}\', \'\\n\'])\n\"3, 5\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.lstrip",
    "page": "Strings",
    "title": "Base.lstrip",
    "category": "function",
    "text": "lstrip([pred=isspace,] str::AbstractString)\nlstrip(str::AbstractString, chars)\n\nRemove leading characters from str, either those specified by chars or those for which the function pred returns true.\n\nThe default behaviour is to remove leading whitespace and delimiters: see isspace for precise details.\n\nThe optional chars argument specifies which characters to remove: it can be a single character, or a vector or set of characters.\n\nExamples\n\njulia> a = lpad(\"March\", 20)\n\"               March\"\n\njulia> lstrip(a)\n\"March\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.rstrip",
    "page": "Strings",
    "title": "Base.rstrip",
    "category": "function",
    "text": "rstrip([pred=isspace,] str::AbstractString)\nrstrip(str::AbstractString, chars)\n\nRemove trailing characters from str, either those specified by chars or those for which the function pred returns true.\n\nThe default behaviour is to remove leading whitespace and delimiters: see isspace for precise details.\n\nThe optional chars argument specifies which characters to remove: it can be a single character, or a vector or set of characters.\n\nExamples\n\njulia> a = rpad(\"March\", 20)\n\"March               \"\n\njulia> rstrip(a)\n\"March\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.startswith",
    "page": "Strings",
    "title": "Base.startswith",
    "category": "function",
    "text": "startswith(s::AbstractString, prefix::AbstractString)\n\nReturn true if s starts with prefix. If prefix is a vector or set of characters, test whether the first character of s belongs to that set.\n\nSee also endswith.\n\nExamples\n\njulia> startswith(\"JuliaLang\", \"Julia\")\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.endswith",
    "page": "Strings",
    "title": "Base.endswith",
    "category": "function",
    "text": "endswith(s::AbstractString, suffix::AbstractString)\n\nReturn true if s ends with suffix. If suffix is a vector or set of characters, test whether the last character of s belongs to that set.\n\nSee also startswith.\n\nExamples\n\njulia> endswith(\"Sunday\", \"day\")\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.first-Tuple{AbstractString,Integer}",
    "page": "Strings",
    "title": "Base.first",
    "category": "method",
    "text": "first(s::AbstractString, n::Integer)\n\nGet a string consisting of the first n characters of s.\n\njulia> first(\"∀ϵ≠0: ϵ²>0\", 0)\n\"\"\n\njulia> first(\"∀ϵ≠0: ϵ²>0\", 1)\n\"∀\"\n\njulia> first(\"∀ϵ≠0: ϵ²>0\", 3)\n\"∀ϵ≠\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.last-Tuple{AbstractString,Integer}",
    "page": "Strings",
    "title": "Base.last",
    "category": "method",
    "text": "last(s::AbstractString, n::Integer)\n\nGet a string consisting of the last n characters of s.\n\njulia> last(\"∀ϵ≠0: ϵ²>0\", 0)\n\"\"\n\njulia> last(\"∀ϵ≠0: ϵ²>0\", 1)\n\"0\"\n\njulia> last(\"∀ϵ≠0: ϵ²>0\", 3)\n\"²>0\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.uppercase",
    "page": "Strings",
    "title": "Base.Unicode.uppercase",
    "category": "function",
    "text": "uppercase(s::AbstractString)\n\nReturn s with all characters converted to uppercase.\n\nExamples\n\njulia> uppercase(\"Julia\")\n\"JULIA\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.lowercase",
    "page": "Strings",
    "title": "Base.Unicode.lowercase",
    "category": "function",
    "text": "lowercase(s::AbstractString)\n\nReturn s with all characters converted to lowercase.\n\nExamples\n\njulia> lowercase(\"STRINGS AND THINGS\")\n\"strings and things\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.titlecase",
    "page": "Strings",
    "title": "Base.Unicode.titlecase",
    "category": "function",
    "text": "titlecase(s::AbstractString; [wordsep::Function], strict::Bool=true) -> String\n\nCapitalize the first character of each word in s; if strict is true, every other character is converted to lowercase, otherwise they are left unchanged. By default, all non-letters are considered as word separators; a predicate can be passed as the wordsep keyword to determine which characters should be considered as word separators. See also uppercasefirst to capitalize only the first character in s.\n\nExamples\n\njulia> titlecase(\"the JULIA programming language\")\n\"The Julia Programming Language\"\n\njulia> titlecase(\"ISS - international space station\", strict=false)\n\"ISS - International Space Station\"\n\njulia> titlecase(\"a-a b-b\", wordsep = c->c==\' \')\n\"A-a B-b\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.uppercasefirst",
    "page": "Strings",
    "title": "Base.Unicode.uppercasefirst",
    "category": "function",
    "text": "uppercasefirst(s::AbstractString) -> String\n\nReturn s with the first character converted to uppercase (technically \"title case\" for Unicode). See also titlecase to capitalize the first character of every word in s.\n\nSee also: lowercasefirst, uppercase, lowercase, titlecase\n\nExamples\n\njulia> uppercasefirst(\"python\")\n\"Python\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.lowercasefirst",
    "page": "Strings",
    "title": "Base.Unicode.lowercasefirst",
    "category": "function",
    "text": "lowercasefirst(s::AbstractString)\n\nReturn s with the first character converted to lowercase.\n\nSee also: uppercasefirst, uppercase, lowercase, titlecase\n\nExamples\n\njulia> lowercasefirst(\"Julia\")\n\"julia\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.join",
    "page": "Strings",
    "title": "Base.join",
    "category": "function",
    "text": "join([io::IO,] strings, delim, [last])\n\nJoin an array of strings into a single string, inserting the given delimiter between adjacent strings. If last is given, it will be used instead of delim between the last two strings. If io is given, the result is written to io rather than returned as as a String.  For example,\n\nExamples\n\njulia> join([\"apples\", \"bananas\", \"pineapples\"], \", \", \" and \")\n\"apples, bananas and pineapples\"\n\nstrings can be any iterable over elements x which are convertible to strings via print(io::IOBuffer, x). strings will be printed to io.\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.chop",
    "page": "Strings",
    "title": "Base.chop",
    "category": "function",
    "text": "chop(s::AbstractString; head::Integer = 0, tail::Integer = 1)\n\nRemove the first head and the last tail characters from s. The call chop(s) removes the last character from s. If it is requested to remove more characters than length(s) then an empty string is returned.\n\nExamples\n\njulia> a = \"March\"\n\"March\"\n\njulia> chop(a)\n\"Marc\"\n\njulia> chop(a, head = 1, tail = 2)\n\"ar\"\n\njulia> chop(a, head = 5, tail = 5)\n\"\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.chomp",
    "page": "Strings",
    "title": "Base.chomp",
    "category": "function",
    "text": "chomp(s::AbstractString)\n\nRemove a single trailing newline from a string.\n\nExamples\n\njulia> chomp(\"Hello\\n\")\n\"Hello\"\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.thisind",
    "page": "Strings",
    "title": "Base.thisind",
    "category": "function",
    "text": "thisind(s::AbstractString, i::Integer) -> Int\n\nIf i is in bounds in s return the index of the start of the character whose encoding code unit i is part of. In other words, if i is the start of a character, return i; if i is not the start of a character, rewind until the start of a character and return that index. If i is equal to 0 or ncodeunits(s)+1 return i. In all other cases throw BoundsError.\n\nExamples\n\njulia> thisind(\"α\", 0)\n0\n\njulia> thisind(\"α\", 1)\n1\n\njulia> thisind(\"α\", 2)\n1\n\njulia> thisind(\"α\", 3)\n3\n\njulia> thisind(\"α\", 4)\nERROR: BoundsError: attempt to access \"α\"\n  at index [4]\n[...]\n\njulia> thisind(\"α\", -1)\nERROR: BoundsError: attempt to access \"α\"\n  at index [-1]\n[...]\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.nextind",
    "page": "Strings",
    "title": "Base.nextind",
    "category": "function",
    "text": "nextind(str::AbstractString, i::Integer, n::Integer=1) -> Int\n\nCase n == 1\nIf i is in bounds in s return the index of the start of the character whose encoding starts after index i. In other words, if i is the start of a character, return the start of the next character; if i is not the start of a character, move forward until the start of a character and return that index. If i is equal to 0 return 1. If i is in bounds but greater or equal to lastindex(str) return ncodeunits(str)+1. Otherwise throw BoundsError.\nCase n > 1\nBehaves like applying n times nextind for n==1. The only difference is that if n is so large that applying nextind would reach ncodeunits(str)+1 then each remaining iteration increases the returned value by 1. This means that in this case nextind can return a value greater than ncodeunits(str)+1.\nCase n == 0\nReturn i only if i is a valid index in s or is equal to 0. Otherwise StringIndexError or BoundsError is thrown.\n\nExamples\n\njulia> nextind(\"α\", 0)\n1\n\njulia> nextind(\"α\", 1)\n3\n\njulia> nextind(\"α\", 3)\nERROR: BoundsError: attempt to access \"α\"\n  at index [3]\n[...]\n\njulia> nextind(\"α\", 0, 2)\n3\n\njulia> nextind(\"α\", 1, 2)\n4\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.prevind",
    "page": "Strings",
    "title": "Base.prevind",
    "category": "function",
    "text": "prevind(str::AbstractString, i::Integer, n::Integer=1) -> Int\n\nCase n == 1\nIf i is in bounds in s return the index of the start of the character whose encoding starts before index i. In other words, if i is the start of a character, return the start of the previous character; if i is not the start of a character, rewind until the start of a character and return that index. If i is equal to 1 return 0. If i is equal to ncodeunits(str)+1 return lastindex(str). Otherwise throw BoundsError.\nCase n > 1\nBehaves like applying n times prevind for n==1. The only difference is that if n is so large that applying prevind would reach 0 then each remaining iteration decreases the returned value by 1. This means that in this case prevind can return a negative value.\nCase n == 0\nReturn i only if i is a valid index in str or is equal to ncodeunits(str)+1. Otherwise StringIndexError or BoundsError is thrown.\n\nExamples\n\njulia> prevind(\"α\", 3)\n1\n\njulia> prevind(\"α\", 1)\n0\n\njulia> prevind(\"α\", 0)\nERROR: BoundsError: attempt to access \"α\"\n  at index [0]\n[...]\n\njulia> prevind(\"α\", 2, 2)\n0\n\njulia> prevind(\"α\", 2, 3)\n-1\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.textwidth",
    "page": "Strings",
    "title": "Base.Unicode.textwidth",
    "category": "function",
    "text": "textwidth(c)\n\nGive the number of columns needed to print a character.\n\nExamples\n\njulia> textwidth(\'α\')\n1\n\njulia> textwidth(\'❤\')\n2\n\n\n\n\n\ntextwidth(s::AbstractString)\n\nGive the number of columns needed to print a string.\n\nExamples\n\njulia> textwidth(\"March\")\n5\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.isascii",
    "page": "Strings",
    "title": "Base.isascii",
    "category": "function",
    "text": "isascii(c::Union{AbstractChar,AbstractString}) -> Bool\n\nTest whether a character belongs to the ASCII character set, or whether this is true for all elements of a string.\n\nExamples\n\njulia> isascii(\'a\')\ntrue\n\njulia> isascii(\'α\')\nfalse\n\njulia> isascii(\"abc\")\ntrue\n\njulia> isascii(\"αβγ\")\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.iscntrl",
    "page": "Strings",
    "title": "Base.Unicode.iscntrl",
    "category": "function",
    "text": "iscntrl(c::AbstractChar) -> Bool\n\nTests whether a character is a control character. Control characters are the non-printing characters of the Latin-1 subset of Unicode.\n\nExamples\n\njulia> iscntrl(\'\\x01\')\ntrue\n\njulia> iscntrl(\'a\')\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.isdigit",
    "page": "Strings",
    "title": "Base.Unicode.isdigit",
    "category": "function",
    "text": "isdigit(c::AbstractChar) -> Bool\n\nTests whether a character is a decimal digit (0-9).\n\nExamples\n\njulia> isdigit(\'❤\')\nfalse\n\njulia> isdigit(\'9\')\ntrue\n\njulia> isdigit(\'α\')\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.isletter",
    "page": "Strings",
    "title": "Base.Unicode.isletter",
    "category": "function",
    "text": "isletter(c::AbstractChar) -> Bool\n\nTest whether a character is a letter. A character is classified as a letter if it belongs to the Unicode general category Letter, i.e. a character whose category code begins with \'L\'.\n\nExamples\n\njulia> isletter(\'❤\')\nfalse\n\njulia> isletter(\'α\')\ntrue\n\njulia> isletter(\'9\')\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.islowercase",
    "page": "Strings",
    "title": "Base.Unicode.islowercase",
    "category": "function",
    "text": "islowercase(c::AbstractChar) -> Bool\n\nTests whether a character is a lowercase letter. A character is classified as lowercase if it belongs to Unicode category Ll, Letter: Lowercase.\n\nExamples\n\njulia> islowercase(\'α\')\ntrue\n\njulia> islowercase(\'Γ\')\nfalse\n\njulia> islowercase(\'❤\')\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.isnumeric",
    "page": "Strings",
    "title": "Base.Unicode.isnumeric",
    "category": "function",
    "text": "isnumeric(c::AbstractChar) -> Bool\n\nTests whether a character is numeric. A character is classified as numeric if it belongs to the Unicode general category Number, i.e. a character whose category code begins with \'N\'.\n\nNote that this broad category includes characters such as ¾ and ௰. Use isdigit to check whether a character a decimal digit between 0 and 9.\n\nExamples\n\njulia> isnumeric(\'௰\')\ntrue\n\njulia> isnumeric(\'9\')\ntrue\n\njulia> isnumeric(\'α\')\nfalse\n\njulia> isnumeric(\'❤\')\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.isprint",
    "page": "Strings",
    "title": "Base.Unicode.isprint",
    "category": "function",
    "text": "isprint(c::AbstractChar) -> Bool\n\nTests whether a character is printable, including spaces, but not a control character.\n\nExamples\n\njulia> isprint(\'\\x01\')\nfalse\n\njulia> isprint(\'A\')\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.ispunct",
    "page": "Strings",
    "title": "Base.Unicode.ispunct",
    "category": "function",
    "text": "ispunct(c::AbstractChar) -> Bool\n\nTests whether a character belongs to the Unicode general category Punctuation, i.e. a character whose category code begins with \'P\'.\n\nExamples\n\njulia> ispunct(\'α\')\nfalse\n\njulia> ispunct(\'/\')\ntrue\n\njulia> ispunct(\';\')\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.isspace",
    "page": "Strings",
    "title": "Base.Unicode.isspace",
    "category": "function",
    "text": "isspace(c::AbstractChar) -> Bool\n\nTests whether a character is any whitespace character. Includes ASCII characters \'\\t\', \'\\n\', \'\\v\', \'\\f\', \'\\r\', and \' \', Latin-1 character U+0085, and characters in Unicode category Zs.\n\nExamples\n\njulia> isspace(\'\\n\')\ntrue\n\njulia> isspace(\'\\r\')\ntrue\n\njulia> isspace(\' \')\ntrue\n\njulia> isspace(\'\\x20\')\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.isuppercase",
    "page": "Strings",
    "title": "Base.Unicode.isuppercase",
    "category": "function",
    "text": "isuppercase(c::AbstractChar) -> Bool\n\nTests whether a character is an uppercase letter. A character is classified as uppercase if it belongs to Unicode category Lu, Letter: Uppercase, or Lt, Letter: Titlecase.\n\nExamples\n\njulia> isuppercase(\'γ\')\nfalse\n\njulia> isuppercase(\'Γ\')\ntrue\n\njulia> isuppercase(\'❤\')\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.Unicode.isxdigit",
    "page": "Strings",
    "title": "Base.Unicode.isxdigit",
    "category": "function",
    "text": "isxdigit(c::AbstractChar) -> Bool\n\nTest whether a character is a valid hexadecimal digit. Note that this does not include x (as in the standard 0x prefix).\n\nExamples\n\njulia> isxdigit(\'a\')\ntrue\n\njulia> isxdigit(\'x\')\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Core.Symbol",
    "page": "Strings",
    "title": "Core.Symbol",
    "category": "type",
    "text": "Symbol(x...) -> Symbol\n\nCreate a Symbol by concatenating the string representations of the arguments together.\n\nExamples\n\njulia> Symbol(\"my\", \"name\")\n:myname\n\njulia> Symbol(\"day\", 4)\n:day4\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.escape_string",
    "page": "Strings",
    "title": "Base.escape_string",
    "category": "function",
    "text": "escape_string(str::AbstractString[, esc])::AbstractString\nescape_string(io, str::AbstractString[, esc::])::Nothing\n\nGeneral escaping of traditional C and Unicode escape sequences. The first form returns the escaped string, the second prints the result to io.\n\nBackslashes (\\) are escaped with a double-backslash (\"\\\\\"). Non-printable characters are escaped either with their standard C escape codes, \"\\0\" for NUL (if unambiguous), unicode code point (\"\\u\" prefix) or hex (\"\\x\" prefix).\n\nThe optional esc argument specifies any additional characters that should also be escaped by a prepending backslash (\" is also escaped by default in the first form).\n\nExamples\n\njulia> escape_string(\"aaa\\nbbb\")\n\"aaa\\\\nbbb\"\n\njulia> escape_string(\"\\xfe\\xff\") # invalid utf-8\n\"\\\\xfe\\\\xff\"\n\njulia> escape_string(string(\'\\u2135\',\'\\0\')) # unambiguous\n\"ℵ\\\\0\"\n\njulia> escape_string(string(\'\\u2135\',\'\\0\',\'0\')) # \\0 would be ambiguous\n\"ℵ\\\\x000\"\n\nSee also\n\nunescape_string for the reverse operation.\n\n\n\n\n\n"
},

{
    "location": "base/strings/#Base.unescape_string",
    "page": "Strings",
    "title": "Base.unescape_string",
    "category": "function",
    "text": "unescape_string(str::AbstractString)::AbstractString\nunescape_string(io, str::AbstractString)::Nothing\n\nGeneral unescaping of traditional C and Unicode escape sequences. The first form returns the escaped string, the second prints the result to io.\n\nThe following escape sequences are recognised:\n\nEscaped backslash (\\\\)\nEscaped double-quote (\\\")\nStandard C escape sequences (\\a, \\b, \\t, \\n, \\v, \\f, \\r, \\e)\nUnicode code points (\\u or \\U prefixes with 1-4 trailing hex digits)\nHex bytes (\\x with 1-2 trailing hex digits)\nOctal bytes (\\ with 1-3 trailing octal digits)\n\nExamples\n\njulia> unescape_string(\"aaa\\\\nbbb\") # C escape sequence\n\"aaa\\nbbb\"\n\njulia> unescape_string(\"\\\\u03c0\") # unicode\n\"π\"\n\njulia> unescape_string(\"\\\\101\") # octal\n\"A\"\n\nSee also\n\nescape_string.\n\n\n\n\n\n"
},

{
    "location": "base/strings/#lib-strings-1",
    "page": "Strings",
    "title": "Strings",
    "category": "section",
    "text": "Core.AbstractChar\nCore.Char\nBase.codepoint\nBase.length(::AbstractString)\nBase.sizeof(::AbstractString)\nBase.:*(::Union{AbstractChar, AbstractString}, ::Union{AbstractChar, AbstractString}...)\nBase.:^(::AbstractString, ::Integer)\nBase.string\nBase.repeat(::AbstractString, ::Integer)\nBase.repeat(::AbstractChar, ::Integer)\nBase.repr(::Any)\nCore.String(::AbstractString)\nBase.SubString\nBase.transcode\nBase.unsafe_string\nBase.ncodeunits(::AbstractString)\nBase.codeunit\nBase.codeunits\nBase.ascii\nBase.@r_str\nBase.SubstitutionString\nBase.@s_str\nBase.@raw_str\nBase.Docs.@html_str\nBase.Docs.@text_str\nBase.isvalid(::Any)\nBase.isvalid(::Any, ::Any)\nBase.isvalid(::AbstractString, ::Integer)\nBase.match\nBase.eachmatch\nBase.isless(::AbstractString, ::AbstractString)\nBase.:(==)(::AbstractString, ::AbstractString)\nBase.cmp(::AbstractString, ::AbstractString)\nBase.lpad\nBase.rpad\nBase.findfirst(::AbstractString, ::AbstractString)\nBase.findnext(::AbstractString, ::AbstractString, ::Integer)\nBase.findlast(::AbstractString, ::AbstractString)\nBase.findprev(::AbstractString, ::AbstractString, ::Integer)\nBase.occursin\nBase.reverse(::Union{String,SubString{String}})\nBase.replace(s::AbstractString, ::Pair)\nBase.split\nBase.rsplit\nBase.strip\nBase.lstrip\nBase.rstrip\nBase.startswith\nBase.endswith\nBase.first(::AbstractString, ::Integer)\nBase.last(::AbstractString, ::Integer)\nBase.uppercase\nBase.lowercase\nBase.titlecase\nBase.uppercasefirst\nBase.lowercasefirst\nBase.join\nBase.chop\nBase.chomp\nBase.thisind\nBase.nextind\nBase.prevind\nBase.textwidth\nBase.isascii\nBase.iscntrl\nBase.isdigit\nBase.isletter\nBase.islowercase\nBase.isnumeric\nBase.isprint\nBase.ispunct\nBase.isspace\nBase.isuppercase\nBase.isxdigit\nCore.Symbol\nBase.escape_string\nBase.unescape_string"
},

{
    "location": "base/arrays/#",
    "page": "数组",
    "title": "数组",
    "category": "page",
    "text": ""
},

{
    "location": "base/arrays/#lib-arrays-1",
    "page": "数组",
    "title": "数组",
    "category": "section",
    "text": ""
},

{
    "location": "base/arrays/#构造器和类型-1",
    "page": "数组",
    "title": "构造器和类型",
    "category": "section",
    "text": "<!-- ## Constructors and Types -->Core.AbstractArray\nBase.AbstractVector\nBase.AbstractMatrix\nBase.AbstractVecOrMat\nCore.Array\nCore.Array(::UndefInitializer, ::Any)\nCore.Array(::Nothing, ::Any)\nCore.Array(::Missing, ::Any)\nCore.UndefInitializer\nCore.undef\nBase.Vector\nBase.Vector(::UndefInitializer, ::Any)\nBase.Vector(::Nothing, ::Any)\nBase.Vector(::Missing, ::Any)\nBase.Matrix\nBase.Matrix(::UndefInitializer, ::Any, ::Any)\nBase.Matrix(::Nothing, ::Any, ::Any)\nBase.Matrix(::Missing, ::Any, ::Any)\nBase.VecOrMat\nCore.DenseArray\nBase.DenseVector\nBase.DenseMatrix\nBase.DenseVecOrMat\nBase.getindex(::Type, ::Any...)\nBase.zeros\nBase.ones\nBase.BitArray\nBase.BitArray(::UndefInitializer, ::Integer...)\nBase.BitArray(::Any)\nBase.trues\nBase.falses\nBase.fill\nBase.fill!\nBase.similar"
},

{
    "location": "base/arrays/#Base.ndims",
    "page": "数组",
    "title": "Base.ndims",
    "category": "function",
    "text": "ndims(A::AbstractArray) -> Integer\n\nReturn the number of dimensions of A.\n\nExamples\n\njulia> A = fill(1, (3,4,5));\n\njulia> ndims(A)\n3\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.size",
    "page": "数组",
    "title": "Base.size",
    "category": "function",
    "text": "size(A::AbstractArray, [dim])\n\nReturn a tuple containing the dimensions of A. Optionally you can specify a dimension to just get the length of that dimension.\n\nNote that size may not be defined for arrays with non-standard indices, in which case axes may be useful. See the manual chapter on arrays with custom indices.\n\nExamples\n\njulia> A = fill(1, (2,3,4));\n\njulia> size(A)\n(2, 3, 4)\n\njulia> size(A, 2)\n3\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.axes-Tuple{Any}",
    "page": "数组",
    "title": "Base.axes",
    "category": "method",
    "text": "axes(A)\n\nReturn the tuple of valid indices for array A.\n\nExamples\n\njulia> A = fill(1, (5,6,7));\n\njulia> axes(A)\n(Base.OneTo(5), Base.OneTo(6), Base.OneTo(7))\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.axes-Tuple{AbstractArray,Any}",
    "page": "数组",
    "title": "Base.axes",
    "category": "method",
    "text": "axes(A, d)\n\nReturn the valid range of indices for array A along dimension d.\n\nSee also size, and the manual chapter on arrays with custom indices.\n\nExamples\n\njulia> A = fill(1, (5,6,7));\n\njulia> axes(A, 2)\nBase.OneTo(6)\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.length-Tuple{AbstractArray}",
    "page": "数组",
    "title": "Base.length",
    "category": "method",
    "text": "length(A::AbstractArray)\n\nReturn the number of elements in the array, defaults to prod(size(A)).\n\nExamples\n\njulia> length([1, 2, 3, 4])\n4\n\njulia> length([1 2; 3 4])\n4\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.eachindex",
    "page": "数组",
    "title": "Base.eachindex",
    "category": "function",
    "text": "eachindex(A...)\n\nCreate an iterable object for visiting each index of an AbstractArray A in an efficient manner. For array types that have opted into fast linear indexing (like Array), this is simply the range 1:length(A). For other array types, return a specialized Cartesian range to efficiently index into the array with indices specified for every dimension. For other iterables, including strings and dictionaries, return an iterator object supporting arbitrary index types (e.g. unevenly spaced or non-integer indices).\n\nIf you supply more than one AbstractArray argument, eachindex will create an iterable object that is fast for all arguments (a UnitRange if all inputs have fast linear indexing, a CartesianIndices otherwise). If the arrays have different sizes and/or dimensionalities, eachindex will return an iterable that spans the largest range along each dimension.\n\nExamples\n\njulia> A = [1 2; 3 4];\n\njulia> for i in eachindex(A) # linear indexing\n           println(i)\n       end\n1\n2\n3\n4\n\njulia> for i in eachindex(view(A, 1:2, 1:1)) # Cartesian indexing\n           println(i)\n       end\nCartesianIndex(1, 1)\nCartesianIndex(2, 1)\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.IndexStyle",
    "page": "数组",
    "title": "Base.IndexStyle",
    "category": "type",
    "text": "IndexStyle(A)\nIndexStyle(typeof(A))\n\nIndexStyle specifies the \"native indexing style\" for array A. When you define a new AbstractArray type, you can choose to implement either linear indexing or cartesian indexing.  If you decide to implement linear indexing, then you must set this trait for your array type:\n\nBase.IndexStyle(::Type{<:MyArray}) = IndexLinear()\n\nThe default is IndexCartesian().\n\nJulia\'s internal indexing machinery will automatically (and invisibly) convert all indexing operations into the preferred style. This allows users to access elements of your array using any indexing style, even when explicit methods have not been provided.\n\nIf you define both styles of indexing for your AbstractArray, this trait can be used to select the most performant indexing style. Some methods check this trait on their inputs, and dispatch to different algorithms depending on the most efficient access pattern. In particular, eachindex creates an iterator whose type depends on the setting of this trait.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.conj!",
    "page": "数组",
    "title": "Base.conj!",
    "category": "function",
    "text": "conj!(A)\n\nTransform an array to its complex conjugate in-place.\n\nSee also conj.\n\nExamples\n\njulia> A = [1+im 2-im; 2+2im 3+im]\n2×2 Array{Complex{Int64},2}:\n 1+1im  2-1im\n 2+2im  3+1im\n\njulia> conj!(A);\n\njulia> A\n2×2 Array{Complex{Int64},2}:\n 1-1im  2+1im\n 2-2im  3-1im\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.stride",
    "page": "数组",
    "title": "Base.stride",
    "category": "function",
    "text": "stride(A, k::Integer)\n\nReturn the distance in memory (in number of elements) between adjacent elements in dimension k.\n\nExamples\n\njulia> A = fill(1, (3,4,5));\n\njulia> stride(A,2)\n3\n\njulia> stride(A,3)\n12\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.strides",
    "page": "数组",
    "title": "Base.strides",
    "category": "function",
    "text": "strides(A)\n\nReturn a tuple of the memory strides in each dimension.\n\nExamples\n\njulia> A = fill(1, (3,4,5));\n\njulia> strides(A)\n(1, 3, 12)\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#基本函数-1",
    "page": "数组",
    "title": "基本函数",
    "category": "section",
    "text": "<!-- ## Basic functions -->Base.ndims\nBase.size\nBase.axes(::Any)\nBase.axes(::AbstractArray, ::Any)\nBase.length(::AbstractArray)\nBase.eachindex\nBase.IndexStyle\nBase.conj!\nBase.stride\nBase.strides"
},

{
    "location": "base/arrays/#Base.Broadcast.broadcast",
    "page": "数组",
    "title": "Base.Broadcast.broadcast",
    "category": "function",
    "text": "broadcast(f, As...)\n\nBroadcast the function f over the arrays, tuples, collections, Refs and/or scalars As.\n\nBroadcasting applies the function f over the elements of the container arguments and the scalars themselves in As. Singleton and missing dimensions are expanded to match the extents of the other arguments by virtually repeating the value. By default, only a limited number of types are considered scalars, including Numbers, Strings, Symbols, Types, Functions and some common singletons like missing and nothing. All other arguments are iterated over or indexed into elementwise.\n\nThe resulting container type is established by the following rules:\n\nIf all the arguments are scalars or zero-dimensional arrays, it returns an unwrapped scalar.\nIf at least one argument is a tuple and all others are scalars or zero-dimensional arrays, it returns a tuple.\nAll other combinations of arguments default to returning an Array, but custom container types can define their own implementation and promotion-like rules to customize the result when they appear as arguments.\n\nA special syntax exists for broadcasting: f.(args...) is equivalent to broadcast(f, args...), and nested f.(g.(args...)) calls are fused into a single broadcast loop.\n\nExamples\n\njulia> A = [1, 2, 3, 4, 5]\n5-element Array{Int64,1}:\n 1\n 2\n 3\n 4\n 5\n\njulia> B = [1 2; 3 4; 5 6; 7 8; 9 10]\n5×2 Array{Int64,2}:\n 1   2\n 3   4\n 5   6\n 7   8\n 9  10\n\njulia> broadcast(+, A, B)\n5×2 Array{Int64,2}:\n  2   3\n  5   6\n  8   9\n 11  12\n 14  15\n\njulia> parse.(Int, [\"1\", \"2\"])\n2-element Array{Int64,1}:\n 1\n 2\n\njulia> abs.((1, -2))\n(1, 2)\n\njulia> broadcast(+, 1.0, (0, -2.0))\n(1.0, -1.0)\n\njulia> (+).([[0,2], [1,3]], Ref{Vector{Int}}([1,-1]))\n2-element Array{Array{Int64,1},1}:\n [1, 1]\n [2, 2]\n\njulia> string.((\"one\",\"two\",\"three\",\"four\"), \": \", 1:4)\n4-element Array{String,1}:\n \"one: 1\"\n \"two: 2\"\n \"three: 3\"\n \"four: 4\"\n\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.Broadcast.broadcast!",
    "page": "数组",
    "title": "Base.Broadcast.broadcast!",
    "category": "function",
    "text": "broadcast!(f, dest, As...)\n\nLike broadcast, but store the result of broadcast(f, As...) in the dest array. Note that dest is only used to store the result, and does not supply arguments to f unless it is also listed in the As, as in broadcast!(f, A, A, B) to perform A[:] = broadcast(f, A, B).\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.Broadcast.@__dot__",
    "page": "数组",
    "title": "Base.Broadcast.@__dot__",
    "category": "macro",
    "text": "@. expr\n\nConvert every function call or operator in expr into a \"dot call\" (e.g. convert f(x) to f.(x)), and convert every assignment in expr to a \"dot assignment\" (e.g. convert += to .+=).\n\nIf you want to avoid adding dots for selected function calls in expr, splice those function calls in with $.  For example, @. sqrt(abs($sort(x))) is equivalent to sqrt.(abs.(sort(x))) (no dot for sort).\n\n(@. is equivalent to a call to @__dot__.)\n\nExamples\n\njulia> x = 1.0:3.0; y = similar(x);\n\njulia> @. y = x + 3 * sin(x)\n3-element Array{Float64,1}:\n 3.5244129544236893\n 4.727892280477045\n 3.4233600241796016\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.Broadcast.BroadcastStyle",
    "page": "数组",
    "title": "Base.Broadcast.BroadcastStyle",
    "category": "type",
    "text": "BroadcastStyle is an abstract type and trait-function used to determine behavior of objects under broadcasting. BroadcastStyle(typeof(x)) returns the style associated with x. To customize the broadcasting behavior of a type, one can declare a style by defining a type/method pair\n\nstruct MyContainerStyle <: BroadcastStyle end\nBase.BroadcastStyle(::Type{<:MyContainer}) = MyContainerStyle()\n\nOne then writes method(s) (at least similar) operating on Broadcasted{MyContainerStyle}. There are also several pre-defined subtypes of BroadcastStyle that you may be able to leverage; see the Interfaces chapter for more information.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.Broadcast.broadcast_axes",
    "page": "数组",
    "title": "Base.Broadcast.broadcast_axes",
    "category": "function",
    "text": "Base.broadcast_axes(A)\n\nCompute the axes for A.\n\nThis should only be specialized for objects that do not define axes but want to participate in broadcasting.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.Broadcast.AbstractArrayStyle",
    "page": "数组",
    "title": "Base.Broadcast.AbstractArrayStyle",
    "category": "type",
    "text": "Broadcast.AbstractArrayStyle{N} <: BroadcastStyle is the abstract supertype for any style associated with an AbstractArray type. The N parameter is the dimensionality, which can be handy for AbstractArray types that only support specific dimensionalities:\n\nstruct SparseMatrixStyle <: Broadcast.AbstractArrayStyle{2} end\nBase.BroadcastStyle(::Type{<:SparseMatrixCSC}) = SparseMatrixStyle()\n\nFor AbstractArray types that support arbitrary dimensionality, N can be set to Any:\n\nstruct MyArrayStyle <: Broadcast.AbstractArrayStyle{Any} end\nBase.BroadcastStyle(::Type{<:MyArray}) = MyArrayStyle()\n\nIn cases where you want to be able to mix multiple AbstractArrayStyles and keep track of dimensionality, your style needs to support a Val constructor:\n\nstruct MyArrayStyleDim{N} <: Broadcast.AbstractArrayStyle{N} end\n(::Type{<:MyArrayStyleDim})(::Val{N}) where N = MyArrayStyleDim{N}()\n\nNote that if two or more AbstractArrayStyle subtypes conflict, broadcasting machinery will fall back to producing Arrays. If this is undesirable, you may need to define binary BroadcastStyle rules to control the output type.\n\nSee also Broadcast.DefaultArrayStyle.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.Broadcast.ArrayStyle",
    "page": "数组",
    "title": "Base.Broadcast.ArrayStyle",
    "category": "type",
    "text": "Broadcast.ArrayStyle{MyArrayType}() is a BroadcastStyle indicating that an object behaves as an array for broadcasting. It presents a simple way to construct Broadcast.AbstractArrayStyles for specific AbstractArray container types. Broadcast styles created this way lose track of dimensionality; if keeping track is important for your type, you should create your own custom Broadcast.AbstractArrayStyle.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.Broadcast.DefaultArrayStyle",
    "page": "数组",
    "title": "Base.Broadcast.DefaultArrayStyle",
    "category": "type",
    "text": "Broadcast.DefaultArrayStyle{N}() is a BroadcastStyle indicating that an object behaves as an N-dimensional array for broadcasting. Specifically, DefaultArrayStyle is used for any AbstractArray type that hasn\'t defined a specialized style, and in the absence of overrides from other broadcast arguments the resulting output type is Array. When there are multiple inputs to broadcast, DefaultArrayStyle \"loses\" to any other Broadcast.ArrayStyle.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.Broadcast.broadcastable",
    "page": "数组",
    "title": "Base.Broadcast.broadcastable",
    "category": "function",
    "text": "Broadcast.broadcastable(x)\n\nReturn either x or an object like x such that it supports axes, indexing, and its type supports ndims.\n\nIf x supports iteration, the returned value should have the same axes and indexing behaviors as collect(x).\n\nIf x is not an AbstractArray but it supports axes, indexing, and its type supports ndims, then broadcastable(::typeof(x)) may be implemented to just return itself. Further, if x defines its own BroadcastStyle, then it must define its broadcastable method to return itself for the custom style to have any effect.\n\nExamples\n\njulia> Broadcast.broadcastable([1,2,3]) # like `identity` since arrays already support axes and indexing\n3-element Array{Int64,1}:\n 1\n 2\n 3\n\njulia> Broadcast.broadcastable(Int) # Types don\'t support axes, indexing, or iteration but are commonly used as scalars\nBase.RefValue{Type{Int64}}(Int64)\n\njulia> Broadcast.broadcastable(\"hello\") # Strings break convention of matching iteration and act like a scalar instead\nBase.RefValue{String}(\"hello\")\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#广播和向量化-1",
    "page": "数组",
    "title": "广播和向量化",
    "category": "section",
    "text": "<!-- ## Broadcast and vectorization -->参见dot syntax for vectorizing functions；例如，f.(args...)隐式 调用了 broadcast(f, args...) 。与其依赖类似于作用在数组上的sin这样的“向量化的”函数方法，你应当使用 sin.(a)来通过broadcast向量化这个操作。<!-- See also the [dot syntax for vectorizing functions](@ref man-vectorized);\nfor example, `f.(args...)` implicitly calls `broadcast(f, args...)`.\nRather than relying on \"vectorized\" methods of functions like `sin`\nto operate on arrays, you should use `sin.(a)` to vectorize via `broadcast`. -->Base.broadcast\nBase.Broadcast.broadcast!\nBase.@__dot__For specializing broadcast on custom types, seeBase.BroadcastStyle\nBase.broadcast_axes\nBase.Broadcast.AbstractArrayStyle\nBase.Broadcast.ArrayStyle\nBase.Broadcast.DefaultArrayStyle\nBase.Broadcast.broadcastable"
},

{
    "location": "base/arrays/#索引和赋值-1",
    "page": "数组",
    "title": "索引和赋值",
    "category": "section",
    "text": "<!-- ## Indexing and assignment -->Base.getindex(::AbstractArray, ::Any...)\nBase.setindex!(::AbstractArray, ::Any, ::Any...)\nBase.copyto!(::AbstractArray, ::CartesianIndices, ::AbstractArray, ::CartesianIndices)\nBase.isassigned\nBase.Colon\nBase.CartesianIndex\nBase.CartesianIndices\nBase.Dims\nBase.LinearIndices\nBase.to_indices\nBase.checkbounds\nBase.checkindex"
},

{
    "location": "base/arrays/#Base.view",
    "page": "数组",
    "title": "Base.view",
    "category": "function",
    "text": "view(A, inds...)\n\nLike getindex, but returns a view into the parent array A with the given indices instead of making a copy.  Calling getindex or setindex! on the returned SubArray computes the indices to the parent array on the fly without checking bounds.\n\nExamples\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> b = view(A, :, 1)\n2-element view(::Array{Int64,2}, :, 1) with eltype Int64:\n 1\n 3\n\njulia> fill!(b, 0)\n2-element view(::Array{Int64,2}, :, 1) with eltype Int64:\n 0\n 0\n\njulia> A # Note A has changed even though we modified b\n2×2 Array{Int64,2}:\n 0  2\n 0  4\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.@view",
    "page": "数组",
    "title": "Base.@view",
    "category": "macro",
    "text": "@view A[inds...]\n\nCreates a SubArray from an indexing expression. This can only be applied directly to a reference expression (e.g. @view A[1,2:end]), and should not be used as the target of an assignment (e.g. @view(A[1,2:end]) = ...).  See also @views to switch an entire block of code to use views for slicing.\n\nExamples\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> b = @view A[:, 1]\n2-element view(::Array{Int64,2}, :, 1) with eltype Int64:\n 1\n 3\n\njulia> fill!(b, 0)\n2-element view(::Array{Int64,2}, :, 1) with eltype Int64:\n 0\n 0\n\njulia> A\n2×2 Array{Int64,2}:\n 0  2\n 0  4\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.@views",
    "page": "数组",
    "title": "Base.@views",
    "category": "macro",
    "text": "@views expression\n\nConvert every array-slicing operation in the given expression (which may be a begin/end block, loop, function, etc.) to return a view. Scalar indices, non-array types, and explicit getindex calls (as opposed to array[...]) are unaffected.\n\nnote: Note\nThe @views macro only affects array[...] expressions that appear explicitly in the given expression, not array slicing that occurs in functions called by that code.\n\nExamples\n\njulia> A = zeros(3, 3);\n\njulia> @views for row in 1:3\n           b = A[row, :]\n           b[:] .= row\n       end\n\njulia> A\n3×3 Array{Float64,2}:\n 1.0  1.0  1.0\n 2.0  2.0  2.0\n 3.0  3.0  3.0\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.parent",
    "page": "数组",
    "title": "Base.parent",
    "category": "function",
    "text": "parent(A)\n\nReturns the \"parent array\" of an array view type (e.g., SubArray), or the array itself if it is not a view.\n\nExamples\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> V = view(A, 1:2, :)\n2×2 view(::Array{Int64,2}, 1:2, :) with eltype Int64:\n 1  2\n 3  4\n\njulia> parent(V)\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.parentindices",
    "page": "数组",
    "title": "Base.parentindices",
    "category": "function",
    "text": "parentindices(A)\n\nFrom an array view A, returns the corresponding indices in the parent.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.selectdim",
    "page": "数组",
    "title": "Base.selectdim",
    "category": "function",
    "text": "selectdim(A, d::Integer, i)\n\nReturn a view of all the data of A where the index for dimension d equals i.\n\nEquivalent to view(A,:,:,...,i,:,:,...) where i is in position d.\n\nExamples\n\njulia> A = [1 2 3 4; 5 6 7 8]\n2×4 Array{Int64,2}:\n 1  2  3  4\n 5  6  7  8\n\njulia> selectdim(A, 2, 3)\n2-element view(::Array{Int64,2}, :, 3) with eltype Int64:\n 3\n 7\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.reinterpret",
    "page": "数组",
    "title": "Base.reinterpret",
    "category": "function",
    "text": "reinterpret(type, A)\n\nChange the type-interpretation of a block of memory. For arrays, this constructs a view of the array with the same binary data as the given array, but with the specified element type. For example, reinterpret(Float32, UInt32(7)) interprets the 4 bytes corresponding to UInt32(7) as a Float32.\n\nExamples\n\njulia> reinterpret(Float32, UInt32(7))\n1.0f-44\n\njulia> reinterpret(Float32, UInt32[1 2 3 4 5])\n1×5 reinterpret(Float32, ::Array{UInt32,2}):\n 1.4013e-45  2.8026e-45  4.2039e-45  5.60519e-45  7.00649e-45\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.reshape",
    "page": "数组",
    "title": "Base.reshape",
    "category": "function",
    "text": "reshape(A, dims...) -> AbstractArray\nreshape(A, dims) -> AbstractArray\n\nReturn an array with the same data as A, but with different dimension sizes or number of dimensions. The two arrays share the same underlying data, so that the result is mutable if and only if A is mutable, and setting elements of one alters the values of the other.\n\nThe new dimensions may be specified either as a list of arguments or as a shape tuple. At most one dimension may be specified with a :, in which case its length is computed such that its product with all the specified dimensions is equal to the length of the original array A. The total number of elements must not change.\n\nExamples\n\njulia> A = Vector(1:16)\n16-element Array{Int64,1}:\n  1\n  2\n  3\n  4\n  5\n  6\n  7\n  8\n  9\n 10\n 11\n 12\n 13\n 14\n 15\n 16\n\njulia> reshape(A, (4, 4))\n4×4 Array{Int64,2}:\n 1  5   9  13\n 2  6  10  14\n 3  7  11  15\n 4  8  12  16\n\njulia> reshape(A, 2, :)\n2×8 Array{Int64,2}:\n 1  3  5  7   9  11  13  15\n 2  4  6  8  10  12  14  16\n\njulia> reshape(1:6, 2, 3)\n2×3 reshape(::UnitRange{Int64}, 2, 3) with eltype Int64:\n 1  3  5\n 2  4  6\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.squeeze",
    "page": "数组",
    "title": "Base.squeeze",
    "category": "function",
    "text": "squeeze(A; dims)\n\nRemove the dimensions specified by dims from array A. Elements of dims must be unique and within the range 1:ndims(A). size(A,i) must equal 1 for all i in dims.\n\nExamples\n\njulia> a = reshape(Vector(1:4),(2,2,1,1))\n2×2×1×1 Array{Int64,4}:\n[:, :, 1, 1] =\n 1  3\n 2  4\n\njulia> squeeze(a; dims=3)\n2×2×1 Array{Int64,3}:\n[:, :, 1] =\n 1  3\n 2  4\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.vec",
    "page": "数组",
    "title": "Base.vec",
    "category": "function",
    "text": "vec(a::AbstractArray) -> AbstractVector\n\nReshape the array a as a one-dimensional column vector. Return a if it is already an AbstractVector. The resulting array shares the same underlying data as a, so it will only be mutable if a is mutable, in which case modifying one will also modify the other.\n\nExamples\n\njulia> a = [1 2 3; 4 5 6]\n2×3 Array{Int64,2}:\n 1  2  3\n 4  5  6\n\njulia> vec(a)\n6-element Array{Int64,1}:\n 1\n 4\n 2\n 5\n 3\n 6\n\njulia> vec(1:3)\n1:3\n\nSee also reshape.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#查看（Views，SubArrays和其它查看类型）-1",
    "page": "数组",
    "title": "查看（Views，SubArrays和其它查看类型）",
    "category": "section",
    "text": "<!-- ## Views (SubArrays and other view types) -->Base.view\nBase.@view\nBase.@views\nBase.parent\nBase.parentindices\nBase.selectdim\nBase.reinterpret\nBase.reshape\nBase.squeeze\nBase.vec"
},

{
    "location": "base/arrays/#Base.cat",
    "page": "数组",
    "title": "Base.cat",
    "category": "function",
    "text": "cat(A...; dims=dims)\n\nConcatenate the input arrays along the specified dimensions in the iterable dims. For dimensions not in dims, all input arrays should have the same size, which will also be the size of the output array along that dimension. For dimensions in dims, the size of the output array is the sum of the sizes of the input arrays along that dimension. If dims is a single number, the different arrays are tightly stacked along that dimension. If dims is an iterable containing several dimensions, this allows one to construct block diagonal matrices and their higher-dimensional analogues by simultaneously increasing several dimensions for every new input array and putting zero blocks elsewhere. For example, cat(matrices...; dims=(1,2)) builds a block diagonal matrix, i.e. a block matrix with matrices[1], matrices[2], ... as diagonal blocks and matching zero blocks away from the diagonal.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.vcat",
    "page": "数组",
    "title": "Base.vcat",
    "category": "function",
    "text": "vcat(A...)\n\nConcatenate along dimension 1.\n\nExamples\n\njulia> a = [1 2 3 4 5]\n1×5 Array{Int64,2}:\n 1  2  3  4  5\n\njulia> b = [6 7 8 9 10; 11 12 13 14 15]\n2×5 Array{Int64,2}:\n  6   7   8   9  10\n 11  12  13  14  15\n\njulia> vcat(a,b)\n3×5 Array{Int64,2}:\n  1   2   3   4   5\n  6   7   8   9  10\n 11  12  13  14  15\n\njulia> c = ([1 2 3], [4 5 6])\n([1 2 3], [4 5 6])\n\njulia> vcat(c...)\n2×3 Array{Int64,2}:\n 1  2  3\n 4  5  6\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.hcat",
    "page": "数组",
    "title": "Base.hcat",
    "category": "function",
    "text": "hcat(A...)\n\nConcatenate along dimension 2.\n\nExamples\n\njulia> a = [1; 2; 3; 4; 5]\n5-element Array{Int64,1}:\n 1\n 2\n 3\n 4\n 5\n\njulia> b = [6 7; 8 9; 10 11; 12 13; 14 15]\n5×2 Array{Int64,2}:\n  6   7\n  8   9\n 10  11\n 12  13\n 14  15\n\njulia> hcat(a,b)\n5×3 Array{Int64,2}:\n 1   6   7\n 2   8   9\n 3  10  11\n 4  12  13\n 5  14  15\n\njulia> c = ([1; 2; 3], [4; 5; 6])\n([1, 2, 3], [4, 5, 6])\n\njulia> hcat(c...)\n3×2 Array{Int64,2}:\n 1  4\n 2  5\n 3  6\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.hvcat",
    "page": "数组",
    "title": "Base.hvcat",
    "category": "function",
    "text": "hvcat(rows::Tuple{Vararg{Int}}, values...)\n\nHorizontal and vertical concatenation in one call. This function is called for block matrix syntax. The first argument specifies the number of arguments to concatenate in each block row.\n\nExamples\n\njulia> a, b, c, d, e, f = 1, 2, 3, 4, 5, 6\n(1, 2, 3, 4, 5, 6)\n\njulia> [a b c; d e f]\n2×3 Array{Int64,2}:\n 1  2  3\n 4  5  6\n\njulia> hvcat((3,3), a,b,c,d,e,f)\n2×3 Array{Int64,2}:\n 1  2  3\n 4  5  6\n\njulia> [a b;c d; e f]\n3×2 Array{Int64,2}:\n 1  2\n 3  4\n 5  6\n\njulia> hvcat((2,2,2), a,b,c,d,e,f)\n3×2 Array{Int64,2}:\n 1  2\n 3  4\n 5  6\n\nIf the first argument is a single integer n, then all block rows are assumed to have n block columns.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.vect",
    "page": "数组",
    "title": "Base.vect",
    "category": "function",
    "text": "vect(X...)\n\nCreate a Vector with element type computed from the promote_typeof of the argument, containing the argument list.\n\nExamples\n\njulia> a = Base.vect(UInt8(1), 2.5, 1//2)\n3-element Array{Float64,1}:\n 1.0\n 2.5\n 0.5\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.circshift",
    "page": "数组",
    "title": "Base.circshift",
    "category": "function",
    "text": "circshift(A, shifts)\n\nCircularly shift, i.e. rotate, the data in an array. The second argument is a tuple or vector giving the amount to shift in each dimension, or an integer to shift only in the first dimension.\n\nExamples\n\njulia> b = reshape(Vector(1:16), (4,4))\n4×4 Array{Int64,2}:\n 1  5   9  13\n 2  6  10  14\n 3  7  11  15\n 4  8  12  16\n\njulia> circshift(b, (0,2))\n4×4 Array{Int64,2}:\n  9  13  1  5\n 10  14  2  6\n 11  15  3  7\n 12  16  4  8\n\njulia> circshift(b, (-1,0))\n4×4 Array{Int64,2}:\n 2  6  10  14\n 3  7  11  15\n 4  8  12  16\n 1  5   9  13\n\njulia> a = BitArray([true, true, false, false, true])\n5-element BitArray{1}:\n  true\n  true\n false\n false\n  true\n\njulia> circshift(a, 1)\n5-element BitArray{1}:\n  true\n  true\n  true\n false\n false\n\njulia> circshift(a, -1)\n5-element BitArray{1}:\n  true\n false\n false\n  true\n  true\n\nSee also circshift!.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.circshift!",
    "page": "数组",
    "title": "Base.circshift!",
    "category": "function",
    "text": "circshift!(dest, src, shifts)\n\nCircularly shift, i.e. rotate, the data in src, storing the result in dest. shifts specifies the amount to shift in each dimension.\n\nThe dest array must be distinct from the src array (they cannot alias each other).\n\nSee also circshift.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.circcopy!",
    "page": "数组",
    "title": "Base.circcopy!",
    "category": "function",
    "text": "circcopy!(dest, src)\n\nCopy src to dest, indexing each dimension modulo its length. src and dest must have the same size, but can be offset in their indices; any offset results in a (circular) wraparound. If the arrays have overlapping indices, then on the domain of the overlap dest agrees with src.\n\nExamples\n\njulia> src = reshape(Vector(1:16), (4,4))\n4×4 Array{Int64,2}:\n 1  5   9  13\n 2  6  10  14\n 3  7  11  15\n 4  8  12  16\n\njulia> dest = OffsetArray{Int}(undef, (0:3,2:5))\n\njulia> circcopy!(dest, src)\nOffsetArrays.OffsetArray{Int64,2,Array{Int64,2}} with indices 0:3×2:5:\n 8  12  16  4\n 5   9  13  1\n 6  10  14  2\n 7  11  15  3\n\njulia> dest[1:3,2:4] == src[1:3,2:4]\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.findall-Tuple{Any}",
    "page": "数组",
    "title": "Base.findall",
    "category": "method",
    "text": "findall(A)\n\nReturn a vector I of the true indices or keys of A. If there are no such elements of A, return an empty array. To search for other kinds of values, pass a predicate as the first argument.\n\nIndices or keys are of the same type as those returned by keys(A) and pairs(A).\n\nExamples\n\njulia> A = [true, false, false, true]\n4-element Array{Bool,1}:\n  true\n false\n false\n  true\n\njulia> findall(A)\n2-element Array{Int64,1}:\n 1\n 4\n\njulia> A = [true false; false true]\n2×2 Array{Bool,2}:\n  true  false\n false   true\n\njulia> findall(A)\n2-element Array{CartesianIndex{2},1}:\n CartesianIndex(1, 1)\n CartesianIndex(2, 2)\n\njulia> findall(falses(3))\n0-element Array{Int64,1}\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.findall-Tuple{Function,Any}",
    "page": "数组",
    "title": "Base.findall",
    "category": "method",
    "text": "findall(f::Function, A)\n\nReturn a vector I of the indices or keys of A where f(A[I]) returns true. If there are no such elements of A, return an empty array.\n\nIndices or keys are of the same type as those returned by keys(A) and pairs(A).\n\nExamples\n\njulia> x = [1, 3, 4]\n3-element Array{Int64,1}:\n 1\n 3\n 4\n\njulia> findall(isodd, x)\n2-element Array{Int64,1}:\n 1\n 2\n\njulia> A = [1 2 0; 3 4 0]\n2×3 Array{Int64,2}:\n 1  2  0\n 3  4  0\njulia> findall(isodd, A)\n2-element Array{CartesianIndex{2},1}:\n CartesianIndex(1, 1)\n CartesianIndex(2, 1)\n\njulia> findall(!iszero, A)\n4-element Array{CartesianIndex{2},1}:\n CartesianIndex(1, 1)\n CartesianIndex(2, 1)\n CartesianIndex(1, 2)\n CartesianIndex(2, 2)\n\njulia> d = Dict(:A => 10, :B => -1, :C => 0)\nDict{Symbol,Int64} with 3 entries:\n  :A => 10\n  :B => -1\n  :C => 0\n\njulia> findall(x -> x >= 0, d)\n2-element Array{Symbol,1}:\n :A\n :C\n\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.findfirst-Tuple{Any}",
    "page": "数组",
    "title": "Base.findfirst",
    "category": "method",
    "text": "findfirst(A)\n\nReturn the index or key of the first true value in A. Return nothing if no such value is found. To search for other kinds of values, pass a predicate as the first argument.\n\nIndices or keys are of the same type as those returned by keys(A) and pairs(A).\n\nExamples\n\njulia> A = [false, false, true, false]\n4-element Array{Bool,1}:\n false\n false\n  true\n false\n\njulia> findfirst(A)\n3\n\njulia> findfirst(falses(3)) # returns nothing, but not printed in the REPL\n\njulia> A = [false false; true false]\n2×2 Array{Bool,2}:\n false  false\n  true  false\n\njulia> findfirst(A)\nCartesianIndex(2, 1)\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.findfirst-Tuple{Function,Any}",
    "page": "数组",
    "title": "Base.findfirst",
    "category": "method",
    "text": "findfirst(predicate::Function, A)\n\nReturn the index or key of the first element of A for which predicate returns true. Return nothing if there is no such element.\n\nIndices or keys are of the same type as those returned by keys(A) and pairs(A).\n\nExamples\n\njulia> A = [1, 4, 2, 2]\n4-element Array{Int64,1}:\n 1\n 4\n 2\n 2\n\njulia> findfirst(iseven, A)\n2\n\njulia> findfirst(x -> x>10, A) # returns nothing, but not printed in the REPL\n\njulia> findfirst(isequal(4), A)\n2\n\njulia> A = [1 4; 2 2]\n2×2 Array{Int64,2}:\n 1  4\n 2  2\n\njulia> findfirst(iseven, A)\nCartesianIndex(2, 1)\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.findlast-Tuple{Any}",
    "page": "数组",
    "title": "Base.findlast",
    "category": "method",
    "text": "findlast(A)\n\nReturn the index or key of the last true value in A. Return nothing if there is no true value in A.\n\nIndices or keys are of the same type as those returned by keys(A) and pairs(A).\n\nExamples\n\njulia> A = [true, false, true, false]\n4-element Array{Bool,1}:\n  true\n false\n  true\n false\n\njulia> findlast(A)\n3\n\njulia> A = falses(2,2);\n\njulia> findlast(A) # returns nothing, but not printed in the REPL\n\njulia> A = [true false; true false]\n2×2 Array{Bool,2}:\n true  false\n true  false\n\njulia> findlast(A)\nCartesianIndex(2, 1)\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.findlast-Tuple{Function,Any}",
    "page": "数组",
    "title": "Base.findlast",
    "category": "method",
    "text": "findlast(predicate::Function, A)\n\nReturn the index or key of the last element of A for which predicate returns true. Return nothing if there is no such element.\n\nIndices or keys are of the same type as those returned by keys(A) and pairs(A).\n\nExamples\n\njulia> A = [1, 2, 3, 4]\n4-element Array{Int64,1}:\n 1\n 2\n 3\n 4\n\njulia> findlast(isodd, A)\n3\n\njulia> findlast(x -> x > 5, A) # returns nothing, but not printed in the REPL\n\njulia> A = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> findlast(isodd, A)\nCartesianIndex(2, 1)\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.findnext-Tuple{Any,Integer}",
    "page": "数组",
    "title": "Base.findnext",
    "category": "method",
    "text": "findnext(A, i)\n\nFind the next index after or including i of a true element of A, or nothing if not found.\n\nIndices are of the same type as those returned by keys(A) and pairs(A).\n\nExamples\n\njulia> A = [false, false, true, false]\n4-element Array{Bool,1}:\n false\n false\n  true\n false\n\njulia> findnext(A, 1)\n3\n\njulia> findnext(A, 4) # returns nothing, but not printed in the REPL\n\njulia> A = [false false; true false]\n2×2 Array{Bool,2}:\n false  false\n  true  false\n\njulia> findnext(A, CartesianIndex(1, 1))\nCartesianIndex(2, 1)\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.findnext-Tuple{Function,Any,Integer}",
    "page": "数组",
    "title": "Base.findnext",
    "category": "method",
    "text": "findnext(predicate::Function, A, i)\n\nFind the next index after or including i of an element of A for which predicate returns true, or nothing if not found.\n\nIndices are of the same type as those returned by keys(A) and pairs(A).\n\nExamples\n\njulia> A = [1, 4, 2, 2];\n\njulia> findnext(isodd, A, 1)\n1\n\njulia> findnext(isodd, A, 2) # returns nothing, but not printed in the REPL\n\njulia> A = [1 4; 2 2];\n\njulia> findnext(isodd, A, CartesianIndex(1, 1))\nCartesianIndex(1, 1)\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.findprev-Tuple{Any,Integer}",
    "page": "数组",
    "title": "Base.findprev",
    "category": "method",
    "text": "findprev(A, i)\n\nFind the previous index before or including i of a true element of A, or nothing if not found.\n\nIndices are of the same type as those returned by keys(A) and pairs(A).\n\nExamples\n\njulia> A = [false, false, true, true]\n4-element Array{Bool,1}:\n false\n false\n  true\n  true\n\njulia> findprev(A, 3)\n3\n\njulia> findprev(A, 1) # returns nothing, but not printed in the REPL\n\njulia> A = [false false; true true]\n2×2 Array{Bool,2}:\n false  false\n  true   true\n\njulia> findprev(A, CartesianIndex(2, 1))\nCartesianIndex(2, 1)\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.findprev-Tuple{Function,Any,Integer}",
    "page": "数组",
    "title": "Base.findprev",
    "category": "method",
    "text": "findprev(predicate::Function, A, i)\n\nFind the previous index before or including i of an element of A for which predicate returns true, or nothing if not found.\n\nIndices are of the same type as those returned by keys(A) and pairs(A).\n\nExamples\n\njulia> A = [4, 6, 1, 2]\n4-element Array{Int64,1}:\n 4\n 6\n 1\n 2\n\njulia> findprev(isodd, A, 1) # returns nothing, but not printed in the REPL\n\njulia> findprev(isodd, A, 3)\n3\n\njulia> A = [4 6; 1 2]\n2×2 Array{Int64,2}:\n 4  6\n 1  2\n\njulia> findprev(isodd, A, CartesianIndex(1, 2))\nCartesianIndex(2, 1)\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.permutedims",
    "page": "数组",
    "title": "Base.permutedims",
    "category": "function",
    "text": "permutedims(A::AbstractArray, perm)\n\nPermute the dimensions of array A. perm is a vector specifying a permutation of length ndims(A).\n\nSee also: PermutedDimsArray.\n\nExamples\n\njulia> A = reshape(Vector(1:8), (2,2,2))\n2×2×2 Array{Int64,3}:\n[:, :, 1] =\n 1  3\n 2  4\n\n[:, :, 2] =\n 5  7\n 6  8\n\njulia> permutedims(A, [3, 2, 1])\n2×2×2 Array{Int64,3}:\n[:, :, 1] =\n 1  3\n 5  7\n\n[:, :, 2] =\n 2  4\n 6  8\n\n\n\n\n\npermutedims(m::AbstractMatrix)\n\nPermute the dimensions of the matrix m, by flipping the elements across the diagonal of the matrix. Differs from LinearAlgebra\'s transpose in that the operation is not recursive.\n\nExamples\n\njulia> a = [1 2; 3 4];\n\njulia> b = [5 6; 7 8];\n\njulia> c = [9 10; 11 12];\n\njulia> d = [13 14; 15 16];\n\njulia> X = [[a] [b]; [c] [d]]\n2×2 Array{Array{Int64,2},2}:\n [1 2; 3 4]     [5 6; 7 8]\n [9 10; 11 12]  [13 14; 15 16]\n\njulia> permutedims(X)\n2×2 Array{Array{Int64,2},2}:\n [1 2; 3 4]  [9 10; 11 12]\n [5 6; 7 8]  [13 14; 15 16]\n\njulia> transpose(X)\n2×2 Transpose{Transpose{Int64,Array{Int64,2}},Array{Array{Int64,2},2}}:\n [1 3; 2 4]  [9 11; 10 12]\n [5 7; 6 8]  [13 15; 14 16]\n\n\n\n\n\npermutedims(v::AbstractVector)\n\nReshape vector v into a 1 × length(v) row matrix. Differs from LinearAlgebra\'s transpose in that the operation is not recursive.\n\nExamples\n\njulia> permutedims([1, 2, 3, 4])\n1×4 Array{Int64,2}:\n 1  2  3  4\n\njulia> V = [[[1 2; 3 4]]; [[5 6; 7 8]]]\n2-element Array{Array{Int64,2},1}:\n [1 2; 3 4]\n [5 6; 7 8]\n\njulia> permutedims(V)\n1×2 Array{Array{Int64,2},2}:\n [1 2; 3 4]  [5 6; 7 8]\n\njulia> transpose(V)\n1×2 Transpose{Transpose{Int64,Array{Int64,2}},Array{Array{Int64,2},1}}:\n [1 3; 2 4]  [5 7; 6 8]\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.permutedims!",
    "page": "数组",
    "title": "Base.permutedims!",
    "category": "function",
    "text": "permutedims!(dest, src, perm)\n\nPermute the dimensions of array src and store the result in the array dest. perm is a vector specifying a permutation of length ndims(src). The preallocated array dest should have size(dest) == size(src)[perm] and is completely overwritten. No in-place permutation is supported and unexpected results will happen if src and dest have overlapping memory regions.\n\nSee also permutedims.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.PermutedDimsArrays.PermutedDimsArray",
    "page": "数组",
    "title": "Base.PermutedDimsArrays.PermutedDimsArray",
    "category": "type",
    "text": "PermutedDimsArray(A, perm) -> B\n\nGiven an AbstractArray A, create a view B such that the dimensions appear to be permuted. Similar to permutedims, except that no copying occurs (B shares storage with A).\n\nSee also: permutedims.\n\nExamples\n\njulia> A = rand(3,5,4);\n\njulia> B = PermutedDimsArray(A, (3,1,2));\n\njulia> size(B)\n(4, 3, 5)\n\njulia> B[3,1,2] == A[1,2,3]\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.promote_shape",
    "page": "数组",
    "title": "Base.promote_shape",
    "category": "function",
    "text": "promote_shape(s1, s2)\n\nCheck two array shapes for compatibility, allowing trailing singleton dimensions, and return whichever shape has more dimensions.\n\nExamples\n\njulia> a = fill(1, (3,4,1,1,1));\n\njulia> b = fill(1, (3,4));\n\njulia> promote_shape(a,b)\n(Base.OneTo(3), Base.OneTo(4), Base.OneTo(1), Base.OneTo(1), Base.OneTo(1))\n\njulia> promote_shape((2,3,1,4), (2, 3, 1, 4, 1))\n(2, 3, 1, 4, 1)\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#连接和置换-1",
    "page": "数组",
    "title": "连接和置换",
    "category": "section",
    "text": "<!-- ## Concatenation and permutation -->Base.cat\nBase.vcat\nBase.hcat\nBase.hvcat\nBase.vect\nBase.circshift\nBase.circshift!\nBase.circcopy!\nBase.findall(::Any)\nBase.findall(::Function, ::Any)\nBase.findfirst(::Any)\nBase.findfirst(::Function, ::Any)\nBase.findlast(::Any)\nBase.findlast(::Function, ::Any)\nBase.findnext(::Any, ::Integer)\nBase.findnext(::Function, ::Any, ::Integer)\nBase.findprev(::Any, ::Integer)\nBase.findprev(::Function, ::Any, ::Integer)\nBase.permutedims\nBase.permutedims!\nBase.PermutedDimsArray\nBase.promote_shape"
},

{
    "location": "base/arrays/#Base.accumulate",
    "page": "数组",
    "title": "Base.accumulate",
    "category": "function",
    "text": "accumulate(op, A; dims::Integer, [init])\n\nCumulative operation op along the dimension dims of A (providing dims is optional for vectors). An inital value init may optionally be privided by a keyword argument. See also accumulate! to use a preallocated output array, both for performance and to control the precision of the output (e.g. to avoid overflow). For common operations there are specialized variants of accumulate, see: cumsum, cumprod\n\nExamples\n\njulia> accumulate(+, [1,2,3])\n3-element Array{Int64,1}:\n 1\n 3\n 6\n\njulia> accumulate(*, [1,2,3])\n3-element Array{Int64,1}:\n 1\n 2\n 6\n\njulia> accumulate(+, [1,2,3]; init=100)\n3-element Array{Int64,1}:\n 101\n 103\n 106\n\njulia> accumulate(min, [1,2,-1]; init=0)\n3-element Array{Int64,1}:\n  0\n  0\n -1\n\njulia> accumulate(+, fill(1, 3, 3), dims=1)\n3×3 Array{Int64,2}:\n 1  1  1\n 2  2  2\n 3  3  3\n\njulia> accumulate(+, fill(1, 3, 3), dims=2)\n3×3 Array{Int64,2}:\n 1  2  3\n 1  2  3\n 1  2  3\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.accumulate!",
    "page": "数组",
    "title": "Base.accumulate!",
    "category": "function",
    "text": "accumulate!(op, B, A; [dims], [init])\n\nCumulative operation op on A along the dimension dims, storing the result in B. Providing dims is optional for vectors.  If the keyword argument init is given, its value is used to instantiate the accumulation. See also accumulate.\n\nExamples\n\njulia> x = [1, 0, 2, 0, 3];\n\njulia> y = [0, 0, 0, 0, 0];\n\njulia> accumulate!(+, y, x);\n\njulia> y\n5-element Array{Int64,1}:\n 1\n 1\n 3\n 3\n 6\n\njulia> A = [1 2; 3 4];\n\njulia> B = [0 0; 0 0];\n\njulia> accumulate!(-, B, A, dims=1);\n\njulia> B\n2×2 Array{Int64,2}:\n  1   2\n -2  -2\n\njulia> accumulate!(-, B, A, dims=2);\n\njulia> B\n2×2 Array{Int64,2}:\n 1  -1\n 3  -1\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.cumprod",
    "page": "数组",
    "title": "Base.cumprod",
    "category": "function",
    "text": "cumprod(A; dims::Integer)\n\nCumulative product along the dimension dim. See also cumprod! to use a preallocated output array, both for performance and to control the precision of the output (e.g. to avoid overflow).\n\nExamples\n\njulia> a = [1 2 3; 4 5 6]\n2×3 Array{Int64,2}:\n 1  2  3\n 4  5  6\n\njulia> cumprod(a, dims=1)\n2×3 Array{Int64,2}:\n 1   2   3\n 4  10  18\n\njulia> cumprod(a, dims=2)\n2×3 Array{Int64,2}:\n 1   2    6\n 4  20  120\n\n\n\n\n\ncumprod(x::AbstractVector)\n\nCumulative product of a vector. See also cumprod! to use a preallocated output array, both for performance and to control the precision of the output (e.g. to avoid overflow).\n\nExamples\n\njulia> cumprod(fill(1//2, 3))\n3-element Array{Rational{Int64},1}:\n 1//2\n 1//4\n 1//8\n\njulia> cumprod([fill(1//3, 2, 2) for i in 1:3])\n3-element Array{Array{Rational{Int64},2},1}:\n [1//3 1//3; 1//3 1//3]\n [2//9 2//9; 2//9 2//9]\n [4//27 4//27; 4//27 4//27]\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.cumprod!",
    "page": "数组",
    "title": "Base.cumprod!",
    "category": "function",
    "text": "cumprod!(B, A; dims::Integer)\n\nCumulative product of A along the dimension dims, storing the result in B. See also cumprod.\n\n\n\n\n\ncumprod!(y::AbstractVector, x::AbstractVector)\n\nCumulative product of a vector x, storing the result in y. See also cumprod.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.cumsum",
    "page": "数组",
    "title": "Base.cumsum",
    "category": "function",
    "text": "cumsum(A; dims::Integer)\n\nCumulative sum along the dimension dims. See also cumsum! to use a preallocated output array, both for performance and to control the precision of the output (e.g. to avoid overflow).\n\nExamples\n\njulia> a = [1 2 3; 4 5 6]\n2×3 Array{Int64,2}:\n 1  2  3\n 4  5  6\n\njulia> cumsum(a, dims=1)\n2×3 Array{Int64,2}:\n 1  2  3\n 5  7  9\n\njulia> cumsum(a, dims=2)\n2×3 Array{Int64,2}:\n 1  3   6\n 4  9  15\n\n\n\n\n\ncumsum(x::AbstractVector)\n\nCumulative sum a vector. See also cumsum! to use a preallocated output array, both for performance and to control the precision of the output (e.g. to avoid overflow).\n\nExamples\n\njulia> cumsum([1, 1, 1])\n3-element Array{Int64,1}:\n 1\n 2\n 3\n\njulia> cumsum([fill(1, 2) for i in 1:3])\n3-element Array{Array{Int64,1},1}:\n [1, 1]\n [2, 2]\n [3, 3]\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.cumsum!",
    "page": "数组",
    "title": "Base.cumsum!",
    "category": "function",
    "text": "cumsum!(B, A; dims::Integer)\n\nCumulative sum of A along the dimension dims, storing the result in B. See also cumsum.\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.diff",
    "page": "数组",
    "title": "Base.diff",
    "category": "function",
    "text": "diff(A::AbstractVector)\ndiff(A::AbstractMatrix; dims::Integer)\n\nFinite difference operator of matrix or vector A. If A is a matrix, specify the dimension over which to operate with the dims keyword argument.\n\nExamples\n\njulia> a = [2 4; 6 16]\n2×2 Array{Int64,2}:\n 2   4\n 6  16\n\njulia> diff(a, dims=2)\n2×1 Array{Int64,2}:\n  2\n 10\n\njulia> diff(vec(a))\n3-element Array{Int64,1}:\n  4\n -2\n 12\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.repeat",
    "page": "数组",
    "title": "Base.repeat",
    "category": "function",
    "text": "repeat(A::AbstractArray, counts::Integer...)\n\nConstruct an array by repeating array A a given number of times in each dimension, specified by counts.\n\nExamples\n\njulia> repeat([1, 2, 3], 2)\n6-element Array{Int64,1}:\n 1\n 2\n 3\n 1\n 2\n 3\n\njulia> repeat([1, 2, 3], 2, 3)\n6×3 Array{Int64,2}:\n 1  1  1\n 2  2  2\n 3  3  3\n 1  1  1\n 2  2  2\n 3  3  3\n\n\n\n\n\nrepeat(A::AbstractArray; inner=ntuple(x->1, ndims(A)), outer=ntuple(x->1, ndims(A)))\n\nConstruct an array by repeating the entries of A. The i-th element of inner specifies the number of times that the individual entries of the i-th dimension of A should be repeated. The i-th element of outer specifies the number of times that a slice along the i-th dimension of A should be repeated. If inner or outer are omitted, no repetition is performed.\n\nExamples\n\njulia> repeat(1:2, inner=2)\n4-element Array{Int64,1}:\n 1\n 1\n 2\n 2\n\njulia> repeat(1:2, outer=2)\n4-element Array{Int64,1}:\n 1\n 2\n 1\n 2\n\njulia> repeat([1 2; 3 4], inner=(2, 1), outer=(1, 3))\n4×6 Array{Int64,2}:\n 1  2  1  2  1  2\n 1  2  1  2  1  2\n 3  4  3  4  3  4\n 3  4  3  4  3  4\n\n\n\n\n\nrepeat(s::AbstractString, r::Integer)\n\nRepeat a string r times. This can be written as s^r.\n\nSee also: ^\n\nExamples\n\njulia> repeat(\"ha\", 3)\n\"hahaha\"\n\n\n\n\n\nrepeat(c::AbstractChar, r::Integer) -> String\n\nRepeat a character r times. This can equivalently be accomplished by calling c^r.\n\nExamples\n\njulia> repeat(\'A\', 3)\n\"AAA\"\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.rot180",
    "page": "数组",
    "title": "Base.rot180",
    "category": "function",
    "text": "rot180(A)\n\nRotate matrix A 180 degrees.\n\nExamples\n\njulia> a = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> rot180(a)\n2×2 Array{Int64,2}:\n 4  3\n 2  1\n\n\n\n\n\nrot180(A, k)\n\nRotate matrix A 180 degrees an integer k number of times. If k is even, this is equivalent to a copy.\n\nExamples\n\njulia> a = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> rot180(a,1)\n2×2 Array{Int64,2}:\n 4  3\n 2  1\n\njulia> rot180(a,2)\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.rotl90",
    "page": "数组",
    "title": "Base.rotl90",
    "category": "function",
    "text": "rotl90(A)\n\nRotate matrix A left 90 degrees.\n\nExamples\n\njulia> a = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> rotl90(a)\n2×2 Array{Int64,2}:\n 2  4\n 1  3\n\n\n\n\n\nrotl90(A, k)\n\nRotate matrix A left 90 degrees an integer k number of times. If k is zero or a multiple of four, this is equivalent to a copy.\n\nExamples\n\njulia> a = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> rotl90(a,1)\n2×2 Array{Int64,2}:\n 2  4\n 1  3\n\njulia> rotl90(a,2)\n2×2 Array{Int64,2}:\n 4  3\n 2  1\n\njulia> rotl90(a,3)\n2×2 Array{Int64,2}:\n 3  1\n 4  2\n\njulia> rotl90(a,4)\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.rotr90",
    "page": "数组",
    "title": "Base.rotr90",
    "category": "function",
    "text": "rotr90(A)\n\nRotate matrix A right 90 degrees.\n\nExamples\n\njulia> a = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> rotr90(a)\n2×2 Array{Int64,2}:\n 3  1\n 4  2\n\n\n\n\n\nrotr90(A, k)\n\nRotate matrix A right 90 degrees an integer k number of times. If k is zero or a multiple of four, this is equivalent to a copy.\n\nExamples\n\njulia> a = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> rotr90(a,1)\n2×2 Array{Int64,2}:\n 3  1\n 4  2\n\njulia> rotr90(a,2)\n2×2 Array{Int64,2}:\n 4  3\n 2  1\n\njulia> rotr90(a,3)\n2×2 Array{Int64,2}:\n 2  4\n 1  3\n\njulia> rotr90(a,4)\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.mapslices",
    "page": "数组",
    "title": "Base.mapslices",
    "category": "function",
    "text": "mapslices(f, A; dims)\n\nTransform the given dimensions of array A using function f. f is called on each slice of A of the form A[...,:,...,:,...]. dims is an integer vector specifying where the colons go in this expression. The results are concatenated along the remaining dimensions. For example, if dims is [1,2] and A is 4-dimensional, f is called on A[:,:,i,j] for all i and j.\n\nExamples\n\njulia> a = reshape(Vector(1:16),(2,2,2,2))\n2×2×2×2 Array{Int64,4}:\n[:, :, 1, 1] =\n 1  3\n 2  4\n\n[:, :, 2, 1] =\n 5  7\n 6  8\n\n[:, :, 1, 2] =\n  9  11\n 10  12\n\n[:, :, 2, 2] =\n 13  15\n 14  16\n\njulia> mapslices(sum, a, dims = [1,2])\n1×1×2×2 Array{Int64,4}:\n[:, :, 1, 1] =\n 10\n\n[:, :, 2, 1] =\n 26\n\n[:, :, 1, 2] =\n 42\n\n[:, :, 2, 2] =\n 58\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#数组函数-1",
    "page": "数组",
    "title": "数组函数",
    "category": "section",
    "text": "<!-- ## Array functions -->Base.accumulate\nBase.accumulate!\nBase.cumprod\nBase.cumprod!\nBase.cumsum\nBase.cumsum!\nBase.diff\nBase.repeat\nBase.rot180\nBase.rotl90\nBase.rotr90\nBase.mapslices"
},

{
    "location": "base/arrays/#Base.invperm",
    "page": "数组",
    "title": "Base.invperm",
    "category": "function",
    "text": "invperm(v)\n\nReturn the inverse permutation of v. If B = A[v], then A == B[invperm(v)].\n\nExamples\n\njulia> v = [2; 4; 3; 1];\n\njulia> invperm(v)\n4-element Array{Int64,1}:\n 4\n 1\n 3\n 2\n\njulia> A = [\'a\',\'b\',\'c\',\'d\'];\n\njulia> B = A[v]\n4-element Array{Char,1}:\n \'b\'\n \'d\'\n \'c\'\n \'a\'\n\njulia> B[invperm(v)]\n4-element Array{Char,1}:\n \'a\'\n \'b\'\n \'c\'\n \'d\'\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.isperm",
    "page": "数组",
    "title": "Base.isperm",
    "category": "function",
    "text": "isperm(v) -> Bool\n\nReturn true if v is a valid permutation.\n\nExamples\n\njulia> isperm([1; 2])\ntrue\n\njulia> isperm([1; 3])\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.permute!-Tuple{Any,AbstractArray{T,1} where T}",
    "page": "数组",
    "title": "Base.permute!",
    "category": "method",
    "text": "permute!(v, p)\n\nPermute vector v in-place, according to permutation p. No checking is done to verify that p is a permutation.\n\nTo return a new permutation, use v[p]. Note that this is generally faster than permute!(v,p) for large vectors.\n\nSee also invpermute!.\n\nExamples\n\njulia> A = [1, 1, 3, 4];\n\njulia> perm = [2, 4, 3, 1];\n\njulia> permute!(A, perm);\n\njulia> A\n4-element Array{Int64,1}:\n 1\n 4\n 3\n 1\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.invpermute!",
    "page": "数组",
    "title": "Base.invpermute!",
    "category": "function",
    "text": "invpermute!(v, p)\n\nLike permute!, but the inverse of the given permutation is applied.\n\nExamples\n\njulia> A = [1, 1, 3, 4];\n\njulia> perm = [2, 4, 3, 1];\n\njulia> invpermute!(A, perm);\n\njulia> A\n4-element Array{Int64,1}:\n 4\n 1\n 3\n 1\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.reverse-Tuple{AbstractArray{T,1} where T}",
    "page": "数组",
    "title": "Base.reverse",
    "category": "method",
    "text": "reverse(v [, start=1 [, stop=length(v) ]] )\n\nReturn a copy of v reversed from start to stop.  See also Iterators.reverse for reverse-order iteration without making a copy.\n\nExamples\n\njulia> A = Vector(1:5)\n5-element Array{Int64,1}:\n 1\n 2\n 3\n 4\n 5\n\njulia> reverse(A)\n5-element Array{Int64,1}:\n 5\n 4\n 3\n 2\n 1\n\njulia> reverse(A, 1, 4)\n5-element Array{Int64,1}:\n 4\n 3\n 2\n 1\n 5\n\njulia> reverse(A, 3, 5)\n5-element Array{Int64,1}:\n 1\n 2\n 5\n 4\n 3\n\n\n\n\n\nreverse(A; dims::Integer)\n\nReverse A in dimension dims.\n\nExamples\n\njulia> b = [1 2; 3 4]\n2×2 Array{Int64,2}:\n 1  2\n 3  4\n\njulia> reverse(b, dims=2)\n2×2 Array{Int64,2}:\n 2  1\n 4  3\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.reverseind",
    "page": "数组",
    "title": "Base.reverseind",
    "category": "function",
    "text": "reverseind(v, i)\n\nGiven an index i in reverse(v), return the corresponding index in v so that v[reverseind(v,i)] == reverse(v)[i]. (This can be nontrivial in cases where v contains non-ASCII characters.)\n\nExamples\n\njulia> r = reverse(\"Julia\")\n\"ailuJ\"\n\njulia> for i in 1:length(r)\n           print(r[reverseind(\"Julia\", i)])\n       end\nJulia\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#Base.reverse!",
    "page": "数组",
    "title": "Base.reverse!",
    "category": "function",
    "text": "reverse!(v [, start=1 [, stop=length(v) ]]) -> v\n\nIn-place version of reverse.\n\nExamples\n\njulia> A = Vector(1:5)\n5-element Array{Int64,1}:\n 1\n 2\n 3\n 4\n 5\n\njulia> reverse!(A);\n\njulia> A\n5-element Array{Int64,1}:\n 5\n 4\n 3\n 2\n 1\n\n\n\n\n\n"
},

{
    "location": "base/arrays/#组合-1",
    "page": "数组",
    "title": "组合",
    "category": "section",
    "text": "<!-- ## Combinatorics -->Base.invperm\nBase.isperm\nBase.permute!(::Any, ::AbstractVector)\nBase.invpermute!\nBase.reverse(::AbstractVector; kwargs...)\nBase.reverseind\nBase.reverse!"
},

{
    "location": "base/parallel/#",
    "page": "Tasks",
    "title": "Tasks",
    "category": "page",
    "text": ""
},

{
    "location": "base/parallel/#Core.Task",
    "page": "Tasks",
    "title": "Core.Task",
    "category": "type",
    "text": "Task(func)\n\nCreate a Task (i.e. coroutine) to execute the given function func (which must be callable with no arguments). The task exits when this function returns.\n\nExamples\n\njulia> a() = sum(i for i in 1:1000);\n\njulia> b = Task(a);\n\nIn this example, b is a runnable Task that hasn\'t started yet.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.current_task",
    "page": "Tasks",
    "title": "Base.current_task",
    "category": "function",
    "text": "current_task()\n\nGet the currently running Task.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.istaskdone",
    "page": "Tasks",
    "title": "Base.istaskdone",
    "category": "function",
    "text": "istaskdone(t::Task) -> Bool\n\nDetermine whether a task has exited.\n\nExamples\n\njulia> a2() = sum(i for i in 1:1000);\n\njulia> b = Task(a2);\n\njulia> istaskdone(b)\nfalse\n\njulia> schedule(b);\n\njulia> yield();\n\njulia> istaskdone(b)\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.istaskstarted",
    "page": "Tasks",
    "title": "Base.istaskstarted",
    "category": "function",
    "text": "istaskstarted(t::Task) -> Bool\n\nDetermine whether a task has started executing.\n\nExamples\n\njulia> a3() = sum(i for i in 1:1000);\n\njulia> b = Task(a3);\n\njulia> istaskstarted(b)\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.yield",
    "page": "Tasks",
    "title": "Base.yield",
    "category": "function",
    "text": "yield()\n\nSwitch to the scheduler to allow another scheduled task to run. A task that calls this function is still runnable, and will be restarted immediately if there are no other runnable tasks.\n\n\n\n\n\nyield(t::Task, arg = nothing)\n\nA fast, unfair-scheduling version of schedule(t, arg); yield() which immediately yields to t before calling the scheduler.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.yieldto",
    "page": "Tasks",
    "title": "Base.yieldto",
    "category": "function",
    "text": "yieldto(t::Task, arg = nothing)\n\nSwitch to the given task. The first time a task is switched to, the task\'s function is called with no arguments. On subsequent switches, arg is returned from the task\'s last call to yieldto. This is a low-level call that only switches tasks, not considering states or scheduling in any way. Its use is discouraged.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.task_local_storage-Tuple{Any}",
    "page": "Tasks",
    "title": "Base.task_local_storage",
    "category": "method",
    "text": "task_local_storage(key)\n\nLook up the value of a key in the current task\'s task-local storage.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.task_local_storage-Tuple{Any,Any}",
    "page": "Tasks",
    "title": "Base.task_local_storage",
    "category": "method",
    "text": "task_local_storage(key, value)\n\nAssign a value to a key in the current task\'s task-local storage.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.task_local_storage-Tuple{Function,Any,Any}",
    "page": "Tasks",
    "title": "Base.task_local_storage",
    "category": "method",
    "text": "task_local_storage(body, key, value)\n\nCall the function body with a modified task-local storage, in which value is assigned to key; the previous value of key, or lack thereof, is restored afterwards. Useful for emulating dynamic scoping.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.Condition",
    "page": "Tasks",
    "title": "Base.Condition",
    "category": "type",
    "text": "Condition()\n\nCreate an edge-triggered event source that tasks can wait for. Tasks that call wait on a Condition are suspended and queued. Tasks are woken up when notify is later called on the Condition. Edge triggering means that only tasks waiting at the time notify is called can be woken up. For level-triggered notifications, you must keep extra state to keep track of whether a notification has happened. The Channel type does this, and so can be used for level-triggered events.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.notify",
    "page": "Tasks",
    "title": "Base.notify",
    "category": "function",
    "text": "notify(condition, val=nothing; all=true, error=false)\n\nWake up tasks waiting for a condition, passing them val. If all is true (the default), all waiting tasks are woken, otherwise only one is. If error is true, the passed value is raised as an exception in the woken tasks.\n\nReturn the count of tasks woken up. Return 0 if no tasks are waiting on condition.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.schedule",
    "page": "Tasks",
    "title": "Base.schedule",
    "category": "function",
    "text": "schedule(t::Task, [val]; error=false)\n\nAdd a Task to the scheduler\'s queue. This causes the task to run constantly when the system is otherwise idle, unless the task performs a blocking operation such as wait.\n\nIf a second argument val is provided, it will be passed to the task (via the return value of yieldto) when it runs again. If error is true, the value is raised as an exception in the woken task.\n\nExamples\n\njulia> a5() = sum(i for i in 1:1000);\n\njulia> b = Task(a5);\n\njulia> istaskstarted(b)\nfalse\n\njulia> schedule(b);\n\njulia> yield();\n\njulia> istaskstarted(b)\ntrue\n\njulia> istaskdone(b)\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.@task",
    "page": "Tasks",
    "title": "Base.@task",
    "category": "macro",
    "text": "@task\n\nWrap an expression in a Task without executing it, and return the Task. This only creates a task, and does not run it.\n\nExamples\n\njulia> a1() = sum(i for i in 1:1000);\n\njulia> b = @task a1();\n\njulia> istaskstarted(b)\nfalse\n\njulia> schedule(b);\n\njulia> yield();\n\njulia> istaskdone(b)\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.sleep",
    "page": "Tasks",
    "title": "Base.sleep",
    "category": "function",
    "text": "sleep(seconds)\n\nBlock the current task for a specified number of seconds. The minimum sleep time is 1 millisecond or input of 0.001.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.Channel",
    "page": "Tasks",
    "title": "Base.Channel",
    "category": "type",
    "text": "Channel{T}(sz::Int)\n\nConstructs a Channel with an internal buffer that can hold a maximum of sz objects of type T. put! calls on a full channel block until an object is removed with take!.\n\nChannel(0) constructs an unbuffered channel. put! blocks until a matching take! is called. And vice-versa.\n\nOther constructors:\n\nChannel(Inf): equivalent to Channel{Any}(typemax(Int))\nChannel(sz): equivalent to Channel{Any}(sz)\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.put!-Tuple{Channel,Any}",
    "page": "Tasks",
    "title": "Base.put!",
    "category": "method",
    "text": "put!(c::Channel, v)\n\nAppend an item v to the channel c. Blocks if the channel is full.\n\nFor unbuffered channels, blocks until a take! is performed by a different task.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.take!-Tuple{Channel}",
    "page": "Tasks",
    "title": "Base.take!",
    "category": "method",
    "text": "take!(c::Channel)\n\nRemove and return a value from a Channel. Blocks until data is available.\n\nFor unbuffered channels, blocks until a put! is performed by a different task.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.isready-Tuple{Channel}",
    "page": "Tasks",
    "title": "Base.isready",
    "category": "method",
    "text": "isready(c::Channel)\n\nDetermine whether a Channel has a value stored to it. Returns immediately, does not block.\n\nFor unbuffered channels returns true if there are tasks waiting on a put!.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.fetch-Tuple{Channel}",
    "page": "Tasks",
    "title": "Base.fetch",
    "category": "method",
    "text": "fetch(c::Channel)\n\nWait for and get the first available item from the channel. Does not remove the item. fetch is unsupported on an unbuffered (0-size) channel.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.close-Tuple{Channel}",
    "page": "Tasks",
    "title": "Base.close",
    "category": "method",
    "text": "close(c::Channel)\n\nClose a channel. An exception is thrown by:\n\nput! on a closed channel.\ntake! and fetch on an empty, closed channel.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.bind-Tuple{Channel,Task}",
    "page": "Tasks",
    "title": "Base.bind",
    "category": "method",
    "text": "bind(chnl::Channel, task::Task)\n\nAssociate the lifetime of chnl with a task. Channel chnl is automatically closed when the task terminates. Any uncaught exception in the task is propagated to all waiters on chnl.\n\nThe chnl object can be explicitly closed independent of task termination. Terminating tasks have no effect on already closed Channel objects.\n\nWhen a channel is bound to multiple tasks, the first task to terminate will close the channel. When multiple channels are bound to the same task, termination of the task will close all of the bound channels.\n\nExamples\n\njulia> c = Channel(0);\n\njulia> task = @async foreach(i->put!(c, i), 1:4);\n\njulia> bind(c,task);\n\njulia> for i in c\n           @show i\n       end;\ni = 1\ni = 2\ni = 3\ni = 4\n\njulia> isopen(c)\nfalse\n\njulia> c = Channel(0);\n\njulia> task = @async (put!(c,1);error(\"foo\"));\n\njulia> bind(c,task);\n\njulia> take!(c)\n1\n\njulia> put!(c,1);\nERROR: foo\nStacktrace:\n[...]\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.asyncmap",
    "page": "Tasks",
    "title": "Base.asyncmap",
    "category": "function",
    "text": "asyncmap(f, c...; ntasks=0, batch_size=nothing)\n\nUses multiple concurrent tasks to map f over a collection (or multiple equal length collections). For multiple collection arguments, f is applied elementwise.\n\nntasks specifies the number of tasks to run concurrently. Depending on the length of the collections, if ntasks is unspecified, up to 100 tasks will be used for concurrent mapping.\n\nntasks can also be specified as a zero-arg function. In this case, the number of tasks to run in parallel is checked before processing every element and a new task started if the value of ntasks_func is less than the current number of tasks.\n\nIf batch_size is specified, the collection is processed in batch mode. f must then be a function that must accept a Vector of argument tuples and must return a vector of results. The input vector will have a length of batch_size or less.\n\nThe following examples highlight execution in different tasks by returning the objectid of the tasks in which the mapping function is executed.\n\nFirst, with ntasks undefined, each element is processed in a different task.\n\njulia> tskoid() = objectid(current_task());\n\njulia> asyncmap(x->tskoid(), 1:5)\n5-element Array{UInt64,1}:\n 0x6e15e66c75c75853\n 0x440f8819a1baa682\n 0x9fb3eeadd0c83985\n 0xebd3e35fe90d4050\n 0x29efc93edce2b961\n\njulia> length(unique(asyncmap(x->tskoid(), 1:5)))\n5\n\nWith ntasks=2 all elements are processed in 2 tasks.\n\njulia> asyncmap(x->tskoid(), 1:5; ntasks=2)\n5-element Array{UInt64,1}:\n 0x027ab1680df7ae94\n 0xa23d2f80cd7cf157\n 0x027ab1680df7ae94\n 0xa23d2f80cd7cf157\n 0x027ab1680df7ae94\n\njulia> length(unique(asyncmap(x->tskoid(), 1:5; ntasks=2)))\n2\n\nWith batch_size defined, the mapping function needs to be changed to accept an array of argument tuples and return an array of results. map is used in the modified mapping function to achieve this.\n\njulia> batch_func(input) = map(x->string(\"args_tuple: \", x, \", element_val: \", x[1], \", task: \", tskoid()), input)\nbatch_func (generic function with 1 method)\n\njulia> asyncmap(batch_func, 1:5; ntasks=2, batch_size=2)\n5-element Array{String,1}:\n \"args_tuple: (1,), element_val: 1, task: 9118321258196414413\"\n \"args_tuple: (2,), element_val: 2, task: 4904288162898683522\"\n \"args_tuple: (3,), element_val: 3, task: 9118321258196414413\"\n \"args_tuple: (4,), element_val: 4, task: 4904288162898683522\"\n \"args_tuple: (5,), element_val: 5, task: 9118321258196414413\"\n\nnote: Note\nCurrently, all tasks in Julia are executed in a single OS thread co-operatively. Consequently, asyncmap is beneficial only when the mapping function involves any I/O - disk, network, remote worker invocation, etc.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Base.asyncmap!",
    "page": "Tasks",
    "title": "Base.asyncmap!",
    "category": "function",
    "text": "asyncmap!(f, results, c...; ntasks=0, batch_size=nothing)\n\nLike asyncmap, but stores output in results rather than returning a collection.\n\n\n\n\n\n"
},

{
    "location": "base/parallel/#Tasks-1",
    "page": "Tasks",
    "title": "Tasks",
    "category": "section",
    "text": "Core.Task\nBase.current_task\nBase.istaskdone\nBase.istaskstarted\nBase.yield\nBase.yieldto\nBase.task_local_storage(::Any)\nBase.task_local_storage(::Any, ::Any)\nBase.task_local_storage(::Function, ::Any, ::Any)\nBase.Condition\nBase.notify\nBase.schedule\nBase.@task\nBase.sleep\nBase.Channel\nBase.put!(::Channel, ::Any)\nBase.take!(::Channel)\nBase.isready(::Channel)\nBase.fetch(::Channel)\nBase.close(::Channel)\nBase.bind(c::Channel, task::Task)\nBase.asyncmap\nBase.asyncmap!"
},

{
    "location": "base/multi-threading/#",
    "page": "Multi-Threading",
    "title": "Multi-Threading",
    "category": "page",
    "text": ""
},

{
    "location": "base/multi-threading/#Base.Threads.threadid",
    "page": "Multi-Threading",
    "title": "Base.Threads.threadid",
    "category": "function",
    "text": "Threads.threadid()\n\nGet the ID number of the current thread of execution. The master thread has ID 1.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.nthreads",
    "page": "Multi-Threading",
    "title": "Base.Threads.nthreads",
    "category": "function",
    "text": "Threads.nthreads()\n\nGet the number of threads available to the Julia process. This is the inclusive upper bound on threadid().\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.@threads",
    "page": "Multi-Threading",
    "title": "Base.Threads.@threads",
    "category": "macro",
    "text": "Threads.@threads\n\nA macro to parallelize a for-loop to run with multiple threads. This spawns nthreads() number of threads, splits the iteration space amongst them, and iterates in parallel. A barrier is placed at the end of the loop which waits for all the threads to finish execution, and the loop returns.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.Atomic",
    "page": "Multi-Threading",
    "title": "Base.Threads.Atomic",
    "category": "type",
    "text": "Threads.Atomic{T}\n\nHolds a reference to an object of type T, ensuring that it is only accessed atomically, i.e. in a thread-safe manner.\n\nOnly certain \"simple\" types can be used atomically, namely the primitive boolean, integer, and float-point types. These are Bool, Int8...Int128, UInt8...UInt128, and Float16...Float64.\n\nNew atomic objects can be created from a non-atomic values; if none is specified, the atomic object is initialized with zero.\n\nAtomic objects can be accessed using the [] notation:\n\nExamples\n\njulia> x = Threads.Atomic{Int}(3)\nBase.Threads.Atomic{Int64}(3)\n\njulia> x[] = 1\n1\n\njulia> x[]\n1\n\nAtomic operations use an atomic_ prefix, such as atomic_add!, atomic_xchg!, etc.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.atomic_cas!",
    "page": "Multi-Threading",
    "title": "Base.Threads.atomic_cas!",
    "category": "function",
    "text": "Threads.atomic_cas!(x::Atomic{T}, cmp::T, newval::T) where T\n\nAtomically compare-and-set x\n\nAtomically compares the value in x with cmp. If equal, write newval to x. Otherwise, leaves x unmodified. Returns the old value in x. By comparing the returned value to cmp (via ===) one knows whether x was modified and now holds the new value newval.\n\nFor further details, see LLVM\'s cmpxchg instruction.\n\nThis function can be used to implement transactional semantics. Before the transaction, one records the value in x. After the transaction, the new value is stored only if x has not been modified in the mean time.\n\nExamples\n\njulia> x = Threads.Atomic{Int}(3)\nBase.Threads.Atomic{Int64}(3)\n\njulia> Threads.atomic_cas!(x, 4, 2);\n\njulia> x\nBase.Threads.Atomic{Int64}(3)\n\njulia> Threads.atomic_cas!(x, 3, 2);\n\njulia> x\nBase.Threads.Atomic{Int64}(2)\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.atomic_xchg!",
    "page": "Multi-Threading",
    "title": "Base.Threads.atomic_xchg!",
    "category": "function",
    "text": "Threads.atomic_xchg!(x::Atomic{T}, newval::T) where T\n\nAtomically exchange the value in x\n\nAtomically exchanges the value in x with newval. Returns the old value.\n\nFor further details, see LLVM\'s atomicrmw xchg instruction.\n\nExamples\n\njulia> x = Threads.Atomic{Int}(3)\nBase.Threads.Atomic{Int64}(3)\n\njulia> Threads.atomic_xchg!(x, 2)\n3\n\njulia> x[]\n2\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.atomic_add!",
    "page": "Multi-Threading",
    "title": "Base.Threads.atomic_add!",
    "category": "function",
    "text": "Threads.atomic_add!(x::Atomic{T}, val::T) where T <: ArithmeticTypes\n\nAtomically add val to x\n\nPerforms x[] += val atomically. Returns the old value. Not defined for Atomic{Bool}.\n\nFor further details, see LLVM\'s atomicrmw add instruction.\n\nExamples\n\njulia> x = Threads.Atomic{Int}(3)\nBase.Threads.Atomic{Int64}(3)\n\njulia> Threads.atomic_add!(x, 2)\n3\n\njulia> x[]\n5\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.atomic_sub!",
    "page": "Multi-Threading",
    "title": "Base.Threads.atomic_sub!",
    "category": "function",
    "text": "Threads.atomic_sub!(x::Atomic{T}, val::T) where T <: ArithmeticTypes\n\nAtomically subtract val from x\n\nPerforms x[] -= val atomically. Returns the old value. Not defined for Atomic{Bool}.\n\nFor further details, see LLVM\'s atomicrmw sub instruction.\n\nExamples\n\njulia> x = Threads.Atomic{Int}(3)\nBase.Threads.Atomic{Int64}(3)\n\njulia> Threads.atomic_sub!(x, 2)\n3\n\njulia> x[]\n1\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.atomic_and!",
    "page": "Multi-Threading",
    "title": "Base.Threads.atomic_and!",
    "category": "function",
    "text": "Threads.atomic_and!(x::Atomic{T}, val::T) where T\n\nAtomically bitwise-and x with val\n\nPerforms x[] &= val atomically. Returns the old value.\n\nFor further details, see LLVM\'s atomicrmw and instruction.\n\nExamples\n\njulia> x = Threads.Atomic{Int}(3)\nBase.Threads.Atomic{Int64}(3)\n\njulia> Threads.atomic_and!(x, 2)\n3\n\njulia> x[]\n2\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.atomic_nand!",
    "page": "Multi-Threading",
    "title": "Base.Threads.atomic_nand!",
    "category": "function",
    "text": "Threads.atomic_nand!(x::Atomic{T}, val::T) where T\n\nAtomically bitwise-nand (not-and) x with val\n\nPerforms x[] = ~(x[] & val) atomically. Returns the old value.\n\nFor further details, see LLVM\'s atomicrmw nand instruction.\n\nExamples\n\njulia> x = Threads.Atomic{Int}(3)\nBase.Threads.Atomic{Int64}(3)\n\njulia> Threads.atomic_nand!(x, 2)\n3\n\njulia> x[]\n-3\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.atomic_or!",
    "page": "Multi-Threading",
    "title": "Base.Threads.atomic_or!",
    "category": "function",
    "text": "Threads.atomic_or!(x::Atomic{T}, val::T) where T\n\nAtomically bitwise-or x with val\n\nPerforms x[] |= val atomically. Returns the old value.\n\nFor further details, see LLVM\'s atomicrmw or instruction.\n\nExamples\n\njulia> x = Threads.Atomic{Int}(5)\nBase.Threads.Atomic{Int64}(5)\n\njulia> Threads.atomic_or!(x, 7)\n5\n\njulia> x[]\n7\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.atomic_xor!",
    "page": "Multi-Threading",
    "title": "Base.Threads.atomic_xor!",
    "category": "function",
    "text": "Threads.atomic_xor!(x::Atomic{T}, val::T) where T\n\nAtomically bitwise-xor (exclusive-or) x with val\n\nPerforms x[] $= val atomically. Returns the old value.\n\nFor further details, see LLVM\'s atomicrmw xor instruction.\n\nExamples\n\njulia> x = Threads.Atomic{Int}(5)\nBase.Threads.Atomic{Int64}(5)\n\njulia> Threads.atomic_xor!(x, 7)\n5\n\njulia> x[]\n2\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.atomic_max!",
    "page": "Multi-Threading",
    "title": "Base.Threads.atomic_max!",
    "category": "function",
    "text": "Threads.atomic_max!(x::Atomic{T}, val::T) where T\n\nAtomically store the maximum of x and val in x\n\nPerforms x[] = max(x[], val) atomically. Returns the old value.\n\nFor further details, see LLVM\'s atomicrmw max instruction.\n\nExamples\n\njulia> x = Threads.Atomic{Int}(5)\nBase.Threads.Atomic{Int64}(5)\n\njulia> Threads.atomic_max!(x, 7)\n5\n\njulia> x[]\n7\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.atomic_min!",
    "page": "Multi-Threading",
    "title": "Base.Threads.atomic_min!",
    "category": "function",
    "text": "Threads.atomic_min!(x::Atomic{T}, val::T) where T\n\nAtomically store the minimum of x and val in x\n\nPerforms x[] = min(x[], val) atomically. Returns the old value.\n\nFor further details, see LLVM\'s atomicrmw min instruction.\n\nExamples\n\njulia> x = Threads.Atomic{Int}(7)\nBase.Threads.Atomic{Int64}(7)\n\njulia> Threads.atomic_min!(x, 5)\n7\n\njulia> x[]\n5\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.atomic_fence",
    "page": "Multi-Threading",
    "title": "Base.Threads.atomic_fence",
    "category": "function",
    "text": "Threads.atomic_fence()\n\nInsert a sequential-consistency memory fence\n\nInserts a memory fence with sequentially-consistent ordering semantics. There are algorithms where this is needed, i.e. where an acquire/release ordering is insufficient.\n\nThis is likely a very expensive operation. Given that all other atomic operations in Julia already have acquire/release semantics, explicit fences should not be necessary in most cases.\n\nFor further details, see LLVM\'s fence instruction.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Multi-Threading-1",
    "page": "Multi-Threading",
    "title": "Multi-Threading",
    "category": "section",
    "text": "This experimental interface supports Julia\'s multi-threading capabilities. Types and functions described here might (and likely will) change in the future.Base.Threads.threadid\nBase.Threads.nthreads\nBase.Threads.@threads\nBase.Threads.Atomic\nBase.Threads.atomic_cas!\nBase.Threads.atomic_xchg!\nBase.Threads.atomic_add!\nBase.Threads.atomic_sub!\nBase.Threads.atomic_and!\nBase.Threads.atomic_nand!\nBase.Threads.atomic_or!\nBase.Threads.atomic_xor!\nBase.Threads.atomic_max!\nBase.Threads.atomic_min!\nBase.Threads.atomic_fence"
},

{
    "location": "base/multi-threading/#Base.@threadcall",
    "page": "Multi-Threading",
    "title": "Base.@threadcall",
    "category": "macro",
    "text": "@threadcall((cfunc, clib), rettype, (argtypes...), argvals...)\n\nThe @threadcall macro is called in the same way as ccall but does the work in a different thread. This is useful when you want to call a blocking C function without causing the main julia thread to become blocked. Concurrency is limited by size of the libuv thread pool, which defaults to 4 threads but can be increased by setting the UV_THREADPOOL_SIZE environment variable and restarting the julia process.\n\nNote that the called function should never call back into Julia.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#ccall-using-a-threadpool-(Experimental)-1",
    "page": "Multi-Threading",
    "title": "ccall using a threadpool (Experimental)",
    "category": "section",
    "text": "Base.@threadcall"
},

{
    "location": "base/multi-threading/#Base.Threads.AbstractLock",
    "page": "Multi-Threading",
    "title": "Base.Threads.AbstractLock",
    "category": "type",
    "text": "AbstractLock\n\nAbstract supertype describing types that implement the thread-safe synchronization primitives: lock, trylock, unlock, and islocked.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.lock",
    "page": "Multi-Threading",
    "title": "Base.lock",
    "category": "function",
    "text": "lock(lock)\n\nAcquire the lock when it becomes available. If the lock is already locked by a different task/thread, wait for it to become available.\n\nEach lock must be matched by an unlock.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.unlock",
    "page": "Multi-Threading",
    "title": "Base.unlock",
    "category": "function",
    "text": "unlock(lock)\n\nReleases ownership of the lock.\n\nIf this is a recursive lock which has been acquired before, decrement an internal counter and return immediately.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.trylock",
    "page": "Multi-Threading",
    "title": "Base.trylock",
    "category": "function",
    "text": "trylock(lock) -> Success (Boolean)\n\nAcquire the lock if it is available, and return true if successful. If the lock is already locked by a different task/thread, return false.\n\nEach successful trylock must be matched by an unlock.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.islocked",
    "page": "Multi-Threading",
    "title": "Base.islocked",
    "category": "function",
    "text": "islocked(lock) -> Status (Boolean)\n\nCheck whether the lock is held by any task/thread. This should not be used for synchronization (see instead trylock).\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.ReentrantLock",
    "page": "Multi-Threading",
    "title": "Base.ReentrantLock",
    "category": "type",
    "text": "ReentrantLock()\n\nCreates a reentrant lock for synchronizing Tasks. The same task can acquire the lock as many times as required. Each lock must be matched with an unlock.\n\nThis lock is NOT threadsafe. See Threads.Mutex for a threadsafe lock.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.Mutex",
    "page": "Multi-Threading",
    "title": "Base.Threads.Mutex",
    "category": "type",
    "text": "Mutex()\n\nThese are standard system mutexes for locking critical sections of logic.\n\nOn Windows, this is a critical section object, on pthreads, this is a pthread_mutex_t.\n\nSee also SpinLock for a lighter-weight lock.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.SpinLock",
    "page": "Multi-Threading",
    "title": "Base.Threads.SpinLock",
    "category": "type",
    "text": "SpinLock()\n\nCreate a non-reentrant lock. Recursive use will result in a deadlock. Each lock must be matched with an unlock.\n\nTest-and-test-and-set spin locks are quickest up to about 30ish contending threads. If you have more contention than that, perhaps a lock is the wrong way to synchronize.\n\nSee also RecursiveSpinLock for a version that permits recursion.\n\nSee also Mutex for a more efficient version on one core or if the lock may be held for a considerable length of time.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Threads.RecursiveSpinLock",
    "page": "Multi-Threading",
    "title": "Base.Threads.RecursiveSpinLock",
    "category": "type",
    "text": "RecursiveSpinLock()\n\nCreates a reentrant lock. The same thread can acquire the lock as many times as required. Each lock must be matched with an unlock.\n\nSee also SpinLock for a slightly faster version.\n\nSee also Mutex for a more efficient version on one core or if the lock may be held for a considerable length of time.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.Semaphore",
    "page": "Multi-Threading",
    "title": "Base.Semaphore",
    "category": "type",
    "text": "Semaphore(sem_size)\n\nCreate a counting semaphore that allows at most sem_size acquires to be in use at any time. Each acquire must be matched with a release.\n\nThis construct is NOT threadsafe.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.acquire",
    "page": "Multi-Threading",
    "title": "Base.acquire",
    "category": "function",
    "text": "acquire(s::Semaphore)\n\nWait for one of the sem_size permits to be available, blocking until one can be acquired.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Base.release",
    "page": "Multi-Threading",
    "title": "Base.release",
    "category": "function",
    "text": "release(s::Semaphore)\n\nReturn one permit to the pool, possibly allowing another task to acquire it and resume execution.\n\n\n\n\n\n"
},

{
    "location": "base/multi-threading/#Synchronization-Primitives-1",
    "page": "Multi-Threading",
    "title": "Synchronization Primitives",
    "category": "section",
    "text": "Base.Threads.AbstractLock\nBase.lock\nBase.unlock\nBase.trylock\nBase.islocked\nBase.ReentrantLock\nBase.Threads.Mutex\nBase.Threads.SpinLock\nBase.Threads.RecursiveSpinLock\nBase.Semaphore\nBase.acquire\nBase.release"
},

{
    "location": "base/constants/#",
    "page": "Constants",
    "title": "Constants",
    "category": "page",
    "text": ""
},

{
    "location": "base/constants/#Core.nothing",
    "page": "Constants",
    "title": "Core.nothing",
    "category": "constant",
    "text": "nothing\n\nThe singleton instance of type Nothing, used by convention when there is no value to return (as in a C void function) or when a variable or field holds no value.\n\n\n\n\n\n"
},

{
    "location": "base/constants/#Base.PROGRAM_FILE",
    "page": "Constants",
    "title": "Base.PROGRAM_FILE",
    "category": "constant",
    "text": "PROGRAM_FILE\n\nA string containing the script name passed to Julia from the command line. Note that the script name remains unchanged from within included files. Alternatively see @__FILE__.\n\n\n\n\n\n"
},

{
    "location": "base/constants/#Base.ARGS",
    "page": "Constants",
    "title": "Base.ARGS",
    "category": "constant",
    "text": "ARGS\n\nAn array of the command line arguments passed to Julia, as strings.\n\n\n\n\n\n"
},

{
    "location": "base/constants/#Base.C_NULL",
    "page": "Constants",
    "title": "Base.C_NULL",
    "category": "constant",
    "text": "C_NULL\n\nThe C null pointer constant, sometimes used when calling external code.\n\n\n\n\n\n"
},

{
    "location": "base/constants/#Base.VERSION",
    "page": "Constants",
    "title": "Base.VERSION",
    "category": "constant",
    "text": "VERSION\n\nA VersionNumber object describing which version of Julia is in use. For details see Version Number Literals.\n\n\n\n\n\n"
},

{
    "location": "base/constants/#Base.LOAD_PATH",
    "page": "Constants",
    "title": "Base.LOAD_PATH",
    "category": "constant",
    "text": "LOAD_PATH\n\nAn array of paths for using and import statements to consdier as project environments or package directories when loading code. See Code Loading.\n\n\n\n\n\n"
},

{
    "location": "base/constants/#Base.Sys.BINDIR",
    "page": "Constants",
    "title": "Base.Sys.BINDIR",
    "category": "constant",
    "text": "Sys.BINDIR\n\nA string containing the full path to the directory containing the julia executable.\n\n\n\n\n\n"
},

{
    "location": "base/constants/#Base.Sys.CPU_THREADS",
    "page": "Constants",
    "title": "Base.Sys.CPU_THREADS",
    "category": "constant",
    "text": "Sys.CPU_THREADS\n\nThe number of logical CPU cores available in the system, i.e. the number of threads that the CPU can run concurrently. Note that this is not necessarily the number of CPU cores, for example, in the presence of hyper-threading.\n\nSee Hwloc.jl or CpuId.jl for extended information, including number of physical cores.\n\n\n\n\n\n"
},

{
    "location": "base/constants/#Base.Sys.WORD_SIZE",
    "page": "Constants",
    "title": "Base.Sys.WORD_SIZE",
    "category": "constant",
    "text": "Sys.WORD_SIZE\n\nStandard word size on the current machine, in bits.\n\n\n\n\n\n"
},

{
    "location": "base/constants/#Base.Sys.KERNEL",
    "page": "Constants",
    "title": "Base.Sys.KERNEL",
    "category": "constant",
    "text": "Sys.KERNEL\n\nA symbol representing the name of the operating system, as returned by uname of the build configuration.\n\n\n\n\n\n"
},

{
    "location": "base/constants/#Base.Sys.ARCH",
    "page": "Constants",
    "title": "Base.Sys.ARCH",
    "category": "constant",
    "text": "Sys.ARCH\n\nA symbol representing the architecture of the build configuration.\n\n\n\n\n\n"
},

{
    "location": "base/constants/#Base.Sys.MACHINE",
    "page": "Constants",
    "title": "Base.Sys.MACHINE",
    "category": "constant",
    "text": "Sys.MACHINE\n\nA string containing the build triple.\n\n\n\n\n\n"
},

{
    "location": "base/constants/#lib-constants-1",
    "page": "Constants",
    "title": "Constants",
    "category": "section",
    "text": "Core.nothing\nBase.PROGRAM_FILE\nBase.ARGS\nBase.C_NULL\nBase.VERSION\nBase.LOAD_PATH\nBase.Sys.BINDIR\nBase.Sys.CPU_THREADS\nBase.Sys.WORD_SIZE\nBase.Sys.KERNEL\nBase.Sys.ARCH\nBase.Sys.MACHINESee also:stdin\nstdout\nstderr\nENV\nENDIAN_BOM\nLibc.MS_ASYNC\nLibc.MS_INVALIDATE\nLibc.MS_SYNC"
},

{
    "location": "base/file/#",
    "page": "Filesystem",
    "title": "Filesystem",
    "category": "page",
    "text": ""
},

{
    "location": "base/file/#Base.Filesystem.pwd",
    "page": "Filesystem",
    "title": "Base.Filesystem.pwd",
    "category": "function",
    "text": "pwd() -> AbstractString\n\nGet the current working directory.\n\nExamples\n\njulia> pwd()\n\"/home/JuliaUser\"\n\njulia> cd(\"/home/JuliaUser/Projects/julia\")\n\njulia> pwd()\n\"/home/JuliaUser/Projects/julia\"\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.cd-Tuple{AbstractString}",
    "page": "Filesystem",
    "title": "Base.Filesystem.cd",
    "category": "method",
    "text": "cd(dir::AbstractString=homedir())\n\nSet the current working directory.\n\nExamples\n\njulia> cd(\"/home/JuliaUser/Projects/julia\")\n\njulia> pwd()\n\"/home/JuliaUser/Projects/julia\"\n\njulia> cd()\n\njulia> pwd()\n\"/home/JuliaUser\"\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.cd-Tuple{Function}",
    "page": "Filesystem",
    "title": "Base.Filesystem.cd",
    "category": "method",
    "text": "cd(f::Function, dir::AbstractString=homedir())\n\nTemporarily change the current working directory to dir, apply function f and finally return to the original directory.\n\nExamples\n\njulia> pwd()\n\"/home/JuliaUser\"\n\njulia> cd(readdir, \"/home/JuliaUser/Projects/julia\")\n34-element Array{String,1}:\n \".circleci\"\n \".freebsdci.sh\"\n \".git\"\n \".gitattributes\"\n \".github\"\n ⋮\n \"test\"\n \"ui\"\n \"usr\"\n \"usr-staging\"\n\njulia> pwd()\n\"/home/JuliaUser\"\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.readdir",
    "page": "Filesystem",
    "title": "Base.Filesystem.readdir",
    "category": "function",
    "text": "readdir(dir::AbstractString=\".\") -> Vector{String}\n\nReturn the files and directories in the directory dir (or the current working directory if not given).\n\nExamples\n\njulia> readdir(\"/home/JuliaUser/Projects/julia\")\n34-element Array{String,1}:\n \".circleci\"\n \".freebsdci.sh\"\n \".git\"\n \".gitattributes\"\n \".github\"\n ⋮\n \"test\"\n \"ui\"\n \"usr\"\n \"usr-staging\"\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.walkdir",
    "page": "Filesystem",
    "title": "Base.Filesystem.walkdir",
    "category": "function",
    "text": "walkdir(dir; topdown=true, follow_symlinks=false, onerror=throw)\n\nReturn an iterator that walks the directory tree of a directory. The iterator returns a tuple containing (rootpath, dirs, files). The directory tree can be traversed top-down or bottom-up. If walkdir encounters a SystemError it will rethrow the error by default. A custom error handling function can be provided through onerror keyword argument. onerror is called with a SystemError as argument.\n\nExamples\n\nfor (root, dirs, files) in walkdir(\".\")\n    println(\"Directories in $root\")\n    for dir in dirs\n        println(joinpath(root, dir)) # path to directories\n    end\n    println(\"Files in $root\")\n    for file in files\n        println(joinpath(root, file)) # path to files\n    end\nend\n\njulia> mkpath(\"my/test/dir\");\n\njulia> itr = walkdir(\"my\");\n\njulia> (root, dirs, files) = first(itr)\n(\"my\", [\"test\"], String[])\n\njulia> (root, dirs, files) = first(itr)\n(\"my/test\", [\"dir\"], String[])\n\njulia> (root, dirs, files) = first(itr)\n(\"my/test/dir\", String[], String[])\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.mkdir",
    "page": "Filesystem",
    "title": "Base.Filesystem.mkdir",
    "category": "function",
    "text": "mkdir(path::AbstractString; mode::Unsigned = 0o777)\n\nMake a new directory with name path and permissions mode. mode defaults to 0o777, modified by the current file creation mask. This function never creates more than one directory. If the directory already exists, or some intermediate directories do not exist, this function throws an error. See mkpath for a function which creates all required intermediate directories. Return path.\n\nExamples\n\njulia> mkdir(\"testingdir\")\n\"testingdir\"\n\njulia> cd(\"testingdir\")\n\njulia> pwd()\n\"/home/JuliaUser/testingdir\"\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.mkpath",
    "page": "Filesystem",
    "title": "Base.Filesystem.mkpath",
    "category": "function",
    "text": "mkpath(path::AbstractString; mode::Unsigned = 0o777)\n\nCreate all directories in the given path, with permissions mode. mode defaults to 0o777, modified by the current file creation mask. Return path.\n\nExamples\n\njulia> mkdir(\"testingdir\")\n\"testingdir\"\n\njulia> cd(\"testingdir\")\n\njulia> pwd()\n\"/home/JuliaUser/testingdir\"\n\njulia> mkpath(\"my/test/dir\")\n\"my/test/dir\"\n\njulia> readdir()\n1-element Array{String,1}:\n \"my\"\n\njulia> cd(\"my\")\n\njulia> readdir()\n1-element Array{String,1}:\n \"test\"\n\njulia> readdir(\"test\")\n1-element Array{String,1}:\n \"dir\"\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.symlink",
    "page": "Filesystem",
    "title": "Base.Filesystem.symlink",
    "category": "function",
    "text": "symlink(target::AbstractString, link::AbstractString)\n\nCreates a symbolic link to target with the name link.\n\nnote: Note\nThis function raises an error under operating systems that do not support soft symbolic links, such as Windows XP.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.readlink",
    "page": "Filesystem",
    "title": "Base.Filesystem.readlink",
    "category": "function",
    "text": "readlink(path::AbstractString) -> AbstractString\n\nReturn the target location a symbolic link path points to.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.chmod",
    "page": "Filesystem",
    "title": "Base.Filesystem.chmod",
    "category": "function",
    "text": "chmod(path::AbstractString, mode::Integer; recursive::Bool=false)\n\nChange the permissions mode of path to mode. Only integer modes (e.g. 0o777) are currently supported. If recursive=true and the path is a directory all permissions in that directory will be recursively changed. Return path.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.chown",
    "page": "Filesystem",
    "title": "Base.Filesystem.chown",
    "category": "function",
    "text": "chown(path::AbstractString, owner::Integer, group::Integer=-1)\n\nChange the owner and/or group of path to owner and/or group. If the value entered for owner or group is -1 the corresponding ID will not change. Only integer owners and groups are currently supported. Return path.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.stat",
    "page": "Filesystem",
    "title": "Base.stat",
    "category": "function",
    "text": "stat(file)\n\nReturns a structure whose fields contain information about the file. The fields of the structure are:\n\nName Description\nsize The size (in bytes) of the file\ndevice ID of the device that contains the file\ninode The inode number of the file\nmode The protection mode of the file\nnlink The number of hard links to the file\nuid The user id of the owner of the file\ngid The group id of the file owner\nrdev If this file refers to a device, the ID of the device it refers to\nblksize The file-system preferred block size for the file\nblocks The number of such blocks allocated\nmtime Unix timestamp of when the file was last modified\nctime Unix timestamp of when the file was created\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.lstat",
    "page": "Filesystem",
    "title": "Base.Filesystem.lstat",
    "category": "function",
    "text": "lstat(file)\n\nLike stat, but for symbolic links gets the info for the link itself rather than the file it refers to. This function must be called on a file path rather than a file object or a file descriptor.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.ctime",
    "page": "Filesystem",
    "title": "Base.Filesystem.ctime",
    "category": "function",
    "text": "ctime(file)\n\nEquivalent to stat(file).ctime.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.mtime",
    "page": "Filesystem",
    "title": "Base.Filesystem.mtime",
    "category": "function",
    "text": "mtime(file)\n\nEquivalent to stat(file).mtime.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.filemode",
    "page": "Filesystem",
    "title": "Base.Filesystem.filemode",
    "category": "function",
    "text": "filemode(file)\n\nEquivalent to stat(file).mode.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.filesize",
    "page": "Filesystem",
    "title": "Base.Filesystem.filesize",
    "category": "function",
    "text": "filesize(path...)\n\nEquivalent to stat(file).size.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.uperm",
    "page": "Filesystem",
    "title": "Base.Filesystem.uperm",
    "category": "function",
    "text": "uperm(file)\n\nGet the permissions of the owner of the file as a bitfield of\n\nValue Description\n01 Execute Permission\n02 Write Permission\n04 Read Permission\n\nFor allowed arguments, see stat.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.gperm",
    "page": "Filesystem",
    "title": "Base.Filesystem.gperm",
    "category": "function",
    "text": "gperm(file)\n\nLike uperm but gets the permissions of the group owning the file.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.operm",
    "page": "Filesystem",
    "title": "Base.Filesystem.operm",
    "category": "function",
    "text": "operm(file)\n\nLike uperm but gets the permissions for people who neither own the file nor are a member of the group owning the file\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.cp",
    "page": "Filesystem",
    "title": "Base.Filesystem.cp",
    "category": "function",
    "text": "cp(src::AbstractString, dst::AbstractString; force::Bool=false, follow_symlinks::Bool=false)\n\nCopy the file, link, or directory from src to dest. force=true will first remove an existing dst.\n\nIf follow_symlinks=false, and src is a symbolic link, dst will be created as a symbolic link. If follow_symlinks=true and src is a symbolic link, dst will be a copy of the file or directory src refers to. Return dst.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.download",
    "page": "Filesystem",
    "title": "Base.download",
    "category": "function",
    "text": "download(url::AbstractString, [localfile::AbstractString])\n\nDownload a file from the given url, optionally renaming it to the given local file name. Note that this function relies on the availability of external tools such as curl, wget or fetch to download the file and is provided for convenience. For production use or situations in which more options are needed, please use a package that provides the desired functionality instead.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.mv",
    "page": "Filesystem",
    "title": "Base.Filesystem.mv",
    "category": "function",
    "text": "mv(src::AbstractString, dst::AbstractString; force::Bool=false)\n\nMove the file, link, or directory from src to dst. force=true will first remove an existing dst. Return dst.\n\nExamples\n\njulia> write(\"hello.txt\", \"world\");\n\njulia> mv(\"hello.txt\", \"goodbye.txt\")\n\"goodbye.txt\"\n\njulia> \"hello.txt\" in readdir()\nfalse\n\njulia> readline(\"goodbye.txt\")\n\"world\"\n\njulia> write(\"hello.txt\", \"world2\");\n\njulia> mv(\"hello.txt\", \"goodbye.txt\")\nERROR: ArgumentError: \'goodbye.txt\' exists. `force=true` is required to remove \'goodbye.txt\' before moving.\nStacktrace:\n [1] #checkfor_mv_cp_cptree#10(::Bool, ::Function, ::String, ::String, ::String) at ./file.jl:293\n[...]\n\njulia> mv(\"hello.txt\", \"goodbye.txt\", force=true)\n\"goodbye.txt\"\n\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.rm",
    "page": "Filesystem",
    "title": "Base.Filesystem.rm",
    "category": "function",
    "text": "rm(path::AbstractString; force::Bool=false, recursive::Bool=false)\n\nDelete the file, link, or empty directory at the given path. If force=true is passed, a non-existing path is not treated as error. If recursive=true is passed and the path is a directory, then all contents are removed recursively.\n\nExamples\n\njulia> mkpath(\"my/test/dir\");\n\njulia> rm(\"my\", recursive=true)\n\njulia> rm(\"this_file_does_not_exist\", force=true)\n\njulia> rm(\"this_file_does_not_exist\")\nERROR: unlink: no such file or directory (ENOENT)\nStacktrace:\n[...]\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.touch",
    "page": "Filesystem",
    "title": "Base.Filesystem.touch",
    "category": "function",
    "text": "touch(path::AbstractString)\n\nUpdate the last-modified timestamp on a file to the current time. Return path.\n\nExamples\n\njulia> write(\"my_little_file\", 2);\n\njulia> mtime(\"my_little_file\")\n1.5273815391135583e9\n\njulia> touch(\"my_little_file\");\n\njulia> mtime(\"my_little_file\")\n1.527381559163435e9\n\nWe can see the mtime has been modified by touch.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.tempname",
    "page": "Filesystem",
    "title": "Base.Filesystem.tempname",
    "category": "function",
    "text": "tempname()\n\nGenerate a temporary file path. This function only returns a path; no file is created. The path is likely to be unique, but this cannot be guaranteed.\n\nwarning: Warning\nThis can lead to race conditions if another process obtains the same file name and creates the file before you are able to. Using mktemp() is recommended instead.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.tempdir",
    "page": "Filesystem",
    "title": "Base.Filesystem.tempdir",
    "category": "function",
    "text": "tempdir()\n\nObtain the path of a temporary directory (possibly shared with other processes).\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.mktemp-Tuple{Any}",
    "page": "Filesystem",
    "title": "Base.Filesystem.mktemp",
    "category": "method",
    "text": "mktemp(parent=tempdir())\n\nReturn (path, io), where path is the path of a new temporary file in parent and io is an open file object for this path.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.mktemp-Tuple{Function,Any}",
    "page": "Filesystem",
    "title": "Base.Filesystem.mktemp",
    "category": "method",
    "text": "mktemp(f::Function, parent=tempdir())\n\nApply the function f to the result of mktemp(parent) and remove the temporary file upon completion.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.mktempdir-Tuple{Any}",
    "page": "Filesystem",
    "title": "Base.Filesystem.mktempdir",
    "category": "method",
    "text": "mktempdir(parent=tempdir())\n\nCreate a temporary directory in the parent directory and return its path. If parent does not exist, throw an error.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.mktempdir-Tuple{Function,Any}",
    "page": "Filesystem",
    "title": "Base.Filesystem.mktempdir",
    "category": "method",
    "text": "mktempdir(f::Function, parent=tempdir())\n\nApply the function f to the result of mktempdir(parent) and remove the temporary directory upon completion.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.isblockdev",
    "page": "Filesystem",
    "title": "Base.Filesystem.isblockdev",
    "category": "function",
    "text": "isblockdev(path) -> Bool\n\nReturn true if path is a block device, false otherwise.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.ischardev",
    "page": "Filesystem",
    "title": "Base.Filesystem.ischardev",
    "category": "function",
    "text": "ischardev(path) -> Bool\n\nReturn true if path is a character device, false otherwise.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.isdir",
    "page": "Filesystem",
    "title": "Base.Filesystem.isdir",
    "category": "function",
    "text": "isdir(path) -> Bool\n\nReturn true if path is a directory, false otherwise.\n\nExamples\n\njulia> isdir(homedir())\ntrue\n\njulia> isdir(\"not/a/directory\")\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.isfifo",
    "page": "Filesystem",
    "title": "Base.Filesystem.isfifo",
    "category": "function",
    "text": "isfifo(path) -> Bool\n\nReturn true if path is a FIFO, false otherwise.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.isfile",
    "page": "Filesystem",
    "title": "Base.Filesystem.isfile",
    "category": "function",
    "text": "isfile(path) -> Bool\n\nReturn true if path is a regular file, false otherwise.\n\nExamples\n\njulia> isfile(homedir())\nfalse\n\njulia> f = open(\"test_file.txt\", \"w\");\n\njulia> isfile(f)\ntrue\n\njulia> close(f); rm(\"test_file.txt\")\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.islink",
    "page": "Filesystem",
    "title": "Base.Filesystem.islink",
    "category": "function",
    "text": "islink(path) -> Bool\n\nReturn true if path is a symbolic link, false otherwise.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.ismount",
    "page": "Filesystem",
    "title": "Base.Filesystem.ismount",
    "category": "function",
    "text": "ismount(path) -> Bool\n\nReturn true if path is a mount point, false otherwise.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.ispath",
    "page": "Filesystem",
    "title": "Base.Filesystem.ispath",
    "category": "function",
    "text": "ispath(path) -> Bool\n\nReturn true if path is a valid filesystem path, false otherwise.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.issetgid",
    "page": "Filesystem",
    "title": "Base.Filesystem.issetgid",
    "category": "function",
    "text": "issetgid(path) -> Bool\n\nReturn true if path has the setgid flag set, false otherwise.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.issetuid",
    "page": "Filesystem",
    "title": "Base.Filesystem.issetuid",
    "category": "function",
    "text": "issetuid(path) -> Bool\n\nReturn true if path has the setuid flag set, false otherwise.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.issocket",
    "page": "Filesystem",
    "title": "Base.Filesystem.issocket",
    "category": "function",
    "text": "issocket(path) -> Bool\n\nReturn true if path is a socket, false otherwise.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.issticky",
    "page": "Filesystem",
    "title": "Base.Filesystem.issticky",
    "category": "function",
    "text": "issticky(path) -> Bool\n\nReturn true if path has the sticky bit set, false otherwise.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.homedir",
    "page": "Filesystem",
    "title": "Base.Filesystem.homedir",
    "category": "function",
    "text": "homedir() -> AbstractString\n\nReturn the current user\'s home directory.\n\nnote: Note\nhomedir determines the home directory via libuv\'s uv_os_homedir. For details (for example on how to specify the home directory via environment variables), see the uv_os_homedir documentation.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.dirname",
    "page": "Filesystem",
    "title": "Base.Filesystem.dirname",
    "category": "function",
    "text": "dirname(path::AbstractString) -> AbstractString\n\nGet the directory part of a path.\n\nExamples\n\njulia> dirname(\"/home/myuser\")\n\"/home\"\n\nSee also: basename\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.basename",
    "page": "Filesystem",
    "title": "Base.Filesystem.basename",
    "category": "function",
    "text": "basename(path::AbstractString) -> AbstractString\n\nGet the file name part of a path.\n\nExamples\n\njulia> basename(\"/home/myuser/example.jl\")\n\"example.jl\"\n\nSee also: dirname\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.@__FILE__",
    "page": "Filesystem",
    "title": "Base.@__FILE__",
    "category": "macro",
    "text": "@__FILE__ -> AbstractString\n\nExpand to a string with the path to the file containing the macrocall, or an empty string if evaluated by julia -e <expr>. Return nothing if the macro was missing parser source information. Alternatively see PROGRAM_FILE.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.@__DIR__",
    "page": "Filesystem",
    "title": "Base.@__DIR__",
    "category": "macro",
    "text": "@__DIR__ -> AbstractString\n\nExpand to a string with the absolute path to the directory of the file containing the macrocall. Return the current working directory if run from a REPL or if evaluated by julia -e <expr>.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.@__LINE__",
    "page": "Filesystem",
    "title": "Base.@__LINE__",
    "category": "macro",
    "text": "@__LINE__ -> Int\n\nExpand to the line number of the location of the macrocall. Return 0 if the line number could not be determined.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.isabspath",
    "page": "Filesystem",
    "title": "Base.Filesystem.isabspath",
    "category": "function",
    "text": "isabspath(path::AbstractString) -> Bool\n\nDetermine whether a path is absolute (begins at the root directory).\n\nExamples\n\njulia> isabspath(\"/home\")\ntrue\n\njulia> isabspath(\"home\")\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.isdirpath",
    "page": "Filesystem",
    "title": "Base.Filesystem.isdirpath",
    "category": "function",
    "text": "isdirpath(path::AbstractString) -> Bool\n\nDetermine whether a path refers to a directory (for example, ends with a path separator).\n\nExamples\n\njulia> isdirpath(\"/home\")\nfalse\n\njulia> isdirpath(\"/home/\")\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.joinpath",
    "page": "Filesystem",
    "title": "Base.Filesystem.joinpath",
    "category": "function",
    "text": "joinpath(parts...) -> AbstractString\n\nJoin path components into a full path. If some argument is an absolute path or (on Windows) has a drive specification that doesn\'t match the drive computed for the join of the preceding paths, then prior components are dropped.\n\nExamples\n\njulia> joinpath(\"/home/myuser\", \"example.jl\")\n\"/home/myuser/example.jl\"\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.abspath",
    "page": "Filesystem",
    "title": "Base.Filesystem.abspath",
    "category": "function",
    "text": "abspath(path::AbstractString) -> AbstractString\n\nConvert a path to an absolute path by adding the current directory if necessary. Also normalizes the path as in normpath.\n\n\n\n\n\nabspath(path::AbstractString, paths::AbstractString...) -> AbstractString\n\nConvert a set of paths to an absolute path by joining them together and adding the current directory if necessary. Equivalent to abspath(joinpath(path, paths...)).\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.normpath",
    "page": "Filesystem",
    "title": "Base.Filesystem.normpath",
    "category": "function",
    "text": "normpath(path::AbstractString) -> AbstractString\n\nNormalize a path, removing \".\" and \"..\" entries.\n\nExamples\n\njulia> normpath(\"/home/myuser/../example.jl\")\n\"/home/example.jl\"\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.realpath",
    "page": "Filesystem",
    "title": "Base.Filesystem.realpath",
    "category": "function",
    "text": "realpath(path::AbstractString) -> AbstractString\n\nCanonicalize a path by expanding symbolic links and removing \".\" and \"..\" entries.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.relpath",
    "page": "Filesystem",
    "title": "Base.Filesystem.relpath",
    "category": "function",
    "text": "relpath(path::AbstractString, startpath::AbstractString = \".\") -> AbstractString\n\nReturn a relative filepath to path either from the current directory or from an optional start directory. This is a path computation: the filesystem is not accessed to confirm the existence or nature of path or startpath.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.expanduser",
    "page": "Filesystem",
    "title": "Base.Filesystem.expanduser",
    "category": "function",
    "text": "expanduser(path::AbstractString) -> AbstractString\n\nOn Unix systems, replace a tilde character at the start of a path with the current user\'s home directory.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.splitdir",
    "page": "Filesystem",
    "title": "Base.Filesystem.splitdir",
    "category": "function",
    "text": "splitdir(path::AbstractString) -> (AbstractString, AbstractString)\n\nSplit a path into a tuple of the directory name and file name.\n\nExamples\n\njulia> splitdir(\"/home/myuser\")\n(\"/home\", \"myuser\")\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.splitdrive",
    "page": "Filesystem",
    "title": "Base.Filesystem.splitdrive",
    "category": "function",
    "text": "splitdrive(path::AbstractString) -> (AbstractString, AbstractString)\n\nOn Windows, split a path into the drive letter part and the path part. On Unix systems, the first component is always the empty string.\n\n\n\n\n\n"
},

{
    "location": "base/file/#Base.Filesystem.splitext",
    "page": "Filesystem",
    "title": "Base.Filesystem.splitext",
    "category": "function",
    "text": "splitext(path::AbstractString) -> (AbstractString, AbstractString)\n\nIf the last component of a path contains a dot, split the path into everything before the dot and everything including and after the dot. Otherwise, return a tuple of the argument unmodified and the empty string.\n\nExamples\n\njulia> splitext(\"/home/myuser/example.jl\")\n(\"/home/myuser/example\", \".jl\")\n\njulia> splitext(\"/home/myuser/example\")\n(\"/home/myuser/example\", \"\")\n\n\n\n\n\n"
},

{
    "location": "base/file/#Filesystem-1",
    "page": "Filesystem",
    "title": "Filesystem",
    "category": "section",
    "text": "Base.Filesystem.pwd\nBase.Filesystem.cd(::AbstractString)\nBase.Filesystem.cd(::Function)\nBase.Filesystem.readdir\nBase.Filesystem.walkdir\nBase.Filesystem.mkdir\nBase.Filesystem.mkpath\nBase.Filesystem.symlink\nBase.Filesystem.readlink\nBase.Filesystem.chmod\nBase.Filesystem.chown\nBase.stat\nBase.Filesystem.lstat\nBase.Filesystem.ctime\nBase.Filesystem.mtime\nBase.Filesystem.filemode\nBase.Filesystem.filesize\nBase.Filesystem.uperm\nBase.Filesystem.gperm\nBase.Filesystem.operm\nBase.Filesystem.cp\nBase.download\nBase.Filesystem.mv\nBase.Filesystem.rm\nBase.Filesystem.touch\nBase.Filesystem.tempname\nBase.Filesystem.tempdir\nBase.Filesystem.mktemp(::Any)\nBase.Filesystem.mktemp(::Function, ::Any)\nBase.Filesystem.mktempdir(::Any)\nBase.Filesystem.mktempdir(::Function, ::Any)\nBase.Filesystem.isblockdev\nBase.Filesystem.ischardev\nBase.Filesystem.isdir\nBase.Filesystem.isfifo\nBase.Filesystem.isfile\nBase.Filesystem.islink\nBase.Filesystem.ismount\nBase.Filesystem.ispath\nBase.Filesystem.issetgid\nBase.Filesystem.issetuid\nBase.Filesystem.issocket\nBase.Filesystem.issticky\nBase.Filesystem.homedir\nBase.Filesystem.dirname\nBase.Filesystem.basename\nBase.@__FILE__\nBase.@__DIR__\nBase.@__LINE__\nBase.Filesystem.isabspath\nBase.Filesystem.isdirpath\nBase.Filesystem.joinpath\nBase.Filesystem.abspath\nBase.Filesystem.normpath\nBase.Filesystem.realpath\nBase.Filesystem.relpath\nBase.Filesystem.expanduser\nBase.Filesystem.splitdir\nBase.Filesystem.splitdrive\nBase.Filesystem.splitext"
},

{
    "location": "base/io-network/#",
    "page": "I/O 和网络（Network）",
    "title": "I/O 和网络（Network）",
    "category": "page",
    "text": ""
},

{
    "location": "base/io-network/#I/O-和网络（Network）-1",
    "page": "I/O 和网络（Network）",
    "title": "I/O 和网络（Network）",
    "category": "section",
    "text": "<!-- # I/O and Network -->"
},

{
    "location": "base/io-network/#Base.stdout",
    "page": "I/O 和网络（Network）",
    "title": "Base.stdout",
    "category": "constant",
    "text": "stdout\n\nGlobal variable referring to the standard out stream.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.stderr",
    "page": "I/O 和网络（Network）",
    "title": "Base.stderr",
    "category": "constant",
    "text": "stderr\n\nGlobal variable referring to the standard error stream.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.stdin",
    "page": "I/O 和网络（Network）",
    "title": "Base.stdin",
    "category": "constant",
    "text": "stdin\n\nGlobal variable referring to the standard input stream.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.open",
    "page": "I/O 和网络（Network）",
    "title": "Base.open",
    "category": "function",
    "text": "open(filename::AbstractString; keywords...) -> IOStream\n\nOpen a file in a mode specified by five boolean keyword arguments:\n\nKeyword Description Default\nread open for reading !write\nwrite open for writing truncate | append\ncreate create if non-existent !read & write | truncate | append\ntruncate truncate to zero size !read & write\nappend seek to end false\n\nThe default when no keywords are passed is to open files for reading only. Returns a stream for accessing the opened file.\n\n\n\n\n\nopen(filename::AbstractString, [mode::AbstractString]) -> IOStream\n\nAlternate syntax for open, where a string-based mode specifier is used instead of the five booleans. The values of mode correspond to those from fopen(3) or Perl open, and are equivalent to setting the following boolean groups:\n\nMode Description Keywords\nr read none\nw write, create, truncate write = true\na write, create, append append = true\nr+ read, write read = true, write = true\nw+ read, write, create, truncate truncate = true, read = true\na+ read, write, create, append append = true, read = true\n\nExamples\n\njulia> io = open(\"myfile.txt\", \"w\");\n\njulia> write(io, \"Hello world!\");\n\njulia> close(io);\n\njulia> io = open(\"myfile.txt\", \"r\");\n\njulia> read(io, String)\n\"Hello world!\"\n\njulia> write(io, \"This file is read only\")\nERROR: ArgumentError: write failed, IOStream is not writeable\n[...]\n\njulia> close(io)\n\njulia> io = open(\"myfile.txt\", \"a\");\n\njulia> write(io, \"This stream is not read only\")\n28\n\njulia> close(io)\n\njulia> rm(\"myfile.txt\")\n\n\n\n\n\nopen(f::Function, args...; kwargs....)\n\nApply the function f to the result of open(args...; kwargs...) and close the resulting file descriptor upon completion.\n\nExamples\n\njulia> open(\"myfile.txt\", \"w\") do io\n           write(io, \"Hello world!\")\n       end;\n\njulia> open(f->read(f, String), \"myfile.txt\")\n\"Hello world!\"\n\njulia> rm(\"myfile.txt\")\n\n\n\n\n\nopen(command, stdio=devnull; write::Bool = false, read::Bool = !write)\n\nStart running command asynchronously, and return a tuple (stream,process).  If read is true, then stream reads from the process\'s standard output and stdio optionally specifies the process\'s standard input stream.  If write is true, then stream writes to the process\'s standard input and stdio optionally specifies the process\'s standard output stream.\n\n\n\n\n\nopen(f::Function, command, mode::AbstractString=\"r\", stdio=devnull)\n\nSimilar to open(command, mode, stdio), but calls f(stream) on the resulting process stream, then closes the input stream and waits for the process to complete. Returns the value returned by f.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.IOBuffer",
    "page": "I/O 和网络（Network）",
    "title": "Base.IOBuffer",
    "category": "type",
    "text": "IOBuffer([data::AbstractVector{UInt8}]; keywords...) -> IOBuffer\n\nCreate an in-memory I/O stream, which may optionally operate on a pre-existing array.\n\nIt may take optional keyword arguments:\n\nread, write, append: restricts operations to the buffer; see open for details.\ntruncate: truncates the buffer size to zero length.\nmaxsize: specifies a size beyond which the buffer may not be grown.\nsizehint: suggests a capacity of the buffer (data must implement sizehint!(data, size)).\n\nWhen data is not given, the buffer will be both readable and writable by default.\n\nExamples\n\njulia> io = IOBuffer();\n\njulia> write(io, \"JuliaLang is a GitHub organization.\", \" It has many members.\")\n56\n\njulia> String(take!(io))\n\"JuliaLang is a GitHub organization. It has many members.\"\n\njulia> io = IOBuffer(b\"JuliaLang is a GitHub organization.\")\nIOBuffer(data=UInt8[...], readable=true, writable=false, seekable=true, append=false, size=35, maxsize=Inf, ptr=1, mark=-1)\n\njulia> read(io, String)\n\"JuliaLang is a GitHub organization.\"\n\njulia> write(io, \"This isn\'t writable.\")\nERROR: ArgumentError: ensureroom failed, IOBuffer is not writeable\n\njulia> io = IOBuffer(UInt8[], read=true, write=true, maxsize=34)\nIOBuffer(data=UInt8[...], readable=true, writable=true, seekable=true, append=false, size=0, maxsize=34, ptr=1, mark=-1)\n\njulia> write(io, \"JuliaLang is a GitHub organization.\")\n34\n\njulia> String(take!(io))\n\"JuliaLang is a GitHub organization\"\n\njulia> length(read(IOBuffer(b\"data\", read=true, truncate=false)))\n4\n\njulia> length(read(IOBuffer(b\"data\", read=true, truncate=true)))\n0\n\n\n\n\n\nIOBuffer(string::String)\n\nCreate a read-only IOBuffer on the data underlying the given string.\n\nExamples\n\njulia> io = IOBuffer(\"Haho\");\n\njulia> String(take!(io))\n\"Haho\"\n\njulia> String(take!(io))\n\"Haho\"\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.take!-Tuple{Base.GenericIOBuffer}",
    "page": "I/O 和网络（Network）",
    "title": "Base.take!",
    "category": "method",
    "text": "take!(b::IOBuffer)\n\nObtain the contents of an IOBuffer as an array, without copying. Afterwards, the IOBuffer is reset to its initial state.\n\nExamples\n\njulia> io = IOBuffer();\n\njulia> write(io, \"JuliaLang is a GitHub organization.\", \" It has many members.\")\n56\n\njulia> String(take!(io))\n\"JuliaLang is a GitHub organization. It has many members.\"\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.fdio",
    "page": "I/O 和网络（Network）",
    "title": "Base.fdio",
    "category": "function",
    "text": "fdio([name::AbstractString, ]fd::Integer[, own::Bool=false]) -> IOStream\n\nCreate an IOStream object from an integer file descriptor. If own is true, closing this object will close the underlying descriptor. By default, an IOStream is closed when it is garbage collected. name allows you to associate the descriptor with a named file.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.flush",
    "page": "I/O 和网络（Network）",
    "title": "Base.flush",
    "category": "function",
    "text": "flush(stream)\n\nCommit all currently buffered writes to the given stream.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.close",
    "page": "I/O 和网络（Network）",
    "title": "Base.close",
    "category": "function",
    "text": "close(stream)\n\nClose an I/O stream. Performs a flush first.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.write",
    "page": "I/O 和网络（Network）",
    "title": "Base.write",
    "category": "function",
    "text": "write(io::IO, x)\nwrite(filename::AbstractString, x)\n\nWrite the canonical binary representation of a value to the given I/O stream or file. Return the number of bytes written into the stream.   See also print to write a text representation (with an encoding that may depend upon io).\n\nYou can write multiple values with the same write call. i.e. the following are equivalent:\n\nwrite(io, x, y...)\nwrite(io, x) + write(io, y...)\n\nExamples\n\njulia> io = IOBuffer();\n\njulia> write(io, \"JuliaLang is a GitHub organization.\", \" It has many members.\")\n56\n\njulia> String(take!(io))\n\"JuliaLang is a GitHub organization. It has many members.\"\n\njulia> write(io, \"Sometimes those members\") + write(io, \" write documentation.\")\n44\n\njulia> String(take!(io))\n\"Sometimes those members write documentation.\"\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.read",
    "page": "I/O 和网络（Network）",
    "title": "Base.read",
    "category": "function",
    "text": "read(io::IO, T)\n\nRead a single value of type T from io, in canonical binary representation.\n\nread(io::IO, String)\n\nRead the entirety of io, as a String.\n\nExamples\n\njulia> io = IOBuffer(\"JuliaLang is a GitHub organization\");\n\njulia> read(io, Char)\n\'J\': ASCII/Unicode U+004a (category Lu: Letter, uppercase)\n\njulia> io = IOBuffer(\"JuliaLang is a GitHub organization\");\n\njulia> read(io, String)\n\"JuliaLang is a GitHub organization\"\n\n\n\n\n\nread(filename::AbstractString, args...)\n\nOpen a file and read its contents. args is passed to read: this is equivalent to open(io->read(io, args...), filename).\n\nread(filename::AbstractString, String)\n\nRead the entire contents of a file as a string.\n\n\n\n\n\nread(s::IO, nb=typemax(Int))\n\nRead at most nb bytes from s, returning a Vector{UInt8} of the bytes read.\n\n\n\n\n\nread(s::IOStream, nb::Integer; all=true)\n\nRead at most nb bytes from s, returning a Vector{UInt8} of the bytes read.\n\nIf all is true (the default), this function will block repeatedly trying to read all requested bytes, until an error or end-of-file occurs. If all is false, at most one read call is performed, and the amount of data returned is device-dependent. Note that not all stream types support the all option.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.read!",
    "page": "I/O 和网络（Network）",
    "title": "Base.read!",
    "category": "function",
    "text": "read!(stream::IO, array::Union{Array, BitArray})\nread!(filename::AbstractString, array::Union{Array, BitArray})\n\nRead binary data from an I/O stream or file, filling in array.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.readbytes!",
    "page": "I/O 和网络（Network）",
    "title": "Base.readbytes!",
    "category": "function",
    "text": "readbytes!(stream::IO, b::AbstractVector{UInt8}, nb=length(b))\n\nRead at most nb bytes from stream into b, returning the number of bytes read. The size of b will be increased if needed (i.e. if nb is greater than length(b) and enough bytes could be read), but it will never be decreased.\n\n\n\n\n\nreadbytes!(stream::IOStream, b::AbstractVector{UInt8}, nb=length(b); all::Bool=true)\n\nRead at most nb bytes from stream into b, returning the number of bytes read. The size of b will be increased if needed (i.e. if nb is greater than length(b) and enough bytes could be read), but it will never be decreased.\n\nSee read for a description of the all option.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.unsafe_read",
    "page": "I/O 和网络（Network）",
    "title": "Base.unsafe_read",
    "category": "function",
    "text": "unsafe_read(io::IO, ref, nbytes::UInt)\n\nCopy nbytes from the IO stream object into ref (converted to a pointer).\n\nIt is recommended that subtypes T<:IO override the following method signature to provide more efficient implementations: unsafe_read(s::T, p::Ptr{UInt8}, n::UInt)\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.unsafe_write",
    "page": "I/O 和网络（Network）",
    "title": "Base.unsafe_write",
    "category": "function",
    "text": "unsafe_write(io::IO, ref, nbytes::UInt)\n\nCopy nbytes from ref (converted to a pointer) into the IO object.\n\nIt is recommended that subtypes T<:IO override the following method signature to provide more efficient implementations: unsafe_write(s::T, p::Ptr{UInt8}, n::UInt)\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.position",
    "page": "I/O 和网络（Network）",
    "title": "Base.position",
    "category": "function",
    "text": "position(s)\n\nGet the current position of a stream.\n\nExamples\n\njulia> io = IOBuffer(\"JuliaLang is a GitHub organization.\");\n\njulia> seek(io, 5);\n\njulia> position(io)\n5\n\njulia> skip(io, 10);\n\njulia> position(io)\n15\n\njulia> seekend(io);\n\njulia> position(io)\n35\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.seek",
    "page": "I/O 和网络（Network）",
    "title": "Base.seek",
    "category": "function",
    "text": "seek(s, pos)\n\nSeek a stream to the given position.\n\nExamples\n\njulia> io = IOBuffer(\"JuliaLang is a GitHub organization.\");\n\njulia> seek(io, 5);\n\njulia> read(io, Char)\n\'L\': ASCII/Unicode U+004c (category Lu: Letter, uppercase)\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.seekstart",
    "page": "I/O 和网络（Network）",
    "title": "Base.seekstart",
    "category": "function",
    "text": "seekstart(s)\n\nSeek a stream to its beginning.\n\nExamples\n\njulia> io = IOBuffer(\"JuliaLang is a GitHub organization.\");\n\njulia> seek(io, 5);\n\njulia> read(io, Char)\n\'L\': ASCII/Unicode U+004c (category Lu: Letter, uppercase)\n\njulia> seekstart(io);\n\njulia> read(io, Char)\n\'J\': ASCII/Unicode U+004a (category Lu: Letter, uppercase)\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.seekend",
    "page": "I/O 和网络（Network）",
    "title": "Base.seekend",
    "category": "function",
    "text": "seekend(s)\n\nSeek a stream to its end.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.skip",
    "page": "I/O 和网络（Network）",
    "title": "Base.skip",
    "category": "function",
    "text": "skip(s, offset)\n\nSeek a stream relative to the current position.\n\nExamples\n\njulia> io = IOBuffer(\"JuliaLang is a GitHub organization.\");\n\njulia> seek(io, 5);\n\njulia> skip(io, 10);\n\njulia> read(io, Char)\n\'G\': ASCII/Unicode U+0047 (category Lu: Letter, uppercase)\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.mark",
    "page": "I/O 和网络（Network）",
    "title": "Base.mark",
    "category": "function",
    "text": "mark(s)\n\nAdd a mark at the current position of stream s. Return the marked position.\n\nSee also unmark, reset, ismarked.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.unmark",
    "page": "I/O 和网络（Network）",
    "title": "Base.unmark",
    "category": "function",
    "text": "unmark(s)\n\nRemove a mark from stream s. Return true if the stream was marked, false otherwise.\n\nSee also mark, reset, ismarked.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.reset",
    "page": "I/O 和网络（Network）",
    "title": "Base.reset",
    "category": "function",
    "text": "reset(s)\n\nReset a stream s to a previously marked position, and remove the mark. Return the previously marked position. Throw an error if the stream is not marked.\n\nSee also mark, unmark, ismarked.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.ismarked",
    "page": "I/O 和网络（Network）",
    "title": "Base.ismarked",
    "category": "function",
    "text": "ismarked(s)\n\nReturn true if stream s is marked.\n\nSee also mark, unmark, reset.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.eof",
    "page": "I/O 和网络（Network）",
    "title": "Base.eof",
    "category": "function",
    "text": "eof(stream) -> Bool\n\nTest whether an I/O stream is at end-of-file. If the stream is not yet exhausted, this function will block to wait for more data if necessary, and then return false. Therefore it is always safe to read one byte after seeing eof return false. eof will return false as long as buffered data is still available, even if the remote end of a connection is closed.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.isreadonly",
    "page": "I/O 和网络（Network）",
    "title": "Base.isreadonly",
    "category": "function",
    "text": "isreadonly(io) -> Bool\n\nDetermine whether a stream is read-only.\n\nExamples\n\njulia> io = IOBuffer(\"JuliaLang is a GitHub organization\");\n\njulia> isreadonly(io)\ntrue\n\njulia> io = IOBuffer();\n\njulia> isreadonly(io)\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.iswritable",
    "page": "I/O 和网络（Network）",
    "title": "Base.iswritable",
    "category": "function",
    "text": "iswritable(io) -> Bool\n\nReturn true if the specified IO object is writable (if that can be determined).\n\nExamples\n\njulia> open(\"myfile.txt\", \"w\") do io\n           print(io, \"Hello world!\");\n           iswritable(io)\n       end\ntrue\n\njulia> open(\"myfile.txt\", \"r\") do io\n           iswritable(io)\n       end\nfalse\n\njulia> rm(\"myfile.txt\")\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.isreadable",
    "page": "I/O 和网络（Network）",
    "title": "Base.isreadable",
    "category": "function",
    "text": "isreadable(io) -> Bool\n\nReturn true if the specified IO object is readable (if that can be determined).\n\nExamples\n\njulia> open(\"myfile.txt\", \"w\") do io\n           print(io, \"Hello world!\");\n           isreadable(io)\n       end\nfalse\n\njulia> open(\"myfile.txt\", \"r\") do io\n           isreadable(io)\n       end\ntrue\n\njulia> rm(\"myfile.txt\")\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.isopen",
    "page": "I/O 和网络（Network）",
    "title": "Base.isopen",
    "category": "function",
    "text": "isopen(object) -> Bool\n\nDetermine whether an object - such as a stream or timer – is not yet closed. Once an object is closed, it will never produce a new event. However, since a closed stream may still have data to read in its buffer, use eof to check for the ability to read data. Use the FileWatching package to be notified when a stream might be writable or readable.\n\nExamples\n\njulia> io = open(\"my_file.txt\", \"w+\");\n\njulia> isopen(io)\ntrue\n\njulia> close(io)\n\njulia> isopen(io)\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.Grisu.print_shortest",
    "page": "I/O 和网络（Network）",
    "title": "Base.Grisu.print_shortest",
    "category": "function",
    "text": "print_shortest(io::IO, x)\n\nPrint the shortest possible representation, with the minimum number of consecutive non-zero digits, of number x, ensuring that it would parse to the exact same number.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.fd",
    "page": "I/O 和网络（Network）",
    "title": "Base.fd",
    "category": "function",
    "text": "fd(stream)\n\nReturn the file descriptor backing the stream or file. Note that this function only applies to synchronous File\'s and IOStream\'s not to any of the asynchronous streams.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.redirect_stdout",
    "page": "I/O 和网络（Network）",
    "title": "Base.redirect_stdout",
    "category": "function",
    "text": "redirect_stdout([stream]) -> (rd, wr)\n\nCreate a pipe to which all C and Julia level stdout output will be redirected. Returns a tuple (rd, wr) representing the pipe ends. Data written to stdout may now be read from the rd end of the pipe. The wr end is given for convenience in case the old stdout object was cached by the user and needs to be replaced elsewhere.\n\nIf called with the optional stream argument, then returns stream itself.\n\nnote: Note\nstream must be a TTY, a Pipe, or a socket.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.redirect_stdout-Tuple{Function,Any}",
    "page": "I/O 和网络（Network）",
    "title": "Base.redirect_stdout",
    "category": "method",
    "text": "redirect_stdout(f::Function, stream)\n\nRun the function f while redirecting stdout to stream. Upon completion, stdout is restored to its prior setting.\n\nnote: Note\nstream must be a TTY, a Pipe, or a socket.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.redirect_stderr",
    "page": "I/O 和网络（Network）",
    "title": "Base.redirect_stderr",
    "category": "function",
    "text": "redirect_stderr([stream]) -> (rd, wr)\n\nLike redirect_stdout, but for stderr.\n\nnote: Note\nstream must be a TTY, a Pipe, or a socket.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.redirect_stderr-Tuple{Function,Any}",
    "page": "I/O 和网络（Network）",
    "title": "Base.redirect_stderr",
    "category": "method",
    "text": "redirect_stderr(f::Function, stream)\n\nRun the function f while redirecting stderr to stream. Upon completion, stderr is restored to its prior setting.\n\nnote: Note\nstream must be a TTY, a Pipe, or a socket.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.redirect_stdin",
    "page": "I/O 和网络（Network）",
    "title": "Base.redirect_stdin",
    "category": "function",
    "text": "redirect_stdin([stream]) -> (rd, wr)\n\nLike redirect_stdout, but for stdin. Note that the order of the return tuple is still (rd, wr), i.e. data to be read from stdin may be written to wr.\n\nnote: Note\nstream must be a TTY, a Pipe, or a socket.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.redirect_stdin-Tuple{Function,Any}",
    "page": "I/O 和网络（Network）",
    "title": "Base.redirect_stdin",
    "category": "method",
    "text": "redirect_stdin(f::Function, stream)\n\nRun the function f while redirecting stdin to stream. Upon completion, stdin is restored to its prior setting.\n\nnote: Note\nstream must be a TTY, a Pipe, or a socket.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.readchomp",
    "page": "I/O 和网络（Network）",
    "title": "Base.readchomp",
    "category": "function",
    "text": "readchomp(x)\n\nRead the entirety of x as a string and remove a single trailing newline if there is one. Equivalent to chomp(read(x, String)).\n\nExamples\n\njulia> open(\"my_file.txt\", \"w\") do io\n           write(io, \"JuliaLang is a GitHub organization.\\nIt has many members.\\n\");\n       end;\n\njulia> readchomp(\"my_file.txt\")\n\"JuliaLang is a GitHub organization.\\nIt has many members.\"\n\njulia> rm(\"my_file.txt\");\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.truncate",
    "page": "I/O 和网络（Network）",
    "title": "Base.truncate",
    "category": "function",
    "text": "truncate(file, n)\n\nResize the file or buffer given by the first argument to exactly n bytes, filling previously unallocated space with \'\\0\' if the file or buffer is grown.\n\nExamples\n\njulia> io = IOBuffer();\n\njulia> write(io, \"JuliaLang is a GitHub organization.\")\n35\n\njulia> truncate(io, 15)\nIOBuffer(data=UInt8[...], readable=true, writable=true, seekable=true, append=false, size=15, maxsize=Inf, ptr=16, mark=-1)\n\njulia> String(take!(io))\n\"JuliaLang is a \"\n\njulia> io = IOBuffer();\n\njulia> write(io, \"JuliaLang is a GitHub organization.\");\n\njulia> truncate(io, 40);\n\njulia> String(take!(io))\n\"JuliaLang is a GitHub organization.\\0\\0\\0\\0\\0\"\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.skipchars",
    "page": "I/O 和网络（Network）",
    "title": "Base.skipchars",
    "category": "function",
    "text": "skipchars(predicate, io::IO; linecomment=nothing)\n\nAdvance the stream io such that the next-read character will be the first remaining for which predicate returns false. If the keyword argument linecomment is specified, all characters from that character until the start of the next line are ignored.\n\nExamples\n\njulia> buf = IOBuffer(\"    text\")\nIOBuffer(data=UInt8[...], readable=true, writable=false, seekable=true, append=false, size=8, maxsize=Inf, ptr=1, mark=-1)\n\njulia> skipchars(isspace, buf)\nIOBuffer(data=UInt8[...], readable=true, writable=false, seekable=true, append=false, size=8, maxsize=Inf, ptr=5, mark=-1)\n\njulia> String(readavailable(buf))\n\"text\"\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.countlines",
    "page": "I/O 和网络（Network）",
    "title": "Base.countlines",
    "category": "function",
    "text": "countlines(io::IO; eol::AbstractChar = \'\\n\')\n\nRead io until the end of the stream/file and count the number of lines. To specify a file pass the filename as the first argument. EOL markers other than \'\\n\' are supported by passing them as the second argument.  The last non-empty line of io is counted even if it does not end with the EOL, matching the length returned by eachline and readlines.\n\nExamples\n\njulia> io = IOBuffer(\"JuliaLang is a GitHub organization.\\n\");\n\njulia> countlines(io)\n1\n\njulia> io = IOBuffer(\"JuliaLang is a GitHub organization.\");\n\njulia> countlines(io)\n1\n\njulia> countlines(io, eol = \'.\')\n0\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.PipeBuffer",
    "page": "I/O 和网络（Network）",
    "title": "Base.PipeBuffer",
    "category": "function",
    "text": "PipeBuffer(data::Vector{UInt8}=UInt8[]; maxsize::Integer = typemax(Int))\n\nAn IOBuffer that allows reading and performs writes by appending. Seeking and truncating are not supported. See IOBuffer for the available constructors. If data is given, creates a PipeBuffer to operate on a data vector, optionally specifying a size beyond which the underlying Array may not be grown.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.readavailable",
    "page": "I/O 和网络（Network）",
    "title": "Base.readavailable",
    "category": "function",
    "text": "readavailable(stream)\n\nRead all available data on the stream, blocking the task only if no data is available. The result is a Vector{UInt8,1}.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.IOContext",
    "page": "I/O 和网络（Network）",
    "title": "Base.IOContext",
    "category": "type",
    "text": "IOContext\n\nIOContext provides a mechanism for passing output configuration settings among show methods.\n\nIn short, it is an immutable dictionary that is a subclass of IO. It supports standard dictionary operations such as getindex, and can also be used as an I/O stream.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.IOContext-Tuple{IO,Pair}",
    "page": "I/O 和网络（Network）",
    "title": "Base.IOContext",
    "category": "method",
    "text": "IOContext(io::IO, KV::Pair...)\n\nCreate an IOContext that wraps a given stream, adding the specified key=>value pairs to the properties of that stream (note that io can itself be an IOContext).\n\nuse (key => value) in io to see if this particular combination is in the properties set\nuse get(io, key, default) to retrieve the most recent value for a particular key\n\nThe following properties are in common use:\n\n:compact: Boolean specifying that small values should be printed more compactly, e.g. that numbers should be printed with fewer digits. This is set when printing array elements.\n:limit: Boolean specifying that containers should be truncated, e.g. showing … in place of most elements.\n:displaysize: A Tuple{Int,Int} giving the size in rows and columns to use for text output. This can be used to override the display size for called functions, but to get the size of the screen use the displaysize function.\n:typeinfo: a Type characterizing the information already printed concerning the type of the object about to be displayed. This is mainly useful when displaying a collection of objects of the same type, so that redundant type information can be avoided (e.g. [Float16(0)] can be shown as \"Float16[0.0]\" instead of \"Float16[Float16(0.0)]\" : while displaying the elements of the array, the :typeinfo property will be set to Float16).\n:color: Boolean specifying whether ANSI color/escape codes are supported/expected. By default, this is determined by whether io is a compatible terminal and by any --color command-line flag when julia was launched.\n\nExamples\n\njulia> io = IOBuffer();\n\njulia> printstyled(IOContext(io, :color => true), \"string\", color=:red)\n\njulia> String(take!(io))\n\"\\e[31mstring\\e[39m\"\n\njulia> printstyled(io, \"string\", color=:red)\n\njulia> String(take!(io))\n\"string\"\n\njulia> print(IOContext(stdout, :compact => false), 1.12341234)\n1.12341234\njulia> print(IOContext(stdout, :compact => true), 1.12341234)\n1.12341\n\njulia> function f(io::IO)\n           if get(io, :short, false)\n               print(io, \"short\")\n           else\n               print(io, \"loooooong\")\n           end\n       end\nf (generic function with 1 method)\n\njulia> f(stdout)\nloooooong\njulia> f(IOContext(stdout, :short => true))\nshort\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.IOContext-Tuple{IO,IOContext}",
    "page": "I/O 和网络（Network）",
    "title": "Base.IOContext",
    "category": "method",
    "text": "IOContext(io::IO, context::IOContext)\n\nCreate an IOContext that wraps an alternate IO but inherits the properties of context.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#General-I/O-1",
    "page": "I/O 和网络（Network）",
    "title": "General I/O",
    "category": "section",
    "text": "Base.stdout\nBase.stderr\nBase.stdin\nBase.open\nBase.IOBuffer\nBase.take!(::Base.GenericIOBuffer)\nBase.fdio\nBase.flush\nBase.close\nBase.write\nBase.read\nBase.read!\nBase.readbytes!\nBase.unsafe_read\nBase.unsafe_write\nBase.position\nBase.seek\nBase.seekstart\nBase.seekend\nBase.skip\nBase.mark\nBase.unmark\nBase.reset\nBase.ismarked\nBase.eof\nBase.isreadonly\nBase.iswritable\nBase.isreadable\nBase.isopen\nBase.Grisu.print_shortest\nBase.fd\nBase.redirect_stdout\nBase.redirect_stdout(::Function, ::Any)\nBase.redirect_stderr\nBase.redirect_stderr(::Function, ::Any)\nBase.redirect_stdin\nBase.redirect_stdin(::Function, ::Any)\nBase.readchomp\nBase.truncate\nBase.skipchars\nBase.countlines\nBase.PipeBuffer\nBase.readavailable\nBase.IOContext\nBase.IOContext(::IO, ::Pair)\nBase.IOContext(::IO, ::IOContext)"
},

{
    "location": "base/io-network/#Base.show-Tuple{Any}",
    "page": "I/O 和网络（Network）",
    "title": "Base.show",
    "category": "method",
    "text": "show(x)\n\nWrite an informative text representation of a value to the current output stream. New types should overload show(io, x) where the first argument is a stream. The representation used by show generally includes Julia-specific formatting and type information.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.summary",
    "page": "I/O 和网络（Network）",
    "title": "Base.summary",
    "category": "function",
    "text": "summary(io::IO, x)\nstr = summary(x)\n\nPrint to a stream io, or return a string str, giving a brief description of a value. By default returns string(typeof(x)), e.g. Int64.\n\nFor arrays, returns a string of size and type info, e.g. 10-element Array{Int64,1}.\n\nExamples\n\njulia> summary(1)\n\"Int64\"\n\njulia> summary(zeros(2))\n\"2-element Array{Float64,1}\"\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.print",
    "page": "I/O 和网络（Network）",
    "title": "Base.print",
    "category": "function",
    "text": "print([io::IO], xs...)\n\nWrite to io (or to the default output stream stdout if io is not given) a canonical (un-decorated) text representation of values xs if there is one, otherwise call show. The representation used by print includes minimal formatting and tries to avoid Julia-specific details.\n\nPrinting nothing is deprecated and will throw an error in the future.\n\nExamples\n\njulia> print(\"Hello World!\")\nHello World!\njulia> io = IOBuffer();\n\njulia> print(io, \"Hello\", \' \', :World!)\n\njulia> String(take!(io))\n\"Hello World!\"\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.println",
    "page": "I/O 和网络（Network）",
    "title": "Base.println",
    "category": "function",
    "text": "println([io::IO], xs...)\n\nPrint (using print) xs followed by a newline. If io is not supplied, prints to stdout.\n\nExamples\n\njulia> println(\"Hello, world\")\nHello, world\n\njulia> io = IOBuffer();\n\njulia> println(io, \"Hello, world\")\n\njulia> String(take!(io))\n\"Hello, world\\n\"\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.printstyled",
    "page": "I/O 和网络（Network）",
    "title": "Base.printstyled",
    "category": "function",
    "text": "printstyled([io], xs...; bold::Bool=false, color::Union{Symbol,Int}=:normal)\n\nPrint xs in a color specified as a symbol or integer, optionally in bold.\n\ncolor may take any of the values :normal, :default, :bold, :black, :blink, :blue, :cyan, :green, :hidden, :light_black, :light_blue, :light_cyan, :light_green, :light_magenta, :light_red, :light_yellow, :magenta, :nothing, :red, :reverse, :underline, :white, or  :yellow or an integer between 0 and 255 inclusive. Note that not all terminals support 256 colors. If the keyword bold is given as true, the result will be printed in bold.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.sprint",
    "page": "I/O 和网络（Network）",
    "title": "Base.sprint",
    "category": "function",
    "text": "sprint(f::Function, args...; context=nothing, sizehint=0)\n\nCall the given function with an I/O stream and the supplied extra arguments. Everything written to this I/O stream is returned as a string. context can be either an IOContext whose properties will be used, or a Pair specifying a property and its value. sizehint suggests the capacity of the buffer (in bytes).\n\nThe optional keyword argument context can be set to :key=>value pair or an IO or IOContext object whose attributes are used for the I/O stream passed to f.  The optional sizehint is a suggersted (in bytes) to allocate for the buffer used to write the string.\n\nExamples\n\njulia> sprint(show, 66.66666; context=:compact => true)\n\"66.6667\"\n\njulia> sprint(showerror, BoundsError([1], 100))\n\"BoundsError: attempt to access 1-element Array{Int64,1} at index [100]\"\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.showerror",
    "page": "I/O 和网络（Network）",
    "title": "Base.showerror",
    "category": "function",
    "text": "showerror(io, e)\n\nShow a descriptive representation of an exception object e. This method is used to display the exception after a call to throw.\n\nExamples\n\njulia> struct MyException <: Exception\n           msg::AbstractString\n       end\n\njulia> function Base.showerror(io::IO, err::MyException)\n           print(io, \"MyException: \")\n           print(io, err.msg)\n       end\n\njulia> err = MyException(\"test exception\")\nMyException(\"test exception\")\n\njulia> sprint(showerror, err)\n\"MyException: test exception\"\n\njulia> throw(MyException(\"test exception\"))\nERROR: MyException: test exception\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.dump",
    "page": "I/O 和网络（Network）",
    "title": "Base.dump",
    "category": "function",
    "text": "dump(x; maxdepth=8)\n\nShow every part of the representation of a value. The depth of the output is truncated at maxdepth.\n\nExamples\n\njulia> struct MyStruct\n           x\n           y\n       end\n\njulia> x = MyStruct(1, (2,3));\n\njulia> dump(x)\nMyStruct\n  x: Int64 1\n  y: Tuple{Int64,Int64}\n    1: Int64 2\n    2: Int64 3\n\njulia> dump(x; maxdepth = 1)\nMyStruct\n  x: Int64 1\n  y: Tuple{Int64,Int64}\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.Meta.@dump",
    "page": "I/O 和网络（Network）",
    "title": "Base.Meta.@dump",
    "category": "macro",
    "text": "@dump expr\n\nShow every part of the representation of the given expression. Equivalent to dump(:(expr)).\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.readline",
    "page": "I/O 和网络（Network）",
    "title": "Base.readline",
    "category": "function",
    "text": "readline(io::IO=stdin; keep::Bool=false)\nreadline(filename::AbstractString; keep::Bool=false)\n\nRead a single line of text from the given I/O stream or file (defaults to stdin). When reading from a file, the text is assumed to be encoded in UTF-8. Lines in the input end with \'\\n\' or \"\\r\\n\" or the end of an input stream. When keep is false (as it is by default), these trailing newline characters are removed from the line before it is returned. When keep is true, they are returned as part of the line.\n\nExamples\n\njulia> open(\"my_file.txt\", \"w\") do io\n           write(io, \"JuliaLang is a GitHub organization.\\nIt has many members.\\n\");\n       end\n57\n\njulia> readline(\"my_file.txt\")\n\"JuliaLang is a GitHub organization.\"\n\njulia> readline(\"my_file.txt\", keep=true)\n\"JuliaLang is a GitHub organization.\\n\"\n\njulia> rm(\"my_file.txt\")\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.readuntil",
    "page": "I/O 和网络（Network）",
    "title": "Base.readuntil",
    "category": "function",
    "text": "readuntil(stream::IO, delim; keep::Bool = false)\nreaduntil(filename::AbstractString, delim; keep::Bool = false)\n\nRead a string from an I/O stream or a file, up to the given delimiter. The delimiter can be a UInt8, AbstractChar, string, or vector. Keyword argument keep controls whether the delimiter is included in the result. The text is assumed to be encoded in UTF-8.\n\nExamples\n\njulia> open(\"my_file.txt\", \"w\") do io\n           write(io, \"JuliaLang is a GitHub organization.\\nIt has many members.\\n\");\n       end\n57\n\njulia> readuntil(\"my_file.txt\", \'L\')\n\"Julia\"\n\njulia> readuntil(\"my_file.txt\", \'.\', keep = true)\n\"JuliaLang is a GitHub organization.\"\n\njulia> rm(\"my_file.txt\")\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.readlines",
    "page": "I/O 和网络（Network）",
    "title": "Base.readlines",
    "category": "function",
    "text": "readlines(io::IO=stdin; keep::Bool=false)\nreadlines(filename::AbstractString; keep::Bool=false)\n\nRead all lines of an I/O stream or a file as a vector of strings. Behavior is equivalent to saving the result of reading readline repeatedly with the same arguments and saving the resulting lines as a vector of strings.\n\nExamples\n\njulia> open(\"my_file.txt\", \"w\") do io\n           write(io, \"JuliaLang is a GitHub organization.\\nIt has many members.\\n\");\n       end\n57\n\njulia> readlines(\"my_file.txt\")\n2-element Array{String,1}:\n \"JuliaLang is a GitHub organization.\"\n \"It has many members.\"\n\njulia> readlines(\"my_file.txt\", keep=true)\n2-element Array{String,1}:\n \"JuliaLang is a GitHub organization.\\n\"\n \"It has many members.\\n\"\n\njulia> rm(\"my_file.txt\")\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.eachline",
    "page": "I/O 和网络（Network）",
    "title": "Base.eachline",
    "category": "function",
    "text": "eachline(io::IO=stdin; keep::Bool=false)\neachline(filename::AbstractString; keep::Bool=false)\n\nCreate an iterable EachLine object that will yield each line from an I/O stream or a file. Iteration calls readline on the stream argument repeatedly with keep passed through, determining whether trailing end-of-line characters are retained. When called with a file name, the file is opened once at the beginning of iteration and closed at the end. If iteration is interrupted, the file will be closed when the EachLine object is garbage collected.\n\nExamples\n\njulia> open(\"my_file.txt\", \"w\") do io\n           write(io, \"JuliaLang is a GitHub organization.\\n It has many members.\\n\");\n       end;\n\njulia> for line in eachline(\"my_file.txt\")\n           print(line)\n       end\nJuliaLang is a GitHub organization. It has many members.\n\njulia> rm(\"my_file.txt\");\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.displaysize",
    "page": "I/O 和网络（Network）",
    "title": "Base.displaysize",
    "category": "function",
    "text": "displaysize([io::IO]) -> (lines, columns)\n\nReturn the nominal size of the screen that may be used for rendering output to this IO object. If no input is provided, the environment variables LINES and COLUMNS are read. If those are not set, a default size of (24, 80) is returned.\n\nExamples\n\njulia> withenv(\"LINES\" => 30, \"COLUMNS\" => 100) do\n           displaysize()\n       end\n(30, 100)\n\nTo get your TTY size,\n\njulia> displaysize(stdout)\n(34, 147)\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Text-I/O-1",
    "page": "I/O 和网络（Network）",
    "title": "Text I/O",
    "category": "section",
    "text": "Base.show(::Any)\nBase.summary\nBase.print\nBase.println\nBase.printstyled\nBase.sprint\nBase.showerror\nBase.dump\nMeta.@dump\nBase.readline\nBase.readuntil\nBase.readlines\nBase.eachline\nBase.displaysize"
},

{
    "location": "base/io-network/#Base.Multimedia.display",
    "page": "I/O 和网络（Network）",
    "title": "Base.Multimedia.display",
    "category": "function",
    "text": "display(x)\ndisplay(d::AbstractDisplay, x)\ndisplay(mime, x)\ndisplay(d::AbstractDisplay, mime, x)\n\nAbstractDisplay x using the topmost applicable display in the display stack, typically using the richest supported multimedia output for x, with plain-text stdout output as a fallback. The display(d, x) variant attempts to display x on the given display d only, throwing a MethodError if d cannot display objects of this type.\n\nIn general, you cannot assume that display output goes to stdout (unlike print(x) or show(x)).  For example, display(x) may open up a separate window with an image. display(x) means \"show x in the best way you can for the current output device(s).\" If you want REPL-like text output that is guaranteed to go to stdout, use show(stdout, \"text/plain\", x) instead.\n\nThere are also two variants with a mime argument (a MIME type string, such as \"image/png\"), which attempt to display x using the requested MIME type only, throwing a MethodError if this type is not supported by either the display(s) or by x. With these variants, one can also supply the \"raw\" data in the requested MIME type by passing x::AbstractString (for MIME types with text-based storage, such as text/html or application/postscript) or x::Vector{UInt8} (for binary MIME types).\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.Multimedia.redisplay",
    "page": "I/O 和网络（Network）",
    "title": "Base.Multimedia.redisplay",
    "category": "function",
    "text": "redisplay(x)\nredisplay(d::AbstractDisplay, x)\nredisplay(mime, x)\nredisplay(d::AbstractDisplay, mime, x)\n\nBy default, the redisplay functions simply call display. However, some display backends may override redisplay to modify an existing display of x (if any). Using redisplay is also a hint to the backend that x may be redisplayed several times, and the backend may choose to defer the display until (for example) the next interactive prompt.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.Multimedia.displayable",
    "page": "I/O 和网络（Network）",
    "title": "Base.Multimedia.displayable",
    "category": "function",
    "text": "displayable(mime) -> Bool\ndisplayable(d::AbstractDisplay, mime) -> Bool\n\nReturns a boolean value indicating whether the given mime type (string) is displayable by any of the displays in the current display stack, or specifically by the display d in the second variant.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.show-Tuple{Any,Any,Any}",
    "page": "I/O 和网络（Network）",
    "title": "Base.show",
    "category": "method",
    "text": "show(io, mime, x)\n\nThe display functions ultimately call show in order to write an object x as a given mime type to a given I/O stream io (usually a memory buffer), if possible. In order to provide a rich multimedia representation of a user-defined type T, it is only necessary to define a new show method for T, via: show(io, ::MIME\"mime\", x::T) = ..., where mime is a MIME-type string and the function body calls write (or similar) to write that representation of x to io. (Note that the MIME\"\" notation only supports literal strings; to construct MIME types in a more flexible manner use MIME{Symbol(\"\")}.)\n\nFor example, if you define a MyImage type and know how to write it to a PNG file, you could define a function show(io, ::MIME\"image/png\", x::MyImage) = ... to allow your images to be displayed on any PNG-capable AbstractDisplay (such as IJulia). As usual, be sure to import Base.show in order to add new methods to the built-in Julia function show.\n\nThe default MIME type is MIME\"text/plain\". There is a fallback definition for text/plain output that calls show with 2 arguments. Therefore, this case should be handled by defining a 2-argument show(io::IO, x::MyType) method.\n\nTechnically, the MIME\"mime\" macro defines a singleton type for the given mime string, which allows us to exploit Julia\'s dispatch mechanisms in determining how to display objects of any given type.\n\nThe first argument to show can be an IOContext specifying output format properties. See IOContext for details.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.Multimedia.showable",
    "page": "I/O 和网络（Network）",
    "title": "Base.Multimedia.showable",
    "category": "function",
    "text": "showable(mime, x)\n\nReturns a boolean value indicating whether or not the object x can be written as the given mime type.\n\n(By default, this is determined automatically by the existence of the corresponding show method for typeof(x).  Some types provide custom showable methods; for example, if the available MIME formats depend on the value of x.)\n\nExamples\n\njulia> showable(MIME(\"text/plain\"), rand(5))\ntrue\n\njulia> showable(\"img/png\", rand(5))\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.repr-Tuple{MIME,Any}",
    "page": "I/O 和网络（Network）",
    "title": "Base.repr",
    "category": "method",
    "text": "repr(mime, x; context=nothing)\n\nReturns an AbstractString or Vector{UInt8} containing the representation of x in the requested mime type, as written by show(io, mime, x) (throwing a MethodError if no appropriate show is available). An AbstractString is returned for MIME types with textual representations (such as \"text/html\" or \"application/postscript\"), whereas binary data is returned as Vector{UInt8}. (The function istextmime(mime) returns whether or not Julia treats a given mime type as text.)\n\nThe optional keyword argument context can be set to :key=>value pair or an IO or IOContext object whose attributes are used for the I/O stream passed to show.\n\nAs a special case, if x is an AbstractString (for textual MIME types) or a Vector{UInt8} (for binary MIME types), the repr function assumes that x is already in the requested mime format and simply returns x. This special case does not apply to the \"text/plain\" MIME type. This is useful so that raw data can be passed to display(m::MIME, x).\n\nIn particular, repr(\"text/plain\", x) is typically a \"pretty-printed\" version of x designed for human consumption.  See also repr(x) to instead return a string corresponding to show(x) that may be closer to how the value of x would be entered in Julia.\n\nExamples\n\njulia> A = [1 2; 3 4];\n\njulia> repr(\"text/plain\", A)\n\"2×2 Array{Int64,2}:\\n 1  2\\n 3  4\"\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.Multimedia.pushdisplay",
    "page": "I/O 和网络（Network）",
    "title": "Base.Multimedia.pushdisplay",
    "category": "function",
    "text": "pushdisplay(d::AbstractDisplay)\n\nPushes a new display d on top of the global display-backend stack. Calling display(x) or display(mime, x) will display x on the topmost compatible backend in the stack (i.e., the topmost backend that does not throw a MethodError).\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.Multimedia.popdisplay",
    "page": "I/O 和网络（Network）",
    "title": "Base.Multimedia.popdisplay",
    "category": "function",
    "text": "popdisplay()\npopdisplay(d::AbstractDisplay)\n\nPop the topmost backend off of the display-backend stack, or the topmost copy of d in the second variant.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.Multimedia.TextDisplay",
    "page": "I/O 和网络（Network）",
    "title": "Base.Multimedia.TextDisplay",
    "category": "type",
    "text": "TextDisplay(io::IO)\n\nReturns a TextDisplay <: AbstractDisplay, which displays any object as the text/plain MIME type (by default), writing the text representation to the given I/O stream. (This is how objects are printed in the Julia REPL.)\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.Multimedia.istextmime",
    "page": "I/O 和网络（Network）",
    "title": "Base.Multimedia.istextmime",
    "category": "function",
    "text": "istextmime(m::MIME)\n\nDetermine whether a MIME type is text data. MIME types are assumed to be binary data except for a set of types known to be text data (possibly Unicode).\n\nExamples\n\njulia> istextmime(MIME(\"text/plain\"))\ntrue\n\njulia> istextmime(MIME(\"img/png\"))\nfalse\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Multimedia-I/O-1",
    "page": "I/O 和网络（Network）",
    "title": "Multimedia I/O",
    "category": "section",
    "text": "Just as text output is performed by print and user-defined types can indicate their textual representation by overloading show, Julia provides a standardized mechanism for rich multimedia output (such as images, formatted text, or even audio and video), consisting of three parts:A function display(x) to request the richest available multimedia display of a Julia object x (with a plain-text fallback).\nOverloading show allows one to indicate arbitrary multimedia representations (keyed by standard MIME types) of user-defined types.\nMultimedia-capable display backends may be registered by subclassing a generic AbstractDisplay type and pushing them onto a stack of display backends via pushdisplay.The base Julia runtime provides only plain-text display, but richer displays may be enabled by loading external modules or by using graphical Julia environments (such as the IPython-based IJulia notebook).Base.Multimedia.display\nBase.Multimedia.redisplay\nBase.Multimedia.displayable\nBase.show(::Any, ::Any, ::Any)\nBase.Multimedia.showable\nBase.repr(::MIME, ::Any)As mentioned above, one can also define new display backends. For example, a module that can display PNG images in a window can register this capability with Julia, so that calling display(x) on types with PNG representations will automatically display the image using the module\'s window.In order to define a new display backend, one should first create a subtype D of the abstract class AbstractDisplay.  Then, for each MIME type (mime string) that can be displayed on D, one should define a function display(d::D, ::MIME\"mime\", x) = ... that displays x as that MIME type, usually by calling show(io, mime, x) or repr(io, mime, x). A MethodError should be thrown if x cannot be displayed as that MIME type; this is automatic if one calls show or repr. Finally, one should define a function display(d::D, x) that queries showable(mime, x) for the mime types supported by D and displays the \"best\" one; a MethodError should be thrown if no supported MIME types are found for x.  Similarly, some subtypes may wish to override redisplay(d::D, ...). (Again, one should import Base.display to add new methods to display.) The return values of these functions are up to the implementation (since in some cases it may be useful to return a display \"handle\" of some type).  The display functions for D can then be called directly, but they can also be invoked automatically from display(x) simply by pushing a new display onto the display-backend stack with:Base.Multimedia.pushdisplay\nBase.Multimedia.popdisplay\nBase.Multimedia.TextDisplay\nBase.Multimedia.istextmime"
},

{
    "location": "base/io-network/#Base.bytesavailable",
    "page": "I/O 和网络（Network）",
    "title": "Base.bytesavailable",
    "category": "function",
    "text": "bytesavailable(io)\n\nReturn the number of bytes available for reading before a read from this stream or buffer will block.\n\nExamples\n\njulia> io = IOBuffer(\"JuliaLang is a GitHub organization\");\n\njulia> bytesavailable(io)\n34\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.ntoh",
    "page": "I/O 和网络（Network）",
    "title": "Base.ntoh",
    "category": "function",
    "text": "ntoh(x)\n\nConvert the endianness of a value from Network byte order (big-endian) to that used by the Host.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.hton",
    "page": "I/O 和网络（Network）",
    "title": "Base.hton",
    "category": "function",
    "text": "hton(x)\n\nConvert the endianness of a value from that used by the Host to Network byte order (big-endian).\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.ltoh",
    "page": "I/O 和网络（Network）",
    "title": "Base.ltoh",
    "category": "function",
    "text": "ltoh(x)\n\nConvert the endianness of a value from Little-endian to that used by the Host.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.htol",
    "page": "I/O 和网络（Network）",
    "title": "Base.htol",
    "category": "function",
    "text": "htol(x)\n\nConvert the endianness of a value from that used by the Host to Little-endian.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Base.ENDIAN_BOM",
    "page": "I/O 和网络（Network）",
    "title": "Base.ENDIAN_BOM",
    "category": "constant",
    "text": "ENDIAN_BOM\n\nThe 32-bit byte-order-mark indicates the native byte order of the host machine. Little-endian machines will contain the value 0x04030201. Big-endian machines will contain the value 0x01020304.\n\n\n\n\n\n"
},

{
    "location": "base/io-network/#Network-I/O-1",
    "page": "I/O 和网络（Network）",
    "title": "Network I/O",
    "category": "section",
    "text": "Base.bytesavailable\nBase.ntoh\nBase.hton\nBase.ltoh\nBase.htol\nBase.ENDIAN_BOM"
},

{
    "location": "base/punctuation/#",
    "page": "Punctuation",
    "title": "Punctuation",
    "category": "page",
    "text": ""
},

{
    "location": "base/punctuation/#Punctuation-1",
    "page": "Punctuation",
    "title": "Punctuation",
    "category": "section",
    "text": "Extended documentation for mathematical symbols & functions is here.symbol meaning\n@m invoke macro m; followed by space-separated expressions\n! prefix \"not\" (logical negation) operator\na!( ) at the end of a function name, ! is used as a convention to indicate that a function modifies its argument(s)\n# begin single line comment\n#= begin multi-line comment (these are nestable)\n=# end multi-line comment\n$ string and expression interpolation\n% remainder operator\n^ exponent operator\n& bitwise and\n&& short-circuiting boolean and\n| bitwise or\n|| short-circuiting boolean or\n⊻ bitwise xor operator\n* multiply, or matrix multiply\n() the empty tuple\n~ bitwise not operator\n\\ backslash operator\n\' complex transpose operator Aᴴ\na[] array indexing (calling getindex or setindex!)\n[,] vector literal constructor (calling vect)\n[;] vertical concatenation (calling vcat or hvcat)\n[    ] with space-separated expressions, horizontal concatenation (calling hcat or hvcat)\nT{ } parametric type instantiation\n; statement separator\n, separate function arguments or tuple components\n? 3-argument conditional operator (used like: conditional ? if_true : if_false)\n\"\" delimit string literals\n\'\' delimit character literals\n` ` delimit external process (command) specifications\n... splice arguments into a function call or declare a varargs function\n. access named fields in objects/modules (calling getproperty or setproperty!), also prefixes elementwise function calls (calling broadcast)\na:b range a, a+1, a+2, ..., b\na:s:b range a, a+s, a+2s, ..., b\n: index an entire dimension (firstindex:lastindex), see Colon)\n:: type annotation or typeassert, depending on context\n:( ) quoted expression\n:a symbol a\n<: subtype operator\n>: supertype operator (reverse of subtype operator)\n=== egal comparison operator"
},

{
    "location": "base/sort/#",
    "page": "Sorting and Related Functions",
    "title": "Sorting and Related Functions",
    "category": "page",
    "text": ""
},

{
    "location": "base/sort/#Sorting-and-Related-Functions-1",
    "page": "Sorting and Related Functions",
    "title": "Sorting and Related Functions",
    "category": "section",
    "text": "Julia has an extensive, flexible API for sorting and interacting with already-sorted arrays of values. By default, Julia picks reasonable algorithms and sorts in standard ascending order:julia> sort([2,3,1])\n3-element Array{Int64,1}:\n 1\n 2\n 3You can easily sort in reverse order as well:julia> sort([2,3,1], rev=true)\n3-element Array{Int64,1}:\n 3\n 2\n 1To sort an array in-place, use the \"bang\" version of the sort function:julia> a = [2,3,1];\n\njulia> sort!(a);\n\njulia> a\n3-element Array{Int64,1}:\n 1\n 2\n 3Instead of directly sorting an array, you can compute a permutation of the array\'s indices that puts the array into sorted order:julia> v = randn(5)\n5-element Array{Float64,1}:\n  0.297288\n  0.382396\n -0.597634\n -0.0104452\n -0.839027\n\njulia> p = sortperm(v)\n5-element Array{Int64,1}:\n 5\n 3\n 4\n 1\n 2\n\njulia> v[p]\n5-element Array{Float64,1}:\n -0.839027\n -0.597634\n -0.0104452\n  0.297288\n  0.382396Arrays can easily be sorted according to an arbitrary transformation of their values:julia> sort(v, by=abs)\n5-element Array{Float64,1}:\n -0.0104452\n  0.297288\n  0.382396\n -0.597634\n -0.839027Or in reverse order by a transformation:julia> sort(v, by=abs, rev=true)\n5-element Array{Float64,1}:\n -0.839027\n -0.597634\n  0.382396\n  0.297288\n -0.0104452If needed, the sorting algorithm can be chosen:julia> sort(v, alg=InsertionSort)\n5-element Array{Float64,1}:\n -0.839027\n -0.597634\n -0.0104452\n  0.297288\n  0.382396All the sorting and order related functions rely on a \"less than\" relation defining a total order on the values to be manipulated. The isless function is invoked by default, but the relation can be specified via the lt keyword."
},

{
    "location": "base/sort/#Base.sort!",
    "page": "Sorting and Related Functions",
    "title": "Base.sort!",
    "category": "function",
    "text": "sort!(v; alg::Algorithm=defalg(v), lt=isless, by=identity, rev::Bool=false, order::Ordering=Forward)\n\nSort the vector v in place. QuickSort is used by default for numeric arrays while MergeSort is used for other arrays. You can specify an algorithm to use via the alg keyword (see Sorting Algorithms for available algorithms). The by keyword lets you provide a function that will be applied to each element before comparison; the lt keyword allows providing a custom \"less than\" function; use rev=true to reverse the sorting order. These options are independent and can be used together in all possible combinations: if both by and lt are specified, the lt function is applied to the result of the by function; rev=true reverses whatever ordering specified via the by and lt keywords.\n\nExamples\n\njulia> v = [3, 1, 2]; sort!(v); v\n3-element Array{Int64,1}:\n 1\n 2\n 3\n\njulia> v = [3, 1, 2]; sort!(v, rev = true); v\n3-element Array{Int64,1}:\n 3\n 2\n 1\n\njulia> v = [(1, \"c\"), (3, \"a\"), (2, \"b\")]; sort!(v, by = x -> x[1]); v\n3-element Array{Tuple{Int64,String},1}:\n (1, \"c\")\n (2, \"b\")\n (3, \"a\")\n\njulia> v = [(1, \"c\"), (3, \"a\"), (2, \"b\")]; sort!(v, by = x -> x[2]); v\n3-element Array{Tuple{Int64,String},1}:\n (3, \"a\")\n (2, \"b\")\n (1, \"c\")\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Base.sort",
    "page": "Sorting and Related Functions",
    "title": "Base.sort",
    "category": "function",
    "text": "sort(v; alg::Algorithm=defalg(v), lt=isless, by=identity, rev::Bool=false, order::Ordering=Forward)\n\nVariant of sort! that returns a sorted copy of v leaving v itself unmodified.\n\nExamples\n\njulia> v = [3, 1, 2];\n\njulia> sort(v)\n3-element Array{Int64,1}:\n 1\n 2\n 3\n\njulia> v\n3-element Array{Int64,1}:\n 3\n 1\n 2\n\n\n\n\n\nsort(A; dims::Integer, alg::Algorithm=DEFAULT_UNSTABLE, lt=isless, by=identity, rev::Bool=false, order::Ordering=Forward)\n\nSort a multidimensional array A along the given dimension. See sort! for a description of possible keyword arguments.\n\nExamples\n\njulia> A = [4 3; 1 2]\n2×2 Array{Int64,2}:\n 4  3\n 1  2\n\njulia> sort(A, dims = 1)\n2×2 Array{Int64,2}:\n 1  2\n 4  3\n\njulia> sort(A, dims = 2)\n2×2 Array{Int64,2}:\n 3  4\n 1  2\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Base.sortperm",
    "page": "Sorting and Related Functions",
    "title": "Base.sortperm",
    "category": "function",
    "text": "sortperm(v; alg::Algorithm=DEFAULT_UNSTABLE, lt=isless, by=identity, rev::Bool=false, order::Ordering=Forward)\n\nReturn a permutation vector I that puts v[I] in sorted order. The order is specified using the same keywords as sort!. The permutation is guaranteed to be stable even if the sorting algorithm is unstable, meaning that indices of equal elements appear in ascending order.\n\nSee also sortperm!.\n\nExamples\n\njulia> v = [3, 1, 2];\n\njulia> p = sortperm(v)\n3-element Array{Int64,1}:\n 2\n 3\n 1\n\njulia> v[p]\n3-element Array{Int64,1}:\n 1\n 2\n 3\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Base.Sort.sortperm!",
    "page": "Sorting and Related Functions",
    "title": "Base.Sort.sortperm!",
    "category": "function",
    "text": "sortperm!(ix, v; alg::Algorithm=DEFAULT_UNSTABLE, lt=isless, by=identity, rev::Bool=false, order::Ordering=Forward, initialized::Bool=false)\n\nLike sortperm, but accepts a preallocated index vector ix.  If initialized is false (the default), ix is initialized to contain the values 1:length(v).\n\nExamples\n\njulia> v = [3, 1, 2]; p = zeros(Int, 3);\n\njulia> sortperm!(p, v); p\n3-element Array{Int64,1}:\n 2\n 3\n 1\n\njulia> v[p]\n3-element Array{Int64,1}:\n 1\n 2\n 3\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Base.Sort.sortrows",
    "page": "Sorting and Related Functions",
    "title": "Base.Sort.sortrows",
    "category": "function",
    "text": "sortrows(A; alg::Algorithm=DEFAULT_UNSTABLE, lt=isless, by=identity, rev::Bool=false, order::Ordering=Forward)\n\nSort the rows of matrix A lexicographically. See sort! for a description of possible keyword arguments.\n\nExamples\n\njulia> sortrows([7 3 5; -1 6 4; 9 -2 8])\n3×3 Array{Int64,2}:\n -1   6  4\n  7   3  5\n  9  -2  8\n\njulia> sortrows([7 3 5; -1 6 4; 9 -2 8], lt=(x,y)->isless(x[2],y[2]))\n3×3 Array{Int64,2}:\n  9  -2  8\n  7   3  5\n -1   6  4\n\njulia> sortrows([7 3 5; -1 6 4; 9 -2 8], rev=true)\n3×3 Array{Int64,2}:\n  9  -2  8\n  7   3  5\n -1   6  4\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Base.Sort.sortcols",
    "page": "Sorting and Related Functions",
    "title": "Base.Sort.sortcols",
    "category": "function",
    "text": "sortcols(A; alg::Algorithm=DEFAULT_UNSTABLE, lt=isless, by=identity, rev::Bool=false, order::Ordering=Forward)\n\nSort the columns of matrix A lexicographically. See sort! for a description of possible keyword arguments.\n\nExamples\n\njulia> sortcols([7 3 5; 6 -1 -4; 9 -2 8])\n3×3 Array{Int64,2}:\n  3   5  7\n -1  -4  6\n -2   8  9\n\njulia> sortcols([7 3 5; 6 -1 -4; 9 -2 8], alg=InsertionSort, lt=(x,y)->isless(x[2],y[2]))\n3×3 Array{Int64,2}:\n  5   3  7\n -4  -1  6\n  8  -2  9\n\njulia> sortcols([7 3 5; 6 -1 -4; 9 -2 8], rev=true)\n3×3 Array{Int64,2}:\n 7   5   3\n 6  -4  -1\n 9   8  -2\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Sorting-Functions-1",
    "page": "Sorting and Related Functions",
    "title": "Sorting Functions",
    "category": "section",
    "text": "Base.sort!\nBase.sort\nBase.sortperm\nBase.Sort.sortperm!\nBase.Sort.sortrows\nBase.Sort.sortcols"
},

{
    "location": "base/sort/#Base.issorted",
    "page": "Sorting and Related Functions",
    "title": "Base.issorted",
    "category": "function",
    "text": "issorted(v, lt=isless, by=identity, rev:Bool=false, order::Ordering=Forward)\n\nTest whether a vector is in sorted order. The lt, by and rev keywords modify what order is considered to be sorted just as they do for sort.\n\nExamples\n\njulia> issorted([1, 2, 3])\ntrue\n\njulia> issorted([(1, \"b\"), (2, \"a\")], by = x -> x[1])\ntrue\n\njulia> issorted([(1, \"b\"), (2, \"a\")], by = x -> x[2])\nfalse\n\njulia> issorted([(1, \"b\"), (2, \"a\")], by = x -> x[2], rev=true)\ntrue\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Base.Sort.searchsorted",
    "page": "Sorting and Related Functions",
    "title": "Base.Sort.searchsorted",
    "category": "function",
    "text": "searchsorted(a, x; by=<transform>, lt=<comparison>, rev=false)\n\nReturn the range of indices of a which compare as equal to x (using binary search) according to the order specified by the by, lt and rev keywords, assuming that a is already sorted in that order. Return an empty range located at the insertion point if a does not contain values equal to x.\n\nExamples\n\njulia> a = [4, 3, 2, 1]\n4-element Array{Int64,1}:\n 4\n 3\n 2\n 1\n\njulia> searchsorted(a, 4)\n5:4\n\njulia> searchsorted(a, 4, rev=true)\n1:1\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Base.Sort.searchsortedfirst",
    "page": "Sorting and Related Functions",
    "title": "Base.Sort.searchsortedfirst",
    "category": "function",
    "text": "searchsortedfirst(a, x; by=<transform>, lt=<comparison>, rev=false)\n\nReturn the index of the first value in a greater than or equal to x, according to the specified order. Return length(a) + 1 if x is greater than all values in a. a is assumed to be sorted.\n\nExamples\n\njulia> searchsortedfirst([1, 2, 4, 5, 14], 4)\n3\n\njulia> searchsortedfirst([1, 2, 4, 5, 14], 4, rev=true)\n1\n\njulia> searchsortedfirst([1, 2, 4, 5, 14], 15)\n6\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Base.Sort.searchsortedlast",
    "page": "Sorting and Related Functions",
    "title": "Base.Sort.searchsortedlast",
    "category": "function",
    "text": "searchsortedlast(a, x; by=<transform>, lt=<comparison>, rev=false)\n\nReturn the index of the last value in a less than or equal to x, according to the specified order. Return 0 if x is less than all values in a. a is assumed to be sorted.\n\nExamples\n\njulia> searchsortedlast([1, 2, 4, 5, 14], 4)\n3\n\njulia> searchsortedlast([1, 2, 4, 5, 14], 4, rev=true)\n5\n\njulia> searchsortedlast([1, 2, 4, 5, 14], -1)\n0\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Base.Sort.partialsort!",
    "page": "Sorting and Related Functions",
    "title": "Base.Sort.partialsort!",
    "category": "function",
    "text": "partialsort!(v, k; by=<transform>, lt=<comparison>, rev=false)\n\nPartially sort the vector v in place, according to the order specified by by, lt and rev so that the value at index k (or range of adjacent values if k is a range) occurs at the position where it would appear if the array were fully sorted via a non-stable algorithm. If k is a single index, that value is returned; if k is a range, an array of values at those indices is returned. Note that partialsort! does not fully sort the input array.\n\nExamples\n\njulia> a = [1, 2, 4, 3, 4]\n5-element Array{Int64,1}:\n 1\n 2\n 4\n 3\n 4\n\njulia> partialsort!(a, 4)\n4\n\njulia> a\n5-element Array{Int64,1}:\n 1\n 2\n 3\n 4\n 4\n\njulia> a = [1, 2, 4, 3, 4]\n5-element Array{Int64,1}:\n 1\n 2\n 4\n 3\n 4\n\njulia> partialsort!(a, 4, rev=true)\n2\n\njulia> a\n5-element Array{Int64,1}:\n 4\n 4\n 3\n 2\n 1\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Base.Sort.partialsort",
    "page": "Sorting and Related Functions",
    "title": "Base.Sort.partialsort",
    "category": "function",
    "text": "partialsort(v, k, by=<transform>, lt=<comparison>, rev=false)\n\nVariant of partialsort! which copies v before partially sorting it, thereby returning the same thing as partialsort! but leaving v unmodified.\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Base.Sort.partialsortperm",
    "page": "Sorting and Related Functions",
    "title": "Base.Sort.partialsortperm",
    "category": "function",
    "text": "partialsortperm(v, k; by=<transform>, lt=<comparison>, rev=false)\n\nReturn a partial permutation I of the vector v, so that v[I] returns values of a fully sorted version of v at index k. If k is a range, a vector of indices is returned; if k is an integer, a single index is returned. The order is specified using the same keywords as sort!. The permutation is stable, meaning that indices of equal elements appear in ascending order.\n\nNote that this function is equivalent to, but more efficient than, calling sortperm(...)[k].\n\nExamples\n\njulia> v = [3, 1, 2, 1];\n\njulia> v[partialsortperm(v, 1)]\n1\n\njulia> p = partialsortperm(v, 1:3)\n3-element view(::Array{Int64,1}, 1:3) with eltype Int64:\n 2\n 4\n 3\n\njulia> v[p]\n3-element Array{Int64,1}:\n 1\n 1\n 2\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Base.Sort.partialsortperm!",
    "page": "Sorting and Related Functions",
    "title": "Base.Sort.partialsortperm!",
    "category": "function",
    "text": "partialsortperm!(ix, v, k; by=<transform>, lt=<comparison>, rev=false, initialized=false)\n\nLike partialsortperm, but accepts a preallocated index vector ix. If initialized is false (the default), ix is initialized to contain the values 1:length(ix).\n\n\n\n\n\n"
},

{
    "location": "base/sort/#Order-Related-Functions-1",
    "page": "Sorting and Related Functions",
    "title": "Order-Related Functions",
    "category": "section",
    "text": "Base.issorted\nBase.Sort.searchsorted\nBase.Sort.searchsortedfirst\nBase.Sort.searchsortedlast\nBase.Sort.partialsort!\nBase.Sort.partialsort\nBase.Sort.partialsortperm\nBase.Sort.partialsortperm!"
},

{
    "location": "base/sort/#Sorting-Algorithms-1",
    "page": "Sorting and Related Functions",
    "title": "Sorting Algorithms",
    "category": "section",
    "text": "There are currently four sorting algorithms available in base Julia:InsertionSort\nQuickSort\nPartialQuickSort(k)\nMergeSortInsertionSort is an O(n^2) stable sorting algorithm. It is efficient for very small n, and is used internally by QuickSort.QuickSort is an O(n log n) sorting algorithm which is in-place, very fast, but not stable – i.e. elements which are considered equal will not remain in the same order in which they originally appeared in the array to be sorted. QuickSort is the default algorithm for numeric values, including integers and floats.PartialQuickSort(k) is similar to QuickSort, but the output array is only sorted up to index k if k is an integer, or in the range of k if k is an OrdinalRange. For example:x = rand(1:500, 100)\nk = 50\nk2 = 50:100\ns = sort(x; alg=QuickSort)\nps = sort(x; alg=PartialQuickSort(k))\nqs = sort(x; alg=PartialQuickSort(k2))\nmap(issorted, (s, ps, qs))             # => (true, false, false)\nmap(x->issorted(x[1:k]), (s, ps, qs))  # => (true, true, false)\nmap(x->issorted(x[k2]), (s, ps, qs))   # => (true, false, true)\ns[1:k] == ps[1:k]                      # => true\ns[k2] == qs[k2]                        # => trueMergeSort is an O(n log n) stable sorting algorithm but is not in-place – it requires a temporary array of half the size of the input array – and is typically not quite as fast as QuickSort. It is the default algorithm for non-numeric data.The default sorting algorithms are chosen on the basis that they are fast and stable, or appear to be so. For numeric types indeed, QuickSort is selected as it is faster and indistinguishable in this case from a stable sort (unless the array records its mutations in some way). The stability property comes at a non-negligible cost, so if you don\'t need it, you may want to explicitly specify your preferred algorithm, e.g. sort!(v, alg=QuickSort).The mechanism by which Julia picks default sorting algorithms is implemented via the Base.Sort.defalg function. It allows a particular algorithm to be registered as the default in all sorting functions for specific arrays. For example, here are the two default methods from sort.jl:defalg(v::AbstractArray) = MergeSort\ndefalg(v::AbstractArray{<:Number}) = QuickSortAs for numeric arrays, choosing a non-stable default algorithm for array types for which the notion of a stable sort is meaningless (i.e. when two values comparing equal can not be distinguished) may make sense."
},

{
    "location": "base/iterators/#",
    "page": "Iteration utilities",
    "title": "Iteration utilities",
    "category": "page",
    "text": ""
},

{
    "location": "base/iterators/#Base.Iterators.Stateful",
    "page": "Iteration utilities",
    "title": "Base.Iterators.Stateful",
    "category": "type",
    "text": "Stateful(itr)\n\nThere are several different ways to think about this iterator wrapper:\n\nIt provides a mutable wrapper around an iterator and its iteration state.\nIt turns an iterator-like abstraction into a Channel-like abstraction.\nIt\'s an iterator that mutates to become its own rest iterator whenever an item is produced.\n\nStateful provides the regular iterator interface. Like other mutable iterators (e.g. Channel), if iteration is stopped early (e.g. by a break in a for loop), iteration can be resumed from the same spot by continuing to iterate over the same iterator object (in contrast, an immutable iterator would restart from the beginning).\n\nExamples\n\njulia> a = Iterators.Stateful(\"abcdef\");\n\njulia> isempty(a)\nfalse\n\njulia> popfirst!(a)\n\'a\': ASCII/Unicode U+0061 (category Ll: Letter, lowercase)\n\njulia> collect(Iterators.take(a, 3))\n3-element Array{Char,1}:\n \'b\'\n \'c\'\n \'d\'\n\njulia> collect(a)\n2-element Array{Char,1}:\n \'e\'\n \'f\'\n\njulia> a = Iterators.Stateful([1,1,1,2,3,4]);\n\njulia> for x in a; x == 1 || break; end\n\njulia> Base.peek(a)\n3\n\njulia> sum(a) # Sum the remaining elements\n7\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Base.Iterators.zip",
    "page": "Iteration utilities",
    "title": "Base.Iterators.zip",
    "category": "function",
    "text": "zip(iters...)\n\nFor a set of iterable objects, return an iterable of tuples, where the ith tuple contains the ith component of each input iterable.\n\nExamples\n\njulia> a = 1:5\n1:5\n\njulia> b = [\"e\",\"d\",\"b\",\"c\",\"a\"]\n5-element Array{String,1}:\n \"e\"\n \"d\"\n \"b\"\n \"c\"\n \"a\"\n\njulia> c = zip(a,b)\nBase.Iterators.Zip2{UnitRange{Int64},Array{String,1}}(1:5, [\"e\", \"d\", \"b\", \"c\", \"a\"])\n\njulia> length(c)\n5\n\njulia> first(c)\n(1, \"e\")\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Base.Iterators.enumerate",
    "page": "Iteration utilities",
    "title": "Base.Iterators.enumerate",
    "category": "function",
    "text": "enumerate(iter)\n\nAn iterator that yields (i, x) where i is a counter starting at 1, and x is the ith value from the given iterator. It\'s useful when you need not only the values x over which you are iterating, but also the number of iterations so far. Note that i may not be valid for indexing iter; it\'s also possible that x != iter[i], if iter has indices that do not start at 1. See the enumerate(IndexLinear(), iter) method if you want to ensure that i is an index.\n\nExamples\n\njulia> a = [\"a\", \"b\", \"c\"];\n\njulia> for (index, value) in enumerate(a)\n           println(\"$index $value\")\n       end\n1 a\n2 b\n3 c\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Base.Iterators.rest",
    "page": "Iteration utilities",
    "title": "Base.Iterators.rest",
    "category": "function",
    "text": "rest(iter, state)\n\nAn iterator that yields the same elements as iter, but starting at the given state.\n\nExamples\n\njulia> collect(Iterators.rest([1,2,3,4], 2))\n3-element Array{Int64,1}:\n 2\n 3\n 4\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Base.Iterators.countfrom",
    "page": "Iteration utilities",
    "title": "Base.Iterators.countfrom",
    "category": "function",
    "text": "countfrom(start=1, step=1)\n\nAn iterator that counts forever, starting at start and incrementing by step.\n\nExamples\n\njulia> for v in Iterators.countfrom(5, 2)\n           v > 10 && break\n           println(v)\n       end\n5\n7\n9\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Base.Iterators.take",
    "page": "Iteration utilities",
    "title": "Base.Iterators.take",
    "category": "function",
    "text": "take(iter, n)\n\nAn iterator that generates at most the first n elements of iter.\n\nExamples\n\njulia> a = 1:2:11\n1:2:11\n\njulia> collect(a)\n6-element Array{Int64,1}:\n  1\n  3\n  5\n  7\n  9\n 11\n\njulia> collect(Iterators.take(a,3))\n3-element Array{Int64,1}:\n 1\n 3\n 5\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Base.Iterators.drop",
    "page": "Iteration utilities",
    "title": "Base.Iterators.drop",
    "category": "function",
    "text": "drop(iter, n)\n\nAn iterator that generates all but the first n elements of iter.\n\nExamples\n\njulia> a = 1:2:11\n1:2:11\n\njulia> collect(a)\n6-element Array{Int64,1}:\n  1\n  3\n  5\n  7\n  9\n 11\n\njulia> collect(Iterators.drop(a,4))\n2-element Array{Int64,1}:\n  9\n 11\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Base.Iterators.cycle",
    "page": "Iteration utilities",
    "title": "Base.Iterators.cycle",
    "category": "function",
    "text": "cycle(iter)\n\nAn iterator that cycles through iter forever. If iter is empty, so is cycle(iter).\n\nExamples\n\njulia> for (i, v) in enumerate(Iterators.cycle(\"hello\"))\n           print(v)\n           i > 10 && break\n       end\nhellohelloh\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Base.Iterators.repeated",
    "page": "Iteration utilities",
    "title": "Base.Iterators.repeated",
    "category": "function",
    "text": "repeated(x[, n::Int])\n\nAn iterator that generates the value x forever. If n is specified, generates x that many times (equivalent to take(repeated(x), n)).\n\nExamples\n\njulia> a = Iterators.repeated([1 2], 4);\n\njulia> collect(a)\n4-element Array{Array{Int64,2},1}:\n [1 2]\n [1 2]\n [1 2]\n [1 2]\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Base.Iterators.product",
    "page": "Iteration utilities",
    "title": "Base.Iterators.product",
    "category": "function",
    "text": "product(iters...)\n\nReturn an iterator over the product of several iterators. Each generated element is a tuple whose ith element comes from the ith argument iterator. The first iterator changes the fastest.\n\nExamples\n\njulia> collect(Iterators.product(1:2, 3:5))\n2×3 Array{Tuple{Int64,Int64},2}:\n (1, 3)  (1, 4)  (1, 5)\n (2, 3)  (2, 4)  (2, 5)\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Base.Iterators.flatten",
    "page": "Iteration utilities",
    "title": "Base.Iterators.flatten",
    "category": "function",
    "text": "flatten(iter)\n\nGiven an iterator that yields iterators, return an iterator that yields the elements of those iterators. Put differently, the elements of the argument iterator are concatenated.\n\nExamples\n\njulia> collect(Iterators.flatten((1:2, 8:9)))\n4-element Array{Int64,1}:\n 1\n 2\n 8\n 9\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Base.Iterators.partition",
    "page": "Iteration utilities",
    "title": "Base.Iterators.partition",
    "category": "function",
    "text": "partition(collection, n)\n\nIterate over a collection n elements at a time.\n\nExamples\n\njulia> collect(Iterators.partition([1,2,3,4,5], 2))\n3-element Array{Array{Int64,1},1}:\n [1, 2]\n [3, 4]\n [5]\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Base.Iterators.filter",
    "page": "Iteration utilities",
    "title": "Base.Iterators.filter",
    "category": "function",
    "text": "Iterators.filter(flt, itr)\n\nGiven a predicate function flt and an iterable object itr, return an iterable object which upon iteration yields the elements x of itr that satisfy flt(x). The order of the original iterator is preserved.\n\nThis function is lazy; that is, it is guaranteed to return in Θ(1) time and use Θ(1) additional space, and flt will not be called by an invocation of filter. Calls to flt will be made when iterating over the returned iterable object. These calls are not cached and repeated calls will be made when reiterating.\n\nSee Base.filter for an eager implementation of filtering for arrays.\n\nExamples\n\njulia> f = Iterators.filter(isodd, [1, 2, 3, 4, 5])\nBase.Iterators.Filter{typeof(isodd),Array{Int64,1}}(isodd, [1, 2, 3, 4, 5])\n\njulia> foreach(println, f)\n1\n3\n5\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Base.Iterators.reverse",
    "page": "Iteration utilities",
    "title": "Base.Iterators.reverse",
    "category": "function",
    "text": "Iterators.reverse(itr)\n\nGiven an iterator itr, then reverse(itr) is an iterator over the same collection but in the reverse order.\n\nThis iterator is \"lazy\" in that it does not make a copy of the collection in order to reverse it; see Base.reverse for an eager implementation.\n\nNot all iterator types T support reverse-order iteration.  If T doesn\'t, then iterating over Iterators.reverse(itr::T) will throw a MethodError because of the missing iterate methods for Iterators.Reverse{T}. (To implement these methods, the original iterator itr::T can be obtained from r = Iterators.reverse(itr) by r.itr.)\n\nExamples\n\njulia> foreach(println, Iterators.reverse(1:5))\n5\n4\n3\n2\n1\n\n\n\n\n\n"
},

{
    "location": "base/iterators/#Iteration-utilities-1",
    "page": "Iteration utilities",
    "title": "Iteration utilities",
    "category": "section",
    "text": "Base.Iterators.Stateful\nBase.Iterators.zip\nBase.Iterators.enumerate\nBase.Iterators.rest\nBase.Iterators.countfrom\nBase.Iterators.take\nBase.Iterators.drop\nBase.Iterators.cycle\nBase.Iterators.repeated\nBase.Iterators.product\nBase.Iterators.flatten\nBase.Iterators.partition\nBase.Iterators.filter\nBase.Iterators.reverse"
},

{
    "location": "base/c/#",
    "page": "C Interface",
    "title": "C Interface",
    "category": "page",
    "text": ""
},

{
    "location": "base/c/#ccall",
    "page": "C Interface",
    "title": "ccall",
    "category": "keyword",
    "text": "ccall((function_name, library), returntype, (argtype1, ...), argvalue1, ...)\nccall(function_pointer, returntype, (argtype1, ...), argvalue1, ...)\n\nCall a function in a C-exported shared library, specified by the tuple (function_name, library), where each component is either a string or symbol. Alternatively, ccall may also be used to call a function pointer function_pointer, such as one returned by dlsym.\n\nNote that the argument type tuple must be a literal tuple, and not a tuple-valued variable or expression.\n\nEach argvalue to the ccall will be converted to the corresponding argtype, by automatic insertion of calls to unsafe_convert(argtype, cconvert(argtype, argvalue)). (See also the documentation for unsafe_convert and cconvert for further details.) In most cases, this simply results in a call to convert(argtype, argvalue).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Core.Intrinsics.cglobal",
    "page": "C Interface",
    "title": "Core.Intrinsics.cglobal",
    "category": "function",
    "text": "cglobal((symbol, library) [, type=Cvoid])\n\nObtain a pointer to a global variable in a C-exported shared library, specified exactly as in ccall. Returns a Ptr{Type}, defaulting to Ptr{Cvoid} if no Type argument is supplied. The values can be read or written by unsafe_load or unsafe_store!, respectively.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.@cfunction",
    "page": "C Interface",
    "title": "Base.@cfunction",
    "category": "macro",
    "text": "@cfunction(callable, ReturnType, (ArgumentTypes...,)) -> Ptr{Cvoid}\n@cfunction($callable, ReturnType, (ArgumentTypes...,)) -> CFunction\n\nGenerate a C-callable function pointer from the Julia function closure for the given type signature. To pass the return value to a ccall, use the argument type Ptr{Cvoid} in the signature.\n\nNote that the argument type tuple must be a literal tuple, and not a tuple-valued variable or expression (although it can include a splat expression). And that these arguments will be evaluated in global scope during compile-time (not deferred until runtime). Adding a \'$\' in front of the function argument changes this to instead create a runtime closure over the local variable callable.\n\nSee manual section on ccall and cfunction usage.\n\nExamples\n\njulia> function foo(x::Int, y::Int)\n           return x + y\n       end\n\njulia> @cfunction(foo, Int, (Int, Int))\nPtr{Cvoid} @0x000000001b82fcd0\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.CFunction",
    "page": "C Interface",
    "title": "Base.CFunction",
    "category": "type",
    "text": "CFunction struct\n\nGarbage-collection handle for the return value from @cfunction when the first argument is annotated with \'$\'. Like all cfunction handles, it should be passed to ccall as a Ptr{Cvoid}, and will be converted automatically at the call site to the appropriate type.\n\nSee @cfunction.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.unsafe_convert",
    "page": "C Interface",
    "title": "Base.unsafe_convert",
    "category": "function",
    "text": "unsafe_convert(T, x)\n\nConvert x to a C argument of type T where the input x must be the return value of cconvert(T, ...).\n\nIn cases where convert would need to take a Julia object and turn it into a Ptr, this function should be used to define and perform that conversion.\n\nBe careful to ensure that a Julia reference to x exists as long as the result of this function will be used. Accordingly, the argument x to this function should never be an expression, only a variable name or field reference. For example, x=a.b.c is acceptable, but x=[a,b,c] is not.\n\nThe unsafe prefix on this function indicates that using the result of this function after the x argument to this function is no longer accessible to the program may cause undefined behavior, including program corruption or segfaults, at any later time.\n\nSee also cconvert\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.cconvert",
    "page": "C Interface",
    "title": "Base.cconvert",
    "category": "function",
    "text": "cconvert(T,x)\n\nConvert x to a value to be passed to C code as type T, typically by calling convert(T, x).\n\nIn cases where x cannot be safely converted to T, unlike convert, cconvert may return an object of a type different from T, which however is suitable for unsafe_convert to handle. The result of this function should be kept valid (for the GC) until the result of unsafe_convert is not needed anymore. This can be used to allocate memory that will be accessed by the ccall. If multiple objects need to be allocated, a tuple of the objects can be used as return value.\n\nNeither convert nor cconvert should take a Julia object and turn it into a Ptr.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.unsafe_load",
    "page": "C Interface",
    "title": "Base.unsafe_load",
    "category": "function",
    "text": "unsafe_load(p::Ptr{T}, i::Integer=1)\n\nLoad a value of type T from the address of the ith element (1-indexed) starting at p. This is equivalent to the C expression p[i-1].\n\nThe unsafe prefix on this function indicates that no validation is performed on the pointer p to ensure that it is valid. Incorrect usage may segfault your program or return garbage answers, in the same manner as C.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.unsafe_store!",
    "page": "C Interface",
    "title": "Base.unsafe_store!",
    "category": "function",
    "text": "unsafe_store!(p::Ptr{T}, x, i::Integer=1)\n\nStore a value of type T to the address of the ith element (1-indexed) starting at p. This is equivalent to the C expression p[i-1] = x.\n\nThe unsafe prefix on this function indicates that no validation is performed on the pointer p to ensure that it is valid. Incorrect usage may corrupt or segfault your program, in the same manner as C.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.unsafe_copyto!-Union{Tuple{T}, Tuple{Ptr{T},Ptr{T},Any}} where T",
    "page": "C Interface",
    "title": "Base.unsafe_copyto!",
    "category": "method",
    "text": "unsafe_copyto!(dest::Ptr{T}, src::Ptr{T}, N)\n\nCopy N elements from a source pointer to a destination, with no checking. The size of an element is determined by the type of the pointers.\n\nThe unsafe prefix on this function indicates that no validation is performed on the pointers dest and src to ensure that they are valid. Incorrect usage may corrupt or segfault your program, in the same manner as C.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.unsafe_copyto!-Union{Tuple{T}, Tuple{Array{T,N} where N,Any,Array{T,N} where N,Any,Any}} where T",
    "page": "C Interface",
    "title": "Base.unsafe_copyto!",
    "category": "method",
    "text": "unsafe_copyto!(dest::Array, do, src::Array, so, N)\n\nCopy N elements from a source array to a destination, starting at offset so in the source and do in the destination (1-indexed).\n\nThe unsafe prefix on this function indicates that no validation is performed to ensure that N is inbounds on either array. Incorrect usage may corrupt or segfault your program, in the same manner as C.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.copyto!",
    "page": "C Interface",
    "title": "Base.copyto!",
    "category": "function",
    "text": "copyto!(dest, do, src, so, N)\n\nCopy N elements from collection src starting at offset so, to array dest starting at offset do. Return dest.\n\n\n\n\n\ncopyto!(dest::AbstractArray, src) -> dest\n\nCopy all elements from collection src to array dest, whose length must be greater than or equal to the length n of src. The first n elements of dest are overwritten, the other elements are left untouched.\n\nExamples\n\njulia> x = [1., 0., 3., 0., 5.];\n\njulia> y = zeros(7);\n\njulia> copyto!(y, x);\n\njulia> y\n7-element Array{Float64,1}:\n 1.0\n 0.0\n 3.0\n 0.0\n 5.0\n 0.0\n 0.0\n\n\n\n\n\ncopyto!(dest, Rdest::CartesianIndices, src, Rsrc::CartesianIndices) -> dest\n\nCopy the block of src in the range of Rsrc to the block of dest in the range of Rdest. The sizes of the two regions must match.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.pointer",
    "page": "C Interface",
    "title": "Base.pointer",
    "category": "function",
    "text": "pointer(array [, index])\n\nGet the native address of an array or string, optionally at a given location index.\n\nThis function is \"unsafe\". Be careful to ensure that a Julia reference to array exists as long as this pointer will be used. The GC.@preserve macro should be used to protect the array argument from garbage collection within a given block of code.\n\nCalling Ref(array[, index]) is generally preferable to this function as it guarantees validity.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.unsafe_wrap-Union{Tuple{N}, Tuple{T}, Tuple{Union{Type{Array}, Type{Array{T,N} where N}, Type{Array{T,N}}},Ptr{T},Tuple{Vararg{Int64,N}}}} where N where T",
    "page": "C Interface",
    "title": "Base.unsafe_wrap",
    "category": "method",
    "text": "unsafe_wrap(Array, pointer::Ptr{T}, dims; own = false)\n\nWrap a Julia Array object around the data at the address given by pointer, without making a copy.  The pointer element type T determines the array element type. dims is either an integer (for a 1d array) or a tuple of the array dimensions. own optionally specifies whether Julia should take ownership of the memory, calling free on the pointer when the array is no longer referenced.\n\nThis function is labeled \"unsafe\" because it will crash if pointer is not a valid memory address to data of the requested length.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.pointer_from_objref",
    "page": "C Interface",
    "title": "Base.pointer_from_objref",
    "category": "function",
    "text": "pointer_from_objref(x)\n\nGet the memory address of a Julia object as a Ptr. The existence of the resulting Ptr will not protect the object from garbage collection, so you must ensure that the object remains referenced for the whole time that the Ptr will be used.\n\nThis function may not be called on immutable objects, since they do not have stable memory addresses.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.unsafe_pointer_to_objref",
    "page": "C Interface",
    "title": "Base.unsafe_pointer_to_objref",
    "category": "function",
    "text": "unsafe_pointer_to_objref(p::Ptr)\n\nConvert a Ptr to an object reference. Assumes the pointer refers to a valid heap-allocated Julia object. If this is not the case, undefined behavior results, hence this function is considered \"unsafe\" and should be used with care.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.disable_sigint",
    "page": "C Interface",
    "title": "Base.disable_sigint",
    "category": "function",
    "text": "disable_sigint(f::Function)\n\nDisable Ctrl-C handler during execution of a function on the current task, for calling external code that may call julia code that is not interrupt safe. Intended to be called using do block syntax as follows:\n\ndisable_sigint() do\n    # interrupt-unsafe code\n    ...\nend\n\nThis is not needed on worker threads (Threads.threadid() != 1) since the InterruptException will only be delivered to the master thread. External functions that do not call julia code or julia runtime automatically disable sigint during their execution.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.reenable_sigint",
    "page": "C Interface",
    "title": "Base.reenable_sigint",
    "category": "function",
    "text": "reenable_sigint(f::Function)\n\nRe-enable Ctrl-C handler during execution of a function. Temporarily reverses the effect of disable_sigint.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.systemerror",
    "page": "C Interface",
    "title": "Base.systemerror",
    "category": "function",
    "text": "systemerror(sysfunc, iftrue)\n\nRaises a SystemError for errno with the descriptive string sysfunc if iftrue is true\n\n\n\n\n\n"
},

{
    "location": "base/c/#Core.Ptr",
    "page": "C Interface",
    "title": "Core.Ptr",
    "category": "type",
    "text": "Ptr{T}\n\nA memory address referring to data of type T.  However, there is no guarantee that the memory is actually valid, or that it actually represents data of the specified type.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Core.Ref",
    "page": "C Interface",
    "title": "Core.Ref",
    "category": "type",
    "text": "Ref{T}\n\nAn object that safely references data of type T. This type is guaranteed to point to valid, Julia-allocated memory of the correct type. The underlying data is protected from freeing by the garbage collector as long as the Ref itself is referenced.\n\nIn Julia, Ref objects are dereferenced (loaded or stored) with [].\n\nCreation of a Ref to a value x of type T is usually written Ref(x). Additionally, for creating interior pointers to containers (such as Array or Ptr), it can be written Ref(a, i) for creating a reference to the i-th element of a.\n\nWhen passed as a ccall argument (either as a Ptr or Ref type), a Ref object will be converted to a native pointer to the data it references.\n\nThere is no invalid (NULL) Ref in Julia, but a C_NULL instance of Ptr can be passed to a ccall Ref argument.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Cchar",
    "page": "C Interface",
    "title": "Base.Cchar",
    "category": "type",
    "text": "Cchar\n\nEquivalent to the native char c-type.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Cuchar",
    "page": "C Interface",
    "title": "Base.Cuchar",
    "category": "type",
    "text": "Cuchar\n\nEquivalent to the native unsigned char c-type (UInt8).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Cshort",
    "page": "C Interface",
    "title": "Base.Cshort",
    "category": "type",
    "text": "Cshort\n\nEquivalent to the native signed short c-type (Int16).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Cushort",
    "page": "C Interface",
    "title": "Base.Cushort",
    "category": "type",
    "text": "Cushort\n\nEquivalent to the native unsigned short c-type (UInt16).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Cint",
    "page": "C Interface",
    "title": "Base.Cint",
    "category": "type",
    "text": "Cint\n\nEquivalent to the native signed int c-type (Int32).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Cuint",
    "page": "C Interface",
    "title": "Base.Cuint",
    "category": "type",
    "text": "Cuint\n\nEquivalent to the native unsigned int c-type (UInt32).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Clong",
    "page": "C Interface",
    "title": "Base.Clong",
    "category": "type",
    "text": "Clong\n\nEquivalent to the native signed long c-type.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Culong",
    "page": "C Interface",
    "title": "Base.Culong",
    "category": "type",
    "text": "Culong\n\nEquivalent to the native unsigned long c-type.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Clonglong",
    "page": "C Interface",
    "title": "Base.Clonglong",
    "category": "type",
    "text": "Clonglong\n\nEquivalent to the native signed long long c-type (Int64).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Culonglong",
    "page": "C Interface",
    "title": "Base.Culonglong",
    "category": "type",
    "text": "Culonglong\n\nEquivalent to the native unsigned long long c-type (UInt64).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Cintmax_t",
    "page": "C Interface",
    "title": "Base.Cintmax_t",
    "category": "type",
    "text": "Cintmax_t\n\nEquivalent to the native intmax_t c-type (Int64).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Cuintmax_t",
    "page": "C Interface",
    "title": "Base.Cuintmax_t",
    "category": "type",
    "text": "Cuintmax_t\n\nEquivalent to the native uintmax_t c-type (UInt64).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Csize_t",
    "page": "C Interface",
    "title": "Base.Csize_t",
    "category": "type",
    "text": "Csize_t\n\nEquivalent to the native size_t c-type (UInt).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Cssize_t",
    "page": "C Interface",
    "title": "Base.Cssize_t",
    "category": "type",
    "text": "Cssize_t\n\nEquivalent to the native ssize_t c-type.\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Cptrdiff_t",
    "page": "C Interface",
    "title": "Base.Cptrdiff_t",
    "category": "type",
    "text": "Cptrdiff_t\n\nEquivalent to the native ptrdiff_t c-type (Int).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Cwchar_t",
    "page": "C Interface",
    "title": "Base.Cwchar_t",
    "category": "type",
    "text": "Cwchar_t\n\nEquivalent to the native wchar_t c-type (Int32).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Cfloat",
    "page": "C Interface",
    "title": "Base.Cfloat",
    "category": "type",
    "text": "Cfloat\n\nEquivalent to the native float c-type (Float32).\n\n\n\n\n\n"
},

{
    "location": "base/c/#Base.Cdouble",
    "page": "C Interface",
    "title": "Base.Cdouble",
    "category": "type",
    "text": "Cdouble\n\nEquivalent to the native double c-type (Float64).\n\n\n\n\n\n"
},

{
    "location": "base/c/#C-Interface-1",
    "page": "C Interface",
    "title": "C Interface",
    "category": "section",
    "text": "ccall\nCore.Intrinsics.cglobal\nBase.@cfunction\nBase.CFunction\nBase.unsafe_convert\nBase.cconvert\nBase.unsafe_load\nBase.unsafe_store!\nBase.unsafe_copyto!{T}(::Ptr{T}, ::Ptr{T}, ::Any)\nBase.unsafe_copyto!{T}(::Array{T}, ::Any, ::Array{T}, ::Any, ::Any)\nBase.copyto!\nBase.pointer\nBase.unsafe_wrap{T,N}(::Union{Type{Array},Type{Array{T}},Type{Array{T,N}}}, ::Ptr{T}, ::NTuple{N,Int})\nBase.pointer_from_objref\nBase.unsafe_pointer_to_objref\nBase.disable_sigint\nBase.reenable_sigint\nBase.systemerror\nCore.Ptr\nCore.Ref\nBase.Cchar\nBase.Cuchar\nBase.Cshort\nBase.Cushort\nBase.Cint\nBase.Cuint\nBase.Clong\nBase.Culong\nBase.Clonglong\nBase.Culonglong\nBase.Cintmax_t\nBase.Cuintmax_t\nBase.Csize_t\nBase.Cssize_t\nBase.Cptrdiff_t\nBase.Cwchar_t\nBase.Cfloat\nBase.Cdouble"
},

{
    "location": "base/c/#Core.Intrinsics.llvmcall",
    "page": "C Interface",
    "title": "Core.Intrinsics.llvmcall",
    "category": "function",
    "text": "llvmcall(IR::String, ReturnType, (ArgumentType1, ...), ArgumentValue1, ...)\nllvmcall((declarations::String, IR::String), ReturnType, (ArgumentType1, ...), ArgumentValue1, ...)\n\nCall LLVM IR string in the first argument. Similar to an LLVM function define block, arguments are available as consecutive unnamed SSA variables (%0, %1, etc.).\n\nThe optional declarations string contains external functions declarations that are necessary for llvm to compile the IR string. Multiple declarations can be passed in by separating them with line breaks.\n\nNote that the argument type tuple must be a literal tuple, and not a tuple-valued variable or expression.\n\nEach ArgumentValue to llvmcall will be converted to the corresponding ArgumentType, by automatic insertion of calls to unsafe_convert(ArgumentType, cconvert(ArgumentType, ArgumentValue)). (See also the documentation for unsafe_convert and cconvert for further details.) In most cases, this simply results in a call to convert(ArgumentType, ArgumentValue).\n\nSee test/llvmcall.jl for usage examples.\n\n\n\n\n\n"
},

{
    "location": "base/c/#LLVM-Interface-1",
    "page": "C Interface",
    "title": "LLVM Interface",
    "category": "section",
    "text": "Core.Intrinsics.llvmcall"
},

{
    "location": "base/libc/#",
    "page": "C Standard Library",
    "title": "C Standard Library",
    "category": "page",
    "text": ""
},

{
    "location": "base/libc/#Base.Libc.malloc",
    "page": "C Standard Library",
    "title": "Base.Libc.malloc",
    "category": "function",
    "text": "malloc(size::Integer) -> Ptr{Cvoid}\n\nCall malloc from the C standard library.\n\n\n\n\n\n"
},

{
    "location": "base/libc/#Base.Libc.calloc",
    "page": "C Standard Library",
    "title": "Base.Libc.calloc",
    "category": "function",
    "text": "calloc(num::Integer, size::Integer) -> Ptr{Cvoid}\n\nCall calloc from the C standard library.\n\n\n\n\n\n"
},

{
    "location": "base/libc/#Base.Libc.realloc",
    "page": "C Standard Library",
    "title": "Base.Libc.realloc",
    "category": "function",
    "text": "realloc(addr::Ptr, size::Integer) -> Ptr{Cvoid}\n\nCall realloc from the C standard library.\n\nSee warning in the documentation for free regarding only using this on memory originally obtained from malloc.\n\n\n\n\n\n"
},

{
    "location": "base/libc/#Base.Libc.free",
    "page": "C Standard Library",
    "title": "Base.Libc.free",
    "category": "function",
    "text": "free(addr::Ptr)\n\nCall free from the C standard library. Only use this on memory obtained from malloc, not on pointers retrieved from other C libraries. Ptr objects obtained from C libraries should be freed by the free functions defined in that library, to avoid assertion failures if multiple libc libraries exist on the system.\n\n\n\n\n\n"
},

{
    "location": "base/libc/#Base.Libc.errno",
    "page": "C Standard Library",
    "title": "Base.Libc.errno",
    "category": "function",
    "text": "errno([code])\n\nGet the value of the C library\'s errno. If an argument is specified, it is used to set the value of errno.\n\nThe value of errno is only valid immediately after a ccall to a C library routine that sets it. Specifically, you cannot call errno at the next prompt in a REPL, because lots of code is executed between prompts.\n\n\n\n\n\n"
},

{
    "location": "base/libc/#Base.Libc.strerror",
    "page": "C Standard Library",
    "title": "Base.Libc.strerror",
    "category": "function",
    "text": "strerror(n=errno())\n\nConvert a system call error code to a descriptive string\n\n\n\n\n\n"
},

{
    "location": "base/libc/#Base.Libc.GetLastError",
    "page": "C Standard Library",
    "title": "Base.Libc.GetLastError",
    "category": "function",
    "text": "GetLastError()\n\nCall the Win32 GetLastError function [only available on Windows].\n\n\n\n\n\n"
},

{
    "location": "base/libc/#Base.Libc.FormatMessage",
    "page": "C Standard Library",
    "title": "Base.Libc.FormatMessage",
    "category": "function",
    "text": "FormatMessage(n=GetLastError())\n\nConvert a Win32 system call error code to a descriptive string [only available on Windows].\n\n\n\n\n\n"
},

{
    "location": "base/libc/#Base.Libc.time-Tuple{Base.Libc.TmStruct}",
    "page": "C Standard Library",
    "title": "Base.Libc.time",
    "category": "method",
    "text": "time(t::TmStruct)\n\nConverts a TmStruct struct to a number of seconds since the epoch.\n\n\n\n\n\n"
},

{
    "location": "base/libc/#Base.Libc.strftime",
    "page": "C Standard Library",
    "title": "Base.Libc.strftime",
    "category": "function",
    "text": "strftime([format], time)\n\nConvert time, given as a number of seconds since the epoch or a TmStruct, to a formatted string using the given format. Supported formats are the same as those in the standard C library.\n\n\n\n\n\n"
},

{
    "location": "base/libc/#Base.Libc.strptime",
    "page": "C Standard Library",
    "title": "Base.Libc.strptime",
    "category": "function",
    "text": "strptime([format], timestr)\n\nParse a formatted time string into a TmStruct giving the seconds, minute, hour, date, etc. Supported formats are the same as those in the standard C library. On some platforms, timezones will not be parsed correctly. If the result of this function will be passed to time to convert it to seconds since the epoch, the isdst field should be filled in manually. Setting it to -1 will tell the C library to use the current system settings to determine the timezone.\n\n\n\n\n\n"
},

{
    "location": "base/libc/#Base.Libc.TmStruct",
    "page": "C Standard Library",
    "title": "Base.Libc.TmStruct",
    "category": "type",
    "text": "TmStruct([seconds])\n\nConvert a number of seconds since the epoch to broken-down format, with fields sec, min, hour, mday, month, year, wday, yday, and isdst.\n\n\n\n\n\n"
},

{
    "location": "base/libc/#Base.Libc.flush_cstdio",
    "page": "C Standard Library",
    "title": "Base.Libc.flush_cstdio",
    "category": "function",
    "text": "flush_cstdio()\n\nFlushes the C stdout and stderr streams (which may have been written to by external C code).\n\n\n\n\n\n"
},

{
    "location": "base/libc/#C-Standard-Library-1",
    "page": "C Standard Library",
    "title": "C Standard Library",
    "category": "section",
    "text": "Base.Libc.malloc\nBase.Libc.calloc\nBase.Libc.realloc\nBase.Libc.free\nBase.Libc.errno\nBase.Libc.strerror\nBase.Libc.GetLastError\nBase.Libc.FormatMessage\nBase.Libc.time(::Base.Libc.TmStruct)\nBase.Libc.strftime\nBase.Libc.strptime\nBase.Libc.TmStruct\nBase.Libc.flush_cstdio"
},

{
    "location": "base/stacktraces/#",
    "page": "StackTraces",
    "title": "StackTraces",
    "category": "page",
    "text": ""
},

{
    "location": "base/stacktraces/#Base.StackTraces.StackFrame",
    "page": "StackTraces",
    "title": "Base.StackTraces.StackFrame",
    "category": "type",
    "text": "StackFrame\n\nStack information representing execution context, with the following fields:\n\nfunc::Symbol\nThe name of the function containing the execution context.\nlinfo::Union{Core.MethodInstance, CodeInfo, Nothing}\nThe MethodInstance containing the execution context (if it could be found).\nfile::Symbol\nThe path to the file containing the execution context.\nline::Int\nThe line number in the file containing the execution context.\nfrom_c::Bool\nTrue if the code is from C.\ninlined::Bool\nTrue if the code is from an inlined frame.\npointer::UInt64\nRepresentation of the pointer to the execution context as returned by backtrace.\n\n\n\n\n\n"
},

{
    "location": "base/stacktraces/#Base.StackTraces.StackTrace",
    "page": "StackTraces",
    "title": "Base.StackTraces.StackTrace",
    "category": "type",
    "text": "StackTrace\n\nAn alias for Vector{StackFrame} provided for convenience; returned by calls to stacktrace.\n\n\n\n\n\n"
},

{
    "location": "base/stacktraces/#Base.StackTraces.stacktrace",
    "page": "StackTraces",
    "title": "Base.StackTraces.stacktrace",
    "category": "function",
    "text": "stacktrace([trace::Vector{Ptr{Cvoid}},] [c_funcs::Bool=false]) -> StackTrace\n\nReturns a stack trace in the form of a vector of StackFrames. (By default stacktrace doesn\'t return C functions, but this can be enabled.) When called without specifying a trace, stacktrace first calls backtrace.\n\n\n\n\n\n"
},

{
    "location": "base/stacktraces/#Base.StackTraces.lookup",
    "page": "StackTraces",
    "title": "Base.StackTraces.lookup",
    "category": "function",
    "text": "lookup(pointer::Union{Ptr{Cvoid}, UInt}) -> Vector{StackFrame}\n\nGiven a pointer to an execution context (usually generated by a call to backtrace), looks up stack frame context information. Returns an array of frame information for all functions inlined at that point, innermost function first.\n\n\n\n\n\n"
},

{
    "location": "base/stacktraces/#Base.StackTraces.remove_frames!",
    "page": "StackTraces",
    "title": "Base.StackTraces.remove_frames!",
    "category": "function",
    "text": "remove_frames!(stack::StackTrace, name::Symbol)\n\nTakes a StackTrace (a vector of StackFrames) and a function name (a Symbol) and removes the StackFrame specified by the function name from the StackTrace (also removing all frames above the specified function). Primarily used to remove StackTraces functions from the StackTrace prior to returning it.\n\n\n\n\n\nremove_frames!(stack::StackTrace, m::Module)\n\nReturns the StackTrace with all StackFrames from the provided Module removed.\n\n\n\n\n\n"
},

{
    "location": "base/stacktraces/#StackTraces-1",
    "page": "StackTraces",
    "title": "StackTraces",
    "category": "section",
    "text": "Base.StackTraces.StackFrame\nBase.StackTraces.StackTrace\nBase.StackTraces.stacktraceThe following methods and types in Base.StackTraces are not exported and need to be called e.g. as StackTraces.lookup(ptr).Base.StackTraces.lookup\nBase.StackTraces.remove_frames!"
},

{
    "location": "base/simd-types/#",
    "page": "SIMD Support",
    "title": "SIMD Support",
    "category": "page",
    "text": ""
},

{
    "location": "base/simd-types/#SIMD-Support-1",
    "page": "SIMD Support",
    "title": "SIMD Support",
    "category": "section",
    "text": "Type VecElement{T} is intended for building libraries of SIMD operations. Practical use of it requires using llvmcall. The type is defined as:struct VecElement{T}\n    value::T\nendIt has a special compilation rule: a homogeneous tuple of VecElement{T} maps to an LLVM vector type when T is a primitive bits type and the tuple length is in the set {2-6,8-10,16}.At -O3, the compiler might automatically vectorize operations on such tuples. For example, the following program, when compiled with julia -O3 generates two SIMD addition instructions (addps) on x86 systems:const m128 = NTuple{4,VecElement{Float32}}\n\nfunction add(a::m128, b::m128)\n    (VecElement(a[1].value+b[1].value),\n     VecElement(a[2].value+b[2].value),\n     VecElement(a[3].value+b[3].value),\n     VecElement(a[4].value+b[4].value))\nend\n\ntriple(c::m128) = add(add(c,c),c)\n\ncode_native(triple,(m128,))However, since the automatic vectorization cannot be relied upon, future use will mostly be via libraries that use llvmcall."
},

{
    "location": "juliacn/style-guide/#",
    "page": "翻译格式指引",
    "title": "翻译格式指引",
    "category": "page",
    "text": ""
},

{
    "location": "juliacn/style-guide/#翻译格式指引-1",
    "page": "翻译格式指引",
    "title": "翻译格式指引",
    "category": "section",
    "text": "统一的翻译稿件格式有助于日后维护。请在参与翻译之前阅读这个指引，以保证大家的文档格式基本一致。"
},

{
    "location": "juliacn/style-guide/#原文段落组织-1",
    "page": "翻译格式指引",
    "title": "原文段落组织",
    "category": "section",
    "text": "英文原文如下方式在Markdown里注释：\\`\\`\\`@raw html\n<!-- English -->\n\\`\\`\\`中文翻译写在下面。"
},

{
    "location": "juliacn/style-guide/#格式细则-1",
    "page": "翻译格式指引",
    "title": "格式细则",
    "category": "section",
    "text": "段落英文中的英文两边空格，例如：不要将它的类型声明为 Int专业词汇请用括号注明英文原文，例如而要使用抽象类型（abstract type）文件链接全部保持原文链接（包括wiki，@ref的文档内部交叉引用）\nmaster分支的文档跟进官方repo的master分支。\n对于表格， 如果翻译则请按照段落处理"
},

{
    "location": "juliacn/style-guide/#提交规则-1",
    "page": "翻译格式指引",
    "title": "提交规则",
    "category": "section",
    "text": "提交译文时， 请用 pull request (PR) 提交。 对于翻译中不确定的部分， 请在 PR 里指明。\n对于含有多个 commit 的 PR， 合并时， 请选择  squash and merge 。"
},

{
    "location": "juliacn/style-guide/#书写规范-1",
    "page": "翻译格式指引",
    "title": "书写规范",
    "category": "section",
    "text": ""
},

{
    "location": "juliacn/style-guide/#标点符号-1",
    "page": "翻译格式指引",
    "title": "标点符号",
    "category": "section",
    "text": "中文内容请使用半角中文标点符号， 尤其是逗号以及括号， 冒号， 破折号。 对于引号， 如果被引用的内容包含英文， 则使用英文引号。"
},

{
    "location": "juliacn/style-guide/#空格-1",
    "page": "翻译格式指引",
    "title": "空格",
    "category": "section",
    "text": "译文一律使用空格， 禁止使用 Tab， 仅对注释原文时可以用 Tab 缩进， 缩进为两个空格。 中文和英文以及数字间应加一个空格。"
},

{
    "location": "juliacn/style-guide/#粗斜体-1",
    "page": "翻译格式指引",
    "title": "粗斜体",
    "category": "section",
    "text": "中文部分不应使用斜体， 对于原文斜体部分， 译文里可以酌情修改为粗体。"
},

{
    "location": "juliacn/style-guide/#内容规范-1",
    "page": "翻译格式指引",
    "title": "内容规范",
    "category": "section",
    "text": "力求表达清楚明确， 语句尽量通顺， 请不要逐字翻译， 避免错别字等。"
},

{
    "location": "juliacn/style-guide/#代码-1",
    "page": "翻译格式指引",
    "title": "代码",
    "category": "section",
    "text": "只翻译注释， 如果代码简单易懂， 可不翻译。"
},

{
    "location": "juliacn/style-guide/#专有名词-1",
    "page": "翻译格式指引",
    "title": "专有名词",
    "category": "section",
    "text": "如果没有对应或者不确定的专有词汇， 可以先不译， 保留在译文里。 等确定后可批量修改。"
},

{
    "location": "juliacn/style-guide/#人称代词-1",
    "page": "翻译格式指引",
    "title": "人称代词",
    "category": "section",
    "text": "像 \"we\" 和 \"you\" 这些词汇一般来说可以不译出来， 或者换个说法。 如果译出来更通顺， 就翻译出来。  "
},

]}
