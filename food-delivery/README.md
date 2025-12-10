# Food Delivery API

A food delivery platform API for managing orders, restaurants, and deliveries.

## Project Structure

```
food-delivery/
├── app/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   └── OrderController.php
│   │   │   └── Middleware/
│   │   │       └── JwtAuthenticate.php
│   │   └── Models/
│   │       └── Models.php
│   ├── database/
│   │   └── seeders/
│   │       └── DatabaseSeeder.php
│   ├── routes/
│   │   └── api.php
│   ├── tests/
│   │   └── Feature/
│   │       └── OrderTest.php
│   ├── composer.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── LICENSE
├── SECURITY.md
└── metadata.json
```

## Setup Instructions

### Prerequisites

- PHP 8.2+
- Composer
- Docker and Docker Compose (optional)

### Local Development

1. Install dependencies:
```bash
cd app
composer install
```

2. Copy environment file:
```bash
cp .env.example .env
php artisan key:generate
```

3. Run migrations and seed:
```bash
php artisan migrate --seed
```

4. Run the application:
```bash
php artisan serve
```

### Docker

```bash
docker-compose up
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/{id}` | Get order details |
| POST | `/api/orders` | Create new order |
| DELETE | `/api/orders/{id}/cancel` | Cancel order |

## Test Users

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | admin |
| user1@example.com | user123 | customer |
| attacker@example.com | attacker123 | customer |

## Running Tests

```bash
cd app
php artisan test
```

## Example Requests

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "password": "user123"}'
```

### Get Orders
```bash
curl http://localhost:8000/api/orders \
  -H "Authorization: Bearer <token>"
```

### Cancel Order
```bash
curl -X DELETE http://localhost:8000/api/orders/1/cancel \
  -H "Authorization: Bearer <token>"
```

## License

MIT License - See LICENSE file
