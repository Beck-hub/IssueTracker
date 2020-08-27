'use strict';

const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const mongodb = require("mongodb");
const mongoose = require('mongoose');
const helmet = require('helmet');

// Require Routes: 
const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

// Send CSS: 
app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

// Add Middleware: 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Prevet XSS attacks: 
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });
  
  app.route('/api/userstories')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/userStories.html');
  });
   
  ///api/userstories
//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
