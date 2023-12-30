// const Sequelize = require('sequelize');
// const config = require('../config/config')['development'];
// const sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     config,
//     )

const model = require('./index');
const User = model.User;
const OtherUser = model.OtherUser;


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
            reference: {
				model: User,
				key: 'u_id',
			},
        },
		follower : {
            type: DataTypes.STRING(30),
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