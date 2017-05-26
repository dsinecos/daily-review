var dailyReviewClient = require('../../../db.js');

module.exports = function (req, res) {
    //Name of fields is categoryNameOld, categoryNameNew, categoryLabelNew

    // To check if a category by the name categoryNameOld exists in the dailyreview_category table
    var sqlQuery = `SELECT
                    EXISTS 
                    (SELECT true FROM dailyreview_category WHERE category_name=$1)`;

    dailyReviewClient.query(sqlQuery, [req.body.categoryNameOld]).then(function (data) {
        var categoryNameExists = data[0]['exists'];
        //console.log(typeof categoryNameExists);
        if (categoryNameExists) {
            var sqlQuery = `UPDATE dailyreview_category
                    SET category_name=$1, category_label=$2
                    WHERE category_name=$3 AND user_id=$4`;

            dailyReviewClient.query(sqlQuery, [req.body.categoryNameNew, req.body.categoryLabelNew, req.body.categoryNameOld, req.user.user_id, req.body.categoryNameOld]).then(function (data) {
                res.write(JSON.stringify(data, null, "  "));
                res.write("Category updated successfully");
                res.end();
            }).catch(function (err) {
                res.status(500).send("Internal server error");
                res.end();
                console.log("Category not updated. Error ");
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