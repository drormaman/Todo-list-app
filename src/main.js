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

const orderByPriority = function() {
    const todoArr = document.querySelectorAll("#todoUl li");
    const priority5 = [];
    const priority4 = [];
    const priority3 = [];
    const priority2 = [];
    const priority1 = [];
    for (let i = 0; i < todoArr.length; i++) {
        switch (todoArr[i].className) {
            case "priority-1":
                priority1.push(todoArr[i])
                break;
            case "priority-2":
                priority2.push(todoArr[i])
                break;
            case "priority-3":
                priority3.push(todoArr[i])
                break;
            case "priority-4":
                priority4.push(todoArr[i])
                break;
            case "priority-5":
                priority5.push(todoArr[i])
                break;
        }
    }
    const sortedTodosArr = [...priority5, ...priority4, ...priority3, ...priority2, ...priority1];
    for (let i = 0; i < sortedTodosArr.length; i++) {
        todoUl.appendChild(sortedTodosArr[i]);
    }
}

const addTodoToList = function(event) {
    const todoLi = document.createElement("li");
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todoContainer");

    const todoText = document.createElement("span");
    todoText.classList.add("todoText");
    todoText.innerText = todoTextInput.value;
    todoDiv.appendChild(todoText);

    const todoPriority = document.createElement("span");
    todoPriority.classList.add("todoPriority");
    const priority = (prioritySelector.value) ? prioritySelector.value : 1;
    todoPriority.innerText = priority;
    todoDiv.appendChild(todoPriority);

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
sortButton.addEventListener('click', orderByPriority);