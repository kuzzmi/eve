Memory     = require './src/memory'
Speech     = require './src/speech'
Stimulus   = require './src/stimulus'
Module     = require './src/module'
Phrasebook = require './src/phrasebook'

Io = require 'socket.io'
Fs = require 'fs'
Path = require 'path'

class Brain 
    constructor: () ->
        # @memory = new Memory @

        @modules = {}
        @sockets = []

        @logger = console

    register: (path) ->
        if Fs.existsSync(path)
            for file in Fs.readdirSync(path).sort()
                @registerModule path, file

        console.log @modules
        process.exit 0

    registerModule: (path, file) ->
        ext      = Path.extname file
        basename = Path.basename(file, ext)
        full     = Path.join path, basename
        
        if require.extensions[ext]
            try
                @modules[basename] = require full
            catch error
                @logger.error "Unable to load #{full}: #{error.stack}"
            

    listen: ->
        @socket.on 'input', @process

    say: (phrase) ->
        @socket.emit 'output', phrase

    run: (port = 3000) ->
        @socket = Io port

module.exports = {
    Brain
    Speech
    Module
    Stimulus
    Phrasebook
}

module.exports.load = ->
    return new Brain()