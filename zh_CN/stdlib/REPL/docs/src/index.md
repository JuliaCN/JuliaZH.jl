# Julia REPL

Julia 附带了一个全功能的交互式命令行 REPL（read-eval-print loop），其内置于 `julia` 可执行文件中。它除了允许快速简便地执行 Julia 语句外，还具有可搜索的历史记录，tab 补全，许多有用的按键绑定以及专用的 help 和 shell 模式。只需不附带任何参数地调用 `julia` 或双击可执行文件即可启动 REPL：

```
$ julia
               _
   _       _ _(_)_     |  A fresh approach to technical computing
  (_)     | (_) (_)    |  Documentation: https://docs.julialang.org
   _ _   _| |_  __ _   |  Type "?help" for help.
  | | | | | | |/ _` |  |
  | | |_| | | | (_| |  |  Version 0.6.0-dev.2493 (2017-01-31 18:53 UTC)
 _/ |\__'_|_|_|\__'_|  |  Commit c99e12c* (0 days old master)
|__/                   |  x86_64-linux-gnu

julia>
```

要退出交互式会话，在空白行上键入 `^D`——control 键和 `d` 键，或者先键入 `quit()`，然后键入 return 或 enter 键。REPL 用横幅和 `julia>` 提示符欢迎你。

## 不同提示符模式

### Julian 模式

REPL 有四种主要的操作模式。第一个也是最常见的是 Julian 提示符。这是默认的操作模式；每个新行最初都以 `julia>` 开头。就在这里，你可以输入 Julia 表达式。在输入完整表达式后按下 return 或 enter 将执行该表达式，并显示最后一个表达式的结果。

```jldoctest
julia> string(1 + 2)
"3"
```

交互式运行有许多独特的实用功能。除了显示结果外，REPL 还将结果绑定到变量 `ans` 上。一行的尾随分号可用作禁止显示结果的标志。

```jldoctest
julia> string(3 * 4);

julia> ans
"12"
```

Julia 模式中，REPL 支持称为 *prompt pasting* 的功能。当粘贴以 `julia> ` 文本到 REPL 中时才会激活此功能。在这种情况下，只有以 `julia> ` 开头的表达式才被解析，其它的表达式则被删除。这使得可以粘贴从 REPL 会话中复制的一大块代码，而无需擦除提示和输出。默认情况下启用此功能，但可以使用`Base.REPL.enable_promptpaste(::Bool)` 任意禁用或启用此功能。如果它已启用，您可以通过将本段上方的代码块直接粘贴到 REPL 中来尝试。此功能在标准的 Windows 命令提示符下不起作用，由于它在检测粘贴何时发生上的限制。

### 帮助模式

当光标在行首时，提示符可以通过键入 `?` 改变为帮助模式。Julia 将尝试打印在帮助模式中输入的任何内容的帮助或文档：

```julia-repl
julia> ? # upon typing ?, the prompt changes (in place) to: help?>

help?> string
search: string String Cstring Cwstring RevString randstring bytestring SubString

  string(xs...)

  Create a string from any values using the print function.
```

还可以查询宏，类型和变量：

```
help?> @time
  @time

  A macro to execute an expression, printing the time it took to execute, the number of allocations,
  and the total number of bytes its execution caused to be allocated, before returning the value of the
  expression.

  See also @timev, @timed, @elapsed, and @allocated.

help?> Int32
search: Int32 UInt32

  Int32 <: Signed

  32-bit signed integer type.
```

通过在行的开头按退格键可以退出帮助模式。

### [Shell 模式](@id man-shell-mode)

正如帮助模式对快速访问文档很有用，另一个常见任务是使用系统 shell 执行系统命令。就像 `?` 进入帮助模式，在行的开头，分号（`;`）将进入 shell 模式。并且通过在行的开头按退格键可以退出 shell 模式。

```julia-repl
julia> ; # upon typing ;, the prompt changes (in place) to: shell>

shell> echo hello
hello
```

### 搜索模式

在所有上述模式中，执行过的行被保存到历史文件中，该文件可以被搜索。要通过之前的历史记录启动增量搜索，请键入 `^R`——control 键和 `r` 键。提示符会变为 ```(reverse-i-search)`':```，搜索查询在你输入时出现在引号中。匹配查询的最近结果会在输入更多内容时动态更新到冒号右侧。要使用相同的查询查找更旧的结果，只需再次键入 `^R`。

正如 `^R` 是反向搜索，`^S` 是前向搜索，带有提示符 ```(i-search)`':```。这两者可以彼此结合使用以分别移动至前一个或下一个匹配结果。

## 按键绑定

Julia REPL 充分利用了按键绑定。上面已经介绍了几个 control 键绑定（`^D` 退出，`^R` 和 `^S`用于搜索），但还有更多按键绑定。除 control 键之外，还有 meta 键绑定。这些因平台而异，但大多数终端默认使用按住 alt- 或 option- 和一个键发送 meta 键（或者可以配置为执行此操作）。

| 按键绑定          | 描述                                                                                                |
|:------------------- |:---------------------------------------------------------------------------------------------------------- |
| **程序控制** |                                                                                                            |
| `^D`                | 退出（当缓冲区为空）                                                                                |
| `^C`                | 中断或取消                                                                                        |
| `^L`                | 清空控制台屏幕                                                                                       |
| Return/Enter, `^J`  | 插入新行，如果行是完整的则执行之                                                                      |
| meta-Return/Enter   | 插入新行而不执行它                                                                       |
| `?` 或 `;`          | 进入帮助或 shell 模式（当在行首时）                                                         |
| `^R`, `^S`          | 增量历史搜索，如上所述                                                                |
| **光标移动** |                                                                                                            |
| Right arrow, `^F`   | 向右移动一个字符                                                                                   |
| Left arrow, `^B`    | 向左移动一个字符                                                                                    |
| ctrl-Right, `meta-F`| 向右移动一个单词                                                                                        |
| ctrl-Left, `meta-B` | 向左移动一个单词                                                                                         |
| Home, `^A`          | 移动至行首                                                                                  |
| End, `^E`           | 移动至行尾                                                                                        |
| Up arrow, `^P`      | 向上移动一行（或更改为与光标前文本相匹配的上一条历史记录）         |
| Down arrow, `^N`    | 向下移动一行（或更改为与光标前文本相匹配的下一条历史记录）           |
| Shift-Arrow Key     | Move cursor according to the direction of the Arrow key, while activating the region ("shift selection")   |
| Page-up, `meta-P`   | 更改为上一条历史记录                                                                       |
| Page-down, `meta-N` | 更改为下一条历史记录                                                                           |
| `meta-<`            | 更改为（当前会话的）第一条历史记录（如果其在历史记录中位于当前位置之前） |
| `meta->`            | 更改为最后一条历史记录                                                                           |
| `^-Space`           | Set the "mark" in the editing region (and de-activate the region if it's active)                           |
| `^-Space ^-Space`   | Set the "mark" in the editing region and make the region "active", i.e. highlighted                        |
| `^G`                | De-activate the region (i.e. make it not highlighted)                                                      |
| `^X^X`              | Exchange the current position with the mark                                                                |
| **编辑**         |                                                                                                            |
| Backspace, `^H`     | 删除前一个字符，或者整个区域，当它是 active 时                                        |
| Delete, `^D`        | Forward delete one character (when buffer has text)                                                        |
| meta-Backspace      | Delete the previous word                                                                                   |
| `meta-d`            | Forward delete the next word                                                                               |
| `^W`                | Delete previous text up to the nearest whitespace                                                          |
| `meta-w`            | Copy the current region in the kill ring                                                                   |
| `meta-W`            | "Kill" the current region, placing the text in the kill ring                                               |
| `^K`                | "Kill" to end of line, placing the text in the kill ring                                                   |
| `^Y`                | "Yank" insert the text from the kill ring                                                                  |
| `meta-y`            | Replace a previously yanked text with an older entry from the kill ring                                    |
| `^T`                | Transpose the characters about the cursor                                                                  |
| `meta-Up arrow`     | 颠倒当前行和上一行                                                                     |
| `meta-Down arrow`   | 颠倒当前行和下一行                                                                     |
| `meta-u`            | Change the next word to uppercase                                                                          |
| `meta-c`            | Change the next word to titlecase                                                                          |
| `meta-l`            | Change the next word to lowercase                                                                          |
| `^/`, `^_`          | 撤消上一个编辑操作                                                                               |
| `^Q`                | Write a number in REPL and press `^Q` to open editor at corresponding stackframe or method                 |
| `meta-Left Arrow`   | indent the current line on the left                                                                        |
| `meta-Right Arrow`  | indent the current line on the right                                                                       |


### 自定义按键绑定

通过将字典传递给 `REPL.setup_interface`，Julia 的 REPL 按键绑定可以完全根据用户的喜好进行自定义。该字典的键可以是字符或字符串。键 `'*'` 表示默认操作。Control 键加字符 `x` 的绑定用 `"^x"` 表示。Meta 加 `x` 可以写成 `"\\Mx"`。自定义按键映射必须为 `nothing`（表示输入应被忽略）或接受签名的函数  `(PromptState, AbstractREPL, Char)`。必须在 REPL 初始化前调用 `REPL.setup_interface` 函数，方法是通过 [`atreplinit`](@ref) 注册操作。例如，要绑定上和下方向键在没有前缀搜索的情况下浏览历史记录，可以将以下代码放在 `~/.julia/config/startup.jl` 中：

```julia
import REPL
import REPL.LineEdit

const mykeys = Dict{Any,Any}(
    # Up Arrow
    "\e[A" => (s,o...)->(LineEdit.edit_move_up(s) || LineEdit.history_prev(s, LineEdit.mode(s).hist)),
    # Down Arrow
    "\e[B" => (s,o...)->(LineEdit.edit_move_up(s) || LineEdit.history_next(s, LineEdit.mode(s).hist))
)

function customize_keys(repl)
    repl.interface = REPL.setup_interface(repl; extra_repl_keymap = mykeys)
end

atreplinit(customize_keys)
```

用户应该参考 `LineEdit.jl` 来发现输入按键的可用操作。

## Tab 补全

在 REPL 的 Julian 和帮助模式中，可以函数或类型的前几个字符，接着按 tab 键来获取所有匹配组成的列表：

```julia-repl
julia> stri[TAB]
stride     strides     string      strip

julia> Stri[TAB]
StridedArray    StridedMatrix    StridedVecOrMat  StridedVector    String
```

Tab 键也可用于将 LaTeX 数学符号替换为其 Unicode 等价字符，也可用于获取 LaTeX 匹配组成的列表：

```julia-repl
julia> \pi[TAB]
julia> π
π = 3.1415926535897...

julia> e\_1[TAB] = [1,0]
julia> e₁ = [1,0]
2-element Array{Int64,1}:
 1
 0

julia> e\^1[TAB] = [1 0]
julia> e¹ = [1 0]
1×2 Array{Int64,2}:
 1  0

julia> \sqrt[TAB]2     # √ is equivalent to the sqrt function
julia> √2
1.4142135623730951

julia> \hbar[TAB](h) = h / 2\pi[TAB]
julia> ħ(h) = h / 2π
ħ (generic function with 1 method)

julia> \h[TAB]
\hat              \hermitconjmatrix  \hkswarow          \hrectangle
\hatapprox        \hexagon           \hookleftarrow     \hrectangleblack
\hbar             \hexagonblack      \hookrightarrow    \hslash
\heartsuit        \hksearow          \house             \hspace

julia> α="\alpha[TAB]"   # LaTeX completion also works in strings
julia> α="α"
```

Tab 补全的完整列表可以在手册的 [Unicode 输入表](@ref)章节中找到。

路径补全适用于字符串和 julia 的 shell 模式：

```julia-repl
julia> path="/[TAB]"
.dockerenv  .juliabox/   boot/        etc/         lib/         media/       opt/         root/        sbin/        sys/         usr/
.dockerinit bin/         dev/         home/        lib64/       mnt/         proc/        run/         srv/         tmp/         var/
shell> /[TAB]
.dockerenv  .juliabox/   boot/        etc/         lib/         media/       opt/         root/        sbin/        sys/         usr/
.dockerinit bin/         dev/         home/        lib64/       mnt/         proc/        run/         srv/         tmp/         var/
```

Tab 补全可以帮助查找与输入参数相匹配的可用方法：

```julia-repl
julia> max([TAB] # All methods are displayed, not shown here due to size of the list

julia> max([1, 2], [TAB] # All methods where `Vector{Int}` matches as first argument
max(x, y) in Base at operators.jl:215
max(a, b, c, xs...) in Base at operators.jl:281

julia> max([1, 2], max(1, 2), [TAB] # All methods matching the arguments.
max(x, y) in Base at operators.jl:215
max(a, b, c, xs...) in Base at operators.jl:281
```

Keywords are also displayed in the suggested methods after `;`, see below line where `limit`
and `keepempty` are keyword arguments:

```julia-repl
julia> split("1 1 1", [TAB]
split(str::AbstractString; limit, keepempty) in Base at strings/util.jl:302
split(str::T, splitter; limit, keepempty) where T<:AbstractString in Base at strings/util.jl:277
```

The completion of the methods uses type inference and can therefore see if the arguments match
even if the arguments are output from functions. The function needs to be type stable for the
completion to be able to remove non-matching methods.

Tab completion can also help completing fields:

```julia-repl
julia> import UUIDs

julia> UUIDs.uuid[TAB]
uuid1        uuid4         uuid_version
```

Fields for output from functions can also be completed:

```julia-repl
julia> split("","")[1].[TAB]
lastindex  offset  string
```

The completion of fields for output from functions uses type inference, and it can only suggest
fields if the function is type stable.

## Customizing Colors

The colors used by Julia and the REPL can be customized, as well. To change the
color of the Julia prompt you can add something like the following to your
`~/.julia/config/startup.jl` file, which is to be placed inside your home directory:

```julia
function customize_colors(repl)
    repl.prompt_color = Base.text_colors[:cyan]
end

atreplinit(customize_colors)
```

The available color keys can be seen by typing `Base.text_colors` in the help mode of the REPL.
In addition, the integers 0 to 255 can be used as color keys for terminals
with 256 color support.

You can also change the colors for the help and shell prompts and
input and answer text by setting the appropriate field of `repl` in the `customize_colors` function
above (respectively, `help_color`, `shell_color`, `input_color`, and `answer_color`). For the
latter two, be sure that the `envcolors` field is also set to false.

It is also possible to apply boldface formatting by using
`Base.text_colors[:bold]` as a color. For instance, to print answers in
boldface font, one can use the following as a `~/.julia/config/startup.jl`:

```julia
function customize_colors(repl)
    repl.envcolors = false
    repl.answer_color = Base.text_colors[:bold]
end

atreplinit(customize_colors)
```

You can also customize the color used to render warning and informational messages by
setting the appropriate environment variables. For instance, to render error, warning, and informational
messages respectively in magenta, yellow, and cyan you can add the following to your
`~/.julia/config/startup.jl` file:

```julia
ENV["JULIA_ERROR_COLOR"] = :magenta
ENV["JULIA_WARN_COLOR"] = :yellow
ENV["JULIA_INFO_COLOR"] = :cyan
```

# TerminalMenus

TerminalMenus is a submodule of the Julia REPL and enables small, low-profile interactive menus in the terminal.

## Examples

```julia
import REPL
using REPL.TerminalMenus

options = ["apple", "orange", "grape", "strawberry",
            "blueberry", "peach", "lemon", "lime"]

```

### RadioMenu

The RadioMenu allows the user to select one option from the list. The `request`
function displays the interactive menu and returns the index of the selected
choice. If a user presses 'q' or `ctrl-c`, `request` will return a `-1`.


```julia
# `pagesize` is the number of items to be displayed at a time.
#  The UI will scroll if the number of options is greater
#   than the `pagesize`
menu = RadioMenu(options, pagesize=4)

# `request` displays the menu and returns the index after the
#   user has selected a choice
choice = request("Choose your favorite fruit:", menu)

if choice != -1
    println("Your favorite fruit is ", options[choice], "!")
else
    println("Menu canceled.")
end

```

Output:

```
Choose your favorite fruit:
^  grape
   strawberry
 > blueberry
v  peach
Your favorite fruit is blueberry!
```

### MultiSelectMenu

The MultiSelectMenu allows users to select many choices from a list.

```julia
# here we use the default `pagesize` 10
menu = MultiSelectMenu(options)

# `request` returns a `Set` of selected indices
# if the menu us canceled (ctrl-c or q), return an empty set
choices = request("Select the fruits you like:", menu)

if length(choices) > 0
    println("You like the following fruits:")
    for i in choices
        println("  - ", options[i])
    end
else
    println("Menu canceled.")
end
```

Output:

```
Select the fruits you like:
[press: d=done, a=all, n=none]
   [ ] apple
 > [X] orange
   [X] grape
   [ ] strawberry
   [ ] blueberry
   [X] peach
   [ ] lemon
   [ ] lime
You like the following fruits:
  - orange
  - grape
  - peach
```

## Customization / Configuration

All interface customization is done through the keyword only
`TerminalMenus.config()` function.

### Arguments

 - `charset::Symbol=:na`: ui characters to use (`:ascii` or `:unicode`); overridden by other arguments
 - `cursor::Char='>'|'→'`: character to use for cursor
 - `up_arrow::Char='^'|'↑'`: character to use for up arrow
 - `down_arrow::Char='v'|'↓'`: character to use for down arrow
 - `checked::String="[X]"|"✓"`: string to use for checked
 - `unchecked::String="[ ]"|"⬚")`: string to use for unchecked
 - `scroll::Symbol=:na`: If `:wrap` then wrap the cursor around top and bottom, if :`nowrap` do not wrap cursor
 - `supress_output::Bool=false`: For testing. If true, menu will not be printed to console.
 - `ctrl_c_interrupt::Bool=true`: If `false`, return empty on ^C, if `true` throw InterruptException() on ^C

### Examples

```julia
julia> menu = MultiSelectMenu(options, pagesize=5);

julia> request(menu) # ASCII is used by default
[press: d=done, a=all, n=none]
   [ ] apple
   [X] orange
   [ ] grape
 > [X] strawberry
v  [ ] blueberry
Set([4, 2])

julia> TerminalMenus.config(charset=:unicode)

julia> request(menu)
[press: d=done, a=all, n=none]
   ⬚ apple
   ✓ orange
   ⬚ grape
 → ✓ strawberry
↓  ⬚ blueberry
Set([4, 2])

julia> TerminalMenus.config(checked="YEP!", unchecked="NOPE", cursor='⧐')

julia> request(menu)
[press: d=done, a=all, n=none]
   NOPE apple
   YEP! orange
   NOPE grape
 ⧐ YEP! strawberry
↓  NOPE blueberry
Set([4, 2])

```

# References

```@docs
Base.atreplinit
```
