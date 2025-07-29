// 3. for...of LOOP with STRING ANALYSIS

let str = "JavaScript Programming";
let vowels = "aeiouAEIOU";
let vowelCount = 0, consonantCount = 0, spaceCount = 0;
let charFrequency = {};
let position = 0;

for (let char of str) {
  console.log(`Position ${position}: ${char}`);
  if (vowels.includes(char)) vowelCount++;
  else if (char === " ") spaceCount++;
  else if (/[a-zA-Z]/.test(char)) consonantCount++;

  charFrequency[char] = (charFrequency[char] || 0) + 1;
  position++;
}

console.log("Total vowels:", vowelCount);
console.log("Total consonants:", consonantCount);
console.log("Total spaces:", spaceCount);
console.log("Character frequency:", charFrequency);
