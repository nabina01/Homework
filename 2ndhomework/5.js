// 5. ARRAY MAP TRANSFORMATIONS

let nums = [1,2,3,4,5,6,7,8,9,10];

let squaredNumbers = nums.map(n => n * n);
let stringNumbers = nums.map(n => `Number: ${n}`);
let evenOddArray = nums.map(n => n % 2 === 0 ? "even" : "odd");
let objectArray = nums.map(n => ({ value: n, isEven: n % 2 === 0 }));
let chainedMap = nums.map(n => n * n).map(n => `${n}`);

console.log("Squared:", squaredNumbers);
console.log("String format:", stringNumbers);
console.log("Even/Odd:", evenOddArray);
console.log("Object format:", objectArray);
console.log("Chained operations:", chainedMap);