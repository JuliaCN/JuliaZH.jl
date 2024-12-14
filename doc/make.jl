# tweaked from https://github.com/JuliaLang/julia/blob/master/doc/make.jl
# Install dependencies needed to build the documentation.
empty!(LOAD_PATH)
push!(LOAD_PATH, @__DIR__, "@stdlib")
empty!(DEPOT_PATH)
pushfirst!(DEPOT_PATH, joinpath(@__DIR__, "deps"))
using Pkg
Pkg.instantiate()

using Documenter, DocumenterLaTeX
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

# make links for stdlib package docs, this is needed until #522 in Documenter.jl is finished
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

# manual/unicode-input.md
const UnicodeDataPath = joinpath(Sys.BINDIR, "..", "UnicodeData.txt")

if !isfile(UnicodeDataPath)
    download("http://www.unicode.org/Public/13.0.0/ucd/UnicodeData.txt", UnicodeDataPath)
end

const PAGES = [
    "主页" => "index.md",
    "手册" => [
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
    ],
    "Base" => [
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
    ],
    "Standard Library" =>
        [stdlib.targetfile for stdlib in STDLIB_DOCS],
    "Developer Documentation" => [
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
    ],
]


function maybe_revise(ex)
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
    LaTeX(
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
        # ansicolor = true,
        lang = "zh-cn",
        # 文档全局页脚
        # footer = "📢📢📢 JuliaCN 2022 冬季见面会 报告[征集](https://cn.julialang.org/meetup-website/2022/)"
    )
end

makedocs(
    modules   = [Main, Base, Core, [Base.root_module(Base, stdlib.stdlib) for stdlib in STDLIB_DOCS]...],
    clean     = true,
    doctest   = ("doctest=fix" in ARGS) ? (:fix) : ("doctest=only" in ARGS) ? (:only) : ("doctest=true" in ARGS) ? true : false,
    linkcheck = "linkcheck=true" in ARGS,
    linkcheck_ignore = ["https://bugs.kde.org/show_bug.cgi?id=136779"], # fails to load from nanosoldier?
    # strict    = true,
    checkdocs = :none,
    format    = format,
    sitename  = "Julia中文文档",
    authors   = "Julia中文社区",
    pages     = PAGES,
)

if is_deploy
    deploydocs(
        repo = "github.com/JuliaCN/JuliaZH.jl.git",
        target = "build",
        deps = nothing,
        make = nothing,
        branch = render_pdf ? "pdf" : "gh-pages"
    )
else
    @info "Skipping deployment ('deploy' not passed)"
end
