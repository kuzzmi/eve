/* Dependencies */
var readline = require('readline'),
    color = require("ansi-color").set,
    fs = require('fs'),
    pkg = JSON.parse(fs.readFileSync('package.json'));

function CLI(argv, brain) {
    var me = this;
    this.brain = brain;
    /* Command line arguments */
    this.command = argv.c;
    this.quiteMode = argv.q;

    this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function sendToBrain(msg) {
        var me = this;
        me.brain.process(msg, function(result) {
            me.output(result);
        });
    }


    if (this.command) {
        sendToBrain(this.command);
    } else {
        this.rl.on('line', function(msg) {
            sendToBrain.call(me, msg);
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
    this.output(pkg.version);
};

module.exports = CLI;