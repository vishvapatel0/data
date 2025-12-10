# FinWallet API

A fintech wallet API allowing users to manage their financial accounts, view balances, and transfer funds.

## Project Structure

```
finwallet-idor/
├── vulnerable/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── database.py
│   │   ├── auth.py
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── users.py
│   │       └── wallets.py
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   └── test_wallets.py
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
cd vulnerable
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
| GET | `/wallets/{wallet_id}` | Get wallet details |
| GET | `/wallets/{wallet_id}/transactions` | Get wallet transactions |
| POST | `/wallets/{wallet_id}/transfer` | Transfer funds |

## Test Users

| Email | Password | Role | Wallet ID |
|-------|----------|------|-----------|
| admin@example.com | admin123 | admin | 1 |
| user1@example.com | user123 | user | 2 |
| attacker@example.com | attacker123 | user | 3 |

## Running Tests

```bash
cd vulnerable
pytest tests/ -v
```

## Example Requests

### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "password": "user123"}'
```

### Get Wallet (with token)
```bash
curl http://localhost:8000/wallets/2 \
  -H "Authorization: Bearer <token>"
```

## License

MIT License - See LICENSE file
