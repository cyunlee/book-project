const OtherUserModel = (sequelize, DataTypes) => {
    const OtherUser = sequelize.define('OtherUser', {
        u_no: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        u_id: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        }
    }, {
        freezeTableName: true
    });
    return OtherUser;
}

module.exports = OtherUserModel;