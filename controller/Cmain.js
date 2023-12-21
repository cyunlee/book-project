const { User } = require('../models/index');
const axios = require('axios')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = 'kskdajfsalkfj3209243jkwef' // env

const cookieConfig = {
	httpOnly: true,
	maxAge: 10 * 60 * 1000, //10분
}

const saltRounds = 10;

const tokenCheck = async (req) => {
	const token = req.cookies.jwtCookie;
	if(!token) {
		return false;
	} else {
		const result = jwt.verify(token, jwtSecret);
		const checkID = await User.findOne({
			where: {u_id : result.id}
		})
		if (checkID){
			return (result.id);
		} else {
			return false;
		}
	}
}


//로그인 성공해서 jwt 갖고있을시 서버에서 토큰을 조회해서 확인되면 user이름 홈화면에 반영되어 렌더되도록.
exports.main = async (req, res) => {
	const tokenId = await tokenCheck(req);
	if(!tokenId) {
		res.render('index', {isLogin : false})
	} else {
		res.render('index', {isLogin : true, id : tokenId});
	}
}

exports.signin = (req, res) => {
	res.render('login');
}

exports.idCheck = async (req, res) => {
	try {
		const id = req.body.u_id;
		const checkID = await User.findOne({
			where: {u_id : id}
		})
		if (id === '') res.send({result: 'empty'})
		else if (checkID) res.send({result: true})
		else res.send({result : false})
	} catch (error) {
		res.send(error);
	}
}

exports.nameCheck = async (req, res) => {
	try {
		const u_name = req.body.u_name;
		const checkName = await User.findOne({
			where: {u_name : u_name}
		})
		if (u_name === '') {
			res.send({result: 'empty'})
		} else if (checkName) res.send({result: true})
		else res.send({result : false})
	} catch (error) {
		res.send(error);
	}
}

exports.logout = (req, res) => {
	res.clearCookie('jwtCookie').redirect('/');
}

exports.login_post = async (req, res) => {
	try {
		const {id, pw} = req.body;
		const checkID = await User.findOne({
			where: { u_id : id} 
		});
		if (!checkID) res.send({result: false})
		else {
			const checkPW = checkID.dataValues.u_pw;
			// const result = await bcrypt.compare(pw, checkPW);
			
			if (checkPW !== pw) {
			// (!result) {
				res.send({result: false})
			}
			else { // 성공시
				const token = jwt.sign({id: id}, jwtSecret)
				res.cookie('jwtCookie', token, cookieConfig);
				res.send({result: true});
			}
		}
	} catch (error) {
		res.send(error);
	}
}

exports.signup_post = async (req, res) => {
	try {
		const {u_name, u_email, u_id, u_pw} = req.body;
		const newname = await User.findOne({
			where: { u_name : u_name} 
		});
		const newid = await User.findOne({
			where: { u_id : u_id }
		})
		if (newname) res.send({result: false, msg: 'name duplicated'})
		else if (newid) res.send({result: false, msg: 'id duplicated'})
		else {
			// const hash = bcrypt.hashSync(u_pw, saltRounds);
			await User.create({u_name : u_name, u_id : u_id, u_pw: u_pw, u_email : u_email});
			res.send({result : true});
		}
	} catch (error) {
		res.send(error);
	}
}

exports.signup = (req, res) => {
	res.render('signup');
}

exports.mypage=(req, res)=>{
	res.render('mypage');
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

exports.searchList = async (req, res) => {
	console.log('Cmain search req.query >' ,req.query);
	const query = req.query.title
	const currentPage = req.query.page

	try{
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
		if(!totalResults) {
			totalResults = 0
		} else if(totalResults <= 200) {
            totalResults = totalResults
        } else {
            totalResults = 200
        }
		const totalPages = Math.ceil(totalResults / 20);
		const searchData = searchList.data.item; // 검색 결과 책 데이터
		console.log('page 수 >', totalPages);
		res.render('search', { query, searchData, totalPages });
	} catch(err) {
		console.log(err)
	}
}

exports.searchDetail = async (req, res) => {
	console.log('hiddenform으로 보내기 >',req.query);
	const query = req.query.isbn
	try{
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
		res.render('searchDetail', {query, detailData});
	} catch(err) {
		console.log(err)
	}
}
