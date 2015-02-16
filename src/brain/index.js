var EventEmitter = require('events').EventEmitter,
    wit = require('node-wit'),
    util = require('util'),
    Q = require('q');

/* Parts of Eve */
var Reflex = require('./reflex'),
    Stimulus = require('./stimulus'),
    Speech = require('./speech');

function Brain() {
    EventEmitter.call(this);

    var me = this;
    this.on('stimulus', function(stimulus) {
        if (typeof stimulus === 'object') {
            this.process(new Stimulus(stimulus));
        } else {
            this.process(stimulus);
        }
    });
};

util.inherits(Brain, EventEmitter);

Brain.prototype.process = function(stimulus) {
    if (arguments.length !== 1) {
        throw new Error('Brain.process() was called with ' + arguments.length +
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

    var deferred = Q.defer();
    var me = this;

    var resolveReflex = function(reflex) {
        reflex.exec()
            .then(Speech.exec)
            .then(function(result) {
                me.emit('processed', result)
                return result;
            })
            .then(deferred.resolve)
    };

    if (stimulus.constructor.name !== 'Stimulus') {
        wit.captureTextIntent(
            'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA',
            stimulus,
            function(err, res) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (!res) {
                        deferred.reject(new Error('Empty response from WIT'));
                    } else {
                        var stimulus = new Stimulus(res.outcomes[0]),
                            reflex = new Reflex(stimulus);

                        resolveReflex(reflex);
                    }
                }
            });
    } else {
        var reflex = new Reflex(stimulus),
            me = this;

        resolveReflex(reflex);
    }


    return deferred.promise;
};

module.exports = new Brain();