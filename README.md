# SunnyMedia · 自媒体个人作品集网站

一个阳光、高饱和度风格的个人自媒体作品集网站，采用单页滚动设计。

## 技术栈

- 纯 HTML/CSS/JS，零依赖
- 移动优先响应式设计
- IntersectionObserver 滚动动画
- 数字计数动画

## 本地预览

直接在浏览器中打开 `index.html` 即可。

## 部署

### GitHub Pages
1. 创建 GitHub 仓库
2. 推送代码到 `main` 分支
3. Settings → Pages → Deploy from `main` branch

### Vercel
```bash
npm i -g vercel
vercel
```

## 自定义

- 替换 `assets/images/avatar.webp` 为个人头像
- 替换 `assets/images/about-photo.webp` 为个人照片
- 修改 `index.html` 中的个人信息、作品内容、联系方式
- 配色方案在 `:root` CSS 变量中统一修改

## 文件结构

```
├── index.html              # 全部内容（HTML+CSS+JS）
├── assets/images/
│   ├── favicon.svg         # 网站图标
│   └── works/              # 作品封面图
├── CNAME                   # 自定义域名（可选）
└── README.md
```
