var express = require("express");
var session = require('express-session');
var passport = require("passport");
var Strategy = require("passport-local").Strategy;
var intermediate = require('connect-pg-simple')(session);
var PostgreSqlStore = new intermediate({
    conString: "pg://postgres:postgres@localhost:5432/testsession",
    pruneSessionInterval: false
});

var app = express();
app.listen(2346);

var pg = require('pg');
var connectionString = "pg://admin:guest@localhost:5432/authentication";
var client = new pg.Client(connectionString);

client.connect();
//client.query("DROP TABLE IF EXISTS authentication");
client.query("CREATE TABLE IF NOT EXISTS authentication(id SERIAL PRIMARY KEY, username varchar(64), password varchar(64))");

app.use(require('body-parser').urlencoded({ extended: true }));
var sessionOptions = {
    secret: "Ghanta secret",
    resave: false,
    saveUninitialized: true,
    name: "cookieDaNaam",
    //store: PostgreSqlStore
};

app.use(session(sessionOptions));


passport.use(new Strategy(
    function (username, password, cb) {
        console.log("Inside local strategy");
        console.log("Value of Variables username " + username);
        console.log("Value of Variables username " + password);
        findByUsername(username, function (err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            console.log("-----------------------------------------");
            console.log("Inside findByUserName");
            console.log("Value of variable username " + username);
            return cb(null, user);
        });
    }));


function findByUsername(username, fn) {
    client.query("SELECT * FROM authentication WHERE username=$1", [username], returnedUsername);
    //console.log("Inside findbyusername");
    function returnedUsername(err, result) {
        fn(err, result.rows[0]);
    }
}

function findByID(id, fn) {
    client.query("SELECT * FROM authentication WHERE id=$1", [id], returnedID);
    console.log("Inside database findbyid");

    function returnedID(err, result) {
        console.log("Inside function returnedID");
        console.log("result.rows[0] " + JSON.stringify(result.rows[0], null, "  "));
        fn(err, result.rows[0]);
    }

}

passport.serializeUser(function (user, cb) {
    console.log("-----------------------------------------");
    console.log("Inside serializeUser");
    console.log("Variables user.id " + user.id);
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    console.log("\n");
    console.log("Inside deserializeUser");
    console.log("What is the ID " + id);
    console.log("\n");
    findByID(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());

app.post('/',
    passport.authenticate('local', { failureRedirect: '/failed' }),
    function (req, res) {
        console.log("Inside successful login");
        res.send("Successfully logged in Hoyeeeee ");

        console.log("req.session.passport.user " + req.session.passport.user);
        console.log("req.user " + JSON.stringify(req.user, null, " "));
    });

app.get('/failed', function(req, res) {
    res.send("Fail ho gaya re babua");
})

app.get('/', function(req, res) {
    res.write("This is to test cookie hacking");
    res.write("This is the name of the user " + JSON.stringify(req.user, null, "  "));
    res.end();

    console.log("This is to test cookie hacking");
    console.log("The username is " + JSON.stringify(req.user, null, "  "));
})
