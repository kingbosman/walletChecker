const router = require('express').Router();

const CoreController = require('../controllers/Core');

// TODO routes maintenance 
// TODO general = main overview per coin all balances and all coins overview 
// TODO update = balances this will list detailed information per address or address type
// TODO create transaction routes

router.get('/:coin', CoreController.getCoinDetails);
router.post('/address', CoreController.setAddress);

module.exports = router;