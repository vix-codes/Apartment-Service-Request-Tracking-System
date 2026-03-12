# Apartment Service Request Tracking System (URL Shortener Service)

A production-ready **URL shortener platform** with analytics, custom aliases, expiration support, rate limiting, and a polished static frontend.

> Note: The repository name says `Apartment-Service-Request-Tracking-System`, but the current implementation in this repo is a Spring Boot + JavaScript URL shortener service branded as **SwiftLink**.

## What this project does

This application lets users:

- Create short links from long URLs.
- Use optional custom aliases for branded links.
- Set optional expiry dates for links.
- Redirect from short links to original links.
- View click analytics for each short link.
- Access a modern frontend UI for shortening links and checking analytics.

## Architecture

### Backend
- **Java 17 + Spring Boot 3**
- REST API for shortening, redirecting, and analytics
- Persistence via JPA (H2 by default, PostgreSQL in production)
- In-memory caching for faster short-code lookups
- Request rate limiting interceptor

### Frontend
- Static HTML/CSS/JavaScript app (`frontend/`)
- Calls backend API for shorten and analytics workflows
- Copy-to-clipboard UX and status feedback

## API Endpoints

### `POST /shorten`
Creates a new short URL.

**Request body**
```json
{
  "url": "https://example.com/some/very/long/path",
  "alias": "my-custom-code",
  "expiresAt": "2027-01-01T00:00:00Z"
}
```

- `url` (required): must be a valid `http`/`https` URL.
- `alias` (optional): custom short code.
- `expiresAt` (optional): ISO-8601 timestamp in the future.

### `GET /{shortCode}`
Redirects to the original URL using HTTP `302 Found`.

### `GET /analytics/{shortCode}`
Returns analytics (click count, creation time, expiry, and original URL).

### `GET /health-check`
Basic service health endpoint.

## Local development

### Prerequisites
- Java 17+
- Maven 3.9+
- (Optional) Docker + Docker Compose

### Run backend directly
```bash
mvn spring-boot:run
```

Backend starts at: `http://localhost:8080`

### Run tests
```bash
mvn test
```

### Run with Docker Compose
```bash
docker compose up --build
```

This starts:
- App on `8080`
- PostgreSQL on `5432`
- Redis on `6379`

## Configuration

Key environment variables:

- `PORT` (default `8080`)
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_DRIVER_CLASS_NAME`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_JPA_HIBERNATE_DDL_AUTO`
- `SPRING_CACHE_TYPE`
- `APP_BASE_URL`
- `ALLOWED_ORIGINS`

See `src/main/resources/application.yml` and `DEPLOYMENT.md` for deployment-oriented defaults.

## Deployment

A two-part deployment setup is already documented:
- **Backend** on Railway
- **Frontend** on Vercel

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for step-by-step deployment notes.

## License

This project is licensed under the **MIT License**.

- Full license text: [`LICENSE`](LICENSE)
- Human-friendly license guide: [`docs/MIT.md`](docs/MIT.md)
