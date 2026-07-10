/**
 * PRODUCTIVITY DASHBOARD - CUSTOMIZATION CONFIG
 * Edit these values to personalize the dashboard.
 */
const CONFIG = {
  colors: {
    dark: {
      bgA: "#060817",
      bgB: "#132449",
      bgC: "#4b3b8f",
      text: "#f7fbff",
      muted: "rgba(247, 251, 255, 0.68)",
      card: "rgba(10, 18, 40, 0.62)",
      cardStrong: "rgba(15, 27, 58, 0.78)",
      stroke: "rgba(255, 255, 255, 0.18)",
      accent: "#69efff",
      accent2: "#ffcf73",
      good: "#76f6a8",
      warn: "#ffd166",
      danger: "#ff7390",
      shadow: "0 28px 90px rgba(0, 0, 0, 0.36)"
    },
    light: {
      text: "#102034",
      muted: "rgba(16, 32, 52, 0.64)",
      card: "rgba(255, 255, 255, 0.62)",
      cardStrong: "rgba(255, 255, 255, 0.8)",
      stroke: "rgba(255, 255, 255, 0.68)",
      shadow: "0 28px 90px rgba(52, 75, 115, 0.2)"
    },
    morning: {
      bgA: "#ffecd2",
      bgB: "#8fd3f4",
      bgC: "#fcb69f",
      accent: "#ff985f",
      accent2: "#ffe67a"
    },
    afternoon: {
      bgA: "#78c9ff",
      bgB: "#2a76d2",
      bgC: "#00c8ff",
      accent: "#5df3ff",
      accent2: "#ffffff"
    },
    evening: {
      bgA: "#33145f",
      bgB: "#ff7657",
      bgC: "#ffd166",
      accent: "#ffdf85",
      accent2: "#ff7aa4"
    },
    night: {
      bgA: "#040716",
      bgB: "#122344",
      bgC: "#4b3f8f",
      accent: "#76f4ff",
      accent2: "#b8a7ff"
    }
  },
  animation: {
    viewTransition: 520,
    cardStagger: 80,
    buttonHover: 220,
    timerTick: 1000,
    clockUpdate: 1000
  },
  pomodoro: {
    focusMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15
  },
  features: {
    enableWeather: true,
    enableQuotes: true,
    enableAutoTheme: true,
    enableNotifications: false
  },
  storage: {
    todos: "prod-dashboard-todos-v2",
    planner: "prod-dashboard-planner-v2",
    goals: "prod-dashboard-goals-v2",
    theme: "prod-dashboard-theme",
    quote: "prod-dashboard-quote",
    timer: "prod-dashboard-timer-v2",
    weatherCache: "prod-dashboard-weather-cache-v2"
  },
  api: {
    weather: "https://api.open-meteo.com/v1/forecast",
    quotes: "https://api.quotable.io/random",
    weatherTimeout: 5000,
    quoteTimeout: 5000
  },
  weather: {
    defaultLat: 28.35,
    defaultLon: 79.42,
    defaultLocation: "Bareilly, UP"
  },
  sampleData: {
    todos: true,
    planner: true,
    goals: true
  }
};

const storageKeys = CONFIG.storage;

const quotes = [
  { text: "Small steps compound into visible confidence.", author: "Productive Dashboard" },
  { text: "Protect your attention and your output will protect your ambition.", author: "Focus note" },
  { text: "A clear plan turns pressure into movement.", author: "Daily system" },
  { text: "Do the next useful thing with unusual care.", author: "Deep work mantra" },
  { text: "Momentum is built by keeping promises small enough to keep.", author: "Habit craft" },
  { text: "Your calendar is a sketch. Your attention paints the day.", author: "Planner thought" }
];

const features = {
  todos: { title: "Todo List", kicker: "Task workspace" },
  planner: { title: "Daily Planner", kicker: "Schedule workspace" },
  pomodoro: { title: "Pomodoro Timer", kicker: "Focus workspace" },
  goals: { title: "Daily Goals", kicker: "Progress workspace" },
  quotes: { title: "Motivation Quotes", kicker: "Mindset workspace" },
  weather: { title: "Weather", kicker: "Forecast workspace" }
};

const sampleTodos = [
  { id: createId(), text: "Review today's top three priorities", priority: "High", due: "18:30", complete: false },
  { id: createId(), text: "Finish one portfolio-quality task", priority: "Medium", due: "20:00", complete: false },
  { id: createId(), text: "Take a clean reset break", priority: "Low", due: "16:15", complete: true }
];

const samplePlanner = [
  { id: createId(), time: "09:00", title: "Lecture prep and inbox sweep", done: false },
  { id: createId(), time: "11:00", title: "Project build sprint", done: false },
  { id: createId(), time: "17:00", title: "Workout and reset", done: false }
];

const sampleGoals = [
  { id: createId(), text: "Complete 4 focus sessions", done: false },
  { id: createId(), text: "Move or stretch for 20 minutes", done: false },
  { id: createId(), text: "Clear the most important assignment", done: true }
];

const state = {
  theme: localStorage.getItem(storageKeys.theme) || "dark",
  phase: getTimePhase(new Date().getHours()),
  todos: readStorage(storageKeys.todos, CONFIG.sampleData.todos ? sampleTodos : []),
  planner: readStorage(storageKeys.planner, CONFIG.sampleData.planner ? samplePlanner : []),
  goals: readStorage(storageKeys.goals, CONFIG.sampleData.goals ? sampleGoals : []),
  quote: readStorage(storageKeys.quote, quotes[0]),
  timer: readStorage(storageKeys.timer, createTimerState("focus", false)),
  intervalId: null
};

const els = {
  body: document.body,
  root: document.documentElement,
  homeView: document.querySelector("#homeView"),
  featureView: document.querySelector("#featureView"),
  featureTitle: document.querySelector("#featureTitle"),
  featureKicker: document.querySelector("#featureKicker"),
  backButton: document.querySelector("#backButton"),
  greetingText: document.querySelector("#greetingText"),
  liveTime: document.querySelector("#liveTime"),
  liveDate: document.querySelector("#liveDate"),
  homeQuote: document.querySelector("#homeQuote"),
  newHomeQuote: document.querySelector("#newHomeQuote"),
  upcomingCard: document.querySelector("#upcomingCard"),
  upcomingLabel: document.querySelector("#upcomingLabel"),
  upcomingTitle: document.querySelector("#upcomingTitle"),
  upcomingMeta: document.querySelector("#upcomingMeta"),
  homeGoalPercent: document.querySelector("#homeGoalPercent"),
  homeGoalBar: document.querySelector("#homeGoalBar"),
  miniTimer: document.querySelector("#miniTimer"),
  miniTimerText: document.querySelector("#miniTimerText"),
  themeToggle: document.querySelector("#themeToggle"),
  themeLabel: document.querySelector("#themeLabel"),
  todoForm: document.querySelector("#todoForm"),
  todoInput: document.querySelector("#todoInput"),
  todoPriority: document.querySelector("#todoPriority"),
  todoDue: document.querySelector("#todoDue"),
  todoList: document.querySelector("#todoList"),
  todoStats: document.querySelector("#todoStats"),
  plannerForm: document.querySelector("#plannerForm"),
  plannerTime: document.querySelector("#plannerTime"),
  plannerTitle: document.querySelector("#plannerTitle"),
  plannerList: document.querySelector("#plannerList"),
  plannerStats: document.querySelector("#plannerStats"),
  timerMode: document.querySelector("#timerMode"),
  timerRing: document.querySelector("#timerRing"),
  timerDisplay: document.querySelector("#timerDisplay"),
  timerStatus: document.querySelector("#timerStatus"),
  startTimer: document.querySelector("#startTimer"),
  pauseTimer: document.querySelector("#pauseTimer"),
  resetTimer: document.querySelector("#resetTimer"),
  goalForm: document.querySelector("#goalForm"),
  goalInput: document.querySelector("#goalInput"),
  goalList: document.querySelector("#goalList"),
  goalStats: document.querySelector("#goalStats"),
  goalPercent: document.querySelector("#goalPercent"),
  goalBar: document.querySelector("#goalBar"),
  quoteText: document.querySelector("#quoteText"),
  quoteAuthor: document.querySelector("#quoteAuthor"),
  shuffleQuote: document.querySelector("#shuffleQuote"),
  weatherTitle: document.querySelector("#weatherTitle"),
  weatherLocation: document.querySelector("#weatherLocation"),
  homeWeatherTemp: document.querySelector("#homeWeatherTemp"),
  homeWeatherMeta: document.querySelector("#homeWeatherMeta"),
  weatherTemp: document.querySelector("#weatherTemp"),
  weatherDetails: document.querySelector("#weatherDetails")
};

function init() {
  applyConfigTokens();
  applySavedTheme();
  applyFeatureFlags();
  normalizeTimer();
  bindEvents();
  renderAll();
  updateClock();
  fetchWeatherData();
  setInterval(updateClock, CONFIG.animation.clockUpdate);
  setInterval(tickTimer, CONFIG.animation.timerTick);
}

function bindEvents() {
  document.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => openFeature(button.dataset.open));
  });

  els.backButton.addEventListener("click", showHome);
  els.themeToggle.addEventListener("click", toggleTheme);
  els.newHomeQuote.addEventListener("click", setRandomQuote);
  els.shuffleQuote.addEventListener("click", setRandomQuote);
  els.todoForm.addEventListener("submit", addTodo);
  els.plannerForm.addEventListener("submit", addPlannerBlock);
  els.goalForm.addEventListener("submit", addGoal);
  els.startTimer.addEventListener("click", startTimer);
  els.pauseTimer.addEventListener("click", pauseTimer);
  els.resetTimer.addEventListener("click", resetTimer);
}

function renderAll() {
  renderQuote();
  renderTodos();
  renderPlanner();
  renderGoals();
  updateDashboardAlert();
  updateTimerUI();
}

function applyConfigTokens() {
  els.root.style.setProperty("--view-transition", `${CONFIG.animation.viewTransition}ms`);
  els.root.style.setProperty("--button-hover", `${CONFIG.animation.buttonHover}ms`);
  document.querySelectorAll(".feature-card").forEach((card, index) => {
    card.style.animationDelay = `${index * CONFIG.animation.cardStagger}ms`;
  });
  applyThemeVariables();
}

function applyThemeVariables() {
  const base = CONFIG.colors.dark;
  const phase = CONFIG.features.enableAutoTheme ? CONFIG.colors[state.phase] : {};
  const mode = state.theme === "light" ? CONFIG.colors.light : {};
  const tokens = { ...base, ...phase, ...mode };
  const cssNames = {
    bgA: "--bg-a",
    bgB: "--bg-b",
    bgC: "--bg-c",
    text: "--text",
    muted: "--muted",
    card: "--card",
    cardStrong: "--card-strong",
    stroke: "--stroke",
    accent: "--accent",
    accent2: "--accent-2",
    good: "--good",
    warn: "--warn",
    danger: "--danger",
    shadow: "--shadow"
  };

  Object.entries(cssNames).forEach(([key, cssName]) => {
    if (tokens[key]) els.root.style.setProperty(cssName, tokens[key]);
  });
}

function applyFeatureFlags() {
  setFeatureVisible("weather", CONFIG.features.enableWeather);
  setFeatureVisible("quotes", CONFIG.features.enableQuotes);
  if (!CONFIG.features.enableQuotes) {
    els.homeQuote.textContent = "Quotes are disabled in CONFIG.features.";
  }
  if (els.weatherLocation) {
    els.weatherLocation.textContent = CONFIG.weather.defaultLocation;
  }
}

function setFeatureVisible(featureName, visible) {
  document.querySelectorAll(`[data-open="${featureName}"], [data-panel="${featureName}"]`).forEach((node) => {
    node.classList.toggle("hidden", !visible);
  });
}

function updateClock() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes().toString().padStart(2, "0");
  const displayHour = hour % 12 || 12;
  const period = hour >= 12 ? "PM" : "AM";

  state.phase = getTimePhase(hour);
  els.liveTime.textContent = `${displayHour}:${minute} ${period}`;
  els.liveDate.textContent = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(now);
  els.greetingText.textContent = getGreeting(hour);
  els.weatherTitle.textContent = getWeatherMood(state.phase);
  els.body.classList.remove("morning", "afternoon", "evening", "night");
  els.body.classList.add(state.phase);
  applyThemeVariables();
  updateDashboardAlert();
}

function getTimePhase(hour) {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}

function getGreeting(hour) {
  const phase = getTimePhase(hour);
  const greetings = {
    morning: "Good Morning",
    afternoon: "Good Afternoon",
    evening: "Good Evening",
    night: "Good Night"
  };
  return greetings[phase] || "Welcome";
}

function getWeatherMood(phase) {
  const moods = {
    morning: "Sunrise clarity",
    afternoon: "Bright blue focus",
    evening: "Warm sunset flow",
    night: "Moonlit calm"
  };
  return moods[phase] || "Clear and focused";
}

function openFeature(name) {
  const feature = features[name];
  if (!feature) return;

  els.featureTitle.textContent = feature.title;
  els.featureKicker.textContent = feature.kicker;
  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === name);
  });
  els.homeView.classList.remove("active");
  els.featureView.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showHome() {
  els.featureView.classList.remove("active");
  els.homeView.classList.add("active");
  updateDashboardAlert();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderTodos() {
  els.todoList.innerHTML = "";
  const sorted = [...state.todos].sort((a, b) => (a.due || "99:99").localeCompare(b.due || "99:99"));

  sorted.forEach((todo) => {
    const item = document.createElement("li");
    item.className = `list-item${todo.complete ? " complete" : ""}`;

    const check = makeButton("check-button", todo.complete ? "OK" : "", `Toggle ${todo.text}`);
    check.addEventListener("click", () => toggleTodo(todo.id));

    const main = document.createElement("div");
    main.className = "item-main";
    main.innerHTML = `
      <strong>${escapeHtml(todo.text)}</strong>
      <span class="meta">
        <span class="tag ${todo.priority.toLowerCase()}">${todo.priority}</span>
        <span class="tag">${todo.due || "No due time"}</span>
        ${isDueSoon(todo.due) && !todo.complete ? '<span class="tag warning">Due soon</span>' : ""}
      </span>
    `;

    const del = makeButton("delete-button", "x", `Delete ${todo.text}`);
    del.addEventListener("click", () => deleteTodo(todo.id));

    item.append(check, main, del);
    els.todoList.appendChild(item);
  });

  const pending = state.todos.filter((todo) => !todo.complete).length;
  els.todoStats.textContent = `${state.todos.length} tasks - ${pending} pending`;
  writeStorage(storageKeys.todos, state.todos);
}

function addTodo(event) {
  event.preventDefault();
  const text = els.todoInput.value.trim();
  if (!text) return;

  state.todos.push({
    id: createId(),
    text,
    priority: els.todoPriority.value,
    due: els.todoDue.value,
    complete: false
  });

  els.todoInput.value = "";
  els.todoDue.value = "";
  renderTodos();
  updateDashboardAlert();
}

function toggleTodo(id) {
  state.todos = state.todos.map((todo) => todo.id === id ? { ...todo, complete: !todo.complete } : todo);
  renderTodos();
  updateDashboardAlert();
}

function deleteTodo(id) {
  state.todos = state.todos.filter((todo) => todo.id !== id);
  renderTodos();
  updateDashboardAlert();
}

function renderPlanner() {
  els.plannerList.innerHTML = "";
  const sorted = [...state.planner].sort((a, b) => a.time.localeCompare(b.time));

  sorted.forEach((block) => {
    const item = document.createElement("div");
    item.className = `timeline-item${block.done ? " complete" : ""}`;

    const check = makeButton("check-button", block.done ? "OK" : "", `Toggle ${block.title}`);
    check.addEventListener("click", () => togglePlanner(block.id));

    const main = document.createElement("div");
    main.className = "item-main";
    main.innerHTML = `
      <strong>${escapeHtml(block.title)}</strong>
      <span class="meta"><span class="tag">${block.time}</span></span>
    `;

    const del = makeButton("delete-button", "x", `Delete ${block.title}`);
    del.addEventListener("click", () => deletePlanner(block.id));

    item.append(check, main, del);
    els.plannerList.appendChild(item);
  });

  const done = state.planner.filter((block) => block.done).length;
  els.plannerStats.textContent = `${state.planner.length} blocks - ${done} done`;
  writeStorage(storageKeys.planner, state.planner);
}

function addPlannerBlock(event) {
  event.preventDefault();
  const title = els.plannerTitle.value.trim();
  if (!title || !els.plannerTime.value) return;

  state.planner.push({ id: createId(), time: els.plannerTime.value, title, done: false });
  els.plannerTitle.value = "";
  els.plannerTime.value = "";
  renderPlanner();
  updateDashboardAlert();
}

function togglePlanner(id) {
  state.planner = state.planner.map((block) => block.id === id ? { ...block, done: !block.done } : block);
  renderPlanner();
  updateDashboardAlert();
}

function deletePlanner(id) {
  state.planner = state.planner.filter((block) => block.id !== id);
  renderPlanner();
  updateDashboardAlert();
}

function renderGoals() {
  els.goalList.innerHTML = "";

  state.goals.forEach((goal) => {
    const item = document.createElement("li");
    item.className = `list-item${goal.done ? " complete" : ""}`;

    const check = makeButton("check-button", goal.done ? "OK" : "", `Toggle ${goal.text}`);
    check.addEventListener("click", () => toggleGoal(goal.id));

    const main = document.createElement("div");
    main.className = "item-main";
    main.innerHTML = `<strong>${escapeHtml(goal.text)}</strong>`;

    const del = makeButton("delete-button", "x", `Delete ${goal.text}`);
    del.addEventListener("click", () => deleteGoal(goal.id));

    item.append(check, main, del);
    els.goalList.appendChild(item);
  });

  const done = state.goals.filter((goal) => goal.done).length;
  const percent = state.goals.length ? Math.round((done / state.goals.length) * 100) : 0;
  els.goalStats.textContent = `${percent}%`;
  els.goalPercent.textContent = `${percent}%`;
  els.goalBar.style.width = `${percent}%`;
  els.homeGoalPercent.textContent = `${percent}%`;
  els.homeGoalBar.style.width = `${percent}%`;
  writeStorage(storageKeys.goals, state.goals);
}

function addGoal(event) {
  event.preventDefault();
  const text = els.goalInput.value.trim();
  if (!text) return;

  state.goals.push({ id: createId(), text, done: false });
  els.goalInput.value = "";
  renderGoals();
}

function toggleGoal(id) {
  state.goals = state.goals.map((goal) => goal.id === id ? { ...goal, done: !goal.done } : goal);
  renderGoals();
}

function deleteGoal(id) {
  state.goals = state.goals.filter((goal) => goal.id !== id);
  renderGoals();
}

async function setRandomQuote() {
  if (!CONFIG.features.enableQuotes) return;

  const previousQuote = state.quote;
  state.quote = { text: "Loading quote from API...", author: "Please wait" };
  renderQuote(true);

  try {
    const data = await fetchJsonWithTimeout(CONFIG.api.quotes, CONFIG.api.quoteTimeout);
    state.quote = {
      text: data.content || data.quote || previousQuote.text,
      author: data.author || "Unknown"
    };
    writeStorage(storageKeys.quote, state.quote);
    renderQuote(true);
  } catch {
    state.quote = {
      text: "Could not load a live quote right now. Keep going anyway.",
      author: "Network fallback"
    };
    renderQuote(true);
  }
}

function renderQuote(animate = false) {
  if (!CONFIG.features.enableQuotes) return;
  els.homeQuote.textContent = state.quote.text;
  els.quoteText.textContent = state.quote.text;
  els.quoteAuthor.textContent = state.quote.author;
  if (animate) {
    [els.homeQuote, els.quoteText].forEach((node) => {
      node.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], {
        duration: CONFIG.animation.buttonHover,
        easing: "ease-out"
      });
    });
  }
}

async function fetchWeatherData() {
  if (!CONFIG.features.enableWeather) return;
  renderWeather(null, "Loading live weather...");

  const params = new URLSearchParams({
    latitude: CONFIG.weather.defaultLat,
    longitude: CONFIG.weather.defaultLon,
    current: "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation",
    timezone: "auto"
  });

  try {
    const data = await fetchJsonWithTimeout(`${CONFIG.api.weather}?${params}`, CONFIG.api.weatherTimeout);
    const current = data.current || {};
    const weather = {
      temp: Math.round(current.temperature_2m ?? 24),
      humidity: Math.round(current.relative_humidity_2m ?? 42),
      wind: Math.round(current.wind_speed_10m ?? 9),
      rain: Number(current.precipitation ?? 0).toFixed(1),
      updatedAt: Date.now()
    };
    writeStorage(storageKeys.weatherCache, weather);
    renderWeather(weather);
  } catch {
    renderWeather(readStorage(storageKeys.weatherCache, null), "Could not load live weather. Showing saved/sample data.");
  }
}

function renderWeather(weather, statusText = "") {
  const data = weather || { temp: 24, humidity: 42, wind: 9, rain: "0.0" };
  els.homeWeatherTemp.textContent = `${data.temp}\u00b0C`;
  els.weatherTemp.textContent = `${data.temp}\u00b0C`;
  els.homeWeatherMeta.textContent = statusText || `${data.rain} mm rain - ${data.wind} km/h wind`;
  els.weatherDetails.textContent = statusText || `Humidity ${data.humidity}% - wind ${data.wind} km/h - rain ${data.rain} mm - API data`;
}

async function fetchJsonWithTimeout(url, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function normalizeTimer() {
  const focusSeconds = CONFIG.pomodoro.focusMinutes * 60;
  const breakSeconds = CONFIG.pomodoro.breakMinutes * 60;
  if (!state.timer.total || !state.timer.remaining) {
    state.timer = createTimerState("focus", false);
  }

  if (state.timer.mode === "focus" && state.timer.total !== focusSeconds && !state.timer.running) {
    state.timer.total = focusSeconds;
    state.timer.remaining = focusSeconds;
  }

  if (state.timer.mode === "break" && state.timer.total !== breakSeconds && !state.timer.running) {
    state.timer.total = breakSeconds;
    state.timer.remaining = breakSeconds;
  }

  if (state.timer.running && state.timer.startedAt) {
    const elapsed = Math.floor((Date.now() - state.timer.startedAt) / 1000);
    state.timer.remaining = Math.max(0, state.timer.remaining - elapsed);
    state.timer.startedAt = Date.now();
    if (state.timer.remaining === 0) switchTimerMode();
  }
}

function startTimer() {
  if (state.timer.running) return;
  state.timer.running = true;
  state.timer.startedAt = Date.now();
  saveTimer();
  updateTimerUI();
}

function pauseTimer() {
  applyTimerElapsed();
  state.timer.running = false;
  state.timer.startedAt = null;
  saveTimer();
  updateTimerUI();
}

function resetTimer() {
  state.timer = createTimerState("focus", false);
  saveTimer();
  updateTimerUI();
}

function tickTimer() {
  if (!state.timer.running) return;
  applyTimerElapsed();
  if (state.timer.remaining <= 0) switchTimerMode();
  saveTimer();
  updateTimerUI();
}

function applyTimerElapsed() {
  if (!state.timer.running || !state.timer.startedAt) return;
  const elapsed = Math.floor((Date.now() - state.timer.startedAt) / 1000);
  if (elapsed <= 0) return;
  state.timer.remaining = Math.max(0, state.timer.remaining - elapsed);
  state.timer.startedAt = Date.now();
}

function switchTimerMode() {
  const nextMode = state.timer.mode === "focus" ? "break" : "focus";
  state.timer = createTimerState(nextMode, false);
  notify(`${nextMode === "focus" ? "Focus" : "Break"} session is ready.`);
}

function createTimerState(mode, running) {
  const minutes = mode === "focus" ? CONFIG.pomodoro.focusMinutes : CONFIG.pomodoro.breakMinutes;
  return {
    mode,
    total: minutes * 60,
    remaining: minutes * 60,
    running,
    startedAt: running ? Date.now() : null
  };
}

function saveTimer() {
  writeStorage(storageKeys.timer, state.timer);
}

function updateTimerUI() {
  const mins = Math.floor(state.timer.remaining / 60).toString().padStart(2, "0");
  const secs = (state.timer.remaining % 60).toString().padStart(2, "0");
  const elapsed = state.timer.total - state.timer.remaining;
  const progress = Math.min(360, Math.max(0, (elapsed / state.timer.total) * 360));
  const label = state.timer.mode === "focus" ? "Focus Session" : "Break Session";

  els.timerMode.textContent = label;
  els.timerDisplay.textContent = `${mins}:${secs}`;
  els.timerStatus.textContent = state.timer.running ? "Running" : "Ready";
  els.timerRing.style.setProperty("--progress", `${progress}deg`);
  els.miniTimerText.textContent = `${mins}:${secs}`;
  els.miniTimer.classList.toggle("hidden", !state.timer.running);
}

function updateDashboardAlert() {
  const nextTodo = getNextTodo();
  const nextPlanner = getNextPlanner();
  const candidates = [nextTodo, nextPlanner].filter(Boolean).sort((a, b) => a.minutes - b.minutes);
  const next = candidates[0];

  els.upcomingCard.classList.remove("warning");
  if (!next) {
    els.upcomingLabel.textContent = "Next Alert";
    els.upcomingTitle.textContent = "No urgent item";
    els.upcomingMeta.textContent = "Your system is clear for now.";
    return;
  }

  els.upcomingLabel.textContent = next.kind;
  els.upcomingTitle.textContent = next.title;
  els.upcomingMeta.textContent = `${next.time} - ${next.minutes <= 0 ? "due now" : `in ${next.minutes} min`}`;
  if (next.minutes <= 30) {
    els.upcomingCard.classList.add("warning");
  }
}

function getNextTodo() {
  return state.todos
    .filter((todo) => !todo.complete && todo.due)
    .map((todo) => ({ kind: "Upcoming Task", title: todo.text, time: todo.due, minutes: minutesUntil(todo.due) }))
    .filter((item) => item.minutes >= -5)
    .sort((a, b) => a.minutes - b.minutes)[0];
}

function getNextPlanner() {
  return state.planner
    .filter((block) => !block.done && block.time)
    .map((block) => ({ kind: "Upcoming Planner", title: block.title, time: block.time, minutes: minutesUntil(block.time) }))
    .filter((item) => item.minutes >= -5)
    .sort((a, b) => a.minutes - b.minutes)[0];
}

function minutesUntil(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  return Math.round((target - now) / 60000);
}

function isDueSoon(time) {
  if (!time) return false;
  const minutes = minutesUntil(time);
  return minutes >= 0 && minutes <= 30;
}

function applySavedTheme() {
  els.body.classList.toggle("light", state.theme === "light");
  els.themeLabel.textContent = state.theme === "light" ? "Light" : "Dark";
  applyThemeVariables();
}

function toggleTheme() {
  state.theme = els.body.classList.contains("light") ? "dark" : "light";
  els.body.classList.toggle("light", state.theme === "light");
  els.themeLabel.textContent = state.theme === "light" ? "Light" : "Dark";
  localStorage.setItem(storageKeys.theme, state.theme);
  applyThemeVariables();
}

function notify(message) {
  if (!CONFIG.features.enableNotifications || !("Notification" in window) || Notification.permission !== "granted") {
    return;
  }
  new Notification("Productive Dashboard", { body: message });
}

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : clone(fallback);
  } catch {
    return clone(fallback);
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createId() {
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function makeButton(className, text, label) {
  const button = document.createElement("button");
  button.className = className;
  button.type = "button";
  button.textContent = text;
  button.setAttribute("aria-label", label);
  return button;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CONFIG, getTimePhase, getGreeting };
}

init();
