const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan')
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

const employeesRoutes = require("./routes/employees")
const gamesRoutes = require("./routes/games")
const optionsRoutes = require("./routes/options")
const schedulesRoutes = require("./routes/schedules")


//CONNECT TO DATABASE
mongoose.connect(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true  } )
  .then(() => {
      console.log(`Database connected successfully`)
    })
  .catch(err => console.log(err));

//since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;

app.use(morgan('dev'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());


// Routes which should handle requests
// app.use('/api', routes);
app.use("/employees", employeesRoutes);
app.use("/games", gamesRoutes);
app.use("/options", optionsRoutes);
app.use("/schedules",schedulesRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
  
app.listen(port, () => {
console.log(`Server running on port ${port}`)
});