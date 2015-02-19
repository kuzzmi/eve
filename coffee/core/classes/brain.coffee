wit          = require 'node-wit' 
Q            = require 'q'
EventEmitter = require('events').EventEmitter

### EVE PARTS ###
Stimulus     = require '../models/stimulus'
Reflex       = require './reflex'

class Brain extends EventEmitter
    memoryFile: __dirname + '/memory.json'

    constructor: (@params) ->
        @subscribe()

    subscribe: ->
        @on 'input', (stimulus) ->
            if stimulus instanceof Object
                @process new Stimulus stimulus
            else
                @process stimulus

    understand: (stimulus) ->
        deferred = Q.defer()

        if stimulus.constructor is String
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
            .then (response) =>
                if response then @emit 'output', response

                response

            .fail (e) ->
                console.log e.stack
            .catch (e) ->
                console.log e.stack
            .done()

module.exports = Brain