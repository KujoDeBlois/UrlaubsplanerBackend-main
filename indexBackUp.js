

const express = require('express');
const User = require('./userDBsyn');
const bodyParser = require('body-parser');
const expressMetadata = require('express-metadata');

const cors = require('cors');


const app = express();
app.use(cors());


// app.options('*', (req, res) => {
//   res.set('Access-Control-Allow-Origin', '*');
//   res.send('ok');
// });

// app.use((req, res) => {
//   res.set('Access-Control-Allow-Origin', '*');
// });

const router = express.Router();

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });


// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

//Metadaten erstellen
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
 
// app.use(expressMetadata());

// Define a route
// router.get('/api/users', (req, res) => {
//   User.findAll().then(user => {

//     console.log(user);
//   });
// });

module.exports = router;

// User.sync().then(() => {
//   console.log("User table created");
// //create a new user instance
// const newUser = User.build({
//   userId: 2,
//   vorname: 'Susi',
//   nachname: 'Much',
//   passwort: "321",
//   gesUrlaub: 30,
//   role: "Admin",
//   restUrlaub: 20,
//   gepUrlaubsTage: 10,
//   genUrlaubsTage: 3


// });

// //save the user to the database
// newUser.save()
//   .then(() => {
//     console.log('User has been saved.');
//   })
//   .catch((error) => {
//     console.error(error);
//   });
//   User.findAll().then(user => {

//     console.log(user);
//   });
// });

//Routen

app.get('/api/users', (req, res) => {
  User.findAll().then(user => {

    console.log(user);
    res.send(user);
  });

});

app.get("/api/$metadata", (req, res) => {
  res.type("application/xml");
  res.sendFile(`${__dirname}/metadata.xml`);
});











app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});






/* ----------------------------------- Metadata via XML erstellt

const express = require("express");
const User = require("./userDBsyn");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const router = express.Router();

// Nutze den body-parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Definiere die Metadaten
const metadata = {
  users: {
    fields: ['userId', 'vorname', 'nachname','passwort', 'gesUrlaub', 'createdAt', 'updatedAt','role', 'restUrlaub','gepUrlaubsTage','genUrlaubsTage']
  }
};

// Funktion zur Erstellung der metadata.xml Datei
const createMetadataXML = (metadata) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
    <edmx:DataServices>
      <Schema xmlns="http://docs.oasis-open.org/odata/ns/edm" Namespace="default">
        <EntityType Name="users">
          <Key>
            <PropertyRef Name="userId"/>
          </Key>
          <Property Name="userId" Type="Edm.Int32/>
          <Property Name="vorname" Type="Edm.String"/>
          <Property Name="nachname" Type="Edm.String"/>
          <Property Name="passwort" Type="Edm.String"/>
          <Property Name="gesUrlaub" Type="Edm.Int32"/>
          <Property Name="createdAt" Type="Edm.DateTimeOffset"/>
          <Property Name="updatedAt" Type="Edm.DateTimeOffset"/>
          <Property Name="role" Type="Edm.String"/>
          <Property Name="restUrlaub" Type="Edm.Int32"/>
          <Property Name="gepUrlaubsTage" Type="Edm.Int32"/>
          <Property Name="genUrlaubsTage" Type="Edm.Int32"/>
        </EntityType>
      </Schema>
    </edmx:DataServices>
  </edmx:Edmx>`;

  // Speichere die metadata.xml Datei
  fs.writeFileSync("metadata.xml", xml);
};

// Rufe die Funktion createMetadataXML beim Start des Servers auf
createMetadataXML();

app.get("/api/users", (req, res) => {
  User.findAll().then((user) => {
    console.log(user);
    res.send(user);
  });
});

app.get("/api/metadata", (req, res) => {
  res.type("application/xml");
  res.sendFile(`${__dirname}/metadata.xml`);
});

app.listen(3000, () => {
  console.log("Example app listening on port 8080!");
});

*/


/* -------------------------------------------------------------------- Express-Metadata Versuch 2.      Es gibt keine Biblo?



const express = require('express');
const User = require('./userDBsyn');
const bodyParser = require('body-parser');
const expressMetadata = require('express-metadata');

const app = express();
const router = express.Router();

// Nutzen Sie die express-metadata Middleware
app.use(expressMetadata());


// Metadaten erstellen
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Funktion zur Erstellung der Metadaten
const createMetadata = async () => {
  try {
    const users = await User.findAll();
    // Nutzen Sie die Informationen aus der Datenbank, um die Metadaten zu erstellen
    // ...
    // Speichern Sie die Metadaten in einer Variablen
    const metadata = app._metadata;
    return metadata;
  } catch (error) {
    console.error(error);
    debugger;

  }
};

// Beim Login aufrufen
app.use(async (req, res, next) => {
  req.metadata = await createMetadata();
  next();
});

app.get('/api/users', (req, res) => {
  User.findAll().then(user => {
    console.log(user);
    res.send(user);
  });
});

app.get('/api/$metadata', (req, res) => {
  res.type('application/xml');
  res.send(req.metadata);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});





*/



/*

----------------------------------------------------Express-Metadata Versuch 1.

const express = require('express');
const User = require('./userDBsyn');
const bodyParser = require('body-parser');
const expressMetadata = require('express-metadata');


const app = express();

const router = express.Router();


//Metadaten erstellen
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
 debugger;
// app.use(expressMetadata());

// Define a route
// router.get('/api/users', (req, res) => {
//   User.findAll().then(user => {

//     console.log(user);
//   });
// });

module.exports = router;

// User.sync().then(() => {
//   console.log("User table created");
// //create a new user instance
// const newUser = User.build({
//   userId: 2,
//   vorname: 'Susi',
//   nachname: 'Much',
//   passwort: "321",
//   gesUrlaub: 30,
//   role: "Admin",
//   restUrlaub: 20,
//   gepUrlaubsTage: 10,
//   genUrlaubsTage: 3


// });

// //save the user to the database
// newUser.save()
//   .then(() => {
//     console.log('User has been saved.');
//   })
//   .catch((error) => {
//     console.error(error);
//   });
//   User.findAll().then(user => {

//     console.log(user);
//   });
// });

//Routen

app.get('/api/users', (req, res) => {
  User.findAll().then(user => {

    console.log(user);
    res.send(user);
  });

});

app.get('/api/$metadata', (req, res) => {
  res.type('application/xml');
  res.send(req.metadata);
});










app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
*/
