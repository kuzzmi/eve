(function() {
  var Brain, Core, speech;

  Brain = require('./classes/brain');

  speech = require('./classes/speech');

  Core = (function() {
    function Core(params) {
      this.speech = speech;
      this.brain = new Brain();
    }

    Core.init = function(params) {
      return new Core(params);
    };

    return Core;

  })();

  module.exports = Core;

}).call(this);