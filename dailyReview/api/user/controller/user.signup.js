var dailyReviewClient = require('../../../db.js');
var bcrypt = require('bcrypt');
var Joi = require('joi');

module.exports = function (req, res) {

    const schema = Joi.object().keys({
        username: Joi.string().required().alphanum().min(3).max(30),
        password: Joi.string().min(1).required()
    });

    var validationResult = new Promise(function (resolve, reject) {

        var result = Joi.validate({ username: req.body.username, password: req.body.password }, schema);
        if (result.error === null) {
            resolve(result);
        } else {
            reject(result.error);
        }
    });

    validationResult.then(addUserIntoDatabase).catch(function (err) {
        res.write("Validation errors in username-password");
        res.end();
        console.log("Validation errors in username-password. Following is the error");
        console.log(err.name);
        console.log(err.details);
    })

    function addUserIntoDatabase(validationResult) {

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
                }).catch(function (err) {
                    // How to check if the error is violating duplication constraint?
                    if (err.code === '23505') {
                        res.write("Please choose a different username, that username already exists");
                        res.end();
                        console.log("Error due to duplicate username fields in the dailyreview_user table. Following is the error");
                        console.log(err);
                    } else {
                        res.status(500).send("Internal server error");
                        res.end();
                        console.log("Error while inserting record into dailyreview_user table. Following is the error");
                        console.log(err);
                    }
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



}