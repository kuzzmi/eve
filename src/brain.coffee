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

    process: (message) ->
        @output message

    reply: (response, socket) ->
        if socket?
            socket.emit 'output', response
        else 
            @socket.emit 'output', response

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
            socket.on 'input'

            @clients.push socket
            @reply text: 'Hello', socket

            console.log @clients.length

module.exports = Brain