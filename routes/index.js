const express= require('express');
const router = express.Router();
const controller = require('./../controller/Cbook');

router.get('/',controller.link);
router.get('/main',controller.main);
router.get('/search',controller.getBooks);
router.get('/bestSeller',controller.getBestSeller);
router.get('/brendNew',controller.getBrendNew);

module.exports = router;