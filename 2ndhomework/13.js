// 13. COMBINED ARRAY METHOD CHALLENGE

let data = [1,2,3,4,5,6,7,8,9,10,11,12,15,18,20];
let removedData = data.splice(3, 3);
let doubled = data.map(n => n * 2);
doubled.forEach((val, idx) => {
  console.log(`Index ${idx}: ${val}`);
});
let final = doubled.concat([100, 200, 300]);

let pairs = [];
for (let i = 0; i < final.length; i++) {
  for (let j = i + 1; j < final.length; j++) {
    if (final[i] + final[j] === 24) {
      pairs.push([final[i], final[j]]);
    }
  }
}

console.log("Pairs summing to 24:", pairs);