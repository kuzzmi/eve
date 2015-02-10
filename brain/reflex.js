var speechApparatus = require('./speechApparatus');

function say(phrase, callback) {
    callback && callback(phrase + ', sir.');
    return speechApparatus.exec(phrase + ', sir.');
}

function getIntent(name, params) {
    try {
        return require('../intents/' + name)(params);
    } catch (e) {
        console.log(e);
        return false;
    }
};

var Reflex = {
    on: function(stimulus, callback) {
        var entities = stimulus.entities || [];
        var intent = getIntent(stimulus.intent, entities);

        if (intent) {
            intent.exec(function(result) {
                say(result, callback);
            });
        } else {
            console.log(stimulus);
            say('Shame on me, I can\'t react on that yet', callback);
        }

        intent = null;
    }
}

module.exports = Reflex;