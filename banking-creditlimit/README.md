# Banking Credit Limit API

A banking mobile app API for managing customer accounts, credit limits, and financial services.

## Project Structure

```
banking-creditlimit/
├── app/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── database.py
│   │   ├── auth.py
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── users.py
│   │       └── credit.py
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   └── test_credit.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── LICENSE
├── SECURITY.md
└── metadata.json
```

## Setup Instructions

### Prerequisites

- Python 3.9+
- Docker and Docker Compose (optional)

### Local Development

1. Create virtual environment:
```bash
cd app
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Run the application:
```bash
uvicorn app.main:app --reload --port 8000
```

### Docker

```bash
docker-compose up
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT |
| GET | `/users/me` | Get current user profile |
| GET | `/credit/limit` | Get current credit limit |
| POST | `/credit/increase` | Request credit limit increase |
| GET | `/credit/history` | Get credit limit change history |

## Test Users

| Email | Password | Role | Credit Limit |
|-------|----------|------|--------------|
| admin@example.com | admin123 | admin | 50000 |
| user1@example.com | user123 | user | 5000 |
| attacker@example.com | attacker123 | user | 2000 |

## Running Tests

```bash
cd app
pytest tests/ -v
```

## Example Requests

### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "password": "user123"}'
```

### Get Credit Limit
```bash
curl http://localhost:8000/credit/limit \
  -H "Authorization: Bearer <token>"
```

### Request Credit Increase
```bash
curl -X POST http://localhost:8000/credit/increase \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"new_limit": 10000}'
```

## License

MIT License - See LICENSE file
