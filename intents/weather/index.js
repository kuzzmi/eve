var request = require('request');

var getPhrase = require('./vocabulary');

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
            case 'second':
                weather = [new ForecastItem(data)];
                break;
            case 'day':
                var msDay = new Date(datetime.value).setHours(12);

                weather = data.list.filter(function(item) {
                    return item.dt * 1000 - msDay === 0;
                }).map(function(item) {
                    return new ForecastDailyItem(item);
                });
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
            var askedPrecision = params.verbosity ?
                params.verbosity.replace('yes_no_', '') : undefined;

            if (askedPrecision) {
                var getPeek = function(peekType) {
                    for (var i in me.temp) {
                        if (i !== peekType && me.temp[i] === me.temp[peekType]) {
                            if (i === 'morn') {
                                return 'morning';
                            } else if (i === 'day') {
                                return 'day';
                            } else if (i === 'eve') {
                                return 'evening';
                            } else if (i === 'night') {
                                return 'night';
                            };
                        }
                    }
                };

                var minimumTime = getPeek('min');
                var maximumTime = getPeek('max');

                switch (askedPrecision) {
                    case 'cold':
                        return 'The lowest temperature tomorrow is in the ' +
                            minimumTime + ', ' + this.temp.min + ' degrees and ' +
                            'the highest is in the ' + maximumTime + ', ' +
                            this.temp.max + ' degrees.';
                    case 'warm':
                        return 'The highest temperature tomorrow is in the ' +
                            maximumTime + ', ' + this.temp.max + ' degrees and ' +
                            'the lowest is in the ' + minimumTime + ', ' +
                            this.temp.min + ' degrees.';
                }
            } else {
                return this.temp.morn + ' in the morning, ' +
                    this.temp.day + ' in the day, ' +
                    this.temp.eve + ' in the evening, ' +
                    this.temp.night + ' in the night.';
            }
            break;
        case 'precipitation':
            return buildPrecipitationString(me, params);
    }
}

var buildPrecipitationString = function(me, params) {
    var askedPrecision = params.verbosity ?
        params.verbosity.replace('yes_no_', '') : undefined;
    var anotherPrecision = askedPrecision === 'snow' ? 'rain' : 'snow';

    var _gp = function(what, params) {
        return getPhrase('precipitation.' + what, params);
    }

    if (askedPrecision) {
        if (me.rain && me.snow) {
            return _gp('yes_no.both', [askedPrecision, anotherPrecision]);
        } else if (me[askedPrecision]) {
            return _gp('yes_no.yes', askedPrecision);
        } else if (me[anotherPrecision]) {
            return _gp('yes_no.yes', anotherPrecision);
        } else {
            return _gp('yes_no.no');
        }
    } else {
        if (me.rain && me.snow) {
            return _gp('rain_and_snow');
        } else if (me.rain) {
            return _gp('rain');
        } else if (me.snow) {
            return _gp('snow');
        } else {
            return _gp('nothing');
        }
    }
};

var buildTemperatureString = function(me, params) {
    var askedPrecision = params.verbosity ?
        params.verbosity.replace('yes_no_', '') : undefined;

    switch (askedPrecision) {
        case 'cold':
            if (me.temp < 4) {
                return getPhrase('temperature.yes_no.yes', me.temp);
            } else {
                return getPhrase('temperature.yes_no.no', me.temp);
            }
        case 'warm':
            if (me.temp < 4) {
                return getPhrase('temperature.yes_no.no', me.temp);
            } else {
                return getPhrase('temperature.yes_no.yes', me.temp);
            }
        case 'default':
            return dateFormat(me.datetime) +
                ' it\'s going to be ' + me.temp + ' degrees outside';
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

    switch (params.details) {
        case 'all':
            return dateFormat(me.datetime) +
                ' it\'s going to be ' + me.temp + ' degrees outside. ' +
                'The wind is ' + me.wind + ' meters per second. ' +
                'Overall condition is ' + me.description;
        case 'precipitation':
            return buildPrecipitationString(me, params);
        case 'temperature':
            return buildTemperatureString(me, params);
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