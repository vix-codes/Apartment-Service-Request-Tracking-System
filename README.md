URL Shortener Service

A scalable service that converts long URLs into short, shareable links similar to Bitly or TinyURL.

Example

https://google.com/search?q=ai
↓
vix.ly/aZ91K
Features

Short URL generation

Fast redirection

Custom aliases

URL expiration

Click analytics

Duplicate URL prevention

Rate limiting support

System Architecture
Client
  ↓
Load Balancer
  ↓
API Server (Spring Boot)
  ↓
Cache Layer (Redis)
  ↓
Database (PostgreSQL)
Request Flow
URL Shortening

User submits long URL

Server generates a unique short ID

Mapping stored in database

Short URL returned to user

User → API → DB → Response
URL Redirect

User accesses short URL

Server checks Redis cache

If found → redirect

Otherwise fetch from database

Cache result and redirect

User → API → Redis → DB → Redirect
Tech Stack
Backend

Java

Spring Boot

Database

PostgreSQL

Cache

Redis

Deployment

Docker

AWS

API Endpoints
Create Short URL
POST /shorten

Request

{
  "url": "https://google.com/search?q=ai"
}

Response

{
  "shortUrl": "vix.ly/aZ91K"
}
Redirect
GET /{shortCode}

Example

GET vix.ly/aZ91K

Response

302 Redirect → https://google.com/search?q=ai
Create Custom Alias
POST /shorten

Request

{
  "url": "https://google.com",
  "alias": "google"
}

Response

vix.ly/google
Database Schema
urls
Column	Type	Description
id	BIGINT	Primary key
short_code	VARCHAR	Unique short ID
long_url	TEXT	Original URL
created_at	TIMESTAMP	Creation time
expires_at	TIMESTAMP	Expiration time
click_count	BIGINT	Number of clicks

Index

INDEX(short_code)
Short URL Generation

Short IDs are generated using Base62 encoding.

Character set

a-z
A-Z
0-9

Example

125 → cb
124351 → aZ91K

This ensures:

compact URLs

high uniqueness

human-readable links

Caching Strategy

Redis stores frequently accessed links.

Example

Key: short_code
Value: long_url

Benefits

reduces database load

faster redirects

improves scalability

Analytics

Click events tracked for each redirect.

Metrics include

total clicks

device type

location

timestamp

Analytics pipeline

Redirect Service
     ↓
Event Queue
     ↓
Analytics Worker
     ↓
Analytics Database
Scaling Strategy
Horizontal Scaling

Multiple API servers behind a load balancer.

Database Scaling

read replicas

indexing

CDN

Global caching for redirect endpoints.

Security

URL validation

malicious URL filtering

rate limiting

HTTPS support

Deployment

Run with Docker.

docker build -t url-shortener .
docker run -p 8080:8080 url-shortener
Future Improvements

QR code generation

link preview

analytics dashboard

geo-based routing

custom domains

Example
Input
https://google.com/search?q=ai

Output
vix.ly/aZ91K
License

MIT License
