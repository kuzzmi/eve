// var googleTranslate = require('google-translate')(apiKey);

function TranslateIntent(params) {
    this.phrase = params.phrase_to_translate ?
        params.phrase_to_translate[0].value :
        undefined;
    this.from = params.from ?
        params.from[0].value :
        undefined;
    this.to = params.to ?
        params.to[0].value :
        'english';
};

TranslateIntent.prototype.exec = function(callback) {
    callback('Trying to translate ' + this.phrase + ' to ' + this.to);
};

module.exports = function(params) {
    return new TranslateIntent(params);
};