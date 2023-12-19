const { User } = require('../models/index');
const bcrypt = require('bcrypt');

exports.main = (req, res) => {
	res.render('index');
}

exports.signin = (req, res) => {
	res.render('login');
}

exports.signup_post = async (req, res) => {
	try {
		const {u_name, u_email, u_id, u_pw} = req.body;
		// const newname = await User.findOne({
		// 	where: {
		// 		u_name : {u_name}
		// 	} 
		// });
		// console.log('newname > !!!!!', newname);
		// const newid = await User.findOne({
		// 	where: {
		// 		u_id : {u_id}
		// 	}
		// })
		// if (newname) res.send({result: false, msg: 'name duplicated'})
		// else if (newid) res.send({result: false, msg: 'id duplicated'})
		// else {
		const hash = await bcrypt.hash(u_pw, saltRounds);
		await User.create({u_name : u_name, u_id : u_id, u_pw: hash, u_email : u_email});
		res.send({result: true});
		// }
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