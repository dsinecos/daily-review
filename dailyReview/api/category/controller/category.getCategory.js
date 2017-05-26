var dailyReviewClient = require('../../../db.js');

module.exports = function (req, res) {

    // Get all categories from the database corresponding to the user id
    var sqlQuery = `SELECT *
                    FROM dailyreview_category
                    WHERE user_id=$1`;

    dailyReviewClient.query(sqlQuery, [req.user.user_id]).then(function (data) {
        /*
        var dataBoolean = data || false;
        console.log("The boolean value of data is " + dataBoolean);
        console.log("The value of data is " + JSON.stringify(data, null, "  "));
        console.log("The typeof data is array? " + (data.constructor === Array));
        console.log("The length of the array is " + data.length);
        */
        if (data.length === 0) {
            res.send("There are no categories to display at this point");
        } else {
            res.write("Following categories were retrieved for the user");
            res.write("\n");
            res.write(JSON.stringify(req.user, null, "  "));
            res.write(JSON.stringify(data, null, "  "));
            res.end();
        }

    }).catch(function (error) {
        res.status(500).send("Internal server error ");
        console.log("Error retrieving categories from the database");
        console.log(error);
    });

}
