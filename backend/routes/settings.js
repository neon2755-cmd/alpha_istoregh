const router = require('express').Router();
const ctrl   = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/',  ctrl.getSettings);
router.put('/',  protect, adminOnly, ctrl.updateSettings);
router.get('/promo/:code', ctrl.validatePromoCode);

module.exports = router;
