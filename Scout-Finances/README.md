# Cub Scout Pack Financial Tracker - Web App

A fully functional web application that replicates your Excel-based Scout Pack Ledger system. Built with vanilla JavaScript and IndexedDB for offline-capable data storage.

## Features

### Scout Accounts Management
- Track individual scout accounts with beginning balances
- Automatically calculate deposits, withdrawals, and current balances
- View pack dues payment status and method (Scout Account vs Family Cash)
- Add/delete scouts

### Transaction Ledger
- Record all scout account transactions:
  - **Deposit**: Fundraising income (25% goes to pack)
  - **Withdrawal**: Fees and expenses paid from scout account
  - **Pack Dues Paid**: Family pays cash upfront
  - **Reimbursement**: Reimburse family for cash payments (25% goes to pack)
- Automatic calculation of pack's 25% share
- Sort by date (newest first)

### Pack Finances
- Comprehensive pack fund summary:
  - Pack dues from scout accounts
  - Pack dues from family cash payments
  - Fundraising share (25% from all deposits/reimbursements)
  - Other pack income
  - Total pack expenses
  - Reimbursements paid to scouts
  - Current pack balance
- Track pack-level income and expenses
- Categorize transactions (Registration, Awards, Events, Donations, etc.)

## All Excel Formulas Implemented

The web app replicates all formulas from your Excel spreadsheet:

### Scout Account Calculations
- ✅ Total Deposits: `SUMIFS` for Deposit + Reimbursement types
- ✅ Total Withdrawals: `SUMIFS` for Withdrawal type
- ✅ Current Balance: Beginning + Deposits - Withdrawals
- ✅ Pack Dues Paid: `COUNTIFS` to check for pack dues transactions
- ✅ Payment Method: Logic to determine Scout Account vs Family Cash

### Pack Finance Calculations
- ✅ Pack's 25% Share: `IF(OR(type="Deposit", type="Reimbursement"), amount * 0.25, 0)`
- ✅ Pack Dues from Accounts: `COUNTIFS` × $100
- ✅ Pack Dues from Cash: `COUNTIF` × $100
- ✅ Total Revenue: Sum of all income sources
- ✅ Total Expenses: Sum of pack expenses
- ✅ Pack Balance: Revenue - Expenses - Reimbursements

## Technology Stack

- **HTML/CSS**: Modern, responsive UI
- **Vanilla JavaScript**: No frameworks needed
- **IndexedDB**: Browser-based database for offline storage
- **No server required**: Runs entirely in the browser

## How to Use

1. **Open the App**: Simply open `index.html` in a modern web browser
2. **Add Scouts**: Click "Add Scout" to create scout accounts
3. **Record Transactions**: Use the Transaction Ledger to record all scout activity
4. **Track Pack Finances**: Add pack-level income and expenses
5. **View Reports**: All calculations update automatically in real-time

## Data Storage

- All data is stored locally in your browser using IndexedDB
- Data persists across browser sessions
- No internet connection required
- Data stays private on your device

## Future Enhancements

When you're ready to set up a real database, the app can easily be extended to:
- Use a server-side database (PostgreSQL, MySQL, MongoDB)
- Add user authentication
- Enable multi-device sync
- Export reports to PDF or Excel
- Add data backup/restore functionality

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Sample Data Structure

### Scout Account Transaction Example
```javascript
{
  date: "2025-01-15",
  scoutName: "Scout 1",
  description: "Popcorn Sales",
  type: "Deposit",
  amount: 200.00,
  notes: "Fall fundraiser"
}
```

### Pack Transaction Example
```javascript
{
  date: "2025-01-01",
  description: "Adult Leader Registrations",
  type: "Expense",
  amount: 875.00,
  category: "Registration",
  notes: "7 leaders @ $125"
}
```

## Transaction Types Explained

### Scout Account Transactions
- **Deposit**: Money earned by scout through fundraising (pack gets 25%)
- **Withdrawal**: Scout pays for fees, camp, activities from their account
- **Pack Dues Paid**: Family pays $100 cash to pack directly (before scout earns it)
- **Reimbursement**: Pack reimburses family for cash dues payment (pack gets 25%)

### Pack Transactions
- **Income**: Money received by pack (donations, grants, etc.)
- **Expense**: Money spent by pack (supplies, awards, events, etc.)

## Support

This is a standalone web application. To use:
1. Keep all three files in the same directory (`index.html`, `styles.css`, `app.js`)
2. Open `index.html` in your web browser
3. Start adding scouts and transactions!

---

Built with ❤️ for Cub Scout Pack financial management
