var fs = require('fs');

var vocabDB = JSON.parse(fs.readFileSync(__dirname + '/vocabulary.json'));

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function(phraseCode, args) {
    args = args && args.constructor.name === 'Array' ? args : [args];
    var phrases = eval('vocabDB.' + phraseCode);

    var random = getRandomInt(0, phrases.length - 1);
    var phrase = phrases[random];

    return phrase.replace(/%(\d+)%/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};