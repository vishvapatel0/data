# Event Tickets API

An event ticketing platform allowing users to purchase, view, and transfer tickets for events.

## Project Structure

```
event-tickets/
├── vulnerable/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Middleware/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   ├── tests/
│   ├── composer.json
│   └── Dockerfile
├── docker-compose.yml
├── LICENSE
├── SECURITY.md
└── metadata.json
```

## Setup Instructions

### Prerequisites

- PHP 8.2+
- Composer
- Docker (optional)

### Local Development

```bash
cd vulnerable
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

The API will be available at `http://localhost:8000`

### Docker

```bash
docker-compose up
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/tickets` | List user's tickets |
| GET | `/api/tickets/{id}` | Get ticket details |
| POST | `/api/tickets/{id}/transfer` | Transfer ticket |
| POST | `/api/tickets/{id}/upgrade` | Upgrade ticket |

## Test Users

| Email | Password | Role | User ID |
|-------|----------|------|---------|
| admin@example.com | admin123 | admin | 1 |
| user1@example.com | user123 | user | 2 |
| attacker@example.com | attacker123 | user | 3 |

## Running Tests

```bash
cd vulnerable
php artisan test
```

## Example Requests

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "password": "user123"}'
```

### Get Ticket
```bash
curl http://localhost:8000/api/tickets/1 \
  -H "Authorization: Bearer <token>"
```

## License

MIT License - See LICENSE file
