Q = require 'q'

class Response
    constructor: (@Eve, @client) ->
        @body = {}
        @queue = []

    add: (name, value) ->        
        exists = yes if @body[name]

        if not exists
            @body[name] = []

        if value instanceof Array
            @body[name] = @body[name].concat value
        else
            @body[name].push value

        return @

    addText: (text) ->
        return @add 'text', text

    addVoice: (voice) ->
        return @add 'voice', voice

    addNotification: (notification) ->
        return @add 'notification', notification

    addResponse: (response) ->
        if response.then
            promise = response
                .then (result) =>
                    @addResponse result
            @queue.push promise
        else 
            for key, value of response.body
                @add key, value
        return @

    send: ->
        Q.all @queue
            .then =>
                @Eve.reply @body, @client if @Eve
        return @

module.exports = Response