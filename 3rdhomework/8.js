const inventory = [
  {
    id: "ITM001",
    name: "Gaming Laptop",
    category: "Electronics",
    stock: 15,
    price: 85000,
    supplier: "TechCorp",
    lastRestocked: "2024-01-10",
  },
  {
    id: "ITM002",
    name: "Office Chair",
    category: "Furniture",
    stock: 8,
    price: 12000,
    supplier: "FurnishPro",
    lastRestocked: "2024-01-05",
  },
  {
    id: "ITM003",
    name: "Smartphone",
    category: "Electronics",
    stock: 25,
    price: 45000,
    supplier: "TechCorp",
    lastRestocked: "2024-01-12",
  },
  {
    id: "ITM004",
    name: "Desk Lamp",
    category: "Furniture",
    stock: 3,
    price: 2500,
    supplier: "LightingCo",
    lastRestocked: "2024-01-08",
  },
  {
    id: "ITM005",
    name: "Wireless Mouse",
    category: "Electronics",
    stock: 50,
    price: 1500,
    supplier: "TechCorp",
    lastRestocked: "2024-01-15",
  },
  {
    id: "ITM006",
    name: "Standing Desk",
    category: "Furniture",
    stock: 0,
    price: 25000,
    supplier: "FurnishPro",
    lastRestocked: "2023-12-20",
  },
];

const salesData = [
  { itemId: "ITM001", quantitySold: 5, saleDate: "2024-01-16" },
  { itemId: "ITM003", quantitySold: 8, saleDate: "2024-01-16" },
  { itemId: "ITM005", quantitySold: 15, saleDate: "2024-01-17" },
  { itemId: "ITM002", quantitySold: 2, saleDate: "2024-01-17" },
  { itemId: "ITM004", quantitySold: 1, saleDate: "2024-01-18" },
];

// Helper for date difference in days
function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

// Today's date (assuming 2024-01-18 as latest date in data)
const today = new Date("2024-01-18");

// 1. Update stock levels based on salesData
const inventoryMap = new Map(inventory.map(item => [item.id, { ...item }]));

salesData.forEach(({ itemId, quantitySold }) => {
  const item = inventoryMap.get(itemId);
  if (item) {
    item.stock -= quantitySold;
    if (item.stock < 0) item.stock = 0; // no negative stock
  }
});

// Calculate total inventory value (after sales)
const totalInventoryValue = [...inventoryMap.values()]
  .reduce((sum, item) => sum + item.stock * item.price, 0);

// Identify low stock (<5) and out of stock
const lowStockItems = [...inventoryMap.values()].filter(i => i.stock > 0 && i.stock < 5);
const outOfStockItems = [...inventoryMap.values()].filter(i => i.stock === 0);

// Count items by stock status
const totalItems = inventory.length;
const outOfStockCount = outOfStockItems.length;
const lowStockCount = lowStockItems.length;
const healthyStockCount = totalItems - outOfStockCount - lowStockCount;

// 2. Supplier analysis (reduce + grouping)
const suppliers = {};

[...inventoryMap.values()].forEach(item => {
  if (!suppliers[item.supplier]) {
    suppliers[item.supplier] = {
      items: 0,
      totalValue: 0,
      totalPrice: 0,
      outOfStockCount: 0,
    };
  }
  const sup = suppliers[item.supplier];
  sup.items++;
  sup.totalValue += item.price * item.stock;
  sup.totalPrice += item.price;
  if (item.stock === 0) sup.outOfStockCount++;
});

// Calculate average price and stock status per supplier
for (const supName in suppliers) {
  const sup = suppliers[supName];
  sup.avgPrice = Math.round(sup.totalPrice / sup.items);
  if (sup.outOfStockCount > 0) sup.stockStatus = "Critical";
  else if ([...inventoryMap.values()].some(i => i.supplier === supName && i.stock < 5))
    sup.stockStatus = "Low";
  else sup.stockStatus = "Healthy";
}

// Total inventory value for % calc
const grandTotalValue = totalInventoryValue;

// 3. Sales analytics
// Revenue by item and category
const salesByItem = {};
const salesByCategory = {};

salesData.forEach(({ itemId, quantitySold }) => {
  const item = inventoryMap.get(itemId);
  if (!item) return;
  const revenue = item.price * quantitySold;

  if (!salesByItem[itemId]) salesByItem[itemId] = { ...item, unitsSold: 0, revenue: 0 };
  salesByItem[itemId].unitsSold += quantitySold;
  salesByItem[itemId].revenue += revenue;

  if (!salesByCategory[item.category]) salesByCategory[item.category] = 0;
  salesByCategory[item.category] += revenue;
});

// Best performers by units sold descending
const bestPerformers = Object.values(salesByItem).sort((a, b) => b.unitsSold - a.unitsSold);

// Total revenue and units sold
const totalRevenue = bestPerformers.reduce((sum, i) => sum + i.revenue, 0);
const totalUnitsSold = bestPerformers.reduce((sum, i) => sum + i.unitsSold, 0);

// Profit calculations (30% markup assumed on cost price, price = cost + markup)
const costPrice = itemPrice => itemPrice / 1.3;
const totalProfit = bestPerformers.reduce((sum, i) => {
  const cost = costPrice(i.price) * i.unitsSold;
  return sum + (i.revenue - cost);
}, 0);

// 4. Inventory alerts
const alerts = {
  criticalOutOfStock: [],
  lowStockImmediate: [],
  highValueLowStock: [],
};

[...inventoryMap.values()].forEach(item => {
  // Out of stock for > 25 days triggers alert
  const daysSinceRestock = daysBetween(item.lastRestocked, today);
  if (item.stock === 0 && daysSinceRestock >= 25) {
    alerts.criticalOutOfStock.push({ ...item, daysSinceRestock });
  }
  if (item.stock > 0 && item.stock < 5) {
    alerts.lowStockImmediate.push(item);
  }
  if (item.price > 20000 && item.stock < 5) {
    alerts.highValueLowStock.push(item);
  }
});

// 5. Automated reorder suggestions based on sales velocity (units/week)
// Calculate sales velocity per item (using last 7 days window, assume salesData are recent)
const salesVelocityMap = {};
salesData.forEach(({ itemId, quantitySold, saleDate }) => {
  const saleDay = new Date(saleDate);
  const daysAgo = (today - saleDay) / (1000 * 3600 * 24);
  if (daysAgo <= 7) {
    salesVelocityMap[itemId] = (salesVelocityMap[itemId] || 0) + quantitySold;
  }
});

// Reorder points: salesVelocity * 2 weeks (buffer)
const reorderSuggestions = [];

[...inventoryMap.values()].forEach(item => {
  const velocity = salesVelocityMap[item.id] || 0;
  const reorderPoint = velocity * 2; // 2 weeks buffer
  if (item.stock <= reorderPoint) {
    const suggestedQty = reorderPoint * 2 - item.stock; // reorder enough for 4 weeks total
    reorderSuggestions.push({
      item,
      velocity,
      reorderPoint,
      suggestedQty: Math.max(suggestedQty, 10), // minimum reorder qty 10
      priority: reorderPoint - item.stock, // bigger deficit means higher priority
    });
  }
});

// Sort by priority descending
reorderSuggestions.sort((a, b) => b.priority - a.priority);

// 6. Forecasting for next 30 days using sales velocity (4 weeks)
const forecastDays = 30;
const forecasting = [];

[...inventoryMap.values()].forEach(item => {
  const weeklySales = salesVelocityMap[item.id] || 0;
  const expectedSales = (weeklySales / 7) * forecastDays; // normalize if needed
  forecasting.push({
    item,
    expectedSales: Math.round(expectedSales),
    stockSufficient: item.stock >= expectedSales,
  });
});

// 7. Search and filter functionality (example function)

function searchInventory({ category, supplier, minPrice, maxPrice, stockStatus }) {
  return [...inventoryMap.values()].filter(item => {
    if (category && item.category !== category) return false;
    if (supplier && item.supplier !== supplier) return false;
    if (minPrice !== undefined && item.price < minPrice) return false;
    if (maxPrice !== undefined && item.price > maxPrice) return false;
    if (stockStatus === "outOfStock" && item.stock > 0) return false;
    if (stockStatus === "lowStock" && (item.stock >= 5 || item.stock === 0)) return false;
    if (stockStatus === "healthy" && item.stock < 5) return false;
    return true;
  });
}

// ---- OUTPUT ----

console.log("Inventory Management System Report");
console.log("==================================");
console.log("Current Inventory Status:");
console.log("========================");
console.log(`Total Items: ${totalItems}`);
console.log(`Total Inventory Value: NPR ${totalInventoryValue.toLocaleString()}`);
console.log(`Out of Stock: ${outOfStockCount} item${outOfStockCount !== 1 ? "s" : ""}`);
console.log(`Low Stock (<5): ${lowStockCount} item${lowStockCount !== 1 ? "s" : ""}`);
console.log(`Healthy Stock: ${healthyStockCount} item${healthyStockCount !== 1 ? "s" : ""}`);
console.log("Updated Stock Levels (After Sales):");

[...inventoryMap.values()].forEach(item => {
  const original = inventory.find(i => i.id === item.id);
  let stockWarning = "";
  if (item.stock > 0 && item.stock < 5) stockWarning = " ⚠ LOW STOCK";
  if (item.stock === 0) stockWarning = "  OUT OF STOCK";
  console.log(
    `${item.id} - ${item.name}: ${item.stock} units (was ${original.stock})${stockWarning}`
  );
});

console.log("\nSupplier Analysis:");
console.log("=================");
for (const sup in suppliers) {
  const supData = suppliers[sup];
  const percent = ((supData.totalValue / grandTotalValue) * 100).toFixed(1);
  console.log(`${sup}:`);
  console.log(`- Items: ${supData.items}`);
  console.log(`- Total Value: NPR ${supData.totalValue.toLocaleString()} (${percent}%)`);
  console.log(`- Average Price: NPR ${supData.avgPrice.toLocaleString()}`);
  console.log(`- Stock Status: ${supData.stockStatus}`);
}

console.log("\nSales Performance:");
console.log("==================");
console.log(`Total Revenue: NPR ${totalRevenue.toLocaleString()}`);
console.log(`Total Units Sold: ${totalUnitsSold}`);
console.log("Top Performers:");
bestPerformers.forEach((item, idx) => {
  console.log(
    `${idx + 1}. ${item.name}: ${item.unitsSold} units = NPR ${item.revenue.toLocaleString()}`
  );
});

console.log("Category Performance:");
for (const cat in salesByCategory) {
  const catRevenue = salesByCategory[cat];
  const percent = ((catRevenue / totalRevenue) * 100).toFixed(1);
  console.log(`${cat}: NPR ${catRevenue.toLocaleString()} (${percent}% of revenue)`);
}

console.log("\nInventory Alerts:");
console.log("================");
console.log(" CRITICAL - Out of Stock:");
alerts.criticalOutOfStock.forEach(item => {
  const daysAgo = daysBetween(item.lastRestocked, today);
  console.log(`- ${item.name} (${item.id}) - Last restocked ${daysAgo} days ago`);
});
console.log(" LOW STOCK - Immediate Attention:");
alerts.lowStockImmediate.forEach(item => {
  console.log(`- ${item.name} (${item.id}) - Only ${item.stock} units remaining`);
});
console.log("⚠ RESTOCK RECOMMENDATIONS:");
reorderSuggestions.forEach(({ item }, idx) => {
  console.log(`Priority ${idx + 1}: ${item.name} - Suggest ${Math.round(item.suggestedQty)} units`);
});

console.log("\nSales Velocity Analysis:");
console.log("========================");
const velocityClassification = (units) => {
  if (units >= 10) return "Fast Moving";
  if (units >= 5) return "Medium Moving";
  if (units > 0) return "Slow Moving";
  return "No Sales";
};

for (const itemId in salesVelocityMap) {
  const item = inventoryMap.get(itemId);
  const units = salesVelocityMap[itemId];
  console.log(`${velocityClassification(units)}: ${item.name} (${units} units/week)`);
}

console.log("\nForecasting (Next 30 Days):");
console.log("===========================");
forecasting.forEach(({ item, expectedSales, stockSufficient }) => {
  console.log(
    `${item.name}: Expected sales ${expectedSales} units - Current stock ${stockSufficient ? "sufficient" : "insufficient (restock needed)"}`
  );
});

console.log("\nFinancial Summary:");
console.log("==================");
console.log(`Current Inventory Investment: NPR ${totalInventoryValue.toLocaleString()}`);
console.log(`Expected Revenue (30 days): NPR ${Math.round(totalRevenue * (forecastDays / 7)).toLocaleString()}`);
console.log(`Projected Profit (30% margin): NPR ${Math.round(totalProfit * (forecastDays / 7)).toLocaleString()}`);
const roi = (totalProfit / totalInventoryValue) * 100 || 0;
console.log(`ROI: ${roi.toFixed(1)}`);

