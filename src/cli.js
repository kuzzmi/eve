/* Dependencies */
var readline = require('readline'),
    color = require("ansi-color").set,
    fs = require('fs'),
    CronJob = require('cron').CronJob,
    pkg = JSON.parse(fs.readFileSync('package.json'));

function CLI(brain, argv) {
    argv = argv || {};

    if (!brain) {
        throw new Error('Brain is undefined');
    }

    var me = this;
    this.brain = brain;

    this.brain
        .on('processed', function(data) {
            me.output.call(me, data);
        });

    /* Command line arguments */
    this.command = argv.c;
    this.quiteMode = argv.q;

    this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    this.rl.setPrompt('Igor: ');

    function sendToBrain(msg) {
        me.brain.process(msg);
    }

    if (this.command) {
        this.brain
            .process(this.command)
            .then(function() {
                process.exit();
            });
    } else {
        this.rl.on('line', function(msg) {
            me.brain
                .process(msg);
            me.rl.prompt(true);
        });
    };

    new CronJob('00 00 * * * *', function() {
        me.brain.emit('stimulus', {
            intent: 'time'
        });
    }, null, true);

    this.rl.prompt(true);
};

CLI.prototype.output = function(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(color(' Eve: ' + msg, "magenta"));
    this.rl.prompt(true);
};

module.exports = CLI;