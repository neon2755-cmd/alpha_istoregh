const router = require('express').Router();
const ctrl   = require('../controllers/productController');

router.get('/',                    ctrl.getProducts);
router.get('/stats',              ctrl.getStats);
router.get('/slug/:slug',          ctrl.getProductBySlug);
router.get('/:id',                 ctrl.getProduct);
router.post('/',                   ctrl.createProduct);
router.put('/:id',                 ctrl.updateProduct);
router.delete('/:id',              ctrl.deleteProduct);
router.post('/:id/reviews',        ctrl.addReview);

module.exports = router;
