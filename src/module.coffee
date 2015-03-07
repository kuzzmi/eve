Q          = require 'q'
Utils      = require './utils'
Phrasebook = require './phrasebook'

class Module
    constructor: (@Eve, @stimulus, @action) ->
 
        @params = {}

        for name, entity of @stimulus.entities when @stimulus
            @params[name] = entity[0]

        dir = Utils.getCallersDir()
        @vocabulary = Utils.file2json 'vocabulary.json', dir

    @exec: (Eve, stimulus) ->
        return new @(Eve, stimulus).exec()

    pick: (code, args) ->
        code = code.join '.' if code instanceof Array

        return vocabulary.pick {
            vocabulary: @vocabulary
            code: code,
            args: args
        }

module.exports = Module