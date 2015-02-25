(function() {
  var BaseModule, Forecast, Weather, q, request,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  request = require('request');

  q = require('q');

  BaseModule = require('../base');

  Forecast = require('./forecast');

  Weather = (function(superClass) {
    extend(Weather, superClass);

    function Weather(params1) {
      this.params = params1;
      Weather.__super__.constructor.call(this, this.params);
      this.location = this.getEntity('location', 'Basel');
      this.details = this.getEntity('weather_details', 'all');
      this.verbosity = this.getEntity('weather_verbosity', null);
      if (this.entities && this.entities.datetime) {
        this.datetime = this.entities.datetime[0];
      } else {
        this.datetime = {
          type: 'value',
          grain: 'second',
          value: new Date()
        };
      }
    }

    Weather.prototype.forecast = function(successCallback, errorCallback) {
      var params, type, url;
      if (this.datetime.type === 'value') {
        type = this.datetime.grain;
      }
      if (this.datetime.type === 'interval') {
        type = 'interval';
      }
      url = 'http://api.openweathermap.org/data/2.5/';
      params = {
        q: this.location,
        units: 'metric',
        cnt: '7'
      };
      switch (type) {
        case 'second':
          url += 'weather';
          break;
        case 'hour' || 'interval':
          url += 'forecast';
          break;
        case 'day':
          url += 'forecast/daily';
      }
      return request({
        url: url,
        qs: params
      }, (function(_this) {
        return function(err, resp, data) {
          var day, daysFromNow, diff, e, interval, today, ut, weather;
          try {
            data = JSON.parse(resp.body);
          } catch (_error) {
            e = _error;
            errorCallback(e);
          }
          switch (type) {
            case 'second':
              weather = new Forecast(data, type);
              break;
            case 'day':
              today = new Date();
              day = new Date(_this.datetime.value);
              diff = new Date(day - today);
              daysFromNow = Math.floor(diff / 1000 / 60 / 60 / 24);
              weather = data.list.map(function(item) {
                item.city = data.city;
                return item;
              })[daysFromNow + 1];
              weather = new Forecast(weather, type);
              break;
            case 'hour':
              ut = Math.floor(new Date(_this.datetime.value).getTime() / 1000);
              weather = data.list.filter(function(item) {
                return item.dt <= ut && ut - item.dt < 10800;
              })[0];
              weather = new Forecast(weather, 'second');
              break;
            case 'interval':
              interval = {
                from: Math.floor(new Date(_this.datetime.from.value).getTime() / 1000),
                to: Math.floor(new Date(_this.datetime.to.value).getTime() / 1000)
              };
              weather = data.list.filter(function(item) {
                return item.dt > interval.from && item.dt < interval.to;
              })[0];
              weather = new Forecast(weather, 'second');
          }
          return successCallback(weather);
        };
      })(this));
    };

    Weather.prototype.exec = function() {
      var deferred;
      deferred = q.defer();
      this.forecast((function(_this) {
        return function(weather) {
          var output;
          output = weather.toString({
            details: _this.details,
            verbosity: _this.verbosity
          });
          return Weather.__super__.exec.call(_this, output).then(deferred.resolve);
        };
      })(this), function(error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    };

    return Weather;

  })(BaseModule);

  module.exports = Weather;

}).call(this);
