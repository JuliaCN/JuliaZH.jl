using Test

ENV["JULIA_PKG_SERVER"] = ""
using JuliaZH
@test !isempty(ENV["JULIA_PKG_SERVER"])

@testset "check ENV" begin
    @test ENV["REPL_LOCALE"] == "zh_CN"
    JuliaZH.set_mirror("BFSU")
    @test ENV["JULIA_PKG_SERVER"] == "https://mirrors.bfsu.edu.cn/julia"
end
