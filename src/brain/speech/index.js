var Q = require('q');

var Apparatus = require('./speechApparatus');
var Vocabulary = require('./vocabulary');

function exec() {
    var deferred = Q.defer();

    var args = arguments;

    console.log(arguments)

    if (args.length < 1 || args.length > 4) {
        var er = new Error('Speech.exec() was called with ' + args.length +
            ' arguments, but expected amount is 1..4.');
        deferred.reject(er);
        throw er;
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
            var er = new Error('Expected type of argument was {' +
                types.join('|') + '}, but received argument is {' +
                arg.constructor.name + '}.');
            console.log(er.message);
            deferred.reject(er);
            throw er;
        }
    };

    var checkTypes = function(args, typesArray) {
        for (var i = 0; i < args.length; i++) {
            checkType(args[i], typesArray[i]);
        };
    };

    var isUndefined = function() {};

    var params = {
        code       : undefined,
        args       : undefined,
        phrase     : undefined,
        silent     : undefined,
        options    : undefined,
        callback   : undefined,
        vocabulary : undefined
    }

    switch (args.length) {
        case 1:
            checkTypes(args, [
                ['String', 'Object']
            ]);
            if (typeof args[0] === 'object') {
                params = args[0];
            } else {
                params.phrase = args[0];
            }
            break;
        case 2:
            checkTypes(args, [
                ['String'],
                ['Function']
            ]);
            params.phrase   = args[0];
            params.callback = args[1];

            break;
        case 3:
            checkTypes(args, [
                ['String'],
                ['String', 'Object'],
                ['Function']
            ]);
            params.phrase     = args[0];
            params.vocabulary = args[1];
            params.callback   = args[2];

            break;
        case 4:
            checkTypes(args, [
                ['String'],
                ['String', 'Object'],
                ['Object'],
                ['Function']
            ]);
            params.phrase     = args[0];
            params.vocabulary = args[1];
            params.options    = args[2];
            params.callback   = args[3];

            break;
    }

    Vocabulary
        .pick(params)
        .then(function(phrase) {
            params.callback && params.callback(phrase);
            return phrase;
        })
        .then(function(phrase) {
            if (!params.silent) {
                Apparatus.exec(phrase);
            }

            return phrase;
        })
        .then(deferred.resolve);

    return deferred.promise;
};

module.exports = {
    exec: exec
};