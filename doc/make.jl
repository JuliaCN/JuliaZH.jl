# tweaked from https://github.com/JuliaLang/julia/blob/v1.10.5/doc/make.jl
# Install dependencies needed to build the documentation.
Base.ACTIVE_PROJECT[] = nothing
empty!(LOAD_PATH)
push!(LOAD_PATH, @__DIR__, "@stdlib")
empty!(DEPOT_PATH)
pushfirst!(DEPOT_PATH, joinpath(@__DIR__, "deps"))
using Pkg
Pkg.instantiate()

using Documenter
using DocumenterInventoryWritingBackport
include("../contrib/HTMLWriter.jl")
include("../contrib/LaTeXWriter.jl")


# Documenter Setup.

symlink_q(tgt, link) = isfile(link) || symlink(tgt, link)
cp_q(src, dest) = isfile(dest) || cp(src, dest)

"""
    cpi18ndoc(;root, i18ndoc, stdlib)

Copy i18n doc to build folder.
"""
function cpi18ndoc(;
        root=joinpath(@__DIR__, ".."),
        i18ndoc=["base", "devdocs", "manual"], stdlib=true, force=false)

    # stdlib
    if stdlib
        cp(joinpath(root, "zh_CN", "stdlib"), joinpath(root, "stdlib"); force=force)
    end

    for each in i18ndoc
        cp(joinpath(root, "zh_CN", "doc", "src", each), joinpath(root, "doc", "src", each); force=force)
    end
end

"""
    clean(;root, stdlib, i18ndoc)

Clean up build i18n cache.
"""
function clean(;root=joinpath(@__DIR__, ".."), stdlib=true, i18ndoc=["base", "devdocs", "manual"])
    if stdlib
        rm(joinpath(root, "stdlib"); recursive=true)
    end

    for each in i18ndoc
        rm(joinpath(root, "doc", "src", each); recursive=true)
    end
end

cpi18ndoc(;force=true)

# make links for stdlib package docs, this is needed until #552 in Documenter.jl is finished
const STDLIB_DOCS = []
const STDLIB_DIR = joinpath(@__DIR__, "..", "stdlib")
cd(joinpath(@__DIR__, "src")) do
    Base.rm("stdlib"; recursive=true, force=true)
    mkdir("stdlib")
    for dir in readdir(STDLIB_DIR)
        sourcefile = joinpath(STDLIB_DIR, dir, "docs", "src", "index.md")
        if isfile(sourcefile)
            targetfile = joinpath("stdlib", dir * ".md")
            push!(STDLIB_DOCS, (stdlib = Symbol(dir), targetfile = targetfile))
            if Sys.iswindows()
                cp_q(sourcefile, targetfile)
            else
                symlink_q(sourcefile, targetfile)
            end
        end
    end
end

# Used in: manual/unicode-input.md
# https://github.com/JuliaLang/julia/blob/v1.10.5/doc/Makefile#L28
const UnicodeDataPath = joinpath(Sys.BINDIR, "..", "UnicodeData.txt")

if !isfile(UnicodeDataPath)
    download("https://www.unicode.org/Public/13.0.0/ucd/UnicodeData.txt", UnicodeDataPath)
end

Manual = [
    "manual/getting-started.md",
    "manual/variables.md",
    "manual/integers-and-floating-point-numbers.md",
    "manual/mathematical-operations.md",
    "manual/complex-and-rational-numbers.md",
    "manual/strings.md",
    "manual/functions.md",
    "manual/control-flow.md",
    "manual/variables-and-scoping.md",
    "manual/types.md",
    "manual/methods.md",
    "manual/constructors.md",
    "manual/conversion-and-promotion.md",
    "manual/interfaces.md",
    "manual/modules.md",
    "manual/documentation.md",
    "manual/metaprogramming.md",
    "manual/arrays.md",
    "manual/missing.md",
    "manual/networking-and-streams.md",
    "manual/parallel-computing.md",
    "manual/asynchronous-programming.md",
    "manual/multi-threading.md",
    "manual/distributed-computing.md",
    "manual/running-external-programs.md",
    "manual/calling-c-and-fortran-code.md",
    "manual/handling-operating-system-variation.md",
    "manual/environment-variables.md",
    "manual/embedding.md",
    "manual/code-loading.md",
    "manual/profile.md",
    "manual/stacktraces.md",
    "manual/performance-tips.md",
    "manual/workflow-tips.md",
    "manual/style-guide.md",
    "manual/faq.md",
    "manual/noteworthy-differences.md",
    "manual/unicode-input.md",
    "manual/command-line-interface.md",
]

BaseDocs = [
    "base/base.md",
    "base/collections.md",
    "base/math.md",
    "base/numbers.md",
    "base/strings.md",
    "base/arrays.md",
    "base/parallel.md",
    "base/multi-threading.md",
    "base/constants.md",
    "base/file.md",
    "base/io-network.md",
    "base/punctuation.md",
    "base/sort.md",
    "base/iterators.md",
    "base/reflection.md",
    "base/c.md",
    "base/libc.md",
    "base/stacktraces.md",
    "base/simd-types.md",
]

StdlibDocs = [stdlib.targetfile for stdlib in STDLIB_DOCS]

DevDocs = [
    "Documentation of Julia's Internals" => [
        "devdocs/init.md",
        "devdocs/ast.md",
        "devdocs/types.md",
        "devdocs/object.md",
        "devdocs/eval.md",
        "devdocs/callconv.md",
        "devdocs/compiler.md",
        "devdocs/functions.md",
        "devdocs/cartesian.md",
        "devdocs/meta.md",
        "devdocs/subarrays.md",
        "devdocs/isbitsunionarrays.md",
        "devdocs/sysimg.md",
        "devdocs/pkgimg.md",
        "devdocs/llvm.md",
        "devdocs/stdio.md",
        "devdocs/boundscheck.md",
        "devdocs/locks.md",
        "devdocs/offset-arrays.md",
        "devdocs/require.md",
        "devdocs/inference.md",
        "devdocs/ssair.md",
        "devdocs/EscapeAnalysis.md",
        "devdocs/gc-sa.md",
        "devdocs/gc.md",
        "devdocs/precompile_hang.md",
    ],
    "Developing/debugging Julia's C code" => [
        "devdocs/backtraces.md",
        "devdocs/debuggingtips.md",
        "devdocs/valgrind.md",
        "devdocs/external_profilers.md",
        "devdocs/sanitizers.md",
        "devdocs/probes.md",
    ],
    "Building Julia" => [
        "devdocs/build/build.md",
        "devdocs/build/linux.md",
        "devdocs/build/macos.md",
        "devdocs/build/windows.md",
        "devdocs/build/freebsd.md",
        "devdocs/build/arm.md",
        "devdocs/build/distributing.md",
    ]
]

const PAGES = [
    "主页" => "index.md",
    "手册" => Manual,
    "Base" => BaseDocs,
    "标准库" => StdlibDocs,
    "开发者文档" => DevDocs,
]


function maybe_revise(ex)
    # Do Nothing
    return ex
end

for stdlib in STDLIB_DOCS
    @eval using $(stdlib.stdlib)
    # All standard library modules get `using $STDLIB` as their global
    DocMeta.setdocmeta!(
        Base.root_module(Base, stdlib.stdlib),
        :DocTestSetup,
        maybe_revise(:(using $(stdlib.stdlib)));
        recursive=true,
    )
end
# A few standard libraries need more than just the module itself in the DocTestSetup.
# This overwrites the existing ones from above though, hence the warn=false.
DocMeta.setdocmeta!(
    SparseArrays,
    :DocTestSetup,
    maybe_revise(:(using SparseArrays, LinearAlgebra));
    recursive=true, warn=false,
)
DocMeta.setdocmeta!(
    UUIDs,
    :DocTestSetup,
    maybe_revise(:(using UUIDs, Random));
    recursive=true, warn=false,
)
DocMeta.setdocmeta!(
    Pkg,
    :DocTestSetup,
    maybe_revise(:(using Pkg, Pkg.Artifacts));
    recursive=true, warn=false,
)
DocMeta.setdocmeta!(
    Base,
    :DocTestSetup,
    maybe_revise(:(;;));
    recursive=true,
)
DocMeta.setdocmeta!(
    Base.BinaryPlatforms,
    :DocTestSetup,
    maybe_revise(:(using Base.BinaryPlatforms));
    recursive=true, warn=false,
)


const render_pdf = "pdf" in ARGS
const is_deploy = "deploy" in ARGS

const format = if render_pdf
    Documenter.LaTeX(
        platform = "texplatform=docker" in ARGS ? "docker" : "native"
    )
else
    Documenter.HTML(
        prettyurls = is_deploy,
        canonical = is_deploy ? "https://juliacn.github.io/JuliaZH.jl/latest/" : nothing,
        assets = [
            "assets/julia-manual.css",
            # "assets/julia.ico",
        ],
        analytics = "UA-28835595-9",
        collapselevel = 1,
        sidebar_sitename = false,
        ansicolor = true,
        size_threshold = 800 * 2^10, # 800 KiB
        size_threshold_warn = 200 * 2^10, # the manual has quite a few large pages, so we warn at 200+ KiB only
        lang = "zh-cn",
        # 文档全局页脚
        # footer = "📢📢📢 JuliaCN 2022 冬季见面会 报告[征集](https://cn.julialang.org/meetup-website/2022/)"
    )
end


import Documenter.Remotes: Remote, repourl, fileurl, issueurl
# 复制&&修改自 GitHub <: Remote 
#   https://github.com/JuliaDocs/Documenter.jl/blob/2123d7a12a7380ca793b9cf2d680af1c7eb8b94a/src/utilities/Remotes.jl#L121
# 用于转换 stdlib 函数定义的路径，即 source 指定的路径
#   "src\cluster.jl" => "stdlib\Distributed\src\cluster.jl"
struct StdlibSource <: Remote
    user::String
    repo::String
    # 这里储存了标准库的名称，以作区别
    stdlib::String
end
repourl(remote::StdlibSource) = repourl(Remotes.GitHub(remote.user, remote.repo))
function fileurl(remote::StdlibSource, ref::AbstractString, filename::AbstractString, linerange)
    # NOTE: 这里指定了 stdlib 的文件夹
    url = "$(repourl(remote))/blob/$(ref)/stdlib/$(remote.stdlib)/$(filename)"
    # @show url  # 调试输出
    isnothing(linerange) && return url
    lstart, lend = first(linerange), last(linerange)
    return (lstart == lend) ? "$(url)#L$(lstart)" : "$(url)#L$(lstart)-L$(lend)"
end
issueurl(remote::StdlibSource, issuenumber) = issueurl(Remotes.GitHub(remote.user, remote.repo), issuenumber)

# 用于转换翻译文档对应的路径。即 md 源文件的编辑路径
struct JuliaZHRemote <: Remote
    user::String
    repo::String
end
repourl(remote::JuliaZHRemote) = repourl(Remotes.GitHub(remote.user, remote.repo))
"""XXX
主要修改了此函数，以实现对路径的转换。
我们复制 md 文件到 `doc/` 文件夹中，因此默认的路径基于 `doc/`。
要将他们映射到 `zh_CN/` 中

https://documenter.juliadocs.org/stable/lib/remote-links/#Documenter.Remotes.fileurl

ref	        filename	    linerange	returned string
"v1.2.3"	"foo/bar.jl"	12:12	    "https://github.com/USER/REPO/blob/v1.2.3/foo/bar.jl#L12"
"""
function fileurl(remote::JuliaZHRemote, ref::AbstractString, filename::AbstractString, linerange)
    real_filename = if startswith(filename, "doc/src/index.md")
        # 特殊处理 doc\src\index.md
        filename
    elseif startswith(filename, "doc/src/stdlib")
        # doc\src\stdlib\CRC32c  =>  zh_CN\stdlib\CRC32c\docs\src\index.md
        replace(filename, r"doc/src/stdlib/([^\.]+)\.md" => s"zh_CN/stdlib/\1/docs/src/index.md")
    elseif startswith(filename, "doc/src")
        # doc/src/base/parallel.md  =>  zh_CN/doc/src/base/parallel.md
        replace(filename, r"doc/src" => "zh_CN/doc/src")
    else
        @warn "未找到对应的 md 源文件: $filename"
        filename
    end
    url = "$(repourl(remote))/blob/$(ref)/$(real_filename)"
    # @show url  # 调试输出
    isnothing(linerange) && return url
    lstart, lend = first(linerange), last(linerange)
    return (lstart == lend) ? "$(url)#L$(lstart)" : "$(url)#L$(lstart)-L$(lend)"
end
issueurl(remote::JuliaZHRemote, issuenumber) = issueurl(Remotes.GitHub(remote.user, remote.repo), issuenumber)

inside_stdlibs = [
    "Artifacts", "Base64", "CRC32c", "Dates", "Distributed", "FileWatching",
    "Future", "InteractiveUtils", "LazyArtifacts", "Libdl", "LibGit2",
    "LinearAlgebra", "Logging", "Markdown", "Mmap", "Printf", "Profile",
    "Random", "REPL", "Serialization", "SharedArrays", "Sockets", "Test",
    "TOML", "Unicode", "UUIDs"
]
outside_stdlibs = [
    # Outside repo
    ("ArgTools",        Remotes.GitHub("JuliaIO", "ArgTools.jl"),           "08b11b2707593d4d7f92e5f1b9dba7668285ff82"),
    ("DelimitedFiles",  Remotes.GitHub("JuliaData", "DelimitedFiles.jl"),   "db79c842f95f55b1f8d8037c0d3363ab21cd3b90"),
    ("Downloads",       Remotes.GitHub("JuliaLang", "Downloads.jl"),        "ead289a7f1be7689738aaea9b12d919424a106ef"),
    ("LibCURL",         Remotes.GitHub("JuliaWeb", "LibCURL.jl"),           "a65b64f6eabc932f63c2c0a4a5fb5d75f3e688d0"),
    ("NetworkOptions",  Remotes.GitHub("JuliaLang", "NetworkOptions.jl"),   "8eec5cb0acec4591e6db3c017f7499426cd8e352"),
    ("Pkg",             Remotes.GitHub("JuliaLang", "Pkg.jl"),              "edfa2ed0ea117d61d33405d4214edb6513b3f236"),
    ("SHA",             Remotes.GitHub("JuliaCrypto", "SHA.jl"),            "e1af7dd0863dee14a83550faf4b6e08971993ce8"),
    ("SparseArrays",    Remotes.GitHub("JuliaSparse", "SparseArrays.jl"),   "279b363ca8d3129d4742903d37c8b11545fa08a2"),
    ("Statistics",      Remotes.GitHub("JuliaStats", "Statistics.jl"),      "d147f9253aa0f2f71be9c3fed8d51c2215410408"),
    ("SuiteSparse",     Remotes.GitHub("JuliaSparse", "SuiteSparse.jl"),    "e8285dd13a6d5b5cf52d8124793fc4d622d07554"),
    ("Tar",             Remotes.GitHub("JuliaIO", "Tar.jl"),                "ff55460f4d329949661a33e6c8168ce6d890676c"),
]
documenter_stdlib_remotes = begin
    remotes_list = []
    for stdlib_name in inside_stdlibs
        remote = StdlibSource("JuliaLang", "julia", stdlib_name)
        commit = "v1.10.5"
        package_root_dir = joinpath(Sys.STDLIB, stdlib_name)
        @assert isdir(package_root_dir)
        push!(remotes_list, package_root_dir => (remote, commit))
    end
    for (stdlib_name, remote, commit) in outside_stdlibs
        package_root_dir = joinpath(Sys.STDLIB, stdlib_name)
        @assert isdir(package_root_dir)
        push!(remotes_list, package_root_dir => (remote, commit))
    end
    Dict(
        # TODO: 指定确切的 commit
        dirname(@__DIR__) => (JuliaZHRemote("JuliaCN", "JuliaZH.jl"), "master"),
        remotes_list...
    )
end

makedocs(
    modules   = [Main, Base, Core, [Base.root_module(Base, stdlib.stdlib) for stdlib in STDLIB_DOCS]...],
    clean     = true,
    doctest   = ("doctest=fix" in ARGS) ? (:fix) : ("doctest=only" in ARGS) ? (:only) : ("doctest=true" in ARGS) ? true : false,
    linkcheck = "linkcheck=true" in ARGS,
    linkcheck_ignore = ["https://bugs.kde.org/show_bug.cgi?id=136779"], # fails to load from nanosoldier?
    # Skip Error on gitlab CI
    warnonly  = Documenter.except(:docs_block, :cross_references, :eval_block),
    # strict    = true,
    checkdocs = :none,
    format    = format,
    sitename  = "Julia 中文文档",
    authors   = "Julia 中文社区",
    pages     = PAGES,
    remotes   = documenter_stdlib_remotes,
)

if is_deploy
    deploydocs(
        repo = "github.com/JuliaCN/JuliaZH.jl.git",
        # deploy_config = BuildBotConfig(),
        target = "build",
        # dirname = "en",
        # devurl = devurl,
        # versions = Versions(["v#.#", devurl => devurl]),
        branch = render_pdf ? "pdf" : "gh-pages",
        push_preview = true,
    )
else
    @info "Skipping deployment ('deploy' not passed)"
end
