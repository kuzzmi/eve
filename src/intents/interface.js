var util = require('util');

function IntentInterface() {};

IntentInterface.implementOn = function() {
    if (arguments.length < 1) {
        throw new Error('<IIntent>.implementOn called with ' +
            arguments.length + ' arguments, but expected exactly 1.');
    }

    return util.inherits(arguments[0], IntentInterface);
};

IntentInterface.prototype.setVocabulary = function() {
    if (arguments.length !== 1) {
        throw new Error('{IIntent} constructor called with ' +
            arguments.length + ' arguments, but expected exactly 1.');
    }
};

IntentInterface.prototype.toString = function() {
    throw new Error('{IIntent}.toString has to be defined');
};

IntentInterface.prototype.exec = function() {
    if (arguments.length !== 1) {
        throw new Error('{IIntent}.exec called with ' +
            arguments.length + ' arguments, but expected exactly 1.');
    }

    throw new Error('Method exec has to be defined');
};

module.exports = IntentInterface;