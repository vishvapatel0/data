require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase, seedDatabase } = require('./models/database');
const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initializeDatabase();
seedDatabase();

app.use('/auth', authRoutes);
app.use('/devices', deviceRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'IoT Dashboard API', docs: '/docs' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
