import { Link, useLocation } from 'react-router-dom'

export function Nav() {
  const { pathname } = useLocation()
  const onSystems = pathname.startsWith('/systems')
  const onMiddle = pathname.startsWith('/middle')
  const onTrader = !onSystems && !onMiddle

  return (
    <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-sm border-b border-ink/15">
      <div className="max-w-5xl mx-auto px-6 py-2 flex items-center justify-between gap-2 flex-wrap">
        <div className="font-hand text-ink/60 text-sm shrink-0">
          tiny illustrated guides to:
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            to="/"
            className={`pill-sketch text-sm ${
              onTrader ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            ⚡ how a trader decides
          </Link>
          <Link
            to="/systems"
            className={`pill-sketch text-sm ${
              onSystems ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            🖥️ how ETRM systems work
          </Link>
          <Link
            to="/middle"
            className={`pill-sketch text-sm ${
              onMiddle ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            🛡️ the middle office
          </Link>
        </div>
      </div>
    </nav>
  )
}
