module JuliaZH

import Base.Docs: DocStr

const keywords = Dict{Symbol, DocStr}()

"""
源列表
"""
const mirrors = Dict{String, String}()

mirrors["BFSU"] = "https://mirrors.bfsu.edu.cn/julia/static"
mirrors["default"] = "https://pkg.julialang.org"

"""
    set_mirror(mirror_name="BFSU")

设置镜像源为 `mirror_name`。目前可以选择的有：

- `"BFSU"`: TUNA支持的境内源
- `"default"`: Julia官方默认源
"""
function set_mirror(mirror_name="BFSU")
    ENV["JULIA_PKG_SERVER"] = mirrors[mirror_name]
    return
end

"""
    generate_startup(mirror_name::String="BFSU")

自动产生将镜像设置到 `mirror_name` 的 `startup.jl` 文件。默认值是 `BFSU
` 的源。
"""
function generate_startup(mirror_name::String="BFSU")
    default_dot_julia = first(DEPOT_PATH)
    config_path = joinpath(default_dot_julia, "config")
    if !ispath(config_path)
        mkpath(config_path)
    end

    startup_path = joinpath(config_path, "startup.jl")
    if ispath(startup_path)
        old_startup = read(startup_path, String)
    else
        old_startup = ""
    end

    write(startup_path, join([old_startup, "ENV[\"JULIA_PKG_SERVER\"] = \"$(mirrors[mirror_name])\"\n"], "\n"))
    return
end

function __init__()
    # set to Chinese env by default
    ENV["REPL_LOCALE"] = "zh_CN"
    set_mirror("BFSU")
    if ccall(:jl_generating_output, Cint, ()) == 0
        include(joinpath(@__DIR__, "i18n_patch.jl"))
        include(joinpath(@__DIR__, "basedocs.jl"))
    end
end

end # module
