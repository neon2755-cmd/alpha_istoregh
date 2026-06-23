const router = require('express').Router();
const ctrl = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', ctrl.submitContact);
router.get('/', protect, adminOnly, ctrl.getAllMessages);
router.patch('/:id/reply', protect, adminOnly, ctrl.markReplied);
router.delete('/:id', protect, adminOnly, ctrl.deleteMessage);

module.exports = router;
