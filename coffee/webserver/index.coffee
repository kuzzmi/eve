app = require('express')()
http = require('http').Server(app)
io = require('socket.io')(http)

class Server
    constructor: (core, port = 3000) ->
        core.brain.on 'output', (output) ->
            # io.emit 'output', output.text
            # core.speech.exec output.voice

        app.get '/', (req, res) ->
            res.sendFile __dirname + '/index.html'

        app.get '/input/:query', (req, res) ->
            core.brain.emit 'input', req.params.query
            res.json
                status: 'ok'
                text: req.params.query

        io.on 'connection', (socket) ->
            socket.on 'input', (msg) ->
                core.brain.emit 'input', msg

        http.listen port

        app

module.exports = Server