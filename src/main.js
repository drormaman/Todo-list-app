const todoTextInput = document.querySelector("#textInput");
const prioritySelector = document.querySelector("#prioritySelector");
const addButton = document.querySelector("#addButton");
const todoUl = document.querySelector("#todoUl");
const todoCounter = document.querySelector("#counter");
const sortButton = document.querySelector("#sortButton");
let numOfTasks = window.localStorage.length > 0 ? window.localStorage.length - 1 : 0;
window.localStorage.setItem("num-of-tasks", `${numOfTasks}`);

function resetInput() {
    todoTextInput.value = "";
    prioritySelector.value = "1";
}

function updateCounter() {
    // numOfTasks = parseInt(window.localStorage.getItem("num-of-tasks"));

    todoCounter.innerText = numOfTasks;
    window.localStorage.setItem("num-of-tasks", `${numOfTasks}`);
    numOfTasks++;
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


    const todoTextValue = todoTextInput.value;
    const priorityValue = (prioritySelector.value) ? prioritySelector.value : 1;
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const taskObj = createTaskObj(todoTextValue, priorityValue, dateStr);
    addTaskToDocument(taskObj)

    resetInput();
}



function createTaskObj(text, priority, createDate) {
    updateCounter();
    const task = {
        "todo-task": text,
        "priority": priority,
        "created-at": createDate
    };
    window.localStorage.setItem(`task${parseInt(window.localStorage.getItem("num-of-tasks"))}`, JSON.stringify(task));
    return task;
}

function addTaskToDocument(taskObj) {
    const todoLi = document.createElement("li");
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todoContainer");

    const todoText = document.createElement("span");
    todoText.classList.add("todoText");
    todoText.innerText = taskObj["todo-task"];
    todoDiv.appendChild(todoText);

    const todoPriority = document.createElement("span");
    todoPriority.classList.add("todoPriority");
    todoPriority.innerText = taskObj["priority"];
    todoDiv.appendChild(todoPriority);

    const todoDateCreated = document.createElement("span");
    todoDateCreated.classList.add("todoCreatedAt");
    todoDateCreated.innerText = taskObj["created-at"];
    todoDiv.appendChild(todoDateCreated);

    todoLi.appendChild(todoDiv);
    todoLi.classList.add(`priority-${taskObj["priority"]}`);
    todoUl.appendChild(todoLi);
}

addButton.addEventListener('click', addTodoToList);
sortButton.addEventListener('click', orderByPriority);
window.addEventListener('load', (event) => {
    for (let i = 1; i < numOfTasks; i++) {
        addTaskToDocument(JSON.parse(window.localStorage.getItem(`task${i}`)));
    }
});
updateCounter();