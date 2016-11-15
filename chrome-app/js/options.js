var blacklistArray = [];

// restores visible options using prefs stored in chrome.storage
function restoreSettings()
{
	chrome.storage.sync.get({
		from: 'en',         // default
		to: 'es',           // default
		array: []	// default
	}, function(items) {
		// document.getElementById('fromLang').value = items.from;
		document.getElementById('toLang').value = items.to;

		for (var i = 0; i < blacklistArray.length; i++)
		{
			addTask(blacklistArray[i]);
		}
	});
}

function saveSettings()
{
	// var fromLang = document.getElementById('fromLang').value;
	var toLang = document.getElementById('toLang').value;
	console.log(toLang);

	chrome.storage.sync.set({
		// from: fromLang,
		to: toLang,
		array: blacklistArray
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
	});
}

// on load, restore settings saved in chrome storage
document.addEventListener('DOMContentLoaded', restoreSettings);

// save button
document.getElementById('save').addEventListener('click', saveSettings);


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //


var taskInput = document.getElementById("new-task");
var addButton = document.getElementById("add-task-button");
var blacklist = document.getElementById("blacklist-list");
var addRow    = document.getElementById("add-task-li");

//New Task List Item
function createNewTaskElement(taskString) {
	if (taskString !== "")
	{
		//Create List Item
		var listItem = document.createElement("li");

		//input (text)
		var inputBox = document.createElement("input");
		inputBox.type = "text";
		inputBox.value = taskString;

		//button.delete
		var deleteButton = document.createElement("button");
		deleteButton.innerText = "Delete";
		deleteButton.className = "delete";
		deleteButton.tabIndex = "-1";

		// each element needs appending
		listItem.appendChild(inputBox);
		listItem.appendChild(deleteButton);

		return listItem;
	}
	else
	{
		return false;
	}
}

// Add a new task
// Given a value when adding tasks from chrome storage array
// Given no value from button function calls
function addTask(value) {
	console.log("Add task...");

	console.log(blacklistArray.length);

	// get value from addTask() button press
	if(typeof value == "undefined")
	{
		console.log('button call');
		value = taskInput.value;
	}
	else
	{
		console.log("chrome storage call");
	}

	var listItem = createNewTaskElement(value);

	// check for add button click with empty input box
	if (value)
	{
		blacklistArray.push(value);
		blacklist.insertBefore(listItem, addRow);
		bindTaskEvents(listItem);
		console.log("list item created successfully");
	}

	taskInput.value = ""; // clear input window
}

function bindTaskEvents(taskListItem) {
	console.log("Bind list item events");
	//select taskListItem's children
	var deleteButton = taskListItem.querySelector("button.delete");

	//bind deleteTask to delete button
	deleteButton.onclick = deleteTask;
}

// Delete an existing task
function deleteTask() {
	console.log("Delete task...");
	var listItem = this.parentNode;
	var ul = listItem.parentNode;

	//Remove the parent list item from the ul
	ul.removeChild(listItem);
}


// Add button click
addButton.addEventListener("click", function() {
	addTask();
});
// Enter key press
taskInput.onkeydown = function(e){
   if(e.keyCode == 13){
     addTask();
   }
};




