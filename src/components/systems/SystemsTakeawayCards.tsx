import { motion } from 'framer-motion'

const COLUMNS = [
  {
    title: 'brilliant at',
    color: 'sage',
    icon: '🌟',
    items: [
      'Operational reliability under regulatory pressure. The EOD cycle has to run, every business day, for decades. ETRMs are good at this.',
      'A single source of truth that survives staff turnover, audits, and merger-induced reorganisations.',
      'Multi-counterparty reconciliation at scale. The math is boring but the volume is huge, and the system does it without complaint.',
      'Audit & lineage when built in from day one. Reproducing a number from a year ago is what regulators want — and what good ETRMs deliver.',
      'The dull glue. Calendars, ISDA references, product master, location codes — the part you don\'t notice when it works, but rebuild from scratch if you don\'t have it.',
    ],
  },
  {
    title: 'notoriously bad at',
    color: 'mustard',
    icon: '⚠️',
    items: [
      'Customisation debt. Every shop forks the vendor product into a unique snowflake. Upgrades become re-implementations. The vendor sells the same product 40 times and watches 40 different forks evolve.',
      'Real-time analytics. The 6pm batch is sacred. Intra-day power markets and short-term trading have outgrown it but the architecture hasn\'t caught up.',
      'Trader UX. The interface to the very expensive engine often looks like it was designed in 2003 (because it was).',
      'Integrating data outside the vendor schema. New commodity? New regulation? New analytics? Get out your hand-drill.',
      'Vendor lock-in. Migrating off an entrenched ETRM is a multi-year, multi-million-pound exercise that nobody enjoys.',
    ],
  },
  {
    title: 'where it\'s going',
    color: 'lavender',
    icon: '👀',
    items: [
      'Cloud-native rewrites. The next generation is built as composable services, not monoliths. Risk, settlement, regulatory each independently scalable.',
      'Real-time risk for intra-day power and ancillary services markets, where the EOD batch is fundamentally too slow.',
      'AI-augmented exception handling — bots that read the trade ticket, the broker confo, and the counterparty\'s invoice, and surface the bits that don\'t match.',
      'The slow death of monolithic vendor platforms in favour of best-of-breed building blocks — your firm picks a curve engine, a position store, a reporting layer, and stitches them yourself.',
      'Synthetic-data benchmarks (like the energy-risk-decision-lab repo behind these guides) so models and humans can be evaluated on the same problems without the legal mess of real trade data.',
    ],
  },
]

const COLOR_BG: Record<string, string> = {
  sage: 'border-sage bg-sage/10',
  mustard: 'border-mustard bg-mustard/10',
  lavender: 'border-lavender bg-lavender/10',
}

export function SystemsTakeawayCards() {
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
