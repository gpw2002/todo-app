// public/app.js
const tasksList = document.getElementById('tasks-list');
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');

// Helper function to create a task item
function createTaskItem(task) {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
      <span class="task-title ${task.completed ? 'completed' : ''}">${task.title}</span>
      <span class="delete-task" data-id="${task.id}">✖</span>
    `;
    tasksList.appendChild(li);
  }
  

// Fetch tasks from the server and render them
async function fetchTasks() {
  tasksList.innerHTML = '';
  const response = await fetch('/tasks');
  const tasks = await response.json();
  tasks.forEach(task => createTaskItem(task));
}

// Handle form submission to add a new task
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskTitleInput.value.trim();
  if (!title) return;

  const response = await fetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  if (response.ok) {
    const newTask = await response.json();
    createTaskItem(newTask);
    taskTitleInput.value = '';
  }
});

// Handle checkbox click to update task status
tasksList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('task-checkbox')) {
      const taskId = e.target.dataset.id;
      const response = await fetch(`/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: e.target.checked })
      });
  
      if (!response.ok) {
        // Handle error if necessary
        e.target.checked = !e.target.checked;
      } else {
        // Update the task list to reflect changes
        fetchTasks();
      }
    }
  });
  

// Handle click on the delete task icon
tasksList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-task')) {
      const taskId = e.target.dataset.id;
      const response = await fetch(`/tasks/${taskId}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        const taskItem = e.target.parentElement;
        tasksList.removeChild(taskItem);
  
        // Update the task list to reflect changes
        fetchTasks();
      }
    }
  });
  

// Fetch tasks when the page loads
fetchTasks();
