# 代码加载

Julia加载代码有两种机制：

1. **代码包含：**例如 `include("source.jl")`。包含允许你把一个程序拆分为多个源文件。表达式 `include("source.jl")` 使得文件 `source.jl` 的内容在出现 `include` 调用的模块的全局作用域中执行。如果多次调用 `include("source.jl")`，`source.jl` 就被执行多次。`source.jl` 的包含路径解释为相对于出现 `include` 调用的文件路径。重定位源文件子树因此变得简单。在 REPL 中，包含路径为当前工作目录，即 `pwd()`。
2. **加载包：**例如 `import X`或`using X`。 import通过加载包 ( 一个独立的，可重用的Julia代码集合，包含在一个模块中 )，并导入模块内部的名称“X”，使得模块X可用。 如果在同一个Julia会话中，多次导入包`X`，那么后续导入模块为第一次导入模块的引用。 应该注意，`import X`可以在不同的上下文中加载不同的包：`X`可以引用主工程中名为`X`的一个包，但他们可能依赖的包是完全不同的。 更多机制说明如下。

代码包含是非常直接的，即在调用者的上下文中解释运行源文件。包加载是建立在代码包含之上的，并且相当复杂。因此，本章的其余部分将重点介绍程序包加载的行为和机制。

!!! note
    除非你想了解 Julia 中包加载的技术细节，你才需要阅读本章。如果你只想安装和使用包，只需使用 Julia 的内置包管理器来往你的环境中添加包，并在你的代码中编写 `import X` 或 `using X` 来使用已经添加的包。

一个 *包（package）* 就是一个源码树，其标准布局中提供了其他 Julia 项目可以复用的功能。包可以使用 `import X` 或 `using X` 语句加载。这些语句还使得名为 `X` 的模块在加载包代码时被产生，并在包含该模块的 import 语句的模块中可用。`import X` 中 `X` 的含义与上下文有关：程序中加载哪个 `X` 包取决于语句出现的代码。`import X` 的效果取决于以下两个问题：

1. 在上下文中，**哪个**包是 `X` ？
2. `X` 包在**哪里**能够被找到？

理解 Julia 是如何回答这些问题是理解包如何被加载的重点。

## 包联盟

Julia 支持包的联合管理。这意味着多个独立方可以维护公共和私有包及其注册列表，并且项目可以依赖于来自不同注册表的公共和私有包的组合。您也可以使用一组通用工具和工作流（workflow）来安装和管理来自各种注册表的包。Julia 0.7/1.0 附带的 `Pkg` 软件包管理器允许您通过创建和操作项目文件来安装和管理项目的依赖项，而项目文件描述了项目所依赖的内容和您项目完整依赖库的确切版本的快照清单文件。

联合管理的一个可能后果是没有包命名的中央权限。不同组织可以使用相同的名称来引用不相关的包。这并不是没有可能的，因为这些组织可能没有协作，甚至不知道彼此。由于缺乏中央命名权限，单个项目很可能最终依赖着具有相同名称的不同包。 Julia 的包加载机制通过不要求包名称是全局唯一的来解决这一问题，即使在单个项目的依赖关系图中也是如此。相反，包由[通用唯一标识符](https://en.wikipedia.org/wiki/Universally_unique_identifier) （UUID）进行标识，这些标识符在注册之前分配给它们。问题*“什么是 `X` ？”*通过确定 `X` 的UUID来回答。

由于去中心化的命名问题有些抽象，因此可以通过具体情境来理解问题。假设你正在开发一个名为 `App` 的应用程序，它使用两个包： `Pub` 和 `Priv`。`Priv` 是你创建的私有包，而 `Pub` 是你使用但不控制的公共包。当你创建 `Priv` 时，该名称没有公共包。然而，随后一个名为 `Priv` 的不相关软件包发布并变得流行起来，而且 `Pub` 包已经开始使用它了。因此，当你下次升级 `Pub` 以获取最新的错误修复和特性时，除了升级之外，`App` 将会停止工作——这取决于两个名为 `Priv` 的不同包。`App` 直接依赖于你的私有 `Priv` 包，以及通过 `Pub` 在新的公共 `Priv` 包上的间接依赖。由于这两个 `Priv` 包是不同的，但是 `App` 继续正常工作依赖于他们两者，因此表达式 `import Priv` 必须引用不同的 `Priv` 包，具体取决于它是出现在 `App` 的代码中还是出现在 `Pub` 的代码中。Julia的包加载机制允许通过上下文和UUID区分两个 `Priv` 包，这种区分的工作原理取决于环境，如以下各节所述。

## 环境（Environment）

**环境**决定了 `import X` 和 `using X` 语句在不同的代码上下文中的含义以及什么文件会被加载。Julia 有三类环境（environment）：

1. **项目环境（project environment）**是包含项目文件和清单文件（可选）的目录。项目文件确定项目的直接依赖项的名称和标识。清单文件（如果存在）提供完整的依赖关系图，包括所有直接和间接依赖关系，每个依赖的确切版本以及定位和加载正确版本的足够信息。
2. **包目录（package directory）**是包含一组包的源码树子目录的目录。这种环境是 Julia 0.6 及更早版本中唯一存在的环境。如果 `X` 是包目录的子目录并且存在 `X/src/X.jl`，那么程序包 `X` 在包目录环境中可用，而 `X/src/X.jl` 是加载它使用的源文件。
3. **堆栈环境（stacked environment）**是一组有序的项目环境和包目录，重叠为一个复合环境，其中组成环境的所有可用包都可用。例如，Julia 的负载路径是一个堆栈环境。

这三种环境各有不同的用途：

* 项目环境提供**可迁移性**。通过将项目环境以及项目源代码的其余部分存放到版本控制（例如一个 git 存储库），您可以重现项目的确切状态_和_所有依赖项，因为清单文件会记录每个依赖项的确切版本，并且可以轻松地重新实现。
* 当使用项目环境是大材小用时，包目录提供低开销的**便利**。当你有一组包，只是想把它们放在某处，并且在使用时不必为他们创建和维护项目环境时，使用包目录这种环境是很趁手的。（译注：即不需要项目环境的复杂依赖关系维护时使用。）
* 堆栈环境允许使用其他工具**扩展**基本环境。您可以将包含开发工具在内的环境堆到堆栈中，它们可以从 REPL 和脚本中获得，但不能从包内部获得。

作为一种抽象，环境提供了三个映射：根路径 `roots` ，依赖关系 `graph` 和路径 `paths`。当解释运行 `import X` 时，`roots` 和 `graph` 用于确定 `X` 的身份并回答问题**“什么是 `X`？”**，同时使用 `paths` 关系找到 `X` 的源代码并回答问题**“哪里是 `X`？”**这三个映射的具体作用是：

- **roots:** `name::Symbol` ⟶ `uuid::UUID`

  环境的 `roots` 映射将包名称分配给UUID，以获取环境可用于主项目的所有顶级依赖项（即可以在 `Main` 中加载的那些依赖项）。当 Julia 在主项目中遇到 `import X` 时，它会将 `X` 的标识作为 `roots[:X]`。

- **graph:** `context::UUID` ⟶ `name::Symbol` ⟶ `uuid::UUID`

  环境的 `graph` 是一个多级映射，它为每个 `context` UUID 分配一个从名称到 UUID 的映射——类似于 `roots` 映射，但专一于那个 `context`。当 Julia 在 UUID 为 `context` 的包代码中运行到 `import X` 时，它会将 `X` 的标识看作为 `graph[context][:X]`。正是因为如此，`import X` 可以根据 `context` 引用不同的包。

- **paths:** `uuid::UUID` × `name::Symbol` ⟶ `path::String`

  `paths` 映射会为每个包分配 UUID-name 对，即该包的入口点源文件的位置。在 `import X` 中，`X` 的标识已经通过 `roots` 或 `graph` 解析为 UUID（取决于它是从主项目还是从依赖项加载），Julia 确定要加载哪个文件来获取 `X` 是通过在环境中查找 `paths[uuid,:X]`。要包含此文件应该创建一个名为 `X` 的模块。在第一次加载此包之后，任何解析为相同的 `uuid` 的导入只会创建一个到同一个已加载的包模块的绑定。

每种环境都以不同的方式定义这三种映射，详见以下各节。

!!! note
    为了清楚地说明，本章中的示例包括 `roots`、`graph` 和 `paths` 的数据结构实现。不过这些映射实际上只是一种抽象。事实上，为了提高效率，Julia 的包加载代码实际上并没有实现它们。相反，加载一个给定包是通过查询它们的内建 API，并简单地只计算所必需的结构实现的。

### 项目环境（Project environments）

项目环境由包含项目文件 `Project.toml` 的目录以及清单文件（可选）`Manifest.toml`确定。这些文件也可以命名为 `JuliaProject.toml` 和 `JuliaManifest.toml`，此时 `Project.toml` 和 `Manifest.toml` 被忽略——这允许项目与可能需要名为 `Project.toml` 和 `Manifest.toml` 文件的其他重要工具共存。但是对于纯 Julia 项目，名称 `Project.toml` 和 `Manifest.toml` 应是首选。项目环境的 `roots`、`graph` 和 `paths` 映射定义如下。

**roots 映射** 在环境中由其项目文件的内容决定，特别是它的顶级 `name` 和 `uuid` 条目及其 `[deps]` 部分（全部是可选的）。考虑以下一个假想的应用程序 `App` 的示例项目文件，如上所述：

```toml
name = "App"
uuid = "8f986787-14fe-4607-ba5d-fbff2944afa9"

[deps]
Priv = "ba13f791-ae1d-465a-978b-69c3ad90f72b"
Pub  = "c07ecb7d-0dc9-4db7-8803-fadaaeaf08e1"
```

如果它被实现为 Julia 字典，那么这个项目文件意味着以下 `roots` 映射：

```julia
roots = Dict(
    :App  => UUID("8f986787-14fe-4607-ba5d-fbff2944afa9"),
    :Priv => UUID("ba13f791-ae1d-465a-978b-69c3ad90f72b"),
    :Pub  => UUID("c07ecb7d-0dc9-4db7-8803-fadaaeaf08e1"),
)
```

基于这个 `root` 映射，在 `App` 的代码中，语句 `import Priv` 将使 Julia 查找 `roots[:Priv]`，这将得到 `ba13f791-ae1d-465a-978b-69c3ad90f72b`，也就是要在这一部分加载的 `Priv` 包的 UUID。当主应用程序解释运行到 `import Priv` 时，此 UUID 标识了要加载和使用的 `Priv` 包。

**The dependency graph** of a project environment is determined by the contents of the manifest file, if present, or if there is no manifest file, `graph` is empty. A manifest file contains a stanza for each direct or indirect dependency of a project, including for each one, its UUID and a source tree hash or an explicit path to the source code. Consider the following example manifest file for `App`:

```toml
[[Priv]] # the private one
deps = ["Pub", "Zebra"]
uuid = "ba13f791-ae1d-465a-978b-69c3ad90f72b"
path = "deps/Priv"

[[Priv]] # the public one
uuid = "2d15fe94-a1f7-436c-a4d8-07a9a496e01c"
git-tree-sha1 = "1bf63d3be994fe83456a03b874b409cfd59a6373"
version = "0.1.5"

[[Pub]]
uuid = "c07ecb7d-0dc9-4db7-8803-fadaaeaf08e1"
git-tree-sha1 = "9ebd50e2b0dd1e110e842df3b433cb5869b0dd38"
version = "2.1.4"

  [Pub.deps]
  Priv = "2d15fe94-a1f7-436c-a4d8-07a9a496e01c"
  Zebra = "f7a24cb4-21fc-4002-ac70-f0e3a0dd3f62"

[[Zebra]]
uuid = "f7a24cb4-21fc-4002-ac70-f0e3a0dd3f62"
git-tree-sha1 = "e808e36a5d7173974b90a15a353b564f3494092f"
version = "3.4.2"
```

This manifest file describes a possible complete dependency graph for the `App` project:

- There are two different `Priv` packages that the application needs—a private one which is a direct dependency and a public one which is an indirect dependency through `Pub`:
  * The private `Priv` depends on the `Pub` and `Zebra` packages.
  * The public `Priv` has no dependencies.
- The application also depends on the `Pub` package, which in turn depends on the public `Priv ` and the same `Zebra` package which the private `Priv` package depends on.

A materialized representation of this dependency `graph` looks like this:

```julia
graph = Dict{UUID,Dict{Symbol,UUID}}(
    # Priv – the private one:
    UUID("ba13f791-ae1d-465a-978b-69c3ad90f72b") => Dict{Symbol,UUID}(
        :Pub   => UUID("c07ecb7d-0dc9-4db7-8803-fadaaeaf08e1"),
        :Zebra => UUID("f7a24cb4-21fc-4002-ac70-f0e3a0dd3f62"),
    ),
    # Priv – the public one:
    UUID("2d15fe94-a1f7-436c-a4d8-07a9a496e01c") => Dict{Symbol,UUID}(),
    # Pub:
    UUID("c07ecb7d-0dc9-4db7-8803-fadaaeaf08e1") => Dict{Symbol,UUID}(
        :Priv  => UUID("2d15fe94-a1f7-436c-a4d8-07a9a496e01c"),
        :Zebra => UUID("f7a24cb4-21fc-4002-ac70-f0e3a0dd3f62"),
    ),
    # Zebra:
    UUID("f7a24cb4-21fc-4002-ac70-f0e3a0dd3f62") => Dict{Symbol,UUID}(),
)
```

Given this dependency `graph`, when Julia sees `import Priv` in the `Pub` package—which has UUID `c07ecb7d-0dc9-4db7-8803-fadaaeaf08e1`—it looks up:

```julia
graph[UUID("c07ecb7d-0dc9-4db7-8803-fadaaeaf08e1")][:Priv]
```

and gets `2d15fe94-a1f7-436c-a4d8-07a9a496e01c` , which indicates that in the context of the `Pub` package,  `import Priv` refers to the public `Priv` package, rather than the private one which the app depends on directly. This is how the name `Priv` can refer to different packages in the main project than it does in one of the packages dependencies, which allows for name collisions in the package ecosystem.

What happens if `import Zebra` is evaluated in the main `App` code base? Since `Zebra` does not appear in the project file, the import will fail even though `Zebra` *does* appear in the manifest file. Moreover, if `import Zebra` occurs in the public `Priv` package—the one with UUID `2d15fe94-a1f7-436c-a4d8-07a9a496e01c`—then that would also fail since that `Priv` package has no declared dependencies in the manifest file and therefore cannot load any packages. The `Zebra` package can only be loaded by packages for which it appear as an explicit dependency in the manifest file: the  `Pub` package and one of the `Priv` packages.

**The paths map** of a project environment is also determined by the manifest file if present and is empty if there is no manifest. The path of a package `uuid` named `X` is determined by these two rules:

1. If the manifest stanza matching `uuid` has a `path` entry, use that path relative to the manifest file.
2. Otherwise, if the manifest stanza matching `uuid` has a `git-tree-sha1` entry, compute a deterministic hash function of `uuid` and `git-tree-sha1`—call it `slug`—and look for `packages/X/$slug` in each directory in the Julia `DEPOT_PATH` global array. Use the first such directory that exists.

If applying these rules doesn't find a loadable path, the package should be considered not installed and the system should raise an error or prompt the user to install the appropriate package version.

In the example manifest file above, to find the path of the first `Priv` package—the one with UUID `ba13f791-ae1d-465a-978b-69c3ad90f72b`—Julia looks for its stanza in the manifest file, sees that it has a `path` entry, looks at `deps/Priv` relative to the `App` project directory—let's suppose the `App` code lives in `/home/me/projects/App`—sees that `/home/me/projects/App/deps/Priv` exists and therefore loads `Priv` from there.

If, on the other hand, Julia was loading the *other* `Priv` package—the one with UUID `2d15fe94-a1f7-436c-a4d8-07a9a496e01c`—it finds its stanza in the manifest, see that it does *not* have a `path` entry, but that it does have a `git-tree-sha1` entry. It then computes the `slug` for this UUID/SHA-1 pair, which is `HDkr` (the exact details of this computation aren't important, but it is consistent and deterministic). This means that the path to this `Priv` package will be `packages/Priv/HDkr/src/Priv.jl` in one of the package depots. Suppose the contents of `DEPOT_PATH` is `["/users/me/.julia", "/usr/local/julia"]`; then Julia will look at the following paths to see if they exist:

1. `/home/me/.julia/packages/Priv/HDkr/src/Priv.jl`
2. `/usr/local/julia/packages/Priv/HDkr/src/Priv.jl`

Julia uses the first of these that exists to load the public `Priv` package.

Here is a materialized `paths` map for the `App` project environment:

```julia
paths = Dict{Tuple{UUID,Symbol},String}(
    # Priv – the private one:
    (UUID("ba13f791-ae1d-465a-978b-69c3ad90f72b"), :Priv) =>
        # relative entry-point inside `App` repo:
        "/home/me/projects/App/deps/Priv/src/Priv.jl",
    # Priv – the public one:
    (UUID("2d15fe94-a1f7-436c-a4d8-07a9a496e01c"), :Priv) =>
        # package installed in the system depot:
        "/usr/local/julia/packages/Priv/HDkr/src/Priv.jl",
    # Pub:
    (UUID("c07ecb7d-0dc9-4db7-8803-fadaaeaf08e1"), :Pub) =>
        # package installed in the user depot:
        "/home/me/.julia/packages/Pub/oKpw/src/Pub.jl",
    # Zebra:
    (UUID("f7a24cb4-21fc-4002-ac70-f0e3a0dd3f62"), :Zebra) =>
        # package installed in the system depot:
        "/usr/local/julia/packages/Zebra/me9k/src/Zebra.jl",
)
```

This example map includes three different kinds of package locations:

1. The private `Priv` package is "[vendored](https://stackoverflow.com/a/35109534/659248)" inside of `App` repository.
2. The public `Priv` and `Zebra` packages are in the system depot, where packages installed and managed by the system administrator live. These are available to all users on the system.
3. The `Pub` package is in the user depot, where packages installed by the user live. These are only available to the user who installed them.

### Package directories

Package directories provide a kind of environment that approximates package loading in Julia 0.6 and earlier, and which resembles package loading in many other dynamic languages. The set of packages available in a package directory corresponds to the set of subdirectories it contains that look like packages: if `X/src/X.jl` is a file in a package directory, then `X` is considered to be a package and `X/src/X.jl` is the file you load to get `X`. Which packages can "see" each other as dependencies depends on whether they contain project files or not and what appears in the `[deps]` sections of those project files.

**The roots map** is determined by the subdirectories `X` of a package directory for which `X/src/X.jl` exists and whether `X/Project.toml` exists and has a top-level `uuid` entry. Specifically `:X => uuid` goes in `roots` for each such `X` where `uuid` is defined as:

1. If `X/Project.toml` exists and has a `uuid` entry, then `uuid` is that value.
2. If `X/Project.toml` exists and but does *not* have a top-level UUID entry, `uuid` is a dummy UUID generated by hashing the canonical path of `X/Project.toml`.
3. If `X/Project.toml` does not exist, then `uuid` is the all-zero [nil UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Nil_UUID).

**The dependency graph** of a project directory is determined by the presence and contents of project files in the subdirectory of each package. The rules are:

- If a package subdirectory has no project file, then it is omitted from `graph` and import statements in its code are treated as top-level, the same as the main project and REPL.
- If a package subdirectory has a project file, then the `graph` entry for its UUID is the `[deps]` map of the project file, which is considered to be empty if the section is absent.

As an example, suppose a package directory has the following structure and content:

```
Aardvark/
    src/Aardvark.jl:
        import Bobcat
        import Cobra

Bobcat/
    Project.toml:
        [deps]
        Cobra = "4725e24d-f727-424b-bca0-c4307a3456fa"
        Dingo = "7a7925be-828c-4418-bbeb-bac8dfc843bc"

    src/Bobcat.jl:
        import Cobra
        import Dingo

Cobra/
    Project.toml:
        uuid = "4725e24d-f727-424b-bca0-c4307a3456fa"
        [deps]
        Dingo = "7a7925be-828c-4418-bbeb-bac8dfc843bc"

    src/Cobra.jl:
        import Dingo

Dingo/
    Project.toml:
        uuid = "7a7925be-828c-4418-bbeb-bac8dfc843bc"

    src/Dingo.jl:
        # no imports
```

Here is a corresponding `roots` structure, materialized as a dictionary:

```julia
roots = Dict{Symbol,UUID}(
    :Aardvark => UUID("00000000-0000-0000-0000-000000000000"), # no project file, nil UUID
    :Bobcat   => UUID("85ad11c7-31f6-5d08-84db-0a4914d4cadf"), # dummy UUID based on path
    :Cobra    => UUID("4725e24d-f727-424b-bca0-c4307a3456fa"), # UUID from project file
    :Dingo    => UUID("7a7925be-828c-4418-bbeb-bac8dfc843bc"), # UUID from project file
)
```

Here is the corresponding `graph` structure, materialized as a dictionary:

```julia
graph = Dict{UUID,Dict{Symbol,UUID}}(
    # Bobcat:
    UUID("85ad11c7-31f6-5d08-84db-0a4914d4cadf") => Dict{Symbol,UUID}(
        :Cobra => UUID("4725e24d-f727-424b-bca0-c4307a3456fa"),
        :Dingo => UUID("7a7925be-828c-4418-bbeb-bac8dfc843bc"),
    ),
    # Cobra:
    UUID("4725e24d-f727-424b-bca0-c4307a3456fa") => Dict{Symbol,UUID}(
        :Dingo => UUID("7a7925be-828c-4418-bbeb-bac8dfc843bc"),
    ),
    # Dingo:
    UUID("7a7925be-828c-4418-bbeb-bac8dfc843bc") => Dict{Symbol,UUID}(),
)
```

A few general rules to note:

1. A package without a project file can depend on any top-level dependency, and since every package in a package directory is available at the top-level, it can import all packages in the environment.
2. A package with a project file cannot depend on one without a project file since packages with project files can only load packages in `graph` and packages without project files do not appear in `graph`.
3. A package with a project file but no explicit UUID can only be depended on by packages without project files since dummy UUIDs assigned to these packages are strictly internal.

Observe the following specific instances of these rules in our example:

* `Aardvark` can import on any of `Bobcat`, `Cobra` or `Dingo`; it does import `Bobcat` and `Cobra`.
* `Bobcat` can and does import both `Cobra` and `Dingo`, which both have project files with UUIDs and are declared as dependencies in `Bobcat`'s `[deps]` section.
* `Bobcat` cannot possibly depend on `Aardvark` since `Aardvark` does not have a project file.
* `Cobra` can and does import `Dingo`, which has a project file and UUID, and is declared as a dependency in `Cobra`'s  `[deps]` section.
* `Cobra` cannot depend on `Aardvark` or `Bobcat` since neither have real UUIDs.
* `Dingo` cannot import anything because it has a project file without a `[deps]` section.

**The paths map** in a package directory is simple: it maps subdirectory names to their corresponding entry-point paths. In other words, if the path to our example project directory is `/home/me/animals` then the `paths` map would be materialized as this dictionary:

```julia
paths = Dict{Tuple{UUID,Symbol},String}(
    (UUID("00000000-0000-0000-0000-000000000000"), :Aardvark) =>
        "/home/me/AnimalPackages/Aardvark/src/Aardvark.jl",
    (UUID("85ad11c7-31f6-5d08-84db-0a4914d4cadf"), :Bobcat) =>
        "/home/me/AnimalPackages/Bobcat/src/Bobcat.jl",
    (UUID("4725e24d-f727-424b-bca0-c4307a3456fa"), :Cobra) =>
        "/home/me/AnimalPackages/Cobra/src/Cobra.jl",
    (UUID("7a7925be-828c-4418-bbeb-bac8dfc843bc"), :Dingo) =>
        "/home/me/AnimalPackages/Dingo/src/Dingo.jl",
)
```

Since all packages in a package directory environment are, by definition, subdirectories with the expected entry-point files, their `paths` map entries always have this form.

### Environment stacks

The third and final kind of environment is one that combines other environments by overlaying several of them, making the packages in each available in a single composite environment. These composite environments are called *environment stacks*. The Julia `LOAD_PATH` global defines an environment stack—the environment in which the Julia process operates. If you want your Julia process to have access only to the packages in one project or package directory, make it the only entry in `LOAD_PATH`. It is often quite useful, however, to have access to some of your favorite tools—standard libraries, profilers, debuggers, personal utilities, etc.—even if they are not dependencies of the project you're working on. By pushing an environment containing these tools onto the load path, you immediately have access to them in top-level code without needing to add them to your project.

The mechanism for combining the `roots`, `graph` and `paths` data structures of the components of an environment stack is simple: they are simply merged as dictionaries, favoring earlier entries over later ones in the case of key collisions. In other words, if we have `stack = [env₁, env₂, …]` then we have:

```julia
roots = reduce(merge, reverse([roots₁, roots₂, …]))
graph = reduce(merge, reverse([graph₁, graph₂, …]))
paths = reduce(merge, reverse([paths₁, paths₂, …]))
```

The subscripted `rootsᵢ`, `graphᵢ` and `pathsᵢ` variables correspond to the subscripted environments, `envᵢ`, contained `stack`. The `reverse` is present because `merge` favors the last argument rather than first when there are collisions between keys in its argument dictionaries. That's all there is to stacked environments. There are a couple of noteworthy features of this design:

1. The *primary environment*—i.e.the first environment in a stack—is faithfully embedded in a stacked environment. The full dependency graph of the first environment in a stack is guaranteed to be included intact in the stacked environment including the same versions of all dependencies.
2. Packages in non-primary environments can end up using incompatible versions of their dependencies even if their own environments are entirely compatible. This can happen when one of their dependencies is shadowed by a version in an earlier environment in the stack.

Since the primary environment is typically the environment of a project you're working on, while environments later in the stack contain additional tools, this is the right tradeoff: it's better to break your dev tools but keep the project working. When such incompatibilities occur, you'll typically want to upgrade your dev tools to versions that are compatible with the main project.

## 总结

Federated package management and precise software reproducibility are difficult but worthy goals in a package system. In combination, these goals lead to a more complex package loading mechanism than most dynamic languages have, but it also yields scalability and reproducibility that is more commonly associated with static languages. Fortunately, most Julia users can remain oblivious to the technical details of code loading and simply use the built-in package manager to add a package `X` to the appropriate project and manifest files and then write `import X` to load `X` without a further thought.
