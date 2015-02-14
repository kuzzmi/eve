var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    Q = require('q'),
    Stimulus = require('./stimulus');

function Reflex(stimulus) {
    if (arguments.length !== 1) {
        throw new Error('Reflex.constructor() was called with ' + arguments.length +
            ' arguments, but expected amount is exectly 1.');
    }

    if (stimulus === undefined) {
        throw new Error('Expected type of argument was {String|Stimulus},' +
            ' but received argument is {undefined}.');
    }

    if (stimulus.constructor.name !== 'Stimulus' &&
        stimulus.constructor.name !== 'String') {
        throw new Error('Expected type of argument was {String|Stimulus},' +
            ' but received argument is {' + stimulus.constructor.name + '}.');
    }

    EventEmitter.call(this);

    this.stimulus = stimulus.constructor.name !== 'Stimulus' ?
        new Stimulus(stimulus) : stimulus;
};

util.inherits(Reflex, EventEmitter);

Reflex.prototype.exec = function() {
    var deferred = Q.defer(),
        me = this,
        er;

    var Intent;

    try {
        Intent = require('../intents/' + this.stimulus.intent);
    } catch (e) {
        er = new Error(
            'Intent module "' + this.stimulus.intent + '" could not be loaded'
        );
        deferred.reject(er);
        throw er;
    }

    var intent = new Intent(this.stimulus.entities);
    var intentPromise = intent.exec();

    if (!intentPromise.then) {
        er = new Error('#exec() of intent module is not a {Promise}');
        deferred.reject(er);
        throw er;
    }

    intentPromise
        .then(function(result) {
            deferred.resolve(result);
        });

    return deferred.promise;
};

module.exports = Reflex;