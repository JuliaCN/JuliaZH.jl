using DocumenterLaTeX, Markdown
import Documenter: Documents, Documenter, Writers, Utilities
import Documenter.Writers.LaTeXWriter: piperun, _print

const LaTeX_CC="xelatex"
const DOCKER_IMAGE_TAG = "0.1"

function Documenter.Writers.LaTeXWriter.latexinline(io, math::Markdown.LaTeX)
    # Handle MathJax and TeX inconsistency since the first wants `\LaTeX` wrapped
    # in math delims, whereas actual TeX fails when that is done.
    math.formula == "\\LaTeX" ? _print(io, " ", math.formula, " ") : _print(io, " \\(", math.formula, "\\) ")
end

function Documenter.Writers.LaTeXWriter.compile_tex(doc::Documents.Document, settings::LaTeX, texfile::String)
    if settings.platform == "native"
        Sys.which("latexmk") === nothing && (@error "LaTeXWriter: latexmk command not found."; return false)
        @info "LaTeXWriter: using latexmk to compile tex."
        piperun(`latexmk -f -interaction=nonstopmode -view=none -$(LaTeX_CC) -shell-escape $texfile`)
        return true

        # NOTE: 中文排版依然有问题，我们暂时不管他们。输出的pdf大部分情况下依然可以使用。
        # try
        #     piperun(`latexmk -f -interaction=nonstopmode -view=none -$(LaTeX_CC) -shell-escape $texfile`)
        #     return true
        # catch err
        #     logs = cp(pwd(), mktempdir(); force=true)
        #     @error "LaTeXWriter: failed to compile tex with latexmk. " *
        #            "Logs and partial output can be found in $(Utilities.locrepr(logs))." exception = err
        #     return false
        # end
    elseif settings.platform == "docker"
        Sys.which("docker") === nothing && (@error "LaTeXWriter: docker command not found."; return false)
        @info "LaTeXWriter: using docker to compile tex."
        script = """
            mkdir /home/zeptodoctor/build
            cd /home/zeptodoctor/build
            cp -r /mnt/. .
            latexmk -f -interaction=nonstopmode -view=none -$(LaTeX_CC) -shell-escape $texfile
            """
        try
            piperun(`docker run -itd -u zeptodoctor --name latex-container -v $(pwd()):/mnt/ --rm juliadocs/documenter-latex:$(DOCKER_IMAGE_TAG)`)
            piperun(`docker exec -u zeptodoctor latex-container bash -c $(script)`)
            piperun(`docker cp latex-container:/home/zeptodoctor/build/. .`)
            return true
        catch err
            logs = cp(pwd(), mktempdir(); force=true)
            @error "LaTeXWriter: failed to compile tex with docker. " *
                   "Logs and partial output can be found in $(Utilities.locrepr(logs))." exception = err
            return false
        finally
            try; piperun(`docker stop latex-container`); catch; end
        end
    end
end
