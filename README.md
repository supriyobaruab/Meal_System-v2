# MealFlow — House Meal & Cost Sharing System

A modern, responsive React web application built with Tailwind CSS for managing household meals and sharing costs for a 5-person household (or customizable members).

![MealFlow Banner](https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

1. **Member Management**:
   - Initial 5 default members (`Member 1` through `Member 5`).
   - Add new roommates, rename members, or remove members with confirmation guards.

2. **Daily Meal Entry**:
   - Quick date selector (defaulting to the current/selected period).
   - Rapid inline batch entry for all 5 household members simultaneously.
   - Quick presets (`0`, `1`, `2`, `3`) and fractional adjustments (`+0.5`, `-0.5`, `+1`) supporting partial meals like `0.5`, `1.5`, `2.5`.
   - "Set All" shortcut to configure everyone's meals in a single click.
   - Complete meal history table with edit and delete capabilities.

3. **Contribution Tracking**:
   - Record money deposits into the household meal fund across dates.
   - Presets for common amounts (৳500, ৳1000, ৳2000, ৳3000, ৳5000).
   - Detailed ledger with member filtering, transaction count, and edit/delete actions.

4. **Monthly Period System**:
   - Isolate accounting by month (e.g. `September 2026`).
   - Previous/Next navigation, month picker, and "Today" shortcut.
   - Meal counts, rates, and balances update dynamically per period.

5. **Meal Calculation Engine**:
   - **Total Meals** = $\sum \text{all members' meals}$
   - **Total Contributions** = $\sum \text{all deposits in month}$
   - **Meal Rate** = $\frac{\text{Total Contributions}}{\text{Total Meals}}$
   - **Member Meal Cost** = $\text{Member Meals} \times \text{Meal Rate}$
   - **Balance** = $\text{Member Contribution} - \text{Member Meal Cost}$
   - Visual status badges:
     - **Receives** ($\text{Balance} > 0$)
     - **Owes** ($\text{Balance} < 0$)
     - **Settled** ($\text{Balance} = 0$)
   - Uses Bangladeshi Taka (**৳**) throughout the user interface with proper currency formatting.

6. **Settlement & Debt Optimization**:
   - Separates members into **Creditors** ($\text{Balance} > 0$) and **Debtors** ($\text{Balance} < 0$).
   - Implements a **greedy min-cash-flow algorithm** to minimize the total number of physical transfers needed to square up all balances (e.g. `Person D → Person A: ৳600`).
   - **"Copy for WhatsApp / Group"**: One-click formatted clipboard export to send directly to your household Messenger/WhatsApp group.
   - **Checklist tracking**: Mark transfers as complete as roommates send bKash, Nagad, or cash.

7. **Local Persistence & Portability**:
   - Automatic `localStorage` persistence.
   - **Export to JSON** backup file.
   - **Import from JSON** backup file.
   - Reset to the demo scenario (September 2026 with 150 meals and ৳11,000 fund) or reset to blank slate.

---

## 🛠 Tech Stack

- **React 19**
- **Vite**
- **Tailwind CSS**
- **Lucide React** (clean minimal financial & productivity icons)
- **Zero console errors** & full test coverage of calculation utilities

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Check Linting
```bash
npm run lint
```
