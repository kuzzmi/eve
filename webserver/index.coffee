app     = require('express')()
http    = require('http').Server(app)
io      = require('socket.io')(http)
ATH     = require('ansi-to-html')
request = require 'request'

{ Speech, Client } = require '../eve'

class WebServer extends Client
    run: ->
        @converter = new ATH()

        # core.brain.on 'output', (output) =>
        #     core.speech.exec output.voice
        #     if output.notification
        #         @sendNotification output.notification

        # app.get '/', (req, res) ->
        #     res.sendFile __dirname + '/index.html'

        app.get '/input/:query', (req, res) =>
            @send req.params.query, res

        # io.on 'connection', (socket) ->
        #     socket.on 'input', (msg) ->
        #         io.emit 'output', msg
        #         core.brain.emit 'input', msg

        http.listen 3030

        app

    send: (data, res) ->
        super data
        res.json
            status: 'ok'
            text: data

    print: (data) ->
        if data
            io.emit 'output', @converter.toHtml data.join('. ').replace(/ /g, '&nbsp;')

    say: (phrase) ->
        if phrase
            phrase = phrase.join '. ' if phrase instanceof Array
            Speech.exec phrase

    notify: (notification) ->
        url = 'https://autoremotejoaomgcd.appspot.com/sendmessage?key=APA91bEKsjjhcwsd8hLTBBN0Oi80gLJWKWS5cIGqovFWmHnOWlbpb0AO30fglqOoXwUxMbOBXnYTGVVZ7GqnFIvdU_51yZt7CSZTXWkWcSq_ZPSQSPyxGsfKb0MZ_TmVt7lvVtX18ffvU0GETncF1a_h5AH-eMWRsVmYSoPRTEwY2kbsr8metcU&message='
        
        if notification instanceof Array
            command = 'eve_resp_list'
            message = notification.join(',') + '=:=' + command
        else 
            command = 'eve_resp_text'
            message = notification.join('. ') + '=:=' + command

        request url + message
    # sendNotification: (notification) ->

    #     ### PLACE THIS INTO CONFIGURATION FILE ###
    #     url = 'https://autoremotejoaomgcd.appspot.com/sendmessage?key=APA91bEKsjjhcwsd8hLTBBN0Oi80gLJWKWS5cIGqovFWmHnOWlbpb0AO30fglqOoXwUxMbOBXnYTGVVZ7GqnFIvdU_51yZt7CSZTXWkWcSq_ZPSQSPyxGsfKb0MZ_TmVt7lvVtX18ffvU0GETncF1a_h5AH-eMWRsVmYSoPRTEwY2kbsr8metcU&message='
        
    #     if notification.list
    #         command = 'eve_resp_list'
    #         message = notification.list.join(',') + '=:=' + command

    #         request url + message

    #     if notification.text
    #         command = 'eve_resp_text'
    #         message = notification.text + '=:=' + command
            
    #         request url + message

WebServer.create()