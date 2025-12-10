# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

This is a demonstration repository for educational purposes.

## Security Best Practices for Ticketing Systems

### Ticket Access Control

- Users can only access their own tickets
- Ticket transfers require owner authorization
- Upgrade operations must verify ownership

### Authorization Controls

- Verify ticket ownership before any operation
- Implement proper transfer authorization
- Use secure ticket IDs (consider UUIDs)
- Audit all ticket transactions

### Financial Security

- Validate all payment operations
- Prevent double-spending of tickets
- Log all financial transactions
- Rate limit sensitive operations

## Mitigation Notes

1. **Ticket Ownership Verification**: Always check ticket.user_id matches authenticated user
2. **Transfer Authorization**: Only ticket owner can initiate transfers
3. **Upgrade Verification**: Verify ownership before allowing upgrades
4. **Audit Trail**: Log all ticket operations for fraud detection
