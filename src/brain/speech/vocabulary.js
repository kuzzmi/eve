var fs = require('fs');

function pick(file, phraseObj, callback) {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (!file) throw new Error('Vocabulary file is `undefined`');
    if (!phraseObj) throw new Error('Phrase object is `undefined`');

    if (typeof file === 'string') {
        fs.readFile(file, function(err, data) {
            if (err) {
                throw new Error('Problem while loading a vocabulary.\r\n' + err);
            }

            var vocabulary = JSON.parse(data);
            var splittedCode = phraseObj.code.split('.');
            var args = phraseObj.args;

            var phrases = vocabulary;

            for (var i = 0; i < splittedCode.length; i++) {
                var subcode = splittedCode[i];
                phrases = phrases[subcode];
            };

            var random = getRandomInt(0, phrases.length - 1);
            var phrase = phrases[random];

            result = phrase.replace(/\{(\d+)\}/g, function(match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });

            callback(result);
        });
    }
};

module.exports = pick;