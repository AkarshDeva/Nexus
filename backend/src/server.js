require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const profileRoutes = require('./routes/profileRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/profile', profileRoutes);


app.use('/api/connections', connectionRoutes);


app.use('/api/messages', messageRoutes);

app.use('/api/users', userRoutes);

app.use('/api/ai', aiRoutes);
const opportunityRoutes = require('./routes/opportunityRoutes');
app.use('/api/opportunities', opportunityRoutes);
// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Nexus backend is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`NexusAI backend running on port ${PORT}`);
});