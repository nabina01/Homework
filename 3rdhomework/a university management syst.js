const universityData = {
  students: [
    {
      id: "STU001",
      name: "Ram Sharma",
      age: 20,
      enrolledCourses: ["CS101", "MATH201", "ENG101"],
      grades: { CS101: [85, 90, 78], MATH201: [92, 88], ENG101: [75, 82, 89] },
      attendance: { CS101: 0.85, MATH201: 0.92, ENG101: 0.78 },
      semester: 3,
      department: "Computer Science",
    },
    {
      id: "STU002",
      name: "Sita Rai",
      age: 19,
      enrolledCourses: ["CS101", "MATH201"],
      grades: { CS101: [95, 88, 92], MATH201: [89, 94, 87] },
      attendance: { CS101: 0.95, MATH201: 0.89 },
      semester: 2,
      department: "Computer Science",
    },
    {
      id: "STU003",
      name: "Hari Thapa",
      age: 21,
      enrolledCourses: ["ENG101", "HIST201", "MATH201"],
      grades: {
        ENG101: [88, 85],
        HIST201: [92, 89, 94],
        MATH201: [78, 82, 85],
      },
      attendance: { ENG101: 0.82, HIST201: 0.95, MATH201: 0.75 },
      semester: 4,
      department: "Liberal Arts",
    },
  ],
  courses: [
    {
      code: "CS101",
      name: "Introduction to Programming",
      credits: 3,
      department: "Computer Science",
      instructor: "Dr. Patel",
      capacity: 30,
    },
    {
      code: "MATH201",
      name: "Calculus II",
      credits: 4,
      department: "Mathematics",
      instructor: "Prof. Singh",
      capacity: 25,
    },
    {
      code: "ENG101",
      name: "English Composition",
      credits: 3,
      department: "English",
      instructor: "Dr. Johnson",
      capacity: 20,
    },
    {
      code: "HIST201",
      name: "World History",
      credits: 3,
      department: "History",
      instructor: "Prof. Brown",
      capacity: 15,
    },
  ],
  departments: [
    { name: "Computer Science", head: "Dr. Wilson", budget: 500000 },
    { name: "Mathematics", head: "Dr. Kumar", budget: 300000 },
    { name: "English", head: "Prof. Davis", budget: 200000 },
    { name: "History", head: "Dr. Thompson", budget: 150000 },
    { name: "Liberal Arts", head: "Prof. Martinez", budget: 250000 },
  ],
};

// ========================= Part A: Student Analytics =========================
// 1. Calculate overall GPA for a single student (4.0 scale)
function calculateStudentGPA(student) {
  // Map grades to 4.0 scale and calculate weighted average by course credits
  let totalPoints = 0;
  let totalCredits = 0;

  universityData.courses.forEach(course => {
    if (student.grades[course.code]) {
      // Average grade in this course
      const avgGrade = student.grades[course.code].reduce((a, b) => a + b, 0) / student.grades[course.code].length;
      // Convert percentage to 4.0 GPA scale (simple mapping)
      let gpa = 0;
      if (avgGrade >= 90) gpa = 4.0;
      else if (avgGrade >= 80) gpa = 3.0;
      else if (avgGrade >= 70) gpa = 2.0;
      else if (avgGrade >= 60) gpa = 1.0;
      else gpa = 0;
      totalPoints += gpa * course.credits;
      totalCredits += course.credits;
    }
  });
  if (totalCredits === 0) return 0; // Avoid division by zero
  return +(totalPoints / totalCredits).toFixed(2);
}

// 2. Calculate course-wise averages for a student
function studentCourseAverages(student) {
  let averages = {};
  Object.entries(student.grades).forEach(([courseCode, grades]) => {
    if (grades.length > 0) {
      averages[courseCode] = +(grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);
    }
  });
  return averages;
}

// 3. Correlate attendance with grades for a student (returns correlation coefficient)
function attendanceGradeCorrelation(student) {
  const courseCodes = Object.keys(student.grades).filter(code => student.attendance[code] !== undefined);
  if (courseCodes.length < 2) return null; // Not enough data

  const gradesArr = [];
  const attendanceArr = [];

  courseCodes.forEach(code => {
    const avgGrade = student.grades[code].reduce((a, b) => a + b, 0) / student.grades[code].length;
    gradesArr.push(avgGrade);
    attendanceArr.push(student.attendance[code] * 100); // scale to %
  });

  // Calculate Pearson correlation coefficient
  const n = gradesArr.length;
  const sumGrades = gradesArr.reduce((a, b) => a + b, 0);
  const sumAttendance = attendanceArr.reduce((a, b) => a + b, 0);
  const sumGradesSq = gradesArr.reduce((a, b) => a + b * b, 0);
  const sumAttendanceSq = attendanceArr.reduce((a, b) => a + b * b, 0);
  const sumProduct = gradesArr.reduce((acc, val, i) => acc + val * attendanceArr[i], 0);

  const numerator = n * sumProduct - sumGrades * sumAttendance;
  const denominator = Math.sqrt((n * sumGradesSq - sumGrades * sumGrades) * (n * sumAttendanceSq - sumAttendance * sumAttendance));

  if (denominator === 0) return null;
  return +(numerator / denominator).toFixed(2);
}

// 4. Determine academic standing based on GPA and attendance
function academicStanding(student) {
  const gpa = calculateStudentGPA(student);
  const attendanceAvg = Object.values(student.attendance).reduce((a, b) => a + b, 0) / Object.values(student.attendance).length;

  if (gpa >= 3.5 && attendanceAvg >= 0.85) return "Dean's List";
  if (gpa < 2.0 || attendanceAvg < 0.6) return "Probation";
  return "Good Standing";
}

// 5. Get course performance trend (grade average increasing, decreasing or stable)
function coursePerformanceTrend(student, courseCode) {
  if (!student.grades[courseCode] || student.grades[courseCode].length < 2) return "Insufficient data";

  const grades = student.grades[courseCode];
  let increasing = true;
  let decreasing = true;

  for (let i = 1; i < grades.length; i++) {
    if (grades[i] < grades[i - 1]) increasing = false;
    if (grades[i] > grades[i - 1]) decreasing = false;
  }
  if (increasing) return "Improving";
  if (decreasing) return "Declining";
  return "Stable";
}

// ========================= Part B: Course Management =========================
// 6. Calculate enrollment statistics and utilization for a course
function enrollmentStats(courseCode) {
  const course = universityData.courses.find(c => c.code === courseCode);
  if (!course) return null;

  const enrolledStudents = universityData.students.filter(s => s.enrolledCourses.includes(courseCode));
  const enrollmentCount = enrolledStudents.length;
  const utilization = ((enrollmentCount / course.capacity) * 100).toFixed(1);

  return { enrolledStudents, enrollmentCount, utilization: +utilization };
}

// 7. Calculate grade distribution for a course
function gradeDistribution(courseCode) {
  // Collect all grades for the course
  let grades = [];
  universityData.students.forEach(student => {
    if (student.grades[courseCode]) {
      grades = grades.concat(student.grades[courseCode]);
    }
  });
  if (grades.length === 0) return null;

  // Grade buckets: A(90-100), B(80-89), C(70-79), D(60-69), F(<60)
  const buckets = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  grades.forEach(grade => {
    if (grade >= 90) buckets.A++;
    else if (grade >= 80) buckets.B++;
    else if (grade >= 70) buckets.C++;
    else if (grade >= 60) buckets.D++;
    else buckets.F++;
  });
  const total = grades.length;
  Object.keys(buckets).forEach(key => {
    buckets[key] = +((buckets[key] / total) * 100).toFixed(1); // percent
  });
  return buckets;
}

// 8. Instructor performance metric: average grades in their courses
function instructorPerformance(instructorName) {
  // Find courses taught by instructor
  const coursesTaught = universityData.courses.filter(c => c.instructor === instructorName);
  if (coursesTaught.length === 0) return null;

  let allGrades = [];
  coursesTaught.forEach(course => {
    universityData.students.forEach(student => {
      if (student.grades[course.code]) {
        allGrades = allGrades.concat(student.grades[course.code]);
      }
    });
  });
  if (allGrades.length === 0) return null;
  const avgGrade = allGrades.reduce((a, b) => a + b, 0) / allGrades.length;
  return +avgGrade.toFixed(2);
}

// 9. Cross-course grade correlation (Pearson) between two courses
function crossCourseCorrelation(courseCode1, courseCode2) {
  // Get pairs of average grades for students enrolled in both courses
  let pairs = [];
  universityData.students.forEach(student => {
    if (student.grades[courseCode1] && student.grades[courseCode2]) {
      const avg1 = student.grades[courseCode1].reduce((a, b) => a + b, 0) / student.grades[courseCode1].length;
      const avg2 = student.grades[courseCode2].reduce((a, b) => a + b, 0) / student.grades[courseCode2].length;
      pairs.push([avg1, avg2]);
    }
  });
  if (pairs.length < 2) return null;

  const n = pairs.length;
  const sumX = pairs.reduce((acc, val) => acc + val[0], 0);
  const sumY = pairs.reduce((acc, val) => acc + val[1], 0);
  const sumX2 = pairs.reduce((acc, val) => acc + val[0] * val[0], 0);
  const sumY2 = pairs.reduce((acc, val) => acc + val[1] * val[1], 0);
  const sumXY = pairs.reduce((acc, val) => acc + val[0] * val[1], 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  if (denominator === 0) return null;
  return +(numerator / denominator).toFixed(2);
}

// ======================== Part C: Department Operations ========================

// 13. Get student distribution by department
// Returns object: { departmentName: studentCount, ... }
function studentDistributionByDepartment() {
  return universityData.departments.reduce((acc, dept) => {
    acc[dept.name] = universityData.students.filter(s => s.department === dept.name).length;
    return acc;
  }, {});
}

// 14. Analyze budget allocation vs average GPA performance by department
// Returns array of { department, budget, averageGPA, performanceRating }
function budgetVsPerformance() {
  return universityData.departments.map(dept => {
    const studentsInDept = universityData.students.filter(s => s.department === dept.name);
    const avgGPA = studentsInDept.length > 0
      ? +(studentsInDept.reduce((sum, s) => sum + calculateStudentGPA(s), 0) / studentsInDept.length).toFixed(2)
      : 0;
    // Simple performance rating based on avgGPA thresholds
    let performanceRating = "Needs Improvement";
    if (avgGPA >= 3.5) performanceRating = "Excellent";
    else if (avgGPA >= 3.0) performanceRating = "Good";

    return {
      department: dept.name,
      budget: dept.budget,
      averageGPA: avgGPA,
      performanceRating,
    };
  });
}

// 15. Analyze inter-departmental course sharing
// Returns object with course codes and array of departments whose students are enrolled
function interDepartmentalCourseSharing() {
  const courseDeptMap = {};

  universityData.courses.forEach(course => {
    courseDeptMap[course.code] = new Set();
  });

  universityData.students.forEach(student => {
    student.enrolledCourses.forEach(courseCode => {
      if (courseDeptMap[courseCode]) {
        courseDeptMap[courseCode].add(student.department);
      }
    });
  });

  // Convert sets to arrays
  const result = {};
  for (const course in courseDeptMap) {
    result[course] = Array.from(courseDeptMap[course]);
  }
  return result;
}

// 16. Optimize resource utilization by calculating average capacity usage per department
// Returns array of { department, totalCapacity, totalEnrollment, utilizationPercent }
function resourceUtilizationByDepartment() {
  return universityData.departments.map(dept => {
    // Get courses offered by this department
    const deptCourses = universityData.courses.filter(c => c.department === dept.name);
    const totalCapacity = deptCourses.reduce((sum, c) => sum + c.capacity, 0);

    // Count total enrollments in these courses (students enrolled who have these courses)
    let totalEnrollment = 0;
    deptCourses.forEach(course => {
      const enrolledStudents = universityData.students.filter(student => student.enrolledCourses.includes(course.code));
      totalEnrollment += enrolledStudents.length;
    });

    const utilizationPercent = totalCapacity === 0 ? 0 : +(100 * totalEnrollment / totalCapacity).toFixed(2);

    return {
      department: dept.name,
      totalCapacity,
      totalEnrollment,
      utilizationPercent,
    };
  });
}

// ======================== Part D: Advanced Features and Reporting ========================

// 17. Identify students at risk based on GPA and attendance
function identifyAtRiskStudents() {
  return universityData.students.filter(student => {
    const gpa = calculateStudentGPA(student);
    const attendanceAvg = Object.values(student.attendance).reduce((a, b) => a + b, 0) / Object.values(student.attendance).length || 0;
    return gpa < 2.0 || attendanceAvg < 0.6;
  });
}

// 18. Generate notification messages for students based on academic standing
function generateNotifications() {
  return universityData.students.map(student => {
    const standing = academicStanding(student);
    let message = "";

    switch (standing) {
      case "Dean's List":
        message = `Congratulations ${student.name}! You have made the Dean's List. Keep up the excellent work!`;
        break;
      case "Probation":
        message = `Dear ${student.name}, your academic performance needs improvement. Please consult your advisor.`;
        break;
      case "Good Standing":
      default:
        message = `Hello ${student.name}, keep maintaining your good academic standing.`;
    }

    return { studentId: student.id, message };
  });
}

// 19. Summarize semester performance for a department
function semesterPerformanceSummary(departmentName, semester) {
  const filteredStudents = universityData.students.filter(s => s.department === departmentName && s.semester === semester);
  if (filteredStudents.length === 0) return null;

  const totalGPA = filteredStudents.reduce((acc, student) => acc + calculateStudentGPA(student), 0);
  const totalAttendance = filteredStudents.reduce((acc, student) => {
    const attendanceVals = Object.values(student.attendance);
    if (attendanceVals.length === 0) return acc;
    return acc + attendanceVals.reduce((a, b) => a + b, 0) / attendanceVals.length;
  }, 0);

  return {
    averageGPA: +(totalGPA / filteredStudents.length).toFixed(2),
    averageAttendance: +(totalAttendance / filteredStudents.length).toFixed(2),
    studentCount: filteredStudents.length,
  };
}

// 20. Generate report of top N students by GPA across the university
function topNStudentsByGPA(N) {
  const studentsWithGPA = universityData.students.map(student => ({
    id: student.id,
    name: student.name,
    department: student.department,
    gpa: calculateStudentGPA(student),
  }));

  // Sort descending by GPA
  studentsWithGPA.sort((a, b) => b.gpa - a.gpa);

  return studentsWithGPA.slice(0, N);
}


