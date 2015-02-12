var Cli = require('./src/cli'),
    Brain = require('./src/brain/'),
    argv = require('minimist')(process.argv.slice(2));

var cli = new Cli(Brain, argv).init();

module.exports = {
    cli: cli
};