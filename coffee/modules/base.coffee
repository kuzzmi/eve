q = require 'q'
vocabulary = require '../core/classes/vocabulary'

class BaseModule
    constructor: (@stimulus, @action) ->
        @entities = @stimulus.entities
        @vocabulary = null

    getEntity: (name, def) ->
        if @entities and @entities[name]
            if (@entities[name].length > 1)
                @entities[name].map (entity) ->
                    entity.value
            else
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

        if typeof result is 'string'
            response.text = response.voice = result
            deferred.resolve response

        if typeof result is 'object'
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

        if result is undefined
            deferred.reject 'Result is undefined'

        deferred.promise

module.exports = BaseModule