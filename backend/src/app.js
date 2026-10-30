const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

// Route modules
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const medicalProfileRoutes = require('./routes/medicalProfileRoutes');
const qrRoutes = require('./routes/qrRoutes');
const publicRoutes = require('./routes/publicRoutes');
const accessLogRoutes = require('./routes/accessLogRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security Headers & Logging
app.use(helmet());
app.use(morgan('dev'));

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const frontendEnv = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/+$/, '') : null;
      const isAllowed =
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.startsWith('http://192.168.') ||
        origin.startsWith('http://10.') ||
        origin.startsWith('http://172.') ||
        (frontendEnv && origin === frontendEnv) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.netlify.app') ||
        origin.endsWith('.onrender.com');
      if (isAllowed || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: origin not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiter for Authentication endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many authentication attempts. Please try again in 15 minutes.' },
});

// Health check endpoints
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'online',
    system: 'MedSecure QR API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes (accessible via both /api/* and root /*)
app.use(['/api/auth', '/auth'], authRateLimiter, authRoutes);
app.use(['/api/users', '/users'], userRoutes);
app.use(['/api/medical-profile', '/medical-profile'], medicalProfileRoutes);
app.use(['/api/qr', '/qr'], qrRoutes);
app.use(['/api/public', '/public'], publicRoutes);
app.use(['/api/access-logs', '/access-logs'], accessLogRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
