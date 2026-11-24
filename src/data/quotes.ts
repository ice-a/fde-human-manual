export interface Quote {
  text: string
  from: string
  fromWho?: string
}

/** 网络不可用时的本地兜底，保证一言组件始终有内容。 */
export const fallbackQuotes: Quote[] = [
  { text: '认识自己，是一切指南的第一页。', from: '人间使用手册' },
  { text: '慢三分钟，可能省三年。', from: '防骗与信息安全' },
  { text: '少犯一次错，等于多赚一次。', from: '高性价比生活' },
  { text: '关系对了，话才对。', from: '人情世故' },
  { text: '关联不是因果，数字不是承诺。', from: '健康与延寿' },
  { text: '能称量的，就别靠感觉。', from: '厨房与做饭' },
  { text: '先想亏，再想赚。', from: '投资入门' },
  { text: '人先被听见，事才谈得下去。', from: '恋爱与关系' },
  { text: '做一件，算一件。', from: '人生进阶' },
]
