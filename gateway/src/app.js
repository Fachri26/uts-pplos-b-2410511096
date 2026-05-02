require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const proxyRoutes = require('./routes/proxy');

const app = express();

app.use(cors());



app.use((req, res, next) => {
  console.log('Incoming Request:', req.method, req.url);
  next();
});

app.use((req, res, next) => {
  console.log('➡️ Gateway:', req.method, req.url);
  next();
});

// RATE LIMIT
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60
});

app.use(limiter);

// ROUTES
app.use('/', proxyRoutes);
app.listen(process.env.PORT, () => {
  console.log(`API Gateway running on ${process.env.PORT}`);
});