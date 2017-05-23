var express = require("express");
var bodyparser = require('body-parser');
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
var authenticationClient = new pg.Client(connectionString);

authenticationClient.connect();
//authenticationClient.query("DROP TABLE IF EXISTS authentication");
authenticationClient.query("CREATE TABLE IF NOT EXISTS authentication(id SERIAL PRIMARY KEY, username varchar(64), password varchar(64))");

var connectionString = "pg://admin:guest@localhost:5432/dailyreview";
var pgp = require('pg-promise')();
var dailyReviewClient = pgp(connectionString);

app.use(require('body-parser').urlencoded({ extended: true }));
var sessionOptions = {
    secret: "Ghanta secret",
    resave: false,
    saveUninitialized: true,
    name: "cookieDaNaam",
    store: PostgreSqlStore
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
    authenticationClient.query("SELECT * FROM authentication WHERE username=$1", [username], returnedUsername);
    //console.log("Inside findbyusername");
    function returnedUsername(err, result) {
        fn(err, result.rows[0]);
    }
}

function findByID(id, fn) {
    authenticationClient.query("SELECT * FROM authentication WHERE id=$1", [id], returnedID);
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
        //res.send("Successfully logged in Hoyeeeee ");
        res.redirect('/successLogin');

        console.log("req.session.passport.user " + req.session.passport.user);
        console.log("req.user " + JSON.stringify(req.user, null, " "));
    });

app.get('/failed', function (req, res) {
    res.send("Fail ho gaya re babua");
})

app.get('/', function (req, res) {
    res.write("This is to test cookie hacking");
    res.write("This is the name of the currently logged in user " + JSON.stringify(req.user, null, "  "));
    res.end();

    console.log("This is to test cookie hacking");
    console.log("The username is " + JSON.stringify(req.user, null, "  "));
})

app.get('/successLogin', checkAuthentication, function (req, res) {
    res.write("Oh Yeaaah, you've successfully logged in");
    res.end();

    console.log("\n");
    console.log("Logged in successfully");
});

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        //res.write(JSON.stringify(req.user, null, "  "));
        //res.end();
        next();
    } else {
        res.send("You Jackass !!!! You gotta login first nigga");
        //res.send(JSON.stringify(req.user, null, "  "));
        res.end();
        console.log("Dumbass was trying to get in without logging in");
    }

}

app.post('/addCategory', checkAuthentication, function(req, res) {
    //Name of the fields is categoryName and categoryLabel
    //res.write(req.body.categoryName);
    //res.write(req.body.categoryLabel);
    //res.write("We got this nigga");
    //res.write(" " + JSON.stringify(req.user, null, " "));
    //res.end();
    dailyReviewClient.query("INSERT INTO dailyreview_category (user_id, category_name, category_label) VALUES ($1, $2, $3)", [req.user.id, req.body.categoryName, req.body.categoryLabel]).then(function(data) {
        console.log("Successfully data chala gaya database mein, hoyee");
        res.send("Successfully data chala gaya database mein, hoyee");
    }).catch(function(error) {
        console.log("Error ho gaya bhaiya ji database mein data daalne mein");
        res.send("Error ho gaya bhaiya ji database mein data daalne mein")
    });
});

app.get('/getCategory', checkAuthentication, function(req, res) {
    // Get all categories from the database corresponding to the user id
    dailyReviewClient.query("SELECT * FROM dailyreview_category WHERE user_id=$1", [req.user.id]).then(function(data) {
        res.send(JSON.stringify(data, null, "  "));
    }).catch(function(error) {
        res.send(error);
        console.log("Error ho gaya bhaiyaji database dekhne mein, kiya karein ab");
    });
});

app.post('/editCategory', checkAuthentication, function(req, res){
    //Name of fields is categoryNameOld, categoryNameNew, categoryLabelNew
    dailyReviewClient.query("UPDATE dailyreview_category SET category_name=$1, category_label=$2 WHERE category_name=$3 AND user_id=$4", [req.body.categoryNameNew, req.body.categoryLabelNew, req.body.categoryNameOld, req.user.id]).then(function(data) {
        res.send("Ho gaya bhai update");
        res.end();
    });
    
});

app.post('/deleteCategory', checkAuthentication, function(req, res) {
    // Name of fields is categoryName
    dailyReviewClient.query("DELETE FROM dailyreview_category WHERE category_name=$1 AND user_id=$2", [req.body.categoryName, req.user.id]).then(function(data) {
        res.send("Ho gaya bhai delete, khush ho ja");
        res.end();
    });
});

app.post('/reviewDay', checkAuthentication, function(req, res) {
    // Fields to be provided date, category, score 
    // Can be any number of categories and equal number of scores
    // How to get an array in a query string?
    // How to get an array in the body of a post request

    console.log(req.body.categoryName);
    console.log(req.body.categoryScore);
    console.log(req.user.id)
    console.log(req.body.date);

    // How to enter all this data into the respective table in the database
    // Insert user_id and date into userdate table
    // Get category_id using the categoryName from category table
    // Get userdate_id using user.id and body.date from userdate
    // Merge the two arrays of category names and scores - How?
    // Insert userdate_id, category_id and score into score table

    dailyReviewClient.query("INSERT INTO dailyreview_userdate (user_id, dateentry) VALUES ($1, $2)", [req.user.id, req.body.date]).then(function() {
        dailyReviewClient.query("SELECT userdate_id FROM dailyreview_userdate WHERE user_id=$1 AND dateentry=$2", [req.user.id, req.body.date]).then(function(dataForID){
            console.log(dataForID[0]["userdate_id"]);
            //console.log("reformed userdateid " + userdate_id.userdate_id);
            for(var i=0; i < req.body.categoryName.length; i++) {
                let count = i;
                dailyReviewClient.query("SELECT category_id FROM dailyreview_category WHERE category_name=$1", [req.body.categoryName[count]]).then(function(category_id) {
                    console.log("Value of count " + count);
                    console.log("req.body.categoryScore " + req.body.categoryScore[count]);
                    dailyReviewClient.query("INSERT INTO dailyreview_score (userdate_id, category_id, score) VALUES ($1, $2, $3)", [dataForID[0]["userdate_id"], category_id[0]["category_id"], req.body.categoryScore[count]]);
                });
            }
            res.send("Bhai lagta hai process hogaya score sab, check karo database mein toh ek baar");
            res.end();
        });
    });
});

app.get('/getReview', checkAuthentication, function(req, res) {
    // Use params to get the date
    // Write the SQL query to regenerate the categories for a date and the corresponding scores
    var date = req.query.date;

    dailyReviewClient.query("SELECT dailyreview_users.user_name as User, dailyreview_category.category_name as Category, dailyreview_userdate.dateentry as DataEntry, dailyreview_score.score as Score FROM dailyreview_users JOIN dailyreview_userdate ON (dailyreview_users.user_id = dailyreview_userdate.user_id) JOIN dailyreview_score ON (dailyreview_userdate.userdate_id = dailyreview_score.userdate_id) JOIN dailyreview_category ON (dailyreview_score.category_id = dailyreview_category.category_id) WHERE dailyreview_users.user_id=$1 AND dailyreview_userdate.dateentry=$2", [req.user.id, date]).then(function(data) {
        res.send(JSON.stringify(data, null, "  "));
    });

});

app.post('/addJournalQuestion', checkAuthentication, function(req, res) {

});

app.post('/addJournalReview', checkAuthentication, function(req, res) {

});

app.get('/getJournalReview', checkAuthentication, function(req, res) {

});
