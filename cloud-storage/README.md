# Cloud Storage API

A cloud file storage service allowing users to upload, download, and manage their files.

## Project Structure

```
cloud-storage/
├── vulnerable/
│   ├── main.go
│   ├── handlers/
│   ├── middleware/
│   ├── models/
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
- Docker (optional)

### Local Development

```bash
cd vulnerable
go mod download
go run main.go
```

The API will be available at `http://localhost:8080`

### Docker

```bash
docker-compose up
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login and get JWT |
| GET | `/files` | List user's files |
| GET | `/files/:id` | Get file metadata |
| GET | `/files/:id/download` | Download file |
| DELETE | `/files/:id` | Delete file |

## Test Users

| Email | Password | Role | User ID |
|-------|----------|------|---------|
| admin@example.com | admin123 | admin | 1 |
| user1@example.com | user123 | user | 2 |
| attacker@example.com | attacker123 | user | 3 |

## Running Tests

```bash
cd vulnerable
go test ./... -v
```

## Example Requests

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "password": "user123"}'
```

### Download File
```bash
curl http://localhost:8080/files/1/download \
  -H "Authorization: Bearer <token>"
```

## License

MIT License - See LICENSE file
