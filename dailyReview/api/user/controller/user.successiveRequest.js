module.exports = function (req, res) {
    res.write("For Testing successive requests from a logged in user \n");
    res.write("This is the name of the currently logged in user " + JSON.stringify(req.user, null, "  "));
    res.end();
}