// 7. DO-WHILE NUMBER GUESSING

let testGuesses = [3, 7, 5, 8, 6];
let correct = 6;
let index = 0;

do {
  let guess = testGuesses[index];
  console.log(`Attempt ${index + 1}: Guess ${guess}`);
  if (guess === correct) {
    console.log("Correct!");
    break;
  } else if (guess < correct) {
    console.log("Too low!");
  } else {
    console.log("Too high!");
  }
  index++;
} while (index < testGuesses.length);

console.log(`Guessed in ${index + 1} attempts.`);
console.log(`Success rate: ${((index + 1) / testGuesses.length) * 100}%`);