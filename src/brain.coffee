Io   = require 'socket.io'
Fs   = require 'fs'
Path = require 'path'

class Brain 
    constructor: () ->
        # @memory = new Memory @

        @modules = {}
        @clients = []

        @logger = console

    register: (path) ->
        if Fs.existsSync(path)
            for file in Fs.readdirSync(path).sort()
                @registerModule path, file

    registerModule: (path, file) ->
        ext      = Path.extname file
        basename = Path.basename(file, ext)
        full     = Path.join path, basename
        
        if require.extensions[ext]
            try
                @modules[basename] = require full
            catch error
                @logger.error "Unable to load #{full}: #{error.stack}"

    process: (message, client) ->
        try
            action = new @modules[message] @, client
            
            action.exec()
        catch error
            @logger.log @modules
            @logger.log @modules[message]
            @logger.error "Unable to execute #{message} on #{client}: #{error.stack}"

    reply: (response, client) ->
        if socket?
            socket.emit 'output', response
        else 
            @socket.emit 'output', response

        @logger.log '[output]: ' + JSON.stringify response, null, 4

    onLeave: (socket) ->        
        index = @clients.indexOf socket
        @clients = [].concat(
            @clients.slice(0, index),
            @clients.slice(index + 1)
        )

    run: (port = 3000) ->
        @socket = Io port
        @socket.on 'connection', (socket) =>
            socket.on 'disconnect', @onLeave
            socket.on 'input', (data) =>
                @logger.log data
                @process data, socket

            @clients.push socket
            @reply text: 'Hello', socket

module.exports = Brain