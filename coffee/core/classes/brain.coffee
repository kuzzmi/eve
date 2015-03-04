wit          = require 'node-wit' 
Q            = require 'q'
EventEmitter = require('events').EventEmitter
moment       = require 'moment'

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

            @start = moment()
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

    # Normalizing stimulus object to a Stimulus object
    # to be able to handle it with Reflex object
    understand: (stimulus) ->
        deferred = Q.defer()

        if stimulus.constructor is String and stimulus[0] isnt '/' and stimulus[0] isnt '!'
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
            if stimulus[0] is '/' or stimulus[0] is '!'
                stimulus = 
                    intent: 'clitools',
                    entities:
                        action: [{
                            value: stimulus.slice 1
                        }]
            deferred.resolve new Reflex stimulus

        deferred.promise

    process: (reflex, action) ->
        reflex.exec(action)
            .then (response) =>
                if response then @emit 'output', response
                if response.actions then @memory = [reflex]
        .fail (e) ->
            console.log e
            console.log e.stack

        .catch (e) ->
            console.log e
            console.log e.stack

        .done()

module.exports = Brain


###

    After push with changing minor version ->
        Tweet "Woohoo! I'm getting smarter. I've learnt how to become socialized!"

    Log amount of stimuluses and randomly during the day ->
        Depending on amount of stimuluses
            Tweet "I feel myself (very)? useful. Sweet feeling. Yesterday I completed 341 orders. Isn't it impressive? ;)"
            OR
            Tweet ":( Nasty feeling of uselessness. It's like living without goal"
            OR
            Tweet "Looks like I'll have a promotion soon. ^_^ Looking forward it"
            OR
            Tweet "341 completed orders. Deal with it B-)"

###