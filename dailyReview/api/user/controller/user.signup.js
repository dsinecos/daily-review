var dailyReviewClient = require('../../../db.js');
var bcrypt = require('bcrypt');


module.exports = function (req, res) {

    var saltRounds = 10;
    var password = req.body.password;

    bcrypt.genSalt(saltRounds).then(function (salt) {

        bcrypt.hash(password, salt).then(function (hash) {

            //DB operation
            var sqlQuery = `INSERT
                    INTO dailyreview_users (user_name, password)
                    VALUES ($1, $2)`;

            dailyReviewClient.query(sqlQuery, [req.body.username, hash]).then(function (data) {
                res.write("Account created successfully");
                res.end();
            });

        }).catch(function (err) {
            res.status(500).send("Internal server error");
            res.end();
            console.log("Error while creating the hash for the password. Following is the error");
            console.log(err);
        })
    }).catch(function (err) {
        res.status(500).send("Internal server error");
        res.end();
        console.log("Error while generating salt. Following is the error");
        console.log(err);
    });

}