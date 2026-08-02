import { Wallet, CalendarDays, Receipt, Crown } from 'lucide-react'
import { getCategoryIcon } from '../utils/categorizer'

function Card({ icon, label, value, accent }) {
  return (
    <div className="bg-ledger-panel border border-ledger-line rounded-xl p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-ledger-muted uppercase tracking-wide">{label}</div>
        <div className="tabular text-lg font-semibold text-ledger-text truncate">{value}</div>
      </div>
    </div>
  )
}

export default function SummaryCards({ expenses }) {
  const today = new Date().toDateString()
  const todaySpend = expenses
    .filter((e) => new Date(e.date).toDateString() === today)
    .reduce((sum, e) => sum + e.amount, 0)
  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0)

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})
  const highest = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card icon={<Wallet size={20} />} label="Total Spending" value={`₹${totalSpend.toLocaleString('en-IN')}`} accent="#F2A93B" />
      <Card icon={<CalendarDays size={20} />} label="Today's Spending" value={`₹${todaySpend.toLocaleString('en-IN')}`} accent="#3FCF8E" />
      <Card icon={<Receipt size={20} />} label="Transactions" value={expenses.length} accent="#E6607A" />
      <Card
        icon={highest ? <span>{getCategoryIcon(highest[0])}</span> : <Crown size={20} />}
        label="Top Category"
        value={highest ? highest[0] : '—'}
        accent="#8B98A9"
      />
    </div>
  )
}
