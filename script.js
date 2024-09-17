const todoVal = document.querySelector('#todo-val');
const priorityVal = document.querySelector('#priority-val');
const categoryVal = document.querySelector('#category-val');
const addBtn = document.querySelector('#add-btn');
const showTodo = document.querySelector('#show-todo');
let allTodos = JSON.parse(localStorage.getItem('todos')) || [];

function createTodoElement(todo) {
    const div = document.createElement('div');
    const p = document.createElement('p');
    const check = document.createElement('input');
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');

    check.setAttribute('type', 'checkbox');
    check.checked = todo.completed;
    p.innerHTML = `${todo.title} (${todo.category}, ${todo.priority})`;
    if (todo.completed) p.style.textDecoration = 'line-through';

    editBtn.textContent = 'Edit';
    deleteBtn.textContent = 'Delete';

    div.append(check, p, editBtn, deleteBtn);

    editBtn.addEventListener('click', () => editTodo(todo, div));
    check.addEventListener('click', (e) => crossTodo(e, todo, p));
    deleteBtn.addEventListener('click', () => deleteTodo(todo, div));

    return div;
}

function editTodo(todo, div) {
    const editDiv = document.createElement('div');
    const textInput = document.createElement('input');
    const prioritySelect = document.createElement('select');
    const categorySelect = document.createElement('select');
    const updateBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');

    textInput.value = todo.title;
    prioritySelect.innerHTML = `
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>`;
    prioritySelect.value = todo.priority;
    categorySelect.innerHTML = `
            <option value="general">General</option>
            <option value="work">Work</option>
            <option value="home">Home</option>
            <option value="self">Self</option>`;
    categorySelect.value = todo.category;

    updateBtn.textContent = 'Update';
    cancelBtn.textContent = 'Cancel';

    editDiv.append(textInput, prioritySelect, categorySelect, updateBtn, cancelBtn);
    div.replaceWith(editDiv);

    updateBtn.addEventListener('click', () => {
        todo.title = textInput.value;
        todo.priority = prioritySelect.value;
        todo.category = categorySelect.value;
        saveTodos();
        editDiv.replaceWith(createTodoElement(todo));
    });

    cancelBtn.addEventListener('click', () => {
        editDiv.replaceWith(div);
    });
}

function crossTodo(e, todo, p) {
    todo.completed = e.target.checked;
    if (todo.completed) {
        p.style.textDecoration = 'line-through';
    } else {
        p.style.textDecoration = 'none';
    }
    saveTodos();
}

function deleteTodo(todo, div) {
    allTodos = allTodos.filter(t => t !== todo);
    div.remove();
    saveTodos();
    showAllTodos();
}

function showAllTodos() {
    showTodo.innerHTML = '';
    todoVal.value="";
    todoVal.placeholder="Enter Title"
    if (allTodos.length === 0) {
        showTodo.innerHTML = 'No Todos available';
    } else {
        allTodos.forEach(todo => {
            showTodo.append(createTodoElement(todo));
        });
    }
}

function addTodo(e) {
    const newTodo = {
        title: todoVal.value,
        priority: priorityVal.value,
        category: categoryVal.value,
        completed: false
    };
    
    allTodos.push(newTodo);
    saveTodos();
    showAllTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(allTodos));
}

function searchTodos(query) {
    const filteredTodos = allTodos.filter(todo =>
        todo.title.toLowerCase().includes(query.toLowerCase())
    );
    showFilteredTodos(filteredTodos);
}

function sortTodosByPriority() {
    const sortedTodos = [...allTodos].sort((a, b) => {
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    showFilteredTodos(sortedTodos);
}

function filterTodosByCategory(category) {
    const filteredTodos = allTodos.filter(todo => todo.category === category);
    showFilteredTodos(filteredTodos);
}

function showFilteredTodos(filteredTodos) {
    showTodo.innerHTML = '';
    if (filteredTodos.length === 0) {
        showTodo.innerHTML = 'No Todos available';
    } else {
        filteredTodos.forEach(todo => {
            showTodo.append(createTodoElement(todo));
        });
    }
}

const searchInput = document.querySelector('#search-input');
searchInput.addEventListener('input', (e) => {
    searchTodos(e.target.value);
});

const sortBtn = document.querySelector('#sort-btn');
sortBtn.addEventListener('click', sortTodosByPriority);

const categoryFilter = document.querySelector('#category-filter');
categoryFilter.addEventListener('change', (e) => {
    filterTodosByCategory(e.target.value);
});

addBtn.addEventListener('click', addTodo);

window.addEventListener('DOMContentLoaded', showAllTodos);
