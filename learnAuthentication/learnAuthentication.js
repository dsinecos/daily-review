var express = require('express');
var passport = require('passport'); // What does this do?
var Strategy = require('passport-local').Strategy; // How does adding Strategy fit into the earlier Passport module?
var db = require('./db'); // Configure this for PostgreSQL

passport.use(new Strategy(function (username, password, cb) {

    // Verfiy function that uses (username, password) provided by the user and returns (err, userRecord) to the cb to attach it to the req object

    db.users.findByUsername(username, function (err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); } // Under what conditions would a record be returned that does not have user defined?
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
    });
}));

// What does it mean to serialize and deserialize users?

passport.serializeUser(function(user, cb) { // What does this function do? // 
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb){ // What does this function do?
    db.users.findById(id, function(err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});




