# Deployment Guide

This project is configured for a split-deployment architecture:
- **Backend**: Railway (Spring Boot + PostgreSQL + Redis)
- **Frontend**: Vercel (Static HTML/JS)

## Phase 1: Deploy Backend to Railway

1.  Log in to [Railway](https://railway.app/).
2.  Click **New Project** > **Deploy from GitHub repo**.
3.  Connect your repository.
4.  Railway will detect the `Dockerfile` and `railway.json`.
5.  **Provision Databases**:
    - Click **New** > **Database** > **Add PostgreSQL**.
    - Click **New** > **Database** > **Add Redis**.
6.  **Set Environment Variables**:
    Railway will automatically inject `DATABASE_URL` and `REDIS_URL` if you connect the services. However, ensure the following are set in your App service:
    - `SPRING_DATASOURCE_URL`: `${{Postgres.DATABASE_URL}}`
    - `SPRING_DATA_REDIS_HOST`: `${{Redis.REDIS_HOST}}`
    - `SPRING_DATA_REDIS_PORT`: `${{Redis.REDIS_PORT}}`
    - `ALLOWED_ORIGINS`: `*` (Change to your Vercel URL later for security).
    - `SPRING_CACHE_TYPE`: `redis`
7.  Deploy the app.
8.  **Note your Backend URL** (e.g., `https://xxxx.up.railway.app`).

## Phase 2: Update Frontend API URL

1.  Open `frontend/app.js`.
2.  Update the `API_BASE_URL` constant with your actual Railway URL:
    ```javascript
    const API_BASE_URL = 'https://your-app.up.railway.app';
    ```

## Phase 3: Deploy Frontend to Vercel

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New** > **Project**.
3.  Import the same GitHub repository.
4.  In the **Build and Output Settings**:
    - **Root Directory**: Select `frontend`.
5.  Deploy!

## Architecture Details

- **Spring Boot**: Handles logic, redirects, and analytics.
- **PostgreSQL**: Stores persistent URL mappings.
- **Redis**: Caching and rate limiting.
- **CORS**: Enabled to allow Vercel requests.
