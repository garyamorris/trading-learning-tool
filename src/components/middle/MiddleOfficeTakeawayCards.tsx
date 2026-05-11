import { motion } from 'framer-motion'

const COLUMNS = [
  {
    title: 'brilliant at',
    color: 'sage',
    icon: '🌟',
    items: [
      'Independence by design. Different reporting line, different data sources, different compensation. The structure is the product.',
      'Documenting "we knew this and we decided X". The audit trail is the firm\'s legal defence and its operational memory.',
      'Holding the line on marks under bonus pressure. A mature MO\'s reputation is what makes traders not even try.',
      'Surfacing rare-but-real patterns: deliberate self-marks, ageing unconfirmed trades, residuals that won\'t close. The dull watchfulness that prevents the big embarrassments.',
      'Translating between trader-detail and board-summary. Same numbers, four audiences, four levels of detail — nobody else can do it.',
    ],
  },
  {
    title: 'notoriously bad at',
    color: 'mustard',
    icon: '⚠️',
    items: [
      'Speed. The model is daily and reactive. By the time MO catches a problem, it\'s typically a day late — sometimes more.',
      'Friction with the front office. Even the best MO is annoying to traders on a good day, and a target on a bad one.',
      'Internal politics. MOs that report to the CRO (good) vs MOs that report up to the CFO via finance (mixed) vs MOs that report under the business head (a control failure waiting to happen).',
      'Hiring & retention. The job is rigorous, often thankless, and pays less than the front office. The career path is narrower.',
      'Adapting to new instruments faster than the front office invents them. Exotic models, weather derivatives, structured deals — the MO often catches up two years late.',
    ],
  },
  {
    title: 'where it\'s going',
    color: 'lavender',
    icon: '👀',
    items: [
      'Automation of the mechanical work (reconciliation, low-severity exception triage) — freeing analysts for the judgment-heavy cases.',
      'ML/AI for pattern detection — behavioural anomalies, mark-drift trajectories, suspicious-timing flags. Compliance gets new tools.',
      'Real-time IPV. Daily batch becomes intraday becomes streaming. The trade-off curve from chapter 14 gets re-tuned.',
      'Regtech consolidation. The reporting module shrinks as third-party vendors handle the regime-specific schemas.',
      'A possibly-unlikely re-merge with risk and compliance into a single "second line of defence" function — the historical split is a regulatory artefact, not an obvious org chart.',
    ],
  },
]

const COLOR_BG: Record<string, string> = {
  sage: 'border-sage bg-sage/10',
  mustard: 'border-mustard bg-mustard/10',
  lavender: 'border-lavender bg-lavender/10',
}

export function MiddleOfficeTakeawayCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
      {COLUMNS.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className={`p-4 rounded-xl border-[2.5px] shadow-sketch ${COLOR_BG[c.color]}`}
        >
          <div className="font-display text-2xl mb-2">
            {c.icon} {c.title}
          </div>
          <ul className="space-y-2 font-body text-sm leading-relaxed">
            {c.items.map((it) => (
              <li key={it} className="flex gap-2">
                <span className="text-coral shrink-0">✦</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}
