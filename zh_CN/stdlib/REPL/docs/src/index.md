# The Julia REPL

Julia 附带了一个全功能的交互式命令行 REPL（read-eval-print loop），其内置于 `julia` 可执行文件中。它除了允许快速简便地执行 Julia 语句外，还具有可搜索的历史记录，tab 补全，许多有用的按键绑定以及专用的 help 和 shell 模式。只需不附带任何参数地调用 `julia` 或双击可执行文件即可启动 REPL：

```@eval
io = IOBuffer()
Base.banner(io)
banner = String(take!(io))
import Markdown
Markdown.parse("```\n\$ julia\n\n$(banner)\njulia>\n```")
```

要退出交互式会话，在空白行上键入 `^D`——control 键和 `d` 键，或者先键入 `quit()`，然后键入 return 或 enter 键。REPL 用横幅和 `julia>` 提示符欢迎你。

## 不同的提示符模式

### Julian 模式

The REPL has five main modes of operation. The first and most common is the Julian prompt. It
is the default mode of operation; each new line initially starts with `julia>`. It is here that
you can enter Julia expressions. Hitting return or enter after a complete expression has been
entered will evaluate the entry and show the result of the last expression.

```jldoctest
julia> string(1 + 2)
"3"
```

There are a number of useful features unique to interactive work. In addition to showing the result,
the REPL also binds the result to the variable `ans`. A trailing semicolon on the line can be
used as a flag to suppress showing the result.

```jldoctest
julia> string(3 * 4);

julia> ans
"12"
```

In Julia mode, the REPL supports something called *prompt pasting*. This activates when pasting text
that starts with `julia> ` into the REPL. In that case, only expressions starting with `julia> ` (as
well as the other REPL mode prompts: `shell> `, `help?> `, `pkg>` ) are parsed, but others are
removed. This makes it possible to paste a chunk of text that has been copied from a REPL session
without having to scrub away prompts and outputs. This feature is enabled by default but can be
disabled or enabled at will with `REPL.enable_promptpaste(::Bool)`. If it is enabled, you can try it
out by pasting the code block above this paragraph straight into the REPL. This feature does not
work on the standard Windows command prompt due to its limitation at detecting when a paste occurs.

Objects are printed at the REPL using the [`show`](@ref) function with a specific [`IOContext`](@ref).
In particular, the `:limit` attribute is set to `true`.
Other attributes can receive in certain `show` methods a default value if it's not already set,
like `:compact`.
It's possible, as an experimental feature, to specify the attributes used by the REPL via the
`Base.active_repl.options.iocontext` dictionary (associating values to attributes). For example:

```julia-repl
julia> rand(2, 2)
2×2 Array{Float64,2}:
 0.8833    0.329197
 0.719708  0.59114

julia> show(IOContext(stdout, :compact => false), "text/plain", rand(2, 2))
 0.43540323669187075  0.15759787870609387
 0.2540832269192739   0.4597637838786053
julia> Base.active_repl.options.iocontext[:compact] = false;

julia> rand(2, 2)
2×2 Array{Float64,2}:
 0.2083967319174056  0.13330606013126012
 0.6244375177790158  0.9777957560761545
```

In order to define automatically the values of this dictionary at startup time, one can use the
[`atreplinit`](@ref) function in the `~/.julia/config/startup.jl` file, for example:
```julia
atreplinit() do repl
    repl.options.iocontext[:compact] = false
end
```

### 帮助模式

When the cursor is at the beginning of the line, the prompt can be changed to a help mode by typing
`?`. Julia will attempt to print help or documentation for anything entered in help mode:

```julia-repl
julia> ? # upon typing ?, the prompt changes (in place) to: help?>

help?> string
search: string String Cstring Cwstring RevString randstring bytestring SubString

  string(xs...)

  Create a string from any values using the print function.
```

Macros, types and variables can also be queried:

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

A string or regex literal searches all docstrings using [`apropos`](@ref):

```
help?> "aprop"
REPL.stripmd
Base.Docs.apropos

help?> r"ap..p"
Base.:∘
Base.shell_escape_posixly
Distributed.CachingPool
REPL.stripmd
Base.Docs.apropos
```

Another feature of help mode is the ability to access extended docstrings. You can do this by typing something like `??Print` rather than `?Print` which will display the `# Extended help` section from the source codes documentation.

Help mode can be exited by pressing backspace at the beginning of the line.

### [Shell mode](@id man-shell-mode)

Just as help mode is useful for quick access to documentation, another common task is to use the
system shell to execute system commands. Just as `?` entered help mode when at the beginning
of the line, a semicolon (`;`) will enter the shell mode. And it can be exited by pressing backspace
at the beginning of the line.

```julia-repl
julia> ; # upon typing ;, the prompt changes (in place) to: shell>

shell> echo hello
hello
```
!!! note
    For Windows users, Julia's shell mode does not expose windows shell commands.
    Hence, this will fail:

```julia-repl
julia> ; # upon typing ;, the prompt changes (in place) to: shell>

shell> dir
ERROR: IOError: could not spawn `dir`: no such file or directory (ENOENT)
Stacktrace!
.......
```
However, you can get access to `PowerShell` like this:
```julia-repl
julia> ; # upon typing ;, the prompt changes (in place) to: shell>

shell> powershell
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.
PS C:\Users\elm>
```
... and to `cmd.exe` like that (see the `dir` command):
```julia-repl
julia> ; # upon typing ;, the prompt changes (in place) to: shell>

shell> cmd
Microsoft Windows [version 10.0.17763.973]
(c) 2018 Microsoft Corporation. All rights reserved.
C:\Users\elm>dir
 Volume in drive C has no label
 Volume Serial Number is 1643-0CD7
  Directory of C:\Users\elm

29/01/2020  22:15    <DIR>          .
29/01/2020  22:15    <DIR>          ..
02/02/2020  08:06    <DIR>          .atom
```

### Pkg mode

The Package manager mode accepts specialized commands for loading and updating packages. It is entered
by pressing the `]` key at the Julian REPL prompt and exited by pressing CTRL-C or pressing the backspace key
at the beginning of the line. The prompt for this mode is `pkg>`. It supports its own help-mode, which is
entered by pressing `?` at the beginning  of the line of the `pkg>` prompt. The Package manager mode is
documented in the Pkg manual, available at [https://julialang.github.io/Pkg.jl/v1/](https://julialang.github.io/Pkg.jl/v1/).

### Search modes

In all of the above modes, the executed lines get saved to a history file, which can be searched.
 To initiate an incremental search through the previous history, type `^R` -- the control key
together with the `r` key. The prompt will change to ```(reverse-i-search)`':```, and as you
type the search query will appear in the quotes. The most recent result that matches the query
will dynamically update to the right of the colon as more is typed. To find an older result using
the same query, simply type `^R` again.

Just as `^R` is a reverse search, `^S` is a forward search, with the prompt ```(i-search)`':```.
 The two may be used in conjunction with each other to move through the previous or next matching
results, respectively.

All executed commands in the Julia REPL are logged into `~/.julia/logs/repl_history.jl` along with a timestamp of when it was executed
and the current REPL mode you were in. Search mode queries this log file in order to find the commands which you previously ran.
This can be disabled at startup by passing the `--history-file=no` flag to Julia.

## Key bindings

The Julia REPL makes great use of key bindings. Several control-key bindings were already introduced
above (`^D` to exit, `^R` and `^S` for searching), but there are many more. In addition to the
control-key, there are also meta-key bindings. These vary more by platform, but most terminals
default to using alt- or option- held down with a key to send the meta-key (or can be configured
to do so), or pressing Esc and then the key.

| Keybinding          | Description                                                                                                |
|:------------------- |:---------------------------------------------------------------------------------------------------------- |
| **Program control** |                                                                                                            |
| `^D`                | Exit (when buffer is empty)                                                                                |
| `^C`                | Interrupt or cancel                                                                                        |
| `^L`                | Clear console screen                                                                                       |
| Return/Enter, `^J`  | New line, executing if it is complete                                                                      |
| meta-Return/Enter   | Insert new line without executing it                                                                       |
| `?` or `;`          | Enter help or shell mode (when at start of a line)                                                         |
| `^R`, `^S`          | Incremental history search, described above                                                                |
| **Cursor movement** |                                                                                                            |
| Right arrow, `^F`   | Move right one character                                                                                   |
| Left arrow, `^B`    | Move left one character                                                                                    |
| ctrl-Right, `meta-F`| Move right one word                                                                                        |
| ctrl-Left, `meta-B` | Move left one word                                                                                         |
| Home, `^A`          | Move to beginning of line                                                                                  |
| End, `^E`           | Move to end of line                                                                                        |
| Up arrow, `^P`      | Move up one line (or change to the previous history entry that matches the text before the cursor)         |
| Down arrow, `^N`    | Move down one line (or change to the next history entry that matches the text before the cursor)           |
| Shift-Arrow Key     | Move cursor according to the direction of the Arrow key, while activating the region ("shift selection")   |
| Page-up, `meta-P`   | Change to the previous history entry                                                                       |
| Page-down, `meta-N` | Change to the next history entry                                                                           |
| `meta-<`            | Change to the first history entry (of the current session if it is before the current position in history) |
| `meta->`            | Change to the last history entry                                                                           |
| `^-Space`           | Set the "mark" in the editing region (and de-activate the region if it's active)                           |
| `^-Space ^-Space`   | Set the "mark" in the editing region and make the region "active", i.e. highlighted                        |
| `^G`                | De-activate the region (i.e. make it not highlighted)                                                      |
| `^X^X`              | Exchange the current position with the mark                                                                |
| **Editing**         |                                                                                                            |
| Backspace, `^H`     | Delete the previous character, or the whole region when it's active                                        |
| Delete, `^D`        | Forward delete one character (when buffer has text)                                                        |
| meta-Backspace      | Delete the previous word                                                                                   |
| `meta-d`            | Forward delete the next word                                                                               |
| `^W`                | Delete previous text up to the nearest whitespace                                                          |
| `meta-w`            | Copy the current region in the kill ring                                                                   |
| `meta-W`            | "Kill" the current region, placing the text in the kill ring                                               |
| `^U`                | "Kill" to beginning of line, placing the text in the kill ring                                             |
| `^K`                | "Kill" to end of line, placing the text in the kill ring                                                   |
| `^Y`                | "Yank" insert the text from the kill ring                                                                  |
| `meta-y`            | Replace a previously yanked text with an older entry from the kill ring                                    |
| `^T`                | Transpose the characters about the cursor                                                                  |
| `meta-Up arrow`     | Transpose current line with line above                                                                     |
| `meta-Down arrow`   | Transpose current line with line below                                                                     |
| `meta-u`            | Change the next word to uppercase                                                                          |
| `meta-c`            | Change the next word to titlecase                                                                          |
| `meta-l`            | Change the next word to lowercase                                                                          |
| `^/`, `^_`          | Undo previous editing action                                                                               |
| `^Q`                | Write a number in REPL and press `^Q` to open editor at corresponding stackframe or method                 |
| `meta-Left Arrow`   | Indent the current line on the left                                                                        |
| `meta-Right Arrow`  | Indent the current line on the right                                                                       |
| `meta-.`            | Insert last word from previous history entry                                                               |
| `meta-e`            | Edit the current input in an editor                                                                        |

### Customizing keybindings

Julia's REPL keybindings may be fully customized to a user's preferences by passing a dictionary
to `REPL.setup_interface`. The keys of this dictionary may be characters or strings. The key
`'*'` refers to the default action. Control plus character `x` bindings are indicated with `"^x"`.
Meta plus `x` can be written `"\\M-x"` or `"\ex"`, and Control plus `x` can be written
`"\\C-x"` or `"^x"`.
The values of the custom keymap must be `nothing` (indicating
that the input should be ignored) or functions that accept the signature
`(PromptState, AbstractREPL, Char)`.
The `REPL.setup_interface` function must be called before the REPL is initialized, by registering
the operation with [`atreplinit`](@ref) . For example, to bind the up and down arrow keys to move through
history without prefix search, one could put the following code in `~/.julia/config/startup.jl`:

```julia
import REPL
import REPL.LineEdit

const mykeys = Dict{Any,Any}(
    # Up Arrow
    "\e[A" => (s,o...)->(LineEdit.edit_move_up(s) || LineEdit.history_prev(s, LineEdit.mode(s).hist)),
    # Down Arrow
    "\e[B" => (s,o...)->(LineEdit.edit_move_down(s) || LineEdit.history_next(s, LineEdit.mode(s).hist))
)

function customize_keys(repl)
    repl.interface = REPL.setup_interface(repl; extra_repl_keymap = mykeys)
end

atreplinit(customize_keys)
```

Users should refer to `LineEdit.jl` to discover the available actions on key input.

## Tab completion

In both the Julian and help modes of the REPL, one can enter the first few characters of a function
or type and then press the tab key to get a list all matches:

```julia-repl
julia> x[TAB]
julia> xor
```

In some cases it only completes part of the name, up to the next ambiguity:

```julia-repl
julia> mapf[TAB]
julia> mapfold
```

If you hit tab again, then you get the list of things that might complete this:

```julia-repl
julia> mapfold[TAB]
mapfoldl mapfoldr
```

Like other components of the REPL, the search is case-sensitive:

```julia-repl
julia> stri[TAB]
stride     strides     string      strip

julia> Stri[TAB]
StridedArray    StridedMatrix    StridedVecOrMat  StridedVector    String
```

The tab key can also be used to substitute LaTeX math symbols with their Unicode equivalents,
and get a list of LaTeX matches as well:

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

A full list of tab-completions can be found in the [Unicode Input](@ref) section of the manual.

Completion of paths works for strings and julia's shell mode:

```julia-repl
julia> path="/[TAB]"
.dockerenv  .juliabox/   boot/        etc/         lib/         media/       opt/         root/        sbin/        sys/         usr/
.dockerinit bin/         dev/         home/        lib64/       mnt/         proc/        run/         srv/         tmp/         var/
shell> /[TAB]
.dockerenv  .juliabox/   boot/        etc/         lib/         media/       opt/         root/        sbin/        sys/         usr/
.dockerinit bin/         dev/         home/        lib64/       mnt/         proc/        run/         srv/         tmp/         var/
```

Dictionary keys can also be tab completed:

```julia-repl
julia> foo = Dict("qwer1"=>1, "qwer2"=>2, "asdf"=>3)
Dict{String,Int64} with 3 entries:
  "qwer2" => 2
  "asdf"  => 3
  "qwer1" => 1

julia> foo["q[TAB]

"qwer1" "qwer2"
julia> foo["qwer
```

Tab completion can also help completing fields:

```julia-repl
julia> x = 3 + 4im;

julia> x.[TAB][TAB]
im re

julia> import UUIDs

julia> UUIDs.uuid[TAB][TAB]
uuid1        uuid4         uuid5        uuid_version
```

Fields for output from functions can also be completed:

```julia-repl
julia> split("","")[1].[TAB]
lastindex  offset  string
```

The completion of fields for output from functions uses type inference, and it can only suggest
fields if the function is type stable.


Tab completion can help with investigation of the available methods matching the input arguments:

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

If you wonder which methods can be used with particular argument types, use `?` as the function name.
This shows an example of looking for functions in InteractiveUtils that accept a single string:

```julia-repl
julia> InteractiveUtils.?("somefile")[TAB]
edit(path::AbstractString) in InteractiveUtils at InteractiveUtils/src/editless.jl:197
less(file::AbstractString) in InteractiveUtils at InteractiveUtils/src/editless.jl:266
```

This listed methods in the `InteractiveUtils` module that can be called on a string.
By default, this excludes methods where all arguments are typed as `Any`,
but you can see those too by holding down SHIFT-TAB instead of TAB:

```julia-repl
julia> InteractiveUtils.?("somefile")[SHIFT-TAB]
apropos(string) in REPL at REPL/src/docview.jl:796
clipboard(x) in InteractiveUtils at InteractiveUtils/src/clipboard.jl:64
code_llvm(f) in InteractiveUtils at InteractiveUtils/src/codeview.jl:221
code_native(f) in InteractiveUtils at InteractiveUtils/src/codeview.jl:243
edit(path::AbstractString) in InteractiveUtils at InteractiveUtils/src/editless.jl:197
edit(f) in InteractiveUtils at InteractiveUtils/src/editless.jl:225
eval(x) in InteractiveUtils at InteractiveUtils/src/InteractiveUtils.jl:3
include(x) in InteractiveUtils at InteractiveUtils/src/InteractiveUtils.jl:3
less(file::AbstractString) in InteractiveUtils at InteractiveUtils/src/editless.jl:266
less(f) in InteractiveUtils at InteractiveUtils/src/editless.jl:274
report_bug(kind) in InteractiveUtils at InteractiveUtils/src/InteractiveUtils.jl:391
separate_kwargs(args...; kwargs...) in InteractiveUtils at InteractiveUtils/src/macros.jl:7
```

You can also use ` ?("somefile")[TAB]`  and look across all modules, but the method lists can be long.

By omitting the closing parenthesis, you can include functions that might require additional arguments:

```julia-repl
julia> using Mmap

help?> Mmap.?("file",[TAB]
Mmap.Anonymous(name::String, readonly::Bool, create::Bool) in Mmap at Mmap/src/Mmap.jl:16
mmap(file::AbstractString) in Mmap at Mmap/src/Mmap.jl:245
mmap(file::AbstractString, ::Type{T}) where T<:Array in Mmap at Mmap/src/Mmap.jl:245
mmap(file::AbstractString, ::Type{T}, dims::Tuple{Vararg{Integer, N}}) where {T<:Array, N} in Mmap at Mmap/src/Mmap.jl:245
mmap(file::AbstractString, ::Type{T}, dims::Tuple{Vararg{Integer, N}}, offset::Integer; grow, shared) where {T<:Array, N} in Mmap at Mmap/src/Mmap.jl:245
mmap(file::AbstractString, ::Type{T}, len::Integer) where T<:Array in Mmap at Mmap/src/Mmap.jl:251
mmap(file::AbstractString, ::Type{T}, len::Integer, offset::Integer; grow, shared) where T<:Array in Mmap at Mmap/src/Mmap.jl:251
mmap(file::AbstractString, ::Type{T}, dims::Tuple{Vararg{Integer, N}}) where {T<:BitArray, N} in Mmap at Mmap/src/Mmap.jl:316
mmap(file::AbstractString, ::Type{T}, dims::Tuple{Vararg{Integer, N}}, offset::Integer; grow, shared) where {T<:BitArray, N} in Mmap at Mmap/src/Mmap.jl:316
mmap(file::AbstractString, ::Type{T}, len::Integer) where T<:BitArray in Mmap at Mmap/src/Mmap.jl:322
mmap(file::AbstractString, ::Type{T}, len::Integer, offset::Integer; grow, shared) where T<:BitArray in Mmap at Mmap/src/Mmap.jl:322
```

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


## Changing the contextual module which is active at the REPL

When entering expressions at the REPL, they are by default evaluated in the `Main` module;

```julia-repl
julia> @__MODULE__
Main
```

It is possible to change this contextual module via the function
`REPL.activate(m)` where `m` is a `Module` or by typing the module in the REPL
and pressing the keybinding Alt-m (the cursor must be on the module name). The
active module is shown in the prompt:

```julia-repl
julia> using REPL

julia> REPL.activate(Base)

(Base) julia> @__MODULE__
Base

(Base) julia> using REPL # Need to load REPL into Base module to use it

(Base) julia> REPL.activate(Main)

julia>

julia> Core<Alt-m> # using the keybinding to change module

(Core) julia>

(Core) julia> Main<Alt-m> # going back to Main via keybinding

julia>
```

Functions that take an optional module argument often defaults to the REPL
context module. As an example, calling `varinfo()` will show the variables of
the current active module:

```julia-repl
julia> module CustomMod
           export var, f
           var = 1
           f(x) = x^2
       end;

julia> REPL.activate(CustomMod)

(Main.CustomMod) julia> varinfo()
  name         size summary
  ––––––––– ––––––– ––––––––––––––––––––––––––––––––––
  CustomMod         Module
  f         0 bytes f (generic function with 1 method)
  var       8 bytes Int64
```

## Numbered prompt

It is possible to get an interface which is similar to the IPython REPL and the Mathematica notebook with numbered input prompts and output prefixes. This is done by calling `REPL.numbered_prompt!()`. If you want to have this enabled on startup, add

```julia
atreplinit() do repl
    @eval import REPL
    if !isdefined(repl, :interface)
        repl.interface = REPL.setup_interface(repl)
    end
    REPL.numbered_prompt!(repl)
end
```

to your `startup.jl` file. In numbered prompt the variable `Out[n]` (where `n` is an integer) can be used to refer to earlier results:

```julia-repl
In [1]: 5 + 3
Out[1]: 8

In [2]: Out[1] + 5
Out[2]: 13

In [3]: Out
Out[3]: Dict{Int64, Any} with 2 entries:
  2 => 13
  1 => 8
```

!!! note
    Since all outputs from previous REPL evaluations are saved in the `Out` variable, one should be careful if they are returning many
    large in-memory objects like arrays, since they will be protected from garbage collection so long as a reference to them remains in
    `Out`. If you need to remove references to objects in `Out`, you can clear the entire history it stores with `empty!(Out)`, or clear
    an individual entry with `Out[n] = nothing`.


## TerminalMenus

TerminalMenus is a submodule of the Julia REPL and enables small, low-profile interactive menus in the terminal.

### Examples

```julia
import REPL
using REPL.TerminalMenus

options = ["apple", "orange", "grape", "strawberry",
            "blueberry", "peach", "lemon", "lime"]

```

#### RadioMenu

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

#### MultiSelectMenu

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
[press: Enter=toggle, a=all, n=none, d=done, q=abort]
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

### Customization / Configuration

#### ConfiguredMenu subtypes

Starting with Julia 1.6, the recommended way to configure menus is via the constructor.
For instance, the default multiple-selection menu

```
julia> menu = MultiSelectMenu(options, pagesize=5);

julia> request(menu) # ASCII is used by default
[press: Enter=toggle, a=all, n=none, d=done, q=abort]
   [ ] apple
   [X] orange
   [ ] grape
 > [X] strawberry
v  [ ] blueberry
```

can instead be rendered with Unicode selection and navigation characters with

```julia-repl
julia> menu = MultiSelectMenu(options, pagesize=5, charset=:unicode);

julia> request(menu)
[press: Enter=toggle, a=all, n=none, d=done, q=abort]
   ⬚ apple
   ✓ orange
   ⬚ grape
 → ✓ strawberry
↓  ⬚ blueberry
```

More fine-grained configuration is also possible:

```julia-repl
julia> menu = MultiSelectMenu(options, pagesize=5, charset=:unicode, checked="YEP!", unchecked="NOPE", cursor='⧐');

julia> request(menu)
julia> request(menu)
[press: Enter=toggle, a=all, n=none, d=done, q=abort]
   NOPE apple
   YEP! orange
   NOPE grape
 ⧐ YEP! strawberry
↓  NOPE blueberry
```

Aside from the overall `charset` option, for `RadioMenu` the configurable options are:

 - `cursor::Char='>'|'→'`: character to use for cursor
 - `up_arrow::Char='^'|'↑'`: character to use for up arrow
 - `down_arrow::Char='v'|'↓'`: character to use for down arrow
 - `updown_arrow::Char='I'|'↕'`: character to use for up/down arrow in one-line page
 - `scroll_wrap::Bool=false`: optionally wrap-around at the beginning/end of a menu
 - `ctrl_c_interrupt::Bool=true`: If `false`, return empty on ^C, if `true` throw InterruptException() on ^C

`MultiSelectMenu` adds:

 - `checked::String="[X]"|"✓"`: string to use for checked
 - `unchecked::String="[ ]"|"⬚")`: string to use for unchecked

You can create new menu types of your own.
Types that are derived from `TerminalMenus.ConfiguredMenu` configure the menu options at construction time.

#### Legacy interface

Prior to Julia 1.6, and still supported throughout Julia 1.x, one can also configure menus by calling
`TerminalMenus.config()`.

## References

### REPL

```@docs
Base.atreplinit
```

### TerminalMenus

### Menus

```@docs
REPL.TerminalMenus.RadioMenu
REPL.TerminalMenus.MultiSelectMenu
```

#### Configuration

```@docs
REPL.TerminalMenus.Config
REPL.TerminalMenus.MultiSelectConfig
REPL.TerminalMenus.config
```

#### User interaction

```@docs
REPL.TerminalMenus.request
```

#### AbstractMenu extension interface

Any subtype of `AbstractMenu` must be mutable, and must contain the fields `pagesize::Int` and
`pageoffset::Int`.
Any subtype must also implement the following functions:

```@docs
REPL.TerminalMenus.pick
REPL.TerminalMenus.cancel
REPL.TerminalMenus.writeline
```

It must also implement either `options` or `numoptions`:

```@docs
REPL.TerminalMenus.options
REPL.TerminalMenus.numoptions
```

If the subtype does not have a field named `selected`, it must also implement

```@docs
REPL.TerminalMenus.selected
```

The following are optional but can allow additional customization:

```@docs
REPL.TerminalMenus.header
REPL.TerminalMenus.keypress
```
