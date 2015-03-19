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
        @add 'text', text

    addVoice: (voice) ->
        @add 'voice', voice

    addNotification: (notification) ->
        @add 'notification', notification

    addHtml: (html) ->
        @add 'html', html

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
                @body = {}
                @queue = []
        return @

module.exports = Response