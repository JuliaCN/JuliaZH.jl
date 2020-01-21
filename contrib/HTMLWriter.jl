# override Documenter.jl/src/Writers/HTMLWriter.jl
using Dates
import Documenter: Documents, Documenter, Writers, Utilities
import Documenter.Utilities.DOM: DOM, Tag, @tags
import Documenter.Writers.HTMLWriter:
    getpage,
    render_head,
    render_article,
    open_output,
    mdconvert,
    pagetitle,
    navhref,
    domify,
    render_settings,
    THEMES

const zh_CN_numbers = ["一", "二", "三", "四", "五", "六",
    "七", "八", "九", "十", "十一", "十二"]
const zh_CN_months = zh_CN_numbers[1:12] .* "月"

const zh_CN_months_abbrev = zh_CN_months
const zh_CN_days = [
    "周" .* zh_CN_numbers[1:6]
    "周日"
]

Dates.LOCALES["zh_CN"] = Dates.DateLocale(zh_CN_months, zh_CN_months_abbrev, zh_CN_days, [""])

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
        :href => "#", :title => "设置",
    ])

    # Hamburger on mobile
    push!(navbar_right.nodes, a[
        "#documenter-sidebar-button.docs-sidebar-button.fa.fa-bars.is-hidden-desktop",
        :href => "#"
    ])

    # Construct the main <header> node that should be the first element in div.docs-main
    header[".docs-navbar"](breadcrumb, navbar_right)
end

function render_settings(ctx)
    @tags div header section footer p button hr span select option label a

    theme_selector = p(
        label[".label"]("选择主题"),
        div[".select"](
            select["#documenter-themepicker"](option[:value=>theme](theme) for theme in THEMES)
        )
    )

    now_full = Dates.format(now(), "Y U d E HH:MM"; locale="zh_CN")
    now_short = Dates.format(now(), "Y U d E"; locale="zh_CN")
    buildinfo = p(
        "本文档在",
        span[".colophon-date", :title => now_full](now_short),
        "由",
        a[:href => "https://github.com/JuliaDocs/Documenter.jl"]("Documenter.jl"),
        "使用$(Base.VERSION)版本的Julia生成。"
    )

    div["#documenter-settings.modal"](
        div[".modal-background"],
        div[".modal-card"](
            header[".modal-card-head"](
                p[".modal-card-title"]("设置"),
                button[".delete"]()
            ),
            section[".modal-card-body"](
                theme_selector, hr(), buildinfo
            ),
            footer[".modal-card-foot"]()
        )
    )
end
