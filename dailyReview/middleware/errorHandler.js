var chalk = require('chalk');
var util = require("util");

module.exports = function(err, req, res, next) {
    if(err.status && err.response.message) {
        res.status(err.status).send(err.response.message);
        res.end();
    }
    
    console.error(chalk.red("Inside errorHandler middleware"));
    console.error("Error type    " + chalk.red(err.type));
    console.error("Error message " + chalk.blue(JSON.stringify(err.message, null, "  ")));
    console.log("\n");
    console.log(err.err);
    console.error(chalk.yellow("____________________________________"));
}