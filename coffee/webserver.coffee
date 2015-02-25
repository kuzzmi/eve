app = require('express')();

class WebServer
    constructor: (core, port = 3000) ->
        core.brain.on 'output', (output) ->
            core.speech.exec output.voice

        app.get '/input/:query', (req, res) ->
            core.brain.emit 'input', req.params.query
            res.json
                status: 'ok'
                text: req.params.query

        app.listen(port);

        app


module.exports = WebServer;