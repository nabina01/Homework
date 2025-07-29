// 14. Function with Default Parameter
console.log("\n14. Function with Default Parameter");

function greetUser(user = "Guest") {
  console.log(`Welcome, ${user}!`);
}

greetUser("sachina");
greetUser(); // Uses default value "Guest"