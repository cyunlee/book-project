const express = require('express');
const router = express.Router();
const controller = require('../controller/CbookMain');

// localhost:PORT/bookShelf 기본 경로

// router.get('/', controller.main);
router.get('/', controller.get_bookshelf);
router.get('/test', controller.get_description);
router.get('/detail', controller.load_detail);

module.exports = router;