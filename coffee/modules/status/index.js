// Generated by CoffeeScript 1.9.0
var BaseModule, Q, Status, Weather, colors,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

BaseModule = require('../base');

Q = require('q');

colors = require('colors');

Weather = require('../weather');

Status = (function(_super) {
  __extends(Status, _super);

  function Status(_at_params) {
    this.params = _at_params;
    Status.__super__.constructor.call(this, this.params);
    this.action = this.getEntity('status_action', null);
    this.type = this.getEntity('status_type', null);
    this.value = this.getEntity('status_value', null);
    this.vocabulary = __dirname + '/vocabulary.json';
  }

  Status.prototype.exec = function() {
    var deferred, hours, response, timeOfDay, weather;
    hours = new Date().getHours();
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
    if (this.action === 'update' && this.type === 'awake' && this.value === 'true') {
      deferred = Q.defer();
      response = {
        voice: {
          vocabulary: this.vocabulary,
          code: [this.action, this.type, this.value].join('.'),
          args: ['sir', timeOfDay]
        }
      };
      weather = new Weather({
        datetime: [
          {
            type: 'value',
            grain: 'day',
            value: new Date()
          }
        ]
      });
      weather.exec().then((function(_this) {
        return function(forecast) {
          return Status.__super__.exec.call(_this, response).then(function(res) {
            res.text = res.text + '. ' + forecast.text;
            res.voice = res.voice + '. ' + forecast.voice;
            return res;
          }).then(deferred.resolve);
        };
      })(this));
      return deferred.promise;
    } else {
      response = {
        voice: {
          vocabulary: this.vocabulary,
          code: [this.action, this.type, this.value].join('.'),
          args: ['sir', timeOfDay]
        }
      };
      return Status.__super__.exec.call(this, response);
    }
  };

  return Status;

})(BaseModule);

module.exports = Status;
