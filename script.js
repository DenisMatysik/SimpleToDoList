// элементы
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const modalInput = document.getElementById("modal-input");
const modal = document.getElementById("myModal");
const btnclose = document.getElementsByClassName("close")[0];
const btnsave = document.getElementsByClassName("save")[0];
const url = "https://test-todoist.herokuapp.com/api/categories";
let inputInf;
let inputArr = [];

// функции
const getFetch = async ()=> {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json)
}

const postFetch = async (goal) => {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
        name: goal,
     }),
     headers: {
       'Content-type': 'application/json; charset=UTF-8',
     },
   })
   const json = await response.json();
   console.log(json)
}

const deleteFetch = async () =>{ // нужно досавить с севрена id удаляемого элемента но у меня не выходит
    const response = await fetch(url, {
        method: 'DELETE', 
    });
   const json = await response.json( );
    console.log(json);
}

const changeFetch = async (changedGoal) =>{ // нужно както выцепить нужный элемент
    const response = await fetch(url, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(changedGoal)
    });
   const json = await response.json( );
    console.log(json);
}

function addTodo(event){
    event.preventDefault();
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    inputInf = todoInput.value;
    inputArr.push(inputInf)
    localStorage.setItem("Goals",JSON.stringify(inputArr)) // добавление в LS
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    const completedButton = document.createElement("button");
    completedButton.textContent = "Complete";
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton)
    const trashButton = document.createElement("button");
    trashButton.textContent = "Delete";
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton)
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    todoDiv.appendChild(editButton);
    todoList.appendChild(todoDiv);
    postFetch(todoInput.value)
    todoInput.value = "";
}

function deleteCheckEdit(e){
    const item = e.target;
    if(item.classList[0] === "trash-btn"){
        const todo = item.parentElement;
        // удаление элемента из LS
        for (let i=0; i<inputArr.length;i++){
            const any = todo.childNodes[0].innerText;
            if(any === inputArr[i]){
                // deleteFetch();
                inputArr.splice(i,1);
                localStorage.setItem("Goals",JSON.stringify(inputArr));
            }
        }
        todo.remove();   
    }
    if(item.classList[0] === "complete-btn"){
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
    if(item.classList[0] === "edit-btn"){
        const todo = item.parentElement;
        const editInput = todo.childNodes[0].innerText;
        modal.classList.toggle("none");
        modalInput.value = editInput;
        todo.classList.add("uniq");
    }
}


function filterTodo(e){
    const todoArr = Array.from(todoList.childNodes);
    for( let i=1; i<todoArr.length; i++){
        switch(e.target.value){
            case "all":
                todoArr[i].style.display = "flex";
                break;
            case "completed":
                if( todoArr[i].classList.contains("completed")){   
                    todoArr[i].style.display = "flex";
            } else {
                todoArr[i].style.display = "none";
            }
            break;
            case "uncompleted":
                if( !todoArr[i].classList.contains("completed")){
                    todoArr[i].style.display = "flex";
            } else {
                todoArr[i].style.display = "none";
            }
            break;
            }
        }
    }

    function checkLS (){
        if ( localStorage.getItem("Goals")) {
        const goalsMass = JSON.parse(localStorage.getItem("Goals"))
        console.log(goalsMass)
        for ( let i=0;i<goalsMass.length;i++) {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        const newTodo = document.createElement("li");
        newTodo.innerText = goalsMass[i];
        inputInf = newTodo.innerText;
        inputArr.push(inputInf)
        localStorage.setItem("Goals",JSON.stringify(inputArr))
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);
        const completedButton = document.createElement("button");
        completedButton.textContent = "Complete";
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton)
        const trashButton = document.createElement("button");
        trashButton.textContent = "Delete";
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton)
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");
        todoDiv.appendChild(editButton);
        todoList.appendChild(todoDiv);
        }
        }
        else{
            console.log("net в LS")
        }
    }

// События
window.addEventListener("load", checkLS);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheckEdit);
filterOption.addEventListener("click", filterTodo);
btnclose.addEventListener("click", function() {
    modal.classList.toggle("none");
    }
)
window.addEventListener("click", function(event) {
  if (event.target == modal) { 
    modal.classList.toggle("none");
        }
    }
)
btnsave.addEventListener("click", function() {
    modal.classList.toggle("none");
    const changedGoal = document.getElementsByClassName("uniq")[0].childNodes[0];
    // перезапись элемента + перезапись LS
    for (let i=0; i<inputArr.length;i++){
        const any = changedGoal.innerText;
        if(any === inputArr[i]){
            changedGoal.innerText = modalInput.value;
            inputArr.splice(i,1,modalInput.value);
            // changeFetch(modalInput);
            localStorage.setItem("Goals",JSON.stringify(inputArr));
        }
    }
    document.getElementsByClassName("uniq")[0].classList.remove("uniq");
    }
)