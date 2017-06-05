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

// To allow cross-origin resource sharing
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'null');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    //res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.use(allowCrossDomain);

// Initializing Routers
require('./api/routes.js')(app);

app.use(require('./middleware/errorHandler.js'));
