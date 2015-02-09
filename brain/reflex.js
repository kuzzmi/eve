var speechApparatus = require('./speechApparatus')();

function Reflex(stimulus) {

    this.intent = stimulus.intent;

};

Reflex.prototype.exec = function() {
    var intent;
    switch (this.intent) {
        case 'tell_time':
            intent = require('../intents/time')();
            speechApparatus.exec('It is ' + intent.exec() + ', sir');
            break;
        case 'reference':
            speechApparatus.exec('Hello to you too, sir');
            break;
        case 'weather_forecast':
            speechApparatus.exec('Please, create an intent for that');
            break;
        default:
            speechApparatus.exec('Sorry, sir, I don\'t understand you yet');
            break;
    }
};

module.exports = Reflex;