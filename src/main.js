const todoTextInput = document.querySelector("#textInput");
const prioritySelector = document.querySelector("#prioritySelector");
const addButton = document.querySelector("#addButton");
const todoUl = document.querySelector("#todoUl");
const todoCounter = document.querySelector("#counter");
const sortButton = document.querySelector("#sortButton");
let numOfTodos = 0;

function resetInput() {
    todoTextInput.value = "";
    prioritySelector.value = "1";
}

function updateCounter(numOfTodos) {
    todoCounter.innerText = numOfTodos;
}

const addOrderClass = function() {
    const todoArr = document.querySelectorAll("#todoUl li");
    todoArr.forEach(li => {
        li.classList.toggle("order");
    });
}

const addTodoToList = function(event) {
    const todoLi = document.createElement("li");
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todoContainer");

    const todoPriority = document.createElement("span");
    todoPriority.classList.add("todoPriority");
    const priority = prioritySelector.value;
    todoPriority.innerText = priority;
    todoDiv.appendChild(todoPriority);

    const todoText = document.createElement("span");
    todoText.classList.add("todoText");
    todoText.innerText = todoTextInput.value;
    todoDiv.appendChild(todoText);

    const todoDateCreated = document.createElement("span");
    todoDateCreated.classList.add("todoCreatedAt");
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    todoDateCreated.innerText = dateStr;
    todoDiv.appendChild(todoDateCreated);

    todoLi.appendChild(todoDiv);
    todoLi.classList.add(`priority-${priority}`);
    todoUl.appendChild(todoLi);
    resetInput();

    updateCounter(++numOfTodos);
}

updateCounter(numOfTodos);

addButton.addEventListener('click', addTodoToList);
sortButton.addEventListener('click', addOrderClass);