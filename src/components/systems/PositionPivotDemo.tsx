import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type Trade = {
  id: string
  desk: string
  book: string
  commodity: 'power' | 'gas' | 'carbon'
  tenor: 'M+1' | 'M+3' | 'Q+1' | 'Cal+1'
  delta: number // signed MW (positive = long)
}

const TRADES: Trade[] = [
  { id: 'T1', desk: 'Power Hedge', book: 'BOOK_007', commodity: 'power', tenor: 'M+1', delta: 60 },
  { id: 'T2', desk: 'Power Hedge', book: 'BOOK_007', commodity: 'power', tenor: 'Q+1', delta: 45 },
  { id: 'T3', desk: 'Power Hedge', book: 'BOOK_007', commodity: 'power', tenor: 'Cal+1', delta: 40 },
  { id: 'T4', desk: 'Power Hedge', book: 'BOOK_007', commodity: 'gas', tenor: 'M+1', delta: -25 },
  { id: 'T5', desk: 'Power Hedge', book: 'BOOK_007', commodity: 'carbon', tenor: 'Cal+1', delta: 35 },
  { id: 'T6', desk: 'Gas Procurement', book: 'BOOK_012', commodity: 'gas', tenor: 'M+1', delta: -90 },
  { id: 'T7', desk: 'Gas Procurement', book: 'BOOK_012', commodity: 'gas', tenor: 'Q+1', delta: -65 },
  { id: 'T8', desk: 'Gas Procurement', book: 'BOOK_012', commodity: 'power', tenor: 'M+1', delta: 10 },
  { id: 'T9', desk: 'Retail Supply', book: 'BOOK_018', commodity: 'power', tenor: 'M+1', delta: -75 },
  { id: 'T10', desk: 'Retail Supply', book: 'BOOK_018', commodity: 'power', tenor: 'M+3', delta: -50 },
  { id: 'T11', desk: 'Retail Supply', book: 'BOOK_018', commodity: 'gas', tenor: 'M+1', delta: -30 },
  { id: 'T12', desk: 'Prop Trading', book: 'BOOK_022', commodity: 'power', tenor: 'M+1', delta: 55 },
  { id: 'T13', desk: 'Prop Trading', book: 'BOOK_022', commodity: 'gas', tenor: 'Q+1', delta: 38 },
  { id: 'T14', desk: 'Prop Trading', book: 'BOOK_022', commodity: 'carbon', tenor: 'Cal+1', delta: 22 },
]

type Axis = 'desk' | 'commodity' | 'tenor'

const AXIS_LABELS: Record<Axis, string> = {
  desk: 'desk',
  commodity: 'commodity',
  tenor: 'tenor',
}

function aggregate(trades: Trade[], rowAxis: Axis, colAxis: Axis) {
  const rowKeys = new Set<string>()
  const colKeys = new Set<string>()
  const map = new Map<string, number>()
  for (const t of trades) {
    const r = String(t[rowAxis])
    const c = String(t[colAxis])
    rowKeys.add(r)
    colKeys.add(c)
    const key = `${r}|${c}`
    map.set(key, (map.get(key) ?? 0) + t.delta)
  }
  // Stable order
  const COMM_ORDER = ['power', 'gas', 'carbon']
  const TENOR_ORDER = ['M+1', 'M+3', 'Q+1', 'Cal+1']
  const order = (axis: Axis, keys: string[]) => {
    if (axis === 'commodity') return keys.sort((a, b) => COMM_ORDER.indexOf(a) - COMM_ORDER.indexOf(b))
    if (axis === 'tenor') return keys.sort((a, b) => TENOR_ORDER.indexOf(a) - TENOR_ORDER.indexOf(b))
    return keys.sort()
  }
  return {
    rows: order(rowAxis, [...rowKeys]),
    cols: order(colAxis, [...colKeys]),
    get(r: string, c: string) {
      return map.get(`${r}|${c}`) ?? 0
    },
  }
}

export function PositionPivotDemo() {
  const [rowAxis, setRowAxis] = useState<Axis>('desk')
  const [colAxis, setColAxis] = useState<Axis>('commodity')

  const pivot = useMemo(
    () => aggregate(TRADES, rowAxis, colAxis === rowAxis ? otherAxis(rowAxis) : colAxis),
    [rowAxis, colAxis],
  )
  const effectiveCol = colAxis === rowAxis ? otherAxis(rowAxis) : colAxis

  // Total across all trades — proves totals don't change under pivot
  const grandTotal = TRADES.reduce((s, t) => s + t.delta, 0)

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="font-hand text-ink/70 text-base mb-3">
        14 trades. one underlying truth. pivot it three different ways:
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex items-center gap-2">
          <span className="font-hand text-ink/70 text-sm">rows:</span>
          {(Object.keys(AXIS_LABELS) as Axis[]).map((a) => (
            <button
              key={a}
              onClick={() => setRowAxis(a)}
              className={`pill-sketch text-xs ${
                rowAxis === a ? 'bg-coral/40 shadow-sketchSm' : 'hover:bg-paper'
              }`}
            >
              {AXIS_LABELS[a]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-hand text-ink/70 text-sm">cols:</span>
          {(Object.keys(AXIS_LABELS) as Axis[])
            .filter((a) => a !== rowAxis)
            .map((a) => (
              <button
                key={a}
                onClick={() => setColAxis(a)}
                className={`pill-sketch text-xs ${
                  effectiveCol === a ? 'bg-teal/40 shadow-sketchSm' : 'hover:bg-paper'
                }`}
              >
                {AXIS_LABELS[a]}
              </button>
            ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3">
        <motion.table layout className="w-full text-sm font-body">
          <thead>
            <tr className="font-hand text-ink/60 text-xs">
              <th className="text-left p-1">
                {AXIS_LABELS[rowAxis]} ↓ / {AXIS_LABELS[effectiveCol]} →
              </th>
              {pivot.cols.map((c) => (
                <th key={c} className="text-right p-1 px-2">
                  {c}
                </th>
              ))}
              <th className="text-right p-1 pl-3 text-ink font-bold">total</th>
            </tr>
          </thead>
          <tbody>
            {pivot.rows.map((r) => {
              let rowTotal = 0
              return (
                <motion.tr layout key={r} className="border-t border-ink/15">
                  <td className="p-1.5 font-bold">{r}</td>
                  {pivot.cols.map((c) => {
                    const v = pivot.get(r, c)
                    rowTotal += v
                    return (
                      <td
                        key={c}
                        className={`text-right p-1.5 tabular-nums ${
                          v > 0 ? 'text-sage' : v < 0 ? 'text-coral' : 'text-ink/30'
                        }`}
                      >
                        {v === 0 ? '—' : (v > 0 ? '+' : '') + v}
                      </td>
                    )
                  })}
                  <td
                    className={`text-right p-1.5 pl-3 tabular-nums font-bold ${
                      rowTotal > 0 ? 'text-sage' : rowTotal < 0 ? 'text-coral' : ''
                    }`}
                  >
                    {rowTotal > 0 ? '+' : ''}
                    {rowTotal}
                  </td>
                </motion.tr>
              )
            })}
            <tr className="border-t-[2px] border-ink/40 bg-mustard/10">
              <td className="p-1.5 font-bold font-hand">total</td>
              {pivot.cols.map((c) => {
                const colTotal = pivot.rows.reduce((s, r) => s + pivot.get(r, c), 0)
                return (
                  <td
                    key={c}
                    className={`text-right p-1.5 tabular-nums font-bold ${
                      colTotal > 0 ? 'text-sage' : colTotal < 0 ? 'text-coral' : ''
                    }`}
                  >
                    {colTotal > 0 ? '+' : ''}
                    {colTotal}
                  </td>
                )
              })}
              <td className="text-right p-1.5 pl-3 tabular-nums font-bold">
                {grandTotal > 0 ? '+' : ''}
                {grandTotal}
              </td>
            </tr>
          </tbody>
        </motion.table>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-sage/10 border-[2px] border-dashed border-sage">
        <div className="font-hand text-sage text-base">
          ✓ grand total: <strong className="text-ink">{grandTotal > 0 ? '+' : ''}{grandTotal} MW</strong>{' '}
          — and it doesn't change when you pivot.
        </div>
        <div className="font-body text-sm text-ink/85 mt-1">
          The point of a position engine: same atoms, many faces, every
          rollup reconciles. "What does Power Hedge own in M+1?" and "What
          does the firm own in carbon?" are queries against the same data.
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ this single grid replaces about a dozen tab-strewn spreadsheets.{' '}
        <span className="text-coral">that's it. that's the magic trick.</span>
      </div>
    </div>
  )
}

function otherAxis(a: Axis): Axis {
  if (a === 'desk') return 'commodity'
  if (a === 'commodity') return 'tenor'
  return 'desk'
}
