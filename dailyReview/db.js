var pgp = require('pg-promise')();
var connectionString = "pg://admin:guest@localhost:5432/dailyreview";
var dailyReviewClient = pgp(connectionString);

module.exports = dailyReviewClient;