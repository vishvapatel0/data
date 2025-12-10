const express = require('express');
const { db } = require('../models/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  try {
    let records;
    if (req.user.role === 'admin') {
      records = db.prepare('SELECT * FROM medical_records ORDER BY created_at DESC').all();
    } else {
      records = db.prepare('SELECT * FROM medical_records WHERE patient_id = ? ORDER BY created_at DESC')
        .all(req.user.id);
    }
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

router.get('/:id', authenticateToken, (req, res) => {
  try {
    const recordId = parseInt(req.params.id);
    const record = db.prepare('SELECT * FROM medical_records WHERE id = ?').get(recordId);
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch record' });
  }
});

router.put('/:id', authenticateToken, (req, res) => {
  try {
    const recordId = parseInt(req.params.id);
    const { diagnosis, notes, provider_name } = req.body;

    const record = db.prepare('SELECT * FROM medical_records WHERE id = ?').get(recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    db.prepare(`
      UPDATE medical_records 
      SET diagnosis = COALESCE(?, diagnosis),
          notes = COALESCE(?, notes),
          provider_name = COALESCE(?, provider_name),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(diagnosis, notes, provider_name, recordId);

    const updatedRecord = db.prepare('SELECT * FROM medical_records WHERE id = ?').get(recordId);
    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update record' });
  }
});

router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const recordId = parseInt(req.params.id);
    
    const record = db.prepare('SELECT * FROM medical_records WHERE id = ?').get(recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    db.prepare('DELETE FROM medical_records WHERE id = ?').run(recordId);
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const { patient_id, record_type, diagnosis, notes, provider_name } = req.body;

    if (!record_type) {
      return res.status(400).json({ error: 'Record type is required' });
    }

    const targetPatientId = patient_id || req.user.id;

    const result = db.prepare(`
      INSERT INTO medical_records (patient_id, record_type, diagnosis, notes, provider_name)
      VALUES (?, ?, ?, ?, ?)
    `).run(targetPatientId, record_type, diagnosis, notes, provider_name);

    const newRecord = db.prepare('SELECT * FROM medical_records WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create record' });
  }
});

module.exports = router;
