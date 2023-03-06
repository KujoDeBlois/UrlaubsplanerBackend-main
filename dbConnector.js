const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite:./Urlaubsplaner.db',  { 
  host: 'localhost',
  port: '3000',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
 // storage: 'sqlite:./Urlaubsplaner'
});


module.exports = sequelize;