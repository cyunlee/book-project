const UserModel = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        u_no: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        u_id: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        u_pw: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        u_name: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
		u_email: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
		u_profile: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
    }, {
        freezeTableName: true
    });
    return User;
}

module.exports = UserModel;