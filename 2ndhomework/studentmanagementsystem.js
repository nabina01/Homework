                                    //Phase 1: Data Structure Setup
// Step 1: Create an array to store students
const students = [];

// Step 2: Add sample student objects
students.push({
  id: 1,
  name: "Alice Johnson",
  grades: {
    mathematics: [85, 92, 78, 90],
    science: [88, 85, 92],
    english: [75, 82, 88, 79]
  },
  attendance: [true, true, false, true, true], // true = present, false = absent
  enrollmentDate: "2024-01-15",
  isActive: true
});

students.push({
  id: 2,
  name: "Bob Smith",
  grades: {
    mathematics: [70, 80, 68, 74],
    science: [65, 72, 70],
    english: [78, 81, 85, 80]
  },
  attendance: [true, false, true, true, true],
  enrollmentDate: "2024-02-10",
  isActive: false
});

students.push({
  id: 3,
  name: "Catherine Lee",
  grades: {
    mathematics: [90, 95, 93, 88],
    science: [91, 89, 94],
    english: [86, 90, 92, 88]
  },
  attendance: [true, true, true, true, true],
  enrollmentDate: "2024-03-05",
  isActive: true
});

                              //Phase 2: Core Functions Implementation
  
const student = [];
let nextId = 1; 


//Function 1: addStudent(name, subjects = [])
                  
function addStudent(name, subjects = []) {
  if (!name || typeof name !== 'string') {
    console.error("Invalid name provided.");
    return null;
  }

  const student = {
    id: nextId++,
    name,
    grades: {},
    attendance: [],
    enrollmentDate: new Date().toISOString().split('T')[0],
    isActive: true
  };

  subjects.forEach(subject => {
    student.grades[subject] = [];
  });

  students.push(student);
  return student;
}

//Function 2: addGrade(studentId, subject, grade)

function addGrade(studentId, subject, grade) {
  if (typeof grade !== 'number' || grade < 0 || grade > 100) {
    console.error("Grade must be between 0 and 100.");
    return false;
  }

  for (const student of students) {
    if (student.id === studentId) {
      if (!student.grades[subject]) {
        student.grades[subject] = [];
      }
      student.grades[subject].push(grade);
      return true;
    }
  }

  console.error("Student not found.");
  return false;
}


//Function 3: calculateAverage(studentId, subject = null)

function calculateAverage(studentId, subject = null) {
  const student = students.find(s => s.id === studentId);
  if (!student) return null;

  if (subject) {
    const grades = student.grades[subject] || [];
    if (grades.length === 0) return 0;
    const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
    return avg.toFixed(2);
  } else {
    const allGrades = Object.values(student.grades).flat();
    if (allGrades.length === 0) return 0;
    const avg = allGrades.reduce((a, b) => a + b, 0) / allGrades.length;
    return avg.toFixed(2);
  }
}


//Function 4: getTopStudents(count = 5, subject = null)

function getTopStudents(count = 5, subject = null) {
  const averages = students.map(student => {
    const avg = parseFloat(calculateAverage(student.id, subject));
    return { id: student.id, name: student.name, average: avg };
  });

  averages.sort((a, b) => b.average - a.average);

  return averages.slice(0, count);
}

//Function 5: getStudentsBySubject(subject)

function getStudentsBySubject(subject) {
  const filtered = [];

  for (const student of students) {
    if (student.grades[subject]) {
      const avg = calculateAverage(student.id, subject);
      filtered.push({ name: student.name, average: parseFloat(avg) });
    }
  }

  filtered.sort((a, b) => b.average - a.average);
  return filtered;
}

//Function 6: generateProgressReport(studentId)

function generateProgressReport(studentId) {
  const student = students.find(s => s.id === studentId);
  if (!student) {
    console.error("Student not found.");
    return;
  }

  console.log("=== Progress Report ===");
  console.log(`Name: ${student.name}`);
  console.log(`ID: ${student.id}`);
  console.log(`Enrolled: ${student.enrollmentDate}`);
  console.log(`Active: ${student.isActive}`);
  console.log(`Attendance Rate: ${(student.attendance.filter(a => a).length / student.attendance.length * 100 || 0).toFixed(2)}%`);

  console.log("\nSubject-wise Performance:");
  Object.keys(student.grades).forEach(subject => {
    const grades = student.grades[subject];
    const avg = grades.reduce((a, b) => a + b, 0) / (grades.length || 1);
    console.log(`${subject}: [${grades.join(', ')}] → Avg: ${avg.toFixed(2)}`);
  });
}

//Function 7: updateAttendance(studentId, attendanceArray)

function updateAttendance(studentId, attendanceArray) {
  const student = students.find(s => s.id === studentId);
  if (!student || !Array.isArray(attendanceArray)) {
    console.error("Invalid student or attendance data.");
    return false;
  }

  student.attendance.splice(0, student.attendance.length, ...attendanceArray);
  const percentage = (student.attendance.filter(a => a).length / student.attendance.length) * 100;
  return percentage.toFixed(2);
}

//Function 8: getClassStatistics()

function getClassStatistics() {
  const stats = {
    totalStudents: students.length,
    averageGradesPerSubject: {},
    averageAttendance: 0
  };

  const subjectTotals = {};
  let attendanceTotal = 0;
  let attendanceCount = 0;

  for (const student of students) {
    for (const subject in student.grades) {
      const grades = student.grades[subject];
      if (!subjectTotals[subject]) subjectTotals[subject] = [];
      subjectTotals[subject].push(...grades);
    }

    attendanceTotal += student.attendance.filter(a => a).length;
    attendanceCount += student.attendance.length;
  }

  for (const subject in subjectTotals) {
    const grades = subjectTotals[subject];
    const avg = grades.reduce((a, b) => a + b, 0) / (grades.length || 1);
    stats.averageGradesPerSubject[subject] = avg.toFixed(2);
  }

  stats.averageAttendance = ((attendanceTotal / attendanceCount) * 100 || 0).toFixed(2);
  return stats;
}

                   //Phase 3: Advanced Features
//Requirement 1: Search and Filter System
function searchStudents(criteria = {}) {
  const results = [];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    let match = true;

    // Search by name (case-insensitive)
    if (criteria.name) {
      if (!student.name.toLowerCase().includes(criteria.name.toLowerCase())) {
        match = false;
      }
    }

    // Search by average grade range
    if (criteria.minGrade !== undefined || criteria.maxGrade !== undefined) {
      const avg = parseFloat(calculateAverage(student.id));
      if ((criteria.minGrade !== undefined && avg < criteria.minGrade) ||
          (criteria.maxGrade !== undefined && avg > criteria.maxGrade)) {
        match = false;
      }
    }

    // Search by attendance rate
    if (criteria.minAttendance !== undefined) {
      const attendanceRate = (student.attendance.filter(a => a).length / student.attendance.length) * 100 || 0;
      if (attendanceRate < criteria.minAttendance) {
        match = false;
      }
    }

    if (match) {
      results.push({
        id: student.id,
        name: criteria.name ? highlight(student.name, criteria.name) : student.name,
        average: calculateAverage(student.id),
        attendanceRate: ((student.attendance.filter(a => a).length / student.attendance.length) * 100 || 0).toFixed(2)
      });
    }
  }

  return results;
}

// Helper to highlight matched text
function highlight(text, term) {
  const regex = new RegExp(`(${term})`, "gi");
  return text.replace(regex, '**$1**'); // Markdown-style highlight
}

//Requirement 2: Data Export System

function exportToTable() {
  const line = "+----+---------------------+---------+-------------+--------------------------+";
  const header = "| ID | Name                | Average | Attendance  | Subjects & Grades        |";
  console.log(line);
  console.log(header);
  console.log(line);

  students.forEach(student => {
    const avg = calculateAverage(student.id);
    const attendanceRate = ((student.attendance.filter(a => a).length / student.attendance.length) * 100 || 0).toFixed(2);
    const subjects = [];

    for (let subject in student.grades) {
      const grades = student.grades[subject].join(',');
      subjects.push(`${subject}: [${grades}]`);
    }

    const row = `| ${String(student.id).padEnd(2)} ` +
                `| ${student.name.padEnd(19)} ` +
                `| ${String(avg).padEnd(7)} ` +
                `| ${String(attendanceRate + '%').padEnd(11)} ` +
                `| ${subjects.join('; ').padEnd(24)} |`;

    console.log(row);
  });

  console.log(line);
}

//Requirement 3: Performance Monitoring

function monitorPerformance() {
  const { performance } = require('perf_hooks');

  console.log("\nPerformance Test: Calculating Averages");

  // For...of loop
  let t0 = performance.now();
  for (const student of students) {
    calculateAverage(student.id);
  }
  let t1 = performance.now();
  console.log(`For...of Loop: ${(t1 - t0).toFixed(3)} ms`);

  // For loop
  t0 = performance.now();
  for (let i = 0; i < students.length; i++) {
    calculateAverage(students[i].id);
  }
  t1 = performance.now();
  console.log(`Classic For Loop: ${(t1 - t0).toFixed(3)} ms`);

  // forEach loop
  t0 = performance.now();
  students.forEach(s => calculateAverage(s.id));
  t1 = performance.now();
  console.log(`forEach Loop: ${(t1 - t0).toFixed(3)} ms`);

  // Optimization Advice
  console.log("\n💡 Optimization Recommendation:");
  console.log("Use classic `for` loop for large datasets as it's generally fastest.");
}


                   //Phase 4: Testing and Demonstration
//Step 1: Create 10 Students with Varied Data
// Reset student list and ID
students.length = 0;
nextId = 1;

// Add 10 students with varied subjects and attendance
addStudent("Alice Johnson", ["math", "science"]);
addStudent("Bob Smith", ["english", "science"]);
addStudent("Catherine Lee", ["math", "english"]);
addStudent("David Kim", ["science"]);
addStudent("Eva Green", ["math", "science", "english"]);
addStudent("Frank Yang", ["english"]);
addStudent("Grace Liu", ["math"]);
addStudent("Hannah Park", ["science", "english"]);
addStudent("Ian Chen", ["math", "english"]);
addStudent("Julia Brown", ["science"]);

const subjectList = ["math", "science", "english"];

// Assign random grades and attendance
for (const student of students) {
  for (const subject of subjectList) {
    if (student.grades[subject]) {
      for (let i = 0; i < 3; i++) {
        const grade = Math.floor(Math.random() * 41) + 60; // 60–100
        addGrade(student.id, subject, grade);
      }
    }
  }

  // Add 5 attendance entries (random)
  const attendance = Array.from({ length: 5 }, () => Math.random() > 0.2);
  updateAttendance(student.id, attendance);
}

//Step 2: Test Each Function

// searchStudents()
console.log("\n🔍 Search by name (partial 'an'):");
console.table(searchStudents({ name: "an" }));

console.log("\n🔍 Search by grade range (80–100):");
console.table(searchStudents({ minGrade: 80, maxGrade: 100 }));

console.log("\n🔍 Search by attendance > 80%:");
console.table(searchStudents({ minAttendance: 80 }));


//addGrade() Error Case
console.log("\n Invalid grade input:");
console.log(addGrade(1, "math", 110)); // Should fail

console.log("\n Non-existing student:");
console.log(addGrade(999, "math", 85)); // Should fail

//calculateAverage() Testing
console.log("\n Average for student #1 (math):", calculateAverage(1, "math"));
console.log(" Overall average for student #1:", calculateAverage(1));

//getTopStudents()
console.log("\n Top 3 overall:");
console.table(getTopStudents(3));

console.log("\n Top 3 in English:");
console.table(getTopStudents(3, "english"));

//getStudentsBySubject()
console.log("\n Students in Science:");
console.table(getStudentsBySubject("science"));

//generateProgressReport()
console.log("\n Progress Report for Student #1:");
generateProgressReport(1);

//exportToTable()
console.log("\n Export All Data:");
exportToTable();


//Step 3: Demonstrate Error Handling

console.log("\n Add Student with no name:");
console.log(addStudent("", ["math"])); // Should log an error

console.log("\n Invalid attendance update:");
console.log(updateAttendance(1, "invalid")); // Should fail

console.log("\n Progress report for non-existent student:");
generateProgressReport(999); // Should show not found

//Step 4: Performance Comparison
console.log("\n Performance Benchmark:");
monitorPerformance();


//generateProgressReport(2); 
generateProgressReport(5); 
generateProgressReport(8); 


