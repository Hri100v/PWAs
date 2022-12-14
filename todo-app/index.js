// creating database structure
const db = new Dexie("Todo App");
db.version(1).stores({ todos: "++id, todo" });

const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input");
const list_el = document.querySelector("#tasks");

// add todo
form.onsubmit = async (event) => {
    event.preventDefault();
    const todo = input.value;

    await db.todos.add({ todo });
    await getTodos();
    form.reset();
};

// display todo
const getTodos = async () => {
    const allTodos = await db.todos.reverse().toArray();

    list_el.innerHTML = allTodos
        .map(
            (todo) => `
                <div class="task">
                    <div class="content">
                        <input id="edit${todo.id}" class="text" readonly="readonly" type="text" value='${todo.todo}'>
                    </div>
                    <div class="actions">
                        <button class="update" onclick="updateTodo(event, ${todo.id})">Update</button>
                        <button class="delete" onclick="deleteTodo(event, ${todo.id})">Delete</button>
                    </div>
                    <div class="actions hidden">
                        <button class="ok update" onclick="okUpdateTodo(event, ${todo.id})">Ok</button>
                        <button class="cancel delete" onclick="cancelUpdateTodo(event, ${todo.id})">Cancel</button>
                    </div>
                </div>
            `
        )
        .join("");
};
window.onload = getTodos;

// update todo
const updateTodo = async (event, id) => {
    enableEditing(id);
};

const enableEditing = (id) => {
    const inputId = 'edit' + id;
    const currentInput = document.getElementById(inputId);
    currentInput.readOnly = false;
    currentInput.setSelectionRange(currentInput.value.length, currentInput.value.length);
    currentInput.focus();

    const actionsClass = document.getElementsByClassName('actions');
    actionsClass[0].className = 'actions hidden';
    actionsClass[1].className = 'actions';
};

const disableEditing = (id) => {
    const inputId = 'edit' + id;
    document.getElementById(inputId).readOnly = true;

    const actionsClass = document.getElementsByClassName('actions');
    actionsClass[0].className = 'actions';
    actionsClass[1].className = 'actions hidden';
};

const okUpdateTodo = async (event, id) => {
    const inputId = 'edit' + id;
    const inputValue = document.getElementById(inputId).value;
    await db.todos.update(id, { todo: inputValue });
    await getTodos();
    disableEditing(id);
};

const cancelUpdateTodo = async (event, id) => {
    await getTodos();
    disableEditing(id);
};

// delete todo
const deleteTodo = async (event, id) => {
    await db.todos.delete(id);
    await getTodos();
};