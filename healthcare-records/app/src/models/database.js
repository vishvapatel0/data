const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : path.join(__dirname, '../../data/healthcare.db');

const db = new Database(dbPath);

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'patient',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS medical_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      record_type TEXT NOT NULL,
      diagnosis TEXT,
      notes TEXT,
      provider_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES users(id)
    );
  `);
}

function seedDatabase() {
  const existingUser = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (existingUser) return;

  const users = [
    { email: 'admin@example.com', password: 'admin123', full_name: 'Admin User', role: 'admin' },
    { email: 'user1@example.com', password: 'user123', full_name: 'John Patient', role: 'patient' },
    { email: 'attacker@example.com', password: 'attacker123', full_name: 'Test Account', role: 'patient' },
  ];

  const insertUser = db.prepare(
    'INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)'
  );
  const insertRecord = db.prepare(
    'INSERT INTO medical_records (patient_id, record_type, diagnosis, notes, provider_name) VALUES (?, ?, ?, ?, ?)'
  );

  for (const user of users) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    insertUser.run(user.email, hashedPassword, user.full_name, user.role);
  }

  const records = [
    { patient_id: 2, record_type: 'Lab Results', diagnosis: 'Normal blood work', notes: 'Annual checkup', provider_name: 'Dr. Smith' },
    { patient_id: 2, record_type: 'Prescription', diagnosis: 'Hypertension', notes: 'Blood pressure medication', provider_name: 'Dr. Johnson' },
    { patient_id: 3, record_type: 'Lab Results', diagnosis: 'Routine checkup', notes: 'All clear', provider_name: 'Dr. Williams' },
  ];

  for (const record of records) {
    insertRecord.run(record.patient_id, record.record_type, record.diagnosis, record.notes, record.provider_name);
  }
}

module.exports = { db, initializeDatabase, seedDatabase };
