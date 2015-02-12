var Cli = require('./src/eve-cli-refactored'),
    Brain = require('./src/brain/'),
    argv = require('minimist')(process.argv.slice(2));

var cli = new Cli(argv, Brain);

cli.init();