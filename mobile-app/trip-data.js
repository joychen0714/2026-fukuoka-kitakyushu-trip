window.tripData = {
  meta: {
    title: "2026 福岡北九州自由行",
    subtitle: "2026 福岡北九州 7 天 6 夜",
    startDate: "2026-06-18",
    endDate: "2026-06-24",
    currencies: {
      JPY: { label: "JPY", prefix: "¥", rate: 1 },
      TWD: { label: "TWD", prefix: "NT$", rate: 0.22 },
      USD: { label: "USD", prefix: "US$", rate: 0.0068 }
    }
  },
  regions: [
    { name: "福岡", color: "#28b67a" },
    { name: "北九州", color: "#e97822" },
    { name: "大分", color: "#8f55c7" },
    { name: "熊本", color: "#3d84d8" }
  ],
  days: [
    {
      day: "D1",
      date: "6/18",
      label: "福岡 Day 1",
      region: "福岡",
      stay: "HEARTS Capsule Hotel & Spa 博多",
      stayMap: "https://maps.app.goo.gl/qXG8YmrdsfNCzcgE7",
      weather: { icon: "🌤️", temp: 28, range: "28°/22°", rain: "18%" },
      items: [
        { time: "09:55", icon: "✈️", title: "去程航班・AK1510", tag: "交通", status: "已確認", note: "桃園 T1 出發，13:15 抵達福岡機場。", cost: 0, map: "https://maps.app.goo.gl/" },
        { time: "13:45", icon: "🚇", title: "福岡機場 → 博多", tag: "交通", note: "抵達後先移動到博多，確認交通卡與隔日路線。", cost: 260 },
        { time: "15:00", icon: "🏨", title: "住宿 Check-in", tag: "住宿", status: "待付款", note: "HEARTS Capsule Hotel & Spa 博多，6 晚住宿基地。", cost: 5800, map: "https://maps.app.goo.gl/qXG8YmrdsfNCzcgE7" },
        { time: "18:30", icon: "🍜", title: "博多站晚餐與伴手禮初看", tag: "美食", note: "先熟悉博多站動線，保留彈性補買日用品。", cost: 1800 }
      ]
    },
    {
      day: "D2",
      date: "6/19",
      label: "北九州 Day 1",
      region: "北九州",
      stay: "HEARTS Capsule Hotel & Spa 博多",
      stayMap: "https://maps.app.goo.gl/qXG8YmrdsfNCzcgE7",
      weather: { icon: "⛅", temp: 27, range: "27°/21°", rain: "12%" },
      items: [
        { time: "08:30", icon: "🚄", title: "博多 → 小倉", tag: "交通", status: "待確認", note: "依 JR PASS 或單程票方案調整，先到小倉再接門司港。", cost: 2160 },
        { time: "10:00", icon: "🏯", title: "小倉城與勝山公園", tag: "景點", note: "小倉市區核心景點，可安排城內展示與周邊散步。", cost: 350 },
        { time: "13:30", icon: "🚃", title: "小倉 → 門司港", tag: "交通", note: "轉往門司港 Retro，下午看港町建築與海景。", cost: 280 },
        { time: "14:00", icon: "⚓", title: "門司港 Retro", tag: "景點", status: "已確認", note: "參考舊網站主視覺，安排門司港站、懷舊街區與海邊散策。", cost: 0 },
        { time: "18:30", icon: "🍛", title: "門司港燒咖哩", tag: "美食", note: "北九州代表食物，晚餐後返回博多。", cost: 1800 }
      ]
    },
    {
      day: "D3",
      date: "6/20",
      label: "福岡近郊",
      region: "福岡",
      stay: "HEARTS Capsule Hotel & Spa 博多",
      stayMap: "https://maps.app.goo.gl/qXG8YmrdsfNCzcgE7",
      weather: { icon: "🌦️", temp: 26, range: "26°/21°", rain: "35%" },
      items: [
        { time: "09:00", icon: "⛩️", title: "宮地嶽神社", tag: "景點", note: "海之道景觀與神社散步，交通銜接需預留時間。", cost: 780 },
        { time: "13:30", icon: "⛩️", title: "箱崎宮", tag: "景點", note: "回到福岡市區後安排安靜的神社行程。", cost: 0 },
        { time: "16:00", icon: "🌳", title: "大濠公園", tag: "景點", note: "天氣穩定時散步，若下雨改逛博多站或天神地下街。", cost: 0 },
        { time: "19:00", icon: "🍲", title: "福岡鍋物或拉麵", tag: "美食", note: "視體力安排水炊、拉麵或屋台。", cost: 2200 }
      ]
    },
    {
      day: "D4",
      date: "6/21",
      label: "由布院 Day",
      region: "大分",
      stay: "HEARTS Capsule Hotel & Spa 博多",
      stayMap: "https://maps.app.goo.gl/qXG8YmrdsfNCzcgE7",
      weather: { icon: "🌤️", temp: 25, range: "25°/19°", rain: "20%" },
      items: [
        { time: "08:00", icon: "🚆", title: "博多 → 由布院", tag: "交通", status: "待確認", note: "若搭由布院之森需提前訂位；巴士可作備案。", cost: 5200 },
        { time: "11:00", icon: "🏞️", title: "金鱗湖散步", tag: "景點", note: "先走湖邊，再銜接湯之坪街道。", cost: 0 },
        { time: "13:00", icon: "🍰", title: "湯之坪街道午餐與甜點", tag: "美食", note: "小店、甜點與伴手禮集中，節奏可以放慢。", cost: 2400 },
        { time: "15:00", icon: "🎨", title: "COMICO ART MUSEUM YUFUIN", tag: "景點", note: "若要入館，先確認開館日與票價。", cost: 1700 },
        { time: "18:00", icon: "🚆", title: "由布院 → 博多", tag: "交通", note: "回程班次保守安排，避免太晚抵達。", cost: 5200 }
      ]
    },
    {
      day: "D5",
      date: "6/22",
      label: "熊本 Day",
      region: "熊本",
      stay: "HEARTS Capsule Hotel & Spa 博多",
      stayMap: "https://maps.app.goo.gl/qXG8YmrdsfNCzcgE7",
      weather: { icon: "☀️", temp: 29, range: "29°/22°", rain: "8%" },
      items: [
        { time: "08:30", icon: "🚄", title: "博多 → 熊本", tag: "交通", status: "待確認", note: "新幹線往返，依 JR PASS 方案決定是否納入。", cost: 5230 },
        { time: "10:00", icon: "🏯", title: "熊本城", tag: "景點", status: "已確認", note: "腹地大，建議保留 2 小時以上步行與拍照時間。", cost: 800 },
        { time: "12:30", icon: "🍜", title: "熊本拉麵午餐", tag: "美食", note: "可安排城彩苑周邊或市區店家。", cost: 1500 },
        { time: "14:00", icon: "🏘️", title: "櫻之馬場城彩苑", tag: "景點", note: "適合補伴手禮與休息。", cost: 0 },
        { time: "17:30", icon: "🚄", title: "熊本 → 博多", tag: "交通", note: "回博多後整理採買清單。", cost: 5230 }
      ]
    },
    {
      day: "D6",
      date: "6/23",
      label: "海之中道",
      region: "福岡",
      stay: "HEARTS Capsule Hotel & Spa 博多",
      stayMap: "https://maps.app.goo.gl/qXG8YmrdsfNCzcgE7",
      weather: { icon: "🌧️", temp: 26, range: "26°/22°", rain: "48%" },
      items: [
        { time: "09:00", icon: "🚃", title: "博多 → 海之中道", tag: "交通", note: "受天氣影響較大，雨天可改市區備案。", cost: 650 },
        { time: "10:00", icon: "🌷", title: "海之中道海濱公園", tag: "景點", note: "視花況與天氣安排散步路線。", cost: 450 },
        { time: "13:00", icon: "🐟", title: "志賀島午餐", tag: "美食", note: "若交通與天氣允許，安排海邊餐食。", cost: 2200 },
        { time: "16:30", icon: "🛍️", title: "博多站最後採買", tag: "購物", note: "補明太子、點心、調味料與行李空間檢查。", cost: 5000 }
      ]
    },
    {
      day: "D7",
      date: "6/24",
      label: "返台 Day",
      region: "福岡",
      stay: "返台日",
      stayMap: "https://maps.app.goo.gl/",
      weather: { icon: "🌤️", temp: 27, range: "27°/22°", rain: "18%" },
      items: [
        { time: "08:30", icon: "🍳", title: "早餐・退房與寄放行李", tag: "美食", status: "已確認", note: "最後一天保留行李整理與退房時間。", cost: 1200 },
        { time: "10:00", icon: "⛩️", title: "太宰府天滿宮", tag: "景點", note: "若體力充足安排近郊；若下雨改博多站採買。", cost: 820 },
        { time: "14:30", icon: "🎁", title: "博多站伴手禮收尾", tag: "購物", note: "確認明太子、甜點、調味料與托運限制。", cost: 6000 },
        { time: "16:30", icon: "🚇", title: "博多 → 福岡機場", tag: "交通", note: "預留報到、退稅與安檢時間。", cost: 260 },
        { time: "18:55", icon: "✈️", title: "回程航班・IT721", tag: "交通", status: "已確認", note: "福岡出發，20:25 抵達桃園。", cost: 0 }
      ]
    }
  ],
  expenses: [
    { item: "AK1510 去程機票", category: "交通", amount: 9986, paid: true },
    { item: "IT721 回程機票", category: "交通", amount: 0, paid: true },
    { item: "HEARTS Capsule Hotel & Spa 博多", category: "住宿", amount: 5800, paid: false },
    { item: "鐵道與市區交通預估", category: "交通", amount: 26000, paid: false },
    { item: "餐食與咖啡預估", category: "美食", amount: 18000, paid: false },
    { item: "伴手禮與購物預估", category: "購物", amount: 12000, paid: false }
  ],
  tasks: [
    { title: "確認 JR PASS 或單程票方案", group: "交通", done: false },
    { title: "確認由布院列車或巴士訂位", group: "交通", done: false },
    { title: "確認住宿付款與取消規則", group: "住宿", done: false },
    { title: "整理護照、信用卡、旅遊保險", group: "文件", done: false },
    { title: "完成伴手禮清單與行李空間估算", group: "購物", done: false },
    { title: "打包雨具、行動電源與常備藥", group: "行李", done: false }
  ]
};
