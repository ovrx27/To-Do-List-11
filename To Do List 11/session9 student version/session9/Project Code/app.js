let input = document.getElementById("todo-input");

let submit = document.querySelector(".add-btn");

let todoListDiv = document.querySelector(".todo-list");

let clearAllBtn = document.querySelector(".clear-btn");

let controls = document.querySelector(".controls");

let pendingTodos = document.getElementById("pending");

let completedTodos = document.getElementById("completed");

let allTodos = document.getElementById("all");

let alert = document.querySelector(".alert");

let counter = document.getElementById("counter");

let countLeft = 0;

let countCompleted = 0;

let todosArray = [];


// Get todos from Local Storage
getTodosDataFromLocalStorage();


// ========================================
// Submit Button
// ========================================

submit.onclick = function () {

    let todoTitle = input.value.trim();

    // Check if input is empty
    if (todoTitle === "") {

        displayAlert(
            "Please enter a todo item",
            "danger"
        );

        return;
    }


    // Check if we are editing
    let todoId = input.getAttribute("data-id");


    if (todoId) {

        // Update existing todo
        editTodoByID(
            Number(todoId),
            todoTitle
        );

        displayAlert(
            "Todo updated successfully",
            "success"
        );


        // Exit edit mode
        input.removeAttribute("data-id");

        submit.value = "Add";

        input.value = "";

    }

    else {

        // Add new todo
        addTodoItem(todoTitle);

        displayAlert(
            "Todo added successfully",
            "success"
        );

        input.value = "";

    }

};


// ========================================
// Add Todo
// ========================================

function addTodoItem(todoTitle) {

    let todoItemObj = {

        id: Date.now(),

        title: todoTitle,

        completed: false

    };


    todosArray.push(todoItemObj);


    addTodoItemToHTML(todoItemObj);


    addTodosDataToLocalStorage(todosArray);

}


// ========================================
// Add Todo To HTML
// ========================================

function addTodoItemToHTML(todoItemObj) {

    const todoItem = document.createElement("div");


    // Check if completed
    todoItemObj.completed
        ? todoItem.className = "todo-item-done"
        : todoItem.className = "todo-item";


    todoItem.setAttribute(
        "data-id",
        todoItemObj.id
    );


    todoItem.innerHTML = `

        <div class="todo-text">

            <input
                type="checkbox"
                name="todo-checkbox"
                id="todo-checkbox-id-${todoItemObj.id}"
                ${todoItemObj.completed ? "checked" : ""}
                class="todo-checkbox"
                onchange="toggleTodoStatusById(this)"
            />

            <label
                for="todo-checkbox-id-${todoItemObj.id}"
                class="todo-title"
                data-id="${todoItemObj.id}"
            >
                ${todoItemObj.title}
            </label>

        </div>


        <div class="btn-container">

            <button
                type="button"
                class="edit-btn">
            </button>


            <button
                type="button"
                class="delete-btn">
            </button>

        </div>

    `;


    todoListDiv.appendChild(todoItem);


    updateCounter();

}


// ========================================
// Todo List Click Events
// ========================================

todoListDiv.addEventListener("click", (event) => {


    console.log(
        "Clicked on:",
        event.target.className,
        "with id:",
        event.target.getAttribute("data-id")
    );


    // ====================================
    // Click on Todo Item
    // ====================================

    if (
        event.target.classList.contains("todo-item")
    ) {

        let todoItemElement = event.target;

        let id =
            todoItemElement.getAttribute("data-id");


        toggleTodoStatusByIDandTodoItem(
            id,
            todoItemElement
        );


        if (
            pendingTodos.classList.contains("active")
        ) {

            todoItemElement.remove();

        }

    }


    // ====================================
    // Click on Completed Todo
    // ====================================

    else if (
        event.target.classList.contains("todo-item-done")
    ) {

        let todoItemElement = event.target;

        let id =
            todoItemElement.getAttribute("data-id");


        toggleTodoStatusByIDandTodoItem(
            id,
            todoItemElement
        );


        if (
            completedTodos.classList.contains("active")
        ) {

            todoItemElement.remove();

        }

    }


    // ====================================
    // Click on Todo Text
    // ====================================

    else if (
        event.target.classList.contains("todo-text")
    ) {

        let todoItemElement =
            event.target.parentElement;


        let id =
            todoItemElement.getAttribute("data-id");


        toggleTodoStatusByIDandTodoItem(
            id,
            todoItemElement
        );


        if (
            completedTodos.classList.contains("active") ||
            pendingTodos.classList.contains("active")
        ) {

            todoItemElement.remove();

        }

    }


    // ====================================
    // Click on Todo Title
    // ====================================

    else if (
        event.target.classList.contains("todo-title")
    ) {

        let todoItemElement =
            event.target.parentElement.parentElement;


        let id =
            todoItemElement.getAttribute("data-id");


        toggleTodoStatusByIDandTodoItem(
            id,
            todoItemElement
        );


        if (
            completedTodos.classList.contains("active") ||
            pendingTodos.classList.contains("active")
        ) {

            todoItemElement.remove();

        }

    }


    // ====================================
    // Delete
    // ====================================

    else if (
        event.target.classList.contains("delete-btn")
    ) {

        let todoItemElement =
            event.target.parentElement.parentElement;


        let id =
            todoItemElement.getAttribute("data-id");


        deleteTodoByID(id);


        todoItemElement.remove();


        displayAlert(
            "Todo deleted successfully",
            "danger"
        );

    }


    // ====================================
    // Edit
    // ====================================

    else if (
        event.target.classList.contains("edit-btn")
    ) {

        let todoItemElement =
            event.target.parentElement.parentElement;


        let todoTitle =
            todoItemElement.querySelector(
                ".todo-title"
            ).innerText;


        let id =
            todoItemElement.getAttribute("data-id");


        input.value = todoTitle;


        input.setAttribute(
            "data-id",
            id
        );


        submit.value = "Update";


        input.focus();

    }


    else {

        console.log("No action");

    }


    updateCounter();

});


// ========================================
// Toggle Todo Using Checkbox
// ========================================

function toggleTodoStatusById(clickedCheckbox) {


    let id =
        clickedCheckbox
            .getAttribute("id")
            .split("-")[3];


    console.log("id:", id);


    let todoItemElement =
        document.querySelector(
            `[data-id="${id}"]`
        );


    toggleTodoStatusByIDandTodoItem(
        id,
        todoItemElement
    );


    updateCounter();

}


// ========================================
// Toggle Todo Status
// ========================================

function toggleTodoStatusByIDandTodoItem(
    id,
    todoItemElement
) {


    // Change class
    if (
        todoItemElement.classList.contains(
            "todo-item-done"
        )
    ) {

        todoItemElement.className =
            "todo-item";

    }

    else {

        todoItemElement.className =
            "todo-item-done";

    }


    // Get checkbox
    let checkbox =
        todoItemElement.querySelector(
            `#todo-checkbox-id-${id}`
        );


    // Update checkbox
    checkbox.checked =
        !checkbox.checked;


    // Update Array
    todosArray.forEach(todo => {

        if (todo.id == id) {

            todo.completed =
                !todo.completed;

        }

    });


    // Save
    addTodosDataToLocalStorage(
        todosArray
    );

}


// ========================================
// Local Storage - Save
// ========================================

function addTodosDataToLocalStorage(
    todosArray
) {

    window.localStorage.setItem(
        "Todos",
        JSON.stringify(todosArray)
    );

}


// ========================================
// Local Storage - Get
// ========================================

function getTodosDataFromLocalStorage() {


    if (
        localStorage.getItem("Todos")
    ) {

        todosArray =
            JSON.parse(
                localStorage.getItem("Todos")
            );


        addTodoElementsToHTML(
            todosArray
        );

    }

}


// ========================================
// Add All Todos To HTML
// ========================================

function addTodoElementsToHTML(
    todosArray
) {


    todoListDiv.innerHTML = "";


    for (
        let i = 0;
        i < todosArray.length;
        i++
    ) {

        addTodoItemToHTML(
            todosArray[i]
        );

    }

}


// ========================================
// Delete Todo
// ========================================

function deleteTodoByID(todoId) {


    todosArray =
        todosArray.filter(
            todo => todo.id != todoId
        );


    addTodosDataToLocalStorage(
        todosArray
    );

}


// ========================================
// Edit Todo
// ========================================

function editTodoByID(
    id,
    text
) {


    todosArray.forEach(todo => {

        if (todo.id == id) {

            todo.title = text;

        }

    });


    addTodoElementsToHTML(
        todosArray
    );


    addTodosDataToLocalStorage(
        todosArray
    );

}


// ========================================
// Clear All
// ========================================

clearAllBtn.addEventListener(
    "click",
    clearAllTodos
);


function clearAllTodos() {


    if (todosArray.length === 0) {

        displayAlert(
            "There are no todos",
            "danger"
        );

        return;

    }


    todosArray = [];


    todoListDiv.innerHTML = "";


    updateCounter();


    addTodosDataToLocalStorage(
        todosArray
    );


    displayAlert(
        "All todos deleted",
        "danger"
    );

}


// ========================================
// Filters
// ========================================

controls.addEventListener(
    "click",
    (event) => {


        console.log(
            "Clicked on:",
            event.target.id
        );


        // All
        if (
            event.target.id == "all"
        ) {

            addTodoElementsToHTML(
                todosArray
            );


            allTodos.className =
                "active";


            pendingTodos.className =
                "";


            completedTodos.className =
                "";

        }


        // Pending
        else if (
            event.target.id == "pending"
        ) {

            addTodoElementsToHTML(
                todosArray.filter(
                    todo => !todo.completed
                )
            );


            allTodos.className =
                "";


            pendingTodos.className =
                "active";


            completedTodos.className =
                "";

        }


        // Completed
        else if (
            event.target.id == "completed"
        ) {

            addTodoElementsToHTML(
                todosArray.filter(
                    todo => todo.completed
                )
            );


            allTodos.className =
                "";


            pendingTodos.className =
                "";


            completedTodos.className =
                "active";

        }

    }
);


// ========================================
// Display Alert
// ========================================

function displayAlert(
    text,
    action
) {


    alert.textContent =
        text;


    alert.className =
        `alert alert-${action}`;


    setTimeout(
        function () {

            alert.textContent =
                "";


            alert.classList.remove(
                `alert-${action}`
            );

        },
        3000
    );

}


// ========================================
// Check HTML
// ========================================

function isHTML(str) {


    var a =
        document.createElement("div");


    a.innerHTML =
        str;


    for (
        var c = a.childNodes,
        i = c.length;
        i--;
    ) {

        if (
            c[i].nodeType == 1
        ) {

            return true;

        }

    }


    return false;

}


// ========================================
// Counter
// ========================================

function updateCounter() {


    countCompleted =
        todosArray.reduce(
            (acc, todo) => {

                if (todo.completed) {

                    return acc + 1;

                }

                else {

                    return acc;

                }

            },
            0
        );


    countLeft =
        todosArray.length -
        countCompleted;


    counter.innerHTML = `

        <span class="counter-left">
            ${countLeft}
        </span>

        &nbsp;&nbsp; pending &nbsp;

        &

        &nbsp;

        <span class="counter-completed">
            ${countCompleted}
        </span>

        completed

    `;

}


// ========================================
// Enter Key
// ========================================

input.addEventListener(
    "keyup",
    (event) => {

        if (event.key == "Enter") {

            submit.onclick();

        }

    }
);