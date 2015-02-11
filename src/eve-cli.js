var readline = require('readline');
var color = require("ansi-color").set;
var wit = require('node-wit');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync('package.json'));

var args = process.argv.slice(2);

var Reflex = require('./brain/reflex');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

process.stdout.cursorTo(0, 0);
process.stdout.clearScreenDown();

function printFaceLines(line) {
    console.log(color(line, "black+bold+white_bg"));
};

function output(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(color('< ' + msg, "magenta"));
    rl.prompt(true);
}

function send(msg) {
    wit.captureTextIntent(
        'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA',
        msg,
        function(err, res) {
            if (err) output("Error: ", err);
            if (!res) output("Result: ", res);
            Reflex.on(res.outcomes[0], output);
        }
    );
}

if (args[0] !== undefined) {
    wit.captureTextIntent(
        'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA',
        args[0],
        function(err, res) {
            if (err) output("Error: ", err);
            if (!res) output("Result: ", res);
            Reflex.on(res.outcomes[0], function(msg) {
                output(msg);
                process.exit();
            });
        }
    );
} else {
    output('I am online, sir. (v.' + pkg.version + ')');
}

rl.on('line', function(msg) {
    send(msg);
    rl.prompt(true);
});