import { motion } from 'framer-motion'
import { SketchDefs } from '../components/SketchDefs'
import { Recap } from '../components/Recap'
import { OrgDiagramDemo } from '../components/middle/OrgDiagramDemo'
import { TradeVerificationDemo } from '../components/middle/TradeVerificationDemo'
import { IPVDemo } from '../components/middle/IPVDemo'
import { ReservesWaterfallDemo } from '../components/middle/ReservesWaterfallDemo'
import { ExceptionDashboardDemo } from '../components/middle/ExceptionDashboardDemo'
import { PositionReconDemo } from '../components/middle/PositionReconDemo'
import { ModelValidationDemo } from '../components/middle/ModelValidationDemo'
import { PnLExplainInAngerDemo } from '../components/middle/PnLExplainInAngerDemo'
import { RegulatoryCapitalDemo } from '../components/middle/RegulatoryCapitalDemo'
import { RiskReportingDemo } from '../components/middle/RiskReportingDemo'
import { ThreeLinesOfDefenceDemo } from '../components/middle/ThreeLinesOfDefenceDemo'
import { EscalationPathsDemo } from '../components/middle/EscalationPathsDemo'
import { PoliticalRealityDemo } from '../components/middle/PoliticalRealityDemo'
import { WhereItsGoingDemo } from '../components/middle/WhereItsGoingDemo'
import { MiddleOfficeTakeawayCards } from '../components/middle/MiddleOfficeTakeawayCards'

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
      <FloatingDoodle className="top-[6800px] left-8 text-5xl text-teal/30" delay={2}>
        🤝
      </FloatingDoodle>
      <FloatingDoodle className="top-[8200px] right-12 text-5xl text-mustard/40" delay={1}>
        🏛️
      </FloatingDoodle>
      <FloatingDoodle className="top-[9600px] left-10 text-5xl text-lavender/40" delay={3}>
        🪜
      </FloatingDoodle>
      <FloatingDoodle className="top-[11000px] right-10 text-5xl text-rose/30" delay={2}>
        🎭
      </FloatingDoodle>
      <FloatingDoodle className="top-[12600px] left-12 text-5xl text-coral/30" delay={1.5}>
        🌌
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

      {/* CHAPTER 6 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={6} label="position reconciliation" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The same position lives in four systems.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Chapter 2 verified individual trades. This chapter zooms out:
            the same{' '}
            <em>position</em> (an aggregate of trades) lives independently
            in the front-office ETRM, the middle-office shadow system, the
            back-office settlement system, and the counterparty&apos;s
            books. None of these talk to each other directly — and over
            time they drift apart.
          </p>
          <p>
            The morning recon job is what catches the drift before it
            becomes a problem:
          </p>
        </div>
        <PositionReconDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Most breaks are mundane (batch timing, mapping issues, late
            amendments). A handful are not — and those are why this dull
            morning ritual exists.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 7 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={7} label="model validation" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The MO doesn&apos;t just re-mark prices. It re-implements models.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            The model risk reserve from chapter 4 came from{' '}
            <em>somewhere</em>. This is the somewhere. The MO maintains a{' '}
            <strong className="text-rose">parallel implementation</strong>{' '}
            of every pricing model the trader uses, calibrates it
            independently, and compares prices instrument-by-instrument.
          </p>
          <p>
            Three kinds of disagreement come out: noise, calibration, and
            structural. Each requires a different response:
          </p>
        </div>
        <ModelValidationDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Structural divergences are the expensive ones. They mean the
            trader&apos;s model is{' '}
            <em>actually different</em> from the MO&apos;s — and the firm
            has to pick which one is right (or reserve against the
            uncertainty). Model Risk committees exist for exactly these
            conversations.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 8 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={8} label="P&L explain in anger" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          When the residual blows up.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Page 2 chapter 5 showed the daily P&amp;L attribution
            waterfall when everything is clean — residual under €5k. This
            chapter is the broken version: residual is{' '}
            <strong className="text-coral">€280k</strong>. Tomorrow&apos;s
            P&amp;L can&apos;t go out the door until it&apos;s solved.
          </p>
          <p>
            Find the leaks:
          </p>
        </div>
        <PnLExplainInAngerDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            The middle office is the first responder for these. Often the
            answer is mundane (a feed failed, a cancel didn&apos;t fire,
            an amendment missed a batch). Occasionally the answer is
            uncomfortable. Either way, the explanation has to be on paper
            before the firm publishes the next day&apos;s number.
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 6–8 · the second layer of checks"
        title="recon, models, broken explains."
        points={[
          '<strong>position reconciliation</strong> catches drift between front, middle, back, and counterparty before it becomes a structural problem.',
          '<strong>model validation</strong> is an independent re-implementation of the trader\'s pricers. structural disagreements drive the model risk reserve.',
          'when the daily <strong>P&L attribution</strong> residual blows up, the MO triages it: stale feed, double-book, missing trade, CVA recalc. it has to close before the next day publishes.',
        ]}
        next="now: the calculations and reports the middle office produces for the rest of the firm and the regulator."
      />

      <ChapterDivider />

      {/* CHAPTER 9 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={9} label="regulatory capital" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The denominator the trader doesn&apos;t get to choose.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Regulators don&apos;t just want to{' '}
            <em>see</em> the firm&apos;s risk — they want the firm to{' '}
            <em>hold capital</em> against it. Risk-weighted assets (RWA)
            roll up by position; required capital is roughly 8% of RWA.
            The firm&apos;s return on equity is{' '}
            <strong>P&amp;L ÷ required capital</strong>. The MO computes
            both numbers.
          </p>
          <p>
            Add a new trade and watch the cascade:
          </p>
        </div>
        <RegulatoryCapitalDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This is why MO methodology disputes get heated. The trader
            controls the numerator (P&amp;L), but the MO controls the
            denominator (capital). A tweak to a risk-weight calculation
            can wipe out a desk&apos;s entire bonus pool — or unlock one.
            Boards pay attention.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 10 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={10} label="risk reporting up the chain" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Same numbers, four audiences.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            The trader sees every position. The desk head sees a desk-page
            summary. The risk committee sees firm trends across 12 weeks.
            The board sees three slides. All four reports start from the
            same underlying data — but each is{' '}
            <strong className="text-rose">shaped to what its audience can act on</strong>.
            That shaping is the MO&apos;s editorial pen.
          </p>
        </div>
        <RiskReportingDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            What gets summarised, what gets buried, what gets escalated:
            those choices shape how leadership thinks about the firm&apos;s
            risk. Every MO has at some point picked what number to put on
            the board pack&apos;s lead slide. The pen is heavy.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 11 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={11} label="three lines of defence" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Who audits the auditors.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Every regulated firm runs some version of a three-line
            control model.{' '}
            <strong className="text-coral">First line</strong>: the people
            who take the risk own their daily controls. {' '}
            <strong className="text-teal">Second line</strong>: independent
            challenge — the MO sits here, alongside risk, compliance, and
            finance control. {' '}
            <strong className="text-lavender">Third line</strong>: internal
            audit, independent of <em>both</em> previous lines, reporting
            to the audit committee of the board.
          </p>
        </div>
        <ThreeLinesOfDefenceDemo />
      </section>

      <ChapterDivider />

      {/* CHAPTER 12 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={12} label="escalation paths" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          When it fires, who hears about it — in what order?
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Every exception type has a{' '}
            <strong className="text-rose">pre-agreed escalation tree</strong>:
            who calls who, by when, with what SLA, what evidence required.
            The trees aren&apos;t improvised — they&apos;re written,
            tested, and reviewed annually.
          </p>
          <p>
            Walk through four real ones:
          </p>
        </div>
        <EscalationPathsDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            The discipline isn&apos;t in <em>having</em> a path. It&apos;s
            in following it every single time — even when the trader is
            a friend, even when it&apos;s 6pm on Friday, even when the
            evidence is thin. The audit trail is the firm&apos;s defence
            when the same exception ends up in front of the regulator
            three years later.
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 9–12 · what MO produces for the rest of the firm"
        title="capital, reports, lines, paths."
        points={[
          '<strong>regulatory capital</strong> ties the trader\'s P&L to a denominator the MO controls. methodology disputes are bonus disputes in disguise.',
          '<strong>risk reporting</strong> shapes what each level (trader, desk head, risk committee, board) sees about the firm\'s risk. the MO\'s editorial pen is heavy.',
          'the <strong>three lines of defence</strong> — front office, MO/risk/compliance, internal audit — give regulators a structural answer to "who watches whom".',
          '<strong>escalation paths</strong> are written and tested. following them every time is the discipline; not following them shows up in audit reports.',
        ]}
        next="last three chapters: the political reality, where this function is going, and an honest takeaway."
      />

      <ChapterDivider />

      {/* CHAPTER 13 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={13} label="the political reality" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The bit that isn&apos;t in the textbook.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Every diagram in this guide so far has been clean. The
            reality on a trading floor is{' '}
            <strong className="text-rose">political</strong>. Traders are
            charismatic, well-paid, structurally important to the firm,
            and have strong incentives. The MO disagrees with them on
            numbers that drive their bonus.
          </p>
          <p>
            Pick an approach and see how it plays out — today, and six
            months later:
          </p>
        </div>
        <PoliticalRealityDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Good middle offices don&apos;t pick &quot;hold the line&quot;
            every time. They pick the right tool for the right break, and
            build a reputation for{' '}
            <strong>both fairness and spine</strong>. That reputation is
            what makes traders not even try the next pressure tactic.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 14 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={14} label="where it&apos;s going" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Traditional → emerging → aspirational.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            The traditional middle office is daily, batch-based, and
            heavily human. The emerging one is intraday, API-driven, and
            ML-augmented. The aspirational one is real-time, predictive,
            and built around shared ledgers. Each step trades{' '}
            <strong>speed and automation</strong> for{' '}
            <strong>auditability and human judgment</strong>.
          </p>
        </div>
        <WhereItsGoingDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            The function isn&apos;t disappearing — but the work is moving
            up the stack. Less mechanical reconciling; more model
            oversight, behavioural-pattern detection, and edge-case
            judgment. The headcount might shrink; the skill bar goes up.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 15 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={15} label="the honest takeaway" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          What it does well. What it doesn&apos;t. Where it&apos;s going.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            You&apos;ve walked through the whole function: independence,
            verification, IPV, reserves, exception monitoring, recon,
            model validation, P&amp;L explain, regulatory capital, risk
            reporting, three lines of defence, escalation paths, political
            reality, and the technology trajectory. Time to close
            cleanly.
          </p>
        </div>
        <MiddleOfficeTakeawayCards />
      </section>

      <ChapterDivider />

      {/* CLOSING */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight text-center">
          So what is the middle office, really?
        </h2>

        <div className="card-sketch bg-paper/70 mt-8">
          <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
            <p>In plain terms:</p>
            <p className="font-hand text-2xl text-rose pl-6 border-l-[3px] border-rose/60">
              the firm&apos;s <strong>independent verification function</strong>{' '}
              — different reporting line, different data, different
              compensation — whose entire job is to be skeptical of the
              traders&apos; numbers in writing, every day.
            </p>
            <p>
              You can describe what it does as a pipeline:{' '}
              <strong>verify trades</strong> against external evidence,{' '}
              <strong>re-mark positions</strong> independently,{' '}
              <strong>compute reserves</strong> the trader doesn&apos;t
              get to set, <strong>run controls</strong> at end of day,{' '}
              <strong>reconcile positions</strong> across four systems,{' '}
              <strong>re-implement models</strong> to validate them,{' '}
              <strong>explain P&amp;L breaks</strong> when the residual
              blows up, <strong>calculate capital</strong> the regulator
              demands, <strong>report up</strong> to four different
              audiences, <strong>follow escalation paths</strong> every
              time, and <strong>hold the line</strong> when the trader
              pushes back.
            </p>
            <p>
              The function exists because every famous trading scandal of
              the last thirty years happened in shops where one or more
              of those activities was inadequate. Barings, SocGen, UBS,
              JPMorgan — same pattern, different decades.
            </p>
            <ul className="space-y-2 pl-6 mt-4">
              <li>
                <span className="font-hand text-rose text-xl">✦</span>{' '}
                <strong>Independence is the whole product.</strong>{' '}
                Different reporting line, different data, different
                compensation. Anything that compromises it compromises
                the function.
              </li>
              <li>
                <span className="font-hand text-rose text-xl">✦</span>{' '}
                <strong>A trade isn&apos;t real until it&apos;s
                verified.</strong> Front office &quot;trades&quot;; MO
                makes them real by reconciling against external evidence.
              </li>
              <li>
                <span className="font-hand text-rose text-xl">✦</span>{' '}
                <strong>Two marks, always.</strong> Trader&apos;s and IPV.
                The difference is documented, classified, and acted on.
              </li>
              <li>
                <span className="font-hand text-rose text-xl">✦</span>{' '}
                <strong>Fair value ≠ official P&amp;L.</strong> Reserves
                live in between. The MO owns the methodology.
              </li>
              <li>
                <span className="font-hand text-rose text-xl">✦</span>{' '}
                <strong>Exceptions don&apos;t close themselves.</strong>{' '}
                Every ticket has an owner, an age, and a path to
                resolution.
              </li>
              <li>
                <span className="font-hand text-rose text-xl">✦</span>{' '}
                <strong>The denominator matters.</strong> Capital
                methodology decides bonus pools. Boards pay attention.
              </li>
              <li>
                <span className="font-hand text-rose text-xl">✦</span>{' '}
                <strong>Escalation paths are written and tested.</strong>{' '}
                Following them every time is the discipline that audits
                catch.
              </li>
              <li>
                <span className="font-hand text-rose text-xl">✦</span>{' '}
                <strong>Hold the line — selectively.</strong> A mature
                MO picks the right tool for the right break. Reputation
                is what makes traders not even try.
              </li>
            </ul>
            <p className="font-hand text-2xl text-ink mt-6">
              You now know roughly what happens between the trader who
              wants to be optimistic and the back office that processes
              whatever it&apos;s given.{' '}
              <span className="text-rose">
                The independent eye is what keeps the rest of the system
                honest.
              </span>
            </p>
          </div>
        </div>

        <div className="text-center mt-12 font-display text-4xl text-ink/40">
          ✦ ✦ ✦
        </div>
        <div className="text-center mt-4 font-hand text-ink/60">
          thanks for scrolling. that was the whole three-guide set —{' '}
          <a href="/" className="underline text-coral">trader decisions</a>,{' '}
          <a href="/systems" className="underline text-coral">ETRM systems</a>,
          and the middle office.
        </div>
      </section>

      <footer className="max-w-3xl mx-auto px-6 pb-16 pt-8 text-center font-hand text-ink/40 text-sm">
        an experiment in explaining middle office to humans · all numbers
        in this guide are illustrative, not measured from a real desk.
      </footer>
    </div>
  )
}
