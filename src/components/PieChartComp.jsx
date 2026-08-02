import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#F2A93B', '#3FCF8E', '#E6607A', '#5DA9E9', '#C792EA', '#FF8A65', '#8B98A9']

export default function PieChartComp({ expenses }) {
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})
  const data = Object.entries(byCategory).map(([name, value]) => ({ name, value }))

  if (data.length === 0) {
    return (
      <div className="bg-ledger-panel border border-ledger-line rounded-xl p-6 h-80 flex items-center justify-center text-ledger-muted">
        Add an expense to see the category breakdown.
      </div>
    )
  }

  return (
    <div className="bg-ledger-panel border border-ledger-line rounded-xl p-4 h-80">
      <h3 className="text-sm font-semibold text-ledger-muted uppercase tracking-wide mb-2">
        Spending by Category
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#161F2B" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#0F1720', border: '1px solid #243040', borderRadius: 8, color: '#E7ECF2' }}
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#8B98A9' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
