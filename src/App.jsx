import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer,
} from "recharts";
import {
  Plus, Moon, Sun, Search, Trash2, Download, Receipt, Wallet,
  CalendarDays, ListOrdered, Crown, Sparkles, UtensilsCrossed,
  Bus, ShoppingBag, Clapperboard, FileText, HeartPulse, GraduationCap, CircleDot,
  Zap, Lightbulb,
} from "lucide-react";

/* ---------------------------------------------------------
   Categorization Engine (utils/categorizer.js equivalent)
--------------------------------------------------------- */
const CATEGORY_KEYWORDS = {
  Food: ["pizza", "burger", "dominos", "domino's", "kfc", "mcdonald", "hotel", "restaurant", "swiggy", "zomato", "cafe", "biryani"],
  Transport: ["uber", "ola", "bus", "fuel", "petrol", "diesel", "train", "auto", "cab", "metro", "flight", "irctc"],
  Shopping: ["amazon", "flipkart", "myntra", "ajio", "shopping", "mall", "store"],
  Entertainment: ["netflix", "prime", "movie", "hotstar", "spotify", "cinema", "bookmyshow", "youtube"],
  Bills: ["electricity", "wifi", "eb", "water", "gas", "recharge", "broadband", "dth"],
  Health: ["hospital", "medicine", "apollo", "doctor", "clinic", "pharmacy", "medplus"],
  Education: ["college", "course", "udemy", "book", "fees", "tuition", "coursera", "school"],
};

const CATEGORY_META = {
  Food: { color: "#D9773F", icon: UtensilsCrossed },
  Transport: { color: "#3D6EA5", icon: Bus },
  Shopping: { color: "#A6528C", icon: ShoppingBag },
  Entertainment: { color: "#C9971F", icon: Clapperboard },
  Bills: { color: "#5B6B73", icon: FileText },
  Health: { color: "#2F8F72", icon: HeartPulse },
  Education: { color: "#5B4E9E", icon: GraduationCap },
  Others: { color: "#8A8578", icon: CircleDot },
};
const CATEGORY_ORDER = Object.keys(CATEGORY_META);

function predictCategory(description) {
  const text = description.toLowerCase();
  for (const category of Object.keys(CATEGORY_KEYWORDS)) {
    const hit = CATEGORY_KEYWORDS[category].find((kw) => text.includes(kw));
    if (hit) {
      const confidence = Math.min(97, 78 + hit.length * 2);
      return { category, confidence, matched: hit };
    }
  }
  return { category: "Others", confidence: 55, matched: null };
}

/* ---------------------------------------------------------
   Storage helpers (persistent, per-user)
--------------------------------------------------------- */
const STORE_KEY = "expenseai:transactions";

async function loadExpenses() {
  try {
    if (window.storage && typeof window.storage.get === "function") {
      const res = await window.storage.get(STORE_KEY);
      return res ? JSON.parse(res.value) : [];
    }
    const val = localStorage.getItem(STORE_KEY);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}
async function saveExpenses(list) {
  try {
    if (window.storage && typeof window.storage.set === "function") {
      await window.storage.set(STORE_KEY, JSON.stringify(list));
      return;
    }
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — state still holds this session's data */
  }
}

/* ---------------------------------------------------------
   Small helpers
--------------------------------------------------------- */
const rupee = (n) =>
  "\u20B9" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const todayKey = () => new Date().toISOString().slice(0, 10);

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ---------------------------------------------------------
   App
--------------------------------------------------------- */
export default function App() {
  const [dark, setDark] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadExpenses().then((list) => {
      setExpenses(list);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) saveExpenses(expenses);
  }, [expenses, loaded]);

  useEffect(() => {
    if (!desc.trim()) {
      setPreview(null);
      return;
    }
    setPreview(predictCategory(desc));
  }, [desc]);

  const theme = dark
    ? {
        paper: "#12161A", card: "#1B2126", cardAlt: "#212830",
        ink: "#EDEAE0", inkSoft: "#9B988B", border: "rgba(255,255,255,0.09)",
        accent: "#4FA98A", accentInk: "#0C1A16",
      }
    : {
        paper: "#FAF6ED", card: "#FFFFFF", cardAlt: "#F3EEE1",
        ink: "#211F1A", inkSoft: "#6B6558", border: "rgba(33,31,26,0.10)",
        accent: "#2F6F5E", accentInk: "#FFFFFF",
      };

  const addExpense = useCallback(
    (e) => {
      e.preventDefault();
      const amt = parseFloat(amount);
      if (!desc.trim() || !amt || amt <= 0) return;
      const result = predictCategory(desc);
      const entry = {
        id: uid(),
        description: desc.trim(),
        amount: amt,
        category: result.category,
        confidence: result.confidence,
        date: new Date().toISOString(),
      };
      setExpenses((prev) => [entry, ...prev]);
      setDesc("");
      setAmount("");
      setPreview(null);
    },
    [desc, amount]
  );

  const deleteExpense = (id) => setExpenses((prev) => prev.filter((x) => x.id !== id));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return expenses;
    return expenses.filter(
      (x) => x.description.toLowerCase().includes(q) || x.category.toLowerCase().includes(q)
    );
  }, [expenses, search]);

  const stats = useMemo(() => {
    const today = todayKey();
    const todaySpend = expenses
      .filter((x) => x.date.slice(0, 10) === today)
      .reduce((s, x) => s + x.amount, 0);
    const total = expenses.reduce((s, x) => s + x.amount, 0);
    const byCategory = {};
    expenses.forEach((x) => {
      byCategory[x.category] = (byCategory[x.category] || 0) + x.amount;
    });
    const highest = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    return {
      todaySpend,
      total,
      count: expenses.length,
      highest: highest ? highest[0] : "—",
      byCategory,
    };
  }, [expenses]);

  const pieData = CATEGORY_ORDER.filter((c) => stats.byCategory[c] > 0).map((c) => ({
    name: c,
    value: stats.byCategory[c],
    color: CATEGORY_META[c].color,
  }));

  const insights = useMemo(() => {
    if (expenses.length === 0) return [];
    const list = [];
    const total = stats.total || 1;
    const sorted = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]);
    if (sorted.length) {
      const [topCat, topAmt] = sorted[0];
      const pct = Math.round((topAmt / total) * 100);
      list.push(`You spent ${pct}% of your tracked total on ${topCat.toLowerCase()}.`);
    }
    if (sorted.length > 1) {
      const [, lowAmt] = sorted[sorted.length - 1];
      const lowCat = sorted[sorted.length - 1][0];
      if (lowAmt / total < 0.08) {
        list.push(`${lowCat} spending is low — under 8% of your total.`);
      }
    }
    const foodEntry = sorted.find(([c]) => c === "Food");
    if (foodEntry && foodEntry[1] / total > 0.35) {
      list.push("Food is a big share of your spending. Consider setting a weekly cap.");
    }
    if (expenses.length >= 5) {
      list.push(`You've logged ${expenses.length} transactions so far — keep it up.`);
    }
    return list.slice(0, 4);
  }, [expenses, stats]);

  const exportCSV = () => {
    const header = "Description,Category,Amount,Date\n";
    const rows = expenses
      .map((x) => `"${x.description.replace(/"/g, '""')}",${x.category},${x.amount},${x.date}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenseai-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        background: theme.paper, color: theme.ink, minHeight: "100vh",
        fontFamily: "'Inter', sans-serif", padding: "28px 20px 60px",
        transition: "background .25s, color .25s",
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap"
        rel="stylesheet"
      />

      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, letterSpacing: "-0.01em" }}>
              ExpenseAI
            </div>
            <div style={{ fontSize: 12.5, color: theme.inkSoft }}>knows where your money went</div>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
            style={{
              width: 38, height: 38, borderRadius: 10, border: `1px solid ${theme.border}`,
              background: theme.card, color: theme.ink, display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer",
            }}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Entry form */}
        <form
          onSubmit={addExpense}
          style={{
            background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 14,
            padding: "18px 20px", marginBottom: 22,
            boxShadow: dark ? "none" : "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Domino's Pizza"
              style={{
                flex: "2 1 220px", background: theme.cardAlt, border: `1px solid ${theme.border}`,
                borderRadius: 9, padding: "10px 12px", color: theme.ink, fontSize: 14.5, outline: "none",
              }}
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              type="number"
              min="0"
              step="0.01"
              style={{
                flex: "1 1 120px", background: theme.cardAlt, border: `1px solid ${theme.border}`,
                borderRadius: 9, padding: "10px 12px", color: theme.ink, fontSize: 14.5,
                fontFamily: "'JetBrains Mono', monospace", outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                display: "flex", alignItems: "center", gap: 6, background: theme.accent,
                color: theme.accentInk, border: "none", borderRadius: 9, padding: "10px 18px",
                fontWeight: 600, fontSize: 14, cursor: "pointer",
              }}
            >
              <Plus size={16} /> Add expense
            </button>
          </div>

          {preview && (
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <Zap size={14} color={theme.accent} />
              <span style={{ color: theme.inkSoft }}>Predicted category:</span>
              <CategoryPill category={preview.category} theme={theme} />
              <span style={{ color: theme.inkSoft, fontFamily: "'JetBrains Mono', monospace" }}>
                {preview.confidence}% match confidence
              </span>
            </div>
          )}
        </form>

        {/* Summary cards */}
        <div
          style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12, marginBottom: 22,
          }}
        >
          <StatCard theme={theme} label="Today's spending" value={rupee(stats.todaySpend)} icon={CalendarDays} />
          <StatCard theme={theme} label="Total spending" value={rupee(stats.total)} icon={Wallet} />
          <StatCard theme={theme} label="Transactions" value={stats.count} icon={ListOrdered} />
          <StatCard theme={theme} label="Top category" value={stats.highest} icon={Crown} />
        </div>

        {/* Pie chart + Insights */}
        <div
          style={{
            display: "grid", gridTemplateColumns: pieData.length ? "1fr 1fr" : "1fr",
            gap: 16, marginBottom: 22,
          }}
        >
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 18 }}>
            <SectionLabel theme={theme}>Spending by category</SectionLabel>
            {pieData.length === 0 ? (
              <div style={{ color: theme.inkSoft, fontSize: 13.5, padding: "30px 0", textAlign: "center" }}>
                Add an expense to see the breakdown.
              </div>
            ) : (
              <>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} stroke={theme.card} strokeWidth={2} />
                        ))}
                      </Pie>
                      <ReTooltip
                        formatter={(v, n) => [rupee(v), n]}
                        contentStyle={{ background: theme.cardAlt, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12.5, color: theme.ink }}
                        itemStyle={{ color: theme.ink }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 6 }}>
                  {pieData.map((d) => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: theme.inkSoft }}>
                      <span style={{ width: 9, height: 9, borderRadius: 3, background: d.color, display: "inline-block" }} />
                      {d.name} · {Math.round((d.value / stats.total) * 100)}%
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 18 }}>
            <SectionLabel theme={theme}>Smart Insights</SectionLabel>
            {insights.length === 0 ? (
              <div style={{ color: theme.inkSoft, fontSize: 13.5, padding: "30px 0", textAlign: "center" }}>
                Insights appear once you've logged a few expenses.
              </div>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {insights.map((line, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex", gap: 8, fontSize: 13.5, lineHeight: 1.5,
                      background: theme.cardAlt, borderRadius: 9, padding: "9px 11px",
                    }}
                  >
                    <Lightbulb size={14} color={theme.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Table controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 10, flexWrap: "wrap" }}>
          <SectionLabel theme={theme} noMargin>Expense table</SectionLabel>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: theme.inkSoft }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search expenses"
                style={{
                  background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 9,
                  padding: "8px 10px 8px 30px", color: theme.ink, fontSize: 13, outline: "none", width: 190,
                }}
              />
            </div>
            <button
              onClick={exportCSV}
              disabled={expenses.length === 0}
              style={{
                display: "flex", alignItems: "center", gap: 6, background: theme.card,
                border: `1px solid ${theme.border}`, borderRadius: 9, padding: "8px 12px",
                color: theme.ink, fontSize: 13, cursor: expenses.length ? "pointer" : "default",
                opacity: expenses.length ? 1 : 0.5,
              }}
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 14, overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "34px 0", textAlign: "center", color: theme.inkSoft, fontSize: 13.5 }}>
              {expenses.length === 0 ? "No expenses yet — add your first one above." : "No expenses match your search."}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                  {["Description", "Category", "Amount", "Date", ""].map((h) => (
                    <th key={h} style={{ textAlign: h === "Amount" ? "right" : "left", padding: "10px 16px", color: theme.inkSoft, fontWeight: 500, fontSize: 12 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((x) => (
                  <tr key={x.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: "10px 16px" }}>{x.description}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <CategoryPill category={x.category} theme={theme} />
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>
                      {rupee(x.amount)}
                    </td>
                    <td style={{ padding: "10px 16px", color: theme.inkSoft }}>
                      {new Date(x.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      <button
                        onClick={() => deleteExpense(x.id)}
                        aria-label="Delete expense"
                        style={{ background: "none", border: "none", color: theme.inkSoft, cursor: "pointer", padding: 4 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <footer
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: `1px solid ${theme.border}`,
            textAlign: "center",
            fontSize: 12.5,
            color: theme.inkSoft,
          }}
        >
          Developed by <span style={{ fontWeight: 600, color: theme.ink }}>Hare Prasath A P</span> &{" "}
          <span style={{ fontWeight: 600, color: theme.ink }}>Jagan V N</span> of{" "}
          <span style={{ color: theme.accent, fontWeight: 600 }}>Precision Pro's</span>
        </footer>
      </div>
    </div>
  );
}

function StatCard({ theme, label, value, icon: Icon }) {
  return (
    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: theme.inkSoft, fontSize: 12, marginBottom: 8 }}>
        <Icon size={13} /> {label}
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, letterSpacing: "-0.01em" }}>
        {value}
      </div>
    </div>
  );
}

function SectionLabel({ theme, children, noMargin }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 600, color: theme.ink, marginBottom: noMargin ? 0 : 14 }}>
      {children}
    </div>
  );
}

function CategoryPill({ category, theme }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.Others;
  const Icon = meta.icon;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12,
        padding: "3px 9px 3px 7px", borderRadius: 999, background: meta.color + "22",
        color: meta.color, fontWeight: 500,
      }}
    >
      <Icon size={11} /> {category}
    </span>
  );
}
