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
        @on 'input', (stimulus) =>
            if @memory and @memory.length > 0
                reflex = @memory.pop()
                @process reflex, stimulus
                return

            @understand stimulus
                .then (reflex) =>
                    @process reflex
                .fail (e) ->
                    console.log e
                    console.log e.stack
                .catch (e) ->
                    console.log e
                    console.log e.stack
                .done()

    understand: (stimulus) ->
        deferred = Q.defer()

        if stimulus.constructor is String
            wit.captureTextIntent 'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA', stimulus, (err, res) ->
                if err
                    deferred.reject err
                else if not res
                    deferred.reject new Error 'Empty response'
                else if res.outcomes is undefined
                    deferred.reject new Error 'Empty outcomes array'
                else
                    deferred.resolve new Reflex new Stimulus res.outcomes[0]

        else
            deferred.resolve new Reflex stimulus

        deferred.promise

    process: (reflex, action) ->
        reflex.exec(action)
            .then (response) =>
                if response 
                    @emit 'output', response

                if (response.actions)
                    @memory = [reflex]

                response
        .fail (e) ->
            console.log e
            console.log e.stack
        .catch (e) ->
            console.log e
            console.log e.stack
        .done()
        

module.exports = Brain