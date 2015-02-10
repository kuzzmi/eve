var readline = require('readline');
var color = require("ansi-color").set;
var wit = require('node-wit');

var Reflex = require('./brain/reflex');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.prompt(true);

function output(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(color(msg, "cyan"));
    rl.prompt(true);
}

function send(msg) {
    wit.captureTextIntent(
        'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA',
        msg,
        function(err, res) {
            if (err) output("Error: ", err);
            if (!res) output("Result: ", res);
            Reflex.on(res.outcomes[0]);
        }
    );
}

rl.on('line', function(msg) {
    send(msg);
    rl.prompt(true);
});