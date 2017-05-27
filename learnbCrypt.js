var bcrypt = require('bcrypt');

const saltRounds = 10;
const password = "John Doe";
var comparePassword;

/*
var salt = bcrypt.genSaltSync(saltRounds);
var hash = bcrypt.hashSync(password, salt);

console.log("This is the salt " + salt);
console.log("This is the salt length " + salt.length);
console.log("This is the hash of the password " + hash);
console.log("This is the length of the hash of the password " + hash.length);
console.log("Result of matching passwords" + bcrypt.compareSync(password, hash));
*/

/*
bcrypt.genSalt(saltRounds, function (err, salt) {

    if (err) console.log(err);
    bcrypt.hash(password, salt, function (err, hash) {
        if (err) console.log(err);
        console.log("This is the hash " + hash);
        comparePassword = hash;
    });

});
*/

bcrypt.genSalt(saltRounds).then(function (salt) {

    bcrypt.hash(password, salt).then(function (hash) {
        
        //DB operation

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

bcrypt.compare(password, comparePassword).then(function (result) {
    if (result) {
        console.log("Passwords did match");
        // Login the user
    } else {
        console.log("Password did not match");
    }
}).catch(function (err) {
    res.status(500).send("Internal server error");
    res.end();
    console.log("Error while comparing passwords using bcrypt. Following is the error");
    console.log(err);
});