let employees = [
  { id: 1, name: "Alice Johnson", department: "Engineering", salary: 75000, experience: 5, projects: 12 },
  { id: 2, name: "Bob Smith", department: "Marketing", salary: 55000, experience: 3, projects: 8 },
  { id: 3, name: "Charlie Brown", department: "Engineering", salary: 85000, experience: 7, projects: 15 },
  { id: 4, name: "Diana Prince", department: "HR", salary: 60000, experience: 4, projects: 6 },
  { id: 5, name: "Eve Wilson", department: "Engineering", salary: 90000, experience: 8, projects: 18 },
  { id: 6, name: "Frank Miller", department: "Marketing", salary: 50000, experience: 2, projects: 5 },
  { id: 7, name: "Grace Lee", department: "HR", salary: 65000, experience: 6, projects: 10 },
];

// 1. General sort function by any field and order
function sortBy(array, field, order = "asc") {
  return array.slice().sort((a, b) => {
    if (a[field] < b[field]) return order === "asc" ? -1 : 1;
    if (a[field] > b[field]) return order === "asc" ? 1 : -1;
    return 0;
  });
}

// 2. Sort employees by salary (descending) and display ranking
let salarySorted = sortBy(employees, "salary", "desc");
console.log("Salary Ranking (Highest to Lowest):");
salarySorted.forEach((emp, i) => {
  console.log(`${i + 1}. ${emp.name} - NPR ${emp.salary.toLocaleString()} (${emp.department})`);
});
console.log("");

// 3. Group employees by department and calculate statistics
let departmentAnalysis = employees.reduce((acc, emp) => {
  if (!acc[emp.department]) {
    acc[emp.department] = {
      employees: [],
      totalSalary: 0,
      totalProjects: 0,
      mostExperienced: emp,
    };
  }
  let dept = acc[emp.department];
  dept.employees.push(emp);
  dept.totalSalary += emp.salary;
  dept.totalProjects += emp.projects;
  if (emp.experience > dept.mostExperienced.experience) {
    dept.mostExperienced = emp;
  }
  return acc;
}, {});

console.log("Department Analysis:");
console.log("===================");
for (const dept in departmentAnalysis) {
  const data = departmentAnalysis[dept];
  const avgSalary = Math.round(data.totalSalary / data.employees.length);
  console.log(`${dept}:`);
  console.log(`- Employees: ${data.employees.length}`);
  console.log(`- Average Salary: NPR ${avgSalary.toLocaleString()}`);
  console.log(`- Total Projects: ${data.totalProjects}`);
  console.log(`- Most Experienced: ${data.mostExperienced.name} (${data.mostExperienced.experience} years)`);
}
console.log("");

// 4. Promotion candidates (experience > 5 AND projects > 10)
let promotionCandidates = employees
  .filter(emp => emp.experience > 5 && emp.projects > 10)
  .map(emp => ({
    name: emp.name,
    experience: emp.experience,
    projects: emp.projects,
  }));

console.log("Promotion Candidates:");
promotionCandidates.forEach(cand => {
  console.log(`- ${cand.name}: ${cand.experience} years experience, ${cand.projects} projects`);
});
console.log("");

// 5. Calculate correlation between experience and salary
// Using Pearson correlation formula:
function pearsonCorrelation(x, y) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sumX2 = x.reduce((acc, val) => acc + val * val, 0);
  const sumY2 = y.reduce((acc, val) => acc + val * val, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  return numerator / denominator;
}

const experiences = employees.map(e => e.experience);
const salaries = employees.map(e => e.salary);
const avgExperience = (experiences.reduce((a, b) => a + b, 0) / experiences.length).toFixed(1);
const avgSalary = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
const correlation = pearsonCorrelation(experiences, salaries);

// Determine correlation strength (simplified)
let corrDesc = "";
if (correlation > 0.7) corrDesc = "Strong positive correlation";
else if (correlation > 0.3) corrDesc = "Moderate positive correlation";
else if (correlation > 0) corrDesc = "Weak positive correlation";
else if (correlation === 0) corrDesc = "No correlation";
else if (correlation > -0.3) corrDesc = "Weak negative correlation";
else if (correlation > -0.7) corrDesc = "Moderate negative correlation";
else corrDesc = "Strong negative correlation";

console.log("Experience vs Salary Analysis:");
console.log(`Average experience: ${avgExperience} years`);
console.log(`Average salary: NPR ${avgSalary.toLocaleString()}`);
console.log(`Correlation: ${corrDesc}`);
console.log("");

// 6. Create performance score for each employee
// Score = (projects * 100) + (experience * 50) + (salary / 1000)
let employeesWithScore = employees.map(emp => ({
  ...emp,
  performanceScore: emp.projects * 100 + emp.experience * 50 + emp.salary / 1000,
}));

// 7. Find top 3 performers and format info
let topPerformers = sortBy(employeesWithScore, "performanceScore", "desc").slice(0, 3);
console.log("Performance Ranking:");
topPerformers.forEach((emp, i) => {
  console.log(`${i + 1}. ${emp.name}: Score ${Math.round(emp.performanceScore)} (${emp.department})`);
});
