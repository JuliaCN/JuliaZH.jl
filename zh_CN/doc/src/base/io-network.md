# I/O 与网络

## 通用 I/O

```@docs
Base.stdout
Base.stderr
Base.stdin
Base.read(::AbstractString)
Base.write(::AbstractString, ::Any)
Base.open
Base.IOStream
Base.IOBuffer
Base.take!(::Base.GenericIOBuffer)
Base.Pipe
Base.fdio
Base.flush
Base.close
Base.closewrite
Base.write
Base.read
Base.read!
Base.readbytes!
Base.unsafe_read
Base.unsafe_write
Base.readeach
Base.peek
Base.position
Base.seek
Base.seekstart
Base.seekend
Base.skip
Base.mark
Base.unmark
Base.reset(::IO)
Base.ismarked
Base.eof
Base.isreadonly
Base.iswritable
Base.isreadable
Base.isopen
Base.fd
Base.redirect_stdio
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

## 通用 I/O

```@docs
Base.show(::IO, ::Any)
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

## [多媒体 I/O](@id Multimedia-I/O)

就像文本输出用 [`print`](@ref) 实现，用户定义的类型可以通过重载 [`show`](@ref) 来指定其文本化表示。
Julia 提供了一个标准化的多媒体输出机制（如图像、格式化文本，甚至音频和视频），
，由以下三部分组成：

  * 函数 [`display(x)`](@ref) 用于请求 Julia 对象 `x` 的最丰富的可用多媒体显示
    （带有纯文本回退选项）。
  * 重载 [`show`](@ref) 允许指示用户定义类型的任意多媒体表示（由标准 MIME 类型键控）。
  * 支持多媒体的显示后端可以通过继承泛型 [`AbstractDisplay`](@ref) 类型来注册，
    并通过 [`pushdisplay`](@ref) 将其推送到显示后端栈中。

```@docs
Base.AbstractDisplay
Base.Multimedia.display
Base.Multimedia.redisplay
Base.Multimedia.displayable
Base.show(::IO, ::Any, ::Any)
Base.Multimedia.showable
Base.repr(::MIME, ::Any)
Base.MIME
Base.@MIME_str
```

如上所述，你也可以定义新的显示后端。例如，一个可以在窗口中显示 PNG 图像的模块可以向 Julia 注册这个功能，
这样当在具有 PNG 表示的类型上调用 [`display(x)`](@ref) 时，就会自动使用该模块的窗口显示图像。

为了定义新的显示后端，首先应该创建抽象类 [`AbstractDisplay`](@ref) 的子类型 `D`。

然后，对于每个可以在子类型 `D` 上显示的 MIME 类型（`mime` 字符串），
应该定义一个函数 `display(d::D, ::MIME"mime", x) = ...` 用来以此 MIME 类型显示 `x`，
通常是通过调用 [`show(io, mime, x)`](@ref) 或 [`repr(io, mime, x)`](@ref)。

如果 `x` 不能以该 MIME 类型显示，应该抛出 [`MethodError`](@ref)；如果调用 `show` 或 `repr`，这是自动的。
最后，应该定义一个函数 `display(d::D, x)`，
它查询 [`showable(mime, x)`](@ref) 以获取 `D` 支持的 `mime` 类型，并显示"最佳"的一个；
如果没有找到 `x` 支持的 MIME 类型，应该抛出 `MethodError`。

类似地，某些子类型可能希望重写 [`redisplay(d::D, ...)`](@ref Base.Multimedia.redisplay)。
（同样，应该 `import Base.display` 来添加新的 `display` 方法）
这些函数的返回值取决于具体实现（因为在某些情况下，返回某种类型的显示"句柄"可能很有用）。
`D` 的显示函数可以直接调用，但也可以通过将新的待显示对象，推送到显示后端来自动调用 [`display(x)`](@ref)：

```@docs
Base.Multimedia.pushdisplay
Base.Multimedia.popdisplay
Base.Multimedia.TextDisplay
Base.Multimedia.istextmime
```

## 网络 I/O

```@docs
Base.bytesavailable
Base.ntoh
Base.hton
Base.ltoh
Base.htol
Base.ENDIAN_BOM
```
