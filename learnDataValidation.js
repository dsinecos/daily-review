
var util = require('util'),
    bodyParser = require('body-parser'),
    express = require('express'),
    expressValidator = require('express-validator'),
    app = express();

app.listen(8888);

app.use(bodyParser.json());
app.use(expressValidator()); // this line must be immediately after any of the bodyParser middlewares! 

app.post('/', function (req, res) {
    

    console.log("This is the postparam " + req.body.postparam);
    console.log("This is the urlparam " + req.params.urlparam);
    console.log("This is the getparam " + req.query.getparam);

    req.checkBody('date','Invalid Date').isBefore('05/25/2017');

    // VALIDATION 
    // checkBody only checks req.body; none of the other req parameters 
    // Similarly checkParams only checks in req.params (URL params) and 
    // checkQuery only checks req.query (GET params). 
    /*
    req.checkBody('postparam', 'Invalid postparam').notEmpty().isInt();
    req.checkParams('urlparam', 'Invalid urlparam').isAlpha();
    req.checkQuery('getparam', 'Invalid getparam').isInt();
    */

    // OR assert can be used to check on all 3 types of params. 
    // req.assert('postparam', 'Invalid postparam').notEmpty().isInt(); 
    // req.assert('urlparam', 'Invalid urlparam').isAlpha(); 
    // req.assert('getparam', 'Invalid getparam').isInt(); 

    // SANITIZATION 
    // as with validation these will only validate the corresponding 
    // request object 

    /*
    req.sanitizeBody('postparam').toBoolean();
    req.sanitizeParams('urlparam').toBoolean();
    req.sanitizeQuery('getparam').toBoolean();
    */

    // OR find the relevent param in all areas 
    //req.sanitize('postparam').toBoolean();

    // Alternatively use `var result = yield req.getValidationResult();` 
    // when using generators e.g. with co-express 
    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
            return;
        }
        res.json({
            urlparam: req.params.urlparam+"",
            getparam: req.query.getparam+"",
            postparam: req.body.postparam+""
        });
    });
});

