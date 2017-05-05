var cookieParser = require('cookie-parser');

var express = require('express');
var app = express();
app.use(cookieParser());
app.get('/', function(req, res){
    res.cookie('name', 'express').send('cookie set'); //Sets name=express

    console.log('Cookies: ', req.cookies);
});

app.listen(2346);

/*
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!", resave: false,
    saveUninitialized: true}));

app.get('/', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
   }else{
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
   }
});
app.listen(2346);
*/

/*
var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')

var app = express()
app.listen(2346);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(function (req, res, next) {

    
    var views = req.session.views

    if (!views) {
        req.session.views = views = {}
    }

    // get the url pathname 
    var pathname = parseurl(req).pathname;

    // count the views 
    views[pathname] = (views[pathname] || 0) + 1;
    console.log("Value of req.session.views is " + JSON.stringify(req.session.views, null, " "));

    next()
})

app.get('/foo', function (req, res, next) {
    res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
})

app.get('/bar', function (req, res, next) {
    res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})
*/