socket = require 'socket.io-client'

class Client
    constructor: (host = '127.0.0.1', port = '3000') ->
        @Eve = socket 'http://' + host + ':' + port
        @Eve.on 'output', (data) => @receive data
        @Eve.on 'connect', => @run()
        @Eve.on 'disconnect', => @stop()
        @start()

    @create: (path, port) ->
        return new @(path, port)

    start: ->
        console.log 'Connecting...'

    stop: ->
        console.log 'Disconnected...'

    run: ->

    send: (data) ->
        @Eve.emit 'input', data

    receive: (data) ->
        {
            text
            voice
            notification
        } = data

        @print text if text
        @say voice if voice
        @notify notification if notification

    print: (data) ->

    say: (data) ->

    notify: (data) ->
        
module.exports = Client