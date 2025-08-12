# GreenCart Logistics Dashboard

## Overview

GreenCart Logistics Dashboard is a full-stack application designed to manage logistics operations efficiently. It includes features such as driver management, route planning, order tracking, and KPI dashboards.

---

## Features

### Frontend

- **Authentication**: Sign-in and sign-up functionality.
- **Dashboard**: KPI visualization and operational insights.
- **UI Components**: Alerts, badges, buttons, tables, charts, and more.
- **Responsive Design**: Built with Tailwind CSS for seamless user experience across devices.

### Backend

- **Database Models**: Drivers, Routes, Orders, and Simulation Results.
- **API Endpoints**: CRUD operations for drivers, routes, orders, and simulations.
- **Middleware**: Authentication and error handling.
- **Utilities**: KPI calculations and database seeding.

---

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Steps

1. Clone the repository:

```bash
git clone https://github.com/your-repo/free-react-tailwind-admin-dashboard.git
cd free-react-tailwind-admin-dashboard
```

2. Install dependencies for both frontend and backend:

```bash
cd frontend
npm install
cd ../backend
npm install
```

3. Set up environment variables:

- Create .env files in both frontend and backend directories.
- Backend .env example:

```bash
MONGO_URI=mongodb://localhost:27017/greenCartDB
JWT_SECRET=yourSecretKey
```

- Frontend .env example:

```bash
VITE_API_URL=http://localhost:5000
```

4. Start the application:

- backend:

```bash
cd backend
npm start
```

- frontend:

```bash
cd frontend
npm run dev
```

5. Folder Structure

- Frontend:

```bash
frontend/
├── public/
│   ├── images/
│   └── favicon.png
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── icons/
│   ├── layout/
│   ├── pages/
│   ├── services/
│   └── utils/
├── index.html
├── package.json
└── vite.config.ts
```

- backend:

```bash
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── .env
└── package.json
```

6. API Endpoints

- Authentication:

- POST /api/auth/login: User Login
- POST /api/auth/register: User Registration

- Drivers:

- GET /api/drivers: Fetch all drivers
- POST /api/drivers: Add a new driver
- PUT /api/drivers/:id: Update driver details
- DELETE /api/drivers/:id: Remove a driver

- Routes:

- GET /api/routes: Fetch all routes
- POST /api/routes: Add a new route
- PUT /api/routes/:id: Update route details
- DELETE /api/routes/:id: Remove a route

- Orders:

- GET /api/orders: Fetch all orders
- POST /api/orders: Add a new order
- PUT /api/orders/:id: Update order details
- DELETE /api/orders/:id: Remove an order

7. Technologies Used

- Frontend: React, Tailwind CSS, Vite
- Backend: Node.js, Express, MongoDB
- Database: MongoDB
- Authentication: JWT

8. Contact

- For any queries, contact vishal.pinjala@gmail.com.
