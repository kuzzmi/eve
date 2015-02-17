'use strict';

function GenericForecast(params, type) {
    var SpecificForecast = require('./classes/' + type + 'Forecast');

    this.item = new SpecificForecast(params);
    // console.log(require('util').inspect(params, true, 10, true));

    // this.datetime = new Date(params.dt * 1000);
    // this.description = params.weather[0].description;

    // if (params.temp && params.temp.min) {
    //     this.temp = {
    //         min: Math.round(params.temp.min),
    //         max: Math.round(params.temp.max)
    //     }
    //     this.snow = params.snow > 0;
    //     this.rain = params.rain > 0;
    //     this.clouds = params.clouds;
    //     this.windSpeed = params.speed;
    // } else {
    //     this.temp = {
    //         min: Math.round(params.main.temp_min),
    //         max: Math.round(params.main.temp_max)
    //     }
        
    //     this.clouds = params.clouds.all;
    //     this.windSpeed = params.wind.speed;
    // }

    // this.name = params.name;
    this.vocabulary = __dirname + '/vocabulary.json';
};

/*
    // second
    Is it cold in Kiev now? - No, 5 degrees.
    // second
    Is it cold in Kiev now? - Yes, 3 degrees.
    
    // second
    Is it cold now? - No, 5 degrees.
    // second
    Is it cold now? - Yes, 3 degrees.
    
    // daily
    Is it cold tomorrow? - Only in the morning and in the evening. 3 and -1 degrees accordingly.
    // daily
    Is it cold tomorrow? - Only in the morning, 3 degrees.
    
    // daily
    What is the weather tomorrow in Paris? - Forecast for Paris. -2 in the morning, 2 in the day, 1 in the evening and -4 in the night. Sky is clear.
    // daily
    What is the weather tomorrow in Paris? - Forecast for Paris. -2 in the morning, 2 in the day, 1 in the evening and -4 in the night. Pr

    // hourly
    Is it cold tomorrow at 2 pm?
 */

GenericForecast.prototype.toString = function(params) {

    var result = this.item.toString(params);
    return {
        vocabulary: this.vocabulary,
        code: result.code,
        args: result.args
    };

    // switch (params.details) {
    //     case 'all':
    //         phrase.code = 'all';
    //         phrase.args = [
    //             this.name,
    //             this.temp.max,
    //             this.temp.min,
    //             this.windSpeed,
    //             this.description
    //         ];
    //         break;
    //     case 'temperature':
    //         return this._tempString(params);
    //     case 'precipitation':
    //         return this._precString(params);
    //     default:
    //         break;
    // }

    // return phrase;
};

// Forecast.prototype._tempString = function(params) {
//     var asked = params.verbosity ?
//         params.verbosity.replace('yes_no_', '') : undefined;

//     var isItCold = this.temp.max < 4;

//     var _gp = function(what, params) {
//         return getPhrase('temperature.' + what, params);
//     }

//     var phrase = {
//         vocabulary: this.vocabulary,
//         code: 'temperature.yes_no.',
//         args: [this.temp.max]
//     };

//     switch (asked) {
//         case 'cold':
//             isItCold ? phrase.code += 'yes' : phrase.code += 'no';
//             console.log(phrase.code)
//             break;
//         case 'warm':
//             !isItCold ? phrase.code += 'yes' : phrase.code += 'no';
//             break;
//     }

//     return phrase;
// };

// Forecast.prototype._precString = function(params) {
//     var askedPrecision = params && params.verbosity ?
//         params.verbosity.replace('yes_no_', '') : undefined;
//     var anotherPrecision = askedPrecision === 'snow' ? 'rain' : 'snow';

//     var phrase = {
//         vocabulary: this.vocabulary,
//         code: 'precipitation.',
//         args: undefined
//     };

//     if (askedPrecision) {
//         phrase.code += 'yes_no.';

//         if (this.rain && this.snow) {
//             phrase.code += 'both';
//             phrase.args = [askedPrecision, anotherPrecision];
//         } else if (this[askedPrecision]) {
//             phrase.code += 'yes';
//             phrase.args = [askedPrecision];
//         } else if (this[anotherPrecision]) {
//             phrase.code += 'yes';
//             phrase.args = [anotherPrecision];
//         } else {            
//             phrase.code += 'no';
//         }
//     } else {
//         if (this.rain && this.snow) {
//             phrase.code += 'rain_and_snow';
//         } else if (this.rain) {
//             phrase.code += 'rain';
//         } else if (this.snow) {
//             phrase.code += 'snow';
//         } else {
//             phrase.code += 'nothing';
//         }
//     }

//     return phrase;
// };

module.exports = GenericForecast;