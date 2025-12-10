const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database(':memory:');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'offline',
      settings TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS sensor_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id INTEGER NOT NULL,
      sensor_type TEXT NOT NULL,
      value REAL NOT NULL,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (device_id) REFERENCES devices(id)
    );
  `);
}

function seedDatabase() {
  const existingUser = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (existingUser) return;

  const users = [
    { email: 'admin@example.com', password: 'admin123', full_name: 'Admin User', role: 'admin' },
    { email: 'user1@example.com', password: 'user123', full_name: 'Home Owner', role: 'user' },
    { email: 'attacker@example.com', password: 'attacker123', full_name: 'Test Account', role: 'user' },
  ];

  const insertUser = db.prepare('INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)');
  const insertDevice = db.prepare('INSERT INTO devices (owner_id, name, type, status, settings) VALUES (?, ?, ?, ?, ?)');
  const insertData = db.prepare('INSERT INTO sensor_data (device_id, sensor_type, value) VALUES (?, ?, ?)');

  for (const u of users) {
    const hash = bcrypt.hashSync(u.password, 10);
    insertUser.run(u.email, hash, u.full_name, u.role);
  }

  const devices = [
    { owner_id: 1, name: 'Server Room Sensor', type: 'temperature', status: 'online', settings: '{"threshold": 30}' },
    { owner_id: 2, name: 'Living Room Thermostat', type: 'thermostat', status: 'online', settings: '{"target_temp": 22}' },
    { owner_id: 2, name: 'Front Door Lock', type: 'smart_lock', status: 'online', settings: '{"auto_lock": true}' },
    { owner_id: 3, name: 'Garage Door', type: 'smart_lock', status: 'offline', settings: '{}' },
  ];

  for (const d of devices) {
    insertDevice.run(d.owner_id, d.name, d.type, d.status, d.settings);
  }

  for (let i = 0; i < 10; i++) {
    insertData.run(1, 'temperature', 25 + Math.random() * 10);
    insertData.run(2, 'temperature', 20 + Math.random() * 5);
    insertData.run(2, 'humidity', 40 + Math.random() * 20);
  }
}

function getUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

function getDeviceById(id) {
  return db.prepare('SELECT * FROM devices WHERE id = ?').get(id);
}

function getDevicesByOwner(ownerId) {
  return db.prepare('SELECT * FROM devices WHERE owner_id = ?').all(ownerId);
}

function getAllDevices() {
  return db.prepare('SELECT * FROM devices').all();
}

function updateDevice(id, settings) {
  db.prepare('UPDATE devices SET settings = ? WHERE id = ?').run(JSON.stringify(settings), id);
  return getDeviceById(id);
}

function getSensorData(deviceId, limit = 10) {
  return db.prepare('SELECT * FROM sensor_data WHERE device_id = ? ORDER BY recorded_at DESC LIMIT ?').all(deviceId, limit);
}

module.exports = {
  db,
  initializeDatabase,
  seedDatabase,
  getUserByEmail,
  getDeviceById,
  getDevicesByOwner,
  getAllDevices,
  updateDevice,
  getSensorData,
};
