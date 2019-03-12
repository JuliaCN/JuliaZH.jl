module JuliaZH

import Base.Docs: DocStr

const keywords = Dict{Symbol, DocStr}()

function __init__()
    ENV["REPL_LOCALE"] = "zh_CN"
    if ccall(:jl_generating_output, Cint, ()) == 0
        include(joinpath(@__DIR__, "i18n_patch.jl"))
        include(joinpath(@__DIR__, "basedocs.jl"))
    end
end

end # module
