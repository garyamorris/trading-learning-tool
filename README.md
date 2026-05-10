# How does an energy trader actually decide?

A scrollable, illustrated guide to the concepts inside the
`energy-risk-decision-lab` synthetic ETRM dataset — for people who want a
working mental model of energy trading, risk management, and decision
evaluation, without a textbook.

Built in the same spirit as `llm-learning-tool`: hand-drawn aesthetic,
single-page React app, fourteen chapters, each with a clickable demo.

## What's inside

| #   | Chapter                              | Demo                                                  |
| --- | ------------------------------------ | ----------------------------------------------------- |
| 1   | A day in the life of a trading desk  | Pick-a-desk dashboard with live P&L ticker            |
| 2   | Long, short, and exposed             | Position + price-move sliders → P&L                   |
| 3   | The market isn't a single price      | Regime switcher with spot prices + forward curves     |
| 4   | What's the worst that could happen?  | 5,000-path P&L histogram with VaR/CVaR markers        |
| 5   | Stress tests                         | Scenario picker → stress loss bars                    |
| 6   | Limits turn risk into rules          | VaR/CVaR/stress/position gauges with breach states    |
| 7   | Counterparties can default           | PFE vs collateral vs limit visualisation              |
| 8   | The lights must come on              | Hedge ratio + spot shock → unhedged P&L               |
| 9   | The action menu                      | Scenario picker → which of nine actions are feasible  |
| 10  | Different actors, different choices  | Actor switcher → softmax over actions                 |
| 11  | Was it a good decision?              | Counterfactual table → regret + quality label         |
| 12  | Decision ≠ outcome                   | 2×2 hindsight quadrant game                           |
| 13  | The model sees stale, noisy data     | Noise/missingness sliders → oracle vs model view      |
| 14  | One full decision, end-to-end        | Seven-box decision card + honest-takeaway columns     |

Mini-recaps sit between sections (after chapters 5, 8, 12) to keep the thread
of the story visible.

## Stack

- [Vite](https://vitejs.dev/) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for the playful illustrated styling
- [Framer Motion](https://www.framer.com/motion/) for the animations

The site is purely static — no backend, no API calls. All numbers are either
hand-authored to illustrate a concept, or computed in-browser from the
formulas the dataset uses (e.g. the VaR demo runs a small Box-Muller Monte
Carlo against a deterministic seed).

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## Deploy

The repo includes a `Dockerfile` and `nginx.conf` for hosting on
[Google Cloud Run](https://cloud.google.com/run):

```bash
gcloud run deploy trading-learning-tool \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

The Dockerfile is a two-stage build: Node compiles the Vite app, then
Nginx serves the static `dist/`. It works anywhere a container runs.

## A note on accuracy

This is a teaching tool, not a textbook, and not a faithful reproduction of
any real trading floor. The aim is to give a non-specialist a useful working
mental model in about twenty minutes. A few specific liberties:

- **Position values, prices, and limits** are calibrated against the
  defaults in the synthetic-data generator, not measured from a real market.
- **The VaR demo** uses a single-commodity normal-returns approximation, not
  the multi-commodity Cholesky decomposition the real generator uses. Same
  shape, simpler maths.
- **The actor scoring in Chapter 10** is a simplified version of the
  per-action utility function — enough to show preferences differ, not
  enough to recreate the dataset.
- **The counterfactual values in Chapter 11** are hand-authored to land in
  illustrative regret quartiles.

For the real implementation, see the
[`energy-risk-decision-lab`](https://github.com/) repo this guide accompanies.

## License

MIT — do whatever, but don't pretend this is the *full* picture of energy
trading. It's a friendly cartoon of one slice of one synthetic version of it.
