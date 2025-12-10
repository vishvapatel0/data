# Healthcare Records API

An Electronic Health Records (EHR) system allowing healthcare providers and patients to access medical records.

## Project Structure

```
healthcare-records/
├── vulnerable/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── records.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── models/
│   │       └── database.js
│   ├── tests/
│   │   └── records.test.js
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

1. Navigate to project directory:
```bash
cd vulnerable
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Run the application:
```bash
npm start
```

The API will be available at `http://localhost:3000`

### Docker

```bash
docker-compose up
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT |
| GET | `/records` | List all records (filtered by role) |
| GET | `/records/:id` | Get specific medical record |
| PUT | `/records/:id` | Update medical record |
| DELETE | `/records/:id` | Delete medical record |

## Test Users

| Email | Password | Role | Patient ID |
|-------|----------|------|------------|
| admin@example.com | admin123 | admin | - |
| user1@example.com | user123 | patient | 1 |
| attacker@example.com | attacker123 | patient | 2 |

## Running Tests

```bash
cd vulnerable
npm test
```

## Example Requests

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "password": "user123"}'
```

### Get Medical Record
```bash
curl http://localhost:3000/records/1 \
  -H "Authorization: Bearer <token>"
```

## License

MIT License - See LICENSE file
