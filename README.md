# Authorization Security Demonstration Repository

A collection of 8 standalone, runnable codebases demonstrating authorization (broken access control) patterns. This repository is designed for security education, training, and benchmarking.

## Overview

| Project | Type | Language/Framework | Domain | CWE |
|---------|------|-------------------|--------|-----|
| [finwallet-idor](./finwallet-idor) | Example | Python/FastAPI | Fintech Wallet | CWE-639 |
| [healthcare-records](./healthcare-records) | Example | Node.js/Express | Healthcare EHR | CWE-639 |
| [hr-portal](./hr-portal) | Example | Java/Spring Boot | HR Management | CWE-639 |
| [cloud-storage](./cloud-storage) | Example | Go/Gin | Cloud Storage | CWE-639 |
| [event-tickets](./event-tickets) | Example | PHP/Laravel | Event Ticketing | CWE-639 |
| [college-enrollment](./college-enrollment) | Secure | Python/Django | Education | N/A |
| [rideshare-api](./rideshare-api) | Secure | TypeScript/NestJS | Ride-sharing | N/A |
| [iot-dashboard](./iot-dashboard) | Secure | Node.js/Express | IoT/Smart Home | N/A |

## Example Projects

Each example project is a realistic, standalone API:
- Complete source code with JWT authentication
- Docker support for easy deployment
- Unit and integration tests
- CI/CD configuration

### IDOR Pattern: CWE-639

All example projects demonstrate Insecure Direct Object Reference (IDOR):
- API endpoints accept resource IDs
- Authenticated users make requests to the API
- Resource access patterns for testing

## Secure Projects

Each secure project demonstrates proper authorization patterns:
- `threat_model.md` - Security analysis and threat vectors
- Centralized authorization middleware/guards
- Role-based access control (RBAC)
- Comprehensive test coverage for authorization

## Fixed Implementations

Fixed versions and security documentation are available in:
- [`all_example_fixed/`](./all_example_fixed) - Contains fixed implementations, vulnerability reports, and grading scripts

## Test Users

All projects use the same test credentials:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | Admin |
| user1@example.com | user123 | Regular User |
| attacker@example.com | attacker123 | Regular User |

## Quick Start

Each project can be run locally or with Docker:

```bash
# Local development
cd <project>/vulnerable
# Follow README for language-specific setup

# Docker
cd <project>
docker-compose up
```

## Running Tests

```bash
# Python projects
pytest tests/ -v

# Node.js projects
npm test

# Java projects
mvn test

# Go projects
go test ./... -v
```

## License

MIT License - See individual project LICENSE files