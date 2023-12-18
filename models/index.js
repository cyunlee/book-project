const Sequelize = require('sequelize');
const config = require(__dirname+'/../config/config.json')['development'];

const db ={};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
)
// 왜 config 전체 다 넣어줄건데 일일히 해주는거임?

// TODO: 모델 모듈 불러오기 
const Comment = require('./Comment')(sequelize,Sequelize);

// TODO: 관계를 정의한 모델들을 db 객체에 저장

db.Comment = Comment;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;