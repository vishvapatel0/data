# College Enrollment API

A secure course enrollment system demonstrating proper authorization patterns.

## Domain

University course enrollment system allowing students to enroll in courses and view their enrollments.

## Project Structure

```
college-enrollment/
├── enrollment/
│   ├── api/
│   │   ├── views.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   └── permissions.py
│   └── tests/
├── config/
│   ├── settings.py
│   └── urls.py
├── manage.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── LICENSE
├── SECURITY.md
├── threat_model.md
└── metadata.json
```

## Setup Instructions

### Prerequisites

- Python 3.11+
- Docker (optional)

### Local Development

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed
python manage.py runserver
```

The API will be available at `http://localhost:8000`

### Docker

```bash
docker-compose up
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/courses` | List available courses |
| GET | `/api/enrollments` | List user's enrollments |
| POST | `/api/enrollments` | Enroll in a course |
| GET | `/api/enrollments/{id}` | Get enrollment details |
| DELETE | `/api/enrollments/{id}` | Drop a course |

## Test Users

| Email | Password | Role | Student ID |
|-------|----------|------|------------|
| admin@example.com | admin123 | admin | - |
| user1@example.com | user123 | student | 1 |
| attacker@example.com | attacker123 | student | 2 |

## Security Features

- JWT authentication with expiration
- Ownership verification on all enrollment endpoints
- Role-based access control (student/admin)
- Input validation and sanitization
- Comprehensive audit logging

## Running Tests

```bash
pytest enrollment/tests/ -v
```

## License

MIT License - See LICENSE file
