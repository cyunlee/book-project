const express= require('express');
const router = express.Router();
const controller = require('../controller/Cmain')
const bookController = require('./../controller/Cbook');

router.get('/', controller.main);
router.get('/login', controller.signin);
router.get('/signup', controller.signup);
router.get('/mypage', controller.mypage);

// 메인 페이지
router.get('/main',bookController.main);

// 검색 결과 가져오기
router.get('/search',bookController.getBooks);

// 베스트 셀러 가져오기
router.get('/bestSeller',bookController.getBestSeller);

// 추천 신간 가져오기
router.get('/brendNew',bookController.getBrendNew);

// 책 클릭 시 상세페이지로 이동할 때 필요한 isbn13 가져오기
router.get('/getIsbn',bookController.getIsbn);

// 상세 페이지
router.get('/detailGo',bookController.goDetail);

// 상세페이지 내용 가져오기
router.get('/getDetail',bookController.getDetail);

module.exports = router;