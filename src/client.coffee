Socket = require 'socket.io-client'
Log    = require 'log'

class Client
    constructor: (host = '127.0.0.1', port = '3000', debugLevel = 'debug') ->
        @Eve = Socket 'http://' + host + ':' + port
        @Logger = new Log debugLevel

        @Eve.on 'output', (data)   => @receive data
        @Eve.on 'connect',         => @connect(); @run()
        @Eve.on 'reconnecting',    => @reconnecting()
        @Eve.on 'reconnect',       => @reconnect()
        @Eve.on 'reconnect_error', => @failed()
        @Eve.on 'error',           => @failed()
        @Eve.on 'disconnect',      => @stop()
        @start()

    @create: (path, port, debug) ->
        return new @(path, port, debug)

    start: ->
        @Logger.debug 'Connecting...'

    connect: ->
        @Logger.debug 'Connected...'

    stop: ->
        @Logger.debug 'Disconnected...'

    reconnect: ->
        @Logger.debug 'Reconnected...'

    reconnecting: ->
        @Logger.debug 'Reconnecting...'

    failed: ->
        @Logger.debug 'Cannot connect...'

    run: ->

    send: (data) ->
        @Eve.emit 'input', data

    receive: (data) ->
        {
            text
            voice
            notification
        } = data

        @print          text if text
        @say           voice if voice
        @notify notification if notification

    print: (data) ->

    say: (data) ->

    notify: (data) ->
        
module.exports = Client