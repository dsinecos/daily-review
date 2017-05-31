var joi = require('joi');

module.exports = function categoryDataValidation(req, res, next) {

    const schema = joi.object().keys({
        categoryName: joi.string().required().alphanum().min(1).max(30),
        categoryLabel: joi.string().allow('')
    });

    var validationResult = new Promise(function (resolve, reject) {

        var result = joi.validate({ categoryName: req.body.categoryName, categoryLabel: req.body.categoryLabel }, schema);
        if (result.error === null) {
            resolve(result);
        } else {
            reject(result.error);
        }
    });

    validationResult.then(function(result) {
        res.locals.categoryDataValidation = true;
        next();
    }).catch(function (err) {
        res.locals.categoryDataValidation = false;        
        res.locals.categoryDataValidationError = err;
        next();        
        
        /*
        res.write("Validation errors in username-password");
        res.end();

        console.log("Validation errors in categoryDataValidation. Following is the error");
        console.log(err);
        console.log(err.name);
        console.log(err.details);
        */
        //next(err);
    });

}

