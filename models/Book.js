const BookModel = (sequelize,DataTypes)=>{
    const Book = sequelize.define('Book',{
        b_no:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        b_isbn:{
            type:DataTypes.STRING(50),
            allowNull:false
        },
        u_id: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        b_rating: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
    },{
        freezeTableName:true
    });
    return Book;
}

module.exports = BookModel;