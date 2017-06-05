// Middleware for checking if the current user is already logged in
module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
        //res.write(JSON.stringify(req.user, null, "  "));
        //res.end();
        next();
    } else {
        //console.log(req.path);
        res.write("You aren't logged in, you need to log in first");
        //res.send(JSON.stringify(req.user, null, "  "));
        res.end();
    }

}