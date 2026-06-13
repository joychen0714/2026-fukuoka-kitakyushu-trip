const data = window.tripData;
const byId = (id) => document.getElementById(id);
const storageKey = (key) => `trip-mobile-${key}`;

let selectedDay = 0;
let selectedCurrency = "JPY";
let shoppingStatus = "pending";
let shoppingCategory = "全部";
let timelineSortable = null;

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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function itemKey(item) {
  return item.id || item.title;
}

function getDayItems(day) {
  const itinerary = readState("itinerary");
  const savedDay = itinerary[day.date] || {};
  const times = savedDay.times || {};
  const baseItems = day.items.map((item) => ({
    ...item,
    _key: itemKey(item),
    time: times[itemKey(item)] || item.time
  }));
  const positions = new Map((savedDay.order || []).map((key, index) => [key, index]));

  return baseItems.sort((a, b) => {
    const aPosition = positions.has(a._key) ? positions.get(a._key) : Number.MAX_SAFE_INTEGER;
    const bPosition = positions.has(b._key) ? positions.get(b._key) : Number.MAX_SAFE_INTEGER;
    return aPosition - bPosition;
  });
}

function saveDayOrder(day, order) {
  const itinerary = readState("itinerary");
  itinerary[day.date] = { ...(itinerary[day.date] || {}), order };
  writeState("itinerary", itinerary);
}

function saveItemTime(day, key, time) {
  const itinerary = readState("itinerary");
  const savedDay = itinerary[day.date] || {};
  itinerary[day.date] = {
    ...savedDay,
    times: { ...(savedDay.times || {}), [key]: time }
  };
  writeState("itinerary", itinerary);
}

function expenseDefaults() {
  return data.expenses.map((item, index) => ({
    id: `default-${index}`,
    ...item
  }));
}

function getExpenses() {
  const saved = readState("expenses");
  return Array.isArray(saved) ? saved : expenseDefaults();
}

function saveExpenses(expenses) {
  writeState("expenses", expenses);
}

function convertCurrency(amount, sourceCurrency = "JPY") {
  if (sourceCurrency === selectedCurrency) return amount || 0;
  const rates = data.meta.rates;
  const jpy = sourceCurrency === "TWD"
    ? (amount || 0) / rates.JPY_TWD
    : sourceCurrency === "USD"
      ? (amount || 0) / rates.JPY_USD
      : (amount || 0);

  if (selectedCurrency === "TWD") return jpy * rates.JPY_TWD;
  if (selectedCurrency === "USD") return jpy * rates.JPY_USD;
  return jpy;
}

function currencyAmount(amount, sourceCurrency = "JPY") {
  const currency = data.meta.currencies[selectedCurrency];
  const converted = Math.round(convertCurrency(amount, sourceCurrency));
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

function weekdayLabel(date) {
  const year = data.meta.startDate.slice(0, 4);
  const [month, day] = date.split("/");
  const weekday = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))).getUTCDay();
  return "日一二三四五六"[weekday];
}

const googleMapPlaces = {
  "去程航班・AirAsia AK1510": { query: "桃園國際機場 第一航廈" },
  "抵達福岡機場": { query: "福岡空港 国際線旅客ターミナル" },
  "住宿 Check-in": { query: "HEARTSカプセルホテル＆スパ博多" },
  "WORKMAN Plus 福岡吉塚店": { query: "WORKMAN Plus 福岡吉塚店" },
  "晚餐・豚ステーキ十一": { query: "豚ステーキ十一 博多駅南店" },
  "博多車站點心與伴手禮初探": { query: "博多駅" },
  "回住宿泡湯休息": { query: "HEARTSカプセルホテル＆スパ博多" },
  "住宿出發 → 博多站": { origin: "HEARTSカプセルホテル＆スパ博多", destination: "博多駅" },
  "Sonic 特急・博多 → 小倉": { origin: "博多駅", destination: "小倉駅 福岡県" },
  "門司港懷舊區散策": { query: "門司港レトロ" },
  "關門汽船・門司港 → 唐戶": { origin: "関門汽船 門司港桟橋", destination: "唐戸桟橋" },
  "唐戶市場午餐": { query: "唐戸市場" },
  "赤間神宮": { query: "赤間神宮" },
  "日清講和紀念館與春帆樓": { query: "日清講和記念館 春帆楼" },
  "壇之浦古戰場 → 御裳川公園": { query: "みもすそ川公園 壇ノ浦古戦場址" },
  "關門海底人行隧道": { query: "関門トンネル人道 下関側入口" },
  "和布刈神社與關門大橋": { query: "和布刈神社" },
  "小倉城": { query: "小倉城" },
  "皿倉山夜景": { query: "皿倉山展望台" },
  "Sonic 特急・八幡 → 博多": { origin: "八幡駅 福岡県", destination: "博多駅" },
  "博多 → 福間": { origin: "博多駅", destination: "福間駅" },
  "宮地嶽神社與菖蒲祭": { query: "宮地嶽神社" },
  "佳吉屋炭烤牛排": { query: "佳吉屋 福津" },
  "筥崎宮紫陽花": { query: "筥崎宮 あじさい苑" },
  "元祖もつ鍋樂天地": { query: "元祖もつ鍋 楽天地 博多駅前店" },
  "NO LIMIT Bar": { query: "NO LIMIT BAR 福岡" },
  "由布院之森 3 號": { origin: "博多駅", destination: "由布院駅" },
  "由布釜飯心": { query: "由布まぶし 心 駅前支店" },
  "COMICO ART MUSEUM YUFUIN": { query: "COMICO ART MUSEUM YUFUIN" },
  "cuuchi 銅鑼燒與湯之坪街道": { query: "鞠智 cuuchi 由布院" },
  "金鱗湖": { query: "金鱗湖" },
  "由布院 → 博多": { origin: "由布院駅", destination: "博多駅" },
  "九州新幹線・博多 → 熊本": { origin: "博多駅", destination: "熊本駅" },
  "熊本城": { query: "熊本城" },
  "黑亭拉麵": { query: "熊本ラーメン 黒亭 本店" },
  "櫻之馬場城彩苑": { query: "桜の馬場 城彩苑" },
  "久留米水天宮・彈性": { query: "全国総本宮 水天宮 久留米" },
  "熊本 → 博多": { origin: "熊本駅", destination: "博多駅" },
  "JR 香椎線・博多 → 海之中道": { origin: "博多駅", destination: "海ノ中道駅" },
  "海之中道海濱公園": { query: "海の中道海浜公園" },
  "志賀島": { query: "志賀島 福岡" },
  "芒果冰與海邊休息": { query: "志賀島 マンゴーかき氷" },
  "大濠公園・彈性": { query: "大濠公園" },
  "退房與寄放行李": { query: "HEARTSカプセルホテル＆スパ博多" },
  "櫛田神社與川端通商店街": { query: "櫛田神社 福岡" },
  "水炊鍋午餐": { query: "博多 水炊き" },
  "福岡塔・視時間調整": { query: "福岡タワー" },
  "Pain Stock、Full Full 與伴手禮": { query: "pain stock 天神 福岡" },
  "博多 → 福岡機場": { origin: "博多駅", destination: "福岡空港 国際線旅客ターミナル" },
  "Tigerair IT721・返台": { query: "福岡空港 国際線旅客ターミナル" }
};

function googleMapsUrl(item) {
  if (item.mapUrl) return item.mapUrl;
  const place = googleMapPlaces[item.title] || { query: `${item.title} 日本` };
  if (place.origin && place.destination) {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(place.origin)}&destination=${encodeURIComponent(place.destination)}&travelmode=transit`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`;
}

function renderDayStrip() {
  const strip = byId("day-strip");
  strip.innerHTML = data.days.map((day, index) => `
    <button class="${index === selectedDay ? "active" : ""}" type="button" data-day="${index}">
      <span>${day.day}</span>
      <strong>${day.date}（${weekdayLabel(day.date)}）</strong>
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
  const items = getDayItems(day);
  byId("stay-name").textContent = day.stay;
  byId("stay-map").href = day.stayMap;

  if (timelineSortable) {
    timelineSortable.destroy();
    timelineSortable = null;
  }

  byId("timeline").innerHTML = items.map((item) => `
    <article class="timeline-row" data-item-key="${escapeHtml(item._key)}">
      <label class="timeline-time">
        <span class="sr-only">${escapeHtml(item.title)}時間</span>
        <input
          type="text"
          inputmode="numeric"
          maxlength="5"
          pattern="([01][0-9]|2[0-3]):[0-5][0-9]"
          value="${escapeHtml(item.time)}"
          data-time-key="${escapeHtml(item._key)}"
          aria-label="${escapeHtml(item.title)}時間"
        >
      </label>
      <div class="time-line"></div>
      <section class="event-card ${item.status ? "confirmed-card" : ""}">
        ${item.image ? `
          <img
            class="event-image"
            src="${item.image}"
            alt="${item.title}"
            loading="lazy"
            decoding="async"
          >
        ` : ""}
        <header>
          <div class="event-heading">
            <h2><span>${item.icon}</span>${escapeHtml(item.title)}</h2>
            <button class="drag-handle" type="button" title="長按拖曳調整順序" aria-label="拖曳 ${escapeHtml(item.title)}">⠿</button>
          </div>
          <div class="event-tags">
            <span class="tag ${tagClass(item.tag)}">${escapeHtml(item.tag)}</span>
            ${item.status ? `<span class="status">✓ ${escapeHtml(item.status)}</span>` : ""}
          </div>
        </header>
        <p>${escapeHtml(item.note)}</p>
        <footer>
          <a
            href="${googleMapsUrl(item)}"
            target="_blank"
            rel="noreferrer"
            aria-label="在 Google Maps 開啟 ${escapeHtml(item.title)}"
          >▣ 地圖</a>
          <strong>${currencyAmount(item.cost, item.currency)}</strong>
        </footer>
      </section>
    </article>
  `).join("");

  byId("timeline").querySelectorAll("[data-time-key]").forEach((input) => {
    input.addEventListener("change", () => {
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.value)) {
        input.value = items.find((item) => item._key === input.dataset.timeKey)?.time || "";
        return;
      }
      saveItemTime(day, input.dataset.timeKey, input.value);
    });
  });

  if (window.Sortable) {
    timelineSortable = window.Sortable.create(byId("timeline"), {
      animation: 180,
      handle: ".drag-handle",
      delay: 350,
      delayOnTouchOnly: true,
      touchStartThreshold: 4,
      forceFallback: true,
      fallbackOnBody: true,
      fallbackTolerance: 3,
      ghostClass: "timeline-ghost",
      chosenClass: "timeline-chosen",
      onEnd: () => {
        const order = [...byId("timeline").querySelectorAll(".timeline-row")]
          .map((row) => row.dataset.itemKey);
        saveDayOrder(day, order);
      }
    });
  }

  byId("reset-day").onclick = () => {
    const itinerary = readState("itinerary");
    delete itinerary[day.date];
    writeState("itinerary", itinerary);
    renderTimeline();
  };
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
  const expenses = getExpenses();
  const total = expenses.reduce((sum, item) => sum + convertCurrency(Number(item.amount), item.currency), 0);
  const paid = expenses
    .filter((item) => item.paid)
    .reduce((sum, item) => sum + convertCurrency(Number(item.amount), item.currency), 0);
  const percent = total ? Math.round((paid / total) * 100) : 0;

  byId("expense-summary").innerHTML = `
    <article>
      <span>目前預估</span>
      <strong>${currencyAmount(total, selectedCurrency)}</strong>
    </article>
    <article>
      <span>已付款</span>
      <strong>${currencyAmount(paid, selectedCurrency)}</strong>
    </article>
    <article>
      <span>付款比例</span>
      <strong>${percent}%</strong>
    </article>
  `;

  byId("expense-list").innerHTML = expenses.map((item) => `
    <article data-expense-id="${escapeHtml(item.id)}">
      <label class="expense-name">
        <span>項目</span>
        <input type="text" data-expense-field="item" value="${escapeHtml(item.item)}">
      </label>
      <div class="expense-grid">
        <label>
          <span>金額</span>
          <input type="number" min="0" step="1" inputmode="numeric" data-expense-field="amount" value="${Number(item.amount) || 0}">
        </label>
        <label>
          <span>幣別</span>
          <select data-expense-field="currency">
            ${Object.keys(data.meta.currencies).map((currency) => `
              <option value="${currency}" ${item.currency === currency ? "selected" : ""}>${currency}</option>
            `).join("")}
          </select>
        </label>
        <label>
          <span>分類</span>
          <select data-expense-field="category">
            ${["交通", "住宿", "美食", "購物", "景點", "其他"].map((category) => `
              <option value="${category}" ${item.category === category ? "selected" : ""}>${category}</option>
            `).join("")}
          </select>
        </label>
      </div>
      <label class="expense-note">
        <span>備註</span>
        <input type="text" data-expense-field="note" value="${escapeHtml(item.note || "")}">
      </label>
      <footer>
        <label class="expense-paid">
          <input type="checkbox" data-expense-field="paid" ${item.paid ? "checked" : ""}>
          <span>已付款</span>
        </label>
        <button class="delete-expense" type="button" aria-label="刪除 ${escapeHtml(item.item)}" title="刪除此筆">×</button>
      </footer>
    </article>
  `).join("");

  byId("expense-list").querySelectorAll("[data-expense-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const card = input.closest("[data-expense-id]");
      const expense = expenses.find((item) => item.id === card.dataset.expenseId);
      if (!expense) return;
      const field = input.dataset.expenseField;
      expense[field] = field === "paid"
        ? input.checked
        : field === "amount"
          ? Math.max(0, Number(input.value) || 0)
          : input.value;
      saveExpenses(expenses);
      renderExpenses();
    });
  });

  byId("expense-list").querySelectorAll(".delete-expense").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.closest("[data-expense-id]").dataset.expenseId;
      saveExpenses(expenses.filter((item) => item.id !== id));
      renderExpenses();
    });
  });

  byId("add-expense").onclick = () => {
    expenses.push({
      id: `custom-${Date.now()}`,
      item: "新增花費",
      category: "其他",
      amount: 0,
      currency: selectedCurrency,
      paid: false,
      note: ""
    });
    saveExpenses(expenses);
    renderExpenses();
  };

  byId("reset-expenses").onclick = () => {
    localStorage.removeItem(storageKey("expenses"));
    renderExpenses();
  };
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

function renderBookings() {
  byId("booking-list").innerHTML = data.bookings.map((booking) => `
    <article>
      <span>${booking.icon}</span>
      <div>
        <h3>${booking.title}</h3>
        <strong>${booking.detail}</strong>
        <p>${booking.note}</p>
      </div>
    </article>
  `).join("");
}

function renderShopping() {
  const saved = readState("shopping");
  const completed = data.shopping.filter((item) => saved[item.id] ?? item.done).length;
  const percent = data.shopping.length ? Math.round((completed / data.shopping.length) * 100) : 0;
  const categories = ["全部", ...new Set(data.shopping.map((item) => item.category))];
  const statusOptions = [
    { value: "all", label: "全部" },
    { value: "pending", label: "待購" },
    { value: "done", label: "已購" }
  ];

  byId("shopping-summary").innerHTML = `
    <div>
      <span>採購進度</span>
      <strong>${completed}/${data.shopping.length}</strong>
    </div>
    <div class="shopping-progress" aria-label="已完成 ${percent}%">
      <i style="width:${percent}%"></i>
    </div>
    <b>${percent}%</b>
  `;

  byId("shopping-filters").innerHTML = `
    <div class="segmented-control">
      ${statusOptions.map((option) => `
        <button class="${shoppingStatus === option.value ? "active" : ""}" type="button" data-shopping-status="${option.value}">
          ${option.label}
        </button>
      `).join("")}
    </div>
    <select id="shopping-category" aria-label="採購分類">
      ${categories.map((category) => `
        <option value="${category}" ${shoppingCategory === category ? "selected" : ""}>${category}</option>
      `).join("")}
    </select>
  `;

  const visibleItems = data.shopping.filter((item) => {
    const done = saved[item.id] ?? item.done;
    const statusMatch = shoppingStatus === "all"
      || (shoppingStatus === "done" && done)
      || (shoppingStatus === "pending" && !done);
    return statusMatch && (shoppingCategory === "全部" || item.category === shoppingCategory);
  });

  byId("shopping-list").innerHTML = visibleItems.length ? visibleItems.map((item) => {
    const done = saved[item.id] ?? item.done;
    return `
      <label class="${done ? "completed" : ""}">
        <input type="checkbox" data-shopping-item="${item.id}" ${done ? "checked" : ""}>
        <img
          class="shopping-thumb"
          src="${item.image}"
          alt=""
          loading="lazy"
          decoding="async"
        >
        <span class="shopping-copy">
          <strong>${item.title}</strong>
          <small>${item.category}</small>
        </span>
        <a href="${item.url}" target="_blank" rel="noreferrer" aria-label="在 Notion 開啟 ${item.title}">↗</a>
      </label>
    `;
  }).join("") : `<p class="empty-state">這個篩選條件目前沒有品項。</p>`;

  byId("shopping-filters").querySelectorAll("[data-shopping-status]").forEach((button) => {
    button.addEventListener("click", () => {
      shoppingStatus = button.dataset.shoppingStatus;
      renderShopping();
    });
  });

  byId("shopping-category").addEventListener("change", (event) => {
    shoppingCategory = event.target.value;
    renderShopping();
  });

  byId("shopping-list").querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      saved[input.dataset.shoppingItem] = input.checked;
      writeState("shopping", saved);
      renderShopping();
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
  renderShopping();
  renderBookings();
  renderTasks();
}

bindTabs();
renderApp();
