Q          = require 'q'
wit        = require './wrappers/wit'
Stimulus   = require './stimulus'
HttpClient = require 'scoped-http-client'

class Parser
    constructor: (@Eve) ->
        @listeners = []
        
    addListener: (regexp, callback) ->
        @listeners.push { regexp, callback }

    text: (text, client) ->
        for listener in @listeners
            if listener.regexp.test text
                listener.callback {
                    match : text.match(listener.regexp)
                    reply : (text) => @Eve.reply { text: text, voice: text }, client
                    send  : (text) => @Eve.reply { text: text, voice: text }, client
                    http  : (url, options) -> 
                        HttpClient.create(url, options)
                            .header('User-Agent', 'Eve')
                }
                return Q.fcall -> null

        memory = @Eve.memory.remember text
        if memory then return Q.fcall -> memory

        wit.captureText 'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA', text
            .then (outcome) =>
                stimulus = new Stimulus outcome
                if stimulus.intent isnt 'UNKNOWN' and stimulus.entities.datetime is undefined
                    @Eve.memory.add text, stimulus
                return stimulus
            .catch (error) =>
                @Eve.logger.debug "Parsing error: \r\n #{error.stack}"

    voice: (voice, client) ->
        wit.captureVoice 'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA', text
            .then (outcome) ->
                return new Stimulus outcome

module.exports = (Eve) ->
    return new Parser(Eve)