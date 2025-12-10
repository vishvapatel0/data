# IoT Dashboard API

A secure IoT device management dashboard demonstrating proper authorization patterns.

## Domain

IoT platform allowing users to manage their connected devices, view sensor data, and control device settings.

## Project Structure

```
iot-dashboard/
├── src/
│   ├── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── devices.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── deviceOwner.js
│   └── models/
│       └── database.js
├── tests/
│   └── devices.test.js
├── package.json
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
| POST | `/auth/login` | Login and get JWT |
| GET | `/devices` | List user's devices |
| GET | `/devices/:id` | Get device details |
| PUT | `/devices/:id` | Update device settings |
| GET | `/devices/:id/data` | Get sensor data |
| POST | `/devices/:id/command` | Send command to device |

## Test Users

| Email | Password | Role | User ID |
|-------|----------|------|---------|
| admin@example.com | admin123 | admin | 1 |
| user1@example.com | user123 | user | 2 |
| attacker@example.com | attacker123 | user | 3 |

## Security Features

- JWT authentication with middleware
- Device ownership verification
- Role-based access control
- Input validation
- Centralized authorization middleware

## Running Tests

```bash
npm test
```

## License

MIT License - See LICENSE file
