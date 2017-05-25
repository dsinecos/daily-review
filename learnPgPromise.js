var pgp = require('pg-promise')();

var connectionString = "pg://admin:guest@localhost:5432/dailyreview";

var db = pgp(connectionString);

db.query("SELECT * FROM dailyreview_users").then(function(data) {
    console.log(JSON.stringify(data, null, "  "));
}).catch(function(error) {
    console.log("There was an error nigga");
});