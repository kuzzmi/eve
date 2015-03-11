Io           = require 'socket.io'
Fs           = require 'fs'
Path         = require 'path'
Log          = require 'log'
Colors       = require 'colors'
Utils        = require './utils'
Memory       = require './memory'
HubotWrapper = require './hubotwrapper'

class Brain 
    constructor: (@name = 'Eve') ->
        @memory = new Memory @

        @modules = {}
        @parser  = require('./parser') @
        @clients = []

        @logger = new Log 'debug'

    register: (path) ->
        if Fs.existsSync(path)
            @modulesPath = path
            @logger.debug "Registering modules from #{path}"
            for file in Fs.readdirSync(path).sort()
                @registerModule path, file
        else
            @logger.error "#{path} is not a valid path"

    registerModule: (path, file) ->
        ext       = Path.extname file
        basename  = Path.basename(file, ext)
        full      = Path.join path, basename
        main      = Path.join full, 'index.coffee'
        blacklist = [
            'package.json'
        ]

        if ext isnt '.json' and require.extensions[ext] or Fs.existsSync(main)
            try
                module = require full

                if module.prototype.constructor.name.indexOf('Module') is -1
                    @logger.warning Utils.appendWith('.', basename, 25) + '[' + 'NOT NATIVE'.yellow + ']'
                    @registerHubotScript module

                else 
                    @modules[basename] = module
                    @logger.debug Utils.appendWith('.', basename, 35) + '[' + 'OK'.green + ']'
            catch error
                @logger.debug Utils.appendWith('.', basename, 32) + '[' + 'ERROR'.red + ']'
                @logger.error "Unable to load #{full}: #{error.stack}"

    registerHubotScript: (module) ->
        HubotWrapper.wrap module, @

    process: (message, client) ->
        if not message
            return false

        @logger.debug "Received: #{message}"
        try
            if @memory.data.waitForAction
                memory = @memory.data.waitForAction
                metadata = {
                    metadata: memory.metadata,
                    message
                }
                action = new @modules[memory.name] @, client, null, metadata
                action.exec()
                delete @memory.data.waitForAction
            else
                @parser.text message, client
                    .then (stimulus) =>
                        if stimulus
                            @logger.debug "Parsed to: #{JSON.stringify stimulus}"
                            try
                                action = new @modules[stimulus.intent] @, client, stimulus
                                action.exec()
                            catch error
                                @logger.error "Unable to execute #{stimulus.intent}: #{error.stack}"
                                @reply { text: "Sorry, could not undestartand #{message}" }, client
        catch error
            @logger.error "Error occured while parsing #{message}: #{error.stack}"

    waitForAction: (module) ->
        @memory.set 'waitForAction', {
            name     : module.stimulus.intent
            metadata : module.metadata
        }

    reply: (response, client, global) ->
        @logger.debug "Sending: #{JSON.stringify response}"

        receiver = if client? and not global then client else @socket

        receiver.emit 'output', response

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