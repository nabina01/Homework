// 4. for...in LOOP with COMPLEX OBJECT

let car = {
  brand: "Toyota",
  model: "Camry",
  year: 2023,
  color: "Blue",
  features: ["ABS", "Airbags", "GPS"],
  owner: {
    name: "John Doe",
    age: 35,
    contact: {
      email: "john@email.com",
      phone: "123-456-7890"
    }
  }
};

// Print top-level properties
for (let key in car) {
  console.log(`${key}: ${car[key]}`);
}

// Recursive nested printer
function printNested(obj, prefix = "") {
  for (let key in obj) {
    let value = obj[key];
    let path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      printNested(value, path);
    } else {
      console.log(`${path}: ${value}`);
    }
  }
}

printNested(car);
