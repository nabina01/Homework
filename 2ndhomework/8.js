// 8. ARRAY SPLICE METHOD

let fruits = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape"];
console.log("Original:", fruits);

let removed = fruits.splice(2, 1);
console.log("Removed:", removed);
console.log("Updated:", fruits);

fruits.splice(2, 0, "grape", "kiwi");
console.log("Added:", fruits);

fruits.splice(-2, 2, "mango", "orange");
console.log("Final Update:", fruits);

// General function
function modifyArray(arr, action, index, ...items) {
  let result;
  if (action === "remove") {
    result = arr.splice(index, items[0]);
  } else if (action === "add") {
    result = arr.splice(index, 0, ...items);
  } else if (action === "replace") {
    result = arr.splice(index, items[0], ...items.slice(1));
  }
  return result;
}

modifyArray(fruits, "add", 1, "papaya", "plum");
console.log("After Custom Modify:", fruits);
