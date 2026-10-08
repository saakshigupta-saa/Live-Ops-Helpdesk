# 🚨 Live Ops Helpdesk

A real-time collaborative helpdesk dashboard built with **Node.js, Express, MongoDB, and Socket.io** to prevent concurrent ticket editing conflicts.

## 📸 Screenshots

### 🖥️ Helpdesk Dashboard

<img width="1887" height="976" alt="Screenshot 2026-10-08 193006" src="https://github.com/user-attachments/assets/53c8f199-5bd7-4205-b3fd-6cb5c8251dff" />


> The dashboard updates ticket lock states instantly without requiring a page refresh.

## ✨ Features

* 🎫 Create, view, and update support tickets
* 🔒 Real-time ticket locking
* 👥 Multi-agent collaboration
* ⚡ Instant lock/unlock updates with Socket.io
* 🔄 Automatic ticket unlock when an agent disconnects
* 🛡️ Input validation and HTML escaping
* 📊 Ticket status and priority management
* 🧪 Jest + Supertest API testing
* 🔍 ESLint code quality checks

## 🛠️ Tech Stack

| Technology            | Purpose                 |
| --------------------- | ----------------------- |
| HTML, CSS, JavaScript | Frontend                |
| Node.js               | Runtime                 |
| Express.js            | REST API                |
| MongoDB + Mongoose    | Database                |
| Socket.io             | Real-time communication |
| Jest + Supertest      | Testing                 |
| ESLint                | Code quality            |

## 🔐 Real-Time Concurrency

The application prevents two agents from editing the same ticket simultaneously.

```text
Agent A
   │
   ├── Lock Ticket
   │
   ▼
Server Map()
   │
   ├── Ticket locked
   │
   ├──────────────► Agent B sees "Locked by Agent A"
   │
   ▼
Agent A disconnects
   │
   ▼
Automatic unlock
   │
   ▼
Agent B can now edit
```

No page refresh is required.

## 🧪 Testing

Run:

```bash
npm test
```

**8/8 tests passing ✅**

Run linting:

```bash
npm run lint
```

**0 errors · 0 warnings ✅**

## 🚀 Run Locally

Clone the repository:

```bash
git clone https://github.com/saakshigupta-saa/Live-Ops-Helpdesk.git
cd Live-Ops-Helpdesk
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:5000
```

Start the application:

```bash
npm run dev
```

Open:

```text
http://localhost:5000
```

## 📁 Project Structure

```text
Live-Ops-Helpdesk/
│
├── src/
│   ├── client/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── app.js
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── models/
│   │   └── Ticket.js
│   │
│   ├── routes/
│   │   └── ticketRoutes.js
│   │
│   ├── services/
│   │   └── socketService.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   └── ticket.test.js
│
├── screenshots/
│   ├── dashboard.png
│   ├── ticket-locked.png
│   └── collaboration.png
│
├── PROMPTS.md
├── eslint.config.js
├── package.json
└── README.md
```

## 🎯 Project Objective

**Live Ops Helpdesk** was developed for a logistics support environment where multiple agents need to work on customer tickets simultaneously.

The main objective is to eliminate the **last-write-wins race condition** by introducing real-time ticket locking and automatic lock recovery when an agent disconnects.

## 👩‍💻 Developer

**Sakshi Gupta**


**Project:** Live Ops Helpdesk
**Track:** Fullstack Engineer — Node.js / Express / Socket.io
