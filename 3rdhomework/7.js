let rawStudentData = [
  {
    name: "john doe",
    email: "JOHN@EMAIL.COM",
    age: "20",
    grades: ["85", "92", "78"],
    subjects: "math,science,english",
  },
  {
    name: "JANE SMITH",
    email: "jane.smith@email",
    age: 19,
    grades: [88, "invalid", 95],
    subjects: "math,history",
  },
  {
    name: "bob johnson",
    email: "bob@email.com",
    age: "17",
    grades: ["90", "87"],
    subjects: "science,english,art",
  },
  { name: "", email: "empty@email.com", age: 21, grades: [], subjects: "" },
  {
    name: "alice brown",
    email: "alice@email.com",
    age: "22",
    grades: ["95", "88", "92", "89"],
    subjects: "math,science,english,history",
  },
];

// 1. Validation functions

function validateEmail(email) {
  // Simple regex for email validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

function validateAge(age) {
  const numAge = Number(age);
  return !isNaN(numAge) && numAge >= 16 && numAge <= 25 ? numAge : null;
}

function validateGrades(grades) {
  // Convert to numbers, filter out invalids (NaN or out of 0-100 range)
  return grades
    .map(g => Number(g))
    .filter(g => !isNaN(g) && g >= 0 && g <= 100);
}

function validateName(name) {
  return typeof name === "string" && name.trim().length > 0;
}

function properCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

// 2. Clean and transform with map

let validationIssues = [];
let cleanedStudents = rawStudentData.map((student, idx) => {
  let issues = [];

  // Validate & clean name
  if (!validateName(student.name)) {
    issues.push("Name cannot be empty");
  }
  const name = properCase(student.name || "");

  // Validate & normalize email
  const email = student.email.toLowerCase();
  if (!validateEmail(email)) {
    issues.push(`Invalid email format: ${student.email}`);
  }

  // Validate age
  const age = validateAge(student.age);
  if (age === null) {
    issues.push(`Invalid age: ${student.age}`);
  }

  // Validate & clean grades
  const originalGrades = student.grades;
  const validGrades = validateGrades(originalGrades);
  // Find invalid grades by comparing original with filtered
  const invalidGrades = originalGrades.filter(
    g => !validGrades.includes(Number(g))
  );
  invalidGrades.forEach(g =>
    issues.push(`Invalid grade found: "${g}" (removed)`)
  );

  // Parse subjects string into array, capitalize subjects
  const subjects = student.subjects
    ? student.subjects
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
        .map(properCase)
    : [];

  if (subjects.length === 0) {
    issues.push("No subjects provided");
  }
  if (validGrades.length === 0) {
    issues.push("No grades provided");
  }

  // Collect issues for error reporting
  if (issues.length > 0) {
    validationIssues.push({ record: idx + 1, name: name || "Empty Name", issues });
  }

  return {
    originalIndex: idx,
    name,
    email,
    age,
    grades: validGrades,
    subjects,
    isValid:
      validateName(student.name) &&
      validateEmail(email) &&
      age !== null &&
      validGrades.length > 0 &&
      subjects.length > 0,
  };
});

// 3. Filter out invalid records
const validStudents = cleanedStudents.filter(s => s.isValid);
const invalidStudents = cleanedStudents.filter(s => !s.isValid);

// 4. Summary statistics using reduce

// Average age
const avgAge =
  validStudents.reduce((sum, s) => sum + s.age, 0) / validStudents.length;

// Age distribution buckets
const ageDistribution = { "17-18": 0, "19-20": 0, "21-22": 0 };
validStudents.forEach(s => {
  if (s.age >= 17 && s.age <= 18) ageDistribution["17-18"]++;
  else if (s.age >= 19 && s.age <= 20) ageDistribution["19-20"]++;
  else if (s.age >= 21 && s.age <= 22) ageDistribution["21-22"]++;
});

// Most popular subjects
const subjectCounts = {};
validStudents.forEach(s => {
  const uniqueSubjects = new Set(s.subjects);
  uniqueSubjects.forEach(sub => {
    subjectCounts[sub] = (subjectCounts[sub] || 0) + 1;
  });
});

// Sort subjects by popularity
const sortedSubjects = Object.entries(subjectCounts).sort(
  (a, b) => b[1] - a[1]
);

// Academic performance categories
const performanceCategories = {
  Excellent: 0,
  Good: 0,
  Average: 0,
  "Below Average": 0,
};
validStudents.forEach(s => {
  const avgGrade =
    s.grades.reduce((sum, g) => sum + g, 0) / s.grades.length || 0;
  if (avgGrade >= 90) performanceCategories.Excellent++;
  else if (avgGrade >= 80) performanceCategories.Good++;
  else if (avgGrade >= 70) performanceCategories.Average++;
  else performanceCategories["Below Average"]++;
  s.avgGrade = avgGrade;
});

// 5. Error reporting (already collected in validationIssues)

// 6. Enrollment report & 7. Student ranking by average grades

// Sort students by avgGrade descending for ranking
const rankedStudents = [...validStudents].sort(
  (a, b) => b.avgGrade - a.avgGrade
);

// --------- OUTPUT -----------

console.log("Student Enrollment Processing Results");
console.log("====================================");
console.log("Data Validation Summary:");
console.log(`- Total Records Processed: ${rawStudentData.length}`);
console.log(`- Valid Records: ${validStudents.length}`);
console.log(`- Invalid Records: ${invalidStudents.length}`);
console.log(
  `- Success Rate: ${(validStudents.length / rawStudentData.length) * 100}%`
);

if (validationIssues.length > 0) {
  console.log("Validation Issues Found:");
  validationIssues.forEach(({ record, name, issues }) => {
    console.log(`Record ${record} (${name}):`);
    issues.forEach(issue => console.log(` ✗ ${issue}`));
    if (issues.some(i => i.includes("No grades") || i.includes("Name cannot be empty"))) {
      console.log(" → Record rejected");
    }
  });
}

console.log("\nCleaned Student Data:");
console.log("====================");
rankedStudents.forEach((s, idx) => {
  console.log(`${idx + 1}. ${s.name}`);
  console.log(` Email: ${s.email}`);
  console.log(` Age: ${s.age}`);
  console.log(` Subjects: ${s.subjects.join(", ")}`);
  console.log(
    ` Grades: [${s.grades.join(", ")}] - Average: ${s.avgGrade.toFixed(1)}`
  );
  console.log("");
});

console.log("Enrollment Statistics:");
console.log("=====================");
console.log(`Total Valid Students: ${validStudents.length}`);
console.log(`Average Age: ${avgAge.toFixed(1)} years`);
console.log("Age Distribution:");
for (const range in ageDistribution) {
  const count = ageDistribution[range];
  const percent = ((count / validStudents.length) * 100).toFixed(0);
  console.log(`- ${range}: ${count} student${count !== 1 ? "s" : ""} (${percent}%)`);
}

console.log("Subject Popularity:");
sortedSubjects.forEach(([subj, count], i) => {
  const percent = ((count / validStudents.length) * 100).toFixed(0);
  console.log(`${i + 1}. ${subj}: ${count} student${count !== 1 ? "s" : ""} (${percent}%)`);
});

console.log("Academic Performance:");
for (const cat in performanceCategories) {
  console.log(`- ${cat}: ${performanceCategories[cat]} student${performanceCategories[cat] !== 1 ? "s" : ""}`);
}

console.log("Top Performers:");
rankedStudents.forEach((s, i) =>
  console.log(`${i + 1}. ${s.name} - ${s.avgGrade.toFixed(1)} average`)
);
