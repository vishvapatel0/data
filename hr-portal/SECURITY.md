# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

This is a demonstration repository for educational purposes.

## Security Best Practices for HR Systems

### Data Protection

- Employee PII must be protected
- Salary information is highly sensitive
- SSN/Tax IDs require encryption at rest

### Authorization Controls

- Employees can only view their own data
- Managers can view direct reports only
- HR admins have broader but audited access
- Salary data requires additional authorization

### Authentication

- Use secure password hashing (BCrypt)
- Implement JWT with proper expiration
- Session management with timeout

## Mitigation Notes

1. **Employee Ownership Verification**: Always verify the authenticated user's access rights
2. **Role-Based Access**: Implement proper RBAC for managers and HR
3. **Audit Logging**: Log all access to sensitive employee data
4. **Salary Data Protection**: Additional checks for salary information
