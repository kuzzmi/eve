Q = require 'q'
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
        deferred = Q.defer()

        EXEC = BaseModule.prototype.exec

        response = {
            text: undefined,
            voice: undefined,
            actions: undefined,
            notification: undefined
        }

        if typeof result is 'string'
            response.text = response.voice = result
            deferred.resolve response

        else if typeof result is 'object'

            if result instanceof Array
                results = result.slice(1)
                EXEC result[0]
                    .then (res) ->
                        results.unshift res
                    .then ->
                        response.text = ''
                        response.voice = ''
                        response.notification = []
                        for i in results
                            response.text += i.text + '\r\n'
                            response.voice += i.voice + '. '
                            response.notification = response.notification.concat i.notification
                        deferred.resolve response
                        
            else
                if (result.voice)
                    vocabulary.pick result.voice
                        .then (phrase) ->
                            response.voice = phrase
                            response.text = result.text
                            response.actions = result.actions
                            response.notification = result.notification
                            if !response.text
                                response.text = phrase
                            deferred.resolve response
                else
                    deferred.resolve response
                    response.text = result.text
                    response.actions = result.actions
                    response.notification = result.notification

        if result is undefined
            deferred.reject 'Result is undefined'

        deferred.promise

module.exports = BaseModule