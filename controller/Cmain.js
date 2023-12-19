const { User } = require('../models/index');
const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.main = (req, res) => {
	res.render('index');
}

exports.signin = (req, res) => {
	res.render('login');
}

exports.signup_post = async (req, res) => {
	try {
		const {u_name, u_email, u_id, u_pw} = req.body;
		console.log('check!!!')
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
