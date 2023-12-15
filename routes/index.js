const express = require('express');
const router = express.Router();
const controller = require('../controller/Cmain')

router.get('/', controller.main);
router.get('/login', controller.signin);
router.get('/signup', controller.signup);

module.exports = router;