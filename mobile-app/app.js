const data = window.tripData;
const byId = (id) => document.getElementById(id);
const storageKey = (key) => `trip-mobile-${key}`;

let selectedDay = 0;
let selectedCurrency = "JPY";

function readState(key) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(key)) || "{}");
  } catch {
    return {};
  }
}

function writeState(key, value) {
  localStorage.setItem(storageKey(key), JSON.stringify(value));
}

function currencyAmount(amount) {
  const currency = data.meta.currencies[selectedCurrency];
  const converted = Math.round((amount || 0) * currency.rate);
  return `${currency.prefix}${converted.toLocaleString("zh-Hant-TW")}`;
}

function getRegion(regionName) {
  return data.regions.find((region) => region.name === regionName) || data.regions[0];
}

function tagClass(tag) {
  const map = {
    交通: "transport",
    美食: "food",
    景點: "spot",
    住宿: "stay",
    購物: "shop"
  };
  return map[tag] || "spot";
}

function renderDayStrip() {
  const strip = byId("day-strip");
  strip.innerHTML = data.days.map((day, index) => `
    <button class="${index === selectedDay ? "active" : ""}" type="button" data-day="${index}">
      <span>${day.day}</span>
      <strong>${day.date}</strong>
    </button>
  `).join("");

  strip.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDay = Number(button.dataset.day);
      renderApp();
    });
  });
}

function renderLegend() {
  byId("region-legend").innerHTML = data.regions.map((region) => `
    <span><i style="background:${region.color}"></i>${region.name}</span>
  `).join("");
}

function renderHeader() {
  const day = data.days[selectedDay];
  const region = getRegion(day.region);

  byId("region-pill").textContent = day.region;
  byId("region-pill").style.setProperty("--region", region.color);
  byId("day-title").textContent = `${day.day.replace("D", "Day")}・${day.date}・${day.label}`;
  byId("stay-line").textContent = `🏨 ${day.stay}`;
  byId("weather-icon").textContent = day.weather.icon;
  byId("weather-temp").textContent = `${day.weather.temp}°C`;
  byId("weather-detail").textContent = `${day.weather.range}・${day.weather.rain} ☂`;
}

function renderTimeline() {
  const day = data.days[selectedDay];
  byId("stay-name").textContent = day.stay;
  byId("stay-map").href = day.stayMap;

  byId("timeline").innerHTML = day.items.map((item) => `
    <article class="timeline-row">
      <time>${item.time}</time>
      <div class="time-line"></div>
      <section class="event-card ${item.status ? "confirmed-card" : ""}">
        <header>
          <h2><span>${item.icon}</span>${item.title}</h2>
          <div class="event-tags">
            <span class="tag ${tagClass(item.tag)}">${item.tag}</span>
            ${item.status ? `<span class="status">✓ ${item.status}</span>` : ""}
          </div>
        </header>
        <p>${item.note}</p>
        <footer>
          <button type="button">▣ 地圖</button>
          <strong>${currencyAmount(item.cost)}</strong>
        </footer>
      </section>
    </article>
  `).join("");
}

function renderCurrencyTabs() {
  document.querySelectorAll("[data-currency]").forEach((button) => {
    button.classList.toggle("active", button.dataset.currency === selectedCurrency);
    button.onclick = () => {
      selectedCurrency = button.dataset.currency;
      renderTimeline();
      renderExpenses();
    };
  });
}

function renderExpenses() {
  const total = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  const paid = data.expenses.filter((item) => item.paid).reduce((sum, item) => sum + item.amount, 0);
  const percent = total ? Math.round((paid / total) * 100) : 0;

  byId("expense-summary").innerHTML = `
    <article>
      <span>目前預估</span>
      <strong>${currencyAmount(total)}</strong>
    </article>
    <article>
      <span>已付款</span>
      <strong>${currencyAmount(paid)}</strong>
    </article>
    <article>
      <span>付款比例</span>
      <strong>${percent}%</strong>
    </article>
  `;

  byId("expense-list").innerHTML = data.expenses.map((item) => `
    <article>
      <div>
        <span class="tag ${tagClass(item.category)}">${item.category}</span>
        <h3>${item.item}</h3>
      </div>
      <strong>${currencyAmount(item.amount)}</strong>
      <small>${item.paid ? "已付款" : "待付款"}</small>
    </article>
  `).join("");
}

function renderWeather() {
  byId("weather-list").innerHTML = data.days.map((day, index) => `
    <button class="${index === selectedDay ? "active" : ""}" type="button" data-weather-day="${index}">
      <span>${day.weather.icon}</span>
      <strong>${day.day}・${day.date}</strong>
      <em>${day.region}</em>
      <b>${day.weather.temp}°C</b>
      <small>${day.weather.range}・降雨 ${day.weather.rain}</small>
    </button>
  `).join("");

  byId("weather-list").querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDay = Number(button.dataset.weatherDay);
      setTab("itinerary");
      renderApp();
    });
  });
}

function renderTasks() {
  const saved = readState("tasks");
  const completed = data.tasks.filter((task, index) => saved[index] ?? task.done).length;

  byId("task-summary").innerHTML = `
    <strong>${completed}/${data.tasks.length}</strong>
    <span>已完成提醒</span>
  `;

  byId("task-list").innerHTML = data.tasks.map((task, index) => `
    <label>
      <input type="checkbox" data-task="${index}" ${saved[index] ?? task.done ? "checked" : ""}>
      <span>
        <strong>${task.title}</strong>
        <small>${task.group}</small>
      </span>
    </label>
  `).join("");

  byId("task-list").querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      saved[input.dataset.task] = input.checked;
      writeState("tasks", saved);
      renderTasks();
    });
  });
}

function setTab(tabName) {
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${tabName}`);
  });
  document.querySelectorAll(".bottom-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
}

function bindTabs() {
  document.querySelectorAll(".bottom-nav button").forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tab));
  });
}

function renderApp() {
  renderHeader();
  renderDayStrip();
  renderLegend();
  renderTimeline();
  renderCurrencyTabs();
  renderExpenses();
  renderWeather();
  renderTasks();
}

bindTabs();
renderApp();
