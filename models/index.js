const Sequelize = require('sequelize');
const config = require(__dirname+'/../config/config.json')[process.env.NODE_ENV || 'development'];
const db ={};

config.username = process.env.DB_USERNAME || config.username;
config.password = process.env.DB_PASSWORD || config.password;
config.database = process.env.DB_DATABASE || config.database;
config.host = process.env.DB_HOST || config.host;

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
const LifeBook = require('./LifeBook')(sequelize,Sequelize);
const OtherUser = require('./OtherUser')(sequelize, Sequelize);
const Follower = require('./Follower')(sequelize,Sequelize)
const Following = require('./Following')(sequelize,Sequelize)
// 유저자신과 상대의 다:다 설정(팔로우)
Follower.belongsTo(User, {
    foreignKey: 'u_id', // Follower의 u_id 외래키를 생성한다.
    targetKey: 'u_id' // User의 u_id를 참조하는.
})

Follower.belongsTo(OtherUser, {
    foreignKey: 'follower',
    targetKey: 'u_id'
})

User.belongsToMany(OtherUser, {
    through: Follower,
    as: 'UsersFollwer',
    foreignKey: 'u_id', // Follower의 외래키 u_id는 
    sourceKey: 'u_id', // User의 u_id를 source로 참조한다.
    onDelete:'CASCADE',
    onUpdate:'CASCADE', 
});

OtherUser.belongsToMany(User, {
    through: Follower,
    foreignKey: 'follower',
    sourceKey: 'u_id',
});

// 유저자신과 상대의 다:다 설정(팔로잉)
Following.belongsTo(User, {
    foreignKey: 'u_id', // Following의 u_id 외래키를 생성한다.
    targetKey: 'u_id' // User의 u_id를 참조하는.
})

Following.belongsTo(OtherUser, {
    foreignKey: 'following',
    targetKey: 'u_id'
})

User.belongsToMany(OtherUser, {
    through: Following,
    as: 'UsersFollwings',
    foreignKey: 'u_id', // Following의 외래키 u_id는 
    sourceKey: 'u_id', // User의 u_id를 source로 참조한다.
    onDelete:'CASCADE',
    onUpdate:'CASCADE', 
});


OtherUser.belongsToMany(User, {
    through: Following,
    foreignKey: 'following',
    sourceKey: 'u_id',
});


// 유저와 댓글 1:다 설정
User.hasMany(Comment, {
    foreignKey: 'u_id',  // Comment 테이블의 외래 키
    sourceKey: 'u_id',    // User 테이블의 소스 키
    onDelete:'CASCADE',
    onUpdate:'CASCADE',     
});

Comment.belongsTo(User, {
    foreignKey: 'u_id',  // Comment 테이블의 외래 키
    targetKey: 'u_id'    // User 테이블의 타겟 키
});

// 유저와 인생작 1:다 설정
User.hasMany(LifeBook, {
    foreignKey: 'u_id',  
    sourceKey: 'u_id',    
    onDelete:'CASCADE',
    onUpdate:'CASCADE',     
});

LifeBook.belongsTo(User, {
    foreignKey: 'u_id',  
    targetKey: 'u_id' 
});


Comment.hasMany(Comment, {
    foreignKey: 'parent_c_no', // 대댓글의 경우 부모 댓글의 c_no를 참조
    as: 'replies', // 대댓글을 replies로 지칭
    onDelete:'CASCADE',
    onUpdate:'CASCADE',     
});

Comment.belongsTo(Comment, {
    foreignKey: 'parent_c_no', // 대댓글의 경우 부모 댓글의 c_no를 참조
    as: 'parentComment' // 대댓글을 parentComment로 지칭
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
db.LifeBook = LifeBook;
db.OtherUser = OtherUser;
db.Follower = Follower;
db.Following = Following;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;