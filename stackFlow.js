/*
Cases
1. With setTimeout
2. Without setTimeout but using the select query before process.exit()
3. Without setTimeout but using the select query before process.exit()
4. Without setTimeout and without the select query

What did you expect to happen and why (Based on database operations and promises)?
What is happening here - Ask stackoverflow?

Tags - nodejs, express, postgres, pg
*/


// Initializing connection with Database and setting up Table
var pg = require('pg');
// To be deleted
var connectionString = "pg://postgres:postgres@localhost:5432/dailyreview";

var client = new pg.Client(connectionString);
client.connect();

function err(error) {
    console.log(JSON.stringify(error, null, "  "));
}

//To be deleted
/*
client.query("DROP TABLE IF EXISTS dailyreview_dummyusers").then(function () {
    client.query("CREATE TABLE IF NOT EXISTS dailyreview_dummyusers(user_id SERIAL PRIMARY KEY, user_name varchar(64) UNIQUE, password varchar(128))").then(insertDummyData).catch(err);
}).catch(err);
*/

client.query("DELETE FROM dailyreview_dummyusers").then(insertDummyData).catch(err);

//insertDummyData(); 
function insertDummyData() {

    var userList = [{
        name: "Bruce",
        password: "Wayne"
    },
    {
        name: "Jack",
        password: "Sparrow"
    },
    {
        name: "Black",
        password: "Widow"
    },
    {
        name: "Natasha",
        password: "Romanoff"
    },
    {
        name: "Baba",
        password: "Ramdev"

    },
    {
        name: "Shaktiman",
        password: "Shaktiman"
    }
    ];

    var sum = 15;

    function checkForExit(i) {
        sum = sum - i;

        if (sum === 0) {
            //setTimeout(exitInsertData, 1000);
            console.log("This was user :" + userList[i]['name']);
            console.log("This was user number " + i);
            exitInsertData();

            function exitInsertData() {

                /*
                client.query("SELECT * FROM dailyreview_dummyusers").then(function (data) {
                    //console.log("Timeout was for " + timeOut + " milliseconds");
                    console.log("Number of user entries retrieved " + data.rows.length);
                    process.exit();
                }).catch(err);
                */


                process.exit();
            }
        } else {
            console.log("This was user :" + userList[i]['name']);
            console.log("This was user number " + i);
        }
    }

    for (let i = 0; i < userList.length; i++) {
        username = userList[i]['name'];
        password = userList[i]['password'];

        client.query("INSERT INTO public.dailyreview_dummyusers(user_name, password) VALUES ($1, $2)", [username, password]).then(checkForExit(i)).catch(err);
    }

}


