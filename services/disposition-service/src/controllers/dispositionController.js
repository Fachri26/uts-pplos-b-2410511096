const db = require('../config/db');
const axios = require('axios');

// CREATE DISPOSITION
exports.createDisposition = async (req, res) => {
  const { complaint_id, unit_id, notes } = req.body;

  if (!complaint_id || !unit_id) {
    return res.status(400).json({ message: 'Missing data' });
  }

  let complaint;

  try {
    const response = await axios.get(
      `http://localhost:8000/api/complaints/${complaint_id}`
    );

    if (!response.data) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint = response.data;

  } catch (err) {
    return res.status(500).json({ message: 'Complaint service error' });
  }

  const status = 'forwarded';

    db.query(
    "INSERT INTO dispositions (complaint_id, unit_id, status, notes) VALUES (?, ?, ?, ?)",
    [complaint_id, unit_id, status, notes],
    async (err, result) => { 
      if (err) return res.status(500).json(err);

      try {
        await axios.post('http://localhost:3004/notifications', {
          user_id: complaint.user_id,
          title: 'Pengaduan didisposisikan',
          message: 'Pengaduan Anda telah diteruskan ke unit terkait'
        });
      } catch (e) {
        console.log('Notification error:', e.message);
      }

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

      db.query(
        "SELECT complaint_id FROM dispositions WHERE id=?",
        [id],
        async (err, result) => {
          if (err || result.length === 0) {
            return res.json({ message: 'Updated (no notification)' });
          }

          const complaint_id = result[0].complaint_id;

          try {
            const response = await axios.get(
              `http://localhost:8000/api/complaints/${complaint_id}`
            );

            const complaint = response.data;

            await axios.post('http://localhost:3004/notifications', {
              user_id: complaint.user_id,
              title: 'Status diperbarui',
              message: `Status pengaduan berubah menjadi ${status}`
            });

          } catch (e) {
            console.log('Notification error:', e.message);
          }

          res.json({ message: 'Updated' });
        }
      );
    }
  );
};

// GET UNITS
exports.getUnits = (req, res) => {
  db.query("SELECT * FROM units", (err, results) => {
    res.json(results);
  });
};
