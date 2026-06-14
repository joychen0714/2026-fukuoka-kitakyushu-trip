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
  return item.id || item._key || item.title;
}

function getDayItems(day) {
  const itinerary = readState("itinerary");
  const savedDay = itinerary[day.date] || {};
  if (Array.isArray(savedDay.items)) {
    return savedDay.items.map((item, index) => ({
      ...item,
      id: item.id || `saved-${day.day}-${index}`,
      _key: item.id || `saved-${day.day}-${index}`
    }));
  }

  const times = savedDay.times || {};
  const baseItems = day.items.map((item, index) => ({
    ...item,
    id: item.id || `default-${day.day}-${index}`,
    _key: item.id || `default-${day.day}-${index}`,
    time: times[itemKey(item)] || times[item.title] || item.time
  }));
  const positions = new Map((savedDay.order || []).map((key, index) => [key, index]));

  return baseItems.sort((a, b) => {
    const aPosition = positions.has(a._key) ? positions.get(a._key) : Number.MAX_SAFE_INTEGER;
    const bPosition = positions.has(b._key) ? positions.get(b._key) : Number.MAX_SAFE_INTEGER;
    return aPosition - bPosition;
  });
}

function saveDayItems(day, items) {
  const itinerary = readState("itinerary");
  itinerary[day.date] = {
    items: items.map(({ _key, ...item }) => ({
      ...item,
      id: item.id || _key
    }))
  };
  writeState("itinerary", itinerary);
}

function saveItemTime(day, key, time) {
  const items = getDayItems(day);
  const item = items.find((entry) => entry._key === key);
  if (!item) return;
  item.time = time;
  saveDayItems(day, items);
}

function expenseDefaults() {
  return data.expenses.map((item, index) => ({
    id: `default-${index}`,
    ...item
  }));
}

function getExpenses() {
  const saved = readState("expenses");
  const expenses = (Array.isArray(saved) ? saved : expenseDefaults()).map((item) => ({
    ...item,
    autoShopping: false
  }));
  const shoppingItems = getShoppingItems();
  let shoppingExpense = expenses.find((item) => (
    String(item.item).includes("伴手禮") || item.id === "auto-shopping"
  ));
  if (!shoppingExpense) {
    shoppingExpense = {
      id: "auto-shopping",
      item: "伴手禮與購物",
      category: "購物",
      paid: false
    };
    expenses.push(shoppingExpense);
  }
  shoppingExpense.item = "伴手禮與購物";
  shoppingExpense.category = "購物";
  shoppingExpense.amount = shoppingTotalJpy(shoppingItems);
  shoppingExpense.currency = "JPY";
  shoppingExpense.note = "由採購清單價格自動統計";
  shoppingExpense.autoShopping = true;
  return expenses;
}

function saveExpenses(expenses) {
  writeState("expenses", expenses);
}

function taskDefaults() {
  return data.tasks.map((task, index) => ({
    id: `default-${index}`,
    ...task
  }));
}

function getTasks() {
  const saved = readState("tasks");
  if (Array.isArray(saved)) return saved;

  return taskDefaults().map((task, index) => ({
    ...task,
    done: saved[index] ?? task.done
  }));
}

function saveTasks(tasks) {
  writeState("tasks", tasks);
}

function shoppingDefaults() {
  const completion = readState("shopping");
  return data.shopping.map((item) => ({
    price: 0,
    currency: "JPY",
    ...item,
    done: completion[item.id] ?? item.done
  }));
}

function getShoppingItems() {
  const saved = readState("shoppingItems");
  return Array.isArray(saved) ? saved : shoppingDefaults();
}

function saveShoppingItems(items) {
  writeState("shoppingItems", items);
}

function shoppingTotalJpy(items = getShoppingItems()) {
  return items.reduce((total, item) => {
    const price = Number(item.price) || 0;
    if (item.currency === "TWD") return total + (price / data.meta.rates.JPY_TWD);
    if (item.currency === "USD") return total + (price / data.meta.rates.JPY_USD);
    return total + price;
  }, 0);
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
            <div class="event-tools">
              <button class="edit-event" type="button" title="編輯行程" aria-label="編輯 ${escapeHtml(item.title)}">✎</button>
              <button class="drag-handle" type="button" title="長按拖曳調整順序" aria-label="拖曳 ${escapeHtml(item.title)}">⠿</button>
            </div>
          </div>
          <div class="event-tags">
            <span class="tag ${tagClass(item.tag)}">${escapeHtml(item.tag)}</span>
            ${item.status ? `<span class="status">✓ ${escapeHtml(item.status)}</span>` : ""}
          </div>
        </header>
        <p>${escapeHtml(item.note)}</p>
        <div class="event-editor" hidden>
          <label>
            <span>名稱</span>
            <input type="text" data-event-field="title" value="${escapeHtml(item.title)}">
          </label>
          <label>
            <span>圖示</span>
            <input type="text" data-event-field="icon" value="${escapeHtml(item.icon || "")}" maxlength="4">
          </label>
          <label>
            <span>分類</span>
            <select data-event-field="tag">
              ${["交通", "住宿", "美食", "景點", "購物"].map((tag) => `
                <option value="${tag}" ${item.tag === tag ? "selected" : ""}>${tag}</option>
              `).join("")}
            </select>
          </label>
          <label>
            <span>說明</span>
            <textarea data-event-field="note" rows="3">${escapeHtml(item.note)}</textarea>
          </label>
          <label>
            <span>Google Maps 網址</span>
            <input type="url" data-event-field="mapUrl" value="${escapeHtml(item.mapUrl || "")}" placeholder="https://">
          </label>
          <label>
            <span>照片網址</span>
            <input type="url" data-event-field="image" value="${escapeHtml(item.image || "")}" placeholder="https://">
          </label>
          <label>
            <span>預估費用</span>
            <input type="number" min="0" step="1" inputmode="numeric" data-event-field="cost" value="${Number(item.cost) || 0}">
          </label>
          <label>
            <span>幣別</span>
            <select data-event-field="currency">
              ${Object.keys(data.meta.currencies).map((currency) => `
                <option value="${currency}" ${item.currency === currency ? "selected" : ""}>${currency}</option>
              `).join("")}
            </select>
          </label>
          <button class="delete-event" type="button">刪除此行程</button>
        </div>
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

  byId("timeline").querySelectorAll(".edit-event").forEach((button) => {
    button.addEventListener("click", () => {
      const editor = button.closest(".event-card").querySelector(".event-editor");
      editor.hidden = !editor.hidden;
    });
  });

  byId("timeline").querySelectorAll("[data-event-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const row = input.closest(".timeline-row");
      const currentItems = getDayItems(day);
      const item = currentItems.find((entry) => entry._key === row.dataset.itemKey);
      if (!item) return;
      const field = input.dataset.eventField;
      item[field] = field === "cost"
        ? Math.max(0, Number(input.value) || 0)
        : input.value;
      saveDayItems(day, currentItems);
      renderTimeline();
    });
  });

  byId("timeline").querySelectorAll(".delete-event").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.closest(".timeline-row").dataset.itemKey;
      saveDayItems(day, getDayItems(day).filter((item) => item._key !== key));
      renderTimeline();
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
        const currentItems = getDayItems(day);
        saveDayItems(day, order.map((key) => currentItems.find((item) => item._key === key)).filter(Boolean));
      }
    });
  }

  byId("add-itinerary").onclick = () => {
    const items = getDayItems(day);
    const id = `custom-${Date.now()}`;
    items.push({
      id,
      _key: id,
      time: "12:00",
      icon: "📍",
      title: "新增行程",
      tag: "景點",
      note: "",
      mapUrl: "",
      cost: 0,
      currency: "JPY"
    });
    saveDayItems(day, items);
    renderTimeline();
  };

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
        <input type="text" data-expense-field="item" value="${escapeHtml(item.item)}" ${item.autoShopping ? "readonly" : ""}>
      </label>
      <div class="expense-grid">
        <label>
          <span>金額</span>
          <input type="number" min="0" step="1" inputmode="numeric" data-expense-field="amount" value="${Math.round(Number(item.amount)) || 0}" ${item.autoShopping ? "readonly" : ""}>
        </label>
        <label>
          <span>幣別</span>
          <select data-expense-field="currency" ${item.autoShopping ? "disabled" : ""}>
            ${Object.keys(data.meta.currencies).map((currency) => `
              <option value="${currency}" ${item.currency === currency ? "selected" : ""}>${currency}</option>
            `).join("")}
          </select>
        </label>
        <label>
          <span>分類</span>
          <select data-expense-field="category" ${item.autoShopping ? "disabled" : ""}>
            ${["交通", "住宿", "美食", "購物", "景點", "其他"].map((category) => `
              <option value="${category}" ${item.category === category ? "selected" : ""}>${category}</option>
            `).join("")}
          </select>
        </label>
      </div>
      <label class="expense-note">
        <span>備註</span>
        <input type="text" data-expense-field="note" value="${escapeHtml(item.note || "")}" ${item.autoShopping ? "readonly" : ""}>
      </label>
      <footer>
        <label class="expense-paid">
          <input type="checkbox" data-expense-field="paid" ${item.paid ? "checked" : ""}>
          <span>已付款</span>
        </label>
        ${item.autoShopping ? "" : `
          <button class="delete-expense" type="button" aria-label="刪除 ${escapeHtml(item.item)}" title="刪除此筆">×</button>
        `}
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
  const tasks = getTasks();
  const completed = tasks.filter((task) => task.done).length;

  byId("task-summary").innerHTML = `
    <strong>${completed}/${tasks.length}</strong>
    <span>已完成提醒</span>
  `;

  byId("task-list").innerHTML = tasks.map((task) => `
    <article data-task-id="${escapeHtml(task.id)}" class="${task.done ? "completed" : ""}">
      <label class="task-done">
        <input type="checkbox" data-task-field="done" ${task.done ? "checked" : ""}>
        <span>完成</span>
      </label>
      <label class="task-title">
        <span>提醒內容</span>
        <input type="text" data-task-field="title" value="${escapeHtml(task.title)}">
      </label>
      <label class="task-group">
        <span>分類</span>
        <input type="text" data-task-field="group" value="${escapeHtml(task.group)}">
      </label>
      <label class="task-url">
        <span>連結</span>
        <input type="url" data-task-field="url" value="${escapeHtml(task.url || "")}" placeholder="https://">
      </label>
      <footer>
      ${task.url ? `
        <a href="${task.url}" target="_blank" rel="noreferrer" aria-label="開啟 ${escapeHtml(task.title)}">↗</a>
      ` : ""}
        <button class="delete-task" type="button" aria-label="刪除 ${escapeHtml(task.title)}" title="刪除此筆">×</button>
      </footer>
    </article>
  `).join("");

  byId("task-list").querySelectorAll("[data-task-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const card = input.closest("[data-task-id]");
      const task = tasks.find((item) => item.id === card.dataset.taskId);
      if (!task) return;
      const field = input.dataset.taskField;
      task[field] = field === "done" ? input.checked : input.value;
      saveTasks(tasks);
      renderTasks();
    });
  });

  byId("task-list").querySelectorAll(".delete-task").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.closest("[data-task-id]").dataset.taskId;
      saveTasks(tasks.filter((task) => task.id !== id));
      renderTasks();
    });
  });

  byId("add-task").onclick = () => {
    tasks.push({
      id: `custom-${Date.now()}`,
      title: "新增提醒",
      group: "其他",
      url: "",
      done: false
    });
    saveTasks(tasks);
    renderTasks();
  };

  byId("reset-tasks").onclick = () => {
    localStorage.removeItem(storageKey("tasks"));
    renderTasks();
  };
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
  const items = getShoppingItems();
  const completed = items.filter((item) => item.done).length;
  const percent = items.length ? Math.round((completed / items.length) * 100) : 0;
  const categories = ["全部", ...new Set(items.map((item) => item.category))];
  const totalJpy = shoppingTotalJpy(items);
  const statusOptions = [
    { value: "all", label: "全部" },
    { value: "pending", label: "待購" },
    { value: "done", label: "已購" }
  ];

  byId("shopping-summary").innerHTML = `
    <div>
      <span>採購進度</span>
      <strong>${completed}/${items.length}</strong>
    </div>
    <div class="shopping-progress" aria-label="已完成 ${percent}%">
      <i style="width:${percent}%"></i>
    </div>
    <div class="shopping-total">
      <small>品項合計</small>
      <b>${currencyAmount(totalJpy)}</b>
    </div>
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

  const visibleItems = items.filter((item) => {
    const statusMatch = shoppingStatus === "all"
      || (shoppingStatus === "done" && item.done)
      || (shoppingStatus === "pending" && !item.done);
    return statusMatch && (shoppingCategory === "全部" || item.category === shoppingCategory);
  });

  byId("shopping-list").innerHTML = visibleItems.length ? visibleItems.map((item) => `
    <article data-shopping-id="${escapeHtml(item.id)}" class="${item.done ? "completed" : ""}">
      ${item.image ? `
        <img class="shopping-thumb" src="${item.image}" alt="" loading="lazy" decoding="async">
      ` : `<div class="shopping-thumb shopping-placeholder">＋</div>`}
      <label class="shopping-done">
        <input type="checkbox" data-shopping-field="done" ${item.done ? "checked" : ""}>
        <span>已購</span>
      </label>
      <label class="shopping-title">
        <span>品項</span>
        <input type="text" data-shopping-field="title" value="${escapeHtml(item.title)}">
      </label>
      <label>
        <span>分類</span>
        <input type="text" data-shopping-field="category" value="${escapeHtml(item.category)}">
      </label>
      <label>
        <span>價格</span>
        <input type="number" min="0" step="1" inputmode="numeric" data-shopping-field="price" value="${Number(item.price) || 0}">
      </label>
      <label>
        <span>幣別</span>
        <select data-shopping-field="currency">
          ${Object.keys(data.meta.currencies).map((currency) => `
            <option value="${currency}" ${item.currency === currency ? "selected" : ""}>${currency}</option>
          `).join("")}
        </select>
      </label>
      <label class="shopping-url">
        <span>參考連結</span>
        <input type="url" data-shopping-field="url" value="${escapeHtml(item.url || "")}" placeholder="https://">
      </label>
      <footer>
        ${item.url ? `<a href="${item.url}" target="_blank" rel="noreferrer" aria-label="開啟 ${escapeHtml(item.title)}">↗</a>` : ""}
        <button class="delete-shopping" type="button" aria-label="刪除 ${escapeHtml(item.title)}" title="刪除此筆">×</button>
      </footer>
    </article>
  `).join("") : `<p class="empty-state">這個篩選條件目前沒有品項。</p>`;

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

  byId("shopping-list").querySelectorAll("[data-shopping-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const card = input.closest("[data-shopping-id]");
      const item = items.find((entry) => entry.id === card.dataset.shoppingId);
      if (!item) return;
      const field = input.dataset.shoppingField;
      item[field] = field === "done"
        ? input.checked
        : field === "price"
          ? Math.max(0, Number(input.value) || 0)
          : input.value;
      saveShoppingItems(items);
      renderShopping();
      renderExpenses();
    });
  });

  byId("shopping-list").querySelectorAll(".delete-shopping").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.closest("[data-shopping-id]").dataset.shoppingId;
      saveShoppingItems(items.filter((item) => item.id !== id));
      renderShopping();
      renderExpenses();
    });
  });

  byId("add-shopping").onclick = () => {
    items.push({
      id: `custom-${Date.now()}`,
      title: "新增採購品項",
      category: "其他",
      image: "",
      url: "",
      price: 0,
      currency: "JPY",
      done: false
    });
    shoppingStatus = "all";
    shoppingCategory = "全部";
    saveShoppingItems(items);
    renderShopping();
  };

  byId("reset-shopping").onclick = () => {
    localStorage.removeItem(storageKey("shoppingItems"));
    localStorage.removeItem(storageKey("shopping"));
    renderShopping();
    renderExpenses();
  };
}

function setTab(tabName) {
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${tabName}`);
  });
  document.querySelectorAll(".bottom-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
}

const userDataKeys = ["itinerary", "expenses", "shoppingItems", "shopping", "tasks"];

function currentUserData() {
  return {
    itinerary: readState("itinerary"),
    expenses: getExpenses().map(({ autoShopping, ...item }) => item),
    shoppingItems: getShoppingItems(),
    shopping: readState("shopping"),
    tasks: getTasks()
  };
}

function setBackupStatus(message, isError = false) {
  const status = byId("data-backup-status");
  status.textContent = message;
  status.classList.toggle("error", isError);
}

function exportUserData() {
  const payload = {
    version: 1,
    trip: data.meta.title,
    exportedAt: new Date().toISOString(),
    state: currentUserData()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `fukuoka-trip-data-${date}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setBackupStatus("資料已匯出，修改網站前可用此檔同步最新內容。");
}

async function importUserData(file) {
  try {
    const payload = JSON.parse(await file.text());
    const state = payload.state && typeof payload.state === "object"
      ? payload.state
      : payload;
    if (!state || typeof state !== "object") throw new Error("資料格式不正確");

    let imported = 0;
    userDataKeys.forEach((key) => {
      if (Object.hasOwn(state, key)) {
        writeState(key, state[key]);
        imported += 1;
      }
    });
    if (!imported) throw new Error("找不到可匯入的旅程資料");

    renderApp();
    setBackupStatus(`已匯入 ${imported} 類資料。`);
  } catch (error) {
    setBackupStatus(`匯入失敗：${error.message}`, true);
  }
}

function bindDataBackup() {
  byId("export-data").addEventListener("click", exportUserData);
  byId("import-data").addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (file) await importUserData(file);
    event.target.value = "";
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
bindDataBackup();
renderApp();
