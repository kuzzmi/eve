'use strict';

var getPhrase = require('./vocabulary');

function Forecast(params) {
    this.datetime = new Date(params.dt * 1000);
    this.description = params.weather[0].description;

    if (params.temp && params.temp.min) {
        this.temp = {
            min: Math.round(params.temp.min),
            max: Math.round(params.temp.max)
        }
        this.snow = params.snow > 0;
        this.rain = params.rain > 0;
        this.clouds = params.clouds;
        this.windSpeed = params.speed;
    } else {
        this.temp = {
            min: Math.round(params.main.temp_min),
            max: Math.round(params.main.temp_max)
        }
        this.snow = params.snow ? params.snow['3h'] > 0 : false;
        this.rain = params.rain ? params.rain['3h'] > 0 : false;
        this.clouds = params.clouds.all;
        this.windSpeed = params.wind.speed;
    }
};

Forecast.prototype.toString = function(params) {
    var me = this;
    switch (params.details) {
        case 'all':
            return getPhrase('all', [
                this.temp.max,
                this.temp.min,
                this.windSpeed,
                this.description
            ]);
        case 'temperature':
            return this._tempString(params);
        case 'precipitation':
            return this._precString(params);
        default:
            break;
    }
};

Forecast.prototype._tempString = function(params) {
    var asked = params.verbosity ?
        params.verbosity.replace('yes_no_', '') : undefined;

    var isItCold = this.temp.max < 4;

    var _gp = function(what, params) {
        return getPhrase('temperature.' + what, params);
    }

    switch (asked) {
        case 'cold':
            if (isItCold) {
                return _gp('yes_no.yes', this.temp.max);
            } else {
                console.log(this.temp);
                return _gp('yes_no.no', this.temp.max);
            }
        case 'warm':
            if (isItCold) {
                return _gp('yes_no.no', this.temp.max);
            } else {
                return _gp('yes_no.yes', this.temp.max);
            }
    }
};

Forecast.prototype._precString = function(params) {
    var askedPrecision = params && params.verbosity ?
        params.verbosity.replace('yes_no_', '') : undefined;
    var anotherPrecision = askedPrecision === 'snow' ? 'rain' : 'snow';

    var _gp = function(what, params) {
        return getPhrase('precipitation.' + what, params);
    }

    if (askedPrecision) {
        if (this.rain && this.snow) {
            return _gp('yes_no.both', [askedPrecision, anotherPrecision]);
        } else if (this[askedPrecision]) {
            return _gp('yes_no.yes', askedPrecision);
        } else if (this[anotherPrecision]) {
            return _gp('yes_no.yes', anotherPrecision);
        } else {
            return _gp('yes_no.no');
        }
    } else {
        if (this.rain && this.snow) {
            return _gp('rain_and_snow');
        } else if (this.rain) {
            return _gp('rain');
        } else if (this.snow) {
            return _gp('snow');
        } else {
            return _gp('nothing');
        }
    }
};

module.exports = Forecast;