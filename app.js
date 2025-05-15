const API_URL = 'https://projetazureback-dcb5hchha5aua9ec.francecentral-01.azurewebsites.net/api/todos';

const input = document.getElementById('todoInput');
const list = document.getElementById('todoList');
const btn = document.getElementById('addBtn');

const loadTodos = async () => {
  const res = await fetch(API_URL);
  const todos = await res.json();
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.text;
    li.classList.add('flex', 'justify-between', 'border', 'p-2');
    const del = document.createElement('button');
    del.textContent = 'Supprimer';
    del.classList.add('bg-red-500', 'text-white', 'px-2');
    del.onclick = () => deleteTodo(todo._id);
    li.appendChild(del);
    list.appendChild(li);
  });
};

const addTodo = async () => {
  if (!input.value) return;
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: input.value })
  });
  input.value = '';
  loadTodos();
};

const deleteTodo = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadTodos();
};

btn.onclick = addTodo;
window.onload = loadTodos;
