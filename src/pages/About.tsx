import { references, site } from '../data/references'

const reasons = [
  {
    no: '01 / 为什么',
    title: '好指南太散',
    text: '这些项目各自写得很好，但分散在不同仓库和站点里。想查一件事，往往要先想起来「这事该去哪本找」。',
  },
  {
    no: '02 / 怎么做',
    title: '格式先统一',
    text: '把不同写法压成同一套：一句判断、具体做法、一句记住、几个标签。格式一致，查阅速度才快。',
  },
  {
    no: '03 / 边界',
    title: '索引不是原文',
    text: '这里是压缩后的二次整理，不替代原始项目。每册末尾都留了原文入口，判断有争议时回到源头。',
  },
]

const deploySteps = [
  {
    badge: 'platform / 01',
    title: 'Vercel',
    items: [
      'Fork 本仓库到自己的 GitHub 账号。',
      '在 Vercel 选择 Add New → Project，导入该仓库。',
      'Framework 选 Vite；构建命令 npm run build，输出目录 dist。',
      '点击 Deploy。之后每次 push 都会自动重新发布。',
    ],
  },
  {
    badge: 'platform / 02',
    title: 'Cloudflare Pages',
    items: [
      'Fork 本仓库。',
      '进入 Workers & Pages → Create → Pages → Connect to Git。',
      '构建命令填 npm run build，输出目录填 dist。',
      '保存并部署；仓库根目录的 _redirects 已随构建产物带上。',
    ],
  },
  {
    badge: 'platform / 03',
    title: 'GitHub Pages',
    items: [
      'Fork 本仓库，进入 Settings → Pages。',
      'Source 选择 GitHub Actions。',
      '仓库已附带 .github/workflows/deploy.yml，无需再建文件。',
      '推送一次代码，即发布到 https://<用户名>.github.io/<仓库名>/。',
    ],
  },
]

export function About() {
  return (
    <>
      <section className="about-hero">
        <div className="wrap">
          <p className="eyebrow">ABOUT THIS MANUAL</p>
          <h1>关于这本手册</h1>
          <p className="about-hero__lead">
            这是一份索引，不是原创的人生理论。它把八份开源指南里最可复用的部分压缩成条目，
            用同一种格式排好，方便随时查、随手改、部署到自己的域名下。
          </p>
        </div>
      </section>

      <section className="section section--rule">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__title">
              <h2>为什么做</h2>
            </div>
            <span className="section-head__en">WHY IT EXISTS</span>
          </div>
          <div className="about-grid">
            {reasons.map((reason) => (
              <div className="about-card" key={reason.no}>
                <div className="about-card__no">{reason.no}</div>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--rule">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__title">
              <h2>参考的八份指南</h2>
            </div>
            <span className="section-head__en">THE SOURCES</span>
          </div>
          <p className="section-lead">
            全部内容整理自以下开源项目。版权与许可归各自作者所有，此处仅做摘要与索引。
          </p>
          <div className="ref-list">
            {references.map((reference) => (
              <div className="ref-item" key={reference.no}>
                <span className="ref-item__no">{reference.no}</span>
                <h3>
                  <a href={reference.url} target="_blank" rel="noreferrer">
                    {reference.name} ↗
                  </a>
                </h3>
                <p>{reference.desc}</p>
                <span className="ref-item__tag">{reference.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--rule">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__title">
              <h2>部署到你自己的站点</h2>
            </div>
            <span className="section-head__en">DEPLOY ANYWHERE</span>
          </div>
          <p className="section-lead">
            纯静态站点，构建产物只有 dist 目录。使用相对路径与 hash 路由，因此放在根目录或项目子目录都能正常打开。
          </p>
          <div className="deploy-grid">
            {deploySteps.map((platform) => (
              <div className="deploy-card" key={platform.title}>
                <span className="deploy-card__badge">{platform.badge}</span>
                <h3>{platform.title}</h3>
                <ol>
                  {platform.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <div className="notice">
            想改成自己的品牌：只需改 src/data/references.ts 里的 site 对象（站名、slogan、仓库地址），
            以及 src/data/guides.ts 里的条目。导航、页脚、首页标题都会自动跟着变。
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap">
          <p className="closing__eyebrow">THE END OF THE MANUAL</p>
          <p className="closing__line">
            {site.name}不会替你做决定。
            <br />
            它只在你要做决定时，让相关信息更容易被找到。
          </p>
          <a className="closing__link" href="#/">
            回到目录 <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </>
  )
}
