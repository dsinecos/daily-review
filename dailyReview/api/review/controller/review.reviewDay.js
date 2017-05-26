var dailyReviewClient = require('../../../db.js');

module.exports = function (req, res) {

    // Fields to be provided date, category, score 
    // Can be any number of categories and equal number of scores
    // How to get an array in a query string?
    // How to get an array in the body of a post request

    //console.log(req.body.categoryName);
    //console.log(req.body.categoryScore);
    //console.log(req.user.user_id)
    //console.log(req.body.date);

    //req.checkBody('date','Invalid Date')
    //req.checkBody('categoryName',)

    req.checkBody('categoryName', "Category data provided for review is not valid").categoryDataValidationForReview(req.body.categoryScore);
    //console.log("Printing from req.body.categoryName " + req.body.categoryName);
    //console.log("Printing from req.body.categoryScore" + req.body.categoryScore);

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.status(400).send('There have been validation errors: ' + JSON.stringify(result.array(), null, "  "));
            res.end();
            //console.log("Before return");
            return;
        } else {
            var sqlQuery = `INSERT 
                    INTO dailyreview_userdate (user_id, dateentry)
                    VALUES ($1, $2)`;

            dailyReviewClient.query(sqlQuery, [req.user.user_id, req.body.date]).then(function () {

                var sqlQuery = `SELECT userdate_id
                        FROM dailyreview_userdate
                        WHERE user_id=$1 AND dateentry=$2`;

                dailyReviewClient.query(sqlQuery, [req.user.user_id, req.body.date]).then(function (dataForID) {
                    //console.log(dataForID[0]["userdate_id"]);
                    //console.log("reformed userdateid " + userdate_id.userdate_id);
                    for (var i = 0; i < req.body.categoryName.length; i++) {
                        let count = i;
                        var sqlQuery = `SELECT category_id
                                FROM dailyreview_category
                                WHERE category_name=$1`;

                        dailyReviewClient.query(sqlQuery, [req.body.categoryName[count]]).then(function (category_id) {
                            //console.log("Value of count " + count);
                            //console.log("req.body.categoryScore " + req.body.categoryScore[count]);

                            var sqlQuery = `INSERT
                                    INTO dailyreview_score (userdate_id, category_id, score)
                                    VALUES ($1, $2, $3)`;

                            dailyReviewClient.query(sqlQuery, [dataForID[0]["userdate_id"], category_id[0]["category_id"], req.body.categoryScore[count]]).then(function (data) {
                                //res.send("Date reviewed successfully");
                                //res.end();
                                //return;
                            }).catch(function (err) {
                                console.log("Count " + count);
                                console.log("Integer " + 1);
                                res.status(500).send("Internal server error");
                                res.end();
                                console.log("Error inserting data into dailyreview_score. Following is the error")
                                console.log(err);
                            });
                        }).catch(function (err) {
                            //console.log(2);
                            res.status(500).send("Internal server error");
                            res.end();
                            console.log("Error selecting data from dailyreview_category. Following is the error")
                            console.log(err);
                        });
                    }

                }).catch(function (err) {
                    //console.log(3);
                    res.status(500).send("Internal server error");
                    res.end();
                    console.log("Error while selecting data from userdate table. Following is the error");
                    console.log(err);
                });
                res.send("Date reviewed successfully");
                res.end();
            }).catch(function (err) {
                //console.log(4);
                res.status(500).send("Internal server error");
                res.end();
                console.log("Error occurred while inserting row in dailyreview_userdate. Following is the error")
                console.log(err);
            });
        }
    });

    // How to enter all this data into the respective table in the database
    // Insert user_id and date into userdate table
    // Get category_id using the categoryName from category table
    // Get userdate_id using user.id and body.date from userdate
    // Merge the two arrays of category names and scores - How?
    // Insert userdate_id, category_id and score into score table



}