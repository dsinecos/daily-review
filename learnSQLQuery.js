var pg = require('pg');
var pgp = require('pg-promise')();
var connectionString = "pg://admin:guest@localhost:5432/dailyreview";
var client = pgp(connectionString);

/*
var sqlQuery = `SELECT *
                FROM dailyreview_category  


                WHERE user_id=$1`;
*/

var sqlQuery = `SELECT dailyreview_users.user_name        AS USER,
       dailyreview_category.category_name AS Category,
       dailyreview_userdate.dateentry     AS DataEntry,
       dailyreview_score.score            AS Score
FROM   dailyreview_users
       JOIN dailyreview_userdate
         ON ( dailyreview_users.user_id = dailyreview_userdate.user_id )
       JOIN dailyreview_score
         ON ( dailyreview_userdate.userdate_id = dailyreview_score.userdate_id )
       JOIN dailyreview_category
         ON ( dailyreview_score.category_id = dailyreview_category.category_id )
WHERE  dailyreview_users.user_id = $1
       AND dailyreview_userdate.dateentry = $2  `

client.query(sqlQuery, [3, '05/23/2017']).then(function (data) {
    console.log(JSON.stringify(data, null, "  "));
}).catch(function (error) {
    console.log(error);
    console.log("Error retrieving categories from the database");
});
