const Sequelize = require('sequelize');
const config = require(__dirname+'/../config/config.json')['development'];
const db ={};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
    )

// TODO: 모델 모듈 불러오기 
const User = require('./User')(sequelize, Sequelize);
const Comment = require('./Comment')(sequelize,Sequelize);
const Book = require('./Book')(sequelize,Sequelize);

// 유저와 댓글 1:다 설정
User.hasMany(Comment, {
    foreignKey: 'u_id',  // Comment 테이블의 외래 키
    sourceKey: 'u_id'    // User 테이블의 소스 키
});

Comment.belongsTo(User, {
    foreignKey: 'u_id',  // Comment 테이블의 외래 키
    targetKey: 'u_id'    // User 테이블의 타겟 키
});

// User : Book = 1 : N
User.hasMany(Book, {
    foreignKey: 'u_id',
    sourceKey: 'u_id'
})
Book.belongsTo(User,{
    foreignKey: 'u_id',
    sourceKey: 'u_id'
})


// TODO: 관계를 정의한 모델들을 db 객체에 저장
db.User = User;
db.Comment = Comment;
db.Book = Book;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;