var request = require('request');
var Forecast = require('./forecast');

var dateToUT = function(date) {
    return (new Date(date).getTime()) / 1000;
};

var getForecast = function(type, datetime, callback) {
    var baseUrl = 'http://api.openweathermap.org/data/2.5/';
    var url = baseUrl;

    var params = {
        q: 'basel,ch',
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
                weather = [new Forecast(data)];
                break;
            case 'day':
                var msDay = new Date(datetime.value).setHours(12);

                weather = data.list.filter(function(item) {
                    return item.dt * 1000 - msDay === 0;
                }).map(function(item) {
                    return new Forecast(item);
                });
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

WeatherIntent.prototype.exec = function(callback) {
    var me = this;
    var forecastType;
    if (me.datetime) {
        switch (me.datetime.type) {
            case 'value':
                forecastType = me.datetime.grain;
                break;
            case 'interval':
                forecastType = 'interval';
                break;
        }
        getForecast(forecastType, me.datetime, function(weather) {
            weather.map(function(item) {
                callback(item.toString({
                    details: me.details,
                    verbosity: me.verbosity
                }));
            });
        });
    } else {

    }
}

module.exports = function(params) {
    return new WeatherIntent(params);
}