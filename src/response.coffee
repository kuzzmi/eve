class Response
    constructor: (@Eve, @client) ->
        @body = {}

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
        return @

    addVoice: (voice) ->
        @add 'voice', voice
        return @

    addNotification: (notification) ->
        @add 'notification', notification
        return @

    addResponse: (response) ->
        @Eve.logger.log response

        for key, value of response.body
            @add key, value
        return @

    send: ->
        if @Eve
            @Eve.reply @body, @client

module.exports = Response