import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

// Box-Muller for normal samples (deterministic with seeded LCG)
function makeRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function sampleNormal(rng: () => number) {
  const u = Math.max(rng(), 1e-9)
  const v = rng()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export function VaRDemo() {
  const [position, setPosition] = useState(120) // MW
  const [vol, setVol] = useState(0.34) // annualised
  const [horizon, setHorizon] = useState(10) // days

  const samples = useMemo(() => {
    const rng = makeRng(42)
    const dailySigma = 0.10 * Math.abs(position) * 78 * vol / Math.sqrt(252)
    const horizonSigma = dailySigma * Math.sqrt(horizon)
    const arr: number[] = []
    for (let i = 0; i < 5000; i++) {
      arr.push(sampleNormal(rng) * horizonSigma)
    }
    return arr.sort((a, b) => a - b)
  }, [position, vol, horizon])

  const var95 = -samples[Math.floor(samples.length * 0.05)]
  const cvar95 = -(samples.slice(0, Math.floor(samples.length * 0.05)).reduce((s, x) => s + x, 0) /
    Math.max(1, Math.floor(samples.length * 0.05)))

  // Bin samples into a histogram for display
  const bins = 30
  const min = Math.min(...samples)
  const max = Math.max(...samples)
  const binWidth = (max - min) / bins
  const histogram = new Array(bins).fill(0)
  for (const s of samples) {
    const idx = Math.min(bins - 1, Math.max(0, Math.floor((s - min) / binWidth)))
    histogram[idx]++
  }
  const maxBin = Math.max(...histogram)

  // SVG geometry
  const w = 460
  const h = 160
  const xFor = (i: number) => 20 + (i / bins) * (w - 30)
  const heightFor = (n: number) => (n / maxBin) * (h - 30)
  const var95Idx = Math.floor((-var95 - min) / binWidth)

  return (
    <div className="card-sketch max-w-3xl mx-auto my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div>
          <div className="flex justify-between text-sm font-hand text-ink/70 mb-1">
            <span>position</span>
            <span className="font-bold">{position} MW</span>
          </div>
          <input
            type="range"
            min={20}
            max={250}
            step={5}
            value={position}
            onChange={(e) => setPosition(parseInt(e.target.value))}
            className="w-full accent-coral"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm font-hand text-ink/70 mb-1">
            <span>vol (annualised)</span>
            <span className="font-bold">{(vol * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0.10}
            max={0.80}
            step={0.02}
            value={vol}
            onChange={(e) => setVol(parseFloat(e.target.value))}
            className="w-full accent-mustard"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm font-hand text-ink/70 mb-1">
            <span>horizon</span>
            <span className="font-bold">{horizon}d</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={horizon}
            onChange={(e) => setHorizon(parseInt(e.target.value))}
            className="w-full accent-teal"
          />
        </div>
      </div>

      <div className="bg-paper/40 rounded-lg border-[2px] border-ink/30 p-3 mb-4">
        <div className="font-hand text-ink/70 text-base mb-2">
          5,000 simulated P&amp;L paths over the next {horizon} days:
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44">
          {/* zero line */}
          <line
            x1={xFor((-min / binWidth))}
            x2={xFor((-min / binWidth))}
            y1={0}
            y2={h - 18}
            stroke="#2b2a26"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.4"
          />
          {/* bins */}
          {histogram.map((n, i) => {
            const inTail = i <= var95Idx
            return (
              <motion.rect
                key={i}
                x={xFor(i) + 0.5}
                width={(w - 30) / bins - 1}
                y={h - 18 - heightFor(n)}
                height={heightFor(n)}
                fill={inTail ? '#e8694e' : '#3d8b8b'}
                opacity={inTail ? 0.85 : 0.55}
                stroke="#2b2a26"
                strokeWidth="0.5"
              />
            )
          })}
          {/* VaR line */}
          <line
            x1={xFor(var95Idx + 0.5)}
            x2={xFor(var95Idx + 0.5)}
            y1={2}
            y2={h - 18}
            stroke="#c14b6b"
            strokeWidth="2"
          />
          <text
            x={xFor(var95Idx + 0.5)}
            y={12}
            fontSize="11"
            fontFamily="Caveat Brush"
            fill="#c14b6b"
            textAnchor="end"
          >
            VaR 95% →
          </text>
          {/* axis labels */}
          <text x={20} y={h - 3} fontSize="10" fill="#2b2a26" opacity="0.6" fontFamily="Patrick Hand">
            big loss
          </text>
          <text x={w - 20} y={h - 3} fontSize="10" fill="#2b2a26" opacity="0.6" fontFamily="Patrick Hand" textAnchor="end">
            big gain
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="p-3 rounded-lg border-[2px] border-rose bg-rose/10">
          <div className="font-hand text-ink/70 text-sm">VaR 95% ({horizon}d)</div>
          <div className="font-display text-3xl text-rose">€{var95.toFixed(0)}k</div>
          <div className="font-body text-sm text-ink/85">
            "On a typical bad day, you lose at most this much." 5% of days will
            be <em>worse</em> than this.
          </div>
        </div>
        <div className="p-3 rounded-lg border-[2px] border-coral bg-coral/10">
          <div className="font-hand text-ink/70 text-sm">CVaR 95% ({horizon}d)</div>
          <div className="font-display text-3xl text-coral">€{cvar95.toFixed(0)}k</div>
          <div className="font-body text-sm text-ink/85">
            The <em>average</em> loss across the worst 5% of days. Always larger
            than VaR. This is what regulators care about.
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-ink/15 font-hand text-ink/60 text-base">
        ↑ try cranking vol or horizon. risk grows with the square root of time —
        a 10-day VaR is roughly 3× the 1-day VaR, not 10×.
      </div>
    </div>
  )
}
