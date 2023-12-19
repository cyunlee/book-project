const { User } = require('../models/index');
const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.main = (req, res) => {
	res.render('index');
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
		console.log('check!!!!!!!!!!!', name);
		const checkName = await User.findOne({
			where: {u_name : u_name}
		})
		if (checkName) res.send({result: true})
		else res.send({result : false})
	} catch (error) {
		res.send(error);
	}
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
			else {
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
		console.log('check!!!>' , newname);
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
