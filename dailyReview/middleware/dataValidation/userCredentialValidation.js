var joi = require('joi');

module.exports = function userCredentialValidation(req, res, next) {

    const schema = joi.object().keys({
        username: joi.string().required().alphanum().min(3).max(30),
        password: joi.string().min(1).required()
    });

    var validationResult = new Promise(function (resolve, reject) {

        var result = joi.validate({ username: req.body.username, password: req.body.password }, schema);
        if (result.error === null) {
            resolve(result);
        } else {
            reject(result.error);
        }
    });

    validationResult.then(function(result) {
        res.locals.userCredentialValidation = true;
        next();
    }).catch(function (err) {
        
        
        res.write("Validation errors in username-password");
        res.end();
        console.log("Validation errors in username-password. Following is the error");
        //console.log(err);
        console.log(err.name);
        console.log(err.details);
        
        //next(err);
    });

}

