'use strict';

function GenericForecast(params, type) {
    var SpecificForecast = require('./classes/' + type + 'Forecast');

    this.item = new SpecificForecast(params);

    this.vocabulary = __dirname + '/vocabulary.json';
};

GenericForecast.prototype.toString = function(params) {

    var result = this.item.toString(params);

    return {
        voice: {
            vocabulary: this.vocabulary,
            code: result[0].code,
            args: result[0].args
        },
        text: result[1]
    };
};

module.exports = GenericForecast;