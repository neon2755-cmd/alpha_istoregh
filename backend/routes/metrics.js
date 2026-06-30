const express = require('express');
const router = express.Router();
const { getAuthMetrics } = require('../utils/metrics');

// GET /api/metrics/auth
router.get('/auth', (req, res) => {
  try {
    const m = getAuthMetrics();
    res.json({ success: true, metrics: m });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
