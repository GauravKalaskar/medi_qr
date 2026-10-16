const app = require('./app');
const { PORT } = require('./config/env');

app.listen(PORT, () => {
  console.log(`🚀 MedSecure QR Backend Server running on port ${PORT}`);
  console.log(`🏥 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api/health`);
});
