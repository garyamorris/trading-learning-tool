import { motion } from 'framer-motion'

const COLUMNS = [
  {
    title: 'what this is good for',
    color: 'sage',
    icon: '🌟',
    items: [
      'Training and benchmarking models without the legal mess of real trade data.',
      'Stress-testing LLMs and reasoning models on multi-constraint decisions where the right answer isn\'t in their training data.',
      'Studying explanation faithfulness — does the model\'s "why" match the oracle\'s known drivers?',
      'Building reproducible audit studies with human and expert reviewers.',
      'Teaching ETRM concepts (this is what you just did).',
    ],
  },
  {
    title: 'what it isn\'t',
    color: 'mustard',
    icon: '⚠️',
    items: [
      'A real trading floor. The synthetic actors and oracle are simplifications of much messier human behaviour.',
      'A claim about any actual market. Prices are calibrated against public ranges, not measured.',
      'A finished product. Real ETRM systems carry decades of bolt-on logic this dataset doesn\'t try to model.',
      'A licence to skip the audit. Even with a perfect oracle, decisions get judged by humans.',
    ],
  },
  {
    title: 'what to watch for',
    color: 'lavender',
    icon: '👀',
    items: [
      'Hindsight bias in any human review of model outputs. The 2×2 from Chapter 12 is everywhere.',
      'Data leakage from oracle into model — the most common silent failure mode.',
      'Plausibility vs truth — same lesson as the LLM tool. A confident wrong answer reads exactly like a confident right one.',
      'Whether models can stay coherent when liquidity, governance, and physical constraints all bind at once.',
    ],
  },
]

const COLOR_BG: Record<string, string> = {
  sage: 'border-sage bg-sage/10',
  mustard: 'border-mustard bg-mustard/10',
  lavender: 'border-lavender bg-lavender/10',
}

export function TakeawayCards() {
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
