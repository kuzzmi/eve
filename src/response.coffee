class Response
    constructor: (@Eve, @client) ->
        @body = {}

    add: (name, value) ->        
        exists = yes if @body[name]?

        if not exists
            @body[name] = []

        if value instanceof Array
            @body[name] = @body[name].concat value
        else
            @body[name].push value

        return @

    addText: (text) ->
        @add 'text', text
        return @

    addVoice: (voice) ->
        @add 'voice', voice
        return @

    addNotification: (notification) ->
        @add 'notification', notification
        return @

    send: ->
        @Eve.reply @body, @client

module.exports = Response