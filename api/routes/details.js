const router = require('express').Router();

const DetailsController = require('../controllers/details');

router.get('/', DetailsController.getDetails);
router.post('/:type/:coin', DetailsController.updateDetails);

module.exports = router;