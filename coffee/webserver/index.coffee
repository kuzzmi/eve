app     = require('express')()
http    = require('http').Server(app)
io      = require('socket.io')(http)
ATH     = require('ansi-to-html')
request = require 'request'

class Server
    constructor: (core, port = 3000) ->
        converter = new ATH()

        core.brain.on 'output', (output) =>
            io.emit 'output', converter.toHtml output.text.replace(/ /g, '&nbsp;')
            # core.speech.exec output.voice
            if output.notification
                @sendNotification output.notification

        app.get '/', (req, res) ->
            res.sendFile __dirname + '/index.html'

        app.get '/input/:query', (req, res) ->
            core.brain.emit 'input', req.params.query
            io.emit 'output', req.params.query
            res.json
                status: 'ok'
                text: req.params.query

        io.on 'connection', (socket) ->
            socket.on 'input', (msg) ->
                io.emit 'output', msg
                core.brain.emit 'input', msg

        http.listen port

        app

    sendNotification: (notification) ->

        ### PLACE THIS INTO CONFIGURATION FILE ###
        url = 'https://autoremotejoaomgcd.appspot.com/sendmessage?key=APA91bEKsjjhcwsd8hLTBBN0Oi80gLJWKWS5cIGqovFWmHnOWlbpb0AO30fglqOoXwUxMbOBXnYTGVVZ7GqnFIvdU_51yZt7CSZTXWkWcSq_ZPSQSPyxGsfKb0MZ_TmVt7lvVtX18ffvU0GETncF1a_h5AH-eMWRsVmYSoPRTEwY2kbsr8metcU&message='
        
        if notification.list
            command = 'eve_resp_list'
            message = notification.list.join(',') + '=:=' + command

            request url + message

        if notification.text
            command = 'eve_resp_text'
            message = notification.text + '=:=' + command
            
            request url + message

module.exports = Server