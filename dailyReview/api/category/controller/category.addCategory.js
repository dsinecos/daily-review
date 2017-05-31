var dailyReviewClient = require('../../../db.js');
var chalk = require('chalk');

module.exports = function (req, res, next) {
    //Name of the fields is categoryName and categoryLabel
    //res.write(req.body.categoryName);
    //res.write(req.body.categoryLabel);
    //res.write("We got this nigga");
    //res.write(" " + JSON.stringify(req.user, null, " "));
    //res.end();



    //console.log("The current logged in user's id is " + req.user.user_id);

    /*
    req.checkBody('categoryName', 'Category name cannot be empty').notEmpty();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            
            var error = new Error();
            error.status = 400;
            error.responseMessage = "Category name cannot be empty"
            
            res.status(400).send('There have been validation errors: ' + JSON.stringify(result.array(), null, "  "));
            return;
        }
    }).catch(function(error) {
        
    });
    */

    // Logging section
    console.log(chalk.white("Logging info "));
    console.log(chalk.white("User id : " + req.user.user_id));
    console.log(chalk.white("Inside /addCategory router - Adding category"));
    console.log(chalk.white("Info "));
    console.log(chalk.white("categoryName  : " + req.body.categoryName));
    console.log(chalk.white("categoryLabel : " + req.body.categoryLabel));
    console.error(chalk.yellow("______________________________________"));
    console.log("\n");

    if (res.locals.categoryDataValidation === true) {

        addCategoryIntoDatabase();
        
    } else {

        var error = new Error();
        error = {
            status: 400,
            response: {
                message: "Data validation errors",
            },
            type: "Input based",
            message: {
                location: "Inside /addCategory",
                attempted: "To add category into database",
            },
            err: res.locals.categoryDataValidationError
        }
        next(error);
    }

    function addCategoryIntoDatabase() {

        var sqlQuery = `INSERT 
                        INTO dailyreview_category (user_id, category_name, category_label)
                        VALUES ($1, $2, $3)`;

        dailyReviewClient.query(sqlQuery, [req.user.user_id, req.body.categoryName, req.body.categoryLabel]).then(function (data) {
            //console.log("Successfully data chala gaya database mein, hoyee");
            res.send("Category added successfully");
        }).catch(function (err) {
            /*
            res.status(500).send("Internal server error");
            console.log("Category not added to database. Following error occured");
            var error = new Error();
            errorResponse.error = error;
            errorResponse.message = "Category not added to database. Following error occured"
            next(errorResponse);
            */
            //console.log(error);

            var error = new Error();
            error = {
                status: 500,
                response: {
                    message: "Internal server error",
                },
                type: "Input/ Server based",
                message: {
                    location: "Inside /addCategory",
                    attempted: "To add category into database",
                },
                err: err
            }
            next(error);
        });
    }
}
