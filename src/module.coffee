Q          = require 'q'
Utils      = require './utils'
Phrasebook = require './phrasebook'
Response   = require './response'

class Module
    constructor: (@Eve, @client, @stimulus) ->
 
        @response = new Response @Eve, @client
        @params   = {}

        for name, entity of @stimulus.entities when @stimulus
            @params[name] = entity[0]

        # @vocabulary = Utils.file2json 'vocabulary.json', Utils.getCallersDir()

    @exec: (Eve, client, stimulus) ->
        return new @(Eve, client, stimulus).exec()

    # pick: (code, args) ->
    #     code = code.join '.' if code instanceof Array

    #     return vocabulary.pick {
    #         vocabulary: @vocabulary
    #         code: code,
    #         args: args
    #     }

module.exports = Module