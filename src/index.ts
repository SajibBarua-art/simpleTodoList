interface Todo {
    id: string;
    task: string;
    completed: boolean;
}

let todos: Todo[] = [];
let todoIdToDelete: string | null = null;

const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const successMessage = document.getElementById('success-message') as HTMLParagraphElement;
const deleteModal = document.getElementById('delete-modal') as HTMLDivElement;
const modalConfirmBtn = document.getElementById('modal-confirm-btn') as HTMLButtonElement;
const modalCancelBtn = document.getElementById('modal-cancel-btn') as HTMLButtonElement;

const renderTodos = (): void => {
    todoList.innerHTML = ''; // clear existing list

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if(todo.completed) {
            li.classList.add('completed');
        }
        li.dataset.id = todo.id;

        const taskSpan = document.createElement('span');
        taskSpan.textContent = todo.task;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

        // Event listener for deleting a todo
        deleteBtn.addEventListener(('click'), (e) => {
            e.stopPropagation();
            promptDelete(todo.id);
        });

        // Event listener for toggling completion on double-click
        li.addEventListener('dblclick', () => {
            toggleComplete(todo.id);
        });

        actionsDiv.appendChild(deleteBtn);
        li.appendChild(taskSpan);
        li.appendChild(actionsDiv);
        todoList.appendChild(li);
    })
}

// toggles the 'completed' status of a todo
const toggleComplete = (id: string): void => {
    const todo = todos.find(t => t.id === id);
    if(todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// shows the delete confirmation modal
const promptDelete = (id: string): void => {
    todoIdToDelete = id;
    deleteModal.classList.remove('hidden');
}

// hides the delete confirmation modal
const hideModal = (): void => {
    todoIdToDelete = null;
    deleteModal.classList.add('hidden');
}

// saves the current list of todos to localStorage
const saveTodos = (): void => {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// deletes a todo after confirmation
const deleteTodo = (): void => {
    if (!todoIdToDelete) return;

    // find operation can operate at O(1) time
    // using mapping technique
    // but for todoList it's overkill as it won't be many entries
    todos = todos.filter(todo => todo.id !== todoIdToDelete);
    saveTodos();
    renderTodos();
    hideModal();
}

const showSuccessMessage = (message: string): void => {
    successMessage.textContent = message;
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 2000)
}

const loadTodos = (): void => {
    const storedTodos = localStorage.getItem('todos');
    if(storedTodos) {
        todos = JSON.parse(storedTodos);
    }
    renderTodos();
}

// Handle form submission to add a new todo
todoForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();

    if(taskText) {
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            task: taskText,
            completed: false
        }
        todos.push(newTodo);
        saveTodos();
        renderTodos();
        todoInput.value = '';
        showSuccessMessage('Todo item Created Successfully.');
    }
});

modalConfirmBtn.addEventListener('click', deleteTodo);
modalCancelBtn.addEventListener('click', hideModal);

deleteModal.addEventListener('click', e => {
    if(e.target === deleteModal) {
        hideModal();
    }
})

// Load todos from local storage on initial page load
document.addEventListener('DOMContentLoaded', loadTodos);