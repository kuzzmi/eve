var Apparatus = require('./speechApparatus');
var Vocabulary = require('./vocabulary');

function exec() {
    var args = arguments;

    switch (args.length) {
        case 1:
            Apparatus.exec(args[0]);
            break;
        case 2:
        case 3:
        case 4:
            var filenameOrStream = args[0],
                phraseObj = args[1],
                options = args[2],
                callback = args[3],
                phrase;

            if (typeof options === 'function') {
                callback = options;
            }

            Vocabulary(filenameOrStream, phraseObj, function(phrase) {
                Apparatus.exec(phrase, options);
                callback && callback(phrase);
            });

            break;
    }
};

module.exports = {
    exec: exec
};