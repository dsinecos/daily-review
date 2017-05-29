module.exports = function(err, req, res, next) {
    console.error("There was an error that is being handled from the errorHandler middleware");
    console.error(err.err);
    console.error(err);
}