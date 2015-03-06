Q          = require 'q'
Utils      = require '../common/utils'
vocabulary = require '../core/classes/vocabulary'

class Module
    constructor: (@Eve, @stimulus, @action) ->

        @entities = @stimulus.entities if @stimulus
 
        @params = {}

        for name, entity of @stimulus.entities
            @params[name] = entity[0] if entity?

    getEntity: (name, def) ->
        console.log 'Using @getEntity is DEPRECATED. Please refer to @params[name]'
        if @entities and @entities[name]
            if (@entities[name].length > 1)
                @entities[name].map (entity) ->
                    entity.value
            else
                @entities[name][0].value 
        else 
            def

    execAndConcat: (results) ->
        deferred = Q.defer()
        __exec__ = Module.prototype.exec

        results  = result.slice(1)

        __exec__(result[0]).then (res) ->
            results.unshift res

            response =
                text         : ''
                voice        : ''
                notification : []

            for i in results
                response.text  += i.text  + '\r\n'
                response.voice += i.voice + '. '

            # TODO: concat notifications

            deferred.resolve response

        deferred.promise
        
    ###
    exec: (result) ->
        @vocabulary = __dirname + '/vocabulary.json'

        deferred = Q.defer()

        deferred.reject 'Result is undefined' if not result

        response =
            text         : undefined
            voice        : undefined
            actions      : undefined
            notification : undefined

        if typeof result is 'string'
            response.text = response.voice = result
            deferred.resolve response

        else if result instanceof Array            
            @execAndConcat(result).then deferred.resolve
                        
        else if typeof result is 'object'
            response.text         = result.text
            response.actions      = result.actions
            response.notification = result.notification

            if result.voice?
                vocabulary.pick result.voice
                    .then (phrase) ->
                        response.voice = phrase
                        response.text ?= phrase

                        deferred.resolve response
            else
                deferred.resolve response

        deferred.promise
    ###
    loadVocabulary: (dir) ->
        @vocabulary = Utils.file2json 'vocabulary.json', dir

    pickPhrase: (code, args) ->
        return vocabulary.pick {
            vocabulary: @vocabulary
            code: code,
            args: args
        }

module.exports = Module