# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

This is a demonstration repository showcasing secure authorization patterns.

## Security Features Implemented

### Authentication

- JWT tokens with 1-hour expiration
- Secure password hashing with bcrypt
- Token refresh mechanism
- Session invalidation on logout

### Authorization

- Ownership verification on all enrollment endpoints
- Role-based access control (student/admin)
- Centralized permission classes
- Least privilege principle

### Data Protection

- Input validation using Django serializers
- SQL injection prevention via ORM
- CSRF protection enabled
- Secure headers configured

### Audit & Monitoring

- All enrollment operations logged
- Failed access attempts recorded
- Admin actions tracked

## Contact

For security concerns, please open an issue.
