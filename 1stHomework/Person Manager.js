let people = [];

function addPerson(name, age, hobbies) {
  people.push({ name, age, hobbies });
}

function findPersonsInAgeRange(min, max) {
  return people.filter(p => p.age >= min && p.age <= max);
}

function listAllUniqueHobbies() {
  let allHobbies = people.flatMap(p => p.hobbies);
  return [...new Set(allHobbies)];
}

// Sample Data
addPerson("Nabeea", 20, ["reading", "cycling"]);
addPerson("Arjina", 20, ["cycling", "gaming"]);
addPerson("Nischal", 21, ["reading", "music"]);

console.log("People aged 20 to 30:", findPersonsInAgeRange(20, 30));
console.log("Unique hobbies:", listAllUniqueHobbies());


