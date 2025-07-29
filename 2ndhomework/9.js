// 9. CONCAT VS SPREAD


let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let arr3 = [7, 8, 9];

let concatResult = arr1.concat(arr2);
let spreadResult = [...arr1, ...arr2];
let nestedArray = [arr1, arr2];

console.log("Concat:", concatResult);
console.log("Spread:", spreadResult);
console.log("Nested:", nestedArray);
console.log("Equal content:", JSON.stringify(concatResult) === JSON.stringify(spreadResult));
console.log("Same object:", concatResult === spreadResult);

let allConcat = arr1.concat(arr2, arr3);
let allSpread = [...arr1, ...arr2, ...arr3];
console.log("All Concat:", allConcat);
console.log("All Spread:", allSpread);
