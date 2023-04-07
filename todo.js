let todoForm = document.querySelector('#todo-form');
let todoInput = document.querySelector('#todo');
let todoList = document.querySelector('.list-group');
let firstCardBody = document.querySelectorAll('.card-body')[0];
let secondCardBody = document.querySelectorAll('.card-body')[1];
let filterInput = document.querySelector('#filter');
let clearButton = document.querySelector('#clear-todos');

const setupEventListeners = () => {
	todoForm.addEventListener('submit', handleTodoFormSubmit);
	document.addEventListener('DOMContentLoaded', handleDocumentLoad);
	secondCardBody.addEventListener('click', handleTodoDelete);
	secondCardBody.addEventListener('click', handleTodoCheck);
	filterInput.addEventListener('keyup', handleFilter);
	clearButton.addEventListener('click', clearAllTodos);
};

const showAlert = (type, message) => {
	let alert = document.createElement('div');

	alert.className = `alert alert-${type}`;
	alert.textContent = message;
	firstCardBody.appendChild(alert);

	setTimeout(() => alert.remove(), 1000);
};

const addEmptyMessage = () => {
	let emptyMessage = document.createElement('li');
	emptyMessage.id = 'empty-message';
	emptyMessage.classList.add('list-group-item', 'text-center');
	emptyMessage.textContent = 'Liste boş';
	todoList.appendChild(emptyMessage);
};


const checkIsEmpty = listItems => {
	let isEmpty = listItems.every(listItem => listItem.classList.contains('d-none')) || listItems.length == 0;
	if (isEmpty){
		addEmptyMessage();
	}else {
		let emptyMessage = document.querySelector('#empty-message');
		if(emptyMessage) emptyMessage.remove();
	}
};

const getTodos = () => {
	let todos = localStorage.getItem('todos');
	if (!todos || todos.length == 0) addEmptyMessage();
	return todos ? JSON.parse(localStorage.getItem('todos')) : [];
};

const addTodoToStorage = todo => {
	let todos = getTodos();
	localStorage.setItem('todos', JSON.stringify([...todos, todo]));
};

const deleteTodoFromStorage = todo => {
	let todos = getTodos().filter(item => item.name !== todo);
	localStorage.setItem('todos', JSON.stringify(todos));
};

const updateTodoInStorage = (todo, isCompleted) => {
	let todos = getTodos().map(item => {
		if (item.name === todo) {
			item.status = isCompleted;
		}
		return item;
	});
	localStorage.setItem('todos', JSON.stringify(todos));
};

const handleTodoFormSubmit = event => {
	event.preventDefault();

	let newTodo = {
		name: todoInput.value.trim(),
		status: false
	};

	if (!newTodo || newTodo.length < 2) {
		showAlert('danger', 'Lütfen bir todo girin');
	} else {
		addTodoToUI(newTodo.name, newTodo.status);
		addTodoToStorage(newTodo);
		showAlert('success', 'Todo başarıyla eklendi');
	}
};

const handleDocumentLoad = () => {
	let todos = getTodos();
	todos.forEach(todo => addTodoToUI(todo.name, todo.status));
};

const deleteTodo = listItem => {
	let todoText = listItem.textContent;

	deleteTodoFromStorage(todoText);
	listItem.remove();
	checkIsEmpty([...todoList.children]);
};

const updateTodoCheck = (listItem, isCompleted) => {
	listItem.style.textDecoration = isCompleted ? 'line-through' : 'none';
	listItem.querySelector('.checked-item').checked = isCompleted;
};

const handleTodoDelete = event => {
	if (!event.target.classList.contains('fa-remove')) return;
	let listItem = event.target.closest('li');
	deleteTodo(listItem);
	showAlert('success', 'Todo başarıyla silindi');
};

const handleTodoCheck = event => {
	if(!event.target.classList.contains('checked-item')) return;
	let isCompleted = event.target.checked;
	let listItem = event.target.closest('li');

	updateTodoCheck(listItem, isCompleted);
	updateTodoInStorage(listItem.textContent, isCompleted);

	let message = isCompleted ? 'Todo başarıyla bitirildi' : 'Todo başarıyla geri alındı';
	showAlert('success', message);
};

const handleFilter = event => {
	if(event.target.id !== "filter") return;
	let filterValue = event.target.value.toLowerCase();
	let listItems = [...todoList.children];

	listItems.forEach(listItem => {
		let text = listItem.textContent.toLowerCase();
		let isMatch = text.includes(filterValue);

		listItem.classList.toggle('d-none', !isMatch);
		listItem.classList.toggle('d-flex', isMatch);
	});

	checkIsEmpty(listItems);
};

const clearAllTodos = event => {
	if (confirm('Tümünü silmek istediğinize emin misiniz?')) {
		[...todoList.children].forEach(deleteTodo);
		showAlert('success', 'Tüm todo başarıyla silindi');
	}
};

const addTodoToUI = (todo, isCompleted) => {
	let listItem = document.createElement('li');
	let linkBar = document.createElement('div');
	let checkInput = document.createElement('input');
	let link = document.createElement('a');

	checkInput.type = 'checkbox';
	checkInput.classList.add('checked-item', 'mr-1');

	link.href = '#';
	link.classList.add('delete-item');
	link.innerHTML = "<i class='fa fa-remove'></i>";

	linkBar.classList.add('d-flex', 'justify-content-between');
	linkBar.appendChild(checkInput);
	linkBar.appendChild(link);

	listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between');
	listItem.textContent = todo;
	listItem.appendChild(linkBar);

	if (isCompleted) updateTodoCheck(listItem, isCompleted);
	
	let todoItems = [...todoList.children];
	if (todoItems.length > 0) {
		let lastTodoItem = todoItems[todoItems.length - 1];
		todoList.insertBefore(listItem, lastTodoItem.nextSibling);
	} else {
		todoList.appendChild(listItem);
	}

	todoInput.value = '';
	checkIsEmpty([...todoList.children]);
};

setupEventListeners();
