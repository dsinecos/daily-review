var Joi = require('joi');

array1 = ["A", "B", "C", "D"];
array2 = [1, 2, 3, 5];

/*
var testDate = new Date('2017-02-08');
console.log("What is the date " + testDate.getDate());
*/

testDate = '12/12/2013';

// is there an input type date for html forms

const schema = Joi.object().keys({
    date: Joi.date().max('now').required(),
    categoryName: Joi.array().items().min(1).unique().required(),
    categoryScore: Joi.array().items(Joi.number().min(1).max(4)).min(1).length(array1.length).required()
});

Joi.validate({date: testDate, categoryName: array1, categoryScore: array2}, schema, function(err, value) {
    //console.log("This was the result of the validation" + JSON.stringify(value));
    if(err) {
        console.log(err.details);
    } else {
        console.log(value);
    }
    
    
});