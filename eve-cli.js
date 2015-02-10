var readline = require('readline');
var color = require("ansi-color").set;
var wit = require('node-wit');

var Reflex = require('./brain/reflex');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

process.stdout.cursorTo(0, 0);
process.stdout.clearScreenDown();

{
    printFaceLines('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$$$$$$$$$$$$P""*^^$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$$$$$$$*``$P          ""**^^$$$$$$$$$$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$$$$*`    $                  `*^$$$$$$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$P`      d`                      `^$$$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$P`      ,d`                          `T$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$P`     ,sP`                              T$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$P     -*`                                  T$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$P                                            `^$$$$$$$$$$');
    printFaceLines('$$$$$$$$                                                T$$$$$$$$');
    printFaceLines('$$$$$$$                                                   $$$$$$$');
    printFaceLines('$$$$$$;                                                   :$$$$$$');
    printFaceLines('$$$$$;    _.------._                        _.------._     :$$$$$');
    printFaceLines('$$$$$  .*`          `*-.                .-*`          `*.   $$$$$');
    printFaceLines('$$$$$ /    lg+=ggg+.    `.    _.._    .`    .+ggg=+gl    \\  $$$$$');
    printFaceLines('$$$$$:     $;  $$  T$*.   \\,+*""""*+,/   .*$$  T$  :$     ;$$$$$$');
    printFaceLines('$$$$$:     `b  `T$zP`  \\   ;        :   /  `T$zP`  d`     ; $$$$$');
    printFaceLines('$$$$$ \\      *+.       `   ;        :   `       .+*      /  $$$$$');
    printFaceLines('$$$$$  `.                 /          \\                 .`  :$$$$$');
    printFaceLines('$$$$$    `*-._       _.-*`            `*-._       _.-*`    $$$$$$');
    printFaceLines('$$$$$         """""""                      """""""         $$$$$$');
    printFaceLines('$$$$$                                                      $$$$$$');
    printFaceLines('$$$$$$                                                    $$$$$$$');
    printFaceLines('$$$$$$;                                                  :$$$$$$$');
    printFaceLines('$$$$$$$                    ;        :                    $$$$$$$$');
    printFaceLines('$~~~~~$                    `*-.__.-*`                    $$$$$$$$');
    printFaceLines('$~EVE~$b                                    #           d$$$$$$$$');
    printFaceLines('$~CLI~$$b                  _.._   _.._                 d$$$$$$$$$');
    printFaceLines('$~~~~~$$$b               .d$$$$$g$$$$$b.              d$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$b.           .d$$$$$$$$$$$$$$$b.          .d$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$b.          `^$$$$$$$$$$$$$^`         .d$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$b.           "*^$$$$$^*"          .d$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$$$b.                            .d$$$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$$$$$b.                        .d$$$$$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$$$$$$$b.                    .d$$$$$$$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$$$$$$$$$b.                .d$$$$$$$$$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$$$$$$$$$$$$+.          .+$$$$$$$$$$$$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$$$$$$$$$$$$$$$gggggggg$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    printFaceLines('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
}
output('I am online, sir');

function printFaceLines(line) {
    console.log(color(line, "black+bold+white_bg"));
};

function output(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(color(msg, "magenta"));
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

rl.on('line', function(msg) {
    send(msg);
    rl.prompt(true);
});