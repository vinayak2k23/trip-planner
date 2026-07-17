# Trip Planner — AI Itinerary Generator

An interactive trip planner powered by **Groq AI** (llama-3.3-70b-versatile). Describe your trip in plain English and get a beautiful, editable day-by-day itinerary in seconds.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-trip--planner--phi--one.vercel.app-blue?style=for-the-badge&logo=vercel)](https://trip-planner-phi-one.vercel.app)

---

## Features

- 🗓 **Day-by-day itinerary** with expandable/collapsible days  
- 📍 **Stop cards** with category badges (food, sightseeing, activity, transport, rest)  
- ✏️ **Remove** individual stops  
- 🔃 **Reorder** stops with up/down controls  
- 🔄 **Retry** on error, cancel in-flight requests automatically  
- 🌙 **Premium dark UI** — glassmorphism, animations, responsive  
- 🔒 **API key never leaves the server**

---

## Setup

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com)

### Installation

```bash
# 1. Clone / enter the project
cd trip-planner

# 2. Install all dependencies (frontend + backend)
npm install

# 3. Add your API key
#    The server/.env file is already pre-filled for this assignment.
#    For a fresh setup, copy .env.example to server/.env and fill it in:
cp .env.example server/.env
# Edit server/.env and set GROQ_API_KEY=your_key_here

# 4. Start both servers with one command
npm start
```

The app will be available at **http://localhost:5173**.

### Manual start (two terminals)

```bash
# Terminal 1 — Backend
node server/index.js

# Terminal 2 — Frontend
npx vite
```

---

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `GROQ_API_KEY` | `server/.env` | Your Groq API key. **Never expose client-side.** |

---

## AI Model

- **Primary:** `llama-3.3-70b-versatile`  
- **Fallback:** `llama-3.1-8b-instant` (auto-selected on 429 rate limit)

**Tradeoff:** The 70B model produces richer, more coherent itineraries but has lower rate limits. The 8B fallback is much faster and rarely rate-limited, but descriptions may be shorter.

---

## AI Usage Note

This project was built with AI coding assistance (Antigravity / Claude) for the following:

- Scaffolding the initial project structure and component layout  
- Writing the Express server and Groq API wrapper  
- Generating Tailwind class compositions and the CSS design system  
- Drafting the system prompt for structured JSON output  

All logic (AbortController, stale-request guard, useReducer, validation) was reviewed and understood line-by-line. The AI was used as a productivity tool, not a replacement for understanding.

---

## Known Limitations

- **No persistence** — itineraries are lost on page refresh (localStorage stretch goal not implemented)  
- **Groq JSON mode** occasionally returns slightly malformed JSON when the model is under heavy load; server-side validation catches this and returns a 422
- **Rate limits** — the free Groq tier has per-minute limits; the app auto-retries with the smaller model but may still fail under burst usage  
- **No drag-and-drop** — reordering is keyboard-operable via up/down buttons (accessible baseline)
- **No auth** — anyone with the local server URL can trigger API calls

---

## Time Spent

| Phase | Time |
|---|---|
| Project setup & backend | ~1.5 hrs |
| Groq integration + validation | ~1 hr |
| Frontend components | ~2.5 hrs |
| CSS / design system | ~1 hr |
| State management + lifecycle | ~1 hr |
| Polish & README | ~0.5 hr |
| **Total** | **~7.5 hrs** |
