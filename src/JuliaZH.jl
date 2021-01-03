module JuliaZH

import Base.Docs: DocStr

const keywords = Dict{Symbol,DocStr}()

"""
源列表
"""
const mirrors = Dict{String,String}()

mirrors["BFSU"] = "https://mirrors.bfsu.edu.cn/julia"
mirrors["TUNA"] = "https://mirrors.tuna.tsinghua.edu.cn/julia"
mirrors["default"] = "https://pkg.julialang.org"
mirrors["SJTUG"] = "https://mirrors.sjtug.sjtu.edu.cn/julia"
mirrors["USTC"] = "https://mirrors.ustc.edu.cn/julia"
mirrors["OpenTUNA"] = "https://opentuna.cn/julia"

"""
    set_mirror(mirror_name="BFSU")

设置镜像源为 `mirror_name`。目前可以选择的有：

- `"BFSU"`: 北京外国语大学开源软件镜像站
- `"TUNA"`: 清华大学开源软件镜像站 -- TUNA 协会
- `"SJTUG"`: 上海交通大学Linux用户组 (SJTUG) 软件源镜像服务
- `"USTC"`: 中国科学技术大学开源软件镜像
- `"OpenTUNA"`: OpenTUNA开源镜像站 -- TUNA 协会
- `"default"`: Julia官方默认源
"""
function set_mirror(mirror_name = "BFSU")
    ENV["JULIA_PKG_SERVER"] = mirrors[mirror_name]
    return
end

const regex_PKG_SERVER = r"^\s*[^#]*\s*(ENV\[\"JULIA_PKG_SERVER\"\]\s*=\s*)\"([\w\.:\/]*)\""

"""
    generate_startup(mirror_name::String="BFSU")
自动产生将镜像设置到 `mirror_name` 的 `startup.jl` 文件。默认值是 `BFSU
` 的源。
"""
function generate_startup(mirror_name::String = "BFSU")
    default_dot_julia = first(DEPOT_PATH)
    config_path = joinpath(default_dot_julia, "config")
    if !ispath(config_path)
        mkpath(config_path)
    end

    startup_path = joinpath(config_path, "startup.jl")
    if ispath(startup_path)
        startup_lines = readlines(startup_path)
    else
        startup_lines = String[]
    end

    new_upstream = mirrors[mirror_name]
    new_line = "ENV[\"JULIA_PKG_SERVER\"] = \"$(new_upstream)\""
    
    pkg_matches = map(x->match(regex_PKG_SERVER, x), startup_lines)
    pkg_indices = findall(x->!isnothing(x), pkg_matches)
    if isempty(pkg_indices)
        @info "添加 PkgServer" 服务器地址=new_upstream 配置文件=startup_path
        append!(startup_lines, ["", "# 以下这一行由 JuliaCN 自动生成", new_line, ""])
    else
        # only modify the last match
        idx = last(pkg_indices)
        old_upstream = pkg_matches[idx].captures[2]

        is_upstream_unchanged = occursin(new_upstream, old_upstream) || occursin(old_upstream, new_upstream)
        if !is_upstream_unchanged
            @info "更新 PkgServer" 新服务器地址=new_upstream 原服务器地址=old_upstream 配置文件=startup_path
            startup_lines[idx] = new_line
        end
    end

    write(startup_path, join(startup_lines, "\n"))
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
