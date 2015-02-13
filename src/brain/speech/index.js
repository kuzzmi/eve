var Apparatus = require('./speechApparatus');
var Vocabulary = require('./vocabulary');

function exec() {
    var args = arguments;

    if (args.length < 1 || args.length > 4) {
        throw new Error('Speech.exec() was called with ' + args.length +
            ' arguments, but expected amount is 1..4.');
    }

    var checkType = function(arg, types) {
        var matched = false;

        // console.log(arg);

        for (var i = 0; i < types.length; i++) {
            // console.log(arg.constructor.name + ' === ' + types[i])
            // console.log(arg.constructor.name === types[i])
            if (arg.constructor.name === types[i]) {
                matched = true;
                break;
            }
        };

        if (!matched) {
            throw new Error('Expected type of argument was {' +
                types.join('|') + '}, but received argument is {' +
                arg.constructor.name + '}.');
        }
    };

    var checkTypes = function(args, typesArray) {
        for (var i = 0; i < args.length; i++) {

            // console.log('Checking: ' + args[i] + ' to be ' + typesArray[i]);

            checkType(args[i], typesArray[i]);
        };
    };

    var isUndefined = function() {};


    switch (args.length) {
        case 1:
            checkTypes(args, [
                ['String']
            ]);
            break;
        case 2:
            checkTypes(args, [
                ['String'],
                ['Function']
            ]);
            break;
        case 3:
            checkTypes(args, [
                ['String'],
                ['String', 'Object'],
                ['Function']
            ]);
            break;
        case 4:
            checkTypes(args, [
                ['String'],
                ['String', 'Object'],
                ['Object'],
                ['Function']
            ]);
            break;
    }

    /*
    
    Apparatus.exec(args[0]);
checkType(args[0], ['String']);
            checkType(args[1], ['String']);
            if (args[1].constructor.name !== 'Function') {
                throw new Error('Expected type of argument was {Function}`, but ' +
                    'received argument is {' + args[0].constructor.name + '}.')
            }
            Apparatus.exec(args[0], args[1]);
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

     */
};

module.exports = {
    exec: exec
};