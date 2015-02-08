var child = require('child_process');

var say = function(what) {
    child.spawn('./send_and_play.sh', [what + ', sir']);
}

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {

    var json = JSON.parse(data);
    var outcome = json.outcomes[0];

    console.log(outcome);

    if (outcome) {
        switch (outcome.intent) {
            case 'reference':
                say(outcome.entities.greeting_phrase[0].value);
                break;
            case 'weather_forecast':
                say('I cannot predict weather yet');
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
                            return minutes + ' to ' + (hours + 1);
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