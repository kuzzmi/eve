var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Reflex(stimulus) {
    EventEmitter.call(this);

    this.stimulus = stimulus;
};

util.inherits(Reflex, EventEmitter);

Reflex.prototype.exec = function() {
    var me = this;
    var intent = (function(name, params) {
        try {
            return require('../intents/' + name)(params);
        } catch (e) {
            console.log(e);
            return false;
        }
    })(this.stimulus.intent, this.stimulus.entities);


    if (intent) {
        intent.exec(function(result) {
            me.emit('response', result);
        });
        return true;
    }

    return false;
};

module.exports = Reflex;