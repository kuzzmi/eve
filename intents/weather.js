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
        var data = JSON.parse(resp.body);
        var weather;
        switch (type) {
            case 'day':
                var utDay = dateToUT(datetime.value);

                weather = data.list.filter(function(item) {
                    return utDay >= item.dt && item.dt - utDay < 86400;
                }).map(function(item) {
                    return new ForecastDailyItem(item);
                });
                console.log(JSON.stringify(weather, true, '  '));
                console.log(utDay);
                break;

            case 'hour':
                var utHour = dateToUT(datetime.value);

                weather = data.list.filter(function(item) {
                    return item.dt <= utHour && utHour - item.dt < 10800;
                }).map(function(item) {
                    return new ForecastItem(item);
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
                    return new ForecastItem(item);
                });

                // console.log(JSON.stringify(weather, true, ' '));
                break;
        }
        callback(weather);
    });
};

function ForecastDailyItem(params) {
    this.datetime = new Date(params.dt * 1000);
    this.temp = params.temp;

    for (var t in this.temp) {
        this.temp[t] = +(this.temp[t].toFixed(0));
    }

    this.pressure = params.pressure;
    this.weather = params.weather;
    this.humidity = params.humidity;
    this.description = params.weather[0].description;
    this.speed = params.speed;
    this.deg = params.deg;
    this.clouds = params.clouds;
    this.snow = params.snow > 0;
    this.rain = params.rain > 0;
};

ForecastDailyItem.prototype.toString = function(params) {
    var me = this;
    switch (params.details) {
        case 'all':
            return 'Maximum is ' + me.temp.max + ' and ' +
                'minimum is ' + me.temp.min + ' degrees outside. ' +
                'The wind is ' + me.speed + ' meters per second. ' +
                'I expect ' + me.description;
        case 'temperature':
            return this.temp.morn + ' in the morning, ' +
                this.temp.day + ' in the day, ' +
                this.temp.eve + ' in the evening, ' +
                this.temp.night + ' in the night.';
        case 'precipitation':
            var buildPrecipitationString = function() {
                var askedPrecip = params.verbosity ?
                    params.verbosity.replace('yes_no', '') : undefined;
                var anotherPrecip = askedPrecip === 'snow' ? 'rain' : 'snow';

                if (askedPrecip) {
                    if (me.rain && me.snow) {
                        return 'Yes, it is going to ' +
                            askedPrecip + ' and ' +
                            anotherPrecip + ' is also expected';
                    } else if (me[askedPrecip]) {
                        return 'Yes, it is going to ' + askedPrecip;
                    } else if (me[anotherPrecip]) {
                        return 'No, but it is going to ' + anotherPrecip;
                    } else {
                        return 'No';
                    }
                } else {
                    if (me.rain && me.snow) {
                        return 'It is going to rain and snow';
                    } else if (me.rain) {
                        return 'It is going to rain';
                    } else if (me.snow) {
                        return 'It is going to snow';
                    } else {
                        return 'I expect no precipitation';
                    }
                }

            }
            return buildPrecipitationString();
    }
}

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
            return 'Yes, it is going to rain and snow';
        } else if (me.rain) {
            return 'Yes, it is going to rain';
        } else if (me.snow) {
            return 'Yes, it is going to snow';
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
        default:
            return params.details;
    }
}

function WeatherIntent(params) {
    this.details = params.weather_details ?
        params.weather_details[0].value :
        undefined;

    this.verbosity = params.weather_verbosity ?
        params.weather_verbosity[0].value :
        undefined;

    this.datetime = params.datetime[0];

    console.log(this.verbosity);
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

    // return this._getHumanLikeTime();
}

module.exports = function(params) {
    return new WeatherIntent(params);
}