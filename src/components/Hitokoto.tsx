import { useCallback, useEffect, useRef, useState } from 'react'
import { fallbackQuotes, type Quote } from '../data/quotes'

const API = 'https://v1.hitokoto.cn/?encode=json'

export function Hitokoto() {
  const [quote, setQuote] = useState<Quote>(fallbackQuotes[0])
  const [loading, setLoading] = useState(false)
  const [switching, setSwitching] = useState(false)
  const fallbackIndex = useRef(0)
  const timer = useRef<number | undefined>(undefined)

  const nextFallback = useCallback(() => {
    fallbackIndex.current = (fallbackIndex.current + 1) % fallbackQuotes.length
    setQuote(fallbackQuotes[fallbackIndex.current])
  }, [])

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true)
      setSwitching(true)

      try {
        const response = await fetch(`${API}&t=${Date.now()}`, { signal, cache: 'no-store' })
        if (!response.ok) throw new Error('hitokoto unavailable')

        const data = (await response.json()) as {
          hitokoto?: string
          text?: string
          from?: string
          from_who?: string | null
        }
        const content = data.hitokoto ?? data.text
        if (!content) throw new Error('empty quote')

        setQuote({
          text: content,
          from: data.from || '一言',
          fromWho: data.from_who ?? undefined,
        })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') nextFallback()
      } finally {
        setLoading(false)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setSwitching(false), 180)
      }
    },
    [nextFallback],
  )

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)
    return () => {
      controller.abort()
      window.clearTimeout(timer.current)
    }
  }, [load])

  const attribution = [quote.fromWho, quote.from].filter(Boolean).join(' · ') || '一言'

  return (
    <div className="quote-wrap enter enter--4">
      <article className="quote-card">
        <span className="quote-card__tab">一言 · HITOKOTO</span>
        <div className="quote-card__mark" aria-hidden="true">
          “
        </div>
        <p className={`quote-card__text${switching ? ' is-switching' : ''}`}>{quote.text}</p>
        <div className="quote-card__from">— {attribution}</div>
        <div className="quote-card__foot">
          <span className="quote-card__label">DAILY WORD · 每日一句</span>
          <button
            type="button"
            className="quote-card__refresh"
            onClick={() => void load()}
            disabled={loading}
            aria-label="换一句"
          >
            ↻ 换一句
          </button>
        </div>
      </article>
    </div>
  )
}
