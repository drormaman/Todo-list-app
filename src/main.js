// DOM variables assignment 
const todoTextInput = document.querySelector("#textInput");
const prioritySelector = document.querySelector("#prioritySelector");
const addButton = document.querySelector("#addButton");
const todoUl = document.querySelector("#todoUl");
const todoCounter = document.querySelector("#counter");
const sortByPriority = document.querySelector("#sortButton");
const sortByDateAdded = document.querySelector("#sortByDateAdded");

// adds the number of tasks to the local storage
let numOfTasks = window.localStorage.length > 0 ? window.localStorage.length - 1 : 0;
window.localStorage.setItem("num-of-tasks", `${numOfTasks}`);

//sets input to default
function resetInput() {
    todoTextInput.value = "";
    prioritySelector.value = "";
    todoTextInput.focus();
}

// updates number of tasks in the local storage and display in the span
function updateCounter() {
    todoCounter.innerText = numOfTasks;
    window.localStorage.setItem("num-of-tasks", `${numOfTasks}`);
    numOfTasks++;
}

// format from Javascript date to SQL date format, counts for time zone difference
function formatDate(date) {
    const timezoneOffset = new Date().getTimezoneOffset() * 60000;
    const formattedDate = new Date(date - timezoneOffset).toISOString().slice(0, 19).replace('T', ' ');
    return formattedDate;
}

// order list by priority
const orderByPriority = function() {
    const tasksObj = window.localStorage;
    const priority5 = [];
    const priority4 = [];
    const priority3 = [];
    const priority2 = [];
    const priority1 = [];
    for (let i = 1; i < numOfTasks; i++) {
        const task = tasksObj[`task${i}`];
        switch (task.charAt(task.indexOf('"priority":') + 12)) {
            case '1':
                priority1.push(task)
                break;
            case '2':
                priority2.push(task)
                break;
            case '3':
                priority3.push(task)
                break;
            case '4':
                priority4.push(task)
                break;
            case '5':
                priority5.push(task)
                break;
        }
    }
    const sortedTodosArr = [...priority5, ...priority4, ...priority3, ...priority2, ...priority1];
    todoUl.innerHTML = "";
    for (let i = 0; i < sortedTodosArr.length; i++) {
        addTaskToDocument(JSON.parse(sortedTodosArr[i]));
    }
}

// order by date added (by using task number on local storage)
const orderByTimeAdded = function() {
    todoUl.innerHTML = "";
    for (let i = 1; i < numOfTasks; i++) {
        addTaskToDocument(JSON.parse(window.localStorage.getItem(`task${i}`)));
    }
}

// gets the input from the user and sends the data to create a task object
// sends the task object to be added to the document
// resets the input
const addTodoToList = function() {
    const todoTextValue = todoTextInput.value;
    const priorityValue = (prioritySelector.value) ? prioritySelector.value : "1";
    const date = formatDate(new Date());
    const taskObj = createTaskObj(todoTextValue, priorityValue, date);
    addTaskToDocument(taskObj)
    resetInput();
}

// creates the task object and adding the task to the local storage
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

// adds the task object to the HTML document
function addTaskToDocument(taskObj) {
    const todoLi = document.createElement("li");
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todoContainer");
    // todo text
    const todoText = document.createElement("span");
    todoText.classList.add("todoText");
    todoText.innerText = taskObj["todo-task"];
    todoDiv.appendChild(todoText);
    // todo priority
    const todoPriority = document.createElement("span");
    todoPriority.classList.add("todoPriority");
    todoPriority.innerText = taskObj["priority"];
    todoDiv.appendChild(todoPriority);
    // todo time created
    const todoDateCreated = document.createElement("span");
    todoDateCreated.classList.add("todoCreatedAt");
    todoDateCreated.innerText = taskObj["created-at"];
    todoDiv.appendChild(todoDateCreated);

    todoLi.appendChild(todoDiv);
    //adding a class by priority number
    todoLi.classList.add(`priority-${taskObj["priority"]}`);
    todoUl.appendChild(todoLi);
}

addButton.addEventListener('click', addTodoToList);
sortByPriority.addEventListener('click', orderByPriority);
sortByDateAdded.addEventListener('click', orderByTimeAdded);
window.addEventListener('load', orderByTimeAdded);
updateCounter();