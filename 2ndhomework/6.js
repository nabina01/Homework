// 6. WHILE LOOP with RANDOM NUMBERS

let attempts = 0, randomNum;
let generated = [];

while (attempts < 100) {
  randomNum = Math.floor(Math.random() * 10) + 1;
  generated.push(randomNum);
  attempts++;
  console.log(`Attempt ${attempts}: Generated ${randomNum}`);
  if (randomNum === 7) break;
}

let avg = generated.slice(0, -1).reduce((a, b) => a + b, 0) / (generated.length - 1);
console.log(`Success! Found 7 after ${attempts} attempts.`);
console.log("Generated numbers:", generated);
console.log("Average (excluding 7):", avg.toFixed(2));
