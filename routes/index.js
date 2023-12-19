const express= require('express');
const router = express.Router();
const controller = require('../controller/Cmain')
const bookController = require('./../controller/Cbook');

router.get('/', controller.main);
router.get('/login', controller.signin);
router.get('/signup', controller.signup);
router.get('/mypage', controller.mypage);
router.post('/signup_post', controller.signup_post);


// 메인 페이지
router.get('/main',bookController.main);

// 검색 결과 가져오기
router.get('/search',bookController.get_books);

// 베스트 셀러 가져오기
router.get('/bestSeller',bookController.get_bestSeller);

// 추천 신간 가져오기
router.get('/brendNew',bookController.get_brendNew);

// 책 클릭 시 상세페이지로 이동할 때 필요한 isbn13 가져오기
router.get('/getIsbn',bookController.get_isbn);

// 상세 페이지
router.get('/detailGo',bookController.go_detail);

// 상세페이지 내용 가져오기
router.get('/getDetail',bookController.get_detail);

// 상세페이지 댓글 가져오기
router.get('/getComments',bookController.get_comments);

// 상세 페이지 댓글 작성
router.post('/writeComment',bookController.post_comment)

// 상세 페이지 댓글 수정
router.patch('/updateComment',bookController.patch_comment);

// 상세페이지 댓글 삭제
router.delete('/deleteComment',bookController.delete_comment);

module.exports = router;