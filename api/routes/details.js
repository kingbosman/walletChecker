const router = require('express').Router();

const CoreController = require('../controllers/Core');

router.get('/', CoreController.getDetails);
router.post('/:type/:coin', CoreController.updateDetails);

module.exports = router;