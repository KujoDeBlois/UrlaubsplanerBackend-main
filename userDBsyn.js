const Sequelize = require('sequelize');
const sequelize = require('./dbConnector');


const User = sequelize.define('User', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  vorname: {
    type: Sequelize.STRING
  },
  username: {
    type: Sequelize.STRING
  },
  note: {
    type: Sequelize.STRING
  },
  nachname: {
    type: Sequelize.STRING
  },
  isAdmin: {
    type: Sequelize.BOOLEAN
  },
  access: {
    type: Sequelize.INTEGER
  },
  isHR: {
    type: Sequelize.BOOLEAN
  },
  isSupervisor: {
    type: Sequelize.BOOLEAN
  },
  isEmployee: {
    type: Sequelize.BOOLEAN
  },
  passwort: {
    type: Sequelize.STRING
  },
  gesUrlaub: {
    type: Sequelize.INTEGER
  },
  role: {
    type: Sequelize.STRING
  },
  restUrlaub: {
    type: Sequelize.INTEGER
  },
  gepUrlaubsTage: {
    type: Sequelize.INTEGER
  },
  genUrlaubsTage: {
    type: Sequelize.INTEGER
  },
  token: {
    type: Sequelize.STRING
  },
  teamId: {
    type: Sequelize.INTEGER,
   references: {
      model: 'Team',
      key: 'teamId'
    }
  }
},{
  tableName: "User"
});

module.exports = User;

