---
title: 编写文章
icon: mingcute:edit-4-line
createTime: 2024/03/04 10:06:06
permalink: /guide/write/
tags:
  - 指南
  - 快速开始
---

VuePress 支持完整的 [Markdown 语法](../markdown/basic.md),
以及使用 [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f)
定义 frontmatter 页面元数据，例如 标题和创建时间。

主题还对 Markdown 语法进行了 [扩展](../markdown/extensions.md) 支持。你还可以直接在
Markdown 中写 HTML ，或者使用 Vue 组件。

## Frontmatter

你可以通过设置 frontmatter 中的值来自定义 VuePress 里每个页面。
Frontmatter 是你的文件顶部在 `---` 中间的部分。

```md title="post.md"
<!--[!code ++:5]-->
---
title: 文章标题
createTime: 2024/09/08 22:53:34
permalink: /article/9eh4d6ao/
---

页面内容在第二个 `---` 后面。
```

::: details 什么是 frontmatter？
frontmatter 是一个 [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) 格式的配置内容，被放置于 markdown 文件的顶部，通过 `---` 来分隔。

您可以阅读 [这篇文章](../../../../4.教程/frontmatter.md) 了解如何正确书写 frontmatter。
:::

## 自动生成 Frontmatter

默认配置下，主题在启动开发服务后，会帮助为源目录中的 markdown 文件，生成一些 `frontmatter` 配置。
这些配置包括： __标题__, __创建时间__ 以及 __永久链接__。

一方面，这可以减少 内容创作者 的一些重复工作；另一方面，这些配置也为主题后续的其他功能提供了前置支持。

```md
---
title: 标题
createTime: 2024/09/08 22:53:34
permalink: /article/9eh4d6ao/
---
```

### 标题

主题默认 使用文件名作为文章标题。在解析 文件名 时，[文件命名约定](#文件夹命名约定) 所命名的文件名如
`1.我的文章.md`，其中 `1.` 和 `.md` 部分将被裁剪，最终文章标题为 `我的文章` 。

### 创建时间

主题默认使用文件创建时间作为文章创建时间，并将其格式化为 `yyyy/MM/dd HH:mm:ss`。

### 永久链接

__永久链接__ 指的是，文章发布后的 访问地址，这个地址一旦生成，只要您不手动修改它，即使文件路径、文件名发生改变也不会改变。

提前准备好 __永久链接__ 是比较有价值的，一方面，它可以帮助改善 站点的 SEO，避免收录的地址频繁变动；
另一方面，主题使用一套规范 生成 __永久链接__ ，它使得整个站点的 链接 风格一致。

- __博客文章__

  对于 博客文章，默认使用 `/article/` 作为永久链接的前缀，然后使用 [`nanoid`](https://github.com/ai/nanoid)
  生成长度为 `8` 的随机字符串进行拼接，作为文章的永久链接， 如 `/article/9eh4d6ao/`。

  对于链接前缀，还可以通过修改 [主题配置 > article](../../config/theme.md#article) 替换默认的 `/article/`。

- __notes__

  对于 notes , 主题使用更为灵活的自定义方案，你可以在 [notes > note.link](../../config/notes.md#配置) 声明不同的
  note 的链接前缀，然后同样适用  [`nanoid`](https://github.com/ai/nanoid)
  生成长度为 `8` 的随机字符串进行拼接，作为 note 文章的永久链接。

### 禁用自动生成

你可能不想主题做额外的自动生成，希望由自己完全掌控。这完全没问题，主题支持通过配置来控制 自动生成 frontmatter 的行为。
通过 [主题配置 > autoFrontmatter](../../config/theme.md#autofrontmatter) 即可轻松做到。

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // 完全禁用所有自动生成
    // autoFrontmatter: false,

    // 控制部分自动生成
    autoFrontmatter: {
      permalink: true, // 是否生成永久链接
      createTime: true, // 是否生成创建时间
      title: true, // 是否生成标题
    }
  })
})
```

## 约定

::: info 提示
以下内容，以 [项目结构](./project-structure.md) 中的文件结构作为基准。
:::

使用本主题编写文章是一件很轻松的事情，你可以在 `docs`目录中按照你的个人命名喜好新建任意名字的`Markdown`文件。

### 文件夹命名约定

对于 `docs` 中的文件夹命名，主题有一套简单的约定。

- 文件夹的名称将作为 `category` 即 __分类__。
- 允许多级目录，子级目录将作为父目录对应的分类的子项。
- 如果目录名称 在 [主题配置 notes](../../config/notes.md) 中声明用于 notes 文章管理，则默认不作为 分类目录。

由于文件夹名称将作为分类名称，且不在主题配置中进行排序配置，对于有排序需要的场景，使用以下规则进行命名：

``` ts :no-line-numbers
const dir = /\d+\.[\s\S]+/
// 即 数字 + . + 分类名称
// 如： 1.前端
```

数字将作为 __排序__ 的依据。 如果不带数字，则以默认的规则进行排序。

__example:__

::: file-tree

- docs
  - 1.前端
    - 1.html/
    - 2.css/
    - 3.javascript/
  - 2.后端/
  - 运维/
:::

主题将根据 目录结构，生成一个 分类页。

### 文件命名约定

- __博客文章__

  对于 __博客文章__ 的名称，主题没有任何约定，你可以任意命名。博客文章默认排序规则仅根据文件创建时间进行排序。
  你还可以通过 [frontmatter > sticky](../../config/frontmatter/post.md#sticky) 配置文章是否置顶。

- __notes__

  对于 __notes__ 中的 markdown 文件名称，依然遵循 与 [文件夹命名约定](#文件夹命名约定) 相同的规则。
  这可以为 notes 的 [自动生成侧边栏](../../config/notes.md#自动生成侧边栏) 提供排序依据。

## 文章写作

你可以使用 `markdown` 语法开始在 `docs` 下新建 `Markdown` 文件，编写你自己的文章了，
关于 markdown 扩展的功能支持，请查看 [这个文档](../markdown/extensions.md)

由于主题默认会为文章 的 `frontmatter` 自动生成一个 `title`，因此，文章内容的主体部分的标题，起始应该从 `h2` 即
`## 二级标题` 开始。如果您禁用了 `autoFrontmatter.title`，那么应该使用 `h1` 即 `# 一级标题` 开始。

### 标签

通过 `frontmatter.tags` 可以为文章添加标签。

```md
---
title: 我的文章
tags:
  - 标签 1
  - 标签 2
---
```
