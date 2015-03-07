class Response
    constructor: (@Eve, @client) ->
        @answer = {}

    add: (name, value) ->        
        exists = yes if @answer[name]?

        if not exists
            @answer.text = []

        if value instanceof Array
            @answer[name] = @answer[name].concat text
        else
            @answer[name].push text

    addText: (text) ->
        @add 'text', text

    addVoice: (voice) ->
        @add 'voice', voice

    addNotification: (notification) ->
        @add 'notification', notification

    send: ->
        @Eve.reply @answer, @client

module.exports = Response