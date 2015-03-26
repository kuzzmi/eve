Socket = require 'socket.io-client'
Log    = require 'log'

class Client
    constructor: (host = '127.0.0.1', port = '3000', logLevel = 'info', type = 'unknown') ->
        @Eve = Socket 'http://' + host + ':' + port
        @Logger = new Log logLevel

        @Eve.on 'output', (data)   => @receive data
        @Eve.on 'connect',         => @connect(); @run(); @register(type)
        @Eve.on 'reconnecting',    => @reconnecting()
        @Eve.on 'reconnect',       => @reconnect()
        @Eve.on 'reconnect_error', => @failed()
        @Eve.on 'error',           => @failed()
        @Eve.on 'disconnect',      => @stop()
        @start()

    @create: (path, port, debug, type) ->
        return new @(path, port, debug, type)

    register: (client) ->
        @Eve.emit 'register', client

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

    receive: (@data) ->
        {
            text
            voice
            notification
            html
        } = @data

        @print          text if text
        @show           html if html
        @say           voice if voice
        @notify notification if notification

    print: (data) ->

    show: (data) ->

    say: (data) ->

    notify: (data) ->
        
module.exports = Client