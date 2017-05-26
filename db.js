// The objective is to create a lightweight module that handles Postgres Database queries and returns promises

var pg = require('pg');

function db(options) {

    if (!options.connectionString) {
        // How to throw an error that floats up in the API chain?
        console.log("No connectionString provided");
    } else {
        this.connectionString = options.connectionString;
    }

    this.client = new pg.Client(this.connectionString);
    this.client.connect();

}

// Include promises
// Allow for errors to float up the API

db.prototype.insert = function (text, values) {
    this.client.query(text, values);
}

db.prototype.select = function (text, values, callback) {
    this.client.query(text, values, callback);
}

db.prototype.update = function (text, values, callback) {
    this.client.query(text, values, callback);
}