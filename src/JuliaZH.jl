module JuliaZH

import Base.Docs: DocStr

# early version of JuliaZH provides these two methods
import PkgServerClient: set_mirror, generate_startup

const keywords = Dict{Symbol,DocStr}()

function __init__()
    # Set pkg server to the nearest mirror
    @eval using PkgServerClient

    # set to Chinese env by default
    ENV["REPL_LOCALE"] = "zh_CN"
    if ccall(:jl_generating_output, Cint, ()) == 0
        include(joinpath(@__DIR__, "i18n_patch.jl"))
        include(joinpath(@__DIR__, "basedocs.jl"))
    end
end

end # module
