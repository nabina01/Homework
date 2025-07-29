// 12. MATRIX OPERATIONS


let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12]
];

let all = "", total = 0, rowSums = [], colSums = [0, 0, 0], max = -Infinity, min = Infinity, maxPos, minPos;

matrix.forEach((row, i) => {
  let rowSum = 0;
  row.forEach((val, j) => {
    all += val + " ";
    total += val;
    rowSum += val;
    colSums[j] += val;
    if (val > max) { max = val; maxPos = [i, j]; }
    if (val < min) { min = val; minPos = [i, j]; }
  });
  rowSums.push(rowSum);
});

console.log("All elements:", all.trim());
console.log("Total sum:", total);
console.log("Max:", max, "at", maxPos);
console.log("Min:", min, "at", minPos);
console.log("Row sums:", rowSums);
console.log("Column sums:", colSums);

let transposed = matrix[0].map((_, col) => matrix.map(row => row[col]));
console.log("Transposed:", transposed);

function findValue(matrix, val) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === val) return [i, j];
    }
  }
  return null;
}

console.log("Find 5:", findValue(matrix, 5));