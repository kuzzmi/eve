/* Dependencies */
var readline = require('readline'),
    color = require("ansi-color").set,
    fs = require('fs'),
    pkg = JSON.parse(fs.readFileSync('package.json'));

function CLI(brain, argv) {
    argv = argv || {};

    if (!brain) {
        throw new Error('Brain is undefined');
    }

    var me = this;
    this.brain = brain;

    this.brain
        .on('response', function(result) {
            me.output.call(me, result);
        });

    /* Command line arguments */
    this.command = argv.c;
    this.quiteMode = argv.q;

    this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function sendToBrain(msg) {
        me.brain.process(msg);
    }

    if (this.command) {
        this.brain
            .process(this.command)
            .then(this.output);
    } else {
        this.rl.on('line', function(msg) {
            me.brain
                .process(msg)
                .then(me.output);
            me.rl.prompt(true);
        });
    }
};

CLI.prototype.output = function(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(color(msg, "magenta"));
    this.rl.prompt(true);
};

CLI.prototype.init = function() {
    return this;
};

module.exports = CLI;