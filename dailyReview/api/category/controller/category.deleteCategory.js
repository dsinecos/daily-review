var dailyReviewClient = require('../../../db.js');

module.exports = function (req, res, next) {

    // Refactored Code
    // Name of fields is categoryName

    if (res.locals.categoryDataValidation === true) {

        checkIfCategoryNameExists();
        
    } else {

        //console.log("Inside /deleteCategory");
        //console.log(res.locals.categoryDataValidationError);

        var error = new Error();
        error = {
            status: 400,
            response: {
                message: "Data validation errors",
            },
            type: "Input based",
            message: {
                location: "Inside /deleteCategory",
                attempted: "To delete category from database",
            },
            err: res.locals.categoryDataValidationError
        }
        next(error);
    }    

    function checkIfCategoryNameExists() {

        var sqlQuery = `SELECT
                        EXISTS 
                        (SELECT true FROM dailyreview_category WHERE category_name=$1 AND user_id=$2)`;

        dailyReviewClient.query(sqlQuery, [req.body.categoryName, req.user.user_id]).then(ifCategoryNameExists).catch(function (err) {

            var error = new Error();
            error = {
                status: 500,
                response: {
                    message: "Internal server error",
                },
                type: "Server based",
                message: {
                    location: "Inside /deleteCategory",
                    attempted: "To delete category from database",
                },
                err: err
            }
            next(error);

            /*
            res.status(500).send("Internal server error");
            res.end();
            console.log("Error occurred ");
            console.log(err);
            */
        });

        function ifCategoryNameExists(data) {

            var categoryNameExists = data[0]['exists'];

            //console.log(typeof categoryNameExists);

            if (categoryNameExists) {
                deleteCategory();
            } else {
                // Create a general function to which you can pass the response as well as the error
                // error.kind = database operation error/ input invalid
                // error.responseMessage = to be sent to the user
                // error.logMessage = to be logged for monitoring
                // error.error = error reported by system
                /*
                res.send("Category name not found");
                res.end();
                console.log("Category name not found");
                */

                var error = new Error();
                error = {
                    status: 400,
                    response: {
                        message: "Category name not found",
                    },
                    type: "Input based",
                    message: {
                        location: "Inside /deleteCategory",
                        attempted: "To delete category from database",
                    },
                    err: {}
                }
                next(error);
            }

        }


    }

    function deleteCategory() {

        var sqlQuery = `DELETE
                    FROM dailyreview_score
                    WHERE category_id=(SELECT category_id FROM dailyreview_category WHERE category_name=$1)
                    AND userdate_id=(SELECT userdate_id FROM dailyreview_userdate WHERE user_id=$2)`;

        dailyReviewClient.query(sqlQuery, [req.body.categoryName, req.user.user_id]).then(deleteScoreForDeletedCategory()).catch(function (err) {
            
            //console.log("Scores not deleted from dailyreview_score table. Following is the error");
            //console.log(err);

            var error = new Error();
            error = {
                status: 500,
                response: {
                    message: "Internal server error",
                },
                type: "Server based",
                message: {
                    location: "Inside /deleteCategory",
                    attempted: "To delete category from database",
                },
                err: err
            }
            next(error);
        });

    }

    function deleteScoreForDeletedCategory() {

        var sqlQuery = `DELETE
                    FROM dailyreview_category
                    WHERE category_name=$1 AND user_id=$2`;

        dailyReviewClient.query(sqlQuery, [req.body.categoryName, req.user.user_id]).then(function (data) {
            res.send("Category deleted successfully");
            res.end();
        }).catch(function (err) {
            /*
            res.send("Category not deleted. Error !");
            res.end();
            console.log("Category not deleted from dailyreview_category table. Following is the error");
            console.log(err);
            */

            var error = new Error();
            error = {
                status: 500,
                response: {
                    message: "Internal server error. Category not deleted.",
                },
                type: "Server based",
                message: {
                    location: "Inside /deleteCategory",
                    attempted: "To delete category from database",
                },
                err: err
            }
            next(error);
        });

    }

    // Refactored code ends here

    /*
    // Name of fields is categoryName
    var sqlQuery = `SELECT
                    EXISTS 
                    (SELECT true FROM dailyreview_category WHERE category_name=$1)`;

    dailyReviewClient.query(sqlQuery, [req.body.categoryName]).then(function (data) {
        var categoryNameExists = data[0]['exists'];
        //console.log(typeof categoryNameExists);
        if (categoryNameExists) {

            var sqlQuery = `DELETE
                            FROM dailyreview_score
                            WHERE category_id=(SELECT category_id FROM dailyreview_category WHERE category_name=$1)
                            AND userdate_id=(SELECT userdate_id FROM dailyreview_userdate WHERE user_id=$2)`;

            dailyReviewClient.query(sqlQuery, [req.body.categoryName, req.user.user_id]).then(function (data) {
                //console.log("Scores corresponding to the category deleted from the table dailyreview_score");

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

        } else {
            res.send("Category name not found");
            res.end();
            console.log("Category name not found");
        }
    }).catch(function (err) {
        res.status(500).send("Internal server error");
        res.end();
        console.log("Error occurred ");
        console.log(err);
    });

    */
}


