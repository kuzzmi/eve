(function() {
  var CLI, Core, WS, argv, cli, core, ws;

  Core = require('./core');

  CLI = require('./cli');

  WS = require('./webserver');

  argv = require('minimist')(process.argv.slice(2));

  core = Core.init();

  cli = new CLI(core, argv);

  ws = new WS(core);

}).call(this);
