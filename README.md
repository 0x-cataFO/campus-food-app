# CampusKlub 🍔

> **Cut the queue. Order smarter.**

A full-stack campus food ordering platform connecting students with vendors — built with Next.js, Prisma, PostgreSQL, and Auth.js.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Overview

CampusKlub lets students order food from their phones while vendors manage their entire business digitally — no more long queues, no more missed orders.

---

## Features

### 🔐 Authentication & Roles
- Google OAuth via **Auth.js (NextAuth v5)**
- Three role types: `STUDENT`, `VENDOR`, `ADMIN`

### 🏪 Vendor System
- Create and manage a store profile
- Add, edit, and remove menu items
- Toggle store availability in real time
- Process and manage incoming orders

### 🛒 Ordering System
- Students browse vendor menus and place orders
- Full order lifecycle management:

```
PENDING → ACCEPTED → READY → COMPLETED / CANCELLED
```

### 💳 Payments
- Integrated with **Paystack**
- `isPaid` flag for payment state tracking
- Payment method tracking per order

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TailwindCSS, ShadCN UI |
| State Management | Zustand |
| Backend | Next.js API Routes / Server Actions |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | Auth.js (NextAuth v5) + Prisma Adapter |
| Payments | Paystack (`react-paystack`) |

---

## Database Design

**Key Models**

- `User`
- `VendorProfile`
- `FoodItem`
- `Order`
- `OrderItem`

**Relational Structure**

```
User ──────────────► VendorProfile
                          │
                          ▼
                       FoodItem
                          │
Order ◄───────────────────┘
  │
  └──► OrderItem
```

- One `User` → optional `VendorProfile`
- One `Vendor` → many `FoodItem`s
- `Order` linked to both the student (`User`) and the `VendorProfile`

---

## Getting Started

### Prerequisites

- Node.js `>=18`
- PostgreSQL database
- Paystack account
- Google OAuth credentials

### 1. Clone the repository

```bash
git clone https://github.com/0x-cataFO/campus-food-app.git
cd campus-food-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Auth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_public_key
PAYSTACK_SECRET_KEY=your_secret_key
```

### 4. Push the database schema

```bash
npx prisma db push
```

### 5. Start the development server

```bash
npm run dev
```

The app will be running at `http://localhost:3000`.

---

## Roles & Permissions

| Role | Capabilities |
|---|---|
| `STUDENT` | Browse food items, place and track orders |
| `VENDOR` | Manage store profile, menu items, and orders |
| `ADMIN` | Full system control *(future scope)* |

---

## Order Flow

```
1. Student places order
        ↓
2. Vendor accepts order
        ↓
3. Vendor prepares food
        ↓
4. Order marked as READY
        ↓
5. Order COMPLETED after delivery
```

---

## Roadmap

- [ ] Real-time order tracking via WebSockets
- [ ] Push notifications
- [ ] Vendor analytics dashboard
- [ ] Delivery agent system
- [ ] Wallet system / crypto payments

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

```bash
# 1. Fork the project
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature"

# 4. Push to the branch
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

---

## License

Distributed under the [MIT License](LICENSE).

---

## Author

**Osbert Mac-hetz (DeFiLoper)**

- GitHub: [@0x-cataFO](https://github.com/0x-cataFO)

---

> If you find this project useful, give it a ⭐ — it helps more than you think.