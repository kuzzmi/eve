var child = require('child_process');
var request = require('request');

var MediaIntent = require('./intents/media');

var say = function(what) {
    child.spawn('./send_and_play.sh', [what + ', sir']);
}

var apiUrl = 'http://192.168.0.4:3000';

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {

    var json = JSON.parse(data);
    var outcome = json.outcomes[0];

    console.log(data);

    if (outcome) {
        switch (outcome.intent) {
            case 'reference':
                say(outcome.entities.greeting_phrase[0].value);
                break;
            case 'weather_forecast':
                request(apiUrl + '/weather', function(req, resp) {
                    var data = resp.body.split(':');
                    say('It is ' + data[0] + ' outside and ' + data[1]);
                });

                break;
            case 'media':
                var intent = new MediaIntent(outcome, apiUrl);
                intent.exec(function(data) {
                    say(data);
                });
                break;
            case 'tell_time':

                var getTimeForSpeech = function() {
                    var date = new Date();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();

                    if (minutes > 0) {
                        if (minutes < 30) {
                            return minutes + ' minutes past ' + hours;
                        } else {
                            return (60 - minutes) + ' to ' + (hours + 1);
                        }
                    } else {
                        return hours + ' hours';
                    }

                }

                say('It is ' + getTimeForSpeech());
                break;
            default:
                say('I did not get you');
                break;
        }
    }

});