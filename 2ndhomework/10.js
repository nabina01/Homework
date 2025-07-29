
// 10. MULTIPLICATION TABLE GENERATOR


function generateTable(start, end) {
  let totalSum = 0;
  let rowSums = [];
  let colSums = Array(end - start + 1).fill(0);

  let header = "    |";
  for (let i = start; i <= end; i++) {
    header += ` ${i.toString().padStart(2, " ")} `;
  }
  console.log(header + "| Sum");
  console.log("-".repeat(header.length + 6));

  for (let i = start; i <= end; i++) {
    let row = `${i.toString().padStart(2, " ")} |`;
    let rowSum = 0;
    for (let j = start; j <= end; j++) {
      let val = i * j;
      row += ` ${val.toString().padStart(2, " ")}${(i === j ? "*" : " ")} `;
      rowSum += val;
      colSums[j - start] += val;
      totalSum += val;
    }
    rowSums.push(rowSum);
    console.log(row + `| ${rowSum}`);
  }

  let colLine = "Sum |";
  colSums.forEach(s => {
    colLine += ` ${s.toString().padStart(2, " ")}  `;
  });
  console.log("-".repeat(header.length + 6));
  console.log(colLine);
  console.log("Total Sum:", totalSum);
}

generateTable(1, 5);
