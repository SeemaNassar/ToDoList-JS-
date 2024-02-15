const API = 'https://dummyjson.com/todos';
// const API ='https://jsonplaceholder.typicode.com/todos';
const storedTodoList = localStorage.getItem('todoList');
// If not present, add event listener to fetch TODO list for first time
if (!storedTodoList) {
    document.addEventListener('DOMContentLoaded', fetchData);
} else {
    displayTable("");
}

function fetchData(){
    fetch(API).then(response => {
        if(!response.ok) {
            throw Error("Error URL");
        }
        return response.json();
    }).then(data => {
        localStorage.setItem('todoList', JSON.stringify(data.todos));
        displayTable("");
    }).catch(error => {
        console.log(error);
    });
}

// function PostData(todo) {
//     fetch(API, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(todo)
//     }).then(response => {
//       if (!response.ok) {
//         throw Error("Error URL");
//       }
//       return response.json();
//     }).then(data => {
//       console.log(data);
//       // Update the local storage with the new todo
//       const todoList = JSON.parse(localStorage.getItem('todoList')) || [];
//       todoList.push(data);
//       localStorage.setItem('todoList', JSON.stringify(todoList));
//       // Display the updated table
//       displayTable("");
//     }).catch(error => {
//       console.log(error);
//     });
//   }

function displayTable(Action){
    let todoList = JSON.parse(localStorage.getItem('todoList')) || [];

    if (Action.toLowerCase() === "search".toLowerCase()) {
        const searchInput = document.getElementById('search').value.trim().toLowerCase(); 
        const filteredList = todoList.filter(todo => todo.todo && todo.todo.toLowerCase().includes(searchInput)); 
        todoList = filteredList ;
    }
    const tableBody = document.getElementById('todoTableBody');
    tableBody.innerHTML = '';
    todoList.forEach((todo, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = todo.id;
        row.insertCell(1).textContent = todo.todo;
        row.insertCell(2).textContent = todo.userId;
        row.insertCell(3).textContent = todo.completed ? 'Completed' : 'Pending';
        row.insertCell(4).innerHTML = ` <button onclick="deleteTodo(${index})" style="background-color: red; color:white; border: none; border-radius: 5px;">Delete</button> 
         <button onclick="markAsDone(${index})" style="background-color: green; color:white; border: none; border-radius: 5px;">Done</button> `;
        
        // Add click event listener to the "Description" column cells for update
        const descriptionCell = row.cells[1];
        descriptionCell.addEventListener('click', function() {
            openEditModal(index);
        });
    });
    const todoCount = todoList?.length || 0;
    updateTodoCountFooter(todoCount);

}

function openEditModal(rowIndex) {
    const todoList = JSON.parse(localStorage.getItem('todoList')) || [];
    const todo = todoList[rowIndex];
    if (!todo) {
        console.error('Invalid row index:', rowIndex);
        return;
    }

    const updatedDescription = prompt('Enter the updated TODO description:', todo.todo);
    if (updatedDescription !== null && updatedDescription!=="") {
        todoList[rowIndex].todo = updatedDescription;
        localStorage.setItem('todoList', JSON.stringify(todoList));
        displayTable("");
    } 
}

function updateTodoCountFooter(todoCount) {
    const todoCountFooter = document.getElementById('todoCountFooter');
    todoCountFooter.innerHTML = `<td colspan="5">Total Todos: ${todoCount}</td>`;
}

function searchTasks() {
    displayTable("search");
}

function addTodo() {
    const newTodoInput = document.getElementById('newTodoInput');
    const newTodoTask = newTodoInput.value.trim();

    if (newTodoTask === '') {
        alert('Please enter a TODO title');
        return;
    }

    const todoList = JSON.parse(localStorage.getItem('todoList')) || [];
    const randomUserId = Math.floor(Math.random() * 50) + 1;
    
    let id = 1; // Start with ID 1

    // Find the maximum ID in the existing todoList
    const maxId = todoList.reduce((max, todo) => {
        return todo.id > max ? todo.id : max;
    }, 0);

    // If maxId exists, increment it by 1 to get a new ID
    if (maxId !== 0) {
        id = maxId + 1;
    }

    const newTodo = {
        id: id,
        todo: newTodoTask,
        userId: randomUserId, 
        completed: false,
    };

    todoList.push(newTodo);
    localStorage.setItem('todoList', JSON.stringify(todoList));
    newTodoInput.value = '';
    displayTable("");
}

function markAsDone(ID) {
    CompleteAction("Done" ,ID);
}

function deleteTodo(ID) {
    const confirmed = confirm('Are you sure you want to delete this task?');

    if (confirmed) {
        CompleteAction("Delete" ,ID);
    } else {
        console.log('Delete action cancelled');
    }
    
}

function CompleteAction(Action ,ID){
    const todoList = JSON.parse(localStorage.getItem('todoList')) || [];
    if( ID >= 0 && ID<todoList.length){

        switch (Action) {
            case 'Done':
                todoList[ID].completed = true;
                break;
            case 'Delete':
                todoList.splice(ID, 1);
                break;
        }

        localStorage.setItem('todoList', JSON.stringify(todoList));
        displayTable("");

    } else {
        console.error('Invalid ID:', ID);
    }
}
