// DOM variables assignment 
const controlSection = document.querySelector("#controlSection")
const todoTextInput = document.querySelector("#textInput");
const prioritySelector = document.querySelector("#prioritySelector");
const addButton = document.querySelector("#addButton");
const todoUl = document.querySelector("#todoUl");
const todoCounter = document.querySelector("#counter");
const sortByPriority = document.querySelector("#sortButton");
const sortByDateAdded = document.querySelector("#sortByDateAdded");
const deleteCompleted = document.querySelector("#deleteCompleted");
const searchButton = document.querySelector("#searchButton");
const searchInput = document.querySelector("#searchInput");
const clearSearch = document.querySelector("#clearSearch");
// adds the number of tasks to the local storage
let numOfTasks = window.localStorage.length > 0 ? window.localStorage.length - 1 : 0;
window.localStorage.setItem("num-of-tasks", `${numOfTasks}`);

let i = 1;
let c = 0;
while (c < numOfTasks) {
    if (window.localStorage.getItem(`task${i}`)) {
        c++;
    }
    i++;
}
let nextTaskNum = i;

//dragging functions START
let draggedLi;
let x = 0;
let y = 0;
let placeholder;
let isDraggingStarted = false;

const isAbove = function(nodeA, nodeB) {
    // Get the bounding rectangle of nodes
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    return (rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2);
};

const swap = function(nodeA, nodeB) {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
    // Move `nodeA` to before the `nodeB`
    nodeB.parentNode.insertBefore(nodeA, nodeB);
    // Move `nodeB` to before the sibling of `nodeA`
    parentA.insertBefore(nodeB, siblingA);
};

const mouseDownHandler = function(event) {
    draggedLi = event.target.parentNode.parentNode;
    const rect = draggedLi.getBoundingClientRect();
    x = event.pageX - rect.left;
    y = event.pageY - rect.top;
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function(e) {
    const draggingRect = draggedLi.getBoundingClientRect();
    if (!isDraggingStarted) {
        isDraggingStarted = true;
        placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        draggedLi.parentNode.insertBefore(placeholder, draggedLi.nextSibling);
        placeholder.style.height = `${draggingRect.height}px`;
    }
    // Set position for dragging element
    draggedLi.style.position = 'absolute';
    draggedLi.style.top = `${event.pageY - y}px`;
    draggedLi.style.left = `${event.pageX - x}px`;
    const prevEle = draggedLi.previousElementSibling;
    const nextEle = placeholder.nextElementSibling;
    // User moves item to the top
    if (prevEle && isAbove(draggedLi, prevEle)) {
        swap(placeholder, draggedLi);
        swap(placeholder, prevEle);
    }
    // User moves the dragging element to the bottom
    if (nextEle && isAbove(nextEle, draggedLi)) {
        swap(nextEle, placeholder);
        swap(nextEle, draggedLi);
    }
};

const mouseUpHandler = function() {
    placeholder.remove();
    isDraggingStarted = false;
    draggedLi.style.removeProperty('top');
    draggedLi.style.removeProperty('left');
    draggedLi.style.removeProperty('position');
    x = null;
    y = null;
    draggedLi = null;
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};
//draging functions END

// order by date added (by using task number on local storage)
const orderByTimeAdded = function() {
    todoUl.innerHTML = "";
    let i = 1;
    let c = 0;
    while (c < numOfTasks) {
        if (window.localStorage.getItem(`task${i}`)) {
            addTaskToDocument([`task${i}`, JSON.parse(window.localStorage.getItem(`task${i}`))]);
            c++;
        }
        i++;
    }
}

// order list by priority
const orderByPriority = function() {
    const tasksObj = window.localStorage;
    const priority5 = [];
    const priority4 = [];
    const priority3 = [];
    const priority2 = [];
    const priority1 = [];
    let i = 1;
    let c = 0;
    while (c < numOfTasks) {
        const task = tasksObj[`task${i}`];
        if (task) {
            switch (JSON.parse(task)["priority"]) {
                case '1':
                    priority1.push([`task${i}`, task])
                    break;
                case '2':
                    priority2.push([`task${i}`, task])
                    break;
                case '3':
                    priority3.push([`task${i}`, task])
                    break;
                case '4':
                    priority4.push([`task${i}`, task])
                    break;
                case '5':
                    priority5.push([`task${i}`, task])
                    break;
            }
            c++;
        }
        i++;
    }
    const sortedTodosArr = [...priority5, ...priority4, ...priority3, ...priority2, ...priority1];
    todoUl.innerHTML = "";
    for (let i = 0; i < sortedTodosArr.length; i++) {
        addTaskToDocument([sortedTodosArr[i][0], JSON.parse(sortedTodosArr[i][1])]);
    }
}

// adds the task object to the HTML document
function addTaskToDocument(task) {
    const taskObj = task[1];
    const taskKey = task[0];
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
    //adding an id to the li that matches the local storage key
    todoLi.id = taskKey;

    // adding a delete button to each task
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', deleteTask);
    todoLi.prepend(deleteBtn);

    if (taskObj["completed"]) {
        todoLi.classList.add('completed');
    }

    // adding a complete button to each task
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("completeBtn");
    completeBtn.innerHTML = '<i class="fas fa-check"></i>';
    completeBtn.addEventListener('click', toggleTaskCompleted);
    todoLi.prepend(completeBtn);

    // adding a drag button to each task
    const orderBtn = document.createElement("button");
    orderBtn.classList.add("orderBtn");
    orderBtn.innerHTML = '<i class="fas fa-bars"></i>';
    orderBtn.addEventListener('mousedown', mouseDownHandler);
    todoLi.prepend(orderBtn);
    todoUl.appendChild(todoLi);
}

// gets the input from the user and sends the data to create a task object
// sends the task object to be added to the document
// resets the input
const addTodoToList = function() {
    const todoTextValue = todoTextInput.value;
    const priorityValue = (prioritySelector.value) ? prioritySelector.value : "1";
    const date = formatDate(new Date());
    const task = createTaskObj(todoTextValue, priorityValue, date);
    addTaskToDocument(task)
    resetInput();
}

// creates the task object and adding the task to the local storage
function createTaskObj(text, priority, createDate, completed = false) {
    numOfTasks++;
    updateCounter();
    const task = {
        "todo-task": text,
        "priority": priority,
        "created-at": createDate,
        "completed": completed
    };
    const taskKey = `task${nextTaskNum++}`;
    window.localStorage.setItem(taskKey, JSON.stringify(task));
    return [taskKey, task];
}

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
}

// format from Javascript date to SQL date format, counts for time zone difference
function formatDate(date) {
    const timezoneOffset = new Date().getTimezoneOffset() * 60000;
    const formattedDate = new Date(date - timezoneOffset).toISOString().slice(0, 19).replace('T', ' ');
    return formattedDate;
}

// delete a task from the document and from the local storage
function deleteTask(event) {
    const taskLi = event.target.parentNode.parentNode;
    window.localStorage.removeItem(taskLi.id);
    taskLi.remove();
    numOfTasks--;
    updateCounter();
}

// toggle task if completed (on and off)
function toggleTaskCompleted(event) {
    const taskLi = event.target.parentNode.parentNode;
    taskLi.classList.toggle('completed');
    const taskObj = JSON.parse(window.localStorage.getItem(taskLi.id));
    taskObj["completed"] = !taskObj["completed"];
    window.localStorage.setItem(taskLi.id, JSON.stringify(taskObj))
}

// deletes all the completed tasks
function deleteCompletedTasks() {
    const tasksObj = window.localStorage;
    let i = 1;
    let c = 0;
    let itemsDeleted = 0;
    while (c < numOfTasks) {
        const task = tasksObj[`task${i}`];
        if (task) {
            if (JSON.parse(task)["completed"]) {
                document.getElementById(`task${i}`).remove();
                window.localStorage.removeItem(`task${i}`);
                itemsDeleted++;
            }
            c++;
        }
        i++;
    }
    numOfTasks -= itemsDeleted;
    updateCounter();
}

// add a class of "matchedSearch" to the tasks that matched the search term
function highlightMatching() {
    clearMatching()
    const searchTerm = searchInput.value;
    const tasksObj = window.localStorage;
    let i = 1;
    let c = 0;
    while (c < numOfTasks) {
        const taskString = tasksObj[`task${i}`];
        if (taskString) {
            c++;
            const task = JSON.parse(taskString);
            if (task["todo-task"].indexOf(searchTerm) !== -1) {
                document.getElementById(`task${i}`).classList.add("matchedSearch");
            }
        }
        i++;
    }
}

// remove the "matchedSearch" class from all of the tasks
function clearMatching() {
    const matchingTasks = document.querySelectorAll(".matchedSearch");
    matchingTasks.forEach(task => {
        task.classList.remove("matchedSearch");
    });
}

// event listeners
// add task on add button
addButton.addEventListener('click', () => {
    if (todoTextInput.value !== "") {
        addTodoToList();
    }
});
// add task on enter key
controlSection.addEventListener('keydown', event => {
    if (event.which === 13 && todoTextInput.value !== "") {
        addTodoToList();
    }
});
// sort tasks by priority
sortByPriority.addEventListener('click', orderByPriority);
// sort tasks by time created
sortByDateAdded.addEventListener('click', orderByTimeAdded);
// delete all completed tasks on button click
deleteCompleted.addEventListener('click', deleteCompletedTasks);
// perform a search on search button click
searchButton.addEventListener('click', () => {
    if (searchInput.value !== "") {
        highlightMatching();
    }
});
// perform search on enter key
searchInput.addEventListener('keydown', event => {
    if (event.which === 13 && searchInput.value !== "") {
        highlightMatching();
    }
});
// clear search box and matching item
clearSearch.addEventListener('click', () => {
    clearMatching();
    searchInput.value = "";
});
// load all the tasks that are saved on local storage on page load
window.addEventListener('load', orderByTimeAdded);
updateCounter();