const POLL_URL =
  'https://gist.githubusercontent.com/ice-a/0160c8ccd7781e3c88d33ed7bcbe6dc5/raw/4972a84123c092fa522eda09e57a05eac5f2ba23/poll.json'

export interface PollData {
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  steps?: string[]
  stepsEn?: string[]
  issueUrl?: string
  formUrl?: string
  template?: string
  templateEn?: string
  voteUrl?: string
}

export const fallbackPoll: PollData = {
  title: '想看什么内容？直接提 Issue',
  titleEn: 'Want to see more of something? Open an issue',
  description: '不再投票。你想补充的主题、发现的错误或想加的案例，都可以在 GitHub Issue 里直接提交。',
  descriptionEn: 'No more polls. To request a topic, report an error or add a case, just open a GitHub issue.',
  steps: [
    '点击下方按钮打开 New Issue',
    '标题写清楚主题，例如：补充「租房押金」案例',
    '正文写清你的建议或问题，最好附上来源链接',
  ],
  stepsEn: [
    'Open the New Issue page with the button below',
    'Use a clear title, e.g. “Add more cases on rental deposits”',
    'Describe the request or problem, with a source link if you have one',
  ],
  issueUrl: 'https://github.com/ice-a/human-manual/issues/new',
  formUrl: '',
  template: '想补充的主题：\n具体建议：\n来源链接（可选）：',
  templateEn: 'Topic to add:\nSuggestion:\nSource link (optional):',
}

export async function loadPoll(): Promise<PollData> {
  try {
    const response = await fetch(POLL_URL, { cache: 'no-store' })
    if (!response.ok) return fallbackPoll
    const data = (await response.json()) as PollData
    if (!data.title) return fallbackPoll
    return data
  } catch {
    return fallbackPoll
  }
}
