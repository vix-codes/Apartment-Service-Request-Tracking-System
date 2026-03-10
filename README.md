# Apartment Service Request Tracking System

A full-stack web application for managing apartment/campus maintenance complaints end-to-end, with role-based workflows for **tenants**, **technicians**, and **admins/managers**.

## What this system does

The platform tracks service requests across the full lifecycle:

1. Tenant creates a complaint (with title, description, category, optional image).
2. Admin/Manager assigns it to a technician.
3. Technician works the request (`ASSIGNED` → `IN_PROGRESS` → `COMPLETED`) or rejects it with a reason.
4. Admin/Manager closes completed work (`CLOSED`) or reopens as needed.
5. Users receive notifications for assignment/rejection/closure events.
6. Admins/Managers view analytics and audit logs.

## Core capabilities

- **Role-based access control** using JWT (`tenant`, `technician`, `manager`, `admin`).
- **Complaint lifecycle engine** with guarded state transitions.
- **Priority detection** from complaint text (`critical`, `high`, `medium`, `low`).
- **Audit trail** for user and complaint actions.
- **Notification center** with unread/read support.
- **Admin analytics** (status breakdowns, throughput, technician performance).
- **Containerized deployment** with Docker + Compose.

## System design

### Architecture overview

```text
┌──────────────────────┐      HTTPS/JSON      ┌──────────────────────────┐
│ React + Vite Frontend│  ─────────────────▶  │  Express API (/api/*)    │
│ (RBAC dashboards)    │  ◀─────────────────  │  Auth, workflow, analytics│
└──────────┬───────────┘                      └─────────────┬────────────┘
           │                                                │
           │                                                │ Mongoose
           │                                                ▼
           │                                   ┌──────────────────────────┐
           └──────────────────────────────────▶│ MongoDB                  │
                                               │ users, requests, logs,   │
                                               │ notifications            │
                                               └──────────────────────────┘
```

### Backend component design

- **API layer**: Express routes under `/api`.
- **Auth & security**:
  - JWT auth middleware on protected endpoints.
  - CORS config.
  - Request logging + centralized error handling.
- **Domain controllers**:
  - `authController`: register/login/user-management endpoints.
  - `complaintController`: create, assign, update status/priority, delete.
  - `analyticsController`: operational dashboard aggregates.
  - `auditController`: action log retrieval.
  - `notificationController`: list + mark-as-read.
- **Persistence models**:
  - `User`, `Complaint` (stored in `requests` collection), `ActionLog`, `Notification`.
- **Utility services**:
  - action logger and notification helpers.

### Frontend component design

- **React Router** with public + protected routes.
- **Auth context** stores token, role, user metadata in localStorage.
- **Role-specific dashboards**:
  - Tenant dashboard
  - Technician dashboard
  - Admin dashboard
- **Reusable UI components** for forms, cards, analytics blocks, notice banners, and notifications.
- **Axios API client** with automatic bearer token attachment and configurable API base URL.

### Data and workflow model

#### Main entities

- **User**: identity, role, profile/status fields.
- **Complaint**: metadata, owner, assignee, status timestamps, priority, optional image.
- **Notification**: user-targeted messages tied to complaint events.
- **ActionLog**: immutable audit records with actor/action/context.

#### Complaint state machine

```text
NEW
 └─(admin/manager assigns)──────────────▶ ASSIGNED
      ├─(technician starts)─────────────▶ IN_PROGRESS
      │    ├─(technician completes)─────▶ COMPLETED
      │    │    └─(admin/manager closes)▶ CLOSED
      │    └─(technician rejects)───────▶ REJECTED
      └─(technician rejects)────────────▶ REJECTED

REJECTED ──(tenant OR admin/manager reopen)──▶ NEW
CLOSED   ──(admin/manager reopen)────────────▶ NEW
```

## Tech stack

- **Frontend**: React 18, React Router, Axios, Vite.
- **Backend**: Node.js, Express, Mongoose, JWT, bcrypt.
- **Database**: MongoDB.
- **DevOps/Deploy**: Docker, Docker Compose, PM2-compatible backend.

## Repository structure

```text
.
├── campus-frontend/            # React app
├── campus-service-backend/     # Express API + Mongo models/controllers
├── docker-compose.yml          # Full-stack local orchestration
├── Dockerfile                  # Root deploy helper (backend entry)
└── README.md                   # This file
```

## API surface (high-level)

Base URL: `/api`

- `POST /auth/register` - Tenant self-signup.
- `POST /auth/login` - Login (returns JWT + role info).
- `GET /auth/technicians` - Technician list (authenticated).
- `GET /auth/all` - All users (admin only).
- `POST /auth/create-user` - Admin creates tenant/technician/manager.

- `GET /complaints` - Role-filtered complaint list.
- `POST /complaints` - Tenant creates complaint.
- `PUT /complaints/assign/:id` - Assign complaint (manager/admin).
- `PUT /complaints/status/:id` - Update complaint status.
- `PUT /complaints/priority/:id` - Update priority (manager/admin).
- `DELETE /complaints/:id` - Delete complaint (admin).

- `GET /audit` and scoped filters - Audit log access.
- `GET /notifications` / `PUT /notifications/:id/read` - Notification APIs.
- `GET /admin/analytics` - Admin/manager analytics.
- `GET /health` - Liveness check.

## Quick start

### Option A: Docker Compose (recommended)

```bash
docker-compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health: `http://localhost:5000/health`
- MongoDB: `mongodb://localhost:27017`

### Option B: Run services manually

#### 1) Backend

```bash
cd campus-service-backend
npm install
npm run dev
```

#### 2) Frontend

```bash
cd campus-frontend
npm install
npm run dev
```

Frontend runs at Vite default URL, usually `http://localhost:5173`.

## Environment configuration

Backend supports any of these Mongo env vars: `MONGO_URI`, `MONGODB_URI`, `MONGO_URL`, `DATABASE_URL`.

Example (`campus-service-backend/.env`):

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/campusdb
JWT_SECRET=change-me
JWT_EXPIRES=1d
CORS_ORIGINS=http://localhost:5173
```

Frontend optional env:

```env
VITE_API_URL=http://localhost:5000
```

If `VITE_API_URL` is unset, frontend uses `/api` and expects a proxy or same-origin API routing.

## Typical user flows

- **Tenant**: register/login → create complaint → track status → receive closure/rejection notifications.
- **Admin/Manager**: login → review queue → assign technician → monitor analytics.
- **Technician**: login → view assigned tasks → start/completed/reject with notes.

## Notes for maintainers

- Existing documentation files in root provide additional deployment and production hardening notes.
- Backend and frontend each have local README files; this root README is intended as the single onboarding entry point for GitHub.
