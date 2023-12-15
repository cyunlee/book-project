const express = require('express');
const router = express.Router();
const controller = require('../controller/Cmain')

router.get('/', controller.main);
router.get('/login', controller.main);
router.get('/signup', controller.main);

module.exports = router;