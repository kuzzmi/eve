(function() {
  var BaseModule, Planning, Q, Status, Weather, colors,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BaseModule = require('../base');

  Q = require('q');

  colors = require('colors');

  Planning = require('../planning');

  Weather = require('../weather');

  Status = (function(superClass) {
    extend(Status, superClass);

    function Status(params) {
      this.params = params;
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
      response = {
        voice: {
          vocabulary: this.vocabulary,
          code: [this.action, this.type, this.value].join('.'),
          args: ['sir', timeOfDay]
        }
      };
      if (this.action === 'update' && this.type === 'awake' && this.value === 'true') {
        deferred = Q.defer();
        weather = new Weather({
          entities: {
            datetime: [
              {
                type: 'value',
                grain: 'day',
                value: new Date()
              }
            ]
          }
        });
        Status.__super__.exec.call(this, response).then(function(res) {
          return weather.exec().then((function(_this) {
            return function(forecast) {
              var result;
              result = {};
              result.text = res.text + '. ' + forecast.text;
              result.voice = res.voice + '. ' + forecast.voice;
              return deferred.resolve(result);
            };
          })(this));
        });
        return deferred.promise;
      }
      if (this.action === 'update' && this.type === 'athome' && this.value === 'true') {
        deferred = Q.defer();
        new Planning({
          entities: {
            planning_action: [
              {
                value: 'count_at_home'
              }
            ]
          }
        }).exec().then((function(_this) {
          return function(tasks) {
            console.log(tasks);
            return Status.__super__.exec.call(_this, response).then(function(res) {
              res.text = res.text + '. ' + tasks.text;
              res.voice = res.voice + '. ' + tasks.voice;
              return res;
            });
          };
        })(this)).then(deferred.resolve);
        return deferred.promise;
      } else {
        return Status.__super__.exec.call(this, response);
      }
    };

    return Status;

  })(BaseModule);

  module.exports = Status;

}).call(this);
