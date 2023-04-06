
const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo");
const todoList = document.getElementsByClassName("list-group")[0];
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    secondCardBody.addEventListener("click", checkTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos(e) {
    if (confirm("Tümünü Silmek İstediğinize Emin Misiniz?")) {
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}

function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            listItem.setAttribute("style", "display : none !important");
        }
        else {
            listItem.setAttribute("style", "display : block");
        }
    });
}



function checkTodo(e) {

    if (e.target.classList.contains("checked-item")) {
        e.target.closest("li").style.textDecoration = "line-through";
        showAlert("success", "Todo Başarıyla Bitirildi...");
    } else {
        e.target.closest("li").style.textDecoration = "none";
    }

}

function deleteTodo(e) {
    if (e.target.className === "fa fa-remove") {
        e.target.closest("li").remove();
        deleteTodoFromStorage(e.target.closest("li").textContent);
        showAlert("success", "Todo Başarıyla Silindi...");
    }
}

function deleteTodoFromStorage(deletetodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo, index) {
        if (todo === deletetodo) {
            todos.splice(index, 1);
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo) {
        addTodoToUI(todo);
    })
}

function addTodo(e) {
    e.preventDefault();
    const newTodo = todoInput.value.trim();

    if (newTodo === "") {
        showAlert("danger", "Lütfen Bir Todo Girin");
    }
    else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "Todo Başarıyla Eklendi...")
    }
}

function getTodosFromStorage() {
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();

    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message) {
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`
    alert.textContent = message;
    firstCardBody.appendChild(alert);

    setTimeout(function () {
        alert.remove();
    }, 1000);
}

function addTodoToUI(newTodo) {
    const listItem = document.createElement("li");
    const linkBar = document.createElement("div");
    const checkInput = document.createElement("input");
    const link = document.createElement("a");

    checkInput.type = "checkbox"
    checkInput.className = "checked-item mr-1"


    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    linkBar.className = "d-flex justify-content-between";
    linkBar.appendChild(checkInput);
    linkBar.appendChild(link);

    listItem.className = "list-group-item d-flex justify-content-between";
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(linkBar);



    todoList.appendChild(listItem);
    todoInput.value = "";
}