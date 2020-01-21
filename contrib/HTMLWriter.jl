# override Documenter.jl/src/Writers/HTMLWriter.jl

import Documenter: Documents, Documenter, Writers, Utilities
import Documenter.Utilities.DOM: DOM, Tag, @tags
import Documenter.Writers.HTMLWriter:
    getpage,
    render_head,
    render_navmenu,
    render_article,
    open_output,
    mdconvert,
    pagetitle,
    navhref,
    render_topbar,
    domify

#=
  1. 修改 html 的 lang 属性为 zh-cn
  TODO: rm this after: https://github.com/JuliaDocs/Documenter.jl/pull/1223
=#
function Documenter.Writers.HTMLWriter.render_html(ctx, navnode, head, sidebar, navbar, article, footer, scripts::Vector{DOM.Node}=DOM.Node[])
    @tags html body div
    DOM.HTMLDocument(
        html[:lang=>"zh-cn"](
            head,
            body(
                div["#documenter"](
                    sidebar,
                    div[".docs-main"](navbar, article, footer),
                    render_settings(ctx),
                ),
            ),
            scripts...
        )
    )
end

#=
  1. 修改编辑翻译提示语
    - 改 icon 为 FontAwesome: fa-globe(f0ac)
    - 改 "Edit on Github" 为 “完善 Transifex 上的翻译"
    - 改为对应的 Transifex URL
  2. 修改前后翻页提示语
    - "Previous" => t_Previous
    - "Next" => t_Next
=#

const t_Edit_on_xx = " 完善 Transifex 上的翻译" # 开头加空格，避免与 icon 靠太近
const t_Icon = "\uf0ac" # fa-globe

# const t_Previous = "上一篇"
# const t_Next     = "下一篇"

# 生成对应文件在 Transifex 上的翻译地址
function transifex_url(rel_path)
    # 首页源文件在 GitHub 上
    if splitdir(rel_path) == splitdir("src/index.md")
        return "https://github.com/JuliaCN/JuliaZH.jl/blob/master/doc/src/index.md"
    end

    # rel_path => "src\\manual\\getting-started.md"

    paths, file_name = splitdir(rel_path)
    # paths     => "src\\manual"
    # file_name => "getting-started.md"

    _, parent_fold = splitdir(paths)
    # parent_fold => "manual"

    page_name = replace(file_name, '.' => "")
    # page_name => "getting-startedmd"

    # final URL =>
    #   "https://www.transifex.com/juliacn/manual-zh_cn/translate/#zh_CN/getting-startedmd"
    "https://www.transifex.com/juliacn/$parent_fold-zh_cn/translate/#zh_CN/$page_name"
end



# workaround on Documenter/#977
function Documenter.Writers.HTMLWriter.render_navbar(ctx, navnode, edit_page_link::Bool)
    @tags div header nav ul li a span

    # The breadcrumb (navigation links on top)
    navpath = Documents.navpath(navnode)
    header_links = map(navpath) do nn
        title = mdconvert(pagetitle(ctx, nn); droplinks=true)
        nn.page === nothing ? li(a[".is-disabled"](title)) : li(a[:href => navhref(ctx, nn, navnode)](title))
    end
    header_links[end] = header_links[end][".is-active"]
    breadcrumb = nav[".breadcrumb"](
        ul[".is-hidden-mobile"](header_links),
        ul[".is-hidden-tablet"](header_links[end]) # when on mobile, we only show the page title, basically
    )

    # The "Edit on GitHub" links and the hamburger to open the sidebar (on mobile) float right
    navbar_right = div[".docs-right"]

    # Set the logo and name for the "Edit on.." button.
    if edit_page_link && (ctx.settings.edit_link !== nothing) && !ctx.settings.disable_git
        host_type = Utilities.repo_host_from_url(ctx.doc.user.repo)
        logo = t_Icon

        pageurl = get(getpage(ctx, navnode).globals.meta, :EditURL, getpage(ctx, navnode).source)
        edit_branch = isa(ctx.settings.edit_link, String) ? ctx.settings.edit_link : nothing
        
        # 1.3: 改 URL
        url = transifex_url(getpage(ctx, navnode).source)
        if url !== nothing
            title = t_Edit_on_xx
            push!(navbar_right.nodes,
                a[".docs-edit-link", :href => url, :title => title](
                    span[".docs-icon.fab"](logo),
                    span[".docs-label.is-hidden-touch"](title)
                )
            )
        end
    end

    # Settings cog
    push!(navbar_right.nodes, a[
        "#documenter-settings-button.docs-settings-button.fas.fa-cog",
        :href => "#", :title => "Settings",
    ])

    # Hamburger on mobile
    push!(navbar_right.nodes, a[
        "#documenter-sidebar-button.docs-sidebar-button.fa.fa-bars.is-hidden-desktop",
        :href => "#"
    ])

    # Construct the main <header> node that should be the first element in div.docs-main
    header[".docs-navbar"](breadcrumb, navbar_right)
end