const LifeBookModel = (sequelize,DataTypes)=>{
    const LifeBook = sequelize.define('LifeBook',{
        l_no:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        l_isbn:{
            type:DataTypes.STRING(50),
            allowNull:false
        },
        l_cover:{
            type:DataTypes.STRING(500),
            allowNull:false
        },
        u_id: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        l_ranking: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },{
        freezeTableName:true
    });
    return LifeBook;
}

module.exports = LifeBookModel;