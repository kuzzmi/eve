var speechApparatus = require('./speechApparatus')();

function Reflex(stimulus) {

    this.intent = stimulus.intent;
    this.entities = stimulus.entities || [];

};

function say(what) {
    return speechApparatus.exec(what + ', sir.');
}

Reflex.prototype.exec = function() {
    var getIntent = function(name, params) {
        return require('../intents/' + name)(params);
    };
    var intent;
    switch (this.intent) {
        case 'tell_time':
            intent = getIntent('time', this.entities);
            intent.exec(say);
            break;
        case 'reference':
            say('Hello to you too');
            break;
        case 'weather_forecast':
            intent = getIntent('weather', this.entities);
            intent.exec(say);
            break;
        default:
            say('Sorry, sir, I don\'t understand you yet');
            break;
    }
};

module.exports = Reflex;