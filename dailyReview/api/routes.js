var passport = require('passport');
var categoryDataValidation = require('../middleware/dataValidation/categoryDataValidation.js');
var userCredentialValidation = require('../middleware/dataValidation/userCredentialValidation.js');

module.exports = function(app) {
    
    // Authentication routes
    
    app.post('/', userCredentialValidation, passport.authenticate('local', { failureRedirect: '/failed' }), require('./user/controller/user.login.js'));
    app.post('/login', userCredentialValidation, passport.authenticate('local', { failureRedirect: '/failed' }), require('./user/controller/user.login.js'));
    app.get('/failed', require('./user/controller/user.loginFailed.js'));
    app.get('/successLogin', app.checkAuthentication, require('./user/controller/user.successLogin.js'));
    app.get('/', app.checkAuthentication, require('./user/controller/user.successiveRequest.js'));
    app.post('/signup', require('../middleware/dataValidation/userCredentialValidation.js'), require('./user/controller/user.signup.js'));
    

    // Category routes

    app.post('/addCategory', app.checkAuthentication, categoryDataValidation, require('./category/controller/category.addCategory.js'));    
    app.get('/getCategory', app.checkAuthentication, require('./category/controller/category.getCategory.js'));
    app.post('/editCategory', app.checkAuthentication, require('./category/controller/category.editCategory.js'));
    app.post('/deleteCategory', app.checkAuthentication, categoryDataValidation, require('./category/controller/category.deleteCategory.js'));

    
    // Review routes

    app.post('/reviewDay', app.checkAuthentication, require('./review/controller/review.reviewDay.js'));
    app.get('/getReview', app.checkAuthentication, require('./review/controller/review.getReview.js'));

    
    // Journal routes
    
    app.post('/addJournalQuestion', app.checkAuthentication, require('./journal/controller/journal.addJournalQuestion.js'));
    app.post('/addJournalReview', app.checkAuthentication, require('./journal/controller/journal.addJournalReview.js'));
    app.get('/getJournalReview', app.checkAuthentication, require('./journal/controller/journal.getJournalReview.js'));
    

}