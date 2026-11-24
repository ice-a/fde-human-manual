import { useEffect } from 'react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { LocaleProvider } from './context/LocaleContext'
import { useHashRoute } from './hooks/useHashRoute'
import { About } from './pages/About'
import { Guide } from './pages/Guide'
import { Home } from './pages/Home'

function Router() {
  const route = useHashRoute()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route.page, route.slug])

  return (
    <>
      <Header page={route.page} />
      <main id="main">
        {route.page === 'home' && <Home />}
        {route.page === 'guide' && <Guide slug={route.slug} />}
        {route.page === 'about' && <About />}
        {route.page === 'missing' && <Guide />}
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <Router />
    </LocaleProvider>
  )
}
