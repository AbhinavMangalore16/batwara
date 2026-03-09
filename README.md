# Batwara -Graph-Powered Expense Splitter

**Batwara** (Hindi for "sharing" or "division") is our antidote to the chaos that erupts after group dinners, trips, and shared subscriptions. If you've ever had to untangle five different debts and wished for a calculator and peace treaty rolled into one, this app is for you.

Unlike traditional bill-splitting apps that stuff every relationship into a rigid table, Batwara embraces complexity by using two databases:

- **Neo4j** to map friendships and debts as a living graph. Debts are edges, people are nodes, and relationships update in real time.
- **PostgreSQL** as the immutable ledger of receipts, splits, and final settlements.

A clever heap-based algorithm then takes that messy graph, crunches numbers, and spits out the cleanest, simplest set of payments possible. No more five payment apps open at once.

---

## ✨ What Makes Batwara Tick?

### 📊 Graph‑Based Debt Tracking
Neo4j naturally represents the `OWES` and `SETTLEMENT` edges between users. You can query the graph to see who owes whom at any moment.

### 🧠 Smart Debt Simplification
Instead of a tangle of IOUs, Batwara runs a Min/Max Heap algorithm to match the biggest debtor with the biggest creditor and reduce the whole web to the fewest transfers.

### 💸 Flexible Splitting Options
Need an equal share, exact amounts, or a percentage? Batwara handles all three with ease.

### 🗄️ Dual‑Database Architecture
PostgreSQL stores immutable records (`bills`, `splits`, `settlements`) while Neo4j powers dynamic balance calculations and graph traversals.

### 💻 Clean React UI
A minimal dashboard shows your net balance and who you need to pay next, without fluff.

---

## 🏗 Architecture Overview

```
┌───────────────────────────────────────┐
│               API Layer               │
│ POST /makeBill  GET /balances  POST /persist │
└─────────────┬─────────────────────────┘
              │
     ┌────────▼────────┐
     │                 │
 ┌───▼──────┐      ┌───▼──────┐
 │PostgreSQL│      │  Neo4j   │
 ├──────────┤      ├──────────┤
 │ bills    │      │ OWES     │
 │ splits   │      │ SETTLEMENT│
 │settlement│      │ Person   │
 └──────────┘      └──────────┘
     │                 │
     └────────┬────────┘
              │
     ┌────────▼───────────┐
     │  Optimization      │
     │   Algorithm        │
     │  (Heap-based)      │
     └────────────────────┘
```

---

## 🗄️ Data Model

**PostgreSQL** holds the permanent records:
- `bill` — who paid, amount, split method
- `split` — breakdown of the bill
- `settlement` — simplified payouts ready to be executed

**Neo4j** maps the relationships:
- `Person` nodes
- `[OWES]` edges for raw debts
- `[SETTLEMENT]` edges for optimized transfers

Balances are computed on the fly: `balance = totalReceived - totalOwed`.

---

## � End‑User Workflow

From a user’s point of view, every backend module supports a simple, familiar flow:

1. **Add people to a group.**
   - The UI calls user/group routes to register you and your friends. Each friend becomes a `Person` node in Neo4j and a record in PostgreSQL.
2. **Log an expense.**
   - Fill out the form, select who paid, choose equal/custom/itemised split, and submit. The frontend posts to `/api/expenses/makeBill`. The service writes a `bill` row and creates `OWES` edges for everyone’s share.
3. **Check your balance.**
   - The dashboard hits `/api/expenses/balances/user/{userId}` which inspects the Neo4j graph and returns your current net position and outstanding edges.
4. **Optimize & settle.**
   - Tap “Preview settlement” to call `/api/expenses/settlements/optimized` and see a heap‑algorithm suggestion. If you like it, press “Run & save” (POST `/api/expenses/settlements/optimized/persist`), which stores the simplified transfers and updates the graph.
5. **Mark a transfer paid.**
   - When money changes hands, mark a settlement as paid via `/api/expenses/settlements/{id}/pay`. The backend flags the row and clears the corresponding graph edge, adjusting balances.

The result for the user is a clean, real‑time view of who owes what and the ability to instantly reduce a tangled web of debts to the fewest possible payments.

---

## �🚀 The Settlement Algorithm

Here's the magic:

1. Compute each user's net balance from the Neo4j graph.
2. Split the group into **Creditors** (positive balance) and **Debtors** (negative balance).
3. Use two heaps to efficiently match the highest creditor with the highest debtor.
4. Record a single settlement edge for that pair, adjust balances, and repeat.

The result? A tiny list of direct payments that settle everyone up in one go.

---

## 📡 Core API Endpoints

| Purpose                     | Endpoint                                              |
|----------------------------|-------------------------------------------------------|
| Log a new expense          | `POST /api/expenses/makeBill`                         |
| Get user balance           | `GET /api/expenses/balances/user/{userId}`            |
| Preview optimized debts    | `GET /api/expenses/settlements/optimized`            |
| Persist optimized debts    | `POST /api/expenses/settlements/optimized/persist`   |
| Mark settlement paid       | `POST /api/expenses/settlements/{id}/pay`            |

---

## 💻 Tech Stack

- **Frontend:** React, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js
- **Databases:** PostgreSQL + Neo4j
- **Algorithms:** Min/Max Heaps, Graph Traversal

---

## 🚀 Run It Locally

```bash
# clone
git clone https://github.com/yourusername/batwara.git
cd batwara

# databases
# PostgreSQL must be running locally
# Neo4j AuraDB or Desktop should be running

# env vars (/backend/.env)
PG_USER=your_pg_user
PG_PASS=your_pg_pass
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASS=your_neo4j_pass

# start backend
cd backend
npm install
npm run dev

# start frontend
cd ../frontend
npm install
npm run dev
```

---

## 🔮 Future Scope

- **Mobile apps:** React Native or Flutter clients for iOS/Android.
- **Real‑time sync:** WebSockets to push live balance updates.
- **Group chat integration:** Slack/WhatsApp bots to log expenses on the fly.
- **Cryptocurrency support:** Let users settle in crypto or stablecoins.
- **Machine learning:** Predict who'll pay next based on history.
- **Multi‑currency:** Automatic conversion for international trips.
- **Open API:** Let third-party services plug into Batwara's graph.

---

Thanks for checking out Batwara — here's to ending post‑dinner math wars forever! 
