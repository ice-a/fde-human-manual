/** 所有界面文案的简体中文原文。翻译脚本以此为输入生成 en 语言包。 */
export const ui: Record<string, string> = {
  'nav.guide': '指南',
  'nav.about': '关于',

  'hero.eyebrow': 'OPEN SOURCE · LIFE INDEX',
  'hero.desc':
    '防骗、健康、人际、法律、应急、情绪、效率、家庭与出行。十四册内容，按主题分册，点开即查。',
  'hero.cta.primary': '浏览十四册内容',
  'hero.cta.secondary': '看看有哪些内容',
  'hero.meta.volumes': '册内容',
  'hero.meta.principles': '条内容',
  'hero.meta.opensource': '内容可检索',

  'quote.tab': '一言 · HITOKOTO',
  'quote.label': 'DAILY WORD · 每日一句',
  'quote.refresh': '换一句',

  'catalog.title': '内容目录',
  'catalog.en': 'FOURTEEN VOLUMES',
  'catalog.lead':
    '十四册对应十四类生活主题。每条给一句判断、具体做法和必要的背景，可按目录跳读，也可直接搜索。',
  'card.principles': '条原则',

  'how.title': '内容特点',
  'how.en': 'WHAT INSIDE',
  'how.step1.no': '01 / 03',
  'how.step1.title': '证据与做法并列',
  'principle.remember': '记住：',

  'how.step1.text':
    '健康与金钱类条目保留证据口径、效应量和原始链接，判断有据可查，不做空口结论。',
  'how.step2.no': '02 / 03',
  'how.step2.title': '场景直接可用',
  'how.step2.text': '人际与关系类条目写成情境判断和具体说法，遇到相似场面可以直接套用。',
  'how.step3.no': '03 / 03',
  'how.step3.title': '步骤精确到克',
  'how.step3.text': '厨房类条目给出原料克数、操作顺序和判断标准，照着做就能复现。',

  'closing1.eyebrow': 'A NOTE ON THE CONTENT',
  'closing1.line': '骗局有套路，健康有证据，做饭有克数，关系有边界。\n该查的时候，翻到对应那一册。',
  'closing1.link': '内容说明',

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

  'about.eyebrow': 'ABOUT THE CONTENT',
  'about.title': '内容说明',
  'about.lead':
    '十四类生活主题：骗局拆解、健康证据、人际场景、法律权益、应急安全、情绪调节、效率工具、育儿家庭、出行旅行等。条目按主题分册，每册可搜索、可折叠、可跳读。',
  'about.why.title': '内容编排',
  'about.why.en': 'HOW IT IS ORGANIZED',
  'about.why1.no': '01 / 主题',
  'about.why1.title': '按生活场景分册',
  'about.why1.text':
    '防骗、健康、人际、金钱、厨房、关系、成长各自独立。想查哪一类，直接进对应那一册，不必从头翻到尾。',
  'about.why2.no': '02 / 条目',
  'about.why2.title': '每条都能单独读',
  'about.why2.text':
    '每条给一句核心判断、几条具体做法和一个可复述的提醒。条目之间不依赖顺序，搜到哪条就读哪条。',
  'about.why3.no': '03 / 出处',
  'about.why3.title': '保留原文入口',
  'about.why3.text':
    '条目末尾保留来源链接。需要完整论证、原始菜谱或最新规定时，可以回到原始项目核对。',

  'about.sources.title': '参考的八份指南',
  'about.sources.en': 'THE SOURCES',
  'about.sources.lead': '以下是各册内容的主题来源，版权与许可归各自作者所有。',

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
  'about.notice': '内容按主题分册，提供简体中文与英文两个版本，持续整理中。',

  'closing2.eyebrow': 'THE END OF THE COLLECTION',
  'closing2.line': '这里没有标准答案。\n只有别人踩过的坑、算过的账和写清楚的步骤。',
  'closing2.link': '回到目录',

  'footer.catalog': '指南目录',
  'footer.about': '关于与部署',
  'footer.github': 'GITHUB 源码 ↗',
  'footer.credit': '内容整理自开源社区，仅供学习参考',
  'footer.tagline': 'MADE FOR A CLEARER LIFE',

  'lang.label': '语言',
  'content.search': '搜索本册条目',
  'content.noResults': '没有匹配的条目',
  'content.expandAll': '展开全部',
  'content.collapseAll': '收起全部',
  'content.source': '原文',
  'content.featured': '导读精选',
  'content.items': '条',
  'content.loading': '正在载入内容…',
  'content.loadError': '内容载入失败，请刷新重试。',
  'about.license.title': '内容来源与许可',
  'about.license.en': 'SOURCES & LICENSES',
  'about.license.lead': '多数主题按原文收录；许可受限的主题按主题独立改写，不复制原始文字。',
  'about.license.full': '原文收录',
  'about.license.index': '主题改写',
  'content.indexOnly': '该项目许可不允许公开收录全文，此处仅提供导读与原文入口。',
}
