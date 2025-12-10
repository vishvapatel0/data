# Threat Model: Rideshare API

## System Overview

The Rideshare API enables passengers to request rides, drivers to accept and complete rides, and admins to manage the platform.

## Assets

1. **User Data**: Personal information, payment methods
2. **Ride Data**: Locations, routes, pricing
3. **Transaction Records**: Payment history

## Threat Actors

1. **Malicious Users**: Passengers/drivers trying to access others' data
2. **External Attackers**: Unauthenticated attackers
3. **Fraudulent Drivers**: Attempting to steal fares

## Authorization Controls Implemented

### 1. Ride Ownership Guard

```typescript
@Injectable()
export class RideOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ride = await this.ridesService.findOne(request.params.id);
    
    if (!ride) throw new NotFoundException();
    
    return ride.passengerId === request.user.id ||
           ride.driverId === request.user.id ||
           request.user.role === 'admin';
  }
}
```

### 2. Role-Based Access

- **Passengers**: Create rides, view/cancel their own rides
- **Drivers**: Accept rides, complete their assigned rides
- **Admins**: View all rides, manage disputes

### 3. State-Based Authorization

Certain actions only allowed in specific ride states:
- Accept: Only in 'pending' state
- Complete: Only in 'in_progress' state

## Threat Vectors Considered

### IDOR Attacks (Mitigated)

**Threat**: User A accesses User B's ride details
**Mitigation**: `RideOwnerGuard` on all ride detail endpoints

### Unauthorized State Transitions (Mitigated)

**Threat**: Passenger completes their own ride
**Mitigation**: Role + state checks on transition endpoints

### Fare Manipulation (Mitigated)

**Threat**: Driver modifies ride fare
**Mitigation**: Fare calculation server-side, read-only for users

## Why This Implementation is Secure

1. **Guard-Based Security**: NestJS guards provide declarative authorization
2. **Separation of Concerns**: Auth logic isolated from business logic
3. **Testable**: Guards can be unit tested independently
4. **Audit Trail**: All actions logged with user context
5. **Defense in Depth**: Multiple layers of validation

## Security Verification Checklist

- [x] All endpoints require authentication
- [x] Ride access restricted to participants
- [x] Role-based restrictions on actions
- [x] State-based transition validation
- [x] Input validation on all DTOs
- [x] SQL injection prevented via TypeORM
- [x] Secure password storage
