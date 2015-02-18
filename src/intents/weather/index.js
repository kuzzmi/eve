var request = require('request');
var Forecast = require('./forecast');
var Q = require('q');

var dateToUT = function(date) {
    return (new Date(date).getTime()) / 1000;
};

var getForecast = function(type, datetime, location, callback) {
    var baseUrl = 'http://api.openweathermap.org/data/2.5/';
    var url = baseUrl;

    var params = {
        q: location,
        units: 'metric',
        cnt: '7'
    };

    switch (type) {
        case 'second':
            url += 'weather';
            break;
        case 'hour':
        case 'interval':
            url += 'forecast';
            break;
        case 'day':
            url += 'forecast/daily';
            break;
    }

    request({
        url: url,
        qs: params
    }, function(req, resp) {
        var data = JSON.parse(resp.body);
        var weather;

        switch (type) {
            case 'second':
                weather = new Forecast(data, type);
                break;
            case 'day':
                console.log(require('util').inspect(data, true, 10, true))
                var today = new Date();
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                today.setMilliseconds(0);

                var day = new Date(datetime.value);
                var diff = new Date(day - today);
                var daysFromToday = diff.getTime() / 1000 / 60 / 60 / 24;

                weather = data.list.map(function(item) {
                    item.city = data.city;
                    return item;
                })[daysFromToday];

                weather = new Forecast(weather, type);
                break;
            case 'hour':
                var utHour = dateToUT(datetime.value);

                weather = data.list.filter(function(item) {
                    return item.dt <= utHour && utHour - item.dt < 10800;
                }).map(function(item) {
                    return new Forecast(item);
                });

                break;

            case 'interval':
                var utInterval = {
                    from: dateToUT(datetime.from.value),
                    to: dateToUT(datetime.to.value)
                };

                weather = data.list.filter(function(item) {
                    return item.dt > utInterval.from && item.dt < utInterval.to;
                }).map(function(item) {
                    return new Forecast(item);
                });
                break;
        }
        callback(weather);
    });
};

function WeatherIntent(params) {
    this.location = params.location ?
        params.location[0].value :
        'Basel';

    this.details = params.weather_details ?
        params.weather_details[0].value :
        undefined;

    this.verbosity = params.weather_verbosity ?
        params.weather_verbosity[0].value :
        undefined;

    this.datetime = params.datetime ? params.datetime[0] : {
        type: 'value',
        grain: 'second',
        value: new Date()
    };
};

WeatherIntent.prototype.exec = function() {
    var me = this,
        forecastType,
        deferred = Q.defer();

        
    if (me.datetime) {
        switch (me.datetime.type) {
            case 'value':
                forecastType = me.datetime.grain;
                break;
            case 'interval':
                forecastType = 'interval';
                break;
        }
        getForecast(forecastType, me.datetime, me.location, function(weather) {            
            deferred.resolve(weather.toString({
                details: me.details,
                verbosity: me.verbosity
            }));
            
        });
    } else {
    }

    return deferred.promise;
}

module.exports = function(params) {
    return new WeatherIntent(params);
}