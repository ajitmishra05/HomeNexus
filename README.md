# HomeNexus - Society Management Platform

HomeNexus is a comprehensive, production-ready platform designed to bridge the gap between residents and service providers within a community or society. It offers a seamless interface for booking services, real-time communication, and an intelligent ranking system.

## 🚀 Key Features

### 1. Bayesian Priority Ranking Algorithm
To prevent fake reviews and rating manipulation, HomeNexus implements a mathematical Bayesian Priority Score for all Service Providers.
* **Global Average (C)**: Continuously calculated across all providers in the database.
* **Confidence Threshold (m)**: Set to 50 votes. Providers with fewer votes are pulled toward the global average, preventing new accounts from artificially inflating to 5 stars with just 1 or 2 fake reviews.
* Providers are dynamically ranked and displayed based on this score, ensuring the highest quality services are surfaced to residents.

### 2. Real-Time Chat Integration (Socket.io)
* Built-in direct messaging between Residents and Providers.
* Real-time notification badges alert users to new messages instantly without requiring a page refresh.
* Context-aware chat rooms isolated to specific booking sessions.

### 3. Admin "God Mode"
* A secure, hidden dashboard exclusively for system administrators.
* **System Health Telemetry**: Live tracking of the Global Average Rating and active provider statistics.
* **User Moderation**: Ability to permanently terminate rogue accounts, automatically cascading the deletion to scrub all associated services and bookings from the system.

### 4. Dynamic Dashboards
* **Resident View**: Browse available services, filter by category in real-time, search by provider name/description, book appointments, and leave ratings for completed jobs.
* **Provider View**: Manage active listings, dynamically edit prices/categories/descriptions, and accept or reject incoming booking requests.

## 🛠️ Technology Stack

* **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Zustand (State Management), Socket.io-client.
* **Backend**: Node.js, Express, MongoDB (Atlas), Mongoose, Socket.io, JSON Web Tokens (JWT), BcryptJS.

## ⚙️ Local Setup

### Prerequisites
* Node.js (v16+)
* MongoDB URI (Atlas or Local)

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```
Run the server:
```bash
npm run dev
```
*(Note: On first startup, the Master Admin account `ajitmishra05@admin.com` / `mishraajit05` will be automatically seeded).*

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the client:
```bash
npm run dev
```

## 🌐 Production Deployment

This project is configured for easy deployment to modern hosting platforms.
* **Frontend**: Recommended deployment via Vercel or Netlify. Set the Root Directory to `frontend` and specify `VITE_API_URL` in the environment variables pointing to your deployed backend.
* **Backend**: Recommended deployment via Render or Railway. Set the Root Directory to `backend` and ensure all `.env` variables (especially `MONGO_URI` and `FRONTEND_URL`) are provided.

---
*Developed as a robust, scalable solution for modern society management.*
