var EventEmitter = require('events').EventEmitter;
var wit = require('node-wit');
var util = require('util');

/* Parts of Eve */
var Reflex = require('./reflex');
var Stimulus = require('./stimulus');
var SpeechApparatus = require('./speechApparatus');

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

    switch (input.constructor.name) {

        case 'String':
            wit.captureTextIntent(
                'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA',
                input,
                function(err, res) {
                    if (err) output('Error: ', err);
                    if (!res) {
                        output('Result: ', res);
                    } else {
                        var stimulus = new Stimulus(res.outcomes[0]);

                        me.emit('stimulus', {
                            stimulus: stimulus,
                            output: output
                        });
                    }
                }
            );
            break;

        case 'Stimulus':
            me.emit('stimulus', {
                stimulus: input,
                output: output
            });
            break;
    }
};

Brain.prototype.init = function() {
    this.on('stimulus', this.reflex);
    return this;
};

module.exports = new Brain().init();