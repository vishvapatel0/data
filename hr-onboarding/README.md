# HR Onboarding Portal

A corporate HR onboarding system for managing employee registration and role assignments.

## Project Structure

```
hr-onboarding/
├── app/
│   ├── src/main/java/com/demo/hronboarding/
│   │   ├── HrOnboardingApplication.java
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   └── DataInitializer.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   └── EmployeeController.java
│   │   ├── model/
│   │   │   └── Employee.java
│   │   ├── repository/
│   │   │   └── EmployeeRepository.java
│   │   └── security/
│   │       ├── JwtTokenProvider.java
│   │       ├── JwtAuthenticationFilter.java
│   │       └── UserPrincipal.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── src/test/java/com/demo/hronboarding/
│   │   └── EmployeeControllerTest.java
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
- Docker and Docker Compose (optional)

### Local Development

1. Build the application:
```bash
cd app
mvn clean package -DskipTests
```

2. Run the application:
```bash
mvn spring-boot:run
```

### Docker

```bash
docker-compose up
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and get JWT |
| POST | `/api/employees/register` | Register new employee |
| GET | `/api/employees` | Get all employees (admin only) |
| GET | `/api/employees/{id}` | Get employee details |
| PUT | `/api/employees/{id}` | Update employee |

## Test Users

| Email | Password | Role | Department |
|-------|----------|------|------------|
| admin@example.com | admin123 | ADMIN | IT |
| user1@example.com | user123 | EMPLOYEE | Engineering |
| attacker@example.com | attacker123 | EMPLOYEE | Sales |

## Running Tests

```bash
cd app
mvn test
```

## Example Requests

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "password": "user123"}'
```

### Register Employee
```bash
curl -X POST http://localhost:8080/api/employees/register \
  -H "Content-Type: application/json" \
  -d '{"email": "new@example.com", "password": "pass123", "fullName": "New User", "department": "Management"}'
```

## License

MIT License - See LICENSE file
