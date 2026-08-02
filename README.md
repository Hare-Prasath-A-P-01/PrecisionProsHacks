# ExpenseAI

AI-powered expense tracker with keyword-based category prediction, a live dashboard, and spending insights. Built for the Precision Pro Mini Hackathon Series.

## Stack
React + Vite · Tailwind CSS · Recharts · Lucide React · LocalStorage (no backend)

## Setup
```bash
npm install
npm run dev
```
Open the printed localhost URL. `npm run build` produces a production bundle in `dist/`.

## Project structure
```
src/
├── components/
│   ├── ExpenseForm.jsx     # input + live AI category preview
│   ├── Dashboard.jsx       # layout composing the widgets below
│   ├── SummaryCards.jsx    # total / today / transactions / top category
│   ├── PieChartComp.jsx    # category breakdown donut chart
│   ├── ExpenseTable.jsx    # searchable, deletable expense list
│   └── AIInsights.jsx      # generated spending observations
├── utils/
│   └── categorizer.js      # keyword-matching "AI" + confidence score
├── App.jsx                 # state + localStorage persistence
├── main.jsx
└── index.css
```

## How the AI prediction works
`categorizer.js` matches the description against a keyword dictionary per category (Food, Transport, Shopping, Entertainment, Bills, Health, Education, Others) and returns a confidence percentage — higher for short, clean matches, capped lower for longer/noisier text, 40% fallback for "Others". Edit `CATEGORY_KEYWORDS` to extend coverage.

## Already implemented (MVP + stretch)
- Expense form with amount + description, live category preview with confidence %
- Summary cards, pie chart, searchable/deletable table
- AI insights panel
- LocalStorage persistence (survives refresh)

## Not yet implemented (from the "if time permits" list)
- Monthly view / month-over-month comparison
- Dark mode toggle (the UI ships dark-only by default)
- CSV export

---

## Building this in Antigravity

This repo is already a complete, working app — you can drop it straight into an Antigravity workspace and run `npm install && npm run dev`. If instead you want Antigravity's agent to *build it from scratch* (e.g. for the hackathon demo, or to practice the workflow), give it this as the task prompt:

> Build ExpenseAI: a React + Vite + Tailwind expense tracker. Use `localStorage` for persistence, `recharts` for a category pie chart, and `lucide-react` for icons. Categorize each expense with a pure keyword-matching function (no external AI call) against these categories: Food, Transport, Shopping, Entertainment, Bills, Health, Education, Others — with a confidence score. Screens: an expense entry form (description + amount) with a live category preview, a dashboard with 4 summary cards (Total Spending, Today's Spending, Transactions, Top Category), a pie chart of spending by category, a searchable/deletable expense table, and an AI Insights panel that generates 2-4 short observations from the data (e.g. "You spent 48% on Food"). Keep components modular: `ExpenseForm`, `Dashboard`, `SummaryCards`, `PieChartComp`, `ExpenseTable`, `AIInsights`, and a `utils/categorizer.js` for the prediction logic.

Tips for running it agentically in Antigravity:
1. Point the agent at an empty folder and paste the prompt above as the first task — or, since the code is already written here, just ask it to "review and extend" this repo instead of generating from scratch.
2. Antigravity works best with one deliverable per task — split follow-ups like "add CSV export" or "add a month filter" into separate turns rather than bundling them into the initial build.
3. Ask it to run `npm run build` after any change so type/JSX errors surface immediately, same as was verified before this doc was generated.
4. If you want it to implement the stretch features, feed it the "Not yet implemented" list above one item at a time.

## Team split (per the brief)
- **Member 1 (Frontend & Dashboard):** `ExpenseForm`, `Dashboard`, `SummaryCards`, `PieChartComp`, `ExpenseTable`, responsive polish
- **Member 2 (Logic & AI):** `categorizer.js`, localStorage wiring in `App.jsx`, `AIInsights`, calculations
