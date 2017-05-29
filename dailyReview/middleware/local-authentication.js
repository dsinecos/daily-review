var Strategy = require("passport-local").Strategy;
var pg = require('pg');
var bcrypt = require('bcrypt');

// For authentication related database operations 
var connectionString = "pg://admin:guest@localhost:5432/dailyreview";
var authenticationClient = new pg.Client(connectionString);
authenticationClient.connect();

module.exports = function (passport) {

    //Implement data validation using joi

    passport.use(new Strategy(
        function (username, password, cb) {
            //console.log("Inside local strategy");
            //console.log("Value of Variable username " + username);
            //console.log("Value of Variable password " + password);

            findByUsername(username, function (err, user) {
                if (err) { return cb(err); }
                if (!user) { return cb(null, false); }
                
                bcrypt.compare(password, user.password).then(function (result) {
                    if(result) {
                        return cb(null, user);
                    } else {
                        return cb(null, false);
                    }
                }).catch(function(err) {
                    res.status(500).send("Internal server error ");
                    res.end();
                    console.log("Error while using bcrypt to compare the user entered password with the hash in the database. Following is the error");
                    console.log(err);
                });                
            });
        }));

    function findByUsername(username, fn) {
        var sqlQuery = `SELECT *
                    FROM dailyreview_users
                    WHERE user_name=$1`;

        authenticationClient.query(sqlQuery, [username], returnedUsername);
        //console.log("Inside findbyusername");
        function returnedUsername(err, result) {
            //console.log("Inside returnedUsername");
            //console.log("The result from the database is " + JSON.stringify(result.rows[0], null, "  "));
            fn(err, result.rows[0]);
        }
    }

    passport.serializeUser(function (user, cb) {
        //console.log("-----------------------------------------");
        //console.log("Inside serializeUser");
        //console.log("Variables user.id " + user.user_id);
        cb(null, user.user_id);
    });

    passport.deserializeUser(function (id, cb) {
        //console.log("\n");
        //console.log("Inside deserializeUser");
        //console.log("What is the ID " + id);
        //console.log("\n");
        findByID(id, function (err, user) {
            if (err) { return cb(err); }
            cb(null, user);
        });
    });

    function findByID(id, fn) {
        var sqlQuery = `SELECT *
                    FROM dailyreview_users
                    WHERE user_id=$1`;

        authenticationClient.query(sqlQuery, [id], returnedID);
        //console.log("Inside database findbyid");

        function returnedID(err, result) {
            //console.log("Inside function returnedID");
            //console.log("result.rows[0] " + JSON.stringify(result.rows[0], null, "  "));
            fn(err, result.rows[0]);
        }
    }

}

