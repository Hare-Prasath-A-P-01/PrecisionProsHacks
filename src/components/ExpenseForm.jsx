import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { predictCategory, getCategoryIcon } from '../utils/categorizer'

export default function ExpenseForm({ onAdd }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  const preview = useMemo(() => predictCategory(description), [description])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = description.trim()
    const value = parseFloat(amount)
    if (!trimmed || !value || value <= 0) return

    const { category } = predictCategory(trimmed)
    onAdd({
      id: crypto.randomUUID(),
      description: trimmed,
      amount: value,
      category,
      date: new Date().toISOString(),
    })
    setDescription('')
    setAmount('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-ledger-panel border border-ledger-line rounded-xl p-5 flex flex-col gap-4"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Expense description — e.g. Domino's Pizza"
          className="flex-1 bg-ledger-bg border border-ledger-line rounded-lg px-4 py-3 text-ledger-text placeholder:text-ledger-muted focus:outline-none focus:ring-2 focus:ring-ledger-amber"
        />
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (₹)"
          className="sm:w-40 bg-ledger-bg border border-ledger-line rounded-lg px-4 py-3 tabular text-ledger-text placeholder:text-ledger-muted focus:outline-none focus:ring-2 focus:ring-ledger-amber"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-ledger-amber text-ledger-bg font-semibold rounded-lg px-5 py-3 hover:brightness-110 active:brightness-95 transition"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add
        </button>
      </div>

      {description.trim() && (
        <div className="flex items-center gap-2 text-sm text-ledger-muted">
          <span>Predicted:</span>
          <span className="inline-flex items-center gap-1 bg-ledger-bg border border-ledger-line rounded-full px-3 py-1 text-ledger-text">
            <span>{getCategoryIcon(preview.category)}</span>
            <span>{preview.category}</span>
          </span>
          <span className="tabular text-ledger-amber">{preview.confidence}% confidence</span>
        </div>
      )}
    </form>
  )
}
