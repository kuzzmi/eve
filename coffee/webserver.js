var express = require('express');

function WebServer(core, port) {
    core.brain.on('output', function (output) {
        core.speech.exec(output.voice)
    });

    var app = express();

    port = port || 3000;

    app.get('/input/:query', function(req, res){
        core.brain.emit('input', req.params.query)
        res.json({
            status: 'ok',
            text: req.params.query
        });
    });

    app.listen(port);

    return app;
};

module.exports = WebServer;