(function() {
  var BaseModule, Time,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BaseModule = require('../base');

  Time = (function(superClass) {
    extend(Time, superClass);

    function Time(params) {
      this.params = params;
      Time.__super__.constructor.call(this, this.params);
    }

    Time.prototype.humanLikeTime = function(date) {
      var hours, minutes, text, voice;
      date = date || new Date();
      hours = date.getHours();
      minutes = date.getMinutes();
      text = '';
      if (hours < 10) {
        text = '0' + hours;
      } else {
        text = hours;
      }
      text += ':';
      if (minutes < 10) {
        text += '0' + minutes;
      } else {
        text += minutes;
      }
      if (minutes > 0) {
        if (minutes < 15) {
          voice = minutes + ' minutes past ' + hours;
        } else if (minutes === 15) {
          voice = 'Quarter past ' + hours;
        } else if (minutes < 30) {
          voice = minutes + ' minutes past ' + hours;
        } else if (minutes === 30) {
          voice = 'Half past ' + hours;
        } else if (minutes < 45) {
          voice = (60 - minutes) + ' to ' + (hours + 1);
        } else if (minutes === 45) {
          voice = 'Quarter to ' + (hours + 1);
        } else if (minutes < 60) {
          voice = (60 - minutes) + ' to ' + (hours + 1);
        }
      } else {
        voice = hours + ' o\'clock';
      }
      return {
        text: text,
        voice: {
          phrase: voice
        }
      };
    };

    Time.prototype.exec = function() {
      return Time.__super__.exec.call(this, this.humanLikeTime());
    };

    return Time;

  })(BaseModule);

  module.exports = Time;

}).call(this);