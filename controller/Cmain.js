const fs = require('fs');
const { Op } = require('sequelize');
const { User, Book, Comment } = require('../models/index');
const model = require('../models/index');
const axios = require('axios')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = 'kskdajfsalkfj3209243jkwef' // env

const cookieConfig = {
	httpOnly: true,
	maxAge: 300 * 60 * 1000, //300분
}

const saltRounds = 10;

const tokenCheck = async (req) => {
	const token = req.cookies.jwtCookie;
	if (!token) {
		return false;
	} else {
		const result = jwt.verify(token, jwtSecret);
		const checkID = await User.findOne({
			where: { u_id: result.id }
		})
		if (checkID) {
			return (result.id);
		} else {
			return false;
		}
	}
}


//로그인 성공해서 jwt 갖고있을시 서버에서 토큰을 조회해서 확인되면 user이름 홈화면에 반영되어 렌더되도록.
exports.main = async (req, res) => {
	const tokenId = await tokenCheck(req);
	if (!tokenId) {
		res.render('index', { isLogin: false })
	} else {
		res.render('index', { isLogin: true, id: tokenId });
	}
}

exports.signin = (req, res) => {
	res.render('login');
}

exports.idCheck = async (req, res) => {
	try {
		const id = req.body.u_id;
		const checkID = await User.findOne({
			where: { u_id: id }
		})
		if (id === '') res.send({ result: 'empty' })
		else if (checkID) res.send({ result: true })
		else res.send({ result: false })
	} catch (error) {
		res.send(error);
	}
}

exports.nameCheck = async (req, res) => {
	try {
		const u_name = req.body.u_name;
		const checkName = await User.findOne({
			where: { u_name: u_name }
		})
		if (u_name === '') {
			res.send({ result: 'empty' })
		} else if (checkName) res.send({ result: true })
		else res.send({ result: false })
	} catch (error) {
		res.send(error);
	}
}

exports.logout = (req, res) => {
	// res.clearCookie('jwtCookie').redirect(req.originalUrl);
	res.clearCookie('jwtCookie');
	// 여기에 현재 페이지로 리다이렉트하는 로직 추가
	res.redirect(req.get('referer'));
}

exports.login_post = async (req, res) => {
	try {
		const { id, pw } = req.body;
		const checkID = await User.findOne({
			where: { u_id: id }
		});
		if (!checkID) res.send({ result: false })
		else {
			const checkPW = checkID.dataValues.u_pw;
			// const result = await bcrypt.compare(pw, checkPW);

			if (checkPW !== pw) {
				// (!result) {
				res.send({ result: false })
			}
			else { // 성공시
				const token = jwt.sign({ id: id }, jwtSecret)
				res.cookie('jwtCookie', token, cookieConfig);
				res.send({ result: true });
			}
		}
	} catch (error) {
	res.send(error);
}}


exports.signup_post = async (req, res) => {
	try {
		const { u_name, u_email, u_id, u_pw } = req.body;
		const newname = await User.findOne({
			where: { u_name: u_name }
		});
		const newid = await User.findOne({
			where: { u_id: u_id }
		})
		if (newname) res.send({ result: false, msg: 'name duplicated' })
		else if (newid) res.send({ result: false, msg: 'id duplicated' })
		else {
			// const hash = bcrypt.hashSync(u_pw, saltRounds);
			await User.create({u_name : u_name, u_id : u_id, u_pw: u_pw, u_email : u_email});
			fs.mkdirSync(`./static/img/${u_id}`);
			res.send({result : true});

		}
	} catch (error) {
		res.send(error);
	}
}

exports.signup = (req, res) => {
	res.render('signup');
}

exports.mypage= async (req, res) =>{
	const id = await tokenCheck(req);
	try{
		const userInfo = await User.findOne({
			where: { u_id : id }
		})
		res.render('mypage', {userInfo : userInfo});
	} catch (error) {
		console.log(error);
	}
}

exports.otherpage= (req, res) => {
	res.render('otherpage');
}

exports.viewAll = (req, res) => {
	res.render('viewAll');
}

exports.viewLikes = (req, res) => {
	res.render('viewLikes');
}

exports.viewDislikes = (req, res) => {
	res.render('viewDislikes');
}

exports.upload_post= async (req, res)=>{

	try {
		const tokenId = await tokenCheck(req);

		const path = req.file.path;
		console.log('tokenId > ',tokenId);
		console.log('req.file > ',req.file);
		console.log('req.file.path > ',req.file.path);

		res.send({data:req.file,id:tokenId});
	} catch (error) {
		console.log(error);
		res.send('Internal Server Error!');
	}
	
}

exports.upload_patch=async (req,res)=>{
	try {
		// const path = req.file.path;
		console.log('req.body > ',req.body);
		const uploadProfile = await User.update({
			u_profile:req.body.path,
		},{
			where:{u_id:req.body.id,}
		})
	
		res.send(uploadProfile);
	} catch (error) {
		console.log(error);
		res.send('Internal Server Error!');
	}
}


// 검색 결과

exports.searchList = async (req, res) => {
	console.log('Cmain search req.query >', req.query);
	const query = req.query.title
	const currentPage = req.query.page

	try {
		const searchList = await axios({
			method: 'get',
			url: 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx',
			params: {
				ttbkey: 'ttbclue91204001',
				Query: query,
				QueryType: 'Title',
				Start: currentPage,
				Output: 'JS',
				MaxResults: 20,
				InputEncoding: 'utf-8',
				Cover: 'Big',
				Sort: 'Accuracy',
				Version: 20131101,
			}
		})
		console.log('Cmain search 알라딘 요청 결과 >', searchList.data.totalResults)
		let totalResults = searchList.data.totalResults // 알라딘 api에서 검색 결과 수
		// 알라딘 api에서 검색 결과를 200개 까지만 제공!!!!
		if (!totalResults) {
			totalResults = 0
		} else if (totalResults <= 200) {
			totalResults = totalResults
		} else {
			totalResults = 200
		}
		const totalPages = Math.ceil(totalResults / 20);
		const searchData = searchList.data.item; // 검색 결과 책 데이터
		// console.log('----프론트에서 forEach 돌릴 데이터----', searchData)
		console.log('page 수 >', totalPages);
		res.render('search', { query, searchData, totalPages });
	} catch (err) {
		console.log(err)
	}
}

// 검색 결과 -> 특정 책 클릭
exports.searchDetail = async (req, res) => {
	console.log('hiddenform으로 보내기 >', req.query);
	console.log('token 유무', req.cookies.jwtCookie);
	const query = req.query.isbn
	try {
		const searchDetail = await axios({
			method: 'get',
			url: 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx',
			params: {
				ttbkey: 'ttbclue91204001',
				ItemId: query,
				ItemIdType: 'ISBN',
				Output: 'JS',
				Cover: 'Big',
				Version: 20131101
			}
		})
		console.log('Cmain searchDetail 알라딘 요청 결과 >', searchDetail.data.item)
		const detailData = searchDetail.data.item[0];

		const tokenId = await tokenCheck(req);
		if (!tokenId) {
			res.render('searchDetail', { query, detailData, isLogin: false, id: null });
		} else {
			res.render('searchDetail', { query, detailData, isLogin: true, id: tokenId });
		}

	} catch (err) {
		console.log(err)
	}
}

// 평가 데이터 렌더(좋아요, 싫어요)
exports.ratingData = async (req, res) => {
	console.log('rating query >', req.query);
	const { b_isbn, u_id } = req.query;

	try {
		const result = await Book.findOne({
			attributes: ['b_rating'],
			where: {
				b_isbn: b_isbn, u_id: u_id
			},
			raw: true
		})
		// console.log('Cmain ratingData>', result.b_rating);
		if (!result) {
			res.send('평가하지 않음')
		} else {
			console.log('------이 책에 남긴 평가------', result.b_rating)
			res.send(result.b_rating)
		}
		// console.log(result)
	} catch (error) {
		// 오류 처리
		console.log('--------------')
		console.error(error);
		res.status(500).send('서버 오류');
	}

}

// 좋아요
exports.createLike = async (req, res) => {
	try {
		console.log('좋아요 데이터 전송', req.body);
		const { b_isbn, u_id, b_rating } = req.body;
		// const newBook = 
		await Book.create({
			b_isbn, u_id, b_rating
		})
		// res.send(newBook)
	} catch (err) {
		console.error(err);
		res.send('Internal Server Error!')
	}

}

// 좋아요 취소
exports.deleteLike = async (req, res) => {
	try {
		const { b_isbn, u_id, b_rating } = req.body;
		await Book.destroy({
			where: {
				b_isbn, u_id, b_rating
			}
		})
	} catch (err) {
		console.error(err);
		res.send('Internal Server Error!')
	}
}

// 싫어요
exports.createBad = async (req, res) => {
	try {
		console.log('싫어요 데이터 전송', req.body);
		const { b_isbn, u_id, b_rating } = req.body;
		await Book.create({
			b_isbn, u_id, b_rating
		})
	} catch (err) {
		console.error(err);
		res.send('Internal Server Error!')
	}

}

// 싫어요 취소
exports.deleteBad = async (req, res) => {
	try {
		const { b_isbn, u_id, b_rating } = req.body;
		await Book.destroy({
			where: {
				b_isbn, u_id, b_rating
			}
		})
	} catch (err) {
		console.error(err);
		res.send('Internal Server Error!')
	}
}

// 유저들이 이 책과 함께 좋아한 다른 책 렌더
exports.otherLikes = async (req, res) => {
	console.log('----좋아요 기반 데이터 쿼리----', req.query);
	const { b_isbn, b_rating, u_id } = req.query;
	try {
		const likeUser = await Book.findAll({
			attributes: ['u_id'],
			where: {
				b_isbn, b_rating,
				u_id: {
					[Op.not]: u_id 
				},
			},
			order: model.sequelize.random(),
			limit: 1,
			raw: true,
		})
		console.log('---------findall---------')
		console.log(likeUser[0])
		if (likeUser == '') {
			// res.send('이 책을 좋아한 유저가 없음')
		} else {
			const isbnResult = await Book.findAll({
				attributes: ['b_isbn'],
				where: {
					u_id: likeUser[0].u_id,
					b_rating: 'like',
					b_isbn: {
						[Op.not]: b_isbn
					}
				},
				order: model.sequelize.random(),
				limit: 5,
				raw: true
			})
			// console.log(likeUser[0].u_id)
			// res.send(isbnResult);

			// console.log(isbnResult);
			const isbnList = isbnResult.map(result => result.b_isbn);
			console.log('map 메서드 적용>', isbnList);
			// res.send(isbnList);

			const isbnDetail = isbnList.map(isbn => {
				return axios({
					method: 'get',
					url: 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx',
					params: {
						ttbkey: 'ttbclue91204001',
						ItemId: isbn,
						ItemIdType: 'ISBN',
						Output: 'JS',
						Cover: 'Big',
						Version: 20131101
					}
				});
			});
			// 모든 요청이 완료될 때까지 기다리기
			const isbnDetailResponses = await Promise.all(isbnDetail);
			// console.log('-----await Promise.all------',isbnDetailResponses);

			// 각각의 응답에서 데이터 추출 및 처리
			const bookDetails = isbnDetailResponses.map(response => response.data.item);
			console.log('----bookDetails----',bookDetails); // [[{}], [{}], ...]
			const newData = bookDetails.map(innerArray => innerArray[0]);
			// const newData = bookDetails[0];
			// console.log('--------각각의 알라딘 데이터--------', newData);
			res.send(newData);
		}

	} catch (err) {
		console.log(err)
	}
}
