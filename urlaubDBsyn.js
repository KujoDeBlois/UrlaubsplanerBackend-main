const Sequelize = require('sequelize');
const sequelize = require('./dbConnector');
const User = require('./userDBsyn');

const Urlaub = sequelize.define('Urlaub', {
  urlaubId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
        // This is a reference to another model
        model: User,
  
        // This is the column name of the referenced model
        key: 'userId',
    }
  },
  startDatum: {
    type: Sequelize.STRING
  },
  endDatum: {
    type: Sequelize.STRING
  },
  titel: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING
  },
},{
  tableName: "Urlaub"
});
module.exports = Urlaub;