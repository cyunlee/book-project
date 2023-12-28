const express= require('express');
const router = express.Router();
const controller = require('../controller/Cmain');
const bookController = require('./../controller/Cbook');
const followController = require('./../controller/Cfollow');
const cookieParser = require('cookie-parser');

router.use(cookieParser());



// 임시 링크
router.get('/', controller.main);

// 로그인 페이지
router.get('/login', controller.signin);

router.get('/logout', controller.logout);

router.post('/login_post', controller.login_post)
router.post('/nameCheck_post', controller.nameCheck)
router.post('/idCheck_post', controller.idCheck)

// 회원가입 페이지
router.get('/signup', controller.signup);


// 마이페이지
router.get('/mypage', controller.mypage);

router.post('/upload',controller.upload_post);
router.patch('/patchImg',controller.upload_patch);
router.post('/login_post', controller.login_post)
router.post('/nameCheck_post', controller.nameCheck)
router.post('/idCheck_post', controller.idCheck);
router.delete('/deleteUser', controller.delete_user);

router.get('/follow_number_get', followController.follow_number_get);
router.get('/follow_list_get', followController.follow_list_get);
router.post('/getMyComments', controller.get_my_comments);
//팔로잉 전체보기
router.get('/following', controller.following);

//팔로워 전체보기
router.get('/follower', controller.follower);

//팔로워 전체보기

// 읽은 책 전체보기
router.get('/viewAll/:u_id', controller.viewAll);

// 좋아요한 책 전체보기
router.get('/viewLikes/', controller.viewLikes);

// 싫어요한 책 전체보기
router.get('/viewDislikes/', controller.viewDislikes);

// 다른 사람 계정 페이지
router.get('/otherpage', controller.otherpage);

// 회원가입하기
router.post('/signup_post', controller.signup_post);

// 메인 페이지
router.get('/main',bookController.main);

// 검색 결과 가져오기
router.get('/search',bookController.get_books);

// 베스트 셀러 가져오기
router.get('/bestSeller',bookController.get_bestSeller);

// 추천 신간 가져오기
router.get('/brendNew',bookController.get_brendNew);

// 좋아요 랭킹 가져오기
router.get('/mostLike', controller.mostLike);

// 상세 페이지
router.get('/detailGo',bookController.go_detail);

// 상세페이지 내용 가져오기
router.get('/getDetail',bookController.get_detail);

// 상세페이지 댓글 가져오기
router.post('/getComments',bookController.get_comments);

// 상세 페이지 댓글 작성
router.post('/writeComment',bookController.post_comment)

// 상세 페이지 댓글 수정
router.patch('/updateComment',bookController.patch_comment);

// 상세페이지 댓글 삭제
router.delete('/deleteComment',bookController.delete_comment);

// 상세페이지 대댓글 작성
router.post('/writeReply',bookController.post_reply);


// 검색 결과 페이지
router.get('/searchList', controller.searchList);

// 검색 결과 -> 특정 책 클릭
router.get('/searchDetail', controller.searchDetail);


// 평가 데이터 렌더(좋아요, 싫어요)
router.get('/ratingData', controller.ratingData);

// 좋아요, 좋아요 취소, 싫어요, 싫어요 취소
router.post('/createLike', controller.createLike);
router.delete('/deleteLike', controller.deleteLike);
router.post('/createBad', controller.createBad); 
router.delete('/deleteBad', controller.deleteBad);

// 유저들이 이 책과 함께 좋아한 다른 책 렌더
router.get('/otherLikes', controller.otherLikes);

// 팔로우 클릭시
router.post('/follow', followController.follow);
router.post('/unfollow', followController.unfollow);

module.exports = router;