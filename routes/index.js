const express= require('express');
const router = express.Router();
const controller = require('../controller/Cmain')
const controller = require('./../controller/Cbook');

router.get('/', controller.main);
router.get('/login', controller.signin);
router.get('/signup', controller.signup);
router.get('/mypage', controller.mypage);

// 메인 페이지
router.get('/main',controller.main);

// 검색 결과 가져오기
router.get('/search',controller.getBooks);

// 베스트 셀러 가져오기
router.get('/bestSeller',controller.getBestSeller);

// 추천 신간 가져오기
router.get('/brendNew',controller.getBrendNew);

// 책 클릭 시 상세페이지로 이동할 때 필요한 isbn13 가져오기
router.get('/getIsbn',controller.getIsbn);

// 상세 페이지
router.get('/detailGo',controller.goDetail);

// 상세페이지 내용 가져오기
router.get('/getDetail',controller.getDetail);

module.exports = router;