import { mkdir, writeFile } from 'node:fs/promises'
import { guides } from '../../src/data/guides'
import type { ContentSection } from '../../src/data/content'

export const REPO_RAW = 'https://raw.githubusercontent.com'

export async function fetchRaw(repo: string, branch: string, path: string): Promise<string> {
  const url = `${REPO_RAW}/${repo}/${branch}/${path}`
  const process = Bun.spawn(['curl', '-fsSL', '--max-time', '30', url], {
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const [text, error, code] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ])
  if (code !== 0) throw new Error(`fetch ${path} failed: ${error}`)
  return text
}

export async function treePaths(repo: string, branch: string): Promise<string[]> {
  const process = Bun.spawn(
    ['gh', 'api', `repos/${repo}/git/trees/${branch}?recursive=1`, '--jq', '.tree[] | select(.type=="blob") | .path'],
    { stdout: 'pipe', stderr: 'pipe' },
  )
  const [text, error, code] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ])
  if (code !== 0) throw new Error(`tree ${repo} failed: ${error}`)
  return text.trim().split('\n').filter(Boolean)
}

export function sourceUrl(repo: string, branch: string, path: string): string {
  return `https://github.com/${repo}/blob/${branch}/${path}`
}

export function slugToName(slug: string): string {
  return guides.find((guide) => guide.slug === slug)?.name ?? slug
}

export async function writeContent(slug: string, sections: ContentSection[]): Promise<void> {
  const dir = new URL('../../src/data/content/', import.meta.url)
  await mkdir(dir, { recursive: true })
  const file = new URL(`${slug}.zh-CN.json`, dir)
  await writeFile(file, `${JSON.stringify({ slug, sections }, null, 2)}\n`, 'utf8')

  const count = sections.reduce((sum, section) => sum + section.items.length, 0)
  process.stdout.write(`${slug}: ${sections.length} sections, ${count} items\n`)
}

/** 去掉行内 markdown 标记，保留纯文本（不处理代码块）。 */
export function plainText(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/\s+$/g, '')
}
