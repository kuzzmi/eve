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

    wit.captureTextIntent(
        'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA',
        input,
        function(err, res) {
            if (err) output('Error: ', err);
            if (!res) output('Result: ', res);
            var stimulus = new Stimulus(res.outcomes[0]);
            console.log(require('util').inspect(stimulus, true, 10, true))
            me.emit('stimulus', {
                stimulus: stimulus,
                output: output
            });
        }
    );
};

Brain.prototype.init = function() {
    this.on('stimulus', this.reflex);
    return this;
};

module.exports = new Brain().init();