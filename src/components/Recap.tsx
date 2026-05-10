import { motion } from 'framer-motion'

type Props = {
  chapters: string
  title: string
  points: string[]
  next?: string
}

export function Recap({ chapters, title, points, next }: Props) {
  return (
    <section className="max-w-2xl mx-auto px-6 my-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
        className="card-sketch bg-mustard/15 border-mustard"
      >
        <div className="font-hand text-coral text-sm uppercase tracking-widest mb-1">
          📜 quick recap · {chapters}
        </div>
        <div className="font-display text-3xl mb-3">{title}</div>
        <ul className="space-y-2">
          {points.map((p, i) => (
            <li key={i} className="font-body text-base leading-relaxed flex gap-2">
              <span className="text-coral shrink-0">✦</span>
              <span dangerouslySetInnerHTML={{ __html: p }} />
            </li>
          ))}
        </ul>
        {next && (
          <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/70 text-base">
            <span className="text-coral">→</span> {next}
          </div>
        )}
      </motion.div>
    </section>
  )
}
