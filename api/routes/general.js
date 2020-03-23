const router = require('express').Router();

const CoreController = require('../controllers/Core');

router.get('/:coin', CoreController.getCoinDetails);
router.post('/address', CoreController.setAddress);

module.exports = router;