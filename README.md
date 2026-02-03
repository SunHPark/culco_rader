# CultureCode Drop Radar 🎯

> Real-time TCG hype tracking & drop calendar for collectors and traders

## Features

### 🔥 Top 10 Hype Cards
- Real-time trending cards ranking (powered by pokemontcg.io API)
- Hype Score (0-100) auto-calculated
- Price movement indicators
- "Why it's trending" summary + source links

### 📅 Drop Calendar  
- Upcoming 7-14 day release/restock schedule
- Filter by platform, region
- Notify button (browser local storage)

### 🔔 Watchlist
- Add keywords to track
- Get alerts when tracked cards spike

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run dev server
```bash
npm run dev
```

### 3. Open browser
```
http://localhost:3000
```

---

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import
3. Auto-deploy complete!

### Environment Variables (Optional)
```
POKEMON_TCG_API_KEY=your_api_key
```
- Get free key at [dev.pokemontcg.io](https://dev.pokemontcg.io/)
- Works without key, but with lower rate limits

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (React)
- **Styling**: CSS-in-JS (Inline Styles)
- **Data**: pokemontcg.io API
- **Deployment**: Vercel

---

## API Endpoints

### GET /api/hype
Returns top 10 trending cards

### GET /api/drops
Returns upcoming drops
- Query: `?days=14&category=pokemon&region=NA`

---

## Project Structure

```
culturecode-radar/
├── app/
│   ├── api/
│   │   ├── hype/route.js    # Hype cards API
│   │   └── drops/route.js   # Drop schedule API
│   ├── globals.css          # Global styles
│   ├── layout.js            # Layout
│   └── page.js              # Main page
├── package.json
├── next.config.js
├── vercel.json
└── README.md
```

---

## Roadmap

- [ ] Push notifications / Email alerts
- [ ] Price history charts
- [ ] Collection management
- [ ] Japanese / Korean set data
- [ ] Expand to anime figures, gaming consoles

---

## License

MIT License

Built with 💜 by CultureCode
