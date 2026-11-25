import { useEffect, useState } from 'react'

export type Route = {
  page: 'home' | 'guide' | 'about' | 'sites' | 'missing'
  slug?: string
}


function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [first, second] = raw.split('/')

  if (first === 'guide' && second) return { page: 'guide', slug: second }
  if (first === 'about') return { page: 'about' }
  if (first === 'sites') return { page: 'sites' }
  if (first === '') return { page: 'home' }
  return { page: 'missing' }
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash)

  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}
