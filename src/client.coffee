socket = require 'socket.io-client'

class Client
    constructor: (path = 'http://localhost', port = '3000') ->
        @Eve = socket path + ':' + port
        @Eve.on 'output', (data) => @receive data

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