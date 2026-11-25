const POLL_URL =
  'https://gist.githubusercontent.com/ice-a/0160c8ccd7781e3c88d33ed7bcbe6dc5/raw/c4ba76fa6e3d051071f55007baa84ef7bad3f33a/poll.json'

export interface PollOption {
  id: string
  label: string
  desc: string
  labelEn?: string
  descEn?: string
}

export interface PollData {
  question: string
  questionEn?: string
  description: string
  descriptionEn?: string
  options: PollOption[]
  voteUrl: string
  formUrl?: string
  via?: string
  viaEn?: string
}

export const fallbackPoll: PollData = {
  question: '下一期最想扩充哪个主题？',
  questionEn: 'Which topic should we expand next?',
  description: '选出你最想先看的方向。投票自愿，结果用于决定下一次内容扩充。',
  descriptionEn: 'Pick the direction you would like to see first. Voting is optional and the result decides the next expansion.',
  options: [
    { id: 'law', label: '法律与权益', desc: '劳动合同、租房、消费维权的更多案例', labelEn: 'Law & Rights', descEn: 'More cases on employment, renting and consumer rights' },
    { id: 'health', label: '健康与急救', desc: '常见急症和用药常识', labelEn: 'Health & First Aid', descEn: 'Common emergencies and medication basics' },
    { id: 'invest', label: '投资入门', desc: '更多可核对的概念与风险清单', labelEn: 'Investing Basics', descEn: 'More verifiable concepts and risk checklists' },
    { id: 'family', label: '育儿与家庭', desc: '照护、教育与家庭协作', labelEn: 'Family & Care', descEn: 'Care, education and household collaboration' },
  ],
  voteUrl: 'https://github.com/ice-a/human-manual/issues/1',
  formUrl: '',
  via: 'GitHub Issue reaction 或评论',
  viaEn: 'React or comment on the GitHub Issue',
}

export async function loadPoll(): Promise<PollData> {
  try {
    const response = await fetch(POLL_URL, { cache: 'no-store' })
    if (!response.ok) return fallbackPoll
    const data = (await response.json()) as PollData
    if (!data.question || !Array.isArray(data.options) || !data.options.length) return fallbackPoll
    return data
  } catch {
    return fallbackPoll
  }
}
