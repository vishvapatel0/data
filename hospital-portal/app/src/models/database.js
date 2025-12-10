const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database(':memory:');

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'staff',
    department TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    ssn TEXT NOT NULL,
    insurance_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE lab_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    test_type TEXT NOT NULL,
    test_date TEXT NOT NULL,
    results TEXT NOT NULL,
    diagnosis TEXT,
    doctor_notes TEXT,
    confidential_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
  );
`);

const seedData = () => {
  const insertUser = db.prepare(`
    INSERT INTO users (email, password, full_name, role, department)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertPatient = db.prepare(`
    INSERT INTO patients (patient_id, full_name, date_of_birth, ssn, insurance_number)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertLabResult = db.prepare(`
    INSERT INTO lab_results (patient_id, test_type, test_date, results, diagnosis, doctor_notes, confidential_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('admin@example.com', bcrypt.hashSync('admin123', 10), 'Admin User', 'admin', 'Administration');
  insertUser.run('user1@example.com', bcrypt.hashSync('user123', 10), 'Dr. Smith', 'staff', 'Cardiology');
  insertUser.run('attacker@example.com', bcrypt.hashSync('attacker123', 10), 'Jane Receptionist', 'staff', 'Reception');

  insertPatient.run('P001', 'John Doe', '1985-03-15', '123-45-6789', 'INS001');
  insertPatient.run('P002', 'Jane Smith', '1990-07-22', '987-65-4321', 'INS002');
  insertPatient.run('P003', 'Bob Johnson', '1975-11-30', '456-78-9012', 'INS003');

  insertLabResult.run(1, 'Blood Panel', '2024-01-15', 'WBC: 7500, RBC: 4.5M, Hemoglobin: 14g/dL', 'Normal blood count', 'Patient appears healthy', 'HIV test: Negative');
  insertLabResult.run(1, 'Cardiac Panel', '2024-01-20', 'Troponin: 0.02, BNP: 45', 'Minor cardiac concern', 'Recommend follow-up in 3 months', 'History of heart disease in family');
  insertLabResult.run(2, 'Metabolic Panel', '2024-01-18', 'Glucose: 95, Creatinine: 0.9', 'Normal metabolism', 'Continue current diet', 'Patient mentioned depression symptoms');
  insertLabResult.run(3, 'Liver Panel', '2024-01-22', 'ALT: 35, AST: 28, Bilirubin: 0.8', 'Elevated liver enzymes', 'Reduce alcohol consumption', 'Patient has history of substance abuse');
};

seedData();

module.exports = db;
