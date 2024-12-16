# override Documenter.jl/src/Writers/HTMLWriter.jl
using Dates
import Documenter.DOM: @tags
import Documenter.Writers.HTMLWriter:
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
  1. （右上角）设置弹窗提示语
=#

"""
Renders the modal settings dialog.
渲染（右上角）设置弹窗。

修改之处标记为 XXX
https://github.com/JuliaDocs/Documenter.jl/blob/v1.8.0/src/html/HTMLWriter.jl#L913
"""
function render_settings()
    @tags div header section footer p button hr span select option label a

    theme_selector = p(
        label[".label"]("选择主题"),  # XXX
        div[".select"](
            select["#documenter-themepicker"](
                option[:value => "auto"]("Automatic (OS)"),
                (option[:value => theme](theme) for theme in THEMES)...,
            )
        )
    )

    # XXX: 使用本地时间格式
    now_full = Dates.format(now(), "Y U d E HH:MM"; locale="zh_CN")
    now_short = Dates.format(now(), "Y U d E"; locale="zh_CN")
    # XXX: 修改构建信息格式
    # EN    : This document was generated with Documenter.jl version 1.8.0 on Tuesday 12 November 2024. Using Julia version 1.11.1.
    # zh_CN : 本文档在 2024 年 11 月 12 日星期二用 Documenter.jl 1.8.0 版生成。 使用 1.11.1 版本的 Julia。
    buildinfo = p(
        "本文档在 ",
        span[".colophon-date", :title => now_full](now_short),
        "用 ",
        a[:href => "https://github.com/JuliaDocs/Documenter.jl"]("Documenter.jl"),
        " $(Documenter.DOCUMENTER_VERSION)",
        " 版生成",
        "使用 $(Base.VERSION) 版本的 Julia。"
    )

    return div["#documenter-settings.modal"](
        div[".modal-background"],
        div[".modal-card"](
            header[".modal-card-head"](
                p[".modal-card-title"]("设置"), # XXX
                button[".delete"]()
            ),
            section[".modal-card-body"](
                theme_selector, hr(), buildinfo
            ),
            footer[".modal-card-foot"]()
        )
    )
end
