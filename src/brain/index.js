var EventEmitter = require('events').EventEmitter,
    wit = require('node-wit'),
    util = require('util'),
    fs = require('fs'),
    Q = require('q');

/* Parts of Eve */
var Reflex = require('./reflex'),
    Stimulus = require('./stimulus'),
    Speech = require('./speech');

function Brain() {
    EventEmitter.call(this);

    this.memoryFile = __dirname + '/memory.json';

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

Brain.prototype.remember = function(memory) {
    return memory;
};

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

    var execReflex = function(reflex, stimulus) {
        reflex.exec()
            .then(function(response) {
                me.remember.call(me, {
                    stimulus: stimulus,
                    response: response
                });
                return response;
            })
            .then(Speech.exec)
            .then(function(result) {
                me.emit('processed', result)
                return result;
            })
            .then(deferred.resolve)
            .catch(function(err) {
                console.log(err.stack);
            })
            .done();
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
                        var _stimulus = new Stimulus(res.outcomes[0]),
                            reflex = new Reflex(_stimulus);

                        execReflex(reflex, _stimulus);
                    }
                }
            });
    } else {
        var reflex = new Reflex(stimulus),
            me = this;

        execReflex(reflex, stimulus);
    }


    return deferred.promise;
};

module.exports = new Brain();