q = require 'q'
vocabulary = require '../core/classes/vocabulary'

class BaseModule
    @pickPhrase: vocabulary.pick

    constructor: (@stimulus, @action) ->
        @entities = @stimulus.entities
        @vocabulary = null

    getEntity: (name, def) ->
        if @entities and @entities[name] 
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

        if result.constructor is String
            response.text = response.voice = result
            deferred.resolve response

        if result.constructor is Object
            if (result.voice)
                vocabulary.pick result.voice
                    .then (phrase) ->
                        response.voice = phrase
                        response.text = result.text
                        if !response.text
                            response.text = phrase
                        response.actions = result.actions
                        deferred.resolve response
            else
                response.text = result.text
                response.actions = result.actions
                deferred.resolve response

        deferred.promise

module.exports = BaseModule