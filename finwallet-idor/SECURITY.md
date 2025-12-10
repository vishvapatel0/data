# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

This is a demonstration repository for educational purposes.

If you discover security issues in the demonstration code:

1. This repository intentionally contains code patterns for educational analysis
2. The `fixed/` directory contains improved implementations
3. Do not use vulnerable patterns in production applications

## Security Best Practices

### Authorization Controls

- Always verify resource ownership before granting access
- Implement role-based access control (RBAC)
- Use centralized authorization middleware
- Validate all user inputs
- Log authorization failures for monitoring

### Authentication

- Use secure password hashing (bcrypt)
- Implement JWT with proper expiration
- Rotate secrets regularly
- Use HTTPS in production

### API Security

- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Parameterized queries to prevent SQL injection
- CORS configuration

## Mitigation Notes

1. **Ownership Verification**: Always check that the authenticated user owns or has permission to access the requested resource
2. **Centralized Checks**: Implement authorization logic in middleware or decorators
3. **Audit Logging**: Log all access attempts for security monitoring
4. **Least Privilege**: Grant minimum necessary permissions

## Contact

For security concerns about this educational material, please open an issue.
