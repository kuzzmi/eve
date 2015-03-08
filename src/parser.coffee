wit = require './wrappers/wit'
Stimulus = require './stimulus'

class Parser
    constructor: () ->
        
    text: (text) ->
        wit.captureText 'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA', text
            .then (outcome) ->
                return new Stimulus outcome

    voice: (voice) ->
        wit.captureVoice 'OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA', text
            .then (outcome) ->
                return new Stimulus outcome

module.exports = new Parser()