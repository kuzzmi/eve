// var googleTranslate = require('google-translate')(apiKey);

function TranslateIntent(params) {
    this.phrase = params.phrase_to_translate ?
        params.phrase_to_translate[0].value :
        undefined;
    this.from = params.from ?
        params.from[0].value :
        'english';
    this.to = params.to ?
        params.to[0].value :
        'english';
};

TranslateIntent.prototype.exec = function(callback) {
    var getLangCode = function(value) {
        switch (value) {
            case 'french':
                return 'fr-FR';
            case 'russian':
                return 'ru-RU';
            case 'english':
            default:
                return 'en-US';
        }
    }
    var from = getLangCode(this.from);
    var to = getLangCode(this.to);

    console.log(from, to);

    callback(this.phrase, getLangCode(this.from));
};

module.exports = function(params) {
    return new TranslateIntent(params);
};