let school = {
  "Class A": {
    students: [
      { name: "Ram", subjects: { math: 85, science: 92, english: 78 } },
      { name: "Sita", subjects: { math: 92, science: 88, english: 95 } },
      { name: "Hari", subjects: { math: 78, science: 85, english: 82 } },
    ],
  },
  "Class B": {
    students: [
      { name: "Krishna", subjects: { math: 88, science: 90, english: 87 } },
      { name: "Radha", subjects: { math: 95, science: 92, english: 89 } },
      { name: "Shyam", subjects: { math: 82, science: 78, english: 85 } },
    ],
  },
};

let subjectTotals = { math: 0, science: 0, english: 0 };
let totalStudents = 0;
let studentRankings = [];
let topPerformers = {};

console.log("Individual Student Averages:");

for (let className in school) {
  console.log(`${className}:`);
  let classStudents = school[className].students;
  let topStudent = null;
  let highestAvg = 0;

  for (let student of classStudents) {
    let subjects = student.subjects;
    let scores = Object.values(subjects);
    let avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    avg = +avg.toFixed(2); // format to 2 decimals

    // Add to ranking
    studentRankings.push({ name: student.name, class: className, average: avg });

    // Update subject totals
    for (let sub in subjects) {
      subjectTotals[sub] += subjects[sub];
    }

    totalStudents++;
    console.log(`- ${student.name}: ${avg}`);

    // Track top performer
    if (avg > highestAvg) {
      highestAvg = avg;
      topStudent = student.name;
    }
  }

  topPerformers[className] = { name: topStudent, average: highestAvg.toFixed(2) };
}

// 1. Top Performers per Class
console.log("\nTop Performers by Class:");
for (let cls in topPerformers) {
  console.log(`${cls}: ${topPerformers[cls].name} (${topPerformers[cls].average})`);
}

// 2. School Subject Averages
console.log("\nSchool Subject Averages:");
for (let sub in subjectTotals) {
  let avg = (subjectTotals[sub] / totalStudents).toFixed(2);
  console.log(`${sub.charAt(0).toUpperCase() + sub.slice(1)}: ${avg}`);
}

// 3. Overall Ranking
studentRankings.sort((a, b) => b.average - a.average);
console.log("\nOverall Ranking:");
studentRankings.forEach((s, i) => {
  console.log(`${i + 1}. ${s.name} (${s.class}): ${s.average}`);
});

// 4. Simplified Map of Name, Class, Avg
const simplified = studentRankings.map(s => ({
  name: s.name,
  class: s.class,
  average: s.average,
}));

// 5. High Achievers
const highAchievers = simplified.filter(s => s.average > 85);
console.log(`\nHigh Achievers (>85): ${highAchievers.length} students`);
