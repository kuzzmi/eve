(function() {
  var BaseModule, Reference,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BaseModule = require('../base');

  Reference = (function(superClass) {
    extend(Reference, superClass);

    function Reference(params) {
      this.params = params;
      Reference.__super__.constructor.call(this, this.params);
      this.type = this.getEntity('reference_type', 'greeting');
      this.name = this.getEntity('reference_name_type', 'neutral');
      this.vocabulary = __dirname + '/vocabulary.json';
    }

    Reference.prototype.exec = function() {
      var hours, now, timeOfDay;
      now = new Date();
      hours = now.getHours();
      timeOfDay = (function() {
        switch (false) {
          case !(hours >= 4 && hours < 12):
            return 'morning';
          case !(hours >= 12 && hours < 18):
            return 'afternoon';
          case !(hours >= 18 && hours < 23):
            return 'evening';
          default:
            return 'night';
        }
      })();
      return Reference.__super__.exec.call(this, {
        voice: {
          vocabulary: this.vocabulary,
          code: this.type,
          args: [timeOfDay, 'sir']
        }
      });
    };

    return Reference;

  })(BaseModule);

  module.exports = Reference;

}).call(this);