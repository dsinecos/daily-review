var dailyReviewClient = require('../../../db.js');
var joi = require('joi');

module.exports = function (req, res) {
    // Use params to get the date
    // Write the SQL query to regenerate the categories for a date and the corresponding scores
    var date = req.query.date;

    const schema = joi.object().keys({
        date: joi.date().max('now').required()
    });

    joi.validate({ date: req.query.date }, schema, function (err, value) {
        if (err) {
            res.status(400).send('Please enter a valid date');
            res.end();
            console.log("There have been validation errors");
            console.log(err.details);
        } else {
            getReview();
        }
    });

    function getReview() {

        var sqlQuery = `SELECT dailyreview_users.user_name as User, dailyreview_category.category_name as Category, dailyreview_userdate.dateentry as DataEntry, dailyreview_score.score as Score
                    FROM dailyreview_users
                    JOIN dailyreview_userdate 
                    ON (dailyreview_users.user_id = dailyreview_userdate.user_id)
                    JOIN dailyreview_score 
                    ON (dailyreview_userdate.userdate_id = dailyreview_score.userdate_id) 
                    JOIN dailyreview_category 
                    ON (dailyreview_score.category_id = dailyreview_category.category_id)
                    WHERE dailyreview_users.user_id=$1 AND dailyreview_userdate.dateentry=$2`

        dailyReviewClient.query(sqlQuery, [req.user.user_id, date]).then(function (data) {
            res.write("Following is the review for the date " + date);
            res.write(JSON.stringify(data, null, "  "));
            res.end();
        });

    }

}