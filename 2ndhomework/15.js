// 15. LOOP PERFORMANCE TEST


function testLoopPerformance(arr) {
  console.time("for");
  let sum1 = 0;
  for (let i = 0; i < arr.length; i++) sum1 += arr[i];
  console.timeEnd("for");

  console.time("forEach");
  let sum2 = 0;
  arr.forEach(n => sum2 += n);
  console.timeEnd("forEach");

  console.time("for...of");
  let sum3 = 0;
  for (let n of arr) sum3 += n;
  console.timeEnd("for...of");

  console.time("while");
  let sum4 = 0, i = 0;
  while (i < arr.length) sum4 += arr[i++];
  console.timeEnd("while");

  console.time("reduce");
  let sum5 = arr.reduce((a, b) => a + b, 0);
  console.timeEnd("reduce");
}

let testArray = Array.from({ length: 10000 }, (_, i) => i + 1);
testLoopPerformance(testArray);
