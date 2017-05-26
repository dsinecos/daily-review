var dailyReviewClient = require('../../../db.js');

module.exports = function(req, res) {

    var sqlQuery = `INSERT
                    INTO dailyreview_users (user_name, password)
                    VALUES ($1, $2)`;

    dailyReviewClient.query(sqlQuery, [req.body.username, req.body.password]).then(function (data) {
        res.write("Account created successfully");
        res.end();
    });
    
}