import { motion } from 'framer-motion'
import { SketchDefs } from '../components/SketchDefs'
import { Recap } from '../components/Recap'
import { OrgDiagramDemo } from '../components/middle/OrgDiagramDemo'
import { TradeVerificationDemo } from '../components/middle/TradeVerificationDemo'
import { IPVDemo } from '../components/middle/IPVDemo'
import { ReservesWaterfallDemo } from '../components/middle/ReservesWaterfallDemo'
import { ExceptionDashboardDemo } from '../components/middle/ExceptionDashboardDemo'

function FloatingDoodle({
  className,
  children,
  delay = 0,
}: {
  className?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      className={`absolute pointer-events-none select-none ${className ?? ''}`}
      animate={{ y: [0, -8, 0], rotate: [0, 3, -2, 0] }}
      transition={{
        duration: 6 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

function ChapterBadge({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span
        className="inline-flex items-center justify-center
          w-10 h-10 rounded-full border-[2.5px] border-ink
          bg-rose/40 font-display text-2xl shadow-sketchSm"
      >
        {n}
      </span>
      <span className="font-hand text-ink/70 uppercase tracking-widest text-sm">
        chapter {n} — {label}
      </span>
    </div>
  )
}

function ChapterDivider() {
  return (
    <div className="max-w-2xl mx-auto my-16 flex items-center gap-4">
      <div className="flex-1 border-t-[2px] border-dashed border-ink/30" />
      <span className="font-display text-3xl text-ink/40">✦ ✦ ✦</span>
      <div className="flex-1 border-t-[2px] border-dashed border-ink/30" />
    </div>
  )
}

export function MiddleOfficePage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <SketchDefs />

      <FloatingDoodle className="top-20 left-8 text-6xl text-rose/30">
        🛡️
      </FloatingDoodle>
      <FloatingDoodle className="top-72 right-12 text-5xl text-teal/30" delay={2}>
        🔍
      </FloatingDoodle>
      <FloatingDoodle className="top-[1300px] left-12 text-5xl text-mustard/40" delay={1}>
        📭
      </FloatingDoodle>
      <FloatingDoodle className="top-[2700px] right-10 text-5xl text-coral/30" delay={3}>
        📉
      </FloatingDoodle>
      <FloatingDoodle className="top-[4100px] left-10 text-5xl text-lavender/40" delay={2}>
        🧊
      </FloatingDoodle>
      <FloatingDoodle className="top-[5500px] right-8 text-5xl text-sage/40" delay={1.5}>
        ✓
      </FloatingDoodle>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-hand text-ink/60 text-lg mb-2">
            a tiny illustrated guide to
          </div>
          <h1 className="text-5xl md:text-7xl leading-tight mb-4">
            What does the{' '}
            <span className="text-rose relative inline-block">
              middle office
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 7 Q 50 2, 100 6 T 198 7"
                  stroke="#c14b6b"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            actually do?
          </h1>
          <p className="font-body text-xl text-ink/80 max-w-2xl mx-auto leading-relaxed">
            The function nobody outside the industry knows exists. It sits
            between the trader who wants to be optimistic and the back office
            that processes whatever it's given.
            <br />
            <span className="font-hand text-2xl text-rose">
              Its entire job is to be skeptical, in writing, every day.
            </span>
          </p>
        </motion.div>

        <motion.div
          className="mt-12 font-hand text-ink/50 text-lg"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ↓ scroll
        </motion.div>
      </section>

      {/* CHAPTER 1 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={1} label="front, middle, back" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Who watches whom.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Trading floors are split into three rooms with different jobs
            and different reporting lines. The{' '}
            <strong className="text-coral">front office</strong> takes
            positions and gets paid on P&amp;L. The{' '}
            <strong className="text-mustard">back office</strong> processes
            confirmations, settlements, payments, accounting. In between
            sits the <strong className="text-teal">middle office</strong>:
            independent, separately compensated, and structurally skeptical
            of the front office's numbers.
          </p>
          <p>
            Walk a trade through the rooms, or click each one to see what
            it really does:
          </p>
        </div>
        <OrgDiagramDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            That separation is not a nice-to-have. Every famous trading
            blow-up of the last 30 years is at root a story of insufficient
            middle-office control: trades booked but never confirmed,
            positions mismarked without challenge, exception alerts
            ignored. Regulators learned this expensively; ETRMs and control
            frameworks are built around the lessons.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 2 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={2} label="trade verification" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Did we actually trade what we think we traded?
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Every trade booked in the ETRM has to be{' '}
            <strong className="text-rose">confirmed against external evidence</strong>:
            the counterparty's own confirmation, the broker's record, the
            exchange's clearing message. In practice, 5-10% of trades have
            some kind of mismatch — wrong volume, wrong price, wrong tenor,
            wrong counterparty, occasionally missing entirely.
          </p>
          <p>
            Until a trade is reconciled against external evidence, it is{' '}
            <em>just the trader's claim</em>. Work the queue:
          </p>
        </div>
        <TradeVerificationDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Most mismatches are honest — fat-finger on volume, wrong tenor
            picked, broker confirmed the wrong leg. A small number aren't.
            That's why the SLA matters: a confirmation that should be
            resolved in T+1 but ages out to T+5 is exactly the gap fraud
            tends to live in.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 3 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={3} label="independent P&L (IPV)" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The second opinion that's always slightly different.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            The trader marks their book — often picking which broker quotes
            to use. The middle office independently re-marks the{' '}
            <em>same positions</em> using consensus services, exchange
            settles, or third-party vendor curves. The two numbers always
            disagree somewhat.
          </p>
          <p>
            Below a tolerance, the difference is bid-ask noise. Above it,
            it's a <strong className="text-coral">P&amp;L break</strong> —
            and every break has to be explained, classified, and
            documented:
          </p>
        </div>
        <IPVDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            The break taxonomy matters. Bid-ask noise gets logged and
            closed. Stale-mark breaks get the trader to re-mark. Model
            disagreements get escalated to model validation. A pattern of
            unjustified, P&amp;L-favourable mismarks gets escalated to
            compliance. Each path has different evidence requirements and
            different consequences.
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 1–3 · the independent checks"
        title="who, what, how much."
        points={[
          'the <strong>middle office</strong> exists because traders\' compensation depends on numbers they often set themselves. independence is the whole product.',
          '<strong>trade verification</strong> matches each booking against external evidence. until it does, the trade is just a claim.',
          '<strong>independent P&L (IPV)</strong> re-marks the same positions from a separate price source. breaks above threshold get classified and documented — bid-ask noise, stale mark, model disagreement, or possible mismark.',
        ]}
        next="next: what middle office adds on top of marks (reserves), and how it triages everything that fires (exceptions)."
      />

      <ChapterDivider />

      {/* CHAPTER 4 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={4} label="reserves & adjustments" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Fair value isn't official P&amp;L.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Even when the trader and IPV agree on a price, the firm's{' '}
            <strong>published</strong> P&amp;L isn't quite that number.
            Layered on top sit five reserves the middle office owns:{' '}
            <strong className="text-mustard">bid-ask</strong> (you can't
            exit at mid),{' '}
            <strong className="text-lavender">model risk</strong> (the
            pricer is approximate),{' '}
            <strong className="text-teal">liquidity</strong> (large
            positions move the market),{' '}
            <strong className="text-rose">CVA</strong> (counterparty might
            default), and <strong className="text-sage">FVA</strong>{' '}
            (funding the position has a cost).
          </p>
          <p>
            Each is a deliberate haircut on the headline number. Walk the
            waterfall:
          </p>
        </div>
        <ReservesWaterfallDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Reserves are where some of the toughest middle-vs-front
            arguments happen. Traders argue the reserves are too big and
            depress their bonus. The middle office argues they keep the
            firm honest under audit. Both are right; both versions of the
            number get reported (headline P&amp;L <em>and</em> official
            P&amp;L) but only one of them is what the firm actually books.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 5 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={5} label="exception monitoring" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The daily watchlist.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            All of the above — trade verification, IPV, reserves, plus
            limits and stale-data flags — feeds into one place: an{' '}
            <strong className="text-rose">exception dashboard</strong>. At
            EOD the middle office's screens fill with tickets. Each one
            has a severity, an owner, an age, and a path to resolution.
            Nothing falls off. Nothing closes without a note.
          </p>
          <p>
            Tomorrow's open is the deadline. Work the queue:
          </p>
        </div>
        <ExceptionDashboardDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Most exceptions are routine and close in minutes. A handful are
            real — the deliberate self-mark drift, the unconfirmed trade
            ageing past 24h, the P&amp;L break with no innocent
            explanation. The middle office is judged on how quickly the
            real ones are surfaced, and how few of them have to be
            surfaced by the regulator instead.
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 4–5 · adjustments and the daily watch"
        title="numbers and how they're watched."
        points={[
          'fair value isn\'t the headline. <strong>reserves</strong> (bid-ask, model, liquidity, CVA, FVA) bring it to a number defensible at exit and under audit.',
          'the <strong>exception dashboard</strong> is where everything that fires lands: stale prices, unconfirmed trades, P&L breaks, self-mark drifts, limit spikes. owner, severity, age, resolution. nothing falls off.',
        ]}
        next="the next ten chapters (coming): model validation, regulatory capital, control frameworks, escalation, the trader-vs-MO political reality, and where this function is going."
      />

      <ChapterDivider />

      <section className="max-w-3xl mx-auto px-6 py-12 text-center">
        <div className="font-display text-4xl text-rose mb-4">
          ✦ ten more chapters in flight ✦
        </div>
        <p className="font-body text-lg text-ink/80 max-w-2xl mx-auto leading-relaxed">
          The remaining chapters cover model validation, regulatory capital
          calculations, reconciliation against the back office, control
          frameworks (three lines of defence), escalation up to the audit
          committee, the political reality of trader-vs-MO disputes, the
          automation/regtech shift, and an honest takeaway.
        </p>
        <p className="font-hand text-xl text-coral mt-4">
          for now: jump to{' '}
          <a href="/" className="underline">trader decisions</a> or the{' '}
          <a href="/systems" className="underline">ETRM systems</a> guide.
        </p>
      </section>

      <footer className="max-w-3xl mx-auto px-6 pb-16 pt-8 text-center font-hand text-ink/40 text-sm">
        an experiment in explaining middle office to humans · all numbers
        in this guide are illustrative, not measured from a real desk.
      </footer>
    </div>
  )
}
