using Markdown
import Documenter.LaTeXWriter.MarkdownAST: MarkdownAST, Node
import Documenter.LaTeXWriter: latex, compile_tex
import Documenter.LaTeXWriter:
    Context, Node, LaTeX,
    piperun, _print

const LaTeX_CC="xelatex"
# 默认 juliadocs/documenter-latex
const DOCKER_IMAGE = "tianjun2018/documenter-latex:latest"

"""
https://github.com/JuliaDocs/Documenter.jl/blob/v1.8.0/src/latex/LaTeXWriter.jl#L832
"""
function latex(io::Context, node::Node, math::MarkdownAST.InlineMath)
    # Handle MathJax and TeX inconsistency since the first wants `\LaTeX` wrapped
    # in math delims, whereas actual TeX fails when that is done.
    # XXX: 这里确保 math.math 前后都有空格
    math.math == "\\LaTeX" ? _print(io, " ", math.math, " ") : _print(io, "\\(", math.math, "\\)")
    return
end

"""
# XXX1: 改用 LaTeX_CC 作为后端
# XXX2: 使用自定义的 docker 镜像

https://github.com/JuliaDocs/Documenter.jl/blob/v1.8.0/src/latex/LaTeXWriter.jl#L179-L234
"""
function compile_tex(doc::Documenter.Document, settings::LaTeX, fileprefix::String)
    if settings.platform == "native"
        Sys.which("latexmk") === nothing && (@error "LaTeXWriter: latexmk command not found."; return false)
        @info "LaTeXWriter: using latexmk to compile tex."
        try
            # XXX1
            piperun(`latexmk -f -interaction=batchmode -halt-on-error -view=none -$(LaTeX_CC) -shell-escape $(fileprefix).tex`, clearlogs = true)
            return true
        catch err
            logs = cp(pwd(), mktempdir(; cleanup = false); force = true)
            @error "LaTeXWriter: failed to compile tex with latexmk. " *
                "Logs and partial output can be found in $(Documenter.locrepr(logs))" exception = err
            return false
        end
    elseif settings.platform == "tectonic"
        @info "LaTeXWriter: using tectonic to compile tex."
        tectonic = isnothing(settings.tectonic) ? Sys.which("tectonic") : settings.tectonic
        isnothing(tectonic) && (@error "LaTeXWriter: tectonic command not found."; return false)
        try
            piperun(`$(tectonic) -X compile --keep-logs -Z shell-escape $(fileprefix).tex`, clearlogs = true)
            return true
        catch err
            logs = cp(pwd(), mktempdir(; cleanup = false); force = true)
            @error "LaTeXWriter: failed to compile tex with tectonic. " *
                "Logs and partial output can be found in $(Documenter.locrepr(logs))" exception = err
            return false
        end
    elseif settings.platform == "docker"
        Sys.which("docker") === nothing && (@error "LaTeXWriter: docker command not found."; return false)
        @info "LaTeXWriter: using docker to compile tex."
        # XXX1
        script = """
        mkdir /home/zeptodoctor/build
        cd /home/zeptodoctor/build
        cp -r /mnt/. .
        latexmk -f -interaction=batchmode -halt-on-error -view=none -$(LaTeX_CC) -shell-escape $(fileprefix).tex
        """
        try
            # XXX2: 使用自定义的 docker 镜像
            piperun(`docker run -itd -u zeptodoctor --name latex-container -v $(pwd()):/mnt/ --rm $(DOCKER_IMAGE)`, clearlogs = true)
            piperun(`docker exec -u zeptodoctor latex-container bash -c $(script)`)
            piperun(`docker cp latex-container:/home/zeptodoctor/build/$(fileprefix).pdf .`)
            return true
        catch err
            logs = cp(pwd(), mktempdir(; cleanup = false); force = true)
            @error "LaTeXWriter: failed to compile tex with docker. " *
                "Logs and partial output can be found in $(Documenter.locrepr(logs))" exception = err
            return false
        finally
            try
                piperun(`docker stop latex-container`)
            catch
            end
        end
    elseif settings.platform == "none"
        @info "Skipping compiling tex file."
        return true
    end
end
