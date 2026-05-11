import { Link, useLocation } from 'react-router-dom'

export function Nav() {
  const { pathname } = useLocation()
  const onSystems = pathname.startsWith('/systems')

  return (
    <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-sm border-b border-ink/15">
      <div className="max-w-4xl mx-auto px-6 py-2 flex items-center justify-between">
        <div className="font-hand text-ink/60 text-sm">
          tiny illustrated guides to:
        </div>
        <div className="flex gap-2">
          <Link
            to="/"
            className={`pill-sketch text-sm ${
              !onSystems ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
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
        </div>
      </div>
    </nav>
  )
}
