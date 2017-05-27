// Initializing connection with Database and setting up Table
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || "pg://admin:guest@localhost:5432/dailyreview";

/*
var config = {
    user: 'admin',
    database: 'dailyreview',
    password: 'guest',
    host: 'localhost',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 1000
}

const pool = new pg.Pool(config);

pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack);
});
*/

var client = new pg.Client(connectionString);
client.connect();

var endOfDropTablePool = 5;
var endOfCreateTablePool = 5;

function checkEndOfDropTablePool() {
    if (endOfDropTablePool === 0) {
        buildTable();
        //console.log("Completed");
    } else {
        //console.log("This was client number " + endOfDropTablePool + " that finished");
        endOfDropTablePool--;
    }
}

function checkEndOfCreateTablePool() {
    if (endOfCreateTablePool === 0) {
        setupDatabase();
    } else {
        //console.log("This was client number " + endOfCreateTablePool + " that finished");
        endOfCreateTablePool--;
    }
}

function err(error) {
    //console.log(JSON.stringify(error, null, "  "));
}

client.query("DROP TABLE IF EXISTS dailyreview_category CASCADE").then(checkEndOfDropTablePool).catch(err);
client.query("DROP TABLE IF EXISTS dailyreview_users CASCADE").then(checkEndOfDropTablePool).catch(err);
client.query("DROP TABLE IF EXISTS dailyreview_userdate CASCADE").then(checkEndOfDropTablePool).catch(err);
client.query("DROP TABLE IF EXISTS dailyreview_score CASCADE").then(checkEndOfDropTablePool).catch(err);
client.query("DROP TABLE IF EXISTS dailyreview_journal CASCADE").then(checkEndOfDropTablePool).catch(err);
client.query("DROP TABLE IF EXISTS dailyreview_journalresponse CASCADE").then(checkEndOfDropTablePool).catch(err);

function buildTable() {

    client.query("CREATE TABLE IF NOT EXISTS dailyreview_users(user_id SERIAL PRIMARY KEY, user_name varchar(64) UNIQUE, password varchar(128))").then(checkEndOfCreateTablePool).catch(err);
    client.query("CREATE TABLE IF NOT EXISTS dailyreview_category(user_id int NOT NULL, FOREIGN KEY (user_id) REFERENCES dailyreview_users(user_id), category_id SERIAL PRIMARY KEY, category_name varchar(64), category_label varchar(64), UNIQUE (user_id, category_name))").then(checkEndOfCreateTablePool).catch(err);
    client.query("CREATE TABLE IF NOT EXISTS dailyreview_userdate(user_id int, FOREIGN KEY (user_id) REFERENCES dailyreview_users(user_id), dateentry date NOT NULL, userdate_id SERIAL PRIMARY KEY, UNIQUE (user_id, dateentry))").then(checkEndOfCreateTablePool).catch(err);
    client.query("CREATE TABLE IF NOT EXISTS dailyreview_score(userdate_id int, FOREIGN KEY (userdate_id) REFERENCES dailyreview_userdate(userdate_id), category_id int, FOREIGN KEY (category_id) REFERENCES dailyreview_category(category_id), score int)").then(checkEndOfCreateTablePool).catch(err);
    client.query("CREATE TABLE IF NOT EXISTS dailyreview_journal(user_id int, FOREIGN KEY (user_id) REFERENCES dailyreview_users(user_id), journalquestion_id SERIAL PRIMARY KEY, journal_question text)").then(checkEndOfCreateTablePool).catch(err);
    client.query("CREATE TABLE IF NOT EXISTS dailyreview_journalresponse(userdate_id int, FOREIGN KEY (userdate_id) REFERENCES dailyreview_userdate(userdate_id), journalquestion_id int, FOREIGN KEY (journalquestion_id) REFERENCES dailyreview_journal(journalquestion_id), journalquestionresponse text)").then(checkEndOfCreateTablePool).catch(err);

}

function setupDatabase() {
    //console.log("All database build queries have completed execution");
    //var pg = require('pg');
    var bcrypt = require('bcrypt');

    //var connectionString = process.env.DATABASE_URL || "pg://admin:guest@localhost:5432/dailyreview";
    const saltRounds = 10;
    //var client = new pg.Client(connectionString);

    //client.connect();

    //Flush all the database tables

    var flushTableQuery = ['DELETE FROM public.dailyreview_score', 'DELETE FROM public.dailyreview_journalresponse', 'DELETE FROM public.dailyreview_userdate', 'DELETE FROM public.dailyreview_journal', 'DELETE FROM public.dailyreview_category', 'DELETE FROM public.dailyreview_session', 'DELETE FROM public.dailyreview_users'];

    var i = 6;
    flushTable(i);

    function flushTable(i) {
        if (i >= 0) {
            //console.log("Completing database query number " + i);
            client.query(flushTableQuery[6 - i]).then(flushTable(i - 1)).catch(err);
        } else {
            //console.log("Final value of i " + i);
            //console.log("All executions complete");
            insertUserData();
        }

    }

    /*
    client.query("DELETE FROM public.dailyreview_score");
    client.query("DELETE FROM public.dailyreview_journalresponse");

    client.query("DELETE FROM public.dailyreview_userdate");

    client.query("DELETE FROM public.dailyreview_journal");
    client.query("DELETE FROM public.dailyreview_category");

    client.query("DELETE FROM public.dailyreview_session");
    client.query("DELETE FROM public.dailyreview_users");
    */

    //Setup the User list for the dailyreview app

    function insertUserData() {

        //console.log("Now inserting user data");

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
            //console.log("Inside checkForExit");
            //console.log("Value of i " + i);
            sum = sum - i;
            //console.log("Value of sum " + sum);

            if (sum === 0) {
                //console.log("All user insertions complete");
                /*
                var args = process.argv.slice(2);
                var exponent = Number(args[0]) + 2;
                var timeOut = 1/Math.pow(10, exponent)
                setTimeout(exitBuild, timeOut);
                */
                setTimeout(exitBuild, 1000);
                function exitBuild() {
                    client.query("SELECT * FROM dailyreview_users").then(function (data) {
                        //console.log("Timeout was for " + timeOut + " milliseconds");
                        console.log("Number of user entries retrieved " + data.rows.length);
                        process.exit();
                    }).catch(err);
                    //process.exit();
                }
                /*
                client.query("SELECT * FROM dailyreview_users").then(function(data) {
                    //console.log(data);
                    process.exit();
                }).catch(err);
                */
                //process.exit();
            }
        }

        // Insert username and hashed passwords into the database
        for (let i = 0; i < userList.length; i++) {


            bcrypt.genSalt(saltRounds).then(function (salt) {

                var password = userList[i]['password'];

                bcrypt.hash(password, salt).then(function (hash) {
                    //DB operation
                    username = userList[i]['name'];

                    client.query("INSERT INTO public.dailyreview_users(user_name, password) VALUES ($1, $2)", [username, hash]).then(checkForExit(i)).catch(err);

                }).catch(function (err) {
                    //console.log("For the user " + userList[i]['name']);
                    //console.log("Error while creating the hash for the password. Following is the error");
                    //console.log(err);
                });
            }).catch(function (err) {
                //console.log("For the user " + userList[i]['name']);
                //console.log("Error while generating salt. Following is the error");
                //console.log(err);
            });
        }

    }

}

/*
var client = new pg.Client(connectionString);
client.connect();

client.query("DROP TABLE IF EXISTS dailyreview_category CASCADE");
client.query("DROP TABLE IF EXISTS dailyreview_users CASCADE");
client.query("DROP TABLE IF EXISTS dailyreview_userdate CASCADE");
client.query("DROP TABLE IF EXISTS dailyreview_score CASCADE");
client.query("DROP TABLE IF EXISTS dailyreview_journal CASCADE");
client.query("DROP TABLE IF EXISTS dailyreview_journalresponse CASCADE");

client.query("CREATE TABLE IF NOT EXISTS dailyreview_users(user_id SERIAL PRIMARY KEY, user_name varchar(64) UNIQUE, password varchar(128))");
client.query("CREATE TABLE IF NOT EXISTS dailyreview_category(user_id int NOT NULL, FOREIGN KEY (user_id) REFERENCES dailyreview_users(user_id), category_id SERIAL PRIMARY KEY, category_name varchar(64), category_label varchar(64), UNIQUE (user_id, category_name))");
client.query("CREATE TABLE IF NOT EXISTS dailyreview_userdate(user_id int, FOREIGN KEY (user_id) REFERENCES dailyreview_users(user_id), dateentry date NOT NULL, userdate_id SERIAL PRIMARY KEY, UNIQUE (user_id, dateentry))");
client.query("CREATE TABLE IF NOT EXISTS dailyreview_score(userdate_id int, FOREIGN KEY (userdate_id) REFERENCES dailyreview_userdate(userdate_id), category_id int, FOREIGN KEY (category_id) REFERENCES dailyreview_category(category_id), score int)");
client.query("CREATE TABLE IF NOT EXISTS dailyreview_journal(user_id int, FOREIGN KEY (user_id) REFERENCES dailyreview_users(user_id), journalquestion_id SERIAL PRIMARY KEY, journal_question text)");
client.query("CREATE TABLE IF NOT EXISTS dailyreview_journalresponse(userdate_id int, FOREIGN KEY (userdate_id) REFERENCES dailyreview_userdate(userdate_id), journalquestion_id int, FOREIGN KEY (journalquestion_id) REFERENCES dailyreview_journal(journalquestion_id), journalquestionresponse text)");
*/