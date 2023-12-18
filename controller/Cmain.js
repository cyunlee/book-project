const { User } = require('../models/index');

exports.main = (req, res) => {
	res.render('index');
}
exports.signin = (req, res) => {
	res.render('login');
}
exports.signup = (req, res) => {
	res.render('signup');
}
exports.mypage=(req, res)=>{
	res.render('mypage');
}