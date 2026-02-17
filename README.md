# 限制解除！ — Leo's Astro Blog

Astro 5 + React 19 + Tailwind CSS v4 + shadcn/ui cyberpunk blog.

## Commands

| Command          | Action                                      |
| :--------------- | :------------------------------------------ |
| `pnpm install`   | Install dependencies                        |
| `pnpm dev`       | Start dev server at `localhost:4321`         |
| `pnpm build`     | Build production site to `./dist/`           |
| `pnpm preview`   | Preview build locally                       |

## Writing Blog Posts

每篇文章是 `src/content/blog/` 下的一个子目录，目录名即 URL slug：

```
src/content/blog/
  ├── my-post/
  │   ├── index.mdx       # 文章内容
  │   ├── cover.jpg        # 封面图
  │   └── screenshot.png   # 正文插图
  ├── another-post/
  │   └── index.mdx        # 无封面 → 自动 waifu 随机图
  ...
```

### Frontmatter

```yaml
---
title: '文章标题'
description: '文章简介'
pubDate: 2026-02-16
tags: ['tag1', 'tag2']
cover: ./cover.jpg
---
```

| Field         | Required | Description                          |
| :------------ | :------- | :----------------------------------- |
| `title`       | Yes      | 文章标题                              |
| `description` | Yes      | 简短描述，用于卡片和 SEO              |
| `pubDate`     | Yes      | 发布日期 `YYYY-MM-DD`                |
| `tags`        | No       | 标签数组，默认 `[]`                   |
| `draft`       | No       | 设为 `true` 则不发布，默认 `false`    |
| `cover`       | No       | 封面图相对路径                        |

### Cover Image (封面图)

#### 1. 本地图片 — 与文章同目录（推荐）

```yaml
cover: ./cover.jpg
```

把图片放在文章同目录下，用 `./` 相对路径引用。Astro 会自动优化（生成 webp、多尺寸 srcset）。

#### 2. 不设置 — 自动使用 waifu 随机图

如果不提供 `cover` 字段，构建时会自动从 [waifu.pics API](https://waifu.pics) 获取一张随机二次元图片。每次 build 会重新获取。

### Images in Post Content (正文插图)

```mdx
{/* 同目录图片 */}
![alt text](./screenshot.png)

{/* public/ 目录图片 */}
![alt text](/images/diagram.png)

{/* 外部图片 */}
![alt text](https://example.com/photo.jpg)
```

### Creating a New Post

```bash
# 1. 创建目录
mkdir src/content/blog/my-new-post

# 2. 创建文章文件
# src/content/blog/my-new-post/index.mdx

# 3. (可选) 放入封面图和插图到同目录
# src/content/blog/my-new-post/cover.jpg
# src/content/blog/my-new-post/diagram.png
```
