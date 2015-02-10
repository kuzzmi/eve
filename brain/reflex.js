var speechApparatus = require('./speechApparatus');

function say(phrase) {
    return speechApparatus.exec(phrase + ', sir.');
}

function getIntent(name, params) {
    try {
        return require('../intents/' + name)(params);
    } catch (e) {
        return false;
    }
};

var Reflex = {
    on: function(stimulus) {
        var entities = stimulus.entities || [];
        var intent = getIntent(stimulus.intent, entities);

        if (intent) {
            intent.exec(say);
        } else {
            say('Shame on me, I can\'t react on that yet');
        }

        intent = null;
    }
}

module.exports = Reflex;