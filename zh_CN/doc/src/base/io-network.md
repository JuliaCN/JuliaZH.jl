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
  * 过载 [`show`](@ref) 允许指定用户自定义类型的任意多媒体表现形式（以标准MIME类型为键值）
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

为了定义新的显示后端，应该首先创建抽象类`AbstractDisplay`的子类型`D`。然后，对于每个可以显示在`D`上的MIME类型(`mime` string)，用户应该定义一个函数`display(d::D, ::MIME"mime", x) = ...` 这里的`x`表示为 MIME　类型，经常在[`show(io, mime, x)`](@ref)或[`repr(io, mime, x)`](@ref)中被调用。如果`x`不能被表示为 MIME 类型则`MethodError`会被抛出； 这在用户调用`show` 或`repr`的时候是会自动执行的。最后，用户应该定义一个函数`display(d::D, x)` 来查询[`showable(mime, x)`](@ref)以获得`D`支持的`mime`类型并把它显示为＂最好＂的一个;如果没有为`x`找到支持的 MIME 类型，就应该抛出`MethodError`。类似地，一些子类型可能希望重写[`redisplay(d::D, ...)`](@ref　Base.Multimedia.redisplay)。（同样，用户也应该通过`import Base.display`去添加新的方法去`display`。）这些函数的返回值取决于实现（因为在某些情况下，返回某种类型的显示“句柄”可能很有用）。`D`的显示功能可以直接调用，但它们也可以从[`display(x)`](@ref)自动调用，只需在显示后端栈中添加一个新显示即可:

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
