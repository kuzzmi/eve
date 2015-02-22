var fs = require('fs');
var Q = require('q');

function pick(params) {
    var deferred = Q.defer();

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (!params.vocabulary && !params.phrase) {
        var er = new Error('Vocabulary file is `undefined`');
        throw er;
    }

    if (!params.code && !params.phrase) {
        var er = new Error('Phrase code is `undefined`');
        throw er;
    }

    if (params.phrase && params.lang) {
        deferred.resolve({phrase: params.phrase, lang: params.lang});
    } else if (params.phrase) {
        deferred.resolve(params.phrase);
    } else if (typeof params.vocabulary === 'string') {
        fs.readFile(params.vocabulary, function(err, data) {
            if (err) {
                var er = new Error('Problem while loading a vocabulary.\r\n' + err);
                throw er;
            }

            var vocabulary = JSON.parse(data);
            var splittedCode = params.code.split('.');
            var args = params.args;

            var phrases = vocabulary;

            for (var i = 0; i < splittedCode.length; i++) {
                var subcode = splittedCode[i];
                phrases = phrases[subcode];
            };

            var random = getRandomInt(0, phrases.length - 1);
            var phrase = phrases[random];

            result = phrase.replace(/\{(\d+)\}/g, function(match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });

            deferred.resolve(result);
        });
    }

    return deferred.promise;
};

module.exports = {
    pick: pick
};