var bcrypt = require('bcrypt');

const saltRounds = 10;
const password = "John Doe";
var comparePassword;

var salt = bcrypt.genSaltSync(saltRounds);
var hash = bcrypt.hashSync(password, salt);
console.log("This is the salt " + salt);
console.log("This is the hash of the password " + hash);
console.log("Result of matching passwords" + bcrypt.compareSync(password, hash));

/*
bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) console.log(err);

    bcrypt.hash(password, salt, function (err, hash) {
        if (err) console.log(err);
        console.log("This is the hash " + hash);
        comparePassword = hash;
    });
});

bcrypt.compare(password, comparePassword, function(err, result) {
    console.log("Password " + password);
    console.log("Compare Password " + comparePassword);
    if (err) console.log(err);
    if (result === false) {
        console.log("Password did not match");
    } else {
        console.log("Passwords did match");
    }
});
*/