# Deployment Guide

This project is configured for a split-deployment architecture:
- **Backend**: Render (Spring Boot + PostgreSQL + Redis)
- **Frontend**: Vercel (Static HTML/JS)

## Phase 1: Deploy Backend to Render

1.  Log in to [Render](https://dashboard.render.com/).
2.  Click **New +** > **Blueprint**.
3.  Connect your GitHub repository.
4.  Render will automatically detect `render.yaml`.
5.  Set the following **Environment Variables** (or use the Blueprint defaults):
    - `SPRING_DATASOURCE_DRIVER_CLASS_NAME`: `org.postgresql.Driver`
    - `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`
    - `SPRING_CACHE_TYPE`: `redis`
    - `ALLOWED_ORIGINS`: `*` (Change to your Vercel URL later for better security)
6.  Deploy the services.
7.  **Note your Backend URL** (e.g., `https://url-shortener-xxxx.onrender.com`).

## Phase 2: Update Frontend API URL

1.  Open `frontend/app.js`.
2.  Update the `API_BASE_URL` constant with your actual Render URL:
    ```javascript
    const API_BASE_URL = 'https://your-app-name.onrender.com';
    ```

## Phase 3: Deploy Frontend to Vercel

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New** > **Project**.
3.  Import the same GitHub repository.
4.  In the **Build and Output Settings**:
    - **Root Directory**: Select `frontend` (Important!).
    - Keep other settings as default.
5.  Deploy!

## Architecture Details

- **Spring Boot**: Handles URL shortening logic, redirects, and analytics.
- **PostgreSQL**: Stores persistent URL mappings.
- **Redis**: Provides high-speed caching for redirects and rate limiting.
- **CORS**: Enabled on the Spring Boot app to allow the Vercel frontend to make requests.
