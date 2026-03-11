# Deployment Guide

**Backend**: Railway (Spring Boot + PostgreSQL)  
**Frontend**: Vercel (Static HTML/JS)

## Phase 1: Backend on Railway

Railway auto-detects your `Dockerfile`. Set these **Environment Variables** in Railway:

| Variable | Value |
| :--- | :--- |
| `PORT` | `8080` |
| `SPRING_DATASOURCE_URL` | `${{Postgres.DATABASE_URL}}` |
| `SPRING_DATASOURCE_DRIVER_CLASS_NAME` | `org.postgresql.Driver` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |
| `SPRING_CACHE_TYPE` | `simple` |
| `APP_BASE_URL` | `https://url-shortener-production-d2f5.up.railway.app` |
| `ALLOWED_ORIGINS` | `https://vixurlshort.vercel.app` |

> Add a **PostgreSQL** plugin in Railway and link it to your service.

## Phase 2: Frontend on Vercel

1. Import the same GitHub repo on Vercel.
2. Set **Root Directory** to `frontend`.
3. Deploy!
