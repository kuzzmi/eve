{ EventEmitter } = require 'events'

class Memory extends EventEmitter

    constructor: (@Eve) ->
        @data = {}

    add: (text, stimulus) ->
        @Eve.logger.debug "Added new memory: \"#{text}\":\"#{stimulus}\""
        @data[text] = stimulus

    remember: (text) ->
        @Eve.logger.debug "Remembering \"#{text}\"..."
        @data[text]

module.exports = Memory