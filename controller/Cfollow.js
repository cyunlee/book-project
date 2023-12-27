const { Op } = require('sequelize');
const { User, Book, Comment, OtherUser, Following, Follower } = require('../models/index');
const model = require('../models/index');
const axios = require('axios')
const jwt = require('jsonwebtoken');

const jwtSecret = 'kskdajfsalkfj3209243jkwef' // env

const cookieConfig = {
	httpOnly: true,
	maxAge: 300 * 60 * 1000, //300분
}

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

exports.follow = async (req, res) => {
	const myId = await tokenCheck(req);
	const followingId = req.body.followingId;
	console.log(`myId: ${myId}, followingId: ${followingId}`)
	const check = await Following.findOne({where:{u_id : myId, following : followingId}})
	if(!check){
		await Following.create({u_id : myId, following : followingId});
		await Follower.create({u_id : followingId, follower : myId});
	}
}

exports.unfollow = async (req, res) => {
	const myId = await tokenCheck(req);
	const followingId = req.body.followingId;
	console.log(`myId: ${myId}, followingId: ${followingId}`)
	const check = await Following.findOne({where:{u_id : myId, following : followingId}})
	if(check){
	await Following.destroy({where:{u_id : myId, following : followingId}});
	await Follower.destroy({where:{u_id : followingId, follower : myId}});
	}
}