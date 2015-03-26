app       = require('express')()
http      = require('http').Server(app)
io        = require('socket.io')(http)
Converter = require('ansi-to-html')
request   = require 'request'
argv      = require('minimist')(process.argv.slice(2))

{ Speech, Client, Config } = require '..'

class WebServer extends Client
    run: ->
        @converter = new Converter()

        app.get '/', (req, res) ->
            res.sendFile __dirname + '/index.html'

        app.get '/input/:query', (req, res) =>
            @send req.params.query, res

        io.on 'connection', (socket) =>
            socket.on 'input', (msg) =>
                @send msg

        http.listen 3030

        app

    send: (data, res) ->
        super data
        if res
            res.json
                status: 'ok'
                text: data

    print: (data) ->
        if @data.html then return

        data = data.join '. ' if data instanceof Array

        if data
            io.emit 'output', @converter.toHtml data.replace(/ /g, '&nbsp;')

    show: (data) ->
        io.emit 'output', data[0]

    say: (phrase) ->
        if phrase and not silent
            phrase = phrase.join '. ' if phrase instanceof Array
            Speech.exec phrase

    notify: (notification) ->
        url = Config.autoremote.lgg2
        
        @Logger.debug notification

        if notification instanceof Array and notification.length > 1
            command = 'eve_resp_list'
            message = notification.join(',') + '=:=' + command
        else 
            command = 'eve_resp_text'
            message = notification.join('. ') + '=:=' + command

        request url + message

host      = argv.h || argv.host
port      = argv.p || argv.port
verbosity = if argv.v then 'debug'
silent    = argv.s || argv.silent

WebServer.create(null, null, verbosity, 'web')