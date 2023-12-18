const Sequelize = require('sequelize');
const config = require(__dirname+'/../config/config.json')['development'];
const db ={};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
)

// TODO: 모델 모듈 불러오기 
const User = require('./User')(sequelize, Sequelize);
const Comment = require('./Comment')(sequelize,Sequelize);

// TODO: 관계를 정의한 모델들을 db 객체에 저장
db.User = User;
db.Comment = Comment;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;