# 📒 Budget Workbench - Daily Ledger

A responsive expense tracking web app optimized for iPhone and Mac, built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- 📱 Responsive design for iPhone & Mac
- 🌙 Dark mode (auto-detects system preference)
- 💾 Local storage persistence
- 📊 Monthly income/expense/balance summary
- 📅 Month navigation
- ➕ Add/Delete transactions
- 🏷️ Category filtering (All / Expense / Income)
- 📤 CSV export
- 🎨 Smooth animations

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 📦 Build

```bash
npm run build
```

## 🌐 Deployment

This project auto-deploys to GitHub Pages via GitHub Actions.

### Setup Steps:

1. **Update `vite.config.ts`** — Add the `base` option for your repo name:

```ts
export default defineConfig({
  base: '/expense-tracker/', // ← Add this line
  // ... rest of config
})
```

2. **Enable GitHub Pages** in your repo:
   - Go to **Settings → Pages**
   - Under **Source**, select **GitHub Actions**

3. **Push to `main`** — The workflow will automatically build and deploy.

Your app will be live at: `https://faisal-ai.github.io/expense-tracker/`

## 🛠 Tech Stack

- React 18 + TypeScript
- Tailwind CSS v4
- Vite
- GitHub Actions

## 📄 License

MIT
