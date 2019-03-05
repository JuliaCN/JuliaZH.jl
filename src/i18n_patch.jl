using REPL
using Base.Docs: catdoc, modules, DocStr, Binding, MultiDoc, isfield, namify, bindingexpr,
    defined, resolve, getdoc, meta, aliasof, signature, isexpr
import Base.Docs: doc, formatdoc, parsedoc, apropos,
    DocStr, lazy_iterpolate, quot, metadata, docexpr, keyworddoc


function REPL.lookup_doc(ex)
    locale = get(ENV, "REPL_LOCALE", "en_US")

    if locale == ""
        locale == "en_US"
    end

    kw_dict = locale == "zh_CN" ? keywords : Docs.keywords

    if haskey(kw_dict, ex)
        Docs.parsedoc(kw_dict[ex])
    elseif isa(ex, Union{Expr, Symbol})
        binding = esc(bindingexpr(namify(ex)))
        if isexpr(ex, :call) || isexpr(ex, :macrocall)
            sig = esc(signature(ex))
            :($(doc)($binding, $sig))
        else
            :($(doc)($binding))
        end
    else
        :($(doc)($(typeof)($(esc(ex)))))
    end
end

function Base.Docs.keyworddoc(__source__, __module__, str, def::Base.BaseDocs.Keyword)
    @nospecialize str
    docstr = esc(docexpr(__source__, __module__, lazy_iterpolate(str), metadata(__source__, __module__, def, false)))
    return :($setindex!($(keywords), $docstr, $(esc(quot(def.name)))); nothing)
end
