# Threat Model: IoT Dashboard

## System Overview

The IoT Dashboard API allows users to manage their IoT devices, view sensor data, update settings, and send commands to devices.

## Assets

1. **Device Data**: Sensor readings, device status
2. **Device Control**: Ability to send commands
3. **User Credentials**: Authentication tokens

## Threat Actors

1. **Malicious Users**: Attempting to control others' devices
2. **External Attackers**: Unauthorized access attempts
3. **Compromised Devices**: Rogue device attacks

## Authorization Controls Implemented

### 1. Device Owner Middleware

Every device endpoint verifies ownership:

```javascript
const deviceOwnerMiddleware = async (req, res, next) => {
  const device = await getDeviceById(req.params.id);
  
  if (!device) {
    return res.status(404).json({ error: 'Device not found' });
  }
  
  if (device.owner_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  req.device = device;
  next();
};
```

### 2. Role-Based Access

- **Users**: Can manage their own devices only
- **Admins**: Can view all devices for support

### 3. Command Authorization

Device commands require:
1. Valid authentication
2. Device ownership
3. Valid command type

## Threat Vectors Considered

### IDOR Attacks (Mitigated)

**Threat**: User A controls User B's devices
**Mitigation**: `deviceOwnerMiddleware` on all device endpoints

### Unauthorized Commands (Mitigated)

**Threat**: Sending malicious commands to devices
**Mitigation**: Ownership check + command validation

### Data Theft (Mitigated)

**Threat**: Accessing sensor data from other users
**Mitigation**: Ownership verification on data endpoints

## Why This Implementation is Secure

1. **Middleware-Based Security**: Consistent checks via Express middleware
2. **Defense in Depth**: Auth + ownership + validation layers
3. **Principle of Least Privilege**: Users only access own devices
4. **Auditable**: All device access logged
5. **Tested**: Comprehensive test coverage

## Security Verification Checklist

- [x] All endpoints require authentication
- [x] Device access restricted to owner
- [x] Command execution requires ownership
- [x] Sensor data protected per device
- [x] Admin access for support purposes
- [x] Input validation on commands
- [x] Secure error messages
