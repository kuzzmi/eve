Q = require 'q'

class Reflex
    constructor: (@stimulus) ->
        
    exec: ->
        deferred = Q.defer()

        try
            Action = require '../../modules/' + @stimulus.intent
        catch e
            console.log e
            deferred.reject e
        
        action = new Action @stimulus.entities

        action
            .exec()
            .then deferred.resolve

        deferred.promise
    
module.export = Reflex