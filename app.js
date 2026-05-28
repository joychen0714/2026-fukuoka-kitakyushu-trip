const data = window.tripData;
const money = new Intl.NumberFormat("zh-Hant-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0
});

const byId = (id) => document.getElementById(id);
const formatMoney = (value) => money.format(value || 0);

function daysUntil(dateText) {
  const today = new Date();
  const target = new Date(`${dateText}T00:00:00+08:00`);
  const diff = target.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function expenseTotals() {
  const known = data.expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const paid = data.expenses.filter((item) => item.paid).reduce((sum, item) => sum + (item.amount || 0), 0);
  const pending = known - paid;
  return { known, paid, pending };
}

function renderSummary() {
  const totals = expenseTotals();
  const paidPercent = totals.known ? Math.round((totals.paid / totals.known) * 100) : 0;
  byId("countdown").textContent = daysUntil(data.meta.startDate);
  byId("known-total").textContent = formatMoney(totals.known);
  byId("paid-total").textContent = formatMoney(totals.paid);
  byId("paid-caption").textContent = `${paidPercent}% 已付款`;
  byId("todo-total").textContent = data.expenses.filter((item) => !item.paid).length;
  byId("donut-percent").textContent = `${paidPercent}%`;
  byId("paid-side").textContent = formatMoney(totals.paid);
  byId("pending-side").textContent = formatMoney(totals.pending);
  byId("payment-donut").style.setProperty("--paid", `${paidPercent}%`);
}

function renderItinerary() {
  const filter = byId("day-filter");
  const grid = byId("day-grid");
  const reader = byId("schedule-reader");

  filter.innerHTML = data.itinerary.map((day, index) => `
    <button class="${index === 0 ? "active" : ""}" type="button" data-day="${index}" role="tab">
      <span>${day.day}</span>
      <strong>${day.date}</strong>
    </button>
  `).join("");

  grid.innerHTML = data.itinerary.map((day, index) => `
    <article class="day-card reveal ${index === 0 ? "selected" : ""}" data-day-card="${index}">
      <span>${day.day} · ${day.date}</span>
      <h3>${day.title}</h3>
      <p>${day.theme}</p>
      <small>${day.base} · ${(day.stops || []).length} 個行程</small>
    </article>
  `).join("");

  function showDay(index) {
    const day = data.itinerary[index];
    filter.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.day) === index);
    });
    grid.querySelectorAll("[data-day-card]").forEach((card) => {
      card.classList.toggle("selected", Number(card.dataset.dayCard) === index);
    });
    const stops = day.stops || [];
    reader.innerHTML = `
      <p class="eyebrow">${day.day} · ${day.date} · ${day.base}</p>
      <h3>${day.title}</h3>
      <p>${day.summary || day.theme}</p>
      <div class="stop-gallery">
        ${stops.map((stop) => `
          <article class="stop-card">
            <img src="${stop.image}" alt="${stop.name}" loading="lazy">
            <div>
              <span class="pill">${stop.type}</span>
              <h4>${stop.name}</h4>
              <p>${stop.note}</p>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  filter.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button) showDay(Number(button.dataset.day));
  });
  grid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-day-card]");
    if (card) showDay(Number(card.dataset.dayCard));
  });
  showDay(0);
}

function renderFlights() {
  byId("flight-list").innerHTML = data.flights.map((flight) => `
    <article class="flight-card">
      <div>
        <span>${flight.airline}</span>
        <h3>${flight.code}</h3>
      </div>
      <div class="flight-route">
        <p><strong>${flight.depart}</strong>${flight.from}</p>
        <i></i>
        <p><strong>${flight.arrive}</strong>${flight.to}</p>
      </div>
      <footer>
        <span>${flight.date}</span>
        <span>訂位代號 ${flight.booking}</span>
      </footer>
    </article>
  `).join("");
}

function renderTransport() {
  byId("transport-list").innerHTML = data.transport.map((item) => `
    <article>
      <span class="pill">${item.status}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderStay() {
  byId("stay-track").innerHTML = data.stays.map((stay) => `
    <article class="stay-card">
      <div class="stay-image"></div>
      <div>
        <span class="pill ${stay.paid ? "success" : "alert"}">${stay.paid ? "已付款" : "尚未付款"}</span>
        <h3>${stay.name}</h3>
        <p>${stay.city} · ${stay.checkIn} 至 ${stay.checkOut}</p>
        <dl>
          <div><dt>入住</dt><dd>${stay.checkInTime}</dd></div>
          <div><dt>退房</dt><dd>${stay.checkOutTime}</dd></div>
          <div><dt>平台</dt><dd>${stay.platform}</dd></div>
          <div><dt>金額</dt><dd>${formatMoney(stay.amount)}</dd></div>
        </dl>
        <a href="${stay.map}" target="_blank" rel="noreferrer">開啟 Google Map</a>
      </div>
    </article>
  `).join("");
}

function renderBudget() {
  const categoryTotals = data.expenses.reduce((map, item) => {
    map[item.category] = (map[item.category] || 0) + (item.amount || 0);
    return map;
  }, {});
  const max = Math.max(...Object.values(categoryTotals), 1);

  byId("category-bars").innerHTML = Object.entries(categoryTotals).map(([category, amount]) => `
    <div class="bar-row">
      <span>${category}</span>
      <div><i style="width: ${(amount / max) * 100}%"></i></div>
      <strong>${formatMoney(amount)}</strong>
    </div>
  `).join("");

  byId("expense-ledger").innerHTML = data.expenses.map((item) => `
    <article>
      <div>
        <span class="pill ${item.paid ? "success" : "alert"}">${item.paid ? "已付款" : "待處理"}</span>
        <h3>${item.item}</h3>
        <p>${item.note}</p>
      </div>
      <strong>${item.amount ? formatMoney(item.amount) : "待補"}</strong>
    </article>
  `).join("");
}

function renderPlaces() {
  const regions = ["全部", ...new Set(data.places.map((place) => place.region))];
  const filter = byId("spot-filter");
  const grid = byId("spot-grid");
  const reader = byId("spot-reader");

  filter.innerHTML = regions.map((region, index) => `
    <button class="${index === 0 ? "active" : ""}" type="button" data-region="${region}">${region}</button>
  `).join("");

  function list(region = "全部") {
    const places = region === "全部" ? data.places : data.places.filter((place) => place.region === region);
    grid.innerHTML = places.map((place, index) => `
      <button class="${index === 0 ? "active" : ""}" type="button" data-place="${data.places.indexOf(place)}">
        <span>${place.region} · ${place.type}</span>
        <strong>${place.name}</strong>
      </button>
    `).join("");
    show(data.places.indexOf(places[0]));
  }

  function show(index) {
    const place = data.places[index];
    if (!place) return;
    grid.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.place) === index);
    });
    reader.innerHTML = `
      ${place.image ? `<img class="reader-photo" src="${place.image}" alt="${place.name}" loading="lazy">` : ""}
      <p class="eyebrow">${place.region} · ${place.type}</p>
      <h3>${place.name}</h3>
      <p>${place.summary}</p>
      <ul>${place.tips.map((tip) => `<li>${tip}</li>`).join("")}</ul>
    `;
  }

  filter.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    filter.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    list(button.dataset.region);
  });
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button) show(Number(button.dataset.place));
  });
  list();
}

function renderFood() {
  byId("food-grid").innerHTML = data.foods.map((item) => `
    <article>
      ${item.image ? `<img class="food-photo" src="${item.image}" alt="${item.title}" loading="lazy">` : ""}
      <span class="pill">${item.tag}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderShopping() {
  const saved = JSON.parse(localStorage.getItem("fukuokaShopping") || "{}");
  const categories = [...new Set(data.shopping.map((item) => item.category))];
  const checkedCount = data.shopping.filter((item, index) => saved[index] ?? item.checked).length;

  byId("shopping-summary").innerHTML = `
    <article>
      <span>清單項目</span>
      <strong>${data.shopping.length}</strong>
      <small>同步 Notion 購物清單</small>
    </article>
    <article>
      <span>採購分類</span>
      <strong>${categories.length}</strong>
      <small>${categories.join("、")}</small>
    </article>
    <article>
      <span>已勾選</span>
      <strong id="shopping-checked">${checkedCount}</strong>
      <small>儲存在目前瀏覽器</small>
    </article>
  `;

  byId("shopping-grid").innerHTML = categories.map((category) => `
    <article class="shopping-column">
      <h3>${category}</h3>
      ${data.shopping
        .map((item, index) => ({ ...item, index }))
        .filter((item) => item.category === category)
        .map((item) => `
          <label class="shopping-item">
            ${item.image ? `<img src="${item.image}" alt="${item.item}" loading="lazy">` : ""}
            <input type="checkbox" data-shop="${item.index}" ${saved[item.index] ?? item.checked ? "checked" : ""}>
            <span>
              <strong>${item.item}</strong>
              <small>${item.place}</small>
              <em>${item.note}</em>
            </span>
          </label>
        `).join("")}
    </article>
  `).join("");

  byId("shopping-grid").addEventListener("change", (event) => {
    const input = event.target.closest("input");
    if (!input) return;
    saved[input.dataset.shop] = input.checked;
    localStorage.setItem("fukuokaShopping", JSON.stringify(saved));
    byId("shopping-checked").textContent = Object.values(saved).filter(Boolean).length;
  });
}

function renderPacking() {
  const saved = JSON.parse(localStorage.getItem("fukuokaPacking") || "{}");
  byId("packing-grid").innerHTML = data.packing.map((group, groupIndex) => `
    <article>
      <h3>${group.category}</h3>
      ${group.items.map((item, itemIndex) => {
        const key = `${groupIndex}-${itemIndex}`;
        return `
          <label>
            <input type="checkbox" data-pack="${key}" ${saved[key] ? "checked" : ""}>
            <span>${item}</span>
          </label>
        `;
      }).join("")}
    </article>
  `).join("");

  byId("packing-grid").addEventListener("change", (event) => {
    const input = event.target.closest("input");
    if (!input) return;
    saved[input.dataset.pack] = input.checked;
    localStorage.setItem("fukuokaPacking", JSON.stringify(saved));
  });
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in");
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
}

renderSummary();
renderItinerary();
renderFlights();
renderTransport();
renderStay();
renderBudget();
renderPlaces();
renderFood();
renderShopping();
renderPacking();
revealOnScroll();
