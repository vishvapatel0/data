# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

This is a demonstration repository for educational purposes.

## Security Best Practices for Cloud Storage

### File Access Control

- Users can only access their own files
- Shared files require explicit permissions
- Admin access should be audited

### Authorization Controls

- Verify file ownership before any operation
- Implement share permissions system
- Use signed URLs for temporary access
- Audit all file access

### Data Protection

- Encrypt files at rest
- Use HTTPS for all transfers
- Validate file types on upload
- Scan uploads for malware

## Mitigation Notes

1. **File Ownership Verification**: Always check file.owner_id matches the authenticated user
2. **Centralized Authorization**: Use middleware for consistent access control
3. **Audit Logging**: Log all file access for security monitoring
4. **Least Privilege**: Default deny, explicit allow
