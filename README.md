# Authorization Security Demonstration Repository

A collection of 14 standalone, runnable codebases demonstrating various authorization (broken access control) patterns. This repository is designed for security education, training, and benchmarking.

## Overview

### Example Projects (11 total)

| Project | Language/Framework | Domain | CWE | Description |
|---------|-------------------|--------|-----|-------------|
| [finwallet-idor](./finwallet-idor) | Python/FastAPI | Fintech Wallet | CWE-639 | IDOR in wallet access |
| [healthcare-records](./healthcare-records) | Node.js/Express | Healthcare EHR | CWE-639 | IDOR in medical records |
| [hr-portal](./hr-portal) | Java/Spring Boot | HR Management | CWE-639 | IDOR in employee data |
| [cloud-storage](./cloud-storage) | Go/Gin | Cloud Storage | CWE-639 | IDOR in file access |
| [event-tickets](./event-tickets) | PHP/Laravel | Event Ticketing | CWE-639 | IDOR in ticket management |
| [banking-creditlimit](./banking-creditlimit) | Python/FastAPI | Banking | CWE-285 | Improper Authorization |
| [hospital-portal](./hospital-portal) | Node.js/Express | Healthcare | CWE-200 | Sensitive Data Exposure |
| [hr-onboarding](./hr-onboarding) | Java/Spring Boot | HR Onboarding | CWE-279 | Incorrect Privilege Assignment |
| [support-portal](./support-portal) | Go/Gin | Support Tickets | CWE-266 | Incorrect Privilege Management |
| [food-delivery](./food-delivery) | PHP/Laravel | Food Delivery | CWE-862 | Missing Authorization |
| [saas-documents](./saas-documents) | TypeScript/NestJS | Multi-tenant SaaS | CWE-863 | Incorrect Authorization |

### Secure Projects (3 total)

| Project | Language/Framework | Domain | Description |
|---------|-------------------|--------|-------------|
| [college-enrollment](./college-enrollment) | Python/Django | Education | Secure course enrollment |
| [rideshare-api](./rideshare-api) | TypeScript/NestJS | Ride-sharing | Secure ride management |
| [iot-dashboard](./iot-dashboard) | Node.js/Express | IoT/Smart Home | Secure device management |

## Vulnerability Types Demonstrated

| CWE | Name | Example Project |
|-----|------|-----------------|
| CWE-639 | Insecure Direct Object Reference | finwallet-idor, healthcare-records, hr-portal, cloud-storage, event-tickets |
| CWE-285 | Improper Authorization | banking-creditlimit |
| CWE-200 | Sensitive Data Exposure | hospital-portal |
| CWE-279 | Incorrect Privilege Assignment | hr-onboarding |
| CWE-266 | Incorrect Privilege Management | support-portal |
| CWE-862 | Missing Authorization | food-delivery |
| CWE-863 | Incorrect Authorization | saas-documents |

## Example Projects

Each example project is a realistic, standalone API:
- Complete source code with JWT authentication
- Docker support for easy deployment
- Unit and integration tests
- CI/CD configuration

### Real-World Scenarios

- **CWE-285 (banking-creditlimit)**: Banking app hides "increase credit limit" button in UI, but backend doesn't verify roles
- **CWE-200 (hospital-portal)**: Hospital staff can view all patient lab results regardless of department
- **CWE-279 (hr-onboarding)**: HR system auto-assigns "manager" role based on department field
- **CWE-266 (support-portal)**: Temporary admin access doesn't expire properly
- **CWE-862 (food-delivery)**: Order cancellation only checks authentication, not ownership
- **CWE-863 (saas-documents)**: Type mismatch in tenant ID comparison allows cross-tenant access

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
cd <project>/app
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