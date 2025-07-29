let products = [
  { id: 1, name: "Laptop", price: 50000, category: "Electronics", inStock: true, rating: 4.5 },
  { id: 2, name: "Phone", price: 25000, category: "Electronics", inStock: false, rating: 4.2 },
  { id: 3, name: "Book", price: 500, category: "Education", inStock: true, rating: 4.8 },
  { id: 4, name: "Headphones", price: 3000, category: "Electronics", inStock: true, rating: 4.0 },
  { id: 5, name: "Notebook", price: 200, category: "Education", inStock: true, rating: 3.9 },
  { id: 6, name: "Camera", price: 75000, category: "Electronics", inStock: false, rating: 4.6 },
  { id: 7, name: "Pen", price: 50, category: "Education", inStock: true, rating: 4.1 },
];

// 1. Filter: In stock and rating >= 4.0
const eligibleProducts = products.filter(p => p.inStock && p.rating >= 4.0);

// 2. Map: Apply 20% discount
const discountedProducts = eligibleProducts.map(p => ({
  ...p,
  discountedPrice: Math.round(p.price * 0.8)
}));

// 3. Filter again: Only products under 10,000 NPR
const finalProducts = discountedProducts.filter(p => p.discountedPrice < 10000);

// 4. Summary Object
const summary = {
  total: finalProducts.length,
  averageRating: (finalProducts.reduce((acc, p) => acc + p.rating, 0) / finalProducts.length).toFixed(2),
  categories: [...new Set(finalProducts.map(p => p.category))]
};

// 5. Display final products
console.log("Eligible Products After 20% Discount:");
finalProducts.forEach((p, index) => {
  console.log(`${index + 1}. ${p.name} - NPR ${p.discountedPrice} (${p.category}) - Rating: ${p.rating}`);
});

// Summary
console.log("\nSummary:");
console.log(`Total Products: ${summary.total}`);
console.log(`Average Rating: ${summary.averageRating}`);
console.log(`Categories: ${summary.categories.join(", ")}`);
