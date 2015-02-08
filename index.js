var wit = require('node-wit');
var fs = require('fs');
var ACCESS_TOKEN = "OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA";

var stream = fs.createReadStream('hey_yeva.wav');
wit.captureSpeechIntent(ACCESS_TOKEN, stream, "audio/wav", function(err, res) {
    console.log("Response from Wit for audio stream: ");
    if (err) console.log("Error: ", err);
    console.log(JSON.stringify(res, null, " "));
});