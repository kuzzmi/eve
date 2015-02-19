q = require 'q'
vocabulary = require '../core/classes/vocabulary'

class BaseModule
    @pickPhrase: vocabulary.pick

    constructor: (@stimulus) ->
        @entities = @stimulus.entities

    getEntity: (name, def) ->
        if @entities[name] 
            @entities[name][0].value 
        else 
            def

    exec: (result) ->
        deferred = q.defer()

        response = {
            text: undefined,
            voice: undefined,
            actions: undefined
        }

        console.log result

        if result.constructor is String
            response.text = response.voice = result

        deferred.resolve response
        deferred.promise

module.exports = BaseModule