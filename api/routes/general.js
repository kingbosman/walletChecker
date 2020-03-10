const router = require('express').Router();

const CoreController = require('../controllers/Core');

router.get('/:coin', CoreController.getCoinDetails);
router.post('/address', CoreController.setAddress);
// TODO create route for updating wallet information per wallet

module.exports = router;