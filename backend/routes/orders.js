const router = require('express').Router();
const ctrl   = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/',                   ctrl.createOrder);
router.get('/my',    protect,      ctrl.getMyOrders);
router.get('/track/:orderNumber',  ctrl.trackOrder);
router.get('/dashboard-stats', ctrl.getDashboardStats);
router.delete('/clear', protect, adminOnly, ctrl.clearAllOrders);
router.get('/', ctrl.getAllOrders);
router.patch('/:id/status', ctrl.updateOrderStatus);

module.exports = router;
