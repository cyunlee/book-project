const CommentModel = (sequelize,DataTypes)=>{
    const Comment = sequelize.define('Comment',{
        c_no:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        c_isbn:{
            type:DataTypes.STRING(50),
            allowNull:false
        },
        u_id: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        c_content:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        c_date:{
            type:DataTypes.DATE,
            allowNull:false
        }
    },{
        freezeTableName:true
    });
    return Comment;
}

module.exports = CommentModel;