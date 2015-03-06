`colors = require('colors');

function DayForecast(params) {
    this.dt = new Date(params.dt * 1000);
    this.temp = {
        morning: +(params.temp.morn).toFixed(0),
        day: +(params.temp.day).toFixed(0),
        evening: +(params.temp.eve).toFixed(0),
        night: +(params.temp.night).toFixed(0),
        max: +(params.temp.max).toFixed(0),
        min: +(params.temp.min).toFixed(0)
    };
    this.description = params.weather[0].description.toLowerCase();
    this.humidity = params.humidity;
    this.wind = +(params.speed).toFixed(1);
    this.cityName = params.city.name;
    this.snow = params.snow ? params.snow > 0 : false;
    this.rain = params.rain ? params.rain > 0 : false;

};

DayForecast.prototype.toString = function(params) {
    var phrase = {
        code: 'day',
        args: undefined
    };

    var textReport = undefined;
    var notification = {
        list: undefined,
        text: undefined
    }

    switch (params.details) {
        case 'all':
            phrase.code = ['day', params.details].join('.');
            phrase.args = [
                this.cityName,
                this.temp.morning,
                this.temp.day,
                this.temp.evening,
                this.temp.night,
                this.description
            ];

            textReport = [
                '',
                '              ' + this.cityName.yellow.bold,
                '     morning'.yellow + ': ' + this.temp.morning,
                '         day'.yellow + ': ' + this.temp.day,
                '     evening'.yellow + ': ' + this.temp.evening,
                '       night'.yellow + ': ' + this.temp.night,
                ' description'.yellow + ': ' + this.description
            ].join('\r\n');

            break;
        case 'temperature':
            var threshold = 4;

            var cold = [];

            for (var i in this.temp) {
                if (i !== 'min' && i !== 'max' &&
                    this.temp[i] < threshold) {
                    cold.push(i);
                }
            }

            var verbosity = params.verbosity ?
                params.verbosity.replace('yes_no_', '') : undefined;
            var code = ['day', params.details].join('.');

            switch (verbosity) {
                case 'general':
                    code += '.general';
                    phrase.args = [this.temp.max, this.temp.min];
                    break;
                case 'cold':
                case 'warm':
                    code += '.yes_no';
                    cold.length > 0 ? code += '.yes' : code += '.no';
                    var temps = [];
                    for (var t in cold) {
                        temps.push(this.temp[cold[t]]);
                    }
                    phrase.args = [cold.join(', '), temps.join(', ')];
                    break;
                default:
                    console.log('Unfortunately...');
                    break;
            }

            phrase.code = code;
            break;
        case 'precipitation':
            var code = ['day', params.details, 'yes_no'].join('.');
            var asked = params && params.verbosity ?
                params.verbosity.replace('yes_no_', '') : undefined;

            this[asked] ? code += '.yes' : code += '.no';

            phrase.code = code;
            break;
    }

    return [phrase, textReport];
};

module.exports = DayForecast;`