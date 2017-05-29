// Initializing connection with Database and setting up Table
var pg = require('pg');
var connectionString = "pg://postgres:postgres@localhost:5432/dailyreview";

var client = new pg.Client(connectionString);
client.connect();

/*
client.query("SELECT * FROM dailyreview_users").then(function (data) {
    //console.log("Timeout was for " + timeOut + " milliseconds");
    console.log("Number of user entries retrieved " + data.rows.length);
    process.exit();
    //client.emit('end');
}).catch(err);
*/
client.query("SELECT * FROM dailyreview_dummyusers").then(function (data) {
    //console.log("Timeout was for " + timeOut + " milliseconds");
    console.log("Number of user entries retrieved " + data.rows.length);
    //process.exit();
    //client.emit('end');
}).catch(err);

function err(error) {
    console.log(JSON.stringify(error, null, "  "));
}