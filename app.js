const state = {
  tasks: [],
  statusFilter: "all",
  categoryFilter: "all",
  search: ""
};

const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const titleInput = document.getElementById("task-title");
const categoryInput = document.getElementById("task-category");
const toast = document.getElementById("toast");

function loadTasks() {
  const saved = localStorage.getItem("domExplorerTasks");

  state.tasks = saved
    ? JSON.parse(saved)
    : [
        {
          id: "task-1",
          title: "Learn DOM Tree construction",
          category: "study",
          status: "pending"
        },
        {
          id: "task-2",
          title: "Practice event delegation",
          category: "work",
          status: "completed"
        }
      ];
}

function saveTasks() {
  localStorage.setItem("domExplorerTasks", JSON.stringify(state.tasks));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function updateCounters() {
  document.getElementById("total-count").textContent = state.tasks.length;

  document.getElementById("pending-count").textContent = state.tasks.filter(
    task => task.status === "pending"
  ).length;

  document.getElementById("complete-count").textContent = state.tasks.filter(
    task => task.status === "completed"
  ).length;
}

function getVisibleTasks() {
  return state.tasks.filter(task => {
    const matchesStatus =
      state.statusFilter === "all" || task.status === state.statusFilter;

    const matchesCategory =
      state.categoryFilter === "all" || task.category === state.categoryFilter;

    const matchesSearch = task.title.toLowerCase().includes(state.search);

    return matchesStatus && matchesCategory && matchesSearch;
  });
}

function createTaskCard(task) {
  const card = document.createElement("article");
  card.className = "task";

  card.setAttribute("data-id", task.id);
  card.setAttribute("data-status", task.status);
  card.setAttribute("data-category", task.category);

  card.dataset.id = task.id;
  card.dataset.status = task.status;
  card.dataset.category = task.category;

  const content = document.createElement("div");

  const title = document.createElement("h3");
  title.className = "task-title";
  title.appendChild(document.createTextNode(task.title));

  const meta = document.createElement("div");

  const category = document.createElement("span");
  category.className = "pill";
  category.textContent = task.category;

  const status = document.createElement("span");
  status.className = "pill";
  status.textContent = task.status;

  meta.append(category, status);
  content.append(title, meta);

  const actions = document.createElement("div");
  actions.className = "actions";

  actions.innerHTML = `
    <button type="button" class="edit" title="Edit">E</button>
    <button type="button" class="complete" title="Complete">C</button>
    <button type="button" class="delete" title="Delete">X</button>
  `;

  card.append(content, actions);

  return card;
}

function renderTasks() {
  taskList.innerHTML = "";

  const visibleTasks = getVisibleTasks();

  if (visibleTasks.length === 0) {
    taskList.appendChild(emptyState);
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");

    const fragment = document.createDocumentFragment();

    visibleTasks.forEach(task => {
      fragment.appendChild(createTaskCard(task));
    });

    taskList.appendChild(fragment);

    const firstCompleted = taskList.querySelector(
      '.task[data-status="completed"]'
    );

    if (firstCompleted) {
      const heading = document.createElement("div");
      heading.className = "hint";
      heading.textContent = "Completed tasks below";
      firstCompleted.before(heading);
    }

    const lastTask = taskList.querySelector(".task:last-of-type");

    if (lastTask) {
      const note = document.createElement("div");
      note.className = "hint";
      note.textContent = "End of current task list";
      lastTask.after(note);
    }
  }

  updateCounters();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const task = {
    id: `task-${Date.now()}`,
    title: titleInput.value.trim(),
    category: categoryInput.value,
    status: "pending"
  };

  if (!task.title || !task.category) return;

  state.tasks.unshift(task);
  saveTasks();
  renderTasks();

  taskForm.reset();
  showToast("Task added with DOM APIs");
});

taskList.addEventListener("click", event => {
  const card = event.target.closest(".task");

  if (!card) return;

  const id = card.getAttribute("data-id");
  const task = state.tasks.find(item => item.id === id);

  if (!task) return;

  if (event.target.closest(".complete")) {
    task.status = task.status === "completed" ? "pending" : "completed";

    card.dataset.status = task.status;
    card.setAttribute("data-status", task.status);

    saveTasks();
    renderTasks();
    showToast("Task status changed");
  }

  if (event.target.closest(".delete")) {
    state.tasks = state.tasks.filter(item => item.id !== id);

    card.remove();
    saveTasks();
    renderTasks();

    showToast("Task removed");
  }

  if (event.target.closest(".edit")) {
    const editor = document.createElement("div");
    editor.className = "task";

    editor.innerHTML = `
      <input class="edit-title" value="${task.title.replaceAll('"', "&quot;")}" />
      <div class="actions">
        <button type="button" class="save-edit">S</button>
        <button type="button" class="cancel-edit">X</button>
      </div>
    `;

    card.replaceWith(editor);

    editor.querySelector(".save-edit").addEventListener("click", () => {
      const newTitle = editor.querySelector(".edit-title").value.trim();

      if (newTitle) {
        task.title = newTitle;
      }

      saveTasks();
      renderTasks();

      showToast("Task edited with replaceWith()");
    });

    editor.querySelector(".cancel-edit").addEventListener("click", () => {
      editor.replaceWith(card);
    });
  }
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    state.statusFilter = button.dataset.filter;

    renderTasks();
  });
});

document.getElementById("task-search").addEventListener("input", event => {
  state.search = event.target.value.toLowerCase().trim();
  renderTasks();
});

document.getElementById("category-filter").addEventListener("change", event => {
  state.categoryFilter = event.target.value;
  renderTasks();
});

document.getElementById("clear-all").addEventListener("click", () => {
  state.tasks = [];
  saveTasks();
  renderTasks();

  showToast("All tasks cleared");
});

const attrInput = document.getElementById("attr-input");
const propOutput = document.getElementById("prop-output");
const attrOutput = document.getElementById("attr-output");

attrInput.addEventListener("input", () => {
  // input.value is a live DOM property, so it changes immediately as the user types.
  propOutput.textContent = attrInput.value;

  // getAttribute("value") reads the HTML attribute, which stays the same until setAttribute changes it.
  attrOutput.textContent =
    attrInput.getAttribute("value") ?? "(no value attribute)";
});

document.getElementById("set-attr").addEventListener("click", () => {
  attrInput.setAttribute("value", "Changed by setAttribute");
  attrOutput.textContent = attrInput.getAttribute("value");

  showToast(`hasAttribute: ${attrInput.hasAttribute("value")}`);
});

document.getElementById("remove-attr").addEventListener("click", () => {
  attrInput.removeAttribute("value");
  attrOutput.textContent = "(no value attribute)";

  showToast(`hasAttribute: ${attrInput.hasAttribute("value")}`);
});

const logBox = document.getElementById("event-console");

const eventElements = [
  {
    name: "Grandparent",
    element: document.getElementById("grandparent")
  },
  {
    name: "Parent",
    element: document.getElementById("parent")
  },
  {
    name: "Child",
    element: document.getElementById("child-btn")
  }
];

let eventHandlers = [];

function selectedEventMode() {
  return document.querySelector('input[name="event-mode"]:checked').value;
}

function writeLog(name, event) {
  if (logBox.textContent === "Waiting for click...") {
    logBox.textContent = "";
  }

  const row = document.createElement("div");
  row.className = "log";

  row.textContent = `${name} | phase ${event.eventPhase} | target: ${event.target.id} | currentTarget: ${event.currentTarget.id}`;

  logBox.appendChild(row);

  console.log(name);
}

function flash(element) {
  element.classList.add("flash");

  setTimeout(() => {
    element.classList.remove("flash");
  }, 450);
}

function setupPropagation() {
  eventHandlers.forEach(item => {
    item.element.removeEventListener("click", item.handler, item.capture);
  });

  eventHandlers = [];

  const capture = selectedEventMode() === "capture";

  eventElements.forEach(item => {
    const handler = event => {
      writeLog(item.name, event);
      flash(item.element);
    };

    item.element.addEventListener("click", handler, capture);

    eventHandlers.push({
      element: item.element,
      handler,
      capture
    });
  });
}

document.querySelectorAll('input[name="event-mode"]').forEach(radio => {
  radio.addEventListener("change", () => {
    logBox.textContent = "Waiting for click...";
    setupPropagation();
  });
});

document.getElementById("clear-logs").addEventListener("click", () => {
  logBox.textContent = "Waiting for click...";
});

document.querySelectorAll(".nav button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav button").forEach(item => {
      item.classList.remove("active");
    });

    document.querySelectorAll(".view").forEach(view => {
      view.classList.remove("active");
    });

    button.classList.add("active");

    document.getElementById(`view-${button.dataset.view}`).classList.add("active");

    const meta = {
      tasks: [
        "Task Manager",
        "Create, edit, complete, delete, search, filter and store tasks."
      ],
      attrs: [
        "Attributes vs Properties",
        "Live difference between DOM properties and HTML attributes."
      ],
      events: [
        "Event Propagation",
        "Bubbling and capturing order with console logs."
      ],
      pipeline: [
        "Render Pipeline",
        "HTML and CSS to DOM, CSSOM and Render Tree."
      ]
    };

    document.getElementById("page-title").textContent =
      meta[button.dataset.view][0];

    document.getElementById("page-subtitle").textContent =
      meta[button.dataset.view][1];
  });
});

document.getElementById("theme-toggle").addEventListener("click", () => {
  const root = document.documentElement;
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";

  root.setAttribute("data-theme", nextTheme);
  root.dataset.theme = nextTheme;

  document.body.classList.toggle("light-mode", nextTheme === "light");

  showToast(`Theme changed to ${nextTheme}`);
});

loadTasks();
renderTasks();
setupPropagation();