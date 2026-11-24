import { useLocale } from '../context/LocaleContext'
import { locales } from '../data/i18n'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="lang-switch" role="group" aria-label="Language / 语言">
      {locales.map((item) => (
        <button
          key={item.code}
          type="button"
          className={locale === item.code ? 'is-active' : ''}
          onClick={() => setLocale(item.code)}
          aria-pressed={locale === item.code}
          title={item.label}
        >
          {item.short}
        </button>
      ))}
    </div>
  )
}
