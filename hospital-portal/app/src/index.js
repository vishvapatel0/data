require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const resultsRoutes = require('./routes/results');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/results', resultsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Hospital Lab Results Portal API', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
