# AR 專注怪獸計時器 (AR Focus Monster) 👾

這是一個結合了 **AR 擴增實境** 與 **番茄鐘計時器** 的 PWA Web App。當你準備好要讀書時，只需將鏡頭對準專屬的目標卡片，你的專屬「紫色小怪獸」就會跳出來陪你一起專注！

透過可愛的繪本風格介面與即時互動，讓枯燥的學習時光變得更有趣。

## ✨ 核心功能

- **AR 召喚怪獸**：採用 MindAR 技術，不需下載 APP，打開網頁即可掃描實體卡片召喚置中的 2D 專屬小怪獸。
- **專注計時器**：內建番茄鐘機制（專注/休息），怪獸會根據你的計時狀態改變表情（發呆、專注疲累、暫停生氣、完成開心）。
- **多科目選擇**：支援選擇國文、英文、數學、自然、社會，並帶有專屬主題色彩。
- **餵食互動獎勵**：完成一次專注挑戰後，可以點擊「餵食」與小怪獸互動。
- **背景推播通知**：支援 Service Worker 網頁通知，當專注時間結束時，手機會收到震動與推播提醒。
- **PWA 離線支援**：可以直接將網頁「加入主畫面」變成手機 APP，支援離線開啟，隨時隨地都能專注。

## 🚀 技術棧 (Tech Stack)

- **前端框架**：React 18 + Vite
- **AR 引擎**：MindAR + A-Frame (Image Tracking)
- **樣式與圖標**：Vanilla CSS (繪本暖色系) + Lucide React
- **PWA 支援**：vite-plugin-pwa
- **部署**：Vercel

## 📁 專案架構

```text
src/
├── assets/         # 靜態資源 (可選)
├── components/     # React  UI 元件
│   ├── ARSceneAFrame.tsx   # AR 鏡頭與影像追蹤核心
│   ├── OverlayUI.tsx       # 繪本風 UI 面板與狀態切換
│   └── PomodoroTimer.tsx   # 計時器邏輯元件
├── context/        # React Context 狀態管理
│   └── TimerContext.tsx    # 管理計時狀態、怪獸表情、通知與科目
├── index.css       # 全域樣式與繪本風主題設定
├── App.tsx         # 主應用進入點
└── main.tsx        # 程式初始化與 PWA 註冊
public/
├── IMG_605*.PNG    # 怪獸的不同表情圖檔
├── targets.mind    # MindAR 影像辨識特徵檔
├── marker.png      # 實體目標卡片圖片
└── icons...        # PWA 圖示
```

## 🛠️ 本地開發與運行

請確保你的電腦已經安裝了 [Node.js](https://nodejs.org/)。

1. **安裝依賴套件**
   ```bash
   npm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm run dev
   ```
   *注意：開發環境下的 AR 鏡頭可能需要 HTTPS 才能在手機上正常請求相機權限。建議直接使用 Vercel 預覽。*

3. **打包編譯**
   ```bash
   npm run build
   ```

## 📱 PWA 安裝指南

**iOS (Safari)**：
1. 使用 Safari 打開網站。
2. 點擊下方工具列的「分享」圖示。
3. 選擇「加入主畫面」。
4. 即可在桌面看到 APP 圖示，享受無網址列的全螢幕體驗。

**Android (Chrome)**：
1. 使用 Chrome 打開網站。
2. 點擊右上角選單。
3. 選擇「加到主畫面」或點擊底部的安裝提示。

## 🎨 替換吉祥物與追蹤圖

- **替換追蹤圖**：請前往 [MindAR Image Target Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile) 上傳你的新卡片，並將產生的 `.mind` 檔案替換掉 `public/targets.mind`。
- **替換吉祥物**：將去背的 `.PNG` 圖片直接替換 `public/` 目錄下的 `IMG_6054.PNG` (發呆) ~ `IMG_6057.PNG` (開心)，並維持檔名大小寫一致。
