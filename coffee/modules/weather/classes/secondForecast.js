function SecondForecast(params) {
    this.temp = +(params.main.temp).toFixed(0);
    this.description = params.weather[0].description.toLowerCase();
    this.humidity = params.main.humidity;
    this.wind = +(params.wind.speed).toFixed(0);
    this.cityName = params.name;
    this.snow = params.snow ? params.snow['3h'] > 0 : false;
    this.rain = params.rain ? params.rain['3h'] > 0 : false;
};

SecondForecast.prototype.toString = function(params) {
    var phrase = {
        code: undefined,
        args: undefined
    };

    var textReport = undefined;

    switch (params.details) {
        case 'all':
            phrase.code = ['second', params.details].join('.');
            phrase.args = [this.cityName, this.temp, this.description];

            textReport = [
                this.cityName + ': ' + this.temp + '°C, ' + this.description
            ].join('\r\n');

            break;
        case 'temperature':
            var threshold = 4;
            var cold = this.temp <= threshold;
            var verbosity = params.verbosity ?
                params.verbosity.replace('yes_no_', '') : undefined;
            var code = ['second', params.details].join('.');

            switch (verbosity) {
                case 'general':
                    code += '.general';
                    break;
                case 'cold':
                    code += '.yes_no';
                    cold ? code += '.yes' : code += '.no';
                    break;
                case 'warm':
                    code += '.yes_no';
                    !cold ? code += '.yes' : code += '.no';
                    break;
                default:
                    console.log('Unfortunately...');
                    break;
            }

            phrase.code = code;
            phrase.args = [this.temp];
            break;
        case 'precipitation':
            var code = ['second', params.details, 'yes_no'].join('.');
            var asked = params && params.verbosity ?
                params.verbosity.replace('yes_no_', '') : undefined;

            this[asked] ? code += '.yes' : code += '.no';

            phrase.code = code;
            break;
    }

    return [phrase, textReport];
};

module.exports = SecondForecast;