import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Desk = {
  id: string
  name: string
  emoji: string
  primary: string
  blurb: string
  positions: { power: number; gas: number; carbon: number }
  worry: string
}

const DESKS: Desk[] = [
  {
    id: 'power',
    name: 'Power Hedge Desk',
    emoji: '⚡',
    primary: 'power',
    blurb: 'Holds power forwards to lock in prices for the firm\'s generation business.',
    positions: { power: 145, gas: -25, carbon: 35 },
    worry: 'a sudden cold spell that drives power prices up — the desk is long power, so a price spike is good… unless wind output collapses at the same time.',
  },
  {
    id: 'gas',
    name: 'Gas Procurement Desk',
    emoji: '🔥',
    primary: 'gas',
    blurb: 'Buys gas to feed power plants and supply contracts. Usually short — owes gas it hasn\'t bought yet.',
    positions: { power: 10, gas: -155, carbon: 5 },
    worry: 'a gas supply shock — pipeline disruption, geopolitics. The desk is short gas, so price spikes hurt.',
  },
  {
    id: 'retail',
    name: 'Retail Supply Desk',
    emoji: '🏠',
    primary: 'power',
    blurb: 'Promised electricity to households at fixed prices. Owes power physically — the lights must come on.',
    positions: { power: -125, gas: -55, carbon: 8 },
    worry: 'wholesale prices spiking above the retail rate. Every kWh sold then loses money, and the obligation can\'t be cancelled.',
  },
  {
    id: 'prop',
    name: 'Prop Trading Desk',
    emoji: '🎲',
    primary: 'power',
    blurb: 'Speculates on price moves with the firm\'s own capital. No physical obligations, just bets.',
    positions: { power: 95, gas: 45, carbon: 22 },
    worry: 'being on the wrong side of a regime change — markets that were correlated suddenly aren\'t.',
  },
  {
    id: 'credit',
    name: 'Credit Risk Desk',
    emoji: '🏦',
    primary: 'carbon',
    blurb: 'Tracks counterparty exposure across the firm. If a trading partner defaults, this desk feels it first.',
    positions: { power: 28, gas: 32, carbon: 18 },
    worry: 'a major counterparty\'s collateral falling short of their potential future exposure.',
  },
]

function PositionBar({ value, max = 200 }: { value: number; max?: number }) {
  const widthPct = Math.min(100, (Math.abs(value) / max) * 100)
  const isLong = value >= 0
  return (
    <div className="relative h-6 bg-paper/60 rounded border-[1.5px] border-ink/40 overflow-hidden">
      <div className="absolute top-0 bottom-0 left-1/2 w-[1.5px] bg-ink/40" />
      <motion.div
        layout
        className={`absolute top-0 bottom-0 ${isLong ? 'bg-sage/60' : 'bg-coral/60'}`}
        style={{
          left: isLong ? '50%' : `${50 - widthPct / 2}%`,
          width: `${widthPct / 2}%`,
        }}
        animate={{ width: `${widthPct / 2}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-between px-2 font-hand text-sm">
        <span className="text-ink/40">short</span>
        <span className="text-ink font-bold">
          {value > 0 ? '+' : ''}
          {value.toFixed(0)} MW
        </span>
        <span className="text-ink/40">long</span>
      </div>
    </div>
  )
}

export function DeskDashboardDemo() {
  const [deskId, setDeskId] = useState(DESKS[0].id)
  const desk = DESKS.find((d) => d.id === deskId)!

  // Fake daily PnL ticker
  const [pnl, setPnl] = useState(0)
  useEffect(() => {
    setPnl(0)
    const t = setInterval(() => {
      setPnl((p) => p + (Math.random() - 0.45) * 12)
    }, 700)
    return () => clearInterval(t)
  }, [deskId])

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        <span className="font-hand text-ink/70 text-base mr-1">pick a desk:</span>
        {DESKS.map((d) => (
          <button
            key={d.id}
            onClick={() => setDeskId(d.id)}
            className={`pill-sketch text-base transition ${
              d.id === deskId ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
            }`}
          >
            {d.emoji} {d.name.replace(' Desk', '')}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={desk.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl">{desk.emoji}</span>
            <h3 className="font-display text-3xl">{desk.name}</h3>
          </div>
          <p className="font-body text-base text-ink/80 mb-4 leading-relaxed">
            {desk.blurb}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            {(['power', 'gas', 'carbon'] as const).map((c) => (
              <div key={c} className="p-3 bg-paper/40 rounded-lg border-[1.5px] border-ink/25">
                <div className="font-hand text-ink/70 text-sm mb-1 capitalize">
                  {c} position
                </div>
                <PositionBar value={desk.positions[c]} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-cream rounded-lg border-[2px] border-ink/30">
              <div className="font-hand text-ink/70 text-sm">today's P&amp;L (live)</div>
              <div
                className={`font-display text-3xl ${
                  pnl >= 0 ? 'text-sage' : 'text-coral'
                }`}
              >
                {pnl >= 0 ? '+' : ''}${pnl.toFixed(0)}k
              </div>
            </div>
            <div className="p-3 bg-cream rounded-lg border-[2px] border-ink/30">
              <div className="font-hand text-ink/70 text-sm">what worries them</div>
              <div className="font-body text-sm text-ink/85 leading-snug">
                {desk.worry}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ each desk has its own bag of positions and its own nightmare. the rest
        of this guide is about how they decide what to do every morning.
      </div>
    </div>
  )
}
