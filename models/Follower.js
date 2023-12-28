const Sequelize = require('sequelize');
const config = require(__dirname+'/../config/config.json')['development'];
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
    )
const User = require('./User')(sequelize, Sequelize);
const OtherUser = require('./OtherUser')(sequelize, Sequelize);

const FollowerModel = (sequelize,DataTypes)=>{
    const Follower = sequelize.define('Follower',{
        f_no:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        u_id: {
            type: DataTypes.STRING(30),
            foriegnKey:true,
            reference: {
				model: User,
				key: 'u_id',
			}
        },
		follower : {
            type: DataTypes.STRING(30),
            foriegnKey:true,
            reference: {
				model: OtherUser,
				key: 'u_id'
			}
		}
    },{
        freezeTableName:true
    });
    return Follower;
}

module.exports = FollowerModel;