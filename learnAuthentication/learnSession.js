/*
var cookieParser = require('cookie-parser');

var express = require('express');
var app = express();
app.use(cookieParser());
app.get('/', function(req, res){
    res.cookie('name', 'express').send('cookie set'); //Sets name=express

    console.log('Cookies: ', req.cookies);
});

app.listen(2346);
*/

var pg = require('pg');
var express = require('express');
var session = require('express-session');
var PostgreSqlStore = require('connect-pg-simple')(session);

var app = express();

var count = 1;

var sessionOptions = {
    secret: "Ghanta secret",
    resave: false,
    saveUninitialized: true,
    name: "Ghanta Cookie ka Naam hai",
    store: new PostgreSqlStore({
        conString: "pg://postgres:postgres@localhost:5432/testsession",
        pruneSessionInterval: false
    })
};

app.use(session(sessionOptions));


app.get('/', function (req, res) {

    //req.session.sessionName = count;

    if(req.session.sessionName) {
    } else {
        req.session.sessionName = "Name" + count;
        count++;
    }

    console.log("The name of this session is :" + req.session.sessionName);
    //console.log("What does session store contain? " + req.session.session.Store);

    if (req.session.page_views) {
        req.session.page_views++;
        res.send("You visited this page " + req.session.page_views + " times");
        console.log(req.session.id);
        console.log(req.session.cookie);
    } else {
        req.session.page_views = 1;
        res.send("Welcome to this page for the first time!");
    }
});

app.listen(2346);

/*
var express = require('express');
var session = require('express-session');
var PostgreSqlStore = require('connect-pg-simple')(session);

var app = express();

var sessionOptions = {
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    store: new PostgreSqlStore({
        
        conString: "postgres://postgres:postgres@localhost:5432/testsession"
    })
};

app.use(session(sessionOptions));

app.get("/", function (req, res) {
    if (!req.session.views) {
        req.session.views = 1;
    } else {
        req.session.views += 1;
    }

    res.json({
        "status": "ok",
        "frequency": req.session.views
    });
});

app.listen(2346, function () {
    console.log("Server started at: http://localhost:3300");
});
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