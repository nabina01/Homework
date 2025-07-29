// 14. ADVANCED OBJECT TRAVERSAL

let company = {
  name: "TechCorp",
  founded: 2020,
  departments: {
    engineering: {
      head: "John Doe",
      employees: [
        { name: "Alice", role: "Developer", projects: ["A", "B"] },
        { name: "Bob", role: "Designer", projects: ["C"] }
      ]
    },
    marketing: {
      head: "Jane Smith",
      budget: 100000,
      campaigns: ["Campaign 1", "Campaign 2"]
    }
  }
};

function printProps(obj, path = "company") {
  for (let key in obj) {
    let fullPath = `${path}.${key}`;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      printProps(obj[key], fullPath);
    } else {
      console.log(`${fullPath}: ${obj[key]}`);
    }
  }
}

printProps(company);