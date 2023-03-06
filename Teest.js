router.get('/api/userById', async (req, res) => {
    try {
      var userId = req.body.userId;
      console.log("Hier drunter sollte die ID stehebn:")
      console.log(userId);
      var user = await User.findByPk(userId);
      if (!userId) {
        res.status(404).send('Benutzer nicht gefunden');
        return;
      }
      user.dataValues.appointments = [];
      var urlaub = await Urlaub.findAll({ where: { userId: userId } });
      if (urlaub) {
  
        if (user) {
          urlaub.forEach(element => {
            delete element.dataValues.createdAt;
            delete element.dataValues.updatedAt;
            user.dataValues.appointments.push(element.dataValues);
          });
          var data = user.dataValues;
          delete data.passwort;
          res.send({ data });
        }
      } else {
        res.status(404).send('Benutzer hat keinen Urlaub');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('User existiert nicht');
    }
  });















  
/* -------------------------------------------------------------------API/USERTEAM------------------------------------------------------------------------------------*/
router.get('/api/userTeam', async (req, res) => {
    var teamLeiterId = req.body.teamLeiterId;
    var nameArray = [];
    var data = [];
  
  //Die Erweitern siehe ToDO liste
    console.log("Anfrage auf TeamleiterID: " + teamLeiterId);
    const userArray = await User.findAll({
      where: { teamLeiterId: teamLeiterId },
  
    });
  
  
    userArray.forEach(user => {
      data.push(user.dataValues);
      console.log("Die namen der User aus deinem Team: ");
      console.log(data);
    })
    res.send(data);
    console.log(data);
  });
  
  
  