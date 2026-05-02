require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const proxyRoutes = require('./routes/proxy');

const app = express();

app.use(cors());
app.use(express.json());

// RATE LIMIT
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60
});

app.use(limiter);

// ROUTES
app.use('/api', proxyRoutes);

app.listen(process.env.PORT, () => {
  console.log(`API Gateway running on ${process.env.PORT}`);
});
