require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./routes/dispositionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/dispositions', routes);

app.listen(process.env.PORT, () => {
  console.log(`Disposition Service running on ${process.env.PORT}`);
});
