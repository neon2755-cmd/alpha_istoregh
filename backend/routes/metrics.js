const express = require('express');
const router = express.Router();
const { getAuthMetrics } = require('../utils/metrics');

// Require METRICS_TOKEN if set; otherwise only allow localhost
function allowAccess(req) {
  const token = req.headers['x-metrics-token'];
  if (process.env.METRICS_TOKEN) {
    return token && token === process.env.METRICS_TOKEN;
  }
  // No token configured — allow only local requests
  const ip = (req.ip || req.connection.remoteAddress || '').replace('::ffff:', '');
  return ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(ip) || req.hostname === 'localhost';
}

// GET /api/metrics/auth
router.get('/auth', (req, res) => {
  try {
    if (!allowAccess(req)) return res.status(403).json({ success: false, message: 'Forbidden' });
    const m = getAuthMetrics();
    res.json({ success: true, metrics: m });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
