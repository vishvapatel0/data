# HR Portal API

A human resources employee management system allowing employees to view their own information and managers to access team data.

## Project Structure

```
hr-portal/
├── vulnerable/
│   ├── src/main/java/com/demo/hrportal/
│   │   ├── HrPortalApplication.java
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── security/
│   │   └── config/
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── src/test/java/
│   ├── pom.xml
│   └── Dockerfile
├── docker-compose.yml
├── LICENSE
├── SECURITY.md
└── metadata.json
```

## Setup Instructions

### Prerequisites

- Java 17+
- Maven 3.8+
- Docker (optional)

### Local Development

```bash
cd vulnerable
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

### Docker

```bash
docker-compose up
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/employees` | List employees |
| GET | `/api/employees/{id}` | Get employee details |
| GET | `/api/employees/{id}/salary` | Get salary information |
| PUT | `/api/employees/{id}` | Update employee |

## Test Users

| Email | Password | Role | Employee ID |
|-------|----------|------|-------------|
| admin@example.com | admin123 | ADMIN | 1 |
| user1@example.com | user123 | EMPLOYEE | 2 |
| attacker@example.com | attacker123 | EMPLOYEE | 3 |

## Running Tests

```bash
cd vulnerable
mvn test
```

## Example Requests

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "password": "user123"}'
```

### Get Employee Salary
```bash
curl http://localhost:8080/api/employees/1/salary \
  -H "Authorization: Bearer <token>"
```

## License

MIT License - See LICENSE file
