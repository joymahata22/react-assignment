require('dotenv').config();
const express = require('express');
const connectDB = require('./utils/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

const app = express();
const port = 3000;

app.use(cors({
  origin: 'https://react-assignment-frontend-pi.vercel.app',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', sessionRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

connectDB();


app.use((err, req, res, next) => {
  console.error('Error details:', err);
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
