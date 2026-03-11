# Apartment Service Request Tracking System

A full-stack complaint management system designed for residential-scale deployment, featuring a modern React frontend and a robust Express/MongoDB backend.

## 🚀 Quick Links

- **Backend (Railway ready):** [campus-service-backend](file:///campus-service-backend)
- **Frontend (Vercel ready):** [campus-frontend](file:///campus-frontend)
- **Full System Summary:** [SYSTEM_SUMMARY.md](file:///SYSTEM_SUMMARY.md)

---

## 🛠 Deployment Guide

### 1. Backend: Deploy to Railway

The backend is configured to run from the repository root using the existing `package.json`.

1. **Create a Railway Project** from this GitHub repository.
2. **Environment Variables:** Set the following in Railway:
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string for signing tokens.
   - `CORS_ORIGINS`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`).
   - `PORT`: Railway will provide this (usually 5000).
3. **Wait for Build:** Railway will automatically detect the root `package.json`, install sub-dependencies via `postinstall`, and start the backend.

### 2. Frontend: Deploy to Vercel

The frontend uses Vite and is configured for Vercel deployment with a proxy for API calls.

1. **Import the repository** into Vercel.
2. **Set Root Directory:** Choose `campus-frontend`.
3. **Environment Variables:**
   - `API_ORIGIN`: Your Railway backend URL (e.g., `https://your-backend.up.railway.app`).
4. **Deploy:** Vercel will build the React app and use the serverless function in `campus-frontend/api/[...path].js` to proxy `/api/*` requests to Railway.

---

## ⚙️ Local Development

```bash
# Terminal 1: Backend
cd campus-service-backend
npm install
npm run dev

# Terminal 2: Frontend
cd campus-frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the app.

---

## 🛡 Features & Security

- **RBAC:** Roles for Students, Staff, and Admins.
- **Security Hardening:** Helmet, rate limiting, and NoSQL/XSS protection.
- **Logging:** Structured logging with Winston and daily rotation.
- **Docker Ready:** Includes `Dockerfile` and `docker-compose.yml`.

For more details, see [SYSTEM_SUMMARY.md](file:///SYSTEM_SUMMARY.md).
