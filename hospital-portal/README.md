# Hospital Lab Results Portal

A healthcare portal API for managing patient lab results and medical records.

## Project Structure

```
hospital-portal/
├── app/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── results.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── models/
│   │       └── database.js
│   ├── tests/
│   │   └── results.test.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
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
cd app
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Run the application:
```bash
npm start
```

### Docker

```bash
docker-compose up
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login and get JWT |
| GET | `/results` | Get all lab results |
| GET | `/results/:id` | Get specific lab result |
| GET | `/results/patient/:patientId` | Get patient's lab results |

## Test Users

| Email | Password | Role | Department |
|-------|----------|------|------------|
| admin@example.com | admin123 | admin | Administration |
| user1@example.com | user123 | staff | Cardiology |
| attacker@example.com | attacker123 | staff | Reception |

## Running Tests

```bash
cd app
npm test
```

## Example Requests

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "password": "user123"}'
```

### Get Lab Results
```bash
curl http://localhost:3000/results \
  -H "Authorization: Bearer <token>"
```

### Get Patient Results
```bash
curl http://localhost:3000/results/patient/1 \
  -H "Authorization: Bearer <token>"
```

## License

MIT License - See LICENSE file
