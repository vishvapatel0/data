# Support Portal

A support ticket management system with temporary admin access for support engineers.

## Project Structure

```
support-portal/
├── app/
│   ├── main.go
│   ├── handlers/
│   │   ├── auth.go
│   │   └── tickets.go
│   ├── middleware/
│   │   └── auth.go
│   ├── models/
│   │   └── models.go
│   ├── main_test.go
│   ├── go.mod
│   └── Dockerfile
├── docker-compose.yml
├── LICENSE
├── SECURITY.md
└── metadata.json
```

## Setup Instructions

### Prerequisites

- Go 1.21+
- Docker and Docker Compose (optional)

### Local Development

1. Install dependencies:
```bash
cd app
go mod download
```

2. Run the application:
```bash
go run main.go
```

### Docker

```bash
docker-compose up
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login and get JWT |
| GET | `/tickets` | Get all tickets |
| GET | `/tickets/:id` | Get ticket details |
| PUT | `/tickets/:id/resolve` | Resolve ticket (admin only) |
| GET | `/admin/users` | Get all users (admin only) |
| POST | `/admin/grant-temp-access` | Grant temporary admin access |

## Test Users

| Email | Password | Role | Temp Admin Until |
|-------|----------|------|------------------|
| admin@example.com | admin123 | admin | - |
| user1@example.com | user123 | support | - |
| attacker@example.com | attacker123 | support | expired |

## Running Tests

```bash
cd app
go test -v ./...
```

## Example Requests

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "password": "user123"}'
```

### Get Tickets
```bash
curl http://localhost:8080/tickets \
  -H "Authorization: Bearer <token>"
```

### Resolve Ticket (Admin only)
```bash
curl -X PUT http://localhost:8080/tickets/1/resolve \
  -H "Authorization: Bearer <token>"
```

## License

MIT License - See LICENSE file
