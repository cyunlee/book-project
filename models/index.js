const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config.json')['development'];
const db = {};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

const User = require('./User')(sequelize, Sequelize);


db.User = User;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;