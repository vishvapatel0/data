const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { deviceOwnerMiddleware } = require('../middleware/deviceOwner');
const { getDevicesByOwner, getAllDevices, updateDevice, getSensorData } = require('../models/database');

const router = express.Router();

router.use(authenticateToken);

router.get('/', (req, res) => {
  try {
    let devices;
    if (req.user.role === 'admin') {
      devices = getAllDevices();
    } else {
      devices = getDevicesByOwner(req.user.id);
    }
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

router.get('/:id', deviceOwnerMiddleware(true), (req, res) => {
  res.json(req.device);
});

router.put('/:id', deviceOwnerMiddleware(false), (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Invalid settings' });
    }

    const updatedDevice = updateDevice(req.device.id, settings);
    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update device' });
  }
});

router.get('/:id/data', deviceOwnerMiddleware(true), (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = getSensorData(req.device.id, Math.min(limit, 100));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
});

router.post('/:id/command', deviceOwnerMiddleware(false), (req, res) => {
  try {
    const { command, params } = req.body;

    const validCommands = ['on', 'off', 'lock', 'unlock', 'set_temperature'];
    if (!command || !validCommands.includes(command)) {
      return res.status(400).json({ error: 'Invalid command' });
    }

    res.json({
      message: 'Command sent successfully',
      device_id: req.device.id,
      command,
      params,
      status: 'queued',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send command' });
  }
});

module.exports = router;
