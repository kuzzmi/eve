var Reflex = require('./brain/reflex');

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {

    var json = JSON.parse(data);
    var outcome = json.outcomes[0];

    Reflex.on(outcome, console.log);

});