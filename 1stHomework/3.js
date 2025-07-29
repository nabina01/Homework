// 3. String Methods
console.log("\n3. String Methods");

let str = " JavaScript is AWESOME ";
let trimmed = str.trim();
let lower = trimmed.toLowerCase();
let script = str.slice(4, 10);
let includesAwesome = lower.includes("awesome");

console.log("Trimmed:", trimmed);
console.log("Lowercase:", lower);
console.log("Extracted 'Script':", script);
console.log("Includes 'awesome':", includesAwesome);