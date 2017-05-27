var args = process.argv.slice(2);
var exponent = Number(args[0]) + 2;
console.log("Exponent is " + exponent);
console.log(1/Math.pow(10, exponent));