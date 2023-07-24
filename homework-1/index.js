const addTaskButton = document.getElementById("addTaskButton");
const taskFormDialog = document.getElementById("taskFormDialog");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

addTaskButton.addEventListener("click", () => {
  taskForm.reset();
  taskFormDialog.showModal();
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskTitle = document.getElementById("taskTitle").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const assigneeEmail = document.getElementById("assigneeEmail").value;

  if (
    taskTitle.trim() !== "" &&
    taskDescription.trim() !== "" &&
    assigneeEmail.trim() !== ""
  ) {
    const taskItem = createTaskItem(taskTitle, taskDescription, assigneeEmail);
    taskList.appendChild(taskItem);
    taskFormDialog.close();
  }
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  taskFormDialog.close();
});

function addTaskToList(title, description, assignee) {
  const taskItem = document.createElement("li");
  taskItem.innerHTML = `
      <strong>${title}</strong>
      <p>${description}</p>
      <p>Assignee: ${assignee}</p>
  `;
  taskList.appendChild(taskItem);
}
function saveTaskToLocalStorage(task) {
  const tasks = getTasksFromLocalStorage();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
  const tasksJSON = localStorage.getItem("tasks");
  return tasksJSON ? JSON.parse(tasksJSON) : [];
}
function createTaskItem(title, description, assignee, completed = false) {
  const taskItem = document.createElement("li");
  taskItem.innerHTML = `
      <strong>${title}</strong>
      <p>${description}</p>
      <p>Assignee: ${assignee}</p>
      <div class="task-buttons">
          <button class="completeBtn">${
            completed ? "Completed" : "Mark as Completed"
          }</button>
          <button class="deleteBtn">Delete</button>
      </div>
  `;
  taskItem.classList.toggle("completed", completed);
  return taskItem;
}
function markTaskAsCompleted(taskItem) {
  taskItem.classList.toggle("completed");
  const completeBtn = taskItem.querySelector(".completeBtn");
  completeBtn.textContent = taskItem.classList.contains("completed")
    ? "Completed"
    : "Mark as Completed";
}

// Function to delete a task
function deleteTask(taskItem) {
  taskItem.remove();
}
taskList.addEventListener("click", (event) => {
  const target = event.target;
  if (target.tagName === "BUTTON" && target.classList.contains("completeBtn")) {
    const taskItem = target.closest("li");
    markTaskAsCompleted(taskItem);
  } else if (
    target.tagName === "BUTTON" &&
    target.classList.contains("deleteBtn")
  ) {
    const taskItem = target.closest("li");
    deleteTask(taskItem);
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const tasks = getTasksFromLocalStorage();
  tasks.forEach((task) =>
    addTaskToList(task.title, task.description, task.assignee, task.completed)
  );
});
