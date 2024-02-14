// References & Variables (Static)-----------------------------------------------------------
const Api = "http://localhost:4730/todos";
// Form
const todoForm = document.getElementById("todoForm"); // Reference to the todo form
const todoInput = document.getElementById("todoInput"); // Reference to the input field
const addTodoBtn = document.getElementById("addTodoBtn"); // Reference to the add todo button
// remove Btn
const removeDoneBtn = document.getElementById("removeDoneBtn"); // Reference to the remove done todos button
// List
const todoList = document.getElementById("todoList"); // Reference to the todo list container
// Filter Buttons
const filterBtnAll = document.getElementById("allTodos");
const filterBtnOpen = document.getElementById("openTodos");
const filterBtnDone = document.getElementById("doneTodos");

// Listeners
todoForm.addEventListener("submit", addTodo); // for form submission ("submit") and executes the addTodo function
removeDoneBtn.addEventListener("click", removeTasks); // for the deleting the tasks with the value done: true
filterBtnAll.addEventListener("change", updateStateFilter); // show all Btn
filterBtnOpen.addEventListener("change", updateStateFilter); // show open Btn
filterBtnDone.addEventListener("change", updateStateFilter); // show done Btn

// State holder
const state = {
  // Array tasks holds all tasks regardless of the filter state
  tasks: [],

  // Array "filter" hold the current filter state in a Object with a key-value pair
  filter: [{ filterState: "all" }],
};

// Render function Discription:
function render() {
  removeDuplicateTasks(); // removing duplicated tasks
  todoList.innerHTML = ""; // Clear the list

  // Filter-----------------------------------------------------------------------------
  let filteredTasks = []; // Initialize an empty array to hold filtered tasks
  // The switch Function gets the filterState as a string.
  // Depending on the String a switch STatement is executed
  // The "filteredTasks" Arry will get filled with tasks wich are objects.
  // state.tasks.filter((task) => !task.done); :
  // The filter Method itterates over all tasks that are in the state. Based on the filter criteria
  // a object (task) will get stored in the filteredTasks or not. (The filter-Method does not change the orig. Array)
  // "task" is the variable that holds the handed over object from the state to be able to itterete through them.
  // "task" is a made up name and can be chosen freely.
  switch (state.filter.filterState) {
    case "all":
      filteredTasks = state.tasks; // Show all tasks
      break;
    case "open":
      filteredTasks = state.tasks.filter((task) => !task.done); // Show open tasks
      break;
    case "done":
      filteredTasks = state.tasks.filter((task) => task.done); // Show done tasks
      break;
    default:
      console.error("Invalid filter state:", state.filter.filterState);
  }

  // Creating elments and its functionality-----------------------------------------------------
  // All objects (tasks) that are in the "filteredTasks" Array will be created and added to the DOM:
  // The forEach Method itterates over each Object that is store in filteredTasks.
  // Each object will be processed and added to the dom as a "List Item".
  filteredTasks.forEach((todo) => {
    const newLi = document.createElement("li"); // Create new list item
    const todoText = document.createTextNode(todo.description); // Create text node for todo description
    const checkBox = document.createElement("input"); // Create checkbox input element
    checkBox.type = "checkbox"; // Set input type to checkbox
    checkBox.checked = todo.done; // Set checkbox state based on todo status

    // Adding a eventListener for each task object
    // The body of that function will not get executed right away.
    // Just when a Event happens the anonymous function will get exec.
    // If so, the state of the "object" and its "key" "done" wil get fliped.
    // After that the render function will get exec. to show the changes in the state.
    checkBox.addEventListener("change", () => {
      todo.done = !todo.done;
      render();
    });

    // Appending elements to the DOM
    newLi.appendChild(todoText); // Append todo description text node to list item
    newLi.appendChild(checkBox); // Append checkbox input to list item
    todoList.appendChild(newLi); // Append list item to todo list container
  });
}

// ADD Todo Function (to add a todo to the state)
function addTodo(event) {
  event.preventDefault(); // Prevent form submission / reloading the page. the defoult behavior when a form gets submitted
  const newTodoDescription = todoInput.value.trim(); // Get the value(text) from input field. "trim" kills spaces at the end of the string

  // if statement is actualy not nassecary because of minlength = "5" inside the input tag in html file
  // Checks if the input is not empty
  if (newTodoDescription !== "") {
    // Create new todo object
    const newTodo = {
      // id: Date.now().toString(), // creates a unique id based on the current time and then "typecasted" to a string
      description: newTodoDescription, // the value of description will be set to the text which come from the input
      done: false,
    };

    // Call function POST
    postTodo(newTodo);
    //state.tasks.push(newTodo); // Add new todo to the state
    todoInput.value = ""; // Clear input field

    render(); // Render updated todo list
    console.log("finished addTodo");
  }
}

// Function to remove tasks from the state where done value is true
function removeTasks() {
  // Loop through the tasks array in reverse order to avoid "Index shifting"
  // "Index shifting": when we would stat at the beginning of the array and one item gets deleated
  // we have to pay attantion that the amount of tasks will be chnged and so the index of each task.
  // If we would just continue (itterating from low to high index) we would jump over the next task.
  for (let i = state.tasks.length - 1; i >= 0; i--) {
    if (state.tasks[i].done) {
      state.tasks.splice(i, 1); // Remove task at index i
    }
  }
  render();
}

// Function to update state filter based on active button
// Function to update state filter based on active button
function updateStateFilter() {
  // Create an object to map button IDs to filter values
  const filterMap = {
    allTodos: { filterState: "all" },
    openTodos: { filterState: "open" },
    doneTodos: { filterState: "done" },
  };

  // Get the ID of the active button
  const activeButtonId = document.querySelector(
    "input[name='filter']:checked"
  ).id;

  // Use switch statement to handle cases based on active button ID
  switch (activeButtonId) {
    case "allTodos":
    case "openTodos":
    case "doneTodos":
      state.filter = filterMap[activeButtonId];
      break;
    default:
      console.error("Invalid filter button ID:", activeButtonId);
  }

  render(); // Re-render the todo list based on the updated filter
}

// // Function Load & Save tasks from the local storage
// function loadTasksLocalStorage() {
//   // Retrieve the tasks JSON string from local storage
//   const tasksJson = localStorage.getItem("tasks");

//   if (tasksJson) {
//     // Parse the JSON string back into an array and update state.tasks
//     state.tasks = JSON.parse(tasksJson);
//   }
// }

// function Save tasks to the local storage
// function saveTasksLocalStorage() {
//   // Stringify the tasks array
//   localStorage.removeItem("tasks");

//   const tasksJson = JSON.stringify(state.tasks);

//   // Save the stringified tasks array to local storage
//   localStorage.setItem("tasks", tasksJson);
// }

// Function to remove duplicate tasks from the state
function removeDuplicateTasks() {
  const uniqueTasks = {}; // Object to track unique tasks

  // Filter out duplicate tasks
  state.tasks = state.tasks.filter((task) => {
    // Check if the task description is already in uniqueTasks
    if (!uniqueTasks[task.description]) {
      // If not, mark it as seen by adding it to uniqueTasks
      uniqueTasks[task.description] = true;
      return true; // Keep the task in the filtered array
    }
    showMessage("Duplicate Detacted");
    return false; // Exclude duplicate task from the filtered array
  });
}

// Function to show a message window
function showMessage(message) {
  const messageContainer = document.getElementById("messageContainer");

  // Create a new message element
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  messageElement.classList.add("message");

  // Add the message to the container
  messageContainer.appendChild(messageElement);

  // Trigger reflow to apply the CSS transition
  messageContainer.offsetHeight;

  // Show the message
  messageContainer.classList.add("show");

  // Hide the message after a delay
  setTimeout(() => {
    messageContainer.classList.remove("show");

    // Remove all existing message elements
    while (messageContainer.firstChild) {
      messageContainer.removeChild(messageContainer.firstChild);
    }
  }, 2000); // 2 seconds delay
}

// loading Tasks from API
function getTodos() {
  fetch(Api)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Received Data:", data);
      state.tasks = data;
      render();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
// Sending a created Task to API POST
function postTodo(newTodo) {
  console.log("Entered postTodo function");
  fetch(Api, {
    method: "POST",
    headers: { "Content-type": "application/json" }, // corrected "jason" to "json"
    body: JSON.stringify(newTodo),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((newTodoFromApi) => {
      console.log("Received dataa", newTodoFromApi);
      getTodos();
      console.log("Finished getTodo()");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Updating -> 

// - Initial initialization
updateStateFilter();
getTodos();
render();
