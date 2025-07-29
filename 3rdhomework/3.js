let transactions = [
  { id: 1, type: "income", amount: 50000, category: "salary", date: "2024-01-15" },
  { id: 2, type: "expense", amount: 15000, category: "rent", date: "2024-01-16" },
  { id: 3, type: "expense", amount: 5000, category: "food", date: "2024-01-17" },
  { id: 4, type: "income", amount: 20000, category: "freelance", date: "2024-01-18" },
  { id: 5, type: "expense", amount: 8000, category: "transport", date: "2024-01-19" },
  { id: 6, type: "expense", amount: 3000, category: "food", date: "2024-01-20" },
  { id: 7, type: "income", amount: 15000, category: "bonus", date: "2024-01-21" },
];

// 1. Total Income
let totalIncome = transactions.reduce((sum, t) => {
  return t.type === "income" ? sum + t.amount : sum;
}, 0);

// 2. Total Expenses
let totalExpenses = transactions.reduce((sum, t) => {
  return t.type === "expense" ? sum + t.amount : sum;
}, 0);

// 3. Group by Category
let categoryTotals = transactions.reduce((acc, t) => {
  if (!acc[t.category]) {
    acc[t.category] = { type: t.type, total: 0 };
  }
  acc[t.category].total += t.amount;
  return acc;
}, {});

// 4. Largest Transaction
let largestTransaction = transactions.reduce((max, t) => {
  return t.amount > max.amount ? t : max;
}, transactions[0]);

// 5. Summary Object
let summary = transactions.reduce(
  (acc, t) => {
    acc.netBalance += t.type === "income" ? t.amount : -t.amount;
    acc.count[t.type]++;
    acc.totalAmount += t.amount;
    acc.totalCount++;
    if (!acc.categorySums[t.category]) acc.categorySums[t.category] = 0;
    acc.categorySums[t.category] += t.amount;
    return acc;
  },
  {
    netBalance: 0,
    count: { income: 0, expense: 0 },
    totalAmount: 0,
    totalCount: 0,
    categorySums: {},
  }
);

// Find most expensive category
let mostExpensiveCategory = Object.entries(summary.categorySums).reduce(
  (max, [cat, amount]) => (amount > max.amount ? { category: cat, amount } : max),
  { category: "", amount: 0 }
);

// 6. Total High Expenses > 5000
let highValueExpenses = transactions
  .filter(t => t.type === "expense" && t.amount > 5000)
  .reduce((sum, t) => sum + t.amount, 0);

// 7. Formatted Expense Report
let formattedExpenses = transactions
  .filter(t => t.type === "expense")
  .map(t => `- ${t.category}: NPR ${t.amount.toLocaleString()} on ${t.date}`);

// Print Output
console.log("Financial Summary:");
console.log("================");

console.log(`Total Income: NPR ${totalIncome.toLocaleString()}`);
console.log(`Total Expenses: NPR ${totalExpenses.toLocaleString()}`);
console.log(`Net Balance: NPR ${summary.netBalance.toLocaleString()}`);

console.log("Category Breakdown:");
for (let cat in categoryTotals) {
  console.log(`- ${cat}: NPR ${categoryTotals[cat].total.toLocaleString()} (${categoryTotals[cat].type})`);
}

console.log("\nTransaction Statistics:");
console.log(`- Total Transactions: ${summary.totalCount}`);
console.log(`- Income Transactions: ${summary.count.income}`);
console.log(`- Expense Transactions: ${summary.count.expense}`);
console.log(`- Average Transaction: NPR ${(summary.totalAmount / summary.totalCount).toFixed(0)}`);
console.log(`- Largest Transaction: NPR ${largestTransaction.amount.toLocaleString()} (${largestTransaction.category})`);
console.log(`- Most Expensive Category: ${mostExpensiveCategory.category} (NPR ${mostExpensiveCategory.amount.toLocaleString()})`);

console.log(`\nHigh-Value Expenses (>5000): NPR ${highValueExpenses.toLocaleString()}`);

console.log("\nFormatted Expense Report:");
formattedExpenses.forEach(line => console.log(line));
