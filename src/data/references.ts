export interface Reference {
  no: string
  name: string
  url: string
  desc: string
  tag: string
}

export const references: Reference[] = [
  {
    no: '01',
    name: '人间防骗指南',
    url: 'https://qerssd.github.io/HowToAvoidScams/',
    desc: '405 个真实骗局拆解，按套路、损失、受害人群分类，附核实记录与应急流程。',
    tag: '防骗',
  },
  {
    no: '02',
    name: '高性价比人生指南',
    url: 'https://github.com/eternity4719/howtolivebetter',
    desc: '772 条带成本、收益、证据等级的建议，覆盖健康、金钱、法律与低谷处境。',
    tag: '生活',
  },
  {
    no: '03',
    name: '人情世故指南',
    url: 'https://github.com/kkk-bot/HowToGetAlong',
    desc: '面向校园与职场的相处方法，含判断关键、示例话术、效果与例外情况。',
    tag: '人际',
  },
  {
    no: '04',
    name: '程序员延寿指南',
    url: 'https://github.com/geekan/HowToLiveLonger/blob/main/docs/readme/zh-CN.md',
    desc: '64 条研究记录，逐条标注效应量、置信区间、实用等级与原始文献。',
    tag: '健康',
  },
  {
    no: '05',
    name: '做饭指南',
    url: 'https://github.com/Anduin2017/HowToCook',
    desc: '程序员视角的菜谱库：原料按份量计算，步骤编号，禁用「适量」。',
    tag: '厨房',
  },
  {
    no: '06',
    name: '投资指南',
    url: 'https://github.com/xuchonglang/investing-for-beginners',
    desc: '零基础投资词条库，覆盖美股、期权、加密货币，强调风险边界与核对项。',
    tag: '金钱',
  },
  {
    no: '07',
    name: '恋爱指南',
    url: 'https://github.com/shengjidaguai-china/goutoujunshi',
    desc: '全周期关系决策工作流，强调同意与退出权、行为观察与证据强度分级。',
    tag: '关系',
  },
  {
    no: '08',
    name: '人生进阶指南',
    url: 'https://github.com/byoungd/up',
    desc: '面向失败与低谷后的恢复，用「写下问题 — 可见动作 — 复测」循环推进。',
    tag: '成长',
  },
]

export const site = {
  name: '人间使用手册',
  en: 'THE HUMAN MANUAL',
  slogan: '活得明白一点，坑踩得少一点。',
  sub: '八册内容、近两千条生活原则。',
  repo: 'https://github.com/ice-a/human-manual',
}
