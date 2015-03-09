Q        = require 'q'
wit      = require './wrappers/wit'
Stimulus = require './stimulus'

class Parser
    constructor: (@Eve) ->
        
    text: (text) ->
        memory = @Eve.memory.remember text
        if memory then return Q.fcall -> memory

        wit.captureText 'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA', text
            .then (outcome) =>
                stimulus = new Stimulus outcome
                @Eve.memory.add text, stimulus
                return stimulus
            .catch (error) =>
                @Eve.logger.debug "Parsing error: \r\n #{error.stack}"

    voice: (voice) ->
        wit.captureVoice 'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA', text
            .then (outcome) ->
                return new Stimulus outcome

module.exports = (Eve) ->
    return new Parser(Eve)