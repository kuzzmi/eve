Q = require 'q'

class Reflex
    constructor: (@Eve, @stimulus) ->
        
    exec: (action) ->
        deferred = Q.defer()

        try
            IntentModule = require '../../modules/' + @stimulus.intent
        catch e
            console.log e
            deferred.reject e
        
        intentModule = new IntentModule @Eve, @stimulus, action

        intentModule
            .exec()
            .then deferred.resolve

        deferred.promise
    
module.exports = Reflex