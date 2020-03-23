const router = require('express').Router();

const CoreController = require('../controllers/Core');

router.put('/balance/:coin/:type', CoreController.updateAddressBalance);
// TODO get address balance


module.exports = router;