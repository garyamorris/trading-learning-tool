export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-sm border-b border-ink/15">
      <div className="max-w-4xl mx-auto px-6 py-2 flex items-center justify-between">
        <div className="font-hand text-ink/60 text-sm">
          a tiny illustrated guide to:
        </div>
        <div className="flex gap-2">
          <span className="pill-sketch text-sm bg-mustard/40 shadow-sketchSm">
            ⚡ energy trading risk
          </span>
        </div>
      </div>
    </nav>
  )
}
