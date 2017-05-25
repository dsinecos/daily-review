// Refer https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
var express= require('express');
var app = express();
var util = require('util');
app.listen(8888);




/*
var err = new Error();
console.log(JSON.stringify(err, null , "  "));
console.log(" " + err.__proto__);

var object = {
    hoye: 12,
    hoyehoye: 23,
    hoyehoyehoye: 34
}

throw util.inspect(object);
*/

/*
// THIS WILL NOT WORK:
const fs = require('fs');

try {
  fs.readFile('dailyReview.jsd', (err, data) => {
    // mistaken assumption: throwing here...
    if (err) {
      throw err;
    }
  });
} catch (err) {
  // This will not catch the throw!
  console.error("Ghanta" + err);
}
*/

/*
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // Handle the error here.
  console.log("This was an error" + err);
}
*/

/*
function lastElement(array) {
  if (array.length > 0)
    return array[array.length - 1];
  else
    throw "Can not take the last element of an empty array.";
}

function lastElementPlusTen(array) {
  return lastElement(array) + 10;
}

try {
  console.log(lastElementPlusTen([]));
}
catch (error) {
  console.log("Something went wrong: ", error);
  console.log(JSON.stringify(error, null, "  "));
  console.log("Typeof error " + typeof error);
}
*/