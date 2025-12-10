# SaaS Document Management

A multi-tenant SaaS document management platform for organizations to store and share documents.

## Project Structure

```
saas-documents/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── jwt.strategy.ts
│   ├── documents/
│   │   ├── documents.controller.ts
│   │   ├── documents.service.ts
│   │   └── documents.entity.ts
│   ├── users/
│   │   └── users.entity.ts
│   └── common/
│       └── guards/
│           └── tenant.guard.ts
├── test/
│   ├── jest-e2e.json
│   └── documents.e2e-spec.ts
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
├── LICENSE
├── SECURITY.md
└── metadata.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- Docker and Docker Compose (optional)

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the application:
```bash
npm run start:dev
```

### Docker

```bash
docker-compose up
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login and get JWT |
| GET | `/documents` | Get tenant documents |
| GET | `/documents/:id` | Get document details |
| POST | `/documents` | Create new document |
| DELETE | `/documents/:id` | Delete document |

## Test Users

| Email | Password | Tenant ID | Role |
|-------|----------|-----------|------|
| admin@example.com | admin123 | tenant-001 | admin |
| user1@example.com | user123 | tenant-001 | user |
| attacker@example.com | attacker123 | tenant-002 | user |

## Running Tests

```bash
npm run test:e2e
```

## Example Requests

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "password": "user123"}'
```

### Get Documents
```bash
curl http://localhost:3000/documents \
  -H "Authorization: Bearer <token>"
```

### Get Document by ID
```bash
curl http://localhost:3000/documents/1 \
  -H "Authorization: Bearer <token>"
```

## License

MIT License - See LICENSE file
