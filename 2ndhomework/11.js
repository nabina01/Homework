// 11. OBJECT MAP TRANSFORMATION


let people = [
  { name: "Alice", age: 25, salary: 50000 },
  { name: "Bob", age: 17, salary: 25000 },
  { name: "Charlie", age: 30, salary: 75000 },
  { name: "Diana", age: 22, salary: 45000 },
  { name: "Eve", age: 16, salary: 20000 },
];

let votingStatus = people.map(p => ({ ...p, canVote: p.age >= 18 }));
let categorized = people.map(p => ({
  name: p.name,
  ageGroup: p.age < 18 ? "child" : "adult",
  salaryLevel: p.salary < 30000 ? "low" : p.salary <= 60000 ? "medium" : "high"
}));
let raisedSalaries = people.map(p => ({ name: p.name, age: p.age, newSalary: p.salary * 1.1 }));
let formatted = people.map(p => `Name: ${p.name}, Age: ${p.age}, Can Vote: ${p.age >= 18 ? "yes" : "no"}`);

console.log(votingStatus);
console.log(categorized);
console.log(raisedSalaries);
console.log(formatted);