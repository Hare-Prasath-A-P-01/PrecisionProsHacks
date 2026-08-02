import { useEffect, useState } from 'react'
import { Wallet } from 'lucide-react'
import ExpenseForm from './components/ExpenseForm'
import Dashboard from './components/Dashboard'

const STORAGE_KEY = 'expenseai_expenses'

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  }, [expenses])

  function addExpense(expense) {
    setExpenses((prev) => [expense, ...prev])
  }

  function deleteExpense(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="min-h-screen bg-ledger-bg text-ledger-text">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
        <header className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ledger-amber/15 text-ledger-amber flex items-center justify-center">
            <Wallet size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ExpenseAI</h1>
            <p className="text-xs text-ledger-muted">Your spending, categorized automatically.</p>
          </div>
        </header>

        <ExpenseForm onAdd={addExpense} />
        <Dashboard expenses={expenses} onDelete={deleteExpense} />
      </div>
    </div>
  )
}
