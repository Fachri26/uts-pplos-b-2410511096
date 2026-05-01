const db = require('../config/db');

// CREATE DISPOSITION
exports.createDisposition = (req, res) => {
  const { complaint_id, unit_id, notes } = req.body;

  if (!complaint_id || !unit_id) {
    return res.status(400).json({ message: 'Missing data' });
  }

  const status = 'forwarded';

  db.query(
    "INSERT INTO dispositions (complaint_id, unit_id, status, notes) VALUES (?, ?, ?, ?)",
    [complaint_id, unit_id, status, notes],
    (err, result) => {
      if (err) return res.status(500).json(err);

      // log activity
      db.query(
        "INSERT INTO logs (disposition_id, action, description) VALUES (?, ?, ?)",
        [result.insertId, 'CREATE', 'Disposition created']
      );

      res.status(201).json({
        message: 'Disposition created',
        id: result.insertId
      });
    }
  );
};

// GET BY COMPLAINT
exports.getByComplaint = (req, res) => {
  const complaint_id = req.params.id;

  db.query(
    "SELECT * FROM dispositions WHERE complaint_id = ?",
    [complaint_id],
    (err, results) => {
      res.json(results);
    }
  );
};

// UPDATE
exports.updateDisposition = (req, res) => {
  const id = req.params.id;
  const { status, notes } = req.body;

  db.query(
    "UPDATE dispositions SET status=?, notes=? WHERE id=?",
    [status, notes, id],
    (err) => {
      if (err) return res.status(500).json(err);

      db.query(
        "INSERT INTO logs (disposition_id, action, description) VALUES (?, ?, ?)",
        [id, 'UPDATE', `Status changed to ${status}`]
      );

      res.json({ message: 'Updated' });
    }
  );
};

// GET UNITS
exports.getUnits = (req, res) => {
  db.query("SELECT * FROM units", (err, results) => {
    res.json(results);
  });
};
