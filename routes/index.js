const express= require('express');
const router = express.Router();
const controller = require('./../controller/Cbook');

router.get('/',controller.link);
router.get('/main',controller.main);
router.get('/search',controller.getBooks);
router.get('/bestSeller',controller.getBestSeller);
router.get('/brendNew',controller.getBrendNew);
router.get('/getIsbn',controller.getIsbn);
router.get('/detailGo',controller.goDetail);
router.get('/getDetail',controller.getDetail);
// router.get('/goDetail',controller.goDetail);
// router.get('/getDetailTemp',controller.getDetailTemp);

module.exports = router;