# 📊 ExpenseAI — Smart Expense Tracker

**ExpenseAI** is a premium, self-contained, smart expense tracking dashboard that predicts expense categories in real-time as you type, visualizes spending breakdowns, generates data-driven smart insights, and supports persistent storage.

Built for the **Precision Pro Mini Hackathon Series** by **Hare Prasath A P** & **Jagan V N** of team **Precision Pro's**.

---

## 🚀 Live Demo Walkthrough (Step-by-Step)

Follow this structured flow to showcase the full capabilities of **ExpenseAI** during a demonstration:

### 1. Launching the App
1. Run `npm install` followed by `npm run dev`.
2. Open the local URL in your browser: `http://localhost:5173/`.
3. Notice the premium glassmorphic dark mode layout loading instantly.

### 2. Testing Live Categorization (The "Wow" Factor)
Type the following descriptions in the input box and observe the **live prediction pill** and confidence score updating in real-time:
* **"Pizza from Domino's"** 🍕 $\rightarrow$ Predicts **Food** with high confidence.
* **"Uber ride to the office"** 🚗 $\rightarrow$ Predicts **Transport** with high confidence.
* **"Bought shoes from Amazon"** 🛍️ $\rightarrow$ Predicts **Shopping** with high confidence.
* **"Netflix monthly subscription"** 🎬 $\rightarrow$ Predicts **Entertainment** with high confidence.
* **"Electricity bill payment"** 💡 $\rightarrow$ Predicts **Bills** with high confidence.

### 3. Populating the Dashboard
1. Fill in the Amount for each expense and click **Add Expense** (or press Enter).
2. Observe the **4 Stat Cards** updating dynamically:
   * **Total Spending**: Auto-calculates cumulative expenses.
   * **Today's Spending**: Displays only the transactions created today.
   * **Transactions**: Tracks the total count of logs.
   * **Top Category**: Highlights your highest spending category.
3. Observe the **Interactive Pie Chart** rendering colored donut slices with tooltips showing rupee values on hover.

### 4. Reading Smart Insights
Once you log 5 or more expenses, the **Smart Insights** panel generates up to 4 real-time observations:
* Displays percentage spent on your highest category (e.g., *"You spent 45% of your tracked total on food"*).
* Flags low-spending categories (under 8% share).
* Suggests budget caps if food/dining expenses exceed 35% of total budget.

### 5. Advanced Features Demo
* **Live Search**: Type "Pizza" or "Shopping" in the Search bar to instantly filter the expense table.
* **CSV Export**: Click **Export CSV** to download a formatted spreadsheet (`expenseai-export.csv`) of all logged transactions.
* **Dark/Light Mode Toggle**: Click the theme toggle button in the header to switch between Dark (emerald/graphite) and Light (ivory/slate) modes.
* **Persistence**: Refresh the page—all expenses remain intact, powered by safe local storage.

---

## 🛠️ Technology Stack & Core Packages
* **Frontend**: React (Hooks, Context, Memoization)
* **Styling**: Vanilla CSS (Tailwind CSS configuration ready)
* **Visualizations**: [Recharts](https://recharts.org/) (Interactive Donut charts)
* **Icons**: [Lucide React](https://lucide.dev/) (Premium SVG Icons)
* **Persistence**: LocalStorage with automatic fallback safety wrapper

---

## 📂 Project Structure
```
src/
├── App.jsx            # Primary entrypoint containing state, UI layout, & Storage wrappers
├── main.jsx           # ReactDOM renderer
├── index.css          # Core font import, selection colors, & global base styles
└── utils/
    └── categorizer.js # Heuristic keyword-matching predictive engine
```

---

## 🧠 Under the Hood: The Prediction Engine
The categorization logic is driven by a local, zero-latency heuristic algorithm. It evaluates input text against a mapped dictionary of common commercial keywords, factoring in text density to calculate a dynamic confidence percentage:
$$\text{Confidence} = \max(70, 97 - (\text{words} - 1) \times 4)$$
If no keywords match, it falls back to **Others** with a 40% default confidence rating.

---

## 👥 Authors & Team
Developed with ❤️ for **Precision Pro's** by:
* **Hare Prasath A P**
* **Jagan V N**
