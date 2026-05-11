import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Trade = {
  id: string
  direction: 'buy' | 'sell'
  commodity: 'power' | 'gas' | 'carbon'
  instrument: 'forward' | 'swap' | 'physical_supply_obligation'
  volume: number
  price: number
  tenor: string
  counterparty: string
  book: string
}

const SEED_TRADES: Trade[] = [
  {
    id: 'T_0000821',
    direction: 'buy',
    commodity: 'power',
    instrument: 'forward',
    volume: 50,
    price: 84.5,
    tenor: 'M+1',
    counterparty: 'CP_004',
    book: 'BOOK_007',
  },
  {
    id: 'T_0000822',
    direction: 'sell',
    commodity: 'gas',
    instrument: 'swap',
    volume: 20,
    price: 53.1,
    tenor: 'Q+1',
    counterparty: 'CP_011',
    book: 'BOOK_007',
  },
]

const COUNTERPARTIES = ['CP_001', 'CP_004', 'CP_011', 'CP_014']
const BOOKS = ['BOOK_007', 'BOOK_012']
const TENORS = ['M+1', 'M+3', 'Q+1', 'Cal+1']

export function TradeCaptureDemo() {
  const [trades, setTrades] = useState<Trade[]>(SEED_TRADES)
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy')
  const [commodity, setCommodity] = useState<'power' | 'gas' | 'carbon'>('power')
  const [instrument, setInstrument] = useState<'forward' | 'swap' | 'physical_supply_obligation'>('forward')
  const [volume, setVolume] = useState(40)
  const [price, setPrice] = useState(80.0)
  const [tenor, setTenor] = useState('M+1')
  const [counterparty, setCounterparty] = useState('CP_004')
  const [book, setBook] = useState('BOOK_007')
  const [lastBookedId, setLastBookedId] = useState<string | null>(null)

  function book_it() {
    const t: Trade = {
      id: `T_000${(821 + trades.length + 1).toString().padStart(4, '0')}`,
      direction,
      commodity,
      instrument,
      volume,
      price,
      tenor,
      counterparty,
      book,
    }
    setTrades([...trades, t])
    setLastBookedId(t.id)
  }

  // Derived positions per (book, commodity)
  const positions = new Map<string, number>()
  for (const t of trades) {
    const key = `${t.book}|${t.commodity}`
    const signed = (t.direction === 'buy' ? 1 : -1) * t.volume
    positions.set(key, (positions.get(key) ?? 0) + signed)
  }
  const positionRows = [...positions.entries()].map(([k, v]) => {
    const [b, c] = k.split('|')
    return { book: b, commodity: c, delta: v }
  })

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TICKET FORM */}
        <div className="p-3 bg-paper/40 rounded-lg border-[2px] border-ink/30">
          <div className="font-display text-xl mb-2">🎫 new trade ticket</div>

          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              {(['buy', 'sell'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  className={`flex-1 pill-sketch text-sm ${
                    direction === d
                      ? d === 'buy'
                        ? 'bg-sage/40 shadow-sketchSm'
                        : 'bg-coral/40 shadow-sketchSm'
                      : 'hover:bg-paper'
                  }`}
                >
                  {d === 'buy' ? '📈 buy' : '📉 sell'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1">
              {(['power', 'gas', 'carbon'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCommodity(c)}
                  className={`pill-sketch text-xs ${
                    commodity === c ? 'bg-mustard/40 shadow-sketchSm' : 'hover:bg-paper'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1">
              {(['forward', 'swap', 'physical_supply_obligation'] as const).map((i) => (
                <button
                  key={i}
                  onClick={() => setInstrument(i)}
                  className={`pill-sketch text-xs px-1 ${
                    instrument === i ? 'bg-teal/40 shadow-sketchSm' : 'hover:bg-paper'
                  }`}
                >
                  {i === 'physical_supply_obligation' ? 'physical' : i}
                </button>
              ))}
            </div>

            <label className="block">
              <div className="flex justify-between font-hand text-xs text-ink/70">
                <span>volume (MW)</span>
                <span className="font-bold">{volume}</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full accent-coral"
              />
            </label>
            <label className="block">
              <div className="flex justify-between font-hand text-xs text-ink/70">
                <span>price (€/MWh)</span>
                <span className="font-bold">{price.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={40}
                max={150}
                step={0.5}
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full accent-mustard"
              />
            </label>

            <div className="grid grid-cols-2 gap-1">
              <select
                value={tenor}
                onChange={(e) => setTenor(e.target.value)}
                className="border-[1.5px] border-ink rounded px-1 py-0.5 bg-cream font-body text-xs"
              >
                {TENORS.map((t) => (
                  <option key={t} value={t}>
                    tenor: {t}
                  </option>
                ))}
              </select>
              <select
                value={counterparty}
                onChange={(e) => setCounterparty(e.target.value)}
                className="border-[1.5px] border-ink rounded px-1 py-0.5 bg-cream font-body text-xs"
              >
                {COUNTERPARTIES.map((c) => (
                  <option key={c} value={c}>
                    cp: {c}
                  </option>
                ))}
              </select>
              <select
                value={book}
                onChange={(e) => setBook(e.target.value)}
                className="col-span-2 border-[1.5px] border-ink rounded px-1 py-0.5 bg-cream font-body text-xs"
              >
                {BOOKS.map((b) => (
                  <option key={b} value={b}>
                    book: {b}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={book_it} className="btn-sketch bg-mustard/60 w-full mt-1">
              ✦ book the trade →
            </button>
          </div>
        </div>

        {/* BLOTTER */}
        <div className="p-3 bg-paper/40 rounded-lg border-[2px] border-ink/30">
          <div className="font-display text-xl mb-2">📒 trade blotter</div>
          <div className="font-hand text-xs text-ink/60 mb-2">
            every booked trade lives here forever.
          </div>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {trades.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-xs font-mono bg-cream rounded border-[1.5px] p-1.5 ${
                    t.id === lastBookedId ? 'border-coral ring-2 ring-coral/30' : 'border-ink/30'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-bold">{t.id}</span>
                    <span
                      className={
                        t.direction === 'buy' ? 'text-sage font-bold' : 'text-coral font-bold'
                      }
                    >
                      {t.direction === 'buy' ? '+' : '−'}
                      {t.volume} {t.commodity}
                    </span>
                  </div>
                  <div className="text-ink/70 text-[10px]">
                    {t.instrument} · {t.tenor} @ €{t.price.toFixed(1)} ·{' '}
                    {t.counterparty} → {t.book}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* DERIVED POSITION TABLE */}
      <div className="mt-4 p-3 bg-sage/10 rounded-lg border-[2px] border-sage/50">
        <div className="font-display text-xl mb-1 text-sage">
          📊 position view (derived live)
        </div>
        <div className="font-hand text-xs text-ink/60 mb-2">
          nobody types these numbers in. they're computed from the blotter
          every time it changes.
        </div>
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="font-hand text-ink/60 text-xs">
              <th className="text-left">book</th>
              <th className="text-left">commodity</th>
              <th className="text-right">net Δ (MW)</th>
            </tr>
          </thead>
          <tbody>
            {positionRows.map((r) => (
              <tr key={`${r.book}-${r.commodity}`}>
                <td className="font-mono">{r.book}</td>
                <td>{r.commodity}</td>
                <td
                  className={`text-right font-bold tabular-nums ${
                    r.delta > 0 ? 'text-sage' : r.delta < 0 ? 'text-coral' : ''
                  }`}
                >
                  {r.delta > 0 ? '+' : ''}
                  {r.delta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ the trade is the atom. <span className="text-coral">everything else</span> —
        positions, P&amp;L, risk, settlement — is just a query over the blotter.
      </div>
    </div>
  )
}
