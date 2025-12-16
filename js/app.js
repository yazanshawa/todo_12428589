// File: js/app.js
// Student: yazan shawa (12428589)
// This file is intentionally incomplete.
// Your task is to implement the required behaviour using JavaScript and the Fetch API.

/*
  API ENDPOINTS (already implemented on the server):

  Base URL:
    http://portal.almasar101.com/assignment/api

  1) Add task  (POST)
     add.php?stdid=STUDENT_ID&key=API_KEY
     Body (JSON): { "title": "Task title" }
     Returns JSON with the added task.

  2) Get tasks (GET)
     get.php?stdid=STUDENT_ID&key=API_KEY
     - If "id" is omitted: returns all tasks for this student.
     - If "id=NUMBER" is provided: returns one task.

  3) Delete task (GET or DELETE)
     delete.php?stdid=STUDENT_ID&key=API_KEY&id=TASK_ID
     Deletes the task with that ID for the given student.
*/

// Configuration for this student (do not change STUDENT_ID value)
const STUDENT_ID = "12428589";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// Grab elements from the DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

// Helper to update status message
function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

// Load tasks on page load
document.addEventListener("DOMContentLoaded", function () {
  setStatus("Loading tasks...");

  fetch(API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      list.innerHTML = "";
      if (data.success && data.tasks) {
        data.tasks.forEach(function (task) {
          renderTask(task);
        });
        setStatus("");
      } else {
        setStatus("No tasks found", false);
      }
    })
    .catch(function () {
      setStatus("Error loading tasks", true);
    });
});

// Handle form submission to add a new task
if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = input.value.trim();
    if (title === "") return;

    setStatus("Adding task...");

    fetch(API_BASE + "/add.php?stdid=" + STUDENT_ID + "&key=" + API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          renderTask(data.task);
          input.value = "";
          setStatus("Task added");
        } else {
          setStatus(data.message, true);
        }
      })
      .catch(function () {
        setStatus("Error adding task", true);
      });
  });
}

// Function to render a task
function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const span = document.createElement("span");
  span.className = "task-title";
  span.textContent = task.title;

  const btn = document.createElement("button");
  btn.className = "task-delete";
  btn.textContent = "Delete";

  btn.addEventListener("click", function () {
    if (!confirm("Delete this task?")) return;

    setStatus("Deleting task...");

    fetch(API_BASE + "/delete.php?stdid=" + STUDENT_ID + "&key=" + API_KEY + "&id=" + task.id)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          li.remove();
          setStatus("Task deleted");
        } else {
          setStatus(data.message, true);
        }
      })
      .catch(function () {
        setStatus("Error deleting task", true);
      });
  });

  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.appendChild(btn);

  li.appendChild(span);
  li.appendChild(actions);
  list.appendChild(li);
}
