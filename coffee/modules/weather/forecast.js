'use strict';

function GenericForecast(params, type) {
    var SpecificForecast = require('./classes/' + type + 'Forecast');

    this.item = new SpecificForecast(params);

    this.vocabulary = __dirname + '/vocabulary.json';
};

GenericForecast.prototype.toString = function(params) {

    var result = this.item.toString(params);

    console.log(result);

    return {
        vocabulary: this.vocabulary,
        code: result.code,
        args: result.args
    };
};

module.exports = GenericForecast;