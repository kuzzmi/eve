var EventEmitter = require('events').EventEmitter,
    wit          = require('node-wit'),
    util         = require('util'),
    Q            = require('q');

/* Parts of Eve */
var Reflex   = require('./reflex'),
    Stimulus = require('./stimulus'),
    Speech   = require('./speech');

function Brain() {
    EventEmitter.call(this);
};

util.inherits(Brain, EventEmitter);

Brain.prototype.process = function(input) {
    if (arguments.length !== 1) {
        throw new Error('Brain.process() was called with ' + arguments.length +
            ' arguments, but expected amount is exectly 1.');
    }

    if (input.constructor.name !== 'Stimulus' &&
        input.constructor.name !== 'String') {
        throw new Error('Expected type of argument was {String|Stimulus},' +
            ' but received argument is {' + input.constructor.name + '}.');
    }

    var deferred = Q.defer();

    
    setTimeout(function() {
    var reflex = new Reflex();
        deferred.resolve('Response');
    }, 10);

    return deferred.promise;
};

module.exports = new Brain();