using JuliaZH
using Test

@testset "check ENV" begin
    @test ENV["REPL_LOCALE"] == "zh_CN"
    @test ENV["JULIA_PKG_SERVER"] == "https://mirrors.bfsu.edu.cn/julia/static"
end
