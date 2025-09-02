// Simple Todo App JavaScript
let todos = [];
let currentFilter = 'all';

// Get elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const clearCompleted = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// Load todos from localStorage
function loadTodos() {
  const saved = localStorage.getItem('todos');
  if (saved) {
    todos = JSON.parse(saved);
  }
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Add new todo
function addTodo() {
  const text = todoInput.value.trim();
  if (text === '') return;

  const todo = {
    id: Date.now(),
    text: text,
    completed: false
  };

  todos.push(todo);
  todoInput.value = '';
  saveTodos();
  renderTodos();
}

// Delete todo
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

// Toggle todo completion
function toggleTodo(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

// Clear completed todos
function clearCompletedTodos() {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos();
}

// Filter todos
function filterTodos() {
  switch(currentFilter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

// Render todos
function renderTodos() {
  const filteredTodos = filterTodos();

  todoList.innerHTML = '';

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
             onchange="toggleTodo(${todo.id})">
      <span class="todo-text">${todo.text}</span>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
    `;

    todoList.appendChild(li);
  });

  // Update counter
  const activeTodos = todos.filter(todo => !todo.completed).length;
  todoCount.textContent = `${activeTodos} item${activeTodos !== 1 ? 's' : ''} left`;
}

// Event listeners
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

clearCompleted.addEventListener('click', clearCompletedTodos);

filterBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    e.target.classList.add('active');

    currentFilter = e.target.dataset.filter;
    renderTodos();
  });
});

// Initialize app
loadTodos();
renderTodos();
