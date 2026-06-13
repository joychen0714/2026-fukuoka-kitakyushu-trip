window.tripData = {
  meta: {
    title: "2026 福岡北九州自由行",
    subtitle: "2026 福岡北九州 7 天 6 夜",
    startDate: "2026-06-18",
    endDate: "2026-06-24",
    currencies: {
      JPY: { label: "JPY", prefix: "¥" },
      TWD: { label: "TWD", prefix: "NT$" },
      USD: { label: "USD", prefix: "US$" }
    },
    rates: {
      JPY_TWD: 0.22,
      JPY_USD: 0.0068
    }
  },
  regions: [
    { name: "福岡", color: "#28b67a" },
    { name: "北九州", color: "#e97822" },
    { name: "大分", color: "#8f55c7" },
    { name: "熊本", color: "#3d84d8" },
    { name: "下關", color: "#d55368" }
  ],
  bookings: [
    {
      icon: "🏨",
      title: "HEARTS Capsule Hotel & Spa Hakata",
      detail: "6/18 入住、6/24 退房・Men's Capsule Room・住宿費 NT$5,800",
      note: "原始付款幣別為 TWD；4-14-13 Hakataekimae, Hakata-ku, Fukuoka 812-0011"
    },
    {
      icon: "✈️",
      title: "AirAsia AK1510・去程",
      detail: "6/18 桃園 T1 12:00 → 福岡 15:20・座位 18E",
      note: "航班時間已變更；目前公開班表為 12:00 起飛、15:20 抵達。建議 09:00 前抵達桃園機場，並於出發前再次核對航空公司通知。"
    },
    {
      icon: "✈️",
      title: "Tigerair IT721・回程",
      detail: "6/24 福岡 18:55 → 桃園 20:25",
      note: "手提行李 10kg，無免費托運行李；建議 16:00 左右抵達福岡機場。"
    },
    {
      icon: "🎫",
      title: "北九州 JR PASS 5 日券",
      detail: "使用期間 6/19－6/23・票價 ¥16,000",
      note: "博多－小倉不可搭山陽新幹線，改搭 JR 九州 Sonic；博多－熊本可搭九州新幹線。"
    },
    {
      icon: "🚆",
      title: "由布院之森 3 號・已劃位",
      detail: "6/21 博多 10:11 → 由布院 12:27",
      note: "2 號車 8D 靠窗座位。"
    },
    {
      icon: "📱",
      title: "Apple Pay Suica",
      detail: "建議儲值 ¥5,000－¥10,000，並設為快速交通卡",
      note: "用於地下鐵、巴士、熊本市電、超商與小額消費；長距離 JR 由 PASS 負責。"
    }
  ],
  days: [
    {
      day: "D1",
      date: "6/18",
      label: "福岡慢遊",
      region: "福岡",
      stay: "HEARTS Capsule Hotel & Spa Hakata",
      stayMap: "https://www.google.com/maps/search/?api=1&query=HEARTS%E3%82%AB%E3%83%97%E3%82%BB%E3%83%AB%E3%83%9B%E3%83%86%E3%83%AB%EF%BC%86%E3%82%B9%E3%83%91%E5%8D%9A%E5%A4%9A",
      weather: { icon: "🌦️", temp: 28, range: "梅雨季", rain: "出發前更新" },
      items: [
        { time: "12:00", icon: "✈️", title: "去程航班・AirAsia AK1510", tag: "交通", status: "時間已更新", note: "桃園 T1 → 福岡，座位 18E；目前班表預計 15:20 抵達。", cost: 0, currency: "JPY" },
        { time: "15:20", icon: "🛬", title: "抵達福岡機場", tag: "交通", note: "完成入境後，以 Apple Pay Suica 搭車前往 WORKMAN Plus 福岡吉塚店。", cost: 260, currency: "JPY" },
        { time: "16:30", icon: "🛍️", title: "WORKMAN Plus 福岡吉塚店", tag: "購物", note: "從福岡機場先前往吉塚店採買，再返回博多住宿；若入境延誤可縮短停留時間。", cost: 0, currency: "JPY" },
        { time: "18:00", icon: "🏨", title: "住宿 Check-in", tag: "住宿", status: "已預訂", note: "HEARTS Capsule Hotel & Spa Hakata，Men's Capsule Room，連住 6 晚。", cost: 0, currency: "JPY" },
        { time: "19:00", icon: "🥩", title: "晚餐・豚ステーキ十一", tag: "美食", note: "完成住宿 Check-in 後前往用餐，依實際入境與移動時間彈性調整。", cost: 2200, currency: "JPY" },
        { time: "20:30", icon: "🥐", title: "博多車站點心與伴手禮初探", tag: "購物", note: "熟悉博多站動線，可順看如水庵、Leclerc 可麗露、PRESS BUTTER SAND、MIGNON。", cost: 0, currency: "JPY" },
        { time: "22:00", icon: "♨️", title: "回住宿泡湯休息", tag: "住宿", note: "膠囊旅館建議使用耳塞與眼罩，第一晚以恢復體力為主。", cost: 0, currency: "JPY" }
      ]
    },
    {
      day: "D2",
      date: "6/19",
      label: "關門海峽",
      region: "北九州",
      stay: "HEARTS Capsule Hotel & Spa Hakata",
      stayMap: "https://www.google.com/maps/search/?api=1&query=HEARTS%E3%82%AB%E3%83%97%E3%82%BB%E3%83%AB%E3%83%9B%E3%83%86%E3%83%AB%EF%BC%86%E3%82%B9%E3%83%91%E5%8D%9A%E5%A4%9A",
      weather: { icon: "🌦️", temp: 27, range: "夜景看能見度", rain: "備雨案" },
      items: [
        { time: "08:30", icon: "🚶", title: "住宿出發 → 博多站", tag: "交通", note: "北九州 JR PASS Day 1。博多－小倉不要搭山陽新幹線。", cost: 0, currency: "JPY" },
        { time: "09:20", icon: "🚆", title: "Sonic 特急・博多 → 小倉", tag: "交通", status: "PASS", note: "約 50 分鐘；抵達小倉後轉鹿兒島本線前往門司港。", cost: 0, currency: "JPY" },
        { time: "10:25", icon: "⚓", title: "門司港懷舊區散策", tag: "景點", image: "assets/places/mojiko-retro.webp", note: "門司港站、藍翼橋、香蕉人像、舊大阪商船與海峽廣場。", cost: 0, currency: "JPY" },
        { time: "11:30", icon: "⛴️", title: "關門汽船・門司港 → 唐戶", tag: "交通", note: "約 5 分鐘，以搭船方式跨越關門海峽。", cost: 400, currency: "JPY" },
        { time: "11:40", icon: "🍣", title: "唐戶市場午餐", tag: "美食", note: "壽司、河豚味噌湯或海鮮丼；11:00－12:00 品項通常較完整。", cost: 2200, currency: "JPY" },
        { time: "12:45", icon: "⛩️", title: "赤間神宮", tag: "景點", image: "assets/places/akama-shrine.webp", note: "朱紅色水天門，從唐戶市場步行約 5 分鐘。", cost: 0, currency: "JPY" },
        { time: "13:05", icon: "📜", title: "日清講和紀念館與春帆樓", tag: "景點", status: "重點", image: "assets/places/shunpanro.webp", note: "馬關條約歷史現場，紀念館免費，約停留 30 分鐘。", cost: 0, currency: "JPY" },
        { time: "13:40", icon: "🌊", title: "壇之浦古戰場 → 御裳川公園", tag: "景點", image: "assets/places/mimosusogawa.webp", note: "沿關門海峽步行前往人行隧道下關入口。", cost: 0, currency: "JPY" },
        { time: "14:20", icon: "🚶", title: "關門海底人行隧道", tag: "景點", status: "重點", image: "assets/places/kanmon-tunnel.webp", note: "全長約 780 公尺，步行 15－20 分鐘，在福岡縣／山口縣分界線拍照。", cost: 0, currency: "JPY" },
        { time: "14:45", icon: "⛩️", title: "和布刈神社與關門大橋", tag: "景點", image: "assets/places/mekari-shrine.webp", note: "從門司側出口步行前往，再搭巴士回門司港站。", cost: 300, currency: "JPY" },
        { time: "16:00", icon: "🏯", title: "小倉城", tag: "景點", image: "assets/places/kokura-castle.webp", note: "天守閣與庭園約停留 1 小時。", cost: 350, currency: "JPY" },
        { time: "18:30", icon: "🌃", title: "皿倉山夜景", tag: "景點", image: "assets/places/sarakurayama.webp", note: "八幡站轉接駁巴士與纜車；若雨霧或能見度差，應果斷取消。", cost: 1230, currency: "JPY" },
        { time: "20:15", icon: "🚆", title: "Sonic 特急・八幡 → 博多", tag: "交通", status: "PASS", note: "預計 21:10 左右回博多，當天移動量最大。", cost: 0, currency: "JPY" }
      ]
    },
    {
      day: "D3",
      date: "6/20",
      label: "花季神社",
      region: "福岡",
      stay: "HEARTS Capsule Hotel & Spa Hakata",
      stayMap: "https://www.google.com/maps/search/?api=1&query=HEARTS%E3%82%AB%E3%83%97%E3%82%BB%E3%83%AB%E3%83%9B%E3%83%86%E3%83%AB%EF%BC%86%E3%82%B9%E3%83%91%E5%8D%9A%E5%A4%9A",
      weather: { icon: "🌦️", temp: 27, range: "紫陽花季", rain: "帶雨具" },
      items: [
        { time: "08:30", icon: "🚆", title: "博多 → 福間", tag: "交通", status: "PASS", note: "JR PASS Day 2；福間站再以 Suica 搭巴士前往宮地嶽神社。", cost: 0, currency: "JPY" },
        { time: "09:30", icon: "⛩️", title: "宮地嶽神社與菖蒲祭", tag: "景點", image: "assets/places/miyajidake-shrine.webp", note: "大注連繩、參道海景與 6 月花季是重點。", cost: 0, currency: "JPY" },
        { time: "12:00", icon: "🥩", title: "佳吉屋炭烤牛排", tag: "美食", note: "依現場營業與交通時間彈性調整。", cost: 1800, currency: "JPY" },
        { time: "14:30", icon: "💠", title: "筥崎宮紫陽花", tag: "景點", image: "assets/places/hakozaki-shrine.webp", note: "JR 至箱崎，欣賞紫陽花與神社氛圍。", cost: 500, currency: "JPY" },
        { time: "15:00", icon: "📍", title: "BOOSTER", tag: "景點", status: "15:00－19:00", mapUrl: "https://maps.app.goo.gl/3HQJeA7Jkr3mziMR6", note: "安排 15:00－19:00，結束後前往元祖もつ鍋樂天地用餐。", cost: 0, currency: "JPY" },
        { time: "20:00", icon: "🍲", title: "元祖もつ鍋樂天地", tag: "美食", note: "BOOSTER 行程結束後前往用餐，建議事前確認候位或預約狀況。", cost: 2500, currency: "JPY" },
        { time: "22:00", icon: "🍸", title: "NO LIMIT Bar", tag: "美食", note: "夜間彈性行程，隔日由布院不需過早出發。", cost: 2500, currency: "JPY" }
      ]
    },
    {
      day: "D4",
      date: "6/21",
      label: "由布院之森",
      region: "大分",
      stay: "HEARTS Capsule Hotel & Spa Hakata",
      stayMap: "https://www.google.com/maps/search/?api=1&query=HEARTS%E3%82%AB%E3%83%97%E3%82%BB%E3%83%AB%E3%83%9B%E3%83%86%E3%83%AB%EF%BC%86%E3%82%B9%E3%83%91%E5%8D%9A%E5%A4%9A",
      weather: { icon: "🌦️", temp: 24, range: "山區較涼", rain: "帶薄外套" },
      items: [
        { time: "10:11", icon: "🚆", title: "由布院之森 3 號", tag: "交通", status: "已劃位", note: "JR PASS Day 3；博多 10:11 → 由布院 12:27，2 號車 8D 靠窗。", cost: 0, currency: "JPY" },
        { time: "12:40", icon: "🍚", title: "由布釜飯心", tag: "美食", note: "抵達後先用餐，熱門時段可能需要候位。", cost: 2600, currency: "JPY" },
        { time: "14:00", icon: "🎨", title: "COMICO ART MUSEUM YUFUIN", tag: "景點", status: "待預約", image: "assets/places/comico-yufuin.webp", note: "週末人多，建議事前預約並確認開館資訊。", cost: 1700, currency: "JPY" },
        { time: "15:30", icon: "🍡", title: "cuuchi 銅鑼燒與湯之坪街道", tag: "美食", note: "安排甜點、小店與伴手禮。", cost: 1200, currency: "JPY" },
        { time: "16:30", icon: "🏞️", title: "金鱗湖", tag: "景點", image: "assets/places/lake-kinrin.webp", note: "放在行程後段，下午光線較柔和；山區比福岡涼約 3－5°C。", cost: 0, currency: "JPY" },
        { time: "18:00", icon: "🚆", title: "由布院 → 博多", tag: "交通", status: "PASS", note: "回程班次仍需核對並確認是否已劃位。", cost: 0, currency: "JPY" }
      ]
    },
    {
      day: "D5",
      date: "6/22",
      label: "熊本城",
      region: "熊本",
      stay: "HEARTS Capsule Hotel & Spa Hakata",
      stayMap: "https://www.google.com/maps/search/?api=1&query=HEARTS%E3%82%AB%E3%83%97%E3%82%BB%E3%83%AB%E3%83%9B%E3%83%86%E3%83%AB%EF%BC%86%E3%82%B9%E3%83%91%E5%8D%9A%E5%A4%9A",
      weather: { icon: "🌦️", temp: 29, range: "步行量大", rain: "備雨案" },
      items: [
        { time: "08:30", icon: "🚄", title: "九州新幹線・博多 → 熊本", tag: "交通", status: "PASS", note: "JR PASS Day 4；可搭 Sakura 或 Tsubame，博多－熊本屬 PASS 範圍。", cost: 0, currency: "JPY" },
        { time: "10:00", icon: "🏯", title: "熊本城", tag: "景點", status: "重點", image: "assets/places/kumamoto-castle.webp", note: "園區腹地大，建議保留至少 2 小時。", cost: 800, currency: "JPY" },
        { time: "12:30", icon: "🍜", title: "黑亭拉麵", tag: "美食", note: "熊本代表性拉麵，依候位狀況調整前後順序。", cost: 1400, currency: "JPY" },
        { time: "14:00", icon: "🏘️", title: "櫻之馬場城彩苑", tag: "景點", image: "assets/places/josaien.webp", note: "適合休息、吃小食與購買熊本伴手禮。", cost: 0, currency: "JPY" },
        { time: "16:00", icon: "⛩️", title: "久留米水天宮・彈性", tag: "景點", status: "可取消", image: "assets/places/kurume-suitengu.webp", note: "若熊本城逛得較久或天候不佳，直接取消，避免行程過趕。", cost: 0, currency: "JPY" },
        { time: "18:00", icon: "🚄", title: "熊本 → 博多", tag: "交通", status: "PASS", note: "以九州新幹線返回博多。", cost: 0, currency: "JPY" }
      ]
    },
    {
      day: "D6",
      date: "6/23",
      label: "海之中道",
      region: "福岡",
      stay: "HEARTS Capsule Hotel & Spa Hakata",
      stayMap: "https://www.google.com/maps/search/?api=1&query=HEARTS%E3%82%AB%E3%83%97%E3%82%BB%E3%83%AB%E3%83%9B%E3%83%86%E3%83%AB%EF%BC%86%E3%82%B9%E3%83%91%E5%8D%9A%E5%A4%9A",
      weather: { icon: "🌦️", temp: 27, range: "戶外海岸", rain: "前晚決定" },
      items: [
        { time: "09:00", icon: "🚃", title: "JR 香椎線・博多 → 海之中道", tag: "交通", status: "PASS", note: "JR PASS Day 5；當天受天氣影響大，前一晚確認是否照走。", cost: 0, currency: "JPY" },
        { time: "10:00", icon: "🚲", title: "海之中道海濱公園", tag: "景點", image: "assets/places/uminonakamichi.webp", note: "花海、海景與腳踏車；建議租車減少長距離步行。", cost: 700, currency: "JPY" },
        { time: "13:00", icon: "🏝️", title: "志賀島", tag: "景點", image: "assets/places/shikanoshima.webp", note: "以 Suica 搭巴士，準備帽子、防曬、防蚊液與飲水。", cost: 700, currency: "JPY" },
        { time: "14:30", icon: "🥭", title: "芒果冰與海邊休息", tag: "美食", note: "視店家營業與交通時間彈性調整。", cost: 1000, currency: "JPY" },
        { time: "17:00", icon: "🌳", title: "大濠公園・彈性", tag: "景點", image: "assets/places/ohori-park.webp", note: "若前段順利且體力足夠再安排；雨天可改博多站或天神地下街。", cost: 0, currency: "JPY" }
      ]
    },
    {
      day: "D7",
      date: "6/24",
      label: "最後採買",
      region: "福岡",
      stay: "返台日・16:00 前往福岡機場",
      stayMap: "https://www.google.com/maps/search/?api=1&query=%E7%A6%8F%E5%B2%A1%E7%A9%BA%E6%B8%AF%20%E5%9B%BD%E9%9A%9B%E7%B7%9A%E6%97%85%E5%AE%A2%E3%82%BF%E3%83%BC%E3%83%9F%E3%83%8A%E3%83%AB",
      weather: { icon: "🌦️", temp: 28, range: "市區行程", rain: "留意航班" },
      items: [
        { time: "08:30", icon: "🧳", title: "退房與寄放行李", tag: "住宿", status: "已確認", note: "回程僅 10kg 手提、無免費托運，先確認行李重量與液體限制。", cost: 0, currency: "JPY" },
        { time: "09:30", icon: "⛩️", title: "櫛田神社與川端通商店街", tag: "景點", image: "assets/places/kushida-shrine.webp", note: "以 Suica 搭地下鐵，安排市區歷史與最後採買。", cost: 0, currency: "JPY" },
        { time: "11:30", icon: "🍲", title: "水炊鍋午餐", tag: "美食", note: "最後一餐以福岡代表料理收尾。", cost: 3000, currency: "JPY" },
        { time: "13:00", icon: "🗼", title: "福岡塔・視時間調整", tag: "景點", image: "assets/places/fukuoka-tower.webp", note: "若採買或天候影響，可取消，優先確保行李與機場時間。", cost: 800, currency: "JPY" },
        { time: "14:00", icon: "🥖", title: "Pain Stock、Full Full 與伴手禮", tag: "購物", note: "可買 PRESS BUTTER SAND、MIGNON 等；注意 10kg 手提上限。", cost: 6000, currency: "JPY" },
        { time: "16:00", icon: "🚇", title: "博多 → 福岡機場", tag: "交通", note: "地下鐵後轉國際線接駁，預留報到、安檢與移動時間。", cost: 260, currency: "JPY" },
        { time: "18:55", icon: "✈️", title: "Tigerair IT721・返台", tag: "交通", status: "已預訂", note: "福岡 18:55 → 桃園 20:25，手提行李 10kg，無免費托運。", cost: 0, currency: "JPY" }
      ]
    }
  ],
  expenses: [
    { item: "AK1510 去程機票", category: "交通", amount: 9986, currency: "TWD", paid: true },
    { item: "IT721 回程機票", category: "交通", amount: 0, currency: "TWD", paid: true, note: "金額待補" },
    { item: "HEARTS Capsule Hotel & Spa Hakata", category: "住宿", amount: 5800, currency: "TWD", paid: false, note: "原始金額 NT$5,800" },
    { item: "北九州 JR PASS 5 日券", category: "交通", amount: 16000, currency: "JPY", paid: true },
    { item: "市區交通與自費交通預估", category: "交通", amount: 5000, currency: "JPY", paid: false },
    { item: "餐食與咖啡預估", category: "美食", amount: 28000, currency: "JPY", paid: false },
    { item: "伴手禮與購物預估", category: "購物", amount: 20000, currency: "JPY", paid: false }
  ],
  shopping: [
    { id: "menbei-mentaiko", title: "めんべい辛子明太子風味煎餅", category: "食品", image: "assets/shopping/menbei-mentaiko.webp", source: "Notion", url: "https://app.notion.com/p/36db15c3afa080d6aa09c097c5572341", done: false },
    { id: "shio-kombu", title: "塩昆布", category: "食品", image: "assets/shopping/shio-kombu.webp", source: "Notion", url: "https://app.notion.com/p/36db15c3afa0805193d0fddf34953e21", done: false },
    { id: "press-butter-sand", title: "PRESS BUTTER SAND", category: "食品", image: "assets/shopping/press-butter-sand.webp", source: "Notion", url: "https://app.notion.com/p/36db15c3afa080a39d7eea6d7cda18d2", done: false },
    { id: "seven-eleven-cookie", title: "7-11 餅乾", category: "食品", image: "assets/shopping/seven-eleven-cookie.webp", source: "Notion", url: "https://app.notion.com/p/36db15c3afa0801d885ef51baa084085", done: false },
    { id: "menbei-seafood", title: "めんべい（海鮮仙貝）", category: "食品", image: "assets/shopping/menbei-seafood.webp", source: "Notion", url: "https://app.notion.com/p/36db15c3afa080daa001cd5e568c50ac", done: false },
    { id: "kayanoya-yuzu", title: "茅乃舍 柚子胡椒", category: "食品", image: "assets/shopping/kayanoya-yuzu.webp", source: "Notion", url: "https://app.notion.com/p/36db15c3afa0804baae2db6184a40408", done: false },
    { id: "mentaiko-bread", title: "明太子麵包", category: "當地食用", image: "assets/shopping/mentaiko-bread.webp", source: "Notion", url: "https://app.notion.com/p/36db15c3afa080bf8c52c2971fd998bc", done: false },
    { id: "familymart-socks", title: "全家襪子", category: "用品", image: "assets/shopping/familymart-socks.webp", source: "Notion", url: "https://app.notion.com/p/2e1b15c3afa081f68445c4702d4989b3", done: false },
    { id: "yamaya-mentaiko", title: "YAMAYA 明太子醬", category: "食品", image: "assets/shopping/yamaya-mentaiko.webp", source: "Notion", url: "https://app.notion.com/p/36db15c3afa0803ea281ead4d225c81a", done: false },
    { id: "sabrina", title: "Sabrina 千層酥", category: "食品", image: "assets/shopping/sabrina.webp", source: "Notion", url: "https://app.notion.com/p/36db15c3afa08053a309c57239fbda99", done: false },
    { id: "mentaiko-pretz", title: "明太子 PRETZ", category: "食品", image: "assets/shopping/mentaiko-pretz.webp", source: "Notion", url: "https://app.notion.com/p/36db15c3afa080f29225c35c32dc299b", done: false },
    { id: "workman-plus", title: "WORKMAN Plus", category: "用品", image: "assets/shopping/workman-plus.webp", source: "Notion", url: "https://app.notion.com/p/36db15c3afa08073a113d9808e9f7e65", done: false },
    { id: "mentaiko", title: "明太子", category: "當地食用", image: "assets/shopping/mentaiko.webp", source: "Notion", url: "https://app.notion.com/p/36db15c3afa0808695b2e0b6879d760c", done: false }
  ],
  tasks: [
    { title: "完成 Visit Japan Web 並截圖 QR Code", group: "入境", done: false },
    { title: "出發前再次核對 AK1510 航班通知", group: "航班", done: false },
    { title: "確認由布院回程列車與座位", group: "交通", done: false },
    { title: "確認 COMICO ART MUSEUM 預約", group: "行程", done: false },
    { title: "Apple Pay Suica 儲值 ¥5,000－¥10,000 並設快速交通卡", group: "支付", done: false },
    { title: "準備 2 張信用卡與 ¥20,000－¥30,000 現金", group: "支付", done: false },
    { title: "下載 eSIM、交通 App 與 Google Maps 離線地圖", group: "網路", done: false },
    { title: "確認回程 10kg 手提行李，沒有免費托運", group: "行李", done: false },
    { title: "打包摺疊傘、防水鞋、薄外套、防蚊與防曬", group: "梅雨", done: false },
    { title: "行動電源放隨身，另帶耳塞、眼罩與常備藥", group: "行李", done: false },
    { title: "6/18 抵達博多後領 JR PASS 並確認指定席", group: "交通", done: false },
    { title: "6/19 前確認皿倉山纜車營業與能見度", group: "天氣", done: false }
  ]
};
