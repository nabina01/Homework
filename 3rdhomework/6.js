let orders = [
  {
    orderId: "ORD001",
    customerId: "CUST001",
    items: [
      { productId: "P001", name: "Laptop", price: 50000, quantity: 1, category: "Electronics" },
      { productId: "P002", name: "Mouse", price: 1500, quantity: 2, category: "Electronics" },
    ],
    status: "delivered",
    orderDate: "2024-01-15",
    discount: 5000,
  },
  {
    orderId: "ORD002",
    customerId: "CUST002",
    items: [
      { productId: "P003", name: "Book", price: 800, quantity: 3, category: "Education" },
      { productId: "P004", name: "Pen", price: 50, quantity: 10, category: "Stationery" },
    ],
    status: "shipped",
    orderDate: "2024-01-16",
    discount: 200,
  },
  {
    orderId: "ORD003",
    customerId: "CUST001",
    items: [
      { productId: "P005", name: "Phone", price: 25000, quantity: 1, category: "Electronics" },
    ],
    status: "processing",
    orderDate: "2024-01-17",
    discount: 2000,
  },
];

// 1. Calculate order analytics: total revenue, average order value, popular products, revenue by category

// Flatten all items with order info for easier processing
const allItems = orders.flatMap(order =>
  order.items.map(item => ({
    ...item,
    orderId: order.orderId,
    customerId: order.customerId,
    discount: order.discount,
    status: order.status,
    orderDate: order.orderDate,
  }))
);

// Total revenue before discount
const grossRevenue = orders.reduce((sum, order) => {
  const orderTotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  return sum + orderTotal;
}, 0);

// Total discounts sum
const totalDiscounts = orders.reduce((sum, order) => sum + order.discount, 0);

// Net revenue (after discount)
const netRevenue = grossRevenue - totalDiscounts;

// Average order value (net revenue / number of orders)
const avgOrderValue = netRevenue / orders.length;

// Most popular products by quantity sold
const productQuantityMap = allItems.reduce((acc, item) => {
  acc[item.name] = (acc[item.name] || 0) + item.quantity;
  return acc;
}, {});

// Sort popular products descending
const popularProducts = Object.entries(productQuantityMap)
  .sort((a, b) => b[1] - a[1]);

// Revenue by category
const revenueByCategory = allItems.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + item.price * item.quantity;
  return acc;
}, {});

// Total revenue for percentages
const totalRevenueForPercent = Object.values(revenueByCategory).reduce((a,b) => a+b, 0);

// 3. Customer analysis: total spent, favorite category, lifetime value

const customerData = {};

// Aggregate per customer
orders.forEach(order => {
  if (!customerData[order.customerId]) {
    customerData[order.customerId] = {
      totalOrders: 0,
      totalSpent: 0,
      categoryQuantity: {},
    };
  }
  customerData[order.customerId].totalOrders++;

  // Calculate order total before discount (but discount applies to whole order - for simplicity allocate proportionally)
  const orderTotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const netOrderTotal = orderTotal - order.discount;
  customerData[order.customerId].totalSpent += netOrderTotal;

  // Count quantities per category
  order.items.forEach(item => {
    customerData[order.customerId].categoryQuantity[item.category] = 
      (customerData[order.customerId].categoryQuantity[item.category] || 0) + item.quantity;
  });
});

// Calculate favorite category and average order per customer
for (const custId in customerData) {
  const cust = customerData[custId];
  // favorite category = max quantity category
  const favCategory = Object.entries(cust.categoryQuantity).reduce((maxCat, currCat) => {
    return currCat[1] > maxCat[1] ? currCat : maxCat;
  }, ["None", 0])[0];
  cust.favoriteCategory = favCategory;
  cust.avgOrder = cust.totalSpent / cust.totalOrders;
}

// 4. Sales dashboard: top selling categories, orders by status, discount analysis

// Orders by status count
const ordersByStatus = orders.reduce((acc, o) => {
  acc[o.status] = (acc[o.status] || 0) + 1;
  return acc;
}, {});

// Average discount per order
const avgDiscount = totalDiscounts / orders.length;

// Discount rate = total discounts / gross revenue * 100%
const discountRate = (totalDiscounts / grossRevenue) * 100;

// Orders with discount: percent of orders with discount > 0
const ordersWithDiscountPercent = (orders.filter(o => o.discount > 0).length / orders.length) * 100;

// 5. Recommendation engine: customers who bought X also bought Y, category cross-selling opportunities

// Build customer product sets for co-purchase
const customerProductSets = {};

// Map customerId -> Set of productIds
orders.forEach(order => {
  if (!customerProductSets[order.customerId]) customerProductSets[order.customerId] = new Set();
  order.items.forEach(i => customerProductSets[order.customerId].add(i.productId));
});

// Build co-purchase counts
const coPurchaseCounts = {};

// For each product, find co-purchased products
allItems.forEach(item => {
  const custSet = customerProductSets[item.customerId];
  custSet.forEach(otherProductId => {
    if (otherProductId !== item.productId) {
      const key = [item.productId, otherProductId].sort().join("-");
      coPurchaseCounts[key] = (coPurchaseCounts[key] || 0) + 1;
    }
  });
});

// Cross-selling categories: pairs of categories bought together by customers

// For each customer, collect category sets per order
const categoryPairsCount = {};

// For each order:
orders.forEach(order => {
  const categories = new Set(order.items.map(i => i.category));
  const cats = Array.from(categories);
  for (let i = 0; i < cats.length; i++) {
    for (let j = i + 1; j < cats.length; j++) {
      const pair = [cats[i], cats[j]].sort().join(" + ");
      categoryPairsCount[pair] = (categoryPairsCount[pair] || 0) + 1;
    }
  }
});

// 6. Performance metrics:

// Conversion rates by category: Here assumed conversion rate = orders with items in category / total orders
const ordersCount = orders.length;

const ordersWithCategory = {};
orders.forEach(order => {
  const cats = new Set(order.items.map(i => i.category));
  cats.forEach(cat => {
    ordersWithCategory[cat] = (ordersWithCategory[cat] || 0) + 1;
  });
});

// Average items per order
const avgItemsPerOrder = allItems.length / ordersCount;

// Discount impact on order size (average items count for discounted vs non-discounted)
const discountedOrders = orders.filter(o => o.discount > 0);
const nonDiscountedOrders = orders.filter(o => o.discount === 0);

const avgItemsDiscounted = discountedOrders.length
  ? discountedOrders.reduce((acc, o) => acc + o.items.length, 0) / discountedOrders.length
  : 0;

const avgItemsNonDiscounted = nonDiscountedOrders.length
  ? nonDiscountedOrders.reduce((acc, o) => acc + o.items.length, 0) / nonDiscountedOrders.length
  : 0;

// 7. Executive summary & output

console.log("E-commerce Analytics Dashboard");
console.log("==============================");
console.log("Revenue Summary:");
console.log(`- Gross Revenue: NPR ${grossRevenue.toLocaleString()}`);
console.log(`- Total Discounts: NPR ${totalDiscounts.toLocaleString()}`);
console.log(`- Net Revenue: NPR ${netRevenue.toLocaleString()}`);
console.log(`- Average Order Value: NPR ${avgOrderValue.toFixed(0)}`);

console.log("\nProduct Performance:");
console.log("Top Products by Quantity:");
popularProducts.slice(0, 3).forEach(([name, qty], i) => {
  console.log(`${i + 1}. ${name} - ${qty} units sold`);
});

console.log("\nCategory Analysis:");
for (const cat in revenueByCategory) {
  const rev = revenueByCategory[cat];
  const pct = ((rev / totalRevenueForPercent) * 100).toFixed(1);
  console.log(`${cat}: NPR ${rev.toLocaleString()} (${pct}% of revenue)`);
}

console.log("\nCustomer Insights:");
for (const custId in customerData) {
  const c = customerData[custId];
  console.log(`${custId}:`);
  console.log(`- Total Orders: ${c.totalOrders}`);
  console.log(`- Total Spent: NPR ${c.totalSpent.toLocaleString()}`);
  console.log(`- Favorite Category: ${c.favoriteCategory}`);
  console.log(`- Average Order: NPR ${c.avgOrder.toFixed(0)}`);
}

console.log("\nOrder Status Distribution:");
const totalOrders = orders.length;
for (const status in ordersByStatus) {
  const count = ordersByStatus[status];
  const pct = ((count / totalOrders) * 100).toFixed(1);
  console.log(`${status.charAt(0).toUpperCase() + status.slice(1)}: ${count} order${count > 1 ? "s" : ""} (${pct}%)`);
}

console.log("\nDiscount Analysis:");
console.log(`- Average Discount: NPR ${avgDiscount.toFixed(0)} per order`);
console.log(`- Discount Rate: ${discountRate.toFixed(1)}%`);
console.log(`- Orders with Discount: ${ordersWithDiscountPercent.toFixed(0)}%`);

console.log("\nCross-selling Opportunities:");
for (const pair in categoryPairsCount) {
  const count = categoryPairsCount[pair];
  let desc = count > 1 ? "Existing pattern" : "High potential";
  console.log(`${pair}: ${desc}`);
}

console.log("\nKey Performance Indicators:");
console.log(`- Items per Order: ${avgItemsPerOrder.toFixed(2)}`);
console.log(`- Category Diversity: ${Object.keys(revenueByCategory).length} categories`);
const repeatCustomerCount = Object.values(customerData).filter(c => c.totalOrders > 1).length;
console.log(`- Repeat Customer Rate: ${(repeatCustomerCount / Object.keys(customerData).length * 100).toFixed(1)}%`);
const highValueOrdersCount = orders.filter(order => {
  const orderTotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0) - order.discount;
  return orderTotal > 10000;
}).length;
console.log(`- High-Value Orders (>NPR 10,000): ${(highValueOrdersCount / totalOrders * 100).toFixed(1)}%`);
