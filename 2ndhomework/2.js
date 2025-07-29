// 2. ARRAY forEach METHOD

let numbers = [1, 2, 3, 4, 5];

// Print each number
numbers.forEach((num) => {
  console.log("Number:", num);
});

// Print doubled values
console.log("Doubled values:");
numbers.forEach((num) => {
  console.log(num * 2);
});

// Print index and value
console.log("Index and Value pairs:");
numbers.forEach((num, index) => {
  console.log(`Index ${index}: Value ${num}`);
});

// Sum of all values
let sum = 0;
numbers.forEach((num) => {
  sum += num;
});
console.log("Total sum:", sum);2