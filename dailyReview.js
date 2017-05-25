// Importing relevant modules

// For app
var express = require("express");
var bodyparser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');

// For authentication
var passport = require("passport");
var Strategy = require("passport-local").Strategy;

// For PostgreSQL database operations (promise and non-promise based)
var pg = require('pg');
var pgp = require('pg-promise')();

// Initializing connection to the required databases
// For storing express-session data 
var connectPgSimple = require('connect-pg-simple')(session);
var PostgreSqlStore = new connectPgSimple({
    //conString: "pg://postgres:postgres@localhost:5432/testsession",
    conString: "pg://admin:guest@localhost:5432/dailyreview",
    tableName: "dailyreview_session",
    pruneSessionInterval: false,
});

// For authentication related database operations 
var connectionString = "pg://admin:guest@localhost:5432/dailyreview";
var authenticationClient = new pg.Client(connectionString);
authenticationClient.connect();


// For promise based database operations for the app
var connectionString = "pg://admin:guest@localhost:5432/dailyreview";
var dailyReviewClient = pgp(connectionString);

// Starting the app
var app = express();
app.listen(2346);

// Middleware 
// For parsing the body of the request
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(expressValidator());

// For setting up user sessions
var sessionOptions = {
    secret: "Ghanta secret",
    resave: false,
    saveUninitialized: true,
    name: "cookieDaNaam",
    store: PostgreSqlStore
};
app.use(session(sessionOptions));

// Authentication middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy(
    function (username, password, cb) {
        //console.log("Inside local strategy");
        //console.log("Value of Variable username " + username);
        //console.log("Value of Variable password " + password);

        findByUsername(username, function (err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            //console.log("-----------------------------------------");
            //console.log("Inside findByUserName");
            //console.log("Value of variable username " + username);
            //console.log(" " + JSON.stringify(user, null, "  "));
            return cb(null, user);
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

// Middleware for checking if the current user is already logged in
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        //res.write(JSON.stringify(req.user, null, "  "));
        //res.end();
        next();
    } else {
        res.send("You aren't logged in, you need to log in first");
        //res.send(JSON.stringify(req.user, null, "  "));
        res.end();
    }

}

// Routers
// Router for Login/ Authentication
app.post('/', passport.authenticate('local', { failureRedirect: '/failed' }), function (req, res) {
    //res.send("Successfully logged in Hoyeeeee ");
    res.redirect('/successLogin');
});

// Routers for Authentication Testing using Postman
// For Testing Failed Authentication
app.get('/failed', function (req, res) {
    res.send("Login Failed, Try again");
})

// Router for successful login
// For Testing successful login
app.get('/successLogin', checkAuthentication, function (req, res) {
    res.write("Logged in successfully \n");
    var userData = JSON.stringify(req.user, null, "  ");
    //res.write("This is the name of the currently logged in user " + userData);
    res.write(userData);
    res.end();
});

// Router for successive requests to test if the user is logged in and send him his user details
// For Testing successive requests from a logged in user
app.get('/', checkAuthentication, function (req, res) {
    res.write("For Testing successive requests from a logged in user \n");
    res.write("This is the name of the currently logged in user " + JSON.stringify(req.user, null, "  "));
    res.end();
});

// Router for signup
app.post('/signup', function (req, res) {
    var sqlQuery = `INSERT
                    INTO dailyreview_users (user_name, password)
                    VALUES ($1, $2)`;

    dailyReviewClient.query(sqlQuery, [req.body.username, req.body.password]).then(function (data) {
        res.write("Account created successfully");
        res.end();
    });
});

// App Routers
// Router for adding categories
app.post('/addCategory', checkAuthentication, function (req, res) {
    //Name of the fields is categoryName and categoryLabel
    //res.write(req.body.categoryName);
    //res.write(req.body.categoryLabel);
    //res.write("We got this nigga");
    //res.write(" " + JSON.stringify(req.user, null, " "));
    //res.end();



    var sqlQuery = `INSERT 
                    INTO dailyreview_category (user_id, category_name, category_label)
                    VALUES ($1, $2, $3)`;

    //console.log("The current logged in user's id is " + req.user.user_id);

    req.checkBody('categoryName', 'Category name cannot be empty').notEmpty();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
            return;
        }
    });

    dailyReviewClient.query(sqlQuery, [req.user.user_id, req.body.categoryName, req.body.categoryLabel]).then(function (data) {
        //console.log("Successfully data chala gaya database mein, hoyee");
        res.send("Category added successfully");
    }).catch(function (error) {
        res.status(500).send("Internal server error");
        console.log("Category not added to database. Following error occured");
        console.log(error);
    });
});

// Router for getting all categories for a user
app.get('/getCategory', checkAuthentication, function (req, res) {
    // Get all categories from the database corresponding to the user id
    var sqlQuery = `SELECT *
                    FROM dailyreview_category
                    WHERE user_id=$1`;

    dailyReviewClient.query(sqlQuery, [req.user.user_id]).then(function (data) {
        /*
        var dataBoolean = data || false;
        console.log("The boolean value of data is " + dataBoolean);
        console.log("The value of data is " + JSON.stringify(data, null, "  "));
        console.log("The typeof data is array? " + (data.constructor === Array));
        console.log("The length of the array is " + data.length);
        */
        if (data.length === 0) {
            res.send("There are no categories to display at this point");
        } else {
            res.send(JSON.stringify(data, null, "  "));
        }

    }).catch(function (error) {
        res.status(500).send("Internal server error ");
        console.log("Error retrieving categories from the database");
        console.log(error);
    });
});

// Router for editing existing categories
app.post('/editCategory', checkAuthentication, function (req, res) {
    //Name of fields is categoryNameOld, categoryNameNew, categoryLabelNew
    var sqlQuery = `UPDATE dailyreview_category
                    SET category_name=$1, category_label=$2
                    WHERE category_name=$3 AND user_id=$4`;

    dailyReviewClient.query(sqlQuery, [req.body.categoryNameNew, req.body.categoryLabelNew, req.body.categoryNameOld, req.user.user_id, req.body.categoryNameOld]).then(function (data) {
        res.write(JSON.stringify(data, null, "  "));
        res.write("Category updated successfully");
        res.end();
    }).catch(function (err) {
        res.status(500).send("Internal server error");
        res.end();
        console.log("Category not updated. Error ");
        console.log(err);
    });

});

// Router for deleting categories
app.post('/deleteCategory', checkAuthentication, function (req, res) {
    // Name of fields is categoryName
    var sqlQuery = `DELETE
                    FROM dailyreview_score
                    WHERE category_id=(SELECT category_id FROM dailyreview_category WHERE category_name=$1)
                    AND userdate_id=(SELECT userdate_id FROM dailyreview_userdate WHERE user_id=$2)`;

    dailyReviewClient.query(sqlQuery, [req.body.categoryName, req.user.user_id]).then(function (data) {
        console.log("Scores corresponding to the category deleted from the table dailyreview_score");

        var sqlQuery = `DELETE
                    FROM dailyreview_category
                    WHERE category_name=$1 AND user_id=$2`;

        dailyReviewClient.query(sqlQuery, [req.body.categoryName, req.user.user_id]).then(function (data) {
            res.send("Category deleted successfully");
            res.end();
        }).catch(function (err) {
            res.send("Category not deleted. Error !");
            res.end();
            console.log("Category not deleted from dailyreview_category table. Following is the error");
            console.log(err);
        });

    }).catch(function (err) {
        console.log("Scores not deleted from dailyreview_score table. Following is the error");
        console.log(err);
    });

});

// Router for reviewing a date by the chosen categories
app.post('/reviewDay', checkAuthentication, function (req, res) {
    // Fields to be provided date, category, score 
    // Can be any number of categories and equal number of scores
    // How to get an array in a query string?
    // How to get an array in the body of a post request

    console.log(req.body.categoryName);
    console.log(req.body.categoryScore);
    console.log(req.user.user_id)
    console.log(req.body.date);

    // How to enter all this data into the respective table in the database
    // Insert user_id and date into userdate table
    // Get category_id using the categoryName from category table
    // Get userdate_id using user.id and body.date from userdate
    // Merge the two arrays of category names and scores - How?
    // Insert userdate_id, category_id and score into score table

    var sqlQuery = `INSERT 
                    INTO dailyreview_userdate (user_id, dateentry)
                    VALUES ($1, $2)`;

    dailyReviewClient.query(sqlQuery, [req.user.user_id, req.body.date]).then(function () {

        var sqlQuery = `SELECT userdate_id
                        FROM dailyreview_userdate
                        WHERE user_id=$1 AND dateentry=$2`;

        dailyReviewClient.query(sqlQuery, [req.user.user_id, req.body.date]).then(function (dataForID) {
            console.log(dataForID[0]["userdate_id"]);
            //console.log("reformed userdateid " + userdate_id.userdate_id);
            for (var i = 0; i < req.body.categoryName.length; i++) {
                let count = i;
                var sqlQuery = `SELECT category_id
                                FROM dailyreview_category
                                WHERE category_name=$1`;

                dailyReviewClient.query(sqlQuery, [req.body.categoryName[count]]).then(function (category_id) {
                    console.log("Value of count " + count);
                    console.log("req.body.categoryScore " + req.body.categoryScore[count]);

                    var sqlQuery = `INSERT
                                    INTO dailyreview_score (userdate_id, category_id, score)
                                    VALUES ($1, $2, $3)`;

                    dailyReviewClient.query(sqlQuery, [dataForID[0]["userdate_id"], category_id[0]["category_id"], req.body.categoryScore[count]]);
                });
            }

        });

        res.send("Date reviewed successfully");
        res.end();
    });
});

// Router for getting the review for a date
app.get('/getReview', checkAuthentication, function (req, res) {
    // Use params to get the date
    // Write the SQL query to regenerate the categories for a date and the corresponding scores
    var date = req.query.date;
    var sqlQuery = `SELECT dailyreview_users.user_name as User, dailyreview_category.category_name as Category, dailyreview_userdate.dateentry as DataEntry, dailyreview_score.score as Score
                    FROM dailyreview_users
                    JOIN dailyreview_userdate 
                    ON (dailyreview_users.user_id = dailyreview_userdate.user_id)
                    JOIN dailyreview_score 
                    ON (dailyreview_userdate.userdate_id = dailyreview_score.userdate_id) 
                    JOIN dailyreview_category 
                    ON (dailyreview_score.category_id = dailyreview_category.category_id)
                    WHERE dailyreview_users.user_id=$1 AND dailyreview_userdate.dateentry=$2`

    dailyReviewClient.query(sqlQuery, [req.user.user_id, date]).then(function (data) {
        res.send(JSON.stringify(data, null, "  "));
    });

});

// Router for Journal operations
app.post('/addJournalQuestion', checkAuthentication, function (req, res) {

});

app.post('/addJournalReview', checkAuthentication, function (req, res) {

});

app.get('/getJournalReview', checkAuthentication, function (req, res) {

});
