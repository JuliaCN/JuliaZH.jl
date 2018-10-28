# override Documenter.jl/src/Writers/HTMLWriter.jl

import Documenter: Documents, Documenter, Writers
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
=#
function Documenter.Writers.HTMLWriter.render_page(ctx, navnode)
    @tags html body

    page = getpage(ctx, navnode)

    head = render_head(ctx, navnode)
    navmenu = render_navmenu(ctx, navnode)
    article = render_article(ctx, navnode)

    htmldoc = DOM.HTMLDocument(
        # 修改 lang tag
        html[:lang=>"zh-cn"](
            head,
            body(navmenu, article)
        )
    )

    open_output(ctx, navnode) do io
        print(io, htmldoc)
    end
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

const t_Previous = "上一篇"
const t_Next     = "下一篇"

# 生成对应文件在 Transifex 上的翻译地址 
function transifex_url(rel_path)
    # 首页源文件在 GitHub 上
    if rel_path == "src\\index.md"
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

function Documenter.Writers.HTMLWriter.render_article(ctx, navnode)
    @tags article header footer nav ul li hr span a

    header_links = map(Documents.navpath(navnode)) do nn
        title = mdconvert(pagetitle(ctx, nn); droplinks=true)
        nn.page === nothing ? li(title) : li(a[:href => navhref(ctx, nn, navnode)](title))
    end

    topnav = nav(ul(header_links))

    if !ctx.doc.user.html_disable_git
        url = transifex_url(getpage(ctx, navnode).source) # 1.3: 改 URL
        if url !== nothing
            push!(topnav.nodes, a[".edit-page", :href => url](span[".fa"](t_Icon), t_Edit_on_xx)) # 1.1 & 1.2: 修改编辑翻译 icon/提示语
        end
    end
    art_header = header(topnav, hr(), render_topbar(ctx, navnode))

    # build the footer with nav links
    art_footer = footer(hr())
    if navnode.prev !== nothing
        direction = span[".direction"](t_Previous)  # 2.1: 修改翻页提示语
        title = span[".title"](mdconvert(pagetitle(ctx, navnode.prev); droplinks=true))
        link = a[".previous", :href => navhref(ctx, navnode.prev, navnode)](direction, title)
        push!(art_footer.nodes, link)
    end

    if navnode.next !== nothing
        direction = span[".direction"](t_Next)      # 2.2: 修改翻页提示语
        title = span[".title"](mdconvert(pagetitle(ctx, navnode.next); droplinks=true))
        link = a[".next", :href => navhref(ctx, navnode.next, navnode)](direction, title)
        push!(art_footer.nodes, link)
    end

    pagenodes = domify(ctx, navnode)
    article["#docs"](art_header, pagenodes, art_footer)
end
