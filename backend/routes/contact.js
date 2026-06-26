const router = require('express').Router();
const ctrl = require('../controllers/contactController');

router.post('/', ctrl.submitContact);
router.get('/', ctrl.getAllMessages);
router.patch('/:id/reply', ctrl.markReplied);
router.delete('/:id', ctrl.deleteMessage);

module.exports = router;
