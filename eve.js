var Cli = require('./src/cli'),
    WebServer = require('./src/webserver'),
    Brain = require('./src/brain/'),
    argv = require('minimist')(process.argv.slice(2));

var cli = new Cli(Brain, argv);
var webserver = new WebServer(Brain, 3000);

module.exports = {
    cli: cli,
    webserver: webserver
};