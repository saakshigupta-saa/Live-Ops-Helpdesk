# Live Ops Helpdesk

A real-time collaborative helpdesk dashboard built with **Node.js, Express, MongoDB, and Socket.io** for managing support tickets without concurrent editing conflicts.

## ✨ Features

* 🎫 Ticket management with REST API
* 🔒 Real-time ticket locking
* 👥 Multi-agent collaboration
* ⚡ Instant lock/unlock updates with Socket.io
* 🔄 Automatic unlock when an agent disconnects
* 🛡️ Input validation and HTML escaping
* 📊 Ticket status and priority management
* 🧪 Jest + Supertest API tests
* 🔍 ESLint code quality checks

## 🛠️ Tech Stack

**Frontend:** HTML, CSS, JavaScript
**Backend:** Node.js, Express.js
**Database:** MongoDB + Mongoose
**Real-time:** Socket.io
**Testing:** Jest + Supertest
**Linting:** ESLint

## 🚀 Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5000
```

Create `.env`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:5000
```

## 🧪 Tests

```bash
npm test
```

**8/8 tests passing ✅**

```bash
npm run lint
```

**0 errors · 0 warnings ✅**

## 🔐 Concurrency Demo

Two agents can open the dashboard simultaneously:

**Agent A → Lock Ticket → Agent B instantly sees the lock → Agent A disconnects → Ticket automatically unlocks → Agent B can edit.**

No page refresh required.

## 👩‍💻 Developer

**Sakshi Gupta**

**Project:** Live Ops Helpdesk — Client Delivery Phase II
**Track B:** Fullstack Engineers — Node.js / Express / Socket.io
