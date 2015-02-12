var EventEmitter = require('events').EventEmitter;
var wit = require('node-wit');
var util = require('util');

/* Parts of Eve */
var Reflex = require('./reflex');
var Stimulus = require('./stimulus');
var Speech = require('./speech');

function Brain() {
    EventEmitter.call(this);
};

util.inherits(Brain, EventEmitter);

Brain.prototype.reflex = function(params) {
    return new Reflex(params.stimulus)
        .on('response', params.output)
        .exec();
};

Brain.prototype.process = function(input, output) {
    var me = this;

    function emit(input) {
        me.emit('stimulus', {
            stimulus: input,
            output: function(result) {
                if (result.vocabulary) {
                    Speech.exec(result.vocabulary, result, function(phrase) {
                        output(phrase);
                    });
                }
            }
        });
    };

    switch (input.constructor.name) {

        case 'String':
            wit.captureTextIntent(
                'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA',
                input,
                function(err, res) {
                    if (err) {
                        throw new Error('Error: ', err);
                    }

                    if (!res) {
                        throw new Error('Result: ', res);
                    } else {
                        var stimulus = new Stimulus(res.outcomes[0]);
                        emit(stimulus);
                    }
                }
            );
            break;

        case 'Stimulus':
            emit(input);
            break;
    }
};

Brain.prototype.init = function() {
    this.on('stimulus', this.reflex);
    return this;
};

module.exports = new Brain().init();