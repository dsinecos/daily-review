var dailyReviewClient = require('../../../db.js');

module.exports = function (req, res) {
    //Name of the fields is categoryName and categoryLabel
    //res.write(req.body.categoryName);
    //res.write(req.body.categoryLabel);
    //res.write("We got this nigga");
    //res.write(" " + JSON.stringify(req.user, null, " "));
    //res.end();

    var sqlQuery = `INSERT 
                    INTO dailyreview_category (user_id, category_name, category_label)
                    VALUES ($1, $2, $3)`;

    //console.log("The current logged in user's id is " + req.user.user_id);

    req.checkBody('categoryName', 'Category name cannot be empty').notEmpty();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.status(400).send('There have been validation errors: ' + JSON.stringify(result.array(), null, "  "));
            return;
        }
    });

    dailyReviewClient.query(sqlQuery, [req.user.user_id, req.body.categoryName, req.body.categoryLabel]).then(function (data) {
        //console.log("Successfully data chala gaya database mein, hoyee");
        res.send("Category added successfully");
    }).catch(function (error) {
        res.status(500).send("Internal server error");
        console.log("Category not added to database. Following error occured");
        console.log(error);
    });

}
