export interface SourceLicense {
  name: string
  license: string
  mode: 'full' | 'rewrite'
  note: string
  noteEn: string
}

export const sourceLicenses: SourceLicense[] = [
  {
    name: '人间防骗指南',
    license: 'CC BY-NC-SA 4.0',
    mode: 'full',
    note: '非商业转载，保留署名，二次分发沿用同一许可。',
    noteEn: 'Non-commercial reuse with attribution; adaptations keep the same license.',
  },
  {
    name: '高性价比人生指南',
    license: 'CC BY 4.0',
    mode: 'full',
    note: '允许转载与改编，需署名并注明是否修改。',
    noteEn: 'Reuse and adaptation allowed with attribution and change indication.',
  },
  {
    name: '人情世故指南',
    license: '自定义非商业许可',
    mode: 'rewrite',
    note: '许可要求公开收录须书面同意，本站仅按主题独立改写，不复制原文。',
    noteEn: 'Public republication needs written consent, so entries were rewritten by topic without copying the original text.',
  },
  {
    name: '程序员延寿指南',
    license: 'Unlicense',
    mode: 'full',
    note: '已贡献至公有领域，可自由转载。',
    noteEn: 'Released into the public domain; free to reuse.',
  },
  {
    name: '做饭指南',
    license: 'Unlicense',
    mode: 'full',
    note: '已贡献至公有领域，可自由转载。',
    noteEn: 'Released into the public domain; free to reuse.',
  },
  {
    name: '投资指南',
    license: '专有内容许可',
    mode: 'rewrite',
    note: '许可禁止抓取与翻译，本站仅按主题独立改写，不复制原文。',
    noteEn: 'Scraping and translation are prohibited, so entries were rewritten by topic without copying the original text.',
  },
  {
    name: '恋爱指南',
    license: 'MIT',
    mode: 'full',
    note: '允许再分发，需保留版权与许可声明。',
    noteEn: 'Redistribution allowed with the original copyright and license notice.',
  },
  {
    name: '人生进阶指南',
    license: 'CC BY-NC 4.0',
    mode: 'full',
    note: '非商业转载，需署名 byoungd and contributors 并注明来源。',
    noteEn: 'Non-commercial reuse with attribution to byoungd and contributors.',
  },
]
