var fs = require('fs');

var vocabulary = JSON.parse(fs.readFileSync(__dirname + '/vocabulary.json'));

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function(phraseCode, args) {
    args = args && args.constructor.name === 'Array' ? args : [args];
    var phrases = eval('vocabulary.' + phraseCode);

    var random = getRandomInt(0, phrases.length - 1);
    var phrase = phrases[random];

    var result = 'Phrase not found';

    try {
        result = phrase.replace(/\{(\d+)\}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    } catch (e) {
        console.log(phraseCode, args);
    }

    return result;
};