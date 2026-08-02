import SummaryCards from './SummaryCards'
import PieChartComp from './PieChartComp'
import ExpenseTable from './ExpenseTable'
import AIInsights from './AIInsights'

export default function Dashboard({ expenses, onDelete }) {
  return (
    <div className="flex flex-col gap-5">
      <SummaryCards expenses={expenses} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <PieChartComp expenses={expenses} />
        </div>
        <div className="lg:col-span-2">
          <AIInsights expenses={expenses} />
        </div>
      </div>
      <ExpenseTable expenses={expenses} onDelete={onDelete} />
    </div>
  )
}
