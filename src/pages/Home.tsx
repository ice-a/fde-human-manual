import { GuideCard } from '../components/GuideCard'
import { Hitokoto } from '../components/Hitokoto'
import { guides, totalPrinciples } from '../data/guides'
import { site } from '../data/references'

const steps = [
  {
    no: '01',
    title: '先看目录',
    text: '八册指南按主题分开，每册都是独立入口。先找到你现在真正关心的那一本，不必从头读到尾。',
  },
  {
    no: '02',
    title: '再找条目',
    text: '每条原则都有核心判断、具体做法和一句可记住的话。用目录快速跳转，当作工具书来查。',
  },
  {
    no: '03',
    title: '去做一件',
    text: '挑一条今天就能执行的最小动作。做完再回来看下一条，指南的价值只在被用起来的时候才成立。',
  },
]

export function Home() {
  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow enter enter--1">OPEN SOURCE · LIFE INDEX</div>
            <h1 className="enter enter--2">
              人间<span className="accent">使用</span>手册
            </h1>
            <p className="hero__sub enter enter--2">THE HUMAN MANUAL — VOL. 01 / 08</p>
            <p className="hero__slogan enter enter--3">{site.slogan}</p>
            <p className="hero__desc enter enter--3">
              {site.sub} 把散落在开源社区里的防骗、健康、人际、金钱与成长经验，
              整理成一套格式统一、随时可查的条目。不是成功学，是一份能翻的手册。
            </p>
            <div className="hero__actions enter enter--3">
              <button type="button" className="btn" onClick={scrollToCatalog}>
                浏览八册指南 <span className="btn__arrow" aria-hidden="true">→</span>
              </button>
              <a className="btn btn--ghost" href="#/about">
                这本手册从哪来
              </a>
            </div>
            <div className="hero__meta enter enter--4">
              <span><strong>08</strong> 册指南</span>
              <span><strong>{totalPrinciples}</strong> 条原则</span>
              <span><strong>100%</strong> 开源可部署</span>
            </div>
          </div>

          <div className="hero__art">
            <Hitokoto />
          </div>
        </div>
      </section>

      <section className="section section--rule" id="catalog">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__title">
              <h2>八册指南</h2>
            </div>
            <span className="section-head__en">THE EIGHT VOLUMES</span>
          </div>
          <p className="section-lead">
            每一册对应一份开源指南，条目统一写成「一句判断 + 具体做法 + 一句记住」。
            点开任意一册，即可按目录查阅。
          </p>
          <div className="guide-grid">
            {guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--rule">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__title">
              <h2>怎么用</h2>
            </div>
            <span className="section-head__en">HOW TO USE</span>
          </div>
          <div className="steps">
            {steps.map((step) => (
              <div className="step" key={step.no}>
                <div className="step__no">{step.no} / 03</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap">
          <p className="closing__eyebrow">A NOTE FROM THE EDITOR</p>
          <p className="closing__line">
            没有一种活法适用于所有人。
            <br />
            但有人把坑标了出来，你就不必再踩一遍。
          </p>
          <a className="closing__link" href="#/about">
            看看这些指南从哪里来 <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </>
  )
}
