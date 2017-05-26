// Initializing connection with Database and setting up Table
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || "pg://admin:guest@localhost:5432/dailyreview";

var client = new pg.Client(connectionString);
client.connect();

client.query("DROP TABLE IF EXISTS dailyreviewcategory");
client.query("CREATE TABLE IF NOT EXISTS dailyreviewcategory(id SERIAL PRIMARY KEY, name varchar(64), label varchar(64))");

// Initialize table with dummy values
var name = "Category 1";
var label = "Label 1";
client.query("INSERT INTO dailyreviewcategory(name, label) VALUES($1, $2)", [name, label]);
var name = "Category 2";
var label = "Label 1";
client.query("INSERT INTO dailyreviewcategory(name, label) VALUES($1, $2)", [name, label]);
var name = "Category 3";
var label = "Label 2";
client.query("INSERT INTO dailyreviewcategory(name, label) VALUES($1, $2)", [name, label]);
var name = "Category 4";
var label = "Label 2";
client.query("INSERT INTO dailyreviewcategory(name, label) VALUES($1, $2)", [name, label]);
var name = "Category 5";
var label = "Label 3";
client.query("INSERT INTO dailyreviewcategory(name, label) VALUES($1, $2)", [name, label]);
var name = "Category 6";
var label = "Label 4";
client.query("INSERT INTO dailyreviewcategory(name, label) VALUES($1, $2)", [name, label]);

// Initializing app
var express = require('express');
var app = express();
var PORT = process.env.PORT || 2346;

app.enable("trust proxy");
app.listen(PORT);

/*
// Setup to send static files
var path = require('path');
var publicPath = path.resolve(__dirname, "./public");
*/

// Setting up routers
app.get('/', homepage);

app.use("/category", function (req, res, next) {
    console.log("The request method is :" + req.method);
    next();
})

app.get('/category', displayCategory);
app.post('/category', addCategory);
app.put('/category', editCategory);
app.delete('/category', removeCategory);

app.get('/renderBlocks', function (req, res) {

    var data = [{
        name: 'name1',
        address: 'address1',
    },
    {
        name: 'name2',
        address: 'address2'
    },
    {
        name: 'name3',
        address: 'address3'
    }];

    // Query for data from database

    res.header("Access-Control-Allow-Origin", "*");
    res.write(JSON.stringify(data));

    res.end();
})

function homepage(req, res) {
    res.sendFile(__dirname + "/fractionalCode.html")
}

function displayCategory(req, res) {

    var categoryData;

    client.query("SELECT * FROM dailyreviewcategory", function (error, result) {
        //console.log(result.rows);
        categoryData = result.rows;

        console.log(categoryData);

        res.header("Access-Control-Allow-Origin", "*");
        res.json(categoryData);
        res.end();
    });


}

function addCategory(req, res) {
    console.log("POST request received");
    res.write("Thank you");
    res.end();
}

function editCategory(req, res) {
    res.write("Thank you");
    res.end();
}

function removeCategory(req, res) {
    res.write("Thank you");
    res.end();
}