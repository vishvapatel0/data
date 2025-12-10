const { getDeviceById } = require('../models/database');

function deviceOwnerMiddleware(allowAdmin = true) {
  return async (req, res, next) => {
    const deviceId = parseInt(req.params.id);
    
    if (isNaN(deviceId)) {
      return res.status(400).json({ error: 'Invalid device ID' });
    }

    const device = getDeviceById(deviceId);
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const isOwner = device.owner_id === req.user.id;
    const isAdmin = allowAdmin && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.device = device;
    next();
  };
}

module.exports = { deviceOwnerMiddleware };
