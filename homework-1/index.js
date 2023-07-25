const addTaskButton = document.getElementById("addTaskButton");
const taskFormDialog = document.getElementById("taskFormDialog");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Load tasks from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const tasks = getTasksFromLocalStorage();
  tasks.forEach((task) =>
    addTaskToList(task.title, task.description, task.assignee)
  );
});
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
    const task = {
      title: taskTitle,
      description: taskDescription,
      assignee: assigneeEmail,
    };
    addTaskToList(taskTitle, taskDescription, assigneeEmail);
    saveTaskToLocalStorage(task);
    taskFormDialog.close();
  }
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  taskFormDialog.close();
});

function addTaskToList(title, description, assignee, completed = false) {
  const taskItem = document.createElement("li");
  taskItem.innerHTML = `
  
    
      <strong>${title}</strong>
      <p>${description}</p>
      <p> ${assignee}</p>
      
      <div class="task-buttons">
        <button class="completeBtn">&#9989</button>
        <button class="deleteBtn">&#10060</button>
      </div>
  `;

  if (completed) {
    taskItem.classList.add("completed");
  }

  if (completed) {
    completedTaskList.appendChild(taskItem);
  } else {
    taskList.appendChild(taskItem);
  }
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
taskList.addEventListener("click", (event) => {
  const targetElement = event.target;
  if (targetElement.classList.contains("completeBtn")) {
    markTaskAsCompleted(targetElement.closest("li"));
  } else if (targetElement.classList.contains("deleteBtn")) {
    deleteTask(targetElement.closest("li"));
  }
});

function markTaskAsCompleted(taskItem) {
  taskItem.classList.toggle("completed");
  const taskTitle = taskItem.querySelector("strong").textContent;
  const taskDescription = taskItem.querySelector("p").textContent;
  const assignee = taskItem
    .querySelector("p:last-child")
    .textContent.replace("Assignee: ", "");

  const completedTask = {
    title: taskTitle,
    description: taskDescription,
    assignee: assignee,
  };

  // Remove the completed task from the main task list and add it to the completedTaskList
  taskList.removeChild(taskItem);
  addTaskToList(
    completedTask.title,
    completedTask.description,
    completedTask.assignee,
    true
  );
  saveTaskToLocalStorage(completedTask, true);
}
function deleteTask(taskItem) {
  const taskTitle = taskItem.querySelector("strong").textContent;
  const taskDescription = taskItem.querySelector("p").textContent;
  const assignee = taskItem
    .querySelector("p:last-child")
    .textContent.replace("Assignee: ", "");

  const task = {
    title: taskTitle,
    description: taskDescription,
    assignee: assignee,
  };

  // Remove the task from the main task list
  taskList.removeChild(taskItem);
  // Save the task to localStorage for any undo/redo functionalities, if needed
  saveTaskToLocalStorage(task);
}
// Function to delete a task
function deleteTask(taskItem) {
  taskItem.remove();
  // localStorage.removeItem(taskItem);
  sessionStorage.removeItem(taskItem);
}
