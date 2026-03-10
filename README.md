# URL Shortener Service

A scalable service that converts long URLs into short, shareable links similar to Bitly or TinyURL.

Example:

```
https://google.com/search?q=ai
↓
vix.ly/aZ91K
```

---

# Features

* Short URL generation
* Fast redirection
* Custom aliases
* URL expiration
* Click analytics
* Duplicate URL prevention
* Rate limiting support

---

# System Architecture

```
Client
  ↓
Load Balancer
  ↓
API Server (Spring Boot)
  ↓
Cache Layer (Redis)
  ↓
Database (PostgreSQL)
```

---

# Request Flow

## URL Shortening

1. User submits long URL
2. Server generates a unique short ID
3. Mapping stored in database
4. Short URL returned to user

```
User → API → DB → Response
```

---

## URL Redirect

1. User accesses short URL
2. Server checks Redis cache
3. If found → redirect
4. Otherwise fetch from database
5. Cache result and redirect

```
User → API → Redis → DB → Redirect
```

---

# Tech Stack

## Backend

* Java
* Spring Boot

## Database

* PostgreSQL

## Cache

* Redis

## Deployment

* Docker
* AWS

---

# API Endpoints

## Create Short URL

```
POST /shorten
```

Request

```json
{
  "url": "https://google.com/search?q=ai"
}
```

Response

```json
{
  "shortUrl": "vix.ly/aZ91K"
}
```

---

## Redirect

```
GET /{shortCode}
```

Example

```
GET vix.ly/aZ91K
```

Response

```
302 Redirect → https://google.com/search?q=ai
```

---

## Create Custom Alias

```
POST /shorten
```

Request

```json
{
  "url": "https://google.com",
  "alias": "google"
}
```

Response

```
vix.ly/google
```

---

# Database Schema

## urls

| Column      | Type      | Description      |
| ----------- | --------- | ---------------- |
| id          | BIGINT    | Primary key      |
| short_code  | VARCHAR   | Unique short ID  |
| long_url    | TEXT      | Original URL     |
| created_at  | TIMESTAMP | Creation time    |
| expires_at  | TIMESTAMP | Expiration time  |
| click_count | BIGINT    | Number of clicks |

Index

```
INDEX(short_code)
```

---

# Short URL Generation

Short IDs are generated using Base62 encoding.

Character set

```
a-z
A-Z
0-9
```

Example

```
125 → cb
124351 → aZ91K
```

Benefits

* Compact URLs
* High uniqueness
* Human-readable links

---

# Caching Strategy

Redis stores frequently accessed links.

Example

```
Key: short_code
Value: long_url
```

Benefits

* Reduces database load
* Faster redirects
* Improves scalability

---

# Analytics

Click events tracked for each redirect.

Metrics include

* Total clicks
* Device type
* Location
* Timestamp

Analytics pipeline

```
Redirect Service
     ↓
Event Queue
     ↓
Analytics Worker
     ↓
Analytics Database
```

---

# Scaling Strategy

## Horizontal Scaling

Multiple API servers behind a load balancer.

## Database Scaling

* Read replicas
* Indexing

## CDN

Global caching for redirect endpoints.

---

# Security

* URL validation
* Malicious URL filtering
* Rate limiting
* HTTPS support

---

# Deployment

Run using Docker

```
docker build -t url-shortener .
docker run -p 8080:8080 url-shortener
```

---

# Future Improvements

* QR code generation
* Link preview
* Analytics dashboard
* Geo-based routing
* Custom domains

---

# Example

```
Input
https://google.com/search?q=ai

Output
vix.ly/aZ91K
```

---

# License

MIT License
