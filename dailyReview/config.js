// Initializing connection to the required databases
// For storing express-session data 
var session = require('express-session');
var connectPgSimple = require('connect-pg-simple')(session);
var PostgreSqlStore = new connectPgSimple({
    //conString: "pg://postgres:postgres@localhost:5432/testsession",
    conString: "pg://admin:guest@localhost:5432/dailyreview",
    tableName: "dailyreview_session",
    pruneSessionInterval: false,
});

module.exports = {
    sessionOptions: {
        secret: "Ghanta secret",
        resave: false,
        saveUninitialized: true,
        name: "cookieDaNaam",
        store: PostgreSqlStore
    }
}