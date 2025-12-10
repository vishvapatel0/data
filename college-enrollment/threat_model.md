# Threat Model: College Enrollment System

## System Overview

The College Enrollment API allows students to browse courses, enroll in classes, and manage their enrollments. Administrators can manage courses and view all enrollments.

## Assets

1. **Student Data**: Personal information, enrollment records
2. **Course Data**: Course details, enrollment capacity
3. **Authentication Credentials**: Passwords, JWT tokens

## Threat Actors

1. **Malicious Students**: Authenticated users attempting to access other students' data
2. **External Attackers**: Unauthenticated attackers trying to gain access
3. **Insider Threats**: Compromised admin accounts

## Authorization Controls Implemented

### 1. Enrollment Ownership Verification

Every enrollment endpoint verifies the requesting user owns the enrollment:

```python
class IsEnrollmentOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.student == request.user or request.user.role == 'admin'
```

### 2. Role-Based Access Control

- **Students**: Can only access their own enrollments
- **Admins**: Can view all enrollments, manage courses

### 3. Centralized Permission Classes

All permissions are defined in `permissions.py` and applied consistently:

- `IsAuthenticated`: Requires valid JWT token
- `IsEnrollmentOwner`: Verifies enrollment ownership
- `IsAdminUser`: Restricts to admin role

## Threat Vectors Considered

### IDOR Attacks (Mitigated)

**Threat**: Student A tries to view/modify Student B's enrollments
**Mitigation**: `IsEnrollmentOwner` permission class on all enrollment detail views

### Unauthorized Enrollment (Mitigated)

**Threat**: User creates enrollment for another user
**Mitigation**: Enrollment creation always uses `request.user` as the student

### Token Theft (Mitigated)

**Threat**: JWT token stolen and reused
**Mitigation**: Short expiration (1 hour), HTTPS required in production

### Privilege Escalation (Mitigated)

**Threat**: Student tries to perform admin actions
**Mitigation**: Role-based checks on sensitive endpoints

## Why This Implementation is Secure

1. **Defense in Depth**: Multiple layers of authorization checks
2. **Fail-Safe Defaults**: Default deny, explicit allow
3. **Centralized Logic**: All authorization in permission classes, not scattered
4. **Auditable**: All actions logged for security review
5. **Tested**: Comprehensive test suite for authorization paths

## Security Verification Checklist

- [x] All endpoints require authentication
- [x] Enrollment access restricted to owner
- [x] Admin operations require admin role
- [x] Input validation on all endpoints
- [x] SQL injection prevented via ORM
- [x] CSRF protection enabled
- [x] Secure password storage (bcrypt)
- [x] JWT tokens expire appropriately
