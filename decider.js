var request = require('request');
var Talker = require('./talker')();

var MediaIntent = require('./intents/media');

var say = function(what) {
    Talker.say(what + ', sir');
}

// var apiUrl = 'http://192.168.0.4:3000';

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {

    var json = JSON.parse(data);
    var outcome = json.outcomes[0];

    var reflex = new Reflex(outcome);
    reflex.exec();

});