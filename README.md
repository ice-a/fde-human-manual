# 人间使用手册 · THE HUMAN MANUAL

> 活得明白一点，坑踩得少一点。

把八份开源人生指南整理成一份格式统一、随时可查的索引。纯静态站点，可部署到 Vercel、Cloudflare Pages、GitHub Pages 或任意静态托管。

## 站点结构

- **首页**：项目介绍、八册目录、使用方式，以及首页右侧的「一言」组件（调用 hitokoto.cn，网络不可用时自动切换为本地兜底语料）。
- **指南页**：每册一个独立页面，带侧边目录和统一格式的条目。
- **关于页**：说明项目来源，列出全部八份参考指南，并给出三平台的部署步骤。

### 统一内容格式

每条原则固定包含五个字段：

| 字段 | 作用 |
| --- | --- |
| 标题 | 一句可执行的判断 |
| 核心 | 一句话说清为什么 |
| 做法 | 2–3 条具体动作 |
| 记住 | 一句可复述的话 |
| 标签 | 2–3 个检索关键词 |

数据集中在 `src/data/guides.ts`。新增一册只需往 `guides` 数组里加一个对象，目录卡片、详情页、侧边目录和条目数会自动生成。

### 站名与品牌

全部品牌信息集中在 `src/data/references.ts` 的 `site` 对象：

```ts
export const site = {
  name: '人间使用手册',
  en: 'THE HUMAN MANUAL',
  slogan: '活得明白一点，坑踩得少一点。',
  sub: '八份开源指南，一份人生索引。',
  repo: '', // Fork 后填自己的仓库地址，导航与页脚的 GitHub 入口会自动出现
}
```

导航、页脚、首页标题、关于页宣言都会读取这里的值。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物在 dist/
npm run preview  # 预览构建结果
```

技术栈：Vite + React + TypeScript，无后端、无数据库。

`vite.config.ts` 设置了 `base: './'`，路由使用 hash（`#/guide/xxx`），因此构建产物放在任意子路径下都能直接打开，不需要服务端 rewrite。

## 部署

### Vercel

1. Fork 本仓库。
2. Vercel → Add New → Project，导入仓库。
3. Framework 选 Vite，`npm run build`，输出目录 `dist`（`vercel.json` 已写好这些值）。
4. Deploy。以后 push 自动更新。

### Cloudflare Pages

1. Fork 本仓库。
2. Workers & Pages → Create → Pages → Connect to Git。
3. 构建命令 `npm run build`，输出目录 `dist`。
4. 保存并部署。也可用 `npx wrangler pages deploy dist` 手动上传（`wrangler.toml` 已配置）。

### GitHub Pages

1. Fork 本仓库，进入 Settings → Pages。
2. Source 选择 **GitHub Actions**。
3. 仓库已附带 `.github/workflows/deploy.yml`，Push 到 `main` 或 `master` 即自动发布。
4. 访问 `https://<用户名>.github.io/<仓库名>/`。

## 参考项目

| 指南 | 地址 |
| --- | --- |
| 人间防骗指南 | https://qerssd.github.io/HowToAvoidScams/ |
| 高性价比人生指南 | https://github.com/eternity4719/howtolivebetter |
| 人情世故指南 | https://github.com/kkk-bot/HowToGetAlong |
| 程序员延寿指南 | https://github.com/geekan/HowToLiveLonger |
| 做饭指南 | https://github.com/Anduin2017/HowToCook |
| 投资指南 | https://github.com/xuchonglang/investing-for-beginners |
| 恋爱指南 | https://github.com/shengjidaguai-china/goutoujunshi |
| 人生进阶指南 | https://github.com/byoungd/up |

本站内容是上述项目的二次摘要与索引，版权与许可归各自作者。涉及健康、法律、投资的具体决定，请以原文及专业意见为准。

## 一言组件

`src/components/Hitokoto.tsx` 请求 `https://v1.hitokoto.cn/?encode=json`。请求失败（离线、跨域限制、接口变更）时自动使用 `src/data/quotes.ts` 中的本地语料，页面不会出现空白。

## 线上地址

- 正式域名：https://guide.020417.xyz
- GitHub Pages 默认地址：https://ice-a.github.io/human-manual/

## 自定义域名 DNS 设置（Cloudflare）

域名托管在 Cloudflare，只需加一条记录：

| 类型 | 名称 | 值 | 代理状态 |
| --- | --- | --- | --- |
| CNAME | guide | ice-a.github.io | DNS only |

**必须选 DNS only（灰云）**，不要开橙云代理：Cloudflare 代理会挡住 GitHub 的证书校验，
导致 Enforce HTTPS 开不了，还可能返回 520。根域 `020417.xyz` 不需要动，旧站继续保留。

Pages 的 Custom domain 和 `public/CNAME` 都是 `guide.020417.xyz`。DNS 生效后，
在仓库 Settings → Pages 勾选 Enforce HTTPS（证书签发最多可能需要 24 小时）。

## 多语言

默认简体中文，右上角可切换 English / 繁體中文，选择会保存在浏览器本地。

- 界面文案原文：`src/data/ui.ts`
- 指南与参考项目内容：沿用 `src/data/guides.ts`、`src/data/references.ts` 的简体中文
- 翻译产物：`src/data/locales/en.json`、`src/data/locales/zh-TW.json`（提交进仓库，运行时不请求翻译接口）
- 英文：`bun scripts/generate-locales.ts`（免费翻译接口，批量生成）
- 繁体：`bun scripts/generate-zh-tw.ts`（OpenCC 从简体确定性转换）

新增文案时在 `src/data/ui.ts` 加一个键，再补进两个 JSON；内容改动后重新运行翻译脚本即可。
