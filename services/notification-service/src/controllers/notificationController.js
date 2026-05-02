const db = require('../config/db');

// CREATE NOTIFICATION
exports.createNotification = (req, res) => {
  const { user_id, title, message } = req.body;

  if (!user_id || !title) {
    return res.status(400).json({ message: 'Missing data' });
  }

  db.query(
    "INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)",
    [user_id, title, message],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        message: 'Notification created'
      });
    }
  );
};

// GET BY USER
exports.getByUser = (req, res) => {
  const user_id = req.params.id;

  db.query(
    "SELECT * FROM notifications WHERE user_id = ?",
    [user_id],
    (err, results) => {
      res.json(results);
    }
  );
};
