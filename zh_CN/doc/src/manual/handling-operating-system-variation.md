# [处理操作系统差异](@id Handling-Operating-System-Variation)

当编写跨平台的应用或库时，通常需要考虑到操作系统之间的差异。变量 `Sys.KERNEL` 可以用于这些场合。在 `Sys` 模块中有一些函数将会使这些事情更加简单：`isunix`、 `islinux`、`isapple`、`isbsd`、`isfreebsd` 以及 `iswindows`。这些函数可以按如下方式使用：

```julia
if Sys.iswindows()
    windows_specific_thing(a)
end
```

注意，`islinux`、`isapple` 和 `isfreebsd` 是 `isunix` 完全互斥的子集。另外，有一个宏 `@static` 可以使用这些函数有条件地隐藏无效代码，如以下示例所示。

简单例子：

```
ccall((@static Sys.iswindows() ? :_fopen : :fopen), ...)
```

复杂例子：

```julia
@static if Sys.islinux()
    linux_specific_thing(a)
elseif Sys.isapple()
    apple_specific_thing(a)
else
    generic_thing(a)
end
```

在链式嵌套的条件表达式中（包括 `if`/`elseif`/`end`），`@static` 必须在每一层都调用（括号是可选的，但是为了可读性，建议添加）。

```julia
@static Sys.iswindows() ? :a : (@static Sys.isapple() ? :b : :c)
```
