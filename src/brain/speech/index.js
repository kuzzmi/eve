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

        for (var i = 0; i < types.length; i++) {
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
            checkType(args[i], typesArray[i]);
        };
    };

    var isUndefined = function() {};

    var params = {
        phrase: undefined,
        vocabulary: undefined,
        options: undefined,
        callback: undefined,
    }

    switch (args.length) {
        case 1:
            checkTypes(args, [
                ['String']
            ]);
            params.phrase = args[0];
            break;
        case 2:
            checkTypes(args, [
                ['String'],
                ['Function']
            ]);
            params.phrase = args[0];
            params.callback = args[1];

            break;
        case 3:
            checkTypes(args, [
                ['String'],
                ['String', 'Object'],
                ['Function']
            ]);
            params.phrase = args[0];
            params.vocabulary = args[1];
            params.callback = args[2];

            break;
        case 4:
            checkTypes(args, [
                ['String'],
                ['String', 'Object'],
                ['Object'],
                ['Function']
            ]);
            params.phrase = args[0];
            params.vocabulary = args[1];
            params.options = args[2];
            params.callback = args[3];

            break;
    }

    var promise = Vocabulary
        .pick(params)
        .then(Apparatus.exec);

    if (params.callback) {
        promise.then(params.callback);
    }

    return promise;
};

module.exports = {
    exec: exec
};