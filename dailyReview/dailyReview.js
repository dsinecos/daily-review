// For app
var express = require("express");
var bodyparser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require("passport");

// For configuration data
var CONFIG = require('./config.js');

// Starting the app
var app = express();
app.listen(2346);

// Initializing Middleware 
var customValidators = require('./middleware/customValidators.js')
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(expressValidator({
    customValidators: customValidators
}));

app.use(session(CONFIG.sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
require('./middleware/local-authentication.js')(passport);
app.checkAuthentication = require('./middleware/checkAuthentication.js');

// Initializing Routers
require('./api/routes.js')(app);
