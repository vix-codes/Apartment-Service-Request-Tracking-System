# URL Shortener Service

Spring Boot implementation of a scalable URL shortener with:
- Short URL generation using Base62
- Redirect endpoint with cache-backed lookup
- Custom aliases
- Expiration support
- Click analytics
- Duplicate URL prevention (same non-expiring long URL reuses code)
- Basic rate limiting (per-IP, per-minute)

## Tech stack
- Java 17 + Spring Boot 3
- PostgreSQL (docker profile)
- Redis (docker profile cache)
- H2 (default local profile for quick run/tests)
- Docker / Docker Compose

## API
### Create short URL
`POST /shorten`

Request:
```json
{
  "url": "https://google.com/search?q=ai",
  "alias": "optional-custom-code",
  "expiresAt": "2027-01-01T00:00:00Z"
}
```

Response:
```json
{
  "shortUrl": "http://localhost:8080/aZ91K",
  "shortCode": "aZ91K",
  "longUrl": "https://google.com/search?q=ai"
}
```

### Redirect
`GET /{shortCode}`

Response: `302 Found` with `Location` header.

### Analytics
`GET /analytics/{shortCode}`

Response includes `clickCount`, `createdAt`, `expiresAt`, and `longUrl`.

## Run locally
```bash
mvn spring-boot:run
```

## Run with Docker (Postgres + Redis)
```bash
docker compose up --build
```

## Run tests
```bash
mvn test
```


## Deploy on Render
1. Push this repository to GitHub.
2. In Render, create a new Blueprint and select this repo.
3. Render will use `render.yaml` to provision:
   - Web service (Docker)
   - PostgreSQL database
   - Redis instance
4. Update `APP_BASE_URL` in Render if your service URL differs from the default placeholder.

## Deploy on Vercel
This repository includes `vercel.json` configured for Docker-based deployment using `@vercel/docker`.

1. Import the repository in Vercel.
2. Add environment variables in the Vercel project settings:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `SPRING_JPA_HIBERNATE_DDL_AUTO=update`
   - `SPRING_CACHE_TYPE=redis`
   - `SPRING_DATA_REDIS_HOST`
   - `SPRING_DATA_REDIS_PORT`
   - `APP_BASE_URL` (your Vercel domain)
3. Deploy.

## Runtime environment variables
The app now supports deploy-friendly environment overrides:
- `PORT`
- `APP_BASE_URL`
- `SPRING_DATASOURCE_*`
- `SPRING_CACHE_TYPE`
- `SPRING_DATA_REDIS_HOST`
- `SPRING_DATA_REDIS_PORT`
