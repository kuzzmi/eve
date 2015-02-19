var express = require('express');

function WebServer(brain, port) {
    var app = express();
    port = port || 1337;

    app.get('/:freetext', function(req, res){
        brain.process(req.params.freetext)
            .then(function(text) {
                res.json({
                    status: 'ok',
                    text: text
                });
            });
    });

    app.listen(port);

    return app;
};

module.exports = WebServer;