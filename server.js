require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const path = require('path');
const connectDB = require("./config/db");
global.__basedir = __dirname;


var corsOptions = {
    origin: "*",
};

// Connect to Database
connectDB();

app.use(cors(corsOptions));

app.use(express.static('./public'));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Inclide main view path for (admin) //
app.locals.module_directory = '../../../../app/modules/';

app.get("/", (req, res) => {
  console.log(__dirname);
  res.json({ message: "Welcome to image management application." });
});

app.use('/static', express.static(path.join(__dirname, 'public')))
require("./app/routes/image.routes")(app);
require("./app/routes/user.routes")(app);


// mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("DB Connected Successfully");
//         console.log("CONNECTION OPEN");
//     })
//     .catch(err => {
//         console.log("OH NO ERROR");
//         console.log(err);
//     })

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}.`);
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});
