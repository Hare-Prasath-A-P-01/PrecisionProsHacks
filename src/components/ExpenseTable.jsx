import { useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import { getCategoryIcon } from '../utils/categorizer'

export default function ExpenseTable({ expenses, onDelete }) {
  const [query, setQuery] = useState('')

  const filtered = expenses
    .filter((e) => e.description.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="bg-ledger-panel border border-ledger-line rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 gap-3">
        <h3 className="text-sm font-semibold text-ledger-muted uppercase tracking-wide">
          Expenses
        </h3>
        <div className="relative w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ledger-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-ledger-bg border border-ledger-line rounded-lg pl-8 pr-3 py-1.5 text-sm text-ledger-text placeholder:text-ledger-muted focus:outline-none focus:ring-2 focus:ring-ledger-amber"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ledger-muted border-b border-ledger-line">
              <th className="py-2 pr-3 font-medium">Description</th>
              <th className="py-2 pr-3 font-medium">Category</th>
              <th className="py-2 pr-3 font-medium">Amount</th>
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-ledger-muted">
                  No expenses match.
                </td>
              </tr>
            )}
            {filtered.map((e) => (
              <tr key={e.id} className="border-b border-ledger-line/60 hover:bg-ledger-bg/40">
                <td className="py-2 pr-3 text-ledger-text">{e.description}</td>
                <td className="py-2 pr-3">
                  <span className="inline-flex items-center gap-1">
                    {getCategoryIcon(e.category)} {e.category}
                  </span>
                </td>
                <td className="py-2 pr-3 tabular text-ledger-text">₹{e.amount.toLocaleString('en-IN')}</td>
                <td className="py-2 pr-3 text-ledger-muted">
                  {new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </td>
                <td className="py-2 pr-3 text-right">
                  <button
                    onClick={() => onDelete(e.id)}
                    className="text-ledger-muted hover:text-ledger-rose transition"
                    aria-label={`Delete ${e.description}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
