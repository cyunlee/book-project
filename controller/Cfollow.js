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
	res.send({result : true});
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

exports.follow_number_get = async (req, res) => {
	let myId = await tokenCheck(req);
	if (req.query.otherId) {
		myId = req.query.otherId;
	}
	let followingNum = 0;
	let followerNum = 0;
	const followingObj = await Following.findAll({where:{u_id : myId}});
	followingObj.forEach(user => {
		followingNum++;
	})
	const followerObj = await Follower.findAll({where:{u_id : myId}});
	followerObj.forEach(user => {
		followerNum++;
	})
	res.send({followingNum : followingNum,  followerNum : followerNum});
}

exports.follow_list_get = async (req, res) => {
	let myId = await tokenCheck(req);
	if (req.query.otherId) {
		myId = req.query.otherId;
	}
	const followingInfos = [];
	const followerInfos = [];
	const followingObj = await Following.findAll({where:{u_id : myId}});
	for (const user of followingObj){
		const temp = await User.findOne({where:{u_id: user.following}})
		followingInfos.push(temp);
	}
	const followerObj = await Follower.findAll({where:{u_id : myId}});
	for (const user of followerObj){
		const temp = await User.findOne({where:{u_id: user.follower}})
		followerInfos.push(temp);
	}
	res.send({followingObj : followingInfos,  followerObj : followerInfos});
}

exports.followBtnCheck = async (req, res) => {
	const myId = await tokenCheck(req);
	const otherId = req.query.otherId;
	if (!myId || (myId == otherId)) {
		res.send({result: false, case: 'guest'})
		return ;
	}
	const check = await Following.findOne({where:{u_id : myId, following: otherId}})
	if (check) {
		res.send({result : true})
	} else {
		res.send({result : false})
	}
}