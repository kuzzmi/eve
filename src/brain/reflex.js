var speechApparatus = require('./speechApparatus');

function say(phrase, callback, lang, quiteMode) {
    callback && callback(phrase + ', sir.');
    if (!quiteMode) {
        return speechApparatus.exec(phrase + ', sir.', lang);
    }
    return;
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
    on: function(stimulus, callback, quiteMode) {
        var entities = stimulus.entities || [];
        var intent = getIntent(stimulus.intent, entities);

        if (intent) {
            intent.exec(function(result, lang) {
                say(result, callback, lang, quiteMode);
            });
        } else {
            console.log(stimulus);
            say('Shame on me, I can\'t react on that yet', callback);
        }

        intent = null;
    }
}

module.exports = Reflex;