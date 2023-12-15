const { User } = require('../models/index');

exports.main = (req, res) => {
	res.render('/');
}
exports.login = (req, res) => {
	res.render('login');
}
exports.main = (req, res) => {
	res.render('signup');
}