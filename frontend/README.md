<div align="center">

# ⚡ SUPPORT-FLOW ⚡
### *Next-Gen Issue Tracking, Service Booking & Dynamic Worker Routing Platform*

<p align="center">
  <img src="https://img.shields.io/badge/STATUS-ACTIVE%20DEPLOYMENT-success?style=for-the-badge&logo=vercel" alt="Status" />
  <img src="https://img.shields.io/badge/STACK-MERN%20(MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node)-cyan?style=for-the-badge&logo=react" alt="Stack" />
  <img src="https://img.shields.io/badge/UI-TAILWIND%20CSS-blueviolet?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/LICENSE-MIT-yellow.svg?style=for-the-badge" alt="License" />
</p>

---

> 🚀 **An enterprise-grade, glassmorphism-themed MERN platform engineered to bridge users, specialized field workers, and administrative oversight seamlessly.**

</div>

---

## 🔥 Core Architectural Highlights

| Module / Layer | Tech & Implementation | Purpose & Capabilities |
| :--- | :--- | :--- |
| **🛡️ Security & RBAC** | JWT, Bcrypt, Custom Middleware | Strict role separation and protected access scopes for **Users, Workers, and Admins**. |
| **🎟️ Ticket Lifecycle** | Node.js, Express REST APIs | Dynamic issue logging, real-time status tracking, assignment routing, and resolution logs. |
| **🎨 Modern UI/UX** | React, Vite, Tailwind CSS | Sleek dark-mode glassmorphic layouts with custom micro-animations and responsive components. |
| **☁️ Infrastructure** | MongoDB Atlas, Vercel | Scalable serverless deployments and cloud database synchronization. |

---

## 📂 Repository Structure

```text
Support-Flow/
├── frontend/             # React (Vite) Single Page Application
│   ├── src/
│   │   ├── components/   # Reusable UI cards, navigation & forms
│   │   ├── pages/        # User, Worker & Admin Dashboards
│   │   └── App.jsx       # Route management & state handling
│   └── package.json
│
└── backend/              # Node.js & Express REST API Server
    ├── models/           # Mongoose Schemas (User, Ticket, Worker)
    ├── routes/           # Modular API endpoints & controllers
    ├── middleware/       # JWT Authentication & error handlers
    └── server.js         # Entry point & DB connection setup
