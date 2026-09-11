# zhulinyv.github.io

可爱的小丫头片子酱的肥宅快乐水妹汁加工厂股份无限公司 —— 个人博客

> 这里，我们不止生产妹汁；众多软件中总有一款适合你！

本站基于 [astro-koharu](https://github.com/cosZone/astro-koharu) 模板搭建，2026-09 由原 Gridea 站点整体迁移而来。

## 迁移说明（Gridea → astro-koharu）

- **45 篇文章** 全部迁移至 `src/content/blog/`，按内容分为 4 个分类：软件 / 教程 / 项目 / 随笔；原 Gridea 标签与发布日期完整保留
- **旧链接保持可用**：老站文章地址 `/<slug>/`（如 `/NJS/`）通过 `config/redirects.json` 自动 301 到新地址 `/post/<slug>/`
- **本地图片**：`post-images/`、`images/` 已迁移到 `public/`
- **自定义页面**：番剧（`/anime`）、游戏导航（`/game`）、关于（`/about`）迁移为自定义页面；游戏本体（`/games/*`）与赞赏页（`/donate`）为纯静态资源，原样放在 `public/`
- **友链**：迁移至 `config/site.yaml` 的 `friends` 配置
- **未迁移**：`MaN/`（早晚安图片生成，PHP + MySQL 应用，GitHub Pages 无法运行）与 Gridea 的页脚自动播放音乐 iframe（已改用模板自带的 BGM 播放器，播放同一首网易云歌曲）

## 部署（GitHub Pages）

仓库自带 GitHub Actions 工作流（`.github/workflows/deploy.yml`），推送到 `main` 分支即自动构建并部署。**首次使用需要在仓库设置里把 Pages 来源切换为 GitHub Actions：**

> Settings → Pages → Build and deployment → Source: **GitHub Actions**

本地构建与预览：

```bash
pnpm install        # 需要 Node.js 22.20+ 与 pnpm 10.28.2
pnpm dev            # 本地开发 http://localhost:4321
pnpm build          # 产出静态站点到 dist/
pnpm preview        # 本地预览构建结果
```

## 写作

在 `src/content/blog/<分类>/` 下新建 Markdown 文件即可：

```markdown
---
title: 文章标题
link: url-slug        # 文章 URL，建议使用英文/拼音
date: 2026-01-01 12:00:00
description: 摘要
tags:
  - 标签
categories:
  - 软件
---

正文……
```

也可以用模板自带的 CLI：`pnpm koharu new post`。更多玩法（评论系统、加密文章、AI 摘要等）见模板文档：`GETTING-STARTED.md` 与 `src/content/blog` 内的示例（升级模板时可参考 [astro-koharu 上游仓库](https://github.com/cosZone/astro-koharu)）。

## 联系我

- 邮箱：zhulinyv2005@outlook.com
- GitHub：[zhulinyv](https://github.com/zhulinyv)

## License

主题部分遵循上游 [astro-koharu](https://github.com/cosZone/astro-koharu) 的 AGPL-3.0；文章内容版权归博主所有。
