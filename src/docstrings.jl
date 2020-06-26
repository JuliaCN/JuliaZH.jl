using JSON3

const MODULE_MAP = Dict(
    "Base" => Base,
    # "BaseDocs" => Base.BaseDocs,
    "Cartesian" => Base.Cartesian,
    # "Docs" => Base.Docs,
    "Enums" => Base.Enums,
    "Experimental" => Base.Experimental,
    "FastMath" => Base.FastMath,
    "Filesystem" => Base.Filesystem,
    "GC" => Base.GC,
    "Grisu" => Base.Grisu,
    "Iterators" => Base.Iterators,
    "Libc" => Base.Libc,
    "Math" => Base.Math,
    "MathConstants" => Base.MathConstants,
    "Meta" => Base.Meta,
    "Multimedia" => Base.Multimedia,
    # "MultiplicativeInverses" => Base.MultiplicativeInverses,
    "MPFR" => Base.MPFR,
    # "Order" => Base.Order,
    "Rounding" => Base.Rounding,
    "SimdLoop" => Base.SimdLoop,
    "Sys" => Base.Sys,
    "Threads" => Base.Threads,
    "Unicode" => Base.Unicode,
)

const DEFAULT_PREFIX = joinpath(@__DIR__, "..", "en", "docstrings")
const DEFAULT_SUFFIX = "_docstrings.json"

function dump_docstrings(m::Module)
    doc = getfield(m, Base.Docs.META)
    docstrings = "{"
    buffer = IOBuffer()
    for bind in keys(doc)
        multidoc = doc[bind]
        bind.mod == m || continue  # only dump current module
        name = string(bind.mod) * "." * string(bind.var)
        strs = Vector{Pair{String,String}}()
        for signature in keys(multidoc.docs)
            text = string(multidoc.docs[signature].text...)
            push!(strs, string(signature) => text)
        end
        JSON3.write(buffer, name => strs)
        docstrings *= String(take!(buffer)) |> s -> strip(s, ['{', '}'])
        docstrings *= ","
    end

    return docstrings[1:end-1] * "}"
end

function dump_all_docstrings()
    prefix = haskey(ENV, "JULIAZH_DOCSTRINGS_PREFIX") ? ENV["JULIAZH_DOCSTRINGS_PREFIX"] : DEFAULT_PREFIX
    suffix = haskey(ENV, "JULIAZH_DOCSTRINGS_SUFFIX") ? ENV["JULIAZH_DOCSTRINGS_SUFFIX"] : DEFAULT_SUFFIX
    for (k, v) in MODULE_MAP
        s = dump_docstrings(v)
        write(joinpath(prefix, k*suffix), s)
    end
end
