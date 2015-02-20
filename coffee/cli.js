// Generated by CoffeeScript 1.9.0
var CLI, colors, readline;

readline = require('readline');

colors = require('colors');

CLI = (function() {
  function CLI(_at_core, _at_argv) {
    this.core = _at_core;
    this.argv = _at_argv;
    this.core.brain.on('output', (function(_this) {
      return function(output) {
        if (output.text) {
          _this.print(output.text);
        }
        if (output.voice) {
          return _this.say(output.voice);
        }
      };
    })(this));
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.rl.on('line', (function(_this) {
      return function(line) {
        _this.core.brain.emit('input', line);
        return _this.rl.prompt(true);
      };
    })(this));
    this.rl.setPrompt('Igor: ');
    this.rl.prompt(true);
    if (this.argv.c) {
      this.core.brain.emit('input', {
        intent: this.argv.c
      });
    }
  }

  CLI.prototype.say = function(data) {
    return this.core.speech.exec(data);
  };

  CLI.prototype.print = function(data) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log('Eve: ' + data);
    return this.rl.prompt(true);
  };

  return CLI;

})();

module.exports = CLI;
