var chalk = require('chalk');
 
// style a string 
console.log(chalk.blue('Hello world!'));
console.log(chalk.white.bgBlack('Hello world!'));
console.log(chalk.white.bgRed('Hello world!'));
console.log(chalk.white.bgGreen('Hello world!'));
console.log(chalk.red.bgMagenta('-------------------------------'));
console.log(chalk.white.bgMagenta('Hello world!'));
console.log(chalk.white.bgCyan('Hello world!'));
console.log(chalk.white.bgBlue('Hello world!'));
console.log(chalk.white.bgGreen('Hello world!'));

/*
// combine styled and normal strings 
console.log(chalk.blue('Hello') + 'World' + chalk.red('!'));
 
// compose multiple styles using the chainable API 
console.log(chalk.blue.bgRed.bold('Hello world!'));
 
// pass in multiple arguments 
console.log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));
 
// nest styles 
console.log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));
 
// nest styles of the same type even (color, underline, background) 
console.log(chalk.green(
    'I am a green line ' +
    chalk.blue.underline.bold('with a blue substring') +
    ' that becomes green again!'
));
*/