var dailyReviewClient = require('../../../db.js');

module.exports = function (req, res) {
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
}