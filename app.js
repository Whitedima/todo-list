// Список задач: чистый JavaScript, данные хранятся в localStorage
const STORAGE_KEY = "todo-tasks-v1";

const form = document.getElementById("add-form");
const input = document.getElementById("task-input");
const hint = document.getElementById("hint");
const list = document.getElementById("list");
const empty = document.getElementById("empty");
const counter = document.getElementById("counter");
const clearDone = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll(".filter");

let tasks = load();
let filter = "all";

// --- хранилище ---
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    /* хранилище недоступно: список живёт до перезагрузки */
  }
}

// --- действия ---
function addTask(text) {
  tasks.push({ id: Date.now() + Math.random(), text: text, done: false });
  save();
  render();
}

function toggleTask(id) {
  const t = tasks.find((x) => x.id === id);
  if (t) t.done = !t.done;
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((x) => x.id !== id);
  save();
  render();
}

// --- отрисовка ---
function render() {
  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done
  );

  list.innerHTML = "";
  visible.forEach((t) => {
    const li = document.createElement("li");
    li.className = "item" + (t.done ? " is-done" : "");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "item__check";
    check.checked = t.done;
    check.setAttribute("aria-label", "Выполнено");
    check.addEventListener("change", () => toggleTask(t.id));

    const span = document.createElement("span");
    span.className = "item__text";
    span.textContent = t.text; // textContent: текст не исполняется как HTML

    const del = document.createElement("button");
    del.type = "button";
    del.className = "item__del";
    del.textContent = "×";
    del.setAttribute("aria-label", "Удалить задачу");
    del.addEventListener("click", () => deleteTask(t.id));

    li.append(check, span, del);
    list.appendChild(li);
  });

  empty.hidden = visible.length > 0;
  const left = tasks.filter((t) => !t.done).length;
  counter.textContent = tasks.length
    ? "Осталось выполнить: " + left + " из " + tasks.length
    : "Добавь первую задачу";
  clearDone.hidden = !tasks.some((t) => t.done);
}

// --- события ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) {
    hint.hidden = false;
    input.focus();
    return;
  }
  hint.hidden = true;
  addTask(text);
  input.value = "";
  input.focus();
});

input.addEventListener("input", () => { hint.hidden = true; });

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
    render();
  });
});

clearDone.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
});

render();
