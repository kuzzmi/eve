Brain  = require './brain'
Speech = require './speech'
Module = require './module'

io = require 'socket.io'

class Eve 
    constructor: () ->
        @brain = new Brain @

        @socket = io 3000

        @subscribe()

    subscribe: () ->
        @socket.on 'connection', ->
            @.emit 'output',
                text: 'Hello!'

    say: (phrase) ->
        @socket.emit 'output'


module.exports = {
    Eve
    Speech
    Module
}

module.exports.run = ->
    return new Eve()