function addTask() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const taskList = document.getElementById('taskList');
  const listItem = document.createElement('li');
  listItem.textContent = taskText;

  taskList.appendChild(listItem);
  input.value = ""; // Clear input
}

// Listen for "Enter" key press in the input field
document.getElementById('taskInput').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addTask();
  }
});
