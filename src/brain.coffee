Io   = require 'socket.io'
Fs   = require 'fs'
Path = require 'path'

class Brain 
    constructor: () ->
        # @memory = new Memory @

        @modules = {}
        @parse   = require './parser'
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
        main     = Path.join full, 'index.coffee'
        
        if require.extensions[ext] or Fs.existsSync(main)
            try
                @modules[basename] = require full
                @logger.log "Module #{basename} registered"
            catch error
                @logger.error "Unable to load #{full}: #{error.stack}"

    process: (message, client) ->
        try
            @parse.text message
                .then (stimulus) =>
                    try
                        action = new @modules[stimulus.intent] @, client, stimulus                        
                        action.exec()
                    catch error
                        @logger.error "Unable to execute #{stimulus.intent}: #{error.stack}"
        catch error
            @logger.error "Unable to handle #{message}: #{error.stack}"

    reply: (response, client) ->
        if client?
            client.emit 'output', response
        else 
            @socket.emit 'output', response

    onLeave: (socket) ->
        if not @clients?
            return []
            
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
                @process data, socket

            @clients.push socket
            @reply text: 'Hello', socket

module.exports = Brain