{ EventEmitter } = require 'events'
Utils = require './utils'

class Memory extends EventEmitter

    constructor: (@Eve) ->
        @data = Utils.file2json 'memory.json'

        @data ||= {
            phrases: {}
        }

        setInterval(
            () => Utils.json2file('memory.json', @data),
            5000
        )

    add: (text, stimulus) ->
        @Eve.logger.debug "Added new memory: \"#{text}\":\"#{stimulus}\""
        @data.phrases[text] = stimulus

    remember: (text) ->
        @Eve.logger.debug "Remembering \"#{text}\"..."
        @data.phrases[text]

module.exports = Memory