# dashboard-websocket

# 📊 Real-Time Dashboard with WebSockets (NestJS + React)

**dashboard-websocket** is a learning-focused demo project that demonstrates how to build a **real-time analytics dashboard** using **NestJS**, **Socket.IO (WebSockets)**, and a **React + Vite** frontend.  
The backend seeds dummy data and continuously pushes updates to connected clients, while the frontend renders live-updating charts and tables.

> ⚠️ This project is **for learning purposes only**. It uses mock data, scheduled updates, and no authentication. It is not production-ready.

---

## ✨ What this project demonstrates

- Using **WebSockets (Socket.IO)** with NestJS  
- Combining **REST APIs + WebSockets** in one application  
- Seeding and mutating **dummy dashboard data**  
- Building **real-time charts and cards** in React  
- Managing live updates without page refreshes  
- Environment configuration with Vite and NestJS  
- Running a dashboard backed by a **local MongoDB database**

---

## 🧠 High-level idea

1. **Backend (NestJS)**
   - Connects to a local MongoDB instance
   - Seeds dummy data on startup (sales, market values, channels)
   - Periodically updates that data using scheduled jobs
   - Pushes updates through a Socket.IO gateway
   - Exposes REST endpoints for initial dashboard state

2. **Frontend (React + Vite)**
   - Fetches initial data using REST APIs
   - Subscribes to WebSocket events
   - Updates charts and dashboard cards in real time

---

## 🗂️ Project structure

```

dashboard-websocket
├── client/        # React + Vite frontend
├── server/        # NestJS backend
├── LICENSE
└── README.md

````

---

## 🚀 Quick start

### Prerequisites

- Node.js **16+**
- npm
- **MongoDB (local instance)**

---

## 🗄️ MongoDB setup (IMPORTANT)

This project uses a **local MongoDB server** to store dashboard data.

### Option 1: MongoDB installed locally

1. Install MongoDB Community Edition  
   👉 https://www.mongodb.com/try/download/community

2. Start MongoDB

```bash
mongod
````

MongoDB will run by default on:

```
mongodb://localhost:27017
```

The app will automatically create and use the database:

```
dashboard
```

---

### Option 2: MongoDB Compass (optional)

You can inspect data using **MongoDB Compass**:

* Connection string:

  ```
  mongodb://localhost:27017
  ```
* Database:

  ```
  dashboard
  ```

Collections will be auto-created:

* `saleshistories`
* `dashboardchannels`
* `dashboardmarkets`

---

## 📦 Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

---

## 🔐 Environment variables

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000/dashboard
```

Copy from:

```bash
client/.env.example
```

---

### Server (`server/.env`)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/dashboard
CLIENT_URL=http://localhost:5173
```

Copy from:

```bash
server/env.example
```

---

## ▶️ Run the application (two terminals)

### Terminal 1 – Backend

```bash
cd server
npm run start:dev
```

You should see logs like:

* MongoDB connected
* Dummy data seeded
* WebSocket events being pushed

---

### Terminal 2 – Frontend

```bash
cd client
npm run dev
```

---

## 🌐 Open the app

```
http://localhost:5173
```

You should see a dashboard with **live-updating charts and metrics** powered by MongoDB + WebSockets.

---

## 🔌 WebSocket behavior

* **Namespace:** `/dashboard`
* **Events pushed from backend:**

  * `sales:update`
  * `sales:monthly`
  * `market:update`
  * `channels:update`

### Example backend emit

```ts
this.server.emit('channels:update', payload);
```

### Example frontend listener

```js
socket.on('channels:update', data => {
  setRows(data);
});
```

> REST APIs are used for **initial state only**.
> All real-time changes come from WebSockets.

---

## 📊 Data behavior (important)

* Sales data is seeded for **multiple years**
* Monthly values are generated continuously
* Charts compare:

  * Last 12 months (this year)
  * Previous 12 months (last year)
* Totals are calculated from the **latest 12 months**
* MongoDB stores **all historical data**, not just what is shown

---

## 🧪 Backend modules overview

| Module    | Purpose                      |
| --------- | ---------------------------- |
| dashboard | WebSocket gateway            |
| sales     | Monthly sales & totals       |
| market    | Market values                |
| channels  | Traffic & conversion metrics |

---

## 🎯 Who is this for?

* Developers learning **NestJS WebSockets**
* Developers learning **real-time dashboards**
* React developers exploring **Socket.IO**
* Anyone wanting a **clean, understandable demo** project

---

## 🚧 What this project is NOT

* ❌ Production-ready
* ❌ Secure (no authentication)
* ❌ Using real business data

These limitations are **intentional** for learning clarity.

---

## 📜 License

MIT License – free to use, modify, and learn from.

```
```
