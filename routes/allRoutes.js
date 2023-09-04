const User = require('../userDBsyn');
const Urlaub = require('../urlaubDBsyn');
const Team = require('../teamDBsyn');
const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const auth = require("./auth");



/* -------------------------------------------------------------------API/USERDETAIL------------------------------------------------------------------------------------*/



/*---Login Ablgeich---*/
router.get('/api/userDetail', async (req, res) => {
  var username = req.query.username;
  var userPW = req.query.passwort;
  const user = await User.findOne({where: { username }});
    if (user && (user.dataValues.passwort === userPW)) {
      const token = jwt.sign(
        { user_id: username },
        "secret",
        {
          expiresIn: "9000030ms", 
        }
      );
      // console.log(user);
      user.dataValues.token = token;
      res.send({ "userId": user.dataValues.userId, "token" : user.dataValues.token });
    } else {
      res.status(404).send('Falsches Passwort');
    }
});

/* -------------------------------------------------------------------API/USERBYID------------------------------------------------------------------------------------*/


//Fehler Handling!!!!--------------------------------> sollte Behoben sein

/*---UserDaten im Dashboard Laden--- */
router.get('/api/userById', auth, async (req, res) => {
  try {
    var userId = req.query.userId;
    // console.log("Hier drunter sollte die ID stehebn:")
    // console.log(userId);
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

/* -------------------------------------------------------------------API/URLAUB------------------------------------------------------------------------------------*/


/*---Gebuchter Urlaub wird vom Fontend an das Backend gesendet und in die Datenbank geschrieben--- */
router.post('/api/urlaub', auth, async (req, res) => {
  var data = req.body;
  // console.log(data);
  var newUrlaub = Urlaub.build({
    userId: data['oAppointment[userId]'],
    startDatum: data['oAppointment[start]'],
    endDatum: data['oAppointment[end]'],
    titel: data['oAppointment[title]'],
    status: data['oAppointment[status]']
  });

  newUrlaub.save()
    .then(() => {
      // // console.log('Urlaub wurde gespeichert.');
      res.status(200).send();
    })
});

router.put('/api/urlaub', async (req, res) => {
  Urlaub.update({
    urlaubId: req.body.urlaubId,
    userId: req.body.userId,
    startDatum: req.body.startDatum,
    endDatum: req.body.endDatum,
    titel: req.body.titel,
    status: req.body.status
  },
    { where: { urlaubId: req.body.urlaubId } })
    .then(() => {
      // console.log("Urlaub wurde aktualisiert");
      res.send();
    })
    .catch((error) => {
      console.error(error);
      res.send({ error });
    });
});

//Funktioniert nicht--------------------------------------------------------------------------------------------SOOOOLLLLLLLLLLLLLLTTTEEEEEEEEEEE klappen^^

/*---Ulaub Löschen--- */
router.delete('/api/urlaub', auth, async (req, res) => {
  const { urlaubId, userId } = req.body;
  if (!urlaubId || !userId) {
    return res.status(400).send("Es wurde keine urlaubId oder userId übergeben.");
  }

  try {
    const affectedRows = await Urlaub.update({ userId: null }, { where: { urlaubId } });
    if (affectedRows > 0) {
      await Urlaub.destroy({ where: { userId } });
      res.send(`Urlaub mit urlaubId ${urlaubId} wurde gelöscht.`);
    } else {
      res.status(404).send(`Es wurde kein Urlaub mit urlaubId ${urlaubId} gefunden.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Ein Fehler ist aufgetreten.");
  }
});


/*---GET Urlaub anhand der UserId--- */
router.get('/api/urlaub', auth, async (req, res) => {
  var userId = req.query.userId;
  var data = await Urlaub.findAll({ where: { userId: userId } });
  if (data) {
    res.send({ data });
  } else {
    res.status(404).send('Keine Urlaube gefunden');
  }

});
/* -------------------------------------------------------------------API/User------------------------------------------------------------------------------------*/


/*---GET Alle User aus DB--- */
router.get('/api/user', auth, async (req, res) => {
  const teamArray = await Team.findAll();
  var cleanTeamArray = [];
  teamArray.forEach(team => {
    delete team.dataValues.createdAt;
    delete team.dataValues.updatedAt;
    cleanTeamArray.push(team.dataValues);
  }); 

  var users = await User.findAll();

  users.forEach(user => {
    // // console.log(user);
    var oTeam = cleanTeamArray.find(function (oEntry) {
      return oEntry.teamId === user.dataValues.teamId;
    });
    if(oTeam){
    user.dataValues.teamName = oTeam.teamName;
    }
  });
  if (users) {
    res.send({ users });
    
  }
});


/*---CreateNew User in DB--- */
router.post('/api/user', auth, async (req, res) => {
  console.log("POST auf /api/user");
  console.log(req.body);
  User.sync().then(() => {
    const newUser = User.build({
    username: req.body.username,
    vorname: req.body.vorname,
    nachname: req.body.nachname,
    passwort: "ABC123",
    gesUrlaub: req.body.gesUrlaub,
    role: req.body.role,
    access: req.body.access,
    isAdmin: req.body.isAdmin,
    isManager: req.body.isManager,
    isSupervisor: req.body.isSupervisor,
    isHR: req.body.isHR,
    isEmployee: req.body.isEmployee,
    restUrlaub: req.body.restUrlaub,
    gepUrlaubsTage: req.body.gepUrlaubsTage,
    genUrlaubsTage: req.body.genUrlaubsTage,
    teamId: req.body.teamId,
    note: req.body.note
    })
    newUser.save()
      .then(() => {
        // console.log('User wurde gespeichert.');

      })
      .catch((error) => {
        console.error(error);
        res.send({ error });
      });

    //Zur Kontrolle
    User.findAll().then(user => {

      // console.log(user);
      res.send({ user });
    });
  });
});



/*---Update User in DB--- */
router.put('/api/user', auth, async (req, res) => {
  if(req.body.teamId){
    const team = await Team.findByPk(req.body.teamId);
    if (!team) {
      res.status(400).send('Ungültige teamId');
      return;
    }
  }
  // console.log(req.body);
  const oUser = await User.findByPk(req.body.userId);
  console.log(oUser)
  if(oUser.dataValues.isAdmin === "1"){
    if (!req.body.isAdmin) {
      const adminCount = await User.count({ where: { isAdmin: true } });
      console.log("Es sind derzeit so viele Admins im System:")
      console.log(adminCount)
      if (adminCount <= 2) {
        console.log("Es dürfen nicht weniger als 2 Admins im System sein!")
        return;
      }
    }
  }
  
  // Aktualisiere den User mit den angegebenen Werten
  User.update({
    username: req.body.username,
    vorname: req.body.vorname,
    nachname: req.body.nachname,
    passwort: req.body.passwort,
    gesUrlaub: req.body.gesUrlaub,
    access: req.body.access,
    isAdmin: req.body.isAdmin,
    isManager: req.body.isManager,
    isHR: req.body.isHR,
    isSupervisor: req.body.isSupervisor,
    isEmployee: req.body.isEmployee,
    restUrlaub: req.body.restUrlaub,
    gepUrlaubsTage: req.body.gepUrlaubsTage,
    genUrlaubsTage: req.body.genUrlaubsTage,
    teamId: req.body.teamId,
    note: req.body.note
  },
    { where: { userId: req.body.userId } })
    .then(() => {
      // console.log("User aktualisiert");
      res.status("200").send('OK');
    })
    .catch((error) => {
      console.error(error);
      res.send({ error });
    });
});

//Error mit mismatch auf Team-----------------------Sollte Funktionieren

/*---Mitarbeiter Löschen--- */
router.delete('/api/user', auth, async (req, res) => {
  // console.log(req.body);
  var data = req.body.userId;
  const oUser = await User.findByPk(req.body.userId);
  if (data) {

    console.log(oUser)
    if(oUser.dataValues.isAdmin === "1"){

      const adminCount = await User.count({ where: { isAdmin: true } });
      console.log("Es sind derzeit so viele Admins im System:")
      console.log(adminCount)
      if (adminCount <= 2) {
        console.log("Es dürfen nicht weniger als 2 Admins im System sein!");
        return;
      } else {

        console.log("norm del2")
        await Urlaub.destroy({ where: { userId : data } });
        await User.destroy({
        where: { userId: req.body.userId }
    })

      }
  } else {
  
    
    console.log("norm del")
    await Urlaub.destroy({ where: { userId : data } });
    await User.destroy({
      where: { userId: req.body.userId }
    })
    
    res.send("Mitarbeiter wurde gelöscht.")
  }
  }
});

/* -------------------------------------------------------------------API/TEAMURLAUB------------------------------------------------------------------------------------*/

router.get('/api/urlaubTeam', auth, async (req, res) => {
  var teamLeiterId = req.query.teamLeiterId;
  var userIdArray = [];
  var data = [];
  var userArrayClean =  [];
  // console.log("Anfrage auf TeamleiterID: " + teamLeiterId);
  
  const TeamObject = await Team.findAll({
    where: { teamLeiterId: teamLeiterId },
  })
  if(TeamObject){
    // JOIN-Abfrage, um alle Benutzer und Urlaube zu finden, die mit der übergebenen "teamLeiterId" verknüpft sind
    const userArray = await User.findAll({
      where: { teamId: TeamObject[0].dataValues.teamId },
    });
    userArray.forEach(user => {
      userIdArray.push(user.dataValues.userId);
      userArrayClean.push(user.dataValues)
    })
    var urlaubsArray = await Urlaub.findAll({ where: { userId: userIdArray } });
    if (urlaubsArray) {
      urlaubsArray.forEach(urlaub => {
        var oEntry = userArrayClean.find(function (oEntry) {
          return oEntry.userId === urlaub.dataValues.userId;
        });
        urlaub.dataValues.vorname = oEntry.vorname;
        urlaub.dataValues.nachname = oEntry.nachname;
        urlaub.dataValues.restUrlaub = oEntry.restUrlaub;
        urlaub.dataValues.gepUrlaubsTage = oEntry.gepUrlaubsTage;
        data.push(urlaub.dataValues);
      });
      res.send(data);
    } else {
      res.send("Fehler beim Laden der Urlaubsdaten");
    }
  }else{
    res.status(404).send({ message: "Keine Team zur Teamleiter id gefunden" });
  }
});


/* -------------------------------------------------------------------API/USERTEAM------------------------------------------------------------------------------------*/
router.get('/api/userTeam', auth, async (req, res) => {
  // console.log(req.query);
  var teamLeiterId = req.query.teamLeiterId;
  var data = [];

  
  const TeamObject = await Team.findAll({
    where: { teamLeiterId: teamLeiterId },
  })
  if(TeamObject[0]){
    const userArray = await User.findAll({
      where: { teamId: TeamObject[0].dataValues.teamId },
    });
  
    if (userArray) {
      for (let i = 0; i < userArray.length; i++) {
        const user = userArray[i];
        const userData = user.dataValues;
        delete userData.createdAt;
        delete userData.updatedAt;
        userData.appointments = [];
        const urlaub = await Urlaub.findAll({
          where: { userId: userData.userId }
        });
  
        if (urlaub && urlaub.length > 0) {
          urlaub.forEach(element => {
            delete element.dataValues.createdAt;
            delete element.dataValues.updatedAt;
            userData.appointments.push(element.dataValues);
          });
        }
  
        delete userData.passwort;
        data.push(userData);
      }
  
      res.send({ data });
    } else {
      res.status(404).send({ message: "Keine Benutzer gefunden" });
    }
  }else{
    res.status(404).send({ message: "Keine Team zur Teamleiter id gefunden" });
  }
 
});








router.put('/api/Team', auth, async (req, res) => {
  // Überprüfen, ob die angegebene teamId in der Team Tabelle vorhanden ist
  // console.log("PUT METHODE");
  if(req.body.teamId){
    const team = await Team.findByPk(req.body.teamId);
    if (!team) {
      res.status(400).send('Ungültige teamId');
      return;
    }
  }
  // Aktualisiere das Team mit den angegebenen Werten
  Team.update({
    teamLeiterId: req.body.teamLeiterId,
    teamName: req.body.teamName,
    teamId: req.body.teamId
  },
    { where: { teamId: req.body.teamId } })
    .then(() => {
      // console.log("Team aktualisiert");
      res.status("200").send('OK');
    })
    .catch((error) => {
      console.error(error);
      res.send({ error });
    });
});


/*---Create Team in DB--- */
router.post('/api/Team', auth, async (req, res) => {
  Team.sync().then(() => {
    const newTeam = Team.build({
      teamLeiterId: req.body.teamLeiterId,
      teamName: req.body.teamName

    })
    newTeam.save()
      .then(() => {
        // console.log('Team wurde gespeichert.');

      })
      .catch((error) => {
        // console.error(error);
        res.send({ error });
      });


    Team.findAll().then(team => {

      //// console.log(team);
      res.send({ team });
    });
  });
});

/*---Team Löschen--- */
router.delete('/api/Team', auth, async (req, res) => {
  const { teamId } = req.body;
  // console.log(teamId)
  // console.log("flubberwurst")
  if (!teamId) {
    return res.status(400).send("Es wurde keine teamId übergeben.");
  }

  try {
    const affectedRows = await User.update({ teamId: null }, { where: { teamId } });
    try {
      await Team.destroy({ where: { teamId } });
      res.send(`Team mit teamId ${teamId} wurde gelöscht.`);
      
    } catch (err) {
      console.error(err);
      res.status(404).send(`Es wurde kein Team mit teamId ${teamId} gefunden.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Ein Fehler ist aufgetreten.");
  }
});



router.get("/api/Team", auth, async (req, res) =>{
  const teamArray = await Team.findAll();
  var cleanTeamArray = [];
  teamArray.forEach(team => {
    delete team.dataValues.createdAt;
    delete team.dataValues.updatedAt;
    cleanTeamArray.push(team.dataValues);

  }); 
  res.send(cleanTeamArray);
})

















module.exports = router;