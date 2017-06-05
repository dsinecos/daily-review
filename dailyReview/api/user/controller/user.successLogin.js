module.exports = function (req, res) {
    res.write("Logged in successfully \n");
    var userData = JSON.stringify(req.user, null, "  ");
    res.write("This is the name of the currently logged in user " + userData);
    res.end();
}