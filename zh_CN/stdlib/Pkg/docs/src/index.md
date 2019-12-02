# Pkg

## 介绍

Pkg 是 Julia 1.0 及后续新版本的标准包管理器。与那些安装和管理单个全局软件包集的传统包管理器不同，Pkg 是围绕「环境」设计的。每个项目都有一套独立与其他项目的软件包集合。同一个软件包也可以在多个项目中通过名字共享。项目环境的软件包信息是保存在 _清单文件_ 里的。清单文件确切的描述了每一个依赖软件包和它的版本。清单文件可以检入项目存储库并在版本控制中进行跟踪，从而显着提高项目的可重复性。如果你曾经试图运行一段时间未曾使用过的代码，但发现其完全无法工作，而这只是因为你更新或卸载了项目使用的一些软件包，那么你会理解这种方法的意图。在 Pkg 中，由于每个项目都维护着各自独立的软件包集，你再也不会遇到这个问题了。 此外，如果你签出项目到新系统中，搭建出其清单文件所描述的环境将会非常地简单，并且你可以立即启动和并运行该项目，因为我们知道项目依赖项是好的。

由于项目包环境是彼此独立地进行管理和更新的， Pkg 显著地缓解了「依赖地狱」问题。你如果想在新项目中使用最新、最棒的包，但在另一个项目中却卡在了使用旧版本的包，那也没问题——因为它们的环境是彼此分离的，不同项目可以使用装在系统的不同位置的不同版本的包。每个版本的包的位置都是规范的，所以当多个环境使用的包版本相同时，它们可以共享同一安装包，这就避免不必要的重复安装。不被任何环境使用的老旧版本的包，会被包管理器定期「垃圾收集」掉。

Pkg 对本地环境的处理方法可能让曾经使用过 Python 的 `virtualenv` 或 Ruby 的 `bundler` 的人感到熟悉。在 Julia 中，我们不仅没有通过破解语言的代码加载机制来支持环境，而且还有 Julia 本身就理解它们的好处。此外，Julia 环境是「可堆叠的」：你可以将一个环境叠加在另一个环境上，从而可以访问主环境之外的其它包。这使得更容易在提供主环境的项目上工作，同时依然访问所有你常用的开发工具，如分析器、调试器等，这只需在加载路径中更后地包含具有这些开发环境的路径。

Last but not least, Pkg is designed to support federated package registries.
This means that it allows multiple registries managed by different parties to
interact seamlessly. In particular, this includes private registries which can
live behind corporate firewalls. You can install and update your own packages
from a private registry with exactly the same tools and workflows that you use
to install and manage official Julia packages. If you urgently need to apply a
hotfix for a public package that’s critical to your company’s product, you can
tag a private version of it in your company’s internal registry and get a fix to
your developers and ops teams quickly and easily without having to wait for an
upstream patch to be accepted and published. Once an official fix is published,
however, you can just upgrade your dependencies and you'll be back on an
official release again.

## 词汇表

**项目（Project）：**一个具有标准布局的源代码树，包括了用来放置主要的 Julia 代码的 `src` 目录、用来放置测试的 `test` 目录、用来放置文档的 `docs` 目录和可选的用来放置构建脚本及其输出的 `deps` 目录。项目通常有一个项目文件和一个可选的清单文件：

- **项目文件（Project file）：**一个在项目根目录下的文件，叫做 `Project.toml`（或 `JuliaProject.toml`），用来描述项目的元数据，包括项目的名称、UUID（针对包）、作者、许可证和它所依赖的包和库的名称及 UUID。
   
   
   

- **清单文件（Manifest file）：**一个在项目根目录下的文件，叫做 `Manifest.toml`（或 `JuliaManifest.toml`），用来描述完整的依赖关系图、每个包的确切版本以及项目使用的库。
   
   

**包（Package）：**一个提供可重用功能的项目，其它 Julia 项目可以同 `import X` 或 `using X` 使用它。一个包应该包含一个具有 `uuid` 条目（此条目给出该包 UUID）的项目文件。此 UUID 用于在依赖它的项目中标识该包。

!!! note
    由于历史原因，可以在 REPL 或脚本的顶级中加载没有项目文件或 UUID 的包。但是，无法在具有项目文件或 UUID 的项目中加载没有它们的包。一旦你曾从项目文件加载包，所有包就都需要项目文件和 UUID。

**应用（application）：**一个提供独立功能的项目，不打算被其它 Julia 项目重用。例如，Web 应用、命令行工具或者科学论文附带的模拟或分析代码。应用可以有 UUID 但也可以没有。应用还可以为其所依赖的包提供全局配置选项。另一方面，包不可能提供全局配置，因为这可能与主应用的配置相冲突。

!!! note
    **项目 _vs._ 包 _vs._ 应用：**

    1. **项目**是一个总称：包和应用都是一种项目。
    2. **包**应该有 UUID，而应用可以有也可以没有。
    3. **应用**可以提供全局的配置，而包不行。

**Library (future work):** a compiled binary dependency (not written in Julia)
packaged to be used by a Julia project. These are currently typically built in-
place by a `deps/build.jl` script in a project’s source tree, but in the future
we plan to make libraries first-class entities directly installed and upgraded
by the package manager.

**环境（Environment）：**项目文件和清单文件的组合，项目文件与依赖关系图相结合后提供了顶级名称映射，而清单文件提供了包到它们入口点的映射。有关的详细信息，请参阅手册中代码加载的相关章节。

- **显式环境（Explicit environment）：**在同一目录下具有显式的项目文件和可选的与其对应的清单文件。如果清单文件不存在，那么隐含的依赖关系图和位置映射为空。
   
   
   

- **隐式环境（Implicit environment）：**作为目录提供的环境（没有项目文件或清单文件），此目录包含包且包含的包具有形式为 `X.jl`、`X.jl/src/X.jl` 或 `X/src/X.jl` 的入口点，这些包的入口点隐含了顶级名称映射。依赖关系图隐含在这些包所在目录的项目文件里，例如 `X.jl/Project.toml` 或 `X/Project.toml`。如果 `X` 存在对应的项目文件，则其依赖关系就是其项目文件的依赖关系。入口点本身就隐含了位置映射。
   
   
   
   
   
   
   

**Registry:** a source tree with a standard layout recording metadata about a
registered set of packages, the tagged versions of them which are available, and
which versions of packages are compatible or incompatible with each other. A
registry is indexed by package name and UUID, and has a directory for each
registered package providing the following metadata about it:

- name——例如 `DataFrames`
- UUID——例如 `a93c6f00-e57d-5684-b7b6-d8193f3e46c0`
- authors——例如 `Jane Q. Developer <jane@example.com>`
- license——例如 MIT，BSD3 或 GPLv2
- repository——例如 `https://github.com/JuliaData/DataFrames.jl.git`
- description——一个总结包功能的文本块
- keywords——例如 `data`，`tabular`，`analysis`，`statistics`
- versions——所有已注册版本的标签列表

每个包的已注册版本都会提供以下信息：

- its semantic version number – e.g. `v1.2.3`
- its git tree SHA-1 hash – e.g. `7ffb18ea3245ef98e368b02b81e8a86543a11103`
- a map from names to UUIDs of dependencies
- which versions of other packages it is compatible/incompatible with

Dependencies and compatibility are stored in a compressed but human-readable
format using ranges of package versions.

**Depot:** a directory on a system where various package-related resources live,
including:

- `environments`: shared named environments (e.g. `v0.7`, `devtools`)
- `clones`: bare clones of package repositories
- `compiled`: cached compiled package images (`.ji` files)
- `config`: global configuration files (e.g. `startup.jl`)
- `dev`: default directory for package development
- `logs`: log files (e.g. `manifest_usage.toml`, `repl_history.jl`)
- `packages`: installed package versions
- `registries`: clones of registries (e.g. `General`)

**Load path:** a stack of environments where package identities, their
dependencies, and entry-points are searched for. The load path is controlled in
Julia by the `LOAD_PATH` global variable which is populated at startup based on
the value of the `JULIA_LOAD_PATH` environment variable. The first entry is your
primary environment, often the current project, while later entries provide
additional packages one may want to use from the REPL or top-level scripts.

**Depot path:** a stack of depot locations where the package manager, as well as
Julia's code loading mechanisms, look for registries, installed packages, named
environments, repo clones, cached compiled package images, and configuration
files. The depot path is controlled by the Julia `DEPOT_PATH` global variable
which is populated at startup based on the value of the `JULIA_DEPOT_PATH`
environment variable. The first entry is the “user depot” and should be writable
by and owned by the current user. The user depot is where: registries are
cloned, new package versions are installed, named environments are created and
updated, package repos are cloned, newly compiled package image files are saved,
log files are written, development packages are checked out by default, and
global configuration data is saved. Later entries in the depot path are treated
as read-only and are appropriate for registries, packages, etc. installed and
managed by system administrators.

## 入门

在 Julia REPL 中使用 `]` 键即可进入 Pkg 模式。

```
(v0.7) pkg>
```

提示符括号内的部分显示当前项目的名称。由于我们尚未创建自己的项目，我们正处于默认项目中，其位于 `~/.julia/environments/v0.7`（或任何你恰巧在运行的 Julia 版本）。

要返回 `julia>` 提示符，请在输入行为空时按退格键或直接按 Ctrl+C。可通过调用 `pkg>help` 获得帮助。如果你所处的环境无法访问 PEPL，你仍可以通过字符串宏 `pkg`（其在 `using Pkg` 后可用）使用 REPL 模式的命令。命令 `pkg"cms"` 将等价于在 RPEL 模式中执行 `cmd`。

此处的文档介绍了如何使用 REPL 的 Pkg 模式。使用 Pkg API（通过调用 `Pkg.` 函数）的文档正在编写中。

### 添加包

有两种方法可以添加包，分别是使用 `add` 命令和 `dev` 命令。最常用的是 `add`，我们首先介绍它的用法。

#### 添加已注册的包

在 REPL 的 Pkg 模式中，添加包可以使用 `add` 命令，其后接包的名称，例如：

```
(v0.7) pkg> add Example
   Cloning default registries into /Users/kristoffer/.julia/registries
   Cloning registry General from "https://github.com/JuliaRegistries/General.git"
  Updating registry at `~/.julia/registries/General`
  Updating git-repo `https://github.com/JuliaRegistries/General.git`
 Resolving package versions...
  Updating `~/.julia/environments/v0.7/Project.toml`
  [7876af07] + Example v0.5.1
  Updating `~/.julia/environments/v0.7/Manifest.toml`
  [7876af07] + Example v0.5.1
  [8dfed614] + Test
```

在这里，我们将包 Example 添加到当前项目中。此例中，我们使用的是全新的 Julia 安装，并且这是我们第一次使用 Pkg 添加包。默认情况下，Pkg 会克隆 Julia 的 General 注册表，并使用此注册表来查找需要包含在当前环境中的包。状态更新在左侧显示了简短形式的包 UUID，接着是包名称和版本号。因为标准库（例如 `Test`）随 Julia 一起提供，所以它们没有版本号。项目状态包含你自己添加的包，在此例中为 `Example`：

```
(v0.7) pkg> st
    Status `Project.toml`
  [7876af07] Example v0.5.1
```

此外，清单状态包含了显式添加的包的依赖项。

```
(v0.7) pkg> st --manifest
    Status `Manifest.toml`
  [7876af07] Example v0.5.1
  [8dfed614] Test
```

可以在一次命令中添加多个包，例如 `pkg> add A B C`。

在包已添加进项目中后，可在 Julia 中加载它：

```
julia> using Example

julia> Example.hello("User")
"Hello, User"
```

可以通过在 `@` 符号后附加版本号来安装特定版本，例如在包名称后附加 `@v0.4`：

```
(v0.7) pkg> add Example@0.4
 Resolving package versions...
  Updating `~/.julia/environments/v0.7/Project.toml`
  [7876af07] + Example v0.4.1
  Updating `~/.julia/environments/v0.7/Manifest.toml`
  [7876af07] + Example v0.4.1
```

如果 `Example` 的主分支（或某个提交 SHA）有尚未包含在已注册版本中的修补程序，我们可以通过在包名称后附加 `#branch`（或 `#commit`）来显式跟踪该分支（或提交）：

```
(v0.7) pkg> add Example#master
  Updating git-repo `https://github.com/JuliaLang/Example.jl.git`
 Resolving package versions...
  Updating `~/.julia/environments/v0.7/Project.toml`
  [7876af07] ~ Example v0.5.1 ⇒ v0.5.1+ #master (https://github.com/JuliaLang/Example.jl.git)
  Updating `~/.julia/environments/v0.7/Manifest.toml`
  [7876af07] ~ Example v0.5.1 ⇒ v0.5.1+ #master (https://github.com/JuliaLang/Example.jl.git)
```

状态输出现在显示我们正在跟踪 `Example` 的 `master` 分支。在更新包时，我们将从该分支中拉取更新。

要返回到跟踪 `Example` 的注册表版本，请使用 `free` 命令：

```
(v0.7) pkg> free Example
 Resolving package versions...
  Updating `~/.julia/environments/v0.7/Project.toml`
  [7876af07] ~ Example v0.5.1+ #master (https://github.com/JuliaLang/Example.jl.git) ⇒ v0.5.1
  Updating `~/.julia/environments/v0.7/Manifest.toml`
  [7876af07] ~ Example v0.5.1+ #master )https://github.com/JuliaLang/Example.jl.git) ⇒ v0.5.1
```


#### 添加未注册包

如果某个包不在注册表中，通过将其存储库的 URL 传给 `add` 而不是包名称，仍然可以添加它。

```
(v0.7) pkg> add https://github.com/fredrikekre/ImportMacros.jl
  Updating git-repo `https://github.com/fredrikekre/ImportMacros.jl`
 Resolving package versions...
Downloaded MacroTools ─ v0.4.1
  Updating `~/.julia/environments/v0.7/Project.toml`
  [e6797606] + ImportMacros v0.0.0 # (https://github.com/fredrikekre/ImportMacros.jl)
  Updating `~/.julia/environments/v0.7/Manifest.toml`
  [e6797606] + ImportMacros v0.0.0 # (https://github.com/fredrikekre/ImportMacros.jl)
  [1914dd2f] + MacroTools v0.4.1
```

可以看到，未注册包的依赖项（此处为 `MacroTools`）已被添加。对于未注册包，我们可以使用 `#` 来给定一个分支（或 commit SHA）来进行跟踪，就像已注册包一样。


#### 添加本地包

我们可以将一个 git 存储库的本地路径传给 `add` 而不是其 URL，其效果类似于传 URL。该本地存储库（的某个分支）会被跟踪，并在包更新时从已拉取的本地存储库中获取更新。请注意，本地包存储库中的文件更改不会在包加载时立即反映出来。为了拉取更改，必须提交该更改并更新包。

#### 开发包

仅使用 `add` 会让你的清单始终为「可再现状态」，换句话说，只要所使用的存储库和注册表仍然可以访问，就可以检索出项目中所有依赖项的确切状态。这样做的好处是你可以将你的项目（`Project.toml` 和 `Manifest.toml`）发送该其他人，然后他们可以该项目「实例化」到与你本地项目相同的状态。但是，当你在开发包时，在某个路径上以当前状态加载包会更方便。因此，命令 `dev` 有存在必要。

让我们来尝试 `dev` 一个已注册的包：

```
(v0.7) pkg> dev Example
  Updating git-repo `https://github.com/JuliaLang/Example.jl.git`
 Resolving package versions...
  Updating `~/.julia/environments/v0.7/Project.toml`
  [7876af07] + Example v0.5.1+ [`~/.julia/dev/Example`]
  Updating `~/.julia/environments/v0.7/Manifest.toml`
  [7876af07] + Example v0.5.1+ [`~/.julia/dev/Example`]
```

`dev` 命令会获取包的完整克隆到 `~/.julia/dev/` 目录下（可通过设置环境变量 `JULIA_PKG_DEVDIR` 来更改此路径）。在导入 `Example` 时，julia 现在将从 `~/.julia/dev/Example` 导入它，并且该路径下文件的所有本地更改都将反映在加载的代码中。在使用 `add` 时，我们说我们跟踪了包存储库，在这里则说我们跟踪了路径本身。请注意，包管理器永远不会触碰已跟踪路径上的任何文件。因此，需要你自己拉取更新、更改分支等。如果我们尝试 `dev` 包的某个已经存在于 `~/.julia/dev/` 里的分支，则包管理器只会使用已存在的路径。例如：

```
(v0.7) pkg> dev Example
  Updating git-repo `https://github.com/JuliaLang/Example.jl.git`
[ Info: Path `/Users/kristoffer/.julia/dev/Example` exists and looks like the correct package, using existing path instead of cloning
```

请注意，info 信息表明它正在使用现有路径。一般来说，包管理器不会触碰正在跟踪的路径文件。

如果在本地路径上使用 `dev`，则该包的路径会被记录并在该包加载时使用之。除非该路径以绝对路径的形式给出，否则它会以相对于项目文件的形式记录下来。

要停止跟踪路径并再次使用已注册版本，请使用 `free`

```
(v0.7) pkg> free Example
 Resolving package versions...
  Updating `~/.julia/environments/v0.7/Project.toml`
  [7876af07] ↓ Example v0.5.1+ [`~/.julia/dev/Example`] ⇒ v0.5.1
  Updating `~/.julia/environments/v0.7/Manifest.toml`
  [7876af07] ↓ Example v0.5.1+ [`~/.julia/dev/Example`] ⇒ v0.5.1
```

值得提及的是，通过使用 `dev`，你的项目现在具有其内在状态。其状态取决于该路径中文件的当前内容，并且在不知道所跟踪路径中所有包的确切内容的情况下，其他人无法「实例化」清单。

Note that if you add a dependency to a package that tracks a local path, the Manifest (which contains the whole dependency graph) will become
out of sync with the actual dependency graph. This means that the package will not be able to load that dependency since it is not recorded
in the Manifest. To update sync the Manifest, use the REPL command `resolve`.

### 删除包

通过使用 `pkg> rm Package`，可从当前项目中删除包。这只会删除已存在于项目中的包，要删除仅作为依赖项的包，请使用 `pkg> rm --manifest DepPackage`。请注意，这会删除所有依赖于 `DepPackage` 的包。

### 更新包

当项目正在使用的包发布新版本时，最好进行更新。简单地调用 `up` 会尝试将项目的*所有*依赖项更新到最新的兼容版本。有时这并不是你想要的。通过将依赖项子集作为参数传给 `up`，你可以指定要升级的依赖项，例如

```
(v0.7) pkg> up Example
```

所有其他包直接依赖项的版本会保持不变。如果你为了降低项目中断的风险，只想要更新包的次版本号，你可以加上 `--minor` 标志，例如：

```
(v0.7) pkg> up --minor Example
```

跟踪存储库的包在进行次要更新时不会被更新，而跟踪路径的包永远不会被包管理器所触及。

### Pinning a package

A pinned package will never be updated. A package can be pinned using `pin` as for example

```
(v0.7) pkg> pin Example
 Resolving package versions...
  Updating `~/.julia/environments/v0.7/Project.toml`
  [7876af07] ~ Example v0.5.1 ⇒ v0.5.1 ⚲
  Updating `~/.julia/environments/v0.7/Manifest.toml`
  [7876af07] ~ Example v0.5.1 ⇒ v0.5.1 ⚲
```

Note the pin symbol `⚲` showing that the package is pinned. Removing the pin is done using `free`

```
(v0.7) pkg> free Example
  Updating `~/.julia/environments/v0.7/Project.toml`
  [7876af07] ~ Example v0.5.1 ⚲ ⇒ v0.5.1
  Updating `~/.julia/environments/v0.7/Manifest.toml`
  [7876af07] ~ Example v0.5.1 ⚲ ⇒ v0.5.1
```

### 测试包

包的测试可通过 `test` 命令来运行：

```
(v0.7) pkg> test Example
   Testing Example
   Testing Example tests passed
```

### 构建包

第一次安装某个包时，会自动执行该包的构建步骤。构建过程的输出会被重定向到文件中。要显式执行包的构建步骤，请使用 `build` 命令：

```
(v0.7) pkg> build MbedTLS
  Building MbedTLS → `~/.julia/packages/MbedTLS/h1Vu/deps/build.log`

shell> cat ~/.julia/packages/MbedTLS/h1Vu/deps/build.log
┌ Warning: `wait(t::Task)` is deprecated, use `fetch(t)` instead.
│   caller = macro expansion at OutputCollector.jl:63 [inlined]
└ @ Core OutputCollector.jl:63
...
[ Info: using prebuilt binaries
```

## Creating your own projects

So far we have added packages to the default project at `~/.julia/environments/v0.7`, it is, however, easy to create other, independent, projects.
It should be pointed out if two projects uses the same package at the same version, the content of this package is not duplicated.
In order to create a new project, create a directory for it and then activate that directory to make it the "active project" which package operations manipulate:

```
shell> mkdir MyProject

shell> cd MyProject
/Users/kristoffer/MyProject

(v0.7) pkg> activate .

(MyProject) pkg> st
    Status `Project.toml`
```

Note that the REPL prompt changed when the new project is activated. Since this is a newly created project, the status command show it contains no packages, and in fact, it has no project or manifest file until we add a package to it:

```
shell> ls -l
total 0

(MyProject) pkg> add Example
  Updating registry at `~/.julia/registries/General`
  Updating git-repo `https://github.com/JuliaRegistries/General.git`
 Resolving package versions...
  Updating `Project.toml`
  [7876af07] + Example v0.5.1
  Updating `Manifest.toml`
  [7876af07] + Example v0.5.1
  [8dfed614] + Test

shell> ls -l
total 8
-rw-r--r-- 1 stefan staff 207 Jul  3 16:35 Manifest.toml
-rw-r--r-- 1 stefan staff  56 Jul  3 16:35 Project.toml

shell> cat Project.toml
[deps]
Example = "7876af07-990d-54b4-ab0e-23690620f79a"

shell> cat Manifest.toml
[[Example]]
deps = ["Test"]
git-tree-sha1 = "8eb7b4d4ca487caade9ba3e85932e28ce6d6e1f8"
uuid = "7876af07-990d-54b4-ab0e-23690620f79a"
version = "0.5.1"

[[Test]]
uuid = "8dfed614-e22c-5e08-85e1-65c5234f0b40"
```

This new environment is completely separate from the one we used earlier.

## 垃圾收集旧的、不再使用的包

随着包的更新和项目被删除，曾经使用的已安装的包将不可避免地变旧，并且不被用于任何现有项目。Pkg 会记录所有已使用项目的日志，这样便可通过遍历日志，明确知道哪些项目仍然存在以及这些项目使用了哪些包，剩下的包则会被删除。命令 `gc` 可执行此操作：

```
(v0.7) pkg> gc
    Active manifests at:
        `/Users/kristoffer/BinaryProvider/Manifest.toml`
        ...
        `/Users/kristoffer/Compat.jl/Manifest.toml`
   Deleted /Users/kristoffer/.julia/packages/BenchmarkTools/1cAj: 146.302 KiB
   Deleted /Users/kristoffer/.julia/packages/Cassette/BXVB: 795.557 KiB
   ...
   Deleted /Users/kristoffer/.julia/packages/WeakRefStrings/YrK6: 27.328 KiB
   Deleted 36 package installations: 113.205 MiB
```

请注意，只有在 `~/.julia/packages` 中的包才会被删除。

## Creating your own packages

A package is a project with a `name`, `uuid` and `version` entry in the `Project.toml` file `src/PackageName.jl` file that defines the module `PackageName`.
This file is executed when the package is loaded.

### Generating files for a package

To generate files for a new package, use `pkg> generate`.

```
(v0.7) pkg> generate HelloWorld
```

This creates a new project `HelloWorld` with the following files (visualized with the external [`tree` command](https://linux.die.net/man/1/tree)):

```jl
shell> cd HelloWorld

shell> tree .
.
├── Project.toml
└── src
    └── HelloWorld.jl

1 directory, 2 files
```

The `Project.toml` file contains the name of the package, its unique UUID, its version, the author and eventual dependencies:

```toml
name = "HelloWorld"
uuid = "b4cd1eb8-1e24-11e8-3319-93036a3eb9f3"
version = "0.1.0"
author = ["Some One <someone@email.com>"]

[deps]
```

The content of `src/HelloWorld.jl` is:

```jl
module HelloWorld

greet() = print("Hello World!")

end # module
```

We can now activate the project and load the package:

```jl
pkg> activate .

julia> import HelloWorld

julia> HelloWorld.greet()
Hello World!
```

### Adding dependencies to the project

Let’s say we want to use the standard library package `Random` and the registered package `JSON` in our project.
We simply `add` these packages (note how the prompt now shows the name of the newly generated project,
since we are inside the `HelloWorld` project directory):

```
(HelloWorld) pkg> add Random JSON
 Resolving package versions...
  Updating "~/Documents/HelloWorld/Project.toml"
 [682c06a0] + JSON v0.17.1
 [9a3f8284] + Random
  Updating "~/Documents/HelloWorld/Manifest.toml"
 [34da2185] + Compat v0.57.0
 [682c06a0] + JSON v0.17.1
 [4d1e1d77] + Nullables v0.0.4
 ...
```

Both `Random` and `JSON` got added to the project’s `Project.toml` file, and the resulting dependencies got added to the `Manifest.toml` file.
The resolver has installed each package with the highest possible version, while still respecting the compatibility that each package enforce on its dependencies.

We can now use both `Random` and `JSON` in our project. Changing `src/HelloWorld.jl` to

```
module HelloWorld

import Random
import JSON

greet() = print("Hello World!")
greet_alien() = print("Hello ", Random.randstring(8))

end # module
```

and reloading the package, the new `greet_alien` function that uses `Random` can be used:

```
julia> HelloWorld.greet_alien()
Hello aT157rHV
```

### Adding a build step to the package.

The build step is executed the first time a package is installed or when explicitly invoked with `build`.
A package is built by executing the file `deps/build.jl`.

```
shell> cat deps/build.log
I am being built...

(HelloWorld) pkg> build
  Building HelloWorld → `deps/build.log`
 Resolving package versions...

shell> cat deps/build.log
I am being built...
```

If the build step fails, the output of the build step is printed to the console

```
shell> cat deps/build.jl
error("Ooops")

(HelloWorld) pkg> build
  Building HelloWorld → `deps/build.log`
 Resolving package versions...
┌ Error: Error building `HelloWorld`:
│ ERROR: LoadError: Ooops
│ Stacktrace:
│  [1] error(::String) at ./error.jl:33
│  [2] top-level scope at none:0
│  [3] include at ./boot.jl:317 [inlined]
│  [4] include_relative(::Module, ::String) at ./loading.jl:1071
│  [5] include(::Module, ::String) at ./sysimg.jl:29
│  [6] include(::String) at ./client.jl:393
│  [7] top-level scope at none:0
│ in expression starting at /Users/kristoffer/.julia/dev/Pkg/HelloWorld/deps/build.jl:1
└ @ Pkg.Operations Operations.jl:938
```

### Adding tests to the package

When a package is tested the file `test/runtests.jl` is executed.

```
shell> cat test/runtests.jl
println("Testing...")
(HelloWorld) pkg> test
   Testing HelloWorld
 Resolving package versions...
Testing...
   Testing HelloWorld tests passed
```

#### Test-specific dependencies

Sometimes one might want to use some packages only at testing time but not
enforce a dependency on them when the package is used. This is possible by
adding dependencies to `[extras]` and a `test` target in `[targets]` to the Project file.
Here we add the `Test` standard library as a test-only dependency by adding the
following to the Project file:

```
[extras]
Test = "8dfed614-e22c-5e08-85e1-65c5234f0b40"

[targets]
test = ["Test"]
```

We can now use `Test` in the test script and we can see that it gets installed on testing:

```
shell> cat test/runtests.jl
using Test
@test 1 == 1

(HelloWorld) pkg> test
   Testing HelloWorld
 Resolving package versions...
  Updating `/var/folders/64/76tk_g152sg6c6t0b4nkn1vw0000gn/T/tmpPzUPPw/Project.toml`
  [d8327f2a] + HelloWorld v0.1.0 [`~/.julia/dev/Pkg/HelloWorld`]
  [8dfed614] + Test
  Updating `/var/folders/64/76tk_g152sg6c6t0b4nkn1vw0000gn/T/tmpPzUPPw/Manifest.toml`
  [d8327f2a] + HelloWorld v0.1.0 [`~/.julia/dev/Pkg/HelloWorld`]
   Testing HelloWorld tests passed```
```

### Compatibility

Compatibility refers to the ability to restrict what version of the dependencies that your project is compatible with.
If the compatibility for a dependency is not given, the project is assumed to be compatible with all versions of that dependency.

Compatibility for a dependency is entered in the `Project.toml` file as for example:

```toml
[compat]
Example = "0.4.3"
```

After a compatibility entry is put into the project file, `up` can be used to apply it.

The format of the version specifier is described in detail below.

!!! info
    There is currently no way to give compatibility from the Pkg REPL mode so for now, one has to manually edit the project file.

#### Version specifier format

Similar to other package managers, the Julia package manager respects [semantic versioning](https://semver.org/) (semver).
As an example, a version specifier is given as e.g. `1.2.3` is therefore assumed to be compatible with the versions `[1.2.3 - 2.0.0)` where `)` is a non-inclusive upper bound.
More specifically, a version specifier is either given as a **caret specifier**, e.g. `^1.2.3`  or a **tilde specifier** `~1.2.3`.
Caret specifiers are the default and hence `1.2.3 == ^1.2.3`. The difference between a caret and tilde is described in the next section.
The intersection of multiple version specifiers can be formed by comma separating indiviual version specifiers.

##### Caret specifiers

A caret specifier allows upgrade that would be compatible according to semver.
An updated dependency is considered compatible if the new version does not modify the left-most non zero digit in the version specifier.

Some examples are shown below.

```
^1.2.3 = [1.2.3, 2.0.0)
^1.2 = [1.2.0, 2.0.0)
^1 =  [1.0.0, 2.0.0)
^0.2.3 = [0.2.3, 0.3.0)
^0.0.3 = [0.0.3, 0.0.4)
^0.0 = [0.0.0, 0.1.0)
^0 = [0.0.0, 1.0.0)
```

While the semver specification says that all versions with a major version of 0 are incompatible with each other, we have made that choice that
a version given as `0.a.b` is considered compatible with `0.a.c` if `a != 0` and  `c >= b`.

##### Tilde specifiers

A tilde specifier provides more limited upgrade possibilities. With a tilde, only the last specified digit is allowed to increment by one.
This gives the following example.

```
~1.2.3 = [1.2.3, 1.2.4)
~1.2 = [1.2.0, 1.3.0)
~1 = [1.0.0, 2.0.0)
```

#### Inequality specifiers

Inequalities can also be used to specify version ranges:

```
>= 1.2.3 = [1.2.3,  ∞)
≥ 1.2.3 = [1.2.3,  ∞)
= 1.2.3 = [1.2.3, 1.2.3]
< 1.2.3 = [0.0.0, 1.2.2]
```


## 预编译项目

REPL 命令 `precompile` 可用于预编译项目中的所有依赖。例如，这样做可以

```
(HelloWorld) pkg> update; precompile
```

更新依赖项，然后预编译它们。

## 预览模式

如果你只想查看某个命令运行的效果，但不想更改包的状态，则可以 `preview` 该命令。例如：

```
(HelloWorld) pkg> preview add Plots
```

或

```
(HelloWorld) pkg> preview up
```

将向你展示添加 `Plots`、或者进行完全升级分别会对你的项目产生的影响。但是，这没有安装任何东西，也不会触及你的 `Project.toml` 和 `Manifest.toml`。

## 使用别人的项目

只需使用诸如 `git clone` 来克隆项目，接着 `cd` 到项目目录并调用

```
(v0.7) pkg> activate .

(SomeProject) pkg> instantiate
```

如果该项目包含了清单，则会以与该清单给定的相同状态安装包。否则，它将解析为与项目兼容的最新版本的依赖项。

## References

This section describes the "API mode" of interacting with Pkg.jl which is recommended for non-interactive usage,
in i.e. scripts. In the REPL mode packages (with associated version, UUID, URL etc) are parsed from strings,
for example, `"Package#master"`,`"Package@v0.1"`, `"www.mypkg.com/MyPkg#my/feature"`.
It is possible to use strings as arguments for simple commands in the API mode (like `Pkg.add(["PackageA", "PackageB"])`,
more complicated commands, that e.g. specify URLs or version range, uses a more structured format over strings.
This is done by creating an instance of a [`PackageSpec`](@ref) which are passed in to functions.

```@docs
PackageSpec
PackageMode
UpgradeLevel
Pkg.add
Pkg.develop
Pkg.activate
Pkg.rm
Pkg.update
Pkg.test
Pkg.build
Pkg.pin
Pkg.free
Pkg.instantiate
Pkg.resolve
Pkg.setprotocol!
```
