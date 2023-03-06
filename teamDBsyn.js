const Sequelize = require('sequelize');
const sequelize = require('./dbConnector');
const User = require('./userDBsyn');

// const Team = sequelize.define('Team', {
//   teamId: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     unique: true,
//     autoIncrement: true
//   },
//   teamLeiterId: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: 'User',
//       key: 'userId'
//     }
//   }
// },{
//   tableName: "Team"
// });
// Team.hasMany(User, { foreignKey: 'teamLeiterId' });
// User.belongsTo(Team, { foreignKey: 'teamLeiterId' });

// module.exports = Team;

const Team = sequelize.define('Team', {
  teamId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  teamLeiterId: {
    type: Sequelize.INTEGER
  },
  teamName: {
    type: Sequelize.INTEGER
  }
},{
  tableName: "Team"
});

module.exports = Team;




