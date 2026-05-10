import { motion } from 'framer-motion'
import { SketchDefs } from '../components/SketchDefs'
import { Recap } from '../components/Recap'
import { DeskDashboardDemo } from '../components/DeskDashboardDemo'
import { PositionPnLDemo } from '../components/PositionPnLDemo'
import { MarketRegimeDemo } from '../components/MarketRegimeDemo'
import { VaRDemo } from '../components/VaRDemo'
import { StressTestDemo } from '../components/StressTestDemo'
import { GovernanceDemo } from '../components/GovernanceDemo'
import { CounterpartyDemo } from '../components/CounterpartyDemo'
import { PhysicalObligationDemo } from '../components/PhysicalObligationDemo'
import { ActionMenuDemo } from '../components/ActionMenuDemo'
import { ActorChoiceDemo } from '../components/ActorChoiceDemo'
import { RegretDemo } from '../components/RegretDemo'
import { HindsightDemo } from '../components/HindsightDemo'
import { ImperfectionsDemo } from '../components/ImperfectionsDemo'
import { DecisionCardDemo } from '../components/DecisionCardDemo'
import { TakeawayCards } from '../components/TakeawayCards'

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
          bg-mustard/70 font-display text-2xl shadow-sketchSm"
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

export function TradingPage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <SketchDefs />

      <FloatingDoodle className="top-20 left-8 text-6xl text-coral/30">
        ⚡
      </FloatingDoodle>
      <FloatingDoodle className="top-72 right-12 text-5xl text-teal/30" delay={2}>
        ✺
      </FloatingDoodle>
      <FloatingDoodle className="top-[1100px] left-12 text-5xl text-mustard/40" delay={1}>
        🛢️
      </FloatingDoodle>
      <FloatingDoodle className="top-[2400px] right-10 text-5xl text-lavender/40" delay={3}>
        ✦
      </FloatingDoodle>
      <FloatingDoodle className="top-[3700px] left-10 text-5xl text-sage/40" delay={2}>
        🍃
      </FloatingDoodle>
      <FloatingDoodle className="top-[5200px] right-8 text-5xl text-rose/30" delay={1.5}>
        ❄️
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
          <h1 className="text-6xl md:text-7xl leading-tight mb-4">
            How does an{' '}
            <span className="text-coral relative inline-block">
              energy trader
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 7 Q 50 2, 100 6 T 198 7"
                  stroke="#e8694e"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            actually decide?
          </h1>
          <p className="font-body text-xl text-ink/80 max-w-2xl mx-auto leading-relaxed">
            Power, gas, carbon. Limits, counterparties, weather. A trader stares
            at twenty screens and has to pick one of nine actions.
            <br />
            <span className="font-hand text-2xl text-coral">
              Let's pull back the curtain.
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
        <ChapterBadge n={1} label="day in the life" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          A trading desk is just a bag of bets.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Strip away the jargon and a trading desk is a tiny operation: it
            holds a few hundred positions in a handful of markets, watches
            prices move, and every morning has to decide{' '}
            <em>what to change</em>.
          </p>
          <p>
            The interesting part is that there isn't <em>one</em> kind of desk.
            Each one has a different purpose, a different bag of risks, and a
            different nightmare scenario. Pick one and poke around:
          </p>
        </div>
        <DeskDashboardDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            For the rest of this guide we'll mostly stand behind the{' '}
            <strong>Power Hedge Desk</strong>'s shoulder, but the same machinery
            applies to all of them. The next thirteen chapters peel back the
            layers between "I have positions" and "I just clicked an action".
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 2 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={2} label="long, short, exposed" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          You're long, you're short, you're exposed.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Every position is either{' '}
            <strong className="text-sage">long</strong> (you bought it; you win
            when prices rise) or <strong className="text-coral">short</strong>{' '}
            (you owe it; you win when prices fall). Sum them across a desk and
            you get the desk's <strong>delta</strong> — its sensitivity to a 1
            €/MWh price move.
          </p>
          <p>
            Slide the bars below to feel it. P&amp;L = position × price-move.
            That's it. That's most of the math:
          </p>
        </div>
        <PositionPnLDemo />
      </section>

      <ChapterDivider />

      {/* CHAPTER 3 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={3} label="market is plural" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The market isn't a single price.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            "What's the price of power?" is three questions in a trench coat.
            There's a <strong>spot price</strong> (today, this hour). There's a{' '}
            <strong>forward curve</strong> (the prices traders are quoting for
            delivery in M+1, Q+1, Cal+1). And both shift around with the{' '}
            <strong>regime</strong> the market is in: a cold spell, a gas
            shock, a carbon-policy surprise, a quiet Tuesday.
          </p>
          <p>
            Pick a regime and watch the whole apparatus react:
          </p>
        </div>
        <MarketRegimeDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Notice how power and gas tend to move together — the cold spell
            lifts both, because gas plants set the marginal price of power. And
            notice "correlation breakdown", which is exactly what it says: the
            relationships your hedges relied on stop working.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 4 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={4} label="VaR & CVaR" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          What's the worst that could happen?
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            You have a position. The market has a vol. Multiply, scale by
            horizon, and you can simulate thousands of "what could happen next"
            paths. The classic risk numbers come from staring at the loss tail
            of that distribution.
          </p>
          <p>
            <strong className="text-rose">VaR 95%</strong>: the loss you won't
            exceed on 95 days out of 100. <strong className="text-coral">CVaR 95%</strong>:
            the <em>average</em> loss across the bad 5%. Try the knobs:
          </p>
        </div>
        <VaRDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            VaR is famously misleading on its own — it tells you the boundary
            of "normally bad" but says nothing about what happens past the
            cliff. CVaR fixes that. Almost every modern limit framework uses
            CVaR (or expected shortfall) for exactly this reason.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 5 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={5} label="stress tests" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Stress tests: the scenarios VaR forgets.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            VaR assumes tomorrow looks roughly like the recent past. But the
            losses that actually hurt are the ones from regimes that{' '}
            <em>haven't shown up yet</em>. Stress tests are the answer:
            instead of sampling from history, you ask "if{' '}
            <em>this specific bad thing</em> happens, what do we lose?"
          </p>
          <p>
            Each scenario is a hand-built shock to power, gas, and carbon.
            Apply it to today's positions and you get a stress loss. The
            biggest one becomes your <strong>max stress loss</strong> — and it
            usually isn't the same scenario from one week to the next.
          </p>
        </div>
        <StressTestDemo />
      </section>

      <Recap
        chapters="chapters 1–5"
        title="the math layer"
        points={[
          'a desk is a <strong>delta</strong> across power / gas / carbon. P&L is just position × price move, summed up.',
          '"the market" is <strong>spot + forward curve + regime</strong>. correlations between commodities matter — and they break down.',
          '<strong>VaR / CVaR</strong> tell you the typical loss tail. <strong>stress tests</strong> tell you what happens in specific bad regimes. you need both.',
        ]}
        next="next: a risk number with no rule attached is just a number. let's add the rules."
      />

      <ChapterDivider />

      {/* CHAPTER 6 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={6} label="limits and approval paths" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Limits turn risk into rules.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            A €295k VaR is just a number. €295k <em>against a €335k limit</em>{' '}
            is a problem. The ratio of the two is called{' '}
            <strong className="text-coral">utilisation</strong>, and it's the
            single most-watched metric on a real risk dashboard.
          </p>
          <p>
            Most desks live with two thresholds: a{' '}
            <strong className="text-mustard">warning</strong> level (around 65%)
            where extra approvals kick in, and a{' '}
            <strong className="text-coral">hard limit</strong> (95%) where the
            trader can no longer act unilaterally. Watch what happens as you
            push the position:
          </p>
        </div>
        <GovernanceDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Past warning, "approval required" appears next to the action — a
            risk manager has to sign off. Past hard breach, the approval path
            jumps to <strong>risk_committee</strong>, "hold" becomes
            penalty-laden, and feasible actions narrow to the de-risking ones.
            Governance isn't a layer on top of trading — it{' '}
            <em>is</em> the trading.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 7 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={7} label="counterparties" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The other person can default on you.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Market risk is "the price moves against me." There's a second kind
            of risk that most people forget about:{' '}
            <strong className="text-coral">credit risk</strong>. Every hedge
            you put on has someone on the other side. If they go bust, your
            hedge goes bust with them.
          </p>
          <p>
            The two numbers that govern this:{' '}
            <strong>PFE</strong> (potential future exposure — how much they
            could end up owing you under bad-but-plausible market moves) and{' '}
            <strong>collateral</strong> (what they've already pledged). The
            difference is your <strong>shortfall</strong>:
          </p>
        </div>
        <CounterpartyDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Once a counterparty crosses the credit limit (or sits on the
            watchlist), a whole new actor joins the conversation: the{' '}
            <strong>credit officer</strong>. They have their own preferences
            and their own special action — <code>request_limit_exception</code>{' '}
            — that the trader doesn't get to use lightly.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 8 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={8} label="physical obligations" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The lights must come on.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            A purely financial desk can choose to be in or out of the market.
            A <strong>physical desk</strong> can't. It's already promised to
            deliver electricity to households or gas to a power plant — that
            obligation exists whether the desk likes the price or not.
          </p>
          <p>
            The lever the desk pulls is the{' '}
            <strong className="text-sage">hedge ratio</strong>: how much of the
            obligation has been pre-bought in the wholesale market. Anything
            left over is <strong className="text-coral">unhedged exposure</strong>{' '}
            — and on delivery day, you pay whatever the spot price is. Try it:
          </p>
        </div>
        <PhysicalObligationDemo />
      </section>

      <Recap
        chapters="chapters 6–8"
        title="the constraint layer"
        points={[
          '<strong>limits</strong> + <strong>utilisation</strong> turn risk numbers into governance decisions. warning → approval, hard breach → committee.',
          '<strong>counterparty risk</strong> is the second axis. PFE vs collateral, with credit officers standing watch.',
          '<strong>physical obligations</strong> are the third. unhedged exposure on a physical desk is the most dangerous number on the floor.',
        ]}
        next="now we know what they're allowed to do. next: what are the actions actually on the table?"
      />

      <ChapterDivider />

      {/* CHAPTER 9 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={9} label="the action menu" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Nine moves. Not all of them are legal.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            In the ETRM dataset there are exactly nine actions. They span the
            spectrum from "do nothing" to "ask the credit committee for an
            exception":
          </p>
          <p>
            But here's the trick: only some of them are{' '}
            <strong className="text-coral">feasible</strong> at any given
            moment. Liquidity, physical obligations, governance, and breach
            state all shape which actions even appear on the menu:
          </p>
        </div>
        <ActionMenuDemo />
      </section>

      <ChapterDivider />

      {/* CHAPTER 10 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={10} label="actors disagree" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Same situation. Different role. Different action.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Two people staring at the same risk dashboard will not pick the
            same action. The trader weighs P&amp;L heavily and is biased toward
            inertia. The risk manager weighs CVaR and breach probability. The
            credit officer leans on governance. The dataset encodes this with
            per-role weight vectors and a dash of softmax noise.
          </p>
          <p>
            Pick a role and watch the action distribution shift:
          </p>
        </div>
        <ActorChoiceDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            This matters because{' '}
            <span className="text-coral">"the right action" depends on whose mandate is being optimised</span>.
            A model that learns to imitate the trader will look very different
            from one that imitates the risk manager — even if both are trained
            on the same dataset.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 11 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={11} label="counterfactuals & regret" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          Was it a good decision?
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            In a real market you only see what actually happened. In a
            synthetic world we can do better: simulate{' '}
            <em>every feasible action</em> down hundreds of future paths,
            score each one, and find the highest-utility action that{' '}
            <em>could have been chosen</em>. The gap between that and what was
            actually picked is called{' '}
            <strong className="text-coral">regret</strong>:
          </p>
        </div>
        <RegretDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            The dataset uses regret to assign one of four labels —{' '}
            <span className="text-sage">effective</span>,{' '}
            <span className="text-teal">defensible</span>,{' '}
            <span className="text-mustard">questionable</span>,{' '}
            <span className="text-coral">poor</span> — to every decision. This
            label is the answer key models are eventually graded against.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 12 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={12} label="hindsight bias" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          A good decision can have a bad outcome.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            The single most common mistake in risk review:{' '}
            <em>judging a decision by its outcome</em>. They are not the same
            thing. A 95th-percentile hedge is right even when the world rolls
            a median day. A reckless hold is wrong even when it happens to
            make money.
          </p>
          <p>
            Try the 2×2:
          </p>
        </div>
        <HindsightDemo />
      </section>

      <Recap
        chapters="chapters 9–12"
        title="the decision layer"
        points={[
          'feasible actions change moment to moment. <strong>liquidity, physical, and governance state</strong> all shape the menu.',
          'every actor has their own weights — same situation, <strong>different probability over actions</strong>. there is no single "right answer" without a mandate.',
          '<strong>regret</strong> grades a decision against the best available action, not against what happened. the four quality labels live on this.',
          'decision quality and outcome are <strong>independent axes</strong>. the 2×2 is real. the hindsight trap is everywhere.',
        ]}
        next="last layer: even if everything above is true, the model never sees the clean version of any of it."
      />

      <ChapterDivider />

      {/* CHAPTER 13 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={13} label="model view vs oracle view" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          The model sees stale, noisy, missing data.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Everything we've talked about so far — the spot price, the VaR,
            the counterparty PFE, the actor's confidence, the logged reason —
            exists in the dataset in <em>two</em> versions:
          </p>
          <ul className="space-y-1 pl-6 list-disc marker:text-coral">
            <li>
              an <strong className="text-sage">oracle view</strong>: the
              ground-truth values, used only for evaluation.
            </li>
            <li>
              a <strong className="text-coral">model view</strong>: what would
              actually appear on a screen — noisy, occasionally missing,
              sometimes lagged or stale.
            </li>
          </ul>
          <p>
            Cranking the knobs simulates a worse trading floor. Notice what
            disappears:
          </p>
        </div>
        <ImperfectionsDemo />
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90 mt-8">
          <p>
            Keeping these two views strictly separate is what lets the dataset
            evaluate models honestly. If a model's training set ever sees an
            oracle column it shouldn't, the eval becomes a lie. The whole
            "research lab" half of the repo exists to keep that line clean.
          </p>
        </div>
      </section>

      <ChapterDivider />

      {/* CHAPTER 14 */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <ChapterBadge n={14} label="end to end" />
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight">
          One decision, all seven boxes.
        </h2>
        <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
          <p>
            Time to put it together. A single decision in the dataset is built
            from seven layered boxes — market, portfolio, risk, governance,
            actor &amp; action, counterfactual oracle, realised outcome.
            Click each one to see what's inside:
          </p>
        </div>
        <DecisionCardDemo />

        <div className="mt-12">
          <h3 className="text-3xl mb-4">The honest takeaway.</h3>
          <p className="font-body text-lg text-ink/85 leading-relaxed mb-3">
            Three columns, in the same spirit as the LLM guide's last chapter:
          </p>
        </div>
        <TakeawayCards />
      </section>

      <ChapterDivider />

      {/* CLOSING */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-5xl md:text-6xl mb-6 leading-tight text-center">
          So what is energy trading risk, really?
        </h2>

        <div className="card-sketch bg-paper/70 mt-8">
          <div className="font-body text-lg leading-relaxed space-y-4 text-ink/90">
            <p>In plain terms:</p>
            <p className="font-hand text-2xl text-coral pl-6 border-l-[3px] border-coral/60">
              a <strong>delta</strong> across a few commodities, watched against{' '}
              <strong>limits</strong>, scored by{' '}
              <strong>counterfactual regret</strong>, decided by{' '}
              <strong>actors who disagree</strong>, and reviewed under{' '}
              <strong>hindsight bias</strong>.
            </p>
            <p>
              That's most of the picture. Around the core sits everything we
              walked through: <strong>VaR &amp; CVaR</strong> (how bad is bad?),{' '}
              <strong>stress tests</strong> (how bad in this specific scenario?),{' '}
              <strong>governance limits</strong> (when does the trader stop
              deciding alone?), <strong>counterparty risk</strong> (who else
              could hurt me?), <strong>physical obligations</strong> (what
              must I deliver no matter what?), the{' '}
              <strong>action menu</strong> (what can I even do?),{' '}
              <strong>actor weights</strong> (whose mandate?),{' '}
              <strong>counterfactuals</strong> (what would each action have
              led to?), and the strict <strong>model-view / oracle-view</strong>{' '}
              line that keeps evaluation honest.
            </p>
            <p>
              That's it. That's the whole apparatus. No magic, no quants in a
              tower, no genius forecasts.
            </p>
            <ul className="space-y-2 pl-6 mt-4">
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>Risk numbers don't decide anything on their own.</strong>{' '}
                They only matter against limits.
              </li>
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>The action menu is shorter than you think.</strong>{' '}
                Most days, only three or four are even feasible.
              </li>
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>The right action depends on whose desk you're at.</strong>{' '}
                Trader vs risk manager vs credit officer is a real disagreement,
                not a pathology.
              </li>
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>Decision quality ≠ outcome.</strong> The 2×2 from
                Chapter 12 is the most useful frame in the whole guide.
              </li>
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>Models only ever see the noisy view.</strong> Anything
                else is a leak.
              </li>
              <li>
                <span className="font-hand text-coral text-xl">✦</span>{' '}
                <strong>Synthetic doesn't mean unrealistic.</strong> The whole
                point of this dataset is to be {' '}
                <em>structurally honest</em> even when the numbers are made up.
              </li>
            </ul>
            <p className="font-hand text-2xl text-ink mt-6">
              You now know roughly what's happening behind every "what should
              this desk do today?" question.{' '}
              <span className="text-coral">
                You can stop being mystified, and start being useful.
              </span>
            </p>
          </div>
        </div>

        <div className="text-center mt-12 font-display text-4xl text-ink/40">
          ✦ ✦ ✦
        </div>
        <div className="text-center mt-4 font-hand text-ink/60">
          thanks for scrolling.
        </div>
      </section>

      <footer className="max-w-3xl mx-auto px-6 pb-16 pt-8 text-center font-hand text-ink/40 text-sm">
        an experiment in explaining ETRM to humans · all numbers in this guide
        are illustrative, not measured from a real market.
      </footer>
    </div>
  )
}
