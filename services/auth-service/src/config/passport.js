const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {

  const email = profile.emails[0].value;
  const name = profile.displayName;
  const avatar = profile.photos[0].value;
  const googleId = profile.id;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (results.length > 0) {
      return done(null, results[0]);
    } else {
      const insertSql = `
        INSERT INTO users (name, email, oauth_provider, oauth_id, avatar)
        VALUES (?, ?, 'google', ?, ?)
      `;

      db.query(insertSql, [name, email, googleId, avatar], (err, result) => {
        return done(null, {
          id: result.insertId,
          name,
          email
        });
      });
    }
  });
}));
