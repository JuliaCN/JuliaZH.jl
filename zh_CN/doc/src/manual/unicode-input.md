# Unicode 输入表

在 Julia REPL 或其它编辑器中，可以像输入 LaTeX 符号一样，用 tab 补全下表列出的 Unicode 字符。在 REPL 中，可以先按 `?` 进入帮助模式，然后将 Unicode 字符复制粘贴进去，一般在文档开头就会写输入方式。

!!! warning

    此表第二列可能会缺失一些字符，对某些字符的显示效果也可能会与在 Julia REPL 中不一致。如果发生了这种状况，强烈建议用户检查一下浏览器或 REPL 的字体设置，目前已知很多字体都有显示问题。

```@eval
#
# Generate a table containing all LaTeX and Emoji tab completions available in the REPL.
#
import REPL, Markdown
const NBSP = '\u00A0'

function tab_completions(symbols...)
    completions = Dict{String, Vector{String}}()
    for each in symbols, (k, v) in each
        completions[v] = push!(get!(completions, v, String[]), k)
    end
    return completions
end

function unicode_data()
    file = normpath(Sys.BINDIR, "..", "UnicodeData.txt")
    names = Dict{UInt32, String}()
    open(file) do unidata
        for line in readlines(unidata)
            id, name, desc = split(line, ";")[[1, 2, 11]]
            codepoint = parse(UInt32, "0x$id")
            names[codepoint] = titlecase(lowercase(
                name == "" ? desc : desc == "" ? name : "$name / $desc"))
        end
    end
    return names
end

# Surround combining characters with no-break spaces (i.e '\u00A0'). Follows the same format
# for how unicode is displayed on the unicode.org website:
# http://unicode.org/cldr/utility/character.jsp?a=0300
function fix_combining_chars(char)
    cat = Base.Unicode.category_code(char)
    return cat == 6 || cat == 8 ? "$NBSP$char$NBSP" : "$char"
end


function table_entries(completions, unicode_dict)
    entries = [[
        "Code point(s)", "Character(s)",
        "Tab completion sequence(s)", "Unicode name(s)"
    ]]
    for (chars, inputs) in sort!(collect(completions), by = first)
        code_points, unicode_names, characters = String[], String[], String[]
        for char in chars
            push!(code_points, "U+$(uppercase(string(UInt32(char), base = 16, pad = 5)))")
            push!(unicode_names, get(unicode_dict, UInt32(char), "(No Unicode name)"))
            push!(characters, isempty(characters) ? fix_combining_chars(char) : "$char")
        end
        push!(entries, [
            join(code_points, " + "), join(characters),
            join(inputs, ", "), join(unicode_names, " + ")
        ])
    end
    return Markdown.Table(entries, [:l, :l, :l, :l])
end

table_entries(
    tab_completions(
        REPL.REPLCompletions.latex_symbols,
        REPL.REPLCompletions.emoji_symbols
    ),
    unicode_data()
)
```
