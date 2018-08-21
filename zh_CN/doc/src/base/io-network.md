# I/O 与网络

## 通用 I/O

```@docs
Base.stdout
Base.stderr
Base.stdin
Base.open
Base.IOBuffer
Base.take!(::Base.GenericIOBuffer)
Base.fdio
Base.flush
Base.close
Base.write
Base.read
Base.read!
Base.readbytes!
Base.unsafe_read
Base.unsafe_write
Base.position
Base.seek
Base.seekstart
Base.seekend
Base.skip
Base.mark
Base.unmark
Base.reset
Base.ismarked
Base.eof
Base.isreadonly
Base.iswritable
Base.isreadable
Base.isopen
Base.Grisu.print_shortest
Base.fd
Base.redirect_stdout
Base.redirect_stdout(::Function, ::Any)
Base.redirect_stderr
Base.redirect_stderr(::Function, ::Any)
Base.redirect_stdin
Base.redirect_stdin(::Function, ::Any)
Base.readchomp
Base.truncate
Base.skipchars
Base.countlines
Base.PipeBuffer
Base.readavailable
Base.IOContext
Base.IOContext(::IO, ::Pair)
Base.IOContext(::IO, ::IOContext)
```

## 文本 I/O

```@docs
Base.show(::Any)
Base.summary
Base.print
Base.println
Base.printstyled
Base.sprint
Base.showerror
Base.dump
Meta.@dump
Base.readline
Base.readuntil
Base.readlines
Base.eachline
Base.displaysize
```

## 多媒体 I/O

就像文本输出用 [`print`](@ref) 实现，用户自定义类型可以通过重载[`show`](@ref) 来指定其文本化表示，Julia 提供了一个应用于富多媒体输出的
标准化机制（例如图片，格式化文本，甚至音频和视频），由以下三部分组成：

  * 函数[`display(x)`](@ref)来请求一个Julia对象的最富的可得的多媒体展示
    `x` (with a plain-text fallback).
  * 重载 [`show`](@ref) 允许指定用户自定义类型的任意多媒体表示（
    以标准MIME类型为键）。
  * 支持多媒体显示后端可以被注册，通过子类化通用的`AbstractDisplay`类型
    并通过[`pushdisplay`](@ref)将其压进显示后端的栈中。

基础Julia运行环境只提供纯文本显示，但是更富的显示可以
通过加载外部模块或者使用图形化Julia环境（比如基于IPython的IJulia 
notebook）来实现。

```@docs
Base.Multimedia.display
Base.Multimedia.redisplay
Base.Multimedia.displayable
Base.show(::Any, ::Any, ::Any)
Base.Multimedia.showable
Base.repr(::MIME, ::Any)
```

如上面提到的，用户可以定义新的显示后端。例如，可以在窗口显示PNG图片的模块可以在Julia中注册这个能力，以便为有PNG表示的类型调用[`display(x)`](@ref)时可以在模块窗口中自动显示图片。

In order to define a new display backend, one should first create a subtype `D` of the abstract
class `AbstractDisplay`.  Then, for each MIME type (`mime` string) that can be displayed on `D`, one should
define a function `display(d::D, ::MIME"mime", x) = ...` that displays `x` as that MIME type,
usually by calling [`show(io, mime, x)`](@ref) or [`repr(io, mime, x)`](@ref).
A `MethodError` should be thrown if `x` cannot be displayed
as that MIME type; this is automatic if one calls `show` or `repr`. Finally, one should define a function
`display(d::D, x)` that queries [`showable(mime, x)`](@ref) for the `mime` types supported by `D`
and displays the "best" one; a `MethodError` should be thrown if no supported MIME types are found
for `x`.  Similarly, some subtypes may wish to override [`redisplay(d::D, ...)`](@ref Base.Multimedia.redisplay). (Again, one should
`import Base.display` to add new methods to `display`.) The return values of these functions are
up to the implementation (since in some cases it may be useful to return a display "handle" of
some type).  The display functions for `D` can then be called directly, but they can also be invoked
automatically from [`display(x)`](@ref) simply by pushing a new display onto the display-backend stack
with:

```@docs
Base.Multimedia.pushdisplay
Base.Multimedia.popdisplay
Base.Multimedia.TextDisplay
Base.Multimedia.istextmime
```

## Network I/O

```@docs
Base.bytesavailable
Base.ntoh
Base.hton
Base.ltoh
Base.htol
Base.ENDIAN_BOM
```
