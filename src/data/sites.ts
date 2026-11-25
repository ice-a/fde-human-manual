const SITES_URL =
  'https://gist.githubusercontent.com/ice-a/0160c8ccd7781e3c88d33ed7bcbe6dc5/raw/9cb6a6f39787fd5a43ea5ff53885a18c07043224/sites.json'

import fallback from '../../sites.json'

export interface SiteItem {
  name: string
  nameEn?: string
  url: string
  desc?: string
  descEn?: string
}

export interface SiteGroup {
  name: string
  nameEn?: string
  items: SiteItem[]
}

export interface SitesData {
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  groups: SiteGroup[]
}

export const fallbackSites = fallback as SitesData

export async function loadSites(): Promise<SitesData> {
  try {
    const response = await fetch(SITES_URL, { cache: 'no-store' })
    if (!response.ok) return fallbackSites
    const data = (await response.json()) as SitesData
    if (!data.title || !Array.isArray(data.groups) || !data.groups.length) return fallbackSites
    return data
  } catch {
    return fallbackSites
  }
}
