var request = require('request');

var dateToUT = function(date) {
    return (new Date(date).getTime()) / 1000;
}

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
        console.log(url);
        var data = JSON.parse(resp.body);
        var weather;
        switch (type) {
            case 'hour':
                var utHour = dateToUT(datetime.value);

                weather = data.list.filter(function(item) {
                    return item.dt <= utHour && utHour - item.dt < 10800;
                }).map(function(item) {
                    return new ForecastItem(item);
                });

                // console.log(JSON.stringify(weather, true, ' '));
                break;

            case 'interval':
                var utInterval = {
                    from: dateToUT(datetime.from.value),
                    to: dateToUT(datetime.to.value)
                };

                weather = data.list.filter(function(item) {
                    return item.dt > utInterval.from && item.dt < utInterval.to;
                }).map(function(item) {
                    return new ForecastItem(item);
                });

                // console.log(JSON.stringify(weather, true, ' '));
                break;
        }
        callback(weather);
    });
};

function ForecastItem(params) {
    this.datetime = new Date(params.dt * 1000);
    this.temp = +(params.main.temp).toFixed(0);
    this.description = params.weather[0].description;
    this.clouds = params.clouds.all;
    this.snow = params.snow ? params.snow['3h'] : 0;
    this.rain = params.rain ? params.rain['3h'] : 0;
    this.wind = parseInt(params.wind.speed);
};

ForecastItem.prototype.toString = function(params) {
    var me = this;

    var dateFormat = function(date) {
        function timeToHR(date) {
            date = date || new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();

            if (minutes > 0) {
                if (minutes < 30) {
                    return minutes + ' minutes past ' + hours;
                } else {
                    return (60 - minutes) + ' to ' + (hours + 1);
                }
            } else {
                return hours + ' hours';
            }
        }

        return 'At ' + timeToHR(date);
    };

    var buildPrecipitationString = function() {
        if (me.rain && me.snow) {
            return 'it is going to rain and snow';
        } else if (me.rain) {
            return 'it is going to rain';
        } else if (me.snow) {
            return 'it is going to snow';
        } else {
            return 'No';
        }
    }

    switch (params.details) {
        case 'all':
            return dateFormat(me.datetime) +
                ' it\'s going to be ' + me.temp + ' degrees outside. ' +
                'The wind is ' + me.wind + ' meters per second. ' +
                'Overall condition is ' + me.description;
        case 'precipitation':
            return buildPrecipitationString();
    }
}

function WeatherIntent(params) {
    this.details = params.weather_details ?
        params.weather_details[0].value :
        undefined;

    this.datetime = params.datetime[0];
    /*params.datetime ?*/
    // .value; //:
    /*undefined*/
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
                    details: me.details
                }));
            });
        });
    } else {

    }

    // return this._getHumanLikeTime();
}

module.exports = function(params) {
    return new WeatherIntent(params);
}