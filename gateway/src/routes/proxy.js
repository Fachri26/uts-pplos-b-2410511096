const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// AUTH SERVICE (tanpa jwt)
router.use('/auth', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true
}));

// COMPLAINT SERVICE
router.use('/complaints',
  authMiddleware,
  createProxyMiddleware({
    target: 'http://127.0.0.1:8000/api',
    changeOrigin: true,
    pathRewrite: {
      '^/complaints': '/complaints'
    }
  })
);

// DISPOSITION SERVICE
router.use('/dispositions',
  authMiddleware,
  createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true
  })
);

// NOTIFICATION SERVICE (tanpa jwt)
router.use('/notifications',
  createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true
  })
);

module.exports = router;
