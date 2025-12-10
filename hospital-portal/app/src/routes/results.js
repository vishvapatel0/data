const express = require('express');
const db = require('../models/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const results = db.prepare(`
    SELECT lr.*, p.full_name as patient_name, p.patient_id as patient_code, p.ssn, p.date_of_birth
    FROM lab_results lr
    JOIN patients p ON lr.patient_id = p.id
    ORDER BY lr.created_at DESC
  `).all();

  res.json(results);
});

router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const result = db.prepare(`
    SELECT lr.*, p.full_name as patient_name, p.patient_id as patient_code, p.ssn, p.date_of_birth, p.insurance_number
    FROM lab_results lr
    JOIN patients p ON lr.patient_id = p.id
    WHERE lr.id = ?
  `).get(id);

  if (!result) {
    return res.status(404).json({ error: 'Lab result not found' });
  }

  res.json(result);
});

router.get('/patient/:patientId', authenticateToken, (req, res) => {
  const { patientId } = req.params;

  const patient = db.prepare('SELECT * FROM patients WHERE id = ? OR patient_id = ?').get(patientId, patientId);
  
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const results = db.prepare(`
    SELECT lr.*, p.full_name as patient_name, p.patient_id as patient_code, p.ssn, p.date_of_birth
    FROM lab_results lr
    JOIN patients p ON lr.patient_id = p.id
    WHERE p.id = ? OR p.patient_id = ?
    ORDER BY lr.created_at DESC
  `).all(patientId, patientId);

  res.json({
    patient: {
      id: patient.id,
      patient_id: patient.patient_id,
      full_name: patient.full_name,
      date_of_birth: patient.date_of_birth,
      ssn: patient.ssn,
      insurance_number: patient.insurance_number
    },
    results
  });
});

module.exports = router;
