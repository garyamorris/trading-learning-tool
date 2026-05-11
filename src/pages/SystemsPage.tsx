import { motion } from 'framer-motion'
import { SketchDefs } from '../components/SketchDefs'
import { Recap } from '../components/Recap'
import { BeforeAfterETRMDemo } from '../components/systems/BeforeAfterETRMDemo'
import { TradeCaptureDemo } from '../components/systems/TradeCaptureDemo'
import { PositionPivotDemo } from '../components/systems/PositionPivotDemo'
import { ForwardCurveBuildDemo } from '../components/systems/ForwardCurveBuildDemo'
import { PnLAttributionDemo } from '../components/systems/PnLAttributionDemo'
import { RiskCycleDemo } from '../components/systems/RiskCycleDemo'
import { LimitBreachWorkflowDemo } from '../components/systems/LimitBreachWorkflowDemo'
import { SchedulingDemo } from '../components/systems/SchedulingDemo'
import { SettlementDemo } from '../components/systems/SettlementDemo'
import { CreditCollateralDemo } from '../components/systems/CreditCollateralDemo'
import { MasterDataDemo } from '../components/systems/MasterDataDemo'
import { OptionsGreeksDemo } from '../components/systems/OptionsGreeksDemo'
import { LineageDemo } from '../components/systems/LineageDemo'
import { RegulatoryReportingDemo } from '../components/systems/RegulatoryReportingDemo'
import { SystemsTakeawayCards } from '../components/systems/SystemsTakeawayCards'

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
          bg-teal/50 font-display text-2xl shadow-sketchSm"
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

export function SystemsPage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <SketchDefs />

      <FloatingDoodle className="top-20 left-8 text-6xl text-teal/30">
        🖥️
      </FloatingDoodle>
      <FloatingDoodle className="top-72 right-12 text-5xl text-coral/30" delay={2}>
        🎫
      </FloatingDoodle>
      <FloatingDoodle className="top-[1100px] left-12 text-5xl text-mustard/40" delay={1}>
        📊
      </FloatingDoodle>
      <FloatingDoodle className="top-[2400px] right-10 text-5xl text-lavender/40" delay={3}>
        〽️
      </FloatingDoodle>
      <FloatingDoodle className="top-[3700px] left-10 text-5xl text-sage/40" delay={2}>
        💷
      </FloatingDoodle>
      <FloatingDoodle className="top-[5400px] right-8 text-5xl text-rose/30" delay={1.5}>
        ⚠️
      </FloatingDoodle>
      <FloatingDoodle className="top-[7000px] left-8 text-5xl text-teal/30" delay={2.5}>
        🚚
      </FloatingDoodle>
      <FloatingDoodle className="top-[8800px] right-12 text-5xl text-mustard/40" delay={1}>
        🧾
      </FloatingDoodle>
      <FloatingDoodle className="top-[10400px] left-10 text-5xl text-lavender/40" delay={2}>
        🌀
      </FloatingDoodle>
      <FloatingDoodle className="top-[12000px] right-10 text-5xl text-rose/30" delay={1.5}>
        ⚖️
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
            How do{' '}
            <span className="text-teal relative inline-block">
              ETRM systems
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 7 Q 50 2, 100 6 T 198 7"
                  stroke="#3d8b8b"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            actually work?
          </h1>
          <p className="font-body text-xl text-ink/80 max-w-2xl mx-auto leading-relaxed">
            Page one was the <em>concepts</em> a trader reasons about. This
            one's the <em>software stack</em> that runs underneath: trades,
            positions, curves, MTM, the daily P&amp;L pulse.
            <br />
            <span className="font-hand text-2xl text-teal">
              The unglamorous plumbing that everything else hangs on.
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
        <ChapterBadge n={1} label="what an ETRM actually is" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          One record per trade. Everything else is a view.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            An energy trading floor produces hundreds of deals a day across
            multiple desks, commodities, counterparties, and regulators. The
            naive setup — a forest of spreadsheets, emails, broker confos and
            macros — collapses under that volume in a way that's quietly
            expensive. Numbers stop agreeing. Risk reports lag a day. Audit
            takes weeks.
          </p>
          <p>
            An <strong className="text-teal">ETRM</strong> (Energy Trading &amp;
            Risk Management system) is the operational substrate that fixes
            this. Its central idea is dull and revolutionary at the same time:
            there's <em>one record</em> per trade, and every downstream number —
            positions, P&amp;L, risk, settlement, regulatory report — is{' '}
            <em>derived</em> from that single store.
          </p>
        </div>
        <BeforeAfterETRMDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            That sounds obvious. It really, really isn't. The rest of this
            guide is what happens when you actually commit to it.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 2 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={2} label="trade capture · the heartbeat" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Every deal starts as a ticket.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            The trade ticket is the atomic unit. A handful of fields —{' '}
            <strong>direction</strong>,{' '}
            <strong>commodity</strong>,{' '}
            <strong>volume</strong>,{' '}
            <strong>price</strong>,{' '}
            <strong>tenor</strong>,{' '}
            <strong>counterparty</strong>,{' '}
            <strong>book</strong>,{' '}
            <strong>instrument type</strong> — captured at the moment of
            execution. Everything else the system does is a function of these
            tickets.
          </p>
          <p>
            Type something in. Watch where it goes:
          </p>
        </div>
        <TradeCaptureDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Real ETRMs have validation rules that catch fat-finger errors
            before the ticket commits — wrong sign, wrong tenor, counterparty
            with no signed ISDA, a price more than 5σ from the market. The
            validation layer is unglamorous and is more than half the value
            an ETRM delivers.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 3 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={3} label="positions · the rollup" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          What do we actually own right now?
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            A book with 10,000 open tickets isn't useful for anyone. A
            position view — net delta by desk, by commodity, by tenor, by
            delivery period — is. The{' '}
            <strong className="text-teal">position engine</strong> takes the
            trade blotter and projects it into whatever shape the asker needs.
          </p>
          <p>
            The non-trivial part: the same trade can appear in three
            different rollups, and the totals all have to agree. Pivot it:
          </p>
        </div>
        <PositionPivotDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Real position engines also handle{' '}
            <em>delivery periods</em> (one trade can deliver across many
            days), <em>location</em> (the same MW in two zones is two
            different positions), and{' '}
            <em>greeks</em> (delta on an option isn't a fixed number). The
            principle is the same: one underlying blotter, many derived
            views.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 4 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={4} label="forward curves · the input under everything" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The number behind every other number.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Once the system knows what we own, the next question is{' '}
            <em>what's it worth?</em> That depends entirely on the{' '}
            <strong className="text-teal">forward curve</strong>: a price for
            every future delivery period the firm cares about.
          </p>
          <p>
            Brokers only quote a handful of liquid tenors. Exchanges settle a
            few more. Between those anchor points, the curve engine{' '}
            <em>interpolates</em>, then layers on seasonal calibration so
            winter peaks land where they should. Toggle a quote off and watch
            the curve flex:
          </p>
        </div>
        <ForwardCurveBuildDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Curves are also the most-watched <em>quality</em> surface in any
            ETRM. A bad broker scrape, a stale snapshot, a slightly-wrong
            calibration — and every position, every VaR, every limit check
            downstream is now subtly lying. Most real shops have separate
            curve-validation jobs that run before any MTM cycle even starts.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 5 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={5} label="MTM · the daily P&amp;L pulse" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Why did the number change overnight?
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            With positions and curves both in hand, the system can compute{' '}
            <strong className="text-teal">mark-to-market</strong>: position
            times current curve, minus contracted price, summed up. This is
            the firm's headline P&amp;L number, recomputed every day after
            close.
          </p>
          <p>
            Crucially: nobody actually cares about today's MTM in isolation.
            The question is always{' '}
            <em>"how is it different from yesterday's, and why?"</em>. The
            answer is a <strong>P&amp;L attribution waterfall</strong>:
          </p>
        </div>
        <PnLAttributionDemo />
      </section>

      <Recap
        chapters="chapters 1–5 · the daily-cycle backbone"
        title="trades → positions → curves → MTM."
        points={[
          'An ETRM\'s central trick is <strong>one record per trade</strong> with everything else derived. Anything not following this rule is technical debt waiting to bite.',
          '<strong>Trade capture</strong> is the atomic unit. The blotter is the source of truth.',
          'The <strong>position engine</strong> projects the blotter into whatever pivot the asker needs. All rollups must agree.',
          'The <strong>forward curve</strong> is the input under every downstream number. A curve bug is a firm-wide P&L bug.',
          '<strong>MTM</strong> values the book today. <strong>P&L attribution</strong> explains why it changed since yesterday — and is what anyone in the morning meeting actually wants.',
        ]}
        next="next chapters (coming soon): risk metrics computed off this backbone, limits & breach workflows, scheduling, settlement, credit, regulatory reporting, audit & lineage."
      />

      <ChapterDivider />

      {/* CHAPTER 6 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={6} label="risk, computed at scale" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The 6pm-to-6am risk cycle.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Page one explained VaR and CVaR conceptually. The system-side
            version is a <strong className="text-teal">batch job</strong>: at
            roughly 6pm every business day, the ETRM grabs a snapshot of
            every position and every curve, fires up a Monte Carlo engine,
            simulates thousands of P&amp;L paths, aggregates the loss tails
            up the book hierarchy, and publishes the result before traders
            return the next morning.
          </p>
          <p>
            Press the button and watch the four-stage pipeline run:
          </p>
        </div>
        <RiskCycleDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Notice the firm-level VaR is{' '}
            <em>less than</em> the sum of the desks, which is less than the
            sum of the books. That's{' '}
            <strong>diversification benefit</strong>: a long power desk and a
            short gas desk partially cancel. A real ETRM tracks how much of
            firm risk is "structural" (would survive any reshuffle) versus
            "concentration" (one big book carrying the rest).
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 7 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={7} label="limits & the breach workflow" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          A limit is a workflow, not a number.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            A limit on its own is just configuration. What makes it real is
            the <strong className="text-teal">workflow</strong> attached:
            every new trade is checked against the relevant limits; every
            EOD recompute is checked too; any breach becomes an{' '}
            <em>object</em> in a queue, routed to the right approver,
            tracked through to a definitive outcome (approved / exception /
            forced reduce / closed), and audit-logged forever.
          </p>
          <p>
            Push the scale slider, watch limits go red, and resolve the
            breaches that pile up:
          </p>
        </div>
        <LimitBreachWorkflowDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            A real shop has hundreds of limits — by book, commodity, tenor,
            counterparty, stress scenario, region — and dozens of distinct
            approval paths. The unglamorous truth: most of an ETRM's "risk
            management" value is in this workflow plumbing, not in the
            math.
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 6–7 · risk you can act on"
        title="from numbers to enforcement."
        points={[
          'the <strong>risk cycle</strong> is a nightly batch. it produces the firm-, desk-, and book-level VaR/CVaR/stress that everything else hangs on.',
          '<strong>diversification benefit</strong> is real: firm risk &lt; sum of desks &lt; sum of books. tracking how much of risk is structural vs concentration is its own discipline.',
          'a <strong>limit</strong> is a workflow with an audit trail, not a gauge. breaches are objects routed for approval. "approved" is a database row.',
        ]}
        next="now: the physical world. you sold MWh. somebody actually has to deliver them."
      />

      <ChapterDivider />

      {/* CHAPTER 8 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={8} label="scheduling & nominations" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          You sold electricity. Now actually deliver it.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            The chapter nobody outside physical desks knows exists. Every MWh
            you've sold for tomorrow has to be{' '}
            <strong className="text-teal">told to the grid</strong> — a
            nomination submitted to the TSO (transmission system operator)
            per hour, in the right format, before the gate-closure cutoff.
            Same idea for gas: the pipeline operator needs a nomination per
            day per delivery point.
          </p>
          <p>
            Get the profile wrong and you pay an{' '}
            <strong>imbalance settlement</strong> on every misnominated MWh.
            Miss the cutoff entirely and the grid charges you for{' '}
            <em>every</em> delivered MWh:
          </p>
        </div>
        <SchedulingDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This is where the ETRM's "position" view meets the wires of the
            actual electricity grid. The system has to translate your trade
            book into hourly delivery schedules, push them to ten different
            TSO formats, retry on failures, and reconcile against{' '}
            <em>metered actuals</em> the next day. It's the part of an ETRM
            that's the least about finance and the most about logistics.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 9 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={9} label="settlement & invoicing" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Money actually has to move.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            After delivery, the ETRM produces an{' '}
            <strong className="text-teal">invoice</strong> per counterparty
            per period: contracted volume × contracted price × the right
            index, with adjustments for actual delivered MWh. It sends it.
            The counterparty sends one too — for the same flow, but from{' '}
            <em>their</em> books.
          </p>
          <p>
            Then the matching begins. Lines that agree settle. Lines that
            disagree go to a dispute workflow — sometimes for weeks. Try a
            month's invoice match:
          </p>
        </div>
        <SettlementDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Most real disputes are dull —{' '}
            <em>wrong index, wrong day, off-by-one volume</em> — and most
            resolve in an email exchange and a credit note. A few don't and
            end up in lawyers' offices. The system's job is to make sure
            every disputed line is{' '}
            <strong>tracked, aging, and accounted for</strong> until it
            closes.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 10 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={10} label="credit & collateral, ongoing" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Counterparty risk is a process, not a number.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            On page one, counterparty PFE was a snapshot. In a real ETRM
            it's a{' '}
            <strong className="text-teal">live timeline</strong>: every new
            trade with a counterparty nets into their potential future
            exposure under the master agreement (typically an ISDA with a
            Credit Support Annex). When that exposure crosses an agreed{' '}
            <strong>threshold</strong>, the system auto-issues a{' '}
            <strong className="text-coral">margin call</strong>. The
            counterparty posts collateral — or doesn't.
          </p>
          <p>
            Thirty days, one counterparty, one CSA. Watch what happens when
            the book grows and they delay or dispute:
          </p>
        </div>
        <CreditCollateralDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Real credit teams worry less about the headline PFE and more
            about the{' '}
            <em>shaded area</em> — the integrated unsecured exposure over
            time. Every day a counterparty is over-threshold and
            under-collateralised is a day you're carrying their default risk
            for free.
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 8–10 · the operational layer"
        title="physical, financial, ongoing."
        points={[
          '<strong>scheduling & nominations</strong> turn your trade book into hourly delivery instructions to the grid. miss the cutoff, pay the imbalance.',
          '<strong>settlement & invoicing</strong> is half the operational cost of running an ETRM — generating invoices, matching against counterparties, and chasing disputes for weeks.',
          '<strong>credit & collateral</strong> is a daily loop. PFE moves, threshold crossed, margin call sent, collateral posted (or not). watch the unsecured-area integral.',
        ]}
        next="next chapters (coming): regulatory reporting (REMIT/EMIR), audit & lineage, master data, exotic instruments, and an honest takeaway."
      />

      <ChapterDivider />

      {/* CHAPTER 11 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={11} label="master data · the silent foundation" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Who is CP_004, really?
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Identifiers like <strong>CP_004</strong> and{' '}
            <strong>BOOK_007</strong> have been showing up in every chapter
            since chapter 2. We've been treating them as if their meaning is
            obvious. It isn't. Behind every one of them sits a{' '}
            <strong className="text-teal">master-data record</strong> —
            legal name, country, parent entity, ultimate parent, rating,
            agreements in place, watchlist status.
          </p>
          <p>
            And those records have hierarchies. Trade with one subsidiary,
            default risk rolls up to the parent. Click around:
          </p>
        </div>
        <MasterDataDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            A real ETRM has master-data tables for counterparties, products,
            commodities, locations, calendars, FX rates, holiday schedules,
            instrument types, and a dozen others. They change rarely but
            consequentially — a counterparty merger, a new delivery zone, a
            calendar update — and every dependent table has to react.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 12 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={12} label="options & exotics" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          When the trade model isn't enough.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Most ETRM volume is vanilla forwards and swaps — the model we
            built in chapter 2. But the interesting trades are{' '}
            <strong className="text-coral">optional</strong>: European
            calls, swing contracts, virtual storage, weather derivatives,
            extendibles, swaptions. They have <em>kinked payoffs</em> —
            which is what makes them valuable, and what forces the system
            to track four greeks per position, alongside a 2-D{' '}
            <strong>vol surface</strong>.
          </p>
          <p>
            Compare a vanilla forward to a vanilla call. Move the strike:
          </p>
        </div>
        <OptionsGreeksDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Real shops have separate pricing engines per instrument family:
            Black-Scholes for European, trinomial trees for American,
            least-squares Monte Carlo for swing, and full term-structure
            models for stuff like exotic gas storage. Each engine has its
            own calibration data. Each instrument adds new fields to the
            trade model. And each is now also a{' '}
            <em>new lineage path</em> — which sets up the next chapter.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 13 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={13} label="audit & lineage · prove every number" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Where did that number come from?
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            A regulator asks "reproduce yesterday's firm VaR." A CFO asks
            "why is today's MTM €200k different from last week's?". An
            internal auditor asks "show me every trade that contributed to
            this number."
          </p>
          <p>
            Every one of those questions requires{' '}
            <strong className="text-teal">lineage</strong>: an explicit
            graph from any output number back to the inputs that produced
            it — every trade, every curve point, every config flag, every
            model commit. Plus an{' '}
            <strong>immutable history</strong> so the inputs can be
            re-frozen as they were at the time. Click around the graph and
            try the rewind:
          </p>
        </div>
        <LineageDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This is the chapter that looks boring and is the most expensive
            to retrofit. If the trade store overwrites in place, if the
            curve snapshots aren't kept, if model code can change without a
            version tag — you can <em>compute</em> a number but you can't{' '}
            <em>defend</em> it. Good ETRMs commit to lineage from day one.
            Less-good ones discover they need it during their first audit.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 14 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={14} label="regulatory reporting · trades for outsiders" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The trade tells three different stories.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Every trade has to be reported, in the right format, on the
            right deadline, to the right repository.{' '}
            <strong className="text-teal">EMIR</strong> (EU derivatives,
            T+1, ESMA).{' '}
            <strong className="text-coral">REMIT</strong> (EU wholesale
            energy, near-real-time, ACER).{' '}
            <strong className="text-lavender">Dodd-Frank</strong> (US
            commodity, as-soon-as-practicable, CFTC). Different fields,
            different identifiers, different lifecycle event triggers.
          </p>
          <p>
            One trade, three reports. Trigger a lifecycle event and watch
            which fields update:
          </p>
        </div>
        <RegulatoryReportingDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            The reporting module is half mapping logic and half
            rejection-handling. ESMA rejects on UTI namespace mismatches.
            ACER rejects on EIC codes. The CFTC's SDR rejects on USI
            duplicates. Reports get amended; amendments get reported;
            reconciliation runs daily to make sure the repositories agree
            with the firm's books.
          </p>
          <p>
            Miss a deadline; pay a fine. Misreport; pay a bigger fine. This
            is not optional and not negotiable, which is why ETRMs have to
            be very good at it.
          </p>
        </div>
      </section>

      <Recap
        chapters="chapters 11–14 · integrity & the outside world"
        title="the parts that make all of it defensible."
        points={[
          '<strong>master data</strong> is the silent foundation: legal entities, products, locations, calendars. without it, "CP_004" means nothing.',
          'options & exotics need a <strong>vol surface plus four greeks</strong>. every ETRM has at least two pricing engines hiding inside.',
          '<strong>lineage</strong> is what lets you reproduce any number from a frozen snapshot. retrofit it and it costs millions. build it in from day one.',
          '<strong>regulatory reporting</strong> is the same trade told three or four ways, in three or four formats, on three or four deadlines. miss it; pay a fine.',
        ]}
        next="closing chapter: what ETRMs do brilliantly, what they’re notoriously bad at, and where the whole category is going."
      />

      <ChapterDivider />

      {/* CHAPTER 15 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={15} label="the honest takeaway" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          What ETRMs do well. What they don't. Where it's going.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            You've now seen the whole stack: trades, positions, curves,
            MTM, risk, limits, scheduling, settlement, credit, master data,
            options, lineage, regulatory. Before we close, a clear-eyed
            pass at what this kind of system is actually good at, what it
            quietly isn't, and what the next decade looks like.
          </p>
        </div>
        <SystemsTakeawayCards />

        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-4">
          <p>
            None of this is settled. The class of "energy trading and risk
            management system" is older than most of the people running
            them, and parts of it are visibly straining against modern
            trading patterns. The right posture is the same as for LLMs on
            page one's companion guide:{' '}
            <strong>curious but not credulous</strong>. Understand the
            machinery, value the dull parts, and demand better from the new
            ones.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CLOSING */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight text-center">
          So what is an ETRM, really?
        </h2>

        <div className="card-sketch bg-paper/70 mt-8">
          <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
            <p>In plain terms:</p>
            <p className="font-hand text-2xl text-teal pl-6 border-l-[3px] border-teal/60">
              <strong>one record per trade</strong>, valued against{' '}
              <strong>curves</strong>, aggregated into{' '}
              <strong>positions</strong>, watched against{' '}
              <strong>limits</strong>, delivered through{' '}
              <strong>schedules</strong>, settled via{' '}
              <strong>invoices</strong>, collateralised against{' '}
              <strong>counterparties</strong>, reported to{' '}
              <strong>regulators</strong>, and made defensible by{' '}
              <strong>lineage</strong>.
            </p>
            <p>
              That's it. That's the whole apparatus. No magic, no quants in
              a tower, no genius forecasts — just an extraordinarily large
              amount of unglamorous, time-pressured, audited plumbing.
            </p>
            <p>
              And yet:{' '}
              <em>
                without that plumbing none of the cleverness on{' '}
                <a href="/" className="text-coral underline">
                  page one
                </a>{' '}
                ever happens
              </em>
              . Every "decide what to do today" question on a real trading
              floor sits on top of an ETRM doing its boring, essential
              work.
            </p>
            <ul className="space-y-2 pl-6 mt-4">
              <li>
                <span className="font-hand text-teal text-xl">✦</span>{' '}
                <strong>One record per trade.</strong> The whole
                architectural commitment. Everything else is a derived
                view.
              </li>
              <li>
                <span className="font-hand text-teal text-xl">✦</span>{' '}
                <strong>The forward curve is the input under everything.</strong>{' '}
                MTM, VaR, limits, P&amp;L explain — they all hang on it.
              </li>
              <li>
                <span className="font-hand text-teal text-xl">✦</span>{' '}
                <strong>A limit is a workflow, not a gauge.</strong>{' '}
                Breaches are objects routed for approval, audit-logged
                forever.
              </li>
              <li>
                <span className="font-hand text-teal text-xl">✦</span>{' '}
                <strong>Physical delivery is real.</strong> Schedules,
                nominations, imbalance — most ETRM cost is in keeping the
                wires happy.
              </li>
              <li>
                <span className="font-hand text-teal text-xl">✦</span>{' '}
                <strong>Credit risk is a daily loop.</strong> PFE, margin
                call, collateral, dispute. Repeat per counterparty,
                forever.
              </li>
              <li>
                <span className="font-hand text-teal text-xl">✦</span>{' '}
                <strong>Lineage is non-negotiable.</strong> Every number
                traces back to every input that produced it.
              </li>
              <li>
                <span className="font-hand text-teal text-xl">✦</span>{' '}
                <strong>Reporting is the customer.</strong> The regulator
                is a consumer of the system; the system is shaped to
                serve them.
              </li>
              <li>
                <span className="font-hand text-teal text-xl">✦</span>{' '}
                <strong>Customisation debt is the real boss.</strong>{' '}
                Every shop's "standard" ETRM is uniquely theirs by year
                three. Treat the vendor product as a starting point, not
                an answer.
              </li>
            </ul>
            <p className="font-hand text-2xl text-ink mt-6">
              You now know roughly what's running behind every energy
              trader's morning meeting.{' '}
              <span className="text-teal">
                The clever decisions happen on top of an enormous amount of
                boring, beautiful plumbing.
              </span>
            </p>
          </div>
        </div>

        <div className="text-center mt-12 font-display text-4xl text-ink/40">
          ✦ ✦ ✦
        </div>
        <div className="text-center mt-4 font-hand text-ink/60">
          thanks for scrolling. now go check out{' '}
          <a href="/" className="underline text-coral">
            page one
          </a>{' '}
          for the trader's view.
        </div>
      </section>

      <footer className="max-w-3xl mx-auto px-6 pb-16 pt-8 text-center font-hand text-ink/40 text-sm">
        an experiment in explaining ETRM systems to humans · all numbers in
        this guide are illustrative, not measured from a real system.
      </footer>
    </div>
  )
}
