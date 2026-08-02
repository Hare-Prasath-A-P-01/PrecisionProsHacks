import { Sparkles } from 'lucide-react'

function buildInsights(expenses) {
  if (expenses.length === 0) return ['Add a few expenses to unlock insights.']

  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})

  const insights = []
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1])

  if (sorted.length > 0) {
    const [topCat, topAmt] = sorted[0]
    const pct = Math.round((topAmt / total) * 100)
    insights.push(`You spent ${pct}% of your total on ${topCat}.`)
    if (pct >= 40) {
      insights.push(`Consider reducing ${topCat} expenses — it's your biggest category.`)
    }
  }

  if (byCategory['Transport'] && byCategory['Transport'] / total < 0.1) {
    insights.push('Transport spending is low this period.')
  }
  if (byCategory['Bills']) {
    insights.push('Bills are tracked consistently — good habit to keep.')
  }
  if (sorted.length >= 2) {
    const [secondCat] = sorted[1]
    insights.push(`${secondCat} is your second-largest spending area.`)
  }

  return insights.slice(0, 4)
}

export default function AIInsights({ expenses }) {
  const insights = buildInsights(expenses)

  return (
    <div className="bg-ledger-panel border border-ledger-line rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-ledger-amber" />
        <h3 className="text-sm font-semibold text-ledger-muted uppercase tracking-wide">
          AI Insights
        </h3>
      </div>
      <ul className="flex flex-col gap-2">
        {insights.map((text, i) => (
          <li key={i} className="text-sm text-ledger-text flex gap-2">
            <span className="text-ledger-amber">•</span>
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}
