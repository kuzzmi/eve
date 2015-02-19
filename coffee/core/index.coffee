wit          = require 'node-wit' 
Q            = require 'q'
EventEmitter = require('events').EventEmitter

### EVE PARTS ###
Stimulus     = require './models/stimulus'
Reflex       = require './classes/reflex'

class Brain extends EventEmitter
    memoryFile: __dirname + '/memory.json'

    constructor: (@params) ->
        @subscribe()

    subscribe: ->
        @on 'stimulus', (stimulus) ->
            if stimulus instanceof Object
                @process new Stimulus stimulus
            else
                @process stimulus

        @on 'output.voice', console.log 

    understand: (stimulus) ->
        deferred = Q.defer()

        if stimulus.constructor is not Stimulus
            wit.captureTextIntent 'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA', stimulus, (err, res) ->
                if err
                    deferred.reject err

                if not res
                    deferred.reject new Error 'Empty response'

                deferred.resolve new Reflex new Stimulus res.outcomes[0]

        else
            deferred.resolve new Reflex stimulus

        deferred.promise

    process: (stimulus) ->
        @understand stimulus
            .then (reflex) ->
                reflex.exec()
            .then (response) ->
                if response.text then @emit 'output.text', response.text
                if response.voice then @emit 'output.voice', response.voice

                response

            .fail console.log
            .catch console.log
            .done()

module.export = Brain