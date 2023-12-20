const { User } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const jwtSecret = 'kskdajfsalkfj3209243jkwef' // env

const cookieConfig = {
	httpOnly: true,
	maxAge: 10 * 60 * 1000, //10분
}

const saltRounds = 10;

// 쿠키로 로그인 여부 확인하고 token으로 verify하고
// true면 이후 해당 user_id를 반환,
// 아니면 false 반환 해주는 모듈
// const jwtCheck= (token) => {

// }

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
		const id = req.body;
		const checkID = await User.findOne({
			where: {u_id : id}
		})
		if (checkID) res.send({result: true})
		else res.send({result : false})
	} catch (error) {
		res.send(error);
	}
}

exports.nameCheck = async (req, res) => {
	try {
		const u_name = req.body;
		const checkName = await User.findOne({
			where: {u_name : u_name}
		})
		if (checkName) res.send({result: true})
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
