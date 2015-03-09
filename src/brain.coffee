Io     = require 'socket.io'
Fs     = require 'fs'
Path   = require 'path'
Log    = require 'log'
Colors = require 'colors'
Utils  = require './utils'

class Brain 
    constructor: () ->
        # @memory = new Memory @

        @modules = {}
        @parse   = require './parser'
        @clients = []

        @logger = new Log 'debug'

    register: (path) ->
        if Fs.existsSync(path)
            @logger.debug "Registering modules from #{path}"
            for file in Fs.readdirSync(path).sort()
                @registerModule path, file
        else
            @logger.error "#{path} is not a valid path"

    registerModule: (path, file) ->
        ext      = Path.extname file
        basename = Path.basename(file, ext)
        full     = Path.join path, basename
        main     = Path.join full, 'index.coffee'
        
        if require.extensions[ext] or Fs.existsSync(main)
            try
                @modules[basename] = require full
                @logger.debug Utils.appendWith('.', basename, 35) + '[' + 'OK'.green + ']'
            catch error
                @logger.debug Utils.appendWith('.', basename, 32) + '[' + 'ERROR'.red + ']'
                @logger.error "Unable to load #{full}: #{error.stack}"

    process: (message, client) ->
        @logger.debug "Received: #{message}"
        try
            @parse.text message
                .then (stimulus) =>
                    @logger.debug "Parsed to: #{JSON.stringify stimulus}"
                    try
                        action = new @modules[stimulus.intent] @, client, stimulus                        
                        action.exec()
                    catch error
                        @logger.error "Unable to execute #{stimulus.intent}: #{error.stack}"
        catch error
            @logger.error "Error occured while parsing #{message}: #{error.stack}"

    reply: (response, client) ->
        @logger.debug "Sending: #{JSON.stringify response}"

        if client?
            client.emit 'output', response
        else 
            @socket.emit 'output', response

    onDisconnect: (socket) ->
        @logger.debug "Client disconnected from #{socket.client.conn.remoteAddress}"
        
        if not @clients? then return []
            
        index = @clients.indexOf socket
        @clients = [].concat(
            @clients.slice(0, index),
            @clients.slice(index + 1)
        )

    onConnect: (socket) ->
        @logger.debug "Client connected from #{socket.client.conn.remoteAddress}"
        @clients.push socket

        socket.on 'disconnect', => @onDisconnect socket
        socket.on 'input', (data) => @process data, socket

    run: (port = 3000) ->
        @logger.debug "Starting WebSocket listener on :#{port}"
        @socket = Io port
        @socket.on 'connection', (socket) => @onConnect socket

module.exports = Brain