```@eval
io = IOBuffer()
release = isempty(VERSION.prerelease)
v = "$(VERSION.major).$(VERSION.minor)"
!release && (v = v*"-$(first(VERSION.prerelease))")
print(io, """
    # Julia $(v) Documentation

    Welcome to the documentation for Julia $(v).

    """)
if !release
    print(io,"""
        !!! warning "Work in progress!"
            This documentation is for an unreleased, in-development, version of Julia.
        """)
end
import Markdown
Markdown.parse(String(take!(io)))
```
请阅读 [release notes](NEWS.md) 以了解自上次发行以来发生了什么变化。

```@eval
release = isempty(VERSION.prerelease)
file = release ? "julia-$(VERSION).pdf" :
       "julia-$(VERSION.major).$(VERSION.minor).$(VERSION.patch)-$(first(VERSION.prerelease)).pdf"
url = "https://raw.githubusercontent.com/JuliaLang/docs.julialang.org/assets/$(file)"
import Markdown
Markdown.parse("""
!!! note
    The documentation is also available in PDF format: [$file]($url).
""")
```

## [Important Links](@id man-important-links)

Below is a non-exhasutive list of links that will be useful as you learn and use the Julia programming language.

- [Julia Homepage](https://julialang.org)
- [Download Julia](https://julialang.org/downloads/)
- [Discussion forum](https://discourse.julialang.org)
- [Julia YouTube](https://www.youtube.com/user/JuliaLanguage)
- [Find Julia Packages](https://julialang.org/packages/)
- [Learning Resources](https://julialang.org/learning/)
- [Read and write blogs on Julia](https://forem.julialang.org)

## [简介](@id man-introduction)

科学计算对性能一直有着最高的需求，但目前各领域的专家却大量使用较慢的动态语言来开展他们的日常工作。 偏爱动态语言有很多很好的理由，因此我们不会舍弃动态的特性。 幸运的是，现代编程语言设计与编译器技术可以大大消除性能折衷（trade-off），并提供有足够生产力的单一环境进行原型设计，而且能高效地部署性能密集型应用程序。 Julia 语言在这其中扮演了这样一个角色：它是一门灵活的动态语言，适合用于科学计算和数值计算，并且性能可与传统的静态类型语言媲美。

由于 Julia 的编译器和其它语言比如 Python 或 R 的解释器有所不同，一开始你可能发现 Julia 的性能并不是很突出。 如果你觉得速度有点慢，我们强烈建议在尝试其他功能前，先读一读文档中的[提高性能的窍门](@ref man-performance-tips)部分。 一旦你理解了 Julia 的运作方式后，写出和 C 一样快的代码就是小菜一碟。

## [Julia Compared to Other Languages](@id man-julia-compared-other-languages)

Julia features optional typing, multiple dispatch, and good performance, achieved using type inference
and [just-in-time (JIT) compilation](https://en.wikipedia.org/wiki/Just-in-time_compilation) (and
[optional ahead-of-time compilation](https://github.com/JuliaLang/PackageCompiler.jl)),
implemented using [LLVM](https://en.wikipedia.org/wiki/Low_Level_Virtual_Machine). It is multi-paradigm,
combining features of imperative, functional, and object-oriented programming. Julia provides
ease and expressiveness for high-level numerical computing, in the same way as languages such
as R, MATLAB, and Python, but also supports general programming. To achieve this, Julia builds
upon the lineage of mathematical programming languages, but also borrows much from popular dynamic
languages, including [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)), [Perl](https://en.wikipedia.org/wiki/Perl_(programming_language)),
[Python](https://en.wikipedia.org/wiki/Python_(programming_language)), [Lua](https://en.wikipedia.org/wiki/Lua_(programming_language)),
and [Ruby](https://en.wikipedia.org/wiki/Ruby_(programming_language)).

Julia 与传统动态语言最重要的区别是：

  * The core language imposes very little; Julia Base and the standard library are written in Julia itself, including
    primitive operations like integer arithmetic
  * A rich language of types for constructing and describing objects, that can also optionally be
    used to make type declarations
  * The ability to define function behavior across many combinations of argument types via [multiple dispatch](https://en.wikipedia.org/wiki/Multiple_dispatch)
  * Automatic generation of efficient, specialized code for different argument types
  * Good performance, approaching that of statically-compiled languages like C

Although one sometimes speaks of dynamic languages as being "typeless", they are definitely not.
Every object, whether primitive or user-defined, has a type. The lack of type declarations in
most dynamic languages, however, means that one cannot instruct the compiler about the types of
values, and often cannot explicitly talk about types at all. In static languages, on the other
hand, while one can -- and usually must -- annotate types for the compiler, types exist only at
compile time and cannot be manipulated or expressed at run time. In Julia, types are themselves
run-time objects, and can also be used to convey information to the compiler.

### [What Makes Julia, Julia?](@id man-what-makes-julia)

While the casual programmer need not explicitly use types or multiple dispatch, they are the core
unifying features of Julia: functions are defined on different combinations of argument types,
and applied by dispatching to the most specific matching definition. This model is a good fit
for mathematical programming, where it is unnatural for the first argument to "own" an operation
as in traditional object-oriented dispatch. Operators are just functions with special notation
-- to extend addition to new user-defined data types, you define new methods for the `+` function.
Existing code then seamlessly applies to the new data types.

Partly because of run-time type inference (augmented by optional type annotations), and partly
because of a strong focus on performance from the inception of the project, Julia's computational
efficiency exceeds that of other dynamic languages, and even rivals that of statically-compiled
languages. For large scale numerical problems, speed always has been, continues to be, and probably
always will be crucial: the amount of data being processed has easily kept pace with Moore's Law
over the past decades.

### [Advantages of Julia](@id man-advantages-of-julia)

Julia aims to create an unprecedented combination of ease-of-use, power, and efficiency in a single
language. In addition to the above, some advantages of Julia over comparable systems include:

  * Free and open source ([MIT licensed](https://github.com/JuliaLang/julia/blob/master/LICENSE.md))
  * User-defined types are as fast and compact as built-ins
  * No need to vectorize code for performance; devectorized code is fast
  * Designed for parallelism and distributed computation
  * Lightweight "green" threading ([coroutines](https://en.wikipedia.org/wiki/Coroutine))
  * Unobtrusive yet powerful type system
  * Elegant and extensible conversions and promotions for numeric and other types
  * Efficient support for [Unicode](https://en.wikipedia.org/wiki/Unicode), including but not limited
    to [UTF-8](https://en.wikipedia.org/wiki/UTF-8)
  * Call C functions directly (no wrappers or special APIs needed)
  * Powerful shell-like capabilities for managing other processes
  * Lisp-like macros and other metaprogramming facilities
