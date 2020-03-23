const router = require('express').Router();

const CoreController = require('../controllers/Core');

router.get('/balance/:coin/:address', CoreController.getAddressBalance);
router.put('/balance/:coin/:type', CoreController.updateAddressBalance);
// TODO get address balance


module.exports = router;