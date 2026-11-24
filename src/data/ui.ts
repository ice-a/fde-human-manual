/** 所有界面文案的简体中文原文。翻译脚本以此为输入生成 en / zh-TW 语言包。 */
export const ui: Record<string, string> = {
  'nav.guide': '指南',
  'nav.about': '关于',

  'hero.eyebrow': 'OPEN SOURCE · LIFE INDEX',
  'hero.desc':
    '八份开源指南，一份人生索引。把散落在开源社区里的防骗、健康、人际、金钱与成长经验，整理成一套格式统一、随时可查的条目。不是成功学，是一份能翻的手册。',
  'hero.cta.primary': '浏览八册指南',
  'hero.cta.secondary': '这本手册从哪来',
  'hero.meta.volumes': '册指南',
  'hero.meta.principles': '条原则',
  'hero.meta.opensource': '开源可部署',

  'quote.tab': '一言 · HITOKOTO',
  'quote.label': 'DAILY WORD · 每日一句',
  'quote.refresh': '换一句',

  'catalog.title': '八册指南',
  'catalog.en': 'THE EIGHT VOLUMES',
  'catalog.lead':
    '每一册对应一份开源指南，条目统一写成「一句判断 + 具体做法 + 一句记住」。点开任意一册，即可按目录查阅。',
  'card.principles': '条原则',

  'how.title': '怎么用',
  'how.en': 'HOW TO USE',
  'how.step1.no': '01 / 03',
  'how.step1.title': '先看目录',
  'principle.remember': '记住：',

  'how.step1.text':
    '八册指南按主题分开，每册都是独立入口。先找到你现在真正关心的那一本，不必从头读到尾。',
  'how.step2.no': '02 / 03',
  'how.step2.title': '再找条目',
  'how.step2.text': '每条原则都有核心判断、具体做法和一句可记住的话。用目录快速跳转，当作工具书来查。',
  'how.step3.no': '03 / 03',
  'how.step3.title': '去做一件',
  'how.step3.text': '挑一条今天就能执行的最小动作。做完再回来看下一条，指南的价值只在被用起来的时候才成立。',

  'closing1.eyebrow': 'A NOTE FROM THE EDITOR',
  'closing1.line': '没有一种活法适用于所有人。\n但有人把坑标了出来，你就不必再踩一遍。',
  'closing1.link': '看看这些指南从哪里来',

  'guide.back': '← 返回目录',
  'guide.stamp': '条原则',
  'guide.index': 'INDEX / 目录',
  'guide.source.prefix': '本册内容整理自',
  'guide.source.suffix':
    '。原文持续更新，条目可能与原文存在差异；涉及健康、法律、投资的具体决定，请以原文和专业意见为准。',
  'guide.source.link': '查看原始项目 ↗',
  'guide.missing.eyebrow': '404 · NOT FOUND',
  'guide.missing.title': '这一册还没有写',
  'guide.missing.desc': '目录里没有找到对应的指南。',
  'guide.missing.cta': '返回目录',

  'about.eyebrow': 'ABOUT THIS MANUAL',
  'about.title': '关于这本手册',
  'about.lead':
    '这是一份索引，不是原创的人生理论。它把八份开源指南里最可复用的部分压缩成条目，用同一种格式排好，方便随时查、随手改、部署到自己的域名下。',
  'about.why.title': '为什么做',
  'about.why.en': 'WHY IT EXISTS',
  'about.why1.no': '01 / 为什么',
  'about.why1.title': '好指南太散',
  'about.why1.text':
    '这些项目各自写得很好，但分散在不同仓库和站点里。想查一件事，往往要先想起来「这事该去哪本找」。',
  'about.why2.no': '02 / 怎么做',
  'about.why2.title': '格式先统一',
  'about.why2.text':
    '把不同写法压成同一套：一句判断、具体做法、一句记住、几个标签。格式一致，查阅速度才快。',
  'about.why3.no': '03 / 边界',
  'about.why3.title': '索引不是原文',
  'about.why3.text': '这里是压缩后的二次整理，不替代原始项目。每册末尾都留了原文入口，判断有争议时回到源头。',

  'about.sources.title': '参考的八份指南',
  'about.sources.en': 'THE SOURCES',
  'about.sources.lead': '全部内容整理自以下开源项目。版权与许可归各自作者所有，此处仅做摘要与索引。',

  'about.deploy.title': '部署到你自己的站点',
  'about.deploy.en': 'DEPLOY ANYWHERE',
  'about.deploy.lead':
    '纯静态站点，构建产物只有 dist 目录。使用相对路径与 hash 路由，因此放在根目录或项目子目录都能正常打开。',
  'about.deploy.vercel.0': 'Fork 本仓库到自己的 GitHub 账号。',
  'about.deploy.vercel.1': '在 Vercel 选择 Add New → Project，导入该仓库。',
  'about.deploy.vercel.2': 'Framework 选 Vite；构建命令 npm run build，输出目录 dist。',
  'about.deploy.vercel.3': '点击 Deploy。之后每次 push 都会自动重新发布。',
  'about.deploy.cloudflare.0': 'Fork 本仓库。',
  'about.deploy.cloudflare.1': '进入 Workers & Pages → Create → Pages → Connect to Git。',
  'about.deploy.cloudflare.2': '构建命令填 npm run build，输出目录填 dist。',
  'about.deploy.cloudflare.3': '保存并部署；仓库根目录的 _redirects 已随构建产物带上。',
  'about.deploy.github.0': 'Fork 本仓库，进入 Settings → Pages。',
  'about.deploy.github.1': 'Source 选择 GitHub Actions。',
  'about.deploy.github.2': '仓库已附带 .github/workflows/deploy.yml，无需再建文件。',
  'about.deploy.github.3': '推送一次代码，即发布到 https://<用户名>.github.io/<仓库名>/。',
  'about.notice':
    '想改成自己的品牌：只需改 src/data/references.ts 里的 site 对象（站名、slogan、仓库地址），以及 src/data/guides.ts 里的条目。导航、页脚、首页标题都会自动跟着变。',

  'closing2.eyebrow': 'THE END OF THE MANUAL',
  'closing2.line': '人间使用手册不会替你做决定。\n它只在你要做决定时，让相关信息更容易被找到。',
  'closing2.link': '回到目录',

  'footer.catalog': '指南目录',
  'footer.about': '关于与部署',
  'footer.github': 'GITHUB 源码 ↗',
  'footer.credit': '内容整理自开源社区，仅供学习参考',
  'footer.tagline': 'MADE FOR A CLEARER LIFE',

  'lang.label': '语言',
}
