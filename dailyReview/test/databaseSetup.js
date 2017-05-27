var pg = require('pg');
var bcrypt = require('bcrypt');

var connectionString = process.env.DATABASE_URL || "pg://admin:guest@localhost:5432/dailyreview";
const saltRounds = 10;
var client = new pg.Client(connectionString);

client.connect();

//Flush all the database tables

client.query("DELETE FROM public.dailyreview_score");
client.query("DELETE FROM public.dailyreview_journalresponse");

client.query("DELETE FROM public.dailyreview_userdate");

client.query("DELETE FROM public.dailyreview_journal");
client.query("DELETE FROM public.dailyreview_category");

client.query("DELETE FROM public.dailyreview_session");
client.query("DELETE FROM public.dailyreview_users");

//Setup the User list for the dailyreview app

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

}
];

// Insert username and hashed passwords into the database
for (let i = 0; i < userList.length; i++) {
    

    bcrypt.genSalt(saltRounds).then(function (salt) {

        var password = userList[i]['password'];

        bcrypt.hash(password, salt).then(function (hash) {
            //DB operation
            username = userList[i]['name'];

            client.query("INSERT INTO public.dailyreview_users(user_name, password) VALUES ($1, $2)", [username, hash]);

        }).catch(function (err) {
            console.log("For the user " + userList[i]['name']);
            console.log("Error while creating the hash for the password. Following is the error");
            console.log(err);
        });
    }).catch(function (err) {
        console.log("For the user " + userList[i]['name']);
        console.log("Error while generating salt. Following is the error");
        console.log(err);
    });
}