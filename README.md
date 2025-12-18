# Finance AI 💹

An AI-powered financial dashboard that helps users track their portfolio, analyze market news, and get intelligent insights about their investments.

![Finance AI Dashboard](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Vite](https://img.shields.io/badge/Vite-7.0-purple)

## ✨ Features

### 📊 Interactive Stock Chart
- Real-time tracking of **S&P 500** and **NASDAQ** indices
- Multiple timeframe views (1D, 1W, 1M, 3M, 1Y)
- Beautiful TradingView-inspired design with smooth animations

### 📰 Smart News Feed
- Categorized financial news (Business, Tech, Politics, Economy)
- Impact analysis badges showing market effect
- **One-click AI analysis** - Ask "How does this affect my portfolio?"

### 💼 Portfolio Dashboard
- Total portfolio value with daily performance
- Top holdings with live price changes
- Performance metrics (1D, 1W, 1M, YTD)

### 🤖 AI Advisor
- Conversational AI for portfolio insights
- Context-aware responses based on market news
- Quick prompt suggestions for common queries

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/CashBuddy.git

# Navigate to project directory
cd CashBuddy

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx      # Main layout
│   ├── StockChart.tsx     # Interactive chart
│   ├── EventList.tsx      # News feed
│   ├── Portfolio.tsx      # Holdings view
│   ├── AIAdvisor.tsx      # Chat interface
│   └── Sidebar.tsx        # Navigation
├── data/
│   └── mockStockData.ts   # Stock data generator
├── types/
│   └── stockTypes.ts      # TypeScript interfaces
└── index.css              # Design system
```

## 🎨 Design Philosophy

- **Modern & Spacious**: TradingView-inspired layout with generous spacing
- **Dark Mode First**: Easy on the eyes for extended use
- **Soft Surfaces**: Subtle glassmorphism effects without heavy borders
- **Pink/Purple Accent**: Refined, non-masculine aesthetic

## 📝 License

MIT License - feel free to use this project for learning and development.

---

Built with ❤️ using React and TypeScript
