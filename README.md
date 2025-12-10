# Authorization Security Demonstration Repository

A collection of 8 standalone, runnable codebases demonstrating authorization (broken access control) vulnerabilities and their fixes. This repository is designed for security education, training, and benchmarking.

## Overview

| Project | Type | Language/Framework | Domain | CWE |
|---------|------|-------------------|--------|-----|
| [finwallet-idor](./finwallet-idor) | Vulnerable | Python/FastAPI | Fintech Wallet | CWE-639 |
| [healthcare-records](./healthcare-records) | Vulnerable | Node.js/Express | Healthcare EHR | CWE-639 |
| [hr-portal](./hr-portal) | Vulnerable | Java/Spring Boot | HR Management | CWE-639 |
| [cloud-storage](./cloud-storage) | Vulnerable | Go/Gin | Cloud Storage | CWE-639 |
| [event-tickets](./event-tickets) | Vulnerable | PHP/Laravel | Event Ticketing | CWE-639 |
| [college-enrollment](./college-enrollment) | Secure | Python/Django | Education | N/A |
| [rideshare-api](./rideshare-api) | Secure | TypeScript/NestJS | Ride-sharing | N/A |
| [iot-dashboard](./iot-dashboard) | Secure | Node.js/Express | IoT/Smart Home | N/A |

## Vulnerable Projects

Each vulnerable project contains:
- `vulnerable/` - Initial implementation with authorization flaws
- `fixed/` - Patched version with proper authorization
- `vulnerability_report.md` - Detailed vulnerability analysis
- `grading_script.py|.js|.sh` - Automated exploit verification

### Vulnerability Type: IDOR (Insecure Direct Object Reference)

All vulnerable projects demonstrate CWE-639 - Authorization Bypass Through User-Controlled Key:
- API endpoints accept resource IDs without ownership verification
- Authenticated users can access other users' resources
- Fix involves adding ownership/permission checks

## Secure Projects

Each secure project demonstrates proper authorization patterns:
- `threat_model.md` - Security analysis and threat vectors
- Centralized authorization middleware/guards
- Role-based access control (RBAC)
- Comprehensive test coverage for authorization

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
cd <project>/<version>
# Follow README for language-specific setup

# Docker
cd <project>
docker-compose up vulnerable  # or fixed
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

## Security Checks

Each project includes a grading script to verify exploitability:

```bash
# Start the vulnerable version, then run:
./grading_script.sh  # or .py/.js
```

## License

MIT License - See individual project LICENSE files