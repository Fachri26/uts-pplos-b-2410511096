const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES
  });
};

// REGISTER
exports.register = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const sqlCheck = "SELECT * FROM users WHERE email = ?";
    
    db.query(sqlCheck, [email], (err, results) => {
        if (err) return res.status(500).json(err);

        const hashedPassword = bcrypt.hashSync(password, 10);

        if (results.length > 0) {
            const existingUser = results[0];

            if (existingUser.deleted_at === null) {
                return res.status(400).json({ message: 'Email already in use' });
            }

            const sqlRestore = "UPDATE users SET name = ?, password = ?, deleted_at = NULL WHERE id = ?";
            db.query(sqlRestore, [name, hashedPassword, existingUser.id], (err) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json({ message: 'Account reactivated successfully' });
            });

        } else {
            const sqlInsert = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
            db.query(sqlInsert, [name, email, hashedPassword], (err) => {
                if (err) return res.status(500).json(err);
                return res.status(201).json({ message: 'User registered' });
            });
        }
    });
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL";

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const user = results[0];

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: 'Wrong password' });

    const payload = { id: user.id, email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    db.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, refreshToken, expires]
    );

    res.json({ accessToken, refreshToken });
  });
};

// REFRESH TOKEN
exports.refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: 'No token' });

  const sql = `
    SELECT refresh_tokens.*, users.deleted_at 
    FROM refresh_tokens 
    JOIN users ON refresh_tokens.user_id = users.id 
    WHERE refresh_tokens.token = ? AND users.deleted_at IS NULL
  `;

  db.query(sql, [token], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    if (results.length === 0) {
      return res.status(403).json({ message: 'Invalid refresh token or user deleted' });
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token expired' });

      const newAccessToken = generateAccessToken({
        id: user.id,
        email: user.email
      });

      res.json({ accessToken: newAccessToken });
    });
  });
};

// LOGOUT
exports.logout = (req, res) => {
  const { token } = req.body;

  db.query(
    "DELETE FROM refresh_tokens WHERE token = ?",
    [token],
    () => {
      res.json({ message: 'Logged out' });
    }
  );
};

//DELETEUSER (SOFT DELETE)
exports.deleteUser = (req, res) => {
  const userId = req.user.id;

  const sql = "UPDATE users SET deleted_at = NOW() WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    
    const sqlLogout = "DELETE FROM refresh_tokens WHERE user_id = ?";
    db.query(sqlLogout, [userId], (err) => {
      if (err) console.error("Failed to clear tokens on delete:", err);
      res.json({ message: 'User account deactivated and all sessions cleared' });
    });
  });
};

//PROFILE
exports.profile = (req, res) => {
  res.json({ user: req.user });
};
