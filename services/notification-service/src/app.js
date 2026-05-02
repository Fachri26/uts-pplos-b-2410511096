require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./routes/notificationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/notifications', routes);

app.listen(process.env.PORT, () => {
  console.log(`Notification Service running on ${process.env.PORT}`);
});
