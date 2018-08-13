# 处理操作系统差异

当面对平台相关的库时，通常要对不同的平台编写特定代码。变量`Sys.KERNEL`即用于这些特殊场合。在`Sys`模块中有一些函数将会使这些事情更加简单：`isunix`， `islinux`，`isapple`，
`isbsd`，以及 `iswindows`。这些函数可以如下方式使用：

```julia
if Sys.iswindows()
    some_complicated_thing(a)
end
```

注意，`islinux` 和`isapple`是`isunix`完全互斥的子集。另外，有一个宏`@static`可以使用这些函数有条件地隐藏无效代码，如以下示例所示。

简单例子：

```
ccall((@static Sys.iswindows() ? :_fopen : :fopen), ...)
```

复杂例子：

```julia
@static if Sys.islinux()
    some_complicated_thing(a)
else
    some_different_thing(a)
end
```

当条件组合时，（包括`if`/`elseif`/`end`），`@static`必须在每一层都调用（括号是可选的，但是为了可读性，建议使用）。

```julia
@static Sys.iswindows() ? :a : (@static Sys.isapple() ? :b : :c)
```
