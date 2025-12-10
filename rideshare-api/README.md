# Rideshare API

A secure ride-sharing API demonstrating proper authorization patterns.

## Domain

Ride-sharing platform allowing passengers to request rides and drivers to accept and complete them.

## Project Structure

```
rideshare-api/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.guard.ts
│   │   └── jwt.strategy.ts
│   ├── rides/
│   │   ├── rides.controller.ts
│   │   ├── rides.service.ts
│   │   └── rides.entity.ts
│   ├── users/
│   │   └── users.entity.ts
│   ├── common/
│   │   └── guards/
│   ├── app.module.ts
│   └── main.ts
├── test/
│   └── rides.e2e-spec.ts
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
├── LICENSE
├── SECURITY.md
├── threat_model.md
└── metadata.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- Docker (optional)

### Local Development

```bash
npm install
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Docker

```bash
docker-compose up
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login and get JWT |
| POST | `/rides` | Request a new ride |
| GET | `/rides` | List user's rides |
| GET | `/rides/:id` | Get ride details |
| PUT | `/rides/:id/accept` | Driver accepts ride |
| PUT | `/rides/:id/complete` | Complete the ride |

## Test Users

| Email | Password | Role | User ID |
|-------|----------|------|---------|
| admin@example.com | admin123 | admin | 1 |
| user1@example.com | user123 | passenger | 2 |
| attacker@example.com | attacker123 | passenger | 3 |

## Security Features

- JWT authentication with Guards
- Ownership verification on all ride endpoints
- Role-based access (passenger/driver/admin)
- Input validation with class-validator
- Comprehensive authorization guards

## Running Tests

```bash
npm run test:e2e
```

## License

MIT License - See LICENSE file
